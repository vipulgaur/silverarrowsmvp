import type { Booking, Flight, FlightRulesCategory, FlightWeatherAttachment } from "./types";

export interface AerodromeInfo {
  icao: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  elevationFt: number;
  primaryRunwayHeading: number;
  primaryRunwayDesignator: string;
}

export interface CitySuggestion {
  id: string;
  city: string;
  state?: string;
  stateShort?: string;
  country: string;
  displayLabel: string; // e.g. "Jabalpur, MP, India"
  subLabel: string; // e.g. "Dumna Airport (VAJB) · Madhya Pradesh"
  icao?: string;
  lat: number;
  lon: number;
  elevationFt?: number;
}

export interface FlyabilityAssessment {
  verdict: "GOOD TO FLY" | "CAUTION — MARGINAL" | "POOR TO FLY (NO-GO)";
  tone: "good" | "caution" | "nogo";
  summary: string;
  details: string;
}

export interface DailyWeatherPoint {
  date: string; // YYYY-MM-DD
  indianDate: string; // DD/MM/YYYY
  dayName: string; // Mon, Tue, etc.
  relativeLabel: string; // "2 Days Ago", "Yesterday", "Today (Live)", "+1 Day", etc.
  offsetDays: number; // -2 to +7
  isPast: boolean;
  isToday: boolean;
  tempMaxC: number;
  tempMinC: number;
  tempMeanC: number;
  dewpointC: number;
  windSpeedKt: number;
  windGustKt?: number;
  windDir: number;
  precipMm: number;
  humidityPct: number;
  cloudCoverPct: number;
  visibilityMeters: number;
  qnhHpa: number;
  wmoCode: number;
  flightCategory: FlightRulesCategory;
  wxPhenomena?: string;
  report: FlightWeatherAttachment;
}

export interface RegionalSectorWeather {
  id: string;
  sector: "CENTER" | "NORTH_100KM" | "EAST_100KM" | "SOUTH_100KM" | "WEST_100KM";
  label: string;
  bearingDeg: number;
  distanceKm: number;
  lat: number;
  lon: number;
  locationName: string;
  flightCategory: FlightRulesCategory;
  tempC: number;
  dewpointC: number;
  windDir: number;
  windSpeedKt: number;
  visibilityMeters: number;
  qnhHpa: number;
  cloudCoverPct: number;
  cloudCoverage: "SKC" | "FEW" | "SCT" | "BKN" | "OVC";
  wxPhenomena?: string;
  wmoCode: number;
  metar: string;
}

export interface AeronauticalMetrics {
  windTrueDeg: number;
  windMagDeg: number;
  magVarDeg: number;
  windSpeedKt: number;
  windGustKt?: number;
  windSpeedKmh: number;
  windSpeedMs: number;
  headwindKt: number;
  crosswindKt: number;
  crosswindSide: "L" | "R" | "NONE";
  visMeters: number;
  visKm: number;
  visStatuteMiles: number;
  visNauticalMiles: number;
  cloudCoverage: "SKC" | "FEW" | "SCT" | "BKN" | "OVC";
  octas: number;
  ceilingFtAgl?: number;
  ceilingMeters?: number;
  cloudBaseFtAgl: number;
  flightLevel: string;
  qnhHpa: number;
  qnhInHg: string;
  qfeHpa: number;
  pressureAltitudeFt: number;
  densityAltitudeFt: number;
  freezingLevelFt: number;
  tempC: number;
  tempF: number;
  dewpointC: number;
  dewpointF: number;
  spreadC: number;
  isaTempC: number;
  isaDeviationC: number;
  humidityPct: number;
}

export interface ComprehensiveWeatherBoardData {
  station: AerodromeInfo;
  current: FlightWeatherAttachment;
  aeroMetrics: AeronauticalMetrics;
  timeline10Days: DailyWeatherPoint[];
  regional100Km: RegionalSectorWeather[];
  indianTimestamp: string;
  localHour24: number;
  isDaytime: boolean;
  source: "open-meteo" | "fallback";
}

export const AERODROME_CATALOGUE: Record<string, AerodromeInfo> = {
  VIDP: {
    icao: "VIDP",
    name: "Indira Gandhi Intl Airport",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.5562,
    lon: 77.1,
    elevationFt: 777,
    primaryRunwayHeading: 280,
    primaryRunwayDesignator: "10/28",
  },
  VABB: {
    icao: "VABB",
    name: "Chhatrapati Shivaji Maharaj Intl",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    lat: 19.0896,
    lon: 72.8656,
    elevationFt: 39,
    primaryRunwayHeading: 270,
    primaryRunwayDesignator: "09/27",
  },
  VOBL: {
    icao: "VOBL",
    name: "Kempegowda Intl Airport",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    lat: 13.1986,
    lon: 77.7066,
    elevationFt: 3000,
    primaryRunwayHeading: 90,
    primaryRunwayDesignator: "09L/27R",
  },
  VOMM: {
    icao: "VOMM",
    name: "Chennai Intl Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    lat: 12.9941,
    lon: 80.1709,
    elevationFt: 52,
    primaryRunwayHeading: 70,
    primaryRunwayDesignator: "07/25",
  },
  VECC: {
    icao: "VECC",
    name: "Netaji Subhas Chandra Bose Intl",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    lat: 22.6547,
    lon: 88.4467,
    elevationFt: 16,
    primaryRunwayHeading: 190,
    primaryRunwayDesignator: "01R/19L",
  },
  VOHS: {
    icao: "VOHS",
    name: "Rajiv Gandhi Intl Airport",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    lat: 17.2403,
    lon: 78.4294,
    elevationFt: 2024,
    primaryRunwayHeading: 90,
    primaryRunwayDesignator: "09L/27R",
  },
  VAJB: {
    icao: "VAJB",
    name: "Jabalpur Dumna Airport",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    country: "India",
    lat: 23.1778,
    lon: 80.052,
    elevationFt: 1624,
    primaryRunwayHeading: 60,
    primaryRunwayDesignator: "06/24",
  },
  VABP: {
    icao: "VABP",
    name: "Raja Bhoj Airport",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    lat: 23.2875,
    lon: 77.3374,
    elevationFt: 1719,
    primaryRunwayHeading: 120,
    primaryRunwayDesignator: "12/30",
  },
  VAID: {
    icao: "VAID",
    name: "Devi Ahilya Bai Holkar Airport",
    city: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    lat: 22.7218,
    lon: 75.8011,
    elevationFt: 1850,
    primaryRunwayHeading: 70,
    primaryRunwayDesignator: "07/25",
  },
  VAPO: {
    icao: "VAPO",
    name: "Pune Lohegaon Airport",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    lat: 18.5821,
    lon: 73.9197,
    elevationFt: 1942,
    primaryRunwayHeading: 100,
    primaryRunwayDesignator: "10/28",
  },
  VAAH: {
    icao: "VAAH",
    name: "Sardar Vallabhbhai Patel Intl",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    lat: 23.0772,
    lon: 72.6347,
    elevationFt: 189,
    primaryRunwayHeading: 50,
    primaryRunwayDesignator: "05/23",
  },
  VIJP: {
    icao: "VIJP",
    name: "Jaipur Intl Airport",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    lat: 26.8242,
    lon: 75.8122,
    elevationFt: 1263,
    primaryRunwayHeading: 90,
    primaryRunwayDesignator: "09/27",
  },
  EKAH: {
    icao: "EKAH",
    name: "Aarhus Airport",
    city: "Aarhus",
    state: "Midtjylland",
    country: "Denmark",
    lat: 56.3,
    lon: 10.619,
    elevationFt: 82,
    primaryRunwayHeading: 280,
    primaryRunwayDesignator: "10R/28L",
  },
  EKRK: {
    icao: "EKRK",
    name: "Copenhagen Roskilde Airport",
    city: "Roskilde",
    state: "Sjælland",
    country: "Denmark",
    lat: 55.5856,
    lon: 12.1314,
    elevationFt: 146,
    primaryRunwayHeading: 290,
    primaryRunwayDesignator: "11/29",
  },
  EKBI: {
    icao: "EKBI",
    name: "Billund Airport",
    city: "Billund",
    country: "Denmark",
    lat: 55.7403,
    lon: 9.1518,
    elevationFt: 247,
    primaryRunwayHeading: 270,
    primaryRunwayDesignator: "09/27",
  },
  EKCH: {
    icao: "EKCH",
    name: "Copenhagen Kastrup Airport",
    city: "Copenhagen",
    country: "Denmark",
    lat: 55.618,
    lon: 12.6508,
    elevationFt: 17,
    primaryRunwayHeading: 220,
    primaryRunwayDesignator: "04L/22R",
  },
  EKYT: {
    icao: "EKYT",
    name: "Aalborg Airport",
    city: "Aalborg",
    country: "Denmark",
    lat: 57.0928,
    lon: 9.8492,
    elevationFt: 10,
    primaryRunwayHeading: 260,
    primaryRunwayDesignator: "08L/26R",
  },
  EKOD: {
    icao: "EKOD",
    name: "Hans Christian Andersen Airport",
    city: "Odense",
    country: "Denmark",
    lat: 55.4767,
    lon: 10.3309,
    elevationFt: 56,
    primaryRunwayHeading: 240,
    primaryRunwayDesignator: "06/24",
  },
  EGLL: {
    icao: "EGLL",
    name: "London Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    lat: 51.47,
    lon: -0.4543,
    elevationFt: 83,
    primaryRunwayHeading: 270,
    primaryRunwayDesignator: "09L/27R",
  },
};

