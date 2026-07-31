/* app/experience-window.jsx — WorkTimeline + WorkDetailPanel
   ported from index_old (work-final.jsx), trimmed to the timeline/detail pair
   (no Animotive-specific media embed — every row uses the same placeholder
   Shot thumbnail for now). Requires window.FlowWindow and window.PixelIcon.
   Responsiveness (stack layout for small screens) is a follow-up. */
const OWNERS = {
  dragonfly: { color: '#2cb2d3', label: 'Airbus',
    cardBorder: '#7cccdf', cardBg: '#c2e7f2', cardBgHover: '#aadfee', cardBgLight: '#dcf2f8', chipBg: '#dff1f6', chipBorder: '#9bd5e3', chipText: '#1a7d96' },
  animotive: { color: '#8ec582', label: 'Retinize',
    cardBorder: '#a6d191', cardBg: '#d4ecc7', cardBgHover: '#c3e4b2', cardBgLight: '#e8f6de', chipBg: '#e6f1e0', chipBorder: '#b3d2a6', chipText: '#4a7a38' },
  freelance: { color: '#7B00F5', label: 'Freelance',
    cardBorder: '#b795e8', cardBg: '#ddcffa', cardBgHover: '#cebbf6', cardBgLight: '#ece2fc', chipBg: '#ece0fb', chipBorder: '#c9a9ef', chipText: '#6306c2' },
  autostereo: { color: '#b0824e', label: 'VisioPM',
    cardBorder: '#d2b083', cardBg: '#ecdac0', cardBgHover: '#e3cbaa', cardBgLight: '#f6e9d5', chipBg: '#eee0cd', chipBorder: '#cfae82', chipText: '#7a5424' },
};
const ownerOf = (p) => p.owner ? OWNERS[p.id] : (p.depth === 1 && p.parent ? OWNERS[p.parent] : null);
const SEL_PIN = '#1565d8';
const DF_GREEN = '#2f9b46';

