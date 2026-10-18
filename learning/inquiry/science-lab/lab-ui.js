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
  // Hidden captions and newly detached text have no addressable SVG characters.
  if(!text.getNumberOfChars())return {x:b.x,y:b.y,width:b.width,height:b.height};
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
   // Dense labels keep their spacing on split screens instead of shrinking.
   const readableWidth=Number(svg.dataset.readableWidth)||0;
   const narrow=viewport.clientWidth<(readableWidth||box.width)-1&&!svg.hasAttribute('data-mobile-fit');
   toolbar.hidden=!narrow||!!proseOnly;if(!narrow)expanded=false;
   const fitted=narrow&&!expanded&&!readableWidth;
   svg.style.minWidth=readableWidth?readableWidth+'px':fitted||svg.hasAttribute('data-mobile-fit')?'0px':box.width+'px';
   zoom.hidden=!!readableWidth;
   zoom.textContent=expanded?'전체 보기':'그림 확대';zoom.setAttribute('aria-label',figureName+(expanded?' 전체 보기':' 확대'));zoom.setAttribute('aria-pressed',String(expanded));hint.hidden=!(expanded||readableWidth&&narrow);viewport.tabIndex=expanded||readableWidth&&narrow?0:-1;
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
  new MutationObserver(records=>{
   if(records.some(r=>r.target.nodeType===3||r.target.closest?.('text')||[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches('text')||n.querySelector('text')))))schedule();
  }).observe(svg,{childList:true,subtree:true,characterData:true});
  new ResizeObserver(schedule).observe(svg);
  new ResizeObserver(schedule).observe(viewport);
  schedule();document.fonts?.ready.then(schedule);
 }
 document.querySelectorAll(selector).forEach(attach);
})();

// A single inexpensive material palette for apparatus, never analytical fills.
// Gradients render in the compositor without blur filters or raster textures.
(() => {
 const ns='http://www.w3.org/2000/svg',palette=document.createElementNS(ns,'svg');
 palette.setAttribute('aria-hidden','true');palette.setAttribute('width','0');palette.setAttribute('height','0');
 palette.style.cssText='position:absolute;pointer-events:none;overflow:hidden';
 palette.innerHTML='<defs>'+[
  ['glass',['#ffffff88','#dcecf02b','#f5fcff66','#a8c2ce55']],
  ['steel',['#526b7a','#b5c9d3','#f2f8fa','#7893a3']],
  ['dark-metal',['#2a4555','#527080','#263f4f']],
  ['wood',['#dbc6a0','#b99565','#987747']],
  ['copper',['#89502e','#e4b77d','#ab6e39']],
  ['north',['#f9b6a4','#d76b58','#ac4438']],
  ['south',['#9ed7eb','#5d9fbc','#336e90']]
 ].map(([name,colors])=>'<linearGradient id="science-material-'+name+'">'+colors.map((c,i)=>'<stop offset="'+i/(colors.length-1)+'" stop-color="'+c+'"/>').join('')+'</linearGradient>').join('')+'</defs>';
 document.body.prepend(palette);
})();

