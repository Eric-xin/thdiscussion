import type { Source } from "./types";

export type Region = "East & South-East Asia" | "Europe" | "Gulf";

export interface ContainerPort {
  rank: number;
  port: string;
  country: string;
  region: Region;
  /** Throughput in million TEU (twenty-foot equivalent units), 2024. */
  teu2024: number;
}

export const containerPorts2024: ContainerPort[] = [
  { rank: 1, port: "Shanghai", country: "China", region: "East & South-East Asia", teu2024: 51.5 },
  { rank: 2, port: "Singapore", country: "Singapore", region: "East & South-East Asia", teu2024: 41.1 },
  { rank: 3, port: "Ningbo-Zhoushan", country: "China", region: "East & South-East Asia", teu2024: 39.3 },
  { rank: 4, port: "Shenzhen", country: "China", region: "East & South-East Asia", teu2024: 33.4 },
  { rank: 5, port: "Qingdao", country: "China", region: "East & South-East Asia", teu2024: 30.9 },
  { rank: 6, port: "Guangzhou", country: "China", region: "East & South-East Asia", teu2024: 26.1 },
  { rank: 7, port: "Busan", country: "South Korea", region: "East & South-East Asia", teu2024: 24.4 },
  { rank: 8, port: "Tianjin", country: "China", region: "East & South-East Asia", teu2024: 23.3 },
  { rank: 9, port: "Jebel Ali", country: "UAE", region: "Gulf", teu2024: 15.5 },
  { rank: 10, port: "Port Klang", country: "Malaysia", region: "East & South-East Asia", teu2024: 14.6 },
  { rank: 11, port: "Rotterdam", country: "Netherlands", region: "Europe", teu2024: 13.8 },
  { rank: 12, port: "Hong Kong", country: "China", region: "East & South-East Asia", teu2024: 13.7 },
  { rank: 13, port: "Antwerp-Bruges", country: "Belgium", region: "Europe", teu2024: 13.5 },
  { rank: 14, port: "Xiamen", country: "China", region: "East & South-East Asia", teu2024: 12.3 },
  { rank: 15, port: "Tanjung Pelepas", country: "Malaysia", region: "East & South-East Asia", teu2024: 12.3 },
];

export const containerPortsSource: Source = {
  label: "Lloyd's List; World Shipping Council, via Wikipedia",
  url: "https://en.wikipedia.org/wiki/List_of_busiest_container_ports",
};

export interface ShipRecord {
  year: number;
  ship: string;
  /** Capacity in TEU. */
  teu: number;
}

/** Largest (or class-leading) container ship afloat at each date. */
export const largestContainerShips: ShipRecord[] = [
  { year: 1956, ship: "Ideal X", teu: 58 },
  { year: 1968, ship: "First fully cellular ships", teu: 1200 },
  { year: 1972, ship: "Tokyo Bay", teu: 2300 },
  { year: 1981, ship: "Frankfurt Express", teu: 3050 },
  { year: 1984, ship: "US Lines Jumbo Econ", teu: 4458 },
  { year: 1996, ship: "Regina Maersk", teu: 6400 },
  { year: 2006, ship: "Emma Maersk class", teu: 14500 },
  { year: 2013, ship: "Maersk Triple E", teu: 18270 },
  { year: 2017, ship: "OOCL Hong Kong", teu: 21413 },
  { year: 2020, ship: "HMM Algeciras", teu: 23964 },
  { year: 2023, ship: "MSC Irina", teu: 24346 },
];

export const shipsSource: Source = {
  label: "Port Technology International; Rodrigue, Geography of Transport Systems; Wikipedia",
  url: "https://transportgeography.org/contents/chapter5/maritime-transportation/evolution-containerships-classes/",
  note: "Early figures are class capacities and vary by source; Ideal X carried 58 containers of 33 ft.",
};

/** Years the Suez Canal was shut after the 1967 war (Khalili, p. 215). */
export const suezClosure = { from: 1967, to: 1975 };
