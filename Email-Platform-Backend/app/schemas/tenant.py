# app/schemas/tenant.py
from pydantic import BaseModel
#===============================================================================================================================================================================================================================================
class TenantBase(BaseModel):
    name: str
    domain: str
#===============================================================================================================================================================================================================================================
class TenantCreate(TenantBase):
    pass
#===============================================================================================================================================================================================================================================
class TenantUpdate(TenantBase):
    is_active: bool
#===============================================================================================================================================================================================================================================
class TenantInDBBase(TenantBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
#===============================================================================================================================================================================================================================================
class Tenant(TenantInDBBase):
    pass
#===============================================================================================================================================================================================================================================
class TenantInDB(TenantInDBBase):
    pass
#===============================================================================================================================================================================================================================================