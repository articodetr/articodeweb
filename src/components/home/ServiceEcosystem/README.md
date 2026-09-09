# Service ecosystem

`ServicesGrid.tsx` retains the homepage expertise anchor and shared heading, and
uses the existing localized service content for all nine specialties. The five
scene buttons and four additional buttons select the adjacent details panel.

`ServiceEcosystem.tsx` renders the scene and owns a scoped GSAP matchMedia context.
The 3.75-second ScrollTrigger entrance reveals the hub, staggers the modules,
draws SVG cables, then enables floating and data pulses. Hover and keyboard focus
highlight one connection and speed its pulse. Loops pause offscreen, in hidden
tabs, or with the pause button. Reduced motion shows the complete static scene.
All GSAP work and event listeners are reverted on unmount or media changes.

`services.ts` contains physical coordinates, paths, asset names and motion timing.
Desktop uses a 720 × 650 viewBox; phones below 640px use 600 × 1240 with the hub
above two rows of modules and a final centered module. The scene is LTR while
labels follow the current language, so Arabic never mirrors cable coordinates.
Layout and viewBox coordinates scale together without a resize listener.

## Assets

Original transparent PNGs are in `public/services/`, together with 384px and
768px WebP renditions (quality 86, alpha preserved). Responsive picture sources,
lazy loading and explicit square dimensions avoid oversized downloads and shifts.

| Asset | Role |
| --- | --- |
| center-hub | ArtiCode hub |
| software | Software systems |
| mobile | Mobile apps |
| iot | IoT |
| seo | SEO |
| No supplied web asset | Glass browser built with DOM/CSS and Lucide icons |

To replace the web fallback, add `web.png`, `web-384.webp`, `web-768.webp` and set
the web item's `image` to `'web'`. To add another scene service, use its existing
content id in the array, supply both positions and paths, and leave clear room
for its label. It automatically moves out of the additional-specialties list.
Update the mobile viewBox and CSS aspect ratio together if extending the canvas.

## Verification

Run `npm run typecheck`, `npm run lint`, and `npm run build`.
In the browser check Arabic and English at desktop, tablet, and 320–390px phone
widths; hover, Tab/Enter, selection of all nine services, pause/resume, scrolling
away and back, breakpoint changes, and reduced motion. Verify touch interactions
and SVG glow on a physical phone/Safari before publishing.
