const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
function edit(file,replace){
  const target=path.join(project,file),original=fs.readFileSync(target,'utf8');
  let source=original.replace(/\r\n/g,'\n');
  for(const [before,after]of replace){
    if(!source.includes(before))throw Error('Missing edit in '+file+': '+before.slice(0,100));
    source=source.replace(before,after);
  }
  fs.writeFileSync(target,original.includes('\r\n')?source.replace(/\n/g,'\r\n'):source);
}
edit('public/js/place-study-ui.js',[
  ["  let session=null,missionId='',pending=false,lastFocus=null;\n  const close=()=>{overlay.hidden=true;session=null;clearKeys();lastFocus?.focus?.();};",`  let session=null,missionId='',pending=false,lastFocus=null,requestId=0,needsSync=false;
  function close(){
    const wasOpen=!overlay.hidden;
    ++requestId;pending=false;needsSync=false;overlay.hidden=true;session=null;missionId='';
    if(wasOpen){clearKeys();lastFocus?.focus?.();}
  }
  function updateControls(){
    const s=session;if(!s)return;
    const button=$('placeStudySubmit');
    button.textContent=needsSync?'진행 다시 불러오기':s.phase==='reading'?'설명 읽었어요 · 문제 시작':s.phase==='quiz'?'정답 확인':'계속 탐험하기';
    button.disabled=pending||(needsSync&&(!socket.connected||!connectionReady));
    button.formNoValidate=needsSync;
    for(const input of $('placeStudyQuestion').querySelectorAll('input'))input.disabled=pending||needsSync;
    $('placeStudyForm').setAttribute('aria-busy',String(pending));
  }
  function report(message){
    if(overlay.hidden)showToast(message,'warn');else $('placeStudyStatus').textContent=message;
  }`],
  ["    $('placeStudySubmit').textContent=s.phase==='reading'?'설명 읽었어요 · 문제 시작':s.phase==='quiz'?'정답 확인':'계속 탐험하기';\n    $('placeStudySubmit').disabled=pending;","    updateControls();"],
  ['  function show(result){','  function show(result,recovered=false){'],
  ['    if(overlay.hidden)lastFocus=document.activeElement;','    if(overlay.hidden)lastFocus=document.activeElement;\n    ++requestId;pending=false;needsSync=false;'],
  ["    draw(result.correct===false?'오답입니다. 연속 정답은 0/'+total+'로 초기화됐어요. 설명을 다시 읽어 보세요.':result.correct===true&&session.phase!=='completed'?'정답! '+(total-session.streak)+'문제 더 맞히면 발견 성공입니다.':'');",`    const restored=recovered&&session.phase!=='completed'?'진행을 불러왔어요. 연속 정답 '+session.streak+'/'+total+(session.phase==='reading'?' · 설명을 다시 읽어 보세요.':''):'';
    draw(restored||(result.correct===false?'오답입니다. 연속 정답은 0/'+total+'로 초기화됐어요. 설명을 다시 읽어 보세요.':result.correct===true&&session.phase!=='completed'?'정답! '+(total-session.streak)+'문제 더 맞히면 발견 성공입니다.':''));`],
  [`  async function call(event,payload){
    if(pending)return;
    pending=true;$('placeStudySubmit').disabled=true;
    const sentMission=activeMission?.id;
    try{
      const result=await new Promise((resolve,reject)=>socket.timeout(7000).emit(event,{...payload,missionId:sentMission},(e,r)=>e?reject(e):resolve(r)));
      if(sentMission!==activeMission?.id){close();return;}
      if(!result?.ok){if(overlay.hidden)showToast(result?.error||'학습을 시작하지 못했습니다.','warn');else $('placeStudyStatus').textContent=result?.error||'다시 시도하세요.';return;}
      show(result);
    }catch{$('placeStudyStatus').textContent='연결을 확인한 뒤 다시 시도하세요.';}
    finally{pending=false;$('placeStudySubmit').disabled=false;}
  }`, `  async function call(event,payload,recovered=false){
    if(pending)return;
    if(!socket.connected||!connectionReady){
      needsSync=!!session;report('연결되면 저장된 진행을 불러옵니다.');updateControls();return;
    }
    const id=++requestId,sentMission=activeMission?.id;
    const current=()=>id===requestId&&sentMission===activeMission?.id;
    let recover=false;
    pending=true;updateControls();
    try{
      const result=await new Promise((resolve,reject)=>socket.timeout(7000).emit(event,{...payload,missionId:sentMission},(e,r)=>e?reject(e):resolve(r)));
      if(!current())return;
      if(!result?.ok){
        needsSync=!!session;recover=!!session&&event!=='readStudyPlace';
        report(result?.error||'진행을 다시 불러오세요.');
      }else show(result,recovered);
    }catch{
      if(!current())return;
      needsSync=!!session;recover=!!session&&event!=='readStudyPlace';
      report('응답을 받지 못했어요. 진행을 다시 불러오세요.');
    }finally{
      if(current()){pending=false;updateControls();}
    }
    // An answer may already be saved. Read its outcome; never resend it automatically.
    if(current()&&recover)restore();
  }
  function restore(){
    if(!session||overlay.hidden)return;
    if(missionId!==activeMission?.id)return close();
    needsSync=true;report('저장된 진행을 불러오는 중…');
    return call('readStudyPlace',{key:session.key},true);
  }
  function connectionLost(){
    ++requestId;pending=false;
    if(session&&session.phase!=='completed'){
      needsSync=true;report('연결되면 저장된 진행을 불러옵니다.');updateControls();
    }
  }
  function connectionRestored(){
    if(missionId&&missionId!==activeMission?.id)return close();
    if(session&&session.phase!=='completed')return restore();
  }`],
  ['    e.preventDefault();if(!session||pending)return;','    e.preventDefault();if(!session||pending)return;\n    if(needsSync)return restore();'],
  ["  return {show,request,renderTargets,isOpen:()=>!overlay.hidden};","  socket.on('disconnect',connectionLost);\n  return {show,request,renderTargets,close,connectionLost,connectionRestored,isOpen:()=>!overlay.hidden};"]
]);
edit('public/index.html',[
  ["if(!resumeToken){connectionReady=false;joined=false;join.style.display='grid';","if(!resumeToken){window.VoyageStudyUI?.close();connectionReady=false;joined=false;join.style.display='grid';"],
  ["  resumePending=true;connectionReady=false;net.textContent='● 연결 복구 중';","  resumePending=true;connectionReady=false;window.VoyageStudyUI?.connectionLost();net.textContent='● 연결 복구 중';"],
  ["if(!result?.ok){joined=false;connectionReady=false;join.style.display='grid';","if(!result?.ok){window.VoyageStudyUI?.close();joined=false;connectionReady=false;join.style.display='grid';"],
  ["  nearbyGroup.hidden=roomType==='free';\n  if(!resumed)","  nearbyGroup.hidden=roomType==='free';\n  if(resumed)window.VoyageStudyUI?.connectionRestored();else window.VoyageStudyUI?.close();\n  if(!resumed)"],
  ['<script src="/learn/world-voyage/js/place-study-ui.js"></script>','<script src="/learn/world-voyage/js/place-study-ui.js?v=90"></script>']
]);
console.log('Study recovery UI and reconnect hook updated.');
