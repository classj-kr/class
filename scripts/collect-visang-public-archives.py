"""Read public ZIP directories and acquire selected data members with HTTP ranges."""
import io,json,urllib.request,urllib.parse,zipfile,hashlib,re,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
class RemoteZip(io.RawIOBase):
    def __init__(self,url):
        self.url=urllib.parse.quote(url,safe=':/?=&%');self.pos=0;self.transferred=0
        with urllib.request.urlopen(urllib.request.Request(self.url,method='HEAD'),timeout=30) as r:self.size=int(r.headers['Content-Length'])
    def seekable(self):return True
    def readable(self):return True
    def tell(self):return self.pos
    def seek(self,offset,whence=0):
        self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.size+offset
        return self.pos
    def read(self,n=-1):
        if n<0:n=self.size-self.pos
        n=min(n,self.size-self.pos)
        if n<=0:return b''
        assert n<64000000,('oversized range',n)
        req=urllib.request.Request(self.url,headers={'Range':f'bytes={self.pos}-{self.pos+n-1}'})
        with urllib.request.urlopen(req,timeout=30) as r:
            assert r.status==206,('server does not support ranges',r.status)
            data=r.read(n)
        self.pos+=len(data);self.transferred+=len(data);return data
def decode(n):
    try:return n.encode('cp437').decode('cp949')
    except UnicodeError:return n
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def collect(source):
    remote=RemoteZip(source['url']);rows=[];files=[]
    allowed=['동료 평가 활동지','학생 평가 활동지','보충 심화 활동지','수행 평가','과학 글쓰기 평가','단원 총괄 평가','단원별 차시 계획','과정 중심 평가 자료','과정 중심 평가 문제','확인 평가','형성 평가','서술형 평가','단원 평가 기본 문제','단원 평가 실력 문제','진단 평가 문제']
    lesson_assessments=['교사용 학생 평가지','동료 평가지','자기 평가지']
    with zipfile.ZipFile(remote) as z:
        for item in z.infolist():
            name=decode(item.filename);rows.append(dict(name=name,bytes=item.file_size,crc32=item.CRC))
            if item.is_dir():continue
            bank=bool(re.search(r'/json/data_bank/cource-(science|society)\.json$',name))
            title=next((t for t in allowed if '/단원별 자료/'+t+'/' in name),None)
            if not title:title=next((t for t in lesson_assessments if '/차시별 자료/'+t+'/' in name),None)
            if not bank and not title:continue
            ext=Path(name).suffix.lower()
            if ext not in ['.hwp','.hwpx','.zip','.pdf','.json']:continue
            sid='visang-archive-'+source['id']+'-'+hashlib.sha256(name.encode()).hexdigest()[:12]
            dest=RAW/(sid+ext)
            if not dest.exists():
                assert item.file_size<64000000,(name,item.file_size)
                data=z.read(item);dest.write_bytes(data)
            files.append(dict(id=sid,course=source['course'],title=title or '자료실 목록',category='metadata' if bank else '수업 자료' if title=='단원별 차시 계획' else '평가 자료',
                archiveSourceId=source['id'],sourceUrl=source['url'],exhibitionUrl=source['exhibitionUrl'],archiveMember=name,
                sourceFile=dest.name,bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),archiveMemberCrc32=item.CRC,status='acquired'))
    write(RAW/('visang-'+source['id']+'-archive-index.json'),dict(sourceUrl=source['url'],archiveBytes=remote.size,members=rows))
    result=dict(id=source['id'],archiveBytes=remote.size,downloadedBytes=remote.transferred,selectedFiles=len(files),sources=files)
    write(REF/('visang-'+source['id']+'-archive-acquired.json'),result)
    print(json.dumps({k:v for k,v in result.items() if k!='sources'}),flush=True)
    return result
if __name__=='__main__':
    sources=read(REF/'visang-public-archives.json')['sources']
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(collect,sources))
    write(REF/'visang-public-archive-acquired.json',dict(schemaVersion=1,sources=[s for r in results for s in r['sources']]))
