/* cloud-shader.jsx — Win98 sky: an animated WebGL cloud field, ported from the
   provided precision-safe cloud shader. Two uses:
     · <CloudShaderBG> — a live, looping wallpaper for the About Me desktop.
     · renderCloudSnapshot() — one baked frame (a 2D-readable canvas) that the
       Bayer-dither engine samples so the Personal -> About dissolve melts the
       green desktop straight into these clouds.
   Loads after React, before final-flow.jsx. */

const CLOUD_VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const CLOUD_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform vec2 uWind;
uniform float uEvo;
uniform float uCov;
const float PERIOD = 64.0;

float hash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec2 i0 = mod(i, PERIOD);
  vec2 i1 = mod(i + vec2(1.0, 0.0), PERIOD);
  vec2 i2 = mod(i + vec2(0.0, 1.0), PERIOD);
  vec2 i3 = mod(i + vec2(1.0, 1.0), PERIOD);
  float a = hash(i0);
  float b = hash(i1);
  float c = hash(i2);
  float d = hash(i3);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0;
  float amp = 0.55;
  vec2 shift = vec2(uEvo, -uEvo);
  for(int i = 0; i < 4; i++){
    v += amp * vnoise(p);
    p = p * 2.0 + shift;
    shift = shift * vec2(-2.0, 1.0);
    amp *= 0.5;
  }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 2.6 + uWind;
  float d = fbm(p);
  float edge = smoothstep(uCov, uCov + 0.30, d);
  float core = smoothstep(uCov + 0.18, uCov + 0.42, d);
  vec3 sky  = mix(vec3(0.42, 0.60, 0.83), vec3(0.55, 0.70, 0.88), uv.y * 0.5);
  vec3 col = mix(sky, vec3(0.80, 0.88, 0.96), edge);
  col = mix(col, vec3(0.99, 0.99, 1.0), core);
  gl_FragColor = vec4(col, 1.0);
}`;

const CLOUD_DEFAULTS = { speed: 0.35, dir: 200, evoSpeed: 0.25, cover: 0.44 };
const CLOUD_PERIOD = 64;

/* compile the program on a canvas's webgl context; returns { render } or null */
function makeCloudGL(canvas) {
  const g = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, alpha: false, preserveDrawingBuffer: true });
  if (!g) return null;
  const sh = (t, s) => { const o = g.createShader(t); g.shaderSource(o, s); g.compileShader(o); return o; };
  const pr = g.createProgram();
  g.attachShader(pr, sh(g.VERTEX_SHADER, CLOUD_VS));
  g.attachShader(pr, sh(g.FRAGMENT_SHADER, CLOUD_FS));
  g.linkProgram(pr);
  if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
  g.useProgram(pr);
  const b = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, b);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
  const l = g.getAttribLocation(pr, 'a');
  g.enableVertexAttribArray(l);
  g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0);
  const uR = g.getUniformLocation(pr, 'uRes');
  const uW = g.getUniformLocation(pr, 'uWind');
  const uE = g.getUniformLocation(pr, 'uEvo');
  const uC = g.getUniformLocation(pr, 'uCov');
  return {
    gl: g,
    render({ w, h, wind, evo, cover }) {
      g.viewport(0, 0, w, h);
      g.uniform2f(uR, w, h);
      g.uniform2f(uW, wind[0], wind[1]);
      g.uniform1f(uE, evo);
      g.uniform1f(uC, cover);
      g.drawArrays(g.TRIANGLES, 0, 3);
    },
  };
}

/* live, looping wallpaper canvas. Renders at a low internal resolution
   (clouds are soft) and stretches to the design size via CSS. */
function CloudShaderBG({ width, height, rw = 640, rh = 360, params = CLOUD_DEFAULTS, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    cv.width = rw; cv.height = rh;
    const c = makeCloudGL(cv);
    if (!c) { cv.style.display = 'none'; return; }
    const { speed, dir, evoSpeed, cover } = params;
    const r = dir * Math.PI / 180, P = CLOUD_PERIOD;
    let wx = 0, wy = 0, ev = 0, last = performance.now(), raf = 0;
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      wx = (wx + Math.cos(r) * speed * dt * 0.25 + P) % P;
      wy = (wy + Math.sin(r) * speed * dt * 0.25 + P) % P;
      ev = (ev + evoSpeed * dt * 0.12) % P;
      c.render({ w: rw, h: rh, wind: [wx, wy], evo: ev, cover });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rw, rh]);
  return <canvas ref={ref} aria-hidden="true"
    style={Object.assign({ display: 'block', width: width + 'px', height: height + 'px' }, style)} />;
}

/* one baked frame -> a 2D-readable canvas (so getImageData works in the dither
   sampler). Sized to the DESIGN_W : (FADE_H + DESK_H) aspect so the cover-rect
   math in fSampler lands 1:1. */
function renderCloudSnapshot(w = 480, h = 345, params = CLOUD_DEFAULTS) {
  const gcv = document.createElement('canvas');
  gcv.width = w; gcv.height = h;
  const c = makeCloudGL(gcv);
  if (!c) return null;
  /* a settled, representative frame */
  c.render({ w, h, wind: [12, 30], evo: 6, cover: params.cover });
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  out.getContext('2d').drawImage(gcv, 0, 0);
  return out;
}

Object.assign(window, { makeCloudGL, CloudShaderBG, renderCloudSnapshot, CLOUD_DEFAULTS });
