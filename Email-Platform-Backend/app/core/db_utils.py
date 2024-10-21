from sqlalchemy import create_engine
from app.core.config import settings
from sqlalchemy_utils import database_exists, create_database
#===============================================================================================================================================================================================================================================
def create_db_if_not_exists():
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    if not database_exists(engine.url):
        create_database(engine.url)
        print(f"Created database '{settings.DB_NAME}'")
    else:
        print(f"Database '{settings.DB_NAME}' already exists")
#===============================================================================================================================================================================================================================================