from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.user import User
from app.schemas.template import TemplateCreate, TemplateUpdate, TemplateOut, TemplateResponse
from app.crud import crud_template

router = APIRouter()

@router.get("/", response_model=List[TemplateOut])
def get_templates(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return crud_template.get_templates(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=TemplateResponse)
def create_template(
    template: TemplateCreate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return crud_template.create_template(db, template=template, user_id=current_user.id)

@router.get("/{template_id}", response_model=TemplateOut)
def get_template(
    template_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    template = crud_template.get_template(db, template_id=template_id)
    if template.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this template")
    return template

@router.put("/{template_id}", response_model=TemplateOut)
def update_template(
    template_id: int,
    template: TemplateUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    db_template = crud_template.get_template(db, template_id=template_id)
    if db_template.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this template")
    return crud_template.update_template(db, template_id=template_id, template=template)

@router.delete("/{template_id}", response_model=TemplateOut)
def delete_template(
    template_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    db_template = crud_template.get_template(db, template_id=template_id)
    if db_template.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this template")
    return crud_template.delete_template(db, template_id=template_id)