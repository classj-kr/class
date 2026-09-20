/**
 * 2022 개정 교육과정 인체 생체역학·생리학 시뮬레이션 공통 엔진 코어
 * High-performance 60fps Loop, Touch Physics, Web Audio Synthesizer, Quiz Engine
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SimEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ------------------------------------------------------------------------
    // Web Audio Synthesizer for Biomechanical Feedback
    // ------------------------------------------------------------------------
    var audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    var SoundFX = {
        playHeartbeat: function (pitch) {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var now = ctx.currentTime;
                pitch = pitch || 1.0;

                // Lub (AV valve closure)
                var osc1 = ctx.createOscillator();
                var gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(65 * pitch, now);
                osc1.frequency.exponentialRampToValueAtTime(30 * pitch, now + 0.12);
                gain1.gain.setValueAtTime(0.3, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.13);

                // Dub (Semilunar valve closure)
                var osc2 = ctx.createOscillator();
                var gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(95 * pitch, now + 0.15);
                osc2.frequency.exponentialRampToValueAtTime(45 * pitch, now + 0.25);
                gain2.gain.setValueAtTime(0.22, now + 0.15);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(now + 0.15);
                osc2.stop(now + 0.26);
            } catch (e) {
                // Ignore audio errors on muted/restricted environments
            }
        },

        playBreath: function (isInhale) {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var now = ctx.currentTime;
                var bufferSize = ctx.sampleRate * 0.4;
                var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                var data = buffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.08;
                }
                var noise = ctx.createBufferSource();
                noise.buffer = buffer;

                var filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(isInhale ? 450 : 320, now);
                filter.Q.setValueAtTime(2.0, now);

                var gain = ctx.createGain();
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(now);
                noise.stop(now + 0.41);
            } catch (e) {}
        },

        playClick: function () {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var now = ctx.currentTime;
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.045);
            } catch (e) {}
        },

        playPulse: function () {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var now = ctx.currentTime;

                // Rising zap (action potential / power stroke / handle grab)
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.09);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                var filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2400, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.19);
            } catch (e) {}
        },

        playCorrect: function () {
            try {
                var ctx = getAudioContext();
                if (!ctx) return;
                var now = ctx.currentTime;
                [523.25, 659.25, 783.99, 1046.50].forEach(function (freq, idx) {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    var startTime = now + idx * 0.07;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.15, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(startTime);
                    osc.stop(startTime + 0.26);
                });
            } catch (e) {}
        }
    };

    // ------------------------------------------------------------------------
    // HiDPI Canvas Manager
    // ------------------------------------------------------------------------
    function setupCanvas(canvas) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        
        var width = rect.width || canvas.clientWidth || 800;
        var height = rect.height || canvas.clientHeight || 600;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        return {
            ctx: ctx,
            width: width,
            height: height,
            dpr: dpr
        };
    }

    // ------------------------------------------------------------------------
    // Touch & Pointer Gesture Binder
    // ------------------------------------------------------------------------
    function bindDrag(element, onStart, onMove, onEnd) {
        var isDragging = false;
        var startX = 0, startY = 0;

        function getCoords(e) {
            if (e.touches && e.touches.length > 0) {
                var rect = element.getBoundingClientRect();
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top,
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                };
            }
            var rect = element.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                clientX: e.clientX,
                clientY: e.clientY
            };
        }

        function handleStart(e) {
            isDragging = true;
            var pos = getCoords(e);
            startX = pos.x;
            startY = pos.y;
            if (onStart) onStart(pos, e);
        }

        function handleMove(e) {
            if (!isDragging) return;
            var pos = getCoords(e);
            if (onMove) onMove(pos, { dx: pos.x - startX, dy: pos.y - startY }, e);
        }

        function handleEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            if (onEnd) onEnd(e);
        }

        element.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);

        element.addEventListener('touchstart', function(e) {
            if (e.cancelable) e.preventDefault();
            handleStart(e);
        }, { passive: false });

        window.addEventListener('touchmove', function(e) {
            if (isDragging && e.cancelable) e.preventDefault();
            handleMove(e);
        }, { passive: false });

        window.addEventListener('touchend', handleEnd);
        window.addEventListener('touchcancel', handleEnd);
    }

    // ------------------------------------------------------------------------
    // Exam Quiz Component Helper
    // ------------------------------------------------------------------------
    function renderQuiz(containerEl, quizData, onAnswerCallback) {
        if (!containerEl || !quizData) return;
        
        var html = '<div class="sim-quiz-container">' +
            '<div class="sim-quiz-question">' + quizData.question + '</div>' +
            '<div class="sim-quiz-options">';
            
        quizData.options.forEach(function (opt, idx) {
            html += '<button class="sim-quiz-opt-btn" data-opt-idx="' + idx + '">' + (idx + 1) + '. ' + opt + '</button>';
        });
        
        html += '</div><div class="sim-quiz-explanation" style="display:none;"></div></div>';
        containerEl.innerHTML = html;

        var optBtns = containerEl.querySelectorAll('.sim-quiz-opt-btn');
        var expEl = containerEl.querySelector('.sim-quiz-explanation');

        optBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var selectedIdx = parseInt(btn.dataset.optIdx, 10);
                var isCorrect = (selectedIdx === quizData.answer);
                
                optBtns.forEach(function (b, bIdx) {
                    b.disabled = true;
                    if (bIdx === quizData.answer) {
                        b.classList.add('correct');
                    } else if (bIdx === selectedIdx && !isCorrect) {
                        b.classList.add('wrong');
                    }
                });

                expEl.style.display = 'block';
                expEl.innerHTML = '<strong>' + (isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.') + '</strong> ' + quizData.explanation;
                
                if (isCorrect) {
                    SoundFX.playCorrect();
                } else {
                    SoundFX.playClick();
                }

                if (onAnswerCallback) onAnswerCallback(isCorrect, selectedIdx);
            });
        });
    }

    /**
     * 문제 여러 개를 차례로 풀게 한다.
     * 전에는 각 쪽이 quizzes[0] 하나만 그려서 2번 문제가 나오지 않았다.
     */
    function renderQuizSet(containerEl, quizzes) {
        if (!containerEl || !quizzes || !quizzes.length) return;

        var idx = 0;

        function show() {
            renderQuiz(containerEl, quizzes[idx], function () {
                if (quizzes.length < 2) return;

                var nav = document.createElement('div');
                nav.className = 'sim-quiz-nav';

                var counter = document.createElement('span');
                counter.className = 'sim-quiz-counter';
                counter.textContent = (idx + 1) + ' / ' + quizzes.length;
                nav.appendChild(counter);

                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'sim-quiz-next-btn';
                btn.textContent = idx < quizzes.length - 1 ? '다음 문제 ➔' : '처음부터 다시 ↺';
                btn.addEventListener('click', function () {
                    idx = (idx + 1) % quizzes.length;
                    show();
                    SoundFX.playClick();
                });
                nav.appendChild(btn);

                containerEl.querySelector('.sim-quiz-container').appendChild(nav);
            });

            // 문제를 넘기기 전에도 몇 번째인지는 보이게 한다
            if (quizzes.length > 1) {
                var head = document.createElement('div');
                head.className = 'sim-quiz-counter';
                head.textContent = '문제 ' + (idx + 1) + ' / ' + quizzes.length;
                var box = containerEl.querySelector('.sim-quiz-container');
                if (box) box.insertBefore(head, box.firstChild);
            }
        }

        show();
    }

    /**
     * 캔버스 핀에 붙일 짧은 이름표를 고른다.
     * spot.label 이 있으면 그대로 쓰고, 없으면 title 앞머리를 다듬어 쓴다.
     * ('1. 사구체 여과' -> '사구체 여과')
     */
    function pinLabel(spot) {
        if (!spot) return '';
        if (spot.label) return spot.label;

        var text = String(spot.title || '');
        text = text.replace(/^\s*\d+[.)]\s*/, '');          // 앞의 번호 제거
        text = text.split(/\s*[(（]|\s+[-–—]\s+|\s*&\s*/)[0]; // 괄호·붙임표·& 앞까지
        text = text.trim();

        if (!text) text = String(spot.title || '').trim();
        if (text.length > 10) text = text.slice(0, 9) + '…';
        return text;
    }

    /**
     * 장면 단추를 누르면 오른쪽 설명 카드를 그 장면의 안내로 되돌린다.
     * 단추에 data-intro 가 있으면 그 문장을, 없으면 기본 안내를 쓴다.
     * 단추가 나중에 더해져도 듣도록 바탕 요소에 한 번만 건다.
     */
    function bindSceneIntro() {
        var bar = document.querySelector('.scene-switcher');
        if (!bar || bar.dataset.introBound) return;
        bar.dataset.introBound = '1';

        bar.addEventListener('click', function (event) {
            var btn = event.target.closest ? event.target.closest('.scene-btn') : null;
            if (!btn || !bar.contains(btn)) return;

            var titleEl = document.getElementById('organTitle');
            var descEl = document.getElementById('organDesc');
            var card = document.getElementById('organDetailCard');
            if (!titleEl || !descEl) return;

            var name = String(btn.textContent || '').replace(/^\s*\S*\s*\d+\.\s*/, '').trim();
            titleEl.textContent = name;
            descEl.innerHTML = btn.dataset.intro ||
                '그림 위의 이름표를 눌러 자세한 설명을 보세요.';
            if (card) card.style.display = 'block';
            var std = document.getElementById('organStandard');
            if (std) std.textContent = '';
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindSceneIntro);
    } else {
        bindSceneIntro();
    }

    /* ── 일시정지 ─────────────────────────────────────────────
       머리글의 [일시정지] 단추를 공용으로 받는다.
       now() 는 멈춰 있는 동안 흐르지 않는 시계라, 시간으로 움직이는
       장면도 이 시계만 쓰면 함께 멈춘다.                                */
    var paused = false;
    var clock = 0, lastReal = 0;

    function tickClock(t) {
        if (!lastReal) lastReal = t;
        if (!paused) clock += (t - lastReal);
        lastReal = t;
        requestAnimationFrame(tickClock);
    }
    requestAnimationFrame(tickClock);

    function bindPause() {
        var b = document.getElementById('playPauseBtn');
        if (!b || b.dataset.pauseBound) return;
        b.dataset.pauseBound = '1';
        b.addEventListener('click', function () { paused = !paused; });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { bindPause(); bindSceneTabs(); });
    } else {
        bindPause();
        bindSceneTabs();
    }

    /**
     * 그림 조각을 한 쪽에 여러 장 얹을 때 이름이 겹치지 않게 갈아 끼운다.
     *
     * 옆방이 그린 도식들이 gradCerebrum 같은 흔한 이름을 저마다 쓰고 있다.
     * 신경계 방은 뇌 도식과 반사 중추 도식을 한 쪽에 같이 얹는데, 이름이
     * 겹치면 나중 것이 앞의 것 색을 가져다 써서 엉뚱하게 칠해진다.
     * (실제로 대뇌가 통째로 빈 것처럼 보였다.)
     *
     * defs 안의 이름 앞에 표를 붙이고, 그것을 가리키는 url(#...) 도 같이 고친다.
     * 조각 자체의 이름(cerebrum 같은 것)은 건드리지 않는다. 엔진이 그 이름으로 찾는다.
     */
    function isolateSvgIds(markup, prefix) {
        if (!markup || !prefix) return markup;
        var doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
        var svg = doc.querySelector('svg');
        if (!svg) return markup;

        var defs = svg.querySelectorAll('defs [id]');
        if (!defs.length) return markup;

        var map = {};
        [].forEach.call(defs, function (e) {
            var old = e.getAttribute('id');
            if (!old) return;
            map[old] = prefix + '-' + old;
            e.setAttribute('id', map[old]);
        });

        var keys = Object.keys(map);
        if (!keys.length) return markup;

        // url(#이름) 과 xlink:href="#이름" 을 모두 바꾼다
        var ATTRS = ['fill', 'stroke', 'filter', 'clip-path', 'mask',
            'marker-start', 'marker-mid', 'marker-end', 'style'];
        [].forEach.call(svg.querySelectorAll('*'), function (e) {
            ATTRS.forEach(function (a) {
                var v = e.getAttribute(a);
                if (!v || v.indexOf('#') < 0) return;
                var out = v;
                keys.forEach(function (k) {
                    out = out.split('url(#' + k + ')').join('url(#' + map[k] + ')');
                    out = out.split("url('#" + k + "')").join("url('#" + map[k] + "')");
                    out = out.split('url("#' + k + '")').join('url("#' + map[k] + '")');
                });
                if (out !== v) e.setAttribute(a, out);
            });
            ['href', 'xlink:href'].forEach(function (a) {
                var v = e.getAttribute(a);
                if (!v || v.charAt(0) !== '#') return;
                var k = v.slice(1);
                if (map[k]) e.setAttribute(a, '#' + map[k]);
            });
        });

        return new XMLSerializer().serializeToString(svg);
    }

    /**
     * 이름표를 눌렀을 때 그 조각에 노란 테를 두른다.
     *
     * 도식은 조각이 겹쳐 있어서 글자만 바뀌면 어느 것을 눌렀는지 알 수 없다.
     * (눈 장면에서 각막·홍채·동공·수정체·진대·섬모체 여섯이 겹쳐 있는데
     *  눌러도 불이 안 들어와 무엇을 골랐는지 알 길이 없었다.)
     *
     * svgEl   : 겹판 안의 <svg>
     * ids     : 이 장면에서 고를 수 있는 조각 이름들
     * activeId: 지금 고른 것 (없으면 모두 되돌린다)
     */
    // 고른 조각의 테두리가 천천히 숨 쉬게 한다.
    // 멈춰 있는 테두리보다 어디를 골랐는지 훨씬 잘 보인다.
    // 눈이 피로하지 않게 느리게(1.6초 한 번) 그리고 은은하게 (굵기 4~6, 진하기 1~0.5).
    // rAF 가 아니라 SVG 자체 움직임(SMIL)이라 화면이 멈춰 있어도 돈다.
    var GLOW_MARK = 'engineGlow';

    function clearGlow(sh) {
        [].slice.call(sh.querySelectorAll('animate')).forEach(function (a) {
            if (a.getAttribute('data-' + GLOW_MARK) !== null) a.remove();
        });
    }

    function addGlow(sh) {
        var NS = 'http://www.w3.org/2000/svg';
        [['stroke-width', '4;6;4'], ['stroke-opacity', '1;0.5;1']].forEach(function (pair) {
            var a = document.createElementNS(NS, 'animate');
            a.setAttribute('attributeName', pair[0]);
            a.setAttribute('values', pair[1]);
            a.setAttribute('dur', '1.6s');
            a.setAttribute('repeatCount', 'indefinite');
            a.setAttribute('calcMode', 'spline');
            a.setAttribute('keyTimes', '0;0.5;1');
            a.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
            a.setAttribute('data-' + GLOW_MARK, '1');
            sh.appendChild(a);
        });
    }

    /**
     * 옥칸의 손잡이를 장면에 묶는다.
     *
     * 어느 태그에든 data-for-scene="lab" 처럼 적어 두면 그 장면일 때만 보인다.
     * 갈피 단추에도, 갈피 안의 손잡이 묶음(meter-card)에도 붙일 수 있다.
     * (전신 소화관 화면에 시험관·검출 시약이 떠 있던 것을 막는다.)
     *
     * 갈피 단추에 붙이는 것은 조심해야 한다. 그 갈피 안에 기관 설명 칸
     * (#organDetailCard) 이 들어 있으면, 갈피를 숨기는 순간 그림을 눌러도
     * 설명이 보이지 않는다. 실제로 자율신경·눈·귀 장면에서 그러했다.
     * 그래서 설명 칸을 품은 갈피는 숨기지 않고, 안의 손잡이 묶음만 숨긴다.
     */
    function bindSceneTabs() {
        var tabs = [].slice.call(document.querySelectorAll('.sidebar-tab-btn'));
        var marked = [].slice.call(document.querySelectorAll('[data-for-scene]'));
        if (!tabs.length && !marked.length) return;

        function activeScene() {
            var b = document.querySelector('.scene-btn.active');
            return b ? b.dataset.scene : null;
        }

        function wants(el, scene) {
            var only = el.getAttribute('data-for-scene');
            if (!only) return true;
            return only.split(',').some(function (x) { return x.trim() === scene; });
        }

        // 설명 칸을 품은 갈피는 숨길 수 없다 — 그림을 눌렀을 때 글이 갈 곳이 없어진다
        var holder = document.getElementById('organDetailCard');
        var holderPanel = holder ? holder.closest('.sidebar-tab-panel') : null;
        if (holderPanel) {
            tabs.forEach(function (t) {
                if (t.dataset.tab && ('tabPanel_' + t.dataset.tab) === holderPanel.id) {
                    t.removeAttribute('data-for-scene');
                }
            });
        }

        function apply() {
            var scene = activeScene();
            if (!scene) return;
            var hidActive = false;
            tabs.forEach(function (t) {
                var show = wants(t, scene);
                t.hidden = !show;
                if (!show && t.classList.contains('active')) hidActive = true;
            });
            marked.forEach(function (el) {
                if (el.classList.contains('sidebar-tab-btn')) return;
                var show = wants(el, scene);
                // hidden 하나만으로는 모자란다. 칸에 display 가 박혀 있으면 그것이 이긴다.
                el.hidden = !show;
                el.style.display = show ? '' : 'none';
            });
            // 멈춤 단추가 숨는 장면으로 옮길 때, 멈춰 둔 채였다면 풀어 준다.
            // 안 그러면 단추가 사라진 채로 온 방이 얼어붙어 되돌릴 길이 없다.
            var pp = document.getElementById('playPauseBtn');
            if (pp && pp.hidden && paused) pp.click();

            // 보고 있던 갈피가 숨으면 첫 번째로 보이는 갈피로 옮긴다
            if (hidActive) {
                for (var i = 0; i < tabs.length; i++) {
                    if (!tabs[i].hidden) { tabs[i].click(); break; }
                }
            }
        }

        function revealScene() {
            var bar = document.querySelector('.scene-switcher');
            var active = bar && bar.querySelector('.scene-btn.active');
            if (!active) return;
            if (active.offsetLeft < bar.scrollLeft) bar.scrollLeft = active.offsetLeft - 6;
            if (active.offsetLeft + active.offsetWidth > bar.scrollLeft + bar.clientWidth)
                bar.scrollLeft = active.offsetLeft + active.offsetWidth - bar.clientWidth + 6;
        }
        document.addEventListener('click', function (e) {
            var b = e.target.closest ? e.target.closest('.scene-btn') : null;
            if (!b) return;
            setTimeout(function () {
                apply();
                var scene = activeScene();
                var related = tabs.filter(function (tab) {
                    return tab.getAttribute('data-for-scene') && wants(tab, scene);
                })[0];
                if (related && !related.hidden) related.click();
                revealScene();
            }, 0);
        });
        window.addEventListener('resize', revealScene);
        apply();
    }

    function litPart(svgEl, ids, activeId) {
        if (!svgEl || !ids) return;
        ids.forEach(function (id) {
            var e = svgEl.querySelector('#' + id);
            if (!e) return;
            var shapes = e.matches('path,circle,ellipse,rect,polygon,polyline')
                ? [e] : [].slice.call(e.querySelectorAll('path,circle,ellipse,rect,polygon,polyline'));
            var on = (id === activeId);
            shapes.forEach(function (sh) {
                // 속성이 아니라 실제로 칠해진 색을 본다. 어떤 도식은 fill 을 CSS 로 준다.
                // (귀 그림의 귓바퀴가 그랬는데, 속성만 보고 건너뛰어 불이 안 켜졌다.)
                var f = getComputedStyle(sh).fill;
                if (!f || f === 'none' || /rgba\(0, 0, 0, 0\)/.test(f)) return;
                if (sh.dataset.baseStroke === undefined) {
                    sh.dataset.baseStroke = sh.getAttribute('stroke') || '';
                    sh.dataset.baseWidth = sh.getAttribute('stroke-width') || '';
                }
                clearGlow(sh);
                if (on) {
                    sh.setAttribute('stroke', '#facc15');
                    sh.setAttribute('stroke-width', 4);
                    addGlow(sh);
                } else {
                    if (sh.dataset.baseStroke) sh.setAttribute('stroke', sh.dataset.baseStroke);
                    else sh.removeAttribute('stroke');
                    if (sh.dataset.baseWidth) sh.setAttribute('stroke-width', sh.dataset.baseWidth);
                    else sh.removeAttribute('stroke-width');
                }
            });
        });
    }

    return {
        SoundFX: SoundFX,
        bindSceneIntro: bindSceneIntro,
        isPaused: function () { return paused; },
        now: function () { return clock; },
        setupCanvas: setupCanvas,
        bindDrag: bindDrag,
        renderQuiz: renderQuiz,
        renderQuizSet: renderQuizSet,
        pinLabel: pinLabel,
        isolateSvgIds: isolateSvgIds,
        litPart: litPart,
        bindSceneTabs: bindSceneTabs
    };
});
