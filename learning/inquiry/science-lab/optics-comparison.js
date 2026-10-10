/* Paraxial ray diagrams. Distances are drawing units, not measured apparatus data. */
function scienceOpticsComparison(optic, distance) {
 const mirror=!optic.endsWith('Lens'),plane=optic==='plane',converging=['concaveMirror','convexLens'].includes(optic);
 const names={plane:'평면거울',convexMirror:'볼록거울',concaveMirror:'오목거울',convexLens:'볼록렌즈',concaveLens:'오목렌즈'};
 const cx=230,axis=165,h=35,u=distance==='near'?30:160,f=converging?60:-60;
 const v=plane?-u:1/(1/f-1/u),m=-v/u,ox=cx-u,ix=cx+(mirror?-v:v),iy=axis-m*h,virtual=v<0;
 const text=(s,x,y,color='#284b59',size=14)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}">${s}</text>`;
 const segment=(x1,y1,x2,y2,color,dashed=false)=>`<line data-ray="${dashed?'extension':'light'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"${dashed?' stroke-dasharray="5 4"':''}/>`;
 const arrow=(x,height,color,part)=>`<g data-optics-part="${part}" data-x="${x}" data-height="${height}"><path d="M${x} ${axis} V${axis-height} m-6 ${Math.sign(height)*9} l6 ${-Math.sign(height)*9} 6 ${Math.sign(height)*9}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
 let svg=`<g data-optic="${optic}" data-object-distance="${u}" data-image-distance="${v}" data-focal-distance="${plane?'0':f}" data-magnification="${m}">`;
 svg+='<defs><clipPath id="opticsRayWindow"><rect x="20" y="42" width="420" height="198"/></clipPath></defs>';
 svg+='<line x1="20" y1="165" x2="440" y2="165" stroke="#b5c6cc" stroke-width="1"/>';
 if(!plane)for(const x of mirror?[cx-f]:[cx-60,cx+60])svg+=`<circle cx="${x}" cy="165" r="3" fill="#688694"/>`+text('초점',x,185,'#526d79',12);
 svg+='<g clip-path="url(#opticsRayWindow)">';
 svg+=segment(ox,axis-h,cx,axis-h,'#d29135')+segment(ox,axis-h,cx,axis,'#628ac2');
 const end=mirror?20:440,d=Math.abs(end-cx);
 svg+=segment(cx,axis-h,end,plane?axis-h:axis-h+d*h/f,'#d29135');
 svg+=segment(cx,axis,end,axis+d*h/u,'#628ac2');
 if(virtual)svg+=segment(cx,axis-h,ix,iy,'#d29135',true)+segment(cx,axis,ix,iy,'#628ac2',true);
 svg+='</g>';
 let shape;
 if(plane)shape='<path d="M230 55 V235"/>';
 else if(mirror)shape=`<path d="M${converging?216:244} 55 Q${converging?244:216} 145 ${converging?216:244} 235"/>`;
 else shape=converging?'<path d="M230 55 Q258 145 230 235 Q202 145 230 55 Z"/>':'<path d="M214 55 Q239 145 214 235 H246 Q221 145 246 55 Z"/>';
 svg+=`<g data-optics-part="device" stroke="#547b8a" stroke-width="4" fill="${mirror?'none':'#d6eaf0'}" fill-opacity=".65">${shape}</g>`;
 svg+=arrow(ox,h,'#ce7b33','object')+arrow(ix,m*h,'#348895','image');
 svg+=text(names[optic],cx,27)+text('물체',ox,259,'#a86424')+text('상',ix,281,'#277581');
 svg+=text('실선: 빛의 경로 · 점선: 빛을 거꾸로 연장한 선',230,305,'#526d79',12)+'</g>';
 const orientation=m>0?'바로 선':'거꾸로 된',size=Math.abs(m)>1.01?'큰':Math.abs(m)<.99?'작은':'크기가 같은';
 const position=mirror?(virtual?'거울 뒤쪽':'물체와 같은 쪽'):(virtual?'물체와 같은 쪽':'렌즈 건너편');
 return{svg,text:`${names[optic]}의 ${position}에 ${size==='크기가 같은'?'물체와 크기가 같고':'물체보다 '+(size==='큰'?'크고':'작고')} ${orientation} 상이 생깁니다. ${virtual?'나아가는 빛을 거꾸로 연장한 점선이 만나는 곳에 상이 있는 것처럼 보입니다.':'실제 빛이 모이는 곳에 상이 생깁니다.'}`,u,v,m};
}
if(typeof window!=='undefined')window.scienceOpticsComparison=scienceOpticsComparison;
if(typeof module!=='undefined')module.exports=scienceOpticsComparison;
