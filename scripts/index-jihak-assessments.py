"""Index Jihak originals downloaded through the signed-in browser UI."""
import hashlib,json,re,shutil
from pathlib import Path
from urllib.parse import urlparse,parse_qs
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def run():
    catalog=read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions'];records={};issues=[]
    for manifest in sorted((REF/'jihak-browser-assessments').glob('*.json')):
        page=read(manifest);q=parse_qs(urlparse(page['url']).query);grade=int(q['grade'][0]);semester=int(q['term'][0])
        book=page['textbook'].splitlines();subject=re.match(r'[^\d\s]+',book[0])[0];author=book[-1].strip()
        source_subject=subject
        if grade in [1,2] and author=='국정' and subject not in ['국어','수학']:
            assert any(e['subject']=='통합교과' and any(v['grade']==grade and v['semester']==semester and v['title'].startswith(subject+'(') for v in e['volumes']) for e in catalog),(grade,semester,subject)
            subject='통합교과'
        matches=[e for e in catalog if e['subject']==subject and grade in e['grades'] and
                 ((e['publisher']=='지학사' and e['leadAuthor']==author) or (author=='국정' and e['approvalType']=='국정'))]
        assert len(matches)==1,(page['textbook'],len(matches));edition=matches[0]
        for gi,g in enumerate(page['groups']):
            for fi,f in enumerate(g['lessons']):
                rid=f['resourceId'];assert re.fullmatch('[a-f0-9]{32}',rid)
                if not f.get('downloadPath'):issues.append(dict(resourceId=rid,title=f['title'],sourceUrl=page['url'],reason=f.get('status','missing-download')));continue
                src=Path(f['downloadPath']);assert src.resolve().parent==Path('D:/Downloads').resolve()
                content=src.read_bytes();assert content.startswith(bytes.fromhex('d0cf11e0')) or content.startswith(b'PK') or content.startswith(b'%PDF'),src
                sha=hashlib.sha256(content).hexdigest();dest=RAW/('jihak-assessment-'+rid+src.suffix.lower())
                if dest.exists():assert hashlib.sha256(dest.read_bytes()).hexdigest()==sha
                else:shutil.copyfile(src,dest)
                annual=subject in ['음악','미술','체육','실과','영어']
                title_key=re.sub(r'\s+','',f['title'])
                kind=('assessment-plan' if '계획서' in title_key else 'teacher-comment-bank' if '평어' in title_key else
                      'assessment-template' if '양식' in title_key else 'achievement-reference' if '성취' in title_key else 'performance-assessment')
                record=dict(id='jihak-assessment-'+rid,resourceId=rid,provider='지학사 티솔루션',publisher=edition['publisher'],leadAuthor=edition['leadAuthor'],
                    curriculum='2022',editionId=edition['id'],grade=grade,subject=subject,semester=None if annual else semester,sourceSemesterFilter=semester,
                    sourceBookLabel=page['textbook'],sourceSubject=source_subject,sourceRole='learning-supplement' if '보완' in page['textbook'] else 'main-textbook-support',
                    title=f['title'],documentKind=kind,unit=g['title'],sourceUrl=page['url'],sourceFile=dest.name,originalFilename=src.name,sha256=sha,bytes=len(content),
                    sourceManifest='jihak-browser-assessments/'+manifest.name,sourceManifestSha256=hashlib.sha256(manifest.read_bytes()).hexdigest(),
                    sourcePointer=f'/groups/{gi}/lessons/{fi}',contentStatus='original-acquired-not-yet-extracted',rightsReview='jihak-assessment-rights-review.json')
                if rid in records:
                    assert records[rid]['sha256']==sha
                    assert (records[rid]['editionId'],records[rid]['grade'])==(record['editionId'],record['grade']),(rid,'cross-textbook-link-needs-explicit-associations')
                    records[rid].setdefault('alternateSourceManifests',[]).append(record['sourceManifest'])
                else:records[rid]=record
    content_path=REF/'assessment-content-jihak-science-2022.json'
    if content_path.exists():
        for document in read(content_path)['assessments']:
            if document['resourceId'] in records and document['sha256']==records[document['resourceId']]['sha256']:
                records[document['resourceId']].update(contentStatus='structured-fields-extracted',contentFile=content_path.name)
    write(REF/'assessment-index-jihak-2022.json',dict(schemaVersion=1,assessments=list(records.values())))
    write(REF/'assessment-jihak-acquisition-review.json',dict(schemaVersion=1,acquiredFiles=len(records),issues=issues))
    print(json.dumps(dict(acquiredFiles=len(records),unacquiredListedFiles=len(issues))))
if __name__=='__main__':run()
