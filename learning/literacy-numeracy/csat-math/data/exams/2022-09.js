(function () {
  "use strict";
  const R = String.raw;
  // 2022-09 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2022-09"] = [
{
      id: "2022-09-9", exam: "2022-09", no: 9, score: 4,
      units: ["m2-diff", "m2-integ"], memo: "가속도로 상수를 정하고 거리 구하기",
      body: R`수직선 위를 움직이는 점 \(\mathrm{P}\)의 시각 \(t\,(t>0)\)에서의
        속도 \(v(t)\)가
        \[v(t)=-4t^{3}+12t^{2}\]
        이다. 시각 \(t=k\)에서 점 \(\mathrm{P}\)의 가속도가 \(12\)일 때, 시각 \(t=3k\)에서
        \(t=4k\)까지 점 \(\mathrm{P}\)가 움직인 거리는? (단, \(k\)는 상수이다.)`,
      choices: [R`\(23\)`, R`\(25\)`, R`\(27\)`, R`\(29\)`, R`\(31\)`],
      answer: 3,
      help: R`가속도는 속도를 미분한 \(-12t^{2}+24t\)이고, 이것이 \(12\)라는 조건은 \(k^{2}-2k+1=0\)이 되어 \(k=1\)로 딱 하나 정해진다. 그리고 \(v(t)=4t^{2}(3-t)\)이므로 \(t>3\)에서는 속도가 음수라 거리를 구할 때 절댓값을 씌워야 한다.`
    },
{
      id: "2022-09-10", exam: "2022-09", no: 10, score: 4,
      units: ["m1-trig"], memo: "사인 곡선의 두 봉우리",
      body: R`두 양수 \(a\), \(b\)에 대하여 곡선 \(y=a\sin b\pi x\left(0\le x\le\dfrac{3}{b}\right)\)이
        직선 \(y=a\)와 만나는 서로 다른 두 점을 \(\mathrm{A}\), \(\mathrm{B}\)라 하자.
        삼각형 \(\mathrm{OAB}\)의 넓이가 \(5\)이고 직선 \(\mathrm{OA}\)의 기울기와
        직선 \(\mathrm{OB}\)의 기울기의 곱이 \(\dfrac{5}{4}\)일 때, \(a+b\)의 값은?
        (단, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2022-09-10.webp",
      choices: [R`\(1\)`, R`\(2\)`, R`\(3\)`, R`\(4\)`, R`\(5\)`],
      answer: 3,
      help: R`\(y=a\sin b\pi x\)의 최댓값이 \(a\)이므로 직선 \(y=a\)는 곡선의 꼭대기에만 닿는다. 곧 \(\mathrm{A}\)와 \(\mathrm{B}\)는 이웃한 두 봉우리의 꼭대기이고, \(x\)좌표 차가 주기 \(\frac{2}{b}\)만큼이다.`
    },
{
      id: "2022-09-11", exam: "2022-09", no: 11, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "적분식을 미분해 도함수 얻기",
      body: R`다항함수 \(f(x)\)가 모든 실수 \(x\)에 대하여
        \[xf(x)=2x^{3}+ax^{2}+3a+\int_{1}^{x}f(t)\,dt\]
        를 만족시킨다. \(f(1)=\displaystyle\int_{0}^{1}f(t)\,dt\)일 때, \(a+f(3)\)의 값은?
        (단, \(a\)는 상수이다.)`,
      choices: [R`\(5\)`, R`\(6\)`, R`\(7\)`, R`\(8\)`, R`\(9\)`],
      answer: 4,
      help: R`양변을 \(x\)로 미분하면 \(f(x)+xf'(x)=6x^{2}+2ax+f(x)\)가 되어 \(f(x)\)가 지워지고 \(f'(x)=6x+2a\)만 남는다. 그리고 원래 식에 \(x=1\)을 넣으면 적분이 \(0\)이 되어 \(f(1)\)이 바로 나온다.`
    },
{
      id: "2022-09-12", exam: "2022-09", no: 12, score: 4,
      units: ["m1-trig"], memo: "원에 내접하는 사각형의 마주 보는 각",
      body: R`반지름의 길이가 \(2\sqrt{7}\)인 원에 내접하고 \(\angle\mathrm{A}=\dfrac{\pi}{3}\)인
        삼각형 \(\mathrm{ABC}\)가 있다. 점 \(\mathrm{A}\)를 포함하지 않는 호 \(\mathrm{BC}\) 위의 점 \(\mathrm{D}\)에
        대하여 \(\sin(\angle\mathrm{BCD})=\dfrac{2\sqrt{7}}{7}\)일 때, \(\overline{\mathrm{BD}}+\overline{\mathrm{CD}}\)의 값은?`,
      figure: "2022-09-12.webp",
      choices: [R`\(\dfrac{19}{2}\)`, R`\(10\)`, R`\(\dfrac{21}{2}\)`, R`\(11\)`, R`\(\dfrac{23}{2}\)`],
      answer: 2,
      help: R`사각형 \(\mathrm{ABDC}\)가 원에 내접하므로 마주 보는 두 각의 합이 \(\pi\)라 \(\angle\mathrm{BDC}=\pi-\frac{\pi}{3}=\frac{2}{3}\pi\)다. 그리고 \(\overline{\mathrm{BC}}=2R\sin A\)로 곧바로 구해지니, 삼각형 \(\mathrm{BCD}\)에서 코사인법칙을 쓰면 \(\overline{\mathrm{BD}}+\overline{\mathrm{CD}}\)를 구할 식이 선다.`
    },
{
      id: "2022-09-13", exam: "2022-09", no: 13, score: 4,
      units: ["m1-seq"], memo: "절댓값이 같은 두 항이 있을 조건",
      body: R`첫째항이 \(-45\)이고 공차가 \(d\)인 등차수열 \(\{a_{n}\}\)이 다음 조건을
        만족시키도록 하는 모든 자연수 \(d\)의 값의 합은?`,
      note: [
        R`(가) \(\bigl|a_{m}\bigr|=\bigl|a_{m+3}\bigr|\)인 자연수 \(m\)이 존재한다.`,
        R`(나) 모든 자연수 \(n\)에 대하여 \(\displaystyle\sum_{k=1}^{n}a_{k}>-100\)이다.`
      ],
      choices: [R`\(44\)`, R`\(48\)`, R`\(52\)`, R`\(56\)`, R`\(60\)`],
      answer: 2,
      help: R`공차가 \(0\)이 아니므로 \(\bigl|a_{m}\bigr|=\bigl|a_{m+3}\bigr|\)는 \(a_{m}=-a_{m+3}\), 곧 \(2a_{m}+3d=0\)이라는 뜻이다. 여기에 \(a_{m}=-45+(m-1)d\)를 넣으면 \(d\)와 \(m\)의 관계식이 하나 나오고, 자연수라는 조건이 후보를 크게 줄인다.`
    },
{
      id: "2022-09-14", exam: "2022-09", no: 14, score: 4,
      units: ["m2-diff"], memo: "같은 삼차함수를 두 방향으로 옮겨 이어 붙이기",
      body: R`최고차항의 계수가 \(1\)이고 \(f'(0)=f'(2)=0\)인
        삼차함수 \(f(x)\)와 양수 \(p\)에 대하여 함수 \(g(x)\)를
        \[g(x)=\begin{cases}f(x)-f(0) &amp; (x\le 0)\\ f(x+p)-f(p) &amp; (x>0)\end{cases}\]
        이라 하자. &lt;보기&gt;에서 옳은 것만을 있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(p=1\)일 때, \(g'(1)=0\)이다.`,
        R`ㄴ. \(g(x)\)가 실수 전체의 집합에서 미분가능하도록 하는 양수 \(p\)의 개수는 \(1\)이다.`,
        R`ㄷ. \(p\ge 2\)일 때, \(\displaystyle\int_{-1}^{1}g(x)\,dx\ge 0\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 5,
      help: R`\(f'(0)=f'(2)=0\)이고 최고차항이 \(1\)이므로 \(f'(x)=3x(x-2)\), 곧 \(f\)가 상수항만 빼고 정해진다. 그리고 \(g\)는 \(x\le 0\)에서는 \(f\)를 아래로 옮긴 것, \(x>0\)에서는 \(f\)를 왼쪽으로 \(p\)만큼 민 뒤 아래로 옮긴 것이라 \(g(0)=0\)에서 이어진다.`
    },
{
      id: "2022-09-15", exam: "2022-09", no: 15, score: 4,
      units: ["m1-seq"], memo: "구간마다 기울기가 갈리는 점화식",
      body: R`수열 \(\{a_{n}\}\)은 \(\bigl|a_{1}\bigr|\le 1\)이고, 모든 자연수 \(n\)에 대하여
        \[a_{n+1}=\begin{cases}-2a_{n}-2 &amp; \left(-1\le a_{n}&lt;-\dfrac{1}{2}\right)\\[6pt] 2a_{n} &amp; \left(-\dfrac{1}{2}\le a_{n}\le\dfrac{1}{2}\right)\\[6pt] -2a_{n}+2 &amp; \left(\dfrac{1}{2}&lt;a_{n}\le 1\right)\end{cases}\]
        을 만족시킨다. \(a_{5}+a_{6}=0\)이고 \(\displaystyle\sum_{k=1}^{5}a_{k}>0\)이 되도록 하는
        모든 \(a_{1}\)의 값의 합은?`,
      choices: [R`\(\dfrac{9}{2}\)`, R`\(5\)`, R`\(\dfrac{11}{2}\)`, R`\(6\)`, R`\(\dfrac{13}{2}\)`],
      answer: 1,
      help: R`세 규칙 모두 기울기가 \(\pm 2\)인 일차식이고, 어느 쪽을 쓰든 \(\bigl|a_{n+1}\bigr|\le 1\)이 그대로 유지된다. \(a_{5}+a_{6}=0\)에서 거꾸로 거슬러 올라가되, 한 걸음마다 어느 구간에 있었는지에 따라 갈래가 둘씩 생긴다.`
    },
{
      id: "2022-09-20", exam: "2022-09", no: 20, score: 4,
      units: ["m2-diff"], memo: "절댓값을 벗기면 두 갈래가 되는 방정식",
      body: R`함수 \(f(x)=\dfrac{1}{2}x^{3}-\dfrac{9}{2}x^{2}+10x\)에 대하여 \(x\)에 대한 방정식
        \[f(x)+\bigl|f(x)+x\bigr|=6x+k\]
        의 서로 다른 실근의 개수가 \(4\)가 되도록 하는 모든 정수 \(k\)의
        값의 합을 구하시오.`,
      short: true,
      answer: 21,
      help: R`절댓값을 벗기면 \(f(x)+x\ge 0\)일 때는 \(2f(x)+x=6x+k\), 곧 \(2f(x)=5x+k\)이고, \(f(x)+x&lt;0\)일 때는 \(-x=6x+k\), 곧 \(x=-\frac{k}{7}\)로 값이 하나뿐이다. 두 경우를 갈라 각각 몇 개의 근이 나오는지 세면 된다.`
    },
{
      id: "2022-09-21", exam: "2022-09", no: 21, score: 4,
      units: ["m1-explog"], memo: "직선 y=x-1에 대칭인 두 곡선",
      body: R`\(a>1\)인 실수 \(a\)에 대하여 직선 \(y=-x+4\)가 두 곡선
        \[y=a^{\,x-1},\qquad y=\log_{a}(x-1)\]
        과 만나는 점을 각각 \(\mathrm{A}\), \(\mathrm{B}\)라 하고, 곡선 \(y=a^{\,x-1}\)이 \(y\)축과
        만나는 점을 \(\mathrm{C}\)라 하자. \(\overline{\mathrm{AB}}=2\sqrt{2}\)일 때, 삼각형 \(\mathrm{ABC}\)의
        넓이는 \(S\)이다. \(50\times S\)의 값을 구하시오.`,
      figure: "2022-09-21.webp",
      short: true,
      answer: 192,
      help: R`두 곡선은 직선 \(y=x-1\)에 대하여 서로 대칭이다. \(y=a^{\,x-1}\) 위의 점 \(\bigl(p,\,a^{\,p-1}\bigr)\)을 그 직선에 대하여 대칭이동하면 \(\bigl(a^{\,p-1}+1,\,p-1\bigr)\)이 되는데, 이 점이 \(y=\log_{a}(x-1)\) 위에 있기 때문이다. 그리고 직선 \(y=-x+4\)는 \(y=x-1\)에 수직이므로 \(\mathrm{A}\)와 \(\mathrm{B}\)도 그 직선에 대하여 대칭이다.`
    },
{
      id: "2022-09-22", exam: "2022-09", no: 22, score: 4,
      units: ["m2-diff"], memo: "절댓값이 꺾이는 자리에서만 끊기는 극한",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)에 대하여 함수
        \[g(x)=f(x-3)\times\lim_{h\to 0+}\frac{\bigl|f(x+h)\bigr|-\bigl|f(x-h)\bigr|}{h}\]
        가 다음 조건을 만족시킬 때, \(f(5)\)의 값을 구하시오.`,
      note: [
        R`(가) 함수 \(g(x)\)는 실수 전체의 집합에서 연속이다.`,
        R`(나) 방정식 \(g(x)=0\)은 서로 다른 네 실근 \(\alpha_{1}\), \(\alpha_{2}\), \(\alpha_{3}\), \(\alpha_{4}\)를 갖고 \(\alpha_{1}+\alpha_{2}+\alpha_{3}+\alpha_{4}=7\)이다.`
      ],
      short: true,
      answer: 108,
      help: R`극한 부분은 \(f(x)\ne 0\)인 자리에서는 \(2\bigl(|f|\bigr)'(x)\)와 같다. 그런데 \(f\)의 단순근에서는 좌우가 같은 크기로 올라와 차가 \(0\)이 되므로 값이 뚝 떨어진다. 곧 이 극한은 \(|f|\)가 꺾이는 자리마다 끊기고, (가)의 연속 조건이 \(f(x-3)\)의 근으로 그 끊김을 덮으라는 뜻이 된다.`
    },
{
      id: "2022-09-prob-28", exam: "2022-09", no: 28, score: 4,
      units: ["prob-count"], memo: "배수 조건과 부등식을 만족시키는 함수의 개수",
      body: R`집합 \(X=\{1, 2, 3, 4, 5, 6\}\)에 대하여 다음 조건을 만족시키는 함수 \(f\colon X\to X\)의 개수는?`,
      noteTitle: "조 건",
      note: [
        R`(가) \(f(3)+f(4)\)는 \(5\)의 배수이다.`,
        R`(나) \(f(1) &lt; f(3)\)이고 \(f(2) &lt; f(3)\)이다.`,
        R`(다) \(f(4) &lt; f(5)\)이고 \(f(4) &lt; f(6)\)이다.`
      ],
      choices: [R`\(384\)`, R`\(394\)`, R`\(404\)`, R`\(414\)`, R`\(424\)`],
      answer: 4,
      help: R`\(f(3)+f(4)\)가 5의 배수이므로 그 합은 5 또는 10이다. 순서쌍 \((f(3), f(4))\)로 가능한 모든 경우에 대해, \(f(1), f(2)\)는 \(f(3)-1\)개의 값 중 중복 허용 선택(\((f(3)-1)^2\)), \(f(5), f(6)\)은 \(6-f(4)\)개의 값 중 중복 허용 선택(\((6-f(4))^2\))이므로 각각 곱하여 모두 합산한다.`
    },
{
      id: "2022-09-prob-29", exam: "2022-09", no: 29, score: 4,
      units: ["prob-stat"], memo: "대칭 확률분포와 분산의 관계",
      body: R`두 이산확률변수 \(X, Y\)의 확률분포를 표로 나타내면 각각 다음과 같다.
\(\mathrm{V}(X)=\dfrac{31}{5}\)일 때, \(10\times\mathrm{V}(Y)\)의 값을 구하시오.`,
      figure: "2022-09-prob-29.webp",
      short: true,
      answer: 78,
      help: R`확률변수 \(X\)와 \(Y\)는 모두 \(5\)에 대하여 대칭이므로 \(\mathrm{E}(X)=\mathrm{E}(Y)=5\)이다. \(\mathrm{V}(Y) - \mathrm{V}(X) = \mathrm{E}(Y^2) - \mathrm{E}(X^2)\)를 계산하면 \(b, c\)가 상쇄되고 \((1^2+9^2)\times\dfrac{1}{20} - 5^2\times\dfrac{1}{10} = \dfrac{82}{20} - \dfrac{50}{20} = \dfrac{32}{20} = \dfrac{8}{5}\)만큼 늘어나므로 \(\mathrm{V}(Y) = \dfrac{31}{5} + \dfrac{8}{5} = \dfrac{39}{5}\)에서 \(10\mathrm{V}(Y)=78\)이다.`
    },
{
      id: "2022-09-prob-30", exam: "2022-09", no: 30, score: 4,
      units: ["prob-count"], memo: "사인펜 분배와 짝수 조건 (중복조합 및 포함배제)",
      body: R`네 명의 학생 \(\mathrm{A}\), \(\mathrm{B}\), \(\mathrm{C}\), \(\mathrm{D}\)에게 같은 종류의 사인펜 \(14\)개를 다음 규칙에 따라 남김없이 나누어 주는 경우의 수를 구하시오.`,
      noteTitle: "규 칙",
      note: [
        R`(가) 각 학생은 \(1\)개 이상의 사인펜을 받는다.`,
        R`(나) 각 학생이 받는 사인펜의 개수는 \(9\) 이하이다.`,
        R`(다) 적어도 한 학생은 짝수 개의 사인펜을 받는다.`
      ],
      short: true,
      answer: 218,
      help: R`각 학생이 1개 이상 9개 이하를 받으므로 치환 후 전체 해는 \({}_{4}\mathrm{H}_{10} - 4\times{}_{4}\mathrm{H}_{1} = 286 - 16 = 270\)이다. 조건 (다)의 여사건은 '네 학생 모두 홀수 개의 사인펜을 받는 경우'이므로 각 학생에게 \(2x_i+1\)개를 배분하여 \(x_1+x_2+x_3+x_4=5\) (\(0\le x_i\le 4\))의 해의 개수 \({}_{4}\mathrm{H}_{5}-4 = 56-4=52\)를 빼서 \(270-52=218\)을 구한다.`
    },
{
      id: "2022-09-calc-28", exam: "2022-09", no: 28, score: 4,
      units: ["calc-integ", "calc-diff"], memo: "삼각함수의 정적분과 두 점 사이의 거리",
      body: R`좌표평면에서 원점을 중심으로 하고 반지름의 길이가 \(2\)인 원 \(C\)와 두 점 \(\mathrm{A}(2,\,0)\), \(\mathrm{B}(0,\,-2)\)가 있다. 원 \(C\) 위에 있고 \(x\)좌표가 음수인 점 \(\mathrm{P}\)에 대하여 \(\angle\mathrm{PAB}=\theta\)라 하자. 점 \(\mathrm{Q}(0,\,2\cos\theta)\)에서 직선 \(\mathrm{BP}\)에 내린 수선의 발을 \(\mathrm{R}\)라 하고, 두 점 \(\mathrm{P}\)와 \(\mathrm{R}\) 사이의 거리를 \(f(\theta)\)라 할 때, \[\int_{\frac{\pi}{6}}^{\frac{\pi}{3}}f(\theta)\,d\theta\]의 값은?`,
      figure: "2022-09-calc-28.webp",
      choices: [R`\(\dfrac{2\sqrt{3}-3}{2}\)`, R`\(\sqrt{3}-1\)`, R`\(\dfrac{3\sqrt{3}-3}{2}\)`, R`\(\dfrac{2\sqrt{3}-1}{2}\)`, R`\(\dfrac{4\sqrt{3}-3}{2}\)`],
      answer: 1,
      help: R`선분 \(\mathrm{AB}\)에 대한 원주각을 활용하여 직선 \(\mathrm{BP}\)의 방정식을 세웁니다. 점 \(\mathrm{Q}\)에서 직선 \(\mathrm{BP}\)에 내린 수선의 발 \(\mathrm{R}\)의 위치를 파악하여 \(f(\theta)\)를 삼각함수 식으로 나타낸 후 정적분합니다.`
    },
{
      id: "2022-09-calc-29", exam: "2022-09", no: 29, score: 4,
      units: ["calc-diff"], memo: "합성함수의 최대와 최소",
      body: R`이차함수 \(f(x)\)에 대하여 함수 \(g(x)=\{f(x)+2\}e^{f(x)}\)이 다음 조건을 만족시킨다.`,
      note: [
        R`\(f(a)=6\)인 \(a\)에 대하여 \(g(x)\)는 \(x=a\)에서 최댓값을 갖는다.`,
        R`\(g(x)\)는 \(x=b\), \(x=b+6\)에서 최솟값을 갖는다.`
      ],
            bodyAfter: R`방정식 \(f(x)=0\)의 서로 다른 두 실근을 \(\alpha\), \(\beta\)라 할 때, \((\alpha-\beta)^{2}\)의 값을 구하시오. (단, \(a\), \(b\)는 실수이다.)`,
short: true,
      answer: 24,
      help: R`함수 \(h(t)=(t+2)e^t\)의 도함수 \(h'(t)=(t+3)e^t\)를 분석하여 \(t=-3\)에서 극소이자 최소임을 파악합니다. \(g(x)=h(f(x))\)의 최솟값이 두 점 \(x=b, b+6\)에서 나타나므로 이차함수 \(f(x)\)의 대칭성과 꼭짓점 좌표를 결정합니다.`
    },
{
      id: "2022-09-calc-30", exam: "2022-09", no: 30, score: 4,
      units: ["calc-integ", "calc-diff"], memo: "삼각함수의 극한과 연속함수의 정적분",
      body: R`최고차항의 계수가 \(9\)인 삼차함수 \(f(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`\(\displaystyle\lim_{x\to 0}\dfrac{\sin(\pi\times f(x))}{x}=0\)`,
        R`\(f(x)\)의 극댓값과 극솟값의 곱은 \(5\)이다.`
      ],
            bodyAfter: R`함수 \(g(x)\)는 \(0\le x&lt;1\)일 때 \(g(x)=f(x)\)이고 모든 실수 \(x\)에 대하여 \(g(x+1)=g(x)\)이다. \(g(x)\)가 실수 전체의 집합에서 연속일 때, \(\displaystyle\int_{0}^{5}xg(x)\,dx=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
short: true,
      answer: 107,
      help: R`조건 (가)의 극한에서 \(f(0)\)이 정수이고 \(f'(0)=0\)임을 유도합니다. 연속 조건 \(f(0)=f(1)\) 및 극값의 곱 조건을 조합하여 삼차함수 \(f(x)\)를 구하고, 주기성을 활용하여 \(\int_0^5 xg(x)\,dx\)를 계산합니다.`
    },
{
      id: "2022-09-geom-28", exam: "2022-09", no: 28, score: 4,
      units: ["geom-curve"], memo: "타원의 접선과 초점을 지나는 평행선, 삼각형의 둘레의 길이",
      body: R`그림과 같이 두 점 \(\mathrm{F}(c, 0), \mathrm{F}'(-c, 0)\) (\(c > 0\))을 초점으로 하는 타원 \(\dfrac{x^2}{16}+\dfrac{y^2}{12}=1\) 위의 점 \(\mathrm{P}(2, 3)\)에서 타원에 접하는 직선을 \(l\)이라 하자. 점 \(\mathrm{F}\)를 지나고 \(l\)과 평행한 직선이 타원과 만나는 점 중 제\(2\)사분면 위에 있는 점을 \(\mathrm{Q}\)라 하자. 두 직선 \(\mathrm{F}'\mathrm{Q}\)와 \(l\)이 만나는 점을 \(\mathrm{R}\), \(l\)과 \(x\)축이 만나는 점을 \(\mathrm{S}\)라 할 때, 삼각형 \(\mathrm{SRF}'\)의 둘레의 길이는?`,
      figure: "2022-09-geom-28.webp",
      choices: [R`\(30\)`, R`\(31\)`, R`\(32\)`, R`\(33\)`, R`\(34\)`],
      answer: 1,
      help: R`타원의 장축 길이는 \(2a=8\), 초점은 \(c=\sqrt{16-12}=2\)이므로 \(\mathrm{F}(2, 0), \mathrm{F}'(-2, 0)\)이다. 점 \(\mathrm{P}(2, 3)\)에서의 접선 방정식은 \(\dfrac{2x}{16}+\dfrac{3y}{12}=1\implies x+2y=8\)이며 \(\mathrm{S}(8, 0)\)이다. 타원의 광학적 성질 및 평행선과 닮음을 활용하여 삼각형 \(\mathrm{SRF}'\)의 각 변의 길이를 구하여 둘레를 완성한다.`
    },
{
      id: "2022-09-geom-29", exam: "2022-09", no: 29, score: 4,
      units: ["geom-space"], memo: "종이접기 입체도형과 삼수선의 정리, 두 평면이 이루는 각",
      body: R`그림과 같이 한 변의 길이가 \(8\)인 정사각형 \(\mathrm{ABCD}\)에 두 선분 \(\mathrm{AB}, \mathrm{CD}\)를 각각 지름으로 하는 두 반원이 붙어 있는 모양의 종이가 있다. 반원의 호 \(\mathrm{AB}\)의 삼등분점 중 점 \(\mathrm{B}\)에 가까운 점을 \(\mathrm{P}\)라 하고, 반원의 호 \(\mathrm{CD}\)를 이등분하는 점을 \(\mathrm{Q}\)라 하자. 이 종이에서 두 선분 \(\mathrm{AB}\)와 \(\mathrm{CD}\)를 접는 선으로 하여 두 반원을 접어 올렸을 때 두 점 \(\mathrm{P}, \mathrm{Q}\)에서 평면 \(\mathrm{ABCD}\)에 내린 수선의 발을 각각 \(\mathrm{G}, \mathrm{H}\)라 하면 두 점 \(\mathrm{G}, \mathrm{H}\)는 정사각형 \(\mathrm{ABCD}\)의 내부에 놓여 있고, \(\overline{\mathrm{PG}}=\sqrt{3}, \overline{\mathrm{QH}}=2\sqrt{3}\)이다. 두 평면 \(\mathrm{PCQ}\)와 \(\mathrm{ABCD}\)가 이루는 각의 크기가 \(\theta\)일 때, \(70\times\cos^2\theta\)의 값을 구하시오. (단, 종이의 두께는 고려하지 않는다.)`,
      figure: "2022-09-geom-29.webp",
      short: true,
      answer: 40,
      help: R`반원의 반지름은 \(4\)이다. 접어 올린 각도를 \(\overline{\mathrm{PG}}=\sqrt{3}, \overline{\mathrm{QH}}=2\sqrt{3}\)으로부터 구하여 세 점 \(\mathrm{P}, \mathrm{C}, \mathrm{Q}\)의 3차원 공간좌표를 설정한다. 평면 \(\mathrm{PCQ}\)의 법선벡터를 구하고 바닥 평면(법선벡터 \((0,0,1)\))과의 사잇각 \(\theta\)의 코사인값을 계산한다.`
    },
{
      id: "2022-09-geom-30", exam: "2022-09", no: 30, score: 4,
      units: ["geom-vector"], memo: "원 위의 점의 내적 최소 조건과 선분 위의 점의 거리 제곱 최댓값",
      body: R`좌표평면에서 세 점 \(\mathrm{A}(-3, 1), \mathrm{B}(0, 2), \mathrm{C}(1, 0)\)에 대하여 두 점 \(\mathrm{P}, \mathrm{Q}\)가
\[|\vec{\mathrm{AP}}|=1, \quad |\vec{\mathrm{BQ}}|=2, \quad \vec{\mathrm{AP}}\cdot\vec{\mathrm{OC}}\ge \dfrac{\sqrt{2}}{2}\]
를 만족시킬 때, \(\vec{\mathrm{AP}}\cdot\vec{\mathrm{AQ}}\)의 값이 최소가 되도록 하는 두 점 \(\mathrm{P}, \mathrm{Q}\)를 각각 \(\mathrm{P}_0, \mathrm{Q}_0\)이라 하자. 선분 \(\mathrm{AP}_0\) 위의 점 \(\mathrm{X}\)에 대하여 \(\vec{\mathrm{BX}}\cdot\vec{\mathrm{BQ}}_0\ge 1\)일 때, \(|\vec{\mathrm{Q}_0\mathrm{X}}|^2\)의 최댓값은 \(\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이고, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 45,
      help: R`\(\vec{\mathrm{AP}}\cdot\vec{\mathrm{AQ}}=\vec{\mathrm{AP}}\cdot(\vec{\mathrm{AB}}+\vec{\mathrm{BQ}})=\vec{\mathrm{AP}}\cdot\vec{\mathrm{AB}}+\vec{\mathrm{AP}}\cdot\vec{\mathrm{BQ}}\)이다. \(\vec{\mathrm{BQ}}\)를 \(\vec{\mathrm{AP}}\)의 반대 방향으로 잡고 코사인 조건 내에서 최소가 되는 방향을 결정하여 \(\mathrm{P}_0, \mathrm{Q}_0\)의 위치를 확정한다. 선분 \(\mathrm{AP}_0\) 상의 점 \(\mathrm{X}\)의 조건부 범위에서 \(|\vec{\mathrm{Q}_0\mathrm{X}}|^2\)의 최댓값을 계산한다.`
    }
  ];
})();
