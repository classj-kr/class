const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../learning/inquiry');
const context={window:{ExamData:require('../learning/inquiry/human-body/shared/exam-data.js'),KOREA_GEOGRAPHY:{questions:[]}}};
vm.createContext(context);
for(const f of ['curriculum/body-content.js','curriculum/matter-content.js','curriculum/map-content.js','curriculum/body-practice.js','curriculum/matter-practice.js','curriculum/map-practice.js','korea-map/data/questions.js','korea-map/data/study-lessons.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
const w=context.window;
const identities=new Map();
function validate(items,label){
    assert.ok(items.length>0,`${label} has no objective questions`);
    const ids=new Set();
    for(const q of items){
        assert.ok(q.id&&!ids.has(q.id),`${label} duplicate/missing question ID ${q.id}`);ids.add(q.id);
        assert.ok((q.question||q.prompt).length>10,q.id);
        assert.ok(q.options.length>=3,q.id);
        assert.equal(new Set(q.options).size,q.options.length,`${q.id} duplicated choices`);
        assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,q.id);
        assert.ok(q.explanation.length>10,q.id);
        const signature=JSON.stringify([q.question||q.prompt,q.options,q.answer]);
        if(identities.has(q.id))assert.equal(signature,identities.get(q.id),`${q.id} changes meaning across modes`);
        identities.set(q.id,signature);
    }
}
test('all 24 body and 21 matter profiles have gradeable questions and stable identities',()=>{
    for(const [key,profiles] of Object.entries(w.SchoolContent)){
        for(const level of Object.keys(profiles)){
            const body=key.startsWith('body-'),topic=key.replace(/^(body|matter)-/,'');
            const items=(body?w.BodyPractice:w.MatterPractice).forLevel(topic,level);
            validate(items,`${key}:${level}`);
            assert.ok(items.length>=2,`${key}:${level} needs multiple questions`);
        }
    }
    validate(w.BodyPractice.forLevel('muscle','high'),'muscle:high');
});
test('available map topics never have an empty school pool and keep objective source visuals',async()=>{
    const {WORLD_LESSONS,WORLD_QUESTIONS}=await import('../learning/inquiry/globe/curriculum.mjs');
    for(const [kind,lessons,questions] of [['world',WORLD_LESSONS,WORLD_QUESTIONS],['korea',w.KOREA_GEOGRAPHY.lessons,w.KOREA_GEOGRAPHY.questions]]){
        for(const lesson of lessons){
            const signatures=[];
            for(const level of ['elementary','middle','high']){
                if(!w.SchoolMaps.available(kind,lesson.id,level)||kind==='world'&&level==='middle'&&lesson.level==='high')continue;
                const pool=w.MapPractice.pool(kind,lesson,questions,level);
                validate(pool,`${kind}:${lesson.id}:${level}`);
                signatures.push([level,pool.map(q=>q.id).join(',')]);
                if(kind==='korea'&&level==='middle')assert.ok(pool.every(q=>q.difficulty==='basic'));
                for(const q of pool){
                    const old=questions.find(item=>item.id===q.id);
                    if(old){for(const field of ['diagram','table','graph','marks','visual','stimulus'])assert.deepEqual(q[field],old[field]);}
                }
            }
            if(signatures.some(([l])=>l==='elementary'))assert.notEqual(signatures[0][1],signatures[1][1],`${kind}:${lesson.id} primary pool must differ`);
        }
    }
});
test('pages load objective banks before their consumers; free-response renderer is retired',()=>{
    for(const topic of ['digestion','circulation','respiration','excretion','nervous','homeostasis','immune','skeleton']){
        const html=fs.readFileSync(path.join(root,`human-body/${topic}/index.html`),'utf8');
        assert.ok(html.indexOf('body-practice.js')<html.indexOf('body-level.js'));
        assert.ok(html.includes('body-practice.js'));
    }
    for(const app of ['globe','korea-map','periodic-table']){
        const html=fs.readFileSync(path.join(root,app,'index.html'),'utf8');
        assert.ok(html.includes(app==='periodic-table'?'matter-practice.js':'map-practice.js'));
    }
    for(const file of ['curriculum/school-level.js','curriculum/body-level.js','curriculum/matter-level.js','globe/atlas-study.mjs','korea-map/study.js']){
        const js=fs.readFileSync(path.join(root,file),'utf8');
        assert.doesNotMatch(js,/(?:S|school)\.question\(|생각해 보기|풀이 확인/,file);
    }
});
