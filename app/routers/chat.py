from fastapi import FastAPI

router = FastAPI()

@router.get("/response")
async def chat():
    return {"hello": "word"}