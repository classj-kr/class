(() => {
'use strict';
const M=window.ArtExperience, $=id=>document.getElementById(id), all=selector=>Array.from(document.querySelectorAll(selector)), NS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={})=>{const node=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,value));return node;};
const pressed=(nodes,match)=>nodes.forEach(node=>node.setAttribute('aria-pressed',String(match(node))));
const point=(scene,event)=>new DOMPoint(event.clientX,event.clientY).matrixTransform(scene.getScreenCTM().inverse());
function activity(){const name=['color','pattern','emphasis'].includes(location.hash.slice(1))?location.hash.slice(1):'color';all('.activity').forEach(section=>section.hidden=section.id!==name);all('[data-activity]').forEach(link=>{if(link.dataset.activity===name)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}
window.addEventListener('hashchange',activity);activity();

// Ten hues follow the order used by the elementary textbooks. These are screen samples.
const initialColor=()=>({wing:1,leaf:4,target:'wing',x:400,y:267,outline:false});
let color=initialColor(),drag=null;
M.colors.forEach((c,i)=>{const b=document.createElement('button'),angle=(i*36-90)*Math.PI/180;b.type='button';b.dataset.hue=i;b.style.left=(50+40*Math.cos(angle))+'%';b.style.top=(50+40*Math.sin(angle))+'%';b.style.setProperty('--color',c.hex);b.innerHTML='<i aria-hidden="true"></i><span>'+c.name+'</span>';b.setAttribute('aria-label',c.name);b.addEventListener('click',()=>{color[color.target]=i;renderColor();});$('colorWheel').append(b);});
function overLeaf(){return $('leafShape').isPointInFill(new DOMPoint(color.x,color.y));}
function renderColor(){
 $('coloredLeaf').setAttribute('fill',M.colors[color.leaf].hex);$('coloredWings').setAttribute('fill',M.colors[color.wing].hex);
 $('coloredWings').setAttribute('stroke',color.outline?'#263d32':'none');$('coloredWings').setAttribute('stroke-width','2');
 $('colorButterfly').setAttribute('transform',`translate(${color.x} ${color.y})`);
 pressed(all('[data-paint]'),b=>b.dataset.paint===color.target);pressed(all('[data-hue]'),b=>Number(b.dataset.hue)===color[color.target]);
 const relation=M.relation(color.wing,color.leaf);pressed(all('[data-relation]'),b=>b.dataset.relation===relation);
 $('paintTarget').textContent=(color.target==='wing'?'나비':'잎')+' 색 고르기';
 $('colorPair').replaceChildren(...[['나비',color.wing],['잎',color.leaf]].map(([label,index])=>{const span=document.createElement('span'),chip=document.createElement('i');chip.style.setProperty('--color',M.colors[index].hex);chip.setAttribute('aria-hidden','true');span.append(chip,label+' '+M.colors[index].name);return span;}));
 $('relationNote').textContent={same:'나비와 잎에 같은 색을 칠했어요.',near:'색상환에서 바로 이웃한 두 색이에요.',opposite:'색상환에서 서로 마주 보는 두 색이에요.',different:'색상환에서 두 색이 얼마나 떨어져 있는지 살펴보세요.'}[relation];
 const onLeaf=overLeaf();$('moveButterfly').textContent=onLeaf?'잎 밖으로 옮기기':'잎 위로 옮기기';
 $('showOutline').setAttribute('aria-pressed',String(color.outline));$('showOutline').textContent=color.outline?'날개 테두리 숨기기':'날개 테두리 보기';
 $('colorObservation').textContent=onLeaf?(relation==='same'?'날개와 잎의 색이 같아요. 테두리를 켜고 끄며 날개의 경계를 찾아보세요.':relation==='near'?'이웃한 두 색이에요. 같은 색일 때와 나비가 보이는 모습을 비교해 보세요.':relation==='opposite'?'마주 보는 두 색이 만났어요. 날개와 잎의 경계가 어떻게 보이나요?':'나비와 잎의 색을 골랐어요. 같은 색이나 반대편 색으로도 바꿔 보세요.'):'나비 색은 그대로인데 배경이 바뀌었어요. 잎 위에 있을 때와 비교해 보세요.';
}
all('[data-paint]').forEach(b=>b.addEventListener('click',()=>{color.target=b.dataset.paint;renderColor();}));
all('[data-relation]').forEach(b=>b.addEventListener('click',()=>{color.wing=M.related(color.leaf,b.dataset.relation);color.target='wing';renderColor();}));
$('showOutline').addEventListener('click',()=>{color.outline=!color.outline;renderColor();});
$('moveButterfly').addEventListener('click',()=>{[color.x,color.y]=overLeaf()?[170,90]:[400,267];renderColor();});
$('resetColor').addEventListener('click',()=>{color=initialColor();renderColor();});
$('colorButterfly').addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const p=point($('colorScene'),e);drag={id:e.pointerId,x:p.x-color.x,y:p.y-color.y};$('colorButterfly').setPointerCapture(e.pointerId);});
$('colorButterfly').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point($('colorScene'),e);color.x=M.clamp(p.x-drag.x,105,695);color.y=M.clamp(p.y-drag.y,90,420);$('colorButterfly').setAttribute('transform',`translate(${color.x} ${color.y})`);});
const endDrag=e=>{if(drag?.id===e.pointerId){drag=null;renderColor();}};
['pointerup','pointercancel','lostpointercapture'].forEach(type=>$('colorButterfly').addEventListener(type,endDrag));
$('colorButterfly').addEventListener('keydown',e=>{const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!moves[e.key])return;e.preventDefault();const [dx,dy]=moves[e.key],step=e.shiftKey?25:10;color.x=M.clamp(color.x+dx*step,105,695);color.y=M.clamp(color.y+dy*step,90,420);renderColor();});
renderColor();

