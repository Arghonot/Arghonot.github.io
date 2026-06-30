/* tech-stack-view.jsx — "My Tech Stack" as a classic Win98 Explorer "Web View"
   folder window:
     · left web-view panel — cloudy-sky banner + WordArt title + a live
       description box that updates with the selected/hovered item
     · right client area — one icon per skill, grouped under horizontal
       separator headers ("Languages", etc.), reflowing icons-per-row so it
       reads on desktop and on a phone.
   No fake Back/Forward/Cut/Copy toolbar. Loads after pixel-icons.jsx +
   landing-shared.jsx. */

/* ---- registry · tier: 'primary' | 'familiar' ---- */
const TECH_GROUPS = [
  { cat: 'Languages', icon: 'page', items: [
    { n: 'C#', tier: 'primary', img: 'uploads/CS.png' }, { n: 'C', tier: 'familiar', img: 'uploads/C.png' }, { n: 'C++', tier: 'familiar', img: 'uploads/CPP.png' },
    { n: 'Java', tier: 'familiar', img: 'uploads/Java2.png' }, { n: 'JavaScript', tier: 'familiar', img: 'uploads/Js.png' } ] },
  { cat: 'Engines & Render Pipelines', icon: 'monitor', items: [
    { n: 'Unity', sub: 'URP \u00b7 HDRP \u00b7 custom RP', tier: 'primary', img: 'uploads/Unity.png' }, { n: 'Render Features', tier: 'primary', img: 'uploads/RenderFeature.png' },
    { n: 'WebGL', tier: 'familiar', img: 'uploads/WebGL.png' } ] },
  { cat: 'Graphics, Shaders & GPU', icon: 'picture', items: [
    { n: 'ShaderLab (HLSL)', tier: 'primary', img: 'uploads/Shader.png' }, { n: 'Shader Graph', tier: 'primary', img: 'uploads/ShadergraphBalanced.png' },
    { n: 'GPU Acceleration', tier: 'primary', img: 'uploads/GPUAcceleration.png' }, { n: 'Mathematics', tier: 'primary', img: 'uploads/MathematicsBalanced.png' } ] },
  { cat: 'XR', icon: 'gizmo', items: [
    { n: 'Virtual Reality', tier: 'primary', img: 'uploads/VR.png' }, { n: 'Augmented Reality', tier: 'primary', img: 'uploads/AR.png' } ] },
  { cat: 'Networking', icon: 'info', items: [
    { n: 'Photon Bolt', tier: 'primary' }, { n: 'TCP / UDP', tier: 'familiar', img: 'uploads/TCP_UDP.png' }, { n: 'Protocol Buffers', tier: 'familiar', img: 'uploads/ProtocolBuffer.png' } ] },
  { cat: 'Tools & Content', icon: 'folder', items: [
    { n: 'Git', tier: 'primary', img: 'uploads/Git.png' }, { n: 'Editor Tooling', tier: 'primary', img: 'uploads/EditorTooling.png' }, { n: 'Blender', tier: 'familiar', img: 'uploads/Blender.png' },
    { n: 'Gaea', tier: 'familiar', img: 'uploads/Gaea3.png' }, { n: 'Photoshop / Photopea', tier: 'familiar', img: 'uploads/Photopea.png' }, { n: 'Linux', tier: 'familiar', img: 'uploads/Linux.png' },
    { n: 'WPF', tier: 'familiar', img: 'uploads/WPF.png' }, { n: 'SQL', tier: 'familiar', img: 'uploads/SQL.png' } ] },
];
const TS_TOTAL = TECH_GROUPS.reduce((a, g) => a + g.items.length, 0);
const TS_PRIMARY = TECH_GROUPS.reduce((a, g) => a + g.items.filter((i) => i.tier === 'primary').length, 0);

/* ---- left web-view description ---- */
function TechDescription({ item }) {
  if (!item) {
    return (
      <React.Fragment>
        <div className="ts-desc-lede">Select an item to<br />view its description.</div>
        <div className="ts-desc-meta">{TS_TOTAL} technologies across {TECH_GROUPS.length} categories &mdash;{' '}
          {TS_PRIMARY} used daily, {TS_TOTAL - TS_PRIMARY} working knowledge.</div>
      </React.Fragment>
    );
  }
  const prim = item.tier === 'primary';
  return (
    <React.Fragment>
      <div className="ts-desc-name">{item.n}</div>
      <div className="ts-desc-cat">{item.cat}</div>
      {item.sub && <div className="ts-desc-sub">{item.sub}</div>}
      <div className={'ts-desc-tier ' + (prim ? 'is-p' : 'is-f')}>
        <i />{prim ? 'Primary skill \u2014 used daily' : 'Working knowledge'}
      </div>
    </React.Fragment>
  );
}

