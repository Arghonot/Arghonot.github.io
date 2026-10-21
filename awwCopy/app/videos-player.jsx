/* app/videos-player.jsx \u2014 VideosPlayer ported VERBATIM from index_old
   (Videos.html / videos-player.jsx), including its own fixed 940\u00d7680 window
   size and desktop-only two-column layout. Per instruction this window is
   explicitly EXEMPT from the responsive "laws" applied to every other window
   in this rebuild (no stack prop, no reflow, no maxHeight/maxWidth clamp) \u2014
   it stays exactly as authored in index_old. Self-contained: inlines WinTitle
   (from landing-shared.jsx) so it has no cross-file dependency beyond
   window.PixelIcon. CSS (.vp-*) lives in index.html, copied verbatim from
   index_old.html. */
function WinTitle({ icon, img, title, inactive, onClose }) {
  const g = {
    min: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>,
    max: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>,
    close: <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>
  };
  return (
    <div className={'w98-titlebar' + (inactive ? ' is-inactive' : '')}>
      {img
        ? <img src={img} alt="" className="w98-titlebar-icon" style={{ width: 16, height: 16 }} />
        : icon && <window.PixelIcon icon={icon} size={16} className="w98-titlebar-icon" />}
      <span className="w98-titlebar-text" style={{ fontFamily: '"Tahoma"' }}>{title}</span>
      <div className="w98-titlebar-btns">
        <button className="w98-tb-btn" aria-label="minimize"><span className="w98-tb-glyph">{g.min}</span></button>
        <button className="w98-tb-btn" aria-label="maximize"><span className="w98-tb-glyph">{g.max}</span></button>
        <button className="w98-tb-btn" aria-label="close" onClick={onClose}><span className="w98-tb-glyph">{g.close}</span></button>
      </div>
    </div>
  );
}

const VLIB = [
  { id: 'sf', label: 'Sieur Flamme', hue: 18, items: [
    { id: 'sf1', name: 'Episode 1', tag: 'EP 01', file: 'sieur_flamme_ep01.mp4', dur: 95,  kind: 'video', src: null },
    { id: 'sf2', name: 'Episode 2', tag: 'EP 02', file: 'sieur_flamme_ep02.mp4', dur: 88,  kind: 'video', src: null },
    { id: 'sf3', name: 'Episode 3', tag: 'EP 03', file: 'sieur_flamme_ep03.mp4', dur: 112, kind: 'video', src: null },
    { id: 'sf4', name: 'Episode 4', tag: 'EP 04', file: 'sieur_flamme_ep04.mp4', dur: 76,  kind: 'video', src: null },
  ] },
  { id: 'br', label: 'Backrooms', hue: 122, items: [
    { id: 'br1', name: 'Episode 1', tag: 'EP 01', file: 'backrooms_ep01.mp4', dur: 64, kind: 'video', src: null },
    { id: 'br2', name: 'Episode 2', tag: 'EP 02', file: 'backrooms_ep02.mp4', dur: 71, kind: 'video', src: null },
    { id: 'br3', name: 'Episode 3', tag: 'EP 03', file: 'backrooms_ep03.mp4', dur: 83, kind: 'video', src: null },
  ] },
  { id: 'art', label: 'Artistic stuff', hue: 266, items: [
    { id: 'a1', name: 'Noise study',  tag: 'CLIP',  file: 'noise_study.mp4',    dur: 42, kind: 'video', src: null },
    { id: 'a2', name: 'Light study',  tag: 'CLIP',  file: 'light_study.mp4',    dur: 51, kind: 'video', src: null },
    { id: 'a3', name: 'Composition 04', tag: 'STILL', file: 'composition_04.png', dur: 0, kind: 'image', src: null },
  ] },
];

const VP_FLAT = VLIB.flatMap((f) => f.items.map((it) => Object.assign({ series: f.label, hue: f.hue }, it)));
const vpFmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

const vpTri = (dir, c = '#00007b') => ({ width: 0, height: 0,
  borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
  [dir === 'r' ? 'borderLeft' : 'borderRight']: '11px solid ' + c });

function VpBtn({ onClick, label, children }) {
  return <button className="vp-tbtn" onClick={onClick} aria-label={label}>{children}</button>;
}

