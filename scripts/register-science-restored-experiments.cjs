const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'learning/inquiry/science-lab'),rows=require('./science-restored-experiments.cjs'),map=require(path.join(lab,'curriculum-map.js'));
for(const r of rows)map[r.slug]={grade:r.grade,grades:r.grades,level:r.level,title:r.title,subjects:r.subjects,codes:r.codes,diagnostic:true};
const mapText='// Related standards are partial links, not a claim of unit completion. Grade = app placement, not mandated school pacing.\nconst scienceCurriculum = '+JSON.stringify(map,null,2)+`;\nif (typeof window !== 'undefined') window.scienceCurriculum = scienceCurriculum;\nif (typeof module !== 'undefined') module.exports = scienceCurriculum;\n`;
if(fs.readFileSync(path.join(lab,'curriculum-map.js'),'utf8')!==mapText)fs.writeFileSync(path.join(lab,'curriculum-map.js'),mapText);
const anchors={pasteur:'<h4>작은 생물</h4>','newton-prism':'<h4>빛과 상</h4>','infection-prevention':'<h4>우리 몸</h4>',mendeleev:'<h4>원소와 이온</h4>'};
let catalog=fs.readFileSync(path.join(lab,'index.html'),'utf8');
for(const r of rows){
 if(catalog.includes('href="'+r.slug+'/"'))continue;
 const start=catalog.indexOf(r.group?'<h4>'+r.group+'</h4>':anchors[r.slug]);if(start<0)throw Error('Missing catalog group '+r.slug);
 const stop=catalog.indexOf('</article>',start),cell='<div class="level-cell '+r.level+'">';
 let fragment=catalog.slice(start,stop);
 fragment=fragment.replace('<div class="level-cell '+r.level+' empty" aria-hidden="true"><span class="empty-mark">—</span></div>',cell+'</div>');
 const offset=fragment.indexOf(cell);if(offset<0)throw Error('Missing level cell '+r.slug);
 const at=offset+cell.length,link=`\n                        <a class="level-entry available" data-level="${r.level}" data-grades="${r.grades.join(' ')}" data-standards="${r.codes.join(' ')}" href="${r.slug}/"><b>${r.grade}</b><span>${r.title}${r.level==='high'?'<small class="course-label">'+r.subjects.join(' · ')+'</small>':''}</span></a>`;
 fragment=fragment.slice(0,at)+link+fragment.slice(at);catalog=catalog.slice(0,start)+fragment+catalog.slice(stop);
}
fs.writeFileSync(path.join(lab,'index.html'),catalog);
console.log('Registered source-reviewed experiment routes: '+rows.map(r=>r.slug).join(', '));
