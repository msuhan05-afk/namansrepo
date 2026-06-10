// Papercraft World — a small interactive low-poly island built with three.js.
// Everything is generated procedurally so the experience is self-contained
// and deploys as static files (no external 3D assets, no build step).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------------------------------------------------------------------------
// Palette — soft, warm "construction paper" tones.
// ---------------------------------------------------------------------------
const C = {
  skyTop: 0xaee3f5,
  skyBottom: 0xfce8d5,
  water: 0x7ec9e0,
  grass: 0x9bd66e,
  grassDark: 0x7cc057,
  sand: 0xf3dca6,
  trunk: 0x9c6b43,
  leaf: 0x6fae54,
  blossom: 0xf7b8cf,
  wall: 0xfbf3e4,
  roofRed: 0xe06a52,
  roofBlue: 0x6f97c9,
  roofGreen: 0x76b06a,
  roofPurple: 0x9d7fc0,
  ink: 0x4a3f35,
};

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const container = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(C.skyBottom, 26, 60);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(14, 11, 16);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 8;
controls.maxDistance = 34;
controls.maxPolarAngle = Math.PI * 0.49; // don't go under the island
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.target.set(0, 1.5, 0);

// ---------------------------------------------------------------------------
// Sky — a big gradient dome.
// ---------------------------------------------------------------------------
function makeSky() {
  const geo = new THREE.SphereGeometry(90, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      top: { value: new THREE.Color(C.skyTop) },
      bottom: { value: new THREE.Color(C.skyBottom) },
    },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
      void main(){ float h = clamp((normalize(vP).y * 0.5 + 0.5), 0.0, 1.0);
        gl_FragColor = vec4(mix(bottom, top, smoothstep(0.15, 0.85, h)), 1.0); }`,
  });
  scene.add(new THREE.Mesh(geo, mat));
}
makeSky();

// ---------------------------------------------------------------------------
// Lighting — warm key light + cool sky fill for that paper softness.
// ---------------------------------------------------------------------------
const hemi = new THREE.HemisphereLight(C.skyTop, C.grassDark, 0.85);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff2d8, 1.5);
sun.position.set(12, 18, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 60;
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20;
sun.shadow.camera.bottom = -20;
sun.shadow.bias = -0.0005;
scene.add(sun);

// ---------------------------------------------------------------------------
// Material helper — flat-shaded paper look.
// ---------------------------------------------------------------------------
function paper(color, { rough = 0.95, flat = true } = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: flat });
}

// Group that holds everything that should slowly bob like it's floating.
const island = new THREE.Group();
scene.add(island);

// ---------------------------------------------------------------------------
// The island base — a chunky low-poly cylinder of grass on top of rock.
// ---------------------------------------------------------------------------
function buildIsland() {
  const top = new THREE.Mesh(new THREE.CylinderGeometry(11, 10.4, 1.4, 9), paper(C.grass));
  top.position.y = 0;
  top.receiveShadow = true;
  top.castShadow = true;
  island.add(top);

  // a slightly darker grass rim disc for depth
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(11.05, 11.05, 0.5, 9), paper(C.grassDark));
  rim.position.y = -0.45;
  island.add(rim);

  // the hanging rock underneath, tapering to a point (floating island vibe)
  const rock = new THREE.Mesh(new THREE.ConeGeometry(10, 9, 9, 3), paper(0x8a7a66));
  rock.position.y = -5.4;
  rock.castShadow = true;
  island.add(rock);

  // little lumps of dirt on the rock
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const lump = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 + Math.random(), 0), paper(0x9c8870));
    lump.position.set(Math.cos(a) * 6, -3 - Math.random() * 3, Math.sin(a) * 6);
    island.add(lump);
  }
}
buildIsland();

// ---------------------------------------------------------------------------
// Water pond carved into the island.
// ---------------------------------------------------------------------------
function buildPond() {
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.7, 12), paper(C.sand));
  sand.position.set(-4.5, 0.45, 4);
  sand.receiveShadow = true;
  island.add(sand);

  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: C.water, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.9, flatShading: true })
  );
  water.position.set(-4.5, 0.62, 4);
  island.add(water);
  return water;
}
const water = buildPond();

// ---------------------------------------------------------------------------
// Trees — cone "pine" trees and round blossom trees.
// ---------------------------------------------------------------------------
function makeTree(blossom = false) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.1, 6), paper(C.trunk));
  trunk.position.y = 0.55;
  trunk.castShadow = true;
  g.add(trunk);

  if (blossom) {
    const colors = [C.blossom, 0xf9c8db, 0xf7b8cf];
    for (let i = 0; i < 3; i++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 - i * 0.08, 0), paper(colors[i % colors.length]));
      puff.position.set((Math.random() - 0.5) * 0.6, 1.2 + i * 0.35, (Math.random() - 0.5) * 0.6);
      puff.castShadow = true;
      g.add(puff);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85 - i * 0.2, 1.0, 7), paper(i === 0 ? C.leaf : 0x7fbf60));
      cone.position.y = 1.15 + i * 0.55;
      cone.castShadow = true;
      g.add(cone);
    }
  }
  return g;
}

function scatterTrees() {
  const placed = [];
  const isFar = (x, z, min) => placed.every((p) => Math.hypot(p.x - x, p.z - z) > min);
  let tries = 0;
  while (placed.length < 14 && tries < 400) {
    tries++;
    const a = Math.random() * Math.PI * 2;
    const r = 3 + Math.random() * 7;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    // keep clear of the village center and the pond
    if (Math.hypot(x, z) < 2.5) continue;
    if (Math.hypot(x + 4.5, z - 4) < 3.2) continue;
    if (!isFar(x, z, 1.8)) continue;
    placed.push({ x, z });
    const t = makeTree(Math.random() > 0.55);
    const s = 0.8 + Math.random() * 0.6;
    t.scale.setScalar(s);
    t.position.set(x, 0.6, z);
    t.rotation.y = Math.random() * Math.PI;
    island.add(t);
  }
}
scatterTrees();

// ---------------------------------------------------------------------------
// Houses — the clickable landmarks. Each carries portfolio "content".
// ---------------------------------------------------------------------------
const interactives = [];

function makeHouse({ wall = C.wall, roof = C.roofRed, w = 1.6, d = 1.6, h = 1.3, chimney = false } = {}) {
  const g = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), paper(wall));
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  const roofMesh = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.92, h * 0.85, 4), paper(roof));
  roofMesh.position.y = h + h * 0.42;
  roofMesh.rotation.y = Math.PI / 4;
  roofMesh.castShadow = true;
  g.add(roofMesh);

  // door
  const door = new THREE.Mesh(new THREE.BoxGeometry(w * 0.28, h * 0.5, 0.05), paper(C.trunk));
  door.position.set(0, h * 0.25, d / 2 + 0.01);
  g.add(door);

  // windows
  const winMat = paper(0x9fd8e6, { rough: 0.4 });
  for (const sx of [-1, 1]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(w * 0.2, h * 0.22, 0.05), winMat);
    win.position.set(sx * w * 0.28, h * 0.6, d / 2 + 0.01);
    g.add(win);
  }

  if (chimney) {
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), paper(0xb5705a));
    ch.position.set(w * 0.28, h + h * 0.55, d * 0.18);
    ch.castShadow = true;
    g.add(ch);
    g.userData.chimney = new THREE.Vector3(w * 0.28, h + h * 0.85, d * 0.18);
  }
  return g;
}

// Village layout — title, blurb, optional link become the popup card.
const VILLAGE = [
  { title: 'About Me', tag: 'Studio', body: 'Hi! This little island is my corner of the web — a handmade papercraft world I built to show off what I make. Spin it around and explore.', roof: C.roofRed, chimney: true, pos: [0.2, 1.5], rot: 0.2 },
  { title: 'Projects', tag: 'Workshop', body: 'The workshop where things get built. Drop your case studies, demos, and experiments here — each one a little paper diorama of its own.', roof: C.roofBlue, link: 'https://github.com/', linkText: 'See the code', pos: [3.2, -1.4], rot: -0.6 },
  { title: 'Blog', tag: 'Library', body: 'Notes, tutorials, and the occasional ramble. Inspired by Andrew Woan’s papercraft world tutorial that started this whole thing.', roof: C.roofGreen, pos: [-2.6, -2.6], rot: 0.9 },
  { title: 'Contact', tag: 'Post Office', body: 'Send a letter! Find me on your platform of choice, or just say hello. The mailbox is always open.', roof: C.roofPurple, chimney: true, link: 'mailto:hello@example.com', linkText: 'Say hello', pos: [-3.4, 1.2], rot: -0.4 },
];

VILLAGE.forEach((v) => {
  const house = makeHouse({ roof: v.roof, chimney: v.chimney, w: 1.5 + Math.random() * 0.3, h: 1.2 + Math.random() * 0.3 });
  house.position.set(v.pos[0], 0.6, v.pos[1]);
  house.rotation.y = v.rot;
  house.userData.info = v;
  house.userData.baseY = 0.6;
  island.add(house);
  interactives.push(house);

  // a small signpost in front so it reads as clickable
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 5), paper(C.trunk));
  post.position.set(v.pos[0] + Math.sin(v.rot) * 1.1, 0.9, v.pos[1] + Math.cos(v.rot) * 1.1);
  island.add(post);
});

// ---------------------------------------------------------------------------
// Chimney smoke — cheap billboard particles drifting up.
// ---------------------------------------------------------------------------
const smokePuffs = [];
function buildSmoke() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xf2efe9, transparent: true, opacity: 0.6, roughness: 1, flatShading: true });
  interactives.forEach((house) => {
    if (!house.userData.chimney) return;
    const origin = house.userData.chimney.clone().applyEuler(house.rotation).add(house.position);
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), mat.clone());
      puff.userData = { origin, t: i / 5 };
      island.add(puff);
      smokePuffs.push(puff);
    }
  });
}
buildSmoke();

function updateSmoke(dt) {
  smokePuffs.forEach((p) => {
    p.userData.t += dt * 0.25;
    if (p.userData.t > 1) p.userData.t -= 1;
    const t = p.userData.t;
    const o = p.userData.origin;
    p.position.set(o.x + Math.sin(t * 6) * 0.15, o.y + t * 1.6, o.z + Math.cos(t * 5) * 0.15);
    const s = 0.5 + t * 1.6;
    p.scale.setScalar(s);
    p.material.opacity = 0.6 * (1 - t);
  });
}

// ---------------------------------------------------------------------------
// Clouds — drifting flat puffs around the island.
// ---------------------------------------------------------------------------
const clouds = [];
function buildClouds() {
  for (let i = 0; i < 9; i++) {
    const cloud = new THREE.Group();
    const n = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < n; j++) {
      const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8 + Math.random() * 0.6, 0), paper(0xffffff));
      blob.position.set((j - n / 2) * 0.9, Math.random() * 0.3, Math.random() * 0.4);
      cloud.add(blob);
    }
    const a = Math.random() * Math.PI * 2;
    const r = 13 + Math.random() * 9;
    cloud.position.set(Math.cos(a) * r, 4 + Math.random() * 7, Math.sin(a) * r);
    cloud.userData = { angle: a, radius: r, speed: 0.02 + Math.random() * 0.03, y: cloud.position.y };
    cloud.scale.setScalar(0.8 + Math.random() * 0.8);
    scene.add(cloud);
    clouds.push(cloud);
  }
}
buildClouds();

// ---------------------------------------------------------------------------
// Raycasting — hover + click on the houses.
// ---------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;
let selected = null;
let pointerInside = false;
let idleTimer = 0;

function rootHouse(obj) {
  while (obj && !obj.userData.info) obj = obj.parent;
  return obj;
}

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  pointerInside = true;
}
window.addEventListener('pointermove', onPointerMove);

function onClick() {
  if (hovered) {
    selected = hovered;
    showCard(hovered.userData.info);
    controls.autoRotate = false;
    idleTimer = 0;
  }
}
renderer.domElement.addEventListener('click', onClick);

function updateHover() {
  if (!pointerInside) return;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactives, true);
  const hit = hits.length ? rootHouse(hits[0].object) : null;
  if (hit !== hovered) {
    hovered = hit;
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'default';
  }
}

// ---------------------------------------------------------------------------
// Info card UI
// ---------------------------------------------------------------------------
const card = document.getElementById('card');
const cardTag = document.getElementById('card-tag');
const cardTitle = document.getElementById('card-title');
const cardBody = document.getElementById('card-body');
const cardLink = document.getElementById('card-link');

function showCard(info) {
  cardTag.textContent = info.tag;
  cardTitle.textContent = info.title;
  cardBody.textContent = info.body;
  if (info.link) {
    cardLink.style.display = 'inline-block';
    cardLink.href = info.link;
    cardLink.textContent = (info.linkText || 'Open') + ' →';
  } else {
    cardLink.style.display = 'none';
  }
  card.classList.add('show');
}
function hideCard() {
  card.classList.remove('show');
  selected = null;
}
document.querySelector('#card .close').addEventListener('click', hideCard);

// ---------------------------------------------------------------------------
// Resize
// ---------------------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Pause auto-rotate while the user is actively dragging.
controls.addEventListener('start', () => { controls.autoRotate = false; idleTimer = 0; });
controls.addEventListener('end', () => { idleTimer = 0; });

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // gentle island float
  island.position.y = Math.sin(t * 0.6) * 0.15;
  island.rotation.z = Math.sin(t * 0.4) * 0.004;

  // water shimmer
  water.material.opacity = 0.85 + Math.sin(t * 2) * 0.05;

  updateSmoke(dt);

  // drift clouds
  clouds.forEach((c) => {
    c.userData.angle += c.userData.speed * dt;
    c.position.x = Math.cos(c.userData.angle) * c.userData.radius;
    c.position.z = Math.sin(c.userData.angle) * c.userData.radius;
    c.position.y = c.userData.y + Math.sin(t * 0.5 + c.userData.radius) * 0.3;
  });

  // hover bounce on houses
  updateHover();
  interactives.forEach((h) => {
    const target = (h === hovered || h === selected) ? 1.0 : 0.0;
    h.userData.lift = THREE.MathUtils.lerp(h.userData.lift || 0, target, 0.15);
    h.position.y = h.userData.baseY + h.userData.lift * (0.25 + Math.sin(t * 4) * 0.04 * (h === hovered ? 1 : 0));
  });

  // resume auto-rotate after a period of inactivity (and no open card)
  if (!controls.autoRotate && !selected) {
    idleTimer += dt;
    if (idleTimer > 4) controls.autoRotate = true;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ---------------------------------------------------------------------------
// Intro: flip the button to "Enter" once the first frame is ready, then
// fly the camera in a touch when entering.
// ---------------------------------------------------------------------------
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enter');
const spinner = document.getElementById('spinner');
const badge = document.getElementById('badge');
const hint = document.getElementById('hint');

requestAnimationFrame(() => requestAnimationFrame(() => {
  spinner.style.display = 'none';
  enterBtn.disabled = false;
  enterBtn.textContent = 'Enter the world →';
}));

enterBtn.addEventListener('click', () => {
  intro.classList.add('hidden');
  badge.classList.add('show');
  setTimeout(() => { hint.classList.add('show'); }, 900);
  setTimeout(() => { hint.classList.remove('show'); }, 7000);
});
