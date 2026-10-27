import * as THREE from "three";
import { PARTS, SYSTEM_BY_ID, type AtlasPart, type SystemId } from "./c172-data";

export interface BuiltPartNode {
  part: AtlasPart;
  group: THREE.Group;
  meshes: THREE.Mesh[];
  basePosition: THREE.Vector3;
  explodeOffset: THREE.Vector3;
  focusPoint: THREE.Vector3;
  isExteriorShell: boolean;
}

export interface BuiltAircraftScene {
  root: THREE.Group;
  parts: Record<string, BuiltPartNode>;
  linkGroup: THREE.Group;
  propellerMesh: THREE.Object3D;
  controlSurfaces: {
    aileronL?: THREE.Object3D;
    aileronR?: THREE.Object3D;
    elevator?: THREE.Object3D;
    rudder?: THREE.Object3D;
    flapL?: THREE.Object3D;
    flapR?: THREE.Object3D;
    yokeL?: THREE.Object3D;
    yokeR?: THREE.Object3D;
    pedals?: THREE.Object3D;
  };
}

/**
 * Creates procedural studio hangar environment texture with light/dark theme support.
 */
export function createHangarEnvironment(renderer: THREE.WebGLRenderer, isDark = true): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(isDark ? "#090d14" : "#f1f5f9");

  // Overhead softbox lighting panels
  const stripGeo = new THREE.PlaneGeometry(16, 4.5);
  const stripMat1 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(isDark ? "#f8fafc" : "#ffffff"),
    side: THREE.DoubleSide,
  });
  const stripMat2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(isDark ? "#93c5fd" : "#dbeafe"),
    side: THREE.DoubleSide,
  });
  const stripMatWarm = new THREE.MeshBasicMaterial({
    color: new THREE.Color(isDark ? "#fed7aa" : "#ffedd5"),
    side: THREE.DoubleSide,
  });

  const topLight = new THREE.Mesh(stripGeo, stripMat1);
  topLight.position.set(0, 12, 0);
  topLight.rotation.x = Math.PI / 2;
  envScene.add(topLight);

  const keyStrip = new THREE.Mesh(stripGeo, stripMat2);
  keyStrip.position.set(10, 8, 7);
  keyStrip.lookAt(0, 1.2, 0);
  envScene.add(keyStrip);

  const rimStrip = new THREE.Mesh(stripGeo, stripMatWarm);
  rimStrip.position.set(-11, 6, -8);
  rimStrip.lookAt(0, 1.2, 0);
  envScene.add(rimStrip);

  // Horizon specular band
  const ringGeo = new THREE.CylinderGeometry(20, 20, 2.5, 48, 1, true);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(isDark ? "#1e293b" : "#cbd5e1"),
    side: THREE.BackSide,
  });
  const horizonRing = new THREE.Mesh(ringGeo, ringMat);
  horizonRing.position.y = 1.2;
  envScene.add(horizonRing);

  const renderTarget = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return renderTarget.texture;
}

/**
 * Procedurally lofts a NACA 2412 wing segment with camber, thickness, and dihedral.
 */
