/* app/contact-window.jsx — ContactWindow ported verbatim from index_old
   (animotive-contact.jsx CI/CONTACT + animotive-about.jsx SEAL_BG +
   final-windows.jsx TBG/FlowWindow/ContactWindow). Requires app/pixel-icons.jsx. */

const SEAL_BG = 'linear-gradient(90deg, #00007b 0%, #1083d4 100%)';

const TBG = {
  min: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="6" width="6" height="2" fill="#000" /></svg>,
  max: <svg width="8" height="8" viewBox="0 0 8 8"><rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke="#000" /><rect x="0.5" y="0.5" width="7" height="2" fill="#000" /></svg>,
  close: <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#000" strokeWidth="1.3" /></svg>,
};

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
  doc: [
    '                ', '   kkkkkkkk     ', '   kwwwwwwkk    ', '   kwbbbbwkwk   ',
    '   kwwwwwwkkk   ', '   kwbbbbwwwk   ', '   kwwwwwwwwk   ', '   kwbbbwwwwk   ',
    '   kwwwwwwwwk   ', '   kwbbwwwwwk   ', '   kwwwwwwwwk   ', '   kkkkkkkkkk   ',
    '                ', '                ', '                ', '                ',
  ],
};

const CONTACT = {
  eyebrow: '04 >_ CONTACT',
  heading: "Let's build something together",
  blurb: 'Open to freelance projects, full-time roles, and interesting collaborations.',
  blurb2: 'Every side project on my GitHub is open — feel free to explore.',
  channels: [
    { label: 'Email', icon: 'mail', handle: 'lo.rivemale@gmail.com', href: 'mailto:lo.rivemale@gmail.com' },
    { label: 'GitHub', icon: 'term', handle: 'github.com/Arghonot', href: 'https://github.com/Arghonot' },
    { label: 'Instagram', icon: 'cam', handle: '@argrafix', href: 'https://www.instagram.com/argrafix' },
    { label: 'LinkedIn', icon: 'badge', handle: 'in/loick-rivemale', href: 'https://www.linkedin.com/in/loick-rivemale-080b9789' },
  ],
};

function FlowWindow({ icon, pattern, img, title, onClose, menubar, statusbar, width, style, className, children }) {
  return (
    <div className={'w98 w98-window' + (className ? ' ' + className : '')} style={{ width, boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #dfdfdf, inset -2px -2px 0 #808080, inset 2px 2px 0 #fff, 4px 6px 18px rgba(0,0,0,.45)', ...(style || {}) }}
      onMouseDown={(e) => e.stopPropagation()}>
      <div className="w98-titlebar">
        {pattern
          ? <window.PixelIcon pattern={pattern} size={16} className="w98-titlebar-icon" />
          : img
            ? <img src={img} alt="" className="w98-titlebar-icon" style={{ width: 16, height: 16 }} />
            : icon && <window.PixelIcon icon={icon} size={16} className="w98-titlebar-icon" />}
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
   CONTACT — CTA + channel directory. Closable.  (matches about.png)
   ==================================================================== */
function ContactWindow({ onClose }) {
  return (
    <FlowWindow img="assets/icons/email.png" title="Contact" onClose={onClose} width={1000}>
      <div className="ct-layout" style={{ display: 'flex', gap: 20, padding: '16px 16px 18px' }}>
        <div className="ct-main" style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h1 className="ct-heading" style={{ margin: 0, fontSize: 37, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-.4px' }}>{CONTACT.heading}</h1>
          <div className="w98-prose ct-blurb" style={{ marginTop: 11 }}>
          </div>
          <p style={{ marginBottom: 0, fontSize: 15.5, marginTop: 37 }}>{CONTACT.blurb} {CONTACT.blurb2}</p>
          <a className="d98-taskbtn ct-resume-btn" href="files/resume-loick-rivemale.pdf" target="_blank" rel="noreferrer"
            style={{ flex: '0 0 auto', width: 351, maxWidth: 320, marginTop: 37, cursor: 'pointer', height: 54, background: 'linear-gradient(90deg, #1b3a8c, #1083d4)', color: '#fff', textDecoration: 'none' }}
            onMouseDown={(e) => e.currentTarget.classList.add('is-active')}
            onMouseUp={(e) => e.currentTarget.classList.remove('is-active')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('is-active')}>
            <img className="ico" src="assets/icons/readme.png" alt="" />
            <span>See my résumé</span>
            <span style={{ marginLeft: 'auto', fontSize: 18 }}>{'\u2192'}</span>
          </a>
        </div>
        <div className="ct-side" style={{ flex: '0 0 286px' }}>
          <div className="w98-group">
            <span className="w98-group-title"><span style={{ position: 'relative', top: -4 }}>Find me on</span></span>
            <div className="w98-field" style={{ padding: 0 }}>
              {CONTACT.channels.map((c) => (
                <a key={c.label} className="ct-chan" href={c.href} style={{ height: 45 }}
                  onClick={(e) => { if (c.href === '#') e.preventDefault(); }}
                  target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                  <window.PixelIcon pattern={CI[c.icon]} size={16} style={{ marginLeft: 10 }} />
                  <span className="ct-lbl">{c.label}</span>
                  <span className="ct-handle" style={{ fontSize: 10 }}>{c.handle}</span>
                  <span className="ct-go" style={{ marginRight: 10 }}>{'\u2197'}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FlowWindow>
  );
}

Object.assign(window, { ContactWindow, FlowWindow });
