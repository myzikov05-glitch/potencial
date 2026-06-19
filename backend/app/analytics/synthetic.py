import json
import random
from datetime import datetime, timedelta
from pathlib import Path

SEED = 42  

WEEKS = 5  
START_MONDAY = datetime(2026, 5, 4)  

OUTPUT_FILE = Path("data/synthetic_events.json")  

TEAM = [
    {"id": "u1", "name": "А.", "display_name": "Артём Волков",   "role": "backend",  "persona": "overloaded"},
    {"id": "u2", "name": "П.", "display_name": "Павел Орлов",    "role": "backend",  "persona": "underloaded"},
    {"id": "u3", "name": "И.", "display_name": "Ирина Соколова", "role": "frontend", "persona": "stagnating"},
    {"id": "u4", "name": "К.", "display_name": "Кирилл Дорохов", "role": "frontend", "persona": "growing"},
    {"id": "u5", "name": "М.", "display_name": "Мария Зайцева",  "role": "backend",  "persona": "helper"},
    {"id": "u6", "name": "Л.", "display_name": "Леонид Беляев",  "role": "analyst",  "persona": "normal"},
    {"id": "u7", "name": "В.", "display_name": "Вера Кузнецова", "role": "analyst",  "persona": "normal"},
]

DISPLAY_NAMES = {m["id"]: m["display_name"] for m in TEAM}
ROLES = {m["id"]: m["role"] for m in TEAM}

PERSONAS = {
    "overloaded":  {"tasks": (6, 8),  "meetings_hours": (10, 14), "commits": (15, 25), "reviews": (0, 1), "complexity": "high"},
    "underloaded": {"tasks": (1, 2),  "meetings_hours": (1, 3),   "commits": (2, 5),   "reviews": (0, 1), "complexity": "low"},
    "stagnating":  {"tasks": (3, 4),  "meetings_hours": (3, 5),   "commits": (8, 12),  "reviews": (1, 2), "complexity": "flat"},
    "growing":     {"tasks": (3, 4),  "meetings_hours": (3, 5),   "commits": (8, 12),  "reviews": (1, 2), "complexity": "rising"},
    "helper":      {"tasks": (2, 3),  "meetings_hours": (4, 6),   "commits": (6, 10),  "reviews": (5, 8), "complexity": "medium"},
    "normal":      {"tasks": (3, 4),  "meetings_hours": (4, 6),   "commits": (8, 12),  "reviews": (1, 3), "complexity": "medium"},
}

def pick_complexity(mode: str, week_index: int) -> int:
    if mode == "flat":
        return random.choice([2, 3])
    if mode == "rising":
        ladder = [[1, 2], [2, 3], [3, 5], [5, 8], [5, 8]]
        return random.choice(ladder[min(week_index, len(ladder) - 1)])
    if mode == "high":
        return random.choice([5, 8])
    if mode == "low":
        return random.choice([1, 2])
    return random.choice([2, 3, 5])  


def random_ts_in_week(week_start: datetime) -> datetime:
    day_offset = random.randint(0, 4)           
    hour = random.randint(9, 18)
    minute = random.choice([0, 15, 30, 45])
    return week_start + timedelta(days=day_offset, hours=hour, minutes=minute)


def make_event(person_id: str, etype: str, ts: datetime, source: str, payload: dict) -> dict:
    return {
        "person_id": person_id,
        "type": etype,
        "ts": ts.isoformat(timespec="minutes"),
        "source": source,
        "payload": payload,
    }

def generate_events() -> list[dict]:
    events: list[dict] = []
    task_counter = 0  
    tasks_by_author: list[tuple[str, str]] = []  

    for week_index in range(WEEKS):
        week_start = START_MONDAY + timedelta(weeks=week_index)

        for member in TEAM:
            pid = member["id"]
            profile = PERSONAS[member["persona"]]

            n_tasks = random.randint(*profile["tasks"])
            for _ in range(n_tasks):
                task_counter += 1
                task_id = f"T-{task_counter}"
                complexity = pick_complexity(profile["complexity"], week_index)
                events.append(make_event(
                    pid, "task_closed", random_ts_in_week(week_start), "jira",
                    {"task_id": task_id, "complexity": complexity},
                ))
                tasks_by_author.append((task_id, pid))

            n_commits = random.randint(*profile["commits"])
            for _ in range(n_commits):
                events.append(make_event(
                    pid, "commit", random_ts_in_week(week_start), "git", {},
                ))

            total_meeting_hours = random.randint(*profile["meetings_hours"])
            remaining = total_meeting_hours
            while remaining > 0:
                dur = min(remaining, random.choice([1, 2]))  
                events.append(make_event(
                    pid, "meeting", random_ts_in_week(week_start), "calendar",
                    {"duration_hours": dur},
                ))
                remaining -= dur

            n_reviews = random.randint(*profile["reviews"])
            others = [t for t in tasks_by_author if t[1] != pid]
            for _ in range(n_reviews):
                if not others:
                    break
                target_task, target_author = random.choice(others)
                events.append(make_event(
                    pid, "review", random_ts_in_week(week_start), "git",
                    {"reviewed_task_id": target_task, "reviewed_author_id": target_author},
                ))

    events.sort(key=lambda e: e["ts"])
    return events


def main() -> None:
    random.seed(SEED)
    events = generate_events()

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=2)

    by_type: dict[str, int] = {}
    for e in events:
        by_type[e["type"]] = by_type.get(e["type"], 0) + 1


if __name__ == "__main__":
    main()