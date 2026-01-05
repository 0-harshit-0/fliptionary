import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Page from '/src/page.js';

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

// pages setup ======================

const pageL = new Page(1, 2);
const pageR = new Page(1, 2);

pageL.plane.position.set(-1, 0, 0);
pageR.plane.position.set(1, 0, 0);
scene.add(pageL.plane);
scene.add(pageR.plane);

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
