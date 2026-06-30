/* project-image-approaches.jsx
   3 distinct launcher-level treatments that surface PROJECTS AS LIVE IMAGES
   (not 32/64px icons) and open a Win98-style modal on click.
   A · Active Desktop image tiles
   B · Explorer "Thumbnails" view + Image Preview modal
   C · Portfolio slide-show CRT stage + filmstrip
   Reuses win98.css (bevels/fonts) + pixel-icons (window glyphs). */

/* ---------------- side-project registry ---------------- */
const SP = [
  { id: 'proc',   name: 'Procedural Worlds', file: 'proc_worlds.png',    tag: 'Personal · 2024', hue: 152, icon: 'saturn',
    blurb: 'Endless terrain generated on the GPU with marching-cubes meshing and layered noise — fly anywhere, nothing repeats.',
    tech: ['Unity', 'HLSL', 'Compute', 'Noise'] },
  { id: 'sky',    name: 'Volumetric Sky',    file: 'volumetric_sky.png', tag: 'Personal · 2023', hue: 206, icon: 'crt',
    blurb: 'Real-time raymarched clouds with physically-based light scattering and a full day-night cycle.',
    tech: ['HLSL', 'Raymarching', 'Unity'] },
  { id: 'auto',   name: 'Autostereo Engine', file: 'autostereo.png',     tag: 'R&D · 2022', hue: 278, icon: 'cube',
    blurb: 'Glasses-free 3D — interleaves dozens of camera views onto a lenticular panel for depth without a headset.',
    tech: ['C++', 'HLSL', 'Optics'] },
  { id: 'drift',  name: 'Neon Drift',        file: 'neon_drift.png',     tag: 'Game jam · 48h', hue: 16, icon: 'reel',
    blurb: 'A synthwave arcade racer built end-to-end in a single weekend game jam. Top 10 of the event.',
    tech: ['Unity', 'C#', 'Shader Graph'] },
  { id: 'shader', name: 'Shader Lab',        file: 'shader_lab.png',     tag: 'Personal', hue: 322, icon: 'nodes',
    blurb: 'An ever-growing library of stylised, post-process and VFX shaders — toon ramps, dissolves, force fields.',
    tech: ['HLSL', 'URP', 'Shader Graph'] },
  { id: 'orbit',  name: 'Orbital Sim',       file: 'orbital_sim.png',    tag: 'Personal', hue: 228, icon: 'atom',
    blurb: 'An N-body orbital-mechanics sandbox with time-warp, transfer planning and a real-scale solar system.',
    tech: ['Unity', 'C#', 'Physics'] },
];

/* ---------------- shared image placeholder ----------------
   Reads as a real-time 3D render screenshot: dark scene base, accent glow,
   a fading perspective grid and faint scanlines. Swap for a real <img src>
   later — same box. */
