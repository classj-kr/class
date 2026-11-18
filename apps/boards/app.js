(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const names = { wall: '자유형', columns: '모둠형', roster: '번호형', quiz: '문제출제형', stacking: '쌓기나무 문제은행' };
  const reviews = { pending: '검토 대기', approved: '승인 완료', changes: '수정 요청' };
  const statuses = { ready: '시작 전', open: '풀이 중', closed: '풀이 마감', revealed: '정답 공개' };
  const params = new URLSearchParams(location.search);
  let boardId = params.get('id'), setId = params.get('set');
  let data = null, setData = null, editing = null, reviewing = null, approved = [];
  let loading = false, signature = '', setSignature = '', toastTimer;
  const pendingLikes = new Set();
  let likesEpoch = 0;
  const commentPanels = new Map();

  function commentForm(value, label, save, cancel) {
    const form = element('form', undefined, 'comment-form');
    const input = element('textarea'); input.maxLength = 500; input.rows = 2; input.required = true;
    input.value = value; input.placeholder = '댓글 쓰기'; input.setAttribute('aria-label', label === '저장' ? '댓글 수정' : '댓글 쓰기');
    const actions = element('div', undefined, 'comment-actions');
    const submit = element('button', label); submit.type = 'submit'; actions.append(submit);
    if (cancel) actions.append(button('취소', cancel));
    const error = element('p', '', 'error'); error.setAttribute('role', 'alert');
    input.addEventListener('input', () => { error.textContent = ''; });
    form.append(input, actions, error);
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (submit.disabled) return;
      error.textContent = ''; submit.disabled = true; input.readOnly = true;
      try { await save(input.value); } catch (e) { error.textContent = e.message; }
      finally { submit.disabled = false; input.readOnly = false; }
    });
    return { form, input, submit };
  }
  async function changeComment(s, path, method, body) {
    if (s.busy) throw new Error('저장 중이에요. 잠시만 기다려 주세요.');
    s.busy = true; s.epoch++; likesEpoch++;
    try { return await api(s.route + path, method, body); }
    finally { s.busy = false; s.epoch++; likesEpoch++; signature = ''; }
  }
  function renderCommentList(s) {
    if (s.editing) return;
    s.list.replaceChildren();
    if (!s.comments.length) s.list.append(element('p', '댓글 없음', 'hint'));
    for (const c of s.comments) {
      const row = element('article', undefined, 'comment'); row.dataset.commentId = c.id;
      const meta = element('div', undefined, 'comment-meta'); meta.append(element('span', c.author));
      if (c.edited) meta.append(element('span', '수정됨', 'muted'));
      const content = element('p', c.content, 'comment-content');
      const actions = element('div', undefined, 'comment-actions');
      if (c.canEdit) actions.append(button('수정', () => {
        if (s.busy) return;
        s.editing = c.id;
        const editor = commentForm(c.content, '저장', async value => {
          await changeComment(s, '/' + c.id, 'PATCH', { content: value, revision: c.revision });
          s.editing = null; await loadComments(s);
        }, () => { s.editing = null; renderCommentList(s); });
        content.replaceWith(editor.form); actions.hidden = true; editor.input.focus();
      }));
      if (c.canDelete) actions.append(button('삭제', async () => {
        if (s.busy || !confirm('이 댓글을 삭제할까요?')) return;
        await changeComment(s, '/' + c.id, 'DELETE'); await loadComments(s);
      }, 'danger'));
      row.append(meta, content, actions); s.list.append(row);
    }
  }
  async function loadComments(s) {
    if (s.loading || s.busy || !s.open || !s.panel.isConnected) return;
    s.loading = true; const epoch = s.epoch;
    try {
      const result = await api(s.route);
      if (epoch !== s.epoch || !s.panel.isConnected) return;
      s.notice.textContent = '';
      const changed = JSON.stringify(s.comments) !== JSON.stringify(result.comments);
      s.comments = result.comments;
      // Keep displayed author names in sync without replacing an active editor.
      for (const row of s.list.querySelectorAll('.comment')) {
        const current = s.comments.find(c => c.id === row.dataset.commentId);
        if (current) row.querySelector('.comment-meta span').textContent = current.author;
      }
      s.toggle.textContent = `댓글 ${s.comments.length}`;
      if (changed || !s.list.childNodes.length) renderCommentList(s);
    } catch (e) {
      s.notice.textContent = e.message;
      if ([401, 403, 404].includes(e.status)) { s.list.replaceChildren(); s.editing = null; }
    } finally { s.loading = false; }
  }
  function commentsFor(p) {
    let s = commentPanels.get(p.id);
    if (!s) {
      s = { route: `/${boardId}/posts/${p.id}/comments`, open: false, comments: [], epoch: 0 };
      s.panel = element('section', undefined, 'comments-panel'); s.panel.id = `comments-${p.id}`;
      s.list = element('div', undefined, 'comment-list');
      s.notice = element('p', '', 'error'); s.notice.setAttribute('role', 'status');
      s.composer = commentForm('', '등록', async value => {
        await changeComment(s, '', 'POST', { content: value }); s.composer.input.value = ''; await loadComments(s);
      });
      s.panel.append(s.list, s.notice, s.composer.form); commentPanels.set(p.id, s);
    }
    s.toggle = button(`댓글 ${p.commentCount}`, async () => {
      s.open = !s.open; s.panel.hidden = !s.open; s.toggle.setAttribute('aria-expanded', String(s.open));
      if (s.open) await loadComments(s);
    }, 'comments-toggle');
    s.toggle.setAttribute('aria-controls', s.panel.id); s.toggle.setAttribute('aria-expanded', String(s.open));
    s.panel.hidden = !s.open;
    s.composer.form.hidden = data.board.closed && !data.me.teacher;
    if (s.composer.form.hidden && s.editing) { s.editing = null; s.list.replaceChildren(); }
    return s;
  }

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
  function show(view) {
    ['entry', 'teacherHome', 'boardView', 'setView'].forEach(id => { $(id).hidden = id !== view; });
    if (view === 'entry' || view === 'teacherHome') applyTheme('default');
  }
  const DARK_THEMES = ['space', 'ocean', 'forest', 'snow', 'sunset'];
  function applyTheme(theme) {
    const name = window.boardBackdrop?.themes.includes(theme) ? theme : 'default';
    [...document.body.classList].filter(c => c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
    if (name !== 'default') document.body.classList.add('theme-' + name);
    document.body.classList.toggle('theme-dark', DARK_THEMES.includes(name));
    window.boardBackdrop?.set(name === 'default' ? null : name);
  }
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
  function navigateBoard(id, replace = false) {
    const target = `?id=${encodeURIComponent(id)}`;
    if (replace) location.replace(target); else location.href = target;
  }
  function navigateRace(id) { location.href = `live.html?id=${encodeURIComponent(boardId)}&game=${encodeURIComponent(id)}`; }
  let raceSetId = null;
  function openRaceSetup(set = null) {
    if (data?.live) return navigateRace(data.live.id);
    raceSetId = set;
    $('raceForm').reset();
    openDialog('raceDialog');
  }
  $('resumeRace').addEventListener('click', () => { if (data?.live) navigateRace(data.live.id); });
  $('artQuiz').addEventListener('click', () => openRaceSetup());
  handleForm('raceForm', async () => {
    const settings = { seconds: $('raceSeconds').valueAsNumber, duration: Number($('raceDuration').value),
      teamCount: Number($('raceTeamCount').value) || null };
    const result = raceSetId
      ? await api(`/${boardId}/races`, 'POST', { ...settings, setId: raceSetId })
      : await api(`/${boardId}/art-quiz`, 'POST', settings);
    navigateRace(result.id);
  });
  function historyView() {
    const query = new URLSearchParams({ id: boardId });
    if (setId) query.set('set', setId);
    history.replaceState(null, '', '?' + query);
  }
  $('joinCode').value = (params.get('code') || '').replace(/\D/g, '').slice(0, 6);
  // Both typed legacy codes and invitation links must remain usable.
  $('joinCode').addEventListener('input', () => { $('joinCode').value = $('joinCode').value.replace(/\D/g, '').slice(0, $('joinCode').maxLength); });
  let identityReady;
  function prepareEntry() {
    if (!identityReady) identityReady = api('/identity').then(({ recognized }) => {
      $('joinIdentityFields').hidden = recognized;
      $('joinNumber').disabled = $('joinName').disabled = recognized;
      return recognized;
    }).catch(error => { identityReady = null; throw error; });
    return identityReady;
  }
  async function joinBoard(replace = false) {
    const recognized = await prepareEntry();
    if (!$('joinForm').reportValidity()) return;
    const body = { code: $('joinCode').value };
    if (!recognized) { body.number = Number($('joinNumber').value); body.name = $('joinName').value; }
    const result = await api('/join', 'POST', body);
    navigateBoard(result.board.id, replace);
  }
  handleForm('joinForm', () => joinBoard());

  // 선생님이 내 학급·그룹에 공개한 게시판. 누르면 방번호 없이 들어간다.
  async function studentHome() {
    show('teacherHome');
    $('newBoard').closest('.section-head').hidden = true;
    $('boardList').replaceChildren();
    try {
      const res = await fetch('/api/student/class-dashboard/boards', { credentials: 'same-origin', cache: 'no-store' });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.message || '게시판을 불러오지 못했어요.');
      const boards = result.boards || [];
      if (!boards.length) $('boardList').append(element('p', '게시판 없음', 'empty'));
      boards.forEach(b => {
        const tile = button('', () => { location.href = b.href; }, 'board-tile');
        tile.append(element('h2', b.title));
        $('boardList').append(tile);
      });
    } catch (error) {
      $('teacherError').hidden = false;
      $('teacherError').replaceChildren(element('p', error.message));
    }
  }
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
        tile.append(footer);
        const card = element('div', undefined, 'board-card');
        const remove = button('삭제', async () => {
          if (!confirm(`‘${b.title}’ 게시판을 삭제할까요? 학생 글·그림·댓글·문제가 모두 지워지고 되돌릴 수 없어요.`)) return;
          remove.disabled = true;
          try { await api(`/${b.id}`, 'DELETE'); }
          catch (error) { if (error.status !== 404) { remove.disabled = false; throw error; } }
          card.remove(); toast('게시판을 삭제했어요.');
          if (!$('boardList').querySelector('.board-card')) $('boardList').append(element('p', '게시판 없음', 'empty'));
        }, 'board-delete danger');
        remove.setAttribute('aria-label', `${b.title} 삭제`);
        const rename = button('이름 바꾸기', async () => {
          const title = prompt('새 게시판 이름 (80자까지)', b.title);
          if (title === null || !title.trim() || title.trim() === b.title) return;
          await api(`/${b.id}`, 'PATCH', { title: title.trim() });
          b.title = title.trim(); tile.querySelector('h2').textContent = b.title;
          remove.setAttribute('aria-label', `${b.title} 삭제`); toast('이름을 바꿨어요.');
        }, 'board-rename');
        const actions = element('div', undefined, 'board-actions'); actions.append(rename, remove);
        card.append(tile, actions); $('boardList').append(card);
      });
    } catch (error) {
      $('newBoard').disabled = true; $('teacherError').hidden = false;
      $('teacherError').replaceChildren(element('p', error.status === 401 ? '게시판를 만들려면 먼저 선생님 계정으로 로그인해 주세요.' : error.message));
      const login = element('a', '수업 포털에서 로그인'); login.href = '/'; $('teacherError').append(login);
    }
  }
  // 공개 대상은 선생님 첫 화면의 학급·그룹 카드와 같은 목록이다.
  let audienceOptions;
  function loadAudienceOptions() {
    audienceOptions ||= fetch('/api/teacher/groups', { credentials: 'same-origin', cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error('groups'); return res.json(); })
      .then(result => result.groups || [])
      .catch(() => { audienceOptions = null; return []; });
    return audienceOptions;
  }
  const audienceLabel = g => g.group_type === 'homeroom' && g.grade && g.class_number ? `${g.grade}학년 ${g.class_number}반` : g.group_name;
  async function showAudience(id, isChosen) {
    const groups = await loadAudienceOptions();
    $(id).querySelector('.audience-list').replaceChildren(...groups.map(group => {
      const input = document.createElement('input');
      input.type = 'checkbox'; input.value = String(group.id); input.checked = isChosen(group);
      const label = element('label', undefined, 'check');
      label.append(input, document.createTextNode(audienceLabel(group)));
      return label;
    }));
    $(id).hidden = groups.length === 0;
  }
  // 목록을 못 받았으면 보내지 않아 저장된 대상을 지우지 않는다.
  const chosenAudience = id => $(id).hidden ? undefined : [...$(id).querySelectorAll('input:checked')].map(input => input.value);
  $('newBoard').addEventListener('click', () => run(async () => {
    await showAudience('createAudience', group => group.auto_homeroom === true);
    openDialog('createDialog');
  }));
  const selectedLayout = () => document.querySelector('input[name=layout]:checked').value;
  function updateLayout() { $('columnsLabel').hidden = selectedLayout() !== 'columns'; }
  document.querySelectorAll('input[name=layout]').forEach(n => n.addEventListener('change', updateLayout));
  handleForm('createForm', async () => {
    const result = await api('/', 'POST', { title: $('createTitle').value, description: $('createDescription').value,
      layout: selectedLayout(), columns: $('createColumns').value.split('\n').map(s => s.trim()).filter(Boolean), audience: chosenAudience('createAudience') });
    navigateBoard(result.board.id);
  });

  function likeButton(p) {
    const heart = element('span', undefined, 'heart-icon');
    heart.setAttribute('aria-hidden', 'true');
    const count = element('span');
    const update = () => {
      heart.textContent = p.likes.liked ? '♥' : '♡';
      count.textContent = p.likes.count;
      control.setAttribute('aria-pressed', String(p.likes.liked));
      control.setAttribute('aria-label', `공감${p.likes.liked ? ' 취소' : ''}, ${p.likes.count}개`);
    };
    const control = button('', async () => {
      if (pendingLikes.has(p.id)) return;
      pendingLikes.add(p.id); likesEpoch++; control.disabled = true;
      try {
        p.likes = await api(`/${boardId}/posts/${p.id}/like`, 'PUT', { liked: !p.likes.liked });
        update();
        if (p.likes.liked) {
          heart.classList.remove('heart-pop'); void heart.offsetWidth; heart.classList.add('heart-pop');
        }
      } finally {
        pendingLikes.delete(p.id); likesEpoch++; signature = ''; control.disabled = false;
      }
    }, 'like-button');
    control.disabled = pendingLikes.has(p.id);
    control.append(heart, count); update();
    return control;
  }
  function postCard(p) {
    const card = element('article', undefined, 'post' + (p.hidden ? ' is-hidden' : ''));
    card.dataset.postId = p.id;
    const top = element('div', undefined, 'post-top');
    top.append(element('span', p.author));
    if (p.kind !== 'note') top.append(element('span', reviews[p.reviewStatus], `badge ${p.reviewStatus}`));
    if (p.hidden) top.append(element('span', '숨김', 'badge'));
    card.append(top);
    if (p.image) {
      const src = `/api/boards/${encodeURIComponent(boardId)}/images/${encodeURIComponent(p.image)}`;
      const link = element('a', undefined, 'post-image-link'); link.href = src; link.target = '_blank'; link.rel = 'noopener';
      const img = element('img', undefined, 'post-image'); img.src = src; img.alt = p.content; img.loading = 'lazy'; img.decoding = 'async';
      link.append(img); card.append(link);
    }
    card.append(element('p', p.content, 'post-content'));
    if (p.song) {
      // 음악 만들기 곡: 작곡판을 그대로 연다(듣고, 고쳐 보고, 내 곡 칸에 담을 수 있다).
      const open = element('a', '🎵 음악 만들기에서 열기', 'post-song-link');
      open.href = `/learning/arts/beat-maker/?board=${encodeURIComponent(boardId)}&song=${encodeURIComponent(p.song)}`;
      open.target = '_blank'; open.rel = 'noopener';
      card.append(open);
    }
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
    if (p.image && p.mine && !data.me.teacher && !p.hidden && !data.board.closed) {
      footer.append(button(p.decoys?.length ? '🎯 제목 퀴즈 수정' : '🎯 제목 퀴즈 내기', () => openDecoys(p), 'decoy-button'));
    }
    const comments = p.commentCount !== undefined && data.board.commentsEnabled ? commentsFor(p) : null;
    if (comments) footer.append(comments.toggle);
    if (p.likes && data.board.likesEnabled) footer.append(likeButton(p));
    if (footer.childNodes.length) card.append(footer);
    if (comments) card.append(comments.panel);
    return card;
  }
  function renderPosts() {
    const focused = document.activeElement;
    const restore = focused?.matches('.comments-panel textarea') ? [focused.selectionStart, focused.selectionEnd] : null;
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
      // Numbers are free-form (e.g. 1~15 and 51~65), so list only students who joined or posted.
      const numbers = [...new Set([...data.members.map(m => m.number), ...posts.map(p => p.number).filter(n => n !== null)])].sort((a, z) => a - z);
      numbers.forEach(number => {
        const slot = element('section', undefined, 'slot');
        const member = data.members.find(m => m.number === number);
        slot.append(element('h2', `${number}번${member?.name ? ' · ' + member.name : ''}`));
        const group = posts.filter(p => p.number === number);
        group.forEach(p => slot.append(postCard(p)));
        if (!group.length) slot.append(element('p', '미작성', 'empty'));
        container.append(slot);
      });
      if (!numbers.length) container.append(element('p', '참여한 학생 없음', 'empty'));
    } else {
      posts.forEach(p => container.append(postCard(p)));
      if (!posts.length) container.append(element('p', b.layout === 'quiz' ? '문제 없음' : '글 없음', 'empty'));
    }
    if (restore && focused.isConnected) { focused.focus({ preventScroll: true }); focused.setSelectionRange(...restore); }
  }
  function renderBoard() {
    const { board: b, me } = data;
    document.title = `${b.title} · 게시판`;
    applyTheme(b.theme);
    $('boardDescription').textContent = b.description;
    $('boardCode').textContent = b.code; $('memberCount').textContent = `참여 ${data.members.length}명`;
    $('myIdentity').textContent = me.teacher ? '선생님' : `${me.number}번 ${me.name}`;
    $('shareBoard').hidden = $('settingsBoard').hidden = !me.teacher;
    $('artQuiz').hidden = !me.teacher || b.layout === 'quiz' || !data.posts.some(p => p.image && p.number !== null && !p.hidden);
    $('artQuiz').textContent = data.live ? '🎨 진행 중인 순위전으로' : '🎨 작품 순위전';
    $('writePost').textContent = b.layout === 'quiz' ? '+ 문제 만들기' : '+ 글 쓰기';
    $('writePost').disabled = !me.teacher && b.closed;
    $('closedNotice').hidden = !b.closed;
    $('quizControls').hidden = b.layout !== 'quiz';
    $('setCount').textContent = data.sets.length;
    $('setDetails').hidden = !me.teacher;
    $('reviewFilter').options[0].textContent = me.teacher ? '전체 문제' : '내 문제';
    $('resumeRace').hidden = !data.live;
    $('buildSet').hidden = !me.teacher;
    $('setList').replaceChildren();
    data.sets.forEach(s => {
      const row = element('div', undefined, 'set-row'); const title = element('div');
      title.append(element('strong', s.title), element('small', `${s.count}문항 · ${statuses[s.status]}`));
      row.append(title, button('문제 확인', () => openSet(s.id)), button('순위전 시작', () => openRaceSetup(s.id), 'primary')); $('setList').append(row);
    });
    if (!data.sets.length) $('setList').append(element('p', '문제 세트 없음', 'hint'));
    renderPosts();
  }
  async function refresh(force = false) {
    if (loading || !boardId || pendingLikes.size) return;
    loading = true;
    const epoch = likesEpoch;
    try {
      const next = await api(`/${boardId}`);
      if (epoch !== likesEpoch) return;
      data = next;
      if (data.board.layout === 'stacking') { location.replace(`/learning/literacy-numeracy/math-tools/stacking-cubes/coop/?id=${encodeURIComponent(boardId)}`); return; }
      if (!data.me.teacher && data.live) { navigateRace(data.live.id); return; }
      if (!data.me.teacher && setId) { setId = null; historyView(); }
      const nextSignature = JSON.stringify(next);
      if (nextSignature !== signature || force) { signature = nextSignature; renderBoard(); }
      for (const s of commentPanels.values()) if (s.open && s.panel.isConnected) void loadComments(s);
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
        await prepareEntry().catch(() => {});
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
    $('imageLabel').hidden = quiz || !!post;
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
  let decoyPost = null;
  function openDecoys(p) {
    decoyPost = p;
    $('decoyTitle').textContent = `「${p.content}」`;
    document.querySelectorAll('.decoy-input').forEach((input, i) => { input.value = p.decoys?.[i] || ''; });
    $('clearDecoys').hidden = !p.decoys?.length;
    openDialog('decoyDialog');
  }
  handleForm('decoyForm', async () => {
    const decoys = [...document.querySelectorAll('.decoy-input')].map(n => n.value);
    await api(`/${boardId}/posts/${decoyPost.id}/decoys`, 'PUT', { decoys });
    $('decoyDialog').close(); toast('제목 퀴즈를 저장했어요.'); await refresh(true);
  });
  $('clearDecoys').addEventListener('click', () => run(async () => {
    await api(`/${boardId}/posts/${decoyPost.id}/decoys`, 'PUT', { decoys: [] });
    $('decoyDialog').close(); toast('제목 퀴즈를 뺐어요.'); await refresh(true);
  }));
  const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
  // Big photos are shrunk to WebP; GIFs keep their animation, so only size is checked.
  async function prepareImage(file) {
    if (file.type === 'image/gif') {
      if (file.size > MAX_IMAGE_BYTES) throw new Error('GIF는 3MB까지 올릴 수 있어요.');
      return file;
    }
    if (file.size <= 1024 * 1024) return file;
    const bitmap = await createImageBitmap(file).catch(() => { throw new Error('그림 파일을 열 수 없어요.'); });
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
    if (!blob || blob.size > MAX_IMAGE_BYTES) throw new Error('그림이 너무 커요. 더 작은 그림을 골라 주세요.');
    return blob;
  }
  async function uploadImage(file) {
    const blob = await prepareImage(file);
    const res = await fetch(`/api/boards/${encodeURIComponent(boardId)}/images`, { method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': blob.type || 'application/octet-stream' }, body: blob, signal: AbortSignal.timeout(60000) });
    const value = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(res.status === 413 ? '그림은 3MB까지 올릴 수 있어요.' : value.message || '그림을 올리지 못했어요.');
    return value.id;
  }
  handleForm('postForm', async () => {
    const quiz = data.board.layout === 'quiz';
    const payload = { content: $('postContent').value, link: quiz ? '' : $('postLink').value, column: Number($('postColumn').value || 0),
      kind: quiz ? $('postKind').value : 'note', revision: editing?.revision };
    if (quiz) Object.assign(payload, { choices: [...document.querySelectorAll('.choice-input')].map(n => n.value), answer: Number($('postAnswer').value), explanation: $('postExplanation').value });
    const file = !quiz && !editing ? $('postImage').files[0] : null;
    if (file) payload.image = await uploadImage(file);
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
  $('settingsBoard').addEventListener('click', () => run(async () => {
    const b = data.board; $('settingsTitle').value = b.title; $('settingsDescription').value = b.description;
    $('settingsLocked').checked = b.locked; $('settingsClosed').checked = b.closed; $('settingsNames').checked = b.hideNames;
    // 없앤 설정이다. 예전에 켜 둔 게시판만 끌 수 있게 보여 준다.
    $('settingsLockedLabel').hidden = !b.locked; $('settingsNamesLabel').hidden = !b.hideNames;
    $('settingsLikes').checked = b.likesEnabled; $('settingsLikesLabel').hidden = b.layout === 'quiz';
    $('settingsComments').checked = b.commentsEnabled; $('settingsCommentsLabel').hidden = b.layout === 'quiz';
    $('settingsTheme').value = b.theme || 'default';
    const audience = data.audience || [];
    await showAudience('settingsAudience', group => audience.includes(String(group.id)));
    openDialog('settingsDialog');
  }));
  handleForm('settingsForm', async () => {
    await api(`/${boardId}`, 'PATCH', { title: $('settingsTitle').value, description: $('settingsDescription').value, audience: chosenAudience('settingsAudience'),
      locked: $('settingsLocked').checked, closed: $('settingsClosed').checked, hideNames: $('settingsNames').checked, likesEnabled: $('settingsLikes').checked, commentsEnabled: $('settingsComments').checked, theme: $('settingsTheme').value });
    $('settingsDialog').close(); await refresh(true);
  });
  $('deleteBoard').addEventListener('click', () => run(async () => {
    if (!confirm('이 게시판와 학생 글, 문제 세트, 답안을 모두 삭제할까요? 되돌릴 수 없어요.')) return;
    await api(`/${boardId}`, 'DELETE'); location.href = '?mode=teacher';
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
      $('setControls').append(button('순위전 시작', () => openRaceSetup(s.id), 'primary'));
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
    else if (params.get('mode') === 'student') await studentHome();
    else {
      try {
        const recognized = await prepareEntry();
        if (recognized && /^(?:\d{4}|\d{6})$/.test($('joinCode').value)) await joinBoard(true);
      } catch (error) { $('joinError').textContent = error.message; }
    }
  }
  setInterval(() => { if (boardId && !document.hidden) void refresh(); }, 3000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && boardId) void refresh(); });
  void init();
})();
