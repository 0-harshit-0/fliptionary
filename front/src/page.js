import * as THREE from 'three';

class Page {
  constructor(width, height, color = 0xffff00, wire = true) {
    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      wireframe: wire,
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
  }
  info() {
    return this;
  }
}

export default Page;