const WORK_ITEMS = [
  { id: 'freelance', name: 'XR freelancing', s: '2025', e: 'now', dur: '7 mo', icon: 'picture', hue: 206, depth: 0, owner: true,
    photo: 'assets/work/freelance.png',
    hero: 'assets/work/render-test.png',
    role: 'Freelance \u00b7 Unity XR Engineer (NDA client)',
    desc: 'An AR application along with its whole ecosystem and R&D.',
    full: 'Confidential AR/XR application developed in Unity for a private client under NDA. The project involved building a production-ready immersive experience with strong constraints around mobile performance, stability, offline usage, content delivery, and on-device deployment.',
    accomplishments: [
      'Developed a custom video encoding/decoding pipeline to compress 8K source content into a 4K-compatible mobile delivery format.',
      'Built a Unity Android AR application for AR glasses, with a companion updater app, custom media processing tools, and backend content delivery system.',
      'Owned the technical architecture, development, maintenance, deployment, and client-facing delivery across the project.',
    ],
    tech: ['C#', 'ShaderLab', 'ShaderGraph', 'Unity', 'Rider', 'Git', 'AugmentedReality'] },
  { id: 'compression', name: '8K\u21924K Compression Pipeline', s: '2025', e: 'now', dur: '7 mo', icon: 'reel', hue: 206, depth: 1, parent: 'freelance',
    hero: 'assets/work/render-test.png',
    role: 'Pipeline author \u00b7 Freelance',
    desc: 'Custom encoding/decoding pipeline compressing 8K masters into a 4K mobile delivery format.',
    full: 'A bespoke video encoding and decoding pipeline built to bring 8K source content onto AR glasses: masters are transcoded into a 4K-compatible delivery format that decodes on-device within the headset\u2019s memory and bandwidth budget, with no perceptible loss at viewing distance.',
    accomplishments: [
      'Designed the transcode chain from 8K masters to a mobile-decodable 4K delivery format.',
      'Built custom media processing tools so the client can prepare content without engineering support.',
      'Tuned bitrate, container and decode strategy to hold framerate and memory limits on-device.',
    ],
    tech: ['C#', 'FFmpeg', 'Unity', 'VideoEncoding', 'Android', 'AugmentedReality'] },
  { id: 'animotive', name: 'RETìníZE', s: '2020', e: '2025', dur: '4 yrs', icon: 'reel', hue: 286, depth: 0, owner: true,
    photo: 'assets/work/animotive.jpg',
    youtube: 'hqbyJWCxGPY',
    role: 'Retinize \u00b7 Core engineering team',
    desc: 'A VR animation and video production software.',
    full: 'I was a core member of the engineering team on Animotive, a VR multiplayer virtual production and animation platform, from pre-release development through commercial launch and post-release support.',
    accomplishments: [
      'Created a custom VR UI toolkit in close collaboration with the UX designer.',
      'Implemented multiplayer features via Photon Bolt.',
      'Developed a full-body tracking calibration workflow.',
      'Built a GPU-based, collider-less raycasting system for accurate submesh interaction.',
      'Created custom shaders for teleportation lasers, glow highlights, and visual feedback.',
      'Helped scale the VR UI to desktop, maintaining design and usability consistency.',
      'Contributed to internal R&D focused on efficient UI rendering for VR environments.',
    ],
    tech: ['C#', 'ShaderLab', 'Shader Graph', 'Unity', 'VR', 'Mocap'] },
  { id: 'vrui', name: 'VR Worldspace UI Toolkit', s: '2021', e: '2025', dur: '4 yrs', icon: 'gizmo', hue: 286, depth: 1, parent: 'animotive',
    hero: 'assets/work/vr-ui-toolkit.jpg',
    role: 'Toolkit author \u00b7 Retinize',
    desc: 'Complete worldspace UI toolkit for VR, built with the UX designer.',
    full: 'A full in-house worldspace UI toolkit for Animotive, designed and built in close collaboration with the UX designer so that every interface in the product \u2014 timelines, menus, inspectors \u2014 could be authored in VR with consistent interaction rules.',
    accomplishments: [
      'Designed reusable worldspace UI components (panels, sliders, timelines, pickers) usable by the whole team without VR-specific knowledge.',
      'Unified pointer, hand and controller input behind a single interaction model.',
      'Maintained the toolkit from pre-release through commercial launch and post-release support.',
    ],
    tech: ['C#', 'Unity', 'UIToolkit', 'VirtualReality', 'Git'] },
  { id: 'gpuray', name: 'Collider-Free Raycast System', s: '2021', e: '2023', dur: '2 yrs', icon: 'monitor', hue: 206, depth: 1, parent: 'animotive',
    hero: 'assets/work/gpu-raycast.jpg', heroFit: 'contain',
    role: 'System author \u00b7 Retinize',
    desc: 'GPU raycasting with submesh precision \u2014 hover detection before colliders exist.',
    full: [
      'A GPU-based, collider-free raycasting system developed for Animotive\u2019s FBX import pipeline.',
      'During the early stages of the import process, colliders had not yet been generated, but the application still needed a way to detect which submesh the user was hovering over. The system had to work with both standard static objects, such as boxes and vehicles, and live animated Skinned Mesh Renderers.',
    ],
    accomplishments: [
      'Detected hovered submeshes within a few milliseconds, avoiding complex CPU-side polygon intersection calculations that would have been impractical for animated objects.',
      'Worked at effectively no additional cost on animated objects compared with static ones.',
      'Could process millions of single-hit raycasts, returning only the closest result, in under 30 milliseconds.',
    ],
    tech: ['C#', 'ShaderLab', 'ComputeShaders', 'Unity', 'VirtualReality'] },
  { id: 'shaders', name: 'In-House Shaders & Render Features', s: '2020', e: '2025', dur: '4 yrs', icon: 'picture', hue: 152, depth: 1, parent: 'animotive',
    hero: 'assets/work/animotive.jpg',
    role: 'Rendering engineer \u00b7 Retinize',
    desc: 'All custom shaders and render features, plus VR pipeline optimization.',
    full: 'Authored every in-house shader and custom render feature used in Animotive, and owned the optimization of the rendering pipeline for complex, densely populated VR scenes running at VR framerates.',
    accomplishments: [
      'Wrote the full custom shader library: characters, sets, outlines, silhouettes and stylized effects.',
      'Built custom URP render features for the product\u2019s visual language and editing overlays.',
      'Profiled and optimized the pipeline to hold VR framerate in heavy multi-character scenes.',
    ],
    tech: ['ShaderLab', 'ShaderGraph', 'HLSL', 'URP', 'C#', 'Unity', 'VirtualReality'] },
  { id: 'dragonfly', name: 'Airbus DS', s: '2017', e: '2020', dur: '3 yrs', icon: 'dragonfly', hue: 152, depth: 0, owner: true,
    photo: 'assets/work/dragonfly.jpg',
    hero: 'assets/work/dragonfly.jpg',
    role: 'Airbus Defence & Space \u00b7 Feature developer & integration lead',
    desc: "Airbus group's official VR visualizer.",
    full: 'DragonFly is a multi-platform industrial data visualization and manipulation tool (Desktop + VR) developed in Unity within Airbus Defence & Space. Chosen as the group\u2019s official VR visualizer, it has received multiple internal awards. I contributed as feature developer and integration lead, working on measurement tools, 3D gizmos, and custom API integrations (TCP/UDP/REST).',
    accomplishments: [
      'Built a procedural 3D shape generation library and two TCP interfaces in C# and Java to connect DragonFly with external software.',
      'Developed a double-precision solar system simulation and satellite telemetry visualizer to support DragonFly\u2019s adoption by Toulouse Mission Control center.',
      'Managed client relationships, roadmaps, and demos for projects integrating DragonFly into other teams.',
    ],
    tech: ['C#', 'C', 'C++', 'Java', 'Unity', 'Blender', 'Git', 'Jira', 'SQLite', 'VR/AR', 'UDP/TCP'] },
  { id: 's3', name: 'S\u00b3 \u2014 Satellite Sizing Suite', s: '2019', e: '2020', dur: '1 yr', icon: 'gizmo', hue: 38, depth: 1, parent: 'dragonfly',
    hero: 'assets/work/s3.jpg',
    role: 'Module developer \u00b7 Airbus Defence and Space',
    desc: 'Satellite accommodation pre-design \u2014 networking, procedural meshes, CAD-style snapping.',
    full: 'S\u00b3 is a satellite accommodation pre-design tool. I developed modules enabling another team to use DragonFly as their visualizer: networking features, procedural mesh generation, object snapping, and advanced CAD-style interaction tools.',
    tech: ['C#', 'C++', 'Java', 'Unity', 'Eclipse', 'Git', 'TCP', 'ProtocolBuffers', 'JSON'] },
  { id: 'spacesim', name: 'Solar System Simulation', s: '2018', e: '2019', dur: '8 mo', icon: 'monitor', hue: 228, depth: 1, parent: 'dragonfly',
    hero: 'assets/work/juice.jpg',
    role: 'Simulation developer \u00b7 Airbus Defence and Space',
    desc: 'Real-time solar system simulation for satellite missions \u2014 Desktop and VR.',
    full: 'Built a real-time solar system simulation to visualize satellite missions in Desktop and VR.',
    accomplishments: [
      'Developed a custom double-precision coordinate system to overcome Unity\u2019s floating-point limitations at astronomical scales.',
      'Implemented a dynamic lighting model and rendering pipeline.',
      'Deployed in VR at Toulouse Mission Control.',
    ],
    tech: ['C#', 'C', 'Unity', 'VTS', 'Celestia', 'Blender', 'Git', 'TCP', 'XML'] },
  { id: 'pla', name: 'Factory Layout VR Validation Tool', s: '2017', e: '2017', dur: '3 mo', icon: 'folder', hue: 16, depth: 1, parent: 'dragonfly',
    hero: 'assets/work/factory.jpg',
    role: 'Architectural verifications in VR \u00b7 Airbus Defence and Space',
    desc: 'VR facility-layout validation for a manufacturing team.',
    full: 'Helped a manufacturing team validate facility layout using VR. Users could explore building architecture at scale, test movement flows, and evaluate design choices in a virtual environment.',
    tech: ['C#', 'Unity', 'Git', 'SQLite', 'VR', 'XML'] },
  { id: 'autostereo', name: 'VisioPM', s: '2016', e: '2016', dur: '5 mo', icon: 'page', hue: 32, depth: 0, owner: true,
    photo: 'assets/work/autostereoscopy.png',
    hero: 'assets/work/autostereoscopy.png',
    role: 'Internal R&D',
    desc: 'A glass-free 3D video rendering engine.',
    full: 'Worked on internal rendering tools and early-stage display technology prototypes.',
    accomplishments: [
      'Developed a WebGL viewer allowing clients to import images and files into the company\u2019s rendering pipeline.',
      'Built an MVP autostereoscopic rendering engine prototype based on Unity.',
    ],
    tech: ['Unity', 'C#', 'WebGL', 'Rendering'] },
];
const WORK_GROUPS = [{ parent: 'freelance', kids: ['compression'] }, { parent: 'animotive', kids: ['vrui', 'gpuray', 'shaders'] }, { parent: 'dragonfly', kids: ['s3', 'spacesim', 'pla'] }];
const GUT = 61, SPINE = 46, CX = 23, INDENT = 22;
const triArrow = (c) => ({ width: 0, height: 0, borderLeft: '8px solid ' + c, borderTop: '5px solid transparent', borderBottom: '5px solid transparent' });

