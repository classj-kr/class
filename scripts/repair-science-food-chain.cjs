const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
function span(s,a,b,next){const i=s.indexOf(a),j=s.indexOf(b,i+a.length);if(i<0||j<0)throw Error('Missing '+a);return s.slice(0,i)+next+'\n\n'+s.slice(j);}
edit(lab+'life-cycle/app.js',s=>{
    s=span(s,'/* Two things','const NONE', '/* Life stages and feeding links are separate observations. No individual-count ratio is assumed. */');
    s=span(s,'// How many of each level','function analyse()',`function foodChain(k) {
    return ANIMALS[k].chain.map((name,level)=>({name,level}));
}`);
    s=replace(s,'pyramid: pyramid(state.animal)','chain: foodChain(state.animal)');
    s=span(s,'function drawPyramid(g) {','function render() {',`function drawFoodChain(g) {
    const a=analyse(),n=a.chain.length;
    g.appendChild(el('text',{x:230,y:20,'text-anchor':'middle',class:'axis-title'},'먹이 관계의 예'));
    a.chain.forEach((t,i)=>{
        const y=34+i*34,here=i===a.animal.at;
        g.appendChild(el('rect',{x:120,y,width:220,height:26,rx:6,fill:here?'#dff0e7':'#edf3f6',stroke:here?'#67a187':'#c9d9e2','data-food-level':i}));
        g.appendChild(el('text',{x:230,y:y+18,'text-anchor':'middle',style:'fill:#173449;font-size:14px;font-weight:600'},t.name));
        if(i<n-1){g.appendChild(el('path',{d:'M230 '+(y+28)+' v4 m-3 -2 l3 3 3 -3',fill:'none',stroke:'#557a6b','stroke-width':1.5,'data-food-direction':'prey-to-consumer'}));}
    });
    g.appendChild(el('text',{x:230,y:190,'text-anchor':'middle',class:'axis-text'},'화살표: 먹이가 되는 생물 → 먹는 생물'));
}`);
    s=replace(s,'drawStages(m); drawPyramid(gr);','drawStages(m); drawFoodChain(gr);');
    s=replace(s,'    const top = a.pyramid[a.pyramid.length - 1];\n','');
    s=replace(s,"        [`${top.name} 한 ${eul(top.unit)} 먹이려면`,\n            `${iga(a.pyramid[0].name)} ${a.pyramid[0].count.toLocaleString('ko-KR')}${a.pyramid[0].unit}쯤 있어야 합니다`, false],", "        ['먹이 관계 해석', '화살표는 먹이가 되는 생물에서 먹는 생물 쪽으로 향합니다.', false],");
    s=span(s,'    const p = a.pyramid,','    $(\'elementaryExplanation\').textContent = s;', `    s += '이 그림은 먹고 먹히는 관계를 보여 줍니다. 먹이 사슬의 단계만으로 생물의 수를 정할 수 없으며, 한 단계마다 개체 수가 열 배씩 줄어드는 것은 아닙니다.';`);
    s=replace(s,'verdictFor, pyramid,','verdictFor, foodChain,');
    s=replace(s,'ANIMALS, PASS,','ANIMALS,');
    s=replace(s,'알에서 어른이 되기까지 모두 ${a.total}일쯤 걸립니다.','이 모형의 예시에서는 알에서 어른이 되기까지 ${a.total}일이며, 실제 기간은 종과 환경에 따라 달라집니다.');
    s=replace(s,'올챙이는 물속에서 아가미로 숨 쉬고, 개구리가 되면 뭍으로 올라와 폐로 숨 쉽니다. 사는 곳이 통째로 바뀌는 셈입니다.','이 모형의 올챙이는 주로 아가미로 숨 쉬며 물속에서 자랍니다. 다 자란 개구리는 폐와 피부로 호흡하고 물가와 뭍에서 생활합니다. 개구리의 종류에 따라 생활 모습은 다릅니다.');
    return s;
});
edit(lab+'life-cycle/index.html',s=>{
    s=replace(s,'<p><strong>먹이 사슬은 위로 갈수록 좁아집니다</strong> 먹은 것이 모두 몸이 되지는 않습니다. 대부분은 움직이고 숨 쉬는 데 쓰여 사라지므로, 위 단계 한 마리를 먹여 살리려면 아래 단계가 열 배쯤 있어야 합니다.</p>', '<p><strong>먹고 먹히는 관계</strong> 먹이 사슬의 화살표는 먹이가 되는 생물에서 먹는 생물 쪽으로 향합니다. 생물의 수는 종류와 환경에 따라 달라지므로, 단계가 올라갈 때마다 반드시 열 배씩 줄어드는 것은 아닙니다.</p>');
    s=replace(s,'올챙이는 물속에 살며 아가미로 숨 쉬고 이끼를 먹습니다. 개구리가 되면 뭍으로 올라와 폐로 숨 쉬고 곤충을 잡아먹습니다. 몸이 바뀌니 먹는 것도 바뀝니다.','이 모형의 올챙이는 물속에서 자라며 주로 아가미로 호흡하고, 다 자란 개구리는 폐와 피부로 호흡하며 곤충 등을 먹습니다. 종류와 성장 단계에 따라 먹이와 생활 모습이 달라질 수 있습니다.');
    return s;
});
apply();
