(function () {
  "use strict";
  const R = String.raw;
  // 2026-suneung 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2026-suneung"] = [
{
      id: "2026-suneung-9", exam: "2026-suneung", no: 9, score: 4,
      units: ["m2-diff"], memo: "삼차함수에 접하는 직선",
      body: R`양수 \(a\)에 대하여 함수 \(f(x)\)를
        \[f(x)=x^{3}+3ax^{2}-9a^{2}x+4\]
        라 하자. 직선 \(y=5\)가 곡선 \(y=f(x)\)에 접할 때, \(f(2)\)의 값은?`,
      choices: [R`\(11\)`, R`\(12\)`, R`\(13\)`, R`\(14\)`, R`\(15\)`],
      answer: 4,
      help: R`직선 \(y=5\)가 접한다는 것은 극댓값이나 극솟값이 \(5\)라는 뜻이다. \(f'(x)=3(x+3a)(x-a)\)이고 \(a>0\)이므로 극솟값은 \(f(a)=-5a^{3}+4&lt;4\)라 \(5\)가 될 수 없다. 남는 것은 극댓값 \(f(-3a)=27a^{3}+4=5\) 하나뿐이다.`
    },
{
      id: "2026-suneung-10", exam: "2026-suneung", no: 10, score: 4,
      units: ["m1-explog"], memo: "지수함수 그래프와 도형의 넓이",
      body: R`상수 \(a\,(a>1)\)에 대하여 곡선 \(y=a^{x}-2\) 위의 점 중
        제1사분면에 있는 점 \(\mathrm{A}\)를 지나고 \(y\)축에 평행한 직선이 \(x\)축과
        만나는 점을 \(\mathrm{B}\), 곡선 \(y=a^{x}-2\)의 점근선과 만나는 점을 \(\mathrm{C}\)라
        하자. \(\overline{\mathrm{AB}}=\overline{\mathrm{BC}}\)이고 삼각형 \(\mathrm{AOC}\)의 넓이가 \(8\)일 때,
        \(a\times\overline{\mathrm{OB}}\)의 값은? (단, \(\mathrm{O}\)는 원점이다.)`,
      choices: [R`\(2^{\frac{13}{6}}\)`, R`\(2^{\frac{7}{3}}\)`, R`\(2^{\frac{5}{2}}\)`, R`\(2^{\frac{8}{3}}\)`, R`\(2^{\frac{17}{6}}\)`],
      answer: 3,
      help: R`세 점이 모두 \(x=t\) 위에 세로로 놓이고 점근선은 \(y=-2\)다. \(\overline{\mathrm{AB}}=a^{t}-2\), \(\overline{\mathrm{BC}}=2\)이므로 \(a^{t}=4\)가 곧바로 나온다. 삼각형 \(\mathrm{AOC}\)의 밑변은 세로 선분 \(\overline{\mathrm{AC}}=a^{t}\)이고 높이가 \(t\)다.`
    },
{
      id: "2026-suneung-11", exam: "2026-suneung", no: 11, score: 4,
      units: ["m2-integ"], memo: "속도와 위치, 움직인 거리",
      body: R`시각 \(t=0\)일 때 원점을 출발하여 수직선 위를 움직이는
        점 \(\mathrm{P}\)가 있다. 실수 \(k\)에 대하여 시각이 \(t\,(t\ge 0)\)일 때 점 \(\mathrm{P}\)의
        속도 \(v(t)\)가
        \[v(t)=t^{2}-kt+4\]
        이다. &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(k=0\)이면, 시각 \(t=1\)일 때 점 \(\mathrm{P}\)의 위치는 \(\dfrac{13}{3}\)이다.`,
        R`ㄴ. \(k=3\)이면, 출발한 후 점 \(\mathrm{P}\)의 운동 방향이 한 번 바뀐다.`,
        R`ㄷ. \(k=5\)이면, 시각 \(t=0\)에서 \(t=2\)까지 점 \(\mathrm{P}\)가 움직인 거리는 \(3\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 3,
      help: R`위치는 \(\int_{0}^{t}v\), 움직인 거리는 \(\int_{0}^{t}|v|\)다. ㄴ은 계산할 것이 없다. \(t^{2}-3t+4\)는 판별식이 음수라 속도의 부호가 바뀌지 않고, 그러면 운동 방향도 바뀌지 않는다.`
    },
{
      id: "2026-suneung-12", exam: "2026-suneung", no: 12, score: 4,
      units: ["m1-seq"], memo: "등비수열의 항 사이 관계",
      body: R`등비수열 \(\{a_{n}\}\)이
        \[2\left(a_{1}+a_{4}+a_{7}\right)=a_{4}+a_{7}+a_{10}=6\]
        을 만족시킬 때, \(a_{10}\)의 값은?`,
      choices: [R`\(\dfrac{22}{7}\)`, R`\(\dfrac{24}{7}\)`, R`\(\dfrac{26}{7}\)`, R`\(\dfrac{30}{7}\)`, R`\(\dfrac{32}{7}\)`],
      answer: 2,
      help: R`\(a_{4}+a_{7}+a_{10}\)은 \(a_{1}+a_{4}+a_{7}\)에 \(r^{3}\)을 곱한 것이다. 이걸 보면 \(r^{3}=2\)와 \(a_{1}+a_{4}+a_{7}=3\)이 한 줄에 나온다.`
    },
{
      id: "2026-suneung-13", exam: "2026-suneung", no: 13, score: 4,
      units: ["m2-diff"], memo: "두 접선으로 둘러싸인 넓이",
      body: R`함수 \(f(x)=x^{2}-4x-3\)에 대하여
        곡선 \(y=f(x)\) 위의 점 \((1,\,-6)\)에서의 접선을 \(l\)이라 하고,
        함수 \(g(x)=\left(x^{3}-2x\right)f(x)\)에 대하여
        곡선 \(y=g(x)\) 위의 점 \((1,\,6)\)에서의 접선을 \(m\)이라 하자.
        두 직선 \(l\), \(m\)과 \(y\)축으로 둘러싸인 도형의 넓이는?`,
      choices: [R`\(21\)`, R`\(28\)`, R`\(35\)`, R`\(42\)`, R`\(49\)`],
      answer: 5,
      help: R`두 직선과 \(y\)축이 둘러싸는 도형은 삼각형이라 적분이 필요 없다. \(g'(1)\)은 곱의 미분으로 \(x=1\)에서의 값만 내면 되므로 \(g\)를 전개할 일도 없다.`
    },
{
      id: "2026-suneung-14", exam: "2026-suneung", no: 14, score: 4,
      units: ["m1-trig"], memo: "원과 삼각형에서 길이 구하기",
      body: R`그림과 같이 \(\overline{\mathrm{AB}}=3\), \(\overline{\mathrm{BC}}=4\)이고 \(\angle\mathrm{B}=\dfrac{\pi}{2}\)인 직각삼각형
        \(\mathrm{ABC}\)가 있다. 선분 \(\mathrm{AB}\)를 \(2:1\)로 내분하는 점을 \(\mathrm{D}\),
        점 \(\mathrm{A}\)를 중심으로 하고 반지름의 길이가 \(\overline{\mathrm{AD}}\)인 원이 선분 \(\mathrm{AC}\)와
        만나는 점을 \(\mathrm{E}\), 직선 \(\mathrm{AB}\)가 이 원과 만나는 점 중 \(\mathrm{D}\)가 아닌 점을
        \(\mathrm{F}\)라 하고, 호 \(\mathrm{EF}\) 위의 점 \(\mathrm{G}\)를 \(\overline{\mathrm{CG}}=2\sqrt{6}\)이 되도록 잡는다.
        세 점 \(\mathrm{C}\), \(\mathrm{E}\), \(\mathrm{G}\)를 지나는 원 위의 점 \(\mathrm{H}\)가 \(\angle\mathrm{HCG}=\angle\mathrm{BAC}\)를
        만족시킬 때, 선분 \(\mathrm{GH}\)의 길이는?`,
      figure: "2026-suneung-14.webp",
      choices: [R`\(\dfrac{6\sqrt{15}}{5}\)`, R`\(\dfrac{38\sqrt{10}}{25}\)`, R`\(\dfrac{14\sqrt{3}}{5}\)`, R`\(\dfrac{32\sqrt{15}}{25}\)`, R`\(\dfrac{8\sqrt{10}}{5}\)`],
      answer: 4,
      help: R`\(\overline{\mathrm{AB}}=3\)을 \(2:1\)로 나누므로 원의 반지름이 \(2\)이고, 따라서 \(\overline{\mathrm{AE}}=2\)다. \(\angle\mathrm{HCG}=\angle\mathrm{BAC}\)는 길이가 아니라 원주각 조건이라 사인법칙으로 넘어가라는 신호다.`
    },
{
      id: "2026-suneung-15", exam: "2026-suneung", no: 15, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "정적분으로 정의된 함수의 극값",
      body: R`함수 \(f(x)\)가
        \[f(x)=\begin{cases}-x^{2} &amp; (x&lt;0)\\ x^{2}-x &amp; (x\ge 0)\end{cases}\]
        이고, 양수 \(a\)에 대하여 함수 \(g(x)\)를
        \[g(x)=\begin{cases}ax+a &amp; (x&lt;-1)\\ 0 &amp; (-1\le x&lt;1)\\ ax-a &amp; (x\ge 1)\end{cases}\]
        이라 하자. 함수 \(h(x)=\displaystyle\int_{0}^{x}\bigl(g(t)-f(t)\bigr)\,dt\)가 오직 하나의
        극값을 갖도록 하는 \(a\)의 최댓값을 \(k\)라 하자. \(a=k\)일 때,
        \(k+h(3)\)의 값은?`,
      choices: [R`\(\dfrac{9}{2}\)`, R`\(\dfrac{11}{2}\)`, R`\(\dfrac{13}{2}\)`, R`\(\dfrac{15}{2}\)`, R`\(\dfrac{17}{2}\)`],
      answer: 4,
      help: R`\(h'(x)=g(x)-f(x)\)다. 극값이 오직 하나라는 말은 이 차가 부호를 딱 한 번만 바꾼다는 뜻이다.`
    },
{
      id: "2026-suneung-20", exam: "2026-suneung", no: 20, score: 4,
      units: ["m1-seq"], memo: "수열의 합과 귀납적 관계",
      body: R`수열 \(\{a_{n}\}\)이 다음 조건을 만족시킨다.`,
      bullets: true,
      note: [
        R`\(a_{1}=7\)`,
        R`\(2\) 이상의 자연수 \(n\)에 대하여 \(\displaystyle\sum_{k=1}^{n}a_{k}=\frac{2}{3}a_{n}+\frac{1}{6}n^{2}-\frac{1}{6}n+10\) 이다.`
      ],
      bodyAfter: R`다음은 \(\displaystyle\sum_{k=1}^{12}a_{k}+\sum_{k=1}^{5}a_{2k+1}\)의 값을 구하는 과정이다.
        <div class="proof-box">
        <p>\(2\) 이상의 자연수 \(n\)에 대하여 \(a_{n+1}=\displaystyle\sum_{k=1}^{n+1}a_{k}-\sum_{k=1}^{n}a_{k}\)이므로</p>
        \[a_{n+1}=\frac{2}{3}\left(a_{n+1}-a_{n}\right)+\fbox{(가)}\]
        <p>이고, 이 식을 정리하면</p>
        \[2a_{n}+a_{n+1}=3\times\fbox{(가)}\qquad \cdots\cdots\ ㉠\]
        <p>이다.</p>
        \[\sum_{k=1}^{n}a_{k}=\frac{2}{3}a_{n}+\frac{1}{6}n^{2}-\frac{1}{6}n+10\quad(n\ge 2)\]
        <p>에서 양변에 \(n=2\)를 대입하면</p>
        \[a_{2}=\fbox{(나)}\qquad \cdots\cdots\ ㉡\]
        <p>이다. ㉠과 ㉡에 의하여</p>
        \[\sum_{k=1}^{12}a_{k}+\sum_{k=1}^{5}a_{2k+1}=a_{1}+a_{2}+\sum_{k=1}^{5}\left(2a_{2k+1}+a_{2k+2}\right)=\fbox{(다)}\]
        <p>이다.</p>
        </div>
        위의 (가)에 알맞은 식을 \(f(n)\)이라 하고, (나), (다)에 알맞은
        수를 각각 \(p\), \(q\)라 할 때, \(\dfrac{p\times q}{f(12)}\)의 값을 구하시오.`,
      short: true,
      answer: 130,
      help: R`\(a_{n+1}=\sum^{n+1}-\sum^{n}\)을 그대로 빼면 (가)가 \(\frac{n}{3}\)으로 나온다. 그리고 ㉠에 \(n=2k+1\)을 넣으면 \(2a_{2k+1}+a_{2k+2}=2k+1\)이 되어, 다섯 항의 묶음이 \(3+5+7+9+11\)이 된다.`
    },
{
      id: "2026-suneung-21", exam: "2026-suneung", no: 21, score: 4,
      units: ["m2-limit"], memo: "연속과 극한 조건으로 함수 결정하기",
      body: R`최고차항의 계수가 양수인 삼차함수 \(f(x)\)와 실수 \(t\)에
        대하여 함수
        \[g(x)=\begin{cases}-f(x) &amp; (x&lt;t)\\ \ \ f(x) &amp; (x\ge t)\end{cases}\]
        는 실수 전체의 집합에서 연속이고 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 모든 실수 \(a\)에 대하여 \(\displaystyle\lim_{x\to a+}\frac{g(x)}{x(x-2)}\)의 값이 존재한다.`,
        R`(나) \(\displaystyle\lim_{x\to m+}\frac{g(x)}{x(x-2)}\)의 값이 음수가 되도록 하는 자연수 \(m\)의 집합은 \(\left\{g(-1),\,-\dfrac{7}{2}g(1)\right\}\)이다.`
      ],
      bodyAfter: R`\(g(-5)\)의 값을 구하시오. \(\left(\text{단, } g(-1)\ne-\dfrac{7}{2}g(1)\right)\)`,
      short: true,
      answer: 65,
      help: R`\(x=t\)에서 이어지려면 \(-f(t)=f(t)\), 곧 \(f(t)=0\)이다. 그리고 (가)에서 \(\frac{g(x)}{x(x-2)}\)의 극한이 어디서나 있으려면 \(g\)가 \(x\)와 \(x-2\)를 인수로 가져야 한다.`
    },
{
      id: "2026-suneung-22", exam: "2026-suneung", no: 22, score: 4,
      units: ["m1-explog"], memo: "지수·로그 그래프의 대칭과 중점",
      body: R`곡선 \(y=\log_{16}(8x+2)\) 위의 점 \(\mathrm{A}(a,\,b)\)와
        곡선 \(y=4^{\,x-1}-\dfrac{1}{2}\) 위의 점 \(\mathrm{B}\)가 제1사분면에 있다.
        점 \(\mathrm{A}\)를 직선 \(y=x\)에 대하여 대칭이동한 점이 직선 \(\mathrm{OB}\) 위에
        있고 선분 \(\mathrm{AB}\)의 중점의 좌표가 \(\left(\dfrac{77}{8},\,\dfrac{133}{8}\right)\)일 때,
        \(a\times b=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오.
        (단, \(\mathrm{O}\)는 원점이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 457,
      help: R`\(\mathrm{A}(a,b)\)를 \(y=x\)에 대칭하면 \((b,a)\)이고, 이 점이 직선 \(\mathrm{OB}\) 위에 있다는 것이 첫 식이다. 중점 조건은 \(x\)에서 하나, \(y\)에서 하나로 식이 두 개다.`
    },
{
      id: "2026-suneung-prob-28", exam: "2026-suneung", no: 28, score: 4,
      units: ["prob-prob"], memo: "규칙에 따른 공 분배와 조건부확률",
      body: R`\(16\)개의 공과 \(1\)부터 \(6\)까지의 자연수가 하나씩 적혀 있는 여섯 개의 빈 상자가 있다. 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(k\)일 때,
\(k\)가 홀수이면 \(1\), \(3\), \(5\)가 적힌 상자에 공을 각각 \(1\)개씩 넣고,
\(k\)가 짝수이면 \(k\)의 약수가 적힌 상자에 공을 각각 \(1\)개씩 넣는다.
이 시행을 \(4\)번 반복한 후 여섯 개의 상자에 들어 있는 모든 공의 개수의 합이 홀수일 때, \(3\)이 적힌 상자에 들어 있는 공의 개수가 \(2\)가 적힌 상자에 들어 있는 공의 개수보다 \(1\)개 더 많을 확률은?`,
      choices: [R`\(\dfrac{1}{8}\)`, R`\(\dfrac{3}{16}\)`, R`\(\dfrac{1}{4}\)`, R`\(\dfrac{5}{16}\)`, R`\(\dfrac{3}{8}\)`],
      answer: 2,
      help: R`한 번 시행 시 넣는 공의 개수는 홀수 눈이면 3개(홀수), 눈 2는 2개(짝수), 눈 4는 3개(홀수), 눈 6은 4개(짝수)이다. 4회 시행 후 총 공 개수가 홀수이려면 1회당 추가 개수가 홀수인 사건(홀수 눈 또는 4)이 홀수 번(1번 또는 3번) 일어나야 한다. 조건부확률의 분모와 분자를 체계적으로 카운팅한다.`
    },
{
      id: "2026-suneung-prob-29", exam: "2026-suneung", no: 29, score: 4,
      units: ["prob-stat"], memo: "이항분포의 정규근사와 표준정규분포표",
      body: R`\(6\) 이하의 자연수 \(a\)에 대하여 한 개의 주사위와 한 개의 동전을 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(a\)보다 작거나 같으면 동전을 \(5\)번 던져 앞면이 나온 횟수를 기록하고, 나온 눈의 수가 \(a\)보다 크면 동전을 \(3\)번 던져 앞면이 나온 횟수를 기록한다.
이 시행을 \(19200\)번 반복하여 기록한 수가 \(3\)인 횟수를 확률변수 \(X\)라 하자.
\(\mathrm{E}(X)=4800\)일 때, \(\mathrm{P}(X\le 4800+30a)\)의 값을 오른쪽 표준정규분포표를 이용하여 구한 값이 \(k\)이다. \(1000\times k\)의 값을 구하시오.`,
      figure: "2026-suneung-prob-29.webp",
      short: true,
      answer: 977,
      help: R`1회 시행에서 3이 기록될 확률은 \(p = \dfrac{a}{6}\cdot{}_{5}\mathrm{C}_{3}\left(\dfrac{1}{2}\right)^5 + \dfrac{6-a}{6}\cdot{}_{3}\mathrm{C}_{3}\left(\dfrac{1}{2}\right)^3 = \dfrac{a+6}{48}\)이다. \(\mathrm{E}(X)=19200p=4800\)에서 \(p=\dfrac{1}{4}\implies a=6\)이 되어 \(X\sim\mathrm{B}\left(19200, \dfrac{1}{4}\right)\)이다. \(\sigma=\sqrt{19200\times\frac{1}{4}\times\frac{3}{4}}=60\)이므로 \(\mathrm{P}(X\le 4980)=\mathrm{P}(Z\le 3.0)=0.5+0.499=0.999\) 등 주어진 표준화 수치를 적용하여 정답을 낸다.`
    },
{
      id: "2026-suneung-prob-30", exam: "2026-suneung", no: 30, score: 4,
      units: ["prob-count"], memo: "주머니 공 분배와 이웃 조건 (중복조합)",
      body: R`비어 있는 주머니 \(10\)개가 일렬로 놓여 있고, 공 \(8\)개가 있다. 각 주머니에 들어 있는 공의 개수가 \(2\) 이하가 되도록 공을 주머니에 남김없이 나누어 넣을 때, 다음 조건을 만족시키는 경우의 수를 구하시오. (단, 공끼리는 서로 구별하지 않는다.)`,
      noteTitle: "조 건",
      note: [
        R`(가) 들어 있는 공의 개수가 \(1\)인 주머니는 \(4\)개 또는 \(6\)개이다.`,
        R`(나) 들어 있는 공의 개수가 \(2\)인 주머니와 이웃한 주머니에는 공이 들어 있지 않다.`
      ],
      short: true,
      answer: 262,
      help: R`공이 1개인 주머니가 4개이면 2개인 주머니는 2개, 빈 주머니 4개이고, 공이 1개인 주머니가 6개이면 2개인 주머니는 1개, 빈 주머니 3개이다. 조건 (나)에 의해 2개짜리 주머니의 양옆에는 반드시 빈 주머니가 붙어야 하므로 [빈-2-빈] 블록을 하나로 묶어 배치하는 전략으로 경우의 수를 센다.`
    },
{
      id: "2026-suneung-calc-28", exam: "2026-suneung", no: 28, score: 4,
      units: ["calc-integ"], memo: "접선의 y절편과 역함수의 정적분",
      body: R`함수
\[f(x)=\dfrac{1}{2}x^2-x+\ln(1+x)\]
와 양수 \(t\)에 대하여 점 \((s, f(s))\,(s>0)\)에서 \(y\)축에 내린 수선의 발과 곡선 \(y=f(x)\) 위의 점 \((s, f(s))\)에서의 접선이 \(y\)축과 만나는 점 사이의 거리가 \(t\)가 되도록 하는 \(s\)의 값을 \(g(t)\)라 하자. \(\int_{\frac{1}{2}}^{\frac{27}{4}} g(t)\,dt\)의 값은?`,
      choices: [R`\(\dfrac{161}{12}+\ln 3\)`, R`\(\dfrac{40}{3}+\ln 3\)`, R`\(\dfrac{53}{4}+\ln 2\)`, R`\(\dfrac{79}{6}+\ln 2\)`, R`\(\dfrac{157}{12}+\ln 2\)`],
      answer: 5,
      help: R`두 점 사이의 거리가 접선의 \(y\)절편 성질에 의해 \(t=s f'(s)=\dfrac{s^3}{1+s}\)임을 파악한다. \(s=g(t)\)는 \(h(s)=\dfrac{s^3}{1+s}\)의 역함수이므로 \(t=h(s)\)로 치환적분하여 적분 구간을 \(s=1\)부터 \(s=3\)까지로 바꾼다. 유리함수의 다항식 나눗셈 \(\dfrac{s^3}{s+1}=s^2-s+1-\dfrac{1}{s+1}\)을 통해 적분을 신속히 완결한다.`
    },
{
      id: "2026-suneung-calc-29", exam: "2026-suneung", no: 29, score: 4,
      units: ["calc-seq"], memo: "등비중항과 부분분수 급수의 합",
      body: R`첫째항과 공차가 같은 등차수열 \(\{a_n\}\)과 등비수열 \(\{b_n\}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`어떤 자연수 \(k\)에 대하여
\[b_{k+i}=\dfrac{1}{a_i}-1 \quad (i=1, 2, 3)\]
이다.`
      ],
            bodyAfter: R`부등식
\[0 &lt; \sum_{n=1}^\infty \left(b_n - \dfrac{1}{a_n a_{n+1}}\right) &lt; 30\]
이 성립할 때, \(a_2 \times \sum_{n=1}^\infty b_{2n} = \dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(a_1 \ne 0\)이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 97,
      help: R`등비중항 성질 \((b_{k+2})^2=b_{k+1}b_{k+3}\)에 \(a_i=i d\)를 대입하면 공차 \(d=\dfrac{1}{4}\)과 공비 \(r=\dfrac{1}{3}\)이 바로 결정된다. 부분분수 급수 \(\sum\dfrac{1}{a_n a_{n+1}}=16\)을 구한 뒤 부등식을 만족하는 자연수 \(k=2\)를 특정한다. 짝수 번째 항들의 등비급수 합 공식 \(\dfrac{b_2}{1-r^2}\)을 적용하여 답을 계산한다.`
    },
{
      id: "2026-suneung-calc-30", exam: "2026-suneung", no: 30, score: 4,
      units: ["calc-diff"], memo: "역함수의 성질과 접선의 개수",
      body: R`실수 전체의 집합에서 증가하는 연속함수 \(f(x)\)의 역함수 \(f^{-1}(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(|x| \le 1\)일 때, \(4\times(f^{-1}(x))^2 = x^2(x^2-5)^2\)이다.`,
        R`(나) \(|x| > 1\)일 때, \(|f^{-1}(x)| = e^{|x|-1}+1\)이다.`
      ],
            bodyAfter: R`실수 \(m\)에 대하여 기울기가 \(m\)이고 점 \((1, 0)\)을 지나는 직선이 곡선 \(y=f(x)\)와 만나는 점의 개수를 \(g(m)\)이라 하자. 함수 \(g(m)\)이 \(m=a\), \(m=b\,(a&lt;b)\)에서 불연속일 때,
\[g(a)\times\left(\lim_{m\to a+} g(m)\right) + g(b)\times\left(\dfrac{\ln b}{b}\right)^2\]
의 값을 구하시오. (단, \(\lim_{x\to\infty}\dfrac{\ln x}{x} = 0\))`,
short: true,
      answer: 11,
      help: R`\(f^{-1}(x)\)의 연속성과 증가성을 통해 구간별 식을 결정하고, 원함수 \(y=f(x)\)와 점 \((1, 0)\)을 지나는 직선의 위치관계를 파악한다. \(g(m)\)의 불연속점은 직선이 곡선에 접할 때 발생하므로, 접점 방정식을 풀어 불연속이 되는 기울기 \(a\)와 \(b=1\)을 구한다. 각 경계에서의 교점 개수 \(g(a)=3\), \(\lim_{m\to a+} g(m)=4\), \(g(1)=1\)을 대입하여 답을 계산한다.`
    },
{
      id: "2026-suneung-geom-28", exam: "2026-suneung", no: 28, score: 4,
      units: ["geom-space"], memo: "사면체 내부의 구와 원의 정사영 넓이",
      body: R`그림과 같이 \(\overline{\mathrm{AB}}=\overline{\mathrm{CD}}=4\), \(\overline{\mathrm{BC}}=\overline{\mathrm{BD}}=2\sqrt{5}\)인 사면체 \(\mathrm{ABCD}\)가 있고, 점 \(\mathrm{A}\)에서 직선 \(\mathrm{CD}\)에 내린 수선의 발 \(\mathrm{H}\)에 대하여 두 평면 \(\mathrm{ABH}\)와 \(\mathrm{BCD}\)는 서로 수직이고 \(\overline{\mathrm{AH}}=4\)이다. 삼각형 \(\mathrm{ABH}\)의 무게중심을 \(\mathrm{G}\)라 하고, 점 \(\mathrm{G}\)를 중심으로 하고 평면 \(\mathrm{ACD}\)에 접하는 구를 \(S\)라 하자. \(\angle\mathrm{APG}=\dfrac{\pi}{2}\)인 구 \(S\) 위의 모든 점 \(\mathrm{P}\)가 나타내는 도형을 \(T\)라 할 때, 도형 \(T\)의 평면 \(\mathrm{ABC}\) 위로의 정사영의 넓이는?`,
      figure: "2026-suneung-geom-28.webp",
      choices: [R`\(\dfrac{\pi}{7}\)`, R`\(\dfrac{\pi}{6}\)`, R`\(\dfrac{\pi}{5}\)`, R`\(\dfrac{\pi}{4}\)`, R`\(\dfrac{\pi}{3}\)`],
      answer: 4,
      help: R`두 평면이 수직이므로 좌표축을 설정하거나 삼수선의 정리를 이용해 사면체의 각 꼭짓점 좌표와 평면 \(\mathrm{ACD}\)의 방정식을 구한다. 구의 반지름 \(R\)은 점 \(\mathrm{G}\)에서 평면 \(\mathrm{ACD}\)까지의 거리이며, \(\angle\mathrm{APG}=\dfrac{\pi}{2}\)인 점 \(\mathrm{P}\)는 구와 평면의 교선인 원을 형성한다. 이 원의 평면과 평면 \(\mathrm{ABC}\)가 이루는 각의 코사인을 곱해 정사영 넓이를 구한다.`
    },
{
      id: "2026-suneung-geom-29", exam: "2026-suneung", no: 29, score: 4,
      units: ["geom-curve"], memo: "포물선과 타원의 정의 연계 및 삼각형의 둘레와 넓이",
      body: R`그림과 같이 초점이 \(\mathrm{F}(p, 0)\) (\(p > 0\))이고 준선이 \(x=-p\)인 포물선 위의 점 중 제\(1\)사분면에 있는 점 \(\mathrm{A}\)에서 포물선의 준선에 내린 수선의 발을 \(\mathrm{H}\)라 하고, 두 초점이 \(x\)축 위에 있고 세 점 \(\mathrm{F}\), \(\mathrm{A}\), \(\mathrm{H}\)를 지나는 타원의 \(x\)좌표가 양수인 초점을 \(\mathrm{B}\)라 하자. 삼각형 \(\mathrm{AHB}\)의 둘레의 길이가 \(p+27\), 넓이가 \(2p+12\)일 때, 선분 \(\mathrm{HF}\)의 길이를 \(k\)라 하자. \(k^2\)의 값을 구하시오.`,
      figure: "2026-suneung-geom-29.webp",
      short: true,
      answer: 360,
      help: R`포물선의 정의에 의해 \(\overline{\mathrm{AH}}=\overline{\mathrm{AF}}\)이다. 타원의 초점이 \(\mathrm{B}, \mathrm{B}'\)이고 점 \(\mathrm{H}, \mathrm{A}, \mathrm{F}\)를 지나므로 타원의 정의를 적용하여 둘레와 넓이 관계식으로부터 \(p\)와 점 \(\mathrm{A}\)의 좌표를 구한다. 직각삼각형에서 피타고라스 정리로 \(\overline{\mathrm{HF}}^2=k^2\)을 산출한다.`
    },
{
      id: "2026-suneung-geom-30", exam: "2026-suneung", no: 30, score: 4,
      units: ["geom-vector"], memo: "원에 내접하는 삼각형과 벡터 내적 관계식",
      body: R`좌표평면에서 길이가 \(10\sqrt{2}\)인 선분 \(\mathrm{AB}\)를 지름으로 하는 원 위의 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)가
\[(\vec{\mathrm{PA}}+\vec{\mathrm{PB}})\cdot(\vec{\mathrm{PQ}}+\vec{\mathrm{PB}}) = 2|\vec{\mathrm{PQ}}|^2\]
을 만족시킨다. \(|\vec{\mathrm{PB}}|=14\)일 때, \(|\vec{\mathrm{PA}}\cdot\vec{\mathrm{QB}}|=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(|\vec{\mathrm{QB}}| &gt; 0\)이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 221,
      help: R`지름의 양 끝점이 \(\mathrm{A}, \mathrm{B}\)이므로 \(\angle\mathrm{APB}=90^\circ\)이고 \(|\vec{\mathrm{PA}}|^2+|\vec{\mathrm{PB}}|^2=(10\sqrt{2})^2=200\)에서 \(|\vec{\mathrm{PA}}|=2\)이다. 원의 중심 \(\mathrm{O}\)를 기준으로 벡터들을 분해하거나 삼각비를 적용하여 점 \(\mathrm{Q}\)의 위치를 결정한 뒤 \(|\vec{\mathrm{PA}}\cdot\vec{\mathrm{QB}}|\)를 계산한다.`
    }
  ];
})();
