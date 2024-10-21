from jose import jwt
from jose import JWTError
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.token import TokenData
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.models.user import User, SubscriptionType
#================================================================================================================================================================================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#================================================================================================================================================================================================
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
#================================================================================================================================================================================================
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        tenant_id: int = payload.get("tenant_id")
        if email is None or tenant_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return TokenData(email=email, tenant_id=tenant_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
#================================================================================================================================================================================================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
#================================================================================================================================================================================================
def get_password_hash(password):
    return pwd_context.hash(password)
#================================================================================================================================================================================================
def verify_subscription(user: User) -> bool:
    return user.subscription_type == SubscriptionType.PAID and user.subscription_end_date > datetime.utcnow()
#================================================================================================================================================================================================