const STATE_SHORT_MAP: Record<string, string> = {
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Karnataka: "KA",
  "Tamil Nadu": "TN",
  "West Bengal": "WB",
  Telangana: "TG",
  Delhi: "DL",
  "National Capital Territory of Delhi": "DL",
  Gujarat: "GJ",
  Rajasthan: "RJ",
  "Uttar Pradesh": "UP",
  Bihar: "BR",
  Punjab: "PB",
  Haryana: "HR",
  Kerala: "KL",
  Odisha: "OD",
  Assam: "AS",
  Chhattisgarh: "CG",
  Jharkhand: "JH",
  Uttarakhand: "UK",
  "Himachal Pradesh": "HP",
  Goa: "GA",
  "Andhra Pradesh": "AP",
  "Jammu and Kashmir": "JK",
  Chandigarh: "CH",
};

export function shortenStateName(state?: string): string | undefined {
  if (!state) return undefined;
  return STATE_SHORT_MAP[state] ?? state;
}

export const BUILTIN_CITY_SUGGESTIONS: CitySuggestion[] = [
  {
    id: "jabalpur-mp",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Jabalpur, MP, India",
    subLabel: "Dumna Airport (VAJB) · Madhya Pradesh",
    icao: "VAJB",
    lat: 23.1815,
    lon: 79.9864,
    elevationFt: 1624,
  },
  {
    id: "bhopal-mp",
    city: "Bhopal",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Bhopal, MP, India",
    subLabel: "Raja Bhoj Airport (VABP) · Madhya Pradesh",
    icao: "VABP",
    lat: 23.2599,
    lon: 77.4126,
    elevationFt: 1719,
  },
  {
    id: "indore-mp",
    city: "Indore",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Indore, MP, India",
    subLabel: "Devi Ahilya Bai Holkar Airport (VAID) · Madhya Pradesh",
    icao: "VAID",
    lat: 22.7196,
    lon: 75.8577,
    elevationFt: 1850,
  },
  {
    id: "gwalior-mp",
    city: "Gwalior",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Gwalior, MP, India",
    subLabel: "Rajmata Vijaya Raje Scindia Airport (VIGR) · Madhya Pradesh",
    icao: "VIGR",
    lat: 26.2183,
    lon: 78.1828,
    elevationFt: 617,
  },
  {
    id: "khajuraho-mp",
    city: "Khajuraho",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Khajuraho, MP, India",
    subLabel: "Khajuraho Civil Aerodrome (VAKJ) · Madhya Pradesh",
    icao: "VAKJ",
    lat: 24.8172,
    lon: 79.9186,
    elevationFt: 711,
  },
  {
    id: "ujjain-mp",
    city: "Ujjain",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Ujjain, MP, India",
    subLabel: "Datana Airstrip · Madhya Pradesh",
    icao: "VAID",
    lat: 23.1765,
    lon: 75.7885,
    elevationFt: 1610,
  },
  {
    id: "rewa-mp",
    city: "Rewa",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Rewa, MP, India",
    subLabel: "Rewa Chorhata Airport · Madhya Pradesh",
    icao: "VAJB",
    lat: 24.5362,
    lon: 81.3037,
    elevationFt: 1040,
  },
  {
    id: "sagar-mp",
    city: "Sagar",
    state: "Madhya Pradesh",
    stateShort: "MP",
    country: "India",
    displayLabel: "Sagar, MP, India",
    subLabel: "Dhana Airstrip · Madhya Pradesh",
    icao: "VABP",
    lat: 23.8388,
    lon: 78.7378,
    elevationFt: 1730,
  },
  {
    id: "new-delhi-dl",
    city: "New Delhi",
    state: "Delhi",
    stateShort: "DL",
    country: "India",
    displayLabel: "New Delhi, DL, India",
    subLabel: "Indira Gandhi Intl Airport (VIDP)",
    icao: "VIDP",
    lat: 28.5562,
    lon: 77.1,
    elevationFt: 777,
  },
  {
    id: "mumbai-mh",
    city: "Mumbai",
    state: "Maharashtra",
    stateShort: "MH",
    country: "India",
    displayLabel: "Mumbai, MH, India",
    subLabel: "Chhatrapati Shivaji Maharaj Intl (VABB)",
    icao: "VABB",
    lat: 19.0896,
    lon: 72.8656,
    elevationFt: 39,
  },
  {
    id: "bengaluru-ka",
    city: "Bengaluru",
    state: "Karnataka",
    stateShort: "KA",
    country: "India",
    displayLabel: "Bengaluru, KA, India",
    subLabel: "Kempegowda Intl Airport (VOBL)",
    icao: "VOBL",
    lat: 13.1986,
    lon: 77.7066,
    elevationFt: 3000,
  },
  {
    id: "chennai-tn",
    city: "Chennai",
    state: "Tamil Nadu",
    stateShort: "TN",
    country: "India",
    displayLabel: "Chennai, TN, India",
    subLabel: "Chennai Intl Airport (VOMM)",
    icao: "VOMM",
    lat: 12.9941,
    lon: 80.1709,
    elevationFt: 52,
  },
  {
    id: "kolkata-wb",
    city: "Kolkata",
    state: "West Bengal",
    stateShort: "WB",
    country: "India",
    displayLabel: "Kolkata, WB, India",
    subLabel: "Netaji Subhas Chandra Bose Intl (VECC)",
    icao: "VECC",
    lat: 22.6547,
    lon: 88.4467,
    elevationFt: 16,
  },
  {
    id: "hyderabad-tg",
    city: "Hyderabad",
    state: "Telangana",
    stateShort: "TG",
    country: "India",
    displayLabel: "Hyderabad, TG, India",
    subLabel: "Rajiv Gandhi Intl Airport (VOHS)",
    icao: "VOHS",
    lat: 17.2403,
    lon: 78.4294,
    elevationFt: 2024,
  },
  {
    id: "pune-mh",
    city: "Pune",
    state: "Maharashtra",
    stateShort: "MH",
    country: "India",
    displayLabel: "Pune, MH, India",
    subLabel: "Pune Lohegaon Airport (VAPO)",
    icao: "VAPO",
    lat: 18.5821,
    lon: 73.9197,
    elevationFt: 1942,
  },
  {
    id: "ahmedabad-gj",
    city: "Ahmedabad",
    state: "Gujarat",
    stateShort: "GJ",
    country: "India",
    displayLabel: "Ahmedabad, GJ, India",
    subLabel: "Sardar Vallabhbhai Patel Intl (VAAH)",
    icao: "VAAH",
    lat: 23.0772,
    lon: 72.6347,
    elevationFt: 189,
  },
  {
    id: "jaipur-rj",
    city: "Jaipur",
    state: "Rajasthan",
    stateShort: "RJ",
    country: "India",
    displayLabel: "Jaipur, RJ, India",
    subLabel: "Jaipur Intl Airport (VIJP)",
    icao: "VIJP",
    lat: 26.8242,
    lon: 75.8122,
    elevationFt: 1263,
  },
  {
    id: "nagpur-mh",
    city: "Nagpur",
    state: "Maharashtra",
    stateShort: "MH",
    country: "India",
    displayLabel: "Nagpur, MH, India",
    subLabel: "Dr. Babasaheb Ambedkar Intl (VANP)",
    icao: "VANP",
    lat: 21.0922,
    lon: 79.0472,
    elevationFt: 1033,
  },
  {
    id: "raipur-cg",
    city: "Raipur",
    state: "Chhattisgarh",
    stateShort: "CG",
    country: "India",
    displayLabel: "Raipur, CG, India",
    subLabel: "Swami Vivekananda Airport (VARP)",
    icao: "VARP",
    lat: 21.1804,
    lon: 81.7388,
    elevationFt: 1042,
  },
  {
    id: "lucknow-up",
    city: "Lucknow",
    state: "Uttar Pradesh",
    stateShort: "UP",
    country: "India",
    displayLabel: "Lucknow, UP, India",
    subLabel: "Chaudhary Charan Singh Intl (VILK)",
    icao: "VILK",
    lat: 26.7606,
    lon: 80.8893,
    elevationFt: 410,
  },
  {
    id: "varanasi-up",
    city: "Varanasi",
    state: "Uttar Pradesh",
    stateShort: "UP",
    country: "India",
    displayLabel: "Varanasi, UP, India",
    subLabel: "Lal Bahadur Shastri Intl (VIBN)",
    icao: "VIBN",
    lat: 25.4524,
    lon: 82.8593,
    elevationFt: 266,
  },
  {
    id: "patna-br",
    city: "Patna",
    state: "Bihar",
    stateShort: "BR",
    country: "India",
    displayLabel: "Patna, BR, India",
    subLabel: "Jay Prakash Narayan Airport (VEPT)",
    icao: "VEPT",
    lat: 25.5913,
    lon: 85.088,
    elevationFt: 170,
  },
  {
    id: "chandigarh-ch",
    city: "Chandigarh",
    state: "Chandigarh",
    stateShort: "CH",
    country: "India",
    displayLabel: "Chandigarh, CH, India",
    subLabel: "Shaheed Bhagat Singh Intl (VICG)",
    icao: "VICG",
    lat: 30.6735,
    lon: 76.7885,
    elevationFt: 1012,
  },
  {
    id: "amritsar-pb",
    city: "Amritsar",
    state: "Punjab",
    stateShort: "PB",
    country: "India",
    displayLabel: "Amritsar, PB, India",
    subLabel: "Sri Guru Ram Dass Jee Intl (VIAR)",
    icao: "VIAR",
    lat: 31.7096,
    lon: 74.7973,
    elevationFt: 756,
  },
  {
    id: "kochi-kl",
    city: "Kochi",
    state: "Kerala",
    stateShort: "KL",
    country: "India",
    displayLabel: "Kochi, KL, India",
    subLabel: "Cochin Intl Airport (VOCI)",
    icao: "VOCI",
    lat: 10.152,
    lon: 76.4019,
    elevationFt: 30,
  },
  {
    id: "goa-ga",
    city: "Goa",
    state: "Goa",
    stateShort: "GA",
    country: "India",
    displayLabel: "Goa (Dabolim), GA, India",
    subLabel: "Goa Intl Airport (VOGO)",
    icao: "VOGO",
    lat: 15.3808,
    lon: 73.8314,
    elevationFt: 184,
  },
  {
    id: "guwahati-as",
    city: "Guwahati",
    state: "Assam",
    stateShort: "AS",
    country: "India",
    displayLabel: "Guwahati, AS, India",
    subLabel: "Lokpriya Gopinath Bordoloi Intl (VEGT)",
    icao: "VEGT",
    lat: 26.1061,
    lon: 91.5859,
    elevationFt: 162,
  },
  {
    id: "aarhus-dk",
    city: "Aarhus",
    state: "Midtjylland",
    stateShort: "DK",
    country: "Denmark",
    displayLabel: "Aarhus, Denmark",
    subLabel: "Aarhus Airport (EKAH)",
    icao: "EKAH",
    lat: 56.3,
    lon: 10.619,
    elevationFt: 82,
  },
  {
    id: "copenhagen-dk",
    city: "Copenhagen",
    state: "Hovedstaden",
    stateShort: "DK",
    country: "Denmark",
    displayLabel: "Copenhagen, Denmark",
    subLabel: "Kastrup Airport (EKCH)",
    icao: "EKCH",
    lat: 55.618,
    lon: 12.6508,
    elevationFt: 17,
  },
  {
    id: "london-uk",
    city: "London",
    state: "England",
    stateShort: "UK",
    country: "United Kingdom",
    displayLabel: "London, United Kingdom",
    subLabel: "Heathrow Airport (EGLL)",
    icao: "EGLL",
    lat: 51.47,
    lon: -0.4543,
    elevationFt: 83,
  },
];

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  const q = query.trim().toLowerCase();
  if (!q) return BUILTIN_CITY_SUGGESTIONS.slice(0, 6);

  const localMatches = BUILTIN_CITY_SUGGESTIONS.filter(
    (item) =>
      item.city.toLowerCase().includes(q) ||
      item.displayLabel.toLowerCase().includes(q) ||
      item.subLabel.toLowerCase().includes(q) ||
      (item.icao && item.icao.toLowerCase().includes(q)),
  );

  if (q.length < 2) {
    return localMatches.slice(0, 7);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = (await res.json()) as {
        results?: Array<{
          id?: number;
          name: string;
          admin1?: string;
          country?: string;
          latitude: number;
          longitude: number;
          elevation?: number;
        }>;
      };
      const remoteItems: CitySuggestion[] = (json.results ?? []).map((r, i) => {
        const stShort = shortenStateName(r.admin1);
        const country = r.country || "World";
        const displayLabel = [r.name, stShort || r.admin1, country]
          .filter(Boolean)
          .join(", ");
        const station = resolveCoordinatesToStation(r.latitude, r.longitude, r.name);
        return {
          id: `geo-${r.id ?? i}-${r.latitude}-${r.longitude}`,
          city: r.name,
          state: r.admin1,
          stateShort: stShort,
          country,
          displayLabel,
          subLabel: `${r.admin1 ? `${r.admin1} · ` : ""}${r.latitude.toFixed(2)}°N, ${r.longitude.toFixed(2)}°E`,
          icao: station.icao,
          lat: Math.round(r.latitude * 10000) / 10000,
          lon: Math.round(r.longitude * 10000) / 10000,
          elevationFt: r.elevation ? Math.round(r.elevation * 3.28084) : station.elevationFt,
        };
      });

      const merged: CitySuggestion[] = [...localMatches];
      for (const rem of remoteItems) {
        const exists = merged.some(
          (m) =>
            m.city.toLowerCase() === rem.city.toLowerCase() &&
            Math.abs(m.lat - rem.lat) < 0.25,
        );
        if (!exists) merged.push(rem);
      }
      return merged.slice(0, 8);
    }
  } catch {
    /* use localMatches */
  }

  return localMatches.slice(0, 8);
}

