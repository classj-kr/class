'use strict';
const fs = require('node:fs');
const path = require('node:path');
const editions = require('./data/textbooks/catalog-2022.json').editions;
const assessments = require('./data/textbooks/assessment-catalog-2022.json').assessments;
const plans = fs.readdirSync(path.join(__dirname, 'data/textbooks'))
  .filter(n => /^pacing-.+-2022\.json$/.test(n)).flatMap(n => require('./data/textbooks/' + n).plans);
const textbookSubject = s => ['바른 생활', '슬기로운 생활', '즐거운 생활'].includes(s) ? '통합교과' : s;
function resourcesFor(editionId, grade, semester, subject) {
  const edition = editions.find(e => e.id === editionId && e.grades.includes(grade) && e.subject === textbookSubject(subject));
  if (!edition) return { edition: null, assessments: [], plans: [] };
  return {
    edition: { id: edition.id, label: edition.label },
    assessments: assessments.filter(a => a.editionId === editionId && a.grade === grade && (!a.semester || a.semester === semester)),
    plans: plans.filter(p => p.editionId === editionId && p.grade === grade && (!p.semester || p.semester === semester)).map(p => ({
      id: p.id, semester: p.semester, lessons: p.lessons.filter(l => (!l.semester || l.semester === semester)
        && (edition.subject !== '통합교과' || !l.sourceSubject || l.sourceSubject === subject || l.sourceSubject === '통합교과'))
        .map(l => ({ id: l.id, unit: l.unit, topic: l.topic, periodText: l.periodText }))
    }))
  };
}
function subjectsFor(grade) {
  return grade <= 2 ? ['국어', '수학', '바른 생활', '슬기로운 생활', '즐거운 생활']
    : ['국어', '도덕', '사회', '수학', '과학', ...(grade >= 5 ? ['실과'] : []), '체육', '음악', '미술', '영어'];
}
function resolveTiming(item, schedule, editionId) {
  if (item.timingMode === 'manual') return item.timingText || '';
  if (!item.pacing?.lessonIds?.length || item.pacing.editionId !== editionId || schedule?.editionId !== editionId) return '';
  const rows = new Map((schedule.entries || []).map(e => [e.lessonId, e.timing]));
  const values = item.pacing.lessonIds.map(id => rows.get(id));
  return values.every(Boolean) ? [...new Set(values)].join(' · ') : '';
}
module.exports = { resourcesFor, subjectsFor, textbookSubject, resolveTiming };
