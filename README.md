# Amit91-VB.github.io

A single-page landing site presenting **Mindset Consulting**'s brand and what the
firm does: SAP experience design for the AI era.

Built on the **`@mindsetconsulting/brand`** design system (v0.3.3) - the same
tokens, type, color, and logos every Mindset web project shares. All brand
decisions follow `BRAND.md` (voice, color, typography, logos, motion, spacing)
and `A11Y.md` (WCAG 2.1 AA).

## Tech

- Static HTML + a Tailwind v4 stylesheet compiled from the brand package.
- Type: Source Serif 4 / Switzer / IBM Plex Mono (committed brand stack).
- No runtime framework; `app.js` is progressive enhancement only
  (scroll reveal, counters, nav `{M}` hand-off). Fully readable without JS.

## Build

The compiled `styles.css` is committed so GitHub Pages serves it directly.
To rebuild after editing markup, from the sibling `build/` project:

```bash
npm install          # installs @mindsetconsulting/brand + Tailwind v4
npm run build:css    # compiles ../site/styles.css
```

## Content provenance

Copy is verbatim public-positioning from the brand system. Internal-only
material (rejected product names, roadmap tiers, revenue targets) is
deliberately excluded.
