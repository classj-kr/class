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
  "JUTLAND": ["유틀란트반도", "peninsula", 3],

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

// 강: Natural Earth는 한 강을 구간마다 다른 이름으로 나눠 둔다(창장강 = 퉈퉈·퉁톈·진사·창장).
// 구간 이름 → [우리말 강 이름, tier]. 같은 우리말 이름끼리 한 줄기로 잇는다.
const RIVERS = {
  "Nile": ["나일강", 1], "El Bahr el Abyad": ["나일강", 1], "Bahr el Jebel": ["나일강", 1],
  "Albert Nile": ["나일강", 1], "Victoria Nile": ["나일강", 1],
  "Amazonas": ["아마존강", 1],
  "Chang Jiang": ["창장강", 1], "Yangtze": ["창장강", 1], "Jinsha": ["창장강", 1], "Tongtian": ["창장강", 1], "Tuotuo": ["창장강", 1],
  "Mississippi": ["미시시피강", 1],
  "Huang": ["황허강", 2],
  "Mekong": ["메콩강", 2], "Lancang": ["메콩강", 2], "Za": ["메콩강", 2],
  "Ganges": ["갠지스강", 2],
  "Indus": ["인더스강", 2],
  "Volga": ["볼가강", 2],
  "Danube": ["도나우강", 2], "Donau": ["도나우강", 2],
  "Ob": ["오비강", 2],
  "Yenisey": ["예니세이강", 2],
  "Lena": ["레나강", 2],
  "Amur": ["아무르강", 2], "Heilong Jiang": ["아무르강", 2],
  "Congo": ["콩고강", 2], "Lualaba": ["콩고강", 2],
  "Niger": ["니제르강", 2],
  "Zambezi": ["잠베지강", 2],
  "Paraná": ["파라나강", 2],
  "Mackenzie": ["매켄지강", 2],
  "Missouri": ["미주리강", 2],
  "Brahmaputra": ["브라마푸트라강", 3], "Yarlung": ["브라마푸트라강", 3], "Dihang": ["브라마푸트라강", 3],
  "Euphrates": ["유프라테스강", 3], "Firat": ["유프라테스강", 3], "Al Furat": ["유프라테스강", 3],
  "Tigris": ["티그리스강", 3], "Dicle": ["티그리스강", 3],
  "Rhein": ["라인강", 3], "Rhin": ["라인강", 3], "Rhine": ["라인강", 3],
  "Dnipro": ["드니프로강", 3], "Dnepre": ["드니프로강", 3],
  "Irtysh": ["이르티시강", 3], "Ertis": ["이르티시강", 3], "Ertix": ["이르티시강", 3],
  "Orange": ["오렌지강", 3],
  "Murray": ["머리강", 3],
  "Orinoco": ["오리노코강", 3],
  "Yukon": ["유콘강", 3],
  "St. Lawrence": ["세인트로렌스강", 3],
  "Colorado": ["콜로라도강", 3], // 아르헨티나의 같은 이름 강은 RIVER_WEST_OF로 뺀다
  "Rio Grande": ["리오그란데강", 3],
  "Ayeyarwady": ["이라와디강", 3],
  "Ohio": ["오하이오강", 3],
  "Abay": ["청나일강", 3], "El Bahr el Azraq": ["청나일강", 3],
  "Madeira": ["마데이라강", 3],
  "São  Francisco": ["상프란시스쿠강", 3],
  "Salween": ["살윈강", 4], "Nu": ["살윈강", 4],
  "Xi": ["시장강", 4],
  "Darling": ["달링강", 4],
  "Syr Darya": ["시르다리야강", 4],
  "Amu  Darya": ["아무다리야강", 4],
  "Elbe": ["엘베강", 4],
  "Seine": ["센강", 4],
  "Thames": ["템스강", 4],
  "Rhône": ["론강", 4],
  "Po": ["포강", 4],
  "Don": ["돈강", 4],
  "Vistula": ["비스와강", 4],
  "Oder": ["오데르강", 4],
  "Kolyma": ["콜리마강", 4],
  "Songhua": ["쑹화강", 4],
  "Liao": ["랴오허강", 4],
  "Tarim": ["타림강", 4],
  "Limpopo": ["림포포강", 4],
  "Sénégal": ["세네갈강", 4],
  "Tocantins": ["토칸칭스강", 4],
  "Uruguay": ["우루과이강", 4],
  "Magdalena": ["마그달레나강", 4],
  "Fraser": ["프레이저강", 4],
  "Jordan": ["요르단강", 4],
};
const RIVER_WEST_OF = { "Colorado": -100 };
// 한반도 강은 50m 자료에 없어 10m 자료에서 가져온다.
const KOREA_RIVERS = {
  "Yalu": ["압록강", 4], "Tumen": ["두만강", 4], "Han": ["한강", 4], "Namhan": ["한강", 4], "Nakdong": ["낙동강", 4],
};
const inKorea = ([x, y]) => x > 124 && x < 131 && y > 33 && y < 43.5;
// 강 이름이 다른 이름표와 한 점에 겹치는 곳은 줄기 위 다른 자리로 옮긴다. [[경도, 위도], ...]
const RIVER_LABEL_AT = {
  "낙동강": [[128.45, 35.62]], // 가운데 자리는 소백산맥 이름표와 겹친다
};

// 호수: Natural Earth 10m 호수 이름 → [우리말 이름, tier]. 자리는 호수 안에서 가장자리와 가장 먼 점.
const LAKES = {
  "Lake Baikal": ["바이칼호", 2],
  "Lake Victoria": ["빅토리아호", 2],
  "Lake Superior": ["슈피리어호", 3],
  "Lake Tanganyika": ["탕가니카호", 3],
  "Lake Malawi": ["말라위호", 3],
  "Lake Chad": ["차드호", 3],
  "Lake Balkhash": ["발하시호", 3],
  "Lake Ladoga": ["라도가호", 3],
  "Lago Titicaca": ["티티카카호", 3],
  "Great Bear Lake": ["그레이트베어호", 3],
  "Great Slave Lake": ["그레이트슬레이브호", 3],
  "Lake Winnipeg": ["위니펙호", 3],
  "Lake Eyre North": ["에어호", 3],
  "Lake Michigan": ["미시간호", 4],
  "Lake Huron": ["휴런호", 4],
  "Lake Erie": ["이리호", 4],
  "Lake Ontario": ["온타리오호", 4],
  "Lake Athabasca": ["애서배스카호", 4],
  "Great Salt Lake": ["그레이트솔트호", 4],
  "Lago de Nicaragua": ["니카라과호", 4],
  "Lake Turkana": ["투르카나호", 4],
  "Lake Tana": ["타나호", 4],
  "Lake Onega": ["오네가호", 4],
  "Vänern": ["베네른호", 4],
  "Issyk-Kul": ["이식쿨호", 4],
  "Qinghai Hu": ["칭하이호", 4],
  "Tonlé Sap": ["톤레사프호", 4],
  "Khövsgöl Nuur": ["후브스굴호", 4],
  "Dead Sea": ["사해", 4],
  "Lake Albert": ["앨버트호", 4],
  "Lake Kivu": ["키부호", 4],
  "Lac Moeru": ["므웨루호", 4],
  "Lake Kariba": ["카리바호", 4],
  "Lake Urmia": ["우르미아호", 4],
  "Lake Van": ["반호", 4],
  "Lake Khanka": ["한카호", 4],
  "Poyang Hu": ["포양호", 4],
  "Tai Hu": ["타이호", 4],
  "Danau Toba": ["토바호", 4],
  "Lake Saimaa": ["사이마호", 4],
  "IJsselmeer": ["에이설호", 4],
  "Lago de Managua": ["마나과호", 4],
  "Lago Argentino": ["아르헨티노호", 4],
  "Reindeer Lake": ["레인디어호", 4],
  "Lake Winnipegosis": ["위니페고시스호", 4],
  "Lake Manitoba": ["매니토바호", 4],
};
// 호수 자료에 없거나 여러 조각이라 자리를 직접 적는 호수. [이름, tier, 경도, 위도]
const MANUAL_LAKES = [
  ["오대호", 2, -84.6, 43.6], // 다섯 호수 가운데(미시간주 땅 위)에 무리 이름을 단다
  ["아랄해", 3, 59.6, 45.3],
  ["마라카이보호", 4, -71.6, 9.8],
  ["파투스 석호", 4, -51.2, -31.1],
  ["나세르호", 4, 32.4, 23.0],
  ["볼타호", 4, -0.2, 7.4],
];

