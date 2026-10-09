/* School textbook adoption and source pacing preview. */
window.createTextbookPanel = function ({ api, canEdit }) {
    const root = document.getElementById('textbookPanel');
    let request = 0;
    const el = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text != null) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    async function preview(edition, target) {
        target.replaceChildren();
        if (!edition) return;
        for (const summary of edition.plans) {
            const details = el('details');
            const semesterLabel = summary.semesters.length === 1 ? `${summary.semesters[0]}학기` : summary.semesters.length === 2 ? '1·2학기' : '연간 / 학기 미지정';
            details.append(el('summary', `${semesterLabel} ${summary.format === 'teaching-plan' ? '수업 지도계획' : '단원·차시'} · ${summary.lessonCount}개 학습 항목`));
            const content = el('div', '', 'textbook-plan');
            details.append(content);
            let loaded = false;
            details.addEventListener('toggle', async () => {
                if (!details.open || loaded) return;
                loaded = true;
                content.textContent = '불러오는 중…';
                try {
                    const { plan } = await api(`/api/school-admin/textbooks/plans/${encodeURIComponent(summary.id)}`);
                    const note = el('p', plan.curriculumVerification === 'publisher-textbook-comparison-pending'
                        ? '개정판 대조 중인 자료입니다. 교육과정에 사용하기 전 원본을 확인하세요.'
                        : '출판사 권장 진도입니다. 학교의 학사일정과 편성 시수에 맞춰 조정하세요.');
                    const source = el('a', '출판사 자료실');
                    source.href = plan.sourceUrl; source.target = '_blank'; source.rel = 'noopener';
                    const table = el('table', null, 'data-table');
                    const head = el('tr');
                    for (const label of ['학기', '단원', '학습내용', '차시', '쪽수']) head.append(el('th', label));
                    const thead = el('thead'); thead.append(head); table.append(thead);
                    const body = el('tbody');
                    for (const lesson of plan.lessons) {
                        const row = el('tr');
                        for (const value of [lesson.semester || '연간/미지정', lesson.unit, lesson.topic, lesson.periodText, lesson.pages || '—']) row.append(el('td', value));
                        body.append(row);
                    }
                    table.append(body);
                    content.replaceChildren(note, source, table);
                } catch (error) { content.textContent = error.message; loaded = false; }
            });
            target.append(details);
        }
    }
    return {
        async load(academicYear, grade) {
            if (!root) return;
            const generation = ++request;
            root.replaceChildren(el('p', '교과서 목록을 불러오는 중…'));
            try {
                const data = await api(`/api/school-admin/textbooks?academicYear=${academicYear}&grade=${grade}`);
                if (generation !== request) return;
                const title = el('h3', `${academicYear}학년도 ${grade}학년 교과서`);
                const help = el('p', '과목별 출판사와 대표 저자를 선택하세요. 선택은 이 학교의 해당 학년도·학년에만 저장됩니다.');
                const list = el('div', null, 'textbook-list');
                root.replaceChildren(title, help, list);
                const subjects = grade < 3 ? ['국어', '수학', '통합교과'] : ['국어', '도덕', '수학', '사회', '과학', '영어', '음악', '미술', '체육', ...(grade > 4 ? ['실과'] : [])];
                for (const subject of subjects) {
                    const editions = data.editions.filter(e => e.subject === subject);
                    let saved = data.selections.find(s => s.subject === subject);
                    const row = el('section', null, 'textbook-subject');
                    const label = el('label', subject === '통합교과' ? '통합교과 (바른·슬기로운·즐거운 생활)' : subject);
                    const select = el('select', null, 'form-select');
                    select.setAttribute('aria-label', `${grade}학년 ${subject} 교과서`);
                    select.append(new Option(editions.length ? '교과서 선택' : '교과서 목록 확인 중', ''));
                    for (const edition of editions) select.append(new Option(edition.label, edition.id));
                    select.value = saved?.editionId || '';
                    select.disabled = !data.canEdit || !canEdit() || !editions.length;
                    label.append(select);
                    const save = el('button', '저장', 'primary-button'); save.type = 'button'; save.dataset.curriculumEdit = '';
                    const status = el('p', '', 'textbook-status'); status.setAttribute('role', 'status');
                    const details = el('div', null, 'textbook-preview');
                    function update() {
                        const edition = editions.find(e => e.id === select.value);
                        save.disabled = !canEdit() || !edition || select.value === saved?.editionId;
                        status.textContent = edition
                            ? `${select.value === saved?.editionId ? '저장됨' : '아직 저장하지 않음'} · ${edition.plans.length ? `진도 자료 ${edition.plans.length}개` : edition.pacingStatus === 'pdf-review-pending' ? 'PDF 확보 · 표 변환 검수 중' : '진도 자료 미수집'}`
                            : editions.length ? '선택하지 않음' : '이 과목은 교과서 목록을 보완하고 있습니다.';
                        preview(edition, details);
                    }
                    select.addEventListener('change', update);
                    save.addEventListener('click', async () => {
                        const editionId = select.value;
                        save.disabled = true; select.disabled = true;
                        try {
                            const result = await api('/api/school-admin/textbooks', { method: 'PUT', body: JSON.stringify({ academicYear, grade, subject, editionId, revision: saved?.revision || 0 }) });
                            if (generation !== request) return;
                            saved = result.selection; update();
                        } catch (error) {
                            if (generation !== request) return;
                            status.textContent = error.message;
                            if (error.status === 409) {
                                const reload = el('button', '목록 새로 불러오기'); reload.type = 'button';
                                reload.addEventListener('click', () => this.load(academicYear, grade));
                                status.append(reload);
                            }
                        } finally {
                            select.disabled = !canEdit();
                            save.disabled = !canEdit() || !select.value || select.value === saved?.editionId;
                        }
                    });
                    row.append(label, save, status, details); list.append(row); update();
                }
            } catch (error) { if (generation === request) root.replaceChildren(el('p', error.message)); }
        }
    };
};
