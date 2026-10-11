// 학습 화면에서 뺀 출처·이용 조건을 한 쪽(apps/site/credits.html, 주소 /credits)에 모은다.
// 학습 화면에는 출처 글자나 출처 단추를 두지 않는다(학생들이 뜻을 자꾸 물어 수업에 방해가 된다).
//   node scripts/build-credits-page.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const esc = value => String(value ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const link = (url, text) => /^https?:\/\//.test(url || '') ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>` : esc(text);
const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const fold = (title, body) => `<details><summary>${esc(title)}</summary>${body}</details>`;
const raw = (title, file) => fold(title, `<pre>${esc(read(file).trim())}</pre>`);
const commonsName = url => { try { return decodeURIComponent(String(url).split('/').pop()).replace(/^File:/, '').replace(/_/g, ' '); } catch { return String(url); } };
const photoRow = (name, photo, url) => `${esc(name)} — ${esc(photo.author || '찍은 이 표시 없음')}${photo.license ? ` · ${esc(photo.license)}` : ''}${url ? ` · ${link(url, '원본')}` : ''}`;

// 지구본: 장소 설명 사진
const globeInfo = JSON.parse(read('learning/inquiry/globe/data/info.json'));
const globePhotos = Object.entries(globeInfo).filter(([, entry]) => entry?.photo)
  .map(([key, entry]) => photoRow(key.split(':').slice(1).join(':'), entry.photo, entry.photo.page));

// 국내 지도: 체험·관광 장소 사진
const travelBox = { window: {} };
vm.runInNewContext(read('learning/inquiry/korea-map/data/travel-data.js'), travelBox);
const travel = travelBox.window.KOREA_TRAVEL;
const placeNames = new Map((travel.places || []).map(place => [place.id, place.name]));
const travelPhotos = Object.entries(travel.photos || {}).map(([id, photo]) => photoRow(placeNames.get(id) || id, photo, photo.page));

// 세계 항해: 명소·발견 지점·동물 사진과 오늘날 도시 사진
const voyage = file => Object.entries(JSON.parse(read(`learning/inquiry/age-of-exploration/data/catalog/${file}`)))
  .map(([id, photo]) => photoRow(commonsName(photo.source || id), photo, photo.source));
const voyagePlaces = voyage('photo-credits.json');
const voyageCities = voyage('city-photo-credits.json');

// 미술관: 권리 표시가 있는 작품
const artBox = { window: {} };
vm.runInNewContext(read('learning/arts/art-appreciation/museum/art-data.js'), artBox);
const artworks = artBox.window.MUSEUM_ROOMS.flatMap(room => room.works || [])
  .filter(work => work.rights || work.source)
  .map(work => `${esc(work.title)} (${esc(work.artist)}) — ${esc(work.rights || '')}${work.source ? ` · ${link(work.source, '소장처·원문')}` : ''}`);

// 조각 공원: 3D 모형
const park = read('learning/arts/art-appreciation/park/park.js');
const sculptures = [...park.matchAll(/title: '([^']+)'[\s\S]*?source: '([^']*)', rights: '([^']*)'/g)]
  .map(([, title, source, rights]) => `${esc(title)} — ${esc(rights)}${source ? ` · ${link(source, '소장처')}` : ''}`);

