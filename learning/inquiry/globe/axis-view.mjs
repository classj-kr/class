// A side-on view makes the axial tilt visible without changing geographic data.
export function createAxisView({map, host, getZoom, reducedMotion}) {
  let active = false, saved = null, savedMinZoom = 0, ready = false;
  const button = document.createElement('button');
  button.id = 'axisView';
  button.type = 'button';
  button.textContent = '자전축 보기';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-controls', 'axisDiagram');
  button.disabled = true;
  host.append(button);
  const overlay = document.createElement('div');
  overlay.id = 'axisDiagram';
  overlay.className = 'axis-diagram';
  overlay.hidden = true;
  overlay.innerHTML = `<svg role="img" aria-label="공전면에 수직인 방향에서 약 23.5도 기울어진 지구 자전축"><g class="axis-lines"><path class="axis-shaft"/><path class="axis-reference"/><path class="axis-angle"/></g><g class="axis-labels"><text class="axis-north">북극</text><text class="axis-south">남극</text><text class="axis-degrees">23.5°</text><text class="axis-reference-label">공전면에 수직인 방향</text><text data-lat="23.5">북회귀선</text><text data-lat="0">적도</text><text data-lat="-23.5">남회귀선</text></g></svg><p class="axis-explanation">자전축이 기울어져 있어 태양이 머리 위에 오는 곳은 1년 동안 북회귀선과 남회귀선 사이를 오가요.</p>`;
  map.getContainer().append(overlay);
  const svg = overlay.querySelector('svg');
  const node = name => svg.querySelector('.axis-' + name);
  const fmt = n => Number(n.toFixed(2));
  const point = (x,y) => `${fmt(x)},${fmt(y)}`;
  function label(name, x, y, anchor = 'middle') {
    const el = node(name);
    el.setAttribute('x', fmt(x)); el.setAttribute('y', fmt(y)); el.setAttribute('text-anchor', anchor);
  }
  function draw() {
    if (!active) return;
    const {clientWidth:w, clientHeight:h} = map.getCanvas();
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const lng = map.getCenter().lng;
    const n = map.project([lng,90]), s = map.project([lng,-90]);
    const span = Math.hypot(n.x-s.x,n.y-s.y);
    if (!Number.isFinite(span) || span < 5) { svg.style.visibility='hidden'; return; }
    svg.style.visibility='visible';
    const ux=(n.x-s.x)/span, uy=(n.y-s.y)/span;
    const cx=(n.x+s.x)/2, cy=(n.y+s.y)/2, r=span/2;
    node('shaft').setAttribute('d', `M${point(s.x-ux*30,s.y-uy*30)} L${point(n.x+ux*42,n.y+uy*42)}`);
    label('north', n.x+ux*48-12,n.y+uy*48, 'end');
    label('south', s.x-ux*38-10,s.y-uy*38+5, 'end');
    // The real 23.5° angle is visible only in the equatorial side view.
    // Panning toward a pole foreshortens it, so do not draw a false screen angle.
    const sideOn = Math.abs(map.getCenter().lat)<0.1 && Math.abs(map.getBearing())<0.1 && Math.abs(map.getRoll()-23.5)<0.1;
    for (const name of ['reference','reference-label','angle']) node(name).style.display=sideOn?'':'none';
    if (sideOn) {
      const a=Math.atan2(ux,-uy), ar=r+24;
      node('reference').setAttribute('d',`M${point(cx,cy-r*.65)} L${point(cx,cy-r-60)}`);
      node('angle').setAttribute('d',`M${point(cx,cy-ar)} A${fmt(ar)},${fmt(ar)} 0 0 ${a>0?1:0} ${point(cx+ux*ar,cy+uy*ar)}`);
      label('degrees',cx+Math.sin(a/2)*(ar+15),cy-Math.cos(a/2)*(ar+15));
      label('reference-label',cx-10,cy-r-55,'end');
    } else {
      label('degrees',n.x+ux*24+12,n.y+uy*24,'start');
    }
    for (const text of svg.querySelectorAll('[data-lat]')) {
      const lat=Number(text.dataset.lat);
      const p=map.project([lng-30,lat]);
      text.setAttribute('x',fmt(p.x)); text.setAttribute('y',fmt(p.y-7));
      text.style.display=Math.abs(map.getCenter().lat)<45?'':'none';
    }
  }
  function disable(restore = true) {
    if (!active) return;
    active = false;
    button.setAttribute('aria-pressed','false');
    overlay.hidden = true;
    map.setLayoutProperty('axis-latitudes','visibility','none');
    map.stop();
    map.setMinZoom(restore && saved ? savedMinZoom : getZoom());
    if (restore && saved) map.easeTo({...saved,duration:reducedMotion.matches?0:550});
    else map.setRoll(saved?.roll || 0);
  }
  button.addEventListener('click',()=>{
    if (!ready) return;
    if (active) { disable(); return; }
    saved = {center:map.getCenter().toArray(),zoom:map.getZoom(),bearing:map.getBearing(),roll:map.getRoll()};
    savedMinZoom = map.getMinZoom();
    active = true;
    button.setAttribute('aria-pressed','true');
    overlay.hidden = false;
    map.setLayoutProperty('axis-latitudes','visibility','visible');
    map.setMinZoom(getZoom());
    map.easeTo({center:[map.getCenter().lng,0],zoom:getZoom(),bearing:0,roll:23.5,duration:reducedMotion.matches?0:650});
    draw();
  });
  map.on('move',draw);
  map.on('resize',draw);
  return {
    get active(){return active;},
    disable,
    ready(){
      map.addLayer({id:'axis-latitudes',type:'line',source:'grid',filter:['in',['get','special'],['literal',['equator','tropic']]],layout:{visibility:'none'},paint:{'line-color':['match',['get','special'],'equator','#ffb9aa','#ffe09a'],'line-width':1.5,'line-dasharray':[5,3]}});
      ready=true; button.disabled=false;
    },
    projection(mode){disable(false);button.hidden=mode==='flat';},
  };
}
