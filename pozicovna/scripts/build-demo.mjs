// Zostaví demo verziu appky (bez servera, s ukážkovými dátami) do priečinka dist-demo/.
// Použitie: node scripts/build-demo.mjs [cieľový priečinok]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist-demo'));
const require = createRequire(import.meta.url);
const pkg = (name) => path.dirname(require.resolve(`${name}/package.json`));

fs.rmSync(OUT, { recursive: true, force: true });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(path.join(OUT, to)), { recursive: true });
  fs.copyFileSync(from, path.join(OUT, to));
};

for (const f of ['app.css', 'icon.svg']) copy(path.join(ROOT, 'public', f), f);
for (const f of fs.readdirSync(path.join(ROOT, 'public/js'))) copy(path.join(ROOT, 'public/js', f), `js/${f}`);
for (const f of ['demo-id-front.jpg', 'demo-id-back.jpg']) copy(path.join(ROOT, 'demo', f), f);
copy(path.join(pkg('tesseract.js'), 'dist/tesseract.min.js'), 'vendor/tesseract/tesseract.min.js');
copy(path.join(pkg('tesseract.js'), 'dist/worker.min.js'), 'vendor/tesseract/worker.min.js');
for (const f of ['tesseract-core-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js', 'tesseract-core-relaxedsimd-lstm.wasm.js']) {
  copy(path.join(pkg('tesseract.js-core'), f), `vendor/tesseract-core/${f}`);
}
for (const lang of ['eng', 'slk']) {
  copy(path.join(pkg(`@tesseract.js-data/${lang}`), '4.0.0_best_int', `${lang}.traineddata.gz`), `vendor/tessdata/${lang}.traineddata.gz`);
}

// Stránka bez <html>/<head> – hosting ju obalí vlastnou kostrou.
fs.writeFileSync(path.join(OUT, 'index.html'), `<title>Požičovňa tepovačov</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="app.css">
<script>window.__DEMO__ = true;</script>
<div id="app"><div class="boot">Načítavam…</div></div>
<div id="toast" role="status" aria-live="polite"></div>
<script type="module" src="js/app.js"></script>
`);
console.log(`Demo zostavené do ${OUT}`);
