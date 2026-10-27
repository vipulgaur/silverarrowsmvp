import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { toast } from "sonner";
import {
  CalendarPlus,
  CloudRain,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Layers,
  MapPin,
  Navigation,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Route as RouteIcon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wind,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, NativeSelect } from "@/components/app-ui";
import {
  AERODROME_CATALOGUE,
  computeAeronauticalMetrics,
  evaluateFlyabilityCondition,
  fetchComprehensiveWeatherBoard,
  parseCommaCoordinates,
  type AerodromeInfo,
} from "@/lib/weather";
import { useStore } from "@/lib/store";
import type { FlightRulesCategory } from "@/lib/types";

export interface RouteWaypoint {
  id: string;
  code: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  elevationFt: number;
  plannedAltFt: number;
  isCustomGps?: boolean;
  weather: {
    flightCategory: FlightRulesCategory;
    tempC: number;
    dewpointC: number;
    windDir: number;
    windSpeedKt: number;
    windGustKt?: number;
    visibilityMeters: number;
    cloudCoverPct: number;
    cloudBaseFtAgl: number;
    qnhHpa: number;
    precipMm: number;
    wxPhenomena?: string;
    metar: string;
    source: "open-meteo" | "calculated";
  };
}

export interface RouteLegMetrics {
  from: RouteWaypoint;
  to: RouteWaypoint;
  distanceNm: number;
  distanceKm: number;
  bearingTrueDeg: number;
  bearingMagDeg: number;
  headwindKt: number;
  crosswindKt: number;
  groundSpeedKt: number;
  eteMinutes: number;
}

interface FlightPathVisualizerProps {
  onApplyRouteToBooking?: (routeString: string, summaryNotes: string) => void;
  onApplyRouteToFlightLog?: (fromIcao: string, toIcao: string, remarks: string) => void;
  initialRouteCodes?: string[];
}

type MapTheater = "INDIA" | "DENMARK" | "GLOBAL";

const THEATER_CONFIG: Record<
  MapTheater,
  {
    label: string;
    center: [number, number]; // [lon, lat]
    scale: number;
  }
> = {
  INDIA: {
    label: "Indian Subcontinent FIR (VIDF / VABF / VOMF)",
    center: [78.5, 21.5],
    scale: 1150,
  },
  DENMARK: {
    label: "Northern Europe / Denmark FIR (EKDK)",
    center: [10.8, 56.1],
    scale: 6200,
  },
  GLOBAL: {
    label: "Euro-Asia Intercontinental Corridor",
    center: [45.0, 36.0],
    scale: 390,
  },
};

// Simplified GeoJSON outlines for landmasses so the D3 map has clear geographic context offline & online
const INDIA_LAND_COORDS: [number, number][] = [
  [68.1, 23.6],
  [69.0, 22.2],
  [70.4, 20.9],
  [72.6, 21.6],
  [72.8, 19.0],
  [73.8, 15.4],
  [74.8, 12.9],
  [76.2, 9.9],
  [77.5, 8.1],
  [79.8, 10.3],
  [80.3, 13.1],
  [82.2, 16.9],
  [85.8, 19.8],
  [88.0, 21.6],
  [89.0, 22.1],
  [88.2, 26.5],
  [89.8, 26.0],
  [92.0, 26.8],
  [96.0, 28.0],
  [97.1, 27.8],
  [94.5, 24.8],
  [92.5, 23.8],
  [88.8, 22.5],
  [87.9, 25.1],
  [84.0, 27.5],
  [80.1, 28.8],
  [78.0, 31.2],
  [76.8, 33.2],
  [74.5, 34.5],
  [73.8, 32.5],
  [74.6, 31.0],
  [72.5, 28.0],
  [70.2, 26.8],
  [68.1, 23.6],
];

const DENMARK_LAND_COORDS: [number, number][] = [
  [8.1, 55.0],
  [8.1, 57.1],
  [10.6, 57.7],
  [10.9, 56.4],
  [10.4, 55.9],
  [9.8, 55.0],
  [8.1, 55.0],
];

const SJAELLAND_COORDS: [number, number][] = [
  [11.0, 55.2],
  [11.3, 56.0],
  [12.6, 56.1],
  [12.7, 55.6],
  [12.1, 55.0],
  [11.0, 55.2],
];

const PRESET_CORRIDORS: Array<{
  id: string;
  label: string;
  theater: MapTheater;
  codes: string[];
  description: string;
}> = [
  {
    id: "ind-central",
    label: "VIDP → VIJP → VAJB (Delhi–Jaipur–Jabalpur XC)",
    theater: "INDIA",
    codes: ["VIDP", "VIJP", "VAJB"],
    description: "Northern to Central India cross-country navigation training corridor",
  },
  {
    id: "ind-mp-triangle",
    label: "VAJB → VABP → VAID (Jabalpur–Bhopal–Indore Triangle)",
    theater: "INDIA",
    codes: ["VAJB", "VABP", "VAID"],
    description: "Madhya Pradesh 3-leg dual/solo cross-country qualifying triangle",
  },
  {
    id: "ind-west-south",
    label: "VABB → VAPO → VOHS → VOBL (West–South Corridor)",
    theater: "INDIA",
    codes: ["VABB", "VAPO", "VOHS", "VOBL"],
    description: "Mumbai via Pune and Hyderabad to Bengaluru high-elevation route",
  },
  {
    id: "dk-xc",
    label: "EKAH → EKBI → EKRK → EKCH (Danish Airspace XC)",
    theater: "DENMARK",
    codes: ["EKAH", "EKBI", "EKRK", "EKCH"],
    description: "Aarhus to Copenhagen Kastrup via Billund and Roskilde",
  },
];

const CATEGORY_COLORS: Record<
  FlightRulesCategory,
  { stroke: string; fill: string; badge: string; text: string }
> = {
  VFR: {
    stroke: "#10b981",
    fill: "rgba(16, 185, 129, 0.20)",
    badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    text: "#10b981",
  },
  MVFR: {
    stroke: "#3b82f6",
    fill: "rgba(59, 130, 246, 0.22)",
    badge: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    text: "#3b82f6",
  },
  IFR: {
    stroke: "#f59e0b",
    fill: "rgba(245, 158, 11, 0.24)",
    badge: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    text: "#f59e0b",
  },
  LIFR: {
    stroke: "#ef4444",
    fill: "rgba(239, 68, 68, 0.26)",
    badge: "bg-red-500/15 text-red-500 border-red-500/30",
    text: "#ef4444",
  },
};

/**
 * Calculates great-circle distance in Nautical Miles (NM) and initial true bearing (°T)
 * between two coordinates using the Haversine & forward-azimuth formulas.
 */
export function calculateGreatCircleLeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): { distanceNm: number; distanceKm: number; bearingTrueDeg: number } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const R_KM = 6371.0;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R_KM * c;
  const distanceNm = distanceKm / 1.852;

  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;

  return {
    distanceNm: Math.round(distanceNm * 10) / 10,
    distanceKm: Math.round(distanceKm * 10) / 10,
    bearingTrueDeg: Math.round(brng),
  };
}

/**
 * Synthesizes deterministic realistic weather for any geographic coordinate or aerodrome
 * when instant synchronous initialization is needed before live Open-Meteo fetch completes.
 */
