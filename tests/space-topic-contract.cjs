const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const topics = require('../learning/inquiry/space/topic-catalog.js');
const hub = fs.readFileSync('learning/inquiry/space/index.html', 'utf8');
let total = 0;
for (const app of ['solar-system', 'constellations', 'earth-moon']) {
    const source = fs.readFileSync(`learning/inquiry/space/${app}/app.js`, 'utf8');
    const questions = vm.runInNewContext('(' + source.match(/(?:var quizPool|const quizData) = (\[[\s\S]*?\n\s*\]);/)[1] + ')', {}, { timeout: 1000 });
    const sections = vm.runInNewContext('(' + source.match(/(?:var|const) quizTopics = (\[[\s\S]*?\n\s*\]);/)[1] + ')', {}, { timeout: 1000 });
    const appTopics = topics.topics.filter(topic => topic.app === app);
    questions.forEach(question => {
        assert.equal(appTopics.filter(topic => topics.matches(topic, question)).length, 1, question.q);
    });
    appTopics.forEach(topic => {
        assert.ok(hub.includes(`href="${topics.href(topic)}"`), topic.id + ' has a hub link');
        const route = new URL('http://localhost/learning/inquiry/space/' + topics.href(topic));
        assert.equal(topics.current(route), topic);
        const scoped = topics.scopeQuiz({ questions, topics: sections }, topic);
        assert.ok(scoped.questions.length, topic.id + ' has relevant questions');
        scoped.questions.forEach(question => {
            assert.ok(scoped.topics[0].subs.some(sub => sub.cats.includes(question.cat)), question.q);
        });
        assert.ok(topic.concepts.length && topic.concepts.every(([heading, body]) => heading && body));
    });
    total += questions.length;
}
assert.equal(topics.current(new URL('http://localhost/learning/inquiry/space/')), null);
assert.equal(topics.current(new URL('http://localhost/learning/inquiry/space/earth-moon/?topic=celestial-sphere')).id, 'moon-phases');
assert.equal(topics.get('celestial-sphere').title, '천구');
assert.equal(topics.get('earth-motion').title, '지구와 달의 운동');
assert.equal(topics.get('sun-path').title, '계절별 태양의 남중 고도');
assert.notEqual(topics.href(topics.get('earth-motion')), topics.href(topics.get('sun-path')));
console.log(`Space subjects: ${topics.topics.length} independent routes; ${total} existing questions assigned once; concept and subtopic coverage passed.`);
