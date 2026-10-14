// 단원 파일에서 유형을 통째로 뺀다. 유형은 `T('id', …)`·`H('id', …)`처럼 이름 붙은 호출 하나다.
//   node tools/question-bank/drop_types.cjs <단원> <유형 id> [유형 id …]
// 괄호·따옴표·백틱·주석을 세어 호출의 끝을 찾으므로 줄 모양에 기대지 않는다. 뺀 뒤에는 `node --check`와 검사를 돌린다.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const dir = process.env.MATH_BANK_DIR ? path.resolve(process.env.MATH_BANK_DIR) : path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const [unit, ...ids] = process.argv.slice(2);
if (!unit || !ids.length) { console.error('쓰임: drop_types.cjs <단원> <유형 id> …'); process.exit(1); }

// from 은 여는 괄호 자리. 짝이 맞는 닫는 괄호 자리를 돌려준다.
function closeOf(src, from) {
  let depth = 0;
  for (let i = from; i < src.length; i += 1) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && d === '*') { i = src.indexOf('*/', i) + 1; continue; }
    if (c === "'" || c === '"') { for (i += 1; src[i] !== c; i += 1) if (src[i] === '\\') i += 1; continue; }
    if (c === '`') { i = templateEnd(src, i); continue; }
    if (c === '(' || c === '[' || c === '{') depth += 1;
    if (c === ')' || c === ']' || c === '}') { depth -= 1; if (depth === 0) return i; }
  }
  throw new Error('짝이 맞는 괄호를 찾지 못했다');
}
function templateEnd(src, from) {
  for (let i = from + 1; i < src.length; i += 1) {
    if (src[i] === '\\') { i += 1; continue; }
    if (src[i] === '`') return i;
    if (src[i] === '$' && src[i + 1] === '{') i = closeOf(src, i + 1);
  }
  throw new Error('백틱의 끝을 찾지 못했다');
}

const files = fs.readdirSync(path.join(dir, 'units')).filter((f) => f.startsWith(unit) && /^[a-z]\.js$/.test(f.slice(unit.length))).sort();
for (const id of ids) {
  let done = false;
  for (const file of files) {
    const p = path.join(dir, 'units', file);
    let src = fs.readFileSync(p, 'utf8');
    const found = new RegExp("(^|\\n)([ \\t]*)[A-Za-z]+\\('" + id.replace(/[-]/g, '\\-') + "',").exec(src);
    if (!found) continue;
    const start = found.index + found[1].length, open = src.indexOf('(', start), close = closeOf(src, open);
    let end = close + 1;
    const comma = src[end] === ',';
    if (comma) end += 1;
    while (src[end] === ' ' || src[end] === '\t') end += 1;
    if (src[end] === '\r') end += 1;
    if (src[end] === '\n') end += 1;
    let head = src.slice(0, start);
    // 목록의 마지막 유형이었으면 앞 유형 끝의 쉼표를 뗀다.
    if (!comma) head = head.replace(/,(\s*)$/, '$1');
    fs.writeFileSync(p, head + src.slice(end));
    console.log(unit, id, file, (end - start) + '자');
    done = true;
    break;
  }
  if (!done) { console.error('유형을 찾지 못했다: ' + unit + ' ' + id); process.exit(1); }
}
