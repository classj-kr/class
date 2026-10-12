// Recover publisher heading layouts missed by the original "…하기" screen.
// These are review candidates, never independent/required experiment verdicts.
const clean=s=>s.replace(/[\u0000-\u001f]/g,'').trim();
const ending=/(?:하기|해\s*보기|알아보기|찾아보기|살펴보기|만들기|나타내기|소리\s*내기|재\s*보기)$/;
function extraHeadings(text){
 const lines=text.split(/\r?\n/).map(clean).filter(Boolean),compact=text.replace(/\s|[\u0000-\u001f]/g,'');
 const results=new Map(),add=(title,method)=>{title=title.replace(/\s+/g,' ').trim().replace(/^함께\s*해\s*봐요\s*\d*\s*/,'');if(title.length<7||title.length>85||/^\d+[. )]|^[•➡]/.test(title)||/^(?:준비|목표|탐구과정|과정및|결론|스스로|배운내용)/.test(title)||!ending.test(title))return;results.set(title,method);};
 // Elementary Cheonjae headings are enclosed in two standalone 탐구 labels;
 // long titles can occupy more than one line and supplies say 준비해요.
 for(let i=0;i<lines.length;i++)if(lines[i]==='탐구')for(let n=1;n<=3&&i+n+1<lines.length;n++){
  if(lines[i+n+1]==='탐구'){add(lines.slice(i+1,i+n+1).join(' '),'탐구 표제 경계');break;}
 }
 // Other publishers also use 만들기/나타내기 rather than 하기.
 if(/준비물|준비해요|준비하기|탐구설계|탐구수행|문제인식|활동목표|함께해봐요/.test(compact)){
  for(const line of lines)if(ending.test(line))add(line,'준비·절차가 있는 쪽의 활동형 제목');
  for(let i=1;i<lines.length;i++)if(/^(?:설계하고\s*수행하기|설계[·ㆍ]\s*수행하기)$/.test(lines[i])&&/실험(?:을)?$/.test(lines[i-1]))add(lines[i-1]+' '+lines[i],'실험 설계 표제의 줄바꿈');
 }
 // Do not duplicate a wrapped heading as its final fragment on the same page.
 const compactTitle=s=>s.replace(/\s+/g,'');
 return [...results].filter(([title])=>![...results.keys()].some(other=>other!==title&&compactTitle(other).endsWith(compactTitle(title)))).map(([title,method])=>({title,method}));
}
module.exports={extraHeadings};