function WorkShot({ p, children, style }) {
  const h = p.hue;
  return (
    <div style={Object.assign({
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background:
        `radial-gradient(130% 95% at 72% 12%, hsl(${h} 75% 52% / .45) 0%, transparent 52%),` +
        `radial-gradient(90% 80% at 18% 90%, hsl(${(h + 40) % 360} 65% 45% / .35) 0%, transparent 55%),` +
        `linear-gradient(158deg, hsl(${h} 42% 14%) 0%, hsl(${h} 45% 6%) 100%)`,
    }, style || {})}>
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage:
          `linear-gradient(hsl(${h} 70% 65% / .14) 1px, transparent 1px),` +
          `linear-gradient(90deg, hsl(${h} 70% 65% / .14) 1px, transparent 1px)`,
        backgroundSize: '24px 24px', backgroundPosition: 'center bottom',
        WebkitMaskImage: 'linear-gradient(transparent 38%, #000 100%)', maskImage: 'linear-gradient(transparent 38%, #000 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)' }} />
      {children}
    </div>
  );
}

/* click-to-play YouTube frame: YT's own poster until clicked, so no player
   loads on mount. Same treatment as the project windows. */
function WorkVideo({ id, label }) {
  const [on, setOn] = React.useState(false);
  if (on) return (
    <iframe title={label || 'video'} src={'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen
      style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#000' }} />
  );
  return (
    <button onClick={() => setOn(true)} title={'Play \u2014 ' + (label || 'video')}
      style={{ all: 'unset', cursor: 'pointer', position: 'relative', width: '100%', height: '100%', display: 'block', background: '#000', overflow: 'hidden' }}>
      <img src={'https://i.ytimg.com/vi/' + id + '/sddefault.jpg'} alt={label || ''} draggable="false"
        onError={(e) => { e.currentTarget.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.18)' }}>
        <span className="w98-raised" style={{ display: 'grid', placeItems: 'center', width: 58, height: 40, background: 'var(--w98-face)', paddingLeft: 4 }}>
          <span style={{ width: 0, height: 0, borderLeft: '17px solid #1d1d1d', borderTop: '11px solid transparent', borderBottom: '11px solid transparent' }} />
        </span>
      </span>
      {label && <span style={{ position: 'absolute', bottom: 6, left: 7, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '0 5px', textTransform: 'uppercase' }}>{label}</span>}
    </button>
  );
}

function OwnerChip({ on, owner }) {
  const o = owner || OWNERS.dragonfly;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '1px 7px 1px 6px',
      background: on ? 'rgba(255,255,255,.16)' : o.chipBg, border: '1px solid ' + (on ? 'rgba(255,255,255,.4)' : o.chipBorder),
      color: on ? '#fff' : o.chipText, fontSize: 14.5, fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap', borderRadius: 2 }}>
      <span style={{ width: 6, height: 6, background: on ? '#fff' : o.color, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.2)' }} />
      {o.label}
    </span>
  );
}


/* Static dithered photo strip that bleeds off the right edge of a PROJECT row
   (never sub-projects). The ordered-dither alpha ramp is generated at runtime at the
   row's exact pixel height, so the dither stays 1:1 (no scaling) and fits vertically
   with no gap. Two lab knobs live on window.__ditherTweaks:
     reach    — total strip width in px
     inPx     — px distance over which it dithers IN from the left edge (independent of
                reach, so widening the strip never stretches the dither)
     outReach — px band at the RIGHT edge over which the photo dithers back out (0 = off)
     outClear — % of that band, measured from the right edge, that is fully clear
     angle    — degrees the dither ramp axis is rotated (0 = vertical dither edge) */
const ROW_PHOTO_SRC = 'assets/work/s3-detail.jpg';
const B8 = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
window.__ditherTweaks = window.__ditherTweaks || { reach: 255, inPx: 34, outReach: 40, outClear: 20, angle: 17 };
if (window.__ditherTweaks.inPx == null) {   /* migrate the old solid-% model */
  window.__ditherTweaks.inPx = Math.round(window.__ditherTweaks.reach * (window.__ditherTweaks.solid || 20) / 100);
}
if (window.__ditherTweaks.angle == null) window.__ditherTweaks.angle = 0;
const stripCache = new Map();
const stripSubs = new Set();
const notifyStrips = () => stripSubs.forEach((fn) => fn());
window.addEventListener('dither:tweak', notifyStrips);
const photoCache = new Map();
function getPhoto(src) {
  if (photoCache.has(src)) return photoCache.get(src);
  const im = new Image();
  photoCache.set(src, null);
  im.onload = () => { photoCache.set(src, im); notifyStrips(); };
  im.src = src;
  return null;
}

/* padL = extra transparent-side width the rotated ramp needs so its diagonal start line
   resolves inside the canvas instead of being clipped flat at the left edge */
const ditherPad = (angle, H) => Math.ceil(Math.abs(Math.tan((angle || 0) * Math.PI / 180)) * H / 2) + 4;

function makeStrip(src, W, H, inPx, outReach, outClear, angle, padL, padR) {
  const photoImg = getPhoto(src);
  if (!photoImg || W < 8 || H < 8) return null;
  const key = src + '|' + W + 'x' + H + '|' + inPx + '|' + outReach + '|' + outClear + '|' + angle + '|' + padL + '|' + padR;
  if (stripCache.has(key)) return stripCache.get(key);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const sc = Math.max(W / photoImg.width, H / photoImg.height);
  ctx.drawImage(photoImg, (W - photoImg.width * sc) / 2, (H - photoImg.height * sc) / 2, photoImg.width * sc, photoImg.height * sc);
  const id = ctx.getImageData(0, 0, W, H), px = id.data;
  const rampPx = Math.max(1, Math.round(inPx));
  const outW = Math.max(0, Math.min(Math.round(outReach), W));
  const clearPx = Math.min(outW - 1, Math.round(outW * Math.max(0, outClear) / 100));
  const tan = Math.tan((angle || 0) * Math.PI / 180);
  const span = W - padL - padR;                 /* designed width; padL/padR are tilt slack */
  const cy = H / 2;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    /* SHEAR, not rotation: the u = 0 and u = span lines are parallel diagonals through
       (padL, cy) and (padL + span, cy), so no cos-compression pulls them off the edges. */
    const u = (x - padL) + (y - cy) * tan;
    let t = u <= 0 ? 0 : (u >= rampPx ? 1 : Math.pow(u / rampPx, 1.6));
    if (outW > 0) {
      const d = Math.max(0, span - u);          /* distance from the right edge along the axis */
      const tOut = d >= outW ? 1 : (d <= clearPx ? 0 : Math.pow((d - clearPx) / (outW - clearPx), 1.6));
      t = Math.min(t, tOut);
    }
    px[(y * W + x) * 4 + 3] = t > (B8[(y % 8) * 8 + (x % 8)] + 0.5) / 64 ? 255 : 0;
  }
  ctx.putImageData(id, 0, 0);
  const url = c.toDataURL('image/png');
  stripCache.set(key, url);
  return url;
}

/* Geometry is derived from the card, never hardcoded: the strip can never cover more
   than half the card (so the title always stays clear) and its right offset clears
   exactly the controls that are actually rendered (duration only exists when !stack). */
const CARD_PAD = 12, ARROW_W = 12, ROW_GAP = 12, DUR_W = 52;
const stripRightOffset = (stack) => CARD_PAD + ARROW_W + ROW_GAP + (stack ? 0 : DUR_W + ROW_GAP);

function useRowStrip(enabled, stack, src) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [, bump] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { stripSubs.add(bump); return () => { stripSubs.delete(bump); }; }, []);
  React.useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current; if (!el) return;
    const upd = () => {
      const r = el.getBoundingClientRect();
      setBox((p) => (Math.round(r.width) === p.w && Math.round(r.height) === p.h) ? p : { w: Math.round(r.width), h: Math.round(r.height) });
    };
    upd();
    /* The card can be laid out at 0x0 whenever its desk is display:none, and no
       ResizeObserver callback is delivered for the display:none -> block transition.
       So: poll until it has a real height, and restart that poll on every desk change. */
    let raf = 0, tries = 0;
    const settle = () => {
      const r = el.getBoundingClientRect();
      if (r.height >= 8) { upd(); return; }
      if (++tries < 240) raf = requestAnimationFrame(settle);
    };
    const restart = () => { cancelAnimationFrame(raf); tries = 0; raf = requestAnimationFrame(settle); };
    settle();
    window.addEventListener('desk:change', restart);
    window.addEventListener('resize', upd);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    if (ro) ro.observe(el);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('desk:change', restart); window.removeEventListener('resize', upd); if (ro) ro.disconnect(); };
  }, [enabled]);
  const tw = window.__ditherTweaks;
  const right = stripRightOffset(stack);
  const avail = Math.max(0, box.w - right - CARD_PAD);
  /* the rotation slack is mandatory: if it cannot fit, the strip itself gives up width
     rather than letting the tilted ramp clip against the canvas edge */
  /* tilt slack is mandatory on BOTH edges (the u = 0 and u = span lines are both diagonal);
     the right slack is subtracted from the offset so the opaque area stays put */
  const slack = ditherPad(tw.angle, box.h);
  const padR = tw.outReach > 0 ? Math.min(slack, Math.max(0, right - CARD_PAD)) : 0;
  const padL = Math.min(slack, Math.max(0, avail - padR - 40));
  const span = Math.max(0, Math.min(Math.round(tw.reach), Math.round(box.w * 0.5), avail - padL));
  const width = span + padL + padR;
  return { ref, right: right - padR, width,
    url: enabled ? makeStrip(src || ROW_PHOTO_SRC, width, box.h, tw.inPx, tw.outReach, tw.outClear, tw.angle, padL, padR) : null };
}

