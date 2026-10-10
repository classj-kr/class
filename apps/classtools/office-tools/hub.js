// Keep existing bookmarks to the stamp and scan tools working.
(() => {
  const tool = window.location.hash.slice(1);
  if (tool === 'stamp' || tool === 'scan') {
    window.location.replace('./workbench.html' + window.location.hash);
  }
})();
