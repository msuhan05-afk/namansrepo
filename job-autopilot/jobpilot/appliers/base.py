"""Shared browser plumbing for appliers."""

import logging
import re
from contextlib import contextmanager
from pathlib import Path

log = logging.getLogger("jobpilot.appliers")


class ApplyResult:
    SUBMITTED = "applied"
    DRY_RUN = "dry_run"
    NEEDS_REVIEW = "needs_review"
    FAILED = "failed"

    def __init__(self, status: str, notes: str = ""):
        self.status = status
        self.notes = notes


@contextmanager
def browser_page(headless: bool):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()
        try:
            yield page
        finally:
            browser.close()


def fill_if_present(page, selector: str, value: str) -> bool:
    if not value:
        return False
    el = page.locator(selector).first
    if el.count() and el.is_visible():
        el.fill(value)
        return True
    return False


def upload_if_present(page, selector: str, file_path: str) -> bool:
    el = page.locator(selector).first
    if el.count():
        el.set_input_files(file_path)
        return True
    return False


def unanswered_required_fields(page) -> list:
    """Names of visible required inputs/selects/textareas still left empty.

    Used as a safety gate: if a form has required custom questions we can't
    answer, we bail out instead of submitting a half-filled application.
    """
    names = []
    for el in page.locator(
        "input[required], select[required], textarea[required], [aria-required='true']"
    ).all():
        try:
            if not el.is_visible():
                continue
            tag = el.evaluate("e => e.tagName.toLowerCase()")
            input_type = (el.get_attribute("type") or "").lower()
            if input_type in ("checkbox", "radio"):
                continue  # group-level requiredness is unreliable to detect
            value = el.input_value() if tag in ("input", "textarea", "select") else ""
            if not value.strip():
                label = (
                    el.get_attribute("aria-label")
                    or el.get_attribute("name")
                    or el.get_attribute("id")
                    or tag
                )
                names.append(label)
        except Exception:
            continue
    return names


def screenshot(page, directory: str, job: dict) -> str:
    Path(directory).mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", f"{job['company']}-{job['title']}".lower())[:80]
    path = str(Path(directory) / f"{slug}-{job['external_id']}.png")
    page.screenshot(path=path, full_page=True)
    return path
