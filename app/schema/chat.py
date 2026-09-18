import json
from typing import Any, Literal

from pydantic import BaseModel, TypeAdapter, ValidationError


class AnalyzeRequest(BaseModel):
    query: str


class FlaggedIngredient(BaseModel):
    name: str
    verdict: Literal["adequate", "moderate", "avoid", "carcinogenic"]
    source: Literal["database", "estimated"]


_ingredients_adapter = TypeAdapter(list[FlaggedIngredient])


def parse_ingredient_items(raw: Any) -> list[dict] | None:
    try:
        return [item.model_dump() for item in _ingredients_adapter.validate_python(raw)]
    except ValidationError:
        return None


def to_sse(event: dict) -> str:
    return f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
