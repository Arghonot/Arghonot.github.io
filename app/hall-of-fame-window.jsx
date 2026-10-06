/* app/hall-of-fame-window.jsx — companion window for Read Me on the
   Professional desktop. Requires window.FlowWindow. */
const HALL_OF_FAME_ITEMS = [
  {
    title: 'Airbus Group VR visualizer',
    text: 'Took part from early R&D through production and maintenance.',
    spine: 'Airbus Group Official VR',
    cover: 'assets/hof/hof-1.png',
    workItem: 'dragonfly',
  },
  {
    title: '8K/10K \u2192 4K XR Video Pipeline',
    text: 'Made 360 video player allowing 8k video playback on low end XR hardware',
    spine: 'Mission Control',
    cover: 'assets/hof/hof-2.png',
    workItem: 'compression',
  },
  {
    title: 'VR UI Framework',
    text: 'Built and maintained a UI/interaction system used for 3+ years in a commercial VR product.',
    spine: 'Shipped Animotive',
    cover: 'assets/hof/hof-3.png',
    workItem: 'vrui',
  },
  {
    title: 'Millions of GPU Raycasts <5ms',
    text: 'Collider-free raycasting on static and animated geometry.',
    spine: 'Millions in 30ms',
    cover: 'assets/hof/hof-4.png',
    workItem: 'gpuray',
  },
  {
    title: 'End-to-End XR Platform',
    text: 'Built and maintained an AR application, its updater, asset pipeline and cloud/backend.',
    spine: '8K on AR Glasses',
    cover: 'assets/hof/hof-5.png',
    workItem: 'freelance',
  },
];

function HallOfFameWindow({ onClose, onSelect }) {
  const menus = ['File', 'Edit', 'View', 'Help'];
  return (
    <window.FlowWindow
      img="assets/icons/readme.png"
      title={'Hall of Fame \u2014 Game Library'}
      onClose={onClose}
      width={'clamp(540px, calc(var(--vpw) - 1222px), 800px)'}
      className="hof-win"
      style={{ maxHeight: 'calc(var(--vph) - 24px)' }}
      menubar={
        <div className="w98-menubar">
          {menus.map((menu) => (
            <span key={menu} className="w98-menu-item" aria-disabled="true">
              <u>{menu[0]}</u>{menu.slice(1)}
            </span>
          ))}
        </div>
      }
      statusbar={
        <div className="w98-statusbar">
          <div className="w98-status-cell grow">5 titles</div>
          <div className="w98-status-cell">Hover a box to peek</div>
        </div>
      }>
      <div className="hof-scrollwrap">
        <div className="w98-sunken w98-scroll hof-scroll">
          <div className="hof-stage">
            <div className="hof-head">
              <span className="hof-wa">
                <span className="b">My hall of fame</span>
                <span className="f">My hall of fame</span>
              </span>
            </div>
            {HALL_OF_FAME_ITEMS.map((item) => (
              <div className="sx" key={item.title} role="button" tabIndex="0"
                aria-label={'Open ' + item.title}
                onClick={() => onSelect(item.workItem)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(item.workItem);
                  }
                }}>
                <div className="bx">
                  <div className="cart"><span className="cl">CLICK ME</span></div>
                  <div className="fc">
                    <div className="cv"><img src={item.cover} alt="" /></div>
                    <div className="tz"><span className="t">{item.title}</span></div>
                    <div className="ft">{item.text}</div>
                  </div>
                  <div className="sd">{item.spine}</div>
                  <span className="shd" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </window.FlowWindow>
  );
}

Object.assign(window, { HallOfFameWindow });
