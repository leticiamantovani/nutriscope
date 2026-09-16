from fastapi import APIRouter

router = APIRouter()

@router.get("/response")
async def chat():
    return {"hello": "word"}
