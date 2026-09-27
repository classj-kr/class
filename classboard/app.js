const API_BASE = '/api';

// 홈 화면에 깔아 두고 쓰는 학부모가 있다. 껍데기만이라도 캐시에 둔다.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/classboard/sw.js')
        .catch(error => console.error('SW 등록 실패', error));
}

// DOM Elements
const userInfoEl = document.getElementById('userInfo');
const composerSection = document.getElementById('composerSection');
const postContentInput = document.getElementById('postContent');
const postSubmitBtn = document.getElementById('postSubmitBtn');
const feedSection = document.getElementById('feedSection');
const postTemplate = document.getElementById('postTemplate');
const commentTemplate = document.getElementById('commentTemplate');

const boardPickerSection = document.getElementById('boardPickerSection');
const filterSection = document.getElementById('filterSection');
const composerTargetEl = document.getElementById('composerTarget');

let currentUser = null;
let boards = [];
// 알림을 눌러 들어오면 주소에 그 게시판이 적혀 있다(?board=class:12).
let activeBoardKey = new URLSearchParams(location.search).get('board');
let canPost = false;
// 과목별 보기. null이면 전체.
let activeSubjectFilter = null;
// 종류별 보기: null(전체) | 'post'(알림장) | 'notice'(가정통신문) | 'todo'(할 일)
let activeKindFilter = null;
let loadedPosts = [];
// 같은 흐름에 함께 서는 가정통신문. 학급 게시판에만 있다.
let loadedNotices = [];
// 'student' | 'guardian' | 'teacher'. 무엇을 누를 수 있는지가 여기서 갈린다.
let viewerRole = 'student';

// Utility: Autolink URL conversion
function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Escape HTML first to prevent XSS
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
        
    return escapedText.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Fetch current user and setup UI
async function initApp() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`);
        const data = await res.json();
        if (!data.signedIn) {
            window.location.href = '/';
            return;
        }

        currentUser = data.user;
        // 보호자 계정은 명단에 자녀가 걸려 있는 사람이다. role 만으로는 못 가른다.
        const hasChildren = Array.isArray(data.guardianChildren) && data.guardianChildren.length > 0;
        viewerRole = data.isTeacher ? 'teacher' : (hasChildren && !data.membership ? 'guardian' : 'student');

        // Setup Header
        userInfoEl.textContent = '';
        const roleLabel = { teacher: '교사', guardian: '학부모', student: '학생' }[viewerRole];
        const nameLabel = document.createElement('span');
        nameLabel.textContent = `${currentUser.name} (${roleLabel})`;
        userInfoEl.appendChild(nameLabel);
        if (viewerRole === 'guardian') {
            // 결석계·체험학습 같은 서류는 아직 학부모 쪽 화면에 있다.
            const formsLink = document.createElement('a');
            formsLink.href = '/notice/';
            formsLink.className = 'settings-link';
            formsLink.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">description</span> 서류 내기';
            userInfoEl.appendChild(formsLink);
        }
        if (viewerRole === 'student') {
            const settingsLink = document.createElement('a');
            settingsLink.href = '/classtools/profile.html';
            settingsLink.className = 'settings-link';
            settingsLink.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">settings</span> 내 정보 설정';
            userInfoEl.appendChild(settingsLink);
        }
        if (viewerRole === 'teacher') {
            // 여기서 쓰는 글은 자기 반·그룹 게시판에 붙는다. 전교나 동아리처럼
            // 고른 사람에게 보내는 가정통신문은 발송 화면에서 낸다.
            const sendLink = document.createElement('a');
            sendLink.href = '/teacher/';
            sendLink.className = 'settings-link';
            sendLink.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">send</span> 가정통신문 보내기';
            userInfoEl.appendChild(sendLink);
        }
        setupPushToggle();

        await loadBoards();
        loadPosts();
    } catch (e) {
        console.error('Failed to init app', e);
        feedSection.innerHTML = '<div class="loader">오류가 발생했습니다.</div>';
    }
}

// ── 휴대폰 알림 켜기·끄기 ──
// 학생·보호자만 받는다. 교사는 알림장을 쓰는 쪽이다.
// 아이폰·아이패드는 이 화면을 홈 화면에 깔아야만 알림을 받을 수 있다(사파리 탭에서는
// 알림 기능 자체가 없다). 그래서 단추는 두고, 누르면 까는 법을 알려 준다.
const PUSH_SUPPORTED = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const IS_APPLE_MOBILE = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function base64UrlToBytes(value) {
    const padded = (value + '==='.slice((value.length + 3) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function sendSubscription(sub) {
    const res = await fetch(`${API_BASE}/push/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
    });
    if (!res.ok) throw new Error('구독 저장 실패');
}

