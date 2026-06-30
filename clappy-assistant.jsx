/* clappy-assistant.jsx — the "Clappy" Office-style helper that pops up bottom-right
   when a project is opened in the Professional timeline. Yellow balloon + a
   dodging "No" button + a floating close cross. Portaled to <body> so it stays
   pinned to the viewport corner regardless of the scaled scroll-flow.
   Loads after React/ReactDOM + pixel-icons; exposes window.ClappyAssistant. */
(function () {
  if (document.getElementById('clappy-styles')) return;
  var css = `
  .clappy-stage { position: fixed; right: 24px; bottom: 48px; z-index: 9300;
    display: flex; align-items: flex-end; gap: 0; font-family: var(--w98-font); }
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
  .clappy-btn.no.loose { position: fixed; margin: 0; z-index: 2147483000; }
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
  var noRef = React.useRef(null);

  React.useEffect(function () {
    var no = noRef.current;
    if (!no) return;
    var dodges = 0, loose = false, px0 = 0, py0 = 0;
    var quips = ['Nope', 'Missed', 'try again', 'lol', 'catch me!', 'Too slow'];
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function dodge(e) {
      var bw = no.offsetWidth || 80, bh = no.offsetHeight || 30, pad = 12;
      var curX, curY;
      if (loose) { curX = px0; curY = py0; }
      else { var r = no.getBoundingClientRect(); curX = r.left; curY = r.top; }
      var cx = curX + bw / 2, cy = curY + bh / 2;
      var px = (e && e.clientX != null) ? e.clientX : cx + (Math.random() - .5);
      var py = (e && e.clientY != null) ? e.clientY : cy + (Math.random() - .5);
      var dx = cx - px, dy = cy - py;
      var hop = 78;
      var ang = Math.atan2(dy, dx) + (Math.random() - .5) * 0.9;
      var nx = curX + Math.cos(ang) * hop;
      var ny = curY + Math.sin(ang) * hop;
      nx = clamp(nx, pad, window.innerWidth - bw - pad);
      ny = clamp(ny, pad, window.innerHeight - bh - pad);
      if (!loose) {
        no.style.left = curX + 'px';
        no.style.top = curY + 'px';
        no.classList.add('loose');
        loose = true;
      }
      px0 = nx; py0 = ny;
      no.style.left = nx + 'px';
      no.style.top = ny + 'px';
      dodges++;
      no.textContent = quips[dodges % quips.length];
      no.style.transform = 'rotate(' + (Math.random() * 16 - 8) + 'deg)';
      setTimeout(function () { no.style.transform = 'rotate(0deg)'; }, 130);
    }
    function onResize() {
      if (!loose) return;
      var bw = no.offsetWidth, bh = no.offsetHeight, pad = 12;
      px0 = clamp(px0, pad, window.innerWidth - bw - pad);
      py0 = clamp(py0, pad, window.innerHeight - bh - pad);
      no.style.left = px0 + 'px';
      no.style.top = py0 + 'px';
    }
    function onClick() { onClose(); window.location.href = CLAPPY_MAIL; }
    window.addEventListener('resize', onResize);
    no.addEventListener('mouseenter', dodge);
    no.addEventListener('focus', dodge);
    no.addEventListener('click', onClick);
    return function () {
      window.removeEventListener('resize', onResize);
      no.removeEventListener('mouseenter', dodge);
      no.removeEventListener('focus', dodge);
      no.removeEventListener('click', onClick);
    };
  }, []);

  var ui = (
    <div className="clappy-stage" onMouseDown={function (e) { e.stopPropagation(); }}>
      <div className="clappy-balloon">
        <p className="clappy-text">
          Hello, I am <b>Clappy</b>! It looks like you are looking to
          hire someone.<br />Would you like to get in touch?
        </p>
        <div className="clappy-btns">
          <a className="clappy-btn is-default yes" href={CLAPPY_MAIL} onClick={onClose}>Yes</a>
          <button type="button" className="clappy-btn no" ref={noRef}>No</button>
        </div>
      </div>
      <div className="clappy-figure">
        <button type="button" className="clappy-close" aria-label="Close" title="Close Clappy"
          onClick={onClose}>
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.4" /></svg>
        </button>
        <img className="clappy-img" src="assets/clappy.png" alt="Clappy the paperclip assistant" draggable={false} />
      </div>
    </div>
  );
  return ReactDOM.createPortal(ui, document.body);
}

window.ClappyAssistant = ClappyAssistant;
