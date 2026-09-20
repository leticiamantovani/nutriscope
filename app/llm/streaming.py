from typing import Any, AsyncGenerator

from app.llm.client import message_text
from app.graph.state import RAGState
from app.schema.chat import parse_ingredient_items


def to_client_event(event: dict[str, Any]) -> dict:
    """JSON-safe view of one LangChain `astream_events` record.

    Keeps LangChain's event name as `type`. Extra fields are only filled
    when the payload is serializable (visible token text, ingredient list).
    """
    metadata = event.get("metadata") or {}
    data = event.get("data") or {}
    payload: dict[str, Any] = {
        "type": event.get("event"),
        "name": event.get("name"),
        "node": metadata.get("langgraph_node"),
    }
    content = message_text(data.get("chunk"))
    if content:
        payload["content"] = content
    output = data.get("output")
    if isinstance(output, dict):
        items = parse_ingredient_items(output.get("ingredients"))
        if items:
            payload["items"] = items
    return payload


async def streaming_llm(graph, state: RAGState) -> AsyncGenerator[dict, None]:
    async for event in graph.astream_events(state, version="v2"):
        payload = to_client_event(event)
        if payload.get("type"):
            yield payload
