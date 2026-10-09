(() => {
    'use strict';
    // Capture the model's result, never a click count, focus, or tab visit.
    // These are observation records; the follow-up questions assess interpretation.
    const sources = {
        a03:['[data-a03-preview-title]','[data-a03-preview-copy]'],
        a04:['[data-a04-status]','[data-a04-recorded]'],
        a05:['[data-a05-status]','[data-a05-comparison]'],
        b01:['#componentPartPanel'], b02:['[data-mobile-status]'], b03:['[data-port-status]'],
        c01:['[data-relay-status]'], c02:['[data-os-status]'], c03:['[data-program-status]'],
        c04:['[data-permission-result]','[data-update-result]'],
        d01:['[data-demo-text]','[data-pointer-status]'], d02:['[data-gesture-status]','[data-gesture-action-result]'],
        d03:['[data-clipboard-value]','[data-clipboard-target]'],
        e01:['[data-path-output]'],e02:['[data-app-result]','[data-format-status]'],
        e04:['[data-reference-status]'],e05:['[data-storage-status]','[data-storage-result]'],
        f01:['[data-display-status]','[data-scale-output]'],f02:['[data-rgb-output]','[data-image-zoom-output]'],f03:['[data-video-status]'],
        g01:['#binaryLength','#binaryRecords'],g02:['[data-byte-value]','[data-unit-amount-output]'],
        g03:['[data-utf8-status]','[data-encoded-quality]','[data-file-bytes]'],
        h01:['[data-network-status]'],h02:['[data-request-status]'],h03:['[data-browser-status]'],
        h04:['[data-stack-status]','[data-stack-result]'],h05:['[data-transfer-panel="deploy"] [data-transfer-status]'],
        i01:['[data-account-status]','[data-permission-result]'],i02:['[data-evidence-status]','[data-citizenship-status]'],
        j02:['[data-loop-trace]'],j03:['[data-debug-output]','[data-debug-case-result]']
    };
    const recordable = (id,lab) => {
        const value=(selector,key)=>lab.querySelector(selector)?.dataset[key];
        const rules={
            a03:()=>['os-fail','app-fail','success'].includes(value('[data-a03-lab]','outcome')),
            a04:()=>value('[data-a04-lab]','a04Recorded')==='true',
            a05:()=>value('[data-a05-lab]','a05Recorded')==='true',
            b03:()=>['signal-blocked','unknown','recognized'].includes(value('[data-port-lab]','portState')),
            c01:()=>['blocked','hardware-off','complete'].includes(value('[data-request-relay]','relayState')),
            c02:()=>Number(value('[data-os-lab]','osTaskStage'))>0,
            e05:()=>Number(value('[data-storage-lab]','storageStep'))>0,
            g01:()=>lab.querySelectorAll('#binaryRecords li').length>0,
            g03:()=>value('[data-compression-lab]','encodingState')==='ready',
            h01:()=>Number(value('[data-network-journey]','networkStep'))>0||!!value('[data-network-journey]','networkStopped'),
            h02:()=>Number(value('[data-request-lab]','requestStage'))>0,
            h04:()=>Number(value('[data-stack-lab]','stage'))>0,
            h05:()=>['public','student'].includes(value('[data-transfer-panel="deploy"]','transferStage')),
            j02:()=>!!lab.querySelector('[data-loop-trace] [data-trace-state]')&&(!lab.querySelector('[data-control-robot]')?.disabled||lab.querySelector('[data-control-score]')?.textContent==='3'),
            j03:()=>['error','retested','success'].includes(value('[data-debug-lab]','debugStage'))
        };
        return !rules[id]||rules[id]();
    };
    const el = (tag, text, cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
    function mount({id,data,lab,before,after,saved,onChange,custom}) {
        const revision=custom?.revision||2;
        const state = {
            revision,
            prediction: typeof saved?.prediction === 'string' ? saved.prediction.slice(0,600) : '',
            explanation: typeof saved?.explanation === 'string' ? saved.explanation.slice(0,1200) : '',
            records: saved?.revision === revision && Array.isArray(saved.records) ? [...new Set(saved.records.filter(r=>typeof r==='string'&&r.trim()).map(r=>r.slice(0,2000)))].slice(0,8) : [],
            passed: saved?.revision === revision && saved.passed === true
        };
        function snapshot() {
            if(custom)return custom.snapshot();
            if(!recordable(id,lab))return '';
            if(id==='g01')return `${lab.querySelector('#binaryLength').value}자리: ${[...lab.querySelectorAll('#binaryRecords li')].map(n=>n.textContent).join(', ')}`;
            return (sources[id]||[]).map(selector=>{
                const nodes=[...lab.querySelectorAll(selector)];
                return nodes.filter(n=>n.getClientRects().length).map(n=>(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement)?n.value:n.innerText).join(' · ');
            }).filter(Boolean).join('\n').replace(/[ \t]+/g,' ').trim().slice(0,2000);
        }
        const assignment=el('section',undefined,'study-assignment');
        assignment.setAttribute('aria-labelledby','studyQuestion');
        const heading=el('h3',data.question);heading.id='studyQuestion';assignment.append(heading);
        const tasks=el('ol');
        data.tasks.forEach(task=>{const li=el('li');li.append(el('strong',task.title),el('p',task.instruction),el('small',task.lookFor));tasks.append(li);});
        assignment.append(tasks);
        const predictionLabel=el('label','관찰 전 예상 (선택)');predictionLabel.htmlFor='studyPrediction';
        const prediction=el('textarea');prediction.id='studyPrediction';prediction.rows=2;prediction.maxLength=600;prediction.value=state.prediction;
        prediction.placeholder='무엇이 달라지고 무엇은 그대로일지 적어 보세요.';
        assignment.append(predictionLabel,prediction);before.append(assignment);
        const notebook=el('section',undefined,'study-notebook');notebook.setAttribute('aria-labelledby','studyRecordTitle');
        const title=el('h3','관찰 기록');title.id='studyRecordTitle';notebook.append(title,el('p','비교할 결과가 나왔을 때 기록하세요. 조건을 바꾼 뒤 다른 결과도 기록하고 두 관찰을 비교하세요.'));
        const controls=el('div',undefined,'study-controls');
        const capture=el('button','현재 결과 기록');capture.type='button';capture.id='studyCapture';
        const clear=el('button','관찰 기록 비우기');clear.type='button';clear.id='studyClear';
        const count=el('span');count.id='studyRecordCount';
        controls.append(capture,clear,count);
        const records=el('ol',undefined,'study-records');records.id='studyRecords';
        const status=el('p','', 'study-status');status.id='studyStatus';status.setAttribute('role','status');
        const conclusion=el('label',data.conclusion);conclusion.htmlFor='studyExplanation';
        const explanation=el('textarea');explanation.id='studyExplanation';explanation.rows=3;explanation.maxLength=1200;explanation.value=state.explanation;
        explanation.placeholder='두 기록에서 확인한 차이를 근거로 설명해 보세요. (선택)';
        notebook.append(controls,records,status,conclusion,explanation);after.append(notebook);
        function render(){
            records.replaceChildren();state.records.forEach((record,i)=>{const li=el('li');li.append(el('strong','관찰 '+(i+1)),el('p',record));records.append(li);});
            count.textContent=state.records.length+'개 기록';clear.disabled=!state.records.length;
        }
        capture.addEventListener('click',()=>{
            const result=snapshot();
            if(!result){status.textContent='아직 기록할 실행 결과가 없습니다. 과제의 조작을 먼저 수행하세요.';return;}
            if(state.records.includes(result)){status.textContent='같은 결과가 이미 기록되어 있습니다. 비교할 조건을 바꾸고 결과를 확인하세요.';return;}
            if(state.records.length>=8){status.textContent='관찰을 8개 기록했습니다. 다시 실험하려면 기록을 비운 뒤 시작하세요.';return;}
            state.records.push(result);
            if(custom?.complete())state.passed=true;
            render();onChange(state);
            status.textContent=state.records.length<2?'첫 결과를 기록했습니다. 조건을 바꿔 비교할 결과를 하나 더 기록하세요.':custom&&!state.passed?custom.hint:'다른 결과를 기록했습니다. 두 관찰을 비교하고 실습 확인 문제에 답하세요.';
        });
        clear.addEventListener('click',()=>{state.records=[];state.passed=false;render();status.textContent='관찰 기록을 비웠습니다. 모형의 현재 상태에서 다시 관찰할 수 있습니다.';onChange(state);});
        prediction.addEventListener('input',()=>{state.prediction=prediction.value;onChange(state);});
        explanation.addEventListener('input',()=>{state.explanation=explanation.value;onChange(state);});
        render();
        const binaryReady=()=>id!=='g01'||(state.records.includes('1자리: 0, 1')&&state.records.includes('2자리: 00, 01, 10, 11'));
        return {state,ready:()=>state.records.length>=2&&(!custom||state.passed)&&binaryReady(),hint:()=>state.records.length<2?'실습 결과를 두 가지 이상 기록하고 비교한 뒤 답을 확인하세요.':!binaryReady()?'한 자리의 두 조합과 두 자리의 네 조합을 모두 만든 결과를 각각 기록하세요.':custom?.hint||'',snapshot};
    }
    window.COMPUTER_INVESTIGATION={mount};
})();
