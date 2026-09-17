from dotenv import load_dotenv
import os
from httpx import URL

load_dotenv()

external_api_url: str | URL = os.environ["EXTERNAL_API_URL"]