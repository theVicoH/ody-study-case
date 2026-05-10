import * as THREE from "three";

import { instantiateModel, loadModel } from "@/lib/model-loader/model-loader.util";

const COLOR_PINK = 0xff3eb5;
const COLOR_PURPLE = 0x8442ff;
const CAMERA_FOV = 35;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const PIXEL_RATIO_CAP = 1.5;
const ROTATION_SPEED = 0.45;
const TARGET_SIZE = 2.4;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

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

export function initRestaurantModelPreview(container: HTMLElement, modelUrl: string): RestaurantModelPreviewApi {
  const width = (): number => Math.max(container.clientWidth, 1);
  const height = (): number => Math.max(container.clientHeight, 1);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width() / height(), CAMERA_NEAR, CAMERA_FAR);

  camera.position.set(3.5, 2.6, 3.8);
  camera.lookAt(0, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power"
  });

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
  let visible = true;
  let frameId = 0;
  let lastFrame = 0;

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

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry) return;
      visible = entry.isIntersecting;
    },
    { threshold: 0 }
  );

  io.observe(container);

  const t0 = performance.now();
  const tick = (now: number): void => {
    frameId = requestAnimationFrame(tick);
    if (!visible) return;
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;

    const t = (now - t0) / 1000;

    if (modelGroup) modelGroup.rotation.y = t * ROTATION_SPEED;
    renderer.render(scene, camera);
  };

  frameId = requestAnimationFrame(tick);

  const dispose = (): void => {
    disposed = true;
    cancelAnimationFrame(frameId);
    ro.disconnect();
    io.disconnect();
    if (modelGroup) {
      scene.remove(modelGroup);
      modelGroup = null;
    }
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { dispose };
}
