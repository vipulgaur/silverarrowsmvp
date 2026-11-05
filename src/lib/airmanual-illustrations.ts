import type { FigureAsset } from "@/lib/learning-illustrations";

/**
 * Figure assets for CAE ATPL 0: Air Manual.
 *
 * Schematic figures are ORIGINAL line diagrams authored for this module (not
 * reproductions of any manual's artwork), served as static SVGs from
 * /public/assets/learning/airmanual/. The two photo-style figures (Fig-01-01 the
 * aeroplane, Fig-01-02 the cockpit) are drop-in slots: place a real image at the
 * listed path and it renders automatically. Until then, those two IDs are absent
 * here and fall back to the prompt card.
 */
export const airmanualFigureAssets: Record<string, FigureAsset> = {
  "Fig-01-03": {
    src: "/assets/learning/airmanual/fig-01-03.svg",
    alt: "Three flight control input devices: control column, control wheel (yoke), and side-stick.",
    parts: [],
  },
  "Fig-01-05": {
    src: "/assets/learning/airmanual/fig-01-05.svg",
    alt: "Comparison of a fixed horizontal stabiliser with elevator against an all-moving stabilator.",
    parts: [],
  },
  "Fig-01-06": {
    src: "/assets/learning/airmanual/fig-01-06.svg",
    alt: "Tricycle undercarriage (level) compared with a tailwheel undercarriage (nose-up).",
    parts: [],
  },
  "Fig-01-07": {
    src: "/assets/learning/airmanual/fig-01-07.svg",
    alt: "Rotary aircraft ignition switch with OFF, R, L, BOTH and START PUSH positions.",
    parts: [],
  },
  "Fig-01-08": {
    src: "/assets/learning/airmanual/fig-01-08.svg",
    alt: "VHF-COM radio control panel with COMM 1 display, OFF/ON/TEST dial, and VOL and SQ knobs.",
    parts: [],
  },
  "Fig-01-09": {
    src: "/assets/learning/airmanual/fig-01-09.svg",
    alt: "Typical light aircraft instrument panel with the six-pack flight instruments, radio stack, engine gauges and lower controls.",
    parts: [],
  },
  // Drop-in slots (photo-style — supply a real image to activate):
  // "Fig-01-01": { src: "/assets/learning/airmanual/fig-01-01.png", alt: "The aeroplane", parts: [] },
  // "Fig-01-02": { src: "/assets/learning/airmanual/fig-01-02.png", alt: "The cockpit", parts: [] },
};
