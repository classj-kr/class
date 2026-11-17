// 악기실(instrument-room)의 대분류·악기·주법을 그대로 옮긴 목록.
// 악기실 app.js의 MODEL_LIBRARY·KEYBOARD_SAMPLE_SETS·DRUM_SAMPLE_SETS와 맞춰 고친다.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BeatCatalog = api;
})(globalThis, function () {
  "use strict";
  // 소리 묶음: [폴더, 낮은 음, 높은 음, 보정 dB, 옵션]  L=길게 끌면 반복 구간 사용, rev=파일 판
  const L = { loop: true };
  const SETS = {
    "concert-grand": ["concert-grand", 21, 108, 6.03], "upright-piano": ["upright-piano", 21, 108, 9],
    harpsichord: ["harpsichord", 48, 86, 20], "tine-ep": ["fender-rhodes", 21, 108, 1.89], "reed-ep": ["wurlitzer", 21, 108, 1.68],
    clavinet: ["clavinet", 21, 108, 9], "fm-dx7": ["fm-dx7", 21, 108, 7.07], jd800: ["jd800", 21, 108, 6.58],
    "hybrid-la-rhodes": ["hybrid-la-rhodes", 21, 108, 6.04], "hybrid-la-mks": ["hybrid-la-mks", 21, 108, 5.82],
    "hammond-organ": ["hammond-organ", 36, 96, 4.94], "pipe-organ": ["pipe-organ", 36, 96, 7.72],
    haegeum: ["haegeum", 55, 79, -1.46, L], "haegeum-vibrato": ["haegeum-vibrato", 59, 79, -1.63, L],
    daegeum: ["daegeum", 59, 89, -5.69, L], "daegeum-vibrato": ["daegeum-vibrato", 59, 89, -2.91, L],
    hyangpiri: ["hyangpiri", 59, 77, 6.5, L], "hyangpiri-vibrato": ["hyangpiri-vibrato", 59, 77, 6.18, L],
    taepyeongso: ["taepyeongso", 68, 89, -4.5, L],
    gayageum: ["gayageum-sanjo", 43, 77, 6.43], "gayageum-slow-vibrato": ["gayageum-sanjo-slow-vibrato", 43, 77, 2.25],
    "gayageum-fast-vibrato": ["gayageum-sanjo-fast-vibrato", 43, 77, 1.84], "gayageum-roll": ["gayageum-sanjo-roll", 43, 77, 4.07],
    "gayageum-bend-down": ["gayageum-sanjo-bend-down", 43, 77, 4.23], "gayageum-bend-up": ["gayageum-sanjo-bend-up", 43, 77, 9],
    geomungo: ["geomungo", 46, 77, 9], "geomungo-light-vibrato": ["geomungo-light-vibrato", 46, 77, 13],
    "geomungo-deep-vibrato": ["geomungo-deep-vibrato", 46, 77, 13], "gayageum-25": ["gayageum-25", 43, 81, 18.6],
    yanggeum: ["yanggeum", 51, 80, 9], "yanggeum-tremolo": ["yanggeum-tremolo", 51, 80, 9, L],
    ajaeng: ["ajaeng", 43, 78, 7.46, L], "ajaeng-vibrato": ["ajaeng-vibrato", 43, 78, 17.1, L],
    sogeum: ["sogeum", 70, 93, -0.91, L], danso: ["danso", 66, 92, 2.26, L], "danso-vibrato": ["danso-vibrato", 66, 92, 0.25, L],
    hun: ["hun", 60, 71, 3.62, L], pyeonjong: ["pyeonjong", 60, 75, 9], pyeongyeong: ["pyeongyeong", 72, 87, 9],
    ocarina: ["ocarina", 60, 86, -4.5, L], "recorder-piccolo": ["recorder-piccolo", 77, 104, 0.7],
    "recorder-soprano": ["recorder-soprano", 72, 101, 2], "recorder-alto": ["recorder-alto", 65, 89, 7.1],
    "recorder-tenor": ["recorder-tenor", 60, 84, 6.2], flute: ["flute", 60, 96, 6.83], oboe: ["oboe", 58, 91, 4.35],
    trumpet: ["trumpet", 52, 97, -2.92], clarinet: ["clarinet", 50, 88, 2.89], "bass-clarinet": ["bass-clarinet", 44, 95, 0.05],
    "piccolo-flute": ["piccolo-flute", 72, 108, 9], "french-horn": ["french-horn", 47, 93, -2.93],
    "english-horn": ["english-horn", 52, 83, 4.38], "soprano-sax": ["soprano-sax", 53, 94, -1.38],
    saxophone: ["alto-sax", 46, 92, -0.11], "tenor-sax": ["tenor-sax", 53, 102, 0.37], "baritone-sax": ["baritone-sax", 45, 100, -0.93],
    bassoon: ["bassoon", 34, 75, 6.91], contrabassoon: ["contrabassoon", 32, 80, -2.46],
    "alto-trombone": ["alto-trombone", 45, 88, -4.59], trombone: ["tenor-trombone", 52, 97, -5.68],
    "bass-trombone": ["bass-trombone", 35, 92, -3.85], tuba: ["bass-tuba", 40, 96, -4.31], euphonium: ["euphonium", 40, 94, -2.93],
    flugelhorn: ["flugelhorn", 52, 92, -5.56], "piccolo-trumpet": ["piccolo-trumpet", 52, 100, 1.5],
    viola: ["viola", 48, 108, 0.59, { rev: "20260901-viola-v2" }], "viola-pizz": ["viola-pizz", 48, 89, 9],
    violin: ["violin", 55, 108, 1.45, { rev: "20260901-violin-v2" }], "violin-pizz": ["violin-pizz", 55, 100, 9],
    cello: ["cello", 48, 108, -3.85], "cello-pizz": ["cello-pizz", 48, 73, 9],
    "upright-bass": ["upright-bass", 52, 108, -4.1], "upright-bass-pizz": ["upright-bass-pizz", 52, 108, 1.16],
    harp: ["harp", 25, 102, 14], timpani: ["timpani", 36, 53, 6.5], marimba: ["marimba", 36, 96, 7],
    vibraphone: ["vibraphone", 53, 89, 5.5], xylophone: ["xylophone", 48, 89, 6.5], glockenspiel: ["glockenspiel", 79, 95, 33.1],
    "p-bass-finger": ["p-bass-finger-v4", 28, 63, 2.6, { rev: "20260901-p-finger-v4" }],
    "p-bass-pick": ["p-bass-pick-v4", 28, 63, 0.4, { rev: "20260901-p-pick-v4" }],
    "p-bass-slap": ["p-bass-slap-v4", 28, 62, 8.6, { rev: "20260901-p-slap-v4" }],
    "j-bass-finger": ["j-bass-finger-v4", 28, 63, 1.7, { rev: "20260901-j-finger-v4" }],
    "j-bass-pick": ["j-bass-pick-v4", 28, 62, 0.4, { rev: "20260901-j-pick-v4" }],
    "j-bass-slap": ["j-bass-slap-v4", 28, 62, 8.1, { rev: "20260901-j-slap-v4" }],
    "active-bass-finger": ["active-bass-finger", 23, 62, 0], "active-bass-pick": ["active-bass-pick", 23, 62, 0],
    "active-bass-slap": ["active-bass-slap", 23, 62, 10],
    "fretless-bass-finger": ["fretless-bass-finger", 28, 63, 4, { rev: "20260901-fretless-finger-v3" }],
    "fretless-bass-pick": ["fretless-bass-pick", 28, 62, 2.5], "fretless-bass-slap": ["fretless-bass-slap", 28, 62, 10],
    "guitar-s-clean": ["guitar-s-clean", 40, 86, 5.5, { rev: "20260902-clean-tone-v4" }],
    "guitar-s-blues": ["guitar-s-blues", 40, 86, 4, { rev: "20260902-blues-tone-v4" }],
    "guitar-s-funk": ["guitar-s-funk", 40, 86, 25.1, { rev: "20260902-funk-tone-v4" }],
    "guitar-s-rock": ["guitar-s-rock", 40, 86, 2, { rev: "20260902-rock-tone-v4" }],
    "guitar-superstrat": ["guitar-superstrat", 40, 84, -1.5, { rev: "20260902-superstrat-tone-v4" }],
    "guitar-hollow": ["guitar-hollow", 40, 86, 13, { rev: "20260902-hollow-tone-v4" }],
    "guitar-nylon": ["guitar-nylon", 40, 84, 16.5, { rev: "20260902-nylon-tone-v4" }],
    "guitar-steel": ["guitar-steel", 40, 84, 25, { rev: "20260902-steel-tone-v2" }],
  };

  // 드럼 세트 줄(위→아래): 심벌 → 하이햇 → 탐(높은 것부터) → 스네어 주법 → 킥.
  // icon은 줄 이름 옆 그림, color는 찍힌 칸 색. minor 줄은 어둡게 깔아 킥·스네어·닫힌 하이햇이 눈에 띄게 한다.
  const KIT_ROWS = [
    { id: "crash", name: "크래시", icon: "cymbal", color: "#f2c94c", minor: true },
    { id: "ride", name: "라이드", icon: "cymbal", color: "#e0b43c", minor: true },
    { id: "ridebell", name: "라이드 벨", icon: "cymbal", color: "#efb5ff", minor: true },
    { id: "openhat", name: "열린 하이햇", icon: "openhat", color: "#d8e86a", minor: true },
    { id: "hat", name: "닫힌 하이햇", icon: "hat", color: "#c4d95a" },
    { id: "pedalhat", name: "페달 하이햇", icon: "hat", color: "#a9bf52", minor: true },
    { id: "hightom", name: "하이 탐", icon: "tom", color: "#6fb4ff", minor: true },
    { id: "midtom", name: "미드 탐", icon: "tom", color: "#5fa2f0", minor: true },
    { id: "lowtom", name: "플로어 탐", icon: "tom", color: "#4f8fe0", minor: true },
    { id: "rimshot", name: "림샷", icon: "snare", color: "#ff7d66", minor: true },
    { id: "snare", name: "스네어", icon: "snare", color: "#ff9d66" },
    { id: "ghost", name: "고스트", icon: "snare", color: "#d88a72", minor: true },
    { id: "sidestick", name: "사이드스틱", icon: "snare", color: "#d8b87a", minor: true },
    { id: "rimclick", name: "림클릭", icon: "snare", color: "#ffb27a", minor: true },
    { id: "kick", name: "킥", icon: "kick", color: "#4fc39a" },
  ];
  // 곡 version 2까지 쓰던 8줄 순서. 저장된 곡의 줄 번호를 새 순서로 옮길 때 쓴다.
  const OLD_KIT_ROW_IDS = ["crash", "ride", "openhat", "hat", "hightom", "lowtom", "snare", "kick"];
  const kit = (id, name, dir, gainDb, boost = {}) => ({ id, name, pads: { dir, gainDb, boost, kit: true, rows: KIT_ROWS } });
  const station = (id, name, dir, rows) => ({ id, name, pads: { dir, gainDb: 0, rows } });
  const one = (id, name, set = id) => ({ id, name, arts: [{ id: "", name: "", set }] });
  const arts = (id, name, list) => ({ id, name, arts: list.map(([a, n, set]) => ({ id: a, name: n, set })) });
  const bowed = (id, name) => arts(id, name, [["sustain", "활긋기", id], ["pizzicato", "피치카토", id + "-pizz"]]);
  const electric = (id, name, prefix) => arts(id, name, [["finger", "핑거", prefix + "-finger"], ["pick", "피크", prefix + "-pick"], ["slap", "슬랩", prefix + "-slap"]]);
  const breathy = (id, name, base = "기본음") => arts(id, name, [["sustain", base, id], ["vibrato", "비브라토", id + "-vibrato"]]);
  // 국악 타악 줄은 악기실의 korean-percussion-data.js에서 읽는다.
  const korean = (id, name) => ({ id, name, pads: { dir: "korean-percussion/" + id, korean: id } });

  const CATEGORIES = [
    { id: "korean", name: "국악기", models: [
      arts("gayageum", "산조가야금", [["pluck", "기본 뜯기", "gayageum"], ["slow-vibrato", "느린 농현", "gayageum-slow-vibrato"], ["fast-vibrato", "빠른 농현", "gayageum-fast-vibrato"], ["roll", "트레몰로", "gayageum-roll"], ["bend-down", "퇴성", "gayageum-bend-down"], ["bend-up", "추성", "gayageum-bend-up"]]),
      one("gayageum-25", "25현가야금"),
      arts("geomungo", "거문고", [["pluck", "기본 뜯기", "geomungo"], ["light-vibrato", "잔농현", "geomungo-light-vibrato"], ["deep-vibrato", "깊은 농현", "geomungo-deep-vibrato"]]),
      arts("yanggeum", "양금", [["pluck", "기본 타현", "yanggeum"], ["tremolo", "트레몰로", "yanggeum-tremolo"]]),
      breathy("haegeum", "해금", "기본 활긋기"), breathy("ajaeng", "아쟁", "기본 활긋기"),
      breathy("daegeum", "대금"), one("sogeum", "소금"), breathy("danso", "단소"), one("hun", "훈"),
      breathy("hyangpiri", "향피리"), one("taepyeongso", "태평소"),
      korean("janggu-sanjo", "산조장구"), korean("janggu-samul", "사물장구"), korean("buk-samul", "사물북"),
      korean("buk-sori", "소리북"), korean("sogo", "소고"), korean("kkwaenggwari", "꽹과리"), korean("jing", "징"),
      one("pyeonjong", "편종"), one("pyeongyeong", "편경"),
      station("ritual-signals", "박·축·어", "ritual-signals", [{ id: "bak", name: "박" }, { id: "chuk", name: "축" }, { id: "eo", name: "어" }]),
      station("daechwita-station", "대취타 편성", "daechwita", [{ id: "nabal", name: "나발" }, { id: "nagak", name: "나각" }, { id: "yonggo", name: "용고" }, { id: "jabara", name: "자바라" }, { id: "jing", name: "징" }]),
    ] },
    { id: "strings", name: "현악기", models: [bowed("violin", "바이올린"), bowed("viola", "비올라"), bowed("cello", "첼로"), bowed("upright-bass", "콘트라베이스"), one("harp", "하프")] },
    { id: "woodwind", name: "목관악기", models: [
      one("piccolo-flute", "피콜로"), one("flute", "플루트"), one("ocarina", "오카리나"),
      one("recorder-piccolo", "피콜로 리코더"), one("recorder-soprano", "소프라노 리코더"), one("recorder-alto", "알토 리코더"), one("recorder-tenor", "테너 리코더"),
      one("oboe", "오보에"), one("english-horn", "잉글리시 호른"), one("clarinet", "클라리넷"), one("bass-clarinet", "베이스 클라리넷"),
      one("bassoon", "바순"), one("contrabassoon", "콘트라바순"), one("soprano-sax", "소프라노 색소폰"), one("saxophone", "알토 색소폰"),
      one("tenor-sax", "테너 색소폰"), one("baritone-sax", "바리톤 색소폰"),
    ] },
    { id: "brass", name: "금관악기", models: [
      one("trumpet", "트럼펫"), one("piccolo-trumpet", "피콜로 트럼펫"), one("flugelhorn", "플뤼겔호른"), one("french-horn", "호른"),
      one("alto-trombone", "알토 트롬본"), one("trombone", "테너 트롬본"), one("bass-trombone", "베이스 트롬본"), one("euphonium", "유포니움"), one("tuba", "베이스 튜바"),
    ] },
    { id: "percussion", name: "타악기", models: [
      one("timpani", "팀파니"), one("glockenspiel", "글로켄슈필"), one("marimba", "마림바"), one("vibraphone", "비브라폰"), one("xylophone", "실로폰"),
      station("orchestral-percussion", "오케스트라 타악 편성", "orchestral-percussion", [
        { id: "orchestral-snare", name: "스네어드럼" }, { id: "orchestral-bass-drum", name: "베이스드럼" }, { id: "orchestral-suspended-cymbal", name: "서스펜디드 심벌" },
        { id: "orchestral-tamtam", name: "탐탐" }, { id: "orchestral-triangle", name: "트라이앵글" }]),
    ] },
    { id: "drums", name: "드럼", models: [
      kit("rock-kit", "Rock Kit", "drums-rock", 2.38, { hat: 8 }), kit("metal-kit", "Metal Kit", "drums-metal", -2.33, { hat: 8 }),
      kit("pop-kit", "Pop Kit", "drums-pop", 1.91, { hat: 8, openhat: 8 }), kit("jazz-kit", "Jazz Kit", "drums-jazz", -0.79),
      kit("funk-kit", "Funk Kit", "drums-funk", -1.24, { hat: 8 }), kit("drum-808", "808 Machine", "drums-808", 4.1),
      kit("linn-machine", "Linn Machine", "drums-linn", 6.58, { hat: 8 }),
    ] },
    { id: "bass", name: "베이스", models: [
      electric("p-bass", "P-Style 4", "p-bass"), electric("j-bass", "J-Style 4", "j-bass"), electric("active-bass", "Modern Active 5", "active-bass"),
      electric("fretless-bass", "Fretless 4", "fretless-bass"), bowed("upright-bass", "콘트라베이스"),
    ] },
    { id: "guitar", name: "기타", models: [
      arts("s-style", "Rock S-Style", [["clean", "클린", "guitar-s-clean"], ["blues", "블루스", "guitar-s-blues"], ["funk", "펑크", "guitar-s-funk"], ["rock", "록", "guitar-s-rock"]]),
      one("metal-seven", "Modern Metal 7", "guitar-superstrat"), one("hollow-jazz", "Hollowbody Jazz", "guitar-hollow"),
      one("dreadnought", "Dreadnought", "guitar-steel"), one("classical-guitar", "Classical Nylon", "guitar-nylon"),
    ] },
    { id: "keyboard", name: "건반", pedal: true, models: [
      one("concert-grand", "콘서트 그랜드"), one("upright-piano", "업라이트 피아노"), one("harpsichord", "하프시코드"),
      one("tine-ep", "펜더 로즈"), one("reed-ep", "월리처"), one("clavinet", "클라비넷"), one("fm-dx7", "FM 피아노 · DX7"),
      one("jd800", "JD-800"), one("hybrid-la-rhodes", "LA 피아노 + LA 로즈"), one("hybrid-la-mks", "LA 피아노 + MKS"),
      one("hammond-organ", "해먼드 오르간"), one("pipe-organ", "파이프오르간"),
    ] },
  ];
  // 악기실에서 연주할 수 있는 음역(MODEL_LIBRARY.range). 녹음 밖의 음은 가까운 녹음을 높이·낮춰 낸다.
  const KEYS = [21, 108];
  const RANGES = {
    "concert-grand": KEYS, "upright-piano": KEYS, harpsichord: KEYS, "tine-ep": KEYS, "reed-ep": KEYS, clavinet: KEYS,
    "fm-dx7": KEYS, jd800: KEYS, "hybrid-la-rhodes": KEYS, "hybrid-la-mks": KEYS, "hammond-organ": KEYS, "pipe-organ": KEYS,
    "p-bass": [28, 67], "j-bass": [28, 67], "active-bass": [23, 72], "fretless-bass": [28, 67], "upright-bass": [52, 108],
    "s-style": [40, 88], "metal-seven": [35, 88], "hollow-jazz": [40, 88], dreadnought: [40, 88], "classical-guitar": [40, 88],
    violin: [55, 108], viola: [48, 108], cello: [48, 108], harp: [25, 102],
    "piccolo-flute": [72, 108], flute: [60, 96], ocarina: [60, 86], "recorder-piccolo": [77, 104], "recorder-soprano": [72, 101],
    "recorder-alto": [65, 89], "recorder-tenor": [60, 84], oboe: [58, 91], "english-horn": [49, 90], clarinet: [48, 95],
    "bass-clarinet": [44, 95], bassoon: [44, 91], contrabassoon: [32, 80], "soprano-sax": [53, 94], saxophone: [46, 92],
    "tenor-sax": [53, 102], "baritone-sax": [45, 100],
    trumpet: [52, 97], "piccolo-trumpet": [52, 100], flugelhorn: [52, 92], "french-horn": [47, 93], "alto-trombone": [45, 88],
    trombone: [52, 97], "bass-trombone": [35, 92], euphonium: [40, 94], tuba: [40, 96],
    timpani: [36, 53], glockenspiel: [79, 108], marimba: [36, 96], vibraphone: [53, 89], xylophone: [48, 89],
    gayageum: [43, 77], "gayageum-25": [43, 81], geomungo: [46, 77], yanggeum: [51, 80], haegeum: [55, 79], ajaeng: [43, 78],
    daegeum: [59, 89], sogeum: [70, 93], danso: [66, 92], hun: [60, 71], hyangpiri: [59, 77], taepyeongso: [68, 89],
    pyeonjong: [60, 75], pyeongyeong: [72, 87],
  };
  // 누르고 있는 동안 소리가 이어지는 악기(악기실 heldTone). 반복 구간을 돌려 길게 낸다.
  const HELD = new Set(["hammond-organ", "pipe-organ", "flute", "oboe", "trumpet", "piccolo-trumpet", "clarinet", "bass-clarinet",
    "piccolo-flute", "french-horn", "english-horn", "soprano-sax", "saxophone", "tenor-sax", "baritone-sax", "bassoon", "contrabassoon",
    "flugelhorn", "alto-trombone", "trombone", "bass-trombone", "euphonium", "tuba", "violin", "viola", "cello", "upright-bass",
    "haegeum", "haegeum-vibrato", "daegeum", "daegeum-vibrato", "hyangpiri", "hyangpiri-vibrato", "taepyeongso", "yanggeum-tremolo",
    "ajaeng", "ajaeng-vibrato", "sogeum", "danso", "danso-vibrato", "hun", "ocarina", "recorder-piccolo", "recorder-soprano",
    "recorder-alto", "recorder-tenor"]);
  // 녹음 맨 앞부터 재생하는 묶음(악기실 startOffset: 0). 나머지는 첫 소리를 찾아 그 앞부터.
  const START_AT_ZERO = /^(haegeum|daegeum|hyangpiri|taepyeongso|gayageum|geomungo|yanggeum|ajaeng|sogeum|danso|hun|pyeonjong|pyeongyeong|ocarina|guitar-)/;
  // 뜯는 현처럼 짧게 사라지는 소리의 감쇠 시간(악기실 pluckedKeyboardDecay).
  const DECAY = { clavinet: 1.65, "violin-pizz": 2.2, "viola-pizz": 2.2, "cello-pizz": 2.2, "upright-bass-pizz": 2.2, harpsichord: 3.4 };
  // 드럼 세트 조각별 목표 크기(악기실 DRUM_PIECE_LEVELS).
  const DRUM_LEVELS = {
    kick: [.24, .28], snare: [.18, .20], rimshot: [.19, .22],
    ghost: [.026, .034], sidestick: [.065, .085], rimclick: [.065, .085],
    hightom: [.11, .14], midtom: [.11, .14], lowtom: [.12, .15],
    hat: [.045, .055], pedalhat: [.035, .045], openhat: [.05, .065],
    crash: [.08, .095], ride: [.04, .05], ridebell: [.045, .055],
  };

  // 짧게 끝나는 악기는 음 길이와 상관없이 자연스럽게 울리게 둔다(악기실과 같음).
  const ONE_SHOT = new Set(["timpani", "glockenspiel", "marimba", "vibraphone", "xylophone", "harp", "gayageum", "gayageum-slow-vibrato",
    "gayageum-fast-vibrato", "gayageum-roll", "gayageum-bend-down", "gayageum-bend-up", "geomungo", "geomungo-light-vibrato",
    "geomungo-deep-vibrato", "gayageum-25", "yanggeum", "pyeonjong", "pyeongyeong"]);

  // 같은 악기가 두 대분류에 있으면(콘트라베이스) 키는 "대분류/악기"로 구분한다.
  const MODELS = {};
  for (const cat of CATEGORIES) for (const m of cat.models) MODELS[cat.id + "/" + m.id] = { ...m, cat };
  return { SETS, CATEGORIES, MODELS, KIT_ROWS, OLD_KIT_ROW_IDS, ONE_SHOT, RANGES, HELD, START_AT_ZERO, DECAY, DRUM_LEVELS };
});
