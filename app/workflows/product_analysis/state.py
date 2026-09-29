from typing import TypedDict


class ProductSnapshot(TypedDict):
    code: str
    name: str
    brands: str
    url: str
    ingredients_text: str
    ingredient_names: list[str]
    additives_tags: list[str]
    nova_group: int | None
    nutriscore_grade: str | None


class RAGState(TypedDict):
    question: str
    search_query: str
    answer: str
    product: ProductSnapshot | None
    ingredients: list[dict]
