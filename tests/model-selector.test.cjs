const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('unsupported school choices cannot change the URL or notify model renderers',()=>{
    const buttons=['elementary','middle','high'].map(school=>({dataset:{school},setAttribute(){}}));
    const visits=[],changes=[];
    const context={window:{dispatchEvent(){}},URL,URLSearchParams,Event,
        location:new URL('https://example.test/learning/inquiry/space/constellations/?topic=celestial-sphere&school=high'),
        history:{replaceState(a,b,url){visits.push(url.href);}},
        document:{documentElement:{dataset:{}},addEventListener(){},querySelectorAll(){return buttons;}}};
    vm.runInNewContext(fs.readFileSync('learning/inquiry/curriculum/school-level.js','utf8'),context);
    const S=context.window.SchoolLevel;
    S.subscribe(level=>changes.push(level));
    S.setAllowed(['high']);
    assert.equal(buttons[0].hidden,true);assert.equal(buttons[0].disabled,true);
    assert.equal(buttons[1].hidden,true);assert.equal(buttons[2].hidden,false);
    S.set('elementary');S.set('middle');
    assert.equal(S.value,'high');assert.deepEqual(visits,[]);assert.deepEqual(changes,[]);
    S.setAllowed(['middle','high']);S.set('middle');
    assert.equal(S.value,'middle');assert.equal(buttons[1].disabled,false);
    assert.equal(visits.length,1);assert.match(visits[0],/topic=celestial-sphere&school=middle/);
    assert.deepEqual(changes,['middle']);
});

test('constellation scenes hide an empty control strip and restore populated controls',()=>{
    const panel={style:{}};
    const modes=['3ddepth','compare','zodiac','diurnal'].map(id=>({id:'mode-'+id,style:{}}));
    const subpanels=['zodiac','diurnal'].map(id=>({id:'controls-'+id,style:{}}));
    const context={window:{},document:{
        querySelectorAll(selector){return selector.includes('subpanel')?subpanels:selector==='.sim-mode-container'?modes:[];},
        querySelector(selector){return selector==='.sim-controls-panel'?panel:null;},
        getElementById(id){return subpanels.find(p=>p.id===id)||null;}
    }};
    vm.runInNewContext(fs.readFileSync('learning/inquiry/space/constellations/navigation.js','utf8'),context);
    for(const mode of ['3ddepth','zodiac','compare','diurnal']){
        context.window.switchSimMode(mode);
        const expected=mode==='zodiac'||mode==='diurnal';
        assert.equal(panel.hidden,!expected,mode);
        assert.equal(panel.style.display,expected?'flex':'none',mode);
        assert.equal(modes.find(m=>m.id==='mode-'+mode).style.display,'flex',mode);
    }
});
