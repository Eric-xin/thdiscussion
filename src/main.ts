import "./style.css";
import { hideTip } from "./charts/svg";
import type { Source } from "./data/types";
import { pages, type Figure } from "./pages";

const app = document.querySelector<HTMLDivElement>("#app")!;
let current = 0;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};

function sourceLine(sources: Source[]): HTMLElement {
  const cap = el("figcaption");
  cap.append(sources.length > 1 ? "Sources: " : "Source: ");
  sources.forEach((src, i) => {
    if (i) cap.append("; ");
    if (src.url) {
      const a = el("a", "", src.label);
      a.href = src.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      cap.append(a);
    } else {
      cap.append(src.label);
    }
  });
  const caveats = sources.map((src) => src.note).filter(Boolean);
  if (caveats.length) cap.append(" · ", caveats.join(" "));
  return cap;
}

function figure(f: Figure): HTMLElement {
  const fig = el("figure", "figure");
  fig.append(el("div", "tag"), el("h2", "", f.title), el("p", "sub", f.subtitle));
  if (f.legend) {
    const lg = el("div", "legend");
    for (const item of f.legend) {
      const key = el("span", "key");
      const sw = el("i");
      sw.style.background = item.color;
      key.append(sw, item.name);
      lg.append(key);
    }
    fig.append(lg);
  }
  const plot = el("div", "plot");
  f.draw(plot);
  fig.append(plot, sourceLine(f.sources));
  return fig;
}

function render(): void {
  hideTip();
  const page = pages[current];
  app.replaceChildren();

  const nav = el("nav", "tabs");
  nav.setAttribute("aria-label", "Pages");
  pages.forEach((p, i) => {
    const b = el("button", i === current ? "tab on" : "tab");
    b.type = "button";
    b.append(el("span", "num", String(i + 1)), p.name);
    if (i === current) b.setAttribute("aria-current", "page");
    b.addEventListener("click", () => go(i));
    nav.append(b);
  });
  app.append(nav);

  const grid = el("main", `sheet ${page.layout}`);
  page.figures.forEach((f) => grid.append(figure(f)));
  app.append(grid);

  history.replaceState(null, "", `#${page.id}`);
}

function go(i: number): void {
  current = Math.max(0, Math.min(pages.length - 1, i));
  render();
  window.scrollTo(0, 0);
}

window.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "ArrowRight" || e.key === "PageDown") go(current + 1);
  else if (e.key === "ArrowLeft" || e.key === "PageUp") go(current - 1);
  else if (/^[1-9]$/.test(e.key)) go(Number(e.key) - 1);
});

const start = pages.findIndex((p) => p.id === location.hash.slice(1));
go(start < 0 ? 0 : start);
