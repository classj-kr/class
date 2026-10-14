(function () {
  "use strict";
  const R = String.raw;
  // 2022-suneung 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2022-suneung"] = [
{
      id: "2022-suneung-9", exam: "2022-suneung", no: 9, score: 4,
      units: ["m1-explog"], memo: "평행이동한 두 지수 곡선과 한 직선",
      body: R`직선 \(y=2x+k\)가 두 함수
        \[y=\left(\frac{2}{3}\right)^{x+3}+1,\qquad y=\left(\frac{2}{3}\right)^{x+1}+\frac{8}{3}\]
        의 그래프와 만나는 점을 각각 \(\mathrm{P}\), \(\mathrm{Q}\)라 하자. \(\overline{\mathrm{PQ}}=\sqrt{5}\)일 때,
        상수 \(k\)의 값은?`,
      figure: "2022-suneung-9.webp",
      choices: [R`\(\dfrac{31}{6}\)`, R`\(\dfrac{16}{3}\)`, R`\(\dfrac{11}{2}\)`, R`\(\dfrac{17}{3}\)`, R`\(\dfrac{35}{6}\)`],
      answer: 4,
      help: R`두 점이 기울기 \(2\)인 같은 직선 위에 있으므로 \(x\)좌표 차를 \(d\)라 하면 \(y\)좌표 차는 \(2d\)이고 \(\overline{\mathrm{PQ}}=|d|\sqrt{5}\)다. 곧 \(\overline{\mathrm{PQ}}=\sqrt{5}\)에서 두 점의 \(x\)좌표 차가 \(1\)로 못박힌다.`
    },
{
      id: "2022-suneung-10", exam: "2022-suneung", no: 10, score: 4,
      units: ["m2-diff"], memo: "두 접선이 일치할 조건",
      body: R`삼차함수 \(f(x)\)에 대하여 곡선 \(y=f(x)\) 위의 점 \((0,\,0)\)에서의
        접선과 곡선 \(y=xf(x)\) 위의 점 \((1,\,2)\)에서의 접선이 일치할 때,
        \(f'(2)\)의 값은?`,
      choices: [R`\(-18\)`, R`\(-17\)`, R`\(-16\)`, R`\(-15\)`, R`\(-14\)`],
      answer: 5,
      help: R`\((0,\,0)\)이 \(y=f(x)\) 위의 점이니 \(f(0)=0\)이고, \((1,\,2)\)가 \(y=xf(x)\) 위의 점이니 \(f(1)=2\)다. 그리고 첫 접선은 원점을 지나므로, 두 접선이 일치하려면 둘째 접선도 원점을 지나야 한다.`
    },
{
      id: "2022-suneung-11", exam: "2022-suneung", no: 11, score: 4,
      units: ["m1-trig"], memo: "원점 대칭인 탄젠트 곡선과 정삼각형",
      body: R`양수 \(a\)에 대하여 집합 \(\left\{x\ \middle|\ -\dfrac{a}{2}&lt;x\le a,\ x\ne\dfrac{a}{2}\right\}\)에서
        정의된 함수
        \[f(x)=\tan\frac{\pi x}{a}\]
        가 있다. 그림과 같이 함수 \(y=f(x)\)의 그래프 위의
        세 점 \(\mathrm{O}\), \(\mathrm{A}\), \(\mathrm{B}\)를 지나는 직선이 있다. 점 \(\mathrm{A}\)를 지나고 \(x\)축에
        평행한 직선이 함수 \(y=f(x)\)의 그래프와 만나는 점 중 \(\mathrm{A}\)가
        아닌 점을 \(\mathrm{C}\)라 하자. 삼각형 \(\mathrm{ABC}\)가 정삼각형일 때,
        삼각형 \(\mathrm{ABC}\)의 넓이는? (단, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2022-suneung-11.webp",
      choices: [R`\(\dfrac{3\sqrt{3}}{2}\)`, R`\(\dfrac{17\sqrt{3}}{12}\)`, R`\(\dfrac{4\sqrt{3}}{3}\)`, R`\(\dfrac{5\sqrt{3}}{4}\)`, R`\(\dfrac{7\sqrt{3}}{6}\)`],
      answer: 3,
      help: R`\(f(x)=\tan\frac{\pi x}{a}\)는 원점에 대하여 대칭이므로, 원점을 지나는 직선이 그래프와 만나는 두 점 \(\mathrm{A}\), \(\mathrm{B}\)도 원점에 대하여 대칭이다. 곧 \(\mathrm{O}\)가 선분 \(\mathrm{AB}\)의 중점이고, 정삼각형이라는 조건에서 \(\overline{\mathrm{CO}}\)가 \(\overline{\mathrm{AB}}\)에 수직임이 따라온다.`
    },
{
      id: "2022-suneung-12", exam: "2022-suneung", no: 12, score: 4,
      units: ["m2-limit"], memo: "인수분해로 세 갈래가 되는 함수",
      body: R`실수 전체의 집합에서 연속인 함수 \(f(x)\)가 모든 실수 \(x\)에
        대하여
        \[\bigl\{f(x)\bigr\}^{3}-\bigl\{f(x)\bigr\}^{2}-x^{2}f(x)+x^{2}=0\]
        을 만족시킨다. 함수 \(f(x)\)의 최댓값이 \(1\)이고 최솟값이 \(0\)일 때,
        \(f\left(-\dfrac{4}{3}\right)+f(0)+f\left(\dfrac{1}{2}\right)\)의 값은?`,
      choices: [R`\(\dfrac{1}{2}\)`, R`\(1\)`, R`\(\dfrac{3}{2}\)`, R`\(2\)`, R`\(\dfrac{5}{2}\)`],
      answer: 3,
      help: R`좌변을 묶으면 \(\bigl(f(x)-1\bigr)\bigl(f(x)-x\bigr)\bigl(f(x)+x\bigr)=0\)이 된다. 곧 각 \(x\)마다 \(f(x)\)는 \(1\), \(x\), \(-x\) 셋 중 하나이고, \(f\)가 연속이며 최댓값 \(1\)·최솟값 \(0\)이라는 조건이 어느 조각을 어디서 쓸지 정해 준다.`
    },
{
      id: "2022-suneung-13", exam: "2022-suneung", no: 13, score: 4,
      units: ["m1-explog"], memo: "밑만 다른 두 로그 점을 지나는 직선",
      body: R`두 상수 \(a\), \(b\,(1&lt;a&lt;b)\)에 대하여 좌표평면 위의
        두 점 \(\bigl(a,\,\log_{2}a\bigr)\), \(\bigl(b,\,\log_{2}b\bigr)\)를 지나는 직선의 \(y\)절편과
        두 점 \(\bigl(a,\,\log_{4}a\bigr)\), \(\bigl(b,\,\log_{4}b\bigr)\)를 지나는 직선의 \(y\)절편이 같다.
        함수 \(f(x)=a^{bx}+b^{ax}\)에 대하여 \(f(1)=40\)일 때, \(f(2)\)의 값은?`,
      choices: [R`\(760\)`, R`\(800\)`, R`\(840\)`, R`\(880\)`, R`\(920\)`],
      answer: 2,
      help: R`\(\log_{4}x=\frac{1}{2}\log_{2}x\)이므로 두 번째 직선은 첫 번째 직선 위의 두 점의 \(y\)좌표를 절반으로 줄인 것이다. 두 직선의 \(y\)절편을 각각 \(a\), \(b\)로 써서 같게 놓으면 \(a^{b}=b^{a}\) 꼴의 관계가 나온다.`
    },
{
      id: "2022-suneung-14", exam: "2022-suneung", no: 14, score: 4,
      units: ["m2-integ"], memo: "위치가 양 끝에서 0인 운동",
      body: R`수직선 위를 움직이는 점 \(\mathrm{P}\)의 시각 \(t\)에서의 위치 \(x(t)\)가
        두 상수 \(a\), \(b\)에 대하여
        \[x(t)=t(t-1)(at+b)\quad(a\ne 0)\]
        이다. 점 \(\mathrm{P}\)의 시각 \(t\)에서의 속도 \(v(t)\)가 \(\displaystyle\int_{0}^{1}\bigl|v(t)\bigr|\,dt=2\)를
        만족시킬 때, &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(\displaystyle\int_{0}^{1}v(t)\,dt=0\)`,
        R`ㄴ. \(\bigl|x(t_{1})\bigr|>1\)인 \(t_{1}\)이 열린구간 \((0,\,1)\)에 존재한다.`,
        R`ㄷ. \(0\le t\le 1\)인 모든 \(t\)에 대하여 \(\bigl|x(t)\bigr|&lt;1\)이면 \(x(t_{2})=0\)인 \(t_{2}\)가 열린구간 \((0,\,1)\)에 존재한다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 3,
      help: R`\(x(t)=t(t-1)(at+b)\)는 \(t=0\)과 \(t=1\)에서 모두 \(0\)이다. 그러니 \(\int_{0}^{1}v\,dt=x(1)-x(0)=0\)이고, 그런데도 \(\int_{0}^{1}|v|\,dt=2\)라는 것은 그 사이에 갔다가 되돌아왔다는 뜻이다.`
    },
{
      id: "2022-suneung-15", exam: "2022-suneung", no: 15, score: 4,
      units: ["m1-trig"], memo: "반지름이 중심거리와 같은 두 원",
      body: R`두 점 \(\mathrm{O_{1}}\), \(\mathrm{O_{2}}\)를 각각 중심으로 하고 반지름의 길이가 \(\overline{\mathrm{O_{1}O_{2}}}\)인
        두 원 \(C_{1}\), \(C_{2}\)가 있다. 그림과 같이 원 \(C_{1}\) 위의 서로 다른 세 점
        \(\mathrm{A}\), \(\mathrm{B}\), \(\mathrm{C}\)와 원 \(C_{2}\) 위의 점 \(\mathrm{D}\)가 주어져 있고, 세 점 \(\mathrm{A}\), \(\mathrm{O_{1}}\), \(\mathrm{O_{2}}\)와
        세 점 \(\mathrm{C}\), \(\mathrm{O_{2}}\), \(\mathrm{D}\)가 각각 한 직선 위에 있다.
        이때 \(\angle\mathrm{BO_{1}A}=\theta_{1}\), \(\angle\mathrm{O_{2}O_{1}C}=\theta_{2}\), \(\angle\mathrm{O_{1}O_{2}D}=\theta_{3}\)이라 하자.`,
      figure: "2022-suneung-15.webp",
      bodyAfter: R`다음은 \(\overline{\mathrm{AB}}:\overline{\mathrm{O_{1}D}}=1:2\sqrt{2}\)이고 \(\theta_{3}=\theta_{1}+\theta_{2}\)일 때, 선분 \(\mathrm{AB}\)와
        선분 \(\mathrm{CD}\)의 길이의 비를 구하는 과정이다.
        <div class="proof-box">
        <p>\(\angle\mathrm{CO_{2}O_{1}}+\angle\mathrm{O_{1}O_{2}D}=\pi\)이므로 \(\theta_{3}=\dfrac{\pi}{2}+\dfrac{\theta_{2}}{2}\)이고</p>
        <p>\(\theta_{3}=\theta_{1}+\theta_{2}\)에서 \(2\theta_{1}+\theta_{2}=\pi\)이므로 \(\angle\mathrm{CO_{1}B}=\theta_{1}\)이다.</p>
        <p>이때 \(\angle\mathrm{O_{2}O_{1}B}=\theta_{1}+\theta_{2}=\theta_{3}\)이므로 삼각형 \(\mathrm{O_{1}O_{2}B}\)와 삼각형 \(\mathrm{O_{2}O_{1}D}\)는 합동이다.</p>
        <p>\(\overline{\mathrm{AB}}=k\)라 할 때</p>
        <p>\(\overline{\mathrm{BO_{2}}}=\overline{\mathrm{O_{1}D}}=2\sqrt{2}\,k\)이므로 \(\overline{\mathrm{AO_{2}}}=\fbox{(가)}\)이고,</p>
        <p>\(\angle\mathrm{BO_{2}A}=\dfrac{\theta_{1}}{2}\)이므로 \(\cos\dfrac{\theta_{1}}{2}=\fbox{(나)}\)이다.</p>
        <p>삼각형 \(\mathrm{O_{2}BC}\)에서 \(\overline{\mathrm{BC}}=k\), \(\overline{\mathrm{BO_{2}}}=2\sqrt{2}\,k\), \(\angle\mathrm{CO_{2}B}=\dfrac{\theta_{1}}{2}\)이므로 코사인법칙에 의하여 \(\overline{\mathrm{O_{2}C}}=\fbox{(다)}\)이다.</p>
        <p>\(\overline{\mathrm{CD}}=\overline{\mathrm{O_{2}D}}+\overline{\mathrm{O_{2}C}}=\overline{\mathrm{O_{1}O_{2}}}+\overline{\mathrm{O_{2}C}}\)이므로</p>
        \[\overline{\mathrm{AB}}:\overline{\mathrm{CD}}=k:\left(\frac{\fbox{(가)}}{2}+\fbox{(다)}\right)\]
        <p>이다.</p>
        </div>
        위의 (가), (다)에 알맞은 식을 각각 \(f(k)\), \(g(k)\)라 하고,
        (나)에 알맞은 수를 \(p\)라 할 때, \(f(p)\times g(p)\)의 값은?`,
      choices: [R`\(\dfrac{169}{27}\)`, R`\(\dfrac{56}{9}\)`, R`\(\dfrac{167}{27}\)`, R`\(\dfrac{166}{27}\)`, R`\(\dfrac{55}{9}\)`],
      answer: 2,
      help: R`두 원의 반지름이 모두 \(\overline{\mathrm{O_{1}O_{2}}}\)로 같다는 것이 이 문제의 뼈대다. 그래서 \(\overline{\mathrm{O_{1}O_{2}}}=\overline{\mathrm{O_{1}B}}=\overline{\mathrm{O_{2}D}}\)가 되고, 과정 상자가 말하는 두 삼각형의 합동도 여기서 나온다.`
    },
{
      id: "2022-suneung-20", exam: "2022-suneung", no: 20, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "한 구간의 값이 다음 구간을 낳는 함수",
      body: R`실수 전체의 집합에서 미분가능한 함수 \(f(x)\)가 다음 조건을
        만족시킨다.`,
      note: [
        R`(가) 닫힌구간 \([0,\,1]\)에서 \(f(x)=x\)이다.`,
        R`(나) 어떤 상수 \(a\), \(b\)에 대하여 구간 \([0,\,\infty)\)에서 \(f(x+1)-xf(x)=ax+b\)이다.`
      ],
      bodyAfter: R`\(60\times\displaystyle\int_{1}^{2}f(x)\,dx\)의 값을 구하시오.`,
      short: true,
      answer: 110,
      help: R`(가)에서 \([0,\,1]\)의 값이 이미 정해져 있으므로, (나)에 \(x\)를 그 구간에서 잡으면 \(f(x+1)=xf(x)+ax+b=x^{2}+ax+b\)가 되어 \([1,\,2]\)에서의 \(f\)가 곧바로 나온다. 남은 것은 \(x=1\)에서 매끄럽게 이어져야 한다는 조건이다.`
    },
{
      id: "2022-suneung-21", exam: "2022-suneung", no: 21, score: 4,
      units: ["m1-seq"], memo: "크기는 정해지고 부호만 고르는 수열",
      body: R`수열 \(\{a_{n}\}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(\bigl|a_{1}\bigr|=2\)`,
        R`(나) 모든 자연수 \(n\)에 대하여 \(\bigl|a_{n+1}\bigr|=2\bigl|a_{n}\bigr|\)이다.`,
        R`(다) \(\displaystyle\sum_{n=1}^{10}a_{n}=-14\)`
      ],
      bodyAfter: R`\(a_{1}+a_{3}+a_{5}+a_{7}+a_{9}\)의 값을 구하시오.`,
      short: true,
      answer: 678,
      help: R`(가)와 (나)에서 \(\bigl|a_{n}\bigr|=2^{n}\)이므로 각 항은 \(\pm 2^{n}\)이고 고를 것은 부호뿐이다. \(2^{10}=1024\)가 나머지 항들을 다 합친 것보다 크므로, 합이 \(-14\)가 되려면 큰 항의 부호부터 저절로 정해진다.`
    },
{
      id: "2022-suneung-22", exam: "2022-suneung", no: 22, score: 4,
      units: ["m2-diff"], memo: "길이 2인 창에 든 도함수의 근 세기",
      body: R`최고차항의 계수가 \(\dfrac{1}{2}\)인 삼차함수 \(f(x)\)와 실수 \(t\)에 대하여
        방정식 \(f'(x)=0\)이 닫힌구간 \([t,\,t+2]\)에서 갖는 실근의 개수를
        \(g(t)\)라 할 때, 함수 \(g(t)\)는 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 모든 실수 \(a\)에 대하여 \(\displaystyle\lim_{t\to a+}g(t)+\lim_{t\to a-}g(t)\le 2\)이다.`,
        R`(나) \(g\bigl(f(1)\bigr)=g\bigl(f(4)\bigr)=2\), \(g\bigl(f(0)\bigr)=1\)`
      ],
      bodyAfter: R`\(f(5)\)의 값을 구하시오.`,
      short: true,
      answer: 9,
      help: R`\(g(t)\)는 길이 \(2\)인 창 \([t,\,t+2]\) 안에 \(f'(x)=0\)의 근이 몇 개 들어 있는지를 센 것이다. \(f\)가 삼차함수라 \(f'\)의 근은 많아야 둘이고, 그 두 근 사이의 거리가 \(2\)보다 큰지 작은지에 따라 \(g\)가 \(2\)까지 오를 수 있는지가 갈린다.`
    },
{
      id: "2022-suneung-prob-28", exam: "2022-suneung", no: 28, score: 4,
      units: ["prob-count"], memo: "부등식과 치역의 크기를 만족시키는 함수의 개수",
      body: R`두 집합 \(X=\{1, 2, 3, 4, 5\}\), \(Y=\{1, 2, 3, 4\}\)에 대하여 다음 조건을 만족시키는 \(X\)에서 \(Y\)로의 함수 \(f\)의 개수는?`,
      noteTitle: "조 건",
      note: [
        R`(가) 집합 \(X\)의 모든 원소 \(x\)에 대하여 \(f(x)\ge \sqrt{x}\)이다.`,
        R`(나) 함수 \(f\)의 치역의 원소의 개수는 \(3\)이다.`
      ],
      choices: [R`\(128\)`, R`\(138\)`, R`\(148\)`, R`\(158\)`, R`\(168\)`],
      answer: 1,
      help: R`조건 (가)에 의해 \(f(1)\ge 1\), \(f(2)\ge 2\), \(f(3)\ge 2\), \(f(4)\ge 2\), \(f(5)\ge 3\)이다. 치역의 크기가 3이 되는 3개 원소의 부분집합 \(\{1, 2, 3\}, \{1, 2, 4\}, \{1, 3, 4\}, \{2, 3, 4\}\) 각각에 대해 각 원소가 치역 전체를 덮도록 전사함수의 개수를 포함배제로 구한다.`
    },
{
      id: "2022-suneung-prob-29", exam: "2022-suneung", no: 29, score: 4,
      units: ["prob-stat"], memo: "확률밀도함수의 성질과 정적분 넓이",
      body: R`두 연속확률변수 \(X\)와 \(Y\)가 갖는 값의 범위는 \(0\le X\le 6\), \(0\le Y\le 6\)이고, \(X\)와 \(Y\)의 확률밀도함수는 각각 \(f(x)\), \(g(x)\)이다. 확률변수 \(X\)의 확률밀도함수 \(f(x)\)의 그래프는 그림과 같다.
\(0\le x\le 6\)인 모든 \(x\)에 대하여
\[f(x)+g(x)=k\quad(k\text{는 상수})\]
를 만족시킬 때, \(\mathrm{P}(6k\le Y\le 15k)=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2022-suneung-prob-29.webp",
      short: true,
      answer: 31,
      help: R`\(\int_0^6 f(x)\,dx = 1\)이고 \(\int_0^6 g(x)\,dx = 1\)이므로 \(\int_0^6 (f+g)\,dx = 6k = 2 \implies k = \dfrac{1}{3}\)가 아니라 구간 길이 6에서 \(k=\dfrac{1}{3}\)을 구하고 \(\mathrm{P}(2\le Y\le 5) = \int_2^5 (k - f(x))\,dx\)를 직사각형 넓이에서 \(f(x)\)의 넓이를 빼서 계산한다.`
    },
{
      id: "2022-suneung-prob-30", exam: "2022-suneung", no: 30, score: 4,
      units: ["prob-prob"], memo: "주사위 시행과 공 개수 일치 조건부확률",
      body: R`흰 공과 검은 공이 각각 \(10\)개 이상 들어 있는 바구니와 비어 있는 주머니가 있다. 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(5\) 이상이면 바구니에 있는 흰 공 \(2\)개를 주머니에 넣고, 나온 눈의 수가 \(4\) 이하이면 바구니에 있는 검은 공 \(1\)개를 주머니에 넣는다.
위의 시행을 \(5\)번 반복할 때, \(n\,(1\le n\le 5)\)번째 시행 후 주머니에 들어 있는 흰 공과 검은 공의 개수를 각각 \(a_n\), \(b_n\)이라 하자. \(a_5+b_5\ge 7\)일 때, \(a_k=b_k\)인 자연수 \(k\,(1\le k\le 5)\)가 존재할 확률은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 191,
      help: R`눈 5 이상(흰공 2개 추가) 확률은 \(\dfrac{1}{3}\), 눈 4 이하(검은공 1개 추가) 확률은 \(\dfrac{2}{3}\)이다. 5회 중 5 이상이 나온 횟수를 \(X\)라 하면 총 공의 개수는 \(2X + (5-X) = X + 5\ge 7 \implies X\ge 2\)이다. \(X\in\{2, 3, 4, 5\}\)인 각 경우에 대해 중간에 \(a_k=b_k\) (즉 흰공 개수와 검은공 개수가 같아지는 순간)가 존재하는 경로를 추적하여 조건부확률을 구한다.`
    },
{
      id: "2022-suneung-calc-28", exam: "2022-suneung", no: 28, score: 4,
      units: ["calc-diff"], memo: "합성함수의 미분과 극소의 개수",
      body: R`함수 \(f(x)=6\pi(x-1)^{2}\)에 대하여 함수 \(g(x)\)를 \[g(x)=3f(x)+4\cos f(x)\]라 하자. \(0&lt;x&lt;2\)에서 함수 \(g(x)\)가 극소가 되는 \(x\)의 개수는?`,
      choices: [R`\(6\)`, R`\(7\)`, R`\(8\)`, R`\(9\)`, R`\(10\)`],
      answer: 2,
      help: R`\(g'(x)=f'(x)\{3-4\sin f(x)\}\)에서 도함수의 부호가 음에서 양으로 바뀌는 지점을 찾습니다. \(f(x)=t\)로 치환하여 \(t\)의 범위 \(0\le t&lt;6\pi\)에서 \(\sin t=\frac{3}{4}\)의 근과 \(f'(x)=0\)인 \(x=1\) 주변의 부호 변화를 조사합니다.`
    },
{
      id: "2022-suneung-calc-29", exam: "2022-suneung", no: 29, score: 4,
      units: ["calc-diff"], memo: "삼각함수의 극한과 정삼각형의 넓이",
      body: R`그림과 같이 길이가 \(2\)인 선분 \(\mathrm{AB}\)를 지름으로 하는 반원이 있다. 호 \(\mathrm{AB}\) 위에 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)를 \(\angle\mathrm{PAB}=\theta\), \(\angle\mathrm{QBA}=2\theta\)가 되도록 잡고, 두 선분 \(\mathrm{AP}\), \(\mathrm{BQ}\)의 교점을 \(\mathrm{R}\)라 하자. 선분 \(\mathrm{AB}\) 위의 점 \(\mathrm{S}\), 선분 \(\mathrm{BR}\) 위의 점 \(\mathrm{T}\), 선분 \(\mathrm{AR}\) 위의 점 \(\mathrm{U}\)를 선분 \(\mathrm{UT}\)가 선분 \(\mathrm{AB}\)에 평행하고 삼각형 \(\mathrm{STU}\)가 정삼각형이 되도록 잡는다. 두 선분 \(\mathrm{AR}\), \(\mathrm{QR}\)와 호 \(\mathrm{AQ}\)로 둘러싸인 부분의 넓이를 \(f(\theta)\), 삼각형 \(\mathrm{STU}\)의 넓이를 \(g(\theta)\)라 할 때, \[\lim_{\theta\to 0+}\dfrac{g(\theta)}{\theta\times f(\theta)}=\dfrac{q}{p}\sqrt{3}\]이다. \(p+q\)의 값을 구하시오. (단, \(0&lt;\theta&lt;\dfrac{\pi}{6}\)이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2022-suneung-calc-29.webp",
      short: true,
      answer: 11,
      help: R`\(\triangle\mathrm{ABR}\)에서 사인법칙으로 \(\overline{\mathrm{AR}}\), \(\overline{\mathrm{BR}}\)의 길이를 구하고 부채꼴과 삼각형의 차로 \(f(\theta)\)를 구합니다. 정삼각형 \(\mathrm{STU}\)의 한 변의 길이를 미지수로 두고 수선의 발과 각도를 이용하여 \(\theta\)에 대한 식으로 표현합니다.`
    },
{
      id: "2022-suneung-calc-30", exam: "2022-suneung", no: 30, score: 4,
      units: ["calc-integ"], memo: "역함수와 부분적분법",
      body: R`실수 전체의 집합에서 증가하고 미분가능한 함수 \(f(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`\(f(1)=1\), \(\displaystyle\int_{1}^{2}f(x)\,dx=\dfrac{5}{4}\)`,
        R`함수 \(f(x)\)의 역함수를 \(g(x)\)라 할 때, \(x\ge 1\)인 모든 실수 \(x\)에 대하여 \(g(2x)=2f(x)\)이다.`
      ],
            bodyAfter: R`\(\displaystyle\int_{1}^{8}xf'(x)\,dx=\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 143,
      help: R`부분적분법 \(\int_1^8 xf'(x)\,dx = [xf(x)]_1^8 - \int_1^8 f(x)\,dx\)를 세웁니다. 조건 (나)의 관계식을 치환하여 구간 \([1, 2], [2, 4], [4, 8]\)에서의 정적분 값을 순차적으로 유도합니다.`
    },
{
      id: "2022-suneung-geom-28", exam: "2022-suneung", no: 28, score: 4,
      units: ["geom-curve"], memo: "두 포물선의 초점을 잇는 선분과 포물선의 정의",
      body: R`두 양수 \(a, p\)에 대하여 포물선 \((y-a)^2=4px\)의 초점을 \(\mathrm{F}_1\)이라 하고, 포물선 \(y^2=-4x\)의 초점을 \(\mathrm{F}_2\)라 하자. 선분 \(\mathrm{F}_1\mathrm{F}_2\)가 두 포물선과 만나는 점을 각각 \(\mathrm{P}, \mathrm{Q}\)라 할 때, \(\overline{\mathrm{F}_1\mathrm{F}_2}=3, \overline{\mathrm{PQ}}=1\)이다. \(a^2+p^2\)의 값은?`,
      figure: "2022-suneung-geom-28.webp",
      choices: [R`\(6\)`, R`\(\dfrac{25}{4}\)`, R`\(\dfrac{13}{2}\)`, R`\(\dfrac{27}{4}\)`, R`\(7\)`],
      answer: 5,
      help: R`두 포물선의 초점은 \(\mathrm{F}_1(p, a), \mathrm{F}_2(-1, 0)\)이고 \(\overline{\mathrm{F}_1\mathrm{F}_2}=\sqrt{(p+1)^2+a^2}=3\)이다. 두 점 \(\mathrm{P}, \mathrm{Q}\)에서의 준선까지 거리를 포물선의 정의로 표현하고, 선분 \(\mathrm{F}_1\mathrm{F}_2\) 위의 내분 관계와 \(\overline{\mathrm{PQ}}=1\) 조건을 결합하여 \(p\)와 \(a\)를 구한다.`
    },
{
      id: "2022-suneung-geom-29", exam: "2022-suneung", no: 29, score: 4,
      units: ["geom-vector"], memo: "평행사변형 내부 점의 내적 조건과 선분 궤적, 원 위의 동점까지 거리 최대·최소",
      body: R`좌표평면에서 \(\overline{\mathrm{OA}}=\sqrt{2}, \overline{\mathrm{OB}}=2\sqrt{2}\)이고 \(\cos(\angle\mathrm{AOB})=\dfrac{1}{4}\)인 평행사변형 \(\mathrm{OACB}\)에 대하여 점 \(\mathrm{P}\)가 다음 조건을 만족시킨다.`,
      figure: "2022-suneung-geom-29.webp",
      note: [
        R`(가) \(\vec{\mathrm{OP}}=s\vec{\mathrm{OA}}+t\vec{\mathrm{OB}}\) (\(0\le s\le 1, 0\le t\le 1\))`,
        R`(나) \(\vec{\mathrm{OP}}\cdot\vec{\mathrm{OB}}+\vec{\mathrm{BP}}\cdot\vec{\mathrm{BC}}=2\)`
      ],
            bodyAfter: R`점 \(\mathrm{O}\)를 중심으로 하고 점 \(\mathrm{A}\)를 지나는 원 위를 움직이는 점 \(\mathrm{X}\)에 대하여 \(|3\vec{\mathrm{OP}}-\vec{\mathrm{OX}}|\)의 최댓값과 최솟값을 각각 \(M, m\)이라 하자. \(M\times m=a\sqrt{6}+b\)일 때, \(a^2+b^2\)의 값을 구하시오. (단, \(a\)와 \(b\)는 유리수이다.)`,
short: true,
      answer: 100,
      help: R`조건 (나)에 \(\vec{\mathrm{OP}}=s\vec{\mathrm{OA}}+t\vec{\mathrm{OB}}\)와 \(\vec{\mathrm{BC}}=\vec{\mathrm{OA}}\)를 대입하여 내적을 계산하면 \(2s+8t=2\), 즉 \(s+4t=1\)인 선분을 얻는다. 점 \(3\mathrm{P}\)가 그리는 선분 위의 점에서 원점까지의 최단·최장거리를 구한 뒤 반지름 \(r=\sqrt{2}\)를 더하고 빼서 \(M\)과 \(m\)을 구한다.`
    },
{
      id: "2022-suneung-geom-30", exam: "2022-suneung", no: 30, score: 4,
      units: ["geom-space"], memo: "구의 대원과 구 위의 점의 정사영 넓이 최대 및 이면각",
      body: R`좌표공간에 중심이 \(\mathrm{C}(2, \sqrt{5}, 5)\)이고 점 \(\mathrm{P}(0, 0, 1)\)을 지나는 구
\[S: (x-2)^2+(y-\sqrt{5})^2+(z-5)^2=25\]
가 있다. 구 \(S\)가 평면 \(\mathrm{OPC}\)와 만나서 생기는 원 위를 움직이는 점 \(\mathrm{Q}\), 구 \(S\) 위를 움직이는 점 \(\mathrm{R}\)에 대하여 두 점 \(\mathrm{Q}, \mathrm{R}\)의 \(xy\)평면 위로의 정사영을 각각 \(\mathrm{Q}_1, \mathrm{R}_1\)이라 하자. 삼각형 \(\mathrm{O}\mathrm{Q}_1\mathrm{R}_1\)의 넓이가 최대가 되도록 하는 두 점 \(\mathrm{Q}, \mathrm{R}\)에 대하여 삼각형 \(\mathrm{O}\mathrm{Q}_1\mathrm{R}_1\)의 평면 \(\mathrm{PQR}\) 위로의 정사영의 넓이는 \(\dfrac{q}{p}\sqrt{6}\)이다. \(p+q\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이고 세 점 \(\mathrm{O}, \mathrm{Q}_1, \mathrm{R}_1\)은 한 직선 위에 있지 않으며, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2022-suneung-geom-30.webp",
      short: true,
      answer: 23,
      help: R`평면 \(\mathrm{OPC}\)는 원점을 지나므로 \(xy\)평면 위의 정사영 선분 \(\mathrm{OQ}_1\)의 위치를 삼각함수로 표현한다. \(\triangle \mathrm{OQ}_1\mathrm{R}_1\)의 넓이가 최대가 되는 기하학적 배치에서 점 \(\mathrm{Q}\)와 \(\mathrm{R}\)의 3차원 좌표를 결정하고, 평면 \(\mathrm{PQR}\)의 법선벡터를 구해 \(xy\)평면과의 이면각 코사인을 곱하여 정사영 넓이를 구한다.`
    }
  ];
})();
