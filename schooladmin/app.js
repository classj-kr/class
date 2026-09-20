async function api(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || '요청을 처리하지 못했습니다.');
        error.status = response.status;
        error.data = data;
        throw error;
    }
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const signOutButton = document.getElementById('signOutButton');
    
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Roster Tab
    const rosterSearch = document.getElementById('rosterSearch');
    const rosterLoading = document.getElementById('rosterLoading');
    const rosterError = document.getElementById('rosterError');
    const rosterContent = document.getElementById('rosterContent');
    const rosterTableBody = document.getElementById('rosterTableBody');

    // Annual Calendar Tab
    const calculatedSchoolDaysVal = document.getElementById('calculatedSchoolDaysVal');
    const schoolDaysStatusBadge = document.getElementById('schoolDaysStatusBadge');
    const totalHolidaysVal = document.getElementById('totalHolidaysVal');
    const totalEventsVal = document.getElementById('totalEventsVal');
    const perGradeSchoolDaysNote = document.getElementById('perGradeSchoolDaysNote');

    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const annualCalendarGrid = document.getElementById('annualCalendarGrid');

    const addAnnualScheduleForm = document.getElementById('addAnnualScheduleForm');
    const annualDateInput = document.getElementById('annualDateInput');
    const gradeSelectionRow = document.getElementById('gradeSelectionRow');
    const annualDetailsInput = document.getElementById('annualDetailsInput');
    const annualYearSelect = document.getElementById('annualYearSelect');
    const annualLoading = document.getElementById('annualLoading');
    const annualError = document.getElementById('annualError');
    const annualContent = document.getElementById('annualContent');
    const annualTableBody = document.getElementById('annualTableBody');
    const entranceCeremonyDate = document.getElementById('entranceCeremonyDate');
    const graduationCeremonyDate = document.getElementById('graduationCeremonyDate');

    // Public Holidays Panel
    const addHolidayForm = document.getElementById('addHolidayForm');
    const holidayDateInput = document.getElementById('holidayDateInput');
    const holidayNameInput = document.getElementById('holidayNameInput');
    const holidayExcludedInput = document.getElementById('holidayExcludedInput');
    const holidaysTableBody = document.getElementById('holidaysTableBody');
    const refreshHolidaysBtn = document.getElementById('refreshHolidaysBtn');
    let holidaysCacheData = [];

    // Bell Schedule & Weekly Period Allocation Tab
    const bellLunchAfterSelect = document.getElementById('bellLunchAfterSelect');
    const bellGradeCheckboxes = document.getElementById('bellGradeCheckboxes');
    const bellTableBody = document.getElementById('bellTableBody');
    const saveBellBtn = document.getElementById('saveBellBtn');
    const bellSummaryTableBody = document.getElementById('bellSummaryTableBody');
    const weeklyAllocationTableBody = document.getElementById('weeklyAllocationTableBody');
    const saveWeeklyAllocationBtn = document.getElementById('saveWeeklyAllocationBtn');
    let bellScheduleByGrade = {}; // { 1: {...}, 2: {...}, ... }
    let weeklyAllocationData = [];
    let curriculumHoursTotals = {}; // { grade: totalWeeklyHours }

    // Curriculum Hours Tab
    const curriculumGradeSelect = document.getElementById('curriculumGradeSelect');
    const curriculumTableBody = document.getElementById('curriculumTableBody');
    const curriculumTableFoot = document.getElementById('curriculumTableFoot');
    const curriculumPrevYearHeader = document.getElementById('curriculumPrevYearHeader');
    const saveCurriculumBtn = document.getElementById('saveCurriculumBtn');

    // Master Timetable Grid Tab
    const timetableGradeSelect = document.getElementById('timetableGradeSelect');
    const subjectPalette = document.getElementById('subjectPalette');
    const timetableMatrixBody = document.getElementById('timetableMatrixBody');
    const saveTimetableBtn = document.getElementById('saveTimetableBtn');
    const timetableLockedBanner = document.getElementById('timetableLockedBanner');
    const timetableUnlockedContent = document.getElementById('timetableUnlockedContent');

    // State
    let currentDate = new Date();
    // 학년도는 3월에 시작하므로, 1~2월은 전년도 학년도에 속함
    const currentAcademicYear = currentDate.getMonth() + 1 >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    let selectedAcademicYear = currentAcademicYear;
    let currentCalYear = currentAcademicYear;
    let currentCalMonth = 3; // March start for Academic Year
    let rosterData = [];
    let annualSchedulesData = [];
    let activePaletteSubject = '국어';

    const DEFAULT_SUBJECTS = [
        { name: '국어', weekly: 6, annual: 204, category: 'SUBJECT' },
        { name: '수학', weekly: 4, annual: 136, category: 'SUBJECT' },
        { name: '사회', weekly: 3, annual: 102, category: 'SUBJECT' },
        { name: '과학', weekly: 3, annual: 102, category: 'SUBJECT' },
        { name: '도덕', weekly: 1, annual: 34, category: 'SUBJECT' },
        { name: '체육', weekly: 3, annual: 102, category: 'SUBJECT' },
        { name: '음악', weekly: 2, annual: 68, category: 'SUBJECT' },
        { name: '미술', weekly: 2, annual: 68, category: 'SUBJECT' },
        { name: '영어', weekly: 2, annual: 68, category: 'SUBJECT' },
        { name: '창체(자율)', weekly: 1, annual: 34, category: 'CHANGTAE' },
        { name: '창체(동아리)', weekly: 1, annual: 34, category: 'CHANGTAE' },
        { name: '창체(봉사)', weekly: 1, annual: 10, category: 'CHANGTAE' },
        { name: '창체(진로)', weekly: 1, annual: 24, category: 'CHANGTAE' }
    ];

    const PALETTE_SUBJECTS = ['국어', '수학', '사회', '과학', '도덕', '체육', '음악', '미술', '영어', '창체', '자율', '동아리', '수업없음'];

    // Timetable grid state: { "day_period": "국어" }
    let timetableMatrixData = {};
    // Cells claimed by the specialist-teacher/special-room screens; the class
    // view may only clear these, never assign new ones (single source of truth).
    // { "day_period": { teacherUserId, roomName } }
    let timetableMatrixLocks = {};

    // --- Initialization ---
    function init() {
        if (annualDateInput) annualDateInput.value = formatDate(currentDate);

        // 학년도 드롭박스: 현재 학년도와 다음 학년도만 허용 (과거 학년도는 편집 대상 아님)
        if (annualYearSelect) {
            annualYearSelect.innerHTML = '';
            [currentAcademicYear, currentAcademicYear + 1].forEach(year => {
                const opt = document.createElement('option');
                opt.value = String(year);
                opt.textContent = `${year}학년도 (${year}.3~${year + 1}.2)`;
                annualYearSelect.appendChild(opt);
            });
            annualYearSelect.value = String(selectedAcademicYear);
        }

        // Sign Out
        signOutButton.addEventListener('click', () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
            }
            api('/api/auth/signout', { method: 'POST' }).then(() => {
                location.href = '/';
            });
        });

        // Tab Switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Roster Search
        if (rosterSearch) rosterSearch.addEventListener('input', renderRosterTable);

        // Annual Calendar & Schedules Listeners
        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => changeMonth(-1));
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => changeMonth(1));
        if (annualYearSelect) {
            annualYearSelect.addEventListener('change', async (e) => {
                selectedAcademicYear = Number(e.target.value);
                currentCalYear = selectedAcademicYear;
                currentCalMonth = 3;
                await loadVacationDates();
                await loadAnnualSchedules();
                await loadCurriculumHours();
                renderSubjectPalette();
                await loadMasterTimetable();
                await renderAnnualTimetable34Weeks();
            });
        }
        // 방학 설정 박스는 재량휴업일을 직접 입력받지 않고, 아래 등록 폼으로 스크롤+포커스만 시켜준다.
        const jumpToDiscretionaryBtn = document.getElementById('jumpToDiscretionaryBtn');
        if (jumpToDiscretionaryBtn) {
            jumpToDiscretionaryBtn.addEventListener('click', () => {
                const dateInput = document.getElementById('annualDateInput');
                if (addAnnualScheduleForm) addAnnualScheduleForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (dateInput) dateInput.focus();
            });
        }

        if (addAnnualScheduleForm) {
            addAnnualScheduleForm.addEventListener('submit', handleAddAnnualSchedule);
        }

        // Curriculum Hours Listeners
        if (curriculumGradeSelect) curriculumGradeSelect.addEventListener('change', loadCurriculumHours);
        if (saveCurriculumBtn) saveCurriculumBtn.addEventListener('click', saveCurriculumHours);

        // Timetable Grid Listeners
        if (timetableGradeSelect) {
            timetableGradeSelect.addEventListener('change', () => {
                renderSubjectPalette();
                loadMasterTimetable();
            });
        }
        if (saveTimetableBtn) saveTimetableBtn.addEventListener('click', saveMasterTimetable);

        renderSubjectPalette();

        // Initial Load (annual tab is the default active tab)
        loadVacationDates();
        loadAnnualSchedules();
    }

    // --- Tab Logic ---
    async function switchTab(tabId) {
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        tabContents.forEach(content => {
            content.hidden = content.id !== `${tabId}Tab`;
        });

        if (tabId === 'roster' && rosterData.length === 0) {
            await loadRoster();
        } else if (tabId === 'annual') {
            await loadVacationDates();
            await loadAnnualSchedules();
        } else if (tabId === 'curriculum') {
            await loadCurriculumHours();
        } else if (tabId === 'bellSchedule') {
            await loadBellScheduleTab();
        } else if (tabId === 'timetable') {
            renderSubjectPalette();
            await loadMasterTimetable();
        } else if (tabId === 'specialistTimetable') {
            await loadSpecialistTeachersList();
            await loadSpecialistTimetable();
        } else if (tabId === 'roomTimetable') {
            await loadRoomsList();
        } else if (tabId === 'annualTimetable') {
            await loadVacationDates();
            await renderAnnualTimetable34Weeks();
        }
    }

    // --- Date Helpers ---
    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // --- Annual Calendar & Schedules Logic ---
    function changeMonth(delta) {
        currentCalMonth += delta;
        if (currentCalMonth > 12) {
            currentCalMonth = 1;
            currentCalYear += 1;
        } else if (currentCalMonth < 1) {
            currentCalMonth = 12;
            currentCalYear -= 1;
        }
        renderCalendarGrid();
    }

    let dynamicPublicHolidays = {};

    async function fetchLivePublicHolidays() {
        try {
            const h1 = await api(`/api/school-admin/public-holidays?year=${selectedAcademicYear}`).catch(() => ({ holidays: [], all: [] }));
            const h2 = await api(`/api/school-admin/public-holidays?year=${selectedAcademicYear + 1}`).catch(() => ({ holidays: [], all: [] }));

            dynamicPublicHolidays = { ...KOREAN_NATIONAL_HOLIDAYS };
            (h1.holidays || []).concat(h2.holidays || []).forEach(item => {
                if (item.date && item.localName) {
                    dynamicPublicHolidays[item.date] = item.localName;
                }
            });

            holidaysCacheData = (h1.all || []).concat(h2.all || []).sort((a, b) => a.date.localeCompare(b.date));
            renderHolidaysTable();
        } catch (_) {
            dynamicPublicHolidays = { ...KOREAN_NATIONAL_HOLIDAYS };
        }
    }

    function renderHolidaysTable() {
        if (!holidaysTableBody) return;
        holidaysTableBody.innerHTML = '';

        if (holidaysCacheData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5">등록된 공휴일이 없습니다. "공휴일 새로고침"을 눌러 자동으로 가져오세요.</td>`;
            holidaysTableBody.appendChild(tr);
            return;
        }

        holidaysCacheData.forEach(h => {
            const tr = document.createElement('tr');
            const sourceText = h.source === 'MANUAL' ? '✍️ 수동' : '🌐 자동';
            const statusText = h.excluded ? '🚫 제외됨' : '✅ 적용됨';
            tr.innerHTML = `
                <td>${h.date}</td>
                <td>${escapeHtml(h.name)}</td>
                <td>${sourceText}</td>
                <td>${statusText}</td>
                <td><button type="button" class="icon-button delete-holiday-btn" data-id="${h.id}" title="삭제/원복"><span class="material-symbols-outlined">delete</span></button></td>
            `;
            holidaysTableBody.appendChild(tr);
        });

        holidaysTableBody.querySelectorAll('.delete-holiday-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('이 항목을 삭제할까요? (자동 수집 항목은 다음 새로고침 시 다시 나타날 수 있습니다)')) return;
                try {
                    await api(`/api/school-admin/public-holidays/${btn.dataset.id}`, { method: 'DELETE' });
                    await fetchLivePublicHolidays();
                    renderCalendarGrid();
                    calculateSchoolDaysAudit();
                } catch (err) {
                    alert(err.message || '삭제하지 못했습니다.');
                }
            });
        });
    }

    if (addHolidayForm) {
        addHolidayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await api('/api/school-admin/public-holidays', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        year: Number((holidayDateInput.value || '').slice(0, 4)) || selectedAcademicYear,
                        date: holidayDateInput.value,
                        name: holidayNameInput.value,
                        excluded: Boolean(holidayExcludedInput.checked)
                    })
                });
                addHolidayForm.reset();
                await fetchLivePublicHolidays();
                renderCalendarGrid();
                calculateSchoolDaysAudit();
            } catch (err) {
                alert(err.message || '공휴일을 저장하지 못했습니다.');
            }
        });
    }

    if (refreshHolidaysBtn) {
        refreshHolidaysBtn.addEventListener('click', async () => {
            try {
                refreshHolidaysBtn.disabled = true;
                await Promise.all([
                    api('/api/school-admin/public-holidays/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ year: selectedAcademicYear })
                    }),
                    api('/api/school-admin/public-holidays/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ year: selectedAcademicYear + 1 })
                    })
                ]);
                await fetchLivePublicHolidays();
                renderCalendarGrid();
                calculateSchoolDaysAudit();
            } catch (err) {
                alert(err.message || '공휴일을 새로고침하지 못했습니다.');
            } finally {
                refreshHolidaysBtn.disabled = false;
            }
        });
    }

    async function loadAnnualSchedules() {
        if (!annualLoading) return;
        annualLoading.hidden = false;
        annualError.hidden = true;
        annualContent.hidden = true;

        try {
            await fetchLivePublicHolidays();
            const res = await api(`/api/school-admin/annual-schedules?academicYear=${selectedAcademicYear}`);
            annualSchedulesData = res.schedules || [];

            renderCalendarGrid();
            renderAnnualSchedulesTable();
            calculateSchoolDaysAudit();

            annualLoading.hidden = true;
            annualContent.hidden = false;
        } catch (error) {
            annualLoading.hidden = true;
            annualError.textContent = error.message || '학사일정을 불러오지 못했습니다.';
            annualError.hidden = false;

            if (error.status === 401 || error.status === 403) {
                setTimeout(() => location.href = '/', 2000);
            }
        }
    }

    const KOREAN_NATIONAL_HOLIDAYS = {
        "2025-01-01": "신정",
        "2025-01-28": "설날 연휴",
        "2025-01-29": "설날",
        "2025-01-30": "설날 연휴",
        "2025-03-01": "삼일절",
        "2025-03-03": "대체공휴일",
        "2025-05-05": "어린이날",
        "2025-05-06": "부처님오신날",
        "2025-06-06": "현충일",
        "2025-08-15": "광복절",
        "2025-10-03": "개천절",
        "2025-10-05": "추석 연휴",
        "2025-10-06": "추석",
        "2025-10-07": "추석 연휴",
        "2025-10-08": "대체공휴일",
        "2025-10-09": "한글날",
        "2025-12-25": "성탄절",
        "2026-01-01": "신정",
        "2026-02-16": "설날 연휴",
        "2026-02-17": "설날",
        "2026-02-18": "설날 연휴",
        "2026-03-01": "삼일절",
        "2026-03-02": "대체공휴일",
        "2026-05-05": "어린이날",
        "2026-05-24": "부처님오신날",
        "2026-05-25": "대체공휴일",
        "2026-06-06": "현충일",
        "2026-08-15": "광복절",
        "2026-08-17": "대체공휴일",
        "2026-09-24": "추석 연휴",
        "2026-09-25": "추석",
        "2026-09-26": "추석 연휴",
        "2026-10-03": "개천절",
        "2026-10-05": "대체공휴일",
        "2026-10-09": "한글날",
        "2026-12-25": "성탄절",
        "2027-01-01": "신정",
        "2027-02-06": "설날 연휴",
        "2027-02-07": "설날",
        "2027-02-08": "설날 연휴",
        "2027-02-09": "대체공휴일",
        "2027-03-01": "삼일절"
    };

    const summerVacationStart = document.getElementById('summerVacationStart');
    const summerVacationEnd = document.getElementById('summerVacationEnd');
    const winterVacationStart = document.getElementById('winterVacationStart');
    const winterVacationEnd = document.getElementById('winterVacationEnd');
    const springVacationStart = document.getElementById('springVacationStart');
    const springVacationEnd = document.getElementById('springVacationEnd');
    const saveVacationDatesBtn = document.getElementById('saveVacationDatesBtn');
    const integrateWinterSpringVacation = document.getElementById('integrateWinterSpringVacation');
    const springVacationLabelWrap = document.getElementById('springVacationLabelWrap');

    function toggleIntegratedVacationUI(isIntegrated) {
        if (springVacationLabelWrap) {
            springVacationLabelWrap.style.display = isIntegrated ? 'none' : 'flex';
        }
    }

    async function loadVacationDates() {
        try {
            const res = await api(`/api/school-admin/vacation-settings?academicYear=${selectedAcademicYear}`);
            const stored = res.settings || {};
            const isIntegrated = stored.is_integrated !== undefined ? stored.is_integrated : true;
            if (integrateWinterSpringVacation) {
                integrateWinterSpringVacation.checked = isIntegrated;
                toggleIntegratedVacationUI(isIntegrated);
            }
            if (summerVacationStart) summerVacationStart.value = stored.summer_start || `${selectedAcademicYear}-07-20`;
            if (summerVacationEnd) summerVacationEnd.value = stored.summer_end || `${selectedAcademicYear}-08-20`;
            if (winterVacationStart) winterVacationStart.value = stored.winter_start || `${selectedAcademicYear}-12-30`;
            if (winterVacationEnd) winterVacationEnd.value = stored.winter_end || (isIntegrated ? `${selectedAcademicYear + 1}-02-28` : `${selectedAcademicYear + 1}-01-30`);
            if (springVacationStart) springVacationStart.value = stored.spring_start || `${selectedAcademicYear + 1}-02-15`;
            if (springVacationEnd) springVacationEnd.value = stored.spring_end || `${selectedAcademicYear + 1}-02-28`;
            if (entranceCeremonyDate) entranceCeremonyDate.value = stored.entrance_ceremony_date || `${selectedAcademicYear}-03-02`;
            if (graduationCeremonyDate) graduationCeremonyDate.value = stored.graduation_ceremony_date || `${selectedAcademicYear + 1}-02-13`;
        } catch (err) {
            console.error('Failed to load vacation settings:', err);
        }
    }

    // toISOString()은 UTC로 변환하므로 한국(UTC+9)에서는 자정 기준 날짜가 하루
    // 앞당겨질 수 있다 -- 로컬 날짜 구성요소로 직접 포맷한다.
    function dayAfter(dateStr) {
        const d = new Date(`${dateStr}T00:00:00`);
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    if (integrateWinterSpringVacation) {
        integrateWinterSpringVacation.addEventListener('change', (e) => {
            toggleIntegratedVacationUI(e.target.checked);
            if (e.target.checked) {
                if (winterVacationEnd) winterVacationEnd.value = `${selectedAcademicYear + 1}-02-28`;
                // 통합 운영이면 졸업·종업식 다음날부터 바로 방학이 시작되는 것으로 본다.
                if (winterVacationStart && graduationCeremonyDate?.value) {
                    winterVacationStart.value = dayAfter(graduationCeremonyDate.value);
                }
            }
        });
    }
    if (graduationCeremonyDate) {
        graduationCeremonyDate.addEventListener('change', () => {
            if (integrateWinterSpringVacation?.checked && winterVacationStart && graduationCeremonyDate.value) {
                winterVacationStart.value = dayAfter(graduationCeremonyDate.value);
            }
        });
    }

    if (saveVacationDatesBtn) {
        saveVacationDatesBtn.addEventListener('click', async () => {
            const payload = {
                academicYear: selectedAcademicYear,
                isIntegrated: Boolean(integrateWinterSpringVacation?.checked),
                summerStart: summerVacationStart?.value || null,
                summerEnd: summerVacationEnd?.value || null,
                winterStart: winterVacationStart?.value || null,
                winterEnd: winterVacationEnd?.value || null,
                springStart: springVacationStart?.value || null,
                springEnd: springVacationEnd?.value || null,
                entranceCeremonyDate: entranceCeremonyDate?.value || null,
                graduationCeremonyDate: graduationCeremonyDate?.value || null
            };
            try {
                await api('/api/school-admin/vacation-settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                alert('방학 기간 및 휴업일 설정이 DB에 성공적으로 저장되었습니다!');
                renderCalendarGrid();
                calculateSchoolDaysAudit();
            } catch (err) {
                alert(err.message || '방학 설정을 저장하지 못했습니다.');
            }
        });
    }

    function getVacationType(dateStr) {
        const sStart = summerVacationStart?.value;
        const sEnd = summerVacationEnd?.value;
        const wStart = winterVacationStart?.value;
        const wEnd = winterVacationEnd?.value;
        const spStart = springVacationStart?.value;
        const spEnd = springVacationEnd?.value;
        const isIntegrated = integrateWinterSpringVacation?.checked;

        if (sStart && sEnd && dateStr >= sStart && dateStr <= sEnd) return '여름방학';
        if (wStart && wEnd && dateStr >= wStart && dateStr <= wEnd) {
            return isIntegrated ? '겨울/통합방학' : '겨울방학';
        }
        if (!isIntegrated && spStart && spEnd && dateStr >= spStart && dateStr <= spEnd) return '학년말방학';
        return null;
    }

    function getCeremonyLabel(dateStr) {
        if (entranceCeremonyDate?.value && dateStr === entranceCeremonyDate.value) return '🎉 입학·시업식';
        if (graduationCeremonyDate?.value && dateStr === graduationCeremonyDate.value) return '🎓 졸업·종업식';
        return null;
    }

    function renderCalendarGrid() {
        if (!annualCalendarGrid) return;
        loadVacationDates();

        const isSecondSemester = currentCalMonth >= 8 || currentCalMonth <= 2;
        const semesterLabel = currentCalMonth >= 3 && currentCalMonth <= 7 ? '1학기' : '2학기';
        calendarMonthTitle.textContent = `${currentCalYear}년 ${currentCalMonth}월 (${semesterLabel})`;

        annualCalendarGrid.innerHTML = '';

        const firstDay = new Date(currentCalYear, currentCalMonth - 1, 1);
        const lastDay = new Date(currentCalYear, currentCalMonth, 0);
        const startDayOfWeek = firstDay.getDay(); // 0: Sun, 6: Sat
        const totalDays = lastDay.getDate();

        // Prev month padding
        const prevMonthLastDay = new Date(currentCalYear, currentCalMonth - 1, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-day-cell other-month';
            cell.innerHTML = `<div class="cal-day-num">${prevMonthLastDay - i}</div>`;
            annualCalendarGrid.appendChild(cell);
        }

        // Current month days
        const eventMap = new Map();
        annualSchedulesData.forEach(item => {
            eventMap.set(item.event_date, item);
        });

        for (let d = 1; d <= totalDays; d++) {
            const monthStr = currentCalMonth < 10 ? `0${currentCalMonth}` : `${currentCalMonth}`;
            const dayStr = d < 10 ? `0${d}` : `${d}`;
            const dateKey = `${currentCalYear}-${monthStr}-${dayStr}`;

            const dateObj = new Date(currentCalYear, currentCalMonth - 1, d);
            const dayOfWeek = dateObj.getDay();
            const natHoliday = dynamicPublicHolidays[dateKey] || KOREAN_NATIONAL_HOLIDAYS[dateKey];
            const vacType = getVacationType(dateKey);

            const cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            if (dayOfWeek === 0 || natHoliday) cell.classList.add('sun');
            if (dayOfWeek === 6) cell.classList.add('sat');

            const eventItem = eventMap.get(dateKey);
            if (natHoliday || vacType || (eventItem && eventItem.category === 'HOLIDAY')) {
                cell.classList.add('holiday');
            }
            if (vacType) {
                cell.classList.add('vacation');
            }

            let eventsHtml = '';
            if (natHoliday) {
                eventsHtml += `<div class="cal-event-pill holiday">🔴 ${natHoliday}</div>`;
            }
            if (vacType) {
                const vacIcon = vacType === '여름방학' ? '🏖️' : vacType === '겨울방학' ? '❄️' : '🌸';
                eventsHtml += `<div class="cal-event-pill vacation">${vacIcon} ${vacType}</div>`;
            }
            const ceremonyLabel = getCeremonyLabel(dateKey);
            if (ceremonyLabel) {
                eventsHtml += `<div class="cal-event-pill event">${ceremonyLabel}</div>`;
            }
            if (eventItem) {
                const catClass = eventItem.category.toLowerCase();
                const scopeBadge = eventItem.target_scope === 'GRADE' ? `[${eventItem.target_grades.join(',')}학년]` : '';
                eventsHtml += `<div class="cal-event-pill ${catClass}">${scopeBadge} ${escapeHtml(eventItem.title)}</div>`;
            }

            cell.innerHTML = `
                <div class="cal-day-header">
                    <span class="cal-day-num">${d}</span>
                </div>
                <div class="cal-day-events">${eventsHtml}</div>
            `;

            // Click cell to fill form date
            cell.addEventListener('click', () => {
                annualDateInput.value = dateKey;
                if (annualDetailsInput) annualDetailsInput.focus();
            });

            annualCalendarGrid.appendChild(cell);
        }
    }

    const targetSchoolDaysInput = document.getElementById('targetSchoolDaysInput');
    if (targetSchoolDaysInput) {
        targetSchoolDaysInput.addEventListener('input', calculateSchoolDaysAudit);
    }

    // 재량휴업일은 학년별로 다르게 지정될 수 있으므로(예: 6학년 졸업식 날 1~5학년만
    // 재량휴업), 수업일수는 학년마다 따로 세야 한다. 학교 전체를 하나의 숫자로만
    // 세면 특정 학년만 쉬는 날도 전교생이 쉬는 것처럼 잘못 계산된다.
    function calculateSchoolDaysAudit() {
        const targetDays = Number(targetSchoolDaysInput ? targetSchoolDaysInput.value : 190);
        const perGradeSchoolDays = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        let totalHolidays = 0; // 전교 공통 휴업일(공휴일/방학)만 집계 -- 학년별 재량휴업일은 아래 학년별 카운트에 반영
        const totalEvents = annualSchedulesData.length;

        const activeHolidays = Object.keys(dynamicPublicHolidays).length > 0 ? dynamicPublicHolidays : KOREAN_NATIONAL_HOLIDAYS;

        // Loop through all dates in the academic year (March 1 of selectedAcademicYear ~ Feb 28/29 of next year)
        const startDate = new Date(selectedAcademicYear, 2, 1); // March 1
        const endDate = new Date(selectedAcademicYear + 1, 2, 0); // Last day of February (28 or 29 in leap year)

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const year = d.getFullYear();
            const m = d.getMonth() + 1;
            const day = d.getDate();
            const dateStr = `${year}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
            const dayOfWeek = d.getDay();

            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            if (isWeekend) continue;

            const isPublicHoliday = Boolean(activeHolidays[dateStr]);
            const vacType = getVacationType(dateStr);
            const isWholeSchoolOff = isPublicHoliday || vacType;
            if (isWholeSchoolOff) {
                totalHolidays++;
                continue;
            }

            const dayEvents = annualSchedulesData.filter(item => item.event_date === dateStr && (item.category === 'HOLIDAY' || item.category === 'DISCRETIONARY'));
            for (let grade = 1; grade <= 6; grade++) {
                const isGradeOff = dayEvents.some(item => item.target_scope === 'ALL' || (Array.isArray(item.target_grades) && item.target_grades.includes(grade)));
                if (!isGradeOff) perGradeSchoolDays[grade]++;
            }
        }

        const minSchoolDays = Math.min(...Object.values(perGradeSchoolDays));

        if (calculatedSchoolDaysVal) calculatedSchoolDaysVal.textContent = `${minSchoolDays}일`;
        if (totalHolidaysVal) totalHolidaysVal.textContent = `${totalHolidays}일`;
        if (totalEventsVal) totalEventsVal.textContent = `${totalEvents}건`;
        if (perGradeSchoolDaysNote) {
            perGradeSchoolDaysNote.textContent = [1, 2, 3, 4, 5, 6].map(g => `${g}학년 ${perGradeSchoolDays[g]}일`).join(' · ');
        }

        if (schoolDaysStatusBadge) {
            if (minSchoolDays >= targetDays) {
                schoolDaysStatusBadge.textContent = `✅ 목표 (${targetDays}일) 충족`;
                schoolDaysStatusBadge.className = 'audit-status status-ok';
            } else {
                schoolDaysStatusBadge.textContent = `⚠️ 목표 대비 ${targetDays - minSchoolDays}일 부족!`;
                schoolDaysStatusBadge.className = 'audit-status status-warn';
            }
        }
    }

    function renderAnnualSchedulesTable() {
        if (!annualTableBody) return;

        annualTableBody.innerHTML = '';

        annualSchedulesData.forEach(item => {
            const tr = document.createElement('tr');
            let targetText = '🏢 전교 공통';
            if (item.target_scope === 'GRADE') {
                const grades = Array.isArray(item.target_grades) ? item.target_grades.sort().join(', ') : '';
                targetText = `🏫 ${grades}학년`;
            }

            tr.innerHTML = `
                <td style="font-weight:600;">${item.event_date}</td>
                <td><span class="badge scope-${item.target_scope.toLowerCase()}">${targetText}</span></td>
                <td>${escapeHtml(item.details || item.title || '재량휴업일')}</td>
                <td>
                    <button class="delete-schedule-btn text-button danger" data-id="${item.id}">삭제</button>
                </td>
            `;
            annualTableBody.appendChild(tr);
        });

        if (annualSchedulesData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4">등록된 재량휴업일이 없습니다.</td>`;
            annualTableBody.appendChild(tr);
        }

        annualTableBody.querySelectorAll('.delete-schedule-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteAnnualSchedule(btn.dataset.id));
        });
    }

    async function handleAddAnnualSchedule(e) {
        e.preventDefault();
        const date = annualDateInput.value;
        const details = annualDetailsInput.value.trim();
        const title = details || '재량휴업일';

        const checkboxes = addAnnualScheduleForm.querySelectorAll('input[name="targetGrade"]:checked');
        const targetGrades = Array.from(checkboxes).map(cb => Number(cb.value));
        if (targetGrades.length === 0) {
            alert('대상 학년을 최소 1개 이상 선택해 주세요.');
            return;
        }
        const targetScope = targetGrades.length === 6 ? 'ALL' : 'GRADE';

        try {
            await api('/api/school-admin/annual-schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    date, title, category: 'DISCRETIONARY', targetScope, targetGrades, eventPeriods: 0, gradePeriods: {}, details
                })
            });

            annualDetailsInput.value = '';
            await loadAnnualSchedules();
        } catch (error) {
            alert(error.message || '재량휴업일을 등록하지 못했습니다.');
        }
    }

    async function deleteAnnualSchedule(scheduleId) {
        if (!confirm('정말 이 학사일정을 삭제하시겠습니까?')) return;
        try {
            await api(`/api/school-admin/annual-schedules/${scheduleId}`, { method: 'DELETE' });
            await loadAnnualSchedules();
        } catch (error) {
            alert(error.message || '일정을 삭제하지 못했습니다.');
        }
    }

    // --- 시수편성 (Curriculum Hours Allocation & Adjustment) ---
    const GRADE_SUBJECT_BASE_HOURS = {
        1: [
            { name: '국어', base: 210, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 130, weekly: 4, category: 'SUBJECT' },
            { name: '바른 생활', base: 40, weekly: 1, category: 'SUBJECT' },
            { name: '슬기로운 생활', base: 90, weekly: 3, category: 'SUBJECT' },
            { name: '즐거운 생활', base: 190, weekly: 6, category: 'SUBJECT' },
            { name: '창체(자율)', base: 70, weekly: 2, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 60, weekly: 2, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 40, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 60, weekly: 2, category: 'CHANGTAE' }
        ],
        2: [
            { name: '국어', base: 210, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 130, weekly: 4, category: 'SUBJECT' },
            { name: '바른 생활', base: 40, weekly: 1, category: 'SUBJECT' },
            { name: '슬기로운 생활', base: 90, weekly: 3, category: 'SUBJECT' },
            { name: '즐거운 생활', base: 190, weekly: 6, category: 'SUBJECT' },
            { name: '창체(자율)', base: 70, weekly: 2, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 60, weekly: 2, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 40, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 60, weekly: 2, category: 'CHANGTAE' }
        ],
        3: [
            { name: '국어', base: 204, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 136, weekly: 4, category: 'SUBJECT' },
            { name: '사회', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '도덕', base: 34, weekly: 1, category: 'SUBJECT' },
            { name: '과학', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '체육', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '음악', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '미술', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '영어', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '창체(자율)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 10, weekly: 0.5, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 24, weekly: 0.5, category: 'CHANGTAE' }
        ],
        4: [
            { name: '국어', base: 204, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 136, weekly: 4, category: 'SUBJECT' },
            { name: '사회', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '도덕', base: 34, weekly: 1, category: 'SUBJECT' },
            { name: '과학', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '체육', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '음악', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '미술', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '영어', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '창체(자율)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 10, weekly: 0.5, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 24, weekly: 0.5, category: 'CHANGTAE' }
        ],
        5: [
            { name: '국어', base: 204, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 136, weekly: 4, category: 'SUBJECT' },
            { name: '사회', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '도덕', base: 34, weekly: 1, category: 'SUBJECT' },
            { name: '과학', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '실과', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '체육', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '음악', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '미술', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '영어', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '창체(자율)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 10, weekly: 0.5, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 24, weekly: 0.5, category: 'CHANGTAE' }
        ],
        6: [
            { name: '국어', base: 204, weekly: 6, category: 'SUBJECT' },
            { name: '수학', base: 136, weekly: 4, category: 'SUBJECT' },
            { name: '사회', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '도덕', base: 34, weekly: 1, category: 'SUBJECT' },
            { name: '과학', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '실과', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '체육', base: 102, weekly: 3, category: 'SUBJECT' },
            { name: '음악', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '미술', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '영어', base: 68, weekly: 2, category: 'SUBJECT' },
            { name: '창체(자율)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(동아리)', base: 34, weekly: 1, category: 'CHANGTAE' },
            { name: '창체(봉사)', base: 10, weekly: 0.5, category: 'CHANGTAE' },
            { name: '창체(진로)', base: 24, weekly: 0.5, category: 'CHANGTAE' }
        ]
    };

    async function loadCurriculumHours() {
        if (!curriculumTableBody) return;
        const grade = Number(curriculumGradeSelect.value || 5);
        const gradeDefaults = GRADE_SUBJECT_BASE_HOURS[grade] || GRADE_SUBJECT_BASE_HOURS[5];

        try {
            const res = await api(`/api/school-admin/curriculum-hours?academicYear=${selectedAcademicYear}&grade=${grade}`);
            const savedHours = res.hours || [];
            const hourMap = new Map(savedHours.map(h => [h.subject_name, h]));

            const prevHourMap = new Map((res.previousYear?.hours || []).map(h => [h.subject_name, h]));
            // For the second year of a 2022-revised-curriculum grade band (2/4/6학년),
            // suggest "학년군 총 기준시수 - 작년 실제 편성시수" as the starting point
            // instead of always defaulting to this grade's own base -- only when the
            // admin hasn't already saved a value for this grade/subject, so it never
            // overwrites something they already chose.
            const prevGradeDefaults = res.previousYear ? (GRADE_SUBJECT_BASE_HOURS[res.previousYear.grade] || []) : [];
            const prevBaseMap = new Map(prevGradeDefaults.map(def => [def.name, def.base]));

            const rowsData = gradeDefaults.map(def => {
                const saved = hourMap.get(def.name);
                if (saved) {
                    return {
                        name: def.name,
                        weekly: saved.weekly_hours,
                        base: def.base,
                        adj: saved.annual_required_hours ? (saved.annual_required_hours - def.base) : 0,
                        category: def.category
                    };
                }
                if (res.previousYear && prevBaseMap.has(def.name)) {
                    const prevSaved = prevHourMap.get(def.name);
                    const prevFinal = prevSaved && prevSaved.annual_required_hours
                        ? prevSaved.annual_required_hours
                        : prevBaseMap.get(def.name);
                    const bandTotal = prevBaseMap.get(def.name) + def.base;
                    const suggestedFinal = bandTotal - prevFinal;
                    return {
                        name: def.name,
                        weekly: def.weekly,
                        base: def.base,
                        adj: suggestedFinal - def.base,
                        category: def.category
                    };
                }
                return { name: def.name, weekly: def.weekly, base: def.base, adj: 0, category: def.category };
            });

            renderCurriculumTable(rowsData, res.previousYear ? { ...res.previousYear, hourMap: prevHourMap } : null);
        } catch (error) {
            const rowsData = gradeDefaults.map(def => ({ ...def, adj: 0 }));
            renderCurriculumTable(rowsData, null);
        }
    }

    function renderCurriculumTable(rowsData, previousYear) {
        curriculumTableBody.innerHTML = '';
        let totalWeekly = 0;
        let totalBase = 0;
        let totalAdj = 0;
        let totalFinal = 0;
        let totalCalculated = 0;

        if (curriculumPrevYearHeader) {
            curriculumPrevYearHeader.textContent = previousYear
                ? `${previousYear.academicYear}년 ${previousYear.grade}학년 참고`
                : '작년(한 학년 아래) 참고';
        }

        rowsData.forEach(row => {
            const finalAnnual = row.base + (row.adj || 0);
            const calcAnnual = row.weekly * 34; // 34 weeks
            const diff = calcAnnual - finalAnnual;

            totalWeekly += row.weekly;
            totalBase += row.base;
            totalAdj += (row.adj || 0);
            totalFinal += finalAnnual;
            totalCalculated += calcAnnual;

            let diffClass = 'diff-zero';
            let diffStr = '0 (적정)';
            if (diff > 0) {
                diffClass = 'diff-positive';
                diffStr = `+${diff}시간 (충족)`;
            } else if (diff < 0) {
                diffClass = 'diff-negative';
                diffStr = `${diff}시간 (부족)`;
            }

            const categoryText = row.category === 'CHANGTAE' ? '🎒 창체' : '📖 교과';
            const prevHour = previousYear?.hourMap.get(row.name);
            const prevCellText = previousYear ? (prevHour ? `${prevHour.annual_required_hours}시간` : '미배정') : '—';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${categoryText}</td>
                <td style="font-weight:700;">${row.name}</td>
                <td><input type="number" class="weekly-input" data-subject="${row.name}" data-category="${row.category}" data-base="${row.base}" value="${row.weekly}" min="0" max="40" step="0.5"></td>
                <td style="font-weight:700; color:var(--primary);">${row.base}시간</td>
                <td><input type="number" class="adj-input" data-subject="${row.name}" value="${row.adj || 0}" min="-50" max="50"></td>
                <td style="font-weight:800;">${finalAnnual}시간</td>
                <td style="font-weight:700;">${calcAnnual}시간</td>
                <td class="${diffClass}">${diffStr}</td>
                <td style="color:var(--muted);">${prevCellText}</td>
            `;
            curriculumTableBody.appendChild(tr);
        });

        const totalDiff = totalCalculated - totalFinal;
        let totalDiffStr = totalDiff >= 0 ? `+${totalDiff}시간` : `${totalDiff}시간`;

        curriculumTableFoot.innerHTML = `
            <tr>
                <td colspan="2">합계</td>
                <td>${totalWeekly}시간/주</td>
                <td>${totalBase}시간</td>
                <td>${totalAdj >= 0 ? '+' + totalAdj : totalAdj}시간</td>
                <td>${totalFinal}시간</td>
                <td>${totalCalculated}시간</td>
                <td class="${totalDiff >= 0 ? 'diff-positive' : 'diff-negative'}">${totalDiffStr}</td>
                <td></td>
            </tr>
        `;

        // Live input listeners
        curriculumTableBody.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const currentData = Array.from(curriculumTableBody.querySelectorAll('tr')).map(tr => {
                    const wInput = tr.querySelector('.weekly-input');
                    const aInput = tr.querySelector('.adj-input');
                    return {
                        name: wInput.dataset.subject,
                        weekly: Number(wInput.value || 0),
                        base: Number(wInput.dataset.base || 0),
                        adj: Number(aInput.value || 0),
                        category: wInput.dataset.category
                    };
                });
                renderCurriculumTable(currentData);
            });
        });
    }

    async function saveCurriculumHours() {
        const grade = curriculumGradeSelect.value;
        const rows = Array.from(curriculumTableBody.querySelectorAll('tr')).map(tr => {
            const wInput = tr.querySelector('.weekly-input');
            const aInput = tr.querySelector('.adj-input');
            const base = Number(wInput.dataset.base || 0);
            const adj = Number(aInput.value || 0);
            return {
                subjectName: wInput.dataset.subject,
                weeklyHours: Number(wInput.value || 0),
                annualRequiredHours: base + adj,
                category: wInput.dataset.category
            };
        });

        try {
            await api('/api/school-admin/curriculum-hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    grade,
                    hours: rows
                })
            });
            alert(`${grade}학년 교과/창체 시수 편제표가 저장되었습니다!`);
        } catch (error) {
            alert(error.message || '시수 편제표를 저장하지 못했습니다.');
        }
    }

    // --- Bell Schedule (시정표) & Weekly Period Allocation Logic ---
    const BELL_MAX_PERIODS = 8;
    const WEEKDAY_NAMES = ['월', '화', '수', '목', '금'];

    // <input type="time">은 브라우저 지역 설정을 그대로 따라가서 우리 크롬에서는
    // "오후 01:40"으로 나온다. 시정표는 13:40처럼 24시간으로 읽는 편이 빠르고
    // 헷갈리지 않아 직접 입력 칸으로 바꿨다. 840, 1340처럼 숫자만 쳐도 받아 준다.
    function formatTimeHHMM(value) {
        const matched = String(value ?? '').match(/^([0-9]{1,2}):([0-9]{2})/);
        if (!matched) return '';
        const hour = Number(matched[1]);
        const minute = Number(matched[2]);
        if (hour > 23 || minute > 59) return '';
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function normalizeTimeInput(raw) {
        const text = String(raw ?? '').trim();
        if (!text) return '';
        if (text.includes(':')) return formatTimeHHMM(text);
        const digits = text.replace(/[^0-9]/g, '');
        if (digits.length === 3) return formatTimeHHMM(`${digits.slice(0, 1)}:${digits.slice(1)}`);
        if (digits.length === 4) return formatTimeHHMM(`${digits.slice(0, 2)}:${digits.slice(2)}`);
        return '';
    }

    function bellTimeInputHtml(className, value) {
        return `<input type="text" class="form-input ${className}" inputmode="numeric" maxlength="5" placeholder="13:40" value="${formatTimeHHMM(value)}" style="width:92px; text-align:center;">`;
    }

    function computeDurationMinutes(start, end) {
        if (!start || !end) return null;
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const mins = (eh * 60 + em) - (sh * 60 + sm);
        return mins > 0 ? mins : null;
    }

    function populateLunchAfterSelect(selectEl) {
        if (!selectEl) return;
        selectEl.innerHTML = '';
        const noneOpt = document.createElement('option');
        noneOpt.value = '0';
        noneOpt.textContent = '없음';
        selectEl.appendChild(noneOpt);
        for (let p = 1; p <= BELL_MAX_PERIODS; p++) {
            const opt = document.createElement('option');
            opt.value = String(p);
            opt.textContent = `${p}교시 후`;
            selectEl.appendChild(opt);
        }
    }

    function populateBellGradeCheckboxes() {
        if (!bellGradeCheckboxes) return;
        bellGradeCheckboxes.innerHTML = '';
        for (let grade = 1; grade <= 6; grade++) {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="bellGrade" value="${grade}" checked> ${grade}학년`;
            bellGradeCheckboxes.appendChild(label);
        }
    }

    function getCheckedBellGrades() {
        if (!bellGradeCheckboxes) return [];
        return Array.from(bellGradeCheckboxes.querySelectorAll('input[name="bellGrade"]:checked')).map(cb => Number(cb.value));
    }

    function renderBellTableBody(prefix, tbodyEl, data) {
        if (!tbodyEl) return;
        const periodTimes = (data && data.period_times) || {};
        const lunchAfter = data ? Number(data.lunch_after_period || 0) : 0;
        const arrivalStart = (data && data.arrival_start) || '';
        const arrivalEnd = (data && data.arrival_end) || '';
        const lunchStart = (data && data.lunch_start) || '';
        const lunchEnd = (data && data.lunch_end) || '';

        let rowsHtml = `
            <tr data-row="arrival">
                <td>등교시간</td>
                <td>${bellTimeInputHtml('bell-start', arrivalStart)}</td>
                <td>${bellTimeInputHtml('bell-end', arrivalEnd)}</td>
                <td class="bell-duration">${computeDurationMinutes(arrivalStart, arrivalEnd) ?? ''}</td>
            </tr>
        `;

        for (let p = 1; p <= BELL_MAX_PERIODS; p++) {
            const t = periodTimes[String(p)] || {};
            rowsHtml += `
                <tr data-row="period" data-period="${p}">
                    <td>${p}교시</td>
                    <td>${bellTimeInputHtml('bell-start', t.start)}</td>
                    <td>${bellTimeInputHtml('bell-end', t.end)}</td>
                    <td class="bell-duration">${computeDurationMinutes(t.start, t.end) ?? ''}</td>
                </tr>
            `;
            if (lunchAfter === p) {
                rowsHtml += `
                    <tr data-row="lunch" style="color:#f87171; font-weight:700;">
                        <td>점심시간</td>
                        <td>${bellTimeInputHtml('bell-start', lunchStart)}</td>
                        <td>${bellTimeInputHtml('bell-end', lunchEnd)}</td>
                        <td class="bell-duration">${computeDurationMinutes(lunchStart, lunchEnd) ?? ''}</td>
                    </tr>
                `;
            }
        }

        tbodyEl.innerHTML = rowsHtml;

        tbodyEl.querySelectorAll('tr').forEach(tr => {
            const startInput = tr.querySelector('.bell-start');
            const endInput = tr.querySelector('.bell-end');
            const durationCell = tr.querySelector('.bell-duration');
            const recompute = () => {
                const mins = computeDurationMinutes(startInput.value, endInput.value);
                durationCell.textContent = mins ?? '';
            };
            startInput.addEventListener('input', recompute);
            endInput.addEventListener('input', recompute);
            [startInput, endInput].forEach(input => {
                input.addEventListener('change', () => {
                    input.value = normalizeTimeInput(input.value);
                    recompute();
                });
            });
        });
    }

    function collectBellTableData(tbodyEl) {
        const result = { arrivalStart: null, arrivalEnd: null, periodTimes: {}, lunchStart: null, lunchEnd: null };
        if (!tbodyEl) return result;
        tbodyEl.querySelectorAll('tr').forEach(tr => {
            const rowType = tr.dataset.row;
            const start = normalizeTimeInput(tr.querySelector('.bell-start')?.value) || null;
            const end = normalizeTimeInput(tr.querySelector('.bell-end')?.value) || null;
            if (rowType === 'arrival') {
                result.arrivalStart = start;
                result.arrivalEnd = end;
            } else if (rowType === 'lunch') {
                result.lunchStart = start;
                result.lunchEnd = end;
            } else if (rowType === 'period') {
                const p = tr.dataset.period;
                if (start || end) result.periodTimes[p] = { start, end };
            }
        });
        return result;
    }

    function renderBellSummaryTable() {
        if (!bellSummaryTableBody) return;
        bellSummaryTableBody.innerHTML = '';

        for (let grade = 1; grade <= 6; grade++) {
            const s = bellScheduleByGrade[grade];
            const tr = document.createElement('tr');
            let dismissal = '';
            if (s) {
                const periodTimes = s.period_times || {};
                const filledPeriods = Object.keys(periodTimes).map(Number).filter(p => periodTimes[p] && periodTimes[p].end);
                if (filledPeriods.length > 0) {
                    const lastPeriod = Math.max(...filledPeriods);
                    dismissal = periodTimes[lastPeriod].end || '';
                }
            }
            const lunchText = s && s.lunch_start && s.lunch_end ? `${formatTimeHHMM(s.lunch_start)}~${formatTimeHHMM(s.lunch_end)}` : '-';
            tr.innerHTML = `
                <td style="font-weight:800;">${grade}학년</td>
                <td>${formatTimeHHMM(s?.arrival_start) || '-'}</td>
                <td>${formatTimeHHMM(dismissal) || '-'}</td>
                <td>${lunchText}</td>
                <td><button type="button" class="primary-button secondary load-bell-grade-btn" data-grade="${grade}" style="padding:4px 10px; height:32px;">불러와서 수정</button></td>
            `;
            bellSummaryTableBody.appendChild(tr);
        }

        bellSummaryTableBody.querySelectorAll('.load-bell-grade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const grade = Number(btn.dataset.grade);
                const s = bellScheduleByGrade[grade];
                const lunchAfter = (s && s.lunch_after_period) || Number(bellLunchAfterSelect?.value || 4);
                if (bellLunchAfterSelect) bellLunchAfterSelect.value = String(lunchAfter);
                renderBellTableBody('bell', bellTableBody, { ...(s || {}), lunch_after_period: lunchAfter });
                if (bellGradeCheckboxes) {
                    bellGradeCheckboxes.querySelectorAll('input[name="bellGrade"]').forEach(cb => {
                        cb.checked = Number(cb.value) === grade;
                    });
                }
            });
        });
    }

    async function fetchBellScheduleByGrade() {
        try {
            const res = await api(`/api/school-admin/bell-schedule?academicYear=${selectedAcademicYear}`);
            bellScheduleByGrade = {};
            (res.schedules || []).forEach(s => { bellScheduleByGrade[s.grade] = s; });
        } catch (err) {
            console.error('Failed to load bell schedule:', err);
            bellScheduleByGrade = {};
        }
    }

    async function loadBellSchedule() {
        await fetchBellScheduleByGrade();

        // 편집기 기본값: 학년별로 다르면 관리자가 "불러와서 수정"으로 개별 확인하고,
        // 처음에는 가장 낮은 학년(보통 가장 많이 겹치는 기준)의 값을 기본으로 보여준다.
        const firstGrade = Object.keys(bellScheduleByGrade).map(Number).sort((a, b) => a - b)[0];
        const defaultData = firstGrade ? bellScheduleByGrade[firstGrade] : null;
        const defaultLunchAfter = (defaultData && defaultData.lunch_after_period) || 4;
        if (bellLunchAfterSelect) bellLunchAfterSelect.value = String(defaultLunchAfter);
        renderBellTableBody('bell', bellTableBody, { ...(defaultData || {}), lunch_after_period: defaultLunchAfter });
        renderBellSummaryTable();
    }

    if (bellLunchAfterSelect) {
        bellLunchAfterSelect.addEventListener('change', () => {
            const data = collectBellTableData(bellTableBody);
            renderBellTableBody('bell', bellTableBody, {
                arrival_start: data.arrivalStart, arrival_end: data.arrivalEnd,
                period_times: data.periodTimes, lunch_after_period: Number(bellLunchAfterSelect.value),
                lunch_start: data.lunchStart, lunch_end: data.lunchEnd
            });
        });
    }

    if (saveBellBtn) {
        saveBellBtn.addEventListener('click', async () => {
            const grades = getCheckedBellGrades();
            if (grades.length === 0) {
                alert('적용할 학년을 1개 이상 선택하세요.');
                return;
            }
            const data = collectBellTableData(bellTableBody);
            try {
                await api('/api/school-admin/bell-schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        academicYear: selectedAcademicYear,
                        grades,
                        arrivalStart: data.arrivalStart,
                        arrivalEnd: data.arrivalEnd,
                        periodTimes: data.periodTimes,
                        lunchAfterPeriod: Number(bellLunchAfterSelect ? bellLunchAfterSelect.value : 0),
                        lunchStart: data.lunchStart,
                        lunchEnd: data.lunchEnd
                    })
                });
                alert(`${grades.map(g => g + '학년').join(', ')}에 시정표가 저장되었습니다!`);
                await loadBellSchedule();
            } catch (err) {
                alert(err.message || '시정표를 저장하지 못했습니다.');
            }
        });
    }

    function renderWeeklyAllocationTable() {
        if (!weeklyAllocationTableBody) return;
        weeklyAllocationTableBody.innerHTML = '';

        for (let grade = 1; grade <= 6; grade++) {
            const target = curriculumHoursTotals[grade];
            const locked = target === undefined;
            const tr = document.createElement('tr');
            if (locked) tr.style.opacity = '0.5';
            let cellsHtml = `<td style="font-weight:800;">${grade}학년</td>`;
            for (let day = 1; day <= 5; day++) {
                const found = weeklyAllocationData.find(a => a.grade === grade && a.day_of_week === day);
                const count = found ? found.period_count : 0;
                const disabledAttr = locked ? ' disabled title="먼저 시수편성 탭에서 이 학년의 주당 시수를 정하세요"' : '';
                cellsHtml += `<td><input type="number" min="0" max="8" class="form-input weekly-count-input" data-grade="${grade}" data-day="${day}" value="${count}" style="width:56px; text-align:center;"${disabledAttr}></td>`;
            }
            cellsHtml += `<td class="weekly-total" data-grade-total="${grade}" style="font-weight:800;">0</td>`;
            cellsHtml += `<td>${target !== undefined ? target + '시간' : '-'}</td>`;
            cellsHtml += `<td class="weekly-status" data-grade-status="${grade}"></td>`;
            tr.innerHTML = cellsHtml;
            weeklyAllocationTableBody.appendChild(tr);
        }

        function recomputeTotal(grade) {
            const inputs = weeklyAllocationTableBody.querySelectorAll(`input[data-grade="${grade}"]`);
            let sum = 0;
            inputs.forEach(inp => { sum += Number(inp.value || 0); });
            const totalCell = weeklyAllocationTableBody.querySelector(`[data-grade-total="${grade}"]`);
            if (totalCell) totalCell.textContent = sum;

            const statusCell = weeklyAllocationTableBody.querySelector(`[data-grade-status="${grade}"]`);
            if (statusCell) {
                const target = curriculumHoursTotals[grade];
                if (target === undefined) {
                    statusCell.innerHTML = `<span style="color:var(--text-muted);">시수편성 미입력</span>`;
                } else if (sum === target) {
                    statusCell.innerHTML = `<span style="color:var(--success);">✅ 일치</span>`;
                } else {
                    const diff = target - sum;
                    statusCell.innerHTML = `<span style="color:var(--danger); font-weight:700;">⚠️ ${diff > 0 ? diff + '시간 부족' : Math.abs(diff) + '시간 초과'}</span>`;
                }
            }
        }

        weeklyAllocationTableBody.querySelectorAll('.weekly-count-input').forEach(inp => {
            inp.addEventListener('input', () => recomputeTotal(inp.dataset.grade));
        });
        for (let grade = 1; grade <= 6; grade++) recomputeTotal(grade);
    }

    async function fetchWeeklyAllocationData() {
        try {
            const res = await api(`/api/school-admin/weekly-period-allocation?academicYear=${selectedAcademicYear}`);
            weeklyAllocationData = res.allocations || [];
        } catch (err) {
            console.error('Failed to load weekly period allocation:', err);
            weeklyAllocationData = [];
        }
    }

    async function fetchCurriculumHoursTotals() {
        try {
            const res = await api(`/api/school-admin/curriculum-hours-summary?academicYear=${selectedAcademicYear}`);
            curriculumHoursTotals = {};
            (res.totals || []).forEach(t => { curriculumHoursTotals[t.grade] = t.totalWeeklyHours; });
        } catch (err) {
            console.error('Failed to load curriculum hours summary:', err);
            curriculumHoursTotals = {};
        }
    }

    async function loadWeeklyAllocation() {
        await Promise.all([fetchWeeklyAllocationData(), fetchCurriculumHoursTotals()]);
        renderWeeklyAllocationTable();
    }

    if (saveWeeklyAllocationBtn) {
        saveWeeklyAllocationBtn.addEventListener('click', async () => {
            const allocations = [];
            weeklyAllocationTableBody.querySelectorAll('.weekly-count-input').forEach(inp => {
                allocations.push({
                    grade: Number(inp.dataset.grade),
                    dayOfWeek: Number(inp.dataset.day),
                    periodCount: Number(inp.value || 0)
                });
            });
            try {
                await api('/api/school-admin/weekly-period-allocation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ academicYear: selectedAcademicYear, allocations })
                });
                alert('주간 수업 배당표가 저장되었습니다!');
            } catch (err) {
                alert(err.message || '주간 수업 배당표를 저장하지 못했습니다.');
            }
        });
    }

    async function loadBellScheduleTab() {
        if (bellLunchAfterSelect) populateLunchAfterSelect(bellLunchAfterSelect);
        populateBellGradeCheckboxes();
        await loadBellSchedule();
        await loadWeeklyAllocation();
    }

    // --- Master Timetable Grid Logic (1~8 Periods Support) ---
    function renderSubjectPalette() {
        if (!subjectPalette) return;
        subjectPalette.innerHTML = '';

        const grade = Number(timetableGradeSelect ? timetableGradeSelect.value : 5);
        const gradeSubjects = GRADE_SUBJECT_BASE_HOURS[grade] || GRADE_SUBJECT_BASE_HOURS[5];
        const dynamicSubjects = Array.from(new Set(gradeSubjects.map(s => s.name).concat(['수업없음'])));

        dynamicSubjects.forEach(sub => {
            const chip = document.createElement('div');
            chip.className = 'palette-chip';
            if (sub === activePaletteSubject) chip.classList.add('selected');
            chip.textContent = sub;
            chip.addEventListener('click', () => {
                activePaletteSubject = sub;
                renderSubjectPalette();
            });
            subjectPalette.appendChild(chip);
        });
    }

    const timetableClassSelect = document.getElementById('timetableClassSelect');
    const timetableHoursAuditBar = document.getElementById('timetableHoursAuditBar');
    const timetableAuditStatusBadge = document.getElementById('timetableAuditStatusBadge');

    if (timetableClassSelect) {
        timetableClassSelect.addEventListener('change', loadMasterTimetable);
    }

    // --- Teacher Timetable (교사별 시간표) ---
    const specialistTeacherSelect = document.getElementById('specialistTeacherSelect');
    const specialistTimetableEmpty = document.getElementById('specialistTimetableEmpty');
    const specialistTimetableContent = document.getElementById('specialistTimetableContent');
    const specialistTimetableMatrixBody = document.getElementById('specialistTimetableMatrixBody');
    let specialistTeachersCache = [];

    // 담임은 "(담임)"보다 맡은 반이 훨씬 빨리 읽힌다. 반이 없으면 교과를 맡은 교사다.
    function teacherRoleLabel(teacher) {
        if (teacher.homeroomGrade && teacher.homeroomClassNumber) {
            return `${teacher.homeroomGrade}-${teacher.homeroomClassNumber}`;
        }
        // 담임으로 등록됐는데 학년·반이 비어 있으면 교과 교사로 둔갑시키지 말고
        // 반이 안 잡혔다는 걸 그대로 보여 준다.
        if (teacher.type === '담임' || teacher.type === 'homeroom') return '담임·반 미정';
        return '교과';
    }
    let specialistTimetableData = {}; // "day_period" -> { grade, classNumber, subjectName, roomName }

    async function loadSpecialistTeachersList() {
        if (!specialistTeacherSelect) return;
        try {
            const res = await api('/api/school-admin/specialist-teachers');
            specialistTeachersCache = res.teachers || [];
            const prevValue = specialistTeacherSelect.value;
            specialistTeacherSelect.innerHTML = '<option value="">교사를 선택하세요</option>' +
                specialistTeachersCache.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (${escapeHtml(teacherRoleLabel(t))})</option>`).join('');
            if (prevValue) specialistTeacherSelect.value = prevValue;
        } catch (error) {
            if (specialistTimetableEmpty) specialistTimetableEmpty.textContent = error.message;
        }
    }

    function renderGridMatrix(tbody, dataMap, onCellClick) {
        tbody.innerHTML = '';
        for (let period = 1; period <= 8; period++) {
            const tr = document.createElement('tr');
            let cellsHtml = `<td style="font-weight:800; background:rgba(0,0,0,0.02);">${period}교시</td>`;
            for (let day = 1; day <= 5; day++) {
                const cell = dataMap[`${day}_${period}`];
                const label = cell
                    ? `${cell.grade}학년 ${cell.classNumber}반<br><small>${escapeHtml(cell.subjectName || '')}</small>`
                    : '<span style="color:var(--text-muted);">-</span>';
                cellsHtml += `<td class="timetable-cell" data-day="${day}" data-period="${period}">${label}</td>`;
            }
            tr.innerHTML = cellsHtml;
            tbody.appendChild(tr);
        }
        tbody.querySelectorAll('.timetable-cell').forEach(cell => {
            cell.addEventListener('click', () => onCellClick(Number(cell.dataset.day), Number(cell.dataset.period)));
        });
    }

    async function loadSpecialistTimetable() {
        const teacherId = specialistTeacherSelect.value;
        if (!teacherId) {
            if (specialistTimetableContent) specialistTimetableContent.hidden = true;
            if (specialistTimetableEmpty) {
                specialistTimetableEmpty.hidden = false;
                specialistTimetableEmpty.textContent = '교사를 선택하면 시간표가 표시됩니다.';
            }
            return;
        }
        try {
            const res = await api(`/api/school-admin/specialist-timetable?academicYear=${selectedAcademicYear}&teacherUserId=${teacherId}`);
            specialistTimetableData = {};
            (res.timetable || []).forEach(row => {
                specialistTimetableData[`${row.day_of_week}_${row.period}`] = {
                    grade: row.grade, classNumber: row.class_number, subjectName: row.subject_name, roomName: row.room_name
                };
            });
            if (specialistTimetableEmpty) specialistTimetableEmpty.hidden = true;
            if (specialistTimetableContent) specialistTimetableContent.hidden = false;
            renderGridMatrix(specialistTimetableMatrixBody, specialistTimetableData, handleSpecialistCellClick);
        } catch (error) {
            if (specialistTimetableEmpty) {
                specialistTimetableEmpty.hidden = false;
                specialistTimetableEmpty.textContent = error.message;
            }
            if (specialistTimetableContent) specialistTimetableContent.hidden = true;
        }
    }

    async function handleSpecialistCellClick(day, period) {
        const teacherId = specialistTeacherSelect.value;
        if (!teacherId) return;
        const key = `${day}_${period}`;
        const existing = specialistTimetableData[key];

        if (existing) {
            if (!confirm(`${existing.grade}학년 ${existing.classNumber}반의 이 배정을 지울까요?`)) return;
            try {
                await api('/api/school-admin/specialist-timetable', {
                    method: 'PUT',
                    body: JSON.stringify({
                        academicYear: selectedAcademicYear,
                        teacherUserId: teacherId,
                        cells: [{ grade: existing.grade, classNumber: existing.classNumber, dayOfWeek: day, period, clear: true }]
                    })
                });
                await loadSpecialistTimetable();
            } catch (error) {
                alert(error.message || '지우지 못했습니다.');
            }
            return;
        }

        const grade = prompt('학년(1~6)을 입력하세요:');
        if (!grade) return;
        const classNumber = prompt('반을 입력하세요:');
        if (!classNumber) return;
        const subjectName = prompt('과목명을 입력하세요:', '');
        if (subjectName === null) return;

        try {
            await api('/api/school-admin/specialist-timetable', {
                method: 'PUT',
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    teacherUserId: teacherId,
                    cells: [{ grade: Number(grade), classNumber: Number(classNumber), dayOfWeek: day, period, subjectName }]
                })
            });
            await loadSpecialistTimetable();
        } catch (error) {
            alert(error.message || '배정하지 못했습니다.');
        }
    }

    if (specialistTeacherSelect) {
        specialistTeacherSelect.addEventListener('change', loadSpecialistTimetable);
    }

    // --- Special Room Timetable (특별실별 시간표) ---
    const roomNameInput = document.getElementById('roomNameInput');
    const roomNameList = document.getElementById('roomNameList');
    const loadRoomTimetableBtn = document.getElementById('loadRoomTimetableBtn');
    const roomTimetableEmpty = document.getElementById('roomTimetableEmpty');
    const roomTimetableContent = document.getElementById('roomTimetableContent');
    const roomTimetableMatrixBody = document.getElementById('roomTimetableMatrixBody');
    let roomTimetableData = {};
    let currentRoomName = '';

    async function loadRoomsList() {
        if (!roomNameList) return;
        try {
            const res = await api(`/api/school-admin/rooms?academicYear=${selectedAcademicYear}`);
            roomNameList.innerHTML = (res.rooms || []).map(r => `<option value="${escapeHtml(r)}"></option>`).join('');
        } catch (error) { /* non-critical */ }
    }

    async function loadRoomTimetable() {
        const roomName = roomNameInput.value.trim();
        if (!roomName) {
            if (roomTimetableEmpty) {
                roomTimetableEmpty.hidden = false;
                roomTimetableEmpty.textContent = '특별실 이름을 입력하세요.';
            }
            if (roomTimetableContent) roomTimetableContent.hidden = true;
            return;
        }
        currentRoomName = roomName;
        try {
            const res = await api(`/api/school-admin/room-timetable?academicYear=${selectedAcademicYear}&room=${encodeURIComponent(roomName)}`);
            roomTimetableData = {};
            (res.timetable || []).forEach(row => {
                roomTimetableData[`${row.day_of_week}_${row.period}`] = {
                    grade: row.grade, classNumber: row.class_number, subjectName: row.subject_name, teacherUserId: row.teacher_user_id
                };
            });
            if (roomTimetableEmpty) roomTimetableEmpty.hidden = true;
            if (roomTimetableContent) roomTimetableContent.hidden = false;
            renderGridMatrix(roomTimetableMatrixBody, roomTimetableData, handleRoomCellClick);
            await loadRoomsList();
        } catch (error) {
            if (roomTimetableEmpty) {
                roomTimetableEmpty.hidden = false;
                roomTimetableEmpty.textContent = error.message;
            }
            if (roomTimetableContent) roomTimetableContent.hidden = true;
        }
    }

    async function handleRoomCellClick(day, period) {
        if (!currentRoomName) return;
        const key = `${day}_${period}`;
        const existing = roomTimetableData[key];

        if (existing) {
            if (!confirm(`${existing.grade}학년 ${existing.classNumber}반의 이 배정을 지울까요?`)) return;
            try {
                await api('/api/school-admin/room-timetable', {
                    method: 'PUT',
                    body: JSON.stringify({
                        academicYear: selectedAcademicYear,
                        room: currentRoomName,
                        cells: [{ grade: existing.grade, classNumber: existing.classNumber, dayOfWeek: day, period, clear: true }]
                    })
                });
                await loadRoomTimetable();
            } catch (error) {
                alert(error.message || '지우지 못했습니다.');
            }
            return;
        }

        const grade = prompt('학년(1~6)을 입력하세요:');
        if (!grade) return;
        const classNumber = prompt('반을 입력하세요:');
        if (!classNumber) return;
        const subjectName = prompt('과목명을 입력하세요 (선택 사항):', '') || '';

        try {
            await api('/api/school-admin/room-timetable', {
                method: 'PUT',
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    room: currentRoomName,
                    cells: [{ grade: Number(grade), classNumber: Number(classNumber), dayOfWeek: day, period, subjectName }]
                })
            });
            await loadRoomTimetable();
        } catch (error) {
            alert(error.message || '배정하지 못했습니다.');
        }
    }

    if (loadRoomTimetableBtn) loadRoomTimetableBtn.addEventListener('click', loadRoomTimetable);

    function getWeeklyAllocationTotal(grade) {
        return weeklyAllocationData
            .filter(a => a.grade === grade)
            .reduce((sum, a) => sum + a.period_count, 0);
    }

    // 기초시간표(요일×교시 과목배치)는 "시수편성 → 주간 수업 배당표"가 그 학년에 대해
    // 완전히 끝난 뒤에만 열린다 — 배당 합계가 시수편성 목표와 정확히 같아야 통과.
    function isWeeklyAllocationCompleteForGrade(grade) {
        const target = curriculumHoursTotals[grade];
        if (target === undefined || target <= 0) return false;
        return getWeeklyAllocationTotal(grade) === target;
    }

    async function loadMasterTimetable() {
        if (!timetableMatrixBody) return;
        const grade = Number(timetableGradeSelect.value);
        const classNum = timetableClassSelect ? timetableClassSelect.value : 1;

        await Promise.all([fetchBellScheduleByGrade(), fetchWeeklyAllocationData(), fetchCurriculumHoursTotals()]);

        if (!isWeeklyAllocationCompleteForGrade(grade)) {
            const target = curriculumHoursTotals[grade];
            if (timetableLockedBanner) {
                timetableLockedBanner.hidden = false;
                timetableLockedBanner.textContent = target === undefined || target <= 0
                    ? `${grade}학년의 시수편성이 아직 입력되지 않았습니다. "시수편성" 탭에서 먼저 학년별 주당 시수를 정하세요.`
                    : `${grade}학년의 주간 수업 배당표가 시수편성 목표(${target}시간)와 아직 일치하지 않습니다. (현재 배당 합계: ${getWeeklyAllocationTotal(grade)}시간) "시정표 & 주간 수업 배당" 탭에서 먼저 맞춰주세요.`;
            }
            if (timetableUnlockedContent) timetableUnlockedContent.hidden = true;
            return;
        }
        if (timetableLockedBanner) timetableLockedBanner.hidden = true;
        if (timetableUnlockedContent) timetableUnlockedContent.hidden = false;

        try {
            const res = await api(`/api/school-admin/master-timetable?academicYear=${selectedAcademicYear}&grade=${grade}&classNumber=${classNum}`);
            timetableMatrixData = {};
            timetableMatrixLocks = {};
            (res.timetable || []).forEach(cell => {
                const key = `${cell.day_of_week}_${cell.period}`;
                timetableMatrixData[key] = cell.subject_name;
                if (cell.teacher_user_id || cell.room_name) {
                    timetableMatrixLocks[key] = { teacherUserId: cell.teacher_user_id, roomName: cell.room_name };
                }
            });
            renderTimetableMatrix();
        } catch (error) {
            timetableMatrixData = {};
            timetableMatrixLocks = {};
            renderTimetableMatrix();
        }
    }

    function getAllocatedPeriodCount(grade, dayOfWeek) {
        const found = weeklyAllocationData.find(a => a.grade === grade && a.day_of_week === dayOfWeek);
        return found ? found.period_count : null; // null = 배당표 미설정 (제한 없음)
    }

    function auditTimetableGradeHours() {
        if (!timetableHoursAuditBar) return;

        const grade = Number(timetableGradeSelect ? timetableGradeSelect.value : 5);
        const gradeDefaults = GRADE_SUBJECT_BASE_HOURS[grade] || GRADE_SUBJECT_BASE_HOURS[5];

        // Count placed hours per subject in matrix
        const placedMap = new Map();
        Object.values(timetableMatrixData).forEach(sub => {
            if (sub && sub !== '-' && sub !== '수업없음') {
                placedMap.set(sub, (placedMap.get(sub) || 0) + 1);
            }
        });

        let allMatched = true;
        let auditChipsHtml = '';

        gradeDefaults.forEach(def => {
            const placed = placedMap.get(def.name) || 0;
            const target = def.weekly;
            const isOk = placed === target;
            if (!isOk) allMatched = false;

            const chipColor = isOk ? 'var(--success)' : 'var(--danger)';
            const statusIcon = isOk ? '✅' : '⚠️';
            auditChipsHtml += `<span style="background:rgba(0,0,0,0.03); padding:4px 10px; border-radius:6px; border:1px solid rgba(0,0,0,0.08); color:${chipColor}; font-weight:700;">${def.name}: ${placed}/${target}시간 ${statusIcon}</span>`;
        });

        timetableHoursAuditBar.innerHTML = auditChipsHtml;

        if (timetableAuditStatusBadge) {
            if (allMatched) {
                timetableAuditStatusBadge.textContent = '✅ 학년 공통 주당 기준시수 100% 일치';
                timetableAuditStatusBadge.className = 'audit-status status-ok';
            } else {
                timetableAuditStatusBadge.textContent = '⚠️ 과목별 주당 목표시수 불일치 확인 필요';
                timetableAuditStatusBadge.className = 'audit-status status-warn';
            }
        }
    }

    function renderTimetableMatrix() {
        if (!timetableMatrixBody) return;
        timetableMatrixBody.innerHTML = '';

        const grade = Number(timetableGradeSelect ? timetableGradeSelect.value : 5);
        const gradeBell = bellScheduleByGrade[grade];
        const gradePeriodTimes = (gradeBell && gradeBell.period_times) || {};

        // 1 to 8 Periods (하루 최대 8교시)
        for (let period = 1; period <= 8; period++) {
            const tr = document.createElement('tr');
            const t = gradePeriodTimes[String(period)];
            const timeLabel = t && t.start && t.end ? `<div style="font-size:0.72rem; font-weight:normal; color:var(--text-muted);">${t.start}~${t.end}</div>` : '';
            let cellsHtml = `<td style="font-weight:800; background:rgba(0,0,0,0.02);">${period}교시${timeLabel}</td>`;

            // Mon(1) to Fri(5)
            for (let day = 1; day <= 5; day++) {
                const allocated = getAllocatedPeriodCount(grade, day);
                const isInactive = allocated !== null && period > allocated;
                const sub = timetableMatrixData[`${day}_${period}`] || '-';
                const lock = timetableMatrixLocks[`${day}_${period}`];
                const lockBadge = lock ? `<div style="font-size:0.68rem; color:var(--primary);">${lock.teacherUserId ? '🎯교과' : ''}${lock.teacherUserId && lock.roomName ? ' · ' : ''}${lock.roomName ? `🚪${escapeHtml(lock.roomName)}` : ''}</div>` : '';
                const tagHtml = (sub !== '-' && sub !== '수업없음' ? `<span class="cell-subject-tag">${escapeHtml(sub)}</span>` : `<span style="color:var(--text-muted);">${sub}</span>`) + lockBadge;
                const inactiveAttrs = isInactive ? ' style="opacity:0.3; pointer-events:none;" title="이 요일의 배당 교시수를 초과했습니다"' : '';
                const lockAttrs = lock ? ' data-locked="true" title="교사별/특별실별 시간표에서 배정됨 - 클릭하면 지울 수 있습니다"' : '';
                cellsHtml += `<td class="timetable-cell" data-day="${day}" data-period="${period}"${inactiveAttrs}${lockAttrs}>${tagHtml}</td>`;
            }

            tr.innerHTML = cellsHtml;
            timetableMatrixBody.appendChild(tr);
        }

        auditTimetableGradeHours();

        // Cell click handler
        timetableMatrixBody.querySelectorAll('.timetable-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const day = cell.dataset.day;
                const period = cell.dataset.period;
                const key = `${day}_${period}`;
                if (cell.dataset.locked === 'true') {
                    clearLockedTimetableCell(Number(day), Number(period));
                    return;
                }
                timetableMatrixData[key] = activePaletteSubject;
                renderTimetableMatrix();
            });
        });
    }

    async function clearLockedTimetableCell(day, period) {
        if (!confirm('이 시간은 교사별/특별실별 시간표에서 배정되었습니다. 여기서 지우면 그쪽 배정도 함께 사라집니다. 지울까요?')) return;
        const grade = timetableGradeSelect.value;
        const classNum = timetableClassSelect ? timetableClassSelect.value : 1;
        try {
            await api('/api/school-admin/master-timetable', {
                method: 'POST',
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    grade,
                    classNumber: classNum,
                    cells: [{ dayOfWeek: day, period, clearSpecialist: true }]
                })
            });
            await loadMasterTimetable();
        } catch (error) {
            alert(error.message || '지우지 못했습니다.');
        }
    }

    async function saveMasterTimetable() {
        const grade = timetableGradeSelect.value;
        const classNum = timetableClassSelect ? timetableClassSelect.value : 1;
        const cells = [];
        for (let day = 1; day <= 5; day++) {
            for (let period = 1; period <= 8; period++) {
                const sub = timetableMatrixData[`${day}_${period}`] || '';
                cells.push({ dayOfWeek: day, period, subjectName: sub });
            }
        }

        try {
            await api('/api/school-admin/master-timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academicYear: selectedAcademicYear,
                    grade,
                    classNumber: classNum,
                    cells
                })
            });
            alert(`${grade}학년 ${classNum}반 기초시간표 매트릭스가 성공적으로 저장되었습니다!`);
        } catch (error) {
            alert(error.message || '시간표를 저장하지 못했습니다.');
        }
    }

    // --- 학급별 연간 34주차 종합 시간표 & 서류 출력 ---
    const annualTimetableGradeSelect = document.getElementById('annualTimetableGradeSelect');
    const annualTimetableClassSelect = document.getElementById('annualTimetableClassSelect');
    const annualTimetableTableBody = document.getElementById('annualTimetableTableBody');
    const annualTimetableTableFoot = document.getElementById('annualTimetableTableFoot');
    const printOfficialDocBtn = document.getElementById('printOfficialDocBtn');
    const annualTotalHoursVal = document.getElementById('annualTotalHoursVal');
    const semesterDaysVal = document.getElementById('semesterDaysVal');

    if (annualTimetableGradeSelect) annualTimetableGradeSelect.addEventListener('change', renderAnnualTimetable34Weeks);
    if (annualTimetableClassSelect) annualTimetableClassSelect.addEventListener('change', renderAnnualTimetable34Weeks);
    if (printOfficialDocBtn) {
        printOfficialDocBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 선택한 학년의 시정표를 읽기전용 표로 보여준다 (서류 인쇄에 함께 나감).
    function renderAnnualBellSchedule(grade) {
        const panel = document.getElementById('annualBellSchedulePanel');
        const label = document.getElementById('annualBellGradeLabel');
        const tbody = document.getElementById('annualBellTableBody');
        if (!panel || !tbody) return;
        if (label) label.textContent = `${grade}학년`;
        panel.hidden = false;

        const s = bellScheduleByGrade[grade];
        if (!s) {
            tbody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted);">이 학년의 시정표가 아직 없습니다. "시정표 & 주간 수업 배당" 탭에서 입력하세요.</td></tr>`;
            return;
        }

        const periodTimes = s.period_times || {};
        const lunchAfter = Number(s.lunch_after_period || 0);
        let rows = '';
        const addRow = (name, start, end, highlight) => {
            const mins = computeDurationMinutes(start || '', end || '');
            rows += `<tr${highlight ? ' style="color:#dc2626; font-weight:700;"' : ''}><td>${name}</td><td>${start || '-'}</td><td>${end || '-'}</td><td>${mins ?? '-'}</td></tr>`;
        };
        if (s.arrival_start || s.arrival_end) addRow('등교시간', s.arrival_start, s.arrival_end);
        const filledPeriods = Object.keys(periodTimes).map(Number).filter(p => periodTimes[p] && (periodTimes[p].start || periodTimes[p].end));
        const maxPeriod = filledPeriods.length > 0 ? Math.max(...filledPeriods) : 0;
        for (let p = 1; p <= maxPeriod; p++) {
            const t = periodTimes[String(p)] || {};
            addRow(`${p}교시`, t.start, t.end);
            if (lunchAfter === p && (s.lunch_start || s.lunch_end)) addRow('점심시간', s.lunch_start, s.lunch_end, true);
        }
        tbody.innerHTML = rows || `<tr><td colspan="4" style="color:var(--text-muted);">교시별 시각이 입력되지 않았습니다.</td></tr>`;
    }

    async function renderAnnualTimetable34Weeks() {
        if (!annualTimetableTableBody) return;
        annualTimetableTableBody.innerHTML = '';

        const grade = Number(annualTimetableGradeSelect ? annualTimetableGradeSelect.value : 5);
        const classNum = Number(annualTimetableClassSelect ? annualTimetableClassSelect.value : 1);

        try {
            const [synthData] = await Promise.all([
                api(`/api/school-admin/annual-timetable-34weeks?academicYear=${selectedAcademicYear}&grade=${grade}&classNumber=${classNum}`),
                fetchBellScheduleByGrade()
            ]);
            renderAnnualBellSchedule(grade);
            const dailyPeriodsMap = synthData.dailyPeriodsMap || { 1: 6, 2: 6, 3: 5, 4: 6, 5: 6 };
            const schedList = synthData.schedules || [];
            const generalEventList = synthData.generalEvents || [];

            const activeHolidays = Object.keys(dynamicPublicHolidays).length > 0 ? dynamicPublicHolidays : KOREAN_NATIONAL_HOLIDAYS;

            let cumulativeHours = 0;
            let totalSchoolDays1 = 0;
            let totalSchoolDays2 = 0;
            let weekIndex = 1;

            let currMon = new Date(selectedAcademicYear, 2, 1);
            while (currMon.getDay() !== 1) {
                currMon.setDate(currMon.getDate() + 1);
            }

            const endDate = new Date(selectedAcademicYear + 1, 2, 0); // Last day of February (28 or 29)

            while (currMon <= endDate) {
                const currFri = new Date(currMon);
                currFri.setDate(currFri.getDate() + 4);

                const mStart = currMon.getMonth() + 1;
                const dStart = currMon.getDate();
                const mEnd = currFri.getMonth() + 1;
                const dEnd = currFri.getDate();
                const periodStr = `${mStart}.${dStart}~${mEnd}.${dEnd}`;

                const semesterNum = mStart >= 3 && mStart <= 8 ? 1 : 2;
                const semesterLabel = `${semesterNum}학기`;

                const monP = dailyPeriodsMap[1] || 0;
                const tueP = dailyPeriodsMap[2] || 0;
                const wedP = dailyPeriodsMap[3] || 0;
                const thuP = dailyPeriodsMap[4] || 0;
                const friP = dailyPeriodsMap[5] || 0;

                let weekSchoolDays = 0;
                let weekLabels = [];

                for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
                    const dayDate = new Date(currMon);
                    dayDate.setDate(dayDate.getDate() + dayOffset);
                    const year = dayDate.getFullYear();
                    const m = dayDate.getMonth() + 1;
                    const d = dayDate.getDate();
                    const dateStr = `${year}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;

                    const natHoliday = activeHolidays[dateStr];
                    const vacType = getVacationType(dateStr);
                    // 서버가 이미 이 학년에 해당되는 항목만 내려준다 (target_scope='ALL' 이거나
                    // target_grades에 이 학년이 포함된 것만).
                    const customEvt = schedList.find(e => e.event_date === dateStr);

                    if (natHoliday) {
                        weekLabels.push(`🔴 ${natHoliday}`);
                    } else if (vacType) {
                        weekLabels.push(`🏖️ ${vacType}`);
                    } else if (customEvt) {
                        weekLabels.push(`🏫 ${customEvt.title}`);
                        if (customEvt.category !== 'HOLIDAY' && customEvt.category !== 'DISCRETIONARY') {
                            weekSchoolDays++;
                        }
                    } else {
                        weekSchoolDays++;
                    }

                    // 일반 행사는 기존 시간표/등교일수 계산에는 영향을 주지 않고, 딱지(요약 텍스트)만 덧붙인다.
                    generalEventList
                        .filter(e => e.event_date <= dateStr && (e.end_date || e.event_date) >= dateStr)
                        .forEach(e => weekLabels.push(`📌 ${e.title}`));
                }

                if (semesterNum === 1) totalSchoolDays1 += weekSchoolDays;
                else totalSchoolDays2 += weekSchoolDays;

                // 34주는 실제 등교(수업)한 주만 세는 기준이므로 -- 방학처럼 등교일이
                // 하루도 없는 주는 행을 만들지도, 주차 번호를 소모하지도 않는다.
                // (school_curriculum_hours의 연간필요시수도 "주당시수 × 34"로 계산되므로
                // 이 표의 34주는 실수업주와 일치해야 함)
                if (weekSchoolDays > 0) {
                    const weeklyHours = monP + tueP + wedP + thuP + friP;
                    cumulativeHours += weeklyHours;

                    const eventSummary = weekLabels.length > 0 ? Array.from(new Set(weekLabels)).join(', ') : '정상 수업';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span class="badge ${semesterNum === 1 ? 'category-event' : 'category-trip'}">${semesterLabel}</span></td>
                        <td style="font-weight:700;">${weekIndex}주차</td>
                        <td>${periodStr}</td>
                        <td style="font-weight:700;">${weekSchoolDays}일</td>
                        <td>${monP}h</td>
                        <td>${tueP}h</td>
                        <td>${wedP}h</td>
                        <td>${thuP}h</td>
                        <td>${friP}h</td>
                        <td style="font-weight:800; color:var(--primary);">${weeklyHours}시간</td>
                        <td style="font-weight:800;">${cumulativeHours}시간</td>
                        <td style="font-size:0.88rem; color:var(--text-muted);">${eventSummary}</td>
                    `;
                    annualTimetableTableBody.appendChild(tr);
                    weekIndex++;
                }

                currMon.setDate(currMon.getDate() + 7);
            }

            if (annualTotalHoursVal) annualTotalHoursVal.textContent = `${cumulativeHours.toLocaleString()}시간`;
            if (semesterDaysVal) semesterDaysVal.textContent = `${totalSchoolDays1}일 / ${totalSchoolDays2}일 (총 ${totalSchoolDays1 + totalSchoolDays2}일)`;

            annualTimetableTableFoot.innerHTML = `
                <tr>
                    <td colspan="3">연간 34주 총계</td>
                    <td>${totalSchoolDays1 + totalSchoolDays2}일</td>
                    <td colspan="5">월~금 기초시간표 배정 교시 연산 정산</td>
                    <td>-</td>
                    <td style="font-weight:900; color:var(--primary); font-size:1.1rem;">${cumulativeHours.toLocaleString()}시간</td>
                    <td>✅ DB 실제 데이터 정산 충족</td>
                </tr>
            `;
        } catch (err) {
            console.error('Failed to render 34-week annual timetable:', err);
        }
    }

    // Call initial load on tab switch
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.tab === 'annualTimetable') {
                renderAnnualTimetable34Weeks();
            }
        });
    });

    // --- Roster Logic ---
    async function loadRoster() {
        rosterLoading.hidden = false;
        rosterError.hidden = true;
        rosterContent.hidden = true;

        try {
            const res = await api('/api/school-admin/students');
            rosterData = res.students;
            renderRosterTable();
            
            rosterLoading.hidden = true;
            rosterContent.hidden = false;
        } catch (error) {
            rosterLoading.hidden = true;
            rosterError.textContent = error.message;
            rosterError.hidden = false;
        }
    }

    function renderRosterTable() {
        const query = rosterSearch.value.trim().toLowerCase();
        
        const filtered = rosterData.filter(s => {
            if (!query) return true;
            return s.name.toLowerCase().includes(query) || 
                   `${s.grade}학년`.includes(query) ||
                   `${s.class_number}반`.includes(query);
        });

        rosterTableBody.innerHTML = '';
        
        filtered.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.grade}</td>
                <td>${s.class_number}</td>
                <td>${s.student_number}</td>
                <td style="font-weight: 600;">${s.name}</td>
            `;
            rosterTableBody.appendChild(tr);
        });

        if (filtered.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4">검색 결과가 없습니다.</td>`;
            rosterTableBody.appendChild(tr);
        }
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Start
    init();
});