export function parseCommaCoordinates(raw: string): { lat: number; lon: number } | null {
  const cleaned = raw.trim().replace(/[°NSEWnsew]/g, " ");
  const parts = cleaned
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  if (lat < -85 || lat > 85 || lon < -180 || lon > 180) return null;
  return {
    lat: Math.round(lat * 10000) / 10000,
    lon: Math.round(lon * 10000) / 10000,
  };
}

export async function detectBrowserCoordinates(): Promise<{
  lat: number;
  lon: number;
  city: string;
  state?: string;
  country: string;
  source: "gps" | "ip";
}> {
  async function reverseGeocode(lat: number, lon: number) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: controller.signal },
      );
      clearTimeout(t);
      if (res.ok) {
        const data = (await res.json()) as {
          city?: string;
          locality?: string;
          principalSubdivision?: string;
          countryName?: string;
        };
        const city = data.city || data.locality;
        if (city) {
          return {
            city,
            state: data.principalSubdivision,
            country: data.countryName || "India",
          };
        }
      }
    } catch {
      /* fallback to nearest known city */
    }
    const station = resolveCoordinatesToStation(lat, lon);
    return {
      city: station.city,
      state: station.state,
      country: station.country,
    };
  }

  if (typeof navigator !== "undefined" && "geolocation" in navigator) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 7000,
          maximumAge: 300000,
        });
      });
      const lat = Math.round(pos.coords.latitude * 10000) / 10000;
      const lon = Math.round(pos.coords.longitude * 10000) / 10000;
      const place = await reverseGeocode(lat, lon);
      return {
        lat,
        lon,
        city: place.city,
        state: place.state,
        country: place.country,
        source: "gps",
      };
    } catch {
      /* Browser GPS blocked or timed out — proceed to IP geolocation */
    }
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en",
      { signal: controller.signal },
    );
    clearTimeout(t);
    if (res.ok) {
      const data = (await res.json()) as {
        latitude?: number;
        longitude?: number;
        city?: string;
        locality?: string;
        principalSubdivision?: string;
        countryName?: string;
      };
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        return {
          lat: Math.round(data.latitude * 10000) / 10000,
          lon: Math.round(data.longitude * 10000) / 10000,
          city: data.city || data.locality || "Current Location",
          state: data.principalSubdivision,
          country: data.countryName || "India",
          source: "ip",
        };
      }
    }
  } catch {
    /* Try GeoJS fallback */
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json", {
      signal: controller.signal,
    });
    clearTimeout(t);
    if (res.ok) {
      const data = (await res.json()) as {
        latitude?: string;
        longitude?: string;
        city?: string;
        region?: string;
        country?: string;
      };
      const lat = parseFloat(data.latitude ?? "");
      const lon = parseFloat(data.longitude ?? "");
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return {
          lat: Math.round(lat * 10000) / 10000,
          lon: Math.round(lon * 10000) / 10000,
          city: data.city || "Current Location",
          state: data.region,
          country: data.country || "India",
          source: "ip",
        };
      }
    }
  } catch {
    /* final fallback */
  }

  return {
    lat: 23.1815,
    lon: 79.9864,
    city: "Jabalpur",
    state: "Madhya Pradesh",
    country: "India",
    source: "ip",
  };
}

export function evaluateFlyabilityCondition(
  report: FlightWeatherAttachment,
  aero: AeronauticalMetrics,
): FlyabilityAssessment {
  const isStorm = (report.wmoCode ?? 0) >= 95 || report.wxPhenomena?.includes("TS");
  const isFog = report.wxPhenomena === "FG" || aero.visMeters < 2000;
  const highWind = aero.windSpeedKt > 24 || (aero.windGustKt ?? 0) > 30 || aero.crosswindKt > 16;

  if (
    report.flightCategory === "LIFR" ||
    report.flightCategory === "IFR" ||
    isStorm ||
    isFog ||
    highWind
  ) {
    const reasons: string[] = [];
    if (isStorm) reasons.push("Thunderstorm / CB activity");
    if (isFog) reasons.push(`Low visibility (${aero.visKm} km)`);
    if (highWind) reasons.push(`Strong wind/crosswind (${aero.windSpeedKt} kt / XWC ${aero.crosswindKt} kt)`);
    if (reasons.length === 0) reasons.push(`${report.flightCategory} ceiling/visibility minima`);

    return {
      verdict: "POOR TO FLY (NO-GO)",
      tone: "nogo",
      summary: "Condition: Poor to Fly — VFR Suspended",
      details: `${reasons.join(" · ")}. Student solo & VFR sorties restricted.`,
    };
  }

  if (
    report.flightCategory === "MVFR" ||
    aero.windSpeedKt >= 16 ||
    aero.crosswindKt >= 11 ||
    (report.wmoCode ?? 0) >= 51
  ) {
    return {
      verdict: "CAUTION — MARGINAL",
      tone: "caution",
      summary: "Condition: Marginal to Fly — Caution Advised",
      details: `${report.flightCategory} conditions · Wind ${aero.windSpeedKt} kt (XWC ${aero.crosswindKt} kt) · Dual check recommended.`,
    };
  }

  return {
    verdict: "GOOD TO FLY",
    tone: "good",
    summary: "Condition: Good to Fly — Cleared for VFR & Training",
    details: `Clear ${report.flightCategory} · Vis ${aero.visMeters >= 9999 ? "10+ km" : `${aero.visKm} km`} · Manageable wind (${aero.windSpeedKt} kt, XWC ${aero.crosswindKt} kt).`,
  };
}

