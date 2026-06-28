import json
from pathlib import Path

def get_events():
    json_dir = Path(__file__).parent.parent.parent
    with open (json_dir/"data"/"synthetic_events.json", "r", encoding="utf-8") as f:
        events = json.load(f)
    return events