import {CLIMATE_MODELS} from './world-study.mjs?v=20261012-remaster1';
import {WORLD_PATH} from './data/study-outline.mjs?v=20261012-remaster1';
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(label,body,box='0 0 640 230')=>`<svg viewBox="${box}" role="img" aria-label="${escapeHTML(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
export function climateFigure(id,label){
 const d=CLIMATE_MODELS[id];if(!d)return '';
 const title=label||d.name,x=i=>46+i*23,yT=t=>171-(t+30)*2,yP=p=>171-p*.28;
 return `<figure class="study-climate">${svg(title,`<text x="42" y="20">기온(℃)</text><text x="252" y="20">강수량(mm)</text>${[-30,0,30].map(t=>`<path d="M39 ${yT(t)}H314" stroke="#cbd3ce"/><text x="33" y="${yT(t)+4}" text-anchor="end">${t}</text>`).join('')}${[0,250,500].map(p=>`<text x="318" y="${yP(p)+4}">${p}</text>`).join('')}${d.p.map((p,i)=>`<rect x="${x(i)-6}" y="${yP(p)}" width="12" height="${p*.28}" fill="#70a8c4"/>`).join('')}<polyline points="${d.t.map((t,i)=>`${x(i)},${yT(t)}`).join(' ')}" fill="none" stroke="#ba4937" stroke-width="2.5"/>${[0,2,4,6,8,10].map(i=>`<text x="${x(i)}" y="192" text-anchor="middle">${i+1}</text>`).join('')}<text x="320" y="192">월</text>`,'0 0 355 205')}<figcaption>${escapeHTML(title)}</figcaption><details class="chart-values"><summary>수치 보기</summary><table><thead><tr><th>월</th>${d.t.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr></thead><tbody><tr><th>℃</th>${d.t.map(v=>`<td>${v}</td>`).join('')}</tr><tr><th>mm</th>${d.p.map(v=>`<td>${v}</td>`).join('')}</tr></tbody></table></details></figure>`;
}
export function mapFigure(points,bounds=[-180,-60,180,85]){
 const [w,s,e,n]=bounds,scale=Math.min(680/(e-w),290/(n-s)),ox=360-(w+e)/2*scale,oy=165+(n+s)/2*scale;
 const xy=([lng,lat])=>[ox+lng*scale,oy-lat*scale];
 const graticule=[-60,-30,0,30,60].filter(lat=>lat>=s&&lat<=n).map(lat=>{const y=xy([0,lat])[1];return `<path d="M20 ${y}H700" stroke="#b3c7ce" stroke-dasharray="3 4"/><text x="23" y="${y-4}">${lat===0?'적도':Math.abs(lat)+'°'+(lat>0?'N':'S')}</text>`;}).join('');
 return `<figure class="study-map">${svg('사례 지역의 위치. '+points.map(p=>p[0]+': 경도 '+p[1]+', 위도 '+p[2]).join('; '),`<defs><clipPath id="studyMapClip"><rect x="20" y="15" width="680" height="300"/></clipPath></defs><g clip-path="url(#studyMapClip)"><rect x="20" y="15" width="680" height="300" fill="#edf4f5"/><path d="${WORLD_PATH}" transform="translate(${ox} ${oy}) scale(${scale})" fill="#dae1d3" stroke="#81958c" stroke-width="${.65/scale}"/>${graticule}${points.map(([name,lng,lat,dx=10,dy=-9])=>{const [x,y]=xy([lng,lat]);return `<circle cx="${x}" cy="${y}" r="5" fill="#245b59" stroke="white" stroke-width="1.5"/><text x="${x+dx}" y="${y+dy}" class="map-letter">${escapeHTML(name)}</text>`;}).join('')}</g><text x="678" y="32">북 ↑</text>`,'0 0 720 330')}<figcaption>정거 원통 도법 · 위치 비교용</figcaption></figure>`;
}
const label=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
export function diagramFigure(kind){
 let body='',title='';
 if(kind==='dune'){
  title='바르한의 단면 · 바람과 모래의 이동';body=`<path d="M40 185L350 90L400 185Z" fill="#e5c288" stroke="#89734d" stroke-width="2"/><path d="M75 65H265l-14 -8m14 8l-14 8" fill="none" stroke="#366a76" stroke-width="3"/>${label(150,47,'바람 →')}${label(170,155,'완만한 사면')}${label(480,136,'급한 사면')}${label(320,218,'모래 이동 →')}`;
 }else if(kind==='permafrost'){
  title='주빙하 지역의 여름 지중 단면';body=`<rect x="60" y="35" width="520" height="65" fill="#c8b18d"/><rect x="60" y="100" width="520" height="105" fill="#b9d5e4"/><path d="M60 100H580" stroke="#586d78" stroke-dasharray="6 4"/>${label(320,66,'활동층: 여름에 녹음')}${label(320,87,'겨울에는 다시 결빙')}${label(320,148,'영구 동토층')}${label(320,176,'적어도 2년 연속 0℃ 이하')}`;
 }else if(kind==='karst'){
  title='석회암의 용식과 동굴 속 침전';body=`<path d="M25 65H140Q195 130 245 65H615V205H25Z" fill="#d9cbb1" stroke="#857b66"/><path d="M185 150Q250 80 380 143Q440 115 510 157L490 189H185Z" fill="#fffdf7" stroke="#857b66"/><path d="M300 130L312 156L323 131M337 189L350 164L366 189" fill="#c8b18d" stroke="#857b66"/><path d="M196 30V72l-7 -10m7 10l7 -10" stroke="#3d889f" stroke-width="3" fill="none"/>${label(196,23,'빗물')}${label(193,117,'돌리네')}${label(365,49,'석회암의 용식 → 공간 형성')}${label(535,215,'종유석·석순: 침전')}`;
 }else if(kind==='coast'){
  title='골짜기의 단면과 해수면 상승';body=`<path d="M30 60L155 170L280 60V200H30Z" fill="#d6c4a1"/><path d="M350 60Q385 75 385 138Q385 175 475 175Q565 175 565 138Q565 75 610 60V200H350Z" fill="#d6c4a1"/><path d="M30 125H280M350 125H610" stroke="#3089ab" stroke-width="3"/>${label(155,32,'하천의 V자곡')}${label(480,32,'빙하의 U자곡')}${label(155,224,'침수 → 리아스')}${label(480,224,'침수 → 피오르')}${label(316,117,'해수면')}`;
 }else if(kind==='river'){
  title='곡류 하천의 침식과 퇴적 · 평면 모식도';body=`<path d="M40 150C150 150 120 45 240 45S360 190 475 190S540 90 610 90" stroke="#7cb8ce" stroke-width="34" fill="none"/><path d="M235 100L270 83M335 103L370 92" stroke="#745f38"/>${label(198,124,'안쪽: 퇴적')}${label(395,76,'바깥쪽: 침식')}${label(81,202,'흐름 →')}`;
 }
 return body?`<figure class="study-diagram">${svg(title,body)}<figcaption>${title} · 형태를 단순화한 모식도</figcaption></figure>`:'';
}
export function studySections(sections=[]){return sections.map(s=>`<section class="study-section"><h3>${escapeHTML(s.title)}</h3>${s.text?`<p>${escapeHTML(s.text)}</p>`:''}${s.rows?`<table class="study-compare"><tbody>${s.rows.map(([a,b])=>`<tr><th scope="row">${escapeHTML(a)}</th><td>${escapeHTML(b)}</td></tr>`).join('')}</tbody></table>`:''}</section>`).join('');}
