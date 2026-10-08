(function () {
  "use strict";
  const R = String.raw;
  // 2024-09 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2024-09"] = [
{
      id: "2024-09-9", exam: "2024-09", no: 9, score: 4,
      units: ["m1-trig"], memo: "사인을 코사인으로 바꿔 견주기",
      body: R`\(0\le x\le 2\pi\)일 때, 부등식
        \[\cos x\le\sin\frac{\pi}{7}\]
        을 만족시키는 모든 \(x\)의 값의 범위는 \(\alpha\le x\le\beta\)이다.
        \(\beta-\alpha\)의 값은?`,
      choices: [R`\(\dfrac{8}{7}\pi\)`, R`\(\dfrac{17}{14}\pi\)`, R`\(\dfrac{9}{7}\pi\)`, R`\(\dfrac{19}{14}\pi\)`, R`\(\dfrac{10}{7}\pi\)`],
      answer: 3,
      help: R`\(\sin\frac{\pi}{7}=\cos\left(\frac{\pi}{2}-\frac{\pi}{7}\right)=\cos\frac{5\pi}{14}\)로 바꾸면 양변이 모두 코사인이 되어, 부등식이 \(\cos x\le\cos\frac{5\pi}{14}\)가 된다.`
    },
{
      id: "2024-09-10", exam: "2024-09", no: 10, score: 4,
      units: ["m2-diff"], memo: "두 접선이 만나는 점",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)에 대하여
        곡선 \(y=f(x)\) 위의 점 \(\bigl(-2,\,f(-2)\bigr)\)에서의 접선과
        곡선 \(y=f(x)\) 위의 점 \((2,\,3)\)에서의 접선이
        점 \((1,\,3)\)에서 만날 때, \(f(0)\)의 값은?`,
      choices: [R`\(31\)`, R`\(33\)`, R`\(35\)`, R`\(37\)`, R`\(39\)`],
      answer: 3,
      help: R`점 \((2,\,3)\)이 곡선 위의 점이므로 \(f(2)=3\)이다. 그리고 두 접선이 만나는 점 \((1,\,3)\)은 \((2,\,3)\)과 \(y\)좌표가 같으므로, \((2,\,3)\)에서의 접선은 기울기가 \(0\)인 가로선 \(y=3\)이다. 곧 \(f'(2)=0\)이다.`
    },
{
      id: "2024-09-11", exam: "2024-09", no: 11, score: 4,
      units: ["m2-integ"], memo: "출발점이 다른 두 점 사이의 거리",
      body: R`두 점 \(\mathrm{P}\)와 \(\mathrm{Q}\)는 시각 \(t=0\)일 때 각각 점 \(\mathrm{A}(1)\)과 점 \(\mathrm{B}(8)\)에서
        출발하여 수직선 위를 움직인다. 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의 시각
        \(t\,(t\ge 0)\)에서의 속도는 각각
        \[v_{1}(t)=3t^{2}+4t-7,\qquad v_{2}(t)=2t+4\]
        이다. 출발한 시각부터 두 점 \(\mathrm{P}\), \(\mathrm{Q}\) 사이의 거리가 처음으로
        \(4\)가 될 때까지 점 \(\mathrm{P}\)가 움직인 거리는?`,
      choices: [R`\(10\)`, R`\(14\)`, R`\(19\)`, R`\(25\)`, R`\(32\)`],
      answer: 5,
      help: R`출발점이 다르므로 위치는 \(x_{1}=1+\int_{0}^{t}v_{1}\), \(x_{2}=8+\int_{0}^{t}v_{2}\)다. 처음 거리가 \(7\)인데 \(\mathrm{P}\)는 \(v_{1}(0)=-7\)로 뒤로 밀리므로 사이가 더 벌어졌다가 좁아진다. 그래서 \(x_{1}-x_{2}=-4\)가 되는 때를 찾아야 하고, 움직인 거리는 \(v_{1}=0\)이 되는 \(t=1\)에서 끊어 더한다.`
    },
{
      id: "2024-09-12", exam: "2024-09", no: 12, score: 4,
      units: ["m1-seq"], memo: "홀짝으로 갈리는 점화식 거꾸로 세기",
      body: R`첫째항이 자연수인 수열 \(\{a_{n}\}\)이 모든 자연수 \(n\)에 대하여
        \[a_{n+1}=\begin{cases}a_{n}+1 &amp; \left(a_{n}\text{이 홀수인 경우}\right)\\[2pt] \dfrac{1}{2}a_{n} &amp; \left(a_{n}\text{이 짝수인 경우}\right)\end{cases}\]
        를 만족시킬 때, \(a_{2}+a_{4}=40\)이 되도록 하는 모든 \(a_{1}\)의 값의
        합은?`,
      choices: [R`\(172\)`, R`\(175\)`, R`\(178\)`, R`\(181\)`, R`\(184\)`],
      answer: 1,
      help: R`홀수를 만나면 \(+1\)로 짝수가 되고, 짝수를 만나면 반으로 준다. 곧 값이 커지는 일이 거의 없어 \(a_{2}+a_{4}=40\)은 앞쪽 항이 꽤 크다는 뜻이다. \(a_{1}\)의 홀짝에 따라 \(a_{2}\)가 갈리므로 두 갈래로 나눠 거꾸로 세면 된다.`
    },
{
      id: "2024-09-13", exam: "2024-09", no: 13, score: 4,
      units: ["m2-diff"], memo: "꺾인 함수가 감소하다 증가할 조건",
      body: R`두 실수 \(a\), \(b\)에 대하여 함수
        \[f(x)=\begin{cases}-\dfrac{1}{3}x^{3}-ax^{2}-bx &amp; (x&lt;0)\\[6pt] \dfrac{1}{3}x^{3}+ax^{2}-bx &amp; (x\ge 0)\end{cases}\]
        이 구간 \((-\infty,\,-1]\)에서 감소하고 구간 \([-1,\,\infty)\)에서 증가할 때,
        \(a+b\)의 최댓값을 \(M\), 최솟값을 \(m\)이라 하자. \(M-m\)의 값은?`,
      choices: [R`\(\dfrac{3}{2}+3\sqrt{2}\)`, R`\(3+3\sqrt{2}\)`, R`\(\dfrac{9}{2}+3\sqrt{2}\)`, R`\(6+3\sqrt{2}\)`, R`\(\dfrac{15}{2}+3\sqrt{2}\)`],
      answer: 3,
      help: R`\(x\ge 0\)에서 \(f'(x)=x^{2}+2ax-b\), \(x&lt;0\)에서 \(f'(x)=-x^{2}-2ax-b\)다. \(x=-1\)을 경계로 감소가 증가로 딱 한 번 바뀌어야 하므로, 왼쪽 조각은 \(x=-1\)에서만 부호가 바뀌고 오른쪽 조각은 \(x\ge 0\) 내내 \(0\) 이상이어야 한다.`
    },
{
      id: "2024-09-14", exam: "2024-09", no: 14, score: 4,
      units: ["m1-explog"], memo: "치역 안의 정수를 세는 조건",
      body: R`두 자연수 \(a\), \(b\)에 대하여 함수
        \[f(x)=\begin{cases}2^{\,x+a}+b &amp; (x\le -8)\\ -3^{\,x-3}+8 &amp; (x>-8)\end{cases}\]
        이 다음 조건을 만족시킬 때, \(a+b\)의 값은?`,
      note: [
        R`집합 \(\bigl\{f(x)\mid x\le k\bigr\}\)의 원소 중 정수인 것의 개수가 \(2\)가 되도록 하는 모든 실수 \(k\)의 값의 범위는 \(3\le k&lt;4\)이다.`
      ],
      choices: [R`\(11\)`, R`\(13\)`, R`\(15\)`, R`\(17\)`, R`\(19\)`],
      answer: 2,
      help: R`\(x>-8\)에서 \(-3^{\,x-3}+8\)은 감소하며 \(8\)보다 작은 값을 훑고, \(x\le -8\)에서 \(2^{\,x+a}+b\)는 \(b\)에 아주 가까운 값들만 갖는다. \(k\)를 오른쪽으로 밀면서 새 정수가 치역에 들어오는 자리를 세는 문제이고, 그 자리가 정확히 \(k=3\)과 \(k=4\)라는 것이 두 조각의 값을 못박는다.`
    },
{
      id: "2024-09-15", exam: "2024-09", no: 15, score: 4,
      units: ["m2-limit"], memo: "이어지지 않아야 한다는 조건",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)에 대하여
        함수 \(g(x)\)를
        \[g(x)=\begin{cases}\dfrac{f(x+3)\bigl\{f(x)+1\bigr\}}{f(x)} &amp; \bigl(f(x)\ne 0\bigr)\\[8pt] 3 &amp; \bigl(f(x)=0\bigr)\end{cases}\]
        이라 하자. \(\displaystyle\lim_{x\to 3}g(x)=g(3)-1\)일 때, \(g(5)\)의 값은?`,
      choices: [R`\(14\)`, R`\(16\)`, R`\(18\)`, R`\(20\)`, R`\(22\)`],
      answer: 4,
      help: R`\(f(3)\ne 0\)이면 \(g\)가 \(x=3\)에서 이어져 \(\lim_{x\to3}g(x)=g(3)\)이 되어 조건과 어긋난다. 그러니 \(f(3)=0\)이고, 그때 정의에 따라 \(g(3)=3\)이므로 \(\lim_{x\to 3}g(x)=2\)여야 한다.`
    },
{
      id: "2024-09-20", exam: "2024-09", no: 20, score: 4,
      units: ["m1-trig"], memo: "공통 변을 마주 보는 두 외접원",
      body: R`그림과 같이
        \[\overline{\mathrm{AB}}=2,\quad \overline{\mathrm{AD}}=1,\quad \angle\mathrm{DAB}=\frac{2}{3}\pi,\quad \angle\mathrm{BCD}=\frac{3}{4}\pi\]
        인 사각형 \(\mathrm{ABCD}\)가 있다. 삼각형 \(\mathrm{BCD}\)의 외접원의 반지름의
        길이를 \(R_{1}\), 삼각형 \(\mathrm{ABD}\)의 외접원의 반지름의 길이를 \(R_{2}\)라 하자.`,
      figure: "2024-09-20.webp",
      bodyAfter: R`다음은 \(R_{1}\times R_{2}\)의 값을 구하는 과정이다.
        <div class="proof-box">
        <p>삼각형 \(\mathrm{BCD}\)에서 사인법칙에 의하여</p>
        \[R_{1}=\frac{\sqrt{2}}{2}\times\overline{\mathrm{BD}}\]
        <p>이고, 삼각형 \(\mathrm{ABD}\)에서 사인법칙에 의하여</p>
        \[R_{2}=\fbox{(가)}\times\overline{\mathrm{BD}}\]
        <p>이다. 삼각형 \(\mathrm{ABD}\)에서 코사인법칙에 의하여</p>
        \[\overline{\mathrm{BD}}^{\,2}=2^{2}+1^{2}-\left(\fbox{(나)}\right)\]
        <p>이므로</p>
        \[R_{1}\times R_{2}=\fbox{(다)}\]
        <p>이다.</p>
        </div>
        위의 (가), (나), (다)에 알맞은 수를 각각 \(p\), \(q\), \(r\)이라 할 때,
        \(9\times(p\times q\times r)^{2}\)의 값을 구하시오.`,
      short: true,
      answer: 98,
      help: R`두 삼각형 \(\mathrm{BCD}\)와 \(\mathrm{ABD}\)는 변 \(\mathrm{BD}\)를 함께 쓰고, 그 변을 마주 보는 각이 각각 \(\frac{3}{4}\pi\)와 \(\frac{2}{3}\pi\)로 주어져 있다. 그래서 사인법칙에서 두 반지름이 모두 \(\overline{\mathrm{BD}}\)의 상수배로 나오고, \(\overline{\mathrm{BD}}\) 자체는 몰라도 곱을 구할 수 있다.`
    },
{
      id: "2024-09-21", exam: "2024-09", no: 21, score: 4,
      units: ["m1-seq"], memo: "부분합의 합이 만드는 정수 조건",
      body: R`모든 항이 자연수인 등차수열 \(\{a_{n}\}\)의 첫째항부터
        제\(n\)항까지의 합을 \(S_{n}\)이라 하자. \(a_{7}\)이 \(13\)의 배수이고
        \(\displaystyle\sum_{k=1}^{7}S_{k}=644\)일 때, \(a_{2}\)의 값을 구하시오.`,
      short: true,
      answer: 19,
      help: R`\(S_{n}=\frac{n}{2}\bigl(2a_{1}+(n-1)d\bigr)\)이므로 \(\sum_{k=1}^{7}S_{k}\)는 \(a_{1}\)과 \(d\)의 일차식이 된다. 그 한 식에 모든 항이 자연수라는 것과 \(a_{7}\)이 \(13\)의 배수라는 것을 얹으면 정수해가 하나로 좁혀진다.`
    },
{
      id: "2024-09-22", exam: "2024-09", no: 22, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "곱의 미분을 거꾸로 읽기",
      body: R`두 다항함수 \(f(x)\), \(g(x)\)에 대하여 \(f(x)\)의 한 부정적분을
        \(F(x)\)라 하고 \(g(x)\)의 한 부정적분을 \(G(x)\)라 할 때,
        이 함수들은 모든 실수 \(x\)에 대하여 다음 조건을 만족시킨다.`,
      note: [
        R`(가) \(\displaystyle\int_{1}^{x}f(t)\,dt=xf(x)-2x^{2}-1\)`,
        R`(나) \(f(x)G(x)+F(x)g(x)=8x^{3}+3x^{2}+1\)`
      ],
      bodyAfter: R`\(\displaystyle\int_{1}^{3}g(x)\,dx\)의 값을 구하시오.`,
      short: true,
      answer: 10,
      help: R`(나)의 왼쪽은 곱의 미분을 거꾸로 읽으면 \(\bigl(F(x)G(x)\bigr)'\)이다. 그러니 양변을 적분하면 \(F(x)G(x)\)가 곧바로 나온다. 한편 (가)는 양변을 미분하면 \(xf'(x)=4x\), 곧 \(f'(x)=4\)가 되어 \(f\)가 정해진다.`
    },
{
      id: "2024-09-prob-28", exam: "2024-09", no: 28, score: 4,
      units: ["prob-stat"], memo: "두 주머니 선택 시행과 표본평균의 분포",
      body: R`주머니 \(\mathrm{A}\)에는 숫자 \(1\), \(2\), \(3\)이 하나씩 적힌 \(3\)개의 공이 들어 있고, 주머니 \(\mathrm{B}\)에는 숫자 \(1\), \(2\), \(3\), \(4\)가 하나씩 적힌 \(4\)개의 공이 들어 있다. 두 주머니 \(\mathrm{A}\), \(\mathrm{B}\)와 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(3\)의 배수이면 주머니 \(\mathrm{A}\)에서 임의로 \(2\)개의 공을 동시에 꺼내고, 나온 눈의 수가 \(3\)의 배수가 아니면 주머니 \(\mathrm{B}\)에서 임의로 \(2\)개의 공을 동시에 꺼낸다. 꺼낸 \(2\)개의 공에 적혀 있는 수의 차를 기록한 후, 공을 꺼낸 주머니에 이 \(2\)개의 공을 다시 넣는다.
이 시행을 \(2\)번 반복하여 기록한 두 개의 수의 평균을 \(\overline{X}\)라 할 때, \(\mathrm{P}(\overline{X}=2)\)의 값은?`,
      choices: [R`\(\dfrac{11}{81}\)`, R`\(\dfrac{13}{81}\)`, R`\(\dfrac{5}{27}\)`, R`\(\dfrac{17}{81}\)`, R`\(\dfrac{19}{81}\)`],
      answer: 5,
      help: R`1회 시행에서 얻는 차 \(Y\)의 확률분포를 구한다. 주머니 A를 택할 확률은 \(\dfrac{1}{3}\), B를 택할 확률은 \(\dfrac{2}{3}\)이며 각 주머니에서 두 수의 차가 \(1, 2, 3\)일 확률을 합산하여 \(Y\)의 분포를 완성한다. \(\overline{X}=2\)는 두 수의 합이 4인 경우((1, 3), (2, 2), (3, 1))이므로 독립시행의 합으로 계산한다.`
    },
{
      id: "2024-09-prob-29", exam: "2024-09", no: 29, score: 4,
      units: ["prob-prob"], memo: "동전 던지기와 카드 뒤집기 독립시행",
      body: R`앞면에는 문자 \(\mathrm{A}\), 뒷면에는 문자 \(\mathrm{B}\)가 적힌 한 장의 카드가 있다. 이 카드와 한 개의 동전을 사용하여 다음 시행을 한다.
동전을 두 번 던져 앞면이 나온 횟수가 \(2\)이면 카드를 한 번 뒤집고, 앞면이 나온 횟수가 \(0\) 또는 \(1\)이면 카드를 그대로 둔다.
처음에 문자 \(\mathrm{A}\)가 보이도록 카드가 놓여 있을 때, 이 시행을 \(5\)번 반복한 후 문자 \(\mathrm{B}\)가 보이도록 카드가 놓일 확률은 \(p\)이다. \(128\times p\)의 값을 구하시오.`,
      short: true,
      answer: 62,
      help: R`1회 시행에서 카드가 뒤집힐 확률은 동전 앞면이 2번 나오는 확률인 \(\dfrac{1}{4}\)이다. 5회 시행 후 B가 보이려면 카드가 홀수 번(1번, 3번, 5번) 뒤집혀야 한다. 이항분포 \(\mathrm{B}\left(5, \dfrac{1}{4}\right)\)에서 홀수 번 성공할 확률을 계산하여 \(128p\)를 구한다.`
    },
{
      id: "2024-09-prob-30", exam: "2024-09", no: 30, score: 4,
      units: ["prob-count"], memo: "대소 관계와 홀짝 조건을 만족시키는 자연수 순서쌍 (중복조합)",
      body: R`다음 조건을 만족시키는 \(13\) 이하의 자연수 \(a\), \(b\), \(c\), \(d\)의 모든 순서쌍 \((a, b, c, d)\)의 개수를 구하시오.`,
      noteTitle: "조 건",
      note: [
        R`(가) \(a\le b\le c\le d\)`,
        R`(나) \(a\times d\)는 홀수이고, \(b+c\)는 짝수이다.`
      ],
      short: true,
      answer: 336,
      help: R`\(a, d\)는 모두 홀수여야 하므로 \(1\le a\le d\le 13\)인 홀수 쌍 \((a, d)\)를 택한다. \(b+c\)가 짝수이므로 \(b, c\)는 둘 다 홀수이거나 둘 다 짝수이다. \(a\le d\)인 범위 안에서 홀수/짝수 후보의 개수를 파악하여 중복조합으로 \(b, c\)를 택하는 경우의 수를 합산한다.`
    },
{
      id: "2024-09-calc-28", exam: "2024-09", no: 28, score: 4,
      units: ["calc-integ"], memo: "정적분 함수 절댓값의 미분가능성과 주기함수 적분",
      body: R`실수 \(a\,(0 &lt; a &lt; 2)\)에 대하여 함수 \(f(x)\)를
\[f(x) = \begin{cases} 2|\sin 4x| &amp; (x &lt; 0) \\ -\sin ax &amp; (x \ge 0) \end{cases}\]
이라 하자. 함수
\[g(x) = \left| \int_{-a\pi}^{x} f(t)\,dt \right|\]
가 실수 전체의 집합에서 미분가능할 때, \(a\)의 최솟값은?`,
      choices: [R`\(\dfrac{1}{2}\)`, R`\(\dfrac{3}{4}\)`, R`\(1\)`, R`\(\dfrac{5}{4}\)`, R`\(\dfrac{3}{2}\)`],
      answer: 2,
      help: R`\(F(x)=\int_{-a\pi}^x f(t)dt\)의 절댓값이 미분가능하려면 \(F(-a\pi)=0\)에서 \(f(-a\pi)=0\)이어야 하므로 \(a=\dfrac{m}{4}\) 형태이어야 합니다. \(x\ge 0\)에서 \(F(x)=m+\dfrac{\cos ax - 1}{a}\)의 최솟값이 \(0\) 이상이 되도록 \(m-\dfrac{2}{a} \ge 0 \iff m^2 \ge 8\)로부터 최소 정수 \(m=3\), 즉 \(a=\dfrac{3}{4}\)을 찾습니다.`
    },
{
      id: "2024-09-calc-29", exam: "2024-09", no: 29, score: 4,
      units: ["calc-seq"], memo: "밑의 크기에 따른 등비수열의 극한과 미정계수 결정",
      body: R`두 실수 \(a\), \(b\,(a > 1,\,b > 1)\)이
\[\lim_{n \to \infty} \frac{3^n + a^{n+1}}{3^{n+1} + a^n} = a, \quad \lim_{n \to \infty} \frac{a^n + b^{n+1}}{a^{n+1} + b^n} = \frac{9}{a}\]
를 만족시킬 때, \(a+b\)의 값을 구하시오.`,
      short: true,
      answer: 18,
      help: R`첫 번째 극한에서 \(a\)와 \(3\)의 대소 관계를 비교하여 \(a>3\)임을 먼저 확정합니다. 두 번째 극한에서 \(b&lt;a, b=a, b>a\) 세 경우의 극한값을 분석하여 모순이 발생하지 않는 유일한 조건인 \(a=b=9\)를 도출합니다.`
    },
{
      id: "2024-09-calc-30", exam: "2024-09", no: 30, score: 4,
      units: ["calc-diff"], memo: "원과 삼각형의 넓이에 대한 음함수의 미분법",
      body: R`길이가 \(10\)인 선분 \(\mathrm{AB}\)를 지름으로 하는 원과 선분 \(\mathrm{AB}\) 위에 \(\overline{\mathrm{AC}}=4\)인 점 \(\mathrm{C}\)가 있다. 이 원 위의 점 \(\mathrm{P}\)를 \(\angle\mathrm{PCB}=\theta\)가 되도록 잡고, 점 \(\mathrm{P}\)를 지나고 선분 \(\mathrm{AB}\)에 수직인 직선이 이 원과 만나는 점 중 \(\mathrm{P}\)가 아닌 점을 \(\mathrm{Q}\)라 하자. 삼각형 \(\mathrm{PCQ}\)의 넓이를 \(S(\theta)\)라 할 때, \(-7 \times S'\!\left(\dfrac{\pi}{4}\right)\)의 값을 구하시오. \(\left(\text{단, } 0 &lt; \theta &lt; \dfrac{\pi}{2}\right)\)`,
      figure: "2024-09-calc-30.webp",
      short: true,
      answer: 32,
      help: R`원의 중심을 원점으로 두면 \(\mathrm{C}(-1,0)\)이고 \(\mathrm{P}(x,y)\)에 대해 \(y=(x+1)\tan\theta\), 넓이 \(S(\theta)=(x+1)^2\tan\theta\)가 됩니다. \(\theta=\dfrac{\pi}{4}\)일 때 \(x=3\)을 구하고, 원의 방정식 \(x^2+(x+1)^2\tan^2\theta=25\)를 \(\theta\)로 음함수 미분하여 \(\dfrac{dx}{d\theta}=-\dfrac{32}{7}\)를 구한 뒤 \(S'\)에 대입합니다.`
    },
{
      id: "2024-09-geom-28", exam: "2024-09", no: 28, score: 4,
      units: ["geom-space"], memo: "구와 평면의 교선원, 두 구의 교선 위의 점의 정사영 최대",
      body: R`좌표공간에 중심이 \(\mathrm{A}(0, 0, 1)\)이고 반지름의 길이가 \(4\)인 구 \(S\)가 있다. 구 \(S\)가 \(xy\)평면과 만나서 생기는 원을 \(C\)라 하고, 점 \(\mathrm{A}\)에서 선분 \(\mathrm{PQ}\)까지의 거리가 \(2\)가 되도록 원 \(C\) 위에 두 점 \(\mathrm{P}, \mathrm{Q}\)를 잡는다. 구 \(S\)가 선분 \(\mathrm{PQ}\)를 지름으로 하는 구 \(T\)와 만나서 생기는 원 위에서 점 \(\mathrm{B}\)가 움직일 때, 삼각형 \(\mathrm{BPQ}\)의 \(xy\)평면 위로의 정사영의 넓이의 최댓값은? (단, 점 \(\mathrm{B}\)의 \(z\)좌표는 양수이다.)`,
      figure: "2024-09-geom-28.webp",
      choices: [R`\(6\)`, R`\(3\sqrt{6}\)`, R`\(6\sqrt{2}\)`, R`\(3\sqrt{10}\)`, R`\(6\sqrt{3}\)`],
      answer: 1,
      help: R`원 \(C\)는 \(xy\)평면 상 중심 \((0,0,0)\), 반지름 \(\sqrt{4^2-1^2}=\sqrt{15}\)이다. 선분 \(\mathrm{PQ}\)의 길이와 중점의 위치를 구하고, 두 구의 교선원 평면의 방정식을 세운다. 점 \(\mathrm{B}\)의 정사영이 밑변 \(\mathrm{PQ}\)로부터 가장 멀어질 때의 정사영 삼각형 높이를 계산하여 최대 넓이를 구한다.`
    },
{
      id: "2024-09-geom-29", exam: "2024-09", no: 29, score: 4,
      units: ["geom-curve"], memo: "타원의 정의를 이용한 점 간 거리 차의 최소와 원의 반지름",
      body: R`한 초점이 \(\mathrm{F}(c, 0)\) (\(c > 0\))인 타원 \(\dfrac{x^2}{9}+\dfrac{y^2}{5}=1\)과 중심의 좌표가 \((2, 3)\)이고 반지름의 길이가 \(r\)인 원이 있다. 타원 위의 점 \(\mathrm{P}\)와 원 위의 점 \(\mathrm{Q}\)에 대하여 \(\overline{\mathrm{PQ}}-\overline{\mathrm{PF}}\)의 최솟값이 \(6\)일 때, \(r\)의 값을 구하시오.`,
      short: true,
      answer: 17,
      help: R`타원의 장축 길이는 \(2a=6\), 초점은 \(\mathrm{F}(2, 0), \mathrm{F}'(-2, 0)\)이다. 타원의 정의에 의해 \(\overline{\mathrm{PF}}=6-\overline{\mathrm{PF}'}\)이므로 \(\overline{\mathrm{PQ}}-\overline{\mathrm{PF}}=\overline{\mathrm{PQ}}+\overline{\mathrm{PF}'}-6\)이다. \(\overline{\mathrm{PF}'}+\overline{\mathrm{PQ}}\)의 최솟값은 초점 \(\mathrm{F}'(-2, 0)\)에서 원 중심 \((2, 3)\)까지의 거리에서 반지름 \(r\)을 뺀 것이므로, 이를 통해 \(r\)을 구한다.`
    },
{
      id: "2024-09-geom-30", exam: "2024-09", no: 30, score: 4,
      units: ["geom-vector"], memo: "직각이등변삼각형과 정삼각형의 벡터 방향 및 내적 조건, 선분 위의 점까지의 거리 합의 최소",
      body: R`좌표평면에서 \(\overline{\mathrm{AB}}=\overline{\mathrm{AC}}\)이고 \(\angle\mathrm{BAC}=\dfrac{\pi}{2}\)인 직각삼각형 \(\mathrm{ABC}\)에 대하여 두 점 \(\mathrm{P}, \mathrm{Q}\)가 다음 조건을 만족시킨다.`,
      note: [
        R`(가) 삼각형 \(\mathrm{APQ}\)는 정삼각형이고, \(9|\vec{\mathrm{PQ}}|\vec{\mathrm{PQ}} = 4|\vec{\mathrm{AB}}|\vec{\mathrm{AB}}\)이다.`,
        R`(나) \(\vec{\mathrm{AC}}\cdot\vec{\mathrm{AQ}} &lt; 0\)`,
        R`(다) \(\vec{\mathrm{PQ}}\cdot\vec{\mathrm{CB}} = 24\)`
      ],
            bodyAfter: R`선분 \(\mathrm{AQ}\) 위의 점 \(\mathrm{X}\)에 대하여 \(|\vec{\mathrm{XA}}+\vec{\mathrm{XB}}|\)의 최솟값을 \(m\)이라 할 때, \(m^2\)의 값을 구하시오.`,
short: true,
      answer: 27,
      help: R`조건 (가)에서 벡터 \(\vec{\mathrm{PQ}}\)와 \(\vec{\mathrm{AB}}\)가 같은 방향이고 크기 관계는 \(|\vec{\mathrm{PQ}}|=\dfrac{2}{3}|\vec{\mathrm{AB}}|\)이다. 조건 (다)에서 내적값으로 삼각형의 실제 크기를 구하고, 선분 \(\mathrm{AQ}\) 위의 점 \(\mathrm{X}\)에 대해 \(|\vec{\mathrm{XA}}+\vec{\mathrm{XB}}|=2|\vec{\mathrm{XM}}|\) (\(\mathrm{M}\)은 \(\mathrm{AB}\)의 중점)의 최솟값을 점과 직선 사이 거리로 계산한다.`
    }
  ];
})();
