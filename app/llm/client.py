from langchain_google_genai import ChatGoogleGenerativeAI

def get_model(model_name: str, config: dict) -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model=model_name,
        **config,
    )