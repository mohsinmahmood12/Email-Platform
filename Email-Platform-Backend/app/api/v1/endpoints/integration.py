from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.services import email_service
from app.core.security import create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/token")
def create_integration_token(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    access_token_expires = timedelta(days=30)  # Token valid for 30 days
    access_token = create_access_token(
        data={"sub": current_user.username, "integration": True},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/emails")
def get_emails_for_integration(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.get_emails_by_folder(db, current_user, None, skip, limit)

@router.post("/send-email")
def send_email_for_integration(
    email: email_service.EmailCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return email_service.send_email(db, email, current_user)