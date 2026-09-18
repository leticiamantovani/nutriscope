from typing import TypedDict

from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.rag.nodes import structure_output_node, get_ingredients_info_node, generate_answer_node


class RAGState(TypedDict):
    question: str
    answer: str
    foods: list[str]
    ingredients: list[str]


def build_graph() -> CompiledStateGraph:

    graph = StateGraph(RAGState)
    graph.add_node("structured_output", structure_output_node)
    graph.add_node("get_ingredients_info", get_ingredients_info_node)
    graph.add_node("generate_answer", generate_answer_node)
    graph.set_entry_point("structured_output")
    graph.add_edge("structured_output", "get_ingredients_info")
    graph.add_edge("get_ingredients_info", "generate_answer")
    graph.add_edge("generate_answer", END)
    return graph.compile()

