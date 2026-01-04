import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

// THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  10, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color('black');

// camera.up.set(0, 0, 1);
camera.position.set(30, 0, 70);
camera.lookAt(0, 0, 0);

const color = 'white';
const intensity = 0.5;
const lights = new THREE.PointLight(color, intensity);
lights.position.set(500, 0, 105);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

const geometry = new THREE.PlaneGeometry(1, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
  wireframe: true,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

scene.add(plane);
scene.add(camera);
scene.add(lights);

controls.addEventListener('change', () => {
  //mesh.rotateX = 180;
  renderer.render(scene, camera);
});
renderer.render(scene, camera);
