const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
const out='docs/science-lab-audit-2026-09-20/';
const rows=require('../'+out+'required-core-review.cjs');
edit(out+'current-review.cjs',s=>{
 let lines=s.split('\n');
 for(const r of rows){const index=lines.findIndex(l=>l.startsWith(r.slug+'|'));const line=r.slug+'|'+r.current+'; 기존 앱 관찰 유지|'+r.boundary;if(index>=0)lines[index]=line;else lines.splice(lines.length-2,0,line);}
 return lines.join('\n');
});
const overrides=`
4과01#1|lever-balance|부분|밀고 당기기 전후 움직임 모형을 추가했다. 무거운 물체/가벼운 물체의 힘 비교 실측은 별도이다.
4과05#1|weight-compare|모의활동|같은 고체·액체를 다른 모양의 용기에 옮겨 모양·부피의 변화를 비교한다.
4과05#2|weight-compare|모의활동|거꾸로 넣은 컵의 공기를 뺀 뒤 물이 들어가는 모습을 비교한다.
4과10#2|state-change|모의활동|증발과 끓음의 전후 모습과 공통점을 비교한다. 실제 증발량·가열 시간 측정은 아니다.
4과10#3|state-change|모의활동|차가운 색 물 컵 바깥의 무색 물방울을 비교하여 공기 중 수증기 응결을 설명한다.
4과12#1|microbes|부분|버섯·곰팡이의 형태 비교 그림을 추가했다. 실제 표본 관찰은 별도이다.
4과12#2|microbes|부분|초4 해캄·짚신벌레의 확대 설명 그림을 비교한다. 정지 그림은 실제 운동·현미경 관찰을 대신하지 않는다.
6과02#1|light-shadow|모의활동|어둠상자에 빛이 들어오기 전후 물체가 보이는 조건과 광원→물체→눈의 경로를 비교한다.
6과02#3|light-shadow|모의활동|초5 볼록·오목 렌즈를 지나는 빛의 모임·퍼짐을 정성 비교한다. 실제 광선 측정은 별도이다.
6과03#2|solubility|모의활동|기존 온도 비교에 같은 양·온도의 물과 같은 무게의 소금/설탕을 넣은 용해량 비교를 추가했다.
6과03#3|solubility|모의활동|초5 설탕과 물의 양을 바꾸어 같은 물체가 뜨는 정도를 비교한다. 밀도·부력 계산은 제외했다.
6과12#1|seasons|모의활동|초6 태양을 향한 지점/반대쪽 지점의 낮밤 모형을 추가했다.
6과12#2|seasons|부분|초6 계절별 대표 별자리 설명 그림을 추가했다. 실제 천체 관측 프로그램과 동일한 것으로 세지 않는다.
9과02#1|cell-structure|부분|중1 동물·식물 표본의 모형, 배율·염색·구조 비교 화면 신설. 실제 표본 관찰은 별도이다.
9과04#2|diffusion|부분|중1 입자 배열과 보존되는 입자 수를 비교한다. 실제 질량·부피 수치 측정은 별도이다.
9과04#3|diffusion|부분|중1 순수한 물의 이상적 가열 곡선을 구간별로 해석한다. 학생의 실측·직접 곡선 작성은 별도이다.
9과06#1|diffusion|모의활동|중1 같은 기체 양에서 온도/압력을 통제한 피스톤 정성 모형을 추가했다.
9과10#1|refraction|모의활동|중2 여러 거울·렌즈의 상 방향과 크기를 두 대표 물체 위치에서 비교한다.
9과11#1|flame-ions|부분|중2 1족/18족 유사성 시범 자료의 설명 그림을 추가했다. 직접 금속 반응 실험은 아니다.
9과14#2|ohms-law|모의활동|중2 코일 전류 방향·세기와 자석의 극을 바꾸어 자기장과 상호작용을 비교한다.
9과17#2|weather-front|부분|중3 팽창/압축과 수증기 조건에 따른 구름 모형을 추가했다. 디지털 센서 실험을 했다는 뜻은 아니다.
9과19#1|motion-energy|모의활동|중3 질량별 자유 낙하의 시간·속력을 이론값으로 비교한다. 실제 촬영 자료는 아니다.
9과19#2|motion-energy|모의활동|중3 자유 낙하의 위치·운동 에너지 합을 비교한다. 공기 저항 없는 이론 모형이다.
9과21#1|pea-genetics|부분|중3 체세포분열/생식세포 형성의 염색체 행동 모형을 추가했다. 실물 분열 표본 관찰은 별도이다.
10통과1-03#5|cell-membrane|모의활동|고1 효소 작용의 생감자·가열한 감자·물 대조군을 비교한다. 속도식·Km은 제외했다.
10통과2-01#3|neutralization-common|모의활동|고1 같은 농도·전체 부피의 혼합 비율별 가상 온도와 그래프 신설. 실측 자료와 구별한다.
10통과2-02#4|energy-conversion|모의활동|고1 자석/코일의 상대 운동·정지·극·빠르기에 따른 유도 전류의 정성 비교를 추가했다.
`.trim().split('\n');
edit(out+'current-activity-overrides.cjs',s=>{let lines=s.split('\n');for(const line of overrides){const id=line.split('|')[0],i=lines.findIndex(l=>l.startsWith(id+'|'));if(i>=0)lines[i]=line;else lines.splice(lines.length-2,0,line);}return lines.join('\n');});
edit(lab+'supplement-core.js',s=>replace(s,'const n=end&&mei?2:4','const n=(end||middle)&&mei?2:4'));
const titles={microbes:'균류·원생생물·세균 관찰',solubility:'용해량과 용액 진하기',refraction:'거울·렌즈와 빛의 반사·굴절','weight-compare':'물체의 무게와 세 가지 상태','volcano-model':'화산과 화성암 관찰','lever-balance':'힘의 작용과 지레',seasons:'태양 고도·계절과 지구의 운동',diffusion:'입자 운동·상태 변화·기체','weather-front':'전선과 구름 생성','motion-energy':'자유 낙하·빗면과 에너지','ohms-law':'전기 회로·정전기·코일','burning-conditions':'연소와 물질의 변화','mass-ratio':'화학 반응의 질량·부피 관계','pea-genetics':'세포분열과 멘델 유전','cell-membrane':'세포막과 효소 작용','flame-ions':'원소의 성질과 이온'};
edit('scripts/sync-science-catalog.cjs',s=>replace(s,"for(const [slug,codes]of Object.entries(additions))","Object.assign(titles,"+JSON.stringify(titles)+");\nfor(const [slug,codes]of Object.entries(additions))"));
edit('scripts/build-current-science-audit.cjs',s=>{
 s=s.replace(/\b102\b/g,'104').replace(/\b408\b/g,'416').replace('104개 기존 앱을 대상으로 했다.','기존 102개 앱과 필수 관찰용 신규 2개 앱을 대상으로 했다.');
 s=replace(s,"out+'/current-review.cjs',","out+'/required-core-review.cjs',out+'/current-review.cjs',");
 s=replace(s,'공통 탐구 16개 앱과 몸 기관의 뼈·근육 모형 1개 앱을 추가했다. 그림 비교·정성 모형·실제 실험 안내는 서로 구분했다.','기존 공통 탐구에 더해 22개 앱 경로에서 필수 성취내용의 누락을 보완했다(기존 20개·신규 2개). 관찰 확인 문제도 추가했다. 그림·정성 모형·가상 자료와 실제 실험은 구분했다.');
 s=replace(s,'- 초등: 행성의 특징, 해캄·짚신벌레·버섯 표본, 용질 종류·농도별 비교, 산/염기와 탄산칼슘·단백질 반응, 낮밤·계절 별자리의 해당 학년용 경로.','- 이번 보완: 생물 관찰, 용해량·진하기, 산/염기의 물질 반응, 물의 상태 변화, 거울·렌즈, 세포·분열·효소, 자유 낙하, 코일·발전, 공통과목 중화 등. [필수 내용 보완 상세](required-core.md)에서 범위·근거·경계를 확인한다.');
 s=replace(s,'- 중등: 세포 기본 구조·발생의 해당 학년용 경로, 여러 거울·렌즈, 코일 주변 자기장, 디지털 구름 발생, 실제 광원·온도·해수 자료 측정.','- 남는 경계: 실제 생물·암석 표본, 현미경·센서·저울 실측, 천체 관측 프로그램, 장치 제작·실험 설계·연속 관찰은 모형을 클릭하는 것으로 완료되지 않는다.');
 return s;
});
edit('package.json',s=>replace(s,'"test:science-models": "node --test tests/science-supplement-models.test.cjs",','"test:science-models": "node --test tests/science-supplement-models.test.cjs",\n    "test:science-required": "node --test tests/science-required-core.test.cjs",'));
apply();
