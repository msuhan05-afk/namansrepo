#!/usr/bin/env bash
# One-command setup for JobPilot. Run it, edit config.yaml, drop your
# resume.pdf in this folder, then:  .venv/bin/python -m jobpilot run
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null; then
    echo "python3 is required — install it from https://python.org first" >&2
    exit 1
fi

echo "==> Creating virtualenv"
python3 -m venv .venv
echo "==> Installing dependencies"
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r requirements.txt
echo "==> Installing browser for form filling (this can take a minute)"
.venv/bin/playwright install chromium

if [ ! -f config.yaml ]; then
    .venv/bin/python -m jobpilot init
fi

echo
echo "Setup complete. Next steps:"
echo "  1. Edit config.yaml (profile, keywords, target companies)"
echo "  2. Put your resume PDF where profile.resume_path points (default: ./resume.pdf)"
echo "  3. Dry run:        .venv/bin/python -m jobpilot run"
echo "  4. Check results:  .venv/bin/python -m jobpilot status"
echo "  5. Go live:        .venv/bin/python -m jobpilot loop --apply"
