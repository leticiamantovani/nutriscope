from typing import AsyncGenerator

from app.rag.state import RAGState
from app.schema.chat import parse_ingredient_items


async def streaming_llm(graph, state: RAGState) -> AsyncGenerator[dict, None]:
    async for update in graph.astream(state, stream_mode="updates"):
        for node, payload in update.items():
            if not isinstance(payload, dict):
                continue

            items = parse_ingredient_items(payload.get("ingredients"))
            if items:
                yield {"type": "ingredients", "items": items}

            if node == "generate_answer":
                content = payload.get("answer")
                if content:
                    yield {"type": "token", "content": content}
