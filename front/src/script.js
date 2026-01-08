import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Book, Page } from '/src/classes.js';

// canvas
const canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

// THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
const scene = new THREE.Scene();
const lights = new THREE.PointLight('white', 0.5);
const camera = new THREE.PerspectiveCamera(
  10, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
const renderer = new THREE.WebGLRenderer({ canvas });

scene.background = new THREE.Color('black');
lights.position.set(500, 0, 105);
// camera.up.set(0, 0, 1);
camera.position.set(30, 0, 70);
camera.lookAt(0, 0, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// book setup ==========================
const book1 = new Book();

// pages setup ======================
let topPlaneL = null,
  topPlaneR = null;

const pageL = new Page(1, 2);
const pageR = new Page(1, 2);

pageL.plane.position.set(-1, 0, 0);
pageR.plane.position.set(1, 0, 0);
scene.add(pageL.plane);
scene.add(pageR.plane);

topPlaneL = pageL.plane;
topPlaneR = pageR.plane;

// camera, lights, controls setup ======================
scene.add(camera);
scene.add(lights);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

controls.addEventListener('change', () => {
  //mesh.rotateX = 180;
  renderer.render(scene, camera);
});
renderer.render(scene, camera);

// ray casting =================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let previousMouseX = 0;
let selectedObject = null;

// Convert mouse position to normalized device coordinates
function updateMousePosition(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

canvas.addEventListener('mousedown', (event) => {
  updateMousePosition(event);

  // Check if we clicked on the plane
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([topPlaneL, topPlaneR]);

  if (intersects.length > 0) {
    console.log(intersects);
    isDragging = true;
    selectedObject = intersects[0].object;
    previousMouseX = event.clientX;
    controls.enabled = false; // Disable OrbitControls while rotating
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (!isDragging || !selectedObject) return;

  const deltaX = event.clientX - previousMouseX;
  selectedObject.rotation.y += deltaX * 0.01;

  previousMouseX = event.clientX;
  renderer.render(scene, camera);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true; // Re-enable OrbitControls
});
