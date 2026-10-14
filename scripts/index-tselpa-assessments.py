"""Preserve browser-downloaded T셀파 assessments and link exact textbook editions."""
import hashlib,json,re,shutil
from pathlib import Path
from urllib.parse import urlparse,parse_qs
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def run():
    plans=read(ROOT/'game-hub-server/data/textbooks/pacing-tselpa-2022.json')['plans']
    catalog={e['id']:e for e in read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']}
    records={};issues=[]
    for manifest in sorted((REF/'tselpa-browser-assessments').glob('*.json')):
        data=read(manifest);q=parse_qs(urlparse(data['url']).query);grade=int(q['g'][0]);semester=int(q['semester'][0])
        code=q.get('exam',[''])[0] or re.sub(r'-performance(?=_)','',q['tab'][0]);source_id=code.replace('E-exam','E-curri')
        # The 2022 pages display matching author names but use different exam/lesson keys.
        aliases={f'E-exam0{g}-{a}_2026':f'E-curri0{g}-{b}_2026' for g in [5,6]
                 for a,b in [('art-A','art-L'),('music-K','music-C')]}
        aliases.update({f'E-exam0{g}-{a}_2025':f'E-curri0{g}-{b}_2025' for g in [3,4]
                        for a,b in [('music-K','music-C'),('physical-P','physical-G')]})
        source_id=aliases.get(code,source_id)
        matches=[p for p in plans if p['sourceId']==source_id and p['grade']==grade]
        if re.fullmatch(r'E-curri0[12]-ton_2024',source_id):
            matches=[p for p in plans if p['grade']==grade and re.fullmatch(fr'E-curri0{grade}-ton-[A-H]_2024',p['sourceId'])]
        edition_ids={p['editionId'] for p in matches};assert len(edition_ids)==1,(source_id,edition_ids)
        edition=catalog[next(iter(edition_ids))]
        for gi,group in enumerate(data['groups']):
            for fi,item in enumerate(group['lessons']):
                if not item.get('downloadPath'):
                    issues.append(dict(resourceId=item['resourceId'],title=item['title'],sourceUrl=data['url'],reason=item.get('status','download-path-missing')));continue
                src=Path(item['downloadPath']);assert src.resolve().parent==Path('D:/Downloads').resolve(),src
                resource_id=item['resourceId'];assert re.fullmatch(r'\d+',resource_id)
                dest=RAW/('tselpa-assessment-'+resource_id+src.suffix.lower())
                content=src.read_bytes()
                audio_file=src.suffix.lower()=='.mp3'
                valid_audio=audio_file and len(content)>10 and (content.startswith(b'ID3') or (content[0]==255 and content[1]&224==224))
                assert content.startswith(bytes.fromhex('d0cf11e0')) or content.startswith(b'PK') or content.startswith(b'%PDF') or valid_audio,src
                sha=hashlib.sha256(content).hexdigest()
                if dest.exists():assert hashlib.sha256(dest.read_bytes()).hexdigest()==sha,resource_id
                else:shutil.copyfile(src,dest)
                record=dict(id='tselpa-assessment-'+resource_id,resourceId=resource_id,provider='T셀파',publisher=edition['publisher'],editionId=edition['id'],
                    leadAuthor=edition['leadAuthor'],curriculum='2022',subject=edition['subject'],grade=grade,
                    semester=None if all(p['semester'] is None for p in matches) else semester,sourceSemesterFilter=semester,
                    bookCode=code,unit=group['title'],title=item['title'],sourceUrl=data['url'],sourceFile=dest.name,
                    sha256=sha,bytes=len(content),sourceManifest='tselpa-browser-assessments/'+manifest.name,
                    sourceManifestSha256=hashlib.sha256(manifest.read_bytes()).hexdigest(),sourcePointer=f'/groups/{gi}/lessons/{fi}',
                    documentKind='assessment-audio' if audio_file else 'assessment-plan' if '계획' in item['title'] else 'performance-assessment',
                    contentStatus='original-acquired-not-yet-extracted',rightsReview='tselpa-download-review.json')
                if record['id'] in records:
                    assert records[record['id']]['sha256']==sha
                    assert (records[record['id']]['editionId'],records[record['id']]['grade'])==(record['editionId'],record['grade']),(resource_id,'cross-textbook-link-needs-explicit-associations')
                    records[record['id']].setdefault('alternateSourceManifests',[]).append(record['sourceManifest'])
                else:records[record['id']]=record
    acquired_ids={v['resourceId'] for v in records.values()}
    content_path=REF/'assessment-content-tselpa-science-2022.json'
    if content_path.exists():
        for document in read(content_path)['assessments']:
            if document['id'] in records and document['sha256']==records[document['id']]['sha256']:
                records[document['id']].update(contentStatus='structured-fields-extracted',contentFile=content_path.name)
    issues=list({i['resourceId']:i for i in issues if i['resourceId'] not in acquired_ids}.values())
    write(REF/'assessment-index-tselpa-2022.json',dict(schemaVersion=1,assessments=list(records.values())))
    write(REF/'assessment-tselpa-acquisition-review.json',dict(schemaVersion=1,acquiredFiles=len(records),issues=issues,reviewStatus='originals-validated-content-extraction-pending'))
    print(json.dumps(dict(acquiredFiles=len(records),unacquiredListedFiles=len(issues)),ensure_ascii=False))
if __name__=='__main__':run()
