/* final-mobile.jsx — the phone / small-tablet layout for the portfolio.
   FinalFlow (final-flow.jsx) renders <MobileFlow> below 860px instead of the
   scaled desktop flow.

   Per desk: a grid of shortcut icons docked at the TOP, then the single active
   window stacked below (full-width, everything top-to-bottom), then the global
   taskbar at the bottom. The four desks are stacked with the same Bayer-dither
   dissolves and snap-scroll switching as the desktop flow (a desk taller than
   the screen scrolls internally; the dither only shows while switching).

   Reuses every desktop window component (all on window): they are dropped into
   a `.mscope` wrapper whose CSS neutralises fixed widths/heights, and the few
   side-by-side ones (Read Me, Sieur Flamme reel) get a `stack` prop. About /
   Tech Stack / Videos already reflow to a column on a narrow container.

   Work · "Professional Experience": the timeline is the base window; tapping a
   row opens that project as a smaller modal ON TOP, darkening the timeline.
   Close (× or tapping the dark area) returns to the timeline. */

/* ---------- desk shortcut docks ---------- */
const M_WORK_DOCK = [
  { id: 'readme', label: 'Read Me', img: 'assets/ic-readme.png' },
  { id: 'experience', label: 'Professional', img: 'assets/ic-briefcase.png' },
  { id: 'techstack', label: 'Tech Stack', img: 'assets/ic-toolbox.png' },
  { id: 'education', label: 'Education', img: 'assets/ic-studies.png' },
];
function mAboutDock() {
  const CI = window.CI || {};
  return [
    { id: 'about', label: 'About Me', icon: 'info', img: 'uploads/Information6.png' },
    { id: 'resume', label: 'Resume', icon: 'page', sec: 'contact' },
    { id: 'linkedin', label: 'LinkedIn', pattern: CI.badge, sec: 'contact' },
    { id: 'email', label: 'Email', img: 'uploads/Email.png', sec: 'contact' },
    { id: 'github', label: 'GitHub', pattern: CI.term, sec: 'contact' },
    { id: 'instagram', label: 'Instagram', pattern: CI.cam, sec: 'contact' },
  ];
}

function MDockIcon({ it, on, onClick }) {
  return (
    <button className={'m98-dockbtn' + (on ? ' is-on' : '')} onClick={onClick}>
      <span className="m98-dockimg">
        {it.img
          ? <img src={it.img} alt="" draggable={false} />
          : it.pattern ? <PixelIcon pattern={it.pattern} size={34} />
            : <PixelIcon icon={it.icon || 'page'} size={34} />}
        <img src="assets/ic-shortcut-arrow.png" alt="" className="m98-dockarrow" draggable={false} />
      </span>
      <span className="m98-docklbl">{it.label}</span>
    </button>
  );
}
function MobileDock({ items, activeId, onPick }) {
  return (
    <div className="m98-dock">
      {items.map((it) => <MDockIcon key={it.id} it={it} on={activeId === it.id} onClick={() => onPick(it)} />)}
    </div>
  );
}

/* ---------- dither dissolve strip (full width) ---------- */
function MobileDither({ top, bottom, img, cloud }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) window.fPaint(ref.current, window.FADE_H, window.CELL, top, bottom, img, cloud);
  }, [top, bottom, img, cloud]);
  return <canvas ref={ref} className="m98-dither" />;
}

/* ---------- one desk screen: wallpaper + docked content ---------- */
function MobileScreen({ desk, img, cloud, deskRef, children }) {
  const wp = desk.wp;
  const Shader = window.CloudShaderBG;
  const isShader = wp.type === 'shader';
  let bg;
  if (isShader) bg = { background: window.frgb(wp.fallback || [150, 196, 235]) };
  else if (wp.type === 'color') bg = wp.vignette
    ? { background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.24) 100%), ' + window.frgb(wp.color) }
    : { background: window.frgb(wp.color) };
  else if (img && img.complete && img.naturalWidth) bg = { backgroundImage: 'url(' + wp.src + ')', backgroundSize: 'cover', backgroundPosition: 'center' };
  else bg = { background: window.frgb(wp.fallback || [150, 196, 235]) };
  return (
    <section ref={deskRef} data-screen-label={desk.name} className="m98-screen" style={bg}>
      {isShader && Shader &&
        <Shader width={0} height={0} rw={360} rh={640}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />}
      <div className="m98-inner" style={isShader ? { position: 'relative', zIndex: 1 } : undefined}>{children}</div>
    </section>
  );
}

/* ---------- per-desk content ---------- */
function MWin({ children }) { return <div className="mscope m98-winwrap">{children}</div>; }

function MWelcome() {
  return <MWin><WelcomeWindow onViewWork={() => window.scrollTo({ top: 0 })} /></MWin>;
}

