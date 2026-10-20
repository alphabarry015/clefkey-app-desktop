/**
 * Assemble les partials Django ({% include %}) en HTML statique pour Tauri / serve.
 * Source : frontend/index.template.html → frontend/index.html
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const frontend = join(root, 'frontend');
const templatePath = join(frontend, 'index.template.html');
const outPath = join(frontend, 'index.html');

const INCLUDE_RE = /\{%\s*include\s+"([^"]+)"\s*%\}/g;

function loadTemplate() {
  if (existsSync(templatePath)) {
    return readFileSync(templatePath, 'utf8');
  }
  // Première migration : l’ancien index.html à includes devient le template.
  const legacy = readFileSync(outPath, 'utf8');
  if (!INCLUDE_RE.test(legacy)) {
    console.log('index.html déjà assemblé — rien à faire.');
    process.exit(0);
  }
  INCLUDE_RE.lastIndex = 0;
  writeFileSync(templatePath, legacy, 'utf8');
  console.log('Créé frontend/index.template.html');
  return legacy;
}

function assemble(source) {
  return source.replace(INCLUDE_RE, (_match, rel) => {
    const file = join(frontend, rel);
    if (!existsSync(file)) {
      throw new Error(`Partial manquant : ${rel}`);
    }
    return readFileSync(file, 'utf8');
  });
}

const template = loadTemplate();
const html = assemble(template);

if (/\{%\s*include/.test(html)) {
  throw new Error('Includes non résolus restants dans la sortie.');
}

writeFileSync(outPath, html, 'utf8');
console.log(`Assemblé → frontend/index.html (${html.length} octets)`);
