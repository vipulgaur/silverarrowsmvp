import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CAMERA_PRESET_BY_ID,
  PART_BY_ID,
  PARTS,
  SYSTEM_BY_ID,
  linkedPartIds,
  type AtlasPart,
  type CameraPose,
  type CameraPresetId,
  type SystemFilter,
} from "@/lib/atlas/c172-data";
import {
  buildC172Scene,
  createHangarEnvironment,
  type BuiltAircraftScene,
  type BuiltPartNode,
} from "@/lib/atlas/c172-geometry";

export interface ViewportCameraRequest {
  seq: number;
  pose?: CameraPose;
  presetId?: CameraPresetId;
  focusPartId?: string | null;
  explodeAtRequest?: number;
}

export interface C172ViewportProps {
  theme?: "light" | "dark";
  activeSystem: SystemFilter;
  selectedPartId: string | null;
  explode: number; // 0..100
  isolate: boolean;
  seeThrough: boolean;
  showLinks: boolean;
  scrollToExplode: boolean;
  isExpanded?: boolean;
  cameraRequest: ViewportCameraRequest;
  checkrideLocateActive?: boolean;
  onToggleExpand?: () => void;
  onSelectPart: (partId: string | null) => void;
  onExplodeChange: (nextExplode: number) => void;
  onCameraPoseChange?: (pose: CameraPose) => void;
}

interface MaterialBackup {
  transparent: boolean;
  opacity: number;
  depthWrite: boolean;
  emissiveHex: number;
  emissiveIntensity: number;
}

function getExplodedFocusWorld(node: BuiltPartNode, explodeFraction: number): THREE.Vector3 {
  return node.focusPoint.clone().addScaledVector(node.explodeOffset, explodeFraction);
}

