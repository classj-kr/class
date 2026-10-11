const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),scope=require('../scripts/science-experiment-scope.cjs');
const coverage=require('../docs/science-lab-audit-2026-10-11/activity-coverage.json');
const plan=require('../scripts/science-remaining-activities.cjs');
const queue=plan.candidates;
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const catalog=require('../learning/inquiry/science-lab/activity-catalog.js');
test('non-experiment exclusions agree with the curriculum source and stay out of the implementation queue',()=>{
 const source=fs.readFileSync(path.join(root,coverage.basis),'utf8').split(/\r?\n/);
 for(const[id,d]of Object.entries(scope.exclusions)){
  const row=coverage.rows.find(r=>r.id===id);assert(row,id);
  assert.equal(row.text,d.text,id);assert.equal(source[row.line-1].replace(/^•\s*/,''),d.text,id);
  assert.equal(row.labScope.status,'excluded',id);assert.equal(row.status,'실험실 대상 제외',id);
  assert(!queue.some(r=>r[0]===id),id);assert(!catalog.some(r=>r.id===id),id);
 }
 assert.equal(coverage.rows.length,261,'Retain the complete source inventory for audit');
 assert.deepEqual(queue.map(r=>r[0]).sort(),coverage.rows.filter(r=>r.labScope.status!=='excluded'&&!r.slugs.length&&!r.tool).map(r=>r.id).sort());
 assert.equal(coverage.experimentScope.requiredExperimentTotal,null);
});
test('source references and unresolved procedures cannot become independent experiment work items',()=>{
 const review=require('../docs/science-lab-audit-2026-10-11/remaining-procedure-review.json');
 const byId=Object.fromEntries(review.rows.map(r=>[r.id,r]));
 const direct=plan.experimentGroups.flatMap(g=>g.activities);
 const partition=[...direct,...plan.referenceActivities,...plan.unresolvedActivities];
 assert.equal(new Set(partition).size,partition.length);
 assert.deepEqual(partition.sort(),queue.map(r=>r[0]).sort());
 for(const id of direct)assert(['experiment','measurement','observation'].includes(byId[id].kind),id);
 for(const id of plan.referenceActivities)assert.equal(byId[id].kind,'data-analysis',id);
 for(const id of plan.unresolvedActivities)assert.equal(byId[id].kind,'unresolved',id);
 const groups=plan.experimentGroups;
 for(const id of ['9과07#1','12행우01#2']){assert(!groups.some(g=>g.activities.includes(id)));assert(coverage.rows.find(r=>r.id===id).slugs.includes('telescope-observation'));}
 assert.equal(plan.resolvedGroups.find(g=>g.activities.includes('10과탐2-01#2')),plan.resolvedGroups.find(g=>g.activities.includes('12기환01#1')));
 for(const group of plan.resolvedGroups)for(const id of group.activities){assert(!queue.some(r=>r[0]===id));assert(coverage.rows.find(r=>r.id===id).slugs.some(slug=>group.relatedApps.includes(slug)));}
 const audit=require('../docs/science-lab-audit-2026-10-11/gap-triage.json');
 assert.equal(audit.requiredExperimentTotal,null);
 assert.equal(audit.workSummary.newAppCount,null);
 assert.equal(audit.resolvedGroups.length,3);for(const g of audit.resolvedGroups){assert.equal(g.implementationStatus,'virtual-practice');assert.equal(g.mandatoryStatus,'unconfirmed');assert.match(g.boundary,/완료/);}
 for(const group of audit.workGroups){assert.equal(group.implementationStatus,'review');assert.equal(group.mandatoryStatus,'unconfirmed');}
 for(const row of audit.rows.filter(r=>r.queue!=='experiment-review'))assert.equal(row.workGroup,null);
});
test('experimental design, observation and measurement are not discarded by title keywords or elective status',()=>{
 for(const id of ['9과08#1','12물에01#1','12세포01#2','12전자02#2','9과07#1','12역학01#1','12유전03#1','12지시03#4']){
  assert(!scope.exclusions[id],id);assert(catalog.some(r=>r.id===id),id);
 }
 for(const slug of ['gas-identification','microscope','polarization','smart-pot','speaker-lab','titration','water-wave-tank'])assert(map[slug],slug);
});
test('retired lifestyle worksheet cannot remain a student route or reappear through generation',()=>{
 const restored=require('../scripts/science-restored-experiments.cjs');
 const questions=require('../learning/inquiry/science-lab/experiment-questions.js');
 const html=fs.readFileSync(path.join(root,'learning/inquiry/science-lab/index.html'),'utf8');
 for(const slug of Object.keys(scope.retiredApps)){
  assert(!map[slug]);assert(!restored.some(r=>r.slug===slug));assert(!html.includes(`href="${slug}/"`));
  assert(!fs.existsSync(path.join(root,'learning/inquiry/science-lab',slug)));
  assert(!Object.keys(questions.misconceptions).some(id=>id.startsWith(slug+'#')));
  assert(!questions.followups[slug]);
  assert(fs.existsSync(path.join(root,'docs/science-lab-audit-2026-10-11/retired-non-experiments',slug,'index.html')));
 }
});
