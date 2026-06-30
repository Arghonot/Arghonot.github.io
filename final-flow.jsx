/* final-flow.jsx — the FINAL site: four content desktops stacked into one
   vertical SCROLL FLOW with Bayer-dither dissolves between wallpapers, a
   single docked taskbar, and the smart task list:

     [Start] · Welcome · Work · Personal · About Me · <open windows> · [tray]

   The four section buttons are always present (the active one is the desktop
   currently in view). Any extra window open ON the current desktop adds its
   own button; closing that window (its × or the taskbar ×) removes it.

   Desk content lives in final-windows.jsx (<DeskContent>). The dither engine
   is the same one proven in scroll-flow.jsx. */

/* ---------- palette ---------- */
const F_CYAN = [22, 178, 199];
const F_TEAL = [47, 143, 136];
const F_TEAL98 = [0, 128, 128];   /* the real Win98 desktop teal #008080 */
const F_GREEN = [13, 107, 64];    /* poker-felt green #0d6b40 */
const F_SKY = [150, 196, 235];
const frgb = (c) => 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
const CLOUD = 'assets/cloud-about.jpg';

const DESK_H = 1080, DESIGN_W = 1920, FADE_H = 300, CELL = 2;

/* ---------- eased scroll lerp (shared by desktop + mobile) ----------
   A deliberate easeInOutCubic glide so the Bayer-dither dissolve between
   wallpapers is clearly visible while the flow settles into a desk. */
let SCROLL_RAF = 0;
function animateScrollTo(targetY, duration, onDone) {
  if (SCROLL_RAF) { cancelAnimationFrame(SCROLL_RAF); SCROLL_RAF = 0; }
  const startY = window.scrollY;
  const dist = Math.round(targetY) - startY;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || Math.abs(dist) < 2) { window.scrollTo(0, Math.round(targetY)); onDone && onDone(); return; }
  const dur = duration || 720;
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    window.scrollTo(0, Math.round(startY + dist * ease(p)));
    if (p < 1) SCROLL_RAF = requestAnimationFrame(step);
    else { SCROLL_RAF = 0; onDone && onDone(); }
  };
  SCROLL_RAF = requestAnimationFrame(step);
}

const F_DESKS = [
  { id: 'welcome', name: 'Welcome', icon: 'monitor', img: 'uploads/WelcomeDoor.png', wp: { type: 'color', color: F_TEAL98 } },
  { id: 'work', name: 'Professional', icon: 'folder', img: 'uploads/Work.png', wp: { type: 'color', color: F_TEAL } },
  { id: 'personal', name: 'Personal', icon: 'reel', img: 'uploads/SideProjectsPixelated.png', wp: { type: 'color', color: F_GREEN, vignette: true } },
  { id: 'about', name: 'About Me', icon: 'info', img: 'uploads/Information6.png', wp: { type: 'shader', fallback: F_SKY } },
];

/* secondary windows open by default on each desk */
const INITIAL_SECS = { welcome: [], work: ['readme'], personal: ['art'], about: ['contact'] };

/* ---------- Bayer 8x8 ordered-dither matrix ---------- */
const FBAYER = function makeBayer(n) {
  let m = [[0]];
  for (let s = 1; s < n; s *= 2) {
    const nm = [];
    for (let y = 0; y < s * 2; y++) {
      nm[y] = [];
      for (let x = 0; x < s * 2; x++) {
        const q = y < s ? (x < s ? 0 : 2) : (x < s ? 3 : 1);
        nm[y][x] = 4 * m[y % s][x % s] + q;
      }
    }
    m = nm;
  }
  return m;
}(8);

function fCoverRect(iw, ih, TW, TH) {
  const s = Math.max(TW / iw, TH / ih);
  const dW = iw * s, dH = ih * s;
  return { dW, dH, dx: (TW - dW) / 2, dy: (TH - dH) / 2 };
}

