// Only for repeatable layout inspection. Interaction tests use actual pointer/touch events.
module.exports=function(value){
 const $=s=>document.querySelector(s),mode=value.startsWith('cart')?'cart':'projectile';$('[data-vm-demo='+mode+']').click();
 const canvas=$('#vmCanvas'),r=canvas.getBoundingClientRect(),mark=(x,y)=>{const p={pointerId:1,clientX:r.left+x/canvas.width*r.width,clientY:r.top+y/canvas.height*r.height,bubbles:true};canvas.dispatchEvent(new PointerEvent('pointerdown',p));canvas.dispatchEvent(new PointerEvent('pointerup',p));};
 const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('change'));},a=mode==='cart'?150:550;
 mark(a,420);mark(a+(mode==='cart'?400:180),420);$('[data-vm-tool=origin]').click();const o=scienceVideoMotion.demo(mode,0);mark(o.x,o.y);$('[data-vm-tool=track]').click();for(let frame=0;frame<=24;frame+=3){const p=scienceVideoMotion.demo(mode,frame);mark(p.x,p.y);}
 if(value==='cart-axis')set('vmAngle',-17.7447);if(value==='projectile-mass')set('vmMass',100);
 $('.vm-data').open=value==='cart-data';$('.vm-energy').open=value.startsWith('projectile-');$('.vm-energy').dispatchEvent(new Event('toggle'));
 if(__videoMotion.getState().points.length!==9)throw Error('Nine positions were not marked');
};
