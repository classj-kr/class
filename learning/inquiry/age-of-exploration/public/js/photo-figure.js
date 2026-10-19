'use strict';
// The caption identifies historical photos, satellite composites and partial views.
// Keep full attribution available without placing a long source block over the image.
window.VoyagePhotoFigure = (() => {
  function link(label, url) {
    if (!url || !/^https?:\/\//i.test(url)) return document.createTextNode(label);
    const a = document.createElement('a');
    a.textContent = label; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function alt(item) {
    return item.imageCaption || `${item.name || ''} ${item.imageKind === 'map' ? '위치 지도' : '사진'}`;
  }
  function caption(figure, item) {
    figure.querySelectorAll('.photoCaption,.photoCredit').forEach(node => node.remove());
    if (!item.image) return;
    if (item.imageCaption) {
      const p = document.createElement('p'); p.className = 'photoCaption';
      p.textContent = item.imageCaption; figure.append(p);
    }
    if (item.imageCredit) {
      const details = document.createElement('details'); details.className = 'photoCredit';
      const summary = document.createElement('summary'); summary.textContent = '사진 출처';
      const credit = document.createElement('p');
      credit.append(link(item.imageCredit, item.imageSource));
      if (item.imageLicenseUrl) credit.append(' · ', link('이용 조건', item.imageLicenseUrl));
      if (item.imageChanges) credit.append(document.createElement('br'), item.imageChanges);
      details.append(summary, credit); figure.append(details);
    }
  }
  return { alt, caption };
})();
