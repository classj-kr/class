module.exports=function(value){
 const click=s=>document.querySelector(s).click(),set=(id,value)=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};
 const type=value.startsWith('lauric')?'lauric':value.startsWith('melt')?'melt':value.startsWith('boil2')?'boil2':value.startsWith('freeze')||['bottom','air'].includes(value)?'freeze':'boil';
 click('[data-hc-case='+type+']');set('hcBath',value==='freeze-zero'?'0':'-15');set('hcProbe',['bottom','air'].includes(value)?value:value==='lauric-bottom'?'bottom':'water');
 if(type==='lauric'&&value!=='lauric-ready'){click('#hcMeltLauric');if(value!=='lauric-bath')click('#hcRemoveLauric');}
 if(!['initial','bottom','air','lauric-ready','lauric-bottom'].includes(value))click('#hcFinish');
 if(value.endsWith('mid')){const e=document.getElementById('hcRead');e.value=type==='melt'?6:type==='freeze'?8:10;e.dispatchEvent(new Event('input',{bubbles:true}));}
 document.querySelector('.hc-table-section').open=value==='table';
 if(['wrong','correct','lauric-wrong','lauric-correct'].includes(value)){set('hcFrom','0');set('hcTo','4');click('#hcCheck');if(value.endsWith('correct')){set('hcFrom',type==='lauric'?'4':'9');set('hcTo',type==='lauric'?'18':'13');click('#hcCheck');}}
 if(value==='freeze-zero'||value==='lauric-bath')click('#hcNoPhase');
};
