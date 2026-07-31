/* app/readme-window.jsx — ReadmeWindow ported from index_old (work-final.jsx),
   adapted to use window.FlowWindow + window.WordArt (contact/app/legal-window.jsx,
   app/word-art.jsx). Desktop keeps the original two-column layout verbatim;
   a `stack` prop (driven by a matchMedia listener) reorders to wordart / reel /
   specs / notepad for small screens, per the responsive reference. */
const README_SPECS = [
  ['Role', 'Unity XR Engineer'],
  ['Focus', 'Rendering \u00b7 XR \u00b7 engineering'],
  ['Experience', 'Airbus DS \u00b7 Ret\u00ecn\u00edZE \u00b7 Freelance'],
  ['Delivery', 'Prototype > architecture > deployment'],
  ['Work mode', 'Good energy \u00b7 serious execution'],
];
const README_LINES = [
  'For more than eight years, I\u2019ve built VR, AR, and real-time graphics applications across aerospace, virtual production, and cultural experiences.',
  'I specialize in the intersection of programming, rendering, systems engineering, and practical UX.',
  'I take projects from early prototypes through architecture, production, deployment, and long-term maintenance.',
  'Easy to work with, serious about the craft, and fully invested in making the final result exceptional.',
];

function BulletRule() {
  return (
    <div aria-hidden="true" style={{ height: 3, margin: '7px 0',
      backgroundImage: 'radial-gradient(circle, #b4b4b4 1.1px, transparent 1.4px)',
      backgroundSize: '9px 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left center' }} />
  );
}

function ReelVideo({ src = 'assets/videos/freelance.mp4', label = 'EXPERIENCE \u2014 REEL', hint = 'DROP 20s REEL / CLIP', stack }) {
  const [ok, setOk] = React.useState(true);
  const [pct, setPct] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    const p = v.play && v.play(); if (p && p.catch) p.catch(() => {});
  }, [ok]);
  return (
    <div className="w98-sunken" style={stack
      ? { padding: 2, background: '#000', width: '100%', height: 380, display: 'flex' }
      : { padding: 2, background: '#000', flex: '1 1 546px', minWidth: 338, display: 'flex' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, background: '#000', overflow: 'hidden' }}>
        {ok && (
          <video ref={ref} src={src} autoPlay loop muted playsInline preload="auto"
            onError={() => setOk(false)}
            onTimeUpdate={(e) => { const d = e.target.duration; if (d) setPct((e.target.currentTime / d) * 100); }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', background: '#000' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#8fd3e8', textTransform: 'uppercase' }}>{label}</div>
        {!ok && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6fb0c4', textTransform: 'uppercase', letterSpacing: '.5px' }}>[ {hint} ]</div>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, background: 'var(--w98-face)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 7px', boxShadow: 'inset 0 1px 0 #fff' }}>
          <span style={{ display: 'flex', gap: 2 }}><span style={{ width: 3, height: 11, background: '#00007b' }} /><span style={{ width: 3, height: 11, background: '#00007b' }} /></span>
          <div className="w98-sunken" style={{ flex: 1, height: 8, position: 'relative', padding: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (ok ? pct : 0) + '%', background: '#000080' }} />
          </div>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#1d1d1d' }}>LOOP</span>
        </div>
      </div>
    </div>
  );
}

function ReadmeWindow({ onClose, stack }) {
  const NOTE_MENUS = ['File', 'Edit', 'Format', 'View', 'Help'];
  const wordart = (
    <div style={{ padding: stack ? '4px 4px 10px' : '16px 10px 14px' }}>
      <window.WordArt variant="spectrum" lines={['My experience']} size={stack ? 'clamp(22px,8.6vw,40px)' : 56} />
    </div>
  );
  const specs = (
    <div className="w98-field" style={{ padding: '9px 13px', flex: '0 0 auto' }}>
      {README_SPECS.map(([k, v], i) => (
        <React.Fragment key={k}>
          {i > 0 && <BulletRule />}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ flex: '0 0 132px', fontSize: 18, color: 'var(--w98-text-dim)' }}>{k}</span>
            <span style={{ flex: '1 1 auto', minWidth: 0, fontSize: 18,
              color: k === 'Experience' ? '#00007b' : 'var(--w98-text)', fontWeight: k === 'Experience' ? 700 : 400 }}>{v}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
  const notepad = (
    <div className="w98-field w98-scroll" style={{ background: '#fff', padding: '12px 14px', flex: stack ? '0 0 auto' : '1 1 auto', minHeight: 0,
      overflowY: stack ? 'visible' : 'auto', fontFamily: '"Courier New", monospace', fontSize: 17, lineHeight: 1.55, color: '#1d1d1d' }}>
      <div style={{ fontWeight: 700 }}>ReadMe.Txt</div>
      <div style={{ color: '#5a5a5a' }}>Lo&iuml;ck Rivemale &middot; portfolio 98</div>
      <div style={{ borderTop: '1px solid #cfcfcf', margin: '8px 0' }} />
      <p style={{ margin: '0 0 11px', fontWeight: 700 }}>Hi there!</p>
      {README_LINES.map((l, i) => (
        <p key={i} style={{ margin: i === README_LINES.length - 1 ? 0 : '0 0 11px' }}>{l}</p>
      ))}
      <div style={{ marginTop: 11, color: '#9a9a9a' }}>_</div>
    </div>
  );
  return (
    <window.FlowWindow img="assets/icons/readme.png" title={'C:\\ReadMe.txt'} onClose={onClose} width={stack ? undefined : 1080}
      style={stack ? { display: 'flex', flexDirection: 'column' } : { maxHeight: 968, maxWidth: 'calc(100vw - 24px)', display: 'flex', flexDirection: 'column' }}
      menubar={
        <div className="w98-menubar">
          {NOTE_MENUS.map((m) => (
            <span key={m} className="w98-menu-item" aria-disabled="true"
              style={{ color: '#808080', textShadow: '1px 1px 0 #fff', cursor: 'default', pointerEvents: 'none' }}>
              <u>{m[0]}</u>{m.slice(1)}
            </span>
          ))}
        </div>
      }>
      {stack ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '13px 13px 14px' }}>
          {wordart}
          <ReelVideo stack />
          {specs}
          {notepad}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 13, padding: '13px 13px 14px', flex: '1 1 auto', minHeight: 0 }}>
          <ReelVideo />
          <div style={{ flex: '1 1 480px', minWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {wordart}
            {specs}
            {notepad}
          </div>
        </div>
      )}
    </window.FlowWindow>
  );
}

Object.assign(window, { ReadmeWindow });
