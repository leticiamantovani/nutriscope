from app.llm.client import get_model
from app.rag.pipeline import RAGState
from app.schema.structured_output import StructuredOutput
from app.services.external_api_service import get_external_api_data
from app.rag.prompt_builder import build_prompt


async def structure_output_node(state: RAGState) -> dict:
    model = get_model(model_name="gemini-3.7-flash", config={
        "thinking_level": "medium",
        "structured_output": StructuredOutput
    })
    response = await model.ainvoke(state["question"])
    return {"answer": response.text}


async def get_ingredients_info_node(state: RAGState) -> dict:
    ingredients = await get_external_api_data(state["foods"])
    return {"ingredients": ingredients}

async def generate_answer_node(state: RAGState) -> dict:
    model = get_model(model_name="gemini-3.7-flash", config={
        "thinking_level": "high",
    })
    prompt = await build_prompt(
        question=state["question"],
        ingredients=state["ingredients"],
        foods=state["foods"],
    )
    response = await model.ainvoke(prompt)
    return {"answer": response.text}