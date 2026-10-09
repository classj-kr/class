(() => {
    'use strict';
    const el = (tag, text, cls) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (cls) node.className = cls;
        return node;
    };
    const button = (label, action, name) => {
        const node = el('button', label);
        node.type = 'button';
        if (name) node.dataset.studyAction = name;
        node.addEventListener('click', action);
        return node;
    };
    function hardware(mount) {
        let mode = 'draw', audible = true, audio, sequence = 0;
        const events = [];
        const root = el('section', undefined, 'study-workbench');
        root.setAttribute('aria-label', '같은 입력과 다른 프로그램 비교');
        const controls = el('div', undefined, 'study-controls');
        const status = el('p', '프로그램을 선택한 뒤 아래 화면의 한 칸을 누르세요.', 'study-status');
        status.setAttribute('role', 'status');
        const grid = el('div', undefined, 'study-touch-grid');
        grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', '두 프로그램이 함께 쓰는 입력 화면');
        const trace = el('ol', undefined, 'study-trace');
        const modes = ['draw', 'piano'];
        const modeButtons = modes.map((value, i) => button(i ? '피아노 프로그램' : '그림 프로그램', () => {
            mode = value; renderControls();
            status.textContent = (i ? '피아노' : '그림') + ' 프로그램으로 바꾸었습니다. 앞에서 누른 칸을 다시 눌러 비교하세요.';
        }, value));
        const sound = button('소리 출력 켜짐', () => { audible = !audible; renderControls(); }, 'sound');
        controls.append(...modeButtons, sound);
        function renderControls() {
            modeButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(mode === modes[i])));
            sound.textContent = audible ? '소리 출력 켜짐' : '소리 출력 꺼짐';
            sound.setAttribute('aria-pressed', String(audible));
            grid.dataset.program = mode;
        }
        const notes = ['도', '레', '미', '파', '솔', '라', '시', '높은 도', '높은 레'];
        const frequencies = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33];
        async function play(index) {
            try {
                const Audio = window.AudioContext || window.webkitAudioContext;
                if (!Audio) return '이 브라우저에서 소리 재생을 지원하지 않음';
                audio ||= new Audio(); await audio.resume();
                const oscillator = audio.createOscillator(), gain = audio.createGain();
                oscillator.frequency.value = frequencies[index];
                gain.gain.setValueAtTime(0.08, audio.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.22);
                oscillator.connect(gain); gain.connect(audio.destination);
                oscillator.start(); oscillator.stop(audio.currentTime + 0.24);
                return '음 신호 재생 요청';
            } catch (_) { return '브라우저에서 음 재생이 차단됨'; }
        }
        for (let index = 0; index < 9; index++) {
            const cell = button(String(index + 1), async () => {
                const program = mode, enabled = audible, run = ++sequence;
                let result;
                if (program === 'draw') { cell.classList.add('has-dot'); result = `${index + 1}번 칸에 파란 점을 그림`; }
                else result = `${notes[index]} 선택 · ${enabled ? await play(index) : '출력 꺼짐: 소리 신호를 보내지 않음'}`;
                const record = { program, cell: index + 1, audible: enabled, result };
                events.push(record);
                if (events.length > 60) events.shift();
                trace.prepend(el('li', `입력 ${index + 1}번 → ${program === 'draw' ? '그림' : '피아노'} 명령 → ${result}`));
                while (trace.children.length > 6) trace.lastChild.remove();
                if (run === sequence) status.textContent = result;
            }, 'cell-' + (index + 1));
            cell.setAttribute('aria-label', (index + 1) + '번 칸 누르기');
            grid.append(cell);
        }
        root.append(el('h3', '입력 화면은 그대로, 실행 규칙은 바꾸기'), el('p', '두 프로그램은 아래의 같은 9개 칸을 사용합니다. 그림 프로그램은 점을 남기고, 피아노 프로그램은 칸에 해당하는 음을 고릅니다. 소리 출력 스위치는 이 모형의 음소거이며 실제 스피커 연결을 바꾸지는 않습니다.'), controls, grid, status, el('h4', '실제로 실행한 기록'), trace);
        mount.replaceChildren(root); renderControls();
        return {
            snapshot: () => events.length ? `같은 입력 화면 · ${trace.firstChild.textContent}` : '',
            complete: () => events.some(a => a.program === 'draw' && events.some(b => b.program === 'piano' && b.cell === a.cell)) && events.some(a => a.program === 'piano' && !a.audible),
            hint: '두 프로그램에서 같은 칸을 누르고, 소리 출력을 끈 피아노에서도 입력을 시험하세요.'
        };
    }
    function files(mount) {
        let items, selected, buffer, nextId, actions = 0;
        const root = el('section', undefined, 'study-workbench');
        const folders = el('div', undefined, 'study-folders');
        const editorLabel = el('label', '선택한 파일의 작업 내용');
        const editor = el('textarea'); editor.rows = 3; editor.id = 'studyFileEditor'; editor.maxLength = 500;
        editorLabel.htmlFor = editor.id;
        const nameLabel = el('label', '새 파일 이름');
        const name = el('input'); name.id = 'studyFileName'; name.value = '보고서_수정본.txt'; name.maxLength = 60; nameLabel.htmlFor = name.id;
        const destinationLabel = el('label', '복사·이동할 위치');
        const destination = el('select'); destination.id = 'studyFileDestination'; destinationLabel.htmlFor = destination.id;
        for (const [value, label] of [['documents','문서'],['homework','과제']]) { const option = el('option', label); option.value = value; destination.append(option); }
        const status = el('p', '', 'study-status'); status.setAttribute('role', 'status');
        const controls = el('div', undefined, 'study-controls');
        const trace = el('ol', undefined, 'study-trace');
        const active = () => items.find(f => f.id === selected);
        const describe = f => `${f.name} [${({documents:'문서',homework:'과제',trash:'휴지통'})[f.folder]}] 내용: ${f.content}`;
        function log(message) { actions++; status.textContent = message; trace.prepend(el('li', message)); while (trace.children.length > 6) trace.lastChild.remove(); }
        function render() {
            folders.replaceChildren();
            for (const [key, title] of [['documents','문서'],['homework','과제'],['trash','휴지통']]) {
                const section = el('section'); section.dataset.studyFolder = key;
                section.append(el('h4', title));
                const list = el('ul');
                for (const file of items.filter(f => f.folder === key)) {
                    const li = el('li');
                    const open = button(file.name, () => {
                        if (buffer !== active()?.content && !window.confirm('저장하지 않은 작업 내용을 버리고 다른 파일을 열까요?')) return;
                        selected = file.id; buffer = file.content; editor.value = buffer;
                        status.textContent = '연 파일: ' + describe(file); render();
                    });
                    open.dataset.studyFile = file.id; open.setAttribute('aria-pressed', String(file.id === selected));
                    li.append(open, el('small', '저장된 내용: ' + file.content)); list.append(li);
                }
                section.append(list); if (!list.children.length) section.append(el('p', '파일 없음'));
                folders.append(section);
            }
            editor.disabled = active()?.folder === 'trash';
        }
        function fresh() { items = [{id:1,name:'보고서_원본.txt',content:'봄 관찰 기록',folder:'documents'}]; selected = 1; buffer = items[0].content; nextId = 2; actions = 0; editor.value = buffer; trace.replaceChildren(); status.textContent = '원본은 문서 폴더에 있습니다. 원본을 남기고 내용을 고친 별도 파일을 과제 폴더에 준비하세요.'; render(); }
        function newFile(content, folder) {
            const title = name.value.trim();
            if (!title) { status.textContent = '새 파일 이름을 입력하세요.'; return null; }
            if (items.some(f => f.name === title && f.folder === folder)) { status.textContent = '그 위치에 같은 이름이 있습니다. 다른 이름을 사용하세요.'; return null; }
            const file = {id:nextId++,name:title,content,folder}; items.push(file); return file;
        }
        editor.addEventListener('input', () => { buffer = editor.value; status.textContent = '작업 내용이 바뀌었습니다. 저장된 파일 내용과 비교하세요.'; });
        controls.append(
            button('저장', () => { const file = active(); if (!file || file.folder === 'trash') return; file.content = buffer; log('저장: ' + describe(file)); render(); }, 'save'),
            button('다른 이름으로 저장', () => { if (active()?.folder === 'trash') return; const file = newFile(buffer, active().folder); if (!file) return; selected = file.id; log('새 파일 저장: ' + describe(file)); render(); }, 'save-as'),
            button('선택한 파일 복사', () => { const file = active(); if (!file || file.folder === 'trash') return; const copy = newFile(file.content, destination.value); if (!copy) return; log('저장된 내용 복사: ' + describe(copy)); render(); }, 'copy'),
            button('선택한 파일 이동', () => { const file = active(); if (!file) return; if (items.some(f => f.id !== file.id && f.folder === destination.value && f.name === file.name)) { status.textContent = '목적지에 같은 이름의 파일이 있습니다.'; return; } file.folder = destination.value; log('이동: ' + describe(file)); render(); }, 'move'),
            button('휴지통으로', () => { const file = active(); if (!file) return; file.folder = 'trash'; log('휴지통으로 이동: ' + file.name); render(); }, 'delete'),
            button('모형 처음부터', fresh, 'reset')
        );
        root.append(el('h3', '원본을 지키며 수정본 준비하기'), el('p', '이 모형의 파일만 바뀝니다. 실제 기기의 파일은 다루지 않습니다. 편집한 내용은 저장할 때 파일에 기록되며 복사는 현재 저장된 내용을 사용합니다.'), folders, editorLabel, editor, nameLabel, name, destinationLabel, destination, controls, status, el('h4', '작업 기록'), trace);
        mount.replaceChildren(root); fresh();
        return {
            snapshot: () => actions ? items.map(describe).join('\n') : '',
            complete: () => items.length === 2 && items.some(f => f.id === 1 && f.folder === 'documents' && f.content === '봄 관찰 기록') && items.some(f => f.id !== 1 && f.folder === 'homework' && f.content.trim() && f.content !== '봄 관찰 기록'),
            hint: '원본 내용은 문서 폴더에 그대로 두고, 내용을 바꾼 별도 파일 하나를 과제 폴더에 준비하세요.'
        };
    }
    function algorithm(mount) {
        const root = el('section', undefined, 'study-workbench');
        const settings = el('div', undefined, 'study-algorithm-settings');
        const makeSelect = (title, id, options) => { const label=el('label',title),select=el('select'); select.id=id; label.htmlFor=id; options.forEach(([value,text])=>{const o=el('option',text);o.value=value;select.append(o);});label.append(select);settings.append(label);return select; };
        const initial=makeSelect('처음 현재 값','studyInitial',[['zero','0으로 시작'],['first','첫 수로 시작']]);
        const compare=makeSelect('현재 값을 바꿀 조건','studyCompare',[['greater','다음 수가 현재 값보다 크면'],['less','다음 수가 현재 값보다 작으면']]);
        const empty=makeSelect('입력이 비었을 때','studyEmpty',[['zero','0을 결과로 표시'],['message','입력 없음으로 표시']]);
        const inputLabel=el('label','입력할 수 (쉼표로 구분)');
        const input=el('input');input.id='studyNumbers';inputLabel.htmlFor=input.id;input.value='4, 9, 2';input.maxLength=160;
        const cases=el('div',undefined,'study-controls');
        const samples={positive:['양수','4, 9, 2'],negative:['음수','-8, -3, -5'],equal:['같은 수','7, 7, 3'],single:['한 수','-4'],empty:['빈 입력','']};
        Object.entries(samples).forEach(([key,[label,value]])=>cases.append(button(label,()=>{input.value=value;},'case-'+key)));
        const table=el('table',undefined,'study-table'),caption=el('caption','실제로 실행한 비교 과정');table.append(caption);
        const head=el('thead'),hr=el('tr');['순서','읽은 수','판단과 행동','현재 값'].forEach(t=>{const th=el('th',t);th.scope='col';hr.append(th);});head.append(hr);table.append(head);
        const body=el('tbody');table.append(body);
        const status=el('p','입력과 규칙을 정하고 실행하세요. 결과뿐 아니라 중간 값을 읽어 보세요.','study-status');status.setAttribute('role','status');
        const history=el('ul',undefined,'study-trace');
        let runs=[],last='',signature='';
        const rule=()=>[initial.value,compare.value,empty.value].join('/');
        function run(){
            const raw=input.value.trim(),parts=raw?raw.split(',').map(s=>s.trim()):[];
            if(parts.length>12||parts.some(s=>!s||!Number.isFinite(Number(s))||Math.abs(Number(s))>1000000)){status.textContent='-1000000부터 1000000까지의 수를 쉼표로 구분해 12개 이내로 입력하세요.';return;}
            const values=parts.map(Number);body.replaceChildren();
            const row=(...values)=>{const tr=el('tr');values.forEach(v=>tr.append(el('td',String(v))));body.append(tr);};
            let current;
            if(!values.length){current=empty.value==='message'?'입력 없음':0;row('시작','없음','빈 입력 규칙 적용',current);}
            else{
                current=initial.value==='first'?values[0]:0;row('시작','—',initial.value==='first'?'첫 수로 초기화':'0으로 초기화',current);
                for(let i=initial.value==='first'?1:0;i<values.length;i++){
                    const value=values[i],previous=current,change=compare.value==='greater'?value>current:value<current;
                    if(change)current=value;
                    row(i+1,value,`${value} ${compare.value==='greater'?'>':'<'} ${previous}: ${change?'참 → 갱신':'거짓 → 유지'}`,current);
                }
            }
            const expected=values.length?Math.max(...values):'입력 없음',correct=current===expected;
            const key=rule();if(signature!==key){runs=[];signature=key;history.replaceChildren();}
            const record={input:values.join(','),correct};runs.push(record);
            last=`입력 [${values.join(', ')}] · 초기값 ${initial.selectedOptions[0].textContent} · ${compare.selectedOptions[0].textContent} · 결과 ${current} · 목표 ${expected}`;
            status.textContent=last+(correct?' — 목표와 일치합니다.':' — 목표와 다릅니다. 표에서 처음 관계가 어긋난 곳을 찾으세요.');
            history.prepend(el('li',`[${values.join(', ')||'빈 입력'}] → ${current} (${correct?'일치':'불일치'})`));
            while(history.children.length>10)history.lastChild.remove();
        }
        [initial,compare,empty].forEach(s=>s.addEventListener('change',()=>{last='';runs=[];signature='';body.replaceChildren();history.replaceChildren();status.textContent='규칙을 바꾸었습니다. 같은 입력으로 다시 시험한 뒤 다른 입력도 확인하세요.';}));
        root.append(el('h3','최댓값을 찾는 절차 만들기'),el('p','실행기는 선택한 규칙을 그대로 따릅니다. 잘못된 규칙도 실행됩니다. 빈 목록에는 최댓값이 없으므로 이 과제의 목표는 ‘입력 없음’을 표시하는 것입니다.'),settings,inputLabel,input,cases,button('절차 실행',run,'run'),table,status,el('h4','현재 규칙으로 시험한 입력'),history);
        mount.replaceChildren(root);
        return {snapshot:()=>last,complete:()=>rule()==='first/greater/message'&&Object.values(samples).every(([,s])=>runs.some(r=>r.input===s.replaceAll(' ','')&&r.correct)),hint:'첫 수로 시작하고 더 클 때 갱신하며 빈 입력을 따로 처리하도록 고친 뒤, 양수·음수·같은 수·한 수·빈 입력을 모두 시험하세요.'};
    }
    window.COMPUTER_TEACHING_LABS = {mount(id,mount){return ({a02:hardware,e03:files,j01:algorithm})[id]?.(mount)||null;}};
})();