// SVG coordinates describe apparatus geometry, not the size of printed letters.
// Apply the same reading scale to both original and dynamically inserted figures.
(() => {
 const root=document.querySelector('main');if(!root)return;
 const authored=new WeakMap(),observed=new WeakSet(),scales=new WeakMap(),pending=new Set();let frame=0;
 const pictogram=s=>/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(s);
 function normalize(svg,onlyNew=false){
  if(!svg.isConnected||!svg.getBoundingClientRect().width)return;
  const rootMatrix=svg.getScreenCTM(),rootScale=rootMatrix?Math.hypot(rootMatrix.c,rootMatrix.d):0;
  if(scales.get(svg)!==rootScale){onlyNew=false;scales.set(svg,rootScale);}
  if(onlyNew&&![...svg.querySelectorAll('text')].some(t=>!authored.has(t)))return;
  for(const text of svg.querySelectorAll('text')){
   if(onlyNew&&authored.has(text))continue;
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
 window.scienceNormalizeFigure=normalize;
 function queue(svg){if(!svg)return;pending.add(svg);if(!frame)frame=requestAnimationFrame(flush);}
 const containers=new Map(),containerOf=new WeakMap();
 const resize=new ResizeObserver(entries=>{for(const e of entries){if(e.target.localName==='svg')queue(e.target);else for(const svg of containers.get(e.target)||[])queue(svg);}});
 function watch(svg){
  if(observed.has(svg))return;observed.add(svg);resize.observe(svg);
  let parent=svg.parentElement;while(parent?.namespaceURI==='http://www.w3.org/2000/svg')parent=parent.parentElement;
  if(parent){if(!containers.has(parent)){containers.set(parent,new Set());resize.observe(parent);}containers.get(parent).add(svg);containerOf.set(svg,parent);}
 }
 function unwatch(svg){resize.unobserve(svg);observed.delete(svg);pending.delete(svg);const parent=containerOf.get(svg),siblings=containers.get(parent);siblings?.delete(svg);if(siblings&&!siblings.size){resize.unobserve(parent);containers.delete(parent);}containerOf.delete(svg);}
 function discover(node){if(node.nodeType!==1)return;const list=node.matches('svg')?[node]:node.querySelectorAll('svg');for(const svg of list){watch(svg);normalize(svg);queue(svg);}}
 discover(root);
 // Animated lessons replace their text every frame. Normalize in the mutation
 // microtask, before paint, rather than one frame after the labels were replaced.
 new MutationObserver(records=>{
  const changed=new Set();
  for(const r of records){
   const svg=r.target.nodeType===1?r.target.closest('svg'):r.target.parentElement?.closest('svg');if(svg)changed.add(svg);
   for(const n of r.addedNodes)if(n.nodeType===1){if(n.matches('svg'))changed.add(n);for(const s of n.querySelectorAll('svg'))changed.add(s);}
   for(const n of r.removedNodes)if(n.nodeType===1){const removed=n.matches('svg')?[n]:n.querySelectorAll('svg');for(const s of removed)if(!s.isConnected)unwatch(s);}
  }
  for(const svg of changed){watch(svg);normalize(svg,true);}
 }).observe(root,{childList:true,subtree:true,characterData:true});
 document.fonts?.ready.then(()=>discover(root));
 window.addEventListener('resize',()=>{for(const svg of root.querySelectorAll('svg'))queue(svg);});
 // A retained SVG can change its viewBox without changing its CSS size.
 // Likewise a renderer may replace a label's style without replacing the node.
 new MutationObserver(records=>{
  const figures=new Set();
  for(const r of records){const e=r.target;
   if(r.attributeName==='viewBox'||r.attributeName==='transform'&&/\b(?:scale|matrix)\(/.test((e.getAttribute('transform')||'')+' '+r.oldValue)||r.attributeName==='style'&&e.localName==='svg'&&r.oldValue!==e.getAttribute('style')||e.localName==='text'&&e.style.getPropertyPriority('font-size')!=='important'){
    const svg=e.closest('svg');if(svg)figures.add(svg);
   }
  }
  for(const svg of figures)normalize(svg);
 }).observe(root,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['viewBox','transform','style']});
})();

// Keep experiment choices in sight. The original select remains the model's
// value source; touch, keyboard, resets and dependent options share that state.
(() => {
 const root=document.querySelector('main');if(!root)return;
 const enhanced=new WeakMap();
 function enhance(select){
  if(enhanced.has(select)||select.multiple||select.size>1)return;
  const group=document.createElement('span');group.className='lab-choice-group';group.setAttribute('role','radiogroup');
  const label=select.labels?.[0]?.cloneNode(true);label?.querySelectorAll('select,input,output,button,.lab-choice-group').forEach(n=>n.remove());
  const name=select.getAttribute('aria-label')||label?.textContent.trim()||'실험 조건';group.setAttribute('aria-label',name);
  group.dataset.for=select.id;select.after(group);select.classList.add('lab-choice-native');select.setAttribute('aria-hidden','true');select.tabIndex=-1;
  let signature='',buttons=[],search=null,renderedState='';
  function sync(){
   const options=[...select.options],next=JSON.stringify(options.map(o=>[o.value,o.text,o.disabled,o.hidden,o.parentElement.disabled]));
   if(signature!==next){signature=next;buttons=options.map((option,index)=>{
    const b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.textContent=option.text;b.hidden=option.hidden;b.dataset.option=String(index);
    b.addEventListener('click',()=>choose(index));return b;
   });group.replaceChildren(...buttons);}
   if(options.length>10&&!search){search=document.createElement('input');search.type='search';search.className='lab-choice-search';search.setAttribute('aria-label',name+' 찾기');search.placeholder=name+' 찾기';group.before(search);search.addEventListener('input',sync);}
   const disabled=select.matches(':disabled');
   // Lesson render loops often assign the same condition every frame. Keep
   // their visible choices intact until the options or selection really change.
   const state=JSON.stringify([signature,select.selectedIndex,disabled,select.hidden,search?.value||'']);
   if(state===renderedState)return;
   renderedState=state;
   if(search){search.hidden=select.hidden||options.length<=10;search.disabled=disabled;}
   group.toggleAttribute('data-many',options.length>10);group.toggleAttribute('data-compact',options.length<=8&&options.every(o=>o.text.trim().length<=3));group.hidden=select.hidden||options.length===0;group.setAttribute('aria-disabled',String(disabled));
   buttons.forEach((b,i)=>{const selected=i===select.selectedIndex;b.hidden=options[i].hidden||!!(search&&!search.hidden&&search.value&&!b.textContent.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));b.setAttribute('aria-checked',String(selected));b.disabled=disabled||options[i].disabled||!!options[i].parentElement.disabled;b.tabIndex=selected&&!b.disabled&&!b.hidden?0:-1;});
   if(!buttons.some(b=>b.tabIndex===0)){const first=buttons.find(b=>!b.disabled&&!b.hidden);if(first)first.tabIndex=0;}
  }
  function choose(index){if(select.matches(':disabled')||buttons[index]?.disabled)return;select.selectedIndex=index;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));sync();}
  group.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
   const available=buttons.filter(b=>!b.disabled&&!b.hidden);if(!available.length)return;event.preventDefault();
   let index=available.indexOf(document.activeElement),n=available.length;
   index=event.key==='Home'?0:event.key==='End'?n-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+n)%n;
   available[index].focus();choose(Number(available[index].dataset.option));
  });
  for(const property of ['value','selectedIndex']){
   const descriptor=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,property);
   Object.defineProperty(select,property,{configurable:true,get(){return descriptor.get.call(this);},set(value){descriptor.set.call(this,value);sync();}});
  }
  select.addEventListener('change',sync);select.addEventListener('input',sync);
  // Existing lesson shortcuts focus their source field. Send focus to its
  // visible choice, including when a diagram selects an atom or a specimen.
  select.focus=options=>(buttons.find(b=>b.tabIndex===0)||buttons.find(b=>!b.hidden&&!b.disabled))?.focus(options);
  select.labels?.forEach(label=>label.addEventListener('click',event=>{if(event.target===label||event.target.nodeType===1&&!event.target.closest('button,input,a,select')){event.preventDefault();select.focus();}}));
  new MutationObserver(sync).observe(select,{attributes:true,childList:true,subtree:true,characterData:true});
  select.form?.addEventListener('reset',()=>requestAnimationFrame(sync));enhanced.set(select,{group,sync});sync();
 }
 function discover(node){if(node.nodeType!==1)return;if(node.matches('select'))enhance(node);for(const select of node.querySelectorAll('select'))enhance(select);}
 discover(root);
 new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)discover(n);}).observe(root,{childList:true,subtree:true});
})();
