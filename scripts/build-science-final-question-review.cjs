// Only the explicitly re-read question groups are added to the review history.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const reader=require('./review-science-questions.cjs'),registry=require('./science-restored-experiments.cjs'),circuit=require('./science-circuit-course.cjs');
const slugs=['telescope-observation','rotating-annulus','sunspot-observation','protein-interaction','air-sampling','local-biodiversity'];
const selected=reader.read().filter(q=>slugs.includes(q.slug)||q.id==='volcano-model#q4'||q.slug===circuit.slug&&Number(q.id.split('#q')[1])>=5);
assert.equal(selected.length,33);
const report={date:'2026-10-12',scope:'Explicit re-reading of these 33 stems, choices, numerical relations and explanations; no claim of empirical student calibration or whole textbook census completion',
 questions:selected.map(q=>({id:q.id,slug:q.slug,sha256:reader.digest(q),after:q})),
 checks:{circuit:'Independent series/parallel Ohm, node current and power conservation; mA/A conversion and wrong meter topology',telescope:'Assembly, aligned field, focus, aperture, magnification, angular obstruction and relative-motion inference',annulus:'Temperature-gradient analogy, one-variable comparison, surface/bottom flow and constant Coriolis parameter boundary',sunspot:'Identity, signed longitude difference, projected length versus angular displacement and bounded latitude inference',docking:'Signed score ordering, target-specific ranking, minimum pose and no efficacy extrapolation',air:'Mass/volume concentration, PM subset, controlled conditions and inlet/zero distinction',biodiversity:'Observed position count versus richness/evenness, equal effort, combined traits and absence versus extinction',volcano:'Gas-driven ejection only; no melting or crystallization inference'},
 sources:[...registry.filter(r=>slugs.includes(r.slug)),circuit].map(r=>({slug:r.slug,source:r.source,assessmentSources:r.assessmentSources||[],boundary:r.boundary}))};
const file=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/final-quality/question-review.json'),body=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),body);else fs.writeFileSync(file,body);
