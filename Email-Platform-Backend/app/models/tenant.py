# app/models/tenant.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    domain = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)

    users = relationship("User", back_populates="tenant")
    white_label = relationship("WhiteLabel", back_populates="tenant", uselist=False)
