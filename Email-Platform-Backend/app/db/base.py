# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.user import User
from app.models.template import Template
from app.models.tenant import Tenant
from app.models.white_label import WhiteLabel