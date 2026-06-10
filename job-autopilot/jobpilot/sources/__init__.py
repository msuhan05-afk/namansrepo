"""Job sources. Each fetcher returns a list of normalized job dicts with keys:
source, external_id, title, company, location, url, apply_url, description.
"""

import logging

from jobpilot.config import Sources
from jobpilot.sources import greenhouse, lever, remoteok

log = logging.getLogger("jobpilot.sources")


def fetch_all(sources: Sources) -> list:
    jobs = []
    if sources.remoteok:
        jobs += _safe(remoteok.fetch)
    for board in sources.greenhouse_boards:
        jobs += _safe(greenhouse.fetch, board)
    for company in sources.lever_companies:
        jobs += _safe(lever.fetch, company)
    return jobs


def _safe(fn, *args) -> list:
    try:
        result = fn(*args)
        log.info("%s%r returned %d jobs", fn.__module__.split(".")[-1], args, len(result))
        return result
    except Exception as e:
        log.warning("source %s%r failed: %s", fn.__module__.split(".")[-1], args, e)
        return []
