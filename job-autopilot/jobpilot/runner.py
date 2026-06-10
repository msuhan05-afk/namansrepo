"""One pass of the pipeline: fetch → score → queue → apply."""

import logging
import random
import time

from jobpilot import appliers, cover_letter, sources
from jobpilot.appliers.base import ApplyResult
from jobpilot.config import Config
from jobpilot.db import JobDB
from jobpilot.matcher import score_job

log = logging.getLogger("jobpilot.runner")


def run_once(cfg: Config) -> dict:
    db = JobDB(str(cfg.resolve(cfg.database)))
    stats = {"fetched": 0, "new": 0, "matched": 0, "applied": 0,
             "dry_run": 0, "needs_review": 0, "failed": 0}

    # 1. Fetch + score
    jobs = sources.fetch_all(cfg.sources)
    stats["fetched"] = len(jobs)
    descriptions = {}
    for job in jobs:
        score = score_job(job, cfg.search)
        status = "matched" if score >= cfg.search.min_score else "new"
        if db.upsert_job(job, score, status):
            stats["new"] += 1
            if status == "matched":
                stats["matched"] += 1
                log.info("MATCH (%d) %s — %s", score, job["title"], job["company"])
        descriptions[(job["source"], str(job["external_id"]))] = job.get("description", "")

    # 2. Apply to the best pending matches
    queue = db.pending_applications(cfg.apply.max_per_run)
    if queue and not cfg.apply.enabled:
        log.info("apply.enabled is false — running in dry-run mode (forms filled, never submitted)")

    for row in queue:
        row["description"] = descriptions.get((row["source"], row["external_id"]), "")
        result = _apply_to(cfg, row)
        db.set_status(row["source"], row["external_id"], result.status, result.notes)
        stats[result.status] = stats.get(result.status, 0) + 1
        log.info("%s: %s — %s (%s)", result.status.upper(), row["title"], row["company"], result.notes)
        if result.status == ApplyResult.SUBMITTED:
            # Pace submissions like a human would; hammering boards gets you blocked.
            time.sleep(random.uniform(20, 60))

    return stats


def _apply_to(cfg: Config, job: dict) -> ApplyResult:
    applier = appliers.get_applier(job)
    if applier is None:
        return ApplyResult(
            ApplyResult.NEEDS_REVIEW,
            f"no automated applier for this board — apply manually: {job['url']}",
        )
    try:
        letter = cover_letter.generate(cfg, job)
        return applier.apply(cfg, job, letter)
    except ImportError:
        return ApplyResult(
            ApplyResult.FAILED,
            "playwright not installed — run: pip install playwright && playwright install chromium",
        )
    except Exception as e:
        log.exception("applier crashed for %s", job["url"])
        return ApplyResult(ApplyResult.FAILED, f"{type(e).__name__}: {e}")
