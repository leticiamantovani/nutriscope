from pydantic import BaseModel, Field

from app.schema.chat import FlaggedIngredient


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
