from typing import AsyncGenerator

from app.llm.streaming import streaming_llm
from app.rag.pipeline import build_graph
from app.rag.state import RAGState
from app.services.external_api_service import ProductNotFoundError


async def chat_service(query: str) -> AsyncGenerator[dict, None]:
    graph = build_graph()
    state = RAGState(
        question=query,
        search_query="",
        answer="",
        product=None,
        ingredients=[],
    )
    try:
        async for event in streaming_llm(graph, state):
            yield event
        yield {"type": "done"}
    except ProductNotFoundError:
        yield {
            "type": "error",
            "message": "NOT_FOUND: We could not find that product.",
        }
    except Exception:
        yield {"type": "error", "message": "Could not analyze the product."}
