import type { Source } from "./types";

/** All figures on this page come from one article. */
export const economistSource: Source = {
  label: "The Economist, “The global scramble for ports”, 30 April 2026",
};

/** China's share of the things a port runs on, %. */
export const chinaShares = [
  { item: "Shipping containers made", by: "Chinese companies", share: 95 },
  { item: "Container ships whose position is visible", by: "LOGINK and CargoSmart (COSCO)", share: 90 },
  { item: "Ship-to-shore cranes made", by: "Shanghai Zhenhua (ZPMC), state-backed", share: 70, atLeast: true },
  { item: "China's overseas ports sitting near a chokepoint", by: "of at least 129 ports outside China", share: 34, atLeast: true },
];

/** Money committed, $bn. */
export const portMoney = [
  { what: "Maritime acquisitions by non-Chinese firms", detail: "since 2021", bn: 140, side: "west" },
  { what: "Chinese port construction abroad", detail: "at least; Antigua to Tanzania", bn: 80, side: "china" },
  { what: "BlackRock and MSC buy Hutchison's ports", detail: "incl. two Panama Canal terminals", bn: 23, side: "west" },
  { what: "Singapore's automated port", detail: "under construction", bn: 20, side: "other" },
  { what: "Stonepeak and CMA CGM: United Ports", detail: "joint venture, January 2026", bn: 10, side: "west" },
  { what: "APM Terminals and Eurogate", detail: "North Sea terminal, €1bn", bn: 1.2, side: "west" },
  { what: "Saudi Arabia: Jeddah Islamic Port", detail: "October 2025", bn: 0.45, side: "other" },
] as const;

/** What happens to a country's trade after a Chinese firm takes over a terminal (MERICS), %. */
export const terminalEffect = [
  { what: "Trade with China", detail: "after a terminal contract is signed", change: 20, atLeast: true },
  { what: "Exports to everyone else", detail: "when Chinese firms run every terminal at a port", change: -19 },
];

/** Annual spending on port infrastructure, $bn (PwC). */
export const portSpending = [
  { label: "Today", bn: 66, derived: true },
  { label: "2035", bn: 90 },
];

export const spendingNote =
  "Today's figure is inferred from “rise by more than a third to $90bn”; it is an upper bound.";
