from typing import TypedDict


class RAGState(TypedDict):
    question: str
    answer: str
    foods: list[str]
    ingredients: list[str]
