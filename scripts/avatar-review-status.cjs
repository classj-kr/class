"use strict";
const checks=['identity','allViews','connections','animation','glb','museumRuntime'];
// Completion belongs to a reviewed pair of source/model bytes, not an avatar ID.
module.exports=function accepted(record,report,modelSha256,sourceSha256){
 return !!(record&&report&&modelSha256&&sourceSha256&&
  record.status==='complete'&&report.status==='accepted'&&record.id===report.id&&
  record.modelSha256===modelSha256&&report.modelSha256===modelSha256&&
  record.sourceSha256===sourceSha256&&report.sourceSha256===sourceSha256&&
  checks.every(key=>record.checks?.[key]==='passed'&&report.requirements?.[key]?.status==='passed')&&
  Array.isArray(report.unresolvedModelDefects)&&report.unresolvedModelDefects.length===0&&
  Array.isArray(report.proofs)&&report.proofs.length>0);
};
