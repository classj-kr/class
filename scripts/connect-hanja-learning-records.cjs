'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../learning/literacy-numeracy/hanja-meaning/v2');
let count = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (entry.name !== 'index.html') continue;
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('/assets/learning-hanja.js')) continue;
    if (html.includes('id="quiz-data"')) {
      html = html.replace(/<script>\s*const labels=[\s\S]*?<\/script>/, '');
    } else if (html.includes('id="startQuiz"')) {
      const start = html.indexOf("document.querySelector('#startQuiz').onclick=");
      const end = html.indexOf('})();', start);
      if (start < 0 || end < 0) throw new Error('Unknown lesson script: ' + file);
      html = html.slice(0, start) + html.slice(end);
    } else continue;
    html = html.replace('</body>', '<script src="/assets/learning-records.js?v=20261001-1"></script><script src="/assets/learning-hanja.js?v=20261002-1"></script></body>');
    fs.writeFileSync(file, html); count++;
  }
}
walk(root); console.log('Connected hanja pages:', count);
