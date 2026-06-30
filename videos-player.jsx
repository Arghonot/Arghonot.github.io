/* videos-player.jsx — "My Videos" page: every series in one Win98 window.
   Classic Media-Player chrome, a 9:16 vertical stage (Instagram format),
   and an Explorer-style tree to pick episodes — Sieur Flamme / Backrooms /
   Artistic stuff. Clips auto-advance like a playlist.
   Placeholder clips are striped stand-ins: set `src: 'uploads/yourfile.mp4'`
   (or .png/.jpg for stills) on any item below and the stage plays the real
   file with the same transport. Page styles (.vp-*) live in Videos.html. */

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

/* transport glyphs (pure CSS shapes, WMP-style) */
const vpTri = (dir, c = '#00007b') => ({ width: 0, height: 0,
  borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
  [dir === 'r' ? 'borderLeft' : 'borderRight']: '11px solid ' + c });

function VpBtn({ onClick, label, children }) {
  return <button className="lp-wmp-btn" onClick={onClick} aria-label={label} style={{ border: 0 }}>{children}</button>;
}

/* the vertical stage content for one item (placeholder or real file) */
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
      <span className="vp-cap-top">{it.series} · {it.name}</span>
      <span className="vp-ep" style={{ color: `hsl(${h} 70% 78%)` }}>{it.tag}</span>
      <span className="vp-drop">[ {it.kind === 'image' ? 'still' : 'vertical video'} placeholder ]<br />drop {it.file}</span>
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

  /* fake playhead for placeholder clips; real <video> drives t itself */
  React.useEffect(() => {
    if (!playing || cur.kind !== 'video' || cur.src) return;
    const iv = setInterval(() => setT((v) => v + 0.25), 250);
    return () => clearInterval(iv);
  }, [playing, curId]);
  React.useEffect(() => {
    if (playing && cur.kind === 'video' && cur.dur > 0 && t >= cur.dur) go(1); /* auto-advance */
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
      <WinTitle img="uploads/VideoPlayerBalanced-6ddd7913.png" title="My Videos — Media Player" onClose={onClose} />
      <div className="w98-menubar" style={{ padding: '1px 2px 2px' }}>
        {['File', 'View', 'Play', 'Favorites', 'Help'].map((m) => <div key={m} className="w98-menu-item"><u>{m[0]}</u>{m.slice(1)}</div>)}
      </div>

      <div className="vp-body">
        {/* ---- Explorer tree ---- */}
        <div className="vp-tree w98-sunken w98-scroll">
          <div className="vp-root"><PixelIcon icon="monitor" size={16} className="ico" />My Videos (C:)</div>
          {VLIB.map((f) => (
            <div key={f.id}>
              <div className="vp-node" onClick={() => setOpen((o) => Object.assign({}, o, { [f.id]: !o[f.id] }))}>
                <span className="vp-pm">{open[f.id] ? '\u2212' : '+'}</span>
                <PixelIcon icon="folder" size={16} className="ico" />
                <span className="lbl">{f.label}</span>
                <span className="cnt">{f.items.length}</span>
              </div>
              {open[f.id] && (
                <div className="vp-leaves">
                  {f.items.map((it) => (
                    <div key={it.id} className={'vp-leaf' + (it.id === curId ? ' is-sel' : '')} onClick={() => pick(it.id)}>
                      <PixelIcon icon={it.kind === 'image' ? 'picture' : 'reel'} size={16} className="ico" />
                      <span className="lbl">{it.name}</span>
                      <span className="dur">{it.kind === 'image' ? 'PNG' : vpFmt(it.dur)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ---- vertical stage ---- */}
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

      {/* ---- transport ---- */}
      <div className="lp-wmp-transport" style={{ margin: '0 1px' }}>
        <VpBtn label="previous" onClick={() => go(-1)}><span style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 3, height: 12, background: '#00007b' }} /><span style={vpTri('l')} /></span></VpBtn>
        <VpBtn label={playing ? 'pause' : 'play'} onClick={() => cur.kind === 'video' && setPlaying((p) => !p)}>
          {playing
            ? <span style={{ display: 'flex', gap: 3 }}><span style={{ width: 4, height: 13, background: '#00007b' }} /><span style={{ width: 4, height: 13, background: '#00007b' }} /></span>
            : <span style={Object.assign({ marginLeft: 3 }, vpTri('r'))} />}
        </VpBtn>
        <VpBtn label="stop" onClick={() => { setPlaying(false); setT(0); if (videoRef.current) videoRef.current.currentTime = 0; }}><span style={{ width: 12, height: 12, background: '#1d1d1d' }} /></VpBtn>
        <VpBtn label="next" onClick={() => go(1)}><span style={{ display: 'flex', alignItems: 'center' }}><span style={vpTri('r')} /><span style={{ width: 3, height: 12, background: '#00007b' }} /></span></VpBtn>
        <div className="w98-sunken lp-wmp-seek" style={{ padding: 0, cursor: 'pointer' }} onClick={seek}>
          <div className="fill" style={{ width: pct + '%' }}></div>
          <div className="knob" style={{ left: 'calc(' + pct + '% - 4px)' }}></div>
        </div>
        <span style={{ fontFamily: '"Courier New", monospace', fontSize: 11, whiteSpace: 'nowrap' }}>
          {cur.kind === 'image' ? '— : —' : vpFmt(t) + ' / ' + vpFmt(cur.dur)}
        </span>
      </div>

      <div className="w98-statusbar" style={{ margin: '0 3px 3px' }}>
        <span className="w98-status-cell grow">{cur.kind === 'image' ? 'Viewing' : playing ? 'Playing' : 'Paused'} — {cur.series} · {cur.name}</span>
        <span className="w98-status-cell">9:16</span>
        <span className="w98-status-cell">{counts.v} clips · {counts.i} still</span>
      </div>
    </div>
  );
}

/* ---------------- full desktop around the player ---------------- */
function VideosDesktop() {
  const [startOpen, setStartOpen] = React.useState(false);
  const tasks = [{ id: 'vp', icon: 'reel', title: 'My Videos — Media Player' }];
  return (
    <div className="d98-root w98" data-screen-label="Videos desktop" onMouseDown={() => setStartOpen(false)}>
      <div className="d98-iconlayer" style={{ gridTemplateColumns: 'repeat(1, 104px)' }} onMouseDown={(e) => e.stopPropagation()}>
        <a className="d98-icon" href="Landing v2.html" style={{ textDecoration: 'none' }}>
          <span className="d98-icon-imgwrap"><PixelIcon icon="monitor" size={36} className="d98-icon-img" /></span>
          <span className="d98-icon-label">Home</span>
        </a>
        <a className="d98-icon" href="Desktop.html" style={{ textDecoration: 'none' }}>
          <span className="d98-icon-imgwrap"><PixelIcon icon="folder" size={36} className="d98-icon-img" /></span>
          <span className="d98-icon-label">Work</span>
        </a>
      </div>

      <div className="vp-center" onMouseDown={(e) => e.stopPropagation()}>
        <VideosPlayer />
      </div>

      {startOpen && <StartMenu onPick={() => setStartOpen(false)} />}
      <Taskbar variant="tasks" startOpen={startOpen} tasks={tasks} activeTask="vp"
        onStart={() => setStartOpen((s) => !s)} onPick={() => setStartOpen(false)} />
    </div>
  );
}

Object.assign(window, { VideosPlayer, VideosDesktop });
