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
 'mendeleev-cards':[{sourceId:'ee3ee343af97cac2',pages:[21,22,79],difference:'17장 카드의 성질에서 원소 기호 찾기, 배열 및 현대 주기율표 비교',implementation:'별도 카드 세트에서 기호 확인·원문 배열판·첫 20개 현대 원소와 18족·수소 비교 구현. 19장 활동과 조건을 섞거나 앱 총수를 늘리지 않음; 자유 토론·외부 검색은 제외'}],
 'prism-dispersion':[{sourceId:'ee3ee343af97cac2',pages:[47,48],difference:'같은 백색광 분산. 슬릿의 폭·장치 제작 치수는 다름',implementation:'분산 모형에 포함; 실물 제작 제외'},{sourceId:'764c91a83f8bf462',pages:[45,65,71],difference:'백열전구 지정 및 RGB LED와 스펙트럼 비교 평가',implementation:'두 광원 선택·색 띠 비교와 전이 문항에 포함'}],
 'prism-single':[{sourceId:'ee3ee343af97cac2',pages:[49],difference:'빨강만 골라 두 번째 프리즘 통과',implementation:'선택색 재통과에 포함'},{sourceId:'764c91a83f8bf462',pages:[46,65],difference:'슬릿 셋·두 번째 프리즘 고정, 첫 프리즘을 돌려 같은 경로로 입사하는 빨강/파랑 비교',implementation:'같은 입사 경로 비교 모드에 구현: 슬릿 세 개·두 번째 프리즘 고정, 첫 프리즘으로 선택한 빨강/파랑의 경로와 스크린 위치 비교. 실제 회전각·장치 정렬 측정은 제외'}],
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
experiments.push(
 {id:'root-uptake',sourceId:'89316af3de563d4c',pages:[7],title:'뿌리 유무에 따른 물 흡수 비교',slug:'microscope',mode:'root-uptake',conditions:['고추 모종의 뿌리 유무','같은 초기 수면·크기·잎 수·빛·시간','처음 수면 표시와 3일 뒤 비교','두 조건 교환 및 같은 조건 대조'],verdict:'원문 장치·절차와 대조한 정성 가상 실험; 뿌리 형태의 실물 관찰은 별도',publisherDeduplication:'미래엔·천재의 기재한 쪽은 같은 실험으로 묶음. 전체 출판사 대조 완료 아님',publisherVariants:[{sourceId:'4020707022bbe8dd',pages:[9],difference:'천재 고추 모종·탈지면과 비닐 랩·2~3일 비교',implementation:'뿌리 유무·같은 수면·3일 비교에 포함; 실제 부피·흡수 속도 예측은 제외'},{sourceId:'0c762181d67d630e',pages:[4],difference:'천재 실험관찰의 결과·통제 조건 확인',implementation:'물이 많이 줄어듦/거의 줄지 않음의 정성 결과를 대조'},{sourceId:'d544b624a4fe52c2',pages:[3,4],difference:'미래엔 고추 본문 재수록 및 양파·비커·2~3일 대체 실험',implementation:'고추/양파 선택으로 포함; 같은 흡수 기능의 재료 변형을 독립 총수로 중복 합산하지 않음'}]},
 {id:'leaf-transpiration-pair',sourceId:'d544b624a4fe52c2',pages:[10],title:'잎 유무와 봉지 안쪽 물방울 비교',slug:'microscope',mode:'leaf-transpiration',conditions:['같은 모종의 잎 유무','같은 물·빛·시간·마른 봉지','봉지와 플라스크 물 표면 분리','수증기 배출과 봉지 안쪽 응결 구별'],verdict:'원문 절차와 대조한 정성 가상 실험; 잎 유무 대조를 실제 선택할 수 있게 보완',publisherDeduplication:'미래엔 고추와 천재 봉선화는 잎 유무 대조 목적·조건에 따라 묶되 재료 차이 명시',publisherVariants:[{sourceId:'4020707022bbe8dd',pages:[13],difference:'천재 봉선화·삼각 플라스크·비닐봉지, 실험 설계',implementation:'같은 비교 원리; 화면 식물은 고추이며 봉선화의 형태 관찰까지 구현한 것은 아님'},{sourceId:'0c762181d67d630e',pages:[7],difference:'천재 실험관찰의 통제 조건·잎 유무 비교 절차·해설',implementation:'대조 조건과 결과 해석 확인'}],alternativeDetector:'leaf-water-indicator: 염화코발트 종이는 별도 검출 절차로 구현, 잎 유무 대조와 중복 완료 판정하지 않음'}
);
experiments.push({id:'leaf-water-indicator',sourceId:'89316af3de563d4c',pages:[14],title:'잎 뒷면의 염화코발트 종이로 물 검출',slug:'microscope',mode:'leaf-water-indicator',conditions:['잎 뒷면에 푸른색 종이를 붙인 지퍼 백','1~2일 뒤 색 변화','이미 젖은 종이와 유효한 검출 구별'],verdict:'원문 장치·절차와 대조한 정성 가상 실험; 시약 실물 조작은 제외',publisherDeduplication:'잎 유무 대조와 같은 증산 주제이나 물 검출 방법이 다른 절차. 고정된 앱 개수에 맞추어 합치지 않음',publisherVariants:[{sourceId:'d544b624a4fe52c2',pages:[9,10],difference:'같은 염화코발트 종이 검출 절차 및 물 묻은 손에 의한 오염 주의',implementation:'처음부터 붉은 종이는 전후 변화로 판단할 수 없도록 구현'}]});
for(const id of ['book-3899b84a16b83722','book-a7c7f9e7a66e2f35'])candidates[id]={verdict:'원문 검출 도구·시간·처음 상태 대조',experiments:['leaf-water-indicator']};
for(const id of ['book-768b8d61d6ac7898','book-45ec556c518f44ab','book-91c77fd395ad6739'])candidates[id]={verdict:'기재한 원문 절차 대조 · 재료 변형을 같은 흡수 기능 실험으로 묶음',experiments:['root-uptake']};
candidates['book-1fdcaf904d9b634f']={verdict:'잎 유무를 실제로 바꾸는 두 장치 대조 구현 · 단일 잎 검출법과 구별',experiments:['leaf-transpiration-pair']};
const additions=[...require('../../scripts/science-physics-experiments.cjs'),...require('../../scripts/science-chemistry-experiments.cjs'),...require('../../scripts/science-inquiry-experiments.cjs'),...require('../../scripts/science-evidence-experiments.cjs'),...require('../../scripts/science-structure-experiments.cjs'),...require('../../scripts/science-sensor-experiments.cjs')];
for(const r of additions){
 const units=['sugar-phase','mcu-sampling'].includes(r.slug)?r.procedures:r.slug==='bean-respiration'?r.procedures:[[r.slug,r.title,r.source.pages]];
 for(const [mode,title,pages]of units)experiments.push({id:r.slug+'-'+mode,sourceId:r.source.id,pages,title,slug:r.slug,mode,conditions:r.procedures.map(p=>p[1]),verdict:'기재한 교과서 절차와 대조한 가상 실험; 실물 수행·전체 단원 완료 아님',publisherDeduplication:'해당 출판사·쪽만 대조; 다른 출판사 전수 중복 판정 전',boundary:r.boundary});
}
module.exports={basis:'같은 목적·조작 조건·관찰 결과를 대조하여 실험을 구분한다. 조건별 결과를 각각 새 실험으로 부풀리지 않는다. 출판사별 중복 검토와 교과서 전수 대조 전 전체 실험 수는 미확정이다.',experiments,candidates,missedByHeadingExtractor:['pasteur-broth','contact-game']};
