import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const root = resolve(new URL('../dist', import.meta.url).pathname);
const base = '/worldeology-lab/';
const origin = 'https://jewelina95.github.io/';

if (!existsSync(root)) throw new Error('dist/ does not exist. Run the build first.');

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

for (const file of walk(root)) {
  const extension = extname(file);
  if (!['.html', '.xml', '.txt', '.webmanifest'].includes(extension)) continue;
  let content = readFileSync(file, 'utf8');

  if (extension === '.html') {
    content = content.replace(/\b(href|src)=(["'])\/(?!\/|worldeology-lab\/)/g, `$1=$2${base}`);
  }

  content = content.replaceAll(origin, `${origin}${base.slice(1)}`);

  if (extension === '.webmanifest') {
    const manifest = JSON.parse(content);
    manifest.start_url = base;
    manifest.icons = (manifest.icons || []).map((icon) => ({
      ...icon,
      src: icon.src.startsWith(base) ? icon.src : `${base}${icon.src.replace(/^\//, '')}`
    }));
    content = `${JSON.stringify(manifest, null, 2)}\n`;
  }

  writeFileSync(file, content);
}

const failures = [];
for (const file of walk(root).filter((path) => extname(path) === '.html')) {
  const html = readFileSync(file, 'utf8');
  if (/\b(?:href|src)=["']\/(?!\/|worldeology-lab\/)/.test(html)) failures.push(file);
}

if (failures.length) throw new Error(`Unprefixed project-site paths remain in ${failures.length} HTML file(s).`);
console.log(`Prepared ${base} paths for GitHub Pages.`);