// 섬·제도: [우리말 이름, tier, 자리, 속한 나라]. 자리가 문자열이면 Natural Earth 10m 섬 다각형 안의 점,
// [경도, 위도]면 그 자리. 제도는 섬 무리 한가운데(바다)에 이름을 단다.
// 속한 나라는 본토에서 멀리 떨어져 있어 어느 나라 땅인지 짐작하기 어려운 곳만 적는다. 영유권 분쟁지는 적지 않는다.
const ISLANDS = [
  // 오세아니아 섬 지역
  ["멜라네시아", 1, [167, -9]],
  ["미크로네시아", 1, [158, 12]],
  ["폴리네시아", 1, [-148, -6]],
  // 큰 섬
  ["그린란드섬", 1, "GREENLAND", "덴마크"],
  ["마다가스카르섬", 1, "MADAGASCAR"],
  ["뉴기니섬", 2, "NEW GUINEA"],
  ["보르네오섬", 2, "BORNEO"],
  ["수마트라섬", 2, "SUMATRA"],
  ["배핀섬", 2, "BAFFIN ISLAND"],
  ["아이슬란드섬", 2, "ICELAND"],
  ["스리랑카섬", 2, "SRI LANKA"],
  ["태즈메이니아섬", 2, "TASMANIA"],
  ["남섬", 2, "SOUTH ISLAND"],
  ["북섬", 2, "NORTH ISLAND"],
  ["자와섬", 3, "JAVA"],
  ["술라웨시섬", 3, "SULAWESI"],
  ["루손섬", 3, "LUZON"],
  ["민다나오섬", 3, "MINDANAO"],
  ["혼슈섬", 3, [138.3, 36.2]],
  ["홋카이도섬", 3, "HOKKAIDÖ"],
  ["규슈섬", 3, "KYÜSHÜ"],
  ["시코쿠섬", 4, "SHIKOKU"],
  ["사할린섬", 3, "SAKHALIN"],
  ["타이완섬", 3, "TAIWAN"],
  ["하이난섬", 3, "HAINAN"],
  ["그레이트브리튼섬", 3, "GREAT BRITAIN"],
  ["아일랜드섬", 3, "IRELAND"],
  ["빅토리아섬", 3, "VICTORIA ISLAND"],
  ["엘즈미어섬", 3, "ELLESMERE  ISLAND"],
  ["뉴펀들랜드섬", 3, "ISLAND OF NEWFOUNDLAND"],
  ["쿠바섬", 3, "CUBA"],
  ["히스파니올라섬", 3, "HISPANIOLA"],
  ["티에라델푸에고섬", 3, "TIERRA DEL FUEGO"],
  ["시칠리아섬", 3, "Sicilia"],
  ["사르데냐섬", 3, "Sardegna"],
  ["코르시카섬", 4, "Corse", "프랑스"],
  ["크레타섬", 4, "Crete"],
  ["키프로스섬", 4, "Cyprus"],
  ["뱅크스섬", 4, "BANKS ISLAND"],
  ["데번섬", 4, "Devon Island"],
  ["사우샘프턴섬", 4, "Southampton I."],
  ["밴쿠버섬", 4, "Vancouver Island"],
  ["자메이카섬", 4, "Jamaica"],
  ["푸에르토리코섬", 4, "Puerto Rico", "미국"],
  ["티모르섬", 4, "TIMOR"],
  ["발리섬", 4, "Bali"],
  ["마라조섬", 4, "Ilha de Marajó"],
  ["칠로에섬", 4, "Isla de Chiloé"],
  ["브랑겔섬", 4, "Wrangel I."],
  // 우리나라와 그 둘레
  ["제주도", 3, [126.55, 33.08]], // 섬 한가운데는 한라산 이름표 자리라 섬 남쪽 바다에 단다
  ["울릉도", 4, [130.87, 37.5]],
  ["독도", 4, [131.87, 37.24]],
  ["거제도", 4, [128.62, 34.88]],
  ["진도", 4, [126.25, 34.45]],
  ["강화도", 4, [126.45, 37.7]],
  ["쓰시마섬", 4, [129.3, 34.4]],
  // 제도·열도·군도
  ["일본 열도", 2, [142.5, 34.3]], // 혼슈섬 이름표와 겹치지 않게 태평양 쪽에 단다
  ["필리핀 제도", 2, [122.3, 11.6]],
  ["서인도 제도", 2, [-66, 22.5]],
  ["하와이 제도", 2, [-157.3, 20.6], "미국"],
  ["알류샨 열도", 2, [-176, 51.3], "미국"],
  ["캐나다 북극 제도", 2, [-97, 76.5]],
  ["대앤틸리스 제도", 3, [-75.5, 17.2]],
  ["소앤틸리스 제도", 3, [-59.3, 14.6]],
  ["바하마 제도", 3, [-76.8, 24.6]],
  ["쿠릴 열도", 3, [151, 46.9]],
  ["류큐 제도", 3, [127.8, 26.9]],
  ["말루쿠 제도", 3, "MOLUCCAS"],
  ["안다만 제도", 3, [92.8, 12.3], "인도"],
  ["몰디브 제도", 3, [73.4, 3.6]],
  ["세이셸 제도", 3, [55.5, -4.6]],
  ["마스카렌 제도", 3, [57.2, -20.9]],
  ["카보베르데 제도", 3, [-23.9, 16.0]],
  ["카나리아 제도", 3, [-15.6, 28.3], "스페인"],
  ["아조레스 제도", 3, [-28.0, 38.6], "포르투갈"],
  ["갈라파고스 제도", 3, [-90.5, -0.6], "에콰도르"],
  ["이스터섬", 3, [-109.35, -27.12], "칠레"],
  ["포클랜드 제도", 3, [-59.5, -51.75]],
  ["스발바르 제도", 3, [17, 78.6], "노르웨이"],
  ["프란츠요제프 제도", 3, [55, 80.7]],
  ["노바야제믈랴", 3, [56, 74.2]],
  ["세베르나야제믈랴", 3, [100, 79.3]],
  ["노보시비르스크 제도", 3, [142, 75.3]],
  ["솔로몬 제도", 3, [159.5, -8.8]],
  ["피지 제도", 3, [178.4, -17.6]],
  ["누벨칼레도니", 3, [165.6, -21.3], "프랑스"],
  ["마리아나 제도", 3, [145.7, 16.8]],
  ["캐롤라인 제도", 3, [150, 7.3]],
  ["마셜 제도", 3, [169.5, 9.3]],
  ["난사 군도", 4, [114.5, 9.8]],
  ["시사 군도", 4, [112, 16.5]],
  ["센카쿠 열도(댜오위다오)", 4, [123.5, 25.75]],
  ["소순다 열도", 4, [119.5, -9.6]],
  ["비스마르크 제도", 4, [150.5, -3.6]],
  ["니코바르 제도", 4, [93.5, 7.9], "인도"],
  ["락샤드위프 제도", 4, [72.7, 10.6], "인도"],
  ["차고스 제도", 4, [72.4, -6.5]],
  ["코모로 제도", 4, [43.8, -12.0]],
  ["레위니옹섬", 4, [55.5, -21.1], "프랑스"],
  ["잔지바르섬", 4, "Zanzibar I.", "탄자니아"],
  ["소코트라섬", 4, "Socotra", "예멘"],
  ["비오코섬", 4, "Bioko", "적도 기니"],
  ["세인트헬레나섬", 4, [-5.7, -15.95], "영국"],
  ["마데이라 제도", 4, [-16.95, 32.75], "포르투갈"],
  ["버뮤다 제도", 4, [-64.75, 32.3], "영국"],
  ["발레아레스 제도", 4, [2.9, 39.6]],
  ["페로 제도", 4, [-6.9, 62.1], "덴마크"],
  ["괌", 4, [144.8, 13.45], "미국"],
  ["미드웨이 제도", 4, [-177.37, 28.21], "미국"],
  ["통가 제도", 4, [-175.2, -20.2]],
  ["사모아 제도", 4, [-171.8, -13.9]],
  ["쿡 제도", 4, [-159.8, -21.2]],
  ["타히티섬", 4, [-149.4, -17.65], "프랑스"],
  ["투아모투 제도", 4, [-143, -17], "프랑스"],
  ["마르키즈 제도", 4, [-139.5, -9.3], "프랑스"],
  ["후안페르난데스 제도", 4, [-79.9, -33.6], "칠레"],
  ["사우스조지아섬", 4, [-36.5, -54.3], "영국"],
  ["사우스셰틀랜드 제도", 4, [-59.5, -62.2]],
  ["케르겔렌 제도", 4, [69.5, -49.3], "프랑스"],
  ["알렉산더 제도", 4, "Alexander Archipelago", "미국"],
  ["하이다과이 제도", 4, "Haida Gwaii", "캐나다"],
  ["코디액섬", 4, "Kodiak Island"],
  ["롱아일랜드", 4, [-72.9, 40.85]],
  ["로포텐 제도", 4, "Lofoten"],
  ["셰틀랜드 제도", 4, "Shetland Is.", "영국"],
  ["셸란섬", 4, "Zealand"],
  ["고틀란드섬", 4, "Gotland", "스웨덴"],
  ["방카섬", 4, "Bangka"],
  ["캥거루섬", 4, "Kangaroo I."],
  ["프레이저섬", 4, "Fraser I."],
  ["몰타섬", 4, "Malta"],
  ["바레인섬", 4, [50.55, 26.05]],
  ["싱가포르섬", 4, [103.82, 1.35]],
  ["상투메섬", 4, "São Tomé"],
];

