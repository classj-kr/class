(function () {
  "use strict";
  const R = String.raw;
  // 2025-suneung 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2025-suneung"] = [
{
      id: "2025-suneung-9", exam: "2025-suneung", no: 9, score: 4,
      units: ["m2-integ"], memo: "적분 구간이 같은 두 정적분",
      body: R`함수 \(f(x)=3x^{2}-16x-20\)에 대하여
        \[\int_{-2}^{a} f(x)\,dx = \int_{-2}^{0} f(x)\,dx\]
        일 때, 양수 \(a\)의 값은?`,
      choices: [R`\(16\)`, R`\(14\)`, R`\(12\)`, R`\(10\)`, R`\(8\)`],
      answer: 4,
      help: R`양변에서 \(\int_{-2}^{0}\)을 빼면 \(\int_{0}^{a}f(x)\,dx=0\) 한 줄로 줄어든다. 아래끝 \(-2\)는 아무 일도 하지 않는다.`
    },
{
      id: "2025-suneung-10", exam: "2025-suneung", no: 10, score: 4,
      units: ["m1-trig"], memo: "코사인 함수가 최대가 되는 자리",
      body: R`닫힌구간 \([0,\,2\pi]\)에서 정의된 함수 \(f(x)=a\cos bx+3\)이
        \(x=\dfrac{\pi}{3}\)에서 최댓값 \(13\)을 갖도록 하는 두 자연수 \(a\), \(b\)의
        순서쌍 \((a,\,b)\)에 대하여 \(a+b\)의 최솟값은?`,
      choices: [R`\(12\)`, R`\(14\)`, R`\(16\)`, R`\(18\)`, R`\(20\)`],
      answer: 3,
      help: R`최댓값이 \(13\)이니 \(a+3=13\), 곧 \(a=10\)으로 먼저 정해진다. 그리고 \(x=\frac{\pi}{3}\)에서 최대가 되려면 \(\cos\frac{b\pi}{3}=1\), 곧 \(\frac{b\pi}{3}\)가 \(2\pi\)의 배수여야 한다.`
    },
{
      id: "2025-suneung-11", exam: "2025-suneung", no: 11, score: 4,
      units: ["m2-diff"], memo: "운동 방향이 바뀌는 시각의 가속도",
      body: R`시각 \(t=0\)일 때 출발하여 수직선 위를 움직이는 점 \(\mathrm{P}\)의
        시각 \(t\,(t\ge 0)\)에서의 위치 \(x\)가
        \[x=t^{3}-\frac{3}{2}t^{2}-6t\]
        이다. 출발한 후 점 \(\mathrm{P}\)의 운동 방향이 바뀌는 시각에서의
        점 \(\mathrm{P}\)의 가속도는?`,
      choices: [R`\(6\)`, R`\(9\)`, R`\(12\)`, R`\(15\)`, R`\(18\)`],
      answer: 2,
      help: R`속도는 \(x'=3t^{2}-3t-6=3(t-2)(t+1)\)이다. \(t\ge 0\)에서 부호가 바뀌는 시각은 \(t=2\) 하나뿐이라 그 자리만 보면 된다.`
    },
{
      id: "2025-suneung-12", exam: "2025-suneung", no: 12, score: 4,
      units: ["m1-seq"], memo: "부분합이 주어진 수열의 항 구하기",
      body: R`\(a_{1}=2\)인 수열 \(\{a_{n}\}\)과 \(b_{1}=2\)인 등차수열 \(\{b_{n}\}\)이
        모든 자연수 \(n\)에 대하여
        \[\sum_{k=1}^{n}\frac{a_{k}}{b_{k+1}}=\frac{1}{2}n^{2}\]
        을 만족시킬 때, \(\displaystyle\sum_{k=1}^{5}a_{k}\)의 값은?`,
      choices: [R`\(120\)`, R`\(125\)`, R`\(130\)`, R`\(135\)`, R`\(140\)`],
      answer: 1,
      help: R`\(n=1\)을 넣으면 \(\frac{a_{1}}{b_{2}}=\frac{1}{2}\)에서 \(b_{2}=4\)가 나와 공차가 \(2\)로 정해진다. 그리고 \(\frac{a_{n}}{b_{n+1}}\)은 부분합의 차 \(\frac{n^{2}}{2}-\frac{(n-1)^{2}}{2}=\frac{2n-1}{2}\)이므로 \(a_{n}\)이 곧바로 구해진다.`
    },
{
      id: "2025-suneung-13", exam: "2025-suneung", no: 13, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "위아래가 바뀐 두 넓이의 차",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)가
        \[f(1)=f(2)=0,\qquad f'(0)=-7\]
        을 만족시킨다. 원점 \(\mathrm{O}\)와 점 \(\mathrm{P}\bigl(3,\,f(3)\bigr)\)에 대하여 선분 \(\mathrm{OP}\)가
        곡선 \(y=f(x)\)와 만나는 점 중 \(\mathrm{P}\)가 아닌 점을 \(\mathrm{Q}\)라 하자.
        곡선 \(y=f(x)\)와 \(y\)축 및 선분 \(\mathrm{OQ}\)로 둘러싸인 부분의 넓이를 \(A\),
        곡선 \(y=f(x)\)와 선분 \(\mathrm{PQ}\)로 둘러싸인 부분의 넓이를 \(B\)라 할 때,
        \(B-A\)의 값은?`,
      figure: "2025-suneung-13.webp",
      choices: [R`\(\dfrac{37}{4}\)`, R`\(\dfrac{39}{4}\)`, R`\(\dfrac{41}{4}\)`, R`\(\dfrac{43}{4}\)`, R`\(\dfrac{45}{4}\)`],
      answer: 5,
      help: R`\(f'(0)=-7\)에서 \(f(x)=(x-1)(x-2)(x+3)\)이 정해지고, 그러면 \(\mathrm{P}(3,\,12)\)라 직선 \(\mathrm{OP}\)는 \(y=4x\)다. \(A\)와 \(B\)는 곡선과 직선의 위아래가 서로 바뀐 두 조각이므로, \(B-A\)는 부호를 붙여 묶으면 교점 \(\mathrm{Q}\)를 구하지 않고 \(\int_{0}^{3}\bigl(4x-f(x)\bigr)dx\) 한 줄이 된다.`
    },
{
      id: "2025-suneung-14", exam: "2025-suneung", no: 14, score: 4,
      units: ["m1-trig"], memo: "각을 함께 쓰는 두 삼각형의 넓이비",
      body: R`그림과 같이 삼각형 \(\mathrm{ABC}\)에서 선분 \(\mathrm{AB}\) 위에 \(\overline{\mathrm{AD}}:\overline{\mathrm{DB}}=3:2\)인
        점 \(\mathrm{D}\)를 잡고, 점 \(\mathrm{A}\)를 중심으로 하고 점 \(\mathrm{D}\)를 지나는 원을 \(O\),
        원 \(O\)와 선분 \(\mathrm{AC}\)가 만나는 점을 \(\mathrm{E}\)라 하자.
        \(\sin A:\sin C=8:5\)이고, 삼각형 \(\mathrm{ADE}\)와 삼각형 \(\mathrm{ABC}\)의 넓이의
        비가 \(9:35\)이다. 삼각형 \(\mathrm{ABC}\)의 외접원의 반지름의 길이가 \(7\)일 때,
        원 \(O\) 위의 점 \(\mathrm{P}\)에 대하여 삼각형 \(\mathrm{PBC}\)의 넓이의 최댓값은?
        (단, \(\overline{\mathrm{AB}}&lt;\overline{\mathrm{AC}}\))`,
      figure: "2025-suneung-14.webp",
      choices: [R`\(18+15\sqrt{3}\)`, R`\(24+20\sqrt{3}\)`, R`\(30+25\sqrt{3}\)`, R`\(36+30\sqrt{3}\)`, R`\(42+35\sqrt{3}\)`],
      answer: 4,
      help: R`\(\sin A:\sin C=8:5\)는 사인법칙으로 \(\overline{\mathrm{BC}}:\overline{\mathrm{AB}}=8:5\)라는 뜻이다. 그리고 삼각형 \(\mathrm{ADE}\)와 \(\mathrm{ABC}\)는 각 \(\mathrm{A}\)를 함께 쓰므로 넓이의 비가 \(\overline{\mathrm{AD}}\times\overline{\mathrm{AE}}\)와 \(\overline{\mathrm{AB}}\times\overline{\mathrm{AC}}\)의 비다. \(\overline{\mathrm{AD}}=\overline{\mathrm{AE}}\)가 원의 반지름이므로 이 두 비가 세 변을 한꺼번에 묶어 준다.`
    },
{
      id: "2025-suneung-15", exam: "2025-suneung", no: 15, score: 4,
      units: ["m2-diff"], memo: "이어 붙인 두 함수가 미분가능할 조건",
      body: R`상수 \(a\,(a\ne 3\sqrt{5}\,)\)와 최고차항의 계수가 음수인 이차함수
        \(f(x)\)에 대하여 함수
        \[g(x)=\begin{cases}x^{3}+ax^{2}+15x+7 &amp; (x\le 0)\\ f(x) &amp; (x>0)\end{cases}\]
        이 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 함수 \(g(x)\)는 실수 전체의 집합에서 미분가능하다.`,
        R`(나) \(x\)에 대한 방정식 \(g'(x)\times g'(x-4)=0\)의 서로 다른 실근의 개수는 \(4\)이다.`
      ],
      bodyAfter: R`\(g(-2)+g(2)\)의 값은?`,
      choices: [R`\(30\)`, R`\(32\)`, R`\(34\)`, R`\(36\)`, R`\(38\)`],
      answer: 2,
      help: R`(가)에서 \(x=0\)이 이어지고 기울기도 같아야 하므로 \(f(0)=7\), \(f'(0)=15\)다. \(f\)가 이차함수라 이 둘이 잡히면 남는 것은 최고차항의 계수 하나뿐이고, 그것을 (나)가 정해 준다.`
    },
{
      id: "2025-suneung-20", exam: "2025-suneung", no: 20, score: 4,
      units: ["m1-explog"], memo: "합성함수 조건으로 정의역 밖의 값 찾기",
      body: R`곡선 \(y=\left(\dfrac{1}{5}\right)^{x-3}\)과 직선 \(y=x\)가 만나는 점의 \(x\)좌표를
        \(k\)라 하자. 실수 전체의 집합에서 정의된 함수 \(f(x)\)가 다음
        조건을 만족시킨다.`,
      note: [
        R`\(x>k\)인 모든 실수 \(x\)에 대하여 \(f(x)=\left(\dfrac{1}{5}\right)^{x-3}\)이고 \(f\bigl(f(x)\bigr)=3x\)이다.`
      ],
      bodyAfter: R`\(f\left(\dfrac{1}{k^{3}\times 5^{3k}}\right)\)의 값을 구하시오.`,
      short: true,
      answer: 36,
      help: R`\(k\)는 \(k=5^{\,3-k}\)를 만족시키므로 \(k^{3}\times 5^{3k}=5^{\,9-3k}\times 5^{3k}=5^{9}\)이다. 곧 구하는 것은 \(f\left(5^{-9}\right)\)다. 그리고 \(x>k\)이면 \(f(x)&lt;k\)이므로 \(k\)보다 작은 자리에서의 \(f\)는 주어진 식이 아니라 \(f\bigl(f(x)\bigr)=3x\)가 알려 준다.`
    },
{
      id: "2025-suneung-21", exam: "2025-suneung", no: 21, score: 4,
      units: ["m2-limit"], memo: "근이 근을 낳는 극한 조건",
      body: R`함수 \(f(x)=x^{3}+ax^{2}+bx+4\)가 다음 조건을 만족시키도록
        하는 두 정수 \(a\), \(b\)에 대하여 \(f(1)\)의 최댓값을 구하시오.`,
      note: [
        R`모든 실수 \(\alpha\)에 대하여 \(\displaystyle\lim_{x\to\alpha}\frac{f(2x+1)}{f(x)}\)의 값이 존재한다.`
      ],
      short: true,
      answer: 16,
      help: R`분모가 \(0\)이 되는 자리, 곧 \(f\)의 실근 \(r\)마다 분자 \(f(2r+1)\)도 \(0\)이어야 한다. 그러니 \(r\)가 근이면 \(2r+1\)도 근이다. 삼차함수의 근은 많아야 셋뿐이라, 이 \(r\mapsto 2r+1\)이 근들 안에서 맴돌아야 하고 그럴 수 있는 경우는 몇 가지뿐이다.`
    },
{
      id: "2025-suneung-22", exam: "2025-suneung", no: 22, score: 4,
      units: ["m1-seq"], memo: "홀짝에 따라 갈리는 점화식 거꾸로 오르기",
      body: R`모든 항이 정수이고 다음 조건을 만족시키는 모든 수열
        \(\{a_{n}\}\)에 대하여 \(|a_{1}|\)의 값의 합을 구하시오.`,
      note: [
        R`(가) 모든 자연수 \(n\)에 대하여 \(a_{n+1}=\begin{cases}a_{n}-3 &amp; \left(|a_{n}|\text{이 홀수인 경우}\right)\\[2pt] \dfrac{1}{2}a_{n} &amp; \left(a_{n}=0 \text{ 또는 } |a_{n}|\text{이 짝수인 경우}\right)\end{cases}\)이다.`,
        R`(나) \(|a_{m}|=|a_{m+2}|\)인 자연수 \(m\)의 최솟값은 \(3\)이다.`
      ],
      short: true,
      answer: 64,
      help: R`(나)의 "최솟값이 \(3\)"은 두 가지를 함께 말한다. \(|a_{3}|=|a_{5}|\)이면서, \(m=1\)과 \(m=2\)에서는 그렇지 않다는 것. 규칙이 값을 줄이는 쪽이라 \(a_{1}\)부터 앞으로 밀기보다 \(|a_{3}|=|a_{5}|\)가 되는 자리를 먼저 찾고 거꾸로 거슬러 올라가는 편이 빠르다.`
    },
{
      id: "2025-suneung-prob-28", exam: "2025-suneung", no: 28, score: 4,
      units: ["prob-count"], memo: "부등식과 약수 조건을 만족시키는 함수의 개수 (중복조합)",
      body: R`집합 \(X=\{1, 2, 3, 4, 5, 6\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수는?`,
      noteTitle: "조 건",
      note: [
        R`(가) \(f(1)\times f(6)\)의 값이 \(6\)의 약수이다.`,
        R`(나) \(2f(1)\le f(2)\le f(3)\le f(4)\le f(5)\le 2f(6)\)`
      ],
      choices: [R`\(166\)`, R`\(171\)`, R`\(176\)`, R`\(181\)`, R`\(186\)`],
      answer: 2,
      help: R`\(f(1)f(6)\)이 6의 약수이므로 순서쌍 \((f(1), f(6))\)은 \((1, 1), (1, 2), (1, 3), (1, 6), (2, 3), (3, 2)\) 등이 가능하다. 조건 (나)가 성립하려면 \(2f(1)\le 2f(6)\), 즉 \(f(1)\le f(6)\)이어야 하므로 가능한 쌍을 분류하고 각 경우 \(f(2), \dots, f(5)\)의 개수를 중복조합 \({}_{n}\mathrm{H}_{4}\)로 계산한다.`
    },
{
      id: "2025-suneung-prob-29", exam: "2025-suneung", no: 29, score: 4,
      units: ["prob-stat"], memo: "정규분포의 대칭성과 평행이동",
      body: R`정규분포 \(\mathrm{N}(m_1, \sigma_1^2)\)을 따르는 확률변수 \(X\)와 정규분포 \(\mathrm{N}(m_2, \sigma_2^2)\)를 따르는 확률변수 \(Y\)가 다음 조건을 만족시킨다.
모든 실수 \(x\)에 대하여 \(\mathrm{P}(X\le x)=\mathrm{P}(X\ge 40-x)\)이고 \(\mathrm{P}(Y\le x)=\mathrm{P}(X\le x+10)\)이다.
\(\mathrm{P}(15\le X\le 20) + \mathrm{P}(15\le Y\le 20)\)의 값을 오른쪽 표준정규분포표를 이용하여 구한 것이 \(0.4772\)일 때, \(m_1 + \sigma_2\)의 값을 구하시오. (단, \(\sigma_1\)과 \(\sigma_2\)는 양수이다.)`,
      figure: "2025-suneung-prob-29.webp",
      short: true,
      answer: 25,
      help: R`\(\mathrm{P}(X\le x)=\mathrm{P}(X\ge 40-x)\)에서 \(X\)의 평균은 \(m_1 = 20\)이다. \(\mathrm{P}(Y\le x)=\mathrm{P}(X\le x+10)\)에서 \(Y = X - 10\) 분포이므로 \(m_2 = 10\), \(\sigma_2 = \sigma_1\)이다. 주어진 확률 합 \(0.4772\)가 \(\mathrm{P}(0\le Z\le 2.0)\)와 일치함을 이용하여 표준편차 \(\sigma_2=5\)를 구한다.`
    },
{
      id: "2025-suneung-prob-30", exam: "2025-suneung", no: 30, score: 4,
      units: ["prob-prob"], memo: "동전 뒤집기 시행과 조건부확률",
      body: R`탁자 위에 \(5\)개의 동전이 일렬로 놓여 있다. 이 \(5\)개의 동전 중 \(1\)번째 자리와 \(2\)번째 자리의 동전은 앞면이 보이도록 놓여 있고, 나머지 자리의 \(3\)개의 동전은 뒷면이 보이도록 놓여 있다. 이 \(5\)개의 동전과 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(k\)일 때,
\(k\le 5\)이면 \(k\)번째 자리의 동전을 한 번 뒤집어 제자리에 놓고,
\(k=6\)이면 모든 동전을 한 번씩 뒤집어 제자리에 놓는다.
위의 시행을 \(3\)번 반복한 후 이 \(5\)개의 동전이 모두 앞면이 보이도록 놓여 있을 확률은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 19,
      help: R`초기 상태는 (앞, 앞, 뒤, 뒤, 뒤)이다. 3회 시행 후 모두 앞면이 되려면 각 자리의 반전 횟수의 홀짝이 결정된다. 눈 6(전체 뒤집기)이 나온 횟수(0, 1, 2, 3회)에 따라 각 위치의 동전이 개별적으로 몇 번 뒤집혀야 하는지 경우를 나누어 확률을 계산하면 \(\dfrac{3}{16}\)이 나온다.`
    },
{
      id: "2025-suneung-calc-28", exam: "2025-suneung", no: 28, score: 4,
      units: ["calc-integ", "calc-diff"], memo: "접선과 곡선으로 둘러싸인 도형의 넓이와 도함수",
      body: R`실수 전체의 집합에서 미분가능한 함수 \(f(x)\)의 도함수 \(f'(x)\)가
\[f'(x)=-x+e^{1-x^{2}}\]
이다. 양수 \(t\)에 대하여 곡선 \(y=f(x)\) 위의 점 \((t,\,f(t))\)에서의 접선과 곡선 \(y=f(x)\) 및 \(y\)축으로 둘러싸인 부분의 넓이를 \(g(t)\)라 하자. \(g(1)+g'(1)\)의 값은?`,
      choices: [R`\(\dfrac{1}{2}e+\dfrac{1}{2}\)`, R`\(\dfrac{1}{2}e+\dfrac{2}{3}\)`, R`\(\dfrac{1}{2}e+\dfrac{5}{6}\)`, R`\(\dfrac{2}{3}e+\dfrac{1}{2}\)`, R`\(\dfrac{2}{3}e+\dfrac{2}{3}\)`],
      answer: 2,
      help: R`\(x&gt;0\)에서 \(f''(x)&lt;0\)이므로 접선이 곡선보다 항상 위쪽에 있어 \(g(t)=\int_{0}^{t} \left(f'(t)(x-t)+f(t)-f(x)\right)dx\)로 세워집니다. \(g(t)\)를 \(t\)에 대해 미분하면 라이프니츠 규칙에 의해 \(g'(t)=-\frac{t^{2}}{2}f''(t)\)로 대폭 단순화됩니다. \(g(1)\)은 부분적분을 활용하여 \(f(1)\) 없이 \(\int_{0}^{1} x f'(x)dx\)만으로 깔끔하게 계산할 수 있습니다.`
    },
{
      id: "2025-suneung-calc-29", exam: "2025-suneung", no: 29, score: 4,
      units: ["calc-seq"], memo: "등비급수의 성질과 부호 교대 급수 부등식",
      body: R`등비수열 \(\{a_{n}\}\)이
\[\sum_{n=1}^{\infty}\left(|a_{n}|+a_{n}\right)=\frac{40}{3},\qquad \sum_{n=1}^{\infty}\left(|a_{n}|-a_{n}\right)=\frac{20}{3}\]
을 만족시킨다. 부등식
\[\lim_{n\to\infty}\sum_{k=1}^{2n}\left((-1)^{\frac{k(k+1)}{2}}\times a_{m+k}\right)&gt;\frac{1}{700}\]
을 만족시키는 모든 자연수 \(m\)의 값의 합을 구하시오.`,
      short: true,
      answer: 25,
      help: R`\(|a_{n}|+a_{n}\)과 \(|a_{n}|-a_{n}\)의 합이 모두 양수이므로 공비가 음수(\(r&lt;0\))임을 바로 파악하여 \(a_{1}=5, r=-\frac{1}{2}\)을 구합니다. \((-1)^{\frac{k(k+1)}{2}}\)은 부호가 \(-, -, +, +\)로 4주기 순환하므로 4개 항씩 묶어 등비급수를 계산하면 합이 \(-2(-\frac{1}{2})^{m}\)이 됩니다. 합이 양수가 되려면 \(m\)이 홀수여야 하므로 \(2^{m-1}&lt;700\)을 만족하는 홀수 \(m=1, 3, 5, 7, 9\)의 합 25를 구합니다.`
    },
{
      id: "2025-suneung-calc-30", exam: "2025-suneung", no: 30, score: 4,
      units: ["calc-diff"], memo: "삼각함수 합성함수의 주기성과 극대점",
      body: R`두 상수 \(a\,(1\le a\le 2)\), \(b\)에 대하여 함수
\[f(x)=\sin(ax+b+\sin x)\]
가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(f(0)=0\), \(f(2\pi)=2\pi a+b\)`,
        R`(나) \(f'(0)=f'(t)\)인 양수 \(t\)의 최솟값은 \(4\pi\)이다.`
      ],
            bodyAfter: R`함수 \(f(x)\)가 \(x=\alpha\)에서 극대인 \(\alpha\)의 값 중 열린구간 \((0,\,4\pi)\)에 속하는 모든 값의 집합을 \(A\)라 하자. 집합 \(A\)의 원소의 개수를 \(n\), 집합 \(A\)의 원소 중 가장 작은 값을 \(\alpha_{1}\)이라 하면,
\[n\alpha_{1}-ab=\frac{q}{p}\pi\]
이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 17,
      help: R`\(-1\le \sin\theta\le 1\)과 \(\sin\theta=\theta\)의 유일해 성질로부터 \(2\pi a+b=0\)이어야 하므로 \(b=-2\pi a\)이고 \(\sin(-2\pi a)=0\)에서 \(a=\frac{3}{2}, b=-3\pi\)가 결정됩니다. \(f'(x)\)의 곱 형태에서 최솟값 \(4\pi\) 조건을 만족함을 검산하고, \(f(x)=-\sin(\frac{3}{2}x+\sin x)\)의 극대점들을 \(\frac{3}{2}x+\sin x\)의 값의 범위에서 찾아내면 \(n=3\)과 \(\alpha_{1}\)을 얻어 \(p+q=17\)이 나옵니다.`
    },
{
      id: "2025-suneung-geom-28", exam: "2025-suneung", no: 28, score: 4,
      units: ["geom-space"], memo: "직각삼각형과 구의 단면원, 직선까지의 거리",
      body: R`좌표공간에 \(\overline{\mathrm{AB}}=8\), \(\overline{\mathrm{BC}}=6\), \(\angle\mathrm{ABC}=\dfrac{\pi}{2}\)인 직각삼각형 \(\mathrm{ABC}\)와 선분 \(\mathrm{AC}\)를 지름으로 하는 구 \(S\)가 있다. 직선 \(\mathrm{AB}\)를 포함하고 평면 \(\mathrm{ABC}\)에 수직인 평면이 구 \(S\)와 만나서 생기는 원을 \(O\)라 하자. 원 \(O\) 위의 점 중에서 직선 \(\mathrm{AC}\)까지의 거리가 \(4\)인 서로 다른 두 점을 \(\mathrm{P}\), \(\mathrm{Q}\)라 할 때, 선분 \(\mathrm{PQ}\)의 길이는?`,
      figure: "2025-suneung-geom-28.webp",
      choices: [R`\(\sqrt{43}\)`, R`\(\sqrt{47}\)`, R`\(\sqrt{51}\)`, R`\(\sqrt{55}\)`, R`\(\sqrt{59}\)`],
      answer: 4,
      help: R`직각삼각형 \(\mathrm{ABC}\)의 빗변 \(\overline{\mathrm{AC}}=10\)이 구 \(S\)의 지름이므로 구의 반지름은 \(5\)이다. 좌표계를 설정하여 구의 방정식과 원 \(O\)가 놓인 평면의 방정식을 세우고, 원 위의 점 \((x, y, z)\)에서 직선 \(\mathrm{AC}\)까지의 거리 공식을 적용하여 두 점 \(\mathrm{P}, \mathrm{Q}\)의 좌표를 구해 \(\overline{\mathrm{PQ}}\)를 계산한다.`
    },
{
      id: "2025-suneung-geom-29", exam: "2025-suneung", no: 29, score: 4,
      units: ["geom-curve"], memo: "쌍곡선의 정의와 닮음인 삼각형의 성질",
      body: R`두 초점이 \(\mathrm{F}(c, 0)\), \(\mathrm{F}'(-c, 0)\) (\(c > 0\))인 쌍곡선 \(x^2-\dfrac{y^2}{35}=1\)이 있다. 이 쌍곡선 위에 있는 제\(1\)사분면 위의 점 \(\mathrm{P}\)에 대하여 직선 \(\mathrm{PF}'\) 위에 \(\overline{\mathrm{PQ}}=\overline{\mathrm{PF}}\)인 점 \(\mathrm{Q}\)를 잡자. 삼각형 \(\mathrm{QF}'\mathrm{F}\)와 삼각형 \(\mathrm{FF}'\mathrm{P}\)가 서로 닮음일 때, 삼각형 \(\mathrm{PFQ}\)의 넓이는 \(\dfrac{q}{p}\sqrt{5}\)이다. \(p+q\)의 값을 구하시오. (단, \(\overline{\mathrm{PF}'} &lt; \overline{\mathrm{QF}'}\)이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2025-suneung-geom-29.webp",
      short: true,
      answer: 107,
      help: R`쌍곡선의 주축의 길이는 \(2a=2\), 초점 거리는 \(2c=2\sqrt{1+35}=12\)이다. \(\overline{\mathrm{PF}'}-\overline{\mathrm{PF}}=2\)이고 \(\triangle \mathrm{QF}'\mathrm{F} \sim \triangle \mathrm{FF}'\mathrm{P}\)에서 각 \(\angle\mathrm{F}'\)을 공유하므로 대응변의 길이 비를 세워 이등변삼각형 \(\triangle \mathrm{PFQ}\)의 변의 길이와 꼭지각을 구하고 넓이를 산출한다.`
    },
{
      id: "2025-suneung-geom-30", exam: "2025-suneung", no: 30, score: 4,
      units: ["geom-vector"], memo: "벡터 방정식이 나타내는 도형과 내적의 최대·최소",
      body: R`좌표평면에 한 변의 길이가 \(4\)인 정사각형 \(\mathrm{ABCD}\)가 있다.
\[|\vec{\mathrm{XB}}+\vec{\mathrm{XC}}|=|\vec{\mathrm{XB}}-\vec{\mathrm{XC}}|\]
를 만족시키는 점 \(\mathrm{X}\)가 나타내는 도형을 \(S\)라 하자. 도형 \(S\) 위의 점 \(\mathrm{P}\)에 대하여
\[4\vec{\mathrm{PQ}}=\vec{\mathrm{PB}}+2\vec{\mathrm{PD}}\]
를 만족시키는 점을 \(\mathrm{Q}\)라 할 때, \(\vec{\mathrm{AC}}\cdot\vec{\mathrm{AQ}}\)의 최댓값과 최솟값을 각각 \(M\), \(m\)이라 하자. \(M\times m\)의 값을 구하시오.`,
      figure: "2025-suneung-geom-30.webp",
      short: true,
      answer: 316,
      help: R`\(|\vec{\mathrm{XB}}+\vec{\mathrm{XC}}|=|\vec{\mathrm{XB}}-\vec{\mathrm{XC}}|\)는 선분 \(\mathrm{BC}\)를 지름으로 하는 원 \(S\)를 나타낸다. 점 \(\mathrm{Q}\)를 원점 기준으로 표현하면 \(\vec{\mathrm{OQ}}=\dfrac{1}{4}\vec{\mathrm{OP}}+\dfrac{1}{4}\vec{\mathrm{OB}}+\dfrac{1}{2}\vec{\mathrm{OD}}\) 형태의 원형 궤적을 그리므로, \(\vec{\mathrm{AC}}\cdot\vec{\mathrm{AQ}}\)를 중심 성분과 반지름 성분으로 분해하여 최대·최소를 구한다.`
    }
  ];
})();
