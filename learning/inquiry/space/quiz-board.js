/* 우주관찰 세 앱이 함께 쓰는 확인 문제 화면.
   큰 주제를 고르면 그 주제의 작은 주제 칩이 나오고, 문항은 한 번에
   다 쏟아내지 않고 묶음으로 끊어 보여 준다. */
(function () {
    "use strict";

    var CHUNK_SIZE = 15;

    function shuffle(list) {
        for (var i = list.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
        return list;
    }

    function correctIndexOf(item) {
        return typeof item.ans === 'number' ? item.ans : item.opts.indexOf(item.ans);
    }

    function buildCard(item, number, namePrefix) {
        var correctIndex = correctIndexOf(item);
        var options = shuffle(item.opts.map(function (text, index) {
            return { text: text, correct: index === correctIndex };
        }));

        var card = document.createElement('article');
        card.className = 'quiz-card';

        var head = document.createElement('div');
        head.className = 'quiz-card-head';
        var no = document.createElement('span');
        no.className = 'quiz-card-no';
        no.textContent = number + '번';
        var cat = document.createElement('span');
        cat.className = 'quiz-card-cat';
        cat.textContent = item.cat;
        head.appendChild(no);
        head.appendChild(cat);
        card.appendChild(head);

        var question = document.createElement('h3');
        question.textContent = item.q;
        card.appendChild(question);

        var optionsWrap = document.createElement('div');
        optionsWrap.className = 'quiz-options';
        options.forEach(function (opt, optIndex) {
            var label = document.createElement('label');
            if (opt.correct) label.dataset.correct = 'true';
            var input = document.createElement('input');
            input.type = 'radio';
            input.name = namePrefix + '-q' + number;
            input.value = String(optIndex);
            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opt.text));
            optionsWrap.appendChild(label);
        });
        card.appendChild(optionsWrap);

        var checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = 'answer-button';
        checkBtn.textContent = '정답 확인';
        card.appendChild(checkBtn);

        var resultEl = document.createElement('p');
        resultEl.className = 'answer-result';
        card.appendChild(resultEl);

        var expEl = document.createElement('p');
        expEl.className = 'answer-explanation';
        expEl.hidden = true;
        expEl.textContent = item.exp;
        card.appendChild(expEl);

        checkBtn.addEventListener('click', function () {
            var selected = optionsWrap.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                resultEl.textContent = '답을 먼저 선택하세요.';
                return;
            }
            var correct = selected.closest('label').dataset.correct === 'true';
            card.dataset.state = correct ? 'correct' : 'incorrect';
            if (correct) {
                resultEl.textContent = '정답입니다.';
                expEl.hidden = false;
                Array.prototype.forEach.call(optionsWrap.querySelectorAll('input'), function (input) {
                    input.disabled = true;
                });
                checkBtn.disabled = true;
            } else {
                resultEl.textContent = '다시 생각하고 다른 답을 골라보세요.';
                selected.checked = false;
                selected.disabled = true;
            }
        });

        return card;
    }

    function mount(config) {
        if (window.SpaceTopics) config = window.SpaceTopics.scopeQuiz(config, window.SpaceTopics.current(window.location));
        var questions = config.questions || [];
        var topics = config.topics || [];
        var namePrefix = config.namePrefix || 'quiz';
        var chunkSize = config.chunkSize || CHUNK_SIZE;

        var el = {};
        Object.keys(config.ids).forEach(function (key) {
            el[key] = document.getElementById(config.ids[key]);
        });
        if (!el.grid) return;

        var state = { topic: config.scopedTopic ? topics[0].name : null, sub: null, limit: chunkSize };

        function catsOfTopic(topic) {
            return topic.subs.reduce(function (all, sub) { return all.concat(sub.cats); }, []);
        }

        function countOfCats(cats) {
            return questions.filter(function (q) { return cats.indexOf(q.cat) !== -1; }).length;
        }

        function currentTopic() {
            return topics.filter(function (t) { return t.name === state.topic; })[0] || null;
        }

        function visibleQuestions() {
            if (!state.topic) return [];
            if (state.topic === 'all') return questions;

            var topic = currentTopic();
            if (!topic) return [];

            var cats = state.sub
                ? (topic.subs.filter(function (s) { return s.name === state.sub; })[0] || { cats: [] }).cats
                : catsOfTopic(topic);
            return questions.filter(function (q) { return cats.indexOf(q.cat) !== -1; });
        }

        function buildTopicTabs() {
            if (!el.tabs) return;
            el.tabs.textContent = '';

            var all = document.createElement('button');
            all.type = 'button';
            all.className = 'quiz-topic-tab';
            all.dataset.value = 'all';
            all.setAttribute('role', 'tab');
            all.setAttribute('aria-selected', state.topic === 'all' ? 'true' : 'false');
            all.innerHTML = '전체' + ' <span class="quiz-n">' + questions.length + '</span>';
            el.tabs.appendChild(all);

            topics.forEach(function (topic) {
                var tab = document.createElement('button');
                tab.type = 'button';
                tab.className = 'quiz-topic-tab';
                tab.dataset.value = topic.name;
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', state.topic === topic.name ? 'true' : 'false');
                tab.innerHTML = topic.name + ' <span class="quiz-n">' + countOfCats(catsOfTopic(topic)) + '</span>';
                el.tabs.appendChild(tab);
            });
        }

        function buildSubChips() {
            if (!el.subChips || !el.subRow) return;
            el.subChips.textContent = '';

            var topic = currentTopic();
            if (!topic || topic.subs.length <= 1) {
                el.subRow.hidden = true;
                return;
            }

            el.subRow.hidden = false;
            topic.subs.forEach(function (sub) {
                var count = countOfCats(sub.cats);
                if (count === 0) return;
                var chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'quiz-sub-chip';
                chip.dataset.value = sub.name;
                chip.setAttribute('aria-pressed', state.sub === sub.name ? 'true' : 'false');
                chip.innerHTML = sub.name + ' <span class="quiz-n">' + count + '</span>';
                el.subChips.appendChild(chip);
            });
        }

        function updateMoreButton(total) {
            if (!el.moreWrap || !el.moreBtn) return;
            if (total > state.limit) {
                el.moreWrap.hidden = false;
                var next = Math.min(chunkSize, total - state.limit);
                el.moreBtn.textContent = '더 보기 (' + next + '문제 더 · ' + state.limit + '/' + total + ')';
            } else {
                el.moreWrap.hidden = true;
            }
        }

        function render() {
            var items = visibleQuestions();
            el.grid.textContent = '';

            if (!state.topic) {
                if (el.guide) {
                    el.guide.hidden = false;
                    el.guide.textContent = '주제를 고르면 그 주제의 문제가 나옵니다.';
                }
                if (el.moreWrap) el.moreWrap.hidden = true;
                return;
            }

            if (el.guide) el.guide.hidden = items.length > 0;
            if (items.length === 0) {
                if (el.guide) el.guide.textContent = '고른 주제에 맞는 문제가 없습니다.';
                if (el.moreWrap) el.moreWrap.hidden = true;
                return;
            }

            items.slice(0, state.limit).forEach(function (item, index) {
                el.grid.appendChild(buildCard(item, index + 1, namePrefix));
            });
            updateMoreButton(items.length);
        }

        if (el.total) el.total.textContent = questions.length + '문제';
        if (config.scopedTopic) {
            var heading = el.grid.closest('.quiz-panel').querySelector('h2');
            if (heading) heading.textContent = config.scopedTopic.title + ' 확인 문제';
            if (el.tabs) el.tabs.closest('.quiz-picker-row').hidden = true;
            var subLabel = el.subRow && el.subRow.querySelector('.quiz-picker-label');
            if (subLabel) subLabel.textContent = '개념별 문제';
        }

        buildTopicTabs();
        buildSubChips();
        render();

        if (el.tabs) {
            el.tabs.addEventListener('click', function (event) {
                var tab = event.target.closest('.quiz-topic-tab');
                if (!tab) return;
                var value = tab.dataset.value;
                state.topic = state.topic === value ? null : value;
                state.sub = null;
                state.limit = chunkSize;
                Array.prototype.forEach.call(el.tabs.querySelectorAll('.quiz-topic-tab'), function (button) {
                    button.setAttribute('aria-selected', button.dataset.value === state.topic ? 'true' : 'false');
                });
                buildSubChips();
                render();
            });
        }

        if (el.subChips) {
            el.subChips.addEventListener('click', function (event) {
                var chip = event.target.closest('.quiz-sub-chip');
                if (!chip) return;
                var value = chip.dataset.value;
                state.sub = state.sub === value ? null : value;
                state.limit = chunkSize;
                Array.prototype.forEach.call(el.subChips.querySelectorAll('.quiz-sub-chip'), function (button) {
                    button.setAttribute('aria-pressed', button.dataset.value === state.sub ? 'true' : 'false');
                });
                render();
            });
        }

        if (el.moreBtn) {
            el.moreBtn.addEventListener('click', function () {
                var items = visibleQuestions();
                var from = state.limit;
                state.limit += chunkSize;
                items.slice(from, state.limit).forEach(function (item, index) {
                    el.grid.appendChild(buildCard(item, from + index + 1, namePrefix));
                });
                updateMoreButton(items.length);
            });
        }
    }

    window.SpaceQuizBoard = { mount: mount };
})();
