// 즐겨찾기와 기존 학습 기록 주소를 유지한다.
(function () {
  'use strict';
  const params = new URLSearchParams(location.search), C = window.MathConceptOX;
  const subject = params.get('record') || '초3';
  const unit = C.legacyTarget(subject, params.get('unit')) || '3-1-1';
  const target = new URL('../math-bank/', location.href);
  target.searchParams.set('unit', unit);
  target.searchParams.set('concept', '1');
  target.searchParams.set('record', subject);
  location.replace(target.href);
})();
