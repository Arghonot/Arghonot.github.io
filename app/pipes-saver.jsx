/* app/pipes-saver.jsx — the classic Win98 "3D Pipes" screensaver. Appears full
   screen after 45s with no mouse movement and disappears the instant the
   mouse moves (or any key/scroll/touch). Ported from the win98_pipes demo,
   adapted to fill the viewport. Loads after React, before final-flow.jsx. */

function PipesScreensaver({ idleMs = 45000 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const C = canvasRef.current;
    if (!C) return;
    const G = C.getContext('webgl', { antialias: true, alpha: false });
    if (!G) return;

    const PVS = `
      attribute vec3 aP; attribute vec3 aN; attribute vec3 aC;
      uniform mat4 uVP; uniform float uRot;
      varying vec3 vN; varying vec3 vC; varying vec3 vW;
      void main(){
        float c = cos(uRot), s = sin(uRot);
        mat3 R = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
        vec3 w = R * aP;
        vN = R * aN; vC = aC; vW = w;
        gl_Position = uVP * vec4(w, 1.0);
      }`;
    const PFS = `
      precision mediump float;
      varying vec3 vN; varying vec3 vC; varying vec3 vW;
      uniform vec3 uEye;
      void main(){
        vec3 N = normalize(vN);
        vec3 L = normalize(vec3(0.45, 0.85, 0.55));
        vec3 V = normalize(uEye - vW);
        float diff = max(dot(N, L), 0.0);
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 48.0);
        float rim = max(dot(N, normalize(vec3(-0.5, 0.2, -0.6))), 0.0) * 0.18;
        vec3 col = vC * (0.22 + 0.78 * diff + rim) + vec3(0.95) * spec;
        gl_FragColor = vec4(col, 1.0);
      }`;
    const mkSh = (t, s) => { const x = G.createShader(t); G.shaderSource(x, s); G.compileShader(x); return x; };
    const PP = G.createProgram();
    G.attachShader(PP, mkSh(G.VERTEX_SHADER, PVS));
    G.attachShader(PP, mkSh(G.FRAGMENT_SHADER, PFS));
    G.linkProgram(PP);
    G.useProgram(PP);
    G.enable(G.DEPTH_TEST);
    G.clearColor(0, 0, 0, 1);

    const MAXV = 200000, STRIDE = 9;
    const data = new Float32Array(MAXV * STRIDE);
    let vc = 0, uploaded = 0;
    const vbo = G.createBuffer();
    G.bindBuffer(G.ARRAY_BUFFER, vbo);
    G.bufferData(G.ARRAY_BUFFER, data.byteLength, G.DYNAMIC_DRAW);
    const SZ = 36;
    const aP = G.getAttribLocation(PP, 'aP');
    const aN = G.getAttribLocation(PP, 'aN');
    const aC = G.getAttribLocation(PP, 'aC');
    G.enableVertexAttribArray(aP); G.vertexAttribPointer(aP, 3, G.FLOAT, false, SZ, 0);
    G.enableVertexAttribArray(aN); G.vertexAttribPointer(aN, 3, G.FLOAT, false, SZ, 12);
    G.enableVertexAttribArray(aC); G.vertexAttribPointer(aC, 3, G.FLOAT, false, SZ, 24);

    const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov / 2), d = n - f;
      return [t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)/d,-1, 0,0,2*f*n/d,0]; };
    const lookAt = (e, c) => {
      let z = [e[0]-c[0], e[1]-c[1], e[2]-c[2]];
      let zl = Math.hypot(...z); z = z.map((v) => v/zl);
      let x = [-z[2], 0, z[0]];
      let xl = Math.hypot(...x); x = x.map((v) => v/xl);
      const y = [z[1]*x[2]-z[2]*x[1], z[2]*x[0]-z[0]*x[2], z[0]*x[1]-z[1]*x[0]];
      return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
        -(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]), -(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]), -(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]), 1]; };
    const mul = (a, b) => { const o = new Array(16);
      for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) { let s = 0;
        for (let k = 0; k < 4; k++) s += a[k*4+r] * b[c2*4+k]; o[c2*4+r] = s; } return o; };
    const EYE = [0, 2.5, 15.5];
    const uVPLoc = G.getUniformLocation(PP, 'uVP');
    const uEyeLoc = G.getUniformLocation(PP, 'uEye');
    G.uniform3fv(uEyeLoc, EYE);
    const uRotLoc = G.getUniformLocation(PP, 'uRot');

    const pv = (px, py, pz, nx, ny, nz, col) => { if (vc >= MAXV) return;
      const o = vc * STRIDE; data[o]=px; data[o+1]=py; data[o+2]=pz; data[o+3]=nx; data[o+4]=ny; data[o+5]=nz;
      data[o+6]=col[0]; data[o+7]=col[1]; data[o+8]=col[2]; vc++; };
    const SIDES = 10, R = 0.21, JR = R;
    const addCyl = (a, b, col) => {
      const ax = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
      const up = Math.abs(ax[1]) > 0.5 ? [1,0,0] : [0,1,0];
      let u = [ax[1]*up[2]-ax[2]*up[1], ax[2]*up[0]-ax[0]*up[2], ax[0]*up[1]-ax[1]*up[0]];
      const ul = Math.hypot(...u); u = u.map((v) => v/ul);
      const ax2 = ax.map((v) => v / Math.hypot(...ax));
      const v = [ax2[1]*u[2]-ax2[2]*u[1], ax2[2]*u[0]-ax2[0]*u[2], ax2[0]*u[1]-ax2[1]*u[0]];
      const ring = [];
      for (let i = 0; i < SIDES; i++) { const an = i / SIDES * Math.PI * 2; const cn = Math.cos(an), sn = Math.sin(an);
        ring.push([u[0]*cn+v[0]*sn, u[1]*cn+v[1]*sn, u[2]*cn+v[2]*sn]); }
      for (let i = 0; i < SIDES; i++) {
        const n0 = ring[i], n1 = ring[(i+1)%SIDES];
        const p00 = [a[0]+n0[0]*R, a[1]+n0[1]*R, a[2]+n0[2]*R];
        const p01 = [b[0]+n0[0]*R, b[1]+n0[1]*R, b[2]+n0[2]*R];
        const p10 = [a[0]+n1[0]*R, a[1]+n1[1]*R, a[2]+n1[2]*R];
        const p11 = [b[0]+n1[0]*R, b[1]+n1[1]*R, b[2]+n1[2]*R];
        pv(...p00, ...n0, col); pv(...p01, ...n0, col); pv(...p11, ...n1, col);
        pv(...p00, ...n0, col); pv(...p11, ...n1, col); pv(...p10, ...n1, col);
      }
    };
    const ST = 5, SL = 8;
    const addSphere = (c, r, col) => {
      for (let i = 0; i < ST; i++) { const t0 = i / ST * Math.PI, t1 = (i+1) / ST * Math.PI;
        for (let j = 0; j < SL; j++) { const f0 = j / SL * 2 * Math.PI, f1 = (j+1) / SL * 2 * Math.PI;
          const P4 = [[t0,f0],[t1,f0],[t1,f1],[t0,f1]].map(([t,f]) => [Math.sin(t)*Math.cos(f), Math.cos(t), Math.sin(t)*Math.sin(f)]);
          const q = P4.map((nn) => [c[0]+nn[0]*r, c[1]+nn[1]*r, c[2]+nn[2]*r]);
          pv(...q[0], ...P4[0], col); pv(...q[1], ...P4[1], col); pv(...q[2], ...P4[2], col);
          pv(...q[0], ...P4[0], col); pv(...q[2], ...P4[2], col); pv(...q[3], ...P4[3], col);
        } }
    };

    /* The pipe volume is a stretched box, not a cube. Cell size stays 1 world unit
       (so pipe thickness and joint size never change) while the cell COUNT follows
       the viewport aspect — a tall phone gets a tall narrow column instead of a
       wide box cropped at the sides. GX drives the footprint, GZ tracks GX so the
       footprint stays square (the scene spins about Y, so an oblong footprint would
       swing its depth into view and clip), and GY is derived from however much
       vertical room the camera distance leaves — that is what makes the box fill
       the screen instead of floating in dead space. */
    const CELL_BUDGET = 92;
    let GX = 11, GY = 8, GZ = 11;
    const DIRS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    const PALETTE = [[0.85,0.66,0.15],[0.78,0.78,0.80],[0.80,0.16,0.12],[0.10,0.62,0.25],[0.18,0.35,0.85],[0.08,0.62,0.62],[0.55,0.25,0.78]];
    let occ, pipes, colIdx;
    const key = (c) => c[0] + ',' + c[1] + ',' + c[2];
    const inB = (c) => c[0]>=0 && c[0]<GX && c[1]>=0 && c[1]<GY && c[2]>=0 && c[2]<GZ;
    const world = (c) => [c[0]-(GX-1)/2, c[1]-(GY-1)/2, c[2]-(GZ-1)/2];
    const spawn = () => {
      for (let t = 0; t < 90; t++) {
        const c = [Math.floor(Math.random()*GX), Math.floor(Math.random()*GY), Math.floor(Math.random()*GZ)];
        if (!occ.has(key(c))) { occ.add(key(c)); colIdx = (colIdx + 1 + Math.floor(Math.random()*3)) % PALETTE.length;
          const col = PALETTE[colIdx]; addSphere(world(c), JR, col);
          return { pos: c, dir: DIRS[Math.floor(Math.random()*6)], col }; }
      }
      return null;
    };
    const resetAll = () => { occ = new Set(); vc = 0; uploaded = 0; colIdx = Math.floor(Math.random()*7); pipes = [spawn(), spawn(), spawn()]; };
    const step = () => {
      let alive = false;
      for (let i = 0; i < pipes.length; i++) {
        const p = pipes[i];
        if (!p) { pipes[i] = spawn(); continue; }
        alive = true;
        const cands = DIRS.filter((d) => { const nn = [p.pos[0]+d[0], p.pos[1]+d[1], p.pos[2]+d[2]]; return inB(nn) && !occ.has(key(nn)); });
        if (!cands.length) { addSphere(world(p.pos), JR, p.col); pipes[i] = spawn(); continue; }
        const straightOk = cands.some((d) => d[0]===p.dir[0] && d[1]===p.dir[1] && d[2]===p.dir[2]);
        let d;
        if (straightOk && Math.random() > 0.42) { d = p.dir; }
        else { d = cands[Math.floor(Math.random()*cands.length)]; if (d !== p.dir) addSphere(world(p.pos), JR, p.col); }
        const nn = [p.pos[0]+d[0], p.pos[1]+d[1], p.pos[2]+d[2]];
        addCyl(world(p.pos), world(nn), p.col); occ.add(key(nn)); p.pos = nn; p.dir = d;
      }
      if (occ.size > GX*GY*GZ*0.78 || vc > MAXV - 1200 || !alive) resetAll();
    };

    let cssW = 0, cssH = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth; cssH = window.innerHeight;
      C.width = Math.floor(cssW * dpr); C.height = Math.floor(cssH * dpr);
      G.viewport(0, 0, C.width, C.height);
      const aspect = cssW / cssH;
      const FOV = 0.96, t = Math.tan(FOV / 2), MARGIN = 1.15;
      const gx = Math.min(16, Math.max(5, Math.round(Math.sqrt(CELL_BUDGET * Math.min(Math.max(aspect, 0.35), 3.2)))));
      const gz = Math.min(12, Math.max(6, gx));
      /* horizontal fit uses the SWEPT radius: the scene rotates about Y, so the
         silhouette reaches hypot(halfX, halfZ), not halfX */
      const halfW = Math.hypot((gx - 1) / 2, (gz - 1) / 2) + R;
      /* visible half-height needed to satisfy that horizontal fit */
      const visH = halfW * MARGIN / aspect;
      const dist = visH / t + (gz - 1) / 2;
      /* fill the leftover vertical room with cells rather than empty space */
      const gy = Math.min(22, Math.max(5, Math.round(2 * (visH / MARGIN - R)) + 1));
      /* hysteresis: mobile browsers fire resize when the URL bar shows/hides, and a
         one-cell flip must not wipe the maze mid-animation */
      const changed = Math.abs(gx - GX) > 1 || Math.abs(gy - GY) > 1 || Math.abs(gz - GZ) > 1;
      GX = gx; GY = gy; GZ = gz;
      EYE[1] = Math.min(2.5, visH * 0.22);
      EYE[2] = dist;
      G.uniform3fv(uEyeLoc, EYE);
      const VP = mul(persp(FOV, aspect, 0.5, dist * 2.6 + 40), lookAt(EYE, [0, 0, 0]));
      G.uniformMatrix4fv(uVPLoc, false, VP);
      if (changed && occ) resetAll();
    };

    const tps = 14, rotSpd = 0.15;
    let acc = 0, rot = 0, prev = 0, raf = 0, active = false;
    const loop = (now) => {
      if (!active) return;
      const dt = Math.min((now - prev) / 1000, 0.1); prev = now;
      acc += dt * tps;
      while (acc >= 1) { step(); acc -= 1; }
      rot += dt * rotSpd * 0.4;
      if (vc > uploaded) { G.bufferSubData(G.ARRAY_BUFFER, uploaded * SZ, data.subarray(uploaded * STRIDE, vc * STRIDE)); uploaded = vc; }
      G.uniform1f(uRotLoc, rot);
      G.clear(G.COLOR_BUFFER_BIT | G.DEPTH_BUFFER_BIT);
      G.drawArrays(G.TRIANGLES, 0, vc);
      raf = requestAnimationFrame(loop);
    };

    const activate = () => {
      if (active) return;
      active = true;
      C.style.display = 'block';
      C.style.pointerEvents = 'auto';   /* absorb the dismissing click */
      resize(); resetAll();
      acc = 0; rot = 0; prev = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const deactivate = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      C.style.display = 'none';
      C.style.pointerEvents = 'none';
    };

    let timer = 0;
    const arm = () => { clearTimeout(timer); timer = setTimeout(activate, idleMs); };
    /* While the saver is showing, mouse movement / keys / scroll do NOT dismiss
       it — only a click does (handled below). They only re-arm the idle timer
       when the saver is NOT showing. */
    const onActivity = () => { if (active) return; arm(); };
    /* a click (or tap) anywhere is the only way back to the site */
    const onDismiss = () => { if (active) { deactivate(); arm(); } };

    /* allow the Start menu's "Shut Down" to launch the screensaver on demand */
    window.__launchScreensaver = activate;

    const evs = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    C.addEventListener('mousedown', onDismiss);
    C.addEventListener('touchstart', onDismiss, { passive: true });
    window.addEventListener('resize', () => { if (active) resize(); });
    arm();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      if (window.__launchScreensaver === activate) delete window.__launchScreensaver;
      evs.forEach((e) => window.removeEventListener(e, onActivity));
      C.removeEventListener('mousedown', onDismiss);
      C.removeEventListener('touchstart', onDismiss);
    };
  }, [idleMs]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 100000,
        display: 'none', background: '#000', pointerEvents: 'none' }} />
  );
}

window.PipesScreensaver = PipesScreensaver;
