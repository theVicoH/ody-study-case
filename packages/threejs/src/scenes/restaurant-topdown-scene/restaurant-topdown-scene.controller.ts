import * as THREE from "three";

import type { Restaurant, RestaurantPerformance } from "@workspace/client";

import { fitModel, instantiateModel, loadModel } from "@/lib/model-loader/model-loader.util";


const PERF_COLORS: Record<RestaurantPerformance, number> = {
  good: 0x39ff8c,
  warn: 0xffbf00,
  bad: 0xff3e5c
};

const COLOR_FOG = 0x0a0612;
const COLOR_PURPLE = 0x8442ff;
const COLOR_PINK = 0xff3eb5;

const CAMERA_FOV = 38;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 200;
const CAMERA_RADIUS = 22;
const CAMERA_BASE_Y = 18;
const PIXEL_RATIO_CAP = 2;
const ORBIT_SPEED = 0.12;

export interface RestaurantTopdownSceneApi {
  dispose: () => void;
}

const BASE_HEIGHT = 0.18;
const PLATFORM_SIZE = 5.0;

function buildBlock(restaurant: Restaurant): THREE.Group {
  const group = new THREE.Group();
  const { dimensions } = restaurant;
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1322, roughness: 0.9 });
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(PLATFORM_SIZE, BASE_HEIGHT, PLATFORM_SIZE),
    baseMaterial
  );

  base.position.y = BASE_HEIGHT / 2;
  group.add(base);

  loadModel(restaurant.model)
    .then((source) => {
      const model = instantiateModel(source);

      fitModel(model, dimensions, BASE_HEIGHT);
      group.add(model);
    })
    .catch((error) => {
      console.error(`Failed to load model ${restaurant.model}`, error);
    });

  const innerRadius = Math.max(dimensions.width, dimensions.depth) * 0.9;
  const outerRadius = Math.max(dimensions.width, dimensions.depth) * 1.05;
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(innerRadius, outerRadius, 48),
    new THREE.MeshBasicMaterial({
      color: PERF_COLORS[restaurant.performance],
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.012;
  group.add(ring);
  group.userData.ring = ring;

  return group;
}

export function initRestaurantTopdownScene(
  container: HTMLElement,
  restaurants: ReadonlyArray<Restaurant>
): RestaurantTopdownSceneApi {
  const width = (): number => container.clientWidth;
  const height = (): number => container.clientHeight;
  const scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(COLOR_FOG, 0.025);

  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    Math.max(width(), 1) / Math.max(height(), 1),
    CAMERA_NEAR,
    CAMERA_FAR
  );

  camera.position.set(0, CAMERA_BASE_Y, CAMERA_RADIUS);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
  renderer.setSize(Math.max(width(), 1), Math.max(height(), 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x9b8cd9, 0.6));

  const key = new THREE.DirectionalLight(0xffffff, 1.2);

  key.position.set(8, 16, 8);
  scene.add(key);

  const rim1 = new THREE.PointLight(COLOR_PINK, 50, 40, 2);

  rim1.position.set(-12, 6, -8);
  scene.add(rim1);

  const rim2 = new THREE.PointLight(COLOR_PURPLE, 60, 40, 2);

  rim2.position.set(12, 5, 8);
  scene.add(rim2);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x141019, roughness: 0.85 })
  );

  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(60, 30, COLOR_PURPLE, 0x352a4a);
  const gridMaterial = grid.material as THREE.Material;

  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.25;
  grid.position.y = 0.001;
  scene.add(grid);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshStandardMaterial({
      color: COLOR_PURPLE,
      emissive: COLOR_PURPLE,
      emissiveIntensity: 2.2
    })
  );

  sun.position.y = 1.5;
  scene.add(sun);

  const groups: THREE.Group[] = [];

  restaurants.forEach((restaurant) => {
    const block = buildBlock(restaurant);

    block.position.set(restaurant.position.x, 0, restaurant.position.z);
    scene.add(block);
    groups.push(block);
  });

  const onResize = (): void => {
    const w = width();
    const h = height();

    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(onResize);

  ro.observe(container);

  let stopped = false;
  let frameId = 0;
  const t0 = performance.now();
  const tick = (): void => {
    if (stopped) return;
    const t = (performance.now() - t0) / 1000;
    const angle = t * ORBIT_SPEED;

    camera.position.x = Math.sin(angle) * CAMERA_RADIUS;
    camera.position.z = Math.cos(angle) * CAMERA_RADIUS;
    camera.position.y = CAMERA_BASE_Y + Math.sin(t * 0.4) * 1.5;
    camera.lookAt(0, 1, 0);
    sun.scale.setScalar(1 + 0.05 * Math.sin(t * 1.5));
    groups.forEach((group, i) => {
      const ring = group.userData.ring as THREE.Mesh;
      const mat = ring.material as THREE.MeshBasicMaterial;

      mat.opacity = 0.4 + 0.25 * Math.sin(t * 1.2 + i);
    });
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  const dispose = (): void => {
    stopped = true;
    cancelAnimationFrame(frameId);
    ro.disconnect();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { dispose };
}
