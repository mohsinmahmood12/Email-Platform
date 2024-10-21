from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import SubscriptionType
#===============================================================================================================================================================================================================================================
class UserBase(BaseModel):
    primary_email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
#===============================================================================================================================================================================================================================================
class UserCreate(UserBase):
    password: str
    confirm_password: str
#===============================================================================================================================================================================================================================================
class UserLogin(BaseModel):
    email: EmailStr
    password: str
#===============================================================================================================================================================================================================================================
class UserPasswordForgot(BaseModel):
    email: EmailStr
#===============================================================================================================================================================================================================================================
class UserPasswordReset(BaseModel):
    token: str
    new_password: str
#===============================================================================================================================================================================================================================================
class UserInDB(UserBase):
    id: int
    is_active: bool
    subscription_type: SubscriptionType
    subscription_start_date: Optional[datetime]
    subscription_end_date: Optional[datetime]
    trial_end_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    reset_token: Optional[str] = None
    tenant_id: int
    primary_email: EmailStr  

    class Config:
        orm_mode = True
#===============================================================================================================================================================================================================================================
class UserOut(UserBase):
    id: int
    is_active: bool
    subscription_type: SubscriptionType

    class Config:
        orm_mode = True
#===============================================================================================================================================================================================================================================
class SubscriptionCreate(BaseModel):
    subscription_type: SubscriptionType
    activation_code: Optional[str] = None
#===============================================================================================================================================================================================================================================
class SubscriptionOut(BaseModel):
    subscription_type: SubscriptionType
    subscription_start_date: Optional[datetime]
    subscription_end_date: Optional[datetime]
    trial_end_date: Optional[datetime]

    class Config:
        orm_mode = True
#===============================================================================================================================================================================================================================================
# New schema for user update
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
#===============================================================================================================================================================================================================================================
# New schema for admin user creation (includes tenant_id)
class AdminUserCreate(UserCreate):
    is_active: bool = True
    subscription_type: SubscriptionType = SubscriptionType.FREE
#===============================================================================================================================================================================================================================================
class UserProfile(UserBase):
    id: int
    is_active: bool
    subscription_type: SubscriptionType
    subscription_start_date: Optional[datetime]
    subscription_end_date: Optional[datetime]
    trial_end_date: Optional[datetime]
    tenant_id: int

    class Config:
        orm_mode = True

class EmailUpdate(BaseModel):
    email: EmailStr

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class ActivationCode(BaseModel):
    code: str

class SubscriptionStatus(BaseModel):
    status: str
    message: str
    subscription_type: SubscriptionType
    subscription_start_date: Optional[datetime]
    subscription_end_date: Optional[datetime]
    trial_end_date: Optional[datetime]

    class Config:
        orm_mode = True