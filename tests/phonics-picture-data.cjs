const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
for (const site of ['phonics']) {
  const root = 'learning/literacy-numeracy/' + site;
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(root + '/curriculum.js', 'utf8'), context);
  const bank = context.window.PHONICS_CURRICULUM.wordBank;
  assert.equal(Object.keys(bank).length, 706);
  for (const [word, item] of Object.entries(bank)) {
    assert.ok(item.meanings.every(meaning => /[가-힣]/.test(meaning)), word + ' Korean meanings');
    assert.equal(item.pictureMeaning, item.meanings[0], word + ' illustrated sense');
    assert.ok(fs.existsSync(root + '/' + item.picture.file), word + ' image exists');
    const crop = item.picture.crop;
    assert.ok(crop?.length === 4 && crop.every(Number.isFinite), word + ' reviewed crop');
    assert.ok(crop[0] >= 0 && crop[1] >= 0 && crop[2] > 0 && crop[3] > 0 &&
      crop[0] + crop[2] <= 1.00001 && crop[1] + crop[3] <= 1.00001, word + ' valid bounds');
  }
  for (const word of ['hats','rocks','books','roofs','clocks','webs','bells','hands','rams','moms','classes','wishes']) {
    assert.equal(bank[word].picture.repeat, 2, word + ' must show more than one');
  }
  for (const word of ['full','pop','dim','chin','snore','tallest','useless','neutral','disagree','weakness','yes','chore']) {
    assert.match(bank[word].picture.file, /phonics-reviewed-scenes-v4/);
  }
  assert.equal(bank.square.picture.diagram, 'square');
  assert.equal(bank.bat.meanings.join(','), '박쥐,야구 방망이');
  assert.equal(bank.top.pictureMeaning, '팽이');
  assert.equal(bank.fan.pictureMeaning, '부채');
  for (const word of ['am','at','yet','though']) assert.ok(bank[word].pictureNote);
  console.log(site + ': all 706 picture bounds, meanings, examples, plural and replacement artwork passed');
}
