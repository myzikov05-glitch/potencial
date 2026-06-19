import hashlib
import json
import os

from fastapi import APIRouter, Depends

from app.analytics.dashboard import build_dashboard
from app.analytics.engine import build_team_analytics
from app.analytics.schemas import DashboardResponse
from app.schemas import AdminUser
from app.services.auth import require_admin

router_ml = APIRouter(prefix="/api/v1/analytics")


_CACHE: dict[str, dict] = {}


def _data_fingerprint() -> str:
    raw = build_team_analytics()
    blob = json.dumps(raw, ensure_ascii=False, sort_keys=True, default=str)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


@router_ml.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router_ml.get("/dashboard", response_model=DashboardResponse)
def dashboard(_: AdminUser = Depends(require_admin)) -> dict:
    fingerprint = _data_fingerprint()

    cached = _CACHE.get(fingerprint)
    if cached is not None:
        return cached

    hf_token = os.environ.get("HF_TOKEN")
    result = build_dashboard(hf_token=hf_token)

    _CACHE.clear()  
    _CACHE[fingerprint] = result
    return result


@router_ml.post("/dashboard/refresh", response_model=DashboardResponse)
def dashboard_refresh(_: AdminUser = Depends(require_admin)) -> dict:
    hf_token = os.environ.get("HF_TOKEN")
    result = build_dashboard(hf_token=hf_token)
    _CACHE.clear()
    _CACHE[_data_fingerprint()] = result
    return result