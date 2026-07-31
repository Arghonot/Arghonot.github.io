/* app/welcome-melt.jsx — DOOM-style ordered-dither "melt" that dissolves the
   Welcome desktop's classic Win98 teal wallpaper to reveal the showreel video
   underneath. Timed entirely from mount — no user input. Ported from the
   doom-dither-melt reference. Loads after React, before final-flow.jsx. */

const WM_VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

const WM_FRAG = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  uniform vec2  uRes;
  uniform float uReveal;
  uniform vec3  uTeal;
  uniform vec3  uGlowCol;
  uniform float uGlow;
  uniform float uCell;
  uniform float uBand;
  uniform float uEdgeW;
  uniform float uVar;
  uniform sampler2D uCols;
  float Bayer2(vec2 a){ a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  #define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
  #define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))
  void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    float colDelay = texture2D(uCols, vec2(uv.x, 0.5)).r;
    float order = ((1.0 - uv.y) + colDelay * uVar) / (1.0 + uVar);
    float d = Bayer8(gl_FragCoord.xy / uCell);
    float threshold = order * (1.0 - uBand) + d * uBand;
    float alpha = 1.0 - step(threshold, uReveal);
    float ahead = threshold - uReveal;
    float hot = (1.0 - smoothstep(0.0, uEdgeW, ahead)) * step(0.0, ahead) * alpha;
    vec3 col = mix(uTeal / 255.0, uGlowCol / 255.0, clamp(hot * uGlow, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

function WelcomeMelt({
  width = 1920, height = 1080,
  src = 'assets/videos/Landing.mp4',
  delay = 2.0, duration = 3.6, scale = 1, onDone,
}) {
  const canvasRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const fallbackRef = React.useRef(null);
  const [showScroll, setShowScroll] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const finish = () => { setDone(true); if (onDone) onDone(); };

  React.useEffect(() => {
    const t = setTimeout(() => setShowScroll(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;
    canvas.width = width; canvas.height = height;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) { canvas.style.display = 'none'; return; }

    if (video) {
      video.src = src;
      const onErr = () => { if (fallbackRef.current) fallbackRef.current.style.display = 'block'; };
      video.addEventListener('error', onErr);
      video.play().catch(() => {});
    }

    /* the dither melt plays only the FIRST time the welcome desk is shown in a
       session; on every later visit the video is already revealed (no melt). */
    let alreadyPlayed = false;
    try { alreadyPlayed = sessionStorage.getItem('wm_played') === '1'; } catch (e) {}
    if (alreadyPlayed) { canvas.style.display = 'none'; finish(); return; }

    const compile = (type, s) => { const o = gl.createShader(type); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, WM_VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, WM_FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const ploc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(ploc);
    gl.vertexAttribPointer(ploc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* DOOM melt: bounded random-walk per column, normalised to 0..1 */
    const colsTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, colsTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const n = 180;
    const raw = new Float32Array(n); raw[0] = 0;
    for (let i = 1; i < n; i++) raw[i] = raw[i - 1] + (Math.floor(Math.random() * 3) - 1);
    let mn = Infinity, mx = -Infinity;
    for (const vv of raw) { if (vv < mn) mn = vv; if (vv > mx) mx = vv; }
    const span = (mx - mn) || 1;
    const px = new Uint8Array(n * 4);
    for (let i = 0; i < n; i++) { const b = Math.round(((raw[i] - mn) / span) * 255); px[i*4]=b; px[i*4+1]=b; px[i*4+2]=b; px[i*4+3]=255; }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);

    const U = {};
    ['uRes','uReveal','uTeal','uGlowCol','uGlow','uCell','uBand','uEdgeW','uVar','uCols']
      .forEach((k) => U[k] = gl.getUniformLocation(prog, k));
    gl.uniform1i(U.uCols, 0);

    const easeInOut = (x) => x * x * (3 - 2 * x);
    let raf = 0;
    const start = performance.now();
    const frame = (now) => {
      const t = (now - start) / 1000;
      const reveal = t < delay ? 0 : easeInOut(Math.min((t - delay) / duration, 1));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uReveal, reveal);
      gl.uniform3f(U.uTeal, 0, 128, 128);
      gl.uniform3f(U.uGlowCol, 150, 255, 255);
      gl.uniform1f(U.uGlow, 0.3);
      gl.uniform1f(U.uCell, 3.0);
      gl.uniform1f(U.uBand, 0.30);
      gl.uniform1f(U.uEdgeW, 0.08);
      gl.uniform1f(U.uVar, 0.85);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reveal >= 1) { canvas.style.opacity = '0'; try { sessionStorage.setItem('wm_played', '1'); } catch (e) {} finish(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cover = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: done ? '#000' : 'rgb(0,128,128)' }}>
      <video ref={videoRef} muted loop autoPlay playsInline style={cover} />
      <div ref={fallbackRef} style={{ ...cover, display: 'none',
        background: 'conic-gradient(from 0deg at 50% 50%, #ff3d7f, #ffb000, #21d4fd, #b721ff, #ff3d7f)' }} />
      <canvas ref={canvasRef} style={{ ...cover, transition: 'opacity .4s linear' }} />
      {/* scroll hint moved to the taskbar layer (final-flow) so it always sits above the taskbar */}
    </div>
  );
}

window.WelcomeMelt = WelcomeMelt;
