def build_extraction_prompt(question: str) -> str:
    return f"""
You extract the packaged food a user wants analyzed.
Always think in English. Return only the structured fields.

User text: {question}

Rules:
- product_name is the commercial product or generic packaged food (Nutella, Oreo, instant noodles, cola soda).
- If they pasted a barcode, put the digits in product_name.
- brand is only if they named one (Ferrero, Nestlé). Otherwise null.
- If the text is already just a product name, copy it.
- If there is no identifiable product, leave product_name empty.
- Do not extract individual ingredients (sugar, palm oil) unless that is the product itself.
""".strip()


def build_classification_prompt(question: str, product: dict) -> str:
    additives = ", ".join(product.get("additives_tags") or []) or "none listed"
    nova = product.get("nova_group")
    nutriscore = product.get("nutriscore_grade") or "unknown"
    names = "\n".join(f"- {name}" for name in product.get("ingredient_names") or [])
    return f"""
You classify ingredients of a packaged food for a consumer app.
Always reply in English.

User query: {question}
Matched product: {product.get("name")}
Brand(s): {product.get("brands") or "unknown"}
Open Food Facts URL: {product.get("url") or "unknown"}
NOVA group: {nova if nova is not None else "unknown"}
Nutri-Score: {nutriscore}
Additives tags: {additives}
Ingredient list:
{names}

Rules:
- Classify every listed ingredient, in the same order, and no others.
- Use verdict "adequate", "moderate", "avoid", or "carcinogenic".
- Set source to "database" for every item (they come from Open Food Facts).
- Do not invent ingredients that are not in the list.
""".strip()


def build_explanation_prompt(question: str, product: dict, ingredients: list[dict]) -> str:
    flagged = "\n".join(
        f"- {item.get('name')} [{item.get('verdict')}]"
        for item in ingredients
    )
    return f"""
You are a helpful assistant that explains whether the ingredients of a packaged food are concerning.
Always reply in English. Write 2-4 short paragraphs, no markdown headings or bullet lists.

The user asked: {question}
Matched Open Food Facts product: {product.get("name")} ({product.get("brands") or "unknown brand"})
NOVA group: {product.get("nova_group")}
Nutri-Score: {product.get("nutriscore_grade")}
Classified ingredients:
{flagged}

Focus on the most concerning items first. Mention that the ingredient list comes from Open Food Facts and may differ from a specific package.
""".strip()
