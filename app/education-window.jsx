/* app/education-window.jsx — EducationTimeline ported from index_old
   (work-final.jsx: TimelineWindow + WorkRow + EDU_ITEMS, trimmed to only the
   "epitech" owner color needed for education). Adds a `stack` prop (driven by
   a matchMedia listener, same convention as app/readme-window.jsx) so small
   screens get the shared full-width window with content flowing instead of a
   fixed 944px-tall internal scroll region. Requires window.FlowWindow and
   window.PixelIcon. */
const EDU_SEL_PIN = '#1565d8';
const EDU_OWNERS = {
  epitech: { color: '#1083d4', label: 'Epitech',
    cardBorder: '#c9dcf3', cardBg: '#eef4fc', chipBg: '#e3eefb', chipBorder: '#a9caef', chipText: '#1763b8' },
};
const eduOwnerOf = (p) => p.owner ? EDU_OWNERS[p.id] : (p.depth === 1 && p.parent ? EDU_OWNERS[p.parent] : null);

/* `note` = 1–2 extra lines shown under each item. Edit the strings below;
   use "\n" (or leave empty / omit) to control the second line. */
const EDU_ITEMS = [
  { id: 'epitech', name: 'Epitech', s: '2013', e: '2018', dur: '5 yrs', icon: 'cap', hue: 206, depth: 0, owner: true,
    desc: "Master's degree in Software Engineering \u2014 Epitech, France.",
    note: 'Project-based curriculum: C/C++, linux systems and team projects.\nFinished specialized in real-time 3D and VR applications.' },
  { id: 'bjtu', name: 'Beijing Jiaotong University', s: '2016', e: '2017', dur: '1 yr', icon: 'book', hue: 16, depth: 1, parent: 'epitech',
    desc: 'Computer Science \u2014 exchange year in Beijing, China.',
    note: 'Exchange year taught in English, plus Mandarin classes\nspecialized in Big Data.' },
  { id: 'lycee', name: 'Saint-Joseph High School', s: '2011', e: '2013', dur: '2 yrs', icon: 'chip', hue: 152, depth: 0,
    desc: 'Baccalaur\u00e9at STI2D \u2014 Rodez, France.',
    note: 'Electronics, mechanics and programming.' },
];
const eduNoteLines = (p) => (p.note || '').split('\n').filter(Boolean).slice(0, 2);
const EDU_GROUPS = [{ parent: 'epitech', kids: ['bjtu'] }];
const GUT = 52, SPINE = 46, CX = 23, INDENT = 22;
const triArrow = (c) => ({ width: 0, height: 0, borderLeft: '8px solid ' + c, borderTop: '5px solid transparent', borderBottom: '5px solid transparent' });

function EduShot({ p, children, style }) {
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

function OwnerChip({ on, owner }) {
  const o = owner || EDU_OWNERS.epitech;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '1px 7px 1px 6px',
      background: on ? 'rgba(255,255,255,.16)' : o.chipBg, border: '1px solid ' + (on ? 'rgba(255,255,255,.4)' : o.chipBorder),
      color: on ? '#fff' : o.chipText, fontSize: 14.5, fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap', borderRadius: 2 }}>
      <span style={{ width: 6, height: 6, background: on ? '#fff' : o.color, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.2)' }} />
      {o.label}
    </span>
  );
}

function EduRow({ p, selected, hov, onSel, onHov, nodeRef, stack }) {
  const on = selected;
  const child = p.depth === 1;
  const own = eduOwnerOf(p);
  const oc = own ? own.color : null;
  const nodeColor = on ? EDU_SEL_PIN : (oc || '#c0c0c0');
  return (
    <button onClick={() => onSel(p.id)} onMouseEnter={() => onHov(p.id)} onMouseLeave={() => onHov((h) => h === p.id ? null : h)}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'stretch', width: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <span style={{ width: GUT, flex: '0 0 auto', textAlign: 'right', paddingRight: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.05 }}>
        <span style={{ display: 'block', fontSize: 16, fontFamily: '"Courier New", monospace', fontWeight: 700, color: 'var(--w98-text)' }}>{p.s}</span>
        <span style={{ display: 'block', fontSize: 14, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{p.e}</span>
      </span>
      <span style={{ width: SPINE, flex: '0 0 auto', position: 'relative' }}>
        <span ref={nodeRef} style={{ position: 'absolute', top: '50%', left: CX + (child ? INDENT : 0), transform: 'translate(-50%,-50%)',
          width: 11, height: 11, background: nodeColor, boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.55), inset 1px 1px 0 rgba(255,255,255,.85)', zIndex: 2 }} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'flex-start',
        margin: (child ? '2px' : '3px') + ' 12px ' + (child ? '2px' : '3px') + ' ' + (child ? 14 : 0) + 'px', padding: child ? '8px 12px' : '11px 12px',
        border: on ? '1px solid #00004d' : (child ? '1px solid ' + own.cardBorder : '1px solid transparent'),
        background: on ? 'var(--w98-navy)' : (hov ? '#eef2f7' : (child ? own.cardBg : 'transparent')),
        color: on ? '#fff' : 'var(--w98-text)' }}>
        {!stack && <span className="w98-sunken" style={{ display: 'block', flex: '0 0 auto', padding: 2, background: '#000', width: child ? 58 : 112 }}>
          <EduShot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <window.PixelIcon icon={p.icon} size={child ? 17 : 28} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
            </span>
          </EduShot>
        </span>}
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: child ? 2 : 4, justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: child ? 7 : 9, flexWrap: 'wrap' }}>
            {p.owner && <span style={{ width: child ? 7 : 8, height: child ? 7 : 8, background: on ? '#fff' : oc, flex: '0 0 auto' }} />}
            <span style={{ fontSize: child ? 17 : 22, fontWeight: 700, lineHeight: 1.08 }}>{p.name}</span>
            {child && <OwnerChip on={on} owner={own} />}
          </span>
          {!child && !stack && <span style={{ fontSize: 16, lineHeight: 1.4, opacity: on ? .96 : .82, textWrap: 'pretty',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</span>}
          {!stack && eduNoteLines(p).length > 0 && (
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: child ? 3 : 2 }}>
              {eduNoteLines(p).map((ln, i) => (
                <span key={i} style={{ fontSize: child ? 14 : 15, lineHeight: 1.35, textWrap: 'pretty',
                  fontFamily: '"Courier New", monospace', opacity: on ? .9 : .7 }}>{ln}</span>
              ))}
            </span>
          )}
        </span>
        {!child && !stack && <span style={{ flex: '0 0 auto', alignSelf: 'center', width: 52, textAlign: 'right', fontSize: 16, fontFamily: '"Courier New", monospace', fontWeight: 700, opacity: on ? 1 : .8 }}>{p.dur}</span>}
      </span>
    </button>
  );
}

