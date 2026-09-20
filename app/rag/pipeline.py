from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.rag.constants import (
    CLASSIFY_INGREDIENTS,
    GENERATE_ANSWER,
    GET_INGREDIENTS_INFO,
    STRUCTURED_OUTPUT,
)
from app.rag.nodes import (
    classify_ingredients_node,
    generate_answer_node,
    get_ingredients_info_node,
    structure_output_node,
)
from app.rag.state import RAGState


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
