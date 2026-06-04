# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repository hosts two independent projects:

- **Papercraft World** (root: `index.html`, `js/`, `models/`) — a static
  three.js procedural portfolio world. Run with any static server.
- **Design DNA** (`extension/`) — a Chrome & Firefox MV3 browser extension
  (TypeScript + React + Tailwind, built with Vite) that extracts a design
  system from any website and exports Figma-friendly JSON. See
  `extension/README.md`. Build with `cd extension && npm install && npm run build`;
  outputs land in `extension/dist-chrome/` and `extension/dist-firefox/`.
