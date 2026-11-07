(function () {
  'use strict';

  const books = window.CurriculumVocabulary || {};
  const termSelect = document.getElementById('term');
  const subjectList = document.getElementById('subjects');
  const unitList = document.getElementById('unit-list');
  const lesson = document.getElementById('lesson');
  const query = new URLSearchParams(location.search);
  const terms = Array.from({ length: 12 }, (_, i) => `${Math.floor(i / 2) + 1}-${i % 2 + 1}`);
  const termName = (key) => `${key[0]}학년 ${key[2]}학기`;
  const subjectsFor = (key) => Number(key[0]) <= 2 ? ['국어', '수학'] : ['국어', '수학', '사회', '과학'];
  const currentTerm = window.LearningDefaults?.mathTerm(window.CLASS_SCHOOL_LEVEL, window.CLASS_SCHOOL_GRADE, Object.keys(books));
  let term = terms.includes(query.get('term')) ? query.get('term') : currentTerm || Object.keys(books)[0] || '1-1';
  let subject = subjectsFor(term).includes(query.get('subject')) ? query.get('subject') : '국어';
  let unitId = query.get('unit');

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function button(text, action, className) {
    const node = element('button', text, className);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function exampleOf(word, text) {
    const example = element('p', '', 'example');
    const offset = text.indexOf(word);
    if (offset < 0) example.textContent = text;
    else example.append(text.slice(0, offset), element('mark', word), text.slice(offset + word.length));
    return example;
  }

  function orderedChoices(choices) {
    const shuffled = choices.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function startQuiz(container, words, onClose) {
    const questions = orderedChoices(words);
    let index = 0;
    let firstCorrect = 0;

    function showQuestion() {
      const quiz = element('div', '', 'quiz');
      if (index === questions.length) {
        const title = element('h3', '단원 확인을 마쳤어요');
        title.tabIndex = -1;
        quiz.append(title, element('p', `${questions.length}문제 중 ${firstCorrect}문제를 처음에 맞혔어요.`),
          button('단어 다시 보기', onClose), ' ', button('한 번 더 풀기', () => startQuiz(container, words, onClose), 'primary'));
        container.replaceChildren(quiz);
        title.focus();
        return;
      }

      const [word, meaning, example] = questions[index];
      const title = element('h3', `이 문장에서 ‘${word}’의 뜻은 무엇인가요?`);
      title.tabIndex = -1;
      const choices = element('div', '', 'choices');
      const feedback = element('p', '', 'feedback');
      feedback.setAttribute('role', 'status');
      const next = button(index + 1 === questions.length ? '결과 보기' : '다음 문제', () => { index++; showQuestion(); }, 'primary');
      next.hidden = true;
      let triedWrong = false;
      const alternatives = [...new Set(words.map(row => row[1]).filter(text => text !== meaning))];
      const options = orderedChoices([meaning, ...orderedChoices(alternatives).slice(0, 2)]);
      for (const option of options) {
        const choice = button(option, () => {
          if (option === meaning) {
            if (!triedWrong) firstCorrect++;
            choice.classList.add('correct');
            for (const node of choices.children) node.disabled = true;
            feedback.textContent = '맞았어요!';
            next.hidden = false;
            next.focus();
          } else {
            triedWrong = true;
            choice.classList.add('wrong');
            choice.disabled = true;
            feedback.textContent = '문장 속 단어의 쓰임을 다시 살펴봐요.';
            choices.querySelector('button:not(:disabled)')?.focus();
          }
        });
        choices.append(choice);
      }
      quiz.append(element('p', `확인 문제 ${index + 1} / ${questions.length}`, 'eyebrow'), title,
        exampleOf(word, example), choices, feedback, next, ' ', button('단어 보기로 돌아가기', onClose));
      container.replaceChildren(quiz);
      title.focus();
    }

    showQuestion();
  }

  function showLesson(book, unit) {
    const heading = element('h2', unit ? unit.title : `${termName(term)} ${subject}`);
    heading.id = 'unit-title';
    if (!unit) {
      lesson.replaceChildren(heading, element('p', '이 과목의 단원별 어휘는 준비 중이에요.'));
      return;
    }
    const header = element('div', '', 'lesson-header');
    const headingBlock = element('div');
    const source = element('p', `기준 교과서 · ${book.publisher}`, 'source');
    headingBlock.append(heading, source);
    if (book.source) {
      const link = element('a', '교과서 자료실');
      link.href = book.source;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      source.append(' · ', link);
    }
    header.append(headingBlock);
    const container = element('div');
    const actions = element('div', '', 'lesson-actions');
    const openQuiz = button('이 단원 확인 문제', () => {
      openQuiz.hidden = true;
      startQuiz(container, unit.words, () => showWords(true));
    }, 'primary');
    if (unit.words.length > 1) actions.append(openQuiz);
    header.append(actions);
    lesson.replaceChildren(header, container);

    function showWords(focus = false) {
      const entries = element('div', '', 'entries');
      for (const [word, meaning, example] of unit.words) {
        const card = element('article', '', 'entry');
        card.append(element('h3', word), element('p', meaning), exampleOf(word, example));
        entries.append(card);
      }
      container.replaceChildren(entries);
      openQuiz.hidden = false;
      if (focus) openQuiz.focus();
    }
    showWords();
  }

  function render(focusGroup) {
    const book = books[term]?.[subject];
    const units = book?.units || [];
    const unit = units.find((row) => row.id === unitId) || units[0];
    unitId = unit?.id;
    termSelect.value = term;
    let focusTarget;
    subjectList.replaceChildren(...subjectsFor(term).map((name) => {
      const control = button(name, () => { subject = name; unitId = null; render('subject'); });
      control.setAttribute('aria-pressed', String(name === subject));
      if (focusGroup === 'subject' && name === subject) focusTarget = control;
      return control;
    }));
    unitList.replaceChildren(...units.map((row) => {
      const control = button(row.title, () => { unitId = row.id; render('unit'); });
      if (row === unit) {
        control.setAttribute('aria-current', 'true');
        if (focusGroup === 'unit') focusTarget = control;
      }
      return control;
    }));
    if (!units.length) unitList.append(element('p', '준비 중'));
    showLesson(book, unit);
    const url = new URL(location.href);
    url.searchParams.set('term', term);
    url.searchParams.set('subject', subject);
    if (unitId) url.searchParams.set('unit', unitId);
    else url.searchParams.delete('unit');
    if (location.protocol !== 'file:') history.replaceState(null, '', url);
    focusTarget?.focus();
  }

  for (const key of terms) {
    const option = element('option', termName(key) + (books[key] ? '' : ' · 준비 중'));
    option.value = key;
    termSelect.append(option);
  }
  termSelect.addEventListener('change', () => {
    term = termSelect.value;
    if (!subjectsFor(term).includes(subject)) subject = '국어';
    unitId = null;
    render();
  });
  render();
})();