// 해협·운하: [이름, tier, 경도, 위도]. 좁은 물길 위에 이름을 단다.
const STRAITS = [
  ["지브롤터 해협", 2, -5.6, 35.95],
  ["호르무즈 해협", 2, 56.4, 26.5],
  ["믈라카 해협", 2, 99.8, 3.8],
  ["베링 해협", 2, -168.9, 65.8],
  ["드레이크 해협", 2, -64, -58.5],
  ["모잠비크 해협", 2, 41.5, -17.5],
  ["수에즈 운하", 2, 32.35, 30.5],
  ["파나마 운하", 2, -79.75, 9.1],
  ["보스포루스 해협", 3, 29.05, 41.15],
  ["바브엘만데브 해협", 3, 43.35, 12.6],
  ["대한 해협", 3, 128.8, 34.3],
  ["타이완 해협", 3, 119.5, 24.2],
  ["루손 해협", 3, 121, 20.5],
  ["마젤란 해협", 3, -70.3, -53.0],
  ["데이비스 해협", 3, -58, 66.5],
  ["덴마크 해협", 3, -27, 67],
  ["영국 해협", 3, -2.5, 50.0],
  ["배스 해협", 3, 146, -39.7],
  ["토러스 해협", 3, 142.3, -10.2],
  ["다르다넬스 해협", 4, 26.4, 40.2],
  ["도버 해협", 4, 1.5, 51.0],
  ["스카게라크 해협", 4, 9.0, 57.9],
  ["케르치 해협", 4, 36.55, 45.3],
  ["순다 해협", 4, 105.8, -6.0],
  ["마카사르 해협", 4, 118.2, -2.0],
  ["쓰가루 해협", 4, 140.5, 41.45],
  ["라페루즈 해협", 4, 142, 45.6],
  ["타타르 해협", 4, 141.5, 50.5],
  ["허드슨 해협", 4, -70, 62],
  ["쿡 해협", 4, 174.5, -41.3],
  ["플로리다 해협", 4, -81, 24.1],
  ["유카탄 해협", 4, -85.8, 21.8],
  ["포크 해협", 4, 79.7, 9.9],
];

// 곶: [이름, tier, 경도, 위도]. 점 하나를 가리키므로 높은 산처럼 점 오른쪽에 이름을 적는다.
const CAPES = [
  ["희망봉", 2, 18.47, -34.36],
  ["혼곶", 3, -67.27, -55.98],
  ["아굴라스곶", 4, 20.0, -34.83],
  ["로카곶", 4, -9.5, 38.78],
  ["베르데곶", 4, -17.5, 14.72],
  ["노르카프", 4, 25.78, 71.17],
  ["첼류스킨곶", 4, 104.3, 77.73],
  ["데즈뇨프곶", 4, -169.65, 66.08],
  ["코모린곶", 4, 77.54, 8.08],
];

// 바다 자료 가운데 해협 갈래(STRAITS 표로 따로 싣는다).
const STRAIT_CLASSES = new Set(["strait", "channel", "sound"]);

// 여러 호수를 한 이름으로 묶는 것: 이름 → Natural Earth 10m 호수 이름들
const MANUAL_LAKE_PARTS = {
  "오대호": ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario"],
  "아랄해": ["North Aral Sea", "South Aral Sea"],
  "나세르호": ["Lake Nasser"],
  "볼타호": ["Lake Volta"],
};

// 바다와 이어진 석호: 이름 → Natural Earth 10m 바다 자료 이름
const LAGOON_SHAPE = { "마라카이보호": "Lago de Maracaibo", "파투스 석호": "Lagoa dos Patos" };

// 제도의 섬 무리 테두리(Natural Earth 10m "Island group" 이름). 테두리 안에 점이 있는 육지 다각형을 그 제도로 칠한다.
const ISLAND_GROUP_HULL = {
  "멜라네시아": ["MELANESIA"], "미크로네시아": ["MICRONESIA"], "폴리네시아": ["POLYNESIA"],
  "일본 열도": ["JAPAN"], "필리핀 제도": ["PHILIPPINES"], "서인도 제도": ["WEST INDIES"],
  "하와이 제도": ["HAWAIIAN ISLANDS"], "알류샨 열도": ["ALEUTIAN ISLANDS"], "캐나다 북극 제도": ["ARCTIC ARCHIPELAGO"],
  "대앤틸리스 제도": ["GREATER ANTILLES"], "소앤틸리스 제도": ["LESSER ANTILLES"], "바하마 제도": ["BAHAMA ISLANDS"],
  "쿠릴 열도": ["KURIL ISLANDS"], "류큐 제도": ["RYÜKYÜ ISLANDS"], "안다만 제도": ["ANDAMAN ISLANDS"],
  "몰디브 제도": ["Maldive Islands"], "세이셸 제도": ["SEYCHELLES"], "마스카렌 제도": ["MASCARENE ISLANDS"],
  "카보베르데 제도": ["ILHAS DE CABO VERDE"], "카나리아 제도": ["ISLAS CANARIAS"], "아조레스 제도": ["AÇORES"],
  "갈라파고스 제도": ["ARCHIPIÉLAGO DE COLÓN"], "포클랜드 제도": ["FALKLAND IS."], "스발바르 제도": ["SVALBARD"],
  "프란츠요제프 제도": ["FRANZ JOSEF LAND"], "노바야제믈랴": ["NOVAYA ZEMLYA"], "세베르나야제믈랴": ["SEVERNAYA ZEMLYA"],
  "노보시비르스크 제도": ["NEW SIBERIAN ISLANDS"], "솔로몬 제도": ["SOLOMON ISANDS"], "피지 제도": ["FIJI"],
  "누벨칼레도니": ["NOUVELLE-CALÉDONIE"], "마리아나 제도": ["MARIANA ISANDS"], "캐롤라인 제도": ["CAROLINE ISLANDS"],
  "마셜 제도": ["MARSHALL ISLANDS"], "난사 군도": ["Spratly Islands"], "시사 군도": ["Paracel Islands"],
  "소순다 열도": ["LESSER SUNDA ISLANDS"], "비스마르크 제도": ["Bismarck Archipelago"], "니코바르 제도": ["NICOBAR ISLANDS"],
  "락샤드위프 제도": ["Laccadive Islands"], "차고스 제도": ["Chagos Archipelago"], "코모로 제도": ["ARCHIPEL DES COMORES"],
  "발레아레스 제도": ["Balearic Islands"], "페로 제도": ["Føroyar"], "통가 제도": ["TONGA ISLANDS"],
  "사모아 제도": ["SAMOA IS."], "쿡 제도": ["SOUTHERN COOK ISLANDS", "NORTHERN COOK ISLANDS"],
  "투아모투 제도": ["ARCHIPEL DES TUAMOTU"], "마르키즈 제도": ["ÎLES MARQUESAS"], "후안페르난데스 제도": ["Islas Juan Fernandez"],
  "사우스셰틀랜드 제도": ["South Shetland Islands"], "케르겔렌 제도": ["Îles Kerguelen"], "미드웨이 제도": ["Midway Is."],
  "마데이라 제도": ["Madeira"], "말루쿠 제도": ["MOLUCCAS"], "혼슈섬": ["HONSHÜ"], "제주도": ["Cheju I."], "괌": ["Guam"], "타히티섬": ["Tahiti"],
  "레위니옹섬": ["Reunion"], "사우스조지아섬": ["South Georgia"], "브랑겔섬": ["Wrangel I."],
  "알렉산더 제도": ["Alexander Archipelago"], "하이다과이 제도": ["Haida Gwaii"], "로포텐 제도": ["Lofoten", "Vesterålen"],
  "셰틀랜드 제도": ["Shetland Is."],
};

