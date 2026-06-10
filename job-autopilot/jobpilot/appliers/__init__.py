"""Form-filling appliers. Greenhouse and Lever hosted application forms are
predictable enough to fill automatically; anything else is marked for manual
review rather than guessed at.
"""

from jobpilot.appliers import greenhouse, lever


def get_applier(job: dict):
    """Return the applier module for this job, or None if unsupported."""
    source = job.get("source", "")
    apply_url = job.get("apply_url") or job.get("url") or ""
    if source.startswith("greenhouse:") or "greenhouse.io" in apply_url:
        return greenhouse
    if source.startswith("lever:") or "jobs.lever.co" in apply_url:
        return lever
    return None
