const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../learning/arts/art-theory/design-principles/model.js');
test('both balance arrangements preserve total area and stay within the canvas',()=>{
 const area=items=>items.reduce((sum,item)=>sum+Math.PI*item.r**2,0);
 const baseline=area(M.objects('balance',M.defaults('balance')));
 for(const layout of ['mirror','varied'])for(let shift=-45;shift<=45;shift++){
  const items=M.objects('balance',{layout,shift});assert.equal(items.length,4);assert.ok(Math.abs(area(items)-baseline)<1e-8);
  for(const {x,y,r} of items)assert.ok(x-r>=0&&x+r<=380&&y-r>=0&&y+r<=340);
 }
});
test('rhythm changes only spacing and keeps both ends fixed without overlap',()=>{
 for(const pattern of ['even','alternate','growing'])for(let amount=0;amount<=100;amount++){
  const items=M.objects('rhythm',{pattern,amount});assert.equal(items.length,7);assert.equal(items[0].x,50);assert.ok(Math.abs(items[6].x-330)<1e-10);
  for(let i=0;i<items.length;i++){assert.equal(items[i].y,170);assert.equal(items[i].r,12);if(i)assert.ok(items[i].x-items[i-1].x>24);}
  if(pattern==='growing')for(let i=2;i<items.length;i++)assert.ok(items[i].x-items[i-1].x>=items[i-1].x-items[i-2].x-1e-10);
 }
});
test('emphasis modifies only the chosen element and selection alone changes nothing visible',()=>{
 const base=M.defaults('emphasis'),normal=M.objects('emphasis',base);
 for(let target=1;target<=7;target++){
  assert.ok(M.equivalent('emphasis',base,{...base,target}));
  const changed=M.objects('emphasis',{target,size:180,contrast:100});
  changed.forEach((item,i)=>{if(i!==target-1)assert.deepEqual(item,normal[i]);else{assert.equal(item.x,normal[i].x);assert.equal(item.y,normal[i].y);assert.ok(item.r>normal[i].r);assert.notEqual(item.fill,normal[i].fill);}});
 }
});
test('controls clamp inputs and preserve source states',()=>{
 const state=M.defaults('balance');assert.deepEqual(M.change(state,'shift',999),{layout:'mirror',shift:45});assert.deepEqual(state,{layout:'mirror',shift:0});
 assert.throws(()=>M.change(state,'shift',NaN),RangeError);assert.throws(()=>M.change(state,'layout','invalid'),RangeError);
 assert.ok(M.equivalent('rhythm',{pattern:'even',amount:0},{pattern:'even',amount:100}));
});
