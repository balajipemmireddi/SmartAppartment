from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://smartapt:smartapt123@localhost:5432/smart_apartment"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    
    # Environment
    environment: str = "development"
    
    # CORS
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"]
    
    # Telemetry Generator
    telemetry_interval: int = 5  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
