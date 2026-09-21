// Regional distribution symbols, not surveyed excavation coordinates or borders.
// Reference: National Institute of Korean History, map_019_01.jpg (7th curriculum).
(function () {
  "use strict";
  const source = "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m71_0020_0020_0010_0020";
  const lawSource = "https://contents.history.go.kr/front/tg/view.do?levelId=tg_001_0500";
  const artifacts = [
    {
      id: "dagger", name: "비파형 동검", color: "#9c2859", photo: "history/bronze-dagger.jpg",
      description: "검몸 가운데가 불룩하고, 검몸과 손잡이를 따로 만들어 맞췄다.",
      // Representative placements summarise the reference map's regional pattern.
      // A symbol must never be presented as a named, exact excavation site.
      points: [[117.9,40.1],[118.3,40.5],[119.7,41.2],[120,41.8],[120.5,42.3],[120.8,41.4],[121.2,41.9],[121.7,41.3],[122,42.1],[122.4,41.6],[121.4,40.8],[122,40.5],[121.6,39.6],[122.3,39.9],[123,40.2],[123.6,40.6],[124.5,42.1],[125,42.7],[125.3,43.3],[125.3,44.1],[126,43.7],[126.6,43.5],[126.3,42.9],[127.1,42.5],[128.7,43.1],[125,41.4],[125.7,41.5],[126.5,41.3],[127.2,41.5],[126.7,40.5],[125.3,39.8],[125.8,39.4],[126.5,39.6],[126.1,38.8],[126.6,38.2],[127.1,37.6],[127.8,37.5],[128.6,37.2],[127.1,36.7],[127.5,36.2],[128.4,36],[128.9,35.7],[127.2,35.7],[126.9,35.3],[127.3,34.9],[127.7,34.8],[128.5,35.2],[129,35.2],[126.5,33.4]]
    },
    {
      id: "dolmen", name: "탁자식 고인돌", color: "#246677", photo: "heritage/p02.jpg",
      description: "세운 받침돌 위에 넓고 무거운 덮개돌을 얹은 무덤이다.",
      points: [[122.2,39.7],[122.9,40.1],[123.5,40.5],[124.1,40.7],[124.8,41.5],[125.6,42],[126.2,42.3],[126.9,41.8],[127.5,41.7],[125.6,40.2],[125.1,39.7],[125.7,39.1],[126.2,39.4],[125.8,38.7],[126.4,38.3],[126.45,37.77],[127.3,37.8],[128,37.6]]
    }
  ];
  const questions = [
    {
      id: "country", prompt: "지도에 나타난 두 유물·유적을 통해 문화 범위를 짐작할 수 있는 나라는?",
      options: ["부여", "백제", "고조선", "발해", "신라"], answer: 2,
      explanation: "비파형 동검과 탁자식 고인돌은 고조선 관련 문화 범위를 살피는 단서이다. 요령 지방과 한반도에 걸친 분포를 함께 읽는다.",
      distractors: ["부여는 사출도와 영고 등의 특징으로 구별한다.", "백제는 한성·웅진·사비의 도읍 이동과 연결한다.", "", "발해는 고구려 계승 의식과 5경 등의 특징으로 구별한다.", "신라는 골품제와 화백 회의 등의 특징으로 구별한다."]
    },
    {
      id: "society", prompt: "이 나라에 대한 설명으로 옳은 것은?",
      options: ["12월에 영고라는 제천 행사를 열었다.", "다른 부족의 영역을 침범하면 책화로 배상하게 하였다.", "골품에 따라 관직 진출을 제한하였다.", "8조법을 통해 사회 질서를 유지하였다.", "전국을 9주로 나누고 5소경을 두었다."], answer: 3,
      explanation: "고조선의 8조법 가운데 오늘날 전하는 조항을 통해 형벌, 재산, 신분 관계를 살필 수 있다.",
      distractors: ["영고는 부여의 제천 행사이다.", "책화는 동예의 풍습이다.", "골품제는 신라의 신분 제도이다.", "", "9주 5소경은 통일 신라의 지방 제도이다."]
    },
    {
      id: "evidence", prompt: "이 분포도를 해석한 내용으로 가장 적절한 것은?",
      options: ["기호가 있는 곳은 모두 같은 시기의 고조선 영토였다.", "유물·유적의 분포는 문화 범위를 추정하는 단서가 된다.", "비파형 동검은 한반도에서는 발견되지 않는다.", "탁자식 고인돌은 철기 시대에 처음 등장하였다.", "분포 기호를 선으로 연결하면 정확한 국경을 알 수 있다."], answer: 1,
      explanation: "유물의 제작 시기와 사용 집단은 다양하다. 분포는 문화적 관련성을 살피는 자료이지, 특정 시점의 국경을 그대로 표시한 것은 아니다.",
      distractors: ["여러 시기의 분포를 한 시점의 영토와 같다고 볼 수 없다.", "", "지도에서 한반도에 표시된 비파형 동검 기호도 확인한다.", "고인돌은 청동기 시대의 대표적인 유적이다.", "기호 사이를 연결한 선은 역사적 국경의 증거가 되지 않는다."]
    }
  ];
  window.KOREA_HISTORY_BRONZE = { artifacts, questions, source, lawSource };
  window.KOREA_HISTORY.scenes.unshift({
    id: "gojoseon-distribution", title: "비파형 동검·고인돌 분포", period: "청동기 문화", era: "청동기", startYear: -2000, endYear: -108,
    distribution: true, bounds: [116.5,32.5,131.5,45.2], maxZoom: 7,
    marks: [
      {xy:[121,42.6], label:"요령 지방", side:"left", kind:"region"},
      {xy:[125.7,39.05], label:"대동강 유역", side:"left", kind:"region"},
      {xy:[127.15,37.65], label:"한강 유역", side:"left", kind:"region"}
    ],
    routes: [], areas: [], labels: [],
    cues: [["비파형 동검",artifacts[0].description],["탁자식 고인돌",artifacts[1].description]],
    trap: "유물·유적의 분포는 문화 범위를 살피는 단서이며, 확정된 국경선이 아니다.",
    source,
    sources: [["분포도 원전 · 우리역사넷", "https://contents.history.go.kr/data/img/ta/ta_m71/map_019_01.jpg"],["8조법 · 우리역사넷",lawSource],["동검 사진 · 국립중앙박물관 / 우리역사넷", "https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_r000300"]],
    note: "원전 분포도를 참고하여 권역별 분포 양상을 개략 기호로 재구성했다. 개별 발굴지의 측량 좌표나 유물 수량을 나타내지 않는다. 여러 시기의 분포이며, 확정 국경이나 단일 시점의 영토를 칠하지 않았다. 문제는 원전의 학습 내용을 바탕으로 만든 자체 문항이다."
  });
})();
