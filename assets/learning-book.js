/* Book adapters pass explicit state accessors; no DOM snapshots or browser storage. */
window.connectBookRecords = async function (adapter) {
  'use strict';
  // Answering re-renders the whole page, which replaces its scroll boxes and sends them back to the top.
  // Remember where every scrolled box was (matched by tag, class and order) and put each one back.
  const scrollKey = el => el.tagName + '.' + (el.getAttribute('class') || '');
  const eachBox = visit => { const seen = {}; for (const el of document.body.querySelectorAll('*')) { const key = scrollKey(el); visit(el, key + '#' + (seen[key] = (seen[key] ?? -1) + 1)); } };
  const saveScroll = () => { const spots = new Map(); eachBox((el, id) => { if (el.scrollTop || el.scrollLeft) spots.set(id, [el.scrollTop, el.scrollLeft]); }); return { x: scrollX, y: scrollY, spots }; };
  const restoreScroll = view => {
    eachBox((el, id) => { const spot = view.spots.get(id); if (spot) { el.scrollTop = spot[0]; el.scrollLeft = spot[1]; } });
    scrollTo(view.x, view.y);
  };
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
      busy = true; adapter.lock(true); await save([event]);
      const view = saveScroll(); adapter.repaint(); restoreScroll(view); requestAnimationFrame(() => restoreScroll(view));
      adapter.lock(false); busy = false;
    },
    changed(event) { save(event ? [event] : []); },
    canAct: () => !busy
  });
  await save(); adapter.lock(false);
};
