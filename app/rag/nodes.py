from langgraph.config import get_config

from app.llm.client import get_model, message_text
from app.rag.prompt_builder import (
    build_classification_prompt,
    build_explanation_prompt,
    build_extraction_prompt,
)
from app.rag.state import RAGState
from app.schema.structured_output import IngredientClassification, ProductExtraction
from app.services.external_api_service import (
    ProductNotFoundError,
    is_barcode,
    search_product,
)


async def structure_output_node(state: RAGState) -> dict:
    question = state["question"].strip()
    if is_barcode(question):
        return {"search_query": question}

    model = get_model(
        model_name="gemini-3.7-flash",
        config={"thinking_level": "medium"},
    ).with_structured_output(ProductExtraction)
    result = await model.ainvoke(build_extraction_prompt(question))
    extraction = (
        result
        if isinstance(result, ProductExtraction)
        else ProductExtraction.model_validate(result)
    )
    search_query = _search_query_from_extraction(extraction)
    if not search_query:
        raise ProductNotFoundError
    return {"search_query": search_query}


async def get_ingredients_info_node(state: RAGState) -> dict:
    product = await search_product(state["search_query"] or state["question"])
    return {"product": product}


async def classify_ingredients_node(state: RAGState) -> dict:
    product = state["product"]
    if not product:
        return {"ingredients": []}

    model = get_model(
        model_name="gemini-3.7-flash",
        config={"thinking_level": "medium"},
    ).with_structured_output(IngredientClassification)
    prompt = build_classification_prompt(state["question"], product)
    result = await model.ainvoke(prompt)
    classification = (
        result
        if isinstance(result, IngredientClassification)
        else IngredientClassification.model_validate(result)
    )
    return {"ingredients": [item.model_dump() for item in classification.ingredients]}


async def generate_answer_node(state: RAGState) -> dict:
    product = state["product"]
    if not product:
        return {"answer": ""}

    model = get_model(
        model_name="gemini-3.7-flash",
        config={"thinking_level": "high"},
    )
    prompt = build_explanation_prompt(
        question=state["question"],
        product=product,
        ingredients=state["ingredients"],
    )
    pieces: list[str] = []
    async for chunk in model.astream(prompt, config=_runnable_config()):
        text = message_text(chunk)
        if text:
            pieces.append(text)
    return {"answer": "".join(pieces)}


def _search_query_from_extraction(extraction: ProductExtraction) -> str:
    name = " ".join(extraction.product_name.split())
    brand = " ".join((extraction.brand or "").split())
    if brand and brand.casefold() not in name.casefold():
        return f"{brand} {name}".strip()
    return name


def _runnable_config():
    try:
        return get_config()
    except Exception:
        return None
