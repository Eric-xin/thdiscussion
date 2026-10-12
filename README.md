# What is a port?

Figures for leading a discussion of Laleh Khalili, "Ports of the Persian Gulf" (2021), built mostly from maps. Three pages follow the reading; three branch out to shipping since COVID, The Economist's "The global scramble for ports", and software and culture as things that are shipped. The site is six pages of figures and nothing else.

## Run

```sh
npm install
npm run dev      # local, with hot reload
npm run build    # static site in dist/
npm run preview  # serve the build
```

`dist/` is plain static files with relative paths, so it deploys anywhere: drag it onto Netlify, run `npx vercel dist`, or push it to GitHub Pages.

## Controls

- `→` / `←` or the number keys `1`–`6`: change page
- Hover a mark for its exact value
- Link straight to a page: `#ports`, `#canal`, `#work`, `#covid`, `#scramble`, `#software`

## Where things live

- `src/data/` — every number on screen, typed, with its source and caveats
- `src/charts/` — the SVG chart and map functions (`map.ts` uses d3-geo and world-atlas)
- `src/pages.ts` — the six pages and the figures on each

To change a figure, edit its data file. To add one, add an entry to a page in `src/pages.ts`.
