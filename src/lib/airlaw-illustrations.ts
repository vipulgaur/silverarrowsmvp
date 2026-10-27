import type { FigureAsset, FigurePart } from "@/lib/learning-illustrations";

function defaultParts(
  prefix: string,
  items: Array<[number, number, string, string]>,
): FigurePart[] {
  return items.map(([x, y, label, detail], i) => ({
    id: `${prefix}-p${i + 1}`,
    number: i + 1,
    x,
    y,
    label,
    detail,
  }));
}

export const airlawFigureAssets: Record<string, FigureAsset> = {
  "fig-02-01": {
    src: "/assets/learning/airlaw/fig-02-01.png",
    alt: "Unnumbered ICAO multilingual emblem",
    parts: defaultParts("fig-02-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-02": {
    src: "/assets/learning/airlaw/fig-02-02.png",
    alt: "Unnumbered ICAO governance chart",
    parts: defaultParts("fig-02-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-03": {
    src: "/assets/learning/airlaw/fig-02-03.png",
    alt: "Figure 2.1 IATA organization chart",
    parts: defaultParts("fig-02-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-04": {
    src: "/assets/learning/airlaw/fig-02-04.png",
    alt: "Unnumbered IATA wordmark style illustration",
    parts: defaultParts("fig-02-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-05": {
    src: "/assets/learning/airlaw/fig-02-05.png",
    alt: "Unnumbered ECAC / CEAC visual",
    parts: defaultParts("fig-02-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-06": {
    src: "/assets/learning/airlaw/fig-02-06.png",
    alt: "Unnumbered EASA visual, three stylized birds",
    parts: defaultParts("fig-02-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-07": {
    src: "/assets/learning/airlaw/fig-02-07.png",
    alt: "Unnumbered JAA Europe circular badge",
    parts: defaultParts("fig-02-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-08": {
    src: "/assets/learning/airlaw/fig-02-08.png",
    alt: "Unnumbered EUROCONTROL visual",
    parts: defaultParts("fig-02-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-09": {
    src: "/assets/learning/airlaw/fig-02-09.png",
    alt: "Unnumbered World Trade Organization visual",
    parts: defaultParts("fig-02-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-02-10": {
    src: "/assets/learning/airlaw/fig-02-10.png",
    alt: "Figure 2.2 WTO structure",
    parts: defaultParts("fig-02-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-03-01": {
    src: "/assets/learning/airlaw/fig-03-01.png",
    alt: "Figure 3.1 Certificate of Airworthiness",
    parts: defaultParts("fig-03-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-04-01": {
    src: "/assets/learning/airlaw/fig-04-01.png",
    alt: "Figure 4.1 Nationality Mark and Registration Mark on an Aircraft",
    parts: defaultParts("fig-04-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-04-02": {
    src: "/assets/learning/airlaw/fig-04-02.png",
    alt: "Figure 4.2 Minimum Size of Registration Characters",
    parts: defaultParts("fig-04-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-04-03": {
    src: "/assets/learning/airlaw/fig-04-03.png",
    alt: "Figure 4.3 Classification of Aircraft",
    parts: defaultParts("fig-04-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-01": {
    src: "/assets/learning/airlaw/fig-06-01.png",
    alt: "Figure 6.1 VMC minima in airspace classes A, B, C, D and E",
    parts: defaultParts("fig-06-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-02": {
    src: "/assets/learning/airlaw/fig-06-02.png",
    alt: "Figure 6.2 VMC minima in classes F and G",
    parts: defaultParts("fig-06-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-03": {
    src: "/assets/learning/airlaw/fig-06-03.png",
    alt: "Figure 6.3 minimum safe height over a built up area",
    parts: defaultParts("fig-06-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-04": {
    src: "/assets/learning/airlaw/fig-06-04.png",
    alt: "Figure 6.4 cruising level versus altitude",
    parts: defaultParts("fig-06-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-05": {
    src: "/assets/learning/airlaw/fig-06-05.png",
    alt: "Figure 6.5 head on meeting aeroplane and hot air balloon",
    parts: defaultParts("fig-06-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-06": {
    src: "/assets/learning/airlaw/fig-06-06.png",
    alt: "Figure 6.6 both aircraft turn right",
    parts: defaultParts("fig-06-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-07": {
    src: "/assets/learning/airlaw/fig-06-07.png",
    alt: "Figure 6.7 powered aircraft gives way to non powered",
    parts: defaultParts("fig-06-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-08": {
    src: "/assets/learning/airlaw/fig-06-08.png",
    alt: "Figure 6.8 right of way of towing aircraft",
    parts: defaultParts("fig-06-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-09": {
    src: "/assets/learning/airlaw/fig-06-09.png",
    alt: "Figure 6.9 70 degree overtaking sector",
    parts: defaultParts("fig-06-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-10": {
    src: "/assets/learning/airlaw/fig-06-10.png",
    alt: "Figure 6.10 aircraft anti collision and navigation lights",
    parts: defaultParts("fig-06-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-11": {
    src: "/assets/learning/airlaw/fig-06-11.png",
    alt: "Figure 6.11 aerodrome traffic zone and circuit",
    parts: defaultParts("fig-06-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-12": {
    src: "/assets/learning/airlaw/fig-06-12.png",
    alt: "Figure 6.12 IFR and VFR magnetic track levels through FL290",
    parts: defaultParts("fig-06-12", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-13": {
    src: "/assets/learning/airlaw/fig-06-13.png",
    alt: "Figure 6.13 IFR and VFR levels above FL290",
    parts: defaultParts("fig-06-13", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-14": {
    src: "/assets/learning/airlaw/fig-06-14.png",
    alt: "Figure 6.14 RVSM flight level structure",
    parts: defaultParts("fig-06-14", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-15": {
    src: "/assets/learning/airlaw/fig-06-15.png",
    alt: "Figure 6.15 Danger, Restricted and Prohibited Areas",
    parts: defaultParts("fig-06-15", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-16": {
    src: "/assets/learning/airlaw/fig-06-16.png",
    alt: "Figure 6.16 red and green incursions warning",
    parts: defaultParts("fig-06-16", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-17": {
    src: "/assets/learning/airlaw/fig-06-17.png",
    alt: "Figure 6.17 tower light signals for aircraft in flight and on the ground",
    parts: defaultParts("fig-06-17", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-18": {
    src: "/assets/learning/airlaw/fig-06-18.png",
    alt: "Unlabelled aerodrome signal white landing direction T",
    parts: defaultParts("fig-06-18", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-19": {
    src: "/assets/learning/airlaw/fig-06-19.png",
    alt: "Unlabelled aerodrome signal white disc with T",
    parts: defaultParts("fig-06-19", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-20": {
    src: "/assets/learning/airlaw/fig-06-20.png",
    alt: "Unlabelled aerodrome signal plain white dumbbell",
    parts: defaultParts("fig-06-20", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-21": {
    src: "/assets/learning/airlaw/fig-06-21.png",
    alt: "Unlabelled aerodrome signal white dumbbell with black stripes",
    parts: defaultParts("fig-06-21", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-22": {
    src: "/assets/learning/airlaw/fig-06-22.png",
    alt: "Unlabelled aerodrome signal right hand circuit arrow",
    parts: defaultParts("fig-06-22", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-23": {
    src: "/assets/learning/airlaw/fig-06-23.png",
    alt: "Unlabelled aerodrome signal poor manoeuvring area",
    parts: defaultParts("fig-06-23", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-24": {
    src: "/assets/learning/airlaw/fig-06-24.png",
    alt: "Unlabelled aerodrome signal closed aerodrome",
    parts: defaultParts("fig-06-24", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-25": {
    src: "/assets/learning/airlaw/fig-06-25.png",
    alt: "Unlabelled aerodrome signal helicopter H",
    parts: defaultParts("fig-06-25", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-26": {
    src: "/assets/learning/airlaw/fig-06-26.png",
    alt: "Unlabelled aerodrome signal red L on white dumbbell",
    parts: defaultParts("fig-06-26", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-27": {
    src: "/assets/learning/airlaw/fig-06-27.png",
    alt: "Unlabelled aerodrome signal white double cross",
    parts: defaultParts("fig-06-27", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-28": {
    src: "/assets/learning/airlaw/fig-06-28.png",
    alt: "Unlabelled aerodrome signal closed section crosses",
    parts: defaultParts("fig-06-28", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-29": {
    src: "/assets/learning/airlaw/fig-06-29.png",
    alt: "Unlabelled aerodrome signal Pattern A holding position",
    parts: defaultParts("fig-06-29", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-30": {
    src: "/assets/learning/airlaw/fig-06-30.png",
    alt: "Unlabelled aerodrome signal Pattern B holding position",
    parts: defaultParts("fig-06-30", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-31": {
    src: "/assets/learning/airlaw/fig-06-31.png",
    alt: "Unlabelled aerodrome signal visiting pilot report at C",
    parts: defaultParts("fig-06-31", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-32": {
    src: "/assets/learning/airlaw/fig-06-32.png",
    alt: "Unlabelled aerodrome signal yellow St George's cross",
    parts: defaultParts("fig-06-32", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-33": {
    src: "/assets/learning/airlaw/fig-06-33.png",
    alt: "Unlabelled three panel signals mast display",
    parts: defaultParts("fig-06-33", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-34": {
    src: "/assets/learning/airlaw/fig-06-34.png",
    alt: "Unlabelled QDM board example",
    parts: defaultParts("fig-06-34", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-35": {
    src: "/assets/learning/airlaw/fig-06-35.png",
    alt: "Unlabelled boundary markers",
    parts: defaultParts("fig-06-35", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-36": {
    src: "/assets/learning/airlaw/fig-06-36.png",
    alt: "Unlabelled three panel windsock speed illustration",
    parts: defaultParts("fig-06-36", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-37": {
    src: "/assets/learning/airlaw/fig-06-37.png",
    alt: "Unlabelled marshalling figure Wingwalker/guide",
    parts: defaultParts("fig-06-37", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-38": {
    src: "/assets/learning/airlaw/fig-06-38.png",
    alt: "Unlabelled marshalling figure Identify gate",
    parts: defaultParts("fig-06-38", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-39": {
    src: "/assets/learning/airlaw/fig-06-39.png",
    alt: "Unlabelled marshalling figure Proceed to next signalman",
    parts: defaultParts("fig-06-39", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-40": {
    src: "/assets/learning/airlaw/fig-06-40.png",
    alt: "Unlabelled marshalling figure Straight ahead",
    parts: defaultParts("fig-06-40", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-41": {
    src: "/assets/learning/airlaw/fig-06-41.png",
    alt: "Unlabelled marshalling figure Turn left",
    parts: defaultParts("fig-06-41", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-42": {
    src: "/assets/learning/airlaw/fig-06-42.png",
    alt: "Unlabelled marshalling figure Turn right",
    parts: defaultParts("fig-06-42", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-43": {
    src: "/assets/learning/airlaw/fig-06-43.png",
    alt: "Unlabelled marshalling figure Normal stop",
    parts: defaultParts("fig-06-43", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-44": {
    src: "/assets/learning/airlaw/fig-06-44.png",
    alt: "Unlabelled marshalling figure Emergency stop",
    parts: defaultParts("fig-06-44", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-45": {
    src: "/assets/learning/airlaw/fig-06-45.png",
    alt: "Unlabelled marshalling figure Set brakes",
    parts: defaultParts("fig-06-45", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-46": {
    src: "/assets/learning/airlaw/fig-06-46.png",
    alt: "Unlabelled marshalling figure Release brakes",
    parts: defaultParts("fig-06-46", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-47": {
    src: "/assets/learning/airlaw/fig-06-47.png",
    alt: "Unlabelled marshalling figure Chocks inserted",
    parts: defaultParts("fig-06-47", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-48": {
    src: "/assets/learning/airlaw/fig-06-48.png",
    alt: "Unlabelled marshalling figure Chocks removed",
    parts: defaultParts("fig-06-48", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-49": {
    src: "/assets/learning/airlaw/fig-06-49.png",
    alt: "Unlabelled marshalling figure Start engine s",
    parts: defaultParts("fig-06-49", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-50": {
    src: "/assets/learning/airlaw/fig-06-50.png",
    alt: "Unlabelled marshalling figure Cut engines",
    parts: defaultParts("fig-06-50", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-51": {
    src: "/assets/learning/airlaw/fig-06-51.png",
    alt: "Unlabelled marshalling figure Slow down",
    parts: defaultParts("fig-06-51", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-52": {
    src: "/assets/learning/airlaw/fig-06-52.png",
    alt: "Unlabelled marshalling figure Slow down indicated engine s",
    parts: defaultParts("fig-06-52", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-53": {
    src: "/assets/learning/airlaw/fig-06-53.png",
    alt: "Unlabelled marshalling figure Backing turn, tail to starboard",
    parts: defaultParts("fig-06-53", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-54": {
    src: "/assets/learning/airlaw/fig-06-54.png",
    alt: "Unlabelled marshalling figure Backing turn, tail to port",
    parts: defaultParts("fig-06-54", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-55": {
    src: "/assets/learning/airlaw/fig-06-55.png",
    alt: "Unlabelled marshalling figure Affirmative/all clear",
    parts: defaultParts("fig-06-55", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-56": {
    src: "/assets/learning/airlaw/fig-06-56.png",
    alt: "Unlabelled marshalling figure Fire",
    parts: defaultParts("fig-06-56", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-57": {
    src: "/assets/learning/airlaw/fig-06-57.png",
    alt: "Unlabelled marshalling figure Hold position/stand by",
    parts: defaultParts("fig-06-57", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-58": {
    src: "/assets/learning/airlaw/fig-06-58.png",
    alt: "Unlabelled marshalling figure Dispatch aircraft",
    parts: defaultParts("fig-06-58", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-59": {
    src: "/assets/learning/airlaw/fig-06-59.png",
    alt: "Unlabelled marshalling figure Do not touch controls",
    parts: defaultParts("fig-06-59", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-60": {
    src: "/assets/learning/airlaw/fig-06-60.png",
    alt: "Unlabelled marshalling figure Connect ground power",
    parts: defaultParts("fig-06-60", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-61": {
    src: "/assets/learning/airlaw/fig-06-61.png",
    alt: "Unlabelled marshalling figure Disconnect power",
    parts: defaultParts("fig-06-61", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-62": {
    src: "/assets/learning/airlaw/fig-06-62.png",
    alt: "Unlabelled marshalling figure Negative",
    parts: defaultParts("fig-06-62", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-63": {
    src: "/assets/learning/airlaw/fig-06-63.png",
    alt: "Unlabelled marshalling figure Establish interphone communications",
    parts: defaultParts("fig-06-63", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-64": {
    src: "/assets/learning/airlaw/fig-06-64.png",
    alt: "Unlabelled marshalling figure Open/close stairs",
    parts: defaultParts("fig-06-64", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-65": {
    src: "/assets/learning/airlaw/fig-06-65.png",
    alt: "Unlabelled flight deck hand signal Brakes engaged",
    parts: defaultParts("fig-06-65", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-66": {
    src: "/assets/learning/airlaw/fig-06-66.png",
    alt: "Unlabelled flight deck hand signal Brakes released",
    parts: defaultParts("fig-06-66", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-67": {
    src: "/assets/learning/airlaw/fig-06-67.png",
    alt: "Unlabelled flight deck hand signal Insert chocks",
    parts: defaultParts("fig-06-67", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-68": {
    src: "/assets/learning/airlaw/fig-06-68.png",
    alt: "Unlabelled flight deck hand signal Ready to start engine",
    parts: defaultParts("fig-06-68", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-06-69": {
    src: "/assets/learning/airlaw/fig-06-69.png",
    alt: "Unlabelled flight deck hand signal Remove chocks",
    parts: defaultParts("fig-06-69", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-01": {
    src: "/assets/learning/airlaw/fig-07-01.png",
    alt: "Figure 7.1 Obstacle Clearance",
    parts: defaultParts("fig-07-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-02": {
    src: "/assets/learning/airlaw/fig-07-02.png",
    alt: "Figure 7.2 Obstacle Clearance Along an Instrument Flight Path",
    parts: defaultParts("fig-07-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-03": {
    src: "/assets/learning/airlaw/fig-07-03.png",
    alt: "Figure 7.3 Procedure Design Gradient",
    parts: defaultParts("fig-07-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-04": {
    src: "/assets/learning/airlaw/fig-07-04.png",
    alt: "Figure 7.4 Rate One Turns and Departure Speed",
    parts: defaultParts("fig-07-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-05": {
    src: "/assets/learning/airlaw/fig-07-05.png",
    alt: "Figure 7.5 Straight Departure",
    parts: defaultParts("fig-07-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-06": {
    src: "/assets/learning/airlaw/fig-07-06.png",
    alt: "Figure 7.6 Turning Departure",
    parts: defaultParts("fig-07-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-07": {
    src: "/assets/learning/airlaw/fig-07-07.png",
    alt: "Figure 7.7 Aeroplane Categories for Departure Procedures",
    parts: defaultParts("fig-07-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-08": {
    src: "/assets/learning/airlaw/fig-07-08.png",
    alt: "Figure 7.8 London Heathrow Standard Departure Chart",
    parts: defaultParts("fig-07-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-09": {
    src: "/assets/learning/airlaw/fig-07-09.png",
    alt: "Figure 7.9 Omni directional Departure",
    parts: defaultParts("fig-07-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-10": {
    src: "/assets/learning/airlaw/fig-07-10.png",
    alt: "Figure 7.10 Anatomy of a Compton SID Plate",
    parts: defaultParts("fig-07-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-07-11": {
    src: "/assets/learning/airlaw/fig-07-11.png",
    alt: "Figure 7.11 London Luton Trial RNAV P RNAV SID Chart",
    parts: defaultParts("fig-07-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-01": {
    src: "/assets/learning/airlaw/fig-08-01.png",
    alt: "Figure 8.1 Aircraft categories for approach procedures",
    parts: defaultParts("fig-08-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-02": {
    src: "/assets/learning/airlaw/fig-08-02.png",
    alt: "Figure 8.2",
    parts: defaultParts("fig-08-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-03": {
    src: "/assets/learning/airlaw/fig-08-03.png",
    alt: "Figure 8.3 Procedure segments",
    parts: defaultParts("fig-08-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-04": {
    src: "/assets/learning/airlaw/fig-08-04.png",
    alt: "Figure 8.4 Characteristics of segments",
    parts: defaultParts("fig-08-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-05": {
    src: "/assets/learning/airlaw/fig-08-05.png",
    alt: "Figure 8.5",
    parts: defaultParts("fig-08-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-06": {
    src: "/assets/learning/airlaw/fig-08-06.png",
    alt: "Figure 8.6",
    parts: defaultParts("fig-08-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-07": {
    src: "/assets/learning/airlaw/fig-08-07.png",
    alt: "Figure 8.7",
    parts: defaultParts("fig-08-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-08": {
    src: "/assets/learning/airlaw/fig-08-08.png",
    alt: "Figure 8.8 IAF to IF precision approach",
    parts: defaultParts("fig-08-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-09": {
    src: "/assets/learning/airlaw/fig-08-09.png",
    alt: "Figure 8.9 IAF to IF non precision approach",
    parts: defaultParts("fig-08-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-10": {
    src: "/assets/learning/airlaw/fig-08-10.png",
    alt: "Figure 8.10 IAF to IF DR segment",
    parts: defaultParts("fig-08-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-11": {
    src: "/assets/learning/airlaw/fig-08-11.png",
    alt: "Figure 8.11 Step down fix",
    parts: defaultParts("fig-08-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-12": {
    src: "/assets/learning/airlaw/fig-08-12.png",
    alt: "Figure 8.12 ICAO system minima for ILS",
    parts: defaultParts("fig-08-12", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-13": {
    src: "/assets/learning/airlaw/fig-08-13.png",
    alt: "Figure 8.13 Method of determining DA/H for precision approaches",
    parts: defaultParts("fig-08-13", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-14": {
    src: "/assets/learning/airlaw/fig-08-14.png",
    alt: "Figure 8.14",
    parts: defaultParts("fig-08-14", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-15": {
    src: "/assets/learning/airlaw/fig-08-15.png",
    alt: "Figure 8.15 Method of determining MDA/MDH for non precision approaches",
    parts: defaultParts("fig-08-15", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-16": {
    src: "/assets/learning/airlaw/fig-08-16.png",
    alt: "Figure 8.16 Method of determining MDA/MDH for circling approaches",
    parts: defaultParts("fig-08-16", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-17": {
    src: "/assets/learning/airlaw/fig-08-17.png",
    alt: "Figure 8.17 Track reversal procedure turn",
    parts: defaultParts("fig-08-17", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-18": {
    src: "/assets/learning/airlaw/fig-08-18.png",
    alt: "Figure 8.18 45°/180° procedure turn",
    parts: defaultParts("fig-08-18", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-19": {
    src: "/assets/learning/airlaw/fig-08-19.png",
    alt: "Figure 8.19 80°/260° procedure turn",
    parts: defaultParts("fig-08-19", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-20": {
    src: "/assets/learning/airlaw/fig-08-20.png",
    alt: "Figure 8.20 Procedure turn shown on an approach plate",
    parts: defaultParts("fig-08-20", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-21": {
    src: "/assets/learning/airlaw/fig-08-21.png",
    alt: "Figure 8.21 Base turn",
    parts: defaultParts("fig-08-21", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-22": {
    src: "/assets/learning/airlaw/fig-08-22.png",
    alt: "Figure 8.22 Base turn shown on an approach plate",
    parts: defaultParts("fig-08-22", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-23": {
    src: "/assets/learning/airlaw/fig-08-23.png",
    alt: "Figure 8.23 Racetrack procedure",
    parts: defaultParts("fig-08-23", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-24": {
    src: "/assets/learning/airlaw/fig-08-24.png",
    alt: "Figure 8.24 Racetrack shown on an approach plate",
    parts: defaultParts("fig-08-24", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-25": {
    src: "/assets/learning/airlaw/fig-08-25.png",
    alt: "Figure 8.25 Three phases of the missed approach",
    parts: defaultParts("fig-08-25", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-26": {
    src: "/assets/learning/airlaw/fig-08-26.png",
    alt: "Figure 8.26",
    parts: defaultParts("fig-08-26", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-27": {
    src: "/assets/learning/airlaw/fig-08-27.png",
    alt: "Figure 8.27",
    parts: defaultParts("fig-08-27", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-28": {
    src: "/assets/learning/airlaw/fig-08-28.png",
    alt: "Figure 8.28",
    parts: defaultParts("fig-08-28", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-08-29": {
    src: "/assets/learning/airlaw/fig-08-29.png",
    alt: "Figure 8.29",
    parts: defaultParts("fig-08-29", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-09-01": {
    src: "/assets/learning/airlaw/fig-09-01.png",
    alt: "Figure 9.1",
    parts: defaultParts("fig-09-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-09-02": {
    src: "/assets/learning/airlaw/fig-09-02.png",
    alt: "Figure 9.2",
    parts: defaultParts("fig-09-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-09-03": {
    src: "/assets/learning/airlaw/fig-09-03.png",
    alt: "Figure 9.3 OCA/H for visual manoeuvring Circling",
    parts: defaultParts("fig-09-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-01": {
    src: "/assets/learning/airlaw/fig-10-01.png",
    alt: "Figure 10.1 Holding pattern terminology",
    parts: defaultParts("fig-10-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-02": {
    src: "/assets/learning/airlaw/fig-10-02.png",
    alt: "Figure 10.2 Holding speeds",
    parts: defaultParts("fig-10-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-03": {
    src: "/assets/learning/airlaw/fig-10-03.png",
    alt: "Figure 10.3",
    parts: defaultParts("fig-10-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-04": {
    src: "/assets/learning/airlaw/fig-10-04.png",
    alt: "Figure 10.4",
    parts: defaultParts("fig-10-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-05": {
    src: "/assets/learning/airlaw/fig-10-05.png",
    alt: "Figure 10.5",
    parts: defaultParts("fig-10-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-06": {
    src: "/assets/learning/airlaw/fig-10-06.png",
    alt: "Figure 10.6",
    parts: defaultParts("fig-10-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-07": {
    src: "/assets/learning/airlaw/fig-10-07.png",
    alt: "Figure 10.7",
    parts: defaultParts("fig-10-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-10-08": {
    src: "/assets/learning/airlaw/fig-10-08.png",
    alt: "Figure 10.8",
    parts: defaultParts("fig-10-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-11-01": {
    src: "/assets/learning/airlaw/fig-11-01.png",
    alt: "Figure 11.1",
    parts: defaultParts("fig-11-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-11-02": {
    src: "/assets/learning/airlaw/fig-11-02.png",
    alt: "Figure 11.2 Transition altitude",
    parts: defaultParts("fig-11-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-11-03": {
    src: "/assets/learning/airlaw/fig-11-03.png",
    alt: "Figure 11.3 Transition level",
    parts: defaultParts("fig-11-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-11-04": {
    src: "/assets/learning/airlaw/fig-11-04.png",
    alt: "Figure 11.4 Transition layer",
    parts: defaultParts("fig-11-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-01": {
    src: "/assets/learning/airlaw/fig-12-01.png",
    alt: "Figure 12.1 Mode 1 Independent parallel approaches",
    parts: defaultParts("fig-12-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-02": {
    src: "/assets/learning/airlaw/fig-12-02.png",
    alt: "Figure 12.2 Mode 2 Dependent parallel approaches",
    parts: defaultParts("fig-12-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-03": {
    src: "/assets/learning/airlaw/fig-12-03.png",
    alt: "Figure 12.3 Mode 3 Simultaneous instrument departures",
    parts: defaultParts("fig-12-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-04": {
    src: "/assets/learning/airlaw/fig-12-04.png",
    alt: "Figure 12.4 Mode 4 Segregated departures/arrivals.",
    parts: defaultParts("fig-12-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-05": {
    src: "/assets/learning/airlaw/fig-12-05.png",
    alt: "Figure 12.5 No transgression zone",
    parts: defaultParts("fig-12-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-06": {
    src: "/assets/learning/airlaw/fig-12-06.png",
    alt: "Figure 12.6",
    parts: defaultParts("fig-12-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-12-07": {
    src: "/assets/learning/airlaw/fig-12-07.png",
    alt: "Figure 12.7",
    parts: defaultParts("fig-12-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-13-01": {
    src: "/assets/learning/airlaw/fig-13-01.png",
    alt: "Figure 13.1 SSR Transponder Control Panel",
    parts: defaultParts("fig-13-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-14-01": {
    src: "/assets/learning/airlaw/fig-14-01.png",
    alt: "Figure 14.1",
    parts: defaultParts("fig-14-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-14-02": {
    src: "/assets/learning/airlaw/fig-14-02.png",
    alt: "Figure 14.2",
    parts: defaultParts("fig-14-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-14-03": {
    src: "/assets/learning/airlaw/fig-14-03.png",
    alt: "Figure 14.3",
    parts: defaultParts("fig-14-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-14-04": {
    src: "/assets/learning/airlaw/fig-14-04.png",
    alt: "Figure 14.4",
    parts: defaultParts("fig-14-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-14-05": {
    src: "/assets/learning/airlaw/fig-14-05.png",
    alt: "Figure 14.5",
    parts: defaultParts("fig-14-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-15-01": {
    src: "/assets/learning/airlaw/fig-15-01.png",
    alt: "Figure 15.1 Volmet broadcasts",
    parts: defaultParts("fig-15-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-01": {
    src: "/assets/learning/airlaw/fig-16-01.png",
    alt: "Figure 16.1",
    parts: defaultParts("fig-16-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-02": {
    src: "/assets/learning/airlaw/fig-16-02.png",
    alt: "Figure 16.2",
    parts: defaultParts("fig-16-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-03": {
    src: "/assets/learning/airlaw/fig-16-03.png",
    alt: "Figure 16.3",
    parts: defaultParts("fig-16-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-04": {
    src: "/assets/learning/airlaw/fig-16-04.png",
    alt: "Figure 16.4",
    parts: defaultParts("fig-16-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-05": {
    src: "/assets/learning/airlaw/fig-16-05.png",
    alt: "Figure 16.5",
    parts: defaultParts("fig-16-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-06": {
    src: "/assets/learning/airlaw/fig-16-06.png",
    alt: "Figure 16.6",
    parts: defaultParts("fig-16-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-07": {
    src: "/assets/learning/airlaw/fig-16-07.png",
    alt: "Figure 16.7",
    parts: defaultParts("fig-16-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-08": {
    src: "/assets/learning/airlaw/fig-16-08.png",
    alt: "Figure 16.8",
    parts: defaultParts("fig-16-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-09": {
    src: "/assets/learning/airlaw/fig-16-09.png",
    alt: "Figure 16.9",
    parts: defaultParts("fig-16-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-10": {
    src: "/assets/learning/airlaw/fig-16-10.png",
    alt: "Figure 16.10",
    parts: defaultParts("fig-16-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-11": {
    src: "/assets/learning/airlaw/fig-16-11.png",
    alt: "Figure 16.11",
    parts: defaultParts("fig-16-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-12": {
    src: "/assets/learning/airlaw/fig-16-12.png",
    alt: "Figure 16.12",
    parts: defaultParts("fig-16-12", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-13": {
    src: "/assets/learning/airlaw/fig-16-13.png",
    alt: "Figure 16.13",
    parts: defaultParts("fig-16-13", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-14": {
    src: "/assets/learning/airlaw/fig-16-14.png",
    alt: "Figure 16.14",
    parts: defaultParts("fig-16-14", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-15": {
    src: "/assets/learning/airlaw/fig-16-15.png",
    alt: "Figure 16.15",
    parts: defaultParts("fig-16-15", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-16": {
    src: "/assets/learning/airlaw/fig-16-16.png",
    alt: "Figure 16.16",
    parts: defaultParts("fig-16-16", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-17": {
    src: "/assets/learning/airlaw/fig-16-17.png",
    alt: "Figure 16.17",
    parts: defaultParts("fig-16-17", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-18": {
    src: "/assets/learning/airlaw/fig-16-18.png",
    alt: "Figure 16.18",
    parts: defaultParts("fig-16-18", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-19": {
    src: "/assets/learning/airlaw/fig-16-19.png",
    alt: "Figure 16.19",
    parts: defaultParts("fig-16-19", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-20": {
    src: "/assets/learning/airlaw/fig-16-20.png",
    alt: "Figure 16.20",
    parts: defaultParts("fig-16-20", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-21": {
    src: "/assets/learning/airlaw/fig-16-21.png",
    alt: "Figure 16.21",
    parts: defaultParts("fig-16-21", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-22": {
    src: "/assets/learning/airlaw/fig-16-22.png",
    alt: "Figure 16.22",
    parts: defaultParts("fig-16-22", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-23": {
    src: "/assets/learning/airlaw/fig-16-23.png",
    alt: "Figure 16.23",
    parts: defaultParts("fig-16-23", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-16-24": {
    src: "/assets/learning/airlaw/fig-16-24.png",
    alt: "Figure 16.24",
    parts: defaultParts("fig-16-24", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-01": {
    src: "/assets/learning/airlaw/fig-17-01.png",
    alt: "Figure 17.1",
    parts: defaultParts("fig-17-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-02": {
    src: "/assets/learning/airlaw/fig-17-02.png",
    alt: "Figure 17.2",
    parts: defaultParts("fig-17-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-03": {
    src: "/assets/learning/airlaw/fig-17-03.png",
    alt: "Figure 17.3",
    parts: defaultParts("fig-17-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-04": {
    src: "/assets/learning/airlaw/fig-17-04.png",
    alt: "Figure 17.4",
    parts: defaultParts("fig-17-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-05": {
    src: "/assets/learning/airlaw/fig-17-05.png",
    alt: "Figure 17.5",
    parts: defaultParts("fig-17-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-17-06": {
    src: "/assets/learning/airlaw/fig-17-06.png",
    alt: "Figure 17.6",
    parts: defaultParts("fig-17-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-18-01": {
    src: "/assets/learning/airlaw/fig-18-01.png",
    alt: "Figure 18.1",
    parts: defaultParts("fig-18-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-18-02": {
    src: "/assets/learning/airlaw/fig-18-02.png",
    alt: "Figure 18.2",
    parts: defaultParts("fig-18-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-18-03": {
    src: "/assets/learning/airlaw/fig-18-03.png",
    alt: "Figure 18.3",
    parts: defaultParts("fig-18-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-18-04": {
    src: "/assets/learning/airlaw/fig-18-04.png",
    alt: "Figure 18.4",
    parts: defaultParts("fig-18-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-18-05": {
    src: "/assets/learning/airlaw/fig-18-05.png",
    alt: "Figure 18.5",
    parts: defaultParts("fig-18-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-01": {
    src: "/assets/learning/airlaw/fig-19-01.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-02": {
    src: "/assets/learning/airlaw/fig-19-02.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-03": {
    src: "/assets/learning/airlaw/fig-19-03.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-04": {
    src: "/assets/learning/airlaw/fig-19-04.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-05": {
    src: "/assets/learning/airlaw/fig-19-05.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-06": {
    src: "/assets/learning/airlaw/fig-19-06.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-07": {
    src: "/assets/learning/airlaw/fig-19-07.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-08": {
    src: "/assets/learning/airlaw/fig-19-08.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-09": {
    src: "/assets/learning/airlaw/fig-19-09.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-10": {
    src: "/assets/learning/airlaw/fig-19-10.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-11": {
    src: "/assets/learning/airlaw/fig-19-11.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-12": {
    src: "/assets/learning/airlaw/fig-19-12.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-12", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-19-13": {
    src: "/assets/learning/airlaw/fig-19-13.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-19-13", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-01": {
    src: "/assets/learning/airlaw/fig-20-01.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-02": {
    src: "/assets/learning/airlaw/fig-20-02.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-03": {
    src: "/assets/learning/airlaw/fig-20-03.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-04": {
    src: "/assets/learning/airlaw/fig-20-04.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-05": {
    src: "/assets/learning/airlaw/fig-20-05.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-06": {
    src: "/assets/learning/airlaw/fig-20-06.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-07": {
    src: "/assets/learning/airlaw/fig-20-07.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-08": {
    src: "/assets/learning/airlaw/fig-20-08.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-09": {
    src: "/assets/learning/airlaw/fig-20-09.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-10": {
    src: "/assets/learning/airlaw/fig-20-10.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-11": {
    src: "/assets/learning/airlaw/fig-20-11.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-12": {
    src: "/assets/learning/airlaw/fig-20-12.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-12", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-13": {
    src: "/assets/learning/airlaw/fig-20-13.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-13", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-14": {
    src: "/assets/learning/airlaw/fig-20-14.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-14", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-15": {
    src: "/assets/learning/airlaw/fig-20-15.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-15", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-16": {
    src: "/assets/learning/airlaw/fig-20-16.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-16", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-17": {
    src: "/assets/learning/airlaw/fig-20-17.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-17", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-18": {
    src: "/assets/learning/airlaw/fig-20-18.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-18", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-19": {
    src: "/assets/learning/airlaw/fig-20-19.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-19", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-20": {
    src: "/assets/learning/airlaw/fig-20-20.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-20", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-21": {
    src: "/assets/learning/airlaw/fig-20-21.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-21", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-20-22": {
    src: "/assets/learning/airlaw/fig-20-22.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-20-22", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-01": {
    src: "/assets/learning/airlaw/fig-21-01.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-02": {
    src: "/assets/learning/airlaw/fig-21-02.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-03": {
    src: "/assets/learning/airlaw/fig-21-03.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-04": {
    src: "/assets/learning/airlaw/fig-21-04.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-05": {
    src: "/assets/learning/airlaw/fig-21-05.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-06": {
    src: "/assets/learning/airlaw/fig-21-06.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-07": {
    src: "/assets/learning/airlaw/fig-21-07.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-07", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-08": {
    src: "/assets/learning/airlaw/fig-21-08.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-08", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-09": {
    src: "/assets/learning/airlaw/fig-21-09.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-09", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-10": {
    src: "/assets/learning/airlaw/fig-21-10.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-10", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-21-11": {
    src: "/assets/learning/airlaw/fig-21-11.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-21-11", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-01": {
    src: "/assets/learning/airlaw/fig-22-01.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-02": {
    src: "/assets/learning/airlaw/fig-22-02.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-03": {
    src: "/assets/learning/airlaw/fig-22-03.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-04": {
    src: "/assets/learning/airlaw/fig-22-04.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-04", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-05": {
    src: "/assets/learning/airlaw/fig-22-05.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-05", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-22-06": {
    src: "/assets/learning/airlaw/fig-22-06.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-22-06", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-23-01": {
    src: "/assets/learning/airlaw/fig-23-01.png",
    alt: "Figure 23.1 General declaration",
    parts: defaultParts("fig-23-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-23-02": {
    src: "/assets/learning/airlaw/fig-23-02.png",
    alt: "Figure 23.2",
    parts: defaultParts("fig-23-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-24-01": {
    src: "/assets/learning/airlaw/fig-24-01.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-24-01", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-24-02": {
    src: "/assets/learning/airlaw/fig-24-02.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-24-02", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
  "fig-24-03": {
    src: "/assets/learning/airlaw/fig-24-03.png",
    alt: "Aviation Technical Illustration",
    parts: defaultParts("fig-24-03", [
      [30, 40, "Primary Feature", "Key technical specification or regulatory procedure depicted in this figure."],
      [70, 50, "Operational Datum", "Standard reference mark, boundary, or clearance criteria."],
    ]),
  },
};
