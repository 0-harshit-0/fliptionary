export function applyGravity(geometry, force = 0, mass = 0, renderFun) {
  if (!force || !geometry || !mass) return 0;

  const original = geometry.userData.original;
  const pos = geometry.attributes.position;
  let acc = force / mass,
    inMotion = true;

  return () => {
    inMotion = false;
    acc += force / mass;

    for (let i = 0; i < pos.count; i++) {
      const currentZ = pos.getZ(i);
      const nextZ = Math.max(0, currentZ - acc);

      if (currentZ > 0) {
        inMotion = true;
        pos.setXYZ(i, original[i * 3], original[i * 3 + 1], nextZ);
      }
    }

    pos.needsUpdate = true;
    if (!inMotion) {
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();

      acc = 0;
      return 0;
    }

    return 1;
    // if (renderFun) {
    //   renderFun();
    // }
  };
}