function Shot({ p, children, radius = 0, style }) {
  const h = p.hue;
  return (
    <div style={Object.assign({
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: radius,
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
        WebkitMaskImage: 'linear-gradient(transparent 38%, #000 100%)',
        maskImage: 'linear-gradient(transparent 38%, #000 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)' }} />
      {children}
    </div>
  );
}

/* filename tag chip (top-left, monospace) */
function FileTag({ p, n }) {
  return (
    <div style={{ position: 'absolute', top: 6, left: 6, zIndex: 2,
      fontFamily: '"Courier New", monospace', fontSize: 9, letterSpacing: '.5px',
      color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '0 5px' }}>
      {n != null ? String(n).padStart(2, '0') + '  ' : ''}{p.file}
    </div>
  );
}

const triL = (c = '#1d1d1d') => ({ width: 0, height: 0, borderRight: `9px solid ${c}`, borderTop: '6px solid transparent', borderBottom: '6px solid transparent' });
const triR = (c = '#1d1d1d') => ({ width: 0, height: 0, borderLeft: `9px solid ${c}`, borderTop: '6px solid transparent', borderBottom: '6px solid transparent' });

/* ---------------- shared Win98 project modal ----------------
   Contained inside its artboard (absolute inset 0). Dim navy backdrop +
   centered window with full titlebar, big hero render, blurb, tech, footer. */
function ProjectModal({ p, onClose, viewerChrome }) {
  if (!p) return null;
  return (
    <div onMouseDown={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,40,.55)',
        display: 'grid', placeItems: 'center', padding: 14 }}>
      <div className="w98 w98-window" style={{ width: '100%', maxWidth: 460 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="w98-titlebar">
          <PixelIcon icon={viewerChrome ? 'picture' : p.icon} size={16} className="w98-titlebar-icon" />
          <span className="w98-titlebar-text">{viewerChrome ? 'Image Preview — ' + p.file : p.name}</span>
          <div className="w98-titlebar-btns">
            <button className="w98-tb-btn" aria-label="minimize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg></button>
            <button className="w98-tb-btn" aria-label="maximize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg></button>
            <button className="w98-tb-btn" onClick={onClose} aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
          </div>
        </div>
        <div style={{ padding: 8 }}>
          <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
            <Shot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
              <FileTag p={p} />
            </Shot>
          </div>
          <div style={{ margin: '9px 1px 2px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{p.name}</h1>
            <span style={{ fontSize: 10, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap' }}>{p.tag}</span>
          </div>
          <div className="w98-prose" style={{ marginTop: 2 }}><p style={{ marginBottom: 8 }}>{p.blurb}</p></div>
          <div className="w98-group">
            <span className="w98-group-title">Built with</span>
            <div className="w98-chips">{p.tech.map((t) => <span className="w98-chip" key={t}>{t}</span>)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
            <button className="w98-btn is-default">Visit&nbsp;&#9658;</button>
            <button className="w98-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   A · ACTIVE DESKTOP IMAGE TILES
   The projects ARE the wallpaper — big framed live previews laid straight
   on the teal desktop. Hover lifts a tile; click opens the case-study modal.
   ============================================================ */
function ApproachTiles() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <div className="w98" style={{ position: 'absolute', inset: 0, background: '#2f8f88', overflow: 'hidden', padding: '14px 16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, textShadow: '1px 1px 0 rgba(0,0,0,.5)', letterSpacing: '.3px' }}>Side Projects</span>
        <span style={{ color: '#d8efe9', fontSize: 11, fontFamily: '"Courier New", monospace' }}>~/projects/personal &mdash; 6 items</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {SP.map((p) => {
          const lifted = hov === p.id;
          return (
            <button key={p.id} onClick={() => setOpen(p)}
              onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
              className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: 3, background: 'var(--w98-face)',
                boxShadow: lifted
                  ? 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 3px 5px 12px rgba(0,0,0,.4)'
                  : 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf, 1px 2px 5px rgba(0,0,0,.28)',
                transform: lifted ? 'translateY(-3px)' : 'none', transition: 'transform .12s, box-shadow .12s' }}>
              <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
                <Shot p={p} style={{ aspectRatio: '4 / 3', height: 'auto' }}>
                  {lifted && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,40,.32)' }}>
                    <span className="w98-btn w98-btn-sm" style={{ pointerEvents: 'none' }}>Open&nbsp;&#9658;</span>
                  </div>}
                </Shot>
              </div>
              <div style={{ marginTop: 3, padding: '3px 5px',
                background: 'linear-gradient(90deg, var(--w98-navy), var(--w98-blue))', color: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 9, opacity: .82, fontFamily: '"Courier New", monospace' }}>{p.tag}</div>
              </div>
            </button>
          );
        })}
      </div>
      <ProjectModal p={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ============================================================
   B · EXPLORER "THUMBNAILS" VIEW
   The native Win98 folder, in Thumbnails mode: a sunken grid of medium
   previews + filenames. Single-click selects; double-click (or Open) fires
   the classic Image-Preview viewer modal with prev/next.
   ============================================================ */
function ApproachExplorer() {
  const [sel, setSel] = React.useState(SP[0].id);
  const [open, setOpen] = React.useState(null);
  const idx = SP.findIndex((p) => p.id === (open ? open.id : sel));
  const go = (d) => setOpen(SP[(idx + d + SP.length) % SP.length]);
  return (
    <div className="w98 w98-window" style={{ position: 'absolute', inset: 0, padding: 3 }}>
      <div className="w98-titlebar">
        <PixelIcon icon="folder" size={16} className="w98-titlebar-icon" />
        <span className="w98-titlebar-text">Side Projects</span>
        <div className="w98-titlebar-btns">
          <button className="w98-tb-btn" aria-label="minimize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="maximize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
        </div>
      </div>
      <div className="w98-menubar"><span className="w98-menu-item"><u>F</u>ile</span><span className="w98-menu-item"><u>E</u>dit</span><span className="w98-menu-item"><u>V</u>iew</span><span className="w98-menu-item"><u>G</u>o</span><span className="w98-menu-item"><u>H</u>elp</span></div>
      <div className="w98-toolbar" style={{ paddingTop: 0 }}>
        <button className="w98-tool-btn"><span style={triL()} />Back</button>
        <button className="w98-tool-btn">Up</button>
        <span className="w98-toolbar-sep" />
        <button className="w98-tool-btn is-on"><PixelIcon icon="picture" size={16} className="w98-tool-ico" />Thumbnails</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>4 KB free</span>
      </div>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: 9, background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 10px' }}>
          {SP.map((p) => {
            const on = sel === p.id;
            return (
              <button key={p.id} onClick={() => setSel(p.id)} onDoubleClick={() => setOpen(p)}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 4,
                  background: on ? '#000080' : 'transparent' }}>
                <div style={{ padding: 3, background: '#c0c0c0',
                  boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf' }}>
                  <div className="w98-sunken" style={{ padding: 1, background: '#000', width: 116 }}>
                    <Shot p={p} style={{ aspectRatio: '4 / 3', height: 'auto' }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, lineHeight: 1.15, textAlign: 'center', maxWidth: 120,
                  color: on ? '#fff' : 'var(--w98-text)',
                  outline: on ? '1px dotted #c9c9c9' : 'none', outlineOffset: -1, padding: '0 3px' }}>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
        <span className="w98-status-cell grow">{SP.length} object(s)</span>
        <span className="w98-status-cell" style={{ minWidth: 120 }}>{(SP[idx] || SP[0]).file}</span>
        <span className="w98-status-cell">1.84 MB</span>
      </div>

      {open && (
        <div onMouseDown={() => setOpen(null)} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,40,.55)', display: 'grid', placeItems: 'center', padding: 14 }}>
          <div className="w98 w98-window" style={{ width: '100%', maxWidth: 470 }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="w98-titlebar">
              <PixelIcon icon="picture" size={16} className="w98-titlebar-icon" />
              <span className="w98-titlebar-text">Image Preview — {open.file}</span>
              <div className="w98-titlebar-btns">
                <button className="w98-tb-btn" aria-label="close" onClick={() => setOpen(null)}><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
              </div>
            </div>
            <div className="w98-toolbar" style={{ borderBottom: '1px solid #808080', boxShadow: '0 1px 0 #fff' }}>
              <button className="w98-tool-btn" onClick={() => go(-1)}><span style={triL()} />Prev</button>
              <button className="w98-tool-btn" onClick={() => go(1)}>Next<span style={triR()} /></button>
              <span className="w98-toolbar-sep" />
              <button className="w98-tool-btn">Zoom +</button>
              <button className="w98-tool-btn">Zoom &minus;</button>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{idx + 1}/{SP.length}</span>
            </div>
            <div style={{ padding: 6 }}>
              <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
                <Shot p={open} style={{ aspectRatio: '16 / 9', height: 'auto' }}><FileTag p={open} /></Shot>
              </div>
              <div className="w98-field" style={{ marginTop: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{open.name}</span>
                <span style={{ color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>1920×1080 · {open.tag}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   C · DISPLAY PROPERTIES — "WALLPAPER" PICKER
   Recasts every project as a desktop wallpaper inside the iconic Display
   Properties dialog: a little CRT monitor previews the selected one, a
   sunken list switches between them, OK / Apply (or double-click) opens
   the case study.
   ============================================================ */
function ApproachWallpaper() {
  const [sel, setSel] = React.useState(SP[0].id);
  const [open, setOpen] = React.useState(null);
  const p = SP.find((x) => x.id === sel) || SP[0];
  const tabs = ['Background', 'Screen Saver', 'Appearance', 'Effects', 'Settings'];
  return (
    <div className="w98" style={{ position: 'absolute', inset: 0, background: '#2f8f88', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div className="w98-window" style={{ width: '100%', maxWidth: 348 }}>
        <div className="w98-titlebar">
          <PixelIcon icon="monitor" size={16} className="w98-titlebar-icon" />
          <span className="w98-titlebar-text">Display Properties</span>
          <div className="w98-titlebar-btns">
            <button className="w98-tb-btn" aria-label="help" style={{ fontWeight: 700, fontSize: 10, lineHeight: 1, display: 'grid', placeItems: 'center' }}>?</button>
            <button className="w98-tb-btn" aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
          </div>
        </div>
        <div style={{ padding: '8px 8px 9px' }}>
          <div className="w98-tabs">
            {tabs.map((t, k) => <span key={t} className={'w98-tab' + (k === 0 ? ' is-active' : '')}>{t}</span>)}
          </div>
          <div className="w98-tabpane">
            {/* CRT monitor preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
              <div className="w98-raised" style={{ width: 158, padding: '9px 9px 12px', borderRadius: 7 }}>
                <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
                  <Shot p={p} style={{ aspectRatio: '4 / 3', height: 'auto' }}>
                    <FileTag p={p} />
                  </Shot>
                </div>
              </div>
              <div className="w98-raised" style={{ width: 50, height: 8 }} />
              <div className="w98-raised" style={{ width: 88, height: 6 }} />
            </div>
            <div style={{ fontSize: 11, marginBottom: 3 }}>W<u>a</u>llpaper</div>
            <div className="w98-list w98-sunken w98-scroll" style={{ height: 92, overflowY: 'auto' }}>
              {SP.map((g) => (
                <div key={g.id} className={'w98-list-item' + (g.id === sel ? ' is-sel' : '')}
                  onClick={() => setSel(g.id)} onDoubleClick={() => setOpen(g)} style={{ cursor: 'pointer' }}>
                  <PixelIcon icon="picture" size={16} className="ico" />
                  <span>{g.file}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
              <button className="w98-btn">Browse…</button>
              <button className="w98-btn">Pattern…</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 9 }}>
            <button className="w98-btn is-default" onClick={() => setOpen(p)}>OK</button>
            <button className="w98-btn">Cancel</button>
            <button className="w98-btn" onClick={() => setOpen(p)}><u>A</u>pply</button>
          </div>
        </div>
      </div>
      <ProjectModal p={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ============================================================
   D · EXPLORER "DETAILS" LIST + HOVER PREVIEW BALLOON
   The opposite of a thumbnail grid: a tight details list (name · type ·
   size) that stays scannable, while hovering any row floats a big live
   preview balloon beside it. Click opens the case study.
   ============================================================ */
function ApproachHoverList() {
  const [hov, setHov] = React.useState(0);
  const [open, setOpen] = React.useState(null);
  const ROW = 24, TOP = 4;
  const g = SP[hov] || SP[0];
  const balloonTop = Math.min(TOP + hov * ROW, 300);
  return (
    <div className="w98 w98-window" style={{ position: 'absolute', inset: 0, padding: 3 }}>
      <div className="w98-titlebar">
        <PixelIcon icon="folder" size={16} className="w98-titlebar-icon" />
        <span className="w98-titlebar-text">Side Projects</span>
        <div className="w98-titlebar-btns">
          <button className="w98-tb-btn" aria-label="minimize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="maximize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
        </div>
      </div>
      <div className="w98-menubar"><span className="w98-menu-item"><u>F</u>ile</span><span className="w98-menu-item"><u>E</u>dit</span><span className="w98-menu-item"><u>V</u>iew</span><span className="w98-menu-item"><u>G</u>o</span><span className="w98-menu-item"><u>H</u>elp</span></div>
      <div className="w98-toolbar" style={{ paddingTop: 0 }}>
        <button className="w98-tool-btn"><span style={triL()} />Back</button>
        <button className="w98-tool-btn">Up</button>
        <span className="w98-toolbar-sep" />
        <button className="w98-tool-btn is-on"><PixelIcon icon="page" size={16} className="w98-tool-ico" />Details</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>hover to preview</span>
      </div>
      <div className="w98-sunken" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* column header */}
        <div style={{ display: 'flex', fontSize: 11, fontWeight: 400, position: 'sticky', top: 0 }}>
          {[['Name', 1], ['Type', 0], ['Size', 0], ['Modified', 0]].map(([t], k) => (
            <span key={t} className="w98-raised" style={{ flex: k === 0 ? '1 1 auto' : '0 0 auto',
              width: k === 0 ? 'auto' : [0, 92, 64, 96][k], padding: '2px 7px', whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>
        <div onMouseLeave={() => {}} style={{ padding: '4px 0' }}>
          {SP.map((p, k) => {
            const on = hov === k;
            return (
              <div key={p.id} onMouseEnter={() => setHov(k)} onClick={() => setOpen(p)}
                style={{ display: 'flex', alignItems: 'center', height: ROW, cursor: 'pointer', fontSize: 11,
                  background: on ? '#000080' : 'transparent', color: on ? '#fff' : 'var(--w98-text)' }}>
                <span style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: 6, padding: '0 7px', minWidth: 0 }}>
                  <PixelIcon icon="picture" size={16} style={{ flex: '0 0 auto' }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.file}</span>
                </span>
                <span style={{ width: 92, flex: '0 0 auto', padding: '0 7px', opacity: on ? .9 : .7 }}>Render</span>
                <span style={{ width: 64, flex: '0 0 auto', padding: '0 7px', fontFamily: '"Courier New", monospace', opacity: on ? .9 : .7 }}>1.84 MB</span>
                <span style={{ width: 96, flex: '0 0 auto', padding: '0 7px', fontFamily: '"Courier New", monospace', opacity: on ? .9 : .7 }}>{p.tag}</span>
              </div>
            );
          })}
        </div>
        {/* hover preview balloon */}
        <div style={{ position: 'absolute', right: 10, top: balloonTop, width: 196, zIndex: 5,
          pointerEvents: 'none', transition: 'top .1s ease-out' }}>
          <div className="w98-window" style={{ padding: 0 }}>
            <div className="w98-titlebar" style={{ minHeight: 0 }}>
              <PixelIcon icon="picture" size={14} className="w98-titlebar-icon" />
              <span className="w98-titlebar-text" style={{ fontSize: 10 }}>{g.file}</span>
            </div>
            <div style={{ padding: 4 }}>
              <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
                <Shot p={g} style={{ aspectRatio: '16 / 9', height: 'auto' }} />
              </div>
              <div style={{ marginTop: 4, fontSize: 11, fontWeight: 700 }}>{g.name}</div>
              <div style={{ fontSize: 10, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>1920×1080 · {g.tag}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
        <span className="w98-status-cell grow">{SP.length} object(s)</span>
        <span className="w98-status-cell" style={{ minWidth: 130 }}>{g.file}</span>
        <span className="w98-status-cell">1.84 MB</span>
      </div>
      <ProjectModal p={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ============================================================
   E · ACTIVE DESKTOP CHANNEL BAR
   A single docked rail on the teal desktop — cinematic wide strips stacked
   vertically under a branded metallic header, the way the old Channel Bar
   sat on the wallpaper. Hover slides a strip out; click opens the case study.
   ============================================================ */
function ApproachChannels() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <div className="w98" style={{ position: 'absolute', inset: 0, background: '#2f8f88', overflow: 'hidden' }}>
      {/* faint desktop label */}
      <div style={{ position: 'absolute', top: 14, left: 16, color: '#d8efe9', fontFamily: '"Courier New", monospace', fontSize: 11 }}>Active&nbsp;Desktop</div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 26, width: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="w98-raised" style={{ padding: 4 }}>
          {/* metallic header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 9px', marginBottom: 4,
            background: 'linear-gradient(180deg, #d7d7d7 0%, #9a9a9a 48%, #7a7a7a 52%, #b6b6b6 100%)',
            boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #fff' }}>
            <PixelIcon icon="monitor" size={16} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#101010', letterSpacing: '.4px', textShadow: '0 1px 0 #e8e8e8' }}>Channels</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#303030' }}>{SP.length} ch</span>
          </div>
          {/* channel strips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SP.map((p) => {
              const on = hov === p.id;
              return (
                <button key={p.id} onClick={() => setOpen(p)}
                  onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
                  className="w98-sunken" style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: 2, background: '#000',
                    transform: on ? 'translateX(-10px)' : 'none', transition: 'transform .13s ease-out', position: 'relative' }}>
                  <div style={{ position: 'relative', height: 50 }}>
                    <Shot p={p} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
                      padding: '0 9px', background: 'linear-gradient(90deg, rgba(0,0,25,.74) 38%, transparent)', color: '#fff' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 1px 2px #000' }}>{p.name}</div>
                        <div style={{ fontSize: 9, opacity: .85, fontFamily: '"Courier New", monospace' }}>{p.tag}</div>
                      </div>
                      {on && <span className="w98-btn w98-btn-sm" style={{ pointerEvents: 'none', flex: '0 0 auto' }}>View&nbsp;&#9658;</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <ProjectModal p={open} onClose={() => setOpen(null)} />
    </div>
  );
}

Object.assign(window, { ApproachTiles, ApproachExplorer, ApproachWallpaper, ApproachHoverList, ApproachChannels });


/* ============================================================
   PROFESSIONAL WORK — title · image · duration · short blurb,
   click a row → modal with the full write-up.
   Three takes on the same C:\Work\Professional list pattern.
   ============================================================ */
const PRO = [
  { id: 'dragonfly', name: 'Dragonfly', dur: '3 years', icon: 'dragonfly', hue: 152, file: 'dragonfly.exe',
    role: 'Lead Graphics Engineer · 2021–2024',
    short: 'Desktop VR visualizer for aerospace tools.',
    full: 'A desktop VR visualizer that brings aerospace CAD and live telemetry into an immersive, walk-around workspace. I built the real-time renderer, the stereo camera rig and the tool-tracking pipeline that lets engineers inspect full assemblies at 1:1 scale.',
    tech: ['Unity', 'C++', 'OpenXR', 'HLSL'] },
  { id: 'solar', name: 'Solar System Simulation', dur: '10 months', icon: 'gizmo', hue: 38, file: 'solarsim.exe',
    role: 'Simulation Developer · 2020',
    short: 'Real-time planetary simulation and orbital visualization tool.',
    full: 'A real-time planetary simulation and orbital-visualization tool used for space scenes, trajectory planning and educational or technical presentations. Time-warp, n-body integration and a real-scale solar system with labelled transfer orbits.',
    tech: ['Unity', 'C#', 'Physics'] },
  { id: 'animotive', name: 'Animotive', dur: '4 years', icon: 'reel', hue: 286, file: 'animotive.exe',
    role: 'Senior Tools Engineer · 2017–2021',
    short: 'VR movie production software for in-headset filmmaking.',
    full: 'VR movie-production software for in-headset filmmaking — performance capture, virtual cameras and a full timeline editor, all driven from inside the headset so directors can block, shoot and cut a scene without ever leaving VR.',
    tech: ['Unity', 'C#', 'OpenXR'] },
  { id: 'ar', name: 'Freelance AR', dur: '1 year', icon: 'picture', hue: 206, file: 'freelance_ar.exe',
    role: 'Freelance · 2016',
    short: 'Augmented reality interaction and rendering work.',
    full: 'A run of augmented-reality interaction and rendering contracts: marker-less tracking, occlusion-aware compositing and bespoke shader work for mobile AR experiences across retail and architecture clients.',
    tech: ['ARKit', 'Metal', 'Unity'] },
];

/* square render-screenshot thumbnail with a centered pixel glyph */
function RoleThumb({ p, icon = 56 }) {
  return (
    <Shot p={p} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <PixelIcon icon={p.icon} size={icon} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
      </div>
    </Shot>
  );
}

/* shared "Properties"-style modal with the full description */
function RoleModal({ p, onClose }) {
  if (!p) return null;
  return (
    <div onMouseDown={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,40,.55)', display: 'grid', placeItems: 'center', padding: 14 }}>
      <div className="w98 w98-window" style={{ width: '100%', maxWidth: 430 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="w98-titlebar">
          <PixelIcon icon={p.icon} size={16} className="w98-titlebar-icon" />
          <span className="w98-titlebar-text">{p.name} — Properties</span>
          <div className="w98-titlebar-btns">
            <button className="w98-tb-btn" aria-label="help" style={{ fontWeight: 700, fontSize: 10, lineHeight: 1, display: 'grid', placeItems: 'center' }}>?</button>
            <button className="w98-tb-btn" onClick={onClose} aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
          </div>
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <div className="w98-raised" style={{ flex: '0 0 auto', padding: 3 }}>
              <div className="w98-sunken" style={{ padding: 2, background: '#000', width: 92, height: 92, position: 'relative' }}>
                <RoleThumb p={p} icon={48} />
              </div>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: '1px 0 2px', fontSize: 17, fontWeight: 700 }}>{p.name}</h1>
              <div style={{ fontSize: 11, color: 'var(--w98-text-dim)' }}>{p.role}</div>
              <div className="w98-field" style={{ marginTop: 7, fontSize: 11, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span>Duration</span><span style={{ fontWeight: 700, fontFamily: '"Courier New", monospace' }}>{p.dur}</span>
              </div>
            </div>
          </div>
          <div className="w98-prose" style={{ marginTop: 10 }}><p style={{ margin: 0 }}>{p.full}</p></div>
          <div className="w98-group">
            <span className="w98-group-title">Built with</span>
            <div className="w98-chips">{p.tech.map((t) => <span className="w98-chip" key={t}>{t}</span>)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 11 }}>
            <button className="w98-btn is-default" onClick={onClose}>OK</button>
            <button className="w98-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* reusable Explorer window chrome for the work approaches */
function WorkWindow({ children, viewLabel, footer }) {
  return (
    <div className="w98 w98-window" style={{ position: 'absolute', inset: 0, padding: 3 }}>
      <div className="w98-titlebar">
        <PixelIcon icon="folder" size={16} className="w98-titlebar-icon" />
        <span className="w98-titlebar-text">C:\Work\Professional</span>
        <div className="w98-titlebar-btns">
          <button className="w98-tb-btn" aria-label="minimize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="maximize"><svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg></button>
          <button className="w98-tb-btn" aria-label="close"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></button>
        </div>
      </div>
      <div className="w98-menubar"><span className="w98-menu-item"><u>F</u>ile</span><span className="w98-menu-item"><u>E</u>dit</span><span className="w98-menu-item"><u>V</u>iew</span><span className="w98-menu-item"><u>G</u>o</span><span className="w98-menu-item"><u>H</u>elp</span></div>
      {viewLabel}
      {children}
      {footer}
    </div>
  );
}

/* ----- F · Faithful stacked list (matches the reference) ----- */
function ApproachWorkList() {
  const [open, setOpen] = React.useState(null);
  return (
    <WorkWindow
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{PRO.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 120 }}>C:\Work\Professional</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: 9, background: '#fff', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {PRO.map((p) => (
          <button key={p.id} onClick={() => setOpen(p)} className="w98-raised"
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 13, padding: 8, alignItems: 'stretch' }}>
            <div className="w98-sunken" style={{ flex: '0 0 auto', padding: 2, background: '#000', width: 92, height: 92, position: 'relative' }}>
              <RoleThumb p={p} icon={52} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--w98-text-dim)', marginTop: 2 }}>{p.dur}</div>
              <div style={{ borderTop: '1px solid #b6b6b6', boxShadow: '0 1px 0 #fff', margin: '8px 0' }} />
              <div style={{ fontSize: 13, lineHeight: 1.35, textWrap: 'pretty' }}>{p.short}</div>
            </div>
          </button>
        ))}
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

/* ----- G · Two-column card gallery ----- */
function ApproachWorkGrid() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <WorkWindow
      viewLabel={
        <div className="w98-toolbar" style={{ paddingTop: 0 }}>
          <button className="w98-tool-btn"><span style={triL()} />Back</button>
          <button className="w98-tool-btn">Up</button>
          <span className="w98-toolbar-sep" />
          <button className="w98-tool-btn is-on"><PixelIcon icon="picture" size={16} className="w98-tool-ico" />Tiles</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>{PRO.length} items</span>
        </div>
      }
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{PRO.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 120 }}>Tiles view</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: 10, background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PRO.map((p) => {
            const on = hov === p.id;
            return (
              <button key={p.id} onClick={() => setOpen(p)}
                onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
                className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 9, padding: 7, alignItems: 'flex-start',
                  transform: on ? 'translateY(-2px)' : 'none', transition: 'transform .12s' }}>
                <div className="w98-sunken" style={{ flex: '0 0 auto', padding: 2, background: '#000', width: 64, height: 64, position: 'relative' }}>
                  <RoleThumb p={p} icon={38} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap' }}>{p.dur}</span>
                  </div>
                  <div style={{ fontSize: 11.5, lineHeight: 1.3, marginTop: 4, color: 'var(--w98-text)', textWrap: 'pretty' }}>{p.short}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

/* ----- H · Compact rows, duration column + hover highlight ----- */
function ApproachWorkRows() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <WorkWindow
      viewLabel={
        <div className="w98-toolbar" style={{ paddingTop: 0 }}>
          <button className="w98-tool-btn"><span style={triL()} />Back</button>
          <button className="w98-tool-btn">Up</button>
          <span className="w98-toolbar-sep" />
          <button className="w98-tool-btn is-on"><PixelIcon icon="page" size={16} className="w98-tool-ico" />List</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>sorted by duration</span>
        </div>
      }
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{PRO.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 120 }}>List view</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: 2, background: '#fff' }}>
        {PRO.map((p) => {
          const on = hov === p.id;
          return (
            <button key={p.id} onClick={() => setOpen(p)}
              onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 11, padding: '9px 8px', alignItems: 'center', width: '100%', boxSizing: 'border-box',
                borderBottom: '1px solid #e2e2e2', background: on ? '#000080' : 'transparent', color: on ? '#fff' : 'var(--w98-text)' }}>
              <div className="w98-sunken" style={{ flex: '0 0 auto', padding: 2, background: '#000', width: 56, height: 42, position: 'relative' }}>
                <RoleThumb p={p} icon={26} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, opacity: on ? .9 : .72, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.short}</div>
              </div>
              <span style={{ flex: '0 0 auto', fontSize: 11, fontFamily: '"Courier New", monospace', width: 64, textAlign: 'right', opacity: on ? 1 : .8 }}>{p.dur}</span>
              <span style={{ flex: '0 0 auto', width: 14, display: 'grid', placeItems: 'center' }}><span style={triR(on ? '#fff' : '#1d1d1d')} /></span>
            </button>
          );
        })}
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

/* ----- I · Chronological timeline spine ----- */
function ApproachWorkTimeline() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <WorkWindow
      viewLabel={
        <div className="w98-toolbar" style={{ paddingTop: 0 }}>
          <button className="w98-tool-btn"><span style={triL()} />Back</button>
          <button className="w98-tool-btn">Up</button>
          <span className="w98-toolbar-sep" />
          <button className="w98-tool-btn is-on"><PixelIcon icon="info" size={16} className="w98-tool-ico" />Timeline</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>most recent first</span>
        </div>
      }
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{PRO.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 120 }}>Timeline view</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: '14px 14px 14px 8px', background: '#fff' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 73, top: 8, bottom: 8, width: 2, background: '#c0c0c0', boxShadow: 'inset -1px 0 0 #fff' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {PRO.map((p) => {
              const on = hov === p.id;
              return (
                <button key={p.id} onClick={() => setOpen(p)}
                  onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 52, flex: '0 0 auto', textAlign: 'right', paddingRight: 9, fontSize: 11,
                    fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{p.dur}</div>
                  <div style={{ width: 44, flex: '0 0 auto', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div className="w98-raised" style={{ padding: 2 }}>
                      <div className="w98-sunken" style={{ width: 34, height: 34, padding: 1, background: '#000', position: 'relative' }}>
                        <RoleThumb p={p} icon={20} />
                      </div>
                    </div>
                  </div>
                  <div className="w98-raised" style={{ flex: 1, minWidth: 0, padding: '6px 9px',
                    transform: on ? 'translateX(2px)' : 'none', transition: 'transform .12s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.3, marginTop: 3, color: 'var(--w98-text)', textWrap: 'pretty' }}>{p.short}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

/* ----- J · Master–detail list + live preview pane ----- */
function ApproachWorkDetail() {
  const [sel, setSel] = React.useState(PRO[0].id);
  const [open, setOpen] = React.useState(null);
  const p = PRO.find((x) => x.id === sel) || PRO[0];
  return (
    <WorkWindow
      viewLabel={
        <div className="w98-toolbar" style={{ paddingTop: 0 }}>
          <button className="w98-tool-btn"><span style={triL()} />Back</button>
          <button className="w98-tool-btn">Up</button>
          <span className="w98-toolbar-sep" />
          <button className="w98-tool-btn is-on"><PixelIcon icon="folder" size={16} className="w98-tool-ico" />Details</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>select to preview</span>
        </div>
      }
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{p.name}</span>
          <span className="w98-status-cell" style={{ minWidth: 90 }}>{p.dur}</span>
        </div>
      }>
      <div style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', display: 'flex', gap: 5 }}>
        <div className="w98-list w98-sunken w98-scroll" style={{ width: 188, flex: '0 0 auto', overflowY: 'auto' }}>
          {PRO.map((g) => (
            <div key={g.id} className={'w98-list-item' + (g.id === sel ? ' is-sel' : '')}
              onClick={() => setSel(g.id)} onDoubleClick={() => setOpen(g)} style={{ cursor: 'pointer' }}>
              <PixelIcon icon={g.icon} size={16} className="ico" />
              <span>{g.name}</span>
            </div>
          ))}
        </div>
        <div className="w98-sunken" style={{ flex: 1, minWidth: 0, background: '#fff', padding: 10, display: 'flex', flexDirection: 'column' }}>
          <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
            <Shot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
              <FileTag p={p} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <PixelIcon icon={p.icon} size={46} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
              </div>
            </Shot>
          </div>
          <div style={{ margin: '9px 1px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{p.name}</h1>
            <span style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)', whiteSpace: 'nowrap' }}>{p.dur}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--w98-text-dim)', marginTop: 1 }}>{p.role}</div>
          <div className="w98-prose" style={{ marginTop: 8, flex: 1 }}><p style={{ margin: 0 }}>{p.short}</p></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
            <button className="w98-btn is-default" onClick={() => setOpen(p)}>Properties&nbsp;&#9658;</button>
          </div>
        </div>
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

/* ----- K · Banner cards (image-forward, 2-up) ----- */
function ApproachWorkBanner() {
  const [open, setOpen] = React.useState(null);
  const [hov, setHov] = React.useState(null);
  return (
    <WorkWindow
      viewLabel={
        <div className="w98-toolbar" style={{ paddingTop: 0 }}>
          <button className="w98-tool-btn"><span style={triL()} />Back</button>
          <button className="w98-tool-btn">Up</button>
          <span className="w98-toolbar-sep" />
          <button className="w98-tool-btn is-on"><PixelIcon icon="picture" size={16} className="w98-tool-ico" />Thumbnails</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>{PRO.length} items</span>
        </div>
      }
      footer={
        <div className="w98-statusbar" style={{ margin: '3px 1px 0' }}>
          <span className="w98-status-cell grow">{PRO.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 120 }}>Thumbnails view</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', padding: 10, background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          {PRO.map((p) => {
            const on = hov === p.id;
            return (
              <button key={p.id} onClick={() => setOpen(p)}
                onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov((h) => h === p.id ? null : h)}
                className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 3,
                  transform: on ? 'translateY(-3px)' : 'none', transition: 'transform .12s' }}>
                <div className="w98-sunken" style={{ padding: 2, background: '#000', position: 'relative' }}>
                  <Shot p={p} style={{ aspectRatio: '16 / 8', height: 'auto' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                      <PixelIcon icon={p.icon} size={40} style={{ opacity: .9, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
                    </div>
                    <span style={{ position: 'absolute', top: 6, right: 6, fontFamily: '"Courier New", monospace', fontSize: 10,
                      color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '1px 5px' }}>{p.dur}</span>
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 9px 6px',
                      background: 'linear-gradient(transparent, rgba(0,0,20,.8))', color: '#fff' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, textShadow: '0 1px 2px #000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    </div>
                  </Shot>
                </div>
                <div style={{ padding: '7px 6px 5px', fontSize: 11.5, lineHeight: 1.3, color: 'var(--w98-text)', textWrap: 'pretty' }}>{p.short}</div>
              </button>
            );
          })}
        </div>
      </div>
      <RoleModal p={open} onClose={() => setOpen(null)} />
    </WorkWindow>
  );
}

Object.assign(window, { ApproachWorkList, ApproachWorkGrid, ApproachWorkRows, ApproachWorkTimeline, ApproachWorkDetail, ApproachWorkBanner,
  /* shared helpers for sibling approach files */
  Shot, FileTag, RoleModal, RoleThumb, WorkWindow, triL, triR });
