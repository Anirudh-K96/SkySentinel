# StratoRelief — Academic Presentation Site

A single‑page, scroll‑snap “presentation” website showcasing how AI‑powered drones could support disaster management. Built with semantic HTML5, modern CSS, and vanilla JavaScript. This is a mock demo for learning purposes — not a commercial product.

Important: This is a college/academic project. All content is illustrative. No real service is offered.

## Quick Start

- Open `index.html` in any modern browser.
- No build step, server, or network calls required. Everything runs offline.

## Features

- Scroll‑snap slides (8 sections) with lightweight fade/slide entrances
- Sticky header, collapsible Table of Contents (TOC) sidebar, slide counter
- Keyboard navigation (Left/Right, Home/End), Prev/Next buttons
- Light/Dark theme toggle (respects `prefers-reduced-motion`)
- GSAP + ScrollTrigger animations (subtle, reduced when motion is disabled)
- Use‑case tabs with realistic imagery
- Before/After comparison slider with a proper draggable handle
- Impact counters with sourced figures (EM‑DAT, NOAA)
- Print‑friendly handout view (use your browser’s Print dialog)
- Accessibility: landmarks, ARIA for tabs/accordion, visible focus styles

## Tech Stack

- HTML: semantic sections (header, nav, main, section, footer)
- CSS: custom properties (variables), glass UI, grid/noise bg, responsive layout
- JS (vanilla): modular init functions in `app.js`
  - GSAP + ScrollTrigger (CDN)
  - Lenis present but disabled to preserve scroll‑snap behavior

## Project Structure

```
index.html        # Single‑page site
styles.css        # Theme, layout, animations, print styles
app.js            # Interactions: nav, tabs, counters, slider, etc.
assets/
  logo.svg
  icons/          # UI icons (SVG)
  usecases/       # Realistic images for the Use Cases section
  before-after/   # Photo assets if you add matched pairs later
  hero-cover.jpg  # Hero photo (Wikimedia Commons)
```

## Content & Sources

- Facts/metrics are for demonstration only. Current references include:
  - EM‑DAT: The International Disaster Database — https://www.emdat.be
  - NOAA NCEI Billion‑Dollar Disasters — https://www.ncei.noaa.gov/access/billions/
  - UN OCHA, UNDRR GAR, NIST references for academic framing
- Use‑case and hero photos are stored locally for offline use. Source badges link to Wikimedia Commons pages for attribution.

## Customization

- Theme: update CSS variables in `:root` at the top of `styles.css`.
- Hero image: replace `assets/hero-cover.jpg` with your own; keep dimensions similar for best results.
- Use‑case images: swap files in `assets/usecases/`; images are framed at 16:9.
- Before/After: the compare slider accepts any two images. Replace the two `<img>` in the Gallery section.
- Animations: tweak or disable in `app.js` (`initHeroAnim`, `initScrollAnims`, `initCounters`).

## Accessibility

- Keyboard: tab focus, Left/Right on slides, Home/End, arrow buttons
- Tabs: proper `role="tablist"`/`tab`/`tabpanel` with active state management
- Accordion (FAQ): ARIA states + keyboard support
- Color contrast: tuned for both themes; visible focus rings

## Performance

- Fully static, CDN libraries only for GSAP/ScrollTrigger
- Lazy loading applied to non‑critical images (except compare images)
- CSS/JS are small and hand‑rolled; no frameworks or bundlers

## Printing / Export

- A print stylesheet (`@media print`) converts slides to a clean handout.
- Use your browser’s Print dialog (Ctrl/Cmd + P) to save as PDF if desired.
- Note: The explicit “Export” buttons were removed to keep the site non‑commercial.

## Known Limitations

- Real imagery may vary in aspect and composition; we normalize with 16:9 frames and `object-fit: cover`.
- Some animations depend on GSAP; if blocked by network policy, content still renders without motion.

## License & Disclaimer

- This repository is provided for educational use as a college project. No warranties.
- External images are from Wikimedia Commons and may carry their own licenses; check each source link before reuse.

---
Made by Anirudh Kosgi — Academic Presentation
