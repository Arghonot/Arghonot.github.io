/* app/legal-window.jsx — LegalWindow ported verbatim from index_old
   (final-windows.jsx). Requires window.FlowWindow (app/contact-window.jsx). */
function LegalWindow({ onClose }) {
  const ORANGE = '#c0641e';
  const NAVY = '#00007b';
  const menubar = (
    <div className="w98-menubar" style={{ padding: '1px 2px 2px' }}>
      {['File', 'Edit', 'Search', 'Help'].map((m) => (
        <div key={m} className="w98-menu-item"><u>{m[0]}</u>{m.slice(1)}</div>
      ))}
    </div>
  );
  const Div = () => <div aria-hidden="true" style={{ color: '#cdcdcd', userSelect: 'none', margin: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>{'\u2500'.repeat(52)}</div>;
  const Head = ({ children }) => <div style={{ color: ORANGE, fontWeight: 700, letterSpacing: '.6px' }}>{children}</div>;
  const Lbl = ({ children }) => <div style={{ fontWeight: 700, color: NAVY, marginTop: 12 }}>{children}</div>;
  const A = ({ href, children }) => (
    <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
      style={{ color: ORANGE, textDecoration: 'underline' }}>{children}</a>
  );
  return (
    <window.FlowWindow img="assets/icons/legal.png" title="Legal Information — Notepad" onClose={onClose} width={520} menubar={menubar}>
      <div className="w98-field" style={{ margin: '0 3px 3px', padding: '14px 16px 16px', height: 452, overflowY: 'auto',
        fontFamily: '"Courier New", monospace', fontSize: 12.5, lineHeight: 1.6, color: '#1d1d1d' }}>
        <div style={{ color: ORANGE }}>{'>_'} LEGAL_INFORMATION.TXT</div>

        <Div />
        <Head>Website Publisher</Head>
        <div style={{ marginTop: 8 }}>Lo&iuml;ck Rivemale</div>
        <div style={{ color: '#6a6a6a' }}>Independent Unity XR &amp; Rendering Engineer</div>
        <Lbl>Email</Lbl>
        <div><A href="mailto:lo.rivemale@gmail.com">lo.rivemale@gmail.com</A></div>
        <Lbl>Website</Lbl>
        <div><A href="https://loick.rivemale.space">https://loick.rivemale.space</A></div>
        <Lbl>Publication Director</Lbl>
        <div>Lo&iuml;ck Rivemale</div>
        <Lbl>Hosting</Lbl>
        <div>This website is hosted by GitHub Pages.</div>
        <div style={{ marginTop: 8, color: '#4a4a4a' }}>
          GitHub, Inc.<br />88 Colin P. Kelly Jr. Street<br />San Francisco, CA 94107<br />United States
        </div>

        <Div />
        <Head>INTELLECTUAL PROPERTY</Head>
        <p style={{ margin: '9px 0 0' }}>Unless otherwise stated, all content available on this website is the intellectual property of Lo&iuml;ck Rivemale.</p>
        <p style={{ margin: '9px 0 0' }}>This includes but is not limited to:</p>
        <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
          {['Source code', 'Technical articles', 'Documentation', 'Graphics', 'Icons', 'Videos', 'Shaders', 'Renderings', 'Photographs', '3D assets created specifically for this portfolio'].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p style={{ margin: '9px 0 0' }}>Third-party trademarks, logos and company names remain the property of their respective owners and are used only to identify past professional experience.</p>

        <Div />
        <Head>PRIVACY</Head>
        <p style={{ margin: '9px 0 0' }}>This website does not intentionally collect personal data.</p>
        <p style={{ margin: '9px 0 0' }}>No user account is required.</p>
        <p style={{ margin: '9px 0 0' }}>If you contact me by email, the information you provide will only be used to answer your request.</p>

        <Div />
        <Head>COOKIES</Head>
        <p style={{ margin: '9px 0 0' }}>This website does not use cookies for advertising purposes.</p>
        <p style={{ margin: '9px 0 0' }}>If analytics or other third-party services are enabled in the future, this document will be updated accordingly.</p>

        <Div />
        <Head>LIABILITY</Head>
        <p style={{ margin: '9px 0 0' }}>The information presented on this website is provided for informational purposes only.</p>
        <p style={{ margin: '9px 0 0' }}>While every effort is made to keep the information accurate, no guarantee is given regarding completeness or accuracy.</p>

        <Div />
        <Head>CONTACT</Head>
        <Lbl>Email</Lbl>
        <div><A href="mailto:lo.rivemale@gmail.com">lo.rivemale@gmail.com</A></div>
        <Lbl>LinkedIn</Lbl>
        <div><A href="https://www.linkedin.com/in/loick-rivemale-080b9789">linkedin.com/in/loick-rivemale-080b9789</A></div>
        <Lbl>GitHub</Lbl>
        <div><A href="https://github.com/Arghonot">https://github.com/Arghonot</A></div>
        <Lbl>Instagram</Lbl>
        <div><A href="https://www.instagram.com/argrafix">instagram.com/argrafix</A></div>

        <Div />
        <div style={{ color: '#6a6a6a' }}>Last updated:</div>
        <div>July 2026</div>
      </div>
    </window.FlowWindow>
  );
}

Object.assign(window, { LegalWindow });
