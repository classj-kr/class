import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const groups = [...html.matchAll(/<details class="worksheet-group" data-access-group="([^"]+)">[\s\S]*?<\/details>/g)];
const groupByName = new Map(groups.map((match) => [match[1], match[0]]));

for (const groupName of ['story-books', 'grammar', 'vocabulary', 'information-computing', 'korea-maps', 'world-maps', 'space-observation', 'arts-appreciation', 'arts-experience', 'music-theory']) {
  assert.ok(groupByName.has(groupName), `Missing disclosure menu: ${groupName}`);
}

const storyBooks = groupByName.get('story-books') || '';
assert.match(storyBooks, /data-content-paths="learning\/literacy-numeracy\/story-books\/\|/);
assert.ok(
  html.indexOf('data-access-group="story-books"') < html.indexOf('aria-labelledby="exploration-title"'),
  'Story books must remain in the literacy and numeracy section.',
);

const koreaMaps = groupByName.get('korea-maps') || '';
assert.ok(koreaMaps, 'The domestic-map tools must be grouped in one disclosure menu.');
assert.match(koreaMaps, /<strong>국내 지도<\/strong><small>\(Korea Maps\)<\/small>/);
assert.match(koreaMaps, /data-content-paths="learning\/inquiry\/korean-museum\/\|learning\/inquiry\/korea-travel-map\/\|learning\/inquiry\/korea-geography\/\|learning\/inquiry\/korea-terrain\/"/);
assert.doesNotMatch(koreaMaps, /한국지리 수능|Korean Geography CSAT/);
for (const [href, label, englishLabel] of [
  ['learning/inquiry/korean-museum/', '유물·유적', 'Artifacts &amp; Sites'],
  ['learning/inquiry/korea-travel-map/', '체험·관광', 'Experiences &amp; Tourism'],
  ['learning/inquiry/korea-geography/', '지리', 'Geography'],
  ['learning/inquiry/korea-terrain/', '지형도', 'Topographic Map'],
]) {
  assert.match(koreaMaps, new RegExp(`href="${href}"[^>]*data-access-parent="korea-maps"[\\s\\S]*?<strong>${label}<\\/strong><small>\\(${englishLabel}\\)<\\/small>`));
}

const worldMaps = groupByName.get('world-maps') || '';
assert.ok(worldMaps, 'The world-map tools must be grouped in one disclosure menu.');
assert.match(worldMaps, /<strong>세계 지도<\/strong><small>\(World Maps\)<\/small>/);
assert.match(worldMaps, /data-content-paths="learning\/inquiry\/world-geography\/\|learning\/inquiry\/globe\/\|\/learn\/world-voyage\/"/);
assert.match(worldMaps, /href="learning\/inquiry\/globe\/"[^>]*data-access-parent="world-maps"[\s\S]*?<strong>지구본<\/strong><small>\(Globe\)<\/small>/);
assert.match(worldMaps, /href="learning\/inquiry\/world-geography\/"[^>]*data-access-parent="world-maps"[\s\S]*?<strong>지리<\/strong><small>\(Geography\)<\/small>/);
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

const space = groupByName.get('space-observation') || '';
assert.ok(space, 'Space observation must be grouped directly on the portal.');
assert.match(space, /data-content-paths="learning\/inquiry\/space\/"/);
const orderedSpaceItems = [
  ['learning/inquiry/space/solar-system/', '태양계'],
  ['learning/inquiry/space/constellations/', '별과 별자리'],
  ['learning/inquiry/space/earth-moon/', '지구와 달의 운동'],
];
let previousIndex = -1;
for (const [href, label] of orderedSpaceItems) {
  const itemPattern = new RegExp(`href="${href}"[^>]*data-access-parent="space-observation"[\\s\\S]*?<strong>${label}<\\/strong>`);
  assert.match(space, itemPattern);
  const itemIndex = space.indexOf(`href="${href}"`);
  assert.ok(itemIndex > previousIndex, `Space item ${label} must follow the requested order.`);
  previousIndex = itemIndex;
}
assert.doesNotMatch(html, /<a href="learning\/inquiry\/space\/"/);

assert.match(html, /body\.content-access-editing \.worksheet-group-options \{[\s\S]*?display: none;/);
assert.match(html, /Promise\.all\(paths\.map\(\(path\) => api\('\/api\/teacher\/home-content-access'/);
assert.match(html, /하위 메뉴는 상위 설정을 함께 따릅니다/);
assert.match(html, /@media \(max-width: 600px\)[\s\S]*?\.worksheet-group-options \{[\s\S]*?position: static;/);

console.log('Grouped learning menus and inherited access contract passed.');
