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
} from "@/lib/atlas/lear24-data";
import {
  buildLear24Scene,
  createHangarEnvironment,
  type BuiltAircraftScene,
  type BuiltPartNode,
} from "@/lib/atlas/lear24-geometry";

export interface ViewportCameraRequest {
  seq: number;
  pose?: CameraPose;
  presetId?: CameraPresetId;
  focusPartId?: string | null;
  explodeAtRequest?: number;
}

export interface Lear24ViewportProps {
  activeSystem: SystemFilter;
  selectedPartId: string | null;
  explode: number; // 0..100
  isolate: boolean;
  seeThrough: boolean;
  showLinks: boolean;
  scrollToExplode: boolean;
  cameraRequest: ViewportCameraRequest;
  checkrideLocateActive?: boolean;
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

export const Lear24Viewport: React.FC<Lear24ViewportProps> = ({
  activeSystem,
  selectedPartId,
  explode,
  isolate,
  seeThrough,
  showLinks,
  scrollToExplode,
  cameraRequest,
  checkrideLocateActive = false,
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

  // Latest reactive props stored in ref for the 60fps animation & event loop
  const stateRef = useRef({
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
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTexture = createHangarEnvironment(renderer);
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.15, 220);
    const initialPose = CAMERA_PRESET_BY_ID.threeQuarter.pose;
    camera.position.set(...initialPose.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.maxDistance = 42;
    controls.minDistance = 1.15;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.target.set(...initialPose.target);
    controls.update();

    // Studio Hangar Lighting
    const hemiLight = new THREE.HemisphereLight("#e2e8f0", "#0f172a", 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#f8fafc", 2.35);
    keyLight.position.set(11, 16, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 42;
    const d = 11;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#93c5fd", 0.95);
    fillLight.position.set(-14, 7, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#fdba74", 1.15);
    rimLight.position.set(-8, 10, -15);
    scene.add(rimLight);

    const underBounce = new THREE.DirectionalLight("#38bdf8", 0.42);
    underBounce.position.set(0, -10, 2);
    scene.add(underBounce);

    // Hangar telemetry floor grid & shadow receiver at wheel contact plane (y = -1.35)
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -1.36;

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(44, 44),
      new THREE.ShadowMaterial({ opacity: 0.42 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    floorGroup.add(shadowPlane);

    const grid = new THREE.GridHelper(34, 34, "#1e293b", "#0f172a");
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    floorGroup.add(grid);

    // Subtle calibration rings under aircraft
    const ringGeo = new THREE.RingGeometry(6.8, 6.84, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#334155",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.01, -0.5);
    floorGroup.add(ringMesh);

    const innerRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 4.22, 72),
      new THREE.MeshBasicMaterial({
        color: "#1e293b",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      }),
    );
    innerRingMesh.rotation.x = -Math.PI / 2;
    innerRingMesh.position.set(0, 0.01, -0.5);
    floorGroup.add(innerRingMesh);

    scene.add(floorGroup);

    // Build the 56-part Learjet 24XR procedural aircraft
    const aircraft = buildLear24Scene();
    const backups = new WeakMap<THREE.Material, MaterialBackup>();

    // Clone materials per part mesh so opacity / emissive changes on one part never bleed into another
    Object.values(aircraft.parts).forEach((node) => {
      node.meshes.forEach((mesh) => {
        mesh.castShadow = !node.isExteriorShell || node.part.id !== "windshield";
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
    };

    // Emit camera pose changes when user finishes orbiting
    const handleControlsEnd = () => {
      stateRef.current.onCameraPoseChange?.({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [controls.target.x, controls.target.y, controls.target.z],
      });
    };
    controls.addEventListener("end", handleControlsEnd);

    // Raycasting for hover & click
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
        // When Isolate is active, faded-out parts disable pointer events
        if (isolatedSet && !isolatedSet.has(node.part.id)) continue;
        // When See-Through is active, let clicks pass through exterior fuselage/wing shells to internal parts unless that shell is explicitly selected
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
      if (dist > 6 || elapsed > 650) return; // Ignore orbit drags
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

    // Resize observer
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

      // 1. Smoothly lerp explode percentage
      const diff = st.explode - ctx.currentExplode;
      if (Math.abs(diff) > 0.05) {
        ctx.currentExplode += diff * 0.14;
      } else {
        ctx.currentExplode = st.explode;
      }
      const explodeFrac = ctx.currentExplode / 100;

      // Update part positions & materials
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

        // Compute target opacity & emissive
        let opacityMultiplier = 1;
        let forceTransparent = false;
        let disableDepthWrite = false;
        let emissiveHex: number | null = null;
        let emissiveIntensity = 0;

        if (isolatedSet && !isolatedSet.has(partId)) {
          opacityMultiplier = 0.06;
          forceTransparent = true;
          disableDepthWrite = true;
        } else if (st.seeThrough && node.isExteriorShell && !isSelected) {
          opacityMultiplier = isHovered ? 0.34 : 0.18;
          forceTransparent = true;
          disableDepthWrite = true;
        } else if (st.activeSystem !== "all" && !inSystem && !isSelected && !isLinked) {
          opacityMultiplier = 0.24;
          forceTransparent = true;
          disableDepthWrite = true;
        }

        if (isSelected) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.46;
        } else if (isHovered) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.28;
        } else if (st.showLinks && isLinked) {
          emissiveHex = sysColorHex;
          emissiveIntensity = 0.2;
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

      // 2. Spin CJ-610 compressor rotors gently
      for (const rotor of ctx.aircraft.propellerAndRotorMeshes) {
        rotor.rotation.z += 0.035;
      }

      // 3. Rebuild 3D connection Bezier tubes when Links is active
      const linksKey =
        st.showLinks && st.selectedPartId
          ? `${st.selectedPartId}:${Math.round(ctx.currentExplode)}`
          : "";
      if (linksKey !== ctx.lastLinksKey) {
        ctx.lastLinksKey = linksKey;
        rebuildConnectionLinks(ctx, st.selectedPartId, explodeFrac);
      }

      // Animate traveling pulse beads along connection curves
      if (ctx.pulseBeads.length > 0) {
        const tPulse = (now * 0.00055) % 1;
        for (const bead of ctx.pulseBeads) {
          const u = (tPulse + bead.phase) % 1;
          bead.curve.getPoint(u, bead.mesh.position);
        }
      }

      // 4. Camera Tweening
      const tween = tweenRef.current;
      if (tween && tween.active) {
        const u = Math.min(1, (now - tween.startTime) / tween.durationMs);
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - u, 3);
        ctx.camera.position.lerpVectors(tween.fromPos, tween.toPos, eased);
        ctx.controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
        if (u >= 1) {
          tween.active = false;
        }
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

  // Respond to camera requests (Preset buttons, Guided Tour steps, Part click focus, URL state)
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

        // Compute an advantageous viewing offset from the part's position
        if (!cameraRequest.pose && !cameraRequest.presetId) {
          const currentOffset = fromPos.clone().sub(fromTarget);
          const dist = Math.max(4.4, Math.min(9.5, currentOffset.length() * 0.72));
          if (currentOffset.lengthSq() < 0.01) {
            currentOffset.set(5, 2.4, 5);
          }
          // Bias slightly toward the side of the aircraft the part sits on
          const sideBias = Math.abs(focusWorld.x) > 0.6 ? Math.sign(focusWorld.x) * 2.2 : 0;
          const dir = currentOffset.normalize();
          toPos
            .copy(focusWorld)
            .addScaledVector(dir, dist)
            .add(new THREE.Vector3(sideBias, 0.45, 0));
        }
      }
    }

    tweenRef.current = {
      active: true,
      startTime: performance.now(),
      durationMs: 680,
      fromPos,
      toPos,
      fromTarget,
      toTarget,
    };
  }, [cameraRequest]);

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 42%, #111827 0%, #0B0E14 58%, #06080C 100%)",
      }}
      data-testid="lear24-viewport"
    >
      {/* Subtle engineering telemetry corner reticles */}
      <div className="pointer-events-none absolute inset-4 z-10 border border-white/[0.04]">
        <div className="absolute -top-px -left-px h-3 w-3 border-t border-l border-sky-400/40" />
        <div className="absolute -top-px -right-px h-3 w-3 border-t border-r border-sky-400/40" />
        <div className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-sky-400/40" />
        <div className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-sky-400/40" />
      </div>

      {/* Checkride Locate Mode Banner */}
      {checkrideLocateActive && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1.5 text-xs font-mono tracking-wider text-amber-200 uppercase shadow-lg backdrop-blur-md">
          ⊕ Target Acquisition Mode — Click the matching part directly on the 3D aircraft
        </div>
      )}

      {/* Three.js Canvas Mount */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Floating Hover Pill */}
      {hoveredPart && (
        <div
          className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-2xl"
          style={{
            left: Math.min(
              Math.max(16, hoveredPart.x + 14),
              (containerRef.current?.clientWidth ?? 800) - 220,
            ),
            top: Math.max(16, hoveredPart.y - 36),
            background: "rgba(15, 19, 28, 0.88)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            className="text-sm leading-none"
            style={{ color: SYSTEM_BY_ID[hoveredPart.part.system].color }}
          >
            {SYSTEM_BY_ID[hoveredPart.part.system].glyph}
          </span>
          <span className="font-medium tracking-tight">{hoveredPart.part.name}</span>
          <span className="font-mono text-[10px] text-slate-400 uppercase">
            {SYSTEM_BY_ID[hoveredPart.part.system].label}
          </span>
        </div>
      )}

      {/* Accessible / Non-WebGL Test Hotspots (rendered when WebGL is unavailable, e.g., headless test runner) */}
      {!webglSupported && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-y-auto p-6"
          data-testid="lear24-fallback-stage"
        >
          <p className="mb-3 font-mono text-xs text-slate-400 uppercase">
            3D Telemetry Stage · Interactive Part Matrix ({PARTS.length} Assemblies)
          </p>
          <div className="flex max-w-3xl flex-wrap justify-center gap-1.5">
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
                      ? "border-white bg-white/20 text-white"
                      : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/30"
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
    mid.y += Math.max(0.35, span * 0.22);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.026, 8, false);
    const colorHex = direction === "upstream" ? "#38BDF8" : "#F97316";
    const tubeMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    linkGroup.add(tubeMesh);

    // Endpoint rings
    const nodeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 12),
      new THREE.MeshBasicMaterial({ color: colorHex }),
    );
    nodeSphere.position.copy(targetPos);
    linkGroup.add(nodeSphere);

    // Animated pulse bead
    const beadMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    linkGroup.add(beadMesh);
    ctx.pulseBeads.push({
      mesh: beadMesh,
      curve,
      phase: (idx * 0.27) % 1,
    });
  };

  part.upstream.forEach((id, i) => addLinkTube(id, "upstream", i));
  part.downstream.forEach((id, i) => addLinkTube(id, "downstream", i + part.upstream.length));
}
