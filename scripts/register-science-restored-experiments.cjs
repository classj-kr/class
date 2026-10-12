const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'learning/inquiry/science-lab'),rows=require('./science-restored-experiments.cjs'),map=require(path.join(lab,'curriculum-map.js'));
for(const slug of Object.keys(require('./science-experiment-scope.cjs').retiredApps))delete map[slug];
for(const r of rows)map[r.slug]={grade:r.grade,grades:r.grades,level:r.level,title:r.title,subjects:r.subjects,codes:r.codes,diagnostic:true,...(r.bankQuestionIds?{bankQuestionIds:r.bankQuestionIds}:{}),...(r.courseContexts?{defaultContext:r.defaultContext,courseContexts:r.courseContexts}:{})};
const circuit=require('./science-circuit-course.cjs'),ohms=map['ohms-law'];
// The legacy living-environment URL now hosts only the source-reviewed plant-growth procedure.
ohms.codes=['9과14-01','9과14-02','9과14-03','9과14-04',...circuit.codes];ohms.grades=['중2','고2','고3'];ohms.subjects=['과학','물리학'];ohms.diagnostic=true;ohms.defaultContext='middle';
ohms.courseContexts={middle:{subjects:['과학'],codes:ohms.codes.filter(c=>c.startsWith('9')),grades:['중2'],questionNumbers:[1,2,3,4],followupIds:[],intro:''},'high-elective':{title:circuit.title,subjects:['물리학'],codes:circuit.codes,grades:['고2','고3'],questionNumbers:[5,6,7,8],bankQuestionIds:[],followupIds:circuit.followups.map(q=>q.id),standaloneApparatus:true,intro:'각 저항과 전체 회로의 전압·전류를 측정하여 비교하세요.'}};
const mapText='// Related standards are partial links, not a claim of unit completion. Grade = app placement, not mandated school pacing.\nconst scienceCurriculum = '+JSON.stringify(map,null,2)+`;\nif (typeof window !== 'undefined') window.scienceCurriculum = scienceCurriculum;\nif (typeof module !== 'undefined') module.exports = scienceCurriculum;\n`;
if(fs.readFileSync(path.join(lab,'curriculum-map.js'),'utf8')!==mapText)fs.writeFileSync(path.join(lab,'curriculum-map.js'),mapText);
require('./build-science-catalog.cjs').build({map});
console.log('Registered source-reviewed experiment routes: '+rows.map(r=>r.slug).join(', '));