function EducationTimeline({ onClose, stack }) {
  const [sel, setSel] = React.useState('epitech');
  const [hov, setHov] = React.useState(null);
  const wrapRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const [paths, setPaths] = React.useState([]);

  React.useLayoutEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current; if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      const sc = wrap.offsetWidth ? wr.width / wrap.offsetWidth : 1;
      const out = [];
      EDU_GROUPS.forEach((g) => {
        const pn = nodeRefs.current[g.parent]; if (!pn) return;
        const pr = pn.getBoundingClientRect();
        const px = (pr.left + pr.width / 2 - wr.left) / sc;
        const py = (pr.top + pr.height / 2 - wr.top) / sc;
        const kids = g.kids.map((k) => nodeRefs.current[k]).filter(Boolean)
          .map((n) => { const r = n.getBoundingClientRect(); return { x: (r.left + r.width / 2 - wr.left) / sc, y: (r.top + r.height / 2 - wr.top) / sc }; });
        if (!kids.length) return;
        const cx = kids[0].x, firstY = kids[0].y, lastY = kids[kids.length - 1].y;
        const color = EDU_OWNERS[g.parent] ? EDU_OWNERS[g.parent].color : '#2f9b46';
        out.push({ color, d: 'M ' + px + ' ' + (py + 6) + ' V ' + (firstY - 14) + ' Q ' + px + ' ' + firstY + ' ' + cx + ' ' + firstY + ' L ' + cx + ' ' + lastY });
      });
      setPaths(out);
    };
    compute();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', compute);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', compute); };
  }, [sel, stack]);

  const listBox = (
    <div className={stack ? '' : 'w98-sunken w98-scroll'} style={stack
      ? { position: 'relative', padding: '12px 0', background: '#fff' }
      : { flex: '1 1 auto', minHeight: 0, margin: '0 1px', background: '#fff', padding: '12px 0', overflowY: 'auto' }}>
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: GUT + CX - 1, top: 14, bottom: 26, width: 2, background: '#c0c0c0', boxShadow: 'inset -1px 0 0 #fff' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
          {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />)}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {EDU_ITEMS.map((p) => (
            <EduRow key={p.id} p={p} stack={stack} selected={sel === p.id} hov={hov === p.id}
              onSel={setSel} onHov={setHov} nodeRef={(el) => { nodeRefs.current[p.id] = el; }} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <window.FlowWindow icon="cap" img="assets/icons/studies-dark.png" title={'C:\\Education'} onClose={onClose}
      width={stack ? undefined : 760}
      style={stack
        ? { display: 'flex', flexDirection: 'column' }
        : { height: 700, maxHeight: 'calc(var(--vph) - 70px)', maxWidth: 'calc(var(--vpw) - 24px)', display: 'flex', flexDirection: 'column' }}
      menubar={
        <div className="w98-menubar">
          {['File', 'Edit', 'View', 'Go', 'Help'].map((m) => (
            <span key={m} className="w98-menu-item" aria-disabled="true"
              style={{ color: '#808080', textShadow: '1px 1px 0 #fff', cursor: 'default', pointerEvents: 'none' }}>
              <u>{m[0]}</u>{m.slice(1)}
            </span>
          ))}
        </div>
      }
      statusbar={
        <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
          <span className="w98-status-cell grow">{EDU_ITEMS.length} object(s)</span>
          <span className="w98-status-cell" style={{ minWidth: 150 }}>{'2011\u20132018'}</span>
        </div>
      }>
      {listBox}
    </window.FlowWindow>
  );
}

Object.assign(window, { EducationTimeline });
