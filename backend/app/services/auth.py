from typing import Optional

from secrets import compare_digest

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings
from app.schemas import AdminUser, LoginRequest

bearer_scheme = HTTPBearer(auto_error=False)


def authenticate_admin(payload: LoginRequest, settings: Settings) -> bool:
    return compare_digest(payload.username, settings.admin_username) and compare_digest(
        payload.password, settings.admin_password
    )


def get_admin_user(settings: Settings) -> AdminUser:
    return AdminUser(username=settings.admin_username, role="admin")


def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> AdminUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing credentials")

    if not compare_digest(credentials.credentials, settings.admin_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token")

    return get_admin_user(settings)
