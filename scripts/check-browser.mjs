import http from 'node:http';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const root = process.cwd();
const profile = await mkdtemp(path.join(os.tmpdir(), 'portfolio-browser-'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = path.resolve(root, '.' + pathname);
  if (!requested.startsWith(root + path.sep) && requested !== root) { res.writeHead(403).end(); return; }
  const file = path.extname(pathname) ? requested : path.join(root, 'index.html');
  try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const chrome = spawn(process.env.CHROME_BINARY || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let endpoint;
  for (let i = 0; i < 100; i++) {
    const active = await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8').catch(() => '');
    if (active) { endpoint = `http://127.0.0.1:${active.split('\n')[0]}`; break; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!endpoint) throw new Error('Chrome failed to start');
  const targets = await (await fetch(`${endpoint}/json`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id) { pending.get(msg.id)?.(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const next = ++id;
    pending.set(next, msg => msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result));
    socket.send(JSON.stringify({ id: next, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  for (const route of ['/', '/about', '/personal/art', '/work/read-me', '/work/professional-experience']) {
    await send('Page.navigate', { url: base + route });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const state = await evaluate(`({route:location.pathname, react:React.version, ready:!!window.__startRouter, images:[...document.images].filter(i=>i.getAttribute('src')?.includes('optimized')).map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})), babel:!!window.Babel})`);
    if (!state.ready || state.babel) throw new Error('Startup or production build check failed');
    console.log(JSON.stringify(state));
    const broken = await evaluate(`[...document.images].filter(i=>i.src.includes('optimized')&&i.complete&&!i.naturalWidth).map(i=>i.src)`);
    if (broken.length) throw new Error('Optimized images failed: ' + broken.join(', '));
    if (route === '/personal/art') {
      const opened = await evaluate(`(()=>{const image=[...document.images].find(i=>i.src.includes('optimized')&&i.closest('button')); if(!image)return false; image.closest('button').click();return true;})()`);
      if (!opened) throw new Error('Gallery thumbnail not found');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const original = await evaluate(`[...document.images].some(i=>i.src.includes('/assets/projects/')&&!i.src.includes('/optimized/')&&i.complete&&i.naturalWidth>0)`);
      if (!original) throw new Error('Lightbox original did not load');
      console.log('Lightbox loads the original on click.');
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  await send('Browser.close');
  console.log('Mobile browser checks passed without JavaScript exceptions.');
} finally {
  socket?.close(); chrome.kill(); server.close();
  // Only the unique temporary profile created by this script is removed.
  if (path.dirname(profile) === os.tmpdir() && path.basename(profile).startsWith('portfolio-browser-')) {
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}
