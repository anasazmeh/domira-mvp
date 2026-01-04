"""
Domira Backend - Configuration Settings
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    app_name: str = "Domira API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./domira.db"
    
    # Stripe
    stripe_api_key: str = ""
    stripe_webhook_secret: str = ""
    
    # Ethereum
    eth_rpc_url: str = "https://rpc.sepolia.org"
    contract_address: str = ""
    admin_private_key: str = ""
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
