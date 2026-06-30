/* work-final.jsx — the reworked WORK desktop: a Professional timeline that
   shows project OWNERSHIP (Dragonfly owns S3 / Space Simulation / PLA), and a
   docked detail panel that opens on the RIGHT when a row is clicked (NO modal
   overlay over the timeline). The list scrolls if it overflows.

   Reuses: pixel-icons (PixelIcon) · project-image-approaches (Shot) ·
   animotive.jsx (AM, MediaPlayer, WorkList, TechChips, AmMenuBar) ·
   final-windows.jsx (FlowWindow). Exports WorkTimeline, WorkDetailPanel,
   WORK_ITEMS. */

const DF_GREEN = '#2f9b46';      /* Dragonfly ownership colour */
const DF_HUE = 152;
const SEL_PIN = '#1565d8';        /* selected row's spine pin turns blue */

/* per-owner colour systems — Airbus (cyan) · Retinize (green) · Freelance (purple) */
const OWNERS = {
  dragonfly: { color: '#2cb2d3', label: 'Airbus',
    cardBorder: '#c4e6ee', cardBg: '#eef8fb', chipBg: '#dff1f6', chipBorder: '#9bd5e3', chipText: '#1a7d96' },
  animotive: { color: '#8ec582', label: 'Retinize',
    cardBorder: '#d3e6cc', cardBg: '#f1f7ee', chipBg: '#e6f1e0', chipBorder: '#b3d2a6', chipText: '#4a7a38' },
  freelance: { color: '#7B00F5', label: 'Freelance',
    cardBorder: '#ddc9f7', cardBg: '#f4eefd', chipBg: '#ece0fb', chipBorder: '#c9a9ef', chipText: '#6306c2' },
  epitech: { color: '#1083d4', label: 'Epitech',
    cardBorder: '#c9dcf3', cardBg: '#eef4fc', chipBg: '#e3eefb', chipBorder: '#a9caef', chipText: '#1763b8' },
};
const ownerOf = (p) => p.owner ? OWNERS[p.id] : (p.depth === 1 && p.parent ? OWNERS[p.parent] : null);

