from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.workflows.product_analysis.nodes import (
    classify_ingredients_node,
    generate_answer_node,
    get_ingredients_info_node,
    structure_output_node,
)
from app.workflows.product_analysis.state import RAGState

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
