/* final-windows.jsx — content for the FINAL scroll-flow portfolio.
   Defines the window frames I author (so their close buttons really work)
   and the per-desktop content layer <DeskContent>.

   Reuses, from the existing component library:
     landing-shared.jsx  WinTitle
     animotive.jsx       AM, AmMenuBar, MediaPlayer, HeaderBlock, WorkList, TechChips
     animotive-about*.jsx AboutSplit, SEAL_BG
     animotive-contact.jsx CONTACT, CI  (+ injects .ct-* styles)
     project-image-approaches.jsx  SP, Shot, RoleModal
     work-menu-rows-timeline.jsx   WorkMenuRowsTimeline
   Exports DeskContent + the authored windows to window. */

/* ---------- titlebar glyphs ---------- */
const TBG = {
  min: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>,
  max: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>,
  close: <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>,
};

/* ---------- authored window frame with a working close ---------- */
function FlowWindow({ icon, pattern, img, title, onClose, menubar, statusbar, width, style, children }) {
  return (
    <div className="w98 w98-window" style={{ width, boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #dfdfdf, inset -2px -2px 0 #808080, inset 2px 2px 0 #fff, 4px 6px 18px rgba(0,0,0,.45)', ...(style || {}) }}
      onMouseDown={(e) => e.stopPropagation()}>
      <div className="w98-titlebar">
        {pattern
          ? <PixelIcon pattern={pattern} size={16} className="w98-titlebar-icon" />
          : img
            ? <img src={img} alt="" className="w98-titlebar-icon" style={{ width: 16, height: 16 }} />
            : icon && <PixelIcon icon={icon} size={16} className="w98-titlebar-icon" />}
        <span className="w98-titlebar-text">{title}</span>
        <div className="w98-titlebar-btns">
          <button className="w98-tb-btn" aria-label="minimize"><span className="w98-tb-glyph">{TBG.min}</span></button>
          <button className="w98-tb-btn" aria-label="maximize"><span className="w98-tb-glyph">{TBG.max}</span></button>
          <button className="w98-tb-btn" aria-label="close" onClick={onClose}><span className="w98-tb-glyph">{TBG.close}</span></button>
        </div>
      </div>
      {menubar}
      {children}
      {statusbar}
    </div>
  );
}

/* ====================================================================
   WELCOME — the approved "Loïck Rivemale" window (lv2 markup)
   ==================================================================== */
function WelcomeWindow({ onViewWork }) {
  return (
    <div className="w98-window lv2-welcome" onMouseDown={(e) => e.stopPropagation()}
      style={{ boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #dfdfdf, inset -2px -2px 0 #808080, inset 2px 2px 0 #fff, 5px 8px 22px rgba(0,0,0,.45)' }}>
      <WinTitle img="uploads/WelcomeDoor.png" title="Welcome" />
      <div className="lv2-hero">
        <div className="lv2-eyebrow">{'>_'}&nbsp; Engineering &middot; XR &middot; Real-time graphics</div>
        <h1 className="lv2-name">
          <span className="first">Lo&iuml;ck</span>
          <span className="last">Rivemale</span>
          <span className="role">XR Engineer</span>
        </h1>
        <p className="lv2-tag">Building software, crafting shaders, and designing visual experiences with Unity.</p>
        <div className="lv2-cta">
          <button className="w98-btn is-default lv2-btn-main" onClick={onViewWork}>View my work</button>
          <button className="w98-btn lv2-btn-resume">Resume&nbsp;&#8599;</button>
        </div>
      </div>
      <div className="w98-statusbar" style={{ margin: '0 3px 3px' }}>
        <span className="w98-status-cell grow">Ready</span>
        <span className="w98-status-cell">8+ yrs exp.</span>
        <span className="w98-status-cell">Unity</span>
      </div>
    </div>
  );
}

/* ====================================================================
   ANIMOTIVE — project window (player + write-up). Closable.
   layout "side"  → player left (tall), prose right   (personal desktop)
   layout "stack" → player top (16:9), prose below     (work desktop)
   ==================================================================== */
function AnimotiveWindow({ onClose, layout = 'side' }) {
  const side = layout === 'side';
  const prose = (
    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
      <HeaderBlock big />
      <div className="w98-prose" style={{ marginTop: 8 }}><p style={{ marginBottom: 0 }}>{AM.context}</p></div>
      <div className="w98-group" style={{ marginTop: 12 }}>
        <span className="w98-group-title">Accomplishments</span>
        <WorkList />
      </div>
      <h3 style={{ fontSize: 12, fontWeight: 700, margin: '13px 0 7px', color: '#262626' }}>Technologies</h3>
      <TechChips />
    </div>
  );
  return (
    <FlowWindow icon="reel" title="Animotive" onClose={onClose} width={side ? 940 : 620} menubar={<AmMenuBar />}>
      {side ? (
        <div style={{ display: 'flex', gap: 16, padding: '13px 14px 16px' }}>
          <div style={{ flex: '0 0 384px' }}>
            <MediaPlayer ratio="3 / 4" caption="Animotive — demo reel" hint="drop image or embed YouTube" />
          </div>
          {prose}
        </div>
      ) : (
        <div style={{ padding: '13px 14px 16px' }}>
          <MediaPlayer ratio="16 / 9" caption="Animotive — demo reel" hint="drop image or embed YouTube" />
          <div style={{ marginTop: 13 }}>{prose}</div>
        </div>
      )}
    </FlowWindow>
  );
}

/* ====================================================================
   CONTACT — CTA + channel directory. Closable.  (matches about.png)
   ==================================================================== */
function ContactWindow({ onClose }) {
  return (
    <FlowWindow img="uploads/Email.png" title="Contact" onClose={onClose} width={760}>
      <div style={{ display: 'flex', gap: 20, padding: '16px 16px 18px' }}>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 27, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-.4px' }}>{CONTACT.heading}</h1>
          <div className="w98-prose" style={{ marginTop: 11 }}>
            <p style={{ marginBottom: 0 }}>{CONTACT.blurb} {CONTACT.blurb2}</p>
          </div>
          <div style={{ background: SEAL_BG, color: '#fff', padding: '11px 14px', marginTop: 22, maxWidth: 320,
            boxShadow: 'inset -1px -1px 0 #000, inset 1px 1px 0 #5a9fd4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13 }}>
              <span style={{ width: 9, height: 9, background: '#46e36b', boxShadow: 'inset -1px -1px 0 #1b8a36' }} />
              Open to work
            </div>
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, marginTop: 6, letterSpacing: '.5px', opacity: .92 }}>
              Usually replies within a day
            </div>
          </div>
        </div>
        <div style={{ flex: '0 0 286px' }}>
          <div className="w98-group">
            <span className="w98-group-title">Find me on</span>
            <div className="w98-field" style={{ padding: 0 }}>
              {CONTACT.channels.map((c) => (
                <a key={c.label} className="ct-chan" href={c.href}
                  onClick={(e) => { if (c.href === '#') e.preventDefault(); }}
                  target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                  <PixelIcon pattern={CI[c.icon]} size={16} />
                  <span className="ct-lbl">{c.label}</span>
                  <span className="ct-handle">{c.handle}</span>
                  <span className="ct-go">{c.href.startsWith('mailto') ? '\u2709' : '\u2197'}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}

/* ====================================================================
   ABOUT — Spectrum profile window (reuses AboutSplit), bigger frame.
   ==================================================================== */
function AboutWindow() {
  return (
    <div style={{ ['--about-w']: '1040px' }}>
      <AboutSplit wordart="spectrum" />
    </div>
  );
}

/* ====================================================================
   PERSONAL desktop sections — fixed PNG shortcuts down the left edge.
   Click opens that section's window; only one window open at a time.
   ==================================================================== */
const PERSONAL_SECTIONS = [
  { id: 'art',         label: 'Art',              img: 'assets/ic-art.png' },
  { id: 'terrain',     label: 'Terrain Creation', img: 'assets/ic-terrain.png' },
  { id: 'xnoise',      label: 'Xnoise',           img: 'uploads/XnoiseBalanced.png' },
  { id: 'sieurflamme', label: 'Sieur Flamme',     img: 'assets/ic-sieurflamme.png' },
  { id: 'title',       label: 'Title',            img: 'assets/ic-title.png' },
  { id: 'enable',      label: 'Enable',           img: 'assets/ic-enable.png' },
  { id: 'chrome',      label: 'Chrome',           img: 'assets/ic-chrome.png' },
  { id: 'videoplayer', label: 'Video Player',     img: 'uploads/VideoPlayerBalanced-6ddd7913.png' },
];
function PersonalIcons({ onOpen, openId }) {
  return (
    <div style={{ position: 'absolute', top: 40, left: 26, display: 'flex', flexDirection: 'column', gap: 16, zIndex: 4 }}
      onMouseDown={(e) => e.stopPropagation()}>
      {PERSONAL_SECTIONS.map((it) => {
        const on = openId === it.id;
        return (
          <button key={it.id} onClick={() => onOpen(it.id)}
            style={{ all: 'unset', cursor: 'pointer', width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center' }}>
            <span style={{ position: 'relative', width: 50, height: 50, display: 'grid', placeItems: 'center' }}>
              <img src={it.img} alt="" draggable={false} style={{ width: 46, height: 46, filter: on ? 'none' : 'drop-shadow(1px 1px 0 rgba(0,0,0,.4))', opacity: on ? 1 : .96 }} />
              <img src="assets/ic-shortcut-arrow.png" alt="" draggable={false} style={{ position: 'absolute', left: -1, bottom: -1, width: 15, height: 15, imageRendering: 'pixelated' }} />
            </span>
            <span style={{ fontSize: 12, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,.65)', lineHeight: 1.15,
              background: on ? '#000080' : 'transparent', padding: '0 4px', outline: on ? '1px dotted #cdd8ff' : 'none' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* placeholder section window (awaiting per-section content) */
function PersonalWindow({ section, onClose }) {
  return (
    <FlowWindow img={section.img} title={section.label} onClose={onClose} width={560}>
      <div style={{ padding: 12 }}>
        <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
          <div style={{ position: 'relative', aspectRatio: '16 / 9',
            background: 'repeating-linear-gradient(135deg, #11202b 0 8px, #162a38 8px 16px)',
            display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)', pointerEvents: 'none' }} />
            <img src={section.img} alt="" draggable={false} style={{ width: 56, height: 56, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
            <div style={{ position: 'absolute', bottom: 12, fontFamily: '"Courier New", monospace', fontSize: 10, color: '#6fb0c4', textTransform: 'uppercase', letterSpacing: '.5px' }}>[ {section.label} \u2014 content coming ]</div>
          </div>
        </div>
        <h1 style={{ margin: '11px 1px 0', fontSize: 18, fontWeight: 700 }}>{section.label}</h1>
        <div className="w98-prose" style={{ marginTop: 6 }}>
          <p style={{ marginBottom: 0 }}>This section is a placeholder &mdash; drop in the write-up, images, or demo for &ldquo;{section.label}&rdquo; and it will live here.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
          <button className="w98-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </FlowWindow>
  );
}

/* ====================================================================
   PERSONAL PROJECT window — hero render, title + links, technologies
   table, and a screenshots grid. (Art / Terrain / Xnoise / Enable.)
   Placeholder striped renders stand in for real captures.
   ==================================================================== */
function ProjShot({ hue, label, file, dims, tag, big, compact }) {
  const h = hue;
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

/* Win98 image-preview lightbox — fills the current desktop, sized to the
   image's own aspect ratio, never smaller than a sensible minimum. */
function ProjLightbox({ shots, index, setIndex, onClose }) {
  const s = shots[index];
  if (!s) return null;
  const go = (d) => setIndex((index + d + shots.length) % shots.length);
  const tri = (dir) => ({ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
    [dir === 'r' ? 'borderLeft' : 'borderRight']: '9px solid #1d1d1d' });
  /* image aspect from the "W×H" dims string (fallback 16:10) */
  const m = /(\d+)\s*[\u00d7x]\s*(\d+)/.exec(s.dims || '');
  const aspect = m ? Number(m[1]) / Number(m[2]) : 16 / 10;
  /* fit the image into the desk (1920×1080) minus margins + window chrome */
  const DW = 1920, DH = 1080, padX = 64, padY = 48, chromeW = 18, chromeH = 108, MINW = 460;
  const availW = DW - padX * 2 - chromeW;
  const availH = DH - padY * 2 - chromeH;
  let w = availW, h = w / aspect;
  if (h > availH) { h = availH; w = h * aspect; }
  if (w < MINW) { w = Math.min(MINW, availW); h = w / aspect; if (h > availH) { h = availH; w = h * aspect; } }
  w = Math.round(w); h = Math.round(h);
  return (
    <div onMouseDown={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 9000, background: 'rgba(0,0,40,.6)', display: 'grid', placeItems: 'center', padding: `${padY}px ${padX}px` }}>
      <div className="w98 w98-window" style={{ boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #dfdfdf, inset -2px -2px 0 #808080, inset 2px 2px 0 #fff, 4px 6px 22px rgba(0,0,0,.55)' }}
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="w98-titlebar">
          <PixelIcon icon="picture" size={16} className="w98-titlebar-icon" />
          <span className="w98-titlebar-text">Image Preview &mdash; {s.file}</span>
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
        <div style={{ padding: 6 }}>
          <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
            <div style={{ width: w, height: h }}>
              <ProjShot hue={s.hue} label={s.label} file={s.file} dims={s.dims} big />
            </div>
          </div>
          <div className="w98-field" style={{ marginTop: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>{s.label}</span>
            <span style={{ color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace' }}>{s.dims} &middot; {s.file}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectWindow({ proj, onClose, onZoom, stack }) {
  const NOTE_MENUS = ['File', 'Edit', 'View', 'Tools', 'Help'];
  const n = proj.tech.length;
  const noBorderFrom = n - (n % 2 === 0 ? 2 : 1);
  const hasShots = proj.shots && proj.shots.length > 0;
  /* desktop biggest-window behaviour: when there are screenshots and we're not
     in the stacked (phone) layout, the window grows horizontally and the
     screenshots move into a tall column on the RIGHT. Phone keeps top-down. */
  const twoCol = hasShots && !stack;

  const left = (
    <div style={{ flex: twoCol ? '1 1 0' : '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      {/* hero render */}
      <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
        <div style={{ aspectRatio: '16 / 10' }}>
          <ProjShot hue={proj.hero.hue} label={proj.hero.label} file={proj.hero.file} dims={proj.hero.dims} big />
        </div>
      </div>
      {/* title + links */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-.3px' }}>{proj.label}</h1>
          <div style={{ fontSize: 12, color: 'var(--w98-text-dim)', marginTop: 2 }}>{proj.kind}</div>
        </div>
        <div style={{ display: 'flex', gap: 7, flex: '0 0 auto' }}>
          {proj.links.map((l) => (
            <button key={l} className="w98-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px' }}>{l}&nbsp;&#8599;</button>
          ))}
        </div>
      </div>
      {/* description */}
      <div className="w98-prose" style={{ marginTop: 10 }}><p style={{ marginBottom: 0 }}>{proj.desc}</p></div>
      {/* technologies */}
      <div className="w98-group" style={{ marginTop: 14 }}>
        <span className="w98-group-title">Technologies</span>
        <div className="w98-field" style={{ padding: '2px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26 }}>
            {proj.tech.map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px', fontSize: 13,
                borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                <PixelIcon icon="page" size={15} style={{ flex: '0 0 auto' }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const right = hasShots ? (
    <div style={{ flex: twoCol ? '1 1 0' : '0 0 auto', minWidth: 0, display: 'flex', flexDirection: 'column', marginTop: twoCol ? 0 : 14 }}>
      <div className="w98-group" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <span className="w98-group-title">Screenshots</span>
        <div className="w98-sunken" style={{ padding: 8, background: '#fff', flex: '1 1 auto', minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: twoCol ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(4, 1fr)', gap: twoCol ? 10 : 8 }}>
            {proj.shots.map((s, i) => (
              <button key={s.n} onClick={() => onZoom && onZoom(proj.shots, i)} title={s.label}
                className="w98-raised" style={{ all: 'unset', cursor: 'pointer', display: 'block', padding: 3, background: 'var(--w98-face)' }}>
                <div className="w98-sunken" style={{ padding: 2, background: '#000' }}>
                  <div style={{ aspectRatio: '1 / 1' }}>
                    <ProjShot hue={s.hue} label={s.label} tag={s.n} compact />
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
    <FlowWindow img={proj.img} title={proj.win || proj.label} onClose={onClose} width={twoCol ? 1180 : 560}
      style={{ maxHeight: 968, display: 'flex', flexDirection: 'column', position: 'relative' }}
      menubar={
        <div className="w98-menubar">
          {NOTE_MENUS.map((m) => <span key={m} className="w98-menu-item"><u>{m[0]}</u>{m.slice(1)}</span>)}
        </div>
      }>
      <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '12px 14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: twoCol ? 'row' : 'column', gap: twoCol ? 16 : 0, alignItems: 'stretch' }}>
          {left}
          {right}
        </div>
      </div>
    </FlowWindow>
  );
}

/* ====================================================================
   PROJECT "Now Playing" window — tall reel on the LEFT, write-up on the
   RIGHT (title, accomplishments, technologies). Used by Sieur Flamme.
   ==================================================================== */
function ProjectReelWindow({ proj, onClose, stack }) {
  return (
    <FlowWindow img={proj.img} title={proj.win || (proj.label + ' \u2014 Now Playing')} onClose={onClose} width={900}
      style={{ display: 'flex', flexDirection: 'column' }}
      statusbar={
        <div className="w98-statusbar" style={{ margin: '4px 1px 0' }}>
          <span className="w98-status-cell grow">Now playing &mdash; {proj.reelCaption || 'reel'}</span>
          {proj.reelTag1 && <span className="w98-status-cell">{proj.reelTag1}</span>}
          {proj.reelTag2 && <span className="w98-status-cell" style={{ fontWeight: 700 }}>{proj.reelTag2}</span>}
        </div>
      }>
      <div style={{ display: 'flex', flexDirection: stack ? 'column' : 'row', gap: 14, padding: '13px 14px', alignItems: 'stretch' }}>
        {/* left: tall reel */}
        <div style={{ flex: stack ? '0 0 auto' : '0 0 300px', maxWidth: stack ? 300 : 'none', width: stack ? '100%' : 'auto', margin: stack ? '0 auto' : 0 }}>
          <MediaPlayer ratio="9 / 16" caption={proj.label.toUpperCase() + ' \u2014 REEL'} hint="drop 9:16 reel / clip" />
        </div>
        {/* right: write-up */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-.3px' }}>{proj.label}</h1>
          <div style={{ fontSize: 13, color: 'var(--w98-text-dim)', marginTop: 3 }}>{proj.meta}</div>
          <div className="w98-group" style={{ marginTop: 11, flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <span className="w98-group-title">Accomplishments</span>
            <div className="w98-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
              <ul className="w98-bullets" style={{ margin: 0 }}>
                {(proj.accomplishments || []).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
          <div className="w98-group" style={{ marginTop: 12 }}>
            <span className="w98-group-title">Technologies</span>
            <div className="w98-field" style={{ padding: '2px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26 }}>
                {proj.tech.map((t, i) => {
                  const n = proj.tech.length;
                  const noBorderFrom = n - (n % 2 === 0 ? 2 : 1);
                  return (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 2px', fontSize: 13,
                      borderBottom: i < noBorderFrom ? '1px dotted #c4c4c4' : 'none' }}>
                      <PixelIcon icon="page" size={15} style={{ flex: '0 0 auto' }} />
                      <span>{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}
const PERSONAL_PROJECTS = {
  art: {
    img: 'assets/ic-art.png', label: 'Art', win: 'D:\\Art', kind: 'Personal work', links: ['ArtStation', 'Instagram'],
    hero: { label: 'DIGITAL PAINTING', file: 'art_cover.png', dims: '1920\u00d71080', hue: 28 },
    desc: 'Placeholder description for Art \u2014 a running collection of digital paintings, studies and concept work. Swap this for the real blurb about subjects, process and tools.',
    tech: ['Photoshop', 'Krita', 'Procreate', 'Blender'],
    shots: [
      { n: '01', label: 'STUDY', file: 'study_01.png', dims: '1920\u00d71080', hue: 28 },
      { n: '02', label: 'PORTRAIT', file: 'portrait.png', dims: '1280\u00d71600', hue: 12 },
      { n: '03', label: 'LANDSCAPE', file: 'landscape.png', dims: '1920\u00d71080', hue: 96 },
      { n: '04', label: 'CONCEPT', file: 'concept.png', dims: '1920\u00d71080', hue: 320 },
    ],
  },
  terrain: {
    img: 'assets/ic-terrain.png', label: 'Terrain Creation', win: 'D:\\TerrainCreation', kind: 'Personal project', links: ['GitHub', 'itch.io'],
    hero: { label: 'TERRAIN TOOL', file: 'terrain_editor.png', dims: '1920\u00d71080', hue: 130 },
    desc: 'Placeholder description for Terrain Creation \u2014 a procedural terrain authoring tool. Replace with the real write-up: heightmaps, erosion, biome painting and LOD meshing.',
    tech: ['Unity', 'C#', 'Compute', 'HLSL', 'Houdini', 'Burst'],
    shots: [
      { n: '01', label: 'HEIGHTMAP', file: 'heightmap.png', dims: '1024\u00d71024', hue: 130 },
      { n: '02', label: 'EROSION', file: 'erosion.png', dims: '1024\u00d71024', hue: 40 },
      { n: '03', label: 'BIOMES', file: 'biomes.png', dims: '1920\u00d71080', hue: 96 },
      { n: '04', label: 'MESH LOD', file: 'mesh_lod.png', dims: '1920\u00d71080', hue: 200 },
    ],
  },
  xnoise: {
    img: 'uploads/XnoiseBalanced.png', label: 'XNoise', win: 'D:\\Xnoise', kind: 'Personal project', links: ['GitHub', 'itch.io'],
    hero: { label: 'NODAL NOISE EDITOR', file: 'xnoise_editor.png', dims: '1024\u00d71024', hue: 232 },
    desc: 'A nodal noise generation tool for Unity based on a port of libnoise, rewritten entirely in shaders. Supports Perlin, Billow, RidgedMultifractal, Voronoi and exports 2D, spherical, or cylindrical maps.',
    tech: ['Unity', 'C#', 'ShaderLab', 'HLSL', 'xNode', 'WebGL'],
    shots: [
      { n: '01', label: 'PERLIN', file: 'perlin.png', dims: '1024\u00d71024', hue: 232 },
      { n: '02', label: 'BILLOW', file: 'billow.png', dims: '1024\u00d71024', hue: 210 },
      { n: '03', label: 'RIDGED', file: 'ridged.png', dims: '1024\u00d71024', hue: 266 },
      { n: '04', label: 'VORONOI', file: 'voronoi.png', dims: '1024\u00d71024', hue: 140 },
      { n: '05', label: 'SPHERICAL MAP', file: 'spherical.png', dims: '2048\u00d71024', hue: 175 },
      { n: '06', label: 'CYLINDRICAL', file: 'cylindrical.png', dims: '2048\u00d71024', hue: 200 },
    ],
  },
  enable: {
    img: 'assets/ic-enable.png', label: 'Enable', win: 'D:\\Enable', kind: 'Personal project', links: ['GitHub', 'itch.io'],
    hero: { label: 'ENABLE', file: 'enable_cover.png', dims: '1920\u00d71080', hue: 280 },
    desc: 'Placeholder description for Enable \u2014 a personal game project. Replace with the real pitch: the core mechanic, what you built, and what makes it fun.',
    tech: ['Unity', 'C#', 'DOTween', 'FMOD'],
    shots: [
      { n: '01', label: 'LEVEL 01', file: 'level_01.png', dims: '1920\u00d71080', hue: 280 },
      { n: '02', label: 'MECHANIC', file: 'mechanic.png', dims: '1920\u00d71080', hue: 320 },
      { n: '03', label: 'UI', file: 'ui.png', dims: '1920\u00d71080', hue: 210 },
      { n: '04', label: 'BOSS', file: 'boss.png', dims: '1920\u00d71080', hue: 350 },
    ],
  },
  title: {
    img: 'assets/ic-title.png', label: 'Title', win: 'D:\\Title', kind: 'Personal project', links: ['GitHub', 'itch.io'],
    hero: { label: 'TITLE SCREEN', file: 'title_screen.png', dims: '1920\u00d71080', hue: 6 },
    desc: 'Placeholder description for Title \u2014 a small game / branding piece. Replace with the real write-up: the concept, what you built, and the standout details.',
    tech: ['Unity', 'C#', 'Shader Graph', 'DOTween'],
  },
  chrome: {
    img: 'assets/ic-chrome.png', label: 'Chrome', win: 'D:\\Chrome', kind: 'Personal project', links: ['GitHub', 'itch.io'],
    hero: { label: 'CHROME SHADER', file: 'chrome.png', dims: '1024\u00d71024', hue: 210 },
    desc: 'Placeholder description for Chrome \u2014 reflective / metallic shader studies. Replace with the real write-up: the technique, the maths, and where it shipped.',
    tech: ['Unity', 'HLSL', 'ShaderLab', 'URP'],
  },
  sieurflamme: {
    img: 'assets/ic-sieurflamme.png', label: 'Sieur Flamme', win: 'D:\\SieurFlamme', kind: 'Animated series', links: ['YouTube', 'Instagram'],
    meta: 'Animated series \u00b7 8 episodes',
    reelCaption: 'teaser', reelTag1: 'ANIM', reelTag2: '8 eps',
    hero: { label: 'SIEUR FLAMME', file: 'sieur_flamme.png', dims: '1080\u00d71920', hue: 18 },
    desc: 'Placeholder description for Sieur Flamme \u2014 a short animated series. Replace with the real write-up: the premise, the cast, and how the episodes are made.',
    accomplishments: [
      'Wrote, animated, and edited each episode end-to-end in Blender.',
      'Built a reusable character rig and stylised shading setup for the cast.',
      'Designed the title cards, posters and channel branding.',
      'Published the series across YouTube and Instagram.',
    ],
    tech: ['Blender', 'After Effects', 'Premiere', 'Photoshop'],
    shots: [
      { n: '01', label: 'EP 01', file: 'sf_ep01.png', dims: '1080\u00d71920', hue: 18 },
      { n: '02', label: 'EP 02', file: 'sf_ep02.png', dims: '1080\u00d71920', hue: 4 },
      { n: '03', label: 'EP 03', file: 'sf_ep03.png', dims: '1080\u00d71920', hue: 34 },
      { n: '04', label: 'EP 04', file: 'sf_ep04.png', dims: '1080\u00d71920', hue: 280 },
      { n: '05', label: 'CHARACTER', file: 'sf_char.png', dims: '2048\u00d72048', hue: 48 },
      { n: '06', label: 'BACKDROP', file: 'sf_bg.png', dims: '2048\u00d71152', hue: 200 },
      { n: '07', label: 'STORYBOARD', file: 'sf_board.png', dims: '1920\u00d71080', hue: 150 },
      { n: '08', label: 'POSTER', file: 'sf_poster.png', dims: '1080\u00d71528', hue: 320 },
    ],
  },
};

/* ====================================================================
   SIDE-PROJECT window — opens when a personal icon is double-clicked.
   ==================================================================== */
function SideProjectWindow({ id, onClose }) {
  const p = SP.find((x) => x.id === id) || SP[0];
  return (
    <FlowWindow icon={p.icon} title={p.name + ' — Properties'} onClose={onClose} width={460}>
      <div style={{ padding: 10 }}>
        <div className="w98-sunken" style={{ padding: 3, background: '#000' }}>
          <Shot p={p} style={{ aspectRatio: '16 / 9', height: 'auto' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <PixelIcon icon={p.icon} size={48} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' }} />
            </div>
          </Shot>
        </div>
        <div style={{ margin: '10px 1px 2px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{p.name}</h1>
          <span style={{ fontSize: 11, color: 'var(--w98-text-dim)', fontFamily: '"Courier New", monospace', whiteSpace: 'nowrap' }}>{p.tag}</span>
        </div>
        <div className="w98-prose" style={{ marginTop: 2 }}><p style={{ marginBottom: 8 }}>{p.blurb}</p></div>
        <div className="w98-group">
          <span className="w98-group-title">Built with</span>
          <div className="w98-chips">{p.tech.map((t) => <span className="w98-chip" key={t}>{t}</span>)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 11 }}>
          <button className="w98-btn is-default">Visit&nbsp;&#9658;</button>
          <button className="w98-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </FlowWindow>
  );
}

/* ====================================================================
   WORK desktop shortcut icons (real PNGs + shortcut-arrow overlay)
   ==================================================================== */
const WORK_ICONS = [
  { id: 'readme', label: 'Read Me', img: 'assets/ic-readme.png' },
  { id: 'experience', label: 'Professional Experience', img: 'assets/ic-briefcase.png' },
  { id: 'techstack', label: 'Tech Stack', img: 'assets/ic-toolbox.png' },
  { id: 'education', label: 'Education', img: 'assets/ic-studies.png' },
];
/* ====================================================================
   ABOUT desktop shortcut icons (About Me + Contact)
   ==================================================================== */
function AboutIcons({ onOpenContact, contactOn }) {
  const icons = [
    { id: 'about', label: 'About Me', img: 'uploads/Information6.png', on: true, onClick: () => {} },
    { id: 'contact', label: 'Contact', img: 'uploads/Email.png', on: contactOn, onClick: onOpenContact },
  ];
  return (
    <div style={{ position: 'absolute', top: 54, left: 24, display: 'flex', flexDirection: 'column', gap: 24, zIndex: 4 }}
      onMouseDown={(e) => e.stopPropagation()}>
      {icons.map((it) => (
        <button key={it.id} onClick={it.onClick}
          style={{ all: 'unset', cursor: 'pointer', width: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <span style={{ position: 'relative', width: 52, height: 52, display: 'grid', placeItems: 'center' }}>
            {it.img
              ? <img src={it.img} alt="" draggable={false} style={{ width: 48, height: 48, filter: it.on ? 'none' : 'drop-shadow(1px 1px 0 rgba(0,0,0,.4))' }} />
              : <PixelIcon pattern={it.pattern} size={48} />}
            <img src="assets/ic-shortcut-arrow.png" alt="" draggable={false} style={{ position: 'absolute', left: -1, bottom: -1, width: 15, height: 15, imageRendering: 'pixelated' }} />
          </span>
          <span style={{ fontSize: 12, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,.65)', lineHeight: 1.15,
            background: it.on ? '#000080' : 'transparent', padding: '0 4px', outline: it.on ? '1px dotted #cdd8ff' : 'none' }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function WorkIcons({ onLaunch, active }) {
  return (
    <div style={{ position: 'absolute', top: 54, left: 24, display: 'flex', flexDirection: 'column', gap: 24, zIndex: 4 }}
      onMouseDown={(e) => e.stopPropagation()}>
      {WORK_ICONS.map((it) => {
        const on = Array.isArray(active) ? active.indexOf(it.id) !== -1 : active === it.id;
        return (
          <button key={it.id} onClick={() => onLaunch(it.id)}
            style={{ all: 'unset', cursor: 'pointer', width: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
            <span style={{ position: 'relative', width: 52, height: 52, display: 'grid', placeItems: 'center' }}>
              <img src={it.img} alt="" draggable={false} style={{ width: 48, height: 48, filter: on ? 'none' : 'drop-shadow(1px 1px 0 rgba(0,0,0,.4))', opacity: on ? 1 : .96 }} />
              <img src="assets/ic-shortcut-arrow.png" alt="" draggable={false} style={{ position: 'absolute', left: -1, bottom: -1, width: 15, height: 15, imageRendering: 'pixelated' }} />
            </span>
            <span style={{ fontSize: 12, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,.65)', lineHeight: 1.15,
              background: on ? '#000080' : 'transparent', padding: '0 4px', outline: on ? '1px dotted #cdd8ff' : 'none' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ====================================================================
   DRAGGABLE wrapper — move a window by its titlebar, clamped to the
   1920x1080 desktop it lives in. Pointer deltas are divided by the flow
   scale so dragging tracks the cursor 1:1. Press anywhere raises it.
   ==================================================================== */
let FZ_TOP = 30;
function DraggableWindow({ initial, scale, baseZ = 20, deskW = 1920, deskH = 1080, children }) {
  const [pos, setPos] = React.useState({ x: initial.left, y: initial.top });
  const [z, setZ] = React.useState(baseZ);
  const ref = React.useRef(null);
  const sc = React.useRef(scale || 1);
  sc.current = scale || 1;
  const st = React.useRef(null);

  const onMove = React.useCallback((e) => {
    const d = st.current; if (!d) return;
    const s = sc.current || 1;
    const el = ref.current;
    const w = el ? el.offsetWidth : 0, h = el ? el.offsetHeight : 0;
    let nx = d.ox + (e.clientX - d.sx) / s;
    let ny = d.oy + (e.clientY - d.sy) / s;
    nx = Math.max(0, Math.min(nx, deskW - w));
    ny = Math.max(0, Math.min(ny, deskH - h));
    setPos({ x: nx, y: ny });
  }, [deskW, deskH]);

  const onUp = React.useCallback(() => {
    st.current = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    document.body.style.userSelect = '';
  }, [onMove]);

  React.useEffect(() => () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }, [onMove, onUp]);

  const onDownCapture = (e) => {
    setZ(++FZ_TOP);
    const tb = e.target.closest && e.target.closest('.w98-titlebar');
    if (!tb) return;
    if (e.target.closest('.w98-tb-btn') || e.target.closest('a') || e.target.closest('input') || e.target.closest('button')) return;
    st.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    e.preventDefault();
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div ref={ref} onMouseDownCapture={onDownCapture}
      style={{ position: 'absolute', left: pos.x, top: pos.y, zIndex: z }}>
      {children}
    </div>
  );
}

/* ====================================================================
   PERSONAL desktop — one project window at a time, plus a desk-level
   image lightbox so previews can fill the whole desktop.
   ==================================================================== */
function PersonalDesk({ secs, setSecs, deskId, scale }) {
  const openId = secs[0] || null;
  const sec = PERSONAL_SECTIONS.find((s) => s.id === openId);
  const [zoom, setZoom] = React.useState(null);
  React.useEffect(() => { setZoom(null); }, [openId]);
  return (
    <React.Fragment>
      <PersonalIcons onOpen={(id) => setSecs(deskId, [id])} openId={openId} />
      {openId === 'videoplayer' && (
        <DraggableWindow key="videoplayer" scale={scale} initial={{ left: 470, top: 92 }} baseZ={20}>
          <div style={{ width: 940, height: 680 }}><VideosPlayer onClose={() => setSecs(deskId, [])} /></div>
        </DraggableWindow>
      )}
      {sec && openId !== 'videoplayer' && (
        <DraggableWindow key={openId} scale={scale} initial={{ left: 392, top: 96 }} baseZ={20}>
          {openId === 'sieurflamme'
            ? <ProjectReelWindow proj={PERSONAL_PROJECTS[openId]} onClose={() => setSecs(deskId, [])} />
            : PERSONAL_PROJECTS[openId]
              ? <ProjectWindow proj={PERSONAL_PROJECTS[openId]} onClose={() => setSecs(deskId, [])}
                  onZoom={(shots, i) => setZoom({ shots, index: i })} />
              : <PersonalWindow section={sec} onClose={() => setSecs(deskId, [])} />}
        </DraggableWindow>
      )}
      {zoom && (
        <ProjLightbox shots={zoom.shots} index={zoom.index}
          setIndex={(i) => setZoom((z) => ({ ...z, index: i }))} onClose={() => setZoom(null)} />
      )}
    </React.Fragment>
  );
}

/* ====================================================================
   PER-DESKTOP CONTENT
   secs  = open secondary-window ids · close(id)/open(id) · scale = flow scale
   ==================================================================== */
function DeskContent({ desk, secs, open, close, onViewWork, scale, setSecs }) {
  const has = (id) => secs && secs.indexOf(id) !== -1;

  if (desk.id === 'welcome') {
    return (
      <DraggableWindow scale={scale} initial={{ left: 680, top: 318 }} baseZ={20}>
        <WelcomeWindow onViewWork={onViewWork} />
      </DraggableWindow>
    );
  }

  if (desk.id === 'work') {
    const NONPROJ = ['professional', 'techstack', 'education', 'readme'];
    const showReadme = secs.includes('readme');
    const showPro = secs.includes('professional');
    const showTS = secs.includes('techstack');
    const showEd = secs.includes('education');
    const projectId = secs.find((s) => NONPROJ.indexOf(s) === -1) || null;
    const active = showReadme ? 'readme' : showPro ? 'experience' : showTS ? 'techstack' : showEd ? 'education' : null;
    /* only ONE main window at a time; the timeline's detail panel is a child
       of the timeline (opens beside it on desktop, darkened modal on mobile) */
    const launch = (id) => {
      if (id === 'experience') setSecs(desk.id, ['professional']);
      else if (id === 'readme') setSecs(desk.id, ['readme']);
      else setSecs(desk.id, [id]);
    };
    return (
      <React.Fragment>
        <WorkIcons onLaunch={launch} active={active} />
        {showReadme && (
          <DraggableWindow key="readme-main" scale={scale} initial={{ left: 510, top: 80 }} baseZ={20}>
            <ReadmeWindow onClose={() => setSecs(desk.id, [])} />
          </DraggableWindow>
        )}
        {showPro && (
          <DraggableWindow scale={scale} initial={{ left: 150, top: 56 }} baseZ={20}>
            <WorkTimeline selected={projectId} onOpen={(id) => setSecs(desk.id, ['professional', id])} onClose={() => setSecs(desk.id, [])} />
          </DraggableWindow>
        )}
        {showPro && projectId && (
          <DraggableWindow key={projectId} scale={scale} initial={{ left: 952, top: 56 }} baseZ={21}>
            <WorkDetailPanel id={projectId} onClose={() => setSecs(desk.id, ['professional'])} />
          </DraggableWindow>
        )}
        {showTS && (
          <DraggableWindow scale={scale} initial={{ left: 470, top: 56 }} baseZ={20}>
            <div style={{ position: 'relative', width: 1180, height: 944 }}><TechStackWindow /></div>
          </DraggableWindow>
        )}
        {showEd && (
          <DraggableWindow scale={scale} initial={{ left: 360, top: 70 }} baseZ={20}>
            <EducationTimeline onClose={() => setSecs(desk.id, [])} />
          </DraggableWindow>
        )}
      </React.Fragment>
    );
  }

  if (desk.id === 'personal') {
    return <PersonalDesk secs={secs} setSecs={setSecs} deskId={desk.id} scale={scale} />;
  }

  if (desk.id === 'about') {
    return (
      <React.Fragment>
        <AboutIcons onOpenContact={() => open('contact')} contactOn={has('contact')} />
        <DraggableWindow scale={scale} initial={{ left: 300, top: 70 }} baseZ={20}>
          <AboutWindow />
        </DraggableWindow>
        {has('contact') && (
          <DraggableWindow scale={scale} initial={{ left: 360, top: 612 }} baseZ={21}>
            <ContactWindow onClose={() => close('contact')} />
          </DraggableWindow>
        )}
      </React.Fragment>
    );
  }
  return null;
}

Object.assign(window, { FlowWindow, WelcomeWindow, AnimotiveWindow, ContactWindow, AboutWindow, PersonalIcons, PersonalWindow, ProjectWindow, ProjectReelWindow, PERSONAL_PROJECTS, SideProjectWindow, WorkIcons, DraggableWindow, DeskContent, PERSONAL_SECTIONS });