function VpScreen({ it, playing, t }) {
  if (it.src && it.kind === 'image') {
    return <img src={it.src} alt={it.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />;
  }
  const h = it.hue;
  return (
    <div className="vp-canvas" style={{
      background:
        `radial-gradient(120% 70% at 50% 18%, hsl(${h} 45% 30% / .55) 0%, transparent 60%),` +
        `repeating-linear-gradient(135deg, hsl(${h} 24% 13%) 0 11px, hsl(${h} 26% 17%) 11px 22px)` }}>
      <span className="vp-cap-top">{it.series + ' \u00b7 ' + it.name}</span>
      <span className="vp-ep" style={{ color: `hsl(${h} 70% 78%)` }}>{it.tag}</span>
      <span className="vp-drop">{'[ ' + (it.kind === 'image' ? 'still' : 'vertical video') + ' placeholder ]'}<br />{'drop ' + it.file}</span>
      {!playing && it.kind === 'video' && (
        <span className="vp-paused"><span style={vpTri('r', '#fff')} /></span>
      )}
      <span className="vp-scan" aria-hidden="true"></span>
    </div>
  );
}

function VideosPlayer({ onClose }) {
  const first = VP_FLAT[0];
  const [curId, setCurId] = React.useState(first.id);
  const [playing, setPlaying] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [open, setOpen] = React.useState({ sf: true, br: true, art: true });
  const videoRef = React.useRef(null);
  const cur = VP_FLAT.find((x) => x.id === curId) || first;
  const idx = VP_FLAT.indexOf(cur);

  const pick = (id) => { setCurId(id); setT(0); const it = VP_FLAT.find((x) => x.id === id); setPlaying(it && it.kind === 'video'); };
  const go = (d) => pick(VP_FLAT[(idx + d + VP_FLAT.length) % VP_FLAT.length].id);

  React.useEffect(() => {
    if (!playing || cur.kind !== 'video' || cur.src) return;
    const iv = setInterval(() => setT((v) => v + 0.25), 250);
    return () => clearInterval(iv);
  }, [playing, curId]);
  React.useEffect(() => {
    if (playing && cur.kind === 'video' && cur.dur > 0 && t >= cur.dur) go(1);
  }, [t]);
  React.useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (playing) { v.play && v.play().catch(() => {}); } else { v.pause && v.pause(); }
  }, [playing, curId]);

  const seek = (e) => {
    if (cur.kind !== 'video' || !cur.dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nt = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * cur.dur;
    setT(nt);
    if (videoRef.current) videoRef.current.currentTime = nt;
  };
  const pct = cur.dur ? Math.min(100, (t / cur.dur) * 100) : 0;
  const counts = { v: VP_FLAT.filter((x) => x.kind === 'video').length, i: VP_FLAT.filter((x) => x.kind === 'image').length };

  return (
    <div className="w98 w98-window vp-win" data-screen-label="My Videos" onMouseDown={(e) => e.stopPropagation()}>
      <WinTitle img="assets/icons/video-player.png" title={'My Videos \u2014 Media Player'} onClose={onClose} />
      <div className="w98-menubar" style={{ padding: '1px 2px 2px' }}>
        {['File', 'View', 'Play', 'Favorites', 'Help'].map((m) => <div key={m} className="w98-menu-item"><u>{m[0]}</u>{m.slice(1)}</div>)}
      </div>
      <div className="vp-body">
        <div className="vp-tree w98-sunken w98-scroll">
          <div className="vp-root"><window.PixelIcon icon="monitor" size={16} className="ico" />My Videos (C:)</div>
          {VLIB.map((f) => (
            <div key={f.id}>
              <div className="vp-node" onClick={() => setOpen((o) => Object.assign({}, o, { [f.id]: !o[f.id] }))}>
                <span className="vp-pm">{open[f.id] ? '\u2212' : '+'}</span>
                <window.PixelIcon icon="folder" size={16} className="ico" />
                <span className="lbl">{f.label}</span>
                <span className="cnt">{f.items.length}</span>
              </div>
              {open[f.id] && (
                <div className="vp-leaves">
                  {f.items.map((it) => (
                    <div key={it.id} className={'vp-leaf' + (it.id === curId ? ' is-sel' : '')} onClick={() => pick(it.id)}>
                      <window.PixelIcon icon={it.kind === 'image' ? 'picture' : 'reel'} size={16} className="ico" />
                      <span className="lbl">{it.name}</span>
                      <span className="dur">{it.kind === 'image' ? 'PNG' : vpFmt(it.dur)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="vp-stagewrap w98-sunken">
          <div className="vp-frame">
            {cur.src && cur.kind === 'video'
              ? <video ref={videoRef} key={cur.id} src={cur.src} playsInline
                  onTimeUpdate={(e) => setT(e.target.currentTime)} onEnded={() => go(1)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
              : <VpScreen it={cur} playing={playing} t={t} />}
          </div>
        </div>
      </div>
      <div className="vp-transport">
        <VpBtn label="previous" onClick={() => go(-1)}><span style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 3, height: 12, background: '#00007b' }} /><span style={vpTri('l')} /></span></VpBtn>
        <VpBtn label={playing ? 'pause' : 'play'} onClick={() => cur.kind === 'video' && setPlaying((p) => !p)}>
          {playing
            ? <span style={{ display: 'flex', gap: 3 }}><span style={{ width: 4, height: 13, background: '#00007b' }} /><span style={{ width: 4, height: 13, background: '#00007b' }} /></span>
            : <span style={Object.assign({ marginLeft: 3 }, vpTri('r'))} />}
        </VpBtn>
        <VpBtn label="stop" onClick={() => { setPlaying(false); setT(0); if (videoRef.current) videoRef.current.currentTime = 0; }}><span style={{ width: 12, height: 12, background: '#1d1d1d' }} /></VpBtn>
        <VpBtn label="next" onClick={() => go(1)}><span style={{ display: 'flex', alignItems: 'center' }}><span style={vpTri('r')} /><span style={{ width: 3, height: 12, background: '#00007b' }} /></span></VpBtn>
        <div className="w98-sunken vp-seek" style={{ padding: 0, cursor: 'pointer' }} onClick={seek}>
          <div className="fill" style={{ width: pct + '%' }}></div>
          <div className="knob" style={{ left: 'calc(' + pct + '% - 4px)' }}></div>
        </div>
        <span className="vp-time">
          {cur.kind === 'image' ? '\u2014 : \u2014' : vpFmt(t) + ' / ' + vpFmt(cur.dur)}
        </span>
      </div>
      <div className="w98-statusbar" style={{ margin: '0 3px 3px' }}>
        <span className="w98-status-cell grow">{(cur.kind === 'image' ? 'Viewing' : playing ? 'Playing' : 'Paused') + ' \u2014 ' + cur.series + ' \u00b7 ' + cur.name}</span>
        <span className="w98-status-cell">9:16</span>
        <span className="w98-status-cell">{counts.v + ' clips \u00b7 ' + counts.i + ' still'}</span>
      </div>
    </div>
  );
}

Object.assign(window, { VideosPlayer });
