const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'learning', 'arts', 'art-theory', 'index.html');
const scriptPath = path.join(root, 'learning', 'arts', 'art-theory', 'app.js');
const stylePath = path.join(root, 'learning', 'arts', 'art-theory', 'styles.css');

for (const file of [pagePath, scriptPath, stylePath]) {
  assert.ok(fs.existsSync(file), `${path.basename(file)} 파일이 필요합니다.`);
  assert.ok(fs.statSync(file).size > 100, `${path.basename(file)} 파일이 비어 있습니다.`);
}

const page = fs.readFileSync(pagePath, 'utf8');
const script = fs.readFileSync(scriptPath, 'utf8');
const portal = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const requiredLessons = ['color-perception', 'color-properties', 'color-mixing', 'color-harmony', 'obangsaek', 'visual-elements', 'visual-principles', 'space-composition', 'formal-analysis'];
assert.doesNotMatch(page, /class="topbar"/, '화면 위를 가로지르는 헤더 바를 사용하지 않습니다.');
assert.match(page, /id="courseMenu"/, '첫 화면에 차시 목록이 필요합니다.');
assert.doesNotMatch(page, /class="course-intro"/, '차시 목록 앞에 별도 소개 화면을 두지 않습니다.');
assert.doesNotMatch(page, /class="course-top"/, '차시 목록 앞에 중복 제목 줄을 두지 않습니다.');
assert.doesNotMatch(page, /menu-editorial-header|editorial-badge|ART THEORY|VISUAL INQUIRY/, '목록 위에 홍보용 히어로·영문 배지를 두지 않습니다.');
assert.doesNotMatch(page, /Interactive Inquiry|FIRST UNIT|SECOND UNIT|THIRD UNIT/, '수업 화면에 장식용 영문 배지를 두지 않습니다.');
assert.doesNotMatch(script, /LESSON \$\{lesson\.number\}/, '차시 표기는 한국어로 간결하게 표시합니다.');
assert.doesNotMatch(page, /class="lesson-toolbar"/, '사이트 공통 뒤로가기와 겹치는 자체 툴바를 두지 않습니다.');
assert.match(script, /sitebackrequest/, '공통 뒤로가기 버튼으로 차시 목록에 돌아갈 수 있어야 합니다.');
assert.match(page, /data-open-lesson="color-perception"[\s\S]*data-open-lesson="obangsaek"[\s\S]*data-open-lesson="visual-elements"[\s\S]*data-open-lesson="formal-analysis"/, '색 이해에서 화면 구성과 작품 분석으로 이어져야 합니다.');
const styles = fs.readFileSync(stylePath, 'utf8');
assert.doesNotMatch(styles, /h1, h2[^}]*6\.9rem/, '학습 제목에 포스터 크기의 글자를 사용하지 않습니다.');
for (const id of requiredLessons) {
  assert.match(page, new RegExp(`data-open-lesson="${id}"`), `${id} 차시 목록 항목이 필요합니다.`);
  assert.match(script, new RegExp(`id: '${id}'`), `${id} 차시 본문 자료가 필요합니다.`);
}
assert.strictEqual((page.match(/data-open-lesson=/g) || []).length, 9, '첫 화면에 9개 차시가 있어야 합니다.');

const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.strictEqual(new Set(ids).size, ids.length, '중복된 HTML id가 없어야 합니다.');

assert.match(script, /감산 혼합[\s\S]*가산 혼합[\s\S]*병치 혼합/, '안료·빛·병치의 색 혼합 차이를 다뤄야 합니다.');
assert.match(script, /R–YR–Y–GY–G–BG–B–PB–P–RP/, '먼셀 기본 10색상환을 순서대로 다뤄야 합니다.');
assert.strictEqual((script.match(/data-hue-index=/g) || []).length, 1, '10색상환 선택 항목을 자료에서 생성해야 합니다.');
assert.doesNotMatch(script, /220°|hueValue|hueControl/, '색상환 위치 없이 HSL 각도를 학습값으로 노출하지 않습니다.');
assert.match(script, /청 · 동[\s\S]*적 · 남[\s\S]*황 · 중앙[\s\S]*백 · 서[\s\S]*흑 · 북/, '오방색의 색·방향 관계를 정확히 다뤄야 합니다.');
for (const guardian of ['청룡', '주작', '백호', '현무']) {
  assert.match(script, new RegExp(guardian), `${guardian}의 방향과 동물 설명이 필요합니다.`);
}
assert.match(script, /거북과 뱀/, '현무의 결합 형상을 설명해야 합니다.');
assert.match(script, /황룡 또는 봉황/, '중앙 동물 표상이 자료에 따라 다름을 밝혀야 합니다.');
assert.match(script, /조형 요소[\s\S]*조형 원리/, '조형 요소와 조형 원리를 구분해야 합니다.');
assert.match(script, /선 원근법[\s\S]*다시점과 여백/, '공간 표현을 하나의 원근법으로 단순화하지 않아야 합니다.');
assert.strictEqual((script.match(/quiz: \{/g) || []).length, 9, '모든 차시에 개념 확인 문제가 있어야 합니다.');
assert.strictEqual((script.match(/question:/g) || []).length, 18, '모든 차시에 핵심 질문과 확인 질문이 있어야 합니다.');
for (const discardedUi of ['card-visual', 'mix-circle', 'principle-canvas', 'space-canvas', 'obang-diagram']) {
  assert.doesNotMatch(page + script + styles, new RegExp(discardedUi), `${discardedUi} 장식형 UI를 다시 사용하지 않습니다.`);
}
const artworkFiles = [...script.matchAll(/(?:src:|src=") '?(\w+\.jpg)/g)].map((match) => match[1]);
for (const file of new Set(artworkFiles)) {
  assert.ok(fs.existsSync(path.join(root, 'learning', 'arts', 'art-appreciation', 'museum', 'assets', 'artworks', file)), `${file} 작품 이미지가 필요합니다.`);
}
assert.ok(new Set(artworkFiles).size >= 6, '장식 도형 대신 실제 작품을 충분히 분석해야 합니다.');
assert.doesNotMatch(portal, /href="learning\/arts\/art-theory\/[^"]*"/, '검토 중인 미술 이론 앱은 수업 목록에 노출하지 않습니다.');
assert.doesNotMatch(portal, /data-access-group="art-theory"/, '중단한 9차시 메뉴 그룹을 다시 노출하지 않습니다.');
assert.doesNotMatch(page, /정답 대신|근거를 말해요|눈으로 발견하고/, '미술 개념과 무관한 홍보 문구를 넣지 않습니다.');

console.log('미술 이론 페이지 계약 검사 통과');
