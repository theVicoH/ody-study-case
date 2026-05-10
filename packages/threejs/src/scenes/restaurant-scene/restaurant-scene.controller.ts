/* eslint-disable custom/no-unnecessary-comments */
import React from "react";

import { RestaurantLabel } from "@workspace/ui/components/molecules/restaurant-label/restaurant-label.molecule";
import { SunLabel } from "@workspace/ui/components/molecules/sun-label/sun-label.molecule";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";


import type {
  RestaurantSceneApi,
  RestaurantSceneCallbacks
} from "@/scenes/restaurant-scene/restaurant-scene.types";
import type { Restaurant, RestaurantPerformance, RestaurantStats } from "@workspace/client";

import { fitModel, instantiateModel, loadModel } from "@/lib/model-loader/model-loader.util";

const COLOR_PURPLE = 0x8442ff;
const COLOR_PINK = 0xff3eb5;
const COLOR_FOG = 0x0a0612;

const PERFORMANCE_COLORS: Record<RestaurantPerformance, number> = {
  good: 0x39ff8c,
  warn: 0xffbf00,
  bad: 0xff3e5c
};

const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 200;
const CAMERA_INITIAL = new THREE.Vector3(14, 12, 18);
const CAMERA_TARGET = new THREE.Vector3(0, 1, 0);

const CONTROLS_MIN_DISTANCE = 14;
const CONTROLS_MAX_DISTANCE = 38;
const CONTROLS_DAMPING = 0.08;
const CONTROLS_MAX_POLAR = Math.PI / 2 - 0.05;
const CONTROLS_MIN_POLAR = 0.15;

const PARTICLE_COUNT = 90;
const PARTICLE_RING_MIN = 6;
const PARTICLE_RING_MAX = 26;
const PARTICLE_HEIGHT = 8;

const SUN_CORE_RADIUS = 0.9;
const SUN_HALO_RADIUS = 1.5;
const SUN_HALO2_RADIUS = 2.4;
const SUN_LIGHT_INTENSITY = 120;
const SUN_LIGHT_DISTANCE = 50;
const SUN_LIGHT_DECAY = 2;
const SUN_GROUP_HEIGHT = 2.4;

const FOCUS_DURATION_MS = 700;
const FOCUS_DISTANCE_DESKTOP = 9;
const FOCUS_DISTANCE_MOBILE = 12;
const FOCUS_HEIGHT = 8;
const MOBILE_BREAKPOINT = 640;

const IDLE_DELAY_MS = 4000;
const AUTO_ROTATE_SPEED = 0.0007;
const PIXEL_RATIO_CAP = 2;
const PARTICLE_DRIFT_SPEED = 0.003;

const CLICK_DRAG_THRESHOLD_PX = 4;
const ZOOM_LERP_SPEED = 0.1;

interface RestaurantNode {
  group: THREE.Group;
  haloMaterial: THREE.MeshBasicMaterial;
  baseMaterial: THREE.MeshStandardMaterial;
  modelMaterials: THREE.MeshStandardMaterial[];
  pickMesh: THREE.Mesh;
  labelEl: HTMLDivElement;
  unmountLabel: () => void;
}

const BASE_HEIGHT = 0.18;
const PLATFORM_SIZE = 5.0;
const LABEL_HEIGHT = 2.8;
const BUBBLE_HEIGHT = 4.2;
const HIGHLIGHT_COLOR = 0xff3eb5;
const HALO_SIZE = 6.4;

function buildRestaurant(restaurant: Restaurant): {
  group: THREE.Group;
  haloMaterial: THREE.MeshBasicMaterial;
  baseMaterial: THREE.MeshStandardMaterial;
  pickMesh: THREE.Mesh;
} {
  const { dimensions } = restaurant;
  const group = new THREE.Group();
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1322,
    roughness: 0.9,
    metalness: 0.05
  });
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(PLATFORM_SIZE, BASE_HEIGHT, PLATFORM_SIZE),
    baseMaterial
  );

  base.position.y = BASE_HEIGHT / 2;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: HIGHLIGHT_COLOR,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(HALO_SIZE, HALO_SIZE), haloMaterial);

  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.01;
  group.add(halo);

  const pickMesh = new THREE.Mesh(
    new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth),
    new THREE.MeshBasicMaterial({ visible: false })
  );

  pickMesh.position.y = BASE_HEIGHT + dimensions.height / 2;
  pickMesh.userData.body = true;
  group.add(pickMesh);

  return { group, haloMaterial, baseMaterial, pickMesh };
}

