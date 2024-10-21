import stripe
import paypalrestsdk
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from datetime import datetime, timedelta
from app.models.user import User, SubscriptionType
#================================================================================================================================================================================================
stripe.api_key = settings.STRIPE_SECRET_KEY
#================================================================================================================================================================================================
# PayPal configuration
paypalrestsdk.configure({
    "mode": "sandbox" if settings.PAYPAL_MODE == "sandbox" else "live",
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})
#================================================================================================================================================================================================
def create_paypal_subscription(user: User):
    try:
        billing_plan = paypalrestsdk.BillingPlan.find(settings.PAYPAL_PLAN_ID)
        agreement = paypalrestsdk.BillingAgreement({
            "name": "Email Platform Monthly Subscription",
            "description": "Monthly subscription for Email Platform",
            "start_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "plan": {
                "id": billing_plan.id
            },
            "payer": {
                "payment_method": "paypal"
            }
        })
        
        if agreement.create():
            for link in agreement.links:
                if link.rel == "approval_url":
                    return link.href
        else:
            raise HTTPException(status_code=400, detail=agreement.error)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
#================================================================================================================================================================================================
def execute_paypal_subscription(token: str, user: User, db: Session):
    try:
        agreement = paypalrestsdk.BillingAgreement.execute(token)
        if agreement.state == "Active":
            user.subscription_type = SubscriptionType.PAID
            user.subscription_start_date = datetime.utcnow()
            user.subscription_end_date = user.subscription_start_date + timedelta(days=30)
            user.trial_end_date = None
            db.commit()
            return True
        else:
            return False
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
#================================================================================================================================================================================================
def create_stripe_checkout_session(user: User):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': int(settings.SUBSCRIPTION_PRICE * 100),  
                    'product_data': {
                        'name': 'Monthly Subscription',
                        'description': 'Email Platform Monthly Subscription',
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:8000/cancel',
            client_reference_id=str(user.id),
        )
        return checkout_session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#================================================================================================================================================================================================
def handle_successful_payment(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.subscription_type = SubscriptionType.PAID
        user.subscription_start_date = datetime.utcnow()
        user.subscription_end_date = user.subscription_start_date + timedelta(days=30)
        user.trial_end_date = None
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="User not found")
#================================================================================================================================================================================================
def retrieve_stripe_session(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
#================================================================================================================================================================================================