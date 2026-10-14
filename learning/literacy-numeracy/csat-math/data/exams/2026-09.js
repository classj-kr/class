(function () {
  "use strict";
  const R = String.raw;
  // 2026-09 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2026-09"] = [
{
      id: "2026-09-9", exam: "2026-09", no: 9, score: 4,
      units: ["m2-integ"], memo: "부정적분 두 개 사이의 관계",
      body: R`다항함수 \(f(x)\)의 한 부정적분을 \(F(x)\)라 하고,
        함수 \(2f(x)+1\)의 한 부정적분을 \(G(x)\)라 하자.
        \(G(3)=2F(3)\)일 때, \(G(5)-2F(5)\)의 값은?`,
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 2,
      help: R`\(2f(x)+1\)의 부정적분은 \(2F(x)+x+C\)다. 그러면 \(G(x)-2F(x)=x+C\)라는 일차식 하나로 줄어들어, \(f\)나 \(F\)가 무엇인지 몰라도 된다. \(G(3)=2F(3)\)이 \(C\)를 정해 준다.`
    },
{
      id: "2026-09-10", exam: "2026-09", no: 10, score: 4,
      units: ["m1-seq"], memo: "부호가 번갈아 붙은 부분합의 합",
      body: R`모든 항이 양수인 등비수열 \(\{a_{n}\}\)의 첫째항부터
        제\(n\)항까지의 합을 \(S_{n}\)이라 하자.
        \[a_{2}=1,\qquad \sum_{k=1}^{6}(-1)^{k}S_{k}=21\]
        일 때, \(S_{2}+S_{7}\)의 값은?`,
      choices: [R`\(61\)`, R`\(63\)`, R`\(65\)`, R`\(67\)`, R`\(69\)`],
      answer: 3,
      help: R`\(-S_{1}+S_{2}-S_{3}+S_{4}-S_{5}+S_{6}\)을 두 개씩 묶으면 \(\left(S_{2}-S_{1}\right)+\left(S_{4}-S_{3}\right)+\left(S_{6}-S_{5}\right)\), 곧 \(a_{2}+a_{4}+a_{6}=21\)이 된다. \(a_{2}=1\)이니 \(1+r^{2}+r^{4}=21\)에서 공비가 정해진다.`
    },
{
      id: "2026-09-11", exam: "2026-09", no: 11, score: 4,
      units: ["m2-integ"], memo: "속도의 부호가 바뀌는 자리",
      body: R`시각 \(t=0\)일 때 원점에서 출발하여 수직선 위를 움직이는
        점 \(\mathrm{P}\)가 있다. 시각이 \(t\,(t\ge 0)\)일 때 점 \(\mathrm{P}\)의 속도 \(v(t)\)가
        \[v(t)=3t^{2}-10t+7\]
        이다. &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. 시각 \(t=1\)일 때 점 \(\mathrm{P}\)의 운동 방향이 바뀐다.`,
        R`ㄴ. 시각 \(t=1\)일 때 점 \(\mathrm{P}\)의 위치는 \(3\)이다.`,
        R`ㄷ. 시각 \(t=0\)에서 \(t=2\)까지 점 \(\mathrm{P}\)가 움직인 거리는 \(4\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 5,
      help: R`\(v(t)=(3t-7)(t-1)\)로 인수분해된다. 운동 방향은 속도의 부호가 바뀌는 \(t=1\)에서만 바뀌고, 움직인 거리는 그 자리에서 구간을 끊어 각각의 절댓값을 더해야 한다.`
    },
{
      id: "2026-09-12", exam: "2026-09", no: 12, score: 4,
      units: ["m1-explog"], memo: "지수 곡선 위 두 점과 이등변삼각형",
      body: R`상수 \(a\,(a>1)\)과 양수 \(t\)에 대하여 곡선 \(y=a^{x}\)과
        두 직선 \(x=t\), \(x=2t\)가 만나는 점을 각각 \(\mathrm{A}\), \(\mathrm{B}\)라 하고,
        점 \(\mathrm{B}\)에서 \(x\)축에 내린 수선의 발을 \(\mathrm{C}\)라 하자.
        \(\overline{\mathrm{AB}}=\overline{\mathrm{AC}}\)이고 삼각형 \(\mathrm{ACB}\)의 넓이가 \(8\)일 때,
        \(a\times t\)의 값은?`,
      choices: [R`\(2^{\frac{9}{4}}\)`, R`\(2^{\frac{23}{8}}\)`, R`\(2^{\frac{7}{2}}\)`, R`\(2^{\frac{33}{8}}\)`, R`\(2^{\frac{19}{4}}\)`],
      answer: 1,
      help: R`\(\mathrm{B}\)와 \(\mathrm{C}\)는 \(x\)좌표가 같아 \(\overline{\mathrm{BC}}\)가 세로 선분이고 길이가 \(a^{2t}\), 삼각형의 높이는 \(t\)다. \(\overline{\mathrm{AB}}=\overline{\mathrm{AC}}\)를 제곱하면 가로 차 \(t^{2}\)이 양쪽에서 지워져 \(\left(a^{2t}-a^{t}\right)^{2}=a^{2t}\)만 남고, 여기서 \(a^{t}=2\)가 나온다.`
    },
{
      id: "2026-09-13", exam: "2026-09", no: 13, score: 4,
      units: ["m2-limit"], memo: "분모가 0이 되지 않게 하는 정수 세기",
      body: R`함수 \(f(x)=x^{2}+6x+12\)에 대하여 다음 조건을 만족시키는
        모든 정수 \(k\)의 개수는?`,
      note: [
        R`모든 실수 \(a\)에 대하여 \(\displaystyle\lim_{x\to a}\frac{x^{2}}{\bigl(f(x)\bigr)^{2}-k(x+2)f(x)}\)의 값이 존재한다.`
      ],
      choices: [R`\(5\)`, R`\(6\)`, R`\(7\)`, R`\(8\)`, R`\(9\)`],
      answer: 4,
      help: R`분모는 \(f(x)\bigl(f(x)-k(x+2)\bigr)\)로 묶인다. \(f(x)=x^{2}+6x+12\)는 판별식이 \(-12\)라 어디서도 \(0\)이 아니므로, 분모가 \(0\)이 되는 자리는 \(x^{2}+(6-k)x+(12-2k)=0\)의 근뿐이다. 이 이차식이 실근을 갖지 않으면 언제나 극한이 있고, 실근을 가질 때는 분자 \(x^{2}\)의 근인 \(0\)과 겹쳐야 하므로 중근이 \(0\)인 경우만 살아남는다.`
    },
{
      id: "2026-09-14", exam: "2026-09", no: 14, score: 4,
      units: ["m1-trig"], memo: "탄젠트 곡선의 주기와 삼각형 넓이",
      body: R`양수 \(k\)에 대하여 집합 \(\left\{x\ \middle|\ 0\le x&lt;\dfrac{3k\pi}{2},\ x\ne\dfrac{k\pi}{2}\right\}\)에서
        정의된 함수 \(f(x)=\tan\dfrac{x}{k}\)가 있다. 점 \(\mathrm{P}(0,\,p)\,(p>0)\)을 지나며
        \(x\)축에 평행한 직선이 함수 \(y=f(x)\)의 그래프와 만나는
        두 점을 \(\mathrm{A}\), \(\mathrm{B}\,\left(\overline{\mathrm{PA}}&lt;\overline{\mathrm{PB}}\right)\)라 하고,
        직선 \(y=-p\)가 함수 \(y=f(x)\)의 그래프와 만나는 점을 \(\mathrm{C}\)라
        하자. \(\overline{\mathrm{AB}}=3\overline{\mathrm{PA}}\)이고 삼각형 \(\mathrm{OCB}\)의 넓이가
        \(\dfrac{5\pi}{3}\)일 때, \(k+p\)의 값은? (단, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2026-09-14.webp",
      choices: [R`\(\dfrac{4\sqrt{3}}{3}\)`, R`\(\dfrac{13\sqrt{3}}{9}\)`, R`\(\dfrac{14\sqrt{3}}{9}\)`, R`\(\dfrac{5\sqrt{3}}{3}\)`, R`\(\dfrac{16\sqrt{3}}{9}\)`],
      answer: 3,
      help: R`\(f(x)=\tan\frac{x}{k}\)의 주기는 \(k\pi\)이고, 가로선 하나가 만나는 이웃한 두 점은 정확히 한 주기만큼 떨어져 있다. 그러니 \(\overline{\mathrm{AB}}=k\pi\)이고, \(\overline{\mathrm{AB}}=3\overline{\mathrm{PA}}\)에서 \(\overline{\mathrm{PA}}=\frac{k\pi}{3}\)이다. 곧 \(\mathrm{A}\)의 \(x\)좌표가 \(\frac{k\pi}{3}\)이므로 \(p=\tan\frac{\pi}{3}\)이 된다.`
    },
{
      id: "2026-09-15", exam: "2026-09", no: 15, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "절댓값 두 개의 차를 적분한 함수의 극값",
      body: R`최고차항의 계수가 양수이고 \(f(0)=0\)인 삼차함수 \(f(x)\)에
        대하여 함수
        \[g(x)=\int_{0}^{x}\bigl(|f(t)|-|t|\bigr)dt\]
        가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 방정식 \(g'(x)=0\)의 서로 다른 실근의 개수는 \(4\)이다.`,
        R`(나) 함수 \(g(x)\)는 \(x=2\), \(x=6\)에서 극값을 갖는다.`
      ],
      bodyAfter: R`\(f(6)\times g(2)&lt;0\)일 때, \(f(8)\)의 값은?`,
      choices: [R`\(16\)`, R`\(22\)`, R`\(28\)`, R`\(34\)`, R`\(40\)`],
      answer: 5,
      help: R`\(g'(x)=|f(x)|-|x|\)이므로 \(g'(x)=0\)은 \(|f(x)|=|x|\), 곧 \(f(x)=x\)와 \(f(x)=-x\)의 근을 모두 모은 것이다. 실근이 넷인데 극값은 \(x=2\), \(x=6\) 둘뿐이니, 나머지 두 근에서는 \(g'\)의 부호가 바뀌지 않는다.`
    },
{
      id: "2026-09-20", exam: "2026-09", no: 20, score: 4,
      units: ["m1-trig"], memo: "원에 내접하는 사각형과 닮은 두 삼각형",
      body: R`그림과 같이 사각형 \(\mathrm{ABCD}\)가 한 원에 내접하고
        \(\overline{\mathrm{AB}}:\overline{\mathrm{CD}}=1:3\), \(\overline{\mathrm{BC}}&lt;\overline{\mathrm{AD}}\)일 때, 직선 \(\mathrm{AB}\)와 직선 \(\mathrm{CD}\)가
        만나는 점을 \(\mathrm{P}\)라 하자.`,
      figure: "2026-09-20.webp",
      bodyAfter: R`다음은 \(\overline{\mathrm{PB}}:\overline{\mathrm{PC}}:\overline{\mathrm{BC}}=7:5:\sqrt{14}\)이고 \(\overline{\mathrm{AD}}=4\sqrt{13}\)일 때,
        삼각형 \(\mathrm{BPC}\)의 외접원의 반지름의 길이를 구하는 과정이다.
        <div class="proof-box">
        <p>\(\angle\mathrm{BPC}=\theta\)라 할 때, \(\overline{\mathrm{PB}}:\overline{\mathrm{PC}}:\overline{\mathrm{BC}}=7:5:\sqrt{14}\)이므로 삼각형 \(\mathrm{BPC}\)에서 코사인법칙에 의하여 \(\cos\theta=\dfrac{6}{7}\)이다.</p>
        <p>\(\overline{\mathrm{PB}}:\overline{\mathrm{PC}}=7:5\)에서 \(\overline{\mathrm{PB}}=7k\), \(\overline{\mathrm{PC}}=5k\), \(\overline{\mathrm{AB}}:\overline{\mathrm{CD}}=1:3\)에서 \(\overline{\mathrm{AB}}=l\), \(\overline{\mathrm{CD}}=3l\)이라 하자.</p>
        <p>원의 성질에 의하여 삼각형 \(\mathrm{BPC}\)와 삼각형 \(\mathrm{DPA}\)가 서로 닮음이므로 \(\overline{\mathrm{PB}}:\overline{\mathrm{PC}}=\overline{\mathrm{PD}}:\overline{\mathrm{PA}}\)이고, \(l=\fbox{(가)}\times k\)이다.</p>
        <p>삼각형 \(\mathrm{BPC}\)와 삼각형 \(\mathrm{DPA}\)의 닮음비가 \(1:\fbox{(나)}\)이므로</p>
        \[\overline{\mathrm{BC}}=\frac{1}{\fbox{(나)}}\times\overline{\mathrm{AD}}\]
        <p>이다.</p>
        <p>따라서 삼각형 \(\mathrm{BPC}\)의 외접원의 반지름의 길이를 \(R\)이라 할 때, 삼각형 \(\mathrm{BPC}\)에서 사인법칙에 의하여 \(R=\fbox{(다)}\)이다.</p>
        </div>
        위의 (가), (나), (다)에 알맞은 수를 각각 \(p\), \(q\), \(r\)이라 할 때,
        \(p+q+r\)의 값을 구하시오.`,
      short: true,
      answer: 12,
      help: R`원에 내접하는 사각형이라 \(\angle\mathrm{PBC}\)와 \(\angle\mathrm{PDA}\)가 같고, 각 \(\mathrm{P}\)를 함께 쓰므로 삼각형 \(\mathrm{BPC}\)와 \(\mathrm{DPA}\)가 닮음이다. 이 닮음이 \(\overline{\mathrm{PB}}\cdot\overline{\mathrm{PA}}=\overline{\mathrm{PC}}\cdot\overline{\mathrm{PD}}\)를 주고, 여기에 \(\overline{\mathrm{AB}}=l\), \(\overline{\mathrm{CD}}=3l\)을 넣으면 \(l\)이 \(k\)로 표현된다.`
    },
{
      id: "2026-09-21", exam: "2026-09", no: 21, score: 4,
      units: ["m2-diff"], memo: "부등식 두 개에 끼인 삼차함수",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)가 다음 조건을
        만족시킬 때, \(f'(10)\)의 값을 구하시오.`,
      note: [
        R`\(0\)이 아닌 모든 실수 \(x\)에 대하여 \(\dfrac{f'(x)}{2}+x^{2}-2 \le \dfrac{f(2x)-f(0)}{2x} \le x^{4}\)이다.`
      ],
      short: true,
      answer: 296,
      help: R`\(f(x)=x^{3}+bx^{2}+cx+d\)로 놓으면 가운데 식이 \(4x^{2}+2bx+c\)로 깔끔해진다. 그러면 왼쪽 부등식은 \(\frac{3}{2}x^{2}+bx+\frac{c}{2}+2\ge 0\), 오른쪽은 \(x^{4}-4x^{2}-2bx-c\ge 0\)이 되고, 두 조건이 함께 성립하려면 둘 다 등호가 아슬아슬하게 걸리는 자리뿐이다.`
    },
{
      id: "2026-09-22", exam: "2026-09", no: 22, score: 4,
      units: ["m1-explog"], memo: "로그 곡선 위 두 점과 사다리꼴",
      body: R`곡선 \(y=\log_{2}x\) 위에 서로 다른 두 점 \(\mathrm{A}\), \(\mathrm{B}\)가 있다.
        점 \(\mathrm{A}\)에서 직선 \(y=x\)에 내린 수선의 발을 \(\mathrm{P}\)라 하고,
        점 \(\mathrm{B}\)를 직선 \(y=x\)에 대하여 대칭이동한 점을 \(\mathrm{Q}\)라 할 때,
        네 점 \(\mathrm{A}\), \(\mathrm{B}\), \(\mathrm{P}\), \(\mathrm{Q}\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) (직선 \(\mathrm{AP}\)의 \(y\)절편) \(-\) (직선 \(\mathrm{BQ}\)의 \(y\)절편) \(=\dfrac{13}{2}\)`,
        R`(나) 직선 \(\mathrm{AB}\)의 기울기는 \(\dfrac{6}{7}\)이다.`
      ],
      bodyAfter: R`사각형 \(\mathrm{APQB}\)의 넓이가 \(\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오.
        (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 73,
      help: R`\(\mathrm{AP}\)와 \(\mathrm{BQ}\)는 둘 다 직선 \(y=x\)에 수직이라 기울기가 \(-1\)로 같다. 곧 두 선분이 평행이고 사각형 \(\mathrm{APQB}\)는 사다리꼴이며, (가)의 \(y\)절편 차가 두 평행선 사이의 거리를 준다.`
    },
{
      id: "2026-09-prob-28", exam: "2026-09", no: 28, score: 4,
      units: ["prob-count"], memo: "색깔 카드의 분배와 여사건 (중복조합)",
      body: R`빨간색 카드 \(1\)장, 파란색 카드 \(1\)장, 노란색 카드 \(3\)장, 보라색 카드 \(3\)장이 있다. 이 \(8\)장의 카드를 세 학생 \(\mathrm{A}\), \(\mathrm{B}\), \(\mathrm{C}\)에게 다음 규칙에 따라 남김없이 나누어 주는 경우의 수는? (단, 같은 색 카드끼리는 서로 구별하지 않는다.)`,
      noteTitle: "규 칙",
      note: [
        R`(가) 두 학생 \(\mathrm{A}\), \(\mathrm{B}\)는 각각 \(1\)장 이상의 카드를 받고, 학생 \(\mathrm{C}\)는 카드를 받지 못할 수 있다.`,
        R`(나) 학생 \(\mathrm{A}\)가 받는 카드의 색의 가짓수는 \(3\) 이하이다.`
      ],
      choices: [R`\(730\)`, R`\(746\)`, R`\(762\)`, R`\(778\)`, R`\(794\)`],
      answer: 2,
      help: R`전체 분배 경우의 수는 \(3\times 3\times {}_{3}\mathrm{H}_{3}\times {}_{3}\mathrm{H}_{3} = 900\)이다. 조건 (가)에서 B가 못 받는 경우, (나)에서 A가 4가지 색 모두를 받는 경우를 구하고, 포함배제의 원리를 적용하여 전체에서 부적격 경우의 수를 차감한다.`
    },
{
      id: "2026-09-prob-29", exam: "2026-09", no: 29, score: 4,
      units: ["prob-stat"], memo: "부분집합 교집합 확률과 이항분포 정규근사",
      body: R`두 집합 \(A=\{2, 3, 4\}\), \(B=\{2, 3\}\)에 대하여 다음 시행을 한다.
집합 \(A\)의 모든 부분집합 \(8\)개 중에서 임의로 한 개를 선택하고,
집합 \(B\)의 모든 부분집합 \(4\)개 중에서 임의로 한 개를 선택한다.
선택한 두 집합의 교집합의 원소의 개수를 기록한다.
이 시행을 \(15360\)번 반복하여 기록한 수가 \(1\)인 횟수가 \(5880\) 이상일 확률을 오른쪽 표준정규분포표를 이용하여 구한 값이 \(k\)일 때, \(1000\times k\)의 값을 구하시오.`,
      figure: "2026-09-prob-29.webp",
      short: true,
      answer: 23,
      help: R`교집합의 원소가 될 수 있는 것은 \(2\)와 \(3\)뿐이다. 교집합의 원소 개수가 1일 확률은 원소 2만 포함되거나 3만 포함될 확률이므로 \(p = 2\times \left(\dfrac{1}{2}\times\dfrac{1}{2}\times\dfrac{3}{4}\right) = \dfrac{3}{8}\)이다. \(\mathrm{E}(X)=15360\times\dfrac{3}{8}=5760\), \(\mathrm{V}(X)=3600\)이므로 \(\mathrm{P}(X\ge 5880)=\mathrm{P}(Z\ge 2.0)=0.5-0.477=0.023\)이 되어 답은 23이다.`
    },
{
      id: "2026-09-prob-30", exam: "2026-09", no: 30, score: 4,
      units: ["prob-prob"], memo: "게임 규칙에 따른 조건부확률과 확률의 상등",
      body: R`학생 \(\mathrm{A}\)는 숫자 \(1\), \(8\)이 각각 하나씩 적혀 있는 \(2\)장의 카드 중 임의로 한 장의 카드를 선택하여 선택한 카드에 적힌 수가 \(8\)일 때만 선택한 카드를 바닥에 내려놓고, 학생 \(\mathrm{B}\)는 숫자 \(2\), \(3\), \(4\), \(5\), \(6\), \(7\)이 각각 하나씩 적혀 있는 \(6\)장의 카드 중 임의로 한 장의 카드를 선택하여 선택한 카드에 적힌 수가 자연수 \(n\)보다 작거나 같을 때만 선택한 카드를 바닥에 내려놓는다.
다음 규칙에 따라 학생 \(\mathrm{A}\)가 귤을 받을 확률을 \(p\), 학생 \(\mathrm{B}\)가 귤을 받을 확률을 \(q\)라 하자.
∙ 카드를 내려놓은 학생이 \(2\)명이면 더 큰 수가 적힌 카드를 내려놓은 학생만 귤을 받는다.
∙ 카드를 내려놓은 학생이 \(1\)명이면 카드를 내려놓지 않은 학생만 귤을 받는다.
∙ 카드를 내려놓은 학생이 없으면 어느 학생도 귤을 받지 못한다.
\(p=q\)일 때, \(24(n+p)\)의 값을 구하시오. (단, \(n\)은 \(7\) 이하의 자연수이다.)`,
      short: true,
      answer: 80,
      help: R`A가 카드를 내려놓을 확률은 \(\dfrac{1}{2}\)(카드 8 선택), B가 카드를 내려놓을 확률은 \(\dfrac{n-1}{6}\)이다. 규칙에 따라 A가 귤을 받는 확률 \(p\)와 B가 귤을 받는 확률 \(q\)를 \(n\)에 대한 식으로 나타내어 \(p=q\)를 풀면 \(n=3, p=\dfrac{1}{3}\)이 도출되고 \(24(3 + 1/3) = 80\)을 얻는다.`
    },
{
      id: "2026-09-calc-28", exam: "2026-09", no: 28, score: 4,
      units: ["calc-diff"], memo: "삼차함수의 대칭성과 삼각함수 합성 미분",
      body: R`삼차함수 \(f(x)\)와 실수 전체의 집합에서 미분가능한 함수 \(g(x)\)가 모든 실수 \(x\)에 대하여
\[f(x) = g(x) - \tan g(x)\]
이고 다음 조건을 만족시킬 때, \(g'(0)\times(g(0))^2\)의 값은?`,
      note: [
        R`(가) \(f(0)=0\), \(f''(\pi)=0\)`,
        R`(나) \(\sin g(\pi)=0\), \(\lim_{x\to\infty} g(x)=\dfrac{3\pi}{2}\)`
      ],
      choices: [R`\(-12\)`, R`\(-6\)`, R`\(-1\)`, R`\(3\)`, R`\(9\)`],
      answer: 2,
      help: R`\(g(x)\)의 공역이 \(\tan\)가 연속인 구간 \(\left(\dfrac{3\pi}{2},\dfrac{5\pi}{2}\right)\)임을 파악하여 변곡점 \((\pi, 2\pi)\)을 찾고 삼차함수 \(f(x)=\dfrac{2}{\pi^2}(x-\pi)^3+2\pi\)를 결정한다. \(f'(x)=-g'(x)\tan^2 g(x)\)에 \(x=0\)을 대입하면 \(f'(0)=6\)이 성립한다. \(f(0)=0\)에서 \(\tan g(0)=g(0)\)이므로 \(g'(0)\times(g(0))^2=-6\)을 곧바로 얻는다.`
    },
{
      id: "2026-09-calc-29", exam: "2026-09", no: 29, score: 4,
      units: ["calc-seq"], memo: "유리수 공비 등비수열의 정수 조건과 급수의 합",
      body: R`첫째항이 양수이고 공비가 유리수인 등비수열 \(\{a_n\}\)에 대하여 급수 \(\sum_{n=1}^\infty a_n\)이 수렴하고, 수열 \(\{a_n\}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(a_1 + a_2 &lt; 10\)`,
        R`(나) 수열 \(\{a_n\}\)의 정수인 항의 개수는 \(3\)이고, 이 세 항의 곱은 \(216\)이다.`
      ],
            bodyAfter: R`\(\sum_{n=1}^\infty a_n = \dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 91,
      help: R`등비수열의 항이 정수가 되는 구간은 공비의 분모·분자 거듭제곱 약분 조건에 의해 연속된 세 항으로 한정된다. 세 정수 항의 곱이 양수 \(216\)이고 \(a_1+a_2&lt;10\)을 만족하려면 공비가 음수 \(r=-\dfrac{2}{3}\)이고 정수 항이 \(a_2=-9, a_3=6, a_4=-4\)여야 한다. 첫째항 \(a_1=\dfrac{27}{2}\)을 구하여 등비급수의 합 \(\sum_{n=1}^\infty a_n=\dfrac{81}{10}\)을 도출한다.`
    },
{
      id: "2026-09-calc-30", exam: "2026-09", no: 30, score: 4,
      units: ["calc-integ"], memo: "미분과 적분의 관계를 이용한 정적분 계산",
      body: R`실수 전체의 집합에서 미분가능한 함수 \(f(x)\)와 실수 전체의 집합에서 연속인 함수 \(g(x)\)는 모든 실수 \(x\)에 대하여
\[f(x)=\ln\left(\dfrac{g(x)}{1+xf'(x)}\right)\]
를 만족시킨다. \(f(1)=4\ln 2\)이고
\[\int_1^2 g(x)\,dx = 34, \quad \int_1^2 xg(x)\,dx = 53\]
일 때, \(\int_1^2 x e^{f(x)}\,dx\)의 값을 구하시오.`,
      short: true,
      answer: 31,
      help: R`조건식을 \(g(x)=e^{f(x)}(1+xf'(x))=\dfrac{d}{dx}\left[x e^{f(x)}\right]\)로 변형하는 것이 핵심이다. \(h(x)=x e^{f(x)}\)라 두면 \(h'(x)=g(x)\)가 되어 \(\int_1^2 g(x)\,dx=h(2)-h(1)=34\)에서 \(h(2)=50\)을 얻는다. \(\int_1^2 x g(x)\,dx\)에 부분적분법을 적용하면 구하는 값 \(\int_1^2 h(x)\,dx=84-53=31\)이 깔끔하게 도출된다.`
    },
{
      id: "2026-09-geom-28", exam: "2026-09", no: 28, score: 4,
      units: ["geom-space"], memo: "공간좌표와 구 위의 점, 평면과 직선의 각도 및 정사영",
      body: R`좌표공간의 구 \(S: x^2+y^2+z^2=36\) 위의 점 \(\mathrm{A}\)에 대하여 구 \(S\) 위의 점 \(\mathrm{B}\)가 다음 조건을 만족시킨다.`,
      figure: "2026-09-geom-28.webp",
      note: [
        R`(가) 선분 \(\mathrm{OA}\) 위의 \(\overline{\mathrm{OC}}=4\)인 점 \(\mathrm{C}\)에 대하여 직선 \(\mathrm{BC}\)와 \(xy\)평면이 서로 평행하다.`,
        R`(나) 두 직선 \(\mathrm{OA}\), \(\mathrm{AB}\)와 \(xy\)평면이 이루는 예각의 크기를 각각 \(\alpha\), \(\beta\)라 하면 \(\sin\alpha=3\sin\beta\)이다.`
      ],
            bodyAfter: R`삼각형 \(\mathrm{OAB}\)의 \(xy\)평면 위로의 정사영이 직각삼각형일 때, 평면 \(\mathrm{OAB}\)와 \(xy\)평면이 이루는 예각의 크기를 \(\theta\)라 하자. \(\cos\theta\)의 값은? (단, \(\mathrm{O}\)는 원점이고, 점 \(\mathrm{A}\)의 \(z\)좌표는 \(6\)이 아닌 양수이다.)`,
choices: [R`\(\dfrac{\sqrt{2}}{6}\)`, R`\(\dfrac{\sqrt{2}}{5}\)`, R`\(\dfrac{\sqrt{2}}{4}\)`, R`\(\dfrac{\sqrt{2}}{3}\)`, R`\(\dfrac{\sqrt{2}}{2}\)`],
      answer: 4,
      help: R`구의 반지름은 \(6\)이고 점 \(\mathrm{C}\)의 \(z\)좌표와 점 \(\mathrm{B}\)의 \(z\)좌표가 같다 (\(z_C=z_B=\dfrac{2}{3}z_A\)). 정사영 삼각형이 직각삼각형이 되는 기하학적 배치에서 법선벡터를 구하거나 면적비 공식 \(\cos\theta = \dfrac{S'}{S}\)를 적용하여 \(\cos\theta\)를 구한다.`
    },
{
      id: "2026-09-geom-29", exam: "2026-09", no: 29, score: 4,
      units: ["geom-curve"], memo: "두 타원의 정의와 초점·꼭짓점 관계를 이용한 장축 길이 계산",
      body: R`두 점 \(\mathrm{F}(0, 6)\), \(\mathrm{F}'(0, -6)\)을 초점으로 하는 타원 \(C_1\)에 대하여 점 \(\mathrm{F}\)를 지나고 \(x\)축과 평행한 직선이 타원 \(C_1\)과 만나는 점 중 제\(1\)사분면 위에 있는 점을 \(\mathrm{P}\), 선분 \(\mathrm{PF}'\)과 \(x\)축이 만나는 점을 \(\mathrm{Q}\)라 하자. 두 점 \(\mathrm{P}\), \(\mathrm{F}\)를 초점으로 하고 점 \(\mathrm{Q}\)가 꼭짓점인 타원 \(C_2\)에 대하여 두 타원 \(C_1\), \(C_2\)가 만나는 점 중 \(x\)축에 가까운 점을 \(\mathrm{R}\)이라 하자. \(\overline{\mathrm{F}'\mathrm{R}}-\overline{\mathrm{PR}}=7\sqrt{2}\)일 때, 두 타원 \(C_1\), \(C_2\)의 장축의 길이의 곱을 구하시오.`,
      figure: "2026-09-geom-29.webp",
      short: true,
      answer: 396,
      help: R`점 \(\mathrm{P}\)의 좌표를 \((x_1, 6)\)으로 두고 닮음을 이용하여 \(\mathrm{Q}\)의 위치와 타원 \(C_2\)의 장축 길이를 표현한다. 두 타원 위의 점 \(\mathrm{R}\)에 대해 타원의 정의식 \(\overline{\mathrm{RF}}+\overline{\mathrm{RF}'}=2a_1\), \(\overline{\mathrm{RF}}+\overline{\mathrm{RP}}=2a_2\)를 변변 빼서 주어진 \(\overline{\mathrm{F}'\mathrm{R}}-\overline{\mathrm{PR}}=7\sqrt{2}\)와 연결하여 두 장축의 곱을 산출한다.`
    },
{
      id: "2026-09-geom-30", exam: "2026-09", no: 30, score: 4,
      units: ["geom-vector"], memo: "삼각형 위의 점들과 벡터 내적 조건, 원 위의 동점까지의 거리 최대·최소",
      body: R`좌표평면에 \(\overline{\mathrm{AB}}=\overline{\mathrm{AC}}=8\sqrt{5}\), \(\overline{\mathrm{BC}}=16\)인 삼각형 \(\mathrm{ABC}\)가 있다. 선분 \(\mathrm{AB}\) 위의 점 \(\mathrm{P}\), 선분 \(\mathrm{BC}\) 위의 점 \(\mathrm{Q}\), 선분 \(\mathrm{CA}\) 위의 점 \(\mathrm{R}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \((\vec{\mathrm{PB}}+\vec{\mathrm{PQ}})\cdot\vec{\mathrm{BC}} = (\vec{\mathrm{RC}}+\vec{\mathrm{RQ}})\cdot\vec{\mathrm{BC}} = 0\)`,
        R`(나) \(\vec{\mathrm{QP}}\cdot\vec{\mathrm{QR}} = |\vec{\mathrm{QP}}|^2\)`
      ],
            bodyAfter: R`\(|3\vec{\mathrm{XP}}+\vec{\mathrm{XR}}|=|\vec{\mathrm{PR}}|\)을 만족시키는 점 \(\mathrm{X}\)에 대하여 \(|\vec{\mathrm{BX}}|\)의 최댓값과 최솟값을 각각 \(M\), \(m\)이라 할 때, \(M\times m\)의 값을 구하시오. (단, \(|\vec{\mathrm{PQ}}| &gt; 0\))`,
short: true,
      answer: 69,
      help: R`조건 (가)에서 점 \(\mathrm{P}, \mathrm{R}\)의 정사영과 \(\mathrm{Q}\)의 위치 관계를 찾고, 조건 (나)에서 직각삼각형 관계를 도출한다. \(|3\vec{\mathrm{XP}}+\vec{\mathrm{XR}}|=|\vec{\mathrm{PR}}|\)은 점 \(\mathrm{X}\)가 선분 \(\mathrm{PR}\)을 \(1:3\)으로 내분하는 점을 중심으로 하는 원 위에 있음을 나타내므로, 점 \(\mathrm{B}\)에서 이 원의 중심까지의 거리와 반지름을 이용하여 \(M\)과 \(m\)을 구한다.`
    }
  ];
})();
