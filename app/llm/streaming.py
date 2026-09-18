from typing import AsyncGenerator


from app.rag.pipeline import RAGState


async def streaming_llm(graph, state: RAGState) -> AsyncGenerator[str, None]:
    for event in graph.stream(state):
        yield event.text