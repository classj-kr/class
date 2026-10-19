'use strict';
// The caption identifies historical photos, satellite composites and partial views.
// Keep attribution in a separate dialog so it takes no space in the reading flow.
window.VoyagePhotoFigure = (() => {
  let sourceDialog, sourceBody;
  function link(label, url) {
    if (!url || !/^https?:\/\//i.test(url)) return document.createTextNode(label);
    const a = document.createElement('a');
    a.textContent = label; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function alt(item) {
    return item.imageCaption || `${item.name || ''} ${item.imageKind === 'map' ? '위치 지도' : '사진'}`;
  }
  function showSource(item) {
    if (!sourceDialog) {
      sourceDialog = document.createElement('dialog'); sourceDialog.className = 'photoSourceDialog';
      sourceDialog.setAttribute('aria-labelledby', 'voyagePhotoSourceTitle');
      const panel = document.createElement('div'); panel.className = 'photoSourcePanel';
      const header = document.createElement('header');
      const title = document.createElement('h2'); title.id = 'voyagePhotoSourceTitle'; title.textContent = '사진 정보';
      const close = document.createElement('button'); close.type = 'button'; close.textContent = '닫기';
      close.addEventListener('click', () => sourceDialog.close());
      sourceBody = document.createElement('div');
      header.append(title, close); panel.append(header, sourceBody); sourceDialog.append(panel);
      sourceDialog.addEventListener('click', event => { if (event.target === sourceDialog) sourceDialog.close(); });
      sourceDialog.addEventListener('keydown', event => event.stopPropagation());
      sourceDialog.addEventListener('keyup', event => event.stopPropagation());
      document.body.append(sourceDialog);
    }
    const credit = document.createElement('p');
    credit.append(link(item.imageCredit, item.imageSource));
    if (item.imageLicenseUrl) credit.append(' · ', link('이용 조건', item.imageLicenseUrl));
    sourceBody.replaceChildren(credit);
    if (item.imageChanges) {
      const changes = document.createElement('p'); changes.textContent = item.imageChanges;
      sourceBody.append(changes);
    }
    sourceDialog.showModal();
  }
  function caption(figure, item) {
    figure.querySelectorAll('.photoCaption,.photoCredit').forEach(node => node.remove());
    if (!item.image) return;
    if (item.imageCaption) {
      const p = document.createElement('p'); p.className = 'photoCaption';
      p.textContent = item.imageCaption; figure.append(p);
    }
    if (item.imageCredit) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'photoCredit';
      button.textContent = 'ⓘ'; button.title = '사진 정보';
      button.setAttribute('aria-label', '사진 정보'); button.setAttribute('aria-haspopup', 'dialog');
      button.addEventListener('click', () => showSource(item)); figure.append(button);
    }
  }
  return { alt, caption };
})();
