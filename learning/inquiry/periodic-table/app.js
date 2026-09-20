/**
 * 시험 대비 단주기 주기율표 (Elements 1-20) App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        currentTab: 'models',
        searchQuery: '',
        selectedCategory: 'all',
        selectedState: 'all',
        selectedElement: null,
        memorizeHidden: false,
        tableMode: 'exam',
        
        // Quiz state
        quiz: {
            currentQuestion: null,
            answered: false
        },

        // Molecule lab state
        lab: {
            selectedElements: {}, // { number: count }
            unlockedCompounds: new Set(),
            model: null,
            animationId: null,
            rotationX: -0.28,
            rotationY: 0.5,
            zoom: 1,
            autoRotate: true,
            dragging: false,
            pointerX: 0,
            pointerY: 0,
            activePointers: new Map(),
            pinchDistance: null
        },
        bohrAnimationId: null
    };

    // DOM Elements
    const elementsGrid = document.getElementById('elementsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryBar = document.getElementById('categoryBar');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const bohrCanvas = document.getElementById('bohrAtomCanvas');
    const ctx = bohrCanvas ? bohrCanvas.getContext('2d') : null;
    const EXAM_MAX_ATOMIC_NUMBER = 20;

    // Include plausible misspellings and related terms, not just other elements.
    const QUIZ_DISTRACTORS = {
        H:  { symbols: ['He', 'Hy', 'Hh'], names: ['산소', '질소', '탄소'] },
        He: { symbols: ['H', 'Hel', 'HE'], names: ['베릴륨', '셀레늄', '텔루륨'] },
        Li: { symbols: ['L', 'LI', 'Ri'], names: ['리듐', '리슘', '리트륨'] },
        Be: { symbols: ['B', 'BE', 'Br'], names: ['베르켈륨', '바륨', '헬륨'] },
        B:  { symbols: ['Be', 'Bo', 'Br'], names: ['불소', '붕산', '비소'] },
        C:  { symbols: ['Ca', 'Cl', 'Cb'], names: ['탄산', '질소', '산소'] },
        N:  { symbols: ['Na', 'Ne', 'Ni'], names: ['질산', '산소', '수소'] },
        O:  { symbols: ['O2', 'Ox', 'Os'], names: ['오존', '수소', '질소'] },
        F:  { symbols: ['Fl', 'Fe', 'Fr'], names: ['붕소', '염소', '브로민'] },
        Ne: { symbols: ['N', 'NE', 'Na'], names: ['니켈', '네오디뮴', '라돈'] },
        Na: { symbols: ['N', 'NA', 'Ne'], names: ['질산', '칼륨', '라듐'] },
        Mg: { symbols: ['M', 'MG', 'Mn'], names: ['망가니즈', '칼슘', '마그네타이트'] },
        Al: { symbols: ['A', 'AL', 'Ar'], names: ['알루미나', '알루미슘', '알칼리'] },
        Si: { symbols: ['S', 'SI', 'Sl'], names: ['규산', '비소', '탄소'] },
        P:  { symbols: ['Ph', 'Po', 'Pb'], names: ['인듐', '인산', '황'] },
        S:  { symbols: ['Si', 'Na', 'Su'], names: ['황산', '인', '염소'] },
        Cl: { symbols: ['C', 'CL', 'Ci'], names: ['염산', '불소', '산소'] },
        Ar: { symbols: ['A', 'AR', 'Al'], names: ['라돈', '크립톤', '아스타틴'] },
        K:  { symbols: ['Ca', 'Ka', 'P'], names: ['칼슘', '갈륨', '나트륨'] },
        Ca: { symbols: ['C', 'CA', 'K'], names: ['칼륨', '갈륨', '세슘'] }
    };

    // Initialize App
    initNavTabs();
    initCategoryBar();
    initGrid();
    initFilters();
    initModal();
    initQuiz();
    initLab3D();

    function getExamElements() {
        return window.ELEMENTS_DATA.filter(el => el.number <= EXAM_MAX_ATOMIC_NUMBER);
    }

    function getVisibleElements() {
        return state.tableMode === 'exam' ? getExamElements() : window.ELEMENTS_DATA;
    }

    function getShortGroup(group) {
        if (group <= 2) return group;
        return group - 10;
    }

    function isExamCompound(compound) {
        return Object.keys(compound.elements).every(number => Number(number) <= EXAM_MAX_ATOMIC_NUMBER);
    }

    function getLabCompounds() {
        if (!window.COMPOUNDS_DATA || !window.MOLECULE_MODELS_3D) return [];
        return window.COMPOUNDS_DATA.filter(compound =>
            isExamCompound(compound) && Boolean(window.MOLECULE_MODELS_3D[compound.formula])
        );
    }

    /**
     * Navigation Tabs setup
     */
    function initNavTabs() {
        const tabs = document.querySelectorAll('.nav-tabs .nav-tab[data-tab]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                const targetPane = document.getElementById(`tab-${target}`);
                if (targetPane) targetPane.classList.add('active');

                state.currentTab = target;
                document.body.dataset.activeTab = target;
                document.title = target === 'models' ? '원소·물질 모형' : target === 'quiz' ? '원소 문제' : target === 'molecule' ? '분자 모형' : state.tableMode === 'exam' ? '단주기 주기율표' : '실제 주기율표';
                if (target === 'quiz' && !state.quiz.currentQuestion) {
                    loadNewQuestion();
                }
                if (target === 'molecule') {
                    drawMolecule3D();
                    ensureMoleculeAnimation();
                } else {
                    stopMoleculeAnimation();
                }
            });
        });
    }

    /**
     * Category Legend Chips setup
     */
    function initCategoryBar() {
        if (!categoryBar || !window.PERIODIC_CATEGORIES) return;

        renderCategoryBar();

        categoryBar.addEventListener('click', (e) => {
            const chip = e.target.closest('.cat-chip');
            if (!chip) return;

            categoryBar.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            state.selectedCategory = chip.dataset.cat;
            applyFilters();
        });
    }

    function renderCategoryBar() {
        const visibleCategories = new Set(getVisibleElements().map(el => el.category));
        const allLabel = state.tableMode === 'exam' ? '1~20번 전체' : '118개 전체';
        let html = `<div class="cat-chip ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all" style="background: rgba(255,255,255,0.1); color: #fff;">${allLabel}</div>`;
        for (const [key, cat] of Object.entries(window.PERIODIC_CATEGORIES).filter(([key]) => visibleCategories.has(key))) {
            html += `<div class="cat-chip" data-cat="${key}" style="background: ${cat.bg}; border-color: ${cat.border}; color: ${cat.color};">${cat.name}</div>`;
        }
        categoryBar.innerHTML = html;
    }

    /**
     * Compute positions for short-form and full periodic tables.
     */
    function getShortGridPosition(el) {
        return { col: getShortGroup(el.group) + 1, row: el.period + 1 };
    }

    function getFullGridPosition(el) {
        if (el.number >= 57 && el.number <= 71) {
            return { col: (el.number - 57) + 4, row: 9 };
        }
        if (el.number >= 89 && el.number <= 103) {
            return { col: (el.number - 89) + 4, row: 10 };
        }
        return { col: el.group, row: el.period };
    }

    /**
     * Initialize Periodic Table Grid
     */
    function initGrid() {
        if (!elementsGrid || !window.ELEMENTS_DATA) return;

        elementsGrid.innerHTML = '';
        elementsGrid.classList.toggle('short-table', state.tableMode === 'exam');
        elementsGrid.classList.toggle('full-table', state.tableMode === 'full');
        elementsGrid.classList.toggle('memorize-mode', state.memorizeHidden);

        if (state.tableMode === 'exam') {
            for (let group = 1; group <= 8; group += 1) {
                const label = document.createElement('div');
                label.className = 'axis-label group-label';
                label.textContent = `${group}족`;
                label.style.gridColumn = String(group + 1);
                label.style.gridRow = '1';
                elementsGrid.appendChild(label);
            }

            for (let period = 1; period <= 4; period += 1) {
                const label = document.createElement('div');
                label.className = 'axis-label period-label';
                label.textContent = `${period}주기`;
                label.style.gridColumn = '1';
                label.style.gridRow = String(period + 1);
                elementsGrid.appendChild(label);
            }
        } else {
            const lanthanideLabel = document.createElement('div');
            lanthanideLabel.className = 'series-placeholder';
            lanthanideLabel.innerHTML = '57–71<br>란타넘족';
            lanthanideLabel.style.gridColumn = '3';
            lanthanideLabel.style.gridRow = '6';
            elementsGrid.appendChild(lanthanideLabel);

            const actinideLabel = document.createElement('div');
            actinideLabel.className = 'series-placeholder';
            actinideLabel.innerHTML = '89–103<br>악티늄족';
            actinideLabel.style.gridColumn = '3';
            actinideLabel.style.gridRow = '7';
            elementsGrid.appendChild(actinideLabel);
        }

        getVisibleElements().forEach(el => {
            const pos = state.tableMode === 'exam' ? getShortGridPosition(el) : getFullGridPosition(el);
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'element-cell';
            cell.dataset.number = el.number;
            cell.dataset.category = el.category;
            cell.dataset.state = el.state;
            cell.style.gridColumn = pos.col;
            cell.style.gridRow = pos.row;
            cell.setAttribute('aria-label', `${el.number}번 ${el.name}, 원소 기호 ${el.symbol}`);

            const catInfo = window.PERIODIC_CATEGORIES[el.category] || {};
            const stateIcon = el.state === 'gas' ? '☁️' : el.state === 'liquid' ? '💧' : el.state === 'solid' ? '🧱' : '⚛️';

            cell.innerHTML = `
                <div class="element-header">
                    <span class="element-number">${el.number}</span>
                    <span class="element-mass">${el.mass}</span>
                </div>
                <div class="element-symbol" style="color: ${catInfo.color || '#fff'}">${el.symbol}</div>
                <div class="element-name">${el.name}</div>
                <div class="element-shells" title="전자 배치">${el.shells.join(' · ')}</div>
                <span class="state-indicator" title="상온 상태: ${el.state}">${stateIcon}</span>
            `;

            cell.addEventListener('click', () => openElementModal(el));
            elementsGrid.appendChild(cell);
        });
    }

    /**
     * Search and Filter Handler
     */
    function initFilters() {
        const tableModeBtns = document.querySelectorAll('.table-mode-btn');
        tableModeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextMode = btn.dataset.tableMode;
                if (nextMode === state.tableMode) return;

                state.tableMode = nextMode;
                state.searchQuery = '';
                state.selectedCategory = 'all';
                state.selectedState = 'all';
                searchInput.value = '';

                tableModeBtns.forEach(modeBtn => {
                    const isActive = modeBtn.dataset.tableMode === state.tableMode;
                    modeBtn.classList.toggle('active', isActive);
                    modeBtn.setAttribute('aria-pressed', String(isActive));
                });
                document.querySelectorAll('.btn-filter[data-state]').forEach(stateBtn => {
                    stateBtn.classList.toggle('active', stateBtn.dataset.state === 'all');
                });

                updateTableModeUI();
                renderCategoryBar();
                initGrid();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.trim().toLowerCase();
                applyFilters();
            });
        }

        const stateBtns = document.querySelectorAll('.btn-filter[data-state]');
        stateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                stateBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.selectedState = btn.dataset.state;
                applyFilters();
            });
        });

        const memorizeBtn = document.getElementById('toggleMemorizeBtn');
        if (memorizeBtn) {
            memorizeBtn.addEventListener('click', () => {
                state.memorizeHidden = !state.memorizeHidden;
                elementsGrid.classList.toggle('memorize-mode', state.memorizeHidden);
                memorizeBtn.classList.toggle('active', state.memorizeHidden);
                memorizeBtn.setAttribute('aria-pressed', String(state.memorizeHidden));
                memorizeBtn.textContent = state.memorizeHidden ? '👀 이름 다시 보기' : '🙈 이름 가리고 외우기';
            });
        }
    }

    function updateTableModeUI() {
        const isExam = state.tableMode === 'exam';
        document.body.dataset.tableMode = state.tableMode;
        if (state.currentTab === 'explore') document.title = isExam
            ? '단주기 주기율표'
            : '실제 주기율표';

        const titleText = document.getElementById('appTitleText');
        if (titleText) titleText.textContent = isExam ? '단주기 주기율표' : '실제 주기율표';
        const titleBadge = document.getElementById('appTitleBadge');
        if (titleBadge) titleBadge.textContent = isExam ? '1~20번 원소' : '1~118번 원소';
        const exploreLabel = document.getElementById('tabExploreLabel');
        if (exploreLabel) exploreLabel.textContent = isExam ? '단주기표' : '실제 주기율표';
        if (searchInput) {
            searchInput.placeholder = isExam
                ? '이름, 기호(H, Na), 원자번호(1~20) 검색'
                : '이름, 기호(Fe, Au), 원자번호(1~118) 검색';
            searchInput.setAttribute('aria-label', isExam ? '원소 검색' : '전체 원소 검색');
        }
    }

    function applyFilters() {
        const cells = document.querySelectorAll('.element-cell');
        cells.forEach(cell => {
            const num = parseInt(cell.dataset.number, 10);
            const el = window.ELEMENTS_DATA.find(item => item.number === num);
            if (!el) return;

            let matchesSearch = true;
            if (state.searchQuery) {
                matchesSearch = el.name.toLowerCase().includes(state.searchQuery) ||
                                el.symbol.toLowerCase().includes(state.searchQuery) ||
                                el.enName.toLowerCase().includes(state.searchQuery) ||
                                String(el.number) === state.searchQuery;
            }

            let matchesCat = state.selectedCategory === 'all' || el.category === state.selectedCategory;
            let matchesState = state.selectedState === 'all' || el.state === state.selectedState;

            if (matchesSearch && matchesCat && matchesState) {
                cell.classList.remove('filtered-out');
            } else {
                cell.classList.add('filtered-out');
            }
        });
    }

    /**
     * Modal Controller & Bohr Atom Orbit Animation
     */
    function initModal() {
        if (!modalOverlay || !closeModalBtn) return;

        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function openElementModal(el) {
        state.selectedElement = el;
        const cat = window.PERIODIC_CATEGORIES[el.category] || {};

        document.getElementById('modalZ').textContent = `원자번호 ${el.number}`;
        document.getElementById('modalNameKo').textContent = el.name;
        
        const badge = document.getElementById('modalCatBadge');
        badge.textContent = cat.name || el.category;
        badge.style.background = cat.bg || '#333';
        badge.style.color = cat.color || '#fff';
        badge.style.border = `1px solid ${cat.border || '#555'}`;

        document.getElementById('modalSymbol').textContent = el.symbol;
        document.getElementById('modalMass').textContent = el.mass;
        document.getElementById('modalState').textContent = el.state === 'gas' ? '기체' : el.state === 'liquid' ? '액체' : el.state === 'solid' ? '고체' : '합성/미정';
        document.getElementById('modalGroupPeriod').textContent = state.tableMode === 'exam'
            ? `${getShortGroup(el.group)}족 / ${el.period}주기`
            : `${el.group}족 / ${el.period}주기 (${el.block} 블록)`;
        const electronConfig = el.shells.join(' - ');
        const valenceElectrons = el.shells[el.shells.length - 1];
        document.getElementById('modalShells').textContent = electronConfig;
        document.getElementById('modalElectronConfig').textContent = electronConfig;
        const shellColors = ['#4bcffa', '#a78bfa', '#fbbf24', '#fb7185', '#34d399', '#60a5fa', '#f472b6'];
        document.getElementById('shellLegend').innerHTML = el.shells.map((count, index) => `
            <span class="shell-legend-item${index === el.shells.length - 1 ? ' valence' : ''}">
                <i style="--shell-color: ${shellColors[index % shellColors.length]}"></i>
                ${index + 1}껍질 <strong>${count}개</strong>
            </span>
        `).join('');
        document.getElementById('modalShellCount').textContent = `${el.shells.length}개`;
        document.getElementById('modalValenceElectrons').textContent = `${valenceElectrons}개`;
        document.getElementById('modalDesc').textContent = el.desc;
        document.getElementById('modalTrivia').textContent = el.trivia || '교과서에서 다루는 주요 특징을 확인하세요.';

        const usesContainer = document.getElementById('modalUses');
        if (window.renderUseCardHtml) {
            usesContainer.innerHTML = (el.uses || []).map(use => window.renderUseCardHtml(use, el)).join('');
        } else {
            usesContainer.innerHTML = (el.uses || []).map(use => `<span class="use-tag"># ${use}</span>`).join('');
        }

        modalOverlay.classList.add('active');
        drawBohrAtom(el);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        if (state.bohrAnimationId) {
            cancelAnimationFrame(state.bohrAnimationId);
            state.bohrAnimationId = null;
        }
    }

    /**
     * Canvas Bohr Atom 2D Diagram
     */
    function drawBohrAtom(el) {
        if (!bohrCanvas || !ctx) return;
        if (state.bohrAnimationId) {
            cancelAnimationFrame(state.bohrAnimationId);
        }

        const width = bohrCanvas.width = 240;
        const height = bohrCanvas.height = 240;
        const centerX = width / 2;
        const centerY = height / 2;
        const shells = el.shells || [1];
        const shellColors = ['#4bcffa', '#a78bfa', '#fbbf24', '#fb7185', '#34d399', '#60a5fa', '#f472b6'];
        const rotationPeriodMs = 120000;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let animationStart = null;
        bohrCanvas.setAttribute('role', 'img');
        bohrCanvas.setAttribute('aria-label', `${el.name} 보어 원자 모형. 전자 배치 ${shells.join('-')}`);

        function drawFrame(timestamp = 0) {
            if (animationStart === null) animationStart = timestamp;
            const rotationAngle = reduceMotion
                ? 0
                : ((timestamp - animationStart) / rotationPeriodMs) * Math.PI * 2;
            ctx.clearRect(0, 0, width, height);

            // Draw Nucleus
            ctx.beginPath();
            ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#38ef7d';
            ctx.shadowColor = '#38ef7d';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#0b1320';
            ctx.font = 'bold 12px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.symbol, centerX, centerY);

            // Draw Shell orbits & Electrons
            const maxRadius = 95;
            const baseRadius = 32;
            const radiusStep = (maxRadius - baseRadius) / Math.max(shells.length, 1);

            shells.forEach((electronCount, shellIdx) => {
                const r = baseRadius + (shellIdx * radiusStep);
                const shellColor = shellColors[shellIdx % shellColors.length];
                const isValenceShell = shellIdx === shells.length - 1;

                // Orbit path
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.strokeStyle = `${shellColor}4d`;
                ctx.lineWidth = isValenceShell ? 2 : 1;
                ctx.stroke();

                // Rotate very slowly so each shell remains easy to count.
                for (let i = 0; i < electronCount; i++) {
                    const currentAngle = (-Math.PI / 2)
                        + ((Math.PI * 2 / electronCount) * i)
                        + ((shellIdx % 2) * (Math.PI / Math.max(electronCount, 1)))
                        + rotationAngle;

                    const ex = centerX + r * Math.cos(currentAngle);
                    const ey = centerY + r * Math.sin(currentAngle);

                    ctx.beginPath();
                    ctx.arc(ex, ey, isValenceShell ? 5.2 : 4.5, 0, Math.PI * 2);
                    ctx.fillStyle = shellColor;
                    ctx.shadowColor = shellColor;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    if (isValenceShell) {
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1.25;
                        ctx.stroke();
                    }
                }
            });

            if (!reduceMotion) {
                state.bohrAnimationId = requestAnimationFrame(drawFrame);
            }
        }

        state.bohrAnimationId = requestAnimationFrame(drawFrame);
    }

    /**
     * Quiz Engine
     */
    /**
     * Quiz Engine
     */
    function initQuiz() {
        const nextBtn = document.getElementById('nextQuizBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                loadNewQuestion();
            });
        }

    }

    function loadNewQuestion() {
        state.quiz.answered = false;

        // Every question stays inside the exam scope: elements 1 through 20.
        const available = getExamElements();
        const correctEl = available[Math.floor(Math.random() * available.length)];

        // Render short-form periodic table exam questions.
        const qText = document.getElementById('quizQuestionText');
        const qSub = document.getElementById('quizSubText');
        const optGrid = document.getElementById('quizOptionsGrid');

        const qTypes = ['symbol_name', 'name_symbol', 'atomic_number', 'electron_arrangement', 'position'];
        const chosenType = qTypes[Math.floor(Math.random() * qTypes.length)];

        let optionLabel = opt => opt.name;

        if (chosenType === 'symbol_name') {
            qText.textContent = `원소 기호 『 ${correctEl.symbol} 』 의 올바른 한글 원소 이름은?`;
            qSub.textContent = '비슷한 이름을 구별해 기호에 맞는 원소를 고르세요.';
        } else if (chosenType === 'name_symbol') {
            qText.textContent = `『 ${correctEl.name} 』의 올바른 원소 기호는?`;
            qSub.textContent = '철자와 대소문자를 확인해 정확한 기호를 고르세요.';
            optionLabel = opt => opt.symbol;
        } else if (chosenType === 'atomic_number') {
            qText.textContent = `『 ${correctEl.name} (${correctEl.symbol}) 』의 원자번호는?`;
            qSub.textContent = '원자번호는 원자핵 속 양성자 수와 같습니다.';
            optionLabel = opt => `${opt.number}번`;
        } else if (chosenType === 'electron_arrangement') {
            qText.textContent = `『 ${correctEl.name} (${correctEl.symbol}) 』의 전자 배치는?`;
            qSub.textContent = '안쪽 전자 껍질부터 차례대로 고르세요.';
            optionLabel = opt => opt.shells.join(' - ');
        } else {
            qText.textContent = `단주기표에서 『 ${correctEl.name} (${correctEl.symbol}) 』의 위치는?`;
            qSub.textContent = '가로줄은 주기, 세로줄은 족입니다.';
            optionLabel = opt => `${getShortGroup(opt.group)}족 · ${opt.period}주기`;
        }

        const options = buildQuizOptions(correctEl, chosenType, optionLabel, available);
        state.quiz.currentQuestion = { correctEl, options, chosenType };

        optGrid.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = opt.label;
            btn.addEventListener('click', () => checkAnswer(opt, btn));
            optGrid.appendChild(btn);
        });

        document.getElementById('quizResultMsg').textContent = '';
        document.getElementById('nextQuizBtn').hidden = true;
    }

    function buildQuizOptions(correctEl, questionType, optionLabel, available) {
        let wrongLabels;
        if (questionType === 'name_symbol' || questionType === 'symbol_name') {
            const key = questionType === 'name_symbol' ? 'symbols' : 'names';
            wrongLabels = QUIZ_DISTRACTORS[correctEl.symbol][key];
        } else {
            const pool = available.filter(element => element.number !== correctEl.number);
            wrongLabels = [];
            while (wrongLabels.length < 3) {
                const index = Math.floor(Math.random() * pool.length);
                wrongLabels.push(optionLabel(pool.splice(index, 1)[0]));
            }
        }
        const options = [
            { label: optionLabel(correctEl), isCorrect: true },
            ...wrongLabels.map(label => ({ label, isCorrect: false }))
        ];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }

    function getQuizExplanation(element, questionType) {
        if (questionType === 'symbol_name') {
            if (element.symbol === 'B') {
                return 'B는 붕소입니다. 불소(플루오린)는 F, 비소는 As이며, 붕산은 원소가 아니라 화합물입니다.';
            }
            if (element.symbol === 'F') {
                return 'F는 플루오린(불소)입니다. 붕소는 B, 염소는 Cl, 브로민은 Br입니다.';
            }
            return `${element.symbol}은 ${element.name}의 원소 기호입니다.`;
        }
        if (questionType === 'name_symbol') {
            if (element.symbol === 'He') {
                return '헬륨의 원소 기호는 He입니다. H는 수소이며, Hel과 HE는 올바른 원소 기호가 아닙니다.';
            }
            return `${element.name}의 원소 기호는 ${element.symbol}입니다. 첫 글자는 대문자로, 두 번째 글자가 있으면 소문자로 씁니다.`;
        }
        if (questionType === 'atomic_number') {
            return `${element.name}(${element.symbol})의 원자번호는 ${element.number}번이며, 원자핵 속 양성자 수도 ${element.number}개입니다.`;
        }
        if (questionType === 'electron_arrangement') {
            return `${element.name}(${element.symbol})의 전자 배치는 ${element.shells.join(' - ')}입니다.`;
        }
        return `${element.name}(${element.symbol})은 단주기표에서 ${getShortGroup(element.group)}족 · ${element.period}주기입니다. 가로줄은 주기, 세로줄은 족입니다.`;
    }

    function checkAnswer(selectedOpt, btn) {
        if (state.quiz.answered) return;

        const { correctEl, chosenType } = state.quiz.currentQuestion;
        const isCorrect = selectedOpt.isCorrect;
        const msg = document.getElementById('quizResultMsg');
        const explanation = getQuizExplanation(correctEl, chosenType);

        if (!isCorrect) {
            btn.classList.add('wrong');
            btn.disabled = true;
            msg.innerHTML = '<strong>다시 생각하고 다른 답을 골라보세요.</strong>';
            msg.style.color = '#ffb86b';
            return;
        }
        state.quiz.answered = true;

        btn.classList.add('correct');
        msg.innerHTML = `<strong>정답입니다.</strong><span>${explanation}</span>`;
        msg.style.color = '#38ef7d';

        document.querySelectorAll('.quiz-opt-btn').forEach(option => {
            option.disabled = true;
        });
        document.getElementById('nextQuizBtn').hidden = false;

    }

    /**
     * Molecule Synthesis Laboratory Engine
     */
    /**
     * Interactive 3D molecule laboratory.
     * Uses real XYZ coordinates and perspective projection on a Canvas.
     */
    function initLab3D() {
        const canvas = document.getElementById('molecule3dCanvas');
        const atomPalette = document.getElementById('atomPalette');
        const resetBtn = document.getElementById('resetLabBtn');
        const resetViewBtn = document.getElementById('resetMoleculeViewBtn');
        const rotateBtn = document.getElementById('toggleMoleculeRotationBtn');
        const summary = document.getElementById('labSelectionSummary');

        if (!canvas || !atomPalette || !window.MOLECULE_MODELS_3D) return;

        const atomNumbers = [...new Set(
            getLabCompounds().flatMap(compound => Object.keys(compound.elements).map(Number))
        )].sort((a, b) => a - b);

        atomPalette.innerHTML = '';
        atomNumbers.forEach(number => {
            const element = window.ELEMENTS_DATA.find(item => item.number === number);
            if (!element) return;

            const token = document.createElement('button');
            token.type = 'button';
            token.className = 'atom-token';
            token.dataset.atom = String(number);
            token.title = `${element.name} (${element.symbol}) 추가`;
            token.setAttribute('aria-label', `${element.name} 원자 추가`);
            token.innerHTML = `<span>${element.symbol}</span><small class="atom-token-count">0</small>`;
            token.addEventListener('click', () => addLabAtom(number));
            atomPalette.appendChild(token);
        });

        if (summary) {
            summary.addEventListener('click', event => {
                const removeBtn = event.target.closest('[data-remove-atom]');
                if (!removeBtn) return;
                removeLabAtom(Number(removeBtn.dataset.removeAtom));
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                state.lab.selectedElements = {};
                render3DLab();
            });
        }

        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                resetMoleculeView();
                drawMolecule3D();
            });
        }

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                state.lab.autoRotate = !state.lab.autoRotate;
                rotateBtn.textContent = state.lab.autoRotate ? '⏸ 자동 회전' : '▶ 자동 회전';
                rotateBtn.classList.toggle('active', state.lab.autoRotate);
                ensureMoleculeAnimation();
            });
            rotateBtn.classList.add('active');
        }

        canvas.addEventListener('pointerdown', event => {
            if (!state.lab.model) return;
            state.lab.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            state.lab.pointerX = event.clientX;
            state.lab.pointerY = event.clientY;
            state.lab.dragging = state.lab.activePointers.size === 1;
            if (state.lab.activePointers.size === 2) {
                state.lab.pinchDistance = getPointerDistance(state.lab.activePointers);
            }
            canvas.setPointerCapture(event.pointerId);
        });

        canvas.addEventListener('pointermove', event => {
            if (!state.lab.activePointers.has(event.pointerId)) return;
            state.lab.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

            if (state.lab.activePointers.size === 2) {
                const distance = getPointerDistance(state.lab.activePointers);
                if (state.lab.pinchDistance) {
                    state.lab.zoom = clamp(state.lab.zoom * (distance / state.lab.pinchDistance), 0.65, 1.8);
                }
                state.lab.pinchDistance = distance;
                drawMolecule3D();
                return;
            }

            if (!state.lab.dragging) return;
            const deltaX = event.clientX - state.lab.pointerX;
            const deltaY = event.clientY - state.lab.pointerY;
            state.lab.pointerX = event.clientX;
            state.lab.pointerY = event.clientY;
            state.lab.rotationY += deltaX * 0.012;
            state.lab.rotationX = clamp(state.lab.rotationX + deltaY * 0.012, -Math.PI / 2, Math.PI / 2);
            drawMolecule3D();
        });

        const endDrag = event => {
            state.lab.activePointers.delete(event.pointerId);
            state.lab.pinchDistance = null;
            const remainingPointer = state.lab.activePointers.values().next().value;
            state.lab.dragging = Boolean(remainingPointer);
            if (remainingPointer) {
                state.lab.pointerX = remainingPointer.x;
                state.lab.pointerY = remainingPointer.y;
            }
            if (canvas.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        };
        canvas.addEventListener('pointerup', endDrag);
        canvas.addEventListener('pointercancel', endDrag);

        canvas.addEventListener('wheel', event => {
            if (!state.lab.model) return;
            event.preventDefault();
            state.lab.zoom = clamp(state.lab.zoom - event.deltaY * 0.001, 0.65, 1.8);
            drawMolecule3D();
        }, { passive: false });

        window.addEventListener('resize', () => {
            if (state.lab.model) drawMolecule3D();
        });

        render3DCompoundList();
        render3DLab();
    }

    function addLabAtom(number) {
        const status = document.getElementById('labStatusMsg');
        const maximum = getMaxLabAtomCount(number);
        const current = state.lab.selectedElements[number] || 0;
        if (current >= maximum) {
            const element = window.ELEMENTS_DATA.find(item => item.number === number);
            if (status && element) {
                status.innerHTML = `<span class="lab-warning">${element.symbol} 원자는 지원 모형에서 최대 ${maximum}개까지 사용합니다.</span>`;
            }
            return;
        }
        state.lab.selectedElements[number] = current + 1;
        render3DLab();
    }

    function removeLabAtom(number) {
        if (!state.lab.selectedElements[number]) return;
        state.lab.selectedElements[number] -= 1;
        if (state.lab.selectedElements[number] <= 0) {
            delete state.lab.selectedElements[number];
        }
        render3DLab();
    }

    function getMaxLabAtomCount(number) {
        return Math.max(0, ...getLabCompounds().map(compound => compound.elements[number] || 0));
    }

    function getPointerDistance(pointers) {
        const [first, second] = [...pointers.values()];
        if (!first || !second) return 0;
        return Math.hypot(second.x - first.x, second.y - first.y);
    }

    function setLabComposition(compound) {
        state.lab.selectedElements = { ...compound.elements };
        resetMoleculeView();
        render3DLab();
    }

    function resetMoleculeView() {
        state.lab.rotationX = -0.28;
        state.lab.rotationY = 0.5;
        state.lab.zoom = 1;
    }

    function findLabCompound() {
        const selectedKeys = Object.keys(state.lab.selectedElements);
        return getLabCompounds().find(compound => {
            const requiredKeys = Object.keys(compound.elements);
            return requiredKeys.length === selectedKeys.length &&
                requiredKeys.every(key => compound.elements[key] === state.lab.selectedElements[key]);
        }) || null;
    }

    function render3DLab() {
        const beaker = document.getElementById('labBeaker');
        const emptyState = document.getElementById('moleculeEmptyState');
        const status = document.getElementById('labStatusMsg');
        const totalAtoms = Object.values(state.lab.selectedElements).reduce((sum, count) => sum + count, 0);
        const matched = findLabCompound();

        updateLabAtomCounts();
        renderLabSelectionSummary();

        if (totalAtoms === 0) {
            state.lab.model = null;
            beaker?.classList.remove('has-model');
            if (emptyState) {
                emptyState.innerHTML = '<strong>원소를 조합해 보세요</strong><span>완성된 구조만 정확한 결합으로 표시됩니다.</span>';
            }
            if (status) status.textContent = '';
            clearMoleculeCanvas();
            stopMoleculeAnimation();
            return;
        }

        beaker?.classList.add('has-model');
        if (matched) {
            state.lab.model = window.MOLECULE_MODELS_3D[matched.formula];
            state.lab.unlockedCompounds.add(matched.formula);
            if (status) {
                status.innerHTML = `
                    <strong>${matched.icon} ${matched.name} (${matched.formula})</strong>
                    <span>${state.lab.model.geometry}</span>
                `;
            }
        } else {
            state.lab.model = buildLooseAtomModel(state.lab.selectedElements);
            if (status) {
                status.innerHTML = `
                    <strong>조합 중</strong>
                    <span>등록된 구조와 아직 일치하지 않습니다. 잘못된 결합선은 표시하지 않습니다.</span>
                `;
            }
        }

        render3DCompoundList();
        drawMolecule3D();
        ensureMoleculeAnimation();
    }

    function updateLabAtomCounts() {
        document.querySelectorAll('.atom-token[data-atom]').forEach(token => {
            const count = state.lab.selectedElements[Number(token.dataset.atom)] || 0;
            const badge = token.querySelector('.atom-token-count');
            if (badge) badge.textContent = String(count);
            token.classList.toggle('selected', count > 0);
        });
    }

    function renderLabSelectionSummary() {
        const summary = document.getElementById('labSelectionSummary');
        if (!summary) return;

        const entries = Object.entries(state.lab.selectedElements);
        if (entries.length === 0) {
            summary.innerHTML = '<span class="selection-placeholder">선택한 원소가 없습니다.</span>';
            return;
        }

        summary.innerHTML = entries.map(([number, count]) => {
            const element = window.ELEMENTS_DATA.find(item => item.number === Number(number));
            if (!element) return '';
            return `
                <button type="button" class="selection-chip" data-remove-atom="${number}" aria-label="${element.name} 원자 1개 빼기">
                    ${element.symbol}<span>×${count}</span><b>−</b>
                </button>
            `;
        }).join('');
    }

    function render3DCompoundList() {
        const list = document.getElementById('compoundsList');
        if (!list) return;

        list.innerHTML = '';
        const groups = [
            { id: 'core', title: '기본 5개 구조', note: '구조 · 결합각 · 극성' },
            { id: 'frequent', title: '대표 화합물', note: '다중 결합 및 평면성' },
            { id: 'ionic', title: '이온 결정', note: '이온 격자 구조' },
            { id: 'explore', title: '추가 탐구 분자', note: '입체 및 복합 구조' }
        ];
        const compounds = getLabCompounds();
        const selectedFormula = findLabCompound()?.formula;

        groups.forEach(group => {
            const groupedCompounds = compounds.filter(compound => compound.labGroup === group.id);
            if (groupedCompounds.length === 0) return;

            const section = document.createElement('section');
            section.className = `compound-group compound-group-${group.id}`;
            section.innerHTML = `
                <div class="compound-group-heading">
                    <strong>${group.title}</strong>
                    <span>${group.note}</span>
                </div>
            `;

            groupedCompounds.forEach(compound => {
                const model = window.MOLECULE_MODELS_3D[compound.formula];
                const card = document.createElement('button');
                card.type = 'button';
                card.className = 'compound-card';
                card.classList.toggle('active', selectedFormula === compound.formula);
                card.innerHTML = `
                    <div class="compound-header">
                        <span>${compound.icon} ${compound.name}</span>
                        <span class="compound-formula">${compound.formula}</span>
                    </div>
                    <div class="compound-geometry">${model.kind} · ${model.geometry}</div>
                `;
                card.addEventListener('click', () => setLabComposition(compound));
                section.appendChild(card);
            });
            list.appendChild(section);
        });
    }

    function buildLooseAtomModel(elementsMap) {
        const atoms = [];
        const expanded = [];
        for (const [numberText, count] of Object.entries(elementsMap)) {
            const number = Number(numberText);
            const element = window.ELEMENTS_DATA.find(item => item.number === number);
            if (!element) continue;
            for (let index = 0; index < count; index += 1) {
                expanded.push({ num: number, symbol: element.symbol });
            }
        }

        const total = expanded.length;
        expanded.forEach((atom, index) => {
            const angle = (Math.PI * 2 * index) / Math.max(total, 1);
            const layer = index % 2 === 0 ? 1 : -1;
            atoms.push({
                id: `loose-${index}`,
                ...atom,
                x: Math.cos(angle) * Math.min(92, 34 + total * 7),
                y: Math.sin(angle) * Math.min(68, 24 + total * 5),
                z: layer * (16 + (index % 3) * 8)
            });
        });

        return {
            kind: '미완성 조합',
            geometry: '결합 정보 없음',
            atoms,
            bonds: []
        };
    }

    function ensureMoleculeAnimation() {
        if (state.lab.animationId || !state.lab.model) return;
        const animate = () => {
            if (!state.lab.model) {
                state.lab.animationId = null;
                return;
            }
            if (state.lab.autoRotate && !state.lab.dragging && state.currentTab === 'molecule') {
                state.lab.rotationY += 0.004;
            }
            drawMolecule3D();
            state.lab.animationId = requestAnimationFrame(animate);
        };
        state.lab.animationId = requestAnimationFrame(animate);
    }

    function stopMoleculeAnimation() {
        if (!state.lab.animationId) return;
        cancelAnimationFrame(state.lab.animationId);
        state.lab.animationId = null;
    }

    function clearMoleculeCanvas() {
        const canvas = document.getElementById('molecule3dCanvas');
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawMolecule3D() {
        const canvas = document.getElementById('molecule3dCanvas');
        const model = state.lab.model;
        const context = canvas?.getContext('2d');
        if (!canvas || !context || !model) return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(rect.width * dpr);
        const pixelHeight = Math.round(rect.height * dpr);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, rect.width, rect.height);
        drawMoleculeBackdrop(context, rect.width, rect.height);

        const baseScale = Math.min(rect.width / 330, rect.height / 290) * state.lab.zoom;
        const projectedAtoms = model.atoms.map(atom => ({
            ...atom,
            ...projectMoleculePoint(atom, rect.width, rect.height, baseScale)
        }));
        const atomMap = new Map(projectedAtoms.map(atom => [atom.id, atom]));

        [...model.bonds]
            .map(bond => ({ ...bond, a: atomMap.get(bond.from), b: atomMap.get(bond.to) }))
            .filter(bond => bond.a && bond.b)
            .sort((first, second) => ((first.a.depth + first.b.depth) - (second.a.depth + second.b.depth)))
            .forEach(bond => drawMoleculeBond(context, bond));

        projectedAtoms
            .sort((first, second) => first.depth - second.depth)
            .forEach(atom => drawMoleculeAtom(context, atom, baseScale));
    }

    function projectMoleculePoint(point, width, height, baseScale) {
        const cosX = Math.cos(state.lab.rotationX);
        const sinX = Math.sin(state.lab.rotationX);
        const cosY = Math.cos(state.lab.rotationY);
        const sinY = Math.sin(state.lab.rotationY);

        const rotatedY = point.y * cosX - point.z * sinX;
        const firstDepth = point.y * sinX + point.z * cosX;
        const rotatedX = point.x * cosY + firstDepth * sinY;
        const rotatedZ = -point.x * sinY + firstDepth * cosY;
        const perspective = 460 / (460 - rotatedZ);

        return {
            screenX: width / 2 + rotatedX * baseScale * perspective,
            screenY: height / 2 + rotatedY * baseScale * perspective,
            depth: rotatedZ,
            perspective
        };
    }

    function drawMoleculeBackdrop(context, width, height) {
        context.save();
        context.strokeStyle = 'rgba(75, 207, 250, 0.07)';
        context.lineWidth = 1;
        for (let radius = 48; radius < Math.min(width, height); radius += 48) {
            context.beginPath();
            context.ellipse(width / 2, height / 2, radius * 1.45, radius * 0.48, 0, 0, Math.PI * 2);
            context.stroke();
        }
        context.restore();
    }

    function drawMoleculeBond(context, bond) {
        const dx = bond.b.screenX - bond.a.screenX;
        const dy = bond.b.screenY - bond.a.screenY;
        const length = Math.hypot(dx, dy) || 1;
        const offsetX = (-dy / length) * 3.5;
        const offsetY = (dx / length) * 3.5;
        const averagePerspective = (bond.a.perspective + bond.b.perspective) / 2;

        context.save();
        context.lineCap = 'round';
        context.lineWidth = Math.max(2.2, 5.5 * averagePerspective);
        context.strokeStyle = bond.type === 'ionic' ? 'rgba(75, 207, 250, 0.8)' : 'rgba(226, 232, 240, 0.72)';
        context.shadowColor = bond.type === 'ionic' ? '#4bcffa' : 'rgba(255,255,255,0.35)';
        context.shadowBlur = 7;

        if (bond.type === 'ionic') {
            context.setLineDash([7, 7]);
        }

        const drawLine = (xOffset, yOffset) => {
            context.beginPath();
            context.moveTo(bond.a.screenX + xOffset, bond.a.screenY + yOffset);
            context.lineTo(bond.b.screenX + xOffset, bond.b.screenY + yOffset);
            context.stroke();
        };

        if (bond.type === 'double') {
            drawLine(offsetX, offsetY);
            drawLine(-offsetX, -offsetY);
        } else if (bond.type === 'triple') {
            drawLine(offsetX * 1.7, offsetY * 1.7);
            drawLine(0, 0);
            drawLine(-offsetX * 1.7, -offsetY * 1.7);
        } else {
            drawLine(0, 0);
        }
        context.restore();
    }

    function drawMoleculeAtom(context, atom, baseScale) {
        const style = getMoleculeAtomStyle(atom.num);
        const radius = Math.max(11, style.radius * baseScale * atom.perspective);
        const gradient = context.createRadialGradient(
            atom.screenX - radius * 0.35,
            atom.screenY - radius * 0.38,
            radius * 0.12,
            atom.screenX,
            atom.screenY,
            radius
        );
        gradient.addColorStop(0, style.highlight);
        gradient.addColorStop(0.48, style.color);
        gradient.addColorStop(1, style.shadow);

        context.save();
        context.beginPath();
        context.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.shadowColor = style.color;
        context.shadowBlur = 12;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(255,255,255,0.68)';
        context.stroke();
        context.shadowBlur = 0;

        context.fillStyle = style.text;
        context.font = `900 ${Math.max(10, radius * 0.72)}px Pretendard, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(atom.symbol, atom.screenX, atom.screenY + 1);

        if (atom.charge) {
            context.fillStyle = '#ffd18a';
            context.font = `900 ${Math.max(9, radius * 0.44)}px Pretendard, sans-serif`;
            context.fillText(atom.charge, atom.screenX + radius * 0.72, atom.screenY - radius * 0.65);
        }
        context.restore();
    }

    function getMoleculeAtomStyle(number) {
        const styles = {
            1: { color: '#e2e8f0', highlight: '#ffffff', shadow: '#94a3b8', text: '#0f172a', radius: 14 },
            5: { color: '#f59e0b', highlight: '#fde68a', shadow: '#b45309', text: '#111827', radius: 20 },
            6: { color: '#334155', highlight: '#64748b', shadow: '#0f172a', text: '#38ef7d', radius: 22 },
            7: { color: '#2563eb', highlight: '#60a5fa', shadow: '#1e3a8a', text: '#ffffff', radius: 21 },
            8: { color: '#ef4444', highlight: '#fca5a5', shadow: '#991b1b', text: '#ffffff', radius: 20 },
            9: { color: '#84cc16', highlight: '#d9f99d', shadow: '#3f6212', text: '#102000', radius: 19 },
            11: { color: '#f59e0b', highlight: '#fde68a', shadow: '#b45309', text: '#111827', radius: 28 },
            17: { color: '#10b981', highlight: '#6ee7b7', shadow: '#047857', text: '#ffffff', radius: 29 },
            20: { color: '#eab308', highlight: '#fef08a', shadow: '#a16207', text: '#111827', radius: 31 }
        };
        return styles[number] || { color: '#38ef7d', highlight: '#bbf7d0', shadow: '#047857', text: '#06130d', radius: 22 };
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

});
