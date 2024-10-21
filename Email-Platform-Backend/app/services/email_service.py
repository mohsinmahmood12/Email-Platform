import jwt
import time
import logging
import smtplib
import requests
import sib_api_v3_sdk
from sqlalchemy import or_
from datetime import datetime
from app.models.user import User
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.email import Email
from app.core.config import settings
from email.mime.text import MIMEText
from app.models.email import EmailFolder
from app.models.attachment import Attachment
from sib_api_v3_sdk.rest import ApiException
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from email.mime.application import MIMEApplication
from app.schemas.email import EmailCreate, EmailUpdate
from app.models.email_setup import EmailSetup, EmailSetupStatus
#===============================================================================================================================================================================================================================================
logger = logging.getLogger(__name__)
env = Environment(loader=FileSystemLoader('app/templates'))
# Configure Brevo API client
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = settings.BREVO_API_KEY
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
#===============================================================================================================================================================================================================================================
def generate_entri_jwt():
    payload = {
        "iss": settings.ENTRI_APPLICATION_ID,
        "exp": int(time.time()) + 3600  # Token expires in 1 hour
    }
    return jwt.encode(payload, settings.ENTRI_SECRET_KEY, algorithm="HS256")
#===============================================================================================================================================================================================================================================
def initiate_entri_connect(domain: str, email: str):
    jwt_token = generate_entri_jwt()
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "applicationId": settings.ENTRI_APPLICATION_ID,
        "Content-Type": "application/json"
    }
    payload = {
        "domain": domain,
        "email": email,
        "webhookUrl": settings.ENTRI_WEBHOOK_URL,
        "power": True,  # Enable custom domain powering
        "secure": True  # Enable SSL provisioning
    }
    response = requests.post(f"{settings.ENTRI_API_URL}/sharing/connect", headers=headers, json=payload)
    logging.info(f"Initiate Entri Connect response: {response.json()}")
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to initiate Entri Connect")
    return response.json()
#===============================================================================================================================================================================================================================================
def create_email_setup(db: Session, user: User, domain: str, email: str):
    entri_response = initiate_entri_connect(domain, email)
    db_email_setup = EmailSetup(
        user_id=user.id,
        domain_name=domain,
        email_address=email,
        entri_session_id=entri_response.get('id'),
        status=EmailSetupStatus.PENDING
    )
    db.add(db_email_setup)
    db.commit()
    db.refresh(db_email_setup)
    return db_email_setup, entri_response.get('url')
#===============================================================================================================================================================================================================================================
def update_email_setup_status(db: Session, entri_session_id: str, status: str, last_status: str):
    email_setup = db.query(EmailSetup).filter(EmailSetup.entri_session_id == entri_session_id).first()
    if not email_setup:
        raise HTTPException(status_code=404, detail="Email setup not found")
    
    email_setup.status = EmailSetupStatus[status.upper()]
    email_setup.last_status = last_status
    db.commit()
    return email_setup
#===============================================================================================================================================================================================================================================
def get_email_setup(db: Session, user: User):
    return db.query(EmailSetup).filter(EmailSetup.user_id == user.id).first()
#===============================================================================================================================================================================================================================================
def send_password_reset_email(email: str, token: str):
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    html_content = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Click the link below to reset your password:</p>
            <p><a href="{reset_url}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """

    try:
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email}],
            html_content=html_content,
            sender={"name": "Your App Name", "email": settings.MAIL_FROM},
            subject="Password Reset Request"
        )
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Password reset email sent successfully. Brevo API response: {api_response}")
    except ApiException as e:
        logger.error(f"Exception when sending password reset email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send password reset email")
#===============================================================================================================================================================================================================================================
def get_unread_count(db: Session, user: User) -> int:
    return db.query(Email).filter(Email.user_id == user.id, Email.is_read == False, Email.folder == EmailFolder.INBOX).count()
#===============================================================================================================================================================================================================================================
def get_emails_by_folder(db: Session, user: User, folder: EmailFolder, skip: int = 0, limit: int = 100):
    return db.query(Email).filter(
        Email.user_id == user.id,
        Email.folder == folder
    ).order_by(Email.created_at.desc()).offset(skip).limit(limit).all()
#===============================================================================================================================================================================================================================================
def get_email(db: Session, email_id: int, user: User, folder: Optional[EmailFolder] = None) -> Email:
    query = db.query(Email).filter(Email.id == email_id, Email.user_id == user.id)
    if folder:
        query = query.filter(Email.folder == folder.value)
    email = query.first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email
#===============================================================================================================================================================================================================================================
def create_draft(db: Session, draft: EmailCreate, user: User) -> Email:
    db_email = Email(
        user_id=user.id,
        from_email=user.email,
        to_email=draft.to_email,
        subject=draft.subject,
        body=draft.body,
        folder=EmailFolder.DRAFTS.value,
        is_read=True,
        is_sent=False
    )
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    return db_email
#===============================================================================================================================================================================================================================================
def update_draft(db: Session, draft_id: int, draft_update: EmailUpdate, user: User) -> Email:
    draft = get_email(db, draft_id, user, EmailFolder.DRAFTS)
    for field, value in draft_update.dict(exclude_unset=True).items():
        setattr(draft, field, value)
    db.commit()
    db.refresh(draft)
    return draft
