


def build_prompt(question: str, ingredients: list[str], foods: list[str]) -> str:
    return f"""
    You are a helpful assistant that can answer questions about whether the ingredients of a product are bad, harmful, or not.
    The question is: {question}
    The ingredients are: {ingredients}
    The foods are: {foods}
    """