# PotenCore MVP

MVP-лендинг и backend-каркас для `potencore.ru`.

Что внутри:

- `frontend/` — React + Vite лендинг с формой заявки и блоком превью продукта
- `backend/` — FastAPI API для healthcheck, сбора лидов, временной admin auth и AI-ready placeholder endpoints
- `nginx/` — reverse proxy конфиг под `potencore.ru`
- `docker-compose.yml` — локальный запуск через контейнеры

## Запуск локально

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend по умолчанию ожидает backend на `http://localhost:8000`.

## Запуск через Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

После запуска:

- сайт: `http://localhost`
- API: `http://localhost/api/v1`
- админка: `http://localhost/admin`


Перед production это обязательно поменять через `.env`.

## AI-архитектура

В MVP AI не реализован, но backend уже разделен так, чтобы позже добавить:

- сервис прогнозов рисков
- сервис рекомендаций по распределению задач
- сервис NLP/разбора коммуникаций
- async ingestion из Jira, Git, Telegram и календарей

Точки расширения сейчас отражены в `backend/app/api/routes.py` и `backend/app/services/lead_store.py`.
