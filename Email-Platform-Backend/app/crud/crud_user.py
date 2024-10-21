from sqlalchemy.orm import Session
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
#===============================================================================================================================================================================================================================================
def get_tenant(db: Session, tenant_id: int):
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()
#===============================================================================================================================================================================================================================================
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()
#===============================================================================================================================================================================================================================================
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
#===============================================================================================================================================================================================================================================
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()
#===============================================================================================================================================================================================================================================
def create_tenant(db: Session, tenant: TenantCreate):
    db_tenant = Tenant(name=tenant.name, domain=tenant.domain)
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant
#===============================================================================================================================================================================================================================================
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        tenant_id=user.tenant_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
#===============================================================================================================================================================================================================================================
def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        if 'password' in update_data:
            update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user
#===============================================================================================================================================================================================================================================
def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
#===============================================================================================================================================================================================================================================
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
#===============================================================================================================================================================================================================================================