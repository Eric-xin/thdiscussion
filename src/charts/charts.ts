import { barPath, canvas, fmt, linear, s, tip } from "./svg";

let W = 800;

/** Draw a chart at a narrower canvas width, for the side column. */
export function sized<T>(width: number, draw: () => T): T {
  const old = W;
  W = width;
  try {
    return draw();
  } finally {
    W = old;
  }
}

export const C = {
  blue: "var(--s1)",
  orange: "var(--s2)",
  aqua: "var(--s3)",
  yellow: "var(--s4)",
  magenta: "var(--s5)",
  red: "var(--hi)",
  mute: "var(--mute)",
};

/* ---------- horizontal bars ---------- */

export interface BarItem {
  label: string;
  value: number;
  color?: string;
  /** Text at the bar's end; defaults to the value. */
  display?: string;
  tip?: string;
  strong?: boolean;
  /** Second line under the label. */
  sub?: string;
}

export interface BarOpts {
  domain: [number, number];
  ticks: number[];
  labelWidth?: number;
  rowHeight?: number;
  tickFormat?: (v: number) => string;
  label: string;
}

export function barH(items: BarItem[], o: BarOpts): SVGSVGElement {
  const lw = o.labelWidth ?? 170;
  const row = o.rowHeight ?? 26;
  const top = 26;
  const H = top + items.length * row + 8;
  const svg = canvas(W, H, o.label);
  const x = linear(o.domain[0], o.domain[1], lw, W - 56);
  const tf = o.tickFormat ?? ((v: number) => fmt(v));

  for (const t of o.ticks) {
    svg.append(
      s("line", { x1: x(t), x2: x(t), y1: top - 4, y2: H - 4, class: t === 0 ? "axis" : "grid" }),
      s("text", { x: x(t), y: 14, class: "tick", "text-anchor": "middle" }, tf(t)),
    );
  }

  items.forEach((d, i) => {
    const y = top + i * row;
    const bh = row - 8;
    const x0 = x(0);
    const x1 = x(d.value);
    const neg = d.value < 0;
    const bar = s("path", {
      d: barPath(Math.min(x0, x1), y + 2, Math.abs(x1 - x0), bh, neg ? "left" : "right"),
      fill: d.color ?? C.blue,
    });
    const hit = s("rect", { x: 0, y, width: W, height: row, fill: "transparent" });
    tip(hit, d.tip ?? `${d.label}: ${d.display ?? fmt(d.value)}`);
    svg.append(
      s("text", { x: lw - 10, y: y + bh / 2 + (d.sub ? -2 : 7), class: d.strong ? "label strong" : "label", "text-anchor": "end" }, d.label),
      bar,
      s(
        "text",
        { x: neg ? x1 - 6 : x1 + 6, y: y + bh / 2 + 7, class: d.strong ? "value strong" : "value", "text-anchor": neg ? "end" : "start" },
        d.display ?? fmt(d.value),
      ),
    );
    if (d.sub) svg.append(s("text", { x: lw - 10, y: y + bh / 2 + 16, class: "tick", "text-anchor": "end" }, d.sub));
    svg.append(hit);
  });
  return svg;
}

/* ---------- vertical columns ---------- */

export interface ColItem {
  label: string;
  value: number;
  color?: string;
  display?: string;
  tip?: string;
  /** Drawn hatched: the period is incomplete. */
  partial?: boolean;
}

export interface ColOpts {
  max: number;
  ticks: number[];
  height?: number;
  tickFormat?: (v: number) => string;
  /** Horizontal reference line. */
  ref?: { value: number; text: string };
  /** Notes pinned above a column. */
  notes?: { index: number; text: string; row?: number }[];
  showValues?: boolean;
  label: string;
}

