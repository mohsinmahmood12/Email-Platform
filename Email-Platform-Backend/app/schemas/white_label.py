from pydantic import BaseModel
from typing import Optional

class WhiteLabelBase(BaseModel):
    platform_name: str
    logo_url: Optional[str] = None

class WhiteLabelCreate(WhiteLabelBase):
    pass

class WhiteLabelUpdate(WhiteLabelBase):
    platform_name: Optional[str] = None

class WhiteLabel(WhiteLabelBase):
    id: int
    tenant_id: int

    class Config:
        orm_mode = True