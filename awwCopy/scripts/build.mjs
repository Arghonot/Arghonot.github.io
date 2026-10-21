import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
await mkdir('app/generated', { recursive: true });
await build({
  stdin: { contents: "import React from 'react'; import ReactDOM from 'react-dom/client'; import {createPortal} from 'react-dom'; window.React=React; window.ReactDOM={...ReactDOM,createPortal};", resolveDir: root },
  bundle: true, minify: true, define: { 'process.env.NODE_ENV': '"production"' },
  outfile: 'app/generated/react.js', target: 'es2020', legalComments: 'eof'
});
// Source template retains JSX; the generated index is served directly by GitHub Pages.
let html = await readFile('site.template.html', 'utf8');
const modules = [];
html = html.replace(/<!--[^]*?-->/g, (comment) => comment.replace(/<script\b/g, '<disabled-script'));
html = html.replace(/<script type="text\/babel" src="([^"]+)"><\/script>/g, (_, src) => {
  modules.push(src); return '';
});
let code = '';
for (const src of modules) code += `(function(){\n${await readFile(src, 'utf8')}\n})();\n`;
html = html.replace(/<script type="text\/babel">([^]*?)<\/script>/g, (_, inline) => { code += inline; return '<script src="awwCopy/app/generated/site.js"></script>'; });
const compiled = await transform(code, { loader: 'jsx', minify: true, target: 'es2020' });
await writeFile('app/generated/site.js', compiled.code);
html = html.replace(/<script src="https:\/\/unpkg.com\/(?:react@|react-dom@|@babel\/standalone@)[^]*?<\/script>\s*/g, '');
html = html.replace('<script src="app/image-variants.js"></script>', '<script src="app/image-variants.js"></script>\n<script src="app/responsive-image.js"></script>\n<script src="awwCopy/app/generated/react.js"></script>');
html = html.replace(/<disabled-script\b/g, '<script');
await writeFile('index.html', html);
console.log(`Built ${modules.length} JSX modules and startup code; browser Babel removed.`);
