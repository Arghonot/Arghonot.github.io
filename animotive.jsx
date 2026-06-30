/* animotive.jsx — simplified Win98 project modal, 3 layout approaches.
   Reuses styles/win98.css + pixel-icons.jsx. Exports to window. */

const AM = {
  title: 'Animotive',
  meta: '4 years \u00b7 Retinize (remote)',
  context: 'I worked on Animotive, a VR-based movie production tool that lets users animate 3D characters and create scenes in real time. I first contributed as an in-house Unity developer at Retinize, then continued working on the project remotely after moving abroad.',
  work: [
    'Created a custom VR UI toolkit in close collaboration with the UX designer.',
    'Implemented multiplayer features via Photon Bolt.',
    'Developed a full-body tracking calibration workflow.',
    'Built a GPU-based, collider-less raycasting system for accurate submesh interaction.',
    'Created custom shaders for teleportation lasers, glow highlights, and visual feedback.',
    'Helped scale the VR UI to desktop, maintaining design and usability consistency.',
    'Contributed to internal R&D focused on efficient UI rendering for VR environments.',
  ],
  tech: ['C#', 'ShaderLab', 'Shader Graph', 'Unity', 'Rider', 'Git', 'Virtual Reality'],
};

/* ---- fluff title bar ---- */
function AmTitleBar({ title }) {
  const Btn = ({ glyph, label }) => (
    <button className="w98-tb-btn" aria-label={label}><span className="w98-tb-glyph">{glyph}</span></button>
  );
  return (
    <div className="w98-titlebar">
      <PixelIcon icon="reel" size={16} className="w98-titlebar-icon" />
      <span className="w98-titlebar-text">{title}</span>
      <div className="w98-titlebar-btns">
        <Btn label="minimize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>} />
        <Btn label="maximize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>} />
        <Btn label="close" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>} />
      </div>
    </div>
  );
}

/* ---- fluff menu bar (opens, items inert) ---- */
const AM_MENUS = {
  File: ['New', 'Open\u2026', 'Save', 'Print\u2026', '-', 'Exit'],
  Edit: ['Undo', 'Cut', 'Copy', 'Paste'],
  View: ['Toolbar', 'Status Bar', '-', 'Refresh'],
  Tools: ['Options\u2026'],
  Help: ['About Animotive\u2026'],
};
function AmMenuBar() {
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => {
    if (!open) return;
    const h = () => setOpen(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, [open]);
  return (
    <div className="w98-menubar">
      {Object.keys(AM_MENUS).map((label) => (
        <div key={label} style={{ position: 'relative' }}>
          <div className={'w98-menu-item' + (open === label ? ' is-open' : '')}
            onClick={(e) => { e.stopPropagation(); setOpen(open === label ? null : label); }}
            onMouseEnter={() => open && setOpen(label)}>
            <u>{label[0]}</u>{label.slice(1)}
          </div>
          {open === label && (
            <div className="w98-raised" onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, minWidth: 150, padding: 2 }}>
              {AM_MENUS[label].map((it, i) => it === '-'
                ? <div key={i} style={{ height: 0, margin: '3px 2px', borderTop: '1px solid #808080', boxShadow: '0 1px 0 #fff' }} />
                : <div key={i} onClick={() => setOpen(null)}
                    style={{ padding: '3px 18px', fontSize: 11, whiteSpace: 'nowrap', cursor: 'default', color: '#454545' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#454545'; }}>
                    {it}
                  </div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---- big media / video player placeholder (drop image or YouTube embed) ---- */
function MediaPlayer({ height = 'auto', ratio = '16 / 9', caption = 'Animotive — demo reel', hint = 'drop image or embed YouTube' }) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
      <div style={{
        position: 'relative', aspectRatio: height === 'auto' ? ratio : undefined,
        height: height === 'auto' ? undefined : height,
        background: 'repeating-linear-gradient(135deg, #11202b 0 8px, #162a38 8px 16px)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)', pointerEvents: 'none' }} />
        {/* corner label */}
        <div style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#8fd3e8', textTransform: 'uppercase' }}>
          {caption}
        </div>
        {/* center play / pause */}
        <button onClick={() => setPlaying((p) => !p)} aria-label="play"
          style={{ all: 'unset', cursor: 'pointer', zIndex: 2 }}>
          <div className="w98-raised" style={{ width: 56, height: 56, display: 'grid', placeItems: 'center' }}>
            {playing
              ? <div style={{ display: 'flex', gap: 5 }}><span style={{ width: 7, height: 20, background: '#00007b' }} /><span style={{ width: 7, height: 20, background: '#00007b' }} /></div>
              : <div style={{ width: 0, height: 0, borderLeft: '20px solid #00007b', borderTop: '12px solid transparent', borderBottom: '12px solid transparent', marginLeft: 6 }} />}
          </div>
        </button>
        <div style={{ position: 'absolute', bottom: 30, fontFamily: '"Courier New", monospace', fontSize: 9, color: '#6fb0c4', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          [ {hint} ]
        </div>
        {/* transport / scrubber */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, background: 'var(--w98-face)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 7px',
          boxShadow: 'inset 0 1px 0 #fff' }}>
          <span style={{ width: 0, height: 0, borderLeft: '7px solid #1d1d1d', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
          <div className="w98-sunken" style={{ flex: 1, height: 8, position: 'relative', padding: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: playing ? '38%' : '8%', background: '#000080' }} />
            <div className="w98-raised" style={{ position: 'absolute', left: playing ? '38%' : '8%', top: -2, width: 7, height: 12 }} />
          </div>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#1d1d1d' }}>{playing ? '0:58' : '0:00'} / 2:34</span>
        </div>
      </div>
    </div>
  );
}

/* ---- shared content blocks ---- */
function TechChips() {
  return (
    <div className="w98-chips">
      {AM.tech.map((t) => <span className="w98-chip" key={t}>{t}</span>)}
    </div>
  );
}
function HeaderBlock({ big }) {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: big ? 22 : 18, fontWeight: 700, letterSpacing: '.3px' }}>{AM.title}</h1>
      <div style={{ fontSize: 11, color: 'var(--w98-text-dim)', marginTop: 2 }}>{AM.meta}</div>
    </div>
  );
}
function WorkList() {
  return (
    <ul className="w98-bullets">
      {AM.work.map((w, i) => <li key={i}>{w}</li>)}
    </ul>
  );
}

/* responsive: observe a container's width, return [ref, isNarrow] */
function useNarrow(threshold = 470) {
  const ref = React.useRef(null);
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((es) => { for (const e of es) setNarrow(e.contentRect.width < threshold); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [threshold]);
  return [ref, narrow];
}

Object.assign(window, { AM, AmTitleBar, AmMenuBar, MediaPlayer, TechChips, HeaderBlock, WorkList, useNarrow });
