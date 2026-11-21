export const LEVELS = { elementary: '초', middle: '중', high: '고' };
export const AREAS = { korea: '우리나라', world: '세계', history: '세계사' };
export const AREA_PATHS = { korea:'/learning/inquiry/korea-map/blank/', world:'/learning/inquiry/globe/blank/', history:'/learning/inquiry/globe/history/blank/' };

export function eligible(sets, level, area) {
  return sets.filter(set => set.level === level && set.area === area);
}
export function newSession(set, questions = set.questions) {
  return { setId: set.id, questions, at: 0, selected: [], attempts: 0, solved: false, results: [] };
}
export function selectPoint(state, id) {
  if (state.solved) return state;
  const q = state.questions[state.at];
  if (!q.points.includes(id)) return state;
  const selected = q.mode === 'multi' || q.mode === 'order'
    ? state.selected.includes(id) ? state.selected.filter(p => p !== id) : [...state.selected, id].slice(-q.answer.length)
    : [id];
  return { ...state, selected };
}
export function checkAnswer(state) {
  if (state.solved) return { state, status: 'solved' };
  const q = state.questions[state.at];
  if (state.selected.length !== q.answer.length) return { state, status: 'incomplete' };
  const correct = q.mode === 'order'
    ? q.answer.every((id, i) => state.selected[i] === id)
    : q.answer.every(id => state.selected.includes(id));
  const next = { ...state, attempts: state.attempts + 1, solved: correct };
  if (correct) next.results = [...state.results, { id: q.id, firstTry: next.attempts === 1, attempts: next.attempts }];
  return { state: next, status: correct ? 'correct' : 'wrong' };
}
export function nextQuestion(state) {
  if (!state.solved) return state;
  return { ...state, at: state.at + 1, selected: [], attempts: 0, solved: false };
}
export function retryQuestions(state) {
  const wrong = new Set(state.results.filter(r => !r.firstTry).map(r => r.id));
  return state.questions.filter(q => wrong.has(q.id));
}
export function validateSets(sets, points) {
  const ids = new Set(), errors = [];
  for (const s of sets) {
    if (ids.has(s.id)) errors.push(`Duplicate set: ${s.id}`);
    ids.add(s.id);
    if (!LEVELS[s.level] || !AREAS[s.area] || !s.source || !s.band) errors.push(`Metadata: ${s.id}`);
    for (const q of s.questions) {
      if (ids.has(q.id)) errors.push(`Duplicate question: ${q.id}`);
      ids.add(q.id);
      if (!q.prompt || !q.hint || !q.explanation || !q.answer.length) errors.push(`Content: ${q.id}`);
      if (new Set(q.points).size !== q.points.length || new Set(q.answer).size !== q.answer.length) errors.push(`Repeated point: ${q.id}`);
      if (!q.answer.every(id => q.points.includes(id)) || q.points.some(id => !points[id])) errors.push(`Point: ${q.id}`);
      if (q.points.length <= q.answer.length) errors.push(`No alternatives: ${q.id}`);
      if (q.chart && (q.chart.temperature.length !== 12 || q.chart.rain.length !== 12)) errors.push(`Chart: ${q.id}`);
      if (s.level === 'high' && !q.table && !q.chart && q.mode !== 'order' && q.mode !== 'multi') errors.push(`Missing reasoning material: ${q.id}`);
    }
  }
  return errors;
}