// 음악 감상: 실연 녹음
const music = read('learning/arts/music-listening/data/classical.js');
const recordings = [...music.matchAll(/'(\d\d)': \{ file: '([^']+)', performer: '([^']+)', license: '([^']+)'/g)]
  .map(([, no, file, performer, license]) => `${esc(no)} ${esc(file)} — ${esc(performer)} · ${esc(license)}`);

const sections = [
  ['지구본·세계지리', list([
    `바탕 그림·지명·나라 경계: ${link('https://www.naturalearthdata.com/', 'Natural Earth')} (퍼블릭 도메인)`,
    `땅 높이·바다 깊이: ${link('https://doi.org/10.7289/V5C8276M', 'NOAA ETOPO1')} — Amante &amp; Eakins (2009), 퍼블릭 도메인`,
    `기후 구분: ${link('https://doi.org/10.5194/hess-11-1633-2007', 'Peel, Finlayson &amp; McMahon (2007)').replace('&amp;amp;', '&amp;')}, CC BY-NC-SA 2.5`,
    `인구밀도: ${link('https://data.worldbank.org/indicator/EN.POP.DNST', 'World Bank EN.POP.DNST')}, 2023년, CC BY 4.0`,
    `판 경계: ${link('https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer', 'USGS 판 경계 지도')} (Bird, 2003 등)`,
    `한강 물줄기: © ${link('https://www.openstreetmap.org/copyright', 'OpenStreetMap')} 기여자, ODbL`,
    `지도 그리기: MapLibre GL JS (BSD-3-Clause)`,
    `장소 사진: 위키미디어 공용의 자유 이용 사진`,
  ]) + fold(`장소 사진 ${globePhotos.length}장`, list(globePhotos))],
  ['국내 지도', list([
    `땅 높이: Copernicus DEM (© DLR, © Airbus, EU·ESA) · Mapzen`,
    `한양도성 공간자료: dataandcrowd (GPL-3.0)`,
    `물길·도로·철도: © ${link('https://www.openstreetmap.org/copyright', 'OpenStreetMap')} 기여자, ODbL`,
    `바탕 지도: Natural Earth · 북한 도 경계: geoBoundaries (CC BY 4.0) · 시·군 이름표: 통계청 SGIS 기반`,
    `유역: ${link('https://www.hydrosheds.org/products/hydrobasins', 'HydroBASINS v1.c')} — <a href="/learning/inquiry/korea-map/data/watershed-notice.html">출처와 이용 조건 전문</a>. 공식 유역 고시·홍수 예측 자료가 아닙니다.`,
  ]) + fold(`체험·관광 장소 사진 ${travelPhotos.length}장`, list(travelPhotos)) + raw('유물·유적 사진 기록', 'learning/inquiry/korea-map/heritage/SOURCES.md')],
  ['세계 항해', list([
    `지도: ${link('https://www.naturalearthdata.com/', 'Natural Earth')} (퍼블릭 도메인)`,
    `사진: 위키미디어 공용의 자유 이용 사진`,
  ]) + fold(`명소·발견 지점·동물 사진 ${voyagePlaces.length}장`, list(voyagePlaces)) + fold(`오늘날 도시 사진 ${voyageCities.length}장`, list(voyageCities))
    + raw('그 밖의 기록', 'learning/inquiry/age-of-exploration/ATTRIBUTION.md')],
  ['미술 감상', fold(`미술관 작품 ${artworks.length}점`, list(artworks)) + fold(`조각 공원 3D 모형 ${sculptures.length}점`, list(sculptures))
    + raw('3D 모형 이용 조건 기록', 'learning/arts/art-appreciation/museum/assets/models/LICENSES.md')
    + raw('조각 공원 그림 기록', 'learning/arts/art-appreciation/park/IMAGE_CREDITS.md')],
  ['음악 감상', fold(`서양 고전 음악 실연 녹음 ${recordings.length}곡`, list(recordings))
    + raw('녹음 출처와 이용 조건 기록', 'learning/arts/music-listening/assets/audio/classical/AUDIO_CREDITS.md')],
  ['한자', list([
    `일부 예문: ${link('https://krdict.korean.go.kr/', '국립국어원 한국어기초사전')}`,
    `획순: ${link('https://kanjivg.tagaini.net/', 'KanjiVG')} / Make Me a Hanzi`,
  ])],
  ['오방색', list([
    `그림: 국립중앙박물관 외규장각 의궤, 공공누리 제4유형(출처 표시·상업적 이용 금지·변경 금지) — ${link('https://www.museum.go.kr/uigwe/story/story', '국립중앙박물관 · 사수도란?')}`,
    `처용무: ${link('https://www.gugak.go.kr/ency/topic/view/450', '국립국악원')}`,
  ])],
  ['과학 실험실', list([
    `수소 화합물의 끓는점 표: 동아 2022 물질과 에너지 26쪽 · CH₄ ${link('https://www.nist.gov/mml/acmd/cryogenic-technologies-project/about-cryogenics', 'NIST')} · NH₃ ${link('https://cameochemicals.noaa.gov/chris/AMA.pdf', 'NOAA')}`,
    `행성 반지름 표: 천재교과서 2022 과학1(임성숙) 232~233쪽`,
    `달 앞면 무늬(지구와 달): NASA LRO`,
  ])],
  ['효과음', raw('효과음 기록', 'assets/sound/SFX-SOURCES.md') + raw('과일 종 게임 소리 기록', 'learning/games/fruitbell/assets/sound/SOURCES.md')],
];

const footer = '<footer><strong><a href="/school-setup">학교 관리자 설정 안내</a></strong> · <a href="/privacy">개인정보 처리방침</a> · <a href="/terms">이용약관</a> · <a href="/credits">자료 출처</a> · <a href="/support">문의</a></footer>';
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>자료 출처</title><link rel="stylesheet" href="/assets/legal.css"><style>details{margin:10px 0}summary{cursor:pointer}pre{white-space:pre-wrap;word-break:break-word;font:inherit;font-size:.9em}li{word-break:break-word}</style></head><body>
<main><header class="lead"><h1>자료 출처</h1><p class="small">학습 화면에 쓴 바깥 자료의 출처와 이용 조건을 한곳에 모았습니다. 학습 화면에는 따로 적지 않습니다.</p></header>
<article class="content">
${sections.map(([title, body]) => `<section><h2>${esc(title)}</h2>${body}</section>`).join('\n')}
</article></main>
${footer}</body></html>
`;
fs.writeFileSync(path.join(root, 'apps/site/credits.html'), html);
console.log(`apps/site/credits.html ${Math.round(html.length / 1024)}KB — 지구본 ${globePhotos.length}, 국내 여행지 ${travelPhotos.length}, 항해 ${voyagePlaces.length}+${voyageCities.length}, 미술 ${artworks.length}+${sculptures.length}, 음악 ${recordings.length}`);
