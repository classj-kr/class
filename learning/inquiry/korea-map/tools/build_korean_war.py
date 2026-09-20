"""Generate six Korean War learning stages and four unlabelled order cards.

python build_korean_war.py --countries /path/to/ne_50m_admin_0_countries.geojson
Fronts: National Archives vector diagrams, registered by named places. Areas are
schematic military control, never changes in legal sovereignty. Cards and the
main map use exactly the same geometry, extent and force colours.
"""
import argparse
import json
import math
from html import escape
from pathlib import Path
from shapely.geometry import shape, box, Polygon, Point, LineString
from shapely.ops import unary_union
from shapely import make_valid
from extract_history_boundaries import registration
from build_history_territories import pieces, merc, smooth

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'history/territories'
SOURCE='https://theme.archives.go.kr/next/625/process/frontline.do'
BLUE='#83b9d6'
RED='#e0a096'
REFERENCE=[[124.35,38],[129,38]]
EXTENT=[120.5,32,133,44]
CARD_EXTENT=[123.4,33,131.6,43.15]


def build(countries_path):
    countries={f['properties']['ADM0_A3']:make_valid(shape(f['geometry'])) for f in json.loads(Path(countries_path).read_text(encoding='utf-8'))['features']}
    korea=unary_union([countries['KOR'],countries['PRK']])
    reference=json.loads((ROOT/'history/war-frontline-reference.json').read_text(encoding='utf-8'))
    register=registration(reference['controls'])
    fronts={k:smooth(register(v['pixels'])) for k,v in reference['fronts'].items()}
    borders=json.loads((ROOT/'data/borders.js').read_text(encoding='utf-8').split('window.KOREA_BORDERS = ')[1].strip().removesuffix(';'))
    mdl=[[lon,lat] for lat,lon in reversed(borders['mdl'][0])]
    # Jeju, Ulleung and the western offshore islands were not swept into the
    # mainland North Korean advance merely because they lie north of a line.
    islands=unary_union([p for p in pieces(korea) if p.area<1 and (p.centroid.y<34 or p.centroid.x>130.5 or (p.centroid.x<124.8 and p.centroid.y<38.3))])
    def south_of(front,nakdong=False):
        west=front[0][0] if nakdong else 120
        ring=[(west,30),(134,30),(134,front[-1][1]),*reversed(front),(west,front[0][1])]
        return korea.intersection(make_valid(Polygon(ring))).union(islands)
    def mark(name,x,y,side='right'):
        return {'label':name,'xy':[x,y],'side':side,'kind':'point'}
    seoul=mark('서울',126.9784,37.566)
    busan=mark('부산',129.05,35.16)
    pyongyang=mark('평양',125.75432,39.03385,'left')
    states=[
      dict(id='1950',date='1950.6 · 전쟁 발발 전',title='38선으로 나뉜 남북',south=korea.intersection(box(120,30,134,38)),front=REFERENCE,
        northName='북한',southName='대한민국',marks=[seoul,pyongyang,busan],routes=[],
        cues=[['기준선','38선은 북위 38도의 위도선이다.'],['전쟁 발발','1950년 6월 25일 북한군이 38선을 넘어 남침했다.']],
        trap='전쟁 전의 38선과 1953년 정전 뒤 군사분계선은 모양도 위치도 다르다.'),
      dict(id='nakdong',date='1950.8~9 · 낙동강 방어',title='낙동강 방어선',south=south_of(fronts['nakdong'],True),front=fronts['nakdong'],
        northName='북한군',southName='국군·유엔군',marks=[seoul,mark('왜관 · 낙동강 방어',128.4,35.98,'left'),busan],
        routes=[{'coords':[[126.6,38.3],[127.1,37],[128,36.3]],'color':1}],
        cues=[['지도 판별','국군·유엔군 확보 지역이 부산을 포함한 동남부에 좁게 남아 있다.'],['다음 사건','인천 상륙 작전과 낙동강 전선의 반격으로 전세가 바뀐다.']],
        trap='남쪽으로 밀려난 모습만 보지 말고, 동남부의 좁은 방어 지역을 확인한다.'),
      dict(id='seoul',date='1950.9 말 · 인천 상륙 이후',title='서울 수복과 38선 회복',south=korea.intersection(box(120,30,134,38)),front=REFERENCE,
        northName='북한군',southName='국군·유엔군',marks=[mark('인천 · 상륙(9.15)',126.63,37.47,'left'),mark('서울 · 수복(9.28)',126.9784,37.566),busan],
        routes=[{'coords':[[125.8,36.9],[126.63,37.47],[126.9784,37.566]],'color':0},
                {'coords':[[128.6,35.9],[127.9,36.5],[127.3,37.4]],'color':0}],
        cues=[['상륙과 반격','인천 상륙(9.15)과 낙동강 반격 뒤 서울을 수복(9.28)했다.'],['이어서','9월 말 38선 부근을 회복하고 10월부터 38선을 넘어 북진했다.']],
        trap='상륙 당일에 한반도 남부를 모두 수복한 것이 아니다. 이 지도는 9월 말의 회복 범위를 요약한다.'),
      dict(id='north',date='1950.10~11 · 국군·유엔군 북진',title='북방으로 확대된 확보 지역',south=south_of(fronts['north']),front=fronts['north'],
        northName='북한군·중국군',southName='국군·유엔군',marks=[pyongyang,mark('초산 · 압록강 방면',125.8,40.825,'left'),mark('혜산진 방면',128.18,41.4)],
        routes=[{'coords':[[126.9,37.7],[125.75,39.03],[125.8,40.5]],'color':0},
                {'coords':[[127.45,39.15],[128.18,40.3],[129.65,41.65]],'color':0}],
        cues=[['지도 판별','국군·유엔군 확보 지역이 평양을 넘어 압록강·함경도 방면까지 확대된다.'],['순서 주의','중국군은 10월에 이미 개입했다. 최대 북진 뒤에 처음 등장한 것은 아니다.']],
        trap='북진 지도 다음에는 중국군 공세에 따른 후퇴 지도가 온다. 각 부대의 최대 진출은 같은 날짜가 아니다.'),
      dict(id='retreat',date='1951.1 · 중국군 공세와 후퇴',title='1·4 후퇴 뒤의 전선',south=south_of(fronts['retreat']),front=fronts['retreat'],
        northName='북한군·중국군',southName='국군·유엔군',marks=[mark('서울 · 1·4 후퇴',126.9784,37.566,'left'),mark('평택 방면',127.11,36.99),busan],
        routes=[{'coords':[[125.8,40.5],[125.75,39.03],[126.97,37.57]],'color':1},
                {'coords':[[127.5,39.8],[128.1,38.5],[128,37.4]],'color':1}],
        cues=[['지도 판별','서울이 북한군·중국군 쪽에 있고 전선은 38선 남쪽으로 내려와 있다.'],['낙동강 때와 구별','부산 일대만 남은 1950년의 지도보다 국군·유엔군 확보 지역이 넓다.']],
        trap='서울에서 철수한 1월 4일과 그 뒤 남하한 전선을 같은 순간으로 혼동하지 않는다.'),
      dict(id='1953',date='1953.7.27 · 정전',title='재반격·교착 뒤 군사분계선',south=countries['KOR'],front=mdl,
        northName='북한군·중국군',southName='국군·유엔군',marks=[seoul,mark('판문점 · 정전 협정',126.67,37.96,'left'),busan],routes=[],
        cues=[['재반격과 교착','1951년 서울을 다시 수복하고 38선 부근에서 전선이 교착되었다.'],['정전','정전 협상과 고지전을 거쳐 1953년 7월 27일 정전 협정이 체결되었다.']],
        trap='붉은 선은 정전 때의 군사분계선이다. 38선과 일치하지 않으며 해상 경계선이 아니다.')
    ]
    for state in states:
        state['north']=korea.difference(state['south'])
        assert state['south'].intersection(state['north']).area<1e-8
        assert korea.symmetric_difference(state['south'].union(state['north'])).area<1e-8
        assert state['south'].covers(Point(129.05,35.16)),state['id']+' must retain Busan'
    for id,city,expected in [('nakdong',seoul,False),('seoul',seoul,True),('north',pyongyang,True),('retreat',seoul,False),('1953',seoul,True)]:
        state=next(s for s in states if s['id']==id)
        assert state['south'].covers(Point(city['xy']))==expected,(id,city)

    def svg(state,extent,card=False):
        w,s,e,n=extent
        factor=900/math.radians(e-w);top=merc(n);height=(top-merc(s))*factor
        xy=lambda lon,lat:f'{math.radians(lon-w)*factor:.2f},{(top-merc(lat))*factor:.2f}'
        def line(coords):return 'M'+'L'.join(xy(x,y) for x,y in coords)
        def path(g):return ''.join(line(p.exterior.coords)+'Z'+''.join(line(r.coords)+'Z' for r in p.interiors) for p in pieces(g.intersection(box(*extent)).simplify(.003,preserve_topology=True)))
        output=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {height:.2f}"><title>한반도 전선 지도</title>']
        if card: output.append(f'<rect width="900" height="{height:.2f}" fill="#eff4f4"/>')
        for code in ['CHN','RUS','JPN']:
            output.append(f'<path d="{path(countries[code])}" fill="#dedecf" fill-opacity="{1 if card else .55}" stroke="#a5ab9c" stroke-width="1"/>')
        for side,color in [('north',RED),('south',BLUE)]:
            output.append(f'<path data-control="{side}" d="{path(state[side])}" fill="{color}" fill-opacity="{1 if card else .76}" fill-rule="evenodd" stroke="#607574" stroke-width=".7"/>')
        if card:
            output.append(f'<path d="{line(REFERENCE)}" fill="none" stroke="#6c7475" stroke-width="2" stroke-dasharray="8 7"/>')
            output.append(f'<path d="{line(state["front"])}" fill="none" stroke="#873d32" stroke-width="4"/>')
            for name,coord in [('평양',[125.75432,39.03385]),('서울',[126.9784,37.566]),('부산',[129.05,35.16])]:
                px,py=map(float,xy(*coord).split(','))
                output.append(f'<circle cx="{px}" cy="{py}" r="5" fill="#344c52"/><text x="{px+10}" y="{py+9}" font-family="sans-serif" font-size="29" fill="#243b43">{name}</text>')
        output.append('</svg>')
        return ''.join(output)+'\n'

    OUT.mkdir(exist_ok=True)
    manifest=[]
    core=['nakdong','north','retreat','1953']
    audit=[]
    for index,state in enumerate(states):
        filename=f'war-{state["id"]}.svg'
        (OUT/filename).write_text(svg(state,EXTENT),encoding='utf-8')
        card=None
        if state['id'] in core:
            # Neutral filenames and SVG titles do not disclose dates in a quiz.
            card=f'history/territories/war-card-{core.index(state["id"])+1}.svg?v=20260921-war-1'
            (ROOT/card.split('?')[0]).write_text(svg(state,CARD_EXTENT,True),encoding='utf-8')
        mid=state['north'].representative_point()
        southmid=state['south'].representative_point()
        labels=[{'name':state['northName'],'xy':[mid.x,mid.y]}, {'name':state['southName'],'xy':[southmid.x,southmid.y]}]
        lines=[{'label':'군사분계선' if state['id']=='1953' else '전선' if state['id']!='1950' else '38선',
                'coords':state['front'],'color':'#963f35','kind':'armistice' if state['id']=='1953' else 'front'}]
        if state['id']!='1950':lines.append({'label':'38선(기준)','coords':REFERENCE,'color':'#69777b','kind':'division'})
        note='국가기록원 전선 도판을 도시 기준점에 맞춰 재구성한 개략도입니다. 색은 육상의 작전상 지배·점령 범위이며 법적 영토 변경이나 세부 부대 배치를 뜻하지 않습니다.'
        manifest.append(dict(id=state['id'],date=state['date'],stageTitle=state['title'],order=index,card=card,
          overlay=f'history/territories/{filename}?v=20260921-war-1',overlayBounds=EXTENT,
          legend=[{'label':state['southName']+' 확보 지역','color':BLUE},{'label':state['northName']+' 지배 지역','color':RED}],
          labels=labels,sources=[['국가기록원 · 전선의 변화',SOURCE]],note=note,lines=lines,
          lesson={'marks':state['marks'],'routes':state['routes'],'cues':state['cues'],'trap':state['trap'],'note':'색은 군사적 지배·점령 지역, 선은 해당 시기의 전선입니다.'}))
        audit.append({'id':state['id'],'southArea':state['south'].area,'northArea':state['north'].area,'front':state['front']})
    content={'defaultStage':'nakdong','quizStages':core,'stages':manifest,'source':SOURCE}
    (ROOT/'data/history-war.js').write_text('// Generated by tools/build_korean_war.py.\nwindow.KOREA_HISTORY_WAR = '+json.dumps(content,ensure_ascii=False,separators=(',',':'))+';\nwindow.KOREA_HISTORY_TERRITORIES.scenes["korean-war"] = window.KOREA_HISTORY_WAR.stages;\nwindow.KOREA_HISTORY.scenes.find(s => s.id === "korean-war").defaultTerritory = window.KOREA_HISTORY_WAR.defaultStage;\n',encoding='utf-8')
    (OUT/'war-geometry-audit.json').write_text(json.dumps({'source':reference,'stages':audit},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Korean War: {len(manifest)} stages / {len(core)} quiz map cards; land partition and city-side checks passed.')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--countries',required=True)
    build(parser.parse_args().countries)
