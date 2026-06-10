"""Greenhouse public job board API (boards-api.greenhouse.io)."""

import html
import re

import requests

API_URL = "https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true"


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", " ", html.unescape(text or ""))


def fetch(board: str) -> list:
    resp = requests.get(API_URL.format(board=board), timeout=30)
    resp.raise_for_status()
    data = resp.json()

    jobs = []
    for item in data.get("jobs", []):
        url = item.get("absolute_url", "")
        jobs.append({
            "source": f"greenhouse:{board}",
            "external_id": item.get("id"),
            "title": item.get("title", ""),
            "company": board,
            "location": (item.get("location") or {}).get("name", ""),
            "url": url,
            "apply_url": url,
            "description": _strip_html(item.get("content", "")),
        })
    return jobs
