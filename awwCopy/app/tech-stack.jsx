/* app/tech-stack.jsx — TechStackWindow ported from index_old
   (tech-stack-view.jsx), adapted to use window.FlowWindow (for a working
   close button, consistent with Contact/Legal/Readme) and window.PixelIcon. */
const TECH_GROUPS = [
  { cat: 'Languages', icon: 'page', items: [
    { n: 'C#', tier: 'primary', img: 'assets/tech/csharp.png' }, { n: 'C', tier: 'familiar', img: 'assets/tech/c.png' }, { n: 'C++', tier: 'familiar', img: 'assets/tech/cpp.png' },
    { n: 'Java', tier: 'familiar', img: 'assets/tech/java.png' }, { n: 'JavaScript', tier: 'familiar', img: 'assets/tech/js.png' } ] },
  { cat: 'Engines & Render Pipelines', icon: 'monitor', items: [
    { n: 'Unity', sub: 'URP \u00b7 HDRP \u00b7 custom RP', tier: 'primary', img: 'assets/tech/unity.png' }, { n: 'Render Features', tier: 'primary', img: 'assets/tech/render-feature.png' },
    { n: 'WebGL', tier: 'familiar', img: 'assets/tech/webgl.png' } ] },
  { cat: 'Graphics, Shaders & GPU', icon: 'picture', items: [
    { n: 'ShaderLab (HLSL)', tier: 'primary', img: 'assets/tech/shader.png' }, { n: 'Shader Graph', tier: 'primary', img: 'assets/tech/shader-graph.png' },
    { n: 'GPU Acceleration', tier: 'primary', img: 'assets/tech/gpu-acceleration.png' } ] },
  { cat: 'XR', icon: 'gizmo', items: [
    { n: 'Virtual Reality', tier: 'primary', img: 'assets/tech/vr.png' }, { n: 'Augmented Reality', tier: 'primary', img: 'assets/tech/ar.png' } ] },
  { cat: 'Networking', icon: 'info', items: [
    { n: 'Photon Bolt', tier: 'primary' }, { n: 'TCP / UDP', tier: 'familiar', img: 'assets/tech/tcp-udp.png' }, { n: 'Protocol Buffers', tier: 'familiar', img: 'assets/tech/protocol-buffer.png' },
    { n: 'Bluetooth', tier: 'familiar' } ] },
  { cat: 'Tools & Content', icon: 'folder', items: [
    { n: 'My Brain', tier: 'primary', img: 'assets/tech/big-brain.png' }, { n: 'Mathematics', tier: 'primary', img: 'assets/icons/mathematics.png' },
    { n: 'Git', tier: 'primary', img: 'assets/tech/git.png' }, { n: 'Editor Tooling', tier: 'primary', img: 'assets/tech/editor-tooling.png' }, { n: 'Blender', tier: 'familiar', img: 'assets/tech/blender.png' },
    { n: 'Gaea', tier: 'familiar', img: 'assets/tech/gaea.png' }, { n: 'Photoshop / Photopea', tier: 'familiar', img: 'assets/tech/photopea.png' }, { n: 'Linux', tier: 'familiar', img: 'assets/tech/linux.png' },
    { n: 'WPF', tier: 'familiar', img: 'assets/tech/wpf.png' }, { n: 'SQL', tier: 'familiar', img: 'assets/tech/sql.png' } ] },
];
const TS_TOTAL = TECH_GROUPS.reduce((a, g) => a + g.items.length, 0);
const TS_PRIMARY = TECH_GROUPS.reduce((a, g) => a + g.items.filter((i) => i.tier === 'primary').length, 0);

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
                      : <window.PixelIcon icon={g.icon} size={58} />}
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

function TechStackWindow({ onClose }) {
  const [sel, setSel] = React.useState(null);
  const [hov, setHov] = React.useState(null);

  let described = hov;
  if (!described && sel) {
    for (const g of TECH_GROUPS) {
      const it = g.items.find((i) => g.cat + '/' + i.n === sel);
      if (it) { described = { ...it, cat: g.cat }; break; }
    }
  }

  const menubar = (
    <div className="w98-menubar">
      <span className="w98-menu-item"><u>F</u>ile</span><span className="w98-menu-item"><u>E</u>dit</span>
      <span className="w98-menu-item"><u>V</u>iew</span><span className="w98-menu-item"><u>H</u>elp</span>
    </div>
  );
  const statusbar = (
    <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
      <span className="w98-status-cell grow">{TS_TOTAL} object(s)</span>
      <span className="w98-status-cell" style={{ minWidth: 92 }}>{TS_PRIMARY} primary</span>
      <span className="w98-status-cell" style={{ minWidth: 120 }}>My Computer</span>
    </div>
  );

  return (
    <window.FlowWindow img="assets/icons/toolbox-tiny.png" title="Tech stack explorer" onClose={onClose}
      menubar={menubar} statusbar={statusbar} style={{ maxWidth: 'calc(100vw - 24px)' }} className="ts-win">
      <div className="ts-body w98-sunken" onClick={() => setSel(null)}>
        <div className="ts-web" onClick={(e) => e.stopPropagation()}>
          <div className="ts-sky"><span className="ts-drive"><img src="assets/icons/toolbox-tiny.png" alt="" style={{ width: 30, height: 30 }} /></span></div>
          <div className="ts-wordart">My&nbsp;Tech<br />Stack</div>
          <div className="ts-rule" />
          <div className="ts-desc"><TechDescription item={described} /></div>
          <div className="ts-weblegend">
            <span><i className="p" />Primary</span>
            <span><i className="f" />Working</span>
          </div>
        </div>
        <div className="ts-filewrap" onClick={(e) => e.stopPropagation()}>
          <TechFiles sel={sel} setSel={setSel} setHov={setHov} />
        </div>
      </div>
    </window.FlowWindow>
  );
}

Object.assign(window, { TECH_GROUPS, TechDescription, TechFiles, TechStackWindow });
