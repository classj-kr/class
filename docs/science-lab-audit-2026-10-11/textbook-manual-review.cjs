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
experiments.push({id:'stem-dye-transport',sourceId:'89316af3de563d4c',pages:[9],title:'백합 줄기의 물 이동과 단면 관찰',slug:'microscope',mode:'stem-dye-transport',conditions:['같은 크기의 백합 두 송이','맹물과 붉은 색소 물 대조','처음과 약 4시간 뒤 꽃·줄기 비교','줄기 위·아래의 가로·세로 단면 관찰'],verdict:'원문 절차·실험관찰·평가 문항 대조한 정성 가상 실험; 실물 절단·현미경 관찰은 별도',publisherDeduplication:'미래엔·천재의 같은 목적과 조작을 한 실험으로 묶음. 전체 출판사 전수 대조 완료 아님',publisherVariants:[{sourceId:'d544b624a4fe52c2',pages:[5,6],difference:'미래엔 실험관찰: 두 백합의 맹물/색소 물 대조와 꽃·단면 기록',implementation:'맹물 대조와 가로·세로 단면 선택에 반영'},{sourceId:'4020707022bbe8dd',pages:[11],difference:'천재 본문: 맹물과 붉은 색소 물의 두 백합을 약 4시간 관찰',implementation:'처음/약 4시간 뒤 비교에 반영'},{sourceId:'0c762181d67d630e',pages:[5,6,13],difference:'천재 실험관찰·평가: 꽃 색 변화, 가로 단면의 점, 세로 단면의 선',implementation:'특정 이동 통로만 붉게 표시하고 전이 문항에 반영'}]});
for(const id of ['book-7ec61fd82b054f78','book-dc1382c6882026e6','book-2723f2f32dbbb2c9','book-72e44c087fff7383'])candidates[id]={verdict:'백합·맹물/색소 물 대조 및 줄기 단면 절차 대조 · 출판사 중복을 한 실험으로 묶음',experiments:['stem-dye-transport']};
const telescope=require('../../scripts/science-telescope-experiment.cjs');
experiments.push({id:'telescope-observation',sourceId:telescope.source.id,pages:telescope.source.pages,title:telescope.title,slug:telescope.slug,mode:'telescope',conditions:['삼각대·가대·균형추·경통·광학 부품의 설치 순서','균형·방향·초점의 독립 조절','파인더와 접안렌즈 중심 정렬','맨눈·파인더·접안렌즈 비교','구름·대상 고도·건물 조건','같은 경통에서 30배·100배 시야 비교'],verdict:'원문 설치·관측 절차의 가상 연습. 실제 날짜의 천문 예보·현장 관측 완료 아님',publisherVariants:telescope.publisherVariants,assessmentSources:telescope.assessmentSources,publisherDeduplication:'중학교와 고교 선택과목의 공통 장치를 한 도구로 구현. 고교 경로는 행성만 제공하고 문항을 분리; 전체 출판사 대조 완료 아님',boundary:telescope.boundary});
for(const id of ['book-cbe63e8e53901d34','book-567f46082f41f032'])candidates[id]={verdict:'장치와 대상 찾기 절차 대조 · 과목별 관측 범위 보존',experiments:['telescope-observation']};
candidates['book-19232fb10e36a552']={verdict:'망원경 관측의 준비 단계 · 별도 독립 실험으로 중복 합산하지 않음',experiments:['telescope-observation']};
for(const id of ['book-3899b84a16b83722','book-a7c7f9e7a66e2f35'])candidates[id]={verdict:'원문 검출 도구·시간·처음 상태 대조',experiments:['leaf-water-indicator']};
for(const id of ['book-768b8d61d6ac7898','book-45ec556c518f44ab','book-91c77fd395ad6739'])candidates[id]={verdict:'기재한 원문 절차 대조 · 재료 변형을 같은 흡수 기능 실험으로 묶음',experiments:['root-uptake']};
candidates['book-1fdcaf904d9b634f']={verdict:'잎 유무를 실제로 바꾸는 두 장치 대조 구현 · 단일 잎 검출법과 구별',experiments:['leaf-transpiration-pair']};
const additions=[...require('../../scripts/science-physics-experiments.cjs'),...require('../../scripts/science-chemistry-experiments.cjs'),...require('../../scripts/science-inquiry-experiments.cjs'),...require('../../scripts/science-evidence-experiments.cjs'),...require('../../scripts/science-structure-experiments.cjs'),...require('../../scripts/science-sensor-experiments.cjs')];
for(const r of additions){
 const units=['sugar-phase','mcu-sampling'].includes(r.slug)?r.procedures:r.slug==='bean-respiration'?r.procedures:[[r.slug,r.title,r.source.pages]];
 for(const [mode,title,pages]of units)experiments.push({id:r.slug+'-'+mode,sourceId:r.source.id,pages,title,slug:r.slug,mode,conditions:r.procedures.map(p=>p[1]),verdict:'기재한 교과서 절차와 대조한 가상 실험; 실물 수행·전체 단원 완료 아님',publisherDeduplication:'해당 출판사·쪽만 대조; 다른 출판사 전수 중복 판정 전',boundary:r.boundary});
}
const annulus=require('../../scripts/science-annulus-experiment.cjs');
experiments.push({id:annulus.slug,sourceId:annulus.source.id,pages:annulus.source.pages,title:annulus.title,slug:annulus.slug,mode:'annulus',conditions:['세 원통 물 채우기','안쪽 냉각·바깥쪽 가열','표면 송홧가루·상층 잉크 표지','정지·느림·파동·불규칙 대표 흐름','같은 온도 조건에서 회전 유무 비교','표면과 바닥의 반대 순환'],verdict:'기재한 출판사별 절차·평가를 대조한 정성 운동 모형; 실측·유체 수치 계산 완료 아님',publisherVariants:annulus.publisherVariants,assessmentSources:annulus.assessmentSources,publisherDeduplication:'세 출판사의 공통 장치를 한 실험으로 묶고 표지와 회전 조건의 차이를 보존; 정량적 회전수·온도차·발달 시간 관계는 미구현',boundary:annulus.boundary});
for(const id of ['book-7f192eaa8383e968','book-715d9dd35a74712a','book-166285fed2ab2886'])candidates[id]={verdict:'원문 절차와 출판사 변형 대조 · 한 회전 수조 실험으로 묶음',experiments:[annulus.slug]};
for(const [name,candidate,conditions]of [
 ['sunspot','book-6a712e0bfbbce780',['2일 간격 세 영상 비교','4일 간격 같은 흑점 3~5개 대응','위도·경도 격자에서 각거리 측정','겉보기 자전 주기와 위도 비교']],
 ['docking','book-87b4ea3036a67bbe',['표적 단백질의 기능 확인','후보 화합물 선택','배치별 상대 에너지 비교','같은 표적에서 후보별 최저값 비교']]
]){
 const r=require('../../scripts/science-'+name+'-experiment.cjs');
 experiments.push({id:r.slug,sourceId:r.source.id,pages:name==='sunspot'?[6,7]:r.source.pages,title:r.title,slug:r.slug,conditions,verdict:name==='sunspot'?'기재한 위성 영상 측정 절차 대조 · 직접 망원경 관측·촬영 완료 아님':'기재한 교과서 지정 도구의 실제 계산 자료 대조 · 새로운 도킹 계산·실물 약효 검증 아님',publisherDeduplication:'기재한 판본·쪽만 검토; 다른 출판사의 유사 활동 전수 대조 전',assessmentSources:r.assessmentSources,boundary:r.boundary});
 candidates[candidate]={verdict:'기재한 원문 절차 대조 · 자료 조작과 결과 해석 구현; 경계는 개별 검토 기록에 보존',experiments:[r.slug]};
}
for(const [name,candidate,conditions]of [
 ['air-sampling','book-86781258f8193a5b',['PM2.5·PM10의 포함 관계','영점 필터와 주변 공기 흡입 구분','포집 질량/공기 부피의 농도 계산','시각·높이·시간을 맞춘 장소 비교']],
 ['biodiversity','book-7ce6ec3ff3dcce09',['관찰 구역·시각·시간 설정','다섯 참조 식물의 줄기·잎·꽃차례 관찰','표본 위치당 한 번의 동정','관찰 표본 수와 종 수 구별']]
]){
 const r=require('../../scripts/science-'+name+'-experiment.cjs');
 experiments.push({id:r.slug,sourceId:r.source.id,pages:r.source.pages,title:r.title,slug:r.slug,conditions,verdict:'기재한 원문 관찰·측정 절차의 가상 연습 구현; 실제 현장 수행 완료 아님',publisherDeduplication:'기재한 출판사·쪽수의 공통 관찰 절차를 묶으며 전수 대조 완료로 판정하지 않음',publisherVariants:r.publisherVariants||[],boundary:r.boundary,methodSources:r.methodSources});
 candidates[candidate]={verdict:'구역·조건·관찰 절차 대조; 실측 자료를 가상 자료로 대체한 완료 주장 제외',experiments:[r.slug]};
}
candidates['book-d1eac30bb9cbf45e']={verdict:'반응 선택·시연을 기존 중화 실험으로 연습; 대본 작성과 발표는 독립 실험에서 제외',experiments:[]};
for(const r of [...require('../../scripts/science-course-practice-experiments.cjs'),...require('../../scripts/science-solution-practices.cjs'),require('../../scripts/science-acoustic-experiment.cjs'),require('../../scripts/science-electroplating-experiment.cjs'),require('../../scripts/science-leaf-starch-experiment.cjs'),require('../../scripts/science-dissolution-mass-experiment.cjs'),require('../../scripts/science-plant-growth-experiment.cjs'),require('../../scripts/science-fermentation-experiment.cjs'),require('../../scripts/science-light-interference-experiment.cjs'),require('../../scripts/science-galileo-experiment.cjs'),require('../../scripts/science-reaction-pressure-experiment.cjs'),require('../../scripts/science-osmosis-mass-experiment.cjs'),require('../../scripts/science-leaf-classification-experiment.cjs'),require('../../scripts/science-animal-classification-experiment.cjs'),require('../../scripts/science-liquid-heat-experiment.cjs'),require('../../scripts/science-phase-mass-experiment.cjs'),require('../../scripts/science-rotating-disc-experiment.cjs'),require('../../scripts/science-quadrat-community-experiment.cjs'),require('../../scripts/science-ph-comparison-experiment.cjs')]){
 experiments.push({id:r.slug,sourceId:r.source.id,pages:r.source.pages,title:r.title,slug:r.slug,conditions:r.procedures.map(p=>p[1]),verdict:'기재한 원문 절차의 가상 실험과 평가 해석 대조; 실물 수행·전체 판본 완료 아님',publisherDeduplication:'기재한 쪽의 공통 목적과 조작만 묶고 시약·표본·검출법 차이는 따로 보존',publisherVariants:r.publisherVariants,assessmentSources:r.assessmentSources,boundary:r.boundary,methodSources:r.methodSources});
 for(const id of r.candidateIds)candidates[id]={verdict:'원문 절차 대조; 공통 절차와 미구현 판본 차이를 개별 기록',experiments:[r.slug]};
}
const circuit=require('../../scripts/science-circuit-course.cjs');
for(const id of ['book-94a444bd63fc52c8','book-a1949a43cf0bb246'])candidates[id]={verdict:'원문 과정·정리 확인: 도량형 역사 조사·연대표·발표이므로 독립 실험에서 제외',experiments:[],scopeActivity:'10과탐1-01#2'};
for(const id of ['book-942e902bcd031cc5','book-91dcd7d032c1cdf0','book-5af2953e5dbd4b41'])candidates[id]={verdict:'원문 과정·정리 확인: 측정 표준의 활용 사례 검색·토의·발표이므로 독립 실험에서 제외',experiments:[],scopeActivity:'10통과1-01#2'};
const foodWeb=require('../../scripts/science-food-web-experiment.cjs');
for(const [mode,title,pages]of [['roles','양분 획득 방법으로 생물 요소 분류',[9,10]],['construction','먹이 관계를 연결하여 모형 구성',[15,16]]])experiments.push({id:'food-web-'+mode,sourceId:foodWeb.source.id,pages,title,slug:foodWeb.slug,mode,conditions:foodWeb.procedures.filter((p,i)=>i===(mode==='roles'?0:1)).map(p=>p[1]),verdict:'분류와 모형 구성을 구별하여 원문 절차 대조; 실제 표본 조사·실물 제작 완료 아님',publisherDeduplication:'기재한 쪽의 동일 목적과 조작만 묶음; 종이컵과 신체 놀이를 독립 필수실험으로 추가하지 않음',publisherVariants:foodWeb.publisherVariants,assessmentSources:foodWeb.assessmentSources,boundary:foodWeb.boundary});
for(const id of ['book-87207332a17f0807','book-ee29615a9171bf3a','book-67cfcaa23274e119'])candidates[id]={verdict:'양분 획득 방법과 분류 절차 대조; 출판사 공통 역할 분류를 묶음',experiments:['food-web-roles']};
candidates['book-d1124256b6144bbe']={verdict:'모형 구성의 생물 선택 단계와 이어지는 화살표 연결 절차 대조',experiments:['food-web-construction']};
experiments.push({id:'circuit-meter-comparison',sourceId:circuit.source.id,pages:circuit.source.pages,title:circuit.title,slug:circuit.slug,mode:'high-elective',conditions:['200 Ω·100 Ω의 직렬/병렬 연결','전류계 직렬·전압계 병렬의 구분','각 저항과 전체의 전압·전류 측정','같은 전압·저항에서 전체 전류 비교'],verdict:'기재한 원문 절차와 가상 계기 연결·측정 대조; 실제 기기 내부 저항·실측 오차 재현 아님',publisherDeduplication:'한 출판사의 직렬·병렬 비교를 하나의 실험으로 묶음; 전체 출판사 대조 완료 아님',boundary:circuit.boundary});
candidates['book-737bf233a2816645']={verdict:'원문 두 쪽의 계기 위치·측정값 비교를 고(선택) 물리학 경로로 구현; 중학교 경로와 조작·평가 분리',experiments:['circuit-meter-comparison']};
experiments.find(e=>e.id==='circuit-meter-comparison').assessmentSources=circuit.assessmentSources;
candidates['book-2a8eaf6627cea902']={verdict:'교사용 내용 요소의 문장 파편이며 독립 실험 제목이 아님. 같은 쪽의 올리브유 실험은 별도로 대조함.',experiments:[]};
const microbes=require('../../scripts/science-microbe-observation-experiment.cjs');
for(const [mode,title,pages]of microbes.procedures)experiments.push({id:'microbes-'+mode,sourceId:microbes.source.id,pages,title,slug:'microbes',mode,conditions:[title,'준비 표본의 조명과 초점을 조절하고 특징 비교'],verdict:'원본 표본 사진과 관찰 절차 일부 대조; 실물 전체 관찰 완료 아님',publisherDeduplication:'각 출판사의 균류 관찰과 원생생물 관찰을 두 단위로 묶음; 생표본 움직임은 미구현',publisherVariants:microbes.publisherVariants,assessmentSources:microbes.assessmentSources,boundary:microbes.boundary});
for(const [mode,ids]of [['fungi',['book-f8c9297d24946d91','book-e82e384f04ae6621','book-422d458de5304b9f','book-b1e2837cb5e00df1','book-1ef3840ba6b71037']],['protists',['book-647b69f4f32f0ae0','book-ec7b66ad8109626a','book-38a577357da60fd0','book-6a89a0c3ec57a082','book-326f4e7d9278a414']]])for(const id of ids)candidates[id]={verdict:'기재한 판본의 고정 표본 관찰 절차·사진·해설 대조; 생표본과 기종별 실물 조작은 미구현',experiments:['microbes-'+mode]};
const weighing=require('../../scripts/science-mole-weighing-course.cjs');
const rocks=require('../../scripts/science-rock-specimens-course.cjs');
for(const [mode,title,pages]of rocks.procedures)experiments.push({id:'rock-layers-'+mode,slug:rocks.slug,mode,title,sourceId:rocks.source.id,pages,conditions:[title],verdict:'기재한 원본 사진과 관찰·분류·모형 제작 절차 대조; 실물 수행 완료 아님',publisherDeduplication:'퇴적암 관찰·화석 관찰·화석 모형의 세 절차로 구분; 여섯 암석과 여러 재료/사진을 독립 실험 수로 세지 않음',publisherVariants:rocks.publisherVariants,assessmentSources:rocks.assessmentSources,boundary:rocks.boundary});
for(const [mode,ids]of [['rocks',['book-92928e3cd5fa5495','book-b0123c04dae85b40','book-bf6942376221e519','book-1dc8ed619addf176']],['fossils',['book-7a9c9c8c07c4c78f','book-899beb98403a1df9']],['casting',['book-988278b91b0f472f','book-7d5426441e704d82','book-ab1a22b781d49446','book-e336ef7e01eea228']]])for(const id of ids)candidates[id]={verdict:'명시한 판본의 표본 관찰·분류·점토 자국과 모형 절차 대조; 표본/재료별 중복을 구별',experiments:['rock-layers-'+mode]};
candidates['book-0635790f7bf4b906']={verdict:'같은 자국/반죽 모형의 공룡 발자국 제작 변형 확인; 직접 찍기 미구현',experiments:['rock-layers-casting']};
experiments.push({id:'mole-weighing',slug:weighing.slug,mode:'weigh',title:weighing.title,sourceId:weighing.source.id,pages:weighing.source.pages,conditions:weighing.procedures.map(p=>p[1]),verdict:'기재한 판본의 계량 절차 대조; 실물 수행·교과서 전수 대조 완료 아님',publisherDeduplication:'학생·교사 교과서와 활동지의 같은 절차를 묶고, 타 출판사 시료 차이를 보존',publisherVariants:weighing.publisherVariants,assessmentSources:weighing.assessmentSources,boundary:weighing.boundary});
for(const id of weighing.candidateIds)candidates[id]={verdict:'교과서 계량 절차와 교사용 해설 대조 · 일곱 시료를 하나의 계량 실험으로 통합',experiments:['mole-weighing']};
const fork=require('../../scripts/science-tuning-fork-course.cjs');experiments.push({id:'tuning-fork-contact',slug:fork.slug,mode:'fork',title:fork.title,sourceId:fork.source.id,pages:[9,10],conditions:fork.procedures.map(p=>p[1]),verdict:'기재한 여섯 교과서·실험관찰의 소리굽쇠 관찰 절차 대조; 실물 촉각·측정 완료 아님',publisherDeduplication:'같은 소리굽쇠 전후 비교로 묶음. 종이·물·손을 각각 독립 실험으로 중복 합산하지 않음',publisherVariants:fork.publisherVariants,assessmentSources:fork.assessmentSources,boundary:fork.boundary});
for(const id of ['book-435cf0128ea8d0a8','book-72298b9a4420d2c7','book-3288b038453f6564','book-42e9dc3f88c0bc2f','book-22834d4604447c76','book-f3a9110b8f41713e'])candidates[id]={verdict:'해당 판본의 소리굽쇠 치기 전후·종이/물/손 접촉 비교를 대조하여 묶음; 트라이앵글 실물 관찰은 별도',experiments:['tuning-fork-contact']};
module.exports={basis:'같은 목적·조작 조건·관찰 결과를 대조하여 실험을 구분한다. 조건별 결과를 각각 새 실험으로 부풀리지 않는다. 출판사별 중복 검토와 교과서 전수 대조 전 전체 실험 수는 미확정이다.',experiments,candidates,missedByHeadingExtractor:['pasteur-broth','contact-game']};
