// 지구본의 이름표·국경 자료(data/globe-data.js)를 만든다.
//
//   node tools/build_labels.mjs
//
// 자리(위치)는 Natural Earth 공개 자료에서 가져오고, 우리말 이름은 여기 표에 직접 적는다.
// Natural Earth의 한글 이름은 "코스탈 플레인", "웨스턴 플래투"처럼 소리만 옮긴 것이 많아 쓰지 않는다.
// 표에 없는 지형은 싣지 않는다.
//
// tier: 이름표가 나타나는 배율 단계. 1은 지구 전체가 보일 때부터, 4는 가장 크게 확대했을 때.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(os.tmpdir(), "globe-natural-earth");
const NE_BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/";

// Natural Earth 이름 → [우리말 이름, 갈래, tier]
const REGIONS = {
  // 산지
  "HIMALAYAS": ["히말라야산맥", "mountain", 1],
  "ANDES": ["안데스산맥", "mountain", 1],
  "ROCKY MOUNTAINS": ["로키산맥", "mountain", 1],
  "ALPS": ["알프스산맥", "mountain", 1],
  "URAL MOUNTAINS": ["우랄산맥", "mountain", 1],
  "APPALACHIAN MTS.": ["애팔래치아산맥", "mountain", 1],
  "GREAT DIVIDING RANGE": ["그레이트디바이딩산맥", "mountain", 1],
  "ATLAS MOUNTAINS": ["아틀라스산맥", "mountain", 2],
  "CAUCASUS MTS.": ["캅카스산맥", "mountain", 2],
  "TIAN SHAN": ["톈산산맥", "mountain", 2],
  "ALTAY MOUNTAINS": ["알타이산맥", "mountain", 2],
  "KUNLUN MOUNTAINS": ["쿤룬산맥", "mountain", 2],
  "ZAGROS MOUNTAINS": ["자그로스산맥", "mountain", 2],
  "PYRENEES": ["피레네산맥", "mountain", 2],
  "KJØLEN MOUNTAINS": ["스칸디나비아산맥", "mountain", 2],
  "Transantarctic Mountains": ["남극 횡단 산맥", "mountain", 2],
  "HINDU KUSH": ["힌두쿠시산맥", "mountain", 3],
  "KARAKORAM RA.": ["카라코람산맥", "mountain", 3],
  "BROOKS RANGE": ["브룩스산맥", "mountain", 3],
  "ALASKA RANGE": ["알래스카산맥", "mountain", 3],
  "CASCADE RANGE": ["캐스케이드산맥", "mountain", 3],
  "COAST MOUNTAINS": ["코스트산맥", "mountain", 3],
  "SIERRA NEVADA": ["시에라네바다산맥", "mountain", 3],
  "SIERRA MADRE OCCIDENTAL": ["서시에라마드레산맥", "mountain", 3],
  "SIERRA MADRE ORIENTAL": ["동시에라마드레산맥", "mountain", 3],
  "STANOVOY RANGE": ["스타노보이산맥", "mountain", 3],
  "VERKHOYANSK RANGE": ["베르호얀스크산맥", "mountain", 3],
  "GREATER KHINGAN RANGE": ["다싱안링산맥", "mountain", 3],
  "CHAÎNE ANNAMITIQUE": ["안남산맥", "mountain", 3],
  "CARPATHIAN MOUNTAINS": ["카르파티아산맥", "mountain", 3],
  "DRAKENSBERG": ["드라켄즈버그산맥", "mountain", 3],
  "EASTERN GHATS": ["동고츠산맥", "mountain", 3],
  "WESTERN GHATS": ["서고츠산맥", "mountain", 3],
  "SOUTHERN ALPS": ["서던알프스산맥", "mountain", 3],
  "Qinling Mountains": ["친링산맥", "mountain", 3],
  "APPENNINI": ["아펜니노산맥", "mountain", 4],
  "ELBURZ MTS.": ["엘부르즈산맥", "mountain", 4],
  "MACKENZIE MTS.": ["매켄지산맥", "mountain", 4],
  "TIBESTI MTS.": ["티베스티산지", "mountain", 4],
  "AHAGGAR MTS.": ["아하가르산지", "mountain", 4],
  "QUILIAN MOUNTAINS": ["치롄산맥", "mountain", 4],
  "Dinaric Alps": ["디나르알프스산맥", "mountain", 4],
  "Arakan Yoma": ["아라칸산맥", "mountain", 4],
  "Taihang Mts.": ["타이항산맥", "mountain", 4],
  "Hangayn Mts.": ["항가이산맥", "mountain", 4],
  "SIKHOTE-ALIN’ RANGE": ["시호테알린산맥", "mountain", 4],
  "PONTIC MOUNTAINS": ["폰투스산맥", "mountain", 4],
  "Cord. Cantábrica": ["칸타브리아산맥", "mountain", 4],
  "Hamgyong Mts.": ["함경산맥", "mountain", 4],

  // 고원
  "PLATEAU OF TIBET": ["티베트고원", "plateau", 2],
  "BRAZILIAN HIGHLANDS": ["브라질고원", "plateau", 1],
  "DECCAN PLATEAU": ["데칸고원", "plateau", 1],
  "MONGOLIAN PLATEAU": ["몽골고원", "plateau", 2],
  "ETHIOPIAN HIGHLANDS": ["에티오피아고원", "plateau", 2],
  "PAMIRS": ["파미르고원", "plateau", 2],
  "CENTRAL SIBERIAN PLATEAU": ["중앙시베리아고원", "plateau", 2],
  "WESTERN PLATEAU": ["서부 고원", "plateau", 2],
  "Polar Plateau": ["남극고원", "plateau", 2],
  "ALTIPLANO": ["알티플라노", "plateau", 3],
  "COLORADO PLATEAU": ["콜로라도고원", "plateau", 3],
  "ALTI-PLANICIE MEXICANA": ["멕시코고원", "plateau", 3],
  "GUIANA SHIELD": ["기아나고지", "plateau", 3],
  "YUNGUI PLATEAU": ["윈구이고원", "plateau", 3],
  "Loess Plateau": ["황토고원", "plateau", 3],
  "COLUMBIA PLAT.": ["컬럼비아고원", "plateau", 4],
  "PLANALTO DO MATO GROSSO": ["마투그로수고원", "plateau", 4],
  "Adamawa Plateau": ["아다마와고원", "plateau", 4],

  // 평원
  "GREAT PLAINS": ["그레이트플레인스", "plain", 1],
  "NORTHERN EUROPEAN PLAIN": ["북유럽 평원", "plain", 1],
  "WESTERN SIBERIAN PLAIN": ["서시베리아 평원", "plain", 1],
  "PAMPAS": ["팜파스", "plain", 1],
  "CENTRAL LOWLAND": ["중앙 평원", "plain", 2],
  "NORTH CHINA PLAIN": ["화베이 평원", "plain", 2],
  "GANGES PLAIN": ["힌두스탄 평원", "plain", 2],
  "KAZAKH STEPPE": ["카자흐 스텝", "plain", 2],
  "LLANOS": ["야노스", "plain", 2],
  "GRAN CHACO": ["그란차코", "plain", 2],
  "SAHEL": ["사헬", "plain", 2],
  "COASTAL PLAIN": ["대서양 연안 평야", "plain", 3],
  "MANCHURIAN PLAIN": ["둥베이 평원", "plain", 3],
  "TURAN LOWLAND": ["투란 저지", "plain", 3],
  "CASPIAN DEPRESSION": ["카스피해 연안 저지", "plain", 3],
  "NORTH SIBERIAN LOWLAND": ["북시베리아 저지", "plain", 3],
  "NULLARBOR PLAIN": ["널라버 평원", "plain", 3],

  // 분지
  "AMAZON BASIN": ["아마존 분지", "basin", 1],
  "CONGO BASIN": ["콩고 분지", "basin", 1],
  "GREAT ARTESIAN BASIN": ["대찬정 분지", "basin", 2],
  "TARIM BASIN": ["타림 분지", "basin", 3],
  "GREAT BASIN": ["그레이트베이슨", "basin", 3],
  "SICHUAN BASIN": ["쓰촨 분지", "basin", 3],
  "MURRAY-DARLING BASIN": ["머리달링 분지", "basin", 3],
  "Junggar Basin": ["준가르 분지", "basin", 4],
  "Qaidam Basin": ["차이다무 분지", "basin", 4],
  "Fergana Valley": ["페르가나 분지", "basin", 4],

  // 사막
  "SAHARA": ["사하라 사막", "desert", 1],
  "GOBI DESERT": ["고비 사막", "desert", 1],
  "KALAHARI DESERT": ["칼라하리 사막", "desert", 2],
  "NAMIB DESERT": ["나미브 사막", "desert", 2],
  "RUB’ AL KHALI": ["룹알할리 사막", "desert", 2],
  "DESIERTO DE ATACAMA": ["아타카마 사막", "desert", 2],
  "TAKLIMAKAN DESERT": ["타클라마칸 사막", "desert", 2],
  "GARAGUM DESERT": ["카라쿰 사막", "desert", 3],
  "QIZILQUM DESERT": ["키질쿰 사막", "desert", 3],
  "THAR DESERT": ["타르 사막", "desert", 3],
  "SYRIAN DESERT": ["시리아 사막", "desert", 3],
  "LIBYAN DESERT": ["리비아 사막", "desert", 3],
  "NUBIAN DESERT": ["누비아 사막", "desert", 3],
  "GREAT SANDY DESERT": ["그레이트샌디 사막", "desert", 3],
  "GREAT VICTORIA DESERT": ["그레이트빅토리아 사막", "desert", 3],
  "SONORAN DESERT": ["소노라 사막", "desert", 3],
  "CHIHUAHUAN DESERT": ["치와와 사막", "desert", 4],
  "Gibson Desert": ["깁슨 사막", "desert", 4],
  "LUT DESERT": ["루트 사막", "desert", 4],

  // 반도·지협
  "ARABIAN PENINSULA": ["아라비아반도", "peninsula", 1],
  "INDOCHINA PENINSULA": ["인도차이나반도", "peninsula", 1],
  "SCANDINAVIA": ["스칸디나비아반도", "peninsula", 1],
  "PENÍNSULA IBÉRICA": ["이베리아반도", "peninsula", 2],
  "BALKAN PEN.": ["발칸반도", "peninsula", 2],
  "KAMCHATKA PENINSULA": ["캄차카반도", "peninsula", 2],
  "MALAY PENINSULA": ["말레이반도", "peninsula", 2],
  "KOREA": ["한반도", "peninsula", 2],
  "Antarctic Peninsula": ["남극반도", "peninsula", 2],
  "TAYMYR PENINSULA": ["타이미르반도", "peninsula", 3],
  "SOMALI PENINSULA": ["소말리반도", "peninsula", 3],
  "BAJA CALIFORNIA": ["캘리포니아반도", "peninsula", 3],
  "CRIMEA": ["크림반도", "peninsula", 3],
  "FLORIDA": ["플로리다반도", "peninsula", 3],
  "PEN. DE YUCATÁN": ["유카탄반도", "peninsula", 3],
  "Shandong Pen.": ["산둥반도", "peninsula", 3],
  "Is. de Panamá": ["파나마 지협", "peninsula", 3],
  "YAMAL PENINSULA": ["야말반도", "peninsula", 4],
  "ALASKA PENINSULA": ["알래스카반도", "peninsula", 4],
  "KOLA PENINSULA": ["콜라반도", "peninsula", 4],
  "CAPE YORK PEN.": ["케이프요크반도", "peninsula", 4],
  "Liaodong Pen.": ["랴오둥반도", "peninsula", 4],
  "CHUKCHI PENINSULA": ["추코트반도", "peninsula", 4],

  // 골짜기·삼각주 등
  "GREAT RIFT VALLEY": ["동아프리카 지구대", "other", 1],
  "CANADIAN SHIELD": ["캐나다 순상지", "other", 1],
  "PANTANAL": ["판타나우 습지", "other", 3],
  "Mekong Delta": ["메콩강 삼각주", "other", 3],
  "Nile Delta": ["나일강 삼각주", "other", 3],
  "Ganges Delta": ["갠지스강 삼각주", "other", 3],
  "Mississippi Delta": ["미시시피강 삼각주", "other", 3],
  "Niger Delta": ["니제르강 삼각주", "other", 4],
  "Volga Delta": ["볼가강 삼각주", "other", 4],
  "Lena Delta": ["레나강 삼각주", "other", 4],
  "Grand Canyon": ["그랜드캐니언", "other", 4],
  "Yangtze Gorges": ["싼샤", "other", 4],
};

