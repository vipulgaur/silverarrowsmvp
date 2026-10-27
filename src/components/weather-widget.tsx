import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Cloud,
  CloudSun,
  Compass,
  Copy,
  Database,
  Eye,
  Gauge,
  LocateFixed,
  MapPin,
  Navigation,
  Paperclip,
  PlaneTakeoff,
  Radar,
  RefreshCw,
  Search,
  Sparkles,
  Thermometer,
  Wind,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Chip, NativeSelect } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Booking, Flight, FlightRulesCategory, FlightWeatherAttachment } from "@/lib/types";
import {
  AERODROME_CATALOGUE,
  BUILTIN_CITY_SUGGESTIONS,
  buildInitialWeatherBoard,
  computeAeronauticalMetrics,
  computeLocalHourAtLon,
  describeWeatherCondition,
  detectBrowserCoordinates,
  enrichBookingWithWeather,
  evaluateFlyabilityCondition,
  fetchCitySuggestions,
  fetchComprehensiveWeatherBoard,
  formatIndianDateShort,
  formatRemarksWithWeather,
  parseCommaCoordinates,
  type AerodromeInfo,
  type CitySuggestion,
  type ComprehensiveWeatherBoardData,
  type DailyWeatherPoint,
} from "@/lib/weather";

const QUICK_STATIONS: Array<{ code: string; city: string; airport: string }> = [
  { code: "VIDP", city: "New Delhi", airport: "Indira Gandhi Intl" },
  { code: "VABB", city: "Mumbai", airport: "Chhatrapati Shivaji Intl" },
  { code: "VOBL", city: "Bengaluru", airport: "Kempegowda Intl" },
  { code: "VOMM", city: "Chennai", airport: "Chennai Intl" },
  { code: "VECC", city: "Kolkata", airport: "Netaji Subhas Chandra Bose Intl" },
  { code: "VOHS", city: "Hyderabad", airport: "Rajiv Gandhi Intl" },
  { code: "VAJB", city: "Jabalpur, MP", airport: "Dumna Airport" },
  { code: "EKAH", city: "Aarhus, DK", airport: "Aarhus Airport" },
];

export type AutoSkyScene =
  | "sunlight"
  | "golden_hour"
  | "cloudy_rain"
  | "thunderstorm"
  | "fog"
  | "night";

function categoryBadgeStyle(cat: FlightRulesCategory) {
  switch (cat) {
    case "VFR":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
    case "MVFR":
      return "bg-sky-500/20 text-sky-200 border-sky-400/40";
    case "IFR":
      return "bg-amber-500/25 text-amber-200 border-amber-400/40";
    case "LIFR":
      return "bg-rose-500/25 text-rose-200 border-rose-400/40";
  }
}

function categoryDescription(cat: FlightRulesCategory) {
  switch (cat) {
    case "VFR":
      return "Visual Flight Rules";
    case "MVFR":
      return "Marginal VFR";
    case "IFR":
      return "Instrument Flight Rules";
    case "LIFR":
      return "Low Instrument Flight Rules";
  }
}

function resolveAutoSkyByTimeAndWeather(
  report?: FlightWeatherAttachment,
  localHour24 = 12,
): { scene: AutoSkyScene; label: string } {
  const isNightHour = localHour24 < 6 || localHour24 >= 19 || report?.isDay === false;
  const isGoldenHour = !isNightHour && (localHour24 <= 7 || localHour24 >= 17);

  if (!report) {
    if (isNightHour) return { scene: "night", label: "Night Sky (Auto Time)" };
    if (isGoldenHour) return { scene: "golden_hour", label: "Golden Hour Twilight (Auto Time)" };
    return { scene: "sunlight", label: "Daylight Sun (Auto Time)" };
  }

  const wmo = report.wmoCode ?? 0;
  const cloud = report.cloudCoverPct ?? 20;

  if (wmo >= 95) {
    return { scene: "thunderstorm", label: "Thunderstorm & CB (Auto Live)" };
  }
  if (wmo === 45 || wmo === 48 || report.wxPhenomena === "FG") {
    return { scene: "fog", label: "Low-Visibility Fog (Auto Live)" };
  }
  if (
    wmo >= 51 ||
    report.wxPhenomena?.includes("RA") ||
    report.wxPhenomena?.includes("DZ") ||
    cloud >= 68
  ) {
    return {
      scene: "cloudy_rain",
      label: isNightHour ? "Night Rain & Overcast (Auto Time)" : "Cloudy & Rain (Auto Live)",
    };
  }
  if (isNightHour) {
    return { scene: "night", label: `Night Sky · ${String(localHour24).padStart(2, "0")}:00 Local` };
  }
  if (isGoldenHour) {
    return {
      scene: "golden_hour",
      label: `Golden Hour Sky · ${String(localHour24).padStart(2, "0")}:00 Local`,
    };
  }
  return {
    scene: "sunlight",
    label: `Daylight Sun · ${String(localHour24).padStart(2, "0")}:00 Local`,
  };
}

