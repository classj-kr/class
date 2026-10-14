'use strict';
// 2022 개정 교육과정 원문(references/moe/2022-revised-curriculum/extracted)에서 성취기준을 뽑아
// 수행평가 계획 메뉴가 쓰는 자료(apps/classtools/assessment-plan/data/*.json)를 만든다.
// 글은 고시 원문 그대로 옮기고 바꿔 쓰지 않는다. 다시 만들려면: node scripts/build-curriculum-standards.cjs
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'references/moe/2022-revised-curriculum/extracted');
const OUT_DIR = path.join(ROOT, 'apps/classtools/assessment-plan/data');
const SOURCE_NOTE = '교육부 고시 제2022-33호 초·중등학교 교육과정(2022-12-22) — https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0';

// 코드 글자 → 과목. 파일 이름은 영어로 두어 주소에 한글이 들어가지 않게 한다.
const SUBJECTS = {
  '국': { id: 'korean', name: '국어', file: '05-korean-language.txt' },
  '도': { id: 'ethics', name: '도덕', file: '06-ethics.txt' },
  '사': { id: 'social', name: '사회', file: '07-social-studies.txt' },
  '역': { id: 'history', name: '역사', file: '07-social-studies.txt' },
  '수': { id: 'math', name: '수학', file: '08-mathematics.txt' },
  '과': { id: 'science', name: '과학', file: '09-science.txt' },
  '실': { id: 'practical', name: '실과', file: '10-practical-arts-technology-home-economics-informatics.txt' },
  '기가': { id: 'tech-home', name: '기술·가정', file: '10-practical-arts-technology-home-economics-informatics.txt' },
  '정': { id: 'informatics', name: '정보', file: '10-practical-arts-technology-home-economics-informatics.txt' },
  '체': { id: 'pe', name: '체육', file: '11-physical-education.txt' },
  '음': { id: 'music', name: '음악', file: '12-music.txt' },
  '미': { id: 'art', name: '미술', file: '13-art.txt' },
  '영': { id: 'english', name: '영어', file: '14-english.txt' },
  '바': { id: 'integrated', name: '바른 생활', file: '15-integrated-life-subjects.txt' },
  '슬': { id: 'integrated', name: '슬기로운 생활', file: '15-integrated-life-subjects.txt' },
  '즐': { id: 'integrated', name: '즐거운 생활', file: '15-integrated-life-subjects.txt' },
};
const BANDS = {
  '2': { id: 'e12', label: '초등학교 1~2학년', school: '초등학교', grades: [1, 2] },
  '4': { id: 'e34', label: '초등학교 3~4학년', school: '초등학교', grades: [3, 4] },
  '6': { id: 'e56', label: '초등학교 5~6학년', school: '초등학교', grades: [5, 6] },
  '9': { id: 'm', label: '중학교 1~3학년', school: '중학교', grades: [7, 8, 9] },
};

const CODE_LINE = /^\[(\d{1,2})([가-힣]{1,3})(\d{2})-(\d{2})\]\s*(.*)$/;
const BAND_HEADER = /^\[?(초등학교|중학교|고등학교)\s*(?:\d\s*[∼~～\-]\s*\d\s*학년(?:군)?|[가-힣·]+)?\]?$/;
const DOMAIN_HEADER = /^\((\d{1,2})\)\s+(.+)$/;
const COMMENTARY_HEADER = /^\(가\)\s*성취기준\s*해설/;
const NOTES_HEADER = /^\(나\)\s*성취기준\s*적용\s*시\s*고려\s*사항/;
const OTHER_SUBHEADER = /^\([다-힣]\)\s/;
const TOPIC_LINE = /^[\u{F0000}-\u{FFFFD}-]\s*(.+)$/u;   // 󰊱 같은 사용자 영역 글자로 시작하는 내용 요소 제목

function parseFile(file) {
  const lines = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8').split(/\r?\n/).map((line) => line.replace(/\s+$/, ''));
  const standards = new Map();   // code → entry
  const domainNotes = [];        // { band, subject, domain, text }
  let section = 'none', domain = '', topic = '', band = '', last = null, bandDigit = '';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { continue; }
    if (BAND_HEADER.test(line)) { section = 'standards'; domain = ''; topic = ''; band = line; last = null; continue; }
    const domainMatch = line.match(DOMAIN_HEADER);
    if (domainMatch && section !== 'none' && domainMatch[2].length <= 40 && !/[.。]$/.test(domainMatch[2])) {
      domain = domainMatch[2].trim(); topic = ''; section = 'standards'; last = null; continue;
    }
    if (COMMENTARY_HEADER.test(line)) { section = 'commentary'; last = null; continue; }
    if (NOTES_HEADER.test(line)) { section = 'notes'; last = null; continue; }
    if (OTHER_SUBHEADER.test(line) && section !== 'none') { section = 'other'; last = null; continue; }
    const topicMatch = line.match(TOPIC_LINE);
    if (topicMatch && section === 'standards') { topic = topicMatch[1].trim(); last = null; continue; }
    const codeMatch = line.match(CODE_LINE);
    if (codeMatch) {
      const code = `${codeMatch[1]}${codeMatch[2]}${codeMatch[3]}-${codeMatch[4]}`;
      bandDigit = codeMatch[1];
      const text = codeMatch[5].trim();
      if (section === 'standards' || !standards.has(code)) {
        if (!standards.has(code)) {
          standards.set(code, { code, band: codeMatch[1], subject: codeMatch[2], domainNo: codeMatch[3], order: Number(codeMatch[4]), domain, topic, text, commentary: '', notes: '' });
          last = { entry: standards.get(code), field: 'text' };
        } else if (section === 'commentary') {
          const entry = standards.get(code); entry.commentary += (entry.commentary ? '\n' : '') + text; last = { entry, field: 'commentary' };
        } else if (section === 'notes') {
          const entry = standards.get(code); entry.notes += (entry.notes ? '\n' : '') + text; last = { entry, field: 'notes' };
        } else last = null;
        continue;
      }
      if (section === 'commentary') { const entry = standards.get(code); entry.commentary += (entry.commentary ? '\n' : '') + text; last = { entry, field: 'commentary' }; continue; }
      if (section === 'notes') { const entry = standards.get(code); entry.notes += (entry.notes ? '\n' : '') + text; last = { entry, field: 'notes' }; continue; }
      last = null; continue;
    }
    // 코드 없는 줄: 바로 앞 항목의 이어지는 글이거나, 고려 사항의 영역 전체 설명이다.
    if (section === 'notes' && !last) { domainNotes.push({ band: bandDigit, domain, text: line }); continue; }
    if (last && (section === 'commentary' || section === 'notes' || section === 'standards')) {
      // 성취기준 본문은 한 줄로 끝나는 것이 보통이라, 짧은 꼬리말만 붙인다.
      if (last.field === 'text' && !/[.다]$/.test(last.entry.text)) last.entry.text += ' ' + line;
      else if (last.field !== 'text') last.entry[last.field] += '\n' + line;
    }
  }
  return { standards: [...standards.values()], domainNotes };
}

function build() {
  const files = [...new Set(Object.values(SUBJECTS).map((s) => s.file))];
  const all = [];
  const notesByKey = new Map();
  for (const file of files) {
    const { standards, domainNotes } = parseFile(file);
    all.push(...standards.filter((s) => SUBJECTS[s.subject] && BANDS[s.band]));
    for (const note of domainNotes) {
      const key = `${file}|${note.band}|${note.domain}`;
      if (!notesByKey.has(key)) notesByKey.set(key, []);
      notesByKey.get(key).push(note.text);
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const index = { source: SOURCE_NOTE, builtAt: new Date().toISOString().slice(0, 10), bands: BANDS, subjects: [] };
  const bySubject = new Map();
  for (const s of all) {
    const subject = SUBJECTS[s.subject];
    if (!bySubject.has(subject.id)) bySubject.set(subject.id, { id: subject.id, name: subject.name, bands: {} });
    const sub = bySubject.get(subject.id);
    if (sub.name !== subject.name && !sub.name.includes(subject.name)) sub.name += '·' + subject.name;
    const bandId = BANDS[s.band].id;
    if (!sub.bands[bandId]) sub.bands[bandId] = { ...BANDS[s.band], domains: [] };
    const bandEntry = sub.bands[bandId];
    const domainName = s.domain || `영역 ${Number(s.domainNo)}`;
    let dom = bandEntry.domains.find((d) => d.no === s.domainNo && d.subject === s.subject);
    if (!dom) {
      dom = { no: s.domainNo, subject: s.subject, subjectName: subject.name, name: domainName, notes: notesByKey.get(`${subject.file}|${s.band}|${s.domain}`) || [], standards: [] };
      bandEntry.domains.push(dom);
    }
    dom.standards.push({ code: s.code, topic: s.topic, text: s.text, commentary: s.commentary, notes: s.notes });
  }
  let total = 0;
  for (const sub of bySubject.values()) {
    for (const bandEntry of Object.values(sub.bands)) {
      bandEntry.domains.sort((a, b) => a.subject.localeCompare(b.subject, 'ko') || a.no.localeCompare(b.no));
      for (const dom of bandEntry.domains) { dom.standards.sort((a, b) => a.code.localeCompare(b.code, 'en', { numeric: true })); total += dom.standards.length; }
    }
    fs.writeFileSync(path.join(OUT_DIR, `${sub.id}.json`), JSON.stringify({ source: SOURCE_NOTE, ...sub }, null, 1));
    index.subjects.push({ id: sub.id, name: sub.name, bands: Object.fromEntries(Object.entries(sub.bands).map(([id, b]) => [id, { label: b.label, grades: b.grades, domains: b.domains.map((d) => ({ name: d.name, subjectName: d.subjectName, count: d.standards.length })) }])) });
  }
  index.subjects.sort((a, b) => Object.keys(SUBJECTS).findIndex((k) => SUBJECTS[k].id === a.id) - Object.keys(SUBJECTS).findIndex((k) => SUBJECTS[k].id === b.id));
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 1));
  return { subjects: bySubject.size, total };
}

if (require.main === module) {
  const result = build();
  console.log(`성취기준 ${result.total}개, 과목 ${result.subjects}개 → ${path.relative(ROOT, OUT_DIR)}`);
}
module.exports = { build, parseFile };