export function columns(items: ColItem[], o: ColOpts): SVGSVGElement {
  const H = o.height ?? 400;
  const m = { top: o.notes?.length ? 64 : 26, right: 16, bottom: 30, left: 12 };
  const svg = canvas(W, H, o.label);
  const y = linear(0, o.max, H - m.bottom, m.top);
  const band = (W - m.left - m.right - 40) / items.length;
  const bw = Math.min(64, band * 0.62);
  const cx = (i: number) => m.left + 40 + band * i + band / 2;
  const tf = o.tickFormat ?? ((v: number) => fmt(v));

  for (const t of o.ticks) {
    svg.append(
      s("line", { x1: m.left, x2: W - m.right, y1: y(t), y2: y(t), class: t === 0 ? "axis" : "grid" }),
      s("text", { x: m.left, y: y(t) - 5, class: "tick" }, tf(t)),
    );
  }

  items.forEach((d, i) => {
    const top = y(d.value);
    const bar = s("path", {
      d: barPath(cx(i) - bw / 2, top, bw, y(0) - top, "top"),
      fill: d.color ?? C.blue,
      "fill-opacity": d.partial ? 0.55 : 1,
    });
    const hit = s("rect", { x: cx(i) - band / 2, y: m.top, width: band, height: H - m.top, fill: "transparent" });
    tip(hit, d.tip ?? `${d.label}: ${d.display ?? fmt(d.value)}`);
    svg.append(bar, s("text", { x: cx(i), y: H - 8, class: "label", "text-anchor": "middle" }, d.label));
    if (o.showValues) {
      svg.append(s("text", { x: cx(i), y: top - 7, class: "value", "text-anchor": "middle" }, d.display ?? fmt(d.value)));
    }
    svg.append(hit);
  });

  if (o.ref) {
    svg.append(
      s("line", { x1: m.left, x2: W - m.right, y1: y(o.ref.value), y2: y(o.ref.value), class: "ref" }),
      s("text", { x: W - m.right, y: y(o.ref.value) - 7, class: "note", "text-anchor": "end" }, o.ref.text),
    );
  }

  for (const n of o.notes ?? []) {
    const d = items[n.index];
    const anchor = n.index > items.length - 3 ? "end" : "start";
    const tx = anchor === "end" ? cx(n.index) + bw / 2 : cx(n.index) - bw / 2;
    const ty = 38 - (n.row ?? 0) * 22;
    svg.append(
      s("line", { x1: cx(n.index), x2: cx(n.index), y1: ty + 8, y2: y(d.value) - (o.showValues ? 24 : 6), class: "leader" }),
      s("text", { x: tx, y: ty, class: "note strong", "text-anchor": anchor }, n.text),
    );
  }
  return svg;
}

/* ---------- line / step ---------- */

export interface Pt {
  x: number;
  y: number;
  name?: string;
  /** Label this point directly on the chart. */
  show?: boolean;
  dx?: number;
  dy?: number;
  anchor?: "start" | "end" | "middle";
}

export interface LineOpts {
  x: [number, number];
  y: [number, number];
  xTicks: number[];
  yTicks: number[];
  step?: boolean;
  height?: number;
  color?: string;
  yFormat?: (v: number) => string;
  band?: { from: number; to: number; text: string };
  label: string;
  tipFormat?: (p: Pt) => string;
}

export function line(points: Pt[], o: LineOpts): SVGSVGElement {
  const H = o.height ?? 400;
  const m = { top: 30, right: 28, bottom: 30, left: 12 };
  const svg = canvas(W, H, o.label);
  const x = linear(o.x[0], o.x[1], m.left + 30, W - m.right);
  const y = linear(o.y[0], o.y[1], H - m.bottom, m.top);
  const yf = o.yFormat ?? ((v: number) => fmt(v));
  const color = o.color ?? C.blue;

  if (o.band) {
    svg.append(
      s("rect", { x: x(o.band.from), y: m.top, width: x(o.band.to) - x(o.band.from), height: H - m.bottom - m.top, class: "band" }),
      s("text", { x: x(o.band.from) + 6, y: m.top + 18, class: "note strong" }, o.band.text),
    );
  }
  for (const t of o.yTicks) {
    svg.append(
      s("line", { x1: m.left, x2: W - m.right, y1: y(t), y2: y(t), class: t === o.y[0] ? "axis" : "grid" }),
      s("text", { x: m.left, y: y(t) - 5, class: "tick" }, yf(t)),
    );
  }
  for (const t of o.xTicks) {
    svg.append(s("text", { x: x(t), y: H - 8, class: "tick", "text-anchor": "middle" }, String(t)));
  }

  let d = "";
  points.forEach((p, i) => {
    if (i === 0) d += `M${x(p.x)},${y(p.y)}`;
    else if (o.step) d += `H${x(p.x)}V${y(p.y)}`;
    else d += `L${x(p.x)},${y(p.y)}`;
  });
  if (o.step) d += `H${x(o.x[1])}`;
  svg.append(s("path", { d, fill: "none", stroke: color, "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round" }));

  for (const p of points) {
    const dot = s("circle", { cx: x(p.x), cy: y(p.y), r: 5, fill: color, class: "pt" });
    const hit = s("circle", { cx: x(p.x), cy: y(p.y), r: 16, fill: "transparent" });
    tip(hit, o.tipFormat ? o.tipFormat(p) : `${p.x}: ${yf(p.y)}`);
    svg.append(dot);
    if (p.show) {
      svg.append(
        s(
          "text",
          { x: x(p.x) + (p.dx ?? 0), y: y(p.y) + (p.dy ?? -12), class: "note", "text-anchor": p.anchor ?? "middle" },
          p.name ?? yf(p.y),
        ),
      );
    }
    svg.append(hit);
  }
  return svg;
}

