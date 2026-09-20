/**
 * 관절과 길항근 — 2D 바이오메카닉스 시뮬레이터
 *
 * [arm-skeleton.svg] 정밀 뼈대 도식을 기반으로 팔꿈치 경첩관절의 회전(30° ~ 180°)과
 * 이두근(주동근)·삼두근(길항근)의 실시간 수축/이완 메커니즘을 시각화한다.
 *
 * - 수축 시: 근섬유 다발 결(Fibers)이 두껍게 뭉치며, 액틴-마이오신 활주 텐션 시머 파동 발생
 * - 이완 시: 근섬유 다발이 길고 얇게 늘어남
 * - 힘줄(Tendon): 은백색 콜라겐 다발로 근육과 뼈 부착점(노뼈거친면 / 팔꿈치머리)을 직결
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/arm-skeleton.svg';
    var KEY = 'joint';

    var SHOULDER = { x: 470, y: 120 };
    var ELBOW = { x: 470, y: 370 };
    var FORE_LEN = 250;

    var TENDON = '#f1f5f9';
    var TENDON_CORE = '#cbd5e1';

    var wrap, layer, svg, labelBox, leaderGroup;
    var foreGroup, handle;
    var angleArc, anglePlate, handleRing, travelArc, ghost;
    var everDragged = false;
    var angleAt = { x: 0, y: 0 };
    var dragging = false;
    var loaded = false;

    var bicepsObj = {}, tricepsObj = {};

    var LABELS = [
        { id: 'humerus', text: '위팔뼈 (상완골)', ax: 292, ay: 128, sx: 452, sy: 152 },
        { id: 'triceps', text: '삼두근 (길항근)', ax: 232, ay: 300, sx: 440, sy: 260 },
        { id: 'joint', text: '팔꿈치 관절 (연골 · 윤활액)', ax: 238, ay: 452, sx: 470, sy: 370 },
        { id: 'forearm', text: '노뼈 (앞) · 자뼈 (뒤)', ax: 248, ay: 604, sx: 450, sy: 520 },
        { id: 'biceps', text: '이두근 (주동근)', ax: 768, ay: 210, sx: 505, sy: 260 },
        { id: 'tendon', text: '힘줄 — 근육과 뼈를 잇는다', ax: 784, ay: 350, sx: 520, sy: 420 }
    ];

    /** 머리글의 [일시정지] 를 따른다 */
    function isPaused() {
        return typeof SimEngine !== 'undefined' && SimEngine.isPaused ? SimEngine.isPaused() : false;
    }

    /** 멈춰 있는 동안 흐르지 않는 공용 시계 */
    function nowMs() {
        return (typeof SimEngine !== 'undefined' && SimEngine.now) ? SimEngine.now() : performance.now();
    }

    function init() {
        wrap = document.querySelector('.skeleton-viewport');
        if (!wrap) return;
        buildLayer();
        bindSceneButtons();
        window.addEventListener('resize', placeLabels);
        requestAnimationFrame(loop);
    }

    function bindSceneButtons() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar) return;
        bar.addEventListener('click', function (event) {
            var btn = event.target.closest ? event.target.closest('.scene-btn') : null;
            if (!btn || !bar.contains(btn)) return;
            setVisible(btn.dataset.scene === KEY);
        });
        var act = bar.querySelector('.scene-btn.active');
        setVisible(!!(act && act.dataset.scene === KEY));
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('skeletonCanvas');
        if (canvas) canvas.style.visibility = on ? 'hidden' : 'visible';
        if (on && loaded) { render(); placeLabels(); }
    }

    function el(name, attrs) {
        var e = document.createElementNS(SVG_NS, name);
        for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
        return e;
    }

    // 내장 백업 SVG
    var EMBEDDED_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 700\" width=\"1000\" height=\"700\">\n  <defs>\n    <!-- Subtle linear gradients: exactly 2 stops, same hue, brightness difference <= 12%, strictly NO #ffffff -->\n    <linearGradient id=\"boneGradHumerus\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#cbd5e1\" />\n      <stop offset=\"100%\" stop-color=\"#e2e8f0\" />\n    </linearGradient>\n    <linearGradient id=\"boneGradRadius\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#cbd5e1\" />\n      <stop offset=\"100%\" stop-color=\"#e2e8f0\" />\n    </linearGradient>\n    <linearGradient id=\"boneGradUlna\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#cbd5e1\" />\n      <stop offset=\"100%\" stop-color=\"#e2e8f0\" />\n    </linearGradient>\n    <linearGradient id=\"boneGradScapula\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#b8c2cf\" />\n      <stop offset=\"100%\" stop-color=\"#cbd5e1\" />\n    </linearGradient>\n    <linearGradient id=\"boneGradHand\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#b8c2cf\" />\n      <stop offset=\"100%\" stop-color=\"#cbd5e1\" />\n    </linearGradient>\n  </defs>\n\n  <!-- ==================================================== -->\n  <!-- 1. SCAPULA (어깨뼈) - 크지 않게 위팔뼈 걸리는 자리 중심 -->\n  <!-- ==================================================== -->\n  <g id=\"scapula\">\n    <!-- 어깨뼈 외측연 및 관절와 본체 -->\n    <path d=\"M 400 86\n             C 420 80, 442 82, 458 90\n             C 470 96, 482 106, 488 116\n             C 490 124, 484 130, 474 134\n             C 460 138, 448 132, 440 126\n             C 434 122, 428 126, 424 136\n             C 418 152, 416 170, 424 182\n             C 428 188, 426 194, 420 192\n             C 412 188, 404 176, 400 160\n             C 394 140, 392 118, 396 98\n             C 398 90, 400 86, 400 86 Z\"\n          fill=\"url(#boneGradScapula)\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n    <!-- 어깨봉우리 (Acromion) - 위팔뼈 머리 위를 아치형으로 덮음 -->\n    <path d=\"M 436 78\n             C 454 70, 476 72, 492 82\n             C 500 88, 502 96, 494 102\n             C 484 108, 472 102, 458 92\n             C 448 85, 440 82, 436 78 Z\"\n          fill=\"#cbd5e1\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n    <!-- 부리돌기 (Coracoid Process) - 앞쪽으로 굽은 돌기 -->\n    <path d=\"M 466 98\n             C 478 94, 496 98, 508 108\n             C 514 114, 514 122, 506 128\n             C 496 132, 488 126, 480 118\n             C 474 112, 468 106, 466 98 Z\"\n          fill=\"#cbd5e1\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n    <!-- 관절와 (Glenoid Cavity) 림 음영 및 연골면 - 절구관절 오목 -->\n    <path d=\"M 444 98\n             C 448 112, 448 126, 442 140\n             C 438 148, 432 156, 428 162\"\n          fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linecap=\"round\" />\n    <path d=\"M 442 102\n             C 434 114, 434 130, 440 142\n             C 434 138, 430 126, 432 116\n             C 434 108, 438 104, 442 102 Z\"\n          fill=\"#b8c2cf\" stroke=\"none\" />\n  </g>\n\n  <!-- ==================================================== -->\n  <!-- 2. HUMERUS (위팔뼈) - 한 덩어리 path 하나로 구성     -->\n  <!-- ==================================================== -->\n  <path id=\"humerus\"\n        d=\"M 468 94\n           C 448 94, 436 106, 438 124\n           C 440 138, 448 148, 456 154\n           L 456 195\n           C 453 210, 452 230, 454 255\n           L 456 312\n           C 450 318, 440 328, 436 338\n           C 432 346, 434 356, 442 360\n           C 450 364, 456 358, 460 350\n           C 462 358, 466 368, 472 370\n           C 478 372, 486 368, 490 358\n           C 494 366, 502 366, 506 358\n           C 510 350, 506 340, 498 332\n           C 492 324, 486 314, 484 300\n           L 484 240\n           C 486 215, 488 190, 486 166\n           C 488 152, 496 142, 498 128\n           C 500 114, 492 102, 482 98\n           C 478 95, 473 94, 468 94 Z\"\n        fill=\"url(#boneGradHumerus)\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n  <!-- 위팔뼈 세부 묘사 (그늘 및 돌기/오목 윤곽선) -->\n  <!-- 위팔뼈 뒤쪽(왼쪽) 그늘 -->\n  <path d=\"M 456 154\n           L 456 312\n           C 450 318, 440 328, 436 338\n           C 432 346, 434 356, 442 360\n           C 448 363, 452 359, 456 352\n           L 462 310\n           L 462 160\n           C 459 157, 457 155, 456 154 Z\"\n        fill=\"#b8c2cf\" stroke=\"none\" opacity=\"0.6\" />\n\n  <!-- 결절사이고랑 (Intertubercular sulcus) - 이두근 힘줄 경로 -->\n  <path d=\"M 482 110 C 480 124, 478 140, 477 156\"\n        fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" />\n\n  <!-- 팔꿈치 오목 (Olecranon fossa) - 팔을 펼 때 팔꿈치머리가 들어가는 오목 -->\n  <path d=\"M 462 334\n           C 466 328, 476 328, 480 334\n           C 482 342, 478 348, 471 350\n           C 464 348, 460 342, 462 334 Z\"\n        fill=\"#cbd5e1\" stroke=\"#94a3b8\" stroke-width=\"1.8\" />\n\n  <!-- 활차(도르래) 중앙 고랑 -->\n  <path d=\"M 470 344 C 470 354, 471 364, 472 370\"\n        fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.8\" />\n\n  <!-- ==================================================== -->\n  <!-- 보이지 않는 회전축 및 기시점 표시                      -->\n  <!-- ==================================================== -->\n  <circle id=\"pivotElbow\" cx=\"470\" cy=\"370\" r=\"1\" fill=\"none\" stroke=\"none\" />\n  <circle id=\"attachBicepsOrigin\" cx=\"504\" cy=\"160\" r=\"1\" fill=\"none\" stroke=\"none\" />\n  <circle id=\"attachTricepsOrigin\" cx=\"432\" cy=\"166\" r=\"1\" fill=\"none\" stroke=\"none\" />\n\n  <!-- ==================================================== -->\n  <!-- 3. FOREARM GROUP (아래팔 묶음 - 엔진이 통째로 회전)   -->\n  <!-- ==================================================== -->\n  <g id=\"forearm\">\n    <!-- 뼈사이막 (Interosseous membrane) - 노뼈와 자뼈를 잇는 질긴 결합조직 막 -->\n    <line x1=\"454\" y1=\"416\" x2=\"488\" y2=\"424\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"453\" y1=\"438\" x2=\"492\" y2=\"446\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"452\" y1=\"460\" x2=\"496\" y2=\"468\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"451\" y1=\"482\" x2=\"500\" y2=\"490\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"450\" y1=\"504\" x2=\"502\" y2=\"512\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"449\" y1=\"526\" x2=\"501\" y2=\"534\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"448\" y1=\"548\" x2=\"498\" y2=\"556\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n    <line x1=\"447\" y1=\"570\" x2=\"490\" y2=\"578\" stroke=\"#94a3b8\" stroke-width=\"1.5\" opacity=\"0.35\" stroke-linecap=\"round\" />\n\n    <!-- ──────────────────────────────────────── -->\n    <!-- ULNA (자뼈 - 뒤쪽/왼쪽)                  -->\n    <!-- ──────────────────────────────────────── -->\n    <!-- 팔꿈치머리가 위/뒤로 돌출, 도르래패임이 도르래를 감싸며 경첩 작동 -->\n    <path id=\"ulna\"\n          d=\"M 436 322\n             C 424 326, 418 338, 420 352\n             C 422 364, 430 374, 442 380\n             C 440 400, 442 450, 442 500\n             C 442 540, 440 564, 440 574\n             C 438 580, 438 590, 444 596\n             C 446 599, 448 604, 447 610\n             C 446 614, 450 616, 452 614\n             C 456 610, 456 600, 458 592\n             C 462 584, 462 576, 460 564\n             C 458 540, 458 480, 460 424\n             C 462 400, 466 392, 470 384\n             C 472 380, 470 376, 464 374\n             C 454 370, 446 360, 448 346\n             C 449 336, 456 330, 460 326\n             C 462 322, 458 318, 452 318\n             C 446 318, 440 320, 436 322 Z\"\n          fill=\"url(#boneGradUlna)\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n    <!-- 자뼈 뒤쪽 그늘 및 윤곽 입체화 -->\n    <path d=\"M 436 322\n             C 424 326, 418 338, 420 352\n             C 422 364, 430 374, 442 380\n             C 440 400, 442 450, 442 500\n             C 442 540, 440 564, 440 574\n             C 438 580, 438 590, 444 596\n             L 448 594\n             C 446 576, 448 530, 448 480\n             C 448 430, 446 385, 444 376\n             C 434 370, 428 358, 430 346\n             C 432 334, 438 326, 436 322 Z\"\n          fill=\"#b8c2cf\" stroke=\"none\" opacity=\"0.6\" />\n\n    <!-- 팔꿈치머리(Olecranon) 후방 능선선 -->\n    <path d=\"M 438 324 C 444 336, 446 352, 444 366\"\n          fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" />\n\n    <!-- ──────────────────────────────────────── -->\n    <!-- RADIUS (노뼈 - 앞쪽/오른쪽)               -->\n    <!-- ──────────────────────────────────────── -->\n    <!-- 원판형 노뼈머리 + 목 + 노뼈거친면(이두근 부착) + 원위 붓돌기 -->\n    <path id=\"radius\"\n          d=\"M 482 366\n             C 480 366, 480 374, 482 376\n             L 486 377\n             C 485 384, 484 392, 483 400\n             C 480 408, 478 418, 480 430\n             C 482 442, 488 450, 492 452\n             C 495 454, 498 466, 499 486\n             C 502 516, 504 544, 502 566\n             C 500 576, 492 586, 484 592\n             C 480 594, 482 600, 488 600\n             L 512 600\n             C 518 600, 524 606, 526 614\n             C 528 616, 532 614, 530 608\n             C 528 596, 526 584, 522 570\n             C 516 540, 514 506, 510 474\n             C 508 438, 506 406, 504 394\n             C 504 386, 506 380, 508 376\n             L 510 376\n             C 512 374, 512 366, 510 366\n             L 482 366 Z\"\n          fill=\"url(#boneGradRadius)\" stroke=\"#94a3b8\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n    <!-- 노뼈머리 원판 관절면 테두리 -->\n    <path d=\"M 482 372 L 510 372\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.8\" />\n\n    <!-- 노뼈거친면 (Radial tuberosity) - 이두근 힘줄 부착 돌기 -->\n    <path d=\"M 482 432\n             C 486 428, 494 430, 496 438\n             C 498 446, 492 452, 486 452\n             C 480 450, 478 440, 482 432 Z\"\n          fill=\"#cbd5e1\" stroke=\"#94a3b8\" stroke-width=\"2\" />\n\n    <!-- 노뼈 내측 음영 -->\n    <path d=\"M 486 377\n             L 483 400\n             C 480 408, 478 418, 480 430\n             L 486 452\n             C 490 470, 494 510, 496 548\n             L 490 588\n             L 484 592\n             C 488 584, 494 546, 492 508\n             C 490 470, 486 450, 484 430\n             C 482 410, 484 390, 486 377 Z\"\n          fill=\"#b8c2cf\" stroke=\"none\" opacity=\"0.5\" />\n\n    <!-- ──────────────────────────────────────── -->\n    <!-- HAND (손뼈 - 8px 상향 조정 및 손가락 단축) -->\n    <!-- 모든 손끝이 y <= 686 (700 경계 내 안전)   -->\n    <!-- ──────────────────────────────────────── -->\n    <g id=\"hand\" fill=\"url(#boneGradHand)\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-linejoin=\"round\">\n      <!-- 손목뼈 (Carpals) 8개 정돈된 2열 클러스터 (y: 600 ~ 620) -->\n      <path d=\"M 482 602 C 478 604, 478 612, 482 616 C 488 618, 492 612, 490 604 C 488 600, 484 600, 482 602 Z\" />\n      <path d=\"M 494 602 C 492 608, 494 616, 498 618 C 504 618, 508 610, 504 604 C 500 600, 496 600, 494 602 Z\" />\n      <path d=\"M 508 606 C 506 612, 508 618, 514 618 C 520 616, 520 608, 516 604 C 512 602, 510 604, 508 606 Z\" />\n      <path d=\"M 456 606 C 452 610, 454 618, 460 620 C 466 620, 470 612, 466 606 C 462 602, 458 602, 456 606 Z\" />\n      <path d=\"M 468 608 C 466 614, 468 620, 474 622 C 480 622, 482 614, 478 608 C 476 604, 472 604, 468 608 Z\" />\n\n      <!-- 손허리뼈 (Metacarpals 1~5) -->\n      <!-- 엄지 (제1중수골 - 앞쪽으로 벌어짐) -->\n      <path d=\"M 518 618 C 522 616, 532 624, 538 634 C 542 642, 540 648, 534 646 C 528 642, 520 630, 516 622 Z\" />\n      <!-- 검지 (제2중수골) -->\n      <path d=\"M 506 620 L 512 656 C 512 660, 506 660, 504 656 L 500 620 Z\" />\n      <!-- 중지 (제3중수골) -->\n      <path d=\"M 492 620 L 494 660 C 494 664, 488 664, 486 660 L 486 620 Z\" />\n      <!-- 약지 (제4중수골) -->\n      <path d=\"M 478 620 L 476 658 C 476 662, 470 662, 470 658 L 472 620 Z\" />\n      <!-- 소지 (제5중수골) -->\n      <path d=\"M 464 620 L 458 652 C 458 656, 452 654, 454 650 L 460 620 Z\" />\n\n      <!-- 손가락뼈 (Phalanges - 마디 단축, 최대 y <= 686) -->\n      <!-- 엄지 지골 (끝 y = 668) -->\n      <path d=\"M 536 646 C 542 654, 546 662, 550 666 C 552 668, 546 670, 542 666 C 538 662, 534 654, 532 650 Z\" />\n      <!-- 검지 지골 (끝 y = 680) -->\n      <path d=\"M 510 658 L 514 678 C 514 682, 508 682, 506 678 L 504 658 Z\" />\n      <!-- 중지 지골 (끝 y = 686) -->\n      <path d=\"M 492 662 L 492 684 C 492 688, 486 688, 486 684 L 486 662 Z\" />\n      <!-- 약지 지골 (끝 y = 682) -->\n      <path d=\"M 474 660 L 472 680 C 472 684, 466 684, 466 680 L 468 660 Z\" />\n      <!-- 소지 지골 (끝 y = 672) -->\n      <path d=\"M 456 654 L 450 670 C 450 674, 444 672, 446 668 L 452 654 Z\" />\n    </g>\n\n    <!-- ──────────────────────────────────────── -->\n    <!-- 동적 힘줄 부착점 (아래팔 묶음 내부)       -->\n    <!-- ──────────────────────────────────────── -->\n    <circle id=\"attachBicepsInsertion\" cx=\"490\" cy=\"444\" r=\"1\" fill=\"none\" stroke=\"none\" />\n    <circle id=\"attachTricepsInsertion\" cx=\"436\" cy=\"330\" r=\"1\" fill=\"none\" stroke=\"none\" />\n  </g>\n\n  <!-- ==================================================== -->\n  <!-- 4. MUSCLES (근육 4벌 모핑 템플릿 - 개정 주문서 5장)     -->\n  <!-- ==================================================== -->\n  <!-- 이두근 두 벌 (biceps: #c81e4a, 테두리 #f0748c, 위쪽 두 갈래) -->\n  <path id=\"bicepsRelaxed\"\n        d=\"M 490 444 C 488 434, 486 410, 485 385 C 484 360, 483 330, 483 300 C 483 270, 485 240, 488 215 C 490 198, 492 182, 493 170 C 494 165, 497 165, 498 174 C 500 185, 502 185, 503 174 C 504 162, 506 160, 504 160 C 507 180, 508 210, 507 240 C 506 270, 505 320, 503 365 C 501 405, 496 432, 490 444 Z\"\n        fill=\"#c81e4a\" stroke=\"#f0748c\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n  <path id=\"bicepsContracted\"\n        d=\"M 490 444 C 486 432, 478 405, 475 375 C 472 345, 470 310, 471 285 C 472 255, 478 232, 485 212 C 489 198, 491 182, 493 170 C 494 165, 497 165, 498 174 C 500 185, 502 185, 503 174 C 504 162, 506 160, 504 160 C 511 182, 517 215, 521 245 C 525 278, 526 315, 522 355 C 518 395, 504 428, 490 444 Z\"\n        fill=\"#c81e4a\" stroke=\"#f0748c\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n  <!-- 삼두근 두 벌 (triceps: #1877a8, 테두리 #7dd3fc, 위쪽 세 갈래) -->\n  <path id=\"tricepsRelaxed\"\n        d=\"M 436 330 C 437 318, 439 300, 441 280 C 443 260, 444 240, 445 220 C 446 205, 445 192, 444 182 C 443 174, 440 174, 439 180 C 438 188, 436 188, 435 178 C 434 170, 433 166, 432 166 C 431 170, 429 178, 428 188 C 426 205, 424 225, 423 245 C 422 265, 423 285, 425 302 C 427 314, 430 324, 436 330 Z\"\n        fill=\"#1877a8\" stroke=\"#7dd3fc\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n\n  <path id=\"tricepsContracted\"\n        d=\"M 436 330 C 439 316, 443 298, 446 278 C 449 258, 450 238, 448 218 C 447 204, 446 192, 444 182 C 443 174, 440 174, 439 180 C 438 188, 436 188, 435 178 C 434 170, 433 166, 432 166 C 428 174, 421 186, 414 205 C 406 226, 403 250, 405 272 C 408 292, 415 308, 422 320 C 426 326, 431 328, 436 330 Z\"\n        fill=\"#1877a8\" stroke=\"#7dd3fc\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />\n</svg>";

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'joint-layer';
        layer.hidden = true;

        var stage = document.createElement('div');
        stage.className = 'joint-stage';
        layer.appendChild(stage);

        labelBox = document.createElement('div');
        labelBox.className = 'joint-labels';
        stage.appendChild(labelBox);

        wrap.appendChild(layer);

        // Fetch SVG or use embedded fallback
        if (window.location.protocol === 'file:') {
            setupSvg(EMBEDDED_SVG, stage);
        } else {
            fetch(SVG_URL)
                .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
                .then(function (markup) { setupSvg(markup, stage); })
                .catch(function () { setupSvg(EMBEDDED_SVG, stage); });
        }
    }

    /* ── 옆방이 그린 근육 네 벌 ────────────────────────────
       이완형과 수축형은 d 의 명령 차례와 숫자 개수가 같게 그려 달라고 했다.
       그래서 숫자를 하나씩 섞으면 그 사이 모습이 그대로 나온다. */
    var TPL = {};

    function readMuscleTemplates() {
        function grab(id) {
            var e = svg.querySelector('#' + id);
            if (!e) return null;
            var d = e.getAttribute('d');
            e.parentNode.removeChild(e);          // 본은 화면에서 뺀다
            return {
                head: d.replace(/-?\d*\.?\d+/g, '~').split('~'),
                nums: (d.match(/-?\d*\.?\d+/g) || []).map(Number),
                fill: e.getAttribute('fill'),
                edge: e.getAttribute('stroke')
            };
        }
        TPL.bicepsA = grab('bicepsRelaxed');
        TPL.bicepsB = grab('bicepsContracted');
        TPL.tricepsA = grab('tricepsRelaxed');
        TPL.tricepsB = grab('tricepsContracted');
        TPL.ok = !!(TPL.bicepsA && TPL.bicepsB && TPL.tricepsA && TPL.tricepsB &&
                    TPL.bicepsA.nums.length === TPL.bicepsB.nums.length &&
                    TPL.tricepsA.nums.length === TPL.tricepsB.nums.length);
    }

    /** 두 벌 사이를 k(0~1) 만큼 섞은 d */
    function mixPath(a, b, k) {
        var out = '', n = a.nums.length;
        for (var i = 0; i < n; i++) {
            out += a.head[i] + (a.nums[i] + (b.nums[i] - a.nums[i]) * k).toFixed(2);
        }
        return out + a.head[n];
    }

    /** 그려진 두 점(A0→A1)을 지금 두 점(P0→P1)에 맞추는 변환 */
    function fitTransform(A0, A1, P0, P1) {
        var L0 = Math.hypot(A1.x - A0.x, A1.y - A0.y) || 1;
        var L = Math.hypot(P1.x - P0.x, P1.y - P0.y) || 1;
        var th0 = Math.atan2(A1.y - A0.y, A1.x - A0.x) * 180 / Math.PI;
        var th = Math.atan2(P1.y - P0.y, P1.x - P0.x) * 180 / Math.PI;
        return 'translate(' + P0.x.toFixed(2) + ' ' + P0.y.toFixed(2) + ')' +
               ' rotate(' + th.toFixed(2) + ')' +
               ' scale(' + (L / L0).toFixed(4) + ' 1)' +
               ' rotate(' + (-th0).toFixed(2) + ')' +
               ' translate(' + (-A0.x).toFixed(2) + ' ' + (-A0.y).toFixed(2) + ')';
    }

    /** 그림에 박혀 있는 붙는 자리 (그려진 자세 기준) */
    function drawnAnchor(id) {
        var e = svg.querySelector('#' + id);
        return e ? { x: +e.getAttribute('cx'), y: +e.getAttribute('cy') } : null;
    }

    /** 아래팔과 함께 돈 뒤의 붙는 자리 */
    function livedAnchor(id, deg) {
        var a = drawnAnchor(id);
        if (!a) return null;
        var r = (deg - 180) * Math.PI / 180;
        var dx = a.x - ELBOW.x, dy = a.y - ELBOW.y;
        return {
            x: ELBOW.x + dx * Math.cos(r) - dy * Math.sin(r),
            y: ELBOW.y + dx * Math.sin(r) + dy * Math.cos(r)
        };
    }

    function setupSvg(markup, stage) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = markup;
        svg = tempDiv.querySelector('svg');
        if (!svg) return;

        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        stage.insertBefore(svg, stage.firstChild);

        foreGroup = svg.querySelector('#forearm');

        // 옆방이 그린 근육 네 벌을 본으로 삼는다. 화면에는 안 내보내고 숫자만 쓴다.
        readMuscleTemplates();

        // Leader lines group
        leaderGroup = el('g', { id: 'leaderGroup' });
        svg.appendChild(leaderGroup);

        // Muscle elements layer
        buildMuscleLayer();

        // Goniometer arc & display
        buildGoniometer();

        // Drag handle on hand
        // 손잡이가 오갈 수 있는 길을 옅은 점선 호로 깔아 둔다
        travelArc = el('path', {
            fill: 'none', stroke: '#38bdf8', 'stroke-width': 2.5,
            'stroke-dasharray': '8 10', 'stroke-linecap': 'round', opacity: 0.55
        });
        svg.appendChild(travelArc);
        // 그 길 위를 오가는 잔상 — 여기가 움직인다는 것을 눈으로 알린다
        ghost = el('circle', { r: 15, fill: '#7dd3fc', opacity: 0.5 });
        svg.appendChild(ghost);

        // 잡는 자리인 줄 알아보게 맥박처럼 퍼지는 고리를 두른다.
        // 한 번 잡고 나면 멎는다 — 계속 반짝이면 그것도 소음이다.
        handleRing = el('circle', { fill: 'none', stroke: '#38bdf8', 'stroke-width': 3 });
        svg.appendChild(handleRing);
        handle = el('circle', { r: HANDLE_R, fill: '#38bdf8', stroke: '#e0f2fe', 'stroke-width': 3, cursor: 'grab' });
        svg.appendChild(handle);

        buildLabels();
        bindDrag();

        loaded = true;
        render();
        placeLabels();
    }

    /** 근육 배, 다발성 근섬유, 힘줄 콜라겐 결 객체 생성 */
    function createMuscleObject(parent) {
        var g = el('g');
        parent.appendChild(g);

        // 힘줄은 늘이고 줄이는 변환을 받지 않도록 따로 둔다
        var tg = el('g');
        parent.appendChild(tg);
        var tTop = el('path', { fill: 'none', stroke: TENDON, 'stroke-width': 8, 'stroke-linecap': 'round' });
        var tTopCore = el('path', { fill: 'none', stroke: TENDON_CORE, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
        var tEnd = el('path', { fill: 'none', stroke: TENDON, 'stroke-width': 8, 'stroke-linecap': 'round' });
        var tEndCore = el('path', { fill: 'none', stroke: TENDON_CORE, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
        tg.appendChild(tTop);
        tg.appendChild(tTopCore);
        tg.appendChild(tEnd);
        tg.appendChild(tEndCore);

        // 근육 본체
        var body = el('path', { 'stroke-linejoin': 'round' });
        g.appendChild(body);

        // 다발성 근섬유 결 (6가닥)
        var fibers = [];
        for (var i = 0; i < 6; i++) {
            var f = el('path', { fill: 'none', 'stroke-linecap': 'round' });
            g.appendChild(f);
            fibers.push(f);
        }

        // 중앙 텐션 능선 하이라이트 (Crest line)
        var crest = el('path', { fill: 'none', 'stroke-linecap': 'round' });
        g.appendChild(crest);

        return {
            group: g,
            tendonGroup: tg,
            body: body,
            fibers: fibers,
            crest: crest,
            tendonTop: tTop,
            tendonTopCore: tTopCore,
            tendonEnd: tEnd,
            tendonEndCore: tEndCore
        };
    }

    function buildMuscleLayer() {
        var muscleGroup = el('g', { id: 'muscleLayer' });
        svg.appendChild(muscleGroup);

        tricepsObj = createMuscleObject(muscleGroup);
        bicepsObj = createMuscleObject(muscleGroup);

        // 팔꿈치 관절 윤활액 및 연골 인디케이터
        var jointG = el('g', { id: 'elbowJointVisual' });
        svg.appendChild(jointG);
        jointG.appendChild(el('circle', { cx: ELBOW.x, cy: ELBOW.y, r: 18, fill: '#fbbf24', opacity: 0.24 }));
        jointG.appendChild(el('circle', { cx: ELBOW.x, cy: ELBOW.y, r: 8, fill: '#fbbf24', stroke: '#ffffff', 'stroke-width': 1.5 }));
    }

    function buildGoniometer() {
        angleArc = el('path', { fill: 'none', stroke: '#fbbf24', 'stroke-width': 3, opacity: 0.8 });
        svg.appendChild(angleArc);
    }

    function jointAngle() {
        var s = document.getElementById('angleSlider');
        var v = s ? parseFloat(s.value) : 75;
        if (isNaN(v)) v = 75;
        return Math.max(30, Math.min(180, v));
    }

    function setJointAngle(v) {
        var s = document.getElementById('angleSlider');
        if (!s) return;
        s.value = Math.round(Math.max(30, Math.min(180, v)));
        s.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function foreDir(deg) {
        var phi = (180 - deg) * Math.PI / 180;
        return { x: Math.sin(phi), y: Math.cos(phi) };
    }

    /* ── 실시간 렌더링 루프 ─────────────────────────────────── */

    function render() {
        if (!svg || !loaded || layer.hidden) return;

        var deg = jointAngle();
        var flex = (180 - deg) / 150;            // 0 = 완전 폄, 1 = 최대 굽힘
        var d = foreDir(deg);
        var n = { x: d.y, y: -d.x };             // 아래팔 앞쪽(노뼈 쪽) 법선
        var t = nowMs();

        // 1. 아래팔 묶음 회전
        if (foreGroup) {
            foreGroup.setAttribute('transform',
                'rotate(' + (deg - 180).toFixed(2) + ' ' + ELBOW.x + ' ' + ELBOW.y + ')');
        }

        var isFlexed = flex > 0.5;

        // 2. 근육: 옆방이 그린 이완형·수축형을 섞고, 붙는 두 점에 맞춰 늘인다
        if (TPL.ok) {
            paintMuscle(bicepsObj, TPL.bicepsA, TPL.bicepsB, flex,
                'attachBicepsOrigin', 'attachBicepsInsertion', deg,
                isFlexed ? '#e11d48' : '#8f2440', isFlexed ? '#ffe4e6' : '#c05a72');
            paintMuscle(tricepsObj, TPL.tricepsA, TPL.tricepsB, 1 - flex,
                'attachTricepsOrigin', 'attachTricepsInsertion', deg,
                isFlexed ? '#0f4f70' : '#0284c7', isFlexed ? '#4a7f9c' : '#e0f2fe');
        }

        // 3. 각도계 호 갱신
        drawAngle(deg, d);

        // 4. 손잡이 자리
        var wrist = { x: ELBOW.x + d.x * FORE_LEN, y: ELBOW.y + d.y * FORE_LEN };
        handle.setAttribute('cx', wrist.x.toFixed(1));
        handle.setAttribute('cy', wrist.y.toFixed(1));

        handleRing.setAttribute('cx', wrist.x.toFixed(1));
        handleRing.setAttribute('cy', wrist.y.toFixed(1));
        if (everDragged) {
            handleRing.setAttribute('opacity', 0);
            travelArc.setAttribute('opacity', 0);
            ghost.setAttribute('opacity', 0);
        } else {
            // 30도에서 180도까지 손목이 지나는 길
            var arcD = '';
            for (var ad = 30; ad <= 180; ad += 5) {
                var dd = foreDir(ad);
                arcD += (arcD ? ' L' : 'M') + (ELBOW.x + dd.x * FORE_LEN).toFixed(1) + ' ' +
                        (ELBOW.y + dd.y * FORE_LEN).toFixed(1);
            }
            travelArc.setAttribute('d', arcD);
            travelArc.setAttribute('opacity', 0.55);

            // 잔상이 길 위를 천천히 오간다
            var sway = (nowMs() % 2600) / 2600;
            var back = sway < 0.5 ? sway * 2 : (1 - sway) * 2;   // 0 ➔ 1 ➔ 0
            var gd = foreDir(30 + back * 150);
            ghost.setAttribute('cx', (ELBOW.x + gd.x * FORE_LEN).toFixed(1));
            ghost.setAttribute('cy', (ELBOW.y + gd.y * FORE_LEN).toFixed(1));
            ghost.setAttribute('opacity', 0.5);

            var beat = (nowMs() % 1400) / 1400;          // 0 ~ 1 을 되풀이
            var hr = handle ? parseFloat(handle.getAttribute('r')) || HANDLE_R : HANDLE_R;
            handleRing.setAttribute('r', (hr + beat * 20).toFixed(1));
            handleRing.setAttribute('opacity', (0.9 * (1 - beat)).toFixed(2));
        }

        // 5. 이름표 가리킴선 자리
        var bMid = midOf('attachBicepsOrigin', 'attachBicepsInsertion', deg);
        var tMid = midOf('attachTricepsOrigin', 'attachTricepsInsertion', deg);
        moveLabel('biceps', bMid.x + 24, bMid.y);
        moveLabel('triceps', tMid.x - 24, tMid.y);
        moveLabel('forearm', ELBOW.x + d.x * 150 - n.x * 26, ELBOW.y + d.y * 150 - n.y * 26);
        var bIns = livedAnchor('attachBicepsInsertion', deg);
        if (bIns) moveLabel('tendon', bIns.x, bIns.y);
    }

    /**
     * 옆방이 그린 두 벌을 k 만큼 섞어, 지금 붙는 두 점에 맞춰 앉힌다.
     * 두께는 그림이 이미 지고 있으므로 축 방향으로만 늘인다.
     */
    function paintMuscle(mObj, tplA, tplB, k, originId, insertId, deg, fill, edge) {
        k = Math.max(0, Math.min(1, k));
        var A0 = drawnAnchor(originId), A1 = drawnAnchor(insertId);
        var P0 = A0;                                   // 시작 자리는 움직이지 않는다
        var P1 = livedAnchor(insertId, deg);           // 끝 자리는 아래팔을 따라 돈다
        if (!A0 || !A1 || !P1) return;

        mObj.body.setAttribute('d', mixPath(tplA, tplB, k));
        mObj.body.setAttribute('fill', fill);
        mObj.body.setAttribute('stroke', edge);
        mObj.body.setAttribute('stroke-width', 2.5);
        mObj.group.setAttribute('transform', fitTransform(A0, A1, P0, P1));
        if (mObj.tendonGroup) mObj.tendonGroup.removeAttribute('transform');

        // 힘줄: 근육 양 끝에서 뼈에 닿는 짧은 흰 띠. 근육과 뼈를 잇는 것이 힘줄이다.
        var ux = (P1.x - P0.x) / (Math.hypot(P1.x - P0.x, P1.y - P0.y) || 1);
        var uy = (P1.y - P0.y) / (Math.hypot(P1.x - P0.x, P1.y - P0.y) || 1);
        var len = Math.hypot(P1.x - P0.x, P1.y - P0.y);
        var tl = Math.min(len * 0.16, 34);
        mObj.tendonTop.setAttribute('d',
            'M' + P0.x.toFixed(1) + ' ' + P0.y.toFixed(1) +
            ' L' + (P0.x + ux * tl).toFixed(1) + ' ' + (P0.y + uy * tl).toFixed(1));
        mObj.tendonEnd.setAttribute('d',
            'M' + (P1.x - ux * tl).toFixed(1) + ' ' + (P1.y - uy * tl).toFixed(1) +
            ' L' + P1.x.toFixed(1) + ' ' + P1.y.toFixed(1));
        mObj.tendonTopCore.setAttribute('d', '');
        mObj.tendonEndCore.setAttribute('d', '');
        mObj.fibers.forEach(function (f) { f.setAttribute('d', ''); });
        mObj.crest.setAttribute('d', '');
    }

    /**
     * 방추형 근육 배와 근섬유 다발(Fibers), 콜라겐 힘줄 렌더링
     */
    function drawMuscleDynamic(mObj, a, b, w, side, isContracted, isBiceps, time) {
        var vx = b.x - a.x, vy = b.y - a.y;
        var len = Math.hypot(vx, vy) || 1;
        var ux = vx / len, uy = vy / len;
        var px = -uy * side, py = ux * side;

        var tLen = Math.min(len * 0.20, 56);
        var t1 = { x: a.x + ux * tLen, y: a.y + uy * tLen };
        var t2 = { x: b.x - ux * tLen, y: b.y - uy * tLen };
        var mid = { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 };

        var peakRatio = isContracted ? 0.46 : 0.50;
        var mOut = {
            x: a.x + ux * (len * peakRatio) + px * w,
            y: a.y + uy * (len * peakRatio) + py * w
        };
        var mInn = {
            x: mid.x - px * w * 0.28,
            y: mid.y - py * w * 0.28
        };

        // 색상 지정
        var fillCol = isBiceps
            ? (isContracted ? '#e11d48' : '#7f1d3a')
            : (isContracted ? '#0284c7' : '#0b4a6f');
        var edgeCol = isBiceps
            ? (isContracted ? '#fecdd3' : '#9f1239')
            : (isContracted ? '#bae6fd' : '#0369a1');

        mObj.body.setAttribute('d',
            'M' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1) +
            ' Q' + mOut.x.toFixed(1) + ' ' + mOut.y.toFixed(1) + ' ' + t2.x.toFixed(1) + ' ' + t2.y.toFixed(1) +
            ' Q' + mInn.x.toFixed(1) + ' ' + mInn.y.toFixed(1) + ' ' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1) + ' Z');
        mObj.body.setAttribute('fill', fillCol);
        mObj.body.setAttribute('stroke', edgeCol);
        mObj.body.setAttribute('stroke-width', isContracted ? '2.8' : '1.8');

        // 은백색 힘줄 다발
        mObj.tendonTop.setAttribute('d', 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' L' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1));
        mObj.tendonTopCore.setAttribute('d', 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' L' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1));
        mObj.tendonEnd.setAttribute('d', 'M' + t2.x.toFixed(1) + ' ' + t2.y.toFixed(1) + ' L' + b.x.toFixed(1) + ' ' + b.y.toFixed(1));
        mObj.tendonEndCore.setAttribute('d', 'M' + t2.x.toFixed(1) + ' ' + t2.y.toFixed(1) + ' L' + b.x.toFixed(1) + ' ' + b.y.toFixed(1));

        // 6가닥 근섬유 다발 결 (수축 텐션 애니메이션 포함)
        var fiberCount = mObj.fibers.length;
        for (var f = 0; f < fiberCount; f++) {
            var frac = (f + 1) / (fiberCount + 1);
            var fiberW = (frac - 0.28) / 0.72;
            var fPeak = {
                x: mid.x + px * w * fiberW,
                y: mid.y + py * w * fiberW
            };

            // 수축 시 파동치는 텐션 글리머
            var shimmer = isContracted
                ? (0.42 + Math.sin(time * 0.006 + f * 1.15) * 0.32)
                : 0.22;

            var fColor = isContracted
                ? (isBiceps ? 'rgba(254, 205, 211, ' : 'rgba(224, 242, 254, ') + shimmer.toFixed(2) + ')'
                : (isBiceps ? 'rgba(244, 63, 94, 0.22)' : 'rgba(56, 189, 248, 0.22)');

            mObj.fibers[f].setAttribute('d',
                'M' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1) +
                ' Q' + fPeak.x.toFixed(1) + ' ' + fPeak.y.toFixed(1) + ' ' + t2.x.toFixed(1) + ' ' + t2.y.toFixed(1));
            mObj.fibers[f].setAttribute('stroke', fColor);
            mObj.fibers[f].setAttribute('stroke-width', (f === 2 || f === 3) ? '2' : '1.4');
        }

        // 중앙 텐션 능선 (Crest)
        var crestPeak = {
            x: mid.x + px * w * 0.46,
            y: mid.y + py * w * 0.46
        };
        mObj.crest.setAttribute('d',
            'M' + t1.x.toFixed(1) + ' ' + t1.y.toFixed(1) +
            ' Q' + crestPeak.x.toFixed(1) + ' ' + crestPeak.y.toFixed(1) + ' ' + t2.x.toFixed(1) + ' ' + t2.y.toFixed(1));
        mObj.crest.setAttribute('stroke', isContracted ? (isBiceps ? '#fff1f2' : '#f0f9ff') : 'transparent');
        mObj.crest.setAttribute('stroke-width', isContracted ? '2.4' : '0');
        mObj.crest.setAttribute('opacity', isContracted ? (0.65 + Math.sin(time * 0.008) * 0.25).toFixed(2) : '0');
    }

    function midOf(originId, insertId, deg) {
        var a = drawnAnchor(originId), b = livedAnchor(insertId, deg);
        if (!a || !b) return { x: ELBOW.x, y: ELBOW.y };
        return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    function drawAngle(deg, d) {
        var r = 62;
        var a0 = { x: ELBOW.x, y: ELBOW.y - r };
        var a1 = { x: ELBOW.x + d.x * r, y: ELBOW.y + d.y * r };
        angleArc.setAttribute('d',
            'M' + a0.x.toFixed(1) + ' ' + a0.y.toFixed(1) +
            ' A' + r + ' ' + r + ' 0 ' + (deg > 180 ? 1 : 0) + ' 1 ' + a1.x.toFixed(1) + ' ' + a1.y.toFixed(1));

        var bx = d.x + 0, by = d.y - 1;
        var blen = Math.hypot(bx, by);
        if (blen < 0.02) { bx = 1; by = 0; blen = 1; }
        var ux = bx / blen, uy = by / blen;
        var tx = ELBOW.x + ux * (r + 38);
        var ty = ELBOW.y + uy * (r + 38);
        angleAt.x = ELBOW.x + ux * (r + 38);
        angleAt.y = ELBOW.y + uy * (r + 38);
        anglePlate.textContent = Math.round(deg) + '°';
    }

    function moveLabel(id, sx, sy) {
        for (var i = 0; i < LABELS.length; i++) {
            if (LABELS[i].id === id) { LABELS[i].sx = sx; LABELS[i].sy = sy; return; }
        }
    }

    function buildLabels() {
        labelBox.innerHTML = '';
        while (leaderGroup.firstChild) leaderGroup.removeChild(leaderGroup.firstChild);
        LABELS.forEach(function (item) {
            item._line = el('line', {
                stroke: 'rgba(148, 163, 184, 0.65)', 'stroke-width': 1.6
            });
            leaderGroup.appendChild(item._line);

            var tag = document.createElement('span');
            tag.className = 'joint-tag';
            tag.dataset.for = item.id;
            tag.textContent = item.text;
            tag.tabIndex = 0;
            tag.setAttribute('role', 'button');
            function selectPart() {
                var details = {
                    humerus: '어깨에서 팔꿈치까지 이어지는 위팔의 뼈입니다.',
                    triceps: '팔을 펼 때 수축하고, 굽힐 때 이완하는 근육입니다.',
                    joint: '팔꿈치에서 뼈가 만납니다. 연골과 윤활액이 마찰을 줄입니다.',
                    forearm: '아래팔에는 노뼈와 자뼈 두 개가 있습니다.',
                    biceps: '팔을 굽힐 때 수축하고, 펼 때 이완하는 근육입니다.',
                    tendon: '근육의 힘을 뼈로 전달하는 연결 조직입니다.'
                };
                document.getElementById('organTitle').textContent = item.text;
                document.getElementById('organDesc').textContent = details[item.id];
                labelBox.querySelectorAll('.joint-tag').forEach(function (t) { t.classList.toggle('picked', t === tag); });
            }
            tag.addEventListener('click', selectPart);
            tag.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPart(); }
            });
            labelBox.appendChild(tag);
            item._tag = tag;
        });
    
        anglePlate = document.createElement('span');
        anglePlate.className = 'joint-angle-tag';
        labelBox.appendChild(anglePlate);

    }

    // 손잡이는 그림과 함께 줄어들면 안 된다. 화면이 좁아도 손가락이 닿아야 한다.
    // 우리 사이트에서 누르는 자리는 지름 44px 이 기준이다.
    var HANDLE_R = 21;          // 그림에 그린 크기
    var HANDLE_MIN_PX = 44;     // 화면에서 이보다 작아지지 않는다

    function handleRadius(k) {
        if (!k) return HANDLE_R;
        return Math.max(HANDLE_R, (HANDLE_MIN_PX / 2) / k);
    }

    function placeLabels() {
        if (!svg || !labelBox || layer.hidden) return;
        var box = svg.getBoundingClientRect();
        if (!box.width) return;
        var vb = svg.viewBox.baseVal;
        var k = Math.min(box.width / vb.width, box.height / vb.height);
        var offX = (box.width - vb.width * k) / 2;
        var offY = (box.height - vb.height * k) / 2;

        if (handle) handle.setAttribute('r', handleRadius(k).toFixed(1));

        if (anglePlate) {
            anglePlate.style.left = (offX + angleAt.x * k) + 'px';
            anglePlate.style.top = (offY + angleAt.y * k) + 'px';
        }

        LABELS.forEach(function (item) {
            if (!item._tag) return;
            item._line.setAttribute('x1', item.sx.toFixed(1));
            item._line.setAttribute('y1', item.sy.toFixed(1));
            item._line.setAttribute('x2', item.ax);
            item._line.setAttribute('y2', item.ay);
            item._tag.style.left = (offX + item.ax * k) + 'px';
            item._tag.style.top = (offY + item.ay * k) + 'px';
        });
    }

    function bindDrag() {
        handle.addEventListener('pointerdown', function (e) {
            dragging = true;
            everDragged = true;
            handle.setAttribute('cursor', 'grabbing');
            if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        window.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            var box = svg.getBoundingClientRect();
            if (!box.width) return;
            var vb = svg.viewBox.baseVal;
            var k = Math.min(box.width / vb.width, box.height / vb.height);
            var offX = (box.width - vb.width * k) / 2;
            var offY = (box.height - vb.height * k) / 2;
            var vx = (e.clientX - box.left - offX) / k - ELBOW.x;
            var vy = (e.clientY - box.top - offY) / k - ELBOW.y;
            var phi = Math.atan2(vx, vy) * 180 / Math.PI;
            setJointAngle(180 - phi);
        });
        window.addEventListener('pointerup', function () {
            if (!dragging) return;
            dragging = false;
            handle.setAttribute('cursor', 'grab');
        });
    }

    function loop() {
        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }
        if (layer && !layer.hidden && loaded) {
            render();
            placeLabels();
        }
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
