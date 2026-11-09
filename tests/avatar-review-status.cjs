"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),accepted=require('../scripts/avatar-review-status.cjs');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'apps/avatar-lab/catalog.json'),'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const completed=catalog.avatars.filter(a=>a.status==='complete').map(a=>a.id);
assert.ok(completed.length>0,'no accepted models to validate');
for(const id of completed){
 const record=catalog.avatars.find(a=>a.id===id),report=JSON.parse(fs.readFileSync(path.join(root,record.reviewEvidence),'utf8'));
 const model=sha('apps/avatar-lab/models/'+id+'.glb'),source=sha(record.source);
 assert(accepted(record,report,model,source));
 assert(!accepted(record,report,'changed-model',source));
 assert(!accepted(record,report,model,'changed-source'));
 assert(!accepted(record,{...report,id:'different-avatar'},model,source));
 assert(!accepted(record,{...report,proofs:[]},model,source));
 assert(!accepted(record,{...report,unresolvedModelDefects:['floating part']},model,source));
 for(const key of Object.keys(record.checks)){
  assert(!accepted({...record,checks:{...record.checks,[key]:'pending'}},report,model,source));
  assert(!accepted(record,{...report,requirements:{...report.requirements,[key]:{status:'pending'}}},model,source));
 }
}
console.log('PASS current reviews accepted; changed bytes, missing checks/proofs and unresolved defects rejected.');
