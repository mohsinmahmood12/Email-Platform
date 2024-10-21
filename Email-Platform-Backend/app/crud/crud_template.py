from sqlalchemy.orm import Session
from app.models.template import Template as TemplateModel
from app.schemas.template import TemplateCreate, TemplateUpdate

def get_templates(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(TemplateModel).filter(TemplateModel.user_id == user_id).offset(skip).limit(limit).all()

def create_template(db: Session, template: TemplateCreate, user_id: int):
    db_template = TemplateModel(**template.dict(), user_id=user_id)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_template(db: Session, template_id: int):
    return db.query(TemplateModel).filter(TemplateModel.id == template_id).first()

def update_template(db: Session, template_id: int, template: TemplateUpdate):
    db_template = get_template(db, template_id=template_id)
    update_data = template.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_template, key, value)
    db.commit()
    db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: int):
    db_template = get_template(db, template_id=template_id)
    db.delete(db_template)
    db.commit()
    return db_template