function fSampler(wp, role, W, H, fadeH, cell, img, cloud) {
  if (wp.type === 'color') return { flat: wp.color };
  /* shader desks dissolve into a baked frame of the live cloud wallpaper */
  const src = wp.type === 'shader' ? cloud : img;
  const iw = src && (src.naturalWidth || src.width);
  const ih = src && (src.naturalHeight || src.height);
  if (!src || !iw) return { flat: wp.fallback || F_SKY };
  const t = document.createElement('canvas');
  t.width = W; t.height = H;
  const tx = t.getContext('2d');
  const { dW, dH, dx, dy } = fCoverRect(iw, ih, DESIGN_W, fadeH + DESK_H);
  const yoff = role === 'top' ? -DESK_H : 0;
  tx.imageSmoothingEnabled = true;
  tx.drawImage(src, dx / cell, (dy + yoff) / cell, dW / cell, dH / cell);
  return { data: tx.getImageData(0, 0, W, H).data };
}

function fPaint(canvas, fadeH, cell, top, bottom, img, cloud, revealBottomShader) {
  const W = Math.max(1, Math.round(DESIGN_W / cell));
  const H = Math.max(1, Math.round(fadeH / cell));
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  /* when the bottom desk is the live cloud shader, dissolve the TOP wallpaper
     into TRANSPARENCY instead of a baked snapshot — so the live shader layer
     behind the strip shows straight through and there is no seam. */
  const botShader = !!revealBottomShader && bottom.type === 'shader';
  const sTop = fSampler(top, 'top', W, H, fadeH, cell, img, cloud);
  const sBot = botShader ? null : fSampler(bottom, 'bottom', W, H, fadeH, cell, img, cloud);
  const im = ctx.createImageData(W, H);
  const d = im.data;
  const put = (i, src, j) => {
    if (src.flat) { d[i] = src.flat[0]; d[i + 1] = src.flat[1]; d[i + 2] = src.flat[2]; }
    else { d[i] = src.data[j]; d[i + 1] = src.data[j + 1]; d[i + 2] = src.data[j + 2]; }
    d[i + 3] = 255;
  };
  for (let y = 0; y < H; y++) {
    const ty = (y + 0.5) / H;
    for (let x = 0; x < W; x++) {
      const thr = (FBAYER[y & 7][x & 7] + 0.5) / 64;
      const i = (y * W + x) * 4;
      if (ty > thr) { if (botShader) { d[i + 3] = 0; } else { put(i, sBot, i); } }
      else { put(i, sTop, i); }
    }
  }
  ctx.putImageData(im, 0, 0);
}

function FTransition({ top, bottom, img, cloud }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) fPaint(ref.current, FADE_H, CELL, top, bottom, img, cloud, true); }, [top, bottom, img, cloud]);
  /* +2px tall with -1px margins top & bottom: bleeds 1px into each neighbour to
     hide the sub-pixel hairline seam left by the fractional page scale, while
     keeping the net flow height exactly FADE_H. */
  return <canvas ref={ref} style={{ display: 'block', width: DESIGN_W, height: FADE_H + 2, marginTop: -1, marginBottom: -1, imageRendering: 'pixelated' }} />;
}

/* ---------- one desktop: wallpaper + content ---------- */
function FDesk({ desk, img, cloud, deskRef, children }) {
  const wp = desk.wp;
  if (wp.type === 'shader') {
    /* the live cloud shader is drawn once as a tall layer behind this desk +
       the strip above it (see DesktopFlow); the desk itself is transparent so
       that single continuous layer shows through with no seam. */
    return (
      <div ref={deskRef} data-screen-label={desk.name}
        style={{ position: 'relative', width: DESIGN_W, height: DESK_H, overflow: 'hidden', background: 'transparent' }}>
        {children}
      </div>
    );
  }
  let bg = {};
  if (wp.type === 'color') {
    bg = wp.vignette
      ? { background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.24) 100%), ' + frgb(wp.color) }
      : { background: frgb(wp.color) };
  } else if (img && img.complete && img.naturalWidth) {
    const { dW, dH, dx, dy } = fCoverRect(img.naturalWidth, img.naturalHeight, DESIGN_W, FADE_H + DESK_H);
    bg = { backgroundImage: 'url(' + wp.src + ')', backgroundRepeat: 'no-repeat',
      backgroundSize: dW + 'px ' + dH + 'px', backgroundPosition: dx + 'px ' + (dy - FADE_H) + 'px' };
  } else {
    bg = { background: frgb(wp.fallback || F_SKY) };
  }
  return (
    <div ref={deskRef} data-screen-label={desk.name}
      style={Object.assign({ position: 'relative', width: DESIGN_W, height: DESK_H, overflow: 'hidden' }, bg)}>
      {desk.id === 'welcome' && window.WelcomeMelt && <window.WelcomeMelt />}
      {children}
    </div>
  );
}

