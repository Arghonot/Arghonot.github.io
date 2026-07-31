/* app/clappy-assistant.jsx — the "Clappy" Office-style helper that pops up bottom-right
   when a project is opened in the Professional timeline. Yellow balloon + a
   dodging "No" button + a floating close cross. Portaled to <body> so it stays
   pinned to the viewport corner regardless of the scaled scroll-flow.
   Loads after React/ReactDOM + pixel-icons; exposes window.ClappyAssistant. */
(function () {
  if (document.getElementById('clappy-styles')) return;
  var css = `
  .clappy-stage { position: fixed; right: 24px; bottom: 48px; z-index: 9300;
    display: flex; align-items: flex-end; gap: 0; font-family: var(--w98-font);
    /* Clappy is desktop chrome, not content: match the fit-to-viewport desk scale
       so it never dwarfs the windows behind it. Bottom-right origin keeps the
       corner anchor (and taskbar clearance) identical at every scale. */
    transform: scale(var(--desk-scale, 1)); transform-origin: 100% 100%; }
  .clappy-balloon { position: relative; width: 264px; margin-right: 12px; margin-bottom: 16px;
    background: #ffffe1; color: #000; border: 1px solid #000; padding: 14px 14px 12px;
    box-shadow: 3px 3px 0 rgba(0,0,0,.32); animation: clappyPop .26s cubic-bezier(.2,1.4,.5,1) both; }
  @keyframes clappyPop { from { opacity: 0; transform: translateY(8px) scale(.92); } }
  .clappy-balloon::after { content: ""; position: absolute; right: -13px; bottom: 18px; width: 0; height: 0;
    border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 14px solid #ffffe1;
    filter: drop-shadow(1px 0 0 #000); }
  .clappy-balloon::before { content: ""; position: absolute; right: -1px; bottom: 11px; width: 14px; height: 22px; background: #ffffe1; z-index: 1; }
  .clappy-text { font-size: 13px; line-height: 1.5; margin: 0 0 12px; position: relative; z-index: 2; }
  .clappy-text b { font-weight: 700; }
  .clappy-btns { display: flex; gap: 10px; position: relative; z-index: 2; }
  .clappy-btn { font-family: var(--w98-font); font-size: 12px; color: #000; padding: 5px 16px; min-width: 70px;
    cursor: pointer; background: var(--w98-face); border: none; text-align: center;
    box-shadow: inset -1px -1px 0 var(--w98-dark), inset 1px 1px 0 var(--w98-white),
      inset -2px -2px 0 var(--w98-shadow), inset 2px 2px 0 var(--w98-face-light); }
  .clappy-btn:active { box-shadow: inset 1px 1px 0 var(--w98-dark), inset -1px -1px 0 var(--w98-white),
      inset 2px 2px 0 var(--w98-shadow), inset -2px -2px 0 var(--w98-face-light); }
  .clappy-btn.is-default { font-weight: 700; box-shadow: inset 0 0 0 1px #000,
      inset -2px -2px 0 var(--w98-dark), inset 2px 2px 0 var(--w98-white),
      inset -3px -3px 0 var(--w98-shadow), inset 3px 3px 0 var(--w98-face-light); }
  .clappy-btn.yes { display: inline-flex; align-items: center; justify-content: center; gap: 7px; text-decoration: none; }
  .clappy-btn.no { transition: left .18s ease, top .18s ease, transform .12s ease; }
  /* just above .clappy-stage so the runaway button clears the balloon, but well
     under the pipes screensaver (z 100000) so it is covered like every window */
  .clappy-btn.no.loose { position: fixed !important; margin: 0; z-index: 9350; pointer-events: auto; }
  .clappy-btn-ghost { display: block; min-width: 70px; height: 26px; }
  .clappy-figure { position: relative; flex: 0 0 auto; }
  .clappy-img { display: block; width: 104px; height: 104px; image-rendering: pixelated;
    animation: clappyBob 2.6s ease-in-out infinite; transform-origin: 50% 90%;
    filter: drop-shadow(2px 3px 2px rgba(0,0,0,.35)); }
  @keyframes clappyBob { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-7px) rotate(1.5deg); } }
  .clappy-close { position: absolute; top: -6px; right: -8px; z-index: 4; width: 22px; height: 22px;
    display: grid; place-items: center; cursor: pointer; background: var(--w98-face); border: none;
    box-shadow: inset -1px -1px 0 var(--w98-dark), inset 1px 1px 0 var(--w98-white),
      inset -2px -2px 0 var(--w98-shadow), inset 2px 2px 0 var(--w98-face-light); }
  .clappy-close:active { box-shadow: inset 1px 1px 0 var(--w98-dark), inset -1px -1px 0 var(--w98-white),
      inset 2px 2px 0 var(--w98-shadow), inset -2px -2px 0 var(--w98-face-light); }
  @media (max-width: 860px) {
    .clappy-stage { right: 12px; bottom: 60px; }
    .clappy-balloon { width: 200px; margin-right: 8px; padding: 12px 12px 10px; }
    .clappy-text { font-size: 12px; }
    .clappy-img { width: 82px; height: 82px; }
  }`;
  var el = document.createElement('style');
  el.id = 'clappy-styles';
  el.textContent = css;
  document.head.appendChild(el);
})();

