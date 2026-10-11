// Source review inventory is deliberately separate from experiment work groups.
// Neither an activity row nor a work group establishes mandatory status or a new app.
const candidates=[
  [
    "9과07#1",
    "관측",
    "관측 장치·조건·대상 특징 비교. 제외: 관측 일지 작성 기능."
  ],
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
    "12유전03#1",
    "분자 상호작용 모형",
    "출처가 확인된 단백질·후보 물질·가상 실험의 비교. 제외: 임의 결합 점수를 실제 친화도·약효로 표시."
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
    "12지시03#4",
    "유체 실험",
    "온도차·회전 조건의 유체 모형 실험. 제외: 모형이 지구 중력·위도별 전향력을 모두 재현한다는 주장."
  ],
  [
    "12행우01#2",
    "관측",
    "선택과목 행성 관측 절차. 제외: 관측 보고서·발표 평가표 기능."
  ],
  [
    "12행우02#1",
    "관측 자료 분석",
    "관측 장치와 시간에 따른 흑점 이동 측정. 제외: 단순 그림 이동을 실관측 완료로 판정."
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

const experimentGroups=[
  {
    id:'telescope-observation',title:'망원경으로 달·행성 관측',activities:['9과07#1','12행우01#2'],
    approach:'공통 관측 절차를 함께 검토',relatedApps:['night-sky','planet-motion'],
    sharedProcedure:'관측 시기·장소와 대상 선택, 망원경 설치, 대상의 특징 비교',
    remaining:'중학교의 맨눈 비교와 고교의 행성 관측 범위는 각각 유지한다. 기존 앱은 하늘·궤도 모형으로 망원경 설치와 관측 절차를 제공하지 않는다.'
  },
  {
    id:'local-biology',title:'주변 생물 관찰·동정',activities:['10과탐2-01#2','12기환01#1'],
    approach:'공통 관찰 절차를 함께 검토',relatedApps:['living-things'],
    sharedProcedure:'학교·지역의 생물 관찰, 촬영, 특징에 따른 동정',
    remaining:'공통과목의 구역·기간별 비교와 선택과목의 다섯 종류 이상 관찰 조건은 각각 유지한다. 초등 생물 카드 분류만으로 현장 관찰을 충족하지 않는다.'
  },
  {
    id:'reaction-demonstration',title:'화학 반응 시연',activities:['10과탐1-02#4'],
    approach:'기존 화학 실험에서 활용 범위 검토',relatedApps:['neutralization-common','redox'],
    sharedProcedure:'교과서가 제시한 산·염기, 산화·환원 등의 반응에서 하나를 골라 시연',
    remaining:'특정 반응을 의무 지정한 활동이 아니다. 과학마술 전용 앱은 만들지 않고, 선택한 반응의 조건과 결과를 기존 실험에서 확인한다. 대본·발표 활동의 완료로 세지 않는다.'
  },
  {
    id:'environment-measurement',title:'주변 오염물질 측정',activities:['10과탐2-01#5'],
    approach:'측정 절차 검토',relatedApps:['mcu-sampling'],
    sharedProcedure:'오염물질·측정 장소·장치 선택, 현장 측정과 지역 자료 비교',
    remaining:'기존 맥파·소음 센서 모형은 오염물질 측정 절차의 대체가 아니다. 물질별 센서와 측정 자료의 근거가 필요하다.'
  },
  {
    id:'protein-interaction',title:'단백질·화합물 상호작용',activities:['12유전03#1'],
    approach:'가상 실험 근거 검토',relatedApps:['protein-folding'],
    sharedProcedure:'표적 단백질과 후보 물질의 상호작용 결과 비교',
    remaining:'기존 단백질 접기 앱에는 표적·후보 물질별 에너지 비교가 없다. 교과서 지정 가상 실험의 결과 근거를 확인해야 하며 임의 점수를 만들지 않는다.'
  },
  {
    id:'rotating-tank',title:'회전 수조의 온도차·유체 관찰',activities:['12지시03#4'],
    approach:'장치·유체 실험 검토',relatedApps:[],
    sharedProcedure:'안팎 온도차와 회전 여부에 따른 중간 원통의 유체 비교',
    remaining:'입자 이동 관찰을 포함한 장치 모형이 필요하다. 철회된 정성 도식과 기존 태풍 설명 모형으로 완료 처리하지 않는다.'
  },
  {
    id:'sunspot-observation',title:'태양 광구 관측과 흑점 이동',activities:['12행우02#1'],
    approach:'관측 절차 검토',relatedApps:[],
    sharedProcedure:'광구 관측과 시간·위도별 흑점 위치 측정',
    remaining:'직접 관측 단계와 위성 영상 자료 해석 단계를 구별한다. 철회된 주기 계산기는 영상에서 위치를 측정하는 실험이 아니다.'
  }
];

// These stay in the source inventory, but cannot generate independent experiments.
const referenceActivities=['10과탐1-02#3','12지시02#2','12지시03#3','12행우03#2','12행우03#3'];
const unresolvedActivities=['9과18#2'];
const summary={experimentActivityRows:experimentGroups.flatMap(g=>g.activities).length,experimentReviewGroups:experimentGroups.length,referenceOnly:referenceActivities.length,sourceUnresolved:unresolvedActivities.length,newAppCount:null};
function disposition(id){
  if(referenceActivities.includes(id))return{queue:'reference-only',status:'자료 해석 참고 · 독립 실험 구현 대상 아님'};
  if(unresolvedActivities.includes(id))return{queue:'source-unresolved',status:'원문 절차 확인 대기 · 구현 목록에 넣지 않음'};
  const group=experimentGroups.find(g=>g.activities.includes(id));
  return group?{queue:'experiment-review',group:group.id,status:'공통 절차 검토 · 구현 완료 아님'}:null;
}
module.exports={candidates,experimentGroups,referenceActivities,unresolvedActivities,summary,disposition};
