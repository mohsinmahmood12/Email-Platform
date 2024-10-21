from app.db.base import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.schemas.email import EmailFolder
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum as SQLAlchemyEnum, Index



class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    email_setup_id = Column(Integer, ForeignKey("email_setups.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    from_email = Column(String, index=True)
    to_email = Column(String, index=True)
    subject = Column(String)
    body = Column(Text)
    is_read = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    folder = Column(SQLAlchemyEnum(EmailFolder), default=EmailFolder.INBOX)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    search_vector = Column(TSVECTOR)

    user = relationship("User", back_populates="emails")
    tenant = relationship("Tenant")
    email_setup = relationship("EmailSetup", back_populates="emails")
    attachments = relationship("Attachment", back_populates="email")

    __table_args__ = (
        Index(
            'ix_emails_search_vector',
            'search_vector',
            postgresql_using='gin'
        ),
    )

    def update_search_vector(self):
        self.search_vector = func.to_tsvector('english', func.coalesce(self.subject, '') + ' ' + func.coalesce(self.body, ''))