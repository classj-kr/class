(function () {
  'use strict';

  // --- State Variables ---
  let activeEraFilter = 'all';
  
  let leafletMap = null;
  let mapMarkersGroup = null;
  let mapMarkerLinksGroup = null;
  let mapLabelsGroup = null;
  let mapProvinceBoundariesGroup = null;
  let mapMarkerEntries = [];
  let koreaSigunguLabels = [];
  let currentActiveRelic = null;
  let quizSessionRelics = [];
  let quizSessionIndex = 0;
  let quizSessionScore = 0;
  let quizSessionAnswered = false;
  let quizSessionQuestionHadWrong = false;
  let quizSessionScope = 'all';
  let quizSessionLevel = 'mixed';

  const KOREA_MAP_LABELS = [
    // Low-zoom labels: keep only the administrative regions students need.
    { name: '서울특별시', lat: 37.5665, lng: 126.9780, minZoom: 7, maxZoom: 14, kind: 'region' },
    { name: '인천광역시', lat: 37.4563, lng: 126.7052, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '경기도', lat: 37.2751, lng: 127.0095, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '강원특별자치도', lat: 37.8228, lng: 128.1555, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '충청북도', lat: 36.6357, lng: 127.4917, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '충청남도', lat: 36.6588, lng: 126.6728, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '세종특별자치시', lat: 36.4800, lng: 127.2890, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '대전광역시', lat: 36.3504, lng: 127.3845, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '전북특별자치도', lat: 35.8203, lng: 127.1088, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '전라남도', lat: 34.8161, lng: 126.4629, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '광주광역시', lat: 35.1595, lng: 126.8526, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '경상북도', lat: 36.5760, lng: 128.5058, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '대구광역시', lat: 35.8714, lng: 128.6014, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '울산광역시', lat: 35.5384, lng: 129.3114, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '경상남도', lat: 35.2383, lng: 128.6924, minZoom: 6, maxZoom: 8, kind: 'region' },
    { name: '부산광역시', lat: 35.1796, lng: 129.0756, minZoom: 8, maxZoom: 14, kind: 'region' },
    { name: '제주특별자치도', lat: 33.3617, lng: 126.5292, minZoom: 6, maxZoom: 8, kind: 'region' },

    // North Korea: province names at overview zoom, major cities when enlarged.
    { name: '평안북도', lat: 40.10, lng: 124.95, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '평안남도', lat: 39.45, lng: 126.05, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '황해북도', lat: 38.55, lng: 126.15, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '황해남도', lat: 38.35, lng: 125.45, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '강원도(북)', lat: 39.20, lng: 127.15, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '함경남도', lat: 40.20, lng: 127.65, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '함경북도', lat: 41.85, lng: 129.45, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '자강도', lat: 40.90, lng: 126.35, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '량강도', lat: 41.50, lng: 128.05, minZoom: 6, maxZoom: 7, kind: 'north-region' },
    { name: '평양', lat: 39.0392, lng: 125.7625, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '개성', lat: 37.9382, lng: 126.5878, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '해주', lat: 38.0400, lng: 125.7150, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '남포', lat: 38.7375, lng: 125.4078, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '신의주', lat: 40.1006, lng: 124.3980, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '원산', lat: 39.1528, lng: 127.4436, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '함흥', lat: 39.9183, lng: 127.5364, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '청진', lat: 41.7956, lng: 129.7758, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '라선', lat: 42.2569, lng: 130.2844, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '강계', lat: 40.9695, lng: 126.5850, minZoom: 8, maxZoom: 14, kind: 'north-city' },
    { name: '혜산', lat: 41.4017, lng: 128.1770, minZoom: 8, maxZoom: 14, kind: 'north-city' },

    // Seoul's 25 districts: always show them together at city-level zoom.
    { name: '종로구', lat: 37.5735, lng: 126.9790, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '중구', lat: 37.5641, lng: 126.9979, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '용산구', lat: 37.5326, lng: 126.9900, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '성동구', lat: 37.5635, lng: 127.0369, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '광진구', lat: 37.5385, lng: 127.0824, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '동대문구', lat: 37.5744, lng: 127.0396, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '중랑구', lat: 37.6063, lng: 127.0927, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '성북구', lat: 37.5894, lng: 127.0167, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '강북구', lat: 37.6396, lng: 127.0257, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '도봉구', lat: 37.6688, lng: 127.0471, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '노원구', lat: 37.6542, lng: 127.0568, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '은평구', lat: 37.6027, lng: 126.9291, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '서대문구', lat: 37.5791, lng: 126.9368, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '마포구', lat: 37.5663, lng: 126.9019, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '양천구', lat: 37.5170, lng: 126.8665, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '강서구', lat: 37.5509, lng: 126.8497, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '구로구', lat: 37.4954, lng: 126.8874, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '금천구', lat: 37.4569, lng: 126.8955, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '영등포구', lat: 37.5264, lng: 126.8963, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '동작구', lat: 37.5124, lng: 126.9393, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '관악구', lat: 37.4784, lng: 126.9516, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '서초구', lat: 37.4837, lng: 127.0324, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '강남구', lat: 37.5172, lng: 127.0473, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '송파구', lat: 37.5145, lng: 127.1059, minZoom: 11, maxZoom: 14, kind: 'district' },
    { name: '강동구', lat: 37.5301, lng: 127.1238, minZoom: 11, maxZoom: 14, kind: 'district' }
  ];

  // --- DOM Elements ---
  const relicQuickSelect = document.getElementById('relic-quick-select');

  // Modal DOM
  const modal = document.getElementById('art-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-image');
  const modalImagePlaceholder = document.getElementById('modal-image-placeholder');
  const modalMediaTitle = document.getElementById('modal-media-title');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalLocation = document.getElementById('modal-location');
  const modalMuseum = document.getElementById('modal-museum');
  const modalDocent = document.getElementById('modal-docent');
  const modalContext = document.getElementById('modal-context');
  const modalExamTip = document.getElementById('modal-exam-tip');

  // Five-question practice DOM
  const quizScopeSelect = document.getElementById('quiz-scope-select');
  const quizLevelSelect = document.getElementById('quiz-level-select');
  const quizSessionStart = document.getElementById('quiz-session-start');
  const quizSessionModal = document.getElementById('quiz-session-modal');
  const quizSessionClose = document.getElementById('quiz-session-close');
  const quizSessionTitle = document.getElementById('quiz-session-title');
  const quizSessionProgress = document.getElementById('quiz-session-progress');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizSessionMedia = document.getElementById('quiz-session-media');
  const quizSessionImage = document.getElementById('quiz-session-image');
  const quizSessionEra = document.getElementById('quiz-session-era');
  const quizSessionQuestion = document.getElementById('quiz-session-question');
  const quizSessionOptions = document.getElementById('quiz-session-options');
  const quizSessionFeedback = document.getElementById('quiz-session-feedback');
  const quizSessionNext = document.getElementById('quiz-session-next');
  const quizSessionRestart = document.getElementById('quiz-session-restart');

  // Initialize App
  document.addEventListener('DOMContentLoaded', () => {
    initLeafletMap();
    initSmartFilters();
    initQuickSelectDropdown();
    initModalEvents();
    initQuizSession();
  });

  // --- 1. Leaflet Map Initialization & Markers ---
  function initLeafletMap() {
    if (typeof L === 'undefined') return;

    // Centered at Korean Peninsula & Manchuria Ji'an
    leafletMap = L.map('map-container', {
      center: [38.2, 127.5],
      zoom: 6,
      minZoom: 3,
      maxZoom: 14,
      zoomControl: true
    });

    // Use a label-free basemap so shops and restaurants do not compete with relics.
    // Korean administrative labels are rendered locally in a separate layer below.
    const CARTO_BASEMAP_KEY = 'cb1_2lqh_1_23aa6103cd67c20c2791ad29';
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png?key=' + CARTO_BASEMAP_KEY, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(leafletMap);

    leafletMap.createPane('adminLabels');
    // Keep administrative names readable above relic icons without intercepting
    // clicks or touch input intended for the markers below.
    leafletMap.getPane('adminLabels').style.zIndex = 625;
    leafletMap.getPane('adminLabels').style.pointerEvents = 'none';

    leafletMap.createPane('provinceBoundaries');
    leafletMap.getPane('provinceBoundaries').style.zIndex = 430;
    leafletMap.getPane('provinceBoundaries').style.pointerEvents = 'none';

    leafletMap.createPane('markerLinks');
    leafletMap.getPane('markerLinks').style.zIndex = 575;
    leafletMap.getPane('markerLinks').style.pointerEvents = 'none';

    mapProvinceBoundariesGroup = L.layerGroup().addTo(leafletMap);
    mapLabelsGroup = L.layerGroup().addTo(leafletMap);
    mapMarkerLinksGroup = L.layerGroup().addTo(leafletMap);
    mapMarkersGroup = L.featureGroup().addTo(leafletMap);

    loadProvinceBoundaries();
    renderMapLabels();
    loadSigunguLabels();
    renderMapMarkers();
    leafletMap.on('zoomend moveend', () => {
      renderMapLabels();
      resolveMarkerOverlaps();
    });

    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 200);

    window.addEventListener('resize', () => {
      if (leafletMap) leafletMap.invalidateSize();
    });
  }

  async function loadProvinceBoundaries() {
    try {
      const response = await fetch('data/skorea-provinces-topo-simple.json?v=20260730-1');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const topology = await response.json();
      const features = topologyToGeoJsonFeatures(topology);
      if (!features.length) throw new Error('No province boundary features');

      L.geoJSON({
        type: 'FeatureCollection',
        features
      }, {
        pane: 'provinceBoundaries',
        interactive: false,
        className: 'leaflet-province-boundaries',
        style: {
          color: '#59758b',
          weight: 1.35,
          opacity: 0.62,
          fill: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }).addTo(mapProvinceBoundariesGroup);

      leafletMap.attributionControl.addAttribution(
        '<a href="https://github.com/southkorea/southkorea-maps">시·도 경계: KOSTAT</a>'
      );
    } catch (error) {
      console.warn('시·도 경계선을 불러오지 못했습니다.', error);
    }
  }

  function topologyToGeoJsonFeatures(topology) {
    if (!topology || topology.type !== 'Topology' || !Array.isArray(topology.arcs)) return [];

    const object = Object.values(topology.objects || {})[0];
    if (!object || object.type !== 'GeometryCollection') return [];

    const transform = topology.transform || { scale: [1, 1], translate: [0, 0] };
    const decodedArcs = topology.arcs.map(arc => {
      let x = 0;
      let y = 0;
      return arc.map(point => {
        x += point[0];
        y += point[1];
        return [
          (x * transform.scale[0]) + transform.translate[0],
          (y * transform.scale[1]) + transform.translate[1]
        ];
      });
    });

    const joinArcs = arcIndexes => {
      const coordinates = [];
      arcIndexes.forEach((arcIndex, index) => {
        const arc = arcIndex >= 0
          ? decodedArcs[arcIndex]
          : decodedArcs[~arcIndex].slice().reverse();
        coordinates.push(...(index === 0 ? arc : arc.slice(1)));
      });
      return coordinates;
    };

    return object.geometries
      .filter(geometry => geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')
      .map(geometry => ({
        type: 'Feature',
        properties: geometry.properties || {},
        geometry: {
          type: geometry.type,
          coordinates: geometry.type === 'Polygon'
            ? geometry.arcs.map(joinArcs)
            : geometry.arcs.map(polygon => polygon.map(joinArcs))
        }
      }));
  }

  async function loadSigunguLabels() {
    try {
      const response = await fetch('data/korea-sigungu-centers.csv?v=20260730-7');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const bytes = await response.arrayBuffer();
      const csvText = new TextDecoder('euc-kr').decode(bytes);
      const retiredIncheonCodes = new Set(['28110', '28140', '28260']);

      const rawSigunguLabels = csvText
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map(line => line.split(','))
        .filter(columns => columns.length >= 5 && !retiredIncheonCodes.has(columns[2]))
        .map(columns => ({
          name: columns[columns.length - 1].trim(),
          lat: Number(columns[1]),
          lng: Number(columns[0]),
          minZoom: 8,
          maxZoom: 14,
          kind: 'municipality',
          code: columns[2]
        }))
        .filter(label => label.name && Number.isFinite(label.lat) && Number.isFinite(label.lng));

      // Seoul alone keeps district-level names. Outside Seoul, merge subdivided
      // cities (for example, "수원시 팔달구") into one city label and omit
      // metropolitan-city districts such as "부산진구".
      const municipalityGroups = new Map();
      rawSigunguLabels.forEach(label => {
        if (label.code.startsWith('11')) return;

        const subdividedCity = label.name.match(/^(.+시)\s+.+구$/u);
        const displayName = subdividedCity ? subdividedCity[1] : label.name;
        if (!subdividedCity && displayName.endsWith('구')) return;
        if (!/(시|군)$/u.test(displayName)) return;

        const group = municipalityGroups.get(displayName) || {
          name: displayName,
          latTotal: 0,
          lngTotal: 0,
          count: 0
        };
        group.latTotal += label.lat;
        group.lngTotal += label.lng;
        group.count += 1;
        municipalityGroups.set(displayName, group);
      });

      koreaSigunguLabels = Array.from(municipalityGroups.values(), group => ({
        name: group.name,
        lat: group.latTotal / group.count,
        lng: group.lngTotal / group.count,
        minZoom: 8,
        maxZoom: 14,
        kind: 'municipality'
      }));

      renderMapLabels();
    } catch (error) {
      console.warn('시·군·구 지도 이름을 불러오지 못했습니다.', error);
    }
  }

  function renderMapLabels() {
    if (!leafletMap || !mapLabelsGroup) return;

    const zoom = leafletMap.getZoom();
    const visibleBounds = leafletMap.getBounds().pad(0.15);
    const labels = KOREA_MAP_LABELS.concat(koreaSigunguLabels);
    const focusedLabel = findFocusedAdminLabel(visibleBounds, zoom);
    if (focusedLabel) labels.push(focusedLabel);
    mapLabelsGroup.clearLayers();

    labels.forEach(label => {
      if (zoom < label.minZoom || zoom > label.maxZoom) return;
      if (!visibleBounds.contains([label.lat, label.lng])) return;

      const icon = L.divIcon({
        className: 'map-admin-label-wrapper',
        html: `<span class="map-admin-label map-admin-label--${label.kind}">${label.name}</span>`,
        iconSize: null
      });

      mapLabelsGroup.addLayer(L.marker([label.lat, label.lng], {
        icon,
        pane: 'adminLabels',
        interactive: false
      }));
    });
  }

  function findFocusedAdminLabel(visibleBounds, zoom) {
    if (!currentActiveRelic || !koreaSigunguLabels.length || zoom < 10) return null;

    const relicText = `${currentActiveRelic.title} ${currentActiveRelic.location} ${currentActiveRelic.museum}`;
    const candidates = koreaSigunguLabels.filter(label => {
      const stem = label.name
        .replace(/^인천\s+/, '')
        .replace(/(특별자치시|특별시|광역시|시|군|구)$/u, '')
        .trim();
      return stem.length >= 2 && relicText.includes(stem);
    });
    if (!candidates.length) return null;

    candidates.sort((a, b) => {
      const distanceA = ((a.lat - currentActiveRelic.lat) ** 2) + ((a.lng - currentActiveRelic.lng) ** 2);
      const distanceB = ((b.lat - currentActiveRelic.lat) ** 2) + ((b.lng - currentActiveRelic.lng) ** 2);
      return distanceA - distanceB;
    });

    const match = candidates[0];
    if (visibleBounds.contains([match.lat, match.lng])) return null;

    return {
      ...match,
      lat: currentActiveRelic.lat,
      lng: currentActiveRelic.lng,
      kind: 'focus'
    };
  }

  const RELIC_SPECIFIC_SVG_MAP = {
    p01: `<svg viewBox="0 0 36 36"><path d="M8 7 Q18 4 28 7 L24 27 Q18 33 18 33 Q18 33 12 27 Z" fill="url(#p01g)" stroke="#fff" stroke-width="1.5"/><path d="M11 12 L25 12 M12 17 L24 17 M14 22 L22 22 M16 27 L20 27" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="2 2"/><ellipse cx="18" cy="7" rx="10" ry="2" fill="#92400e" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p01g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    p02: `<svg viewBox="0 0 36 36"><rect x="9" y="15" width="4" height="15" rx="1" fill="#64748b" stroke="#fff" stroke-width="1.2"/><rect x="23" y="15" width="4" height="15" rx="1" fill="#64748b" stroke="#fff" stroke-width="1.2"/><path d="M4 14 C4 11 18 9 32 11 C32 14 18 16 4 14 Z" fill="url(#p02g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="p02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient></defs></svg>`,
    p03: `<svg viewBox="0 0 36 36"><path d="M18 2 C20 7 24 11 25 16 C26 21 21 24 18 26 C15 24 10 21 11 16 C12 11 16 7 18 2 Z" fill="url(#p03g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="31" stroke="#a7f3d0" stroke-width="1.5"/><rect x="16" y="26" width="4" height="5" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="18" cy="32" r="2" fill="#fbbf24"/><defs><linearGradient id="p03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs></svg>`,
    p04: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="7" fill="url(#p04g)" stroke="#fff" stroke-width="1.5"/><path d="M18 3 L18 11 M18 25 L18 33 M3 18 L11 18 M25 18 L33 18 M7 7 L13 13 M23 23 L29 29 M7 29 L13 23 M23 13 L29 7" stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round"/><circle cx="18" cy="4" r="3" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="18" cy="32" r="3" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="4" cy="18" r="3" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="32" cy="18" r="3" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="8" cy="8" r="2.5" fill="#fbbf24"/><circle cx="28" cy="28" r="2.5" fill="#fbbf24"/><circle cx="8" cy="28" r="2.5" fill="#fbbf24"/><circle cx="28" cy="8" r="2.5" fill="#fbbf24"/><defs><linearGradient id="p04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#064e3b"/></linearGradient></defs></svg>`,
    p05: `<svg viewBox="0 0 36 36"><path d="M18 3 L28 19 C30 25 24 32 18 32 C12 32 6 25 8 19 Z" fill="url(#p05g)" stroke="#fff" stroke-width="1.5"/><path d="M18 3 L18 32 M18 3 L12 19 M18 3 L24 19 M12 19 L18 32 M24 19 L18 32" stroke="#fef08a" stroke-width="1" opacity="0.6"/><defs><linearGradient id="p05g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a16207"/><stop offset="100%" stop-color="#451a03"/></linearGradient></defs></svg>`,
    p06: `<svg viewBox="0 0 36 36"><path d="M11 6 L25 6 L23 13 Q29 20 23 30 L13 30 Q7 20 13 13 Z" fill="url(#p06g)" stroke="#fff" stroke-width="1.5"/><path d="M5 18 C5 14 9 14 11 16 M31 18 C31 14 27 14 25 16" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="18" cy="6" rx="7" ry="2" fill="#78350f" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p06g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    p07: `<svg viewBox="0 0 36 36"><path d="M4 16 Q18 4 32 16 Q26 30 18 30 Q10 30 4 16 Z" fill="url(#p07g)" stroke="#fff" stroke-width="1.5"/><circle cx="14" cy="17" r="2.5" fill="#0f172a" stroke="#fff" stroke-width="1"/><circle cx="22" cy="17" r="2.5" fill="#0f172a" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    p08: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="url(#p08g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="18" r="10" fill="none" stroke="#a7f3d0" stroke-width="1.5" stroke-dasharray="2 2"/><circle cx="14" cy="14" r="2.5" fill="#fbbf24" stroke="#fff" stroke-width="1"/><circle cx="22" cy="14" r="2.5" fill="#fbbf24" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p08g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#022c22"/></linearGradient></defs></svg>`,
    p09: `<svg viewBox="0 0 36 36"><path d="M18 2 L21 11 L21 24 L18 28 L15 24 L15 11 Z" fill="url(#p09g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="34" stroke="#ecfdf5" stroke-width="1.5"/><rect x="16" y="28" width="4" height="6" fill="#d97706"/><defs><linearGradient id="p09g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs></svg>`,
    p10: `<svg viewBox="0 0 36 36"><rect x="4" y="22" width="28" height="9" rx="1.5" fill="#78350f" stroke="#fff" stroke-width="1.5"/><rect x="8" y="14" width="20" height="8" rx="1" fill="#b45309" stroke="#fff" stroke-width="1.5"/><rect x="13" y="7" width="10" height="7" rx="1" fill="#fef08a" stroke="#fff" stroke-width="1.5"/></svg>`,
    p11: `<svg viewBox="0 0 36 36"><path d="M18 3 L2 29 L34 29 Z" fill="url(#p11g)" stroke="#fff" stroke-width="1.5"/><path d="M18 3 L18 29 M10 16 L26 16" stroke="#fde68a" stroke-width="1.5"/><rect x="14" y="21" width="8" height="8" fill="#451a03" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p11g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    g01: `<svg viewBox="0 0 36 36"><rect x="3" y="3" width="30" height="30" rx="4" fill="url(#g01g)" stroke="#fff" stroke-width="1.5"/><path d="M8 26 Q18 18 28 26 M14 20 L8 14 M22 14 L30 10 M14 14 L6 10" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="22" cy="11" r="3" fill="#fde68a"/><defs><linearGradient id="g01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient></defs></svg>`,
    g02: `<svg viewBox="0 0 36 36"><rect x="10" y="3" width="16" height="30" rx="2" fill="url(#g02g)" stroke="#fff" stroke-width="1.5"/><path d="M14 8 L22 8 M14 13 L22 13 M14 18 L22 18 M14 23 L22 23 M14 28 L22 28" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3 2"/><defs><linearGradient id="g02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs></svg>`,
    g03: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="url(#g03g)" stroke="#fff" stroke-width="1.5"/><path d="M18 8 C13 13 13 20 18 22 M15 22 L10 29 M18 22 L18 29 M21 22 L26 29" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="21" cy="13" r="2" fill="#fef08a"/><defs><linearGradient id="g03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f87171"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs></svg>`,
    g04: `<svg viewBox="0 0 36 36"><path d="M11 4 L25 4 L23 32 L13 32 Z" fill="url(#g04g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="7" x2="18" y2="29" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3 2"/><defs><linearGradient id="g04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    g05: `<svg viewBox="0 0 36 36"><rect x="2" y="25" width="32" height="7" fill="#64748b" stroke="#fff" stroke-width="1.2"/><rect x="6" y="19" width="24" height="6" fill="#475569" stroke="#fff" stroke-width="1.2"/><rect x="10" y="13" width="16" height="6" fill="#334155" stroke="#fff" stroke-width="1.2"/><rect x="14" y="7" width="8" height="6" fill="#1e293b" stroke="#fff" stroke-width="1.2"/><rect x="16" y="3" width="4" height="4" fill="#fde68a" stroke="#fff" stroke-width="1"/></svg>`,
    g06: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="url(#g06g)" stroke="#fff" stroke-width="1.5"/><path d="M10 14 C10 7 26 7 26 14 C26 21 10 21 10 28 M8 22 C16 30 28 22 28 22" stroke="#e9d5ff" stroke-width="2.5" fill="none" stroke-linecap="round"/><defs><linearGradient id="g06g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7e22ce"/><stop offset="100%" stop-color="#3b0764"/></linearGradient></defs></svg>`,
    b01: `<svg viewBox="0 0 36 36"><path d="M18 2 L22 8 L14 8 Z" fill="#fde68a" stroke="#fff" stroke-width="1"/><path d="M10 15 Q18 8 26 15 L23 23 Q18 28 13 23 Z" fill="url(#b01g)" stroke="#fff" stroke-width="1.5"/><path d="M18 23 L18 31 M11 33 L25 33 M13 30 L23 30" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="b01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs></svg>`,
    b02: `<svg viewBox="0 0 36 36"><path d="M4 31 C4 12 32 12 32 31 Z" fill="url(#b02g)" stroke="#fff" stroke-width="1.5"/><path d="M14 20 L22 20 L22 31 L14 31 Z" fill="#451a03" stroke="#fde68a" stroke-width="1.5"/><path d="M18 6 L21 11 L18 9 L15 11 Z" fill="#fbbf24"/><defs><linearGradient id="b02g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#92400e"/><stop offset="100%" stop-color="#451a03"/></linearGradient></defs></svg>`,
    b03: `<svg viewBox="0 0 36 36"><path d="M3 31 L33 31 M6 25 L30 25 M9 19 L27 19 M12 13 L24 13 M15 7 L21 7" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/><rect x="16" y="3" width="4" height="28" fill="#fed7aa" stroke="#fff" stroke-width="1"/></svg>`,
    b04: `<svg viewBox="0 0 36 36"><path d="M2 31 L34 31 M4 24 L32 24 M7 17 L29 17 M10 10 L26 10" stroke="#c2410c" stroke-width="3.5" stroke-linecap="round"/><rect x="16" y="5" width="4" height="26" fill="#fdba74" stroke="#fff" stroke-width="1"/></svg>`,
    b05: `<svg viewBox="0 0 36 36"><rect x="3" y="3" width="30" height="30" rx="4" fill="url(#b05g)" stroke="#fff" stroke-width="1.5"/><path d="M6 28 L14 16 L20 23 L26 13 L30 28 Z" fill="#f3e8ff"/><defs><linearGradient id="b05g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#581c87"/></linearGradient></defs></svg>`,
    a01: `<svg viewBox="0 0 36 36"><path d="M13 3 C13 1 23 1 23 3 L23 10 L13 10 Z" fill="#64748b" stroke="#fff" stroke-width="1.5"/><path d="M8 12 L28 12 L26 31 L10 31 Z" fill="url(#a01g)" stroke="#fff" stroke-width="1.5"/><line x1="8" y1="18" x2="28" y2="18" stroke="#f1f5f9" stroke-width="2"/><line x1="9" y1="24" x2="27" y2="24" stroke="#f1f5f9" stroke-width="2"/><defs><linearGradient id="a01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs></svg>`,
    s01: `<svg viewBox="0 0 36 36"><path d="M5 27 L31 27 L33 14 L26 21 L18 6 L10 21 L3 14 Z" fill="url(#s01g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="14" r="3" fill="#10b981" stroke="#fff" stroke-width="1"/><circle cx="10" cy="21" r="2.5" fill="#10b981" stroke="#fff" stroke-width="1"/><circle cx="26" cy="21" r="2.5" fill="#10b981" stroke="#fff" stroke-width="1"/><defs><linearGradient id="s01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs></svg>`,
    s02: `<svg viewBox="0 0 36 36"><rect x="4" y="8" width="28" height="20" rx="3" fill="url(#s02g)" stroke="#fff" stroke-width="1.5"/><line x1="8" y1="13" x2="28" y2="13" stroke="#e0e7ff" stroke-width="2"/><line x1="8" y1="18" x2="28" y2="18" stroke="#e0e7ff" stroke-width="2"/><line x1="8" y1="23" x2="22" y2="23" stroke="#e0e7ff" stroke-width="2"/><defs><linearGradient id="s02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs></svg>`,
    s03: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="#fef08a" opacity="0.35"/><circle cx="18" cy="12" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/><path d="M10 29 C10 20 26 20 26 29 Z" fill="url(#s03g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="s03g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    s04: `<svg viewBox="0 0 36 36"><rect x="3" y="6" width="30" height="24" rx="4" fill="url(#s04g)" stroke="#fff" stroke-width="1.5"/><path d="M8 22 Q15 12 28 16 Q20 26 10 24 Z" fill="#ffffff"/><defs><linearGradient id="s04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#581c87"/></linearGradient></defs></svg>`,
    s05: `<svg viewBox="0 0 36 36"><path d="M11 31 L13 9 L23 9 L25 31 Z" fill="url(#s05g)" stroke="#fff" stroke-width="1.5"/><rect x="15" y="16" width="6" height="6" fill="#fef08a" stroke="#fff" stroke-width="1"/><rect x="9" y="31" width="18" height="3" rx="1" fill="#1e3a8a" stroke="#fff" stroke-width="1"/><defs><linearGradient id="s05g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs></svg>`,
    s06: `<svg viewBox="0 0 36 36"><path d="M3 32 L33 32 M5 28 L31 28 M6 24 L30 24 M7 20 L29 20 M8 16 L28 16 M9 12 L27 12 M10 8 L26 8 M12 4 L24 4" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    s07: `<svg viewBox="0 0 36 36"><rect x="5" y="22" width="26" height="10" rx="1" fill="#7c2d12" stroke="#fff" stroke-width="1.5"/><rect x="9" y="14" width="18" height="8" rx="1" fill="#ea580c" stroke="#fff" stroke-width="1.5"/><rect x="13" y="7" width="10" height="7" rx="1" fill="#fdba74" stroke="#fff" stroke-width="1.5"/><rect x="15" y="24" width="6" height="8" fill="#fef08a" stroke="#fff" stroke-width="1"/></svg>`,
    s08: `<svg viewBox="0 0 36 36"><path d="M4 31 L32 31 L26 24 L10 24 Z" fill="#1e293b"/><rect x="13" y="4" width="10" height="20" fill="url(#s08g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="s08g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs></svg>`,
    s09: `<svg viewBox="0 0 36 36"><rect x="13" y="4" width="10" height="28" rx="2" fill="url(#s09g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="8" x2="18" y2="28" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3 2"/><defs><linearGradient id="s09g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    s10: `<svg viewBox="0 0 36 36"><polygon points="18,3 27,8 27,28 18,33 9,28 9,8" fill="url(#s10g)" stroke="#fff" stroke-width="1.5"/><path d="M18 12 L18 4 M14 7 L22 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/><defs><linearGradient id="s10g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs></svg>`,
    s11: `<svg viewBox="0 0 36 36"><path d="M11 14 C11 4 25 4 25 14 L27 28 C27 32 9 32 9 28 Z" fill="url(#s11g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="4" r="3" fill="#78350f"/><path d="M13 23 Q18 27 23 23" stroke="#fde68a" stroke-width="2.5" fill="none"/><defs><linearGradient id="s11g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/></linearGradient></defs></svg>`,
    s12: `<svg viewBox="0 0 36 36"><polygon points="18,3 30,10 30,26 18,33 6,26 6,10" fill="url(#s12g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="3" x2="18" y2="33" stroke="#78350f" stroke-width="1.5"/><line x1="6" y1="10" x2="30" y2="26" stroke="#78350f" stroke-width="1.5"/><defs><linearGradient id="s12g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs></svg>`,
    s13: `<svg viewBox="0 0 36 36"><path d="M10 32 L26 32 M12 27 L24 27 M14 16 L22 16 L22 27 L14 27 Z" fill="#ca8a04" stroke="#fff" stroke-width="1.5"/><polygon points="18,4 28,11 8,11" fill="#854d0e" stroke="#fff" stroke-width="1.5"/></svg>`,
    s14: `<svg viewBox="0 0 36 36"><circle cx="12" cy="13" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="24" cy="13" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1"/><path d="M7 30 C7 20 17 20 17 30 Z M19 30 C19 20 29 20 29 30 Z" fill="url(#s14g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="s14g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#854d0e"/></linearGradient></defs></svg>`,
    s15: `<svg viewBox="0 0 36 36"><path d="M3 31 L16 31 M5 24 L14 24 M7 17 L12 17" stroke="#ea580c" stroke-width="3"/><path d="M20 31 L33 31 M22 24 L31 24 M24 17 L29 17" stroke="#fdba74" stroke-width="3"/></svg>`,
    s16: `<svg viewBox="0 0 36 36"><path d="M6 11 C6 28 30 28 30 11 Z" fill="url(#s16g)" stroke="#fff" stroke-width="1.5"/><text x="18" y="21" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">壺</text><defs><linearGradient id="s16g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0f766e"/></linearGradient></defs></svg>`,
    s17: `<svg viewBox="0 0 36 36"><rect x="4" y="4" width="28" height="28" rx="4" fill="url(#s17g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="13" r="4" fill="#fde68a"/><path d="M13 28 L18 19 L23 28 Z" fill="#fde68a"/><defs><linearGradient id="s17g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#581c87"/></linearGradient></defs></svg>`,
    k01: `<svg viewBox="0 0 36 36"><path d="M13 4 L23 4 Q30 11 25 24 L20 32 L16 32 L11 24 Q6 11 13 4 Z" fill="url(#k01g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="14" r="3.5" fill="none" stroke="#ffffff" stroke-width="1.5"/><path d="M15 14 L21 14" stroke="#ffffff" stroke-width="1.2"/><defs><linearGradient id="k01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="100%" stop-color="#0f766e"/></linearGradient></defs></svg>`,
    k02: `<svg viewBox="0 0 36 36"><rect x="6" y="11" width="24" height="14" rx="1.5" fill="url(#k02g)" stroke="#fff" stroke-width="1.5"/><rect x="2" y="9" width="4" height="18" fill="#1e1b4b" stroke="#fff" stroke-width="1"/><rect x="30" y="9" width="4" height="18" fill="#1e1b4b" stroke="#fff" stroke-width="1"/><defs><linearGradient id="k02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs></svg>`,
    k03: `<svg viewBox="0 0 36 36"><rect x="6" y="4" width="24" height="28" rx="2.5" fill="url(#k03g)" stroke="#fff" stroke-width="1.5"/><rect x="10" y="8" width="6" height="7" fill="#c7d2fe"/><rect x="20" y="8" width="6" height="7" fill="#c7d2fe"/><rect x="10" y="19" width="6" height="7" fill="#c7d2fe"/><rect x="20" y="19" width="6" height="7" fill="#c7d2fe"/><defs><linearGradient id="k03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient></defs></svg>`,
    k04: `<svg viewBox="0 0 36 36"><line x1="18" y1="2" x2="18" y2="34" stroke="#a7f3d0" stroke-width="3"/><path d="M18 9 L25 5 M18 16 L11 12 M18 21 L25 17 M18 26 L11 22" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    k05: `<svg viewBox="0 0 36 36"><polygon points="18,2 28,7 28,29 18,34 8,29 8,7" fill="none" stroke="#ea580c" stroke-width="2"/><line x1="8" y1="12" x2="28" y2="12" stroke="#fdba74" stroke-width="2"/><line x1="8" y1="18" x2="28" y2="18" stroke="#fdba74" stroke-width="2"/><line x1="8" y1="24" x2="28" y2="24" stroke="#fdba74" stroke-width="2"/></svg>`,
    k06: `<svg viewBox="0 0 36 36"><rect x="15" y="3" width="6" height="30" fill="#e2e8f0"/><path d="M8 30 L28 30 M9 24 L27 24 M10 18 L26 18 M11 12 L25 12 M12 6 L24 6" stroke="#ea580c" stroke-width="2.5"/></svg>`,
    k07: `<svg viewBox="0 0 36 36"><rect x="11" y="2" width="14" height="7" fill="#854d0e" stroke="#fff" stroke-width="1.2"/><circle cx="18" cy="14" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.2"/><path d="M13 19 L13 34 L23 34 L23 19 Z" fill="url(#k07g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="k07g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    k08: `<svg viewBox="0 0 36 36"><path d="M2 16 L18 6 L34 16 L30 16 L30 30 L6 30 L6 16 Z" fill="url(#k08g)" stroke="#fff" stroke-width="1.5"/><line x1="12" y1="16" x2="12" y2="30" stroke="#fde68a" stroke-width="2.5"/><line x1="24" y1="16" x2="24" y2="30" stroke="#fde68a" stroke-width="2.5"/><defs><linearGradient id="k08g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs></svg>`,
    j01: `<svg viewBox="0 0 36 36"><rect x="5" y="4" width="26" height="28" rx="3" fill="url(#j01g)" stroke="#fff" stroke-width="1.5"/><text x="12" y="18" font-size="12" font-weight="bold" fill="#fff">ㄱ</text><text x="20" y="27" font-size="12" font-weight="bold" fill="#fde68a">ㅏ</text><defs><linearGradient id="j01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient></defs></svg>`,
    j02: `<svg viewBox="0 0 36 36"><rect x="6" y="20" width="24" height="12" rx="2" fill="url(#j02g)" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11" r="5" fill="#60a5fa" stroke="#fff" stroke-width="1"/><circle cx="24" cy="11" r="5" fill="#60a5fa" stroke="#fff" stroke-width="1"/><defs><linearGradient id="j02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs></svg>`,
    j03: `<svg viewBox="0 0 36 36"><rect x="4" y="6" width="28" height="24" rx="3" fill="url(#j03g)" stroke="#fff" stroke-width="1.5"/><path d="M6 26 Q13 13 20 21 Q25 10 30 26 Z" fill="#fbcfe8"/><defs><linearGradient id="j03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#831843"/></linearGradient></defs></svg>`,
    j04: `<svg viewBox="0 0 36 36"><path d="M4 32 L32 32 L32 20 L4 20 Z" fill="#334155" stroke="#fff" stroke-width="1.5"/><path d="M13 32 A5 5 0 0 1 23 32 Z" fill="#0f172a"/><path d="M6 20 L18 11 L30 20 Z" fill="#ef4444" stroke="#fff" stroke-width="1.5"/><path d="M9 11 L18 4 L27 11 Z" fill="#b91c1c" stroke="#fff" stroke-width="1.5"/></svg>`,
    j05: `<svg viewBox="0 0 36 36"><path d="M4 32 A14 14 0 0 1 32 32 Z" fill="none" stroke="#ef4444" stroke-width="3.5"/><path d="M11 20 L18 13 L25 20 Z" fill="#ef4444" stroke="#fff" stroke-width="1.5"/></svg>`,
    j06: `<svg viewBox="0 0 36 36"><path d="M2 18 L18 7 L34 18 L30 18 L30 31 L6 31 L6 18 Z" fill="url(#j06g)" stroke="#fff" stroke-width="1.5"/><path d="M5 11 L18 2 L31 11 Z" fill="#991b1b" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="j06g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient></defs></svg>`,
    j07: `<svg viewBox="0 0 36 36"><rect x="4" y="5" width="28" height="26" rx="3" fill="url(#j07g)" stroke="#fff" stroke-width="1.5"/><circle cx="23" cy="15" r="6" fill="#c7d2fe"/><circle cx="11" cy="20" r="4" fill="#c7d2fe"/><defs><linearGradient id="j07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient></defs></svg>`,
    j08: `<svg viewBox="0 0 36 36"><rect x="5" y="5" width="26" height="26" rx="3" fill="#0f172a" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="18" r="9" fill="none" stroke="#60a5fa" stroke-dasharray="3 2"/><circle cx="18" cy="13" r="1.5" fill="#fff"/><circle cx="23" cy="18" r="1.5" fill="#fff"/><circle cx="14" cy="22" r="1.5" fill="#fff"/></svg>`,
    j09: `<svg viewBox="0 0 36 36"><rect x="5" y="4" width="26" height="28" rx="3" fill="url(#j09g)" stroke="#fff" stroke-width="1.5"/><path d="M13 8 L21 13 L18 22 L23 27 L16 27 Z" fill="#c7d2fe"/><defs><linearGradient id="j09g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs></svg>`,
    j10: `<svg viewBox="0 0 36 36"><ellipse cx="18" cy="18" rx="15" ry="11" fill="url(#j10g)" stroke="#fff" stroke-width="1.5"/><ellipse cx="12" cy="18" rx="5" ry="7" fill="#60a5fa"/><ellipse cx="24" cy="18" rx="5" ry="7" fill="#60a5fa"/><defs><linearGradient id="j10g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs></svg>`,
    j11: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="13" fill="none" stroke="#60a5fa" stroke-width="2.5"/><ellipse cx="18" cy="18" rx="13" ry="5" fill="none" stroke="#fbbf24" stroke-width="2.5"/><ellipse cx="18" cy="18" rx="5" ry="13" fill="none" stroke="#fbbf24" stroke-width="2.5"/></svg>`,
    j12: `<svg viewBox="0 0 36 36"><rect x="12" y="6" width="12" height="20" fill="url(#j12g)" stroke="#fff" stroke-width="1.5"/><rect x="8" y="26" width="20" height="6" fill="#475569" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="j12g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs></svg>`,
    j13: `<svg viewBox="0 0 36 36"><path d="M4 16 A14 14 0 0 0 32 16 Z" fill="url(#j13g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="16" x2="26" y2="6" stroke="#fde68a" stroke-width="3" stroke-linecap="round"/><defs><linearGradient id="j13g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs></svg>`,
    j14: `<svg viewBox="0 0 36 36"><rect x="6" y="5" width="24" height="26" rx="3" fill="#1e3a8a" stroke="#fff" stroke-width="1.5"/><circle cx="13" cy="13" r="2.5" fill="#fde68a"/><circle cx="23" cy="13" r="2.5" fill="#60a5fa"/><circle cx="18" cy="23" r="2.5" fill="#ef4444"/></svg>`,
    j15: `<svg viewBox="0 0 36 36"><rect x="4" y="6" width="28" height="24" rx="3" fill="url(#j15g)" stroke="#fff" stroke-width="1.5"/><path d="M6 26 L15 11 L22 20 L28 13 L30 26 Z" fill="#831843"/><defs><linearGradient id="j15g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#500724"/></linearGradient></defs></svg>`,
    j16: `<svg viewBox="0 0 36 36"><rect x="5" y="4" width="26" height="28" rx="2" fill="none" stroke="#60a5fa" stroke-width="2"/><rect x="15" y="6" width="6" height="24" fill="#e2e8f0" stroke="#fff" stroke-width="1"/></svg>`,
    j17: `<svg viewBox="0 0 36 36"><path d="M3 30 L33 30 L33 22 L28 22 L28 25 L23 25 L23 22 L18 22 L18 25 L13 25 L13 22 L8 22 L8 25 L3 25 Z" fill="#ef4444" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="13" r="5" stroke="#fde68a" stroke-width="2.5" fill="none"/></svg>`,
    j18: `<svg viewBox="0 0 36 36"><path d="M13 6 Q25 13 20 30 L16 30 Q11 13 13 6 Z" fill="url(#j18g)" stroke="#fff" stroke-width="1.5"/><path d="M14 20 Q18 17 21 20" stroke="#0f172a" stroke-width="2.5" fill="none"/><defs><linearGradient id="j18g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0f766e"/></linearGradient></defs></svg>`,
    j19: `<svg viewBox="0 0 36 36"><rect x="6" y="6" width="24" height="7" rx="1.5" fill="#6366f1" stroke="#fff" stroke-width="1.5"/><rect x="6" y="15" width="24" height="7" rx="1.5" fill="#4f46e5" stroke="#fff" stroke-width="1.5"/><rect x="6" y="24" width="24" height="7" rx="1.5" fill="#312e81" stroke="#fff" stroke-width="1.5"/></svg>`,
    j20: `<svg viewBox="0 0 36 36"><rect x="4" y="6" width="28" height="24" rx="3" fill="url(#j20g)" stroke="#fff" stroke-width="1.5"/><circle cx="13" cy="15" r="3.5" fill="#fbcfe8"/><path d="M6 27 Q18 22 30 27" stroke="#831843" stroke-width="2.5" fill="none"/><defs><linearGradient id="j20g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#831843"/></linearGradient></defs></svg>`,
    l01: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="#ec4899" opacity="0.35"/><circle cx="14" cy="18" r="4" fill="#be185d"/><circle cx="22" cy="18" r="4" fill="#be185d"/></svg>`,
    l02: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="13" fill="url(#l02g)" stroke="#ffffff" stroke-width="2"/><defs><linearGradient id="l02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient></defs></svg>`,
    l03: `<svg viewBox="0 0 36 36"><rect x="4" y="6" width="7" height="24" fill="#6366f1" stroke="#fff" stroke-width="1"/><rect x="11" y="6" width="7" height="24" fill="#4f46e5" stroke="#fff" stroke-width="1"/><rect x="18" y="6" width="7" height="24" fill="#6366f1" stroke="#fff" stroke-width="1"/><rect x="25" y="6" width="7" height="24" fill="#4f46e5" stroke="#fff" stroke-width="1"/></svg>`,
    l04: `<svg viewBox="0 0 36 36"><rect x="4" y="6" width="28" height="24" rx="3" fill="url(#l04g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="6" x2="18" y2="22" stroke="#fbcfe8" stroke-width="2.5"/><circle cx="18" cy="25" r="3.5" fill="#fbcfe8"/><defs><linearGradient id="l04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#831843"/></linearGradient></defs></svg>`,
    m01: `<svg viewBox="0 0 36 36"><path d="M6 32 L6 8 L30 8 L30 32 L23 32 L23 20 A5 5 0 0 0 13 20 L13 32 Z" fill="url(#m01g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="m01g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs></svg>`,
    m02: `<svg viewBox="0 0 36 36"><rect x="9" y="4" width="18" height="28" fill="#f8fafc" stroke="#fff" stroke-width="1.5"/><path d="M14 23 Q18 19 22 23 L22 29 L14 29 Z" fill="#ef4444"/></svg>`,
    m03: `<svg viewBox="0 0 36 36"><rect x="5" y="9" width="26" height="23" fill="url(#m03g)" stroke="#fff" stroke-width="1.5"/><path d="M9 15 A4 4 0 0 1 17 15 Z M19 15 A4 4 0 0 1 27 15 Z" fill="#bae6fd"/><defs><linearGradient id="m03g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#075985"/></linearGradient></defs></svg>`,
    m04: `<svg viewBox="0 0 36 36"><rect x="10" y="5" width="16" height="26" rx="2.5" fill="url(#m04g)" stroke="#fff" stroke-width="1.5"/><text x="18" y="21" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">和</text><defs><linearGradient id="m04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    m05: `<svg viewBox="0 0 36 36"><rect x="5" y="4" width="26" height="28" fill="#f8fafc" stroke="#1e293b" stroke-width="1.5"/><rect x="8" y="7" width="20" height="5" fill="#0284c7"/><line x1="8" y1="16" x2="28" y2="16" stroke="#64748b" stroke-width="2"/><line x1="8" y1="21" x2="28" y2="21" stroke="#64748b" stroke-width="2"/><line x1="8" y1="26" x2="22" y2="26" stroke="#64748b" stroke-width="2"/></svg>`,
    m06: `<svg viewBox="0 0 36 36"><polygon points="18,5 3,12 33,12" fill="#0284c7" stroke="#fff" stroke-width="1.5"/><rect x="5" y="12" width="26" height="18" fill="#bae6fd"/><line x1="9" y1="12" x2="9" y2="30" stroke="#fff" stroke-width="2"/><line x1="15" y1="12" x2="15" y2="30" stroke="#fff" stroke-width="2"/><line x1="21" y1="12" x2="21" y2="30" stroke="#fff" stroke-width="2"/><line x1="27" y1="12" x2="27" y2="30" stroke="#fff" stroke-width="2"/></svg>`,
    m07: `<svg viewBox="0 0 36 36"><rect x="6" y="4" width="24" height="28" rx="2.5" fill="url(#m07g)" stroke="#fff" stroke-width="1.5"/><text x="18" y="21" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">3·1</text><defs><linearGradient id="m07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs></svg>`
  };

  function getRelicCategoryInfo(relic) {
    const title = relic.title || '';
    const id = relic.id || '';
    const customSvg = RELIC_SPECIFIC_SVG_MAP[id] || null;

    // 1. 과학 기구 (첨성대, 자격루, 천상열차, 앙부일구, 측우기, 혼천시계, 칠정산, 거중기)
    if (/첨성대|자격루|천상열차|앙부일구|측우기|혼천|칠정산|거중기/u.test(title)) {
      return { category: 'science', icon: '🔭', relicSvg: customSvg, label: '과학·천문', bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', border: '#60a5fa', shadow: 'rgba(37, 99, 235, 0.65)' };
    }

    // 2. 석탑 / 목탑 (석탑, 목탑)
    if (/석탑|목탑/u.test(title)) {
      return { category: 'pagoda', icon: '🛕', relicSvg: customSvg, label: '석탑·목탑', bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)', border: '#fdba74', shadow: 'rgba(234, 88, 12, 0.65)' };
    }

    // 3. 불상 / 석등 (본존불|은진미륵|이불병좌상|석등|마애삼존불)
    if (/불상|불|미륵|석등|이불병좌상/u.test(title)) {
      return { category: 'buddha', icon: '🪷', relicSvg: customSvg, label: '불상·석등', bg: 'linear-gradient(135deg, #854d0e 0%, #eab308 100%)', border: '#fef08a', shadow: 'rgba(234, 179, 8, 0.65)' };
    }

    // 4. 비석 / 금석문 (비|비문|순수비|순교비|임신서기석|유묵|척화비)
    if (/비|비문|순수비|순교비|서기석|유묵|척화비/u.test(title)) {
      return { category: 'stele', icon: '📜', relicSvg: customSvg, label: '비석·금석문', bg: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', border: '#cbd5e1', shadow: 'rgba(71, 85, 105, 0.65)' };
    }

    // 5. 무기 / 동검 / 방울 / 갑옷 / 거울 (동검, 칠지도, 무기, 갑옷, 팔주령, 거울)
    if (/동검|칠지도|갑옷|방울|팔주령|거울|다뉴세문경/u.test(title)) {
      return { category: 'weapon', icon: '⚔️', relicSvg: customSvg, label: '동검·무기·의례구', bg: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', border: '#6ee7b7', shadow: 'rgba(16, 185, 129, 0.65)' };
    }

    // 6. 도자기 / 향로 / 매병 / 항아리 (청자, 백자, 분청사기, 향로, 달항아리)
    if (/청자|백자|분청사기|향로|달항아리|그릇|병/u.test(title)) {
      return { category: 'celadon', icon: '🏺', relicSvg: customSvg, label: '도자기·향로', bg: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)', border: '#99f6e4', shadow: 'rgba(20, 184, 166, 0.65)' };
    }

    // 7. 금관 / 왕실 공예 / 장신구 / 범종 (금관, 관식, 주령구, 범종, 에밀레종)
    if (/금관|관식|주령구|종|에밀레종/u.test(title)) {
      if (/종|에밀레종/u.test(title)) {
        return { category: 'bell', icon: '🔔', relicSvg: customSvg, label: '범종·공예', bg: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', border: '#fde68a', shadow: 'rgba(245, 158, 11, 0.65)' };
      }
      return { category: 'crown', icon: '👑', relicSvg: customSvg, label: '금관·왕실공예', bg: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)', border: '#fde68a', shadow: 'rgba(245, 158, 11, 0.65)' };
    }

    // 8. 서책 / 대장경 / 지도 / 문서 (해례본, 대장경, 직지, 실록, 지도, 선언서, 독립신문, 다라니경, 서명문)
    if (/해례본|대장경|직지|실록|지도|선언서|신문|다라니경|서명문/u.test(title)) {
      return { category: 'book', icon: '📚', relicSvg: customSvg, label: '기록유산·지도·서책', bg: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)', border: '#c7d2fe', shadow: 'rgba(99, 102, 241, 0.65)' };
    }

    // 9. 궁궐 / 성문 / 근대 건축 / 독도 (숭례문, 흥인지문, 경복궁, 화성, 석조전, 독립문, 독도, 무량수전, 참성단, 청사)
    if (/숭례문|흥인지문|경복궁|화성|석조전|독립문|청사|독도|무량수전|참성단/u.test(title)) {
      if (/독도/u.test(title)) {
        return { category: 'nature', icon: '🏝️', relicSvg: customSvg, label: '자연·영토', bg: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)', border: '#bae6fd', shadow: 'rgba(56, 189, 248, 0.65)' };
      }
      return { category: 'palace', icon: '🏯', relicSvg: customSvg, label: '궁궐·성문·건축', bg: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)', border: '#fca5a5', shadow: 'rgba(239, 68, 68, 0.65)' };
    }

    // 10. 무덤 / 고분 / 벽화 (무덤, 왕릉, 고분, 벽화, 장군총, 사신도, 수렵도, 천마도, 벽돌)
    if (/무덤|왕릉|고분|벽화|장군총|사신도|수렵도|천마도|벽돌|묘/u.test(title)) {
      return { category: 'tomb', icon: '🎨', relicSvg: customSvg, label: '고분·무덤·벽화', bg: 'linear-gradient(135deg, #581c87 0%, #9333ea 100%)', border: '#e9d5ff', shadow: 'rgba(147, 51, 234, 0.65)' };
    }

    // 11. 회화 / 미술 (산수화, 몽유도원도, 인왕제색도, 씨름도, 단오풍정, 고사관수도)
    if (/도|화|그림/u.test(title)) {
      return { category: 'art', icon: '🖼️', relicSvg: customSvg, label: '회화·미술', bg: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)', border: '#fbcfe8', shadow: 'rgba(236, 72, 153, 0.65)' };
    }

    // 12. 토기 / 석기 / 움집 / 고인돌 (토기, 돌, 움집, 주먹도끼, 돌칼, 고인돌)
    if (/토기|돌|움집|주먹도끼|돌칼|고인돌/u.test(title)) {
      if (/고인돌|움집/u.test(title)) {
        return { category: 'dolmen', icon: '🪨', relicSvg: customSvg, label: '고인돌·움집', bg: 'linear-gradient(135deg, #78350f 0%, #a16207 100%)', border: '#fef08a', shadow: 'rgba(161, 98, 7, 0.65)' };
      }
      return { category: 'pottery', icon: '🏺', relicSvg: customSvg, label: '토기·석기', bg: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)', border: '#fde68a', shadow: 'rgba(217, 119, 6, 0.65)' };
    }

    // Default fallback
    return { category: 'general', icon: '🏛️', relicSvg: customSvg, label: '유물·유적', bg: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)', border: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.65)' };
  }

  function renderMapMarkers() {
    if (!leafletMap || !mapMarkersGroup || !window.KOREAN_MUSEUM_DATA) return;

    // Clear existing markers
    mapMarkersGroup.clearLayers();
    if (mapMarkerLinksGroup) mapMarkerLinksGroup.clearLayers();
    mapMarkerEntries = [];

    const relics = window.KOREAN_MUSEUM_DATA.relicsMaster;
    if (!relics || !relics.length) return;

    relics.forEach(relic => {
      // Check filters
      const matchEra = (activeEraFilter === 'all' || relic.eraCategory === activeEraFilter);
      if (!matchEra) return;

      const catInfo = getRelicCategoryInfo(relic);
      const imgUrl = window.KOREAN_MUSEUM_DATA?.makeArtifactTextureSVG
        ? window.KOREAN_MUSEUM_DATA.makeArtifactTextureSVG(relic.id)
        : `assets/relics/${relic.id}.jpg`;

      const eraColors = {
        prehistoric: '#d97706',
        three_kingdoms: '#dc2626',
        unified_silla: '#b45309',
        goryeo: '#0d9488',
        joseon: '#2563eb',
        modern: '#0284c7'
      };
      const eraBorder = eraColors[relic.eraCategory] || '#f59e0b';

      // Custom Tailored Vector SVG Icon Pin
      const pinIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `
          <div class="custom-relic-pin relic-icon-pin"
               style="background: #0f172a; border: 2.5px solid ${eraBorder}; box-shadow: 0 0 14px ${eraBorder}dd;"
               title="${relic.title} (${catInfo.label})">
            <div class="pin-pulse" style="border-color: ${eraBorder};"></div>
            <div class="relic-icon-inner">
              ${catInfo.relicSvg || `<span class="pin-emoji-fallback">${catInfo.icon}</span>`}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([relic.lat, relic.lng], { icon: pinIcon })
        .bindTooltip(`
          <div class="relic-tooltip-box">
            <div class="relic-tooltip-head">
              <span class="relic-tooltip-icon">${catInfo.relicSvg || catInfo.icon}</span>
              <span class="relic-tooltip-tag">${catInfo.label}</span>
            </div>
            <strong class="relic-tooltip-title">${relic.title}</strong>
            <small class="relic-tooltip-loc">📍 ${relic.location}</small>
          </div>
        `, { direction: 'top', offset: [0, -16], className: 'custom-relic-tooltip' });

      marker.on('click', () => {
        openRelicModal(relic);
      });

      mapMarkersGroup.addLayer(marker);
      mapMarkerEntries.push({
        relic,
        marker,
        originalLatLng: L.latLng(relic.lat, relic.lng)
      });
    });

    resolveMarkerOverlaps();

    // Automatically adjust zoom/bounds safely
    if (activeEraFilter !== 'all') {
      if (mapMarkersGroup.getLayers().length > 0) {
        leafletMap.fitBounds(mapMarkersGroup.getBounds(), { padding: [60, 60], maxZoom: 9 });
      }
    } else {
      // Default view comfortably frames Korean Peninsula & Manchuria Ji'an (Gwanggaeto Stele)
      leafletMap.setView([38.2, 127.5], 6);
    }
  }

  function resolveMarkerOverlaps() {
    if (!leafletMap || !mapMarkerEntries.length || !mapMarkerLinksGroup) return;

    const collisionDistance = 50;
    const markerSpacing = 56;
    const mapSize = leafletMap.getSize();
    const visibleBounds = leafletMap.getBounds().pad(0.12);
    mapMarkerLinksGroup.clearLayers();

    mapMarkerEntries.forEach(entry => {
      entry.marker.setLatLng(entry.originalLatLng);
    });

    const visibleEntries = mapMarkerEntries
      .filter(entry => visibleBounds.contains(entry.originalLatLng))
      .map(entry => ({
        ...entry,
        point: leafletMap.latLngToContainerPoint(entry.originalLatLng)
      }));

    const parents = visibleEntries.map((_, index) => index);
    const find = index => {
      while (parents[index] !== index) {
        parents[index] = parents[parents[index]];
        index = parents[index];
      }
      return index;
    };
    const union = (left, right) => {
      const leftRoot = find(left);
      const rightRoot = find(right);
      if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
    };

    for (let left = 0; left < visibleEntries.length; left += 1) {
      for (let right = left + 1; right < visibleEntries.length; right += 1) {
        if (visibleEntries[left].point.distanceTo(visibleEntries[right].point) < collisionDistance) {
          union(left, right);
        }
      }
    }

    const clusters = new Map();
    visibleEntries.forEach((entry, index) => {
      const root = find(index);
      const cluster = clusters.get(root) || [];
      cluster.push(entry);
      clusters.set(root, cluster);
    });

    clusters.forEach(cluster => {
      if (cluster.length < 2) return;

      cluster.sort((left, right) => left.relic.id.localeCompare(right.relic.id));
      const center = cluster.reduce(
        (sum, entry) => L.point(sum.x + entry.point.x, sum.y + entry.point.y),
        L.point(0, 0)
      ).divideBy(cluster.length);
      const radius = Math.max(
        32,
        Math.min(118, markerSpacing / (2 * Math.sin(Math.PI / cluster.length)))
      );

      L.circleMarker(leafletMap.containerPointToLatLng(center), {
        pane: 'markerLinks',
        interactive: false,
        radius: 3,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillColor: '#a96a00',
        fillOpacity: 0.9
      }).addTo(mapMarkerLinksGroup);
      cluster.forEach((entry, index) => {
        const angle = (-Math.PI / 2) + ((Math.PI * 2 * index) / cluster.length);
        const targetPoint = L.point(
          Math.max(24, Math.min(mapSize.x - 24, center.x + (Math.cos(angle) * radius))),
          Math.max(24, Math.min(mapSize.y - 24, center.y + (Math.sin(angle) * radius)))
        );
        const displayLatLng = leafletMap.containerPointToLatLng(targetPoint);

        entry.marker.setLatLng(displayLatLng);
        L.polyline([entry.originalLatLng, displayLatLng], {
          pane: 'markerLinks',
          interactive: false,
          className: 'relic-marker-link',
          color: '#a96a00',
          weight: 1.4,
          opacity: 0.58,
          dashArray: '3 4'
        }).addTo(mapMarkerLinksGroup);
      });
    });
  }

  // --- 3. Smart Filtering & Quick Select System ---
  function initSmartFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-filter-type');
        const val = btn.getAttribute('data-value');

        // Update active class in group
        btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (type === 'era') {
          activeEraFilter = val;
        }

        renderMapMarkers();
      });
    });
  }

  function initQuickSelectDropdown() {
    if (!relicQuickSelect || !window.KOREAN_MUSEUM_DATA) return;

    const relics = window.KOREAN_MUSEUM_DATA.relicsMaster;

    // Reset dropdown
    relicQuickSelect.innerHTML = '<option value="">✨ 유물·유적 빠른 탐색 (아이콘별 이동)</option>';

    relics.forEach(relic => {
      const catInfo = getRelicCategoryInfo(relic);
      const opt = document.createElement('option');
      opt.value = relic.id;
      opt.textContent = `${catInfo.icon} [${relic.era.split(' ')[0]}] ${relic.title} (${relic.location})`;
      relicQuickSelect.appendChild(opt);
    });

    relicQuickSelect.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      if (!selectedId) return;

      const relic = relics.find(r => r.id === selectedId);
      if (relic && leafletMap) {
        currentActiveRelic = relic;

        // Reset filters if necessary so marker is visible
        activeEraFilter = 'all';

        document.querySelectorAll('.filter-btn').forEach(b => {
          if (b.getAttribute('data-value') === 'all') {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        renderMapMarkers();

        // Smooth Fly to location
        leafletMap.flyTo([relic.lat, relic.lng], 11, { animate: true, duration: 1.2 });

        setTimeout(() => {
          openRelicModal(relic);
        }, 1200);
      }
    });
  }

  // --- 4. Modal Popup & Quiz System ---
  function initModalEvents() {
    modalClose.addEventListener('click', closeRelicModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeRelicModal();
    });
  }

  function initQuizSession() {
    if (!quizSessionStart || !quizSessionModal || !quizScopeSelect || !quizLevelSelect) return;

    quizSessionStart.addEventListener('click', startQuizSession);
    quizSessionRestart.addEventListener('click', startQuizSession);
    quizSessionNext.addEventListener('click', () => {
      if (!quizSessionAnswered) return;
      quizSessionIndex += 1;
      renderQuizSessionQuestion();
    });
    quizSessionClose.addEventListener('click', closeQuizSession);
    quizSessionModal.addEventListener('click', (event) => {
      if (event.target === quizSessionModal) closeQuizSession();
    });
  }

  function shuffledCopy(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function startQuizSession() {
    if (!window.KOREAN_MUSEUM_DATA) return;

    quizSessionScope = quizScopeSelect.value;
    quizSessionLevel = quizLevelSelect.value;
    const relicPool = window.KOREAN_MUSEUM_DATA.relicsMaster.filter(relic => (
      relic.quiz && (quizSessionScope === 'all' || relic.eraCategory === quizSessionScope)
    ));
    const selectedRelics = shuffledCopy(relicPool).slice(0, 5);
    const mixedLevels = shuffledCopy(['basic', 'basic', 'inference', 'inference', 'inference']);
    quizSessionRelics = selectedRelics.map((relic, index) => {
      const level = quizSessionLevel === 'mixed' ? mixedLevels[index] : quizSessionLevel;
      return makeQuizSessionItem(relic, level, relicPool);
    });
    quizSessionIndex = 0;
    quizSessionScore = 0;
    quizSessionAnswered = false;

    const scopeOption = quizScopeSelect.options[quizScopeSelect.selectedIndex];
    const levelOption = quizLevelSelect.options[quizLevelSelect.selectedIndex];
    quizSessionTitle.textContent = `${scopeOption.textContent} · ${levelOption.textContent} 5문제`;
    renderQuizSessionQuestion();

    if (!quizSessionModal.open) {
      if (quizSessionModal.showModal) {
        quizSessionModal.showModal();
      } else {
        quizSessionModal.setAttribute('open', 'true');
      }
    }
  }

  function makeQuizSessionItem(relic, level, relicPool) {
    return {
      ...relic,
      quizKind: level === 'inference' ? '추론' : '개념',
      quiz: level === 'inference'
        ? buildInferenceQuiz(relic, relicPool)
        : buildConceptQuiz(relic)
    };
  }

  function buildConceptQuiz(relic) {
    const eraOrder = ['prehistoric', 'three_kingdoms', 'unified_silla', 'goryeo', 'joseon', 'modern'];
    const comparisonRelics = [relic];
    const otherCategories = shuffledCopy(eraOrder.filter(category => category !== relic.eraCategory));

    for (const category of otherCategories) {
      const candidates = shuffledCopy(window.KOREAN_MUSEUM_DATA.relicsMaster.filter(candidate => (
        candidate.id !== relic.id && candidate.eraCategory === category
      )));
      if (candidates.length) comparisonRelics.push(candidates[0]);
      if (comparisonRelics.length === 4) break;
    }

    const chronological = comparisonRelics
      .slice()
      .sort((a, b) => eraOrder.indexOf(a.eraCategory) - eraOrder.indexOf(b.eraCategory));
    const correctSequence = formatRelicSequence(chronological);
    const optionSequences = [correctSequence];
    // 틀린 순서 23가지에서 고르게 뽑는다. 정답과 한 칸만 바꾼 순서만 쓰면 보기끼리 겹치는 자리를 세어 정답을 찍을 수 있다.
    const permutationPatterns = allOrderPatterns(chronological.length).filter(pattern => pattern.some((value, index) => value !== index));
    for (const pattern of shuffledCopy(permutationPatterns)) {
      const sequence = formatRelicSequence(pattern.map(index => chronological[index]));
      if (!optionSequences.includes(sequence)) optionSequences.push(sequence);
      if (optionSequences.length === 4) break;
    }

    return {
      question: '다음 유물·유적을 제작·조성된 시기가 이른 것부터 순서대로 바르게 나열한 것은?',
      options: optionSequences,
      answer: 0,
      explanation: chronological
        .map(item => `${item.title}(${item.era})`)
        .join(' → ')
    };
  }

  function formatRelicSequence(relics) {
    return relics.map(quizRelicName).join(' → ');
  }

  // 순서 문제의 보기에는 시대 이름(백제·고려·대한제국 등)과 괄호 설명을 뺀 이름을 쓴다. 이름표가 시대를 알려 주면 왕조 순서만 알아도 풀린다.
  function quizRelicName(relic) {
    return String(relic.title)
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/^(고구려|백제|신라|가야|발해|대한제국|흥선대원군)\s+/, '')
      .replace(/^조선의\s+/, '')
      .replace(/^고려청자\s+/, '청자 ')
      .replace(/\s(신라|신석기)\s/g, ' ')
      .trim();
  }

  function allOrderPatterns(size) {
    if (size <= 1) return [[0]];
    return allOrderPatterns(size - 1).flatMap(pattern => (
      Array.from({ length: size }, (_, position) => [...pattern.slice(0, position), size - 1, ...pattern.slice(position)])
    ));
  }

  function buildInferenceQuiz(relic, relicPool) {
    const sentences = getContextSentences(relic);
    const profile = getHistoricalProfile(relic);
    const source = hideAnswerNames(sentences[0], profile.hide);
    return {
      question: `[자료]\n${source}\n\n${profile.question}`,
      options: profile.options,
      answer: 0,
      explanation: `제시된 자료는 ${relic.title}입니다. ${profile.explanation} 핵심 연결: ${cleanExamTip(relic.examTip)}`
    };
  }

  // 자료 문장이 나라·왕·단체 이름을 그대로 말하면 추론 단계가 사라진다. 묻는 대상의 이름만 ○○로 가린다.
  function hideAnswerNames(text, names) {
    return (names || []).reduce((result, name) => result.split(name).join('○○'), String(text || ''));
  }

  function getHistoricalProfile(relic) {
    const id = relic.id;
    const title = relic.title;
    if (id === 'p05') return HISTORICAL_PROFILES.paleolithic;
    if (['p01', 'p11'].includes(id)) return HISTORICAL_PROFILES.neolithic;
    if (['p02', 'p03', 'p04', 'p06', 'p07', 'p08'].includes(id)) return HISTORICAL_PROFILES.bronze;
    if (id === 'p09') return HISTORICAL_PROFILES.earlyIron;
    if (id.startsWith('g')) return HISTORICAL_PROFILES.goguryeo;
    if (id.startsWith('b') || title.includes('칠지도')) return HISTORICAL_PROFILES.baekje;
    if (id === 'a01') return HISTORICAL_PROFILES.gaya;
    if (['s01', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's16'].includes(id)) return HISTORICAL_PROFILES.silla;
    if (['s13', 's14', 's17'].includes(id)) return HISTORICAL_PROFILES.balhae;
    if (id.startsWith('s')) return HISTORICAL_PROFILES.unifiedSilla;
    if (id.startsWith('k')) return HISTORICAL_PROFILES.goryeo;
    if (['j01', 'j02', 'j03', 'j12', 'j13', 'j14'].includes(id)) return HISTORICAL_PROFILES.sejong;
    if (['j04', 'j06', 'j07', 'j08', 'j18', 'j20'].includes(id)) return HISTORICAL_PROFILES.earlyJoseon;
    if (['j09', 'j10', 'j11', 'j15', 'j17', 'l01', 'l02', 'l03', 'l04'].includes(id)) return HISTORICAL_PROFILES.lateJoseon;
    if (id === 'm04') return HISTORICAL_PROFILES.daewongun;
    if (['m01', 'm05'].includes(id)) return HISTORICAL_PROFILES.independenceClub;
    if (title.includes('3·1') || title.includes('임시정부')) return HISTORICAL_PROFILES.marchFirst;
    if (id === 'm06') return HISTORICAL_PROFILES.liberation;
    return HISTORICAL_PROFILES.joseonCulture;
  }

  const HISTORICAL_PROFILES = {
    paleolithic: {
      question: '이 자료를 사용하던 사람들의 생활 모습으로 가장 적절한 것은?',
      options: ['동굴이나 막집에 거주하며 사냥과 채집을 하였다.', '벼농사를 바탕으로 계급 사회를 형성하였다.', '농경을 시작하고 움집을 지어 정착하였다.', '주로 지상 가옥을 짓고 목축에 종사하였다.'],
      explanation: '구석기인은 뗀석기를 사용하며 이동 생활을 했습니다.'
    },
    neolithic: {
      question: '이 자료가 나타난 시대의 사회 모습으로 옳은 것은?',
      options: ['농경과 목축이 시작되고 정착 생활이 확대되었다.', '군장이 청동 무기를 독점하며 국가를 형성하였다.', '철제 농기구가 보급되어 생산력이 크게 증가하였다.', '먹을거리를 찾아 무리 지어 옮겨 다니며 막집에 살았다.'],
      explanation: '신석기 시대에는 농경이 시작되고 움집을 중심으로 정착 생활이 이루어졌습니다.'
    },
    bronze: {
      question: '이 자료가 사용된 시대의 변화로 가장 적절한 것은?',
      options: ['잉여 생산물이 늘면서 사유 재산과 계급이 나타났다.', '주먹도끼 같은 뗀석기를 처음 만들어 사냥에 사용하였다.', '농경과 목축이 시작되면서 빗살무늬토기가 만들어졌다.', '가락바퀴로 실을 뽑아 처음으로 옷을 지어 입었다.'],
      explanation: '청동기 시대에는 농업 생산력이 늘고 지배자와 피지배자의 구분이 생겼습니다.'
    },
    earlyIron: {
      question: '이 자료가 확산되던 시기의 변화로 옳은 것은?',
      options: ['철제 농기구와 무기가 보급되고 여러 나라가 성장하였다.', '비파형 동검과 탁자식 고인돌이 처음 만들어졌다.', '농경과 목축이 시작되면서 빗살무늬토기가 만들어졌다.', '주먹도끼 같은 뗀석기를 처음 만들어 사냥에 사용하였다.'],
      explanation: '초기 철기 시대에는 철제 도구가 보급되고 부여·고구려·옥저·동예·삼한 등이 성장했습니다.'
    },
    goguryeo: {
      question: '이 자료가 속한 나라에 대한 설명으로 옳은 것은?',
      options: ['제가 회의에서 국가의 중대사를 결정하였다.', '정사암 회의에서 재상을 선출하였다.', '화백 회의에서 만장일치로 국사를 결정하였다.', '대대로와 상좌평을 두어 국정을 운영하였다.'],
      explanation: '고구려에서는 귀족 대표들이 제가 회의를 열어 국가의 중요한 일을 결정했습니다.',
      hide: ['고구려']
    },
    baekje: {
      question: '이 자료가 속한 나라의 문화 교류에 대한 설명으로 옳은 것은?',
      options: ['아직기와 왕인을 보내 왜에 한문과 유학을 전하였다.', '혜초가 인도와 중앙아시아를 순례하였다.', '장보고가 청해진을 설치해 당·왜와의 해상 무역을 장악하였다.', '이슬람 상인이 벽란도에 왕래하였다.'],
      explanation: '백제는 중국 남조 및 왜와 활발히 교류했고 일본 고대 문화 형성에 영향을 주었습니다.',
      hide: ['백제']
    },
    gaya: {
      question: '이 자료와 관련된 연맹 왕국에 대한 설명으로 옳은 것은?',
      options: ['낙동강 유역의 철을 주변 국가와 왜에 수출하였다.', '한강 유역을 차지하고 북한산에 순수비를 세웠다.', '중국 남조와 교류하며 웅진으로 천도하였다.', '철기병을 앞세워 만주와 요동 지역으로 영토를 넓혔다.'],
      explanation: '가야는 풍부한 철을 생산해 낙랑·왜 등과 교역했습니다.',
      hide: ['가야']
    },
    silla: {
      question: '이 자료가 속한 나라의 정치·사회 모습으로 옳은 것은?',
      options: ['골품에 따라 관등 승진과 일상생활에 제약을 받았다.', '제가 회의에서 왕을 선출하고 중대사를 결정하였다.', '22담로에 왕족을 파견해 지방을 통제하였다.', '5경 15부 62주의 지방 제도를 운영하였다.'],
      explanation: '신라는 골품제를 통해 관등과 관직, 혼인과 가옥 규모까지 제한했습니다.',
      hide: ['신라']
    },
    unifiedSilla: {
      question: '이 자료가 제작된 시기의 사회 모습으로 옳은 것은?',
      options: ['국학을 설치하고 유교 경전을 교육하였다.', '태학을 세우고 율령을 반포하였다.', '주자감을 설치해 유학생을 당에 파견하였다.', '성균관을 정비하고 소학을 보급하였다.'],
      explanation: '통일 신라는 신문왕 때 국학을 설치해 유교 교육을 강화했습니다.'
    },
    balhae: {
      question: '이 자료가 속한 나라에 대한 설명으로 옳은 것은?',
      options: ['고구려 계승 의식을 내세우며 3성 6부제를 운영하였다.', '독서삼품과를 실시해 유교 경전 실력에 따라 관리를 뽑았다.', '고구려·백제 유민까지 아울러 9서당을 편성하였다.', '상수리 제도를 실시해 지방 세력을 견제하였다.'],
      explanation: '발해는 고구려를 계승하면서 당의 제도를 받아들여 3성 6부제를 운영했습니다.',
      hide: ['발해']
    },
    goryeo: {
      question: '이 자료가 제작·발달한 왕조의 문화에 대한 설명으로 옳은 것은?',
      options: ['불교가 성행하고 지방 문화의 특색이 함께 나타났다.', '성리학을 통치 이념으로 삼아 불교 행사를 억제하였다.', '서민 문화가 성장하며 판소리와 탈춤이 유행하였다.', '불국사와 석굴암을 세워 불교 예술이 절정에 이르렀다.'],
      explanation: '고려 문화는 불교와 귀족 문화가 중심이면서 지방적 특색과 다원성이 나타났습니다.',
      hide: ['고려']
    },
    sejong: {
      question: '이 자료와 관련된 국왕의 재위 시기에 있었던 사실로 옳은 것은?',
      options: ['우리 풍토에 맞는 농법을 정리한 농사직설을 편찬하였다.', '경국대전을 완성해 유교적 통치 체제를 정비하였다.', '속대전을 편찬하고 군역 부담을 줄이는 균역법을 실시하였다.', '대전회통을 편찬하고 당백전을 발행해 경복궁을 중건하였다.'],
      explanation: '세종 때 농사직설·칠정산을 편찬하고 훈민정음을 창제하는 등 민생과 과학을 중시했습니다.',
      hide: ['세종']
    },
    earlyJoseon: {
      question: '이 자료가 제작·조성된 조선 전기의 모습으로 옳은 것은?',
      options: ['의정부와 6조를 중심으로 유교적 통치 체제를 정비하였다.', '서인과 남인이 예송과 환국을 거치며 번갈아 정권을 잡았다.', '몇몇 가문이 세도 정치를 펴며 삼정의 문란이 심해졌다.', '통리기무아문을 설치하고 별기군을 창설하였다.'],
      explanation: '조선 전기에는 중앙 집권적 양반 관료 체제와 유교 통치 질서가 정비되었습니다.'
    },
    lateJoseon: {
      question: '이 자료가 발달한 조선 후기의 사회·문화 모습으로 옳은 것은?',
      options: ['상품 화폐 경제가 성장하고 서민 문화가 발달하였다.', '집현전을 두어 학문을 연구하고 훈민정음을 창제하였다.', '경국대전을 완성해 유교적 통치 체제를 정비하였다.', '4군 6진을 개척해 압록강과 두만강까지 국경을 넓혔다.'],
      explanation: '조선 후기에는 상공업과 상품 화폐 경제가 성장하고 실학·서민 문화가 발달했습니다.'
    },
    joseonCulture: {
      question: '이 자료가 속한 조선 왕조의 문화적 특징으로 옳은 것은?',
      options: ['성리학적 질서를 바탕으로 기록과 편찬 사업을 중시하였다.', '골품제를 바탕으로 화랑도를 국가 조직으로 개편하였다.', '국가가 삼국사기를 편찬하고 연등회·팔관회를 열었다.', '과거제를 처음 도입하고 쌍기의 건의를 받아들였다.'],
      explanation: '조선은 성리학을 통치 이념으로 삼고 국가 주도의 기록·편찬 사업을 활발히 전개했습니다.'
    },
    daewongun: {
      question: '이 자료와 관련된 집권자가 추진한 정책으로 옳은 것은?',
      options: ['서원을 대폭 정리하고 호포제를 실시하였다.', '별기군을 창설하고 조사 시찰단을 파견하였다.', '과거제를 폐지하고 신분제를 철폐하였다.', '균역법을 실시하고 탕평비를 세웠다.'],
      explanation: '흥선 대원군은 서원 철폐, 호포제, 경복궁 중건 등을 추진했습니다.',
      hide: ['흥선대원군', '흥선 대원군']
    },
    independenceClub: {
      question: '이 자료와 관련된 단체의 활동으로 옳은 것은?',
      options: ['관민 공동회를 열고 헌의 6조를 결의하였다.', '복벽주의를 내세우며 독립 의군부를 조직하였다.', '신흥 강습소를 세워 독립군을 양성하였다.', '조선 혁명 선언을 활동 지침으로 삼았다.'],
      explanation: '독립 협회는 만민 공동회와 관민 공동회를 개최하고 의회 설립 운동을 전개했습니다.',
      hide: ['독립협회', '독립 협회']
    },
    marchFirst: {
      question: '이 자료와 관련된 운동의 영향으로 옳은 것은?',
      options: ['국내외 독립운동 세력이 대한민국 임시정부로 통합되었다.', '헤이그 특사 사건으로 고종이 물러나고 군대가 해산되었다.', '105인 사건으로 신민회 회원들이 붙잡혀 조직이 무너졌다.', '조선 총독부가 회사령을 처음 제정하였다.'],
      explanation: '3·1 운동은 대한민국 임시정부 수립과 일제 통치 방식 변화에 영향을 주었습니다.',
      hide: ['대한민국 임시정부', '임시정부']
    },
    liberation: {
      question: '이 자료와 관련된 광복 직후의 사실로 옳은 것은?',
      options: ['모스크바 3국 외상 회의 결정에 따라 미소 공동위원회가 열렸다.', '좌우 합작 위원회가 남북 협상을 주도해 단독 정부 수립을 막았다.', '국제 연합 감시 아래 한반도 전역에서 총선거가 실시되었다.', '반민족 행위 특별 조사 위원회가 미군정 시기에 설치되었다.'],
      explanation: '광복 뒤 모스크바 3국 외상 회의 결정에 따라 미소 공동위원회가 개최되었습니다.'
    }
  };

  function getContextSentences(relic) {
    const text = String(relic.context || relic.docent || '').trim();
    const sentences = text.match(/[^.!?]+[.!?]?/g)
      ?.map(sentence => sentence.trim())
      .filter(Boolean) || [];
    return sentences.length ? sentences : [text];
  }

  function selectClaimDistractors(relic, relicPool, sentenceIndex, correctClaim) {
    const sameEra = shuffledCopy(relicPool.filter(candidate => (
      candidate.id !== relic.id && candidate.eraCategory === relic.eraCategory
    )));
    const otherEras = shuffledCopy(window.KOREAN_MUSEUM_DATA.relicsMaster.filter(candidate => (
      candidate.id !== relic.id && candidate.eraCategory !== relic.eraCategory
    )));
    const candidates = [...sameEra, ...otherEras];
    const claims = [];
    for (const candidate of candidates) {
      const sentences = getContextSentences(candidate);
      const claim = sentences[sentenceIndex] || sentences[0] || cleanExamTip(candidate.examTip);
      if (claim && claim !== correctClaim && !claims.includes(claim)) claims.push(claim);
      if (claims.length === 3) break;
    }
    return claims;
  }

  function cleanExamTip(examTip) {
    return String(examTip || '')
      .replace(/^📌\s*\[내신\/수능 핵심\]\s*/, '')
      .replace(/^📌\s*/, '')
      .trim();
  }

  function renderQuizSessionQuestion() {
    const total = quizSessionRelics.length;
    if (quizSessionIndex >= total) {
      renderQuizSessionResult();
      return;
    }

    const relic = quizSessionRelics[quizSessionIndex];
    const randomizedOptions = shuffledCopy(
      relic.quiz.options.map((text, index) => ({ text, correct: index === relic.quiz.answer }))
    );

    quizSessionAnswered = false;
    quizSessionQuestionHadWrong = false;
    quizSessionEra.hidden = false;
    quizSessionEra.textContent = relic.quizKind === '추론'
      ? '유물·유적 자료 분석 · 추론형'
      : '한국사 시대 흐름 · 개념형';
    quizSessionMedia.hidden = relic.quizKind !== '추론';
    if (relic.quizKind === '추론') {
      quizSessionImage.src = window.KOREAN_MUSEUM_DATA.makeArtifactTextureSVG(relic.id);
      quizSessionImage.alt = '문제에 제시된 유물·유적 자료';
    } else {
      quizSessionImage.removeAttribute('src');
    }
    quizSessionQuestion.textContent = relic.quiz.question;
    quizSessionProgress.textContent = `${quizSessionIndex + 1} / ${total} · 현재 ${quizSessionScore}점`;
    quizProgressFill.style.width = `${(quizSessionIndex / total) * 100}%`;
    quizSessionOptions.innerHTML = '';
    quizSessionFeedback.hidden = true;
    quizSessionFeedback.className = 'quiz-result-card';
    quizSessionNext.hidden = true;
    quizSessionRestart.hidden = true;

    randomizedOptions.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-opt-btn';
      button.type = 'button';
      button.dataset.correct = String(option.correct);
      button.textContent = `${index + 1}. ${option.text}`;
      button.addEventListener('click', () => answerQuizSession(button, option.correct, relic));
      quizSessionOptions.appendChild(button);
    });
  }

  function answerQuizSession(selectedButton, isCorrect, relic) {
    if (quizSessionAnswered) return;
    if (!isCorrect) {
      quizSessionQuestionHadWrong = true;
      selectedButton.classList.add('wrong');
      selectedButton.disabled = true;
      quizSessionFeedback.textContent = '다시 생각하고 다른 답을 골라보세요.';
      quizSessionFeedback.className = 'quiz-result-card fail';
      quizSessionFeedback.hidden = false;
      return;
    }
    quizSessionAnswered = true;
    if (!quizSessionQuestionHadWrong) quizSessionScore += 1;

    quizSessionOptions.querySelectorAll('.quiz-opt-btn').forEach(button => {
      button.disabled = true;
      if (button.dataset.correct === 'true') button.classList.add('correct');
    });
    quizSessionFeedback.innerHTML = '';
    const resultTitle = document.createElement('strong');
    resultTitle.textContent = '정답입니다!';
    const explanation = document.createElement('p');
    explanation.textContent = `${relic.title} · ${relic.quiz.explanation}`;
    quizSessionFeedback.append(resultTitle, explanation);
    quizSessionFeedback.className = `quiz-result-card ${isCorrect ? 'success' : 'fail'}`;
    quizSessionFeedback.hidden = false;
    quizSessionProgress.textContent = `${quizSessionIndex + 1} / ${quizSessionRelics.length} · 현재 ${quizSessionScore}점`;
    quizProgressFill.style.width = `${((quizSessionIndex + 1) / quizSessionRelics.length) * 100}%`;
    quizSessionNext.textContent = quizSessionIndex === quizSessionRelics.length - 1 ? '결과 보기' : '다음 문제';
    quizSessionNext.hidden = false;
  }

  function renderQuizSessionResult() {
    const total = quizSessionRelics.length;
    const percentage = Math.round((quizSessionScore / total) * 100);
    quizSessionEra.hidden = true;
    quizSessionMedia.hidden = true;
    quizSessionImage.removeAttribute('src');
    quizSessionQuestion.textContent = '5문제 풀이 완료';
    quizSessionProgress.textContent = `완료 · ${quizSessionScore} / ${total}`;
    quizProgressFill.style.width = '100%';
    quizSessionOptions.innerHTML = '';
    quizSessionFeedback.innerHTML = '';

    const resultTitle = document.createElement('strong');
    resultTitle.textContent = `${quizSessionScore}개 정답 · ${percentage}점`;
    const resultMessage = document.createElement('p');
    resultMessage.textContent = percentage >= 80
      ? '핵심 유물과 유적을 잘 구분하고 있습니다.'
      : '틀린 문제의 유물 카드를 다시 확인해 보세요.';
    quizSessionFeedback.append(resultTitle, resultMessage);
    quizSessionFeedback.className = `quiz-result-card ${percentage >= 80 ? 'success' : 'fail'}`;
    quizSessionFeedback.hidden = false;
    quizSessionNext.hidden = true;
    quizSessionRestart.hidden = false;
  }

  function closeQuizSession() {
    if (quizSessionModal.close) {
      quizSessionModal.close();
    } else {
      quizSessionModal.removeAttribute('open');
    }
  }

  function openRelicModal(relic) {
    currentActiveRelic = relic;

    // Set Modal Fields
    const artifactImageURL = window.KOREAN_MUSEUM_DATA.makeArtifactTextureSVG(relic.id);
    const mediaLabel = relic.mediaLabel || '실물 자료';
    if (artifactImageURL) {
      modalImage.src = artifactImageURL;
      modalImage.alt = `${relic.title} ${mediaLabel}`;
      modalImage.hidden = false;
      modalImagePlaceholder.hidden = true;
    } else {
      modalImage.removeAttribute('src');
      modalImage.alt = '';
      modalImage.hidden = true;
      modalImagePlaceholder.hidden = false;
    }
    modalMediaTitle.textContent = relic.title;
    modalTitle.textContent = relic.title;
    modalSubtitle.textContent = relic.titleEn;
    modalLocation.textContent = relic.location;
    modalMuseum.textContent = relic.museum;
    modalDocent.textContent = relic.docent;
    modalContext.textContent = relic.context || '';
    modalExamTip.textContent = cleanExamTip(relic.examTip);

    if (modal.showModal) {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'true');
    }
  }

  function closeRelicModal() {
    if (modal.close) {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

})();
