const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
function edit(file,changes){
  const target=path.join(project,file),original=fs.readFileSync(target,'utf8');let source=original.replace(/\r\n/g,'\n');
  for(const[before,after]of changes){if(!source.includes(before))throw Error('Missing edit '+file+': '+before.slice(0,80));source=source.replace(before,after);}
  fs.writeFileSync(target,original.includes('\r\n')?source.replace(/\n/g,'\r\n'):source);
}
edit('public/js/place-study-ui.js',[
  ["    const id=++requestId,sentMission=activeMission?.id;","    const id=++requestId,sentMission=activeMission?.id;\n    missionId=sentMission;"],
  ["needsSync=true;report('연결되면 저장된 진행을 불러옵니다.');updateControls();\n    }\n  }","needsSync=true;report('연결되면 저장된 진행을 불러옵니다.');\n    }\n    updateControls();\n  }"],
  ["  function connectionRestored(){\n    if(missionId&&missionId!==activeMission?.id)return close();","  function missionChanged(){\n    if(missionId&&missionId!==activeMission?.id)close();\n  }\n  function connectionRestored(){\n    missionChanged();"],
  ["  socket.on('missionPublished',()=>{if(missionId!==activeMission?.id)close();});","  socket.on('missionPublished',missionChanged);"],
  ["return {show,request,renderTargets,close,connectionLost,connectionRestored,isOpen:","return {show,request,renderTargets,close,missionChanged,connectionLost,connectionRestored,isOpen:"]
]);
edit('public/index.html',[
  ["activeMission=mission||null;missionProgress=mergePendingStartChoice(progress)||null;","activeMission=mission||null;window.VoyageStudyUI?.missionChanged();missionProgress=mergePendingStartChoice(progress)||null;"]
]);
edit('tests/place-study-recovery-ui.js',[
  ["context.activeMission=mission;context.missionProgress=progress;","context.activeMission=mission;context.window.VoyageStudyUI?.missionChanged();context.missionProgress=progress;"],
  ["  console.log(JSON.stringify({ok:true,cases,",`  {
    const f=fixture();f.ui.close();f.ui.request(f.target.key);const request=f.take('readStudyPlace'),saved=f.process(request);
    f.context.applyMissionState({id:'mission-2'},{});f.reply(request,saved);await flush();assert.equal(f.ui.isOpen(),false);
    f.ui.request(f.target.key);f.reply(f.take('readStudyPlace'));await flush();assert.equal(f.ui.isOpen(),true,'a changed mission cannot leave a hidden request locked');cases++;
  }
  console.log(JSON.stringify({ok:true,cases,`]
]);
edit('package.json',[
  ['node tests/place-study-unit.js && node tests/place-study-smoke.js','node tests/place-study-unit.js && node tests/place-study-recovery-ui.js && node tests/place-study-smoke.js'],
  ['&& npm run test:view-motion && npm run test:ice-visual"','&& npm run test:view-motion && npm run test:ice-visual && npm run test:place-study"']
]);
edit('MISSION-AUDIT-20260923.md',[
  ['이 점검에서는 제품 코드를 변경하지 않았다.','최초 점검 뒤 응답 누락·재접속 시 학습 진행 복구를 수정했다. 아래에 수정 결과와 남은 과제를 구분했다.'],
  ['## 보완이 필요한 사항',`## 수정한 사항 — 학습 진행 복구

- 답안 제출 또는 문제 시작 응답이 누락되면 \`readStudyPlace\`로 서버에 저장된 현재 문제를 다시 읽는다. 답안은 자동 재전송하지 않는다.
- 실제 접속이 끊겼을 때는 학생의 재입장이 완료된 뒤 문제를 복구한다. 정답, 오답 초기화, 세 번째 정답의 완료 상태를 모두 복원한다.
- 복구 요청도 실패하면 이전 답안 입력을 막고 '진행 다시 불러오기' 버튼을 제공한다. 현장 도착·도시 입장·일시정지 등 기존 서버 검증을 그대로 거친다.
- 창을 닫거나 미션이 교체·종료되면 이전 요청의 늦은 응답을 무시한다. 재입장이 불가능하면 학습 창을 닫아 방 입장 화면을 가리지 않는다.
- \`tests/place-study-recovery-ui.js\`의 15가지 사례와 실제 Chrome 교사·학생 화면의 9가지 장애 시나리오를 통과했다. 정답 처리 후 접속을 끊고 다시 접속해 다음 문제로 이어졌고, 마지막 정답의 응답 누락 후에도 세 곳 완료와 순위 1위를 확인했다.
- 변경 위치: \`public/js/place-study-ui.js\`, \`public/index.html\`. 로컬 검증이며 이 수정의 배포는 수행하지 않았다.

## 보완이 필요한 사항`],
  ["1. **서버가 답안을 처리한 뒤 응답만 누락되면 학생 화면이 이전 문제에 남는다.** \`public/js/place-study-ui.js\`의 요청 실패 처리는 오류 문구만 바꾼다. 서버 기록은 1연속 정답인데 화면은 여전히 1번 문항이어서, 재제출하면 '현재 문제의 답을 선택하세요.'가 반복된다. 실제 브라우저에서 답안 처리 후 응답 오류를 주입하여 재현했다. 창을 닫고 발견물 설명을 다시 열면 수동 복구된다. 실패·재접속 시 서버의 현재 문제를 다시 읽는 처리가 필요하다.\n2.","1."],
  ['3. **넓은 지형의 도착 범위','2. **넓은 지형의 도착 범위'],
  ['- `.tmp/voyage-mission-audit/result.json`:','- `.tmp/voyage-study-recovery/result.json`: 수정 후 실제 브라우저의 응답 누락·재접속·복구 재시도·늦은 응답 무시·세 곳 완료 결과.\n- `.tmp/voyage-mission-audit/result.json`:'],
  ['권장 우선순위는 응답 누락 자동 복구, 학습 문항 개선, 넓은 지형 영역 판정 순이다.','응답 누락 자동 복구는 수정했다. 남은 과제의 우선순위는 학습 문항 개선, 넓은 지형 영역 판정 순이다.']
]);
console.log('Recovery lifecycle, regression suite, and audit record updated.');