// 강 하구(다른 강에 합쳐지는 강은 합쳐지는 곳). 물 흐름 무늬를 발원지에서 하구 쪽으로 움직이려고 줄기 방향을 맞춘다.
const RIVER_MOUTH = {
  "나일강": [31.0, 31.5], "아마존강": [-50.0, -0.5], "창장강": [121.8, 31.4], "미시시피강": [-89.3, 29.2],
  "황허강": [119.0, 37.7], "메콩강": [106.5, 9.8], "갠지스강": [90.0, 22.2], "인더스강": [67.5, 24.0],
  "볼가강": [47.9, 46.0], "도나우강": [29.6, 45.2], "오비강": [73.5, 66.8], "예니세이강": [82.5, 71.5],
  "레나강": [127.0, 72.5], "아무르강": [140.7, 53.0], "콩고강": [12.3, -6.0], "니제르강": [6.0, 4.5],
  "잠베지강": [36.3, -18.8], "파라나강": [-58.5, -34.0], "매켄지강": [-135.0, 68.8], "미주리강": [-90.1, 38.8],
  "브라마푸트라강": [89.75, 23.8], "유프라테스강": [47.43, 31.0], "티그리스강": [47.43, 31.0], "라인강": [4.1, 51.95],
  "드니프로강": [32.5, 46.5], "이르티시강": [69.0, 61.0], "오렌지강": [-16.45, -28.6], "머리강": [139.0, -35.55],
  "오리노코강": [-61.0, 8.6], "유콘강": [-164.5, 62.6], "세인트로렌스강": [-68.0, 49.0], "콜로라도강": [-114.8, 31.8],
  "리오그란데강": [-97.15, 25.95], "이라와디강": [95.0, 16.0], "오하이오강": [-89.13, 36.98], "청나일강": [32.5, 15.6],
  "마데이라강": [-58.8, -3.4], "상프란시스쿠강": [-36.4, -10.5], "살윈강": [97.6, 16.5], "시장강": [113.5, 22.5],
  "달링강": [141.9, -34.1], "시르다리야강": [61.0, 46.1], "아무다리야강": [59.5, 43.8], "엘베강": [8.8, 53.9],
  "센강": [0.2, 49.45], "템스강": [0.7, 51.5], "론강": [4.8, 43.4], "포강": [12.5, 44.95],
  "돈강": [39.3, 47.1], "비스와강": [18.9, 54.35], "오데르강": [14.3, 53.8], "콜리마강": [161.3, 69.5],
  "쑹화강": [132.5, 47.7], "랴오허강": [122.0, 40.8], "타림강": [88.5, 39.6], "림포포강": [33.6, -25.2],
  "세네갈강": [-16.5, 15.8], "토칸칭스강": [-49.2, -1.8], "우루과이강": [-58.4, -33.9], "마그달레나강": [-74.85, 11.1],
  "프레이저강": [-123.2, 49.1], "요르단강": [35.55, 31.75], "압록강": [124.3, 39.85], "두만강": [130.7, 42.3],
  "한강": [126.6, 37.75], "낙동강": [128.95, 35.08],
};

// 자료에 모양이 없는 지형은 손으로 그린다. 산맥은 능선을 잇는 선, 고원은 대강의 테두리.
const HAND_SHAPES = {
  "mountain:태백산맥": { type: "LineString", coordinates: [[127.5, 39.0], [127.95, 38.65], [128.15, 38.45], [128.45, 38.12], [128.6, 37.75], [128.8, 37.4], [128.95, 37.05], [129.05, 36.6], [129.1, 36.1], [129.05, 35.6], [128.95, 35.1]] },
  "mountain:소백산맥": { type: "LineString", coordinates: [[128.9, 37.05], [128.48, 36.96], [128.1, 36.7], [127.87, 36.54], [127.98, 36.2], [127.75, 35.86], [127.6, 35.55], [127.73, 35.34], [127.65, 35.05]] },
  "mountain:낭림산맥": { type: "LineString", coordinates: [[126.6, 41.3], [126.75, 40.9], [126.9, 40.5], [126.95, 40.1], [126.95, 39.7], [127.1, 39.4]] },
  "plateau:이란고원": { type: "Polygon", coordinates: [[[44.5, 38.5], [48, 37.6], [54, 37.4], [60, 36.8], [66, 36.3], [69.5, 35], [70, 31], [67, 27.5], [62, 25.8], [57.5, 26.8], [54, 28], [51, 30], [48, 32.5], [46, 35], [44.5, 38.5]]] },
  "plateau:개마고원": { type: "Polygon", coordinates: [[[126.95, 40.6], [127.3, 41.5], [127.9, 41.75], [128.5, 41.6], [128.9, 41.2], [128.4, 40.7], [127.8, 40.3], [127.2, 40.3], [126.95, 40.6]]] },
};
// 손으로 적은 지형 가운데 Natural Earth 다른 갈래에 모양이 있는 것: 이름 → 50m 지역 이름
const MANUAL_REGION_SHAPE = { "아나톨리아고원": "ANATOLIA", "파타고니아": "PATAGONIA" };

