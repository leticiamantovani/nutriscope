from collections.abc import AsyncIterator

from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.actions.agents.nodes import (
    classify_ingredients_node,
    generate_answer_node,
    get_ingredients_info_node,
    structure_output_node,
)
from app.agent_executors.state import RAGState
from app.agent_executors.streaming.handlers import streaming_llm
from app.services.external_api_service import ProductNotFoundError

STRUCTURED_OUTPUT = "structured_output"
GET_INGREDIENTS_INFO = "get_ingredients_info"
CLASSIFY_INGREDIENTS = "classify_ingredients"
GENERATE_ANSWER = "generate_answer"


def build_graph() -> CompiledStateGraph:
    graph = StateGraph(RAGState)
    graph.add_node(STRUCTURED_OUTPUT, structure_output_node)
    graph.add_node(GET_INGREDIENTS_INFO, get_ingredients_info_node)
    graph.add_node(CLASSIFY_INGREDIENTS, classify_ingredients_node)
    graph.add_node(GENERATE_ANSWER, generate_answer_node)
    graph.set_entry_point(STRUCTURED_OUTPUT)
    graph.add_edge(STRUCTURED_OUTPUT, GET_INGREDIENTS_INFO)
    graph.add_edge(GET_INGREDIENTS_INFO, CLASSIFY_INGREDIENTS)
    graph.add_edge(CLASSIFY_INGREDIENTS, GENERATE_ANSWER)
    graph.add_edge(GENERATE_ANSWER, END)
    return graph.compile()


# Topology is compiled once per process. Each request only supplies state.
GRAPH = build_graph()


async def execute_agent(query: str) -> AsyncIterator[dict]:
    state = RAGState(
        question=query,
        search_query="",
        answer="",
        product=None,
        ingredients=[],
    )
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