function attachModel(
  group: THREE.Group,
  restaurant: Restaurant,
  onLoaded: (materials: THREE.MeshStandardMaterial[]) => void
): void {
  loadModel(restaurant.model)
    .then((source) => {
      const model = instantiateModel(source);

      fitModel(model, restaurant.dimensions, BASE_HEIGHT);
      group.add(model);

      const materials: THREE.MeshStandardMaterial[] = [];

      model.traverse((child) => {
        const mesh = child as THREE.Mesh;

        if (!mesh.isMesh) return;

        const mat = mesh.material as THREE.Material | THREE.Material[];
        const list = Array.isArray(mat) ? mat : [mat];

        list.forEach((m) => {
          if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            materials.push(m as THREE.MeshStandardMaterial);
          }
        });
      });

      onLoaded(materials);
    })
    .catch((error) => {
      console.error(`Failed to load model ${restaurant.model}`, error);
    });
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function animateVector(vec: THREE.Vector3, target: THREE.Vector3, durationMs: number): void {
  const from = vec.clone();
  const t0 = performance.now();
  const step = (): void => {
    const elapsed = performance.now() - t0;
    const t = Math.min(1, elapsed / durationMs);

    vec.lerpVectors(from, target, easeOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  };

  step();
}

interface LabelElResult {
  el: HTMLDivElement;
  unmount: () => void;
}

function buildLabelEl(restaurant: Restaurant): LabelElResult {
  const el = document.createElement("div");

  el.className = "rs-label";
  el.dataset.id = restaurant.id;

  const root = createRoot(el);

  flushSync(() => {
    root.render(
      React.createElement(RestaurantLabel, {
        name: restaurant.name,
        address: restaurant.address,
        status: restaurant.performance
      })
    );
  });

  return { el, unmount: () => root.unmount() };
}

function buildBubbleEl(restaurant: Restaurant, stats: RestaurantStats): HTMLDivElement {
  const trendCls = restaurant.performance === "bad" ? "down" : "up";
  const el = document.createElement("div");

  el.className = "rs-bubble";
  el.dataset.id = restaurant.id;
  el.innerHTML = `
    <div class="rs-bubble-head">
      <span class="rs-bubble-dot perf-${restaurant.performance}"></span>
      <span class="rs-bubble-title">${restaurant.name}</span>
      <span class="rs-bubble-trend ${trendCls}">${stats.trend}</span>
    </div>
    <div class="rs-bubble-stats">
      <div><b>${stats.covers}</b><span>couverts</span></div>
      <div><b>€${stats.revenue.toLocaleString("fr-FR")}</b><span>revenu</span></div>
      <div><b>${stats.orders}</b><span>commandes</span></div>
      <div><b>★${stats.rating}</b><span>note</span></div>
    </div>
  `;

  return el;
}

interface SunLabelResult {
  el: HTMLDivElement;
  unmount: () => void;
}

function buildSunLabelEl(labels: { brand: string; cta: string }): SunLabelResult {
  const el = document.createElement("div");
  const root = createRoot(el);

  flushSync(() => {
    root.render(React.createElement(SunLabel, labels));
  });

  return { el, unmount: () => root.unmount() };
}

interface SunLabels {
  brand: string;
  cta: string;
}

interface InitConfig {
  container: HTMLElement;
  restaurants: ReadonlyArray<Restaurant>;
  computeStats: (restaurant: Restaurant) => RestaurantStats;
  callbacks: RestaurantSceneCallbacks;
  sunLabels: SunLabels;
}

export function initRestaurantScene(config: InitConfig): RestaurantSceneApi {
  const { container, restaurants, computeStats, callbacks, sunLabels } = config;
  const width = (): number => container.clientWidth;
  const height = (): number => container.clientHeight;
  const isMobile = (): boolean => width() < MOBILE_BREAKPOINT;

  const scene = new THREE.Scene();

  scene.background = null;
  scene.fog = new THREE.FogExp2(COLOR_FOG, 0.028);

  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    width() / height(),
    CAMERA_NEAR,
    CAMERA_FAR
  );

  camera.position.copy(CAMERA_INITIAL);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
  renderer.setSize(width(), height());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();

  labelRenderer.setSize(width(), height());
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.left = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  scene.add(new THREE.AmbientLight(0x6b5cd9, 0.55));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);

  keyLight.position.set(10, 18, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -25;
  keyLight.shadow.camera.right = 25;
  keyLight.shadow.camera.top = 25;
  keyLight.shadow.camera.bottom = -25;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rim1 = new THREE.PointLight(COLOR_PURPLE, 80, 40, 2);

  rim1.position.set(-12, 6, -10);
  scene.add(rim1);

  const rim2 = new THREE.PointLight(COLOR_PINK, 60, 40, 2);

  rim2.position.set(14, 5, 8);
  scene.add(rim2);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(40, 128),
    new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.85, metalness: 0.1 })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Square grid clipped to circle (Blender-style)
  const gridGroup = new THREE.Group();
  gridGroup.position.y = 0.002;
  const gridRadius = 40;
  const gridStep = 2;
  const gridMajorStep = 10;
  const gridVertices: number[] = [];
  const majorGridVertices: number[] = [];

  for (let i = -gridRadius; i <= gridRadius; i += gridStep) {
    const halfLen = Math.sqrt(gridRadius * gridRadius - i * i);
    if (isNaN(halfLen)) continue;
    const isMajor = i % gridMajorStep === 0;
    const target = isMajor ? majorGridVertices : gridVertices;
    target.push(i, 0, -halfLen, i, 0, halfLen);
    target.push(-halfLen, 0, i, halfLen, 0, i);
  }

  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridVertices, 3));
  gridGroup.add(new THREE.LineSegments(
    gridGeo,
    new THREE.LineBasicMaterial({ color: 0x352a4a, transparent: true, opacity: 0.6 })
  ));

  const majorGridGeo = new THREE.BufferGeometry();
  majorGridGeo.setAttribute("position", new THREE.Float32BufferAttribute(majorGridVertices, 3));
  gridGroup.add(new THREE.LineSegments(
    majorGridGeo,
    new THREE.LineBasicMaterial({ color: COLOR_PURPLE, transparent: true, opacity: 0.65 })
  ));

  scene.add(gridGroup);

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(20, 64),
    new THREE.MeshBasicMaterial({
      color: COLOR_PURPLE,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.005;
  scene.add(glow);

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const palette = [
    new THREE.Color(COLOR_PURPLE),
    new THREE.Color(COLOR_PINK),
    new THREE.Color(0xffffff)
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = PARTICLE_RING_MIN + Math.random() * (PARTICLE_RING_MAX - PARTICLE_RING_MIN);
    const a = Math.random() * Math.PI * 2;

    positions[i * 3 + 0] = Math.cos(a) * r;
    positions[i * 3 + 1] = 0.5 + Math.random() * PARTICLE_HEIGHT;
    positions[i * 3 + 2] = Math.sin(a) * r;

    const c = palette[Math.floor(Math.random() * palette.length)];

    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })
  );

  scene.add(particles);

  const sunGroup = new THREE.Group();

  sunGroup.position.set(0, SUN_GROUP_HEIGHT, 0);
  scene.add(sunGroup);

  const sunCoreMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uCoreColor: { value: new THREE.Color(0xffffff) },
      uTintColor: { value: new THREE.Color(0xe8d8ff) },
      uRimColor: { value: new THREE.Color(0x9a5cff) }
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vPos;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        vPos = position;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uCoreColor;
      uniform vec3 uTintColor;
      uniform vec3 uRimColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vPos;

      float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
      float noise(vec3 p){
        vec3 i = floor(p); vec3 f = fract(p);
        f = f*f*(3.0-2.0*f);
        float n = mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                          mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                      mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                          mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
        return n;
      }
      float fbm(vec3 p){
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
        return v;
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = max(dot(N, V), 0.0);
        float fres = 1.0 - ndv;

        // turbulent plasma surface — two layers drifting opposite directions
        float t = uTime * 0.35;
        float n1 = fbm(vPos * 3.0 + vec3(t, t * 0.7, -t * 0.5));
        float n2 = fbm(vPos * 6.0 - vec3(t * 0.6, -t, t * 0.9));
        float plasma = n1 * 0.65 + n2 * 0.35;

        // hot cells (granulation) and dim filaments
        float hot = smoothstep(0.55, 0.95, plasma);
        float dim = smoothstep(0.55, 0.15, plasma);

        // limb darkening: keep center bright white, push edges toward violet
        vec3 col = mix(uCoreColor, uTintColor, smoothstep(0.0, 0.55, fres));
        col = mix(col, uRimColor, smoothstep(0.65, 1.0, fres));

        // hot bursts on the disk
        col += uCoreColor * hot * 1.1 * (1.0 - fres * 0.7);
        // darker plasma filaments tinted violet
        col -= uRimColor * dim * 0.25 * (1.0 - fres);

        float pulse = 0.94 + 0.06 * sin(uTime * 1.7);
        col *= uIntensity * pulse;

        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }
    `
  });
  const sunCore = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_CORE_RADIUS, 64, 64),
    sunCoreMaterial
  );

  sunCore.userData.isSun = true;
  sunGroup.add(sunCore);

  // Billboarded corona — radial gradient + animated sun rays
  const coronaSize = SUN_HALO2_RADIUS * 14.0;
  const coronaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uInnerColor: { value: new THREE.Color(0xffffff) },
      uMidColor: { value: new THREE.Color(0xc9a4ff) },
      uOuterColor: { value: new THREE.Color(0x6a2bff) }
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        // billboard: cancel rotation of model-view
        vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        mv.xy += position.xy;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uInnerColor;
      uniform vec3 uMidColor;
      uniform vec3 uOuterColor;
      varying vec2 vUv;

      float hash(float n){ return fract(sin(n * 91.345) * 43758.5453); }
      float vnoise(float x){
        float i = floor(x); float f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), f);
      }
      float fbm1(float x){
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++){ v += a * vnoise(x); x *= 2.0; a *= 0.5; }
        return v;
      }

      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        float ang = atan(p.y, p.x);

        // edge-safe envelope so alpha reaches exactly 0 at plane border (kills the square)
        float edge = smoothstep(1.0, 0.85, r);

        // Gaussian decays tuned so they're ~0 well before r=1
        float core  = exp(-r * r * 380.0);  // tiny hot pinpoint
        float disk  = exp(-r * r * 90.0);   // bright disk
        float bloom = exp(-r * r * 24.0);   // mid bloom
        float halo  = exp(-r * r * 6.0);    // wide violet halo (huge but vanishes at edge)

        // ORGANIC sun rays via 1D fbm on angle
        float a1 = ang / 6.2831853 + 0.5;
        float n  = fbm1(a1 * 18.0 + uTime * 0.20);
        float n2 = fbm1(a1 * 7.0  - uTime * 0.13);
        float ray = pow(smoothstep(0.45, 0.95, n) * (0.6 + 0.4 * n2), 1.6);

        // rays in a soft annulus close to disk, smoothly fading
        float rayBand = smoothstep(0.05, 0.18, r) * exp(-pow(r - 0.18, 2.0) * 60.0);
        float breath = 0.85 + 0.15 * sin(uTime * 0.9 + a1 * 12.566);
        float rayMask = ray * rayBand * breath;

        // smooth color progression white → lavender → deep violet
        vec3 col = mix(uMidColor, uInnerColor, disk);
        col = mix(uOuterColor, col, smoothstep(0.0, 0.6, disk + bloom * 0.5));

        col += uInnerColor * core * 1.8
             + uMidColor   * bloom * 0.55
             + uOuterColor * halo  * 0.45
             + mix(uInnerColor, uOuterColor, smoothstep(0.05, 0.3, r)) * rayMask * 1.2;

        float a = clamp(core * 1.2 + disk * 0.75 + bloom * 0.55 + halo * 0.4 + rayMask * 0.7, 0.0, 1.0) * edge;
        gl_FragColor = vec4(col * uIntensity, a);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false
  });
  const sunHalo = new THREE.Mesh(
    new THREE.PlaneGeometry(coronaSize, coronaSize),
    coronaMaterial
  );

  sunHalo.renderOrder = 999;
  sunGroup.add(sunHalo);

  // Soft inner glow sphere (back-side fresnel) for volumetric feel
  const sunHalo2 = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_HALO_RADIUS * 1.1, 48, 48),
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xb98bff) }
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float ndv = max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
          float fres = pow(1.0 - ndv, 2.0);
          float pulse = 0.9 + 0.1 * sin(uTime * 1.5);
          float a = fres * 0.55 * pulse;
          gl_FragColor = vec4(uColor * a * 1.4, a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    })
  );

  sunGroup.add(sunHalo2);

  // Fullscreen NDC overlay — paints a violet glow across the ENTIRE viewport,
  // centered on the sun's projected screen position. Always covers the whole view.
  const sunOverlayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSunNdc: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uVisibility: { value: 1 },
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uInner: { value: new THREE.Color(0xc9a4ff) },
      uOuter: { value: new THREE.Color(0x6a2bff) }
    },
    vertexShader: /* glsl */ `
      varying vec2 vNdc;
      void main() {
        vNdc = position.xy;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec2 uSunNdc;
      uniform float uAspect;
      uniform float uVisibility;
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uInner;
      uniform vec3 uOuter;
      varying vec2 vNdc;
      void main() {
        // aspect-correct radial distance in screen space (y-units)
        vec2 d = (vNdc - uSunNdc) * vec2(uAspect, 1.0);
        float r = length(d);
        float pulse = 0.92 + 0.08 * sin(uTime * 1.2);
        // Wide gaussian violet glow + softer ambient that fills viewport corners
        float glow    = exp(-r * r * 1.8);
        float ambient = exp(-r * r * 0.4) * 0.45;
        float a = (glow * 0.40 + ambient * 0.28) * pulse * uVisibility * uIntensity;
        vec3 col = mix(uOuter, uInner, glow);
        gl_FragColor = vec4(col * a, a);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false
  });
  const sunOverlay = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sunOverlayMaterial);

  sunOverlay.frustumCulled = false;
  sunOverlay.renderOrder = -1; // draw before everything else as a background atmosphere
  scene.add(sunOverlay);

  sunGroup.add(new THREE.PointLight(COLOR_PURPLE, SUN_LIGHT_INTENSITY, SUN_LIGHT_DISTANCE, SUN_LIGHT_DECAY));

  // Invisible hit sphere covering the sun sphere + the CSS2D label area above it
  const sunHitMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  sunHitMesh.position.set(0, 1.5, 0);
  sunGroup.add(sunHitMesh);

  const { el: sunLabelEl, unmount: unmountSunLabel } = buildSunLabelEl(sunLabels);
  const sunLabelObj = new CSS2DObject(sunLabelEl);

  sunLabelObj.position.set(0, 3.0, 0);
  sunGroup.add(sunLabelObj);

  const restaurantNodes: RestaurantNode[] = [];

  restaurants.forEach((restaurant) => {
    const { group, haloMaterial, baseMaterial, pickMesh } = buildRestaurant(restaurant);

    group.position.set(restaurant.position.x, 0, restaurant.position.z);
    group.userData.restaurant = restaurant;
    scene.add(group);

    const { el: labelEl, unmount: unmountLabel } = buildLabelEl(restaurant);
    const labelObj = new CSS2DObject(labelEl);

    labelObj.position.set(0, LABEL_HEIGHT, 0);
    group.add(labelObj);

    const stats = computeStats(restaurant);
    const bubbleEl = buildBubbleEl(restaurant, stats);
    const bubbleObj = new CSS2DObject(bubbleEl);

    bubbleObj.position.set(0, BUBBLE_HEIGHT, 0);
    group.add(bubbleObj);

    const node: RestaurantNode = {
      group,
      haloMaterial,
      baseMaterial,
      modelMaterials: [],
      pickMesh,
      labelEl,
      unmountLabel
    };

    restaurantNodes.push(node);
    attachModel(group, restaurant, (materials) => {
      node.modelMaterials = materials;
      const nodeId = (node.group.userData.restaurant as Restaurant).id;

      applyHighlight(node, hovered === node.group, selectedIds.has(nodeId));
    });
  });

  void PERFORMANCE_COLORS;

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = CONTROLS_DAMPING;
  controls.minDistance = CONTROLS_MIN_DISTANCE;
  controls.maxDistance = CONTROLS_MAX_DISTANCE;
  controls.enableZoom = false;
  controls.maxPolarAngle = CONTROLS_MAX_POLAR;
  controls.minPolarAngle = CONTROLS_MIN_POLAR;
  controls.target.copy(CAMERA_TARGET);
  controls.update();

  let zoomTargetDist = camera.position.distanceTo(controls.target);

  let lastInteraction = performance.now();
  let autoRotate = true;

  controls.addEventListener("start", () => {
    lastInteraction = performance.now();
    autoRotate = false;
  });
  controls.addEventListener("end", () => {
    lastInteraction = performance.now();
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: THREE.Group | null = null;
  let sunHovered = false;
  let sunHoverT = 0;
  const _tmpVec = new THREE.Vector3();

  function pickAt(clientX: number, clientY: number): { sun?: boolean; group?: THREE.Group } | null {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const sunHits = raycaster.intersectObjects([sunCore, sunHitMesh], false);

    if (sunHits.length > 0) return { sun: true };

    const meshes: THREE.Object3D[] = restaurantNodes.map((node) => node.pickMesh);
    const hits = raycaster.intersectObjects(meshes, false);

    if (hits.length === 0) return null;

    let obj: THREE.Object3D | null = hits[0].object;

    while (obj && !obj.userData.restaurant) obj = obj.parent;

    return obj ? { group: obj as THREE.Group } : null;
  }

  const selectedIds = new Set<string>();
  const MODEL_HOVER_INTENSITY = 0.35;
  const MODEL_SELECT_INTENSITY = 0.7;

  function applyHighlight(node: RestaurantNode, isHover: boolean, isSel: boolean): void {
    const active = isHover || isSel;

    node.haloMaterial.opacity = 0;

    node.baseMaterial.color.setHex(active ? HIGHLIGHT_COLOR : 0x1a1322);

    const intensity = isSel
      ? MODEL_SELECT_INTENSITY
      : isHover
        ? MODEL_HOVER_INTENSITY
        : 0;

    node.modelMaterials.forEach((mat) => {
      mat.emissive.setHex(HIGHLIGHT_COLOR);
      mat.emissiveIntensity = intensity;
    });
  }

  function setHover(group: THREE.Group, on: boolean): void {
    const id = (group.userData.restaurant as Restaurant).id;
    const node = restaurantNodes.find((candidate) => candidate.group === group);

    if (node) applyHighlight(node, on, selectedIds.has(id));
    const labelEl = container.querySelector(`.rs-label[data-id="${id}"]`);

    labelEl?.classList.toggle("hover", on);
    const bubbleEl = container.querySelector(`.rs-bubble[data-id="${id}"]`);

    bubbleEl?.classList.toggle("show", on);
  }

  function selectRestaurant(id: string | null): void {
    selectedIds.clear();
    if (id) selectedIds.add(id);
    container.querySelectorAll(".rs-label").forEach((el) => {
      const labelEl = el as HTMLElement;

      labelEl.classList.toggle("selected", labelEl.dataset.id === id);
    });
    restaurantNodes.forEach((node) => {
      const nodeId = (node.group.userData.restaurant as Restaurant).id;

      applyHighlight(node, hovered === node.group, selectedIds.has(nodeId));
    });
  }

  function focusRestaurant(id: string): void {
    const node = restaurantNodes.find(
      (candidate) => (candidate.group.userData.restaurant as Restaurant).id === id
    );

    if (!node) return;

    const target = new THREE.Vector3(node.group.position.x, 1, node.group.position.z);

    animateVector(controls.target, target, FOCUS_DURATION_MS);

    const distance = isMobile() ? FOCUS_DISTANCE_MOBILE : FOCUS_DISTANCE_DESKTOP;
    const camTarget = new THREE.Vector3(
      node.group.position.x + distance,
      FOCUS_HEIGHT,
      node.group.position.z + distance + 2
    );

    animateVector(camera.position, camTarget, FOCUS_DURATION_MS);
  }

  function setSunVisible(visible: boolean): void {
    sunGroup.visible = visible;
    sunOverlay.visible = visible;
    sunLabelEl.style.display = visible ? "" : "none";
  }

  function resetCamera(): void {
    animateVector(controls.target, CAMERA_TARGET.clone(), FOCUS_DURATION_MS);
    animateVector(camera.position, CAMERA_INITIAL.clone(), FOCUS_DURATION_MS);
  }

  let downX = 0;
  let downY = 0;
  let hasDragged = false;
  const onPointerMove = (e: PointerEvent): void => {
    if (e.buttons > 0 && !hasDragged) {
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;

      if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD_PX) hasDragged = true;
    }
    const hit = pickAt(e.clientX, e.clientY);
    const group = hit?.group ?? null;

    if (group !== hovered) {
      if (hovered) setHover(hovered, false);
      hovered = group;
      if (hovered) setHover(hovered, true);
    }
    renderer.domElement.style.cursor = hit ? "pointer" : "grab";
    sunHovered = !!hit?.sun;
  };
  const onPointerDown = (e: PointerEvent): void => {
    downX = e.clientX;
    downY = e.clientY;
    hasDragged = false;
    renderer.domElement.style.cursor = hovered ? "pointer" : "grabbing";
  };
  const onClick = (e: MouseEvent): void => {
    if (hasDragged) return;

    const hit = pickAt(e.clientX, e.clientY);

    if (hit?.sun) {
      callbacks.onSunClick?.();
      callbacks.onSelectGroup?.();
      resetCamera();

      return;
    }
    if (hit?.group) {
      const restaurant = hit.group.userData.restaurant as Restaurant;

      selectRestaurant(restaurant.id);
      callbacks.onSelectRestaurant?.(restaurant);

      return;
    }
    selectRestaurant(null);
    setSunVisible(true);
    callbacks.onEmptyClick?.();
  };

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const rawDelta = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    zoomTargetDist = Math.max(
      CONTROLS_MIN_DISTANCE,
      Math.min(CONTROLS_MAX_DISTANCE, zoomTargetDist * (1 + rawDelta * 0.001))
    );
    lastInteraction = performance.now();
    autoRotate = false;
  };

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("click", onClick);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  const onResize = (): void => {
    camera.aspect = width() / height();
    camera.updateProjectionMatrix();
    renderer.setSize(width(), height());
    labelRenderer.setSize(width(), height());
  };

  window.addEventListener("resize", onResize);

  let frameId = 0;
  const tick = (): void => {
    const now = performance.now();
    const t = now * 0.001;

    if (!autoRotate && now - lastInteraction > IDLE_DELAY_MS) autoRotate = true;
    if (autoRotate) {
      const a = AUTO_ROTATE_SPEED;
      const x = camera.position.x;
      const z = camera.position.z;

      camera.position.x = x * Math.cos(a) - z * Math.sin(a);
      camera.position.z = x * Math.sin(a) + z * Math.cos(a);
    }

    const currentDist = camera.position.distanceTo(controls.target);
    if (Math.abs(currentDist - zoomTargetDist) > 0.001) {
      const newDist = currentDist + (zoomTargetDist - currentDist) * ZOOM_LERP_SPEED;
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(dir, newDist);
    }

    controls.update();

    const arr = particleGeo.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += PARTICLE_DRIFT_SPEED * (1 + Math.sin(t + i) * 0.3);
      if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = 0.5;
    }
    particleGeo.attributes.position.needsUpdate = true;

    (glow.material as THREE.MeshBasicMaterial).opacity = 0.08 + 0.04 * Math.sin(t * 0.5);

    if (sunGroup.visible) {
      sunHoverT += ((sunHovered ? 1 : 0) - sunHoverT) * 0.08;
      sunCoreMaterial.uniforms.uTime.value = t;
      sunCoreMaterial.uniforms.uIntensity.value = 1.0 + 0.4 * sunHoverT;
      coronaMaterial.uniforms.uTime.value = t;
      coronaMaterial.uniforms.uIntensity.value = 1.0 + 0.5 * sunHoverT;
      (sunHalo2.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      sunCore.rotation.y = t * 0.15;
      sunCore.scale.setScalar((1 + 0.03 * Math.sin(t * 1.6)) * (1 + 0.06 * sunHoverT));

      // project sun world position to NDC for the fullscreen overlay
      const sunWorld = sunGroup.getWorldPosition(_tmpVec);
      const ndc = sunWorld.project(camera);

      sunOverlayMaterial.uniforms.uSunNdc.value.set(ndc.x, ndc.y);
      sunOverlayMaterial.uniforms.uAspect.value = camera.aspect;
      sunOverlayMaterial.uniforms.uTime.value = t;
      sunOverlayMaterial.uniforms.uIntensity.value = 1.0 + 0.5 * sunHoverT;
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);

  const dispose = (): void => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("click", onClick);
    renderer.domElement.removeEventListener("wheel", onWheel);
    restaurantNodes.forEach((node) => node.unmountLabel());
    unmountSunLabel();
    controls.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    if (labelRenderer.domElement.parentNode === container) {
      container.removeChild(labelRenderer.domElement);
    }
  };

  return { selectRestaurant, focusRestaurant, setSunVisible, resetCamera, dispose };
}
