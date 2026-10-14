(() => {
    "use strict";

    const { setBilingualButtonLabel, figure, contextImage, compactContextImage } = window.COMPUTER_LAB_HELPERS;
    const renderers = window.COMPUTER_LAB_RENDERERS;

    renderers.h03 = (spec) => figure(spec, "visual-browser-inspector", `
        <section class="browser-state-lab" data-browser-lab data-browser-highlight="">
            <div class="browser-state-window">
                <div class="browser-state-tabs" data-browser-tab-region>
                    <div role="tablist" aria-label="열린 웹페이지 탭" data-browser-tab-list></div>
                    <button type="button" data-browser-new-tab aria-label="새 탭 열기">＋ 새 탭 <small>New Tab</small></button>
                </div>
                <div class="browser-state-toolbar">
                    <button type="button" data-browser-back aria-label="이 탭의 이전 페이지로 뒤로 가기" disabled>←<small>뒤로</small></button>
                    <div class="browser-current-address" data-browser-address aria-label="현재 탭의 주소 표시(읽기 전용)">
                        <span>현재 주소 <small>Current URL</small></span><code data-browser-url>https://search.local/</code>
                    </div>
                </div>
                <main class="browser-state-viewport" id="browser-state-viewport" data-browser-viewport>
                    <section class="browser-search-home" data-browser-page="home" data-search-service>
                        <header><strong>교실 검색 <small>Class Search</small></strong><p>아래 기관·글·날짜는 출처 비교를 위한 가상 자료입니다. ‘2026년 10월 12일 새봄도서관이 문을 여는가’를 확인해 보세요.</p></header>
                        <form data-browser-search-form>
                            <label for="browserSearchInput">찾고 싶은 내용 <small>Search Query</small></label>
                            <div><input id="browserSearchInput" data-browser-search-input value="새봄도서관 휴관일" autocomplete="off"><button type="submit">검색 <small>Search</small></button></div>
                        </form>
                        <div class="browser-search-topics" aria-label="이 검색 모형에 들어 있는 자료 주제">
                            <span>검색 가능한 자료 <small>Available Topics</small></span>
                            <div>
                                <button type="button" data-browser-suggestion="도서관">도서관 운영일</button>
                                <button type="button" data-browser-suggestion="혜성">혜성 <small>Comet</small></button>
                                <button type="button" data-browser-suggestion="수달">수달 <small>Otter</small></button>
                                <button type="button" data-browser-suggestion="강">강 <small>River</small></button>
                                <button type="button" data-browser-suggestion="달">달 <small>Moon</small></button>
                                <button type="button" data-browser-suggestion="날씨">날씨 <small>Weather</small></button>
                            </div>
                        </div>
                    </section>
                    <section class="browser-search-results" data-browser-page="results" data-search-service hidden>
                        <header><strong><span data-browser-query></span> 검색 결과</strong><small>검색 엔진이 찾은 로컬 웹페이지</small></header>
                        <div data-browser-result-list></div>
                    </section>
                    <article class="browser-local-page" data-browser-page="page" data-webpage-region hidden>
                        <header data-site-region><span data-page-site></span><small data-page-domain></small></header>
                        <h2 data-page-title></h2>
                        <dl class="page-source-facts" aria-label="자료의 출처 정보">
                            <div><dt>운영 기관 <small>Publisher</small></dt><dd data-page-publisher></dd></div>
                            <div><dt>작성자 <small>Author</small></dt><dd data-page-author></dd></div>
                            <div><dt>게시·수정일 <small>Date</small></dt><dd data-page-date></dd></div>
                            <div><dt>근거 <small>Evidence</small></dt><dd data-page-evidence></dd></div>
                        </dl>
                        <p data-page-body></p>
                        <button type="button" data-page-related-link data-link-region></button>
                    </article>
                </main>
            </div>
            <p class="browser-state-status" data-browser-status aria-live="polite">검색어를 직접 입력하고 검색을 실행해 보세요. 검색 결과도 브라우저 안에 표시되는 웹페이지입니다.</p>
            <div class="browser-state-terms" aria-label="현재 화면에서 용어가 가리키는 곳 확인">
                <span>현재 화면에서 찾기 <small>Locate the Term</small></span>
                <div>
                    <button type="button" data-browser-term="address" aria-pressed="false">주소 <small>Address</small></button>
                    <button type="button" data-browser-term="tab" aria-pressed="false">탭 <small>Tab</small></button>
                    <button type="button" data-browser-term="search" aria-pressed="false">검색 엔진 <small>Search Engine</small></button>
                    <button type="button" data-browser-term="site" aria-pressed="false">웹사이트 <small>Website</small></button>
                    <button type="button" data-browser-term="page" aria-pressed="false">웹페이지 <small>Webpage</small></button>
                    <button type="button" data-browser-term="link" aria-pressed="false">링크 <small>Link</small></button>
                </div>
            </div>
        </section>
    `);

    function setupBrowserLab() {
        const lab = document.querySelector("[data-browser-lab]");
        if (!lab) return;
        const tabList = lab.querySelector("[data-browser-tab-list]");
        const newTabButton = lab.querySelector("[data-browser-new-tab]");
        const backButton = lab.querySelector("[data-browser-back]");
        const urlOutput = lab.querySelector("[data-browser-url]");
        const searchForm = lab.querySelector("[data-browser-search-form]");
        const searchInput = lab.querySelector("[data-browser-search-input]");
        const queryOutput = lab.querySelector("[data-browser-query]");
        const resultList = lab.querySelector("[data-browser-result-list]");
        const pageSite = lab.querySelector("[data-page-site]");
        const pageDomain = lab.querySelector("[data-page-domain]");
        const pageTitle = lab.querySelector("[data-page-title]");
        const pageBody = lab.querySelector("[data-page-body]");
        const pagePublisher = lab.querySelector("[data-page-publisher]");
        const pageAuthor = lab.querySelector("[data-page-author]");
        const pageDate = lab.querySelector("[data-page-date]");
        const pageEvidence = lab.querySelector("[data-page-evidence]");
        const relatedLink = lab.querySelector("[data-page-related-link]");
        const status = lab.querySelector("[data-browser-status]");
        const termButtons = Array.from(lab.querySelectorAll("[data-browser-term]"));
        const suggestionButtons = Array.from(lab.querySelectorAll("[data-browser-suggestion]"));
        const pageViews = Array.from(lab.querySelectorAll("[data-browser-page]"));
        const catalog = {
            libraryArchive: {
                site: "새봄도서관", domain: "saebom.example", url: "https://saebom.example/notices/2025-hours",
                title: "2025년 도서관 이용 안내", summary: "월요일은 정기 휴관일입니다. 방문 전 운영 시간을 확인해 주세요.",
                body: "이 안내의 적용 기간은 2025년 1월 1일부터 12월 31일까지입니다. 새봄도서관은 매주 월요일 휴관합니다. 특별 운영일은 해당 연도의 별도 공지를 확인해 주세요.",
                publisher: "새봄도서관", author: "운영팀", date: "2025-01-02 게시", evidence: "2025년 운영 계획 · 적용 기간 명시",
                keywords: ["도서관", "새봄", "휴관", "운영"], related: "libraryCurrent"
            },
            libraryCurrent: {
                site: "새봄도서관", domain: "saebom.example", url: "https://saebom.example/notices/2026-special",
                title: "2026년 10월 특별 운영 안내", summary: "일부 정기 휴관일에 특별 운영합니다. 대상 날짜와 지점을 확인해 주세요.",
                body: "새봄도서관은 2026년 10월 12일 월요일에 독서 행사를 위해 오전 9시부터 오후 6시까지 운영합니다. 이 공지는 새봄도서관 본관에만 적용됩니다. 다른 지점은 각 지점의 공지를 확인해 주세요.",
                publisher: "새봄도서관", author: "운영팀", date: "2026-10-01 게시", evidence: "2026년 10월 특별 운영 일정 · 적용 지점 명시",
                keywords: ["도서관", "새봄", "휴관", "운영"], related: "libraryArchive"
            },
            comet: {
                site: "어린이 천문 관측소", domain: "astro.local", url: "https://astro.local/comets/tail",
                title: "혜성의 꼬리는 어떻게 생길까?", summary: "혜성이 태양 가까이 갈 때 얼음과 먼지가 어떻게 꼬리를 만드는지 관측 자료로 설명합니다.",
                body: "혜성의 얼음이 태양열을 받으면 기체와 먼지가 밖으로 나옵니다. 태양에서 오는 빛과 입자의 흐름이 이 물질을 태양 반대쪽으로 밀어 혜성의 꼬리가 나타납니다.",
                publisher: "어린이 천문 관측소", author: "별하늘 천문 교육팀", date: "2026-05-18 수정", evidence: "태양 탐사선 공개 사진 4장 · 혜성 꼬리 방향 모형 실험",
                keywords: ["혜성", "꼬리", "우주", "태양", "얼음", "comet"], related: "moon"
            },
            cometRumor: {
                site: "별빛 자유 게시판", domain: "star-talk.local", url: "https://star-talk.local/posts/comet-tail",
                title: "혜성은 빨리 달려서 꼬리가 뒤로 생긴다", summary: "작성자의 생각만으로 혜성 꼬리의 방향을 설명한 게시글입니다.",
                body: "혜성이 아주 빠르게 움직이기 때문에 머리 뒤쪽으로 꼬리가 생긴다고 생각합니다. 관측 자료나 참고 문헌은 따로 적지 않았습니다.",
                publisher: "운영 기관 표시 없음", author: "별명 ‘밤하늘친구’", date: "게시일 표시 없음", evidence: "관측 사진·자료 출처 링크 없음",
                keywords: ["혜성", "꼬리", "우주", "태양", "comet"], related: "comet"
            },
            otter: {
                site: "동물 관찰 도감", domain: "animals.local", url: "https://animals.local/otter/habitat",
                title: "수달의 서식지와 생활", summary: "강과 바다 가까이에서 사는 수달의 몸과 생활을 살펴봅니다.",
                body: "수달은 깨끗한 강과 바닷가처럼 먹이와 숨을 곳이 있는 물가에서 삽니다. 물갈퀴와 긴 꼬리는 헤엄칠 때 도움이 됩니다.",
                publisher: "우리생태연구원", author: "김하늘 생태 연구원", date: "2026-03-12 수정", evidence: "현장 관찰 기록 18회 · 생태 보고서 2건",
                keywords: ["수달", "동물", "서식지", "강", "바다", "otter"], related: "river"
            },
            otterStory: {
                site: "재미있는 동물 이야기", domain: "animal-story.local", url: "https://animal-story.local/posts/otter",
                title: "수달은 아무 물가에서나 살아요", summary: "여행에서 본 수달 한 마리를 바탕으로 쓴 개인 이야기입니다.",
                body: "여행 중 물가에서 수달을 보았습니다. 그래서 수달은 물만 있으면 어느 곳에서나 살 수 있다고 생각합니다.",
                publisher: "운영 기관 표시 없음", author: "작성자 표시 없음", date: "게시·수정일 표시 없음", evidence: "관찰 장소·자료 출처 링크 없음",
                keywords: ["수달", "동물", "서식지", "강", "바다", "otter"], related: "otter"
            },
            river: {
                site: "우리 강 연구소", domain: "river.local", url: "https://river.local/ecology/clean-water",
                title: "깨끗한 강과 물가 생물", summary: "강물의 상태와 물가 생물이 서로 어떤 영향을 주는지 알아봅니다.",
                body: "강에는 물고기, 곤충, 식물처럼 여러 생물이 함께 삽니다. 물이 오염되면 먹이와 숨을 곳이 줄어 물가 생물도 영향을 받습니다.",
                publisher: "우리 강 연구소", author: "박샘물 연구팀", date: "2026-02-08 수정", evidence: "수질 측정표 · 물가 생물 조사표",
                keywords: ["강", "물", "생물", "환경", "수달", "river"], related: "otter"
            },
            moon: {
                site: "어린이 우주 관측소", domain: "space.local", url: "https://space.local/moon/phases",
                title: "달의 모양은 왜 달라질까?", summary: "달과 지구, 태양의 위치로 달의 모양 변화를 관찰합니다.",
                body: "달이 스스로 모양을 바꾸는 것은 아닙니다. 태양빛을 받은 달의 부분 가운데 지구에서 보이는 부분이 달라집니다.",
                publisher: "어린이 우주 관측소", author: "이별빛 천문 교육팀", date: "2026-01-24 수정", evidence: "한 달 관측 기록 · 달 위치 모형",
                keywords: ["달", "우주", "태양", "관측", "moon", "space"], related: "weather"
            },
            weather: {
                site: "교실 날씨 자료실", domain: "weather.local", url: "https://weather.local/clouds/forecast",
                title: "구름을 보고 날씨 관찰하기", summary: "구름의 양과 모양을 기록하며 날씨 변화를 비교합니다.",
                body: "날씨를 알아볼 때에는 구름뿐 아니라 기온, 바람, 비처럼 여러 관측 자료를 함께 확인합니다.",
                publisher: "교실 기상 관찰단", author: "3학년 공동 관찰", date: "2026-04-03 기록", evidence: "기온·바람·강수 관찰표",
                keywords: ["날씨", "구름", "기온", "비", "관찰", "weather"], related: "moon"
            }
        };
        const makeHome = () => ({ type: "home", title: "교실 검색", url: "https://search.local/" });
        const tabs = [{ id: 1, title: "교실 검색", history: [makeHome()], historyIndex: 0 }];
        let activeTabId = 1;
        let nextTabId = 2;

        const activeTab = () => tabs.find((tab) => tab.id === activeTabId);
        const currentPage = () => {
            const tab = activeTab();
            return tab.history[tab.historyIndex];
        };
        const findResults = (query) => {
            const normalized = query.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ");
            return Object.entries(catalog).filter(([, page]) => page.keywords.some((keyword) => normalized.includes(keyword.toLocaleLowerCase()))).map(([id]) => id);
        };
        const pageRecord = (id) => ({ type: "page", pageId: id, title: catalog[id].title, url: catalog[id].url });
        const pushPage = (page) => {
            const tab = activeTab();
            tab.history = tab.history.slice(0, tab.historyIndex + 1);
            tab.history.push(page);
            tab.historyIndex += 1;
        };
        const renderTabs = () => {
            tabList.replaceChildren();
            tabs.forEach((tab, tabIndex) => {
                const button = document.createElement("button");
                button.type = "button";
                button.setAttribute("role", "tab");
                button.setAttribute("aria-controls", "browser-state-viewport");
                button.setAttribute("aria-selected", String(tab.id === activeTabId));
                button.tabIndex = tab.id === activeTabId ? 0 : -1;
                button.dataset.browserTabId = String(tab.id);
                button.textContent = tab.title;
                button.addEventListener("click", () => {
                    activeTabId = tab.id;
                    renderCurrentPage();
                    status.textContent = `‘${tab.title}’ 탭을 선택했습니다. 이 탭의 주소와 방문 기록이 표시됩니다.`;
                });
                button.addEventListener("keydown", (event) => {
                    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                    event.preventDefault();
                    const direction = event.key === "ArrowRight" ? 1 : -1;
                    const target = tabs[(tabIndex + direction + tabs.length) % tabs.length];
                    activeTabId = target.id;
                    renderCurrentPage();
                    tabList.querySelector(`[data-browser-tab-id="${target.id}"]`)?.focus();
                });
                tabList.append(button);
            });
        };
        const renderResults = (resultPage) => {
            queryOutput.textContent = `‘${resultPage.query}’`;
            resultList.replaceChildren();
            if (!resultPage.resultIds.length) {
                const empty = document.createElement("p");
                empty.className = "browser-empty-results";
                empty.textContent = "이 검색 모형에는 입력한 주제의 자료가 없습니다. 아래 주제를 골라 실제 결과와 출처를 비교하세요.";
                const choices = document.createElement("div");
                choices.className = "browser-empty-actions";
                ["혜성", "수달", "강", "달", "날씨"].forEach((query) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = `${query} 검색`;
                    button.addEventListener("click", () => {
                        searchInput.value = query;
                        runSearch(query);
                    });
                    choices.append(button);
                });
                resultList.append(empty, choices);
                return;
            }
            resultPage.resultIds.forEach((id) => {
                const page = catalog[id];
                const result = document.createElement("article");
                result.className = "browser-search-result";
                result.dataset.resultCard = id;
                const site = document.createElement("span");
                site.dataset.siteRegion = "";
                site.textContent = `${page.site} · ${page.domain}`;
                const link = document.createElement("button");
                link.type = "button";
                link.dataset.linkRegion = "";
                link.textContent = page.title;
                link.addEventListener("click", () => openCatalogPage(id, false));
                const summary = document.createElement("p");
                summary.textContent = page.summary;
                const sourceFacts = document.createElement("div");
                sourceFacts.className = "result-source-facts";
                sourceFacts.innerHTML = "<span><b>작성자</b> " + page.author + "</span><span><b>날짜</b> " + page.date + "</span><span><b>근거</b> " + page.evidence + "</span>";
                const footer = document.createElement("footer");
                const url = document.createElement("code");
                url.textContent = page.url;
                const newTab = document.createElement("button");
                newTab.type = "button";
                newTab.dataset.linkRegion = "";
                newTab.textContent = "새 탭에서 열기";
                newTab.addEventListener("click", () => openCatalogPage(id, true));
                footer.append(url, newTab);
                result.append(site, link, summary, sourceFacts, footer);
                resultList.append(result);
            });
        };
        const renderLocalPage = (page) => {
            const record = catalog[page.pageId];
            pageSite.textContent = record.site;
            pageDomain.textContent = record.domain;
            pageTitle.textContent = record.title;
            pageBody.textContent = record.body;
            pagePublisher.textContent = record.publisher;
            pageAuthor.textContent = record.author;
            pageDate.textContent = record.date;
            pageEvidence.textContent = record.evidence;
            if (record.related && catalog[record.related]) {
                relatedLink.hidden = false;
                relatedLink.textContent = `관련 링크: ${catalog[record.related].title}`;
                relatedLink.onclick = () => openCatalogPage(record.related, false);
            } else {
                relatedLink.hidden = true;
                relatedLink.onclick = null;
            }
        };
        function renderCurrentPage() {
            const tab = activeTab();
            const page = currentPage();
            lab.dataset.browserPage=page.type;
            if(page.type==='page'){
                const visited=new Set((lab.dataset.visitedSources||'').split(',').filter(Boolean));
                visited.add(page.pageId);lab.dataset.visitedSources=[...visited].join(',');
            }
            tab.title = page.title;
            pageViews.forEach((view) => { view.hidden = view.dataset.browserPage !== page.type; });
            urlOutput.textContent = page.url;
            backButton.disabled = tab.historyIndex === 0;
            if (page.type === "results") renderResults(page);
            if (page.type === "page") renderLocalPage(page);
            renderTabs();
        }
        function openCatalogPage(id, inNewTab) {
            const destination = pageRecord(id);
            if (inNewTab) {
                const source = currentPage();
                const newTab = { id: nextTabId, title: destination.title, history: [source, destination], historyIndex: 1 };
                nextTabId += 1;
                tabs.push(newTab);
                activeTabId = newTab.id;
                renderCurrentPage();
                status.textContent = `링크 주소 ${destination.url}을 새 탭에서 열었습니다. 새 탭에도 독립된 주소와 방문 기록이 생겼습니다.`;
                return;
            }
            pushPage(destination);
            renderCurrentPage();
            status.textContent = `링크를 현재 탭에서 열었습니다. 주소창과 함께 운영 기관·작성자·날짜·근거가 실제로 표시되는지 확인하세요.`;
        }
        const highlightTerm = (term) => {
            const page = currentPage();
            lab.dataset.browserHighlight = term;
            termButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.browserTerm === term)));
            const messages = {
                address: `주소: 현재 탭의 주소창은 ${page.url}을 표시합니다. 페이지가 바뀌면 이 URL도 바뀝니다.`,
                tab: `탭: 현재 브라우저에는 ${tabs.length}개의 탭이 열려 있습니다. 각 탭은 자기 주소와 방문 기록을 따로 기억합니다.`,
                search: page.type === "home" || page.type === "results" ? "검색 엔진: 지금 보이는 교실 검색은 검색어와 관련된 웹페이지를 찾아 결과 목록을 만드는 웹 서비스입니다." : "검색 엔진: 지금은 검색 결과에서 연 다른 웹사이트입니다. 뒤로 가면 이 탭의 검색 결과로 돌아갈 수 있습니다.",
                site: page.type === "page" ? `웹사이트: 이 페이지는 ${catalog[page.pageId].site} 사이트에 속하며 주소의 도메인은 ${catalog[page.pageId].domain}입니다.` : "웹사이트: 교실 검색도 search.local이라는 주소를 가진 하나의 웹사이트입니다.",
                page: `웹페이지: 현재 탭에 표시된 ‘${page.title}’ 화면 한 장입니다. 같은 웹사이트에도 주소가 다른 여러 페이지가 있을 수 있습니다.`,
                link: page.type === "results" ? `링크: 현재 결과에 ${page.resultIds.length}개의 페이지 제목 링크가 있습니다. 누르면 연결된 URL의 페이지가 열립니다.` : page.type === "page" ? "링크: 본문 아래의 관련 링크를 누르면 같은 탭에서 주소와 페이지가 바뀝니다." : "링크: 검색을 실행하면 결과 제목이 다른 웹페이지 주소로 연결되는 링크가 됩니다."
            };
            status.textContent = messages[term];
        };

        const runSearch = (rawQuery) => {
            const query = rawQuery.trim();
            if (!query) {
                status.textContent = "검색할 낱말이나 질문을 입력하세요.";
                searchInput.focus();
                return;
            }
            const resultIds = findResults(query);
            pushPage({ type: "results", title: `${query} 검색`, url: `https://search.local/?q=${encodeURIComponent(query)}`, query, resultIds });
            renderCurrentPage();
            status.textContent = resultIds.length
                ? `검색 결과는 관련성 순서일 뿐 믿을 만한 순서가 아닙니다. 결과마다 작성자·날짜·근거를 비교한 뒤 원문을 여세요.`
                : `현재 검색 모형에는 ‘${query}’ 자료가 없습니다. 화면에 표시된 주제 단추를 골라 다시 검색하세요.`;
        };
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            runSearch(searchInput.value);
        });
        suggestionButtons.forEach((button) => button.addEventListener("click", () => {
            const query = button.dataset.browserSuggestion;
            searchInput.value = query;
            runSearch(query);
        }));
        newTabButton.addEventListener("click", () => {
            const page = makeHome();
            const newTab = { id: nextTabId, title: page.title, history: [page], historyIndex: 0 };
            nextTabId += 1;
            tabs.push(newTab);
            activeTabId = newTab.id;
            renderCurrentPage();
            searchInput.focus();
            status.textContent = "빈 검색 페이지가 새 탭에 열렸습니다. 원래 탭의 페이지와 방문 기록은 그대로 남아 있습니다.";
        });
        backButton.addEventListener("click", () => {
            const tab = activeTab();
            if (tab.historyIndex === 0) return;
            tab.historyIndex -= 1;
            renderCurrentPage();
            status.textContent = `이 탭의 이전 페이지 ‘${currentPage().title}’(으)로 돌아왔습니다. 주소창도 이전 URL로 바뀌었습니다.`;
        });
        termButtons.forEach((button) => button.addEventListener("click", () => highlightTerm(button.dataset.browserTerm)));
        renderCurrentPage();
    }

    window.COMPUTER_LAB_SETUPS.push(setupBrowserLab);
    window.COMPUTER_PREMIUM_VISUAL_IDS.push("h03");
})();
