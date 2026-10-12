import { geoEqualEarth, geoMercator, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import coarse from "world-atlas/countries-110m.json";
import fine from "world-atlas/countries-50m.json";
import { s, tip } from "./svg";

export type LonLat = [number, number];

export interface MapSpec {
  /** Area to show: [west, south, east, north]. */
  box: [number, number, number, number];
  width: number;
  height: number;
  /** Regional maps use finer coastlines and a Mercator projection. */
  regional?: boolean;
  /** Fill colour by ISO numeric country id. */
  fills?: Record<string, string>;
  label: string;
}

export interface MapCanvas {
  svg: SVGSVGElement;
  width: number;
  height: number;
  at(p: LonLat): [number, number];
}

function countries(topology: unknown): FeatureCollection<Geometry> {
  const topo = topology as Topology<{ countries: GeometryCollection }>;
  return feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
}

const worldCoarse = countries(coarse);
const worldFine = countries(fine);

export function baseMap(spec: MapSpec): MapCanvas {
  const [w, so, e, n] = spec.box;
  const midLon = (w + e) / 2;
  const frame = {
    type: "MultiPoint" as const,
    coordinates: [
      [w, so], [e, so], [w, n], [e, n], [midLon, so], [midLon, n], [w, (so + n) / 2], [e, (so + n) / 2],
    ],
  };
  const projection: GeoProjection = (spec.regional ? geoMercator() : geoEqualEarth())
    .rotate([-midLon, 0])
    .fitExtent([[0, 0], [spec.width, spec.height]], frame);
  const path = geoPath(projection);

  const svg = s("svg", {
    viewBox: `0 0 ${spec.width} ${spec.height}`,
    role: "img",
    "aria-label": spec.label,
    class: "plot-svg map-svg",
  });
  const land = s("g", { class: "land" });
  for (const f of (spec.regional ? worldFine : worldCoarse).features) {
    if (f.id === "010") continue; // Antarctica
    const d = path(f);
    if (!d) continue;
    const fill = spec.fills?.[String(f.id)];
    land.append(s("path", { d, class: "country", style: fill ? `fill:${fill}` : undefined }));
  }
  svg.append(land);
  return { svg, width: spec.width, height: spec.height, at: (p) => projection(p) as [number, number] };
}

export function dot(m: MapCanvas, p: LonLat, o: { r: number; color: string; tip?: string; opacity?: number }): void {
  const [x, y] = m.at(p);
  const c = s("circle", { cx: x, cy: y, r: o.r, fill: o.color, "fill-opacity": o.opacity ?? 1, class: "map-dot" });
  if (o.tip) {
    const hit = s("circle", { cx: x, cy: y, r: Math.max(o.r, 12), fill: "transparent" });
    tip(hit, o.tip);
    m.svg.append(c, hit);
  } else {
    m.svg.append(c);
  }
}

export interface LabelOpts {
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
  strong?: boolean;
  /** Smaller second line. */
  sub?: string;
}

export function label(m: MapCanvas, p: LonLat, text: string, o: LabelOpts = {}): void {
  const [x, y] = m.at(p);
  const tx = x + (o.dx ?? 10);
  const ty = y + (o.dy ?? 5);
  m.svg.append(s("text", { x: tx, y: ty, class: o.strong ? "map-label strong" : "map-label", "text-anchor": o.anchor ?? "start" }, text));
  if (o.sub) m.svg.append(s("text", { x: tx, y: ty + 17, class: "map-label small", "text-anchor": o.anchor ?? "start" }, o.sub));
}

/** A curved arrow-less flow between two places; width carries the quantity. */
export function flow(m: MapCanvas, from: LonLat, to: LonLat, o: { width: number; color: string; bend?: number; dash?: string; tip?: string }): void {
  const [x0, y0] = m.at(from);
  const [x1, y1] = m.at(to);
  const bend = o.bend ?? 0.2;
  const cx = (x0 + x1) / 2 - (y1 - y0) * bend;
  const cy = (y0 + y1) / 2 + (x1 - x0) * bend;
  const path = s("path", {
    d: `M${x0},${y0}Q${cx},${cy} ${x1},${y1}`,
    class: "map-line",
    stroke: o.color,
    "stroke-width": o.width,
    "stroke-dasharray": o.dash,
    "stroke-opacity": 0.85,
  });
  if (o.tip) tip(path, o.tip);
  m.svg.append(path);
}

/** A smoothed line through waypoints, for sea routes. */
export function route(m: MapCanvas, points: LonLat[], o: { color: string; width?: number; dash?: string }): void {
  const p = points.map((q) => m.at(q));
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i][0] + p[i + 1][0]) / 2;
    const my = (p[i][1] + p[i + 1][1]) / 2;
    d += `Q${p[i][0]},${p[i][1]} ${mx},${my}`;
  }
  d += `L${p[p.length - 1][0]},${p[p.length - 1][1]}`;
  m.svg.append(s("path", { d, class: "map-line", stroke: o.color, "stroke-width": o.width ?? 3, "stroke-dasharray": o.dash }));
}

/** An open ring marking a chokepoint. */
export function ring(m: MapCanvas, p: LonLat, r = 13): void {
  const [x, y] = m.at(p);
  m.svg.append(s("circle", { cx: x, cy: y, r, class: "map-ring" }));
}

/** A cross marking something struck or cut. */
export function strike(m: MapCanvas, p: LonLat, size = 8, tipText?: string): void {
  const [x, y] = m.at(p);
  const g = s("g", {});
  g.append(
    s("line", { x1: x - size, y1: y - size, x2: x + size, y2: y + size, class: "cross" }),
    s("line", { x1: x + size, y1: y - size, x2: x - size, y2: y + size, class: "cross" }),
  );
  if (tipText) {
    const hit = s("circle", { cx: x, cy: y, r: size + 8, fill: "transparent" });
    tip(hit, tipText);
    g.append(hit);
  }
  m.svg.append(g);
}
