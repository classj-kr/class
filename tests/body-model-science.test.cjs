const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {sarcomere}=require('../learning/inquiry/human-body/shared/model-math.js');

test('sarcomere drawing and displayed lengths use one scale; shortening preserves filaments',()=>{
  let previous;
  for(const length of [2,2.1,2.4,2.8]){
    for(const scale of [75,150,300]){
      const m=sarcomere(length,scale);
      assert.equal(m.a,1.6);assert.equal(m.actin,1);
      assert.ok(Math.abs(m.a+2*m.iHalf-m.length)<1e-10);
      assert.ok(Math.abs(m.h+2*m.actin-m.length)<1e-10);
      for(const k of ['a','actin','h','iHalf'])assert.ok(Math.abs(m.pixels[k]-m[k]*scale)<1e-10);
      assert.ok(Math.abs(m.pixels.z-m.length*scale)<1e-10);
    }
    const m=sarcomere(length,150);
    if(previous){assert.ok(m.h>=previous.h);assert.ok(m.iHalf>=previous.iHalf);}
    previous=m;
  }
  assert.equal(sarcomere(2,150).h,0);
});

function style(initial={}){
  const map=new Map(Object.entries(initial).map(([k,v])=>[k,{value:v,priority:''}]));
  return {getPropertyValue:k=>map.get(k)?.value||'',getPropertyPriority:k=>map.get(k)?.priority||'',
    setProperty:(k,v,p='')=>map.set(k,{value:v,priority:p}),removeProperty:k=>map.delete(k)};
}
function shape(fill,stroke,width,inline={}){
  const attrs=new Map();
  return {style:style(inline),paint:{fill,stroke,strokeWidth:String(width)},matches:()=>true,closest:()=>null,querySelectorAll:()=>[],
    setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),getAttribute:k=>attrs.get(k)??null};
}
test('stroke-only intestine is highlighted without shrinking, selection restores gradients and prior styles',()=>{
  const context={module:{exports:{}},document:{readyState:'loading',addEventListener(){}},requestAnimationFrame(){},
    getComputedStyle:e=>({...e.paint,stroke:e.style.getPropertyValue('stroke')||e.paint.stroke}),WeakMap};
  vm.runInNewContext(fs.readFileSync(require.resolve('../learning/inquiry/human-body/shared/engine-core.js'),'utf8'),context);
  const engine=context.module.exports;
  const intestine=shape('none','url(#intestine)',26);
  const stomach=shape('url(#stomach)','#b0524a',2,{filter:'contrast(1.1)'});
  const hidden=shape('none','none',1);
  const svg={dataset:{},querySelector:s=>({'#intestine':intestine,'#stomach':stomach,'#hidden':hidden}[s])};
  engine.litPart(svg,['intestine','stomach','hidden'],'intestine');
  assert.equal(intestine.style.getPropertyValue('stroke'),'#facc15');
  assert.equal(intestine.style.getPropertyValue('stroke-width'),'','original/dynamic tube width must stay intact');
  engine.litPart(svg,['intestine','stomach','hidden'],'stomach');
  assert.equal(intestine.style.getPropertyValue('stroke'),'');
  assert.equal(intestine.paint.stroke,'url(#intestine)');
  assert.equal(stomach.style.getPropertyValue('stroke-width'),'4');
  engine.litPart(svg,['intestine','stomach','hidden'],'hidden');
  assert.equal(stomach.style.getPropertyValue('filter'),'contrast(1.1)');
  assert.equal(hidden.getAttribute('data-body-highlight'),null,'invisible paths are not made visible');
});
