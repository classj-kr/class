const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const topics = require('../learning/inquiry/space/topic-catalog.js');
const context = { window: {} };
for (const file of ['space-content', 'space-practice']) {
    vm.runInNewContext(fs.readFileSync(`learning/inquiry/curriculum/${file}.js`, 'utf8'), context);
}
const levels = ['elementary', 'middle', 'high'];
const catalog = context.window.SchoolContent;
const banks = {};
for (const app of ['solar-system', 'constellations', 'earth-moon']) {
    const source = fs.readFileSync(`learning/inquiry/space/${app}/app.js`, 'utf8');
    banks[app] = {
        questions: vm.runInNewContext('(' + source.match(/(?:var quizPool|const quizData) = (\[[\s\S]*?\n\s*\]);/)[1] + ')'),
        topics: vm.runInNewContext('(' + source.match(/(?:var|const) quizTopics = (\[[\s\S]*?\n\s*\]);/)[1] + ')')
    };
}
test('question identifiers, revisions and correct choices are unambiguous across space banks', () => {
    const questions = Object.values(banks).flatMap(bank => bank.questions)
        .concat(Object.values(catalog).flatMap(profiles => Object.values(profiles).flatMap(profile => profile.questions || [])));
    const ids = new Set();
    for (const q of questions) {
        assert.ok(q.id && !ids.has(q.id), 'unique stable id: ' + q.id);
        ids.add(q.id);
        assert.ok(Number.isInteger(q.revision) && q.revision > 0, q.id);
        assert.ok(q.schoolLevels.length && q.schoolLevels.every(level => levels.includes(level)), q.id);
        assert.ok(q.opts.length >= 3 && new Set(q.opts).size === q.opts.length, q.id);
        const answer = typeof q.ans === 'number' ? q.ans : q.opts.indexOf(q.ans);
        assert.ok(Number.isInteger(answer) && answer >= 0 && answer < q.opts.length, q.id);
        assert.ok(q.exp.length > 15, q.id);
        if (q.table) assert.ok(q.table.rows.every(row => row.length === q.table.headers.length), q.id);
    }
});
test('every space route has multiple choice questions in all three school modes', () => {
    for (const topic of topics.topics) for (const level of levels) {
        const bank = banks[topic.app];
        const selected = catalog['space-' + topic.id][level].questions || topics.scopeQuiz({
            questions: bank.questions.filter(q => q.schoolLevels.includes(level)), topics: bank.topics
        }, topic).questions;
        assert.ok(selected.length > 0, `${topic.id} ${level}`);
        assert.ok(selected.every(q => q.schoolLevels.includes(level)), `${topic.id} ${level}`);
    }
});
test('north-sky level changes replace both the lesson and assessment, with data interpretation', () => {
    const seen = new Set();
    for (const level of levels) {
        const p = catalog['space-north-sky'][level];
        assert.ok(p.sections.length >= 3);
        assert.ok(p.questions.some(q => q.table), level + ' includes an observation/data table');
        for (const q of p.questions) {
            assert.ok(!seen.has(q.id)); seen.add(q.id);
        }
        const text = p.sections.flatMap(s => s.paragraphs).join(' ');
        assert.ok(!/미래엔|양일호|김태일|이진우/.test(text));
    }
    // Independent numerical checks for the worked circumpolar examples.
    const minimumAltitude = (latitude, declination) => latitude + declination - 90;
    assert.equal(minimumAltitude(37, 60), 7);
    assert.equal(minimumAltitude(30, 55), -5);
    assert.equal(minimumAltitude(40, 55), 5);
    assert.deepEqual([50, 53, 60].filter(dec => minimumAltitude(37, dec) > 0), [60]);
});
