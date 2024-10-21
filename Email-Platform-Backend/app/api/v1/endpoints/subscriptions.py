from app.api import deps
from typing import Union
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.config import settings
from app.services import payment_service
from app.crud.crud_user import get_tenant
from app.models.user import User, SubscriptionType
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.subscription import SubscriptionStatus
from app.services.subscription_service import start_free_trial
from app.schemas.user import SubscriptionCreate, SubscriptionOut,ActivationCode
#===============================================================================================================================================================================================================================================
router = APIRouter()
#===============================================================================================================================================================================================================================================
class CheckoutSession(BaseModel):
    checkout_url: str
    session_id: str
    message: str
#===============================================================================================================================================================================================================================================
@router.post("/select", response_model=Union[SubscriptionOut, CheckoutSession])
async def select_subscription(
    subscription: SubscriptionCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Check if the user's tenant is active
    tenant = get_tenant(db, current_user.tenant_id)
    if not tenant or not tenant.is_active:
        raise HTTPException(status_code=400, detail="Invalid or inactive tenant")

    if subscription.subscription_type == SubscriptionType.FREE:
        if not subscription.activation_code:
            raise HTTPException(status_code=400, detail="Activation code is required for free subscription")
        if subscription.activation_code != settings.DEMO_ACTIVATION_CODE:
            raise HTTPException(status_code=400, detail="Invalid activation code")
        
        current_user.subscription_type = SubscriptionType.FREE
        current_user.activation_code = subscription.activation_code
        current_user.subscription_start_date = datetime.utcnow()
        current_user.subscription_end_date = None
        current_user.trial_end_date = None

        db.commit()
        db.refresh(current_user)

        return SubscriptionOut(
            subscription_type=current_user.subscription_type,
            subscription_start_date=current_user.subscription_start_date,
            subscription_end_date=current_user.subscription_end_date,
            trial_end_date=current_user.trial_end_date
        )
    
    elif subscription.subscription_type == SubscriptionType.PAID:
        checkout_session = payment_service.create_stripe_checkout_session(current_user)
        return CheckoutSession(
            checkout_url=checkout_session.url,
            session_id=checkout_session.id,
            message="Please complete the payment to activate your subscription."
        )
    
    else:
        raise HTTPException(status_code=400, detail="Invalid subscription type")
#===============================================================================================================================================================================================================================================
@router.get("/current", response_model=SubscriptionOut)
async def get_current_subscription(current_user: User = Depends(deps.get_current_user)):
    return SubscriptionOut(
        subscription_type=current_user.subscription_type,
        subscription_start_date=current_user.subscription_start_date,
        subscription_end_date=current_user.subscription_end_date,
        trial_end_date=current_user.trial_end_date
    )
#===============================================================================================================================================================================================================================================
@router.get("/stripe-session/{session_id}")
async def get_stripe_session(
    session_id: str,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    session = payment_service.retrieve_stripe_session(session_id)
    if session.payment_status == "paid":
        payment_service.handle_successful_payment(current_user.id, db)
        return {"status": "success", "message": "Subscription activated"}
    return {"status": "pending", "message": "Payment not completed"}
#===============================================================================================================================================================================================================================================
@router.post("/start-trial")
def start_trial(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Check if the user's tenant is active
    tenant = get_tenant(db, current_user.tenant_id)
    if not tenant or not tenant.is_active:
        raise HTTPException(status_code=400, detail="Invalid or inactive tenant")

    if current_user.trial_end_date:
        raise HTTPException(status_code=400, detail="You have already used your free trial")
    
    start_free_trial(current_user, db)
    return {"message": "Free trial started successfully"}
#===============================================================================================================================================================================================================================================
@router.post("/cancel", response_model=SubscriptionStatus)
async def cancel_user_subscription(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return cancel_subscription(db, current_user)
#===============================================================================================================================================================================================================================================
@router.post("/activate", response_model=SubscriptionStatus)
async def activate_user_subscription(
    activation: ActivationCode,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return activate_subscription(db, current_user, activation.code)