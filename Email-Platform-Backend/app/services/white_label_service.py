from sqlalchemy.orm import Session
from app.models.white_label import WhiteLabel
from app.schemas.white_label import WhiteLabelCreate, WhiteLabelUpdate
#===============================================================================================================================================================================================================================================
def create_white_label(db: Session, white_label: WhiteLabelCreate, tenant_id: int):
    db_white_label = WhiteLabel(**white_label.dict(), tenant_id=tenant_id)
    db.add(db_white_label)
    db.commit()
    db.refresh(db_white_label)
    return db_white_label
#===============================================================================================================================================================================================================================================
def get_white_label(db: Session, tenant_id: int):
    return db.query(WhiteLabel).filter(WhiteLabel.tenant_id == tenant_id).first()
#===============================================================================================================================================================================================================================================
def update_white_label(db: Session, white_label: WhiteLabelUpdate, tenant_id: int):
    db_white_label = get_white_label(db, tenant_id)
    if db_white_label:
        for key, value in white_label.dict(exclude_unset=True).items():
            setattr(db_white_label, key, value)
        db.commit()
        db.refresh(db_white_label)
    return db_white_label
#===============================================================================================================================================================================================================================================
