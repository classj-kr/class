const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'learning/inquiry/science-lab'),rows=require('./science-restored-experiments.cjs'),map=require(path.join(lab,'curriculum-map.js'));
for(const slug of Object.keys(require('./science-experiment-scope.cjs').retiredApps))delete map[slug];
for(const r of rows)map[r.slug]={grade:r.grade,grades:r.grades,level:r.level,title:r.title,subjects:r.subjects,codes:r.codes,diagnostic:true,...(r.courseContexts?{defaultContext:r.defaultContext,courseContexts:r.courseContexts}:{})};
const mapText='// Related standards are partial links, not a claim of unit completion. Grade = app placement, not mandated school pacing.\nconst scienceCurriculum = '+JSON.stringify(map,null,2)+`;\nif (typeof window !== 'undefined') window.scienceCurriculum = scienceCurriculum;\nif (typeof module !== 'undefined') module.exports = scienceCurriculum;\n`;
if(fs.readFileSync(path.join(lab,'curriculum-map.js'),'utf8')!==mapText)fs.writeFileSync(path.join(lab,'curriculum-map.js'),mapText);
require('./build-science-catalog.cjs').build({map});
console.log('Registered source-reviewed experiment routes: '+rows.map(r=>r.slug).join(', '));
