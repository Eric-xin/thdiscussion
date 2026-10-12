import type { Source } from "./types";

/** [longitude, latitude] */
export type LonLat = [number, number];

/* ---------- container ports ---------- */

export const portLocations: Record<string, LonLat> = {
  Shanghai: [121.9, 31.0],
  Singapore: [103.8, 1.26],
  "Ningbo-Zhoushan": [121.85, 29.9],
  Shenzhen: [114.1, 22.5],
  Qingdao: [120.3, 36.07],
  Guangzhou: [113.6, 22.8],
  Busan: [129.05, 35.1],
  Tianjin: [117.75, 39.0],
  "Jebel Ali": [55.03, 25.0],
  "Port Klang": [101.35, 3.0],
  Rotterdam: [4.1, 51.95],
  "Hong Kong": [114.15, 22.33],
  "Antwerp-Bruges": [4.3, 51.3],
  Xiamen: [118.07, 24.48],
  "Tanjung Pelepas": [103.55, 1.36],
};

/* ---------- the ports in Khalili's chapter ---------- */

export interface StoriedPort {
  port: string;
  at: LonLat;
  fate: "rose" | "declined";
  /** What the chapter says moved it, with the page. */
  why: string;
  labelled?: boolean;
  dx?: number;
  dy?: number;
  anchor?: "start" | "end";
}

export const khaliliPorts: StoriedPort[] = [
  { port: "Alexandria", at: [29.9, 31.2], fate: "declined", why: "Lost the overland India route when the Suez Canal opened (p. 215)", labelled: true, anchor: "end", dx: -10 },
  { port: "Port Said", at: [32.3, 31.26], fate: "rose", why: "Created by the Suez Canal (p. 215)", labelled: true, dy: -10 },
  { port: "Beirut", at: [35.5, 33.9], fate: "declined", why: "Destroyed by civil war; its finance and transit trade moved to the Gulf (p. 215)", labelled: true },
  { port: "Haifa", at: [35.0, 32.82], fate: "rose", why: "Took Syria's trade during the Syrian war (p. 216)" },
  { port: "Basra", at: [47.8, 30.5], fate: "declined", why: "War; Dubai picked up its business (p. 220)", labelled: true, dy: -10 },
  { port: "Kuwait", at: [47.93, 29.35], fate: "rose", why: "Became Iraq's entrepôt during the Iran–Iraq war (p. 215)" },
  { port: "Bandar Abbas", at: [56.27, 27.18], fate: "declined", why: "Sanctions and war; Dubai became Iran's trans-shipment hub (pp. 216, 220)", labelled: true, dy: -10 },
  { port: "Sharjah", at: [55.4, 25.45], fate: "declined", why: "1955: Britain chose to dredge Dubai's creek and told Sharjah it would “cease to exist” as a deep-sea port; it rebuilt only after the oil boom (p. 214)", labelled: true, dy: -10, anchor: "end", dx: -8 },
  { port: "Jebel Ali (Dubai)", at: [55.03, 25.0], fate: "rose", why: "Dredged creek, free port, free zone, other people's wars (pp. 214–220)", labelled: true, anchor: "end", dx: -14, dy: 28 },
  { port: "Hamad (Doha)", at: [51.6, 25.0], fate: "rose", why: "Opening accelerated by the 2017 blockade of Qatar (p. 220)" },
  { port: "Sohar", at: [56.6, 24.5], fate: "rose", why: "Took Qatar's diverted cargo in 2017 (p. 220)" },
  { port: "Salalah", at: [54.0, 16.95], fate: "rose", why: "Became Qatar's transit port during the 2017 blockade (pp. 209, 220)", labelled: true },
  { port: "Jeddah", at: [39.17, 21.48], fate: "rose", why: "Pilgrims arriving by ship after the Suez Canal opened (p. 215)", labelled: true, anchor: "end", dx: -10 },
  { port: "Aden", at: [45.0, 12.8], fate: "declined", why: "Decolonisation and the eight-year closure of Suez after 1967 (p. 212); later, traffic fell under DP World (p. 215)", labelled: true, dy: 18 },
  { port: "Djibouti", at: [43.15, 11.6], fate: "declined", why: "Container traffic dropped after DP World took over (p. 215)", anchor: "end", dx: -10 },
];

/* ---------- sea routes (schematic waypoints) ---------- */

