const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
edit(lab+'star-elements/index.html',s=>{
 const paragraphs={
 '핵융합과 질량':'태양에서는 수소 원자핵이 융합하여 헬륨 원자핵이 만들어지는 과정에서 에너지가 방출됩니다. 이 에너지는 지구에서 일어나는 여러 현상의 에너지원이 됩니다.',
 '철에서 멈추는 까닭':'별 내부의 핵융합으로 여러 원소가 생성되며, 질량이 큰 별에서는 철까지 생성되는 과정을 설명할 수 있습니다. 무거운 원소의 생성에는 별의 진화·폭발·중성자별 충돌 등 여러 과정이 관련됩니다.',
 '별의 질량이 운명을 정한다':'별에서 생성되는 원소와 마지막 모습은 질량에 따라 다릅니다. 이 화면의 단계별 진행 시간은 관찰을 위한 모형이며 실제 별의 수명이나 각 단계의 지속 시간을 뜻하지 않습니다.',
 '우리 몸의 원소는 별에서 왔다':'초기 우주에서는 주로 수소와 헬륨이 만들어졌습니다. 탄소·산소 등은 별 내부 등에서 만들어져 우주 공간으로 퍼졌고, 이후 태양계와 우리 몸을 이루는 재료가 되었습니다.'};
 for(const [name,text] of Object.entries(paragraphs))s=cut(s,new RegExp('<p><strong>'+name+'</strong>.*?</p>'),'<p><strong>'+name+'</strong> '+text+'</p>');
 s=s.replaceAll('원자핵이 더 단단히 묶일수록 남는 질량이 에너지로 나옵니다','태양은 수소 핵융합으로 에너지를 방출합니다').replaceAll('에너지가 얼마나','에너지가 나올까').replaceAll('에너지가 얼마나 나올지, 어느 원소까지 만들지, 어디서 왔을지 예상합니다.','에너지가 방출되는지, 어떤 원소를 만드는지, 원소가 어디서 왔는지 예상합니다.');
 s=q(s,1,['태양이 빛과 열을 방출하는 주된 에너지원은?', ['석탄의 연소','수소 원자핵의 핵융합','태양 표면의 마찰','지구에서 올라온 열'],'b','태양 중심부에서 수소 원자핵이 융합하여 헬륨 원자핵을 만드는 과정에서 에너지가 방출됩니다.']);
 s=q(s,2,['초기 우주와 별에서 생성된 원소에 대한 설명으로 옳은 것은?', ['초기 우주에서 모든 원소가 같은 양으로 생겼다.','철은 생명체가 처음 만들었다.','초기 우주에서는 주로 수소·헬륨이 생성되었다.','탄소는 별과 전혀 관계없다.'],'c','초기 우주에서는 주로 수소와 헬륨이 생성되었고, 탄소·산소 등 여러 원소는 이후 별 내부 등에서 생성되었습니다.']);
 s=q(s,3,['질량이 다른 별의 진화를 비교할 때 옳은 설명은?', ['모든 별이 반드시 같은 원소만 만든다.','모든 별이 반드시 초신성으로 끝난다.','별의 질량은 진화와 무관하다.','생성하는 원소와 마지막 모습이 달라질 수 있다.'],'d','별의 질량에 따라 진화 과정과 생성하는 원소, 마지막 모습이 달라집니다. 화면의 진행 시간을 실제 수명으로 읽으면 안 됩니다.']);
 s=q(s,4,['우리 몸을 이루는 탄소·산소의 기원에 대한 설명은?', ['별 내부 등에서 생성되어 우주에 퍼진 물질이 재료가 되었다.','우리 몸에서 처음 만들어졌다.','모두 빅뱅 직후에만 만들어졌다.','지구의 돌이 저절로 핵융합한 결과이다.'],'a','별 내부 등에서 생성된 원소가 우주 공간에 퍼지고 다시 모여 태양계와 우리 몸을 이루는 재료가 되었습니다.']);
 return cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`);
});
edit(lab+'star-elements/app.js',s=>{
 s=r(s,"Object.entries(STEPS).map(([k, v]) => ({ value: k, label: v.label, hint: v.temp === '—' ? '' : v.temp }))","Object.entries(STEPS).filter(([k])=>['h','he'].includes(k)).map(([k,v])=>({value:k,label:v.label}))");
 s=fn(s,'buildPrediction',`    function buildPrediction() {
        const list=state.mode==='fusion'?[{value:'yes',label:'에너지 방출'},{value:'no',label:'에너지가 전혀 나오지 않음'}]:state.mode==='mass'?PRED_MASS:PRED_ORIGIN;
        predictionLegend.textContent=state.mode==='fusion'?'이 핵융합 과정에서는?':state.mode==='mass'?'이 별에서 생성되는 원소를 예상하세요.':'이 원소의 주요 생성 과정을 고르세요.';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction;predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }`);
 s=fn(s,'render',`    function render() {
        const a=analyse(),p=state.progress;
        let text='',drawing='',label='';
        if(a.kind==='fusion'){
            const st=a.st,n=st.fuel.n;
            for(let i=0;i<n;i++){const angle=i*2*Math.PI/n;drawing+=nucleus(200+70*(1-p)*Math.cos(angle),105+55*(1-p)*Math.sin(angle),st.fuel.sym,st.fuel.A,1-p);}
            drawing+=nucleus(200,105,st.ash.sym,st.ash.A,p);
            text=st.label+' · 核융합 과정에서 에너지가 방출됩니다.'.replace('核','핵');label='핵융합과 에너지';
        }else if(a.kind==='mass'){
            const i=Math.min(a.star.stages.length-1,Math.floor(p*a.star.stages.length));
            const st=STEPS[a.star.stages[i]];
            drawing='<circle cx="200" cy="105" r="68" fill="#f59e0b" opacity=".55"/><circle cx="200" cy="105" r="34" fill="#b45309"/>'+nucleus(200,105,st.ash.sym,st.ash.A);
            text=p>=1?a.star.endText:st.label+' 과정의 모형';label=a.star.label;
        }else{
            drawing='<circle cx="200" cy="100" r="60" fill="#dbeafe"/>'+nucleus(200,100,a.el.sym,a.el.sym==='H'?1:4);
            text=a.el.origin==='bigbang'?'초기 우주에서 주로 수소·헬륨 생성':a.el.origin==='star'?'별 내부와 진화 과정 등에서 생성':'중성자별 충돌 등 무거운 원소의 생성 과정';label=a.el.name+'의 기원';
        }
        mainGroup.innerHTML=drawing+'<text x="20" y="28" fill="#334155">'+label+'</text>';
        graphGroup.innerHTML='<text x="20" y="45" fill="#334155">초기 우주 → 별의 형성과 진화 → 원소가 우주로 퍼짐</text><text x="20" y="95" fill="#334155">이 물질들이 모여 태양계와 우리 몸의 재료가 됩니다.</text>';
        stageBadge.textContent=label;methodHint.textContent='태양의 수소 핵융합과 원소의 생성 과정을 연결합니다.';
        dataNote.innerHTML='<p>'+text+'</p><p>단계와 원자핵 그림은 개념을 나타내는 모형입니다. 그림의 크기·시간으로 실제 핵반응량이나 별의 수명을 계산하지 않습니다.</p>';
        return a;
    }`);
 s=fn(s,'finish',`    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='관찰';valueA.textContent=a.kind==='fusion'?'에너지 방출':a.kind==='mass'?{he:'헬륨까지',co:'탄소·산소까지',sn:'철까지 + 초신성'}[a.star.end]:a.el.name;
        labelB.textContent='핵심';valueB.textContent=a.kind==='fusion'?'핵융합':a.kind==='mass'?'질량에 따라 다름':'원소의 기원';
        const answer=a.kind==='fusion'?'yes':a.verdict;predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='fusion'?'태양은 수소 원자핵의 핵융합으로 에너지를 방출합니다.':a.kind==='mass'?'별의 질량에 따라 생성하는 원소와 마지막 모습이 달라집니다. 모형의 진행 시간은 실제 수명이 아닙니다.':'초기 우주에서 주로 수소·헬륨이 생성되었고, 이후 별 내부·진화·폭발·충돌 등의 여러 과정으로 다양한 원소가 만들어져 퍼졌습니다. 특정 원소의 생성 과정은 하나로만 한정되지 않을 수 있습니다.';
    }`);return s;
});
apply();
