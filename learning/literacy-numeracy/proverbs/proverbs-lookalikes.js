"use strict";

// 한 문제의 보기에 같이 나오면 둘 다 정답처럼 읽히는 속담끼리 묶는다.
// 뜻이 같거나(가재는 게 편·팔은 안으로 굽는다) 서로의 문제 상황에도 그럴듯하게 들어맞는 것들이다.
// proverbs-data.js와 proverbs-essential-additions.js 뒤에 불러야 한다.
const PROVERB_LOOKALIKE_GROUPS = {
  ko: [
    ["돌다리도 두들겨 보고 건너라", "아는 길도 물어 가라"],
    ["돌다리도 두들겨 보고 건너라", "다 된 죽에 코 빠뜨린다"],
    ["티끌 모아 태산", "열 번 찍어 안 넘어가는 나무 없다", "천 리 길도 한 걸음부터", "낙숫물이 댓돌을 뚫는다", "한 술 밥에 배부르랴"],
    ["티끌 모아 태산", "가랑비에 옷 젖는 줄 모른다"],
    ["공든 탑이 무너지랴", "고생 끝에 낙이 온다", "쥐구멍에도 볕 들 날 있다", "열 번 찍어 안 넘어가는 나무 없다"],
    ["시작이 반이다", "천 리 길도 한 걸음부터", "쇠뿔도 단김에 빼라"],
    ["가는 말이 고와야 오는 말이 곱다", "말 한마디에 천 냥 빚도 갚는다", "웃는 얼굴에 침 못 뱉는다", "아 다르고 어 다르다"],
    ["가는 말이 고와야 오는 말이 곱다", "콩 심은 데 콩 나고 팥 심은 데 팥 난다"],
    ["아니 땐 굴뚝에 연기 나랴", "콩 심은 데 콩 나고 팥 심은 데 팥 난다"],
    ["소 잃고 외양간 고친다", "호미로 막을 것을 가래로 막는다"],
    ["백지장도 맞들면 낫다", "손뼉도 마주쳐야 소리가 난다"],
    ["낮말은 새가 듣고 밤말은 쥐가 듣는다", "발 없는 말이 천 리 간다"],
    ["등잔 밑이 어둡다", "낫 놓고 기역 자도 모른다"],
    ["오르지 못할 나무는 쳐다보지도 마라", "하룻강아지 범 무서운 줄 모른다", "계란으로 바위 치기", "하늘의 별 따기"],
    ["누워서 침 뱉기", "혹 떼러 갔다 혹 붙이고 온다"],
    ["배보다 배꼽이 더 크다", "혹 떼러 갔다 혹 붙이고 온다"],
    ["될성부른 나무는 떡잎부터 알아본다", "하나를 보면 열을 안다"],
    ["믿는 도끼에 발등 찍힌다", "달면 삼키고 쓰면 뱉는다"],
    ["세 살 버릇 여든까지 간다", "바늘 도둑이 소도둑 된다"],
    ["빈 수레가 요란하다", "하룻강아지 범 무서운 줄 모른다", "공자 앞에서 문자 쓴다", "뛰는 놈 위에 나는 놈 있다", "호랑이 없는 골에 토끼가 왕 노릇 한다"],
    ["빈 수레가 요란하다", "빛 좋은 개살구"],
    ["서당 개 삼 년이면 풍월을 읊는다", "작은 고추가 맵다", "굼벵이도 구르는 재주는 있다"],
    ["하늘이 무너져도 솟아날 구멍이 있다", "호랑이에게 물려 가도 정신만 차리면 산다", "쥐구멍에도 볕 들 날 있다"],
    ["호랑이에게 물려 가도 정신만 차리면 산다", "급할수록 돌아가라"],
    ["호랑이 굴에 가야 호랑이 새끼를 잡는다", "백문이 불여일견"],
    ["꿩 먹고 알 먹기", "누이 좋고 매부 좋고"],
    ["남의 떡이 더 커 보인다", "사촌이 땅을 사면 배가 아프다"],
    ["모로 가도 서울만 가면 된다", "급할수록 돌아가라", "꿩 대신 닭"],
    ["물에 빠진 사람 건져 놓으니 보따리 내놓으라 한다", "말 타면 경마 잡히고 싶다"],
    ["사공이 많으면 배가 산으로 간다", "모난 돌이 정 맞는다"],
    ["구슬이 서 말이라도 꿰어야 보배", "부뚜막의 소금도 집어넣어야 짜다"],
    ["가재는 게 편", "팔은 안으로 굽는다"],
    ["산 넘어 산", "가지 많은 나무에 바람 잘 날 없다"],
    ["눈 가리고 아웅", "닭 잡아먹고 오리발 내민다", "핑계 없는 무덤은 없다"],
    ["눈 가리고 아웅", "병 주고 약 준다"],
    ["보기 좋은 떡이 먹기도 좋다", "옷이 날개"],
    ["떡 줄 사람은 생각도 않는데 김칫국부터 마신다", "우물가에서 숭늉 찾는다", "한 술 밥에 배부르랴"]
  ],
  en: [
    ["Practice makes perfect.", "No pain, no gain.", "Slow and steady wins the race."],
    ["Where there is a will, there is a way.", "When the going gets tough, the tough get going."],
    ["Good things come to those who wait.", "Slow and steady wins the race."],
    ["The early bird catches the worm.", "Strike while the iron is hot.", "Fortune favors the bold."],
    ["Two heads are better than one.", "Many hands make light work."],
    ["Actions speak louder than words.", "Barking dogs seldom bite."],
    ["Look before you leap.", "Haste makes waste.", "Once bitten, twice shy."],
    ["An apple a day keeps the doctor away.", "Cleanliness is next to godliness.", "Prevention is better than cure."],
    ["Birds of a feather flock together.", "Great minds think alike."],
    ["Blood is thicker than water.", "Home is where the heart is.", "A friend in need is a friend indeed."]
  ]
};

for (const language of Object.keys(PROVERB_LOOKALIKE_GROUPS)) {
  const deck = window.PROVERB_BANKS[language];
  const groups = PROVERB_LOOKALIKE_GROUPS[language];
  groups.flat().forEach((proverb) => {
    if (!deck.some((item) => item.proverb === proverb)) {
      throw new Error("헷갈리는 속담 묶음에 없는 속담이 있습니다: " + proverb);
    }
  });
  deck.forEach((item) => {
    const lookalikes = new Set();
    groups.filter((group) => group.includes(item.proverb))
      .forEach((group) => group.forEach((proverb) => lookalikes.add(proverb)));
    lookalikes.delete(item.proverb);
    item.lookalikes = [...lookalikes];
  });
}
