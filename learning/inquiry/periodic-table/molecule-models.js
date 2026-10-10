/**
 * Curated 3D molecular / ionic structure models.
 * Coordinates are pedagogical ball-and-stick layouts, centered near the origin.
 */
window.MOLECULE_MODELS_3D = {
    'H₂O': {
        kind: '분자',
        geometry: '굽은형 · 결합각 약 104.5°',
        atoms: [
            { id: 'O1', num: 8, symbol: 'O', x: 0.00000, y: -18.00000, z: 0.00000 },
            { id: 'H1', num: 1, symbol: 'H', x: -55.34827, y: 24.85521, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: 55.34827, y: 24.85521, z: 0.00000 }
        ],
        bonds: [
            { from: 'O1', to: 'H1', type: 'single' },
            { from: 'O1', to: 'H2', type: 'single' }
        ]
    },
    'CO₂': {
        kind: '분자',
        geometry: '직선형 · 결합각 180°',
        atoms: [
            { id: 'O1', num: 8, symbol: 'O', x: -72, y: 0, z: 0 },
            { id: 'C1', num: 6, symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'O2', num: 8, symbol: 'O', x: 72, y: 0, z: 0 }
        ],
        bonds: [
            { from: 'O1', to: 'C1', type: 'double' },
            { from: 'C1', to: 'O2', type: 'double' }
        ]
    },
    'BF₃': {
        kind: '분자',
        geometry: '평면 삼각형 · 결합각 120° · 무극성',
        atoms: [
            { id: 'B1', num: 5, symbol: 'B', x: 0, y: 0, z: 0 },
            { id: 'F1', num: 9, symbol: 'F', x: 0.00000, y: -76.00000, z: 0.00000 },
            { id: 'F2', num: 9, symbol: 'F', x: -65.81793, y: 38.00000, z: 0.00000 },
            { id: 'F3', num: 9, symbol: 'F', x: 65.81793, y: 38.00000, z: 0.00000 }
        ],
        bonds: [
            { from: 'B1', to: 'F1', type: 'single' },
            { from: 'B1', to: 'F2', type: 'single' },
            { from: 'B1', to: 'F3', type: 'single' }
        ]
    },
    'NaCl': {
        kind: '이온쌍',
        geometry: 'Na⁺–Cl⁻ 이온쌍 · 고체에서는 이온 결정',
        atoms: [
            { id: 'Na1', num: 11, symbol: 'Na', charge: '+', x: -52, y: 0, z: 0 },
            { id: 'Cl1', num: 17, symbol: 'Cl', charge: '−', x: 52, y: 0, z: 0 }
        ],
        bonds: [
            { from: 'Na1', to: 'Cl1', type: 'ionic' }
        ]
    },
    'CH₄': {
        kind: '분자',
        geometry: '정사면체형 · 결합각 약 109.5°',
        atoms: [
            { id: 'C1', num: 6, symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'H1', num: 1, symbol: 'H', x: 44, y: 44, z: 44 },
            { id: 'H2', num: 1, symbol: 'H', x: -44, y: -44, z: 44 },
            { id: 'H3', num: 1, symbol: 'H', x: -44, y: 44, z: -44 },
            { id: 'H4', num: 1, symbol: 'H', x: 44, y: -44, z: -44 }
        ],
        bonds: [
            { from: 'C1', to: 'H1', type: 'single' },
            { from: 'C1', to: 'H2', type: 'single' },
            { from: 'C1', to: 'H3', type: 'single' },
            { from: 'C1', to: 'H4', type: 'single' }
        ]
    },
    'NH₃': {
        kind: '분자',
        geometry: '삼각뿔형 · 결합각 약 107°',
        atoms: [
            { id: 'N1', num: 7, symbol: 'N', x: 0.00000, y: -20.00000, z: 0.00000 },
            { id: 'H1', num: 1, symbol: 'H', x: 0.00000, y: 6.04328, z: 64.97498 },
            { id: 'H2', num: 1, symbol: 'H', x: 56.26998, y: 6.04328, z: -32.48749 },
            { id: 'H3', num: 1, symbol: 'H', x: -56.26998, y: 6.04328, z: -32.48749 }
        ],
        bonds: [
            { from: 'N1', to: 'H1', type: 'single' },
            { from: 'N1', to: 'H2', type: 'single' },
            { from: 'N1', to: 'H3', type: 'single' }
        ]
    },
    'HCHO': {
        kind: '분자',
        geometry: '평면 삼각형 · 탄소 중심 결합각 약 120° · 극성',
        atoms: [
            { id: 'C1', num: 6, symbol: 'C', x: 0, y: 0, z: 0 },
            { id: 'O1', num: 8, symbol: 'O', x: 76, y: 0, z: 0 },
            { id: 'H1', num: 1, symbol: 'H', x: -35.00000, y: -60.62178, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: -35.00000, y: 60.62178, z: 0.00000 }
        ],
        bonds: [
            { from: 'C1', to: 'O1', type: 'double' },
            { from: 'C1', to: 'H1', type: 'single' },
            { from: 'C1', to: 'H2', type: 'single' }
        ]
    },
    'HCN': {
        kind: '분자',
        geometry: '직선형 · 결합각 180° · 극성',
        atoms: [
            { id: 'H1', num: 1, symbol: 'H', x: -72, y: 0, z: 0 },
            { id: 'C1', num: 6, symbol: 'C', x: -12, y: 0, z: 0 },
            { id: 'N1', num: 7, symbol: 'N', x: 68, y: 0, z: 0 }
        ],
        bonds: [
            { from: 'H1', to: 'C1', type: 'single' },
            { from: 'C1', to: 'N1', type: 'triple' }
        ]
    },
    'C₂H₂': {
        kind: '분자',
        geometry: '직선형 · 탄소 중심 결합각 180°',
        atoms: [
            { id: 'H1', num: 1, symbol: 'H', x: -112, y: 0, z: 0 },
            { id: 'C1', num: 6, symbol: 'C', x: -40, y: 0, z: 0 },
            { id: 'C2', num: 6, symbol: 'C', x: 40, y: 0, z: 0 },
            { id: 'H2', num: 1, symbol: 'H', x: 112, y: 0, z: 0 }
        ],
        bonds: [
            { from: 'H1', to: 'C1', type: 'single' },
            { from: 'C1', to: 'C2', type: 'triple' },
            { from: 'C2', to: 'H2', type: 'single' }
        ]
    },
    'C₂H₄': {
        kind: '분자',
        geometry: '평면형 · 각 탄소 주변 평면 삼각형',
        atoms: [
            { id: 'C1', num: 6, symbol: 'C', x: -38, y: 0, z: 0 },
            { id: 'C2', num: 6, symbol: 'C', x: 38, y: 0, z: 0 },
            { id: 'H1', num: 1, symbol: 'H', x: -73.00000, y: -60.62178, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: -73.00000, y: 60.62178, z: 0.00000 },
            { id: 'H3', num: 1, symbol: 'H', x: 73.00000, y: -60.62178, z: 0.00000 },
            { id: 'H4', num: 1, symbol: 'H', x: 73.00000, y: 60.62178, z: 0.00000 }
        ],
        bonds: [
            { from: 'C1', to: 'C2', type: 'double' },
            { from: 'C1', to: 'H1', type: 'single' },
            { from: 'C1', to: 'H2', type: 'single' },
            { from: 'C2', to: 'H3', type: 'single' },
            { from: 'C2', to: 'H4', type: 'single' }
        ]
    },
    'C₂H₆': {
        kind: '분자',
        geometry: '입체형 · 각 탄소 주변 정사면체형',
        atoms: [
            { id: 'C1', num: 6, symbol: 'C', x: -36, y: 0, z: 0 },
            { id: 'C2', num: 6, symbol: 'C', x: 36, y: 0, z: 0 },
            { id: 'H1', num: 1, symbol: 'H', x: -59.33333, y: 65.99663, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: -59.33333, y: -32.99832, z: 57.15476 },
            { id: 'H3', num: 1, symbol: 'H', x: -59.33333, y: -32.99832, z: -57.15476 },
            { id: 'H4', num: 1, symbol: 'H', x: 59.33333, y: 32.99832, z: 57.15476 },
            { id: 'H5', num: 1, symbol: 'H', x: 59.33333, y: -65.99663, z: 0.00000 },
            { id: 'H6', num: 1, symbol: 'H', x: 59.33333, y: 32.99832, z: -57.15476 }
        ],
        bonds: [
            { from: 'C1', to: 'C2', type: 'single' },
            { from: 'C1', to: 'H1', type: 'single' },
            { from: 'C1', to: 'H2', type: 'single' },
            { from: 'C1', to: 'H3', type: 'single' },
            { from: 'C2', to: 'H4', type: 'single' },
            { from: 'C2', to: 'H5', type: 'single' },
            { from: 'C2', to: 'H6', type: 'single' }
        ]
    },
    'H₂O₂': {
        kind: '분자',
        geometry: '비평면형 · H–O–O–H가 비틀린 구조',
        atoms: [
            { id: 'O1', num: 8, symbol: 'O', x: -30, y: 0, z: 0 },
            { id: 'O2', num: 8, symbol: 'O', x: 30, y: 0, z: 0 },
            { id: 'H1', num: 1, symbol: 'H', x: -35.02067, y: 59.78957, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: 35.02067, y: -21.91295, z: 55.62927 }
        ],
        bonds: [
            { from: 'H1', to: 'O1', type: 'single' },
            { from: 'O1', to: 'O2', type: 'single' },
            { from: 'O2', to: 'H2', type: 'single' }
        ]
    },
    'C₂H₆O': {
        kind: '분자',
        geometry: '에탄올 · 탄소 주변 정사면체형, 산소 주변 굽은형',
        atoms: [
            { id: 'C1', num: 6, symbol: 'C', x: -42, y: 0, z: 0 },
            { id: 'C2', num: 6, symbol: 'C', x: 18, y: 0, z: 0 },
            { id: 'O1', num: 8, symbol: 'O', x: 41.33333, y: 65.99663, z: 0.00000 },
            { id: 'H1', num: 1, symbol: 'H', x: -65.33333, y: 65.99663, z: 0.00000 },
            { id: 'H2', num: 1, symbol: 'H', x: -65.33333, y: -32.99832, z: 57.15476 },
            { id: 'H3', num: 1, symbol: 'H', x: -65.33333, y: -32.99832, z: -57.15476 },
            { id: 'H4', num: 1, symbol: 'H', x: 41.33333, y: -32.99832, z: 57.15476 },
            { id: 'H5', num: 1, symbol: 'H', x: 41.33333, y: -32.99832, z: -57.15476 },
            { id: 'H6', num: 1, symbol: 'H', x: 101.33333, y: 65.99663, z: 0.00000 }
        ],
        bonds: [
            { from: 'C1', to: 'C2', type: 'single' },
            { from: 'C2', to: 'O1', type: 'single' },
            { from: 'O1', to: 'H6', type: 'single' },
            { from: 'C1', to: 'H1', type: 'single' },
            { from: 'C1', to: 'H2', type: 'single' },
            { from: 'C1', to: 'H3', type: 'single' },
            { from: 'C2', to: 'H4', type: 'single' },
            { from: 'C2', to: 'H5', type: 'single' }
        ]
    },
    'CaCO₃': {
        kind: '이온 모형',
        geometry: 'Ca²⁺와 평면 삼각형 CO₃²⁻ · 세 C–O 결합은 같음',
        atoms: [
            { id: 'Ca1', num: 20, symbol: 'Ca', charge: '2+', x: -88, y: 0, z: 32 },
            { id: 'C1', num: 6, symbol: 'C', x: 24, y: 0, z: 0 },
            { id: 'O1', num: 8, symbol: 'O', x: 24, y: -58, z: 0 },
            { id: 'O2', num: 8, symbol: 'O', x: -26.22947, y: 29.00000, z: 0.00000 },
            { id: 'O3', num: 8, symbol: 'O', x: 74.22947, y: 29.00000, z: 0.00000 }
        ],
        bonds: [
            { from: 'Ca1', to: 'O2', type: 'ionic' },
            { from: 'C1', to: 'O1', type: 'resonance' },
            { from: 'C1', to: 'O2', type: 'resonance' },
            { from: 'C1', to: 'O3', type: 'resonance' }
        ]
    }
};
