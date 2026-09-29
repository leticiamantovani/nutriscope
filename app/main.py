from fastapi import FastAPI

from app.endpoints import chat
from app.middlewares.cors import add_cors_middleware

app = FastAPI()

add_cors_middleware(app)
app.include_router(chat.router)
