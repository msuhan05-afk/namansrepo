"""Applier for Lever-hosted application forms (jobs.lever.co/<company>/<id>/apply)."""

import logging

from jobpilot.appliers import base
from jobpilot.appliers.base import ApplyResult
from jobpilot.config import Config

log = logging.getLogger("jobpilot.appliers.lever")


def apply(cfg: Config, job: dict, cover_letter: str) -> ApplyResult:
    url = job.get("apply_url") or job["url"]
    if not url.rstrip("/").endswith("/apply"):
        url = url.rstrip("/") + "/apply"
    resume = str(cfg.resolve(cfg.profile.resume_path))
    p = cfg.profile

    with base.browser_page(cfg.apply.headless) as page:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2000)

        if not base.fill_if_present(page, "input[name='email']", p.email):
            return ApplyResult(
                ApplyResult.NEEDS_REVIEW,
                f"could not find application form at {url}",
            )

        base.fill_if_present(page, "input[name='name']", p.full_name)
        base.fill_if_present(page, "input[name='phone']", p.phone)
        base.fill_if_present(page, "input[name='location']", p.location)
        base.fill_if_present(page, "input[name='urls[LinkedIn]']", p.linkedin)
        base.fill_if_present(page, "input[name='urls[GitHub]']", p.github)
        base.fill_if_present(page, "input[name='urls[Portfolio]'], input[name='urls[Other]']", p.website)

        base.upload_if_present(page, "input[name='resume']", resume)
        page.wait_for_timeout(3000)  # let the resume upload/parse finish

        base.fill_if_present(page, "textarea[name='comments']", cover_letter)

        missing = base.unanswered_required_fields(page)
        shot = base.screenshot(page, cfg.apply.screenshot_dir, job)

        if missing:
            return ApplyResult(
                ApplyResult.NEEDS_REVIEW,
                f"required questions need a human: {', '.join(missing[:8])} (screenshot: {shot})",
            )
        if not cfg.apply.enabled:
            return ApplyResult(ApplyResult.DRY_RUN, f"form filled, not submitted (screenshot: {shot})")

        submit = page.locator("button[type='submit'], #btn-submit").first
        if not submit.count():
            return ApplyResult(ApplyResult.NEEDS_REVIEW, f"no submit button found (screenshot: {shot})")
        submit.click()
        page.wait_for_timeout(5000)

        body = page.inner_text("body").lower()
        if "thank" in body or "submitted" in body:
            return ApplyResult(ApplyResult.SUBMITTED, "confirmation page detected")
        return ApplyResult(
            ApplyResult.NEEDS_REVIEW,
            f"submitted but no confirmation detected — verify manually (screenshot: {shot})",
        )
