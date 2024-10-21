# app/api/v1/endpoints/auth.py
import secrets
from app.api import deps
from datetime import timedelta
from app.models.user import User
from sqlalchemy.orm import Session
from app.schemas.token import Token
from app.core.config import settings
from datetime import datetime, timedelta
from app.crud.crud_user import get_tenant
from app.crud.crud_user import create_tenant
from app.schemas.tenant import TenantCreate
from fastapi.security import OAuth2PasswordRequestForm
from app.services.email_service import send_password_reset_email
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate, UserInDB, UserPasswordForgot, UserPasswordReset,UserProfile, EmailUpdate, PasswordUpdate
#==============================================================================================================================================================================================================================================
router = APIRouter()
#==============================================================================================================================================================================================================================================
@router.post("/register", response_model=UserInDB)
def register(user: UserCreate, db: Session = Depends(deps.get_db)):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    existing_user = db.query(User).filter(User.primary_email == user.primary_email).first()  # Change this line
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create a tenant for the user
    tenant_name = f"{user.first_name} {user.last_name}'s Tenant"
    tenant_domain = user.primary_email.split('@')[1]  # Change this line
    new_tenant = create_tenant(db, TenantCreate(name=tenant_name, domain=tenant_domain))
    
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        primary_email=user.primary_email,  # Change this line
        hashed_password=get_password_hash(user.password),
        tenant_id=new_tenant.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
#==============================================================================================================================================================================================================================================
@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.primary_email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.primary_email, "tenant_id": user.tenant_id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
#==============================================================================================================================================================================================================================================
@router.post("/forgot-password")
async def forgot_password(
    user_email: UserPasswordForgot,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db)
):
    user = db.query(User).filter(User.primary_email == user_email.email).first()
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
        db.commit()

        background_tasks.add_task(send_password_reset_email, user.primary_email, reset_token)
    
    return {"message": "If an account with that email exists, we have sent a password reset link"}
#==============================================================================================================================================================================================================================================
@router.post("/reset-password")
async def reset_password(
    reset_data: UserPasswordReset,
    db: Session = Depends(deps.get_db)
):
    user = db.query(User).filter(User.reset_token == reset_data.token).first()
    if not user or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password has been reset successfully"}
#==============================================================================================================================================================================================================================================
@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(deps.get_current_user)):
    return current_user
#==============================================================================================================================================================================================================================================
@router.put("/update-email", response_model=UserProfile)
async def update_user_email(
    email_update: EmailUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if db.query(User).filter(User.primary_email == email_update.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    current_user.primary_email = email_update.email
    db.commit()
    db.refresh(current_user)
    return current_user
#==============================================================================================================================================================================================================================================
@router.put("/update-password", response_model=UserProfile)
async def update_user_password(
    password_update: PasswordUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not verify_password(password_update.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    current_user.hashed_password = get_password_hash(password_update.new_password)
    db.commit()
    db.refresh(current_user)
    return current_user
