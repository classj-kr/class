// Source review inventory is deliberately separate from experiment work groups.
// Neither an activity row nor a work group establishes mandatory status or a new app.
const reviewedCandidates=[
  [
    "9과18#2",
    "실측 자료 분석",
    "원문 위치를 확인할 후보로만 보존. 제외: 고교 해양 자료를 중학교 원문 근거로 대체하거나 가상 자료를 실측으로 제시."
  ],
  [
    "10과탐1-02#3",
    "관측 자료 해석 (직접 실험과 별도)",
    "관측 자료 해석 대상으로 구분; 직접 실험 수에는 합산하지 않음. 제외: 발표·소감 양식과 임의 자료로 실관측 대체."
  ],
  [
    "10과탐1-02#4",
    "실험 설계·시연",
    "검증된 화학 반응과 조건 비교 절차만 별도 확인. 제외: 마술 대본·역할 분담·공유 플랫폼 제작."
  ],
  [
    "10과탐2-01#2",
    "현장 조사",
    "정해진 구역·기간의 생물 관찰과 동정. 제외: 외래종 찬반 토론·주장 글 작성·생태지도 게시."
  ],
  [
    "10과탐2-01#5",
    "현장 측정",
    "센서 종류·측정 조건·실측 비교. 제외: 계획서·발표·실천 소감 작성 기능."
  ],
  [
    "12지시02#2",
    "관측 자료 해석 (직접 실험과 별도)",
    "조석 자료 해석 대상으로 구분; 예보와 관측을 표시. 제외: 예보표를 실시간 실측 자료라고 표시."
  ],
  [
    "12지시03#3",
    "관측 자료 해석 (직접 실험과 별도)",
    "관측 자료 해석 대상으로 구분; 직접 실험 수에는 합산하지 않음. 제외: 임의 기압 도식을 실제 날짜의 일기도로 제시."
  ],
  [
    "12행우03#2",
    "관측 자료 해석 (직접 실험과 별도)",
    "관측 자료 해석 대상으로 구분; 두 자료의 출처와 역할 보존. 제외: 자체 관측한 변광성 자료로 제시."
  ],
  [
    "12행우03#3",
    "관측 자료 해석 (직접 실험과 별도)",
    "관측 자료 해석 대상으로 구분; 직접 실험 수에는 합산하지 않음. 제외: 무작위 점 분포를 실제 전천 탐사 자료로 표시."
  ],
  [
    "12기환01#1",
    "현장 조사",
    "지역 생물의 관찰·동정 단계. 제외: 지도 제작·공유 서비스·발표 기능."
  ]
];

const resolvedGroups=[
  {
    id:'local-biology',title:'주변 생물 관찰·동정',activities:['10과탐2-01#2','12기환01#1'],
    approach:'공통·선택 경로에서 가상 관찰·동정 구현',relatedApps:['local-biodiversity'],
    sharedProcedure:'학교·지역의 생물 관찰, 촬영, 특징에 따른 동정',
    remaining:'구역·시각·관찰 노력과 다섯 표본 조건을 구분한다. 작성된 표본 그림의 가상 연습이며 실제 현장 관찰·촬영·지도 게시 완료는 아니다.'
  },
  {
    id:'reaction-demonstration',title:'화학 반응 시연',activities:['10과탐1-02#4'],
    approach:'중화 반응의 혼합 비율·온도 비교로 연결',relatedApps:['neutralization-common'],
    sharedProcedure:'교과서가 제시한 산·염기, 산화·환원 등의 반응에서 하나를 골라 시연',
    remaining:'특정 반응을 의무 지정한 활동이 아니다. 과학마술 전용 앱은 만들지 않고, 선택한 반응의 조건과 결과를 기존 실험에서 확인한다. 대본·발표 활동의 완료로 세지 않는다.'
  },
  {
    id:'environment-measurement',title:'주변 오염물질 측정',activities:['10과탐2-01#5'],
    approach:'공기질 센서의 영점·포집·농도 비교 구현',relatedApps:['air-sampling'],
    sharedProcedure:'오염물질·측정 장소·장치 선택, 현장 측정과 지역 자료 비교',
    remaining:'단위 밀도 구형 입자의 작성된 분포로 PM2.5·PM10의 농도를 계산한다. 실제 현장 측정·센서 교정·공개 지역 자료의 대조 완료는 아니다.'
  }
];

const resolvedIds=resolvedGroups.flatMap(g=>g.activities);
const candidates=reviewedCandidates.filter(r=>!resolvedIds.includes(r[0]));
const experimentGroups=[];

// These stay in the source inventory, but cannot generate independent experiments.
const referenceActivities=['10과탐1-02#3','12지시02#2','12지시03#3','12행우03#2','12행우03#3'];
const unresolvedActivities=['9과18#2'];
const summary={experimentActivityRows:experimentGroups.flatMap(g=>g.activities).length,experimentReviewGroups:experimentGroups.length,referenceOnly:referenceActivities.length,sourceUnresolved:unresolvedActivities.length,newAppCount:null,sourceReviewedVirtualPracticeRows:resolvedIds.length};
function disposition(id){
  if(referenceActivities.includes(id))return{queue:'reference-only',status:'자료 해석 참고 · 독립 실험 구현 대상 아님'};
  if(unresolvedActivities.includes(id))return{queue:'source-unresolved',status:'원문 절차 확인 대기 · 구현 목록에 넣지 않음'};
  const group=experimentGroups.find(g=>g.activities.includes(id));
  return group?{queue:'experiment-review',group:group.id,status:'공통 절차 검토 · 구현 완료 아님'}:null;
}
module.exports={candidates,experimentGroups,resolvedGroups,referenceActivities,unresolvedActivities,summary,disposition};
