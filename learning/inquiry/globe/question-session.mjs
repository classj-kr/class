// Scope comes from the subject's learning targets, never a per-subject quota.
export function selectPracticeQuestions(pool,progress,{reviewOnly=false,random=Math.random}={}){
  const pending=pool.filter(q=>progress[q.id]?.lastCorrect!==true);
  const source=reviewOnly?pool.filter(q=>progress[q.id]?.lastCorrect===false):pending.length?pending:pool;
  const result=source.slice();
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  const priority=q=>progress[q.id]?.lastCorrect===false?0:progress[q.id]?.lastCorrect===true?2:1;
  return result.sort((a,b)=>priority(a)-priority(b));
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function questionDataHTML(question){
  if(question.table){
    const {caption,headers,rows}=question.table;
    return `<div class="question-table-wrap"><table class="question-table"><caption>${escape(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>i===0?`<th scope="row">${escape(v)}</th>`:`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if(question.grid){
    const x=lng=>180+lng*.72,y=lat=>100-lat*.85;
    const parallels=[-60,-30,0,30,60],meridians=[-180,-90,0,90,180];
    const lines=parallels.map(lat=>`<path d="M50 ${y(lat)}H310" stroke="${lat===0?'#e4ca81':'#365267'}"/><text x="44" y="${y(lat)+3}" text-anchor="end">${lat===0?'적도':(lat>0?'북위':'남위')+Math.abs(lat)+'°'}</text>`).join('')+meridians.map(lng=>`<path d="M${x(lng)} 49V151" stroke="${lng===0?'#e4ca81':'#365267'}"/><text x="${x(lng)}" y="170" text-anchor="middle">${lng===0?'본초 자오선':(lng>0?'동경':'서경')+Math.abs(lng)+'°'}</text>`).join('');
    const points=question.grid.points.map(([name,lng,lat])=>`<circle cx="${x(lng)}" cy="${y(lat)}" r="5" fill="#b8f4d8"/><text x="${x(lng)+9}" y="${y(lat)-9}" fill="#d8ffea" font-size="13">${escape(name)}</text>`).join('');
    const description=question.grid.points.map(([n,lng,lat])=>`${n}: ${lat>=0?'북위':'남위'} ${Math.abs(lat)}도, ${lng>=0?'동경':'서경'} ${Math.abs(lng)}도`).join('. ');
    return `<figure class="question-grid"><svg viewBox="0 0 360 190" role="img" aria-label="경위도 모형. ${escape(description)}"><g fill="#aec3d1" font-size="9">${lines}${points}</g></svg><figcaption>경위도 모형 · 위쪽이 북쪽</figcaption></figure>`;
  }
  return '';
}