// Natural Earth에 없거나 자리가 없는 지형은 직접 적는다. [이름, 갈래, tier, 경도, 위도]
const MANUAL = [
  ["이란고원", "plateau", 2, 57, 32],
  ["아나톨리아고원", "plateau", 2, 33, 39],
  ["파타고니아", "plateau", 2, -69, -45],
  ["이탈리아반도", "peninsula", 2, 14.5, 41.3],
  // 자료의 태평양 이름표는 둘 다 동태평양에 있어 우리나라 쪽에서 보면 보이지 않는다.
  ["태평양", "sea", 1, 165, 22],
  ["개마고원", "plateau", 4, 127.6, 40.7],
  ["낭림산맥", "mountain", 4, 126.9, 39.9],
  ["태백산맥", "mountain", 4, 128.75, 37.5],
  ["소백산맥", "mountain", 4, 128.05, 36.05],
];

// 자료가 준 자리가 한쪽 끝에 치우쳤거나 다른 이름표와 한 점에 겹치는 것은 자리를 옮긴다. [경도, 위도]
const POSITION = {
  "사하라 사막": [12, 24],
  "사헬": [2, 15],
  "북유럽 평원": [18, 53],
  "동아프리카 지구대": [36, 3],
  "남극 횡단 산맥": [162, -77.5],
  "히말라야산맥": [81.5, 30],
  "안데스산맥": [-69.8, -28.5],
  "브라질고원": [-46, -15],
  "스칸디나비아산맥": [13.5, 66],
  "스칸디나비아반도": [17.5, 61],
  "아라비아반도": [44, 24],
  "이란고원": [54.5, 33.5],
  "타림 분지": [84, 40.9],
  "타클라마칸 사막": [83, 38.6],
  "한반도": [127.15, 35.45],
  "소백산맥": [127.9, 36.3],
  "개마고원": [127.5, 41.1],
  "낭림산맥": [126.95, 40.1],
};