function setupPushToggle() {
    if (viewerRole === 'teacher') return;
    if (!PUSH_SUPPORTED && !IS_APPLE_MOBILE) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'push-toggle';
    let subscribed = false;
    const render = () => {
        btn.classList.toggle('on', subscribed);
        btn.setAttribute('aria-pressed', String(subscribed));
        const label = subscribed ? '알림 받는 중' : '알림 받기';
        btn.title = subscribed ? '이 기기로 알림장 알림을 받고 있습니다. 누르면 끕니다.' : '새 알림장이 오면 이 기기로 알려 줍니다.';
        btn.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${subscribed ? 'notifications_active' : 'notifications'}</span><span class="push-toggle-text">${label}</span>`;
        btn.setAttribute('aria-label', label);
    };
    render();
    userInfoEl.appendChild(btn);

    // 이미 켜 둔 기기면 주소를 서버에 다시 알린다. 같은 기기에 다른 식구가 로그인했으면
    // 이때 받는 사람이 지금 사람으로 바뀐다.
    if (PUSH_SUPPORTED && Notification.permission === 'granted') {
        navigator.serviceWorker.ready
            .then(reg => reg.pushManager.getSubscription())
            .then(sub => {
                if (!sub) return;
                subscribed = true;
                render();
                return sendSubscription(sub);
            })
            .catch(e => console.error('알림 상태 확인 실패', e));
    }

    btn.addEventListener('click', async () => {
        if (!PUSH_SUPPORTED) {
            alert(navigator.standalone
                // 홈 화면에서 열었는데도 없다면 iOS 가 16.4 보다 옛것이다.
                ? '이 아이폰·아이패드는 알림을 받으려면 소프트웨어 업데이트가 필요합니다. (설정 → 일반 → 소프트웨어 업데이트)'
                : '아이폰·아이패드는 이 화면을 홈 화면에 추가한 뒤, 홈 화면의 알림장에서 알림을 켤 수 있습니다.\n\n사파리 아래쪽 공유 단추 → 홈 화면에 추가');
            return;
        }
        btn.disabled = true;
        try {
            if (subscribed) {
                if (!confirm('이 기기에서 알림장 알림을 끌까요?')) return;
                const reg = await navigator.serviceWorker.ready;
                const sub = await reg.pushManager.getSubscription();
                if (sub) {
                    await fetch(`${API_BASE}/push/subscriptions`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ endpoint: sub.endpoint })
                    });
                    await sub.unsubscribe();
                }
                subscribed = false;
                render();
                return;
            }

            // 허락 묻기는 누른 그 순간에 해야 한다. 앞에서 다른 걸 기다리면 사파리가 막는다.
            const permission = Notification.permission === 'granted'
                ? 'granted'
                : await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('알림이 꺼져 있습니다. 휴대폰이나 브라우저 설정에서 이 사이트의 알림을 허용한 뒤 다시 눌러 주세요.');
                return;
            }
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
                const keyRes = await fetch(`${API_BASE}/push/key`);
                if (!keyRes.ok) throw new Error('서버 열쇠를 받지 못함');
                const { publicKey } = await keyRes.json();
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: base64UrlToBytes(publicKey)
                });
            }
            await sendSubscription(sub);
            subscribed = true;
            render();
        } catch (e) {
            console.error('알림 설정 실패', e);
            alert('알림을 켜지 못했습니다. 잠시 뒤 다시 눌러 주세요.');
        } finally {
            btn.disabled = false;
        }
    });
}

// 우리 반, 동아리, 방과후… 내가 볼 수 있는 게시판들. 안 읽은 글이 있으면 표시한다.
async function loadBoards() {
    try {
        const res = await fetch(`${API_BASE}/classboard/boards`);
        if (!res.ok) return;
        const data = await res.json();
        boards = data.boards || [];
        canPost = boards.some(b => b.canPost);

        if (!boards.some(b => b.key === activeBoardKey)) activeBoardKey = boards.length > 0 ? boards[0].key : null;
        if (canPost) composerSection.classList.remove('hidden');

        renderBoardPicker();
        updateComposerTarget();
    } catch (e) {
        console.error('Failed to load boards', e);
    }
}

function renderBoardPicker() {
    // 게시판이 하나뿐이면 고를 것이 없다.
    if (boards.length < 2) {
        boardPickerSection.classList.add('hidden');
        return;
    }
    boardPickerSection.classList.remove('hidden');
    boardPickerSection.replaceChildren(...boards.map(b => {
        const btn = document.createElement('button');
        btn.className = 'board-tab';
        if (b.key === activeBoardKey) btn.classList.add('active');

        const name = document.createElement('span');
        name.className = 'board-tab-name';
        name.textContent = b.label;
        btn.appendChild(name);

        const kind = document.createElement('span');
        kind.className = 'board-tab-kind';
        kind.textContent = b.typeLabel;
        btn.appendChild(kind);

        // 안 읽은 글 개수. 들어가 보면 사라진다.
        if (b.unreadCount > 0) {
            const dot = document.createElement('span');
            dot.className = 'board-tab-unread';
            dot.textContent = b.unreadCount > 99 ? '99+' : String(b.unreadCount);
            dot.title = `안 읽은 글 ${b.unreadCount}개`;
            btn.appendChild(dot);
        }

        btn.addEventListener('click', () => {
            if (activeBoardKey === b.key) return;
            activeBoardKey = b.key;
            // 새로고침해도 고른 게시판에 머물게. 알림으로 들어온 주소가 남아 있으면 그리로 돌아간다.
            if (location.search) history.replaceState(history.state, '', `?board=${encodeURIComponent(b.key)}`);
            activeSubjectFilter = null;
            renderBoardPicker();
            updateComposerTarget();
            loadPosts();
        });
        return btn;
    }));
}

function updateComposerTarget() {
    if (!composerTargetEl) return;
    const target = boards.find(b => b.key === activeBoardKey);
    composerTargetEl.textContent = target ? `${target.label}에 게시` : '';
    // 학생이 소속된 게시판이어도 글은 교사만 쓴다.
    composerSection.classList.toggle('hidden', !(target && target.canPost));
}

// 거르개 두 줄이 한 줄에 있다.
//   앞: 종류 — 전체 / 알림장 / 가정통신문 / 할 일
//   뒤: 누가 썼는지 — 담임, 과목 전담들 (한 게시판에 여럿이 쓰니까)
function renderFilters() {
    const chips = [];
    const add = (label, active, onClick, extraClass) => {
        const btn = document.createElement('button');
        btn.className = 'filter-chip' + (extraClass ? ` ${extraClass}` : '');
        if (active) btn.classList.add('active');
        btn.textContent = label;
        btn.addEventListener('click', onClick);
        chips.push(btn);
    };

    // 가정통신문 칸: 아직 회신 안 한 것만 골라 보기.
    const todoCount = loadedNotices.filter(n => NoticeCard.needsAction(n, viewerRole)).length;
    if (todoCount > 0) {
        add(`아직 회신 안 함 ${todoCount}`, activeKindFilter === 'todo',
            () => { activeKindFilter = activeKindFilter === 'todo' ? null : 'todo'; renderFeed(); },
            'filter-chip-todo');
    } else if (activeKindFilter === 'todo') {
        activeKindFilter = null;
    }

    // 게시판 칸: 담임 글만, 또는 과목별로. 한 번 더 누르면 풀린다.
    const labels = [...new Set(loadedPosts.map(p => p.authorLabel).filter(Boolean))];
    if (labels.length >= 2) {
        labels.forEach(label => add(label, activeSubjectFilter === label, () => {
            activeSubjectFilter = activeSubjectFilter === label ? null : label;
            renderFeed();
        }));
    } else if (activeSubjectFilter) {
        activeSubjectFilter = null;
    }

    filterSection.classList.toggle('hidden', chips.length === 0);
    filterSection.replaceChildren(...chips);
}

async function loadPosts() {
    const board = boards.find(b => b.key === activeBoardKey);
    try {
        const query = activeBoardKey ? `?board=${encodeURIComponent(activeBoardKey)}` : '';
        // 가정통신문 칸에는 게시판 글이 없다. 그래도 목록은 불러야 한다 --
        // 그 칸을 열었다는 표시(읽음)를 서버가 거기서 남기기 때문이다.
        const [postsRes, notices] = await Promise.all([
            fetch(`${API_BASE}/classboard/posts${query}`),
            loadNotices(board)
        ]);
        const data = await postsRes.json();
        if (!postsRes.ok) throw new Error(data.error || 'Failed to load posts');

        loadedPosts = data.posts || [];
        loadedNotices = notices;
        renderFeed();

        // 방금 이 게시판을 읽었으니 표시를 지운다.
        if (board && board.unreadCount) {
            board.unreadCount = 0;
            renderBoardPicker();
        }
    } catch (e) {
        console.error(e);
        feedSection.innerHTML = '<div class="loader" style="color: var(--danger);">게시물을 불러오지 못했습니다.</div>';
    }
}

// 가정통신문은 학급 것이 아니다. 학교 업무 담당자가 동아리든, 이 반 저 반 골라
// 담은 명단이든 원하는 사람에게 보낸다. 그래서 우리 반 게시판이 아니라 '나에게
// 온 것'을 담는 자기 칸에서만 불러온다.
async function loadNotices(board) {
    if (!board || board.kind !== 'notice') return [];
    try {
        const params = new URLSearchParams();
        if (board.child) {
            params.set('grade', board.child.grade);
            params.set('classNumber', board.child.classNumber);
            params.set('studentNumber', board.child.studentNumber);
        }
        const qs = params.toString();
        const res = await fetch(`${API_BASE}/notice/list${qs ? `?${qs}` : ''}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.notices || [];
    } catch (e) {
        console.error('Failed to load notices', e);
        return [];
    }
}

