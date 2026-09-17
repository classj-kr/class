const lessons={ko:[['학교','친구','하늘','바다','나무','사과','구름','마음','고양이','무지개']],en:[['school','friend','happy','apple','green','music','family','water','smile','morning']]};
lessons.symbols=[['26453','2026','100%','10+20=30','7*8=56','A+','^_^','ㅠㅠ','!!','?!']];
const wordPools={ko:[...lessons.ko[0]],en:[...lessons.en[0]],symbols:buildSymbolWordPool()};
const englishMeanings=new Map();
const proverbBanks=window.PROVERB_BANKS||{ko:[],en:[]};
const proverbKoSentences=proverbBanks.ko.map(item=>item.proverb);
const proverbEnSentences=proverbBanks.en.map(item=>item.proverb).map(text=>text.toLowerCase().replace(/!/g,'.'));
const proverbEnLiterals=new Map(proverbBanks.en.map(item=>[item.proverb.toLowerCase().replace(/!/g,'.'),item.literal]));
const sentencePools={ko:[...proverbKoSentences],en:[...proverbEnSentences]};
function buildSymbolWordPool(){const values=new Set(['26453','2026','1004','^_^','!!','!@#','^^','1,000','3.14','12345','98765','13579','24680']),samples=[1,2,5,10,20,25,50,75,100,1000];for(const n of samples){values.add(`${n}%`);values.add(`$${n}`);values.add(`(${n})`);values.add(`[${n}]`)}for(let n=1;n<=15;n++){values.add(`${n}+${n}=${n*2}`);values.add(`${n*2}-${n}=${n}`);values.add(`${n}*${n}=${n*n}`)}for(const pair of ['A&B','R&D','Q&A','1&2','3&4','5&6','7&8','9&10','10&20','100&200'])values.add(pair);for(const expression of ['$10,000.00','($100+250)','(12+34)*56','[1234+5678]','1000&(2000)','(25*40)=1000','5000-1250=3750','20%+$400=420','(100+200)*3','[50%&$1000]','$2500+(25%)','(7+8)*(9-3)'])values.add(expression);return [...values]}
function collectKoreanWords(text){const blocked=new Set(['다음','문제','정답','보기','선택','설명','알맞은','고르세요','문장','질문','내용','해설','단계','학습','자료','문항','예시','입력']);return text.match(/[가-힣]{2,6}/g)?.filter(word=>!blocked.has(word))||[]}
function decodeJsString(value){try{return JSON.parse(`"${value}"`)}catch{return value}}
function collectSpellingAnswers(text){const objectAnswers=[...text.matchAll(/\banswer:\s*"((?:\\.|[^"\\])*)"/g)],factoryAnswers=[...text.matchAll(/makeQuestion\(\s*"(?:\\.|[^"\\])*"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)];return [...objectAnswers,...factoryAnswers].map(match=>decodeJsString(match[1])).filter(word=>/^[\uAC00-\uD7A3]{2,6}$/.test(word))}
function conciseEnglishMeaning(item){const raw=String(item.meanings?.[0]||'').replace(/^<[^>]+>\s*/,'').replace(/^\[[^\]]+\]\s*/,'').replace(/^\([^)]*\)\s*/,'').split(/[.;]/)[0].replace(/\s+/g,' ').trim();return raw.slice(0,32)}
async function loadWordPools(){try{const spellingPaths=['/learning/literacy-numeracy/spelling/questions.js','/learning/literacy-numeracy/spelling/questions-extra.js'],readingPaths=['/game-hub-server/data/reading-self-study-ko-v1.json'],[vocabulary,...responses]=await Promise.all([fetch('/learning/literacy-numeracy/vocabulary/assets/data/english-vocabulary-3000-v2.json').then(response=>response.json()),...spellingPaths.map(path=>fetch(path).then(response=>response.text())),...readingPaths.map(path=>fetch(path).then(response=>response.text()))]),spellingResponses=responses.slice(0,spellingPaths.length),readingResponses=responses.slice(spellingPaths.length),english=vocabulary.words.filter(item=>item.stageCode==='elementary'&&/^[a-zA-Z]+$/.test(item.word)&&item.word.length>=2&&item.word.length<=12).map(item=>item.word.toLowerCase());for(const item of vocabulary.words){const meaning=conciseEnglishMeaning(item);if(meaning)englishMeanings.set(item.word.toLowerCase(),meaning)}wordPools.en=[...new Set(english)];wordPools.ko=[...new Set([...spellingResponses.flatMap(collectSpellingAnswers),...readingResponses.flatMap(collectKoreanWords)])].filter(word=>word.length<=5);return true}catch(error){console.warn('Typing practice source load failed.',error);return false}}
const wordBankReady=loadWordPools();
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const avatarItems=Array.isArray(window.typingAvatarItems)?window.typingAvatarItems:[],avatarByAnswer=new Map(avatarItems.map(item=>[item.answer,item]));
const state={lang:'ko',level:0,mode:'words',filter:'all',items:[],index:0,start:0,typed:0,correct:0,totalTyped:0,totalCorrect:0,streak:0,speeds:[],activeMs:0,sound:true,sfxVolume:.6,locked:false};
const typingSessionKey='typing-current-session-v5';
const typingRecordsKey='typing-records-v1';
function readTypingSession(){try{return JSON.parse(localStorage.getItem(typingSessionKey)||'null')}catch{return null}}
function writeTypingSession(session){try{localStorage.setItem(typingSessionKey,JSON.stringify(session))}catch{}}
function readTypingRecords(){try{return JSON.parse(localStorage.getItem(typingRecordsKey)||'{}')}catch{return{}}}
function mergeDifficultyRecords(){const legacy=/-(easy|normal|hard)$/;const records=readTypingRecords();let changed=false;for(const [id,record] of Object.entries(records)){if(!legacy.test(id))continue;const target=id.replace(legacy,'-all'),previous=records[target]||{};records[target]={...previous,mode:record.mode,lang:record.lang,filter:'all',bestSpeed:Math.max(previous.bestSpeed||0,record.bestSpeed||0),bestAccuracy:Math.max(previous.bestAccuracy||0,record.bestAccuracy||0),completions:(previous.completions||0)+(record.completions||0),lastDate:[previous.lastDate,record.lastDate].filter(Boolean).sort().pop()||new Date().toISOString()};delete records[id];changed=true}try{if(changed)localStorage.setItem(typingRecordsKey,JSON.stringify(records));const keys=[];for(let index=0;index<localStorage.length;index++){const name=localStorage.key(index);if(name&&/^typing-(best|recent)-.*-(easy|normal|hard)$/.test(name))keys.push(name)}for(const name of keys){if(name.startsWith('typing-best-')){const target=name.replace(legacy,'-all');localStorage.setItem(target,String(Math.max(Number(localStorage.getItem(target)||0),Number(localStorage.getItem(name)||0))))}localStorage.removeItem(name)}}catch{}}
function writeTypingRecord(id,record){const records=readTypingRecords(),previous=records[id]||{};records[id]={...previous,...record,bestSpeed:Math.max(previous.bestSpeed||0,record.bestSpeed||0),bestAccuracy:Math.max(previous.bestAccuracy||0,record.bestAccuracy||0),completions:(previous.completions||0)+(record.addCompletion?1:0),lastDate:new Date().toISOString()};delete records[id].addCompletion;try{localStorage.setItem(typingRecordsKey,JSON.stringify(records))}catch{}}
function updateHomeContinue(){const saved=readTypingSession(),records=Object.values(readTypingRecords()),completedModes=new Set(records.map(record=>record.mode));$$('.practice-menu em').forEach(label=>label.remove());completedModes.forEach(mode=>{const button=$(`[data-practice-mode="${mode}"]`);if(button)button.insertAdjacentHTML('beforeend','<em class="completed">완료</em>')});if(saved&&!saved.completed){const button=$(`[data-practice-mode="${saved.mode}"]`);button?.querySelector('em')?.remove();if(button)button.insertAdjacentHTML('beforeend','<em>이어하기</em>')}}
function savePracticeSession(){if(!['words','sentences'].includes(state.mode)||!state.items.length)return;writeTypingSession({mode:state.mode,lang:state.lang,filter:state.filter,items:state.items,index:state.index,completed:false})}
function recordLabel(record){const modes={position:'자리 익히기',words:'단어 연습',sentences:'문장 연습'},langs={ko:'한글',en:'영어',symbols:'숫자·기호',avatars:'아바타'},filters={animal:'동물',food:'과일·채소·음식',object:'사물'};return[modes[record.mode],langs[record.lang],record.stage||filters[record.filter]].filter(Boolean).join(' · ')}
function renderRecords(){const records=Object.values(readTypingRecords()).filter(record=>record.mode!=='paragraphs').sort((a,b)=>String(b.lastDate).localeCompare(String(a.lastDate))),box=$('#recordsList');if(!records.length){box.innerHTML='<p class="records-empty">저장된 기록이 없습니다.</p>';return}box.innerHTML=records.map(record=>`<div class="record-row"><strong>${recordLabel(record)}</strong>${record.mode==='position'?'':`<span>최고 ${record.bestSpeed||0}타/분</span><span>정확도 ${record.bestAccuracy||0}%</span>`}<span>완료 ${record.completions||0}회</span><span>${new Date(record.lastDate).toLocaleDateString('ko-KR')}</span></div>`).join('')}
function openRecords(){$('#typingHome').hidden=true;$('#fingerGuide').hidden=true;$('.practice').hidden=true;$('#resultCard').hidden=true;$('#recordsCard').hidden=false;renderRecords()}
const fingerNames={lp:'왼손 새끼손가락',lr:'왼손 약손가락',lm:'왼손 가운데손가락',li:'왼손 검지',ri:'오른손 검지',rm:'오른손 가운데손가락',rr:'오른손 약손가락',rp:'오른손 새끼손가락','rr-rp':'오른손의 편한 손가락'};
const keyboardRows=[[['`','`','lp','`','~'],['1','1','lp','1','!'],['2','2','lr','2','@'],['3','3','lm','3','#'],['4','4','li','4','$'],['5','5','li','5','%'],['6','6','ri','6','^'],['7','7','ri','7','&'],['8','8','rm','8','*'],['9','9','rr','9','('],['0','0','rp','0',')'],['-','-','rp','-','_'],['=','=','rp','=','+']],[['Q','ㅂ','lp'],['W','ㅈ','lr'],['E','ㄷ','lm'],['R','ㄱ','li'],['T','ㅅ','li'],['Y','ㅛ','ri'],['U','ㅕ','ri'],['I','ㅑ','rm'],['O','ㅐ','rr'],['P','ㅔ','rr-rp']],[['A','ㅁ','lp'],['S','ㄴ','lr'],['D','ㅇ','lm'],['F','ㄹ','li'],['G','ㅎ','li'],['H','ㅗ','ri'],['J','ㅓ','ri'],['K','ㅏ','rm'],['L','ㅣ','rr']],[['Shift','⇧ Shift','lp','shift-left'],['Z','ㅋ','lp'],['X','ㅌ','lr'],['C','ㅊ','lm'],['V','ㅍ','li'],['B','ㅠ','li'],['N','ㅜ','ri'],['M','ㅡ','ri'],['Shift','⇧ Shift','rp','shift-right']]];
const baseGuideOrder=['f','j','d','k','s','l','a','g','h','r','u','e','i','w','o','q','p','t','y','v','m','c','x','z','b','n'];
const koreanShiftGuide=['shift-right+q','shift-right+w','shift-right+e','shift-right+r','shift-right+t','shift-left+o','shift-left+p'];
const baseSymbolGuide=['1','2','3','4','5','6','7','8','9','0'];
const shiftedSymbolGuide=[...['`','1','2','3','4','5'].map(key=>`shift-right+${key}`),...['6','7','8','9','0','-','='].map(key=>`shift-left+${key}`)];
const shiftedSymbols={'`':'~','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')','-':'_','=':'+'};
const shiftedKorean={q:'ㅃ',w:'ㅉ',e:'ㄸ',r:'ㄲ',t:'ㅆ',o:'ㅒ',p:'ㅖ'};
const leftHandLetters=[...'qwertasdfgzxcvb'],rightHandLetters=[...'yuiophjklnm'];
const guideStages={
  ko:[
    {label:'기본 자리',items:['f','j','d','k','s','l','a','g','h'],wordNote:'기본 자리만 사용해요'},
    {label:'윗글쇠',items:['q','w','e','r','t','y','u','i','o','p'],wordNote:'기본 자리와 윗글쇠를 함께 사용해요'},
    {label:'아랫글쇠',items:['z','x','c','v','b','n','m'],wordNote:'배운 모든 자리를 함께 사용해요'},
    {label:'받침 넣기',items:[],wordNote:'배운 자리에 받침을 더해요'},
    {label:'Shift',items:[...koreanShiftGuide],wordNote:'반대쪽 Shift와 함께 사용해요'}
  ],
  en:[
    {label:'기본 자리',items:['f','j','d','k','s','l','a','g','h'],wordNote:'기본 자리만 사용해요'},
    {label:'윗글쇠',items:['q','w','e','r','t','y','u','i','o','p'],wordNote:'기본 자리와 윗글쇠를 함께 사용해요'},
    {label:'아랫글쇠',items:['z','x','c','v','b','n','m'],wordNote:'배운 모든 자리를 함께 사용해요'},
    {label:'대문자',items:[],wordNote:'반대쪽 Shift와 함께 사용해요'}
  ],
  symbols:[
    {label:'숫자',items:[...baseSymbolGuide]},
    {label:'특수문자',items:[...shiftedSymbolGuide]}
  ]
};
const guideWordBanks={
  'ko-0':['나','너','나이','아이','오이','이마','나라','하나','하마','머리','미리','아마','어머니','오리','미나리','아리아','이모','이리','오라','나아','모아'],
  'ko-1':['가지','바다','사자','여자','가게','기러기','개미','도서','보리','세모','소리','고리','가요','자요','모자','바지','다리','아버지','나비','사과','지도','이야기','해바라기','도리','제비'],
  'ko-2':['우유','치마','나무','토마토','포도','기차','구두','주머니','부추','치즈','크기','흐리다','파도','쿠키','타조','바구니','비누','고무','유리','튜브','피아노','무지개','두부','카메라','마루','메추리','호두'],
  'ko-3':['산','달','강','학교','친구','공원','마음','구름','바람','연필','책상','창문','운동장','선생님','학생','동물','식물','햇살','봄날','가을','겨울','숲길','별빛','약속','생각','웃음','도서관','놀이터','고양이','강아지','앉다','읽다','없다','젊다','닭장','값어치'],
  'ko-4':['아빠','오빠','토끼','어깨','꼬리','까치','쓰기','씨앗','짜다','찌개','예쁘다','똑똑','빨리','쏘다','떡','꿈','깨끗이','꼭대기','쑥쑥','짝꿍','뛰다','따뜻하다','씩씩하다','반짝이다','깜짝','얘기','걔네','쟤네'],
  'en-0':['sad','dad','fall','glass','flag','ask','hall','half','salad','flash','glad','dash','hash','shall','flask','salsa','saga','jag','lag','gas','ash','fad','lash','gall','add'],
  'en-1':['write','quiet','type','read','tree','water','paper','yellow','writer','reader','light','right','little','story','house','earth','idea','radio','star','flower','fruit','horse','turtle','people','please','share','repeat','square','weather','today'],
  'en-2':['mix','zinc','van','book','music','green','friend','family','smile','morning','pencil','class','number','window','garden','planet','animal','bright','cloud','river','market','picnic','jungle','basket','computer','village','blanket','orange','silver','winter'],
  'symbols-0':['26453','2026','1004','365','12345','98765','1010','777','8282','10000','24','60','12','31415','5050','8080','119','112','20260802','13579','24680','100','99'],
  'symbols-1':['100%','^_^','!!','!@#','10+20=30','7*8=56','5-2=3','1+1=2','50%','3^2=9','(1+2)','(5-3)','1_2','$5','$10','#1','#2','@1','~1~','99%','2*3=6','4+5=9','6-1=5','100+200','1+2+3','(10)','5%','7&8']
};
let guideLang='ko',guideStage=0,guideIndex=0,guideWordKeyIndex=0,currentGuideOrder=null,virtualShift='',englishShiftGuide=[];
function saveGuideSession(nextStage=false){if($('#fingerGuide')?.hidden)return;const stages=guideStages[guideLang],last=guideStage>=stages.length-1;if(nextStage&&last)return writeTypingSession({mode:'position',completed:true});writeTypingSession({mode:'position',guideLang,guideStage:nextStage?guideStage+1:guideStage,guideIndex:nextStage?0:guideIndex,guideWordKeyIndex:nextStage?0:guideWordKeyIndex,order:nextStage?null:currentGuideOrder,completed:false})}
const koInitial=['r','R','s','e','E','f','a','q','Q','t','T','d','w','W','c','z','x','v','g'];
const koMedial=['k','o','i','O','j','p','u','P','h','hk','ho','hl','y','n','nj','np','nl','b','m','ml','l'];
const koFinal=['','r','R','rt','s','sw','sg','e','f','fr','fa','fq','ft','fx','fv','fg','a','q','qt','t','T','d','w','c','z','x','v','g'];
const koJamoKeys={'ㅠ':'b','ㅋ':'z'};
const koreanKeyLabels={r:'ㄱ',R:'ㄲ',s:'ㄴ',e:'ㄷ',E:'ㄸ',f:'ㄹ',a:'ㅁ',q:'ㅂ',Q:'ㅃ',t:'ㅅ',T:'ㅆ',d:'ㅇ',w:'ㅈ',W:'ㅉ',c:'ㅊ',z:'ㅋ',x:'ㅌ',v:'ㅍ',g:'ㅎ',k:'ㅏ',o:'ㅐ',O:'ㅒ',i:'ㅑ',j:'ㅓ',p:'ㅔ',P:'ㅖ',u:'ㅕ',h:'ㅗ',y:'ㅛ',n:'ㅜ',b:'ㅠ',m:'ㅡ',l:'ㅣ'};
const codeChars={Space:' ',Backquote:'`',Period:'.',Comma:',',Slash:'/',Semicolon:';',Quote:"'",Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',NumpadDecimal:'.',NumpadAdd:'+',NumpadSubtract:'-',NumpadMultiply:'*',NumpadDivide:'/',NumpadEqual:'='};
let forcedKeyProgress=0,forcedWrongBuffer='',previousInputLength=0,manualInputUntil=0,audioContext=null;
const input=$('#typingInput'),prompt=$('#prompt'),feedback=$('#feedback');
function keySequenceForChar(char){if(koJamoKeys[char])return koJamoKeys[char];const code=char.charCodeAt(0);if(code>=0xAC00&&code<=0xD7A3){const offset=code-0xAC00,initial=Math.floor(offset/588),medial=Math.floor((offset%588)/28),final=offset%28;return koInitial[initial]+koMedial[medial]+koFinal[final]}return char}
const homeGuideKeys=new Set(['f','j','d','k','s','l','a','g','h']);
const topGuideKeys=new Set(['q','w','e','r','t','y','u','i','o','p']);
const bottomGuideKeys=new Set(['z','x','c','v','b','n','m']);
const plainKoreanGuideKeys=new Set([...homeGuideKeys,...topGuideKeys,...bottomGuideKeys]);
const guideWordRules={
  'ko-0':{allowed:homeGuideKeys,required:homeGuideKeys,final:'forbid',shift:'forbid'},
  'ko-1':{allowed:new Set([...homeGuideKeys,...topGuideKeys]),required:topGuideKeys,final:'forbid',shift:'forbid'},
  'ko-2':{allowed:plainKoreanGuideKeys,required:bottomGuideKeys,final:'forbid',shift:'forbid'},
  'ko-3':{allowed:plainKoreanGuideKeys,final:'require',shift:'forbid'},
  'ko-4':{allowed:plainKoreanGuideKeys,shift:'require'},
  'en-0':{allowed:homeGuideKeys,required:homeGuideKeys},
  'en-1':{allowed:new Set([...homeGuideKeys,...topGuideKeys]),required:topGuideKeys},
  'en-2':{allowed:plainKoreanGuideKeys,required:bottomGuideKeys},
  'symbols-0':{allowed:new Set([...'0123456789'])},
  'symbols-1':{allowed:new Set([...'0123456789`~!@#$%^&*()-_=+']),required:new Set([...'`~!@#$%^&*()-_=+'])}
};
function koreanWordHasFinal(word){return [...word].some(char=>{const code=char.charCodeAt(0);return code>=0xAC00&&code<=0xD7A3&&(code-0xAC00)%28!==0})}
function guideWordTokens(ruleKey,word){return ruleKey.startsWith('ko-')?[...word].flatMap(char=>[...keySequenceForChar(char)]):[...word.toLowerCase()]}
function guideWordIsValid(ruleKey,word){
  const rule=guideWordRules[ruleKey];if(!rule)return true;
  const tokens=guideWordTokens(ruleKey,word),plainTokens=tokens.map(token=>token.toLowerCase()),usesShift=tokens.some(token=>/[A-Z]/.test(token));
  if(rule.allowed&&plainTokens.some(token=>!rule.allowed.has(token)))return false;
  if(rule.required&&!plainTokens.some(token=>rule.required.has(token)))return false;
  if(rule.final==='forbid'&&koreanWordHasFinal(word))return false;
  if(rule.final==='require'&&!koreanWordHasFinal(word))return false;
  if(rule.shift==='forbid'&&usesShift)return false;
  if(rule.shift==='require'&&!usesShift)return false;
  return true;
}
function validGuideWords(ruleKey){
  const bank=guideWordBanks[ruleKey]||[],invalid=bank.filter(word=>!guideWordIsValid(ruleKey,word));
  if(invalid.length)console.error(`자리 익히기 단계 규칙 위반: ${ruleKey}`,invalid);
  return bank.filter(word=>guideWordIsValid(ruleKey,word));
}
function targetKeySequence(){return [...target()].map(keySequenceForChar).join('')}
function completedTargetPrefix(progress){let used=0,result='';for(const char of [...target()]){const length=keySequenceForChar(char).length;if(used+length>progress)break;used+=length;result+=char}return result}
function completedKeyProgress(progress){let used=0;for(const char of [...target()]){const length=keySequenceForChar(char).length;if(used+length>progress)break;used+=length}return used}
function physicalCharacter(event){if(/^Key[A-Z]$/.test(event.code)){const letter=event.code.slice(3).toLowerCase();return event.shiftKey?letter.toUpperCase():letter}if(/^Digit[0-9]$/.test(event.code)){const digit=event.code.slice(5);return event.shiftKey?shiftedSymbols[digit]:digit}if(/^Numpad[0-9]$/.test(event.code))return event.code.slice(6);if(event.code==='Space')return ' ';const plain=codeChars[event.code];if(!plain)return '';if(!event.shiftKey||event.code.startsWith('Numpad'))return plain;return {...shiftedSymbols,'.':'>',',':'<','/':'?',';':':',"'":'"','[':'{',']':'}'}[plain]||plain}
function resetForcedInput(){forcedKeyProgress=0;forcedWrongBuffer=''}
function markManualInput(){manualInputUntil=performance.now()+350}
function physicalDisplayCharacter(pressed){return state.lang==='ko'?(koreanKeyLabels[pressed]||pressed):pressed}
function restoreManualInput(clearError=true){input.value=completedTargetPrefix(forcedKeyProgress)+forcedWrongBuffer;previousInputLength=chars(input.value).length;if(clearError&&!forcedWrongBuffer)input.classList.remove('error');renderPrompt()}
function pickRandom(items,count){return [...items].sort(()=>Math.random()-.5).slice(0,count)}
function refreshEnglishShiftGuide(){englishShiftGuide=[...pickRandom(rightHandLetters,2).map(letter=>`shift-left+${letter}`),...pickRandom(leftHandLetters,2).map(letter=>`shift-right+${letter}`)].sort(()=>Math.random()-.5)}
function renderGuideStages(){const stages=guideStages[guideLang];$('#guideStages').innerHTML=stages.map((stage,index)=>`<button type="button" class="${index===guideStage?'active':''}" data-guide-stage="${index}" aria-pressed="${index===guideStage}">${index+1}. ${stage.label}</button>`).join('');$$('[data-guide-stage]').forEach(button=>button.addEventListener('click',()=>{guideStage=Number(button.dataset.guideStage);guideIndex=0;guideWordKeyIndex=0;currentGuideOrder=null;if(guideLang==='en'&&guideStage===3)refreshEnglishShiftGuide();renderGuideStages();showGuide()}))}
function buildKeyboard(){const box=$('#keyboard'),rows=guideLang==='symbols'?[keyboardRows[0],keyboardRows[3].filter(([en])=>en==='Shift')]:keyboardRows.slice(1);box.innerHTML=rows.map((row,index)=>`<div class="key-row ${guideLang==='symbols'&&index===1?'shift-only-row':''}">${row.map(([en,ko,f,code,shifted])=>`<button type="button" class="key ${(en==='F'||en==='J')?'home-key':''} ${en==='Shift'?'shift-key':''} ${shifted?'number-key':''}" data-code="${code||en.toLowerCase()}" data-ko="${ko}" data-shifted="${shifted||''}" data-finger="${f}">${en==='Shift'?'⇧ Shift':shifted?en:guideLang==='ko'?ko:en.toLowerCase()}</button>`).join('')}</div>`).join('');box.querySelectorAll('.key').forEach(k=>k.addEventListener('click',()=>{const code=k.dataset.code;if(code.startsWith('shift-')){virtualShift=code.slice(6);return}checkGuide(code,virtualShift);virtualShift=''}));renderGuideStages();showGuide()}
function guideOrder(){if(currentGuideOrder)return currentGuideOrder;const keys=guideLang==='en'&&guideStage===3?englishShiftGuide:guideStages[guideLang][guideStage].items,bank=validGuideWords(`${guideLang}-${guideStage}`);currentGuideOrder=[...keys,...pickRandom(bank,Math.min(10,bank.length)).map(word=>`word:${word}`)];return currentGuideOrder}
function guideTarget(){const order=guideOrder();return order[guideIndex%order.length]}
function guideWord(){const target=guideTarget();return target.startsWith('word:')?target.slice(5):''}
function guideWordSequence(){return [...guideWord()].map(keySequenceForChar).join('')}
function shiftSideForCode(code){return leftHandLetters.includes(code)||'`12345'.includes(code)?'right':'left'}
function wordExpectedPress(){const token=guideWordSequence()[guideWordKeyIndex];if(/[A-Z]/.test(token))return{code:token.toLowerCase(),side:shiftSideForCode(token.toLowerCase())};const shiftedEntry=Object.entries(shiftedSymbols).find(([,value])=>value===token);return shiftedEntry?{code:shiftedEntry[0],side:shiftSideForCode(shiftedEntry[0])}:{code:token,side:''}}
function guideCombo(){const target=guideTarget();if(target.startsWith('word:')||!target.includes('+'))return null;const [shiftCode,letter]=target.split('+');return{side:shiftCode.slice(6),shiftCode,letter}}
function activateFinger(finger){finger.split('-').forEach(code=>$(`.finger[data-finger="${code}"]`)?.classList.add('active'))}
function setEnglishKeyboardCase(upper){if(guideLang!=='en')return;$$('.key:not(.shift-key)').forEach(key=>{key.textContent=upper?key.dataset.code.toUpperCase():key.dataset.code})}
function setNumberKeyboardShift(shifted){$$('.number-key').forEach(key=>{key.textContent=shifted?key.dataset.shifted:key.dataset.code})}
function setKoreanShiftLabel(combo){if(guideLang!=='ko')return;$$('.key:not(.shift-key):not(.number-key)').forEach(key=>{key.textContent=key.dataset.ko});if(combo&&shiftedKorean[combo.letter])$(`.key[data-code="${combo.letter}"]`).textContent=shiftedKorean[combo.letter]}
function showGuide(){
  $('#fingerGuide').classList.remove('stage-complete');
  $('#guideNextButton').hidden=true;
  $('#startWordsButton').hidden=false;
  virtualShift='';
  $$('.key,.finger').forEach(x=>x.classList.remove('active'));
  const word=guideWord();
  if(word){
    const expected=wordExpectedPress(),keyEl=$(`.key[data-code="${expected.code}"]`),shiftEl=expected.side?$(`.key[data-code="shift-${expected.side}"]`):null;
    setEnglishKeyboardCase(Boolean(expected.side&&guideLang==='en'));
    setNumberKeyboardShift(Boolean(expected.side&&guideLang==='symbols'));
    setKoreanShiftLabel(expected.side?{letter:expected.code}:null);
    if(keyEl){keyEl.classList.add('active');activateFinger(keyEl.dataset.finger)}
    if(shiftEl){shiftEl.classList.add('active');activateFinger(shiftEl.dataset.finger)}
    $('#fingerBadge').textContent=guideStages[guideLang][guideStage].label;
    $('#guideKey').textContent=word;
    const note=guideStages[guideLang][guideStage].wordNote;$('#guideMessage').innerHTML=`<b>${word}</b> 입력 중 · ${guideWordKeyIndex+1}/${guideWordSequence().length}${note?`<br><small>${note}</small>`:''}`;
  }else{
    const combo=guideCombo(),symbolCombo=Boolean(combo&&shiftedSymbols[combo.letter]);
    setEnglishKeyboardCase(Boolean(combo&&!symbolCombo));setNumberKeyboardShift(symbolCombo);setKoreanShiftLabel(combo);
    if(combo){
      const shiftEl=$(`.key[data-code="${combo.shiftCode}"]`),letterEl=$(`.key[data-code="${combo.letter}"]`);
      shiftEl.classList.add('active');letterEl.classList.add('active');activateFinger(shiftEl.dataset.finger);activateFinger(letterEl.dataset.finger);
      const output=shiftedSymbols[combo.letter]||(guideLang==='ko'?shiftedKorean[combo.letter]:combo.letter.toUpperCase());
      $('#fingerBadge').textContent=`${combo.side==='left'?'왼쪽':'오른쪽'} Shift + ${letterEl.textContent}`;$('#guideKey').textContent=output;$('#guideMessage').innerHTML=`${combo.side==='left'?'왼쪽':'오른쪽'} <b>Shift</b>를 누른 채 <b>${letterEl.textContent}</b> 키를 눌러 <b>${output}</b>을 입력하세요.`;
    }else{
      const keyEl=$(`.key[data-code="${guideTarget()}"]`);if(!keyEl)return;keyEl.classList.add('active');const finger=keyEl.dataset.finger;activateFinger(finger);$('#fingerBadge').textContent=fingerNames[finger];$('#guideKey').textContent=keyEl.textContent;$('#guideMessage').innerHTML=finger==='rr-rp'?`약지나 새끼손가락 중 편한 손가락으로 <b>${keyEl.textContent}</b> 키를 눌러 보세요.`:`파란색으로 표시된 손가락으로 <b>${keyEl.textContent}</b> 키를 눌러 보세요.`;
    }
  }
  const order=guideOrder();$('#guideCount').textContent=`${guideIndex} / ${order.length}`;$('#guideBar').style.width=`${guideIndex/order.length*100}%`;saveGuideSession();
}
function finishGuideStage(){
  const stages=guideStages[guideLang],stage=stages[guideStage],last=guideStage>=stages.length-1,order=guideOrder(),nextButton=$('#guideNextButton');
  $$('.key,.finger').forEach(item=>item.classList.remove('active'));
  $('#fingerGuide').classList.add('stage-complete');
  $('#fingerBadge').textContent=last?'자리 연습 완료':'단계 완료';
  $('#guideKey').textContent='✓';
  $('#guideMessage').innerHTML=`<b>${stage.label} 연습을 마쳤어요!</b><br>${last?'이제 낱말 연습을 시작해 보세요.':`다음은 ${stages[guideStage+1].label} 단계예요.`}`;
  $('#guideCount').textContent=`${order.length} / ${order.length} · 완료`;
  $('#guideBar').style.width='100%';
  nextButton.textContent=last?'낱말 연습 시작':`다음 단계: ${stages[guideStage+1].label}`;
  nextButton.hidden=false;
  $('#startWordsButton').hidden=true;
  nextButton.focus();
  writeTypingRecord(`position-${guideLang}-${guideStage}`,{mode:'position',lang:guideLang,stage:stage.label,addCompletion:true});saveGuideSession(true);
}
function advanceGuideStage(){
  const stages=guideStages[guideLang];
  if(guideStage>=stages.length-1)return openPractice('words');
  guideStage++;guideIndex=0;guideWordKeyIndex=0;currentGuideOrder=null;
  if(guideLang==='en'&&guideStage===3)refreshEnglishShiftGuide();
  renderGuideStages();showGuide();
}
function checkGuide(code,shiftSide=''){
  if($('#fingerGuide').classList.contains('stage-complete'))return;
  const word=guideWord();
  if(word){
    const expected=wordExpectedPress();if(code!==expected.code||shiftSide!==expected.side)return ping(false);ping(true);guideWordKeyIndex++;
    if(guideWordKeyIndex<guideWordSequence().length)return showGuide();guideWordKeyIndex=0;guideIndex++;
  }else{
    const combo=guideCombo(),correct=combo?code===combo.letter&&shiftSide===combo.side:code===guideTarget();if(!correct)return ping(false);ping(true);guideIndex++;
  }
  if(guideIndex>=guideOrder().length)finishGuideStage();else showGuide();
}
function showHome(){$('#typingHome').hidden=false;$('#recordsCard').hidden=true;$('#fingerGuide').hidden=true;$('.practice').hidden=true;$('#resultCard').hidden=true;updateHomeContinue()}
function selectLanguage(lang){state.lang=lang;$$('[data-language]').forEach(button=>{const active=button.dataset.language===lang;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active)});$('.practice')?.classList.toggle('avatar-mode',lang==='avatars')}
function renderPracticeFilters(){const box=$('#practiceFilters');if(state.lang!=='avatars'){box.innerHTML='';box.hidden=true;return}box.hidden=false;const options=[['animal','동물'],['food','과일·채소·음식'],['object','사물']];box.innerHTML=options.map(([value,label])=>`<button type="button" class="${state.filter===value?'active':''}" data-practice-filter="${value}" aria-pressed="${state.filter===value}">${label}</button>`).join('');$$('[data-practice-filter]').forEach(button=>button.addEventListener('click',()=>{state.filter=button.dataset.practiceFilter;renderPracticeFilters();setup()}))}
function filteredPracticeSource(){if(state.mode==='words'&&state.lang==='avatars')return avatarItems.filter(item=>item.category===state.filter).map(item=>item.answer);return state.mode==='words'?wordPools[state.lang]:sentencePools[state.lang]}
async function openPractice(mode='words',resume=false){const saved=resume?readTypingSession():null;state.mode=mode;state.filter=saved?.mode===mode?saved.filter:'all';state.level={words:0,sentences:1}[mode]??0;await wordBankReady;if(saved?.mode===mode)selectLanguage(saved.lang);$('#typingHome').hidden=true;$('#fingerGuide').hidden=true;$('.practice').hidden=false;$('.practice').classList.toggle('sentence-mode',mode==='sentences');$('#practiceTitle').textContent={words:'단어 연습',sentences:'문장 연습'}[mode];$('#languageControls').hidden=false;const symbolButton=$('[data-language="symbols"]'),avatarButton=$('[data-language="avatars"]');symbolButton.hidden=mode!=='words';avatarButton.hidden=mode!=='words';if(mode!=='words'&&['symbols','avatars'].includes(state.lang))selectLanguage('ko');if(mode==='words'&&state.lang==='avatars'&&!['animal','food','object'].includes(state.filter))state.filter='animal';if(state.lang!=='avatars')state.filter='all';renderPracticeFilters();if(saved?.mode===mode&&Array.isArray(saved.items)&&saved.items.length){state.items=saved.items;state.index=Math.min(saved.index||0,state.items.length-1);state.start=0;state.typed=0;state.correct=0;state.totalTyped=0;state.totalCorrect=0;state.streak=0;state.speeds=[];state.activeMs=0;state.locked=false;input.disabled=false;$('.practice').hidden=false;$('#resultCard').hidden=true;showItem();stats();setTimeout(()=>input.focus(),50)}else setup()}
function openGuide(resume=false){const saved=resume?readTypingSession():null;if(saved?.mode==='position'){guideLang=saved.guideLang||'ko';guideStage=Math.min(saved.guideStage||0,guideStages[guideLang].length-1);const ruleKey=`${guideLang}-${guideStage}`,savedOrder=Array.isArray(saved.order)?saved.order:null,sanitizedOrder=savedOrder?.filter(item=>!item.startsWith('word:')||guideWordIsValid(ruleKey,item.slice(5)))||null,orderChanged=Boolean(savedOrder&&sanitizedOrder.length!==savedOrder.length);currentGuideOrder=sanitizedOrder;guideIndex=Math.min(saved.guideIndex||0,Math.max((currentGuideOrder?.length||1)-1,0));guideWordKeyIndex=orderChanged?0:saved.guideWordKeyIndex||0;$$('[data-guide-language]').forEach(button=>{const active=button.dataset.guideLanguage===guideLang;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active)})}else{guideIndex=0;guideWordKeyIndex=0;currentGuideOrder=null}if(guideLang==='en'&&guideStage===3&&!currentGuideOrder)refreshEnglishShiftGuide();$('#typingHome').hidden=true;$('.practice').hidden=true;$('#resultCard').hidden=true;$('#fingerGuide').hidden=false;buildKeyboard()}
function key(){return `typing-best-${state.mode}-${state.lang}-${state.filter}`}
function target(){return state.items[state.index]}
function chars(s){return [...s]}
function isEnglishPractice(){return(state.mode==='words'&&(state.lang==='avatars'||state.lang==='en'))||(state.mode==='sentences'&&state.lang==='en')}
function speakWord(text){if(!text||!state.sound||!('speechSynthesis' in window))return;try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=state.mode==='sentences'?.9:.88;const voices=window.speechSynthesis.getVoices(),englishVoice=voices.find(v=>v.lang&&(v.lang==='en-US'||v.lang==='en_US'))||voices.find(v=>v.lang&&v.lang.startsWith('en'));if(englishVoice)utterance.voice=englishVoice;window.speechSynthesis.speak(utterance)}catch(e){console.warn('TTS speak failed',e)}}
function renderPrompt(){const typed=chars(input.value),goal=chars(target()),escape=value=>value.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));prompt.innerHTML=goal.map((c,i)=>`<span class="${i>=typed.length?'rest':typed[i]===c?'done':'wrong'}">${c===' '?'&nbsp;':escape(c)}</span>`).join('');const avatar=$('#avatarPrompt'),ttsBtn=$('#audioPromptButton'),literal=$('#promptLiteral');if(state.mode==='words'&&state.lang==='avatars'){const item=avatarByAnswer.get(target());avatar.src=item?.image||'';avatar.hidden=!item}else{avatar.hidden=true;avatar.removeAttribute('src')}if(ttsBtn)ttsBtn.hidden=!isEnglishPractice();const meaning=state.mode==='words'&&state.lang==='en'?englishMeanings.get(target().toLowerCase()):'';if(meaning)prompt.insertAdjacentHTML('beforeend',`<small class="prompt-meaning">(${escape(meaning)})</small>`);const literalText=state.mode==='sentences'&&state.lang==='en'?proverbEnLiterals.get(target()):'';literal.textContent=literalText||'';literal.hidden=!literalText}
function stats(){const elapsed=state.start?Math.max(Date.now()-state.start,1)/60000:0,speed=elapsed?Math.round(state.typed/elapsed):0;const accuracy=state.totalTyped?Math.round(state.totalCorrect/state.totalTyped*100):100;$('#speed').textContent=speed;$('#accuracy').textContent=accuracy;$('#streak').textContent=state.streak;return{speed,accuracy}}
function choosePracticeItems(source){const count=10,recentKey=`typing-recent-${state.mode}-${state.lang}-${state.filter}`;let recent=[];try{recent=JSON.parse(localStorage.getItem(recentKey)||'[]')}catch{}const fresh=source.filter(item=>!recent.includes(item)),chosen=pickRandom(fresh.length>=count?fresh:source,count);localStorage.setItem(recentKey,JSON.stringify(chosen));return chosen}
function setup(){window.speechSynthesis?.cancel?.();state.items=choosePracticeItems(filteredPracticeSource());state.index=0;state.start=0;state.typed=0;state.correct=0;state.totalTyped=0;state.totalCorrect=0;state.streak=0;state.speeds=[];state.activeMs=0;state.locked=false;input.value='';input.disabled=false;$('.practice').hidden=false;$('#resultCard').hidden=true;showItem();stats();setTimeout(()=>input.focus(),50)}
function showItem(){state.start=0;state.typed=0;state.correct=0;input.value='';previousInputLength=0;resetForcedInput();input.classList.remove('error');feedback.className='feedback';feedback.textContent=state.mode==='words'&&state.lang==='avatars'?'그림과 함께 나온 영단어를 그대로 입력하세요.':'한/영 키를 바꾸지 않아도 바로 입력할 수 있어요.';$('#stepLabel').textContent=`${state.index+1} / ${state.items.length}`;$('#bestLabel').textContent=`최고 ${localStorage.getItem(key())||0}타/분`;$('#progressBar').style.width=`${(state.index+1)/state.items.length*100}%`;renderPrompt();stats();savePracticeSession();if(isEnglishPractice()){setTimeout(()=>speakWord(target()),150)}}
function soundContext(){if(!state.sound)return null;try{const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return null;if(!audioContext)audioContext=new AudioEngine();if(audioContext.state==='suspended')audioContext.resume();return audioContext}catch{return null}}
function playKeySound(soft=false){const ctx=soundContext();if(!ctx)return;const now=ctx.currentTime,duration=soft?.022:.035,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let index=0;index<data.length;index++)data[index]=(Math.random()*2-1)*Math.pow(1-index/data.length,2.5);const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),body=ctx.createOscillator(),bodyGain=ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=soft?1100:1650;filter.Q.value=1.4;gain.gain.setValueAtTime((soft?.14:.26)*state.sfxVolume,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);body.type='triangle';body.frequency.setValueAtTime(soft?105:140,now);bodyGain.gain.setValueAtTime((soft?.07:.13)*state.sfxVolume,now);bodyGain.gain.exponentialRampToValueAtTime(.001,now+.04);source.connect(filter).connect(gain).connect(ctx.destination);body.connect(bodyGain).connect(ctx.destination);source.start(now);source.stop(now+duration);body.start(now);body.stop(now+.045)}
function playErrorSound(){const ctx=soundContext();if(!ctx)return;const now=ctx.currentTime,oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='square';oscillator.frequency.setValueAtTime(190,now);oscillator.frequency.exponentialRampToValueAtTime(95,now+.09);gain.gain.setValueAtTime(.22*state.sfxVolume,now);gain.gain.exponentialRampToValueAtTime(.001,now+.1);oscillator.connect(gain).connect(ctx.destination);oscillator.start(now);oscillator.stop(now+.1)}
function playSuccessSound(){const ctx=soundContext();if(!ctx)return;[0,1].forEach(step=>{const now=ctx.currentTime+step*.055,oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.value=step?780:620;gain.gain.setValueAtTime(.18*state.sfxVolume,now);gain.gain.exponentialRampToValueAtTime(.001,now+.07);oscillator.connect(gain).connect(ctx.destination);oscillator.start(now);oscillator.stop(now+.08)})}
function ping(ok){playKeySound();if(!ok)playErrorSound()}
function complete(){if(state.locked)return;state.locked=true;const current=target(),given=input.value;if(given!==current){input.classList.add('error');feedback.className='feedback bad';feedback.textContent='아직 틀린 글자가 있어요. Backspace로 지우고 다시 입력한 뒤 Enter를 누르세요.';playErrorSound();state.locked=false;return}const result=stats();if(state.start)state.activeMs+=Math.max(Date.now()-state.start,1);state.streak++;state.speeds.push(result.speed);feedback.className='feedback good';feedback.textContent='정확해요! 참 잘했어요.';playSuccessSound();setTimeout(()=>{state.index++;state.locked=false;if(state.index>=state.items.length)finish();else showItem()},420)}
function finish(){window.speechSynthesis?.cancel?.();const r=stats(),average=Math.round(state.totalTyped/Math.max(state.activeMs/60000,1/60000)),best=Math.max(Number(localStorage.getItem(key())||0),average);localStorage.setItem(key(),best);writeTypingRecord(`${state.mode}-${state.lang}-${state.filter}`,{mode:state.mode,lang:state.lang,filter:state.filter,bestSpeed:average,bestAccuracy:r.accuracy,addCompletion:true});writeTypingSession({mode:state.mode,completed:true});input.disabled=true;$('.practice').hidden=true;$('#resultCard').hidden=false;$('#resultSpeed').textContent=average;$('#resultAccuracy').textContent=`${r.accuracy}%`;$('#resultTitle').textContent=r.accuracy>=95?'정확하고 멋져요!':'끝까지 해냈어요!'}
input.addEventListener('beforeinput',event=>{if(performance.now()<manualInputUntil)event.preventDefault()});
input.addEventListener('compositionend',()=>{if(performance.now()<manualInputUntil)restoreManualInput(false)});
input.addEventListener('input',()=>{if(performance.now()<manualInputUntil){restoreManualInput(false);return}forcedKeyProgress=0;forcedWrongBuffer='';const written=chars(input.value),prev=previousInputLength,added=Math.max(0,written.length-prev);if(added&&!state.start)state.start=Date.now();if(added)playKeySound();state.typed+=added;state.totalTyped+=added;if(written.length>prev){const goal=chars(target());for(let i=prev;i<written.length;i++)if(written[i]===goal[i]){state.correct++;state.totalCorrect++}}previousInputLength=written.length;renderPrompt();stats();input.classList.toggle('error',written.some((c,i)=>c!==chars(target())[i]));if(input.value===target())complete()});
input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();markManualInput();playKeySound(true);complete();return}if(e.ctrlKey||e.altKey||e.metaKey)return;if(e.key==='Backspace'){if(!forcedKeyProgress&&!forcedWrongBuffer)return;e.preventDefault();markManualInput();playKeySound(true);if(forcedWrongBuffer){const wrong=chars(forcedWrongBuffer);wrong.pop();forcedWrongBuffer=wrong.join('')}else forcedKeyProgress=Math.max(0,forcedKeyProgress-1);restoreManualInput();feedback.className=forcedWrongBuffer?'feedback bad':'feedback';feedback.textContent=forcedWrongBuffer?'오타를 Backspace로 지워 주세요.':'좋아요. 다시 입력해 보세요.';stats();return}const pressed=physicalCharacter(e);if(!pressed)return;e.preventDefault();markManualInput();playKeySound();if(!state.start)state.start=Date.now();state.typed++;state.totalTyped++;const expected=targetKeySequence()[forcedKeyProgress];if(!forcedWrongBuffer&&pressed===expected){state.correct++;state.totalCorrect++;forcedKeyProgress++;restoreManualInput();feedback.className='feedback';feedback.textContent='좋아요. 그대로 이어서 입력하세요!';stats();if(forcedKeyProgress===targetKeySequence().length)complete()}else{if(!forcedWrongBuffer)forcedKeyProgress=completedKeyProgress(forcedKeyProgress);forcedWrongBuffer+=physicalDisplayCharacter(pressed);restoreManualInput(false);input.classList.add('error');feedback.className='feedback bad';feedback.textContent='오타를 Backspace로 지운 뒤 다시 입력해 보세요.';stats();playErrorSound()}});
$$('[data-language]').forEach(b=>b.addEventListener('click',async()=>{selectLanguage(b.dataset.language);if(state.lang==='avatars')state.filter='animal';else state.filter='all';if(state.mode==='words'||state.mode==='sentences')await wordBankReady;renderPracticeFilters();setup()}));
window.addEventListener('classsfxchange',event=>{state.sound=!event.detail?.muted;state.sfxVolume=Math.max(0,Math.min(1,Number(event.detail?.volume)||0))});
$$('[data-guide-language]').forEach(b=>b.addEventListener('click',()=>{guideLang=b.dataset.guideLanguage;guideStage=0;guideIndex=0;guideWordKeyIndex=0;currentGuideOrder=null;$$('[data-guide-language]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});buildKeyboard()}));
const heldShift={left:false,right:false};
function guideEventCode(event){if(/^Key[A-Z]$/.test(event.code))return event.code.slice(3).toLowerCase();if(/^Digit[0-9]$/.test(event.code))return event.code.slice(5);if(/^Numpad[0-9]$/.test(event.code))return event.code.slice(6);const numpadMap={NumpadDecimal:'.',NumpadAdd:'+',NumpadSubtract:'-',NumpadMultiply:'*',NumpadDivide:'/',NumpadEqual:'='};if(numpadMap[event.code])return numpadMap[event.code];return{Backquote:'`',Minus:'-',Equal:'='}[event.code]||event.key.toLowerCase()}
document.addEventListener('keydown',e=>{if($('#fingerGuide').hidden||e.ctrlKey||e.altKey||e.metaKey)return;if(e.code==='ShiftLeft'){heldShift.left=true;return}if(e.code==='ShiftRight'){heldShift.right=true;return}checkGuide(guideEventCode(e),heldShift.left?'left':heldShift.right?'right':'')});
document.addEventListener('keyup',e=>{if(e.code==='ShiftLeft')heldShift.left=false;if(e.code==='ShiftRight')heldShift.right=false});
$$('[data-practice-mode]').forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.practiceMode,saved=readTypingSession(),resume=saved?.mode===mode&&!saved.completed;mode==='position'?openGuide(resume):openPractice(mode,resume)}));
window.addEventListener('sitebackrequest',event=>{if($('#typingHome').hidden){event.preventDefault();showHome()}});
$('#recordsButton').addEventListener('click',openRecords);
$('#resetRecordsButton').addEventListener('click',()=>{if(!confirm('타자연습 기록과 이어하기 정보를 모두 지울까요?'))return;const keys=[];for(let index=0;index<localStorage.length;index++){const name=localStorage.key(index);if(name?.startsWith('typing-'))keys.push(name)}keys.forEach(name=>localStorage.removeItem(name));renderRecords();updateHomeContinue()});
$('#audioPromptButton')?.addEventListener('click',()=>speakWord(target()));
$('#guideNextButton').addEventListener('click',advanceGuideStage);$('#startWordsButton').addEventListener('click',()=>openPractice('words'));$('#againButton').addEventListener('click',setup);mergeDifficultyRecords();buildKeyboard();showHome();
