# Portfolio 98 — Loïck Rivemale

A Windows 98 desktop as a portfolio. Static site: no backend, no build step, no package
manager. React and Babel load from a CDN at runtime; everything else is local and
referenced with **relative** paths, so the site works from any base URL — a user page, a
project page under a subpath, or a custom domain.

> **Before deploying:** `assets/videos/` must contain `Landing.mp4` (welcome-screen showreel),
> `freelance.mp4` (Read Me reel) and `EP1Website.mp4` (Sieur Flamme teaser). They are not
> in this archive. Each has a graceful fallback if missing, but the welcome melt reveals a
> placeholder gradient instead of the reel.

## Layout

```
index.html            desktop shell — windows, taskbar, start menu, wiring
cv.html               plain-text CV (crawlable, printable)
legal.html            imprint / legal notice
404.html              Win98 error dialog for unknown URLs
CNAME                 custom domain (loick.rivemale.space)
favicon-32.png apple-touch-icon.png
robots.txt sitemap.xml llms.txt
.nojekyll             serve every file verbatim (needed for .jsx)
styles/win98.css      shared Win98 primitives (chrome, buttons, scrollbars)
app/                  runtime modules, loaded by index.html in this order
  image-slot.js         image drop slots
  welcome-melt.jsx      boot/welcome transition
  pixel-icons.jsx       pixel icon set
  cloud-shader.jsx      animated cloud wallpaper
  word-art.jsx          WordArt headings
  contact-window.jsx    Contact
  legal-window.jsx      Legal
  readme-window.jsx     Read Me
  tech-stack.jsx        Tech stack
  education-window.jsx  Studies
  experience-window.jsx Work timeline + detail panel
  project-window.jsx    project windows and galleries
  videos-player.jsx     video player (disabled for launch — see index.html)
  pipes-saver.jsx       3D Pipes screensaver
  clappy-assistant.jsx  desktop assistant
assets/
  icons/              desktop, taskbar and start-menu icons
  tech/               technology badges
  ui/                 cursors, wallpaper, assistant sprite
  work/               employment / timeline imagery
  projects/           per-project galleries (arcana, art, enable,
                      sieur-flamme, terrain, title, xnoise)
  videos/             Landing.mp4, freelance.mp4, EP1Website.mp4 (supply these)
files/                downloads (resume PDF, ARCANA rules addendum)

```

## Deploy

1. Push the **contents of this folder** (not the folder itself) to the branch you serve —
   `index.html` must sit at the branch root.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick the
   branch and `/ (root)`, Save.
3. **Settings → Pages → Custom domain**: `loick.rivemale.space`, then tick **Enforce HTTPS**
   once the certificate is issued (a few minutes).
4. DNS at your registrar: a `CNAME` record for the `loick` subdomain pointing at
   `USERNAME.github.io.` — no A records needed for a subdomain.

The `CNAME` file in this folder holds the domain so it survives every push; without it, a
force-push can silently reset the custom domain.

`.nojekyll` keeps Jekyll from touching the tree, which is what lets the `.jsx` modules be
served as-is.

## Editing the CV

`cv.html` is the single source of truth for career content — it is what search engines and
AI crawlers actually read. When something changes (new role, new skill), edit `cv.html`,
and only if the headline changes, update:

- the `<meta name="description">` and `og:description` in `index.html` and `cv.html`
- the summary blockquote in `llms.txt`
- the `<noscript>` one-liner in `index.html`

The `ProfilePage` JSON-LD lives only in `cv.html`; `index.html` carries a small `Person`
stub that never needs touching.

## Site URL

Absolute URLs appear only in SEO metadata: `<link rel="canonical">`, the `og:`/`twitter:`
tags and the JSON-LD block in `index.html` and `cv.html`, plus `sitemap.xml`, `robots.txt`
and `llms.txt`. They are set to `https://loick.rivemale.space/`, matching `CNAME`.

If the domain ever changes:

```bash
grep -rl 'loick.rivemale.space' . | xargs sed -i 's|loick.rivemale.space|NEW.DOMAIN|g'
```

## Run locally

`file://` URLs cannot load the `.jsx` modules — serve over HTTP:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```
