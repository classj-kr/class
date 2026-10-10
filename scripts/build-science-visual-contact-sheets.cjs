const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const dir=path.resolve(process.argv[2]),kind=process.argv[3]||'apps',engine=process.argv.includes('--webkit')?'webkit':'chromium';
const initial=process.argv.includes('--initial');
const safe=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
(async()=>{
 const inventory=JSON.parse(fs.readFileSync(path.join(dir,kind==='apps'?'summary-'+engine+'.json':'inventory-'+engine+'.json'),'utf8'));
 const items=kind==='apps'?inventory.reports.flatMap(r=>r.modes.map(mode=>({slug:r.slug,label:r.slug+' / '+mode,file:r.slug+'-'+mode+(initial?'-':'-end-')+engine+'.webp'}))):inventory.shots.map(s=>({...s,label:s.slug+' / '+s.id+' / '+s.variant}));
 const prefix=(kind==='apps'?(initial?'before':'after'):'panels')+'-'+engine;
 const pages=[];
 for(let start=0;start<items.length;start+=9){const batch=items.slice(start,start+9),parts=[];for(const[i,item]of batch.entries()){
  const file=path.join(dir,item.file),meta=await sharp(file).metadata(),left=kind==='apps'&&meta.width>850?296:0;
  const preview=await sharp(file).extract({left,top:0,width:meta.width-left,height:Math.min(meta.height,kind==='apps'?770:1000)}).resize(530,460,{fit:'contain',background:'#fff'}).webp({lossless:true}).toBuffer();
  const x=i%3*540,y=Math.floor(i/3)*510;
  parts.push({input:Buffer.from(`<svg width="530" height="44"><rect width="530" height="44" fill="#e6edf0"/><text x="8" y="18" font-size="14" font-family="sans-serif">${start+i+1}. ${safe(item.label.slice(0,65))}</text><text x="8" y="36" font-size="12" font-family="sans-serif">${safe(item.label.slice(65,135))}</text></svg>`),left:x,top:y},{input:preview,left:x,top:y+44});
 }
 const file=prefix+'-'+String(start/9+1).padStart(2,'0')+'.webp';await sharp({create:{width:1620,height:Math.ceil(batch.length/3)*510,channels:3,background:'#dbe4e8'}}).composite(parts).webp({lossless:true}).toFile(path.join(dir,file));pages.push({file,items:batch});
 }
 fs.writeFileSync(path.join(dir,prefix+'-contacts.json'),JSON.stringify(pages,null,2));console.log(JSON.stringify({kind,items:items.length,pages:pages.length}));
})().catch(e=>{console.error(e);process.exitCode=1;});