export const C172Viewport: React.FC<C172ViewportProps> = ({
  theme = "dark",
  activeSystem,
  selectedPartId,
  explode,
  isolate,
  seeThrough,
  showLinks,
  scrollToExplode,
  isExpanded = false,
  cameraRequest,
  checkrideLocateActive = false,
  onToggleExpand,
  onSelectPart,
  onExplodeChange,
  onCameraPoseChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [hoveredPart, setHoveredPart] = useState<{
    part: AtlasPart;
    x: number;
    y: number;
  } | null>(null);

  const isDark = theme === "dark";

  // Reactive state ref for the 60fps animation loop
  const stateRef = useRef({
    theme,
    activeSystem,
    selectedPartId,
    explode,
    isolate,
    seeThrough,
    showLinks,
    scrollToExplode,
    hoveredPartId: null as string | null,
    onSelectPart,
    onExplodeChange,
    onCameraPoseChange,
  });

  useEffect(() => {
    stateRef.current.theme = theme;
    stateRef.current.activeSystem = activeSystem;
    stateRef.current.selectedPartId = selectedPartId;
    stateRef.current.explode = explode;
    stateRef.current.isolate = isolate;
    stateRef.current.seeThrough = seeThrough;
    stateRef.current.showLinks = showLinks;
    stateRef.current.scrollToExplode = scrollToExplode;
    stateRef.current.onSelectPart = onSelectPart;
    stateRef.current.onExplodeChange = onExplodeChange;
    stateRef.current.onCameraPoseChange = onCameraPoseChange;
  }, [
    theme,
    activeSystem,
    selectedPartId,
    explode,
    isolate,
    seeThrough,
    showLinks,
    scrollToExplode,
    onSelectPart,
    onExplodeChange,
    onCameraPoseChange,
  ]);

  // Camera tween state
  const tweenRef = useRef<{
    active: boolean;
    startTime: number;
    durationMs: number;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    aircraft: BuiltAircraftScene;
    backups: WeakMap<THREE.Material, MaterialBackup>;
    currentExplode: number;
    lastLinksKey: string;
    pulseBeads: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; phase: number }[];
    hemiLight: THREE.HemisphereLight;
    keyLight: THREE.DirectionalLight;
    floorGrid: THREE.GridHelper;
    shadowPlane: THREE.Mesh;
    envTexture: THREE.Texture;
  } | null>(null);

  // Mount Three.js WebGL scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) {
      setWebglSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = Math.max(container.clientWidth, 640);
    const height = Math.max(container.clientHeight, 420);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.15 : 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTexture = createHangarEnvironment(renderer, isDark);
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.15, 250);
    const initialPose = CAMERA_PRESET_BY_ID.threeQuarter.pose;
    camera.position.set(...initialPose.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 46;
    controls.minDistance = 0.85;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.target.set(...initialPose.target);
    controls.update();

    // Studio Lighting
    const hemiLight = new THREE.HemisphereLight(
      isDark ? "#e2e8f0" : "#ffffff",
      isDark ? "#0f172a" : "#cbd5e1",
      isDark ? 0.95 : 1.1,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      isDark ? "#f8fafc" : "#ffffff",
      isDark ? 2.4 : 2.0,
    );
    keyLight.position.set(10, 14, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1.5;
    keyLight.shadow.camera.far = 40;
    const d = 9;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(isDark ? "#93c5fd" : "#e0f2fe", 0.9);
    fillLight.position.set(-12, 8, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(isDark ? "#fed7aa" : "#ffedd5", 1.1);
    rimLight.position.set(-8, 9, -14);
    scene.add(rimLight);

    const underBounce = new THREE.DirectionalLight(isDark ? "#38bdf8" : "#bae6fd", 0.4);
    underBounce.position.set(0, -8, 2);
    scene.add(underBounce);

    // Ground plane & shadow receiver at ground contact (Y = 0)
    const floorGroup = new THREE.Group();
    floorGroup.position.y = 0.0;

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(42, 42),
      new THREE.ShadowMaterial({ opacity: isDark ? 0.45 : 0.22 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    floorGroup.add(shadowPlane);

    const floorGrid = new THREE.GridHelper(
      36,
      36,
      isDark ? "#1e293b" : "#94a3b8",
      isDark ? "#0f172a" : "#e2e8f0",
    );
    (floorGrid.material as THREE.Material).transparent = true;
    (floorGrid.material as THREE.Material).opacity = isDark ? 0.55 : 0.65;
    floorGroup.add(floorGrid);

    // Subtle calibration circles under aircraft center
    const ringGeo = new THREE.RingGeometry(5.2, 5.24, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? "#334155" : "#cbd5e1",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.005, 0.65);
    floorGroup.add(ringMesh);

    scene.add(floorGroup);

    // Build the 71-part Cessna 172S procedural aircraft scene
    const aircraft = buildC172Scene();
    const backups = new WeakMap<THREE.Material, MaterialBackup>();

    Object.values(aircraft.parts).forEach((node) => {
      node.meshes.forEach((mesh) => {
        mesh.castShadow = !node.isExteriorShell || !node.part.id.includes("windshield");
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => {
            const cloned = m.clone();
            saveBackup(cloned, backups);
            return cloned;
          });
        } else if (mesh.material) {
          const cloned = mesh.material.clone();
          saveBackup(cloned, backups);
          mesh.material = cloned;
        }
      });
    });

    scene.add(aircraft.root);

    threeRef.current = {
      renderer,
      scene,
      camera,
      controls,
      aircraft,
      backups,
      currentExplode: stateRef.current.explode,
      lastLinksKey: "",
      pulseBeads: [],
      hemiLight,
      keyLight,
      floorGrid,
      shadowPlane,
      envTexture,
    };

    const handleControlsEnd = () => {
      stateRef.current.onCameraPoseChange?.({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [controls.target.x, controls.target.y, controls.target.z],
      });
    };
    controls.addEventListener("end", handleControlsEnd);

    // Raycasting for interactive hover & selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;
    let downTime = 0;

    const getInteractiveMeshes = (): THREE.Mesh[] => {
      const st = stateRef.current;
      const isolatedSet = computeIsolatedPartSet(st.isolate, st.selectedPartId, st.activeSystem);
      const meshes: THREE.Mesh[] = [];
      for (const node of Object.values(aircraft.parts)) {
        if (isolatedSet && !isolatedSet.has(node.part.id)) continue;
        if (st.seeThrough && node.isExteriorShell && st.selectedPartId !== node.part.id) {
          continue;
        }
        meshes.push(...node.meshes);
      }
      return meshes;
    };

    const pickPartAtEvent = (clientX: number, clientY: number): AtlasPart | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getInteractiveMeshes(), false);
      for (const hit of hits) {
        const partId = hit.object.userData?.partId as string | undefined;
        if (partId && PART_BY_ID[partId]) {
          return PART_BY_ID[partId];
        }
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const part = pickPartAtEvent(e.clientX, e.clientY);
      const rect = renderer.domElement.getBoundingClientRect();
      stateRef.current.hoveredPartId = part ? part.id : null;
      renderer.domElement.style.cursor = part ? "pointer" : "grab";
      if (part) {
        setHoveredPart({
          part,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else {
        setHoveredPart(null);
      }
    };

    const onPointerLeave = () => {
      stateRef.current.hoveredPartId = null;
      setHoveredPart(null);
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      downTime = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      const elapsed = performance.now() - downTime;
      if (dist > 6 || elapsed > 650) return;
      const part = pickPartAtEvent(e.clientX, e.clientY);
      if (part) {
        stateRef.current.onSelectPart(part.id);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!stateRef.current.scrollToExplode) return;
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 5;
      const next = Math.max(0, Math.min(100, Math.round(stateRef.current.explode + delta)));
      stateRef.current.onExplodeChange(next);
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerleave", onPointerLeave);
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(container);
    window.addEventListener("resize", handleResize);

    // 60fps Animation Loop
    let rafId = 0;
    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const ctx = threeRef.current;
      if (!ctx) return;
      const st = stateRef.current;

      // 1. Lerp explode percentage
      const diff = st.explode - ctx.currentExplode;
      if (Math.abs(diff) > 0.05) {
        ctx.currentExplode += diff * 0.14;
      } else {
        ctx.currentExplode = st.explode;
      }
      const explodeFrac = ctx.currentExplode / 100;

      // Update positions & material highlights
      const isolatedSet = computeIsolatedPartSet(st.isolate, st.selectedPartId, st.activeSystem);
      const linkedSet = st.selectedPartId ? new Set(linkedPartIds(st.selectedPartId)) : null;

      for (const node of Object.values(ctx.aircraft.parts)) {
        node.group.position
          .copy(node.basePosition)
          .addScaledVector(node.explodeOffset, explodeFrac);

        const partId = node.part.id;
        const isSelected = st.selectedPartId === partId;
        const isHovered = st.hoveredPartId === partId;
        const isLinked = linkedSet ? linkedSet.has(partId) : false;
        const inSystem = st.activeSystem === "all" || node.part.system === st.activeSystem;
        const sysColorHex = new THREE.Color(SYSTEM_BY_ID[node.part.system].color).getHex();

        let opacityMultiplier = 1;
        let forceTransparent = false;
        let disableDepthWrite = false;
        let emissiveHex: number | null = null;
        let emissiveIntensity = 0;

        if (isolatedSet && !isolatedSet.has(partId)) {
          opacityMultiplier = 0.05;
          forceTransparent = true;
          disableDepthWrite = true;
        } else if (st.seeThrough && node.isExteriorShell && !isSelected) {
          opacityMultiplier = isHovered ? 0.35 : 0.16;
          forceTransparent = true;
          disableDepthWrite = true;
        } else if (st.activeSystem !== "all" && !inSystem && !isSelected && !isLinked) {
          opacityMultiplier = 0.24;
          forceTransparent = true;
          disableDepthWrite = true;
        }

        if (isSelected) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.48;
        } else if (isHovered) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.3;
        } else if (st.showLinks && isLinked) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.22;
        } else if (st.activeSystem !== "all" && inSystem) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.08;
        }

        for (const mesh of node.meshes) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const mat of mats) {
            const backup = ctx.backups.get(mat);
            if (!backup) continue;
            if (forceTransparent) {
              mat.transparent = true;
              mat.opacity = Math.min(backup.opacity, opacityMultiplier);
              mat.depthWrite = !disableDepthWrite;
            } else {
              mat.transparent = backup.transparent;
              mat.opacity = backup.opacity;
              mat.depthWrite = backup.depthWrite;
            }
            if ("emissive" in mat && mat instanceof THREE.MeshStandardMaterial) {
              if (emissiveHex !== null) {
                mat.emissive.setHex(emissiveHex);
                mat.emissiveIntensity = emissiveIntensity;
              } else {
                mat.emissive.setHex(backup.emissiveHex);
                mat.emissiveIntensity = backup.emissiveIntensity;
              }
            }
          }
        }
      }

      // 2. Smooth idle propeller rotation
      if (ctx.aircraft.propellerMesh) {
        ctx.aircraft.propellerMesh.rotation.z += 0.045;
      }

      // 3. Dynamic connection tubes
      const linksKey =
        st.showLinks && st.selectedPartId
          ? `${st.selectedPartId}:${Math.round(ctx.currentExplode)}`
          : "";
      if (linksKey !== ctx.lastLinksKey) {
        ctx.lastLinksKey = linksKey;
        rebuildConnectionLinks(ctx, st.selectedPartId, explodeFrac);
      }

      if (ctx.pulseBeads.length > 0) {
        const tPulse = (now * 0.0006) % 1;
        for (const bead of ctx.pulseBeads) {
          const u = (tPulse + bead.phase) % 1;
          bead.curve.getPoint(u, bead.mesh.position);
        }
      }

      // 4. Camera Tweening
      const tween = tweenRef.current;
      if (tween && tween.active) {
        const u = Math.min(1, (now - tween.startTime) / tween.durationMs);
        const eased = 1 - Math.pow(1 - u, 3);
        ctx.camera.position.lerpVectors(tween.fromPos, tween.toPos, eased);
        ctx.controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
        if (u >= 1) tween.active = false;
      }

      ctx.controls.update();
      ctx.renderer.render(ctx.scene, ctx.camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("end", handleControlsEnd);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerleave", onPointerLeave);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      controls.dispose();
      envTexture.dispose();
      renderer.dispose();
      threeRef.current = null;
    };
  }, []);

  // Update environment & lighting when app theme toggles
  useEffect(() => {
    const ctx = threeRef.current;
    if (!ctx) return;
    const isD = theme === "dark";
    ctx.renderer.toneMappingExposure = isD ? 1.15 : 1.05;
    ctx.envTexture.dispose();
    const nextEnv = createHangarEnvironment(ctx.renderer, isD);
    ctx.scene.environment = nextEnv;
    ctx.envTexture = nextEnv;

    ctx.hemiLight.color.set(isD ? "#e2e8f0" : "#ffffff");
    ctx.hemiLight.groundColor.set(isD ? "#0f172a" : "#cbd5e1");
    ctx.hemiLight.intensity = isD ? 0.95 : 1.1;

    ctx.keyLight.color.set(isD ? "#f8fafc" : "#ffffff");
    ctx.keyLight.intensity = isD ? 2.4 : 2.0;

    (ctx.shadowPlane.material as THREE.ShadowMaterial).opacity = isD ? 0.45 : 0.22;
  }, [theme]);

  // Respond to camera requests (presets, tours, part focus)
  useEffect(() => {
    const ctx = threeRef.current;
    if (!ctx || cameraRequest.seq === 0) return;

    const fromPos = ctx.camera.position.clone();
    const fromTarget = ctx.controls.target.clone();
    let toPos = fromPos.clone();
    let toTarget = fromTarget.clone();

    const explodeFrac =
      (typeof cameraRequest.explodeAtRequest === "number"
        ? cameraRequest.explodeAtRequest
        : stateRef.current.explode) / 100;

    if (cameraRequest.pose) {
      toPos.set(...cameraRequest.pose.position);
      toTarget.set(...cameraRequest.pose.target);
    } else if (cameraRequest.presetId && CAMERA_PRESET_BY_ID[cameraRequest.presetId]) {
      const preset = CAMERA_PRESET_BY_ID[cameraRequest.presetId].pose;
      toPos.set(...preset.position);
      toTarget.set(...preset.target);
    }

    if (cameraRequest.focusPartId) {
      const node = ctx.aircraft.parts[cameraRequest.focusPartId];
      if (node) {
        const focusWorld = getExplodedFocusWorld(node, explodeFrac);
        toTarget.copy(focusWorld);

        if (!cameraRequest.pose && !cameraRequest.presetId) {
          const currentOffset = fromPos.clone().sub(fromTarget);
          const dist = Math.max(3.8, Math.min(8.2, currentOffset.length() * 0.72));
          if (currentOffset.lengthSq() < 0.01) {
            currentOffset.set(4.2, 2.1, 4.2);
          }
          const sideBias = Math.abs(focusWorld.x) > 0.4 ? Math.sign(focusWorld.x) * 1.8 : 0;
          const dir = currentOffset.normalize();
          toPos
            .copy(focusWorld)
            .addScaledVector(dir, dist)
            .add(new THREE.Vector3(sideBias, 0.35, 0));
        }
      }
    }

    tweenRef.current = {
      active: true,
      startTime: performance.now(),
      durationMs: 650,
      fromPos,
      toPos,
      fromTarget,
      toTarget,
    };
  }, [cameraRequest]);

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? "radial-gradient(circle at 50% 38%, #111827 0%, #090D14 58%, #05070A 100%)"
          : "radial-gradient(circle at 50% 38%, #ffffff 0%, #F1F5F9 55%, #E2E8F0 100%)",
      }}
      data-testid="c172-viewport"
    >
      {/* Subtle corner reticles */}
      <div className="pointer-events-none absolute inset-4 z-10 border border-slate-500/10">
        <div className="absolute -top-px -left-px h-3 w-3 border-t border-l border-sky-500/40" />
        <div className="absolute -top-px -right-px h-3 w-3 border-t border-r border-sky-500/40" />
        <div className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-sky-500/40" />
        <div className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-sky-500/40" />
      </div>

      {/* Checkride Locate Mode Banner */}
      {checkrideLocateActive && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-500/50 bg-amber-500/20 px-4 py-1.5 text-xs font-mono tracking-wider text-amber-800 dark:text-amber-200 uppercase shadow-lg backdrop-blur-md">
          ⊕ Target Acquisition Mode — Click the matching assembly directly on the 3D aircraft
        </div>
      )}

      {/* Expand / Collapse Floating Control */}
      {onToggleExpand && (
        <button
          type="button"
          onClick={onToggleExpand}
          title={isExpanded ? "Collapse view (Esc)" : "Expand view to fullscreen"}
          data-testid="viewport-expand-btn"
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-slate-300/60 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition hover:border-sky-400 hover:text-sky-500 dark:hover:text-white"
        >
          <span>{isExpanded ? "🗗" : "⛶"}</span>
          <span>{isExpanded ? "Collapse" : "Full View"}</span>
        </button>
      )}

      {/* Three.js Canvas Mount */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Floating Hover Pill */}
      {hoveredPart && (
        <div
          className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/15 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 shadow-xl"
          style={{
            left: Math.min(
              Math.max(16, hoveredPart.x + 14),
              (containerRef.current?.clientWidth ?? 800) - 230,
            ),
            top: Math.max(16, hoveredPart.y - 38),
            background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            className="text-sm leading-none"
            style={{ color: SYSTEM_BY_ID[hoveredPart.part.system].color }}
          >
            {SYSTEM_BY_ID[hoveredPart.part.system].glyph}
          </span>
          <span className="font-semibold tracking-tight">{hoveredPart.part.name}</span>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">
            {SYSTEM_BY_ID[hoveredPart.part.system].label}
          </span>
        </div>
      )}

      {/* Fallback Matrix for Non-WebGL test environments */}
      {!webglSupported && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-y-auto p-6"
          data-testid="c172-fallback-stage"
        >
          <p className="mb-3 font-mono text-xs text-slate-600 dark:text-slate-400 uppercase">
            3D Cessna 172S Telemetry Stage · {PARTS.length} Assemblies
          </p>
          <div className="flex max-w-4xl flex-wrap justify-center gap-1.5">
            {PARTS.map((p) => {
              const sys = SYSTEM_BY_ID[p.system];
              const isSelected = selectedPartId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`stage-part-${p.id}`}
                  onClick={() => onSelectPart(p.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    isSelected
                      ? "border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-200 font-semibold"
                      : "border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span style={{ color: sys.color }}>{sys.glyph}</span> {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function saveBackup(mat: THREE.Material, backups: WeakMap<THREE.Material, MaterialBackup>) {
  const std = mat as THREE.MeshStandardMaterial;
  backups.set(mat, {
    transparent: mat.transparent,
    opacity: mat.opacity,
    depthWrite: mat.depthWrite,
    emissiveHex: std.emissive ? std.emissive.getHex() : 0x000000,
    emissiveIntensity: typeof std.emissiveIntensity === "number" ? std.emissiveIntensity : 0,
  });
}

function computeIsolatedPartSet(
  isolate: boolean,
  selectedPartId: string | null,
  activeSystem: SystemFilter,
): Set<string> | null {
  if (!isolate) return null;
  if (selectedPartId && PART_BY_ID[selectedPartId]) {
    return new Set([selectedPartId, ...linkedPartIds(selectedPartId)]);
  }
  if (activeSystem !== "all") {
    return new Set(PARTS.filter((p) => p.system === activeSystem).map((p) => p.id));
  }
  return null;
}

function rebuildConnectionLinks(
  ctx: {
    aircraft: BuiltAircraftScene;
    pulseBeads: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; phase: number }[];
  },
  selectedPartId: string | null,
  explodeFrac: number,
) {
  const linkGroup = ctx.aircraft.linkGroup;
  while (linkGroup.children.length > 0) {
    const child = linkGroup.children[0] as THREE.Mesh;
    linkGroup.remove(child);
    child.geometry?.dispose();
  }
  ctx.pulseBeads = [];

  if (!selectedPartId) return;
  const originNode = ctx.aircraft.parts[selectedPartId];
  if (!originNode) return;

  const originPos = getExplodedFocusWorld(originNode, explodeFrac);
  const part = originNode.part;

  const addLinkTube = (targetId: string, direction: "upstream" | "downstream", idx: number) => {
    const targetNode = ctx.aircraft.parts[targetId];
    if (!targetNode) return;
    const targetPos = getExplodedFocusWorld(targetNode, explodeFrac);

    const start = direction === "upstream" ? targetPos : originPos;
    const end = direction === "upstream" ? originPos : targetPos;
    const mid = start.clone().lerp(end, 0.5);
    const span = start.distanceTo(end);
    mid.y += Math.max(0.28, span * 0.24);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.022, 8, false);
    const colorHex = direction === "upstream" ? "#0284c7" : "#f97316";
    const tubeMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    linkGroup.add(tubeMesh);

    const nodeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshBasicMaterial({ color: colorHex }),
    );
    nodeSphere.position.copy(targetPos);
    linkGroup.add(nodeSphere);

    const beadMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 10, 10),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    linkGroup.add(beadMesh);
    ctx.pulseBeads.push({
      mesh: beadMesh,
      curve,
      phase: (idx * 0.28) % 1,
    });
  };

  part.upstream.forEach((id, i) => addLinkTube(id, "upstream", i));
  part.downstream.forEach((id, i) => addLinkTube(id, "downstream", i + part.upstream.length));
}
