from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.actions.product_analysis.analyze_product import analyze_product
from app.api.formatters.sse import to_sse
from app.models.api.chat import AnalyzeRequest

router = APIRouter()


@router.post("/analyze")
async def analyze(body: AnalyzeRequest):
    async def event_stream():
        async for event in analyze_product(body.query):
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
