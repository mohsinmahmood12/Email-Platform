from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.email import Email, EmailFolder
from app.models.user import User
from datetime import datetime, timedelta

def get_email_statistics(db: Session, user: User, start_date: datetime, end_date: datetime):
    sent_count = db.query(func.count(Email.id)).filter(
        Email.user_id == user.id,
        Email.folder == EmailFolder.SENT,
        Email.created_at.between(start_date, end_date)
    ).scalar()

    received_count = db.query(func.count(Email.id)).filter(
        Email.user_id == user.id,
        Email.folder == EmailFolder.INBOX,
        Email.created_at.between(start_date, end_date)
    ).scalar()

    return {
        "sent_count": sent_count,
        "received_count": received_count,
        "total_count": sent_count + received_count
    }

def get_email_activity(db: Session, user: User, days: int = 30):
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    activity = db.query(
        func.date_trunc('day', Email.created_at).label('date'),
        func.count(Email.id).label('count')
    ).filter(
        Email.user_id == user.id,
        Email.created_at.between(start_date, end_date)
    ).group_by(func.date_trunc('day', Email.created_at)).all()

    return [{"date": str(item.date), "count": item.count} for item in activity]