# app/models/email_setup.py
from sqlalchemy import Column, Integer, String, Enum, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum

class EmailSetupStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class DNSPropagationStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILURE = "failure"

class EmailSetup(Base):
    __tablename__ = "email_setups"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    domain_name = Column(String, index=True)
    email_address = Column(String, unique=True, index=True)
    entri_session_id = Column(String, unique=True, index=True)
    status = Column(Enum(EmailSetupStatus), default=EmailSetupStatus.PENDING)
    last_status = Column(String)
    propagation_status = Column(Enum(DNSPropagationStatus), default=DNSPropagationStatus.PENDING)
    dkim_status = Column(String)
    spf_status = Column(String)
    dmarc_status = Column(String)
    setup_type = Column(String)
    dns_records = Column(JSON)
    
    user = relationship("User", back_populates="email_setups")
    tenant = relationship("Tenant")
    emails = relationship("Email", back_populates="email_setup")