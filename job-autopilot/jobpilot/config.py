"""Configuration loading and validation."""

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml


@dataclass
class Profile:
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""
    resume_path: str = ""

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()


@dataclass
class Search:
    keywords: list = field(default_factory=list)
    exclude_keywords: list = field(default_factory=list)
    locations: list = field(default_factory=list)
    min_score: int = 2


@dataclass
class Sources:
    remoteok: bool = True
    greenhouse_boards: list = field(default_factory=list)
    lever_companies: list = field(default_factory=list)


@dataclass
class CoverLetter:
    mode: str = "template"
    template: str = ""
    candidate_summary: str = ""


@dataclass
class Apply:
    enabled: bool = False
    max_per_run: int = 5
    headless: bool = True
    screenshot_dir: str = "./screenshots"
    cover_letter: CoverLetter = field(default_factory=CoverLetter)


@dataclass
class Config:
    profile: Profile = field(default_factory=Profile)
    search: Search = field(default_factory=Search)
    sources: Sources = field(default_factory=Sources)
    apply: Apply = field(default_factory=Apply)
    loop_interval_minutes: int = 240
    database: str = "./jobpilot.db"
    base_dir: Path = field(default_factory=Path.cwd)

    def resolve(self, path: str) -> Path:
        p = Path(os.path.expanduser(path))
        return p if p.is_absolute() else self.base_dir / p


def load_config(path: str) -> Config:
    config_path = Path(path).resolve()
    with open(config_path) as f:
        raw = yaml.safe_load(f) or {}

    base_dir = config_path.parent
    cl_raw = (raw.get("apply") or {}).pop("cover_letter", {}) or {}
    cfg = Config(
        profile=Profile(**(raw.get("profile") or {})),
        search=Search(**(raw.get("search") or {})),
        sources=Sources(**(raw.get("sources") or {})),
        apply=Apply(cover_letter=CoverLetter(**cl_raw), **(raw.get("apply") or {})),
        loop_interval_minutes=int((raw.get("loop") or {}).get("interval_minutes", 240)),
        database=raw.get("database", "./jobpilot.db"),
        base_dir=base_dir,
    )
    validate(cfg)
    return cfg


def validate(cfg: Config) -> None:
    problems = []
    if not cfg.search.keywords:
        problems.append("search.keywords is empty — nothing would ever match")
    if cfg.apply.enabled:
        for f in ("first_name", "last_name", "email"):
            if not getattr(cfg.profile, f):
                problems.append(f"profile.{f} is required when apply.enabled is true")
        if not cfg.profile.resume_path:
            problems.append("profile.resume_path is required when apply.enabled is true")
        elif not cfg.resolve(cfg.profile.resume_path).exists():
            problems.append(f"resume not found: {cfg.profile.resume_path}")
        if cfg.apply.cover_letter.mode == "claude" and not os.environ.get("ANTHROPIC_API_KEY"):
            problems.append("cover_letter.mode is 'claude' but ANTHROPIC_API_KEY is not set")
    if problems:
        raise ValueError("Config problems:\n  - " + "\n  - ".join(problems))