/* ---------- one stacked bar ---------- */

export interface StackItem {
  name: string;
  share: number;
  color: string;
  note?: string;
}

export function stacked(items: StackItem[], o: { reveal: boolean; label: string; unit?: string }): SVGSVGElement {
  const H = 132;
  const svg = canvas(W, H, o.label);
  const total = items.reduce((a, d) => a + d.share, 0);
  const x = linear(0, total, 0, W);
  let acc = 0;
  for (const d of items) {
    const x0 = x(acc);
    const w = x(acc + d.share) - x0;
    acc += d.share;
    // A narrow final segment labels from its right edge so the text stays inside the chart.
    const flip = d === items[items.length - 1] && w < 160;
    const anchor = flip ? "end" : "start";
    const tx = flip ? x0 + w - 2 : x0 + 4;
    const seg = s("rect", { x: x0 + 1, y: 34, width: Math.max(0, w - 2), height: 44, rx: 2, fill: d.color });
    tip(seg, o.reveal ? `${d.name}: ${fmt(d.share, d.share % 1 ? 1 : 0)}%${d.note ? ` (${d.note})` : ""}` : `${fmt(d.share, d.share % 1 ? 1 : 0)}%`);
    svg.append(
      seg,
      s("text", { x: tx, y: 24, class: "value strong", "text-anchor": anchor }, `${fmt(d.share, d.share % 1 ? 1 : 0)}%`),
      s("text", { x: tx, y: 100, class: "label", "text-anchor": anchor }, o.reveal ? d.name : "?"),
    );
    if (o.reveal && d.note) svg.append(s("text", { x: tx, y: 120, class: "tick", "text-anchor": anchor }, d.note));
  }
  return svg;
}

/* ---------- unit pictograms ---------- */

/** Two grids of dots: every unit on the left, only `filled` of them on the right. */
export function dotPair(o: { total: number; filled: number; left: string; right: string; label: string }): SVGSVGElement {
  const cols = 10;
  const rows = Math.ceil(o.total / cols);
  const gap = 30;
  const gridW = cols * gap;
  const H = rows * gap + 70;
  const svg = canvas(W, H, o.label);
  const draw = (ox: number, filled: number, text: string) => {
    for (let i = 0; i < o.total; i++) {
      const on = i < filled;
      svg.append(
        s("circle", {
          cx: ox + (i % cols) * gap + gap / 2,
          cy: 10 + Math.floor(i / cols) * gap + gap / 2,
          r: 9,
          fill: on ? C.blue : "none",
          class: on ? "" : "ghost",
        }),
      );
    }
    svg.append(s("text", { x: ox + gridW / 2, y: H - 14, class: "label strong", "text-anchor": "middle" }, text));
  };
  const pad = (W - 2 * gridW) / 3;
  draw(pad, o.total, o.left);
  draw(pad * 2 + gridW, o.filled, o.right);
  return svg;
}

/** A row of labelled blocks, some knocked out. */
export function blocks(items: { name: string; out: boolean }[], o: { reveal: boolean; label: string }): SVGSVGElement {
  const H = 130;
  const svg = canvas(W, H, o.label);
  const bw = 150;
  const gap = 28;
  const ox = (W - (items.length * bw + (items.length - 1) * gap)) / 2;
  items.forEach((d, i) => {
    const x0 = ox + i * (bw + gap);
    const out = d.out;
    svg.append(
      s("rect", { x: x0, y: 8, width: bw, height: 76, rx: 4, fill: out ? "none" : C.blue, class: out ? "ghost" : "" }),
      s("text", { x: x0 + bw / 2, y: 108, class: "label", "text-anchor": "middle" }, d.name),
    );
    if (out) {
      svg.append(
        s("line", { x1: x0 + 50, y1: 26, x2: x0 + 100, y2: 66, class: "cross" }),
        s("line", { x1: x0 + 100, y1: 26, x2: x0 + 50, y2: 66, class: "cross" }),
      );
      if (o.reveal) svg.append(s("text", { x: x0 + bw / 2, y: 126, class: "tick", "text-anchor": "middle" }, "struck by drone, 1 March"));
    }
  });
  return svg;
}
