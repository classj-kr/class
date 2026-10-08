(function () {
  "use strict";
  const R = String.raw;
  // 2024-suneung 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2024-suneung"] = [
{
      id: "2024-suneung-9", exam: "2024-suneung", no: 9, score: 4,
      units: ["m1-explog"], memo: "로그값 두 개 사이의 내분점",
      body: R`수직선 위의 두 점 \(\mathrm{P}\bigl(\log_{5}3\bigr)\), \(\mathrm{Q}\bigl(\log_{5}12\bigr)\)에 대하여
        선분 \(\mathrm{PQ}\)를 \(m:(1-m)\)으로 내분하는 점의 좌표가 \(1\)일 때,
        \(4^{m}\)의 값은? (단, \(m\)은 \(0&lt;m&lt;1\)인 상수이다.)`,
      choices: [R`\(\dfrac{7}{6}\)`, R`\(\dfrac{4}{3}\)`, R`\(\dfrac{3}{2}\)`, R`\(\dfrac{5}{3}\)`, R`\(\dfrac{11}{6}\)`],
      answer: 4,
      help: R`내분점의 좌표는 \(\log_{5}3+m\left(\log_{5}12-\log_{5}3\right)=\log_{5}3+m\log_{5}4\)다. 이것이 \(1\)이라는 조건에서 \(m\log_{5}4=\log_{5}\frac{5}{3}\)가 나오고, 구하는 것이 \(4^{m}\)이라 \(m=\log_{4}\frac{5}{3}\)만 있으면 끝난다.`
    },
{
      id: "2024-suneung-10", exam: "2024-suneung", no: 10, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "두 점 사이 거리가 늘고 주는 자리",
      body: R`시각 \(t=0\)일 때 동시에 원점을 출발하여 수직선 위를
        움직이는 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의 시각 \(t\,(t\ge 0)\)에서의 속도가 각각
        \[v_{1}(t)=t^{2}-6t+5,\qquad v_{2}(t)=2t-7\]
        이다. 시각 \(t\)에서의 두 점 \(\mathrm{P}\), \(\mathrm{Q}\) 사이의 거리를 \(f(t)\)라 할 때,
        함수 \(f(t)\)는 구간 \([0,\,a]\)에서 증가하고, 구간 \([a,\,b]\)에서
        감소하고, 구간 \([b,\,\infty)\)에서 증가한다. 시각 \(t=a\)에서
        \(t=b\)까지 점 \(\mathrm{Q}\)가 움직인 거리는? (단, \(0&lt;a&lt;b\))`,
      choices: [R`\(\dfrac{15}{2}\)`, R`\(\dfrac{17}{2}\)`, R`\(\dfrac{19}{2}\)`, R`\(\dfrac{21}{2}\)`, R`\(\dfrac{23}{2}\)`],
      answer: 2,
      help: R`두 점 사이의 거리는 위치의 차의 절댓값이고, 그 차를 \(h(t)\)라 하면 \(h'(t)=v_{1}-v_{2}=(t-2)(t-6)\)이다. 곧 \(a=2\), \(b=6\)이 곧바로 나온다. 움직인 거리는 \(\int_{2}^{6}\bigl|v_{2}\bigr|dt\)이므로 \(v_{2}=0\)이 되는 \(t=\frac{7}{2}\)에서 구간을 끊어야 한다.`
    },
{
      id: "2024-suneung-11", exam: "2024-suneung", no: 11, score: 4,
      units: ["m1-seq"], memo: "가운데 항이 0인 등차수열",
      body: R`공차가 \(0\)이 아닌 등차수열 \(\{a_{n}\}\)에 대하여
        \[\bigl|a_{6}\bigr|=a_{8},\qquad \sum_{k=1}^{5}\frac{1}{a_{k}a_{k+1}}=\frac{5}{96}\]
        일 때, \(\displaystyle\sum_{k=1}^{15}a_{k}\)의 값은?`,
      choices: [R`\(60\)`, R`\(65\)`, R`\(70\)`, R`\(75\)`, R`\(80\)`],
      answer: 1,
      help: R`공차가 \(0\)이 아니므로 \(|a_{6}|=a_{8}\)은 \(a_{6}=-a_{8}\), 곧 \(a_{7}=0\)이라는 뜻이다. 그러면 \(a_{n}=(n-7)d\)로 쓸 수 있고, \(\frac{1}{a_{k}a_{k+1}}\)이 \(\frac{1}{d^{2}}\left(\frac{1}{k-7}-\frac{1}{k-6}\right)\)로 갈라져 합이 접힌다.`
    },
{
      id: "2024-suneung-12", exam: "2024-suneung", no: 12, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "곡선을 직선으로 갈아 끼운 넓이의 최댓값",
      body: R`함수 \(f(x)=\dfrac{1}{9}x(x-6)(x-9)\)와 실수 \(t\,(0&lt;t&lt;6)\)에 대하여
        함수 \(g(x)\)는
        \[g(x)=\begin{cases}f(x) &amp; (x&lt;t)\\ -(x-t)+f(t) &amp; (x\ge t)\end{cases}\]
        이다. 함수 \(y=g(x)\)의 그래프와 \(x\)축으로 둘러싸인 영역의
        넓이의 최댓값은?`,
      choices: [R`\(\dfrac{125}{4}\)`, R`\(\dfrac{127}{4}\)`, R`\(\dfrac{129}{4}\)`, R`\(\dfrac{131}{4}\)`, R`\(\dfrac{133}{4}\)`],
      answer: 3,
      help: R`\(x\ge t\)에서 \(g\)는 점 \(\bigl(t,\,f(t)\bigr)\)를 지나고 기울기가 \(-1\)인 직선이다. 그러니 넓이는 \(t\)까지의 곡선 부분과 그 뒤 직선이 만드는 삼각형의 합이고, \(t\)에 대한 식으로 쓴 뒤 미분하면 최댓값이 나온다.`
    },
{
      id: "2024-suneung-13", exam: "2024-suneung", no: 13, score: 4,
      units: ["m1-trig"], memo: "대각선을 함께 쓰는 두 삼각형",
      body: R`그림과 같이
        \[\overline{\mathrm{AB}}=3,\quad \overline{\mathrm{BC}}=\sqrt{13},\quad \overline{\mathrm{AD}}\times\overline{\mathrm{CD}}=9,\quad \angle\mathrm{BAC}=\frac{\pi}{3}\]
        인 사각형 \(\mathrm{ABCD}\)가 있다. 삼각형 \(\mathrm{ABC}\)의 넓이를 \(S_{1}\),
        삼각형 \(\mathrm{ACD}\)의 넓이를 \(S_{2}\)라 하고, 삼각형 \(\mathrm{ACD}\)의 외접원의
        반지름의 길이를 \(R\)이라 하자. \(S_{2}=\dfrac{5}{6}S_{1}\)일 때,
        \(\dfrac{R}{\sin(\angle\mathrm{ADC})}\)의 값은?`,
      figure: "2024-suneung-13.webp",
      choices: [R`\(\dfrac{54}{25}\)`, R`\(\dfrac{117}{50}\)`, R`\(\dfrac{63}{25}\)`, R`\(\dfrac{27}{10}\)`, R`\(\dfrac{72}{25}\)`],
      answer: 1,
      help: R`두 삼각형은 대각선 \(\mathrm{AC}\)를 함께 쓴다. 코사인법칙으로 \(\overline{\mathrm{AC}}=4\)가 먼저 나오고, \(S_{2}=\frac{1}{2}\overline{\mathrm{AD}}\times\overline{\mathrm{CD}}\times\sin(\angle\mathrm{ADC})\)에 \(\overline{\mathrm{AD}}\times\overline{\mathrm{CD}}=9\)를 그대로 넣을 수 있다. 그리고 사인법칙에서 \(R=\frac{\overline{\mathrm{AC}}}{2\sin(\angle\mathrm{ADC})}\)다.`
    },
{
      id: "2024-suneung-14", exam: "2024-suneung", no: 14, score: 4,
      units: ["m2-diff"], memo: "가로선과 만나는 점의 개수가 뛰는 자리",
      body: R`두 자연수 \(a\), \(b\)에 대하여 함수 \(f(x)\)는
        \[f(x)=\begin{cases}2x^{3}-6x+1 &amp; (x\le 2)\\ a(x-2)(x-b)+9 &amp; (x>2)\end{cases}\]
        이다. 실수 \(t\)에 대하여 함수 \(y=f(x)\)의 그래프와 직선 \(y=t\)가
        만나는 점의 개수를 \(g(t)\)라 하자.
        \[g(k)+\lim_{t\to k-}g(t)+\lim_{t\to k+}g(t)=9\]
        를 만족시키는 실수 \(k\)의 개수가 \(1\)이 되도록 하는 두 자연수
        \(a\), \(b\)의 순서쌍 \((a,\,b)\)에 대하여 \(a+b\)의 최댓값은?`,
      choices: [R`\(51\)`, R`\(52\)`, R`\(53\)`, R`\(54\)`, R`\(55\)`],
      answer: 1,
      help: R`\(g(t)\)는 가로선 \(y=t\)가 그래프와 만나는 점의 개수라 \(t\)가 극값이나 끊어진 자리의 높이를 지날 때만 값이 뛴다. 그런 자리가 아니면 세 값이 모두 같아 합이 \(3\)의 배수가 되므로, 합이 \(9\)가 되는 \(k\)는 \(g(k)=3\)이면서 좌우 극한도 \(3\)인 자리이거나 값이 뛰는 자리다.`
    },
{
      id: "2024-suneung-15", exam: "2024-suneung", no: 15, score: 4,
      units: ["m1-seq"], memo: "홀짝에 따라 뛰거나 줄어드는 수열",
      body: R`첫째항이 자연수인 수열 \(\{a_{n}\}\)이 모든 자연수 \(n\)에 대하여
        \[a_{n+1}=\begin{cases}2^{a_{n}} &amp; \left(a_{n}\text{이 홀수인 경우}\right)\\[2pt] \dfrac{1}{2}a_{n} &amp; \left(a_{n}\text{이 짝수인 경우}\right)\end{cases}\]
        를 만족시킬 때, \(a_{6}+a_{7}=3\)이 되도록 하는 모든 \(a_{1}\)의 값의
        합은?`,
      choices: [R`\(139\)`, R`\(146\)`, R`\(153\)`, R`\(160\)`, R`\(167\)`],
      answer: 3,
      help: R`홀수를 만나면 \(2^{a_{n}}\)으로 껑충 뛰고 짝수를 만나면 반으로 준다. \(a_{6}+a_{7}=3\)은 두 항이 \(1\)과 \(2\)라는 뜻이므로 뒷부분이 매우 작다. 그러니 앞으로 밀지 말고 \(a_{6}\), \(a_{7}\)에서 거꾸로 거슬러 올라가며 각 자리에서 어느 규칙을 썼는지 갈라 보면 된다.`
    },
{
      id: "2024-suneung-20", exam: "2024-suneung", no: 20, score: 4,
      units: ["m2-diff"], memo: "두 접선이 수직이 되는 조건",
      body: R`\(a>\sqrt{2}\)인 실수 \(a\)에 대하여 함수 \(f(x)\)를
        \[f(x)=-x^{3}+ax^{2}+2x\]
        라 하자. 곡선 \(y=f(x)\) 위의 점 \(\mathrm{O}(0,\,0)\)에서의 접선이
        곡선 \(y=f(x)\)와 만나는 점 중 \(\mathrm{O}\)가 아닌 점을 \(\mathrm{A}\)라 하고,
        곡선 \(y=f(x)\) 위의 점 \(\mathrm{A}\)에서의 접선이 \(x\)축과 만나는 점을
        \(\mathrm{B}\)라 하자. 점 \(\mathrm{A}\)가 선분 \(\mathrm{OB}\)를 지름으로 하는 원 위의 점일 때,
        \(\overline{\mathrm{OA}}\times\overline{\mathrm{AB}}\)의 값을 구하시오.`,
      short: true,
      answer: 25,
      help: R`\(\mathrm{A}\)가 지름 \(\mathrm{OB}\) 위의 원에 있다는 것은 \(\angle\mathrm{OAB}=\frac{\pi}{2}\)라는 뜻이다. \(\mathrm{OA}\)는 원점에서 그은 접선이고 \(\mathrm{AB}\)는 \(\mathrm{A}\)에서의 접선이므로, 두 직선의 기울기의 곱이 \(-1\)이라는 식 하나가 \(a\)를 정해 준다.`
    },
{
      id: "2024-suneung-21", exam: "2024-suneung", no: 21, score: 4,
      units: ["m1-explog"], memo: "움직이는 창 안에서의 최댓값",
      body: R`양수 \(a\)에 대하여 \(x\ge -1\)에서 정의된 함수 \(f(x)\)는
        \[f(x)=\begin{cases}-x^{2}+6x &amp; (-1\le x&lt;6)\\ a\log_{4}(x-5) &amp; (x\ge 6)\end{cases}\]
        이다. \(t\ge 0\)인 실수 \(t\)에 대하여 닫힌구간 \([t-1,\,t+1]\)에서의
        \(f(x)\)의 최댓값을 \(g(t)\)라 하자. 구간 \([0,\,\infty)\)에서 함수 \(g(t)\)의
        최솟값이 \(5\)가 되도록 하는 양수 \(a\)의 최솟값을 구하시오.`,
      short: true,
      answer: 10,
      help: R`\(-x^{2}+6x\)는 \(x=3\)에서 최댓값 \(9\)이고, \(a\log_{4}(x-5)\)는 \(x=6\)에서 \(0\)으로 시작해 계속 커진다. 길이 \(2\)인 창을 오른쪽으로 밀면 최댓값은 처음엔 포물선 쪽에 붙어 있다가 어느 순간 로그 쪽으로 넘어간다. \(g\)가 가장 작아지는 곳은 그 넘어가기 직전, 창이 두 봉우리 사이 골짜기에 놓일 때다.`
    },
{
      id: "2024-suneung-22", exam: "2024-suneung", no: 22, score: 4,
      units: ["m2-diff"], memo: "부호가 바뀌는 정수 자리가 없을 조건",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)가 다음 조건을
        만족시킨다.`,
      note: [
        R`함수 \(f(x)\)에 대하여 \(f(k-1)f(k+1)&lt;0\)을 만족시키는 정수 \(k\)는 존재하지 않는다.`
      ],
      bodyAfter: R`\(f'\left(-\dfrac{1}{4}\right)=-\dfrac{1}{4}\), \(f'\left(\dfrac{1}{4}\right)&lt;0\)일 때, \(f(8)\)의 값을 구하시오.`,
      short: true,
      answer: 483,
      help: R`\(f(k-1)f(k+1)&lt;0\)인 정수 \(k\)가 없다는 것은, 어떤 정수 \(k\)를 잡아도 \(k-1\)과 \(k+1\)에서 \(f\)의 부호가 서로 다르지 않다는 뜻이다. 곧 \(f\)의 실근들이 길이 \(2\)인 구간 \([k-1,\,k+1]\)마다 부호를 뒤집지 못하도록 촘촘히 몰려 있어야 한다.`
    },
{
      id: "2024-suneung-prob-28", exam: "2024-suneung", no: 28, score: 4,
      units: ["prob-prob"], memo: "함숫값의 곱이 6의 배수인 조건부확률",
      body: R`두 집합 \(X=\{1, 2, 3, 4, 5\}\), \(Y=\{1, 2, 3, 4\}\)에 대하여 다음 조건을 만족시키는 \(X\)에서 \(Y\)로의 모든 함수 \(f\) 중에서 임의로 하나를 선택할 때, 이 함수 \(f\)의 치역이 \(Y\)일 확률은?`,
      noteTitle: "조 건",
      note: [
        R`\(f(1)\times f(2)\times f(3)\times f(4)\times f(5)\)의 값이 \(6\)의 배수이다.`
      ],
      choices: [R`\(\dfrac{3}{20}\)`, R`\(\dfrac{7}{40}\)`, R`\(\dfrac{1}{5}\)`, R`\(\dfrac{9}{40}\)`, R`\(\dfrac{1}{4}\)`],
      answer: 4,
      help: R`치역의 원소가 4개인 함수는 \(1, 2, 3, 4\)를 모두 포함하므로 함숫값의 곱은 항상 6의 배수가 되어 조건 (가)를 만족한다. 분모인 '함숫값의 곱이 6의 배수인 함수의 개수'는 전체 \(4^5\)에서 2의 배수가 없는 경우, 3의 배수가 없는 경우를 여사건과 포함배제로 구하여 분수를 완성한다.`
    },
{
      id: "2024-suneung-prob-29", exam: "2024-suneung", no: 29, score: 4,
      units: ["prob-count"], memo: "부등식 조건을 만족시키는 6 이하 자연수의 순서쌍 (중복조합)",
      body: R`다음 조건을 만족시키는 \(6\) 이하의 자연수 \(a\), \(b\), \(c\), \(d\)의 모든 순서쌍 \((a, b, c, d)\)의 개수를 구하시오.`,
      noteTitle: "조 건",
      note: [
        R`(가) \(a\le c\le d\)이고 \(b\le c\le d\)이다.`,
        R`(나) \(a\times b\times c\times d\)는 홀수이다.`
      ],
      short: true,
      answer: 196,
      help: R`네 수가 모두 홀수이므로 \(a, b, c, d\in\{1, 3, 5\}\)이다. \(c\)의 값(1, 3, 5)을 기준으로 분류하면, \(a, b\le c\)와 \(d\ge c\)가 서로 독립적으로 결정되므로 각각의 경우의 수를 곱하여 쉽게 합산할 수 있다.`
    },
{
      id: "2024-suneung-prob-30", exam: "2024-suneung", no: 30, score: 4,
      units: ["prob-stat"], memo: "정규분포의 구간 확률 최대화",
      body: R`양수 \(t\)에 대하여 확률변수 \(X\)가 정규분포 \(\mathrm{N}(1, t^2)\)을 따른다. \(\mathrm{P}(X\le 5t)\ge \dfrac{1}{2}\)이 되도록 하는 모든 양수 \(t\)에 대하여 \(\mathrm{P}(t^2-t+1\le X\le t^2+t+1)\)의 최댓값을 오른쪽 표준정규분포표를 이용하여 구한 값을 \(k\)라 하자. \(1000\times k\)의 값을 구하시오.`,
      figure: "2024-suneung-prob-30.webp",
      short: true,
      answer: 673,
      help: R`\(\mathrm{P}(X\le 5t)\ge \dfrac{1}{2}\)에서 \(5t\ge 1\implies t\ge \dfrac{1}{5}\)이다. 주어진 구간의 양 끝점을 표준화하면 \(Z\)의 구간은 \([t-1, t+1]\)로 구간의 길이가 \(2\)로 일정하다. 정규분포 곡선의 대칭성에 의해 구간이 원점 \(0\)을 포함하며 원점에 가장 가까울 때 확률이 최대가 되므로 \(t\)의 최적값을 찾아 계산한다.`
    },
{
      id: "2024-suneung-calc-28", exam: "2024-suneung", no: 28, score: 4,
      units: ["calc-integ"], memo: "역함수 관계식과 치환적분을 이용한 함수 결정",
      body: R`실수 전체의 집합에서 연속인 함수 \(f(x)\)가 모든 실수 \(x\)에 대하여 \(f(x)\ge 0\)이고, \(x&lt;0\)일 때 \(f(x)=-4xe^{4x^2}\)이다.
모든 양수 \(t\)에 대하여 \(x\)에 대한 방정식 \(f(x)=t\)의 서로 다른 실근의 개수는 \(2\)이고, 이 방정식의 두 실근 중 작은 값을 \(g(t)\), 큰 값을 \(h(t)\)라 하자.
두 함수 \(g(t)\), \(h(t)\)는 모든 양수 \(t\)에 대하여
\[2g(t)+h(t)=k\quad(k\text{는 상수})\]
를 만족시킨다. \(\displaystyle\int_{0}^{7} f(x)\,dx=e^4-1\)일 때, \(\dfrac{f(9)}{f(8)}\)의 값은?`,
      choices: [R`\(\dfrac{3}{2}e^5\)`, R`\(\dfrac{4}{3}e^7\)`, R`\(\dfrac{5}{4}e^9\)`, R`\(\dfrac{6}{5}e^{11}\)`, R`\(\dfrac{7}{6}e^{13}\)`],
      answer: 2,
      help: R`\(x&lt;0\)에서 \(g(t)\)를 알 때 \(h(t)=k-2g(t)\)를 통해 \(x>k\) 구간의 \(f(x)=2(x-k)e^{(x-k)^2}\)를 합성함수 형태로 구합니다. \(t\to 0+\)일 때 \(g(t)\to 0\)이므로 \(0\le x\le k\)에서 \(f(x)=0\)임을 파악하고, \(\int_k^7 f(x)dx=e^4-1\)에서 \(k=5\)를 결정하여 계산합니다.`
    },
{
      id: "2024-suneung-calc-29", exam: "2024-suneung", no: 29, score: 4,
      units: ["calc-seq"], memo: "등비급수의 수렴 조건과 연립 방정식",
      body: R`첫째항과 공비가 각각 \(0\)이 아닌 두 등비수열 \(\{a_n\}\), \(\{b_n\}\)에 대하여 두 급수 \(\displaystyle\sum_{n=1}^{\infty} a_n\), \(\displaystyle\sum_{n=1}^{\infty} b_n\)이 각각 수렴하고
\[\sum_{n=1}^{\infty} a_n b_n = \left(\sum_{n=1}^{\infty} a_n\right) \times \left(\sum_{n=1}^{\infty} b_n\right),\]
\[3\times\sum_{n=1}^{\infty} |a_{2n}| = 7\times\sum_{n=1}^{\infty} |a_{3n}|\]
이 성립한다. \(\displaystyle\sum_{n=1}^{\infty} \frac{b_{2n-1}+b_{3n+1}}{b_n} = S\)일 때, \(120S\)의 값을 구하시오.`,
      short: true,
      answer: 162,
      help: R`두 급수의 곱 공식과 곱의 급수 공식으로부터 \(r_a+r_b=2r_a r_b\) 관계식을 세웁니다. \(|a_{2n}|\)과 \(|a_{3n}|\)의 급수식에서 \(|r_a|=\dfrac{1}{2}\)을 얻고, \(r_a=\dfrac{1}{2}\)일 때의 모순을 배제하여 \(r_a=-\dfrac{1}{2}, r_b=\dfrac{1}{4}\)로 \(S\)를 정확히 계산합니다.`
    },
{
      id: "2024-suneung-calc-30", exam: "2024-suneung", no: 30, score: 4,
      units: ["calc-diff"], memo: "정적분으로 정의된 함수의 극값과 도함수의 극대·극소",
      body: R`실수 전체의 집합에서 미분가능한 함수 \(f(x)\)의 도함수 \(f'(x)\)가
\[f'(x) = |\sin x|\cos x\]
이다. 양수 \(a\)에 대하여 곡선 \(y=f(x)\) 위의 점 \((a, f(a))\)에서의 접선의 방정식을 \(y=g(x)\)라 하자. 함수
\[h(x) = \int_{0}^{x} \{f(t)-g(t)\}\,dt\]
가 \(x=a\)에서 극대 또는 극소가 되도록 하는 모든 양수 \(a\)를 작은 수부터 크기순으로 나열할 때, \(n\)번째 수를 \(a_n\)이라 하자.
\(\dfrac{100}{\pi} \times (a_6 - a_2)\)의 값을 구하시오.`,
      short: true,
      answer: 125,
      help: R`\(h'(x)=f(x)-g(x)\)가 \(x=a\)에서 부호를 바꾸려면 접선이 곡선을 관통해야 하므로, \(a\)는 도함수 \(f'(x)\)의 극대 또는 극소이어야 합니다. \(f'(x)=|\sin x|\cos x\)의 개형에서 삼각함수의 극값뿐 아니라 연결점인 정수\(\times\pi\)도 극값에 해당함을 주의하여 \(a_2=\dfrac{3\pi}{4}, a_6=2\pi\)를 구합니다.`
    },
{
      id: "2024-suneung-geom-28", exam: "2024-suneung", no: 28, score: 4,
      units: ["geom-space"], memo: "평면의 교선과 원·타원, 삼수선의 정리와 이면각",
      body: R`그림과 같이 서로 다른 두 평면 \(\alpha, \beta\)의 교선 위에 \(\overline{\mathrm{AB}}=18\)인 두 점 \(\mathrm{A}, \mathrm{B}\)가 있다. 선분 \(\mathrm{AB}\)를 지름으로 하는 원 \(C_1\)이 평면 \(\alpha\) 위에 있고, 선분 \(\mathrm{AB}\)를 장축으로 하고 두 점 \(\mathrm{F}, \mathrm{F}'\)을 초점으로 하는 타원 \(C_2\)가 평면 \(\beta\) 위에 있다.
원 \(C_1\) 위의 한 점 \(\mathrm{P}\)에서 평면 \(\beta\)에 내린 수선의 발을 \(\mathrm{H}\)라 할 때, \(\overline{\mathrm{HF}'} &lt; \overline{\mathrm{HF}}\)이고 \(\angle\mathrm{HFF}'=\dfrac{\pi}{6}\)이다. 직선 \(\mathrm{HF}\)와 타원 \(C_2\)가 만나는 점 중 점 \(\mathrm{H}\)와 가까운 점을 \(\mathrm{Q}\)라 하면, \(\overline{\mathrm{FH}} &lt; \overline{\mathrm{FQ}}\)이다.
점 \(\mathrm{H}\)를 중심으로 하고 점 \(\mathrm{Q}\)를 지나는 평면 \(\beta\) 위의 원은 반지름의 길이가 \(4\)이고 직선 \(\mathrm{AB}\)에 접한다. 두 평면 \(\alpha, \beta\)가 이루는 각의 크기를 \(\theta\)라 할 때, \(\cos\theta\)의 값은? (단, 점 \(\mathrm{P}\)는 평면 \(\beta\) 위에 있지 않다.)`,
      figure: "2024-suneung-geom-28.webp",
      choices: [R`\(\dfrac{2\sqrt{66}}{33}\)`, R`\(\dfrac{4\sqrt{69}}{69}\)`, R`\(\dfrac{\sqrt{2}}{3}\)`, R`\(\dfrac{4\sqrt{3}}{15}\)`, R`\(\dfrac{2\sqrt{78}}{39}\)`],
      answer: 5,
      help: R`원 \(C_1\)의 지름 \(18\), 타원 \(C_2\)의 장축 \(2a=18\)이다. 점 \(\mathrm{H}\)에서 직선 \(\mathrm{AB}\)에 접하므로 \(\mathrm{H}\)에서 \(\mathrm{AB}\)까지 거리가 \(4\)이다. 삼수선의 정리를 적용하여 점 \(\mathrm{P}\)의 위치와 높이 \(\overline{\mathrm{PH}}\)를 구하고, 이면각 공식 \(\cos\theta = \dfrac{\overline{\mathrm{HK}}}{\overline{\mathrm{PK}}}\)를 통해 코사인값을 산출한다.`
    },
{
      id: "2024-suneung-geom-29", exam: "2024-suneung", no: 29, score: 4,
      units: ["geom-curve"], memo: "쌍곡선의 정의와 이등변삼각형 조건, 둘레의 길이",
      body: R`양수 \(c\)에 대하여 두 점 \(\mathrm{F}(c, 0), \mathrm{F}'(-c, 0)\)을 초점으로 하고, 주축의 길이가 \(6\)인 쌍곡선이 있다. 이 쌍곡선 위에 다음 조건을 만족시키는 서로 다른 두 점 \(\mathrm{P}, \mathrm{Q}\)가 존재하도록 하는 모든 \(c\)의 값의 합을 구하시오.`,
      note: [
        R`(가) 점 \(\mathrm{P}\)는 제\(1\)사분면 위에 있고, 점 \(\mathrm{Q}\)는 직선 \(\mathrm{PF}'\) 위에 있다.`,
        R`(나) 삼각형 \(\mathrm{PF}'\mathrm{F}\)는 이등변삼각형이다.`,
        R`(다) 삼각형 \(\mathrm{PQF}\)의 둘레의 길이는 \(28\)이다.`
      ],
      short: true,
      answer: 11,
      help: R`쌍곡선 정의 \(\overline{\mathrm{PF}'}-\overline{\mathrm{PF}}=6\)이다. \(\triangle \mathrm{PF}'\mathrm{F}\)가 이등변삼각형인 경우는 \(\overline{\mathrm{PF}}=\overline{\mathrm{FF}'}=2c\)인 경우와 \(\overline{\mathrm{PF}'}=\overline{\mathrm{FF}'}=2c\)인 경우로 나뉜다. 점 \(\mathrm{Q}\)가 쌍곡선 위에 있으므로 쌍곡선 정의를 \(\mathrm{Q}\)에도 적용하여 둘레의 길이 조건 \(28\)을 만족시키는 \(c\) 값들을 각각 구하여 합산한다.`
    },
{
      id: "2024-suneung-geom-30", exam: "2024-suneung", no: 30, score: 4,
      units: ["geom-vector"], memo: "정삼각형 내분점 중심의 단위원 위의 점과 벡터 합 최대",
      body: R`좌표평면에 한 변의 길이가 \(4\)인 정삼각형 \(\mathrm{ABC}\)가 있다. 선분 \(\mathrm{AB}\)를 \(1:3\)으로 내분하는 점을 \(\mathrm{D}\), 선분 \(\mathrm{BC}\)를 \(1:3\)으로 내분하는 점을 \(\mathrm{E}\), 선분 \(\mathrm{CA}\)를 \(1:3\)으로 내분하는 점을 \(\mathrm{F}\)라 하자. 네 점 \(\mathrm{P}, \mathrm{Q}, \mathrm{R}, \mathrm{X}\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(|\vec{\mathrm{DP}}|=|\vec{\mathrm{EQ}}|=|\vec{\mathrm{FR}}|=1\)`,
        R`(나) \(\vec{\mathrm{AX}}=\vec{\mathrm{PB}}+\vec{\mathrm{QC}}+\vec{\mathrm{RA}}\)`
      ],
            bodyAfter: R`\(|\vec{\mathrm{AX}}|\)의 값이 최대일 때, 삼각형 \(\mathrm{PQR}\)의 넓이를 \(S\)라 하자. \(16S^2\)의 값을 구하시오.`,
short: true,
      answer: 147,
      help: R`\(\vec{\mathrm{PB}}=\vec{\mathrm{DB}}-\vec{\mathrm{DP}}\) 등으로 분해하면 \(\vec{\mathrm{AX}}=(\vec{\mathrm{DB}}+\vec{\mathrm{EC}}+\vec{\mathrm{FA}})-(\vec{\mathrm{DP}}+\vec{\mathrm{EQ}}+\vec{\mathrm{FR}})\)이다. 상수 벡터와 크기 \(1\)인 세 벡터의 합이 최대가 되는 방향(반대 방향 정렬)을 결정한 뒤, 점 \(\mathrm{P}, \mathrm{Q}, \mathrm{R}\)의 좌표를 확정하여 삼각형 \(\mathrm{PQR}\)의 넓이 \(S\)를 구한다.`
    }
  ];
})();
