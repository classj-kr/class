const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('learning/inquiry/periodic-table/molecule-models.js','utf8'),context);
const models = context.window.MOLECULE_MODELS_3D;
const point = atom => [atom.x,atom.y,atom.z];
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const dot = (a,b) => a.reduce((n,v,i)=>n+v*b[i],0);
function angle(a,b,c) {
  const u=sub(point(a),point(b)),v=sub(point(c),point(b));
  return Math.acos(Math.max(-1,Math.min(1,dot(u,v)/Math.hypot(...u)/Math.hypot(...v))))*180/Math.PI;
}
function checkAngles(formula,centerId,expected,tolerance=.06) {
  const m=models[formula],c=m.atoms.find(a=>a.id===centerId);
  const ids=m.bonds.filter(b=>b.type!=='ionic' && [b.from,b.to].includes(centerId)).map(b=>b.from===centerId?b.to:b.from);
  const neighbors=ids.map(id=>m.atoms.find(a=>a.id===id));
  for(let i=0;i<neighbors.length;i++)for(let j=i+1;j<neighbors.length;j++){
    const actual=angle(neighbors[i],c,neighbors[j]);
    assert.ok(Math.abs(actual-expected)<tolerance,`${formula} ${neighbors[i].id}–${centerId}–${neighbors[j].id}: ${actual}° expected ${expected}°`);
  }
}
test('water and ammonia coordinates match their displayed bond angles',()=>{
  checkAngles('H₂O','O1',104.5);checkAngles('NH₃','N1',107);
});
test('linear and trigonal planar structures have the stated geometry',()=>{
  for(const f of ['CO₂','HCN','C₂H₂'])checkAngles(f,'C1',180);
  checkAngles('C₂H₂','C2',180);
  checkAngles('BF₃','B1',120);checkAngles('HCHO','C1',120);
  checkAngles('C₂H₄','C1',120);checkAngles('C₂H₄','C2',120);
  checkAngles('CaCO₃','C1',120);
  for(const f of ['BF₃','HCHO','C₂H₄'])assert.ok(models[f].atoms.every(a=>a.z===0));
});
test('methane, ethane and ethanol carbon centers are tetrahedral',()=>{
  const tetra=Math.acos(-1/3)*180/Math.PI;
  checkAngles('CH₄','C1',tetra);
  for(const f of ['C₂H₆','C₂H₆O'])for(const c of ['C1','C2'])checkAngles(f,c,tetra);
  checkAngles('C₂H₆O','O1',tetra);
});
test('peroxide has the gas phase HOO angle and a twisted HOOH structure',()=>{
  checkAngles('H₂O₂','O1',94.8);checkAngles('H₂O₂','O2',94.8);
  const a=models['H₂O₂'].atoms;
  const h1=a.find(p=>p.id==='H1'),h2=a.find(p=>p.id==='H2');
  const torsion=Math.acos((h1.y*h2.y+h1.z*h2.z)/Math.hypot(h1.y,h1.z)/Math.hypot(h2.y,h2.z))*180/Math.PI;
  assert.ok(Math.abs(torsion-111.5)<.01);
});
test('carbonate shows three equal delocalized C–O bonds',()=>{
  const m=models['CaCO₃'],c=m.atoms.find(a=>a.id==='C1');
  const bonds=m.bonds.filter(b=>b.from==='C1');
  assert.equal(bonds.length,3);assert.ok(bonds.every(b=>b.type==='resonance'));
  const lengths=bonds.map(b=>Math.hypot(...sub(point(m.atoms.find(a=>a.id===b.to)),point(c))));
  assert.ok(Math.max(...lengths)-Math.min(...lengths)<.001);
});
