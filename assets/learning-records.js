(function () {
  'use strict';
  if (window.LearningRecords) return;
  const API = '/api/learning-records';
  const clone = value => JSON.parse(JSON.stringify(value));
  const today = () => new Date(Date.now() + 32400000).toISOString().slice(0, 10);
  const date = value => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  const uid = () => crypto.randomUUID();
  const el = (tag, text, className) => { const node = document.createElement(tag); if (text != null) node.textContent = text; if (className) node.className = className; return node; };
  const css = `
    :host{display:block;position:relative;z-index:30;box-sizing:border-box;width:calc(100% - 112px);max-width:1180px;margin:8px auto 10px;color:#24364b;font:13px/1.45 system-ui,"Malgun Gothic",sans-serif;color-scheme:light}
    *{box-sizing:border-box}[hidden]{display:none!important}button,input,select{font:inherit}button,a{touch-action:manipulation}
    button{cursor:pointer;border:1px solid #d8e2ec;border-radius:6px;padding:6px 9px;background:#fff;color:#233d5d;font-weight:600}button:hover{background:#edf4fb}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #6d9df2;outline-offset:2px}button:disabled{opacity:.55;cursor:wait}a{color:#245ac0;text-decoration:none}p{margin:0}h2,h3{margin:0;color:#182c45}h2{font-size:19px}h3{font-size:15px}
    .strip{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#fff;border:1px solid #dce5ee;border-radius:6px;padding:4px 8px;min-height:36px}.identity{display:flex;align-items:center;gap:10px;flex:1;min-width:0}.title{font-weight:650;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status{font-size:11px;color:#587366;white-space:nowrap}.status[data-state=error]{color:#ad3428}.status[data-state=pending]{color:#8b6916}.progress{color:#546a82;font-size:12px;white-space:nowrap}.strip>button{font-size:12px;white-space:nowrap}
    .primary{background:#245ac0;color:white;border-color:#245ac0}.primary:hover{background:#18499f}.muted{color:#6c7c8e;font-size:12px}.actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.badge{font-size:11px;color:#6d7d8f;white-space:nowrap}.badge.done{color:#27633d}
    dialog{padding:0;border:1px solid #d8e2ec;border-radius:10px;box-shadow:0 15px 50px #182c4533;width:min(740px,calc(100vw - 24px));max-height:85dvh;color:#24364b;background:#fff}dialog::backdrop{background:#14273c66}.dialog-head{padding:12px 16px;border-bottom:1px solid #e0e7ef;display:flex;justify-content:space-between;gap:12px;align-items:center}.body{padding:16px}.filters{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-bottom:10px}.filters label{display:grid;gap:3px;font-size:12px;color:#62758c}input,select{border:1px solid #ccd9e7;border-radius:6px;background:white;padding:6px;max-width:100%}
    .row{border-bottom:1px solid #e0e7ef;padding:10px 0}.row:last-child{border-bottom:0}.row-top{display:flex;align-items:start;justify-content:space-between;gap:12px}.row h3{margin:2px 0}.row .actions{margin-top:7px}.numbers{display:flex;gap:24px;flex-wrap:wrap;margin:16px 0}.number{padding-right:24px;border-right:1px solid #e0e7ef}.number:last-child{padding-right:0;border:0}.number strong{display:block;font-size:23px;color:#234c83}.number span{font-size:12px;color:#687b93}.empty{padding:20px 0;color:#65768c}.detail{padding:9px 0;border-bottom:1px solid #e0e7ef;overflow-wrap:anywhere}.detail pre{white-space:pre-wrap;font:inherit;margin:4px 0}.error{color:#a83629}.save-warning{max-width:460px}.save-warning p{margin:8px 0 16px}
    @media(max-width:600px){:host{width:calc(100% - 112px)}.strip{gap:5px 8px}.identity{flex-basis:100%;justify-content:space-between}.progress{flex:1}.strip>button{padding:7px 8px}.numbers{gap:14px}.number{padding-right:14px}.number strong{font-size:22px}.row-top{gap:8px}.filters input{max-width:140px}}
  `;
  async function request(route, body) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API + route, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
      const data = await response.json();
      if (!response.ok) { const error = new Error(data.message || '기록을 불러오지 못했어요.'); error.status = response.status; error.code = data.error || data.code; throw error; }
      return data;
    } finally { clearTimeout(timer); }
  }
  function summaryLine(summary) {
    const parts = [];
    if (summary.firstScored) parts.push(`처음 맞힘 ${summary.firstCorrect}/${summary.firstScored}`);
    if (summary.retryCount) parts.push(`다시 풀이 ${summary.retryCount}회`);
    if (summary.readCount) parts.push(`열어 본 부분 ${summary.readCount}개`);
    if (summary.selfAssessments) parts.push(`스스로 점검 ${summary.selfAssessments}회`);
    return parts.join(' · ') || '응답 없음';
  }
  // The same unit records feed the pupil's history and the teacher's report.
  const recordRows = sessions => sessions.flatMap(session => session.units?.length
    ? session.units.map(unit => ({ ...session, ...unit, units: undefined })) : [session]);
  function responseText(value) {
    if (value == null) return '—';
    if (typeof value !== 'object') return ({ known: '알고 있어요', unknown: '아직 어려워요', review: '다시 볼래요' }[value] || String(value));
    if (typeof value.text === 'string') return value.text + (typeof value.confidence === 'number' ? ` · 자신감 ${value.confidence}%` : '');
    if (Array.isArray(value)) return value.map(responseText).join(' · ');
    return Object.values(value).map(responseText).join(' · ');
  }
  class RecordClient {
    constructor(activity, options = {}) {
      this.activity = activity; this.options = options; this.session = null; this.pending = 0; this.tail = Promise.resolve();
      this.host = el('learning-records'); this.root = this.host.attachShadow({ mode: 'open' });
      this.root.append(el('style', css));
      const strip = el('section', null, 'strip'); strip.setAttribute('aria-label', '학습 기록');
      const identity = el('div', null, 'identity');
      this.title = el('p', '학습 기록', 'title'); this.status = el('p', '불러오는 중…', 'status'); this.status.setAttribute('role', 'status');
      identity.append(this.title, this.status); this.progress = el('div', null, 'progress');
      const history = el('button', '학습 기록'); history.type = 'button'; history.onclick = () => this.showHistory();
      strip.append(identity, this.progress, history); this.strip = strip;
      if (options.toolbar === false) {
        // Keep recovery dialogs available without adding a box to the activity layout.
        this.host.style.display = 'contents';
        document.body.append(this.host);
      } else {
        this.root.append(strip);
        const target = options.mount || document.querySelector('main') || document.body.firstElementChild;
        if (target?.parentNode) target.before(this.host); else document.body.prepend(this.host);
        // Some activities reset every element's margins, including the shadow host.
        const besideTopControls = this.host.getBoundingClientRect().top + scrollY < 64;
        Object.assign(this.host.style, { display: 'block', width: besideTopControls ? 'calc(100% - 128px)' : '100%', maxWidth: '1180px', margin: '8px auto 10px' });
      }
      window.addEventListener('beforeunload', event => { if (this.pending) { event.preventDefault(); event.returnValue = ''; } });
      this.ready = this.initialize();
    }
    async initialize() {
      let context;
      try { context = await request('/context'); }
      catch (error) {
        if (error.status === 401) context = { mode: 'preview' };
        else context = await this.recover(() => request('/context'), error);
      }
      this.preview = context.mode !== 'student';
      const item = context.catalog?.find(row => row.id === this.activity);
      this.title.textContent = item?.label || this.options.label || '학습 기록';
      this.setStatus(this.preview ? '둘러보기 · 미저장' : '');
      return this;
    }
    setStatus(text, state = '') { this.status.textContent = text; this.status.dataset.state = state; this.status.hidden = !text; }
    addAction(label, handler) {
      const button = el('button', label); button.type = 'button'; button.onclick = handler;
      this.strip.append(button); return button;
    }
    modal(title, className = '') {
      this.dialog?.close(); this.dialog?.remove();
      const dialog = el('dialog', null, className), header = el('div', null, 'dialog-head'), body = el('div', null, 'body');
      const heading = el('h2', title); heading.id = 'record-dialog-heading'; dialog.setAttribute('aria-labelledby', heading.id);
      const close = el('button', '닫기'); close.onclick = () => dialog.close(); header.append(heading, close); dialog.append(header, body); this.root.append(dialog);
      this.dialog = dialog; dialog.showModal(); return { dialog, body, close };
    }
    async recover(operation, error) {
      this.setStatus('저장되지 않음 · 연결을 확인해 주세요', 'error');
      return new Promise(resolve => {
        const { dialog, body, close } = this.modal('기록 연결을 확인해 주세요', 'save-warning');
        close.hidden = true; dialog.addEventListener('cancel', event => event.preventDefault());
        const message = el('p', error.status === 409 ? error.message : '아직 서버에 저장되지 않았어요. 이 화면을 유지하고 다시 시도해 주세요.');
        const retry = el('button', error.status === 409 ? '저장된 진도 다시 불러오기' : '다시 시도', 'primary');
        if ([401, 403].includes(error.status)) message.textContent = '학생 로그인 상태를 확인한 뒤 화면을 다시 불러와 주세요.';
        body.append(message, retry);
        retry.onclick = async () => {
          if ([401, 403, 409].includes(error.status)) { location.reload(); return; }
          retry.disabled = true;
          try { const result = await operation(); dialog.close(); dialog.remove(); resolve(result); }
          catch (next) { error = next; message.textContent = next.status === 409 ? next.message : '연결하지 못했어요. 잠시 후 다시 시도해 주세요.'; retry.disabled = false; }
        };
      });
    }
    async reliable(operation) {
      try { return await operation(); } catch (error) { return this.recover(operation, error); }
    }
    render() {
      const s = this.session; if (!s) return;
      this.title.textContent = this.title.title = s.title;
      this.progress.replaceChildren(el('p', s.status === 'completed' ? '완료' : s.progress.total == null ? '진행 중' : `${s.progress.current} / ${s.progress.total}`));
      if (s.units) {
        const unit = s.units.find(row => row.unit === s.checkpoint?.unit);
        if (unit) {
          this.title.textContent = this.title.title = unit.title;
          this.progress.textContent = `${unit.status === 'completed' ? '단원 완료 · ' : ''}${unit.progress.current} / ${unit.progress.total}`;
        } else this.progress.textContent = `${s.units.filter(row => row.status === 'completed').length}개 단원 완료`;
      }
      this.setStatus(this.preview ? '둘러보기 · 미저장' : '저장 완료');
    }
    async start({ contentKey, title, version = '1', checkpoint = {}, href = location.pathname }) {
      await this.ready; await this.tail;
      if (this.preview) this.session = { id: uid(), activity: this.activity, title, contentKey, contentVersion: version, checkpoint: clone(checkpoint), href,
        status: 'active', revision: 0, progress: { current: 0, total: null }, events: [], summary: { firstScored: 0, retryCount: 0, readCount: 0, selfAssessments: 0 } };
      else {
        this.pending++; this.setStatus('불러오는 중…', 'pending');
        try { this.session = (await this.reliable(() => request('/sessions', { activity: this.activity, contentKey, contentVersion: version, title, href, checkpoint }))).session; }
        finally { this.pending--; }
      }
      const resumeUrl = new URL(location.href); resumeUrl.searchParams.set('record', contentKey);
      history.replaceState(history.state, '', resumeUrl);
      this.render(); return clone(this.session);
    }
    save({ checkpoint, progress, events = [], complete = false }) {
      const change = clone({ checkpoint, progress, events, complete });
      this.pending++;
      this.tail = this.tail.then(async () => {
        const s = this.session;
        if (!s) throw new Error('학습을 시작한 뒤 저장해 주세요.');
        this.setStatus('저장 중…', 'pending');
        if (this.preview) {
          Object.assign(s, { checkpoint: change.checkpoint, progress: change.progress }); s.status = complete ? 'completed' : 'active';
          for (const e of events) s.events.push({ ...e, attemptNumber: s.events.filter(x => x.kind === e.kind && x.questionKey === e.questionKey).length + 1 });
          const first = s.events.filter(e => e.kind === 'answer' && e.attemptNumber === 1 && typeof e.correct === 'boolean');
          s.summary = { firstScored: first.length, firstCorrect: first.filter(e => e.correct).length,
            retryCount: s.events.filter(e => e.kind === 'answer' && e.attemptNumber > 1).length,
            readCount: new Set(s.events.filter(e => e.kind === 'read').map(e => e.questionKey)).size,
            selfAssessments: s.events.filter(e => e.kind === 'self-assessment').length };
        } else {
          const body = { ...change, revision: s.revision, mutationId: uid() };
          this.session = (await this.reliable(() => request(`/sessions/${s.id}/changes`, body))).session;
        }
        this.render(); return clone(this.session);
      }).finally(() => { this.pending--; });
      return this.tail;
    }
    async history(query = '') {
      await this.ready;
      return this.preview ? { sessions: [], nextOffset: null } : request(`/sessions?activity=${encodeURIComponent(this.activity)}${query}`);
    }
    async showHistory() {
      await this.ready;
      const { body } = this.modal('학습 기록');
      const filters = el('div', null, 'filters'), startLabel = el('label', '시작일'), endLabel = el('label', '종료일');
      const from = el('input'), to = el('input'); from.type = to.type = 'date'; from.value = to.value = today(); startLabel.append(from); endLabel.append(to);
      const load = el('button', '조회', 'primary'), all = el('button', '전체 기록'); filters.append(startLabel, endLabel, load, all);
      const list = el('div'); body.append(filters, list); let currentQuery = '';
      const fetchPage = async (offset = 0) => {
        if (!offset) list.replaceChildren(el('p', '불러오는 중…', 'muted'));
        load.disabled = all.disabled = true;
        try {
          const data = await this.history(currentQuery + `&offset=${offset}`);
          if (!offset) list.replaceChildren();
          if (!data.sessions.length && !offset) list.append(el('p', this.preview ? '학생 로그인 필요' : '기록 없음', 'empty'));
          for (const row of recordRows(data.sessions)) {
            const card = el('article', null, 'row'), top = el('div', null, 'row-top'), label = el('div');
            label.append(el('p', date(row.updatedAt), 'muted'), el('h3', row.title));
            top.append(label, el('span', row.status === 'completed' ? '완료' : '진행 중', `badge ${row.status === 'completed' ? 'done' : ''}`));
            card.append(top, el('p', summaryLine(row.summary), 'muted'));
            const actions = el('div', null, 'actions'), detail = el('button', '응답 보기'); detail.onclick = () => this.showDetail(row.id, row.unit);
            actions.append(detail);
            if (row.status === 'active' || row.unit) { const link = el('a', row.status === 'completed' ? '다시 보기' : '이어 하기'); const url = new URL(row.href, location.origin); url.searchParams.set('record', row.contentKey); if (row.unit) url.searchParams.set('unit', row.unit); link.href = url.pathname + url.search; actions.append(link); }
            card.append(actions); list.append(card);
          }
          if (data.nextOffset != null) { const more = el('button', '이전 기록 더 보기'); more.onclick = () => { more.remove(); fetchPage(data.nextOffset); }; list.append(more); }
        } catch (error) { list.replaceChildren(el('p', error.message, 'error')); }
        finally { load.disabled = all.disabled = false; }
      };
      load.onclick = () => { currentQuery = `&from=${from.value}&to=${to.value}`; fetchPage(); };
      all.onclick = () => { currentQuery = ''; fetchPage(); }; load.click();
    }
    async showDetail(id, unit) {
      const { body } = this.modal('학습 응답');
      try {
        const { session } = await request(`/sessions/${id}${unit ? '?unit=' + encodeURIComponent(unit) : ''}`);
        body.append(el('h3', session.title), el('p', summaryLine(session.summary), 'muted'));
        for (const e of session.events) {
          const row = el('div', null, 'detail');
          row.append(el('p', e.snapshot.prompt || e.snapshot.title || e.questionKey), el('pre', responseText(e.response)),
            el('p', e.kind === 'answer' ? `${e.attemptNumber}번째 풀이 · ${e.correct == null ? '채점 없음' : e.correct ? '정답' : '오답'}` : ({ read: '읽기', hint: '도움말 확인', 'self-assessment': '스스로 점검' }[e.kind]), 'muted'));
          body.append(row);
        }
        if (!session.events.length) body.append(el('p', '응답 없음', 'empty'));
      } catch (error) { body.append(el('p', error.message, 'error')); }
    }
    showResult() {
      const s = this.session; if (!s) return;
      const { body } = this.modal('학습 결과');
      body.append(el('h3', s.title)); const numbers = el('div', null, 'numbers');
      const metrics = [[`${s.progress.current}${s.progress.total == null ? '' : '/' + s.progress.total}`, '진행']];
      if (s.summary.firstScored) metrics.push([`${s.summary.firstCorrect || 0}/${s.summary.firstScored}`, '처음 맞힌 문제'], [s.summary.retryCount || 0, '다시 풀이 횟수']);
      else { if (s.summary.readCount) metrics.push([s.summary.readCount, '열어 본 부분']); if (s.summary.selfAssessments) metrics.push([s.summary.selfAssessments, '스스로 점검']); }
      for (const [value, label] of metrics) {
        const box = el('div', null, 'number'); box.append(el('strong', String(value)), el('span', label)); numbers.append(box);
      }
      body.append(numbers);
      if (this.preview) body.append(el('p', '둘러보기 · 미저장', 'muted'));
      const history = el('button', '학습 기록 보기', 'primary'); history.onclick = () => this.showHistory(); body.append(history);
    }
  }
  window.LearningRecords = Object.freeze({ create: (activity, options) => new RecordClient(activity, options), request, summaryLine, responseText, today, recordRows });
})();
