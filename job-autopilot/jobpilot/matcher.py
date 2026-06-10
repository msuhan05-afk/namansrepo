"""Keyword scoring of fetched jobs against the search config."""

import re

from jobpilot.config import Search


def _contains_word(text: str, keyword: str) -> bool:
    return re.search(r"(?<!\w)" + re.escape(keyword.lower()) + r"(?!\w)", text) is not None


def score_job(job: dict, search: Search) -> int:
    """Return a match score; -1 means rejected by a hard filter."""
    title = (job.get("title") or "").lower()
    description = (job.get("description") or "").lower()
    location = (job.get("location") or "").lower()

    for kw in search.exclude_keywords:
        if _contains_word(title, kw):
            return -1

    if search.locations:
        if not any(loc.lower() in location for loc in search.locations if loc):
            # Many remote listings leave location blank — don't reject those.
            if location:
                return -1

    score = 0
    for kw in search.keywords:
        if _contains_word(title, kw):
            score += 2
        elif _contains_word(description, kw):
            score += 1
    return score
