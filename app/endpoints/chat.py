import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.agent_executors.pipeline import execute_agent
from app.models.api.chat import AnalyzeRequest

router = APIRouter()


@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    async def event_stream():
        async for event in execute_agent(body.query):
            yield _to_sse(event)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


def _to_sse(event: dict) -> str:
    name = event.get("type", "message")
    payload = json.dumps(event, ensure_ascii=False)
    return f"event: {name}\ndata: {payload}\n\n"
