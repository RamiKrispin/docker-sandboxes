import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.md': 'text/plain; charset=utf-8',
};
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname === '/' ? '/slides/index.html' : url.pathname);
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || pathname.split('/').some(part => part.startsWith('.')) || pathname.startsWith('/node_modules/')) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!(await stat(file)).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Workshop slides: http://127.0.0.1:${port}/slides/index.html`);
  console.log('Arrow keys / Space: navigate. S: presenter notes. Ctrl+C: stop.');
});
