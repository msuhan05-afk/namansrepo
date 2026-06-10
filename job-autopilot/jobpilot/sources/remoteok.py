"""RemoteOK public API (https://remoteok.com/api)."""

import requests

API_URL = "https://remoteok.com/api"
HEADERS = {"User-Agent": "jobpilot/0.1 (personal job search tool)"}


def fetch() -> list:
    resp = requests.get(API_URL, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    jobs = []
    for item in data:
        # The first element is a legal notice, not a job.
        if not isinstance(item, dict) or "position" not in item:
            continue
        jobs.append({
            "source": "remoteok",
            "external_id": item.get("id"),
            "title": item.get("position", ""),
            "company": item.get("company", ""),
            "location": item.get("location") or "remote",
            "url": item.get("url", ""),
            "apply_url": item.get("apply_url") or item.get("url", ""),
            "description": " ".join(
                [item.get("description", "")] + list(item.get("tags") or [])
            ),
        })
    return jobs