/* ---- right client area · grouped icon rows ---- */
function TechFiles({ sel, setSel, setHov }) {
  return (
    <div className="ts-files w98-scroll">
      {TECH_GROUPS.map((g) => (
        <div className="ts-cat" key={g.cat}>
          <div className="ts-cat-head">
            <span className="t">{g.cat}</span>
            <span className="ln" />
            <span className="ct">{g.items.length}</span>
          </div>
          <div className="ts-grid">
            {g.items.map((it) => {
              const item = { ...it, cat: g.cat };
              const key = g.cat + '/' + it.n;
              return (
                <div key={key}
                  className={'ts-item' + (sel === key ? ' is-sel' : '') + (it.tier === 'primary' ? '' : ' is-working')}
                  onClick={() => setSel(key)}
                  onMouseEnter={() => setHov(item)}
                  onMouseLeave={() => setHov(null)}>
                  <span className="ic">
                    {it.img
                      ? <img src={it.img} alt="" draggable={false} style={{ width: 65, height: 65, objectFit: 'contain', imageRendering: 'auto' }} />
                      : <PixelIcon icon={g.icon} size={58} />}
                  </span>
                  <span className="lbl">{it.n}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Explorer window shell ---- */
function TechStackWindow() {
  const [sel, setSel] = React.useState(null);
  const [hov, setHov] = React.useState(null);

  // resolve currently described item (hover previews, click persists)
  let described = hov;
  if (!described && sel) {
    for (const g of TECH_GROUPS) {
      const it = g.items.find((i) => g.cat + '/' + i.n === sel);
      if (it) { described = { ...it, cat: g.cat }; break; }
    }
  }

  return (
    <div className="w98 w98-window ts-win" data-screen-label="Technologies"
      onMouseDown={(e) => e.stopPropagation()}>
      <WinTitle img="uploads/BigBrain.png" title={"Tech stack explorer"} />
      <div className="w98-menubar">
        <span className="w98-menu-item"><u>F</u>ile</span><span className="w98-menu-item"><u>E</u>dit</span>
        <span className="w98-menu-item"><u>V</u>iew</span><span className="w98-menu-item"><u>H</u>elp</span>
      </div>

      <div className="ts-body w98-sunken" onClick={() => setSel(null)}>
        {/* left: web-view banner */}
        <div className="ts-web" onClick={(e) => e.stopPropagation()}>
          <div className="ts-sky"><span className="ts-drive"><img src="uploads/BigBrain.png" alt="" style={{ width: 30, height: 30 }} /></span></div>
          <div className="ts-wordart">My&nbsp;Tech<br />Stack</div>
          <div className="ts-rule" />
          <div className="ts-desc"><TechDescription item={described} /></div>
          <div className="ts-weblegend">
            <span><i className="p" />Primary</span>
            <span><i className="f" />Working</span>
          </div>
        </div>
        {/* right: icon rows */}
        <div className="ts-filewrap" onClick={(e) => e.stopPropagation()}>
          <TechFiles sel={sel} setSel={setSel} setHov={setHov} />
        </div>
      </div>

      <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
        <span className="w98-status-cell grow">{TS_TOTAL} object(s)</span>
        <span className="w98-status-cell" style={{ minWidth: 92 }}>{TS_PRIMARY} primary</span>
        <span className="w98-status-cell" style={{ minWidth: 120 }}>My Computer</span>
      </div>
    </div>
  );
}

/* ---- full desktop ---- */
function TechStackDesktop() {
  const [startOpen, setStartOpen] = React.useState(false);
  const tasks = [{ id: 'ts', icon: 'monitor', title: 'My Tech Stack' }];
  return (
    <div className="d98-root w98" data-screen-label="Tech stack desktop" onMouseDown={() => setStartOpen(false)}>
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
      <div className="ts-center" onMouseDown={(e) => e.stopPropagation()}>
        <TechStackWindow />
      </div>
      {startOpen && <StartMenu onPick={() => setStartOpen(false)} />}
      <Taskbar variant="tasks" startOpen={startOpen} tasks={tasks} activeTask="ts"
        onStart={() => setStartOpen((s) => !s)} onPick={() => setStartOpen(false)} />
    </div>
  );
}

Object.assign(window, { TECH_GROUPS, TechDescription, TechFiles, TechStackWindow, TechStackDesktop });
