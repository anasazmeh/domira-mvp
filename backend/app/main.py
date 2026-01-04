"""
Domira Backend - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api import users, properties, marketplace, webhooks

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Domira - Fractional Real Estate Marketplace API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix=f"{settings.api_v1_prefix}/users", tags=["Users"])
app.include_router(properties.router, prefix=f"{settings.api_v1_prefix}/properties", tags=["Properties"])
app.include_router(marketplace.router, prefix=f"{settings.api_v1_prefix}/marketplace", tags=["Marketplace"])
app.include_router(webhooks.router, prefix=f"{settings.api_v1_prefix}/webhooks", tags=["Webhooks"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "domira-api"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Domira API",
        "docs": "/docs",
        "version": "1.0.0"
    }
