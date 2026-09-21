(function(){
  'use strict';
  // Representative paths reused from globe/data/globe-data.js, not current observations.
  const currents=[
    {name:'쓰시마 난류',warm:true,coordinates:[[127.3,30.5],[128.6,32.3],[129.75,34.1],[131.2,35.8],[134,36.6],[137,38],[139.2,40.2],[140.3,41.4]]},
    {name:'동한 난류',warm:true,coordinates:[[129.4,35.3],[129.8,36.5],[130,37.5],[130.6,38.4],[131.6,39.1],[133.5,39.4]]},
    {name:'북한 한류',warm:false,coordinates:[[131.8,42.2],[130.1,41.1],[129.3,40.1],[128.9,39.3],[129.1,38.3]]}
  ];
  function tideAt(phase){const level=(1-Math.cos(phase/100*Math.PI*2))/2,y=190-level*85;return {level,y,shore:30+(y-65)/145*390};}
  function create(map){
    const pane=map.createPane('coastWater');pane.style.zIndex='468';pane.style.pointerEvents='none';
    const layer=L.layerGroup(),renderer=L.svg({pane:'coastWater'}),motion=matchMedia('(prefers-reduced-motion: reduce)');
    let active=false,mode='current',phase=0,host=null,suspended=false,inView=true;
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});observer.observe(map.getContainer());
    function sync(){pane.classList.toggle('coast-stopped',!active||mode!=='current'||document.hidden||suspended||motion.matches||!inView);pane.hidden=!active||mode!=='current'||suspended;}
    document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    function draw(){
      layer.clearLayers();if(!active||mode!=='current'){map.removeLayer(layer);sync();return;}
      if(!map.hasLayer(layer))layer.addTo(map);
      currents.forEach(c=>{
        const pts=c.coordinates.map(([lng,lat])=>[lat,lng]),color=c.warm?'#c45e3d':'#2675ac';
        L.polyline(pts,{pane:'coastWater',renderer,color:'#fff',weight:6,opacity:.8,interactive:false}).addTo(layer);
        L.polyline(pts,{pane:'coastWater',renderer,color,weight:3,interactive:false,className:'coast-current-line'}).addTo(layer);
        const i=2,point=pts[i],next=pts[i+1];
        const angle=Math.atan2(-(next[0]-point[0]),(next[1]-point[1])*Math.cos(point[0]*Math.PI/180))*180/Math.PI;
        L.marker(point,{pane:'coastWater',interactive:false,keyboard:false,icon:L.divIcon({className:'coast-arrow',html:`<span style="display:block;color:${color};font:bold 25px sans-serif;transform:rotate(${angle}deg)">➤</span>`,iconSize:[26,26],iconAnchor:[13,13]})})
          .bindTooltip(c.name,{permanent:true,direction:c.warm?'right':'left',className:'scene-map-label'}).addTo(layer);
      });sync();
    }
    function render(diagram){
      if(!active)return;
      document.querySelector('#coastInsight')?.remove();host=document.createElement('section');host.id='coastInsight';host.className='coast-scene';
      host.innerHTML=`<h3>바닷물은 어떻게 움직일까?</h3><div class="coast-tabs" role="group" aria-label="해안에서 관찰할 현상"><button data-coast-mode="current" aria-pressed="${mode==='current'}">해류 · 바다를 따라</button><button data-coast-mode="tide" aria-pressed="${mode==='tide'}">조석 · 해면의 오르내림</button></div><div class="coast-content"></div>`;
      diagram.after(host);
      host.querySelectorAll('[data-coast-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.coastMode;host.querySelectorAll('[data-coast-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));content();draw();});content();
    }
    function content(){
      const box=host?.querySelector('.coast-content');if(!box)return;host.dataset.mode=mode;
      if(mode==='current')box.innerHTML=`<p>대한해협으로 들어온 따뜻한 바닷물과 북쪽에서 내려오는 찬 바닷물을 지도에서 비교하세요. 색은 주변 바다에 비해 따뜻한지, 차가운지를 나타내며 정확한 수온은 아닙니다.</p><div class="coast-legend">${currents.map(c=>`<span style="--current-color:${c.warm?'#c45e3d':'#2675ac'}">${c.name}</span>`).join('')}</div><p class="water-small">세계지도의 대표 경로를 재사용한 개념도입니다. 경로·폭·속도는 관측값이 아니며 계절·수심·시기에 따라 실제 흐름은 달라집니다. 해류를 밀물·썰물과 혼동하지 마세요.</p><button id="coastFit">해류 지도 전체 보기</button><p class="coast-links"><a href="https://www.data.jma.go.jp/kaiyou/data/db/maizuru/knowledge/tsushima_current.html" target="_blank" rel="noopener">기상청(JMA) 쓰시마 난류 해설 ↗</a></p>`;
      else {
        box.innerHTML=`<p>완만한 해안에서는 해면이 내려갈 때 드러나는 땅이 넓어집니다. 같은 해안을 두고 물높이만 바꿔 보세요.</p><div id="tideDiagram"></div><label for="tidePhase">간조 → 만조 → 간조 한 주기</label><input id="tidePhase" type="range" min="0" max="100" value="${phase}" aria-describedby="tideStatus"><p id="tideStatus" role="status"></p><p class="water-small">조석은 해면 높이의 주기적인 변화, 조류는 그와 관련된 수평 방향의 흐름입니다. 여기서는 해면 높이만 바꿉니다. 가상 해안의 상대 높이이며 실제 시각·조차·침수 범위·갯벌 출입 시간을 예측하지 않습니다.</p><p class="coast-links"><a href="https://oceanservice.noaa.gov/facts/tidescurrents.html" target="_blank" rel="noopener">NOAA 조석과 해류의 구분 ↗</a></p>`;
        box.querySelector('#tidePhase').oninput=e=>{phase=Number(e.target.value);tide();};tide();
      }
      box.querySelector('#coastFit')?.addEventListener('click',()=>map.fitBounds([[33,127],[43,135]],{padding:[35,60],animate:false}));
    }
    function tide(){
      const {level,y,shore}=tideAt(phase),highShore=tideAt(50).shore;
      const status=phase===0||phase===100?'간조 · 드러난 갯벌이 넓음':phase===50?'만조 · 갯벌이 물에 잠김':phase<50?'밀물 · 해면이 높아지는 중':'썰물 · 해면이 낮아지는 중';
      host.querySelector('#tideDiagram').innerHTML=`<svg viewBox="0 0 560 260" role="img" aria-label="가상 해안 단면, ${status}"><rect width="560" height="260" fill="#f7fcfb"/><polygon points="30,65 420,210 560,225 560,250 30,250" fill="#b9b18b"/><path d="M${highShore},105 L${shore},${y}" stroke="#b98745" stroke-width="7"/><polygon points="${shore},${y} 560,${y} 560,225 420,210" fill="#74bbd4" fill-opacity=".8"/><path d="M${highShore},105 H550 M366.2,190 H550" stroke="#718b94" stroke-dasharray="4 4" fill="none"/><path d="M${shore},${y} H550" stroke="#287c9c" stroke-width="2"/><text x="35" y="42">육지</text><text x="475" y="62">바다</text><text x="445" y="99">만조 높이</text><text x="445" y="184">간조 높이</text><text x="40" y="240">완만한 가상 해안 · 세로 과장</text></svg>`;
      host.querySelector('#tideStatus').textContent=status;host.dataset.tideLevel=level.toFixed(3);host.dataset.shore=shore.toFixed(1);
    }
    function setActive(value){active=value;if(!active){map.removeLayer(layer);document.querySelector('#coastInsight')?.remove();host=null;}else draw();sync();}
    return {render,setActive,setSuspended(value){suspended=value;sync();},destroy(){setActive(false);observer.disconnect();document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);renderer.remove();pane.remove();}};
  }
  window.KoreaCoastScene={create,currents,tideAt};
})();