export function synthesizeWaypointWeather(
  code: string,
  name: string,
  lat: number,
  lon: number,
): RouteWaypoint["weather"] {
  const seed = Math.abs(Math.round(lat * 137 + lon * 251));
  const windDir = ((seed * 17) % 36) * 10 || 270;
  const windSpeedKt = 7 + (seed % 14);
  const windGustKt = windSpeedKt >= 16 ? windSpeedKt + 7 : undefined;
  const cloudCoverPct = (seed * 13) % 92;
  const visibilityMeters = cloudCoverPct > 82 ? 4200 : cloudCoverPct > 65 ? 7000 : 9999;
  const tempC = Math.round((29 - Math.abs(lat - 20) * 0.45 + (seed % 5) - 2) * 10) / 10;
  const dewpointC = Math.round((tempC - (4 + (seed % 6))) * 10) / 10;
  const qnhHpa = 1008 + (seed % 11);
  const precipMm = cloudCoverPct > 80 ? Math.round(((seed % 6) + 1.2) * 10) / 10 : 0;
  const cloudBaseFtAgl = Math.max(
    600,
    Math.round(Math.max(0.5, tempC - dewpointC) * 400),
  );

  let flightCategory: FlightRulesCategory = "VFR";
  if (visibilityMeters < 1600 || cloudBaseFtAgl < 500) {
    flightCategory = "LIFR";
  } else if (visibilityMeters < 5000 || cloudBaseFtAgl < 1000) {
    flightCategory = "IFR";
  } else if (visibilityMeters <= 8000 || cloudBaseFtAgl <= 3000) {
    flightCategory = "MVFR";
  }

  const wxPhenomena =
    precipMm > 0 ? "-RA BR" : visibilityMeters < 6000 ? "HZ" : undefined;
  const windStr = `${String(windDir).padStart(3, "0")}${String(windSpeedKt).padStart(2, "0")}${
    windGustKt ? `G${String(windGustKt).padStart(2, "0")}` : ""
  }KT`;
  const visStr = String(Math.min(9999, visibilityMeters)).padStart(4, "0");
  const cloudStr =
    cloudCoverPct < 15
      ? "CAVOK"
      : `${cloudCoverPct > 75 ? "BKN" : "SCT"}${String(
          Math.max(5, Math.round(cloudBaseFtAgl / 100)),
        ).padStart(3, "0")}`;
  const tSign = (n: number) =>
    n < 0 ? `M${String(Math.abs(Math.round(n))).padStart(2, "0")}` : String(Math.round(n)).padStart(2, "0");

  const metar = `METAR ${code} ${new Date().getUTCDate().toString().padStart(2, "0")}1200Z ${windStr} ${visStr} ${
    wxPhenomena ? `${wxPhenomena} ` : ""
  }${cloudStr} ${tSign(tempC)}/${tSign(dewpointC)} Q${qnhHpa} NOSIG`;

  return {
    flightCategory,
    tempC,
    dewpointC,
    windDir,
    windSpeedKt,
    windGustKt,
    visibilityMeters,
    cloudCoverPct,
    cloudBaseFtAgl,
    qnhHpa,
    precipMm,
    wxPhenomena,
    metar,
    source: "calculated",
  };
}

