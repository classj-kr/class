import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const groups = [...html.matchAll(/<details class="worksheet-group" data-access-group="([^"]+)">[\s\S]*?<\/details>/g)];
const groupByName = new Map(groups.map((match) => [match[1], match[0]]));

for (const groupName of ['story-books', 'grammar', 'vocabulary', 'information-computing', 'world-maps', 'science-models', 'arts-appreciation', 'arts-experience', 'music-theory']) {
  assert.ok(groupByName.has(groupName), `Missing disclosure menu: ${groupName}`);
}

const storyBooks = groupByName.get('story-books') || '';
assert.match(storyBooks, /data-content-paths="learning\/literacy-numeracy\/story-books\/\|/);
assert.ok(
  html.indexOf('data-access-group="story-books"') < html.indexOf('aria-labelledby="exploration-title"'),
  'Story books must remain in the literacy and numeracy section.',
);

// 국내 지리는 통합 앱 링크 하나로 지도 아코디언에 들어간다.
assert.ok(!groupByName.has('korea-maps'), 'The domestic-map tools are one app now, not a disclosure menu.');
assert.match(html, /<a href="learning\/inquiry\/korea-map\/" data-requires-player="true" data-access-parent="world-maps"[^>]*>\s*<span class="worksheet-copy"><strong>국내 지리<\/strong>/);
assert.doesNotMatch(html, /href="learning\/inquiry\/(?:korean-museum|korea-travel-map|korea-geography|korea-terrain)\//);
assert.ok(
  html.indexOf('href="learning/inquiry/korea-map/"') > html.indexOf('aria-labelledby="exploration-title"'),
  'Korea Maps stays in the subject-inquiry section.',
);

const worldMaps = groupByName.get('world-maps') || '';
assert.ok(worldMaps, 'The world-map tools must be grouped in one disclosure menu.');
assert.match(worldMaps, /<strong>지도<\/strong><small>\(Maps\)<\/small>/);
assert.match(worldMaps, /data-content-paths="learning\/inquiry\/korea-map\/\|learning\/inquiry\/world-geography\/\|learning\/inquiry\/globe\/\|\/learn\/world-voyage\/"/);
assert.match(worldMaps, /href="learning\/inquiry\/globe\/"[^>]*data-access-parent="world-maps"[\s\S]*?<strong>세계 지리<\/strong>/);
assert.match(worldMaps, /id="cds95GameLink"[\s\S]*?href="\/learn\/world-voyage\/"[\s\S]*?data-player-handoff="query"[\s\S]*?data-access-parent="world-maps"[\s\S]*?<strong>대항해시대<\/strong>/);

const vocabulary = groupByName.get('vocabulary') || '';
assert.ok(vocabulary, 'Vocabulary tools must be grouped in one disclosure menu.');
assert.match(vocabulary, /<strong>어휘<\/strong><small>\(Vocabulary\)<\/small>/);
const orderedVocabularyItems = [
  ['learning/literacy-numeracy/idiomatic-expressions/', '관용어'],
  ['learning/literacy-numeracy/proverbs/', '속담'],
  ['learning/literacy-numeracy/classical-chinese-idioms/', '한자성어'],
  ['learning/literacy-numeracy/hanja-meaning/', '한자'],
  ['learning/literacy-numeracy/phonics/', '파닉스'],
  ['learning/literacy-numeracy/vocabulary/', '교육부 영단어'],
];
let previousVocabularyIndex = -1;
for (const [href, label] of orderedVocabularyItems) {
  assert.match(vocabulary, new RegExp(`href="${href}"[^>]*data-access-parent="vocabulary"[\\s\\S]*?<strong>${label}<\\/strong>`));
  const itemIndex = vocabulary.indexOf(`href="${href}"`);
  assert.ok(itemIndex > previousVocabularyIndex, `Vocabulary item ${label} must follow the requested order.`);
  previousVocabularyIndex = itemIndex;
}

const grammar = groupByName.get('grammar') || '';
assert.ok(grammar, 'Grammar tools must be grouped in one disclosure menu.');
assert.match(grammar, /<strong>문법<\/strong><small>\(Grammar\)<\/small>/);
assert.match(grammar, /href="learning\/literacy-numeracy\/spelling\/"[^>]*data-access-parent="grammar"/);
assert.match(grammar, /href="learning\/literacy-numeracy\/sentence-building\/"[^>]*data-access-parent="grammar"/);
assert.match(grammar, /<strong>문장 고르기<\/strong><small>\(Sentence Choice\)<\/small>/);
assert.doesNotMatch(grammar, /<strong>문장 만들기<\/strong>/);

const scienceModels = groupByName.get('science-models') || '';
assert.ok(scienceModels, 'Science models must be grouped directly on the portal.');
assert.match(scienceModels, /data-content-paths="learning\/inquiry\/human-body\/\|learning\/inquiry\/space\/\|learning\/inquiry\/periodic-table\/"/);
const orderedScienceModelItems = [
  ['learning/inquiry/human-body/', '인체 구조 모형'],
  ['learning/inquiry/space/', '지구·우주 모형'],
  ['learning/inquiry/periodic-table/', '원소·물질 모형'],
];
let previousScienceIndex = -1;
for (const [href, label] of orderedScienceModelItems) {
  const itemPattern = new RegExp(`href="${href}"[^>]*data-access-parent="science-models"[\\s\\S]*?<strong>${label}<\\/strong>`);
  assert.match(scienceModels, itemPattern);
  const itemIndex = scienceModels.indexOf(`href="${href}"`);
  assert.ok(itemIndex > previousScienceIndex, `Science model item ${label} must follow the requested order.`);
  previousScienceIndex = itemIndex;
}

assert.match(html, /body\.content-access-editing \.worksheet-group-options \{[\s\S]*?display: none;/);
assert.match(html, /Promise\.all\(paths\.map\(\(path\) => api\('\/api\/teacher\/home-content-access'/);
assert.match(html, /하위 메뉴는 상위 설정을 함께 따릅니다/);
assert.match(html, /@media \(max-width: 600px\)[\s\S]*?\.worksheet-group-options \{[\s\S]*?position: static;/);

console.log('Grouped learning menus and inherited access contract passed.');
