const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname, '../learning/arts/music-theory/ear-training');
const context = vm.createContext({window:{}});
for (const file of ['wheel.js', 'wheel-practice.js', 'course.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const practice = context.window.WheelPractice;
const bank = practice.questionBank();
const answer = id => bank.find(q => q.id === id)?.answer;

test('circle questions preserve theoretical spelling and enharmonic key signatures', () => {
    assert.equal(answer('signature:C:read'), '조표 없음');
    assert.equal(answer('signature:F♯:read'), '♯ 6개');
    assert.equal(answer('signature:G♭:read'), '♭ 6개');
    assert.equal(answer('relative:F♯:minor'), 'D♯ 단조');
    assert.equal(answer('relative:G♭:minor'), 'E♭ 단조');
    assert.equal(answer('relative:B:major'), 'B 장조');
    assert.equal(answer('neighbors:C:시계'), 'G 장조');
    assert.equal(answer('neighbors:C:반시계'), 'F 장조');
    assert.equal(answer('neighbors:E:시계'), 'B 장조');
    assert.equal(answer('neighbors:A♭:반시계'), 'D♭ 장조');
    assert.equal(answer('diatonic:F♯:vii°'), 'E♯dim');
    assert.equal(answer('diatonic:G♭:IV'), 'C♭');
    assert.equal(answer('diatonic:B:iii'), 'D♯m');
    assert.equal(answer('diatonic:D♭:ii'), 'E♭m');
    assert.equal(bank.length, 179);
    assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
    for (const question of bank) {
        assert.ok(question.options.includes(question.answer), question.id);
        assert.ok(!/undefined|NaN/.test(question.prompt + question.answer + question.explanation));
    }
});

test('rounds contain ten different questions with four unambiguous choices', () => {
    let seed = 1019;
    const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (const topic of [...practice.TOPICS, 'mixed']) {
        for (let sample = 0; sample < 30; sample++) {
            const round = practice.buildRound(topic, random);
            assert.equal(round.length, 10);
            assert.equal(new Set(round.map(q => q.id)).size, 10);
            for (const question of round) {
                assert.equal(question.choices.length, 4);
                assert.equal(new Set(question.choices).size, 4);
                assert.equal(question.choices.filter(choice => choice === question.answer).length, 1);
            }
            if (topic === 'mixed') {
                for (const type of practice.TOPICS) assert.equal(round.filter(q => q.type === type).length, 2);
            } else assert.ok(round.every(q => q.type === topic));
        }
    }
    assert.throws(() => practice.buildRound('invalid'));
});

test('the independent circle course has five lessons and a mixed round', () => {
    const course = context.window.EarCourses.find(course => course.id === 'wheel');
    assert.equal(course.lessons.filter(lesson => lesson.body).length, 5);
    assert.equal(course.lessons.length, 6);
    assert.deepEqual(Array.from(course.lessons, lesson => lesson.practice), [...practice.TOPICS, 'mixed']);
    assert.ok(course.lessons.filter(lesson => lesson.body).every(lesson => lesson.body.length === 2));
});
