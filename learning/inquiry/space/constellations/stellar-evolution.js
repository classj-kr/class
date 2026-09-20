(function(root){
    'use strict';
    const bounds=[0,.17,.32,.54,.72,.9,1];
    const shared=[
        {id:'nebula',name:'성운',description:'차갑고 성긴 가스와 먼지가 중력으로 모입니다. 중심으로 모일수록 밀도가 높아집니다.',energy:'중력에 의한 수축',change:'가스와 먼지가 중심으로 모임'},
        {id:'protostar',name:'원시별',description:'수축하며 중심부의 온도와 압력이 높아집니다. 아직 중심의 수소 핵융합으로 안정되게 빛나는 단계는 아닙니다.',energy:'수축으로 방출되는 에너지',change:'밀도와 중심부 온도 증가'},
        {id:'main',name:'주계열성',description:'중심에서 수소가 헬륨으로 바뀌는 핵융합이 지속됩니다. 안으로 당기는 중력과 바깥쪽 압력이 균형을 이룹니다.',energy:'중심의 수소 핵융합',change:'안정된 크기로 오래 유지'}
    ];
    function stages(mass,remnant){
        const large=mass==='massive';
        return [...shared,
            {id:'giant',name:large?'적색 초거성':'적색거성',description:large?'중심의 연료가 바뀌며 더 무거운 원소가 만들어집니다. 바깥층은 크게 팽창하고 표면은 식습니다.':'중심의 수소가 줄면 내부 구조가 달라집니다. 바깥층은 크게 팽창하며 표면이 식어 붉어집니다. 중심부와 표면의 온도 변화는 다릅니다.',energy:large?'여러 단계의 핵융합':'껍질의 수소 핵융합 · 이후 중심의 헬륨 핵융합',change:'바깥층 팽창 · 표면 온도 하강'},
            {id:'ejection',name:large?'초신성':'행성상 성운',description:large?'연료로 버티지 못한 중심핵이 급격히 붕괴하고, 대표적인 경로에서는 바깥층이 초신성 폭발로 퍼져 나갑니다.':'별이 바깥층을 우주 공간으로 내보냅니다. 뜨거운 중심핵 주위로 가스가 퍼져 행성상 성운이 됩니다. 행성이 생긴다는 뜻은 아닙니다.',energy:large?'중심핵 붕괴와 바깥층 폭발':'뜨거운 중심핵이 주변 가스를 빛나게 함',change:large?'충격파와 물질이 빠르게 퍼짐':'바깥층 방출 · 중심핵 노출'},
            {id:'remnant',name:large?(remnant==='black-hole'?'블랙홀':'중성자별'):'백색왜성',description:large?(remnant==='black-hole'?'남은 중심핵이 충분히 무거우면 계속 붕괴해 블랙홀이 될 수 있습니다. 검은 원은 빛도 탈출하지 못하는 영역을 나타냅니다.':'남은 중심핵은 매우 작고 밀도가 큰 중성자별이 될 수 있습니다. 별의 처음 질량뿐 아니라 질량 손실 등도 마지막 상태에 영향을 줍니다.'):'남은 작은 중심핵이 백색왜성입니다. 새로운 핵융합으로 에너지를 만들기보다 남은 열을 내보내며 아주 오랜 시간에 걸쳐 식습니다.',energy:large?(remnant==='black-hole'?'사건의 지평선 안에서 빛도 탈출 불가':'밀도가 큰 중심핵이 남음'):'남은 열 방출 · 장기간 냉각',change:'방출된 물질은 성간 공간으로 퍼짐'}];
    }
    const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
    const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
    const mix=(a,b,x)=>a+(b-a)*smooth(x);
    function sample(progress,mass='sun',remnant='neutron'){
        const t=clamp(Number(progress)||0),large=mass==='massive';
        let index=bounds.findIndex((b,i)=>i<6 && t>=b && t<bounds[i+1]);
        if(index<0)index=5;
        const u=clamp((t-bounds[index])/(bounds[index+1]-bounds[index]));
        const mainR=large?65:46,giantR=large?184:142,finalR=large?(remnant==='black-hole'?17:7):11;
        let radius,cloud=0,cloudSize=0,shell=0,burst=0,red=0;
        if(index===0){radius=mix(0,9,u);cloud=1;cloudSize=mix(235,108,u);}
        if(index===1){radius=mix(9,mainR,u);cloud=1-smooth(u);cloudSize=mix(108,38,u);}
        if(index===2)radius=mainR;
        if(index===3){radius=mix(mainR,giantR,u);red=smooth(u);}
        if(index===4){
            red=1;shell=smooth(u);
            if(large){radius=mix(giantR,finalR,clamp(u/.28));burst=Math.sin(Math.PI*clamp((u-.12)/.7))**2;}
            else radius=mix(giantR,finalR,clamp(u/.55));
        }
        if(index===5){radius=finalR;shell=1;}
        return {t,index,u,large,radius,mainR,giantR,cloud,cloudSize,shell,burst,red,remnant,stage:stages(mass,remnant)[index]};
    }
    const api={bounds,stages,sample,clamp,smooth,mix};
    if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StellarEvolution=api;
})(typeof window!=='undefined'?window:globalThis);
