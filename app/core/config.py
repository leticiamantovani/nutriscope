from pathlib import Path

from dotenv import load_dotenv
import os

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

OPENFOODFACTS_BASE_URL = os.getenv(
    "OPENFOODFACTS_BASE_URL", "https://world.openfoodfacts.org"
).rstrip("/")
OPENFOODFACTS_SEARCH_URL = os.getenv(
    "OPENFOODFACTS_SEARCH_URL", "https://search.openfoodfacts.org"
).rstrip("/")
# Open Food Facts blocks unidentified clients. Use AppName/Version (contact).
OPENFOODFACTS_USER_AGENT = os.getenv(
    "OPENFOODFACTS_USER_AGENT",
    "NutriScope/0.1 (https://world.openfoodfacts.org)",
)
OPENFOODFACTS_TIMEOUT_SECONDS = float(os.getenv("OPENFOODFACTS_TIMEOUT_SECONDS", "20"))