// Original vector artwork: repeated examples and free strokes share the same clip/mirror.
const inks=[{name:'짙은 남색',hex:'#303f47'},...M.colors.filter((_,i)=>[0,1,4,6,8].includes(i)),{name:'흰색',hex:'#ffffff'}];
let pattern={tool:'free',width:6,ink:0,mirror:true,preset:'wave',spacing:42,marks:[],presetInk:0,presetWidth:6},history=[],drawing=null,spacingBefore=null,widthBefore=null;
function swatches(parent,colors,onPick){colors.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.dataset.color=i;b.setAttribute('aria-label',c.name);b.title=c.name;b.style.setProperty('--color',c.hex);b.innerHTML='<i aria-hidden="true"></i>';b.addEventListener('click',()=>onPick(i));parent.append(b);});}
const snapshot=()=>({marks:structuredClone(pattern.marks),preset:pattern.preset,spacing:pattern.spacing,presetInk:pattern.presetInk,presetWidth:pattern.presetWidth});
function remember(value=snapshot()){history.push(value);if(history.length>40)history.shift();}
function patternNodes(){
 const nodes=[],ink=inks[pattern.presetInk].hex,width=pattern.presetWidth,gap=pattern.spacing;
 if(pattern.preset==='dots'){for(let y=80;y<450;y+=gap)for(let x=105;x<410;x+=gap)nodes.push(svg('circle',{cx:x,cy:y,r:width/2+3,fill:ink}));}
 if(pattern.preset==='stripe'){for(let x=-260;x<440;x+=gap)nodes.push(svg('path',{d:`M${x} 65 l340 390`,stroke:ink,'stroke-width':width,fill:'none'}));}
 if(pattern.preset==='wave'){for(let y=65;y<500;y+=gap)nodes.push(svg('path',{d:`M90 ${y} Q160 ${y-37} 225 ${y} T360 ${y} T495 ${y}`,stroke:ink,'stroke-width':width,fill:'none'}));}
 for(const mark of [...pattern.marks,...(drawing?[drawing]:[])]){const attrs={d:M.linePath(mark.points,mark.tool),stroke:inks[mark.ink].hex,'stroke-width':mark.width,'stroke-linecap':'round','stroke-linejoin':'round',fill:'none'};if(mark.tool==='dots')attrs['stroke-dasharray']=`0.1 ${mark.width*2.6}`;nodes.push(svg('path',attrs));}
 return nodes;
}
function renderMarks(){const nodes=patternNodes();$('leftMarks').replaceChildren(...nodes);$('rightMarks').replaceChildren(...(pattern.mirror?nodes.map(node=>node.cloneNode(true)):[]));$('mirrorAxis').hidden=!pattern.mirror;$('mirrorAxis').setAttribute('visibility',pattern.mirror?'visible':'hidden');}
function renderPattern(){
 renderMarks();pressed(all('[data-tool]'),b=>b.dataset.tool===pattern.tool);pressed(all('[data-pattern]'),b=>b.dataset.pattern===pattern.preset);pressed(Array.from($('inkColors').children),b=>Number(b.dataset.color)===pattern.ink);
 $('lineWidth').value=pattern.width;$('widthReadout').textContent=pattern.width;$('patternSpacing').value=pattern.spacing;
 $('mirrorMarks').setAttribute('aria-pressed',String(pattern.mirror));$('mirrorMarks').textContent=pattern.mirror?'대칭 켜짐':'대칭 꺼짐';$('undoMark').disabled=history.length===0;$('clearMarks').disabled=!pattern.preset&&!pattern.marks.length;
 $('patternSpacing').disabled=!pattern.preset;
 $('patternObservation').textContent=pattern.mirror?'가운데 선을 사이에 두고 양쪽 무늬가 거울처럼 같아요. 대칭을 끄고 한쪽만 그려 보세요.':'대칭을 껐어요. 왼쪽에 만든 무늬와 오른쪽의 빈 날개를 비교해 보세요.';
}
swatches($('inkColors'),inks,i=>{if(pattern.preset){remember();pattern.presetInk=i;}pattern.ink=i;renderPattern();});
all('[data-tool]').forEach(b=>b.addEventListener('click',()=>{pattern.tool=b.dataset.tool;renderPattern();}));
$('lineWidth').addEventListener('input',e=>{if(pattern.preset&&!widthBefore)widthBefore=snapshot();pattern.width=Number(e.target.value);if(pattern.preset)pattern.presetWidth=pattern.width;$('widthReadout').textContent=pattern.width;renderMarks();});
$('lineWidth').addEventListener('change',()=>{if(widthBefore){remember(widthBefore);widthBefore=null;renderPattern();}});
all('[data-pattern]').forEach(b=>b.addEventListener('click',()=>{remember();pattern.preset=b.dataset.pattern;pattern.presetInk=pattern.ink;pattern.presetWidth=pattern.width;renderPattern();}));
$('patternSpacing').addEventListener('input',e=>{if(!spacingBefore)spacingBefore=snapshot();pattern.spacing=Number(e.target.value);renderMarks();});
$('patternSpacing').addEventListener('change',()=>{if(spacingBefore){remember(spacingBefore);spacingBefore=null;renderPattern();}});
$('mirrorMarks').addEventListener('click',()=>{pattern.mirror=!pattern.mirror;renderPattern();});
$('clearMarks').addEventListener('click',()=>{remember();pattern.marks=[];pattern.preset=null;renderPattern();});
$('undoMark').addEventListener('click',()=>{if(history.length){Object.assign(pattern,history.pop());renderPattern();}});
$('patternScene').addEventListener('pointerdown',e=>{if(e.button!==0||drawing)return;const p=point($('patternScene'),e);if(!$('leftWing').isPointInFill(p))return;e.preventDefault();if(pattern.marks.length>=200){$('patternObservation').textContent='선이 많이 모였어요. 그림을 내려받거나 무늬를 비우고 다시 그려 보세요.';return;}drawing={id:e.pointerId,tool:pattern.tool,width:pattern.width,ink:pattern.ink,points:[{x:p.x,y:p.y}]};$('patternScene').setPointerCapture(e.pointerId);renderMarks();});
$('patternScene').addEventListener('pointermove',e=>{if(drawing?.id!==e.pointerId)return;const p=point($('patternScene'),e),last=drawing.points.at(-1);if(Math.hypot(p.x-last.x,p.y-last.y)<2)return;const next={x:M.clamp(p.x,0,800),y:M.clamp(p.y,0,510)};if(['straight','zigzag'].includes(drawing.tool))drawing.points=[drawing.points[0],next];else if(drawing.points.length<1500)drawing.points.push(next);renderMarks();});
$('patternScene').addEventListener('pointerup',e=>{if(drawing?.id!==e.pointerId)return;remember();const {id,...mark}=drawing;pattern.marks.push(mark);drawing=null;renderPattern();});
['pointercancel','lostpointercapture'].forEach(type=>$('patternScene').addEventListener(type,e=>{if(drawing?.id===e.pointerId){drawing=null;renderPattern();}}));
$('saveButterfly').addEventListener('click',()=>{const clone=$('patternScene').cloneNode(true);clone.setAttribute('xmlns',NS);clone.setAttribute('width','800');clone.setAttribute('height','510');clone.removeAttribute('role');clone.removeAttribute('aria-label');clone.querySelector('#mirrorAxis').remove();const blob=new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='내가-만든-나비.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('patternObservation').textContent='내가 만든 나비를 SVG 그림으로 내려받았어요.';});
renderPattern();

const initialFlowers=()=>({selected:2,color:1,size:100,space:0,compare:false});let flowers=initialFlowers();
const baseFlower=6;
for(let i=0;i<5;i++){
 const button=document.createElement('button');button.textContent=i+1;button.dataset.flower=i;button.setAttribute('aria-label',`${i+1}번째 꽃`);button.addEventListener('click',()=>{flowers.selected=i;flowers.compare=false;renderFlowers();});$('flowerChoices').append(button);
 const group=svg('g',{'data-flower':i,role:'button',tabindex:0,'aria-label':`${i+1}번째 꽃 선택`});group.append(svg('use',{href:'#flower'}));group.addEventListener('click',()=>button.click());group.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();button.click();}});$('flowers').append(group);
}
swatches($('flowerColors'),M.colors,i=>{flowers.color=i;flowers.compare=false;renderFlowers();});
function renderFlowers(){
 const positions=M.flowerLayout(flowers.selected,flowers.compare?0:flowers.space);
 Array.from($('flowers').children).forEach((group,i)=>{const chosen=i===flowers.selected,size=chosen&&!flowers.compare?flowers.size/100:1;group.setAttribute('transform',`translate(${positions[i].x} 414) scale(${size}) translate(0 -111)`);group.setAttribute('fill',M.colors[chosen&&!flowers.compare?flowers.color:baseFlower].hex);group.setAttribute('aria-pressed',String(chosen));});
 pressed(Array.from($('flowerChoices').children),b=>Number(b.dataset.flower)===flowers.selected);pressed(Array.from($('flowerColors').children),b=>Number(b.dataset.color)===flowers.color);
 pressed(all('[data-emphasis]'),b=>b.dataset.emphasis==='color'?flowers.color!==baseFlower&&flowers.size===100&&flowers.space===0:b.dataset.emphasis==='size'?flowers.color===baseFlower&&flowers.size!==100&&flowers.space===0:flowers.color===baseFlower&&flowers.size===100&&flowers.space>0);
 $('flowerSize').value=flowers.size;$('sizeReadout').textContent=flowers.size+'%';$('flowerSpace').value=flowers.space;$('spaceReadout').textContent=flowers.space===0?'같은 간격':flowers.space===100?'넓게':flowers.space+'%';
 $('compareFlowers').setAttribute('aria-pressed',String(flowers.compare));$('compareFlowers').textContent=flowers.compare?'내가 바꾼 그림으로 돌아가기':'모두 같게 놓고 비교';
 const changes=[];if(flowers.color!==baseFlower)changes.push('색을 '+M.colors[flowers.color].name+'으로');if(flowers.size!==100)changes.push('크기를 '+(flowers.size>100?'크게':'작게'));if(flowers.space>0)changes.push('주위의 빈 공간을 넓게');
 $('emphasisObservation').textContent=flowers.compare?'다섯 꽃의 색과 크기, 간격을 모두 같게 놓았어요. 내가 바꾼 그림과 눈길이 가는 곳을 비교해 보세요.':changes.length?`${flowers.selected+1}번째 꽃의 ${changes.join(', ')} 바꿨어요. 어느 꽃에 먼저 눈길이 가나요?`:'다섯 꽃의 색과 크기, 간격이 같아요. 한 송이만 바꾸면 어떻게 보일까요?';
}
all('[data-emphasis]').forEach(b=>b.addEventListener('click',()=>{flowers.color=baseFlower;flowers.size=100;flowers.space=0;flowers.compare=false;if(b.dataset.emphasis==='color')flowers.color=1;else if(b.dataset.emphasis==='size')flowers.size=140;else flowers.space=100;renderFlowers();}));
$('flowerSize').addEventListener('input',e=>{flowers.size=Number(e.target.value);flowers.compare=false;renderFlowers();});
$('flowerSpace').addEventListener('input',e=>{flowers.space=Number(e.target.value);flowers.compare=false;renderFlowers();});
$('compareFlowers').addEventListener('click',()=>{flowers.compare=!flowers.compare;renderFlowers();});
$('resetEmphasis').addEventListener('click',()=>{flowers=initialFlowers();renderFlowers();});
renderFlowers();
new ResizeObserver(()=>{const width=$('emphasisScene').getBoundingClientRect().width;if(width)document.querySelector('.poster-title').setAttribute('font-size',18*800/width);}).observe($('emphasisScene'));
})();