const WORK_ITEMS = [
  { id: 'freelance', name: 'Freelance AR/XR', s: '2025', e: 'now', dur: '1 yr +', icon: 'picture', hue: 206, depth: 0, owner: true,
    role: 'Freelance \u00b7 confidential client',
    desc: 'Confidential Unity AR/XR build \u2014 immersive media playback, custom rendering, mobile performance.',
    full: 'A confidential Unity AR/XR project built for a private client, focused on immersive media playback, custom rendering, mobile performance, and production-ready delivery.',
    tech: ['Unity', 'AR/XR', 'Mobile', 'Rendering'] },
  { id: 'arapp', name: 'AR Application Development', s: '2025', e: 'now', dur: '1 yr +', icon: 'gizmo', hue: 280, depth: 1, parent: 'freelance',
    role: 'Freelance \u00b7 confidential client',
    desc: 'End-to-end AR application development on Unity for mobile devices.',
    full: 'End-to-end development of an AR application on Unity \u2014 markerless tracking, immersive media playback, and mobile-grade performance tuning.',
    tech: ['Unity', 'AR', 'Mobile'] },
  { id: 'decoder', name: 'In-House 8K Video Decoder', s: '2025', e: 'now', dur: '1 yr +', icon: 'monitor', hue: 280, depth: 1, parent: 'freelance',
    role: 'Freelance \u00b7 confidential client',
    desc: 'Custom in-house 8K video decoder for real-time immersive playback.',
    full: 'Built a custom in-house 8K video decoder for real-time immersive playback \u2014 GPU-accelerated frame delivery feeding the AR rendering pipeline without third-party dependencies.',
    tech: ['C++', 'GPU', 'Video'] },
  { id: 'animotive', name: 'Animotive', s: '2022', e: '2025', dur: '3 yrs', icon: 'reel', hue: 286, depth: 0,
    role: 'Remote development \u00b7 Retinize',
    desc: 'GPU-based interaction systems, custom VR shaders, desktop adaptation, VR UI rendering R&D.',
    full: 'I worked on Animotive, a VR-based movie production tool that lets users animate 3D characters and create scenes in real time. I first contributed as an in-house Unity developer at Retinize, then continued working on the project remotely after moving abroad.',
    tech: ['Unity', 'HLSL', 'VR', 'GPU'], owner: true },
  { id: 'colliderraycast', name: 'Collider-less Raycast', s: '2024', e: '2025', dur: '9 mo', icon: 'gizmo', hue: 6, depth: 1, parent: 'animotive',
    role: 'R&D \u00b7 Animotive / Retinize',
    desc: 'A raycast that resolves submesh hits without needing any collider.',
    full: 'Developed a raycast which doesn\u2019t need a collider for submesh detection \u2014 resolving the exact submesh hit directly, without the cost and setup overhead of per-mesh colliders.',
    tech: ['Unity', 'C#', 'Geometry', 'Raycasting'] },
  { id: 'vrui', name: 'VR UI Toolkit', s: '2023', e: '2025', dur: '2 yrs', icon: 'monitor', hue: 350, depth: 1, parent: 'animotive',
    role: 'Toolkit author \u00b7 Animotive / Retinize',
    desc: 'A full UI toolkit built and maintained for VR inside Animotive.',
    full: 'Developed and maintained a full UI toolkit targeting VR \u2014 the components, layout, and interaction patterns the rest of the team built Animotive\u2019s in-headset interface on top of.',
    tech: ['Unity', 'C#', 'VR', 'UI'] },
  { id: 'networking', name: 'Networking', s: '2023', e: '2024', dur: '8 mo', icon: 'chip', hue: 18, depth: 1, parent: 'animotive',
    role: 'Feature developer \u00b7 Animotive / Retinize',
    desc: 'Network features developed and integrated into Animotive.',
    full: 'Developed network features integrated in Animotive \u2014 the systems that let users connect and work together inside the tool.',
    tech: ['Unity', 'C#', 'Networking'] },
  { id: 'fullbody', name: 'Full Body Tracking', s: '2022', e: '2023', dur: '7 mo', icon: 'picture', hue: 340, depth: 1, parent: 'animotive',
    role: 'Integration & evaluation \u00b7 Animotive / Retinize',
    desc: 'Evaluated and integrated several mocap solutions for full-body capture.',
    full: 'Integrated or evaluated several mocap solutions for Animotive \u2014 comparing hardware and middleware, and wiring the chosen pipelines into the tool for full-body performance capture.',
    tech: ['Unity', 'C#', 'Mocap', 'VR'] },
  { id: 'dragonfly', name: 'Dragonfly', s: '2020', e: '2022', dur: '2 yrs', icon: 'dragonfly', hue: DF_HUE, depth: 0, owner: true,
    role: 'Feature developer & integration lead \u00b7 Airbus Defence and Space',
    desc: 'Airbus DS official Unity Desktop/VR visualizer \u2014 tools, gizmos, API integrations.',
    full: 'Contributed to Airbus Defence & Space\u2019s official Unity-based Desktop/VR visualizer as a feature developer and integration lead, building tools, gizmos, and API integrations. Three projects below were built on top of Dragonfly.',
    tech: ['Unity', 'Desktop/VR', 'Tooling', 'APIs'] },
  { id: 's3', name: 'S\u00b3', s: '2019', e: '2020', dur: '1 yr', icon: 'gizmo', hue: 38, depth: 1, parent: 'dragonfly',
    role: 'Module developer \u00b7 Airbus Defence and Space',
    desc: 'Satellite accommodation pre-design \u2014 networking, procedural meshes, CAD-style snapping.',
    full: 'S\u00b3 is a satellite accommodation pre-design tool. I developed modules enabling another team to use Dragonfly as their visualizer: networking features, procedural mesh generation, object snapping, and advanced CAD-style interaction tools.',
    tech: ['Unity', 'Networking', 'Procedural mesh', 'CAD tools'] },
  { id: 'spacesim', name: 'Space Simulation', s: '2018', e: '2019', dur: '8 mo', icon: 'monitor', hue: 228, depth: 1, parent: 'dragonfly',
    role: 'Simulation developer \u00b7 Airbus Defence and Space',
    desc: 'Real-time solar system simulation for satellite missions \u2014 Desktop and VR.',
    full: 'Built a real-time solar system simulation to visualize satellite missions in Desktop and VR, running on top of the Dragonfly visualizer.',
    tech: ['Unity', 'C#', 'VR'] },
  { id: 'pla', name: 'PLA Power Banks', s: '2017', e: '2017', dur: '3 mo', icon: 'folder', hue: 16, depth: 1, parent: 'dragonfly',
    role: 'VR validation \u00b7 Airbus Defence and Space',
    desc: 'VR facility-layout validation for a manufacturing team.',
    full: 'Helped a manufacturing team validate facility layout in VR, built on top of the Dragonfly visualizer.',
    tech: ['Unity', 'VR'] },
  { id: 'autostereo', name: 'Autostereoscopic Engine', s: '2016', e: '2017', dur: '1 yr', icon: 'page', hue: 322, depth: 0,
    role: 'Internal R&D',
    desc: 'Internal rendering tools and early-stage display-technology prototypes.',
    full: 'Worked on internal rendering tools and early-stage display-technology prototypes \u2014 glasses-free 3D and multi-view rendering research.',
    tech: ['C++', 'Rendering', 'Displays'] },
];

