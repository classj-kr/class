(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VoyageStudyCatalog=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function choices(catalog){
    const cities=(catalog.places||[]).filter(p=>p.isOriginalCity);
    return [
      ...cities.map(p=>({key:'city:'+p.id,name:p.name,type:'도시',kind:'city',region:p.region||'',learning:null})),
      ...(catalog.discoveries||[]).map(p=>({key:'discovery:'+p.id,name:p.name,type:'발견물',kind:'discovery',region:p.todayCountry||'',learning:p.learning})),
      ...(catalog.cityLandmarks||[]).filter(p=>!p.learning?.alias&&cities.some(c=>c.id===p.cityId)).map(p=>({key:'landmark:'+p.id,name:p.name,type:'도시 명소',kind:'landmark',region:cities.find(c=>c.id===p.cityId)?.name||'',learning:p.learning}))
    ];
  }
  function filter(items,{tier='recommended',level='all',topic='all',kind='all',query=''}={}){
    const term=query.trim().toLocaleLowerCase();
    return items.filter(item=>{
      const l=item.learning;
      if(tier==='recommended'&&l&&!l.recommended)return false;
      if(tier==='explore'&&l&&!l.counted)return false;
      if(tier==='later'&&l?.tier!=='later')return false;
      if(level!=='all'&&!l?.levels.includes(level))return false;
      if(topic!=='all'&&l?.topic!==topic)return false;
      if(kind!=='all'&&item.kind!==kind)return false;
      return !term||[item.name,item.region,item.type,l?.label,l?.topic,l?.objective,l?.valuable?'문화 과학 가치':''].join(' ').toLocaleLowerCase().includes(term);
    }).sort((a,b)=>{
      const rank=p=>p.learning?.tier==='core'?0:p.learning?.valuable?1:!p.learning?2:p.learning.tier==='support'?3:p.learning.tier==='extended'?4:5;
      return rank(a)-rank(b)||a.name.localeCompare(b.name,'ko');
    });
  }
  return {choices,filter};
});
