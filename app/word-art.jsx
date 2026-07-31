/* app/word-art.jsx — late-90s "WordArt"-style treatments of the slogan
   "Engineering meets creative exploration". Pure CSS: a back layer carries the
   outline + drop shadow, a front layer carries the gradient fill (clipped to
   the glyphs). Each variant tweaks fill / stroke / shadow / slant. No orange. */

const WA_FONT = '"Arial Black", "Franklin Gothic Heavy", Impact, sans-serif';
const SLOGAN = ['Engineering meets', 'creative exploration'];

/* the variant table */
const WA_VARIANTS = {
  // 1 · cool spectrum sweep, hard outline + offset shadow, slanted
  spectrum: {
    size: 34, italic: true, skew: -8, tracking: '0px',
    fill: 'linear-gradient(90deg,#15c0d6,#2a6fdb,#6b3fd0,#b53fb0)',
    stroke: '2px #1a1a1a',
    shadow: '3px 3px 0 #9a9a9a',
  },
  // 2 · classic sky: white→blue→navy vertical, thick black outline
  sky: {
    size: 36, italic: false, skew: 0, tracking: '0px', upper: false,
    fill: 'linear-gradient(180deg,#ffffff 0%,#7cc2ff 42%,#1c4fd0 72%,#00007b 100%)',
    stroke: '2.5px #000',
    shadow: '4px 4px 0 rgba(0,0,0,.28)',
  },
  // 3 · chrome / silver bevel, italic, embossed via dual shadow
  chrome: {
    size: 35, italic: true, skew: 0, tracking: '0px',
    fill: 'linear-gradient(180deg,#6f7176 0%,#fdfdfd 38%,#c7ccd2 52%,#7d818a 70%,#eef1f4 100%)',
    stroke: '1px #3a3d42',
    shadow: '-1px -1px 0 #ffffff, 2px 3px 2px rgba(0,0,0,.4)',
  },
  // 4 · purple pop, vertical magenta→violet, bold outline + hard shadow
  grape: {
    size: 29, italic: false, skew: -4, tracking: '0px', upper: true,
    fill: 'linear-gradient(180deg,#f06bdd 0%,#b32fce 55%,#5e1f9e 100%)',
    stroke: '2.5px #120018',
    shadow: '4px 4px 0 #b9b9c4',
  },
  // 5 · flat teal display (no outline/shadow) — desktop accent colour
  teal: {
    size: 56, italic: false, skew: 0, tracking: '-1px', upper: false,
    fill: 'linear-gradient(#2f8f88,#2f8f88)',
    stroke: '0px rgba(0,0,0,0)',
    shadow: 'none',
  },
};

function WordArt({ lines = SLOGAN, variant = 'sky', size }) {
  const v = WA_VARIANTS[variant] || WA_VARIANTS.sky;
  const base = {
    fontFamily: WA_FONT,
    fontWeight: 900,
    fontSize: size || v.size,
    lineHeight: 0.98,
    /* descenders (g, y, p) sit below the line box, and the italic/skewed final
       glyph leans past its advance width; pad the box on both axes so the clipped
       gradient fill reaches them instead of revealing the black back layer. */
    paddingBottom: '0.2em',
    paddingRight: '0.18em',
    paddingLeft: '0.06em',
    letterSpacing: v.tracking || '0',
    fontStyle: v.italic ? 'italic' : 'normal',
    textTransform: v.upper ? 'uppercase' : 'none',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    margin: 0,
  };
  const Layer = ({ style }) => (
    <div style={{ ...base, ...style }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
  return (
    <div style={{ display: 'inline-block', transform: v.skew ? `skewX(${v.skew}deg)` : undefined }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* back — outline + shadow */}
        <Layer style={{ WebkitTextStroke: v.stroke, color: '#000', textShadow: v.shadow }} />
        {/* front — gradient fill clipped to glyphs */}
        <Layer style={{ position: 'absolute', inset: 0, background: v.fill, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }} />
      </div>
    </div>
  );
}

/* a WordArt sample framed in a little Win98 window */
function WordArtCard({ title, variant, lines }) {
  const Btn = ({ glyph, label }) => (
    <button className="w98-tb-btn" aria-label={label}><span className="w98-tb-glyph">{glyph}</span></button>
  );
  return (
    <div className="w98 w98-window" style={{ width: '100%', maxWidth: 560 }}>
      <div className="w98-titlebar">
        <PixelIcon icon="picture" size={16} className="w98-titlebar-icon" />
        <span className="w98-titlebar-text">{title}</span>
        <div className="w98-titlebar-btns">
          <Btn label="minimize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>} />
          <Btn label="maximize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>} />
          <Btn label="close" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>} />
        </div>
      </div>
      <div style={{ padding: 9 }}>
        <div className="w98-sunken" style={{ background: '#ffffff', padding: '30px 18px', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          <WordArt variant={variant} lines={lines} />
        </div>
        <div className="w98-statusbar">
          <div className="w98-status-cell grow" style={{ fontFamily: '"Courier New", monospace' }}>style: {variant}</div>
          <div className="w98-status-cell">WordArt</div>
        </div>
      </div>
    </div>
  );
}

/* the four named samples */
const WordArtSpectrum = () => <WordArtCard title="WordArt — Spectrum" variant="spectrum" />;
const WordArtSky      = () => <WordArtCard title="WordArt — Sky" variant="sky" />;
const WordArtChrome   = () => <WordArtCard title="WordArt — Chrome" variant="chrome" />;
const WordArtGrape    = () => <WordArtCard title="WordArt — Grape" variant="grape" />;

Object.assign(window, { WordArt, WordArtCard, WordArtSpectrum, WordArtSky, WordArtChrome, WordArtGrape });
