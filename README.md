# Interactive 3D Model Viewer

A simple static web app that displays a GLB 3D model interactively using three.js.

## Run locally

Because browsers block loading `.glb` files via `file://`, serve via any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Controls

- **Drag** — rotate
- **Scroll** — zoom
- **Right-drag** — pan
- HUD panel: toggle auto-rotate, rotation speed, exposure, background, reset view, wireframe
