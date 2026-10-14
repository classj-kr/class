"""Index observed Tselpa list metadata without requiring original downloads."""
import json,re,hashlib
from pathlib import Path
from urllib.parse import urlparse,parse_qs
ROOT=Path(__file__).resolve().parents[1]; REF=ROOT/'references/textbooks'
def read(p): return json.loads(p.read_text(encoding='utf-8'))
plans=read(ROOT/'game-hub-server/data/textbooks/pacing-tselpa-2022.json')['plans']
catalog={e['id']:e for e in read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']}
rows={}; pages=[]
for manifest in sorted((REF/'tselpa-browser-assessments').glob('*.json')):
    data=read(manifest); q=parse_qs(urlparse(data['url']).query)
    grade=int(q['g'][0]); semester=int(q['semester'][0])
    code=q.get('exam',[''])[0] or re.sub(r'-performance(?=_)','',q['tab'][0])
    source_id=code.replace('E-exam','E-curri')
    aliases={f'E-exam0{g}-{a}_2026':f'E-curri0{g}-{b}_2026' for g in [5,6] for a,b in [('art-A','art-L'),('music-K','music-C')]}
    aliases.update({f'E-exam0{g}-{a}_2025':f'E-curri0{g}-{b}_2025' for g in [3,4] for a,b in [('music-K','music-C'),('physical-P','physical-G')]})
    source_id=aliases.get(code,source_id)
    matches=[p for p in plans if p['sourceId']==source_id and p['grade']==grade]
    if re.fullmatch(r'E-curri0[12]-ton_2024',source_id):
        matches=[p for p in plans if p['grade']==grade and re.fullmatch(fr'E-curri0{grade}-ton-[A-H]_2024',p['sourceId'])]
    ids={p['editionId'] for p in matches}; assert len(ids)==1,(source_id,ids)
    e=catalog[next(iter(ids))]; sem=None if all(p['semester'] is None for p in matches) else semester
    pages.append({'manifest':manifest.name,'editionId':e['id'],'grade':grade,'semester':sem,'listedRows':sum(len(g['lessons']) for g in data['groups'])})
    for group in data['groups']:
        for a in group['lessons']:
            title=a['title']; ext=Path(a.get('downloadPath') or '').suffix.lower()
            if ext in ['.mp3','.mp4','.wav'] or re.search(r'음원|듣기\s*자료|평가\s*계획|정답|해설',title): continue
            key=(e['id'],grade,sem,group['title'],title)
            rows[key]={'id':'tselpa-assessment-'+a['resourceId'],'editionId':e['id'],'grade':grade,'semester':sem,'subject':e['subject'],'publisher':e['publisher'],'provider':'T셀파','title':title,'unit':group['title'],'documentKind':'performance-assessment','sourceUrl':data['url'],'sourceManifest':'tselpa-browser-assessments/'+manifest.name,'resourceId':a['resourceId'],'contentStatus':'list-metadata-only'}
out={'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages}
(REF/'assessment-index-tselpa-lists-2022.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pages':len(pages),'assessments':len(rows),'gradeEditions':len({(r['editionId'],r['grade']) for r in rows.values()})}))
