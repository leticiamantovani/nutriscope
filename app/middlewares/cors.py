from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import ALLOWED_ORIGIN_REGEX, ALLOWED_ORIGINS


def add_cors_middleware(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_origin_regex=ALLOWED_ORIGIN_REGEX,
        allow_methods=["*"],
        allow_headers=["*"],
    )
