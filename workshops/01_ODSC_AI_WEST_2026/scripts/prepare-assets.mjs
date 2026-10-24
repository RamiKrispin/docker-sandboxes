import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = [
  ['reveal.js/dist/reveal.js', 'vendor/reveal/dist/reveal.js'],
  ['reveal.js/dist/reveal.css', 'vendor/reveal/dist/reveal.css'],
  ['reveal.js/dist/plugin/notes.js', 'vendor/reveal/plugin/notes/notes.js'],
  ['reveal.js/dist/plugin/highlight.js', 'vendor/reveal/plugin/highlight/highlight.js'],
  ['reveal.js/dist/plugin/highlight/monokai.css', 'vendor/reveal/plugin/highlight/monokai.css'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'assets/fonts/inter-latin.woff2'],
];
for (const [source, destination] of files) {
  const output = path.join(root, 'slides', destination);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(path.join(root, 'node_modules', source), output);
}
console.log('Local Reveal.js runtime, notes, highlighting, and Inter font are ready.');
