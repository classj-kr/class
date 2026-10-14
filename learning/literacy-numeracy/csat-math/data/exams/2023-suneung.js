(function () {
  "use strict";
  const R = String.raw;
  // 2023-suneung 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2023-suneung"] = [
{
      id: "2023-suneung-9", exam: "2023-suneung", no: 9, score: 4,
      units: ["m1-trig"], memo: "감소하는 탄젠트 함수의 양 끝값",
      body: R`함수
        \[f(x)=a-\sqrt{3}\tan 2x\]
        가 닫힌구간 \(\left[-\dfrac{\pi}{6},\,b\right]\)에서 최댓값 \(7\), 최솟값 \(3\)을 가질 때,
        \(a\times b\)의 값은? (단, \(a\), \(b\)는 상수이다.)`,
      choices: [R`\(\dfrac{\pi}{2}\)`, R`\(\dfrac{5\pi}{12}\)`, R`\(\dfrac{\pi}{3}\)`, R`\(\dfrac{\pi}{4}\)`, R`\(\dfrac{\pi}{6}\)`],
      answer: 3,
      help: R`\(\tan 2x\)는 증가하므로 \(-\sqrt{3}\tan 2x\)는 감소한다. 곧 최댓값은 왼쪽 끝 \(x=-\frac{\pi}{6}\)에서, 최솟값은 오른쪽 끝 \(x=b\)에서 나온다. 양 끝만 보면 된다.`
    },
{
      id: "2023-suneung-10", exam: "2023-suneung", no: 10, score: 4,
      units: ["m2-integ"], memo: "위아래가 바뀐 두 넓이가 같을 조건",
      body: R`두 곡선 \(y=x^{3}+x^{2}\), \(y=-x^{2}+k\)와 \(y\)축으로 둘러싸인
        부분의 넓이를 \(A\), 두 곡선 \(y=x^{3}+x^{2}\), \(y=-x^{2}+k\)와
        직선 \(x=2\)로 둘러싸인 부분의 넓이를 \(B\)라 하자.
        \(A=B\)일 때, 상수 \(k\)의 값은? (단, \(4&lt;k&lt;5\))`,
      figure: "2023-suneung-10.webp",
      choices: [R`\(\dfrac{25}{6}\)`, R`\(\dfrac{13}{3}\)`, R`\(\dfrac{9}{2}\)`, R`\(\dfrac{14}{3}\)`, R`\(\dfrac{29}{6}\)`],
      answer: 4,
      help: R`\(A\)와 \(B\)는 두 곡선의 위아래가 서로 바뀐 두 조각이다. 그래서 \(A=B\)는 부호를 붙여 묶으면 \(\displaystyle\int_{0}^{2}\bigl\{(x^{3}+x^{2})-(-x^{2}+k)\bigr\}dx=0\) 한 줄이 되고, 교점을 구할 필요가 없다.`
    },
{
      id: "2023-suneung-11", exam: "2023-suneung", no: 11, score: 4,
      units: ["m1-trig"], memo: "같은 각이 마주 보는 두 현",
      body: R`그림과 같이 사각형 \(\mathrm{ABCD}\)가 한 원에 내접하고
        \[\overline{\mathrm{AB}}=5,\quad \overline{\mathrm{AC}}=3\sqrt{5},\quad \overline{\mathrm{AD}}=7,\quad \angle\mathrm{BAC}=\angle\mathrm{CAD}\]
        일 때, 이 원의 반지름의 길이는?`,
      figure: "2023-suneung-11.webp",
      choices: [R`\(\dfrac{5\sqrt{2}}{2}\)`, R`\(\dfrac{8\sqrt{5}}{5}\)`, R`\(\dfrac{5\sqrt{5}}{3}\)`, R`\(\dfrac{8\sqrt{2}}{3}\)`, R`\(\dfrac{9\sqrt{3}}{4}\)`],
      answer: 1,
      help: R`\(\angle\mathrm{BAC}=\angle\mathrm{CAD}\)이므로 두 각이 마주 보는 현이 같아 \(\overline{\mathrm{BC}}=\overline{\mathrm{CD}}\)다. 이 하나로 삼각형 \(\mathrm{ABC}\)와 \(\mathrm{ACD}\)에 각각 코사인법칙을 써서 만든 두 식이 같아지고, 거기서 \(\cos(\angle\mathrm{BAC})\)가 정해진다.`
    },
{
      id: "2023-suneung-12", exam: "2023-suneung", no: 12, score: 4,
      units: ["m2-integ"], memo: "구간마다 되풀이되는 절댓값 함수",
      body: R`실수 전체의 집합에서 연속인 함수 \(f(x)\)가 다음 조건을
        만족시킨다.`,
      note: [
        R`\(n-1\le x&lt;n\)일 때, \(\bigl|f(x)\bigr|=\bigl|6(x-n+1)(x-n)\bigr|\)이다. (단, \(n\)은 자연수이다.)`
      ],
      bodyAfter: R`열린구간 \((0,\,4)\)에서 정의된 함수
        \[g(x)=\int_{0}^{x}f(t)\,dt-\int_{x}^{4}f(t)\,dt\]
        가 \(x=2\)에서 최솟값 \(0\)을 가질 때, \(\displaystyle\int_{\frac{1}{2}}^{4}f(x)\,dx\)의 값은?`,
      choices: [R`\(-\dfrac{3}{2}\)`, R`\(-\dfrac{1}{2}\)`, R`\(\dfrac{1}{2}\)`, R`\(\dfrac{3}{2}\)`, R`\(\dfrac{5}{2}\)`],
      answer: 2,
      help: R`\(g'(x)=f(x)-\bigl(-f(x)\bigr)=2f(x)\)다. \(g\)가 \(x=2\)에서 최소이니 \(f(2)=0\)이고, 그 최솟값이 \(0\)이라는 것은 \(\int_{0}^{2}f=\int_{2}^{4}f\)라는 뜻이다. 그리고 \(|f|\)가 길이 \(1\)인 구간마다 같은 모양을 되풀이하므로 각 구간의 적분은 크기가 같고 부호만 갈린다.`
    },
{
      id: "2023-suneung-13", exam: "2023-suneung", no: 13, score: 4,
      units: ["m1-explog"], memo: "거듭제곱근이 정수가 될 조건",
      body: R`자연수 \(m\,(m\ge 2)\)에 대하여 \(m^{12}\)의 \(n\)제곱근 중에서 정수가
        존재하도록 하는 \(2\) 이상의 자연수 \(n\)의 개수를 \(f(m)\)이라 할 때,
        \(\displaystyle\sum_{m=2}^{9}f(m)\)의 값은?`,
      choices: [R`\(37\)`, R`\(42\)`, R`\(47\)`, R`\(52\)`, R`\(57\)`],
      answer: 3,
      help: R`\(m\)을 소인수분해해서 \(m=p^{e}\cdots\) 꼴로 보면 \(m^{12}\)의 지수는 \(12e\)가 된다. \(n\)제곱근이 정수이려면 그 지수가 \(n\)으로 나누어떨어져야 하므로, \(m\)이 어떤 수의 거듭제곱이면(예: \(4=2^{2}\), \(8=2^{3}\)) \(n\)의 후보가 늘어난다.`
    },
{
      id: "2023-suneung-14", exam: "2023-suneung", no: 14, score: 4,
      units: ["m2-limit"], memo: "두 자리의 오른쪽 극한을 곱한 함수",
      body: R`다항함수 \(f(x)\)에 대하여 함수 \(g(x)\)를 다음과 같이 정의한다.
        \[g(x)=\begin{cases}x &amp; (x&lt;-1 \text{ 또는 } x>1)\\ f(x) &amp; (-1\le x\le 1)\end{cases}\]
        함수 \(h(x)=\displaystyle\lim_{t\to 0+}g(x+t)\times\lim_{t\to 2+}g(x+t)\)에 대하여
        &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(h(1)=3\)`,
        R`ㄴ. 함수 \(h(x)\)는 실수 전체의 집합에서 연속이다.`,
        R`ㄷ. 함수 \(g(x)\)가 닫힌구간 \([-1,\,1]\)에서 감소하고 \(g(-1)=-2\)이면 함수 \(h(x)\)는 실수 전체의 집합에서 최솟값을 갖는다.`
      ],
      choices: [R`ㄱ`, R`ㄴ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`],
      answer: 1,
      help: R`\(\lim_{t\to 0+}g(x+t)\)는 \(x\)에서의 오른쪽 극한이고, \(\lim_{t\to 2+}g(x+t)\)는 \(x+2\)에서의 오른쪽 극한이다. 곧 \(h(x)\)는 서로 \(2\)만큼 떨어진 두 자리의 오른쪽 극한을 곱한 것이다. \(g\)가 끊길 수 있는 자리는 \(x=\pm 1\)뿐이므로, 그 두 자리와 거기서 \(2\)만큼 떨어진 자리만 살피면 된다.`
    },
{
      id: "2023-suneung-15", exam: "2023-suneung", no: 15, score: 4,
      units: ["m1-seq"], memo: "3의 배수인지로 갈리는 점화식",
      body: R`모든 항이 자연수이고 다음 조건을 만족시키는 모든 수열
        \(\{a_{n}\}\)에 대하여 \(a_{9}\)의 최댓값과 최솟값을 각각 \(M\), \(m\)이라 할 때,
        \(M+m\)의 값은?`,
      note: [
        R`(가) \(a_{7}=40\)`,
        R`(나) 모든 자연수 \(n\)에 대하여 \(a_{n+2}=\begin{cases}a_{n+1}+a_{n} &amp; \left(a_{n+1}\text{이 }3\text{의 배수가 아닌 경우}\right)\\[4pt] \dfrac{1}{3}a_{n+1} &amp; \left(a_{n+1}\text{이 }3\text{의 배수인 경우}\right)\end{cases}\)이다.`
      ],
      choices: [R`\(216\)`, R`\(218\)`, R`\(220\)`, R`\(222\)`, R`\(224\)`],
      answer: 5,
      help: R`\(a_{7}=40\)에서 앞으로 두 걸음만 더 가면 \(a_{9}\)다. 곧 \(a_{8}\)이 무엇이냐에 따라 갈리고, \(a_{8}\)은 \(a_{7}=40\)이 \(3\)의 배수가 아니므로 \(a_{8}=a_{7}+a_{6}\)에서 나온다. 뒤가 아니라 앞쪽 항을 거꾸로 좁히는 문제다.`
    },
{
      id: "2023-suneung-20", exam: "2023-suneung", no: 20, score: 4,
      units: ["m2-integ"], memo: "속도와 가속도가 구간마다 다르게 주어짐",
      body: R`수직선 위를 움직이는 점 \(\mathrm{P}\)의 시각 \(t\,(t\ge 0)\)에서의
        속도 \(v(t)\)와 가속도 \(a(t)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(0\le t\le 2\)일 때, \(v(t)=2t^{3}-8t\)이다.`,
        R`(나) \(t\ge 2\)일 때, \(a(t)=6t+4\)이다.`
      ],
      bodyAfter: R`시각 \(t=0\)에서 \(t=3\)까지 점 \(\mathrm{P}\)가 움직인 거리를 구하시오.`,
      short: true,
      answer: 17,
      help: R`\(t\ge 2\)에서는 가속도만 주어졌으니 적분해 속도를 얻어야 하고, 그 적분상수는 \(t=2\)에서 앞 구간의 속도와 이어 붙여 정한다. 움직인 거리이므로 \(v=0\)이 되는 자리에서 구간을 끊어 절댓값을 더한다.`
    },
{
      id: "2023-suneung-21", exam: "2023-suneung", no: 21, score: 4,
      units: ["m1-explog"], memo: "절댓값으로 꺾인 지수·로그 그래프",
      body: R`자연수 \(n\)에 대하여 함수 \(f(x)\)를
        \[f(x)=\begin{cases}\left|3^{\,x+2}-n\right| &amp; (x&lt;0)\\ \left|\log_{2}(x+4)-n\right| &amp; (x\ge 0)\end{cases}\]
        이라 하자. 실수 \(t\)에 대하여 \(x\)에 대한 방정식 \(f(x)=t\)의 서로
        다른 실근의 개수를 \(g(t)\)라 할 때, 함수 \(g(t)\)의 최댓값이 \(4\)가
        되도록 하는 모든 자연수 \(n\)의 값의 합을 구하시오.`,
      short: true,
      answer: 33,
      help: R`절댓값 안이 \(0\)이 되는 자리에서 그래프가 \(V\) 모양으로 꺾인다. 가로선 \(y=t\)가 만나는 점의 개수는 그 꺾인 자리가 두 조각 각각에 있는지, 그리고 \(x=0\) 좌우에서 값이 어떻게 이어지는지로 정해진다. \(n\)이 커지면 꺾이는 자리가 어느 쪽으로 밀려나는지를 보면 된다.`
    },
{
      id: "2023-suneung-22", exam: "2023-suneung", no: 22, score: 4,
      units: ["m2-diff"], memo: "평균변화율이 도함수 값과 같아지는 식",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)와 실수 전체의
        집합에서 연속인 함수 \(g(x)\)가 다음 조건을 만족시킬 때,
        \(f(4)\)의 값을 구하시오.`,
      note: [
        R`(가) 모든 실수 \(x\)에 대하여 \(f(x)=f(1)+(x-1)f'\bigl(g(x)\bigr)\)이다.`,
        R`(나) 함수 \(g(x)\)의 최솟값은 \(\dfrac{5}{2}\)이다.`,
        R`(다) \(f(0)=-3\), \(f\bigl(g(1)\bigr)=6\)`
      ],
      short: true,
      answer: 13,
      help: R`(가)를 옮기면 \(x\ne 1\)일 때 \(\dfrac{f(x)-f(1)}{x-1}=f'\bigl(g(x)\bigr)\)다. 곧 왼쪽은 \(x\)와 \(1\) 사이의 평균변화율이고, 오른쪽은 어느 한 점에서의 순간변화율이다. 평균값 정리가 말하는 그 점이 바로 \(g(x)\)라는 뜻이다.`
    },
{
      id: "2023-suneung-prob-28", exam: "2023-suneung", no: 28, score: 4,
      units: ["prob-stat"], memo: "연속확률변수의 확률밀도함수 그래프와 미지수 결정",
      body: R`연속확률변수 \(X\)가 갖는 값의 범위는 \(0\le X\le a\)이고, \(X\)의 확률밀도함수의 그래프가 그림과 같다.
\(\mathrm{P}(X\le b) - \mathrm{P}(X\ge b) = \dfrac{1}{4}\), \(\mathrm{P}(X\le \sqrt{5}) = \dfrac{1}{2}\)일 때, \(a+b+c\)의 값은? (단, \(a, b, c\)는 상수이다.)`,
      figure: "2023-suneung-prob-28.webp",
      choices: [R`\(\dfrac{11}{2}\)`, R`\(6\)`, R`\(\dfrac{13}{2}\)`, R`\(7\)`, R`\(\dfrac{15}{2}\)`],
      answer: 4,
      help: R`전체 넓이가 1이므로 삼각형 넓이 공식에서 \(\dfrac{1}{2}ac = 1\)이다. \(\mathrm{P}(X\le b) + \mathrm{P}(X\ge b) = 1\)과 연립하면 \(\mathrm{P}(X\le b) = \dfrac{5}{8}\)이다. 중앙값 \(\sqrt{5}\)의 위치와 넓이 비를 이용하여 \(a, b, c\)를 차례로 결정하면 \(a=4, b=2.5, c=0.5\) 등을 얻어 합이 7이 된다.`
    },
{
      id: "2023-suneung-prob-29", exam: "2023-suneung", no: 29, score: 4,
      units: ["prob-prob"], memo: "카드 뒤집기 시행과 조건부확률",
      body: R`앞면에는 \(1\)부터 \(6\)까지의 자연수가 하나씩 적혀 있고 뒷면에는 모두 \(0\)이 하나씩 적혀 있는 \(6\)장의 카드가 있다. 이 \(6\)장의 카드가 그림과 같이 \(6\) 이하의 자연수 \(k\)에 대하여 \(k\)번째 자리에 자연수 \(k\)가 보이도록 놓여 있다. 이 \(6\)장의 카드와 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(k\)이면 \(k\)번째 자리에 놓여 있는 카드를 한 번 뒤집어 제자리에 놓는다.
위의 시행을 \(3\)번 반복한 후 \(6\)장의 카드에 보이는 모든 수의 합이 짝수일 때, 주사위의 \(1\)의 눈이 한 번만 나왔을 확률은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2023-suneung-prob-29.webp",
      short: true,
      answer: 49,
      help: R`처음 상태의 모든 수의 합은 \(21\)(홀수)이다. 3회 시행 후 합이 짝수가 되려면 홀수 카드(\(\{1, 3, 5\}\))가 뒤집힌 총 횟수가 홀수(1회 또는 3회)여야 한다. 합이 짝수가 되는 전체 경우의 수와 그중 1의 눈이 정확히 1번 나오는 경우의 수를 분류하여 확률 \(\dfrac{13}{36}\)을 구한다.`
    },
{
      id: "2023-suneung-prob-30", exam: "2023-suneung", no: 30, score: 4,
      units: ["prob-count"], memo: "경계 조건과 대소 관계를 만족시키는 함수의 개수 (중복조합)",
      body: R`집합 \(X=\{x\mid x\text{는 } 10 \text{ 이하의 자연수}\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수를 구하시오.`,
      noteTitle: "조 건",
      note: [
        R`(가) \(9\) 이하의 모든 자연수 \(x\)에 대하여 \(f(x)\le f(x+1)\)이다.`,
        R`(나) \(1\le x\le 5\)일 때 \(f(x)\le x\)이고, \(6\le x\le 10\)일 때 \(f(x)\ge x\)이다.`,
        R`(다) \(f(6)=f(5)+6\)`
      ],
      short: true,
      answer: 100,
      help: R`조건 (나)에서 \(f(5)\le 5\), \(f(6)\ge 6\)이고 조건 (다)에서 \(f(6)=f(5)+6\)이므로 \(f(5)\)의 값으로 가능한 것은 \(1, 2, 3, 4\)뿐이다(이에 따라 \(f(6)=7, 8, 9, 10\)). 각 \(f(5)\)의 값에 대해 \(f(1)\dots f(4)\)의 개수와 \(f(7)\dots f(10)\)의 개수가 독립적으로 대칭 구조를 이루므로 각각 곱하여 합산하면 100이 나온다.`
    },
{
      id: "2023-suneung-calc-28", exam: "2023-suneung", no: 28, score: 4,
      units: ["calc-diff"], memo: "삼각함수의 극한과 사다리꼴의 넓이",
      body: R`그림과 같이 중심이 \(\mathrm{O}\)이고 길이가 \(2\)인 선분 \(\mathrm{AB}\)를 지름으로 하는 반원 위에 \(\angle\mathrm{AOC}=\dfrac{\pi}{2}\)인 점 \(\mathrm{C}\)가 있다.
호 \(\mathrm{BC}\) 위에 점 \(\mathrm{P}\)와 호 \(\mathrm{CA}\) 위에 점 \(\mathrm{Q}\)를 \(\overline{\mathrm{PB}}=\overline{\mathrm{QC}}\)가 되도록 잡고, 선분 \(\mathrm{AP}\) 위에 점 \(\mathrm{R}\)를 \(\angle\mathrm{CQR}=\dfrac{\pi}{2}\)가 되도록 잡는다.
선분 \(\mathrm{AP}\)와 선분 \(\mathrm{CO}\)의 교점을 \(\mathrm{S}\)라 하자. \(\angle\mathrm{PAB}=\theta\)일 때, 삼각형 \(\mathrm{POB}\)의 넓이를 \(f(\theta)\), 사각형 \(\mathrm{CQRS}\)의 넓이를 \(g(\theta)\)라 하자. \(\displaystyle\lim_{\theta \to 0+} \frac{3f(\theta)-2g(\theta)}{\theta^2}\)의 값은? \(\left(\text{단, } 0 &lt; \theta &lt; \dfrac{\pi}{4}\right)\)`,
      figure: "2023-suneung-calc-28.webp",
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 2,
      help: R`\(\overline{\mathrm{PB}}=\overline{\mathrm{QC}}=2\sin\theta\)와 방향각 관계로부터 \(\overline{\mathrm{QC}}\)가 선분 \(\mathrm{AP}\)와 평행함을 파악하여 사각형 \(\mathrm{CQRS}\)를 직각사다리꼴로 해석합니다. \(f(\theta)=\sin\theta\cos\theta\)와 \(g(\theta)=\dfrac{1}{2}(3\sin\theta+\tan\theta\sin\theta)(\cos\theta-\sin\theta)\)의 식을 전개하여 분자의 \(\theta^2\) 최고차 계수 \(2\)를 구합니다.`
    },
{
      id: "2023-suneung-calc-29", exam: "2023-suneung", no: 29, score: 4,
      units: ["calc-integ"], memo: "역함수의 정적분과 지수함수의 극한을 이용한 미정계수 결정",
      body: R`세 상수 \(a\), \(b\), \(c\)에 대하여 함수 \(f(x) = ae^{2x} + be^x + c\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(\displaystyle\lim_{x \to -\infty} \frac{f(x)+6}{e^x} = 1\)`,
        R`(나) \(f(\ln 2) = 0\)`
      ],
            bodyAfter: R`함수 \(f(x)\)의 역함수를 \(g(x)\)라 할 때,
\[\int_{0}^{14} g(x)\,dx = p + q\ln 2\]
이다. \(p+q\)의 값을 구하시오. (단, \(p\), \(q\)는 유리수이고, \(\ln 2\)는 무리수이다.)`,
short: true,
      answer: 26,
      help: R`조건 (가)의 극한 수렴 조건에서 \(c=-6, b=1\)을 얻고 조건 (나)에서 \(a=1\)을 찾아 \(f(x)=e^{2x}+e^x-6\)을 완성합니다. 역함수의 정적분은 직사각형 넓이와 원래 함수의 적분을 이용한 \(\int_0^{14} g(x)dx = 14(2\ln 2) - \int_{\ln 2}^{2\ln 2} f(x)dx\) 공식으로 신속히 계산합니다.`
    },
{
      id: "2023-suneung-calc-30", exam: "2023-suneung", no: 30, score: 4,
      units: ["calc-diff"], memo: "합성함수의 극대 조건과 삼각방정식의 실근 개수",
      body: R`최고차항의 계수가 양수인 삼차함수 \(f(x)\)와 함수 \(g(x) = e^{\sin \pi x} - 1\)에 대하여 실수 전체의 집합에서 정의된 합성함수 \(h(x) = g(f(x))\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 함수 \(h(x)\)는 \(x=0\)에서 극댓값 \(0\)을 갖는다.`,
        R`(나) 열린구간 \((0, 3)\)에서 방정식 \(h(x)=1\)의 서로 다른 실근의 개수는 \(7\)이다.`
      ],
            bodyAfter: R`\(f(3) = \dfrac{1}{2}\), \(f'(3) = 0\)일 때, \(f(2) = \dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 31,
      help: R`\(h(0)=0\)이 극대가 되기 위해 \(f(0)=k\)가 짝수이어야 하고, \(f'(0)=0, f'(3)=0\)에서 \(f(x)\)가 구간 \((0,3)\)에서 \(k\)부터 \(1/2\)까지 단조감소함을 파악합니다. \((1/2, k)\)에서 \(\sin(\pi u)=\ln 2\)의 근이 7개 생기도록 \(k=8\)을 결정한 뒤 삼차함수 식을 완성하여 \(f(2)=\dfrac{22}{9}\)를 구합니다.`
    },
{
      id: "2023-suneung-geom-28", exam: "2023-suneung", no: 28, score: 4,
      units: ["geom-curve"], memo: "쌍곡선의 점근선 평행선과 초점 연결 선분의 길이 비, 주축 길이",
      body: R`두 초점이 \(\mathrm{F}(c, 0), \mathrm{F}'(-c, 0)\) (\(c > 0\))인 쌍곡선 \(C\)와 \(y\)축 위의 점 \(\mathrm{A}\)가 있다. 쌍곡선 \(C\)가 선분 \(\mathrm{AF}\)와 만나는 점을 \(\mathrm{P}\), 선분 \(\mathrm{AF}'\)과 만나는 점을 \(\mathrm{P}'\)이라 하자. 직선 \(\mathrm{AF}\)는 쌍곡선 \(C\)의 한 점근선과 평행하고 \(\overline{\mathrm{AP}}:\overline{\mathrm{PP}'}=5:6, \overline{\mathrm{PF}}=1\)일 때, 쌍곡선 \(C\)의 주축의 길이는?`,
      figure: "2023-suneung-geom-28.webp",
      choices: [R`\(\dfrac{13}{6}\)`, R`\(\dfrac{9}{4}\)`, R`\(\dfrac{7}{3}\)`, R`\(\dfrac{29}{12}\)`, R`\(\dfrac{5}{2}\)`],
      answer: 2,
      help: R`점근선의 기울기를 \(m=\dfrac{b}{a}\)라 할 때, \(\mathrm{A}\)의 좌표와 직선 방정식을 세우고 좌우 대칭성을 이용한다. \(\overline{\mathrm{AP}}:\overline{\mathrm{PP}'}=5:6\)과 쌍곡선의 정의 \(\overline{\mathrm{P}'\mathrm{F}}-\overline{\mathrm{P}'\mathrm{F}'}=2a\)를 닮음 및 코사인법칙과 연립하여 주축의 길이 \(2a\)를 구한다.`
    },
{
      id: "2023-suneung-geom-29", exam: "2023-suneung", no: 29, score: 4,
      units: ["geom-vector"], memo: "등변사다리꼴과 벡터 방정식, 원주각 관계를 통한 내적 계산",
      body: R`평면 \(\alpha\) 위에 \(\overline{\mathrm{AB}}=\overline{\mathrm{CD}}=\overline{\mathrm{AD}}=2\), \(\angle\mathrm{ABC}=\angle\mathrm{BCD}=\dfrac{\pi}{3}\)인 사다리꼴 \(\mathrm{ABCD}\)가 있다. 다음 조건을 만족시키는 평면 \(\alpha\) 위의 두 점 \(\mathrm{P}, \mathrm{Q}\)에 대하여 \(\vec{\mathrm{CP}}\cdot\vec{\mathrm{DQ}}\)의 값을 구하시오.`,
      figure: "2023-suneung-geom-29.webp",
      note: [
        R`(가) \(\vec{\mathrm{AC}}=2(\vec{\mathrm{AD}}+\vec{\mathrm{BP}})\)`,
        R`(나) \(\vec{\mathrm{AC}}\cdot\vec{\mathrm{PQ}}=6\)`,
        R`(다) \(2\times\angle\mathrm{BQA}=\angle\mathrm{PBQ} &lt; \dfrac{\pi}{2}\)`
      ],
      short: true,
      answer: 12,
      help: R`사다리꼴 \(\mathrm{ABCD}\)의 좌표를 설정하고 조건 (가)를 정리하여 점 \(\mathrm{P}\)의 위치를 확정한다. 조건 (나)와 (다)에서 점 \(\mathrm{Q}\)는 원주각 성질에 의해 특정 원 위의 점이 되며, 내적 방정식으로 점 \(\mathrm{Q}\)의 좌표를 구해 \(\vec{\mathrm{CP}}\cdot\vec{\mathrm{DQ}}\)를 계산한다.`
    },
{
      id: "2023-suneung-geom-30", exam: "2023-suneung", no: 30, score: 4,
      units: ["geom-space"], memo: "정사면체와 구의 교점, 접평면 위로의 정사영 넓이",
      body: R`좌표공간에 정사면체 \(\mathrm{ABCD}\)가 있다. 정삼각형 \(\mathrm{BCD}\)의 외심을 중심으로 하고 점 \(\mathrm{B}\)를 지나는 구를 \(S\)라 하자. 구 \(S\)와 선분 \(\mathrm{AB}\)가 만나는 점 중 \(\mathrm{B}\)가 아닌 점을 \(\mathrm{P}\), 구 \(S\)와 선분 \(\mathrm{AC}\)가 만나는 점 중 \(\mathrm{C}\)가 아닌 점을 \(\mathrm{Q}\), 구 \(S\)와 선분 \(\mathrm{AD}\)가 만나는 점 중 \(\mathrm{D}\)가 아닌 점을 \(\mathrm{R}\)라 하고, 점 \(\mathrm{P}\)에서 구 \(S\)에 접하는 평면을 \(\alpha\)라 하자. 구 \(S\)의 반지름의 길이가 \(6\)일 때, 삼각형 \(\mathrm{PQR}\)의 평면 \(\alpha\) 위로의 정사영의 넓이는 \(k\)이다. \(k^2\)의 값을 구하시오.`,
      figure: "2023-suneung-geom-30.webp",
      short: true,
      answer: 24,
      help: R`정사면체의 대칭성에 의해 \(\triangle \mathrm{PQR}\)은 \(\triangle \mathrm{BCD}\)와 평행한 정삼각형이다. 구의 반지름 \(R=6\)과 정사면체 높이·모서리 길이를 구하고, 구의 중심 \(\mathrm{O}\)와 \(\mathrm{P}\)를 잇는 법선벡터 \(\vec{\mathrm{OP}}\)를 구하여 접평면 \(\alpha\)와 \(\triangle \mathrm{PQR}\)이 이루는 각의 코사인을 곱해 정사영 넓이 \(k\)를 구한다.`
    }
  ];
})();
