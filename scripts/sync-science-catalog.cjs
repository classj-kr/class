// Idempotent catalog/header/cache synchronization. curriculum-map.js is authoritative.
const fs=require('node:fs');const crypto=require('node:crypto');const path=require('node:path');
const {edit,apply,lab}=require('./science-scope-patch.cjs');
const map=require('../'+lab+'curriculum-map.js');
const additions={'sound-vibration':['4과07-03'],'heat-transfer':['6과07-02','6과07-04'],gases:['4과15-01'],'acid-base':['6과09-02'],microscope:['6과11-02'],photosynthesis:['9과12-02','9과12-03'],'body-organs':['6과04-01'],'weather-watch':['6과06-02'],'land-sea':['4과06-03'],'stars-universe':['9과15-02'],'electric-field':['12전자01-06']};
const titles={'gravity-motion':'중력과 운동 — 낙하·충격',immune:'면역·백신·혈액형 판정',seawater:'수온 분포와 염분','light-shadow':'빛의 직진·반사·굴절과 그림자','rock-layers':'지층·퇴적암·화석'};
Object.assign(titles,{"microbes":"균류·원생생물·세균 관찰","solubility":"용해량과 용액 진하기","refraction":"거울·렌즈와 빛의 반사·굴절","weight-compare":"물체의 무게와 세 가지 상태","volcano-model":"화산과 화성암 관찰","lever-balance":"힘의 작용과 지레","seasons":"태양 고도·계절과 지구의 운동","diffusion":"입자 운동·상태 변화·기체","weather-front":"전선과 구름 생성","motion-energy":"자유 낙하·빗면과 에너지","ohms-law":"전기 회로·정전기·코일","burning-conditions":"연소와 물질의 변화","mass-ratio":"화학 반응의 질량·부피 관계","pea-genetics":"세포분열과 멘델 유전","cell-membrane":"세포막과 효소 작용","flame-ions":"원소의 성질과 이온"});
for(const [slug,codes]of Object.entries(additions))map[slug].codes=[...new Set([...map[slug].codes,...codes])].sort();
for(const [slug,title]of Object.entries(titles))map[slug].title=title;
const source=fs.readFileSync('references/moe/2022-revised-curriculum/extracted/09-science.txt','utf8');
for(const [slug,m]of Object.entries(map))for(const code of m.codes)if(!source.includes('['+code+']'))throw Error(slug+' missing code '+code);
const mapText='// Related standards are partial links, not a claim of unit completion. Grade = app placement, not mandated school pacing.\nconst scienceCurriculum = '+JSON.stringify(map,null,2)+';\nif (typeof window !== \'undefined\') window.scienceCurriculum = scienceCurriculum;\nif (typeof module !== \'undefined\') module.exports = scienceCurriculum;\n';
edit(lab+'curriculum-map.js',()=>mapText);
const hash=s=>crypto.createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex').slice(0,12);
function cache(s,dir){return s.replace(/(<script\b[^>]*\bsrc=")([^"?]+\.js)(?:\?[^" ]*)?("[^>]*>)/g,(all,start,url,end)=>{
 if(/^(?:https?:)?\/\//.test(url))return all;const target=path.resolve(dir,url);if(!fs.existsSync(target))throw Error('Missing script '+target);
 return start+url+'?v='+hash(target===path.resolve(lab+'curriculum-map.js')?mapText:fs.readFileSync(target,'utf8'))+end;
});}
edit(lab+'index.html',s=>cache(s.replace(/<a class="level-entry available"[^>]*href="([^"/]+)\/"[^>]*>[\s\S]*?<\/a>/g,(all,slug)=>{
 const m=map[slug];if(!m)throw Error('Unknown '+slug);
 return `<a class="level-entry available" data-level="${m.level}" data-grades="${m.grades.join(' ')}" data-standards="${m.codes.join(' ')}" href="${slug}/"><b>${m.grade}</b><span>${m.title}${m.level==='high'?`<small class="course-label">${m.subjects.join(' · ')}</small>`:''}</span></a>`;
}),lab));
for(const [slug,m]of Object.entries(map))edit(lab+slug+'/index.html',s=>{
 if(titles[slug])s=s.replace(/<h1>.*?<\/h1>/,`<h1>${m.title}</h1>`);
 return cache(s,lab+slug);
});
apply();
