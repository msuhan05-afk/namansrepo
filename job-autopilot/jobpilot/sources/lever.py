"""Lever public postings API (api.lever.co/v0/postings)."""

import requests

API_URL = "https://api.lever.co/v0/postings/{company}?mode=json"


def fetch(company: str) -> list:
    resp = requests.get(API_URL.format(company=company), timeout=30)
    resp.raise_for_status()
    data = resp.json()

    jobs = []
    for item in data:
        jobs.append({
            "source": f"lever:{company}",
            "external_id": item.get("id"),
            "title": item.get("text", ""),
            "company": company,
            "location": (item.get("categories") or {}).get("location", ""),
            "url": item.get("hostedUrl", ""),
            "apply_url": item.get("applyUrl") or item.get("hostedUrl", ""),
            "description": item.get("descriptionPlain", ""),
        })
    return jobs
