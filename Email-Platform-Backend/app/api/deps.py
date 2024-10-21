# app/api/deps.py
from typing import Generator
from jose import jwt, JWTError
from app.models.user import User
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.tenant import Tenant
from app.db.session import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from fastapi import Depends, HTTPException, Request
#====================================================================================================================================================================================================================================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
#====================================================================================================================================================================================================================================================================
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#====================================================================================================================================================================================================================================================================
def get_tenant_from_header(request: Request) -> int:
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID header is missing")
    return int(tenant_id)
#====================================================================================================================================================================================================================================================================
def get_db_for_tenant(
    tenant_id: int = Depends(get_tenant_from_header),
    db: Session = Depends(get_db)
) -> Session:
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return db
#====================================================================================================================================================================================================================================================================
async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        tenant_id: int = payload.get("tenant_id")
        if email is None or tenant_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.primary_email == email, User.tenant_id == tenant_id).first()
    if user is None:
        raise credentials_exception
    return user
#====================================================================================================================================================================================================================================================================
def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
#====================================================================================================================================================================================================================================================================