export function formatIndianDateTime(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) return "—";
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formatter.format(d).toUpperCase();
  } catch {
    return d.toISOString().slice(0, 16).replace("T", " ");
  }
}

export function formatIndianDateShort(yyyyMmDd: string): string {
  const parts = yyyyMmDd.slice(0, 10).split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return yyyyMmDd;
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function computeLocalHourAtLon(lon: number, now = new Date()): number {
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const offsetHours = lon / 15;
  return Math.floor(((utcHours + offsetHours) % 24 + 24) % 24);
}

export function resolveCoordinatesToStation(
  lat: number,
  lon: number,
  customCity?: string,
  customIcao?: string,
  customState?: string,
  customCountry?: string,
): AerodromeInfo {
  const clampedLat = Math.max(-85, Math.min(85, Number(lat) || 23.1815));
  const clampedLon = Math.max(-180, Math.min(180, Number(lon) || 79.9864));

  let nearestCitySuggestion: CitySuggestion | null = null;
  let minCityKm = Infinity;
  for (const c of BUILTIN_CITY_SUGGESTIONS) {
    const dist = haversineKm(clampedLat, clampedLon, c.lat, c.lon);
    if (dist < minCityKm) {
      minCityKm = dist;
      nearestCitySuggestion = c;
    }
  }

  let nearest: AerodromeInfo | null = null;
  let minKm = Infinity;
  for (const station of Object.values(AERODROME_CATALOGUE)) {
    const dist = haversineKm(clampedLat, clampedLon, station.lat, station.lon);
    if (dist < minKm) {
      minKm = dist;
      nearest = station;
    }
  }

  if (nearest && minKm <= 35 && !customCity) {
    return {
      ...nearest,
      lat: Math.round(clampedLat * 10000) / 10000,
      lon: Math.round(clampedLon * 10000) / 10000,
    };
  }

  const isIndiaRegion =
    clampedLat >= 6 && clampedLat <= 37 && clampedLon >= 68 && clampedLon <= 98;
  const cleanCity = (
    customCity ||
    (nearestCitySuggestion && minCityKm <= 45
      ? nearestCitySuggestion.city
      : nearest && minKm < 120
        ? nearest.city
        : "Custom Coordinates")
  ).trim();

  const resolvedState =
    customState ||
    (nearestCitySuggestion && minCityKm <= 60 ? nearestCitySuggestion.state : nearest?.state);

  const derivedIcao =
    customIcao ||
    (nearestCitySuggestion && minCityKm <= 45 && nearestCitySuggestion.icao
      ? nearestCitySuggestion.icao
      : nearest && minKm <= 60
        ? nearest.icao
        : isIndiaRegion
          ? `VI${cleanCity
              .replace(/[^A-Za-z]/g, "")
              .toUpperCase()
              .slice(0, 2)
              .padEnd(2, "X")}`
          : `ZZ${cleanCity
              .replace(/[^A-Za-z]/g, "")
              .toUpperCase()
              .slice(0, 2)
              .padEnd(2, "X")}`);

  return {
    icao: derivedIcao.slice(0, 4).toUpperCase(),
    name: customCity
      ? `${cleanCity}${resolvedState ? `, ${shortenStateName(resolvedState)}` : ""}`
      : nearest && minKm <= 45
        ? nearest.name
        : `${cleanCity} Station`,
    city: cleanCity,
    state: resolvedState,
    country:
      customCountry ||
      (isIndiaRegion ? "India" : nearest && minKm < 250 ? nearest.country : "Global"),
    lat: Math.round(clampedLat * 10000) / 10000,
    lon: Math.round(clampedLon * 10000) / 10000,
    elevationFt:
      nearestCitySuggestion && minCityKm <= 45 && nearestCitySuggestion.elevationFt
        ? nearestCitySuggestion.elevationFt
        : nearest && minKm < 150
          ? nearest.elevationFt
          : isIndiaRegion
            ? 1200
            : 120,
    primaryRunwayHeading: nearest ? nearest.primaryRunwayHeading : 270,
    primaryRunwayDesignator: nearest ? nearest.primaryRunwayDesignator : "09/27",
  };
}

export function resolveAerodrome(icaoOrCityRaw: string): AerodromeInfo {
  const raw = (icaoOrCityRaw || "VIDP").trim();
  const upper = raw.toUpperCase();

  if (AERODROME_CATALOGUE[upper]) {
    return AERODROME_CATALOGUE[upper]!;
  }
  const code4 = upper.slice(0, 4);
  if (AERODROME_CATALOGUE[code4]) {
    return AERODROME_CATALOGUE[code4]!;
  }

  const byCity = Object.values(AERODROME_CATALOGUE).find(
    (s) =>
      s.city.toLowerCase() === raw.toLowerCase() ||
      s.name.toLowerCase().includes(raw.toLowerCase()),
  );
  if (byCity) {
    return byCity;
  }

  const bySuggestion = BUILTIN_CITY_SUGGESTIONS.find(
    (s) =>
      s.city.toLowerCase() === raw.toLowerCase() ||
      s.displayLabel.toLowerCase() === raw.toLowerCase() ||
      s.city.toLowerCase().startsWith(raw.toLowerCase()),
  );
  if (bySuggestion) {
    return {
      icao: bySuggestion.icao || "VAJB",
      name: `${bySuggestion.city} Airport`,
      city: bySuggestion.city,
      state: bySuggestion.state,
      country: bySuggestion.country,
      lat: bySuggestion.lat,
      lon: bySuggestion.lon,
      elevationFt: bySuggestion.elevationFt ?? 1000,
      primaryRunwayHeading: 270,
      primaryRunwayDesignator: "09/27",
    };
  }

  const code = code4 || "VIDP";
  const first = code.charCodeAt(0) || 86;
  const second = code.charCodeAt(1) || 73;
  const isIndianPrefix = code.startsWith("V");
  const lat = isIndianPrefix
    ? 12 + ((first * 7 + second * 3) % 18)
    : 45 + ((first * 7 + second * 3) % 15);
  const lon = isIndianPrefix
    ? 72 + ((first * 11 + second * 5) % 16)
    : 5 + ((first * 11 + second * 5) % 20);
  return {
    icao: code,
    name: `${raw} Aerodrome`,
    city: raw,
    country: isIndianPrefix ? "India" : "ICAO Station",
    lat,
    lon,
    elevationFt: isIndianPrefix ? 650 : 120,
    primaryRunwayHeading: 270,
    primaryRunwayDesignator: "09/27",
  };
}

export async function searchCityWeatherLocation(cityQuery: string): Promise<AerodromeInfo> {
  const q = cityQuery.trim();
  if (!q) return AERODROME_CATALOGUE.VIDP!;

  const suggestions = await fetchCitySuggestions(q);
  if (suggestions.length > 0) {
    const top = suggestions[0]!;
    return {
      icao: top.icao || "VAJB",
      name: `${top.city}${top.stateShort ? `, ${top.stateShort}` : ""} Aerodrome`,
      city: top.city,
      state: top.state,
      country: top.country,
      lat: top.lat,
      lon: top.lon,
      elevationFt: top.elevationFt ?? 1000,
      primaryRunwayHeading: 270,
      primaryRunwayDesignator: "09/27",
    };
  }

  return resolveAerodrome(q);
}

function formatMetarTemp(tempC: number): string {
  const rounded = Math.round(tempC);
  if (rounded < 0) {
    return `M${String(Math.abs(rounded)).padStart(2, "0")}`;
  }
  return String(rounded).padStart(2, "0");
}

export function wmoToMetarPhenomena(wmoCode: number): string {
  if (wmoCode === 45 || wmoCode === 48) return "FG";
  if (wmoCode >= 51 && wmoCode <= 55) return "-DZ";
  if (wmoCode === 56 || wmoCode === 57) return "FZDZ";
  if (wmoCode === 61) return "-RA";
  if (wmoCode === 63) return "RA";
  if (wmoCode === 65) return "+RA";
  if (wmoCode === 66 || wmoCode === 67) return "FZRA";
  if (wmoCode === 71) return "-SN";
  if (wmoCode === 73) return "SN";
  if (wmoCode === 75) return "+SN";
  if (wmoCode >= 80 && wmoCode <= 82) return "SHRA";
  if (wmoCode === 95) return "TSRA";
  if (wmoCode >= 96) return "+TSGR";
  return "";
}

export function describeWeatherCondition(wmoCode?: number, cloudCoverPct = 20): string {
  const code = wmoCode ?? 0;
  if (code >= 95) return "Thunderstorm & Cumulonimbus (TSRA)";
  if (code >= 80) return "Convective Rain Showers (SHRA)";
  if (code >= 71) return "Snow / Ice Precipitation (SN)";
  if (code === 65) return "Heavy Continuous Rain (+RA)";
  if (code >= 61) return "Moderate Rain (RA)";
  if (code >= 51) return "Light Drizzle (-DZ)";
  if (code === 45 || code === 48) return "Dense Radiation Fog / Mist (FG)";
  if (cloudCoverPct >= 88) return "Overcast Sky (8/8 Octas · OVC)";
  if (cloudCoverPct >= 52) return "Broken Clouds (5–7/8 Octas · BKN)";
  if (cloudCoverPct >= 26) return "Scattered Clouds (3–4/8 Octas · SCT)";
  if (cloudCoverPct >= 10) return "Few Fair-Weather Clouds (1–2/8 Octas · FEW)";
  return "Clear Sky & Unobstructed Visibility (CAVOK / SKC)";
}

export function computeFlightCategory(
  visibilityMeters: number,
  cloudCeilingFt?: number,
): FlightRulesCategory {
  const ceil = cloudCeilingFt ?? 99999;
  if (ceil < 500 || visibilityMeters < 1600) return "LIFR";
  if (ceil < 1000 || visibilityMeters < 4800) return "IFR";
  if (ceil <= 3000 || visibilityMeters <= 8000) return "MVFR";
  return "VFR";
}

export function computeRunwayWindComponents(
  windDirDeg: number,
  windSpeedKt: number,
  runwayHeadingDeg: number,
): { headwindKt: number; crosswindKt: number; crosswindSide: "L" | "R" | "NONE" } {
  const diffRad = ((windDirDeg - runwayHeadingDeg) * Math.PI) / 180;
  const headwindKt = Math.round(windSpeedKt * Math.cos(diffRad));
  const rawCross = windSpeedKt * Math.sin(diffRad);
  const crosswindKt = Math.round(Math.abs(rawCross));
  const crosswindSide = crosswindKt === 0 ? "NONE" : rawCross > 0 ? "R" : "L";
  return { headwindKt, crosswindKt, crosswindSide };
}

export function computeDensityAltitudeFt(
  elevationFt: number,
  qnhHpa: number,
  tempC: number,
): number {
  const pressureAltitudeFt = elevationFt + (1013.25 - qnhHpa) * 27;
  const isaTempC = 15 - (elevationFt / 1000) * 1.98;
  const densityAlt = pressureAltitudeFt + 120 * (tempC - isaTempC);
  return Math.round(densityAlt);
}

export function computeAeronauticalMetrics(
  report: FlightWeatherAttachment,
  station: AerodromeInfo,
): AeronauticalMetrics {
  const windTrueDeg = report.windDir || 270;
  const magVarDeg = station.country === "India" ? 1 : 3;
  const windMagDeg = ((windTrueDeg - magVarDeg + 360) % 360) || 360;
  const windSpeedKt = report.windSpeedKt;
  const windSpeedKmh = Math.round(windSpeedKt * 1.852 * 10) / 10;
  const windSpeedMs = Math.round(windSpeedKt * 0.514444 * 10) / 10;

  const rwy = computeRunwayWindComponents(
    windTrueDeg,
    windSpeedKt,
    station.primaryRunwayHeading,
  );

  const visMeters = report.visibilityMeters;
  const visKm = Math.round((visMeters / 1000) * 10) / 10;
  const visStatuteMiles = Math.round((visMeters / 1609.34) * 10) / 10;
  const visNauticalMiles = Math.round((visMeters / 1852) * 10) / 10;

  const spreadC = Math.max(0.5, Math.round((report.tempC - report.dewpointC) * 10) / 10);
  const cloudBaseFtAgl =
    report.cloudCeilingFt ?? Math.max(400, Math.min(12000, Math.round((spreadC * 400) / 100) * 100));
  const ceilingFtAgl = report.cloudCeilingFt;
  const ceilingMeters = ceilingFtAgl ? Math.round(ceilingFtAgl * 0.3048) : undefined;

  const cloudCoverPct =
    report.cloudCoverage === "OVC"
      ? 95
      : report.cloudCoverage === "BKN"
        ? 70
        : report.cloudCoverage === "SCT"
          ? 40
          : report.cloudCoverage === "FEW"
            ? 18
            : 0;
  const octas = Math.min(8, Math.max(0, Math.round((cloudCoverPct / 100) * 8)));
  const flightLevelNum = Math.max(5, Math.round((station.elevationFt + cloudBaseFtAgl) / 100));
  const flightLevel = `FL${String(flightLevelNum).padStart(3, "0")}`;

  const qnhHpa = report.qnhHpa;
  const qnhInHg = (qnhHpa * 0.02953).toFixed(2);
  const qfeHpa = Math.round(qnhHpa - station.elevationFt / 27);
  const pressureAltitudeFt = Math.round(station.elevationFt + (1013.25 - qnhHpa) * 27);
  const densityAltitudeFt = computeDensityAltitudeFt(station.elevationFt, qnhHpa, report.tempC);
  const freezingLevelFt = Math.max(
    0,
    Math.round(station.elevationFt + (Math.max(0, report.tempC) / 1.98) * 1000),
  );

  const tempC = report.tempC;
  const tempF = Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
  const dewpointC = report.dewpointC;
  const dewpointF = Math.round(((dewpointC * 9) / 5 + 32) * 10) / 10;
  const isaTempC = Math.round((15 - (station.elevationFt / 1000) * 1.98) * 10) / 10;
  const isaDeviationC = Math.round((tempC - isaTempC) * 10) / 10;
  const humidityPct =
    report.humidityPct ??
    Math.min(100, Math.max(15, Math.round(100 - 5 * (tempC - dewpointC))));

  return {
    windTrueDeg,
    windMagDeg,
    magVarDeg,
    windSpeedKt,
    windGustKt: report.windGustKt,
    windSpeedKmh,
    windSpeedMs,
    headwindKt: rwy.headwindKt,
    crosswindKt: rwy.crosswindKt,
    crosswindSide: rwy.crosswindSide,
    visMeters,
    visKm,
    visStatuteMiles,
    visNauticalMiles,
    cloudCoverage: report.cloudCoverage ?? "SKC",
    octas,
    ceilingFtAgl,
    ceilingMeters,
    cloudBaseFtAgl,
    flightLevel,
    qnhHpa,
    qnhInHg,
    qfeHpa,
    pressureAltitudeFt,
    densityAltitudeFt,
    freezingLevelFt,
    tempC,
    tempF,
    dewpointC,
    dewpointF,
    spreadC,
    isaTempC,
    isaDeviationC,
    humidityPct,
  };
}

export function buildMetarAndTaf(params: {
  icao: string;
  stationName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  windDir: number;
  windSpeedKt: number;
  windGustKt?: number;
  visibilityMeters: number;
  cloudCoverPct: number;
  tempC: number;
  dewpointC: number;
  qnhHpa: number;
  wmoCode: number;
  humidityPct?: number;
  precipMm?: number;
  isDay?: boolean;
  now?: Date;
  forecastWindDir?: number;
  forecastWindSpeedKt?: number;
  forecastVisibilityMeters?: number;
  forecastCloudCoverPct?: number;
  forecastWmoCode?: number;
}): FlightWeatherAttachment {
  const now = params.now ?? new Date();
  const dayStr = String(now.getUTCDate()).padStart(2, "0");
  const hourStr = String(now.getUTCHours()).padStart(2, "0");
  const minStr = now.getUTCMinutes() >= 30 ? "50" : "20";
  const zuluStamp = `${dayStr}${hourStr}${minStr}Z`;

  const wDir = Math.round(params.windDir / 10) * 10;
  const wDirStr = String(wDir === 0 ? 360 : wDir).padStart(3, "0");
  const wSpd = Math.max(0, Math.round(params.windSpeedKt));
  const wSpdStr = String(wSpd).padStart(2, "0");
  const gust =
    params.windGustKt && params.windGustKt - wSpd >= 5
      ? `G${String(Math.round(params.windGustKt)).padStart(2, "0")}`
      : "";
  const windGroup = `${wDirStr}${wSpdStr}${gust}KT`;

  const visMeters = Math.min(9999, Math.max(400, Math.round(params.visibilityMeters)));
  const spread = Math.max(0.5, params.tempC - params.dewpointC);
  const rawBaseFt = Math.max(400, Math.min(12000, Math.round((spread * 400) / 100) * 100));

  let cloudCoverage: "SKC" | "FEW" | "SCT" | "BKN" | "OVC" = "SKC";
  let cloudCeilingFt: number | undefined = undefined;

  if (params.cloudCoverPct >= 88) {
    cloudCoverage = "OVC";
    cloudCeilingFt = rawBaseFt;
  } else if (params.cloudCoverPct >= 52) {
    cloudCoverage = "BKN";
    cloudCeilingFt = rawBaseFt;
  } else if (params.cloudCoverPct >= 26) {
    cloudCoverage = "SCT";
  } else if (params.cloudCoverPct >= 10) {
    cloudCoverage = "FEW";
  }

  const wxPhenomena = wmoToMetarPhenomena(params.wmoCode);
  const isCavok =
    visMeters >= 9999 &&
    !wxPhenomena &&
    (cloudCoverage === "SKC" || rawBaseFt >= 5000);

  const visAndCloudGroup = isCavok
    ? "CAVOK"
    : [
        String(visMeters).padStart(4, "0"),
        wxPhenomena,
        cloudCoverage === "SKC"
          ? "NSC"
          : `${cloudCoverage}${String(Math.round(rawBaseFt / 100)).padStart(3, "0")}`,
      ]
        .filter(Boolean)
        .join(" ");

  const tempGroup = `${formatMetarTemp(params.tempC)}/${formatMetarTemp(params.dewpointC)}`;
  const qnhInt = Math.round(params.qnhHpa);
  const qnhGroup = `Q${String(qnhInt).padStart(4, "0")}`;

  const metar = `METAR ${params.icao} ${zuluStamp} ${windGroup} ${visAndCloudGroup} ${tempGroup} ${qnhGroup} NOSIG`;

  const tafStartHour = String((now.getUTCHours() + 1) % 24).padStart(2, "0");
  const nextDayDate = new Date(now.getTime() + 24 * 3600 * 1000);
  const tafEndDay = String(nextDayDate.getUTCDate()).padStart(2, "0");
  const validityGroup = `${dayStr}${tafStartHour}/${tafEndDay}${tafStartHour}`;

  const fDir = Math.round((params.forecastWindDir ?? params.windDir) / 10) * 10;
  const fDirStr = String(fDir === 0 ? 360 : fDir).padStart(3, "0");
  const fSpdStr = String(
    Math.max(2, Math.round(params.forecastWindSpeedKt ?? params.windSpeedKt)),
  ).padStart(2, "0");
  const fWx = wmoToMetarPhenomena(params.forecastWmoCode ?? params.wmoCode);
  const fCloudPct = params.forecastCloudCoverPct ?? params.cloudCoverPct;
  const fCloudGroup =
    fCloudPct >= 60
      ? `BKN${String(Math.max(12, Math.round(rawBaseFt / 100))).padStart(3, "0")}`
      : `SCT${String(Math.max(25, Math.round(rawBaseFt / 100))).padStart(3, "0")}`;

  const becmgStart = String((now.getUTCHours() + 4) % 24).padStart(2, "0");
  const becmgEnd = String((now.getUTCHours() + 6) % 24).padStart(2, "0");

  const taf = `TAF ${params.icao} ${zuluStamp} ${validityGroup} ${windGroup} ${
    isCavok ? "CAVOK" : `${String(visMeters).padStart(4, "0")} ${fCloudGroup}`
  } BECMG ${dayStr}${becmgStart}/${dayStr}${becmgEnd} ${fDirStr}${fSpdStr}KT ${
    fWx ? `6000 ${fWx} ` : "9999 "
  }${fCloudGroup}`;

  const flightCategory = computeFlightCategory(visMeters, cloudCeilingFt);
  const humidityPct =
    params.humidityPct ??
    Math.min(100, Math.max(15, Math.round(100 - 5 * (params.tempC - params.dewpointC))));

  const localHour = computeLocalHourAtLon(params.lon ?? 77.1, now);
  const autoIsDay = params.isDay ?? (localHour >= 6 && localHour < 19);

  return {
    icao: params.icao,
    stationName: params.stationName,
    city: params.city,
    lat: params.lat,
    lon: params.lon,
    flightCategory,
    metar,
    taf,
    windDir: wDir === 0 ? 360 : wDir,
    windSpeedKt: wSpd,
    windGustKt:
      params.windGustKt && params.windGustKt - wSpd >= 5
        ? Math.round(params.windGustKt)
        : undefined,
    visibilityMeters: visMeters,
    tempC: Math.round(params.tempC * 10) / 10,
    dewpointC: Math.round(params.dewpointC * 10) / 10,
    qnhHpa: qnhInt,
    cloudCeilingFt,
    cloudCoverage,
    wxPhenomena: wxPhenomena || undefined,
    humidityPct,
    precipMm: params.precipMm ?? 0,
    cloudCoverPct: Math.round(params.cloudCoverPct),
    wmoCode: params.wmoCode,
    isDay: autoIsDay,
    istTimestamp: `${formatIndianDateTime(now)} IST`,
    fetchedAt: now.toISOString(),
  };
}

export function buildFallbackWeather(icaoRaw: string, now = new Date()): FlightWeatherAttachment {
  const station = resolveAerodrome(icaoRaw);
  const seed =
    station.icao
      .split("")
      .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0) +
    now.getUTCDate() * 7;

  const isIndia = station.country === "India";
  const windDir = ((seed * 20) % 360) || 240;
  const windSpeedKt = 8 + (seed % 11);
  const windGustKt = seed % 3 === 0 ? windSpeedKt + 7 : undefined;
  const tempC = isIndia ? 26 + (seed % 8) : 14 + (seed % 9);
  const dewpointC = tempC - (4 + (seed % 5));
  const qnhHpa = 1010 + (seed % 10);
  const cloudCoverPct = (seed * 13) % 80;
  const visibilityMeters = cloudCoverPct > 68 ? 6500 : 9999;
  const wmoCode = cloudCoverPct > 72 ? 61 : 0;

  return buildMetarAndTaf({
    icao: station.icao,
    stationName: `${station.name} (${station.city})`,
    city: station.city,
    lat: station.lat,
    lon: station.lon,
    windDir,
    windSpeedKt,
    windGustKt,
    visibilityMeters,
    cloudCoverPct,
    tempC,
    dewpointC,
    qnhHpa,
    wmoCode,
    now,
    forecastWindDir: (windDir + 20) % 360,
    forecastWindSpeedKt: windSpeedKt + 2,
    forecastCloudCoverPct: Math.min(85, cloudCoverPct + 15),
  });
}

