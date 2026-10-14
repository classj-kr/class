/* Long sentence captions belong in document flow, not in a fixed SVG canvas.
 * Only explicitly semantic summary/note classes near the top/bottom qualify.
 * Bottom axis titles may flow below their graph; plotted ticks, objects and shapes stay put.
 */
(() => {
 // Read the outcome beside the apparatus. Moving the existing node preserves
 // event handlers, live regions and the experiment's model state.
 document.querySelectorAll('.experiment-layout').forEach(layout=>{
  const controls=layout.querySelector(':scope > .control-panel');
  const stage=[...layout.children].find(n=>n.matches('.panel')&&n!==controls);
  const result=controls?.querySelector('.result-box');
  if(stage&&result){stage.append(result);result.classList.add('lab-observation-result');}
 });
 // A verdict belongs to the submitted answer, never to a subsequently edited answer.
 window.scienceInvalidatePrediction=()=>{
  const empty=document.getElementById('resultEmpty'),content=document.getElementById('resultContent'),feedback=document.getElementById('predictionResult');
  if(empty)empty.hidden=false;if(content)content.hidden=true;
  if(feedback){feedback.textContent='';feedback.classList.remove('correct','wrong','incorrect');delete feedback.dataset.correct;}
 };
 document.addEventListener('change',event=>{
  const input=event.target;
  if(!input.matches('.quiz-card input[type="radio"]'))return;
  const card=input.closest('.quiz-card'),feedback=card.querySelector('.answer-result'),why=card.querySelector('.answer-explanation');
  delete card.dataset.state;
  if(feedback){feedback.textContent='';feedback.classList.remove('correct','wrong','incorrect');}
  if(why)why.hidden=true;
 });
 const inkCanvas=document.createElement('canvas').getContext('2d');
 window.scienceTextInkBox=text=>{
  const b=text.getBBox(),style=getComputedStyle(text);
  inkCanvas.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
  const m=inkCanvas.measureText(text.textContent),y=text.getStartPositionOfChar(0).y;
  return{x:b.x,y:y-m.actualBoundingBoxAscent,width:b.width,height:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent};
 };
 const selector='svg.main-svg,svg.graph-svg,svg.scope-svg,svg.side-svg';
 // Earlier diagrams used pastel lettering intended for a dark canvas. Keep
 // each semantic hue, but choose readable ink against the actual painted shape
 // underneath the label (including pale bars and dark astronomical panels).
 const rgb=value=>{const n=value?.match(/^rgba?\(([^)]+)\)$/)?.[1].split(/[, /]+/).map(Number);return n?.length>=3?[...n.slice(0,3),n[3]??1]:null;};
 const luminance=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const blend=(front,back,alpha=front[3])=>front.slice(0,3).map((v,i)=>v*alpha+back[i]*(1-alpha));
 const adjustedInk=new WeakMap();
 function readableInk(svg){
  let base=[255,255,255];const parents=[];for(let n=svg;n;n=n.parentElement)parents.unshift(n);
  for(const n of parents){const c=rgb(getComputedStyle(n).backgroundColor);if(c)base=blend(c,base);}
  const paint=[];
  for(const node of svg.querySelectorAll('path,rect,circle,ellipse,polygon,text')){
   if(node.closest('defs,clipPath,mask')||!node.getClientRects().length)continue;
   const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden')continue;
   if(node.tagName!=='text'){
    const color=rgb(style.fill);if(!color||color[3]===0||style.fillOpacity==='0')continue;
    let alpha=color[3]*Number(style.fillOpacity);for(let p=node;p&&p!==svg;p=p.parentElement)alpha*=Number(getComputedStyle(p).opacity);
    if(alpha)paint.push({node,color,alpha,box:node.getBBox()});continue;
   }
   const previous=adjustedInk.get(node);
   if(previous&&node.style.fill===previous.adjusted)node.style.fill=previous.original;
   const original=node.style.fill,color=rgb(getComputedStyle(node).fill);if(!color||!node.textContent.trim())continue;
   const box=node.getBBox(),point=new DOMPoint(box.x+box.width/2,box.y+box.height/2),matrix=node.getCTM();
   if(!matrix)continue;
   const global=point.matrixTransform(matrix);let background=base;
   for(const item of paint){
    const matrix=item.node.getCTM();if(!matrix)continue;const local=global.matrixTransform(matrix.inverse()),b=item.box;
    if(local.x<b.x||local.x>b.x+b.width||local.y<b.y||local.y>b.y+b.height)continue;
    if(item.node.isPointInFill(local))background=blend(item.color,background,item.alpha);
   }
   if(contrast(blend(color,background),background)>=4.5){adjustedInk.delete(node);continue;}
   const dark=[14,27,36],light=[255,255,255],target=contrast(dark,background)>contrast(light,background)?dark:light;let chosen=color;
   for(let amount=.08;amount<=1.001;amount+=.08){chosen=color.slice(0,3).map((v,i)=>Math.round(v*(1-Math.min(amount,1))+target[i]*Math.min(amount,1)));if(contrast(chosen,background)>=4.5)break;}
   node.style.fill='rgb('+chosen.slice(0,3).join(', ')+')';adjustedInk.set(node,{original,adjusted:node.style.fill});
  }
 }
 let figureNumber=0;
 function attach(svg){
  const viewport=document.createElement('div');viewport.className='figure-viewport';svg.before(viewport);viewport.append(svg);
  const figureName=svg.matches('.graph-svg')?'자료 그림':'관찰 그림';
  viewport.id='lab-figure-'+(++figureNumber);viewport.setAttribute('role','region');viewport.setAttribute('aria-label',figureName);
  const toolbar=document.createElement('div');toolbar.className='figure-tools';toolbar.hidden=true;
  const zoom=document.createElement('button');zoom.type='button';zoom.textContent='그림 확대';zoom.setAttribute('aria-controls',viewport.id);zoom.setAttribute('aria-pressed','false');toolbar.append(zoom);viewport.before(toolbar);
  const hint=document.createElement('span');hint.textContent='좌우로 움직여 볼 수 있습니다';hint.hidden=true;toolbar.append(hint);
  let notes=null,scheduled=false,expanded=false;
  function layout(){
   scheduled=false;
   const box=svg.viewBox.baseVal;
   const proseOnly=svg.matches('.graph-svg')&&svg.querySelector('text')&&![...svg.querySelectorAll('path,line,rect,circle,ellipse,polygon,polyline,image,use,foreignObject')].some(n=>!n.closest('defs'));
   viewport.hidden=!!proseOnly;
   if(!box.width||(!proseOnly&&!svg.getBoundingClientRect().width))return;
   if(!proseOnly)readableInk(svg);
   const lines=proseOnly?[...svg.querySelectorAll('text')].map(t=>t.textContent.trim()).filter(Boolean):[];
   // A phone first shows the complete apparatus. The same SVG can be enlarged
   // for reading labels; model state and event handlers stay on the original node.
   const narrow=viewport.clientWidth<box.width-1&&!svg.hasAttribute('data-mobile-fit');
   toolbar.hidden=!narrow||!!proseOnly;if(!narrow)expanded=false;
   const fitted=narrow&&!expanded;
   svg.style.minWidth=fitted||svg.hasAttribute('data-mobile-fit')?'0px':box.width+'px';
   zoom.textContent=expanded?'전체 보기':'그림 확대';zoom.setAttribute('aria-label',figureName+(expanded?' 전체 보기':' 확대'));zoom.setAttribute('aria-pressed',String(expanded));hint.hidden=!expanded;viewport.tabIndex=expanded?0:-1;
   if(!proseOnly)svg.querySelectorAll('text.note-text,text.verdict-text,text.front-note,text.cmp-note,text.figure-caption').forEach(text=>{
    text.removeAttribute('data-figure-extracted');
    const b=text.getBBox(),atEdge=b.y<box.y+box.height*.18||b.y+b.height>box.y+box.height*.82;
    if(text.matches('.figure-caption')||(atEdge&&b.width>box.width*.67)||b.x<box.x||b.x+b.width>box.x+box.width||b.y<box.y||b.y+b.height>box.y+box.height){lines.push(text.textContent.trim());text.setAttribute('data-figure-extracted','');}
   });
   // Bottom labels may be axis names, legends or scientific conditions. Keep
   // the author's meaning when moving them into document flow; position alone
   // does not make a caption an x-axis title.
   if(!proseOnly&&svg.matches('.graph-svg'))svg.querySelectorAll('text.axis-title:not(.figure-caption)').forEach(text=>{
    text.removeAttribute('data-figure-extracted');
    const b=text.getBBox();
    if(b.y>box.y+box.height*.72){lines.push(text.textContent.trim());text.setAttribute('data-figure-extracted','');}
   });
   if(lines.length){
    if(!notes){notes=document.createElement('div');notes.className='figure-notes';viewport.after(notes);}
    if(notes.dataset.copy!==lines.join('\n')){notes.replaceChildren(...lines.map(line=>{const p=document.createElement('p');p.textContent=line;return p;}));notes.dataset.copy=lines.join('\n');}
    notes.hidden=false;
   }else if(notes)notes.hidden=true;
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(layout);}};
  zoom.addEventListener('click',()=>{expanded=!expanded;viewport.scrollLeft=0;layout();});
  new MutationObserver(layout).observe(svg,{childList:true,subtree:true,characterData:true});
  new ResizeObserver(schedule).observe(svg);
  new ResizeObserver(schedule).observe(viewport);
  schedule();document.fonts?.ready.then(schedule);
 }
 document.querySelectorAll(selector).forEach(attach);
})();

