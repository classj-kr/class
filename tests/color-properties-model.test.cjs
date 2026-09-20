const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../learning/arts/art-theory/color-properties/model.js');
test('all offered controls stay in gamut and change only one attribute',()=>{
  for(let h=0;h<M.hues.length;h++){
    const reference=M.base(h);
    for(const axis of ['h','l','c']){
      const {min,max}=M.bounds(axis,reference);
      assert.ok(min<=reference[axis]&&max>=reference[axis]);
      for(let value=min;value<=max;value++){
        const result=M.change(reference,axis,value);
        assert.ok(M.inGamut(result),JSON.stringify(result));
        for(const frozen of ['h','l','c'].filter(key=>key!==axis))assert.equal(result[frozen],reference[frozen]);
        assert.ok(M.rgb(result).every(channel=>channel>=0&&channel<=255));
      }
    }
  }
});
test('removing chroma produces neutral gray at the same lightness',()=>{
  for(let h=0;h<M.hues.length;h++){
    const gray=M.change(M.base(h),'c',0);
    assert.equal(gray.l,65);
    const [r,g,b]=M.rgb(gray);assert.equal(r,g);assert.equal(g,b);
  }
});
test('lightness increases all displayed channels while preserving hue and chroma',()=>{
  for(let h=0;h<M.hues.length;h++){
    const base=M.base(h),bounds=M.bounds('l',base);let previous=[-1,-1,-1];
    for(let l=bounds.min;l<=bounds.max;l++){
      const rgb=M.rgb(M.change(base,'l',l));
      rgb.forEach((channel,index)=>assert.ok(channel>=previous[index]));previous=rgb;
    }
  }
});
test('each matching task changes exactly one attribute from its starting color',()=>{
  for(const task of M.tasks){
    assert.ok(M.inGamut(task.target));
    assert.deepEqual(['h','l','c'].filter(key=>task.target[key]!==M.base(5)[key]),[task.axis]);
    assert.ok(M.matches(task.target,task.target));assert.ok(!M.matches(M.base(5),task.target));
  }
});
test('controls constrain values without silently modifying another attribute',()=>{
  const reference=M.base(5),bounds=M.bounds('c',reference);
  assert.equal(M.change(reference,'c',1000).c,bounds.max);
  assert.deepEqual(reference,M.base(5));
  assert.throws(()=>M.rgb({h:5,l:99,c:100}),RangeError);
});
