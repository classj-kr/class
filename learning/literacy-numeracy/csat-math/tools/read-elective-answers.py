import pymupdf, re, json, glob, os, sys
from source_paths import PAPERS_DIR
sys.stdout.reconfigure(encoding='utf-8')

CIRC = {'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5}

manual_2025_suneung = {
    'prob': {
        23: {'answer': 5, 'score': 2}, 24: {'answer': 3, 'score': 3},
        25: {'answer': 1, 'score': 3}, 26: {'answer': 3, 'score': 3},
        27: {'answer': 3, 'score': 3}, 28: {'answer': 2, 'score': 4},
        29: {'answer': 25, 'score': 4}, 30: {'answer': 19, 'score': 4}
    },
    'calc': {
        23: {'answer': 3, 'score': 2}, 24: {'answer': 4, 'score': 3},
        25: {'answer': 2, 'score': 3}, 26: {'answer': 1, 'score': 3},
        27: {'answer': 1, 'score': 3}, 28: {'answer': 2, 'score': 4},
        29: {'answer': 25, 'score': 4}, 30: {'answer': 17, 'score': 4}
    },
    'geom': {
        23: {'answer': 3, 'score': 2}, 24: {'answer': 4, 'score': 3},
        25: {'answer': 3, 'score': 3}, 26: {'answer': 1, 'score': 3},
        27: {'answer': 1, 'score': 3}, 28: {'answer': 4, 'score': 4},
        29: {'answer': 107, 'score': 4}, 30: {'answer': 316, 'score': 4}
    }
}

all_electives = {}

for p in sorted(PAPERS_DIR.glob('*-answers.pdf')):
    key = os.path.basename(p).replace('-answers.pdf', '')
    if key == '2025-suneung':
        all_electives[key] = manual_2025_suneung
        continue
    
    doc = pymupdf.open(p)
    txt = doc[0].get_text()
    
    start_pos = txt.find('문항')
    if start_pos != -1:
        txt = txt[start_pos:]
        
    toks = re.findall(r'[①-⑤]|\d+', txt)
    
    triples = []
    i = 0
    while i < len(toks) - 2:
        num_s, ans_s, sc_s = toks[i], toks[i+1], toks[i+2]
        if num_s.isdigit() and sc_s in ('2', '3', '4'):
            n = int(num_s)
            ans = CIRC[ans_s] if ans_s in CIRC else int(ans_s) if ans_s.isdigit() else ans_s
            sc = int(sc_s)
            triples.append((n, ans, sc))
            i += 3
        else:
            i += 1
            
    if len(triples) != 46:
        print(f'ERROR {key}: got {len(triples)} triples')
        continue
        
    prob = {}
    calc = {}
    geom = {}
    common = {}
    
    for row_idx in range(8):
        base = row_idx * 5
        c1 = triples[base]
        c2 = triples[base + 1]
        pr = triples[base + 2]
        ca = triples[base + 3]
        ge = triples[base + 4]
        
        common[c1[0]] = {'answer': c1[1], 'score': c1[2]}
        common[c2[0]] = {'answer': c2[1], 'score': c2[2]}
        prob[pr[0]] = {'answer': pr[1], 'score': pr[2]}
        calc[ca[0]] = {'answer': ca[1], 'score': ca[2]}
        geom[ge[0]] = {'answer': ge[1], 'score': ge[2]}
        
    for row_idx in range(3):
        base = 40 + row_idx * 2
        c1 = triples[base]
        c2 = triples[base + 1]
        common[c1[0]] = {'answer': c1[1], 'score': c1[2]}
        common[c2[0]] = {'answer': c2[1], 'score': c2[2]}
        
    all_electives[key] = {
        'prob': prob,
        'calc': calc,
        'geom': geom,
        'common': common
    }

json.dump(all_electives, open('elective-answers.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Done! Successfully processed all {len(all_electives)} exams.')

for k in sorted(all_electives.keys()):
    p4 = {n: all_electives[k]['prob'][n]['answer'] for n in (28, 29, 30)}
    c4 = {n: all_electives[k]['calc'][n]['answer'] for n in (28, 29, 30)}
    g4 = {n: all_electives[k]['geom'][n]['answer'] for n in (28, 29, 30)}
    print(f'{k:14} | 확통: {p4} | 미적: {c4} | 기하: {g4}')