function renderFeed() {
    renderFilters();
    feedSection.innerHTML = '';

    const board = boards.find(b => b.key === activeBoardKey);
    const noticeCtx = {
        viewerRole,
        child: board && board.child ? {
            grade: board.child.grade,
            classNumber: board.child.classNumber,
            studentNumber: board.child.studentNumber
        } : null,
        onChanged: loadPosts
    };

    let items = [
        ...loadedPosts.map(p => ({ kind: 'post', at: p.createdAt, data: p })),
        ...loadedNotices.map(n => ({ kind: 'notice', at: n.createdAt, data: n }))
    ];

    if (activeKindFilter === 'todo') {
        items = items.filter(i => i.kind === 'notice' && NoticeCard.needsAction(i.data, viewerRole));
    }
    if (activeSubjectFilter) {
        items = items.filter(i => i.kind !== 'post' || i.data.authorLabel === activeSubjectFilter);
    }

    items.sort((a, b) => new Date(b.at) - new Date(a.at));

    if (items.length === 0) {
        const nothingAtAll = (loadedPosts.length + loadedNotices.length) === 0;
        const empty = !nothingAtAll ? '고른 조건에 맞는 글이 없습니다.'
            : (board && board.kind === 'notice' ? '아직 받은 가정통신문이 없습니다.' : '아직 올라온 글이 없습니다.');
        feedSection.innerHTML = `<div class="loader">${empty}</div>`;
        return;
    }

    items.forEach(item => {
        if (item.kind === 'post') renderPost(item.data);
        else feedSection.appendChild(NoticeCard.render(item.data, noticeCtx));
    });
}