/* ownership groups for the green connector */
const WORK_GROUPS = [
  { parent: 'freelance', kids: ['arapp', 'decoder'] },
  { parent: 'animotive', kids: ['colliderraycast', 'vrui', 'networking', 'fullbody'] },
  { parent: 'dragonfly', kids: ['s3', 'spacesim', 'pla'] },
];

/* ---- education timeline (same row style, no ownership nesting) ---- */
const EDU_ITEMS = [
  { id: 'epitech', name: 'Epitech', s: '2013', e: '2018', dur: '5 yrs', icon: 'cap', hue: 206, depth: 0, owner: true,
    desc: "Master's degree in Software Engineering \u2014 Epitech, France." },
  { id: 'bjtu', name: 'Beijing Jiaotong University', s: '2016', e: '2017', dur: '1 yr', icon: 'book', hue: 16, depth: 1, parent: 'epitech',
    desc: 'Computer Science \u2014 exchange year in Beijing, China.' },
  { id: 'lycee', name: 'Saint-Joseph High School', s: '2010', e: '2013', dur: '3 yrs', icon: 'chip', hue: 152, depth: 0,
    desc: 'Baccalaur\u00e9at STI2D \u2014 Rodez, France.' },
];

const GUT = 52, SPINE = 46, CX = 23, INDENT = 22, NODE_TOP = 38;
const triArrow = (c) => ({ width: 0, height: 0, borderLeft: '8px solid ' + c, borderTop: '5px solid transparent', borderBottom: '5px solid transparent' });

/* ---- ownership chip (Dragonfly / Animotive) ---- */
function OwnerChip({ on, owner }) {
  const o = owner || OWNERS.dragonfly;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '1px 7px 1px 6px',
      background: on ? 'rgba(255,255,255,.16)' : o.chipBg, border: '1px solid ' + (on ? 'rgba(255,255,255,.4)' : o.chipBorder),
      color: on ? '#fff' : o.chipText, fontSize: 10.5, fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap', borderRadius: 2 }}>
      <span style={{ width: 6, height: 6, background: on ? '#fff' : o.color, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.2)' }} />
      {o.label}
    </span>
  );
}

