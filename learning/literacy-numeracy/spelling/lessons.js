(() => {
    "use strict";

    // 차시 배정표. 문제 본문은 questions.js / questions-extra.js에 있고, 여기서는 규칙별로 묶기만 한다.
    // 모든 문제는 정확히 한 차시에만 속해야 한다(tests/spelling-lessons-contract.js가 검사).
    const lesson = (id, title, note, ids) => ({ id, title, note, ids });

    window.SPELLING_LESSONS = Object.freeze([
        lesson("doe-dwae", "되·돼, 안·않, 왠·웬", "줄어든 말과 헷갈리는 짝", [
            "dwaeyo", "an_dwae", "dwaesseo", "doeeo", "bwaeyo", "eotteokhae",
            "anhatda", "an-haetda", "waenji", "wenillo", "wenmanhamyeon"
        ]),
        lesson("word-endings", "말끝 바로 적기", "-ㄹ게, -려고, 예요·이에요, -십시오", [
            "halge", "halgeol", "haryeogo", "geoyeyo", "ieyo", "hasipsio",
            "aniyo", "geureonde", "seoseumji", "deunji-choice", "deon-past"
        ]),
        lesson("i-hi-1", "-이와 -히 (1)", "깨끗이, 곰곰이처럼 '이'로 적는 말", [
            "kkaekkeusi", "gomgomi", "iriri", "teumteumi", "natnati", "nanari",
            "dadari", "beonbeoni", "gyeopgyeobi", "satsatsi", "chokchoki"
        ]),
        lesson("i-hi-2", "-이와 -히 (2)", "'히'로 적는 말과 굳이·반드시", [
            "gakkai", "gipsugi", "neokneokhi", "kkomkkomhi", "soljikhi", "joyonghi",
            "gamanhi", "iljjigi", "deougi", "gudi", "bandeusi"
        ]),
        lesson("common-1", "자주 틀리는 낱말 (1)", "오랜만, 며칠, 금세, 역할", [
            "oraenman", "myeochil", "geumse", "eoieopda", "yeokhal", "huihanhada",
            "begae", "jjigae", "tongjjaero", "oraetdongan", "iteunnal"
        ]),
        lesson("common-2", "자주 틀리는 낱말 (2)", "설거지, 눈곱, 하마터면, 오뚝이", [
            "geondeurida", "seolgeoji", "nunkkop", "nangtteoreoji", "umcheurida", "dwicheojida",
            "neolbeureojida", "tongteureo", "hamateomyeon", "ottugi", "heojeom"
        ]),
        lesson("food-names", "먹을거리 이름", "떡볶이, 육개장, 깍두기, 숟가락·젓가락", [
            "jukkumi", "ttukbaegi", "gopppaegi", "tteokbokki", "yukgaejang", "kkakdugi",
            "gangnangkong", "sutgarak", "jeotgarak", "patjuk", "sutbul"
        ]),
        lesson("common-3", "자주 틀리는 낱말 (3)", "짜깁기, 핑계, 귀띔, 어쨌든", [
            "jjagipgi", "baljaguk", "pinggye", "challa", "gwittim", "eojjaetdeun",
            "amuteun", "meseukgeorida", "euseudae", "haelsukhada", "yalpakada"
        ]),
        lesson("common-4", "자주 틀리는 낱말 (4)", "헤매다, 짓궂다, 눈살, 요새", [
            "deurikyeoda", "eolkhigoseolkida", "gyeotdeurida", "godigotdaero", "mureupsseuda", "hemaeda",
            "jitgutda", "nunsal", "munggegureum", "yosae", "eolleun"
        ]),
        lesson("common-5", "자주 틀리는 낱말 (5)", "초승달, 안성맞춤, 폭발, 함부로", [
            "choseungdal", "anseongmatchum", "ojirap", "dakdal", "pokbal", "neoljjik",
            "sseuldeeopsi", "hambureo", "biroso", "meojianha", "golatteoreojida", "nollada"
        ]),
        lesson("conjugation", "모양 바꿔 쓰기", "담갔다, 치렀다, 알맞은, 갰다", [
            "seollem", "ssoeeotda", "damgatda", "jamgatda", "chireotda", "haneureul_naneun", "samga_juseyo", "kkakda",
            "almajeun", "geolmajeun", "gaeda-weather", "mokmeda", "deopida", "kkieodeulda"
        ]),
        lesson("saisiot-1", "사이시옷 (1)", "나뭇잎, 찻잔, 하굣길, 혼잣말", [
            "namunnip", "kkaennip", "chatjan", "jangmatbi", "jondaetmal", "hagyotgil",
            "deunggyotgil", "jeonsetjip", "honjanmal", "narannil", "naetga", "baetgil"
        ]),
        lesson("saisiot-2", "사이시옷 (2)", "최솟값, 햇볕, 예삿일, 횟수", [
            "kotdeung", "gidaetgap", "choesotgap", "choedaetgap", "haetbyeot", "haetbyeot-window",
            "yesannil", "maknaetdongsaeng", "hoetsu", "sutja"
        ]),
        lesson("saisiot-none", "사이시옷을 넣지 않는 말", "위층, 뒤쪽, 머리말, 개수", [
            "meorimal", "insamal", "wicheung", "araecheung", "dwijjok", "dwipyeon",
            "gaesu", "chojeom", "daega"
        ]),
        lesson("spacing-1", "띄어쓰기 (1)", "수, 지, 만, 데, 바, 중, 전, 때", [
            "su_spacing", "jinan_ji", "saheul_man", "gongbuhaneun_de", "aneun_ba", "hoeui_jung",
            "chulbal_jeon", "eoril_ttae", "hal_geosida", "myeot_gaji"
        ]),
        lesson("spacing-2", "띄어쓰기 (2)", "첫 번째, 다음 날, 척·체, 그중, 받아쓰기", [
            "cheot_beonjjae", "sip_nyeon", "daeum_nal", "haru_jongil", "hal_subakke", "aneun_cheokhada",
            "moreuneun_chehada", "geujung", "i_jung", "badasseugi", "geulsseugi", "ttieosseugi"
        ]),
        lesson("spacing-3", "띄어쓰기 (3)", "뿐, 대로, 만큼, 채와 체", [
            "na_ppun", "useul_ppun", "yaksokdaero", "bon_daero", "namankeum", "noryeokhan_mankeum",
            "chae-state", "che-pretend"
        ]),
        lesson("hanja-pairs-1", "뜻이 다른 한자말 (1)", "결제·결재, 지양·지향, 유래·유례", [
            "gyeolje", "gyeoljae", "danhap", "damhap", "jiyang-avoid", "jihyang-aim",
            "bangjeung", "banjeung", "jaego-review", "jego-improve", "yurae", "yurye"
        ]),
        lesson("hanja-pairs-2", "뜻이 다른 한자말 (2)", "체제·체재, 경신·갱신, 일절·일체, 한창·한참", [
            "cheje-system", "chejae-stay", "gonyok", "gonhok", "gyeongsin", "gaengsin",
            "iljeol", "ilche", "hanchang", "hancham", "munanhada"
        ]),
        lesson("homophone-1", "소리가 비슷한 말 (1)", "낫다·낳다·나았다, 맞히다·맞추다, 매다·메다", [
            "naatda", "natda-better", "natda-happen", "nahda-birth", "natda-better-nahda", "nahda-lay",
            "machyeotda", "menatda", "maetda", "deulleotda"
        ]),
        lesson("homophone-2", "소리가 비슷한 말 (2)", "거치다·걷히다, 바치다·받치다, 부치다·붙이다", [
            "geochida", "geothida", "bachida-devote", "batchida-support", "bathida-hit", "buchida-send",
            "butida-attach", "anchida-rice", "anjida-seat", "geotjapda-control", "geotjapda-estimate"
        ]),
        lesson("homophone-3", "소리가 비슷한 말 (3)", "늘이다·늘리다, 조리다·졸이다, 가늠·갈음", [
            "neurida-length", "neullida-amount", "darida-clothes", "darida-medicine", "jeorida-numb", "jeorida-salt",
            "jorida-food", "jorida-worry", "jurida-hunger", "jurida-reduce", "ganeum", "gareum", "gareum-replace"
        ]),
        lesson("homophone-4", "소리가 비슷한 말 (4)", "이따가·있다가, 로서·로써, 띠다·띄다, 벌이다·벌리다", [
            "ittaga-later", "itdaga-stay", "roseo-role", "rosseo-means", "ttida-have", "ttuida-notice",
            "bitda-make", "bitda-comb", "beorida-event", "beollida-gap", "deureonaeda-reveal", "deureonaeda-remove"
        ]),
        lesson("homophone-5", "소리가 비슷한 말 (5)", "좇다·쫓다, 바라다·바래다, 썩이다·썩히다", [
            "jotda-follow", "jjotda-chase", "barada-hope", "baraeda-fade", "sseogida-worry", "sseoghida-waste",
            "sagida-calm", "saghida-ferment", "haechida-harm", "hechida-push", "bongori-flower", "bonguri-mountain"
        ]),
        lesson("homophone-6", "소리가 비슷한 말 (6)", "새다·세다, 배다·베다, 너머·넘어, 뺐다·뺏다", [
            "saeda-leak", "seda-count", "baeda-soak", "beda-cut", "kkotda", "gujeun",
            "neomeo-place", "neomeo-verb", "ppaeda-remove", "ppaetda-snatch", "ppaetda-snatch2"
        ]),
        lesson("homophone-7", "소리가 비슷한 말 (7)", "젖히다·제치다, 부수다·부시다, 맡다·맞다, 무치다·묻히다", [
            "jeochida-tilt", "jechida-pass", "jigeusi-softly", "jigeusi-aged", "busuda-break", "busida-dazzle",
            "matda-smell", "matda-correct", "muchida-mix", "mutida-coat"
        ]),
        lesson("meaning-pairs", "뜻을 가려 쓰는 말", "가르치다·가리키다, 다르다·틀리다, 잊다·잃다, 작다·적다", [
            "gareuchida", "garikida", "dareuda", "teullida", "itda-forget", "ilta-lose",
            "jakda", "jeokda", "dukkeopda", "duteopda"
        ]),
        lesson("n-to-l", "ㄴ이 ㄹ로 소리 나는 말", "곤란, 신라, 원래, 연락, 설날", [
            "gollan", "silla", "nallo", "hallasan", "wollae", "yeollak",
            "hullyeon", "pyeolli", "gwalli", "mullalli", "seollal", "kallal"
        ]),
        lesson("keep-batchim", "받침을 살려 적는 말", "같이, 해돋이, 꽃이, 부엌, 시월", [
            "gachi", "haedoji", "maji", "kkot-i", "bat-eseo", "bueok",
            "natjam", "bitjaru", "setjjae", "siwol", "yuwol"
        ]),
        lesson("double-batchim", "겹받침 살려 적기", "여덟, 많다, 싫다, 굵다, 넋", [
            "yeodeol", "manta", "silta", "noatda", "gukda", "neulgeusyeotda",
            "haltatda", "eonjeotda", "ttureotda", "neok", "salm"
        ]),
        lesson("ryul-idioms", "률·율과 사자성어", "정답률, 백분율, 절체절명, 일사불란", [
            "jeongdamnyul", "baekbunyul", "jeolchejeolmyeong", "pungbibaksan",
            "ilsabullan", "donggodongnak", "seongdaemosa"
        ]),
        lesson("loanwords-1", "외래어 표기 (1)", "케이크, 초콜릿, 주스, 소시지", [
            "cake", "chocolate", "message", "juice", "sausage", "battery", "jacket", "cardigan"
        ]),
        lesson("loanwords-2", "외래어 표기 (2)", "액세서리, 리더십, 로봇, 파이팅", [
            "accessory", "leadership", "robot", "television", "contents", "license", "fighting"
        ])
    ]);
})();
