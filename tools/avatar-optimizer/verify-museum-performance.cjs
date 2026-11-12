// Run after exercising all three buttons on both local /performance pages.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'outputs/qa/museum-overhaul');
const before=JSON.parse(fs.readFileSync(path.join(dir,'before.json'))),after=JSON.parse(fs.readFileSync(path.join(dir,'after.json')));
const find=(report,label)=>{const row=report.results.find(r=>r.label===label);assert.ok(row,label);return row;};
assert.deepEqual(before.viewport,after.viewport);
for(let room=0;room<5;room++){
  const a=find(after,`room-${room}-pass-0`),b=find(after,`room-${room}-pass-1`),old=find(before,`room-${room}-pass-0`);
  assert.equal(a.memory.textures,b.memory.textures,'texture count grows across room cycles');
  assert.equal(a.memory.geometries,b.memory.geometries,'geometry count grows across room cycles');
  assert.ok(a.drawCalls<old.drawCalls*.5,'static batching did not halve calls');
  assert.deepEqual(a.camera,old.camera);assert.equal(a.pixelRatio,old.pixelRatio);
}
assert.equal(find(after,'dialog-open').renderedFrames,0);
assert.ok(find(after,'dialog-closed').renderedFrames>0);
assert.ok(find(after,'walking').renderHz>find(before,'walking').renderHz*.9);
const overview={scope:after.scope,viewport:after.viewport,entrance:{before:find(before,'room-0-pass-0'),after:find(after,'room-0-pass-0')},lastRoom:{before:find(before,'room-4-pass-1').memory,after:find(after,'room-4-pass-1').memory},walking:{before:find(before,'walking'),after:find(after,'walking')},dialogFrames:{before:find(before,'dialog-open').renderedFrames,after:find(after,'dialog-open').renderedFrames},checksPassed:true};
fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(overview,null,2));
console.log(JSON.stringify({checksPassed:true,entranceCalls:[overview.entrance.before.drawCalls,overview.entrance.after.drawCalls],texturesAfterTwoLaps:[overview.lastRoom.before.textures,overview.lastRoom.after.textures],walkingCpuMs:[overview.walking.before.cpuPerFrameMs,overview.walking.after.cpuPerFrameMs],dialogFrames:overview.dialogFrames},null,2));
