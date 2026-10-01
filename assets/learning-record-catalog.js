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
    ['csat-math', '수리', '수능 수학', 'csat-math/'],
    ['metacognition', '자기점검', '학습 자기점검', 'metacognition/']
  ];
  const catalog = Object.freeze(rows.map(([id, domain, label, route]) => Object.freeze({
    id, domain, label, href: route.startsWith('/') ? route : base + route
  })));
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  else root.LearningRecordCatalog = catalog;
})(typeof window === 'object' ? window : globalThis);