function WorkRow({ p, selected, hov, onSel, onHov, nodeRef, hideArrow, stack }) {
  const on = selected;
  const child = p.depth === 1;
  const own = ownerOf(p);
  const oc = own ? own.color : null;
  const nodeColor = on ? SEL_PIN : (oc || '#c0c0c0');
  const strip = useRowStrip(!child && !stack, stack, p.photo);
  return (
    <button onClick={() => onSel(p.id)} onMouseEnter={() => onHov(p.id)} onMouseLeave={() => onHov((h) => h === p.id ? null : h)}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'stretch', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <span style={{ width: GUT, flex: '0 0 auto', textAlign: 'right', paddingLeft: 9, paddingRight: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.05 }}>
        {!child && <span style={{ display: 'block', fontSize: 16, fontFamily: '"Courier New", monospace', fontWeight: 700, color: 'var(--w98-text)' }}>{p.s}</span>}
        {!child && <span style={{ display: 'block', fontSize: 14, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{p.e}</span>}
      </span>
      <span style={{ width: SPINE, flex: '0 0 auto', position: 'relative' }}>
        <span ref={nodeRef} style={{ position: 'absolute', top: '50%', left: CX + (child ? INDENT : 0), transform: 'translate(-50%,-50%)',
          width: 11, height: 11, background: nodeColor, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.55), inset 1px 1px 0 rgba(255,255,255,.85)', zIndex: 2 }} />
      </span>
      <span ref={strip.ref} style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', display: 'flex', gap: 12, alignItems: (child || stack) ? 'center' : 'flex-start',
        margin: (child ? '2px' : '3px') + ' 12px ' + (child ? '2px' : '3px') + ' ' + (child ? 14 : 0) + 'px', padding: child ? '15px 12px' : '22px 12px',
        border: on ? '1px solid #00004d' : ((child || own) ? '1px solid ' + own.cardBorder : '1px solid transparent'),
        background: on ? 'var(--w98-navy)' : (hov && own ? (own.cardBgHover || own.cardBg) : (hov ? '#eef2f7' : (child ? (own.cardBgLight || own.cardBg) : (own ? own.cardBg : 'transparent')))),
        color: on ? '#fff' : 'var(--w98-text)' }}>
        {!child && strip.url && (
          <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: strip.right, width: strip.width, zIndex: 0,
            backgroundImage: 'url("' + strip.url + '")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right top', pointerEvents: 'none' }} />
        )}
        <span style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: child ? 2 : 4, justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: child ? 7 : 9, flexWrap: 'wrap' }}>
            <span style={{ fontSize: child ? 13 : 22, fontWeight: child ? 600 : 700, lineHeight: 1.08 }}>{p.name}</span>
          </span>
          {!child && !stack && <span style={{ fontSize: 16, lineHeight: 1.4, opacity: on ? .96 : .82, textWrap: 'pretty', maxWidth: '50%',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</span>}

        </span>
        {!child && !stack && <span style={{ flex: '0 0 auto', alignSelf: 'center', position: 'relative', zIndex: 1, width: 52, textAlign: 'right', fontSize: 16, fontFamily: '"Courier New", monospace', fontWeight: 700, opacity: on ? 1 : .8 }}>{p.dur}</span>}
        {!hideArrow && (
          <span style={{ flex: '0 0 auto', alignSelf: 'center', position: 'relative', zIndex: 1, width: 12, display: 'grid', placeItems: 'center' }}>
            <span style={triArrow(on ? '#fff' : '#1d1d1d')} />
          </span>
        )}
      </span>
    </button>
  );
}

