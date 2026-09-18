import asyncio
import re
from typing import Any

import httpx

from app.core.config import (
    OPENFOODFACTS_BASE_URL,
    OPENFOODFACTS_SEARCH_URL,
    OPENFOODFACTS_TIMEOUT_SECONDS,
    OPENFOODFACTS_USER_AGENT,
)

PRODUCT_FIELDS = ",".join(
    [
        "code",
        "product_name",
        "product_name_en",
        "brands",
        "ingredients_text",
        "ingredients_text_en",
        "ingredients",
        "additives_tags",
        "nova_group",
        "nutriscore_grade",
    ]
)

_BARCODE_RE = re.compile(r"^\d{8,14}$")
_HEADERS = {
    "User-Agent": OPENFOODFACTS_USER_AGENT,
    "Accept": "application/json",
}
_RETRY_STATUSES = {502, 503, 504}


class ProductNotFoundError(Exception):
    """No matching product (or no usable ingredient list) in Open Food Facts."""


def is_barcode(query: str) -> bool:
    return bool(_BARCODE_RE.fullmatch(" ".join(query.split())))


async def search_product(query: str) -> dict:
    """Look up one Open Food Facts product for a user-typed name or barcode."""
    cleaned = " ".join(query.split())
    if not cleaned:
        raise ProductNotFoundError

    async with httpx.AsyncClient(
        headers=_HEADERS,
        timeout=OPENFOODFACTS_TIMEOUT_SECONDS,
        follow_redirects=True,
    ) as client:
        if is_barcode(cleaned):
            raw = await _fetch_product(client, cleaned)
        else:
            raw = await _fetch_by_name(client, cleaned)

    if raw is None:
        raise ProductNotFoundError
    return _normalize_product(raw)


async def _fetch_by_name(client: httpx.AsyncClient, query: str) -> dict | None:
    product = await _search_legacy(client, query)
    if product and _is_usable_product(product):
        return product

    codes = await _search_codes(client, query)
    for code in codes[:3]:
        candidate = await _fetch_product(client, code)
        if candidate and _is_usable_product(candidate):
            return candidate
    return None


async def _search_codes(client: httpx.AsyncClient, query: str) -> list[str]:
    try:
        payload = await _get_json(
            client,
            f"{OPENFOODFACTS_SEARCH_URL}/search",
            {
                "q": query,
                "page_size": 5,
                "langs": "en",
                "fields": "code,product_name,product_name_en,completeness,ingredients_n,unique_scans_n",
            },
        )
    except httpx.HTTPError:
        return []

    hits = [hit for hit in (payload.get("hits") or []) if isinstance(hit, dict)]
    hits.sort(key=lambda hit: _hit_rank(hit, query), reverse=True)
    codes: list[str] = []
    seen: set[str] = set()
    for hit in hits:
        code = str(hit.get("code") or "").strip()
        if code and code not in seen:
            seen.add(code)
            codes.append(code)
    return codes


def _hit_rank(hit: dict, query: str) -> tuple:
    name = str(hit.get("product_name_en") or hit.get("product_name") or "").casefold()
    q = query.casefold()
    try:
        ingredients_n = float(hit.get("ingredients_n") or 0)
    except (TypeError, ValueError):
        ingredients_n = 0
    try:
        completeness = float(hit.get("completeness") or 0)
    except (TypeError, ValueError):
        completeness = 0
    try:
        scans = float(hit.get("unique_scans_n") or 0)
    except (TypeError, ValueError):
        scans = 0
    return (
        int(ingredients_n >= 3),
        scans,
        completeness,
        int(name == q),
        int(name.startswith(q)),
    )


async def _search_legacy(client: httpx.AsyncClient, query: str) -> dict | None:
    try:
        payload = await _get_json(
            client,
            f"{OPENFOODFACTS_BASE_URL}/cgi/search.pl",
            {
                "search_terms": query,
                "search_simple": 1,
                "action": "process",
                "json": 1,
                "page_size": 5,
                "lc": "en",
                "fields": PRODUCT_FIELDS,
            },
        )
    except httpx.HTTPError:
        return None
    products = [item for item in (payload.get("products") or []) if isinstance(item, dict)]
    usable = [item for item in products if _is_usable_product(item)]
    pool = usable or products
    return pool[0] if pool else None


