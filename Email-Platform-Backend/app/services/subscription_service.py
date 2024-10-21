from sqlalchemy.orm import Session
from app.core.config import settings
from datetime import datetime, timedelta
from app.models.user import User, SubscriptionType
from app.schemas.subscription import SubscriptionStatus
#===============================================================================================================================================================================================================================================
def start_free_trial(user: User, db: Session):
    user.subscription_type = SubscriptionType.PAID
    user.subscription_start_date = datetime.utcnow()
    user.trial_end_date = user.subscription_start_date + timedelta(days=7)
    user.subscription_end_date = None
    db.commit()
#===============================================================================================================================================================================================================================================
def check_trial_status(user: User, db: Session):
    if user.trial_end_date and user.trial_end_date <= datetime.utcnow():
        # Trial has ended, revert to free tier if no active paid subscription
        if not user.subscription_end_date or user.subscription_end_date <= datetime.utcnow():
            user.subscription_type = SubscriptionType.FREE
            user.trial_end_date = None
            user.subscription_start_date = None
            user.subscription_end_date = None
            db.commit()
#===============================================================================================================================================================================================================================================
def cancel_subscription(db: Session, user: User) -> SubscriptionStatus:
    if user.subscription_type != SubscriptionType.PAID:
        raise ValueError("User does not have an active paid subscription")
    
    user.subscription_type = SubscriptionType.FREE
    user.subscription_end_date = datetime.utcnow()
    db.commit()

    return SubscriptionStatus(
        status="canceled",
        message="Subscription successfully canceled",
        subscription_type=user.subscription_type,
        subscription_start_date=None,
        subscription_end_date=user.subscription_end_date,
        trial_end_date=None
    )
#===============================================================================================================================================================================================================================================
def activate_subscription(db: Session, user: User, activation_code: str) -> SubscriptionStatus:
    if activation_code != settings.DEMO_ACTIVATION_CODE:
        raise ValueError("Invalid activation code")

    user.subscription_type = SubscriptionType.PAID
    user.subscription_start_date = datetime.utcnow()
    user.subscription_end_date = user.subscription_start_date + timedelta(days=30)
    user.trial_end_date = None
    db.commit()

    return SubscriptionStatus(
        status="activated",
        message="Subscription successfully activated",
        subscription_type=user.subscription_type,
        subscription_start_date=user.subscription_start_date,
        subscription_end_date=user.subscription_end_date,
        trial_end_date=None
    )
#===============================================================================================================================================================================================================================================