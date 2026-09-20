const CLIMATES=[{name:'모형 A · 여름 건조',t:[7,8,11,14,18,23,26,26,22,17,12,8],p:[80,75,60,45,30,15,5,10,40,85,100,90]},{name:'모형 B · 연중 강수',t:[5,5,7,10,13,16,18,18,15,12,8,6],p:[70,50,55,50,55,60,55,60,65,80,80,75]}];
export function renderVisual(host,kind){
  if(kind==='climate'){
    host.innerHTML='<div class="mini-tabs" role="group" aria-label="기후 모형 선택"><button data-model="0" aria-pressed="true">모형 A</button><button data-model="1" aria-pressed="false">모형 B</button></div><div class="climate-chart"></div>';
    const draw=i=>{
      const d=CLIMATES[i],x=n=>30+n*21,y=v=>154-v*3.3;
      host.querySelector('.climate-chart').innerHTML=`<svg viewBox="0 0 300 196" role="img" aria-label="${d.name}. 기온 ${d.t.join(', ')}도. 월 강수량 ${d.p.join(', ')}밀리미터."><text x="10" y="15" fill="#ffb297">기온 ℃</text><text x="232" y="15" fill="#84c8ed">강수 mm</text>${[0,10,20,30,40].map(v=>`<path d="M25 ${y(v)}H270" stroke="#ffffff15"/><text x="0" y="${y(v)+4}" fill="#aabaca">${v}</text><text x="273" y="${y(v)+4}" fill="#aabaca">${v*5}</text>`).join('')}${d.p.map((p,n)=>`<rect x="${x(n)-5}" y="${154-p*.66}" width="10" height="${p*.66}" fill="#63b8de" opacity=".7"/>`).join('')}<polyline points="${d.t.map((t,n)=>`${x(n)},${y(t)}`).join(' ')}" fill="none" stroke="#ffad89" stroke-width="2.7"/>${d.t.map((t,n)=>`<text x="${x(n)}" y="174" fill="#b6c4d3" text-anchor="middle">${n+1}</text>`).join('')}<text x="150" y="193" text-anchor="middle" fill="#c4d6e3">${d.name} · 월별 평균</text></svg><p class="visual-caption">학습용 모형 · 도시 관측값 아님<br>연교차 ${Math.max(...d.t)-Math.min(...d.t)}℃ · 연강수량 ${d.p.reduce((a,b)=>a+b)}mm</p>`;
      host.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.model)===i)));
    };
    host.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>draw(Number(b.dataset.model)));draw(0);
  }
  if(kind==='population')host.innerHTML=`<div class="population-model">${[['모형 A',35,60,5],['모형 B',12,58,30]].map(([n,...v])=>`<p>${n}</p><div class="age-bar" aria-label="${n}: 0~14세 ${v[0]}%, 15~64세 ${v[1]}%, 65세 이상 ${v[2]}%">${v.map((p,i)=>`<span style="width:${p}%;background:${['#88dcb7','#68a8cd','#cfabdf'][i]}">${p}%</span>`).join('')}</div>`).join('')}<p class="visual-caption">연령별 인구 비중 · 학습용 모형<br>초록 0–14세 / 파랑 15–64세 / 보라 65세 이상</p></div>`;
  if(kind==='plates'){
    host.innerHTML='<div class="mini-tabs" role="group" aria-label="판 경계 모형"><button data-plate="divergent" aria-pressed="true">발산</button><button data-plate="convergent" aria-pressed="false">수렴</button><button data-plate="transform" aria-pressed="false">보존</button></div><div class="plate-model" data-motion="divergent" role="img" aria-label="발산: 두 판이 서로 멀어지는 상대 운동 모형"><span class="plate-left">←</span><span class="plate-right">→</span></div><p class="visual-caption">상대 운동을 과장한 모형 · 실제 속도·방위 아님</p>';
    const motions={divergent:['←','→','발산: 두 판이 서로 멀어짐'],convergent:['→','←','수렴: 두 판이 서로 가까워짐'],transform:['↑','↓','보존: 두 판이 옆으로 어긋남']};
    host.querySelectorAll('[data-plate]').forEach(b=>b.onclick=()=>{
      const model=host.querySelector('.plate-model'),d=motions[b.dataset.plate];model.dataset.motion=b.dataset.plate;model.setAttribute('aria-label',d[2]+'의 상대 운동 모형');
      model.children[0].textContent=d[0];model.children[1].textContent=d[1];
      host.querySelectorAll('[data-plate]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));
    });
  }
}
