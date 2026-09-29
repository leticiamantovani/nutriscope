import json


def to_sse(event: dict) -> str:
    name = event.get("type", "message")
    payload = json.dumps(event, ensure_ascii=False)
    return f"event: {name}\ndata: {payload}\n\n"
