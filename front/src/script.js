import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Book, Page, PageGeo } from '/src/classes.js';
import { randomId } from '/src/utils.js';

// canvas
const canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

// THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
const scene = new THREE.Scene();
const light = new THREE.DirectionalLight('white', 1);
const ambientLight = new THREE.AmbientLight(0x404040, 1);
const camera = new THREE.PerspectiveCamera(
  10, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
const renderer = new THREE.WebGLRenderer({ canvas });
const controls = new OrbitControls(camera, canvas);

scene.background = new THREE.Color('black');

light.position.set(30, 10, 70);
light.castShadow = true;

// camera.up.set(0, 0, 1);
camera.position.set(0, 10, 40);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
// document.body.appendChild(renderer.domElement);

controls.target.set(0, 0, 0);

// book setup ==========================
const book1 = new Book(randomId());

// pages setup ======================
function initBook() {
  const oldPages = [];
  for (let i = 0; i < 10; i++) {
    const newPage = new Page(randomId(), i);
    oldPages.push(newPage);

    if (oldPages.length == 2) {
      const newPageGeo = new PageGeo(randomId(), 1, 2);

      newPageGeo.addMetas(oldPages);

      book1.addPageGeo(newPageGeo.id, newPageGeo);
      oldPages.length = 0;
    }

    book1.addPage(newPage.id, newPage);
  }

  let z = book1.pagesGeo.size;
  book1.pagesGeo.forEach((value, key, map) => {
    value.plane.position.set(0, 0, z);
    scene.add(value.plane);
    value.plane.castShadow = true; // Plane casts shadow
    value.plane.receiveShadow = true; // Plane receives shadow
    z -= 0.01;
  });

  const iterator = book1.pagesGeo.keys();
  book1.addActivePageGeo(iterator.next().value);
  book1.addActivePageGeo(iterator.next().value);
  console.log(book1.info(), oldPages);
}

// lights, camera, controls setup ======================
scene.add(ambientLight);
scene.add(light);
scene.add(camera);

controls.addEventListener('change', () => {
  //mesh.rotateX = 180;
  renderer.render(scene, camera);
});
renderer.render(scene, camera);
initBook();
controls.update();

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
  const activePlanes = [...book1.pagesGeo.values()].map((z) => z.plane);
  console.log(activePlanes, 'activePlanes');
  const intersects = raycaster.intersectObjects(activePlanes);

  if (intersects.length > 0) {
    console.log(intersects, 'intersects');
    isDragging = true;
    selectedObject = intersects[0].object;
    previousMouseX = event.clientX;
    controls.enabled = false; // Disable OrbitControls while rotating
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (!isDragging || !selectedObject) return;
  // Convert 180° to radians: 180° = π radians
  const minRotation = -Math.PI; //-Math.PI / 2; // -90°
  const maxRotation = 0; //Math.PI / 2; // +90°

  const deltaX = event.clientX - previousMouseX;
  selectedObject.rotation.y += deltaX * 0.01;
  selectedObject.rotation.y = Math.max(
    minRotation,
    Math.min(maxRotation, selectedObject.rotation.y)
  );

  previousMouseX = event.clientX;
  renderer.render(scene, camera);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true; // Re-enable OrbitControls
});