function WorkTimeline({ selected, onOpen, onClose, stack }) {
  const [hov, setHov] = React.useState(null);
  const wrapRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const [paths, setPaths] = React.useState([]);
  const items = WORK_ITEMS, groups = WORK_GROUPS;

  React.useLayoutEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current; if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      const sc = wrap.offsetWidth ? wr.width / wrap.offsetWidth : 1;
      const out = [];
      groups.forEach((g) => {
        const pn = nodeRefs.current[g.parent]; if (!pn) return;
        const pr = pn.getBoundingClientRect();
        const px = (pr.left + pr.width / 2 - wr.left) / sc;
        const py = (pr.top + pr.height / 2 - wr.top) / sc;
        const kids = g.kids.map((k) => nodeRefs.current[k]).filter(Boolean)
          .map((n) => { const r = n.getBoundingClientRect(); return { x: (r.left + r.width / 2 - wr.left) / sc, y: (r.top + r.height / 2 - wr.top) / sc }; });
        if (!kids.length) return;
        const cx = kids[0].x, firstY = kids[0].y, lastY = kids[kids.length - 1].y;
        const color = OWNERS[g.parent] ? OWNERS[g.parent].color : DF_GREEN;
        out.push({ color, d: 'M ' + px + ' ' + (py + 6) + ' V ' + (firstY - 14) + ' Q ' + px + ' ' + firstY + ' ' + cx + ' ' + firstY + ' L ' + cx + ' ' + lastY });
      });
      setPaths(out);
    };
    compute();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', compute);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', compute); };
  }, [selected]);

  const selectRel = (dir) => {
    if (!items.length) return;
    let i = items.findIndex((x) => x.id === selected);
    if (i === -1) i = dir > 0 ? -1 : items.length;
    const ni = Math.max(0, Math.min(items.length - 1, i + dir));
    onOpen(items[ni].id);
  };
  const upTri = { width: 0, height: 0, borderBottom: '9px solid #1d1d1d', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' };
  const downTri = { width: 0, height: 0, borderTop: '9px solid #1d1d1d', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' };

  return (
    <window.FlowWindow icon="folder" img="assets/icons/work.png" title={'C:\\Professional'} width={732} onClose={onClose}
      style={{ maxHeight: 'calc(var(--vph) - 70px)', maxWidth: 'calc(var(--vpw) - 24px)', display: 'flex', flexDirection: 'column' }}
      menubar={
        <React.Fragment>
          <div className="w98-menubar">
            {['File', 'Edit', 'View', 'Go', 'Help'].map((m) => (
              <span key={m} className="w98-menu-item" aria-disabled="true"
                style={{ color: '#808080', textShadow: '1px 1px 0 #fff', cursor: 'default', pointerEvents: 'none' }}>
                <u>{m[0]}</u>{m.slice(1)}
              </span>
            ))}
          </div>
          <div className="w98-toolbar" style={{ paddingTop: 0 }}>
            <button className="w98-tool-btn" onClick={() => selectRel(-1)}><span style={upTri} />top</button>
            <button className="w98-tool-btn" onClick={() => selectRel(1)}><span style={downTri} />down</button>
            <span className="w98-toolbar-sep" />
            <button className="w98-tool-btn is-on"><window.PixelIcon icon="info" size={16} className="w98-tool-ico" />Timeline</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>{'nested by owner · newest first'}</span>
          </div>
        </React.Fragment>
      }
      statusbar={
        <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
          <span className="w98-status-cell grow">{items.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 170 }}>{'2016–now'}</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '0 1 auto', minHeight: 0, margin: '0 1px', background: '#fff', padding: '12px 0', overflowY: 'auto' }}>
        <div ref={wrapRef} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: GUT + CX - 1, top: 14, bottom: 26, width: 2, background: '#c0c0c0', boxShadow: 'inset -1px 0 0 #fff' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />)}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {items.map((p, k) => (
              <WorkRow key={p.id} p={p} selected={selected === p.id} hov={hov === p.id}
                onSel={onOpen} onHov={setHov} stack={stack} nodeRef={(el) => { nodeRefs.current[p.id] = el; }} />
            ))}
          </div>
        </div>
      </div>
    </window.FlowWindow>
  );
}

