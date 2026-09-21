const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dir = path.join(__dirname, '../learning/arts/music-theory/ear-training');
const builds = [];
let board;
const element = () => ({ hidden: false, textContent: '', classList: { toggle() {} } });
const context = vm.createContext({
    window: { Keyboard: { build(container, low, high) {
        board = { low, high, clearMarks() {}, setEnabled() {}, mark(midi) {
            assert.ok(midi >= low && midi <= high, `Missing given key ${midi}`);
        }, centerOn() { assert.fail('Question must not move the keyboard'); } };
        builds.push(board);
        return board;
    } } },
    document: { readyState: 'loading', addEventListener() {} }
});
vm.runInContext(fs.readFileSync(path.join(dir, 'notation.js'), 'utf8'), context);
const source = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
vm.runInContext(source.replace('    if (document.readyState === "loading")',
    '    window.testInput = { session, els, setupInput };\n    if (document.readyState === "loading")'), context);
const { session, els, setupInput } = context.window.testInput;
for (const name of ['pianoKeys', 'pairWrap', 'slotWrap', 'choices', 'drillScreen', 'typedCount']) els[name] = element();
session.input = 'keyboard';
let count = 0;
for (const drill of context.window.EarTraining.drills.filter(d => d.inputs.includes('keyboard'))) {
    session.drill = drill;
    let initialBoard;
    let initialBuilds;
    for (const item of drill.items) {
        for (let i = 0; i < 60; i++) {
            const question = drill.make(item);
            setupInput(question);
            if (!initialBoard) {
                initialBoard = board;
                initialBuilds = builds.length;
                els.pianoKeys.scrollLeft = 25;
            }
            assert.equal(board, initialBoard, `${drill.id}: board changed between questions`);
            assert.equal(builds.length, initialBuilds);
            assert.equal(els.pianoKeys.scrollLeft, 25, 'Preserve manual scroll between questions');
            for (const midi of question.keyboard.answer) {
                assert.ok(midi >= board.low && midi <= board.high, `${drill.id}: missing answer ${midi}`);
            }
            count++;
        }
    }
}
console.log(`ear-training fixed keyboard: ${count} questions keep their board, scroll and playable answers`);
