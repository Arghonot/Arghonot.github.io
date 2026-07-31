/* app/project-window.jsx — generic personal-project window ported from
   index_old (final-windows.jsx: ProjectWindow + ProjShot + ProjLightbox),
   reused by every Personal desk project (Art now, others as their icons get
   wired). Desktop: hero + write-up on the left, screenshots in a tall column
   on the right. Responsive (`stack`): screenshots drop to a mosaic below the
   write-up. The screenshot grid always uses an auto-fill mosaic so the
   window's own height/width just fits however many shots a project has —
   no oversized empty grid for a 2-shot project.
   Requires window.FlowWindow and window.PixelIcon. */
function ProjShot({ hue, label, file, dims, tag, big, compact, src, fit }) {
  const h = hue;
  if (src) return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      <img src={src} alt={label || ''} draggable="false" loading={compact ? 'lazy' : undefined} decoding="async"
        style={{ width: '100%', height: '100%', objectFit: fit || 'cover', display: 'block', imageRendering: 'auto' }} />
      {tag && <span style={{ position: 'absolute', top: 5, left: 5, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '0 5px' }}>{tag}</span>}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'grid', placeItems: 'center', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, hsl(${h} 30% 12%) 0 9px, hsl(${h} 33% 16%) 9px 18px)` }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)' }} />
      {tag && <span style={{ position: 'absolute', top: 5, left: 5, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '0 5px' }}>{tag}</span>}
      <div style={{ textAlign: 'center', zIndex: 1, padding: '0 8px', maxWidth: '100%' }}>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: big ? 15 : compact ? 10 : 13, letterSpacing: compact ? '.5px' : '2px',
          color: `hsl(${h} 48% 78%)`, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{label}</div>
        {file && !compact && <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '1px', color: `hsl(${h} 28% 62%)`, marginTop: 6 }}>{file} &middot; {dims}</div>}
      </div>
    </div>
  );
}

/* click-to-play YouTube frame: shows YT's own thumbnail until clicked, so the
   page never loads the player on mount. */
function ProjVideo({ id, label }) {
  const [on, setOn] = React.useState(false);
  if (on) return (
    <iframe title={label || 'video'} src={'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen
      style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#000' }} />
  );
  return (
    <button onClick={() => setOn(true)} title={'Play \u2014 ' + (label || 'video')}
      style={{ all: 'unset', cursor: 'pointer', position: 'relative', width: '100%', height: '100%', display: 'block', background: '#000', overflow: 'hidden' }}>
      <img src={'https://i.ytimg.com/vi/' + id + '/sddefault.jpg'} alt={label || ''} draggable="false"
        onError={(e) => { e.currentTarget.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.18)' }}>
        <span className="w98-raised" style={{ display: 'grid', placeItems: 'center', width: 58, height: 40, background: 'var(--w98-face)', paddingLeft: 4 }}>
          <span style={{ width: 0, height: 0, borderLeft: '17px solid #1d1d1d', borderTop: '11px solid transparent', borderBottom: '11px solid transparent' }} />
        </span>
      </span>
      {label && <span style={{ position: 'absolute', bottom: 6, left: 7, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#0b0b0b', background: 'rgba(207,214,200,.92)', padding: '0 5px', textTransform: 'uppercase' }}>{label}</span>}
    </button>
  );
}

function ProjLightbox({ shots, index, setIndex, onClose, previewAspect }) {
  const s = shots[index];
  if (!s) return null;
  const go = (d) => setIndex((index + d + shots.length) % shots.length);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, shots.length]);
  const tri = (dir) => ({ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
    [dir === 'r' ? 'borderLeft' : 'borderRight']: '9px solid #1d1d1d' });
  /* one fixed box per gallery (project-declared) so the preview window never
     resizes while stepping through the mosaic; the image scales to fit. */
  const pa = previewAspect || (s.src ? 3 / 2 : 16 / 9);
  const aspect = typeof pa === 'string'
    ? (function () { const p = pa.split('/').map(Number); return p.length === 2 && p[1] ? p[0] / p[1] : 3 / 2; })()
    : pa;
  /* fit the placeholder render into the real viewport (minus taskbar and modal
     chrome/padding) via CSS min()/calc() — no fixed design-canvas constants. */
  const availW = 'calc(100vw - 64px)';
  const availH = 'calc(100vh - var(--tb-h) - 168px)';
  const w = `min(${availW}, calc(${availH} * ${aspect}))`;
  const h = `min(${availH}, calc(${availW} / ${aspect}))`;
  /* portalled to <body> so it covers the whole viewport (above the desk stage
     and any window it was opened from) instead of being clipped by its mount. */
  return ReactDOM.createPortal((
    <div onMouseDown={onClose}
      style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 'var(--tb-h)', zIndex: 6000, background: 'rgba(0,0,40,.6)', display: 'grid', placeItems: 'center', padding: '24px 20px' }}>
      <div className="w98 w98-window" style={{ position: 'static', width: `calc(${w} + 18px)`, maxWidth: 'calc(100vw - 40px)', boxSizing: 'border-box', boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #dfdfdf, inset -2px -2px 0 #808080, inset 2px 2px 0 #fff, 4px 6px 22px rgba(0,0,0,.55)' }}
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="w98-titlebar">
          <window.PixelIcon icon="picture" size={16} className="w98-titlebar-icon" />
          <span className="w98-titlebar-text">{'Image Preview \u2014 ' + s.file}</span>
          <div className="w98-titlebar-btns">
            <button className="w98-tb-btn" aria-label="close" onClick={onClose}><span className="w98-tb-glyph"><svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg></span></button>
          </div>
        </div>
        <div className="w98-toolbar" style={{ borderBottom: '1px solid #808080', boxShadow: '0 1px 0 #fff' }}>
          <button className="w98-tool-btn" onClick={() => go(-1)}><span style={tri('l')} />Prev</button>
          <button className="w98-tool-btn" onClick={() => go(1)}>Next<span style={tri('r')} /></button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontFamily: '"Courier New", monospace', color: 'var(--w98-text-dim)' }}>{index + 1}/{shots.length}</span>
        </div>
        <div style={{ padding: 6, minWidth: 0 }}>
          <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
            <div style={{ width: '100%', height: h }}>
              <ProjShot hue={s.hue} label={s.label} file={s.file} dims={s.dims} src={s.src} fit={s.src ? 'contain' : undefined} big />
            </div>
          </div>
          <div className="w98-field" style={{ marginTop: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontWeight: 700, flex: '0 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
            <span style={{ color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace', flex: '0 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.dims} &middot; {s.file}</span>
          </div>
        </div>
      </div>
    </div>
  ), document.body);
}

/* real destinations for the project link buttons; labels with no entry here
   stay inert (no public page yet). */
const PROJ_LINKS = { GitHub: 'https://github.com/Arghonot', Instagram: 'https://www.instagram.com/argrafix' };

function ProjLinkBtn({ label }) {
  const href = PROJ_LINKS[label];
  const st = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 16, padding: '4px 10px', textDecoration: 'none', color: 'var(--w98-text)' };
  return href
    ? <a className="w98-btn" href={href} target="_blank" rel="noreferrer" style={st}>{label}&nbsp;&#8599;</a>
    : <button type="button" className="w98-btn" style={st}>{label}&nbsp;&#8599;</button>;
}

function ProjectWindow({ proj, onClose, onZoom, stack }) {
  const NOTE_MENUS = ['File', 'Edit', 'View', 'Tools', 'Help'];
  const n = proj.tech ? proj.tech.length : 0;
  const noBorderFrom = n - (n % 2 === 0 ? 2 : 1);
  const hasShots = proj.shots && proj.shots.length > 0;
  const twoCol = hasShots && !stack;

  const left = (
    <div style={{ flex: twoCol ? '1 1 0' : '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
        <div style={{ aspectRatio: proj.hero.aspect || ((proj.hero.src || proj.hero.youtube) ? '16 / 9' : '16 / 10') }}>
          {proj.hero.youtube
            ? <ProjVideo id={proj.hero.youtube} label={proj.hero.label} />
            : <ProjShot hue={proj.hero.hue} label={proj.hero.label} file={proj.hero.file} dims={proj.hero.dims} src={proj.hero.src} fit={proj.hero.fit} big />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 35, fontWeight: 700, letterSpacing: '-.3px' }}>{proj.label}</h1>
          <div style={{ fontSize: 16, color: 'var(--w98-text-dim)', marginTop: 2 }}>{proj.kind}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: '0 0 auto' }}>
          {proj.links.map((l) => <ProjLinkBtn key={l} label={l} />)}
          {proj.download && (
            <button type="button" className="d98-taskbtn proj-dl-btn" style={{ flex: '0 0 auto', cursor: 'pointer', height: 48, padding: '0 14px', background: 'linear-gradient(90deg, #1b3a8c, #1083d4)', color: '#fff' }}
              onMouseDown={(e) => e.currentTarget.classList.add('is-active')}
              onMouseUp={(e) => e.currentTarget.classList.remove('is-active')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('is-active')}
              onClick={() => {
                const h = proj.download.href; if (!h) return;
                const a = document.createElement('a');
                a.href = h; a.download = proj.download.file || '';
                document.body.appendChild(a); a.click(); a.remove();
              }}>
              <img className="ico" src={proj.img} alt="" />
              <span>{proj.download.label || 'Download'}</span>
              <span style={{ marginLeft: 10, fontSize: 18 }}>{'\u2192'}</span>
            </button>
          )}
        </div>      </div>
      <div className="w98-prose" style={{ marginTop: 10 }}>
        {(Array.isArray(proj.desc) ? proj.desc : [proj.desc]).map((para, i, arr) => (
          <p key={i} style={{ marginBottom: i === arr.length - 1 ? 0 : 10 }}>{para}</p>
        ))}
      </div>
      {proj.accomplishments && proj.accomplishments.length > 0 && (
        <div className="w98-group" style={{ marginTop: 24 }}>
          <span className="w98-group-title">Accomplishments</span>
          <ul className="w98-bullets" style={{ margin: 0 }}>
            {proj.accomplishments.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}
      {proj.howTo && proj.howTo.length > 0 && (
        <div className="w98-group" style={{ marginTop: 24 }}>
          <span className="w98-group-title">How to use</span>
          <div className="w98-prose">
            {(Array.isArray(proj.howTo) ? proj.howTo : [proj.howTo]).map((para, i, arr) => (
              <p key={i} style={{ marginBottom: i === arr.length - 1 ? 0 : 10 }}>{para}</p>
            ))}
          </div>
        </div>
      )}
      {proj.tech && proj.tech.length > 0 && (
      <div className="w98-group" style={{ marginTop: 28 }}>
        <span className="w98-group-title">Technologies</span>
        <div className="w98-field" style={{ padding: '2px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26 }}>
            {proj.tech.map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px', fontSize: 17,
                borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                <span style={{ width: 8, height: 8, background: '#00007b', flex: '0 0 auto', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.3)' }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );

  const scrolls = twoCol && hasShots;

  const right = hasShots ? (
    <div style={{ flex: twoCol ? '1 1 0' : '0 0 auto', minWidth: 0, minHeight: 0, position: twoCol ? 'relative' : undefined, display: 'flex', flexDirection: 'column', marginTop: twoCol ? 0 : 14 }}>
      {/* absolute in twoCol: the mosaic must not contribute to the row height —
         the left column (hero + write-up + technologies) dictates it. */}
      <div className="w98-group" style={twoCol
        ? { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }
        : { flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
        <span className="w98-group-title">Screenshots</span>
        <div className={scrolls ? 'w98-sunken w98-scroll' : 'w98-sunken'}
          style={{ padding: 8, background: '#fff', flex: '1 1 auto', minHeight: 0, overflowY: scrolls ? 'auto' : undefined }}>
          <div style={{ display: 'grid', gridTemplateColumns: twoCol ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 10 }}>
            {proj.shots.map((s, i) => (
              <button key={s.n} onClick={() => onZoom && onZoom(proj.shots, i)} title={s.label}
                className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: 3, background: 'var(--w98-face)' }}>
                <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
                  <div style={{ aspectRatio: '1 / 1' }}>
                    <ProjShot hue={s.hue} label={s.label} tag={s.n} src={s.src} compact />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <window.FlowWindow img={proj.img} title={proj.win || proj.label} onClose={onClose} width={twoCol ? 1180 : 560}
      style={stack
        ? { maxWidth: 'calc(100vw - 24px)', display: 'flex', flexDirection: 'column' }
        : { maxHeight: 'calc(var(--vph) - 40px)', maxWidth: 'calc(var(--vpw) - 24px)', display: 'flex', flexDirection: 'column' }}
      menubar={
        <div className="w98-menubar">
          {NOTE_MENUS.map((m) => <span key={m} className="w98-menu-item"><u>{m[0]}</u>{m.slice(1)}</span>)}
        </div>
      }>
      <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: stack ? 'visible' : 'auto', padding: '12px 14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: twoCol ? 'row' : 'column', gap: twoCol ? 16 : 0, alignItems: 'stretch' }}>
          {left}
          {right}
        </div>
      </div>
    </window.FlowWindow>
  );
}

const ART_PROJECT = {
  img: 'assets/icons/art.png', label: 'Artistic projects', win: 'D:\\ArtisticProjects', kind: 'Personal work', links: ['Instagram'],
  hero: { label: 'DIGITAL PAINTING', file: 'art_cover.png', dims: '1920\u00d71080', hue: 28, src: 'assets/projects/art/art-cover.jpg', fit: 'contain' },
  desc: [
    'This space gathers my ongoing personal work in technical art and visual development: shader studies, procedural landscapes, rendering experiments, and small artistic prototypes.',
    'I use these projects to explore new techniques, refine my visual language, and develop ideas that often feed into videos, worldbuilding, and larger storytelling concepts. Part of this work is shared publicly through my Instagram and other online platforms.',
  ],
  tech: ['Unity', 'ShaderGraph', 'Gaea', 'Blender', 'HLSL'],
  shots: [
    { n: '01', label: 'BACKROOMS', file: 'backrooms.jpg', dims: '1600\u00d7809', hue: 48, src: 'assets/projects/art/backrooms.jpg' },
    { n: '02', label: 'LAVA FIELDS', file: 'lava_fields.jpg', dims: '1600\u00d7827', hue: 8, src: 'assets/projects/art/voxel-lava.jpg' },
    { n: '03', label: 'JUPITER', file: 'jupiter.jpg', dims: '1600\u00d7803', hue: 220, src: 'assets/projects/art/jupiter.jpg' },
    { n: '04', label: 'VOXEL SEA', file: 'voxel_sea.jpg', dims: '1332\u00d7892', hue: 165, src: 'assets/projects/art/voxel-teal.jpg' },
    { n: '05', label: 'TOPO SCAN', file: 'topo_scan.jpg', dims: '1078\u00d71933', hue: 185, src: 'assets/projects/art/glitch-terrain.jpg' },
    { n: '06', label: 'SUNSET LINES', file: 'sunset_lines.jpg', dims: '1453\u00d7361', hue: 340, src: 'assets/projects/art/sunset-lines.jpg' },
    { n: '07', label: 'SMOKE OUTLINE', file: 'smoke_outline.jpg', dims: '979\u00d7761', hue: 200, src: 'assets/projects/art/smoke-outline.jpg' },
    { n: '08', label: 'CANYON WALK', file: 'canyon_walk.jpg', dims: '895\u00d71600', hue: 275, src: 'assets/projects/art/canyon-walk.jpg' },
    { n: '09', label: 'CONTOUR MAP', file: 'contour_map.jpg', dims: '733\u00d71309', hue: 8, src: 'assets/projects/art/contour-map.jpg' },
    { n: '10', label: 'PALADIN', file: 'paladin.jpg', dims: '793\u00d71417', hue: 330, src: 'assets/projects/art/paladin.jpg' },
    { n: '11', label: 'SIEUR FLAMME', file: 'sieur_flamme.jpg', dims: '675\u00d71202', hue: 195, src: 'assets/projects/art/sieur-flamme.jpg' },
    { n: '12', label: 'SATELLITE PLAN', file: 'satellite_plan.jpg', dims: '950\u00d7645', hue: 210, src: 'assets/projects/art/satellite-plan.jpg' },
    { n: '13', label: 'GLITCH AERIAL', file: 'glitch_aerial.jpg', dims: '1600\u00d7813', hue: 178, src: 'assets/projects/art/glitch-aerial.jpg' },
    { n: '14', label: 'DUNE VISTA', file: 'dune_vista.jpg', dims: '1600\u00d7896', hue: 30, src: 'assets/projects/art/dune-vista.jpg' },
    { n: '15', label: 'CONTOUR RELIEF', file: 'contour_relief.jpg', dims: '1600\u00d7875', hue: 320, src: 'assets/projects/art/contour-relief.jpg' },
    { n: '16', label: 'MOON SCHEMATICS', file: 'moon_schematics.png', dims: '1927\u00d7922', hue: 210, src: 'assets/projects/art/moon-schematics.png' },
    { n: '17', label: 'COLD METAL LOGO', file: 'cold_metal_logo.png', dims: '1536\u00d71024', hue: 200, src: 'assets/projects/art/cold-metal-logo.png' },
    { n: '18', label: 'WIREFRAME PRIMITIVES', file: 'wireframe_primitives.png', dims: '1139\u00d71298', hue: 225, src: 'assets/projects/art/wireframe-primitives.png' },
    { n: '19', label: 'VOXEL DUNES', file: 'voxel_dunes.png', dims: '1891\u00d71024', hue: 48, src: 'assets/projects/art/voxel-dunes.png' },
    { n: '20', label: 'RED TOWER', file: 'red_tower.png', dims: '1080\u00d71923', hue: 6, src: 'assets/projects/art/red-tower.png' },
  ],
};

const TERRAIN_PROJECT = {
  img: 'assets/icons/terrain.png', label: 'Terrain Creation', win: 'D:\\TerrainCreation', kind: 'Personal project', links: [],
  hero: { label: 'TERRAIN TOOL', file: 'lotr_terrain.jpg', dims: '1800\u00d71519', hue: 130, src: 'assets/projects/terrain/lotr-hero.jpg', aspect: '7 / 5' },
  desc: [
    'I create procedural landscapes using Gaea and World Machine, mainly for visual experiments, rendering tests, and video work.',
    'These terrains are used as a base for environment studies, look-development, and technical/artistic experiments in Unity, where I explore lighting, shaders, composition, and large-scale landscape rendering.',
  ],
  tech: ['Gaea1', 'Gaea2', 'WorldMachine', 'Unity', 'Rendering', 'EnvironmentArt'],
  shots: [
    { n: '01', label: 'FOREST LAKES', file: 'forest_lakes.jpg', dims: '1500\u00d71036', hue: 130, src: 'assets/projects/terrain/forest-lakes.jpg' },
    { n: '02', label: 'VALLEY RIDGES', file: 'valley_ridges.jpg', dims: '1500\u00d7909', hue: 96, src: 'assets/projects/terrain/valley-ridges.jpg' },
    { n: '03', label: 'RIVER CANYON', file: 'river_canyon.jpg', dims: '1600\u00d71025', hue: 96, src: 'assets/projects/terrain/stylized-canyon.jpg' },
    { n: '04', label: 'LUNAR SURFACE', file: 'lunar_surface.jpg', dims: '1300\u00d71281', hue: 220, src: 'assets/projects/terrain/lunar.jpg' },
    { n: '05', label: 'DUNE FIELD', file: 'dune_field.jpg', dims: '1600\u00d7567', hue: 30, src: 'assets/projects/terrain/dunes.jpg' },
    { n: '06', label: 'SEA BOTTOM', file: 'sea_bottom.jpg', dims: '1600\u00d71006', hue: 205, src: 'assets/projects/terrain/sea-bottom.jpg' },
    { n: '07', label: 'PEAK', file: 'peak.jpg', dims: '1600\u00d7922', hue: 36, src: 'assets/projects/terrain/peak.jpg' },
    { n: '08', label: 'VOXEL WORLD', file: 'voxel_world.jpg', dims: '1342\u00d7681', hue: 110, src: 'assets/projects/terrain/voxel-world.jpg' },
    { n: '09', label: 'CRATER', file: 'crater.jpg', dims: '1600\u00d7841', hue: 215, src: 'assets/projects/terrain/crater.jpg' },
    { n: '10', label: 'DUNE CANYON', file: 'dune_canyon.jpg', dims: '1261\u00d7733', hue: 28, src: 'assets/projects/terrain/dune-canyon.jpg' },
    { n: '11', label: 'DUSTY MOUNTAINS', file: 'dusty_mountains.jpg', dims: '1546\u00d71029', hue: 34, src: 'assets/projects/terrain/dusty-mountains.jpg' },
    { n: '12', label: 'VALLEY', file: 'valley.jpg', dims: '1600\u00d71007', hue: 96, src: 'assets/projects/terrain/valley.jpg' },
    { n: '13', label: 'CASCADES', file: 'cascades.jpg', dims: '1600\u00d7873', hue: 150, src: 'assets/projects/terrain/cascades.jpg' },
    { n: '14', label: 'DESERT CLIFF', file: 'desert_cliff.jpg', dims: '1600\u00d7893', hue: 40, src: 'assets/projects/terrain/desert-cliff.jpg' },
    { n: '15', label: 'NECRON CANYON', file: 'necron_canyon.jpg', dims: '1600\u00d71130', hue: 24, src: 'assets/projects/terrain/necron-canyon.jpg' },
    { n: '16', label: 'MOON SURFACE', file: 'moon.jpg', dims: '1600\u00d7888', hue: 220, src: 'assets/projects/terrain/moon.jpg' },
    { n: '17', label: 'MOUNTAIN DEVICE', file: 'mountain_device.jpg', dims: '1600\u00d7861', hue: 20, src: 'assets/projects/terrain/mountain-device.jpg' },
    { n: '18', label: 'PLATEAU GENERATOR', file: 'plateau.jpg', dims: '1600\u00d71117', hue: 44, src: 'assets/projects/terrain/plateau.jpg' },
    { n: '19', label: 'ORANGE DESERT CLIFF', file: 'orange_desert_cliff.jpg', dims: '1600\u00d7851', hue: 18, src: 'assets/projects/terrain/orange-desert-cliff.jpg' },
    { n: '20', label: 'SHATTERED CLIFFS', file: 'shattered_cliffs.jpg', dims: '1600\u00d7993', hue: 210, src: 'assets/projects/terrain/shattered-cliffs.jpg' },
  ],
};

const XNOISE_PROJECT = {
  img: 'assets/icons/xnoise.png', label: 'XNoise', win: 'D:\\Xnoise', kind: 'Personal project', links: ['GitHub', 'itch.io'],
  hero: { label: 'NODAL NOISE EDITOR', file: 'xnoise_player.jpg', dims: '1700\u00d7956', hue: 232, src: 'assets/projects/xnoise/player.jpg' },
  desc: 'A nodal noise generation tool for Unity based on a port of libnoise, rewritten entirely in shaders. Supports Perlin, Billow, RidgedMultifractal, Voronoi and exports 2D, spherical, or cylindrical maps.',
  tech: ['Unity', 'C#', 'ShaderLab', 'HLSL', 'xNode', 'WebGL'],
  shots: [
    { n: '01', label: 'BILLOW', file: 'billow_blue.jpg', dims: '1200\u00d7675', hue: 200, src: 'assets/projects/xnoise/billow-blue.jpg' },
    { n: '02', label: 'BILLOW MAP', file: 'billow.jpg', dims: '1200\u00d7675', hue: 210, src: 'assets/projects/xnoise/billow.jpg' },
    { n: '03', label: 'RIDGED BIOMES', file: 'ridged_biomes.jpg', dims: '1200\u00d7675', hue: 120, src: 'assets/projects/xnoise/ridged-earth.jpg' },
    { n: '04', label: 'RIDGED MULTI', file: 'ridged_multi.jpg', dims: '1200\u00d7675', hue: 266, src: 'assets/projects/xnoise/ridged.jpg' },
    { n: '05', label: 'VORONOI', file: 'voronoi.jpg', dims: '1200\u00d7675', hue: 140, src: 'assets/projects/xnoise/voronoi.jpg' },
    { n: '06', label: 'PERLIN', file: 'perlin_sun.jpg', dims: '1200\u00d7675', hue: 18, src: 'assets/projects/xnoise/perlin-sun.jpg' },
    { n: '07', label: 'TURBULENCE', file: 'jade_turbulence.jpg', dims: '1200\u00d7675', hue: 150, src: 'assets/projects/xnoise/jade-turbulence.jpg' },
    { n: '08', label: 'WOOD \u2014 GRAPH VIEW', file: 'wood_graph.png', dims: '2890\u00d71630', hue: 140, src: 'assets/projects/xnoise/wood-graph.png' },
    { n: '09', label: 'WOOD \u2014 RENDER VIEW', file: 'wood_render.png', dims: '2890\u00d71624', hue: 36, src: 'assets/projects/xnoise/wood-render.png' },
    { n: '10', label: 'PERLIN \u2014 PLAYER', file: 'perlin_player.png', dims: '1915\u00d71080', hue: 150, src: 'assets/projects/xnoise/perlin-render.png' },
    { n: '11', label: 'VORONOI \u2014 CUBE', file: 'voronoi_cube.png', dims: '2898\u00d71632', hue: 350, src: 'assets/projects/xnoise/voronoi-cube.png' },
    { n: '12', label: 'BILLOW \u2014 CYLINDER', file: 'billow_cylinder.png', dims: '2897\u00d71634', hue: 220, src: 'assets/projects/xnoise/billow-cylinder.png' },
  ],
};

const ENABLE_PROJECT = {
  img: 'assets/icons/enable.png', label: 'Enable', win: 'D:\\Enable', kind: 'Personal project', links: ['GitHub', 'itch.io'],
  hero: { label: 'ENABLE', file: 'enable_cover.jpg', dims: '1600\u00d7900', hue: 280, src: 'assets/projects/enable/cover.jpg' },
  desc: 'A puzzle-platformer about losing and recovering your abilities. Manage movement, jumping, and directional skills in precise order to reach the portal.',
  tech: ['Unity', 'C#', 'CustomShaders', 'WebGL'],
  shots: [
    { n: '01', label: 'PORTAL RUN', file: 'level_01.jpg', dims: '1400\u00d7875', hue: 130, src: 'assets/projects/enable/level-01.jpg' },
    { n: '02', label: 'CROSSROADS', file: 'level_02.jpg', dims: '1400\u00d7877', hue: 100, src: 'assets/projects/enable/level-02.jpg' },
    { n: '03', label: 'LAVA TEMPLE', file: 'level_03.jpg', dims: '1400\u00d7875', hue: 26, src: 'assets/projects/enable/level-03.jpg' },
  ],
};

const TITLE_PROJECT = {
  img: 'assets/icons/title.png', label: 'Title', win: 'D:\\Title', kind: 'Personal project', links: ['GitHub', 'itch.io'],
  hero: { label: 'TITLE SCREEN', file: 'title_screen.jpg', dims: '1600\u00d7900', hue: 6, src: 'assets/projects/title/hero.jpg' },
  desc: 'A chaotic 2-4 player local co-op game in a crowded office elevator.',
  accomplishments: [
    'NPC steering and crowd movement prototype.',
    'All in-game custom shaders and visual effects.',
    'Overall artistic direction.',
  ],
  tech: ['Unity', 'ShaderGraph', 'C#', 'LocalMultiplayer'],
};

const ARCANA_PROJECT = {
  img: 'assets/icons/arcana.png', label: 'ARCANA', win: 'D:\\Arcana', kind: 'Personal project', links: [],
  download: { label: 'Download rules', href: 'files/arcana-rules-addendum.txt', file: 'ARCANA-Rules-Addendum.txt' },
  howTo: [
    'Download the game rules.',
    'Drop it to your favorite LLM.',
    'Tell it "let\u2019s play a game now."',
  ],
  hero: { label: 'ARCANA', file: 'arcana_banner.jpg', dims: '1700\u00d7956', hue: 12, src: 'assets/projects/arcana/banner.jpg' },
  desc: [
    'ARCANA is a tarot-inspired, LLM-driven dungeon crawler where every card shapes the world, encounters, and the player\u2019s fate.',
    'As a player you navigate a dungeon where each room is dictated by a major and minor arcana tarot card. These will decide what lies in the room and what are the stakes. Your goal is to reach the inner room of the dungeon to find what lies inside.',
  ],
  previewAspect: '16 / 9',
  shots: [
    { n: '01', label: 'THE HANGED MAN', file: 'hanged_room.jpg', dims: '1400\u00d7764', hue: 40, src: 'assets/projects/arcana/hanged-room.jpg' },
    { n: '02', label: 'OVERGROWN SHRINE', file: 'overgrown_shrine.jpg', dims: '1400\u00d7764', hue: 140, src: 'assets/projects/arcana/overgrown-shrine.jpg' },
    { n: '03', label: 'SCRIBE\u2019S CELL', file: 'scribe_cell.jpg', dims: '1400\u00d7764', hue: 30, src: 'assets/projects/arcana/scribe-cell.jpg' },
    { n: '04', label: 'GAMBLING DEN', file: 'gambling_den.jpg', dims: '1400\u00d7764', hue: 22, src: 'assets/projects/arcana/gambling-den.jpg' },
  ],
};

const CHROME_PROJECT = {
  img: 'assets/icons/chrome.png', label: 'Chrome', win: 'D:\\Chrome', kind: 'Personal project', links: ['GitHub', 'itch.io'],
  hero: { label: 'CHROME \u2014 GAMEPLAY', file: 'chrome.mp4', dims: '1920\u00d71080', hue: 210, youtube: 'KjQxsBD2ex8' },
  desc: 'A VR game where you play as a "god" restoring a planet by painting it back to life - a calm, meditative experience.',
  tech: ['Unity', 'VR', 'ShaderGraph', 'C#'],
};

const SIEURFLAMME_PROJECT = {
  img: 'assets/icons/sieur-flamme.png', label: 'Sieur Flamme', win: 'D:\\SieurFlamme', kind: 'Animated series', links: ['Instagram'],
  meta: 'Story-driven video series \u00b7 Instagram',
  reelCaption: 'teaser', reelTag1: 'VIDEO', reelTag2: 'series',
  reelVideo: 'https://loick.rivemale.space/videos/EP1Website.mp4', reelRatio: '9 / 16', reelW: 1000, previewAspect: '4 / 5',
  cursor: { frames: ['assets/ui/sf-cursor-0.png', 'assets/ui/sf-cursor-1.png', 'assets/ui/sf-cursor-2.png', 'assets/ui/sf-cursor-3.png'], hx: 0, hy: 6, ms: 100, desk: 'personal' },
  desc: [
    'Sieur Flamme is an animated series built around a custom rendering system I created to emulate the look of retro games such as Another World, mixed with dungeon synth and dark fantasy aesthetics.',
    'The project is fully self-directed: I handle everything from storyboarding and visual development to asset creation, outsourcing, rendering, editing, and final video release.',
  ],
  tech: ['Unity', 'C#', 'CustomRendering', 'ShaderGraph', 'HLSL', 'Storyboarding', 'VideoEditing', 'ArtDirection'],
  shots: [
    { n: '01', label: 'CANYON STARS', file: 'canyon_stars.jpg', dims: '1000\u00d72167', hue: 22, src: 'assets/projects/sieur-flamme/canyon-stars.jpg' },
    { n: '02', label: 'NIGHT MONOLITH', file: 'night_monolith.jpg', dims: '1000\u00d71778', hue: 220, src: 'assets/projects/sieur-flamme/night-monolith.jpg' },
    { n: '03', label: 'GLACIER FLARE', file: 'glacier_flare.jpg', dims: '925\u00d71399', hue: 26, src: 'assets/projects/sieur-flamme/glacier-flare.jpg' },
    { n: '04', label: 'WRAITH BRIDGE', file: 'wraith_bridge.jpg', dims: '822\u00d71427', hue: 18, src: 'assets/projects/sieur-flamme/wraith-bridge.jpg' },
    { n: '05', label: 'CLIFF DESCENT', file: 'cliff_descent.jpg', dims: '803\u00d71432', hue: 30, src: 'assets/projects/sieur-flamme/cliff-descent.jpg' },
  ],
};

/* ---- big media / video player placeholder, inlined from animotive.jsx so
   this file has no cross-file dependency (used by the reel window below) ---- */
function MediaPlayer({ height = 'auto', ratio = '16 / 9', caption = 'demo reel', hint = 'drop image or embed YouTube' }) {
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
        <div style={{ position: 'absolute', top: 7, left: 8, fontFamily: '"Courier New", monospace', fontSize: 10, letterSpacing: '.5px', color: '#8fd3e8', textTransform: 'uppercase' }}>
          {caption}
        </div>
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

/* real video file player (autoplays muted, remembers position across reloads) */
/* real video file in the fake Win98 player chrome: autoplays muted, loops, no
   native controls (the transport strip is decorative and inert), remembers
   position across reloads. */
function ProjVideoFile({ src, ratio = '16 / 9', poster, fill, caption }) {
  const ref = React.useRef(null);
  const [t, setT] = React.useState({ cur: 0, dur: 0 });
  const key = 'sf-video-pos:' + src;
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    const saved = parseFloat(localStorage.getItem(key) || '0');
    if (saved > 1) { try { v.currentTime = saved; } catch (e) {} }
    const onTime = () => setT({ cur: v.currentTime || 0, dur: v.duration || 0 });
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onTime);
    const save = () => { if (v.currentTime > 1) localStorage.setItem(key, String(v.currentTime)); };
    const iv = setInterval(save, 2000);
    return () => { clearInterval(iv); save(); v.removeEventListener('timeupdate', onTime); v.removeEventListener('loadedmetadata', onTime); };
  }, [src]);
  const clock = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  };
  const pct = t.dur > 0 ? Math.min(100, (t.cur / t.dur) * 100) : 0;
  return (
    <div className="w98-sunken" style={{ padding: 2, background: '#000', width: '100%', maxWidth: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', flex: '0 0 auto', aspectRatio: ratio, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" tabIndex={-1}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)' }} />
        {caption && <span style={{ position: 'absolute', top: 7, left: 8, pointerEvents: 'none', fontFamily: '"Courier New", monospace',
          fontSize: 10, letterSpacing: '.5px', color: '#8fd3e8', textTransform: 'uppercase' }}>{caption}</span>}
      </div>
      <div aria-hidden="true" style={{ flex: '0 0 auto', height: 22, background: 'var(--w98-face)', display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 7px', pointerEvents: 'none', userSelect: 'none', boxShadow: 'inset 0 1px 0 #fff' }}>
        <span style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 3, height: 10, background: '#1d1d1d' }} />
          <span style={{ width: 3, height: 10, background: '#1d1d1d' }} />
        </span>
        <div className="w98-sunken" style={{ flex: 1, height: 8, position: 'relative', padding: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: '#000080' }} />
          <div className="w98-raised" style={{ position: 'absolute', left: 'max(0px, calc(' + pct + '% - 3px))', top: -2, width: 7, height: 12 }} />
        </div>
        <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, color: '#1d1d1d' }}>{clock(t.cur) + ' / ' + clock(t.dur)}</span>
      </div>
    </div>
  );
}

/* ---- "Now Playing" reel window (tall 9:16 reel left, write-up right).
   Used by Sieur Flamme. Follows the same responsive-clamp law as every
   other window here (maxHeight/maxWidth); reorders to column on `stack`. ---- */
function ProjectReelWindow({ proj, onClose, stack, onZoom }) {
  /* while this window lives, the page wears the project's animated cursor
     (frames swapped on a timer — browsers don't animate .ani/.gif cursors).
     Unmount for any reason restores the normal cursor. */
  React.useEffect(() => {
    const cur = proj.cursor;
    if (!cur || !cur.frames || !cur.frames.length) return;
    const preload = cur.frames.map((src) => { const im = new Image(); im.src = src; return im; });
    const st = document.createElement('style');
    document.head.appendChild(st);
    let i = 0, on = true;
    const paint = () => {
      if (!on) return;
      st.textContent = '*,*::before,*::after{cursor:url("' + cur.frames[i] + '") ' + (cur.hx | 0) + ' ' + (cur.hy | 0) + ',auto !important}';
      i = (i + 1) % cur.frames.length;
    };
    const sync = () => {
      const d = document.querySelector('.desk.is-active');
      on = !cur.desk || !!(d && d.dataset.desk === cur.desk);
      if (!on) st.textContent = ''; else paint();
    };
    sync();
    const iv = setInterval(paint, cur.ms || 100);
    window.addEventListener('desk:change', sync);
    return () => { clearInterval(iv); window.removeEventListener('desk:change', sync); st.remove(); preload.length = 0; };
  }, []);
  return (
    <window.FlowWindow img={proj.img} title={proj.win || (proj.label + ' \u2014 Now Playing')} onClose={onClose} width={proj.reelW || 900}
      style={stack
        ? { maxWidth: 'calc(100vw - 24px)', display: 'flex', flexDirection: 'column' }
        : { maxHeight: 'calc(var(--vph) - 40px)', maxWidth: 'calc(var(--vpw) - 24px)', display: 'flex', flexDirection: 'column' }}
      statusbar={
        <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
          <span className="w98-status-cell grow">{'Now playing \u2014 ' + (proj.reelCaption || 'reel')}</span>
          {proj.reelTag1 && <span className="w98-status-cell">{proj.reelTag1}</span>}
          {proj.reelTag2 && <span className="w98-status-cell" style={{ fontWeight: 700 }}>{proj.reelTag2}</span>}
        </div>
      }>
      <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: stack ? 'visible' : 'auto', display: 'flex', flexDirection: stack ? 'column' : 'row', gap: 14, padding: '13px 14px', alignItems: 'stretch' }}>
        <div style={proj.reelVideo && !stack
          ? { flex: '0 0 auto', minWidth: 0, width: 'calc((var(--vph) - 150px) * 0.5625)', maxWidth: '46%', display: 'flex', alignItems: 'center' }
          : { flex: stack ? '0 0 auto' : (proj.reelWide ? '1 1 520px' : '0 0 300px'), maxWidth: stack ? (proj.reelWide ? 'none' : 300) : 'none', width: stack ? '100%' : 'auto', margin: stack ? '0 auto' : 0 }}>
          {proj.reelVideo
            ? <ProjVideoFile src={proj.reelVideo} ratio={proj.reelRatio || '16 / 9'} fill={!stack} caption={proj.label.toUpperCase() + ' \u2014 ' + (proj.reelCaption || 'reel').toUpperCase()} />
            : <MediaPlayer ratio="9 / 16" caption={proj.label.toUpperCase() + ' \u2014 REEL'} hint="drop 9:16 reel / clip" />}
        </div>
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 0, fontSize: 35, fontWeight: 700, letterSpacing: '-.3px' }}>{proj.label}</h1>
          <div style={{ fontSize: 17, color: 'var(--w98-text-dim)', marginTop: 3 }}>{proj.meta}</div>
          {proj.links && proj.links.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12 }}>
              {proj.links.map((l) => <ProjLinkBtn key={l} label={l} />)}
            </div>
          )}
          <div className="w98-group" style={{ marginTop: 22 }}>
            <span className="w98-group-title">{proj.accomplishments && proj.accomplishments.length ? 'Accomplishments' : 'About'}</span>
            {proj.accomplishments && proj.accomplishments.length
              ? <ul className="w98-bullets" style={{ margin: 0 }}>{proj.accomplishments.map((w, i) => <li key={i}>{w}</li>)}</ul>
              : <div className="w98-prose">{(Array.isArray(proj.desc) ? proj.desc : [proj.desc]).map((para, i, arr) => <p key={i} style={{ marginBottom: i === arr.length - 1 ? 0 : 10 }}>{para}</p>)}</div>}
          </div>
          <div className="w98-group" style={{ marginTop: 24 }}>
            <span className="w98-group-title">Technologies</span>
            <div className="w98-field" style={{ padding: '2px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26 }}>
                {proj.tech.map((t, i) => {
                  const n = proj.tech.length;
                  const noBorderFrom = n - (n % 2 === 0 ? 2 : 1);
                  return (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 2px', fontSize: 17,
                      borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                      <span style={{ width: 8, height: 8, background: '#00007b', flex: '0 0 auto', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.3)' }} />
                      <span>{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {proj.shots && proj.shots.length > 0 && (
            <div className="w98-group" style={{ marginTop: 24 }}>
              <span className="w98-group-title">Gallery</span>
              <div className="w98-sunken" style={{ padding: 8, background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {proj.shots.map((s, i) => (
                    <button key={s.n} onClick={() => onZoom && onZoom(proj.shots, i)} title={s.label}
                      className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: 3, background: 'var(--w98-face)' }}>
                      <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
                        <div style={{ aspectRatio: '1 / 1' }}>
                          <ProjShot hue={s.hue} label={s.label} tag={s.n} src={s.src} compact />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </window.FlowWindow>
  );
}

Object.assign(window, { ProjShot, ProjLightbox, ProjectWindow, ProjectReelWindow, ART_PROJECT, TERRAIN_PROJECT, XNOISE_PROJECT, ENABLE_PROJECT, TITLE_PROJECT, CHROME_PROJECT, ARCANA_PROJECT, SIEURFLAMME_PROJECT });
