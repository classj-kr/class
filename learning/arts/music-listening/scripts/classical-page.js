(()=>{
const {pieces,allQuestions}=window.CLASSICAL_DATA;
const playlist=document.querySelector('#playlist');
const periods=document.querySelector('#classical-periods');
const eraPanel=document.querySelector('#classical-era-panel');
const dialog=document.querySelector('#detail-dialog');
const detail=document.querySelector('#detail-content');
const eras=[
  {key:'medieval',label:'중세',english:'Medieval',years:'500–1400',story:'교회와 수도원을 중심으로 단선율 성가가 기록되었고, 후기에는 여러 성부가 함께 움직이는 초기 다성음악이 발전했습니다.',sound:'한 줄의 선율 · 교회 선법 · 무반주 성악 · 초기 다성음악',question:'한 사람이 부르는 듯한 선율과 여러 성부가 겹치는 부분의 차이를 들어 보세요.'},
  {key:'renaissance',label:'르네상스',english:'Renaissance',years:'1400–1600',story:'인쇄술과 궁정 문화의 확산으로 음악이 널리 보급되었고, 여러 성부가 균형 있게 이어지는 합창 음악과 세속 노래가 성장했습니다.',sound:'모방 대위법 · 균형 잡힌 성부 · 합창 · 세속 성악',question:'같은 선율이 서로 다른 성부에서 시간차를 두고 나타나는지 찾아보세요.'},
  {key:'baroque',label:'바로크',english:'Baroque',years:'1600–1750',story:'오페라가 탄생하고 조성 체계가 자리 잡았습니다. 궁정과 교회에서 협주곡·모음곡·푸가가 발전하며 화려한 장식과 강한 대비가 중요해졌습니다.',sound:'통주저음 · 장식음 · 대위법 · 독주와 합주의 대비',question:'반복되는 저음 위에서 선율이 장식되고, 독주와 합주가 주고받는 방식을 들어 보세요.'},
  {key:'classical',label:'고전주의',english:'Classical',years:'1750–1820',story:'공공 연주회와 시민 문화가 성장하면서 교향곡·소나타·현악 사중주가 확립되었습니다. 짧고 분명한 동기와 균형 잡힌 형식이 중심이 되었습니다.',sound:'명료한 선율 · 주제 대비 · 소나타 형식 · 균형',question:'짧은 동기가 반복·변형되며 큰 악장 전체를 만드는 과정을 따라가 보세요.'},
  {key:'romantic',label:'낭만주의',english:'Romantic',years:'1820–1900',story:'개인의 감정과 문학·자연·민족의 이야기를 표현하며 관현악의 규모와 음색이 확장되었습니다. 짧은 소품부터 거대한 교향곡까지 공존했습니다.',sound:'넓은 셈여림 · 유연한 빠르기 · 표제성 · 확대된 관현악',question:'속도와 음량, 악기 음색의 변화가 감정이나 장면을 어떻게 그리는지 들어 보세요.'},
  {key:'modern',label:'현대·동시대',english:'Modern & Contemporary',years:'1900–현재',story:'전통 조성과 박자의 규칙을 새롭게 바라보며 인상주의·원시주의·재즈의 영향과 전자음향 등 다양한 언어가 공존하게 되었습니다.',sound:'새로운 화성 · 불규칙한 박자 · 음색 실험 · 장르의 교류',question:'익숙한 조성과 박자에서 벗어난 부분이 긴장·색채·움직임을 어떻게 만드는지 들어 보세요.'}
];
let activeEra='baroque';

function player(piece){
  if(!piece.audio)return `<a href="${piece.url}" target="_blank" rel="noopener">찾아 듣기</a>`;
  const revision=piece.audio.revision?`?v=${encodeURIComponent(piece.audio.revision)}`:'';
  return `<audio aria-label="${piece.title} 듣기" controls controlsList="nodownload noplaybackrate" preload="none" src="../../assets/audio/classical/${piece.audio.file}${revision}"></audio>`;
}
function renderCards(era=activeEra){
  const cards=pieces.filter(piece=>era==='all'||piece.era===era);
  playlist.innerHTML=cards.length?cards.map(piece=>`<article class="piece"><p class="meta">${piece.period} · ${piece.form}</p><h3>${piece.title}</h3><p class="original">${piece.originalTitle}</p><p class="artist">${piece.composer} · ${piece.year}</p><p class="point">${piece.feature}</p><div class="actions">${player(piece)}<button data-piece="${piece.no}">자세한 해설</button></div></article>`).join(''):`<p class="empty-state">현재 50곡 감상 목록은 바로크 이후 작품으로 구성되어 있습니다. 이 시대의 역사적 특징을 먼저 살펴보세요.</p>`;
  playlist.querySelectorAll('[data-piece]').forEach(button=>button.addEventListener('click',()=>openDetail(button.dataset.piece)));
}
// 'play' doesn't bubble on <audio>, so listen in the capture phase to catch it from any card.
document.addEventListener('play',event=>{
  if(event.target.tagName!=='AUDIO')return;
  document.querySelectorAll('#playlist audio, #quiz-box audio').forEach(audio=>{if(audio!==event.target)audio.pause()});
},true);
function renderEra(key=activeEra){
  activeEra=key;
  const era=eras.find(item=>item.key===key);
  const count=pieces.filter(piece=>piece.era===key).length;
  periods.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button.dataset.era===key));
  eraPanel.innerHTML=`<div class="years">${era.years}</div><div><h3>${era.label}<small>${era.english}</small></h3><p>${era.story}</p><p class="turn"><strong>음악적으로 듣기:</strong> ${era.sound}</p><p class="integrated-question"><strong>들으며 생각하기:</strong> ${era.question}</p>${count?`<b class="integrated-count">대표곡 ${count}개</b>`:''}</div>`;
  renderCards(key);
}
function openDetail(no){const piece=pieces.find(item=>item.no===no);detail.innerHTML=`<p class="kind">${piece.period} · ${piece.form}</p><h2>${piece.title}</h2><p class="original">${piece.originalTitle} · ${piece.composer}</p><section><h3>시대와 작품</h3><p>${piece.story}</p></section><section><h3>음악적 특징</h3><p>${piece.feature}</p></section><section><h3>감상 포인트</h3><p>${piece.note}</p></section>${piece.audio&&piece.audio.note?`<section><h3>이 녹음에 대해</h3><p>${piece.audio.performer}. ${piece.audio.note}</p></section>`:''}${piece.audio?`<p><a href="../../assets/audio/classical/credits.html#recording-${piece.no}" target="_blank" rel="noopener">녹음·이용 정보</a></p>`:''}`;dialog.showModal()}
periods.innerHTML=eras.map(era=>`<li><button type="button" data-era="${era.key}"><b>${era.label}</b><small>${era.english}<br>${era.years}</small></button></li>`).join('');
periods.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>renderEra(button.dataset.era)));
dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.dialog-close'))dialog.close()});

