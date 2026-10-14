/* Shared study / multiple-choice lesson runner. Checkpoints include the exact
   question and choice order, so another device resumes the same question. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const shuffle = items => { const out = [...items]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; };
  const node = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };
  window.runRecordedLessons = async function (config) {
    const records = LearningRecords.create(config.activity, { label: config.label });
    let language = 'ko', lessonIndex = 0, state = null, busy = false, statuses = new Map();
    const setBusy = value => { busy = value; $('learningShell').inert = value; $('lessonOverview').inert = value; if ($('lessonToolbar')) $('lessonToolbar').inert = value; };
    const deck = () => config.decks[language];
    const key = () => `${language}:${lessonIndex}`;
    const lessons = () => config.lessons[language];
    const text = item => item.expression || item.proverb;
    const itemsFor = index => deck().filter(item => config.lessonFor(item, language) === index);
    function setLessonMusicPaused(paused) {
      if (!config.pauseMusicDuringLesson) return;
      document.body.dataset.musicPausedForReading = String(paused);
      const audio = $('bgm');
      if (paused) audio?.pause();
      else if (audio?.paused) audio.play().catch(() => {});
    }
    async function refreshStatuses() {
      let offset = 0; statuses = new Map();
      do { const page = await records.history(`&offset=${offset}`); for (const s of page.sessions) if (!statuses.has(s.contentKey)) statuses.set(s.contentKey, s.status); offset = page.nextOffset; } while (offset != null);
    }
    function overview() {
      document.body.classList.remove('learning-active'); $('learningShell').hidden = true; $('lessonOverview').hidden = false;
      setLessonMusicPaused(false);
      if ($('lessonToolbar')) $('lessonToolbar').hidden = false;
      $('lessonList').replaceChildren(...lessons().map((lesson, index) => {
        const items = itemsFor(index), button = node('button', '', 'lesson-item'); button.type = 'button';
        const copy = node('span', '', 'lesson-copy'); copy.append(node('strong', lesson.title), node('small', lesson.copy), node('em', items.slice(0, 3).map(text).join(' · ')));
        const meta = node('span', `${items.length}개`, 'lesson-meta'); const status = statuses.get(`${language}:${index}`);
        if (status) meta.append(node('b', status === 'completed' ? '완료' : '진행 중'));
        button.append(node('span', String(index + 1).padStart(2, '0'), 'lesson-number'), copy, meta);
        button.onclick = () => open(index); return button;
      }));
    }
    function initial(items) {
      const quiz = shuffle(items).map(item => {
        const candidates = deck().filter(other => other !== item && !(item.lookalikes || []).includes(text(other)));
        const choices = shuffle([text(item), ...shuffle(candidates).slice(0, 2).map(text)]);
        return { item, choices, answer: choices.indexOf(text(item)), tried: [], solved: false };
      });
      return { mode: 'study', studyIndex: 0, quizIndex: 0, items, quiz };
    }
    async function open(index) {
      if (busy) return; setBusy(true); lessonIndex = index;
      setLessonMusicPaused(true);
      const session = await records.start({ contentKey: key(), title: `${config.label} · ${lessons()[index].title}`, version: '20261001', checkpoint: initial(itemsFor(index)) });
      state = session.checkpoint;
      $('lessonOverview').hidden = true; if ($('lessonToolbar')) $('lessonToolbar').hidden = true;
      $('learningShell').hidden = false; document.body.classList.add('learning-active');
      $('currentLessonTitle').textContent = lessons()[index].title;
      render(); setBusy(false);
    }
    async function save(events = [], complete = false) {
      await records.save({ checkpoint: state, progress: { current: state.quiz.filter(q => q.solved).length, total: state.quiz.length }, events, complete });
      statuses.set(key(), complete ? 'completed' : 'active');
    }
    function render() {
      const study = state.mode === 'study'; $('studyView').hidden = !study; $('quizView').hidden = study;
      document.querySelectorAll('.mode-tab').forEach(button => { const active = button.dataset.mode === state.mode; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); });
      if (study) {
        const item = state.items[state.studyIndex];
        $(config.ids.studyTitle).textContent = text(item); $(config.ids.studyProgress).textContent = `${state.studyIndex + 1} / ${state.items.length}`;
        $('meaning').textContent = item.meaning; $('example').textContent = `예: ${item.example}`;
        if ($('category')) $('category').textContent = item.category || '';
        if ($('literal')) { $('literal').textContent = item.literal || ''; $('literal').hidden = !item.literal; }
        const src = item.image || config.illustrations?.[text(item)] || '';
        const image = $(config.ids.image); image.hidden = !src; if (src) image.src = src; else image.removeAttribute('src'); image.alt = text(item);
        if ($('proverbIllustrationFrame')) $('proverbIllustrationFrame').hidden = !src;
        $('previous').disabled = state.studyIndex === 0; $('next').textContent = state.studyIndex === state.items.length - 1 ? '확인 문제 풀기' : '다음';
      } else {
        const q = state.quiz[state.quizIndex];
        $(config.ids.quizProgress).textContent = `${state.quizIndex + 1} / ${state.quiz.length}`;
        $(config.ids.quizTitle).hidden = true; $('question').textContent = q.item.question;
        $('feedback').textContent = q.solved ? `정답! ${q.item.meaning}` : q.tried.length ? '다시 생각하고 다른 답을 골라 보세요.' : '';
        $('choices').replaceChildren(...q.choices.map((choice, i) => {
          const button = node('button', choice); button.type = 'button'; button.disabled = q.solved || q.tried.includes(i);
          if (q.tried.includes(i)) button.classList.add(i === q.answer ? 'correct' : 'wrong');
          button.onclick = () => answer(i); return button;
        }));
        $('nextQuestion').disabled = !q.solved;
        $('nextQuestion').textContent = state.quizIndex === state.quiz.length - 1 ? '학습 완료' : '다음 문제';
      }
    }
    async function answer(index) {
      if (busy) return; const q = state.quiz[state.quizIndex]; if (q.solved || q.tried.includes(index)) return;
      setBusy(true); q.tried.push(index); q.solved = index === q.answer;
      await save([{ kind: 'answer', questionKey: text(q.item), response: q.choices[index], correct: q.solved,
        snapshot: { prompt: q.item.question, choices: q.choices } }]); render(); setBusy(false);
    }
    async function change(action, events = []) { if (busy || !state) return; setBusy(true); action(); await save(events); render(); setBusy(false); }
    $('previous').onclick = () => change(() => { state.studyIndex = Math.max(0, state.studyIndex - 1); });
    $('next').onclick = () => {
      const item = state.items[state.studyIndex];
      change(() => { if (state.studyIndex < state.items.length - 1) state.studyIndex++; else state.mode = 'quiz'; },
        [{ kind: 'read', questionKey: text(item), response: '읽기 확인', snapshot: { title: text(item) } }]);
    };
    $('nextQuestion').onclick = async () => {
      if (busy || !state.quiz[state.quizIndex].solved) return;
      if (state.quizIndex < state.quiz.length - 1) return change(() => { state.quizIndex++; });
      setBusy(true); await save([], true); overview(); records.showResult(); setBusy(false);
    };
    document.querySelectorAll('.mode-tab').forEach(button => button.onclick = () => change(() => { state.mode = button.dataset.mode; }));
    document.querySelectorAll('.language-tab').forEach(button => button.onclick = () => {
      if (busy) return; language = button.dataset.language;
      document.querySelectorAll('.language-tab').forEach(other => other.classList.toggle('active', other === button)); overview();
    });
    $('backToLessons').onclick = () => { if (!busy) overview(); };
    const back = event => { if (!$('learningShell').hidden) { event.preventDefault(); if (!busy) overview(); } };
    window.addEventListener('sitebackrequest', back); document.querySelector('a.back')?.addEventListener('click', back);
    await records.ready; await refreshStatuses(); overview();
    const resume = new URLSearchParams(location.search).get('record');
    if (resume && /^(ko|en):\d+$/.test(resume)) { const [lang, index] = resume.split(':'); if (config.lessons[lang]?.[Number(index)]) { language = lang; await open(Number(index)); } }
  };
})();
