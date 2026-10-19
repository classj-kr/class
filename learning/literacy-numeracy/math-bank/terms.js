// 「수학 문제」 맨 위 드롭다운의 항목: 학기들과, 맨 밑의 「평가원·수능 기출」.
// 기출 화면(../csat-math/)도 같은 드롭다운을 보이려고 이 파일을 읽는다(단원 파일을 다 읽지 않고도 학기 목록을 알게).
// TERMS 는 tools/question-bank/add_part.py 가 단원을 넣을 때 고친다. 실린 단원과 어긋나면 tests/math-bank-units.test.cjs 가 떨어진다.
(function (root) {
  'use strict';
  const TERMS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2', '7-1', '7-2', '8-1', '8-2', '9-1', '9-2', '10-1', '10-2'];
  // 드롭다운 맨 밑의 항목. 고르면 기출 화면으로 간다.
  const PAST = { value: 'past', label: '평가원·수능 기출' };
  // 학교급을 앞에 적는다: 1~6학년은 「초」, 7·8·9학년은 「중」 1·2·3학년.
  const label = (term) => { const [g, s] = term.split('-').map(Number); return (g > 9 ? '고 ' + (g - 9) : g > 6 ? '중 ' + (g - 6) : '초 ' + g) + '학년 ' + s + '학기'; };
  // 드롭다운을 채운다. terms 를 주지 않으면 TERMS 를 쓴다.
  function fill(select, selected, terms) {
    select.replaceChildren(...(terms || TERMS).map((term) => new Option(label(term), term)), new Option(PAST.label, PAST.value));
    select.value = selected;
  }
  root.MathBankTerms = { TERMS, PAST, label, fill };
  // 기출 화면처럼 `data-math-terms="수학 문제의 자리"`를 단 드롭다운은 스스로 채운다: 맨 밑 항목이 골라져 있고, 학기를 고르면 수학 문제의 그 학기로 간다.
  // (뒤로 돌아왔을 때 드롭다운이 고른 학기에 머물러 있지 않게 먼저 되돌려 둔다.)
  const own = root.document && root.document.querySelector('select[data-math-terms]');
  if (own) {
    fill(own, PAST.value);
    own.addEventListener('change', () => { const term = own.value; own.value = PAST.value; if (term !== PAST.value) root.location.href = own.dataset.mathTerms + '?term=' + term; });
  }
})(typeof window !== 'undefined' ? window : globalThis);
