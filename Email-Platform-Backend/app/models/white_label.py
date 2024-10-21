# app/models/white_label.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class WhiteLabel(Base):
    __tablename__ = "white_labels"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), unique=True)
    logo_url = Column(String)
    primary_color = Column(String)
    secondary_color = Column(String)
    # Add other relevant fields

    tenant = relationship("Tenant", back_populates="white_label")