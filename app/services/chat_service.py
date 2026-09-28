from typing import AsyncGenerator

from app.graph.pipeline import GRAPH
from app.graph.state import RAGState
from app.llm.streaming import streaming_llm
from app.services.external_api_service import ProductNotFoundError


async def chat_service(query: str) -> AsyncGenerator[dict, None]:
    state = RAGState(
        question=query,
        search_query="",
        answer="",
        product=None,
        ingredients=[],
    )
    # Node of the last event. The graph is sequential, so on failure it is
    # the node that raised (`None` = outside any node).
    node = None
    try:
        async for event in streaming_llm(GRAPH, state):
            node = event.get("node")
            yield event
        yield {"type": "done"}
    except ProductNotFoundError:
        yield _error(node, "NOT_FOUND: We could not find that product.")
    except Exception:
        yield _error(node, "Could not analyze the product.")


def _error(node: str | None, message: str) -> dict:
    return {
        "type": "error",
        "node": node,
        "message": message,
    }