export function buildFallback10DayTimeline(
  station: AerodromeInfo,
  baseReport: FlightWeatherAttachment,
  now = new Date(),
): DailyWeatherPoint[] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const points: DailyWeatherPoint[] = [];

  for (let offset = -2; offset <= 7; offset++) {
    const d = new Date(now.getTime() + offset * 86400 * 1000);
    const yyyyMmDd = d.toISOString().slice(0, 10);
    const seed =
      station.icao.charCodeAt(0) +
      station.icao.charCodeAt(station.icao.length - 1) +
      (offset + 5) * 17 +
      d.getUTCDate();

    const isToday = offset === 0;
    const isPast = offset < 0;
    const tempMean = isToday
      ? baseReport.tempC
      : Math.round((baseReport.tempC + ((seed % 7) - 3)) * 10) / 10;
    const tempMaxC = Math.round((tempMean + 3.5 + (seed % 3)) * 10) / 10;
    const tempMinC = Math.round((tempMean - 3.5 - (seed % 2)) * 10) / 10;
    const dewpointC = isToday
      ? baseReport.dewpointC
      : Math.round((tempMean - (3 + (seed % 6))) * 10) / 10;
    const windSpeedKt = isToday ? baseReport.windSpeedKt : 7 + (seed % 14);
    const windDir = isToday ? baseReport.windDir : (((seed * 30) % 360) || 270);
    const cloudCoverPct = isToday ? (baseReport.cloudCoverPct ?? 30) : (seed * 19) % 95;
    const wmoCode = isToday
      ? (baseReport.wmoCode ?? 0)
      : cloudCoverPct >= 82
        ? seed % 2 === 0
          ? 63
          : 95
        : cloudCoverPct >= 65
          ? 61
          : 0;
    const precipMm =
      wmoCode >= 95 ? 14.2 : wmoCode >= 61 ? 5.6 : cloudCoverPct > 75 ? 1.2 : 0;
    const visibilityMeters = isToday
      ? baseReport.visibilityMeters
      : wmoCode >= 63
        ? 4200
        : cloudCoverPct >= 75
          ? 7000
          : 9999;
    const qnhHpa = isToday ? baseReport.qnhHpa : 1008 + (seed % 14);

    const dayReport = isToday
      ? baseReport
      : buildMetarAndTaf({
          icao: station.icao,
          stationName: `${station.name} (${station.city})`,
          city: station.city,
          lat: station.lat,
          lon: station.lon,
          windDir,
          windSpeedKt,
          windGustKt: windSpeedKt > 14 ? windSpeedKt + 7 : undefined,
          visibilityMeters,
          cloudCoverPct,
          tempC: tempMean,
          dewpointC,
          qnhHpa,
          wmoCode,
          precipMm,
          isDay: baseReport.isDay,
          now: d,
        });

    const relativeLabel =
      offset === -2
        ? "2 Days Ago"
        : offset === -1
          ? "Yesterday"
          : offset === 0
            ? "Today (Live)"
            : offset === 1
              ? "Tomorrow"
              : `+${offset} Days`;

    points.push({
      date: yyyyMmDd,
      indianDate: formatIndianDateShort(yyyyMmDd),
      dayName: dayNames[d.getUTCDay()] ?? "Day",
      relativeLabel,
      offsetDays: offset,
      isPast,
      isToday,
      tempMaxC,
      tempMinC,
      tempMeanC: tempMean,
      dewpointC,
      windSpeedKt,
      windGustKt: dayReport.windGustKt,
      windDir,
      precipMm,
      humidityPct: dayReport.humidityPct ?? 65,
      cloudCoverPct,
      visibilityMeters,
      qnhHpa,
      wmoCode,
      flightCategory: dayReport.flightCategory,
      wxPhenomena: dayReport.wxPhenomena,
      report: dayReport,
    });
  }

  return points;
}

