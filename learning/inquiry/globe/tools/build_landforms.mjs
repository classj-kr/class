// 수능 세계지리의 「독특한 지형」 사례 지역과 지역 단원 지명 이름표를 만든다(data/landform-labels.js).
//
//   node tools/build_landforms.mjs
//
// 큰 지형 이름표(data/globe-data.js)는 Natural Earth 자료에서 자리를 얻지만, 여기 것은 한 지점을 가리키는
// 사례 지역이라 좌표를 표에 직접 적는다. 누르면 그 자리가 깜빡이고 설명 창이 열린다.
// 이름표를 더하면 data/info.json에 설명도 함께 넣는다(검사가 이름표마다 설명을 요구한다).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// [갈래, 이름, tier, 경도, 위도]
const PLACES = [
  // 카르스트·화산 지형
  ["other", "구이린", 3, 110.29, 25.27],
  ["other", "할롱베이", 3, 107.05, 20.9],
  ["other", "파묵칼레", 4, 29.12, 37.92],
  ["other", "자이언츠 코즈웨이", 4, -6.51, 55.24],
  // 빙하 지형
  ["other", "송네 피오르", 3, 6.5, 61.15],
  ["other", "밀퍼드사운드", 4, 167.9, -44.65],
  ["peak", "마터호른산 4,478m", 3, 7.66, 45.98],
  ["other", "요세미티 계곡", 4, -119.57, 37.74],
  // 건조 지형
  ["other", "모뉴먼트밸리", 3, -110.1, 36.99],
  ["other", "울루루", 3, 131.04, -25.34],
  ["other", "우유니 소금 사막", 3, -67.5, -20.2],
  ["other", "데스밸리", 4, -116.87, 36.5],
  // 해안 지형
  ["other", "그레이트배리어리프", 2, 147.5, -18],
  ["other", "리아스 해안", 4, -8.9, 42.5],
  ["other", "순다르반스", 4, 89.2, 21.9],
  ["other", "바덴해", 4, 7.5, 53.6],
  // 하천 지형
  ["other", "이구아수 폭포", 3, -54.44, -25.69],
  ["other", "빅토리아 폭포", 3, 25.86, -17.92],
  ["other", "나이아가라 폭포", 3, -79.07, 43.08],
  ["other", "오카방고 삼각주", 4, 22.8, -19.3],
  ["other", "라플라타강 하구", 3, -57, -35.2],
  ["other", "짜오프라야강 삼각주", 4, 100.5, 14.3],
  ["other", "홍강 삼각주", 4, 106.2, 20.6],
  // 지역 단원 지명
  ["other", "발트 순상지", 2, 27, 63.5],
  ["plateau", "메세타", 3, -4, 40.2],
  ["plain", "헝가리 평원", 3, 20.3, 47],
  ["plain", "메소포타미아", 3, 44.5, 32.8],
  ["plain", "세렝게티", 4, 34.8, -2.3],
  ["peninsula", "시나이반도", 3, 33.8, 29.3],
  ["peninsula", "래브라도반도", 2, -68, 54],
  ["plain", "센트럴밸리", 4, -120.5, 37],
];

const labels = PLACES.map(([kind, name, tier, lng, lat]) => ({
  type: "Feature",
  properties: { name, kind, tier, key: `${kind}:${name}` },
  geometry: { type: "Point", coordinates: [lng, lat] },
}));

fs.writeFileSync(path.join(ROOT, "data/landform-labels.js"),
  "// tools/build_landforms.mjs 로 만든 파일. 직접 고치지 말 것.\n"
  + `window.GLOBE_DATA.labels.features.push(...${JSON.stringify(labels)});\n`);
console.log(`이름표 ${labels.length}개`);