export const routeViaSuez: LonLat[] = [
  [122, 31], [120, 23], [112, 11], [104.5, 1.2], [98, 5.5], [80, 5.3], [62, 11], [48, 12.3], [43.3, 12.6],
  [38.5, 19.5], [33, 28.5], [32.4, 31.4], [22, 34.5], [11, 37.6], [-5.6, 36], [-10.5, 38], [-9.5, 44.5], [-4, 49], [3.5, 52],
];

export const routeViaCape: LonLat[] = [
  [122, 31], [120, 23], [112, 11], [104.5, 1.2], [98, 5.5], [80, 5.3], [62, -12], [42, -30], [28, -35.5], [18, -36],
  [5, -18], [-12, 4], [-19.5, 15], [-18, 26], [-11.5, 37], [-9.5, 44.5], [-4, 49], [3.5, 52],
];

export const routeIntoGulf: LonLat[] = [[62, 11], [60, 21], [57.2, 25.6], [56.4, 26.6], [55.03, 25.0]];

export const chokepoints: Record<string, LonLat> = {
  Hormuz: [56.4, 26.5],
  "Bab el-Mandeb": [43.3, 12.6],
  Suez: [32.4, 30.3],
  Malacca: [101, 2.8],
  Gibraltar: [-5.6, 36],
  Panama: [-79.6, 9.1],
  "Cape of Good Hope": [18.5, -34.4],
};

export const routesSource: Source = {
  label: "Routes are schematic. Suez: Suez Canal Authority. Hormuz: IMF PortWatch",
  note: "A normal day at Hormuz was about 85 ships; 4 passed on 4 October 2026.",
};

/* ---------- The Economist: who holds which harbour ---------- */

export type Bloc = "China" | "United States and Western firms" | "Gulf states" | "Others";

export interface PortDeal {
  place: string;
  at: LonLat;
  bloc: Bloc;
  what: string;
  labelled?: boolean;
  dx?: number;
  dy?: number;
  anchor?: "start" | "end";
}

export const portDeals: PortDeal[] = [
  { place: "Piraeus", at: [23.64, 37.94], bloc: "China", what: "Majority-owned by COSCO; more than 4m containers a year" },
  { place: "Chancay, Peru", at: [-77.27, -11.56], bloc: "China", what: "Chinese-run port watched by US officials", labelled: true, anchor: "end", dx: -10, dy: -6 },
  { place: "Abu Dhabi", at: [54.65, 24.8], bloc: "China", what: "COSCO plans to invest more" },
  { place: "Brazil", at: [-41.0, -21.8], bloc: "China", what: "China Merchants Port is acquiring Vast Infrastructure", labelled: true },
  { place: "Antigua", at: [-61.85, 17.12], bloc: "China", what: "Chinese port construction" },
  { place: "Thessaloniki", at: [22.93, 40.63], bloc: "China", what: "Russian and Chinese investors hold a stake" },
  { place: "Panama Canal", at: [-79.57, 8.95], bloc: "United States and Western firms", what: "BlackRock and MSC buy Hutchison's ports for $23bn; terminals handed to Maersk and MSC", labelled: true, dy: -12 },
  { place: "Elefsina", at: [23.54, 38.04], bloc: "United States and Western firms", what: "US government backs a bid to build a commercial port" },
  { place: "Alexandroupolis", at: [25.88, 40.85], bloc: "United States and Western firms", what: "US and NATO logistics hub" },
  { place: "North Sea", at: [8.58, 53.55], bloc: "United States and Western firms", what: "APM Terminals and Eurogate: €1bn terminal expansion", labelled: true, dy: -10 },
  { place: "India", at: [72.85, 18.95], bloc: "United States and Western firms", what: "Hapag-Lloyd raises its stake in JM Baxi Ports" },
  { place: "Dar es Salaam", at: [39.28, -6.82], bloc: "Gulf states", what: "DP World (Dubai) expands", labelled: true },
  { place: "Callao, Peru", at: [-77.15, -12.6], bloc: "Gulf states", what: "DP World (Dubai) expands", labelled: true, dy: 18 },
  { place: "Jeddah", at: [39.17, 21.48], bloc: "Gulf states", what: "Saudi Arabia: $450m deal for Jeddah Islamic Port" },
  { place: "Singapore", at: [103.65, 1.25], bloc: "Others", what: "Building a $20bn automated port", labelled: true, dy: 18 },
  { place: "Tanger Med", at: [-5.5, 35.88], bloc: "Others", what: "Morocco's expansion in 2019; nearby Algeciras has struggled to grow since", labelled: true, anchor: "end", dx: -10 },
];