// 해류: [이름, 난류인가, tier, 흐르는 차례대로의 점들]. 교과서 해류도처럼 줄기만 대강 그린다.
// 경도는 180도를 넘어 이어 적어도 된다(날짜 변경선을 건너는 해류). 만들 때 ±180에서 끊는다.
const CURRENTS = [
  ["북적도 해류", true, 2, [[-110, 12], [-130, 13], [-150, 14], [-170, 14], [-190, 14], [-210, 14], [-226, 14]]],
  ["북적도 해류", true, 2, [[-19, 14], [-35, 15], [-50, 16], [-60, 17]]],
  ["남적도 해류", true, 2, [[-84, -2], [-110, -4], [-140, -6], [-170, -8], [-190, -9], [-208, -11]]],
  ["남적도 해류", true, 2, [[6, -2], [-10, -4], [-25, -6], [-33, -7]]],
  ["남적도 해류", true, 2, [[112, -12], [95, -14], [80, -14], [65, -14], [52, -14]]],
  ["적도 반류", true, 3, [[130, 6], [150, 6], [170, 6], [190, 6], [210, 6], [240, 6], [262, 6.5]]],
  ["적도 반류", true, 3, [[-45, 6], [-30, 6], [-15, 5], [-2, 3.5], [6, 3]]],
  ["쿠로시오 해류", true, 2, [[125, 15], [123.5, 21], [126.5, 27], [131, 30.5], [136, 33], [140.5, 35], [146, 36.3], [155, 37.5]]],
  ["북태평양 해류", true, 2, [[156, 38.5], [170, 40.5], [190, 42], [210, 44], [226, 45]]],
  ["캘리포니아 해류", false, 2, [[-128, 46], [-127, 40], [-123, 34], [-118, 28], [-114.5, 22]]],
  ["알래스카 해류", true, 3, [[-133, 49.5], [-137, 55], [-144, 58.3], [-152, 57.3], [-160, 54.8]]],
  ["쿠릴 해류", false, 2, [[164, 57], [160.5, 52], [155.5, 48], [149.5, 44], [145.5, 41], [143.5, 38.5]]],
  ["페루 해류", false, 2, [[-78, -45], [-76.5, -38], [-74.5, -30], [-73.5, -22], [-78.5, -12], [-84, -5]]],
  ["동오스트레일리아 해류", true, 3, [[156, -12], [155.5, -20], [154.5, -27], [152.8, -33], [151.5, -38]]],
  ["멕시코 만류", true, 2, [[-80, 25.8], [-79.3, 30], [-75.8, 34], [-71.5, 37], [-65, 39.5], [-55, 41], [-46, 43]]],
  ["북대서양 해류", true, 2, [[-44, 44.5], [-35, 48], [-25, 52], [-15, 56], [-7, 60.5], [3, 64], [12, 69]]],
  ["카나리아 해류", false, 2, [[-15, 42], [-14, 36], [-17.5, 30.5], [-19.5, 24], [-20.5, 18]]],
  ["래브라도 해류", false, 2, [[-62, 66], [-60, 60.5], [-56, 55.5], [-51.5, 50.5], [-50, 46.5], [-52, 42.5]]],
  ["동그린란드 해류", false, 3, [[-8, 80], [-14, 75], [-19, 70], [-29, 65.5], [-39, 61.5], [-44, 59]]],
  ["브라질 해류", true, 2, [[-34, -8], [-36.8, -15], [-39, -22], [-44, -27], [-50, -33], [-54, -38]]],
  ["포클랜드 해류", false, 3, [[-62, -53], [-59, -47], [-57, -42], [-55, -38.5]]],
  ["벵겔라 해류", false, 2, [[15, -35.5], [13, -28], [11, -22], [9.8, -16], [8, -10]]],
  ["아굴라스 해류", true, 2, [[41, -24], [35.5, -28.5], [31.8, -32], [27.5, -35], [22, -37.5]]],
  ["서오스트레일리아 해류", false, 2, [[112, -35], [110.8, -30], [109, -24], [105, -18]]],
  ["남극 순환 해류", false, 1, [[-179.99, -57], [-150, -60], [-120, -60], [-90, -58], [-70, -58.5], [-60, -58], [-30, -52], [0, -50], [30, -47], [60, -48], [90, -50], [120, -51], [150, -54], [179.99, -57]]],
  ["쓰시마 난류", true, 4, [[127.3, 30.5], [128.6, 32.3], [129.75, 34.1], [131.2, 35.8], [134, 36.6], [137, 38], [139.2, 40.2], [140.3, 41.4]]],
  ["동한 난류", true, 4, [[129.4, 35.3], [129.8, 36.5], [130, 37.5], [130.6, 38.4], [131.6, 39.1], [133.5, 39.4]]],
  ["북한 한류", false, 4, [[131.8, 42.2], [130.1, 41.1], [129.3, 40.1], [128.9, 39.3], [129.1, 38.3]]],
  ["리만 해류", false, 4, [[141.2, 50], [140.2, 47.5], [138.8, 45.5], [136.5, 43.8], [134, 42.8], [132.2, 42.2]]],
  ["황해 난류", true, 4, [[125.6, 32.4], [124.6, 34], [124.1, 35.5], [123.6, 37], [122.6, 38.4]]],
];
// 바람: [이름, 철(always/summer/winter), tier, 부는 차례대로의 점들]. 교과서 대기 대순환 그림처럼 줄기만 그린다.
// 경도는 180도를 넘겨 이어 적어도 된다(만들 때 ±180에서 끊는다).
const WINDS = [
  // 무역풍 — 북동 무역풍은 북동쪽에서 남서쪽으로, 남동 무역풍은 남동쪽에서 북서쪽으로.
  ["무역풍", "always", 1, [[-22, 27], [-35, 19], [-48, 11]]],
  ["무역풍", "always", 1, [[-118, 27], [-138, 19], [-156, 11]]],
  ["무역풍", "always", 1, [[-175, 25], [-195, 18], [-212, 11]]],
  ["무역풍", "always", 1, [[-6, -24], [-16, -15], [-26, -7]]],
  ["무역풍", "always", 1, [[-98, -24], [-118, -15], [-136, -7]]],
  ["무역풍", "always", 1, [[82, -24], [70, -15], [58, -7]]],
  // 편서풍 — 서쪽에서 동쪽으로.
  ["편서풍", "always", 1, [[-142, 40], [-115, 45], [-88, 44]]],
  ["편서풍", "always", 1, [[-44, 44], [-14, 49], [16, 52]]],
  ["편서풍", "always", 1, [[58, 48], [98, 45], [138, 41]]],
  ["편서풍", "always", 1, [[-64, -45], [-24, -48], [14, -46]]],
  ["편서풍", "always", 1, [[56, -46], [96, -48], [134, -45]]],
  ["편서풍", "always", 1, [[-186, -47], [-156, -45], [-126, -46]]],
  // 극동풍 — 동쪽에서 서쪽으로.
  ["극동풍", "always", 2, [[158, 73], [118, 76], [78, 75]]],
  ["극동풍", "always", 2, [[-36, 76], [-76, 75], [-116, 73]]],
  ["극동풍", "always", 2, [[66, -72], [26, -74], [-14, -73]]],
  ["극동풍", "always", 2, [[-134, -73], [-174, -74], [-214, -72]]],
  // 계절풍 — 여름에는 바다에서 뭍으로, 겨울에는 뭍에서 바다로.
  ["여름 계절풍", "summer", 2, [[72, -8], [70, 6], [74, 18], [79, 26]]],
  ["여름 계절풍", "summer", 2, [[90, 2], [90, 14], [89, 24]]],
  ["여름 계절풍", "summer", 2, [[132, 16], [128, 27], [126, 36], [126, 42]]],
  ["겨울 계절풍", "winter", 2, [[80, 30], [78, 20], [75, 10], [72, 2]]],
  ["겨울 계절풍", "winter", 2, [[112, 48], [119, 38], [125, 28], [130, 18]]],
  ["높새바람", "summer", 4, [[129.9, 38.5], [128.8, 37.9], [127.4, 37.4]]],
];
// 바람 이름표 자리를 따로 정한 것. [경도, 위도]
const WIND_LABEL_AT = {
  "높새바람": [128.3, 37.65],
};

// 기압대: [이름, tier, [위도 남쪽 끝, 위도 북쪽 끝] 띠들]. 저압대는 공기가 올라가는 곳, 고압대는 내려오는 곳.
const PRESSURE_BELTS = [
  ["적도 저압대", 1, "low", [[-6, 6]]],
  ["아열대 고압대", 1, "high", [[20, 35], [-35, -20]]],
  ["한대 전선대", 2, "low", [[55, 66], [-66, -55]]],
  ["극고압대", 2, "high", [[76, 89], [-89, -76]]],
];
// 기압대 이름을 다는 경도(다른 이름표와 덜 겹치는 바다 위)
const BELT_LABEL_LNG = { "적도 저압대": -30, "아열대 고압대": -30, "한대 전선대": -20, "극고압대": 60 };

// 해류 이름표 자리를 따로 정한 것(선 가운데가 다른 이름과 겹치거나 뭍에 걸리는 것). [경도, 위도]
const CURRENT_LABEL_AT = {};

