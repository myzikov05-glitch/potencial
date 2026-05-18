from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas import AdminUser, LeadCreate, LeadRecord, LeadResponse, LoginRequest, LoginResponse, PlatformOverview
from app.services.auth import authenticate_admin, get_admin_user, require_admin
from app.services.lead_store import LeadStore

router = APIRouter(prefix="/api/v1")


@lru_cache
def get_lead_store() -> LeadStore:
    return LeadStore(get_settings().leads_storage_path)


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, settings: Settings = Depends(get_settings)) -> LoginResponse:
    if not authenticate_admin(payload, settings):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials")

    return LoginResponse(
        access_token=settings.admin_token,
        token_type="bearer",
        user=get_admin_user(settings),
    )


@router.get("/auth/me", response_model=AdminUser)
def auth_me(user: AdminUser = Depends(require_admin)) -> AdminUser:
    return user


@router.get("/platform/overview", response_model=PlatformOverview)
def platform_overview() -> PlatformOverview:
    return PlatformOverview(
        product_stage="Landing MVP + lead API + AI-ready architecture",
        integrations=["Jira", "GitHub/GitLab", "Telegram", "Calendar"],
        ai_status={
            "enabled": False,
            "mode": "placeholder",
            "summary": "AI в MVP не активирован. Вместо этого заложены endpoint-ы и модульная архитектура под риск-скоринг, рекомендации и NLP.",
            "planned_modules": [
                "risk-forecasting",
                "task-allocation",
                "retro-summary",
                "communication-nlp",
            ],
        },
        roadmap={
            "current": [
                "Маркетинговый лендинг с формой заявки",
                "Сохранение лидов в backend",
                "Подготовка reverse proxy и docker-based deployment",
            ],
            "next": [
                "Интеграции Jira и Git в режиме read-only metadata",
                "Слой событий для Telegram и календарей",
                "Отдельный сервис рекомендаций и risk forecasting",
            ],
        },
    )


@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, store: LeadStore = Depends(get_lead_store)) -> LeadResponse:
    lead = store.create(payload)
    return LeadResponse(
        id=lead["id"],
        created_at=lead["created_at"],
        status=lead["status"],
    )


@router.get("/leads", response_model=list[LeadRecord])
def list_leads(
    _: AdminUser = Depends(require_admin),
    store: LeadStore = Depends(get_lead_store),
) -> list[LeadRecord]:
    return [LeadRecord(**lead) for lead in store.list_all()]