function MWork({ active, setActive, proj, setProj }) {
  let win = null;
  if (active === 'readme') win = <ReadmeWindow stack onClose={() => {}} />;
  else if (active === 'techstack') win = <TechStackWindow />;
  else if (active === 'education') win = <EducationTimeline onClose={() => {}} />;
  else win = <WorkTimeline selected={proj} onOpen={(id) => setProj(id)} onClose={() => {}} />;
  return (
    <React.Fragment>
      <MobileDock items={M_WORK_DOCK} activeId={active} onPick={(it) => { setActive(it.id); setProj(null); }} />
      <MWin>{win}</MWin>
      {active === 'experience' && proj && (
        <div className="m98-modal-backdrop" onClick={() => setProj(null)}>
          <div className="mscope m98-modal" onClick={(e) => e.stopPropagation()}>
            <WorkDetailPanel id={proj} onClose={() => setProj(null)} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function MPersonal({ active, setActive }) {
  const PP = window.PERSONAL_PROJECTS || {};
  const PS = window.PERSONAL_SECTIONS || [];
  const items = PS.map((s) => ({ id: s.id, label: s.label, img: s.img }));
  let win;
  if (active === 'videoplayer') win = <VideosPlayer onClose={() => {}} />;
  else if (active === 'sieurflamme') win = <ProjectReelWindow stack proj={PP[active]} onClose={() => {}} />;
  else if (PP[active]) win = <ProjectWindow stack proj={PP[active]} onClose={() => {}} onZoom={() => {}} />;
  else win = <ProjectWindow stack proj={PP.art} onClose={() => {}} onZoom={() => {}} />;
  return (
    <React.Fragment>
      <MobileDock items={items} activeId={active} onPick={(it) => setActive(it.id)} />
      <MWin>{win}</MWin>
    </React.Fragment>
  );
}

function MAbout({ active, setActive }) {
  const dock = mAboutDock();
  const win = active === 'about'
    ? <AboutWindow />
    : <ContactCard />;
  return (
    <React.Fragment>
      <MobileDock items={dock} activeId={active} onPick={(it) => setActive(it.sec ? it.id : 'about')} />
      <MWin>{win}</MWin>
    </React.Fragment>
  );
}

/* ---------- taskbar: Start + the four desks + clock (no window buttons) ---------- */
function MobileTaskbar({ current, startOpen, onStart, onNav }) {
  const F_DESKS = window.F_DESKS || [];
  const logoColors = ['#d83b3b', '#2f9b46', '#1083d4', '#e8b84a'];
  return (
    <div className="d98-taskbar m98-taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <div className={'d98-start' + (startOpen ? ' is-open' : '')} onClick={(e) => { e.stopPropagation(); onStart(); }}>
        <span className="d98-start-logo">{logoColors.map((c, i) => <span key={i} style={{ background: c }} />)}</span>
        Start
      </div>
      <span className="d98-sep" />
      <div className="d98-tasks m98-tasks">
        {F_DESKS.map((d, i) => (
          <div key={d.id} className={'d98-taskbtn m98-taskbtn' + (current === i ? ' is-active' : '')} onClick={() => onNav(i)}>
            {d.img
              ? <img src={d.img} alt="" className="ico" style={{ width: 16, height: 16 }} />
              : <PixelIcon icon={d.icon} size={16} className="ico" />}
            <span className="m98-tasklbl">{d.name}</span>
          </div>
        ))}
      </div>
      <div className="d98-tray"><ClockText /></div>
    </div>
  );
}

/* ---------- the mobile app ---------- */
function MobileFlow({ img, cloud }) {
  const F_DESKS = window.F_DESKS || [];
  const n = F_DESKS.length;
  const [current, setCurrent] = React.useState(0);
  const [startOpen, setStartOpen] = React.useState(false);
  const [active, setActive] = React.useState({ work: 'readme', personal: 'art', about: 'about' });
  const [proj, setProj] = React.useState(null); /* professional sub-modal */
  const [clappyClosed, setClappyClosed] = React.useState(() => !!window.__clappyDismissed);
  const dismissClappy = () => { window.__clappyDismissed = true; setClappyClosed(true); };
  React.useEffect(() => { if (!window.__clappyDismissed) setClappyClosed(false); }, [proj]);
  const deskRefs = React.useRef(F_DESKS.map(() => React.createRef()));
  const animatingRef = React.useRef(false);
  const goToRef = React.useRef(() => {});

  const setAct = (deskId, id) => setActive((s) => ({ ...s, [deskId]: id }));

  /* snap-scroll controller (measured from real desk offsets) */
  React.useEffect(() => {
    const clamp = (i) => Math.max(0, Math.min(n - 1, i));
    const refs = deskRefs.current;
    const topOf = (i) => (refs[i] && refs[i].current) ? refs[i].current.offsetTop : 0;
    const hOf = (i) => (refs[i] && refs[i].current) ? refs[i].current.offsetHeight : 0;
    const curIndex = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let best = 0;
      for (let i = 0; i < n; i++) if (mid >= topOf(i)) best = i;
      return clamp(best);
    };
    let animT = 0;
    const goToDesk = (i) => {
      i = clamp(i);
      animatingRef.current = true;
      clearTimeout(animT);
      window.animateScrollTo(topOf(i), 800, () => { animatingRef.current = false; });
      animT = setTimeout(() => { animatingRef.current = false; }, 1150);
    };
    goToRef.current = goToDesk;

    const store = 'final_flow_m_v1';
    try { const s = JSON.parse(localStorage.getItem(store)) || {}; if (s.scroll) window.scrollTo(0, s.scroll); } catch (e) {}

    let raf = 0, idleT = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        setCurrent(curIndex());
        try { const s = JSON.parse(localStorage.getItem(store)) || {}; s.scroll = window.scrollY; localStorage.setItem(store, JSON.stringify(s)); } catch (e) {}
      });
      clearTimeout(idleT);
      idleT = setTimeout(() => {
        if (animatingRef.current) return;
        const i = curIndex();
        if (hOf(i) > window.innerHeight + 4) return; /* tall desk: free scroll */
        const within = window.scrollY - topOf(i);
        const span = (topOf(Math.min(n - 1, i + 1)) - topOf(i)) || hOf(i) || 1;
        if (within > 6 && within < span - 6) goToDesk(within < span / 2 ? i : i + 1);
      }, 160);
    };
    const onWheel = (e) => {
      if (e.ctrlKey || animatingRef.current) { if (animatingRef.current) e.preventDefault(); return; }
      const i = curIndex();
      const vh = window.innerHeight, dH = hOf(i);
      const within = window.scrollY - topOf(i);
      const maxWithin = Math.max(0, dH - vh);
      if (dH <= vh + 4) {
        e.preventDefault();
        if (e.deltaY > 0) goToDesk(i + 1); else if (e.deltaY < 0) goToDesk(i - 1);
      } else if (e.deltaY > 0 && within >= maxWithin - 2) { e.preventDefault(); goToDesk(i + 1); }
      else if (e.deltaY < 0 && within <= 2) { e.preventDefault(); goToDesk(i - 1); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      clearTimeout(animT); clearTimeout(idleT);
    };
  }, [img, n]);

  const navDesk = (i) => { goToRef.current(i); setStartOpen(false); };

  /* Start-menu leaf -> set the desk's active window, then scroll there */
  const startPick = ({ deskIndex, deskId, secs }) => {
    if (secs) {
      if (deskId === 'work') {
        if (secs.indexOf('readme') !== -1) setAct('work', 'readme');
        else if (secs.indexOf('techstack') !== -1) setAct('work', 'techstack');
        else if (secs.indexOf('education') !== -1) setAct('work', 'education');
        else { setAct('work', 'experience'); setProj(null); }
      } else if (deskId === 'personal') setAct('personal', secs[0]);
      else if (deskId === 'about') setAct('about', 'contact');
    }
    navDesk(deskIndex);
  };

  const content = (desk) => {
    if (desk.id === 'welcome') return <MWelcome />;
    if (desk.id === 'work') return <MWork active={active.work} setActive={(id) => setAct('work', id)} proj={proj} setProj={setProj} />;
    if (desk.id === 'personal') return <MPersonal active={active.personal} setActive={(id) => setAct('personal', id)} />;
    if (desk.id === 'about') return <MAbout active={active.about} setActive={(id) => setAct('about', id)} />;
    return null;
  };

  const workIdx = F_DESKS.findIndex((d) => d.id === 'work');
  const showClappy = proj && active.work === 'experience' && current === workIdx && !clappyClosed && window.ClappyAssistant;

  return (
    <div className="m98f" onMouseDown={() => setStartOpen(false)}>
      {F_DESKS.map((desk, i) => (
        <React.Fragment key={desk.id}>
          <MobileScreen desk={desk} img={img} cloud={cloud} deskRef={deskRefs.current[i]}>
            {content(desk)}
          </MobileScreen>
          {i < n - 1 && <MobileDither top={desk.wp} bottom={F_DESKS[i + 1].wp} img={img} cloud={cloud} />}
        </React.Fragment>
      ))}

      <div className="m98-dock-bar">
        {startOpen && <FlowStartMenu onPick={startPick} />}
        <MobileTaskbar current={current} startOpen={startOpen}
          onStart={() => setStartOpen((s) => !s)} onNav={navDesk} />
      </div>
      {showClappy && <window.ClappyAssistant onClose={dismissClappy} />}
    </div>
  );
}

Object.assign(window, { MobileFlow });
