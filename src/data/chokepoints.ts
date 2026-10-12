import type { Source } from "./types";

export interface YearCount {
  year: number;
  transits: number;
}

/** Vessels transiting the Suez Canal per calendar year. */
export const suezTransits: YearCount[] = [
  { year: 2019, transits: 18800 },
  { year: 2020, transits: 18829 },
  { year: 2021, transits: 20694 },
  { year: 2022, transits: 23851 },
  { year: 2023, transits: 26434 },
  { year: 2024, transits: 13213 },
  { year: 2025, transits: 12758 },
];

export const suezSource: Source = {
  label: "Suez Canal Authority, via Arab News, Statista, PortsEurope",
  url: "https://www.arabnews.com/node/2597377",
  note: "2019 and 2020 are rounded press figures.",
};

export interface MonthAverage {
  label: string;
  /** Average commercial transits per day. */
  perDay: number;
  partial?: boolean;
}

/** IMF PortWatch's pre-crisis norm for the Strait of Hormuz. */
export const hormuzNormPerDay = 85;

export const hormuzMonthly2026: MonthAverage[] = [
  { label: "Mar", perDay: 3.19 },
  { label: "Apr", perDay: 7.13 },
  { label: "May", perDay: 3.94 },
  { label: "Jun", perDay: 12.93 },
  { label: "Jul", perDay: 10.19 },
  { label: "Aug", perDay: 4.71 },
  { label: "Sep", perDay: 3.9, partial: true },
];

/** A single day, used for the opening pictogram. */
export const hormuzOneDay = { date: "Sunday 4 October 2026", transits: 4, norm: hormuzNormPerDay };

export const hormuzSource: Source = {
  label: "IMF PortWatch (AIS ship tracking), via GlobalMilitary.net and straits.live",
  url: "https://portwatch.imf.org/pages/cc317ba850e34c4dadbead6f7b336fb1",
  note: "Counts commercial ships broadcasting AIS; ships sailing dark are missed. Other trackers read higher (Al Jazeera: about 5 a day, 20 after the June agreement). September covers the 1st to the 20th.",
};

export interface DatedEvent {
  date: string;
  /** Index into hormuzMonthly2026 the marker sits over. */
  month: number;
  text: string;
}

export const hormuzEvents: DatedEvent[] = [
  { date: "2 Mar", month: 0, text: "Iran declares the strait closed" },
  { date: "17 Jun", month: 3, text: "Interim agreement" },
  { date: "14 Jul", month: 4, text: "US blockade resumes" },
];

export interface PortCallChange {
  country: string;
  /** Change in daily port calls since the war began, %. */
  change: number;
  approximate?: boolean;
}

export const portCallChange: PortCallChange[] = [
  { country: "Kuwait", change: -86 },
  { country: "UAE", change: -69 },
  { country: "Qatar", change: -68, approximate: true },
  { country: "Iraq", change: -67, approximate: true },
  { country: "Bahrain", change: -66, approximate: true },
  { country: "Saudi Arabia", change: -15 },
];

export const portCallSource: Source = {
  label: "Al Jazeera, 27 August 2026",
  url: "https://www.aljazeera.com/news/2026/8/27/how-a-95-percent-drop-in-hormuz-traffic-changed-global-shipping",
  note: "Qatar, Iraq and Bahrain are reported only as a range of 66% to 68%.",
};

/** Share of global seaborne flows that passed through Hormuz in the week before the war, %. */
export const hormuzFlows = [
  { cargo: "Crude oil", share: 38 },
  { cargo: "LPG", share: 29 },
  { cargo: "LNG", share: 19 },
];

/** Share of each country's oil imports that comes from the Middle East, %. */
export const oilDependence = [
  { country: "Eritrea", share: 90, approximate: true },
  { country: "Madagascar", share: 90, approximate: true },
  { country: "Pakistan", share: 78 },
  { country: "Japan", share: 77 },
  { country: "Kenya", share: 77 },
];

export const flowsSource: Source = {
  label: "UNCTAD; Al Jazeera, 27 August 2026",
  url: "https://www.aljazeera.com/news/2026/8/27/how-a-95-percent-drop-in-hormuz-traffic-changed-global-shipping",
};

/** Drewry World Container Index: cost of shipping one 40ft container, $ (composite of main routes). x is a decimal year. */
export const freightRate = [
  { x: 2019.5, usd: 1420, when: "2019 average", show: true },
  { x: 2021.7, usd: 10377, when: "September 2021", show: true },
  { x: 2023.8, usd: 1342, when: "October 2023", show: true },
  { x: 2024.55, usd: 5937, when: "July 2024", show: true },
  { x: 2025.95, usd: 2200, when: "December 2025", show: false },
  { x: 2026.02, usd: 2557, when: "January 2026", show: false },
  { x: 2026.23, usd: 2279, when: "March 2026", show: false },
  { x: 2026.48, usd: 4166, when: "June 2026", show: false },
  { x: 2026.64, usd: 4526, when: "August 2026", show: true },
  { x: 2026.77, usd: 4351, when: "8 October 2026", show: false },
];

export const freightSource: Source = {
  label: "Drewry World Container Index",
  url: "https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry",
  note: "Selected readings, joined by straight lines; the path between them is not shown. December 2025 is back-calculated from January's 16% rise.",
};
