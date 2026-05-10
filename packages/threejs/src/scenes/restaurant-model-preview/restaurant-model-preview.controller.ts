import * as THREE from "three";

import { instantiateModel, loadModel } from "@/lib/model-loader/model-loader.util";

const COLOR_PINK = 0xff3eb5;
const COLOR_PURPLE = 0x8442ff;
const CAMERA_FOV = 35;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const PIXEL_RATIO_CAP = 2;
const ROTATION_SPEED = 0.45;
const TARGET_SIZE = 2.4;

export interface RestaurantModelPreviewApi {
  dispose: () => void;
}

function fitToTarget(model: THREE.Group, targetSize: number): void {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();

  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim === 0) return;

  const scale = targetSize / maxDim;

  model.scale.setScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();

  scaledBox.getCenter(center);
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= scaledBox.min.y;
}

function disposeGroup(group: THREE.Group): void {
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;

    if (!mesh.isMesh) return;
    if (!mesh.userData.sharedGeometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material as THREE.Material | THREE.Material[];

    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material.dispose();
  });
}

export function initRestaurantModelPreview(container: HTMLElement, modelUrl: string): RestaurantModelPreviewApi {
  const width = (): number => Math.max(container.clientWidth, 1);
  const height = (): number => Math.max(container.clientHeight, 1);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width() / height(), CAMERA_NEAR, CAMERA_FAR);

  camera.position.set(3.5, 2.6, 3.8);
  camera.lookAt(0, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
  renderer.setSize(width(), height());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xb0a4dd, 0.8));

  const key = new THREE.DirectionalLight(0xffffff, 1.2);

  key.position.set(4, 6, 4);
  scene.add(key);

  const rim = new THREE.PointLight(COLOR_PINK, 14, 18, 2);

  rim.position.set(-3, 2.5, -3);
  scene.add(rim);

  const fill = new THREE.PointLight(COLOR_PURPLE, 8, 18, 2);

  fill.position.set(3, 1.5, 3);
  scene.add(fill);

  let modelGroup: THREE.Group | null = null;
  let disposed = false;

  loadModel(modelUrl)
    .then((source) => {
      if (disposed) return;

      const model = instantiateModel(source);

      fitToTarget(model, TARGET_SIZE);
      modelGroup = model;
      scene.add(model);
    })
    .catch((error) => {
      console.error(`Failed to load preview model ${modelUrl}`, error);
    });

  const onResize = (): void => {
    const w = width();
    const h = height();

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(onResize);

  ro.observe(container);

  let frameId = 0;
  const t0 = performance.now();
  const tick = (): void => {
    const t = (performance.now() - t0) / 1000;

    if (modelGroup) modelGroup.rotation.y = t * ROTATION_SPEED;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  const dispose = (): void => {
    disposed = true;
    cancelAnimationFrame(frameId);
    ro.disconnect();
    if (modelGroup) {
      scene.remove(modelGroup);
      disposeGroup(modelGroup);
      modelGroup = null;
    }
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { dispose };
}
