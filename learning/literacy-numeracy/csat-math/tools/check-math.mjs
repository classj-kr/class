// data/exams/*.js의 모든 문항을 화면과 같은 방식으로 읽어 수식이 깨지는 곳을 찾는다.
//   node tools/check-math.mjs            깨진 곳만 보인다. 하나라도 있으면 종료 코드 1.
//   node tools/check-math.mjs --strict   KaTeX가 그리기는 하지만 경고를 내는 곳(수식 안 한글 등)도 보인다.
//
// 화면은 innerHTML로 문항을 넣은 뒤 auto-render로 \( \)와 \[ \] 사이를 KaTeX에 넘긴다.
// 그래서 여기서도 같은 차례를 밟는다.
//   1. HTML로 읽는다. < 뒤에 영문자가 오면 브라우저는 태그로 보고 > 까지 삼킨다(x<a 같은 것).
//   2. 태그 사이 글자 덩어리마다 auto-render와 같은 규칙으로 수식을 가른다.
//   3. 수식은 KaTeX로 실제로 파싱하고, 수식 밖에 남은 \( \) \[ \] \명령 ^{ _{ 는 깨진 것으로 본다.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";

const ROOT = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const EXAMS = path.join(ROOT, "data", "exams");
const FIGURES = path.join(ROOT, "assets", "figures");
const STRICT = process.argv.includes("--strict");

// 이 폴더에는 node_modules가 없다. 같은 저장소의 다른 앱이 받아 둔 KaTeX를 빌려 쓴다.
function loadKatex() {
  const bases = [ROOT, path.join(ROOT, "..", "arithmetics"), path.join(ROOT, "..", "..", "..")];
  for (const base of bases) {
    try {
      return createRequire(path.join(base, "package.json"))("katex");
    } catch {
      // 다음 자리를 본다.
    }
  }
  throw new Error("KaTeX를 찾지 못했습니다. learning/literacy-numeracy/arithmetics에서 npm install을 하거나 이 폴더에 katex를 받으세요.");
}
const katex = loadKatex();

// app.js의 renderMath와 같은 전처리.
function preProcess(math) {
  if (/\\(int|iint|iiint|oint|sum|prod|lim|bigcap|bigcup)(?![a-zA-Z])/.test(math) && !math.includes("\\displaystyle") && !math.includes("\\textstyle")) {
    return "\\displaystyle " + math;
  }
  return math;
}

const DELIMITERS = [
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false }
];

// auto-render의 findEndOfMath: 중괄호 깊이가 0일 때만 닫는 기호로 본다.
function findEndOfMath(delimiter, text, startIndex) {
  let index = startIndex;
  let braceLevel = 0;
  while (index < text.length) {
    const ch = text[index];
    if (braceLevel <= 0 && text.slice(index, index + delimiter.length) === delimiter) return index;
    if (ch === "\\") index++;
    else if (ch === "{") braceLevel++;
    else if (ch === "}") braceLevel--;
    index++;
  }
  return -1;
}

// auto-render의 splitAtDelimiters와 같은 규칙. 닫는 기호가 없으면 나머지는 글자로 남는다.
function splitAtDelimiters(text) {
  const out = [];
  const leftRe = /\\\[|\\\(/;
  for (;;) {
    const m = text.search(leftRe);
    if (m === -1) break;
    if (m > 0) out.push({ type: "text", data: text.slice(0, m) });
    text = text.slice(m);
    const delim = DELIMITERS.find((d) => text.startsWith(d.left));
    const end = findEndOfMath(delim.right, text, delim.left.length);
    if (end === -1) break;
    out.push({ type: "math", data: text.slice(delim.left.length, end), display: delim.display });
    text = text.slice(end + delim.right.length);
  }
  if (text) out.push({ type: "text", data: text });
  return out;
}

const KNOWN_TAGS = new Set(["p", "div", "span", "ul", "ol", "li", "img", "b", "strong", "em", "i", "u", "br", "sup", "sub", "small", "table", "thead", "tbody", "tr", "th", "td"]);

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[A-Za-z]+);/g, (whole, name) => {
    if (name[0] === "#") return String.fromCodePoint(name[1] === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[name] ?? whole;
  });
}

// 브라우저 HTML 파서를 흉내 내어 태그 사이 글자 덩어리를 돌려준다. 수상한 태그는 issues에 적는다.
function htmlTextRuns(html, issues) {
  const runs = [];
  let buf = "";
  let i = 0;
  const flush = () => {
    if (buf) runs.push(decodeEntities(buf));
    buf = "";
  };
  while (i < html.length) {
    const ch = html[i];
    if (ch !== "<") {
      buf += ch;
      i++;
      continue;
    }
    const next = html[i + 1] || "";
    const isEnd = next === "/" && /[A-Za-z]/.test(html[i + 2] || "");
    if (/[A-Za-z]/.test(next) || isEnd || next === "!" || next === "?") {
      // 태그(또는 주석)로 읽힌다. 따옴표 안의 >는 건너뛴다.
      let j = i + 1;
      let quote = null;
      while (j < html.length && (quote || html[j] !== ">")) {
        if (quote) {
          if (html[j] === quote) quote = null;
        } else if (html[j] === '"' || html[j] === "'") quote = html[j];
        j++;
      }
      const tag = html.slice(i, j + 1);
      const name = (tag.match(/^<\/?([A-Za-z][A-Za-z0-9]*)/) || [])[1];
      if (j >= html.length) {
        issues.push({ kind: "html", msg: `'<'로 시작한 태그가 닫히지 않아 뒤가 모두 사라집니다: ${short(tag)}` });
      } else if (name && !KNOWN_TAGS.has(name.toLowerCase())) {
        issues.push({ kind: "html", msg: `'<${name}'이 태그로 읽혀 글자가 사라집니다(&lt;로 써야 함): ${short(tag)}` });
      }
      flush();
      i = j + 1;
      continue;
    }
    // 0<x처럼 숫자가 오면 지금은 글자로 남지만, 고치다 0<a가 되면 바로 깨진다. README대로 늘 &lt;로 쓴다.
    issues.push({ kind: "html", msg: `'<'를 그대로 썼습니다(&lt;로 써야 함): …${short(html.slice(Math.max(0, i - 20), i + 20))}` });
    buf += ch;
    i++;
  }
  flush();
  return runs;
}