export const greekPorts: PortDeal[] = [
  { place: "Piraeus", at: [23.64, 37.94], bloc: "China", what: "Majority-owned by COSCO, a Chinese state firm", labelled: true, dy: 20 },
  { place: "Elefsina", at: [23.54, 38.04], bloc: "United States and Western firms", what: "US government backs a bid for a commercial port, 30 km from Piraeus", labelled: true, anchor: "end", dx: -10, dy: -4 },
  { place: "Thessaloniki", at: [22.93, 40.63], bloc: "China", what: "Russian and Chinese investors hold a stake", labelled: true, anchor: "end", dx: -10 },
  { place: "Alexandroupolis", at: [25.88, 40.85], bloc: "United States and Western firms", what: "US and NATO logistics hub", labelled: true, dy: -10, anchor: "end", dx: 0 },
];

export const dealsSource: Source = {
  label: "The Economist, “The global scramble for ports”, 30 April 2026",
  note: "Only places named in the article are shown; it counts at least 129 ports outside China with a Chinese stake.",
};

/* ---------- data routes and owners ---------- */

/** The main Europe–Asia cable corridor (schematic). */
export const cableRoute: LonLat[] = [
  [5.4, 43.3], [9, 39], [14, 35.5], [24, 33.5], [30, 31.5], [32.5, 29.9], [35, 25.5], [39, 19.5], [43.3, 12.6],
  [48, 12.5], [58, 15], [66, 17], [72.8, 19], [76, 8], [82, 5.5], [95, 6], [100, 3.2], [103.8, 1.26],
];

export const cableLandings: { place: string; at: LonLat; labelled?: boolean; dx?: number; dy?: number; anchor?: "start" | "end" }[] = [
  { place: "Marseille", at: [5.4, 43.3], labelled: true, dy: -10 },
  { place: "Egypt", at: [31.2, 30.2], labelled: true, anchor: "end", dx: -10, dy: 14 },
  { place: "Jeddah", at: [39.17, 21.48] },
  { place: "Djibouti", at: [43.15, 11.6] },
  { place: "Mumbai", at: [72.8, 19], labelled: true, dy: -10 },
  { place: "Singapore", at: [103.8, 1.26], labelled: true, dy: 18 },
];

export const struck = [
  { what: "Red Sea cables cut, February 2024 and again in 2025", at: [41.5, 15.5] as LonLat },
  { what: "Amazon's UAE cloud region: two of three data-centre zones hit by drones, 1 March 2026", at: [54.6, 24.4] as LonLat },
  { what: "Amazon's Bahrain cloud region: damaged by a nearby drone strike, March 2026", at: [50.55, 26.1] as LonLat },
];

export const cableSource: Source = {
  label: "ITU/ICPC advisory body (share of traffic); AWS status page via The Register; route is schematic",
  note: "About 90% of Europe–Asia data is estimated to pass this corridor.",
};

export interface Owner {
  name: string;
  home: string;
  at: LonLat;
  share: number;
  country: "United States" | "UAE" | "China";
  dx?: number;
  dy?: number;
  anchor?: "start" | "end";
}

export const tiktokOwnerHomes: Owner[] = [
  { name: "Oracle", home: "Austin", at: [-97.7, 30.3], share: 15, country: "United States", dy: 26, anchor: "start", dx: -10 },
  { name: "Silver Lake", home: "California", at: [-122.2, 37.45], share: 15, country: "United States", dy: -30, dx: 0 },
  { name: "MGX", home: "Abu Dhabi", at: [54.4, 24.45], share: 15, country: "UAE", dy: 26, dx: -14 },
  { name: "ByteDance", home: "Beijing", at: [116.4, 39.9], share: 19.9, country: "China", dy: -16, anchor: "end", dx: 10 },
];

/* ---------- who works at Jabal Ali (Khalili, p. 219) ---------- */

export const jabalAli: LonLat = [55.03, 25.0];

export type Tier = "Executives" | "Administrators and clerks" | "Pilots" | "Dock, crane and security work";

export interface WorkerOrigin {
  from: string;
  job: string;
  at: LonLat;
  tier: Tier;
  bend: number;
  dx?: number;
  dy?: number;
  anchor?: "start" | "end" | "middle";
}

