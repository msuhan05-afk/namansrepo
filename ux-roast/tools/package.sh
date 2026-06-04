#!/usr/bin/env bash
# Package UX Roast into a distributable zip (Chrome/Edge unpacked + Firefox xpi).
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
out="$here/dist"
mkdir -p "$out"
rm -f "$out/ux-roast.zip"
cd "$here"
zip -qr "$out/ux-roast.zip" \
  manifest.json background.js browser-api.js analyzer.js \
  popup.html popup.css popup.js \
  report.html report.css report.js \
  theme.css icons \
  -x "*.DS_Store" "icons/.*"
echo "Wrote $out/ux-roast.zip"
