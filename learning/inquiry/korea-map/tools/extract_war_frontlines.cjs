// Trace the centres of the dashed frontline vectors in the National Archives
// reference, not arbitrary polygons. Originals remain in the review directory.
const fs=require('node:fs');
const path=require('node:path');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..');
const refs=process.argv[2];
if(!refs)throw Error('Usage: node extract_war_frontlines.cjs reference-directory');
(async()=>{
  const browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const page=await browser.newPage();
    const result={source:'https://theme.archives.go.kr/next/625/process/frontline.do',
      method:'Centres of the original white dashed frontline segments; source SVG coordinates, 320 × 540.',
      controls:[
        {name:'평양',pixel:[97.15,230.64],xy:[125.75432,39.03385]},
        {name:'서울',pixel:[149.132,292.845],xy:[126.9784,37.566]},
        {name:'부산',pixel:[225.7,408.8],xy:[129.05,35.16]},
        {name:'대구',pixel:[203.8,386.5],xy:[128.601,35.871]},
        {name:'대전',pixel:[149,358.5],xy:[127.385,36.35]},
        {name:'원산',pixel:[148.7,212],xy:[127.44361,39.15278]},
        {name:'성진',pixel:[225,139.5],xy:[129.2,40.67]},
        {name:'청진',pixel:[243,91],xy:[129.8,41.78]},
        {name:'압록강 하구',pixel:[29,173],xy:[124.37,40.1]}
      ],fronts:{}};
    for(const [id,n] of [['nakdong',2],['north',3],['retreat',4],['armisticeReference',5]]){
      const file=`img_map_0${n}_01.svg`;
      await page.setContent(fs.readFileSync(path.join(refs,file),'utf8'));
      let points=await page.evaluate(()=>{
        const original=[...document.querySelectorAll('path')].find(p=>p.getAttribute('fill')==='white');
        return original.getAttribute('d').match(/M[^M]+/g).map(d=>{
          const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);document.querySelector('svg').append(p);
          const b=p.getBBox();p.remove();return [b.x+b.width/2,b.y+b.height/2];
        });
      });
      points=points.filter((p,i)=>!points.slice(0,i).some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<2));
      const start=points.reduce((best,p)=>id==='nakdong'?(p[1]>best[1]?p:best):(p[0]<best[0]?p:best));
      const chain=[start];points.splice(points.indexOf(start),1);
      while(points.length){
        const last=chain.at(-1);points.sort((a,b)=>Math.hypot(a[0]-last[0],a[1]-last[1])-Math.hypot(b[0]-last[0],b[1]-last[1]));chain.push(points.shift());
      }
      result.fronts[id]={image:`https://theme.archives.go.kr/next/images/625/img/${file}`,pixels:chain.map(p=>p.map(x=>Math.round(x*1000)/1000))};
    }
    fs.writeFileSync(path.join(root,'history/war-frontline-reference.json'),JSON.stringify(result,null,2)+'\n');
    console.log(Object.fromEntries(Object.entries(result.fronts).map(([k,v])=>[k,v.pixels.length])));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
