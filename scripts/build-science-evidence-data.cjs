const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source='7e5723f0cbf775d1';
const page=JSON.parse(fs.readFileSync(path.join(root,'tmp/science-audit-2026-10-11/'+source+'.json'))).pages.find(p=>p.pdfPage===137);
const stars=[...page.text.matchAll(/(?:^|\n)(\d+)\n([^\n]+(?:\nJ\d+[^\n]*)?)\n([ps])\n([\d.]+)\s*\n(-?[\d.]+)/g)].map(m=>({id:+m[1],name:m[2].replace(/\s+/g,' ').trim(),component:m[3],mass:+m[4],magnitude:+m[5]}));
assert.equal(stars.length,86);assert.deepEqual(stars.map(s=>s.id),Array.from({length:86},(_,i)=>i+1));
assert.deepEqual(stars[0],{id:1,name:'V421 Peg',component:'p',mass:1.594,magnitude:2.757});
assert.equal(stars[43].mass,1.3207);assert.equal(stars[84].magnitude,-4.911);
const data={source:{id:source,pages:[75,137],solarMagnitude:4.74,description:'천재교육 2022 행성우주과학 137쪽의 1–86번. 75쪽의 태양 절대등급 4.74를 사용하는 광도 변환.'},stars,
 clusters:{ngc2632:{name:'NGC 2632',page:85,printedPage:83,points:[[.01,6.6],[.12,7.5],[.17,6.3],[.19,7.3],[.22,8],[.26,7.7],[.30,8.8],[.34,9.4],[.42,9.7],[.45,9.9],[.47,10.1],[.51,10.5],[.53,10.4],[.57,10.8],[.69,6.6],[.70,11.3],[.75,11.5],[.85,12.2],[.91,12.3],[.98,13],[1.01,12.9],[1.06,13],[1.12,13.2],[1.21,13.7]]},hyades:{name:'히아데스',page:122,printedPage:120,points:[[.12,4.27],[.16,4.20],[.18,4.62],[.21,5.01],[.24,5.43],[.25,5.53],[.26,5.37],[.26,5.38],[.26,5.40],[.29,5.57],[.33,5.78],[.35,5.87],[.35,5.95],[.76,8.57],[.83,8.93],[.87,9.35],[.97,12.52],[.98,3.76],[.99,9.07],[.99,3.65],[1,9.52],[1.01,3.53],[1.07,9.97],[1.01,12.86]]}},
 clusterSource:'cd2d1ced86d442d1',
 // Read from the printed curve at 0.1 colour intervals; not an exact tabulated calibration.
 standard:[[-.27,-2.2],[-.2,-.7],[-.1,.8],[0,1.6],[.1,2.0],[.2,2.4],[.3,2.9],[.4,3.6],[.5,4.3],[.6,4.9],[.7,5.4],[.8,5.9],[.9,6.2],[1,6.7],[1.1,7.2],[1.2,7.7],[1.3,8.1]]};
const body='/* 2022 textbook data; source coordinates are preserved below. */\n(function(root){const data='+JSON.stringify(data,null,2)+';if(typeof module!=="undefined")module.exports=data;else root.scienceEvidenceData=data;})(typeof window==="undefined"?globalThis:window);\n';
const file=path.join(root,'learning/inquiry/science-lab/evidence-data.js');
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),body);else fs.writeFileSync(file,body);
console.log(JSON.stringify({sourceStars:stars.length,clusterPoints:48,standardCurve:'graph read-off, approximate'}));
