# Papercraft World 🏝️

An interactive low-poly **papercraft portfolio world** built with
[three.js](https://threejs.org/) — a tiny floating island you can spin around,
with clickable little buildings that open up portfolio "cards" (About, Projects,
Blog, Contact).

Inspired by Andrew Woan's
[Aimee Wei Papercraft World](https://github.com/andrewwoan/aimee-weis-papercraft-world).

Unlike the original (which loads hand-made Blender models), this version builds
the **entire scene procedurally in code** — island, trees, houses, pond, clouds,
and chimney smoke are all generated with three.js primitives and flat shading
for the paper look. That means there are no asset downloads and it deploys as
plain static files.

## Features

- 🏝️ Procedural floating island with grass, rock, a pond and scattered trees
- 🏠 Four clickable buildings, each opening a portfolio info card
- ☁️ Drifting clouds, chimney smoke, water shimmer, gentle floating motion
- 🎨 Flat-shaded "construction paper" aesthetic with a gradient sky + soft shadows
- 🖱️ Orbit controls, hover highlighting, idle auto-rotate
- 📱 Responsive and dependency-free at runtime (three.js loaded via CDN importmap)

## Run locally

It's all static files, so any web server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Make it yours

Edit the `VILLAGE` array in [`js/world.js`](js/world.js) to change the buildings,
their text, links, colours and positions. Tweak the `C` palette object at the
top to re-skin the whole world.

## Controls

- **Drag** — orbit the camera
- **Scroll** — zoom
- **Click a building** — open its card
- Leave it alone — it slowly rotates on its own

---

The previous simple GLB model viewer still lives at [`viewer.html`](viewer.html).
