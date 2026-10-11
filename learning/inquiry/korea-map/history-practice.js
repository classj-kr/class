(function () {
  'use strict';
  let dialog, opener, questionMap, mapLayers, resizeObserver, placeLabels;
  function releaseMap() {
    resizeObserver?.disconnect();resizeObserver=null;
    questionMap?.remove();questionMap=null;mapLayers=null;placeLabels=null;
  }
  function drawQuestion(q, container, api) {
    if(!q?.map){container.hidden=true;return;}
    container.hidden=false;
    if(!questionMap){
      questionMap=api.createBaseMap(container,{minZoom:3,zoomControl:true,scrollWheelZoom:false});
      questionMap.getPane('borderLines').style.display='none';
      questionMap.getPane('themeLabels').style.display='none';
      mapLayers=L.layerGroup().addTo(questionMap);
      const north=L.control({position:'topright'});
      north.onAdd=()=>{const node=document.createElement('span');node.className='history-question-north';node.textContent='↑ 북';return node;};
      north.addTo(questionMap);
      resizeObserver=new ResizeObserver(()=>questionMap?.invalidateSize({pan:false}));
      resizeObserver.observe(container);
    }
    if(placeLabels)questionMap.off('zoomend moveend',placeLabels);
    mapLayers.clearLayers();
    const spec=q.map;
    questionMap.setMaxZoom(spec.maxZoom||12);
    if(spec.localDetail)window.KoreaHistoryLocalMap.draw(questionMap,mapLayers,spec.localMap);
    const lineStyle={color:'#265e75',weight:3,opacity:.9,interactive:false};
    (spec.routes||[]).forEach(route=>L.polyline(route.map(xy=>[xy[1],xy[0]]),lineStyle).addTo(mapLayers));
    const markers=L.layerGroup().addTo(mapLayers);
    placeLabels=()=>{
      markers.clearLayers();const placed=[],size=questionMap.getSize();
      spec.points.forEach(point=>{
        const coordinate=L.latLng(point.xy[1],point.xy[0]),pixel=questionMap.latLngToContainerPoint(coordinate);
        const candidates=[[0,0],[34,-24],[-34,24],[34,24],[-34,-24],[0,-48],[0,48],[55,0],[-55,0]];
        const offset=candidates.find(([dx,dy])=>pixel.x+dx>18&&pixel.x+dx<size.x-18&&pixel.y+dy>18&&pixel.y+dy<size.y-18&&placed.every(p=>Math.hypot(p.x-pixel.x-dx,p.y-pixel.y-dy)>38))||[0,0];
        const end=L.point(pixel.x+offset[0],pixel.y+offset[1]);placed.push(end);
        if(offset[0]||offset[1]){
          L.polyline([coordinate,questionMap.containerPointToLatLng(end)],{color:'#163f4b',weight:1.5,interactive:false}).addTo(markers);
          L.circleMarker(coordinate,{radius:3,color:'#163f4b',fillOpacity:1,interactive:false}).addTo(markers);
        }
        const label=document.createElement('span');label.className='history-question-marker';label.textContent=point.label;
        L.marker(coordinate,{icon:L.divIcon({html:label,className:'history-question-marker-wrap',iconSize:[32,32],iconAnchor:[16-offset[0],16-offset[1]]}),interactive:false,keyboard:false}).addTo(markers);
      });
    };
    questionMap.invalidateSize({pan:false});
    const b=spec.bounds;
    questionMap.fitBounds([[b[1],b[0]],[b[3],b[2]]],{padding:[30,30],animate:false,maxZoom:spec.maxZoom||8});
    placeLabels();questionMap.on('zoomend moveend',placeLabels);
    container.setAttribute('aria-label',spec.alt);
  }
  function open(scene,api) {
    const S=window.SchoolLevel, items=window.HistoryQuestions.forLevel(scene.id,S.value);
    if(!items.length)return;
    opener=document.activeElement;
    releaseMap();dialog?.remove();
    dialog=document.createElement('dialog');dialog.className='history-practice-dialog';
    const heading=document.createElement('header'), title=document.createElement('h2'), close=document.createElement('button');
    title.id='historyPracticeTitle';title.textContent=scene.title;
    dialog.setAttribute('aria-labelledby',title.id);
    close.type='button';close.className='history-button';close.textContent='닫기';close.setAttribute('aria-label','문제 닫기');
    close.addEventListener('click',()=>dialog.close());
    heading.append(title,close);
    const body=document.createElement('div');body.className='history-practice-body';
    const map=document.createElement('div');map.className='history-question-map';map.hidden=true;map.setAttribute('role','region');
    const host=document.createElement('div');host.className='history-question-host';
    const hasMap=items.some(q=>q.map);
    dialog.classList.toggle('has-question-map',hasMap);
    body.append(map,host);dialog.append(heading,body);document.body.append(dialog);
    dialog.showModal();
    S.practice(host,items,`history:${scene.id}:${S.value}`,{onQuestion:q=>{
      drawQuestion(q,map,api);
      dialog.classList.toggle('has-question-map',!!q?.map);
      host.scrollTop=0;
    }});
    dialog.addEventListener('close',()=>{releaseMap();if(opener?.isConnected)opener.focus({preventScroll:true});});
    close.focus();
  }
  window.SchoolLevel?.subscribe(()=>{if(dialog?.open)dialog.close();});
  window.KoreaHistoryPractice={open};
})();
