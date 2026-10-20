"use strict";

const decks = window.PROVERB_BANKS;
const $ = (id) => document.getElementById(id);
const LESSONS = {
ko: [
    ["말의 힘과 소통", /가는 말|낮말|말 한마디|발 없는 말|아니 땐|말이 씨|아 다르고|입은 비뚤|제 말 하면/],
    ["협력과 관계", /백지장|고래 싸움|웃는 얼굴|친구|가재|누이|사촌|손뼉|팔은 안으로|믿는 도끼/],
    ["꾸준함과 성장", /티끌|시작이 반|공든|서당 개|열 번 찍어|천 리 길|가랑비|고생 끝|구슬이 서 말|낙숫물|한 술 밥/],
    ["준비와 신중함", /돌다리|소 잃고|아는 길|급할수록|호미로|우물가에서 숭늉|김칫국/],
    ["실수와 실패", /원숭이|자라 보고|닭 쫓던|다 된 죽|혹 떼러|산 넘어 산/],
    ["용기와 위기", /호랑이 굴|정신만 차리면|하늘이 무너져도|바람 앞|구더기 무서워|고양이 목/],
    ["욕심과 이해관계", /배보다 배꼽|꿩 먹고|남의 떡|말 타면|달면 삼키고|물에 빠진 사람|금강산/],
    ["겉모습과 실속", /그림의 떡|빈 수레|제 눈에 안경|빛 좋은|수박 겉|눈 가리고|보기 좋은 떡|옷이 날개/],
    ["원인과 결과", /세 살 버릇|누워서 침|바늘 도둑|콩 심은|병 주고|닭 잡아먹고|핑계 없는/],
    ["재능과 겸손", /될성부른|작은 고추|하나를 보면|하룻강아지|올챙이|공자 앞|굼벵이|뛰는 놈|벼는 익을수록|호랑이 없는 골/],
    ["선택과 대안", /모로 가도|꿩 대신|목마른|구관이 명관|부뚜막의 소금|백문이|우물 안 개구리/],
    ["비교와 한계", /누워서 떡|도토리|하늘의 별|계란으로|오르지 못할|세월 앞/],
    ["공정과 책임", /똥 묻은|사공이 많으면|종로에서|불난 집|지렁이|모난 돌|재주는 곰/],
    ["관찰과 앎", /등잔 밑|낫 놓고/],
    ["때와 기회", /쇠뿔도|가는 날이|쥐구멍/],
    ["사람과 형편", /가지 많은|내 코|열 길|원수는/]
  ],
  en: [
    ["Effort and growth", ["Practice makes perfect.", "Where there is a will, there is a way.", "No pain, no gain.", "Slow and steady wins the race.", "When the going gets tough, the tough get going.", "Fortune favors the bold."]],
    ["Time and opportunity", ["The early bird catches the worm.", "Better late than never.", "Time flies.", "Good things come to those who wait.", "Strike while the iron is hot.", "Prevention is better than cure."]],
    ["Words and knowledge", ["Actions speak louder than words.", "Honesty is the best policy.", "Knowledge is power.", "The pen is mightier than the sword.", "A picture is worth a thousand words.", "Barking dogs seldom bite."]],
    ["Cooperation and community", ["Two heads are better than one.", "A friend in need is a friend indeed.", "Many hands make light work.", "Birds of a feather flock together.", "Great minds think alike.", "Too many cooks spoil the broth."]],
    ["Careful choices", ["Look before you leap.", "Haste makes waste.", "Curiosity killed the cat.", "Once bitten, twice shy.", "Don't count your chickens before they hatch.", "Don't put all your eggs in one basket."]],
    ["Results and resources", ["Easy come, easy go.", "A penny saved is a penny earned.", "You can't have your cake and eat it too.", "Beggars can't be choosers.", "The grass is always greener on the other side."]],
    ["Hope and well-being", ["Every cloud has a silver lining.", "Time heals all wounds.", "Laughter is the best medicine.", "Necessity is the mother of invention.", "Variety is the spice of life."]],
    ["Family and belonging", ["Absence makes the heart grow fonder.", "Blood is thicker than water.", "Home is where the heart is.", "When in Rome, do as the Romans do.", "Don't bite the hand that feeds you."]],
    ["Values and perspectives", ["Don't judge a book by its cover.", "Beauty is in the eye of the beholder.", "Cleanliness is next to godliness.", "You can lead a horse to water, but you can't make it drink.", "An apple a day keeps the doctor away."]]
  ]
};

runRecordedLessons({ activity:'proverbs',label:'속담',decks,pauseMusicDuringLesson:true,lessons:Object.fromEntries(Object.entries(LESSONS).map(([lang,rows])=>[lang,rows.map(row=>({title:row[0]}))])),lessonFor(item,language){const text=item.proverb+' '+item.meaning;const lessons=LESSONS[language];for(let i=0;i<lessons.length;i++){const matcher=lessons[i][1];if(Array.isArray(matcher)?matcher.includes(item.proverb):matcher.test(text))return i;}return lessons.length-1;},ids:{studyTitle:'proverb',studyProgress:'label',quizProgress:'quizKicker',quizTitle:'quiz-title',image:'proverbIllustrationImage'} });
