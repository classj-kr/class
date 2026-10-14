'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

let questions;
function mathQuestions() {
  if (!questions) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), context, { timeout: 2000 });
    questions = new Map(context.window.MATH_OX_DATA.map(q => [String(q.id), q]));
  }
  return questions;
}
const day = value => new Date(new Date(value).getTime() + 32400000).toISOString().slice(0, 10);
const inRange = (event, range) => !range || range.all || day(event.recorded_at) >= range.from && day(event.recorded_at) <= range.to;
function isMathCourse(row) {
  return row.activity === 'math-ox' && [...mathQuestions().values()].some(q => q.subject === row.content_key);
}

// A course checkpoint lets pupils move between units. The learning records
// inside it finish independently, on the first submission of every unit item.
// Deriving these from saved events also repairs old course-wide records without
// copying/deleting answers or changing first-attempt and retry history.
function mathUnits(row, events, range, summarize) {
  if (!isMathCourse(row)) return null;
  const groups = new Map();
  for (const [id, q] of mathQuestions()) {
    if (q.subject !== row.content_key) continue;
    if (!groups.has(q.unit)) groups.set(q.unit, { ids: new Set(), events: [] });
    groups.get(q.unit).ids.add(id);
  }
  for (const event of events) {
    const question = mathQuestions().get(event.question_key);
    if (question?.subject !== row.content_key || event.kind !== 'answer') continue;
    // A historical report must never show tomorrow's completion.
    if (range && !range.all && day(event.recorded_at) > range.to) continue;
    groups.get(question.unit).events.push(event);
  }
  const units = [];
  for (const [unit, group] of groups) {
    const ordered = group.events.slice().sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at) || Number(a.id) - Number(b.id));
    const visible = ordered.filter(event => inRange(event, range));
    if (!visible.length) continue;
    const answered = new Set();
    let completedAt = null;
    for (const event of ordered) {
      answered.add(event.question_key);
      if (!completedAt && answered.size === group.ids.size) completedAt = event.recorded_at;
    }
    units.push({
      unit, title: `수학 기초 OX · ${row.content_key} · ${unit}`,
      status: completedAt ? 'completed' : 'active',
      progress: { current: answered.size, total: group.ids.size },
      startedAt: ordered[0].recorded_at, updatedAt: visible.at(-1).recorded_at, completedAt,
      summary: summarize(visible)
    });
  }
  return units.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}
module.exports = { mathQuestions, isMathCourse, mathUnits, inRange };
