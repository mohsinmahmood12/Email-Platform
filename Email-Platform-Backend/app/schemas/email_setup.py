# app/schemas/email_setup.py
from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr
from app.models.email_setup import EmailSetupStatus, DNSPropagationStatus
#===============================================================================================================================================================================================================================================
class EmailSetup(BaseModel):
    domain_name: str
    email_address: EmailStr
#===============================================================================================================================================================================================================================================
class EmailSetupResponse(BaseModel):
    id: int
    domain_name: str
    email_address: EmailStr
    entri_config: Dict[str, Any]
    status: EmailSetupStatus
    last_status: str
    propagation_status: DNSPropagationStatus
    dkim_status: Optional[str] = None
    spf_status: Optional[str] = None
    dmarc_status: Optional[str] = None
    setup_type: Optional[str] = None
    dns_records: Optional[Dict[str, Any]] = None
    entri_session_id: Optional[str] = None

    class Config:
        orm_mode = True
#===============================================================================================================================================================================================================================================
class EntriWebhookData(BaseModel):
    domain: str
    success: bool
    setupType: str
    provider: Optional[str]
    lastStatus: str
    sessionId: Optional[str] = None
    propagationStatus: Optional[str] = None
    dkimStatus: Optional[str] = None
    spfStatus: Optional[str] = None
    dmarcStatus: Optional[str] = None
    dnsRecords: Optional[Dict[str, Any]] = None
#===============================================================================================================================================================================================================================================