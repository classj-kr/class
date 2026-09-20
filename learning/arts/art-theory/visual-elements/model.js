(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VisualElements=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const axes={
 angle:{title:'선의 방향',label:'기울기',min:0,max:90,ends:['수평','수직'],note:'선의 개수·길이·굵기와 선 사이 간격은 같습니다.',prompt:'선을 따라 시선을 움직여 보세요. 방향을 바꾸면 눈이 움직이는 길도 달라지나요?'},
 width:{title:'선의 굵기',label:'굵기',min:2,max:16,ends:['가늘게','굵게'],note:'선의 개수·길이·방향과 중심선 사이 간격은 같습니다.',prompt:'굵은 선과 가는 선 중 어느 쪽이 먼저 눈에 들어오나요? 선 사이의 빈 공간도 비교해 보세요.'},
 shape:{title:'형태',choices:[['circle','원'],['square','사각형'],['triangle','삼각형']],note:'세 도형의 중심 위치와 각각의 면적을 고정하고 윤곽만 바꿉니다.',prompt:'둥근 윤곽과 각진 윤곽을 비교해 보세요. 같은 면적이어도 크기가 다르게 느껴지나요?'},
 size:{title:'크기',label:'길이 비율',min:65,max:120,ends:['작게','크게'],note:'모양과 중심 위치는 같습니다. 가로·세로 길이를 함께 바꿉니다.',prompt:'도형이 커지면 도형 사이의 빈 공간은 어떻게 달라지나요?'},
 texture:{title:'질감',choices:[['plain','민무늬'],['grain','입자'],['hatch','빗금']],note:'모양·크기·위치는 같습니다. 표면에 보이는 무늬만 바꿉니다.',prompt:'각 표면을 만지면 어떤 느낌일지 떠올려 보세요. 여기서는 실제 촉감이 아닌 눈으로 보는 질감을 비교합니다.'}
};
const defaults=()=>({angle:0,width:4,shape:'circle',size:100,texture:'plain'});
function change(reference,axis,value){
 const spec=axes[axis];if(!spec)throw new RangeError('Unknown axis');
 let next=value;
 if(spec.choices){if(!spec.choices.some(([key])=>key===value))throw new RangeError('Unknown choice');}
 else {if(!Number.isFinite(Number(value)))throw new RangeError('Invalid value');next=Math.max(spec.min,Math.min(spec.max,Math.round(Number(value))));}
 return {...reference,[axis]:next};
}
function valueText(state,axis){if(axes[axis].choices)return axes[axis].choices.find(([key])=>key===state[axis])[1];return axis==='angle'?state.angle+'°':axis==='size'?state.size+'%':state.width+'단계';}
function geometry(shape,size){
 const area=76*76*(size/100)**2;
 if(shape==='circle')return {tag:'circle',attrs:{cx:0,cy:0,r:Math.sqrt(area/Math.PI)}};
 if(shape==='square'){const side=Math.sqrt(area);return {tag:'rect',attrs:{x:-side/2,y:-side/2,width:side,height:side}};}
 if(shape!=='triangle')throw new RangeError('Unknown shape');
 const side=Math.sqrt(4*area/Math.sqrt(3)),height=side*Math.sqrt(3)/2;
 return {tag:'polygon',attrs:{points:`0,${-height*2/3} ${side/2},${height/3} ${-side/2},${height/3}`}};
}
function scene(state,axis,id){
 if(axis==='angle'||axis==='width')return `<g transform="rotate(${-state.angle} 190 170)" stroke="#536b5b" stroke-width="${state.width}" stroke-linecap="butt">${Array.from({length:7},(_,i)=>`<line x1="90" y1="${98+i*24}" x2="290" y2="${98+i*24}"/>`).join('')}</g>`;
 const pattern=id+'-texture';
 const marks=state.texture==='grain'?'<circle cx="3" cy="4" r="1.6"/><circle cx="10" cy="12" r="2"/><circle cx="13" cy="3" r="1"/><circle cx="3" cy="13" r=".8"/>':'<path d="M-4 4L4 -4 M0 16L16 0 M12 20L20 12" fill="none" stroke="#536b5b" stroke-width="2"/>';
 const defs=state.texture==='plain'?'':`<defs><pattern id="${pattern}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#cbd1c4"/><g fill="#536b5b">${marks}</g></pattern></defs>`;
 const shape=geometry(state.shape,state.size),attrs=Object.entries(shape.attrs).map(([key,value])=>`${key}="${value}"`).join(' ');
 return defs+`<g fill="${state.texture==='plain'?'#536b5b':`url(#${pattern})`}">${[[116,126],[264,118],[202,250]].map(([x,y])=>`<${shape.tag} ${attrs} transform="translate(${x} ${y})"/>`).join('')}</g>`;
}
return {axes,defaults,change,valueText,geometry,scene};
});
