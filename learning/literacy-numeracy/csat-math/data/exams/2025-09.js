(function () {
  "use strict";
  const R = String.raw;
  // 2025-09 회차의 문항. 수식은 data/problems.js에 손으로 옮긴 것을 그대로 옮겨 왔다.
  window.CSAT_MATH_PART = window.CSAT_MATH_PART || {};
  window.CSAT_MATH_PART["2025-09"] = [
{
      id: "2025-09-9", exam: "2025-09", no: 9, score: 4,
      units: ["m2-integ"], memo: "같은 구간의 정적분 묶기",
      body: R`함수 \(f(x)=x^{2}+x\)에 대하여
        \[5\int_{0}^{1}f(x)\,dx-\int_{0}^{1}\bigl(5x+f(x)\bigr)dx\]
        의 값은?`,
      choices: [R`\(\dfrac{1}{6}\)`, R`\(\dfrac{1}{3}\)`, R`\(\dfrac{1}{2}\)`, R`\(\dfrac{2}{3}\)`, R`\(\dfrac{5}{6}\)`],
      answer: 5,
      help: R`적분 구간이 같으니 하나로 묶을 수 있다. 묶으면 \(4\displaystyle\int_{0}^{1}f(x)\,dx-5\int_{0}^{1}x\,dx\)로 줄어든다.`
    },
{
      id: "2025-09-10", exam: "2025-09", no: 10, score: 4,
      units: ["m1-trig"], memo: "수선의 발과 외접원 반지름",
      body: R`\(\angle\mathrm{A}>\dfrac{\pi}{2}\)인 삼각형 \(\mathrm{ABC}\)의 꼭짓점 \(\mathrm{A}\)에서 선분 \(\mathrm{BC}\)에
        내린 수선의 발을 \(\mathrm{H}\)라 하자.
        \[\overline{\mathrm{AB}}:\overline{\mathrm{AC}}=\sqrt{2}:1,\qquad \overline{\mathrm{AH}}=2\]
        이고, 삼각형 \(\mathrm{ABC}\)의 외접원의 넓이가 \(50\pi\)일 때,
        선분 \(\mathrm{BH}\)의 길이는?`,
      choices: [R`\(6\)`, R`\(\dfrac{25}{4}\)`, R`\(\dfrac{13}{2}\)`, R`\(\dfrac{27}{4}\)`, R`\(7\)`],
      answer: 1,
      help: R`직각삼각형 \(\mathrm{ABH}\)에서 \(\sin B=\frac{\overline{\mathrm{AH}}}{\overline{\mathrm{AB}}}\)이고, 사인법칙에서 \(\overline{\mathrm{AC}}=2R\sin B\)다. 외접원의 넓이가 \(50\pi\)라 \(R=5\sqrt{2}\)이므로 이 두 식을 이으면 변의 길이가 한꺼번에 정해진다.`
    },
{
      id: "2025-09-11", exam: "2025-09", no: 11, score: 4,
      units: ["m2-diff"], memo: "위치가 같아지는 시각 찾기",
      body: R`수직선 위를 움직이는 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의 시각 \(t\,(t\ge 0)\)에서의
        위치가 각각
        \[x_{1}=t^{2}+t-6,\qquad x_{2}=-t^{3}+7t^{2}\]
        이다. 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의 위치가 같아지는 순간 두 점 \(\mathrm{P}\), \(\mathrm{Q}\)의
        가속도를 각각 \(p\), \(q\)라 할 때, \(p-q\)의 값은?`,
      choices: [R`\(24\)`, R`\(27\)`, R`\(30\)`, R`\(33\)`, R`\(36\)`],
      answer: 1,
      help: R`위치를 같게 놓으면 \(t^{3}-6t^{2}+t-6=0\)이고, 이것은 \((t-6)(t^{2}+1)=0\)으로 인수분해되어 실근이 \(t=6\) 하나뿐이다.`
    },
{
      id: "2025-09-12", exam: "2025-09", no: 12, score: 4,
      units: ["m1-seq"], memo: "부호가 번갈아 붙은 합",
      body: R`수열 \(\{a_{n}\}\)은 등차수열이고, 수열 \(\{b_{n}\}\)은 모든 자연수 \(n\)에
        대하여
        \[b_{n}=\sum_{k=1}^{n}(-1)^{k+1}a_{k}\]
        를 만족시킨다. \(b_{2}=-2\), \(b_{3}+b_{7}=0\)일 때, 수열 \(\{b_{n}\}\)의
        첫째항부터 제\(9\)항까지의 합은?`,
      choices: [R`\(-22\)`, R`\(-20\)`, R`\(-18\)`, R`\(-16\)`, R`\(-14\)`],
      answer: 2,
      help: R`\(b_{2}=a_{1}-a_{2}=-d\)이므로 공차가 곧바로 정해진다. 그리고 두 항씩 묶으면 \(n\)이 홀수일 때 \(b_{n}=a_{1}+\frac{(n-1)d}{2}\), 짝수일 때 \(b_{n}=-\frac{nd}{2}\)로 간단해진다.`
    },
{
      id: "2025-09-13", exam: "2025-09", no: 13, score: 4,
      units: ["m2-integ"], memo: "y축 대칭인 조각함수의 두 넓이",
      body: R`함수
        \[f(x)=\begin{cases}-x^{2}-2x+6 &amp; (x&lt;0)\\ -x^{2}+2x+6 &amp; (x\ge 0)\end{cases}\]
        의 그래프가 \(x\)축과 만나는 서로 다른 두 점을 \(\mathrm{P}\), \(\mathrm{Q}\)라 하고,
        상수 \(k\,(k>4)\)에 대하여 직선 \(x=k\)가 \(x\)축과 만나는 점을
        \(\mathrm{R}\)이라 하자. 곡선 \(y=f(x)\)와 선분 \(\mathrm{PQ}\)로 둘러싸인 부분의
        넓이를 \(A\), 곡선 \(y=f(x)\)와 직선 \(x=k\) 및 선분 \(\mathrm{QR}\)로
        둘러싸인 부분의 넓이를 \(B\)라 하자. \(A=2B\)일 때, \(k\)의 값은?
        (단, 점 \(\mathrm{P}\)의 \(x\)좌표는 음수이다.)`,
      choices: [R`\(\dfrac{9}{2}\)`, R`\(5\)`, R`\(\dfrac{11}{2}\)`, R`\(6\)`, R`\(\dfrac{13}{2}\)`],
      answer: 4,
      help: R`\(f\)는 \(y\)축에 대하여 대칭이다. \(F(0)=0\)인 \(f\)의 부정적분 \(F\)를 잡고 \(A=2B\)를 부호를 붙여 정리하면 \(F(k)=0\)이라는 한 줄이 되어, \(\mathrm{P}\)와 \(\mathrm{Q}\)의 좌표를 구하지 않아도 된다.`
    },
{
      id: "2025-09-14", exam: "2025-09", no: 14, score: 4,
      units: ["m1-explog"], memo: "y=x에 대칭인 원과 두 곡선",
      body: R`자연수 \(n\)에 대하여 곡선 \(y=2^{x}\) 위의 두 점 \(\mathrm{A}_{n}\), \(\mathrm{B}_{n}\)이
        다음 조건을 만족시킨다.`,
      note: [
        R`(가) 직선 \(\mathrm{A}_{n}\mathrm{B}_{n}\)의 기울기는 \(3\)이다.`,
        R`(나) \(\overline{\mathrm{A}_{n}\mathrm{B}_{n}}=n\times\sqrt{10}\)`
      ],
      bodyAfter: R`중심이 직선 \(y=x\) 위에 있고 두 점 \(\mathrm{A}_{n}\), \(\mathrm{B}_{n}\)을 지나는 원이
        곡선 \(y=\log_{2}x\)와 만나는 두 점의 \(x\)좌표 중 큰 값을 \(x_{n}\)이라
        하자. \(x_{1}+x_{2}+x_{3}\)의 값은?`,
      choices: [R`\(\dfrac{150}{7}\)`, R`\(\dfrac{155}{7}\)`, R`\(\dfrac{160}{7}\)`, R`\(\dfrac{165}{7}\)`, R`\(\dfrac{170}{7}\)`],
      answer: 5,
      help: R`기울기가 \(3\)이고 길이가 \(n\sqrt{10}\)이면 두 점의 \(x\)좌표 차가 \(n\)이다. 그리고 중심이 \(y=x\) 위에 있는 원은 직선 \(y=x\)에 대하여 대칭이므로, \(y=2^{x}\) 위의 두 점을 지나면 그 대칭점인 \(y=\log_{2}x\) 위의 두 점도 지난다. 곧 \(x_{n}\)은 \(\mathrm{A}_{n}\), \(\mathrm{B}_{n}\)의 \(y\)좌표 중 큰 값이다.`
    },
{
      id: "2025-09-15", exam: "2025-09", no: 15, score: 4,
      units: ["m2-integ", "m2-diff"], memo: "적분식 두 개를 미분해 묶기",
      body: R`두 다항함수 \(f(x)\), \(g(x)\)는 모든 실수 \(x\)에 대하여 다음
        조건을 만족시킨다.`,
      note: [
        R`(가) \(\displaystyle\int_{1}^{x}t\,f(t)\,dt+\int_{-1}^{x}t\,g(t)\,dt=3x^{4}+8x^{3}-3x^{2}\)`,
        R`(나) \(f(x)=x\,g'(x)\)`
      ],
      bodyAfter: R`\(\displaystyle\int_{0}^{3}g(x)\,dx\)의 값은?`,
      choices: [R`\(72\)`, R`\(76\)`, R`\(80\)`, R`\(84\)`, R`\(88\)`],
      answer: 1,
      help: R`(가)의 양변을 미분하면 \(x f(x)+x g(x)=12x^{3}+24x^{2}-6x\), 곧 \(f(x)+g(x)=12x^{2}+24x-6\)이 된다. 여기에 (나)를 넣으면 \(g\)와 \(g'\)만 남은 관계식 하나가 된다.`
    },
{
      id: "2025-09-20", exam: "2025-09", no: 20, score: 4,
      units: ["m1-trig"], memo: "진폭이 다른 두 조각의 가로선 자르기",
      body: R`닫힌구간 \([0,\,2\pi]\)에서 정의된 함수
        \[f(x)=\begin{cases}\sin x-1 &amp; (0\le x&lt;\pi)\\ -\sqrt{2}\sin x-1 &amp; (\pi\le x\le 2\pi)\end{cases}\]
        가 있다. \(0\le t\le 2\pi\)인 실수 \(t\)에 대하여 \(x\)에 대한 방정식
        \(f(x)=f(t)\)의 서로 다른 실근의 개수가 \(3\)이 되도록 하는
        모든 \(t\)의 값의 합은 \(\dfrac{q}{p}\pi\)이다. \(p+q\)의 값을 구하시오.
        (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 15,
      help: R`\(f(t)\)를 어떤 높이 \(c\)로 보고, 가로선 \(y=c\)가 그래프와 몇 번 만나는지 세는 문제다. 앞 조각은 \(-1\)에서 \(0\)까지, 뒤 조각은 \(-1-\sqrt{2}\)에서 \(-1+\sqrt{2}\)까지 오르내려 진폭이 다르다. 두 조각이 겹치는 높이에서만 근이 셋이 된다.`
    },
{
      id: "2025-09-21", exam: "2025-09", no: 21, score: 4,
      units: ["m2-diff"], memo: "평균변화율이 두 식 사이에 끼일 조건",
      body: R`최고차항의 계수가 \(1\)인 삼차함수 \(f(x)\)가 모든 정수 \(k\)에
        대하여
        \[2k-8 \le \frac{f(k+2)-f(k)}{2} \le 4k^{2}+14k\]
        를 만족시킬 때, \(f'(3)\)의 값을 구하시오.`,
      short: true,
      answer: 31,
      help: R`가운데는 \(x=k\)와 \(x=k+2\) 사이의 평균변화율이다. \(f(x)=x^{3}+ax^{2}+bx+c\)로 놓고 계산하면 \(k\)에 대한 이차식이 되고, 그것이 모든 정수 \(k\)에서 두 식 사이에 끼여야 한다는 조건이 \(a\)와 \(b\)를 좁힌다.`
    },
{
      id: "2025-09-22", exam: "2025-09", no: 22, score: 4,
      units: ["m1-seq"], memo: "두 갈래 점화식으로 0에 닿기",
      body: R`양수 \(k\)에 대하여 \(a_{1}=k\)인 수열 \(\{a_{n}\}\)이 다음 조건을
        만족시킨다.`,
      note: [
        R`(가) \(a_{2}\times a_{3}&lt;0\)`,
        R`(나) 모든 자연수 \(n\)에 대하여 \(\left(a_{n+1}-a_{n}+\dfrac{2}{3}k\right)\left(a_{n+1}+k\,a_{n}\right)=0\)이다.`
      ],
      bodyAfter: R`\(a_{5}=0\)이 되도록 하는 서로 다른 모든 양수 \(k\)에 대하여
        \(k^{2}\)의 값의 합을 구하시오.`,
      short: true,
      answer: 8,
      help: R`(나)는 각 \(n\)마다 \(a_{n+1}=a_{n}-\frac{2}{3}k\)이거나 \(a_{n+1}=-k\,a_{n}\), 둘 중 하나라는 뜻이다. 뒤쪽 규칙은 \(a_{n}=0\)일 때만 \(0\)을 만드니, \(a_{5}=0\)에 닿는 마지막 걸음이 어느 쪽이었는지부터 갈라 보면 된다.`
    },
{
      id: "2025-09-prob-28", exam: "2025-09", no: 28, score: 4,
      units: ["prob-prob"], memo: "약수 관계를 보존하는 함수의 조건부확률",
      body: R`집합 \(X=\{1, 2, 3, 4\}\)에 대하여 \(f\colon X\to X\)인 모든 함수 \(f\) 중에서 임의로 하나를 선택하는 시행을 한다. 이 시행에서 선택한 함수 \(f\)가 다음 조건을 만족시킬 때, \(f(4)\)가 짝수일 확률은?`,
      noteTitle: "조 건",
      note: [
        R`\(a\in X\), \(b\in X\)에 대하여 \(a\)가 \(b\)의 약수이면 \(f(a)\)는 \(f(b)\)의 약수이다.`
      ],
      choices: [R`\(\dfrac{9}{19}\)`, R`\(\dfrac{8}{15}\)`, R`\(\dfrac{3}{5}\)`, R`\(\dfrac{27}{40}\)`, R`\(\dfrac{19}{25}\)`],
      answer: 4,
      help: R`1은 모든 수의 약수이므로 \(f(1)\)은 \(f(2), f(3), f(4)\)의 공약수이다. 또한 2는 4의 약수이므로 \(f(2)\)는 \(f(4)\)의 약수이다. \(f(1)=1\)인 경우와 \(f(1)\ge 2\)인 경우로 나누어 조건을 만족하는 전체 함수 개수(40개)와 그중 \(f(4)\in\{2, 4\}\)인 개수(27개)를 구한다.`
    },
{
      id: "2025-09-prob-29", exam: "2025-09", no: 29, score: 4,
      units: ["prob-stat"], memo: "수직선 위 점의 이동과 정규분포 근사",
      body: R`수직선의 원점에 점 \(\mathrm{A}\)가 있다. 한 개의 주사위를 사용하여 다음 시행을 한다.
주사위를 한 번 던져 나온 눈의 수가 \(4\) 이하이면 점 \(\mathrm{A}\)를 양의 방향으로 \(1\)만큼 이동시키고, \(5\) 이상이면 점 \(\mathrm{A}\)를 음의 방향으로 \(1\)만큼 이동시킨다.
이 시행을 \(16200\)번 반복하여 이동된 점 \(\mathrm{A}\)의 위치가 \(5700\) 이하일 확률을 오른쪽 표준정규분포표를 이용하여 구한 값을 \(k\)라 하자. \(1000\times k\)의 값을 구하시오.`,
      figure: "2025-09-prob-29.webp",
      short: true,
      answer: 994,
      help: R`1회 시행 시 양의 방향 확률은 \(p=\dfrac{2}{3}\), 음의 방향 확률은 \(\dfrac{1}{3}\)이다. 4 이하가 나온 횟수를 \(Y\sim\mathrm{B}\left(16200, \dfrac{2}{3}\right)\)라 하면 점 \(\mathrm{A}\)의 위치는 \(X = Y - (16200-Y) = 2Y - 16200\)이다. \(X\le 5700 \iff Y\le 10950\)으로 변환 후 표준화하여 \(\mathrm{P}(Z\le 2.5) = 0.5 + 0.494 = 0.994\)를 얻는다.`
    },
{
      id: "2025-09-prob-30", exam: "2025-09", no: 30, score: 4,
      units: ["prob-count"], memo: "두 가지 색 공의 분배 (중복조합)",
      body: R`흰 공 \(4\)개와 검은 공 \(4\)개를 세 명의 학생 \(\mathrm{A}\), \(\mathrm{B}\), \(\mathrm{C}\)에게 다음 규칙에 따라 남김없이 나누어 주는 경우의 수를 구하시오. (단, 같은 색 공끼리는 서로 구별하지 않고, 공을 받지 못하는 학생이 있을 수 있다.)`,
      noteTitle: "규 칙",
      note: [
        R`(가) 학생 \(\mathrm{A}\)가 받는 공의 개수는 \(0\) 이상 \(2\) 이하이다.`,
        R`(나) 학생 \(\mathrm{B}\)가 받는 공의 개수는 \(2\) 이상이다.`
      ],
      short: true,
      answer: 93,
      help: R`A가 받는 공의 총 개수가 0개, 1개, 2개인 세 가지 경우로 분류한다. A에게 흰 공과 검은 공을 배분한 후, 남은 흰 공과 검은 공을 B와 C에게 나누어 줄 때 B가 받는 총 공의 개수가 2개 이상이 되도록 여사건(B가 0개 또는 1개 받는 경우)을 제외하여 센다.`
    },
{
      id: "2025-09-calc-28", exam: "2025-09", no: 28, score: 4,
      units: ["calc-integ"], memo: "역함수의 정적분과 부분적분법",
      body: R`함수 \(f(x)\)는 실수 전체의 집합에서 연속인 이계도함수를 갖고, 실수 전체의 집합에서 정의된 함수 \(g(x)\)를
\[g(x)=f'(2x)\sin\pi x+x\]
라 하자. 함수 \(g(x)\)는 역함수 \(g^{-1}(x)\)를 갖고,
\[\int_{0}^{1} g^{-1}(x)\,dx = 2\int_{0}^{1} f'(2x)\sin\pi x\,dx + \frac{1}{4}\]
을 만족시킬 때, \(\displaystyle\int_{0}^{2} f(x)\cos\frac{\pi}{2}x\,dx\)의 값은?`,
      choices: [R`\(-\dfrac{1}{\pi}\)`, R`\(-\dfrac{1}{2\pi}\)`, R`\(-\dfrac{1}{3\pi}\)`, R`\(-\dfrac{1}{4\pi}\)`, R`\(-\dfrac{1}{5\pi}\)`],
      answer: 3,
      help: R`\(g(0)=0, g(1)=1\)이므로 역함수의 정적분 성질 \(\int_{0}^{1} g^{-1}(x)dx + \int_{0}^{1} g(x)dx = 1\)을 적용하면 \(\int_{0}^{1} f'(2x)\sin\pi x dx = \frac{1}{12}\)을 바로 얻을 수 있습니다. 구하는 정적분은 \(x=2t\)로 치환적분한 뒤 부분적분법을 적용하면 \(\int_{0}^{1} f'(2t)\sin\pi t dt\)의 식으로 변환되어 쉽게 답이 나옵니다.`
    },
{
      id: "2025-09-calc-29", exam: "2025-09", no: 29, score: 4,
      units: ["calc-seq"], memo: "급수로 정의된 수열의 합과 부분분수",
      body: R`수열 \(\{a_{n}\}\)의 첫째항부터 제\(m\)항까지의 합을 \(S_{m}\)이라 하자. 모든 자연수 \(m\)에 대하여
\[S_{m}=\sum_{n=1}^{\infty}\frac{m+1}{n(n+m+1)}\]
일 때, \(a_{1}+a_{10}=\dfrac{q}{p}\)이다. \(p+q\)의 값을 구하시오. (단, \(p\)와 \(q\)는 서로소인 자연수이다.)`,
      short: true,
      answer: 57,
      help: R`급수의 일반항을 부분분수로 분해하면 \(\frac{m+1}{n(n+m+1)}=\frac{1}{n}-\frac{1}{n+m+1}\)이 되어 소거 후 \(S_{m}=\sum_{k=1}^{m+1}\frac{1}{k}\)로 간단히 정리됩니다. 수열의 합과 일반항의 관계에서 \(a_{1}=S_{1}=1+\frac{1}{2}=\frac{3}{2}\)이고, \(m\ge 2\)일 때 \(a_{m}=S_{m}-S_{m-1}=\frac{1}{m+1}\)임을 이용해 \(a_{10}=\frac{1}{11}\)을 구합니다.`
    },
{
      id: "2025-09-calc-30", exam: "2025-09", no: 30, score: 4,
      units: ["calc-integ", "calc-diff"], memo: "절댓값 함수를 도함수로 갖는 함수의 부등식과 최솟값",
      body: R`양수 \(k\)에 대하여 함수 \(f(x)\)를
\[f(x)=(k-|x|)e^{-x}\]
이라 하자. 실수 전체의 집합에서 미분가능하고 다음 조건을 만족시키는 모든 함수 \(F(x)\)에 대하여 \(F(0)\)의 최솟값을 \(g(k)\)라 하자.`,
      note: [
        R`모든 실수 \(x\)에 대하여 \(F'(x)=f(x)\)이고 \(F(x)\ge f(x)\)이다.`
      ],
            bodyAfter: R`\(g\left(\dfrac{1}{4}\right)+g\left(\dfrac{3}{2}\right)=pe+q\)일 때, \(100(p+q)\)의 값을 구하시오. (단, \(\displaystyle\lim_{x\to\infty}xe^{-x}=0\)이고, \(p\)와 \(q\)는 유리수이다.)`,
short: true,
      answer: 25,
      help: R`\(F'(x)=f(x)\)이므로 \(F(x)\)는 \(f(x)\)의 부정적분이며, \(F(x)\ge f(x)\)는 차함수 \(H(x)=F(x)-f(x)\)의 최솟값이 0 이상이라는 조건입니다. \(H'(x)=f(x)-f'(x)=0\)이 되는 극소 후보점과 \(x=0\)에서의 연속성을 이용해 \(F(0)\)의 최솟값 \(g(k)\)를 구합니다. \(k=\frac{1}{4}\)과 \(k=\frac{3}{2}\)일 때 극값의 위치를 나누어 계산하면 \(100(p+q)=25\)를 얻습니다.`
    },
{
      id: "2025-09-geom-28", exam: "2025-09", no: 28, score: 4,
      units: ["geom-space"], memo: "공간좌표와 구 위의 원의 교점과 사잇각",
      body: R`좌표공간에 두 점 \(\mathrm{A}(a, 0, 0)\), \(\mathrm{B}(0, 10\sqrt{2}, 0)\)과 구 \(S: x^2+y^2+z^2=100\)이 있다. \(\angle\mathrm{APO}=\dfrac{\pi}{2}\)인 구 \(S\) 위의 모든 점 \(\mathrm{P}\)가 나타내는 도형을 \(C_1\), \(\angle\mathrm{BQO}=\dfrac{\pi}{2}\)인 구 \(S\) 위의 모든 점 \(\mathrm{Q}\)가 나타내는 도형을 \(C_2\)라 하자. \(C_1\)과 \(C_2\)가 서로 다른 두 점 \(\mathrm{N}_1\), \(\mathrm{N}_2\)에서 만나고 \(\cos(\angle\mathrm{N}_1\mathrm{O}\mathrm{N}_2)=\dfrac{3}{5}\)일 때, \(a\)의 값은? (단, \(a > 10\sqrt{2}\)이고, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2025-09-geom-28.webp",
      choices: [R`\(\dfrac{10\sqrt{30}}{3}\)`, R`\(\dfrac{15\sqrt{30}}{4}\)`, R`\(\dfrac{25\sqrt{30}}{6}\)`, R`\(\dfrac{55\sqrt{30}}{12}\)`, R`\(5\sqrt{30}\)`],
      answer: 1,
      help: R`\(\angle\mathrm{APO}=90^\circ\)이므로 \(\mathrm{P}\)는 \(\mathrm{OA}\)를 지름으로 하는 구와 구 \(S\)의 교선인 원 \(C_1\) (평면 \(x=x_1\) 상의 원)이다. 마찬가지로 \(C_2\)는 평면 \(y=y_1\) 상의 원이다. 두 원의 교점 \(\mathrm{N}_1, \mathrm{N}_2\)의 위치를 좌표로 표현하고 \(\cos(\angle\mathrm{N}_1\mathrm{ON}_2)=\dfrac{\vec{\mathrm{ON}}_1\cdot\vec{\mathrm{ON}}_2}{|\vec{\mathrm{ON}}_1||\vec{\mathrm{ON}}_2|}=\dfrac{3}{5}\)에서 \(a\)를 산출한다.`
    },
{
      id: "2025-09-geom-29", exam: "2025-09", no: 29, score: 4,
      units: ["geom-curve"], memo: "쌍곡선과 포물선의 정의 및 길이 비",
      body: R`그림과 같이 두 점 \(\mathrm{F}(4, 0)\), \(\mathrm{F}'(-4, 0)\)을 초점으로 하는 쌍곡선 \(C: \dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1\)이 있다. 점 \(\mathrm{F}\)를 초점으로 하고 \(y\)축을 준선으로 하는 포물선이 쌍곡선 \(C\)와 만나는 점 중 제\(1\)사분면 위의 점을 \(\mathrm{P}\)라 하자. 점 \(\mathrm{P}\)에서 \(y\)축에 내린 수선의 발을 \(\mathrm{H}\)라 할 때, \(\overline{\mathrm{PH}}:\overline{\mathrm{HF}}=3:2\sqrt{2}\)이다. \(a^2\times b^2\)의 값을 구하시오. (단, \(a > b > 0\))`,
      figure: "2025-09-geom-29.webp",
      short: true,
      answer: 63,
      help: R`포물선의 정의에 의해 \(\overline{\mathrm{PF}}=\overline{\mathrm{PH}}\)이다. 직각삼각형 \(\triangle \mathrm{PFH}\) 또는 피타고라스 정리에서 점 \(\mathrm{P}\)의 좌표를 구하고, 쌍곡선 초점 \(c=4\) (\(a^2+b^2=16\))와 쌍곡선 위의 점 \(\mathrm{P}\)를 대입하여 \(a^2, b^2\)을 각각 구한 후 곱한다.`
    },
{
      id: "2025-09-geom-30", exam: "2025-09", no: 30, score: 4,
      units: ["geom-vector"], memo: "삼각형 경계 위의 동점 사이 거리의 최대·최소",
      body: R`좌표평면 위에 다섯 점
\[\mathrm{A}(0, 8), \quad \mathrm{B}(8, 0), \quad \mathrm{C}(7, 1), \quad \mathrm{D}(7, 0), \quad \mathrm{E}(-4, 2)\]
가 있다. 삼각형 \(\mathrm{AOB}\)의 변 위를 움직이는 점 \(\mathrm{P}\)와 삼각형 \(\mathrm{CDB}\)의 변 위를 움직이는 점 \(\mathrm{Q}\)에 대하여
\[|\vec{\mathrm{PQ}}+\vec{\mathrm{OE}}|^2\]
의 최댓값을 \(M\), 최솟값을 \(m\)이라 할 때, \(M+m\)의 값을 구하시오. (단, \(\mathrm{O}\)는 원점이다.)`,
      figure: "2025-09-geom-30.webp",
      short: true,
      answer: 54,
      help: R`\(\vec{\mathrm{PQ}}+\vec{\mathrm{OE}}=\vec{\mathrm{OQ}}-(\vec{\mathrm{OP}}-\vec{\mathrm{OE}})\)로 해석하면 점 \(\mathrm{P}'=\mathrm{P}-\vec{\mathrm{OE}}\)가 그리는 평행이동된 삼각형과 삼각형 \(\mathrm{CDB}\) 사이의 거리의 제곱의 최대·최소 문제가 된다. 두 다각형 경계 사이의 최단거리와 최장거리를 기하학적으로 판정하여 \(M\)과 \(m\)을 구한다.`
    }
  ];
})();