function createNacaWingGeometry(opts: {
  side: 1 | -1;
  xRoot: number;
  xTip: number;
  zRootLeading: number;
  zTipLeading: number;
  chordRoot: number;
  chordTip: number;
  yRoot: number;
  yTip: number;
  thickness: number;
  camber?: number;
}): THREE.BufferGeometry {
  const {
    side,
    xRoot,
    xTip,
    zRootLeading,
    zTipLeading,
    chordRoot,
    chordTip,
    yRoot,
    yTip,
    thickness,
    camber = 0.04,
  } = opts;

  const stations = 16;
  const chordPoints = 28;
  const vertices: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= stations; i++) {
    const tStation = i / stations;
    const x = xRoot + (xTip - xRoot) * tStation;
    const yStation = yRoot + (yTip - yRoot) * tStation;
    const zLead = zRootLeading + (zTipLeading - zRootLeading) * tStation;
    const chord = chordRoot + (chordTip - chordRoot) * tStation;

    for (let j = 0; j <= chordPoints; j++) {
      const u = j / chordPoints;
      const beta = u * Math.PI;
      const xAirfoil = 0.5 * (1 - Math.cos(beta)); // Cosine spacing for smooth leading edge
      const isUpper = u <= 0.5;
      const xNorm = isUpper ? xAirfoil * 2 : (1 - xAirfoil) * 2;
      const clampedX = Math.max(0, Math.min(1, xNorm));

      // NACA 4-digit thickness distribution
      const yt =
        5 *
        thickness *
        (0.2969 * Math.sqrt(clampedX) -
          0.126 * clampedX -
          0.3516 * Math.pow(clampedX, 2) +
          0.2843 * Math.pow(clampedX, 3) -
          0.1015 * Math.pow(clampedX, 4));

      // Mean camber line
      const yc =
        clampedX < 0.4
          ? (camber / 0.16) * (0.8 * clampedX - Math.pow(clampedX, 2))
          : (camber / 0.36) * (0.2 + 0.8 * clampedX - Math.pow(clampedX, 2));

      const yOffset = isUpper ? yc + yt : yc - yt;
      const px = x;
      const py = yStation + yOffset * chord;
      const pz = zLead - clampedX * chord;

      vertices.push(px, py, pz);
      uvs.push(tStation, isUpper ? clampedX : 1 - clampedX);
    }
  }

  const stride = chordPoints + 1;
  for (let i = 0; i < stations; i++) {
    for (let j = 0; j < chordPoints; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);

      if (side === 1) {
        indices.push(a, b, c);
        indices.push(a, c, d);
      } else {
        indices.push(a, c, b);
        indices.push(a, d, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates canvas-drawn instrument textures for Garmin G1000 PFD & MFD displays.
 */
function createAvionicsTextures(): { pfdTex: THREE.Texture; mfdTex: THREE.Texture } {
  if (typeof document === "undefined") {
    return { pfdTex: new THREE.Texture(), mfdTex: new THREE.Texture() };
  }

  // PFD Canvas
  const pfdCanvas = document.createElement("canvas");
  pfdCanvas.width = 512;
  pfdCanvas.height = 384;
  let pctx: CanvasRenderingContext2D | null = null;
  try {
    pctx = pfdCanvas.getContext("2d");
  } catch {
    return { pfdTex: new THREE.Texture(), mfdTex: new THREE.Texture() };
  }
  if (!pctx) {
    return { pfdTex: new THREE.Texture(), mfdTex: new THREE.Texture() };
  }
    pctx.fillStyle = "#020617";
    pctx.fillRect(0, 0, 512, 384);

    // Artificial Horizon Sky / Ground
    pctx.fillStyle = "#0284c7"; // Sky
    pctx.fillRect(100, 60, 312, 110);
    pctx.fillStyle = "#92400e"; // Ground
    pctx.fillRect(100, 170, 312, 110);

    // Horizon line & pitch ladder
    pctx.strokeStyle = "#ffffff";
    pctx.lineWidth = 2.5;
    pctx.beginPath();
    pctx.moveTo(100, 170);
    pctx.lineTo(412, 170);
    pctx.stroke();

    // Pitch ticks
    for (let y = 100; y <= 240; y += 25) {
      if (y === 170) continue;
      pctx.beginPath();
      pctx.moveTo(230, y);
      pctx.lineTo(282, y);
      pctx.stroke();
    }

    // Aircraft reference symbol (yellow chevron)
    pctx.strokeStyle = "#facc15";
    pctx.lineWidth = 4;
    pctx.beginPath();
    pctx.moveTo(215, 170);
    pctx.lineTo(240, 170);
    pctx.lineTo(256, 178);
    pctx.lineTo(272, 170);
    pctx.lineTo(297, 170);
    pctx.stroke();

    // Airspeed tape (Left)
    pctx.fillStyle = "#0f172a";
    pctx.fillRect(40, 50, 60, 240);
    pctx.strokeStyle = "#38bdf8";
    pctx.strokeRect(40, 50, 60, 240);
    pctx.fillStyle = "#4ade80"; // White/green arc
    pctx.fillRect(94, 90, 6, 150);
    pctx.fillStyle = "#ffffff";
    pctx.font = "bold 18px monospace";
    pctx.fillText("110", 48, 176);
    pctx.font = "11px monospace";
    pctx.fillText("KT", 58, 200);

    // Altimeter tape (Right)
    pctx.fillStyle = "#0f172a";
    pctx.fillRect(412, 50, 65, 240);
    pctx.strokeStyle = "#38bdf8";
    pctx.strokeRect(412, 50, 65, 240);
    pctx.fillStyle = "#ffffff";
    pctx.font = "bold 16px monospace";
    pctx.fillText("4500", 418, 176);
    pctx.font = "10px monospace";
    pctx.fillText("29.92", 422, 280);

    // Compass Rose (Bottom)
    pctx.strokeStyle = "#38bdf8";
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.arc(256, 335, 45, Math.PI, 0, false);
    pctx.stroke();
    pctx.fillStyle = "#ffffff";
    pctx.font = "bold 12px monospace";
    pctx.fillText("HDG 360°", 228, 305);

  // MFD Canvas (Engine EIS & Moving Map)
  const mfdCanvas = document.createElement("canvas");
  mfdCanvas.width = 512;
  mfdCanvas.height = 384;
  let mctx: CanvasRenderingContext2D | null = null;
  try {
    mctx = mfdCanvas.getContext("2d");
  } catch {
    return { pfdTex: new THREE.CanvasTexture(pfdCanvas), mfdTex: new THREE.Texture() };
  }
  if (mctx) {
    mctx.fillStyle = "#020617";
    mctx.fillRect(0, 0, 512, 384);

    // Left EIS Strip (Engine Indication System)
    mctx.fillStyle = "#0b1329";
    mctx.fillRect(10, 20, 140, 344);
    mctx.strokeStyle = "#334155";
    mctx.strokeRect(10, 20, 140, 344);

    mctx.fillStyle = "#38bdf8";
    mctx.font = "bold 13px monospace";
    mctx.fillText("ENGINE EIS", 24, 45);

    // Tachometer gauge (RPM)
    mctx.fillStyle = "#22c55e";
    mctx.font = "bold 16px monospace";
    mctx.fillText("2450 RPM", 24, 75);
    mctx.fillStyle = "#334155";
    mctx.fillRect(24, 85, 110, 8);
    mctx.fillStyle = "#22c55e";
    mctx.fillRect(24, 85, 88, 8);

    // Fuel flow
    mctx.fillStyle = "#f8fafc";
    mctx.font = "12px monospace";
    mctx.fillText("FFLOW: 9.8 GPH", 24, 120);
    // Oil temp & pressure
    mctx.fillText("OIL T: 185°F", 24, 150);
    mctx.fillText("OIL P: 68 PSI", 24, 175);
    mctx.fillText("EGT: 1380°F", 24, 205);
    mctx.fillText("CHT: 340°F", 24, 230);
    // Fuel tanks
    mctx.fillStyle = "#38bdf8";
    mctx.fillText("L TANK: 24 GAL", 24, 270);
    mctx.fillText("R TANK: 24 GAL", 24, 295);
    mctx.fillStyle = "#fbbf24";
    mctx.fillText("ELECT: 28.2V", 24, 335);

    // Moving Map Area
    mctx.fillStyle = "#061325";
    mctx.fillRect(160, 20, 340, 344);
    mctx.strokeStyle = "#1e293b";
    mctx.strokeRect(160, 20, 340, 344);

    // Map range rings & waypoint path
    mctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    mctx.lineWidth = 1.5;
    mctx.beginPath();
    mctx.arc(330, 210, 90, 0, Math.PI * 2);
    mctx.stroke();

    // Flight plan magenta track
    mctx.strokeStyle = "#e879f9";
    mctx.lineWidth = 3;
    mctx.beginPath();
    mctx.moveTo(330, 310);
    mctx.lineTo(330, 210);
    mctx.lineTo(410, 110);
    mctx.stroke();

    // Ownship Cessna aircraft icon (white delta)
    mctx.fillStyle = "#ffffff";
    mctx.beginPath();
    mctx.moveTo(330, 196);
    mctx.lineTo(322, 218);
    mctx.lineTo(330, 212);
    mctx.lineTo(338, 218);
    mctx.closePath();
    mctx.fill();

    mctx.fillStyle = "#38bdf8";
    mctx.font = "bold 13px monospace";
    mctx.fillText("NAV1: 112.40  SILVER ARROWS", 175, 45);
    mctx.font = "11px monospace";
    mctx.fillText("GS: 122 KT · TRK: 045°", 175, 70);
  }

  const pfdTex = new THREE.CanvasTexture(pfdCanvas);
  const mfdTex = new THREE.CanvasTexture(mfdCanvas);
  return { pfdTex, mfdTex };
}

/**
 * Builds the complete procedural Cessna 172S Skyhawk SP 3D scene (71 parts).
 */
export function buildC172Scene(): BuiltAircraftScene {
  const root = new THREE.Group();
  root.name = "cessna-172s-root";

  const linkGroup = new THREE.Group();
  linkGroup.name = "link-group";
  root.add(linkGroup);

  const parts: Record<string, BuiltPartNode> = {};
  const controlSurfaces: BuiltAircraftScene["controlSurfaces"] = {};
  const { pfdTex, mfdTex } = createAvionicsTextures();

  // ─────────────────────────── Realistic Materials ───────────────────────────
  // Cessna White Polyurethane fuselage paint with clearcoat
  const whitePaintMat = new THREE.MeshPhysicalMaterial({
    color: "#f8fafc",
    roughness: 0.22,
    metalness: 0.08,
    clearcoat: 0.75,
    clearcoatRoughness: 0.15,
  });

  // Silver Arrows Navy Blue & Gold accent stripes
  const blueStripeMat = new THREE.MeshPhysicalMaterial({
    color: "#1e3a8a",
    roughness: 0.25,
    metalness: 0.2,
    clearcoat: 0.8,
  });

  const goldStripeMat = new THREE.MeshPhysicalMaterial({
    color: "#d97706",
    roughness: 0.3,
    metalness: 0.4,
  });

  // Interior cabin upholstery & panel materials
  const interiorCabinMat = new THREE.MeshStandardMaterial({
    color: "#334155",
    roughness: 0.85,
    metalness: 0.1,
  });

  const seatLeatherMat = new THREE.MeshStandardMaterial({
    color: "#475569",
    roughness: 0.6,
    metalness: 0.05,
  });

  const panelMat = new THREE.MeshStandardMaterial({
    color: "#0f172a",
    roughness: 0.8,
    metalness: 0.2,
  });

  // Windshield & windows (tinted high-transmission acrylic)
  const windowGlassMat = new THREE.MeshPhysicalMaterial({
    color: "#93c5fd",
    transmission: 0.88,
    opacity: 0.42,
    transparent: true,
    roughness: 0.06,
    metalness: 0.05,
    ior: 1.49,
    depthWrite: false,
  });

  // Metals & mechanical materials
  const brushedAlumMat = new THREE.MeshStandardMaterial({
    color: "#cbd5e1",
    roughness: 0.35,
    metalness: 0.85,
  });

  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: "#f1f5f9",
    roughness: 0.08,
    metalness: 0.98,
    clearcoat: 0.9,
  });

  const engineCastIronMat = new THREE.MeshStandardMaterial({
    color: "#1e293b",
    roughness: 0.75,
    metalness: 0.6,
  });

  const exhaustStainlessMat = new THREE.MeshStandardMaterial({
    color: "#94a3b8",
    roughness: 0.4,
    metalness: 0.75,
  });

  const copperBrassMat = new THREE.MeshStandardMaterial({
    color: "#b45309",
    roughness: 0.35,
    metalness: 0.75,
  });

  const rubberTyreMat = new THREE.MeshStandardMaterial({
    color: "#090d16",
    roughness: 0.92,
    metalness: 0.02,
  });

  const fuelCyanMat = new THREE.MeshStandardMaterial({
    color: "#0284c7",
    roughness: 0.3,
    metalness: 0.5,
  });

  const controlVioletMat = new THREE.MeshStandardMaterial({
    color: "#7c3aed",
    roughness: 0.4,
    metalness: 0.3,
  });

  const redEmergencyMat = new THREE.MeshStandardMaterial({
    color: "#dc2626",
    roughness: 0.3,
    metalness: 0.2,
  });

  // Helper to register parts cleanly
  function registerPart(
    id: string,
    meshes: THREE.Mesh[],
    opts: {
      explodeOffset?: THREE.Vector3;
      focusPoint?: THREE.Vector3;
      isExteriorShell?: boolean;
    } = {},
  ): THREE.Group {
    const partMeta = PARTS.find((p) => p.id === id);
    if (!partMeta) {
      throw new Error(`Part ID not found in c172-data: ${id}`);
    }

    const group = new THREE.Group();
    group.name = `part-${id}`;
    meshes.forEach((m) => {
      m.userData.partId = id;
      group.add(m);
    });

    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    if (!box.isEmpty()) box.getCenter(center);

    const basePosition = new THREE.Vector3(0, 0, 0);
    const explodeOffset = opts.explodeOffset ?? new THREE.Vector3(0, 0, 0);
    const focusPoint = opts.focusPoint ?? center;

    parts[id] = {
      part: partMeta,
      group,
      meshes,
      basePosition,
      explodeOffset,
      focusPoint,
      isExteriorShell: opts.isExteriorShell ?? false,
    };

    root.add(group);
    return group;
  }

  // ─────────────────────────── 1. AIRFRAME & STRUCTURE ───────────────────────────
  // Cabin Fuselage (Main passenger & flight deck cabin shell)
  const cabinShellGeo = new THREE.CylinderGeometry(0.72, 0.74, 2.7, 24, 1, false);
  cabinShellGeo.rotateX(Math.PI / 2);
  cabinShellGeo.scale(0.85, 1.05, 1);
  const cabinShellMesh = new THREE.Mesh(cabinShellGeo, whitePaintMat);
  cabinShellMesh.position.set(0, 1.18, 0.65);

  // Roof wing mounting saddle & cabin belly
  const bellyGeo = new THREE.BoxGeometry(1.15, 0.45, 2.6);
  const bellyMesh = new THREE.Mesh(bellyGeo, whitePaintMat);
  bellyMesh.position.set(0, 0.88, 0.65);

  const roofGeo = new THREE.BoxGeometry(1.22, 0.32, 2.1);
  const roofMesh = new THREE.Mesh(roofGeo, whitePaintMat);
  roofMesh.position.set(0, 1.76, 0.65);

  // Decorative side stripe meshes
  const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 2.5), blueStripeMat);
  stripeL.position.set(0.61, 1.15, 0.65);
  const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 2.5), blueStripeMat);
  stripeR.position.set(-0.61, 1.15, 0.65);

  registerPart("cabin-fuselage", [cabinShellMesh, bellyMesh, roofMesh, stripeL, stripeR], {
    explodeOffset: new THREE.Vector3(0, 0.4, 0),
    isExteriorShell: true,
  });

  // Tailcone (Aft tapering cone back to empennage)
  const tailGeo = new THREE.ConeGeometry(0.68, 4.3, 20);
  tailGeo.rotateX(-Math.PI / 2);
  tailGeo.scale(0.72, 1.0, 1);
  const tailMesh = new THREE.Mesh(tailGeo, whitePaintMat);
  tailMesh.position.set(0, 1.34, -2.75);

  const tailStripeL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 3.8), blueStripeMat);
  tailStripeL.position.set(0.38, 1.32, -2.6);
  tailStripeL.rotation.y = -0.06;

  const tailStripeR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 3.8), blueStripeMat);
  tailStripeR.position.set(-0.38, 1.32, -2.6);
  tailStripeR.rotation.y = 0.06;

  registerPart("tailcone", [tailMesh, tailStripeL, tailStripeR], {
    explodeOffset: new THREE.Vector3(0, 0, -1.8),
    isExteriorShell: true,
  });

  // Firewall (Heavy stainless steel forward bulkhead)
  const firewallGeo = new THREE.BoxGeometry(1.18, 1.12, 0.08);
  const firewallMesh = new THREE.Mesh(firewallGeo, brushedAlumMat);
  firewallMesh.position.set(0, 1.15, 2.02);
  registerPart("firewall", [firewallMesh], {
    explodeOffset: new THREE.Vector3(0, 0, 0.6),
  });

  // Windshield (Sloped 45° wrap-around acrylic glass)
  const windGeo = new THREE.CylinderGeometry(0.62, 0.68, 1.1, 18, 1, false, -Math.PI / 2, Math.PI);
  windGeo.rotateZ(Math.PI / 2);
  windGeo.rotateX(0.72);
  const windMesh = new THREE.Mesh(windGeo, windowGlassMat);
  windMesh.position.set(0, 1.56, 1.74);
  registerPart("windshield", [windMesh], {
    explodeOffset: new THREE.Vector3(0, 0.7, 0.5),
    isExteriorShell: true,
  });

  // Side & Rear Windows (Omni-Vision rear glass)
  const rearWinGeo = new THREE.CylinderGeometry(0.64, 0.66, 0.95, 18, 1, false, -Math.PI / 2, Math.PI);
  rearWinGeo.rotateZ(Math.PI / 2);
  rearWinGeo.rotateX(-0.55);
  const rearWinMesh = new THREE.Mesh(rearWinGeo, windowGlassMat);
  rearWinMesh.position.set(0, 1.58, -0.42);

  const sideWinL = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.38), windowGlassMat);
  sideWinL.position.set(0.61, 1.48, 0.45);
  sideWinL.rotation.y = Math.PI / 2;

  const sideWinR = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.38), windowGlassMat);
  sideWinR.position.set(-0.61, 1.48, 0.45);
  sideWinR.rotation.y = -Math.PI / 2;

  registerPart("rear-windows", [rearWinMesh, sideWinL, sideWinR], {
    explodeOffset: new THREE.Vector3(0, 0.6, -0.3),
    isExteriorShell: true,
  });

  // Left Cabin Door
  const doorGeoL = new THREE.BoxGeometry(0.08, 0.92, 0.98);
  const doorMeshL = new THREE.Mesh(doorGeoL, whitePaintMat);
  doorMeshL.position.set(0.61, 1.25, 1.05);
  const doorHandleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12), chromeMat);
  doorHandleL.position.set(0.66, 1.18, 0.75);
  doorHandleL.rotation.x = Math.PI / 2;
  registerPart("door-l", [doorMeshL, doorHandleL], {
    explodeOffset: new THREE.Vector3(1.1, 0, 0),
    isExteriorShell: true,
  });

  // Right Cabin Door
  const doorGeoR = new THREE.BoxGeometry(0.08, 0.92, 0.98);
  const doorMeshR = new THREE.Mesh(doorGeoR, whitePaintMat);
  doorMeshR.position.set(-0.61, 1.25, 1.05);
  const doorHandleR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12), chromeMat);
  doorHandleR.position.set(-0.66, 1.18, 0.75);
  doorHandleR.rotation.x = Math.PI / 2;
  registerPart("door-r", [doorMeshR, doorHandleR], {
    explodeOffset: new THREE.Vector3(-1.1, 0, 0),
    isExteriorShell: true,
  });

  // Baggage Door (Aft left fuselage)
  const bagGeo = new THREE.BoxGeometry(0.06, 0.55, 0.62);
  const bagMesh = new THREE.Mesh(bagGeo, whitePaintMat);
  bagMesh.position.set(0.56, 1.25, -0.55);
  const bagKeyhole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04), chromeMat);
  bagKeyhole.position.set(0.6, 1.25, -0.7);
  bagKeyhole.rotation.z = Math.PI / 2;
  registerPart("baggage-door", [bagMesh, bagKeyhole], {
    explodeOffset: new THREE.Vector3(0.85, 0, -0.2),
    isExteriorShell: true,
  });

  // Left Wing (Span 5.5m, high-wing dihedral +1.5°, chord 1.6m)
  const wingGeoL = createNacaWingGeometry({
    side: 1,
    xRoot: 0.58,
    xTip: 5.5,
    zRootLeading: 1.72,
    zTipLeading: 1.72,
    chordRoot: 1.6,
    chordTip: 1.22,
    yRoot: 1.88,
    yTip: 2.05,
    thickness: 0.12,
  });
  const wingMeshL = new THREE.Mesh(wingGeoL, whitePaintMat);

  // Left wingtip with upward cant and nav light
  const tipGeoL = new THREE.ConeGeometry(0.18, 0.45, 12);
  tipGeoL.rotateZ(-Math.PI / 2);
  const tipMeshL = new THREE.Mesh(tipGeoL, whitePaintMat);
  tipMeshL.position.set(5.52, 2.05, 1.15);

  const navLightL = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: "#ef4444" }), // Red port nav light
  );
  navLightL.position.set(5.53, 2.05, 1.68);

  registerPart("wing-l", [wingMeshL, tipMeshL, navLightL], {
    explodeOffset: new THREE.Vector3(1.6, 0.5, 0),
    isExteriorShell: true,
  });

  // Right Wing
  const wingGeoR = createNacaWingGeometry({
    side: -1,
    xRoot: -0.58,
    xTip: -5.5,
    zRootLeading: 1.72,
    zTipLeading: 1.72,
    chordRoot: 1.6,
    chordTip: 1.22,
    yRoot: 1.88,
    yTip: 2.05,
    thickness: 0.12,
  });
  const wingMeshR = new THREE.Mesh(wingGeoR, whitePaintMat);

  const tipGeoR = new THREE.ConeGeometry(0.18, 0.45, 12);
  tipGeoR.rotateZ(Math.PI / 2);
  const tipMeshR = new THREE.Mesh(tipGeoR, whitePaintMat);
  tipMeshR.position.set(-5.52, 2.05, 1.15);

  const navLightR = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: "#22c55e" }), // Green starboard nav light
  );
  navLightR.position.set(-5.53, 2.05, 1.68);

  registerPart("wing-r", [wingMeshR, tipMeshR, navLightR], {
    explodeOffset: new THREE.Vector3(-1.6, 0.5, 0),
    isExteriorShell: true,
  });

  // Wing Lift Struts (Diagonal braces connecting fuselage to mid-wing)
  function createStrutMesh(side: 1 | -1): THREE.Mesh {
    const start = new THREE.Vector3(side * 0.58, 0.78, 1.15);
    const end = new THREE.Vector3(side * 2.65, 1.94, 1.12);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const strutGeo = new THREE.CylinderGeometry(0.038, 0.038, len, 8);
    strutGeo.scale(0.55, 1, 1.4); // Streamline airfoil profile
    const mesh = new THREE.Mesh(strutGeo, whitePaintMat);
    mesh.position.copy(start).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  const strutMeshL = createStrutMesh(1);
  registerPart("strut-l", [strutMeshL], {
    explodeOffset: new THREE.Vector3(1.2, -0.4, 0),
  });

  const strutMeshR = createStrutMesh(-1);
  registerPart("strut-r", [strutMeshR], {
    explodeOffset: new THREE.Vector3(-1.2, -0.4, 0),
  });

  // Horizontal Stabilizer
  const hStabGeo = new THREE.BoxGeometry(3.4, 0.065, 0.74);
  const hStabMesh = new THREE.Mesh(hStabGeo, whitePaintMat);
  hStabMesh.position.set(0, 1.58, -4.65);
  registerPart("h-stab", [hStabMesh], {
    explodeOffset: new THREE.Vector3(0, 0.5, -0.9),
    isExteriorShell: true,
  });

  // Vertical Fin with Dorsal Fairing & Beacon
  const vFinGeo = new THREE.BufferGeometry();
  const vVertices = new Float32Array([
    // Triangle fin profile
    0, 1.48, -3.2, // Dorsal start
    0, 2.72, -4.85, // Fin top tip
    0, 1.56, -4.85, // Lower rudder base
    0, 1.48, -3.2,
    0, 1.56, -4.85,
    0, 2.72, -4.85,
  ]);
  vFinGeo.setAttribute("position", new THREE.BufferAttribute(vVertices, 3));
  vFinGeo.computeVertexNormals();
  const vFinMesh = new THREE.Mesh(vFinGeo, whitePaintMat);

  const finThickMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 1.25), whitePaintMat);
  finThickMesh.position.set(0, 2.12, -4.4);

  // Red anti-collision beacon atop fin
  const beaconMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.1, 12),
    new THREE.MeshBasicMaterial({ color: "#dc2626" }),
  );
  beaconMesh.position.set(0, 2.77, -4.82);

  registerPart("v-fin", [vFinMesh, finThickMesh, beaconMesh], {
    explodeOffset: new THREE.Vector3(0, 0.9, -0.4),
    isExteriorShell: true,
  });

  // ─────────────────────────── 2. POWERPLANT ───────────────────────────
  // Upper Cowling with Oil Dipstick Door
  const upperCowlGeo = new THREE.CylinderGeometry(0.58, 0.68, 1.18, 18, 1, false, 0, Math.PI);
  upperCowlGeo.rotateZ(Math.PI / 2);
  const upperCowlMesh = new THREE.Mesh(upperCowlGeo, whitePaintMat);
  upperCowlMesh.position.set(0, 1.35, 2.58);

  const oilDoorMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.18), blueStripeMat);
  oilDoorMesh.position.set(0.35, 1.58, 2.38);
  oilDoorMesh.rotation.x = -Math.PI / 3;

  registerPart("cowling-upper", [upperCowlMesh, oilDoorMesh], {
    explodeOffset: new THREE.Vector3(0, 1.1, 0.6),
    isExteriorShell: true,
  });

  // Lower Cowling & Nose Cap (Twin cooling air inlets + air intake scoop)
  const lowerCowlGeo = new THREE.CylinderGeometry(0.58, 0.68, 1.18, 18, 1, false, Math.PI, Math.PI);
  lowerCowlGeo.rotateZ(Math.PI / 2);
  const lowerCowlMesh = new THREE.Mesh(lowerCowlGeo, whitePaintMat);
  lowerCowlMesh.position.set(0, 1.05, 2.58);

  // Twin cooling air oval apertures
  const inletL = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.04, 8, 16),
    engineCastIronMat,
  );
  inletL.position.set(0.32, 1.18, 3.16);
  const inletR = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.04, 8, 16),
    engineCastIronMat,
  );
  inletR.position.set(-0.32, 1.18, 3.16);

  registerPart("cowling-lower", [lowerCowlMesh, inletL, inletR], {
    explodeOffset: new THREE.Vector3(0, -0.9, 0.6),
    isExteriorShell: true,
  });

  // Lycoming IO-360-L2A Engine Block / Crankcase
  const crankcaseGeo = new THREE.BoxGeometry(0.48, 0.44, 0.78);
  const crankcaseMesh = new THREE.Mesh(crankcaseGeo, engineCastIronMat);
  crankcaseMesh.position.set(0, 1.15, 2.62);
  registerPart("engine", [crankcaseMesh], {
    explodeOffset: new THREE.Vector3(0, 0, 0.4),
    focusPoint: new THREE.Vector3(0, 1.15, 2.62),
  });

  // 4 Horizontally Opposed Finned Cylinders & Spark Plugs
  const cylMeshes: THREE.Mesh[] = [];
  const cylPositions = [
    { x: 0.38, y: 1.18, z: 2.82 }, // Cyl 1 (Front Left)
    { x: 0.38, y: 1.18, z: 2.45 }, // Cyl 3 (Rear Left)
    { x: -0.38, y: 1.18, z: 2.76 }, // Cyl 2 (Front Right)
    { x: -0.38, y: 1.18, z: 2.39 }, // Cyl 4 (Rear Right)
  ];
  cylPositions.forEach((pos, idx) => {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.32, 16),
      engineCastIronMat,
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(pos.x, pos.y, pos.z);
    cylMeshes.push(barrel);

    // Spark plug
    const plug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.08),
      copperBrassMat,
    );
    plug.position.set(pos.x * 1.35, pos.y + 0.1, pos.z);
    cylMeshes.push(plug);
  });
  registerPart("cylinders", cylMeshes, {
    explodeOffset: new THREE.Vector3(0, 0.6, 0.3),
  });

  // McCauley 2-Blade Fixed-Pitch Propeller (76" diameter = 1.93m)
  const propGroup = new THREE.Group();
  propGroup.position.set(0, 1.18, 3.28);

  const bladeGeo = new THREE.BoxGeometry(0.12, 1.9, 0.035);
  bladeGeo.scale(0.85, 1, 0.6);
  const bladeMesh = new THREE.Mesh(bladeGeo, brushedAlumMat);

  // Tip warning paint stripes (white & red)
  const tipStripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.04), whitePaintMat);
  tipStripe1.position.y = 0.86;
  const tipStripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.04), whitePaintMat);
  tipStripe2.position.y = -0.86;

  propGroup.add(bladeMesh, tipStripe1, tipStripe2);
  const propRegistered = registerPart("propeller", [bladeMesh, tipStripe1, tipStripe2], {
    explodeOffset: new THREE.Vector3(0, 0, 1.2),
  });

  // Polished Chrome Spinner
  const spinGeo = new THREE.ConeGeometry(0.24, 0.44, 20);
  spinGeo.rotateX(Math.PI / 2);
  const spinMesh = new THREE.Mesh(spinGeo, chromeMat);
  spinMesh.position.set(0, 1.18, 3.46);
  registerPart("spinner", [spinMesh], {
    explodeOffset: new THREE.Vector3(0, 0, 1.6),
  });

  // Exhaust Manifold & Muffler Heat Exchanger Shroud
  const mufflerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.68, 14);
  mufflerGeo.rotateZ(Math.PI / 2);
  const mufflerMesh = new THREE.Mesh(mufflerGeo, exhaustStainlessMat);
  mufflerMesh.position.set(0, 0.84, 2.45);

  const tailpipeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.42, 10);
  tailpipeGeo.rotateX(0.45);
  const tailpipeMesh = new THREE.Mesh(tailpipeGeo, exhaustStainlessMat);
  tailpipeMesh.position.set(0.15, 0.64, 2.15);
  registerPart("exhaust", [mufflerMesh, tailpipeMesh], {
    explodeOffset: new THREE.Vector3(0, -0.6, -0.2),
  });

  // Dual Bendix / Slick Magnetos
  const magL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), engineCastIronMat);
  magL.position.set(0.16, 1.34, 2.22);
  magL.rotation.x = Math.PI / 2;

  const magR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), engineCastIronMat);
  magR.position.set(-0.16, 1.34, 2.22);
  magR.rotation.x = Math.PI / 2;
  registerPart("magnetos", [magL, magR], {
    explodeOffset: new THREE.Vector3(0, 0.4, -0.4),
  });

  // Starter Motor (Engages ring gear)
  const starterMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.22, 12),
    engineCastIronMat,
  );
  starterMesh.position.set(-0.18, 1.25, 2.95);
  starterMesh.rotation.x = Math.PI / 2;
  registerPart("starter", [starterMesh], {
    explodeOffset: new THREE.Vector3(-0.4, 0.2, 0.4),
  });

  // Alternator (Belt-driven, 28V)
  const altMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.18, 14),
    brushedAlumMat,
  );
  altMesh.position.set(0.22, 0.98, 2.92);
  altMesh.rotation.x = Math.PI / 2;
  registerPart("alternator", [altMesh], {
    explodeOffset: new THREE.Vector3(0.5, -0.3, 0.4),
  });

  // Wet Sump & Oil Cooler
  const sumpMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.18, 0.54),
    engineCastIronMat,
  );
  sumpMesh.position.set(0, 0.88, 2.58);

  const coolerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.12),
    brushedAlumMat,
  );
  coolerMesh.position.set(-0.25, 1.28, 2.18);
  registerPart("oil-system", [sumpMesh, coolerMesh], {
    explodeOffset: new THREE.Vector3(0, -0.5, 0),
  });

  // Air Induction Filter Box & Alternate Air Door
  const airBoxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.16, 0.32),
    engineCastIronMat,
  );
  airBoxMesh.position.set(0, 0.82, 2.95);

  const altAirFlap = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.02),
    goldStripeMat,
  );
  altAirFlap.position.set(0.14, 0.82, 2.85);
  registerPart("air-induction", [airBoxMesh, altAirFlap], {
    explodeOffset: new THREE.Vector3(0, -0.5, 0.5),
  });

  // Engine Mount (Triangulated steel truss)
  const mountGroup: THREE.Mesh[] = [];
  const struts = [
    [new THREE.Vector3(0.48, 1.5, 2.04), new THREE.Vector3(0.2, 1.2, 2.45)],
    [new THREE.Vector3(-0.48, 1.5, 2.04), new THREE.Vector3(-0.2, 1.2, 2.45)],
    [new THREE.Vector3(0.48, 0.75, 2.04), new THREE.Vector3(0.2, 0.95, 2.45)],
    [new THREE.Vector3(-0.48, 0.75, 2.04), new THREE.Vector3(-0.2, 0.95, 2.45)],
  ];
  struts.forEach(([p1, p2]) => {
    const d = new THREE.Vector3().subVectors(p2, p1);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, d.length(), 6), brushedAlumMat);
    m.position.copy(p1).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    mountGroup.push(m);
  });
  registerPart("engine-mount", mountGroup, {
    explodeOffset: new THREE.Vector3(0, 0, 0.3),
  });

  // ─────────────────────────── 3. FUEL SYSTEM ───────────────────────────
  // Left Fuel Tank (28 US gal in inboard left wing)
  const fuelTankGeoL = new THREE.BoxGeometry(1.6, 0.16, 0.88);
  const fuelTankMeshL = new THREE.Mesh(fuelTankGeoL, fuelCyanMat);
  fuelTankMeshL.position.set(1.65, 1.88, 1.28);
  registerPart("fuel-tank-l", [fuelTankMeshL], {
    explodeOffset: new THREE.Vector3(1.1, 0.6, 0),
  });

  // Right Fuel Tank (28 US gal in inboard right wing)
  const fuelTankGeoR = new THREE.BoxGeometry(1.6, 0.16, 0.88);
  const fuelTankMeshR = new THREE.Mesh(fuelTankGeoR, fuelCyanMat);
  fuelTankMeshR.position.set(-1.65, 1.88, 1.28);
  registerPart("fuel-tank-r", [fuelTankMeshR], {
    explodeOffset: new THREE.Vector3(-1.1, 0.6, 0),
  });

  // Fuel Vent Tube under left wing
  const ventGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.28, 8);
  ventGeo.rotateX(0.4);
  const ventMesh = new THREE.Mesh(ventGeo, brushedAlumMat);
  ventMesh.position.set(1.4, 1.68, 1.45);
  registerPart("fuel-vent", [ventMesh], {
    explodeOffset: new THREE.Vector3(0.5, -0.4, 0),
  });

  // Fuel Supply Lines (Door posts to floor selector)
  const lineMat = new THREE.MeshBasicMaterial({ color: "#0284c7" });
  const lineL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.1), lineMat);
  lineL.position.set(0.58, 1.35, 1.35);
  const lineR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.1), lineMat);
  lineR.position.set(-0.58, 1.35, 1.35);
  registerPart("fuel-lines", [lineL, lineR], {
    explodeOffset: new THREE.Vector3(0, 0.4, 0),
  });

  // Fuel Selector Valve (LEFT / BOTH / RIGHT / OFF on cabin floor)
  const selectorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), brushedAlumMat);
  selectorBase.position.set(0, 0.72, 1.08);
  const selectorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.04, 0.14), redEmergencyMat);
  selectorHandle.position.set(0, 0.75, 1.08);
  registerPart("fuel-selector", [selectorBase, selectorHandle], {
    explodeOffset: new THREE.Vector3(0, 0.4, 0),
    focusPoint: new THREE.Vector3(0, 0.75, 1.08),
  });

  // Fuel Shutoff Valve (Red push-pull knob)
  const shutoffKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06), redEmergencyMat);
  shutoffKnob.position.set(0.12, 0.74, 1.18);
  shutoffKnob.rotation.x = Math.PI / 2;
  registerPart("fuel-shutoff", [shutoffKnob], {
    explodeOffset: new THREE.Vector3(0.2, 0.3, 0),
  });

  // Fuel Strainer / Gascolator on firewall
  const strainerMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12),
    brushedAlumMat,
  );
  strainerMesh.position.set(-0.25, 0.85, 2.06);
  registerPart("fuel-strainer", [strainerMesh], {
    explodeOffset: new THREE.Vector3(-0.4, -0.3, 0.2),
  });

  // Auxiliary Fuel Pump (Electric boost & prime pump)
  const auxPumpMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.16, 12),
    engineCastIronMat,
  );
  auxPumpMesh.position.set(-0.15, 0.92, 2.12);
  registerPart("aux-fuel-pump", [auxPumpMesh], {
    explodeOffset: new THREE.Vector3(-0.3, 0.2, 0.2),
  });

  // Fuel Injection Servo (Throttle body metering unit)
  const servoMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.16, 0.18),
    brushedAlumMat,
  );
  servoMesh.position.set(0, 0.95, 2.72);
  registerPart("fuel-servo", [servoMesh], {
    explodeOffset: new THREE.Vector3(0, -0.4, 0.3),
  });

  // Flow Divider / Spider & Injector Lines atop engine
  const spiderMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.05, 10),
    copperBrassMat,
  );
  spiderMesh.position.set(0, 1.42, 2.62);
  registerPart("flow-divider", [spiderMesh], {
    explodeOffset: new THREE.Vector3(0, 0.6, 0),
  });

  // ─────────────────────────── 4. FLIGHT CONTROLS ───────────────────────────
  // Left Aileron (Frise type on outer trailing edge)
  const aileronGeoL = new THREE.BoxGeometry(1.65, 0.055, 0.26);
  const aileronMeshL = new THREE.Mesh(aileronGeoL, whitePaintMat);
  aileronMeshL.position.set(4.35, 1.98, 0.38);
  registerPart("aileron-l", [aileronMeshL], {
    explodeOffset: new THREE.Vector3(0.8, 0.3, -0.8),
  });
  controlSurfaces.aileronL = aileronMeshL;

  // Right Aileron
  const aileronGeoR = new THREE.BoxGeometry(1.65, 0.055, 0.26);
  const aileronMeshR = new THREE.Mesh(aileronGeoR, whitePaintMat);
  aileronMeshR.position.set(-4.35, 1.98, 0.38);
  registerPart("aileron-r", [aileronMeshR], {
    explodeOffset: new THREE.Vector3(-0.8, 0.3, -0.8),
  });
  controlSurfaces.aileronR = aileronMeshR;

  // Left Flap (Single-slot trailing edge flap)
  const flapGeoL = new THREE.BoxGeometry(1.9, 0.065, 0.34);
  const flapMeshL = new THREE.Mesh(flapGeoL, whitePaintMat);
  flapMeshL.position.set(2.45, 1.89, 0.36);
  registerPart("flap-l", [flapMeshL], {
    explodeOffset: new THREE.Vector3(0.5, -0.4, -0.7),
  });
  controlSurfaces.flapL = flapMeshL;

  // Right Flap
  const flapGeoR = new THREE.BoxGeometry(1.9, 0.065, 0.34);
  const flapMeshR = new THREE.Mesh(flapGeoR, whitePaintMat);
  flapMeshR.position.set(-2.45, 1.89, 0.36);
  registerPart("flap-r", [flapMeshR], {
    explodeOffset: new THREE.Vector3(-0.5, -0.4, -0.7),
  });
  controlSurfaces.flapR = flapMeshR;

  // Elevator
  const elevatorGeo = new THREE.BoxGeometry(3.35, 0.055, 0.38);
  const elevatorMesh = new THREE.Mesh(elevatorGeo, whitePaintMat);
  elevatorMesh.position.set(0, 1.58, -5.15);
  registerPart("elevator", [elevatorMesh], {
    explodeOffset: new THREE.Vector3(0, 0.2, -1.1),
  });
  controlSurfaces.elevator = elevatorMesh;

  // Elevator Trim Tab (Right trailing edge of elevator)
  const trimTabMesh = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.035, 0.12), whitePaintMat);
  trimTabMesh.position.set(-0.85, 1.58, -5.38);
  registerPart("trim-tab", [trimTabMesh], {
    explodeOffset: new THREE.Vector3(-0.3, 0.1, -1.4),
  });

  // Rudder
  const rudderGeo = new THREE.BoxGeometry(0.08, 1.25, 0.48);
  const rudderMesh = new THREE.Mesh(rudderGeo, whitePaintMat);
  rudderMesh.position.set(0, 2.15, -5.25);
  registerPart("rudder", [rudderMesh], {
    explodeOffset: new THREE.Vector3(0, 0.4, -1.2),
  });
  controlSurfaces.rudder = rudderMesh;

  // Control Yokes (Dual pilot & copilot control wheels)
  const yokesGroup: THREE.Mesh[] = [];
  [-0.26, 0.26].forEach((xOffset) => {
    // Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.38), chromeMat);
    shaft.position.set(xOffset, 1.28, 1.45);
    shaft.rotation.x = Math.PI / 2;

    // Cessna dual-horn yoke wheel
    const horn = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 20, Math.PI * 1.5), interiorCabinMat);
    horn.position.set(xOffset, 1.28, 1.26);
    yokesGroup.push(shaft, horn);
  });
  registerPart("yokes", yokesGroup, {
    explodeOffset: new THREE.Vector3(0, 0.3, -0.4),
    focusPoint: new THREE.Vector3(0.26, 1.28, 1.26),
  });

  // Rudder Pedals & Toe Brakes
  const pedalsGroup: THREE.Mesh[] = [];
  [-0.32, -0.2, 0.2, 0.32].forEach((xOffset) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.02), interiorCabinMat);
    p.position.set(xOffset, 0.82, 1.72);
    p.rotation.x = -0.4;
    pedalsGroup.push(p);
  });
  registerPart("rudder-pedals", pedalsGroup, {
    explodeOffset: new THREE.Vector3(0, -0.3, 0),
    focusPoint: new THREE.Vector3(0.26, 0.82, 1.72),
  });

  // Control Cables & Pulleys
  const cableMat = new THREE.MeshBasicMaterial({ color: "#a855f7" });
  const cableL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 4.2), cableMat);
  cableL.position.set(0.22, 1.24, -1.2);
  cableL.rotation.x = Math.PI / 2;
  registerPart("control-cables", [cableL], {
    explodeOffset: new THREE.Vector3(0, 0.3, 0),
  });

  // Flap Drive Motor in right wing root
  const flapMotorMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12),
    engineCastIronMat,
  );
  flapMotorMesh.position.set(-0.85, 1.82, 0.85);
  flapMotorMesh.rotation.z = Math.PI / 2;
  registerPart("flap-motor", [flapMotorMesh], {
    explodeOffset: new THREE.Vector3(-0.4, 0.3, 0),
  });

  // Elevator Trim Wheel on pedestal
  const trimWheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.028, 16),
    interiorCabinMat,
  );
  trimWheelMesh.position.set(0, 0.95, 1.34);
  trimWheelMesh.rotation.z = Math.PI / 2;
  registerPart("trim-wheel", [trimWheelMesh], {
    explodeOffset: new THREE.Vector3(0, 0.2, -0.2),
  });

  // ─────────────────────────── 5. LANDING GEAR & BRAKES ───────────────────────────
  // Left Main Gear (Spring steel leaf gear leg & wheel)
  const gearMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.045, 1.2, 8), whitePaintMat);
  gearMeshL.position.set(0.88, 0.62, 0.82);
  gearMeshL.rotation.z = -0.58;

  const wheelGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.14, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelL = new THREE.Mesh(wheelGeo, rubberTyreMat);
  wheelL.position.set(1.22, 0.19, 0.82);

  registerPart("main-gear-l", [gearMeshL, wheelL], {
    explodeOffset: new THREE.Vector3(0.9, -0.6, 0),
    focusPoint: new THREE.Vector3(1.22, 0.19, 0.82),
  });

  // Right Main Gear
  const gearMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.045, 1.2, 8), whitePaintMat);
  gearMeshR.position.set(-0.88, 0.62, 0.82);
  gearMeshR.rotation.z = 0.58;

  const wheelR = new THREE.Mesh(wheelGeo.clone(), rubberTyreMat);
  wheelR.position.set(-1.22, 0.19, 0.82);

  registerPart("main-gear-r", [gearMeshR, wheelR], {
    explodeOffset: new THREE.Vector3(-0.9, -0.6, 0),
    focusPoint: new THREE.Vector3(-1.22, 0.19, 0.82),
  });

  // Nose Gear Oleo Strut (Air/oil shock strut & scissors)
  const oleoUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.72, 12), whitePaintMat);
  oleoUpper.position.set(0, 0.65, 2.38);
  oleoUpper.rotation.x = -0.15;

  const oleoPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.38, 12), chromeMat);
  oleoPiston.position.set(0, 0.38, 2.42);
  oleoPiston.rotation.x = -0.15;

  registerPart("nose-gear", [oleoUpper, oleoPiston], {
    explodeOffset: new THREE.Vector3(0, -0.6, 0.5),
    focusPoint: new THREE.Vector3(0, 0.5, 2.4),
  });

  // Nose Wheel & Steering Linkage
  const noseWheelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16);
  noseWheelGeo.rotateZ(Math.PI / 2);
  const noseWheelMesh = new THREE.Mesh(noseWheelGeo, rubberTyreMat);
  noseWheelMesh.position.set(0, 0.16, 2.46);
  registerPart("nose-wheel", [noseWheelMesh], {
    explodeOffset: new THREE.Vector3(0, -0.7, 0.6),
  });

  // Shimmy Damper (Hydraulic stabilizer on nose strut)
  const shimmyMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8),
    brushedAlumMat,
  );
  shimmyMesh.position.set(0.06, 0.52, 2.36);
  shimmyMesh.rotation.z = Math.PI / 2;
  registerPart("shimmy-damper", [shimmyMesh], {
    explodeOffset: new THREE.Vector3(0.3, -0.2, 0.3),
  });

  // Disc Brakes (Steel discs and calipers on main gear)
  const brakeDiscL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), chromeMat);
  brakeDiscL.position.set(1.15, 0.19, 0.82);
  brakeDiscL.rotation.z = Math.PI / 2;

  const brakeDiscR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), chromeMat);
  brakeDiscR.position.set(-1.15, 0.19, 0.82);
  brakeDiscR.rotation.z = Math.PI / 2;
  registerPart("brakes", [brakeDiscL, brakeDiscR], {
    explodeOffset: new THREE.Vector3(0, -0.4, 0),
  });

  // Speed Fairings / Wheel Pants
  function createWheelPant(side: 1 | -1 | 0): THREE.Mesh {
    const pantGeo = new THREE.ConeGeometry(0.24, 0.82, 14);
    pantGeo.rotateX(Math.PI / 2);
    pantGeo.scale(0.85, 1, 1.2);
    return new THREE.Mesh(pantGeo, whitePaintMat);
  }

  const fairingL = createWheelPant(1);
  fairingL.position.set(1.22, 0.22, 0.82);
  registerPart("fairing-l", [fairingL], {
    explodeOffset: new THREE.Vector3(1.2, 0, 0),
    isExteriorShell: true,
  });

  const fairingR = createWheelPant(-1);
  fairingR.position.set(-1.22, 0.22, 0.82);
  registerPart("fairing-r", [fairingR], {
    explodeOffset: new THREE.Vector3(-1.2, 0, 0),
    isExteriorShell: true,
  });

  const fairingNose = createWheelPant(0);
  fairingNose.position.set(0, 0.2, 2.46);
  registerPart("fairing-nose", [fairingNose], {
    explodeOffset: new THREE.Vector3(0, -0.8, 0.8),
    isExteriorShell: true,
  });

  // ─────────────────────────── 6. COCKPIT & INSTRUMENTS ───────────────────────────
  // Instrument Panel & Glareshield
  const panelGeo = new THREE.BoxGeometry(1.08, 0.48, 0.08);
  const panelMesh = new THREE.Mesh(panelGeo, panelMat);
  panelMesh.position.set(0, 1.34, 1.48);

  const glareshieldGeo = new THREE.BoxGeometry(1.16, 0.08, 0.38);
  const glareshieldMesh = new THREE.Mesh(glareshieldGeo, interiorCabinMat);
  glareshieldMesh.position.set(0, 1.58, 1.56);
  registerPart("instrument-panel", [panelMesh, glareshieldMesh], {
    explodeOffset: new THREE.Vector3(0, 0.4, 0.4),
    focusPoint: new THREE.Vector3(0, 1.36, 1.48),
  });

  // Garmin G1000 PFD (Left Screen)
  const pfdGeo = new THREE.PlaneGeometry(0.32, 0.24);
  const pfdMat = new THREE.MeshBasicMaterial({ map: pfdTex });
  const pfdMesh = new THREE.Mesh(pfdGeo, pfdMat);
  pfdMesh.position.set(0.26, 1.36, 1.43);
  pfdMesh.rotation.y = Math.PI;
  registerPart("pfd", [pfdMesh], {
    explodeOffset: new THREE.Vector3(0.3, 0.4, -0.4),
    focusPoint: new THREE.Vector3(0.26, 1.36, 1.43),
  });

  // Garmin G1000 MFD (Center/Right Screen)
  const mfdGeo = new THREE.PlaneGeometry(0.32, 0.24);
  const mfdMat = new THREE.MeshBasicMaterial({ map: mfdTex });
  const mfdMesh = new THREE.Mesh(mfdGeo, mfdMat);
  mfdMesh.position.set(-0.16, 1.36, 1.43);
  mfdMesh.rotation.y = Math.PI;
  registerPart("mfd", [mfdMesh], {
    explodeOffset: new THREE.Vector3(-0.3, 0.4, -0.4),
    focusPoint: new THREE.Vector3(-0.16, 1.36, 1.43),
  });

  // Standby Analogue Instruments (Airspeed, Horizon, Altimeter)
  const standbyMeshes: THREE.Mesh[] = [];
  [-0.04, 0.04, 0.12].forEach((yOff, i) => {
    const gauge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.02, 16),
      chromeMat,
    );
    gauge.position.set(0.04, 1.42 + yOff * 0.7, 1.44);
    gauge.rotation.x = Math.PI / 2;
    standbyMeshes.push(gauge);
  });
  registerPart("standby-instruments", standbyMeshes, {
    explodeOffset: new THREE.Vector3(0, 0.4, -0.3),
  });

  // Magnetic Compass mounted at windshield center
  const compassMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12),
    interiorCabinMat,
  );
  compassMesh.position.set(0, 1.72, 1.58);
  registerPart("compass", [compassMesh], {
    explodeOffset: new THREE.Vector3(0, 0.5, 0),
  });

  // Engine Throttle & Mixture Vernier Knobs
  const throttleKnob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.08),
    interiorCabinMat, // Black throttle knob
  );
  throttleKnob.position.set(0.06, 1.08, 1.44);
  throttleKnob.rotation.x = Math.PI / 2;

  const mixtureKnob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.08),
    redEmergencyMat, // Red mixture knob
  );
  mixtureKnob.position.set(-0.06, 1.08, 1.44);
  mixtureKnob.rotation.x = Math.PI / 2;
  registerPart("engine-controls", [throttleKnob, mixtureKnob], {
    explodeOffset: new THREE.Vector3(0, 0.2, -0.3),
  });

  // Front Pilot & Copilot Seats
  const frontSeats: THREE.Mesh[] = [];
  [-0.28, 0.28].forEach((xOff) => {
    // Cushion
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.44), seatLeatherMat);
    seatBase.position.set(xOff, 0.88, 0.85);

    // Backrest
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.08), seatLeatherMat);
    seatBack.position.set(xOff, 1.22, 0.65);
    seatBack.rotation.x = -0.15;

    // Headrest
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.06), seatLeatherMat);
    headrest.position.set(xOff, 1.56, 0.58);

    frontSeats.push(seatBase, seatBack, headrest);
  });
  registerPart("front-seats", frontSeats, {
    explodeOffset: new THREE.Vector3(0, 0.4, 0),
    focusPoint: new THREE.Vector3(0.28, 1.2, 0.85),
  });

  // Rear Passenger Bench Seat
  const rearSeatBase = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.12, 0.44), seatLeatherMat);
  rearSeatBase.position.set(0, 0.92, 0.1);
  const rearSeatBack = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.55, 0.08), seatLeatherMat);
  rearSeatBack.position.set(0, 1.24, -0.08);
  rearSeatBack.rotation.x = -0.15;
  registerPart("rear-seat", [rearSeatBase, rearSeatBack], {
    explodeOffset: new THREE.Vector3(0, 0.4, 0),
  });

  // Pitot Tube (L-shaped heated probe under left wing)
  const pitotGroup: THREE.Mesh[] = [];
  const pitotMast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18), chromeMat);
  pitotMast.position.set(2.85, 1.76, 1.25);
  const pitotHead = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14), chromeMat);
  pitotHead.position.set(2.85, 1.68, 1.32);
  pitotHead.rotation.x = Math.PI / 2;
  pitotGroup.push(pitotMast, pitotHead);
  registerPart("pitot-tube", pitotGroup, {
    explodeOffset: new THREE.Vector3(0.6, -0.4, 0.4),
    focusPoint: new THREE.Vector3(2.85, 1.68, 1.32),
  });

  // Static Port (Flush ambient port on forward left fuselage)
  const staticMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 12), chromeMat);
  staticMesh.position.set(0.61, 1.22, 1.82);
  staticMesh.rotation.z = Math.PI / 2;
  registerPart("static-port", [staticMesh], {
    explodeOffset: new THREE.Vector3(0.5, 0, 0.2),
  });

  // Stall Warning Reed Inlet on left wing leading edge
  const stallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.03), chromeMat);
  stallMesh.position.set(1.95, 1.94, 1.72);
  registerPart("stall-warning", [stallMesh], {
    explodeOffset: new THREE.Vector3(0.4, 0.3, 0.5),
  });

  // 24V Aircraft Battery on firewall
  const batteryMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.22, 0.18),
    engineCastIronMat,
  );
  batteryMesh.position.set(0.28, 1.35, 2.06);
  registerPart("battery", [batteryMesh], {
    explodeOffset: new THREE.Vector3(0.4, 0.4, 0.2),
  });

  // Audio Panel & Autopilot
  const audioMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.12, 0.02),
    interiorCabinMat,
  );
  audioMesh.position.set(0.05, 1.36, 1.44);
  audioMesh.rotation.y = Math.PI;
  registerPart("audio-panel", [audioMesh], {
    explodeOffset: new THREE.Vector3(0, 0.3, -0.3),
  });

  return {
    root,
    parts,
    linkGroup,
    propellerMesh: propGroup,
    controlSurfaces,
  };
}
