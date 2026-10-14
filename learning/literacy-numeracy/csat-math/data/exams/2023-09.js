(function () {
  "use strict";
  const R = String.raw;
  // 2023-09 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2023-09"] = [
{
      id: "2023-09-9", exam: "2023-09", no: 9, score: 4,
      units: ["m1-trig"], memo: "같은 주기를 가진 두 코사인 곡선",
      body: R`닫힌구간 \([0,\,12]\)에서 정의된 두 함수
        \[f(x)=\cos\frac{\pi x}{6},\qquad g(x)=-3\cos\frac{\pi x}{6}-1\]
        이 있다. 곡선 \(y=f(x)\)와 직선 \(y=k\)가 만나는 두 점의
        \(x\)좌표를 \(\alpha_{1}\), \(\alpha_{2}\)라 할 때, \(\bigl|\alpha_{1}-\alpha_{2}\bigr|=8\)이다. 곡선 \(y=g(x)\)와
        직선 \(y=k\)가 만나는 두 점의 \(x\)좌표를 \(\beta_{1}\), \(\beta_{2}\)라 할 때,
        \(\bigl|\beta_{1}-\beta_{2}\bigr|\)의 값은? (단, \(k\)는 \(-1&lt;k&lt;1\)인 상수이다.)`,
      choices: [R`\(3\)`, R`\(\dfrac{7}{2}\)`, R`\(4\)`, R`\(\dfrac{9}{2}\)`, R`\(5\)`],
      answer: 3,
      help: R`두 함수는 주기가 \(12\)로 같고 \([0,\,12]\)에서 \(x=6\)에 대하여 대칭이다. 그래서 가로선이 만나는 두 점은 \(6\)을 가운데 두고 같은 거리만큼 떨어져 있고, \(\bigl|\alpha_{1}-\alpha_{2}\bigr|=8\)에서 \(k\)가 곧바로 정해진다.`
    },
{
      id: "2023-09-10", exam: "2023-09", no: 10, score: 4,
      units: ["m2-integ"], memo: "고정된 점과의 거리",
      body: R`수직선 위의 점 \(\mathrm{A}(6)\)과 시각 \(t=0\)일 때 원점을 출발하여
        이 수직선 위를 움직이는 점 \(\mathrm{P}\)가 있다. 시각 \(t\,(t\ge 0)\)에서의
        점 \(\mathrm{P}\)의 속도 \(v(t)\)를
        \[v(t)=3t^{2}+at\quad(a>0)\]
        이라 하자. 시각 \(t=2\)에서 점 \(\mathrm{P}\)와 점 \(\mathrm{A}\) 사이의 거리가 \(10\)일 때,
        상수 \(a\)의 값은?`,
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 4,
      help: R`\(\mathrm{P}\)는 원점에서 출발했으므로 시각 \(2\)에서의 위치가 \(\int_{0}^{2}v\,dt=8+2a\)이고, \(\mathrm{A}\)는 고정된 \(6\)이다. 거리는 그 차의 절댓값이라 \(|2+2a|=10\)이 된다.`
    },
{
      id: "2023-09-11", exam: "2023-09", no: 11, score: 4,
      units: ["m1-explog"], memo: "실수인 네제곱근 두 개의 곱",
      body: R`함수 \(f(x)=-(x-2)^{2}+k\)에 대하여 다음 조건을 만족시키는
        자연수 \(n\)의 개수가 \(2\)일 때, 상수 \(k\)의 값은?`,
      note: [
        R`\(\sqrt{3}^{\,f(n)}\)의 네제곱근 중 실수인 것을 모두 곱한 값이 \(-9\)이다.`
      ],
      choices: [R`\(8\)`, R`\(9\)`, R`\(10\)`, R`\(11\)`, R`\(12\)`],
      answer: 2,
      help: R`\(A=\sqrt{3}^{\,f(n)}\)은 언제나 양수이므로 네제곱근 중 실수인 것은 \(\pm A^{\frac{1}{4}}\) 둘뿐이고, 그 곱은 \(-\sqrt{A}\)다. 곧 \(-3^{\frac{f(n)}{4}}=-9\)에서 \(f(n)\)의 값이 하나로 정해진다.`
    },
{
      id: "2023-09-12", exam: "2023-09", no: 12, score: 4,
      units: ["m2-limit"], memo: "포물선과 직선의 두 교점",
      body: R`실수 \(t\,(t>0)\)에 대하여 직선 \(y=x+t\)와 곡선 \(y=x^{2}\)이
        만나는 두 점을 \(\mathrm{A}\), \(\mathrm{B}\)라 하자. 점 \(\mathrm{A}\)를 지나고 \(x\)축에 평행한
        직선이 곡선 \(y=x^{2}\)과 만나는 점 중 \(\mathrm{A}\)가 아닌 점을 \(\mathrm{C}\),
        점 \(\mathrm{B}\)에서 선분 \(\mathrm{AC}\)에 내린 수선의 발을 \(\mathrm{H}\)라 하자.
        \(\displaystyle\lim_{t\to 0+}\frac{\overline{\mathrm{AH}}-\overline{\mathrm{CH}}}{t}\)의 값은? (단, 점 \(\mathrm{A}\)의 \(x\)좌표는 양수이다.)`,
      figure: "2023-09-12.webp",
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 2,
      help: R`\(\mathrm{A}\), \(\mathrm{B}\)의 \(x\)좌표는 \(x^{2}=x+t\)의 두 근이므로 근과 계수의 관계로 합과 곱을 바로 쓸 수 있다. 그리고 \(\mathrm{C}\)는 \(\mathrm{A}\)와 \(y\)좌표가 같은 포물선 위의 다른 점이라 \(x\)좌표가 \(\mathrm{A}\)의 것의 부호를 바꾼 값이다. \(\mathrm{H}\)는 \(\mathrm{B}\)와 \(x\)좌표가 같다.`
    },
{
      id: "2023-09-13", exam: "2023-09", no: 13, score: 4,
      units: ["m1-trig"], memo: "지름이 만드는 직각과 이웃한 각",
      body: R`그림과 같이 선분 \(\mathrm{AB}\)를 지름으로 하는 반원의 호 \(\mathrm{AB}\)
        위에 두 점 \(\mathrm{C}\), \(\mathrm{D}\)가 있다. 선분 \(\mathrm{AB}\)의 중점 \(\mathrm{O}\)에 대하여
        두 선분 \(\mathrm{AD}\), \(\mathrm{CO}\)가 점 \(\mathrm{E}\)에서 만나고,
        \[\overline{\mathrm{CE}}=4,\quad \overline{\mathrm{ED}}=3\sqrt{2},\quad \angle\mathrm{CEA}=\frac{3}{4}\pi\]
        이다. \(\overline{\mathrm{AC}}\times\overline{\mathrm{CD}}\)의 값은?`,
      figure: "2023-09-13.webp",
      choices: [R`\(6\sqrt{10}\)`, R`\(10\sqrt{5}\)`, R`\(16\sqrt{2}\)`, R`\(12\sqrt{5}\)`, R`\(20\sqrt{2}\)`],
      answer: 5,
      help: R`\(\overline{\mathrm{AB}}\)가 지름이므로 \(\angle\mathrm{ACB}=\angle\mathrm{ADB}=\frac{\pi}{2}\)다. 그리고 \(\angle\mathrm{CEA}=\frac{3}{4}\pi\)이니 그와 이웃한 \(\angle\mathrm{CED}=\frac{\pi}{4}\)이고, 두 변 \(\overline{\mathrm{CE}}\), \(\overline{\mathrm{ED}}\)와 그 사잇각이 다 있으니 삼각형 \(\mathrm{CED}\)에서 코사인법칙을 바로 쓸 수 있다.`
    },
{
      id: "2023-09-14", exam: "2023-09", no: 14, score: 4,
      units: ["m2-integ"], memo: "구간을 옮겨 가며 적분한 함수",
      body: R`최고차항의 계수가 \(1\)이고 \(f(0)=0\), \(f(1)=0\)인
        삼차함수 \(f(x)\)에 대하여 함수 \(g(t)\)를
        \[g(t)=\int_{t}^{t+1}f(x)\,dx-\int_{0}^{1}\bigl|f(x)\bigr|\,dx\]
        라 할 때, &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(g(0)=0\)이면 \(g(-1)&lt;0\)이다.`,
        R`ㄴ. \(g(-1)>0\)이면 \(f(k)=0\)을 만족시키는 \(k&lt;-1\)인 실수 \(k\)가 존재한다.`,
        R`ㄷ. \(g(-1)>1\)이면 \(g(0)&lt;-1\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 5,
      help: R`뒤쪽 \(\int_{0}^{1}|f|\)는 \(t\)와 무관한 상수라, \(g'(t)=f(t+1)-f(t)\)다. 그리고 \(f(0)=f(1)=0\)이고 최고차항 계수가 \(1\)이므로 \(f(x)=x(x-1)(x-c)\) 꼴이고, 남은 미지수는 \(c\) 하나뿐이다.`
    },
{
      id: "2023-09-15", exam: "2023-09", no: 15, score: 4,
      units: ["m1-seq"], memo: "네 걸음마다 제자리로 오는 수열",
      body: R`수열 \(\{a_{n}\}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 모든 자연수 \(k\)에 대하여 \(a_{4k}=r^{k}\)이다. (단, \(r\)는 \(0&lt;|r|&lt;1\)인 상수이다.)`,
        R`(나) \(a_{1}&lt;0\)이고, 모든 자연수 \(n\)에 대하여 \(a_{n+1}=\begin{cases}a_{n}+3 &amp; \left(|a_{n}|&lt;5\right)\\[4pt] -\dfrac{1}{2}a_{n} &amp; \left(|a_{n}|\ge 5\right)\end{cases}\)이다.`
      ],
      bodyAfter: R`\(|a_{m}|\ge 5\)를 만족시키는 \(100\) 이하의 자연수 \(m\)의 개수를 \(p\)라
        할 때, \(p+a_{1}\)의 값은?`,
      choices: [R`\(8\)`, R`\(10\)`, R`\(12\)`, R`\(14\)`, R`\(16\)`],
      answer: 3,
      help: R`(가)는 \(a_{4}=r\), \(a_{8}=r^{2}\), \(a_{12}=r^{3}\)이라는 뜻이고 \(0&lt;|r|&lt;1\)이라 이 값들의 크기가 \(1\)보다 작다. 그런데 (나)의 규칙은 \(|a_{n}|&lt;5\)일 때 \(+3\)씩 키우기만 하므로, 네 걸음 만에 다시 작은 값으로 돌아오려면 그 사이에 \(|a_{n}|\ge 5\)를 만나 반으로 줄어드는 일이 있어야 한다.`
    },
{
      id: "2023-09-20", exam: "2023-09", no: 20, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "V자 그래프와 삼차곡선이 두 점에서 만남",
      body: R`상수 \(k\,(k&lt;0)\)에 대하여 두 함수
        \[f(x)=x^{3}+x^{2}-x,\qquad g(x)=4|x|+k\]
        의 그래프가 만나는 점의 개수가 \(2\)일 때,
        두 함수의 그래프로 둘러싸인 부분의 넓이를 \(S\)라 하자.
        \(30\times S\)의 값을 구하시오.`,
      short: true,
      answer: 80,
      help: R`\(g\)는 \(x=0\)에서 꺾이는 \(V\) 모양이다. 오른쪽에서는 \(f(x)=4x+k\), 왼쪽에서는 \(f(x)=-4x+k\)를 푸는 셈인데, 삼차곡선과 직선이라 각각 최대 세 번 만날 수 있다. 만나는 점이 둘뿐이려면 한쪽에서 접해야 한다.`
    },
{
      id: "2023-09-21", exam: "2023-09", no: 21, score: 4,
      units: ["m1-explog"], memo: "기울기가 같은 두 직선 위의 길이 비",
      body: R`그림과 같이 곡선 \(y=2^{x}\) 위에 두 점 \(\mathrm{P}\bigl(a,\,2^{a}\bigr)\), \(\mathrm{Q}\bigl(b,\,2^{b}\bigr)\)이
        있다. 직선 \(\mathrm{PQ}\)의 기울기를 \(m\)이라 할 때, 점 \(\mathrm{P}\)를 지나며
        기울기가 \(-m\)인 직선이 \(x\)축, \(y\)축과 만나는 점을 각각
        \(\mathrm{A}\), \(\mathrm{B}\)라 하고, 점 \(\mathrm{Q}\)를 지나며 기울기가 \(-m\)인 직선이
        \(x\)축과 만나는 점을 \(\mathrm{C}\)라 하자.
        \[\overline{\mathrm{AB}}=4\overline{\mathrm{PB}},\qquad \overline{\mathrm{CQ}}=3\overline{\mathrm{AB}}\]
        일 때, \(90\times(a+b)\)의 값을 구하시오. (단, \(0&lt;a&lt;b\))`,
      figure: "2023-09-21.webp",
      short: true,
      answer: 220,
      help: R`기울기가 \(-m\)인 두 직선은 서로 평행하다. 평행한 직선 위에서는 선분의 길이 비가 \(x\)좌표 차의 비와 같으므로, \(\overline{\mathrm{AB}}=4\overline{\mathrm{PB}}\)와 \(\overline{\mathrm{CQ}}=3\overline{\mathrm{AB}}\)를 길이가 아니라 \(x\)좌표 차의 관계로 바꿔 쓸 수 있다.`
    },
{
      id: "2023-09-22", exam: "2023-09", no: 22, score: 4,
      units: ["m2-diff"], memo: "한쪽을 점대칭으로 뒤집은 함수",
      body: R`최고차항의 계수가 \(1\)이고 \(x=3\)에서 극댓값 \(8\)을 갖는
        삼차함수 \(f(x)\)가 있다. 실수 \(t\)에 대하여 함수 \(g(x)\)를
        \[g(x)=\begin{cases}f(x) &amp; (x\ge t)\\ -f(x)+2f(t) &amp; (x&lt;t)\end{cases}\]
        라 할 때, 방정식 \(g(x)=0\)의 서로 다른 실근의 개수를 \(h(t)\)라
        하자. 함수 \(h(t)\)가 \(t=a\)에서 불연속인 \(a\)의 값이 두 개일 때,
        \(f(8)\)의 값을 구하시오.`,
      short: true,
      answer: 58,
      help: R`\(x&lt;t\)에서의 \(-f(x)+2f(t)\)는 \(f\)를 점 \(\bigl(t,\,f(t)\bigr)\)에 대하여 점대칭으로 뒤집은 것이다. 곧 \(g\)의 그래프는 \(x=t\)를 경계로 오른쪽은 \(f\) 그대로, 왼쪽은 그 점을 중심으로 돌린 모양이라 \(x=t\)에서 매끄럽게 이어진다.`
    },
{
      id: "2023-09-prob-28", exam: "2023-09", no: 28, score: 4,
      units: ["prob-prob"], memo: "배수 조건과 나머지 분류를 이용한 확률",
      body: R`\(1\)부터 \(10\)까지의 자연수 중에서 임의로 서로 다른 \(3\)개의 수를 선택한다. 선택된 세 개의 수의 곱이 \(5\)의 배수이고 합은 \(3\)의 배수일 확률은?`,
      choices: [R`\(\dfrac{3}{20}\)`, R`\(\dfrac{1}{6}\)`, R`\(\dfrac{11}{60}\)`, R`\(\dfrac{1}{5}\)`, R`\(\dfrac{13}{60}\)`],
      answer: 3,
      help: R`전체 경우의 수는 \({}_{10}\mathrm{C}_{3} = 120\)이다. 곱이 5의 배수이므로 5 또는 10이 적어도 하나 포함되어야 한다. 10개의 수를 3으로 나눈 나머지 그룹(0, 1, 2)으로 분류한 후, 5만 포함하는 경우, 10만 포함하는 경우, 5와 10을 둘 다 포함하는 경우로 나누어 세 수의 합이 3의 배수가 되는 조합을 센다.`
    },
{
      id: "2023-09-prob-29", exam: "2023-09", no: 29, score: 4,
      units: ["prob-stat"], memo: "표본평균의 분포와 주사위 눈의 합",
      body: R`\(1\)부터 \(6\)까지의 자연수가 하나씩 적힌 \(6\)장의 카드가 들어 있는 주머니가 있다. 이 주머니에서 임의로 한 장의 카드를 꺼내어 카드에 적힌 수를 확인한 후 다시 넣는 시행을 한다. 이 시행을 \(4\)번 반복하여 확인한 네 개의 수의 평균을 \(\overline{X}\)라 할 때, \(\mathrm{P}\left(\overline{X}=\dfrac{11}{4}\right)=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 175,
      help: R`\(\overline{X}=\dfrac{11}{4}\)는 4번 꺼낸 수의 합이 \(11\)인 사건이다. \(x_1+x_2+x_3+x_4=11\) (\(1\le x_i\le 6\))의 해의 개수는 \({}_{4}\mathrm{H}_{7} = 120\)에서 한 변수가 7 이상인 경우 4가지를 빼서 116가지가 아니라 6을 넘는 경우를 정확히 배제하여 80가지 또는 해당 경우의 수를 구하고, 전체 \(6^4=1296\)으로 나누어 기약분수를 얻는다.`
    },
{
      id: "2023-09-prob-30", exam: "2023-09", no: 30, score: 4,
      units: ["prob-count"], memo: "치역의 크기와 고정점이 없는 합성함수 (순열과 조합)",
      body: R`집합 \(X=\{1, 2, 3, 4, 5\}\)와 함수 \(f\colon X\to X\)에 대하여 함수 \(f\)의 치역을 \(A\), 합성함수 \(f\circ f\)의 치역을 \(B\)라 할 때, 다음 조건을 만족시키는 함수 \(f\)의 개수를 구하시오.`,
      noteTitle: "조 건",
      note: [
        R`(가) \(n(A)\le 3\)`,
        R`(나) \(n(A)=n(B)\)`,
        R`(다) 집합 \(X\)의 모든 원소 \(x\)에 대하여 \(f(x)\ne x\)이다.`
      ],
      short: true,
      answer: 260,
      help: R`조건 (나)에서 \(f\)는 치역 \(A\) 위에서 일대일대응이어야 한다. 조건 (다)에서 고정점이 없으므로 \(A\) 위에서의 \(f\)는 완전순열(교란순열)이다. \(n(A)=2\)인 경우(2원소 순환)와 \(n(A)=3\)인 경우(3원소 순환)로 나누어 치역 선택과 나머지 원소들의 대응 경우의 수를 계산한다.`
    },
{
      id: "2023-09-calc-28", exam: "2023-09", no: 28, score: 4,
      units: ["calc-seq", "calc-diff"], memo: "삼각함수의 극한과 도형의 넓이",
      body: R`그림과 같이 반지름의 길이가 \(1\)이고 중심각의 크기가 \(\dfrac{\pi}{2}\)인 부채꼴 \(\mathrm{OAB}\)가 있다. 호 \(\mathrm{AB}\) 위의 점 \(\mathrm{P}\)에 대하여 \(\overline{\mathrm{PA}}=\overline{\mathrm{PC}}=\overline{\mathrm{PD}}\)가 되도록 호 \(\mathrm{PB}\) 위에 점 \(\mathrm{C}\)와 선분 \(\mathrm{OA}\) 위에 점 \(\mathrm{D}\)를 잡는다. 점 \(\mathrm{D}\)를 지나고 선분 \(\mathrm{OP}\)와 평행한 직선이 선분 \(\mathrm{PA}\)와 만나는 점을 \(\mathrm{E}\)라 하자. \(\angle\mathrm{POA}=\theta\)일 때, 삼각형 \(\mathrm{CDP}\)의 넓이를 \(f(\theta)\), 삼각형 \(\mathrm{EDA}\)의 넓이를 \(g(\theta)\)라 하자. \[\lim_{\theta\to 0+}\dfrac{g(\theta)}{\theta^{2}\times f(\theta)}\]의 값은? (단, \(0&lt;\theta&lt;\dfrac{\pi}{4}\))`,
      figure: "2023-09-calc-28.webp",
      choices: [R`\(\dfrac{1}{8}\)`, R`\(\dfrac{1}{4}\)`, R`\(\dfrac{3}{8}\)`, R`\(\dfrac{1}{2}\)`, R`\(\dfrac{5}{8}\)`],
      answer: 3,
      help: R`\(\overline{\mathrm{PA}}=2\sin\frac{\theta}{2}\)이므로 점 \(\mathrm{P}\)를 중심으로 하는 호 위에 \(\mathrm{A}, \mathrm{C}, \mathrm{D}\)가 놓입니다. 평행선 조건에서 동위각과 엇각을 찾아 \(\triangle\mathrm{EDA}\)와 \(\triangle\mathrm{CDP}\)의 각 변과 끼인각을 \(\theta\)로 나타냅니다.`
    },
{
      id: "2023-09-calc-29", exam: "2023-09", no: 29, score: 4,
      units: ["calc-diff"], memo: "역함수의 미분법과 최단 거리",
      body: R`함수 \(f(x)=e^{x}+x\)가 있다. 양수 \(t\)에 대하여 점 \((t,\,0)\)과 점 \((x,\,f(x))\) 사이의 거리가 \(x=s\)에서 최소일 때, 실수 \(f(s)\)의 값을 \(g(t)\)라 하자. 함수 \(g(t)\)의 역함수를 \(h(t)\)라 할 때, \(h'(1)\)의 값을 구하시오.`,
      figure: "2023-09-calc-29.webp",
      short: true,
      answer: 3,
      help: R`점 \((t, 0)\)에서 곡선 위의 점까지 거리가 최소가 되는 조건은 접선과 법선의 수직 관계입니다. \((s-t)+f(s)f'(s)=0\)에서 \(t=s+f(s)f'(s)\)를 얻고, \(g(t)=f(s)=1\)이 되는 \(s\)와 \(t\)를 구해 역함수 미분법을 적용합니다.`
    },
{
      id: "2023-09-calc-30", exam: "2023-09", no: 30, score: 4,
      units: ["calc-integ", "calc-diff"], memo: "치환적분법과 사차함수의 성질",
      body: R`최고차항의 계수가 \(1\)인 사차함수 \(f(x)\)와 구간 \((0,\,\infty)\)에서 \(g(x)\ge 0\)인 함수 \(g(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`\(x\le -3\)인 모든 실수 \(x\)에 대하여 \(f(x)\ge f(-3)\)이다.`,
        R`\(x>-3\)인 모든 실수 \(x\)에 대하여 \(g(x+3)\{f(x)-f(0)\}^{2}=f'(x)\)이다.`
      ],
            bodyAfter: R`\(\displaystyle\int_{4}^{5}g(x)\,dx=\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 283,
      help: R`조건 (가)에서 \(f'(-3)=0\)이고, 조건 (나)에서 \(x>-3\)일 때 \(g(x+3)\ge 0\)이므로 \(f'(x)\ge 0\)입니다. 치환적분 \(\int_4^5 g(t)\,dt = \int_1^2 \frac{f'(x)}{\{f(x)-f(0)\}^2}\,dx\)를 세워 \(\left[-\frac{1}{f(x)-f(0)}\right]_1^2\)로 계산합니다.`
    },
{
      id: "2023-09-geom-28", exam: "2023-09", no: 28, score: 4,
      units: ["geom-curve"], memo: "두 포물선의 정의와 초점 거리 일치 조건, 유일해 조건",
      body: R`실수 \(p\) (\(p\ge 1\))과 함수 \(f(x)=(x+a)^2\)에 대하여 두 포물선
\[C_1: y^2=4x, \quad C_2: (y-3)^2=4p\{x-f(p)\}\]
가 제\(1\)사분면에서 만나는 점을 \(\mathrm{A}\)라 하자. 두 포물선 \(C_1, C_2\)의 초점을 각각 \(\mathrm{F}_1, \mathrm{F}_2\)라 할 때, \(\overline{\mathrm{AF}_1}=\overline{\mathrm{AF}_2}\)를 만족시키는 \(p\)가 오직 하나가 되도록 하는 상수 \(a\)의 값은?`,
      figure: "2023-09-geom-28.webp",
      choices: [R`\(-\dfrac{3}{4}\)`, R`\(-\dfrac{5}{8}\)`, R`\(-\dfrac{1}{2}\)`, R`\(-\dfrac{3}{8}\)`, R`\(-\dfrac{1}{4}\)`],
      answer: 1,
      help: R`포물선의 정의에 의해 \(\overline{\mathrm{AF}_1}=x_A+1\), \(\overline{\mathrm{AF}_2}=x_A-f(p)+p\)이다. 두 거리가 같으므로 \(x_A+1 = x_A-(p+a)^2+p\)에서 \((p+a)^2 = p-1\)이라는 \(p\)에 대한 이차방정식을 얻고, \(p\ge 1\)에서 오직 하나의 실근을 가질 조건을 판별식 및 근의 위치 판정으로 구한다.`
    },
{
      id: "2023-09-geom-29", exam: "2023-09", no: 29, score: 4,
      units: ["geom-space"], memo: "두 구의 접평면과 단면원, 정사영의 넓이",
      body: R`좌표공간에 두 개의 구
\[S_1: x^2+y^2+(z-2)^2=4, \quad S_2: x^2+y^2+(z+7)^2=49\]
가 있다. 점 \(\mathrm{A}(\sqrt{5}, 0, 0)\)을 지나고 \(zx\)평면에 수직이며, 구 \(S_1\)과 \(z\)좌표가 양수인 한 점에서 접하는 평면을 \(\alpha\)라 하자. 구 \(S_2\)가 평면 \(\alpha\)와 만나서 생기는 원을 \(C\)라 할 때, 원 \(C\) 위의 점 중 \(z\)좌표가 최소인 점을 \(\mathrm{B}\)라 하고 구 \(S_2\)와 점 \(\mathrm{B}\)에서 접하는 평면을 \(\beta\)라 하자. 원 \(C\)의 평면 \(\beta\) 위로의 정사영의 넓이가 \(\dfrac{q}{p}\pi\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2023-09-geom-29.webp",
      short: true,
      answer: 127,
      help: R`\(zx\)평면(단면 \(y=0\))에서 두 구와 평면 \(\alpha\)의 접선 방정식을 구하여 평면 \(\alpha\)의 법선벡터와 원 \(C\)의 반지름을 구한다. 최저점 \(\mathrm{B}\)에서의 접평면 \(\beta\)의 법선벡터와 평면 \(\alpha\)의 법선벡터가 이루는 각 \(\theta\)의 \(\cos\theta\)를 계산하여 정사영 넓이를 구한다.`
    },
{
      id: "2023-09-geom-30", exam: "2023-09", no: 30, score: 4,
      units: ["geom-vector"], memo: "원호 위의 두 동점의 벡터합이 그리는 곡선의 길이",
      body: R`좌표평면 위에 두 점 \(\mathrm{A}(-2, 2), \mathrm{B}(2, 2)\)가 있다.
\[(|\vec{\mathrm{AX}}|-2)(|\vec{\mathrm{BX}}|-2)=0, \quad |\vec{\mathrm{OX}}|\ge 2\]
를 만족시키는 점 \(\mathrm{X}\)가 나타내는 도형 위를 움직이는 두 점 \(\mathrm{P}, \mathrm{Q}\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(\vec{u}=(1, 0)\)에 대하여 \((\vec{\mathrm{OP}}\cdot\vec{u})(\vec{\mathrm{OQ}}\cdot\vec{u})\ge 0\)이다.`,
        R`(나) \(|\vec{\mathrm{PQ}}|=2\)`
      ],
            bodyAfter: R`\(\vec{\mathrm{OY}}=\vec{\mathrm{OP}}+\vec{\mathrm{OQ}}\)를 만족시키는 점 \(\mathrm{Y}\)의 집합이 나타내는 도형의 길이가 \(\dfrac{q}{p}\sqrt{3}\pi\)일 때, \(p+q\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 17,
      help: R`도형 \(S\)는 두 원의 일부분(외부 영역) 호이다. 조건 (가)는 두 점 \(\mathrm{P}, \mathrm{Q}\)가 같은 사분면(좌반평면 또는 우반평면)의 원호 위에 있음을 뜻하고, \(|\vec{\mathrm{PQ}}|=2\)는 현의 길이가 반지름과 같아 중심각이 \(\dfrac{\pi}{3}\)임을 나타낸다. 두 벡터의 합 \(\vec{\mathrm{OY}}=2\vec{\mathrm{OM}}\)이 그리는 호의 중심각과 곡선 길이를 계산한다.`
    }
  ];
})();
