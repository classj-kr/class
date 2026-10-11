// A reproducible catalog: common-curriculum categories for primary/middle,
// course-specific official domains for high-school common/elective subjects.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const lab = path.join(root,'learning/inquiry/science-lab');
const classification = require('./science-catalog-classification.cjs');
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const schoolLabels = {elementary:'초', middle:'중', 'high-common':'고(공통)', 'high-elective':'고(선택)'};
const emptyMessage = populated => `<p class="catalog-empty"${populated?' hidden':''}>실험 없음</p>`;
function render(map) {
  const placements = classification.classify(map);
  const entries = Object.entries(map);
  function card(slug) {
    const app=map[slug], p=placements[slug];
    const more = (p.related||[]).filter(r=>r.course!==p.area||r.area!==p.category);
    const detail = more.length ? `<small class="course-label">함께 연결: ${more.map(r=>esc(r.course)+' · '+esc(r.area)).join(' / ')}</small>` : '';
    return `<a class="level-entry available" data-level="${app.level}" data-school="${p.school}" data-grades="${app.grades.join(' ')}" data-standards="${app.codes.join(' ')}" href="${slug}/"><b>${app.level==='high'?(p.school==='high-common'?'공통':'선택'):app.grade}</b><span>${esc(app.title)}${detail}</span></a>`;
  }
  function cell(slugs, school) {
    return `<div class="level-cell ${school}" data-school="${school}"><span class="cell-label" aria-hidden="true">${schoolLabels[school]}</span>\n${slugs.map(card).join('\n')}${emptyMessage(slugs.length)}</div>`;
  }
  const basic = classification.foundation.map(area=>{
    const rows=area.categories.map(category=>{
      const slugs=entries.filter(([slug])=>placements[slug].section===area.id&&placements[slug].category===category).map(([slug])=>slug);
      return `<article class="topic-row" data-category="${esc(category)}"><h4>${category}</h4><div class="level-matrix">${['elementary','middle'].map(s=>cell(slugs.filter(slug=>placements[slug].school===s),s)).join('\n')}</div></article>`;
    }).filter(Boolean).join('\n');
    return `<section class="subject-section ${area.id}" id="${area.id}" data-area="${area.title}"><header class="subject-heading"><h3>${area.title}</h3><div class="column-labels"><span>초</span><span>중</span></div></header><div class="topic-list">${rows}</div></section>`;
  }).join('\n');
  const high = ['high-common','high-elective'].map(school=>{
    const sections=classification.courses.filter(course=>course.school===school).map(course=>{
      const slugs=entries.filter(([slug])=>placements[slug].section===course.prefix).map(([slug])=>slug);
      const domains=[...new Map(Object.values(classification.standards).filter(s=>s.code.startsWith(course.prefix)).map(s=>[s.domain,s.domainLine])).entries()].sort((a,b)=>a[1]-b[1]).map(([name])=>name);
      if (!domains.length) throw Error('No official domains for '+course.title);
      const rows=domains.map(category=>{
        const selected=slugs.filter(slug=>placements[slug].category===category);
        return `<article class="topic-row" data-category="${esc(category)}"><h4>${esc(category)}</h4><div class="course-apps">${selected.map(card).join('\n')}${emptyMessage(selected.length)}</div></article>`;
      }).filter(Boolean).join('\n');
      return `<section class="subject-section course-section ${course.theme}" data-area="${course.title}" id="course-${course.prefix}"><header class="subject-heading"><h3>${course.title}</h3><span class="course-kind">${course.kind}</span></header><div class="topic-list">${rows}</div></section>`;
    }).filter(Boolean).join('\n');
    return `<section class="school-section" data-school="${school}" aria-label="${schoolLabels[school]}"><h2>${schoolLabels[school]}</h2>${sections}</section>`;
  }).join('\n');
  return {placements, html:`<section class="catalog" aria-label="2022 개정 교육과정별 실험 목록">
<section class="school-section foundation-section" data-school="foundation" aria-label="초·중"><h2>초·중 <small>과학</small></h2><p class="classification-note">초·중 공통 교육과정의 5개 영역·18개 범주</p>${basic}</section>
${high}
</section>`};
}
function build({check=false,map}={}) {
  map ||= require(path.join(lab,'curriculum-map.js'));
  const {placements,html}=render(map);
  const file=path.join(lab,'index.html'), before=fs.readFileSync(file,'utf8');
  const navigation=`<section class="grade-navigation" aria-label="학교급과 학년 선택">
<div class="school-choices" role="group" aria-label="학교급 선택">${[['all','전체'],...Object.entries(schoolLabels)].map(([id,label])=>`<button type="button" data-school-filter="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('')}</div>
<div class="grade-choices" role="group" aria-label="학년 선택" hidden><button type="button" data-grade="전체" aria-pressed="true">전 학년</button>${['초3','초4','초5','초6','중1','중2','중3'].map(g=>`<button type="button" data-grade="${g}" aria-pressed="false">${g}</button>`).join('')}</div>
</section>`;
  let after=before.replace(/<section class="grade-navigation"[\s\S]*?<\/section>/,navigation)
    .replace(/<section class="catalog"[\s\S]*?(?=\s*<\/main>)/,html)
    .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="2022 개정 교육과정의 초·중 과학 영역과 고등 공통·선택 과목별 실험 목록">');
  // Keep the catalog generator and the asset-hash checker independently idempotent.
  after=after.replace(/((?:href|src)=")([^"?]+\.(?:css|js))(?:\?v=[^" ]*)?(")/g,(_,a,url,z)=>a+url+'?v='+crypto.createHash('sha256').update(fs.readFileSync(path.join(lab,url),'utf8').replace(/\r\n/g,'\n')).digest('hex').slice(0,12)+z);
  if(check && after!==before) throw Error('Catalog is stale: run node scripts/build-science-catalog.cjs');
  if(!check && after!==before) fs.writeFileSync(file,after);
  return placements;
}
module.exports={build,render};
if(require.main===module) {
  const placements=build({check:process.argv.includes('--check')});
  console.log(JSON.stringify({apps:Object.keys(placements).length,schools:Object.fromEntries(Object.entries(schoolLabels).map(([id,label])=>[label,Object.values(placements).filter(p=>p.school===id).length])),check:process.argv.includes('--check')}));
}
