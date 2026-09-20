const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../learning/arts/art-theory/color-mixing/model.js');

test('RGB spotlights add independent linear-light components', () => {
  const cases = [ [[0,0,0],[0,0,0]], [[100,0,0],[255,0,0]], [[0,100,0],[0,255,0]], [[0,0,100],[0,0,255]], [[100,100,0],[255,255,0]], [[100,0,100],[255,0,255]], [[0,100,100],[0,255,255]], [[100,100,100],[255,255,255]] ];
  for (const [input, output] of cases) assert.deepEqual(M.rgb('light', input), output);
});
test('ideal CMY filters remove the corresponding component from white light', () => {
  const cases = [ [[0,0,0],[255,255,255]], [[100,0,0],[0,255,255]], [[0,100,0],[255,0,255]], [[0,0,100],[255,255,0]], [[100,100,0],[0,0,255]], [[100,0,100],[0,255,0]], [[0,100,100],[255,0,0]], [[100,100,100],[0,0,0]] ];
  for (const [input, output] of cases) assert.deepEqual(M.rgb('filter', input), output);
});
test('half intensity is encoded as linear light, not half an sRGB byte', () => {
  assert.deepEqual(M.rgb('light', [50,0,0]), [188,0,0]);
  assert.deepEqual(M.rgb('filter', [50,0,0]), [188,255,255]);
  assert.deepEqual(M.components('filter', [25,50,75]), [.75,.5,.25]);
});
test('turning up one source only increases its component; a filter only removes it', () => {
  let lastLight = -1, lastFilter = 256;
  for (let amount = 0; amount <= 100; amount++) {
    const light = M.rgb('light', [amount,25,75]);
    const filter = M.rgb('filter', [amount,25,75]);
    assert.ok(light[0] >= lastLight);assert.ok(filter[0] <= lastFilter);
    assert.deepEqual(light.slice(1), [137,225]);
    assert.deepEqual(filter.slice(1), [225,137]);
    lastLight=light[0];lastFilter=filter[0];
  }
});
test('bad values cannot produce invalid canvas colors', () => {
  assert.deepEqual(M.rgb('light', [-20,180,NaN]), [0,255,0]);
  assert.throws(() => M.rgb('paint', [10,10,10]), /Unknown/);
});
test('every experiment answer agrees with the observed result', () => {
  for (const experiment of M.experiments) {
    assert.equal(M.name(M.rgb(experiment.mode,experiment.values)), experiment.answer);
    assert.ok(experiment.options.includes(experiment.answer));
  }
});
