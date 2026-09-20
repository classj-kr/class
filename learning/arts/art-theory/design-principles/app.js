(()=>{
'use strict';
const M=CompositionStudio,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',storageKey='art-composition-studio-v2';
let items=M.initial(),reference=null,records=[],selected=1,nextId=5,nextRecord=1,undo=[],redo=[],drag=null,rangeBefore=null;
let storageAvailable=true;
try{const data=JSON.parse(localStorage.getItem(storageKey)||'null');if(data&&data.version===2&&M.valid(data.items)&&(!data.reference||M.valid(data.reference))&&Array.isArray(data.records)&&data.records.length<=30&&data.records.every(r=>Number.isSafeInteger(r.id)&&r.id>0&&M.valid(r.items))){items=M.clone(data.items);reference=M.clone(data.reference);records=M.clone(data.records);$('compareToggle').checked=!!data.compare&&!!reference;selected=items[0]?.id??null;nextId=Math.max(0,...items.map(i=>i.id),...(reference||[]).map(i=>i.id),...records.flatMap(r=>r.items.map(i=>i.id)))+1;nextRecord=Math.max(0,...records.map(r=>r.id))+1;}}catch{storageAvailable=false;}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({version:2,items,reference,records,compare:$('compareToggle').checked}));storageAvailable=true;$('storageStatus').textContent='이 브라우저에 저장됨';}catch{storageAvailable=false;$('storageStatus').textContent='브라우저 저장 불가 · 그림을 내려받아 보관하세요.';}}
function status(message){$('editStatus').textContent=message;}
function pushUndo(before){if(JSON.stringify(before)===JSON.stringify(items))return;undo.push(M.clone(before));if(undo.length>60)undo.shift();redo=[];persist();}
function finishRange(){if(rangeBefore){pushUndo(rangeBefore);rangeBefore=null;}}
function edit(action,message=''){finishRange();const before=M.clone(items);action();pushUndo(before);render();if(message)status(message);}
function history(direction){finishRange();const from=direction==='undo'?undo:redo,to=direction==='undo'?redo:undo;if(!from.length)return;to.push(M.clone(items));items=from.pop();if(!items.some(i=>i.id===selected))selected=items[0]?.id??null;persist();render();status(direction==='undo'?'이전 상태로 되돌렸습니다.':'다시 적용했습니다.');}
function renderCanvas(){
 const canvas=$('canvas'),focusId=document.activeElement?.dataset?.object;
 for(const child of [...canvas.children])if(!items.some(i=>String(i.id)===child.dataset.object))child.remove();
 items.forEach((item,index)=>{
  let group=canvas.querySelector(`[data-object="${item.id}"]`);if(!group){group=document.createElementNS(NS,'g');group.dataset.object=item.id;group.setAttribute('tabindex','0');group.setAttribute('role','button');canvas.append(group);}
  if(canvas.children[index]!==group)canvas.insertBefore(group,canvas.children[index]||null);
  group.setAttribute('transform',`translate(${item.x} ${item.y})`);group.setAttribute('aria-label',M.shapes[item.shape]+' '+item.id+', '+M.colors.find(c=>c.value===item.color).name);group.setAttribute('aria-pressed',String(selected===item.id));
  const half=item.size/2+6;group.innerHTML=M.markup(item)+(selected===item.id?`<rect class="selection-mark" x="${-half}" y="${-half}" width="${half*2}" height="${half*2}"/>`:'');
 });
 if(focusId&&document.activeElement?.dataset?.object!==focusId)canvas.querySelector(`[data-object="${focusId}"]`)?.focus({preventScroll:true});
}
function render(){
 renderCanvas();const item=items.find(i=>i.id===selected);
 $('selectionControls').hidden=!item;$('emptySelection').hidden=!!item;$('selectionTitle').textContent=item?M.shapes[item.shape]+' '+item.id:'도형 선택';
 if(item){$('positionX').value=item.x;$('positionY').value=item.y;$('objectSize').value=item.size;$('positionXValue').value=Math.round(item.x/6)+'%';$('positionYValue').value=Math.round(item.y/4)+'%';$('objectSizeValue').value=Math.round(item.size/6)+'%';
  for(const [id,out] of [['positionX','positionXValue'],['positionY','positionYValue'],['objectSize','objectSizeValue']])$(id).setAttribute('aria-valuetext',$(out).value);
 }
 $('colors').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(item?.color===button.dataset.color)));
 $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;$('clearCanvas').disabled=!items.length;
 document.querySelectorAll('[data-add]').forEach(b=>b.disabled=items.length>=40);$('duplicate').disabled=!item||items.length>=40;
 $('bringFront').disabled=!item||items.at(-1)?.id===selected;$('sendBack').disabled=!item||items[0]?.id===selected;
 $('objectCount').textContent=items.length+'개';$('compareToggle').disabled=!reference;
 const compare=!!reference&&$('compareToggle').checked;$('referenceBoard').hidden=!compare;$('currentCaption').hidden=!compare;$('boards').classList.toggle('comparing',compare);
 if(reference)$('referenceCanvas').innerHTML=M.scene(reference);
}
for(const color of M.colors){const button=document.createElement('button');button.dataset.color=color.value;button.innerHTML=`<i style="background:${color.value}" aria-hidden="true"></i>`;button.append(document.createTextNode(color.name));button.addEventListener('click',()=>{if(selected!==null)edit(()=>{items=M.change(items,selected,{color:color.value})})});$('colors').append(button);}
for(const button of document.querySelectorAll('[data-add]'))button.addEventListener('click',()=>{if(items.length>=40){status('한 구성에 도형 40개까지 놓을 수 있습니다.');return;}edit(()=>{const offset=items.length%5*16;const item={id:nextId++,shape:button.dataset.add,x:270+offset,y:170+offset,size:70,color:M.colors[0].value};items.push(item);selected=item.id;},'도형을 추가했습니다. 끌어서 배치하세요.');});
$('undo').addEventListener('click',()=>history('undo'));$('redo').addEventListener('click',()=>history('redo'));
$('duplicate').addEventListener('click',()=>{const item=items.find(i=>i.id===selected);if(!item||items.length>=40)return;edit(()=>{const copy=M.constrain({...item,id:nextId++,x:item.x+24,y:item.y+24});items.push(copy);selected=copy.id;},'선택한 도형을 복제했습니다.');});
function remove(){if(selected===null)return;edit(()=>{items=items.filter(i=>i.id!==selected);selected=items[0]?.id??null;},'도형을 삭제했습니다. 되돌리기로 복원할 수 있습니다.');$('canvas').focus({preventScroll:true});}
$('remove').addEventListener('click',remove);
for(const [id,front] of [['bringFront',true],['sendBack',false]])$(id).addEventListener('click',()=>edit(()=>{const item=items.find(i=>i.id===selected);if(!item)return;items=items.filter(i=>i.id!==selected);if(front)items.push(item);else items.unshift(item);}));
$('clearCanvas').addEventListener('click',()=>edit(()=>{items=[];selected=null;},'작업판을 비웠습니다. 되돌리기로 복원할 수 있습니다.'));
for(const [id,key] of [['positionX','x'],['positionY','y'],['objectSize','size']]){
 $(id).addEventListener('input',event=>{if(selected===null)return;if(!rangeBefore)rangeBefore=M.clone(items);items=M.change(items,selected,{[key]:Number(event.target.value)});render();});
 $(id).addEventListener('change',()=>{finishRange();render()});$(id).addEventListener('blur',()=>{finishRange();render()});
}
function point(event){const p=$('canvas').createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform($('canvas').getScreenCTM().inverse());}
$('canvas').addEventListener('pointerdown',event=>{
 if(event.button!==0||drag)return;finishRange();const target=event.target.closest('[data-object]');
 if(!target){selected=null;render();return;}selected=Number(target.dataset.object);const item=items.find(i=>i.id===selected),p=point(event);
 drag={id:event.pointerId,selected,before:M.clone(items),dx:p.x-item.x,dy:p.y-item.y};$('canvas').setPointerCapture(event.pointerId);render();$('canvas').querySelector(`[data-object="${selected}"]`).focus({preventScroll:true});event.preventDefault();
});
$('canvas').addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const p=point(event);items=M.change(items,drag.selected,{x:Math.round(p.x-drag.dx),y:Math.round(p.y-drag.dy)});render();});
function finishDrag(event,cancel=false){if(!drag||drag.id!==event.pointerId)return;const old=drag;drag=null;if(cancel)items=old.before;else pushUndo(old.before);if($('canvas').hasPointerCapture(event.pointerId))$('canvas').releasePointerCapture(event.pointerId);render();}
$('canvas').addEventListener('pointerup',event=>finishDrag(event));$('canvas').addEventListener('pointercancel',event=>finishDrag(event,true));$('canvas').addEventListener('lostpointercapture',event=>finishDrag(event,true));
$('canvas').addEventListener('focusin',event=>{const id=Number(event.target.dataset.object);if(id&&id!==selected){selected=id;render();}});
$('canvas').addEventListener('keydown',event=>{
 if(drag)return;const id=Number(event.target.dataset.object);if(id)selected=id;
 const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
 if(directions[event.key]&&selected!==null){event.preventDefault();const item=items.find(i=>i.id===selected),[dx,dy]=directions[event.key],step=event.shiftKey?20:5;if(item)edit(()=>{items=M.change(items,selected,{x:item.x+dx*step,y:item.y+dy*step})});}
 else if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();remove();}
 else if(event.key==='Escape'){event.preventDefault();selected=null;render();$('canvas').focus({preventScroll:true});}
});
document.addEventListener('keydown',event=>{if(drag||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))return;if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();history(event.shiftKey?'redo':'undo');}});
$('pinReference').addEventListener('click',()=>{finishRange();reference=M.clone(items);$('compareToggle').checked=true;persist();render();status('기준 구성을 남겼습니다. 현재 구성을 바꿔 비교하세요.');});
$('compareToggle').addEventListener('change',()=>{render();persist()});
function renderRecords(){
 $('records').replaceChildren();for(const record of records){const row=document.createElement('article');row.className='saved-composition';const preview=document.createElementNS(NS,'svg');preview.setAttribute('viewBox','0 0 600 400');preview.setAttribute('role','img');preview.setAttribute('aria-label','구성 '+record.id);preview.innerHTML=M.scene(record.items);
 const description=document.createElement('div'),title=document.createElement('h3'),count=document.createElement('p');title.textContent='구성 '+record.id;count.textContent=record.items.length+'개의 도형';description.append(title,count);
 const actions=document.createElement('div');actions.className='saved-actions';for(const [action,label] of [['load','불러오기'],['compare','비교 기준으로'],['delete','삭제']]){const button=document.createElement('button');button.textContent=label;button.dataset[action]=record.id;button.setAttribute('aria-label','구성 '+record.id+' '+label);button.addEventListener('click',()=>{if(action==='load'){edit(()=>{items=M.clone(record.items);selected=items[0]?.id??null;},'저장한 구성을 불러왔습니다.');$('canvas').focus();}else if(action==='compare'){reference=M.clone(record.items);$('compareToggle').checked=true;persist();render();$('canvas').focus();}else{records=records.filter(r=>r.id!==record.id);persist();renderRecords();$('saveComposition').focus();$('recordStatus').textContent='저장한 구성을 삭제했습니다.';}});actions.append(button);}row.append(preview,description,actions);$('records').append(row);}
}
$('saveComposition').addEventListener('click',()=>{finishRange();if(!items.length){status('도형을 놓은 뒤 저장하세요.');return;}if(records.length>=30){status('구성 30개를 저장했습니다. 필요 없는 저장 구성을 삭제한 뒤 다시 저장하세요.');return;}records.push({id:nextRecord++,items:M.clone(items)});persist();renderRecords();status('현재 구성을 저장했습니다.');});
$('exportWork').addEventListener('click',()=>{finishRange();const url=URL.createObjectURL(new Blob([M.exportSvg(items)],{type:'image/svg+xml'})),link=document.createElement('a');link.href=url;link.download='나의-구성.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
window.addEventListener('pagehide',()=>{finishRange();if(drag)persist();});
render();renderRecords();$('storageStatus').textContent=storageAvailable?'작업은 이 브라우저에 자동 저장됩니다.':'브라우저 저장 불가 · 그림을 내려받아 보관하세요.';
})();