// 세계지리 앱 나라 자료(Natural Earth 1:1억 1천만)에는 작은 나라가 빠져 있어 여기 적는다.
// [ISO 코드, 이름, 경도, 위도]. 자리는 Natural Earth 10m 나라 자료의 이름 자리(키리바시는 수도 타라와).
const SMALL_COUNTRIES = [
  ["AD", "안도라", 1.54, 42.55],
  ["AG", "앤티가 바부다", -61.79, 17.35],
  ["BB", "바베이도스", -59.57, 13.16],
  ["BH", "바레인", 50.55, 26.06],
  ["CV", "카보베르데", -23.64, 15.07],
  ["DM", "도미니카 연방", -61.34, 15.46],
  ["FM", "미크로네시아 연방", 158.23, 6.89],
  ["GD", "그레나다", -61.68, 12.11],
  ["KI", "키리바시", 173.0, 1.4],
  ["KM", "코모로", 43.32, -11.73],
  ["KN", "세인트키츠 네비스", -62.76, 17.34],
  ["LC", "세인트루시아", -60.98, 13.89],
  ["LI", "리히텐슈타인", 9.56, 47.11],
  ["MC", "모나코", 7.40, 43.74],
  ["MH", "마셜 제도", 171.19, 7.08],
  ["MT", "몰타", 14.43, 35.89],
  ["MU", "모리셔스", 57.57, -20.30],
  ["MV", "몰디브", 73.51, 4.17],
  ["NR", "나우루", 166.93, -0.52],
  ["PW", "팔라우", 134.58, 7.52],
  ["SC", "세이셸", 55.48, -4.68],
  ["SG", "싱가포르", 103.82, 1.37],
  ["SM", "산마리노", 12.44, 43.93],
  ["ST", "상투메 프린시페", 7.02, 0.97],
  ["TO", "통가", -175.16, -21.21],
  ["TV", "투발루", 179.21, -8.51],
  ["VA", "바티칸", 12.45, 41.90],
  ["VC", "세인트빈센트 그레나딘", -61.34, 13.09],
  ["WS", "사모아", -172.44, -13.64],
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
// 국기를 달지 않는 곳: 영유권 분쟁지(서사하라, 포클랜드 제도)와 쓰는 깃발이 둘인 프랑스령(누벨칼레도니).
const NO_FLAG = new Set(["EH", "FK", "NC"]);

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

// 선을 단순하게(더글러스-포이커). 0.02도는 약 2km로, 가장 크게 키워도 화면 1픽셀이 안 된다.
function simplify(line, tolerance = 0.02) {
  if (line.length < 3) return line;
  const keep = new Uint8Array(line.length);
  keep[0] = keep[line.length - 1] = 1;
  const stack = [[0, line.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let farthest = -1;
    let distance = tolerance * tolerance;
    for (let i = a + 1; i < b; i += 1) {
      const d = segDistSq(line[i][0], line[i][1], line[a], line[b]);
      if (d > distance) { distance = d; farthest = i; }
    }
    if (farthest >= 0) {
      keep[farthest] = 1;
      stack.push([a, farthest], [farthest, b]);
    }
  }
  return line.filter((_, i) => keep[i]);
}

const pathLength = (line) => line.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - line[i][0], p[1] - line[i][1]), 0);

function pointAlong(line, distance) {
  let left = distance;
  for (let i = 1; i < line.length; i += 1) {
    const step = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    if (step >= left) {
      const t = step ? left / step : 0;
      return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t];
    }
    left -= step;
  }
  return line[line.length - 1];
}

// 끝과 끝이 닿는 구간을 이어 긴 줄기로 만든다(강 이름은 줄기를 따라 놓이므로 짧게 끊겨 있으면 이름이 안 들어간다).
function joinLines(lines) {
  const key = ([x, y]) => `${x},${y}`;
  const pool = lines.map((line) => line.map(([x, y]) => [round(x), round(y)]));
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < pool.length && !merged; i += 1) {
      for (let j = 0; j < pool.length && !merged; j += 1) {
        if (i === j) continue;
        const a = pool[i];
        const b = pool[j];
        if (key(a[a.length - 1]) === key(b[0])) pool[i] = a.concat(b.slice(1));
        else if (key(a[a.length - 1]) === key(b[b.length - 1])) pool[i] = a.concat(b.slice(0, -1).reverse());
        else continue;
        pool.splice(j, 1);
        merged = true;
      }
    }
  }
  return pool.map((line) => line.filter((p, i) => i === 0 || p[0] !== line[i - 1][0] || p[1] !== line[i - 1][1]));
}

async function buildRivers() {
  const rivers = new Map();
  const add = (name, tier, geometry) => {
    const parts = geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
    if (!rivers.has(name)) rivers.set(name, { tier, parts: [] });
    rivers.get(name).parts.push(...parts.filter((part) => part.length > 1));
  };
  for (const feature of (await neFile("ne_50m_rivers_lake_centerlines")).features) {
    const entry = RIVERS[feature.properties.name];
    if (!entry || !feature.geometry) continue;
    const west = RIVER_WEST_OF[feature.properties.name];
    const first = feature.geometry.type === "LineString" ? feature.geometry.coordinates[0] : feature.geometry.coordinates[0][0];
    if (west !== undefined && first[0] > west) continue;
    add(entry[0], entry[1], feature.geometry);
  }
  for (const feature of (await neFile("ne_10m_rivers_lake_centerlines")).features) {
    const entry = KOREA_RIVERS[feature.properties.name];
    if (!entry || !feature.geometry) continue;
    const parts = feature.geometry.type === "LineString" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    if (!parts.flat().some(inKorea)) continue;
    add(entry[0], entry[1], feature.geometry);
  }
  const wanted = new Set([...Object.values(RIVERS), ...Object.values(KOREA_RIVERS)].map(([name]) => name));
  const missing = [...wanted].filter((name) => !rivers.has(name));
  if (missing.length) throw new Error(`자료에 없는 강: ${missing.join(", ")}`);
  return [...rivers].map(([name, { tier, parts }]) => ({
    type: "Feature",
    properties: { name, tier },
    geometry: { type: "MultiLineString", coordinates: joinLines(parts).map((line) => simplify(line)) },
  }));
}
// ── 누르면 칠할 모양(data/shapes.json) ─────────────────────────────
const shapes = {};
const ringArea = (ring) => {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  return Math.abs(sum / 2);
};
function slimRing(ring, tolerance) {
  const slim = simplify(ring.map(([x, y]) => [round(x), round(y)]), tolerance)
    .filter((p, i, all) => i === 0 || p[0] !== all[i - 1][0] || p[1] !== all[i - 1][1]);
  return slim.length >= 4 ? slim : null;
}
// 여러 모양을 한 이름의 MultiPolygon(또는 MultiLineString)으로 모은다. 너무 작아 점이 된 조각은 버린다.
function addShape(key, geometries, tolerance) {
  for (const geometry of geometries) {
    if (!geometry) continue;
    if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
      const lines = geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
      const entry = (shapes[key] ||= { type: "MultiLineString", coordinates: [] });
      entry.coordinates.push(...lines.map((line) => line.map(([x, y]) => [round(x), round(y)])));
      continue;
    }
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    for (const polygon of polygons) {
      const outer = slimRing(polygon[0], tolerance) || (ringArea(polygon[0]) > 0 ? polygon[0].map(([x, y]) => [round(x), round(y)]) : null);
      if (!outer || outer.length < 4) continue;
      const holes = polygon.slice(1).map((ring) => slimRing(ring, tolerance)).filter(Boolean);
      const entry = (shapes[key] ||= { type: "MultiPolygon", coordinates: [] });
      entry.coordinates.push([outer, ...holes]);
    }
  }
}

// 10m 육지를 다각형 하나하나로 풀고, 테두리 상자를 붙여 둔다.
function landPolygons(collection) {
  const list = [];
  for (const feature of collection.features) {
    const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const polygon of polygons) {
      let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
      for (const [x, y] of polygon[0]) {
        minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
      list.push({ polygon, box: [minX, minY, maxX, maxY] });
    }
  }
  return list;
}

const insideRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
};
const insideGeometry = (x, y, geometry) => {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some((polygon) => insideRing(x, y, polygon[0]));
};

