'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Font = require('../assets/fonts/classj-pen-m/source');
const failures = [], gaps = [];
let minimumGap = Infinity;
for (let cp = 0xac00; cp <= 0xd7a3; cp++) {
  const char = String.fromCodePoint(cp), parts = Font.components(char);
  const paths = parts.flatMap(p => p.paths), points = paths.flat();
  assert.ok(paths.length >= 2 && paths.length <= 30, char);
  assert.ok(points.every(p => p.length === 2 && p.every(Number.isFinite)), char);
  const bounds = [Math.min(...points.map(p=>p[0])), Math.min(...points.map(p=>p[1])), Math.max(...points.map(p=>p[0])), Math.max(...points.map(p=>p[1]))];
  if(bounds[0]<-5 || bounds[1]<-5 || bounds[2]>103 || bounds[3]>102) failures.push({char,bounds});
  const initial = parts.find(p=>p.kind==='initial'), final = parts.find(p=>p.kind==='final');
  if(!final) continue;
  const upper = initial.paths.flat(), lower = final.paths.flat();
  let gap = Math.min(...lower.map(p=>p[1])) - Math.max(...upper.map(p=>p[1]));
  if(gap < 7) {
    const a = initial.paths.flatMap(p=>Font.sample(p,32)), b = final.paths.flatMap(p=>Font.sample(p,32));
    gap = Infinity;
    for(const p of a) for(const q of b) gap=Math.min(gap,Math.hypot(p[0]-q[0],p[1]-q[1]));
  }
  minimumGap = Math.min(minimumGap,gap);
  if(gap<4.7) gaps.push({char,gap});
}
for(let cp=0x3131;cp<=0x3163;cp++) assert.ok(Font.model(String.fromCodePoint(cp)).length>0);
assert.equal(Font.model('A'),null);
const report = {syllables:11172,jamo:51,minimumInitialFinalGap:minimumGap,boundsFailures:failures,closeInitialFinalPairs:gaps};
const out=path.join(__dirname,'../outputs/handwriting/pen-m/coverage-check.json');
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,boundsFailures:failures.slice(0,8),closeInitialFinalPairs:gaps.slice(0,12),closeCount:gaps.length}));
assert.equal(failures.length,0,'Glyphs outside design cell');
assert.equal(gaps.length,0,'Initial/final collisions');
