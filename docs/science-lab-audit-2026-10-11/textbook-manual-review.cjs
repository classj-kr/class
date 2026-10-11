// Manual decisions refer only to the listed pages, never the entire document.
const experiments=[
 {id:'mendeleev-cards',sourceId:'764c91a83f8bf462',pages:[27,28,75,77],title:'원소 카드 19장 배열과 빈칸 원소 예측',slug:'mendeleev',conditions:['원자량 증가','화학식·반응성의 세로줄 유사성','빈칸의 질량 범위와 화학식 예측']},
 {id:'pasteur-broth',sourceId:'43ac53e9e01adbcc',pages:[8],title:'백조목 플라스크의 배양액 비교',slug:'pasteur',conditions:['끓임 여부','백조목 유지','목 절단','목의 먼지와 접촉','밀봉 대조'],variantPending:{pages:[9,10],description:'우유 100 mL를 이용한 4일 실물 재연은 이 정성 배양액 모형과 구별'}},
 {id:'prism-dispersion',sourceId:'43ac53e9e01adbcc',pages:[5],title:'백색광 분산',slug:'newton-prism',mode:'dispersion'},
 {id:'prism-single',sourceId:'43ac53e9e01adbcc',pages:[5],title:'한 색의 빛을 두 번째 프리즘에 통과시키기',slug:'newton-prism',mode:'single'},
 {id:'prism-recombine',sourceId:'43ac53e9e01adbcc',pages:[6],title:'반원 모양 유리와 스크린 위치를 바꾸어 빛 합성',slug:'newton-prism',mode:'combine'},
 {id:'droplet-distance',sourceId:'98fd4b1d24cbec64',pages:[11,12],title:'분무기와 새 도화지의 거리 비교',slug:'infection-prevention',mode:'spray'},
 {id:'contact-game',sourceId:'98fd4b1d24cbec64',pages:[12],title:'접촉 붙임딱지의 네 차례 전파',slug:'infection-prevention',mode:'contact'},
 {id:'lotion-wash',sourceId:'98fd4b1d24cbec64',pages:[17,18],title:'형광 로션·물/비누 30초 손 씻기 비교',slug:'infection-prevention',mode:'wash'}
].map(r=>({...r,verdict:'교과서 해당 절차 대조 · 가상 실험 구현 · 실물 실험 완료 아님',publisherDeduplication:'다른 출판사 판본과의 중복 판정 전'}));
const variants={
 'mendeleev-cards':[{sourceId:'ee3ee343af97cac2',pages:[21,22,79],difference:'17장 카드의 성질에서 원소 기호 찾기, 배열 및 현대 주기율표 비교',implementation:'미구현: 현재 미래엔의 기호가 주어진 19장 카드 배열과 구별'}],
 'prism-dispersion':[{sourceId:'ee3ee343af97cac2',pages:[47,48],difference:'같은 백색광 분산. 슬릿의 폭·장치 제작 치수는 다름',implementation:'분산 모형에 포함; 실물 제작 제외'},{sourceId:'764c91a83f8bf462',pages:[45,65,71],difference:'백열전구 지정 및 RGB LED와 스펙트럼 비교 평가',implementation:'두 광원 선택·색 띠 비교와 전이 문항에 포함'}],
 'prism-single':[{sourceId:'ee3ee343af97cac2',pages:[49],difference:'빨강만 골라 두 번째 프리즘 통과',implementation:'선택색 재통과에 포함'},{sourceId:'764c91a83f8bf462',pages:[46,65],difference:'슬릿 셋·두 번째 프리즘 고정, 첫 프리즘을 돌려 같은 경로로 입사하는 빨강/파랑 비교',implementation:'미구현: 현재 두 번째 프리즘이 선택색에 맞추어 이동함'}],
 'prism-recombine':[{sourceId:'ee3ee343af97cac2',pages:[48],difference:'반원 유리 대신 물을 담은 둥근 컵',implementation:'컵 선택과 스크린 이동 이상 모형'},{sourceId:'764c91a83f8bf462',pages:[46],difference:'반원 유리 대신 볼록 렌즈',implementation:'렌즈 선택과 스크린 이동 이상 모형'}],
 'lotion-wash':[{sourceId:'7ef50ee5847f660e',pages:[17,18],difference:'형광 로션·비누 세척 전후 비교. 물 대조와 동일 시간 명시 없음',implementation:'로션 전후 관찰에 포함; 여섯 손 씻기 동작 수행은 미구현'}]
};
for(const e of experiments)if(variants[e.id]){e.publisherVariants=variants[e.id];e.publisherDeduplication='기재한 판본·쪽에 한해 같은 목적의 활동으로 묶음. 도구·조건 차이와 미구현 절차 별도 명시; 모든 출판사 대조 완료 아님';}
const candidates={
 'book-6533f02a4ca7f168':{verdict:'카드 부록까지 원문 대조 · 배열/예측을 한 탐구로 묶음',experiments:['mendeleev-cards']},
 'book-41c45541a721606f':{verdict:'세 장치 실험으로 분해',experiments:['prism-dispersion','prism-single','prism-recombine']},
 'book-1c6685646b80ce90':{verdict:'원문 절차 확인',experiments:['droplet-distance']},
 'book-eb7eafe83cd2a16a':{verdict:'상위 표제 · 하위 두 활동과 별도 합산 금지',experiments:['droplet-distance','contact-game']},
 'book-ce3b0ee7822989a5':{verdict:'수행 기능 라벨 · 독립 실험 아님',experiments:[]},
 'book-057e669ab8d637cd':{verdict:'원문 절차 확인',experiments:['lotion-wash']},
 'book-3fc061438127ec31':{verdict:'수행 기능 라벨 · 독립 실험 아님',experiments:[]}
};
module.exports={basis:'같은 목적·조작 조건·관찰 결과를 대조하여 실험을 구분한다. 조건별 결과를 각각 새 실험으로 부풀리지 않는다. 출판사별 중복 검토와 교과서 전수 대조 전 전체 실험 수는 미확정이다.',experiments,candidates,missedByHeadingExtractor:['pasteur-broth','contact-game']};
