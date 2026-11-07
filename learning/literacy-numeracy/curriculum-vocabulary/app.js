(function () {
  'use strict';

  const books = window.CurriculumVocabulary || {};
  const visualLessons = window.CurriculumVisualLessons || {};
  const termSelect = document.getElementById('term');
  const subjectList = document.getElementById('subjects');
  const unitList = document.getElementById('unit-list');
  const unitSelect = document.getElementById('unit-select');
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

  function detailsOf(parts) {
    const details = element('details', '', 'scene-details');
    details.append(element('summary', '뜻과 쓰임 자세히 보기'));
    for (const [name, paragraphs] of parts) {
      const block = element('div', '', 'detail-part');
      block.append(element('h3', name), ...paragraphs.map(text => element('p', text)));
      details.append(block);
    }
    return details;
  }

  function writingOf({ prompt, guide, example }) {
    const block = element('div', '', 'scene-writing');
    const label = element('label', prompt);
    const response = element('textarea');
    response.rows = 2;
    label.append(response);
    const model = element('details');
    model.append(element('summary', '예시와 비교하기'), element('p', example));
    block.append(element('h3', '내 말로 설명하기'), label, element('p', guide, 'writing-guide'), model);
    return block;
  }

  function visualLessonOf(activity) {
    const section = element('section', '', 'visual-lesson');
    const title = element('h2', activity.title);
    const figure = element('figure', '', 'scene');
    const image = element('div', '', 'scene-image');
    const caption = element('figcaption');
    const controls = element('div', '', 'scene-controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', activity.controlLabel);
    figure.append(image, caption);
    section.append(title, controls, figure);

    const buttons = activity.states.map(([name], index) => button(name, () => select(index)));
    controls.append(...buttons);
    function select(index) {
      const [name, description] = activity.states[index];
      buttons.forEach((node, i) => node.setAttribute('aria-pressed', String(i === index)));
      image.innerHTML = activity.draw(index);
      caption.replaceChildren(element('strong', name), ' ', description);
    }
    select(0);

    if (activity.parts || activity.wordResult || activity.english) {
      const word = element('div', '', 'word-build');
      if (activity.parts) {
        const pieces = element('div', '', 'word-pieces');
        for (const [character, reading] of activity.parts) {
          const part = element('span', '', 'word-piece');
          part.append(element('b', character), element('span', reading));
          pieces.append(part);
        }
        word.append(pieces);
      }
      if (activity.wordResult) word.append(element('p', activity.wordResult, 'word-result'));
      if (activity.english) word.append(element('p', activity.english, 'word-english'));
      section.append(word);
    }

    if (activity.details) section.append(detailsOf(activity.details));

    if (activity.check) {
      const { question, options, answer, feedback, draw } = activity.check;
      const practice = element('div', '', 'visual-check');
      const result = element('p', '', 'visual-feedback');
      result.setAttribute('role', 'status');
      const choices = element('div', '', 'scene-choices');
      let solved = false;
      const optionButtons = orderedChoices(options).map((option) => button(option, (event) => {
        if (solved) return;
        const selected = event.currentTarget;
        selected.classList.add(option === answer ? 'correct' : 'wrong');
        selected.disabled = true;
        result.textContent = feedback[option];
        if (option === answer) {
          solved = true;
          optionButtons.forEach(node => { node.disabled = true; });
          result.tabIndex = -1;
          result.focus();
        } else {
          choices.querySelector('button:not(:disabled)')?.focus();
        }
      }));
      choices.append(...optionButtons);
      practice.append(element('h3', question));
      if (draw) {
        const example = element('div', '', 'scene-image check-image');
        example.innerHTML = draw();
        practice.append(example);
      }
      practice.append(choices, result);
      section.append(practice);
    }

    if (activity.writing) section.append(writingOf(activity.writing));
    return section;
  }

  function showLesson(unit) {
    lesson.setAttribute('aria-label', unit?.title || '학습 내용');
    if (!unit) {
      lesson.replaceChildren(element('p', '이 과목의 단원별 어휘는 준비 중이에요.'));
      return;
    }
    const visuals = visualLessons[term]?.[subject]?.[unit.id] || [];
    const glossary = element('details', '', 'glossary');
    glossary.append(element('summary', '단어와 예문 찾아보기'));
    const words = element('dl', '', 'word-list');
    for (const [word, meaning, example] of unit.words) {
      const definition = element('dd');
      definition.append(element('p', meaning), exampleOf(word, example));
      words.append(element('dt', word), definition);
    }
    glossary.append(words);
    const panels = visuals.length ? visuals.map(visualLessonOf) : [element('p', '이 단원의 그림 학습은 준비 중이에요.')];
    lesson.replaceChildren(...panels, glossary);
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
    unitSelect.replaceChildren(...units.map((row) => {
      const option = element('option', row.title);
      option.value = row.id;
      option.selected = row === unit;
      return option;
    }));
    unitSelect.hidden = !units.length;
    if (!units.length) unitList.append(element('p', '준비 중'));
    showLesson(unit);
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
  unitSelect.addEventListener('change', () => {
    unitId = unitSelect.value;
    render();
  });
  render();
})();