/* ---- one timeline row ---- */
function WorkRow({ p, selected, hov, onSel, onHov, nodeRef, last, hideArrow }) {
  const on = selected;
  const child = p.depth === 1;
  const own = ownerOf(p);
  const oc = own ? own.color : null;
  const nodeColor = on ? SEL_PIN : (oc || '#c0c0c0');
  return (
    <button onClick={() => onSel(p.id)} onMouseEnter={() => onHov(p.id)} onMouseLeave={() => onHov((h) => h === p.id ? null : h)}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'stretch', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
      {/* date gutter */}
      <span style={{ width: GUT, flex: '0 0 auto', textAlign: 'right', paddingRight: 9, paddingTop: NODE_TOP - 7, lineHeight: 1.05 }}>
        <span style={{ display: 'block', fontSize: 12, fontFamily: '"Courier New", monospace', fontWeight: 700, color: 'var(--w98-text)' }}>{p.s}</span>
        <span style={{ display: 'block', fontSize: 10, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{p.e}</span>
      </span>
      {/* spine node */}
      <span style={{ width: SPINE, flex: '0 0 auto', position: 'relative' }}>
        <span ref={nodeRef} style={{ position: 'absolute', top: NODE_TOP, left: CX + (child ? INDENT : 0), transform: 'translate(-50%,-50%)',
          width: 11, height: 11, background: nodeColor, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.55), inset 1px 1px 0 rgba(255,255,255,.85)', zIndex: 2 }} />
      </span>
      {/* card */}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'flex-start',
        margin: '3px 12px 3px ' + (child ? 14 : 0) + 'px', padding: '11px 12px',
        border: on ? '1px solid #00004d' : (child ? '1px solid ' + own.cardBorder : '1px solid transparent'),
        background: on ? 'var(--w98-navy)' : (hov ? '#eef2f7' : (child ? own.cardBg : 'transparent')),
        color: on ? '#fff' : 'var(--w98-text)' }}>
        {/* thumbnail */}
        <span className="w98-sunken" style={{ display: 'block', flex: '0 0 auto', padding: 2, background: '#000', width: child ? 72 : 112 }}>
          <Shot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <PixelIcon icon={p.icon} size={child ? 20 : 28} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
            </span>
          </Shot>
        </span>
        {/* text */}
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: child ? 3 : 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: child ? 7 : 9, flexWrap: 'wrap' }}>
            {p.owner && <span style={{ width: child ? 7 : 8, height: child ? 7 : 8, background: on ? '#fff' : oc, flex: '0 0 auto' }} />}
            <span style={{ fontSize: child ? 13 : 16, fontWeight: 700, lineHeight: 1.08 }}>{p.name}</span>
            {child && <OwnerChip on={on} owner={own} />}
          </span>
          <span style={{ fontSize: child ? 11 : 12, lineHeight: 1.4, opacity: on ? .96 : .82, textWrap: 'pretty',
            display: '-webkit-box', WebkitLineClamp: child ? 1 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</span>
        </span>
        {/* duration + arrow */}
        <span style={{ flex: '0 0 auto', alignSelf: 'center', width: 52, textAlign: 'right', fontSize: child ? 11 : 12, fontFamily: '"Courier New", monospace', fontWeight: 700, opacity: on ? 1 : .8 }}>{p.dur}</span>
        {!hideArrow && (
          <span style={{ flex: '0 0 auto', alignSelf: 'center', width: 12, display: 'grid', placeItems: 'center' }}>
            <span style={triArrow(on ? '#fff' : '#1d1d1d')} />
          </span>
        )}
      </span>
    </button>
  );
}

/* ---- the timeline window (left, scrollable) ---- */
function TimelineWindow({ icon = 'folder', img, title, width = 788, items, groups = [], selected, onOpen, subtitle, statusRight, onClose, hideArrow }) {
  const [hov, setHov] = React.useState(null);
  const wrapRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const [paths, setPaths] = React.useState([]);

  React.useLayoutEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current; if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      /* the whole flow is rendered inside a transform: scale() wrapper, so
         getBoundingClientRect() returns scaled pixels. The SVG path below lives
         inside that same scaled container and uses UNSCALED design pixels, so we
         divide measured coords by the live scale to keep the connector aligned. */
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
    <FlowWindow icon={icon} img={img} title={title} width={width} onClose={onClose}
      style={{ height: 944, display: 'flex', flexDirection: 'column' }}
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
            <button className="w98-tool-btn is-on"><PixelIcon icon="info" size={16} className="w98-tool-ico" />Timeline</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>{subtitle}</span>
          </div>
        </React.Fragment>
      }
      statusbar={
        <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
          <span className="w98-status-cell grow">{items.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 150 }}>{statusRight}</span>
        </div>
      }>
      <div className="w98-sunken w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, margin: '0 1px', background: '#fff', padding: '12px 0', overflowY: 'auto' }}>
        <div ref={wrapRef} style={{ position: 'relative' }}>
          {/* main gray spine */}
          <div style={{ position: 'absolute', left: GUT + CX - 1, top: 14, bottom: 26, width: 2, background: '#c0c0c0', boxShadow: 'inset -1px 0 0 #fff' }} />
          {/* green ownership connector */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />)}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {items.map((p, k) => (
              <WorkRow key={p.id} p={p} selected={selected === p.id} hov={hov === p.id}
                onSel={onOpen} onHov={setHov} last={k === items.length - 1} hideArrow={hideArrow}
                nodeRef={(el) => { nodeRefs.current[p.id] = el; }} />
            ))}
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}