function WorkDetailPanel({ id, onClose, stack }) {
  const p = WORK_ITEMS.find((x) => x.id === id) || WORK_ITEMS[0];
  return (
    <window.FlowWindow icon={p.icon} img="assets/icons/work.png" title={p.name} onClose={onClose} width={842}
      style={{ maxHeight: 'calc(var(--vph) - 40px)', maxWidth: 'calc(var(--vpw) - 24px)', display: 'flex', flexDirection: 'column' }}>
      <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '13px 15px 16px' }}>
        <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
          <div style={{ aspectRatio: '16 / 9' }}>
            {p.youtube ? <WorkVideo id={p.youtube} label={p.name} />
              : p.hero ? <img src={p.hero} alt={p.name} draggable="false"
                  style={{ width: '100%', height: '100%', objectFit: p.heroFit || 'cover', background: p.heroFit === 'contain' ? '#000' : undefined, display: 'block' }} />
              : (
                <WorkShot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
                  <span style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#cfe', letterSpacing: '.5px', textTransform: 'uppercase' }}>{p.id + '.exe — render'}</span>
                  <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                    <window.PixelIcon icon={p.icon} size={56} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
                  </span>
                </WorkShot>
              )}
          </div>
        </div>
        <div style={{ marginTop: 13 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '.2px' }}>{p.name}</h1>
          <div style={{ fontSize: 16, color: 'var(--w98-text-dim)', marginTop: 3 }}>{p.s}{p.e !== p.s ? '\u2013' + p.e : ''} &middot; {p.role}</div>
          <div className="w98-prose" style={{ marginTop: 10 }}>{(Array.isArray(p.full) ? p.full : [p.full]).map((t, i, a) => (
            <p key={i} style={{ marginBottom: i === a.length - 1 ? 0 : 10 }}>{t}</p>
          ))}</div>
          {p.accomplishments && p.accomplishments.length > 0 && (
            <div className="w98-group" style={{ marginTop: 24 }}>
              <span className="w98-group-title">Accomplishments</span>
              <ul className="w98-prose" style={{ margin: '8px 0 2px', paddingLeft: 20 }}>
                {p.accomplishments.map((a, i) => <li key={i} style={{ marginBottom: 6, lineHeight: 1.45 }}>{a}</li>)}
              </ul>
            </div>
          )}
          <div className="w98-group" style={{ marginTop: 28 }}>
            <span className="w98-group-title">Technologies</span>
            <div className="w98-field" style={{ padding: '2px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: stack ? '1fr 1fr' : '1fr 1fr 1fr', columnGap: 20 }}>
                {(() => {
                  const cols = stack ? 2 : 3;
                  const n = p.tech.length;
                  const noBorderFrom = n - (n % cols === 0 ? cols : n % cols);
                  return p.tech.map((t, i) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px', fontSize: 17,
                      borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                      <span style={{ width: 8, height: 8, background: '#00007b', flex: '0 0 auto', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.3)' }} />
                      <span>{t}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </window.FlowWindow>
  );
}

Object.assign(window, { WORK_ITEMS, WorkTimeline, WorkDetailPanel });
