import logging
from app.api import deps
from app.models.user import User
from typing import List, Optional
from sqlalchemy.orm import Session
from app.services import email_service
from fastapi import File, UploadFile, Form
from app.models.email_setup import EmailSetup
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from app.schemas.email import (EmailFolder, EmailCreate, EmailUpdate, EmailOut, EmailWithAttachments, EmailForward, EmailReply)
#===============================================================================================================================================================================================================================================
logger = logging.getLogger(__name__)
#===============================================================================================================================================================================================================================================
router = APIRouter()
#===============================================================================================================================================================================================================================================
@router.get("/unread", response_model=dict)
def get_unread_count(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return {"unread_count": email_service.get_unread_count(db, current_user)}
#===============================================================================================================================================================================================================================================
@router.get("/inbox", response_model=List[EmailOut])
def get_inbox(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    archived: bool = False,
    unread: bool = False,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    logger.info(f"Getting inbox for user {current_user.id}")
    custom_email = db.query(EmailSetup).filter(EmailSetup.user_id == current_user.id).first()
    if not custom_email:
        logger.error(f"No custom email found for user {current_user.id}")
        raise HTTPException(status_code=400, detail="No custom email set up for this user")
    
    logger.info(f"Custom email for user {current_user.id}: {custom_email.email_address}")
    emails = email_service.get_emails_by_folder(
        db, 
        current_user, 
        EmailFolder.INBOX, 
        skip=skip, 
        limit=limit, 
    )
    logger.info(f"Found {len(emails)} emails for user {current_user.id}")
    return emails
#===============================================================================================================================================================================================================================================
@router.get("/drafts", response_model=List[EmailOut])
async def get_drafts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    logger.info(f"Accessing /drafts route. Skip: {skip}, Limit: {limit}")
    try:
        drafts = email_service.get_emails_by_folder(db, current_user, EmailFolder.DRAFTS, skip, limit)
        logger.info(f"Retrieved {len(drafts)} drafts")
        return drafts
    except Exception as e:
        logger.error(f"Error in get_drafts: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#===============================================================================================================================================================================================================================================
@router.get("/drafts/{draft_id}", response_model=EmailOut)
def get_draft(
    draft_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_email(db, draft_id, current_user, EmailFolder.DRAFTS)
#===============================================================================================================================================================================================================================================
@router.post("/drafts", response_model=EmailOut)
def create_draft(
    draft: EmailCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.create_draft(db, draft, current_user)
#===============================================================================================================================================================================================================================================
@router.put("/drafts/{draft_id}", response_model=EmailOut)
def update_draft(
    draft_id: int,
    draft_update: EmailUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.update_draft(db, draft_id, draft_update, current_user)
#===============================================================================================================================================================================================================================================
@router.delete("/drafts/{draft_id}")
def delete_draft(
    draft_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.delete_draft(db, draft_id, current_user)
#===============================================================================================================================================================================================================================================
@router.get("/{email_id}", response_model=EmailWithAttachments)
def get_email(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_email(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/archive")
def archive_email(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.archive_email(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/delete")
def delete_email(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.delete_email(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/mark-as-unread")
def mark_as_unread(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.mark_as_unread(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/mark-as-read")
def mark_as_read(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.mark_as_read(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.get("/sent", response_model=List[EmailOut])
def get_sent_emails(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_emails_by_folder(db, current_user, EmailFolder.SENT, skip, limit)
#===============================================================================================================================================================================================================================================
@router.get("/sent/{email_id}", response_model=EmailOut)
def get_sent_email(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_email(db, email_id, current_user, EmailFolder.SENT)
#===============================================================================================================================================================================================================================================
@router.post("/sent/{email_id}/delete")
def delete_sent_email(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.delete_email(db, email_id, current_user, EmailFolder.SENT)
#===============================================================================================================================================================================================================================================
@router.get("/search", response_model=List[EmailOut])
def search_emails(
    query: str,
    folder: Optional[EmailFolder] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.search_emails(db, current_user, query, folder, skip, limit)
#===============================================================================================================================================================================================================================================
@router.post("/move-to-trash/{email_id}")
def move_email_to_trash(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.move_to_trash(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/restore-from-trash/{email_id}")
def restore_email_from_trash(
    email_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.restore_from_trash(db, email_id, current_user)
#===============================================================================================================================================================================================================================================
@router.get("/folder/{folder}", response_model=List[EmailOut])
def get_emails_in_folder(
    folder: EmailFolder,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_emails_by_folder(db, current_user, folder, skip, limit)
#===============================================================================================================================================================================================================================================
@router.post("/send")
async def send_email(
    to_email: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    email_data = EmailCreate(
        to_email=to_email,
        subject=subject,
        body=body
    )
    return email_service.send_email(db, email_data, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/send-with-attachment")
def send_email_with_attachment(
    email: EmailCreate,
    attachment: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    attachment_content = attachment.file.read()
    return email_service.send_email_with_attachment(db, email, current_user, attachment.filename, attachment_content)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/forward")
def forward_email(
    email_id: int,
    forward_data: EmailForward,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.forward_email(db, email_id, forward_data.to_email, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/{email_id}/reply")
def reply_to_email(
    email_id: int,
    reply_data: EmailReply,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.reply_to_email(db, email_id, reply_data.body, current_user)
#===============================================================================================================================================================================================================================================
