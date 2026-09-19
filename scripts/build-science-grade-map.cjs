const fs=require('node:fs');
const {edit,replace:r,cut,apply,lab}=require('./science-scope-patch.cjs');
const {apps}=require('../docs/science-lab-audit-2026-09-20/review-data.cjs');
const source=fs.readFileSync('references/moe/2022-revised-curriculum/extracted/09-science.txt','utf8');
const original=fs.readFileSync(lab+'index.html','utf8');
if(original.includes('grade-navigation.js'))throw Error('Initial migration already applied. Use scripts/sync-science-catalog.cjs --apply to synchronize the current map.');
const moves={'senses':'중3','moon-phases':'중1','cell-osmosis':'고2~3','recrystallise':'중2','neutralization':'고2~3'};
const titles={'diffusion':'입자의 확산','cell-osmosis':'세포막 수송과 삼투','seed-germination':'씨의 발아와 식물의 자람','living-environment':'강낭콩 기르기와 먹이 관계','water-cycle':'증발·응결과 물의 순환','gases':'기체의 성질과 부피 변화','population':'개체군 성장과 방형구 조사'};
const selected={
 'lens-image':['12물리'],'photoelectric':['12물리','12전자'],'interference':['12물리','12역학'],
 'torque':['12물리'],'collision':['12물리'],'electric-field':['12전자'],'induction':['12전자','12물리'],
 'semiconductor-relativity':['12물리'],'motor-magnet':['12물리','12전자'],'energy-heat':['12물리','12역학'],'heat-engine':['12역학'],
 'molecule-shape':['12화학'],'neutralization':['12화학'],'titration':['12반응'],'mole':['12화학'],'rate-equilibrium':['12화학','12물에'],'redox':['12반응'],
 'cell-osmosis':['12세포'],'cell-division':['12생과'],'energy-metabolism':['12세포'],'homeostasis':['12생과'],'immune':['12생과'],'enzyme':['12세포'],'neuron':['12생과'],'dna-gel':['12유전'],'phylogeny':['12생과'],'population':['12생과'],
 'rock-age':['12지구'],'metamorphism':['12지구'],'magma':['12지구','12지시'],'earthquake':['12지시'],'air-stability':['12지시'],'typhoon':['12지구'],'ocean-circulation':['12지시'],'ocean-layers':['12지구'],'planet-motion':['12지구'],'stars':['12지구','12행우'],'galaxy-hubble':['12지구','12행우']
};
const courses={'12물리':'물리학','12역학':'역학과 에너지','12전자':'전자기와 양자','12화학':'화학','12물에':'물질과 에너지','12반응':'화학반응의 세계','12생과':'생명과학','12세포':'세포와 물질대사','12유전':'생물의 유전','12지구':'지구과학','12지시':'지구시스템과학','12행우':'행성우주과학'};
const links=[...original.matchAll(/<a class="level-entry available"[^>]*href="([^"/]+)\/"[^>]*><b>(.*?)<\/b><span>(.*?)<\/span><\/a>/g)];
if(links.length!==102||apps.length!==102)throw Error('Expected 102 apps');
const map={};
for(const [,slug,oldGrade,oldTitle] of links){
 const row=apps.find(x=>x.slug===slug);if(!row)throw Error('Missing review '+slug);
 const grade=moves[slug]||oldGrade;
 const prefixes=selected[slug]||(grade.startsWith('초')?[Number(grade.slice(1))<=4?'4과':'6과']:grade.startsWith('중')?['9과']:grade==='고1'?['10통과','10과탐']:null);
 if(!prefixes)throw Error('Course not reviewed '+slug);
 const codes=row.codes.filter(c=>prefixes.some(p=>c.startsWith(p)));
 if(!codes.length||codes.some(c=>!source.includes('['+c+']')))throw Error('Unverified standard '+slug+': '+codes);
 const subjects=grade.startsWith('고')?(grade==='고1'?[...new Set(codes.map(c=>c.startsWith('10통과1')?'통합과학1':c.startsWith('10통과2')?'통합과학2':'과학탐구실험1'))]:prefixes.map(p=>courses[p])):['과학'];
 map[slug]={grade,grades:grade==='고2~3'?['고2','고3']:[grade],level:grade.startsWith('초')?'elementary':grade.startsWith('중')?'middle':'high',title:titles[slug]||oldTitle.split('<small')[0],subjects,codes};
}
const mapText=`// Related standards are partial links, not a claim of unit completion. Grade = app placement, not mandated school pacing.\nconst scienceCurriculum = ${JSON.stringify(map,null,2)};\nif (typeof window !== 'undefined') window.scienceCurriculum = scienceCurriculum;\nif (typeof module !== 'undefined') module.exports = scienceCurriculum;\n`;
if(fs.readFileSync(lab+'curriculum-map.js','utf8').replace(/\r\n/g,'\n')!==mapText)edit(lab+'curriculum-map.js',()=>mapText);
edit(lab+'index.html',s=>{
 if(s.includes('grade-navigation.js'))return s;
 // Rebuild only the three cells in each existing topic. Preserve all subject/topic structure.
 s=s.replace(/<div class="level-matrix">([\s\S]*?)<\/div><\/article>/g,(whole,inner)=>{
  const slugs=[...inner.matchAll(/href="([^"/]+)\/"/g)].map(m=>m[1]);
  return '<div class="level-matrix">\n'+['elementary','middle','high'].map(level=>{
   const entries=slugs.filter(slug=>map[slug].level===level).map(slug=>{const m=map[slug];return `<a class="level-entry available" data-level="${level}" data-grades="${m.grades.join(' ')}" data-standards="${m.codes.join(' ')}" href="${slug}/"><b>${m.grade}</b><span>${m.title}${level==='high'?`<small class="course-label">${m.subjects.join(' · ')}</small>`:''}</span></a>`;});
   return entries.length?`                    <div class="level-cell ${level}">\n${entries.map(e=>'                        '+e).join('\n')}\n                    </div>`:`                    <div class="level-cell ${level} empty" aria-hidden="true"><span class="empty-mark">—</span></div>`;
  }).join('\n')+'\n                </div></article>';
 });
 s=r(s,'<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="styles.css">\n    <link rel="stylesheet" href="grade-navigation.css?v=1">');
 s=r(s,'        <section class="catalog"',`        <section class="grade-navigation" aria-label="학년별 시험 대비">
            <h1>과학 실험 · 학년별 시험 대비</h1>
            <div class="grade-choices" role="group" aria-label="학년 선택">${['전체','초3','초4','초5','초6','중1','중2','중3','고1','고2','고3'].map(g=>`<button type="button" data-grade="${g}" aria-pressed="${g==='전체'}">${g}</button>`).join('')}</div>
            <label class="course-choice" hidden>고등학교 과목 <select id="courseSelect"><option value="">전체 과목</option></select></label>
            <p id="gradeCount" role="status">전체 102개 실험</p>
            <p class="placement-note">학년은 이 앱의 편성 기준입니다. 교육과정은 학년군으로 제시되므로 학교·교과서의 진도와 시험 범위를 확인하세요. 고2·고3은 수강 과목으로도 고를 수 있습니다.</p>
        </section>
        <section class="catalog"`);
 return r(s,'</body>','    <script src="curriculum-map.js?v=1"></script>\n    <script src="grade-navigation.js?v=1"></script>\n</body>');
});
for(const [slug,m] of Object.entries(map))edit(lab+slug+'/index.html',s=>{
 if(s.includes('../exam-scope.js'))return s;
 if(slug==='earthquake')s=r(s,'<p><span>고등학교 2~3학년</span><span>지구과학</span></p>','<div class="grade-tags"><span>고등학교 2~3학년</span><span>지구과학</span></div>');
 const longGrade=m.grade.startsWith('초')?'초등 '+m.grade.slice(1)+'학년':m.grade.startsWith('중')?'중학교 '+m.grade.slice(1)+'학년':'고등학교 '+m.grade.slice(1)+'학년';
 s=cut(s,/<div class="grade-tags">[\s\S]*?<\/div>/,`<div class="grade-tags"><span>${longGrade}</span>${m.subjects.map(c=>`<span>${c}</span>`).join('')}</div>`);
 if(titles[slug])s=cut(s,/<h1>.*?<\/h1>/,`<h1>${m.title}</h1>`);
 if(!s.includes('../exam-scope.css'))s=r(s,'</head>','    <link rel="stylesheet" href="../exam-scope.css?v=1">\n</head>');
 return r(s,'</body>','    <script src="../curriculum-map.js?v=1"></script>\n    <script src="../exam-scope.js?v=1"></script>\n</body>');
});
apply();
