const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={window:{}};
for(const file of ['lesson-visuals','space-visuals','body-visuals','matter-visuals','space-content','space-lessons','body-content','body-lessons','matter-content','matter-lessons'])
    vm.runInNewContext(fs.readFileSync(`learning/inquiry/curriculum/${file}.js`,'utf8'),ctx);
const V=ctx.window.LessonVisuals;
const restricted={
    'space-celestial-sphere':['high'],'space-stellar-life':['high'],'space-star-properties':['middle','high'],'space-eclipses':['middle','high'],
    'body-nervous':['middle','high'],'body-homeostasis':['middle','high'],'body-immune':['high'],'body-skeleton':['elementary']
};
const levels=['elementary','middle','high'];

test('every available science lesson outside the separately illustrated solar system has authored visuals',()=>{
    const profiles=ctx.window.SchoolContent;
    const keys=Object.keys(profiles).filter(key=>key!=='space-solar-system');
    assert.equal(V.keys().length,keys.length);
    for(const key of keys)for(const level of levels){
        if(!profiles[key][level]||restricted[key]&&!restricted[key].includes(level))continue;
        const figures=V.markup(key,level);
        assert.ok(figures.length,`${key}/${level}`);
        assert.match(figures.map(f=>f.html).join(''),/role="img"|class="lv-flow"/);
        for(const fig of figures){
            assert.ok(fig.caption&&fig.title,`${key}/${level} must explain how to read the figure`);
            assert.doesNotMatch(fig.html,/undefined|NaN|Infinity/);
        }
    }
});
test('restricted levels do not receive advanced diagrams',()=>{
    for(const [key,supported]of Object.entries(restricted))for(const level of levels){
        if(!supported.includes(level))assert.equal(V.markup(key,level).length,0,`${key}/${level}`);
    }
    for(const key of V.keys().filter(k=>k.startsWith('matter-')&&!['matter-states','matter-phase'].includes(k)))assert.equal(V.markup(key,'elementary').length,0);
    const primary=['space-earth-motion','body-digestion','body-excretion','matter-states','matter-phase'].map(k=>V.markup(k,'elementary').map(f=>f.html).join('')).join('');
    assert.doesNotMatch(primary,/간문맥|림프관|네프론|보먼|분압|PV=|P²|오비탈|삭망월/);
});
test('state and dilution illustrations conserve represented particles',()=>{
    const states=V.markup('matter-states','middle')[0].graphic.match(/<svg[\s\S]*?<\/svg>/g);
    assert.deepEqual(states.map(s=>(s.match(/<circle/g)||[]).length),[12,12,12]);
    const solutions=V.markup('matter-solution','high')[0].graphic.match(/<svg[\s\S]*?<\/svg>/g);
    assert.deepEqual(solutions.map(s=>(s.match(/<circle/g)||[]).length),[6,6]);
});
test('reaction diagrams conserve both H and O atoms and distinguish spectator ions',()=>{
    const reaction=V.markup('matter-reaction','middle')[0].graphic;
    assert.equal((reaction.match(/>H<\/text>/g)||[]).length,8);
    assert.equal((reaction.match(/>O<\/text>/g)||[]).length,4);
    const ions=V.markup('matter-acid','high')[0].html;
    for(const ion of ['H⁺','OH⁻','Na⁺','Cl⁻','H₂O'])assert.ok(ions.includes(ion));
    assert.ok(ions.includes('남아 있는 이온'));
});
test('meridian example puts a lower-declination star south of the zenith; orbital node has zero density',()=>{
    const sphere=V.markup('space-celestial-sphere','high')[0].graphic;
    assert.match(sphere,/M240 238L189 71/);
    assert.ok(Math.abs(Math.atan2(167,51)*180/Math.PI-73)<.1);
    const orbital=V.markup('matter-orbital','high')[0].html;
    assert.match(orbital,/마디면의 단면/);
    assert.match(orbital,/전하를 뜻하지 않습니다/);
    const density=(x,y)=>x*x*Math.exp(-Math.hypot(x,y));
    assert.equal(density(0,2),0);
    assert.equal(density(-1,2),density(1,2));
});
