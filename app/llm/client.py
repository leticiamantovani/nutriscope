from typing import Any

from langchain_google_genai import ChatGoogleGenerativeAI


def get_model(model_name: str, config: dict) -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model=model_name,
        **config,
    )


def message_text(response: Any) -> str:
    """Visible text from a chat model message or stream chunk."""
    if response is None:
        return ""

    # Prefer the `.text` property. TextAccessor is a str subclass and also
    # callable (deprecated `.text()`), so check `str` before calling.
    text = getattr(response, "text", None)
    if isinstance(text, str) and text:
        return text
    if callable(text) and not isinstance(text, str):
        try:
            text = text()
        except TypeError:
            pass
        if isinstance(text, str) and text:
            return text

    content = (
        response.get("content")
        if isinstance(response, dict)
        else getattr(response, "content", None)
    )
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and block.get("type") == "text":
                piece = block.get("text")
                if isinstance(piece, str):
                    parts.append(piece)
        return "".join(parts)
    return ""
