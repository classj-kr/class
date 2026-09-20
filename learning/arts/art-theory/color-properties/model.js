(function(root){
  'use strict';
  // OKLCH -> Oklab -> linear sRGB. The controls stay inside the sRGB gamut;
  // no hidden clipping or chroma reduction changes the other attributes.
  const hues=[{name:'빨강',angle:29},{name:'주황',angle:65},{name:'노랑',angle:100},{name:'초록',angle:145},{name:'청록',angle:195},{name:'파랑',angle:250},{name:'보라',angle:300},{name:'자주',angle:345}];
  const base=h=>({h,l:65,c:32});
  function linear(color){
    const L=color.l/100,C=color.c/400,h=hues[color.h].angle*Math.PI/180;
    const a=C*Math.cos(h),b=C*Math.sin(h);
    const l=(L+.3963377774*a+.2158037573*b)**3;
    const m=(L-.1055613458*a-.0638541728*b)**3;
    const s=(L-.0894841775*a-1.291485548*b)**3;
    return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.7076147010*s];
  }
  const inGamut=color=>linear(color).every(v=>v>=-1e-7&&v<=1+1e-7);
  function rgb(color){
    const values=linear(color);
    if(!inGamut(color))throw new RangeError('Color is outside the lesson display range');
    return values.map(v=>Math.round(255*(v<=.0031308?12.92*v:1.055*v**(1/2.4)-.055)));
  }
  const css=color=>`rgb(${rgb(color).join(', ')})`;
  function bounds(axis,reference){
    if(axis==='h')return {min:0,max:hues.length-1};
    const valid=Array.from({length:101},(_,value)=>value).filter(value=>inGamut({...reference,[axis]:value}));
    return {min:valid[0],max:valid.at(-1)};
  }
  function change(reference,axis,value){
    if(!['h','l','c'].includes(axis))throw new Error('Unknown attribute');
    const range=bounds(axis,reference);
    return {...reference,[axis]:Math.max(range.min,Math.min(range.max,Math.round(Number(value)||0)))};
  }
  const tasks=[
    {axis:'l',target:{h:5,l:80,c:32},hint:'색의 종류보다 밝고 어두운 정도를 비교해 보세요.'},
    {axis:'c',target:{h:5,l:65,c:4},hint:'밝기는 비슷합니다. 어느 쪽이 회색에 더 가까운지 보세요.'},
    {axis:'h',target:{h:3,l:65,c:32},hint:'밝기와 선명함보다 색의 종류를 비교해 보세요.'}
  ];
  const matches=(actual,target)=>actual.h===target.h&&Math.abs(actual.l-target.l)<=1&&Math.abs(actual.c-target.c)<=1;
  const api={hues,base,linear,inGamut,rgb,css,bounds,change,tasks,matches};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ColorProperties=api;
})(globalThis);
