from collections.abc import AsyncIterator, Mapping
from typing import Any

from langgraph.graph.state import CompiledStateGraph

from app.clients.llm import message_text
from app.models.api.ingredients import parse_ingredient_items
from app.workflows.product_analysis.state import ProductSnapshot, RAGState

# Product fields the client renders. The rest (raw ingredient text,
# additive tags) only feeds the prompts.
_PRODUCT_FIELDS = ("code", "name", "brands", "url", "nova_group", "nutriscore_grade")

def serialize_product(product: ProductSnapshot | None) -> dict | None:
    if not product:
        return None
    return {field: product.get(field) for field in _PRODUCT_FIELDS}


def serialize_state(values: dict[str, Any]) -> dict[str, Any]:
    """Client-safe view of a state delta.

    Whitelisted per key: the product is trimmed to what the UI needs.
    Keys absent from `values` stay absent.
    """
    payload: dict[str, Any] = {}
    if "search_query" in values:
        payload["search_query"] = values["search_query"]
    if "product" in values:
        payload["product"] = serialize_product(values["product"])
    if "ingredients" in values:
        payload["ingredients"] = parse_ingredient_items(values["ingredients"]) or []
    if "answer" in values:
        payload["answer"] = values["answer"]
    return payload


def to_client_event(event: Mapping[str, Any]) -> dict:
    """JSON-safe view of one LangChain `astream_events` record.

    The LangChain event name remains the public `type`. A node's
    `on_chain_end` also exposes its client-safe state delta as `update`.
    """
    metadata = event.get("metadata") or {}
    data = event.get("data") or {}
    node = metadata.get("langgraph_node")
    payload: dict[str, Any] = {
        "type": event.get("event"),
        "name": event.get("name"),
        "node": node,
    }

    content = message_text(data.get("chunk"))
    if content:
        payload["content"] = content

    is_node = node is not None and event.get("name") == node
    output = data.get("output")
    if (
        is_node
        and payload["type"] == "on_chain_end"
        and isinstance(output, dict)
    ):
        payload["update"] = serialize_state(output)
    return payload


async def stream_workflow(
    graph: CompiledStateGraph,
    state: RAGState,
) -> AsyncIterator[dict]:
    async for event in graph.astream_events(state, version="v2"):
        payload = to_client_event(event)
        if payload.get("type"):
            yield payload
