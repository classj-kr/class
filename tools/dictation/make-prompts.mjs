// 받아쓰기 그림 지시문 만들기. 문항을 열두 개씩 묶어 한 장(가로 4칸, 세로 3칸)으로 그리게 한다.
// node tools/dictation/make-prompts.mjs
// 결과: tools/dictation/<학기>/IMAGE-PROMPTS.md, tools/dictation/sheets.json
// 이미 있는 장은 그대로 두고, 아직 어느 장에도 없는 문항만 새 장으로 묶는다(그려 둔 그림과 번호가 어긋나지 않게).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, '../../learning/literacy-numeracy/dictation/data.js');
const sheetsFile = path.join(here, 'sheets.json');
const PER_SHEET = 12;

const box = { window: {} };
vm.runInNewContext(fs.readFileSync(dataFile, 'utf8'), box);
const sheets = fs.existsSync(sheetsFile) ? JSON.parse(fs.readFileSync(sheetsFile, 'utf8')) : {};
const drawn = new Set(Object.values(sheets).flat());

const promptFor = (items) => `One landscape 3:2 image: a neat grid of exactly 12 equal panels, 4 across and 3 down, separated by thin straight black lines, on a white background.
Each panel holds one simple, clean picture-card illustration for young Korean children showing the meaning of the Korean word or sentence listed below. Style: tidy dark outlines, 2 to 4 flat colors, no shading, no background scenery, very few details, the subject large and centered. Not a scribble or a rough sketch. Draw it quickly and keep it simple.
Absolutely no text, letters, numbers or symbols anywhere in the image, and no panel numbers.
Panels from left to right, top row first:
${items.map((text, i) => `${i + 1}. ${text}`).join('\n')}${items.length < PER_SHEET ? `\nLeave the remaining ${PER_SHEET - items.length} panels empty.` : ''}`;

for (const term of box.window.DICTATION_TERMS) {
  const prefix = `${term.term}-`;
  const fresh = term.units.flatMap((unit) => unit.items).filter((text) => !drawn.has(text));
  let next = Object.keys(sheets).filter((id) => id.startsWith(prefix)).length + 1;
  for (let i = 0; i < fresh.length; i += PER_SHEET) {
    sheets[prefix + String(next++).padStart(2, '0')] = fresh.slice(i, i + PER_SHEET);
  }
  const ids = Object.keys(sheets).filter((id) => id.startsWith(prefix)).sort();
  const parts = [`# 받아쓰기 ${term.label} 그림 지시문\n\n한 장에 12칸이다. 그린 그림은 파일 이름을 아래 굵은 이름(예: ${ids[0]})으로 시작하게 저장해 E:/webprojects/dictation-images/${term.term}/ 폴더에 넣는다. 그림 속에 글자가 생기거나 칸이 12개가 아니면 다시 만든다.\n`];
  for (const id of ids) parts.push(`**${id}**\n\n\`\`\`text\n${promptFor(sheets[id])}\n\`\`\`\n`);
  fs.mkdirSync(path.join(here, term.term), { recursive: true });
  fs.writeFileSync(path.join(here, term.term, 'IMAGE-PROMPTS.md'), parts.join('\n'));
  console.log(term.term, `${ids.length}장`, `${ids.reduce((n, id) => n + sheets[id].length, 0)}문항`);
}
fs.writeFileSync(sheetsFile, `${JSON.stringify(sheets, null, 0).replace(/\],"/g, '],\n"')}\n`);
