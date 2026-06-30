/* animotive-about-layouts.jsx — "About Me", three iterations of the
   split-profile direction (photo + content). Win98 navy accent, no orange. */

/* ===== B1 · Classic split — photo left, content right =====
   Optional `wordart` prop swaps the plain heading for a WordArt rendering
   of the slogan, still inside the window frame. */
function AboutSplit({ wordart }) {
  const [ref, narrow] = useNarrow(520);
  const cap = wordart ? wordart[0].toUpperCase() + wordart.slice(1) : null;
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 740 }}>
      <AboutTitleBar title="About Me" />
      <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: 14, padding: '12px 12px 14px' }}>
        <div style={{ flex: narrow ? '0 0 auto' : '0 0 246px' }}>
          <PhotoFrame ratio="3 / 4" badge label="portrait" />
        </div>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          {wordart ? (
            <div style={{ margin: '12px 0 4px' }}>
              <WordArt variant={wordart} size={narrow ? 22 : 28} lines={ABOUT.heading} />
            </div>
          ) : (
            <h1 style={{ margin: '6px 0 0', fontSize: 25, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-.3px' }}>
              {ABOUT.heading[0]}<br />{ABOUT.heading[1]}
            </h1>
          )}
          <div className="w98-prose" style={{ marginTop: 20 }}>
            <p>{ABOUT.blurb}</p>
            <p style={{ marginBottom: 0 }}>{ABOUT.blurb2}</p>
          </div>
          <div className="w98-group" style={{ marginTop: 24 }}>
            <span className="w98-group-title">Tech stack</span>
            <SkillGrid cols={narrow ? 1 : 2} />
          </div>
          <div style={{ marginTop: 13 }}><LinkButtons /></div>
        </div>
      </div>
    </div>
  );
}

/* ===== B2 · Explorer — toolbar links + photo/stat sidebar ===== */
function AboutExplorer() {
  const [ref, narrow] = useNarrow(540);
  const stats = [
    ['Experience', ABOUT.exp + ' years'],
    ['Role', ABOUT.role],
    ['Location', ABOUT.location],
    ['Status', ABOUT.status],
  ];
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 760 }}>
      <AboutTitleBar title="About Me — Profile" />
      {/* links live in the toolbar */}
      <div className="w98-toolbar" style={{ boxShadow: 'inset 0 -1px 0 var(--w98-shadow), inset 0 1px 0 #fff' }}>
        <button className="w98-tool-btn"><PixelIcon icon="page" size={16} className="w98-tool-ico" />R&eacute;sum&eacute;</button>
        <div className="w98-toolbar-sep" />
        <button className="w98-tool-btn"><PixelIcon icon="monitor" size={16} className="w98-tool-ico" />LinkedIn</button>
        <button className="w98-tool-btn"><PixelIcon icon="picture" size={16} className="w98-tool-ico" />Instagram</button>
      </div>
      <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: 14, padding: '12px 12px 12px' }}>
        <div style={{ flex: narrow ? '0 0 auto' : '0 0 214px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PhotoFrame ratio="1 / 1" label="headshot" />
          <div className="w98-field" style={{ padding: '5px 7px' }}>
            <table className="w98-proptable">
              <tbody>
                {stats.map(([k, v]) => (
                  <tr key={k}><td className="k">{k}</td><td className="v" style={k === 'Experience' ? { color: ACCENT, fontWeight: 700 } : null}>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: ACCENT, letterSpacing: '2px' }}>{ABOUT.eyebrow}</div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-.3px' }}>
            {ABOUT.heading[0]}<br />{ABOUT.heading[1]}
          </h1>
          <div className="w98-prose" style={{ marginTop: 10 }}>
            <p>{ABOUT.blurb}</p>
            <p style={{ marginBottom: 0 }}>{ABOUT.blurb2}</p>
          </div>
          <div className="w98-group" style={{ marginTop: 14 }}>
            <span className="w98-group-title">Tech stack</span>
            <SkillGrid cols={narrow ? 1 : 2} />
          </div>
        </div>
      </div>
      <div className="w98-statusbar" style={{ margin: '0 4px 4px' }}>
        <div className="w98-status-cell grow">{ABOUT.role}</div>
        <div className="w98-status-cell">{ABOUT.location}</div>
        <div className="w98-status-cell" style={{ fontWeight: 700 }}>{ABOUT.exp} yrs exp.</div>
      </div>
    </div>
  );
}

/* ===== B3 · Stat ribbon — heading banner, stat strip, split below ===== */
function AboutRibbon() {
  const [ref, narrow] = useNarrow(560);
  const ribbon = [
    [ABOUT.exp + ' yrs', 'experience'],
    ['Unity', 'developer'],
    ['Remote', 'worldwide'],
  ];
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 760 }}>
      <AboutTitleBar title="About Me" />
      <div style={{ padding: '12px 12px 14px' }}>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: ACCENT, letterSpacing: '2px' }}>{ABOUT.eyebrow}</div>
        <h1 style={{ margin: '5px 0 0', fontSize: 27, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-.4px' }}>
          {ABOUT.heading[0]} {ABOUT.heading[1]}
        </h1>
        {/* stat ribbon */}
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 8, margin: '12px 0 4px' }}>
          {ribbon.map(([big, small], i) => (
            <div key={i} className="w98-raised" style={{ padding: '8px 12px', display: 'flex', alignItems: 'baseline', gap: 7 }}>
              <span style={{ fontSize: 19, fontWeight: 700, color: i === 0 ? ACCENT : 'var(--w98-text)', letterSpacing: '-.3px' }}>{big}</span>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--w98-text-dim)' }}>{small}</span>
            </div>
          ))}
        </div>
        <hr className="w98-hr" />
        <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: 14 }}>
          <div style={{ flex: narrow ? '0 0 auto' : '0 0 230px' }}>
            <PhotoFrame ratio="4 / 3" label="portrait" />
          </div>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div className="w98-prose">
              <p>{ABOUT.blurb}</p>
              <p style={{ marginBottom: 10 }}>{ABOUT.blurb2}</p>
            </div>
            <h3 className="w98-prose" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', margin: '0 0 6px', color: '#303030' }}>Tech stack</h3>
            <AboutChips />
          </div>
        </div>
        <div style={{ marginTop: 13 }}><LinkButtons /></div>
      </div>
    </div>
  );
}

Object.assign(window, { AboutSplit, AboutExplorer, AboutRibbon });