/* ---------- smart taskbar ---------- */
function secMeta(id) {
  const { CI, SP, WORK_ITEMS, PERSONAL_SECTIONS } = window;
  if (id === 'professional') return { img: 'assets/ic-briefcase.png', title: 'Professional Experience' };
  if (id === 'readme') return { img: 'assets/ic-readme.png', title: 'Read Me' };
  if (id === 'techstack') return { img: 'assets/ic-toolbox.png', title: 'Tech Stack' };
  if (id === 'education') return { img: 'assets/ic-studies.png', title: 'Education' };
  const ps = (PERSONAL_SECTIONS || []).find((s) => s.id === id);
  if (ps) return { img: ps.img, title: ps.label };
  if (id === 'animotive') return { icon: 'reel', title: 'Animotive' };
  if (id === 'contact') return { img: 'uploads/Email.png', title: 'Contact' };
  const w = (WORK_ITEMS || []).find((x) => x.id === id);
  if (w) return { icon: w.icon, title: w.name };
  const p = (SP || []).find((x) => x.id === id);
  if (p) return { icon: p.icon, title: p.name };
  return { icon: 'page', title: id };
}

function TaskButton({ active, icon, pattern, img, title, onClick, onClose }) {
  return (
    <div className={'d98-taskbtn' + (active ? ' is-active' : '')} onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: 168 }}>
      {img
        ? <img src={img} alt="" className="ico" style={{ width: 16, height: 16 }} />
        : pattern ? <PixelIcon pattern={pattern} size={16} className="ico" /> : <PixelIcon icon={icon} size={16} className="ico" />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    </div>
  );
}

/* ---------- cascading Start menu: the whole site architecture ----------
   Top level = the four desks. Work / Personal / About fly out a submenu of
   the windows that live on that desk. Clicking a leaf scrolls to the desk
   AND opens that window; clicking a parent just scrolls to the desk. */
function buildFlowMenu() {
  const PS = window.PERSONAL_SECTIONS || [];
  const CI = window.CI || {};
  return [
    { key: 'welcome', icon: 'monitor', img: 'uploads/WelcomeDoor.png', label: 'Welcome', deskIndex: 0, deskId: 'welcome' },
    { key: 'work', icon: 'folder', img: 'uploads/Work.png', label: 'Professional', deskIndex: 1, deskId: 'work', children: [
      { img: 'assets/ic-readme.png', label: 'Read Me', secs: ['readme'] },
      { img: 'assets/ic-briefcase.png', label: 'Professional Experience', secs: ['professional'] },
      { img: 'assets/ic-toolbox.png', label: 'Tech Stack', secs: ['techstack'] },
      { img: 'assets/ic-studies.png', label: 'Education', secs: ['education'] },
    ] },
    { key: 'personal', icon: 'reel', img: 'uploads/SideProjectsPixelated.png', label: 'Personal', deskIndex: 2, deskId: 'personal',
      children: PS.map((s) => ({ img: s.img, label: s.label, secs: [s.id] })) },
    { key: 'about', icon: 'info', img: 'uploads/Information6.png', label: 'About', deskIndex: 3, deskId: 'about', children: [
      { icon: 'page', label: 'Resume', secs: ['contact'] },
      { pattern: CI.badge, label: 'LinkedIn', secs: ['contact'] },
      { img: 'uploads/Email.png', label: 'Email', secs: ['contact'] },
      { pattern: CI.term, label: 'GitHub', secs: ['contact'] },
      { pattern: CI.cam, label: 'Instagram', secs: ['contact'] },
    ] },
  ];
}

function SubIcon({ c, size }) {
  if (c.img) return <img src={c.img} alt="" className="ico" style={{ width: size, height: size }} />;
  if (c.pattern) return <PixelIcon pattern={c.pattern} size={size} className="ico" />;
  return <PixelIcon icon={c.icon || 'page'} size={size} className="ico" />;
}

