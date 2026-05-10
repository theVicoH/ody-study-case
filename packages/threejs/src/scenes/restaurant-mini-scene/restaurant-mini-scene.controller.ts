import * as THREE from "three";

import type { Restaurant, RestaurantPerformance } from "@workspace/client";

import { fitModel, instantiateModel, loadModel } from "@/lib/model-loader/model-loader.util";


const PERF_COLORS: Record<RestaurantPerformance, number> = {
  good: 0x39ff8c,
  warn: 0xffbf00,
  bad: 0xff3e5c
};

const COLOR_FOG = 0x0a0612;
const COLOR_PINK = 0xff3eb5;
const COLOR_PURPLE = 0x8442ff;

const CAMERA_FOV = 35;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const PIXEL_RATIO_CAP = 2;
const ROTATION_SPEED = 0.4;
const PULSE_SPEED = 1.3;

export interface RestaurantMiniSceneApi {
  setRestaurant: (restaurant: Restaurant | null) => void;
  dispose: () => void;
}

const BASE_HEIGHT = 0.18;
const PLATFORM_SIZE = 5.0;

function buildBuilding(restaurant: Restaurant): THREE.Group {
  const { dimensions } = restaurant;
  const group = new THREE.Group();
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

  return group;
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

export function initRestaurantMiniScene(container: HTMLElement): RestaurantMiniSceneApi {
  const width = (): number => container.clientWidth;
  const height = (): number => container.clientHeight;
  const scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(COLOR_FOG, 0.04);

  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    Math.max(width(), 1) / Math.max(height(), 1),
    CAMERA_NEAR,
    CAMERA_FAR
  );

  camera.position.set(5.5, 4.2, 6.2);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
  renderer.setSize(Math.max(width(), 1), Math.max(height(), 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x9b8cd9, 0.6));

  const key = new THREE.DirectionalLight(0xffffff, 1.3);

  key.position.set(6, 10, 6);
  scene.add(key);

  const rim = new THREE.PointLight(COLOR_PINK, 30, 20, 2);

  rim.position.set(-4, 3, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x141019, roughness: 0.85 })
  );

  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(20, 20, COLOR_PURPLE, 0x352a4a);
  const gridMaterial = grid.material as THREE.Material;

  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.35;
  grid.position.y = 0.001;
  scene.add(grid);

  let buildingGroup: THREE.Group | null = null;
  let perfDecal: THREE.Mesh | null = null;

  function clearBuilding(): void {
    if (buildingGroup) {
      scene.remove(buildingGroup);
      disposeGroup(buildingGroup);
      buildingGroup = null;
    }
    if (perfDecal) {
      scene.remove(perfDecal);
      perfDecal.geometry.dispose();
      (perfDecal.material as THREE.Material).dispose();
      perfDecal = null;
    }
  }

  function setRestaurant(restaurant: Restaurant | null): void {
    clearBuilding();
    if (!restaurant) return;

    buildingGroup = buildBuilding(restaurant);
    scene.add(buildingGroup);

    const radius = Math.max(restaurant.dimensions.width, restaurant.dimensions.depth) * 1.5;

    perfDecal = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 48),
      new THREE.MeshBasicMaterial({
        color: PERF_COLORS[restaurant.performance],
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    perfDecal.rotation.x = -Math.PI / 2;
    perfDecal.position.y = 0.012;
    scene.add(perfDecal);
  }

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

  let frameId = 0;
  const t0 = performance.now();
  const tick = (): void => {
    const t = (performance.now() - t0) / 1000;

    if (buildingGroup) buildingGroup.rotation.y = t * ROTATION_SPEED;
    if (perfDecal) {
      const pulse = 0.5 + 0.5 * Math.sin(t * PULSE_SPEED);
      const mat = perfDecal.material as THREE.MeshBasicMaterial;

      mat.opacity = 0.35 + 0.25 * pulse;
    }
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  const dispose = (): void => {
    cancelAnimationFrame(frameId);
    ro.disconnect();
    clearBuilding();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { setRestaurant, dispose };
}
