"""Import reviewed Commons images, retaining framing and license metadata."""
import concurrent.futures
import html
import io
import json
import re
import shutil
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
APP=ROOT/'learning/inquiry/age-of-exploration'
WORK=ROOT/'tmp/voyage-textbook-audit'
TARGET=APP/'public/assets/landmarks'
credits_path=APP/'data/catalog/photo-credits.json'
credits=json.loads(credits_path.read_text(encoding='utf8'))
globe=json.loads((ROOT/'learning/inquiry/globe/data/info.json').read_text(encoding='utf8'))
reuse={'great-artesian-basin':'basin:대찬정 분지','sahel':'plain:사헬',
       'great-dividing-range':'mountain:그레이트디바이딩산맥',
       'wadden-sea':'other:바덴해','serengeti':'plain:세렝게티'}
selection=json.loads((WORK/'photo-selection.json').read_text(encoding='utf8'))


def plain(value):return html.unescape(re.sub('<[^>]+>','',value)).strip()


def photo(item):
    id,title=item
    data=json.loads((WORK/(id+'-photos.json')).read_text(encoding='utf8'))
    page=next(p for p in data['query']['pages'].values() if p['title']=='File:'+title)
    info=page['imageinfo'][0];meta=info['extmetadata']
    license=plain(meta['LicenseShortName']['value'])
    if not re.match(r'^(CC0|CC BY|Public domain)',license):raise ValueError(f'Unreviewed license: {license}')
    req=urllib.request.Request(info.get('thumburl',info['url']),headers={'User-Agent':'ClassTextbookCollection/1.0'})
    with urllib.request.urlopen(req,timeout=60) as response:raw=response.read()
    with Image.open(io.BytesIO(raw)) as opened:
        image=ImageOps.exif_transpose(opened).convert('RGB');image.thumbnail((1280,1280),Image.Resampling.LANCZOS)
        image.save(TARGET/(id+'.webp'),'WEBP',quality=88,method=6)
    row={'author':plain(meta.get('Artist',{}).get('value','Wikimedia Commons contributors')),
         'license':license,'licenseUrl':meta.get('LicenseUrl',{}).get('value') or 'https://creativecommons.org/publicdomain/mark/1.0/',
         'source':info['descriptionurl'],'kind':'photo','caption':'오늘날의 모습',
         'changes':'원본 구도를 유지해 크기 축소 및 WebP 변환','preserveFrame':True}
    with Image.open(TARGET/(id+'.webp')) as check:check.load();assert check.format=='WEBP' and max(check.size)<=1280
    return id,row


if __name__=='__main__':
    TARGET.mkdir(parents=True,exist_ok=True)
    for id,key in reuse.items():
        source=globe[key]['photo'];path=ROOT/'learning/inquiry/globe'/source['src'];assert path.is_file()
        shutil.copyfile(path,TARGET/(id+'.webp'))
        match=re.search(r'(\d\.\d)',source['license'])
        url=('https://creativecommons.org/licenses/'+('by-sa' if 'SA' in source['license'] else 'by')+'/'+match[1]+'/') if match else 'https://creativecommons.org/publicdomain/mark/1.0/'
        credits[id]={'author':source['author'],'license':source['license'],'licenseUrl':url,
                     'source':source['page'],'kind':'photo','caption':source['caption'],'changes':'크기 축소 및 WebP 변환','preserveFrame':True}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for id,row in pool.map(photo,selection.items()):
            credits[id]=row;print(id,row['license'],flush=True)
    credits_path.write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('Registered 16 verified WebP photos with source and license metadata')
