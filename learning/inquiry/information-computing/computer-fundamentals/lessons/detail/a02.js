(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;
    (window.COMPUTER_DETAILED_LESSONS = window.COMPUTER_DETAILED_LESSONS || []).push(
        {
            id: "a02",
            number: 2,
            title: "하드웨어와 소프트웨어",
            english: "Hardware and Software",
            conceptTitle: "손으로 만질 수 있는 부품을 하드웨어라고 하고, 그 부품에 일을 시키는 프로그램을 소프트웨어라고 합니다.",
            visual: `
                <section class="foundation-direct-lab a02-cooperation-lab" data-a02-lab data-task="display" data-result="idle" aria-labelledby="a02LabTitle">
                    <header class="foundation-lab-heading has-context">
                        <div><span>하드웨어·소프트웨어 모형 <small>Hardware–Software Model</small></span><h3 id="a02LabTitle">할 일을 고르고, 프로그램과 장치가 각각 무엇을 하는지 확인하세요.</h3></div>
                        <button type="button" class="foundation-reset" data-a02-reset>처음 상태 <small>Reset</small></button>
                        <figure class="foundation-context-figure">
                            <img src="${asset("a02-hardware-software-cooperation-illustration-v1-768.webp")}" srcset="${asset("a02-hardware-software-cooperation-illustration-v1-768.webp")} 768w, ${asset("a02-hardware-software-cooperation-illustration-v1-1536.webp")} 1536w" sizes="(max-width: 620px) 244px, (max-width: 820px) 144px, (max-width: 1180px) 16vw, 190px" width="1536" height="1024" loading="eager" decoding="async" alt="학생이 태블릿에서 고른 명령이 투명한 로봇의 회로와 부품을 움직여 펜으로 선을 그리게 하는 모습">
                            <figcaption>명령과 장치의 협업<small>Software + Hardware</small></figcaption>
                        </figure>
                    </header>
                    <div class="a02-step-heading"><b>1</b><div><strong>만들 결과를 고르세요.</strong><small>Choose a Result</small><p>결과를 고르면 필요한 프로그램과 물리 장치가 한 쌍으로 나타납니다.</p></div></div>
                    <div class="foundation-choice-row a02-task-row" role="group" aria-label="만들 결과 선택">
                        <button type="button" data-a02-task="display" aria-pressed="true"><span>화면에 파란 원 보기</span><small>Show a Blue Circle</small></button>
                        <button type="button" data-a02-task="speaker" aria-pressed="false"><span>스피커로 ‘도’ 듣기</span><small>Hear a C Note</small></button>
                        <button type="button" data-a02-task="printer" aria-pressed="false"><span>문서 한 장 인쇄하기</span><small>Print One Page</small></button>
                    </div>
                    <div class="a02-execution-line" aria-label="소프트웨어 명령이 운영체제와 드라이버를 거쳐 하드웨어 결과가 되는 과정">
                        <article class="a02-stage software-stage" data-a02-stage="software"><span>소프트웨어 <small>Software</small></span><strong data-a02-software-title>그림 앱</strong><p data-a02-command-copy>“파란 원을 그려 주세요.”</p></article><span class="a02-link" aria-hidden="true">→</span>
                        <article class="a02-stage bridge-stage" data-a02-stage="bridge"><span>운영체제·드라이버 <small>OS &amp; Driver</small></span><strong>명령 전달</strong><p data-a02-bridge-copy>디스플레이가 알아들을 신호로 전달합니다.</p></article><span class="a02-link" aria-hidden="true">→</span>
                        <article class="a02-stage hardware-stage" data-a02-stage="hardware"><span>하드웨어 <small>Hardware</small></span><strong data-a02-hardware-title>디스플레이</strong><p data-a02-capability>픽셀을 빛내 화면을 보여 줍니다.</p></article><span class="a02-link" aria-hidden="true">→</span>
                        <div class="a02-result-stage" data-a02-output="display" aria-label="실행 결과 미리보기"><span class="a02-result-object" aria-hidden="true"></span><strong data-a02-result-title>실행 전</strong><p data-a02-result-copy>프로그램과 장치가 모두 준비되어 있습니다.</p></div>
                    </div>
                    <div class="a02-step-heading a02-ready-heading"><b>2</b><div><strong>두 준비 상태를 바꾸고 실행해 보세요.</strong><small>Change a State and Run</small><p>프로그램이나 장치 중 하나가 없으면 결과가 만들어지지 않습니다.</p></div></div>
                    <div class="a02-presence-row" aria-label="소프트웨어와 하드웨어 준비 상태"><button type="button" data-a02-presence="software" aria-pressed="true"><span>프로그램 상태</span><small data-a02-software-presence>그림 앱 실행 중 · On</small></button><button type="button" data-a02-presence="hardware" aria-pressed="true"><span>장치 상태</span><small data-a02-hardware-presence>디스플레이 연결됨 · Connected</small></button><button type="button" class="foundation-run" data-a02-run>함께 실행 <small>Run Together</small></button></div>
                    <div class="foundation-evidence a02-evidence" aria-live="polite"><strong>지금 확인한 것 <small>What You Observed</small></strong><dl><div><dt>소프트웨어</dt><dd data-a02-evidence-software>그림 앱이 명령을 준비했습니다.</dd></div><div><dt>하드웨어</dt><dd data-a02-evidence-hardware>디스플레이가 연결되어 있습니다.</dd></div><div><dt>실행 결과</dt><dd data-a02-evidence-result>아직 실행하지 않았습니다.</dd></div></dl></div>
                </section>`,
            details: [
                ["하드웨어", "Hardware", "손으로 만질 수 있는 물리적인 장치입니다. CPU·RAM처럼 본체 안에 있는 부품과 키보드·화면처럼 밖에서 보이는 장치가 모두 포함됩니다."],
                ["소프트웨어", "Software", "하드웨어가 어떤 일을 하도록 만든 프로그램과 명령입니다. 저장 장치에 기록되어 있다가 실행할 때 RAM으로 불려 오고 CPU가 명령을 처리합니다. 사진·문서처럼 프로그램이 다루는 내용은 데이터라고 따로 구분합니다."],
                ["둘의 관계", "How They Work Together", "그림 앱만 있어도 화면과 CPU가 없으면 실행할 수 없고, 하드웨어만 있어도 실행할 소프트웨어가 없으면 원하는 작업을 지시할 수 없습니다."],
                ["물리 장치와 명령의 경계", "Boundary Between Device and Instructions", "프린터 본체는 하드웨어이고 프린터 드라이버는 소프트웨어입니다. 같은 기능에 함께 쓰여도 물리 장치와 명령은 구별됩니다."]
            ],
            deviceComparison: {
                title: "PC와 모바일 기기에서 하드웨어·소프트웨어 찾기",
                english: "Hardware and Software Across Devices",
                intro: "모양과 결합 방식은 달라도 물리적인 부품은 하드웨어이고, 그 부품에서 실행되는 운영체제와 앱은 소프트웨어입니다.",
                cards: [
                    { title: "데스크톱 PC", english: "Desktop PC", image: asset("desktop-hardware-cutaway-768.webp"), alt: "CPU, RAM, 그래픽 카드와 저장 장치가 따로 연결된 데스크톱 내부", relation: "CPU·RAM·SSD = 하드웨어 / Windows·앱 = 소프트웨어", note: "부품이 슬롯과 케이블로 나뉘어 보여 역할을 관찰하기 쉽습니다." },
                    { title: "Chromebook", english: "Chromebook", image: asset("chromebook-internals-exploded-768.webp"), alt: "화면, 키보드, 배터리와 메인 기판이 분리된 Chromebook형 노트북 내부", relation: "프로세서·배터리 = 하드웨어 / ChromeOS·Chrome = 소프트웨어", note: "노트북 한 몸 안에 입력·출력·처리·저장 장치가 함께 들어 있습니다." },
                    { title: "태블릿·iPad", english: "Tablet / iPad", image: asset("tablet-internals-exploded-768.webp"), alt: "터치 화면, 배터리와 로직 보드가 분리된 태블릿 내부", relation: "터치 화면·SoC = 하드웨어 / iPadOS·그림 앱 = 소프트웨어", note: "터치 화면은 물리 장치이고 화면에 나타난 아이콘과 앱은 소프트웨어 쪽입니다." },
                    { title: "Android·iPhone", english: "Smartphone", image: asset("smartphone-internals-exploded-768.webp"), alt: "화면, 배터리, 로직 보드, 카메라가 분리된 스마트폰 내부", relation: "카메라·SoC·저장 칩 = 하드웨어 / Android·iOS·앱 = 소프트웨어", note: "작은 칩 안에 여러 기능이 합쳐져 있어도 물리 회로와 실행 명령은 구별됩니다." }
                ]
            },
            workedExample: {
                title: "메모장에 ‘가’를 입력하면",
                english: "From Key Press to Screen",
                intro: "키 하나를 눌러도 하드웨어와 소프트웨어가 차례로 요청과 결과를 주고받습니다.",
                steps: [
                    ["키보드", "Keyboard", "키 아래 스위치가 눌린 위치를 전기 신호로 보냅니다. 아직 화면의 글자는 아닙니다."],
                    ["RAM과 CPU", "RAM & CPU", "실행 중인 드라이버·운영체제·앱의 명령과 작업 데이터가 RAM에 놓이고 CPU가 다음 단계를 처리합니다."],
                    ["드라이버와 운영체제", "Driver & OS", "CPU가 드라이버와 운영체제의 명령을 실행해 어느 키가 눌렸는지 읽고 한글 입력 상태와 조합 규칙을 확인합니다."],
                    ["메모 앱", "Text App", "CPU가 메모 앱의 명령을 실행해 받은 글자를 현재 문서의 커서 위치에 넣습니다."],
                    ["화면", "Display", "글자 모양이 픽셀의 밝기와 색 데이터로 바뀌어 디스플레이에 나타납니다."],
                    ["저장 장치", "Storage", "저장 버튼을 눌러야 문서 데이터가 파일로 SSD에 기록되어 전원을 꺼도 남습니다."]
                ]
            },
            comparisons: {
                title: "물건·명령·내용을 구별하기",
                english: "Hardware, Software, and Data",
                cards: [
                    ["키보드", "Hardware", "손으로 누르는 물리 장치", "스위치가 눌린 위치를 신호로 보냄"],
                    ["메모 앱", "Software", "CPU가 실행할 명령의 묶음", "입력·편집·저장 방법을 정함"],
                    ["운영체제", "System Software", "여러 앱과 장치를 관리하는 기본 소프트웨어", "키보드 입력과 파일 저장 요청을 연결함"],
                    ["문서 파일", "Data", "앱으로 만든 내용", "소프트웨어 자체가 아니라 소프트웨어가 다루는 자료"]
                ]
            },
            analogy: {
                title: "비유: 주방과 요리법",
                english: "Kitchen Analogy",
                text: "주방 기구는 하드웨어, 요리 순서를 적은 조리법은 소프트웨어, 실제로 다루는 재료와 완성 음식은 데이터에 비유할 수 있습니다.",
                limit: "하지만 컴퓨터는 맛을 판단하거나 조리법의 뜻을 이해하지 않습니다. CPU는 주어진 기계 명령을 매우 빠르고 정확하게 실행할 뿐입니다.",
                teachback: "‘프린터 본체·프린터 드라이버·인쇄할 사진’이 각각 무엇인지 자신의 말로 설명해 보세요."
            },
            activity: { type: "none" },
            questions: [
                {
                    text: "학교 PC의 모니터만 새것으로 바꾸었습니다. 저장되어 있던 문서와 그림 앱은 그대로입니다. 바뀐 대상을 가장 정확하게 설명한 것은 무엇입니까?",
                    options: ["출력 하드웨어가 바뀌었다", "운영체제가 바뀌었다", "문서 파일의 형식이 바뀌었다", "그림 앱의 명령이 바뀌었다"],
                    answer: 0,
                    concept: "하드웨어 · Hardware",
                    explanation: "모니터는 처리 결과를 보여 주는 물리적인 출력 장치입니다. 모니터 교체만으로 저장된 소프트웨어와 파일이 바뀌지는 않습니다."
                },
                {
                    text: "같은 노트북에 ChromeOS 대신 Linux를 설치했습니다. 이 변화를 설명한 것은 무엇입니까?",
                    options: ["CPU를 다른 부품으로 교체했다", "같은 하드웨어에서 운영체제 소프트웨어를 바꿨다", "화면을 입력 장치로 바꿨다", "저장 장치를 RAM으로 바꿨다"],
                    answer: 1,
                    concept: "소프트웨어 · Software",
                    explanation: "운영체제는 소프트웨어입니다. 같은 물리 장치에서도 호환되는 다른 운영체제를 설치할 수 있습니다."
                },
                {
                    text: "프린터는 연결되어 있지만 운영체제에 알맞은 장치 드라이버가 없어 인쇄 명령을 전달하지 못합니다. 부족한 것은 어느 쪽입니까?",
                    options: ["종이를 잡아 주는 하드웨어", "프린터 본체의 물리적인 외장", "장치와 운영체제를 연결하는 소프트웨어", "모니터가 보여 주는 픽셀"],
                    answer: 2,
                    concept: "드라이버 · Device Driver",
                    explanation: "프린터 본체는 이미 있지만 명령을 번역해 전달할 드라이버 소프트웨어가 없는 상황입니다."
                },
                {
                    text: "태블릿 화면을 손가락으로 눌러 그림을 그렸습니다. 화면과 그림 앱의 역할을 올바르게 연결한 것은 무엇입니까?",
                    options: ["화면과 앱 모두 물리적인 입력 장치다", "화면은 입출력 하드웨어이고 앱은 좌표를 처리하는 소프트웨어다", "화면은 소프트웨어이고 앱은 저장 장치다", "화면과 앱 모두 운영체제다"],
                    answer: 1,
                    concept: "협력 관계 · Hardware–Software Cooperation",
                    explanation: "터치스크린은 접촉을 입력받고 그림을 출력하는 하드웨어이며, 그림 앱은 좌표와 색을 처리하는 소프트웨어입니다."
                },
                {
                    text: "앱 파일이 저장 장치에 있지만 CPU와 RAM이 고장 난 컴퓨터가 있습니다. 앱을 바로 실행할 수 없는 까닭은 무엇입니까?",
                    options: ["앱은 저장되어 있어도 명령을 불러와 처리할 하드웨어가 필요하기 때문이다", "앱은 저장 장치에 기록되는 순간 스스로 실행 상태가 되기 때문이다", "CPU는 앱을 처음 설치할 때 사용되고 실행할 때는 사용되지 않기 때문이다", "RAM은 실행 중인 명령보다 완성된 파일을 장기간 보관하는 장치이기 때문이다"],
                    answer: 0,
                    concept: "실행 · Program Execution",
                    explanation: "저장된 소프트웨어를 실행하려면 명령을 작업 공간으로 불러오고 처리할 RAM과 CPU가 필요합니다."
                },
{
                    text: "스마트폰 설명서에 ‘SoC, 8GB RAM, Android, 카메라 앱’이 적혀 있습니다. 하드웨어와 소프트웨어를 올바르게 나눈 것은 무엇입니까?",
                    options: ["SoC·RAM은 하드웨어이고 Android·카메라 앱은 소프트웨어다", "Android·RAM은 하드웨어이고 SoC·카메라 앱은 소프트웨어다", "SoC·Android는 하드웨어이고 RAM·카메라 앱은 소프트웨어다", "네 항목은 모두 스마트폰 안에 있으므로 같은 종류다"],
                    answer: 0,
                    concept: "모바일 하드웨어와 소프트웨어 · Mobile Hardware and Software",
                    explanation: "SoC와 RAM은 물리적인 전자 부품이고, Android는 운영체제 소프트웨어이며 카메라 앱은 응용 소프트웨어입니다."
                }
            ]
        }
    );
})();
