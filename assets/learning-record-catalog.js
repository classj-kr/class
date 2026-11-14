(function (root) {
  'use strict';
  const base = '/learning/literacy-numeracy/';
  const rows = [
    ['korea-tales', '읽기', '한국 전래 동화', 'story-books/korea-tales/'],
    ['world-tales', '읽기', '세계 명작 동화', 'story-books/world-tales/'],
    ['world-novels', '읽기', '세계 명작 소설', 'story-books/world-novels/'],
    ['poetry', '읽기', '시', 'story-books/poetry/'],
    ['reading', '읽기', '비문학', 'reading/'],
    ['sentence-building', '문법', '문장 고르기', 'sentence-building/'],
    ['spelling', '문법', '한글 맞춤법', 'spelling/'],
    ['idiomatic-expressions', '어휘', '관용어', 'idiomatic-expressions/'],
    ['proverbs', '어휘', '속담', 'proverbs/'],
    ['classical-chinese-idioms', '어휘', '한자성어', 'classical-chinese-idioms/'],
    ['hanja-meaning', '어휘', '한자', 'hanja-meaning/v2/'],
    ['phonics', '어휘', '파닉스', 'phonics/'],
    ['vocabulary', '어휘', '교육부 영단어', 'vocabulary/'],
    ['arithmetic', '수리', '기초연산', '/arithmetic/'],
    ['math-ox', '수리', '수학 기초 OX', 'math-ox/'],
    ['math-bank', '수리', '수학 문제', 'math-bank/'],
    ['csat-math', '수리', '수능 수학', 'csat-math/'],
    ['metacognition', '학습 점검', '학습 점검', 'metacognition/'],
    ['curriculum-vocabulary', '어휘', '교과 어휘', 'curriculum-vocabulary/'],
    ['handwriting', '쓰기', '글씨 쓰기', 'handwriting/'],
    ['typing', '정보', '타자', '/learning/inquiry/information-computing/typing/'],
    ['computer-literacy', '정보', '컴퓨터 이론', '/learning/inquiry/information-computing/computer-fundamentals/'],
    ['korean-history', '역사·지리', '한국사', '/learning/inquiry/korean-history/'],
    ['korea-map', '역사·지리', '국내 지도', '/learning/inquiry/korea-map/'],
    ['ear-training', '음악', '청음', '/learning/arts/music-theory/ear-training/'],
    ['music-studio', '음악', '음악 연습', '/learning/arts/music-studio/'],
    ['museum', '미술', '미술 감상', '/learning/arts/art-appreciation/museum/'],
    ['park', '미술', '야외 미술관', '/learning/arts/art-appreciation/park/'],
    ...['geoboard', 'number-models', 'fraction-board', 'graph-studio'].map((id, i) =>
      [id, '수학 탐구', ['지오보드', '수 모형', '분수판', '그래프'][i], `math-tools/${id}/`]),
    ...[['chess','체스'],['lastcard','라스트 카드'],['bomb77','77 폭탄'],['loveletter','러브레터'],
      ['clue','추리 게임'],['codenames','코드네임'],['dobble','도블'],['avalon','원정대 추리'],
      ['citychase','도시 추격'],['beantrading','콩 거래'],['gemguild','보석 길드'],['kingdomtrails','왕국 탐험'],
      ['rummikub','루미큐브'],['blokus','블로커스'],['honeycomb','벌집'],['expedition','탐험'],['drawrelay','그림 릴레이'],
      ['sliding-puzzle','8 퍼즐·15 퍼즐'],['nonogram','네모로직'],['minesweeper','지뢰찾기']].map(([id, label]) =>
      [id, '게임', label, `/learning/games/${id === 'kingdomtrails' ? 'kingdom-trails' : id}/`])
  ];
  const catalog = Object.freeze(rows.map(([id, domain, label, route]) => Object.freeze({
    id, domain, label, href: route.startsWith('/') ? route : base + route
  })));
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  else root.LearningRecordCatalog = catalog;
})(typeof window === 'object' ? window : globalThis);
