(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;
    (window.COMPUTER_DETAILED_LESSONS = window.COMPUTER_DETAILED_LESSONS || []).push(
        {
            id: "b01",
            code: "B01",
            number: 6,
            domain: "컴퓨터 안의 하드웨어",
            title: "컴퓨터의 내부 부품",
            english: "Computer Components",
            conceptTitle: "부품은 맡은 일이 다르고, 메인보드에 연결되어 한 컴퓨터로 움직입니다.",
            visual: `
                <div class="system-visual hardware-cutaway-grid">
                    <figure class="hardware-photo">
                        <div class="hardware-photo-map">
                            <picture>
                                <source srcset="${asset("desktop-hardware-cutaway-768.webp")} 768w, ${asset("desktop-hardware-cutaway-1448.webp")} 1448w" sizes="(max-width: 900px) calc(100vw - 60px), 65vw" type="image/webp">
                                <img src="${asset("desktop-hardware-cutaway-768.webp")}" width="768" height="576" alt="열린 데스크톱 본체 안의 CPU, RAM, GPU, SSD, 하드 디스크, 메인보드, 전원 공급 장치와 냉각 팬">
                            </picture>
                            <button type="button" class="part-marker marker-cpu" data-cutaway-part-index="0" aria-label="1번 CPU 확대"><b>1</b></button>
                            <button type="button" class="part-marker marker-ram" data-cutaway-part-index="1" aria-label="2번 RAM 확대"><b>2</b></button>
                            <button type="button" class="part-marker marker-gpu" data-cutaway-part-index="2" aria-label="3번 GPU 확대"><b>3</b></button>
                            <button type="button" class="part-marker marker-ssd" data-cutaway-part-index="3" aria-label="4번 SSD 확대"><b>4</b></button>
                            <button type="button" class="part-marker marker-hdd" data-cutaway-part-index="4" aria-label="5번 HDD 확대"><b>5</b></button>
                            <button type="button" class="part-marker marker-psu" data-cutaway-part-index="6" aria-label="6번 전원 공급 장치 확대"><b>6</b></button>
                            <button type="button" class="part-marker marker-board" data-cutaway-part-index="5" aria-label="7번 메인보드 확대"><b>7</b></button>
                            <button type="button" class="part-marker marker-cooling" data-cutaway-part-index="7" aria-label="8번 냉각 장치 확대"><b>8</b></button>
                        </div>
                        <figcaption>번호를 누르면 그 자리에 있는 부품의 확대 사진과 이름의 뜻, 역할, 연결 방식을 함께 볼 수 있습니다.</figcaption>
                    </figure>
                    <div class="component-legend" aria-label="그림 속 부품 번호와 역할">
                        <span class="cpu"><b>1</b> CPU<small>Central Processing Unit<br>명령 해석·계산·작업 순서 제어</small></span>
                        <span class="ram"><b>2</b> RAM<small>Random Access Memory<br>실행 중인 명령과 데이터의 작업 공간</small></span>
                        <span class="gpu"><b>3</b> GPU<small>Graphics Processing Unit<br>비슷한 계산을 여러 개 병렬 처리</small></span>
                        <span class="ssd"><b>4</b> SSD<small>Solid-State Drive<br>반도체에 앱과 파일을 보관</small></span>
                        <span class="hdd"><b>5</b> HDD<small>Hard Disk Drive<br>자기 원판에 앱과 파일을 보관</small></span>
                        <span class="power"><b>6</b> PSU<small>Power Supply Unit<br>전기를 변환해 각 부품에 공급</small></span>
                        <span class="board"><b>7</b> 메인보드<small>Motherboard / Mainboard<br>부품을 연결하는 중심 기판</small></span>
                        <span class="cooling"><b>8</b> 냉각 장치<small>Heat Sink and Cooling Fan<br>부품의 열을 공기 쪽으로 이동</small></span>
                    </div>
                </div>`,
            details: [
                ["CPU", "Central Processing Unit", "프로그램 명령을 해석하고 계산을 수행합니다. 학교 비유에서는 여러 종류의 지시를 판단하는 선생님과 비슷하지만, CPU가 뜻을 스스로 정하는 것은 아닙니다."],
                ["GPU", "Graphics Processing Unit", "그림의 많은 픽셀처럼 비슷한 계산을 동시에 나누어 처리하는 데 강합니다. 미술부원 여러 명이 많은 그림 조각을 함께 계산하는 모습에 비유할 수 있습니다."],
                ["RAM과 저장 장치", "Memory and Storage", "RAM은 지금 펼쳐 둔 자료를 빠르게 쓰는 책상이고 전원이 꺼지면 내용이 사라집니다. SSD·HDD는 파일을 오래 보관하는 사물함에 가깝습니다."],
                ["메인보드·전원·냉각", "Motherboard, Power, and Cooling", "메인보드는 부품이 꽂히고 데이터를 주고받는 길을 제공합니다. 전원 공급 장치는 필요한 전력을 나누고, 팬과 방열판은 생긴 열을 밖으로 보냅니다."]
            ],
            deviceComparison: {
                title: "같은 역할, 다른 모양과 연결 방식",
                english: "Same Roles, Different Packaging",
                intro: "데스크톱은 부품이 크게 나뉘고 모바일 기기는 칩과 기판에 촘촘히 결합됩니다. 사진은 특정 제품의 수리도가 아닌 대표적인 구조입니다.",
                cards: [
                    { title: "데스크톱 PC", english: "Separate Modules", image: asset("desktop-hardware-cutaway-768.webp"), alt: "교체 가능한 부품이 나뉘어 연결된 데스크톱 내부", relation: "CPU 소켓 · RAM 슬롯 · 그래픽 카드 · SSD/HDD · PSU", note: "부품이 따로 보이고 교체 가능한 경우가 많습니다." },
                    { title: "Chromebook", english: "Compact Laptop", image: asset("chromebook-internals-exploded-768.webp"), alt: "메인 기판, 배터리, 스피커와 화면이 분리된 Chromebook 내부", relation: "프로세서/SoC · RAM · 플래시 저장 · 배터리 · Wi-Fi", note: "얇은 본체에 맞춰 RAM과 저장 장치가 기판에 붙는 제품이 많습니다." },
                    { title: "태블릿", english: "Tablet", image: asset("tablet-internals-exploded-768.webp"), alt: "큰 배터리와 좁은 로직 보드가 들어 있는 태블릿 내부", relation: "SoC · RAM · 플래시 저장 · 큰 배터리 · 터치 디스플레이", note: "화면과 배터리가 내부 공간의 대부분을 차지하고 주요 칩은 한쪽 기판에 모입니다." },
                    { title: "스마트폰", english: "Smartphone", image: asset("smartphone-internals-exploded-768.webp"), alt: "작은 로직 보드와 배터리, 카메라가 층별로 배치된 스마트폰 내부", relation: "SoC · RAM · 플래시 저장 · PMIC · 모뎀 · 안테나", note: "SoC에는 CPU와 GPU 같은 기능이 통합되고 통신 부품이 함께 필요합니다." }
                ]
            },
            parts: [
                {
                    key: "cpu",
                    short: "CPU",
                    full: "Central Processing Unit",
                    korean: "중앙 처리 장치",
                    image: asset("component-cpu-768.webp"),
                    alt: "금속 덮개가 있는 데스크톱 CPU의 윗면과 접점이 배열된 아랫면 확대 사진",
                    origin: "Central은 컴퓨터의 여러 작업을 중심에서 맡는다는 뜻, Processing은 명령과 데이터를 처리한다는 뜻, Unit은 하나의 기능 장치를 뜻합니다.",
                    look: "손바닥보다 작은 네모난 부품입니다. 윗면의 금속 덮개는 내부 칩의 열을 방열판으로 전달하고, 아랫면의 접점은 메인보드와 전기 신호를 주고받습니다.",
                    job: "프로그램의 기계 명령을 가져오고 해석한 뒤 계산·비교·이동 명령을 실행합니다. 입력 처리, 파일 열기, 앱의 진행 순서처럼 종류가 다른 작업을 빠르게 바꿔 가며 처리합니다.",
                    connection: "메인보드의 CPU 소켓에 장착되고 RAM에서 명령과 데이터를 읽습니다. 필요한 화면 계산은 GPU에 요청하고 결과를 다시 받습니다.",
                    misconception: "CPU가 사람의 뇌처럼 뜻을 이해하거나 스스로 목표를 정하는 것은 아닙니다. 작성된 명령과 현재 데이터에 따라 회로가 동작합니다."
                },
                {
                    key: "ram",
                    short: "RAM",
                    full: "Random Access Memory",
                    korean: "주기억장치(작업 메모리)",
                    image: asset("component-ram-768.webp"),
                    alt: "검은 메모리 칩과 금색 접점, 끼우는 홈이 보이는 데스크톱 RAM 모듈 확대 사진",
                    origin: "Random Access는 ‘무작위로 고른다’는 뜻이 아니라, 앞에서부터 찾지 않고 필요한 주소로 바로 접근할 수 있다는 뜻입니다. Memory는 실행 중 정보를 잠시 기억하는 장치라는 뜻입니다.",
                    look: "길고 좁은 회로 기판 위에 여러 메모리 칩이 붙어 있습니다. 아래쪽 금색 접점과 홈의 위치를 RAM 슬롯에 맞추어 꽂습니다.",
                    job: "현재 실행 중인 운영체제·앱의 명령과 작업 중인 데이터를 CPU가 빠르게 꺼내 쓰도록 펼쳐 둡니다. 용량이 넉넉하면 여러 앱과 큰 자료를 동시에 다루기 쉽습니다.",
                    connection: "메인보드의 DIMM 슬롯에 꽂히며 CPU의 메모리 제어 장치와 매우 빠르게 데이터를 주고받습니다.",
                    misconception: "RAM 용량은 SSD 저장 용량과 다릅니다. 일반적인 RAM은 전원이 끊기면 내용이 사라지므로 완성 파일을 오래 보관하는 창고가 아닙니다."
                },
                {
                    key: "gpu",
                    short: "GPU",
                    full: "Graphics Processing Unit",
                    korean: "그래픽 처리 장치",
                    image: asset("component-gpu-768.webp"),
                    alt: "냉각 팬, 회로 기판, 금속 브래킷과 금색 연결부가 보이는 데스크톱 그래픽 카드 확대 사진",
                    origin: "Graphics는 화면의 그림과 영상을 뜻하고 Processing Unit은 계산을 맡는 장치라는 뜻입니다. 처음에는 그래픽 계산이 중심이어서 이런 이름이 붙었습니다.",
                    look: "그래픽 처리 칩이 있는 회로 기판에 큰 방열판과 팬이 붙습니다. 화면 단자와 메인보드에 꽂는 PCI Express 접점이 보입니다.",
                    job: "픽셀·도형처럼 비슷한 계산을 아주 많이 동시에 처리합니다. 2D·3D 화면, 영상, 일부 과학·인공지능 계산에도 사용됩니다.",
                    connection: "그래픽 카드는 메인보드의 PCI Express 슬롯과 전원 케이블에 연결됩니다. CPU가 작업을 보내면 GPU가 계산하고 화면용 결과를 돌려줍니다.",
                    misconception: "GPU가 CPU보다 모든 계산에서 빠른 것은 아닙니다. 순서와 조건이 복잡한 일반 작업은 CPU가, 같은 계산을 많이 반복하는 작업은 GPU가 유리한 경우가 많습니다."
                },
                {
                    key: "ssd",
                    short: "SSD",
                    full: "Solid-State Drive",
                    korean: "반도체 저장 장치",
                    image: asset("component-ssd-768.webp"),
                    alt: "겉 케이스와 내부 플래시 메모리 칩, 제어 칩, 연결 단자가 보이는 SSD 확대 사진",
                    origin: "Solid-State는 움직이는 기계 부품 대신 반도체 회로로 동작한다는 전자공학 표현입니다. 단단한 상태라는 일상적 뜻만 가리키지 않습니다. Drive는 저장 장치를 부르던 이름이 이어진 것입니다.",
                    look: "2.5인치 SSD는 납작한 케이스 안에 NAND 플래시 메모리 칩과 제어 칩이 들어 있습니다. M.2 SSD는 막대 모양의 작은 회로 기판 형태도 있습니다.",
                    job: "운영체제·앱·사진·문서 파일을 전원이 꺼져도 보관합니다. 움직이는 헤드가 없어 HDD보다 빠르고 충격에 강한 경우가 많습니다.",
                    connection: "SATA 케이블로 메인보드에 연결하거나 M.2 슬롯에 직접 꽂습니다. 파일을 실행할 때 SSD의 데이터가 RAM으로 읽혀 올라갑니다.",
                    misconception: "SSD 용량이 크다고 실행 중 작업 공간인 RAM도 커지는 것은 아닙니다. 저장 장치와 작업 메모리는 역할과 속도가 다릅니다."
                },
                {
                    key: "hdd",
                    short: "HDD",
                    full: "Hard Disk Drive",
                    korean: "하드 디스크 드라이브",
                    image: asset("component-hdd-768.webp"),
                    alt: "덮개가 열린 하드 디스크 안의 원형 자기 디스크와 회전축, 읽기 쓰기 헤드 확대 사진",
                    origin: "Hard Disk의 Hard는 휘어지는 플로피 디스크와 달리 단단한 원판을 쓴다는 뜻입니다. Disk는 원형 기록판, Drive는 원판을 돌리고 읽고 쓰는 장치를 뜻합니다.",
                    look: "금속 케이스 안에 반짝이는 자기 원판, 원판을 돌리는 모터, 표면 가까이 움직이는 읽기·쓰기 헤드가 있습니다.",
                    job: "자기 원판 표면에 데이터를 기록해 오래 보관합니다. 같은 가격에서 큰 용량을 제공하기 쉬워 대용량 자료 보관에 사용됩니다.",
                    connection: "SATA 데이터 케이블로 메인보드와, 전원 케이블로 전원 공급 장치와 연결됩니다.",
                    misconception: "헤드가 원판을 정상적으로 긁으며 읽는 것이 아닙니다. 매우 가까이 떠서 자기 상태를 읽으며, 강한 충격은 기계 부품을 손상시킬 수 있습니다."
                },
                {
                    key: "motherboard",
                    short: "메인보드",
                    full: "Motherboard / Mainboard",
                    korean: "주기판",
                    image: asset("component-motherboard-768.webp"),
                    alt: "CPU 소켓, RAM 슬롯, PCI Express 슬롯과 여러 연결 단자가 보이는 메인보드 전체 확대 사진",
                    origin: "여러 부품과 작은 확장 보드가 연결되는 중심 기판이라 Motherboard 또는 Mainboard라고 부릅니다. 다른 부품의 어머니라는 생물학적 뜻은 아닙니다.",
                    look: "넓은 회로 기판 위에 CPU 소켓, RAM 슬롯, 그래픽 카드 슬롯, 저장 장치 단자와 전원 단자가 구역별로 배치됩니다.",
                    job: "부품을 고정하고 전기 신호·데이터·일부 전력을 주고받는 통로를 제공합니다. 칩셋과 펌웨어가 시작 과정과 장치 연결을 돕습니다.",
                    connection: "CPU·RAM·GPU·저장 장치·전원·팬과 직접 또는 케이블로 연결되는 컴퓨터의 중심 기판입니다.",
                    misconception: "메인보드가 모든 계산을 대신하는 것은 아닙니다. 계산과 저장은 연결된 전용 부품이 맡고, 메인보드는 이들이 통신할 기반을 제공합니다."
                },
                {
                    key: "psu",
                    short: "PSU",
                    full: "Power Supply Unit",
                    korean: "전원 공급 장치",
                    image: asset("component-psu-768.webp"),
                    alt: "금속 상자, 냉각 팬, 전원 스위치와 여러 출력 케이블이 보이는 데스크톱 전원 공급 장치 확대 사진",
                    origin: "Power는 전력, Supply는 필요한 곳에 공급한다는 뜻, Unit은 하나의 기능 장치를 뜻합니다. 줄여서 PSU라고 합니다.",
                    look: "통풍구와 팬이 있는 금속 상자에서 메인보드·CPU·GPU·저장 장치용 케이블이 여러 갈래로 나옵니다.",
                    job: "콘센트의 교류 전기를 컴퓨터 부품이 사용할 수 있는 여러 직류 전압으로 바꾸고 안정적으로 나누어 공급합니다.",
                    connection: "메인보드의 큰 전원 단자, CPU 보조 전원, 그래픽 카드, SSD·HDD 등에 각기 맞는 케이블을 연결합니다.",
                    misconception: "PSU는 배터리가 아닙니다. 전기를 오래 저장하기보다 들어온 전기를 부품에 알맞게 변환·공급합니다."
                },
                {
                    key: "cooling",
                    short: "냉각 장치",
                    full: "Heat Sink and Cooling Fan",
                    korean: "방열판과 냉각 팬",
                    image: asset("component-cooling-768.webp"),
                    alt: "금속 방열핀, 구리 히트파이프, 냉각 팬과 CPU에 닿는 바닥면이 보이는 CPU 냉각 장치 확대 사진",
                    origin: "Heat Sink는 열이 흘러 들어가 퍼지는 곳이라는 뜻으로 방열판을 가리킵니다. Cooling Fan은 공기를 움직여 열을 밖으로 보내는 팬입니다.",
                    look: "CPU에 닿는 금속 바닥, 열을 옮기는 구리 히트파이프, 넓은 금속 핀, 공기를 통과시키는 팬으로 이루어집니다.",
                    job: "CPU·GPU에서 생긴 열을 넓은 금속 표면으로 퍼뜨리고, 팬의 공기로 케이스 밖으로 이동시킵니다.",
                    connection: "방열판은 CPU나 GPU 표면에 밀착되고 팬 케이블은 메인보드에 연결되어 온도에 따라 속도를 조절합니다.",
                    misconception: "팬이 차가움을 만들어 내는 것은 아닙니다. 부품에서 생긴 열을 주변 공기와 케이스 밖으로 더 빠르게 옮깁니다."
                }
            ],
            workedExample: {
                title: "그림 앱과 사진 파일을 여는 1초",
                english: "What the Parts Do Together",
                intro: "한 부품이 혼자 앱을 여는 것이 아닙니다. 저장·작업 공간·계산·표시·전력·냉각이 이어집니다.",
                steps: [
                    ["SSD에서 읽기", "Load from Storage", "전원이 꺼져도 보관되던 그림 앱의 명령과 사진 파일을 읽습니다."],
                    ["RAM에 펼치기", "Place in RAM", "곧 사용할 명령과 사진 데이터를 빠르게 꺼내 쓸 수 있도록 RAM에 올립니다."],
                    ["CPU가 진행", "CPU Coordinates", "CPU가 앱 명령을 읽고 파일 해석·입력 처리·작업 순서를 진행합니다."],
                    ["GPU가 화면 계산", "GPU Draws", "GPU가 사진과 앱 창의 많은 픽셀 값을 동시에 계산해 화면용 이미지를 만듭니다."],
                    ["디스플레이에 출력", "Display Output", "계산된 픽셀 데이터가 화면으로 전달되어 빛과 색으로 보입니다."],
                    ["전원과 냉각", "Power & Cooling", "전원 공급 장치가 각 부품에 전력을 보내고 방열판과 팬이 생긴 열을 밖으로 옮깁니다."]
                ]
            },
            comparisons: {
                title: "CPU·GPU·RAM·저장 장치 비교",
                english: "Four Parts, Four Roles",
                cards: [
                    ["CPU", "General Processor", "서로 다른 명령을 순서와 조건에 따라 처리", "앱 실행, 입력 판단, 파일 처리"],
                    ["GPU", "Parallel Processor", "비슷한 계산을 아주 많이 동시에 처리", "픽셀·영상·3D·일부 인공지능 계산"],
                    ["RAM", "Working Memory", "지금 실행 중인 명령과 데이터를 빠르게 펼쳐 둠", "전원이 꺼지면 내용이 유지되지 않음"],
                    ["SSD·HDD", "Storage", "앱과 파일을 오래 보관", "전원이 꺼져도 기록이 남음"]
                ]
            },
            analogy: {
                title: "비유: 작업실",
                english: "Workshop Analogy",
                text: "CPU는 작업 순서를 진행하는 작업자, GPU는 같은 종류의 조각을 동시에 만드는 많은 작업대, RAM은 지금 재료를 펼친 큰 책상, SSD는 재료와 완성품을 보관하는 창고에 비유할 수 있습니다. 메인보드는 이들을 잇는 길, 전원과 냉각은 작업실의 전기와 환기입니다.",
                limit: "CPU가 항상 혼자 지휘하고 GPU가 그림만 처리하는 것은 아닙니다. 실제 프로그램은 작업의 종류에 따라 CPU와 GPU에 일을 나누며, 두 부품 모두 전자 회로로 명령과 데이터를 처리합니다.",
                teachback: "저장 공간이 256GB로 같아도 RAM 4GB와 16GB의 사용감이 달라질 수 있는 이유를 ‘창고’와 ‘책상’ 비유로 설명해 보세요."
            },
            activity: { type: "none" },
            questions: [
                {
                    text: "저장 공간은 둘 다 256GB인데 A는 RAM 4GB, B는 RAM 16GB입니다. 같은 앱 여러 개를 동시에 열 때 B가 더 넉넉한 까닭은?",
                    options: ["B의 RAM 용량이 실행 중인 명령과 데이터를 더 많이 펼쳐 둘 수 있기 때문이다", "B의 저장 공간 256GB가 A보다 더 큰 단위로 표시되기 때문이다", "A의 RAM 4GB가 파일을 장기간 보관하는 데 사용되기 때문이다", "두 컴퓨터의 저장 공간이 같으면 실행 중 작업 공간도 같아지기 때문이다"],
                    answer: 0,
                    concept: "RAM과 저장 공간",
                    explanation: "RAM은 실행 중인 작업 공간이고 256GB 저장 공간은 파일을 장기간 보관하는 용량입니다. 두 용량은 역할이 다릅니다."
                },
                {
                    text: "수천 개의 화면 픽셀에 같은 종류의 밝기 계산을 동시에 적용하는 작업이 있습니다. 이 작업에 특히 알맞게 설계된 부품은 무엇입니까?",
                    options: ["GPU", "SSD", "전원 공급 장치", "냉각 팬"],
                    answer: 0,
                    concept: "GPU",
                    explanation: "GPU는 많은 비슷한 계산을 병렬로 처리하도록 설계되어 픽셀·그래픽 계산에 강합니다."
                },
                {
                    text: "문서의 기존 파일은 SSD에 저장되어 있었지만 방금 입력한 문장은 저장하지 않은 채 전원이 꺼졌습니다. 다시 켰을 때 예상할 수 있는 결과는 무엇입니까?",
                    options: ["SSD의 기존 파일은 남고 RAM에 있던 저장 전 변경 내용은 사라질 수 있다", "RAM의 변경 내용은 남고 SSD의 기존 파일은 사라진다", "CPU가 입력 문장을 기억해 두었다가 파일을 다시 만든다", "메인보드의 대기 회로가 저장하지 않은 문장을 장기 보관한다"],
                    answer: 0,
                    concept: "휘발성과 비휘발성 · Volatile and Non-volatile Data Retention",
                    explanation: "SSD는 전원이 꺼져도 저장된 파일을 보관하지만 RAM에만 있던 변경 내용은 사라질 수 있습니다."
                },
                {
                    text: "CPU·RAM·GPU가 각각 제 역할을 하지만 서로 데이터를 주고받지 못하는 상황입니다. 먼저 확인할 부품과 기능은 무엇입니까?",
                    options: ["메인보드의 슬롯과 데이터 연결", "SSD의 파일 이름", "모니터의 화면 배율", "스피커의 음량 설정"],
                    answer: 0,
                    concept: "메인보드 · Motherboard",
                    explanation: "메인보드는 주요 부품이 꽂히고 전기 신호와 데이터를 주고받을 수 있는 연결 기반을 제공합니다."
                },
                {
                    text: "고성능 작업 중 부품 온도가 계속 올라가 CPU가 속도를 낮췄습니다. 성능 저하의 원인과 가장 직접적으로 연결된 장치는 무엇입니까?",
                    options: ["방열판과 냉각 팬", "파일을 보관하는 SSD", "문자를 입력하는 키보드", "웹 주소를 여는 브라우저"],
                    answer: 0,
                    concept: "냉각 · Cooling",
                    explanation: "방열판과 팬이 열을 충분히 내보내지 못하면 부품은 손상을 막기 위해 처리 속도를 낮출 수 있습니다."
                },
{
                    text: "스마트폰은 CPU와 GPU가 SoC에 함께 들어 있고 RAM과 저장 칩이 기판에 붙어 있습니다. 데스크톱과 비교한 설명으로 가장 정확한 것은 무엇입니까?",
                    options: ["같은 처리·작업·저장 역할이 더 작은 부품과 통합된 방식으로 구현된다", "SoC 안에 GPU가 있으므로 CPU는 필요하지 않다", "기판에 붙은 RAM은 파일을 전원이 꺼져도 보관한다", "스마트폰은 저장 칩이 있으므로 운영체제가 필요하지 않다"],
                    answer: 0,
                    concept: "기기별 부품 대응 · Component Equivalents Across Devices",
                    explanation: "스마트폰도 처리에는 CPU·GPU, 작업 공간에는 RAM, 장기 보관에는 플래시 저장 장치를 사용합니다. 다만 이들이 SoC와 로직 보드에 더 촘촘히 통합됩니다."
                }
            ]
        }
    );
})();
