module.exports=function(value){
 const [kind,stage,n='8',cross='0',orientation='1']=value.split(':');
 __divModel.setKind(kind);__divModel.setChrom(Number(n));
 const checkbox=document.getElementById('cdCross');checkbox.checked=cross==='1';checkbox.dispatchEvent(new Event('change'));
 const current=__divModel.snapshot().orientation;for(let p=0;p<Number(n)/2;p++)if(((current^Number(orientation))>>p)&1)document.querySelector('[data-cd-pair="'+p+'"]').click();
 __divModel.setStage(Number(stage));
};
