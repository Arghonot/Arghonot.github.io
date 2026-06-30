/* animotive-contact.jsx — "04 >_ Contact", Win98 contact proposals.
   No message forms: channels are links (Email opens the viewer's mailbox via
   mailto). Reuses animotive.jsx (useNarrow, PixelIcon) + animotive-about.jsx
   (ACCENT, SEAL_BG). Exports to window. */

/* ---- supplemental styles ---- */
(function () {
  if (document.getElementById('ct-styles')) return;
  const s = document.createElement('style');
  s.id = 'ct-styles';
  s.textContent = `
  /* channel row (white field list) */
  .ct-chan{display:flex;align-items:center;gap:9px;padding:8px 9px;cursor:pointer;
    text-decoration:none;color:inherit;}
  .ct-chan + .ct-chan{border-top:1px dotted #b3b3b3;}
  .ct-chan:hover,.ct-chan:focus{background:#000080;color:#fff;outline:none;}
  .ct-chan:hover .ct-handle,.ct-chan:focus .ct-handle{color:#c7d2ff;}
  .ct-chan .ct-lbl{font-weight:700;}
  .ct-chan .ct-handle{margin-left:auto;font-family:"Courier New",monospace;font-size:10.5px;color:var(--w98-text-dim);}
  .ct-chan .ct-go{margin-left:8px;font-size:12px;opacity:.6;}
  .ct-chan:hover .ct-go{opacity:1;}
  /* desktop shortcut */
  .ct-shortcut{display:flex;flex-direction:column;align-items:center;gap:7px;padding:9px 4px;
    text-decoration:none;cursor:pointer;}
  .ct-shortcut-lbl{font-size:11px;color:#fff;text-align:center;padding:1px 5px;line-height:1.2;
    text-shadow:1px 1px 0 rgba(0,0,0,.5);}
  .ct-shortcut:hover .ct-shortcut-lbl,.ct-shortcut:focus .ct-shortcut-lbl{
    background:#000080;text-shadow:none;outline:1px dotted #cdd8ff;}
  /* launcher button (anchor styled as w98-btn) */
  .ct-launch{display:flex;align-items:center;gap:11px;text-align:left;text-decoration:none;color:var(--w98-text);}
  .ct-launch .ext{margin-left:auto;color:var(--w98-text-dim);font-size:13px;}
  .ct-launch.is-default .ext{color:#fff;}
  .ct-openbtn{text-decoration:none;color:var(--w98-text);}
  /* terminal */
  .ct-term{background:#06120a;color:#39d353;font-family:"Courier New",monospace;font-size:12.5px;line-height:1.6;}
  .ct-term-in{background:transparent;border:0;outline:none;color:#9dffbd;font-family:"Courier New",monospace;
    font-size:12.5px;caret-color:#39d353;padding:0;flex:1 1 auto;min-width:0;}
  .ct-term-in::placeholder{color:#3f6f4f;}
  .ct-termbtn{display:inline-block;border:1px solid #39d353;color:#39d353;background:transparent;
    padding:4px 14px;font-family:"Courier New",monospace;font-size:12px;letter-spacing:1px;cursor:pointer;}
  .ct-termbtn:hover{background:#39d353;color:#06120a;}
  .ct-termlink{color:#7fe7a0;cursor:pointer;text-decoration:none;}
  .ct-termlink:hover{color:#9dffbd;text-decoration:underline;}
  `;
  document.head.appendChild(s);
})();