function short(s, n = 70) {
  s = s.replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function checkText(text, issues, warnings, { html }) {
  const runs = html ? htmlTextRuns(text, issues) : [text];
  for (const run of runs) {
    for (const part of splitAtDelimiters(run)) {
      if (part.type === "text") {
        const stray = part.data.match(/\\[()[\]]|\\[A-Za-z]+|[\^_]\{/);
        if (stray) {
          const at = Math.max(0, stray.index - 25);
          issues.push({ kind: "stray", msg: `수식 밖에 TeX가 그대로 보입니다 '${stray[0]}': …${short(part.data.slice(at, stray.index + 45))}` });
        }
        continue;
      }
      // \\ 바로 뒤에 명령이 붙으면 줄바꿈 + 글자로 그려진다(\\frac → 줄바꿈과 frac). 파싱은 되니 따로 본다.
      const doubled = part.data.match(/\\\\[A-Za-z]+/);
      if (doubled) issues.push({ kind: "katex", msg: `'${doubled[0]}'는 백슬래시가 하나 더 붙은 것 같습니다 — \\(${short(part.data, 80)}\\)` });

      const codes = new Set();
      const opts = {
        displayMode: part.display,
        throwOnError: true,
        strict: (code, msg) => {
          if (!codes.has(code)) warnings.push({ kind: "strict", msg: `${code}: ${msg} — \\(${short(part.data, 50)}\\)` });
          codes.add(code);
          return "ignore";
        }
      };
      // KaTeX가 글꼴에 없는 글자(㉠ 등)마다 console.warn을 찍는다. 결과를 어지럽히니 잠시 막는다.
      const warn = console.warn;
      console.warn = () => {};
      try {
        katex.renderToString(preProcess(part.data), opts);
      } catch (err) {
        issues.push({ kind: "katex", msg: `${err.message.replace(/\s+/g, " ")} — \\(${short(part.data, 80)}\\)` });
      } finally {
        console.warn = warn;
      }
    }
  }
}

const context = { window: {}, console, String };
vm.createContext(context);
const sources = {};
for (const file of fs.readdirSync(EXAMS).filter((f) => f.endsWith(".js")).sort()) {
  sources[file] = fs.readFileSync(path.join(EXAMS, file), "utf8");
  vm.runInContext(sources[file], context, { filename: file });
}

function lineOf(file, id) {
  const at = sources[file].indexOf(`id: "${id}"`);
  return at === -1 ? 1 : sources[file].slice(0, at).split("\n").length;
}

let errorCount = 0;
let warnCount = 0;
let problemCount = 0;
for (const [examId, part] of Object.entries(context.window.CSAT_MATH_PART)) {
  const file = examId + ".js";
  for (const p of part) {
    problemCount++;
    const issues = [];
    const warnings = [];
    const fields = [
      ["body", p.body === undefined ? undefined : "<p>" + p.body + "</p>", true],
      ["bodyAfter", p.bodyAfter, true],
      ["help", p.help, true],
      ["noteTitle", p.noteTitle, false],
      ...(p.note || []).map((s, i) => [`note[${i}]`, s, true]),
      ...(p.choices || []).map((s, i) => [`choices[${i}]`, s, true])
    ];
    for (const [name, value, html] of fields) {
      if (value === undefined || value === null) continue;
      const before = issues.length;
      const wBefore = warnings.length;
      checkText(String(value), issues, warnings, { html });
      for (const it of issues.slice(before)) it.field = name;
      for (const it of warnings.slice(wBefore)) it.field = name;
    }

    // 답과 보기의 짝, 그림 파일.
    if (p.short) {
      if (!Number.isInteger(p.answer)) issues.push({ field: "answer", kind: "data", msg: `단답형인데 답이 정수가 아닙니다: ${p.answer}` });
    } else {
      if (!Array.isArray(p.choices) || p.choices.length !== 5) issues.push({ field: "choices", kind: "data", msg: `보기가 5개가 아닙니다: ${p.choices ? p.choices.length : "없음"}` });
      if (!(Number.isInteger(p.answer) && p.answer >= 1 && p.answer <= 5)) issues.push({ field: "answer", kind: "data", msg: `객관식 답이 1~5가 아닙니다: ${p.answer}` });
    }
    if (p.figure && !fs.existsSync(path.join(FIGURES, p.figure))) issues.push({ field: "figure", kind: "data", msg: `그림 파일이 없습니다: ${p.figure}` });

    const shown = STRICT ? issues.concat(warnings) : issues;
    if (shown.length) {
      console.log(`\n${p.id}  (data/exams/${file}:${lineOf(file, p.id)})`);
      for (const it of shown) console.log(`  [${it.kind}] ${it.field}: ${it.msg}`);
    }
    errorCount += issues.length;
    warnCount += warnings.length;
  }
}

console.log(`\n문항 ${problemCount}개를 보았습니다. 깨진 곳 ${errorCount}개, 경고 ${warnCount}개${STRICT ? "" : " (--strict로 경고 보기)"}.`);
process.exit(errorCount ? 1 : 0);
