/* pixel-icons.jsx — canvas pixel-art renderer + icon patterns.
   Exposes window.PixelIcon and window.ICONS. */
(function () {
  const PALETTE = {
    ' ': null,            // transparent
    '.': null,
    k: '#0b1418',         // near-black outline
    d: '#3a3a3a',
    g: '#808080',
    s: '#c0c0c0',
    w: '#ffffff',
    // dragonfly
    K: '#0b2a38',         // steel outline
    B: '#1f6f8b',         // body steel-teal
    L: '#46bccd',         // body light
    C: '#c4ecf5',         // wing fill (light cyan)
    V: '#79bdcf',         // wing vein
    E: '#e2f7ff',         // eye light
    O: '#ff8a3c',         // orange sensor accent
    // ui icons
    y: '#f7d04a', Y: '#bf9620',          // folder
    b: '#1083d4', n: '#00007b',          // screen blue / navy
    e: '#2f9b46',                         // green
    p: '#3a7a4a',                         // mountain green
    r: '#c83737',                         // red
    // extended (desktop project icons)
    a: '#d9a94e', A: '#9c7322',           // planet gold / ring
    q: '#b574e6', Q: '#6a2f9e',           // wire purple / dark
    m: '#d24d9c', j: '#3fa85f', t: '#2bb6b6', // node magenta / green / teal
    z: '#5a6470', Z: '#2e353d',           // metal slate / dark slate
    i: '#9fe3ff',                         // bright cyan signal
    o: '#e8b84a',                         // amber/bolt
  };

  function PixelIcon({ icon, pattern, palette, scale = 1, size, style, className }) {
    const ref = React.useRef(null);
    const rows = pattern || (window.ICONS && window.ICONS[icon]) || [];
    const pal = Object.assign({}, PALETTE, palette || {});
    const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);
    const h = rows.length;
    React.useEffect(() => {
      const cv = ref.current; if (!cv) return;
      cv.width = cols; cv.height = h;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cols, h);
      for (let y = 0; y < h; y++) {
        const row = rows[y] || '';
        for (let x = 0; x < cols; x++) {
          const c = pal[row[x]];
          if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
        }
      }
    }, [rows, cols, h]);
    const w = size != null ? size : cols * scale;
    const hh = size != null ? size * (h / cols) : h * scale;
    return React.createElement('canvas', {
      ref,
      className,
      style: Object.assign({
        width: w, height: hh,
        imageRendering: 'pixelated',
        display: 'block',
      }, style || {}),
    });
  }

  const ICONS = {
    // ---- HERO: mechanical dragonfly (16x16, head up, 4 wings, sensor core) ----
    dragonfly: [
      '                ',
      '      KEEK      ',
      '      EBBE      ',
      '       BB       ',
      '   KK  BB  KK   ',
      '  KCCK BB KCCK  ',
      ' KCCCK OB KCCCK ',
      ' KCCK  BB  KCCK ',
      '   K   BB   K   ',
      '  KCCK LL KCCK  ',
      ' KCCCK LL KCCCK ',
      '  KCK  LL  KCK  ',
      '       BB       ',
      '       LL       ',
      '       BB       ',
      '       BK       ',
    ],
    // ---- system icons (16x16) ----
    back: [
      '                ',
      '                ',
      '                ',
      '       e        ',
      '      ee        ',
      '     eee        ',
      '    eeee eeee   ',
      '   eeeeeeeeee   ',
      '   eeeeeeeeee   ',
      '    eeee eeee   ',
      '     eee        ',
      '      ee        ',
      '       e        ',
      '                ',
      '                ',
      '                ',
    ],
    folder: [
      '                ',
      '                ',
      '  YYYY          ',
      ' YyyyyY         ',
      ' yyyyyyYYYYYYY  ',
      ' yyyyyyyyyyyyyY ',
      ' yyyyyyyyyyyyyY ',
      ' yyyyyyyyyyyyyY ',
      ' yyyyyyyyyyyyyY ',
      ' yyyyyyyyyyyyyY ',
      ' YYYYYYYYYYYYYY ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
    ],
    page: [
      '                ',
      '   kkkkkkkk     ',
      '   kwwwwwwwk    ',
      '   kwwwwwwwk    ',
      '   kwgggggwk    ',
      '   kwwwwwwwk    ',
      '   kwgggggwk    ',
      '   kwwwwwwwk    ',
      '   kwgggggwk    ',
      '   kwwwwwwwk    ',
      '   kwgggggwk    ',
      '   kwwwwwwwk    ',
      '   kkkkkkkkk    ',
      '                ',
      '                ',
      '                ',
    ],
    monitor: [
      '                ',
      '  kkkkkkkkkkk   ',
      '  kbbbbbbbbbk   ',
      '  kbbwbbbbbbk   ',
      '  kbbwwbbbbbk   ',
      '  kbbwwwbbbbk   ',
      '  kbbwwwwbbbk   ',
      '  kbbwwwbbbbk   ',
      '  kbbwwbbbbbk   ',
      '  kbbwbbbbbbk   ',
      '  kbbbbbbbbbk   ',
      '  kkkkkkkkkkk   ',
      '     kkkkk      ',
      '    kkkkkkk     ',
      '                ',
      '                ',
    ],
    picture: [
      '                ',
      '  kkkkkkkkkkk   ',
      '  kwwwwwwwwwk   ',
      '  kwwwOOwwwwk   ',
      '  kwwwOOwwwwk   ',
      '  kwwwwwwwppk   ',
      '  kwwwwwwpppk   ',
      '  kwwwwppppppk  ',
      '  kwwpppppppk   ',
      '  kpppppppppk   ',
      '  kkkkkkkkkkk   ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
    ],
    info: [
      '     kkkkkk     ',
      '   kkbbbbbbkk   ',
      '  kbbbwwwbbbbk  ',
      '  kbbbwwwbbbbk  ',
      '  kbbbbbbbbbbk  ',
      '  kbbwwwwwbbbk  ',
      ' kbbbbwwwbbbbbk ',
      ' kbbbbwwwbbbbbk ',
      ' kbbbbwwwbbbbbk ',
      '  kbbbwwwwwbbk  ',
      '  kbbbbbbbbbbk  ',
      '   kbbbbbbbbk   ',
      '    kkbbbbkk    ',
      '      kkkk      ',
      '                ',
      '                ',
    ],
    gizmo: [   // small VR/3D move-gizmo for the tree
      '       e        ',
      '      eee       ',
      '       e        ',
      '       e        ',
      '       e        ',
      '       O        ',
      ' rrrrrrObbbbbb  ',
      'rrrrrrrObbbbbbb ',
      ' rrrrrrObbbbbb  ',
      '       O        ',
      '       p        ',
      '      ppp        ',
      '     p p p       ',
      '                ',
      '                ',
      '                ',
    ],
    reel: [   // clapperboard + play, for VR film tool
      '                ',
      '   kkkkkkkkkk   ',
      '   kwwkwwkwwk   ',
      '   kkkkkkkkkk   ',
      '   kbbbbbbbbk   ',
      '   kbwwbbbbbk   ',
      '   kbwwwwbbbk   ',
      '   kbwwwwwwbk   ',
      '   kbwwwwbbbk   ',
      '   kbwwbbbbbk   ',
      '   kbbbbbbbbk   ',
      '   kkkkkkkkkk   ',
      '                ',
      '                ',
      '                ',
      '                ',
    ],
    cap: [   // graduation mortarboard + tassel (studies)
      '                ',
      '       nn       ',
      '     nnnnnn     ',
      '   nnnnnnnnnn   ',
      ' nnnnnnnnnnnnnn ',
      'nnnnnnoonnnnnnnn',
      ' nnnnnnnnnnnnnn ',
      '   nnnnnnnnnn o ',
      '     nnnnnn   o ',
      '       nn     o ',
      '              o ',
      '             ooo',
      '                ',
      '                ',
      '                ',
      '                ',
    ],
    book: [   // open book (studies / coursework)
      '                ',
      '   nnnnn nnnnn  ',
      '  nwwwwwnwwwwwn ',
      '  nwgggwnwgggwn ',
      '  nwwwwwnwwwwwn ',
      '  nwgggwnwgggwn ',
      '  nwwwwwnwwwwwn ',
      '  nwgggwnwgggwn ',
      '  nwwwwwnwwwwwn ',
      '  nwwwwwnwwwwwn ',
      '  nnnnnnnnnnnnn ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
    ],
    chip: [   // IC / electronics (STI2D)
      '                ',
      '                ',
      '                ',
      '   kkkkkkkkkk   ',
      ' ggkodddddddkgg ',
      '   kddddddddk   ',
      ' ggkddddddddkgg ',
      '   kddddddddk   ',
      ' ggkddddddddkgg ',
      '   kddddddddk   ',
      ' ggkddddddddkgg ',
      '   kddddddddk   ',
      '   kkkkkkkkkk   ',
      '                ',
      '                ',
      '                ',
    ],
  };

  window.PixelIcon = PixelIcon;
  window.ICONS = ICONS;
})();
