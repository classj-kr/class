/* Device measurements stay in this page; no upload, storage or background capture. */
(() => {
 const slug=location.pathname.split('/').filter(Boolean).filter(x=>x!=='index.html').at(-1);
 if(!['measurement','wave-transfer'].includes(slug))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('digital-inquiry.css?v=1',document.currentScript.src);document.head.append(css);
 const panel=document.createElement('section');panel.className='panel digital-inquiry';
 const isMeasure=slug==='measurement';
 panel.innerHTML=`<h2>${isMeasure?'직접 측정하고 비교하기':'소리 파형 분석'}</h2>
 ${isMeasure?`<div class="digital-grid"><section><h3>시간 측정</h3><p>같은 동작에 걸리는 시간을 여러 번 재어 비교하세요.</p><output data-time>0.00 s</output><div class="digital-actions"><button data-timer-start>시작</button><button data-timer-stop disabled>정지·기록</button></div><p class="digital-note">기기 시계로 잰 시간입니다. 시작·정지 버튼을 누르는 반응 시간이 포함됩니다.</p></section>
 <section><h3>길이 측정</h3><p>실제 자의 5 cm와 파란 막대 길이가 같도록 맞추세요.</p><div class="calibration-bar" data-calibration-bar></div><label>기준 막대 길이 조절<input data-calibration type="range" min="80" max="280" value="180"></label><button data-calibrate>실제 자와 맞춤 확인</button><p data-calibration-status role="status">먼저 실제 자로 보정하세요.</p><div class="measured-ruler"><span data-length-mark></span></div><label>물체 끝 위치<input data-length type="range" min="0" max="280" value="100"></label><output data-length-value>보정 필요</output><button data-length-record disabled>길이 기록</button><p class="digital-note">물체 왼쪽 끝을 눈금의 시작에 맞추고 끝 표시를 조절합니다. 화면 확대·기기 방향을 바꾸면 다시 보정하세요. 정밀 계측용이 아닙니다.</p></section></div>`:''}
 <section><h3>${isMeasure?'생활 소리의 실시간 변화':'진폭·진동수·파형 비교'}</h3><p>연습 신호를 바꾸어 파형을 비교하거나, 마이크를 허용해 주변 소리를 측정하세요.</p>
 <div class="digital-grid digital-sound-controls"><label>연습 신호 진동수<select data-frequency><option value="220">220 Hz</option><option value="440" selected>440 Hz</option><option value="880">880 Hz</option></select></label><label>연습 신호 진폭<select data-amplitude><option value="0.1">0.1</option><option value="0.3" selected>0.3</option><option value="0.6">0.6</option></select></label><label>연습 파형<select data-wave><option value="sine">사인파</option><option value="triangle">삼각파</option><option value="square">사각파</option></select></label></div>
 <div class="digital-actions"><button data-signal>연습 신호 분석</button><button data-microphone>마이크로 측정</button><button data-audio-stop disabled>측정 중지</button><button data-audio-record disabled>현재 값 기록</button></div>
 <p data-audio-status role="status">측정 전 — 마이크는 사용하지 않습니다.</p><svg class="digital-waveform" viewBox="0 0 600 240" role="img" aria-label="소리의 시간별 상대 진폭"><path d="M45 25V200H575" fill="none" stroke="#79929e"/><path data-wave-path d="M45 112H575" fill="none" stroke="#277b89" stroke-width="2"/><text x="45" y="223">0</text><text data-duration x="450" y="223">시간 (ms)</text><text x="48" y="18">상대 진폭</text></svg><p data-audio-reading>아직 측정값이 없습니다.</p>
 <p class="digital-note">연습 신호는 기기에서 합성하며 스피커로 재생하지 않습니다. 마이크 값은 기기·자동 음량 조절에 영향을 받는 상대 진폭이며 소음계의 dB 값이 아닙니다. 가장 강한 주파수 성분이 소리의 기본 진동수와 다를 수 있습니다. 오디오는 저장·전송하지 않으며 중지하거나 화면을 벗어나면 마이크를 끕니다.</p></section>
 <section><h3>측정 기록</h3><div class="digital-actions"><button data-export>기록 내려받기</button><button data-clear>기록 비우기</button></div><p data-summary>기록이 없습니다.</p><div class="digital-table"><table><thead><tr><th>종류</th><th>값</th><th>조건</th></tr></thead><tbody data-records></tbody></table></div><p class="digital-note">기록은 이 페이지에서만 유지됩니다. 새로고침 전에 내려받으세요. 시간·길이·상대 진폭은 단위가 달라 서로 평균 내지 않습니다.</p></section>`;
 const anchor=document.querySelector('.meaning-panel,.interpretation,.quiz-section');if(anchor)anchor.before(panel);else document.querySelector('main').append(panel);
 const at=s=>panel.querySelector(s),el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
 panel.querySelectorAll('button').forEach(b=>b.type='button');
 let records=[],timerStart=null,timerFrame=0,calibrated=false,context=null,stream=null,source=null,analyser=null,mute=null,gain=null,audioFrame=0,epoch=0,active=false,last=null,kind='';
 function record(kind,value,unit,condition){records.push({kind,value,unit,condition,at:new Date().toISOString()});renderRecords();}
 function renderRecords(){at('[data-records]').replaceChildren(...records.map(r=>{const tr=document.createElement('tr');tr.append(el('td',r.kind),el('td',r.value+' '+r.unit),el('td',r.condition));return tr;}));const groups=new Map();for(const r of records){const key=r.kind+' ('+r.unit+')';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r.value);}at('[data-summary]').textContent=records.length?[...groups].map(([key,v])=>key+': '+v.length+'회, 평균 '+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(3)).join(' · '):'기록이 없습니다.';}
 at('[data-clear]').onclick=()=>{records=[];renderRecords();};
 at('[data-export]').onclick=()=>{if(!records.length){at('[data-summary]').textContent='내려받을 기록이 없습니다.';return;}const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,records},null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='science-measurements.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 if(isMeasure){
  const tick=()=>{if(timerStart===null)return;at('[data-time]').textContent=((performance.now()-timerStart)/1000).toFixed(2)+' s';timerFrame=requestAnimationFrame(tick);};
  at('[data-timer-start]').onclick=()=>{timerStart=performance.now();at('[data-timer-start]').disabled=true;at('[data-timer-stop]').disabled=false;tick();};
  at('[data-timer-stop]').onclick=()=>{if(timerStart===null)return;const seconds=(performance.now()-timerStart)/1000;timerStart=null;cancelAnimationFrame(timerFrame);at('[data-time]').textContent=seconds.toFixed(2)+' s';at('[data-timer-start]').disabled=false;at('[data-timer-stop]').disabled=true;record('시간',+seconds.toFixed(3),'s','기기 시계·수동 시작/정지');};
  function showLength(){const pixels=+at('[data-calibration]').value,end=+at('[data-length]').value;at('[data-calibration-bar]').style.width=pixels+'px';at('[data-length-mark]').style.left=end+'px';at('[data-length-value]').textContent=calibrated?(end/pixels*5).toFixed(2)+' cm':'보정 필요';at('[data-length-record]').disabled=!calibrated;}
  const invalidate=()=>{calibrated=false;at('[data-calibration-status]').textContent='실제 자로 다시 보정하세요.';showLength();};
  at('[data-calibration]').oninput=invalidate;at('[data-calibrate]').onclick=()=>{calibrated=true;at('[data-calibration-status]').textContent='실제 자와 맞춘 기준을 적용했습니다.';showLength();};at('[data-length]').oninput=showLength;
  at('[data-length-record]').onclick=()=>{if(calibrated)record('길이',+(+at('[data-length]').value/+at('[data-calibration]').value*5).toFixed(2),'cm','실제 자 5 cm로 화면 보정');};
  window.addEventListener('resize',invalidate);window.visualViewport?.addEventListener('resize',invalidate);showLength();
 }
 function stopAudio(message='측정을 중지했습니다. 마이크는 꺼졌습니다.'){
  epoch++;active=false;cancelAnimationFrame(audioFrame);stream?.getTracks().forEach(t=>t.stop());stream=null;
  try{source?.stop?.();}catch{}source?.disconnect();gain?.disconnect();analyser?.disconnect();mute?.disconnect();source=gain=analyser=mute=null;
  const old=context;context=null;if(old&&old.state!=='closed')old.close().catch(()=>{});
  at('[data-audio-stop]').disabled=true;at('[data-audio-record]').disabled=true;at('[data-audio-status]').textContent=message;
 }
 function settings(){if(kind!=='연습 신호'||!source||!context)return;source.frequency.setValueAtTime(+at('[data-frequency]').value,context.currentTime);source.type=at('[data-wave]').value;gain.gain.setValueAtTime(+at('[data-amplitude]').value,context.currentTime);}
 for(const s of ['[data-frequency]','[data-amplitude]','[data-wave]'])at(s).onchange=settings;
 async function startAudio(microphone){
  stopAudio('분석을 준비하고 있습니다.');const token=epoch;at('[data-audio-stop]').disabled=false;
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unsupported');
   const ctx=new Audio();context=ctx;await ctx.resume();if(token!==epoch){if(ctx.state!=='closed')await ctx.close();return;}
   if(microphone){if(!navigator.mediaDevices?.getUserMedia)throw Error('unsupported');const acquired=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});if(token!==epoch){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;source=ctx.createMediaStreamSource(stream);kind='마이크';}
   else{source=ctx.createOscillator();gain=ctx.createGain();source.connect(gain);kind='연습 신호';settings();}
   analyser=ctx.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=0;mute=ctx.createGain();mute.gain.value=0;(microphone?source:gain).connect(analyser);analyser.connect(mute);mute.connect(ctx.destination);if(!microphone)source.start();active=true;last=null;
   at('[data-audio-stop]').disabled=false;at('[data-audio-status]').textContent=microphone?'마이크 측정 중 — 이 기기 안에서만 분석합니다.':'연습 신호 분석 중 — 실제 주변 소리 측정값이 아닙니다.';
   const samples=new Float32Array(analyser.fftSize),freqs=new Float32Array(analyser.frequencyBinCount);
   function draw(){if(!active||token!==epoch)return;analyser.getFloatTimeDomainData(samples);analyser.getFloatFrequencyData(freqs);let sum=0,best=1;for(const v of samples)sum+=v*v;for(let i=2;i<freqs.length;i++)if(freqs[i]>freqs[best])best=i;const rms=Math.sqrt(sum/samples.length),peak=rms>.0001&&Number.isFinite(freqs[best])?best*ctx.sampleRate/analyser.fftSize:0;last={rms,peak,sampleRate:ctx.sampleRate,resolution:ctx.sampleRate/analyser.fftSize,kind,condition:microphone?'주변 소리':at('[data-frequency]').value+' Hz · 진폭 '+at('[data-amplitude]').value+' · '+at('[data-wave]').selectedOptions[0].text};let d='';for(let i=0;i<samples.length;i+=4)d+=(i?'L':'M')+(45+i/(samples.length-1)*530).toFixed(2)+' '+(112-Math.max(-1,Math.min(1,samples[i]))*85).toFixed(2);at('[data-wave-path]').setAttribute('d',d);at('[data-duration]').textContent=(samples.length/ctx.sampleRate*1000).toFixed(1)+' ms';at('[data-audio-reading]').textContent='상대 진폭(RMS) '+rms.toFixed(3)+' · 가장 강한 성분 '+(peak?'약 '+peak.toFixed(0)+' Hz':'검출되지 않음')+' · 주파수 눈금 약 '+last.resolution.toFixed(1)+' Hz';at('[data-audio-record]').disabled=false;audioFrame=requestAnimationFrame(draw);}
   draw();
  }catch(error){if(token!==epoch)return;stopAudio(error.name==='NotAllowedError'?'마이크 권한이 허용되지 않았습니다. 연습 신호는 권한 없이 사용할 수 있습니다.':'이 환경에서 측정 장치를 열지 못했습니다. 마이크는 HTTPS·권한·입력 장치가 필요합니다.');}
 }
 at('[data-signal]').onclick=()=>startAudio(false);at('[data-microphone]').onclick=()=>startAudio(true);at('[data-audio-stop]').onclick=()=>stopAudio();
 at('[data-audio-record]').onclick=()=>{if(active&&last){record(last.kind+' 상대 진폭',+last.rms.toFixed(4),'상대값',last.condition);if(last.peak)record(last.kind+' 주파수 성분',+last.peak.toFixed(1),'Hz',last.condition);}};
 function suspend(){stopAudio();if(isMeasure&&timerStart!==null){timerStart=null;cancelAnimationFrame(timerFrame);at('[data-time]').textContent='화면 이탈로 측정 취소';at('[data-timer-start]').disabled=false;at('[data-timer-stop]').disabled=true;}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});window.addEventListener('pagehide',suspend);
 window.__digitalInquiry={records:()=>records.map(r=>({...r})),snapshot:()=>({active,last:last?{...last}:null,microphoneTracks:stream?.getTracks().map(t=>t.readyState)||[]})};
})();
