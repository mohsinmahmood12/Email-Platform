# app/api/v1/endpoints/email_setup.py
import logging
from typing import List
from app.api import deps
from app.models.user import User
from sqlalchemy.orm import Session
from app.services import entri_service
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.email_setup import EmailSetup, EmailSetupResponse, EntriWebhookData
from app.models.email_setup import EmailSetup as EmailSetupModel, EmailSetupStatus, DNSPropagationStatus
#===============================================================================================================================================================================================================================================
logger = logging.getLogger(__name__)
#===============================================================================================================================================================================================================================================
router = APIRouter()
#===============================================================================================================================================================================================================================================
@router.post("/setup", response_model=EmailSetupResponse)
async def setup_email(
    email_setup: EmailSetup,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    logger.info(f"Setting up email for user {current_user.id}")
    
    # Check if the email is already set up for the user
    existing_setup = db.query(EmailSetupModel).filter(
        EmailSetupModel.user_id == current_user.id,
        EmailSetupModel.email_address == email_setup.email_address
    ).first()
    if existing_setup:
        logger.warning(f"User {current_user.id} already has an email setup for {email_setup.email_address}")
        raise HTTPException(status_code=400, detail="Email is already set up for this user")

    try:
        # Get Entri configuration
        callback_url = f"http://35.172.141.151:8000/api/v1/email-setup/entri-callback"
        entri_config = entri_service.get_entri_config(
            domain=email_setup.domain_name,
            email=email_setup.email_address,
            callback_url=callback_url
        )
    except Exception as e:
        logger.error(f"Failed to get Entri configuration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get Entri configuration: {str(e)}")

    # Create and save the email setup
    db_email_setup = EmailSetupModel(
        user_id=current_user.id,
        domain_name=email_setup.domain_name,
        email_address=email_setup.email_address,
        status=EmailSetupStatus.PENDING,
        last_status="Awaiting Entri verification",
        propagation_status=DNSPropagationStatus.PENDING,
        dkim_status="pending",
        spf_status="pending",
        dmarc_status="pending",
        setup_type="pending",
        dns_records={}
    )
    db.add(db_email_setup)
    db.commit()
    db.refresh(db_email_setup)

    logger.info(f"Email setup created for user {current_user.id}")

    return EmailSetupResponse(
        id=db_email_setup.id,
        domain_name=db_email_setup.domain_name,
        email_address=db_email_setup.email_address,
        entri_config=entri_config,
        status=db_email_setup.status,
        last_status=db_email_setup.last_status,
        propagation_status=db_email_setup.propagation_status,
        dkim_status=db_email_setup.dkim_status,
        spf_status=db_email_setup.spf_status,
        dmarc_status=db_email_setup.dmarc_status,
        setup_type=db_email_setup.setup_type,
        dns_records=db_email_setup.dns_records,
        entri_session_id=db_email_setup.entri_session_id
    )
#===============================================================================================================================================================================================================================================
@router.post("/entri-callback")
async def entri_callback(data: EntriWebhookData, db: Session = Depends(deps.get_db)):
    logger.info(f"Received Entri callback: {data}")
    email_setup = db.query(EmailSetupModel).filter(EmailSetupModel.domain_name == data.domain).first()
    if not email_setup:
        logger.warning(f"Email setup not found for domain: {data.domain}")
        raise HTTPException(status_code=404, detail="Email setup not found")

    email_setup.status = EmailSetupStatus.COMPLETED if data.success else EmailSetupStatus.FAILED
    email_setup.last_status = data.lastStatus
    email_setup.setup_type = data.setupType

    if data.sessionId:
        email_setup.entri_session_id = data.sessionId
    if data.propagationStatus:
        email_setup.propagation_status = data.propagationStatus
    if data.dkimStatus:
        email_setup.dkim_status = data.dkimStatus
    if data.spfStatus:
        email_setup.spf_status = data.spfStatus
    if data.dmarcStatus:
        email_setup.dmarc_status = data.dmarcStatus
    if data.dnsRecords:
        email_setup.dns_records = data.dnsRecords

    db.commit()
    logger.info(f"Updated email setup status for domain: {data.domain}")

    return {"status": "success", "message": "Callback processed"}           
#===============================================================================================================================================================================================================================================
@router.get("/status/{email_setup_id}", response_model=EmailSetupResponse)
async def get_email_setup_status(
    email_setup_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    email_setup = db.query(EmailSetupModel).filter(
        EmailSetupModel.id == email_setup_id,
        EmailSetupModel.user_id == current_user.id
    ).first()
    if not email_setup:
        raise HTTPException(status_code=404, detail="Email setup not found")

    entri_config = entri_service.get_entri_config(domain=email_setup.domain_name,email=email_setup.email_address,callback_url="http://35.172.141.151:8000/api/v1/email-setup/entri-callback")

    return EmailSetupResponse(
        id=email_setup.id,
        domain_name=email_setup.domain_name,
        email_address=email_setup.email_address,
        entri_config=entri_config,
        status=email_setup.status,
        last_status=email_setup.last_status,
        propagation_status=email_setup.propagation_status,
        dkim_status=email_setup.dkim_status,
        spf_status=email_setup.spf_status,
        dmarc_status=email_setup.dmarc_status,
        setup_type=email_setup.setup_type,
        dns_records=email_setup.dns_records,
        entri_session_id=email_setup.entri_session_id
    )
#===============================================================================================================================================================================================================================================
@router.get("/list", response_model=List[EmailSetupResponse])
async def list_email_setups(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    email_setups = db.query(EmailSetupModel).filter(EmailSetupModel.user_id == current_user.id).all()
    return [
        EmailSetupResponse(
            id=setup.id,
            domain_name=setup.domain_name,
            email_address=setup.email_address,
            entri_config={}, 
            status=setup.status,
            last_status=setup.last_status,
            propagation_status=setup.propagation_status,
            dkim_status=setup.dkim_status,
            spf_status=setup.spf_status,
            dmarc_status=setup.dmarc_status,
            setup_type=setup.setup_type,
            dns_records=setup.dns_records,
            entri_session_id=setup.entri_session_id
        ) for setup in email_setups
    ]
#===============================================================================================================================================================================================================================================
@router.delete("/{email_setup_id}", status_code=204)
async def delete_email_setup(
    email_setup_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    email_setup = db.query(EmailSetupModel).filter(
        EmailSetupModel.id == email_setup_id,
        EmailSetupModel.user_id == current_user.id
    ).first()
    if not email_setup:
        raise HTTPException(status_code=404, detail="Email setup not found")
    
    db.delete(email_setup)
    db.commit()
#===============================================================================================================================================================================================================================================
