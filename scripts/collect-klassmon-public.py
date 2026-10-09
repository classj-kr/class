"""Archive the already-observed public textbook pages and compare DOM outlines."""
import hashlib
import json
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse,parse_qs
from lxml import html

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'

def clean(s):return re.sub(r'\s+',' ',s).strip()
def cls(name):return f'contains(concat(" ",normalize-space(@class)," ")," {name} ")'

def acquire(source):
    sid=parse_qs(urlparse(source['url']).query)['textbookSeq'][0]
    path=REF/'raw'/f'klassmon-{sid}.html'
    if not path.exists():
        with urlopen(Request(source['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as response:
            path.write_bytes(response.read())
    raw=path.read_bytes();tree=html.fromstring(raw.decode('utf-8'))
    book=tree.xpath(f'//*[{cls("book-info")}]')[0]
    assert book.xpath(f'./div[{cls("badge")}]')[0].text_content().strip()=='2022 개정',sid
    assert book.xpath('./h2')[0].text_content().strip()==source['title'],sid
    groups=[]
    for element in tree.xpath(f'//*[{cls("listCont")}]//*[{cls("title-area")}]'):
        card=element.xpath(f'ancestor::*[{cls("card")}]')[0]
        unit=clean(card.xpath(f'./div[{cls("card-header")}]/a')[0].text_content())
        container=element.xpath(f'ancestor::*[{cls("list")}]')[0]
        subunit=clean(container.xpath('.//h3')[0].text_content())
        period=element.xpath(f'./span[{cls("st")}]')[0].text_content().strip()
        topic=element.xpath(f'./span[{cls("tt")}]')[0].text_content().strip()
        group=next((g for g in groups if g['unit']==[unit,subunit]),None)
        if group is None:group={'unit':[unit,subunit],'lessons':[]};groups.append(group)
        group['lessons'].append([period,topic])
    assert groups==source['groups'],sid
    return dict(sourceId=sid,sourceUrl=source['url'],sourceFile=path.name,sha256=hashlib.sha256(raw).hexdigest(),
                bytes=len(raw),curriculum='2022',validation='public-html-matches-browser-outline',
                rows=sum(len(g['lessons']) for g in groups))

if __name__=='__main__':
    sources=json.loads((REF/'klassmon-outline-sources.json').read_text(encoding='utf-8'))['sources']
    with ThreadPoolExecutor(max_workers=3) as pool: acquired=list(pool.map(acquire,sources))
    (REF/'klassmon-acquired-sources.json').write_text(json.dumps({'retrievedOn':'2026-10-09','sources':acquired},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'acquired':len(acquired),'validatedRows':sum(s['rows'] for s in acquired)}))
