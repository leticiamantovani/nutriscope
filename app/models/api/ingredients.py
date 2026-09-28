from typing import Any, Literal

from pydantic import BaseModel, Field, TypeAdapter, ValidationError


class FlaggedIngredient(BaseModel):
    name: str
    verdict: Literal["adequate", "moderate", "avoid", "carcinogenic"]
    source: Literal["database", "estimated"]


class ProductExtraction(BaseModel):
    """Product the user wants looked up in Open Food Facts."""

    product_name: str = Field(
        description="Packaged food to search, e.g. Nutella, instant noodles, or a barcode. Empty if none."
    )
    brand: str | None = Field(
        default=None,
        description="Brand only if the user named one.",
    )


class IngredientClassification(BaseModel):
    ingredients: list[FlaggedIngredient]


_ingredients_adapter = TypeAdapter(list[FlaggedIngredient])


def parse_ingredient_items(raw: Any) -> list[dict] | None:
    try:
        return [item.model_dump() for item in _ingredients_adapter.validate_python(raw)]
    except ValidationError:
        return None
