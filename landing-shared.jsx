/* landing-shared.jsx — shared Win98 landing-page building blocks.
   Reuses win98.css + desktop.css + styles/landing.css + pixel-icons.jsx.
   Exports to window. NOTE: no `const styles = …` collisions here. */

/* ---------------- person / copy ---------------- */
const ME = {
  hello: 'Hi there',
  role: 'Unity Developer · Real-time graphics & XR',
  blurb: 'I blend solid engineering with creative exploration — aerospace simulation tools, VR filmmaking software, and personal projects that push real-time graphics. Pull up a window and have a look around.',
  reelCap: 'SHOWREEL // REALTIME'
};

/* ---------------- the three portfolio sections ---------------- */
const SECTIONS = [
{ id: 'professional', label: 'Professional', icon: 'folder', cap: 'WORK // CASE STUDIES' },
{ id: 'personal', label: 'Personal', icon: 'reel', cap: 'PLAY // EXPERIMENTS' },
{ id: 'about', label: 'About Me', icon: 'info', cap: 'WHOAMI // PROFILE' }];


/* ---------------- live clock ---------------- */
function useNow(everyMs = 10000) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {const t = setInterval(() => setNow(new Date()), everyMs);return () => clearInterval(t);}, [everyMs]);
  return now;
}
function ClockText() {
  const now = useNow(10000);
  let h = now.getHours();const ampm = h >= 12 ? 'PM' : 'AM';h = h % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, '0');
  return <span className="d98-clock">{h}:{m} {ampm}</span>;
}
/* HH:MM:SS for the reel HUD */
function ReelClock() {
  const now = useNow(1000);
  const p = (n) => String(n).padStart(2, '0');
  return <span className="reel-time">{p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}</span>;
}

/* ---------------- the animated "background video" surface ----------------
   Drop-in for real footage: pass a <video>/<img> as children and it covers
   the placeholder. Otherwise an animated synthwave demo-reel plays. */
function Reel({ caption, rec = true, hud = true, children, style, className = '' }) {
  return (
    <div className={'reel ' + className} style={style}>
      {children}
      {!children && <React.Fragment>
        <span className="reel-stars" />
        <span className="reel-grid" />
      </React.Fragment>}
      <span className="reel-vig" />
      <span className="reel-scan" />
      {hud && <React.Fragment>
        <span className="reel-cap">{rec && <span className="reel-rec" />}{caption || ME.reelCap}</span>
        <ReelClock />
      </React.Fragment>}
    </div>);

}

/* ---------------- reusable static window titlebar ---------------- */
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
        : icon && <PixelIcon icon={icon} size={16} className="w98-titlebar-icon" />}
      <span className="w98-titlebar-text" style={{ fontFamily: "\"Tahoma\"" }}>{title}</span>
      <div className="w98-titlebar-btns">
        <button className="w98-tb-btn" aria-label="minimize"><span className="w98-tb-glyph">{g.min}</span></button>
        <button className="w98-tb-btn" aria-label="maximize"><span className="w98-tb-glyph">{g.max}</span></button>
        <button className="w98-tb-btn" aria-label="close" onClick={onClose}><span className="w98-tb-glyph">{g.close}</span></button>
      </div>
    </div>);

}

/* ---------------- portrait placeholder tile ---------------- */
function Portrait({ w, h }) {
  return (
    <span className="lp-portrait" style={{ flexBasis: w, width: w, height: h }}>
      <span className="ph">{'[ portrait ]'}<br />drop photo</span>
    </span>);

}

/* ---------------- start menu ---------------- */
const SM_ITEMS = [
{ icon: 'folder', label: 'Professional', arrow: true, section: 'professional' },
{ icon: 'reel', label: 'Personal', arrow: true, section: 'personal' },
{ icon: 'info', label: 'About Me', section: 'about' },
{ divider: true },
{ icon: 'page', label: 'Resume.doc' },
{ icon: 'picture', label: 'Guestbook' },
{ divider: true },
{ icon: 'monitor', label: 'Shut Down\u2026' }];

function StartMenu({ onPick }) {
  return (
    <div className="d98-startmenu" onMouseDown={(e) => e.stopPropagation()}>
      <div className="d98-sm-side"><b>Portfolio<i>98</i></b></div>
      <div className="d98-sm-list">
        {SM_ITEMS.map((it, i) => it.divider ?
        <div key={i} className="d98-sm-divider" /> :
        <div key={i} className={'d98-sm-item' + (it.arrow ? ' arrow' : '')} onClick={() => onPick && onPick(it.section)}>
              <PixelIcon icon={it.icon} size={24} className="ico" />{it.label}
            </div>)}
      </div>
    </div>);

}

/* ---------------- speaker glyph ---------------- */
function Speaker() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
      <path d="M1 5h3l4-3v10l-4-3H1z" fill="#1d1d1d" />
      <path d="M10 4c1.6 1.2 1.6 4.8 0 6M12 2.5c2.8 2 2.8 7 0 9" stroke="#1d1d1d" strokeWidth="1.1" fill="none" />
    </svg>);

}

/* ---------------- taskbar ----------------
   variant "nav"   → Start + section launcher buttons + tray (approach A)
   variant "tasks" → Start + quicklaunch + open-window buttons + tray (approach B)
   variant "plain" → Start + quicklaunch + tray (approach C, nav lives elsewhere) */
function Taskbar({ variant = 'nav', startOpen, onStart, onPick, tasks = [], activeTask }) {
  const logoColors = ['#d83b3b', '#2f9b46', '#1083d4', '#e8b84a'];
  return (
    <div className="d98-taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <div className={'d98-start' + (startOpen ? ' is-open' : '')} onClick={(e) => {e.stopPropagation();onStart && onStart();}}>
        <span className="d98-start-logo">{logoColors.map((c, i) => <span key={i} style={{ background: c }} />)}</span>
        Start
      </div>
      <span className="d98-sep" />

      {variant === 'nav' &&
      <React.Fragment>
          <div className="lp-navgroup">
            {SECTIONS.map((s) =>
          <button key={s.id} className="lp-navbtn" onClick={() => onPick && onPick(s.id)}>
                <PixelIcon icon={s.icon} size={16} className="ico" />{s.label}
              </button>
          )}
          </div>
          <div style={{ flex: '1 1 auto' }} />
        </React.Fragment>
      }

      {variant !== 'nav' &&
      <React.Fragment>
          <div className="d98-qlaunch">
            {['folder', 'reel', 'info'].map((ic) =>
          <button key={ic} className="d98-ql-btn"><PixelIcon icon={ic} size={16} /></button>
          )}
          </div>
          <span className="d98-sep" />
          <div className="d98-tasks">
            {tasks.map((t, i) =>
          <div key={i} className={'d98-taskbtn' + (activeTask === t.id ? ' is-active' : '')}>
                <PixelIcon icon={t.icon} size={16} className="ico" /><span>{t.title}</span>
              </div>
          )}
          </div>
        </React.Fragment>
      }

      <div className="d98-tray"><Speaker /><ClockText /></div>
    </div>);

}

Object.assign(window, { ME, SECTIONS, useNow, ClockText, ReelClock, Reel, WinTitle, Portrait, StartMenu, Speaker, Taskbar });