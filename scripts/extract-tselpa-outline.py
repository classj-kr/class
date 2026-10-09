"""Extract teacher-visible lesson labels from archived public curriculum HTML."""
import json,re
from pathlib import Path
from lxml import html
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
def text(e):return re.sub(r'\s+',' ',' '.join(e.itertext())).strip()
def run():
    manifest=json.loads((REF/'tselpa-public-sources.json').read_text(encoding='utf-8'))
    result=[]
    for s in manifest['sources']:
        groups=[]
        for g in s['groups']:
            d=html.fromstring((REF/'raw'/g['sourceFile']).read_text(encoding='utf-8-sig'))
            lessons=[]
            for block in d.xpath('//div[contains(concat(" ",normalize-space(@class)," ")," accordion_block ")]'):
                labels=block.xpath('./div[@class="leftOne"]/label')
                if not labels:continue
                raw=text(labels[0])
                lessons.append(dict(id=block.get('data-id'),raw=raw))
            groups.append(dict(**g,lessons=lessons))
        result.append(dict(**{k:v for k,v in s.items() if k!='groups'},groups=groups))
    (REF/'tselpa-outline-extracted.json').write_text(json.dumps(dict(schemaVersion=1,sources=result),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('sources',len(result),'rows',sum(len(g['lessons']) for s in result for g in s['groups']))
    for s in result:
        print(s['grade'],s['semester'],s['title'],[(g['unit'],len(g['lessons'])) for g in s['groups']])
if __name__=='__main__':run()
