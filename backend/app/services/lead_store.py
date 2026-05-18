import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from uuid import uuid4

from app.schemas import LeadCreate


class LeadStore:
    def __init__(self, storage_path: Path) -> None:
        self.storage_path = storage_path
        self._lock = Lock()
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.storage_path.exists():
            self.storage_path.write_text("[]", encoding="utf-8")

    def create(self, payload: LeadCreate) -> dict:
        lead_record = {
            "id": str(uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "captured",
            **payload.model_dump(),
        }

        with self._lock:
            leads = json.loads(self.storage_path.read_text(encoding="utf-8"))
            leads.append(lead_record)
            self.storage_path.write_text(
                json.dumps(leads, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

        return lead_record

    def list_all(self) -> list[dict]:
        with self._lock:
            leads = json.loads(self.storage_path.read_text(encoding="utf-8"))

        return sorted(leads, key=lambda item: item["created_at"], reverse=True)
