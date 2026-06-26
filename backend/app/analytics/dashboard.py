import re
from datetime import datetime, timezone

from app.analytics.engine import build_team_analytics
from app.analytics.llm import enrich_with_llm, prepare_llm_summary
from app.analytics.synthetic import DISPLAY_NAMES, ROLES

LOAD_HIGH = 80
LOAD_LOW = 40


def _initials(full_name: str) -> str:
    parts = full_name.split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[1][0]).upper()
    return full_name[:2].upper()


def _latest_metric(member: dict) -> dict:
    weekly = member.get("weekly_metrics", [])
    return weekly[-1] if weekly else {}


def _build_workload(members: list[dict], recommendations: list[dict], deobf=None) -> list[dict]:
    rec_by_from = {r["from"]: r for r in recommendations}
    rec_targets = {r["to"] for r in recommendations}

    cards = []
    for member in members:
        pid = member["person_id"]
        latest = _latest_metric(member)
        load = latest.get("load_pct", 0)
        name = DISPLAY_NAMES.get(pid, pid)

        if load > LOAD_HIGH:
            tone = "danger"
        elif load < LOAD_LOW:
            tone = "success"
        else:
            tone = "neutral"

        card = {
            "type": tone,
            "initials": _initials(name),
            "name": name,
            "load": f"{load:.0f}%",
        }

        if load > LOAD_HIGH:
            over = load - 100
            if over > 0:
                card["warning"] = f"Перегруз на {over:.0f}% (загрузка {load:.0f}%)"
            else:
                card["warning"] = f"Высокая загрузка ({load:.0f}%)"
        elif load < LOAD_LOW:
            card["warning"] = f"Ресурс свободен ({load:.0f}%). Может помочь коллеге"
        elif latest.get("is_stagnant"):
            card["warning"] = "Сложность задач не растёт — риск стагнации"

        if pid in rec_by_from:
            rec = rec_by_from[pid]
            to_name = DISPLAY_NAMES.get(rec["to"], rec["to"])
            llm_text = rec.get("llm_text")
            if llm_text and deobf:
                llm_text = deobf(llm_text)
            card["recommendation"] = (
                llm_text
                or f"Делегировать часть задач от {name} к {to_name} "
                   f"(~{rec.get('estimated_load_transfer', 0):.0f}% загрузки)"
            )

        cards.append((load, card))

    cards.sort(key=lambda x: x[0], reverse=True)
    return [c for _, c in cards]


def _build_metrics(score: dict, balance_latest: dict, members: list[dict]) -> list[dict]:
    comp = score["components"]
    avg_load = comp["avg_load"]
    balance_score = comp["balance_score"]
    stagnation_rate = comp["stagnation_rate"]

    if 60 <= avg_load <= 80:
        load_note, load_tone = "Загрузка в норме", "good"
    elif avg_load > 80:
        load_note, load_tone = "Команда перегружена", "warn"
    else:
        load_note, load_tone = "Есть свободный ресурс", "blue"

    if balance_score >= 70:
        bal_note, bal_tone = "Нагрузка распределена ровно", "good"
    else:
        bal_note, bal_tone = "Баланс хромает: есть перекос", "warn"

    if stagnation_rate == 0:
        stag_note, stag_tone = "Все растут по сложности", "good"
    else:
        stag_note, stag_tone = f"{stagnation_rate:.0f}% команды в стагнации", "warn"

    return [
        {
            "value": f"{avg_load:.0f}%",
            "label": "Загрузка команды",
            "source": "Jira + Calendar",
            "note": load_note,
            "tone": load_tone,
        },
        {
            "value": f"{balance_score:.0f}%",
            "label": "Баланс нагрузки",
            "source": "Распределение",
            "note": bal_note,
            "tone": bal_tone,
        },
        {
            "value": f"{stagnation_rate:.0f}%",
            "label": "В стагнации",
            "source": "Тренд сложности",
            "note": stag_note,
            "tone": stag_tone,
        },
    ]


def _build_action_items(recommendations: list[dict]) -> list[dict]:
    items = []
    for rec in recommendations:
        from_name = DISPLAY_NAMES.get(rec["from"], rec["from"])
        to_name = DISPLAY_NAMES.get(rec["to"], rec["to"])
        items.append({
            "text": f"Делегировать часть задач от {from_name} к {to_name} "
                    f"(~{rec.get('estimated_load_transfer', 0):.0f}% загрузки)"
        })
    if not items:
        items.append({"text": "Команда сбалансирована — срочных действий нет"})
    return items


def _build_help(members: list[dict], help_network: dict) -> dict:
    overloaded, available = [], []
    for member in members:
        pid = member["person_id"]
        latest = _latest_metric(member)
        load = latest.get("load_pct", 0)
        name = DISPLAY_NAMES.get(pid, pid)
        role = ROLES.get(pid, member.get("role", ""))
        if load > LOAD_HIGH:
            overloaded.append({"name": name, "detail": f"загрузка {load:.0f}%"})
        elif load < LOAD_LOW:
            available.append({"name": name, "detail": f"свободен ({load:.0f}%), опыт: {role}"})

    reviewers = [
        DISPLAY_NAMES.get(pid, pid)
        for pid, _count in help_network.get("most_helpful", [])
    ]

    return {"overloaded": overloaded, "available": available, "reviewers": reviewers}


def _deobfuscate(text: str, id_to_letter: dict, names: dict) -> str:
    letter_to_name = {
        letter: names.get(pid, pid) for pid, letter in id_to_letter.items()
    }
    for letter, name in letter_to_name.items():
        text = re.sub(rf"[Сс]отрудник\w*\s+{letter}\b", name, text)
    return text


def build_dashboard(hf_token: str | None = None) -> dict:
    analytics = build_team_analytics()
    enriched = enrich_with_llm(analytics, hf_token=hf_token)

    team = enriched["team"]
    members = enriched["members"]
    recommendations = team.get("recommendations", [])
    score = team["score"]
    balance_latest = team.get("latest_balance", {})
    help_network = team.get("help_network", {})

    summary_data = prepare_llm_summary(analytics)
    id_to_letter = summary_data["id_to_letter"]

    fallback_marker = "В команде наблюдается дисбаланс загрузки. Рекомендуется перераспределить задачи."

    if recommendations and recommendations[0].get("llm_text"):
        raw = recommendations[0]["llm_text"]
        llm_used = bool(hf_token) and raw != fallback_marker
        ai_summary = _deobfuscate(raw, id_to_letter, DISPLAY_NAMES)
    else:
        ai_summary = "Команда в зоне комфортной загрузки. Рекомендаций по делегированию нет."
        llm_used = False

    def deobf(t: str) -> str:
        return _deobfuscate(t, id_to_letter, DISPLAY_NAMES)

    return {
        "score": {
            "total": score["total_score"],
            "components": score["components"],
        },
        "metrics": _build_metrics(score, balance_latest, members),
        "workload": _build_workload(members, recommendations, deobf=deobf),
        "action_items": _build_action_items(recommendations),
        "help": _build_help(members, help_network),
        "ai_summary": ai_summary,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "llm_used": llm_used,
    }