async def _fetch_product(client: httpx.AsyncClient, code: str) -> dict | None:
    try:
        payload = await _get_json(
            client,
            f"{OPENFOODFACTS_BASE_URL}/api/v2/product/{code}",
            {"fields": PRODUCT_FIELDS},
        )
    except httpx.HTTPError:
        return None
    if payload.get("status") != 1:
        return None
    product = payload.get("product")
    return product if isinstance(product, dict) else None


async def _get_json(
    client: httpx.AsyncClient,
    url: str,
    params: dict[str, Any],
) -> dict:
    response: httpx.Response | None = None
    for attempt in range(3):
        response = await client.get(url, params=params)
        if response.status_code in _RETRY_STATUSES and attempt < 2:
            await asyncio.sleep(0.4 * (attempt + 1))
            continue
        response.raise_for_status()
        payload = response.json()
        return payload if isinstance(payload, dict) else {}
    assert response is not None
    response.raise_for_status()
    return {}


def _normalize_product(product: dict) -> dict:
    code = str(product.get("code") or "").strip()
    name = (
        str(product.get("product_name_en") or "").strip()
        or str(product.get("product_name") or "").strip()
        or "Unknown product"
    )
    brands = product.get("brands")
    if isinstance(brands, list):
        brands_text = ", ".join(str(item) for item in brands if item)
    else:
        brands_text = str(brands or "").strip()
    ingredients_text = (
        str(product.get("ingredients_text_en") or "").strip()
        or str(product.get("ingredients_text") or "").strip()
    )
    ingredient_names = _ingredient_names(product)
    if not _is_usable_product(product):
        raise ProductNotFoundError

    nova_group = product.get("nova_group")
    try:
        nova = int(nova_group) if nova_group is not None else None
    except (TypeError, ValueError):
        nova = None

    grade = product.get("nutriscore_grade")
    nutriscore = str(grade).strip().lower() if grade else None

    return {
        "code": code,
        "name": name,
        "brands": brands_text,
        "url": f"https://world.openfoodfacts.org/product/{code}" if code else "",
        "ingredients_text": ingredients_text,
        "ingredient_names": ingredient_names,
        "additives_tags": [
            str(tag) for tag in (product.get("additives_tags") or []) if tag
        ],
        "nova_group": nova,
        "nutriscore_grade": nutriscore,
    }


def _is_usable_product(product: dict) -> bool:
    return len(_ingredient_names(product)) >= 2


def _ingredient_names(product: dict) -> list[str]:
    names: list[str] = []
    seen: set[str] = set()
    for item in product.get("ingredients") or []:
        if not isinstance(item, dict):
            continue
        name = _name_from_ingredient(item)
        key = name.casefold()
        if name and key not in seen:
            seen.add(key)
            names.append(name)
    if names:
        return names

    text = (
        str(product.get("ingredients_text_en") or "").strip()
        or str(product.get("ingredients_text") or "").strip()
    )
    for part in re.split(r"[,;]", text):
        name = _humanize(part)
        key = name.casefold()
        if name and key not in seen:
            seen.add(key)
            names.append(name)
    return names


def _name_from_ingredient(item: dict) -> str:
    ingredient_id = str(item.get("id") or "")
    if ingredient_id.startswith("en:"):
        return _humanize(ingredient_id.removeprefix("en:").replace("-", " "))
    return _humanize(str(item.get("text") or ""))


def _humanize(value: str) -> str:
    cleaned = re.sub(r"\s+", " ", value).strip(" .")
    cleaned = re.sub(r"\s*\([^)]*\)\s*$", "", cleaned).strip()
    if not cleaned:
        return ""
    return cleaned[:1].upper() + cleaned[1:]
