"""Cover letter generation: static template, or tailored per-job via Claude."""

import logging

from jobpilot.config import Config

log = logging.getLogger("jobpilot.cover_letter")

CLAUDE_MODEL = "claude-opus-4-8"


def generate(cfg: Config, job: dict) -> str:
    cl = cfg.apply.cover_letter
    if cl.mode == "claude":
        try:
            return _generate_with_claude(cfg, job)
        except Exception as e:
            log.warning("Claude cover letter failed (%s); falling back to template", e)
    return _from_template(cfg, job)


def _from_template(cfg: Config, job: dict) -> str:
    template = cfg.apply.cover_letter.template or (
        "Dear {company} hiring team,\n\n"
        "I'm excited to apply for the {title} role and believe my background "
        "is a strong fit.\n\nBest regards,\n{first_name} {last_name}"
    )
    return template.format(
        company=job.get("company", "your company"),
        title=job.get("title", "open"),
        first_name=cfg.profile.first_name,
        last_name=cfg.profile.last_name,
    )


def _generate_with_claude(cfg: Config, job: dict) -> str:
    import anthropic

    client = anthropic.Anthropic()
    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        system=(
            "You write short, specific, professional cover letters. "
            "Three paragraphs maximum, no placeholder text, no headers — "
            "output only the letter body, ready to paste into a form."
        ),
        messages=[{
            "role": "user",
            "content": (
                f"Candidate: {cfg.profile.full_name}\n"
                f"Candidate summary:\n{cfg.apply.cover_letter.candidate_summary}\n\n"
                f"Company: {job.get('company')}\n"
                f"Role: {job.get('title')}\n"
                f"Job description (may be truncated):\n{(job.get('description') or '')[:6000]}\n\n"
                "Write the cover letter."
            ),
        }],
    )
    return next(b.text for b in response.content if b.type == "text").strip()
