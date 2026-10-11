/* Particle diagrams conserve atom/particle counts. Graphs label fixed conditions. */
(function(){
    const L=window.LessonVisuals,{C,text:t,path:p,circle:c,rect:r,arrow:a,svg,flow,compare,note,figure:f}=L;
    const dot=(x,y,color=C.blue)=>c(x,y,7,color);
    const grid=(x,y,cols=4,rows=3,step=20,color=C.blue)=>Array.from({length:cols*rows},(_,i)=>dot(x+i%cols*step,y+Math.floor(i/cols)*step,color)).join('');
    function stateArt(state,level){
        let g=p(state===2?'M20 20V187H140V20Z':'M20 20V187H140V20','#6d8d96');
        if(level==='elementary')g+=state===0?r(48,117,64,64,'#b8ced8'):state===1?r(22,123,116,62,'#b5d9e9','none'):r(22,22,116,163,'#e1edf1','none');
        else if(state===0)g+=grid(50,130,4,3,20);
        else if(state===1)g+=[[38,132],[61,142],[88,131],[119,136],[43,160],[72,163],[99,159],[127,159],[30,176],[56,178],[86,178],[113,178]].map(([x,y])=>dot(x,y)).join('');
        else g+=[[33,37],[83,28],[124,50],[60,70],[28,96],[110,99],[73,119],[128,141],[35,145],[92,159],[49,178],[130,177]].map(([x,y])=>dot(x,y)).join('');
        return svg(['모양을 유지하는 고체','그릇 모양을 따르는 액체','공간 전체를 채우는 기체'][state],g,208,160);
    }
    L.define('matter-states',level=>[f('states-structure','세 상태의 모양과 배열',compare(['고체','액체','기체'].map((name,i)=>[name,stateArt(i,level)+note(level==='elementary'?['모양과 부피가 일정','부피는 일정 · 모양은 변함','공간 전체로 퍼짐'][i]:['가까이 모여 제자리 진동','가까이서 서로 자리 이동','멀리 떨어져 여러 방향으로 운동'][i])])),level==='elementary'?'고체는 물체의 모양, 액체와 기체는 담는 공간과의 관계를 비교합니다.':'각 그림은 같은 종류의 입자를 같은 수와 크기로 나타냈습니다. 배열과 간격을 비교합니다.')]);
    function heatingCurve(){
        return svg('물을 일정한 압력에서 가열하면 녹는 동안과 끓는 동안 온도가 일정한 구간이 있습니다.',
            p('M50 20V267H452',C.muted)+p('M65 240L120 205H201L282 89H370L432 40',C.red,'none',4)+t(43,210,'0','end')+t(43,97,'100','end')+t(66,36,'온도(℃)','start')+t(411,297,'가열 시간')+
            t(156,184,'녹는 중')+t(326,70,'끓는 중')+a(144,250,144,213,C.gold)+a(335,133,335,97,C.gold),320);
    }
    L.define('matter-phase',level=>[f('phase-directions','상태 변화와 열의 이동',compare([
        ['열을 가할 때',flow(['얼음','물','수증기'])+note(level==='elementary'?'녹기 → 물이 수증기로 변하기':'융해 → 기화 · 열 흡수')],
        ['냉각할 때',flow(['수증기','물','얼음'])+note(level==='elementary'?'응결 → 얼기':'액화 → 응고 · 열 방출')]
    ]),'변화 전후에 무엇이 어떤 상태로 바뀌는지 화살표 방향으로 읽습니다.'),...(level==='elementary'?[]:[f('heating-plateaus','열을 계속 주어도 온도가 일정한 구간',heatingCurve(),'1기압에서 순수한 물을 일정한 세기로 가열한 경우입니다. 수평 구간에서도 열이 들어가 상태 변화에 쓰입니다.',1)])]);
    L.define('matter-gas',level=>level==='elementary'?[]:[f('gas-compression','같은 온도에서 기체를 압축하면',compare([
        ['부피 3 L · 압력 1기압',svg('넓은 공간에 같은 양의 기체가 있습니다.',r(20,35,180,172,'#f6f7f1')+[[42,64],[86,91],[124,49],[181,81],[48,128],[97,142],[140,114],[176,153],[36,183],[85,190],[136,177],[188,193]].map(([x,y])=>dot(x,y)).join('')+p('M20 36H200',C.muted,'none',8),225,220)],
        ['부피 1 L · 압력 3기압',svg('부피가 3분의 1이 되면 같은 온도에서 압력이 3배입니다.',r(20,35,180,172,'#f6f7f1')+r(22,37,176,112,'#d4d9d4','none')+[[37,163],[87,166],[126,162],[181,164],[57,180],[102,181],[142,178],[173,183],[35,197],[79,198],[123,198],[187,198]].map(([x,y])=>dot(x,y)).join('')+p('M20 150H200',C.muted,'none',8)+a(157,58,157,127),225,220)]
    ]),'기체의 양과 온도를 일정하게 둡니다. 입자 자체의 크기는 그대로이고 입자가 움직이는 공간이 줄어듭니다.'),...(level==='high'?[f('gas-conditions','다른 조건을 고정한 뒤 비교',compare([['n, T 일정','<div class="lv-formula">V → ½V<br>P → 2P</div>'],['n, V 일정','<div class="lv-formula">300 K → 600 K<br>P → 2P</div>']]),'PV=nRT에서 온도 비율은 절대 온도 K로 계산합니다.',1)]:[])]);
    L.define('matter-atom',level=>level==='elementary'?[]:[f('ion-electrons','전자를 잃어도 양성자 수는 그대로',svg('나트륨 원자가 전자 하나를 잃어 나트륨 이온이 됩니다.',
        c(110,126,70,'#e2ebee',C.blue)+c(110,126,23,'#d8a293')+t(110,82,'Na')+t(110,128,'+11', 'middle',C.ink,18)+t(110,224,'양성자 11')+t(110,254,'전자 11')+
        c(370,126,70,'#e2ebee',C.blue)+c(370,126,23,'#d8a293')+t(370,82,'Na⁺')+t(370,128,'+11','middle',C.ink,18)+t(370,224,'양성자 11')+t(370,254,'전자 10')+a(195,125,280,125)+t(240,86,'− e⁻'),290),'원소의 종류는 원자핵의 양성자 수로 정해집니다. 전자를 잃은 나트륨은 +1의 전하를 띱니다.'),...(level==='high'?[f('isotope-comparison','동위 원소는 중성자 수가 다르다',compare([['탄소 12','<div class="lv-formula">양성자 6<br>중성자 6</div>'],['탄소 14','<div class="lv-formula">양성자 6<br>중성자 8</div>']]),'두 원자의 원자 번호는 6으로 같습니다. 질량수는 양성자 수와 중성자 수의 합입니다.',1)]:[])]);
    function orbital(type){
        let g='';
        for(let ix=0;ix<64;ix++)for(let iy=0;iy<64;iy++){
            const x=(ix-31.5)/4,y=(iy-31.5)/4,rad=Math.hypot(x,y);
            const density=type==='s'?Math.exp(-2*rad):x*x*Math.exp(-rad)/(.54);
            const opacity=Math.min(1,density);
            g+=`<rect x="${14+ix*3}" y="${14+iy*3}" width="3.1" height="3.1" fill="${type==='p'&&x<0?C.purple:C.blue}" opacity="${opacity}"/>`;
        }
        if(type==='p')g+=p('M110 8V214',C.muted)+t(110,244,'마디면의 단면');
        else g+=t(110,244,'핵 주위의 확률 밀도');
        return svg(type==='s'?'수소 원자 1s 오비탈의 중앙 단면':'수소 원자 2p 오비탈의 중앙 단면, 가운데는 마디',g,270,220);
    }
    L.define('matter-orbital',level=>level==='high'?[f('orbital-density','오비탈의 중앙 단면 비교',compare([['1s',orbital('s')],['2p',orbital('p')]]),'각 그림 안에서 진한 부분일수록 전자를 발견할 확률 밀도가 높습니다. 색의 진하기는 각 오비탈 안에서 비교합니다. 2p의 두 색은 파동 함수의 부호이며 전하를 뜻하지 않습니다.')]:[]);
    const boxes=(spins)=>svg('같은 에너지의 2p 오비탈 세 개에 채운 전자.',spins.map((s,i)=>r(14+i*68,30,56,63,'#fffdf7')+t(42+i*68,72,s)).join(''),115,220);
    L.define('matter-config',level=>level==='high'?[f('hund-orbitals','2p 전자를 채우는 순서',compare([['질소 · 2p³',boxes(['↑','↑','↑'])+note('홀전자 3개')],['산소 · 2p⁴',boxes(['↑↓','↑','↑'])+note('홀전자 2개')]]),'같은 에너지의 오비탈에는 평행 스핀으로 먼저 하나씩 채웁니다. 한 오비탈에 두 전자가 들어갈 때에는 스핀이 반대입니다.')]:[]);
    L.define('matter-bond',level=>level==='high'?[f('bond-dipoles','결합 방향과 분자 전체의 극성',compare([
        ['CO₂ · 직선형',svg('두 결합 쌍극자가 반대 방향으로 같아 상쇄됩니다.',p('M40 112H180',C.muted,'none',5)+c(35,112,18,'#c58f85')+c(110,112,15,'#a1b3b9')+c(185,112,18,'#c58f85')+t(35,120,'O')+t(110,120,'C')+t(185,120,'O')+a(104,71,39,71,C.blue)+a(116,71,181,71,C.blue)+t(110,192,'상쇄 · 무극성'),220,220)],
        ['H₂O · 굽은형',svg('굽은 모양으로 두 결합 쌍극자가 상쇄되지 않습니다.',p('M47 145L110 96L173 145',C.muted,'none',5)+c(110,96,18,'#c58f85')+c(47,145,15,'#d8e5e9')+c(173,145,15,'#d8e5e9')+t(110,104,'O')+t(47,153,'H')+t(173,153,'H')+a(51,112,87,84,C.blue)+a(169,112,133,84,C.blue)+a(110,63,110,17,C.teal)+t(110,202,'상쇄 안 됨 · 극성'),230,220)]
    ]),'화살표는 결합 전자쌍이 더 끌리는 방향입니다. 결합의 극성과 분자 전체의 극성을 구별합니다.')]:[]);
    const pair=(x,y,mixed=false)=>dot(x-7,y,C.blue)+dot(x+7,y,mixed?C.red:C.blue);
    L.define('matter-classify',level=>level==='elementary'?[]:[f('substance-types','물질의 종류와 구성 원소를 따로 비교',compare([
        ['홑원소 물질',svg('같은 원소 두 원자가 결합한 같은 종류의 입자만 있습니다.',pair(52,48)+pair(153,48)+pair(101,112),145,220)+note('예: 산소 O₂ · 순물질')],
        ['화합물',svg('다른 원소 원자들이 결합한 같은 종류의 입자만 있습니다.',pair(52,48,true)+pair(153,48,true)+pair(101,112,true),145,220)+note('예: 일산화 탄소 CO · 순물질')],
        ['혼합물',svg('두 종류의 입자가 함께 섞여 있습니다.',pair(52,48)+pair(153,48,true)+pair(101,112),145,220)+note('두 종류 이상의 물질이 섞임')]
    ]),'구슬의 색은 원소의 종류를 나타냅니다. 순물질인지 판단할 때에는 물질의 종류 수를 봅니다.')]);
    function atom(x,y,element){return c(x,y,element==='O'?17:12,element==='O'?'#cb938a':'#dce8ed',element==='O'?C.red:C.blue)+t(x,y+6,element,'middle',C.ink,18);}
    L.define('matter-reaction',level=>level==='elementary'?[]:[f('reaction-atoms','반응 전후의 원자 수 비교',svg('수소 분자 둘과 산소 분자 하나가 물 분자 둘로 바뀝니다.',
        atom(55,70,'H')+atom(78,70,'H')+atom(55,136,'H')+atom(78,136,'H')+atom(164,99,'O')+atom(196,99,'O')+a(236,106,276,106)+
        atom(362,65,'O')+atom(337,85,'H')+atom(387,85,'H')+atom(362,142,'O')+atom(337,162,'H')+atom(387,162,'H')+
        t(119,220,'2H₂ + O₂')+t(360,220,'2H₂O')+t(240,272,'수소 원자 4개 · 산소 원자 2개'),303),'원자가 없어지거나 새로 생기는 것이 아니라 결합 상대와 배열이 바뀝니다.'),...(level==='high'?[f('limiting-reagent','넣은 양과 반응한 양 구분',compare([['투입','<div class="lv-formula">H₂ 6 mol<br>+ O₂ 2 mol</div>'],['반응 후','<div class="lv-formula">H₂O 4 mol 생성<br>+ H₂ 2 mol 남음</div>']]),'산소 2 mol과 반응하는 수소는 4 mol입니다. 산소가 먼저 소모되어 생성량을 제한합니다.',1)]:[])]);
    L.define('matter-solution',level=>level==='high'?[f('dilution','희석 전후에 같은 것은 용질의 양',compare([
        ['희석 전',svg('100밀리리터 용액에 용질 0.02몰.',p('M26 20V196H194V20',C.muted)+r(29,151,162,42,'#c5dfea','none')+grid(67,161,3,2,20,C.teal)+t(110,231,'100 mL · 0.20 M'),260,220)],
        ['희석 후',svg('400밀리리터 용액에도 용질은 0.02몰.',p('M26 20V196H194V20',C.muted)+r(29,25,162,168,'#c5dfea','none')+grid(58,76,3,2,43,C.teal)+t(110,231,'400 mL · 0.050 M'),260,220)]
    ]),'용질을 잃지 않고 물을 더하면 용질의 몰수는 같고 용액의 부피만 커집니다. 최종 용액 부피를 400 mL로 맞춥니다.')]:[]);
    L.define('matter-equilibrium',level=>{
        if(level!=='high')return [];
        const curve=(reverse)=>Array.from({length:61},(_,i)=>{const time=i/10,v=reverse?3*(1-Math.exp(-time)):3+9*Math.exp(-time);return `${i?'L':'M'}${60+i*6} ${250-v*17}`;}).join(' ');
        return [f('equilibrium-rates','평형에서 같아지는 두 반응 속도',svg('정반응 속도는 감소하고 역반응 속도는 증가하여 같은 값에 가까워집니다.',p('M50 20V263H448',C.muted)+p(curve(false),C.red,'none',3)+p(curve(true),C.blue,'none',3)+t(116,31,'반응 속도')+t(397,295,'시간')+t(160,102,'정반응','middle',C.red)+t(161,240,'역반응','middle',C.blue)+t(364,174,'두 속도가 같음'),320),'정반응과 역반응은 모두 계속됩니다. 두 속도가 같아져 각 물질의 농도가 일정해지며, 농도끼리 같을 필요는 없습니다.')];
    });
    L.define('matter-acid',level=>level==='high'?[f('neutralisation-ions','반응하는 이온과 남는 이온',svg('수소 이온과 수산화 이온이 물을 만들고 나트륨 이온과 염화 이온은 남습니다.',
        c(65,77,25,'#edd0c8')+t(65,85,'H⁺')+t(127,85,'+')+c(191,77,31,'#c6e0e8')+t(191,85,'OH⁻')+a(246,77,326,77)+c(389,77,32,'#dce8e0')+t(389,85,'H₂O')+
        c(148,216,32,'#d9d5e7')+t(148,224,'Na⁺')+c(323,216,32,'#e5ddb9')+t(323,224,'Cl⁻')+t(240,294,'용액에 남아 있는 이온'),321),'HCl과 NaOH 수용액을 반응 비율에 맞춰 섞은 경우입니다. H⁺와 OH⁻이 소모되어도 용액에는 Na⁺와 Cl⁻이 남습니다.')]:[]);
    L.define('matter-redox',level=>level==='high'?[f('redox-electrons','잃은 전자 수와 얻은 전자 수',compare([
        ['산화 · 아연',flow(['Zn','Zn²⁺ + 2e⁻'])+note('전자 2개를 내놓음 · 환원제')],
        ['환원 · 구리 이온',flow(['Cu²⁺ + 2e⁻','Cu'])+note('전자 2개를 받음 · 산화제')]
    ])+svg('아연에서 구리 이온으로 전자 두 개가 전달됩니다.',r(25,30,110,65)+t(80,71,'Zn')+a(148,62,331,62,C.gold)+t(240,38,'2e⁻')+r(345,30,110,65)+t(400,71,'Cu²⁺'),125),'두 반쪽 반응을 합하면 전자는 소거됩니다. 전체 반응은 Zn + Cu²⁺ → Zn²⁺ + Cu입니다.')]:[]);
})();

