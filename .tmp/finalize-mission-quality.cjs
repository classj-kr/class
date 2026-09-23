const fs=require('node:fs'),path=require('node:path');const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
if(!process.argv.includes('--report')){
 let load=fs.readFileSync(path.join(__dirname,'voyage-mission-audit/class-load.cjs'),'utf8');
 load=load.replace("['discovery:batur-caldera','city:lisbon','discovery:milford-sound']","['discovery:andes','discovery:alps','discovery:sahara']").replace("[[0,{lat:-8.24,lon:115.38}],[1,{city:'리스본'}],[2,{lat:-44.62,lon:167.75,mode:'sea'}]]","[[0,{lat:-33,lon:-70}],[1,{lat:47,lon:13}],[2,{lat:26,lon:-5}]]").replace(".tmp/voyage-mission-audit/class-result.json",".tmp/voyage-region-ui/class-result.json");
 fs.writeFileSync(path.join(__dirname,'voyage-region-ui/class-load.cjs'),load);
 const p=path.join(base,'package.json');let pkg=fs.readFileSync(p,'utf8');
 pkg=pkg.replace('node --check lib/place-study.js &&','node --check lib/place-study.js && node --check lib/study-question-builder.js && node --check lib/study-concepts.js && node --check lib/study-question-bank.js && node --check lib/discovery-access.js && node --check lib/discovery-regions.js &&').replace("'arrival-zones','ship-origins'","'arrival-zones','ship-origins','discovery-regions'");fs.writeFileSync(p,pkg);
 console.log('Region classroom load check and syntax checks prepared.');
}else{
 const load=JSON.parse(fs.readFileSync(path.join(__dirname,'voyage-region-ui/class-result.json')));
 const browser=JSON.parse(fs.readFileSync(path.join(__dirname,'voyage-region-ui/result.json')));
 if(!load.ok||load.completed!==33||!browser.ok)throw Error('Checks are not complete');
 const p=path.join(base,'MISSION-AUDIT-20260923.md');let report=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
 report=report.replace('최초 점검 뒤 응답 누락·재접속 시 학습 진행 복구를 수정했다. 아래에 수정 결과와 남은 과제를 구분했다.','최초 점검에서 발견한 학습 진행 복구, 문항 생성, 넓은 지형의 도착 판정을 수정했다. 아래는 수정 내용과 검증 범위다.');
 const begin=report.indexOf('## 보완이 필요한 사항'),end=report.indexOf('## 검증 자료');
 const replacement=[
 '## 수정한 사항 — 문항 품질',
 '',
 '- 다른 장소의 문장 뒷부분을 임의의 오답으로 섞는 방식과 학습 창 제목의 장소 이름을 정답으로 묻는 방식을 제거했다.',
 '- 같은 주제의 개념끼리 비교하는 보기로 구성하고 설명의 서로 다른 사실을 우선 출제한다. 짧은 설명에서도 같은 문장의 다른 사실을 확인할 수 있어 장소 이름으로 문항 수를 채우지 않는다.',
 '- 밀퍼드사운드·바투르·알프스·안데스·사하라 등 22곳은 형성 과정, 지형 특징, 건축 목적과 같은 핵심 내용을 묻는 문항을 직접 작성했다.',
 '- 575곳 전체의 세 문항 생성, 네 보기의 중복 없음, 정답과 설명의 연결, 제목 및 지문에 정답이 드러나는 빈칸 배제를 검사했다. 모든 문항을 개별 교육 평가로 심사했다는 뜻은 아니다.',
 '- 개선된 문항은 새로 발행한 미션에 적용한다. 진행 중인 미션의 발행된 문항과 정답 순서는 유지한다.',
 '',
 '## 수정한 사항 — 넓은 지형 도착',
 '',
 '- 산맥·사막·고원·지구대 19곳에 Natural Earth의 지형 영역을 연결했다. 해당 영역의 육지에서는 중심 표식으로부터 멀어도 학습을 시작할 수 있다.',
 '- 자료: [Natural Earth Physical Labels](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-physical-labels/). 원본 URL, 내려받은 날, SHA-256, 좌표는 data/catalog/discovery-regions.json에 기록했다. 이 경계는 일반화한 학습용 영역이며 정밀한 지형 경계는 아니다.',
 '- 영역 밖, 도시 내부, 이동 전환 중, 산맥을 배로 통과하는 경우는 거부한다. 나미브 해안의 배 접근과 카스피해 해안 접근은 유지한다.',
 '- 지정된 미션 지형을 우선 보여 주되 완료한 넓은 지형이 가까운 개별 발견물을 가리지 않도록 했다. 육상 지형 표식은 지도에 고정하고 영역 안에서 살펴보기 버튼이 활성화된다.',
 '- 19곳의 원래 위치와 중심점에서 멀리 떨어진 9곳을 검사했다. 실제 Chrome의 데스크톱·모바일에서 안데스·알프스·사하라 세 곳의 설명 읽기, 3연속 정답, 완주와 교사 순위를 확인했다.',
 '- 모의 학생 33명이 이 세 지형에서 총 297개 정답을 제출했다. 33명 완료와 중복 없는 1~33위를 확인했다. 로컬 최대 요청 응답 시간은 '+load.maxLocalAckMs+'ms였다.',
 '',
 '## 적용 상태와 검증 한계',
 '',
 '- 코드 수정과 로컬 검증 완료. 이번 수정의 배포는 수행하지 않았다.',
 '- 학생 위치는 검증용 IPC로 배치했다. 세계 모든 항로를 실제 조작해 검증하거나 학교 네트워크의 품질을 검증한 결과는 아니다.',
 '',
 ].join('\n');
 if(begin<0||end<begin)throw Error('Audit section missing');report=report.slice(0,begin)+replacement+report.slice(end);
 report=report.replace('- `.tmp/voyage-study-recovery/result.json`:','- `.tmp/voyage-region-ui/result.json`: 넓은 지형 세 곳의 실제 교사·학생 화면 완료 결과.\n- `.tmp/voyage-region-ui/class-result.json`: 넓은 지형에서 33명 모의 수업 완료 및 순위 결과.\n- `.tmp/voyage-study-recovery/result.json`:');
 report=report.replace('응답 누락 자동 복구는 수정했다. 남은 과제의 우선순위는 학습 문항 개선, 넓은 지형 영역 판정 순이다.','최초 점검에서 확인한 세 항목의 수정 및 위 범위의 회귀 검증을 완료했다.');
 fs.writeFileSync(p,report);console.log('Mission audit updated with verified results.');
}
