(()=>{
'use strict';
const data=Obangsaek,$=id=>document.getElementById(id),order=['east','south','center','west','north'];
let selected=Object.hasOwn(data,location.hash.slice(1))?location.hash.slice(1):'east',compare=false,zoom=1,baseWidth=0,openRequest=0;
const swatch=key=>data[key].swatch;
function style(button,key){button.style.setProperty('--tone',data[key].tint);button.style.setProperty('--wash',data[key].pale);button.style.setProperty('--swatch',swatch(key));button.style.setProperty('--ink',data[key].ink);button.dataset.key=key;}
for(const key of order){const item=data[key],button=document.createElement('button');style(button,key);button.innerHTML=`<i aria-hidden="true"></i><div><strong>${item.name}</strong><span>${item.color} · ${item.direction}</span></div>`;button.addEventListener('click',()=>select(key));$('colorChoices').append(button);
 const sample=document.createElement('span');style(sample,key);sample.textContent=item.color;$('colorStrip').append(sample);
 for(const id of ['compass','largeCompass']){const position=document.createElement('button');style(position,key);position.className=key;position.innerHTML=`<strong>${item.direction} · ${item.color}</strong><span>${key==='center'?'토(土)':item.name}</span>`;position.addEventListener('click',()=>select(key));$(id).append(position);}
 const row=document.createElement('tr');row.dataset.key=key;row.innerHTML=`<td><i style="background:${swatch(key)}" aria-hidden="true"></i>${item.color}(${item.colorHanja})</td><td>${item.direction}</td><td>${item.element} · ${item.material}</td><td>${item.season}</td><td>${key==='center'?'—':item.name}</td>`;$('mappingRows').append(row);
}
async function showArtwork(id,src,alt){
 const img=$(id),button=img.parentElement;img.alt=alt;
 if(img.dataset.source===src)return;
 const request=String(Number(img.dataset.request||0)+1);img.dataset.request=request;img.dataset.source=src;img.dataset.ready='false';button.setAttribute('aria-busy','true');button.querySelector('.image-status').textContent='그림을 불러오는 중…';img.src=src;
 try{await img.decode();if(img.dataset.request!==request)return;img.dataset.ready='true';button.removeAttribute('aria-busy');}
 catch{if(img.dataset.request!==request)return;button.querySelector('.image-status').textContent='그림을 불러오지 못했습니다.';$('imageError').hidden=false;}
}
function revealChoice(){
 const list=$('colorChoices'),button=list.querySelector('[data-key="'+selected+'"]');
 if(list.scrollWidth<=list.clientWidth)return;
 const item=button.getBoundingClientRect(),bounds=list.getBoundingClientRect();
 if(item.left<bounds.left||item.right>bounds.right)list.scrollLeft+=item.left-bounds.left-(list.clientWidth-item.width)/2;
}
function render(){
 const item=data[selected],center=selected==='center';document.documentElement.style.setProperty('--accent',item.tint);document.documentElement.style.setProperty('--pale',item.pale);
 document.querySelectorAll('button[data-key]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.key===selected)));
 $('mappingRows').querySelectorAll('tr').forEach(row=>row.classList.toggle('active',row.dataset.key===selected));
 $('guardianName').textContent=item.name;$('guardianHanja').textContent=item.hanja;$('guardianTitle').textContent=item.title;$('description').textContent=item.description;$('shapeDescription').textContent=item.shape;
 $('relationships').innerHTML=[['방위',item.direction],['색',`${item.color}(${item.colorHanja})`],['오행',item.element],['계절',item.season]].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
 $('artToolbar').hidden=center;$('artworks').hidden=center;$('featureSection').hidden=center;$('centerPanel').hidden=!center;$('compass').hidden=center;document.querySelector('.direction-heading').hidden=center;
 $('editionNote').hidden=!compare||center;$('editionNote').textContent=item.change;$('compareEditions').setAttribute('aria-pressed',String(compare));$('compareEditions').textContent=compare?'한 그림 크게 보기':'두 시대 나란히 보기';
 if(!center){$('artHeading').textContent='의궤 속 '+item.name;const early='assets/'+item.image+'.jpg';showArtwork('earlyImage',early,'1674년 인선왕후영릉산릉도감의궤에 그려진 '+item.name);
  $('lateFigure').hidden=!compare;$('artworks').classList.toggle('comparing',compare);if(compare){const late='assets/'+item.image+'-late.jpg';showArtwork('lateImage',late,'1757년 인원왕후명릉산릉도감의궤에 그려진 '+item.name);}
  $('features').replaceChildren();for(const feature of item.features){const button=document.createElement('button');button.textContent=feature.name;button.addEventListener('click',()=>openImage(false,feature));$('features').append(button);}
  $('artHint').textContent=compare?'위 특징은 1674년 그림에서 살펴봅니다. 각 그림을 눌러 확대할 수 있습니다.':'그림이나 특징을 누르면 확대됩니다.';
 }
}
function select(key){if(!Object.hasOwn(data,key))return;selected=key;history.replaceState(null,'','#'+key);$('imageError').hidden=true;render();revealChoice();}
$('compareEditions').addEventListener('click',()=>{compare=!compare;render()});
$('openEarly').addEventListener('click',()=>openImage(false));$('openLate').addEventListener('click',()=>openImage(true));
function sizeImage(point={x:.5,y:.5}){const viewport=$('imageViewport'),img=$('detailImage');baseWidth=Math.min(viewport.clientWidth-24,(viewport.clientHeight-24)*img.naturalWidth/img.naturalHeight);img.style.width=(baseWidth*zoom)+'px';$('zoomValue').value=Math.round(zoom*100)+'%';$('zoomOut').disabled=zoom<=1;$('zoomIn').disabled=zoom>=4;viewport.scrollLeft=img.offsetLeft+img.width*point.x-viewport.clientWidth/2;viewport.scrollTop=img.offsetTop+img.height*point.y-viewport.clientHeight/2;}
async function openImage(late,feature){const item=data[selected],request=++openRequest,img=$('detailImage');if(!item.image)return;
 $('dialogTitle').textContent=item.name+(feature?' · '+feature.name:'');$('detailCaption').textContent=(late?'1757년 인원왕후명릉산릉도감의궤':'1674년 인선왕후영릉산릉도감의궤')+' · 국립중앙박물관';img.alt=item.name+' 원본 확대';img.src='assets/'+item.image+(late?'-late':'')+'.jpg';zoom=feature?3:1;$('imageDialog').showModal();
 try{await img.decode();if(request!==openRequest||!$('imageDialog').open)return;sizeImage(feature||{x:.5,y:.5});}catch{$('detailCaption').textContent='그림을 불러오지 못했습니다. 닫은 뒤 다시 열어 주세요.';}
}
function zoomBy(delta){const viewport=$('imageViewport'),img=$('detailImage');if(!img.complete||!img.naturalWidth)return;const point={x:(viewport.scrollLeft+viewport.clientWidth/2-img.offsetLeft)/img.width,y:(viewport.scrollTop+viewport.clientHeight/2-img.offsetTop)/img.height};zoom=Math.max(1,Math.min(4,zoom+delta));sizeImage(point);}
$('zoomIn').addEventListener('click',()=>zoomBy(.5));$('zoomOut').addEventListener('click',()=>zoomBy(-.5));$('closeDialog').addEventListener('click',()=>$('imageDialog').close());$('imageDialog').addEventListener('close',()=>{if(!$('imageDialog').open)openRequest++;});
window.addEventListener('resize',()=>{if($('imageDialog').open&&$('detailImage').complete)sizeImage();});
window.addEventListener('hashchange',()=>{const key=location.hash.slice(1);if(Object.hasOwn(data,key)){selected=key;render();revealChoice();}});
render();revealChoice();
})();
