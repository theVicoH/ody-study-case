import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

loader.setMeshoptDecoder(MeshoptDecoder);
const cache = new Map<string, Promise<THREE.Group>>();

export interface ModelDimensions {
  width: number;
  depth: number;
  height: number;
}

export function loadModel(url: string): Promise<THREE.Group> {
  const existing = cache.get(url);

  if (existing) return existing;

  const promise = new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });

  cache.set(url, promise);

  return promise;
}

export function instantiateModel(source: THREE.Group): THREE.Group {
  const clone = source.clone(true);

  clone.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m: THREE.Material) => m.clone());
      } else {
        obj.material = obj.material.clone();
      }
    }
  });

  return clone;
}

export function fitModel(model: THREE.Group, dimensions: ModelDimensions, baseTopY: number): void {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();

  box.getSize(size);
  if (size.x === 0 || size.y === 0 || size.z === 0) return;

  const scaleX = dimensions.width / size.x;
  const scaleY = dimensions.height / size.y;
  const scaleZ = dimensions.depth / size.z;
  const scale = Math.min(scaleX, scaleY, scaleZ);

  model.scale.setScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();

  scaledBox.getCenter(center);
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y += baseTopY - scaledBox.min.y;
}
