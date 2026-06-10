"""Applier for Greenhouse-hosted application forms (boards.greenhouse.io
and job-boards.greenhouse.io).
"""

import logging

from jobpilot.appliers import base
from jobpilot.appliers.base import ApplyResult
from jobpilot.config import Config

log = logging.getLogger("jobpilot.appliers.greenhouse")


def apply(cfg: Config, job: dict, cover_letter: str) -> ApplyResult:
    url = job.get("apply_url") or job["url"]
    resume = str(cfg.resolve(cfg.profile.resume_path))
    p = cfg.profile

    with base.browser_page(cfg.apply.headless) as page:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2000)

        # Greenhouse uses stable ids on its standard fields across both the
        # legacy and current hosted layouts.
        filled_email = (
            base.fill_if_present(page, "#email", p.email)
            or base.fill_if_present(page, "input[name='job_application[email]']", p.email)
        )
        if not filled_email:
            return ApplyResult(
                ApplyResult.NEEDS_REVIEW,
                f"could not find application form at {url}",
            )

        base.fill_if_present(page, "#first_name", p.first_name)
        base.fill_if_present(page, "#last_name", p.last_name)
        base.fill_if_present(page, "#phone", p.phone)
        base.fill_if_present(page, "#candidate-location, input[autocomplete='address-level2']", p.location)
        base.fill_if_present(page, "input[name*='LinkedIn' i], input[id*='linkedin' i]", p.linkedin)
        base.fill_if_present(page, "input[name*='GitHub' i], input[id*='github' i]", p.github)
        base.fill_if_present(page, "input[name*='Website' i], input[id*='website' i]", p.website)

        if not base.upload_if_present(page, "input[type='file'][id*='resume'], input[type='file'][name*='resume']", resume):
            base.upload_if_present(page, "input[type='file']", resume)
        page.wait_for_timeout(3000)  # let the resume upload/parse finish

        base.fill_if_present(page, "textarea[id*='cover_letter'], textarea[name*='cover_letter']", cover_letter)

        missing = base.unanswered_required_fields(page)
        shot = base.screenshot(page, cfg.apply.screenshot_dir, job)

        if missing:
            return ApplyResult(
                ApplyResult.NEEDS_REVIEW,
                f"required questions need a human: {', '.join(missing[:8])} (screenshot: {shot})",
            )
        if not cfg.apply.enabled:
            return ApplyResult(ApplyResult.DRY_RUN, f"form filled, not submitted (screenshot: {shot})")

        submit = page.locator("#submit_app, button[type='submit'], input[type='submit']").first
        if not submit.count():
            return ApplyResult(ApplyResult.NEEDS_REVIEW, f"no submit button found (screenshot: {shot})")
        submit.click()
        page.wait_for_timeout(5000)

        body = page.inner_text("body").lower()
        if "thank" in body or "application" in body and "submitted" in body:
            return ApplyResult(ApplyResult.SUBMITTED, "confirmation page detected")
        return ApplyResult(
            ApplyResult.NEEDS_REVIEW,
            f"submitted but no confirmation detected — verify manually (screenshot: {shot})",
        )
