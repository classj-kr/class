(async function () {
    "use strict";

    const data = Array.isArray(window.IDIOM_DATA) ? window.IDIOM_DATA : [];
    const core = window.IdiomCore;
    const lessons = Array.isArray(window.IDIOM_LESSONS) ? window.IDIOM_LESSONS : [];
    const records=LearningRecords.create('classical-chinese-idioms',{label:'한자성어'});await records.ready;
    let recordMode='learn',recordBusy=false;
    const ILLUSTRATIONS = {
        gakjuguggeom: "assets/idioms-v2/gakjuguggeom.webp",
        josammosa: "assets/idioms-v2/josammosa.webp",
        gwayubulgeup: "assets/idioms-v2/gwayubulgeup.webp",
        saeongjima: "assets/idioms-v2/saeongjima.webp",
        ugongisan: "assets/idioms-v2/ugongisan.webp",
        hogahowi: "assets/idioms-v2/hogahowi.webp",
        eobujiri: "assets/idioms-v2/eobujiri.webp",
        samyeonchoga: "assets/idioms-v2/samyeonchoga.webp",
        dadaikseon: "assets/idioms-v2/dadaikseon.webp",
        jirokwima: "assets/idioms-v2/jirokwima.webp",
        tosagupaeng: "assets/idioms-v2/tosagupaeng.webp",
        samgochoryeo: "assets/idioms-v2/samgochoryeo.webp",
        sueojigyo: "assets/idioms-v2/sueojigyo.webp",
        cheongchureoram: "assets/idioms-v2/cheongchureoram.webp",
        tasanjiseok: "assets/idioms-v2/tasanjiseok.webp",
        hwaryongjeomjeong: "assets/idioms-v2/hwaryongjeomjeong.webp",
        gwanpojigyo: "assets/idioms-v2/gwanpojigyo.webp",
        maengmosamcheon: "assets/idioms-v2/maengmosamcheon.webp",
        gyeolchooseun: "assets/idioms-v2/gyeolchooseun.webp",
        pajukjise: "assets/idioms-v2/pajukjise.webp",
        gungyeilhak: "assets/idioms-v2/gungyeilhak.webp",
        hyeongseoljigong: "assets/idioms-v2/hyeongseoljigong.webp",
        wasinsangdam: "assets/idioms-v2/wasinsangdam.webp",
        daegimanseong: "assets/idioms-v2/daegimanseong.webp",
        ongojisin: "assets/idioms-v2/ongojisin.webp",
        bulchihamun: "assets/idioms-v2/bulchihamun.webp",
        yubimuhwan: "assets/idioms-v2/yubimuhwan.webp",
        jeolchatakma: "assets/idioms-v2/jeolchatakma.webp",
        giu: "assets/idioms-v2/giu.webp",
        yeonmokgueo: "assets/idioms-v2/yeonmokgueo.webp",
        mosujacheon: "assets/idioms-v2/mosujacheon.webp",
        nangjungjichu: "assets/idioms-v2/nangjungjichu.webp",
        owoldongju: "assets/idioms-v2/owoldongju.webp",
        dongbyeongsangryeon: "assets/idioms-v2/dongbyeongsangryeon.webp",
        gwontojungrae: "assets/idioms-v2/gwontojungrae.webp",
        jeonhwawibok: "assets/idioms-v2/jeonhwawibok.webp",
        yangsanggunja: "assets/idioms-v2/yangsanggunja.webp",
        baekbalbaekjung: "assets/idioms-v2/baekbalbaekjung.webp",
        deungyongmun: "assets/idioms-v2/deungyongmun.webp",
        mosun: "assets/idioms-v2/mosun.webp",
        sajok: "assets/idioms-v2/sajok.webp",
        baekmi: "assets/idioms-v2/baekmi.webp",
        gyereuk: "assets/idioms-v2/gyereuk.webp",
        toego: "assets/idioms-v2/toego.webp",
        osipbobaekbo: "assets/idioms-v2/osipbobaekbo.webp",
        sipjungpalgu: "assets/idioms-v2/sipjungpalgu.webp",
        cheonsinmango: "assets/idioms-v2/cheonsinmango.webp",
        samsaileon: "assets/idioms-v2/samsaileon.webp",
        geungeomjeoryak: "assets/idioms-v2/geungeomjeoryak.webp",
        jamunjadap: "assets/idioms-v2/jamunjadap.webp",
        bulmungaji: "assets/idioms-v2/bulmungaji.webp",
        suguchosim: "assets/idioms-v2/suguchosim.webp",
        yongdusami: "assets/idioms-v2/yongdusami.webp",
        cheonjaeilu: "assets/idioms-v2/cheonjaeilu.webp",
        gogunbuntu: "assets/idioms-v2/gogunbuntu.webp",
        gojingamrae: "assets/idioms-v2/gojingamrae.webp",
        isimjeonsim: "assets/idioms-v2/isimjeonsim.webp",
        yeokjisaji: "assets/idioms-v2/yeokjisaji.webp",
        jumagapyeon: "assets/idioms-v2/jumagapyeon.webp",
        chiljeonpalgi: "assets/idioms-v2/chiljeonpalgi.webp",
        jagsimsamil: "assets/idioms-v2/jagsimsamil.webp",
        jaeopjadeuk: "assets/idioms-v2/jaeopjadeuk.webp",
        dongsangimong: "assets/idioms-v2/dongsangimong.webp",
        gyeoljahaeji: "assets/idioms-v2/gyeoljahaeji.webp",
        ilseogijo: "assets/idioms-v2/ilseogijo.webp",
        samilcheonha: "assets/idioms-v2/samilcheonha.webp",
        dongsimhyeomnyeok: "assets/idioms-v2/dongsimhyeomnyeok.webp",
        sanjeonsujeon: "assets/idioms-v2/sanjeonsujeon.webp",
        cheonbangjichuk: "assets/idioms-v2/cheonbangjichuk.webp",
        yumyeongmusil: "assets/idioms-v2/yumyeongmusil.webp",
        munjeonseongsi: "assets/idioms-v2/munjeonseongsi.webp",
        taksanggongnon: "assets/idioms-v2/taksanggongnon.webp",
        jaseungjabak: "assets/idioms-v2/jaseungjabak.webp",
        myeonggyeongjisu: "assets/idioms-v2/myeonggyeongjisu.webp",
        ingwaeungbo: "assets/idioms-v2/ingwaeungbo.webp",
        dongseonambuk: "assets/idioms-v2/dongseonambuk.webp",
        dongmunseodap: "assets/idioms-v2/dongmunseodap.webp",
        iyeolchyeol: "assets/idioms-v2/iyeolchyeol.webp",
        gyeonmulsaengsim: "assets/idioms-v2/gyeonmulsaengsim.webp",
        iljangildan: "assets/idioms-v2/iljangildan.webp",
        sipinsipsaek: "assets/idioms-v2/sipinsipsaek.webp",
        seongyeonjimyeong: "assets/idioms-v2/seongyeonjimyeong.webp",
        dumunbulchul: "assets/idioms-v2/dumunbulchul.webp",
        gaegwacheonseon: "assets/idioms-v2/gaegwacheonseon.webp",
        gwalmoksangdae: "assets/idioms-v2/gwalmoksangdae.webp",
        gojangnanmyeong: "assets/idioms-v2/gojangnanmyeong.webp",
        gyogaksaru: "assets/idioms-v2/gyogaksaru.webp",
        geumsangcheomhwa: "assets/idioms-v2/geumsangcheomhwa.webp",
        seolsanggasang: "assets/idioms-v2/seolsanggasang.webp",
        gusailsaeng: "assets/idioms-v2/gusailsaeng.webp",
        baesujin: "assets/idioms-v2/baesujin.webp",
        buhwanoedong: "assets/idioms-v2/buhwanoedong.webp",
        ajaninsu: "assets/idioms-v2/ajaninsu.webp",
        imgibyeon: "assets/idioms-v2/imgibyeon.webp",
        jintoeyangnan: "assets/idioms-v2/jintoeyangnan.webp",
        gapnoneulbak: "assets/idioms-v2/gapnoneulbak.webp",
        daedongsoi: "assets/idioms-v2/daedongsoi.webp",
        maksangmakha: "assets/idioms-v2/maksangmakha.webp",
        myeongbulheojeon: "assets/idioms-v2/myeongbulheojeon.webp",
        sapilgwijeong: "assets/idioms-v2/sapilgwijeong.webp",
        orimujung: "assets/idioms-v2/orimujung.webp",
        yuyusangjong: "assets/idioms-v2/yuyusangjong.webp",
        cheongcheonbyeongnyeok: "assets/idioms-v2/cheongcheonbyeongnyeok.webp",
        hosadama: "assets/idioms-v2/hosadama.webp",
        hwangoltaltae: "assets/idioms-v2/hwangoltaltae.webp",
        gandamsangjo: "assets/idioms-v2/gandamsangjo.webp",
        jukmagou: "assets/idioms-v2/jukmagou.webp",
        gakgolnanmang: "assets/idioms-v2/gakgolnanmang.webp",
        anhamuin: "assets/idioms-v2/anhamuin.webp",
        huanmuchi: "assets/idioms-v2/huanmuchi.webp",
        garyeomjugu: "assets/idioms-v2/garyeomjugu.webp",
        nuranjiwi: "assets/idioms-v2/nuranjiwi.webp"
    };



    const byId = (id) => document.getElementById(id);
    const elements = {
        headerKnown: byId("headerKnown"), headerTotal: byId("headerTotal"),
        masteryPercent: byId("masteryPercent"), masteryBar: byId("masteryBar"),
        knownCount: byId("knownCount"), reviewCount: byId("reviewCount"), unseenCount: byId("unseenCount"),
        themeSelect: byId("themeSelect"), reviewOnlyButton: byId("reviewOnlyButton"), shuffleDeckButton: byId("shuffleDeckButton"),
        emptyDeck: byId("emptyDeck"), showAllButton: byId("showAllButton"), studyArea: byId("studyArea"),
        cardPosition: byId("cardPosition"), cardProgress: byId("cardProgress"), idiomCard: byId("idiomCard"),
        themeBadge: byId("themeBadge"), verificationBadge: byId("verificationBadge"),
        idiomHanja: byId("idiomHanja"), idiomWord: byId("idiomWord"), cardDetails: byId("cardDetails"),
        idiomHanjaExpl: byId("idiomHanjaExpl"), idiomMeaning: byId("idiomMeaning"), idiomStory: byId("idiomStory"),
        idiomIllustration: byId("idiomIllustration"), idiomIllustrationImage: byId("idiomIllustrationImage"),
        previousCard: byId("previousCard"), nextCard: byId("nextCard"),
        memoryActions: byId("memoryActions"), markReview: byId("markReview"), markKnown: byId("markKnown"),
        gameIntro: byId("gameIntro"), quizStage: byId("quizStage"), quizResult: byId("quizResult"),
        bestScore: byId("bestScore"), startQuiz: byId("startQuiz"), quizPosition: byId("quizPosition"),
        quizStreak: byId("quizStreak"), quizScore: byId("quizScore"), quizBar: byId("quizBar"),
        questionType: byId("questionType"), questionPrompt: byId("questionPrompt"), answerOptions: byId("answerOptions"),
        questionIllustration: byId("questionIllustration"), questionIllustrationImage: byId("questionIllustrationImage"),
        answerFeedback: byId("answerFeedback"), feedbackTitle: byId("feedbackTitle"), feedbackCopy: byId("feedbackCopy"),
        feedbackStory: byId("feedbackStory"), feedbackStoryCopy: byId("feedbackStoryCopy"),
        nextQuestion: byId("nextQuestion"), resultTitle: byId("resultTitle"), resultScore: byId("resultScore"),
        resultMessage: byId("resultMessage"), resultMistakeList: byId("resultMistakeList"),
        retryQuiz: byId("retryQuiz"), retryMistakes: byId("retryMistakes"), reviewMistakes: byId("reviewMistakes"),
        libraryTotal: byId("libraryTotal"), librarySearch: byId("librarySearch"), themeFilters: byId("themeFilters"),
        libraryGrid: byId("libraryGrid"), libraryEmpty: byId("libraryEmpty"), toast: byId("toast"),
        playerGreeting: byId("playerGreeting"),
        lessonOverview: byId("lessonOverview"), learningShell: byId("learningShell"), lessonList: byId("lessonList"),
        lessonKnownTotal: byId("lessonKnownTotal"), lessonItemTotal: byId("lessonItemTotal"), allQuizButton: byId("allQuizButton"),
        backLink: document.querySelector(".back-link"),
        backToLessons: byId("backToLessons"), currentLessonNumber: byId("currentLessonNumber"),
        currentLessonTitle: byId("currentLessonTitle"), currentLessonQuiz: byId("currentLessonQuiz"),
        cardNavigation: byId("cardNavigation")
    };

    let progress = {};
    let currentLessonIndex = 0;
    let quizScope = "lesson";
    let deck = [...data];
    let currentIndex = 0;
    let revealed = false;
    let reviewOnly = false;
    let selectedTheme = "전체";
    let selectedQuizMode = "mixed";
    let quiz = [];
    let quizIndex = 0;
    let quizScore = 0;
    let quizStreak = 0;
    let quizAnswered = false;
    let quizQuestionHadWrong = false;
    let quizMistakes = [];
    let quizIsMistakeRetry = false;
    let selectedLibraryTheme = "전체";
    let toastTimer = 0;

    function checkpoint(){return {progress,currentLessonIndex,quizScope,deck:deck.map(i=>i.id),currentIndex,reviewOnly,selectedTheme,selectedQuizMode,quiz,quizIndex,quizScore,quizStreak,quizAnswered,quizQuestionHadWrong,quizMistakes,quizIsMistakeRetry,mode:recordMode};}
    function saveProgress(events=[],complete=false){
        if(!records.session || records.session.status!=='active')return Promise.resolve();
        return records.save({checkpoint:checkpoint(),events,complete,progress:{current:recordMode==='game'?Math.min(quiz.length,quizIndex+(quizAnswered?1:0)):currentIndex,total:recordMode==='game'?quiz.length:null}});
    }
    async function beginRecord(){
        const session=await records.start({contentKey:quizScope==='all'?'all':String(currentLessonIndex),title:quizScope==='all'?'한자성어 · 전체 문제':'한자성어 · '+lessons[currentLessonIndex].title,version:'20261002',checkpoint:checkpoint()});
        const cp=session.checkpoint; progress=cp.progress;currentLessonIndex=cp.currentLessonIndex;quizScope=cp.quizScope;deck=cp.deck.map(id=>data.find(i=>i.id===id)).filter(Boolean);currentIndex=cp.currentIndex;reviewOnly=cp.reviewOnly;selectedTheme=cp.selectedTheme;selectedQuizMode=cp.selectedQuizMode;quiz=cp.quiz;quizIndex=cp.quizIndex;quizScore=cp.quizScore;quizStreak=cp.quizStreak;quizAnswered=cp.quizAnswered;quizQuestionHadWrong=cp.quizQuestionHadWrong;quizMistakes=cp.quizMistakes;quizIsMistakeRetry=cp.quizIsMistakeRetry;recordMode=cp.mode;
        if(recordMode==='game' && quiz.length){elements.gameIntro.hidden=true;elements.quizResult.hidden=true;elements.quizStage.hidden=false;renderQuestion();}else renderCard();
        switchView(recordMode);
    }

    function showToast(message) {
        clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1700);
    }

    function currentLessonItems() {
        if (quizScope === "all") return data;
        const lesson = lessons[currentLessonIndex];
        if (!lesson) return data;
        const lessonIds = new Set(lesson.ids);
        return data.filter((idiom) => lessonIds.has(idiom.id));
    }

    function currentIdiom() {
        return deck[currentIndex] || null;
    }

    function renderSummary() {
        const summary = core.summarize(data, progress);
        elements.headerKnown.textContent = summary.known;
        elements.headerTotal.textContent = `/ ${summary.total}`;
        elements.masteryPercent.textContent = `${summary.percent}%`;
        elements.masteryBar.style.width = `${summary.percent}%`;
        elements.knownCount.textContent = summary.known;
        elements.reviewCount.textContent = summary.review;
        elements.unseenCount.textContent = summary.unseen;
    }

    function buildDeck(options = {}) {
        const previousId = options.keepId || currentIdiom()?.id;
        deck = core.filterDeck(currentLessonItems(), {
            status: reviewOnly ? "review" : "all",
            progress
        }, selectedTheme);

        if (options.shuffle) deck = core.shuffle(deck);
        const preservedIndex = previousId ? deck.findIndex((item) => item.id === previousId) : -1;
        currentIndex = preservedIndex >= 0 ? preservedIndex : Math.min(currentIndex, Math.max(0, deck.length - 1));
        revealed = true;
        renderCard();
    }

    function setRevealed() {
        if (!currentIdiom()) return;
        revealed = true;
        elements.idiomCard.classList.add("revealed");
        elements.cardDetails.hidden = false;
        elements.memoryActions.hidden = false;
    }

    function renderMemoryStatus(idiom) {
        const status = progress[idiom.id]?.status || "";
        elements.markKnown.classList.toggle("selected", status === "known");
        elements.markReview.classList.toggle("selected", status === "review");
        elements.markKnown.setAttribute("aria-pressed", String(status === "known"));
        elements.markReview.setAttribute("aria-pressed", String(status === "review"));
    }

    function renderHanjaExpl(container, text) {
        if (!container) return;
        container.replaceChildren();
        if (!text) return;
        const parts = text.split(/\s*·\s*/);
        parts.forEach((part) => {
            const chip = document.createElement("span");
            chip.className = "hanja-chip";
            const [, character, reading] = part.match(/^(\S+)\s*\((.+)\)$/) || [];
            if (character) {
                const hanja = document.createElement("b");
                hanja.className = "hanja-inline";
                hanja.textContent = character;
                const sound = document.createElement("span");
                sound.textContent = reading;
                chip.append(hanja, sound);
            } else {
                chip.textContent = part;
            }
            container.append(chip);
        });
    }

    function renderCard() {
        const idiom = currentIdiom();
        const hasCards = Boolean(idiom);
        elements.emptyDeck.hidden = hasCards;
        elements.studyArea.hidden = !hasCards;
        if (!idiom) return;

        elements.cardPosition.textContent = `${currentIndex + 1} / ${deck.length}`;
        elements.cardProgress.style.width = `${((currentIndex + 1) / deck.length) * 100}%`;
        elements.themeBadge.textContent = idiom.theme;
        elements.verificationBadge.textContent = idiom.verification;
        elements.verificationBadge.classList.toggle("compare", idiom.verification !== "원전 확인");
        elements.idiomHanja.textContent = idiom.hanja;
        elements.idiomWord.textContent = idiom.word;
        renderHanjaExpl(elements.idiomHanjaExpl, idiom.hanjaExpl);
        elements.idiomMeaning.textContent = idiom.meaning;
        elements.idiomStory.textContent = idiom.story;
        const illustration = ILLUSTRATIONS[idiom.id] || "";
        elements.idiomIllustration.hidden = !illustration;
        if (illustration) {
            elements.idiomIllustrationImage.src = illustration;
            elements.idiomIllustrationImage.alt = `${idiom.word} 유래 삽화`;
        } else {
            elements.idiomIllustrationImage.removeAttribute("src");
            elements.idiomIllustrationImage.alt = "";
        }
        elements.previousCard.disabled = deck.length < 2;
        elements.nextCard.disabled = deck.length < 2;
        renderMemoryStatus(idiom);
        setRevealed(revealed);
    }

    function moveCard(direction) {
        if(recordBusy)return;
        if (!deck.length) return;
        currentIndex = (currentIndex + direction + deck.length) % deck.length;
        revealed = true;
        renderCard(); saveProgress();
        elements.idiomCard.focus({ preventScroll: true });
    }

    async function markCurrent(status) {
        if(recordBusy)return;
        const idiom = currentIdiom();
        if (!idiom) return;
        progress[idiom.id] = { status, updatedAt: new Date().toISOString() };
        recordBusy=true;elements.learningShell.inert=true;
        await saveProgress([{kind:'self-assessment',questionKey:idiom.id,response:status,snapshot:{title:idiom.word}}]);recordBusy=false;elements.learningShell.inert=false;
        renderSummary();
        renderLessonOverview();
        showToast(`${idiom.word}: ${status === "known" ? "암기 완료" : "복습 필요"}`);

        if (reviewOnly && status === "known") {
            buildDeck();
        } else {
            renderMemoryStatus(idiom);
            setTimeout(() => moveCard(1), 320);
        }
    }

    function switchView(viewName) {
        recordMode=viewName;
        document.querySelectorAll(".mode-tab").forEach((button) => {
            const active = button.dataset.view === viewName;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll(".view-panel").forEach((panel) => {
            panel.hidden = panel.id !== `${viewName}View`;
        });
        if (viewName === "library") renderLibrary();
    }

    async function startQuiz(mistakeIds = null) {
        if(recordBusy)return;
        const lessonPool = currentLessonItems();
        const quizPool = selectedQuizMode === "image"
            ? lessonPool.filter((idiom) => Boolean(ILLUSTRATIONS[idiom.id]))
            : lessonPool;
        if (quizPool.length < 4) {
            showToast("이 단계에는 삽화 문제가 없습니다.");
            return;
        }
        quizIsMistakeRetry = Array.isArray(mistakeIds);
        if (quizIsMistakeRetry) {
            const mistakeSet = new Set(mistakeIds);
            quiz = core.shuffle(quizPool.filter((idiom) => mistakeSet.has(idiom.id)))
                .map((idiom) => core.createQuestion(idiom, quizPool, selectedQuizMode));
            if (!quiz.length) return;
        } else {
            quiz = core.buildQuiz(quizPool, Math.min(10, quizPool.length), selectedQuizMode);
        }
        quizIndex = 0;
        quizScore = 0;
        quizStreak = 0;
        quizAnswered = false;
        quizMistakes = [];
        elements.gameIntro.hidden = true;
        elements.quizResult.hidden = true;
        elements.quizStage.hidden = false;
        recordMode="game";
        if(!records.session || records.session.status!=="active")await beginRecord();
        renderQuestion(); await saveProgress();
    }

    function renderQuestion() {
        const question = quiz[quizIndex];
        if (!question) return finishQuiz();
        const tried=question.tried || [];
        quizAnswered=tried.includes(question.answerId);quizQuestionHadWrong=tried.some(id=>id!==question.answerId);
        elements.quizPosition.textContent = `문제 ${quizIndex + 1} / ${quiz.length}`;
        elements.quizStreak.textContent = quizStreak;
        elements.quizScore.textContent = quizScore;
        elements.quizBar.style.width = `${(quizIndex / quiz.length) * 100}%`;
        const typeLabels = { story: "유래 문제", meaning: "뜻 문제", image: "삽화 문제" };
        elements.questionType.textContent = typeLabels[question.type] || "뜻 문제";
        elements.questionPrompt.hidden = question.type === "image";
        elements.questionPrompt.textContent = question.type === "image" ? "" : question.prompt;
        const illustration = question.type === "image" ? ILLUSTRATIONS[question.id] : "";
        elements.questionIllustration.hidden = !illustration;
        if (illustration) {
            elements.questionIllustrationImage.src = illustration;
            elements.questionIllustrationImage.alt = "한자성어 유래를 나타낸 문제 삽화";
        } else {
            elements.questionIllustrationImage.removeAttribute("src");
            elements.questionIllustrationImage.alt = "";
        }
        elements.answerFeedback.hidden = true;
        elements.answerFeedback.classList.remove("wrong");
        elements.answerOptions.replaceChildren();

        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "answer-option";
            button.dataset.answerId = option.id;
            button.disabled=quizAnswered||tried.includes(option.id);
            if(tried.includes(option.id))button.classList.add(option.id===question.answerId?'correct':'wrong');
            const [word, hanja] = option.label.split(" · ");
            button.innerHTML = `<span>${index + 1}</span>${word}${hanja ? ` · <b class="hanja-inline">${hanja}</b>` : ""}`;
            button.addEventListener("click", () => chooseAnswer(option.id));
            elements.answerOptions.append(button);
        });
        elements.nextQuestion.disabled=!quizAnswered;
        elements.answerOptions.querySelector('button:not(:disabled)')?.focus();
    }

    async function chooseAnswer(answerId) {
        if(quizAnswered||recordBusy)return;recordBusy=true;elements.learningShell.inert=true;
        const question = quiz[quizIndex];
        const correct = answerId === question.answerId;
        const answerIdiom = data.find((item) => item.id === question.answerId);
        (question.tried ||= []).push(answerId);
        const event={kind:'answer',questionKey:question.id+':'+question.type,response:question.options.find(o=>o.id===answerId)?.label||answerId,correct,snapshot:{prompt:question.prompt,choices:question.options.map(o=>o.label)}};

        if (!correct) {
            quizQuestionHadWrong = true;
            quizMistakes.push(question.answerId);
            const selected = elements.answerOptions.querySelector(`[data-answer-id="${answerId}"]`);
            if (selected) {
                selected.disabled = true;
                selected.classList.add("wrong");
            }
            elements.feedbackTitle.textContent = "다시 생각해 보세요.";
            elements.feedbackCopy.textContent = "다른 답을 골라보세요.";
            elements.feedbackStory.open = false;
            elements.answerFeedback.classList.add("wrong");
            elements.answerFeedback.hidden = false;
            await saveProgress([event]);recordBusy=false;elements.learningShell.inert=false;return;
        }
        quizAnswered = true;

        if (!quizQuestionHadWrong) {
            quizScore += 1;
            quizStreak += 1;
        } else {
            quizStreak = 0;
        }

        elements.quizScore.textContent = quizScore;
        elements.quizStreak.textContent = quizStreak;
        elements.answerOptions.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
            if (button.dataset.answerId === question.answerId) button.classList.add("correct");
            else if (button.dataset.answerId === answerId) button.classList.add("wrong");
        });
        elements.feedbackTitle.textContent = "정답";
        elements.feedbackCopy.textContent = answerIdiom.meaning;
        elements.feedbackStoryCopy.textContent = answerIdiom.story;
        elements.feedbackStory.open = !correct;
        elements.answerFeedback.classList.toggle("wrong", !correct);
        elements.answerFeedback.hidden = false;
        elements.nextQuestion.textContent = quizIndex === quiz.length - 1 ? "결과 보기 →" : "다음 문제 →";
        elements.nextQuestion.disabled=false;
        await saveProgress([event]);recordBusy=false;elements.learningShell.inert=false;
        elements.nextQuestion.focus();
    }

    async function goToNextQuestion() {
        if (!quizAnswered||recordBusy) return;
        quizIndex += 1;
        if (quizIndex >= quiz.length) finishQuiz();
        else {renderQuestion();await saveProgress();}
    }

    async function finishQuiz(){if(recordBusy)return;recordBusy=true;elements.learningShell.inert=true;await saveProgress([],true);showLessonOverview();records.showResult();recordBusy=false;elements.learningShell.inert=false;}

    function retryQuizMistakes() {
        if (!quizMistakes.length) return;
        startQuiz([...new Set(quizMistakes)]);
    }

    function reviewQuizMistakes() {
        if (!quizMistakes.length) return;
        reviewOnly = true;
        selectedTheme = "전체";
        elements.themeSelect.value = "전체";
        elements.reviewOnlyButton.setAttribute("aria-pressed", "true");
        buildDeck({ keepId: quizMistakes[0] });
        const targetIndex = deck.findIndex((item) => item.id === quizMistakes[0]);
        if (targetIndex >= 0) currentIndex = targetIndex;
        revealed = true;
        renderCard();
        switchView("learn");
        document.getElementById("learnHeading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

function renderLessonOverview() {
        const knownTotal = data.filter((idiom) => progress[idiom.id]?.status === "known").length;
        elements.lessonKnownTotal.textContent = knownTotal;
        elements.lessonItemTotal.textContent = data.length;
        elements.lessonList.replaceChildren();

        lessons.forEach((lesson, index) => {
            const items = lesson.ids.map((id) => data.find((idiom) => idiom.id === id)).filter(Boolean);
            const known = items.filter((idiom) => progress[idiom.id]?.status === "known").length;
            const button = document.createElement("button");
            button.type = "button";
            button.className = `lesson-card${known === items.length ? " complete" : ""}`;
            button.innerHTML = `
                <span class="lesson-number">${index + 1}</span>
                <span class="lesson-card-body">
                    <span class="lesson-card-top"><strong>${lesson.title}</strong><b>${items.length}개</b></span>
                    <span class="lesson-description">${lesson.description}</span>
                    <span class="lesson-examples">${items.slice(0, 3).map((item) => item.word).join(" · ")}</span>
                </span>
                <span class="lesson-progress">${known === items.length ? "완료" : `${known}/${items.length}`}</span>`;
            button.addEventListener("click", () => openLesson(index));
            elements.lessonList.append(button);
        });
    }

    async function openLesson(index, keepId = "") {
        if(recordBusy)return;recordBusy=true;elements.learningShell.inert=true;
        quizScope = "lesson";
        currentLessonIndex = Math.max(0, Math.min(index, lessons.length - 1));
        const lesson = lessons[currentLessonIndex];
        reviewOnly = false;
        selectedTheme = "전체";
        elements.reviewOnlyButton.setAttribute("aria-pressed", "false");
        elements.themeSelect.value = "전체";
        elements.currentLessonNumber.textContent = `${currentLessonIndex + 1}차시`;
        elements.currentLessonTitle.textContent = lesson.title;
        elements.currentLessonQuiz.textContent = "이 차시 문제";
        document.body.classList.add("lesson-active");
        elements.lessonOverview.hidden = true;
        elements.learningShell.hidden = false;
        buildDeck({ keepId });
        revealed = true;
        renderCard();
        switchView('learn');quiz=[];quizIndex=0;quizAnswered=false;
        await beginRecord();recordBusy=false;elements.learningShell.inert=false;
        elements.learningShell.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function openAllQuiz() {
        if(recordBusy)return;recordBusy=true;elements.learningShell.inert=true;
        quizScope = "all";
        document.body.classList.add("lesson-active");
        elements.lessonOverview.hidden = true;
        elements.learningShell.hidden = false;
        elements.currentLessonNumber.textContent = "전체";
        elements.currentLessonTitle.textContent = "문제은행";
        elements.currentLessonQuiz.textContent = "성어 설명";
        switchView('game');quiz=[];quizIndex=0;quizAnswered=false;
        await beginRecord();recordBusy=false;elements.learningShell.inert=false;
        elements.learningShell.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function showLessonOverview() {
        document.body.classList.remove("lesson-active");
        elements.learningShell.hidden = true;
        elements.lessonOverview.hidden = false;
        renderLessonOverview();
        elements.lessonOverview.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function buildThemeControls() {
        const themes = ["전체", ...new Set(data.map((item) => item.theme))];
        themes.slice(1).forEach((theme) => {
            const option = document.createElement("option");
            option.value = theme;
            option.textContent = theme;
            elements.themeSelect.append(option);
        });

        elements.themeFilters.replaceChildren();
        themes.forEach((theme) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `theme-filter${theme === selectedLibraryTheme ? " active" : ""}`;
            button.dataset.theme = theme;
            button.textContent = theme;
            button.addEventListener("click", () => {
                selectedLibraryTheme = theme;
                renderLibrary();
            });
            elements.themeFilters.append(button);
        });
    }

    function openIdiomFromLibrary(id) {
        const lessonIndex = lessons.findIndex((lesson) => lesson.ids.includes(id));
        if (lessonIndex >= 0) openLesson(lessonIndex, id);
        reviewOnly = false;
        selectedTheme = "전체";
        elements.reviewOnlyButton.setAttribute("aria-pressed", "false");
        elements.themeSelect.value = "전체";
        buildDeck({ keepId: id });
        currentIndex = deck.findIndex((item) => item.id === id);
        revealed = true;
        renderCard();
        switchView("learn");
        document.getElementById("learnHeading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderLibrary() {
        const query = elements.librarySearch.value.trim().toLocaleLowerCase("ko");
        const filtered = data.filter((idiom) => {
            const themeMatches = selectedLibraryTheme === "전체" || idiom.theme === selectedLibraryTheme;
            const haystack = `${idiom.word} ${idiom.hanja} ${idiom.hanjaExpl || ""} ${idiom.meaning} ${idiom.story}`.toLocaleLowerCase("ko");
            return themeMatches && (!query || haystack.includes(query));
        });

        elements.themeFilters.querySelectorAll("button").forEach((button) => {
            button.classList.toggle("active", button.dataset.theme === selectedLibraryTheme);
        });
        elements.libraryGrid.replaceChildren();
        filtered.forEach((idiom) => {
            const card = document.createElement("article");
            card.className = "library-card";
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `${idiom.word} 자세히 학습하기`);
            card.innerHTML = `
                <span class="library-theme">${idiom.theme}</span>
                <p class="library-hanja">${idiom.hanja}</p>
                <h3>${idiom.word}</h3>
                <p>${idiom.meaning}</p>
                <footer><span>${idiom.verification}</span><span>상세 보기 →</span></footer>`;
            card.addEventListener("click", () => openIdiomFromLibrary(idiom.id));
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openIdiomFromLibrary(idiom.id);
                }
            });
            elements.libraryGrid.append(card);
        });
        elements.libraryEmpty.hidden = filtered.length > 0;
    }

    document.querySelectorAll(".mode-tab").forEach((button) => {
        button.addEventListener("click", () => switchView(button.dataset.view));
    });

    elements.backToLessons.addEventListener("click", showLessonOverview);

    // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
    // 차시 목록(집)이 아니면 사이트 밖으로 나가지 않고 차시 목록으로만 돌아간다.
    window.addEventListener("sitebackrequest", (event) => {
        if (!elements.learningShell.hidden) { event.preventDefault(); showLessonOverview(); }
    });

    // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
    // 차시(학습) 화면이면 차시 목록으로만 돌아가고, 이미 목록이면 그때 메인 화면으로 나간다.
    elements.backLink?.addEventListener("click", (event) => {
        if (!elements.learningShell.hidden) { event.preventDefault(); showLessonOverview(); }
    });
    elements.allQuizButton.addEventListener("click", openAllQuiz);
    elements.currentLessonQuiz.addEventListener("click", () => {
        const gameVisible = !byId("gameView").hidden;
        switchView(gameVisible ? "learn" : "game");
        elements.currentLessonQuiz.textContent = gameVisible ? "이 차시 문제" : "성어 설명";
    });
    elements.themeSelect.addEventListener("change", () => {
        selectedTheme = elements.themeSelect.value;
        buildDeck();
    });
    elements.reviewOnlyButton.addEventListener("click", () => {
        reviewOnly = !reviewOnly;
        elements.reviewOnlyButton.setAttribute("aria-pressed", String(reviewOnly));
        buildDeck();
    });
    elements.shuffleDeckButton.addEventListener("click", () => {
        buildDeck({ shuffle: true });
        showToast("카드 순서를 섞었습니다.");
    });
    elements.showAllButton.addEventListener("click", () => {
        reviewOnly = false;
        selectedTheme = "전체";
        elements.reviewOnlyButton.setAttribute("aria-pressed", "false");
        elements.themeSelect.value = "전체";
        buildDeck();
    });
    elements.previousCard.addEventListener("click", () => moveCard(-1));
    elements.nextCard.addEventListener("click", () => moveCard(1));

    elements.markKnown.addEventListener("click", () => markCurrent("known"));
    elements.markReview.addEventListener("click", () => markCurrent("review"));

    document.querySelectorAll(".quiz-mode").forEach((button) => {
        button.addEventListener("click", () => {
            selectedQuizMode = button.dataset.quizMode;
            document.querySelectorAll(".quiz-mode").forEach((modeButton) => {
                const selected = modeButton === button;
                modeButton.classList.toggle("selected", selected);
                modeButton.setAttribute("aria-pressed", String(selected));
            });
        });
    });
    elements.startQuiz.addEventListener("click", () => startQuiz());
    elements.nextQuestion.addEventListener("click", goToNextQuestion);
    elements.retryQuiz.addEventListener("click", () => startQuiz());
    elements.retryMistakes.addEventListener("click", retryQuizMistakes);
    elements.reviewMistakes.addEventListener("click", reviewQuizMistakes);
    elements.librarySearch.addEventListener("input", renderLibrary);
    document.addEventListener("keydown", (event) => {
        if (event.target.matches("input, select, textarea")) return;
        const learnVisible = !byId("learnView").hidden;
        const quizVisible = !elements.quizStage.hidden;

        if (learnVisible) {
            if (event.key === "ArrowLeft") moveCard(-1);
            else if (event.key === "ArrowRight") moveCard(1);
            else if (revealed && event.key.toLocaleLowerCase() === "k") markCurrent("known");
            else if (revealed && event.key.toLocaleLowerCase() === "r") markCurrent("review");
        } else if (quizVisible && !quizAnswered && /^[1-4]$/.test(event.key)) {
            const option = quiz[quizIndex]?.options[Number(event.key) - 1];
            if (option) chooseAnswer(option.id);
        } else if (quizVisible && quizAnswered && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            goToNextQuestion();
        }
    });

    function initialize() {
        if (!data.length || !core) {
            document.body.innerHTML = "<p>학습 데이터를 불러오지 못했습니다.</p>";
            return;
        }
        elements.playerGreeting.textContent = "한자성어 학습";
        elements.libraryTotal.textContent = data.length;
        buildThemeControls();

        renderSummary();
        elements.bestScore.parentElement.hidden=true;
        renderLessonOverview();
        buildDeck();
        renderLibrary();
    }

    initialize();
    const resume=new URLSearchParams(location.search).get('record');
    if(resume==='all')await openAllQuiz();else if(resume!==null && lessons[Number(resume)])await openLesson(Number(resume));
})();

