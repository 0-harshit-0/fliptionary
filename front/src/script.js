import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Book, Page, PageGeo } from '/src/classes.js';
import { applyGravity } from '/src/phy.js';
import { randomId } from '/src/utils.js';

// canvas
const canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const MOUSE_MASS = 10; // basically infinite, cause mouse is the GOD xD
const APPLY_FORCES_ON = [];
const GRAVITY = 0.01;

// THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
const scene = new THREE.Scene();
const light = new THREE.DirectionalLight('white', 1);
const ambientLight = new THREE.AmbientLight(0x404040, 1);
const camera = new THREE.PerspectiveCamera(
  5, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
const renderer = new THREE.WebGLRenderer({ canvas });
const controls = new OrbitControls(camera, canvas);

scene.background = new THREE.Color('black');

light.position.set(0, 30, 100);
light.target.position.set(0, 2, 0);
light.castShadow = true;
// // if bigger size
// light.shadow.mapSize.width = 2048;
// light.shadow.mapSize.height = 2048;

// light.shadow.camera.near = 1;
// light.shadow.camera.far = 500;

// light.shadow.camera.left = -100;
// light.shadow.camera.right = 100;
// light.shadow.camera.top = 100;
// light.shadow.camera.bottom = -100;

// camera.up.set(0, 0, 1);
camera.position.set(0, 0, 100);
// camera.lookAt(0, 300, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
// document.body.appendChild(renderer.domElement);

controls.target.set(0, 0, 0);

// book setup ==========================
const book1 = new Book(randomId());

// pages setup ======================
// function initBook() {
//   const oldPages = [];
//   for (let i = 0; i < 10; i++) {
//     const newPage = new Page(randomId(), i);
//     oldPages.push(newPage);

//     if (oldPages.length == 2) {
//       const newPageGeo = new PageGeo(randomId(), 2, 4);

//       const pos = newPageGeo.geometry.attributes.position;

//       newPageGeo.addMetas(oldPages);
//       newPageGeo.geometry.userData.original = new Float32Array(pos.array);
//       newPageGeo.geometry.userData.angle ??= 0;
//       newPageGeo.geometry.userData.hingeX = Math.min(
//         ...newPageGeo.geometry.userData.original.filter((_, i) => i % 3 === 0)
//       );
//       newPageGeo.geometry.userData.maxX = Math.max(
//         ...newPageGeo.geometry.userData.original.filter((_, i) => i % 3 === 0)
//       );

//       console.log(newPageGeo.vertices().count, 'ver');

//       book1.addPageGeo(newPageGeo.id, newPageGeo);
//       oldPages.length = 0;
//     }

//     book1.addPage(newPage.id, newPage);
//   }

//   let z = 0.05;
//   book1.pagesGeo.forEach((value, key, map) => {
//     value.plane.position.set(0, 0, z);
//     scene.add(value.plane);
//     value.plane.castShadow = true; // Plane casts shadow
//     value.plane.receiveShadow = true; // Plane receives shadow
//     z -= 0.01;
//   });

//   // book clip
//   const geometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
//   const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//   const ball = new THREE.Mesh(geometry, material);
//   ball.position.set(0, 2, 0.05); // top-left-up all positive
//   scene.add(ball);

//   // const iterator = book1.pagesGeo.keys();
//   // book1.addActivePageGeo(iterator.next().value);
//   // book1.addActivePageGeo(iterator.next().value);
//   // console.log(book1.info(), oldPages);
// }

// book clip
const ballgeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
const ballmaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballgeometry, ballmaterial);
ball.position.set(0, 0, 0); // top-left-up all positive
scene.add(ball);

const newPageGeo = new PageGeo(randomId(), 2, 4);
newPageGeo.geometry.translate(0, 0, 5);
// newPageGeo.plane.position.set(0, 0, 5);
scene.add(newPageGeo.plane);

// ray casting =================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false,
  previousMouseX = 0,
  selectedObject = null,
  grabX = 0;

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
  const intersects = raycaster.intersectObjects([newPageGeo.plane]);

  if (intersects.length > 0) {
    console.log(intersects, 'intersects');
    isDragging = true;
    previousMouseX = event.clientX;

    selectedObject = intersects[0].object;
    const localPoint = selectedObject.worldToLocal(intersects[0].point.clone());
    grabX = localPoint.x; // the vertices that are being grabbed

    // gravity will be applied on all the selected or moved objects, so we push them all
    APPLY_FORCES_ON.push({
      running: false,
      animationId: null,
      apply: applyGravity(
        selectedObject.geometry,
        GRAVITY,
        selectedObject.geometry.userData.mass
      ),
    });

    controls.enabled = false; // Disable OrbitControls while rotating
  }
});
canvas.addEventListener('mousemove', (event) => {
  if (!isDragging || !selectedObject) return;

  // Convert 180° to radians: 180° = π radians
  const minRotation = -Math.PI; //-Math.PI / 2; // -90°
  const maxRotation = 0; //Math.PI / 2; // +90°

  // const deltaX = event.clientX - previousMouseX;
  // selectedObject.rotation.y += deltaX * 0.01;
  // selectedObject.rotation.y = Math.max(
  //   minRotation,
  //   Math.min(maxRotation, selectedObject.rotation.y)
  // );

  previousMouseX = event.clientX;
});
canvas.addEventListener('mouseup', () => {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true; // Re-enable OrbitControls

  animationManager();
});

// lights, camera, controls setup ======================
scene.add(ambientLight);
scene.add(light);
scene.add(light.target);
scene.add(camera);

// controls.addEventListener('change', () => {
//   //mesh.rotateX = 180;
//   renderFun();
// });
let renderAnimationId;
function renderFun() {
  // console.log('r');
  renderer.render(scene, camera);
}
function renderAnimation() {
  renderFun();

  renderAnimationId = requestAnimationFrame(renderAnimation);
}
renderAnimation();
// initBook();
controls.update();

// animation frame ================================
function animationManager() {
  console.log(APPLY_FORCES_ON);
  if (!APPLY_FORCES_ON.length) return;

  for (let i = APPLY_FORCES_ON.length - 1; i >= 0; i--) {
    const z = APPLY_FORCES_ON[i];
    if (z.running) continue;

    const animate = () => {
      console.log(1);
      z.running = true;
      if (!z.apply()) {
        cancelAnimationFrame(z.animationId);
        z.running = 'complete';
        APPLY_FORCES_ON.splice(i, 1);
        return;
      }

      z.animationId = requestAnimationFrame(animate);
    };

    animate();
  }
}

window.addEventListener('keydown', (e) => {
  // console.log(e.key);
  if (e.key == 'Escape') {
    APPLY_FORCES_ON.forEach((z) => cancelAnimationFrame(z.animationId));
    APPLY_FORCES_ON.length = 0;
    cancelAnimationFrame(renderAnimationId);
  }
});