export function createWaypointFromAerodrome(
  aero: AerodromeInfo,
  index: number,
): RouteWaypoint {
  return {
    id: `wpt-${aero.icao}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    code: aero.icao,
    name: aero.name,
    city: aero.city,
    lat: aero.lat,
    lon: aero.lon,
    elevationFt: aero.elevationFt,
    plannedAltFt: Math.max(3500, Math.ceil((aero.elevationFt + 2500) / 500) * 500),
    weather: synthesizeWaypointWeather(aero.icao, aero.name, aero.lat, aero.lon),
  };
}

export function createCustomGpsWaypoint(
  lat: number,
  lon: number,
  index: number,
  customLabel?: string,
): RouteWaypoint {
  const cleanLat = Math.round(lat * 10000) / 10000;
  const cleanLon = Math.round(lon * 10000) / 10000;
  const code = customLabel || `WPT${index + 1}`;
  const name = `GPS Waypoint ${code} (${Math.abs(cleanLat).toFixed(2)}°${cleanLat >= 0 ? "N" : "S"}, ${Math.abs(cleanLon).toFixed(2)}°${cleanLon >= 0 ? "E" : "W"})`;

  return {
    id: `wpt-gps-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 5)}`,
    code,
    name,
    city: `${cleanLat.toFixed(2)}°, ${cleanLon.toFixed(2)}°`,
    lat: cleanLat,
    lon: cleanLon,
    elevationFt: 1200,
    plannedAltFt: 4500,
    isCustomGps: true,
    weather: synthesizeWaypointWeather(code, name, cleanLat, cleanLon),
  };
}

export function FlightPathVisualizer({
  onApplyRouteToBooking,
  onApplyRouteToFlightLog,
  initialRouteCodes = ["VIDP", "VIJP", "VAJB"],
}: FlightPathVisualizerProps) {
  const { data, me, saveBooking, log } = useStore();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const profileSvgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [theater, setTheater] = useState<MapTheater>("INDIA");
  const [drawMode, setDrawMode] = useState<boolean>(true);
  const [cruiseTasKt, setCruiseTasKt] = useState<number>(115); // Cessna 172S cruise TAS

  // Weather Overlay Layer Toggles
  const [showWeatherHalos, setShowWeatherHalos] = useState<boolean>(true);
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);
  const [showRadarRings, setShowRadarRings] = useState<boolean>(true);
  const [showAllAerodromes, setShowAllAerodromes] = useState<boolean>(true);

  // Waypoints state
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>(() =>
    initialRouteCodes
      .map((code, idx) => {
        const aero = AERODROME_CATALOGUE[code.toUpperCase()];
        return aero ? createWaypointFromAerodrome(aero, idx) : null;
      })
      .filter((x): x is RouteWaypoint => x !== null),
  );

  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    () => waypoints[0]?.id ?? null,
  );
  const [fetchingLiveWx, setFetchingLiveWx] = useState<boolean>(false);
  const [stationToAdd, setStationToAdd] = useState<string>("VABP");
  const [customCoordInput, setCustomCoordInput] = useState<string>("");
  const [targetBookingId, setTargetBookingId] = useState<string>("");

  // Aircraft simulation along the D3 path
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0); // 0 to 1

  // Current zoom transform state for D3 SVG rendering
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(() => d3.zoomIdentity);

  const selectedWaypoint = useMemo(
    () => waypoints.find((w) => w.id === selectedWaypointId) ?? waypoints[0] ?? null,
    [waypoints, selectedWaypointId],
  );

  // Calculate leg-by-leg navigation & wind metrics
  const legs = useMemo<RouteLegMetrics[]>(() => {
    if (waypoints.length < 2) return [];
    const result: RouteLegMetrics[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i]!;
      const to = waypoints[i + 1]!;
      const gc = calculateGreatCircleLeg(from.lat, from.lon, to.lat, to.lon);

      // Average wind across the leg
      const avgWindSpeed = Math.round((from.weather.windSpeedKt + to.weather.windSpeedKt) / 2);
      const avgWindDir = from.weather.windDir;
      const angleRad = ((avgWindDir - gc.bearingTrueDeg) * Math.PI) / 180;
      const headwindKt = Math.round(avgWindSpeed * Math.cos(angleRad));
      const crosswindKt = Math.round(Math.abs(avgWindSpeed * Math.sin(angleRad)));
      const groundSpeedKt = Math.max(45, cruiseTasKt - headwindKt);
      const eteMinutes = Math.max(1, Math.round((gc.distanceNm / groundSpeedKt) * 60));

      result.push({
        from,
        to,
        distanceNm: gc.distanceNm,
        distanceKm: gc.distanceKm,
        bearingTrueDeg: gc.bearingTrueDeg,
        bearingMagDeg: (gc.bearingTrueDeg - 1 + 360) % 360,
        headwindKt,
        crosswindKt,
        groundSpeedKt,
        eteMinutes,
      });
    }
    return result;
  }, [waypoints, cruiseTasKt]);

  const routeTotals = useMemo(() => {
    const totalNm = Math.round(legs.reduce((acc, l) => acc + l.distanceNm, 0) * 10) / 10;
    const totalKm = Math.round(legs.reduce((acc, l) => acc + l.distanceKm, 0) * 10) / 10;
    const totalMinutes = legs.reduce((acc, l) => acc + l.eteMinutes, 0);
    const fuelGallons = Math.round((totalMinutes / 60) * 8.6 * 10) / 10; // C172S ~8.6 GPH
    const worstCategory: FlightRulesCategory = waypoints.some(
      (w) => w.weather.flightCategory === "LIFR",
    )
      ? "LIFR"
      : waypoints.some((w) => w.weather.flightCategory === "IFR")
        ? "IFR"
        : waypoints.some((w) => w.weather.flightCategory === "MVFR")
          ? "MVFR"
          : "VFR";

    return {
      totalNm,
      totalKm,
      totalMinutes,
      fuelGallons,
      worstCategory,
      routeString: waypoints.map((w) => w.code).join(" → "),
    };
  }, [legs, waypoints]);

  // Fetch live Open-Meteo weather for all waypoints in the route
  const refreshAllWaypointsLiveWeather = useCallback(
    async (targetList?: RouteWaypoint[], silent = false) => {
      const list = targetList ?? waypoints;
      if (list.length === 0) return;
      setFetchingLiveWx(true);
      try {
        const updated = await Promise.all(
          list.map(async (wpt) => {
            try {
              const board = await fetchComprehensiveWeatherBoard({
                lat: wpt.lat,
                lon: wpt.lon,
                customCity: wpt.city,
              });
              return {
                ...wpt,
                weather: {
                  flightCategory: board.current.flightCategory,
                  tempC: board.current.tempC,
                  dewpointC: board.current.dewpointC,
                  windDir: board.current.windDir,
                  windSpeedKt: board.current.windSpeedKt,
                  windGustKt: board.current.windGustKt,
                  visibilityMeters: board.current.visibilityMeters,
                  cloudCoverPct: board.current.cloudCoverPct ?? 25,
                  cloudBaseFtAgl: board.aeroMetrics.cloudBaseFtAgl,
                  qnhHpa: board.current.qnhHpa,
                  precipMm: board.current.precipMm ?? 0,
                  wxPhenomena: board.current.wxPhenomena,
                  metar: board.current.metar,
                  source: board.source === "open-meteo" ? ("open-meteo" as const) : ("calculated" as const),
                },
              };
            } catch {
              return wpt;
            }
          }),
        );
        setWaypoints(updated);
        if (!silent) {
          toast.success(
            `Updated live meteorological overlays for ${updated.length} route waypoints.`,
          );
        }
      } finally {
        setFetchingLiveWx(false);
      }
    },
    [waypoints],
  );

  // Fetch initial weather on first mount
  useEffect(() => {
    void refreshAllWaypointsLiveWeather(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aircraft route simulation timer
  useEffect(() => {
    if (!isSimulating || waypoints.length < 2) return;
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        const next = prev + 0.012;
        return next > 1 ? 0 : next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [isSimulating, waypoints.length]);

  // Configure D3 projection for the active theater
  const MAP_WIDTH = 920;
  const MAP_HEIGHT = 500;

  const projection = useMemo(() => {
    const cfg = THEATER_CONFIG[theater];
    return d3
      .geoMercator()
      .center(cfg.center)
      .scale(cfg.scale)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
  }, [theater]);

  // Initialize D3 Zoom behavior on the SVG canvas
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 8])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        setZoomTransform(event.transform);
      });

    zoomBehaviorRef.current = zoom;
    const selection = d3.select(svgEl);
    selection.call(zoom);

    return () => {
      selection.on(".zoom", null);
    };
  }, []);

  // Render D3 Interactive Map Elements, Graticules, Weather Overlays, Drag & Click Handlers
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    // 1. SVG Defs (Gradients, Glow Filters, Wind Markers)
    const defs = svg.append("defs");

    const glowFilter = defs
      .append("filter")
      .attr("id", "d3-route-glow")
      .attr("x", "-30%")
      .attr("y", "-30%")
      .attr("width", "160%")
      .attr("height", "160%");
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrowhead marker for wind vectors
    defs
      .append("marker")
      .attr("id", "wind-arrow-head")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L10,0L0,4")
      .attr("fill", "#38bdf8");

    // Arrowhead marker for flight leg direction
    defs
      .append("marker")
      .attr("id", "leg-direction-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 6)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L10,0L0,4")
      .attr("fill", "#0ea5e9");

    // Root zoomable group
    const rootG = svg
      .append("g")
      .attr("class", "d3-map-zoom-layer")
      .attr("transform", zoomTransform.toString());

    const geoPathGenerator = d3.geoPath().projection(projection);

    // 2. Render Graticule Grid (Lat/Lon Aeronautical Chart Gridlines)
    const graticule = d3.geoGraticule().step([2, 2]);
    rootG
      .append("path")
      .datum(graticule())
      .attr("d", geoPathGenerator as never)
      .attr("fill", "none")
      .attr("stroke", "rgba(56, 189, 248, 0.13)")
      .attr("stroke-width", 0.75 / zoomTransform.k)
      .attr("stroke-dasharray", "3,3");

    // 3. Render Geographic Landmass Polygons (India & Denmark outlines for chart situational awareness)
    const landFeatures: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "India FIR" },
          geometry: {
            type: "Polygon",
            coordinates: [INDIA_LAND_COORDS],
          },
        },
        {
          type: "Feature",
          properties: { name: "Jutland FIR" },
          geometry: {
            type: "Polygon",
            coordinates: [DENMARK_LAND_COORDS],
          },
        },
        {
          type: "Feature",
          properties: { name: "Sjælland FIR" },
          geometry: {
            type: "Polygon",
            coordinates: [SJAELLAND_COORDS],
          },
        },
      ],
    };

    rootG
      .selectAll(".fir-landmass")
      .data(landFeatures.features)
      .enter()
      .append("path")
      .attr("class", "fir-landmass")
      .attr("d", geoPathGenerator as never)
      .attr("fill", "rgba(30, 58, 138, 0.22)")
      .attr("stroke", "rgba(56, 189, 248, 0.35)")
      .attr("stroke-width", 1.2 / zoomTransform.k);

    // 4. Transparent Click Surface for Drawing Custom GPS Waypoints on Map
    rootG
      .append("rect")
      .attr("x", -MAP_WIDTH)
      .attr("y", -MAP_HEIGHT)
      .attr("width", MAP_WIDTH * 3)
      .attr("height", MAP_HEIGHT * 3)
      .attr("fill", "transparent")
      .style("cursor", drawMode ? "crosshair" : "grab")
      .on("click", (event: MouseEvent) => {
        if (!drawMode) return;
        const [mx, my] = d3.pointer(event, rootG.node());
        const inverted = projection.invert?.([mx, my]);
        if (!inverted) return;
        const [lon, lat] = inverted;
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        const newWpt = createCustomGpsWaypoint(lat, lon, waypoints.length);
        setWaypoints((prev) => [...prev, newWpt]);
        setSelectedWaypointId(newWpt.id);
        void refreshAllWaypointsLiveWeather([...waypoints, newWpt], true);
      });

    // 5. Render Background Catalogue Aerodromes
    if (showAllAerodromes) {
      const routeCodes = new Set(waypoints.map((w) => w.code));
      const backgroundStations = Object.values(AERODROME_CATALOGUE).filter(
        (a) => !routeCodes.has(a.icao),
      );

      const bgGroup = rootG
        .selectAll(".bg-aerodrome")
        .data(backgroundStations)
        .enter()
        .append("g")
        .attr("class", "bg-aerodrome")
        .attr("transform", (d) => {
          const pt = projection([d.lon, d.lat]) ?? [0, 0];
          return `translate(${pt[0]}, ${pt[1]})`;
        })
        .style("cursor", "pointer")
        .on("click", (event: MouseEvent, d) => {
          event.stopPropagation();
          const newWpt = createWaypointFromAerodrome(d, waypoints.length);
          setWaypoints((prev) => [...prev, newWpt]);
          setSelectedWaypointId(newWpt.id);
          toast.info(`Added ${d.icao} (${d.city}) to flight plan route.`);
          void refreshAllWaypointsLiveWeather([...waypoints, newWpt], true);
        });

      bgGroup
        .append("circle")
        .attr("r", 4.5 / Math.sqrt(zoomTransform.k))
        .attr("fill", "rgba(148, 163, 184, 0.35)")
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 1 / Math.sqrt(zoomTransform.k));

      bgGroup
        .append("text")
        .attr("x", 7 / Math.sqrt(zoomTransform.k))
        .attr("y", 3 / Math.sqrt(zoomTransform.k))
        .attr("fill", "rgba(148, 163, 184, 0.85)")
        .attr("font-family", "monospace")
        .attr("font-size", `${10 / Math.sqrt(zoomTransform.k)}px`)
        .text((d) => `${d.icao} (${d.city})`);
    }

    // 6. Render Weather Overlays on Route Waypoints (100km Radar Rings + Flight Category Halos)
    if (showRadarRings || showWeatherHalos) {
      const wxOverlayG = rootG
        .selectAll(".wpt-wx-overlay")
        .data(waypoints)
        .enter()
        .append("g")
        .attr("class", "wpt-wx-overlay")
        .attr("transform", (d) => {
          const pt = projection([d.lon, d.lat]) ?? [0, 0];
          return `translate(${pt[0]}, ${pt[1]})`;
        })
        .style("pointer-events", "none");

      if (showRadarRings) {
        // Outer 100km meteorological radar sector ring
        wxOverlayG
          .append("circle")
          .attr("r", (d) => (28 + d.weather.cloudCoverPct * 0.22) / Math.sqrt(zoomTransform.k))
          .attr("fill", (d) => CATEGORY_COLORS[d.weather.flightCategory].fill)
          .attr("stroke", (d) => CATEGORY_COLORS[d.weather.flightCategory].stroke)
          .attr("stroke-width", 1 / Math.sqrt(zoomTransform.k))
          .attr("stroke-dasharray", "4,3");
      }

      if (showWeatherHalos) {
        // Inner Flight Rules Category Glow Halo
        wxOverlayG
          .append("circle")
          .attr("r", 16 / Math.sqrt(zoomTransform.k))
          .attr("fill", (d) => CATEGORY_COLORS[d.weather.flightCategory].fill)
          .attr("stroke", (d) => CATEGORY_COLORS[d.weather.flightCategory].stroke)
          .attr("stroke-width", 1.5 / Math.sqrt(zoomTransform.k));
      }
    }

    // 7. Render Planned Route Path & Leg Telemetry Labels using D3 Line Generator
    if (waypoints.length >= 2) {
      const projectedPoints: [number, number][] = waypoints.map(
        (w) => (projection([w.lon, w.lat]) as [number, number]) ?? [0, 0],
      );

      const lineGenerator = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinear);

      // Glowing outer route airway corridor
      rootG
        .append("path")
        .datum(projectedPoints)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "rgba(14, 165, 233, 0.35)")
        .attr("stroke-width", 8 / Math.sqrt(zoomTransform.k))
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("filter", "url(#d3-route-glow)");

      // Crisp inner magenta/cyan aeronautical flight plan line
      const mainRoutePath = rootG
        .append("path")
        .datum(projectedPoints)
        .attr("class", "d3-active-flight-path")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#38bdf8")
        .attr("stroke-width", 2.8 / Math.sqrt(zoomTransform.k))
        .attr("stroke-dasharray", `${8 / Math.sqrt(zoomTransform.k)},${4 / Math.sqrt(zoomTransform.k)}`);

      // Render mid-leg distance & magnetic track callout pills
      legs.forEach((leg) => {
        const p1 = projection([leg.from.lon, leg.from.lat]) ?? [0, 0];
        const p2 = projection([leg.to.lon, leg.to.lat]) ?? [0, 0];
        const midX = (p1[0] + p2[0]) / 2;
        const midY = (p1[1] + p2[1]) / 2;

        const legBadge = rootG
          .append("g")
          .attr("transform", `translate(${midX}, ${midY})`)
          .style("pointer-events", "none");

        const scaleInv = 1 / Math.sqrt(zoomTransform.k);
        legBadge
          .append("rect")
          .attr("x", -46 * scaleInv)
          .attr("y", -10 * scaleInv)
          .attr("width", 92 * scaleInv)
          .attr("height", 20 * scaleInv)
          .attr("rx", 6 * scaleInv)
          .attr("fill", "rgba(15, 23, 42, 0.88)")
          .attr("stroke", "rgba(56, 189, 248, 0.55)")
          .attr("stroke-width", 1 * scaleInv);

        legBadge
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", 3.5 * scaleInv)
          .attr("fill", "#e0f2fe")
          .attr("font-family", "monospace")
          .attr("font-weight", "bold")
          .attr("font-size", `${9.5 * scaleInv}px`)
          .text(`${leg.distanceNm}NM · ${String(leg.bearingMagDeg).padStart(3, "0")}°M`);
      });

      // Render simulated aircraft position along the D3 SVG path
      const pathNode = mainRoutePath.node();
      if (pathNode && typeof pathNode.getTotalLength === "function") {
        try {
          const totalLen = pathNode.getTotalLength();
          if (totalLen > 0) {
            const pt = pathNode.getPointAtLength(totalLen * simProgress);
            const nextPt = pathNode.getPointAtLength(
              Math.min(totalLen, totalLen * simProgress + 2),
            );
            const angleDeg =
              (Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * 180) / Math.PI + 90;

            const scaleInv = 1 / Math.sqrt(zoomTransform.k);
            const planeG = rootG
              .append("g")
              .attr("transform", `translate(${pt.x}, ${pt.y}) rotate(${angleDeg}) scale(${scaleInv})`)
              .style("pointer-events", "none");

            planeG
              .append("circle")
              .attr("r", 12)
              .attr("fill", "rgba(250, 204, 21, 0.22)");

            planeG
              .append("path")
              .attr("d", "M0,-9 L3,-2 L10,1 L10,3 L3,2 L2,7 L5,9 L5,10 L0,9 L-5,10 L-5,9 L-2,7 L-3,2 L-10,3 L-10,1 L-3,-2 Z")
              .attr("fill", "#facc15")
              .attr("stroke", "#0f172a")
              .attr("stroke-width", 1);
          }
        } catch {
          // JSDOM fallback when getTotalLength is not implemented
        }
      }
    }

    // 8. Render Wind Vector Arrows at Each Waypoint
    if (showWindVectors) {
      const scaleInv = 1 / Math.sqrt(zoomTransform.k);
      waypoints.forEach((w) => {
        const pt = projection([w.lon, w.lat]) ?? [0, 0];
        const lengthPx = Math.min(46, Math.max(22, w.weather.windSpeedKt * 1.8)) * scaleInv;
        const rad = ((w.weather.windDir - 90) * Math.PI) / 180;
        const x2 = pt[0] + Math.cos(rad) * lengthPx;
        const y2 = pt[1] + Math.sin(rad) * lengthPx;

        rootG
          .append("line")
          .attr("x1", pt[0])
          .attr("y1", pt[1])
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "#38bdf8")
          .attr("stroke-width", 2 * scaleInv)
          .attr("marker-end", "url(#wind-arrow-head)")
          .style("pointer-events", "none");
      });
    }

    // 9. Render Interactive Waypoint Nodes + Weather Callout Badges + D3 Drag Behavior
    const scaleInv = 1 / Math.sqrt(zoomTransform.k);

    const dragBehavior = d3
      .drag<SVGGElement, RouteWaypoint>()
      .on("drag", function (event: d3.D3DragEvent<SVGGElement, RouteWaypoint, RouteWaypoint>, d) {
        const [mx, my] = d3.pointer(event, rootG.node());
        const inverted = projection.invert?.([mx, my]);
        if (!inverted) return;
        const [newLon, newLat] = inverted;
        if (!Number.isFinite(newLat) || !Number.isFinite(newLon)) return;

        d3.select(this).attr("transform", `translate(${mx}, ${my})`);
        setWaypoints((prev) =>
          prev.map((w) =>
            w.id === d.id
              ? {
                  ...w,
                  lat: Math.round(newLat * 10000) / 10000,
                  lon: Math.round(newLon * 10000) / 10000,
                  city: `${newLat.toFixed(2)}°, ${newLon.toFixed(2)}°`,
                  weather: synthesizeWaypointWeather(w.code, w.name, newLat, newLon),
                }
              : w,
          ),
        );
      })
      .on("end", (_event, d) => {
        setSelectedWaypointId(d.id);
      });

    const wptGroup = rootG
      .selectAll<SVGGElement, RouteWaypoint>(".route-waypoint-node")
      .data(waypoints, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", "route-waypoint-node")
      .attr("transform", (d) => {
        const pt = projection([d.lon, d.lat]) ?? [0, 0];
        return `translate(${pt[0]}, ${pt[1]})`;
      })
      .style("cursor", "pointer")
      .on("click", (event: MouseEvent, d) => {
        event.stopPropagation();
        setSelectedWaypointId(d.id);
      })
      .call(dragBehavior);

    // Outer selection ring if active
    wptGroup
      .filter((d) => d.id === selectedWaypoint?.id)
      .append("circle")
      .attr("r", 11 * scaleInv)
      .attr("fill", "none")
      .attr("stroke", "#facc15")
      .attr("stroke-width", 2.2 * scaleInv);

    // Waypoint core circle colored by Flight Rules Category (VFR/MVFR/IFR/LIFR)
    wptGroup
      .append("circle")
      .attr("r", 6.5 * scaleInv)
      .attr("fill", (d) => CATEGORY_COLORS[d.weather.flightCategory].stroke)
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2 * scaleInv);

    // Sequence index number inside waypoint
    wptGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 3 * scaleInv)
      .attr("fill", "#0f172a")
      .attr("font-family", "monospace")
      .attr("font-weight", "900")
      .attr("font-size", `${8.5 * scaleInv}px`)
      .text((_d, idx) => String(idx + 1));

    // Floating Weather Overlay Callout Tag above each Waypoint
    const callout = wptGroup
      .append("g")
      .attr("transform", `translate(0, ${-24 * scaleInv})`);

    callout
      .append("rect")
      .attr("x", -58 * scaleInv)
      .attr("y", -14 * scaleInv)
      .attr("width", 116 * scaleInv)
      .attr("height", 24 * scaleInv)
      .attr("rx", 6 * scaleInv)
      .attr("fill", "rgba(2, 6, 23, 0.92)")
      .attr("stroke", (d) => CATEGORY_COLORS[d.weather.flightCategory].stroke)
      .attr("stroke-width", 1.2 * scaleInv);

    callout
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -3 * scaleInv)
      .attr("fill", "#f8fafc")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .attr("font-size", `${9 * scaleInv}px`)
      .text((d) => `${d.code} · ${d.weather.flightCategory} · ${d.weather.tempC}°C`);

    callout
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 6.5 * scaleInv)
      .attr("fill", "#94a3b8")
      .attr("font-family", "monospace")
      .attr("font-size", `${7.8 * scaleInv}px`)
      .text(
        (d) =>
          `${String(d.weather.windDir).padStart(3, "0")}°/${d.weather.windSpeedKt}kt · Q${d.weather.qnhHpa}`,
      );
  }, [
    waypoints,
    legs,
    projection,
    zoomTransform,
    drawMode,
    showWeatherHalos,
    showWindVectors,
    showRadarRings,
    showAllAerodromes,
    selectedWaypoint?.id,
    simProgress,
    refreshAllWaypointsLiveWeather,
  ]);

  // Render D3 Vertical Altitude, Cloud Base & Terrain Cross-Section Profile
  useEffect(() => {
    const svgEl = profileSvgRef.current;
    if (!svgEl || waypoints.length === 0) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const W = 880;
    const H = 145;
    const margin = { top: 18, right: 28, bottom: 26, left: 48 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    // Build cumulative distance array
    let cumNm = 0;
    const points = waypoints.map((w, idx) => {
      if (idx > 0) {
        cumNm += legs[idx - 1]?.distanceNm ?? 0;
      }
      const cloudCeilingMsl = w.elevationFt + w.weather.cloudBaseFtAgl;
      return {
        wpt: w,
        cumNm: Math.round(cumNm * 10) / 10,
        terrainFt: w.elevationFt,
        plannedAltFt: w.plannedAltFt,
        cloudMslFt: Math.min(12000, cloudCeilingMsl),
      };
    });

    const maxNm = Math.max(10, points[points.length - 1]?.cumNm ?? 100);
    const maxAlt = Math.max(
      6000,
      d3.max(points, (p) => Math.max(p.plannedAltFt, p.cloudMslFt, p.terrainFt)) ?? 6000,
    );

    const xScale = d3.scaleLinear().domain([0, maxNm]).range([0, innerW]);
    const yScale = d3.scaleLinear().domain([0, maxAlt + 1000]).range([innerH, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Horizontal altitude gridlines
    const yTicks = [0, 2000, 4000, 6000, 8000].filter((t) => t <= maxAlt + 500);
    g.selectAll(".alt-grid")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "rgba(148, 163, 184, 0.16)")
      .attr("stroke-dasharray", "3,3");

    g.selectAll(".alt-label")
      .data(yTicks)
      .enter()
      .append("text")
      .attr("x", -6)
      .attr("y", (d) => yScale(d) + 3)
      .attr("text-anchor", "end")
      .attr("fill", "#94a3b8")
      .attr("font-family", "monospace")
      .attr("font-size", "9px")
      .text((d) => `${d}ft`);

    // Terrain area generator
    const terrainArea = d3
      .area<(typeof points)[number]>()
      .x((d) => xScale(d.cumNm))
      .y0(innerH)
      .y1((d) => yScale(d.terrainFt))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(points)
      .attr("d", terrainArea)
      .attr("fill", "rgba(16, 185, 129, 0.18)")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 1.5);

    // Cloud Base / Ceiling line
    const cloudLine = d3
      .line<(typeof points)[number]>()
      .x((d) => xScale(d.cumNm))
      .y((d) => yScale(d.cloudMslFt))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(points)
      .attr("d", cloudLine)
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");

    // Planned Flight Cruise Altitude Path
    const flightAltLine = d3
      .line<(typeof points)[number]>()
      .x((d) => xScale(d.cumNm))
      .y((d) => yScale(d.plannedAltFt))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(points)
      .attr("d", flightAltLine)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 2.5);

    // Waypoint vertical markers
    const nodes = g
      .selectAll(".prof-node")
      .data(points)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${xScale(d.cumNm)}, 0)`);

    nodes
      .append("line")
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("stroke", "rgba(56, 189, 248, 0.25)")
      .attr("stroke-dasharray", "2,2");

    nodes
      .append("circle")
      .attr("cy", (d) => yScale(d.plannedAltFt))
      .attr("r", 4.5)
      .attr("fill", (d) => CATEGORY_COLORS[d.wpt.weather.flightCategory].stroke)
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5);

    nodes
      .append("text")
      .attr("y", innerH + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .attr("font-size", "9.5px")
      .text((d) => `${d.wpt.code} (${d.cumNm}NM)`);
  }, [waypoints, legs]);

  // Zoom controls
  function handleZoom(factor: number) {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  }

  function handleResetZoom() {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  }

  function handleLoadPreset(presetId: string) {
    const preset = PRESET_CORRIDORS.find((p) => p.id === presetId);
    if (!preset) return;
    setTheater(preset.theater);
    handleResetZoom();
    const nextWpts = preset.codes
      .map((code, idx) => {
        const aero = AERODROME_CATALOGUE[code];
        return aero ? createWaypointFromAerodrome(aero, idx) : null;
      })
      .filter((x): x is RouteWaypoint => x !== null);
    setWaypoints(nextWpts);
    setSelectedWaypointId(nextWpts[0]?.id ?? null);
    void refreshAllWaypointsLiveWeather(nextWpts, false);
  }

  function handleAddAerodromeWaypoint() {
    const aero = AERODROME_CATALOGUE[stationToAdd];
    if (!aero) return;
    const newWpt = createWaypointFromAerodrome(aero, waypoints.length);
    const next = [...waypoints, newWpt];
    setWaypoints(next);
    setSelectedWaypointId(newWpt.id);
    void refreshAllWaypointsLiveWeather(next, true);
    toast.success(`Added waypoint ${aero.icao} (${aero.city}) to route.`);
  }

  function handleAddCoordinateWaypoint() {
    const parsed = parseCommaCoordinates(customCoordInput);
    if (!parsed) {
      toast.error("Enter comma-separated coordinates like: 23.18, 80.05");
      return;
    }
    const newWpt = createCustomGpsWaypoint(parsed.lat, parsed.lon, waypoints.length);
    const next = [...waypoints, newWpt];
    setWaypoints(next);
    setSelectedWaypointId(newWpt.id);
    setCustomCoordInput("");
    void refreshAllWaypointsLiveWeather(next, true);
    toast.success(`Plotted GPS Waypoint at ${parsed.lat.toFixed(3)}°, ${parsed.lon.toFixed(3)}°`);
  }

  function handleRemoveWaypoint(id: string) {
    setWaypoints((prev) => {
      const next = prev.filter((w) => w.id !== id);
      if (selectedWaypointId === id) {
        setSelectedWaypointId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  async function handleSaveRouteToBooking() {
    if (waypoints.length < 2) {
      toast.error("Plot at least 2 waypoints on the map to form a flight route.");
      return;
    }

    const wxSummary = waypoints
      .map(
        (w) =>
          `${w.code} (${w.weather.flightCategory} ${String(w.weather.windDir).padStart(3, "0")}°/${w.weather.windSpeedKt}kt Q${w.weather.qnhHpa})`,
      )
      .join(" → ");
    const summaryNotes = `Planned Route: ${routeTotals.routeString} (${routeTotals.totalNm} NM · ETE ${routeTotals.totalMinutes} min · Est. Fuel ${routeTotals.fuelGallons} gal) | Waypoint WX: ${wxSummary}`;

    if (onApplyRouteToBooking) {
      onApplyRouteToBooking(routeTotals.routeString, summaryNotes);
      toast.success(`Applied route ${routeTotals.routeString} to booking form.`);
      return;
    }

    if (onApplyRouteToFlightLog) {
      const first = waypoints[0]!;
      const last = waypoints[waypoints.length - 1]!;
      onApplyRouteToFlightLog(first.code, last.code, summaryNotes);
      toast.success(`Applied route ${first.code} → ${last.code} to flight log.`);
      return;
    }

    // Otherwise update selected booking in database store
    const bookingToUpdate =
      data.bookings.find((b) => b.id === targetBookingId) ??
      data.bookings.find((b) => b.status === "scheduled");

    if (bookingToUpdate) {
      await saveBooking({
        ...bookingToUpdate,
        route: routeTotals.routeString,
        notes: summaryNotes,
      });
      if (me) {
        log(
          "booking_updated",
          "booking",
          `Synced D3 flight path (${routeTotals.routeString} · ${routeTotals.totalNm} NM) & waypoint weather overlays to booking ${bookingToUpdate.id}`,
          bookingToUpdate.id,
        );
      }
      toast.success(
        `Synced route "${routeTotals.routeString}" & waypoint weather to booking ${bookingToUpdate.id}!`,
      );
    } else {
      toast.info(`Route planned: ${routeTotals.routeString} (${routeTotals.totalNm} NM)`);
    }
  }

  const selectedFlyability = useMemo(() => {
    if (!selectedWaypoint) return null;
    const w = selectedWaypoint.weather;
    const attachment = {
      icao: selectedWaypoint.code,
      stationName: selectedWaypoint.name,
      observedAt: new Date().toISOString(),
      flightCategory: w.flightCategory,
      windDir: w.windDir,
      windSpeedKt: w.windSpeedKt,
      windGustKt: w.windGustKt,
      visibilityMeters: w.visibilityMeters,
      tempC: w.tempC,
      dewpointC: w.dewpointC,
      qnhHpa: w.qnhHpa,
      metar: w.metar,
      taf: "",
      cloudCoverPct: w.cloudCoverPct,
    };
    const aero = computeAeronauticalMetrics(attachment, {
      icao: selectedWaypoint.code,
      name: selectedWaypoint.name,
      city: selectedWaypoint.city,
      country: "India",
      lat: selectedWaypoint.lat,
      lon: selectedWaypoint.lon,
      elevationFt: selectedWaypoint.elevationFt,
      primaryRunwayHeading: 270,
      primaryRunwayDesignator: "09/27",
    });
    return evaluateFlyabilityCondition(attachment, aero);
  }, [selectedWaypoint]);

  const scheduledBookings = useMemo(
    () => data.bookings.filter((b) => b.status === "scheduled").slice(0, 12),
    [data.bookings],
  );

  return (
    <section
      data-testid="d3-flight-path-visualizer"
      className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 sm:p-6 shadow-2xl space-y-5"
    >
      {/* Top Header & Corridor Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-300 uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5 text-sky-400" /> D3.js Interactive Flight Path &amp; Weather Overlay
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                CATEGORY_COLORS[routeTotals.worstCategory].badge
              }`}
            >
              Route Status: {routeTotals.worstCategory}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Click map to plot waypoints · Drag nodes to reroute
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <RouteIcon className="h-5 w-5 text-sky-400 shrink-0" />
            <span>Interactive Flight Route Planner &amp; Waypoint Weather Radar</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Draw planned cross-country routes on the D3 geospatial chart, drag waypoints to adjust headings, and inspect real-time Open-Meteo METAR, wind vectors, and flight rules overlays at every waypoint.
          </p>
        </div>

        {/* Preset Corridor & Live Weather Fetch Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <NativeSelect
            aria-label="Select preset training corridor"
            data-testid="d3-preset-corridor-select"
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue="ind-central"
            className="h-9 rounded-xl bg-slate-900/90 border-slate-700 text-xs text-slate-100 max-w-[270px]"
          >
            {PRESET_CORRIDORS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </NativeSelect>

          <NativeSelect
            aria-label="Select map theater"
            value={theater}
            onChange={(e) => {
              setTheater(e.target.value as MapTheater);
              handleResetZoom();
            }}
            className="h-9 rounded-xl bg-slate-900/90 border-slate-700 text-xs text-slate-100"
          >
            <option value="INDIA">India FIR Map</option>
            <option value="DENMARK">Denmark FIR Map</option>
            <option value="GLOBAL">Euro-Asia Corridor</option>
          </NativeSelect>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={fetchingLiveWx}
            onClick={() => void refreshAllWaypointsLiveWeather(undefined, false)}
            className="h-9 rounded-xl border-sky-500/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 text-xs"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${fetchingLiveWx ? "animate-spin" : ""}`} />
            Sync Live Waypoint Weather
          </Button>
        </div>
      </div>

      {/* Route KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Planned Route
          </div>
          <div
            data-testid="d3-route-string"
            className="mt-1 font-mono text-xs sm:text-sm font-extrabold text-sky-300 truncate"
            title={routeTotals.routeString}
          >
            {routeTotals.routeString || "No Waypoints"}
          </div>
          <div className="text-[10px] text-slate-500">{waypoints.length} active waypoints</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Total Distance
          </div>
          <div
            data-testid="d3-total-distance"
            className="mt-1 font-mono text-sm sm:text-base font-extrabold text-white"
          >
            {routeTotals.totalNm} NM
          </div>
          <div className="text-[10px] text-slate-500">{routeTotals.totalKm} km great-circle</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Est. Time Enroute
          </div>
          <div className="mt-1 font-mono text-sm sm:text-base font-extrabold text-white">
            {Math.floor(routeTotals.totalMinutes / 60)}h {routeTotals.totalMinutes % 60}m
          </div>
          <div className="text-[10px] text-slate-500">@ {cruiseTasKt} kt TAS (wind-adjusted)</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Est. Fuel Burn
          </div>
          <div className="mt-1 font-mono text-sm sm:text-base font-extrabold text-emerald-400">
            {routeTotals.fuelGallons} US Gal
          </div>
          <div className="text-[10px] text-slate-500">C172S · 8.6 GPH + VFR reserve</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Enroute Weather
          </div>
          <div className="mt-1 font-mono text-sm font-extrabold text-amber-300">
            {routeTotals.worstCategory} Minima
          </div>
          <div className="text-[10px] text-slate-500">Across {waypoints.length} stations</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Cruise TAS (kt)
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="range"
              min={85}
              max={160}
              step={5}
              value={cruiseTasKt}
              onChange={(e) => setCruiseTasKt(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-sky-300">{cruiseTasKt}kt</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workspace: Left D3 Map Canvas (7 cols) + Right Waypoint Weather & Leg Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 7 Cols: Interactive D3.js Map & Vertical Profile */}
        <div className="lg:col-span-7 space-y-3">
          {/* Map Toolbar: Draw Mode, Weather Layer Toggles, Zoom & Simulation */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                data-testid="d3-toggle-draw-mode"
                onClick={() => setDrawMode((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                  drawMode
                    ? "bg-sky-500 text-slate-950 shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Crosshair className="h-3.5 w-3.5" />
                {drawMode ? "Draw Mode: ON (Click Map)" : "Pan Mode"}
              </button>

              <button
                type="button"
                onClick={() => setShowWeatherHalos((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  showWeatherHalos
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Layers className="h-3 w-3" /> WX Halos
              </button>

              <button
                type="button"
                onClick={() => setShowWindVectors((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  showWindVectors
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Wind className="h-3 w-3" /> Wind Vectors
              </button>

              <button
                type="button"
                onClick={() => setShowRadarRings((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  showRadarRings
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <CloudRain className="h-3 w-3" /> 100km Radar
              </button>

              <button
                type="button"
                onClick={() => setShowAllAerodromes((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  showAllAerodromes
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <MapPin className="h-3 w-3" /> Airports
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSimulating((s) => !s)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold transition cursor-pointer ${
                  isSimulating
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {isSimulating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isSimulating ? "Pause Sim" : "Fly Route"}
              </button>
              <button
                type="button"
                aria-label="Zoom in map"
                onClick={() => handleZoom(1.35)}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Zoom out map"
                onClick={() => handleZoom(0.75)}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={handleResetZoom}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* D3 SVG Geospatial Chart Container */}
          <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-[#050d1a] shadow-inner">
            <svg
              ref={svgRef}
              data-testid="d3-flight-map-svg"
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="w-full h-[340px] sm:h-[430px] select-none block"
            />

            {/* Map Legend Overlay */}
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/90 bg-slate-950/85 px-3 py-1.5 backdrop-blur-md text-[10px] font-mono">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> VFR (Good)
                </span>
                <span className="inline-flex items-center gap-1 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-400" /> MVFR (Marginal)
                </span>
                <span className="inline-flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> IFR (Instrument)
                </span>
                <span className="inline-flex items-center gap-1 text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-400" /> LIFR (Low IFR)
                </span>
              </div>
              <span className="text-slate-400">
                {THEATER_CONFIG[theater].label}
              </span>
            </div>
          </div>

          {/* D3 Vertical Altitude, Cloud Base & Terrain Cross-Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold uppercase tracking-wider text-sky-300">
                D3 Vertical Flight Profile (Cruise Altitude vs. Cloud Ceiling &amp; Terrain Elevation)
              </span>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="h-0.5 w-3 bg-sky-400 inline-block" /> Cruise Alt
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-0.5 w-3 bg-slate-400 inline-block" /> Cloud Base
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 bg-emerald-500/40 border border-emerald-400 inline-block" /> Terrain MSL
                </span>
              </div>
            </div>
            <svg
              ref={profileSvgRef}
              data-testid="d3-vertical-profile-svg"
              viewBox="0 0 880 145"
              className="w-full h-[115px] sm:h-[135px] block"
            />
          </div>
        </div>

        {/* Right 5 Cols: Add Waypoints + Selected Waypoint Weather Overlay Card + Route Legs Table */}
        <div className="lg:col-span-5 space-y-4">
          {/* Add Waypoint by ICAO or Coordinate Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Add Waypoint to Flight Plan
              </span>
              <button
                type="button"
                onClick={() => {
                  setWaypoints([]);
                  setSelectedWaypointId(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:underline cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Clear Route
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <NativeSelect
                  aria-label="Add aerodrome waypoint"
                  value={stationToAdd}
                  onChange={(e) => setStationToAdd(e.target.value)}
                  className="h-8 flex-1 rounded-xl bg-slate-950 border-slate-700 text-xs text-slate-100"
                >
                  {Object.values(AERODROME_CATALOGUE).map((a) => (
                    <option key={a.icao} value={a.icao}>
                      {a.icao} — {a.city}
                    </option>
                  ))}
                </NativeSelect>
                <Button
                  type="button"
                  size="sm"
                  data-testid="d3-add-aerodrome-btn"
                  onClick={handleAddAerodromeWaypoint}
                  className="h-8 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              <div className="flex items-center gap-1.5">
                <Input
                  value={customCoordInput}
                  onChange={(e) => setCustomCoordInput(e.target.value)}
                  placeholder="Lat, Lon (e.g. 23.18, 80.05)"
                  data-testid="d3-custom-coord-input"
                  className="h-8 rounded-xl bg-slate-950 border-slate-700 text-xs font-mono text-slate-100"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-testid="d3-add-coord-btn"
                  onClick={handleAddCoordinateWaypoint}
                  className="h-8 rounded-xl border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 text-xs shrink-0"
                >
                  Plot GPS
                </Button>
              </div>
            </div>
          </div>

          {/* Selected Waypoint Weather Overlay Inspector */}
          {selectedWaypoint ? (
            <div
              data-testid="d3-selected-waypoint-weather"
              className="rounded-2xl border border-sky-500/35 bg-slate-900/90 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-sky-300">
                      {selectedWaypoint.code}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${
                        CATEGORY_COLORS[selectedWaypoint.weather.flightCategory].badge
                      }`}
                    >
                      {selectedWaypoint.weather.flightCategory}
                    </span>
                    {selectedFlyability && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                          selectedFlyability.tone === "good"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : selectedFlyability.tone === "caution"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {selectedFlyability.tone === "good" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <ShieldAlert className="h-3 w-3" />
                        )}
                        {selectedFlyability.verdict}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    {selectedWaypoint.name} ({selectedWaypoint.city})
                  </p>
                  <p className="font-mono text-[10px] text-slate-400">
                    Coords: {selectedWaypoint.lat.toFixed(4)}°N, {selectedWaypoint.lon.toFixed(4)}°E · Elev{" "}
                    {selectedWaypoint.elevationFt} ft MSL
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveWaypoint(selectedWaypoint.id)}
                  className="h-7 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* 4-cell Weather Telemetry Grid for Selected Waypoint */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Wind className="h-3 w-3 text-sky-400" /> Surface Wind
                  </div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {String(selectedWaypoint.weather.windDir).padStart(3, "0")}° /{" "}
                    {selectedWaypoint.weather.windSpeedKt} kt
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Eye className="h-3 w-3 text-emerald-400" /> Visibility
                  </div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {(selectedWaypoint.weather.visibilityMeters / 1000).toFixed(1)} km
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-400" /> Temp / Dew
                  </div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {selectedWaypoint.weather.tempC}°C / {selectedWaypoint.weather.dewpointC}°C
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-indigo-400" /> QNH &amp; Base
                  </div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {selectedWaypoint.weather.qnhHpa} hPa · {selectedWaypoint.weather.cloudBaseFtAgl}ft
                  </div>
                </div>
              </div>

              {/* Waypoint Planned Altitude Adjuster & METAR Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-300 font-medium">
                  Planned Crossing Altitude (ft MSL):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={500}
                    min={1000}
                    max={14500}
                    value={selectedWaypoint.plannedAltFt}
                    onChange={(e) => {
                      const val = Math.max(1000, Number(e.target.value) || 3500);
                      setWaypoints((prev) =>
                        prev.map((w) =>
                          w.id === selectedWaypoint.id ? { ...w, plannedAltFt: val } : w,
                        ),
                      );
                    }}
                    className="h-7 w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 font-mono text-xs text-sky-300"
                  />
                  <span className="font-mono text-[10px] text-slate-400">ft MSL</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2.5 font-mono text-[11px] text-sky-200 break-all">
                {selectedWaypoint.weather.metar}
              </div>
            </div>
          ) : null}

          {/* Waypoint Sequence & Leg Breakdown List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Flight Plan Waypoints &amp; Leg Winds ({waypoints.length})
              </span>
              <span className="text-[10px] text-slate-400">Click row to inspect weather</span>
            </div>

            <div className="max-h-[210px] overflow-y-auto space-y-1.5 pr-1">
              {waypoints.map((w, idx) => {
                const legAfter = legs[idx];
                const isSelected = w.id === selectedWaypoint?.id;
                return (
                  <div key={w.id} className="space-y-1">
                    <div
                      onClick={() => setSelectedWaypointId(w.id)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs transition cursor-pointer ${
                        isSelected
                          ? "border-sky-400 bg-sky-500/15"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 border border-sky-400/40 font-mono text-[10px] font-bold text-sky-300">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-mono font-bold text-white">{w.code}</span>{" "}
                          <span className="text-slate-400 text-[11px]">· {w.city}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`rounded border px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                            CATEGORY_COLORS[w.weather.flightCategory].badge
                          }`}
                        >
                          {w.weather.flightCategory}
                        </span>
                        <span className="font-mono text-[11px] text-slate-300">
                          {String(w.weather.windDir).padStart(3, "0")}°/{w.weather.windSpeedKt}kt
                        </span>
                      </div>
                    </div>

                    {legAfter && (
                      <div className="ml-5 flex flex-wrap items-center justify-between gap-2 border-l-2 border-sky-500/30 pl-3 py-0.5 font-mono text-[10px] text-slate-400">
                        <span>
                          <Navigation className="inline h-2.5 w-2.5 text-sky-400 mr-1" />
                          Leg {idx + 1}: {legAfter.distanceNm} NM · Track{" "}
                          {String(legAfter.bearingMagDeg).padStart(3, "0")}°M
                        </span>
                        <span>
                          GS {legAfter.groundSpeedKt}kt (
                          {legAfter.headwindKt >= 0
                            ? `${legAfter.headwindKt}kt HW`
                            : `${Math.abs(legAfter.headwindKt)}kt TW`}{" "}
                          · {legAfter.crosswindKt}kt XW) · {legAfter.eteMinutes} min
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bind Planned Route & Weather Overlay to Booking / Database */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
              {!onApplyRouteToBooking && !onApplyRouteToFlightLog && scheduledBookings.length > 0 && (
                <NativeSelect
                  aria-label="Select booking to attach route"
                  value={targetBookingId}
                  onChange={(e) => setTargetBookingId(e.target.value)}
                  className="h-8 flex-1 rounded-xl bg-slate-950 border-slate-700 text-xs text-slate-200"
                >
                  {scheduledBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} · {b.start.slice(0, 10)} · {b.route ?? "Local"}
                    </option>
                  ))}
                </NativeSelect>
              )}

              <Button
                type="button"
                size="sm"
                data-testid="d3-save-route-btn"
                onClick={() => void handleSaveRouteToBooking()}
                className="h-8 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-xs"
              >
                <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
                {onApplyRouteToBooking
                  ? "Apply Route to Booking"
                  : onApplyRouteToFlightLog
                    ? "Apply Route to Flight Log"
                    : "Sync Route & Weather to Booking"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
