import * as THREE from "three";
import { PARTS, SYSTEM_BY_ID, type AtlasPart, type SystemId } from "./lear24-data";

export interface BuiltPartNode {
  part: AtlasPart;
  group: THREE.Group;
  meshes: THREE.Mesh[];
  basePosition: THREE.Vector3;
  explodeOffset: THREE.Vector3;
  focusPoint: THREE.Vector3; // local center in unexploded aircraft coordinates
  isExteriorShell: boolean;
}

export interface BuiltAircraftScene {
  root: THREE.Group;
  parts: Record<string, BuiltPartNode>;
  linkGroup: THREE.Group;
  propellerAndRotorMeshes: THREE.Object3D[];
}

/**
 * Generates a procedural studio hangar environment texture so metallic aluminum,
 * chrome inlet lips, and cockpit glass reflect realistic overhead bay lights and horizon gradients.
 */
export function createHangarEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#0b0f17");

  // Overhead studio softbox strips
  const stripGeo = new THREE.PlaneGeometry(18, 3.2);
  const stripMat1 = new THREE.MeshBasicMaterial({ color: new THREE.Color("#f8fafc"), side: THREE.DoubleSide });
  const stripMat2 = new THREE.MeshBasicMaterial({ color: new THREE.Color("#bae6fd"), side: THREE.DoubleSide });
  const stripMatWarm = new THREE.MeshBasicMaterial({ color: new THREE.Color("#fed7aa"), side: THREE.DoubleSide });

  const topLight = new THREE.Mesh(stripGeo, stripMat1);
  topLight.position.set(0, 14, 0);
  topLight.rotation.x = Math.PI / 2;
  envScene.add(topLight);

  const keyStrip = new THREE.Mesh(stripGeo, stripMat2);
  keyStrip.position.set(12, 9, 8);
  keyStrip.lookAt(0, 0, 0);
  envScene.add(keyStrip);

  const rimStrip = new THREE.Mesh(stripGeo, stripMatWarm);
  rimStrip.position.set(-13, 6, -10);
  rimStrip.lookAt(0, 0, 0);
  envScene.add(rimStrip);

  // Horizon ring for realistic fuselage specular band
  const ringGeo = new THREE.CylinderGeometry(24, 24, 1.4, 48, 1, true);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#334155"),
    side: THREE.BackSide,
  });
  const horizonRing = new THREE.Mesh(ringGeo, ringMat);
  horizonRing.position.y = 1.2;
  envScene.add(horizonRing);

  const renderTarget = pmrem.fromScene(envScene, 0.035);
  pmrem.dispose();
  return renderTarget.texture;
}

/**
 * Helper to create a smooth airfoil-shaped ExtrudeGeometry between root and tip stations.
 * Since Three.js ExtrudeGeometry extrudes along Z, we construct a custom BufferGeometry
 * lofted between root and tip airfoil chords for an authentic tapered, swept, dihedral wing!
 */
