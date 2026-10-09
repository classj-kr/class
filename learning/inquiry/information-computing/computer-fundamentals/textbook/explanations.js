(() => {
 'use strict';
 const element = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
 };
 function render(host, id) {
  const data = window.COMPUTER_EXPLANATIONS_DATA?.[id];
  if (!data) return;
  const section = element('section', 'concept-explanation');
  section.dataset.conceptExplanation = id;
  const heading = element('h3', '', data.title);
  heading.id = 'explanation-title-' + id;
  section.setAttribute('aria-labelledby', heading.id);
  section.append(heading, element('p', 'explanation-intro', data.intro));
  const figure = element('figure', 'explanation-figure');
  const table = element('table', 'explanation-map');
  const caption = element('caption', '', data.source + '와 ' + data.target + '의 관계');
  table.append(caption);
  const thead = element('thead');
  const labels = element('tr');
  [data.source, data.target].forEach(text => {
   const th = element('th', '', text); th.scope = 'col'; labels.append(th);
  });
  thead.append(labels); table.append(thead);
  const tbody = element('tbody');
  for (const [from, fromDetail, to, toDetail] of data.pairs) {
   const row = element('tr');
   for (const [title, detail] of [[from, fromDetail], [to, toDetail]]) {
    const cell = element('td');
    cell.append(element('strong', '', title), element('span', '', detail));
    row.append(cell);
   }
   tbody.append(row);
  }
  table.append(tbody); figure.append(table);
  figure.append(element('figcaption', '', data.connection));
  section.append(figure);
  const boundary = element('p', 'explanation-boundary');
  boundary.append(element('strong', '', '실제 개념에 연결할 때'), document.createTextNode(' ' + data.boundary));
  section.append(boundary); host.append(section);
  return section;
 }
 window.COMPUTER_EXPLANATIONS = {render};
 document.querySelectorAll('[data-concept-explanation-host]').forEach(host => render(host, host.dataset.conceptExplanationHost));
})();