function renderPost(post) {
    const clone = postTemplate.content.cloneNode(true);
    const article = clone.querySelector('.post-card');
    
    // Author info
    const avatar = clone.querySelector('[data-type="post-avatar"]');
    avatar.textContent = post.authorName.charAt(0);
    avatar.classList.add(post.authorRole);
    if (post.authorPicture) {
        avatar.style.backgroundImage = `url(${post.authorPicture})`;
        avatar.textContent = '';
    }
    
    clone.querySelector('[data-type="post-author-name"]').textContent = post.authorName;
    // 담임인지 과목 전담인지 한눈에. 한 게시판에 여러 선생님이 글을 쓴다.
    const roleEl = clone.querySelector('[data-type="post-author-role"]');
    roleEl.textContent = post.authorLabel || (post.authorRole === 'teacher' ? '교사' : '학생');
    if (post.authorSubject) roleEl.classList.add('subject');
    clone.querySelector('[data-type="post-date"]').textContent = formatDate(post.createdAt);
    
    // Post Content (with linkify)
    clone.querySelector('[data-type="post-content"]').innerHTML = linkify(post.content);
    
    // Delete Post button
    // 본인 글이거나 이 반 담임일 때만. 서버도 같은 규칙으로 거른다.
    const deletePostBtn = clone.querySelector('[data-type="delete-post"]');
    if (post.canDelete) {
        deletePostBtn.classList.remove('hidden');
        deletePostBtn.addEventListener('click', () => deletePost(post.id, article));
    }
    
    // Comments
    const commentsList = clone.querySelector('[data-type="comments-list"]');
    post.comments.forEach(comment => {
        commentsList.appendChild(createCommentNode(comment, post.id));
    });
    
    // Add Comment
    const commentInput = clone.querySelector('[data-type="comment-input"]');
    const commentSubmitBtn = clone.querySelector('[data-type="comment-submit"]');

    // 학부모는 읽기만 한다. 서버가 막고 있으니 쓸 수 없는 칸을 보여 주면 안 된다.
    if (viewerRole === 'guardian') {
        commentInput.closest('.comment-input-area').remove();
        if (post.comments.length === 0) {
            clone.querySelector('.comments-section').remove();
        }
        feedSection.appendChild(clone);
        return;
    }

    // Auto resize comment textarea
    commentInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    const submitCommentHandler = async () => {
        const content = commentInput.value.trim();
        if (!content) return;
        
        commentSubmitBtn.disabled = true;
        try {
            const res = await fetch(`${API_BASE}/classboard/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            // Optimistically add comment
            const newComment = {
                id: data.id,
                content: content,
                authorName: currentUser.name,
                authorPicture: currentUser.picture,
                authorRole: currentUser.role,
                isMine: true,
                canDelete: true,
                createdAt: new Date().toISOString()
            };
            commentsList.appendChild(createCommentNode(newComment, post.id));
            commentInput.value = '';
            commentInput.style.height = 'auto';
        } catch (e) {
            alert(e.message || '댓글 등록에 실패했습니다.');
        } finally {
            commentSubmitBtn.disabled = false;
        }
    };
    
    commentSubmitBtn.addEventListener('click', submitCommentHandler);
    commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitCommentHandler();
        }
    });

    feedSection.appendChild(clone);
}

function createCommentNode(comment, postId) {
    const clone = commentTemplate.content.cloneNode(true);
    const commentEl = clone.querySelector('.comment');
    
    const avatar = clone.querySelector('[data-type="comment-avatar"]');
    avatar.textContent = comment.authorName.charAt(0);
    avatar.classList.add(comment.authorRole);
    if (comment.authorPicture) {
        avatar.style.backgroundImage = `url(${comment.authorPicture})`;
        avatar.textContent = '';
    }

    clone.querySelector('[data-type="comment-author-name"]').textContent = comment.authorName;
    clone.querySelector('[data-type="comment-author-role"]').textContent = comment.authorRole === 'teacher' ? '교사' : '학생';
    
    // Comment Content (with linkify)
    clone.querySelector('[data-type="comment-content"]').innerHTML = linkify(comment.content);

    const deleteBtn = clone.querySelector('[data-type="delete-comment"]');
    if (comment.canDelete ?? comment.isMine) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('댓글을 삭제하시겠습니까?')) return;
            try {
                const res = await fetch(`${API_BASE}/classboard/posts/${postId}/comments/${comment.id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) throw new Error('삭제 실패');
                commentEl.remove();
            } catch (e) {
                alert(e.message);
            }
        });
    }
    
    return clone;
}

// Create Post
postSubmitBtn.addEventListener('click', async () => {
    const content = postContentInput.value.trim();
    if (!content) return;

    postSubmitBtn.disabled = true;
    postSubmitBtn.textContent = '게시 중...';
    try {
        const res = await fetch(`${API_BASE}/classboard/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, board: activeBoardKey })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        postContentInput.value = '';
        loadPosts(); // Reload all posts for simplicity
    } catch (e) {
        alert(e.message || '게시물 등록에 실패했습니다.');
    } finally {
        postSubmitBtn.disabled = false;
        postSubmitBtn.textContent = '게시하기';
    }
});

async function deletePost(postId, articleElement) {
    if (!confirm('게시물을 삭제하시겠습니까? (관련 댓글도 모두 삭제됩니다)')) return;
    
    try {
        const res = await fetch(`${API_BASE}/classboard/posts/${postId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('삭제 실패');
        articleElement.remove();
        
        if (feedSection.children.length === 0) {
            feedSection.innerHTML = '<div class="loader">아직 게시물이 없습니다.</div>';
        }
    } catch (e) {
        alert(e.message);
    }
}

// Start app
initApp();
