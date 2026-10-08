(function () {
  "use strict";
  const R = String.raw;
  // 2022-06 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2022-06"] = [
{
      id: "2022-06-9", exam: "2022-06", no: 9, score: 4,
      units: ["m1-seq"], memo: "네 걸음마다 되풀이되는 수열",
      body: R`수열 \(\{a_{n}\}\)이 모든 자연수 \(n\)에 대하여
        \[a_{n+1}=\begin{cases}\dfrac{1}{a_{n}} &amp; \left(n\text{이 홀수인 경우}\right)\\[8pt] 8a_{n} &amp; \left(n\text{이 짝수인 경우}\right)\end{cases}\]
        이고 \(a_{12}=\dfrac{1}{2}\)일 때, \(a_{1}+a_{4}\)의 값은?`,
      choices: [R`\(\dfrac{3}{4}\)`, R`\(\dfrac{9}{4}\)`, R`\(\dfrac{5}{2}\)`, R`\(\dfrac{17}{4}\)`, R`\(\dfrac{9}{2}\)`],
      answer: 5,
      help: R`네 걸음을 직접 밟아 보면 \(a_{5}=a_{1}\)이 되어 수열이 주기 \(4\)로 되풀이된다. 그러니 \(a_{12}\)는 \(a_{4}\)와 같고, \(a_{4}=\frac{a_{1}}{8}\)이다.`
    },
{
      id: "2022-06-10", exam: "2022-06", no: 10, score: 4,
      units: ["m1-explog"], memo: "로그를 한쪽으로 모으기",
      body: R`\(n\ge 2\)인 자연수 \(n\)에 대하여 두 곡선
        \[y=\log_{n}x,\qquad y=-\log_{n}(x+3)+1\]
        이 만나는 점의 \(x\)좌표가 \(1\)보다 크고 \(2\)보다 작도록 하는
        모든 \(n\)의 값의 합은?`,
      choices: [R`\(30\)`, R`\(35\)`, R`\(40\)`, R`\(45\)`, R`\(50\)`],
      answer: 2,
      help: R`두 식을 같게 놓고 로그를 한쪽으로 모으면 \(\log_{n}\bigl(x(x+3)\bigr)=1\), 곧 \(x(x+3)=n\)이 된다. 그러니 \(1&lt;x&lt;2\)를 \(x(x+3)\)의 범위로 옮기기만 하면 \(n\)의 범위가 그대로 나온다.`
    },
{
      id: "2022-06-11", exam: "2022-06", no: 11, score: 4,
      units: ["m2-integ"], memo: "주기가 2인 함수의 넓은 구간 적분",
      body: R`닫힌구간 \([0,\,1]\)에서 연속인 함수 \(f(x)\)가
        \[f(0)=0,\quad f(1)=1,\quad \int_{0}^{1}f(x)\,dx=\frac{1}{6}\]
        을 만족시킨다. 실수 전체의 집합에서 정의된 함수 \(g(x)\)가
        다음 조건을 만족시킬 때, \(\displaystyle\int_{-3}^{2}g(x)\,dx\)의 값은?`,
      note: [
        R`(가) \(g(x)=\begin{cases}-f(x+1)+1 &amp; (-1&lt;x&lt;0)\\ f(x) &amp; (0\le x\le 1)\end{cases}\)`,
        R`(나) 모든 실수 \(x\)에 대하여 \(g(x+2)=g(x)\)이다.`
      ],
      choices: [R`\(\dfrac{5}{2}\)`, R`\(\dfrac{17}{6}\)`, R`\(\dfrac{19}{6}\)`, R`\(\dfrac{7}{2}\)`, R`\(\dfrac{23}{6}\)`],
      answer: 2,
      help: R`(나)는 주기가 \(2\)라는 뜻이라 \(\int_{-3}^{2}\)를 길이 \(2\)짜리 구간 여럿과 나머지로 쪼갤 수 있다. 그리고 (가)의 \(-1&lt;x&lt;0\)쪽 식은 \(f\)를 뒤집어 옮긴 것이라, 그 구간의 적분이 \(\int_{0}^{1}f\)로 바뀐다.`
    },
{
      id: "2022-06-12", exam: "2022-06", no: 12, score: 4,
      units: ["m1-trig"], memo: "같은 각이 만드는 닮은 삼각형 둘",
      body: R`그림과 같이 \(\overline{\mathrm{AB}}=4\), \(\overline{\mathrm{AC}}=5\)이고 \(\cos(\angle\mathrm{BAC})=\dfrac{1}{8}\)인
        삼각형 \(\mathrm{ABC}\)가 있다. 선분 \(\mathrm{AC}\) 위의 점 \(\mathrm{D}\)와 선분 \(\mathrm{BC}\) 위의
        점 \(\mathrm{E}\)에 대하여
        \[\angle\mathrm{BAC}=\angle\mathrm{BDA}=\angle\mathrm{BED}\]
        일 때, 선분 \(\mathrm{DE}\)의 길이는?`,
      figure: "2022-06-12.webp",
      choices: [R`\(\dfrac{7}{3}\)`, R`\(\dfrac{5}{2}\)`, R`\(\dfrac{8}{3}\)`, R`\(\dfrac{17}{6}\)`, R`\(3\)`],
      answer: 3,
      help: R`\(\angle\mathrm{BAC}=\angle\mathrm{BDA}\)이고 두 삼각형이 각 \(\mathrm{B}\)를 함께 쓰므로 삼각형 \(\mathrm{ABC}\)와 \(\mathrm{DBA}\)가 닮음이다. 같은 방식으로 \(\angle\mathrm{BAC}=\angle\mathrm{BED}\)에서 삼각형 \(\mathrm{ABC}\)와 \(\mathrm{EBD}\)도 닮음이다. 닮음비를 차례로 이어 붙이면 \(\overline{\mathrm{DE}}\)가 나온다.`
    },
{
      id: "2022-06-13", exam: "2022-06", no: 13, score: 4,
      units: ["m1-seq"], memo: "제곱수에서만 값이 달라지는 합",
      body: R`실수 전체의 집합에서 정의된 함수 \(f(x)\)가 구간 \((0,\,1]\)에서
        \[f(x)=\begin{cases}3 &amp; (0&lt;x&lt;1)\\ 1 &amp; (x=1)\end{cases}\]
        이고, 모든 실수 \(x\)에 대하여 \(f(x+1)=f(x)\)를 만족시킨다.
        \(\displaystyle\sum_{k=1}^{20}\frac{k\times f\bigl(\sqrt{k}\,\bigr)}{3}\)의 값은?`,
      choices: [R`\(150\)`, R`\(160\)`, R`\(170\)`, R`\(180\)`, R`\(190\)`],
      answer: 5,
      help: R`\(f\)는 주기가 \(1\)이므로 \(f(\sqrt{k})\)는 \(\sqrt{k}\)가 정수일 때만 \(f(1)=1\)이고, 그 밖에는 모두 \(3\)이다. 곧 \(1\)부터 \(20\)까지 가운데 제곱수인 \(1,\,4,\,9,\,16\) 넷만 따로 세면 된다.`
    },
{
      id: "2022-06-14", exam: "2022-06", no: 14, score: 4,
      units: ["m2-limit", "m2-diff"], memo: "절댓값을 x로 나눌 때 생기는 부호 뒤집힘",
      body: R`두 양수 \(p\), \(q\)와 함수 \(f(x)=x^{3}-3x^{2}-9x-12\)에 대하여
        실수 전체의 집합에서 연속인 함수 \(g(x)\)가 다음 조건을
        만족시킬 때, \(p+q\)의 값은?`,
      note: [
        R`(가) 모든 실수 \(x\)에 대하여 \(xg(x)=\bigl|xf(x-p)+qx\bigr|\)이다.`,
        R`(나) 함수 \(g(x)\)가 \(x=a\)에서 미분가능하지 않은 실수 \(a\)의 개수는 \(1\)이다.`
      ],
      choices: [R`\(6\)`, R`\(7\)`, R`\(8\)`, R`\(9\)`, R`\(10\)`],
      answer: 3,
      help: R`오른쪽을 \(\bigl|x\bigr|\times\bigl|f(x-p)+q\bigr|\)로 묶으면, \(x>0\)에서는 \(g(x)=\bigl|f(x-p)+q\bigr|\)이지만 \(x&lt;0\)에서는 부호가 뒤집혀 \(g(x)=-\bigl|f(x-p)+q\bigr|\)가 된다. \(g\)가 \(x=0\)에서 연속이려면 좌우 극한이 같아야 하므로 그 자리의 값이 \(0\), 곧 \(f(-p)+q=0\)이어야 한다.`
    },
{
      id: "2022-06-15", exam: "2022-06", no: 15, score: 4,
      units: ["m1-trig"], memo: "사인과 코사인의 근을 합쳐 양 끝 고르기",
      body: R`\(-1\le t\le 1\)인 실수 \(t\)에 대하여 \(x\)에 대한 방정식
        \[\left(\sin\frac{\pi x}{2}-t\right)\left(\cos\frac{\pi x}{2}-t\right)=0\]
        의 실근 중에서 집합 \(\{x\mid 0\le x&lt;4\}\)에 속하는 가장 작은 값을
        \(\alpha(t)\), 가장 큰 값을 \(\beta(t)\)라 하자. &lt;보기&gt;에서 옳은 것만을
        있는 대로 고른 것은?`,
      noteTitle: "보 기",
      note: [
        R`ㄱ. \(-1\le t&lt;0\)인 모든 실수 \(t\)에 대하여 \(\alpha(t)+\beta(t)=5\)이다.`,
        R`ㄴ. \(\bigl\{t\mid\beta(t)-\alpha(t)=\beta(0)-\alpha(0)\bigr\}=\left\{t\ \middle|\ 0\le t\le\dfrac{\sqrt{2}}{2}\right\}\)`,
        R`ㄷ. \(\alpha(t_{1})=\alpha(t_{2})\)인 두 실수 \(t_{1}\), \(t_{2}\)에 대하여 \(t_{2}-t_{1}=\dfrac{1}{2}\)이면 \(t_{1}\times t_{2}=\dfrac{1}{3}\)이다.`
      ],
      choices: [R`ㄱ`, R`ㄱ, ㄴ`, R`ㄱ, ㄷ`, R`ㄴ, ㄷ`, R`ㄱ, ㄴ, ㄷ`],
      answer: 2,
      help: R`곱이 \(0\)이니 방정식이 \(\sin\frac{\pi x}{2}=t\)와 \(\cos\frac{\pi x}{2}=t\) 둘로 갈린다. 두 곡선 모두 주기가 \(4\)라 \([0,\,4)\)에 근이 각각 둘씩 있고, \(\alpha(t)\)와 \(\beta(t)\)는 그 넷 가운데 가장 작은 것과 가장 큰 것이다.`
    },
{
      id: "2022-06-20", exam: "2022-06", no: 20, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "적분 밖으로 뺄 수 있는 것 가려내기",
      body: R`실수 \(a\)와 함수 \(f(x)=x^{3}-12x^{2}+45x+3\)에 대하여 함수
        \[g(x)=\int_{a}^{x}\bigl\{f(x)-f(t)\bigr\}\times\bigl\{f(t)\bigr\}^{4}\,dt\]
        가 오직 하나의 극값을 갖도록 하는 모든 \(a\)의 값의 합을
        구하시오.`,
      short: true,
      answer: 8,
      help: R`적분 안에서 \(f(x)\)는 \(t\)에 대하여 상수이므로 밖으로 뺄 수 있다. 그러면 \(g(x)=f(x)\int_{a}^{x}\{f(t)\}^{4}dt-\int_{a}^{x}f(t)\{f(t)\}^{4}dt\)가 되고, 미분하면 뒷항이 앞항의 일부와 지워져 \(g'(x)=f'(x)\int_{a}^{x}\{f(t)\}^{4}dt\)만 남는다.`
    },
{
      id: "2022-06-21", exam: "2022-06", no: 21, score: 4,
      units: ["m1-explog"], memo: "거듭제곱 방정식의 실근 개수와 중근",
      body: R`다음 조건을 만족시키는 최고차항의 계수가 \(1\)인 이차함수
        \(f(x)\)가 존재하도록 하는 모든 자연수 \(n\)의 값의 합을 구하시오.`,
      note: [
        R`(가) \(x\)에 대한 방정식 \(\bigl(x^{n}-64\bigr)f(x)=0\)은 서로 다른 두 실근을 갖고, 각각의 실근은 중근이다.`,
        R`(나) 함수 \(f(x)\)의 최솟값은 음의 정수이다.`
      ],
      short: true,
      answer: 24,
      help: R`\(x^{n}=64\)의 실근은 \(n\)이 홀수면 \(64^{1/n}\) 하나뿐이고, 짝수면 \(\pm 64^{1/n}\) 둘이다. 전체 방정식이 "서로 다른 두 실근이고 각각 중근"이 되려면 \(f\)의 근이 그 근들과 어떻게 겹쳐야 하는지를 경우마다 따져야 한다.`
    },
{
      id: "2022-06-22", exam: "2022-06", no: 22, score: 4,
      units: ["m2-diff"], memo: "합성한 방정식의 근을 원래 근으로 되돌리기",
      body: R`삼차함수 \(f(x)\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 방정식 \(f(x)=0\)의 서로 다른 실근의 개수는 \(2\)이다.`,
        R`(나) 방정식 \(f\bigl(x-f(x)\bigr)=0\)의 서로 다른 실근의 개수는 \(3\)이다.`
      ],
      bodyAfter: R`\(f(1)=4\), \(f'(1)=1\), \(f'(0)>1\)일 때, \(f(0)=\dfrac{q}{p}\)이다. \(p+q\)의
        값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 61,
      help: R`(나)의 \(f\bigl(x-f(x)\bigr)=0\)은 \(x-f(x)\)가 \(f\)의 근이라는 뜻이다. (가)에서 \(f\)의 근은 둘뿐이니 그 값을 \(\alpha\), \(\beta\)라 하면, \(x-f(x)=\alpha\)와 \(x-f(x)=\beta\) 두 방정식의 근을 합쳐 셋이어야 한다.`
    },
{
      id: "2022-06-prob-28", exam: "2022-06", no: 28, score: 4,
      units: ["prob-count"], memo: "주사위 점수 합의 순서쌍 개수 (중복조합)",
      body: R`한 개의 주사위를 한 번 던져 나온 눈의 수가 \(3\) 이하이면 나온 눈의 수를 점수로 얻고, 나온 눈의 수가 \(4\) 이상이면 \(0\)점을 얻는다. 이 주사위를 네 번 던져 나온 눈의 수를 차례로 \(a\), \(b\), \(c\), \(d\)라 할 때, 얻은 네 점수의 합이 \(4\)가 되는 모든 순서쌍 \((a, b, c, d)\)의 개수는?`,
      choices: [R`\(187\)`, R`\(190\)`, R`\(193\)`, R`\(196\)`, R`\(199\)`],
      answer: 5,
      help: R`네 점수의 합이 4가 되는 분할은 (3, 1, 0, 0), (2, 2, 0, 0), (2, 1, 1, 0), (1, 1, 1, 1)이다. 각 0점에 해당하는 주사위 눈은 \(\{4, 5, 6\}\)의 3가지이고, 1, 2, 3점은 각각 1가지씩이므로 각 분할별 순열 및 눈의 경우의 수를 곱하여 합산한다.`
    },
{
      id: "2022-06-prob-29", exam: "2022-06", no: 29, score: 4,
      units: ["prob-count"], memo: "원순열과 이웃 조건 (포함배제)",
      body: R`\(1\)부터 \(6\)까지의 자연수가 하나씩 적혀 있는 \(6\)개의 의자가 있다. 이 \(6\)개의 의자를 일정한 간격을 두고 원형으로 배열할 때, 서로 이웃한 \(2\)개의 의자에 적혀 있는 수의 곱이 \(12\)가 되지 않도록 배열하는 경우의 수를 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.)`,
      short: true,
      answer: 48,
      help: R`곱이 12가 되는 이웃 쌍은 \(\{2, 6\}\)과 \(\{3, 4\}\)이다. 전체 원순열의 개수는 \((6-1)! = 120\)이다. \(\{2, 6\}\)이 이웃하는 경우, \(\{3, 4\}\)가 이웃하는 경우를 각각 구하고 둘 다 동시에 이웃하는 경우를 포함배제의 원리로 처리하여 전체에서 차감한다.`
    },
{
      id: "2022-06-prob-30", exam: "2022-06", no: 30, score: 4,
      units: ["prob-prob"], memo: "복원추출 수의 곱이 6의 배수일 확률 (여사건)",
      body: R`숫자 \(1\), \(2\), \(3\)이 하나씩 적혀 있는 \(3\)개의 공이 들어 있는 주머니가 있다. 이 주머니에서 임의로 한 개의 공을 꺼내어 공에 적혀 있는 수를 확인한 후 다시 넣는 시행을 한다. 이 시행을 \(5\)번 반복하여 확인한 \(5\)개의 수의 곱이 \(6\)의 배수일 확률이 \(\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 47,
      help: R`곱이 6의 배수가 되려면 5개의 수 중에 2와 3이 적어도 한 번씩 나와야 한다. 여사건은 '2가 한 번도 나오지 않음(1, 3만 나옴: \(2^5\))' 또는 '3이 한 번도 나오지 않음(1, 2만 나옴: \(2^5\))'이다. 두 사건의 교집합(1만 나옴: \(1^5\))을 빼면 여사건의 경우의 수는 \(32+32-1=63\)이고 전체 \(3^5=243\)에서 \(1-\dfrac{63}{243} = \dfrac{180}{243} = \dfrac{20}{27}\)이 되어 \(p+q=47\)이다.`
    },
{
      id: "2022-06-calc-28", exam: "2022-06", no: 28, score: 4,
      units: ["calc-diff"], memo: "삼각함수의 극한과 부채꼴",
      body: R`그림과 같이 길이가 \(2\)인 선분 \(\mathrm{AB}\)를 지름으로 하는 반원의 호 \(\mathrm{AB}\) 위에 점 \(\mathrm{P}\)가 있다. 선분 \(\mathrm{AB}\)의 중점을 \(\mathrm{O}\)라 할 때, 점 \(\mathrm{B}\)를 지나고 선분 \(\mathrm{AB}\)에 수직인 직선이 직선 \(\mathrm{OP}\)와 만나는 점을 \(\mathrm{Q}\)라 하고, \(\angle\mathrm{OQB}\)의 이등분선이 직선 \(\mathrm{AP}\)와 만나는 점을 \(\mathrm{R}\)라 하자. \(\angle\mathrm{OAP}=\theta\)일 때, 삼각형 \(\mathrm{OAP}\)의 넓이를 \(f(\theta)\), 삼각형 \(\mathrm{PQR}\)의 넓이를 \(g(\theta)\)라 하자. \[\lim_{\theta\to 0+}\dfrac{g(\theta)}{\theta^{4}\times f(\theta)}\]의 값은? (단, \(0&lt;\theta&lt;\dfrac{\pi}{4}\))`,
      figure: "2022-06-calc-28.webp",
      choices: [R`\(2\)`, R`\(\dfrac{5}{2}\)`, R`\(3\)`, R`\(\dfrac{7}{2}\)`, R`\(4\)`],
      answer: 1,
      help: R`이등변삼각형 \(\mathrm{OAP}\)에서 중심각은 \(2\theta\)이므로 \(f(\theta)=\frac{1}{2}\sin 2\theta\)입니다. 직각삼각형 \(\mathrm{OBQ}\)에서 \(\overline{\mathrm{OQ}}=\sec 2\theta\)이고 각의 이등분선 정리로 \(\overline{\mathrm{PR}}\)의 길이를 구하여 \(g(\theta)\)의 극한을 계산합니다.`
    },
{
      id: "2022-06-calc-29", exam: "2022-06", no: 29, score: 4,
      units: ["calc-diff"], memo: "음함수 미분법과 극대 조건",
      body: R`\(t>2e\)인 실수 \(t\)에 대하여 함수 \(f(x)=t(\ln x)^{2}-x^{2}\)이 \(x=k\)에서 극대일 때, 실수 \(k\)의 값을 \(g(t)\)라 하면 \(g(t)\)는 미분가능한 함수이다. \(g(\alpha)=e^{2}\)인 실수 \(\alpha\)에 대하여 \(\alpha\times\{g'(\alpha)\}^{2}=\dfrac{q}{p}\)일 때, \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 17,
      help: R`\(f'(x)=\frac{2t\ln x}{x}-2x=0\)에서 \(t\ln k=k^2\) 관계식을 얻고, 이를 \(t\ln g(t)=\{g(t)\}^2\)으로 둡니다. 양변을 \(t\)에 대해 미분하여 \(g'(\alpha)\)의 값을 구합니다.`
    },
{
      id: "2022-06-calc-30", exam: "2022-06", no: 30, score: 4,
      units: ["calc-diff"], memo: "두 점 사이의 거리와 합성함수 미분",
      body: R`\(t>\dfrac{1}{2}\ln 2\)인 실수 \(t\)에 대하여 곡선 \(y=\ln(1+e^{2x}-e^{-2t})\)과 직선 \(y=x+t\)가 만나는 서로 다른 두 점 사이의 거리를 \(f(t)\)라 할 때, \(f'(\ln 2)=\dfrac{q}{p}\sqrt{2}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 11,
      help: R`곡선과 직선을 연립하여 \(e^{2x}-e^t e^x+(1-e^{-2t})=0\)에서 근과 계수의 관계를 세웁니다. 기울기가 \(1\)인 직선 위의 두 점 사이 거리는 \(f(t)=\sqrt{2}(\beta-\alpha)\)이므로 \(e^\beta-e^\alpha\)를 \(t\)의 식으로 나타내어 미분합니다.`
    },
{
      id: "2022-06-geom-28", exam: "2022-06", no: 28, score: 4,
      units: ["geom-curve"], memo: "타원의 꼭짓점을 중심으로 하는 원과 초점 및 꼭짓점의 교점 관계",
      body: R`두 초점이 \(\mathrm{F}, \mathrm{F}'\)이고 장축의 길이가 \(2a\)인 타원이 있다. 이 타원의 한 꼭짓점을 중심으로 하고 반지름의 길이가 \(1\)인 원이 이 타원의 서로 다른 두 꼭짓점과 한 초점을 지날 때, 상수 \(a\)의 값은?`,
      figure: "2022-06-geom-28.webp",
      choices: [R`\(\dfrac{\sqrt{2}}{2}\)`, R`\(\dfrac{\sqrt{6}-1}{2}\)`, R`\(\sqrt{3}-1\)`, R`\(2\sqrt{2}-2\)`, R`\(\dfrac{\sqrt{3}}{2}\)`],
      answer: 3,
      help: R`원의 중심이 타원의 단축 꼭짓점 \((0, b)\)일 때, 원이 장축 꼭짓점 \((a, 0), (-a, 0)\)과 초점 \((c, 0)\)을 지나므로 피타고라스 정리로 \(a^2+b^2=1\) 및 초점 조건 \(b^2+c^2=1\)과 타원 정의 \(a^2-b^2=c^2\)을 연립하여 \(a\)를 구한다.`
    },
{
      id: "2022-06-geom-29", exam: "2022-06", no: 29, score: 4,
      units: ["geom-curve"], memo: "두 포물선의 정의와 공통 직선 위의 두 점 사이 거리",
      body: R`포물선 \(y^2=8x\)와 직선 \(y=2x-4\)가 만나는 점 중 제\(1\)사분면 위에 있는 점을 \(\mathrm{A}\)라 하자. 양수 \(a\)에 대하여 포물선 \((y-2a)^2=8(x-a)\)가 점 \(\mathrm{A}\)를 지날 때, 직선 \(y=2x-4\)와 포물선 \((y-2a)^2=8(x-a)\)가 만나는 점 중 \(\mathrm{A}\)가 아닌 점을 \(\mathrm{B}\)라 하자. 두 점 \(\mathrm{A}, \mathrm{B}\)에서 직선 \(x=-2\)에 내린 수선의 발을 각각 \(\mathrm{C}, \mathrm{D}\)라 할 때, \(\overline{\mathrm{AC}}+\overline{\mathrm{BD}}-\overline{\mathrm{AB}}=k\)이다. \(k^2\)의 값을 구하시오.`,
      figure: "2022-06-geom-29.webp",
      short: true,
      answer: 80,
      help: R`\(y^2=8x\)와 \(y=2x-4\)를 연립하여 \(\mathrm{A}(8, 12)\)를 구한다. 점 \(\mathrm{A}\)를 대입하여 \(a=6\)을 얻고 두 번째 포물선의 방정식을 확정하여 점 \(\mathrm{B}\)의 좌표를 구한다. 준선 \(x=-2\) 및 평행이동된 준선과의 거리 관계를 포물선의 정의로 연결하여 \(k\)를 계산하고 \(k^2\)을 구한다.`
    },
{
      id: "2022-06-geom-30", exam: "2022-06", no: 30, score: 4,
      units: ["geom-vector"], memo: "정사각형 변 위의 두 점의 수직/평행 조건과 고정점과의 내적 최대·최소",
      body: R`좌표평면 위의 네 점 \(\mathrm{A}(2, 0), \mathrm{B}(0, 2), \mathrm{C}(-2, 0), \mathrm{D}(0, -2)\)를 꼭짓점으로 하는 정사각형 \(\mathrm{ABCD}\)의 네 변 위의 두 점 \(\mathrm{P}, \mathrm{Q}\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \((\vec{\mathrm{PQ}}\cdot\vec{\mathrm{AB}})(\vec{\mathrm{PQ}}\cdot\vec{\mathrm{AD}})=0\)`,
        R`(나) \(\vec{\mathrm{OA}}\cdot\vec{\mathrm{OP}}\ge -2\)이고 \(\vec{\mathrm{OB}}\cdot\vec{\mathrm{OP}}\ge 0\)이다.`,
        R`(다) \(\vec{\mathrm{OA}}\cdot\vec{\mathrm{OQ}}\ge -2\)이고 \(\vec{\mathrm{OB}}\cdot\vec{\mathrm{OQ}}\le 0\)이다.`
      ],
            bodyAfter: R`점 \(\mathrm{R}(4, 4)\)에 대하여 \(\vec{\mathrm{RP}}\cdot\vec{\mathrm{RQ}}\)의 최댓값을 \(M\), 최솟값을 \(m\)이라 할 때, \(M+m\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이다.)`,
short: true,
      answer: 48,
      help: R`조건 (나), (다)에 의해 점 \(\mathrm{P}\)는 정사각형의 위쪽 반, 점 \(\mathrm{Q}\)는 아래쪽 반 경계에 놓인다. 조건 (가)는 선분 \(\mathrm{PQ}\)가 변 \(\mathrm{AB}\) 또는 \(\mathrm{AD}\)에 수직(즉 변에 평행)함을 뜻한다. 점 \(\mathrm{R}(4, 4)\)로부터의 벡터 내적 \(\vec{\mathrm{RP}}\cdot\vec{\mathrm{RQ}}\)의 최대점과 최소점 배치를 기하학적으로 찾아 \(M+m\)을 계산한다.`
    }
  ];
})();
