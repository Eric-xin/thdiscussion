import type { Source } from "./types";

export interface GateShare {
  /** Letter shown before the reveal. */
  key: string;
  flow: string;
  gate: string;
  share: number;
  approximate?: boolean;
  physical: boolean;
}

/** How much of a flow passes through one gate, or one small set of gatekeepers. */
export const gateShares: GateShare[] = [
  { key: "A", flow: "Smartphone apps", gate: "two operating systems (Android, iOS)", share: 99, approximate: true, physical: false },
  { key: "B", flow: "Europe–Asia internet data", gate: "cables through Egypt and the Red Sea", share: 90, approximate: true, physical: true },
  { key: "C", flow: "Cloud computing", gate: "three companies (Amazon, Microsoft, Google)", share: 63, physical: false },
  { key: "D", flow: "Seaborne crude oil", gate: "the Strait of Hormuz", share: 38, physical: true },
  { key: "E", flow: "Seaborne LNG", gate: "the Strait of Hormuz", share: 19, physical: true },
];

export const gateSharesSource: Source = {
  label: "UNCTAD (oil, LNG, week before the war); ITU/ICPC advisory body (cables); Synergy Research, Q2 2026 (cloud); StatCounter (mobile OS)",
  note: "The cable and mobile figures are industry estimates. Each bar measures a different flow, so compare the pattern, not the decimals.",
};

export interface Segment {
  name: string;
  share: number;
  /** Where the holder is based. */
  note?: string;
}

export const cloudShareQ2_2026: Segment[] = [
  { name: "Amazon (AWS)", share: 28 },
  { name: "Microsoft", share: 20 },
  { name: "Google", share: 15 },
  { name: "Everyone else", share: 37 },
];

export const cloudSource: Source = {
  label: "Synergy Research Group, Q2 2026",
  url: "https://www.srgresearch.com/articles/q2-cloud-market-passes-143-billion-highest-growth-rate-in-eight-years",
};

/** AWS's UAE region (ME-CENTRAL-1) after the drone strikes of 1 March 2026. */
export const awsUaeZones = [
  { zone: "mec1-az1", hit: false },
  { zone: "mec1-az2", hit: true },
  { zone: "mec1-az3", hit: true },
];

export const awsSource: Source = {
  label: "AWS status page, via The Register and Reuters, 2 March 2026",
  url: "https://www.theregister.com/2026/03/02/amazon_outages_middle_east/",
};

export const tiktokUsOwners: Segment[] = [
  { name: "Oracle", share: 15, note: "US" },
  { name: "Silver Lake", share: 15, note: "US" },
  { name: "MGX", share: 15, note: "Abu Dhabi" },
  { name: "Other investors", share: 35.1, note: "Mostly US" },
  { name: "ByteDance", share: 19.9, note: "China" },
];

export const tiktokOwnersSource: Source = {
  label: "Company statements, via Reuters and Variety, January 2026",
  url: "https://finance.yahoo.com/news/deal-us-ownership-tiktok-closed-002520253.html",
};

export interface YearShare {
  year: number;
  share: number;
}

/** Share of US adults who regularly get news on TikTok. */
export const tiktokNews: YearShare[] = [
  { year: 2020, share: 3 },
  { year: 2022, share: 10 },
  { year: 2023, share: 14 },
  { year: 2024, share: 17 },
  { year: 2025, share: 20 },
];

export const tiktokNewsSource: Source = {
  label: "Pew Research Center",
  url: "https://www.pewresearch.org/short-reads/2025/09/25/1-in-5-americans-now-regularly-get-news-on-tiktok-up-sharply-from-2020/",
};
