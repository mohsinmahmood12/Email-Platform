from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TemplateBase(BaseModel):
    name: str
    content: str
    description: Optional[str] = None

class TemplateCreate(TemplateBase):
    name: str
    description: str  

class TemplateUpdate(TemplateBase):
    name: Optional[str] = None
    content: Optional[str] = None

class TemplateOut(TemplateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TemplateResponse(BaseModel):
    id: int
    name: str
    description: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True