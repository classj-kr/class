// Source-checked editing helper: every source write goes through apply_patch.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const changes = new Map();
const lab = 'learning/inquiry/science-lab/';
function edit(file, change) {
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7).split(',');
  if (only && !only.some(slug => file.includes('/' + slug + '/'))) return;
  const before = changes.get(file)?.after ?? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const after = change(before);
  if (before === after) return;
  changes.set(file, { before: changes.get(file)?.before ?? before, after });
}
function replace(s, from, to) {
  if (!s.includes(from)) throw new Error('Missing original: ' + from.slice(0, 180));
  return s.replace(from, to);
}
function cut(s, regex, to = '') {
  if (!regex.test(s)) throw new Error('Missing original: ' + regex);
  return s.replace(regex, to);
}
function quiz(n, question, answers, correct, explanation) {
  return `<article class="quiz-card" data-answer="${correct}">\n<h3>${question}</h3>\n<div class="quiz-options">\n${answers.map((a, i) => `<label><input type="radio" name="q${n}" value="${'abcd'[i]}"> ${a}</label>`).join('\n')}\n</div>\n<button class="answer-button" type="button">정답 확인</button>\n<p class="answer-result" aria-live="polite"></p>\n<p class="answer-explanation" hidden>${explanation}</p>\n</article>`;
}
function replaceQuiz(s, n, q) {
  const cards = [...s.matchAll(/<article class="quiz-card"[\s\S]*?<\/article>/g)];
  if (!cards[n - 1]) throw new Error('Missing quiz ' + n);
  return replace(s, cards[n - 1][0], quiz(n, ...q));
}
function diff(before, after) {
  const a = before.trimEnd().split('\n'), b = after.trimEnd().split('\n');
  const dp = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0; const ops = [];
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { ops.push(' ' + a[i++]); j++; }
    else if (i < a.length && (j === b.length || dp[i + 1][j] >= dp[i][j + 1])) ops.push('-' + a[i++]);
    else ops.push('+' + b[j++]);
  }
  const keep = new Set();
  ops.forEach((v, k) => { if (v[0] !== ' ') for (let n = Math.max(0, k - 3); n <= Math.min(ops.length - 1, k + 3); n++) keep.add(n); });
  let last = -2, result = '';
  [...keep].sort((x, y) => x - y).forEach(k => { if (k !== last + 1) result += '@@\n'; result += ops[k] + '\n'; last = k; });
  return result;
}
function apply() {
  for (const [file, { after }] of changes) if (file.endsWith('.js') || file.endsWith('.cjs')) new Function(after);
  if (!process.argv.includes('--apply')) { console.log(`Preflight passed: ${changes.size} files`); return; }
  for (const [file, { before, after }] of changes) {
    for (const hunk of diff(before, after).split(/(?=^@@\n)/m).filter(Boolean)) {
      const patch = `*** Begin Patch\n*** Update File: ${path.resolve(file).replaceAll('\\', '/')}\n${hunk}*** End Patch`;
      let r;
      for (let attempt=0; attempt<3; attempt++) {
        const beforeAttempt=fs.readFileSync(file,'utf8');
        r=spawnSync('C:/Users/A/AppData/Local/OpenAI/Codex/bin/cdef5aaf3e41ab53/codex.exe', ['--codex-run-as-apply-patch', patch], { encoding: 'utf8', windowsHide: true });
        if(r.status===0 || !/Failed to write file/.test(r.stderr||r.stdout||'') || fs.readFileSync(file,'utf8')!==beforeAttempt)break;
      }
      if (r.status !== 0) throw new Error(file + ': ' + (r.stderr || r.stdout || r.error));
    }
    console.log(file);
  }
}
module.exports = { edit, replace, cut, quiz, replaceQuiz, apply, lab };