export function buildRegional100KmRing(
  station: AerodromeInfo,
  centerReport: FlightWeatherAttachment,
): RegionalSectorWeather[] {
  const dLat100 = 0.9;
  const cosLat = Math.max(0.25, Math.cos((station.lat * Math.PI) / 180));
  const dLon100 = Math.round((0.9 / cosLat) * 1000) / 1000;

  const sectorDefs: Array<{
    sector: RegionalSectorWeather["sector"];
    label: string;
    bearingDeg: number;
    distanceKm: number;
    lat: number;
    lon: number;
    deltaTemp: number;
    deltaWindKt: number;
    deltaCloud: number;
  }> = [
    {
      sector: "CENTER",
      label: `${station.city} Center (0 km)`,
      bearingDeg: 0,
      distanceKm: 0,
      lat: station.lat,
      lon: station.lon,
      deltaTemp: 0,
      deltaWindKt: 0,
      deltaCloud: 0,
    },
    {
      sector: "NORTH_100KM",
      label: `North Sector · 100 km (360°)`,
      bearingDeg: 360,
      distanceKm: 100,
      lat: Math.round((station.lat + dLat100) * 1000) / 1000,
      lon: station.lon,
      deltaTemp: -1.4,
      deltaWindKt: 3,
      deltaCloud: 12,
    },
    {
      sector: "EAST_100KM",
      label: `East Sector · 100 km (090°)`,
      bearingDeg: 90,
      distanceKm: 100,
      lat: station.lat,
      lon: Math.round((station.lon + dLon100) * 1000) / 1000,
      deltaTemp: 0.8,
      deltaWindKt: -2,
      deltaCloud: -10,
    },
    {
      sector: "SOUTH_100KM",
      label: `South Sector · 100 km (180°)`,
      bearingDeg: 180,
      distanceKm: 100,
      lat: Math.round((station.lat - dLat100) * 1000) / 1000,
      lon: station.lon,
      deltaTemp: 1.6,
      deltaWindKt: 2,
      deltaCloud: -5,
    },
    {
      sector: "WEST_100KM",
      label: `West Sector · 100 km (270°)`,
      bearingDeg: 270,
      distanceKm: 100,
      lat: station.lat,
      lon: Math.round((station.lon - dLon100) * 1000) / 1000,
      deltaTemp: -0.6,
      deltaWindKt: 4,
      deltaCloud: 18,
    },
  ];

  return sectorDefs.map((s, idx) => {
    if (s.sector === "CENTER") {
      return {
        id: `reg-${s.sector}`,
        sector: s.sector,
        label: s.label,
        bearingDeg: 0,
        distanceKm: 0,
        lat: s.lat,
        lon: s.lon,
        locationName: `${station.icao} · ${station.city}`,
        flightCategory: centerReport.flightCategory,
        tempC: centerReport.tempC,
        dewpointC: centerReport.dewpointC,
        windDir: centerReport.windDir,
        windSpeedKt: centerReport.windSpeedKt,
        visibilityMeters: centerReport.visibilityMeters,
        qnhHpa: centerReport.qnhHpa,
        cloudCoverPct: centerReport.cloudCoverPct ?? 25,
        cloudCoverage: centerReport.cloudCoverage ?? "FEW",
        wxPhenomena: centerReport.wxPhenomena,
        wmoCode: centerReport.wmoCode ?? 0,
        metar: centerReport.metar,
      };
    }

    const tempC = Math.round((centerReport.tempC + s.deltaTemp) * 10) / 10;
    const dewpointC = Math.round((centerReport.dewpointC + s.deltaTemp * 0.7) * 10) / 10;
    const windSpeedKt = Math.max(3, centerReport.windSpeedKt + s.deltaWindKt);
    const windDir = ((centerReport.windDir + idx * 10) % 360) || 360;
    const cloudCoverPct = Math.min(
      100,
      Math.max(0, (centerReport.cloudCoverPct ?? 30) + s.deltaCloud),
    );
    const wmoCode =
      cloudCoverPct >= 85
        ? 61
        : cloudCoverPct <= 25
          ? 0
          : (centerReport.wmoCode ?? 0);
    const visibilityMeters =
      wmoCode >= 61
        ? Math.max(3500, centerReport.visibilityMeters - 2500)
        : Math.min(9999, centerReport.visibilityMeters);
    const qnhHpa = centerReport.qnhHpa + (idx % 2 === 0 ? 1 : -1);

    const sectorReport = buildMetarAndTaf({
      icao: `${station.icao.slice(0, 2)}${s.sector.slice(0, 2)}`,
      stationName: s.label,
      city: station.city,
      lat: s.lat,
      lon: s.lon,
      windDir,
      windSpeedKt,
      visibilityMeters,
      cloudCoverPct,
      tempC,
      dewpointC,
      qnhHpa,
      wmoCode,
    });

    return {
      id: `reg-${s.sector}`,
      sector: s.sector,
      label: s.label,
      bearingDeg: s.bearingDeg,
      distanceKm: s.distanceKm,
      lat: s.lat,
      lon: s.lon,
      locationName: `${s.lat.toFixed(2)}°N, ${s.lon.toFixed(2)}°E`,
      flightCategory: sectorReport.flightCategory,
      tempC,
      dewpointC,
      windDir: sectorReport.windDir,
      windSpeedKt: sectorReport.windSpeedKt,
      visibilityMeters: sectorReport.visibilityMeters,
      qnhHpa: sectorReport.qnhHpa,
      cloudCoverPct,
      cloudCoverage: sectorReport.cloudCoverage ?? "SCT",
      wxPhenomena: sectorReport.wxPhenomena,
      wmoCode,
      metar: sectorReport.metar,
    };
  });
}

