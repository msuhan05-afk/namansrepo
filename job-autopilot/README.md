# JobPilot — autonomous job application tool

JobPilot fetches fresh job listings, scores them against your keywords, and
auto-fills (and optionally submits) applications on Greenhouse and Lever
hosted forms — with a tailored cover letter for each one. Everything it does
is tracked in a local SQLite database so no job is ever applied to twice.

```
sources (RemoteOK / Greenhouse / Lever)
        │  fetch
        ▼
keyword matcher ──► SQLite tracker (dedup, status, audit trail)
        │  best matches
        ▼
cover letter (template or Claude-generated)
        │
        ▼
Playwright form filler ──► screenshot ──► submit (only when enabled)
```

## Safety model

- **Dry run by default.** `apply.enabled: false` fills forms, takes a
  screenshot, and records what it *would* have submitted — it never clicks
  submit until you flip the flag (or pass `--apply`).
- **Required-question gate.** If a form has required custom questions the bot
  can't answer (visa status, "why us?" essays, demographic surveys), it backs
  off and marks the job `needs_review` instead of submitting garbage.
- **Submission cap + pacing.** `apply.max_per_run` limits each pass, and live
  submissions are spaced 20–60 s apart.
- **Local-only data.** Your profile, resume, and history never leave your
  machine except to the job board you're applying to (and the Claude API if
  you enable generated cover letters).

> ⚠️ Use responsibly: this tool drives public job-board forms on your own
> behalf. Review the matches it finds, keep the per-run cap low, and check
> each board's terms of service. Quality beats volume — `needs_review` jobs
> are usually the ones worth a personal touch.

## Setup

```bash
cd job-autopilot
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium          # only needed for applying

python -m jobpilot init              # creates config.yaml
$EDITOR config.yaml                  # fill in your profile + keywords
```

Drop your resume PDF next to the config (or point `profile.resume_path`
anywhere).

## Usage

```bash
python -m jobpilot run               # one pass, dry run
python -m jobpilot status            # what has it found/done?
python -m jobpilot run --apply       # one pass, actually submits
python -m jobpilot loop              # autonomous: re-runs every N minutes
python -m jobpilot loop --apply      # fully autonomous applying
```

Run it forever with cron/systemd instead of `loop` if you prefer:

```cron
0 */4 * * * cd /path/to/job-autopilot && .venv/bin/python -m jobpilot run --apply >> jobpilot.log 2>&1
```

## Job sources

| Source | Config | Notes |
|---|---|---|
| RemoteOK | `sources.remoteok: true` | Public API, remote jobs only |
| Greenhouse boards | `sources.greenhouse_boards: [gitlab, ...]` | Token = slug in `boards.greenhouse.io/<token>` |
| Lever boards | `sources.lever_companies: [netflix, ...]` | Slug in `jobs.lever.co/<company>` |

Add the companies you care about to the Greenhouse/Lever lists — those are
also the two platforms JobPilot can submit applications on. Jobs from other
platforms are still matched and tracked, just marked `needs_review` with the
URL so you can apply by hand.

## Cover letters

- `mode: template` — your template with `{company}` / `{title}` substituted.
- `mode: claude` — a short letter tailored to each job description, generated
  with the Claude API from your `candidate_summary`. Set `ANTHROPIC_API_KEY`
  in the environment. Falls back to the template if the API call fails.

## Job statuses

| Status | Meaning |
|---|---|
| `new` | Seen, scored below `min_score` or filtered out |
| `matched` | Queued for application on a future pass |
| `dry_run` | Form was filled and screenshotted; submission disabled |
| `applied` | Application submitted |
| `needs_review` | Needs a human: unsupported board or required custom questions |
| `failed` | Applier error — details in the notes column |