/* ---- channel pixel icons ---- */
const CI = {
  mail: [
    '                ', '                ', '  kkkkkkkkkkk   ', '  kwwwwwwwwwk   ',
    '  kwkwwwwwkwk   ', '  kwwkwwwkwwk   ', '  kwwwkkkwwwk   ', '  kwwwwwwwwwk   ',
    '  kwwwwwwwwwk   ', '  kkkkkkkkkkk   ', '                ', '                ',
    '                ', '                ', '                ', '                ',
  ],
  term: [
    '                ', '  kkkkkkkkkkkk  ', '  kZZZZZZZZZZk  ', '  kZeeZZZZZZZk  ',
    '  kZeeeZZZZZZk  ', '  kZeeeeZiiZk   ', '  kZeeeZZZZZZk  ', '  kZeeZZZZZZZk  ',
    '  kZZZZZZZZZZk  ', '  kkkkkkkkkkkk  ', '                ', '                ',
    '                ', '                ', '                ', '                ',
  ],
  cam: [
    '                ', '      kkk       ', '   kkkmmmkkk    ', '  kmmmmmmmmmmk  ',
    '  km  kkk   mk  ', '  km kbbbk  mk  ', '  km kbiibk mk  ', '  km kbbbk  mk  ',
    '  km  kkk   mk  ', '  kmmmmmmmmmmk  ', '  kkkkkkkkkkkk  ', '                ',
    '                ', '                ', '                ', '                ',
  ],
  badge: [
    '                ', '  kkkkkkkkkkkk  ', '  kwwwwwwwwwwk  ', '  kwkkwwwwwwwk  ',
    '  kwbbkwwnnnwk  ', '  kwbbkwwwwwwk  ', '  kwkkkwwnnnwk  ', '  kwbbbbwwwwwk  ',
    '  kwbbbbwwnnwk  ', '  kwwwwwwwwwwk  ', '  kkkkkkkkkkkk  ', '                ',
    '                ', '                ', '                ', '                ',
  ],
  user: [
    '                ', '      kkk       ', '     kbbbk      ', '     kbbbk      ',
    '     kbbbk      ', '      kbk       ', '    kkbbbkk     ', '   kbbbbbbbk    ',
    '   kbbbbbbbk    ', '   kbbbbbbbk    ', '   kbbbbbbbk    ', '   kbbbbbbbk    ',
    '                ', '                ', '                ', '                ',
  ],
};

const CONTACT = {
  eyebrow: '04 >_ CONTACT',
  heading: "Let's build something together",
  blurb: 'Open to freelance projects, full-time roles, and interesting collaborations.',
  blurb2: 'Every side project on my GitHub is open — feel free to explore.',
  channels: [
    { label: 'Email', icon: 'mail', handle: 'you@email.com', href: 'mailto:you@email.com' },
    { label: 'GitHub', icon: 'term', handle: 'github.com/username', href: '#' },
    { label: 'Instagram', icon: 'cam', handle: '@username', href: '#' },
    { label: 'LinkedIn', icon: 'badge', handle: 'in/username', href: '#' },
  ],
};
const stop = (href) => (e) => { if (href === '#') e.preventDefault(); };

/* ---- reusable bits ---- */
function ContactTitleBar({ title, icon = 'mail' }) {
  const Btn = ({ glyph, label }) => (
    <button className="w98-tb-btn" aria-label={label}><span className="w98-tb-glyph">{glyph}</span></button>
  );
  return (
    <div className="w98-titlebar">
      <PixelIcon pattern={CI[icon]} size={16} className="w98-titlebar-icon" />
      <span className="w98-titlebar-text">{title}</span>
      <div className="w98-titlebar-btns">
        <Btn label="minimize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>} />
        <Btn label="maximize" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>} />
        <Btn label="close" glyph={<svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>} />
      </div>
    </div>
  );
}
function Eyebrow() {
  return <div style={{ fontFamily: '"Courier New", monospace', fontSize: 11, color: ACCENT, letterSpacing: '2px' }}>{CONTACT.eyebrow}</div>;
}
function Heading({ size = 23 }) {
  return <h1 style={{ margin: '7px 0 0', fontSize: size, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-.3px' }}>{CONTACT.heading}</h1>;
}
function Blurb({ both = true }) {
  return (
    <div className="w98-prose" style={{ marginTop: 9 }}>
      <p style={{ marginBottom: 0 }}>{CONTACT.blurb}{both ? ' ' + CONTACT.blurb2 : ''}</p>
    </div>
  );
}
function OpenToWork() {
  return (
    <div style={{ background: SEAL_BG, color: '#fff', padding: '10px 12px',
      boxShadow: 'inset -1px -1px 0 #000, inset 1px 1px 0 #5a9fd4' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 12 }}>
        <span style={{ width: 8, height: 8, background: '#46e36b', boxShadow: 'inset -1px -1px 0 #1b8a36' }} />
        Open to work
      </div>
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10, marginTop: 5, letterSpacing: '.5px', opacity: .9 }}>
        Usually replies within a day
      </div>
    </div>
  );
}
function ChannelList() {
  return (
    <div className="w98-field" style={{ padding: 0 }}>
      {CONTACT.channels.map((c) => (
        <a key={c.label} className="ct-chan" href={c.href} onClick={stop(c.href)}
          target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
          <PixelIcon pattern={CI[c.icon]} size={16} />
          <span className="ct-lbl">{c.label}</span>
          <span className="ct-handle">{c.handle}</span>
          <span className="ct-go">{c.href.startsWith('mailto') ? '✉' : '↗'}</span>
        </a>
      ))}
    </div>
  );
}

