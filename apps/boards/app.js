(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const names = { wall: '자유형', columns: '모둠형', roster: '번호형', quiz: '문제출제형' };
  const reviews = { pending: '검토 대기', approved: '승인 완료', changes: '수정 요청' };
  const statuses = { ready: '시작 전', open: '풀이 중', closed: '풀이 마감', revealed: '정답 공개' };
  const params = new URLSearchParams(location.search);
  let boardId = params.get('id'), setId = params.get('set');
  let data = null, setData = null, editing = null, reviewing = null, approved = [];
  let loading = false, signature = '', setSignature = '', toastTimer;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, fn, className = '') {
    const node = element('button', text, className);
    node.type = 'button';
    node.addEventListener('click', () => run(fn));
    return node;
  }
  function toast(message) {
    $('toast').textContent = message; $('toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5000);
  }
  async function api(path, method = 'GET', body) {
    const res = await fetch('/api/boards' + path, { method, credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    const value = await res.json().catch(() => ({}));
    if (!res.ok) { const error = new Error(value.message || '연결하지 못했어요. 잠시 후 다시 시도해 주세요.'); error.status = res.status; throw error; }
    return value;
  }
  async function run(fn) { try { await fn(); } catch (error) { toast(error.message); } }
  function show(view) { ['entry', 'teacherHome', 'boardView', 'setView'].forEach(id => { $(id).hidden = id !== view; }); }
  function openDialog(id) { $(id).querySelectorAll('.form-error').forEach(n => { n.textContent = ''; }); $(id).showModal(); }
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  function handleForm(id, action) {
    $(id).addEventListener('submit', async event => {
      event.preventDefault();
      const submit = $(id).querySelector('[type=submit]');
      const errorNode = $(id).querySelector('.form-error') || $('joinError');
      errorNode.textContent = ''; submit.disabled = true;
      try { await action(); } catch (error) { errorNode.textContent = error.message; }
      finally { submit.disabled = false; }
    });
  }
  function navigateBoard(id) { location.href = `?id=${encodeURIComponent(id)}`; }
  function historyView() {
    const query = new URLSearchParams({ id: boardId });
    if (setId) query.set('set', setId);
    history.replaceState(null, '', '?' + query);
  }
  $('joinCode').value = (params.get('code') || '').replace(/\D/g, '').slice(0, 6);
  // Existing invitation links remain usable; all newly issued codes have four digits.
  if (/^\d{6}$/.test($('joinCode').value)) { $('joinCode').maxLength = 6; $('joinCode').pattern = '[0-9]{6}'; }
  $('joinCode').addEventListener('input', () => { $('joinCode').value = $('joinCode').value.replace(/\D/g, '').slice(0, $('joinCode').maxLength); });
  handleForm('joinForm', async () => {
    const result = await api('/join', 'POST', { code: $('joinCode').value, number: Number($('joinNumber').value), name: $('joinName').value });
    navigateBoard(result.board.id);
  });

  async function teacherHome() {
    show('teacherHome');
    try {
      const { boards } = await api('/mine');
      $('boardList').replaceChildren();
      if (!boards.length) $('boardList').append(element('p', '게시판 없음', 'empty'));
      boards.forEach(b => {
        const tile = button('', () => navigateBoard(b.id), 'board-tile');
        tile.append(element('span', names[b.layout], 'pill'), element('h2', b.title));
        if (b.description) tile.append(element('span', b.description, 'muted'));
        const footer = element('footer'); footer.append(element('span', `방번호 ${b.code}`), element('span', b.closed ? '글쓰기 마감' : '참여 가능'));
        tile.append(footer); $('boardList').append(tile);
      });
    } catch (error) {
      $('newBoard').disabled = true; $('teacherError').hidden = false;
      $('teacherError').replaceChildren(element('p', error.status === 401 ? '게시판를 만들려면 먼저 선생님 계정으로 로그인해 주세요.' : error.message));
      const login = element('a', '수업 포털에서 로그인'); login.href = '/'; $('teacherError').append(login);
    }
  }
  $('newBoard').addEventListener('click', () => openDialog('createDialog'));
  const selectedLayout = () => document.querySelector('input[name=layout]:checked').value;
  function updateLayout() { $('columnsLabel').hidden = selectedLayout() !== 'columns'; }
  document.querySelectorAll('input[name=layout]').forEach(n => n.addEventListener('change', updateLayout));
  handleForm('createForm', async () => {
    const result = await api('/', 'POST', { title: $('createTitle').value, description: $('createDescription').value,
      layout: selectedLayout(), slots: Number($('createSlots').value), columns: $('createColumns').value.split('\n').map(s => s.trim()).filter(Boolean) });
    navigateBoard(result.board.id);
  });

  function postCard(p) {
    const card = element('article', undefined, 'post' + (p.hidden ? ' is-hidden' : ''));
    card.dataset.postId = p.id;
    const top = element('div', undefined, 'post-top');
    top.append(element('span', p.author));
    if (p.kind !== 'note') top.append(element('span', reviews[p.reviewStatus], `badge ${p.reviewStatus}`));
    if (p.hidden) top.append(element('span', '숨김', 'badge'));
    card.append(top, element('p', p.content, 'post-content'));
    if (p.kind !== 'note') {
      const list = element('ol', undefined, 'choice-list'); p.choices.forEach(choice => list.append(element('li', choice))); card.append(list);
      if (p.answer !== undefined) card.append(element('p', `정답: ${p.choices[p.answer]}${p.explanation ? '\n' + p.explanation : ''}`, 'answer-key'));
      if (p.feedback) card.append(element('p', `선생님의 피드백\n${p.feedback}`, 'feedback'));
    }
    if (p.link) { const a = element('a', '↗ ' + p.link); a.href = p.link; a.target = '_blank'; a.rel = 'noopener noreferrer'; card.append(a); }
    const footer = element('footer');
    const canEdit = data.me.teacher || (p.mine && !data.board.closed && !p.hidden);
    if (canEdit) {
      footer.append(button(p.kind === 'note' ? '수정' : '수정·재제출', () => openPost(p)));
      footer.append(button('삭제', async () => {
        if (!confirm('이 게시물을 삭제할까요? 이미 만든 문제 세트의 내용은 유지됩니다.')) return;
        await api(`/${boardId}/posts/${p.id}`, 'DELETE'); await refresh(true);
      }, 'danger'));
    }
    if (data.me.teacher) {
      footer.append(button(p.hidden ? '다시 표시' : '숨기기', async () => { await api(`/${boardId}/posts/${p.id}`, 'PATCH', { hidden: !p.hidden }); await refresh(true); }));
      if (p.kind !== 'note' && !p.hidden) {
        if (p.reviewStatus !== 'approved') footer.append(button('승인', async () => {
          await api(`/${boardId}/posts/${p.id}/review`, 'POST', { status: 'approved', revision: p.revision });
          toast('승인 완료'); await refresh(true);
        }, 'primary'));
        footer.append(button('수정 요청', () => {
          reviewing = p; $('reviewContent').textContent = p.content; $('reviewFeedback').value = p.feedback || ''; openDialog('reviewDialog');
        }));
      }
    }
    if (footer.childNodes.length) card.append(footer);
    return card;
  }
  function renderPosts() {
    const b = data.board, container = $('posts');
    container.className = 'posts ' + b.layout; container.replaceChildren();
    const filter = $('reviewFilter').value;
    const posts = data.posts.filter(p => b.layout !== 'quiz' || filter === 'all' || (filter === 'mine' ? p.mine : p.reviewStatus === filter));
    if (b.layout === 'columns') {
      b.columns.forEach((name, index) => {
        const col = element('section', undefined, 'column'); const group = posts.filter(p => p.column === index);
        col.append(element('h2', `${name} · ${group.length}`));
        group.forEach(p => col.append(postCard(p)));
        if (!group.length) col.append(element('p', '글 없음', 'empty')); container.append(col);
      });
    } else if (b.layout === 'roster') {
      const teacher = posts.filter(p => p.number === null);
      if (teacher.length) { const intro = element('div', undefined, 'teacher-posts'); teacher.forEach(p => intro.append(postCard(p))); container.append(intro); }
      for (let number = 1; number <= b.slots; number++) {
        const slot = element('section', undefined, 'slot');
        const member = data.members.find(m => m.number === number);
        slot.append(element('h2', `${number}번${member?.name ? ' · ' + member.name : ''}`));
        const group = posts.filter(p => p.number === number);
        group.forEach(p => slot.append(postCard(p)));
        if (!group.length) slot.append(element('p', member ? '미작성' : '미참여', 'empty'));
        container.append(slot);
      }
    } else {
      posts.forEach(p => container.append(postCard(p)));
      if (!posts.length) container.append(element('p', b.layout === 'quiz' ? '문제 없음' : '글 없음', 'empty'));
    }
  }
  function renderBoard() {
    const { board: b, me } = data;
    document.title = `${b.title} · 게시판`;
    $('boardDescription').textContent = b.description;
    $('boardCode').textContent = b.code; $('memberCount').textContent = `참여 ${data.members.length} / ${b.slots}명`;
    $('myIdentity').textContent = me.teacher ? '선생님' : `${me.number}번 ${me.name}`;
    $('shareBoard').hidden = $('settingsBoard').hidden = !me.teacher;
    $('writePost').textContent = b.layout === 'quiz' ? '+ 문제 만들기' : '+ 글 쓰기';
    $('writePost').disabled = !me.teacher && b.closed;
    $('closedNotice').hidden = !b.closed;
    $('quizControls').hidden = b.layout !== 'quiz';
    $('setCount').textContent = data.sets.length;
    $('buildSet').hidden = !me.teacher;
    $('setList').replaceChildren();
    data.sets.forEach(s => {
      const row = element('div', undefined, 'set-row'); const title = element('div');
      title.append(element('strong', s.title), element('small', `${s.count}문항 · ${statuses[s.status]}`));
      row.append(title, button(me.teacher ? '진행·결과 보기' : '문제 풀기', () => openSet(s.id))); $('setList').append(row);
    });
    if (!data.sets.length) $('setList').append(element('p', '문제 세트 없음', 'hint'));
    renderPosts();
  }
  async function refresh(force = false) {
    if (loading || !boardId) return;
    loading = true;
    try {
      const next = await api(`/${boardId}`);
      data = next;
      const nextSignature = JSON.stringify(next);
      if (nextSignature !== signature || force) { signature = nextSignature; renderBoard(); }
      if (setId) {
        const set = await api(`/${boardId}/sets/${setId}`); setData = set;
        const nextSetSignature = JSON.stringify(set);
        if (nextSetSignature !== setSignature || force) { setSignature = nextSetSignature; renderSet(); }
        show('setView');
      } else show('boardView');
      $('syncStatus').textContent = ''; $('syncStatus').classList.remove('error');
    } catch (error) {
      $('syncStatus').textContent = '연결 끊김 · 다시 연결 중'; $('syncStatus').classList.add('error');
      if (!data || [401, 403, 404].includes(error.status)) {
        show('entry'); $('joinError').textContent = error.message;
        if (data) $('joinCode').value = data.board.code;
        boardId = null; setId = null;
      }
      if (force) toast(error.message);
    } finally { loading = false; }
  }
  $('reviewFilter').addEventListener('change', renderPosts);
  function renderChoiceFields(choices) {
    const isOx = $('postKind').value === 'ox';
    $('choiceFields').replaceChildren(); $('postAnswer').replaceChildren();
    const values = isOx ? ['O', 'X'] : choices || ['', '', '', ''];
    values.forEach((choice, index) => {
      const option = element('option', isOx ? choice : `${index + 1}번 보기`); option.value = index; $('postAnswer').append(option);
      if (!isOx) {
        const label = element('label', `${index + 1}번 보기`); const input = document.createElement('input');
        input.className = 'choice-input'; input.value = choice; input.maxLength = 200; input.required = true; label.append(input); $('choiceFields').append(label);
      }
    });
  }
  $('postKind').addEventListener('change', () => renderChoiceFields());
  function openPost(post = null) {
    editing = post;
    const quiz = data.board.layout === 'quiz';
    $('postForm').reset(); $('postDialogTitle').textContent = quiz ? (post ? '문제 수정·재제출' : '문제 출제') : post ? '글 수정' : '글 쓰기';
    $('kindLabel').hidden = $('questionFields').hidden = !quiz; $('linkLabel').hidden = quiz;
    $('postAnswer').required = quiz; $('contentLabel').textContent = quiz ? '문제' : '내용';
    $('postContent').value = post?.content || ''; $('postLink').value = post?.link || '';
    $('postColumnLabel').hidden = data.board.layout !== 'columns' || !!post;
    $('postColumn').replaceChildren(); data.board.columns.forEach((name, i) => { const option = element('option', name); option.value = i; $('postColumn').append(option); });
    $('postColumn').value = post?.column || 0;
    if (quiz) {
      $('postKind').value = post?.kind || 'ox'; renderChoiceFields(post?.choices);
      $('postAnswer').value = post?.answer ?? 0; $('postExplanation').value = post?.explanation || '';
    } else $('choiceFields').replaceChildren();
    $('submitPost').textContent = quiz ? '검토 요청하기' : '글 올리기'; openDialog('postDialog');
  }
  $('writePost').addEventListener('click', () => openPost());
  handleForm('postForm', async () => {
    const quiz = data.board.layout === 'quiz';
    const payload = { content: $('postContent').value, link: quiz ? '' : $('postLink').value, column: Number($('postColumn').value || 0),
      kind: quiz ? $('postKind').value : 'note', revision: editing?.revision };
    if (quiz) Object.assign(payload, { choices: [...document.querySelectorAll('.choice-input')].map(n => n.value), answer: Number($('postAnswer').value), explanation: $('postExplanation').value });
    await api(`/${boardId}/posts${editing ? '/' + editing.id : ''}`, editing ? 'PATCH' : 'POST', payload);
    $('postDialog').close(); toast(quiz ? '검토 요청 완료' : '저장 완료'); await refresh(true);
  });
  handleForm('reviewForm', async () => {
    await api(`/${boardId}/posts/${reviewing.id}/review`, 'POST', { status: 'changes', revision: reviewing.revision, feedback: $('reviewFeedback').value });
    $('reviewDialog').close(); await refresh(true);
  });
  $('shareBoard').addEventListener('click', () => {
    $('shareCode').textContent = data.board.code;
    $('shareQr').src = `/api/boards/${boardId}/qr?v=${data.board.code}`;
    $('shareLink').value = `${location.origin}/boards/?code=${data.board.code}`; openDialog('shareDialog');
  });
  $('copyLink').addEventListener('click', () => run(async () => {
    try { await navigator.clipboard.writeText($('shareLink').value); toast('참여 링크를 복사했어요.'); }
    catch (_) { $('shareLink').select(); toast('링크를 선택했어요. 복사해 주세요.'); }
  }));
  $('settingsBoard').addEventListener('click', () => {
    const b = data.board; $('settingsTitle').value = b.title; $('settingsDescription').value = b.description;
    $('settingsLocked').checked = b.locked; $('settingsClosed').checked = b.closed; $('settingsNames').checked = b.hideNames;
    $('recoveryLink').replaceChildren(); openDialog('settingsDialog');
  });
  handleForm('settingsForm', async () => {
    await api(`/${boardId}`, 'PATCH', { title: $('settingsTitle').value, description: $('settingsDescription').value,
      locked: $('settingsLocked').checked, closed: $('settingsClosed').checked, hideNames: $('settingsNames').checked });
    $('settingsDialog').close(); await refresh(true);
  });
  $('rotateCode').addEventListener('click', () => run(async () => {
    if (!confirm('방번호를 바꾸면 이전 링크와 QR로 새로 입장할 수 없어요. 바꿀까요?')) return;
    await api(`/${boardId}/rotate-code`, 'POST'); await refresh(true); toast(`새 방번호는 ${data.board.code}입니다.`);
  }));
  $('recoverMember').addEventListener('click', () => run(async () => {
    const value = prompt('기기를 바꿀 학생 번호를 입력하세요. 기존 기기의 접속 권한은 해제됩니다.');
    if (value === null) return;
    const result = await api(`/${boardId}/reclaim`, 'POST', { number: Number(value) });
    const link = element('a', `${result.number}번 학생 재입장 링크`);
    link.href = `${location.origin}/boards/#reclaim=${result.ticket}`;
    $('recoveryLink').replaceChildren(element('span', '이 링크를 해당 학생에게만 전달하세요. 한 번만 쓸 수 있습니다. '), link);
  }));
  $('deleteBoard').addEventListener('click', () => run(async () => {
    if (!confirm('이 게시판와 학생 글, 문제 세트, 답안을 모두 삭제할까요? 되돌릴 수 없어요.')) return;
    await api(`/${boardId}`, 'DELETE'); location.href = '?mode=teacher';
  }));
  $('exportBoard').addEventListener('click', () => run(async () => {
    const latest = await api(`/${boardId}`);
    const sets = [];
    for (const s of latest.sets) sets.push(await api(`/${boardId}/sets/${s.id}`));
    const blob = new Blob([JSON.stringify({ ...latest, sets }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = element('a'); a.href = url; a.download = `게시판-${latest.board.code}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('게시판 기록과 문제별 응답 집계를 내려받았어요.');
  }));
  $('buildSet').addEventListener('click', () => {
    approved = data.posts.filter(p => p.kind !== 'note' && p.reviewStatus === 'approved' && !p.hidden);
    $('setName').value = `${data.board.title} · ${data.sets.length + 1}회`;
    $('approvedChoices').replaceChildren();
    approved.forEach(p => {
      const label = element('label', undefined, 'check'); const input = document.createElement('input');
      input.type = 'checkbox'; input.value = p.id; input.checked = true;
      label.append(input, element('span', `${p.author} · ${p.content}`)); $('approvedChoices').append(label);
    });
    if (!approved.length) $('approvedChoices').append(element('p', '승인된 문제 없음', 'empty'));
    openDialog('buildDialog');
  });
  handleForm('buildForm', async () => {
    const selected = [...$('approvedChoices').querySelectorAll('input:checked')].map(n => approved.find(p => p.id === n.value));
    const result = await api(`/${boardId}/sets`, 'POST', { title: $('setName').value, posts: selected.map(p => ({ id: p.id, revision: p.revision })) });
    $('buildDialog').close(); await openSet(result.id);
  });
  async function openSet(id) { setId = id; setSignature = ''; historyView(); await refresh(true); }
  $('backToBoard').addEventListener('click', () => { setId = null; historyView(); show('boardView'); });
  function renderSet() {
    const s = setData;
    $('setTitle').textContent = s.title; $('setStatus').textContent = statuses[s.status];
    $('setControls').replaceChildren(); $('setQuestions').replaceChildren();
    if (data.me.teacher) {
      const transitions = { ready: [['open', '풀이 시작']], open: [['closed', '답안 마감']], closed: [['open', '다시 받기'], ['revealed', '정답·해설 공개']], revealed: [] };
      transitions[s.status].forEach(([status, title]) => $('setControls').append(button(title, async () => {
        if (status === 'revealed' && !confirm('정답과 해설을 공개할까요? 공개 후에는 답안을 다시 받을 수 없어요.')) return;
        await api(`/${boardId}/sets/${setId}`, 'PATCH', { status }); await refresh(true);
      }, 'primary')));
    }
    const answered = s.questions.filter(q => q.myChoice !== undefined).length;
    const correct = s.questions.filter(q => q.myChoice !== undefined && q.myChoice === q.answer).length;
    $('setProgress').textContent = data.me.teacher ? '' :
      s.status === 'ready' ? '시작 대기' : s.status === 'revealed' ? `정답 ${correct} / ${s.questions.length}` :
        `응답 ${answered} / ${s.questions.length}${s.status === 'open' ? ' · 선택 즉시 저장' : ''}`;
    s.questions.forEach((q, index) => {
      const card = element('article', undefined, 'question-card'); card.dataset.questionId = q.id;
      card.append(element('p', `${String(index + 1).padStart(2, '0')} · ${q.kind === 'ox' ? 'OX' : '객관식'}${q.authorNumber ? ' · ' + q.authorNumber + '번 출제' : ''}`, 'eyebrow'), element('h2', q.content));
      const options = element('div', undefined, 'answer-options');
      q.choices.forEach((choice, i) => {
        const option = button(`${i + 1}. ${choice}`, async () => {
          // Disable all choices during the write so rapid clicks cannot race in flight.
          options.querySelectorAll('button').forEach(n => { n.disabled = true; });
          try { await api(`/${boardId}/sets/${setId}/answer`, 'POST', { questionId: q.id, choice: i }); }
          finally { await refresh(true); }
        }, 'answer-option');
        option.setAttribute('aria-pressed', String(q.myChoice === i)); option.disabled = data.me.teacher || s.status !== 'open'; options.append(option);
      });
      card.append(options);
      if (q.myChoice !== undefined) card.append(element('p', `내 답: ${q.choices[q.myChoice]}`, 'hint'));
      if (q.answer !== undefined) card.append(element('p', `정답: ${q.choices[q.answer]}${q.explanation ? '\n' + q.explanation : ''}`, 'question-result ' + (data.me.teacher || q.myChoice === q.answer ? 'correct' : 'incorrect')));
      if (q.results) {
        const results = element('div', undefined, 'results');
        results.append(element('p', `응답 ${q.results.total}명 · 정답 ${q.results.correct}명`));
        q.choices.forEach((choice, i) => results.append(element('p', `${i + 1}. ${choice} — ${q.results.counts[i]}명`))); card.append(results);
      }
      $('setQuestions').append(card);
    });
  }
  async function init() {
    if (location.hash.startsWith('#reclaim=')) {
      const ticket = location.hash.slice('#reclaim='.length); history.replaceState(null, '', location.pathname);
      try { const result = await api('/reclaim/join', 'POST', { ticket }); navigateBoard(result.board.id); }
      catch (error) { $('joinError').textContent = error.message; }
    } else if (boardId) await refresh(true);
    else if (params.get('mode') === 'teacher') await teacherHome();
  }
  setInterval(() => { if (boardId && !document.hidden) void refresh(); }, 3000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && boardId) void refresh(); });
  void init();
})();
