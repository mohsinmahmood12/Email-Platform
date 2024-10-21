from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.user import User
from app.services import ai_service
from app.core.security import verify_subscription
from app.schemas.email import EmailPrompt, EmailContent, TemplateType
from app.schemas.template import TemplateCreate
from app.crud import crud_template
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/generate-email")
async def generate_email(
    email_prompt: EmailPrompt,
    current_user: User = Depends(deps.get_current_user)
):
    if not verify_subscription(current_user):
        raise HTTPException(status_code=403, detail="This feature requires an active subscription")
    try:
        content = ai_service.generate_email_content(email_prompt.prompt)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.post("/generate-template")
async def generate_template(
    template_type: TemplateType,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not verify_subscription(current_user):
        raise HTTPException(status_code=403, detail="This feature requires an active subscription")
    try:
        template_content = ai_service.generate_email_template(template_type.template_type)
        
        # Create a new template in the database
        new_template = TemplateCreate(
            name=f"AI Generated {template_type.template_type.capitalize()} Template",
            content=template_content,
            description=f"AI-generated template for {template_type.template_type}"
        )
        created_template = crud_template.create_template(db, template=new_template, user_id=current_user.id)
        
        return {"template": created_template}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.post("/analyze-sentiment")
async def analyze_sentiment(
    email_content: EmailContent,
    current_user: User = Depends(deps.get_current_user)
):
    if not verify_subscription(current_user):
        raise HTTPException(status_code=403, detail="This feature requires an active subscription")
    try:
        sentiment = ai_service.analyze_sentiment(email_content.content)
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.post("/improve-template/{template_id}")
async def improve_template(
    template_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not verify_subscription(current_user):
        raise HTTPException(status_code=403, detail="This feature requires an active subscription")
    try:
        # Fetch the existing template
        existing_template = crud_template.get_template(db, template_id=template_id)
        if not existing_template or existing_template.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Template not found")

        # Use AI to improve the template
        improved_content = ai_service.improve_template(existing_template.content)

        # Update the template with improved content
        updated_template = crud_template.update_template(
            db, 
            template_id=template_id, 
            template=TemplateCreate(
                name=f"Improved: {existing_template.name}",
                content=improved_content,
                description=f"AI-improved version of {existing_template.name}"
            )
        )

        return {"improved_template": updated_template}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")