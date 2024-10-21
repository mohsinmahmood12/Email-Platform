from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.services import analytics_service
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/statistics")
def get_email_statistics(
    start_date: datetime = None,
    end_date: datetime = None,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()

    return analytics_service.get_email_statistics(db, current_user, start_date, end_date)

@router.get("/activity")
def get_email_activity(
    days: int = 30,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return analytics_service.get_email_activity(db, current_user, days)