import type { Variant } from "./types";

export const VARIANTS: Variant[] = [
  { id: "iqube-2-3-kwh", family: "iQube", name: "iQube 2.3 kWh", kwh: 2.3, priceInr: 119250, onRoadInr: 125914, rangeKm: 114, topSpeed: 82, image: "/scooters/iqube-2-3-kwh.png", colours: ["Pearl White", "Walnut Brown", "Titanium Grey"], bookable: true },
  { id: "iqube-3-1-kwh", family: "iQube", name: "iQube 3.1 kWh", kwh: 3.1, priceInr: 138510, onRoadInr: 146060, rangeKm: 123, topSpeed: 82, image: "/scooters/iqube-3-1-kwh.png", colours: ["Titanium Grey", "Pearl White", "Starlight Blue-Beige", "Copper Bronze-Beige"], bookable: true },
  { id: "iqube-3-5-kwh", family: "iQube", name: "iQube 3.5 kWh", kwh: 3.5, priceInr: 145653, onRoadInr: 153531, rangeKm: 145, topSpeed: 82, image: "/scooters/iqube-3-5-kwh.png", colours: ["Pearl White", "Titanium Grey", "Walnut Brown", "Starlight Blue-Beige", "Copper Bronze-Beige"], bookable: true },
  { id: "iqube-millionr-edition", family: "iQube", name: "iQube MillionR Edition", kwh: 3.5, priceInr: 140138, onRoadInr: 147762, rangeKm: 145, topSpeed: 82, image: "/scooters/iqube-millionr-edition.png", colours: ["Aurora Green"], bookable: true },
  { id: "iqube-s-4-7-kwh", family: "iQube", name: "iQube S 4.7 kWh", kwh: 4.7, priceInr: 165353, onRoadInr: 174137, rangeKm: 175, topSpeed: 82, image: "/scooters/iqube-s-4-7-kwh.png", colours: ["Titanium Grey Matte", "Magnificence Purple-Beige", "Harlequin Blue-Beige"], bookable: true },
  { id: "iqube-st-5-3-kwh", family: "iQube", name: "iQube ST 5.3 kWh", kwh: 5.3, priceInr: 175599, onRoadInr: 184854, rangeKm: 212, topSpeed: 82, image: "/scooters/iqube-st-5-3-kwh.png", colours: ["Titanium Grey Matte", "Starlight Blue-Beige", "Copper Bronze-Beige"], bookable: true },
  { id: "orbiter-v1", family: "Orbiter", name: "Orbiter V1 1.8 kWh", kwh: 1.8, priceInr: 103650, onRoadInr: 106432, rangeKm: 86, topSpeed: 68, image: "/scooters/orbiter-Stellar_Silver.png", colours: ["Martian Copper", "Stellar Silver"], bookable: true },
  { id: "orbiter-v2", family: "Orbiter", name: "Orbiter V2 3.1 kWh", kwh: 3.1, priceInr: 111000, onRoadInr: 114106, rangeKm: 158, topSpeed: 68, image: "/scooters/orbiter-Stratos_Blue.png", colours: ["Cosmic Titanium", "Lunar Grey", "Martian Copper", "Neon Sunburst", "Stellar Silver", "Stratos Blue"], bookable: true },
  { id: "tvs-x", family: "TVS X", name: "TVS X 4.44 kWh", kwh: 4.44, priceInr: 266141, onRoadInr: 280282, rangeKm: 140, topSpeed: 105, image: "/scooters/x.png", colours: ["Graphite"], bookable: false },
];

export const variantById = (id: string) => VARIANTS.find((v) => v.id === id) ?? VARIANTS[0];

const ORBITER_COLOUR_IMG: Record<string, string> = {
  "Cosmic Titanium": "/scooters/orbiter-Cosmic_Titanium.png",
  "Lunar Grey": "/scooters/orbiter-Lunar_Grey.png",
  "Martian Copper": "/scooters/orbiter-Martian_Copper.png",
  "Neon Sunburst": "/scooters/orbiter-Neon_Sunburst.png",
  "Stellar Silver": "/scooters/orbiter-Stellar_Silver.png",
  "Stratos Blue": "/scooters/orbiter-Stratos_Blue.png",
};

export const imageFor = (variantId: string, colour?: string) => {
  const v = variantById(variantId);
  if (v.family === "Orbiter" && colour && ORBITER_COLOUR_IMG[colour]) return ORBITER_COLOUR_IMG[colour];
  return v.image;
};

export const COLOUR_HEX: Record<string, string> = {
  "Pearl White": "#f4f4f2", "Walnut Brown": "#6b4a36", "Titanium Grey": "#7d838a", "Starlight Blue-Beige": "#5b7fa6",
  "Copper Bronze-Beige": "#b9825b", "Aurora Green": "#2f8f6b", "Titanium Grey Matte": "#5f656b",
  "Magnificence Purple-Beige": "#7b5ea0", "Harlequin Blue-Beige": "#3e6fb5", "Martian Copper": "#c08a65",
  "Stellar Silver": "#c9ccd1", "Cosmic Titanium": "#6a6e74", "Lunar Grey": "#a1a6ac", "Neon Sunburst": "#f2d21b",
  "Stratos Blue": "#2d9be0", Graphite: "#2b2f33",
};
