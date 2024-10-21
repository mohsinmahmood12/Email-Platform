# app/main.py
from app.db.base import Base
from app.db.session import engine
from fastapi import FastAPI, Request
from app.core.config import settings
from app.api.v1.router import api_router
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy_utils import database_exists, create_database
from app.core.exceptions import CustomHTTPException, http_exception_handler
#===========================================================================================================================================================================================
app = FastAPI(title=settings.PROJECT_NAME)
#===========================================================================================================================================================================================
# Set up CORS
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#===========================================================================================================================================================================================
# Add tenant middleware
@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    tenant_id = request.headers.get("X-Tenant-ID")
    if tenant_id:
        request.state.tenant_id = int(tenant_id)
    else:
        # You might want to handle requests without a tenant ID differently
        # For now, we'll just pass None
        request.state.tenant_id = None
    response = await call_next(request)
    return response
#===========================================================================================================================================================================================
# Create the database if it doesn't exist
if not database_exists(engine.url):
    create_database(engine.url)
#===========================================================================================================================================================================================
# Create database tables
Base.metadata.create_all(bind=engine)
#===========================================================================================================================================================================================
# Include API router
app.include_router(api_router, prefix="/api/v1")
#===========================================================================================================================================================================================
# Add custom exception handler
app.add_exception_handler(CustomHTTPException, http_exception_handler)
#===========================================================================================================================================================================================
@app.get("/")
async def read_root():
    return FileResponse("frontend/index.html")
#===========================================================================================================================================================================================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request to {request.url.path} took {process_time:.2f} seconds")
    return response
#===========================================================================================================================================================================================
# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
#===========================================================================================================================================================================================