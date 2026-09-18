from typing import AsyncGenerator

from app.llm.streaming import streaming_llm
from app.rag.pipeline import build_graph
from app.rag.state import RAGState


async def chat_service(query: str) -> AsyncGenerator[dict, None]:
    graph = build_graph()
    state = RAGState(question=query, answer="", foods=[], ingredients=[])
    try:
        async for event in streaming_llm(graph, state):
            yield event
        yield {"type": "done"}
    except Exception:
        yield {"type": "error", "message": "Não foi possível analisar o produto."}
