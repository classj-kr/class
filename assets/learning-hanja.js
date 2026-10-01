(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const records = LearningRecords.create('hanja-meaning', { label: '한자' });
  const key = location.pathname.split('/v2/')[1].replace(/(?:index\.html)?\/?$/, '');
  const data = $('quiz-data');
  const shuffle = items => { const result = [...items]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
  let busy = true;
  const lock = value => { busy = value; document.querySelector('main').inert = value; };
  lock(true);
  if (!data) {
    const questions = [...document.querySelectorAll('.question')];
    const session = await records.start({ contentKey: key, title: `한자 · ${document.title.split('|')[0].trim()}`, version: '20261002',
      checkpoint: { mode: 'study', answers: {}, orders: questions.map(q => shuffle([...q.querySelectorAll('.choice')].map(b => b.dataset.index))) } });
    const state = session.checkpoint;
    const correctFor = (q, i) => (state.answers[i] || []).includes(q.dataset.answer);
    const save = async events => {
      const current = questions.filter(correctFor).length;
      await records.save({ checkpoint: state, progress: { current, total: questions.length }, events, complete: current === questions.length });
      if (current === questions.length) records.showResult();
    };
    function render() {
      $('lesson').hidden = state.mode === 'quiz'; $('quiz').hidden = state.mode !== 'quiz';
      questions.forEach((q, i) => {
        const tried = state.answers[i] || [], solved = correctFor(q, i), box = q.querySelector('.choices');
        const buttons = [...q.querySelectorAll('.choice')];
        state.orders[i].forEach((id, index) => {
          const button = buttons.find(b => b.dataset.index === id); box.append(button);
          button.firstChild.nodeValue = '①②③④'[index] + button.firstChild.nodeValue.slice(1);
          button.disabled = solved || tried.includes(id);
          button.classList.toggle('wrong', tried.includes(id) && id !== q.dataset.answer);
          button.classList.toggle('correct', tried.includes(id) && id === q.dataset.answer);
          button.onclick = async () => {
            if (busy || solved) return; lock(true);
            (state.answers[i] ||= []).push(id);
            await save([{ kind: 'answer', questionKey: String(i), response: button.textContent.slice(1).trim(), correct: id === q.dataset.answer,
              snapshot: { prompt: q.querySelector('h2').textContent, choices: buttons.map(b => b.textContent.slice(1).trim()) } }]);
            render(); lock(false);
          };
        });
        q.querySelector('.feedback').textContent = solved ? '맞았습니다. ' + q.dataset.note : tried.length ? '다시 생각해 보세요.' : '';
      });
    }
    $('startQuiz').onclick = async () => { if (busy) return; lock(true); state.mode = 'quiz'; await save([]); render(); lock(false); };
    $('backLesson').onclick = async () => { if (busy || records.session.status === 'completed') return; lock(true); state.mode = 'study'; await save([]); render(); lock(false); };
    render(); lock(false);
  } else {
    const source = JSON.parse(data.textContent);
    const session = await records.start({ contentKey: key, title: '한자 · ' + document.title, version: '20261002', checkpoint: {
      questions: shuffle(source).map(q => ({ ...q, options: shuffle(q.options) })), current: 0, tried: {} } });
    const state = session.checkpoint;
    const solved = i => (state.tried[i] || []).some(index => state.questions[i].options[index].correct);
    async function save(events = [], complete = false) {
      await records.save({ checkpoint: state, progress: { current: state.questions.filter((_, i) => solved(i)).length, total: state.questions.length }, events, complete });
    }
    function render() {
      const q = state.questions[state.current], tried = state.tried[state.current] || [], done = solved(state.current);
      $('question-card').hidden = false; $('result').hidden = true;
      $('progress').textContent = `${state.current + 1} / ${state.questions.length}`;
      $('question-number').textContent = `문제 ${state.current + 1}`; $('prompt').textContent = q.prompt;
      $('progress-bar').style.width = `${state.current / state.questions.length * 100}%`;
      $('feedback').textContent = done ? '맞았습니다. ' + q.note : tried.length ? '다시 생각해 보세요.' : '';
      $('choices').replaceChildren(...q.options.map((option, index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'choice';
        button.textContent = '①②③④'[index] + ' ' + option.sentence.replaceAll('{{', '').replaceAll('}}', '');
        button.disabled = done || tried.includes(index);
        if (tried.includes(index)) button.classList.add(option.correct ? 'correct' : 'wrong');
        button.onclick = async () => {
          if (busy) return; lock(true); (state.tried[state.current] ||= []).push(index);
          await save([{ kind: 'answer', questionKey: String(state.current), response: option.word, correct: option.correct, snapshot: { prompt: q.prompt, choices: q.options.map(o => o.word) } }]);
          render(); lock(false);
        }; return button;
      }));
      $('next').hidden = !done; $('next').textContent = state.current === state.questions.length - 1 ? '학습 완료' : '다음 문제';
    }
    $('score')?.remove(); $('result-score')?.remove();
    $('next').onclick = async () => {
      if (busy || !solved(state.current)) return; lock(true);
      if (state.current < state.questions.length - 1) { state.current++; await save(); render(); }
      else { await save([], true); $('question-card').hidden = true; $('result').hidden = false; records.showResult(); }
      lock(false);
    };
    $('restart').onclick = () => location.reload(); render(); lock(false);
  }
})();
