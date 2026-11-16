(()=>{'use strict';const M=window.scienceCrustThickness,$=id=>document.getElementById(id);let key='local',split=3,picked=false,result=null,firstAttempt=null,anim=0,animStart=0;const firstAttempts=new Map();
 const NEUTRAL='#5b7280',NEAR='#17677a',FAR='#a04d18';
 const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const fixed=(n,d=2)=>Number(n).toFixed(d),equation=f=>'t = '+fixed(f.slope,4)+'x '+(f.intercept>=0?'+ ':'− ')+fixed(Math.abs(f.intercept),4);
 function draw(){const svg=$('ctPlot'),w=Math.max(250,svg.clientWidth),h=svg.clientHeight,margin={l:40,r:17,t:15,b:28},pw=w-margin.l-margin.r,ph=h-margin.t-margin.b,x=v=>margin.l+v/500*pw,y=v=>h-margin.b-v/80*ph;
  svg.setAttribute('viewBox','0 0 '+w+' '+h);const text=(xx,yy,s,anchor='middle')=>'<text x="'+xx+'" y="'+yy+'" text-anchor="'+anchor+'" font-size="14" fill="#173e52">'+s+'</text>';let out='';
  for(const v of [0,20,40,60,80])out+='<path d="M'+x(0)+' '+y(v)+'H'+x(500)+'" fill="none" stroke="#d9e4e9"/>'+text(x(0)-8,y(v)+5,v,'end');
  for(const v of [0,100,200,300,400,500])out+=text(x(v),h-5,v);
  if(result?.valid){for(const [line,color]of [[result.direct,NEAR],[result.refracted,FAR]]){const low=Math.max(0,-line.intercept/line.slope),high=Math.min(500,(80-line.intercept)/line.slope);out+='<path d="M'+x(low)+' '+y(line.slope*low+line.intercept)+'L'+x(high)+' '+y(line.slope*high+line.intercept)+'" fill="none" stroke="'+color+'" stroke-width="2.5"/>';}out+='<path d="M'+x(result.crossing)+' '+y(0)+'V'+y(result.time)+'" stroke="#667d8a" stroke-dasharray="5 5" fill="none"/><circle cx="'+x(result.crossing)+'" cy="'+y(result.time)+'" r="6" fill="#fff" stroke="#304b5e" stroke-width="2"/>';}
  M.datasets[key].rows.forEach(([a,b],i)=>{out+='<circle cx="'+x(a)+'" cy="'+y(b)+'" r="4.5" fill="'+(picked?(i<split?NEAR:FAR):NEUTRAL)+'" stroke="#fff" stroke-width="1.2"><title>관측소 '+M.datasets[key].labels[i]+': '+a+' km, '+b+'초</title></circle>';});window.scienceScene.render(svg,out);
 }
 // 땅속 단면: 지표의 진원·관측소, 지각과 맨틀, 직접파(지각 속 지표를 따라)와 굴절파(모호면을 따라) 경로.
 function section(tt){const svg=$('ctSection');if(!svg)return;const d=M.datasets[key],rows=d.rows,maxX=rows[rows.length-1][0];
  const X0=14,X1=196,SY=62,sx=v=>X0+v/500*(X1-X0);
  const depth=result?.valid?result.thickness:35,dz=2.5,MY=SY+depth*dz,BOT=222;
  const V1=result?.valid?result.V1:6,V2=result?.valid?result.V2:8,ic=Math.asin(Math.min(.99,V1/V2)),off=depth*Math.tan(ic);
  let o='';
  o+='<rect x="'+X0+'" y="'+SY+'" width="'+(X1-X0)+'" height="'+(MY-SY)+'" fill="#e7d3b0"/>';
  o+='<rect x="'+X0+'" y="'+MY+'" width="'+(X1-X0)+'" height="'+(BOT-MY)+'" fill="#d99a73"/>';
  o+='<path d="M'+X0+' '+SY+'H'+X1+'" stroke="#5c7a3a" stroke-width="3"/><path d="M'+X0+' '+MY+'H'+X1+'" stroke="#7a3f1d" stroke-width="1.6"/>';
  o+='<text x="'+sx(150)+'" y="'+(MY-8)+'" text-anchor="middle" font-size="14" fill="#5b4320">지각</text><text x="'+(X1-4)+'" y="'+(BOT-8)+'" text-anchor="end" font-size="14" fill="#fff">맨틀</text>';
  // stations
  rows.forEach(([a],i)=>{const cx=sx(a),col=picked?(i<split?NEAR:FAR):NEUTRAL;o+='<path d="M'+(cx-4.5)+' '+SY+'L'+cx+' '+(SY-9)+'L'+(cx+4.5)+' '+SY+'Z" fill="'+col+'"/>';});
  o+='<path d="M'+(X0-6)+' '+(SY-2)+'l6 -8 6 8z" fill="#c2410c"/><text x="'+(X0-6)+'" y="'+(SY-14)+'" font-size="14" fill="#173e52">진원</text><text x="'+(X1)+'" y="'+(SY-14)+'" text-anchor="end" font-size="14" fill="#173e52">관측소</text>';
  // ray paths to the farthest station
  const direct='M'+X0+' '+(SY+3)+'H'+sx(maxX);const a1=X0,b1=sx(off),b2=sx(maxX-off),a2=sx(maxX);
  const refr='M'+a1+' '+(SY+2)+'L'+b1+' '+MY+'L'+b2+' '+MY+'L'+a2+' '+(SY+2);
  o+='<path d="'+direct+'" fill="none" stroke="'+NEAR+'" stroke-width="2" stroke-dasharray="6 4"/>';
  o+='<path d="'+refr+'" fill="none" stroke="'+FAR+'" stroke-width="2" stroke-dasharray="6 4"/>';
  o+='<text x="'+((b1+b2)/2)+'" y="'+(MY+18)+'" text-anchor="middle" font-size="14" fill="#5a2208">굴절파</text>';
  o+='<text x="'+sx(150)+'" y="'+(SY+20)+'" text-anchor="middle" font-size="14" fill="'+NEAR+'">직접파</text>';
  // thickness and crossing distance
  if(result?.valid){const ax=sx(300);o+='<path d="M'+ax+' '+(SY+4)+'V'+(MY-4)+'" stroke="#173e52" stroke-width="1.4" marker-start="url(#ctArr)" marker-end="url(#ctArr)"/>';
   o+='<text x="'+(ax+5)+'" y="'+((SY+MY)/2+5)+'" font-size="14" fill="#173e52">d ≈ '+fixed(result.thickness,1)+'</text>';
   o+='<path d="M'+sx(result.crossing)+' '+(SY-26)+'V'+(SY-10)+'" stroke="#304b5e" stroke-dasharray="3 3"/><text x="'+sx(result.crossing)+'" y="'+(SY-30)+'" text-anchor="middle" font-size="14" fill="#304b5e">l</text>';}
  else o+='<text x="'+sx(300)+'" y="'+((SY+MY)/2+5)+'" font-size="14" fill="#5b4320">두께 ?</text>';
  // travelling pulses (model seconds tt)
  if(tt!=null){const T1=maxX/V1;const pd=Math.min(maxX,V1*tt);o+='<circle cx="'+sx(pd)+'" cy="'+(SY+3)+'" r="5" fill="'+NEAR+'" stroke="#fff" stroke-width="1.5"/>';
   const leg=Math.hypot(off,depth),seg=[[leg/V1,[0,0],[off,depth]],[(maxX-2*off)/V2,[off,depth],[maxX-off,depth]],[leg/V1,[maxX-off,depth],[maxX,0]]];let rem=tt,pt=[maxX,0];for(const [dur,p0,p1] of seg){if(rem<=dur){const f=rem/dur;pt=[p0[0]+(p1[0]-p0[0])*f,p0[1]+(p1[1]-p0[1])*f];break;}rem-=dur;}
   o+='<circle cx="'+sx(pt[0])+'" cy="'+(SY+pt[1]*dz+(pt[1]===0?2:0))+'" r="5" fill="'+FAR+'" stroke="#fff" stroke-width="1.5"/>';}
  o='<defs><marker id="ctArr" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8z" fill="#173e52"/></marker></defs>'+o;
  window.scienceScene.render(svg,o);
 }
 function playPulses(){cancelAnimationFrame(anim);if(!result?.valid){section(null);return;}const rows=M.datasets[key].rows,maxX=rows[rows.length-1][0],end=maxX/result.V1+1,dur=2800;
  if(reduce()){section(null);return;}animStart=performance.now();const step=now=>{const f=Math.min(1,(now-animStart)/dur);section(f*end);if(f<1)anim=requestAnimationFrame(step);else section(null);};anim=requestAnimationFrame(step);}
 function rows(){const d=M.datasets[key];$('ctRows').innerHTML=d.rows.map(([x,t],i)=>'<tr data-group="'+(picked?(i<split?'near':'far'):'none')+'"><th scope="row">'+d.labels[i]+'</th><td>'+x+'</td><td>'+fixed(t,1)+'</td></tr>').join('');}
 function clear(){cancelAnimationFrame(anim);result=null;firstAttempt=firstAttempts.get(key+':'+split)||null;$('ctResults').hidden=true;$('ctDepth').value='';$('ctDepthFeedback').textContent='';$('ctStatus').textContent=picked?'고른 구간대로 점의 색이 나뉘었습니다. 두 추세선을 구해 보세요.':'점들이 어디에서 꺾이는지 보고, 직접파 구간의 마지막 관측소를 고르세요.';$('ctSectionNote').textContent='추세선을 구하면 두께가 그려집니다.';rows();draw();section(null);}
 function choose(value){key=value;const d=M.datasets[key];split=d.split;picked=false;for(const b of document.querySelectorAll('[data-ct-case]'))b.setAttribute('aria-pressed',String(b.dataset.ctCase===key));$('ctSplit').innerHTML='<option value="" disabled hidden selected>관측소를 고르세요</option>'+d.rows.slice(1,-2).map((_,i)=>'<option value="'+(i+2)+'">'+d.labels[0]+' ~ '+d.labels[i+1]+'</option>').join('');$('ctSplit').value='';$('ctDataNote').textContent=d.origin?'첫 구간에는 원점 (0, 0)을 함께 넣어 추세선을 구합니다.':'관측소마다 P파가 처음 도착한 시간입니다.';clear();}
 function fit(){if(!picked){$('ctStatus').textContent='먼저 직접파 구간의 마지막 관측소를 고르세요.';return;}result=M.solve(key,split);$('ctResults').hidden=!result.valid;rows();draw();if(!result.valid){section(null);$('ctStatus').textContent=result.reason;return;}
  $('ctStatus').textContent='두 추세선의 교점까지 거리는 '+fixed(result.crossing,1)+' km입니다. 기울기의 단위는 초/km이며, 속도는 기울기의 역수입니다.';
  $('ctSectionNote').textContent='먼 관측소에는 맨틀을 돌아온 굴절파가 먼저 닿습니다. d는 지각 두께(km)입니다.';
  $('ctDirectEquation').textContent=equation(result.direct);$('ctRefractedEquation').textContent=equation(result.refracted);$('ctV1').textContent='V₁ = 1 / '+fixed(result.direct.slope,4)+' ≈ '+fixed(result.V1)+' km/s';$('ctV2').textContent='V₂ = 1 / '+fixed(result.refracted.slope,4)+' ≈ '+fixed(result.V2)+' km/s';$('ctCrossing').textContent='교차 거리 l ≈ '+fixed(result.crossing,1)+' km · 교차점의 이동 시간 ≈ '+fixed(result.time,1)+'초';$('ctDepth').value='';$('ctDepthFeedback').textContent='';firstAttempt=firstAttempts.get(key+':'+split)||null;
  playPulses();
 }
 function check(){if(!result?.valid)return;const text=$('ctDepth').value;if(!text.trim()||!Number.isFinite(Number(text))||Number(text)<=0){$('ctDepthFeedback').textContent='계산한 두께를 0보다 큰 수로 입력하세요.';return;}const v=Number(text),correct=Math.abs(v-result.thickness)<=.3;firstAttempt??={value:v,correct};firstAttempts.set(key+':'+split,firstAttempt);$('ctDepthFeedback').textContent=(correct?'계산이 맞습니다. 약 '+fixed(result.thickness,1)+' km입니다. ':Math.abs(v-result.thickness*2)<1?'교차 거리를 2로 나누는 단계를 확인하세요. ':Math.abs(v-result.crossing)<1?'교차 거리는 가로 방향 거리입니다. 그 값을 지각의 두께로 바로 쓰지 않습니다. ':'기울기의 역수로 구한 두 속도와 교차 거리를 식에 넣어 다시 계산하세요. ');}
 for(const b of document.querySelectorAll('[data-ct-case]'))b.onclick=()=>choose(b.dataset.ctCase);$('ctSplit').onchange=()=>{const v=Number($('ctSplit').value);if(!v)return;split=v;picked=true;clear();};$('ctFit').onclick=fit;$('ctCheck').onclick=check;$('ctReset').onclick=()=>{firstAttempts.clear();choose(key);};new ResizeObserver(draw).observe($('ctPlot'));choose(key);window.__crustThickness={getState:()=>JSON.parse(JSON.stringify({key,split,picked,result,firstAttempt}))};
})();
