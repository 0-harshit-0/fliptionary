import * as THREE from 'three';

class Book {
  constructor(
    id,
    name = 'Fliptionary',
    desc = 'santa clause',
    pages = new Map()
  ) {
    this.id = id;

    this.name = name;
    this.desc = desc;
    this.pages = pages;

    //
    this.activePages = []; // the pages on the top/the pages user is reading //queue
  }
  addPage(id, page) {
    /**
     *  page- a mesh object
     */
    if (!id || !page) return;

    this.pages.set(id, page);
  }
  addActivePage(id) {
    /**
     */
    if (!id || this.activePages.length > 2) return;

    const removed = this.activePages.shift();
    this.activePages.push(id);

    return removed;
  }
  info() {
    return this;
  }
}

class Page {
  constructor(ids, pageNumbers, width, height, color = 0xffff00, wire = true) {
    /**
     * ids - array
     * pageNumbers - array
     */
    // each page is double sided, so, from ltr perspective, 1 id and page number for the left, and other for the right.
    this.ids = ids;
    this.pns = pageNumbers;

    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      wireframe: wire,
    });

    //
    this.plane = new THREE.Mesh(this.geometry, this.material);
  }
  info() {
    return this;
  }
}

export { Book, Page };
