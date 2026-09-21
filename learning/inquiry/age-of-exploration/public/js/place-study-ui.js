'use strict';
window.VoyageStudyUI = (() => {
  const overlay=document.createElement('div');overlay.id='placeStudyView';overlay.hidden=true;
  overlay.innerHTML='<section id="placeStudyCard" role="dialog" aria-modal="true" aria-labelledby="placeStudyTitle"><header><h2 id="placeStudyTitle"></h2><button type="button" id="placeStudyClose" aria-label="학습 창 닫기">닫기</button></header><p id="placeStudyStatus" role="status"></p><div id="placeStudyReading"></div><form id="placeStudyForm"><div id="placeStudyQuestion"></div><button id="placeStudySubmit" type="submit"></button></form></section>';
  document.body.append(overlay);
  const $=id=>document.getElementById(id);
  let session=null,missionId='',pending=false,lastFocus=null;
  const close=()=>{overlay.hidden=true;session=null;clearKeys();lastFocus?.focus?.();};
  $('placeStudyClose').onclick=close;
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();close();}
    if(e.key==='Tab'){
      const nodes=[...overlay.querySelectorAll('button,input,a,summary')].filter(n=>!n.disabled&&n.getClientRects().length);
      if(!nodes.length)return;
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}
      else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}
    }
  });
  function draw(message=''){
    const s=session;if(!s)return;
    const total=s.questionCount||3;
    $('placeStudyTitle').textContent=s.name+(s.phase==='completed'?' · 발견 성공':'');
    $('placeStudyStatus').textContent=message || (s.phase==='completed'?total+'문제 연속 정답 · 완료':s.phase==='reading'?'설명을 읽고 문제를 시작하세요.':'연속 정답 '+s.streak+'/'+total);
    const reading=$('placeStudyReading');reading.replaceChildren();
    const body=document.createElement(s.phase==='quiz'?'details':'div');
    if(s.phase==='quiz'){const summary=document.createElement('summary');summary.textContent='설명 다시 읽기';body.append(summary);}
    const r=s.reading,figure=document.createElement('div');figure.className='photoFigure';
    if(r.image)body.append(figure);
    if(r.image){const img=document.createElement('img');img.src=r.image;img.alt=r.name+'의 모습';figure.append(img);}
    if(r.image&&r.imageCredit){const info=document.createElement('details');info.className='photoInfo';const summary=document.createElement('summary');summary.textContent='ⓘ';summary.title='사진 정보';summary.setAttribute('aria-label','사진 출처와 이용 조건');info.append(summary);figure.append(info);const caption=document.createElement('div');caption.className='photoCreditText';caption.textContent=r.imageCredit;
      for(const [name,url]of [['원본',r.imageSource],['이용 조건',r.imageLicenseUrl]])if(/^https?:\/\//.test(url||'')){const a=document.createElement('a');a.href=url;a.textContent=name;a.target='_blank';a.rel='noopener noreferrer';caption.append(' · ',a);}
      if(r.imageChanges)caption.append(' · '+r.imageChanges);info.append(caption);
    }
    if(r.todayCountry){const country=document.createElement('p');country.className='studyCredit';country.textContent='오늘날 '+r.todayCountry;body.append(country);}
    const text=document.createElement('p');text.className='studyText';text.textContent=r.text;body.append(text);reading.append(body);
    const qbox=$('placeStudyQuestion');qbox.replaceChildren();
    if(s.question){
      const title=document.createElement('h3');title.textContent=(s.streak+1)+'번 · '+s.question.prompt;
      const passage=document.createElement('p');passage.textContent=s.question.passage;qbox.append(title,passage);
      s.question.choices.forEach((choice,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='studyChoice';input.value=i;input.required=true;label.append(input,document.createTextNode(choice));qbox.append(label);});
    }
    $('placeStudySubmit').textContent=s.phase==='reading'?'설명 읽었어요 · 문제 시작':s.phase==='quiz'?'정답 확인':'계속 탐험하기';
    $('placeStudySubmit').disabled=pending;
    $('placeStudyCard').scrollTop=0;
  }
  function show(result){
    if(!result?.study)return;
    if(result.mission?.id!==activeMission?.id)return;
    if(overlay.hidden)lastFocus=document.activeElement;
    missionId=result.mission.id;session=result.study;
    applyMissionState(result.mission,result.progress,false);
    overlay.hidden=false;clearKeys();
    const total=session.questionCount||3;
    draw(result.correct===false?'오답입니다. 연속 정답은 0/'+total+'로 초기화됐어요. 설명을 다시 읽어 보세요.':result.correct===true&&session.phase!=='completed'?'정답! '+(total-session.streak)+'문제 더 맞히면 발견 성공입니다.':'');
    $('placeStudyClose').focus();
  }
  async function call(event,payload){
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
  }
  $('placeStudyForm').onsubmit=e=>{
    e.preventDefault();if(!session||pending)return;
    if(session.phase==='completed')return close();
    if(session.phase==='reading')return call('startStudyQuiz',{key:session.key});
    const choice=$('placeStudyQuestion').querySelector('input:checked');
    if(choice)call('answerStudyQuestion',{key:session.key,token:session.question.token,choice:Number(choice.value)});
  };
  function request(key){call('readStudyPlace',{key});}
  function renderTargets(container){
    container.replaceChildren();
    const guide=document.createElement('p');guide.textContent=activeMission.phase==='running'?'원하는 순서로 방문하세요. 도시는 입장한 뒤 학습할 수 있습니다.':'출발 신호를 기다리세요.';container.append(guide);
    for(const target of activeMission.studyTargets){
      const state=missionProgress?.studyPlaces?.find(p=>p.key===target.key),b=document.createElement('button');b.type='button';b.className='studyTargetButton';b.dataset.studyKey=target.key;
      b.textContent=(state?.phase==='completed'?'✓ ':'')+target.name+' · '+(state?.phase==='completed'?'완료':state?.phase==='quiz'?'문제 이어 풀기':'도착 확인 · 설명 읽기');
      b.disabled=activeMission.phase!=='running';b.onclick=()=>request(target.key);container.append(b);
    }
  }
  socket.on('missionPublished',()=>{if(missionId!==activeMission?.id)close();});
  socket.on('missionCleared',close);
  return {show,request,renderTargets,isOpen:()=>!overlay.hidden};
})();
