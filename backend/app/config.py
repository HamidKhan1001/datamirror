import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # API Configuration
    anthropic_api_key: str = Field(default="mock_api_key", validation_alias="ANTHROPIC_API_KEY")
    backend_secret: str = Field(default="local_backend_secret", validation_alias="BACKEND_SECRET")
    admin_secret_key: str = Field(default="admin123", validation_alias="ADMIN_SECRET_KEY")
    allowed_origins: str = Field(default="http://localhost:3000,http://localhost:3001", validation_alias="ALLOWED_ORIGINS")
    
    # Database Configuration
    # For local: sqlite:///./datamirror.db
    # For Neon: postgresql://user:password@host/dbname?sslmode=require
    database_url: str = Field(default="sqlite:///./datamirror.db", validation_alias="DATABASE_URL")
    
    # Connection Pooling
    db_pool_size: int = Field(default=20, validation_alias="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=40, validation_alias="DB_MAX_OVERFLOW")
    db_pool_recycle: int = Field(default=3600, validation_alias="DB_POOL_RECYCLE")
    db_pool_pre_ping: bool = Field(default=True, validation_alias="DB_POOL_PRE_PING")
    
    # Redis Cache (optional)
    redis_url: str = Field(default="redis://localhost:6379/0", validation_alias="REDIS_URL")
    cache_enabled: bool = Field(default=False, validation_alias="CACHE_ENABLED")
    cache_ttl: int = Field(default=3600, validation_alias="CACHE_TTL")
    
    # Rate Limiting
    rate_limit_per_minute: int = Field(default=60, validation_alias="RATE_LIMIT_PER_MINUTE")
    
    # Logging
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")
    
    # Environment
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")
    
    # Performance
    worker_threads: int = Field(default=4, validation_alias="WORKER_THREADS")
    request_timeout: int = Field(default=30, validation_alias="REQUEST_TIMEOUT")
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }

# Ensure config loaded works in dev/test setups
settings = Settings()
