import { barH, C, line, sized } from "./charts/charts";
import { baseMap, dot, flow, label, ring, route, strike, type MapCanvas } from "./charts/map";
import { fmt } from "./charts/svg";
import { freightRate, freightSource, portCallChange, portCallSource } from "./data/chokepoints";
import { gateShares, gateSharesSource, tiktokOwnersSource } from "./data/digital";
import {
  cableLandings,
  cableRoute,
  cableSource,
  chokepoints,
  dealsSource,
  dockerPolitics,
  dubaiPorts,
  greekPorts,
  jabalAli,
  khaliliPorts,
  portDeals,
  portLocations,
  routeIntoGulf,
  routeViaCape,
  routeViaSuez,
  shocks,
  shocksSource,
  struck,
  tiktokOwnerHomes,
  workerOrigins,
  type Bloc,
  type PortDeal,
  type Tier,
} from "./data/geo";
import { containerPorts2024, containerPortsSource, largestContainerShips, shipsSource, suezClosure } from "./data/ports";
import { chinaShares, economistSource } from "./data/scramble";
import type { Source } from "./data/types";

export interface Figure {
  title: string;
  subtitle: string;
  sources: Source[];
  legend?: { name: string; color: string }[];
  draw(plot: HTMLElement): void;
}

export interface Page {
  id: string;
  /** Short name shown in the navigation. */
  name: string;
  /** "pair": two equal maps. "lead": one large map with two smaller figures beside it. */
  layout: "pair" | "lead";
  figures: Figure[];
}

const LEAD = { width: 1000, height: 640 };
const HALF = { width: 800, height: 600 };
const SIDE = 560;

const blocColor: Record<Bloc, string> = {
  China: C.red,
  "United States and Western firms": C.blue,
  "Gulf states": C.orange,
  Others: C.mute,
};
const tierColor: Record<Tier, string> = {
  Executives: C.magenta,
  "Administrators and clerks": C.blue,
  Pilots: C.aqua,
  "Dock, crane and security work": C.orange,
};

const blocLegend = (Object.keys(blocColor) as Bloc[]).map((b) => ({ name: b, color: blocColor[b] }));

function dealDots(m: MapCanvas, deals: PortDeal[], r: number): void {
  for (const d of deals) {
    dot(m, d.at, { r, color: blocColor[d.bloc], tip: `${d.place}: ${d.what}` });
    if (d.labelled) label(m, d.at, d.place, { dx: d.dx, dy: d.dy, anchor: d.anchor });
  }
}

