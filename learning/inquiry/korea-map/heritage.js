// 유물·유적 탭: 한국사 유물·유적을 지도에 핀으로 놓고, 누르면 사진·설명 창을 연다.
// 문제는 유물마다 하나씩 만든다(자료를 보고 나라·시대를 추론하기, 또는 네 유물을 시대 순서로 잇기).
// 국내 지도의 문제 풀기 창과 기록을 함께 쓴다. 자료는 data/heritage-data.js, 사진은 heritage/.
(function () {
  "use strict";

  const relics = window.KOREA_HERITAGE;
  const dataset = window.KOREA_GEOGRAPHY;
  if (!relics || !dataset) return;
  const photoOf = (relic) => `heritage/${relic.photo || `${relic.id}.jpg`}?v=20260731-3`;
  // 목록·말풍선에 붙이는 곳 이름: 관련 장소가 없으면(그림·책처럼 한 곳에 매이지 않는 것) 지금 있는 곳
  const placeOf = (relic) => relic.location || relic.museum;

  const ERAS = [
    { key: "prehistoric", label: "선사·고조선", color: "#a16207" },
    { key: "three_kingdoms", label: "삼국", color: "#dc2626" },
    { key: "unified_silla", label: "남북국", color: "#7c3aed" },
    { key: "goryeo", label: "고려", color: "#0d9488" },
    { key: "joseon", label: "조선", color: "#2563eb" },
    { key: "modern", label: "근현대", color: "#be185d" }
  ];
  const ERA_ORDER = ERAS.map((era) => era.key);
  const eraOf = (key) => ERAS.find((era) => era.key === key) || ERAS[0];
  let activeEra = "all";

  // ───────────── 핀 그림(유물마다 따로 그린 작은 그림) ─────────────
  const PIN_SVG = {
    p01: `<svg viewBox="0 0 36 36"><path d="M8 7 Q18 4 28 7 L24 27 Q18 33 18 33 Q18 33 12 27 Z" fill="url(#p01g)" stroke="#fff" stroke-width="1.5"/><path d="M11 12 L25 12 M12 17 L24 17 M14 22 L22 22 M16 27 L20 27" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="2 2"/><ellipse cx="18" cy="7" rx="10" ry="2" fill="#92400e" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p01g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    p02: `<svg viewBox="0 0 36 36"><rect x="9" y="15" width="4" height="15" rx="1" fill="#64748b" stroke="#fff" stroke-width="1.2"/><rect x="23" y="15" width="4" height="15" rx="1" fill="#64748b" stroke="#fff" stroke-width="1.2"/><path d="M4 14 C4 11 18 9 32 11 C32 14 18 16 4 14 Z" fill="url(#p02g)" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="p02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient></defs></svg>`,
    p03: `<svg viewBox="0 0 36 36"><path d="M18 2 C20 7 24 11 25 16 C26 21 21 24 18 26 C15 24 10 21 11 16 C12 11 16 7 18 2 Z" fill="url(#p03g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="31" stroke="#a7f3d0" stroke-width="1.5"/><rect x="16" y="26" width="4" height="5" fill="#f59e0b" stroke="#fff" stroke-width="1"/><circle cx="18" cy="32" r="2" fill="#fbbf24"/><defs><linearGradient id="p03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs></svg>`,
    p05: `<svg viewBox="0 0 36 36"><path d="M18 3 L28 19 C30 25 24 32 18 32 C12 32 6 25 8 19 Z" fill="url(#p05g)" stroke="#fff" stroke-width="1.5"/><path d="M18 3 L18 32 M18 3 L12 19 M18 3 L24 19 M12 19 L18 32 M24 19 L18 32" stroke="#fef08a" stroke-width="1" opacity="0.6"/><defs><linearGradient id="p05g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a16207"/><stop offset="100%" stop-color="#451a03"/></linearGradient></defs></svg>`,
    p06: `<svg viewBox="0 0 36 36"><path d="M11 6 L25 6 L23 13 Q29 20 23 30 L13 30 Q7 20 13 13 Z" fill="url(#p06g)" stroke="#fff" stroke-width="1.5"/><path d="M5 18 C5 14 9 14 11 16 M31 18 C31 14 27 14 25 16" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="18" cy="6" rx="7" ry="2" fill="#78350f" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p06g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    p07: `<svg viewBox="0 0 36 36"><path d="M4 16 Q18 4 32 16 Q26 30 18 30 Q10 30 4 16 Z" fill="url(#p07g)" stroke="#fff" stroke-width="1.5"/><circle cx="14" cy="17" r="2.5" fill="#0f172a" stroke="#fff" stroke-width="1"/><circle cx="22" cy="17" r="2.5" fill="#0f172a" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    p08: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="url(#p08g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="18" r="10" fill="none" stroke="#a7f3d0" stroke-width="1.5" stroke-dasharray="2 2"/><circle cx="14" cy="14" r="2.5" fill="#fbbf24" stroke="#fff" stroke-width="1"/><circle cx="22" cy="14" r="2.5" fill="#fbbf24" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p08g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#022c22"/></linearGradient></defs></svg>`,
    p09: `<svg viewBox="0 0 36 36"><path d="M18 2 L21 11 L21 24 L18 28 L15 24 L15 11 Z" fill="url(#p09g)" stroke="#fff" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="34" stroke="#ecfdf5" stroke-width="1.5"/><rect x="16" y="28" width="4" height="6" fill="#d97706"/><defs><linearGradient id="p09g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs></svg>`,
    p11: `<svg viewBox="0 0 36 36"><path d="M18 3 L2 29 L34 29 Z" fill="url(#p11g)" stroke="#fff" stroke-width="1.5"/><path d="M18 3 L18 29 M10 16 L26 16" stroke="#fde68a" stroke-width="1.5"/><rect x="14" y="21" width="8" height="8" fill="#451a03" stroke="#fff" stroke-width="1"/><defs><linearGradient id="p11g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs></svg>`,
    g01: `<svg viewBox="0 0 36 36"><rect x="3" y="3" width="30" height="30" rx="4" fill="url(#g01g)" stroke="#fff" stroke-width="1.5"/><path d="M8 26 Q18 18 28 26 M14 20 L8 14 M22 14 L30 10 M14 14 L6 10" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="22" cy="11" r="3" fill="#fde68a"/><defs><linearGradient id="g01g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient></defs></svg>`,
    g02: `<svg viewBox="0 0 36 36"><rect x="10" y="3" width="16" height="30" rx="2" fill="url(#g02g)" stroke="#fff" stroke-width="1.5"/><path d="M14 8 L22 8 M14 13 L22 13 M14 18 L22 18 M14 23 L22 23 M14 28 L22 28" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3 2"/><defs><linearGradient id="g02g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs></svg>`,
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
    s11: `<svg viewBox="0 0 36 36"><path d="M11 14 C11 4 25 4 25 14 L27 28 C27 32 9 32 9 28 Z" fill="url(#s11g)" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="4" r="3" fill="#78350f"/><path d="M13 23 Q18 27 23 23" stroke="#fde68a" stroke-width="2.5" fill="none"/><defs><linearGradient id="s11g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/></linearGradient></defs></svg>`,
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
    j06: `<svg viewBox="0 0 36 36"><path d="M2 18 L18 7 L34 18 L30 18 L30 31 L6 31 L6 18 Z" fill="url(#j06g)" stroke="#fff" stroke-width="1.5"/><path d="M5 11 L18 2 L31 11 Z" fill="#991b1b" stroke="#fff" stroke-width="1.5"/><defs><linearGradient id="j06g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient></defs></svg>`,
    j07: `<svg viewBox="0 0 36 36"><rect x="4" y="5" width="28" height="26" rx="3" fill="url(#j07g)" stroke="#fff" stroke-width="1.5"/><circle cx="23" cy="15" r="6" fill="#c7d2fe"/><circle cx="11" cy="20" r="4" fill="#c7d2fe"/><defs><linearGradient id="j07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient></defs></svg>`,
    j08: `<svg viewBox="0 0 36 36"><rect x="5" y="5" width="26" height="26" rx="3" fill="#0f172a" stroke="#fff" stroke-width="1.5"/><circle cx="18" cy="18" r="9" fill="none" stroke="#60a5fa" stroke-dasharray="3 2"/><circle cx="18" cy="13" r="1.5" fill="#fff"/><circle cx="23" cy="18" r="1.5" fill="#fff"/><circle cx="14" cy="22" r="1.5" fill="#fff"/></svg>`,
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
    m03: `<svg viewBox="0 0 36 36"><rect x="5" y="9" width="26" height="23" fill="url(#m03g)" stroke="#fff" stroke-width="1.5"/><path d="M9 15 A4 4 0 0 1 17 15 Z M19 15 A4 4 0 0 1 27 15 Z" fill="#bae6fd"/><defs><linearGradient id="m03g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#075985"/></linearGradient></defs></svg>`,
    m04: `<svg viewBox="0 0 36 36"><rect x="10" y="5" width="16" height="26" rx="2.5" fill="url(#m04g)" stroke="#fff" stroke-width="1.5"/><text x="18" y="21" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">和</text><defs><linearGradient id="m04g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs></svg>`,
    m05: `<svg viewBox="0 0 36 36"><rect x="5" y="4" width="26" height="28" fill="#f8fafc" stroke="#1e293b" stroke-width="1.5"/><rect x="8" y="7" width="20" height="5" fill="#0284c7"/><line x1="8" y1="16" x2="28" y2="16" stroke="#64748b" stroke-width="2"/><line x1="8" y1="21" x2="28" y2="21" stroke="#64748b" stroke-width="2"/><line x1="8" y1="26" x2="22" y2="26" stroke="#64748b" stroke-width="2"/></svg>`,
    m06: `<svg viewBox="0 0 36 36"><polygon points="18,5 3,12 33,12" fill="#0284c7" stroke="#fff" stroke-width="1.5"/><rect x="5" y="12" width="26" height="18" fill="#bae6fd"/><line x1="9" y1="12" x2="9" y2="30" stroke="#fff" stroke-width="2"/><line x1="15" y1="12" x2="15" y2="30" stroke="#fff" stroke-width="2"/><line x1="21" y1="12" x2="21" y2="30" stroke="#fff" stroke-width="2"/><line x1="27" y1="12" x2="27" y2="30" stroke="#fff" stroke-width="2"/></svg>`,
    m07: `<svg viewBox="0 0 36 36"><rect x="6" y="4" width="24" height="28" rx="2.5" fill="url(#m07g)" stroke="#fff" stroke-width="1.5"/><text x="18" y="21" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">3·1</text><defs><linearGradient id="m07g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs></svg>`
  };

  // ───────────── 지도 ─────────────
  function activateMarkerFromKeyboard(event) {
    const key = event.originalEvent.key;
    if (key !== "Enter" && key !== " ") return;
    L.DomEvent.stop(event.originalEvent);
    event.target.fire("click");
  }

  function draw(map, group, api) {
    const entries = [];
    const links = L.layerGroup().addTo(group);
    relics.filter(inScope).forEach((relic) => {
      const color = eraOf(relic.eraCategory).color;
      const icon = L.divIcon({
        className: "relic-pin-wrapper",
        html: `<span class="relic-pin" style="--era:${color}">${PIN_SVG[relic.id]}</span>`,
        iconSize: [40, 40], iconAnchor: [20, 20]
      });
      const marker = L.marker([relic.lat, relic.lng], { icon, pane: "studyMarkers", title: relic.title, riseOnHover: true })
        .bindTooltip(`<strong>${relic.title}</strong><small>${placeOf(relic)}</small>`, { direction: "top", offset: [0, -18], className: "relic-tooltip" })
        .on("click", () => openRelic(relic))
        .on("keydown", activateMarkerFromKeyboard)
        .addTo(group);
      entries.push({ relic, marker, origin: L.latLng(relic.lat, relic.lng) });
    });
    api.setZoomSync(map, "heritage", () => spreadOverlaps(map, links, group, entries));
  }

  // 묶음 안의 핀뿐 아니라 다른 묶음·단독 핀과의 최종 화면 겹침도 제거한다.
  // 최대 확대에서는 개수가 많아도 개별 핀을 보여 주어 모든 상세창에 접근할 수 있게 한다.
  const RING_LIMIT = 9;
  const PIN_GAP = 54; // 40px 핀의 1.25배 hover 크기(50px)와 여유 간격

  function freePinPosition(preferred, occupied) {
    const isFree = (point) => occupied.every((other) =>
      Math.abs(point.x - other.x) >= PIN_GAP || Math.abs(point.y - other.y) >= PIN_GAP);
    if (isFree(preferred)) return preferred;
    // 가까운 격자 테두리부터 탐색한다. 유한한 기존 핀 집합 밖에는 반드시 빈 자리가 있다.
    for (let ring = 1; ; ring += 1) {
      const candidates = [];
      for (let x = -ring; x <= ring; x += 1) {
        candidates.push(L.point(x, -ring), L.point(x, ring));
      }
      for (let y = -ring + 1; y < ring; y += 1) {
        candidates.push(L.point(-ring, y), L.point(ring, y));
      }
      candidates.sort((a, b) => a.x * a.x + a.y * a.y - b.x * b.x - b.y * b.y);
      const spot = candidates.map((offset) => preferred.add(offset.multiplyBy(PIN_GAP))).find(isFree);
      if (spot) return spot;
    }
  }

  function spreadOverlaps(map, links, group, entries) {
    links.clearLayers();
    const points = entries.map((entry) => map.latLngToLayerPoint(entry.origin));
    const clusters = [];
    entries.forEach((entry, index) => {
      const home = clusters.find((cluster) => cluster.seed.distanceTo(points[index]) < 44);
      if (home) home.members.push(index);
      else clusters.push({ seed: points[index], members: [index] });
    });
    const placements = [];
    clusters.forEach(({ members }) => {
      const center = members.reduce((sum, index) => sum.add(points[index]), L.point(0, 0)).divideBy(members.length);
      if (members.length > RING_LIMIT && map.getZoom() < map.getMaxZoom()) {
        members.forEach((index) => group.removeLayer(entries[index].marker));
        placements.push({ center, preferred: center, members, priority: 1 });
        return;
      }
      const radius = members.length < 2 ? 0 : Math.max(30, PIN_GAP / (2 * Math.sin(Math.PI / members.length)));
      members.forEach((index, order) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * order) / members.length;
        placements.push({ index, preferred: center.add(L.point(Math.cos(angle) * radius, Math.sin(angle) * radius)), priority: members.length < 2 ? 0 : 2 });
      });
    });
    const occupied = [];
    placements.sort((a, b) => a.priority - b.priority).forEach((placement) => {
      const position = freePinPosition(placement.preferred.round(), occupied);
      occupied.push(position);
      const spot = map.layerPointToLatLng(position);
      let origin;
      if (placement.members) {
        origin = map.layerPointToLatLng(placement.center);
        L.marker(spot, {
          pane: "studyMarkers", title: "유물·유적 " + placement.members.length + "개",
          icon: L.divIcon({ className: "relic-pin-wrapper", html: '<span class="relic-cluster">' + placement.members.length + '</span>', iconSize: [44, 44], iconAnchor: [22, 22] })
        }).on("click", () => map.flyTo(origin, Math.min(map.getZoom() + 2, map.getMaxZoom()), { duration: 0.5 }))
          .on("keydown", activateMarkerFromKeyboard).addTo(links);
      } else {
        const entry = entries[placement.index];
        origin = entry.origin;
        entry.marker.setLatLng(spot).addTo(group);
      }
      if (map.latLngToLayerPoint(origin).distanceTo(position) > 1) {
        L.polyline([origin, spot], { pane: "themeLines", color: "#5b4636", weight: 1.4, opacity: 0.6, dashArray: "3 4", interactive: false }).addTo(links);
      }
    });
  }

  function inScope(relic) {
    return activeEra === "all" || relic.eraCategory === activeEra;
  }

  // ───────────── 옆 칸: 시대 고르기와 유물 목록 ─────────────
  function panel(api) {
    const box = document.createElement("div");
    box.className = "heritage-panel";
    const chips = document.createElement("div");
    chips.className = "era-chips";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "시대 고르기");
    [{ key: "all", label: "전체", color: "#123c46" }, ...ERAS].forEach((era) => {
      const button = api.element("button", "era-chip", era.label);
      button.type = "button";
      button.style.setProperty("--era", era.color);
      button.setAttribute("aria-pressed", String(activeEra === era.key));
      button.addEventListener("click", () => {
        activeEra = era.key;
        chips.querySelectorAll(".era-chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip === button)));
        fillList(list, api);
        api.refresh();
      });
      chips.append(button);
    });
    const guide = document.createElement("details");
    guide.className = "feature-guide relic-guide";
    const summary = document.createElement("summary");
    summary.append(api.element("span", "", "유물·유적 목록"), api.element("strong", "relic-count", ""));
    const list = document.createElement("div");
    list.className = "relic-list";
    guide.append(summary, list);
    fillList(list, api);
    box.append(chips, guide);
    return box;
  }

  function fillList(list, api) {
    const shown = relics.filter(inScope);
    const count = list.closest(".relic-guide") && list.closest(".relic-guide").querySelector(".relic-count");
    if (count) count.textContent = `${shown.length}개`;
    list.replaceChildren(...ERAS.filter((era) => activeEra === "all" || era.key === activeEra).flatMap((era) => {
      const items = shown.filter((relic) => relic.eraCategory === era.key);
      if (!items.length) return [];
      const heading = api.element("h3", "relic-era-heading", era.label);
      heading.style.setProperty("--era", era.color);
      return [heading, ...items.map((relic) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "relic-button";
        button.style.setProperty("--era", era.color);
        button.append(api.element("span", "", relic.title), api.element("small", "", placeOf(relic)));
        button.addEventListener("click", () => {
          api.map.flyTo([relic.lat, relic.lng], Math.max(api.map.getZoom(), 10), { duration: 0.6 });
          openRelic(relic);
        });
        return button;
      })];
    }));
  }

  // ───────────── 유물 설명 창 ─────────────
  const $ = (id) => document.getElementById(id);

  function openRelic(relic) {
    const dialog = $("relicDialog");
    if (!dialog) return;
    const image = $("relicImage");
    image.src = photoOf(relic);
    image.alt = `${relic.title} 사진`;
    $("relicEra").textContent = relic.era;
    $("relicEra").style.setProperty("--era", eraOf(relic.eraCategory).color);
    $("relicTitle").textContent = relic.title;
    for (const key of ["location", "museum"]) {
      const cell = $(key === "location" ? "relicLocation" : "relicMuseum");
      cell.textContent = relic[key];
      cell.parentElement.hidden = !relic[key];
    }
    $("relicDocent").textContent = relic.docent;
    $("relicContext").textContent = relic.context;
    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dialog = $("relicDialog");
    if (!dialog) return;
    $("relicClose").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  });

  // ───────────── 문제 ─────────────
  function shuffled(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }

  // 한 판은 고른 시대의 유물 전부다. 유물마다 자료 추론 문제를 내고, 다섯에 둘꼴로 시대 순서 문제로 바꾼다.
  function buildQuestions(scope) {
    const pool = relics.filter((relic) => (scope || activeEra) === "all" || relic.eraCategory === (scope || activeEra));
    return shuffled(pool).map((relic, index) => (index % 5 < 2 ? orderQuestion(relic) : inferenceQuestion(relic)));
  }

  function questionIds() {
    return relics.map((relic) => `heritage-${relic.id}`);
  }

  function baseQuestion(relic, kind) {
    return {
      id: `heritage-${relic.id}`, topic: "heritage", difficulty: kind === "inference" ? "advanced" : "basic", labels: "admin",
      focus: { lat: relic.lat, lng: relic.lng, zoom: 9, label: relic.title }
    };
  }

  function inferenceQuestion(relic) {
    const profile = getHistoricalProfile(relic);
    const source = hideAnswerNames(getContextSentences(relic)[0], profile.hide);
    return {
      ...baseQuestion(relic, "inference"),
      prompt: profile.question,
      stimulus: { type: "image", title: "자료", src: photoOf(relic), alt: "문제에 나온 유물·유적 사진", text: source },
      options: profile.options.slice(),
      answer: 0,
      hint: `이 자료와 관련된 곳: ${hideAnswerNames(placeOf(relic), profile.hide)}`,
      explanation: `제시된 자료는 ${relic.title}입니다. ${profile.explanation}`
    };
  }

  function orderQuestion(relic) {
    const picked = [relic];
    for (const era of shuffled(ERA_ORDER.filter((key) => key !== relic.eraCategory))) {
      const candidates = shuffled(relics.filter((other) => other.id !== relic.id && other.eraCategory === era));
      if (candidates.length) picked.push(candidates[0]);
      if (picked.length === 4) break;
    }
    const chronological = picked.slice().sort((a, b) => ERA_ORDER.indexOf(a.eraCategory) - ERA_ORDER.indexOf(b.eraCategory));
    const correct = chronological.map(quizRelicName).join(" → ");
    const options = [correct];
    // 틀린 순서는 가능한 23가지에서 고르게 뽑는다(정답과 한 칸만 바꾼 순서만 쓰면 겹치는 자리를 세어 찍을 수 있다).
    for (const pattern of shuffled(allOrderPatterns(chronological.length).filter((pattern) => pattern.some((value, index) => value !== index)))) {
      const sequence = pattern.map((index) => quizRelicName(chronological[index])).join(" → ");
      if (!options.includes(sequence)) options.push(sequence);
      if (options.length === 4) break;
    }
    return {
      ...baseQuestion(relic, "order"),
      prompt: "다음 유물·유적을 만들어진 시기가 이른 것부터 순서대로 바르게 나열한 것은?",
      options,
      answer: 0,
      hint: "선사·고조선 → 삼국 → 남북국 → 고려 → 조선 → 근현대 순서입니다.",
      explanation: chronological.map((item) => `${item.title}(${item.era})`).join(" → ")
    };
  }

  // 순서 문제의 보기에는 시대 이름(백제·고려·대한제국 등)과 괄호 설명을 뺀 이름을 쓴다. 이름표가 시대를 알려 주면 왕조 순서만 알아도 풀린다.
  function quizRelicName(relic) {
    return String(relic.title)
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/^(고구려|백제|신라|가야|발해|대한제국|흥선대원군)\s+/, "")
      .replace(/^조선의\s+/, "")
      .replace(/^고려청자\s+/, "청자 ")
      .replace(/\s(신라|신석기)\s/g, " ")
      .trim();
  }

  function allOrderPatterns(size) {
    if (size <= 1) return [[0]];
    return allOrderPatterns(size - 1).flatMap(pattern => (
      Array.from({ length: size }, (_, position) => [...pattern.slice(0, position), size - 1, ...pattern.slice(position)])
    ));
  }

  // 자료 문장이 나라·왕·단체 이름을 그대로 말하면 추론 단계가 사라진다. 묻는 대상의 이름만 ○○로 가린다.
  function hideAnswerNames(text, names) {
    return (names || []).reduce((result, name) => result.split(name).join("○○"), String(text || ""));
  }

  function getHistoricalProfile(relic) {
    const id = relic.id;
    const title = relic.title;
    if (id === "p05") return HISTORICAL_PROFILES.paleolithic;
    if (["p01", "p11"].includes(id)) return HISTORICAL_PROFILES.neolithic;
    if (["p02", "p03", "p06", "p07", "p08"].includes(id)) return HISTORICAL_PROFILES.bronze;
    if (id === "p09") return HISTORICAL_PROFILES.earlyIron;
    if (id.startsWith("g")) return HISTORICAL_PROFILES.goguryeo;
    if (id.startsWith("b") || title.includes("칠지도")) return HISTORICAL_PROFILES.baekje;
    if (id === "a01") return HISTORICAL_PROFILES.gaya;
    if (id === "s16") return HISTORICAL_PROFILES.hou;
    if (["s01", "s04", "s05", "s06", "s07", "s08", "s09"].includes(id)) return HISTORICAL_PROFILES.silla;
    if (["s13", "s14", "s17"].includes(id)) return HISTORICAL_PROFILES.balhae;
    if (id.startsWith("s")) return HISTORICAL_PROFILES.unifiedSilla;
    if (id.startsWith("k")) return HISTORICAL_PROFILES.goryeo;
    if (["j01", "j02", "j03", "j12", "j13", "j14"].includes(id)) return HISTORICAL_PROFILES.sejong;
    if (["j06", "j07", "j08", "j18", "j20"].includes(id)) return HISTORICAL_PROFILES.earlyJoseon;
    if (["j15", "j17", "l01", "l02", "l03", "l04"].includes(id)) return HISTORICAL_PROFILES.lateJoseon;
    if (id === "m04") return HISTORICAL_PROFILES.daewongun;
    if (["m01", "m05"].includes(id)) return HISTORICAL_PROFILES.independenceClub;
    if (title.includes("3·1") || title.includes("임시정부")) return HISTORICAL_PROFILES.marchFirst;
    if (id === "m06") return HISTORICAL_PROFILES.liberation;
    return HISTORICAL_PROFILES.joseonCulture;
  }

  const HISTORICAL_PROFILES = {
    paleolithic: {
      question: "이 자료를 사용하던 사람들의 생활 모습으로 가장 적절한 것은?",
      options: ["동굴이나 막집에 거주하며 사냥과 채집을 하였다.", "벼농사를 바탕으로 계급 사회를 형성하였다.", "농경을 시작하고 움집을 지어 정착하였다.", "주로 지상 가옥을 짓고 목축에 종사하였다."],
      explanation: "구석기인은 뗀석기를 사용하며 이동 생활을 했습니다."
    },
    neolithic: {
      question: "이 자료가 나타난 시대의 사회 모습으로 옳은 것은?",
      options: ["농경과 목축이 시작되고 정착 생활이 확대되었다.", "군장이 청동 무기를 독점하며 국가를 형성하였다.", "철제 농기구가 보급되어 생산력이 크게 증가하였다.", "먹을거리를 찾아 무리 지어 옮겨 다니며 막집에 살았다."],
      explanation: "신석기 시대에는 농경이 시작되고 움집을 중심으로 정착 생활이 이루어졌습니다."
    },
    bronze: {
      question: "이 자료가 사용된 시대의 변화로 가장 적절한 것은?",
      options: ["잉여 생산물이 늘면서 사유 재산과 계급이 나타났다.", "주먹도끼 같은 뗀석기를 처음 만들어 사냥에 사용하였다.", "농경과 목축이 시작되면서 빗살무늬토기가 만들어졌다.", "가락바퀴로 실을 뽑아 처음으로 옷을 지어 입었다."],
      explanation: "청동기 시대에는 농업 생산력이 늘고 지배자와 피지배자의 구분이 생겼습니다."
    },
    earlyIron: {
      question: "이 자료가 확산되던 시기의 변화로 옳은 것은?",
      options: ["철제 농기구와 무기가 보급되고 여러 나라가 성장하였다.", "비파형 동검과 탁자식 고인돌이 처음 만들어졌다.", "농경과 목축이 시작되면서 빗살무늬토기가 만들어졌다.", "주먹도끼 같은 뗀석기를 처음 만들어 사냥에 사용하였다."],
      explanation: "초기 철기 시대에는 철제 도구가 보급되고 부여·고구려·옥저·동예·삼한 등이 성장했습니다."
    },
    goguryeo: {
      question: "이 자료가 속한 나라에 대한 설명으로 옳은 것은?",
      options: ["제가 회의에서 국가의 중대사를 결정하였다.", "정사암 회의에서 재상을 선출하였다.", "화백 회의에서 만장일치로 국사를 결정하였다.", "대대로와 상좌평을 두어 국정을 운영하였다."],
      explanation: "고구려에서는 귀족 대표들이 제가 회의를 열어 국가의 중요한 일을 결정했습니다.",
      hide: ["고구려"]
    },
    baekje: {
      question: "이 자료가 속한 나라의 문화 교류에 대한 설명으로 옳은 것은?",
      options: ["아직기와 왕인을 보내 왜에 한문과 유학을 전하였다.", "혜초가 인도와 중앙아시아를 순례하였다.", "장보고가 청해진을 설치해 당·왜와의 해상 무역을 장악하였다.", "이슬람 상인이 벽란도에 왕래하였다."],
      explanation: "백제는 중국 남조 및 왜와 활발히 교류했고 일본 고대 문화 형성에 영향을 주었습니다.",
      hide: ["백제"]
    },
    gaya: {
      question: "이 자료와 관련된 연맹 왕국에 대한 설명으로 옳은 것은?",
      options: ["낙동강 유역의 철을 주변 국가와 왜에 수출하였다.", "한강 유역을 차지하고 북한산에 순수비를 세웠다.", "중국 남조와 교류하며 웅진으로 천도하였다.", "철기병을 앞세워 만주와 요동 지역으로 영토를 넓혔다."],
      explanation: "가야는 풍부한 철을 생산해 낙랑·왜 등과 교역했습니다.",
      hide: ["가야"]
    },
    hou: {
      question: "이 자료로 알 수 있는 5세기 무렵의 사실로 옳은 것은?",
      options: ["고구려가 신라에 큰 영향력을 미쳤다.", "신라가 한강 유역을 차지하고 북한산에 순수비를 세웠다.", "신라가 당과 손잡고 백제를 무너뜨렸다.", "고구려가 살수에서 수의 군대를 크게 물리쳤다."],
      explanation: "고구려에서 광개토대왕을 기려 만든 그릇이 신라 무덤에서 나온 것은 5세기에 고구려가 신라에 큰 영향을 미쳤음을 보여 줍니다."
    },
    silla: {
      question: "이 자료가 속한 나라의 정치·사회 모습으로 옳은 것은?",
      options: ["골품에 따라 관등 승진과 일상생활에 제약을 받았다.", "제가 회의에서 왕을 선출하고 중대사를 결정하였다.", "22담로에 왕족을 파견해 지방을 통제하였다.", "5경 15부 62주의 지방 제도를 운영하였다."],
      explanation: "신라는 골품제를 통해 관등과 관직, 혼인과 가옥 규모까지 제한했습니다.",
      hide: ["신라"]
    },
    unifiedSilla: {
      question: "이 자료가 제작된 시기의 사회 모습으로 옳은 것은?",
      options: ["국학을 설치하고 유교 경전을 교육하였다.", "태학을 세우고 율령을 반포하였다.", "주자감을 설치해 유학생을 당에 파견하였다.", "성균관을 정비하고 소학을 보급하였다."],
      explanation: "통일 신라는 신문왕 때 국학을 설치해 유교 교육을 강화했습니다."
    },
    balhae: {
      question: "이 자료가 속한 나라에 대한 설명으로 옳은 것은?",
      options: ["고구려 계승 의식을 내세우며 3성 6부제를 운영하였다.", "독서삼품과를 실시해 유교 경전 실력에 따라 관리를 뽑았다.", "고구려·백제 유민까지 아울러 9서당을 편성하였다.", "상수리 제도를 실시해 지방 세력을 견제하였다."],
      explanation: "발해는 고구려를 계승하면서 당의 제도를 받아들여 3성 6부제를 운영했습니다.",
      hide: ["발해"]
    },
    goryeo: {
      question: "이 자료가 제작·발달한 왕조의 문화에 대한 설명으로 옳은 것은?",
      options: ["불교가 성행하고 지방 문화의 특색이 함께 나타났다.", "성리학을 통치 이념으로 삼아 불교 행사를 억제하였다.", "서민 문화가 성장하며 판소리와 탈춤이 유행하였다.", "불국사와 석굴암을 세워 불교 예술이 절정에 이르렀다."],
      explanation: "고려 문화는 불교와 귀족 문화가 중심이면서 지방적 특색과 다원성이 나타났습니다.",
      hide: ["고려"]
    },
    sejong: {
      question: "이 자료와 관련된 국왕의 재위 시기에 있었던 사실로 옳은 것은?",
      options: ["우리 풍토에 맞는 농법을 정리한 농사직설을 편찬하였다.", "경국대전을 완성해 유교적 통치 체제를 정비하였다.", "속대전을 편찬하고 군역 부담을 줄이는 균역법을 실시하였다.", "대전회통을 편찬하고 당백전을 발행해 경복궁을 중건하였다."],
      explanation: "세종 때 농사직설·칠정산을 편찬하고 훈민정음을 창제하는 등 민생과 과학을 중시했습니다.",
      hide: ["세종"]
    },
    earlyJoseon: {
      question: "이 자료가 제작·조성된 시기의 모습으로 옳은 것은?",
      options: ["의정부와 6조를 중심으로 유교적 통치 체제를 정비하였다.", "서인과 남인이 예송과 환국을 거치며 번갈아 정권을 잡았다.", "몇몇 가문이 세도 정치를 펴며 삼정의 문란이 심해졌다.", "통리기무아문을 설치하고 별기군을 창설하였다."],
      explanation: "조선 전기에는 중앙 집권적 양반 관료 체제와 유교 통치 질서가 정비되었습니다."
    },
    lateJoseon: {
      question: "이 자료가 발달한 시기의 사회·문화 모습으로 옳은 것은?",
      options: ["상품 화폐 경제가 성장하고 서민 문화가 발달하였다.", "집현전을 두어 학문을 연구하고 훈민정음을 창제하였다.", "경국대전을 완성해 유교적 통치 체제를 정비하였다.", "4군 6진을 개척해 압록강과 두만강까지 국경을 넓혔다."],
      explanation: "조선 후기에는 상공업과 상품 화폐 경제가 성장하고 실학·서민 문화가 발달했습니다."
    },
    joseonCulture: {
      question: "이 자료가 속한 왕조의 문화적 특징으로 옳은 것은?",
      options: ["성리학적 질서를 바탕으로 기록과 편찬 사업을 중시하였다.", "골품제를 바탕으로 화랑도를 국가 조직으로 개편하였다.", "국가가 삼국사기를 편찬하고 연등회·팔관회를 열었다.", "과거제를 처음 도입하고 쌍기의 건의를 받아들였다."],
      explanation: "조선은 성리학을 통치 이념으로 삼고 국가 주도의 기록·편찬 사업을 활발히 전개했습니다."
    },
    daewongun: {
      question: "이 자료와 관련된 집권자가 추진한 정책으로 옳은 것은?",
      options: ["서원을 대폭 정리하고 호포제를 실시하였다.", "별기군을 창설하고 조사 시찰단을 파견하였다.", "과거제를 폐지하고 신분제를 철폐하였다.", "균역법을 실시하고 탕평비를 세웠다."],
      explanation: "흥선 대원군은 서원 철폐, 호포제, 경복궁 중건 등을 추진했습니다.",
      hide: ["흥선대원군", "흥선 대원군"]
    },
    independenceClub: {
      question: "이 자료와 관련된 단체의 활동으로 옳은 것은?",
      options: ["관민 공동회를 열고 헌의 6조를 결의하였다.", "복벽주의를 내세우며 독립 의군부를 조직하였다.", "신흥 강습소를 세워 독립군을 양성하였다.", "조선 혁명 선언을 활동 지침으로 삼았다."],
      explanation: "독립 협회는 만민 공동회와 관민 공동회를 개최하고 의회 설립 운동을 전개했습니다.",
      hide: ["독립협회", "독립 협회"]
    },
    marchFirst: {
      question: "이 자료와 관련된 운동의 영향으로 옳은 것은?",
      options: ["국내외 독립운동 세력이 대한민국 임시정부로 통합되었다.", "헤이그 특사 사건으로 고종이 물러나고 군대가 해산되었다.", "105인 사건으로 신민회 회원들이 붙잡혀 조직이 무너졌다.", "조선 총독부가 회사령을 처음 제정하였다."],
      explanation: "3·1 운동은 대한민국 임시정부 수립과 일제 통치 방식 변화에 영향을 주었습니다.",
      hide: ["대한민국 임시정부", "임시정부"]
    },
    liberation: {
      question: "이 자료와 관련된 시기의 사실로 옳은 것은?",
      options: ["모스크바 3국 외상 회의 결정에 따라 미소 공동위원회가 열렸다.", "좌우 합작 위원회가 남북 협상을 주도해 단독 정부 수립을 막았다.", "국제 연합 감시 아래 한반도 전역에서 총선거가 실시되었다.", "반민족 행위 특별 조사 위원회가 미군정 시기에 설치되었다."],
      explanation: "광복 뒤 모스크바 3국 외상 회의 결정에 따라 미소 공동위원회가 개최되었습니다."
    }
  };

  function getContextSentences(relic) {
    const text = String(relic.context).trim();
    const sentences = text.match(/[^.!?]+[.!?]?/g)
      ?.map(sentence => sentence.trim())
      .filter(Boolean) || [];
    return sentences.length ? sentences : [text];
  }

  window.KoreaHeritage = {open(id) { const relic=window.KOREA_HERITAGE.find(item=>item.id===id); if(relic)openRelic(relic); }};
  dataset.themes.heritage = {
    label: "유물·유적",
    points: [],
    legend: ERAS.map((era) => ({ label: era.label, color: era.color })),
    features: [],
    principles: [],
    draw,
    panel,
    buildQuestions,
    questionIds
  };
})();
