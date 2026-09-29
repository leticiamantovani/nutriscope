from collections.abc import AsyncIterator

from app.workflow_executor.streaming import stream_workflow
from app.workflows.product_analysis.definition import GRAPH
from app.workflows.product_analysis.state import RAGState


async def execute_product_analysis(query: str) -> AsyncIterator[dict]:
    state = RAGState(
        question=query,
        search_query="",
        answer="",
        product=None,
        ingredients=[],
    )
    async for event in stream_workflow(GRAPH, state):
        yield event
