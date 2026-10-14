const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../learning/inquiry');
const context={window:{}};
for(const group of ['body','space','matter'])for(const kind of ['content','lessons'])vm.runInNewContext(fs.readFileSync(path.join(root,`curriculum/${group}-${kind}.js`),'utf8'),context);
const profiles=context.window.SchoolContent;
test('every offered school profile includes a causal explanation beyond the summary',()=>{
    assert.equal(Object.keys(profiles).length,31);
    let count=0;
    for(const [topic,levels]of Object.entries(profiles))for(const [level,p]of Object.entries(levels)){
        count++;
        assert.ok(p.sections.length>=2,`${topic}/${level}`);
        assert.ok(p.sections.slice(1).every(section=>section.paragraphs.length>=2&&section.paragraphs.every(text=>text.length>=70)),`${topic}/${level} lacks explanation`);
        assert.ok(!/미래엔|양일호|2015/.test(p.sections.map(s=>s.title+s.paragraphs.join('')).join('')),`${topic}/${level} leaks reference metadata`);
    }
    assert.equal(count,75);
});
test('new lesson data loads before its renderer on all twelve model pages',()=>{
    const pages=[...['digestion','circulation','respiration','excretion','nervous','homeostasis','immune','skeleton'].map(x=>[`human-body/${x}`, 'body']),...['solar-system','constellations','earth-moon'].map(x=>[`space/${x}`,'space']),['periodic-table','matter']];
    for(const [page,group]of pages){
        const html=fs.readFileSync(path.join(root,page,'index.html'),'utf8');
        const content=html.indexOf(`${group}-content.js`),lessons=html.indexOf(`${group}-lessons.js`),renderer=html.indexOf(`${group}-level.js`);
        assert.ok(content>=0&&lessons>content&&renderer>lessons,page);
        assert.equal(html.split(`${group}-lessons.js`).length,2,page);
    }
});
test('2022 Chemistry lessons do not mislabel concentration, equilibrium and neutralization as a different elective',()=>{
    for(const id of ['solution','equilibrium','acid'])assert.equal(profiles['matter-'+id].high.subject,'화학');
    assert.equal(profiles['space-star-properties'].middle.subject,'과학 2');
});
