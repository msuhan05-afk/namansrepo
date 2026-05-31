// scene.js — entry point for test3
// Add your Three.js WebGPU scene code here.
// The importmap in test3.html resolves:
//   "three"          → three@0.183.2 (standard module)
//   "three/webgpu"   → three.webgpu.js
//   "three/tsl"      → three.tsl.js
//   "three/addons/"  → three examples/jsm/

import * as THREE from 'three/webgpu';

const root = document.getElementById('root');

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
root.appendChild(renderer.domElement);
await renderer.init();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

// Placeholder geometry
const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.35, 128, 32),
  new THREE.MeshNormalMaterial()
);
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
