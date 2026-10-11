(function () {
  'use strict';
  const xy = p => [p[1], p[0]];
  function draw(map, group, id, { labels = true } = {}) {
    const data = window.HISTORY_LOCAL_MAPS?.[id];
    if (!data) return [];
    if (!map.getPane('historyContext')) {
      map.createPane('historyContext');
      Object.assign(map.getPane('historyContext').style, { zIndex: '550', pointerEvents: 'none' });
    }
    const [w, s, e, n] = data.relief.bounds;
    const relief = L.imageOverlay(data.relief.src, [[s,w],[n,e]], {
      pane: 'themeZones', opacity: 1, interactive: false,
      className: 'history-local-relief', alt: '한양 주변의 산과 골짜기 지형'
    }).addTo(group);
    // Retain the ordinary terrain underneath if the detailed image cannot load.
    relief.on('error', () => group.removeLayer(relief));
    const renderer = L.svg({ pane: 'themeZones' }).addTo(group);
    const wall = data.wall.map(xy);
    L.polygon(wall, { renderer, pane: 'themeZones', color: '#fffdf7', weight: 7,
      fillColor: '#fff5d4', fillOpacity: .16, interactive: false }).addTo(group);
    L.polyline(wall, { renderer, pane: 'themeZones', color: '#80633f', weight: 3,
      className: 'history-local-wall', interactive: false }).addTo(group);
    data.streams.forEach(line => {
      L.polyline(line.map(xy), { renderer, pane: 'themeZones', color: '#f2fafb', weight: 6, interactive: false }).addTo(group);
      L.polyline(line.map(xy), { renderer, pane: 'themeZones', color: '#4e9cb7', weight: 3,
        className: 'history-local-stream', interactive: false }).addTo(group);
    });
    const anchors = labels ? data.labels : [];
    anchors.forEach(item => {
      const text = document.createElement('span');
      text.className = `history-context-label ${item.kind}`;
      text.textContent = item.name;
      L.marker(xy(item.xy), { pane: 'historyContext', interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'history-context-wrap', html: text,
          iconSize: [112, 24], iconAnchor: [56, 12] }) }).addTo(group);
    });
    const scale = L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 110 }).addTo(map);
    renderer.on('remove', () => scale.remove());
    return anchors;
  }
  window.KoreaHistoryLocalMap = { draw };
})();