let current=[];
const quizBox=document.querySelector('#quiz-box');
function shuffle(items){return [...items].map(value=>({value,order:Math.random()})).sort((a,b)=>a.order-b.order).map(item=>item.value)}
function balancedQuestions(pool,count){const groups=['meter','tempo','mood','feature'].map(key=>shuffle(pool.filter(question=>question.key===key)));const picked=[];for(let round=0;picked.length<count;round++){for(const group of groups){if(group[round])picked.push(group[round]);if(picked.length===count)break}}return shuffle(picked)}
document.querySelector('#new-quiz').addEventListener('click',()=>{const era=document.querySelector('#quiz-era').value;const count=Number(document.querySelector('#quiz-count').value);const pool=allQuestions.filter(question=>era==='all'||question.piece.era===era);current=balancedQuestions(pool,count);quizBox.innerHTML=current.map((question,index)=>`<fieldset><legend><span>${index+1}</span>${question.stem}</legend><div class="quiz-piece"><span class="quiz-work"><strong>${question.piece.title}</strong><small>${question.piece.originalTitle} · ${question.piece.composer}</small></span>${player(question.piece)}</div>${question.choices.map((choice,choiceIndex)=>`<label><input type="radio" name="q${index}" value="${choiceIndex}"><span>${choice}</span></label>`).join('')}<p class="feedback" hidden></p></fieldset>`).join('');document.querySelector('.quiz-actions').hidden=false;document.querySelector('#quiz-result').textContent=''});
document.querySelector('#check-answer').addEventListener('click',()=>{let correct=0;current.forEach((question,index)=>{const field=quizBox.querySelectorAll('fieldset')[index];const selected=field.querySelector('input:checked');const ok=selected&&Number(selected.value)===question.correct;if(ok)correct++;const feedback=field.querySelector('.feedback');feedback.hidden=false;feedback.textContent=`${ok?'정답입니다.':`정답: ${question.answer}`} ${question.explain}`;field.classList.toggle('correct',!!ok);field.classList.toggle('wrong',!ok)});document.querySelector('#quiz-result').textContent=`${current.length}문제 중 ${correct}문제를 맞혔습니다.`});
renderEra(activeEra);
})();