var CLAPPY_MAIL = "mailto:you@email.com?subject=It%20looks%20like%20you%20want%20to%20hire%20me&body=Hi%20there%2C%0A%0AClappy%20sent%20me.%20Let's%20talk!";

function ClappyAssistant(props) {
  var onClose = props.onClose || function () {};
  var deskEl = props.deskEl || null;   /* professional desk container (position:relative) */
  var scale = props.scale || 1;
  var noRef = React.useRef(null);
  var dodges = React.useRef(0);
  var rotTimer = React.useRef(0);
  var st = React.useState({ loose: false, x: 0, y: 0, rot: 0, quip: 'No' });
  var s = st[0], setS = st[1];
  var quips = ['Nope', 'Missed', 'try again', 'lol', 'catch me!', 'Too slow'];

  function clamp(v, lo, hi) { if (hi < lo) hi = lo; return Math.max(lo, Math.min(hi, v)); }

  function bounds(bw, bh) {
    var pad = 12;
    var tb = document.querySelector('.d98-taskbar');
    var tbh = tb ? tb.getBoundingClientRect().height : 40;
    return { minX: pad, maxX: window.innerWidth - bw - pad,
             minY: pad, maxY: window.innerHeight - tbh - bh - pad };
  }

  function dodge(e) {
    var no = noRef.current; if (!no) return;
    var bw = no.offsetWidth || 80, bh = no.offsetHeight || 30, hop = 78;
    dodges.current++;
    var quip = quips[dodges.current % quips.length];
    var rot = Math.random() * 16 - 8;
    clearTimeout(rotTimer.current);
    rotTimer.current = setTimeout(function () { setS(function (p) { return Object.assign({}, p, { rot: 0 }); }); }, 150);

    /* always live in viewport coordinates (position:fixed, portaled to <body>) so the
       button can never be clipped by a scaled/overflowing desk, and is clamped inside
       the window above the taskbar. */
    var b = bounds(bw, bh);
    var rr = no.getBoundingClientRect();
    var cX = s.loose ? s.x : rr.left, cY = s.loose ? s.y : rr.top;
    var mx = cX + bw / 2, my = cY + bh / 2;
    var qx = (e && e.clientX != null) ? e.clientX : mx;
    var qy = (e && e.clientY != null) ? e.clientY : my;
    var a2 = Math.atan2(my - qy, mx - qx) + (Math.random() - .5) * 0.9;
    var nX = cX + Math.cos(a2) * hop, nY = cY + Math.sin(a2) * hop;
    /* bounce off the edges instead of sticking to them */
    if (nX < b.minX || nX > b.maxX) nX = cX - Math.cos(a2) * hop;
    if (nY < b.minY || nY > b.maxY) nY = cY - Math.sin(a2) * hop;
    setS({ loose: true, x: clamp(nX, b.minX, b.maxX), y: clamp(nY, b.minY, b.maxY), rot: rot, quip: quip });
  }

  React.useEffect(function () { return function () { clearTimeout(rotTimer.current); }; }, []);

  React.useEffect(function () {
    function onResize() {
      var no = noRef.current; if (!no) return;
      setS(function (p) {
        if (!p.loose) return p;
        var b = bounds(no.offsetWidth || 80, no.offsetHeight || 30);
        return Object.assign({}, p, { x: clamp(p.x, b.minX, b.maxX), y: clamp(p.y, b.minY, b.maxY) });
      });
    }
    window.addEventListener('resize', onResize);
    return function () { window.removeEventListener('resize', onResize); };
  }, []);

  function onNoClick() { onClose(); window.location.href = CLAPPY_MAIL; }

  var noBtn = (
    <button type="button" ref={noRef}
      className={'clappy-btn no' + (s.loose ? ' loose' : '')}
      onMouseEnter={dodge} onFocus={dodge} onClick={onNoClick}
      onMouseDown={function (e) { e.stopPropagation(); }}
      style={s.loose
        ? { left: s.x, top: s.y, transform: 'rotate(' + s.rot + 'deg) scale(var(--desk-scale, 1))' }
        : { transform: 'rotate(' + s.rot + 'deg)' }}>
      {s.quip}
    </button>
  );

  var ui = (
    <div className="clappy-stage" onMouseDown={function (e) { e.stopPropagation(); }}>
      <div className="clappy-balloon">
        <p className="clappy-text">
          Hello, I am <b>Clappy</b>! It looks like you are looking to
          hire someone.<br />Would you like to get in touch?
        </p>
        <div className="clappy-btns">
          <a className="clappy-btn is-default yes" href={CLAPPY_MAIL} onClick={onClose}>Yes</a>
          {s.loose ? <span className="clappy-btn-ghost" aria-hidden="true"></span> : noBtn}
        </div>
      </div>
      <div className="clappy-figure">
        <button type="button" className="clappy-close" aria-label="Close" title="Close Clappy"
          onClick={onClose}>
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.4" /></svg>
        </button>
        <img className="clappy-img" src="assets/ui/clappy.png" alt="Clappy the paperclip assistant" draggable={false} />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {ReactDOM.createPortal(ui, document.body)}
      {s.loose && ReactDOM.createPortal(noBtn, document.body)}
    </React.Fragment>
  );
}

window.ClappyAssistant = ClappyAssistant;
