/* Book adapters pass explicit state accessors; no DOM snapshots or browser storage. */
window.connectBookRecords = async function (adapter) {
  'use strict';
  const records = LearningRecords.create(adapter.activity, { label: adapter.title, toolbar: false });
  adapter.lock(true);
  const session = await records.start({ contentKey: adapter.key, title: adapter.title, version: '20261002', checkpoint: adapter.snapshot() });
  if (document.fonts) await document.fonts.ready;
  adapter.restore(session.checkpoint);
  let busy = false, complete = false;
  const save = async (events = []) => {
    const snapshot = adapter.snapshot();
    // All book readers disable the next-page control on their final page.
    complete ||= document.getElementById('nextBtn')?.disabled === true;
    await records.save({ checkpoint: snapshot, progress: { current: snapshot.visited.length, total: null }, events, complete });
  };
  adapter.connect({
    async answer(event) {
      if (busy) return;
      busy = true; adapter.lock(true); await save([event]); adapter.repaint(); adapter.lock(false); busy = false;
    },
    changed(event) { save(event ? [event] : []); },
    canAct: () => !busy
  });
  await save(); adapter.lock(false);
};
