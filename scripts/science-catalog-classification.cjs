// 2022 only. The common curriculum's categories must not be presented as
// the official domains of high-school subjects, which have their own tables.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const reference = 'references/moe/2022-revised-curriculum/extracted/09-science.txt';
const source = fs.readFileSync(path.join(root, reference), 'utf8');
const lines = source.split(/\r?\n/);
const compact = s => s.replace(/\s/g, '');
const foundation = [
  {id:'physics', title:'운동과 에너지', line:111, end:290, categories:['힘과 에너지','전기와 자기','열','빛과 파동']},
  {id:'chemistry', title:'물질', line:291, end:428, categories:['물질의 성질','물질의 변화','물질의 구조']},
  {id:'biology', title:'생명', line:429, end:598, categories:['생물의 구조와 에너지','항상성과 몸의 조절','생명의 연속성','환경과 생태계','생명과학과 인간의 생활']},
  {id:'earth', title:'지구와 우주', line:599, end:768, categories:['고체 지구','유체 지구','천체']},
  {id:'society', title:'과학과 사회', line:769, end:886, categories:['과학과 안전','과학과 지속가능한 사회','과학과 진로']}
];
// One primary placement per app. Multi-topic apps retain their linked standards;
// a primary placement is navigation, not evidence of full category coverage.
const primaryGroups = {
  '힘과 에너지':'lever-balance speed force-motion motion-energy weight-compare',
  '전기와 자기':'magnets circuit-bulbs ohms-law',
  '열':'heat-transfer specific-heat',
  '빛과 파동':'light-shadow refraction sound-vibration wave-transfer',
  '물질의 성질':'mixture-separation separation-methods state-change gases diffusion solubility solubility-curve recrystallise density-buoyancy water-cycle',
  '물질의 변화':'acid-base mass-ratio burning-conditions combustion',
  '물질의 구조':'flame-ions',
  '생물의 구조와 에너지':'living-things microbes microscope cell-structure photosynthesis body-organs body-systems nutrient-detection',
  '항상성과 몸의 조절':'senses reflex-nerve',
  '생명의 연속성':'seed-germination life-cycle pea-genetics',
  '환경과 생태계':'living-environment',
  '고체 지구':'rock-layers minerals-rocks volcano-model plate-tectonics',
  '유체 지구':'land-sea weather-watch weather-front seawater',
  '천체':'night-sky seasons moon-phases apparent-motion stars-universe telescope-observation',
  '과학과 안전':'infection-prevention'
};
const courses = [
  ['10통과1','통합과학1','공통','physics'], ['10통과2','통합과학2','공통','earth'],
  ['10과탐1','과학탐구실험1','공통','society'], ['10과탐2','과학탐구실험2','공통','society'],
  ['12물리','물리학','일반 선택','physics'], ['12화학','화학','일반 선택','chemistry'],
  ['12생과','생명과학','일반 선택','biology'], ['12지구','지구과학','일반 선택','earth'],
  ['12역학','역학과 에너지','진로 선택','physics'], ['12전자','전자기와 양자','진로 선택','physics'],
  ['12물에','물질과 에너지','진로 선택','chemistry'], ['12반응','화학 반응의 세계','진로 선택','chemistry'],
  ['12세포','세포와 물질대사','진로 선택','biology'], ['12유전','생물의 유전','진로 선택','biology'],
  ['12지시','지구시스템과학','진로 선택','earth'], ['12행우','행성우주과학','진로 선택','earth'],
  ['12과사','과학의 역사와 문화','융합 선택','society'], ['12기환','기후변화와 환경생태','융합 선택','society'],
  ['12융탐','융합과학 탐구','융합 선택','society']
].map(([prefix,title,kind,theme]) => ({prefix,title,kind,theme, school:kind==='공통'?'high-common':'high-elective'}));
// Standards following each numbered heading give the high-school domain directly.
const standards = {};
let heading, headingLine;
lines.forEach((line, i) => {
  const h = line.match(/^\(\d+\) (.+)$/);
  if (h) { heading = h[1]; headingLine = i + 1; }
  const s = line.match(/^\[((?:4과|6과|9과)\d{2}-\d{2}|(?:10[가-힣]+\d-\d{2}|12[가-힣]+\d{2})-\d{2})\]\s*(.+)/);
  if (s && !standards[s[1]]) standards[s[1]] = {code:s[1], text:s[2], line:i+1, domain:heading, domainLine:headingLine};
});
const primaryCodes = {measurement:'10통과1-01-02', 'cell-membrane':'10통과1-03-05', 'energy-metabolism':'12세포03-02'};
function classify(map) {
  const placements = {};
  for (const area of foundation) {
    if (lines[area.line-1] !== `(${foundation.indexOf(area)+1}) ${area.title}`) throw Error('Source area moved: '+area.title);
    const table = compact(lines.slice(area.line-1,area.end).join('\n'));
    for (const category of area.categories) {
      if (!table.includes(compact(category))) throw Error('Category absent from source table: '+category);
      for (const slug of (primaryGroups[category]||'').split(' ').filter(Boolean)) {
        if (placements[slug]) throw Error('Duplicate primary placement: '+slug);
        if (!map[slug] || !['elementary','middle'].includes(map[slug].level)) throw Error('Invalid foundation app: '+slug);
        placements[slug] = {school:map[slug].level, area:area.title, category, section:area.id, sourceLine:area.line};
      }
    }
  }
  for (const [slug, app] of Object.entries(map)) {
    if (!app.codes.length || app.codes.some(code=>!standards[code])) throw Error('Unknown standard: '+slug);
    if(app.level!=='high'&&app.courseContexts){
      const base=placements[slug];if(!base||!app.courseContexts[base.school]||app.defaultContext!==base.school)throw Error('Invalid foundation default context: '+slug);
      const scopeCodes=Object.values(app.courseContexts).flatMap(c=>c.codes);
      if(new Set(scopeCodes).size!==scopeCodes.length||scopeCodes.length!==app.codes.length||app.codes.some(c=>!scopeCodes.includes(c)))throw Error('Incomplete mixed-school context: '+slug);
      const primary={...base,context:base.school},additional=[];
      for(const [school,context]of Object.entries(app.courseContexts)){
        if(school===base.school){if(!context.codes.length||context.codes.some(c=>!(base.school==='middle'?/^9과/:/^(4|6)과/).test(c)))throw Error('Non-foundation code: '+slug);continue;}
        if(!context.codes.length)throw Error('Empty mixed-school course: '+slug);
        const linked=context.codes.map(code=>{const course=courses.find(c=>code.startsWith(c.prefix));if(!course||course.school!==school||!context.subjects.includes(course.title))throw Error('Invalid mixed-school course: '+slug);return{...standards[code],course};});
        const first=linked[0];additional.push({school,context:school,area:first.course.title,category:first.domain,section:first.course.prefix,kind:first.course.kind,code:first.code,sourceLine:first.domainLine,related:linked.map(x=>({course:x.course.title,area:x.domain,line:x.domainLine}))});
      }
      placements[slug]={...primary,additional};
    }
    if (app.level === 'high') {
      const linked = app.codes.map(code => {
        const course = courses.find(c=>code.startsWith(c.prefix));
        if (!course) throw Error('No official course for '+code);
        return {...standards[code], course:course.title, kind:course.kind, prefix:course.prefix, school:course.school};
      });
      if (new Set(linked.map(x=>x.school)).size !== 1 && !app.courseContexts) throw Error('Common/elective mixed app needs an explicit route: '+slug);
      const place = (items,context) => {
      const primary = primaryCodes[slug] ? items.find(x=>x.code===primaryCodes[slug]) : items[0];
      if (!primary) throw Error('Missing primary standard: '+slug);
      return {school:primary.school, area:primary.course, category:primary.domain, section:primary.prefix,
        kind:primary.kind, code:primary.code, sourceLine:primary.domainLine,
        ...(context?{context}:{}),
        related:items.filter((x,i)=>items.findIndex(y=>y.course===x.course&&y.domain===x.domain)===i)
          .map(x=>({course:x.course, area:x.domain, line:x.domainLine}))};
      };
      if(app.courseContexts){
        if(!Object.hasOwn(app.courseContexts,app.defaultContext))throw Error('Missing default context: '+slug);
        const routes=Object.entries(app.courseContexts).map(([school,context])=>{
          const items=linked.filter(x=>context.codes.includes(x.code));
          if(!items.length||items.length!==context.codes.length||items.some(x=>x.school!==school)||context.subjects.some(s=>!items.some(x=>x.course===s)))throw Error('Invalid course context: '+slug+' '+school);
          return place(items,school);
        });
        const codes=Object.values(app.courseContexts).flatMap(c=>c.codes);
        if(new Set(codes).size!==codes.length||linked.some(x=>!codes.includes(x.code)))throw Error('Incomplete course context: '+slug);
        const primary=routes.find(p=>p.context===app.defaultContext);
        placements[slug]={...primary,additional:routes.filter(p=>p!==primary)};
      }else placements[slug]=place(linked);
    }
    if (!placements[slug]) throw Error('App has no curriculum placement: '+slug);
  }
  return placements;
}
function catalogEntries(placements){return Object.entries(placements).flatMap(([slug,p])=>[p,...(p.additional||[])].map(placement=>({slug,...placement,href:slug+'/'+(placement.context?'?school='+placement.context:'')})));}
module.exports = {reference, source, foundation, courses, standards, classify,catalogEntries};