export const pages: Page[] = [
  /* ---------- 1. The reading: where ports are, and why ---------- */
  {
    id: "ports",
    name: "Ports",
    layout: "pair",
    figures: [
      {
        title: "The world's fifteen busiest container ports",
        subtitle: "Circle area shows containers handled in 2024",
        sources: [containerPortsSource],
        draw: (plot) => {
          const m = baseMap({ box: [-112, -30, 150, 62], width: 800, height: 470, label: "The fifteen busiest container ports on a world map" });
          for (const p of [...containerPorts2024].reverse()) {
            dot(m, portLocations[p.port], {
              r: Math.sqrt(p.teu2024) * 3.1,
              color: p.region === "Gulf" ? C.red : C.blue,
              opacity: 0.72,
              tip: `#${p.rank} ${p.port}, ${p.country}: ${fmt(p.teu2024, 1)}m containers (TEU)`,
            });
          }
          label(m, portLocations["Shanghai"], "Shanghai", { dx: 26, dy: 4 });
          label(m, portLocations["Singapore"], "Singapore", { dx: 0, dy: 40, anchor: "middle" });
          label(m, portLocations["Rotterdam"], "Rotterdam", { dx: -18, dy: -12, anchor: "end" });
          label(m, portLocations["Jebel Ali"], "Jebel Ali", { dx: 0, dy: 34, anchor: "middle", strong: true });
          plot.append(m.svg);
        },
      },
      {
        title: "The ports in the reading",
        subtitle: "Each dot is a port Khalili writes about",
        sources: [{ label: "Khalili, “Ports of the Persian Gulf” (2021); hover a port for what moved it" }],
        legend: [
          { name: "Rose", color: C.blue },
          { name: "Declined", color: C.red },
        ],
        draw: (plot) => {
          const m = baseMap({ box: [26, 9, 62, 37], ...HALF, regional: true, label: "Ports in Khalili's chapter that rose or declined" });
          for (const p of khaliliPorts) {
            dot(m, p.at, { r: 9, color: p.fate === "rose" ? C.blue : C.red, tip: `${p.port}: ${p.why}` });
            if (p.labelled) label(m, p.at, p.port, { dx: p.dx ?? 12, dy: p.dy, anchor: p.anchor });
          }
          plot.append(m.svg);
        },
      },
    ],
  },

  /* ---------- 2. The reading: steam, oil, boxes, and a canal ---------- */
  {
    id: "canal",
    name: "Canal and ships",
    layout: "lead",
    figures: [
      {
        title: "Two ways from Asia to Europe",
        subtitle: "The Suez Canal was shut from 1967 to 1975, and largely avoided again since 2024",
        sources: [{ label: "Khalili, pp. 212, 215; routes are schematic" }],
        legend: [
          { name: "Through the Red Sea and Suez", color: C.blue },
          { name: "Round the Cape of Good Hope", color: C.orange },
        ],
        draw: (plot) => {
          const m = baseMap({ box: [-28, -42, 132, 58], ...LEAD, label: "Sea routes between Asia and Europe via Suez and via the Cape" });
          route(m, routeViaCape, { color: C.orange, width: 4 });
          route(m, routeViaSuez, { color: C.blue, width: 4 });
          ring(m, chokepoints["Suez"]);
          ring(m, chokepoints["Bab el-Mandeb"]);
          label(m, chokepoints["Suez"], "Suez Canal", { dx: 20, dy: -18, strong: true });
          for (const name of ["Alexandria", "Aden"]) {
            const p = khaliliPorts.find((d) => d.port === name)!;
            dot(m, p.at, { r: 8, color: C.red, tip: `${p.port}: ${p.why}` });
          }
          label(m, [29.9, 31.2], "Alexandria", { dx: -12, dy: -8, anchor: "end" });
          label(m, [45.0, 12.8], "Aden", { dx: 14, dy: 20 });
          dot(m, [18.4, -33.9], { r: 8, color: C.blue, tip: "South African ports: a windfall whenever Suez shuts (p. 215)" });
          label(m, [18.4, -33.9], "Cape Town", { dx: 14, dy: -8 });
          label(m, [122, 31], "Shanghai", { dx: -12, dy: -10, anchor: "end" });
          label(m, [3.5, 52], "Rotterdam", { dx: 10, dy: -10 });
          label(m, [72.8, 19], "Bombay", { dx: 10, dy: -6 });
          dot(m, [72.8, 19], { r: 5, color: C.mute });
          plot.append(m.svg);
        },
      },
      {
        title: "The biggest container ship afloat",
        subtitle: "Containers carried (TEU)",
        sources: [shipsSource],
        draw: (plot) => {
          const named = new Set(["Ideal X", "MSC Irina"]);
          plot.append(
            sized(SIDE, () =>
              line(
                largestContainerShips.map((d) => ({
                  x: d.year,
                  y: d.teu,
                  name: d.ship === "Ideal X" ? "1956: 58" : `${d.year}: ${fmt(d.teu)}`,
                  show: named.has(d.ship),
                  anchor: d.year < 1960 ? "start" : "end",
                  dx: d.year < 1960 ? 6 : -8,
                  dy: d.year < 1960 ? -14 : -10,
                })),
                {
                  x: [1955, 2026],
                  y: [0, 25000],
                  xTicks: [1960, 1980, 2000, 2020],
                  yTicks: [0, 10000, 20000],
                  step: true,
                  height: 300,
                  band: { from: suezClosure.from, to: suezClosure.to, text: "Suez shut" },
                  label: "Largest container ship capacity over time",
                  tipFormat: (p) => `${p.name} TEU`,
                },
              ),
            ),
          );
        },
      },
      {
        title: "The port leaves the city",
        subtitle: "Dubai's ports, oldest to newest",
        sources: [{ label: "Khalili, pp. 214, 218–219; positions approximate" }],
        draw: (plot) => {
          const m = baseMap({ box: [54.75, 24.8, 55.75, 25.5], width: SIDE, height: 330, regional: true, label: "Dubai Creek, Port Rashid, Jebel Ali and Sharjah" });
          const [creek, rashid, jebel, sharjah] = dubaiPorts;
          flow(m, creek.at, jebel.at, { width: 2, color: C.mute, dash: "5 5", bend: 0.12 });
          dot(m, creek.at, { r: 8, color: C.blue });
          dot(m, rashid.at, { r: 8, color: C.blue });
          dot(m, jebel.at, { r: 14, color: C.red });
          dot(m, sharjah.at, { r: 8, color: C.mute });
          label(m, creek.at, creek.place, { dx: 14, dy: 22, sub: creek.note });
          label(m, rashid.at, rashid.place, { dx: -14, dy: -22, anchor: "end" });
          label(m, jebel.at, jebel.place, { dx: 22, dy: 6, strong: true, sub: jebel.note });
          label(m, sharjah.at, sharjah.place, { dx: 14, dy: -22, sub: sharjah.note });
          plot.append(m.svg);
        },
      },
    ],
  },

  /* ---------- 3. The reading: labour ---------- */
  {
    id: "work",
    name: "Who works the port",
    layout: "pair",
    figures: [
      {
        title: "Who keeps Jabal Ali running",
        subtitle: "Where each job's workers come from, as Khalili lists them",
        sources: [{ label: "Khalili, p. 219" }],
        legend: (Object.keys(tierColor) as Tier[]).map((t) => ({ name: t, color: tierColor[t] })),
        draw: (plot) => {
          const m = baseMap({ box: [-12, -6, 128, 56], ...HALF, label: "Origins of the workforce at Jabal Ali by job" });
          for (const w of workerOrigins) {
            flow(m, w.at, jabalAli, { width: 3.5, color: tierColor[w.tier], bend: w.bend, tip: `${w.from}: ${w.job}` });
            dot(m, w.at, { r: 6, color: tierColor[w.tier], tip: `${w.from}: ${w.job}` });
            label(m, w.at, w.from, { dx: w.dx, dy: w.dy, anchor: w.anchor, sub: w.job });
          }
          dot(m, jabalAli, { r: 9, color: "var(--ink)" });
          plot.append(m.svg);
        },
      },
      {
        title: "Where dockers could fight back",
        subtitle: "Port workers and politics in the Arab world",
        sources: [{ label: "Khalili, pp. 216–217" }],
        legend: [
          { name: dockerPolitics.struck2011.name, color: C.blue },
          { name: dockerPolitics.antiColonial.name, color: C.aqua },
          { name: dockerPolitics.banned.name, color: C.red },
        ],
        draw: (plot) => {
          const fills: Record<string, string> = {};
          for (const id of dockerPolitics.antiColonial.ids) fills[id] = C.aqua;
          for (const id of dockerPolitics.struck2011.ids) fills[id] = C.blue;
          for (const id of dockerPolitics.banned.ids) fills[id] = C.red;
          const m = baseMap({ box: [-14, 11, 62, 40], ...HALF, regional: true, fills, label: "Dockers' strikes and union bans across the Arab world" });
          dot(m, jabalAli, { r: 9, color: "var(--ink)", tip: "Jabal Ali: the region's biggest port" });
          label(m, jabalAli, "Jabal Ali", { dx: -12, dy: 28, anchor: "end", strong: true });
          plot.append(m.svg);
        },
      },
    ],
  },

  /* ---------- 4. Branching out: shipping since COVID ---------- */
  {
    id: "covid",
    name: "Shipping since COVID",
    layout: "lead",
    figures: [
      {
        title: "Six shocks in six years",
        subtitle: "Where world shipping has jammed since 2020",
        sources: [shocksSource],
        draw: (plot) => {
          const m = baseMap({ box: [-128, -40, 134, 60], ...LEAD, label: "Disruptions to world shipping since 2020" });
          route(m, routeViaCape, { color: C.mute, width: 2.5 });
          route(m, routeViaSuez, { color: C.mute, width: 2.5 });
          route(m, routeIntoGulf, { color: C.mute, width: 2.5 });
          for (const x of shocks) {
            dot(m, x.at, { r: 11, color: C.red, tip: `${x.year}, ${x.place}: ${x.what}` });
            label(m, x.at, `${x.year} ${x.place}`, { dx: x.dx, dy: x.dy, anchor: x.anchor, strong: true, sub: x.what });
          }
          plot.append(m.svg);
        },
      },
      {
        title: "The price of moving one box",
        subtitle: "World Container Index, $ per 40ft container",
        sources: [freightSource],
        draw: (plot) =>
          plot.append(
            sized(SIDE, () =>
              line(
                freightRate.map((d) => ({
                  x: d.x,
                  y: d.usd,
                  name: `$${fmt(d.usd)}`,
                  show: d.show,
                  dy: d.usd < 2000 ? 24 : -12,
                  anchor: d.x > 2026 ? "end" : "middle",
                })),
                {
                  x: [2019, 2027],
                  y: [0, 12000],
                  xTicks: [2019, 2021, 2023, 2025],
                  yTicks: [0, 4000, 8000, 12000],
                  height: 300,
                  color: C.red,
                  yFormat: (v) => `$${fmt(v)}`,
                  label: "Container freight rates, 2019 to 2026",
                  tipFormat: (p) => `${freightRate.find((d) => d.x === p.x)?.when}: ${p.name}`,
                },
              ),
            ),
          ),
      },
      {
        title: "Port calls since the war began",
        subtitle: "Change since February 2026",
        sources: [portCallSource],
        draw: (plot) => {
          const shade = (v: number) => (v <= -80 ? "var(--heat3)" : v <= -50 ? "var(--heat2)" : "var(--heat1)");
          const id: Record<string, string> = { Kuwait: "414", UAE: "784", Qatar: "634", Iraq: "368", Bahrain: "048", "Saudi Arabia": "682" };
          const at: Record<string, [number, number]> = {
            Kuwait: [47.6, 29.3], UAE: [55, 21.6], Qatar: [51.2, 25.3], Iraq: [43.8, 33], Bahrain: [50.55, 26.05], "Saudi Arabia": [44.5, 23.5],
          };
          const fills = Object.fromEntries(portCallChange.map((d) => [id[d.country], shade(d.change)]));
          const m = baseMap({ box: [33.5, 15, 60, 35], width: SIDE, height: 420, regional: true, fills, label: "Change in port calls by Gulf state" });
          ring(m, chokepoints["Hormuz"], 11);
          for (const d of portCallChange) {
            const small = d.country === "Bahrain" || d.country === "Qatar" || d.country === "Kuwait";
            label(m, at[d.country], small ? `${d.country} ${d.change}%` : d.country, {
              dx: d.country === "Kuwait" ? 12 : d.country === "Bahrain" ? -10 : d.country === "Qatar" ? 12 : 0,
              dy: d.country === "Kuwait" ? -12 : d.country === "Bahrain" ? 6 : d.country === "Qatar" ? -16 : 0,
              anchor: d.country === "Bahrain" ? "end" : small ? "start" : "middle",
              strong: true,
              sub: small ? undefined : `${d.change}%`,
            });
          }
          plot.append(m.svg);
        },
      },
    ],
  },

  /* ---------- 5. Branching out: The Economist on who owns the gates ---------- */
  {
    id: "scramble",
    name: "The scramble",
    layout: "lead",
    figures: [
      {
        title: "Who is buying which harbour",
        subtitle: "Port deals named in The Economist, coloured by who holds or is buying them",
        sources: [dealsSource],
        legend: blocLegend,
        draw: (plot) => {
          const m = baseMap({ box: [-112, -38, 128, 62], ...LEAD, label: "Port deals around the world by investing bloc" });
          for (const name of ["Panama", "Gibraltar", "Suez", "Hormuz", "Malacca"]) ring(m, chokepoints[name], 16);
          dealDots(m, portDeals, 9);
          label(m, [23.6, 38], "Greece", { dx: 0, dy: 30, anchor: "middle", strong: true });
          plot.append(m.svg);
        },
      },
      {
        title: "One coastline",
        subtitle: "Four Greek ports",
        sources: [economistSource],
        draw: (plot) => {
          const m = baseMap({ box: [19.5, 35.8, 28.5, 41.9], width: SIDE, height: 400, regional: true, label: "Four Greek ports and who holds them" });
          dealDots(m, greekPorts, 11);
          plot.append(m.svg);
        },
      },
      {
        title: "Made in China",
        subtitle: "China's share of the world's port equipment, %",
        sources: [economistSource],
        draw: (plot) =>
          plot.append(
            sized(SIDE, () =>
              barH(
                chinaShares.slice(0, 3).map((d, i) => ({
                  label: ["Containers", "Ships it can track", "Dock cranes"][i],
                  value: d.share,
                  display: `${"atLeast" in d && d.atLeast ? ">" : ""}${d.share}%`,
                  color: C.red,
                  tip: `${d.item}: ${d.by}`,
                })),
                { domain: [0, 100], ticks: [0, 50, 100], rowHeight: 50, labelWidth: 170, label: "China's share of containers, ship tracking and cranes" },
              ),
            ),
          ),
      },
    ],
  },

  /* ---------- 6. Branching out: shipping software and culture ---------- */
  {
    id: "software",
    name: "Shipping software and culture",
    layout: "lead",
    figures: [
      {
        title: "The road the internet takes from Europe to Asia",
        subtitle: "Main undersea cable corridor. Crosses mark cables cut and data centres struck since 2024",
        sources: [cableSource],
        draw: (plot) => {
          const m = baseMap({ box: [-12, -8, 118, 52], ...LEAD, label: "The Europe to Asia undersea cable corridor" });
          route(m, cableRoute, { color: C.orange, width: 5 });
          for (const name of ["Suez", "Bab el-Mandeb", "Hormuz", "Malacca"]) ring(m, chokepoints[name], 16);
          for (const l of cableLandings) {
            dot(m, l.at, { r: 6, color: C.orange, tip: `Cable landing: ${l.place}` });
            if (l.labelled) label(m, l.at, l.place, { dx: l.dx, dy: l.dy, anchor: l.anchor });
          }
          for (const x of struck) strike(m, x.at, 9, x.what);
          label(m, struck[1].at, "Amazon data centres", { dx: 16, dy: 22, strong: true });
          label(m, struck[0].at, "Cables cut", { dx: -16, dy: 4, anchor: "end", strong: true });
          plot.append(m.svg);
        },
      },
      {
        title: "Who owns America's TikTok",
        subtitle: "Stakes in the US venture since January 2026, by owner's home",
        sources: [tiktokOwnersSource],
        draw: (plot) => {
          const colour = { "United States": C.blue, UAE: C.orange, China: C.red };
          const m = baseMap({ box: [-168, 5, 140, 62], width: SIDE, height: 300, label: "Owners of TikTok's US venture by home country" });
          const hub: [number, number] = [-80, 39];
          for (const o of tiktokOwnerHomes) {
            if (o.country !== "United States") flow(m, o.at, hub, { width: o.share * 0.35, color: colour[o.country], bend: -0.22 });
            dot(m, o.at, { r: Math.sqrt(o.share) * 3.2, color: colour[o.country], opacity: 0.85, tip: `${o.name}, ${o.home}: ${o.share}%` });
            label(m, o.at, `${o.name} ${o.share}%`, { dx: o.dx ?? 0, dy: o.dy, anchor: o.anchor ?? "middle", sub: o.home });
          }
          plot.append(m.svg);
        },
      },
      {
        title: "How much passes through one gate",
        subtitle: "Share of each flow, %",
        sources: [gateSharesSource],
        draw: (plot) =>
          plot.append(
            sized(SIDE, () =>
              barH(
                gateShares.map((d) => ({
                  label: { A: "Phone apps", B: "Europe–Asia data", C: "Cloud computing", D: "Crude oil at sea", E: "Gas (LNG) at sea" }[d.key] ?? d.flow,
                  sub: { A: "two operating systems", B: "Red Sea cables", C: "three companies", D: "Strait of Hormuz", E: "Strait of Hormuz" }[d.key],
                  value: d.share,
                  display: `${d.approximate ? "~" : ""}${d.share}%`,
                  color: d.physical ? C.blue : C.orange,
                  tip: `${d.flow} through ${d.gate}`,
                })),
                { domain: [0, 100], ticks: [0, 50, 100], rowHeight: 44, labelWidth: 190, label: "Share of several flows passing through a single gate" },
              ),
            ),
          ),
      },
    ],
  },
];