function WeatherSkyCanvas({
  scene,
  windSpeedKt = 12,
  cloudCoverPct = 40,
}: {
  scene: AutoSkyScene;
  windSpeedKt?: number;
  cloudCoverPct?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1100);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 1100;
      height = canvas.height = canvas.parentElement.clientHeight || 520;
    };
    window.addEventListener("resize", handleResize);

    const cloudCount =
      scene === "sunlight" || scene === "golden_hour"
        ? Math.max(5, Math.round(cloudCoverPct / 12))
        : scene === "night"
          ? 6
          : 18;
    const clouds = Array.from({ length: cloudCount }, (_, i) => ({
      x: (i / cloudCount) * (width + 300) - 150,
      y: 25 + (i % 4) * 38 + Math.sin(i * 2.1) * 15,
      z: 0.4 + (i % 5) * 0.15,
      radiusX: 95 + (i % 4) * 45,
      radiusY: 32 + (i % 3) * 14,
      speed: (0.25 + (windSpeedKt / 35) * 0.55) * (0.5 + (i % 4) * 0.2),
      puffOffsets: [
        { dx: -0.45, dy: 0.1, r: 0.7 },
        { dx: -0.15, dy: -0.25, r: 0.9 },
        { dx: 0.2, dy: -0.18, r: 0.85 },
        { dx: 0.5, dy: 0.12, r: 0.65 },
      ],
    }));

    const isRaining = scene === "cloudy_rain" || scene === "thunderstorm";
    const dropCount = scene === "thunderstorm" ? 150 : isRaining ? 105 : 0;
    const raindrops = Array.from({ length: dropCount }, (_, i) => ({
      x: (i * 37) % width,
      y: (i * 53) % height,
      z: 0.5 + (i % 5) * 0.15,
      len: 16 + (i % 4) * 7,
      speedY: 9 + (i % 5) * 2.5,
      speedX: -1.5 - (windSpeedKt / 15) * 2.2,
    }));

    const splashes: Array<{ x: number; y: number; r: number; maxR: number; alpha: number }> = [];

    const stars = Array.from({ length: scene === "night" ? 85 : 0 }, (_, i) => ({
      x: (i * 97) % width,
      y: (i * 43) % (height * 0.65),
      size: 1 + (i % 3) * 0.7,
      phase: i * 0.7,
    }));

    let tick = 0;
    let lightningFlash = 0;
    let boltPoints: Array<{ x: number; y: number }> = [];

    const render = () => {
      tick += 0.016;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (scene === "sunlight") {
        skyGrad.addColorStop(0, "#0284c7");
        skyGrad.addColorStop(0.55, "#0369a1");
        skyGrad.addColorStop(1, "#1e3a8a");
      } else if (scene === "golden_hour") {
        skyGrad.addColorStop(0, "#1e1b4b");
        skyGrad.addColorStop(0.5, "#7c2d12");
        skyGrad.addColorStop(1, "#b45309");
      } else if (scene === "cloudy_rain") {
        skyGrad.addColorStop(0, "#0f172a");
        skyGrad.addColorStop(0.55, "#1e293b");
        skyGrad.addColorStop(1, "#334155");
      } else if (scene === "thunderstorm") {
        skyGrad.addColorStop(0, "#090d16");
        skyGrad.addColorStop(0.5, "#1e1b4b");
        skyGrad.addColorStop(1, "#1e293b");
      } else if (scene === "fog") {
        skyGrad.addColorStop(0, "#334155");
        skyGrad.addColorStop(0.5, "#475569");
        skyGrad.addColorStop(1, "#64748b");
      } else {
        skyGrad.addColorStop(0, "#020617");
        skyGrad.addColorStop(0.6, "#0f172a");
        skyGrad.addColorStop(1, "#1e293b");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      if (scene === "sunlight" || scene === "golden_hour") {
        const sunX = width * 0.82;
        const sunY = scene === "golden_hour" ? 135 : 72;

        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(tick * 0.08);
        for (let r = 0; r < 12; r++) {
          ctx.rotate((Math.PI * 2) / 12);
          const rayGrad = ctx.createLinearGradient(0, 0, 0, width * 0.75);
          rayGrad.addColorStop(
            0,
            scene === "golden_hour"
              ? "rgba(253, 186, 116, 0.25)"
              : "rgba(254, 249, 195, 0.22)",
          );
          rayGrad.addColorStop(0.5, "rgba(253, 224, 71, 0.06)");
          rayGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(-14, 0);
          ctx.lineTo(14, 0);
          ctx.lineTo(75, width * 0.75);
          ctx.lineTo(-75, width * 0.75);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        const corona = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 160);
        corona.addColorStop(0, "rgba(255, 255, 240, 0.95)");
        corona.addColorStop(0.25, "rgba(253, 224, 71, 0.55)");
        corona.addColorStop(0.6, "rgba(251, 191, 36, 0.18)");
        corona.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      if (scene === "night") {
        for (const s of stars) {
          const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(tick * 1.8 + s.phase));
          ctx.fillStyle = `rgba(248, 250, 252, ${twinkle.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        const moonX = width * 0.84;
        const moonY = 68;
        const moonGlow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 95);
        moonGlow.addColorStop(0, "rgba(226, 232, 240, 0.9)");
        moonGlow.addColorStop(0.3, "rgba(148, 163, 184, 0.35)");
        moonGlow.addColorStop(1, "rgba(148, 163, 184, 0)");
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 95, 0, Math.PI * 2);
        ctx.fill();
      }

      if (scene === "thunderstorm") {
        if (lightningFlash <= 0 && Math.random() < 0.018) {
          lightningFlash = 1.0;
          const startX = width * (0.2 + Math.random() * 0.6);
          boltPoints = [{ x: startX, y: 20 }];
          let currX = startX;
          let currY = 20;
          while (currY < height * 0.85) {
            currX += (Math.random() - 0.5) * 48;
            currY += 24 + Math.random() * 28;
            boltPoints.push({ x: currX, y: currY });
          }
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(224, 242, 254, ${(lightningFlash * 0.35).toFixed(2)})`;
          ctx.fillRect(0, 0, width, height);

          if (boltPoints.length > 1) {
            ctx.save();
            ctx.strokeStyle = `rgba(240, 249, 255, ${lightningFlash.toFixed(2)})`;
            ctx.lineWidth = 2.6;
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.moveTo(boltPoints[0]!.x, boltPoints[0]!.y);
            for (let i = 1; i < boltPoints.length; i++) {
              ctx.lineTo(boltPoints[i]!.x, boltPoints[i]!.y);
            }
            ctx.stroke();
            ctx.restore();
          }
          lightningFlash -= 0.08;
        }
      }

      for (const c of clouds) {
        c.x += c.speed;
        if (c.x - c.radiusX * 1.5 > width) {
          c.x = -c.radiusX * 1.5;
        }

        for (const p of c.puffOffsets) {
          const px = c.x + p.dx * c.radiusX;
          const py = c.y + p.dy * c.radiusY;
          const pr = c.radiusY * p.r * (0.85 + c.z * 0.3);

          const cGrad = ctx.createRadialGradient(px, py - pr * 0.3, pr * 0.1, px, py, pr * 1.35);
          if (scene === "sunlight" || scene === "golden_hour") {
            cGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
            cGrad.addColorStop(0.6, "rgba(241, 245, 249, 0.25)");
            cGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          } else if (scene === "night") {
            cGrad.addColorStop(0, "rgba(51, 65, 85, 0.45)");
            cGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
          } else {
            cGrad.addColorStop(0, "rgba(148, 163, 184, 0.48)");
            cGrad.addColorStop(0.65, "rgba(71, 85, 105, 0.36)");
            cGrad.addColorStop(1, "rgba(30, 41, 59, 0)");
          }
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(px, py, pr * 1.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (scene === "fog") {
        for (let layer = 0; layer < 4; layer++) {
          const yBase = height * (0.22 + layer * 0.2);
          const waveOffset = Math.sin(tick * 0.8 + layer) * 35;
          const fogGrad = ctx.createLinearGradient(0, yBase - 45, 0, yBase + 65);
          fogGrad.addColorStop(0, "rgba(226, 232, 240, 0)");
          fogGrad.addColorStop(0.5, `rgba(226, 232, 240, ${0.22 + layer * 0.04})`);
          fogGrad.addColorStop(1, "rgba(226, 232, 240, 0)");
          ctx.fillStyle = fogGrad;
          ctx.fillRect(waveOffset - 40, yBase - 45, width + 80, 110);
        }
      }

      if (isRaining) {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.62)";
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        for (const d of raindrops) {
          d.x += d.speedX * d.z;
          d.y += d.speedY * d.z;

          if (d.y > height) {
            if (splashes.length < 30 && Math.random() < 0.35) {
              splashes.push({
                x: d.x,
                y: height - 6 - Math.random() * 18,
                r: 1,
                maxR: 8 + Math.random() * 8,
                alpha: 0.65,
              });
            }
            d.y = -20;
            d.x = Math.random() * (width + 180);
          }
          if (d.x < -50) {
            d.x = width + 50;
          }

          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.speedX * 1.4, d.y + d.len * d.z);
        }
        ctx.stroke();

        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i]!;
          sp.r += 0.45;
          sp.alpha -= 0.025;
          if (sp.alpha <= 0 || sp.r >= sp.maxR) {
            splashes.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(186, 230, 253, ${sp.alpha.toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animId);
    };
  }, [scene, windSpeedKt, cloudCoverPct]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Real-time 3D animated weather canvas (${scene})`}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}

export function WeatherWidget({
  defaultIcao = "VIDP",
  compact = false,
  selectedFlight,
  onAttachWeather,
  onStartFlightWithWeather,
}: {
  defaultIcao?: string;
  compact?: boolean;
  selectedFlight?: Flight | null;
  onAttachWeather?: (wx: FlightWeatherAttachment) => void;
  onStartFlightWithWeather?: (wx: FlightWeatherAttachment) => void;
}) {
  const { data, me, saveFlight, saveBooking, log } = useStore();
  const [icaoInput, setIcaoInput] = useState(defaultIcao);
  const [cityInput, setCityInput] = useState("");
  const [coordsInput, setCoordsInput] = useState("23.1815, 79.9864");
  const [loading, setLoading] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);

  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const [boardData, setBoardData] = useState<ComprehensiveWeatherBoardData>(() =>
    buildInitialWeatherBoard(defaultIcao),
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2);
  const [activeSubPanel, setActiveSubPanel] = useState<
    "timeline10d" | "area100km" | "aeroUnits" | "dbSync"
  >("timeline10d");
  const [copiedField, setCopiedField] = useState<"metar" | "taf" | null>(null);
  const [targetFlightId, setTargetFlightId] = useState<string>("");

  const recentFlights = useMemo(() => {
    const sorted = [...data.flights].sort((a, b) => b.date.localeCompare(a.date));
    if (me?.role === "student") {
      return sorted.filter((f) => f.pilotId === me.id).slice(0, 12);
    }
    return sorted.slice(0, 12);
  }, [data.flights, me]);

  useEffect(() => {
    if (selectedFlight?.id) {
      setTargetFlightId(selectedFlight.id);
    } else if (!targetFlightId && recentFlights[0]?.id) {
      setTargetFlightId(recentFlights[0].id);
    }
  }, [selectedFlight, recentFlights, targetFlightId]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    const q = cityInput.trim();
    if (!q) {
      setSuggestions(BUILTIN_CITY_SUGGESTIONS.slice(0, 6));
      return;
    }
    const instantLocal = BUILTIN_CITY_SUGGESTIONS.filter(
      (item) =>
        item.city.toLowerCase().includes(q.toLowerCase()) ||
        item.displayLabel.toLowerCase().includes(q.toLowerCase()) ||
        item.subLabel.toLowerCase().includes(q.toLowerCase()) ||
        (item.icao && item.icao.toLowerCase().includes(q.toLowerCase())),
    );
    setSuggestions(instantLocal.slice(0, 7));

    let cancelled = false;
    const timer = setTimeout(async () => {
      const remote = await fetchCitySuggestions(q);
      if (!cancelled) {
        setSuggestions(remote);
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cityInput]);

  const loadWeatherByStationOrCoords = useCallback(
    async (opts: {
      icaoOrCity?: string;
      lat?: number;
      lon?: number;
      customCity?: string;
      customState?: string;
      customCountry?: string;
    }) => {
      setLoading(true);
      try {
        const res = await fetchComprehensiveWeatherBoard(opts);
        setBoardData(res);
        setIcaoInput(res.station.icao);
        setCoordsInput(`${res.station.lat.toFixed(4)}, ${res.station.lon.toFixed(4)}`);
        const todayIdx = res.timeline10Days.findIndex((d) => d.isToday);
        setSelectedDayIndex(todayIdx >= 0 ? todayIdx : 2);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;
    async function initLocation() {
      if (selectedFlight?.fromIcao) {
        await loadWeatherByStationOrCoords({ icaoOrCity: selectedFlight.fromIcao });
        return;
      }
      try {
        const loc = await detectBrowserCoordinates();
        if (!active) return;
        await loadWeatherByStationOrCoords({
          lat: loc.lat,
          lon: loc.lon,
          customCity: loc.city,
          customState: loc.state,
          customCountry: loc.country,
        });
      } catch {
        if (active) {
          await loadWeatherByStationOrCoords({ icaoOrCity: defaultIcao });
        }
      }
    }
    void initLocation();
    return () => {
      active = false;
    };
  }, [defaultIcao, selectedFlight?.fromIcao, loadWeatherByStationOrCoords]);

  const handleFetchCurrentLocation = async () => {
    setLocatingGps(true);
    try {
      const loc = await detectBrowserCoordinates();
      await loadWeatherByStationOrCoords({
        lat: loc.lat,
        lon: loc.lon,
        customCity: loc.city,
        customState: loc.state,
        customCountry: loc.country,
      });
      setCityInput(
        [loc.city, loc.state, loc.country].filter(Boolean).join(", "),
      );
      toast.success(
        `Updated Weather Board for ${loc.city}${loc.state ? `, ${loc.state}` : ""} (${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)})`,
      );
    } finally {
      setLocatingGps(false);
    }
  };

  const handleSelectSuggestion = async (item: CitySuggestion) => {
    setCityInput(item.displayLabel);
    setShowSuggestions(false);
    await loadWeatherByStationOrCoords({
      lat: item.lat,
      lon: item.lon,
      customCity: item.city,
      customState: item.state,
      customCountry: item.country,
    });
    toast.success(`Loaded weather & 100 km regional ring for ${item.displayLabel}`);
  };

  const handleCitySearch = async () => {
    const q = cityInput.trim() || icaoInput.trim();
    if (!q) return;
    setShowSuggestions(false);

    const maybeCoords = parseCommaCoordinates(q);
    if (maybeCoords) {
      await loadWeatherByStationOrCoords({
        lat: maybeCoords.lat,
        lon: maybeCoords.lon,
      });
      toast.success(`Loaded weather for coordinates ${maybeCoords.lat}, ${maybeCoords.lon}`);
      return;
    }

    if (suggestions.length > 0) {
      await handleSelectSuggestion(suggestions[0]!);
      return;
    }

    await loadWeatherByStationOrCoords({ icaoOrCity: q });
    toast.success(`Loaded 10-day & 100 km area weather for "${q}"`);
  };

  const handleCoordinatesSearch = async () => {
    const parsed = parseCommaCoordinates(coordsInput);
    if (!parsed) {
      toast.error(
        'Enter comma-separated coordinates: Latitude, Longitude (e.g. "23.1815, 79.9864")',
      );
      return;
    }
    await loadWeatherByStationOrCoords({
      lat: parsed.lat,
      lon: parsed.lon,
    });
    toast.success(
      `Loaded weather & 100 km regional ring for coordinates ${parsed.lat.toFixed(4)}, ${parsed.lon.toFixed(4)}`,
    );
  };

  const station: AerodromeInfo =
    boardData?.station ?? AERODROME_CATALOGUE[icaoInput.toUpperCase()] ?? AERODROME_CATALOGUE.VIDP!;

  const activeDayPoint: DailyWeatherPoint | undefined =
    boardData?.timeline10Days[selectedDayIndex] ?? boardData?.timeline10Days[2];
  const report: FlightWeatherAttachment | null =
    activeDayPoint?.report ?? boardData?.current ?? null;

  const aero = useMemo(
    () => (report ? computeAeronauticalMetrics(report, station) : null),
    [report, station],
  );

  const flyCondition = useMemo(
    () => (report && aero ? evaluateFlyabilityCondition(report, aero) : null),
    [report, aero],
  );

  const localHour24 = useMemo(
    () => boardData?.localHour24 ?? computeLocalHourAtLon(station.lon),
    [boardData?.localHour24, station.lon],
  );
  const autoSky = useMemo(
    () => resolveAutoSkyByTimeAndWeather(report ?? undefined, localHour24),
    [report, localHour24],
  );

  const handleCopy = (kind: "metar" | "taf", text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setCopiedField(kind);
    toast.success(`${kind.toUpperCase()} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleAttachToExistingFlight = () => {
    if (!report) return;
    if (onAttachWeather) {
      onAttachWeather(report);
      toast.success(`Attached ${report.icao} METAR/TAF (${report.flightCategory}) to flight form`);
      return;
    }

    const flight = data.flights.find((f) => f.id === targetFlightId);
    if (!flight) {
      if (onStartFlightWithWeather) {
        onStartFlightWithWeather(report);
        return;
      }
      toast.error("Select a flight log entry to attach this weather briefing.");
      return;
    }

    const updatedFlight: Flight = {
      ...flight,
      weatherReport: report,
      remarks: formatRemarksWithWeather(flight.remarks, report),
    };
    saveFlight(updatedFlight);
    log(
      "flight_weather_attached",
      "flight",
      `Attached ${report.icao} METAR (${report.flightCategory}) to flight ${flight.id} on ${flight.date}`,
      flight.id,
    );
    toast.success(
      `Attached ${report.icao} ${report.flightCategory} weather report to flight ${flight.id} (${flight.date})`,
    );
  };

  const handleSyncAllBookingsWeather = async () => {
    if (!report) return;
    const toSync = data.bookings.slice(0, 8);
    for (const b of toSync) {
      const updated = enrichBookingWithWeather(
        {
          ...b,
          weatherCurrent: b.weatherCurrent ?? report,
        },
        b,
      );
      await saveBooking(updated);
    }
    log(
      "weather_database_synced",
      "booking",
      `Synced ${report.icao} (${report.flightCategory} · Q${report.qnhHpa}) weather records across ${toSync.length} bookings`,
    );
    toast.success(
      `Synced current, booking-date, and completion weather records across ${toSync.length} bookings in database`,
    );
  };

  const handleCompleteBookingWithTodayWeather = async (b: Booking) => {
    if (!report) return;
    const completedBooking = enrichBookingWithWeather(
      {
        ...b,
        status: "completed",
        weatherCompleted: report,
      },
      b,
    );
    await saveBooking(completedBooking);
    log(
      "booking_completed_weather_recorded",
      "booking",
      `Completed booking ${b.id} and recorded completion-day weather (${report.icao} · ${report.flightCategory} · ${report.tempC}°C · Q${report.qnhHpa})`,
      b.id,
    );
    toast.success(
      `Booking ${b.id} marked completed & today's actual weather (${report.flightCategory} · ${report.tempC}°C) saved to database`,
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/30 shadow-xl transition-all">
      <WeatherSkyCanvas
        scene={autoSky.scene}
        windSpeedKt={report?.windSpeedKt ?? 12}
        cloudCoverPct={report?.cloudCoverPct ?? 35}
      />

      <div className="relative z-10 bg-slate-950/40 backdrop-blur-[6px] p-4 sm:p-5 text-white">
        <div className="flex flex-col gap-3 border-b border-white/15 pb-3.5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CloudSun className="h-5 w-5 text-sky-300" />
              <h3 className="text-base font-bold tracking-tight text-white">
                Aerodrome Weather Briefing (METAR / TAF)
              </h3>
              {report && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${categoryBadgeStyle(
                    report.flightCategory,
                  )}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {report.flightCategory} — {categoryDescription(report.flightCategory)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-sky-200 border border-white/15">
                <Sparkles className="h-3 w-3 text-amber-300" />
                3D Live Sky: {autoSky.label}
              </span>
            </div>

            <p className="text-xs text-slate-200/90">
              <strong className="text-white">{station.icao}</strong> — {station.name} (
              {station.city}
              {station.state ? `, ${station.state}` : ""}, {station.country}) · Coords{" "}
              <span className="font-mono text-sky-200">
                {station.lat.toFixed(4)}, {station.lon.toFixed(4)}
              </span>{" "}
              · Elev {station.elevationFt} ft MSL · Active RWY {station.primaryRunwayDesignator} ·{" "}
              <span className="text-amber-200 font-medium">
                {describeWeatherCondition(report?.wmoCode, report?.cloudCoverPct)}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/20 bg-slate-900/60 p-1 backdrop-blur-md">
              {QUICK_STATIONS.map((item) => (
                <div key={item.code} className="group relative">
                  <button
                    type="button"
                    title={`${item.code} — ${item.city} (${item.airport})`}
                    onClick={() => void loadWeatherByStationOrCoords({ icaoOrCity: item.code })}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      station.icao === item.code
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-slate-200 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.code}
                  </button>
                  <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 whitespace-nowrap rounded-lg border border-sky-300/40 bg-slate-950/95 px-2.5 py-1 text-[11px] text-white shadow-xl">
                    <span className="font-bold text-sky-300">{item.city}</span>
                    <span className="text-slate-300"> · {item.airport}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => void handleFetchCurrentLocation()}
              disabled={locatingGps || loading}
              className="h-8 gap-1.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white text-xs font-semibold border border-emerald-300/40 shadow"
            >
              <LocateFixed className={`h-3.5 w-3.5 ${locatingGps ? "animate-spin" : ""}`} />
              {locatingGps ? "Detecting Browser Coords…" : "Fetch Current Location"}
            </Button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-12 items-center">
          {flyCondition && (
            <div
              className={`lg:col-span-5 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 backdrop-blur-md shadow-sm ${
                flyCondition.tone === "good"
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
                  : flyCondition.tone === "caution"
                    ? "border-amber-400/50 bg-amber-500/20 text-amber-100"
                    : "border-rose-400/50 bg-rose-500/25 text-rose-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {flyCondition.tone === "good" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                ) : flyCondition.tone === "caution" ? (
                  <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-300 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5">
                    <span>{flyCondition.summary}</span>
                  </div>
                  <div className="text-[11px] opacity-90">{flyCondition.details}</div>
                </div>
              </div>
              <PlaneTakeoff className="h-4 w-4 opacity-75 shrink-0 hidden sm:block" />
            </div>
          )}

          <div className="lg:col-span-7 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-white/15 bg-slate-900/55 p-2 backdrop-blur-md">
            <div ref={searchBoxRef} className="relative flex-1 min-w-[230px]">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                  <Input
                    value={cityInput}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setCityInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleCitySearch();
                      } else if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Search city or airport (e.g. Jabalpur, Mumbai, VIDP)…"
                    aria-label="Enter city or ICAO code"
                    className="h-8 w-full rounded-lg border-white/20 bg-slate-950/75 pl-8 pr-2 text-xs text-white placeholder:text-slate-400"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={loading}
                  onClick={() => void handleCitySearch()}
                  className="h-8 gap-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs shrink-0"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                  Search
                </Button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="City suggestions"
                  className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-sky-400/40 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl"
                >
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      onClick={() => void handleSelectSuggestion(item)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-sky-500/25"
                    >
                      <div>
                        <div className="font-bold text-white">{item.displayLabel}</div>
                        <div className="text-[10px] text-slate-300">{item.subLabel}</div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-sky-300 shrink-0">
                        {item.icao ? <div className="font-bold">{item.icao}</div> : null}
                        <div>
                          {item.lat.toFixed(2)}, {item.lon.toFixed(2)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 border-l border-white/15 pl-2">
              <MapPin className="h-3.5 w-3.5 text-sky-300 shrink-0" />
              <Input
                value={coordsInput}
                onChange={(e) => setCoordsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleCoordinatesSearch();
                  }
                }}
                placeholder="Lat, Lon (e.g. 23.1815, 79.9864)"
                aria-label="Comma-separated coordinates (Lat, Lon)"
                className="h-8 w-44 rounded-lg border-white/20 bg-slate-950/75 px-2.5 text-xs font-mono text-white placeholder:text-slate-400"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={loading}
                onClick={() => void handleCoordinatesSearch()}
                className="h-8 rounded-lg bg-sky-500/85 hover:bg-sky-500 text-white border border-sky-300/30 text-xs shrink-0"
              >
                Go Coords
              </Button>
            </div>
          </div>
        </div>

        {report && aero && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Wind className="h-3.5 w-3.5 text-sky-300" />
                Surface Wind
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {String(aero.windTrueDeg).padStart(3, "0")}° / {aero.windSpeedKt} kt
                {aero.windGustKt ? (
                  <span className="ml-1 text-xs font-semibold text-amber-300">
                    G{aero.windGustKt}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                RWY {station.primaryRunwayDesignator}:{" "}
                {aero.headwindKt >= 0
                  ? `${aero.headwindKt}kt HWC`
                  : `${Math.abs(aero.headwindKt)}kt TWC`}{" "}
                · {aero.crosswindKt}kt XWC
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                {aero.windSpeedKmh} km/h · {aero.windSpeedMs} m/s · {aero.windMagDeg}°M
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Eye className="h-3.5 w-3.5 text-emerald-300" />
                Visibility
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {aero.visMeters >= 9999 ? "10+ km" : `${aero.visKm} km`}
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                {report.wxPhenomena
                  ? `Phenomena: ${report.wxPhenomena}`
                  : "CAVOK / Unobstructed"}
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                {aero.visMeters} m · {aero.visStatuteMiles} SM · {aero.visNauticalMiles} NM
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Cloud className="h-3.5 w-3.5 text-sky-300" />
                Cloud / Ceiling
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {aero.cloudCoverage}{" "}
                {aero.ceilingFtAgl ? `${aero.ceilingFtAgl} ft` : `${aero.cloudBaseFtAgl} ft`}
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                {aero.ceilingFtAgl
                  ? `Ceiling ${aero.ceilingFtAgl} ft (${aero.ceilingMeters} m) AGL`
                  : "No ceiling restriction"}
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                {aero.octas}/8 Octas · Base {aero.flightLevel}
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Thermometer className="h-3.5 w-3.5 text-amber-300" />
                Temp / Dewpoint
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {aero.tempC}°C / {aero.dewpointC}°C
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                Spread ΔT {aero.spreadC}°C · RH {aero.humidityPct}%
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                {aero.tempF}°F · ISA {aero.isaDeviationC >= 0 ? `+${aero.isaDeviationC}` : aero.isaDeviationC}°C · Frz {aero.freezingLevelFt}ft
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Gauge className="h-3.5 w-3.5 text-indigo-300" />
                Altimeter QNH
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {aero.qnhHpa} hPa
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                {aero.qnhInHg} inHg · Sea level
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                QFE {aero.qfeHpa} hPa · PA {aero.pressureAltitudeFt} ft
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200">
                <Compass className="h-3.5 w-3.5 text-teal-300" />
                Density Altitude
              </div>
              <div className="mt-1.5 font-mono text-lg font-bold text-white">
                {aero.densityAltitudeFt >= 0 ? `${aero.densityAltitudeFt}` : aero.densityAltitudeFt}{" "}
                ft
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                Field elev {station.elevationFt} ft MSL
              </div>
              <div className="mt-1 pt-1 border-t border-white/10 text-[10px] font-mono text-sky-200/90">
                {aero.densityAltitudeFt > station.elevationFt + 1500
                  ? "High DA · Lean Mixture"
                  : "Nominal Climb Perf"}
              </div>
            </div>
          </div>
        )}

        {report && (
          <div className="mt-3.5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-white/20 bg-slate-950/65 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                  Actual Observation (METAR) ·{" "}
                  {activeDayPoint
                    ? `${activeDayPoint.relativeLabel} (${activeDayPoint.indianDate})`
                    : "Live"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy("metar", report.metar)}
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  {copiedField === "metar" ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy METAR
                </button>
              </div>
              <p className="mt-1.5 select-all font-mono text-xs leading-relaxed text-white break-all">
                {report.metar}
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-slate-950/65 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                  Terminal Aerodrome Forecast (TAF)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy("taf", report.taf)}
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  {copiedField === "taf" ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy TAF
                </button>
              </div>
              <p className="mt-1.5 select-all font-mono text-xs leading-relaxed text-white break-all">
                {report.taf}
              </p>
            </div>
          </div>
        )}

        {boardData && (
          <div className="mt-4 rounded-xl border border-white/20 bg-slate-950/60 p-3 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveSubPanel("timeline10d")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeSubPanel === "timeline10d"
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Past 2 Days &amp; Next 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubPanel("area100km")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeSubPanel === "area100km"
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  <Radar className="h-3.5 w-3.5" />
                  100 km Area Weather Ring ({station.city})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubPanel("aeroUnits")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeSubPanel === "aeroUnits"
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Aeronautical Units Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubPanel("dbSync")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeSubPanel === "dbSync"
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  <Database className="h-3.5 w-3.5" />
                  Booking &amp; Flight DB Weather Sync ({data.bookings.length})
                </button>
              </div>

              <span className="text-[11px] text-sky-200">
                Updated: {boardData.indianTimestamp} · Click any day to inspect telemetry
              </span>
            </div>

            {activeSubPanel === "timeline10d" && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
                {boardData.timeline10Days.map((day, idx) => {
                  const isSelected = idx === selectedDayIndex;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`flex flex-col justify-between rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-sky-400 bg-sky-500/30 shadow-lg ring-1 ring-sky-300"
                          : day.isToday
                            ? "border-emerald-400/50 bg-emerald-500/15 hover:bg-emerald-500/25"
                            : day.isPast
                              ? "border-amber-300/25 bg-amber-500/10 hover:bg-amber-500/20"
                              : "border-white/10 bg-white/5 hover:bg-white/15"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              day.isToday
                                ? "text-emerald-300"
                                : day.isPast
                                  ? "text-amber-300"
                                  : "text-sky-200"
                            }`}
                          >
                            {day.relativeLabel}
                          </span>
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] font-semibold text-white">
                          {day.indianDate}
                        </div>
                      </div>

                      <div className="my-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold border ${categoryBadgeStyle(
                            day.flightCategory,
                          )}`}
                        >
                          {day.flightCategory}
                        </span>
                      </div>

                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div className="font-bold text-white">
                          {day.tempMaxC}° / <span className="text-slate-300">{day.tempMinC}°C</span>
                        </div>
                        <div className="text-[10px] text-sky-200">
                          {day.windDir}°/{day.windSpeedKt}kt
                        </div>
                        <div className="text-[10px] text-slate-300">
                          {day.precipMm > 0 ? `🌧 ${day.precipMm}mm` : `Q${day.qnhHpa}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeSubPanel === "area100km" && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-200">
                  <span>
                    Regional 100 km Radius Meteorological Surveillance around{" "}
                    <strong className="text-white">
                      {station.city} ({station.lat.toFixed(3)}, {station.lon.toFixed(3)})
                    </strong>
                  </span>
                  <span className="font-mono text-[11px] text-sky-300">
                    Click any sector to focus coordinates
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
                  {boardData.regional100Km.map((sec) => (
                    <div
                      key={sec.id}
                      className={`rounded-xl border p-3 transition-all ${
                        sec.sector === "CENTER"
                          ? "border-sky-400/60 bg-sky-500/20"
                          : "border-white/15 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white">{sec.label}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${categoryBadgeStyle(
                            sec.flightCategory,
                          )}`}
                        >
                          {sec.flightCategory}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-sky-200">
                        {sec.locationName}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-200">
                        <div>Temp: {sec.tempC}°C</div>
                        <div>
                          Wind: {sec.windDir}°/{sec.windSpeedKt}kt
                        </div>
                        <div>Vis: {(sec.visibilityMeters / 1000).toFixed(1)}km</div>
                        <div>QNH: {sec.qnhHpa}hPa</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5">
                        <span className="text-[10px] text-slate-300">
                          Clouds: {sec.cloudCoverage} ({sec.cloudCoverPct}%)
                        </span>
                        {sec.distanceKm > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              void loadWeatherByStationOrCoords({
                                lat: sec.lat,
                                lon: sec.lon,
                                customCity: `${station.city} ${sec.sector.replace("_100KM", "")} 100km`,
                              })
                            }
                            className="text-[10px] font-semibold text-sky-300 hover:underline"
                          >
                            Load Sector →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubPanel === "aeroUnits" && aero && (
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="rounded-lg border border-white/15 bg-white/5 p-2.5 space-y-1">
                  <div className="font-bold text-sky-300 uppercase text-[10px]">
                    Aeronautical Wind &amp; Runway Vectors
                  </div>
                  <div className="font-mono text-white">
                    True: {aero.windTrueDeg}°T · Mag: {aero.windMagDeg}°M (Var {aero.magVarDeg}°E)
                  </div>
                  <div className="font-mono text-slate-200">
                    Speed: {aero.windSpeedKt} kt · {aero.windSpeedKmh} km/h · {aero.windSpeedMs} m/s
                  </div>
                  <div className="font-mono text-emerald-300">
                    RWY {station.primaryRunwayDesignator}: HWC {aero.headwindKt} kt · XWC{" "}
                    {aero.crosswindKt} kt ({aero.crosswindSide})
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/5 p-2.5 space-y-1">
                  <div className="font-bold text-sky-300 uppercase text-[10px]">
                    Aeronautical Altimetry &amp; Performance
                  </div>
                  <div className="font-mono text-white">
                    QNH: {aero.qnhHpa} hPa ({aero.qnhInHg} inHg) · QFE: {aero.qfeHpa} hPa
                  </div>
                  <div className="font-mono text-slate-200">
                    Pressure Alt: {aero.pressureAltitudeFt} ft · Density Alt:{" "}
                    {aero.densityAltitudeFt} ft
                  </div>
                  <div className="font-mono text-amber-200">
                    0°C Freezing Level: {aero.freezingLevelFt} ft MSL
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/5 p-2.5 space-y-1">
                  <div className="font-bold text-sky-300 uppercase text-[10px]">
                    Horizontal Visibility &amp; Cloud Base
                  </div>
                  <div className="font-mono text-white">
                    Vis: {aero.visMeters} m · {aero.visKm} km · {aero.visStatuteMiles} SM ·{" "}
                    {aero.visNauticalMiles} NM
                  </div>
                  <div className="font-mono text-slate-200">
                    Cloud Cover: {aero.cloudCoverage} ({aero.octas}/8 Octas)
                  </div>
                  <div className="font-mono text-sky-200">
                    LCL Base: {aero.cloudBaseFtAgl} ft AGL ({aero.flightLevel})
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/5 p-2.5 space-y-1">
                  <div className="font-bold text-sky-300 uppercase text-[10px]">
                    Thermodynamics &amp; Standard Atmosphere
                  </div>
                  <div className="font-mono text-white">
                    Temp: {aero.tempC}°C ({aero.tempF}°F) · Dew: {aero.dewpointC}°C (
                    {aero.dewpointF}°F)
                  </div>
                  <div className="font-mono text-slate-200">
                    Spread ΔT: {aero.spreadC}°C · Rel Humidity: {aero.humidityPct}%
                  </div>
                  <div className="font-mono text-emerald-300">
                    ISA Std: {aero.isaTempC}°C (Dev{" "}
                    {aero.isaDeviationC >= 0 ? `+${aero.isaDeviationC}` : aero.isaDeviationC}°C)
                  </div>
                </div>
              </div>
            )}

            {activeSubPanel === "dbSync" && (
              <div className="mt-3 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-200">
                    Automatic Database Weather Persistence: Every booking records{" "}
                    <strong className="text-white">1. Current Condition</strong>,{" "}
                    <strong className="text-white">2. Booking Date Forecast</strong>, and{" "}
                    <strong className="text-white">3. Completion Day Weather</strong>.
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void handleSyncAllBookingsWeather()}
                    className="h-7 gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs"
                  >
                    <Database className="h-3.5 w-3.5" />
                    Sync Weather Across Bookings
                  </Button>
                </div>

                <div className="max-h-52 overflow-y-auto rounded-lg border border-white/15 bg-slate-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/15 bg-white/5 text-[10px] uppercase text-sky-200">
                      <tr>
                        <th className="px-2.5 py-2">Booking / Route</th>
                        <th className="px-2.5 py-2">Date</th>
                        <th className="px-2.5 py-2">1. Current WX (At Booking)</th>
                        <th className="px-2.5 py-2">2. Booking Date WX</th>
                        <th className="px-2.5 py-2">3. Completed Day WX</th>
                        <th className="px-2.5 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 font-mono text-[11px]">
                      {data.bookings.slice(0, 6).map((b) => {
                        const enriched = enrichBookingWithWeather(b, b);
                        return (
                          <tr key={b.id} className="hover:bg-white/5">
                            <td className="px-2.5 py-2 font-sans">
                              <span className="font-bold text-white">{b.id}</span>{" "}
                              <span className="text-slate-300">({b.route || "VIDP"})</span>
                            </td>
                            <td className="px-2.5 py-2 text-slate-200">
                              {formatIndianDateShort(b.start.slice(0, 10))}
                            </td>
                            <td className="px-2.5 py-2 text-emerald-300">
                              {enriched.weatherCurrent
                                ? `${enriched.weatherCurrent.flightCategory} · ${enriched.weatherCurrent.tempC}°C · Q${enriched.weatherCurrent.qnhHpa}`
                                : "Synced"}
                            </td>
                            <td className="px-2.5 py-2 text-sky-300">
                              {enriched.weatherForecast
                                ? `${enriched.weatherForecast.flightCategory} · ${enriched.weatherForecast.windDir}°/${enriched.weatherForecast.windSpeedKt}kt`
                                : "Synced"}
                            </td>
                            <td className="px-2.5 py-2">
                              {b.status === "completed" && enriched.weatherCompleted ? (
                                <span className="text-amber-300">
                                  ✓ {enriched.weatherCompleted.flightCategory} ·{" "}
                                  {enriched.weatherCompleted.tempC}°C · Q
                                  {enriched.weatherCompleted.qnhHpa}
                                </span>
                              ) : (
                                <span className="text-slate-400">Pending completion</span>
                              )}
                            </td>
                            <td className="px-2.5 py-2 text-right font-sans">
                              {b.status !== "completed" ? (
                                <button
                                  type="button"
                                  onClick={() => void handleCompleteBookingWithTodayWeather(b)}
                                  className="rounded bg-emerald-500/25 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 hover:bg-emerald-500/40"
                                >
                                  Complete &amp; Log Today WX
                                </button>
                              ) : (
                                <Chip tone="ok">Completed &amp; Synced</Chip>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {report && !compact && (
          <div className="mt-3.5 flex flex-col gap-2.5 rounded-xl border border-white/20 bg-slate-900/65 p-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Paperclip className="h-3.5 w-3.5 text-sky-300" />
                Attach Official METAR/TAF Briefing to Flight Log
              </div>
              <p className="text-[11px] text-slate-200">
                Bind this {station.icao} METAR/TAF snapshot ({report.flightCategory}) to an
                existing sortie record or start a new flight log with weather pre-attached.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!onAttachWeather && recentFlights.length > 0 && (
                <NativeSelect
                  value={targetFlightId}
                  onChange={(e) => setTargetFlightId(e.target.value)}
                  aria-label="Select flight log to attach weather"
                  className="h-8 text-xs min-w-[210px] bg-slate-950/80 text-white border-white/25"
                >
                  {recentFlights.map((f) => {
                    const ac = data.aircraft.find((a) => a.id === f.aircraftId);
                    return (
                      <option key={f.id} value={f.id}>
                        {f.id} · {formatIndianDateShort(f.date)} · {ac?.reg ?? f.aircraftId} (
                        {f.fromIcao}→{f.toIcao})
                      </option>
                    );
                  })}
                </NativeSelect>
              )}

              <Button
                type="button"
                size="sm"
                onClick={handleAttachToExistingFlight}
                className="h-8 gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow"
              >
                <Paperclip className="h-3.5 w-3.5" />
                {onAttachWeather ? "Attach to Current Flight Form" : "Attach to Flight Log"}
              </Button>

              {onStartFlightWithWeather && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onStartFlightWithWeather(report)}
                  className="h-8 gap-1.5 rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/20 text-xs"
                >
                  Log New Sortie with Weather
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
