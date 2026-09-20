(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.A01Model = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
    'use strict';
    const operations = {
        add3: { label: '3을 더한다', apply: (n) => n + 3 },
        times3: { label: '3배로 만든다', apply: (n) => n * 3 },
        subtract3: { label: '3을 뺀다', apply: (n) => n - 3 }
    };
    function photoSession() {
        return { serial: 0, current: null, saved: null, seen: {}, compared: false, unsavedClosed: false, reopened: false, closed: false };
    }
    function processPhoto(state, input, rule, image) {
        if (!['cat', 'dog'].includes(input) || !['color', 'gray', 'bright'].includes(rule)) throw new Error('Unknown photo setting');
        const result = { id: ++state.serial, input, rule, image };
        state.current = result;
        state.closed = false;
        state.seen[input] = Array.from(new Set([...(state.seen[input] || []), rule]));
        state.compared = Object.values(state.seen).some((rules) => rules.length > 1);
        return result;
    }
    function savePhoto(state) {
        if (!state.current) return false;
        state.saved = { ...state.current };
        return true;
    }
    function closePhoto(state) {
        if (!state.current) return false;
        if (!state.saved || state.current.id !== state.saved.id) state.unsavedClosed = true;
        state.current = null;
        state.closed = true;
        return true;
    }
    function openPhoto(state) {
        if (!state.saved) return false;
        if (state.closed) state.reopened = true;
        state.current = { ...state.saved };
        state.closed = false;
        return true;
    }
    const photoComplete = (state) => state.compared && state.unsavedClosed && state.reopened;
    function numberSession() {
        return { serial: 0, current: null, saved: null, closed: false, reopenedId: null };
    }
    function processNumber(state, input, operation) {
        const value = Number(input);
        if (String(input).trim() === '' || !Number.isInteger(value) || value < 0 || value > 20 || !operations[operation]) return false;
        state.current = { id: ++state.serial, input: value, operation, value: operations[operation].apply(value) };
        state.closed = false;
        state.reopenedId = null;
        return state.current;
    }
    function saveNumber(state) {
        if (!state.current) return false;
        state.saved = { ...state.current };
        state.reopenedId = null;
        return true;
    }
    function closeNumber(state) {
        if (!state.current) return false;
        state.current = null;
        state.closed = true;
        state.reopenedId = null;
        return true;
    }
    function openNumber(state) {
        if (!state.saved) return false;
        state.reopenedId = state.closed ? state.saved.id : null;
        state.current = { ...state.saved };
        state.closed = false;
        return true;
    }
    function checkNumber(state) {
        if (!state.saved) return { ok: false, reason: 'unsaved', text: '저장된 결과가 없습니다. 화면에 수가 나타나는 것과 나중에 다시 열 수 있게 기록하는 것은 다른 일입니다.' };
        if (state.saved.input !== 6) return { ok: false, reason: 'input', text: '저장된 기록의 입력값을 확인하세요. 이 문제에서 한 봉지에 든 구슬은 6개입니다.' };
        if (state.saved.operation !== 'times3') return { ok: false, reason: 'rule', text: '저장된 규칙으로는 세 봉지의 구슬 수를 구하지 못합니다. 한 봉지의 개수를 세 번 모으는 규칙이 필요합니다.' };
        if (!state.current || state.reopenedId !== state.saved.id) return { ok: false, reason: 'reopen', text: '계산한 결과는 저장되어 있습니다. 현재 작업을 닫은 다음 저장한 결과를 다시 열어, 남아 있는 값을 확인하세요.' };
        return { ok: true, text: '입력 6 → 3배로 처리 → 18 출력. 작업을 닫은 뒤에도 저장한 18을 다시 열었습니다.' };
    }
    return { operations, photoSession, processPhoto, savePhoto, closePhoto, openPhoto, photoComplete, numberSession, processNumber, saveNumber, closeNumber, openNumber, checkNumber };
});

