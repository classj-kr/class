document.querySelectorAll('.quiz-card').forEach(card=>{
 card.querySelector('.answer-button').addEventListener('click',()=>{
  const picked=card.querySelector('input:checked'),feedback=card.querySelector('.answer-result');
  if(!picked){feedback.textContent='답을 먼저 선택하세요.';return;}
  const right=picked.value===card.dataset.answer;
  feedback.textContent=right?'정답입니다.':'다시 생각해 보세요.';
  card.querySelector('.answer-explanation').hidden=!right;
 });
});
