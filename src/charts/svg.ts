const NS = "http://www.w3.org/2000/svg";

type Attrs = Record<string, string | number | undefined>;

/** Create an SVG element with attributes and children. */
export function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: (SVGElement | string)[]
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined) el.setAttribute(k, String(v));
  }
  for (const c of children) el.append(c);
  return el;
}

export function canvas(width: number, height: number, label: string): SVGSVGElement {
  return s("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": label,
    class: "plot-svg",
  });
}

/** Linear scale. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Bar path with rounded corners on the data end only. */
export function barPath(x: number, y: number, w: number, h: number, end: "right" | "left" | "top"): string {
  const r = Math.min(4, Math.abs(end === "top" ? h : w) / 2, Math.abs(end === "top" ? w : h) / 2);
  if (end === "top") {
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }
  if (end === "right") {
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }
  return `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`;
}

let tipEl: HTMLDivElement | null = null;

/** Attach a hover tooltip to a mark. */
export function tip(el: SVGElement, text: string): void {
  el.addEventListener("pointerenter", () => {
    if (!tipEl) {
      tipEl = document.createElement("div");
      tipEl.className = "tooltip";
      document.body.append(tipEl);
    }
    tipEl.textContent = text;
    tipEl.hidden = false;
  });
  el.addEventListener("pointermove", (e) => {
    if (!tipEl) return;
    const x = Math.min(e.clientX + 14, window.innerWidth - tipEl.offsetWidth - 8);
    tipEl.style.left = `${Math.max(8, x)}px`;
    tipEl.style.top = `${e.clientY + 16}px`;
  });
  el.addEventListener("pointerleave", () => {
    if (tipEl) tipEl.hidden = true;
  });
}

export function hideTip(): void {
  if (tipEl) tipEl.hidden = true;
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });
