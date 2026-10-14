'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'game-hub-server/data/textbooks');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const catalog = read(path.join(dir, 'catalog-2022.json'));
const plans = fs.readdirSync(dir).filter(f => /^pacing-.+-2022\.json$/.test(f)).flatMap(f => read(path.join(dir, f)).plans);
const pdfs = read(path.join(root, 'references/textbooks/ybm-public-sources.json')).sources;
const coverage = catalog.editions.flatMap(e => e.grades.map(grade => {
  const matches = plans.filter(p => p.editionId === e.id && p.grade === grade);
  const pending = pdfs.filter(p => e.publisher === '와이비엠' && p.subject === e.subject && p.author === e.leadAuthor && p.gradeBand === e.gradeBand && !matches.some(m => m.sourceId === p.contentId)).map(p => p.contentId);
  return {editionId:e.id, grade, publisher:e.publisher, subject:e.subject,
    status:matches.length ? 'acquired' : pending.length ? 'pdf-review-pending' : 'not-acquired',
    plans:matches.map(p => p.id), pendingPdfSources:pending,
    semesters:[...new Set(matches.flatMap(p => p.lessons.map(l => l.semester)).filter(s => s != null))].sort(),
    hasUnassignedSemester:matches.some(p => p.lessons.some(l => l.semester == null))};
}));
fs.writeFileSync(path.join(dir, 'pacing-coverage.json'), JSON.stringify({schemaVersion:1,coverage}, null, 2) + '\n');
console.log(JSON.stringify({plans:plans.length, lessonRows:plans.reduce((n,p) => n+p.lessons.length,0), acquiredGradeEditions:coverage.filter(c=>c.status==='acquired').length, totalGradeEditions:coverage.length}));