// SVG coordinates describe apparatus geometry, not the size of printed letters.
// Apply the same reading scale to both original and dynamically inserted figures.
(() => {
 const root=document.querySelector('main');if(!root)return;
 const authored=new WeakMap(),observed=new WeakSet(),pending=new Set();let frame=0;
 const pictogram=s=>/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(s);
 function normalize(svg){
  if(!svg.isConnected||!svg.getBoundingClientRect().width)return;
  for(const text of svg.querySelectorAll('text')){
   if(text.closest('defs,clipPath,mask')||!text.textContent.trim()||pictogram(text.textContent.trim()))continue;
   const matrix=text.getScreenCTM();if(!matrix)continue;
   const scale=Math.hypot(matrix.c,matrix.d);if(!scale)continue;
   if(!authored.has(text))authored.set(text,parseFloat(getComputedStyle(text).fontSize)||14);
   const pixels=Math.max(14,Math.min(16,authored.get(text)));
   const size=(pixels/scale).toFixed(4)+'px';
   if(text.style.fontSize!==size)text.style.setProperty('font-size',size,'important');
  }
 }
 function flush(){frame=0;for(const svg of pending)normalize(svg);pending.clear();}
 function queue(svg){if(!svg)return;pending.add(svg);if(!frame)frame=requestAnimationFrame(flush);}
 const resize=new ResizeObserver(entries=>{for(const e of entries)normalize(e.target);});
 function discover(node){if(node.nodeType!==1)return;const list=node.matches('svg')?[node]:node.querySelectorAll('svg');for(const svg of list){if(!observed.has(svg)){observed.add(svg);resize.observe(svg);}normalize(svg);queue(svg);}}
 discover(root);
 // Animated lessons replace their text every frame. Normalize in the mutation
 // microtask, before paint, rather than one frame after the labels were replaced.
 new MutationObserver(records=>{const changed=new Set();for(const r of records){const svg=r.target.nodeType===1?r.target.closest('svg'):r.target.parentElement?.closest('svg');if(svg)changed.add(svg);for(const n of r.addedNodes)discover(n);}for(const svg of changed)normalize(svg);}).observe(root,{childList:true,subtree:true,characterData:true});
 document.fonts?.ready.then(()=>discover(root));
})();
