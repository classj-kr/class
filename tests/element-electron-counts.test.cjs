const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{}};vm.runInNewContext(fs.readFileSync('learning/inquiry/periodic-table/elements-data.js','utf8'),c);
const elements=c.window.ELEMENTS_DATA;
test('all 118 neutral atoms conserve electron count and shell capacity',()=>{
    assert.equal(elements.length,118);assert.equal(new Set(elements.map(e=>e.number)).size,118);
    for(const e of elements){assert.equal(e.shells.reduce((n,v)=>n+v,0),e.number,e.symbol);e.shells.forEach((count,n)=>assert.ok(count<=2*(n+1)**2,e.symbol));}
});
test('Sm and Eu shell populations match NIST ground configurations [Xe]4f6,7 6s2',()=>{
    for(const [symbol,shells] of [['Sm',[2,8,18,24,8,2]],['Eu',[2,8,18,25,8,2]]])assert.deepEqual(Array.from(elements.find(e=>e.symbol===symbol).shells),shells);
});
