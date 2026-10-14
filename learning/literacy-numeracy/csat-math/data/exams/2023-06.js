(function () {
  "use strict";
  const R = String.raw;
  // 2023-06 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2023-06"] = [
{
      id: "2023-06-9", exam: "2023-06", no: 9, score: 4,
      units: ["m2-diff"], memo: "부등식을 최솟값 문제로 바꾸기",
      body: R`두 함수
        \[f(x)=x^{3}-x+6,\qquad g(x)=x^{2}+a\]
        가 있다. \(x\ge 0\)인 모든 실수 \(x\)에 대하여 부등식
        \[f(x)\ge g(x)\]
        가 성립할 때, 실수 \(a\)의 최댓값은?`,
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 5,
      help: R`부등식을 \(a\)에 대하여 옮기면 \(a\le x^{3}-x^{2}-x+6\)이다. 이것이 \(x\ge 0\)인 모든 \(x\)에서 성립해야 하므로, 오른쪽 함수의 그 구간에서의 최솟값이 곧 \(a\)의 최댓값이다.`
    },
{
      id: "2023-06-10", exam: "2023-06", no: 10, score: 4,
      units: ["m1-trig"], memo: "중점에서 만나는 두 현",
      body: R`그림과 같이 \(\overline{\mathrm{AB}}=3\), \(\overline{\mathrm{BC}}=2\), \(\overline{\mathrm{AC}}>3\)이고
        \(\cos(\angle\mathrm{BAC})=\dfrac{7}{8}\)인 삼각형 \(\mathrm{ABC}\)가 있다. 선분 \(\mathrm{AC}\)의 중점을 \(\mathrm{M}\),
        삼각형 \(\mathrm{ABC}\)의 외접원이 직선 \(\mathrm{BM}\)과 만나는 점 중 \(\mathrm{B}\)가 아닌
        점을 \(\mathrm{D}\)라 할 때, 선분 \(\mathrm{MD}\)의 길이는?`,
      figure: "2023-06-10.webp",
      choices: [R`\(\dfrac{3\sqrt{10}}{5}\)`, R`\(\dfrac{7\sqrt{10}}{10}\)`, R`\(\dfrac{4\sqrt{10}}{5}\)`, R`\(\dfrac{9\sqrt{10}}{10}\)`, R`\(\sqrt{10}\)`],
      answer: 3,
      help: R`두 현 \(\mathrm{AC}\)와 \(\mathrm{BD}\)가 점 \(\mathrm{M}\)에서 만나므로 \(\overline{\mathrm{AM}}\times\overline{\mathrm{MC}}=\overline{\mathrm{BM}}\times\overline{\mathrm{MD}}\)다. \(\mathrm{M}\)이 중점이라 왼쪽은 \(\left(\frac{\overline{\mathrm{AC}}}{2}\right)^{2}\)이고, \(\overline{\mathrm{AC}}\)는 코사인법칙으로, \(\overline{\mathrm{BM}}\)은 중선의 길이로 구할 수 있다.`
    },
{
      id: "2023-06-11", exam: "2023-06", no: 11, score: 4,
      units: ["m2-integ"], memo: "한 점이 원점으로 돌아오는 시각",
      body: R`시각 \(t=0\)일 때 동시에 원점을 출발하여 수직선 위를
        움직이는 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의 시각 \(t\,(t\ge 0)\)에서의 속도가 각각
        \[v_{1}(t)=2-t,\qquad v_{2}(t)=3t\]
        이다. 출발한 시각부터 점 \(\mathrm{P}\)가 원점으로 돌아올 때까지
        점 \(\mathrm{Q}\)가 움직인 거리는?`,
      choices: [R`\(16\)`, R`\(18\)`, R`\(20\)`, R`\(22\)`, R`\(24\)`],
      answer: 5,
      help: R`\(\mathrm{P}\)가 원점으로 돌아오는 시각은 위치가 다시 \(0\)이 되는 때이므로 \(\int_{0}^{T}(2-t)\,dt=0\)에서 나온다. \(\mathrm{Q}\)의 속도는 \(t\ge 0\)에서 늘 \(0\) 이상이라 움직인 거리가 절댓값 없이 그냥 적분값이다.`
    },
{
      id: "2023-06-12", exam: "2023-06", no: 12, score: 4,
      units: ["m1-seq"], memo: "부호가 바뀌는 자리와 절댓값의 합",
      body: R`공차가 \(3\)인 등차수열 \(\{a_{n}\}\)이 다음 조건을 만족시킬 때,
        \(a_{10}\)의 값은?`,
      note: [
        R`(가) \(a_{5}\times a_{7}&lt;0\)`,
        R`(나) \(\displaystyle\sum_{k=1}^{6}\bigl|a_{k+6}\bigr|=6+\sum_{k=1}^{6}\bigl|a_{2k}\bigr|\)`
      ],
      choices: [R`\(\dfrac{21}{2}\)`, R`\(11\)`, R`\(\dfrac{23}{2}\)`, R`\(12\)`, R`\(\dfrac{25}{2}\)`],
      answer: 3,
      help: R`공차가 \(3\)으로 양수이고 \(a_{5}a_{7}&lt;0\)이니 수열이 음수에서 양수로 바뀌는 자리가 \(a_{5}\)와 \(a_{7}\) 사이다. 절댓값이 붙어 있으므로 어느 항까지 음수인지를 먼저 못박아야 (나)의 두 합을 식으로 쓸 수 있다.`
    },
{
      id: "2023-06-13", exam: "2023-06", no: 13, score: 4,
      units: ["m1-explog"], memo: "두 지수 곡선을 오가며 줄어드는 좌표",
      body: R`두 곡선 \(y=16^{x}\), \(y=2^{x}\)과 한 점 \(\mathrm{A}\bigl(64,\,2^{64}\bigr)\)이 있다.
        점 \(\mathrm{A}\)를 지나며 \(x\)축과 평행한 직선이 곡선 \(y=16^{x}\)과 만나는
        점을 \(\mathrm{P}_{1}\)이라 하고, 점 \(\mathrm{P}_{1}\)을 지나며 \(y\)축과 평행한 직선이
        곡선 \(y=2^{x}\)과 만나는 점을 \(\mathrm{Q}_{1}\)이라 하자.
        점 \(\mathrm{Q}_{1}\)을 지나며 \(x\)축과 평행한 직선이 곡선 \(y=16^{x}\)과 만나는
        점을 \(\mathrm{P}_{2}\)라 하고, 점 \(\mathrm{P}_{2}\)를 지나며 \(y\)축과 평행한 직선이
        곡선 \(y=2^{x}\)과 만나는 점을 \(\mathrm{Q}_{2}\)라 하자.
        이와 같은 과정을 계속하여 \(n\)번째 얻은 두 점을 각각
        \(\mathrm{P}_{n}\), \(\mathrm{Q}_{n}\)이라 하고 점 \(\mathrm{Q}_{n}\)의 \(x\)좌표를 \(x_{n}\)이라 할 때,
        \(x_{n}&lt;\dfrac{1}{k}\)을 만족시키는 \(n\)의 최솟값이 \(6\)이 되도록 하는
        자연수 \(k\)의 개수는?`,
      figure: "2023-06-13.webp",
      choices: [R`\(48\)`, R`\(51\)`, R`\(54\)`, R`\(57\)`, R`\(60\)`],
      answer: 1,
      help: R`\(16^{x}=2^{4x}\)이므로 \(y\)좌표가 같은 두 점을 견주면 \(y=16^{x}\) 위의 점의 \(x\)좌표가 \(y=2^{x}\) 위의 점의 \(\frac{1}{4}\)배다. 그리고 \(\mathrm{Q}_{n}\)은 \(\mathrm{P}_{n}\)과 \(x\)좌표가 같으니, \(x_{n}\)은 공비가 \(\frac{1}{4}\)인 등비수열이 된다.`
    },
{
      id: "2023-06-14", exam: "2023-06", no: 14, score: 4,
      units: ["m2-integ"], memo: "부호를 뒤집어 이어 붙인 적분함수",
      body: R`실수 전체의 집합에서 연속인 함수 \(f(x)\)와 최고차항의
        계수가 \(1\)인 삼차함수 \(g(x)\)가
        \[g(x)=\begin{cases}-\displaystyle\int_{0}^{x}f(t)\,dt &amp; (x&lt;0)\\[8pt] \displaystyle\int_{0}^{x}f(t)\,dt &amp; (x\ge 0)\end{cases}\]
        을 만족시킬 때, &lt;보기&gt;에서 옳은 것만을 있는 대로 고른
        것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(f(0)=0\)`,
        R`ㄴ. 함수 \(f(x)\)는 극댓값을 갖는다.`,
        R`ㄷ. \(2&lt;f(1)&lt;4\)일 때, 방정식 \(f(x)=x\)의 서로 다른 실근의 개수는 \(3\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄷ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 4,
      help: R`\(F(x)=\int_{0}^{x}f\)라 하면 \(g\)는 \(x\ge 0\)에서 \(F\), \(x&lt;0\)에서 \(-F\)다. 그런데 \(g\)가 하나의 삼차함수이므로 \(x&lt;0\)에서도 \(g=F\)여야 하고, 곧 \(x&lt;0\)에서 \(F(x)=-F(x)\), 즉 \(F\)가 그 구간에서 \(0\)이 아니면 모순이 생긴다. 이 어긋남이 \(f\)의 모양을 크게 좁힌다.`
    },
{
      id: "2023-06-15", exam: "2023-06", no: 15, score: 4,
      units: ["m1-seq"], memo: "오르내림이 다른 두 걸음으로 제자리 오기",
      body: R`자연수 \(k\)에 대하여 다음 조건을 만족시키는 수열 \(\{a_{n}\}\)이
        있다.`,
      note: [
        R`\(a_{1}=0\)이고, 모든 자연수 \(n\)에 대하여 \(a_{n+1}=\begin{cases}a_{n}+\dfrac{1}{k+1} &amp; \left(a_{n}\le 0\right)\\[8pt] a_{n}-\dfrac{1}{k} &amp; \left(a_{n}>0\right)\end{cases}\)이다.`
      ],
      bodyAfter: R`\(a_{22}=0\)이 되도록 하는 모든 \(k\)의 값의 합은?`,
      choices: [R`\(12\)`, R`\(14\)`, R`\(16\)`, R`\(18\)`, R`\(20\)`],
      answer: 2,
      help: R`\(0\) 이하이면 \(\frac{1}{k+1}\)만큼 오르고, 양수이면 \(\frac{1}{k}\)만큼 내린다. 오르는 걸음과 내리는 걸음의 크기가 달라서, \(21\)걸음 뒤 다시 \(0\)이 되려면 오른 횟수와 내린 횟수가 \(\frac{p}{k+1}=\frac{q}{k}\)를 만족시키도록 맞아떨어져야 한다.`
    },
{
      id: "2023-06-20", exam: "2023-06", no: 20, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "폭이 1인 창으로 훑은 절댓값 적분",
      body: R`최고차항의 계수가 \(2\)인 이차함수 \(f(x)\)에 대하여
        함수 \(g(x)=\displaystyle\int_{x}^{x+1}\bigl|f(t)\bigr|\,dt\)는 \(x=1\)과 \(x=4\)에서 극소이다.
        \(f(0)\)의 값을 구하시오.`,
      short: true,
      answer: 13,
      help: R`\(g'(x)=\bigl|f(x+1)\bigr|-\bigl|f(x)\bigr|\)다. 곧 \(x=1\)과 \(x=4\)에서 \(\bigl|f(x+1)\bigr|=\bigl|f(x)\bigr|\)이고 그 자리에서 부호가 음에서 양으로 바뀐다. 절댓값 안의 부호까지 따져야 어느 쪽이 같아지는지가 갈린다.`
    },
{
      id: "2023-06-21", exam: "2023-06", no: 21, score: 4,
      units: ["m1-explog"], memo: "로그값이 정수가 될 조건",
      body: R`자연수 \(n\)에 대하여 \(4\log_{64}\left(\dfrac{3}{4n+16}\right)\)의 값이 정수가 되도록
        하는 \(1000\) 이하의 모든 \(n\)의 값의 합을 구하시오.`,
      short: true,
      answer: 426,
      help: R`\(\log_{64}=\frac{1}{6}\log_{2}\)이므로 주어진 식은 \(\frac{2}{3}\log_{2}\dfrac{3}{4n+16}\)이다. 이것이 정수이려면 \(\log_{2}\dfrac{3}{4n+16}\)이 \(3\)의 배수인 정수여야 하고, 그러려면 로그 안의 값이 \(2\)의 거듭제곱이어야 한다.`
    },
{
      id: "2023-06-22", exam: "2023-06", no: 22, score: 4,
      units: ["m2-limit"], memo: "분자가 0으로 가야만 살아남는 극한",
      body: R`두 양수 \(a\), \(b\,(b>3)\)과 최고차항의 계수가 \(1\)인 이차함수
        \(f(x)\)에 대하여 함수
        \[g(x)=\begin{cases}(x+3)f(x) &amp; (x&lt;0)\\ (x+a)f(x-b) &amp; (x\ge 0)\end{cases}\]
        이 실수 전체의 집합에서 연속이고 다음 조건을 만족시킬 때,
        \(g(4)\)의 값을 구하시오.`,
      note: [
        R`\(\displaystyle\lim_{x\to-3}\frac{\sqrt{\bigl|g(x)\bigr|+\bigl\{g(t)\bigr\}^{2}}-\bigl|g(t)\bigr|}{(x+3)^{2}}\)의 값이 존재하지 않는 실수 \(t\)의 값은 \(-3\)과 \(6\)뿐이다.`
      ],
      short: true,
      answer: 19,
      help: R`\(x\to-3\)일 때 \(g(x)\to g(-3)=0\)이므로 분자는 \(\sqrt{\bigl|g(x)\bigr|+\{g(t)\}^{2}}-\bigl|g(t)\bigr|\)로, \(g(t)\ne 0\)이면 \(0\)으로 간다. 이때 분자를 유리화하면 \(\bigl|g(x)\bigr|\)가 통째로 남으므로, 극한이 있는지 없는지는 \(\bigl|g(x)\bigr|\)가 \((x+3)^{2}\)만큼 빠르게 \(0\)으로 가느냐로 갈린다.`
    },
{
      id: "2023-06-prob-28", exam: "2023-06", no: 28, score: 4,
      units: ["prob-prob"], memo: "순열로 만든 자연수의 배수 및 대소 조건 확률",
      body: R`숫자 \(1\), \(2\), \(3\), \(4\), \(5\) 중에서 서로 다른 \(4\)개를 택해 일렬로 나열하여 만들 수 있는 모든 네 자리의 자연수 중에서 임의로 하나의 수를 택할 때, 택한 수가 \(5\)의 배수 또는 \(3500\) 이상일 확률은?`,
      choices: [R`\(\dfrac{9}{20}\)`, R`\(\dfrac{1}{2}\)`, R`\(\dfrac{11}{20}\)`, R`\(\dfrac{3}{5}\)`, R`\(\dfrac{13}{20}\)`],
      answer: 4,
      help: R`전체 네 자리 수의 개수는 \({}_{5}\mathrm{P}_{4} = 120\)이다. 5의 배수인 사건 \(A\)(일의 자리가 5)와 3500 이상인 사건 \(B\)(천의 자리가 3이고 백의 자리가 5인 경우 또는 천의 자리가 4 또는 5인 경우)의 원소 개수 및 교집합 \(A\cap B\)를 구하여 합사건 공식으로 계산한다.`
    },
{
      id: "2023-06-prob-29", exam: "2023-06", no: 29, score: 4,
      units: ["prob-count"], memo: "합성함수 조건과 단조증가 조건의 함수 개수 (중복조합)",
      body: R`집합 \(X=\{1, 2, 3, 4, 5\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수를 구하시오.`,
      noteTitle: "조 건",
      note: [
        R`(가) \(f(f(1))=4\)`,
        R`(나) \(f(1)\le f(3)\le f(5)\)`
      ],
      short: true,
      answer: 115,
      help: R`\(f(1)=k\)라 하면 \(f(k)=4\)이고 \(k\le f(3)\le f(5)\)이다. \(k\in\{1, 2, 3, 4, 5\}\)의 각 경우에 대해 \(f(1), f(k)\)가 정해졌을 때 \(f(3), f(5)\)의 선택 가짓수(중복조합)와 나머지 정의역 원소들의 자유로운 함숫값 선택 가짓수(\(\times 5\))를 주의 깊게 곱하여 합산한다.`
    },
{
      id: "2023-06-prob-30", exam: "2023-06", no: 30, score: 4,
      units: ["prob-prob"], memo: "비복원추출에서 수의 차이와 조건부확률",
      body: R`주머니에 \(1\)부터 \(12\)까지의 자연수가 각각 하나씩 적혀 있는 \(12\)개의 공이 들어 있다. 이 주머니에서 임의로 \(3\)개의 공을 동시에 꺼내어 공에 적혀 있는 수를 작은 수부터 크기 순서대로 \(a\), \(b\), \(c\)라 하자. \(b-a\ge 5\)일 때, \(c-a\ge 10\)일 확률은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 9,
      help: R`\(1\le a &lt; b &lt; c\le 12\)에서 \(b-a\ge 5\)를 만족하는 순서쌍 개수를 구한다. 치환 \(b'=b-4\) 등을 이용하거나 \(a\)의 값(1부터 6까지)에 따라 가능한 \(b, c\)의 개수를 센다. 분자인 \(c-a\ge 10\)은 \(a=1, c\in\{11, 12\}\) 또는 \(a=2, c=12\)인 경우로 몇 개 되지 않으므로 직접 세어 분수를 약분한다.`
    },
{
      id: "2023-06-calc-28", exam: "2023-06", no: 28, score: 4,
      units: ["calc-diff"], memo: "합성함수의 연속과 극값",
      body: R`최고차항의 계수가 \(\dfrac{1}{2}\)인 삼차함수 \(f(x)\)에 대하여 함수 \(g(x)\)가 \[g(x)=\begin{cases}\ln|f(x)| & (f(x)\ne 0)\\ 1 & (f(x)=0)\end{cases}\]이고 다음 조건을 만족시킬 때, 함수 \(g(x)\)의 극솟값은?`,
      note: [
        R`함수 \(g(x)\)는 \(x\ne 1\)인 모든 실수 \(x\)에서 연속이다.`,
        R`함수 \(g(x)\)는 \(x=2\)에서 극대이고, 함수 \(|g(x)|\)는 \(x=2\)에서 극소이다.`,
        R`방정식 \(g(x)=0\)의 서로 다른 실근의 개수는 \(3\)이다.`
      ],
      choices: [R`\(\ln\dfrac{13}{27}\)`, R`\(\ln\dfrac{16}{27}\)`, R`\(\ln\dfrac{19}{27}\)`, R`\(\ln\dfrac{22}{27}\)`, R`\(\ln\dfrac{25}{27}\)`],
      answer: 5,
      help: R`\(g(x)\)가 \(x=1\)에서만 불연속이므로 \(f(x)=0\)의 실근은 \(x=1\)뿐입니다. \(g(x)\)가 극대이면서 \(|g(x)|\)가 극소가 되려면 \(g(2)=0\)이어야 하므로 \(|f(2)|=1\)임을 이용하여 삼차함수 \(f(x)\)의 식을 확정합니다.`
    },
{
      id: "2023-06-calc-29", exam: "2023-06", no: 29, score: 4,
      units: ["calc-diff"], memo: "삼각함수의 극한과 각의 이등분선",
      body: R`그림과 같이 반지름의 길이가 \(1\)이고 중심각의 크기가 \(\dfrac{\pi}{2}\)인 부채꼴 \(\mathrm{OAB}\)가 있다. 호 \(\mathrm{AB}\) 위의 점 \(\mathrm{P}\)에서 선분 \(\mathrm{OA}\)에 내린 수선의 발을 \(\mathrm{H}\)라 하고, \(\angle\mathrm{OAP}\)를 이등분하는 직선과 세 선분 \(\mathrm{HP}\), \(\mathrm{OP}\), \(\mathrm{OB}\)의 교점을 각각 \(\mathrm{Q}\), \(\mathrm{R}\), \(\mathrm{S}\)라 하자. \(\angle\mathrm{APH}=\theta\)일 때, 삼각형 \(\mathrm{AQH}\)의 넓이를 \(f(\theta)\), 삼각형 \(\mathrm{PSR}\)의 넓이를 \(g(\theta)\)라 하자. \[\lim_{\theta\to 0+}\dfrac{\theta^{3}\times g(\theta)}{f(\theta)}=k\]일 때, \(100k\)의 값을 구하시오. (단, \(0&lt;\theta&lt;\dfrac{\pi}{4}\))`,
      figure: "2023-06-calc-29.webp",
      short: true,
      answer: 50,
      help: R`\(\triangle\mathrm{OAP}\)가 이등변삼각형임을 이용하여 각의 크기들을 \(\theta\)로 표현합니다. 각의 이등분선 성질과 직각삼각형 삼각비를 적용하여 두 삼각형 \(\mathrm{AQH}\)와 \(\mathrm{PSR}\)의 밑변과 높이를 \(\theta\)에 대한 삼각함수로 나타냅니다.`
    },
{
      id: "2023-06-calc-30", exam: "2023-06", no: 30, score: 4,
      units: ["calc-diff"], memo: "접선의 개수와 변곡점",
      body: R`양수 \(a\)에 대하여 함수 \(f(x)\)는 \[f(x)=\dfrac{x^{2}-ax}{e^{x}}\]이다. 실수 \(t\)에 대하여 \(x\)에 대한 방정식 \[f(x)=f'(t)(x-t)+f(t)\]의 서로 다른 실근의 개수를 \(g(t)\)라 하자. \(g(5)+\displaystyle\lim_{t\to 5}g(t)=5\)일 때, \(\displaystyle\lim_{t\to k-}g(t)\ne\lim_{t\to k+}g(t)\)를 만족시키는 모든 실수 \(k\)의 값의 합은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 16,
      help: R`방정식의 실근 개수 \(g(t)\)는 곡선 위의 점 \((t, f(t))\)에서의 접선과 곡선 \(y=f(x)\)의 교점 개수입니다. 교점 개수가 바뀌는 경계는 접선이 변곡접선이 되는 점(\(f''(t)=0\))이므로, 변곡점 조건에서 \(a\)의 값을 구합니다.`
    },
{
      id: "2023-06-geom-28", exam: "2023-06", no: 28, score: 4,
      units: ["geom-curve"], memo: "쌍곡선의 정의와 접선 조건, 거리 차의 최대",
      body: R`좌표평면에서 직선 \(y=2x-3\) 위를 움직이는 점 \(\mathrm{P}\)가 있다. 두 점 \(\mathrm{A}(c, 0), \mathrm{B}(-c, 0)\) (\(c > 0\))에 대하여 \(\overline{\mathrm{PB}}-\overline{\mathrm{PA}}\)의 값이 최대가 되도록 하는 점 \(\mathrm{P}\)의 좌표가 \((3, 3)\)일 때, 상수 \(c\)의 값은?`,
      choices: [R`\(\dfrac{3\sqrt{6}}{2}\)`, R`\(\dfrac{3\sqrt{7}}{2}\)`, R`\(3\sqrt{2}\)`, R`\(\dfrac{9}{2}\)`, R`\(\dfrac{3\sqrt{10}}{2}\)`],
      answer: 1,
      help: R`초점이 \(\mathrm{A}(c, 0), \mathrm{B}(-c, 0)\)인 쌍곡선에 대해 직선 \(y=2x-3\)이 점 \(\mathrm{P}(3, 3)\)에서 접할 때 거리 차 \(\overline{\mathrm{PB}}-\overline{\mathrm{PA}}=2a\)가 최대가 된다. 점 \((3, 3)\)에서의 접선의 기울기가 \(2\)임을 이용하여 쌍곡선의 방정식 \(\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1\)의 계수들을 구하고 초점 거리 \(c=\sqrt{a^2+b^2}\)을 산출한다.`
    },
{
      id: "2023-06-geom-29", exam: "2023-06", no: 29, score: 4,
      units: ["geom-curve"], memo: "두 포물선의 정의와 둘레 조건, 삼각형의 넓이",
      body: R`초점이 \(\mathrm{F}\)인 포물선 \(y^2=8x\) 위의 점 중 제\(1\)사분면에 있는 점 \(\mathrm{P}\)를 지나고 \(x\)축과 평행한 직선이 포물선 \(y^2=8x\)의 준선과 만나는 점을 \(\mathrm{F}'\)이라 하자. 점 \(\mathrm{F}'\)을 초점, 점 \(\mathrm{P}\)를 꼭짓점으로 하는 포물선이 포물선 \(y^2=8x\)와 만나는 점 중 \(\mathrm{P}\)가 아닌 점을 \(\mathrm{Q}\)라 하자. 사각형 \(\mathrm{PF}'\mathrm{QF}\)의 둘레의 길이가 \(12\)일 때, 삼각형 \(\mathrm{PF}'\mathrm{Q}\)의 넓이는 \(\dfrac{q}{p}\sqrt{2}\)이다. \(p+q\)의 값을 구하시오. (단, 점 \(\mathrm{P}\)의 \(x\)좌표는 \(2\)보다 작고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2023-06-geom-29.webp",
      short: true,
      answer: 23,
      help: R`포물선 \(y^2=8x\)의 준선은 \(x=-2\)이다. 포물선의 정의에 의해 \(\overline{\mathrm{PF}}=\overline{\mathrm{PF}'}=x_P+2\)이다. 두 번째 포물선의 초점과 준선 성질을 이용해 점 \(\mathrm{Q}\)의 위치와 사각형의 네 변의 길이를 \(x_P\)로 나타내고 둘레가 \(12\)임을 연립하여 \(\triangle \mathrm{PF}'\mathrm{Q}\)의 넓이를 구한다.`
    },
{
      id: "2023-06-geom-30", exam: "2023-06", no: 30, score: 4,
      units: ["geom-vector"], memo: "정육각형 변 위의 점과 원 위의 점의 합성 궤적 및 벡터 내분 조건",
      body: R`좌표평면에서 한 변의 길이가 \(4\)인 정육각형 \(\mathrm{ABCDEF}\)의 변 위를 움직이는 점 \(\mathrm{P}\)가 있고, 점 \(\mathrm{C}\)를 중심으로 하고 반지름의 길이가 \(1\)인 원 위를 움직이는 점 \(\mathrm{Q}\)가 있다. 두 점 \(\mathrm{P}, \mathrm{Q}\)와 실수 \(k\)에 대하여 점 \(\mathrm{X}\)가 다음 조건을 만족시킬 때, \(|\vec{\mathrm{CX}}|\)의 값이 최소가 되도록 하는 \(k\)의 값을 \(\alpha\), \(|\vec{\mathrm{CX}}|\)의 값이 최대가 되도록 하는 \(k\)의 값을 \(\beta\)라 하자.`,
      figure: "2023-06-geom-30.webp",
      note: [
        R`(가) \(\vec{\mathrm{CX}} = \dfrac{1}{2}\vec{\mathrm{CP}} + \vec{\mathrm{CQ}}\)`,
        R`(나) \(\vec{\mathrm{XA}} + \vec{\mathrm{XC}} + 2\vec{\mathrm{XD}} = k\vec{\mathrm{CD}}\)`
      ],
            bodyAfter: R`\(\alpha^2+\beta^2\)의 값을 구하시오.`,
short: true,
      answer: 8,
      help: R`조건 (나)를 점 \(\mathrm{C}\) 기준으로 정리하면 \(4\vec{\mathrm{XC}}+\vec{\mathrm{CA}}+2\vec{\mathrm{CD}}=k\vec{\mathrm{CD}}\)에서 \(\vec{\mathrm{CX}}=\dfrac{1}{4}\vec{\mathrm{CA}}+\dfrac{2-k}{4}\vec{\mathrm{CD}}\)가 되어 점 \(\mathrm{X}\)는 직선 위에 놓인다. 조건 (가)가 나타내는 영역(정육각형의 \(1/2\) 축소 도형에 반지름 \(1\) 원을 더한 띠 영역)과 직선의 교선 범위를 분석하여 \(k\)의 최소 \(\alpha\)와 최대 \(\beta\)를 구한다.`
    }
  ];
})();