/* ===== B · Contact card — CTA + channel directory (no form) ===== */
function ContactCard() {
  const [ref, narrow] = useNarrow(560);
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 720 }}>
      <ContactTitleBar title="Contact" />
      <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: 16, padding: '13px 13px 15px' }}>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <Eyebrow />
          <Heading />
          <Blurb />
          <a className="w98-btn is-default" href="mailto:you@email.com"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '8px 16px', textDecoration: 'none' }}>
            <PixelIcon pattern={CI.mail} size={16} />Send me an email
          </a>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10.5, color: 'var(--w98-text-dim)', marginTop: 9 }}>
            opens your mail app · you@email.com
          </div>
        </div>
        <div style={{ flex: narrow ? '0 0 auto' : '0 0 262px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="w98-group">
            <span className="w98-group-title">Find me on</span>
            <ChannelList />
          </div>
          <OpenToWork />
        </div>
      </div>
    </div>
  );
}

/* ===== D · Desktop shortcuts — channels as double-click icons on a teal desktop ===== */
function ContactDesktop() {
  const [ref, narrow] = useNarrow(520);
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 640 }}>
      <ContactTitleBar title="Contact — Shortcuts" />
      <div style={{ padding: '12px 13px 13px' }}>
        <Eyebrow />
        <Heading size={20} />
        <Blurb />
        <div className="w98-sunken" style={{ background: '#008080', padding: 16, marginTop: 13, position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 8 }}>
            {CONTACT.channels.map((c) => (
              <a key={c.label} className="ct-shortcut" href={c.href} onClick={stop(c.href)}
                target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                <span className="w98-raised" style={{ width: 54, height: 54, display: 'grid', placeItems: 'center' }}>
                  <PixelIcon pattern={CI[c.icon]} size={36} />
                </span>
                <span className="ct-shortcut-lbl">{c.label}</span>
              </a>
            ))}
          </div>
          <div style={{ position: 'absolute', right: 9, bottom: 5, fontFamily: '"Courier New", monospace', fontSize: 9, color: '#bfeee6', letterSpacing: '.5px' }}>
            double-click to open
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== E · Quick Launch — four big launcher buttons (Email primary) ===== */
function ContactLauncher() {
  const [ref, narrow] = useNarrow(480);
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 600 }}>
      <ContactTitleBar title="Contact" />
      <div style={{ padding: '13px 13px 15px' }}>
        <Eyebrow />
        <Heading />
        <Blurb />
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 9, marginTop: 15 }}>
          {CONTACT.channels.map((c, i) => (
            <a key={c.label} className={'w98-btn ct-launch' + (i === 0 ? ' is-default' : '')}
              href={c.href} onClick={stop(c.href)}
              target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
              style={{ padding: '11px 13px', minWidth: 0 }}>
              <PixelIcon pattern={CI[c.icon]} size={26} />
              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{c.label}</span>
                <span style={{ fontFamily: '"Courier New", monospace', fontSize: 10.5, color: i === 0 ? 'inherit' : 'var(--w98-text-dim)', opacity: i === 0 ? .85 : 1 }}>{c.handle}</span>
              </span>
              <span className="ext">{c.href.startsWith('mailto') ? '✉' : '↗'}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== F · Contact Properties — tabbed dialog + channel property rows ===== */
function ContactProps() {
  const [ref] = useNarrow(440);
  const [tab, setTab] = React.useState('Summary');
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 470 }}>
      <ContactTitleBar title="Contact Properties" icon="user" />
      <div style={{ padding: '10px 12px 12px' }}>
        <div className="w98-tabs">
          {['Summary', 'Details'].map((t) => (
            <div key={t} className={'w98-tab' + (tab === t ? ' is-active' : '')} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>
        <div className="w98-tabpane">
          {tab === 'Summary' ? (
            <React.Fragment>
              <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <div className="w98-raised" style={{ flex: '0 0 60px', width: 60, height: 60, display: 'grid', placeItems: 'center' }}>
                  <PixelIcon pattern={CI.user} size={40} />
                </div>
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Eyebrow />
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.2px', marginTop: 4, lineHeight: 1.12 }}>{CONTACT.heading}</div>
                </div>
              </div>
              <div className="w98-prose" style={{ marginTop: 11 }}>
                <p style={{ marginBottom: 0 }}>{CONTACT.blurb} {CONTACT.blurb2}</p>
              </div>
              <div className="w98-statusbar" style={{ marginTop: 13 }}>
                <div className="w98-status-cell grow">Status</div>
                <div className="w98-status-cell" style={{ fontWeight: 700, color: ACCENT }}>Open to work</div>
              </div>
            </React.Fragment>
          ) : (
            <div className="w98-group" style={{ marginTop: 4 }}>
              <span className="w98-group-title">Channels</span>
              <table className="w98-proptable" style={{ width: '100%' }}>
                <tbody>
                  {CONTACT.channels.map((c) => (
                    <tr key={c.label}>
                      <td className="k" style={{ verticalAlign: 'middle' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <PixelIcon pattern={CI[c.icon]} size={16} />{c.label}
                        </span>
                      </td>
                      <td className="v" style={{ verticalAlign: 'middle', fontFamily: '"Courier New", monospace', fontSize: 10.5 }}>{c.handle}</td>
                      <td style={{ width: '1%', textAlign: 'right', verticalAlign: 'middle' }}>
                        <a className="w98-btn w98-btn-sm ct-openbtn" href={c.href} onClick={stop(c.href)}
                          target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">Open</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== C · contact.exe — CRT terminal console (kept) ===== */
function ContactTerminal() {
  const [ref, narrow] = useNarrow(520);
  const Line = ({ label, placeholder, type = 'text' }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
      <span style={{ color: '#5fbf7a', whiteSpace: 'nowrap' }}>C:\contact&gt; {label}</span>
      <input className="ct-term-in" type={type} placeholder={placeholder} />
    </div>
  );
  return (
    <div ref={ref} className="w98 w98-window" style={{ width: '100%', maxWidth: 560 }}>
      <ContactTitleBar title="C:\WINDOWS\contact.exe" icon="term" />
      <div style={{ padding: 4 }}>
        <div className="w98-sunken ct-term" style={{ padding: '14px 16px' }}>
          <div style={{ color: '#7fe7a0', letterSpacing: '2px' }}>{CONTACT.eyebrow}</div>
          <div style={{ color: '#eafff0', marginTop: 8, fontSize: 14 }}>&gt; {CONTACT.heading}</div>
          <div style={{ color: '#8fbf9e', marginTop: 6 }}>{CONTACT.blurb}</div>
          <div style={{ color: '#8fbf9e' }}>{CONTACT.blurb2}</div>
          <div style={{ height: 12 }} />
          <Line label="name&nbsp;&nbsp;&nbsp;:" placeholder="Ada Lovelace" />
          <Line label="email&nbsp;&nbsp;:" placeholder="ada@email.com" type="email" />
          <div style={{ marginTop: 8, color: '#5fbf7a' }}>C:\contact&gt; message --body</div>
          <textarea className="ct-term-in" rows={3} placeholder="type your message here…"
            style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 4, resize: 'none',
              borderLeft: '2px solid #1f5f33', paddingLeft: 8, lineHeight: 1.5 }} />
          <div style={{ marginTop: 12 }}>
            <button className="ct-termbtn">[ SEND MESSAGE ]</button>
            <span style={{ color: '#39d353', marginLeft: 8 }}>_</span>
          </div>
          <div style={{ marginTop: 14, color: '#4f8f63' }}>
            open &gt;&nbsp;{' '}
            {CONTACT.channels.map((c, i) => (
              <React.Fragment key={c.label}>
                {i > 0 && <span style={{ color: '#2f5f3f' }}> · </span>}
                <a className="ct-termlink" href={c.href} onClick={stop(c.href)}
                  target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">{c.label.toLowerCase()}</a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CONTACT, CI, ContactCard, ContactDesktop, ContactLauncher, ContactProps, ContactTerminal });
