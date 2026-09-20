const test=require('node:test');const assert=require('node:assert/strict');
const M=require('../learning/arts/art-theory/color-harmony/model.js');
test('area adjustments conserve the whole and leave the other controlled area unchanged',()=>{
 for(let main=10;main<=90;main++)for(let accent=5;accent<=95-main;accent++){
  const state={...M.defaults(),main,accent};
  for(const key of ['main','accent'])for(const requested of [-10,0,5,30,65,95,110]){
   const result=M.adjust(state,key,requested),ratios=M.ratios(result);
   assert.equal(ratios.reduce((a,b)=>a+b,0),100);assert.ok(ratios.every(value=>value>=5));
   assert.equal(result[key==='main'?'accent':'main'],state[key==='main'?'accent':'main']);
   assert.equal(result.hue,state.hue);assert.equal(result.scheme,state.scheme);
  }
 }
});
test('opposite relation changes only the third color, not area or the other colors',()=>{
 const base=M.defaults(),other={...base,scheme:'opposite'};
 assert.deepEqual(M.palette(base).slice(0,2),M.palette(other).slice(0,2));
 assert.notEqual(M.palette(base)[2],M.palette(other)[2]);assert.deepEqual(M.ratios(base),M.ratios(other));
});
test('colors wrap around the hue circle without changing lightness or chroma',()=>{
 assert.equal(M.wrap(-30),330);assert.equal(M.wrap(390),30);
 for(let hue=0;hue<360;hue++)for(const scheme of ['near','opposite']){
  const colors=M.palette({...M.defaults(),hue,scheme});
  colors.forEach(color=>assert.match(color,/^oklch\(65% 0\.08 (?:[0-9]{1,3})\)$/));
 }
});
test('reference snapshots remain unchanged when new values are applied',()=>{
 const reference=M.defaults(),current=M.adjust(reference,'accent',30);
 assert.deepEqual(M.ratios(reference),[60,30,10]);assert.deepEqual(M.ratios(current),[60,10,30]);
 assert.ok(M.samePalette(reference,current));assert.throws(()=>M.adjust(reference,'unknown',50));
});