function createLoftedWingGeometry(opts: {
  side: 1 | -1; // +1 = Left (+X), -1 = Right (-X)
  xRoot: number;
  xTip: number;
  zRootLeading: number;
  zTipLeading: number;
  chordRoot: number;
  chordTip: number;
  yRoot: number;
  yTip: number;
  thicknessRoot: number;
  thicknessTip: number;
  chordSegments?: number;
  spanSegments?: number;
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
    thicknessRoot,
    thicknessTip,
    chordSegments = 28,
    spanSegments = 18,
  } = opts;

  // Generate closed airfoil loop around chord s in [0..1] (top surface 0->1, bottom surface 1->0)
  const ringPoints = chordSegments * 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // NACA-style symmetric/slightly cambered thickness distribution
  function airfoilProfile(s: number): { yNorm: number; camber: number } {
    const x = Math.max(0, Math.min(1, s));
    const yt =
      5 *
      (0.2969 * Math.sqrt(x) -
        0.126 * x -
        0.3516 * x * x +
        0.2843 * x * x * x -
        0.1036 * x * x * x * x);
    const camber = 0.018 * Math.sin(Math.PI * x);
    return { yNorm: yt, camber };
  }

  for (let i = 0; i <= spanSegments; i++) {
    const v = i / spanSegments;
    const x = THREE.MathUtils.lerp(xRoot, xTip, v) * side;
    const zLead = THREE.MathUtils.lerp(zRootLeading, zTipLeading, v);
    const chord = THREE.MathUtils.lerp(chordRoot, chordTip, v);
    const yBase = THREE.MathUtils.lerp(yRoot, yTip, v);
    const thick = THREE.MathUtils.lerp(thicknessRoot, thicknessTip, v);

    for (let j = 0; j <= ringPoints; j++) {
      const u = j / ringPoints;
      const isUpper = u <= 0.5;
      const s = isUpper ? u * 2 : (1 - u) * 2; // 0 at leading edge, 1 at trailing edge
      const { yNorm, camber } = airfoilProfile(s);
      const yOffset = (isUpper ? yNorm : -yNorm * 0.78) * thick + camber * thick;
      const z = zLead - s * chord;
      const y = yBase + yOffset;

      positions.push(x, y, z);
      uvs.push(s, v);
    }
  }

  const stride = ringPoints + 1;
  for (let i = 0; i < spanSegments; i++) {
    for (let j = 0; j < ringPoints; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);

      if (side === 1) {
        indices.push(a, b, d);
        indices.push(b, c, d);
      } else {
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Helper to create a fuselage LatheGeometry oriented along Z (+Z nose, -Z tail)
 * with realistic non-circular elliptical fuselage cross-section scaling.
 */
function createFuselageSegmentGeometry(
  profileZAndRadius: Array<[number, number, number?]>, // [z, radiusX, yOffset?]
  radialSegments = 48,
  thetaStart = 0,
  thetaLength = Math.PI * 2,
  verticalAspect = 1.06,
): THREE.BufferGeometry {
  const points = profileZAndRadius.map(([z, r]) => new THREE.Vector2(Math.max(0.001, r), z));
  const geo = new THREE.LatheGeometry(points, radialSegments, thetaStart, thetaLength);
  // LatheGeometry revolves around Y axis (x = r*sin, z = r*cos, y = latheY).
  // Rotate X by +90 deg so latheY becomes +Z!
  geo.rotateX(Math.PI / 2);

  // Apply vertical aspect & centerline droop (camber) if provided
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    let y = pos.getY(i) * verticalAspect;

    // Interpolate yOffset from profile stations
    let yShift = 0;
    for (let k = 0; k < profileZAndRadius.length - 1; k++) {
      const [z0, , yo0 = 0] = profileZAndRadius[k];
      const [z1, , yo1 = 0] = profileZAndRadius[k + 1];
      if ((z >= z0 && z <= z1) || (z <= z0 && z >= z1)) {
        const t = Math.abs(z1 - z0) > 1e-5 ? (z - z0) / (z1 - z0) : 0;
        yShift = THREE.MathUtils.lerp(yo0, yo1, t);
        break;
      }
    }
    pos.setY(i, y + yShift);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function createTubeAlongPoints(
  pts: Array<[number, number, number]>,
  radius: number,
  tubularSegments = 32,
  radialSegments = 12,
): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
}

/**
 * Builds the complete 56-part Learjet 24XR (`N24SA · serial 24-117`) 3D scene.
 */
export function buildLear24Scene(): BuiltAircraftScene {
  const root = new THREE.Group();
  root.name = "Learjet24XR_N24SA";

  const linkGroup = new THREE.Group();
  linkGroup.name = "AtlasConnectionLinks";
  root.add(linkGroup);

  const propellerAndRotorMeshes: THREE.Object3D[] = [];

  // Shared high-craft PBR material palette (each part clones its primary material so hover/isolate/seeThrough can mutate per-part safely)
  const baseMaterials = {
    airframeWhite: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e2e8f0"),
      metalness: 0.32,
      roughness: 0.22,
      clearcoat: 0.88,
      clearcoatRoughness: 0.12,
    }),
    airframeBellyAluminum: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#94a3b8"),
      metalness: 0.78,
      roughness: 0.22,
      clearcoat: 0.5,
    }),
    polishedChrome: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f1f5f9"),
      metalness: 0.92,
      roughness: 0.1,
      clearcoat: 0.9,
    }),
    radomeBlack: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1e293b"),
      metalness: 0.18,
      roughness: 0.36,
      clearcoat: 0.45,
    }),
    liveryStripeNavy: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1e3a8a"),
      metalness: 0.45,
      roughness: 0.2,
      clearcoat: 0.85,
    }),
    liveryStripeGold: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f59e0b"),
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.8,
    }),
    cockpitGlass: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0c2d48"),
      metalness: 0.15,
      roughness: 0.06,
      transparent: true,
      opacity: 0.72,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    }),
    structuralAlloy: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#64748b"),
      metalness: 0.72,
      roughness: 0.3,
    }),
    zincChromatePrimer: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#84cc16"),
      metalness: 0.45,
      roughness: 0.42,
    }),
    titaniumCore: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#94a3b8"),
      metalness: 0.85,
      roughness: 0.24,
    }),
    combustorBronze: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ea580c"),
      metalness: 0.75,
      roughness: 0.28,
      emissive: new THREE.Color("#7c2d12"),
      emissiveIntensity: 0.25,
    }),
    exhaustInconel: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#475569"),
      metalness: 0.82,
      roughness: 0.28,
    }),
    fuelCyan: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0ea5e9"),
      metalness: 0.28,
      roughness: 0.24,
      clearcoat: 0.6,
    }),
    fuelTankCell: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0284c7"),
      metalness: 0.2,
      roughness: 0.28,
      transparent: true,
      opacity: 0.78,
    }),
    controlViolet: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#a855f7"),
      metalness: 0.55,
      roughness: 0.28,
    }),
    controlSurface: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#cbd5e1"),
      metalness: 0.48,
      roughness: 0.24,
      clearcoat: 0.75,
    }),
    gearStrutSteel: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e2e8f0"),
      metalness: 0.88,
      roughness: 0.16,
    }),
    gearGreen: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#22c55e"),
      metalness: 0.52,
      roughness: 0.32,
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#18181b"),
      metalness: 0.08,
      roughness: 0.82,
    }),
    cabinGold: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#eab308"),
      metalness: 0.6,
      roughness: 0.28,
    }),
    bleedCopper: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f59e0b"),
      metalness: 0.72,
      roughness: 0.25,
    }),
    cockpitDark: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1e293b"),
      metalness: 0.35,
      roughness: 0.55,
    }),
  };

  const partsMap: Record<string, BuiltPartNode> = {};

  function registerPart(
    partId: string,
    buildFn: (group: THREE.Group, addMesh: (geo: THREE.BufferGeometry, mat: THREE.Material) => THREE.Mesh) => void,
    explodeOffset: [number, number, number],
    focusPoint: [number, number, number],
    isExteriorShell = false,
  ) {
    const part = PARTS.find((p) => p.id === partId);
    if (!part) return;

    const group = new THREE.Group();
    group.name = `part_${partId}`;
    group.userData = { partId, system: part.system };

    const meshes: THREE.Mesh[] = [];
    const addMesh = (geo: THREE.BufferGeometry, matTemplate: THREE.Material): THREE.Mesh => {
      const mat = matTemplate.clone();
      const sysColor = new THREE.Color(SYSTEM_BY_ID[part.system as SystemId].color);
      mat.userData = {
        originalColor: (mat as THREE.MeshStandardMaterial).color
          ? (mat as THREE.MeshStandardMaterial).color.clone()
          : new THREE.Color("#ffffff"),
        originalOpacity: mat.opacity,
        originalTransparent: mat.transparent,
        originalDepthWrite: mat.depthWrite,
        systemColor: sysColor,
        isExteriorShell,
      };
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { partId, system: part.system };
      group.add(mesh);
      meshes.push(mesh);
      return mesh;
    };

    buildFn(group, addMesh);
    root.add(group);

    partsMap[partId] = {
      part,
      group,
      meshes,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(...explodeOffset),
      focusPoint: new THREE.Vector3(...focusPoint),
      isExteriorShell,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. STRUCTURE & SKIN (11 PARTS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 1.1 Radome / nose cone (z = +4.45 to +6.55)
  registerPart(
    "radome",
    (_g, addMesh) => {
      const radomeGeo = createFuselageSegmentGeometry([
        [4.45, 0.56, -0.08],
        [4.85, 0.48, -0.11],
        [5.35, 0.36, -0.15],
        [5.85, 0.22, -0.18],
        [6.25, 0.1, -0.2],
        [6.52, 0.015, -0.21],
      ]);
      addMesh(radomeGeo, baseMaterials.airframeWhite);

      // Anti-glare carbon/dielectric radar tip cap
      const tipGeo = createFuselageSegmentGeometry([
        [5.65, 0.275, -0.17],
        [6.05, 0.16, -0.19],
        [6.38, 0.06, -0.205],
        [6.55, 0.008, -0.21],
      ]);
      addMesh(tipGeo, baseMaterials.radomeBlack);

      // Weather radar dish inside radome
      const dishGeo = new THREE.SphereGeometry(0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
      dishGeo.rotateX(Math.PI / 2);
      dishGeo.translate(0, -0.11, 4.72);
      addMesh(dishGeo, baseMaterials.structuralAlloy);

      // Dual chrome pitot probes on nose sides
      for (const side of [-1, 1]) {
        const probeGeo = createTubeAlongPoints(
          [
            [side * 0.38, -0.16, 4.95],
            [side * 0.44, -0.16, 5.05],
            [side * 0.44, -0.16, 5.42],
          ],
          0.014,
          12,
          8,
        );
        addMesh(probeGeo, baseMaterials.polishedChrome);
      }
    },
    [0, 0, 2.8],
    [0, -0.14, 5.4],
    true,
  );

  // 1.2 Pressurized cabin shell (z = -1.65 to +4.45)
  registerPart(
    "cabin-shell",
    (_g, addMesh) => {
      const shellGeo = createFuselageSegmentGeometry([
        [-1.65, 0.74, 0.02],
        [-0.8, 0.76, 0.02],
        [1.2, 0.76, 0.02],
        [2.55, 0.73, 0.01],
        [3.35, 0.67, -0.02],
        [4.05, 0.61, -0.05],
        [4.45, 0.56, -0.08],
      ]);
      addMesh(shellGeo, baseMaterials.airframeWhite);

      // Livery cheatline stripes (Navy + Gold) along cabin waist
      for (const side of [-1, 1]) {
        const navyStripeGeo = new THREE.BoxGeometry(0.025, 0.09, 5.85);
        navyStripeGeo.translate(side * 0.752, 0.01, 1.32);
        addMesh(navyStripeGeo, baseMaterials.liveryStripeNavy);

        const goldStripeGeo = new THREE.BoxGeometry(0.028, 0.035, 5.85);
        goldStripeGeo.translate(side * 0.754, -0.055, 1.32);
        addMesh(goldStripeGeo, baseMaterials.liveryStripeGold);
      }

      // Iconic Learjet elliptical cabin windows (3 per side)
      const winZPositions = [1.55, 0.45, -0.65];
      for (const side of [-1, 1]) {
        for (const wz of winZPositions) {
          const bezelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24);
          bezelGeo.scale(1, 1, 1.38);
          bezelGeo.rotateZ(Math.PI / 2);
          bezelGeo.translate(side * 0.74, 0.19, wz);
          addMesh(bezelGeo, baseMaterials.polishedChrome);

          const paneGeo = new THREE.CylinderGeometry(0.135, 0.135, 0.06, 24);
          paneGeo.scale(1, 1, 1.38);
          paneGeo.rotateZ(Math.PI / 2);
          paneGeo.translate(side * 0.745, 0.19, wz);
          addMesh(paneGeo, baseMaterials.cockpitGlass);
        }
      }
    },
    [0, 2.35, 0.25],
    [0, 0.2, 1.1],
    true,
  );

  // 1.3 Windshield & bird-strike glass (z = +2.55 to +3.95)
  registerPart(
    "windshield",
    (_g, addMesh) => {
      // Curved wrap-around cockpit canopy glass
      const canopyGeo = new THREE.SphereGeometry(
        0.69,
        32,
        20,
        -Math.PI * 0.42,
        Math.PI * 0.84,
        Math.PI * 0.12,
        Math.PI * 0.34,
      );
      canopyGeo.scale(1.02, 0.88, 1.95);
      canopyGeo.rotateX(-0.18);
      canopyGeo.translate(0, 0.22, 3.05);
      addMesh(canopyGeo, baseMaterials.cockpitGlass);

      // Center bird-strike splitter post & polished windshield arch frame
      const centerPostGeo = createTubeAlongPoints(
        [
          [0, 0.39, 3.92],
          [0, 0.58, 3.35],
          [0, 0.74, 2.65],
        ],
        0.022,
        16,
        8,
      );
      addMesh(centerPostGeo, baseMaterials.polishedChrome);

      for (const side of [-1, 1]) {
        const browArchGeo = createTubeAlongPoints(
          [
            [0, 0.39, 3.92],
            [side * 0.42, 0.35, 3.55],
            [side * 0.64, 0.28, 2.75],
          ],
          0.02,
          16,
          8,
        );
        addMesh(browArchGeo, baseMaterials.polishedChrome);
      }
    },
    [0, 1.65, 1.45],
    [0, 0.48, 3.25],
    true,
  );

  // 1.4 Forward fuselage frames (internal structural rings & longerons)
  registerPart(
    "fwd-frames",
    (_g, addMesh) => {
      const frameStations = [4.2, 3.65, 3.05, 2.4, 1.65, 0.8, -0.1, -0.95];
      for (const fz of frameStations) {
        const radius = fz > 2.6 ? THREE.MathUtils.lerp(0.68, 0.53, (fz - 2.6) / 1.8) : 0.7;
        const ringGeo = new THREE.TorusGeometry(radius, 0.022, 10, 36);
        ringGeo.scale(1, 1.05, 1);
        ringGeo.translate(0, fz > 3.2 ? -0.04 : 0.01, fz);
        addMesh(ringGeo, baseMaterials.zincChromatePrimer);
      }
      // Longitudinal stringers & keel beam
      for (const angle of [-2.4, -1.57, -0.75, 0.4, 2.74]) {
        const sx = Math.cos(angle) * 0.66;
        const sy = Math.sin(angle) * 0.68;
        const strGeo = new THREE.CylinderGeometry(0.014, 0.014, 5.1, 8);
        strGeo.rotateX(Math.PI / 2);
        strGeo.translate(sx, sy, 1.6);
        addMesh(strGeo, baseMaterials.structuralAlloy);
      }
    },
    [0, -1.15, 0.85],
    [0, 0, 2.1],
    false,
  );

  // 1.5 Clam-shell cabin door (Port forward fuselage z = +1.85 to +2.55, x = +0.74)
  registerPart(
    "cabin-door",
    (_g, addMesh) => {
      // Upper clamshell panel with port entry window
      const upperDoorGeo = new THREE.CylinderGeometry(
        0.765,
        0.765,
        0.72,
        24,
        1,
        true,
        Math.PI * 0.12,
        Math.PI * 0.34,
      );
      upperDoorGeo.rotateX(Math.PI / 2);
      upperDoorGeo.translate(0.01, 0.02, 2.18);
      addMesh(upperDoorGeo, baseMaterials.airframeWhite);

      // Lower folding airstair door frame & steps
      const stepFrameGeo = new THREE.BoxGeometry(0.06, 0.52, 0.68);
      stepFrameGeo.translate(0.73, -0.18, 2.18);
      addMesh(stepFrameGeo, baseMaterials.structuralAlloy);

      // Locking handle & pressure seal rim
      const handleGeo = new THREE.BoxGeometry(0.04, 0.14, 0.04);
      handleGeo.translate(0.77, 0.1, 2.38);
      addMesh(handleGeo, baseMaterials.polishedChrome);
    },
    [2.1, 0.35, 0.65],
    [0.75, 0.05, 2.18],
    true,
  );

  // 1.6 Main wing box & 8-spar structure (Swiss FFA P-16 heritage multi-spar box)
  registerPart(
    "wing-box",
    (_g, addMesh) => {
      // Center carry-through keel box under cabin floor
      const centerBoxGeo = new THREE.BoxGeometry(1.52, 0.22, 1.65);
      centerBoxGeo.translate(0, -0.58, -0.15);
      addMesh(centerBoxGeo, baseMaterials.structuralAlloy);

      // 8 spanwise spars extending into both wings
      for (let sIdx = 0; sIdx < 8; sIdx++) {
        const frac = sIdx / 7; // 0 (leading) to 1 (trailing)
        const zRoot = THREE.MathUtils.lerp(0.62, -1.02, frac);
        const zTip = THREE.MathUtils.lerp(-0.48, -1.42, frac);
        for (const side of [-1, 1]) {
          const sparGeo = createTubeAlongPoints(
            [
              [side * 0.68, -0.56, zRoot],
              [side * 2.6, -0.45, THREE.MathUtils.lerp(zRoot, zTip, 0.45)],
              [side * 4.85, -0.32, zTip],
            ],
            0.022,
            16,
            6,
          );
          addMesh(sparGeo, baseMaterials.zincChromatePrimer);
        }
      }

      // Chordwise wing ribs (6 per side)
      for (const side of [-1, 1]) {
        for (const spanX of [1.1, 1.85, 2.6, 3.35, 4.1, 4.75]) {
          const t = (spanX - 0.7) / 4.3;
          const chord = THREE.MathUtils.lerp(1.65, 0.92, t);
          const zMid = THREE.MathUtils.lerp(-0.2, -0.95, t);
          const yMid = THREE.MathUtils.lerp(-0.56, -0.32, t);
          const ribGeo = new THREE.BoxGeometry(0.025, 0.12 * (1 - t * 0.45), chord);
          ribGeo.translate(side * spanX, yMid, zMid);
          addMesh(ribGeo, baseMaterials.structuralAlloy);
        }
      }
    },
    [0, -1.55, 0],
    [0, -0.52, -0.35],
    false,
  );

  // 1.7 Left wing skin (+X side, x = +0.68 to +5.05)
  registerPart(
    "wing-skin-l",
    (_g, addMesh) => {
      const wingGeo = createLoftedWingGeometry({
        side: 1,
        xRoot: 0.66,
        xTip: 5.05,
        zRootLeading: 0.78,
        zTipLeading: -0.42,
        chordRoot: 2.08,
        chordTip: 1.08,
        yRoot: -0.54,
        yTip: -0.28,
        thicknessRoot: 0.22,
        thicknessTip: 0.11,
      });
      addMesh(wingGeo, baseMaterials.airframeWhite);

      // Polished aluminum heated leading-edge cuff
      const leGeo = createTubeAlongPoints(
        [
          [0.68, -0.53, 0.77],
          [2.85, -0.41, 0.17],
          [5.04, -0.28, -0.41],
        ],
        0.042,
        20,
        12,
      );
      addMesh(leGeo, baseMaterials.polishedChrome);

      // Wing root belly fairing
      const fairingGeo = new THREE.SphereGeometry(0.42, 20, 14);
      fairingGeo.scale(0.65, 0.52, 3.1);
      fairingGeo.translate(0.72, -0.52, -0.25);
      addMesh(fairingGeo, baseMaterials.airframeBellyAluminum);
    },
    [1.85, 0.45, 0],
    [2.85, -0.42, -0.35],
    true,
  );

  // 1.8 Right wing skin (-X side, x = -0.68 to -5.05)
  registerPart(
    "wing-skin-r",
    (_g, addMesh) => {
      const wingGeo = createLoftedWingGeometry({
        side: -1,
        xRoot: 0.66,
        xTip: 5.05,
        zRootLeading: 0.78,
        zTipLeading: -0.42,
        chordRoot: 2.08,
        chordTip: 1.08,
        yRoot: -0.54,
        yTip: -0.28,
        thicknessRoot: 0.22,
        thicknessTip: 0.11,
      });
      addMesh(wingGeo, baseMaterials.airframeWhite);

      const leGeo = createTubeAlongPoints(
        [
          [-0.68, -0.53, 0.77],
          [-2.85, -0.41, 0.17],
          [-5.04, -0.28, -0.41],
        ],
        0.042,
        20,
        12,
      );
      addMesh(leGeo, baseMaterials.polishedChrome);

      const fairingGeo = new THREE.SphereGeometry(0.42, 20, 14);
      fairingGeo.scale(0.65, 0.52, 3.1);
      fairingGeo.translate(-0.72, -0.52, -0.25);
      addMesh(fairingGeo, baseMaterials.airframeBellyAluminum);
    },
    [-1.85, 0.45, 0],
    [-2.85, -0.42, -0.35],
    true,
  );

  // 1.9 Rear equipment bay (unpressurized aft fuselage cone z = -5.85 to -1.65)
  registerPart(
    "aft-bay",
    (_g, addMesh) => {
      const aftConeGeo = createFuselageSegmentGeometry([
        [-5.85, 0.08, 0.28],
        [-5.15, 0.24, 0.22],
        [-4.25, 0.44, 0.15],
        [-3.25, 0.61, 0.08],
        [-2.35, 0.71, 0.04],
        [-1.65, 0.74, 0.02],
      ]);
      addMesh(aftConeGeo, baseMaterials.airframeWhite);

      // Dual ventral stability strakes under tailcone (authentic Learjet 24 feature)
      for (const side of [-1, 1]) {
        const strakeGeo = new THREE.BoxGeometry(0.025, 0.22, 1.55);
        strakeGeo.rotateX(-0.12);
        strakeGeo.rotateZ(side * 0.28);
        strakeGeo.translate(side * 0.22, -0.28, -4.15);
        addMesh(strakeGeo, baseMaterials.airframeBellyAluminum);
      }
    },
    [0, 0.35, -2.25],
    [0, 0.12, -3.5],
    true,
  );

  // 1.10 Dorsal fin (fillet blending fuselage spine into swept vertical fin)
  registerPart(
    "dorsal-fin",
    (_g, addMesh) => {
      const shape = new THREE.Shape();
      shape.moveTo(-2.1, 0.72);
      shape.lineTo(-4.15, 0.62);
      shape.lineTo(-3.65, 1.12);
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 4,
      });
      // ExtrudeGeometry is in XY plane extruded along Z; rotate Y by 90 deg so X becomes Z!
      extrudeGeo.rotateY(Math.PI / 2);
      extrudeGeo.translate(-0.04, 0, 0);
      addMesh(extrudeGeo, baseMaterials.airframeWhite);
    },
    [0, 1.35, -1.6],
    [0, 0.88, -3.2],
    true,
  );

  // 1.11 T-tail vertical stabilizer
  registerPart(
    "vertical-stab",
    (_g, addMesh) => {
      // Swept vertical fin lofted using airfoil geometry rotated vertically
      const finGeo = createLoftedWingGeometry({
        side: 1,
        xRoot: 0.48,
        xTip: 2.48,
        zRootLeading: -3.55,
        zTipLeading: -5.05,
        chordRoot: 1.78,
        chordTip: 1.05,
        yRoot: 0,
        yTip: 0,
        thicknessRoot: 0.18,
        thicknessTip: 0.11,
      });
      // Rotate Z by +90 deg so span (+X) becomes vertical height (+Y)
      finGeo.rotateZ(Math.PI / 2);
      addMesh(finGeo, baseMaterials.airframeWhite);

      // T-tail bullet fairing (acorn) at top of vertical fin
      const bulletGeo = createFuselageSegmentGeometry(
        [
          [-6.45, 0.02, 2.52],
          [-5.95, 0.12, 2.52],
          [-5.25, 0.15, 2.52],
          [-4.75, 0.11, 2.52],
          [-4.45, 0.02, 2.52],
        ],
        24,
      );
      addMesh(bulletGeo, baseMaterials.liveryStripeNavy);

      // Chrome leading edge on vertical fin
      const finLeGeo = createTubeAlongPoints(
        [
          [0, 0.52, -3.55],
          [0, 1.5, -4.3],
          [0, 2.48, -5.05],
        ],
        0.028,
        16,
        10,
      );
      addMesh(finLeGeo, baseMaterials.polishedChrome);
    },
    [0, 1.85, -2.15],
    [0, 1.65, -4.85],
    true,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. PROPULSION (10 PARTS — GE CJ610 TURBOJETS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 2.1 Left CJ610 turbojet core (x = +1.08, y = +0.42, z = -3.7 to -2.1)
  registerPart(
    "engine-core-l",
    (_g, addMesh) => {
      const coreGeo = createFuselageSegmentGeometry(
        [
          [-3.82, 0.21, 0.42],
          [-3.35, 0.25, 0.42],
          [-2.65, 0.26, 0.42],
          [-2.15, 0.23, 0.42],
        ],
        32,
      );
      coreGeo.translate(1.08, 0, 0);
      addMesh(coreGeo, baseMaterials.titaniumCore);

      // Compressor bleed manifold & external fuel/oil lines on core
      for (const zRing of [-2.45, -2.85, -3.25, -3.65]) {
        const flangeGeo = new THREE.TorusGeometry(0.265, 0.016, 10, 28);
        flangeGeo.translate(1.08, 0.42, zRing);
        addMesh(flangeGeo, baseMaterials.polishedChrome);
      }
    },
    [2.1, 0.65, -1.2],
    [1.08, 0.42, -2.95],
    false,
  );

  // 2.2 Right CJ610 turbojet core (x = -1.08, y = +0.42, z = -3.7 to -2.1)
  registerPart(
    "engine-core-r",
    (_g, addMesh) => {
      const coreGeo = createFuselageSegmentGeometry(
        [
          [-3.82, 0.21, 0.42],
          [-3.35, 0.25, 0.42],
          [-2.65, 0.26, 0.42],
          [-2.15, 0.23, 0.42],
        ],
        32,
      );
      coreGeo.translate(-1.08, 0, 0);
      addMesh(coreGeo, baseMaterials.titaniumCore);

      for (const zRing of [-2.45, -2.85, -3.25, -3.65]) {
        const flangeGeo = new THREE.TorusGeometry(0.265, 0.016, 10, 28);
        flangeGeo.translate(-1.08, 0.42, zRing);
        addMesh(flangeGeo, baseMaterials.polishedChrome);
      }
    },
    [-2.1, 0.65, -1.2],
    [-1.08, 0.42, -2.95],
    false,
  );

  // 2.3 Left engine nacelle & pylon
  registerPart(
    "nacelle-l",
    (_g, addMesh) => {
      // Outer aerodynamic cowling barrel (open at front & rear)
      const nacelleGeo = createFuselageSegmentGeometry(
        [
          [-4.05, 0.27, 0.42],
          [-3.65, 0.34, 0.42],
          [-2.75, 0.37, 0.42],
          [-2.05, 0.34, 0.42],
          [-1.82, 0.3, 0.42],
        ],
        36,
      );
      nacelleGeo.translate(1.08, 0, 0);
      addMesh(nacelleGeo, baseMaterials.airframeWhite);

      // Navy/gold accent stripe on nacelle
      const stripeGeo = new THREE.BoxGeometry(0.02, 0.065, 1.95);
      stripeGeo.translate(1.45, 0.42, -2.92);
      addMesh(stripeGeo, baseMaterials.liveryStripeNavy);

      // Aerodynamic pylon connecting aft fuselage to left nacelle
      const pylonGeo = new THREE.BoxGeometry(0.56, 0.14, 1.45);
      pylonGeo.rotateZ(0.14);
      pylonGeo.translate(0.76, 0.36, -2.88);
      addMesh(pylonGeo, baseMaterials.airframeBellyAluminum);
    },
    [2.85, 0.95, -0.8],
    [1.08, 0.42, -2.92],
    true,
  );

  // 2.4 Right engine nacelle & pylon
  registerPart(
    "nacelle-r",
    (_g, addMesh) => {
      const nacelleGeo = createFuselageSegmentGeometry(
        [
          [-4.05, 0.27, 0.42],
          [-3.65, 0.34, 0.42],
          [-2.75, 0.37, 0.42],
          [-2.05, 0.34, 0.42],
          [-1.82, 0.3, 0.42],
        ],
        36,
      );
      nacelleGeo.translate(-1.08, 0, 0);
      addMesh(nacelleGeo, baseMaterials.airframeWhite);

      const stripeGeo = new THREE.BoxGeometry(0.02, 0.065, 1.95);
      stripeGeo.translate(-1.45, 0.42, -2.92);
      addMesh(stripeGeo, baseMaterials.liveryStripeNavy);

      const pylonGeo = new THREE.BoxGeometry(0.56, 0.14, 1.45);
      pylonGeo.rotateZ(-0.14);
      pylonGeo.translate(-0.76, 0.36, -2.88);
      addMesh(pylonGeo, baseMaterials.airframeBellyAluminum);
    },
    [-2.85, 0.95, -0.8],
    [-1.08, 0.42, -2.92],
    true,
  );

  // 2.5 Compressor intake ducts (Polished chrome anti-ice inlet lips on both nacelles)
  registerPart(
    "intake-ducts",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const lipGeo = new THREE.TorusGeometry(0.285, 0.042, 16, 36);
        lipGeo.translate(side * 1.08, 0.42, -1.82);
        addMesh(lipGeo, baseMaterials.polishedChrome);

        const ductGeo = new THREE.CylinderGeometry(0.275, 0.255, 0.38, 32, 1, true);
        ductGeo.rotateX(Math.PI / 2);
        ductGeo.translate(side * 1.08, 0.42, -1.98);
        addMesh(ductGeo, baseMaterials.polishedChrome);
      }
    },
    [0, 0.85, 0.95],
    [1.08, 0.42, -1.85],
    false,
  );

  // 2.6 8-stage axial compressor rotors
  registerPart(
    "compressor",
    (group, addMesh) => {
      for (const side of [-1, 1]) {
        const rotorHub = new THREE.Group();
        rotorHub.position.set(side * 1.08, 0.42, -2.25);
        group.add(rotorHub);
        propellerAndRotorMeshes.push(rotorHub);

        // Nose bullet spinner
        const spinnerGeo = new THREE.ConeGeometry(0.095, 0.26, 24);
        spinnerGeo.rotateX(Math.PI / 2);
        spinnerGeo.translate(0, 0, 0.22);
        const sm = new THREE.Mesh(spinnerGeo, baseMaterials.polishedChrome.clone());
        sm.userData = { partId: "compressor", system: "propulsion" };
        rotorHub.add(sm);
        partsMap["compressor"]?.meshes.push(sm);

        // 8 axial stages + visible front fan blades
        for (let st = 0; st < 8; st++) {
          const zOff = 0.08 - st * 0.075;
          const discGeo = new THREE.CylinderGeometry(0.23 - st * 0.006, 0.23 - st * 0.006, 0.028, 24);
          discGeo.rotateX(Math.PI / 2);
          discGeo.translate(side * 1.08, 0.42, -2.25 + zOff);
          addMesh(discGeo, baseMaterials.titaniumCore);
        }

        // Radial inlet guide & rotor blades
        for (let b = 0; b < 16; b++) {
          const ang = (b / 16) * Math.PI * 2;
          const bladeGeo = new THREE.BoxGeometry(0.015, 0.22, 0.055);
          bladeGeo.rotateY(0.38);
          bladeGeo.rotateZ(ang);
          bladeGeo.translate(side * 1.08, 0.42, -2.14);
          addMesh(bladeGeo, baseMaterials.polishedChrome);
        }
      }
    },
    [0, 1.45, -0.4],
    [1.08, 0.42, -2.25],
    false,
  );

  // 2.7 Annular combustors
  registerPart(
    "combustor",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const canGeo = new THREE.CylinderGeometry(0.245, 0.235, 0.48, 28);
        canGeo.rotateX(Math.PI / 2);
        canGeo.translate(side * 1.08, 0.42, -3.12);
        addMesh(canGeo, baseMaterials.combustorBronze);

        // Fuel nozzle ring & 12 burner cans detail
        const manifoldGeo = new THREE.TorusGeometry(0.255, 0.018, 10, 28);
        manifoldGeo.translate(side * 1.08, 0.42, -2.92);
        addMesh(manifoldGeo, baseMaterials.liveryStripeGold);
      }
    },
    [0, 1.85, -1.35],
    [1.08, 0.42, -3.12],
    false,
  );

  // 2.8 Turbine & exhaust nozzles
  registerPart(
    "turbine-exhaust",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const nozGeo = createFuselageSegmentGeometry(
          [
            [-4.38, 0.19, 0.42],
            [-4.05, 0.24, 0.42],
            [-3.55, 0.245, 0.42],
          ],
          28,
        );
        nozGeo.translate(side * 1.08, 0, 0);
        addMesh(nozGeo, baseMaterials.exhaustInconel);

        // Inner turbine exhaust cone
        const coneGeo = new THREE.ConeGeometry(0.11, 0.42, 20);
        coneGeo.rotateX(-Math.PI / 2);
        coneGeo.translate(side * 1.08, 0.42, -4.05);
        addMesh(coneGeo, baseMaterials.combustorBronze);
      }
    },
    [0, 0.85, -2.35],
    [1.08, 0.42, -4.05],
    false,
  );

  // 2.9 Dee Howard thrust reverser buckets (Reported)
  registerPart(
    "thrust-reversers",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        // Upper & lower target-type clamshell buckets behind each exhaust nozzle
        for (const vSign of [-1, 1]) {
          const bucketGeo = new THREE.SphereGeometry(
            0.23,
            20,
            12,
            0,
            Math.PI,
            0,
            Math.PI * 0.42,
          );
          bucketGeo.scale(1, 0.85, 1.35);
          bucketGeo.rotateX(vSign > 0 ? Math.PI * 0.18 : -Math.PI * 0.82);
          bucketGeo.translate(side * 1.08, 0.42 + vSign * 0.14, -4.42);
          addMesh(bucketGeo, baseMaterials.polishedChrome);
        }
      }
    },
    [0, 0.45, -3.1],
    [1.08, 0.42, -4.42],
    false,
  );

  // 2.10 Starter-generators
  registerPart(
    "starter-gen",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const genGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.34, 18);
        genGeo.rotateX(Math.PI / 2);
        genGeo.translate(side * 0.92, 0.24, -2.55);
        addMesh(genGeo, baseMaterials.cabinGold);
      }
    },
    [0, -0.95, -1.4],
    [0.92, 0.24, -2.55],
    false,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. FUEL SYSTEM (7 PARTS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 3.1 Left wingtip tank (Iconic cylindrical Learjet tip tank at x = +5.18)
  registerPart(
    "tip-tank-l",
    (_g, addMesh) => {
      const tankGeo = createFuselageSegmentGeometry(
        [
          [-1.95, 0.015, -0.28],
          [-1.45, 0.16, -0.28],
          [-0.85, 0.24, -0.28],
          [0.45, 0.24, -0.28],
          [1.05, 0.15, -0.28],
          [1.48, 0.015, -0.28],
        ],
        32,
      );
      tankGeo.translate(5.18, 0, 0);
      addMesh(tankGeo, baseMaterials.airframeWhite);

      // Navy & gold cheatline on tip tank
      const stripeGeo = new THREE.BoxGeometry(0.025, 0.07, 2.65);
      stripeGeo.translate(5.41, -0.28, -0.2);
      addMesh(stripeGeo, baseMaterials.liveryStripeNavy);

      // Outboard horizontal stabilizer fin on tip tank
      const finGeo = new THREE.BoxGeometry(0.32, 0.025, 0.58);
      finGeo.rotateY(-0.25);
      finGeo.translate(5.42, -0.28, -1.32);
      addMesh(finGeo, baseMaterials.liveryStripeGold);

      // Red port navigation light lens
      const navLightGeo = new THREE.SphereGeometry(0.045, 12, 12);
      navLightGeo.translate(5.42, -0.28, 0.85);
      addMesh(
        navLightGeo,
        new THREE.MeshStandardMaterial({
          color: "#ef4444",
          emissive: "#ef4444",
          emissiveIntensity: 0.85,
        }),
      );
    },
    [2.95, 0.15, 0.2],
    [5.18, -0.28, -0.2],
    false,
  );

  // 3.2 Right wingtip tank (x = -5.18)
  registerPart(
    "tip-tank-r",
    (_g, addMesh) => {
      const tankGeo = createFuselageSegmentGeometry(
        [
          [-1.95, 0.015, -0.28],
          [-1.45, 0.16, -0.28],
          [-0.85, 0.24, -0.28],
          [0.45, 0.24, -0.28],
          [1.05, 0.15, -0.28],
          [1.48, 0.015, -0.28],
        ],
        32,
      );
      tankGeo.translate(-5.18, 0, 0);
      addMesh(tankGeo, baseMaterials.airframeWhite);

      const stripeGeo = new THREE.BoxGeometry(0.025, 0.07, 2.65);
      stripeGeo.translate(-5.41, -0.28, -0.2);
      addMesh(stripeGeo, baseMaterials.liveryStripeNavy);

      const finGeo = new THREE.BoxGeometry(0.32, 0.025, 0.58);
      finGeo.rotateY(0.25);
      finGeo.translate(-5.42, -0.28, -1.32);
      addMesh(finGeo, baseMaterials.liveryStripeGold);

      // Green starboard navigation light lens
      const navLightGeo = new THREE.SphereGeometry(0.045, 12, 12);
      navLightGeo.translate(-5.42, -0.28, 0.85);
      addMesh(
        navLightGeo,
        new THREE.MeshStandardMaterial({
          color: "#22c55e",
          emissive: "#22c55e",
          emissiveIntensity: 0.85,
        }),
      );
    },
    [-2.95, 0.15, 0.2],
    [-5.18, -0.28, -0.2],
    false,
  );

  // 3.3 Integral wing wet-tanks
  registerPart(
    "wing-tanks",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const wetWingGeo = createLoftedWingGeometry({
          side: side as 1 | -1,
          xRoot: 0.82,
          xTip: 4.82,
          zRootLeading: 0.52,
          zTipLeading: -0.52,
          chordRoot: 1.48,
          chordTip: 0.78,
          yRoot: -0.53,
          yTip: -0.3,
          thicknessRoot: 0.15,
          thicknessTip: 0.08,
          chordSegments: 16,
          spanSegments: 10,
        });
        addMesh(wetWingGeo, baseMaterials.fuelTankCell);
      }
    },
    [0, -1.05, 0.25],
    [2.4, -0.42, -0.35],
    false,
  );

  // 3.4 Fuselage fuel tank (Bladder tank in aft equipment bay z = -2.45 to -1.72)
  registerPart(
    "fuselage-tank",
    (_g, addMesh) => {
      const tankGeo = new THREE.CylinderGeometry(0.58, 0.54, 0.78, 28);
      tankGeo.rotateX(Math.PI / 2);
      tankGeo.translate(0, 0.08, -2.08);
      addMesh(tankGeo, baseMaterials.fuelTankCell);

      // Baffle straps
      for (const zOff of [-2.32, -1.85]) {
        const strapGeo = new THREE.TorusGeometry(0.57, 0.018, 10, 28);
        strapGeo.translate(0, 0.08, zOff);
        addMesh(strapGeo, baseMaterials.fuelCyan);
      }
    },
    [0, 1.35, -0.85],
    [0, 0.08, -2.08],
    false,
  );

  // 3.5 Electric transfer & boost pumps
  registerPart(
    "fuel-pumps",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const pumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.24, 16);
        pumpGeo.translate(side * 0.92, -0.54, -0.45);
        addMesh(pumpGeo, baseMaterials.fuelCyan);

        const xferGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.22, 16);
        xferGeo.translate(side * 0.32, -0.38, -1.95);
        addMesh(xferGeo, baseMaterials.fuelCyan);
      }
    },
    [0, -1.45, -0.5],
    [0.92, -0.54, -0.45],
    false,
  );

  // 3.6 Crossfeed valve & schematic fuel feed manifold lines
  registerPart(
    "crossfeed",
    (_g, addMesh) => {
      // Central crossfeed valve body
      const valveGeo = new THREE.SphereGeometry(0.11, 18, 18);
      valveGeo.translate(0, -0.48, -0.95);
      addMesh(valveGeo, baseMaterials.fuelCyan);

      // 3D schematic fuel feed lines from tip tanks -> wing tanks -> crossfeed -> firewall valves
      for (const side of [-1, 1]) {
        const lineGeo = createTubeAlongPoints(
          [
            [side * 5.12, -0.28, -0.25],
            [side * 3.1, -0.42, -0.38],
            [side * 0.92, -0.54, -0.45],
            [0, -0.48, -0.95],
            [side * 0.58, -0.1, -1.95],
            [side * 0.92, 0.35, -2.55],
          ],
          0.024,
          28,
          10,
        );
        addMesh(lineGeo, baseMaterials.fuelCyan);
      }
    },
    [0, -1.85, -0.95],
    [0, -0.48, -0.95],
    false,
  );

  // 3.7 Fuel shutoff firewall valves
  registerPart(
    "firewall-valves",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const fwGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
        fwGeo.translate(side * 0.88, 0.36, -2.68);
        addMesh(
          fwGeo,
          new THREE.MeshStandardMaterial({
            color: "#ef4444",
            metalness: 0.6,
            roughness: 0.25,
          }),
        );
      }
    },
    [0, 0.65, -1.55],
    [0.88, 0.36, -2.68],
    false,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. FLIGHT CONTROLS (13 PARTS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 4.1 Dual control yokes
  registerPart(
    "yokes",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const colGeo = createTubeAlongPoints(
          [
            [side * 0.26, -0.38, 3.18],
            [side * 0.26, 0.08, 3.05],
          ],
          0.02,
          10,
          8,
        );
        addMesh(colGeo, baseMaterials.cockpitDark);

        // Yoke Rams-horn wheel
        const hornGeo = new THREE.TorusGeometry(0.11, 0.018, 10, 24, Math.PI * 1.25);
        hornGeo.rotateZ(Math.PI * 0.88);
        hornGeo.translate(side * 0.26, 0.1, 3.02);
        addMesh(hornGeo, baseMaterials.controlViolet);
      }
    },
    [0, 0.95, 1.35],
    [0.26, 0.05, 3.05],
    false,
  );

  // 4.2 Left aileron
  registerPart(
    "aileron-l",
    (_g, addMesh) => {
      const ailGeo = createLoftedWingGeometry({
        side: 1,
        xRoot: 3.45,
        xTip: 4.92,
        zRootLeading: -0.95,
        zTipLeading: -1.18,
        chordRoot: 0.34,
        chordTip: 0.26,
        yRoot: -0.37,
        yTip: -0.29,
        thicknessRoot: 0.06,
        thicknessTip: 0.045,
        chordSegments: 10,
        spanSegments: 6,
      });
      addMesh(ailGeo, baseMaterials.controlSurface);
    },
    [2.35, 0, -0.95],
    [4.2, -0.33, -1.2],
    false,
  );

  // 4.3 Right aileron
  registerPart(
    "aileron-r",
    (_g, addMesh) => {
      const ailGeo = createLoftedWingGeometry({
        side: -1,
        xRoot: 3.45,
        xTip: 4.92,
        zRootLeading: -0.95,
        zTipLeading: -1.18,
        chordRoot: 0.34,
        chordTip: 0.26,
        yRoot: -0.37,
        yTip: -0.29,
        thicknessRoot: 0.06,
        thicknessTip: 0.045,
        chordSegments: 10,
        spanSegments: 6,
      });
      addMesh(ailGeo, baseMaterials.controlSurface);
    },
    [-2.35, 0, -0.95],
    [-4.2, -0.33, -1.2],
    false,
  );

  // 4.4 Left spoiler
  registerPart(
    "spoiler-l",
    (_g, addMesh) => {
      const spGeo = new THREE.BoxGeometry(1.42, 0.025, 0.24);
      spGeo.rotateY(-0.22);
      spGeo.rotateZ(0.05);
      spGeo.translate(2.35, -0.32, -0.68);
      addMesh(spGeo, baseMaterials.controlViolet);
    },
    [1.65, 0.65, -0.55],
    [2.35, -0.32, -0.68],
    false,
  );

  // 4.5 Right spoiler
  registerPart(
    "spoiler-r",
    (_g, addMesh) => {
      const spGeo = new THREE.BoxGeometry(1.42, 0.025, 0.24);
      spGeo.rotateY(0.22);
      spGeo.rotateZ(-0.05);
      spGeo.translate(-2.35, -0.32, -0.68);
      addMesh(spGeo, baseMaterials.controlViolet);
    },
    [-1.65, 0.65, -0.55],
    [-2.35, -0.32, -0.68],
    false,
  );

  // 4.6 Left trailing-edge Fowler flap
  registerPart(
    "flap-l",
    (_g, addMesh) => {
      const flapGeo = createLoftedWingGeometry({
        side: 1,
        xRoot: 0.85,
        xTip: 3.35,
        zRootLeading: -0.82,
        zTipLeading: -0.96,
        chordRoot: 0.46,
        chordTip: 0.35,
        yRoot: -0.54,
        yTip: -0.39,
        thicknessRoot: 0.08,
        thicknessTip: 0.06,
        chordSegments: 10,
        spanSegments: 8,
      });
      addMesh(flapGeo, baseMaterials.controlSurface);
    },
    [1.35, -0.45, -1.15],
    [2.1, -0.46, -1.1],
    false,
  );

  // 4.7 Right trailing-edge Fowler flap
  registerPart(
    "flap-r",
    (_g, addMesh) => {
      const flapGeo = createLoftedWingGeometry({
        side: -1,
        xRoot: 0.85,
        xTip: 3.35,
        zRootLeading: -0.82,
        zTipLeading: -0.96,
        chordRoot: 0.46,
        chordTip: 0.35,
        yRoot: -0.54,
        yTip: -0.39,
        thicknessRoot: 0.08,
        thicknessTip: 0.06,
        chordSegments: 10,
        spanSegments: 8,
      });
      addMesh(flapGeo, baseMaterials.controlSurface);
    },
    [-1.35, -0.45, -1.15],
    [-2.1, -0.46, -1.1],
    false,
  );

  // 4.8 Moveable horizontal stabilizer (pitch trim T-tail plane at y = +2.48)
  registerPart(
    "horizontal-stab",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const hStabGeo = createLoftedWingGeometry({
          side: side as 1 | -1,
          xRoot: 0.08,
          xTip: 2.25,
          zRootLeading: -4.85,
          zTipLeading: -5.58,
          chordRoot: 0.95,
          chordTip: 0.52,
          yRoot: 2.48,
          yTip: 2.48,
          thicknessRoot: 0.1,
          thicknessTip: 0.06,
          chordSegments: 16,
          spanSegments: 8,
        });
        addMesh(hStabGeo, baseMaterials.airframeWhite);
      }
    },
    [0, 2.45, -2.4],
    [0, 2.48, -5.45],
    false,
  );

  // 4.9 Elevators
  registerPart(
    "elevators",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const elevGeo = createLoftedWingGeometry({
          side: side as 1 | -1,
          xRoot: 0.14,
          xTip: 2.22,
          zRootLeading: -5.58,
          zTipLeading: -5.95,
          chordRoot: 0.28,
          chordTip: 0.18,
          yRoot: 2.48,
          yTip: 2.48,
          thicknessRoot: 0.055,
          thicknessTip: 0.035,
          chordSegments: 10,
          spanSegments: 6,
        });
        addMesh(elevGeo, baseMaterials.controlViolet);
      }
    },
    [0, 2.65, -3.15],
    [0, 2.48, -5.85],
    false,
  );

  // 4.10 Rudder
  registerPart(
    "rudder",
    (_g, addMesh) => {
      const rudGeo = createLoftedWingGeometry({
        side: 1,
        xRoot: 0.52,
        xTip: 2.38,
        zRootLeading: -4.92,
        zTipLeading: -5.75,
        chordRoot: 0.45,
        chordTip: 0.32,
        yRoot: 0,
        yTip: 0,
        thicknessRoot: 0.08,
        thicknessTip: 0.055,
        chordSegments: 10,
        spanSegments: 8,
      });
      rudGeo.rotateZ(Math.PI / 2);
      addMesh(rudGeo, baseMaterials.controlViolet);
    },
    [0, 1.85, -3.25],
    [0, 1.45, -5.55],
    false,
  );

  // 4.11 Control cable routing & bellcranks
  registerPart(
    "control-cables",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        // Fuselage & tail cable run
        const tailRunGeo = createTubeAlongPoints(
          [
            [side * 0.22, -0.35, 3.05],
            [side * 0.22, -0.45, 0.2],
            [side * 0.12, 0.15, -3.85],
            [0, 1.65, -5.1],
            [0, 2.45, -5.6],
          ],
          0.012,
          24,
          6,
        );
        addMesh(tailRunGeo, baseMaterials.controlViolet);

        // Wing aileron cable run
        const wingRunGeo = createTubeAlongPoints(
          [
            [side * 0.22, -0.45, -0.35],
            [side * 2.2, -0.42, -0.65],
            [side * 4.1, -0.33, -1.05],
          ],
          0.012,
          16,
          6,
        );
        addMesh(wingRunGeo, baseMaterials.controlViolet);
      }
    },
    [0, -1.25, -0.4],
    [0, -0.35, -0.5],
    false,
  );

  // 4.12 Stall warning vane & stick shaker
  registerPart(
    "stall-warning",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const vaneGeo = new THREE.BoxGeometry(0.08, 0.04, 0.12);
        vaneGeo.translate(side * 0.56, -0.02, 4.25);
        addMesh(vaneGeo, baseMaterials.controlViolet);
      }
    },
    [0, 0.45, 2.2],
    [0.56, -0.02, 4.25],
    false,
  );

  // 4.13 Yaw damper actuator
  registerPart(
    "yaw-damper",
    (_g, addMesh) => {
      const ydGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.36, 16);
      ydGeo.rotateX(Math.PI / 2);
      ydGeo.translate(0, 0.72, -4.55);
      addMesh(ydGeo, baseMaterials.controlViolet);
    },
    [0, 1.35, -2.55],
    [0, 0.72, -4.55],
    false,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. LANDING GEAR & BRAKES (7 PARTS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 5.1 Steerable nose gear strut (z = +3.85, y = -0.55 to -1.28)
  registerPart(
    "nose-gear",
    (_g, addMesh) => {
      const strutGeo = new THREE.CylinderGeometry(0.048, 0.04, 0.76, 18);
      strutGeo.rotateX(0.1);
      strutGeo.translate(0, -0.86, 3.85);
      addMesh(strutGeo, baseMaterials.gearStrutSteel);

      // Dual chined nosewheels
      for (const side of [-1, 1]) {
        const tireGeo = new THREE.TorusGeometry(0.14, 0.055, 16, 28);
        tireGeo.rotateY(Math.PI / 2);
        tireGeo.translate(side * 0.11, -1.22, 3.88);
        addMesh(tireGeo, baseMaterials.tireRubber);

        const hubGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.06, 18);
        hubGeo.rotateZ(Math.PI / 2);
        hubGeo.translate(side * 0.11, -1.22, 3.88);
        addMesh(hubGeo, baseMaterials.gearStrutSteel);
      }
    },
    [0, -1.75, 1.45],
    [0, -1.05, 3.86],
    false,
  );

  // 5.2 Left main gear oleo strut (x = +1.48, z = -0.48)
  registerPart(
    "main-gear-l",
    (_g, addMesh) => {
      const strutGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.78, 20);
      strutGeo.translate(1.48, -0.84, -0.48);
      addMesh(strutGeo, baseMaterials.gearStrutSteel);

      // Dual main tires on left leg
      for (const wOff of [-0.14, 0.14]) {
        const tireGeo = new THREE.TorusGeometry(0.21, 0.078, 18, 32);
        tireGeo.rotateY(Math.PI / 2);
        tireGeo.translate(1.48 + wOff, -1.18, -0.48);
        addMesh(tireGeo, baseMaterials.tireRubber);

        const hubGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
        hubGeo.rotateZ(Math.PI / 2);
        hubGeo.translate(1.48 + wOff, -1.18, -0.48);
        addMesh(hubGeo, baseMaterials.gearStrutSteel);
      }
    },
    [1.65, -1.85, -0.2],
    [1.48, -1.05, -0.48],
    false,
  );

  // 5.3 Right main gear oleo strut (x = -1.48, z = -0.48)
  registerPart(
    "main-gear-r",
    (_g, addMesh) => {
      const strutGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.78, 20);
      strutGeo.translate(-1.48, -0.84, -0.48);
      addMesh(strutGeo, baseMaterials.gearStrutSteel);

      for (const wOff of [-0.14, 0.14]) {
        const tireGeo = new THREE.TorusGeometry(0.21, 0.078, 18, 32);
        tireGeo.rotateY(Math.PI / 2);
        tireGeo.translate(-1.48 + wOff, -1.18, -0.48);
        addMesh(tireGeo, baseMaterials.tireRubber);

        const hubGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
        hubGeo.rotateZ(Math.PI / 2);
        hubGeo.translate(-1.48 + wOff, -1.18, -0.48);
        addMesh(hubGeo, baseMaterials.gearStrutSteel);
      }
    },
    [-1.65, -1.85, -0.2],
    [-1.48, -1.05, -0.48],
    false,
  );

  // 5.4 Gear doors
  registerPart(
    "gear-doors",
    (_g, addMesh) => {
      // Nose gear doors
      for (const side of [-1, 1]) {
        const ndGeo = new THREE.BoxGeometry(0.025, 0.34, 0.62);
        ndGeo.translate(side * 0.24, -0.72, 3.85);
        addMesh(ndGeo, baseMaterials.airframeWhite);
      }
      // Main gear doors
      for (const side of [-1, 1]) {
        const mdGeo = new THREE.BoxGeometry(0.03, 0.48, 0.56);
        mdGeo.translate(side * 1.66, -0.78, -0.48);
        addMesh(mdGeo, baseMaterials.airframeWhite);
      }
    },
    [0, -2.15, 0.3],
    [1.66, -0.78, -0.48],
    false,
  );

  // 5.5 Hydraulic retraction actuators
  registerPart(
    "gear-actuators",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const actGeo = createTubeAlongPoints(
          [
            [side * 1.05, -0.52, -0.48],
            [side * 1.46, -0.82, -0.48],
          ],
          0.026,
          8,
          10,
        );
        addMesh(actGeo, baseMaterials.gearGreen);
      }
    },
    [0, -1.45, -0.25],
    [1.25, -0.68, -0.48],
    false,
  );

  // 5.6 Multi-disc anti-skid brakes
  registerPart(
    "brakes",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const caliperGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.22, 18);
        caliperGeo.rotateZ(Math.PI / 2);
        caliperGeo.translate(side * 1.48, -1.18, -0.48);
        addMesh(caliperGeo, baseMaterials.gearGreen);
      }
    },
    [0, -2.35, -0.48],
    [1.48, -1.18, -0.48],
    false,
  );

  // 5.7 Squat switch (weight-on-wheels sensor on left main gear strut)
  registerPart(
    "squat-switch",
    (_g, addMesh) => {
      const swGeo = new THREE.BoxGeometry(0.11, 0.12, 0.11);
      swGeo.translate(1.42, -0.92, -0.42);
      addMesh(swGeo, baseMaterials.gearGreen);
    },
    [1.95, -1.65, -0.42],
    [1.42, -0.92, -0.42],
    false,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CABIN ENVIRONMENT & PRESSURIZATION (8 PARTS)
  // ═══════════════════════════════════════════════════════════════════════════

  // 6.1 Engine bleed-air ducting
  registerPart(
    "bleed-ducts",
    (_g, addMesh) => {
      for (const side of [-1, 1]) {
        const ductGeo = createTubeAlongPoints(
          [
            [side * 1.02, 0.38, -2.55],
            [side * 0.55, 0.25, -2.65],
            [0, -0.18, -2.55],
          ],
          0.028,
          16,
          10,
        );
        addMesh(ductGeo, baseMaterials.bleedCopper);
      }
    },
    [0, 1.15, -1.65],
    [0.55, 0.25, -2.6],
    false,
  );

  // 6.2 Heat exchanger & cooling pack
  registerPart(
    "heat-exchanger",
    (_g, addMesh) => {
      const packGeo = new THREE.BoxGeometry(0.46, 0.28, 0.52);
      packGeo.translate(0, -0.22, -2.55);
      addMesh(packGeo, baseMaterials.cabinGold);
    },
    [0, -1.15, -1.85],
    [0, -0.22, -2.55],
    false,
  );

  // 6.3 Forward pressure bulkhead (z = +4.42)
  registerPart(
    "bulkhead-fwd",
    (_g, addMesh) => {
      const bGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
      bGeo.rotateX(Math.PI / 2);
      bGeo.translate(0, -0.08, 4.42);
      addMesh(bGeo, baseMaterials.cabinGold);
    },
    [0, 0.55, 2.05],
    [0, -0.08, 4.42],
    false,
  );

  // 6.4 Aft pressure bulkhead (Hemispherical dome at z = -1.65)
  registerPart(
    "bulkhead-aft",
    (_g, addMesh) => {
      const domeGeo = new THREE.SphereGeometry(0.72, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.48);
      domeGeo.rotateX(-Math.PI / 2);
      domeGeo.translate(0, 0.02, -1.62);
      addMesh(domeGeo, baseMaterials.cabinGold);
    },
    [0, 1.45, -0.65],
    [0, 0.02, -1.65],
    false,
  );

  // 6.5 Cabin outflow & safety valves
  registerPart(
    "outflow-valve",
    (_g, addMesh) => {
      const outGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.14, 20);
      outGeo.rotateX(Math.PI / 2);
      outGeo.translate(0.24, 0.18, -1.68);
      addMesh(outGeo, baseMaterials.cabinGold);

      const safeGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.12, 20);
      safeGeo.rotateX(Math.PI / 2);
      safeGeo.translate(-0.24, 0.18, -1.68);
      addMesh(safeGeo, baseMaterials.polishedChrome);
    },
    [0, 1.75, -0.85],
    [0, 0.18, -1.68],
    false,
  );

  // 6.6 Emergency pressurization system
  registerPart(
    "emergency-press",
    (_g, addMesh) => {
      const epGeo = createTubeAlongPoints(
        [
          [0.45, 0.22, -2.55],
          [0.48, -0.18, -1.65],
          [0.48, -0.25, 0.45],
        ],
        0.022,
        18,
        8,
      );
      addMesh(epGeo, baseMaterials.cabinGold);
    },
    [1.25, 0.55, -0.85],
    [0.48, -0.18, -1.1],
    false,
  );

  // 6.7 Cockpit instrument panel shroud
  registerPart(
    "instrument-panel",
    (_g, addMesh) => {
      const panelGeo = new THREE.BoxGeometry(1.12, 0.42, 0.36);
      panelGeo.translate(0, 0.14, 3.45);
      addMesh(panelGeo, baseMaterials.cockpitDark);

      // Glowing avionics instrument dials on panel face
      for (const xOff of [-0.36, -0.12, 0.12, 0.36]) {
        const dialGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16);
        dialGeo.rotateX(Math.PI / 2);
        dialGeo.translate(xOff, 0.18, 3.26);
        addMesh(dialGeo, baseMaterials.cabinGold);
      }
    },
    [0, 1.25, 1.55],
    [0, 0.16, 3.45],
    false,
  );

  // 6.8 Passenger oxygen distribution manifold
  registerPart(
    "oxygen-manifold",
    (_g, addMesh) => {
      // High-pressure green O2 bottle
      const bottleGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.46, 18);
      bottleGeo.rotateX(Math.PI / 2);
      bottleGeo.translate(-0.35, 0.35, 3.95);
      addMesh(bottleGeo, baseMaterials.gearGreen);

      // Overhead ceiling O2 distribution manifold line
      const lineGeo = createTubeAlongPoints(
        [
          [-0.35, 0.35, 3.85],
          [0, 0.62, 2.55],
          [0, 0.65, -1.35],
        ],
        0.018,
        20,
        8,
      );
      addMesh(lineGeo, baseMaterials.cabinGold);
    },
    [0, 1.95, 0.55],
    [0, 0.62, 0.85],
    false,
  );

  return {
    root,
    parts: partsMap,
    linkGroup,
    propellerAndRotorMeshes,
  };
}
