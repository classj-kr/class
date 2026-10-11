(function () {
  'use strict';
  let dialog;
  const node = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function open(scene, mark, api, stateId) {
    const level = window.SchoolLevel?.value || 'middle';
    const lesson = window.HistoryPointLessons?.get(scene.id, mark, level, stateId);
    if (!lesson) return;
    const opener = document.activeElement;
    let launchingPractice = false;
    dialog?.close();
    dialog?.remove();
    const current = node('dialog', 'history-point-dialog');
    dialog = current;
    const header = node('header');
    const title = node('h2', '', mark.label);
    title.id = 'historyPointTitle';
    current.setAttribute('aria-labelledby', title.id);
    const close = node('button', 'history-button', '닫기');
    close.type = 'button';
    close.setAttribute('aria-label', '지점 설명 닫기');
    close.addEventListener('click', () => current.close());
    header.append(title, close);
    const body = node('div', 'history-point-body');
    body.append(node('p', 'history-point-context', scene.title));
    const content = node('div', 'history-point-reading');
    if (lesson.image) {
      const figure = node('figure', 'history-point-photo');
      const image = node('img');
      image.src = lesson.image.src;
      image.alt = lesson.image.alt;
      image.addEventListener('error', () => figure.remove(), { once: true });
      figure.append(image, node('figcaption', '', lesson.image.caption));
      content.append(figure);
    }
    const text = node('div', 'history-point-text');
    lesson.paragraphs.forEach((paragraph, index) => {
      if (index) text.append(node('h3', '', '지도에서 연결하기'));
      text.append(node('p', '', paragraph));
    });
    content.append(text);
    body.append(content);
    if (lesson.steps) {
      const figure = node('figure', 'history-point-links');
      figure.append(node('figcaption', '', lesson.stepsLabel));
      const steps = node('ol');
      lesson.steps.forEach(step => steps.append(node('li', '', step)));
      figure.append(steps);
      body.append(figure);
    }
    if (window.HistoryQuestions?.forLevel(scene.id, level).length) {
      const practice = node('button', 'history-button history-point-practice', '이 지도 문제 풀기');
      practice.type = 'button';
      practice.addEventListener('click', () => {
        launchingPractice = true;
        current.close();
        requestAnimationFrame(() => window.KoreaHistoryPractice.open(scene, api));
      });
      body.append(practice);
    }
    current.append(header, body);
    current.addEventListener('close', () => {
      if (!launchingPractice && opener?.isConnected) opener.focus({ preventScroll: true });
    });
    current.addEventListener('click', event => {
      const rect = current.getBoundingClientRect();
      if (event.target === current && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) current.close();
    });
    document.body.append(current);
    current.showModal();
    close.focus();
  }
  window.SchoolLevel?.subscribe(() => dialog?.close());
  window.KoreaHistoryPoint = { open };
})();
