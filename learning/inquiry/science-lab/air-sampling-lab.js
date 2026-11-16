(()=>{
 'use strict';const $=id=>document.getElementById(id),api=window.AirSamplingModel;if(!$('airSite')||!api)return;
 let calibrated=false,elapsed=0,running=null,timer=null,results={A:null,B:null};
 const names={gate:'학교 정문',garden:'화단 옆',classroom:'교실'},controls={site:'airSite',period:'airPeriod',height:'airHeight',pollutant:'airPollutant',seconds:'airSeconds'};
 const conditions=()=>api.normalize({...Object.fromEntries(Object.entries(controls).map(([k,id])=>[k,$(id).value])),inlet:document.querySelector('[name=airInlet]:checked').value,calibrated});
 const text=(x,y,s,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="system-ui" font-size="16" fill="#294d5e">${s}</text>`;
 // Cross-section of an optical particle sensor: inlet, size-selective plate, laser detector, fan, outlet.
 const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;let raf=0,runStart=0;
 const flow=[];for(let i=0;i<30;i++)flow.push({d:api.diameters[[0,0,0,0,1,1,1,2,2,3,4,5][i%12]],offset:(i*0.137)%1,lane:((i*37)%11-5)*1.6});
 function particle(p,t,cut,filter){const r=2.2+Math.log2(p.d/.5+1)*1.35,u=(t*.42+p.offset)%1,big=p.d>cut;let x=12+u*700,y=215+p.lane,stuck=false,flash=0;
  if(filter){if(x>48){x=48+(p.offset*6);stuck=true;}return{x,y:215+p.lane*3.2,r,stuck,flash,u};}
  if(x<100)y=215+p.lane*3.2*(1-x/100)+p.lane*(x/100);
  if(big&&x>200){x=200-r;stuck=true;y=206+((p.offset*97)%1)*14;}
  else if(x>186&&x<236){const k=Math.sin((x-186)/50*Math.PI);y+=k*14;}
  if(!big&&Math.abs(x-334)<7)flash=1-Math.abs(x-334)/7;
  if(x>520&&x<560)y=215+p.lane*(1-(x-520)/40);
  return{x,y,r,stuck,flash,u};}
 function apparatus(){const narrow=$('airApparatus').clientWidth<560,s=conditions(),shown=api.sample(s,elapsed).concentration,filter=s.inlet==='filter',cut=s.pollutant==='pm25'?2.5:10,t=running&&!reduced()?(performance.now()-runStart)/1000:0;
  let b='<defs><linearGradient id="air-shell" x2="0" y2="1"><stop stop-color="#f7fafc"/><stop offset="1" stop-color="#dbe5eb"/></linearGradient><clipPath id="air-duct"><path d="M150 200H520V230H150ZM520 196H654V234H520Z"/></clipPath></defs>';
  b+='<ellipse cx="400" cy="312" rx="260" ry="8" fill="#bed0da" opacity=".35"/><rect x="150" y="66" width="500" height="238" rx="22" fill="url(#air-shell)" stroke="#8ca7b7" stroke-width="2"/><rect x="164" y="166" width="472" height="100" rx="10" fill="#f9fbfc" stroke="#c7d6de"/>';
  // Light display, not a dark screen.
  b+=`<rect x="420" y="84" width="208" height="66" rx="9" fill="#e4eddc" stroke="#9fb39c" stroke-width="2"/>${text(462,108,s.pollutant==='pm25'?'PM2.5':'PM10')}${narrow?'':text(590,108,'µg/m³')}${text(524,138,shown===null?(running?'측정 중':calibrated?'준비 완료':'영점 확인'):shown.toFixed(1))}<circle cx="190" cy="98" r="6" fill="${calibrated?'#337f6e':'#c28b45'}"/>`;
  // Duct walls.
  b+='<path d="M100 186L150 200H520L520 196H654M100 244L150 230H520L520 234H654" fill="none" stroke="#7d97a4" stroke-width="3"/><path d="M150 200H520V230H150Z" fill="#eef5f8"/><path d="M520 196H654V234H520Z" fill="#eef5f8"/><path d="M100 186L150 200V230L100 244Z" fill="#e6eff3" stroke="#7d97a4" stroke-width="2"/>';
  b+='<rect x="199" y="198" width="11" height="21" rx="2" fill="#6f8593"/>';
  // Laser source above the duct, beam across it, light detector below.
  b+='<rect x="320" y="168" width="28" height="22" rx="4" fill="#64798a"/><path d="M334 190V246" stroke="#d14b3c" stroke-width="2.4" opacity=".85"/><rect x="322" y="240" width="24" height="14" rx="3" fill="#4f6474"/>';
  // Fan.
  const ang=t*900;b+=`<circle cx="470" cy="215" r="13" fill="#dfe9ee" stroke="#7d97a4" stroke-width="2"/><g transform="rotate(${(ang%360).toFixed(1)} 470 215)">${[0,90,180,270].map(a=>`<path d="M470 215Q${470+12*Math.cos((a-30)*Math.PI/180)} ${215+12*Math.sin((a-30)*Math.PI/180)} ${470+13*Math.cos(a*Math.PI/180)} ${215+13*Math.sin(a*Math.PI/180)}Z" fill="#7d97a4"/>`).join('')}</g><circle cx="470" cy="215" r="3" fill="#4f6474"/>`;
  if(filter)b+='<rect x="44" y="176" width="56" height="78" rx="8" fill="#f6f2e6" stroke="#aab7bc" stroke-width="2"/><path d="M53 182v66m9-66v66m9-66v66m9-66v66m9-66v66" stroke="#c6cdcd" stroke-width="2"/>';
  // Particles: big ones stop at the plate, small ones pass the beam and leave through the fan.
  const stuck=[];let dots='';if(running||!filter)for(const p of flow){const q=particle(p,running?t:p.offset*2.38,cut,filter);if(!running&&q.x>96)continue;if(q.stuck){stuck.push(q);continue;}const inDuct=q.x>150&&q.x<654;dots+=`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${q.r.toFixed(1)}" fill="${p.d>cut?'#b88a55':'#8297a6'}"${inDuct?' clip-path="url(#air-duct)"':''}/>`;if(q.flash>0)b+=`<circle cx="334" cy="${q.y.toFixed(1)}" r="${(5+q.flash*5).toFixed(1)}" fill="#ffd2c4" opacity="${(q.flash*.8).toFixed(2)}"/>`;}
  for(const q of stuck.slice(0,8))dots+=`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${q.r.toFixed(1)}" fill="#b88a55"/>`;
  b+=dots;
  if(running)b+='<path d="M662 206h18m-6-5l6 5-6 5M662 224h18m-6-5l6 5-6 5" fill="none" stroke="#397c8e" stroke-width="2"/>';
  b+=narrow?text(205,292,'1')+text(334,292,'2')+text(470,292,'3')+text(72,284,'0'):text(205,288,'크기 선별')+text(334,288,'레이저 검출')+text(470,288,'팬')+text(72,272,filter?'영점 필터':'흡입구')+text(400,40,'공기질 센서 단면')+text(400,334,'흡입 유량 0.5 L/분');
  let key=$('airPartsKey');if(!key){key=document.createElement('p');key.id='airPartsKey';key.className='air-parts-key';$('airApparatus').after(key);}key.hidden=!narrow;key.textContent=`0 ${filter?'영점 필터':'흡입구'} · 1 크기 선별 · 2 레이저 검출 · 3 팬 · 흡입 유량 0.5 L/분`;
  window.scienceScene.render($('airApparatus'),`<svg viewBox="0 0 700 350" role="img" aria-label="흡입구로 들어온 공기가 크기 선별부, 레이저 검출부, 팬을 지나 나가는 공기질 센서 단면">${b}</svg>`);
  $('airInletBadge').textContent=filter?'필터 연결':'주변 공기 흡입';
  $('airSizes').innerHTML=api.diameters.map(d=>`<span class="${d<=cut?'included':''}">${d} µm</span>`).join('');
  if(running&&!reduced()&&!raf){const loop=()=>{raf=0;if(!running)return;apparatus();};raf=requestAnimationFrame(loop);}
 }
 function live(){const s=conditions(),r=api.sample(s,elapsed);$('airElapsed').textContent=`${elapsed} / ${s.seconds}초`;$('airVolume').textContent=r.litres.toFixed(2)+' L';$('airValueLabel').textContent=s.pollutant==='pm25'?'PM2.5':'PM10';$('airValue').textContent=(r.concentration===null?'—':r.concentration.toFixed(1))+' µg/m³';if(running&&reduced())apparatus();}
 function lock(on){for(const e of document.querySelectorAll('.air-controls select,.air-controls input,#airZero,#airMeasureA,#airMeasureB'))e.disabled=on;$('airStop').hidden=!on;}
 function stop(message){clearInterval(timer);timer=null;running=null;lock(false);apparatus();if(message)$('airStatus').textContent=message;}
 function resultView(){for(const key of ['A','B']){const row=results[key];$('airResult'+key).innerHTML=`<h3>측정 ${key}</h3>`+(row?`<strong>${row.result.concentration.toFixed(1)} µg/m³</strong><p>${names[row.conditions.site]} · ${row.conditions.pollutant==='pm25'?'PM2.5':'PM10'}</p><p class="air-result-conditions">${row.conditions.period==='morning'?'오전 9시':'오후 1시'} · ${row.conditions.height==='low'?'0.3':'1.5'} m · ${row.conditions.seconds}초</p>`:'<p>아직 측정하지 않았습니다.</p>');}
  $('airComparison').textContent=api.compare(results.A,results.B).reason;
  const available=Object.values(results).filter(Boolean);if(!available.length){$('airGraph').replaceChildren();return;}
  const max=Math.max(10,...available.flatMap(row=>row.trace.map(p=>p.concentration||0)))*1.2,duration=Math.max(...available.map(row=>row.conditions.seconds));let svg='';
  for(let i=0;i<=4;i++){const y=245-i*45;svg+=`<path d="M66 ${y}H644" stroke="#d7e4ea"/>`+text(54,y+5,(max*i/4).toFixed(0),'end');}for(let i=0;i<=3;i++)svg+=text(66+i*578/3,273,Math.round(duration*i/3));
  for(const [key,row]of Object.entries(results)){if(!row)continue;const points=row.trace.filter(p=>p.concentration!==null).map(p=>`${66+p.elapsed/duration*578},${245-p.concentration/max*180}`).join(' ');svg+=`<polyline points="${points}" fill="none" stroke="${key==='A'?'#246e80':'#b16b34'}" stroke-width="2.5"/>`;}
  window.scienceScene.render($('airGraph'),`<p class="air-graph-key">A · 파란 선 &nbsp; B · 주황 선</p><svg viewBox="0 0 700 310" role="img" aria-label="측정 시간에 따른 누적 평균 농도">${text(66,25,'농도 (µg/m³)','start')}${svg}${text(354,300,'측정 시간 (초)')}</svg>`);
 }
 function measure(key){const s=conditions();if(!s.calibrated){$('airStatus').textContent='필터를 연결하고 센서 영점을 먼저 확인하세요.';return;}if(s.inlet==='filter'){$('airStatus').textContent='영점 확인이 끝났습니다. 필터를 빼고 주변 공기를 흡입하세요.';return;}
  stop();elapsed=0;running=key;runStart=performance.now();lock(true);const trace=[];apparatus();live();$('airStatus').textContent=`${key} 측정 중 · 같은 조건으로 끝까지 측정합니다.`;
  timer=setInterval(()=>{elapsed=Math.min(s.seconds,elapsed+2);trace.push(api.sample(s,elapsed));live();if(elapsed===s.seconds){results[key]={conditions:{...s},result:api.sample(s,elapsed),trace};stop(`${key} 측정을 마쳤습니다. 장소만 바꾸어 다른 결과와 비교하세요.`);resultView();}},80);
 }
 for(const id of Object.values(controls))$(id).onchange=()=>{elapsed=0;apparatus();live();$('airStatus').textContent='바꾼 조건으로 측정하세요. 완료한 A·B 결과의 조건은 그대로 남습니다.';};
 for(const input of document.querySelectorAll('[name=airInlet]'))input.onchange=()=>{elapsed=0;apparatus();live();};
 $('airZero').onclick=()=>{if(conditions().inlet!=='filter'){$('airZeroStatus').textContent='영점 확인용 필터를 연결하세요.';return;}calibrated=true;$('airZeroStatus').textContent='영점 확인 완료 · 필터를 빼고 측정하세요.';$('airStatus').textContent='주변 공기 흡입으로 바꾸어 측정을 시작하세요.';apparatus();live();};
 $('airMeasureA').onclick=()=>measure('A');$('airMeasureB').onclick=()=>measure('B');$('airStop').onclick=()=>stop('측정을 중지했습니다. 끝나지 않은 측정은 비교에 넣지 않습니다.');
 $('resetExperiment').onclick=()=>{stop();calibrated=false;elapsed=0;results={A:null,B:null};const s=api.defaults();for(const[k,id]of Object.entries(controls))$(id).value=s[k];document.querySelector('[name=airInlet][value=open]').checked=true;$('airZeroStatus').textContent='필터를 연결한 뒤 영점을 확인하세요.';$('airStatus').textContent='영점 확인 후 필터를 빼고 측정하세요.';apparatus();live();resultView();};
 window.addEventListener('pagehide',()=>clearInterval(timer));let lastWidth=0;new ResizeObserver(()=>{const w=$('airApparatus').clientWidth;if((w<560)!==(lastWidth<560)&&!running)apparatus();lastWidth=w;}).observe($('airApparatus'));window.__airSampling={getState:()=>({conditions:conditions(),elapsed,running,results}),finish:()=>{if(running){const key=running,s=conditions();elapsed=s.seconds;results[key]={conditions:s,result:api.sample(s,elapsed),trace:Array.from({length:s.seconds/2},(_,i)=>api.sample(s,(i+1)*2))};stop('측정을 마쳤습니다.');live();resultView();}}};apparatus();live();
})();