/* ---- thin wrappers over the generic TimelineWindow ---- */
function WorkTimeline({ selected, onOpen, onClose }) {
  return <TimelineWindow icon="folder" img="uploads/Work.png" title={'C:\\Professional'} width={788}
    items={WORK_ITEMS} groups={WORK_GROUPS} subtitle={'nested by owner \u00b7 newest first'}
    statusRight="owners: Freelance · Retinize · Airbus" selected={selected} onOpen={onOpen} onClose={onClose} />;
}
function EducationTimeline({ onClose }) {
  const [sel, setSel] = React.useState('epitech');
  return <TimelineWindow icon="cap" img="uploads/StudiesForBlackBackground.png" title={'C:\\Education'} width={760}
    items={EDU_ITEMS} groups={[{ parent: 'epitech', kids: ['bjtu'] }]} subtitle={'education \u00b7 newest first'}
    statusRight={'2010\u20132018'} selected={sel} onOpen={setSel} onClose={onClose} hideArrow />;
}

/* ---- docked detail panel (right) ---- */
function WorkDetailPanel({ id, onClose }) {
  const p = WORK_ITEMS.find((x) => x.id === id) || WORK_ITEMS[0];
  const isAnim = id === 'animotive';
  return (
    <FlowWindow icon={p.icon} title={p.name} onClose={onClose} width={892}
      style={{ maxHeight: 968, display: 'flex', flexDirection: 'column' }}
      menubar={isAnim ? <AmMenuBar /> : null}>
      <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '13px 15px 16px' }}>
        {isAnim
          ? <MediaPlayer ratio="16 / 9" caption="Animotive \u2014 demo reel" hint="drop image or embed YouTube" />
          : (
            <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
              <Shot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
                <span style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#cfe', letterSpacing: '.5px', textTransform: 'uppercase' }}>{p.id}.exe \u2014 render</span>
                <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                  <PixelIcon icon={p.icon} size={56} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
                </span>
              </Shot>
            </div>
          )}
        <div style={{ marginTop: 13 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '.2px' }}>{p.name}</h1>
          <div style={{ fontSize: 12, color: 'var(--w98-text-dim)', marginTop: 3 }}>{p.s}{p.e !== p.s ? '\u2013' + p.e : ''} &middot; {p.role}</div>
          {p.depth === 1 && <div style={{ marginTop: 8 }}><OwnerChip owner={OWNERS[p.parent]} /></div>}
          <div className="w98-prose" style={{ marginTop: 10 }}><p style={{ marginBottom: 0 }}>{isAnim ? WORK_ITEMS.find((x) => x.id === 'animotive').full : p.full}</p></div>
          {isAnim && (
            <div className="w98-group" style={{ marginTop: 13 }}>
              <span className="w98-group-title">Accomplishments</span>
              <WorkList />
            </div>
          )}
          <div className="w98-group" style={{ marginTop: 14 }}>
            <span className="w98-group-title">Technologies</span>
            <div className="w98-field" style={{ padding: '2px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26 }}>
                {(() => {
                  const n = p.tech.length;
                  const noBorderFrom = n - (n % 2 === 0 ? 2 : 1);
                  return p.tech.map((t, i) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px', fontSize: 13,
                      borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                      <PixelIcon icon="page" size={15} style={{ flex: '0 0 auto' }} />
                      <span>{t}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}

/* ---- README — two-column "My experience" window (right side) ----
   Left: an autoplaying, looping reel. Right: WordArt masthead, a
   bullet-separated spec sheet, and a Notepad-style README body. */
const README_SPECS = [
  ['Role', 'Unity / XR Developer'],
  ['Studio', 'Freelance \u00b7 Airbus DS \u00b7 Retinize'],
  ['Engagement', '8+ years \u00b7 remote'],
  ['Platform', 'Desktop \u00b7 VR / XR'],
  ['Stack', '12 technologies'],
];
const README_STEPS = [
  'Open the desktop shortcuts \u2014 Professional Experience, Tech Stack, Education.',
  'In Professional Experience, click a project on the timeline to read its write-up.',
  'Green connectors mark the projects built on top of the Dragonfly visualizer.',
];

/* dotted "bullet" separator used between spec rows */
function BulletRule() {
  return (
    <div aria-hidden="true" style={{ height: 3, margin: '7px 0',
      backgroundImage: 'radial-gradient(circle, #b4b4b4 1.1px, transparent 1.4px)',
      backgroundSize: '9px 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left center' }} />
  );
}

/* autoplay + loop reel; falls back to a striped placeholder when no file */
function ReelVideo({ src = 'assets/experience-reel.mp4', label = 'EXPERIENCE \u2014 REEL', hint = 'DROP 20s REEL / CLIP' }) {
  const [ok, setOk] = React.useState(true);
  const [pct, setPct] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    const p = v.play && v.play(); if (p && p.catch) p.catch(() => {});
  }, [ok]);
  return (
    <div className="w98-sunken" style={{ padding: 2, background: '#000', flex: '0 0 304px', display: 'flex' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0,
        background: 'repeating-linear-gradient(135deg, #11202b 0 8px, #162a38 8px 16px)', overflow: 'hidden' }}>
        {ok && (
          <video ref={ref} src={src} autoPlay loop muted playsInline preload="auto"
            onError={() => setOk(false)}
            onTimeUpdate={(e) => { const d = e.target.duration; if (d) setPct((e.target.currentTime / d) * 100); }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#8fd3e8', textTransform: 'uppercase' }}>{label}</div>
        {!ok && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6fb0c4', textTransform: 'uppercase', letterSpacing: '.5px' }}>[ {hint} ]</div>
          </div>
        )}
        {/* cosmetic transport — reflects the looping playhead, no controls */}
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
  return (
    <FlowWindow img="assets/ic-readme.png" title={'C:\\ReadMe.txt'} onClose={onClose} width={900}
      style={{ maxHeight: 968, display: 'flex', flexDirection: 'column' }}
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
      <div style={{ display: 'flex', flexDirection: stack ? 'column' : 'row', gap: 13, padding: '13px 13px 14px', flex: '1 1 auto', minHeight: 0 }}>
        {/* left: autoplay/loop reel, full height */}
        <ReelVideo />
        {/* right: wordart + specs + notepad body */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '4px 2px 2px' }}>
            <WordArt variant="spectrum" lines={['My experience']} size={56} />
          </div>
          {/* spec sheet with bullet separators */}
          <div className="w98-field" style={{ padding: '9px 13px', flex: '0 0 auto' }}>
            {README_SPECS.map(([k, v], i) => (
              <React.Fragment key={k}>
                {i > 0 && <BulletRule />}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ flex: '0 0 132px', fontSize: 14, color: 'var(--w98-text-dim)' }}>{k}</span>
                  <span style={{ flex: '1 1 auto', minWidth: 0, fontSize: 14,
                    color: k === 'Engagement' ? '#00007b' : 'var(--w98-text)', fontWeight: k === 'Engagement' ? 700 : 400 }}>{v}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          {/* notepad body */}
          <div className="w98-field w98-scroll" style={{ background: '#fff', padding: '12px 14px', flex: '1 1 auto', minHeight: 0, overflowY: 'auto',
            fontFamily: '"Courier New", monospace', fontSize: 12.5, lineHeight: 1.55, color: '#1d1d1d' }}>
            <div style={{ fontWeight: 700 }}>README.TXT</div>
            <div style={{ color: '#5a5a5a' }}>Lo&iuml;ck Rivemale &middot; portfolio 98</div>
            <div style={{ borderTop: '1px solid #cfcfcf', margin: '8px 0' }} />
            <p style={{ margin: '0 0 11px' }}>
              Welcome, and thanks for stopping by. This desktop is my portfolio &mdash; a Unity / XR
              developer&rsquo;s eight years of shipping aerospace simulation tools, VR filmmaking
              software, and real-time graphics experiments, laid out the way I like to work: in windows.
            </p>
            <div style={{ fontWeight: 700, color: '#00007b' }}>&gt; HOW TO BROWSE</div>
            <ul style={{ margin: '5px 0 11px', padding: 0, listStyle: 'none' }}>
              {README_STEPS.map((s, i) => (
                <li key={i} style={{ padding: '1px 0 1px 15px', textIndent: '-15px' }}>- {s}</li>
              ))}
            </ul>
            <div style={{ fontWeight: 700, color: '#00007b' }}>&gt; CONTACT</div>
            <div style={{ marginTop: 3 }}>Open to work &middot; usually replies within a day.</div>
            <div style={{ marginTop: 11, color: '#9a9a9a' }}>_</div>
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}

Object.assign(window, { WORK_ITEMS, EDU_ITEMS, TimelineWindow, WorkTimeline, EducationTimeline, WorkDetailPanel, ReadmeWindow, ReelVideo });
