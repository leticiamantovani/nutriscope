import httpx
from core.config import external_api_url

async def get_external_api_data(foods: list[str]) -> dict:
    response = httpx.get(external_api_url, params={"foods": foods})
    return response.json()