export const workerOrigins: WorkerOrigin[] = [
  { from: "Western Europe", job: "executive officers", at: [4, 48.5], tier: "Executives", bend: -0.15, dy: -12, anchor: "middle", dx: 0 },
  { from: "Lebanon, Syria", job: "mid-level administrators", at: [36.5, 34.2], tier: "Administrators and clerks", bend: -0.2, dy: -12, anchor: "end", dx: -6 },
  { from: "India", job: "mid-level administrators", at: [78.5, 21], tier: "Administrators and clerks", bend: 0.2, dy: 24, anchor: "middle", dx: 0 },
  { from: "Punjab", job: "clerks", at: [75.5, 31], tier: "Administrators and clerks", bend: -0.25, dy: -22, dx: 8 },
  { from: "Philippines", job: "clerks", at: [121.5, 14.5], tier: "Administrators and clerks", bend: 0.18, dy: -12, anchor: "middle", dx: 0 },
  { from: "Egypt", job: "pilots", at: [31, 27], tier: "Pilots", bend: 0.25, dy: 6, anchor: "end", dx: -10 },
  { from: "Yemen", job: "pilots", at: [47.5, 15.5], tier: "Pilots", bend: 0.25, dy: 22, anchor: "middle", dx: 0 },
  { from: "Pakistan", job: "stevedores", at: [66.5, 27.5], tier: "Dock, crane and security work", bend: 0.3, dy: -24, anchor: "end", dx: 4 },
  { from: "Nepal", job: "security guards", at: [85, 28], tier: "Dock, crane and security work", bend: -0.2, dy: -12, dx: 6 },
  { from: "South-East Asia", job: "crane operators", at: [102, 13.5], tier: "Dock, crane and security work", bend: 0.15, dy: 24, anchor: "middle", dx: 0 },
];

/* ---------- dockers and the right to organise (Khalili, pp. 216–217) ---------- */

/** ISO numeric country ids. */
export const dockerPolitics = {
  struck2011: { name: "Dockers struck in the 2011 uprisings", ids: ["048", "818", "414", "434", "512", "788"] },
  antiColonial: { name: "Dockers fought colonial rule", ids: ["012", "422", "504", "760", "887"] },
  banned: { name: "Unions banned; workers imported", ids: ["784", "682", "634"] },
};

/* ---------- the port leaves the city: Dubai ---------- */

export const dubaiPorts = [
  { place: "Dubai Creek", note: "old port, city centre", at: [55.3, 25.265] as LonLat },
  { place: "Port Rashid", note: "1970s, beside the city", at: [55.268, 25.268] as LonLat },
  { place: "Jebel Ali", note: "35 km out", at: [55.03, 25.0] as LonLat },
  { place: "Sharjah", note: "told to decline, 1955", at: [55.385, 25.36] as LonLat },
];

/* ---------- shocks to shipping since 2020 ---------- */

export interface Shock {
  year: string;
  place: string;
  what: string;
  at: LonLat;
  dx?: number;
  dy?: number;
  anchor?: "start" | "end" | "middle";
}

export const shocks: Shock[] = [
  { year: "2021", place: "Suez Canal", what: "One ship, the Ever Given, blocks it for six days", at: [32.4, 30.3], dx: -14, dy: -44, anchor: "end" },
  { year: "2022", place: "Los Angeles", what: "109 ships wait offshore", at: [-118.2, 33.7], dx: 14, dy: -18 },
  { year: "2022", place: "Shanghai", what: "Two-month lockdown of the biggest port", at: [121.9, 31.0], dx: 0, dy: 34, anchor: "end" },
  { year: "2023", place: "Panama Canal", what: "Drought cuts crossings by a third", at: [-79.6, 9.1], dx: 14, dy: 26 },
  { year: "2023–25", place: "Red Sea", what: "Attacks on ships; Suez traffic halves", at: [42.5, 14], dx: -14, dy: 30, anchor: "end" },
  { year: "2026", place: "Strait of Hormuz", what: "Closed: 85 ships a day, now about 4", at: [56.4, 26.5], dx: 16, dy: -52 },
];

export const shocksSource: Source = {
  label: "Suez Canal Authority; Marine Exchange of Southern California; Panama Canal Authority; IMF PortWatch",
  note: "Routes are schematic.",
};

