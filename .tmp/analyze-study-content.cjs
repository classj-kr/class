const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
const C=require(path.join(base,'lib/mission-catalog')),stories=require(path.join(base,'data/catalog/city-stories.json'));
const pool=[...C.DISCOVERIES,...C.CITY_LANDMARKS,...C.PLACES.filter(p=>p.isOriginalCity).map(p=>({...p,text:(stories.find(t=>t.cityId===p.id)?.sections||C.ADDITIONAL_SETTLEMENTS.find(t=>t.id===p.id)?.story.sections||[]).map(t=>t.text).join(' ')}))];
const Study=require(path.join(base,'lib/place-study'));
const results=pool.map(p=>({id:p.id,name:p.name,text:p.text,qs:Study.createQuestions(p,pool)}));
fs.writeFileSync(path.join(__dirname,'study-content-analysis.json'),JSON.stringify(results,null,2));
const counts={places:results.length,keywordOnly:0,fallbackPlaces:0,nameQuestion:0};
for(const p of results){if(p.qs.every(q=>q.prompt==='읽은 설명의 빈칸에 들어갈 말은?'))counts.keywordOnly++;else counts.fallbackPlaces++;if(p.qs.some(q=>q.prompt==='다음 설명에 해당하는 장소는?'))counts.nameQuestion++;}
console.log(JSON.stringify(counts));
console.log(results.filter(p=>p.qs.some(q=>q.prompt==='다음 설명에 해당하는 장소는?')).map(({id,name,text})=>({id,name,text})));
