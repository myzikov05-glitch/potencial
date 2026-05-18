from dataclasses import dataclass
from functools import lru_cache
from os import getenv
from pathlib import Path


@dataclass
class Settings:
    app_env: str
    cors_origins: list[str]
    leads_storage_path: Path
    admin_username: str
    admin_password: str
    admin_token: str


@lru_cache
def get_settings() -> Settings:
    raw_origins = getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:4173")
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    storage_path = Path(getenv("LEADS_STORAGE_PATH", "data/leads.json"))

    return Settings(
        app_env=getenv("APP_ENV", "development"),
        cors_origins=origins,
        leads_storage_path=storage_path,
        admin_username=getenv("ADMIN_USERNAME", "admin"),
        admin_password=getenv("ADMIN_PASSWORD", "admin"),
        admin_token=getenv("ADMIN_TOKEN", "potencore-admin-dev-token"),
    )
