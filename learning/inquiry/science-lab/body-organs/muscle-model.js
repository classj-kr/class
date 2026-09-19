(() => {
 const drawing=document.getElementById('muscleDrawing'),bend=document.getElementById('bendArm'),straight=document.getElementById('straightArm');
 function show(flexed){
  const angle=(flexed?-30:90)*Math.PI/180,x=220+105*Math.cos(angle),y=165+105*Math.sin(angle);
  const ax=220+28*Math.cos(angle),ay=165+28*Math.sin(angle),bx=220-18*Math.cos(angle),by=165-18*Math.sin(angle);
  drawing.innerHTML=`<line x1="220" y1="45" x2="220" y2="165" stroke="#b4c2ce" stroke-width="17" stroke-linecap="round"/><line x1="220" y1="165" x2="${x}" y2="${y}" stroke="#b4c2ce" stroke-width="17" stroke-linecap="round"/><line x1="199" y1="72" x2="${ax}" y2="${ay}" stroke="#c85d42" stroke-width="${flexed?14:7}" stroke-linecap="round"/><line x1="244" y1="70" x2="${bx}" y2="${by}" stroke="#49799c" stroke-width="${flexed?7:14}" stroke-linecap="round"/><circle cx="220" cy="165" r="11" fill="#fff" stroke="#657d8f" stroke-width="3"/><text x="20" y="45" fill="#173f50">${flexed?'팔을 굽힘':'팔을 폄'}</text><text x="20" y="78" fill="#a43d26">굽히는 근육: ${flexed?'짧아짐':'늘어남'}</text><text x="20" y="108" fill="#305e80">펴는 근육: ${flexed?'늘어남':'짧아짐'}</text><text x="240" y="190" fill="#173f50">관절</text><text x="20" y="300" fill="#173f50">뼈의 길이는 두 경우 모두 같습니다.</text>`;
  bend.setAttribute('aria-pressed',String(flexed));straight.setAttribute('aria-pressed',String(!flexed));
  document.getElementById('muscleObservation').textContent=flexed?'굽히는 근육이 수축하여 뼈를 당기면 팔이 관절을 중심으로 굽혀집니다.':'펴는 근육이 수축하여 뼈를 당기면 굽혔던 팔이 펴집니다.';
 }
 bend.addEventListener('click',()=>show(true));straight.addEventListener('click',()=>show(false));show(false);
})();