// 높은 산: [이름, 높이(m), tier, 경도, 위도]
const PEAKS = [
  ["에베레스트산", 8849, 2, 86.925, 27.988],
  ["아콩카과산", 6961, 2, -70.011, -32.653],
  ["디날리산", 6190, 2, -151.007, 63.069],
  ["킬리만자로산", 5895, 2, 37.355, -3.066],
  ["K2", 8611, 3, 76.513, 35.881],
  ["엘브루스산", 5642, 3, 42.439, 43.353],
  ["몽블랑산", 4806, 3, 6.865, 45.833],
  ["빈슨산", 4892, 3, -85.617, -78.525],
  ["코지어스코산", 2228, 3, 148.263, -36.456],
  ["후지산", 3776, 3, 138.727, 35.361],
  ["백두산", 2744, 3, 128.077, 41.993],
  ["케냐산", 5199, 4, 37.308, -0.152],
  ["침보라소산", 6263, 4, -78.817, -1.469],
  ["한라산", 1947, 4, 126.533, 33.362],
];

// 바다 이름: Natural Earth 한글 이름을 쓰되 고칠 것만 고치고, 뺄 것은 뺀다.
const MARINE_FIX = {
  "Laccadive Sea": "라카디브해",
  "Golfo de California": "캘리포니아만",
  "Bahía de Campeche": "캄페체만",
  "Shelikhova Gulf": "셸리호프만",
};
const MARINE_SKIP = new Set([
  "Bay of Plenty", "Cook Inlet", "Melville Bay", "Ungava Bay", "Viscount Melville Sound",
  "The North Western Passages", "Inner Seas", "Golfo San Jorge", "Río de la Plata",
  "Great Barrier Reef", "Amazon River", "Columbia River", "Yangtze River",
]);

