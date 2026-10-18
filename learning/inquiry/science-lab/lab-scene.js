/* Keep apparatus nodes alive while their geometry changes. No layout reads in
 * the rendering pass: font sizing and viewport layout run only when needed. */
(() => {
 'use strict';
 const sources=new WeakMap(),buffers=new WeakMap(),markup=new WeakMap(),resized=new Set();
 const key=n=>n.nodeType===1?(n.id||n.getAttribute('data-scene-key')||''):'';
 const compatible=(a,b)=>a&&a.nodeType===b.nodeType&&(a.nodeType!==1||a.localName===b.localName&&a.namespaceURI===b.namespaceURI&&key(a)===key(b));
 function remember(node){
  if(node.nodeType===1)sources.set(node,new Map([...node.attributes].map(a=>[a.name,a.value])));
  for(const child of node.childNodes)remember(child);
 }
 function patch(node,next){
  if(node.nodeType!==1){if(node.nodeValue!==next.nodeValue)node.nodeValue=next.nodeValue;return;}
  const previous=sources.get(node)||new Map(),attrs=new Map([...next.attributes].map(a=>[a.name,a.value]));
  const fittedFont=node.localName==='text'&&node.style.getPropertyPriority('font-size')==='important'?node.style.fontSize:null;
  for(const [name,value]of previous)if(!attrs.has(name)){
   if(name==='transform'&&/\b(?:scale|matrix)\(/.test(value)){const svg=node.closest('svg');if(svg)resized.add(svg);}
   node.removeAttribute(name);
  }
  for(const [name,value]of attrs)if(previous.get(name)!==value){
   node.setAttribute(name,value);
   if(name==='viewBox'||name==='transform'&&/\b(?:scale|matrix)\(/.test(value+' '+previous.get(name))){const svg=node.closest('svg');if(svg)resized.add(svg);}
  }
  if(fittedFont&&(node.style.fontSize!==fittedFont||node.style.getPropertyPriority('font-size')!=='important'))node.style.setProperty('font-size',fittedFont,'important');
  sources.set(node,attrs);children(node,next);
 }
 function children(parent,next){
  let node=parent.firstChild;
  for(const desired of [...next.childNodes]){
   if(!compatible(node,desired)){
    const found=key(desired)?[...parent.childNodes].find(n=>compatible(n,desired)):null;
    if(found){parent.insertBefore(found,node);node=found;}
    else{const added=desired.cloneNode(true);remember(added);parent.insertBefore(added,node);node=added;}
   }
   patch(node,desired);node=node.nextSibling;
  }
  while(node){const following=node.nextSibling;node.remove();node=following;}
 }
 function render(target,html){
  if(!target)return;html=String(html);
  // Discrete forms intentionally rebuild: their original renderers rebind
  // handlers and reset native values. Only diagrams/readouts retain nodes.
  if(/<(?:select|input|button|textarea)\b/i.test(html)){target.innerHTML=html;markup.delete(target);return;}
  if(markup.get(target)===html)return;
  let buffer=buffers.get(target);if(!buffer){buffer=target.cloneNode(false);buffer.removeAttribute('id');buffers.set(target,buffer);}
  buffer.innerHTML=html;children(target,buffer);markup.set(target,html);
  for(const svg of resized)window.scienceNormalizeFigure?.(svg);resized.clear();
 }
 // Older lessons assemble SVG with createElementNS. Build offscreen, then
 // commit geometry to the existing scene, just like the string renderer.
 function draw(targets,paint){
  const drafts=targets.map(target=>{let buffer=buffers.get(target);if(!buffer){buffer=target.cloneNode(false);buffer.removeAttribute('id');buffers.set(target,buffer);}buffer.replaceChildren();return buffer;});
  paint(drafts);
  targets.forEach((target,i)=>{children(target,drafts[i]);markup.delete(target);});
  for(const svg of resized)window.scienceNormalizeFigure?.(svg);resized.clear();
 }
 // Small vector apparatus parts. Their dimensions are supplied by each lesson,
 // so positions, measurement scales and the physics model remain authoritative.
 const outline='stroke="#4e6b7b" stroke-width="1" stroke-linejoin="round"';
 const art={
  crate(x,y,w,h){return `<rect class="crate" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><path d="M${x+2} ${y+2}H${x+w-2}M${x+2} ${y+h-3}H${x+w-2}" stroke="#f7ead2" stroke-width="1.3"/><path d="M${x+w*.22} ${y+2}V${y+h-2}M${x+w*.78} ${y+2}V${y+h-2}" stroke="#98774e" stroke-width="1" opacity=".7"/>`;},
  cart(x,y,w,h,color='#397e98',phase=0,label=''){
   let s=`<g data-apparatus="dynamics-cart"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${color}" ${outline}/><path d="M${x+2} ${y+3}H${x+w-2}" stroke="#fff" stroke-opacity=".7" stroke-width="1.4"/><path d="M${x+2} ${y+h-3}H${x+w-2}" stroke="#183c50" stroke-width="2"/><path d="M${x-2} ${y+h*.55}H${x+1}M${x+w-1} ${y+h*.55}H${x+w+2}" stroke="#718895" stroke-width="3"/>`;
   const r=Math.max(3,Math.min(5,w*.15));for(const f of [.23,.77]){const cx=x+w*f,cy=y+h+3;s+=`<g transform="translate(${cx} ${cy}) rotate(${phase})"><circle r="${r}" fill="#284451" stroke="#9eb2ba" stroke-width=".8"/><path d="M${-r*.6} 0H${r*.6}M0 ${-r*.6}V${r*.6}" stroke="#c7d7df" stroke-width=".9"/><circle r="1.1" fill="#eaf1f4"/></g>`;}
   if(label)s+=`<text class="cart-text" x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" fill="#fff">${label}</text>`;return s+'</g>';
  },
  traveller(kind,x,y,phase){
   const a=Math.sin(phase)*5,b=Math.sin(phase+Math.PI)*5;let s='';
   if(kind==='walker'||kind==='runner'){s=`<circle cx="1" cy="-24" r="4" fill="#bf8f69"/><path d="M0-19L-2-8" stroke="#327991" stroke-width="7" stroke-linecap="round"/><path d="M-2-8l${-6+a} 13m${6-a}-13l${7-a} 12M-1-17l${-7+b} 7m${7-b}-7l${7+a} 5" fill="none" stroke="#294b60" stroke-width="3" stroke-linecap="round"/>`;}
   else if(kind==='bike'){for(const cx of[-12,14])s+=`<g transform="translate(${cx} 1) rotate(${phase*35})"><circle r="8" fill="#f4f9fb" stroke="#4c6979" stroke-width="2"/><path d="M-6 0H6M0-6V6" stroke="#a3b7c1"/></g>`;s+=`<path d="M-12 1l8-15 8 15h-16l16-12 10 12-5-20h5M-8-14h8" fill="none" stroke="#bc743c" stroke-width="2"/><circle cx="2" cy="-27" r="3.5" fill="#bf8f69"/><path d="M0-23l-4 9 10 7-4 8M0-21l8 6" fill="none" stroke="#327991" stroke-width="3" stroke-linecap="round"/>`;}
   else if(kind==='car'){s=`<path d="M-22 0v-10h6l7-10h19l8 10h6v10Z" fill="#3d8599" ${outline}/><path d="M-11-11l5-7h13l7 7Z" fill="#d2e9ef"/><path d="M-20-7h3m31 0h5" stroke="#fff4bb" stroke-width="3"/>`;for(const cx of[-13,14])s+=`<g transform="translate(${cx} 1) rotate(${phase*35})"><circle r="5" fill="#284451"/><path d="M-3 0H3M0-3V3" stroke="#a9c1cd"/></g>`;}
   else if(kind==='tortoise'){s=`<path d="M-12 2l${a*.3-3} 3m18-3l${b*.3+4} 3" stroke="#618463" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="-3" rx="13" ry="9" fill="#678d62" stroke="#3d6747"/><path d="M-9-6l6-4 7 1 6 5M-3-9l-2 9m9-8 3 9" fill="none" stroke="#acc18b"/><circle cx="15" cy="-2" r="4" fill="#8da77c"/><circle cx="17" cy="-3" r=".8" fill="#24483b"/>`;}
   else{s=`<path d="M-12-7q12-10 26-3l6-4 4 5-7 8-7-2H-7l-6 3Z" fill="#c7a15e" stroke="#886f44"/><path d="M-8-2l${-7+a} 7m${7-a}-7l${4-a} 7M9-3l${-4+b} 8m${4-b}-8l${8-b} 6M-12-6q-12 0-14-7" fill="none" stroke="#947742" stroke-width="2.5" stroke-linecap="round"/>`;for(let i=0;i<7;i++)s+=`<circle cx="${-8+i*3}" cy="${-7+i%2*3}" r="1" fill="#5d5036"/>`;}
   return `<g data-apparatus="${kind}" transform="translate(${x} ${y})">${s}</g>`;
  }
 };
 window.scienceScene={render,draw,art};
})();
