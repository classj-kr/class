const fs = require('node:fs');
const crypto = require('node:crypto');
const root = 'learning/inquiry/age-of-exploration/';
const files = [
  'public/js/place-study-ui.js',
  'public/css/place-study.css',
  'public/teacher.html',
  'public/index.html',
  'data/catalog/discoveries.json',
  'data/catalog/photo-credits.json',
  ...['batur-caldera', 'chocolate-hills', 'milford-sound', 'palawan-underground-river'].map(id => `public/assets/landmarks/${id}.webp`),
];
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
(async () => {
  const checks = await Promise.all(files.map(async file => {
    const response = await fetch(`https://classj-kr.github.io/class/${root}${file}?deploy=7e49a98106`, {signal: AbortSignal.timeout(45000)});
    const body = Buffer.from(await response.arrayBuffer());
    const local = fs.readFileSync(root + file);
    const match = file.endsWith('.webp') ? hash(body) === hash(local) : body.toString().replace(/\r\n/g, '\n') === local.toString().replace(/\r\n/g, '\n');
    return {file, status: response.status, match};
  }));
  console.log(JSON.stringify(checks, null, 2));
  if (checks.some(check => check.status !== 200 || !check.match)) process.exitCode = 1;
})().catch(error => {console.error(error.message); process.exitCode = 1;});
