from collections.abc import AsyncIterator

from app.clients.open_food_facts import ProductNotFoundError
from app.workflow_executor.pipeline import execute_product_analysis


async def analyze_product(query: str) -> AsyncIterator[dict]:
    node = None
    try:
        async for event in execute_product_analysis(query):
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
