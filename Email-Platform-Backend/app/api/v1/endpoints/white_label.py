from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.services import white_label_service
from app.schemas.white_label import WhiteLabelCreate, WhiteLabelUpdate, WhiteLabel

router = APIRouter()

@router.post("/", response_model=WhiteLabel)
def create_white_label(
    white_label: WhiteLabelCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return white_label_service.create_white_label(db, white_label, current_user.tenant_id)

@router.get("/", response_model=WhiteLabel)
def get_white_label(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    white_label = white_label_service.get_white_label(db, current_user.tenant_id)
    if not white_label:
        raise HTTPException(status_code=404, detail="White label configuration not found")
    return white_label

@router.put("/", response_model=WhiteLabel)
def update_white_label(
    white_label: WhiteLabelUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    updated_white_label = white_label_service.update_white_label(db, white_label, current_user.tenant_id)
    if not updated_white_label:
        raise HTTPException(status_code=404, detail="White label configuration not found")
    return updated_white_label