export function buildInitialWeatherBoard(icaoOrCity = "VIDP"): ComprehensiveWeatherBoardData {
  const station = resolveAerodrome(icaoOrCity);
  const localHour24 = computeLocalHourAtLon(station.lon);
  const isDaytime = localHour24 >= 6 && localHour24 < 19;
  const current = buildFallbackWeather(station.icao);
  current.city = station.city;
  current.lat = station.lat;
  current.lon = station.lon;
  current.isDay = isDaytime;
  const aeroMetrics = computeAeronauticalMetrics(current, station);
  const timeline10Days = buildFallback10DayTimeline(station, current);
  const regional100Km = buildRegional100KmRing(station, current);

  return {
    station,
    current,
    aeroMetrics,
    timeline10Days,
    regional100Km,
    indianTimestamp: formatIndianDateTime(new Date()),
    localHour24,
    isDaytime,
    source: "fallback",
  };
}

export async function fetchLiveAerodromeWeather(
  icaoRaw: string,
): Promise<{ report: FlightWeatherAttachment; station: AerodromeInfo; source: "open-meteo" | "fallback" }> {
  const board = await fetchComprehensiveWeatherBoard({ icaoOrCity: icaoRaw });
  return {
    report: board.current,
    station: board.station,
    source: board.source,
  };
}