#===============================================================================================================================================================================================================================================
def delete_draft(db: Session, draft_id: int, user: User) -> Email:
    draft = get_email(db, draft_id, user, EmailFolder.DRAFTS)
    db.delete(draft)
    db.commit()
    return draft
#===============================================================================================================================================================================================================================================
def send_email(db: Session, email: EmailCreate, user: User) -> Email:
    try:
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email.to_email}],
            html_content=email.body,
            sender={"name": user.first_name, "email": user.primary_email},
            subject=email.subject
        )
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Email sent successfully. Brevo API response: {api_response}")

        db_email = Email(
            user_id=user.id,
            from_email=user.primary_email,
            to_email=email.to_email,
            subject=email.subject,
            body=email.body,
            folder=EmailFolder.SENT.value,
            is_read=True,
            is_sent=True
        )
        db.add(db_email)
        db.commit()
        db.refresh(db_email)
        return db_email
    except ApiException as e:
        logger.error(f"Exception when calling Brevo API: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")
#===============================================================================================================================================================================================================================================
def send_email_with_attachment(db: Session, email: EmailCreate, user: User, filename: str, content: bytes) -> Email:
    try:
        attachment = sib_api_v3_sdk.Attachment(
            content=content,
            name=filename
        )
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email.to_email}],
            html_content=email.body,
            sender={"name": user.full_name, "email": user.email},
            subject=email.subject,
            attachment=[attachment]
        )
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Email with attachment sent successfully. Brevo API response: {api_response}")

        db_email = Email(
            user_id=user.id,
            from_email=user.email,
            to_email=email.to_email,
            subject=email.subject,
            body=email.body,
            folder=EmailFolder.SENT.value,
            is_read=True,
            is_sent=True
        )
        db.add(db_email)
        db.commit()
        db.refresh(db_email)

        db_attachment = Attachment(
            email_id=db_email.id,
            filename=filename,
            content=content
        )
        db.add(db_attachment)
        db.commit()

        return db_email
    except ApiException as e:
        logger.error(f"Exception when calling Brevo API: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email with attachment")
#===============================================================================================================================================================================================================================================
def archive_email(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    email.is_archived = True
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def delete_email(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    email.folder = EmailFolder.TRASH.value
    email.deleted_at = datetime.utcnow()
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def mark_as_unread(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    email.is_read = False
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def mark_as_read(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    email.is_read = True
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def search_emails(db: Session, user: User, query: str, folder: Optional[EmailFolder] = None, skip: int = 0, limit: int = 100) -> List[Email]:
    search_query = db.query(Email).filter(Email.user_id == user.id)
    if folder:
        search_query = search_query.filter(Email.folder == folder.value)
    search_query = search_query.filter(
        or_(
            Email.subject.ilike(f"%{query}%"),
            Email.body.ilike(f"%{query}%"),
            Email.from_email.ilike(f"%{query}%"),
            Email.to_email.ilike(f"%{query}%")
        )
    )
    return search_query.order_by(Email.created_at.desc()).offset(skip).limit(limit).all()
#===============================================================================================================================================================================================================================================
def move_to_trash(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    email.folder = EmailFolder.TRASH.value
    email.deleted_at = datetime.utcnow()
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def restore_from_trash(db: Session, email_id: int, user: User) -> Email:
    email = get_email(db, email_id, user)
    if email.folder != EmailFolder.TRASH.value:
        raise HTTPException(status_code=400, detail="Email is not in trash")
    email.folder = EmailFolder.INBOX.value
    email.deleted_at = None
    db.commit()
    db.refresh(email)
    return email
#===============================================================================================================================================================================================================================================
def forward_email(db: Session, email_id: int, forward_to: str, user: User) -> Email:
    original_email = get_email(db, email_id, user)
    forward_body = f"---------- Forwarded message ---------<br>" \
                   f"From: {original_email.from_email}<br>" \
                   f"Date: {original_email.created_at}<br>" \
                   f"Subject: {original_email.subject}<br>" \
                   f"To: {original_email.to_email}<br><br>" \
                   f"{original_email.body}"

    forward_email = EmailCreate(
        to_email=forward_to,
        subject=f"Fwd: {original_email.subject}",
        body=forward_body
    )
    return send_email(db, forward_email, user)
#===============================================================================================================================================================================================================================================
def reply_to_email(db: Session, email_id: int, reply_body: str, user: User) -> Email:
    original_email = get_email(db, email_id, user)
    reply_subject = f"Re: {original_email.subject}" if not original_email.subject.startswith("Re:") else original_email.subject
    reply_body = f"{reply_body}<br><br>On {original_email.created_at}, {original_email.from_email} wrote:<br>{original_email.body}"

    reply_email = EmailCreate(
        to_email=original_email.from_email,
        subject=reply_subject,
        body=reply_body
    )
    return send_email(db, reply_email, user)
#===============================================================================================================================================================================================================================================