// 나라 이름은 세계지리 앱 자료를 그대로 쓴다. 나라가 아닌 것은 뺀다.
const COUNTRY_SKIP = new Set(["남극", "소말릴란드", "북키프로스", "프랑스령 남방"]);

async function neFile(name) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${name}.geojson`);
  if (!fs.existsSync(file)) {
    const response = await fetch(`${NE_BASE}${name}.geojson`);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// 다각형 안에서 가장자리와 가장 먼 점(이름표 자리). mapbox/polylabel과 같은 방식.
function polylabel(polygon, precision = 0.05) {
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  for (const [x, y] of polygon[0]) {
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  const width = maxX - minX;
  const height = maxY - minY;
  const cellSize = Math.min(width, height);
  if (cellSize === 0) return [minX, minY];
  const cell = (x, y, h) => {
    const d = pointToPolygonDist(x, y, polygon);
    return { x, y, h, d, max: d + h * Math.SQRT2 };
  };
  const queue = [];
  let h = cellSize / 2;
  for (let x = minX; x < maxX; x += cellSize) {
    for (let y = minY; y < maxY; y += cellSize) queue.push(cell(x + h, y + h, h));
  }
  let best = cell(minX + width / 2, minY + height / 2, 0);
  while (queue.length) {
    queue.sort((a, b) => a.max - b.max);
    const current = queue.pop();
    if (current.d > best.d) best = current;
    if (current.max - best.d <= precision) continue;
    h = current.h / 2;
    queue.push(cell(current.x - h, current.y - h, h), cell(current.x + h, current.y - h, h),
      cell(current.x - h, current.y + h, h), cell(current.x + h, current.y + h, h));
  }
  return [best.x, best.y];
}

function pointToPolygonDist(x, y, polygon) {
  let inside = false;
  let minDistSq = Infinity;
  for (const ring of polygon) {
    for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
      const a = ring[i];
      const b = ring[j];
      if ((a[1] > y) !== (b[1] > y) && (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;
      minDistSq = Math.min(minDistSq, segDistSq(x, y, a, b));
    }
  }
  return (inside ? 1 : -1) * Math.sqrt(minDistSq);
}

function segDistSq(px, py, a, b) {
  let x = a[0]; let y = a[1];
  let dx = b[0] - x; let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = px - x; dy = py - y;
  return dx * dx + dy * dy;
}

function polygonArea(polygon) {
  let sum = 0;
  const ring = polygon[0];
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  }
  return Math.abs(sum / 2);
}

// 여러 조각으로 된 지형은 가장 큰 조각에 이름을 단다.
function labelPoint(geometries) {
  const polygons = geometries.flatMap((g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates));
  const largest = polygons.reduce((a, b) => (polygonArea(b) > polygonArea(a) ? b : a));
  return polylabel(largest);
}

const round = (value) => Math.round(value * 100) / 100;
const point = (lng, lat, properties) => ({
  type: "Feature",
  properties,
  geometry: { type: "Point", coordinates: [round(lng), round(lat)] },
});

async function main() {
  const labels = [];

  const regions = await neFile("ne_50m_geography_regions_polys");
  const byName = new Map();
  for (const feature of regions.features) {
    const entry = REGIONS[feature.properties.NAME];
    if (!entry) continue;
    if (!byName.has(entry[0])) byName.set(entry[0], { entry, geometries: [] });
    byName.get(entry[0]).geometries.push(feature.geometry);
  }
  const missing = Object.values(REGIONS).map((e) => e[0]).filter((name) => !byName.has(name));
  if (missing.length) throw new Error(`자료에 없는 지형: ${missing.join(", ")}`);
  for (const { entry: [name, kind, tier], geometries } of byName.values()) {
    const [lng, lat] = labelPoint(geometries);
    labels.push(point(lng, lat, { name, kind, tier }));
  }
  for (const [name, kind, tier, lng, lat] of MANUAL) labels.push(point(lng, lat, { name, kind, tier }));
  for (const feature of labels) {
    const moved = POSITION[feature.properties.name];
    if (moved) feature.geometry.coordinates = moved;
  }
  const unused = Object.keys(POSITION).filter((name) => !labels.some((f) => f.properties.name === name));
  if (unused.length) throw new Error(`자리 옮길 이름이 없음: ${unused.join(", ")}`);
  for (const [name, height, tier, lng, lat] of PEAKS) {
    labels.push(point(lng, lat, { name: `${name} ${height.toLocaleString("en-US")}m`, kind: "peak", tier }));
  }

  const marine = await neFile("ne_50m_geography_marine_polys");
  const seas = new Map();
  for (const feature of marine.features) {
    const { name, name_ko: nameKo, scalerank, featurecla } = feature.properties;
    if (MARINE_SKIP.has(name) || featurecla === "river" || !nameKo) continue;
    const label = MARINE_FIX[name] || nameKo;
    const tier = Math.min(4, scalerank + 1);
    // 태평양·대서양은 남북 두 조각이라 이름표도 둘이다.
    const key = `${label}:${name}`;
    if (!seas.has(key)) seas.set(key, { label, tier, geometries: [] });
    seas.get(key).geometries.push(feature.geometry);
  }
  for (const { label, tier, geometries } of seas.values()) {
    const [lng, lat] = labelPoint(geometries);
    labels.push(point(lng, lat, { name: label, kind: "sea", tier }));
  }

  const countrySource = fs.readFileSync(path.join(ROOT, "../world-geography/data/world-countries.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(countrySource, context);
  for (const country of context.window.WORLD_COUNTRIES) {
    if (COUNTRY_SKIP.has(country.name)) continue;
    const area = country.area || 0;
    let tier = area > 1500000 ? 1 : area > 400000 ? 2 : area > 80000 ? 3 : 4;
    if (country.name === "대한민국") tier = 2;
    const [lat, lng] = country.label;
    labels.push(point(lng, lat, { name: country.name, kind: "country", tier }));
  }

  const lines = await neFile("ne_50m_admin_0_boundary_lines_land");
  const borders = lines.features.map((feature) => {
    const parts = feature.geometry.type === "LineString" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const slim = parts.map((part) => part.map(([x, y]) => [round(x), round(y)])
      .filter((p, i, all) => i === 0 || p[0] !== all[i - 1][0] || p[1] !== all[i - 1][1]));
    return { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: slim } };
  });

  const data = {
    labels: { type: "FeatureCollection", features: labels },
    borders: { type: "FeatureCollection", features: borders },
  };
  const out = path.join(ROOT, "data/globe-data.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `// tools/build_labels.mjs 로 만든 파일. 직접 고치지 말 것.\nwindow.GLOBE_DATA = ${JSON.stringify(data)};\n`);
  const count = (kind) => labels.filter((f) => f.properties.kind === kind).length;
  console.log(`이름표 ${labels.length}개 (산지 ${count("mountain")}, 고원 ${count("plateau")}, 평원 ${count("plain")}, 분지 ${count("basin")}, 사막 ${count("desert")}, 반도 ${count("peninsula")}, 그 밖 ${count("other")}, 산 ${count("peak")}, 바다 ${count("sea")}, 나라 ${count("country")})`);
  console.log(`국경 ${borders.length}줄, ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}

await main();