export async function fetchComprehensiveWeatherBoard(params: {
  icaoOrCity?: string;
  lat?: number;
  lon?: number;
  customCity?: string;
  customState?: string;
  customCountry?: string;
}): Promise<ComprehensiveWeatherBoardData> {
  let station: AerodromeInfo;
  if (
    typeof params.lat === "number" &&
    typeof params.lon === "number" &&
    !Number.isNaN(params.lat) &&
    !Number.isNaN(params.lon)
  ) {
    station = resolveCoordinatesToStation(
      params.lat,
      params.lon,
      params.customCity,
      undefined,
      params.customState,
      params.customCountry,
    );
  } else if (params.icaoOrCity) {
    const raw = params.icaoOrCity.trim();
    if (raw.length > 4 || !AERODROME_CATALOGUE[raw.toUpperCase()]) {
      station = await searchCityWeatherLocation(raw);
    } else {
      station = resolveAerodrome(raw);
    }
  } else {
    station = AERODROME_CATALOGUE.VIDP!;
  }

  const localHour24 = computeLocalHourAtLon(station.lon);
  const defaultIsDay = localHour24 >= 6 && localHour24 < 19;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&current=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,surface_pressure,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,visibility,weather_code,is_day&hourly=wind_speed_10m,wind_direction_10m,cloud_cover,visibility,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&wind_speed_unit=kn&timezone=auto&past_days=2&forecast_days=8`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        dew_point_2m?: number;
        precipitation?: number;
        pressure_msl?: number;
        surface_pressure?: number;
        wind_speed_10m?: number;
        wind_direction_10m?: number;
        wind_gusts_10m?: number;
        cloud_cover?: number;
        visibility?: number;
        weather_code?: number;
        is_day?: number;
      };
      hourly?: {
        wind_speed_10m?: number[];
        wind_direction_10m?: number[];
        cloud_cover?: number[];
        visibility?: number[];
        weather_code?: number[];
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_sum?: number[];
        wind_speed_10m_max?: number[];
        wind_gusts_10m_max?: number[];
        wind_direction_10m_dominant?: number[];
      };
    };

    const cur = json.current;
    if (!cur) throw new Error("Missing current weather block");

    const isDaytime = cur.is_day !== undefined ? cur.is_day === 1 : defaultIsDay;
    const fIdx = 54;
    const current = buildMetarAndTaf({
      icao: station.icao,
      stationName: `${station.name} (${station.city})`,
      city: station.city,
      lat: station.lat,
      lon: station.lon,
      windDir: cur.wind_direction_10m ?? 250,
      windSpeedKt: cur.wind_speed_10m ?? 10,
      windGustKt: cur.wind_gusts_10m,
      visibilityMeters: cur.visibility ?? 9999,
      cloudCoverPct: cur.cloud_cover ?? 25,
      tempC: cur.temperature_2m ?? 24,
      dewpointC: cur.dew_point_2m ?? 16,
      qnhHpa: cur.pressure_msl ?? cur.surface_pressure ?? 1013,
      wmoCode: cur.weather_code ?? 0,
      humidityPct: cur.relative_humidity_2m,
      precipMm: cur.precipitation ?? 0,
      isDay: isDaytime,
      forecastWindDir: json.hourly?.wind_direction_10m?.[fIdx],
      forecastWindSpeedKt: json.hourly?.wind_speed_10m?.[fIdx],
      forecastCloudCoverPct: json.hourly?.cloud_cover?.[fIdx],
      forecastWmoCode: json.hourly?.weather_code?.[fIdx],
    });

    const aeroMetrics = computeAeronauticalMetrics(current, station);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let timeline10Days: DailyWeatherPoint[] = [];
    if (json.daily?.time && json.daily.time.length >= 9) {
      timeline10Days = json.daily.time.slice(0, 10).map((dateStr, idx) => {
        const offsetDays = idx - 2;
        const isToday = offsetDays === 0;
        const isPast = offsetDays < 0;
        const tMax = json.daily?.temperature_2m_max?.[idx] ?? current.tempC + 3;
        const tMin = json.daily?.temperature_2m_min?.[idx] ?? current.tempC - 3;
        const tMean = isToday ? current.tempC : Math.round(((tMax + tMin) / 2) * 10) / 10;
        const wmo = isToday ? (current.wmoCode ?? 0) : (json.daily?.weather_code?.[idx] ?? 0);
        const wSpd = isToday
          ? current.windSpeedKt
          : Math.round(json.daily?.wind_speed_10m_max?.[idx] ?? current.windSpeedKt);
        const wGust = isToday
          ? current.windGustKt
          : json.daily?.wind_gusts_10m_max?.[idx];
        const wDir = isToday
          ? current.windDir
          : (json.daily?.wind_direction_10m_dominant?.[idx] ?? current.windDir);
        const precip = json.daily?.precipitation_sum?.[idx] ?? 0;
        const cloudPct = isToday
          ? (current.cloudCoverPct ?? 25)
          : wmo >= 61
            ? 88
            : wmo >= 3
              ? 70
              : wmo === 2
                ? 45
                : wmo === 1
                  ? 20
                  : 8;
        const visM = isToday
          ? current.visibilityMeters
          : wmo >= 63
            ? 4000
            : wmo >= 51
              ? 6500
              : 9999;

        const dObj = new Date(`${dateStr}T12:00:00Z`);
        const dayReport = isToday
          ? current
          : buildMetarAndTaf({
              icao: station.icao,
              stationName: `${station.name} (${station.city})`,
              city: station.city,
              lat: station.lat,
              lon: station.lon,
              windDir: wDir,
              windSpeedKt: wSpd,
              windGustKt: wGust,
              visibilityMeters: visM,
              cloudCoverPct: cloudPct,
              tempC: tMean,
              dewpointC: Math.round((tMean - 5) * 10) / 10,
              qnhHpa: current.qnhHpa,
              wmoCode: wmo,
              precipMm: precip,
              isDay: isDaytime,
              now: dObj,
            });

        const relativeLabel =
          offsetDays === -2
            ? "2 Days Ago"
            : offsetDays === -1
              ? "Yesterday"
              : offsetDays === 0
                ? "Today (Live)"
                : offsetDays === 1
                  ? "Tomorrow"
                  : `+${offsetDays} Days`;

        return {
          date: dateStr,
          indianDate: formatIndianDateShort(dateStr),
          dayName: dayNames[dObj.getUTCDay()] ?? "Day",
          relativeLabel,
          offsetDays,
          isPast,
          isToday,
          tempMaxC: Math.round(tMax * 10) / 10,
          tempMinC: Math.round(tMin * 10) / 10,
          tempMeanC: tMean,
          dewpointC: dayReport.dewpointC,
          windSpeedKt: wSpd,
          windGustKt: dayReport.windGustKt,
          windDir: wDir,
          precipMm: Math.round(precip * 10) / 10,
          humidityPct: dayReport.humidityPct ?? 65,
          cloudCoverPct: cloudPct,
          visibilityMeters: visM,
          qnhHpa: dayReport.qnhHpa,
          wmoCode: wmo,
          flightCategory: dayReport.flightCategory,
          wxPhenomena: dayReport.wxPhenomena,
          report: dayReport,
        };
      });
    } else {
      timeline10Days = buildFallback10DayTimeline(station, current);
    }

    const regional100Km = buildRegional100KmRing(station, current);

    return {
      station,
      current,
      aeroMetrics,
      timeline10Days,
      regional100Km,
      indianTimestamp: formatIndianDateTime(new Date()),
      localHour24,
      isDaytime,
      source: "open-meteo",
    };
  } catch {
    const fallbackCurrent = buildFallbackWeather(station.icao);
    fallbackCurrent.city = station.city;
    fallbackCurrent.lat = station.lat;
    fallbackCurrent.lon = station.lon;
    fallbackCurrent.isDay = defaultIsDay;
    const aeroMetrics = computeAeronauticalMetrics(fallbackCurrent, station);
    const timeline10Days = buildFallback10DayTimeline(station, fallbackCurrent);
    const regional100Km = buildRegional100KmRing(station, fallbackCurrent);

    return {
      station,
      current: fallbackCurrent,
      aeroMetrics,
      timeline10Days,
      regional100Km,
      indianTimestamp: formatIndianDateTime(new Date()),
      localHour24,
      isDaytime: defaultIsDay,
      source: "fallback",
    };
  }
}

export function extractIcaoFromRoute(route?: string): string {
  if (!route) return "VIDP";
  const match = route.toUpperCase().match(/\b([A-Z]{4})\b/);
  return match?.[1] ?? "VIDP";
}

export function buildWeatherForBookingDate(
  routeOrIcao: string | undefined,
  targetDateIso: string,
): FlightWeatherAttachment {
  const icao = extractIcaoFromRoute(routeOrIcao);
  const targetDate = new Date(targetDateIso);
  const validDate = Number.isNaN(targetDate.getTime()) ? new Date() : targetDate;
  return buildFallbackWeather(icao, validDate);
}

export function enrichBookingWithWeather(
  booking: Booking,
  previousBooking?: Booking,
): Booking {
  const icao = extractIcaoFromRoute(booking.route);
  const now = new Date();

  const weatherCurrent =
    booking.weatherCurrent ??
    previousBooking?.weatherCurrent ??
    buildFallbackWeather(icao, now);

  const weatherForecast =
    booking.weatherForecast ??
    previousBooking?.weatherForecast ??
    buildWeatherForBookingDate(icao, booking.start);

  const weatherCompleted =
    booking.status === "completed"
      ? (booking.weatherCompleted ??
        previousBooking?.weatherCompleted ??
        buildWeatherForBookingDate(icao, now.toISOString()))
      : (booking.weatherCompleted ?? previousBooking?.weatherCompleted);

  return {
    ...booking,
    weatherCurrent,
    weatherForecast,
    ...(weatherCompleted ? { weatherCompleted } : {}),
  };
}

export function formatRemarksWithWeather(
  existingRemarks: string | undefined,
  wx: FlightWeatherAttachment,
): string {
  const cleaned = (existingRemarks ?? "")
    .replace(/\s*\[WX:[^\]]+\]/g, "")
    .trim();
  const wxTag = `[WX: ${wx.flightCategory} · ${wx.metar}]`;
  return cleaned ? `${cleaned} ${wxTag}` : wxTag;
}

export function extractFlightWeather(flight: Flight): {
  category: FlightRulesCategory;
  metar: string;
  taf?: string;
  icao: string;
  summary: string;
} | null {
  if (flight.weatherReport) {
    const w = flight.weatherReport;
    const windStr = `${String(w.windDir).padStart(3, "0")}°/${w.windSpeedKt}kt`;
    return {
      category: w.flightCategory,
      metar: w.metar,
      taf: w.taf,
      icao: w.icao,
      summary: `${w.flightCategory} · ${windStr} · Q${w.qnhHpa}`,
    };
  }
  if (flight.remarks) {
    const match = flight.remarks.match(/\[WX:\s*(VFR|MVFR|IFR|LIFR)\s*·\s*([^\]]+)\]/);
    if (match) {
      const category = match[1] as FlightRulesCategory;
      const metar = match[2]!.trim();
      const qnhMatch = metar.match(/Q(\d{4})/);
      const windMatch = metar.match(/(\d{3})(\d{2}(?:G\d{2})?)KT/);
      const windPart = windMatch ? `${windMatch[1]}°/${windMatch[2]}kt` : "";
      const qnhPart = qnhMatch ? `Q${qnhMatch[1]}` : "";
      return {
        category,
        metar,
        icao: flight.fromIcao || "VIDP",
        summary: [category, windPart, qnhPart].filter(Boolean).join(" · "),
      };
    }
  }
  return null;
}
