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
    :host{display:block;position:relative;z-index:30;max-width:1080px;margin:64px auto 22px;padding:0 16px;color:#24364b;font:14px/1.55 system-ui,"Malgun Gothic",sans-serif;color-scheme:light}
    *{box-sizing:border-box}button,input,select{font:inherit}button,a{touch-action:manipulation}button{cursor:pointer;border:1px solid #d8e2ec;border-radius:10px;padding:9px 14px;background:#fff;color:#233d5d;font-weight:650}button:hover{background:#edf4fb}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #6d9df2;outline-offset:3px}button:disabled{opacity:.55;cursor:wait}a{color:#245ac0;text-decoration:none}p{margin:0}h2,h3{margin:0;color:#182c45}h2{font-size:23px}h3{font-size:17px}.strip{display:flex;align-items:center;gap:18px;flex-wrap:wrap;background:#fff;border:1px solid #dce5ee;border-radius:16px;padding:15px 18px;box-shadow:0 3px 12px #1c3c5c05}.identity{flex:1;min-width:145px}.eyebrow{color:#61738a;font-size:12px;letter-spacing:.03em;margin-bottom:3px}.title{font-weight:750;font-size:15px}.status{font-size:12px;color:#356e53;margin-top:4px}.status[data-state=error]{color:#ad3428}.status[data-state=pending]{color:#8b6916}.progress{color:#546a82;font-size:13px}.stats{display:flex;gap:12px;margin-top:5px;color:#516176;font-size:12px}.primary{background:#245ac0;color:white;border-color:#245ac0}.primary:hover{background:#18499f}.muted{color:#6c7c8e;font-size:13px}.actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:12px;background:#eef2f6;color:#5d6c7f}.badge.done{background:#e8f4ec;color:#27633d}dialog{padding:0;border:1px solid #d8e2ec;border-radius:20px;box-shadow:0 20px 70px #182c4533;width:min(740px,calc(100vw - 28px));max-height:85dvh;color:#24364b;background:#fafbfd}dialog::backdrop{background:#14273c66}.dialog-head{padding:24px 26px 17px;border-bottom:1px solid #e0e7ef;display:flex;justify-content:space-between;gap:16px;align-items:center}.body{padding:22px 26px}.filters{display:flex;flex-wrap:wrap;gap:10px;align-items:end;margin-bottom:20px}.filters label{display:grid;gap:4px;font-size:12px;color:#62758c}input,select{border:1px solid #ccd9e7;border-radius:8px;background:white;padding:8px;max-width:100%}.row{background:white;border:1px solid #e0e7ef;border-radius:12px;padding:17px;margin:10px 0}.row-top{display:flex;align-items:start;justify-content:space-between;gap:12px}.row h3{margin:5px 0}.row .actions{margin-top:12px}.numbers{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.number{background:white;border:1px solid #e0e7ef;border-radius:12px;padding:15px}.number strong{display:block;font-size:26px;color:#234c83}.number span{font-size:12px;color:#687b93}.empty{padding:40px 16px;text-align:center;color:#65768c;border:1px dashed #cbd8e5;border-radius:14px}.detail{padding:12px 0;border-bottom:1px solid #e0e7ef;overflow-wrap:anywhere}.detail pre{white-space:pre-wrap;font:inherit;margin:5px 0}.error{color:#a83629}.save-warning{max-width:460px}.save-warning p{margin:12px 0 22px}.footnote{margin-top:16px;font-size:12px;color:#6c7c8e}.bar{height:5px;width:130px;background:#e8eef5;border-radius:4px;margin:6px 0}.fill{height:100%;border-radius:4px;background:#3e78c9}
    @media(max-width:560px){:host{padding:0 10px}.strip{gap:10px;padding:13px}.progress{width:100%;order:3}.bar{width:100%}.dialog-head{padding:18px}.body{padding:18px}.numbers{gap:6px}.number{padding:10px}.number strong{font-size:22px}.row-top{flex-wrap:wrap}}
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
    return parts.join(' · ') || '아직 제출한 응답이 없어요';
  }
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
      const identity = el('div', null, 'identity'); identity.append(el('p', '나의 학습', 'eyebrow'));
      this.title = el('p', '기록 연결 중', 'title'); this.status = el('p', '저장된 진도를 확인하고 있어요', 'status'); this.status.setAttribute('role', 'status');
      identity.append(this.title, this.status); this.progress = el('div', null, 'progress');
      const history = el('button', '학습 기록'); history.type = 'button'; history.onclick = () => this.showHistory();
      strip.append(identity, this.progress, history); this.root.append(strip);
      const target = options.mount || document.querySelector('main') || document.body.firstElementChild;
      if (target?.parentNode) target.before(this.host); else document.body.prepend(this.host);
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
      this.setStatus(this.preview ? '둘러보기 · 기록을 저장하려면 학생 계정으로 로그인하세요' : '학생 계정에 연결됨');
      return this;
    }
    setStatus(text, state = '') { this.status.textContent = text; this.status.dataset.state = state; }
    addAction(label, handler) {
      const button = el('button', label); button.type = 'button'; button.onclick = handler;
      this.root.querySelector('.strip').append(button); return button;
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
      this.title.textContent = s.title;
      this.progress.replaceChildren(el('p', s.status === 'completed' ? '학습 완료' : s.progress.total == null ? '진행 중' : `진행 중 · ${s.progress.current} / ${s.progress.total}`));
      if (s.progress.total) { const bar = el('div', null, 'bar'), fill = el('div', null, 'fill'); fill.style.width = `${Math.min(100, 100 * s.progress.current / s.progress.total)}%`; bar.append(fill); this.progress.append(bar); }
      this.progress.append(el('p', summaryLine(s.summary), 'stats'));
      this.setStatus(this.preview ? '둘러보기 · 이 기록은 저장되지 않아요' : '저장 완료 · 다른 기기에서 이어하기 가능');
    }
    async start({ contentKey, title, version = '1', checkpoint = {}, href = location.pathname }) {
      await this.ready; await this.tail;
      if (this.preview) this.session = { id: uid(), activity: this.activity, title, contentKey, contentVersion: version, checkpoint: clone(checkpoint), href,
        status: 'active', revision: 0, progress: { current: 0, total: null }, events: [], summary: { firstScored: 0, retryCount: 0, readCount: 0, selfAssessments: 0 } };
      else {
        this.pending++; this.setStatus('저장된 진도를 불러오는 중', 'pending');
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
        if (!offset) list.replaceChildren(el('p', '기록을 불러오는 중…', 'muted'));
        load.disabled = all.disabled = true;
        try {
          const data = await this.history(currentQuery + `&offset=${offset}`);
          if (!offset) list.replaceChildren();
          if (!data.sessions.length && !offset) list.append(el('p', this.preview ? '학생 계정으로 로그인하면 기록을 볼 수 있어요.' : '이 기간에 저장된 학습 기록이 없어요.', 'empty'));
          for (const row of data.sessions) {
            const card = el('article', null, 'row'), top = el('div', null, 'row-top'), label = el('div');
            label.append(el('p', date(row.updatedAt), 'muted'), el('h3', row.title));
            top.append(label, el('span', row.status === 'completed' ? '완료' : '진행 중', `badge ${row.status === 'completed' ? 'done' : ''}`));
            card.append(top, el('p', summaryLine(row.summary), 'muted'));
            const actions = el('div', null, 'actions'), detail = el('button', '응답 보기'); detail.onclick = () => this.showDetail(row.id);
            actions.append(detail);
            if (row.status === 'active') { const link = el('a', '이어 하기'); const url = new URL(row.href, location.origin); url.searchParams.set('record', row.contentKey); link.href = url.pathname + url.search; actions.append(link); }
            card.append(actions); list.append(card);
          }
          if (data.nextOffset != null) { const more = el('button', '이전 기록 더 보기'); more.onclick = () => { more.remove(); fetchPage(data.nextOffset); }; list.append(more); }
        } catch (error) { list.replaceChildren(el('p', error.message, 'error')); }
        finally { load.disabled = all.disabled = false; }
      };
      load.onclick = () => { currentQuery = `&from=${from.value}&to=${to.value}`; fetchPage(); };
      all.onclick = () => { currentQuery = ''; fetchPage(); }; load.click();
    }
    async showDetail(id) {
      const { body } = this.modal('학습 응답');
      try {
        const { session } = await request(`/sessions/${id}`);
        body.append(el('h3', session.title), el('p', summaryLine(session.summary), 'muted'));
        for (const e of session.events) {
          const row = el('div', null, 'detail');
          row.append(el('p', e.snapshot.prompt || e.snapshot.title || e.questionKey), el('pre', responseText(e.response)),
            el('p', e.kind === 'answer' ? `${e.attemptNumber}번째 풀이 · ${e.correct == null ? '채점 없음' : e.correct ? '정답' : '오답'}` : ({ read: '읽기', hint: '도움말 확인', 'self-assessment': '스스로 점검' }[e.kind]), 'muted'));
          body.append(row);
        }
        if (!session.events.length) body.append(el('p', '아직 제출한 응답이 없어요.', 'empty'));
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
      body.append(numbers, el('p', this.preview ? '둘러보기에서는 기록이 저장되지 않아요.' : '학생 계정에 저장했어요. 학습 기록에서 다시 확인할 수 있어요.', 'muted'));
      const history = el('button', '학습 기록 보기', 'primary'); history.style.marginTop = '18px'; history.onclick = () => this.showHistory(); body.append(history);
    }
  }
  window.LearningRecords = Object.freeze({ create: (activity, options) => new RecordClient(activity, options), request, summaryLine, responseText, today });
})();