function FlowStartMenu({ onPick }) {
  const items = buildFlowMenu();
  const [open, setOpen] = React.useState(null);
  return (
    <div className="d98-startmenu fsm" onMouseDown={(e) => e.stopPropagation()} onMouseLeave={() => setOpen(null)}>
      <div className="d98-sm-side"><b>LoickRivemale<i>95</i></b></div>
      <div className="fsm-list">
        {items.map((it) => {
          const hasSub = it.children && it.children.length > 0;
          return (
            <div key={it.key} className="fsm-item-wrap" onMouseEnter={() => setOpen(hasSub ? it.key : null)}>
              <div className={'fsm-item' + (hasSub ? ' has-sub' : '') + (open === it.key ? ' is-open' : '')}
                onClick={() => onPick({ deskIndex: it.deskIndex, deskId: it.deskId })}>
                {it.img
                  ? <img src={it.img} alt="" className="ico" style={{ width: 24, height: 24 }} />
                  : <PixelIcon icon={it.icon} size={24} className="ico" />}
                <span className="lbl">{it.label}</span>
              </div>
              {hasSub && open === it.key && (
                <div className="fsm-sub">
                  {it.children.map((c, ci) => (
                    <div key={ci} className="fsm-subitem"
                      onClick={(e) => { e.stopPropagation(); onPick({ deskIndex: it.deskIndex, deskId: it.deskId, secs: c.secs }); }}>
                      <SubIcon c={c} size={20} />
                      <span className="lbl">{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="d98-sm-divider" />
        <div className="fsm-item-wrap" onMouseEnter={() => setOpen(null)}>
          <div className="fsm-item" onClick={() => onPick({ deskIndex: 0, deskId: 'welcome' })}>
            <img src="uploads/Shutdown.png" alt="" className="ico" style={{ width: 24, height: 24 }} />
            <span className="lbl">Shut Down{'\u2026'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowTaskbar({ current, secs, startOpen, onStart, onNav, onCloseSec }) {
  const logoColors = ['#d83b3b', '#2f9b46', '#1083d4', '#e8b84a'];
  return (
    <div className="d98-taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <div className={'d98-start' + (startOpen ? ' is-open' : '')} onClick={(e) => { e.stopPropagation(); onStart(); }}>
        <span className="d98-start-logo">{logoColors.map((c, i) => <span key={i} style={{ background: c }} />)}</span>
        Start
      </div>
      <span className="d98-sep" />
      <div className="d98-tasks">
        {F_DESKS.map((d, i) => (
          <TaskButton key={d.id} active={current === i} icon={d.icon} img={d.img} title={d.name} onClick={() => onNav(i)} />
        ))}
        {secs.length > 0 && <span className="d98-sep" />}
        {secs.map((id) => {
          const m = secMeta(id);
          return <TaskButton key={id} active icon={m.icon} pattern={m.pattern} img={m.img} title={m.title} onClick={() => {}} onClose={() => onCloseSec(id)} />;
        })}
      </div>
      <div className="d98-tray"><Speaker /><ClockText /></div>
    </div>
  );
}

/* ---------- app (desktop / scaled-flow path) ---------- */
function DesktopFlow({ img, cloud }) {
  const [scale, setScale] = React.useState(1);
  const [current, setCurrent] = React.useState(0);
  const [startOpen, setStartOpen] = React.useState(false);
  const [clappyClosed, setClappyClosed] = React.useState(() => !!window.__clappyDismissed);
  const dismissClappy = () => { window.__clappyDismissed = true; setClappyClosed(true); };
  const [openSecs, setOpenSecs] = React.useState(() => {
    const s = {}; F_DESKS.forEach((d) => { s[d.id] = (INITIAL_SECS[d.id] || []).slice(); }); return s;
  });
  const deskRefs = React.useRef(F_DESKS.map(() => React.createRef()));
  const animatingRef = React.useRef(false);
  const goToRef = React.useRef(() => {});

  /* responsive: scale fixed-width flow to viewport width (fill) */
  React.useEffect(() => {
    const fit = () => setScale((document.documentElement.clientWidth || window.innerWidth) / DESIGN_W);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  /* scroll-snap controller: the wheel switches between desks (the dither
     dissolve plays during the smooth scroll). A desk taller than the
     viewport scrolls internally and only snaps at its top/bottom edges.
     Touch scrolling settles onto a desk once it stops. */
  React.useEffect(() => {
    const n = F_DESKS.length;
    const clamp = (i) => Math.max(0, Math.min(n - 1, i));
    const unit = () => (DESK_H + FADE_H) * scale;
    const deskH = () => DESK_H * scale;
    const curIndex = () => clamp(Math.floor((window.scrollY + 2) / unit()));
    let animT = 0;
    const goToDesk = (i) => {
      i = clamp(i);
      animatingRef.current = true;
      clearTimeout(animT);
      animateScrollTo(i * unit(), 760, () => { animatingRef.current = false; });
      animT = setTimeout(() => { animatingRef.current = false; }, 1100);
    };
    goToRef.current = goToDesk;

    const onWheel = (e) => {
      if (e.ctrlKey) return; /* leave pinch-zoom alone */
      if (animatingRef.current) { e.preventDefault(); return; }
      const u = unit(), dH = deskH(), vh = window.innerHeight;
      const i = curIndex();
      const within = window.scrollY - i * u;
      const maxWithin = Math.max(0, dH - vh);
      const fits = dH <= vh + 4;
      if (fits) {
        e.preventDefault();
        if (e.deltaY > 0) goToDesk(i + 1);
        else if (e.deltaY < 0) goToDesk(i - 1);
      } else {
        if (e.deltaY > 0 && within >= maxWithin - 2) { e.preventDefault(); goToDesk(i + 1); }
        else if (e.deltaY < 0 && within <= 2) { e.preventDefault(); goToDesk(i - 1); }
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    let idleT = 0;
    const onScrollIdle = () => {
      clearTimeout(idleT);
      idleT = setTimeout(() => {
        if (animatingRef.current) return;
        const u = unit(), dH = deskH(), vh = window.innerHeight;
        if (dH > vh + 4) return; /* tall desk scrolls freely */
        const i = curIndex();
        const within = window.scrollY - i * u;
        if (within > 4 && within < u - 4) goToDesk(within < u / 2 ? i : i + 1);
      }, 150);
    };
    window.addEventListener('scroll', onScrollIdle, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScrollIdle);
      clearTimeout(animT); clearTimeout(idleT);
    };
  }, [scale]);

  /* which desk is in view + persist scroll */
  React.useEffect(() => {
    const store = 'final_flow_v1';
    try { const s = JSON.parse(localStorage.getItem(store)) || {}; if (s.scroll) window.scrollTo(0, s.scroll); } catch (e) {}
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.innerHeight / 2;
        let best = 0, bestD = Infinity;
        deskRefs.current.forEach((r, i) => {
          if (!r.current) return;
          const b = r.current.getBoundingClientRect();
          const c = b.top + b.height / 2;
          const dist = Math.abs(c - mid);
          if (dist < bestD) { bestD = dist; best = i; }
        });
        setCurrent(best);
        try { const s = JSON.parse(localStorage.getItem(store)) || {}; s.scroll = window.scrollY; localStorage.setItem(store, JSON.stringify(s)); } catch (e) {}
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToDesk = (i) => { goToRef.current(i); setStartOpen(false); };
  const closeSec = (deskId, id) => setOpenSecs((s) => {
    /* closing the Professional timeline also dismisses its child detail modal */
    if (deskId === 'work' && id === 'professional') return { ...s, work: [] };
    return { ...s, [deskId]: s[deskId].filter((x) => x !== id) };
  });
  const openSec = (deskId, id) => setOpenSecs((s) => (s[deskId].indexOf(id) !== -1 ? s : { ...s, [deskId]: [...s[deskId], id] }));
  const setSecs = (deskId, ids) => setOpenSecs((s) => ({ ...s, [deskId]: ids }));

  const totalH = DESK_H * F_DESKS.length + FADE_H * (F_DESKS.length - 1);
  const startPick = ({ deskIndex, deskId, secs }) => {
    if (secs) setSecs(deskId, secs);
    scrollToDesk(deskIndex);
  };

  const NONPROJ_W = ['professional', 'techstack', 'education', 'readme'];
  const clappyProj = (openSecs.work || []).indexOf('professional') !== -1
    ? (openSecs.work || []).find((s) => NONPROJ_W.indexOf(s) === -1) || null
    : null;
  React.useEffect(() => { if (!window.__clappyDismissed) setClappyClosed(false); }, [clappyProj]);
  const workIdx = F_DESKS.findIndex((d) => d.id === 'work');
  const showClappy = clappyProj && current === workIdx && !clappyClosed && window.ClappyAssistant;

  return (
    <React.Fragment>
      <div onMouseDown={() => setStartOpen(false)}
        style={{ position: 'relative', width: DESIGN_W * scale, height: totalH * scale, margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: DESIGN_W, transform: 'scale(' + scale + ')', transformOrigin: 'top left' }}>
          {(() => {
            /* one continuous live cloud layer spanning the strip above the
               shader desk + the desk itself, sitting BEHIND the in-flow desks
               (z-index:-1). The personal->about strip dissolves to transparency
               so this single layer reads through with no seam. */
            const si = F_DESKS.findIndex((d) => d.wp.type === 'shader');
            if (si < 1) return null;
            const layerTop = si * DESK_H + (si - 1) * FADE_H;
            const layerH = FADE_H + DESK_H;
            const Shader = window.CloudShaderBG;
            return (
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: layerTop, width: DESIGN_W, height: layerH,
                zIndex: -1, overflow: 'hidden', background: frgb(F_DESKS[si].wp.fallback || F_SKY) }}>
                {Shader && <Shader width={DESIGN_W} height={layerH} rw={760} rh={Math.round(760 * layerH / DESIGN_W)}
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}
              </div>
            );
          })()}
          {F_DESKS.map((desk, i) => (
            <React.Fragment key={desk.id}>
              <FDesk desk={desk} img={img} cloud={cloud} deskRef={deskRefs.current[i]}>
                <DeskContent desk={desk} secs={openSecs[desk.id]}
                  open={(id) => openSec(desk.id, id)} close={(id) => closeSec(desk.id, id)}
                  setSecs={setSecs} onViewWork={() => scrollToDesk(1)} scale={scale} />
              </FDesk>
              {i < F_DESKS.length - 1 && <FTransition top={desk.wp} bottom={F_DESKS[i + 1].wp} img={img} cloud={cloud} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 30, zIndex: 9500 }}>
        {startOpen && <FlowStartMenu onPick={startPick} />}
        <FlowTaskbar current={current} secs={openSecs[F_DESKS[current].id] || []}
          startOpen={startOpen} onStart={() => setStartOpen((s) => !s)}
          onNav={scrollToDesk} onCloseSec={(id) => closeSec(F_DESKS[current].id, id)} />
      </div>
      {window.PipesScreensaver && <window.PipesScreensaver />}
      {showClappy && <window.ClappyAssistant onClose={dismissClappy} />}
    </React.Fragment>
  );
}

/* ---------- responsive switch: phone/small-tablet -> MobileFlow ---------- */
function useIsMobile(bp) {
  const q = '(max-width: ' + bp + 'px)';
  const [m, setM] = React.useState(() => (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia(q).matches : false);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    h();
    mq.addEventListener ? mq.addEventListener('change', h) : mq.addListener(h);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', h) : mq.removeListener(h); };
  }, [q]);
  return m;
}

function FinalFlow() {
  const [img, setImg] = React.useState(null);
  React.useEffect(() => { const im = new Image(); im.onload = () => setImg(im); im.src = CLOUD; }, []);
  const [cloud, setCloud] = React.useState(null);
  React.useEffect(() => { if (window.renderCloudSnapshot) setCloud(window.renderCloudSnapshot()); }, []);
  const isMobile = useIsMobile(860);
  const Mobile = window.MobileFlow;
  return isMobile && Mobile ? <Mobile img={img} cloud={cloud} /> : <DesktopFlow img={img} cloud={cloud} />;
}

Object.assign(window, {
  FinalFlow, DesktopFlow, FlowStartMenu, TaskButton, FTransition, fPaint, FDesk, animateScrollTo,
  F_DESKS, INITIAL_SECS, DESK_H, DESIGN_W, FADE_H, CELL, frgb, fCoverRect, CLOUD,
});