// 섬 모양 고르기. 대륙을 잘못 집지 않도록 테두리 상자가 25도보다 큰 육지는 뺀다(그린란드는 예외로 이름 자리로 찾는다).
function islandPieces(name, where, [lng, lat], land, regionGeometries) {
  const hulls = (ISLAND_GROUP_HULL[name] || []).flatMap(regionGeometries);
  if (hulls.length) {
    return land.filter(({ polygon, box }) => box[2] - box[0] < 25 && box[3] - box[1] < 25
      && polygon[0].some(([x, y], i) => i % 4 === 0 && hulls.some((hull) => insideGeometry(x, y, hull))))
      .map(({ polygon }) => polygon);
  }
  if (typeof where === "string") {
    return land.filter(({ polygon, box }) => x0y0(box, lng, lat) && insideRing(lng, lat, polygon[0])).map(({ polygon }) => polygon);
  }
  // 손으로 자리를 적은 작은 섬: 그 자리에서 0.3도 안에 가운데가 있는 작은 육지.
  return land.filter(({ box }) => box[2] - box[0] < 2 && box[3] - box[1] < 2
    && Math.hypot((box[0] + box[2]) / 2 - lng, (box[1] + box[3]) / 2 - lat) < 0.3).map(({ polygon }) => polygon);
}
const x0y0 = (box, x, y) => x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3];

// 이탈리아반도: 이탈리아 본토에서 북위 44.3도 남쪽만 남긴다(한 반평면으로 자르기).
function clipBelowLatitude(ring, limit) {
  const out = [];
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const aIn = a[1] <= limit;
    const bIn = b[1] <= limit;
    if (aIn) out.push(a);
    if (aIn !== bIn) out.push([a[0] + ((b[0] - a[0]) * (limit - a[1])) / (b[1] - a[1]), limit]);
  }
  if (out.length) out.push(out[0]);
  return out;
}

// 180도를 넘겨 이어 적은 선을 ±180도에서 끊어 조각들로 만든다.
function splitAtDateLine(points) {
  const wrap = (x) => ((((x + 180) % 360) + 360) % 360) - 180;
  const parts = [];
  let current = [[round(wrap(points[0][0])), round(points[0][1])]];
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const edge = Math.floor((x0 + 180) / 360) !== Math.floor((x1 + 180) / 360);
    if (edge) {
      const cross = x1 > x0 ? Math.ceil((x0 - 180) / 360) * 360 + 180 : Math.floor((x0 + 180) / 360) * 360 - 180;
      const t = (cross - x0) / (x1 - x0);
      const y = y0 + (y1 - y0) * t;
      const side = x1 > x0 ? 180 : -180;
      current.push([side, round(y)]);
      parts.push(current);
      current = [[-side, round(y)]];
    }
    current.push([round(wrap(x1)), round(y1)]);
  }
  parts.push(current);
  return parts.filter((part) => part.length > 1);
}

