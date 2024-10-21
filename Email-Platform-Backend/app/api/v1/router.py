# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1.endpoints import auth, subscriptions, email_setup,ai_features,emails,white_label,templates
#===============================================================================================================================================================================================================================================
api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(emails.router, prefix="/emails", tags=["emails"])
api_router.include_router(email_setup.router, prefix="/email-setup", tags=["email-setup"])
api_router.include_router(ai_features.router, prefix="/ai", tags=["ai"])
api_router.include_router(white_label.router, prefix="/white-label", tags=["white-label"]) 
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
#===============================================================================================================================================================================================================================================