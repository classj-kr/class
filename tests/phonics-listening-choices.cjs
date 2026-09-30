const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
for (const site of ['phonics', 'phonics-site/public/phonics']) {
  const root = 'learning/literacy-numeracy/' + site;
  const context = vm.createContext({ window: {}, document: {} });
  vm.runInContext(fs.readFileSync(root + '/curriculum.js', 'utf8'), context);
  const app = fs.readFileSync(root + '/app.js', 'utf8');
  const prefix = app.slice(0, app.indexOf('  const emptyState'));
  const shuffle = app.slice(app.indexOf('  function shuffle('), app.indexOf('  function renderSoundGameRound('));
  vm.runInContext(prefix + shuffle + '\nwindow.test = { buildLessonSoundRounds, listeningFamily, soundsAlike };})();', context);
  const { buildLessonSoundRounds, listeningFamily, soundsAlike } = context.window.test;
  const data = context.window.PHONICS_CURRICULUM;
  const learned = new Set();
  let total = 0;
  for (const lesson of data.lessons) {
    lesson.words.forEach(word => learned.add(word));
    for (let repeat = 0; repeat < 30; repeat++) {
      const rounds = buildLessonSoundRounds(lesson);
      assert.equal(rounds.length, lesson.questionCount);
      assert.equal(new Set(rounds.map(round => round.answer)).size, lesson.questionCount);
      for (const round of rounds) {
        assert.ok(round.choices.length >= 2 && round.choices.length <= 4, lesson.id);
        assert.equal(round.choices.filter(word => word === round.answer).length, 1);
        assert.equal(new Set(round.choices.map(listeningFamily)).size, round.choices.length, lesson.id + ': confusing beginnings');
        for (const word of round.choices) {
          assert.ok(learned.has(word), lesson.id + ': future word ' + word);
          for (const other of round.choices) {
            if (word !== other) assert.equal(soundsAlike(word, other), false);
          }
        }
        total++;
      }
    }
  }
  for (const group of [['bat', 'bed', 'bath'], ['ship', 'sheep'], ['pin', 'pen'], ['cat', 'cap'], ['fan', 'van'], ['light', 'right']]) {
    assert.equal(new Set(group.map(listeningFamily)).size, 1);
  }
  console.log(site + ': all 128 lessons, ' + total + ' generated questions passed');
}
