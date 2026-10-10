/* Textbook assessment selection, shared pacing dates, and whole-term HWPX export. */
window.createAssessmentPlanningExtras = function (app) {
    'use strict';
    const $ = id => document.getElementById(id);
    const node = (tag, text, className) => { const n = document.createElement(tag); if (text != null) n.textContent = text; if (className) n.className = className; return n; };
    const button = (text, action) => { const n = node('button', text, 'btn btn-outline btn-small'); n.type = 'button'; n.onclick = action; return n; };
    let resources = { edition:null, assessments:[], plans:[], schedule:{entries:[],revision:0} }, generation = 0;
    const same = key => key === app.state().key;
    const dialog = node('dialog'); document.body.append(dialog);
    let dialogKey = null;
    function open(title) { dialog.replaceChildren(node('h2',title)); dialogKey=app.state().key; dialog.showModal(); }
    function actions(...buttons) { const row=node('div',null,'dialog-actions'); row.append(button('닫기',()=>dialog.close()),...buttons); dialog.append(row); }
    function allLessons() { return resources.plans.flatMap(p=>p.lessons); }
    function resolved(item) {
        if (item.timingMode === 'manual') return item.timingText || '';
        if (!item.pacing?.lessonIds?.length || item.pacing.editionId !== resources.edition?.id || resources.schedule.editionId !== resources.edition?.id) return '';
        const map = new Map(resources.schedule.entries.map(e=>[e.lessonId,e.timing]));
        const values=item.pacing.lessonIds.map(id=>map.get(id));
        return values.every(Boolean) ? [...new Set(values)].join(' · ') : '';
    }
    async function load() {
        const turn=++generation, key=app.state().key;
        resources={edition:null,assessments:[],plans:[],schedule:{entries:[],revision:0}};
        if (dialog.open && !same(dialogKey)) dialog.close();
        $('textbook-note').textContent='교과서 목록을 불러오는 중…';
        try {
            const data=await app.api('/api/teacher/assessment-plans/resources?'+new URLSearchParams(key));
            if (turn!==generation || !same(key)) return;
            resources=data;
            $('textbook-note').textContent=data.edition
                ? data.edition.label+' · 선택 가능한 평가 '+data.assessments.length+'개'+(data.assessments.length?'':' · 이 교과서의 목록은 아직 준비 중입니다.')
                : '학교 관리 → 시수 편성에서 이 학년의 교과서를 먼저 선택하세요.';
            app.render();
        } catch(error) { if(turn===generation) $('textbook-note').textContent='교과서 목록을 불러오지 못했습니다: '+error.message; }
    }
    $('publisher-list-btn').onclick=async()=>{
        const key=app.state().key;
        if(app.state().readOnly)return;
        if(!resources.edition){app.notice('학교에서 사용할 교과서를 먼저 선택하세요.');return;}
        const standards=await app.standards(); if(!same(key))return;
        open(resources.edition.label+' 수행평가 목록');
        dialog.append(node('p','사용할 평가를 선택하세요. 연간 자료는 사용할 학기에 선택하고, 성취기준과 평가 요소를 확인해 주세요.','status'));
        const selected=new Set(app.state().items.map(i=>i.assessmentId)), chosen=new Set();
        const search=node('input');search.type='search';search.placeholder='단원·평가명 찾기';search.className='form-control';search.setAttribute('aria-label','평가 목록 검색');dialog.append(search);
        const list=node('div',null,'picker-list');dialog.append(list);
        function draw(){
            list.replaceChildren();
            const matches=resources.assessments.filter(a=>(a.unit+' '+a.title+' '+a.provider).includes(search.value.trim()));
            for(const a of matches){
                const row=node('label'),box=node('input');box.type='checkbox';box.value=a.id;box.disabled=selected.has(a.id);box.checked=selected.has(a.id)||chosen.has(a.id);
                box.onchange=()=>box.checked?chosen.add(a.id):chosen.delete(a.id);
                row.append(box,node('span',a.unit||a.provider),node('span',a.title+(a.semester?'':' · 연간')+(selected.has(a.id)?' · 추가됨':'')));list.append(row);
            }
            if(!matches.length)list.append(node('p','표시할 평가 목록이 없습니다. 항목을 직접 추가할 수 있습니다.','status'));
        }
        search.oninput=draw;draw();
        actions(button('선택한 평가 추가',()=>{
            if(!same(key)||app.state().readOnly)return;
            const available=resources.assessments.filter(a=>chosen.has(a.id)&&!app.state().items.some(i=>i.assessmentId===a.id));
            if(app.state().items.length+available.length>60){app.notice('한 과목에는 평가를 60개까지 넣을 수 있습니다.');return;}
            for(const a of available){
                const item=app.newItem();item.assessmentId=a.id;item.assessmentTitle=[a.unit,a.title].filter(Boolean).join(' · ');
                item.standards=standards.filter(s=>a.standardCodes.includes(s.code)).map(s=>({code:s.code,text:s.text}));
                item.domain=standards.find(s=>a.standardCodes.includes(s.code))?.domain||'';
                // Generic file titles do not identify an observable assessment element.
                item.element=/수행\s*평가|평가\s*기준|평가지|활동지/.test(a.title)?'':a.title;
                item.pacing={editionId:resources.edition.id,lessonIds:a.lessonIds.filter(id=>allLessons().some(l=>l.id===id))};
                app.state().items.push(item);
            }
            dialog.close();app.markDirty();app.render();app.notice(available.length+'개 평가를 추가했습니다. 평가 요소와 기준을 확인해 주세요.');
        }));
    };
    function linkPacing(item){
        if(app.state().readOnly)return;
        if(!resources.edition){app.notice('교과서 선택을 먼저 확인해 주세요.');return;}
        const key=app.state().key;open('평가할 진도표 차시 연결');
        dialog.append(node('p','실제로 평가할 차시를 선택하세요. 연결한 차시의 날짜·주차가 평가 시기로 표시됩니다.','status'));
        const chosen=new Set(item.pacing?.editionId===resources.edition.id?item.pacing.lessonIds:[]);
        const list=node('div',null,'picker-list');dialog.append(list);
        for(const plan of resources.plans){
            list.append(node('h3',plan.semester?plan.semester+'학기 진도표':'연간 진도표'));
            for(const l of plan.lessons){
                const row=node('label'),box=node('input');box.type='checkbox';box.value=l.id;box.checked=chosen.has(l.id);
                box.onchange=()=>box.checked?chosen.add(l.id):chosen.delete(l.id);
                row.append(box,node('span',l.unit),node('span',[l.periodText?l.periodText+'차시':'',l.topic].filter(Boolean).join(' · ')));list.append(row);
            }
        }
        if(!allLessons().length)list.append(node('p','연결할 진도표가 없습니다. 평가 시기를 직접 입력할 수 있습니다.','status'));
        actions(button('연결',()=>{
            if(!same(key)||app.state().readOnly||!app.state().items.includes(item))return;
            if(chosen.size>40){app.notice('평가 한 건에 차시 40개까지 연결할 수 있습니다.');return;}
            item.pacing={editionId:resources.edition.id,lessonIds:[...chosen]};delete item.timingMode;delete item.timingText;
            dialog.close();app.markDirty();app.render();
        }));
    }
    function itemFields(item){
        const wrap=node('div');
        if(item.assessmentTitle)wrap.append(node('p',item.assessmentTitle,'status'));
        const grid=node('div',null,'grid');
        const method=node('input');method.className='form-control';method.value=item.method||'';method.placeholder='예: 관찰, 실험·실습, 서술';method.maxLength=200;
        method.oninput=()=>{item.method=method.value;app.markDirty();};grid.append(app.field('평가 방법',method));
        const timing=node('div'),value=node('input');value.className='form-control';value.value=resolved(item);value.maxLength=100;
        value.placeholder=item.timingMode==='manual'?'예: 4월 2주':'진도표 차시와 날짜·주차를 연결하세요';value.readOnly=item.timingMode!=='manual';
        value.oninput=()=>{item.timingText=value.value;app.markDirty();};timing.append(value);
        const toggle=button(item.timingMode==='manual'?'진도표와 연동':'시기 직접 입력',()=>{if(item.timingMode==='manual'){delete item.timingMode;delete item.timingText;}else{item.timingText=resolved(item);item.timingMode='manual';}app.markDirty();app.render();});
        timing.append(toggle,button('진도표 차시 연결',()=>linkPacing(item)));
        if(item.pacing?.lessonIds?.length)timing.append(node('small',item.pacing.editionId===resources.edition?.id?item.pacing.lessonIds.length+'개 차시 연결':'교과서가 바뀌었습니다. 차시를 다시 연결하세요.','status'));
        grid.append(app.field('평가 시기',timing));wrap.append(grid);return wrap;
    }
    $('pacing-dates-btn').onclick=()=>{
        if(app.state().readOnly)return;
        if(!resources.edition){app.notice('교과서 선택을 먼저 확인해 주세요.');return;}
        const key=app.state().key;open(key.grade+'학년 '+key.semester+'학기 진도표 날짜·주차');
        dialog.append(node('p','학교에서 실제로 수업할 날짜 또는 주차를 적으세요. 이 학년·학기·과목의 수행평가 시기에 함께 반영됩니다.','status'));
        const entries=new Map(resources.schedule.editionId===resources.edition.id?resources.schedule.entries.map(e=>[e.lessonId,e.timing]):[]);
        const list=node('div',null,'picker-list');dialog.append(list);
        for(const plan of resources.plans){
            list.append(node('h3',plan.semester?plan.semester+'학기 진도표':'연간 진도표 · 이번 학기에 사용할 차시만 입력'));
            for(const l of plan.lessons){
                const input=node('input');input.className='form-control';input.maxLength=100;input.value=entries.get(l.id)||'';input.placeholder='예: 4월 2주 / 2026-04-09';
                input.setAttribute('aria-label',l.unit+' '+l.periodText+'차시 시기');input.oninput=()=>entries.set(l.id,input.value.trim());
                const row=node('label');row.style.gridTemplateColumns='1fr 180px';row.append(node('span',[l.unit,l.periodText+'차시',l.topic].filter(Boolean).join(' · ')),input);list.append(row);
            }
        }
        const save=button('날짜·주차 저장',async()=>{
            if(!same(key)||app.state().readOnly)return;save.disabled=true;
            try{
                const data=await app.api('/api/teacher/assessment-plans/pacing',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...key,editionId:resources.edition.id,revision:resources.schedule.revision,entries:[...entries].filter(([,timing])=>timing).map(([lessonId,timing])=>({lessonId,timing}))})});
                if(!same(key))return;resources.schedule=data;dialog.close();app.render();app.notice('진도표 시기를 저장했습니다. 연결된 평가에 반영됩니다.');
            }catch(error){app.notice(error.message);}finally{save.disabled=false;}
        });actions(save);
    };
    $('draft-all-btn').onclick=async()=>{
        if(app.state().readOnly)return;
        const key=app.state().key,button=$('draft-all-btn');button.disabled=true;
        try{
            const targets=app.state().items.filter(i=>i.element?.trim()&&i.standards.length&&i.criteria.every(c=>!c.text?.trim()));
            if(!targets.length){app.notice('성취기준·평가 요소를 입력한 뒤 빈 평가기준 초안을 작성하세요.');return;}
            for(const item of targets){if(!same(key)||app.state().readOnly)break;await app.draftCriteria(item);}
        }finally{button.disabled=app.state().readOnly;}
    };
    $('export-term-btn').onclick=async()=>{
        const key=app.state().key;if(!key)return;
        const trigger=$('export-term-btn');trigger.disabled=true;
        try{
            await app.savePlan();if(!same(key))return;
            if(app.state().dirty){app.notice('현재 계획을 저장한 뒤 다시 다운로드해 주세요.');return;}
            const query=new URLSearchParams({year:key.year,grade:key.grade,semester:key.semester});
            const term=await app.api('/api/teacher/assessment-plans/term?'+query);if(!same(key))return;
            open(`${key.grade}학년 ${key.semester}학기 전 과목 계획표`);
            dialog.append(node('p','과목별로 새 페이지에서 시작하는 HWPX 한 파일로 내려받습니다. 미작성 항목은 빈칸으로 출력됩니다.','status'));
            const list=node('div',null,'picker-list');dialog.append(list);
            for(const s of term.subjects)list.append(node('p',s.subject+' · '+(s.missing?'미작성':s.items.length+'개 평가')+(s.incomplete?' · 내용 미완성 '+s.incomplete+'개':'')+(s.missingTiming?' · 시기 미입력 '+s.missingTiming+'개':'')));
            const download=button('HWPX 한 파일로 다운로드',async()=>{
                if(!same(key))return;download.disabled=true;
                try{
                    if(app.state().dirty){app.notice('계획 내용이 바뀌었습니다. 저장 후 출력 목록을 다시 열어 주세요.');return;}
                    const response=await fetch('/api/teacher/assessment-plans/export.hwpx?'+query,{credentials:'same-origin',cache:'no-store'});
                    if(!response.ok)throw new Error((await response.json()).message||'파일을 만들지 못했습니다.');
                    const blob=await response.blob(),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=`${key.year}학년도 ${key.grade}학년 ${key.semester}학기 수행평가 계획.hwpx`;
                    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);dialog.close();
                }catch(error){app.notice(error.message);}finally{download.disabled=false;}
            });actions(download);
        }catch(error){app.notice(error.message);}finally{trigger.disabled=false;}
    };
    return {load,itemFields};
};
