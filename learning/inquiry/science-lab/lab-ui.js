/* Long sentence captions belong in document flow, not in a fixed SVG canvas.
 * Only explicitly semantic summary/note classes near the top/bottom qualify.
 * Bottom axis titles may flow below their graph; plotted ticks, objects and shapes stay put.
 */
(() => {
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
 function attach(svg){
  const viewport=document.createElement('div');viewport.className='figure-viewport';svg.before(viewport);viewport.append(svg);
  let notes=null,scheduled=false;
  const baseFonts=new WeakMap();
  function layout(){
   scheduled=false;
   const box=svg.viewBox.baseVal;
   const proseOnly=svg.matches('.graph-svg')&&svg.querySelector('text')&&![...svg.querySelectorAll('path,line,rect,circle,ellipse,polygon,polyline,image,use,foreignObject')].some(n=>!n.closest('defs'));
   viewport.hidden=!!proseOnly;
   if(!box.width||(!proseOnly&&!svg.getBoundingClientRect().width))return;
   const lines=proseOnly?[...svg.querySelectorAll('text')].map(t=>t.textContent.trim()).filter(Boolean):[];
   // Keep ordinary SVG labels legible on narrow screens; never shrink symbols.
   svg.style.minWidth=svg.hasAttribute('data-mobile-fit')?'0px':box.width+'px';
   const scale=proseOnly?1:svg.getBoundingClientRect().width/box.width;
   svg.querySelectorAll('text').forEach(text=>{
    if(!baseFonts.has(text))baseFonts.set(text,parseFloat(getComputedStyle(text).fontSize)||14);
    const font=baseFonts.get(text);if(font<=18)text.style.fontSize=Math.max(font,12/scale)+'px';
   });
   if(!proseOnly)svg.querySelectorAll('text.note-text,text.verdict-text,text.front-note,text.cmp-note,text.figure-caption').forEach(text=>{
    text.removeAttribute('data-figure-extracted');
    const b=text.getBBox(),atEdge=b.y<box.y+box.height*.18||b.y+b.height>box.y+box.height*.82;
    if(text.matches('.figure-caption')||(atEdge&&b.width>box.width*.67)||b.x<box.x||b.x+b.width>box.x+box.width||b.y<box.y||b.y+b.height>box.y+box.height){lines.push(text.textContent.trim());text.setAttribute('data-figure-extracted','');}
   });
   // Bottom axis titles are prose, not plotted coordinates. Give them a separate line.
   if(!proseOnly&&svg.matches('.graph-svg'))svg.querySelectorAll('text.axis-title:not(.figure-caption)').forEach(text=>{
    text.removeAttribute('data-figure-extracted');
    const b=text.getBBox();
    if(b.y>box.y+box.height*.72){lines.push('가로축: '+text.textContent.trim());text.setAttribute('data-figure-extracted','');}
   });
   if(lines.length){
    if(!notes){notes=document.createElement('div');notes.className='figure-notes';viewport.after(notes);}
    if(notes.dataset.copy!==lines.join('\n')){notes.replaceChildren(...lines.map(line=>{const p=document.createElement('p');p.textContent=line;return p;}));notes.dataset.copy=lines.join('\n');}
    notes.hidden=false;
   }else if(notes)notes.hidden=true;
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(layout);}};
  new MutationObserver(layout).observe(svg,{childList:true,subtree:true,characterData:true});
  new ResizeObserver(schedule).observe(svg);
  schedule();document.fonts?.ready.then(schedule);
 }
 document.querySelectorAll(selector).forEach(attach);
})();
