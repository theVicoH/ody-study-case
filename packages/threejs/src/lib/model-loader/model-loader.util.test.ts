import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { fitModel, instantiateModel } from "@/lib/model-loader/model-loader.util";


describe("model-loader.util", () => {
  it("instantiateModel clones group with cloned materials", () => {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);

    group.add(mesh);

    const clone = instantiateModel(group);
    const clonedMesh = clone.children[0] as THREE.Mesh;

    expect(clone).not.toBe(group);
    expect(clonedMesh.material).not.toBe(mat);
  });

  it("fitModel scales group to fit dimensions and grounds it on base", () => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));

    mesh.position.y = 1;
    group.add(mesh);

    fitModel(group, { width: 4, depth: 4, height: 4 }, 0.5);

    const box = new THREE.Box3().setFromObject(group);

    expect(box.min.y).toBeCloseTo(0.5, 5);
    expect(box.max.y - box.min.y).toBeCloseTo(4, 5);
  });
});
