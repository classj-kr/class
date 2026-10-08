(function () {
  "use strict";
  const R = String.raw;
  // 2026-06 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2026-06"] = [
{
      id: "2026-06-9", exam: "2026-06", no: 9, score: 4,
      units: ["m2-integ"], memo: "대칭 구간에서의 정적분",
      body: R`함수 \(f(x)=x^{2}+ax\)에 대하여
        \[\int_{-3}^{3}(x+1)f(x)\,dx = 36+\int_{-3}^{3}f(x)\,dx\]
        일 때, 상수 \(a\)의 값은?`,
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 2,
      help: R`적분 구간이 \(-3\)부터 \(3\)까지 원점에 대하여 대칭이라 홀수 차수 항의 적분은 모두 \(0\)이다. \((x+1)f(x)\)를 전개하면 짝수 차수인 \((a+1)x^{2}\)만 살아남는다.`
    },
{
      id: "2026-06-10", exam: "2026-06", no: 10, score: 4,
      units: ["m1-explog"], memo: "로그 곡선 두 개와 정삼각형",
      body: R`실수 \(a\,(a>1)\)에 대하여
        곡선 \(y=\log_{a}(x+3)\)이 곡선 \(y=\log_{a}(-x+3)\)과 만나는 점을 \(\mathrm{A}\),
        곡선 \(y=\log_{a}(x+3)\)이 \(x\)축과 만나는 점을 \(\mathrm{B}\),
        곡선 \(y=\log_{a}(-x+3)\)이 \(x\)축과 만나는 점을 \(\mathrm{C}\)라 하자.
        삼각형 \(\mathrm{ABC}\)가 정삼각형일 때, \(a\)의 값은?`,
      choices: [R`\(3^{\frac{\sqrt{3}}{6}}\)`, R`\(3^{\frac{\sqrt{3}}{4}}\)`, R`\(3^{\frac{\sqrt{3}}{3}}\)`, R`\(3^{\frac{5\sqrt{3}}{12}}\)`, R`\(3^{\frac{\sqrt{3}}{2}}\)`],
      answer: 1,
      help: R`두 곡선은 \(y\)축에 대하여 서로 대칭이므로 교점 \(\mathrm{A}\)는 \(y\)축 위에 있고, \(\mathrm{B}(-2,\,0)\), \(\mathrm{C}(2,\,0)\)이다. 밑변 \(\overline{\mathrm{BC}}=4\)가 정해지니 정삼각형이라는 조건은 높이가 \(2\sqrt{3}\), 곧 \(\log_{a}3=2\sqrt{3}\)이라는 말이 된다.`
    },
{
      id: "2026-06-11", exam: "2026-06", no: 11, score: 4,
      units: ["m2-diff"], memo: "위치가 주어진 점의 속도와 가속도",
      body: R`시각 \(t=0\)일 때 출발하여 수직선 위를 움직이는 점 \(\mathrm{P}\)가 있다.
        시각이 \(t\,(t\ge 0)\)일 때 점 \(\mathrm{P}\)의 위치 \(x\)가
        \[x=t^{3}-t^{2}-t+1\]
        이다. &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. 시각 \(t=1\)일 때 점 \(\mathrm{P}\)의 위치는 \(1\)이다.`,
        R`ㄴ. 시각 \(t=1\)일 때 점 \(\mathrm{P}\)의 속도는 \(0\)이다.`,
        R`ㄷ. 출발한 후 점 \(\mathrm{P}\)의 운동 방향이 바뀌는 시각에 점 \(\mathrm{P}\)의 가속도는 \(4\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄴ`, R`ㄷ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`],
      answer: 5,
      help: R`위치가 바로 주어졌으니 속도는 \(x'=3t^{2}-2t-1=(3t+1)(t-1)\)이다. \(t\ge 0\)에서 부호가 바뀌는 곳은 \(t=1\) 하나뿐이라, ㄴ과 ㄷ이 같은 자리에서 함께 정해진다.`
    },
{
      id: "2026-06-12", exam: "2026-06", no: 12, score: 4,
      units: ["m1-seq"], memo: "두 갈래로 갈리는 점화식",
      body: R`다음 조건을 만족시키는 모든 수열 \(\{a_{n}\}\)에 대하여
        \(a_{4}\)의 최댓값은?`,
      note: [
        R`(가) \(a_{1}=a_{3}\)`,
        R`(나) 모든 자연수 \(n\)에 대하여 \(\left(a_{n+1}-a_{n}+3\right)\left(a_{n+1}-2a_{n}\right)=0\)이다.`
      ],
      choices: [R`\(9\)`, R`\(12\)`, R`\(15\)`, R`\(18\)`, R`\(21\)`],
      answer: 2,
      help: R`(나)는 각 \(n\)마다 \(a_{n+1}=a_{n}-3\)이거나 \(a_{n+1}=2a_{n}\), 둘 중 하나라는 뜻이다. \(a_{1}=a_{3}\)이므로 두 걸음 만에 제자리로 돌아오는 조합만 살아남고, 그 조합이 \(a_{1}\)의 값까지 정해 준다.`
    },
{
      id: "2026-06-13", exam: "2026-06", no: 13, score: 4,
      units: ["m2-integ"], memo: "넓이 세 조각을 부호로 묶기",
      body: R`그림과 같이 함수 \(f(x)=3x^{2}-7x+2\)에 대하여 곡선
        \(y=f(x)\)와 직선 \(y=\dfrac{1}{3}x-\dfrac{2}{3}\) 및 \(y\)축으로 둘러싸인 영역을 \(A\),
        곡선 \(y=f(x)\)와 직선 \(y=\dfrac{1}{3}x-\dfrac{2}{3}\)로 둘러싸인 영역을 \(B\),
        곡선 \(y=f(x)\)와 두 직선 \(y=\dfrac{1}{3}x-\dfrac{2}{3}\), \(x=k\,(k>2)\)로
        둘러싸인 영역을 \(C\)라 하자.
        \[(A\text{의 넓이})+(C\text{의 넓이})=(B\text{의 넓이})\]
        일 때, 상수 \(k\)의 값은?`,
      figure: "2026-06-13.webp",
      choices: [R`\(\dfrac{29}{12}\)`, R`\(\dfrac{5}{2}\)`, R`\(\dfrac{31}{12}\)`, R`\(\dfrac{8}{3}\)`, R`\(\dfrac{11}{4}\)`],
      answer: 4,
      help: R`\(B\)에서는 직선이 곡선보다 위에 있어 차의 부호가 반대다. 그래서 \(A+C=B\)는 부호를 붙여 더하면 \(\displaystyle\int_{0}^{k}\left(f(x)-\left(\frac{1}{3}x-\frac{2}{3}\right)\right)dx=0\)이라는 한 줄과 같은 말이 된다. 교점을 구할 필요가 없다.`
    },
{
      id: "2026-06-14", exam: "2026-06", no: 14, score: 4,
      units: ["m1-trig"], memo: "중점과 내분점이 만든 선분의 길이",
      body: R`\(\overline{\mathrm{AB}}=2\sqrt{7}\)인 삼각형 \(\mathrm{ABC}\)에서 선분 \(\mathrm{BC}\)의 중점을 \(\mathrm{P}\),
        선분 \(\mathrm{BC}\)를 \(5:1\)로 내분하는 점을 \(\mathrm{Q}\)라 하자.
        \[\overline{\mathrm{AQ}}=3\sqrt{2},\qquad \sin(\angle\mathrm{QAP}):\sin(\angle\mathrm{APQ})=\sqrt{2}:3\]
        일 때, 삼각형 \(\mathrm{ABC}\)의 외접원의 넓이는?`,
      figure: "2026-06-14.webp",
      choices: [R`\(\dfrac{85}{9}\pi\)`, R`\(\dfrac{88}{9}\pi\)`, R`\(\dfrac{91}{9}\pi\)`, R`\(\dfrac{94}{9}\pi\)`, R`\(\dfrac{97}{9}\pi\)`],
      answer: 2,
      help: R`삼각형 \(\mathrm{APQ}\)에서 사인법칙을 쓰면 \(\overline{\mathrm{PQ}}:\overline{\mathrm{AQ}}=\sin(\angle\mathrm{QAP}):\sin(\angle\mathrm{APQ})=\sqrt{2}:3\)이라 \(\overline{\mathrm{PQ}}=2\)가 곧바로 나온다. 한편 \(\mathrm{P}\)가 중점이고 \(\mathrm{Q}\)가 \(5:1\) 내분점이므로 \(\overline{\mathrm{PQ}}=\frac{1}{3}\overline{\mathrm{BC}}\), 곧 \(\overline{\mathrm{BC}}=6\)이다.`
    },
{
      id: "2026-06-15", exam: "2026-06", no: 15, score: 4,
      units: ["m2-diff"], memo: "오른쪽 미분계수가 늘 0 이하인 함수",
      body: R`상수 \(k\)와 \(f'(0)=6\)인 삼차함수 \(f(x)\)에 대하여 함수
        \[g(x)=\begin{cases}f(x)+k &amp; (|x|>1)\\ -f(x) &amp; (|x|\le 1)\end{cases}\]
        이 다음 조건을 만족시킬 때, \(k+f\left(\dfrac{1}{2}\right)\)의 값은?`,
      note: [
        R`(가) 모든 실수 \(a\)에 대하여 \(\displaystyle\lim_{x\to a+}\frac{g(x)-g(a)}{x-a}\)의 값이 존재하고 그 값은 \(0\) 이하이다.`,
        R`(나) \(x\)에 대한 방정식 \(g(x)=t\)의 서로 다른 실근의 개수가 \(2\)가 되도록 하는 실수 \(t\)의 최댓값은 \(13\)이다.`
      ],
      choices: [R`\(\dfrac{15}{4}\)`, R`\(\dfrac{27}{4}\)`, R`\(\dfrac{39}{4}\)`, R`\(\dfrac{51}{4}\)`, R`\(\dfrac{63}{4}\)`],
      answer: 1,
      help: R`(가)의 극한은 \(x=a\)에서의 오른쪽 미분계수다. 그 값이 어디서나 \(0\) 이하라는 것은 \(g\)에 올라가는 구간이 없다는 뜻이다. \(f'(0)=6>0\)인데도 이것이 가능한 까닭은 \(|x|\le 1\)에서 \(g=-f\)라 기울기의 부호가 뒤집히기 때문이다.`
    },
{
      id: "2026-06-20", exam: "2026-06", no: 20, score: 4,
      units: ["m1-seq"], memo: "주기함수의 방정식이 만든 등차수열 셋",
      body: R`실수 전체의 집합에서 정의된 함수 \(f(x)\)가 다음 조건을
        만족시킨다.`,
      note: [
        R`\(0\le x&lt;4\)일 때 \(f(x)=-x^{2}+4x\)이고, 모든 실수 \(x\)에 대하여 \(f(x+4)=f(x)\)이다.`
      ],
      bodyAfter: R`방정식 \(f\bigl(f(x)\bigr)=f(x)\)의 \(0\) 이상인 모든 실근을 작은 수부터
        크기순으로 나열할 때, \(n\)번째 수를 \(a_{n}\)이라 하자.
        다음은 \(a_{20}+a_{21}+a_{22}\)의 값을 구하는 과정이다.
        <div class="proof-box">
        <p>방정식 \(f(x)=x\)의 모든 실근이 \(0\), \(3\)이므로 방정식 \(f\bigl(f(x)\bigr)=f(x)\)의 실근을 구하는 것은 방정식 \(f(x)\times\bigl(f(x)-3\bigr)=0\)의 실근을 구하는 것과 같다.</p>
        <p>\(0\le x&lt;4\)일 때, 방정식 \(f(x)\times\bigl(f(x)-3\bigr)=0\)의 모든 실근은 \(0\), \(\fbox{(가)}\), \(3\)이므로</p>
        \[a_{1}=0,\quad a_{2}=\fbox{(가)},\quad a_{3}=3\]
        <p>이다. 또한 모든 실수 \(x\)에 대하여 \(f(x+4)=f(x)\)이므로 세 수열 \(\{a_{3n-2}\}\), \(\{a_{3n-1}\}\), \(\{a_{3n}\}\)은 첫째항이 각각 \(0\), \(\fbox{(가)}\), \(3\)이고 공차가 모두 \(\fbox{(나)}\)인 등차수열이다.</p>
        <p>따라서 \(a_{20}+a_{21}+a_{22}=\fbox{(다)}\)이다.</p>
        </div>
        위의 (가), (나), (다)에 알맞은 수를 각각 \(p\), \(q\), \(r\)이라 할 때,
        \(p+q+r\)의 값을 구하시오.`,
      short: true,
      answer: 85,
      help: R`\(f\bigl(f(x)\bigr)=f(x)\)는 \(f(x)\)가 방정식 \(f(t)=t\)의 근이라는 뜻이고, 그 근이 \(0\)과 \(3\)뿐이라 \(f(x)\bigl(f(x)-3\bigr)=0\)으로 바뀐다. 한 주기 \([0,\,4)\)에서 근을 다 찾고 나면, \(f(x+4)=f(x)\)이므로 나머지는 공차가 \(4\)인 등차수열 셋으로 갈린다.`
    },
{
      id: "2026-06-21", exam: "2026-06", no: 21, score: 4,
      units: ["m2-limit"], memo: "부호 함수와 절댓값이 든 두 극한",
      body: R`함수 \(f(x)=(x-1)(x-2)\)와 최고차항의 계수가 \(1\)인
        사차함수 \(g(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`모든 실수 \(a\)에 대하여 \(\displaystyle\lim_{x\to a}\frac{g(x)\times|f(x)|}{f(x)}\)의 값과 \(\displaystyle\lim_{x\to a}\frac{\bigl|g(x)-f(x)\bigr|}{g(x)}\)의 값이 모두 존재한다.`
      ],
      bodyAfter: R`\(g(-1)\)의 값을 구하시오.`,
      short: true,
      answer: 42,
      help: R`\(\frac{|f(x)|}{f(x)}\)는 \(f\)의 부호가 바뀌는 \(x=1\), \(x=2\)에서 \(1\)과 \(-1\)로 튄다. 첫 극한이 그 자리에서도 있으려면 곱해지는 \(g\)가 그 튐을 눌러야 하므로 \(g(1)=g(2)=0\)이다. 두 번째 극한은 \(g\)의 근에서 분모가 \(0\)이 되므로 분자도 \(0\)이어야 하고, 그래서 \(g\)의 근은 모두 \(f\)의 근이기도 해야 한다.`
    },
{
      id: "2026-06-22", exam: "2026-06", no: 22, score: 4,
      units: ["m1-explog"], memo: "지수 곡선 두 개의 교점과 삼각형 넓이",
      body: R`\(k>1\)인 실수 \(k\)에 대하여 두 곡선
        \[y=2^{x}+\frac{k}{2},\qquad y=k\times\left(\frac{1}{2}\right)^{x}+k-2\]
        가 만나는 점을 \(\mathrm{A}\)라 하고, 점 \(\mathrm{A}\)를 지나고 기울기가 \(-1\)인
        직선이 곡선 \(y=2^{\,x-2}-3\)과 만나는 점을 \(\mathrm{B}\)라 하자.
        삼각형 \(\mathrm{AOB}\)의 넓이가 \(16\)일 때, \(k+\log_{2}k=\dfrac{q}{p}\)이다.
        \(p+q\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이고, \(p\)와 \(q\)는 서로소인
        자연수이다.)`,
      short: true,
      answer: 38,
      help: R`두 곡선을 같게 놓고 \(2^{x}=u\)로 바꾸면 \(u^{2}+\left(2-\frac{k}{2}\right)u-k=0\)이 되고, 이것은 \((u+2)\left(u-\frac{k}{2}\right)=0\)으로 인수분해된다. \(u>0\)이므로 \(2^{x}=\frac{k}{2}\), 곧 \(\mathrm{A}\)의 \(x\)좌표가 \(\log_{2}k-1\)이다.`
    },
{
      id: "2026-06-prob-28", exam: "2026-06", no: 28, score: 4,
      units: ["prob-count"], memo: "합성함수 조건과 치역을 만족시키는 함수의 개수",
      body: R`집합 \(X=\{1, 2, 3, 4, 5, 6, 7\}\)과 \(X\)의 부분집합 \(Y=\{2, 4, 6\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수는?`,
      noteTitle: "조 건",
      note: [
        R`(가) 함수 \(f\)의 치역을 \(Z\)라 할 때, \(Z\cap Y = Y\)이다.`,
        R`(나) 집합 \(Y\)의 모든 원소 \(x\)에 대하여 \(f(f(x))=x\)이다.`
      ],
      choices: [R`\(1560\)`, R`\(1620\)`, R`\(1680\)`, R`\(1740\)`, R`\(1800\)`],
      answer: 5,
      help: R`조건 (나)에서 \(Y=\{2, 4, 6\}\) 위에서의 \(f\)는 항등함수이거나 1개의 호환(두 원소 교환)과 1개의 고정점을 갖는다. 치역이 \(Y\)의 모든 원소를 포함해야 하므로, 정의역의 남은 원소 \(\{1, 3, 5, 7\}\)의 함숫값 분배를 포함배제 원리로 계산하여 합산한다.`
    },
{
      id: "2026-06-prob-29", exam: "2026-06", no: 29, score: 4,
      units: ["prob-stat"], memo: "두 정규분포의 대칭성과 표준화",
      body: R`두 정규분포 \(\mathrm{N}(m_1, \sigma_1^2)\), \(\mathrm{N}(m_2, \sigma_2^2)\)를 따르는 확률변수 \(X, Y\)가 다음 조건을 만족시킨다.
(가) 모든 실수 \(x\)에 대하여 \(\mathrm{P}(X\le x) = \mathrm{P}(Y\ge 24-x)\)이다.
(나) \(\mathrm{P}(X\le 11) + \mathrm{P}(Y\le 11) = 1\)
\(\sigma_1 = 2\sigma_2\)일 때, \(m_1 + \sigma_1\)의 값을 구하시오. (단, \(\sigma_1, \sigma_2\)는 양수이다.)`,
      short: true,
      answer: 44,
      help: R`조건 (가)에서 대칭축 관계 \(m_1 + m_2 = 24\)와 \(\sigma_1 = \sigma_2\) 대신 주어진 \(\sigma_1 = 2\sigma_2\) 조건을 결합한다. 조건 (나)를 표준화하여 \(z\)값들의 관계식을 세우면 \(m_1 = 36, \sigma_1 = 8\)이 도출되어 \(m_1 + \sigma_1 = 44\)이다.`
    },
{
      id: "2026-06-prob-30", exam: "2026-06", no: 30, score: 4,
      units: ["prob-prob"], memo: "주머니 공 꺼내기와 독립시행 조건부확률",
      body: R`주머니에 \(1\)부터 \(5\)까지의 자연수가 하나씩 적혀 있는 \(5\)개의 공이 들어 있다. 이 주머니에서 임의로 한 개의 공을 꺼내어 공에 적혀 있는 수를 확인한 후 다시 넣는 시행을 한다. 이 시행을 \(4\)번 반복하여 확인한 \(4\)개의 수 중 최댓값을 \(M\), 최솟값을 \(m\)이라 하자.
\(M-m=3\)일 때, 확인한 네 수의 합이 짝수일 확률은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 115,
      help: R`\(M-m=3\)인 범위는 \(\{1, 2, 3, 4\}\) 또는 \(\{2, 3, 4, 5\}\)이다. 각 범위에서 최댓값과 최솟값을 반드시 포함하는 총 경우의 수를 포함배제(전체 \(4^4 - 2\cdot 3^4 + 2^4\))로 구하고, 네 수의 합이 짝수가 되는 조합(홀수가 0개, 2개, 4개)을 나누어 계산한다.`
    },
{
      id: "2026-06-calc-28", exam: "2026-06", no: 28, score: 4,
      units: ["calc-diff"], memo: "음함수의 미분과 함수의 부호 판별",
      body: R`실수 전체의 집합에서 이계도함수를 갖는 함수 \(f(x)\)와 두 상수 \(a\), \(b\)가 다음 조건을 만족시킬 때, \(a\times e^{b}\)의 값은?`,
      note: [
        R`(가) 모든 실수 \(x\)에 대하여
\[(f(x))^{5}+(f(x))^{3}+ax+b=\ln\left(x^{2}+x+\frac{5}{2}\right)\]
이다.`,
        R`(나) \(f(-3)f(3)&lt;0\), \(f'(2)&gt;0\)`
      ],
      choices: [R`\(-3e^{-\frac{4}{3}}\)`, R`\(-\dfrac{5}{3}e^{-\frac{4}{3}}\)`, R`\(-\dfrac{1}{3}e^{-\frac{4}{3}}\)`, R`\(e^{-\frac{4}{3}}\)`, R`\(\dfrac{7}{3}e^{-\frac{4}{3}}\)`],
      answer: 1,
      help: R`좌변의 \(h(y)=y^{5}+y^{3}\)이 일대일대응이므로 \(f(x)\)의 부호는 우변식 \(g(x)=\ln(x^{2}+x+\frac{5}{2})-ax-b\)의 부호와 일치합니다. \(f(x)\)가 이계도함수를 가지려면 \(f(x)=0\)인 지점에서 \(g'(x)=0\)이어야 함을 이용하여 \(a\)와 \(b\)를 결정합니다. 조건 (나)의 부호 판별로 여러 후보 중 조건에 맞는 \(a, b\)를 골라내면 됩니다.`
    },
{
      id: "2026-06-calc-29", exam: "2026-06", no: 29, score: 4,
      units: ["calc-seq"], memo: "삼각함수형 수열과 등비급수의 수렴",
      body: R`두 정수 \(\alpha\), \(\beta\,(\alpha&gt;\beta)\)에 대하여 다음 조건을 만족시키는 수열 \(\{a_{n}\}\)이 있다.
모든 자연수 \(n\)에 대하여
\[a_{n}=\alpha\times\sin\frac{n\pi}{2}+\beta\times\cos\frac{n\pi}{2}\]
이고, \(a_{1}\times a_{2}\times a_{3}\times a_{4}=4\)이다.
수열 \(\{a_{n}\}\)과 \(b_{1}&gt;0\)인 등비수열 \(\{b_{n}\}\)에 대하여
\[\sum_{n=1}^{\infty}\left(a_{4n-2}b_{n}\right)=\sum_{n=1}^{\infty}\left(a_{4n-3}b_{2n}\right)=6\]
일 때, \(b_{1}\times b_{3}=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 109,
      help: R`\(a_{n}\)에 \(n=1,2,3,4\)를 대입하면 \(a_{1}=\alpha, a_{2}=-\beta, a_{3}=-\alpha, a_{4}=\beta\)로 4주기를 가집니다. \(\alpha^{2}\beta^{2}=4\)와 \(\alpha&gt;\beta\)에서 가능한 정수 순서쌍 중 급수가 수렴할 조건 \(|r|&lt;1\)을 만족하는 것은 \((\alpha, \beta)=(-1, -2)\)뿐입니다. 등비급수 공식으로 \(b_{1}=5, r=-\frac{2}{3}\)을 구하면 \(b_{1}b_{3}=\frac{100}{9}\)가 나옵니다.`
    },
{
      id: "2026-06-calc-30", exam: "2026-06", no: 30, score: 4,
      units: ["calc-diff"], memo: "시그모이드 합성함수의 미분가능성과 극값",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)에 대하여 함수
\[g(x)=\left|f\left(\frac{2}{1+e^{-x}}\right)\right|\]
가 실수 전체의 집합에서 미분가능하고 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 함수 \(g(x)\)는 \(x=0\)에서 극소이고, \(g(0)&gt;0\)이다.`,
        R`(나) \(g'(\ln 3)&lt;0\), \(\left|g'(-\ln 3)\right|=\dfrac{3}{8}g(-\ln 3)\)`
      ],
            bodyAfter: R`\(g(0)\)의 최솟값을 \(\dfrac{q}{p}\)라 할 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 25,
      help: R`\(u(x)=\frac{2}{1+e^{-x}}\)는 \((0, 2)\)로 치역을 갖는 단조증가함수이고 \(u(0)=1\)입니다. \(g(0)&gt;0\)과 미분가능성으로부터 절댓값 안의 \(f(u)\)의 부호가 일정해야 하며, 극소 조건과 도함수 부호 조건으로부터 삼차함수 \(f(u)\)의 개형을 확정합니다. \(u(-\ln 3)=\frac{1}{2}, u(\ln 3)=\frac{3}{2}\)에서의 관계식을 연립하여 \(g(0)\)의 최솟값을 계산합니다.`
    },
{
      id: "2026-06-geom-28", exam: "2026-06", no: 28, score: 4,
      units: ["geom-curve"], memo: "두 타원의 정의와 중점 조건 연계",
      body: R`그림과 같이 두 점 \(\mathrm{F}(c, 0)\), \(\mathrm{F}'(-c, 0)\) (\(c > 0\))을 초점으로 하는 타원 \(C_1: \dfrac{x^2}{a^2}+y^2=1\)과 두 점 \(\mathrm{G}(0, d)\), \(\mathrm{G}'(0, -d)\) (\(d > 1\))을 초점으로 하고 타원 \(C_1\)의 두 꼭짓점을 지나는 타원 \(C_2\)가 있다. 직선 \(\mathrm{FG}\)가 타원 \(C_1\)과 제\(1\)사분면에서 만나는 점을 \(\mathrm{P}\)라 하고, 직선 \(\mathrm{F}'\mathrm{P}\)가 타원 \(C_2\)와 제\(1\)사분면에서 만나는 점을 \(\mathrm{Q}\)라 하자. \(\overline{\mathrm{GP}}=\overline{\mathrm{PF}}\)이고 \(\overline{\mathrm{GP}}+\overline{\mathrm{PF}'}=2\sqrt{2}\)일 때, \(\overline{\mathrm{QG}}+\overline{\mathrm{QG}'}\)의 값은? (단, \(a\)는 양수이다.)`,
      figure: "2026-06-geom-28.webp",
      choices: [R`\(\sqrt{19}\)`, R`\(2\sqrt{5}\)`, R`\(\sqrt{21}\)`, R`\(\sqrt{22}\)`, R`\(\sqrt{23}\)`],
      answer: 4,
      help: R`\(\overline{\mathrm{GP}}=\overline{\mathrm{PF}}\)이므로 \(\overline{\mathrm{PF}}+\overline{\mathrm{PF}'}=\overline{\mathrm{GP}}+\overline{\mathrm{PF}'}=2\sqrt{2}\)가 되어 타원 \(C_1\)의 장축의 길이는 \(2a=2\sqrt{2}\)이다. 타원 \(C_2\)의 두 꼭짓점이 \(C_1\)의 꼭짓점과 공유되는 기하학적 성질과 타원 \(C_2\)의 장축 길이를 구하여 \(\overline{\mathrm{QG}}+\overline{\mathrm{QG}'}\)를 구한다.`
    },
{
      id: "2026-06-geom-29", exam: "2026-06", no: 29, score: 4,
      units: ["geom-curve"], memo: "쌍곡선의 정의와 중점 연결 정리, 평행선 사이 삼각형 넓이",
      body: R`그림과 같이 두 점 \(\mathrm{F}(c, 0)\), \(\mathrm{F}'(-c, 0)\) (\(c > 0\))을 초점으로 하는 쌍곡선이 있다. 이 쌍곡선 위의 점 중 제\(1\)사분면에 있는 점 \(\mathrm{P}\)에 대하여 선분 \(\mathrm{F}'\mathrm{P}\)가 \(y\)축과 만나는 점을 \(\mathrm{Q}\)라 하고, 원점 \(\mathrm{O}\)를 지나고 선분 \(\mathrm{F}'\mathrm{P}\)와 평행한 직선이 이 쌍곡선과 만나는 점 중 제\(1\)사분면에 있는 점을 \(\mathrm{R}\)이라 하자. \(\overline{\mathrm{F}'\mathrm{Q}}=\overline{\mathrm{QP}}\), \(\overline{\mathrm{OQ}}=2\)이고 삼각형 \(\mathrm{PQR}\)의 넓이가 \(3\)일 때, 이 쌍곡선의 주축의 길이는 \(p+q\sqrt{13}\)이다. \(p^2+q^2\)의 값을 구하시오. (단, \(p\)와 \(q\)는 유리수이다.)`,
      figure: "2026-06-geom-29.webp",
      short: true,
      answer: 20,
      help: R`\(\overline{\mathrm{F}'\mathrm{Q}}=\overline{\mathrm{QP}}\)에서 \(\triangle \mathrm{F}'\mathrm{FP}\)의 중점 연결 정리에 의해 \(\overline{\mathrm{PF}}=2\overline{\mathrm{OQ}}=4\)이다. 직선 \(\mathrm{OR}\)과 \(\mathrm{F}'\mathrm{P}\)의 평행 조건 및 높이를 통해 삼각형의 넓이로부터 각 선분의 길이를 계산하고, 쌍곡선 정의 \(\overline{\mathrm{PF}'}-\overline{\mathrm{PF}}=2a\)를 적용한다.`
    },
{
      id: "2026-06-geom-30", exam: "2026-06", no: 30, score: 4,
      units: ["geom-vector"], memo: "평면벡터 내적과 영역 위의 동점",
      body: R`좌표평면에 \(\overline{\mathrm{AB}}=6\), \(\overline{\mathrm{AD}}=8\)인 직사각형 \(\mathrm{ABCD}\)와
\[2\vec{\mathrm{BE}}=3\vec{\mathrm{BC}}-\vec{\mathrm{BA}}\]
를 만족시키는 점 \(\mathrm{E}\)가 있다. 선분 \(\mathrm{BC}\) 위를 움직이는 점 \(\mathrm{P}\)에 대하여 점 \(\mathrm{Q}\)가
\[\vec{\mathrm{PQ}}\cdot(\vec{\mathrm{PQ}}-\vec{\mathrm{AB}})=0\]
을 만족시킬 때, \(\vec{\mathrm{AE}}\cdot\vec{\mathrm{AQ}}\)의 최솟값을 구하시오.`,
      figure: "2026-06-geom-30.webp",
      short: true,
      answer: 36,
      help: R`\(\vec{\mathrm{PQ}}\cdot(\vec{\mathrm{PQ}}-\vec{\mathrm{AB}})=0\)은 점 \(\mathrm{Q}\)가 선분 \(\mathrm{P}\)와 \(\mathrm{P}+\vec{\mathrm{AB}}\)를 지름의 양 끝점으로 하는 원 위에 있음을 의미한다. 점 \(\mathrm{P}\)가 선분 \(\mathrm{BC}\)를 움직일 때 점 \(\mathrm{Q}\)가 그리는 영역(원들의 합집합)을 파악하고, 고정된 벡터 \(\vec{\mathrm{AE}}\)와의 내적이 최소가 되는 점 \(\mathrm{Q}\)의 위치를 찾는다.`
    }
  ];
})();
