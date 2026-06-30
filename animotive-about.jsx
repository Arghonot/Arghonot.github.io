/* animotive-about.jsx — "About Me" section, three Win98 approaches.
   Reuses styles/win98.css + pixel-icons.jsx. Black/orange reference re-cast
   into the silver-bevel OS language: warm-dark photo wells + an orange
   beveled "experience seal" as the accent. Exports to window. */

const ABOUT = {
  name: 'Your Name',
  role: 'Unity Developer',
  exp: '8+',
  location: 'Remote \u00b7 Worldwide',
  status: 'Open to work',
  eyebrow: '03 >_ ABOUT ME',
  heading: ['Engineering meets', 'creative exploration'],
  blurb:
    "I'm a Unity developer blending solid engineering with creative exploration. Over the years I've shipped aerospace simulation tools, VR filmmaking software, and personal projects that push the boundaries of real-time graphics.",
  blurb2:
    'I build tools, craft shaders, and design 3D environments that inspire developers and artists alike \u2014 always experimenting, always shipping.',
  tech: [
    'C# / ShaderLab', 'Unity / VR / XR', 'Shader Graph', 'Networking (Photon)',
    '3D / Blender', 'Real-time rendering', 'Procedural gen', 'REST / TCP / UDP',
  ],
  links: [
    { label: 'Download r\u00e9sum\u00e9', kind: 'resume', icon: 'page' },
    { label: 'LinkedIn', kind: 'ext' },
    { label: 'Instagram', kind: 'ext' },
  ],
};

/* ---- the one accent: classic Win98 title-bar navy (no orange) ---- */
const ACCENT = '#00007b';
const SEAL_BG = 'linear-gradient(90deg, #00007b 0%, #1083d4 100%)';

/* ---- experience seal (8+ years) — styled like a little title bar ---- */
function ExpBadge({ big, style }) {
  return (
    <div style={{ background: SEAL_BG, color: '#fff', textAlign: 'center', padding: big ? '12px 16px' : '8px 12px',
      boxShadow: 'inset -1px -1px 0 #000, inset 1px 1px 0 #5a9fd4', ...style }}>
      <div style={{ fontSize: big ? 34 : 24, fontWeight: 700, lineHeight: 1, letterSpacing: '-.5px', textShadow: '1px 1px 0 rgba(0,0,0,.45)' }}>{ABOUT.exp}</div>
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4 }}>years exp.</div>
    </div>
  );
}

/* ---- portrait well (drop a headshot) ---- */
function PhotoFrame({ ratio = '3 / 4', height = 'auto', badge = false, label = 'portrait' }) {
  return (
    <div className="w98-sunken" style={{ padding: 2, background: '#000', position: 'relative' }}>
      <div style={{
        position: 'relative',
        aspectRatio: height === 'auto' ? ratio : undefined,
        height: height === 'auto' ? undefined : height,
        background: 'repeating-linear-gradient(135deg, #26282b 0 8px, #303237 8px 16px)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '1px', color: '#7d8791', textTransform: 'uppercase' }}>[ drop {label} ]</div>
        {badge && <ExpBadge style={{ position: 'absolute', left: 10, bottom: 10 }} />}
      </div>
    </div>
  );
}

/* ---- link buttons (résumé / linkedin / instagram) ---- */
function LinkButtons({ stack }) {
  const A = ({ children, primary, icon }) => (
    <button className={'w98-btn' + (primary ? ' is-default' : '')}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: stack ? 0 : 70, width: stack ? '100%' : undefined }}>
      {icon && <PixelIcon icon={icon} size={14} />}{children}
    </button>
  );
  return (
    <div style={{ display: 'flex', flexDirection: stack ? 'column' : 'row', gap: 7, flexWrap: 'wrap' }}>
      <A primary icon="page">Download r&eacute;sum&eacute;</A>
      <A>LinkedIn &#8599;</A>
      <A>Instagram &#8599;</A>
    </div>
  );
}

/* ---- monospace skill list with orange square bullets (echoes the reference) ---- */
function SkillGrid({ cols = 2 }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, columnCount: cols, columnGap: 22 }}>
      {ABOUT.tech.map((t) => (
        <li key={t} style={{ position: 'relative', padding: '3px 0 3px 14px', fontFamily: '"Courier New", monospace', fontSize: 11, color: '#2a2a2a', breakInside: 'avoid' }}>
          <span style={{ position: 'absolute', left: 0, top: 7, width: 6, height: 6, background: ACCENT }} />
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ---- raised chips (alt skill display) ---- */
function AboutChips() {
  return (
    <div className="w98-chips">
      {ABOUT.tech.map((t) => <span className="w98-chip" key={t}>{t}</span>)}
    </div>
  );
}

/* ---- reusable title bar (info icon) ---- */
function AboutTitleBar({ title }) {
  const Btn = ({ glyph, label }) => (
    <button className="w98-tb-btn" aria-label={label}><span className="w98-tb-glyph">{glyph}</span></button>
  );
  return (
    <div className="w98-titlebar">
      <PixelIcon icon="info" size={16} className="w98-titlebar-icon" />
      <span className="w98-titlebar-text">{title}</span>
      <div className="w98-titlebar-btns">
        <Btn label="minimize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>} />
        <Btn label="maximize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>} />
        <Btn label="close" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>} />
      </div>
    </div>
  );
}

Object.assign(window, { ABOUT, ACCENT, SEAL_BG, ExpBadge, PhotoFrame, LinkButtons, SkillGrid, AboutChips, AboutTitleBar });
