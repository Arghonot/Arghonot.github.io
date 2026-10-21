# awwCopy: design notes

A refinement of the live site, not a redesign. Same concept, assets, copy and stack
(plain React + esbuild, as in the main repo). Built against the /awwwards quality bar.

## Brief
- Subject: Loïck Rivemale, Unity XR and rendering engineer, 8+ years (Retinize, Airbus DS, freelance AR).
- Audience: studios and clients hiring for XR, rendering, tools.
- Job: get hired / booked. Show the work fast, make contact one click away.
- Constraint from the owner: keep the Windows 98 aesthetic and visual identity closely.

## Concept card (kept from the live site)
```
Idea:        the portfolio is the engineer's own Windows 98 desktop
Metaphor:    a late-90s PC: desktops per topic, Explorer windows, taskbar, error dialogs
Signature:   the dithered wallpaper dissolve when a desk changes (existing welcome-melt)
Emotion:     first 3 s: "I know this machine", then "this person builds real things"
Motion verb: press like a bevel / select like Explorer (navy flood, inset bevel, 1px nudge)
Screenshot:  the Professional desk: colour-coded career timeline beside a case-study window
```
Anchor: a graphics engineer who grew up on these machines and now builds the GPU/XR layer under them.

## System (inherited, codified)
- Palette: face #c0c0c0 (ground), ink #000, muted #404040 (was #5a5a5a, fails AA on face),
  line #808080 / #fff bevels, selection #000080 (accent), desk wallpapers per topic.
- Type: system Tahoma/MS Sans stack for chrome, Courier New for data, WordArt for display.
- Shape: no radius anywhere. Bevels, not shadows.
- Motion: steps() and short (120 to 250 ms) for chrome, like the real OS. The dissolve is the
  only long transition.

## Interaction treatments (one per role)
- Buttons (grey): hover = dotted focus rect; press = inset bevel + 1px nudge.
- Primary blue CTAs: hover = brighten + arrow slides 4px; press = inset.
- Rows, cards, thumbnails, icons: hover = navy selection flood or navy frame (Explorer select).
- Title-bar buttons: hover = beige face.
- Focus-visible everywhere: 1px dotted black rect inset (Win98 focus), never removed.

## Idle state
Decision: desktops are still at rest, like a real OS; the welcome video and Clappy carry the
life. Reduced motion pauses all video.

## Changes vs live site (log)
See the bottom of this file; appended per pass.

### Pass 1 (critic 6.7)
- One h1 per route (sr-only, follows the router), unique <title> per route, <main>, skip link, zoom allowed, 155-char description.
- Desktop icons, taskbar, Start and tech items are keyboard targets (role=button, Enter/Space).
- Win98 dotted focus rect on every focusable; contrast dim text 3.79:1 -> 5.1:1.
- Reduced motion: videos paused, clouds still, melt and screensaver skipped.
- image-slot.js (64 KB design-tool widget) replaced by a sized 44 KB WebP portrait.
- Landing.mp4 (7 MB) and the reel (9 MB) only download when their desk is shown.
- Education window hugs its content; descriptions kept on phone; Arcana grid 2 cols for <=4 shots.

### Pass 2 (critic 6.65; dev areas 6-7 vs 4-6 on the live site)
- Hovers: icons lift + navy label, taskbar/toolbar dotted hot rect, play buttons beige + lift, YouTube play moved to the corner.
- Bigger hit area on window controls; contact handles 15px; label plate on the cloud wallpaper.

### After pass 2 (not yet re-scored)
- The routed desk paints from the first frame (no welcome flash): About phone CLS 0.573 -> 0, LCP 4.1 s -> 1.7 s.
- Phone windows only jump to the top after a real tap, not during boot.
