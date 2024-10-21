# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class SubscriptionType(str, enum.Enum):
    FREE = "free"
    PAID = "paid"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    primary_email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    subscription_type = Column(Enum(SubscriptionType), default=SubscriptionType.FREE)
    activation_code = Column(String, nullable=True)
    subscription_start_date = Column(DateTime, nullable=True)
    subscription_end_date = Column(DateTime, nullable=True)
    trial_end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

    tenant = relationship("Tenant", back_populates="users")
    email_setups = relationship("EmailSetup", back_populates="user")
    templates = relationship("Template", back_populates="user")
    emails = relationship("Email", back_populates="user")