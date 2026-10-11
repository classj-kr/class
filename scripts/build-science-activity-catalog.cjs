const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const inventory=require('./audit_science_curriculum.cjs');
const coverage=require('../docs/science-lab-audit-2026-10-11/activity-coverage.json');
const tools=require('./science-activity-tools.cjs');
const rows=coverage.rows.map(r=>({...r,...tools[r.id],tool:r.tool,draftTool:r.draftTool}));
assert.equal(rows.length,261);assert.equal(new Set(rows.map(r=>r.id)).size,261);
for(const id of Object.keys(tools))assert(rows.some(r=>r.id===id),id);
const content='// Generated from 2022 curriculum activity inventory; related links are not completion.\n'+
 '(()=>{const rows='+JSON.stringify(rows)+';if(typeof module!=="undefined")module.exports=rows;else window.scienceActivities=rows;})();\n';
const file=path.join(root,'learning/inquiry/science-lab/activity-catalog.js');
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),content);else fs.writeFileSync(file,content);
console.log(JSON.stringify({source:inventory.reference,activities:rows.length,studentTools:rows.filter(r=>r.tool).length,draftTools:rows.filter(r=>r.draftTool).length,withoutAppOrTool:rows.filter(r=>!r.slugs.length&&!r.tool).length}));
module.exports={tools};
