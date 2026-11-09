// The teacher's stage observes board snapshots. A fresh page paints existing
// results silently; only a finish observed during this round triggers a fanfare.
window.createStackingTeamStage = function (root) {
  'use strict';
  root.innerHTML = `<div class="relay-hero">
    <div class="relay-copy"><span class="relay-kicker"></span>
      <h3 class="relay-headline" role="status"></h3><span class="relay-detail"></span></div>
    <div class="relay-trophy" aria-hidden="true">🏆</div>
    <div class="race-sparkles" aria-hidden="true"></div></div>
    <div class="relay-bar"><h3 class="relay-heading"></h3><div class="relay-tools">
      <div class="relay-actions"></div></div></div>
    <ol class="relay-lanes" aria-label="모둠 순위와 완주 기록"></ol>`;
  const find = selector => root.querySelector(selector);
  const headline = find('.relay-headline'), detail = find('.relay-detail');
  const lanes = find('.relay-lanes');
  const cards = new Map(), celebrated = new Set(), queue = [];
  // 모둠 이름은 색 이름(빨강 모둠…)이고, 칸 색도 그 색이다. 서버가 색을 안 주는 옛 모둠만 회색.
  // 큰 제목에는 이름만 쓴다(큰 글씨의 색 동그라미는 너무 커서).
  const teamLabel = t => (t.emoji ? t.emoji + ' ' : '') + t.name;
  let roundId, timer = null, lastStandings = [], resultTitle = '', resultDetail = '';
  const duration = ms => {
    const elapsed = Math.max(0, ms), seconds = Math.floor(elapsed / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.${String(elapsed % 1000).padStart(3, '0')}`;
  };
  const soundOn = () => !StackingSounds.muted() && StackingSounds.volume() > 0;
  function reset() {
    clearTimeout(timer);
    timer = null;
    roundId = null;
    lastStandings = [];
    queue.length = 0;
    celebrated.clear();
    cards.clear();
    lanes.replaceChildren();
    find('.race-sparkles').replaceChildren();
    root.classList.remove('is-cheering');
    root.hidden = true;
  }
  function nextCheer() {
    for (const card of cards.values()) card.classList.remove('take-a-bow');
    const event = queue.shift();
    if (!event) {
      timer = null;
      root.classList.remove('is-cheering');
      headline.textContent = resultTitle;
      detail.textContent = resultDetail;
      return;
    }
    root.classList.add('is-cheering');
    cards.get(event.id)?.classList.add('take-a-bow');
    headline.textContent = event.title;
    detail.textContent = event.detail;
    if (!document.hidden) {
      if (soundOn()) StackingSounds.play('success');
      window.StackingRace.finishConfetti(find('.race-sparkles'));
    }
    timer = setTimeout(nextCheer, 3000);
  }
  function rankTeams(teams) {
    const ordered = teams.filter(t => t.score !== undefined).map(t => ({
      ...t, mark: t.finishedAt ?? t.solvedAt ?? Infinity
    })).sort((a, b) => b.score - a.score || a.mark - b.mark);
    let rank = 0;
    ordered.forEach((t, i) => {
      if (!i || t.score !== ordered[i - 1].score || t.mark !== ordered[i - 1].mark) rank = i + 1;
      t.rank = t.score ? rank : 0;
    });
    return ordered;
  }
  function paintLane(t, race, ended, rankText) {
    let card = cards.get(t.id);
    if (!card) {
      card = document.createElement('li');
      card.className = 'coop-team relay-lane';
      card.dataset.team = t.id;
      card.style.setProperty('--lane-hue', t.hue ?? 150);
      if (t.hue == null) card.style.setProperty('--lane-sat', '6%');
      card.innerHTML = `<div class="lane-top"><span class="lane-rank"></span><strong></strong></div>
        <div class="lane-track" role="progressbar"><div class="lane-distance"><i></i>
          <svg viewBox="0 0 32 35" class="lane-cube" aria-hidden="true"><path fill="#ffda84" d="m16 2 14 7-14 7L2 9Z"/><path fill="#dd9450" d="m2 9 14 7v16L2 25Z"/><path fill="#bc713e" d="m16 16 14-7v16l-14 7Z"/></svg>
        </div><span class="lane-flag" aria-hidden="true">⚑</span></div>
        <b class="lane-caption"></b><span class="lane-score"></span><div class="lane-shape"></div><div class="lane-members"></div>`;
      cards.set(t.id, card);
    }
    card.classList.toggle('has-finished', !!t.finishedAt);
    // 경기가 끝나면 완주하지 못한 모둠도 1·2·3위에 메달을 건다.
    card.classList.toggle('is-placed', ended && t.rank >= 1 && t.rank <= 3);
    card.classList.toggle('is-leader', !ended && t.rank === 1);
    card.dataset.place = t.rank;
    card.querySelector('strong').textContent = teamLabel(t);
    const medals = ['🏅', '🥇', '🥈', '🥉'];
    card.querySelector('.lane-rank').textContent = t.finishedAt || (ended && t.rank <= 3 && t.rank) ? (medals[t.rank] || medals[0]) : (t.rank === 1 ? '👑 ' : '') + (rankText || '도전');
    card.querySelector('.lane-caption').textContent = t.finishedAt ? `⚑ ${rankText} 완주!` : ended ? '경기 종료' : `${t.score + 1}번째 문제 도전 중`;
    const record = t.finishedAt ? ' · ' + duration(t.finishedAt - race.startedAt) : '';
    card.querySelector('.lane-score').textContent = `${t.score}/${race.total}문제${record}`;
    // 모둠원마다 자기가 고른 아바타와 이름. 같은 명단이면 그림을 다시 만들지 않는다.
    const roster = card.querySelector('.lane-members'), rosterKey = JSON.stringify(t.members.map(m => [m.id, m.name, m.avatarUrl || '']));
    if (roster.dataset.key !== rosterKey) {
      roster.dataset.key = rosterKey;
      roster.replaceChildren(...t.members.map(m => {
        const chip = document.createElement('span');
        chip.className = 'stacking-member';
        const name = document.createElement('span');
        name.textContent = m.name;
        chip.append(window.stackingFace(m), name);
        return chip;
      }));
    }
    const track = card.querySelector('.lane-track');
    track.setAttribute('aria-label', t.name + ' 해결한 문제');
    track.setAttribute('aria-valuemin', 0);
    track.setAttribute('aria-valuemax', race.total);
    track.setAttribute('aria-valuenow', t.score);
    track.style.setProperty('--distance', `${100 * t.score / race.total}%`);
    const preview = card.querySelector('.lane-shape');
    if (ended && t.finishShape && !preview.firstChild) preview.append(StackingApp.preview(t.finishShape));
    return card;
  }
  function render(race, teams) {
    const sameRound = roundId === race.id;
    if (!sameRound) reset();
    roundId = race.id;
    root.hidden = false;
    const ended = race.phase === 'finished', standings = rankTeams(teams);
    const finishers = standings.filter(t => t.finishedAt), leaders = standings.filter(t => t.rank === 1);
    const rankLabel = t => {
      if (!t.rank) return '';
      const tied = standings.some(other => other.id !== t.id && other.rank === t.rank);
      return (tied ? '공동 ' : '') + t.rank + '위';
    };
    root.classList.toggle('is-final', ended);
    find('.relay-kicker').textContent = ended ? '쌓기나무 순위전 · 최종 결과' : '쌓기나무 순위전 · 진행 중';
    find('.relay-heading').textContent = ended ? '모둠별 최종 기록' : '모둠별 진행 상황';
    resultTitle = ended ? '팀전 종료!' : '완주를 향해!';
    if (ended && leaders.length) resultTitle = leaders.map(t => t.name).join(' · ') + ' ' + rankLabel(leaders[0]) + '!';
    if (!ended && !standings.length) resultTitle = '모둠 입장 대기';
    resultDetail = `총 ${race.total}문제 · ${standings.length}모둠 중 ${finishers.length}모둠 완주`;
    for (const [index, t] of standings.entries()) {
      const card = paintLane(t, race, ended, rankLabel(t));
      if (lanes.children[index] !== card) lanes.insertBefore(card, lanes.children[index] || null);
      const svg = card.querySelector('.lane-shape svg:not([data-fitted])');
      if (svg) {
        const bounds = svg.getBBox();
        if (bounds.width && bounds.height) {
          svg.setAttribute('viewBox', `${bounds.x - 6} ${bounds.y - 6} ${bounds.width + 12} ${bounds.height + 12}`);
          svg.dataset.fitted = 'true';
        }
      }
    }
    for (const [id, card] of cards) if (!standings.some(t => t.id === id)) { card.remove(); cards.delete(id); }
    let newFinish = false;
    for (const t of finishers) {
      if (celebrated.has(t.id)) continue;
      celebrated.add(t.id);
      if (sameRound) {
        queue.push({ id: t.id, title: t.name + ' 완주!', detail: `${rankLabel(t)} · ${race.total}문제 해결 · 기록 ${duration(t.finishedAt - race.startedAt)}` });
        newFinish = true;
      }
    }
    // 문제를 푼 모둠은 칸이 한 번 튀고 「+1」이 떠오른다.
    const advanced = sameRound && !ended ? standings.filter(t => t.score > (lastStandings.find(old => old.id === t.id)?.score ?? t.score)) : [];
    for (const t of advanced) {
      const card = cards.get(t.id), gain = t.score - lastStandings.find(old => old.id === t.id).score;
      card.classList.remove('lane-hop'); void card.offsetWidth; card.classList.add('lane-hop');
      const pop = document.createElement('i');
      pop.className = 'lane-pop'; pop.textContent = '+' + gain; pop.setAttribute('aria-hidden', 'true');
      card.append(pop); setTimeout(() => pop.remove(), 1000);
    }
    if (advanced.length && !newFinish && !timer && !document.hidden && soundOn()) StackingSounds.play('add', advanced[0].score);
    lastStandings = standings;
    if (!timer) nextCheer();
  }
  return { render, reset, actions: find('.relay-actions') };
};
