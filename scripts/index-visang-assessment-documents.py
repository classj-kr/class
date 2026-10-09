"""Index individual files, including ZIP members, without changing source archives."""
import hashlib,json,re,zipfile
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def decode(info):
    if info.flag_bits & 0x800:return info.filename
    try:return info.filename.encode('cp437').decode('cp949')
    except UnicodeError:return info.filename
def run():
    assets=read(REF/'assessment-index-visang-2022.json')['assessments']
    editions=read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']
    records=[];bundles=[]
    for asset in assets:
        m=re.search(r'(수학|과학|사회)\s*([3-6])-([12])',asset['course']);assert m,asset['course']
        subject,grade,semester=m[1],int(m[2]),int(m[3])
        candidates=[e for e in editions if e['publisher']=='비상교육' and e['subject']==subject and grade in e['grades']]
        assert len(candidates)==1,(subject,grade)
        common=dict(parentAssetId=asset['id'],editionId=candidates[0]['id'],publisher='비상교육',curriculum='2022',
                    subject=subject,grade=grade,semester=semester,category=asset['title'],sourceFile=asset['sourceFile'],
                    sourceSha256=asset['sha256'],sourceUrl=asset['sourceUrl'],contentStatus=asset['contentStatus'])
        p=REF/'raw'/asset['sourceFile'];assert hashlib.sha256(p.read_bytes()).hexdigest()==asset['sha256']
        if p.suffix.lower()=='.zip':
            count=0
            with zipfile.ZipFile(p) as z:
                for info in z.infolist():
                    if info.is_dir():continue
                    name=decode(info);ext=Path(name).suffix.lower()
                    # Reading the member verifies its ZIP CRC; paths are never extracted to disk.
                    with z.open(info) as stream:
                        sha=hashlib.file_digest(stream,'sha256').hexdigest()
                    records.append({**common,'id':asset['id']+'-member-'+hashlib.sha256(name.encode()).hexdigest()[:12],
                        'title':Path(name).stem,'format':ext.lstrip('.'),'archiveMember':name,'archiveMemberCrc32':info.CRC,
                        'bytes':info.file_size,'sha256':sha,'contentStatus':'original-acquired-not-yet-extracted'})
                    count+=1
            bundles.append(dict(assetId=asset['id'],memberFiles=count))
        else:
            title=Path(asset.get('archiveMember',asset.get('downloadUrl',asset['sourceFile']))).stem
            records.append({**common,'id':asset['id'],'title':title,'format':p.suffix.lstrip('.'),
                            'bytes':asset['bytes'],'sha256':asset['sha256']})
    duplicate=Counter(r['sha256'] for r in records)
    for r in records:r['sameContentFileCount']=duplicate[r['sha256']]
    summary=dict(assetCount=len(assets),zipBundles=len(bundles),zipMemberFiles=sum(x['memberFiles'] for x in bundles),
                 individualFiles=len(records),uniqueFileHashes=len(duplicate),
                 bySubject=dict(Counter(r['subject'] for r in records)),
                 countMeaning='individual source files, not unique assessment tasks; rubric stages and repeated worksheets may share files')
    write(REF/'assessment-documents-visang-2022.json',dict(schemaVersion=1,summary=summary,bundles=bundles,documents=records))
    print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':run()
