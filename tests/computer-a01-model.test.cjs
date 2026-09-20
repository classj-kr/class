const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../learning/inquiry/information-computing/computer-fundamentals/textbook/a01-model.js');

test('unsaved photo output disappears; closing alone cannot complete a lesson', () => {
    const s = M.photoSession();
    M.processPhoto(s, 'cat', 'color', 'color-image');
    assert.equal(M.openPhoto(s), false);
    M.closePhoto(s);
    assert.equal(s.current, null);
    assert.equal(s.saved, null);
    assert.equal(s.unsavedClosed, true);
    assert.equal(M.photoComplete(s), false);
});
test('a saved photo is an immutable snapshot and only reopen after close counts', () => {
    const s = M.photoSession();
    M.processPhoto(s, 'cat', 'gray', 'gray-image');
    M.savePhoto(s);
    M.openPhoto(s);
    assert.equal(s.reopened, false);
    M.processPhoto(s, 'cat', 'bright', 'bright-image');
    assert.equal(s.saved.image, 'gray-image');
    assert.equal(s.compared, true);
    M.closePhoto(s);
    M.openPhoto(s);
    assert.equal(s.current.image, 'gray-image');
    assert.equal(M.photoComplete(s), true);
});
test('two different photos do not prove a controlled comparison of rules', () => {
    const s = M.photoSession();
    M.processPhoto(s, 'cat', 'color', 'a');
    M.processPhoto(s, 'dog', 'gray', 'b');
    assert.equal(s.compared, false);
    M.processPhoto(s, 'dog', 'color', 'c');
    assert.equal(s.compared, true);
    assert.throws(() => M.processPhoto(s, 'bad', 'gray', 'x'));
});
test('independent task checks saved input and rule, not only the number 18', () => {
    const s = M.numberSession();
    assert.equal(M.checkNumber(s).reason, 'unsaved');
    M.processNumber(s, 15, 'add3'); M.saveNumber(s); M.closeNumber(s); M.openNumber(s);
    assert.equal(s.current.value, 18);
    assert.equal(M.checkNumber(s).reason, 'input');
    M.processNumber(s, 6, 'add3'); M.saveNumber(s); M.closeNumber(s); M.openNumber(s);
    assert.equal(M.checkNumber(s).reason, 'rule');
});
test('new correct output cannot pass while an older wrong result is saved', () => {
    const s = M.numberSession();
    M.processNumber(s, 4, 'add3'); M.saveNumber(s);
    M.processNumber(s, 6, 'times3');
    assert.equal(s.current.value, 18);
    assert.equal(s.saved.value, 7);
    assert.equal(M.checkNumber(s).ok, false);
    M.saveNumber(s);
    assert.equal(M.checkNumber(s).reason, 'reopen');
    M.openNumber(s);
    assert.equal(M.checkNumber(s).reason, 'reopen');
    M.closeNumber(s); M.openNumber(s);
    assert.equal(M.checkNumber(s).ok, true);
    M.processNumber(s, 8, 'times3');
    assert.equal(M.checkNumber(s).ok, false);
});
test('invalid or empty numbers do not create an output', () => {
    const s = M.numberSession();
    for (const n of ['', ' ', -1, 21, 2.5, NaN, Infinity, 'abc']) assert.equal(M.processNumber(s, n, 'times3'), false);
    assert.equal(M.processNumber(s, 6, 'unknown'), false);
    assert.equal(s.current, null);
    assert.equal(M.processNumber(s, 0, 'subtract3').value, -3);
});