// 줄기마다 하구 쪽이 끝이 되게 뒤집는다(물 흐름 무늬가 선의 처음에서 끝으로 움직인다).
function orientRiver(name, lines) {
  const mouth = RIVER_MOUTH[name];
  if (!mouth) throw new Error(`하구 자리가 없는 강: ${name}`);
  const far = (p) => Math.hypot(p[0] - mouth[0], p[1] - mouth[1]);
  return lines.map((line) => (far(line[0]) < far(line[line.length - 1]) ? [...line].reverse() : line));
}

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
    addShape(`${kind}:${name}`, geometries, 0.03);
  }
  for (const [name, kind, tier, lng, lat] of MANUAL) {
    labels.push(point(lng, lat, { name, kind, tier }));
    const neName = MANUAL_REGION_SHAPE[name];
    if (neName) addShape(`${kind}:${name}`, regions.features.filter((f) => f.properties.NAME === neName).map((f) => f.geometry), 0.03);
  }
  for (const [key, geometry] of Object.entries(HAND_SHAPES)) addShape(key, [geometry], 0);
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
    // 해협은 STRAITS 표에서 따로 싣는다.
    if (MARINE_SKIP.has(name) || featurecla === "river" || STRAIT_CLASSES.has(featurecla) || !nameKo) continue;
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
    addShape(`sea:${label}`, geometries, 0.08);
  }
  for (const [name, tier, lng, lat] of STRAITS) labels.push(point(lng, lat, { name, kind: "strait", tier }));
  for (const [name, tier, lng, lat] of CAPES) labels.push(point(lng, lat, { name, kind: "cape", tier }));

  // 섬: 모양은 10m 육지 다각형에서 고른다. 한 섬은 이름 자리를 품은 다각형, 제도는 무리 테두리(Natural Earth) 안의 섬들.
  const regions10 = await neFile("ne_10m_geography_regions_polys");
  const land = landPolygons(await neFile("ne_10m_land"));
  const regionGeometries = (neName) => regions10.features.filter((f) => f.properties.NAME === neName).map((f) => f.geometry);
  for (const [name, tier, where, owner] of ISLANDS) {
    let lng;
    let lat;
    if (typeof where === "string") {
      const geometries = regionGeometries(where);
      if (!geometries.length) throw new Error(`자료에 없는 섬: ${where}`);
      [lng, lat] = labelPoint(geometries);
    } else {
      [lng, lat] = where;
    }
    const properties = { name, kind: "island", tier };
    if (owner) properties.owner = owner;
    labels.push(point(lng, lat, properties));
    const pieces = islandPieces(name, where, [lng, lat], land, regionGeometries);
    if (pieces.length) addShape(`island:${name}`, [{ type: "MultiPolygon", coordinates: pieces }], 0.025);
    else console.log(`  섬 모양 없음(점으로 표시): ${name}`);
  }

  const lakes = await neFile("ne_10m_lakes");
  const marine10 = await neFile("ne_10m_geography_marine_polys");
  for (const [neName, [name, tier]] of Object.entries(LAKES)) {
    const geometries = lakes.features.filter((f) => f.properties.name === neName).map((f) => f.geometry);
    if (!geometries.length) throw new Error(`자료에 없는 호수: ${neName}`);
    const [lng, lat] = labelPoint(geometries);
    labels.push(point(lng, lat, { name, kind: "lake", tier }));
    addShape(`lake:${name}`, geometries, 0.02);
  }
  for (const [name, tier, lng, lat] of MANUAL_LAKES) {
    labels.push(point(lng, lat, { name, kind: "lake", tier }));
    const parts = MANUAL_LAKE_PARTS[name] || [];
    const geometries = lakes.features.filter((f) => parts.includes(f.properties.name)).map((f) => f.geometry);
    // 바다와 이어진 석호는 호수 자료가 아니라 바다 자료에 있다.
    const lagoon = LAGOON_SHAPE[name];
    if (lagoon) geometries.push(...marine10.features.filter((f) => f.properties.name === lagoon).map((f) => f.geometry));
    if (geometries.length) addShape(`lake:${name}`, geometries, 0.02);
  }

  const countrySource = fs.readFileSync(path.join(ROOT, "../world-geography/data/world-countries.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(countrySource, context);
  // 나라 모양은 1:5천만 자료(없으면 1:1천만)에서. 세계지리 앱의 1:1억 1천만 모양은 확대하면 해안선과 어긋난다.
  const countries50 = await neFile("ne_50m_admin_0_countries");
  const countries10 = await neFile("ne_10m_admin_0_countries");
  const countryShape = (iso, name) => {
    const match = (f) => f.properties.ISO_A2_EH === iso || f.properties.ISO_A2 === iso;
    const found = countries50.features.filter(match);
    const geometries = (found.length ? found : countries10.features.filter(match)).map((f) => f.geometry);
    if (!geometries.length) console.log(`  나라 모양 없음(점으로 표시): ${name}`);
    return geometries;
  };
  for (const country of context.window.WORLD_COUNTRIES) {
    if (COUNTRY_SKIP.has(country.name)) continue;
    const area = country.area || 0;
    let tier = area > 1500000 ? 1 : area > 400000 ? 2 : area > 80000 ? 3 : 4;
    if (country.name === "대한민국") tier = 1; // 우리나라는 "나라"를 켜면 늘 보이게
    const [lat, lng] = country.label;
    const properties = { name: country.name, kind: "country", tier };
    if (!NO_FLAG.has(country.iso)) properties.flag = country.iso.toLowerCase();
    labels.push(point(lng, lat, properties));
    const geometries = countryShape(country.iso, country.name);
    addShape(`country:${country.name}`, geometries.length ? geometries : [country.geometry], 0.03);
  }
  for (const [iso, name, lng, lat] of SMALL_COUNTRIES) {
    labels.push(point(lng, lat, { name, kind: "country", tier: 4, flag: iso.toLowerCase() }));
    const geometries = countryShape(iso, name);
    if (geometries.length) addShape(`country:${name}`, geometries, 0.005);
  }

  const lines = await neFile("ne_50m_admin_0_boundary_lines_land");
  const borders = lines.features.map((feature) => {
    const parts = feature.geometry.type === "LineString" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const slim = parts.map((part) => simplify(part.map(([x, y]) => [round(x), round(y)])
      .filter((p, i, all) => i === 0 || p[0] !== all[i - 1][0] || p[1] !== all[i - 1][1])));
    return { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: slim } };
  });

  // 이탈리아반도는 이탈리아 본토에서 잘라 낸다.
  const italy = (await neFile("ne_50m_admin_0_countries")).features.find((f) => f.properties.ISO_A2_EH === "IT").geometry;
  const mainland = italy.coordinates.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
  addShape("peninsula:이탈리아반도", [{ type: "Polygon", coordinates: [clipBelowLatitude(mainland[0], 44.3)] }], 0.02);

  const rivers = await buildRivers();
  for (const river of rivers) river.geometry.coordinates = orientRiver(river.properties.name, river.geometry.coordinates);
  // 강 이름은 가장 긴 줄기 위에 가로로 놓는다(줄기를 따라 놓는 방식은 지구본에서 글자가 그려지지 않는다).
  // 긴 강(경위도로 25도 넘게 흐르는 강)은 1/3, 2/3 자리 두 군데에 적는다.
  for (const river of rivers) {
    const longest = river.geometry.coordinates.reduce((a, b) => (pathLength(b) > pathLength(a) ? b : a));
    const total = pathLength(longest);
    const stops = total > 25 ? [1 / 3, 2 / 3] : [1 / 2];
    const spots = RIVER_LABEL_AT[river.properties.name] || stops.map((stop) => pointAlong(longest, total * stop));
    for (const [lng, lat] of spots) {
      labels.push(point(lng, lat, { name: river.properties.name, kind: "river", tier: river.properties.tier }));
    }
  }
  // 해류: ±180도에서 끊어 조각으로 나누고, 이름표는 해류마다 가장 긴 조각 가운데에 하나.
  const currents = [];
  const currentLabels = new Map();
  for (const [name, warm, tier, points] of CURRENTS) {
    const parts = splitAtDateLine(points);
    currents.push({ type: "Feature", properties: { name, warm, tier }, geometry: { type: "MultiLineString", coordinates: parts } });
    const longest = parts.reduce((a, b) => (pathLength(b) > pathLength(a) ? b : a));
    const best = currentLabels.get(name);
    if (!best || pathLength(longest) > best.length) currentLabels.set(name, { length: pathLength(longest), line: longest, warm, tier });
  }
  for (const [name, { line, warm, tier }] of currentLabels) {
    const [lng, lat] = CURRENT_LABEL_AT[name] || pointAlong(line, pathLength(line) / 2);
    // 해류를 켰다면 해류 이름을 보려는 것이므로 한 단 일찍 보인다(우리나라 둘레 해류는 그대로 확대했을 때).
    labels.push(point(lng, lat, { name, kind: "current", tier: tier === 4 ? 4 : Math.max(1, tier - 1), warm }));
  }

  // 바람: 해류와 같은 방식으로 ±180도에서 끊고, 이름표는 바람마다 가장 긴 조각 가운데에 하나.
  const winds = [];
  const windLabels = new Map();
  for (const [name, season, tier, points] of WINDS) {
    const parts = splitAtDateLine(points);
    winds.push({ type: "Feature", properties: { name, season, tier }, geometry: { type: "MultiLineString", coordinates: parts } });
    const longest = parts.reduce((a, b) => (pathLength(b) > pathLength(a) ? b : a));
    const best = windLabels.get(name);
    if (!best || pathLength(longest) > best.length) windLabels.set(name, { length: pathLength(longest), line: longest, season, tier });
  }
  for (const [name, { line, season, tier }] of windLabels) {
    const [lng, lat] = WIND_LABEL_AT[name] || pointAlong(line, pathLength(line) / 2);
    labels.push(point(lng, lat, { name, kind: "wind", tier, season }));
  }

  // 기압대: 위도 띠 다각형과 그 위의 이름표.
  const belts = [];
  for (const [name, tier, air, bands] of PRESSURE_BELTS) {
    const rings = bands.map(([south, north]) => {
      const ring = [];
      for (let lng = -180; lng <= 180; lng += 5) ring.push([lng, south]);
      for (let lng = 180; lng >= -180; lng -= 5) ring.push([lng, north]);
      ring.push([-180, south]);
      return [ring];
    });
    belts.push({ type: "Feature", properties: { name, air, tier }, geometry: { type: "MultiPolygon", coordinates: rings } });
    for (const [south, north] of bands) {
      labels.push(point(BELT_LABEL_LNG[name], (south + north) / 2, { name, kind: "belt", tier, air }));
    }
  }

  // 날짜 변경선: 180도 경선이 아니라 나라·섬을 비껴 꺾인 실제 선.
  const geographicLines = await neFile("ne_50m_geographic_lines");
  const dateLine = geographicLines.features.find((f) => f.properties.name === "International Date Line");
  const dateLineParts = (dateLine.geometry.type === "LineString" ? [dateLine.geometry.coordinates] : dateLine.geometry.coordinates)
    .map((part) => part.map(([x, y]) => [round(Math.max(-180, Math.min(180, x))), round(y)]));

  // 기압대는 남북 두 띠에 같은 이름표를 달므로 이름이 겹친다(설명은 하나를 같이 쓴다).
  const seen = new Set();
  for (const feature of labels) {
    feature.properties.key = `${feature.properties.kind}:${feature.properties.name}`;
    seen.add(feature.properties.key);
  }
  const strayShapes = Object.keys(shapes).filter((key) => !seen.has(key));
  if (strayShapes.length) throw new Error(`이름표 없는 모양: ${strayShapes.join(", ")}`);

  const data = {
    labels: { type: "FeatureCollection", features: labels },
    borders: { type: "FeatureCollection", features: borders },
    rivers: { type: "FeatureCollection", features: rivers },
    currents: { type: "FeatureCollection", features: currents },
    winds: { type: "FeatureCollection", features: winds },
    belts: { type: "FeatureCollection", features: belts },
    dateLine: { type: "Feature", properties: { special: "dateline" }, geometry: { type: "MultiLineString", coordinates: dateLineParts } },
  };
  const shapesOut = path.join(ROOT, "data/shapes.json");
  fs.writeFileSync(shapesOut, JSON.stringify(shapes));
  const pointOnly = labels.filter((f) => !shapes[f.properties.key] && f.properties.kind !== "river").map((f) => f.properties.key);
  console.log(`모양 ${Object.keys(shapes).length}개, ${(fs.statSync(shapesOut).size / 1024).toFixed(0)}KB · 점으로만 표시 ${new Set(pointOnly).size}개`);
  const out = path.join(ROOT, "data/globe-data.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `// tools/build_labels.mjs 로 만든 파일. 직접 고치지 말 것.\nwindow.GLOBE_DATA = ${JSON.stringify(data)};\n`);
  const count = (kind) => labels.filter((f) => f.properties.kind === kind).length;
  console.log(`이름표 ${labels.length}개 (산지 ${count("mountain")}, 고원 ${count("plateau")}, 평원 ${count("plain")}, 분지 ${count("basin")}, 사막 ${count("desert")}, 강 ${count("river")}, 호수 ${count("lake")}, 반도 ${count("peninsula")}, 곶 ${count("cape")}, 섬 ${count("island")}, 그 밖 ${count("other")}, 산 ${count("peak")}, 바다 ${count("sea")}, 해협 ${count("strait")}, 나라 ${count("country")}, 바람 ${count("wind")}, 기압대 ${count("belt")})`);
  console.log(`강 ${rivers.length}개: ${rivers.map((f) => `${f.properties.name}(${f.geometry.coordinates.length}줄기)`).join(" ")}`);
  console.log(`국경 ${borders.length}줄, ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}

await main();
