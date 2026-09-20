const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('learning/inquiry/periodic-table/app.js', 'utf8');
const nodes = new Map();
function makeNode() {
    return {
        children: [], dataset: {}, style: {}, textContent: '', disabled: false,
        classList: { add() {} },
        addEventListener(event, handler) { this[event] = handler; },
        appendChild(child) { this.children.push(child); },
        set innerHTML(value) { this.html = value; this.children = []; },
        get innerHTML() { return this.html || ''; }
    };
}
const document = {
    getElementById(id) {
        if (!nodes.has(id)) nodes.set(id, makeNode());
        return nodes.get(id);
    },
    createElement: makeNode,
    querySelectorAll() { return this.getElementById('quizOptionsGrid').children; }
};
const context = vm.createContext({ window: {}, document });
vm.runInContext(fs.readFileSync('learning/inquiry/periodic-table/elements-data.js', 'utf8'), context);
const bank = source.slice(source.indexOf('    const QUIZ_DISTRACTORS'), source.indexOf('    // Initialize App'));
const quiz = source.slice(source.indexOf('    function initQuiz()'), source.indexOf('    function initLab3D()'));
vm.runInContext(`
    const state = { quiz: {} };
    const getExamElements = () => window.ELEMENTS_DATA.filter(el => el.number <= 20);
    const getShortGroup = group => group > 12 ? group - 10 : group;
    ${bank}
    ${quiz}
    globalThis.api = { state, loadNewQuestion, getQuizExplanation };
`, context);

const { api } = context;
const types = ['symbol_name', 'name_symbol', 'atomic_number', 'electron_arrangement', 'position'];
for (let number = 1; number <= 20; number++) {
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
        // Force each question target and type; keep option generation deterministic.
        context.randomValues = [(number - 0.5) / 20, (typeIndex + 0.5) / types.length];
        vm.runInContext('Math.random = () => randomValues.length ? randomValues.shift() : 0.42', context);
        api.loadNewQuestion();
        const question = api.state.quiz.currentQuestion;
        const buttons = document.getElementById('quizOptionsGrid').children;
        assert.equal(question.correctEl.number, number);
        assert.equal(question.chosenType, types[typeIndex]);
        assert.equal(buttons.length, 4);
        assert.equal(new Set(buttons.map(button => button.textContent)).size, 4);
        assert.equal(question.options.filter(option => option.isCorrect).length, 1);
        if (number === 2 && question.chosenType === 'name_symbol') {
            assert.deepEqual(buttons.map(button => button.textContent).sort(), ['H', 'HE', 'He', 'Hel'].sort());
        }
        if (number === 5 && question.chosenType === 'symbol_name') {
            assert.deepEqual(buttons.map(button => button.textContent).sort(), ['불소', '붕소', '붕산', '비소'].sort());
        }
        const correctIndex = question.options.findIndex(option => option.isCorrect);
        const wrongIndex = question.options.findIndex(option => !option.isCorrect);
        buttons[wrongIndex].click();
        assert.equal(api.state.quiz.answered, false);
        assert.equal(buttons[wrongIndex].disabled, true);
        assert.equal(document.getElementById('nextQuizBtn').hidden, true);
        assert.doesNotMatch(document.getElementById('quizResultMsg').innerHTML, /<span>/);
        buttons[correctIndex].click();
        assert.equal(api.state.quiz.answered, true);
        assert.equal(document.getElementById('nextQuizBtn').hidden, false);
        assert.ok(buttons.every(button => button.disabled));
        assert.match(document.getElementById('quizResultMsg').innerHTML, /<span>.+<\/span>/);
        api.state.quiz.answered = false;
        buttons[correctIndex].click();
        const correctMessage = document.getElementById('quizResultMsg').innerHTML;
        buttons[correctIndex].click();
        assert.equal(document.getElementById('quizResultMsg').innerHTML, correctMessage);
        assert.doesNotMatch(correctMessage, /콤보|[+]10|점수/);
    }
}
console.log('Periodic-table quiz: all 100 element/type combinations, unique choices, retry and explanations passed.');
