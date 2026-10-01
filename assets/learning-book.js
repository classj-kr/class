/* Book adapters pass explicit state accessors; no DOM snapshots or browser storage. */
window.connectBookRecords = async function (adapter) {
  'use strict';
  const records = LearningRecords.create(adapter.activity, { label: adapter.title, mount: document.querySelector('.screen-book') || document.querySelector('.book-stage') });
  adapter.lock(true);
  const session = await records.start({ contentKey: adapter.key, title: adapter.title, version: '20261002', checkpoint: adapter.snapshot() });
  if (document.fonts) await document.fonts.ready;
  adapter.restore(session.checkpoint);
  let closed = false, busy = false;
  const save = async (events = [], complete = false) => {
    if (closed) return;
    const snapshot = adapter.snapshot();
    await records.save({ checkpoint: snapshot, progress: { current: snapshot.visited.length, total: null }, events, complete });
  };
  const finish = records.addAction('이번 읽기 마치기', async () => {
    if (busy || closed) return;
    busy = true; finish.disabled = true; adapter.lock(true);
    await save([], true); closed = true; records.showResult();
    finish.textContent = '새 읽기 시작'; finish.disabled = false; finish.onclick = () => location.reload();
  });
  adapter.connect({
    async answer(event) {
      if (busy || closed) return;
      busy = true; adapter.lock(true); await save([event]); adapter.repaint(); adapter.lock(false); busy = false;
    },
    changed(event) { if (!closed) save(event ? [event] : []); },
    canAct: () => !busy && !closed
  });
  await save(); adapter.lock(false);
};
