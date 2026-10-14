"""Fetch only listed assessment and plan files from observed public ebook manifests."""
import hashlib,json,re,sys,urllib.request,urllib.parse,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def fetch(entry):
    path=RAW/entry['sourceFile']
    try:
        if not path.exists():
            url=urllib.parse.quote(entry['downloadUrl'],safe=':/?=&%')
            with urllib.request.urlopen(url,timeout=40) as response:data=response.read()
            assert data.startswith((b'\xd0\xcf\x11\xe0',b'PK',b'%PDF')),data[:80]
            path.write_bytes(data)
        entry.update(status='acquired',bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    except Exception as error:entry.update(status='failed',error=str(error))
    return entry
def run():
    entries=[]
    for source in sorted(RAW.glob('visang-*-bank.json')):
        sid=re.fullmatch(r'visang-(\d+)-bank.json',source.name)[1];s=read(source)
        base=f'https://ibook.vivasam.com/CBS_iBook/{sid}/contents/data_bank/data_bank.html'
        for ui,unit in enumerate(s['units']):
            for category,items in unit.get('attachments',{}).items():
                for ai,item in enumerate(items):
                    if category!='평가 자료' and item['name'] not in ['단원별 차시 계획','연간 지도 계획','연간 교수 학습 계획']:continue
                    if not item.get('path'):continue
                    ext=Path(item['path']).suffix.lower();fid=f'visang-bank-{sid}-u{ui+1}-{category}-{ai+1}'
                    entries.append(dict(id=fid,course=s['courseName'],unit=unit['unitName'],title=item['name'],category=category,
                        sourceManifest=source.name,sourcePointer=f'/units/{ui}/attachments/{category}/{ai}',
                        sourceUrl=base,downloadUrl=urllib.parse.urljoin(base,item['path']),sourceFile=fid+ext))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,entries))
    write(REF/'visang-public-bank-acquired.json',dict(schemaVersion=1,sources=results))
    print(json.dumps(dict(files=len(results),acquired=sum(r['status']=='acquired' for r in results),failures=[r for r in results if r['status']!='acquired']),ensure_ascii=False))
if __name__=='__main__':run()
