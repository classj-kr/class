(function () {
  "use strict";
  const R = String.raw;
  // 2024-06 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2024-06"] = [
{
      id: "2024-06-9", exam: "2024-06", no: 9, score: 4,
      units: ["m1-seq"], memo: "부분합의 차로 항 구하기",
      body: R`수열 \(\{a_{n}\}\)이 모든 자연수 \(n\)에 대하여
        \[\sum_{k=1}^{n}\frac{1}{(2k-1)a_{k}}=n^{2}+2n\]
        을 만족시킬 때, \(\displaystyle\sum_{n=1}^{10}a_{n}\)의 값은?`,
      choices: [R`\(\dfrac{10}{21}\)`, R`\(\dfrac{4}{7}\)`, R`\(\dfrac{2}{3}\)`, R`\(\dfrac{16}{21}\)`, R`\(\dfrac{6}{7}\)`],
      answer: 1,
      help: R`부분합의 차를 구하면 \(\frac{1}{(2n-1)a_{n}}=2n+1\), 곧 \(a_{n}=\frac{1}{(2n-1)(2n+1)}\)이다. 이것은 \(\frac{1}{2}\left(\frac{1}{2n-1}-\frac{1}{2n+1}\right)\)로 갈라져 합이 접힌다.`
    },
{
      id: "2024-06-10", exam: "2024-06", no: 10, score: 4,
      units: ["m2-integ"], memo: "x축 위와 아래의 두 넓이의 차",
      body: R`양수 \(k\)에 대하여 함수 \(f(x)\)는
        \[f(x)=kx(x-2)(x-3)\]
        이다. 곡선 \(y=f(x)\)와 \(x\)축이 원점 \(\mathrm{O}\)와 두 점 \(\mathrm{P}\), \(\mathrm{Q}\,\bigl(\overline{\mathrm{OP}}&lt;\overline{\mathrm{OQ}}\bigr)\)
        에서 만난다. 곡선 \(y=f(x)\)와 선분 \(\mathrm{OP}\)로 둘러싸인 영역을 \(A\),
        곡선 \(y=f(x)\)와 선분 \(\mathrm{PQ}\)로 둘러싸인 영역을 \(B\)라 하자.
        \[(A\text{의 넓이})-(B\text{의 넓이})=3\]
        일 때, \(k\)의 값은?`,
      figure: "2024-06-10.webp",
      choices: [R`\(\dfrac{7}{6}\)`, R`\(\dfrac{4}{3}\)`, R`\(\dfrac{3}{2}\)`, R`\(\dfrac{5}{3}\)`, R`\(\dfrac{11}{6}\)`],
      answer: 2,
      help: R`\(A\)에서는 곡선이 \(x\)축 위에, \(B\)에서는 아래에 있다. 그래서 두 넓이의 차는 부호를 붙여 묶으면 \(\displaystyle\int_{0}^{3}f(x)\,dx=3\) 한 줄이 된다.`
    },
{
      id: "2024-06-11", exam: "2024-06", no: 11, score: 4,
      units: ["m2-diff"], memo: "직선과 가장 가까운 곡선 위의 점",
      body: R`그림과 같이 실수 \(t\,(0&lt;t&lt;1)\)에 대하여 곡선 \(y=x^{2}\) 위의
        점 중에서 직선 \(y=2tx-1\)과의 거리가 최소인 점을 \(\mathrm{P}\)라 하고,
        직선 \(\mathrm{OP}\)가 직선 \(y=2tx-1\)과 만나는 점을 \(\mathrm{Q}\)라 할 때,
        \(\displaystyle\lim_{t\to 1-}\frac{\overline{\mathrm{PQ}}}{1-t}\)의 값은? (단, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2024-06-11.webp",
      choices: [R`\(\sqrt{6}\)`, R`\(\sqrt{7}\)`, R`\(2\sqrt{2}\)`, R`\(3\)`, R`\(\sqrt{10}\)`],
      answer: 3,
      help: R`직선과의 거리가 가장 작은 점은 접선의 기울기가 그 직선과 같은 점이므로 \(\mathrm{P}=(t,\,t^{2})\)다. 그러면 직선 \(\mathrm{OP}\)가 \(y=tx\)이고, \(y=2tx-1\)과의 교점이 \(\mathrm{Q}\left(\frac{1}{t},\,1\right)\)로 곧바로 나온다.`
    },
{
      id: "2024-06-12", exam: "2024-06", no: 12, score: 4,
      units: ["m1-seq"], memo: "공차가 두 배인 두 등차수열의 겹침",
      body: R`\(a_{2}=-4\)이고 공차가 \(0\)이 아닌 등차수열 \(\{a_{n}\}\)에 대하여
        수열 \(\{b_{n}\}\)을 \(b_{n}=a_{n}+a_{n+1}\,(n\ge 1)\)이라 하고, 두 집합 \(A\), \(B\)를
        \[A=\bigl\{a_{1},\,a_{2},\,a_{3},\,a_{4},\,a_{5}\bigr\},\qquad B=\bigl\{b_{1},\,b_{2},\,b_{3},\,b_{4},\,b_{5}\bigr\}\]
        라 하자. \(n(A\cap B)=3\)이 되도록 하는 모든 수열 \(\{a_{n}\}\)에
        대하여 \(a_{20}\)의 값의 합은?`,
      choices: [R`\(30\)`, R`\(34\)`, R`\(38\)`, R`\(42\)`, R`\(46\)`],
      answer: 5,
      help: R`\(b_{n}=a_{n}+a_{n+1}=2a_{n}+d\)이므로 \(\{b_{n}\}\)은 공차가 \(2d\)인 등차수열이다. 두 수열의 공차가 \(d\)와 \(2d\)로 다르니, 다섯 개씩 중에서 셋이 겹치려면 겹치는 자리가 몇 가지 꼴로만 가능하다.`
    },
{
      id: "2024-06-13", exam: "2024-06", no: 13, score: 4,
      units: ["m1-trig"], memo: "지름이 만드는 직각과 현의 길이",
      body: R`그림과 같이
        \[\overline{\mathrm{BC}}=3,\quad \overline{\mathrm{CD}}=2,\quad \cos(\angle\mathrm{BCD})=-\frac{1}{3},\quad \angle\mathrm{DAB}>\frac{\pi}{2}\]
        인 사각형 \(\mathrm{ABCD}\)에서 두 삼각형 \(\mathrm{ABC}\)와 \(\mathrm{ACD}\)는 모두
        예각삼각형이다. 선분 \(\mathrm{AC}\)를 \(1:2\)로 내분하는 점 \(\mathrm{E}\)에 대하여
        선분 \(\mathrm{AE}\)를 지름으로 하는 원이 두 선분 \(\mathrm{AB}\), \(\mathrm{AD}\)와 만나는
        점 중 \(\mathrm{A}\)가 아닌 점을 각각 \(\mathrm{P}_{1}\), \(\mathrm{P}_{2}\)라 하고,
        선분 \(\mathrm{CE}\)를 지름으로 하는 원이 두 선분 \(\mathrm{BC}\), \(\mathrm{CD}\)와 만나는
        점 중 \(\mathrm{C}\)가 아닌 점을 각각 \(\mathrm{Q}_{1}\), \(\mathrm{Q}_{2}\)라 하자.
        \(\overline{\mathrm{P}_{1}\mathrm{P}_{2}}:\overline{\mathrm{Q}_{1}\mathrm{Q}_{2}}=3:5\sqrt{2}\)이고 삼각형 \(\mathrm{ABD}\)의 넓이가 \(2\)일 때,
        \(\overline{\mathrm{AB}}+\overline{\mathrm{AD}}\)의 값은? (단, \(\overline{\mathrm{AB}}>\overline{\mathrm{AD}}\))`,
      figure: "2024-06-13.webp",
      choices: [R`\(\sqrt{21}\)`, R`\(\sqrt{22}\)`, R`\(\sqrt{23}\)`, R`\(2\sqrt{6}\)`, R`\(5\)`],
      answer: 1,
      help: R`\(\overline{\mathrm{P}_{1}\mathrm{P}_{2}}\)는 지름이 \(\overline{\mathrm{AE}}\)인 원의 현이고, 그 현을 마주 보는 원주각이 \(\angle\mathrm{DAB}\)다. 그래서 사인법칙으로 \(\overline{\mathrm{P}_{1}\mathrm{P}_{2}}=\overline{\mathrm{AE}}\sin(\angle\mathrm{DAB})\)가 된다. \(\overline{\mathrm{Q}_{1}\mathrm{Q}_{2}}\)도 마찬가지로 \(\overline{\mathrm{CE}}\sin(\angle\mathrm{BCD})\)다.`
    },
{
      id: "2024-06-14", exam: "2024-06", no: 14, score: 4,
      units: ["m2-integ"], memo: "속도의 근이 겹쳐야 하는 조건",
      body: R`실수 \(a\,(a\ge 0)\)에 대하여 수직선 위를 움직이는 점 \(\mathrm{P}\)의
        시각 \(t\,(t\ge 0)\)에서의 속도 \(v(t)\)를
        \[v(t)=-t(t-1)(t-a)(t-2a)\]
        라 하자. 점 \(\mathrm{P}\)가 시각 \(t=0\)일 때 출발한 후 운동 방향을
        한 번만 바꾸도록 하는 \(a\)에 대하여, 시각 \(t=0\)에서 \(t=2\)까지
        점 \(\mathrm{P}\)의 위치의 변화량의 최댓값은?`,
      choices: [R`\(\dfrac{1}{5}\)`, R`\(\dfrac{7}{30}\)`, R`\(\dfrac{4}{15}\)`, R`\(\dfrac{3}{10}\)`, R`\(\dfrac{1}{3}\)`],
      answer: 3,
      help: R`운동 방향은 \(v\)의 부호가 바뀔 때만 바뀐다. \(v\)의 근은 \(0,\,1,\,a,\,2a\)인데 \(t>0\)에서 부호가 딱 한 번만 바뀌려면 근들이 서로 겹쳐 중복근이 되어야 한다. 위치의 변화량은 절댓값 없이 \(\int_{0}^{2}v(t)\,dt\)다.`
    },
{
      id: "2024-06-15", exam: "2024-06", no: 15, score: 4,
      units: ["m1-seq"], memo: "부호에 따라 반대로 밀리는 수열",
      body: R`자연수 \(k\)에 대하여 다음 조건을 만족시키는 수열 \(\{a_{n}\}\)이
        있다.`,
      note: [
        R`\(a_{1}=k\)이고, 모든 자연수 \(n\)에 대하여 \(a_{n+1}=\begin{cases}a_{n}+2n-k &amp; \left(a_{n}\le 0\right)\\ a_{n}-2n-k &amp; \left(a_{n}>0\right)\end{cases}\)이다.`
      ],
      bodyAfter: R`\(a_{3}\times a_{4}\times a_{5}\times a_{6}&lt;0\)이 되도록 하는 모든 \(k\)의 값의 합은?`,
      choices: [R`\(10\)`, R`\(14\)`, R`\(18\)`, R`\(22\)`, R`\(26\)`],
      answer: 2,
      help: R`\(a_{n}\)이 \(0\) 이하면 \(+2n-k\), 양수면 \(-2n-k\)를 더한다. 곧 부호에 따라 방향이 갈린다. 네 항의 곱이 음수라는 것은 그 넷 가운데 음수가 홀수 개라는 뜻이므로, \(k\)를 작은 값부터 넣어 부호가 어떻게 갈리는지 직접 따라가는 편이 빠르다.`
    },
{
      id: "2024-06-20", exam: "2024-06", no: 20, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "적분으로 만든 삼차함수의 최소",
      body: R`최고차항의 계수가 \(1\)인 이차함수 \(f(x)\)에 대하여 함수
        \[g(x)=\int_{0}^{x}f(t)\,dt\]
        가 다음 조건을 만족시킬 때, \(f(9)\)의 값을 구하시오.`,
      note: [
        R`\(x\ge 1\)인 모든 실수 \(x\)에 대하여 \(g(x)\ge g(4)\)이고 \(\bigl|g(x)\bigr|\ge\bigl|g(3)\bigr|\)이다.`
      ],
      short: true,
      answer: 39,
      help: R`\(g'=f\)이고 \(f\)가 최고차항 계수 \(1\)인 이차함수라 \(g\)는 삼차함수다. \(x\ge 1\)에서 \(g\)의 최솟값이 \(g(4)\)라는 것은 \(x=4\)가 극소, 곧 \(f(4)=0\)이라는 뜻이다. 그리고 \(g\)가 그 구간에서 값 \(0\)을 지나면 그 자리에서 \(|g|=0\)이 되므로, \(\bigl|g(x)\bigr|\ge\bigl|g(3)\bigr|\)이려면 \(g(3)=0\)이어야 한다.`
    },
{
      id: "2024-06-21", exam: "2024-06", no: 21, score: 4,
      units: ["m1-explog"], memo: "감소 곡선과 증가 곡선의 교점",
      body: R`실수 \(t\)에 대하여 두 곡선 \(y=t-\log_{2}x\)와 \(y=2^{\,x-t}\)이 만나는
        점의 \(x\)좌표를 \(f(t)\)라 하자.
        &lt;보기&gt;의 각 명제에 대하여 다음 규칙에 따라 \(A\), \(B\), \(C\)의
        값을 정할 때, \(A+B+C\)의 값을 구하시오. (단, \(A+B+C\ne 0\))`,
      note: [
        R`명제 ㄱ이 참이면 \(A=100\), 거짓이면 \(A=0\)이다.`,
        R`명제 ㄴ이 참이면 \(B=10\), 거짓이면 \(B=0\)이다.`,
        R`명제 ㄷ이 참이면 \(C=1\), 거짓이면 \(C=0\)이다.`
      ],
      bullets: true,
      bodyAfter: R`<div class="note-box has-title"><span class="note-title">보 기</span><ul>
        <li>ㄱ. \(f(1)=1\)이고 \(f(2)=2\)이다.</li>
        <li>ㄴ. 실수 \(t\)의 값이 증가하면 \(f(t)\)의 값도 증가한다.</li>
        <li>ㄷ. 모든 양의 실수 \(t\)에 대하여 \(f(t)\ge t\)이다.</li>
        </ul></div>`,
      short: true,
      answer: 110,
      help: R`\(y=t-\log_{2}x\)는 감소하고 \(y=2^{\,x-t}\)는 증가하므로 교점은 언제나 하나뿐이다. ㄱ은 \(t=1\), \(t=2\)를 직접 넣어 보면 바로 확인된다. ㄴ과 ㄷ은 \(t\)가 커질 때 두 곡선이 각각 위로, 오른쪽으로 밀리는 것을 견주면 된다.`
    },
{
      id: "2024-06-22", exam: "2024-06", no: 22, score: 4,
      units: ["m2-diff"], memo: "구간이 극값을 품는지 세기",
      body: R`정수 \(a\,(a\ne 0)\)에 대하여 함수 \(f(x)\)를
        \[f(x)=x^{3}-2ax^{2}\]
        이라 하자. 다음 조건을 만족시키는 모든 정수 \(k\)의 값의 곱이
        \(-12\)가 되도록 하는 \(a\)에 대하여 \(f'(10)\)의 값을 구하시오.`,
      note: [
        R`함수 \(f(x)\)에 대하여 \(\left\{\dfrac{f(x_{1})-f(x_{2})}{x_{1}-x_{2}}\right\}\times\left\{\dfrac{f(x_{2})-f(x_{3})}{x_{2}-x_{3}}\right\}&lt;0\)을 만족시키는 세 실수 \(x_{1}\), \(x_{2}\), \(x_{3}\)이 열린구간 \(\left(k,\,k+\dfrac{3}{2}\right)\)에 존재한다.`
      ],
      short: true,
      answer: 380,
      help: R`두 평균변화율의 곱이 음수라는 것은 그 구간 안에서 \(f\)가 늘다가 줄거나 줄다가 는다는 뜻, 곧 구간이 극값을 품는다는 뜻이다. \(f'(x)=3x^{2}-4ax=x(3x-4a)\)이므로 극값은 \(x=0\)과 \(x=\frac{4a}{3}\)에 있고, 길이 \(\frac{3}{2}\)인 구간이 그 둘 중 하나를 품는 정수 \(k\)를 세는 문제가 된다.`
    },
{
      id: "2024-06-prob-28", exam: "2024-06", no: 28, score: 4,
      units: ["prob-count"], memo: "치역의 크기와 부등식을 만족시키는 함수의 개수",
      body: R`집합 \(X=\{1, 2, 3, 4, 5\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수는?`,
      noteTitle: "조 건",
      note: [
        R`(가) \(f(1)\times f(3)\times f(5)\)는 홀수이다.`,
        R`(나) \(f(2) &lt; f(4)\)`,
        R`(다) 함수 \(f\)의 치역의 원소의 개수는 \(3\)이다.`
      ],
      choices: [R`\(128\)`, R`\(132\)`, R`\(136\)`, R`\(140\)`, R`\(144\)`],
      answer: 5,
      help: R`조건 (가)에 의해 \(f(1), f(3), f(5)\in\{1, 3, 5\}\)이다. 이 세 함숫값의 치역 크기가 1개, 2개, 3개인 경우로 나누고, 전체 치역의 크기가 3이 되도록 \(f(2) &lt; f(4)\)의 값을 배분하는 경우의 수를 체계적으로 분류하여 더한다.`
    },
{
      id: "2024-06-prob-29", exam: "2024-06", no: 29, score: 4,
      units: ["prob-count"], memo: "검은 카드와 흰 카드의 배열 (중복조합)",
      body: R`그림과 같이 \(2\)장의 검은색 카드와 \(1\)부터 \(8\)까지의 자연수가 하나씩 적혀 있는 \(8\)장의 흰색 카드가 있다. 이 카드를 모두 한 번씩 사용하여 왼쪽에서 오른쪽으로 일렬로 배열할 때, 다음 조건을 만족시키는 경우의 수를 구하시오. (단, 검은색 카드는 서로 구별하지 않는다.)`,
      figure: "2024-06-prob-29.webp",
      noteTitle: "조 건",
      note: [
        R`(가) 흰색 카드에 적힌 수가 작은 수부터 크기순으로 왼쪽에서 오른쪽으로 배열되도록 카드가 놓여 있다.`,
        R`(나) 검은색 카드 사이에는 흰색 카드가 \(2\)장 이상 놓여 있다.`,
        R`(다) 검은색 카드 사이에는 \(3\)의 배수가 적힌 흰색 카드가 \(1\)장 이상 놓여 있다.`
      ],
      short: true,
      answer: 25,
      help: R`검은색 카드 2장 사이의 흰색 카드 개수를 \(y\), 왼쪽을 \(x\), 오른쪽을 \(z\)라 하면 \(x+y+z=8\) (\(y\ge 2\))이다. 사이의 카드들에 3의 배수(3 또는 6)가 적어도 1개 들어가야 하므로, 3의 배수가 전혀 포함되지 않는 여사건(사이에 들어가는 카드가 \(\{1, 2\}, \{4, 5\}, \{7, 8\}\) 등의 부분집합인 경우)을 제외하여 센다.`
    },
{
      id: "2024-06-prob-30", exam: "2024-06", no: 30, score: 4,
      units: ["prob-prob"], memo: "주머니 공 꺼내기 게임의 점수와 확률",
      body: R`주머니에 숫자 \(1\), \(2\), \(3\), \(4\)가 하나씩 적혀 있는 흰 공 \(4\)개와 숫자 \(4\), \(5\), \(6\), \(7\)이 하나씩 적혀 있는 검은 공 \(4\)개가 들어 있다. 이 주머니를 사용하여 다음 규칙에 따라 점수를 얻는 시행을 한다.
주머니에서 임의로 \(2\)개의 공을 동시에 꺼내어 꺼낸 공이 서로 다른 색이면 \(12\)를 점수로 얻고, 꺼낸 공이 서로 같은 색이면 꺼낸 두 공에 적힌 수의 곱을 점수로 얻는다.
이 시행을 한 번 하여 얻은 점수가 \(24\) 이하의 짝수일 확률이 \(\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 51,
      help: R`전체 경우의 수는 \({}_{8}\mathrm{C}_{2}=28\)이다. 서로 다른 색을 꺼내면 항상 12점(24 이하의 짝수)이므로 \(4\times 4=16\)가지는 모두 해당한다. 같은 색인 경우 흰 공 2개에서 곱이 짝수인 경우와 검은 공 2개에서 곱이 24 이하의 짝수인 경우를 각각 찾아 더하면 23가지가 되어 확률은 \(\dfrac{23}{28}\)이다.`
    },
{
      id: "2024-06-calc-28", exam: "2024-06", no: 28, score: 4,
      units: ["calc-diff"], memo: "완전제곱 변형과 연속함수 성질을 이용한 미정계수 결정",
      body: R`두 상수 \(a\,(a > 0)\), \(b\)에 대하여 실수 전체의 집합에서 연속인 함수 \(f(x)\)가 다음 조건을 만족시킬 때, \(a \times b\)의 값은?`,
      note: [
        R`(가) 모든 실수 \(x\)에 대하여
\[\{f(x)\}^2 + 2f(x) = a\cos^3 \pi x \times e^{\sin^2 \pi x} + b\]
이다.`,
        R`(나) \(f(0) = f(2) + 1\)`
      ],
      choices: [R`\(-\dfrac{1}{16}\)`, R`\(-\dfrac{7}{64}\)`, R`\(-\dfrac{5}{32}\)`, R`\(-\dfrac{13}{64}\)`, R`\(-\dfrac{1}{4}\)`],
      answer: 2,
      help: R`조건 (가)의 좌변을 \(\{f(x)+1\}^2\)으로 완전제곱 변형하고 조건 (나)와 \(g(0)=g(2)\)로부터 \(f(0)+1=\dfrac{1}{2}, f(2)+1=-\dfrac{1}{2}\)임을 찾습니다. \(f(x)+1\)이 연속이므로 부호가 바뀌는 지점에서 우변식의 최솟값이 \(0\)이어야 함을 이용하여 \(t=\cos\pi x=-1\)일 때의 값을 연립합니다.`
    },
{
      id: "2024-06-calc-29", exam: "2024-06", no: 29, score: 4,
      units: ["calc-diff"], memo: "직선 위의 교점과 음함수 미분법을 이용한 접선의 수직 조건",
      body: R`세 실수 \(a\), \(b\), \(k\)에 대하여 두 점 \(\mathrm{A}(a, a+k)\), \(\mathrm{B}(b, b+k)\)가 곡선 \(C : x^2 - 2xy + 2y^2 = 15\) 위에 있다. 곡선 \(C\) 위의 점 \(\mathrm{A}\)에서의 접선과 곡선 \(C\) 위의 점 \(\mathrm{B}\)에서의 접선이 서로 수직일 때, \(k^2\)의 값을 구하시오. (단, \(a+2k \neq 0\), \(b+2k \neq 0\))`,
      short: true,
      answer: 5,
      help: R`직선 \(y=x+k\)를 곡선 방정식에 대입하여 \(x^2+2kx+2k^2-15=0\)에서 근과 계수의 관계를 세웁니다. 곡선을 음함수 미분하여 접선의 기울기 \(y'=\dfrac{y-x}{2y-x}=\dfrac{k}{x+2k}\)를 구하고, 두 접선의 기울기 곱이 \(-1\)임을 이용하여 \(k^2=5\)를 구합니다.`
    },
{
      id: "2024-06-calc-30", exam: "2024-06", no: 30, score: 4,
      units: ["calc-seq"], memo: "구간별로 정의된 수열의 등비급수와 공비의 부호",
      body: R`수열 \(\{a_n\}\)은 등비수열이고, 수열 \(\{b_n\}\)을 모든 자연수 \(n\)에 대하여
\[b_n = \begin{cases} -1 &amp; (a_n \le -1) \\ a_n &amp; (a_n > -1) \end{cases}\]
이라 할 때, 수열 \(\{b_n\}\)은 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 급수 \(\displaystyle\sum_{n=1}^{\infty} b_{2n-1}\)은 수렴하고 그 합은 \(-3\)이다.`,
        R`(나) 급수 \(\displaystyle\sum_{n=1}^{\infty} b_{2n}\)은 수렴하고 그 합은 \(8\)이다.`
      ],
            bodyAfter: R`\(b_3 = -1\)일 때, \(\displaystyle\sum_{n=1}^{\infty} |a_n|\)의 값을 구하시오.`,
short: true,
      answer: 24,
      help: R`\(\sum b_{2n}=8>0\)과 \(b_3=-1\)로부터 \(a&lt;0, -1&lt;r&lt;0\)임을 파악하여 모든 짝수항은 \(b_{2n}=a_{2n}\)임을 확인합니다. 홀수항에서는 \(b_1=b_3=-1\)이고 \(n\ge 3\)부터 \(b_{2n-1}=a_{2n-1}\)이 됨을 이용해 \(r=-\dfrac{1}{2}, a=-12\)를 구하여 급수의 합 \(24\)를 도출합니다.`
    },
{
      id: "2024-06-geom-28", exam: "2024-06", no: 28, score: 4,
      units: ["geom-vector"], memo: "벡터 내적 및 거리 조건이 정의하는 도형과 영역의 교집합, 내적 계산",
      body: R`좌표평면의 네 점 \(\mathrm{A}(2, 6), \mathrm{B}(6, 2), \mathrm{C}(4, 4), \mathrm{D}(8, 6)\)에 대하여 다음 조건을 만족시키는 모든 점 \(\mathrm{X}\)의 집합을 \(S\)라 하자.`,
      note: [
        R`(가) \(\{(\vec{\mathrm{OX}}-\vec{\mathrm{OD}})\cdot\vec{\mathrm{OC}}\}\times\{|\vec{\mathrm{OX}}-\vec{\mathrm{OC}}|-3\}=0\)`,
        R`(나) 두 벡터 \(\vec{\mathrm{OX}}-\vec{\mathrm{OP}}\)와 \(\vec{\mathrm{OC}}\)가 서로 평행하도록 하는 선분 \(\mathrm{AB}\) 위의 점 \(\mathrm{P}\)가 존재한다.`
      ],
            bodyAfter: R`집합 \(S\)에 속하는 점 중에서 \(y\)좌표가 최대인 점을 \(\mathrm{Q}\), \(y\)좌표가 최소인 점을 \(\mathrm{R}\)이라 할 때, \(\vec{\mathrm{OQ}}\cdot\vec{\mathrm{OR}}\)의 값은? (단, \(\mathrm{O}\)는 원점이다.)`,
choices: [R`\(25\)`, R`\(26\)`, R`\(27\)`, R`\(28\)`, R`\(29\)`],
      answer: 5,
      help: R`조건 (가)는 점 \(\mathrm{X}\)가 직선(점 \(\mathrm{D}\)를 지나고 \(\vec{\mathrm{OC}}\)에 수직) 또는 원(중심 \(\mathrm{C}\), 반지름 \(3\)) 위에 있음을 뜻한다. 조건 (나)는 점 \(\mathrm{X}\)가 선분 \(\mathrm{AB}\)를 방향벡터 \(\vec{\mathrm{OC}}=(4,4)\)로 이동시킨 띠 영역 내에 있음을 의미한다. 교집합에서 최고점 \(\mathrm{Q}\)와 최저점 \(\mathrm{R}\)의 좌표를 찾아 내적을 구한다.`
    },
{
      id: "2024-06-geom-29", exam: "2024-06", no: 29, score: 4,
      units: ["geom-curve"], memo: "두 쌍곡선의 정의와 초점 거리, 등차중항 관계를 통한 기울기 계산",
      body: R`두 점 \(\mathrm{F}(c, 0), \mathrm{F}'(-c, 0)\) (\(c > 0\))을 초점으로 하는 두 쌍곡선
\[C_1: x^2-\dfrac{y^2}{24}=1, \quad C_2: \dfrac{x^2}{4}-\dfrac{y^2}{21}=1\]
이 있다. 쌍곡선 \(C_1\) 위에 있는 제\(2\)사분면 위의 점 \(\mathrm{P}\)에 대하여 선분 \(\mathrm{PF}'\)이 쌍곡선 \(C_2\)와 만나는 점을 \(\mathrm{Q}\)라 하자. \(\overline{\mathrm{PQ}}+\overline{\mathrm{QF}}, 2\overline{\mathrm{PF}'}, \overline{\mathrm{PF}}+\overline{\mathrm{PF}'}\)이 이 순서대로 등차수열을 이룰 때, 직선 \(\mathrm{PQ}\)의 기울기는 \(m\)이다. \(60m\)의 값을 구하시오.`,
      figure: "2024-06-geom-29.webp",
      short: true,
      answer: 80,
      help: R`두 쌍곡선 모두 \(c=5\)로 초점을 공유한다. 쌍곡선의 정의식 \(\overline{\mathrm{PF}}-\overline{\mathrm{PF}'}=2a_1=2\), \(\overline{\mathrm{QF}}-\overline{\mathrm{QF}'}=2a_2=4\)와 \(\overline{\mathrm{PF}'}=\overline{\mathrm{PQ}}+\overline{\mathrm{QF}'}\)을 대입하여 등차중항 관계식을 정리하면 선분들의 길이가 모두 구해지고, 코사인법칙 또는 좌표로 직선 \(\mathrm{PQ}\)의 기울기를 산출한다.`
    },
{
      id: "2024-06-geom-30", exam: "2024-06", no: 30, score: 4,
      units: ["geom-vector"], memo: "타원과 직선 위의 점의 벡터합 영역의 넓이",
      body: R`직선 \(2x+y=0\) 위를 움직이는 점 \(\mathrm{P}\)와 타원 \(2x^2+y^2=3\) 위를 움직이는 점 \(\mathrm{Q}\)에 대하여
\[\vec{\mathrm{OX}}=\vec{\mathrm{OP}}+\vec{\mathrm{OQ}}\]
를 만족시키고, \(x\)좌표와 \(y\)좌표가 모두 \(0\) 이상인 모든 점 \(\mathrm{X}\)가 나타내는 영역의 넓이는 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      figure: "2024-06-geom-30.webp",
      short: true,
      answer: 13,
      help: R`타원 위의 점 \(\mathrm{Q}\)를 직선 \(y=-2x\) 방향으로 스윕(sweep)한 영역이 제\(1\)사분면과 만나는 부분의 넓이를 구하는 문제이다. 타원의 접선 중 기울기가 \(-2\)인 접선을 구하여 제\(1\)사분면에서 둘러싸인 사다리꼴 또는 평행사변형 영역의 넓이를 적분 또는 기하학적 도형 분할로 계산한다.`
    }
  ];
})();
