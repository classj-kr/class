const {edit,replace:r,cut,replaceQuiz:q,apply,lab}=require('./science-scope-patch.cjs');
const fn=(s,name,body)=>cut(s,new RegExp('    function '+name+'\\([^)]*\\) \\{[\\s\\S]*?^    \\}','m'),body);
edit(lab+'stars-universe/index.html',s=>{
 s=cut(s,/<p><strong>거리와 밝기<\/strong>.*?<\/p>/,'<p><strong>거리와 밝기</strong> 같은 별을 더 멀리에서 보면 어둡게 보입니다. 따라서 눈에 보이는 밝기만으로 별이 실제 내는 빛의 양을 비교할 수는 없습니다.</p>');
 s=cut(s,/<p><strong>별의 색과 온도<\/strong>.*?<\/p>/,'<p><strong>별의 색과 온도</strong> 표면 온도가 높은 별은 청백색, 낮은 별은 붉은색으로 보입니다. 여기서는 색으로 상대적인 표면 온도를 비교합니다.</p>');
 s=cut(s,/<p><strong>우주 팽창<\/strong>.*?<\/p>/,'<p><strong>우주 팽창</strong> 고무줄이나 풍선에 표시한 점들 사이가 벌어지는 모형으로 우주 공간의 팽창을 설명합니다. 모형의 늘어나는 방향·가장자리·바깥 공간을 실제 우주의 구조와 똑같다고 해석하지 않습니다.</p>');
 s=s.replaceAll('거리가 2배가 되면 같은 빛이 4배 넓은 곳에 퍼져 밝기는 4분의 1이 됩니다','같은 별은 더 멀리에서 보면 어둡게 보입니다').replaceAll('밝기와 등급, 거리와 속도가 어떤 관계인지','밝기와 등급, 점들 사이의 거리 변화를').replaceAll('어느 은하가 빨리 멀어질까','점들 사이가 어떻게 될까');
 s=q(s,1,['같은 별을 더 멀리에서 보면 겉보기 밝기는?', ['어두워진다.','밝아진다.','별의 고유한 빛 방출량이 늘어난다.','반드시 색이 붉게 바뀐다.'],'a','같은 별에서 나온 빛이라도 더 멀리에서 보면 어둡게 보입니다. 별이 실제 내는 빛의 양이 바뀐다는 뜻은 아닙니다.']);
 s=q(s,2,['겉보기 등급이 1등급인 별과 6등급인 별을 비교하면?', ['6등급이 100배 밝다.','1등급이 100배 밝다.','겉보기 밝기가 같다.','숫자만으로 비교할 수 없다.'],'b','등급 숫자가 작을수록 밝습니다. 5등급 차이는 밝기 100배 차이에 해당합니다.']);
 s=q(s,3,['어떤 별을 더 멀리 놓았을 때 변하지 않는 것은? (별 자체의 성질은 일정)', ['겉보기 밝기','겉보기 등급','절대 등급','관측자와의 거리'],'c','절대 등급은 모든 별을 같은 기준 거리인 10 pc에 놓았다고 가정한 등급이므로 실제 관측 거리가 달라져도 변하지 않습니다.']);
 s=q(s,4,['고무줄에 점들을 찍고 늘렸더니 점 사이 거리가 커졌습니다. 무엇의 모형인가요?', ['모든 별의 크기 증가','달의 모양 변화','지구의 자전','우주 공간의 팽창'],'d','점들 사이가 벌어지는 모습으로 우주 공간의 팽창을 나타냅니다. 고무줄의 가장자리나 바깥 공간까지 실제 우주와 같다고 해석하면 안 됩니다.']);
 return cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`);
});
edit(lab+'stars-universe/app.js',s=>{
 s=fn(s,'buildPrediction',`    function buildPrediction() {
        const list=state.mode==='bright'?[{value:'square',label:'어두워진다'},{value:'no',label:'밝아진다'}]:[{value:'faster',label:'점들 사이 거리가 커진다'},{value:'no',label:'모든 점이 한 곳으로 모인다'}];
        predictionLegend.textContent=state.mode==='bright'?'같은 별을 멀리에서 보면?':'고무줄을 늘리면?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction;predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }`);
 s=cut(s,/        out \+= `<text class="mag-text" fill="#0f172a" x="20" y="204">.*?;/,'        out += `<text class="mag-text" fill="#0f172a" x="20" y="204">같은 별은 더 멀리에서 보면 어둡게 보입니다.</text>`;');
 s=fn(s,'graphBright',`    function graphBright(a) { return '<text x="20" y="50" fill="#334155">겉보기 등급: 실제 보이는 밝기</text><text x="20" y="90" fill="#334155">절대 등급: 같은 기준 거리에서 비교한 밝기</text><text x="20" y="130" fill="#334155">같은 별의 색과 절대 등급은 거리만으로 바뀌지 않습니다.</text>'; }`);
 s=fn(s,'graphExpand',`    function graphExpand(a) { return '<text x="20" y="50" fill="#334155">늘리기 전과 후의 점 사이 거리를 비교합니다.</text><text x="20" y="90" fill="#334155">다른 점을 기준으로 삼아 다시 관찰하세요.</text><text x="20" y="130" fill="#334155">고무줄의 가장자리를 실제 우주의 끝으로 해석하지 않습니다.</text>'; }`);
 s=fn(s,'noteFor',`    function noteFor(a) { return a.kind==='bright'?'<p>'+a.star.name+' · '+a.star.colour+'</p><p>같은 별을 멀리 놓으면 어둡게 보이지만 절대 등급은 그대로입니다. 청백색 별은 붉은색 별보다 표면 온도가 높습니다.</p>':'<p>늘리기 전후의 점 사이 거리가 커집니다. 어느 점을 기준으로 삼아도 다른 점들과 멀어지는 모습을 관찰할 수 있습니다.</p>'; }`);
 s=s.replaceAll('거리가 2배가 되면 같은 빛이 4배 넓은 곳에 퍼져 밝기는 4분의 1이 됩니다','같은 별을 더 멀리에서 보면 어둡게 보입니다').replaceAll('고무줄이 늘어나면 멀리 있던 점이 더 많이 움직입니다','고무줄이 늘어나면 점들 사이 거리가 커집니다');
 s=fn(s,'finish',`    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent=a.kind==='bright'?'겉보기 밝기':'점 사이 거리';valueA.textContent=a.kind==='bright'?'어두워짐':'커짐';
        labelB.textContent=a.kind==='bright'?'절대 등급':'모형의 의미';valueB.textContent=a.kind==='bright'?fmtMag(a.star.abs)+' 그대로':'우주 팽창';
        predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===a.verdict?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='bright'?'같은 별은 멀리에서 보면 어둡게 보입니다. 절대 등급은 같은 기준 거리에서의 밝기를 뜻하므로 별 자체의 성질이 같으면 바뀌지 않습니다.':'고무줄을 늘릴 때 점 사이가 벌어지는 모습은 우주 팽창의 모형입니다. 어느 점을 기준으로 삼아도 다른 점들과 멀어지는 모습을 관찰할 수 있습니다. 모형의 가장자리와 바깥 공간을 실제 우주에 그대로 대응시키지 않습니다.';
    }`);return s;
});
edit(lab+'microscope/index.html',s=>{
 s=cut(s,/<button[^>]*data-spec="cheek"[^>]*>[\s\S]*?<\/button>/);s=cut(s,/<button[^>]*data-spec="para"[^>]*>[\s\S]*?<\/button>/);
 s=cut(s,/<p><strong>크게 볼수록 어두워집니다<\/strong>.*?<\/p>/,'<p><strong>밝기 조절</strong> 관찰 화면이 어두우면 현미경의 조명과 조리개 등을 알맞게 조절합니다. 실제 밝기는 배율뿐 아니라 렌즈와 조명 조건에도 영향을 받습니다.</p>');
 s=q(s,1,['식물을 이루는 기본 단위는?', ['기관 전체만','세포','흙 알갱이','물방울'],'b','식물은 세포로 이루어져 있습니다. 현미경으로 식물 세포를 관찰하며 핵·세포막·세포벽의 이름을 익힙니다.']);
 s=s.replaceAll('그래서 벽돌을 나란히 쌓은 것처럼 보입니다. 세포벽이 없는 입안 상피 세포는 둥글고 제각각입니다.','그래서 벽돌을 나란히 쌓은 것처럼 보입니다.').replaceAll('배율이 높아지면 같은 빛이 더 넓게 퍼져 어두워집니다. 조리개를 열거나 빛을 더 모아 주어야 잘 보입니다.','화면이 어두울 때는 조명과 조리개를 알맞게 조절하여 관찰하기 좋게 맞춥니다.');
 return cut(s,/app\.js\?v=(\d+)/,(_,n)=>`app.js?v=${+n+1}`);
});
edit(lab+'microscope/app.js',s=>{
 s=r(s,'function brightness(eye, obj) { return Math.pow(40 / power(eye, obj), 2); }','function brightness(eye, obj) { return ({4:1,10:0.8,40:0.6})[obj]; } // Illustrative shading, not a photometric law.');
 s=cut(s,/    g.appendChild\(el\('text', \{ x: 20, y: 206,.*?;\n/);
 s=cut(s,/        \['밝기',.*?\n/);
 s=cut(s,/    s \+= `밝기는 더 가파르게 줄어들어.*?;\n/,'    s += "실제 밝기는 렌즈와 조명 조건에 따라 달라집니다. 화면이 어두우면 조명과 조리개를 조절합니다. ";\n');
 s=s.replaceAll("['실제 크기'","['모형의 세포 크기'").replaceAll('의 실제 크기는','의 모형 크기는');return s;
});
apply();
