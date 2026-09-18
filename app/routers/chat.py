from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schema.chat import AnalyzeRequest, to_sse
from app.services.chat_service import chat_service

router = APIRouter()


@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    async def event_stream():
        async for event in chat_service(body.query):
            yield to_sse(event)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
