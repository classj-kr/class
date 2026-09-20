"""Build the chronological territorial backdrops (not battle fronts).

Requires numpy, Shapely; input: Natural Earth's public-domain 1:50m countries.
Historical frontier traces below retain the source image pixels and registration
controls. Modern country geometry supplies coastlines, NOT medieval frontiers.
Output is offline SVG + a dated, source-linked manifest for every history scene.
"""
import argparse
import json
import math
from html import escape
from pathlib import Path

import numpy as np
from shapely.geometry import Polygon, MultiPolygon, GeometryCollection, box, shape, Point
from shapely.ops import unary_union
from shapely import make_valid

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'history' / 'territories'
COLORS = {'korea':'#a9c98a', 'north':'#96bcd2', 'china':'#e7c89e',
          'japan':'#dcb1b5', 'russia':'#c6b8da', 'tribes':'#d1d0b3',
          'baekje':'#e7b579', 'gaya':'#c2add3'}
TA = 'https://contents.history.go.kr/mobile/ta/view.do?levelId='
ATLAS = 'https://textbook-miraen.cdn.x-cdn.com/textbook/2019/text_mk/high/his_map/고등_역사부도_교과서_미리보기.pdf'
SOURCE = {
    'atlas': ['미래엔 역사부도 22쪽 · 강동 6주와 고려 북방', ATLAS],
    'namgyung': ['한국민족문화대백과사전 · 발해 5경의 위치', 'https://encykorea.aks.ac.kr/Article/E0021626'],
    'balhae': ['우리역사넷 · 발해의 발전', TA+'ta_m61_0050_0030'],
    'silla': ['우리역사넷 · 통일 신라', TA+'ta_m61_0050_0020'],
    'later': ['우리역사넷 · 후삼국', TA+'ta_m61_0050_0040'],
    'goryeo': ['우리역사넷 · 고려의 대외 관계', TA+'ta_m61_0070_0010'],
    'gongmin': ['우리역사넷 · 공민왕의 개혁', TA+'ta_m61_0070_0030'],
    'joseon': ['우리역사넷 · 조선의 영토 개척', TA+'ta_m41_0070_0010'],
    'yuan': ['우리역사넷 · 동녕부', 'https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i200530'],
    'manchu': ['우리역사넷 · 만주국', 'https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i401701'],
    'war': ['국가기록원 · 6·25 전쟁 전선의 변화', 'https://theme.archives.go.kr/next/625/process/frontline.do'],
}

# Original textbook diagram coordinates; each control = pixel x,y, longitude,latitude.
# An affine fit in Mercator is deliberately used outside the control-point hull;
# unconstrained thin-plate extrapolation would invent bends in remote frontiers.
TRACES = {
 'six': {
  'image':ATLAS+'#page=15',
  'crop':{'renderScale':3,'box':[1190,310,1970,1000]},
  'controls':[[137,200,124.53167,40.19944],[204,222,125.2529,39.97969],
   [236,294,125.659,39.617],[258,359,125.75432,39.03385],
   [357,502,126.55444,37.97083],[453,259,127.65,39.78]],
  'six':[[104,223],[113,200],[137,197],[157,206],[180,210],[211,217],
   [223,230],[246,233],[244,250],[232,266],[206,270],[173,270],[147,265],[128,261],[105,247]],
  'north':[[104,196],[126,177],[149,169],[162,154],[193,158],[222,169],
   [249,180],[277,199],[309,204],[320,198],[333,220],[353,225],[369,253],
   [401,258],[415,261],[431,240],[441,235],[458,238]]},
 'balhae': {
  'image':'https://contents.history.go.kr/data/img/ta/ta_m61/ta_m61_1000_01.jpg',
  'controls':[[235,223,129.16,44.1],[209,249,128.22861,43.36954],
   [237,271,129.03,42.82],[271,271,130.57,42.86],[175,310,126.9,41.8],
   [87,390,124.37,40.1],[175,486,126.9784,37.566],[242,548,129.21167,35.84278],
   [47,341,123.18,41.27],[328,182,132.42,45.04]],
  'westNorth':[[87,390],[80,348],[71,323],[79,304],[72,279],[77,255],[90,227],
   [105,194],[105,171],[101,146],[121,144],[141,155],[167,144],[191,143],
   [215,149],[231,145],[251,110],[278,99],[302,95],[325,65],[352,53],[378,36],[405,25]],
  'south':[[115,435],[126,431],[147,425],[156,423],[164,414],[173,415],[175,424],[182,416],[188,418]]},
 'later': {
  'image':'https://contents.history.go.kr/data/img/ta/ta_m61/ta_m61_1090_01.jpg',
  'controls':[[112,157,125.75432,39.03385],[171,235,126.55444,37.97083],
   [208,213,127.2175,38.20917],[260,272,127.946,37.342],
   [207,347,127.12472,36.45556],[214,394,127.14889,35.82194],
   [268,348,128.16,36.41],[338,402,129.21167,35.84278],[177,466,126.716,35.016]],
  'north':[[104,174],[117,161],[137,163],[154,157],[164,144],[184,142],[194,147],[200,163],[205,151],[224,139]],
  'south':[[162,373],[178,370],[192,366],[207,353],[226,353],[238,345],[253,347],
   [247,366],[266,370],[286,350],[309,338],[316,316],[331,307],[345,307]],
  'divide':[[249,350],[259,374],[243,393],[239,415],[233,433],[238,448],[238,461],[237,477]],
  'naju':[[163,445],[183,448],[198,446],[213,452],[211,466],[200,478],[183,486],[165,481],[155,467]]},
 'goryeo': {
  'image':'https://contents.history.go.kr/data/img/ta/ta_m61/ta_m61_1170_01.jpg',
  'controls':[[175,238,126.55444,37.97083],[124,149,125.75432,39.03385],
   [125,224,125.72,38.039],[190,253,126.9784,37.566],[247,269,127.946,37.342],
   [179,345,127.12472,36.45556],[205,396,127.14889,35.82194],
   [341,389,129.21167,35.84278],[224,93,127.65,39.78],[39,67,124.38,40.1]],
  'north':[[27,87],[41,69],[68,57],[101,45],[126,39],[146,45],[164,44],[178,60],[194,76],[225,94]]},
}


def merc(lat):
    return math.log(math.tan(math.pi/4+math.radians(lat)/2))


def trace(key, line):
    item = TRACES[key]
    c = np.array(item['controls'])
    target = np.array([[math.radians(x),merc(y)] for x,y in c[:,2:]])
    fit = np.linalg.lstsq(np.column_stack([np.ones(len(c)),c[:,:2]]),target,rcond=None)[0]
    points = np.column_stack([np.ones(len(item[line])),item[line]]) @ fit
    return [(math.degrees(x),math.degrees(2*math.atan(math.exp(y))-math.pi/2)) for x,y in points]


def smooth(points):
    # Round the hand-digitized pixel turns without shifting their large-scale course.
    for _ in range(2):
        output = [points[0]]
        for a,b in zip(points,points[1:]):
            output += [(a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25),
                       (a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75)]
        points = output+[points[-1]]
    return points


def poly(points):
    return make_valid(Polygon(points))


def below(line):
    return poly([(95,20),(148,20),(148,line[-1][1]),*reversed(line),(95,line[0][1])])


def pieces(g):
    if g.geom_type == 'Polygon': return [g]
    return [p for child in getattr(g,'geoms',[]) for p in pieces(child)]


def build(countries_path):
    countries = {f['properties']['ADM0_A3']:make_valid(shape(f['geometry']))
                 for f in json.loads(Path(countries_path).read_text(encoding='utf-8'))['features']}
    domain = box(98,24,145,54)
    land = unary_union([countries[k] for k in ['CHN','PRK','KOR','RUS','MNG']]).intersection(domain)
    # Exclude offshore islands from continental kingdoms (e.g. Sakhalin).
    mainland = max(pieces(land),key=lambda p:p.area)
    korea = unary_union([countries['KOR'],countries['PRK']])
    japan = countries['JPN'].intersection(domain)
    china = countries['CHN'].intersection(domain)
    russia = countries['RUS'].intersection(domain)
    def region(name,geometry,color='korea',pattern=False,xy=None):
        return dict(name=name,geometry=geometry,color=COLORS.get(color,color),pattern=pattern,xy=xy)

    silla_line = smooth(trace('balhae','south'))
    silla = korea.intersection(below(silla_line))
    balhae_line = smooth(trace('balhae','westNorth'))
    balhae = mainland.intersection(poly([*balhae_line,(145,54),(145,39),
                                        *reversed(silla_line),(123.4,39.3)]))
    # Empty space beyond the documented kingdoms is labelled tribal territory,
    # never silently assigned to Tang using present-day China's boundary.
    tang = mainland.intersection(below([(112,41),(117,41.5),(120,42.2),(123,43)]))
    tang = tang.difference(balhae).difference(korea)
    tribes = mainland.difference(balhae).difference(tang).difference(silla)
    # Do not inherit modern Hokkaido as ninth-century Japanese territory.
    # Honshu/Kyushu/Shikoku context, with the unresolved northern frontier
    # omitted rather than drawn as a fictitious horizontal latitude line.
    japan9 = unary_union([p for p in pieces(japan) if p.centroid.y < 41.8])
    balhae_regions = [region('발해',balhae,'north',xy=[128,45.6]),
      region('통일 신라',silla,xy=[127.5,36.6]),region('당',tang,'china',xy=[120.8,39.7]),
      region('일본',japan9,'japan',xy=[138.3,36.7]),region('거란·말갈 등',tribes,'tribes',xy=[124.6,46.8])]

    later_north = smooth(trace('later','north'))
    later_south = smooth(trace('later','south'))
    later_divide = smooth(trace('later','divide'))
    southern = korea.intersection(below(later_north))
    naju = korea.intersection(poly(trace('later','naju')))
    goryeo918 = southern.difference(below(later_south)).union(naju)
    # The Baekje/Silla common edge is used by both polygons (no gap or overlap).
    west_of_divide = poly([(120,32),(120,40),later_divide[0],*later_divide,(130,32)])
    bae918 = southern.intersection(below(later_south)).intersection(west_of_divide).difference(naju)
    sil918 = southern.difference(goryeo918).difference(bae918)

    north_line = smooth(trace('six','north'))
    goryeo = korea.intersection(below(north_line))
    six = goryeo.intersection(poly(smooth(trace('six','six')+[trace('six','six')[0]])))
    before993 = goryeo.difference(six)
    # The source has no precise Liao/Jurchen internal frontier. Never invent
    # a meridian border through Manchuria: use neutral context and two labels.
    northern_context = mainland.difference(goryeo)
    # Cheollyeong was the southern limit of Ssangseong's direct administration.
    ssang = goryeo.intersection(poly([(127,38.95),(127.22,39.25),(127.08,39.7),
                                     (127.08,40.4),(131,40.4),(131,38.95)]))
    dongnyeong = goryeo.intersection(poly([(122,38.62),(125.45,38.62),(126.35,38.85),
                                         (126.7,39.25),(126.7,43),(122,43)]))
    jeju = korea.intersection(box(125.9,32.8,127,33.7))
    # Late Goryeo's reach to the middle Yalu and Gilju, BEFORE Joseon's 4/6.
    late_line = smooth([(124.25,40.08),(125.4,40.7),(126.55,41.04),
                        (127.4,40.85),(128.3,41.15),(128.75,41.1),(129.5,40.98)])
    late_goryeo = korea.intersection(below(late_line))
    joseon = korea

    boundary_data = json.loads((ROOT/'history/boundaries.json').read_text(encoding='utf-8'))
    def ancient(scene_id):
        return [region(a['name'],poly(a['ring']).intersection(land),
                       ['#86b7cf','#e7b579','#a4c77c','#c2add3'][a['color']],bool(a.get('pattern')))
                for a in boundary_data['scenes'][scene_id]['areas']]
    fifth = ancient('goguryeo-fifth')
    sixth = ancient('silla-sixth')
    occupied = unary_union([a['geometry'] for a in sixth])
    sixth.insert(0,region('고구려',fifth[0]['geometry'].difference(occupied),'north'))
    # The northern temporary advance is not retained as Silla's 660 territory.
    sixth_stable = []
    temporary = unary_union([a['geometry'] for a in sixth if a['pattern']])
    for a in sixth:
        if a['pattern']: continue
        copy = dict(a)
        if a['name']=='신라': copy['geometry']=a['geometry'].difference(temporary)
        if a['name']=='고구려': copy['geometry']=a['geometry'].union(temporary)
        sixth_stable.append(copy)

    data = json.loads((ROOT/'data/history-data.js').read_text(encoding='utf-8').split('window.KOREA_HISTORY = ')[1].strip().removesuffix(';'))
    scenes = {s['id']:s for s in data['scenes']}
    states = {key:[] for key in scenes}
    def add(key,date,regions,sources=(),note='',state_id=None,lines=()):
        states[key].append(dict(id=state_id or str(len(states[key])),date=date,regions=regions,
          sources=[SOURCE[s] for s in sources],note=note,lines=list(lines)))

    # Early polities are approximate spheres, NOT precisely delimited borders.
    early = [
      ('부여',[(124.8,44.3),(125.5,45.5),(127.4,46),(129,45.1),(128.3,43.4),(126.9,43),(125.2,43.5)],'north'),
      ('고구려',[(124.5,40.7),(124.8,42),(125.7,43.05),(127.4,42.8),(128,41.7),(126.9,40.5),(125.5,40.2)],'china'),
      ('옥저',[(127.7,39.9),(127.4,40.5),(128.1,41.7),(129.3,42.1),(131,42.2),(130.7,40),(128.5,39.7)],'gaya'),
      ('동예',[(127.3,37.7),(127.35,38.7),(127.5,39.8),(129.1,39.8),(130,38.4),(129.5,37.7)],'tribes'),
      ('마한',[(125.3,34),(125.3,37.5),(126.6,38),(127.3,37.7),(127.7,36.5),(127.6,35.6),(127.6,34)],'baekje'),
      ('진한',[(127.75,35.9),(127.7,36.7),(128.2,37.3),(130,37.4),(130,35.65),(128.7,35.75)],'korea'),
      ('변한',[(127.6,34),(127.6,35.6),(128.2,35.9),(128.7,35.75),(130,35.65),(130,34)],'japan')]
    add('early-states','삼국 성립 전 · 대략적인 세력권',
        [region(n,poly(smooth(p+[p[0]])).intersection(land),c,True) for n,p,c in early],
        note='여러 나라가 성장한 대표 권역입니다. 점선은 확정된 국경선이 아니며, 각 나라의 최대 영역이 같은 시점에 존재했다는 뜻도 아닙니다.')
    for key in ['baekje-fourth','goguryeo-fifth']:
        add(key,scenes[key]['period'],ancient(key),note='교과서 도판에서 재구성한 개략 영역선입니다.')
    add('silla-sixth','6세기 후반 · 진흥왕의 진출',sixth,
        note='신라 북방의 빗금은 진출 후 상실한 권역이며, 전 기간의 고정 국경이 아닙니다.')
    add('baekje-capitals','475년 이후 · 웅진 시기',fifth,state_id='475',note='5세기 후반의 영역을 배경으로 천도 경로를 표시했습니다.')
    add('baekje-capitals','6세기 후반 · 사비 시기',sixth,state_id='562',note='한강 유역을 신라에 잃은 뒤의 개략 영역입니다. 화살표의 천도 사건은 475·538년입니다.')
    add('unification','660년 · 백제 멸망 직전',sixth_stable,state_id='660',note='삼국의 개략 영역입니다. 화살표와 지점은 660~676년의 사건을 함께 표시합니다.')
    add('unification','676년 이후 · 통일 신라',[
        region('통일 신라',silla),region('당의 지배·고구려 유민',mainland.difference(silla),'china')],
        ['silla'],state_id='676',note='통일 이후의 대동강~원산만 경계로 요약한 교과서식 영역입니다. 북방 지배는 변동했으며 당은 735년에 신라의 대동강 이남 영유를 인정했습니다.')
    add('balhae','9세기 · 발해 전성기',balhae_regions,['balhae','silla','namgyung'],
        '5경과 교역로를 전성기 영역 위에 표시했습니다. 북방·서방 경계와 주변 부족의 범위는 개략적입니다. 남경은 북청 일대 추정지입니다. 일본은 혼슈·시코쿠·규슈 중심의 비교용 영역이며 북방 경계의 정밀 복원이 아닙니다.')
    add('silla-trade','9세기 · 청해진 무역',balhae_regions,['balhae','silla'],
        '당·신라·일본은 교역 상대국이며 화살표는 교역로입니다.')
    add('later-three','918년 이후 · 후삼국',[
        region('고려',goryeo918,'north',xy=[127.5,37.8]),region('후백제',bae918,'baekje',xy=[127.2,35.7]),
        region('신라',sil918,xy=[129,35.8]),region('발해',korea.difference(southern).union(balhae),'tribes')],
        ['later'],note='후고구려·태봉을 이은 고려의 영역을 기준으로 구분했습니다. 서남쪽 나주 일대의 고려 거점을 포함한 개략도입니다.')
    goryeo_context = [region('요·여진 세력권',northern_context,'tribes')]
    add('gangdong','993년 담판 전', [region('고려',before993),*goryeo_context,
        region('여진 활동 지역',six,'tribes')],['goryeo'],state_id='before')
    add('gangdong','993년 이후 · 강동 6주 확보',[region('고려',goryeo),*goryeo_context,
        region('강동 6주',six,'korea',True)],['goryeo','atlas'],state_id='after',note='서희의 담판 뒤 단계적으로 확보한 강동 6주입니다. 고려 북방은 교과서 도판의 개략선이며 요와 여진 사이의 내부 경계는 생략했습니다.')
    add('gwiju','11세기 초 · 고려와 거란',[region('고려',goryeo),*goryeo_context],['goryeo'])
    add('nine-forts','1107~1109년 · 동북 9성',[region('고려',goryeo),*goryeo_context],['goryeo'],
        '동북 9성의 정확한 범위에는 견해 차이가 있어 확정 영토로 채색하지 않았습니다. 지도 지점은 대표 권역이며 1109년에 반환했습니다. 금 건국은 1115년입니다.')
    add('sambyeolcho','1270~1272년 · 삼별초 항쟁',[
        region('고려',goryeo.difference(ssang).difference(dongnyeong)),
        region('원 직할지',mainland.difference(goryeo).union(ssang).union(dongnyeong),'china')],
        ['yuan'],state_id='1270',note='동녕부·쌍성총관부는 원의 직접 지배 구역입니다. 삼별초 이동 경로가 별도 국가의 영토를 뜻하지는 않습니다.')
    add('sambyeolcho','1273년 · 제주 항쟁 진압 뒤',[
        region('고려',goryeo.difference(ssang).difference(dongnyeong).difference(jeju)),
        region('원 직할지',mainland.difference(goryeo).union(ssang).union(dongnyeong).union(jeju),'china')],
        ['yuan'],state_id='1273',note='항쟁 진압 뒤 제주에 설치된 원의 탐라총관부를 구별했습니다.')
    add('ssangseong','1356년 수복 전',[region('고려',goryeo.difference(ssang)),
        region('원',mainland.difference(goryeo).union(ssang),'china')],['gongmin'],state_id='before')
    add('ssangseong','1356년 · 쌍성총관부 수복',[region('고려',goryeo),
        region('원',mainland.difference(goryeo),'china'),region('수복 지역',ssang,'korea',True)],
        ['gongmin'],state_id='after',note='철령 이북 쌍성총관부 수복을 표시했습니다. 이후 길주 방면의 고려 말 확장은 1356년 한 번의 수복과 구분합니다.')
    add('four-six','개척 전 · 고려 말~조선 초',[region('조선',late_goryeo),
        region('명·여진 세력권',mainland.difference(late_goryeo),'tribes')],
        ['joseon','gongmin'],state_id='before')
    add('four-six','세종 대 · 4군 6진 개척 뒤',[region('조선',joseon),
        region('명·여진 세력권',mainland.difference(korea),'tribes'),
        region('북방 개척',korea.difference(late_goryeo),'korea',True)],['joseon'],state_id='after',
        note='압록강·두만강 방면으로 넓어진 영역을 구별했습니다. 현대 해안·하천 자료를 바탕으로 한 개략도이며 백두산 일대의 현대 국경을 15세기 경계로 확정하는 뜻은 아닙니다.')

    def modern(kname='조선',cname='청',rname='러시아',colonial=False):
        return [region(kname,korea,'korea',colonial),region(cname,china,'china'),
                region('일본',japan,'japan'),region(rname,russia,'russia')]
    add('imjin','1592년 · 전쟁 전 국가 영역',[
        region('조선',joseon),region('명',china,'china'),region('일본',japan,'japan')],['joseon'],
        '색은 국가 영역, 화살표는 일본군 진격과 전쟁 사건입니다. 점령지나 시기별 전선의 변화와는 구분합니다.')
    add('foreign-incursions','1866~1875년',modern(),note='국가 영역을 기준으로 표시했습니다. 공격 지점은 외국에 양도된 영토가 아닙니다.')
    add('ports','1876~1883년',modern(),note='개항장을 표시한 것으로, 개항이 해당 도시 전체의 영토 양도를 뜻하지는 않습니다.')
    add('donghak','1894년 · 조선',modern(),note='조선의 영역 위에 봉기·전투 지점을 표시했습니다.')
    leased = china.intersection(poly([(120.9,38.6),(121.2,39.55),(121.8,39.65),(122.25,39.2),(122.4,38.6)]))
    add('an-jung-geun','1909~1910년 3월 · 병합 이전',[
        region('대한제국',korea),region('청',china.difference(leased),'china'),
        region('관동주 · 일본 조차지',leased,'japan',True),region('러시아 제국',russia,'russia'),
        region('일본',japan,'japan')],note='뤼순·다롄의 관동주 조차지는 일본 지배 구역으로 따로 표시했습니다. 하얼빈을 포함한 만주 전체가 일본 영토였던 것은 아닙니다.')
    add('independence-bases','1912~1917년 초 · 독립운동 기지',modern('조선 · 일제강점기','중화민국','러시아 제국',True),
        note='기지 형성기의 국가·식민지 구분입니다. 러시아 혁명 전 연해주를 기준으로 하며 독립군 기지는 독립된 국가 영토가 아닙니다.')
    add('provisional-government','1919년 · 상하이',modern('조선 · 일제강점기','중화민국','러시아 내전기',True),
        note='상하이는 중국 영토이며 조계와 임시 정부 청사의 위치가 한국의 지배 영토를 뜻하지 않습니다.')
    add('bongo-cheongsan','1920년 · 간도',modern('조선 · 일제강점기','중화민국','러시아 내전기',True),
        note='간도의 전투 지역은 중국 영토입니다. 일본군의 월경 공격과 국가 경계를 구분합니다. 소련 성립 전입니다.')
    # Great Wall / Rehe side lies west of the Manchurian battle-map viewport.
    manchu = china.intersection(poly([(119.8,39.9),(118.7,40.5),(117.3,40.7),(116.2,41.4),
                                     (116.7,43),(119,45),(117.5,48),(119,54),(136,54),(136,39.9)]))
    def colonial1930():
        return [region('중화민국',china.difference(manchu),'china'),
          region('만주국 · 일본 괴뢰국',manchu,'#b7bb91'),
          region('조선 · 일제강점기',korea,'korea',True),region('일본',japan,'japan'),
          region('소련',russia,'russia')]
    add('patriotic-corps','1932년 · 의거 당시',modern('조선 · 일제강점기','중화민국','소련',True),
        note='상하이·도쿄의 국가 영역을 구별했습니다. 의거 지점이 한국의 영토를 의미하지는 않습니다.')
    add('allied-operations','1933년 · 만주국 성립 뒤',colonial1930(),['manchu'],
        '만주국은 일본이 세운 괴뢰국입니다. 중국의 주권과 별개로 당시 일본의 만주 지배 구역을 구분한 개략도입니다.')
    for key,date in [('korean-volunteer-corps','1938년 10월 · 조선 의용대 창설'),('liberation-army','1940년 · 한국 광복군 창설')]:
        add(key,date,colonial1930(),['manchu'],
            '중화민국의 국가 영역을 바탕으로 창설 장소를 표시했습니다. 중국 내부의 일본군 점령지·전선은 이 영역색에 포함하지 않았습니다.')
    south1950 = korea.intersection(box(120,20,140,38))
    add('korean-war','1950년 6월 · 전쟁 발발 전',[
        region('대한민국',south1950),region('북한',korea.difference(south1950),'north'),
        region('중국',china,'china'),region('일본',japan,'japan')],['war'],state_id='1950',
        note='38선 기준의 전쟁 직전 남북 구분입니다. 화살표는 전쟁 중 이동이며 이 색이 전쟁 내내 유지된 전선을 뜻하지 않습니다.',
        lines=[{'label':'38선','coords':[[124.6,38],[128.7,38]],'kind':'division'}])
    borders = json.loads((ROOT/'data/borders.js').read_text(encoding='utf-8').split('window.KOREA_BORDERS = ')[1].strip().removesuffix(';'))
    mdl = [[lon,lat] for lat,lon in reversed(borders['mdl'][0])]
    add('korean-war','1953년 7월 · 정전 이후',[
        region('대한민국',countries['KOR']),region('북한',countries['PRK'],'north'),
        region('중국',china,'china'),region('일본',japan,'japan')],['war'],state_id='1953',
        note='정전 뒤 남북의 육상 지배 구역입니다. 붉은 점선은 군사분계선이며 국제 국경선이나 해상 경계선을 뜻하지 않습니다.',
        lines=[{'label':'군사분계선','coords':mdl,'kind':'armistice'}])

    for key in ['gangdong','gwiju','nine-forts','four-six']:
        for state in states[key]:
            state['extraLabels']=[{'name':'명' if key=='four-six' else '요(거란)','xy':[124.5,42]},
                                  {'name':'여진','xy':[129,42.6]}]
            state['sources'].append(SOURCE['atlas'] if key!='four-six' else SOURCE['joseon'])
    OUT.mkdir(parents=True,exist_ok=True)
    manifest = {'version':1,'scenes':{}}
    audit = {'traces':TRACES,'coverage':{}}
    for key,variants in states.items():
        scene = scenes[key]
        assert variants, key
        w,s,e,n = scene['bounds']
        # Full backdrops extend well beyond fit bounds for wide and tall screens.
        extent = [max(98,w-4),max(24,s-4),min(145,e+4),min(54,n+4)]
        # Three original textbook geometries have their own complete extent.
        view = box(*extent)
        visible = box(w,s,e,n)
        width=1600
        factor=width/math.radians(extent[2]-extent[0])
        top=merc(extent[3])
        height=(top-merc(extent[1]))*factor
        def ring_path(ring):
            return 'M'+'L'.join(f'{math.radians(x-extent[0])*factor:.2f},{(top-merc(y))*factor:.2f}' for x,y in ring.coords)+'Z'
        def geo_path(g):
            return ''.join(ring_path(p.exterior)+''.join(ring_path(r) for r in p.interiors) for p in pieces(g))
        manifest['scenes'][key]=[]
        audit['coverage'][key]=[]
        for state in variants:
            svg_paths=[]
            legends=[]
            labels=[]
            defs=[]
            geometry_audit=[]
            for index,r in enumerate(state['regions']):
                geometry = make_valid(r['geometry']).intersection(view)
                if geometry.is_empty: continue
                geometry=geometry.simplify(.003,preserve_topology=True)
                color=r['color']
                fill=color
                if r['pattern']:
                    pid=f'hatch-{index}'
                    defs.append(f'<pattern id="{pid}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="9" height="9" fill="{color}"/><path d="M0 0V9" stroke="#546749" stroke-opacity=".45" stroke-width="2"/></pattern>')
                    fill=f'url(#{pid})'
                d=geo_path(geometry)
                svg_paths.append(f'<path d="{d}" fill="{fill}" fill-opacity=".68" fill-rule="evenodd" stroke="#5c6957" stroke-opacity=".75" stroke-width="1.15" stroke-linejoin="round" stroke-dasharray="4 2" vector-effect="non-scaling-stroke"><title>{escape(r["name"])}</title></path>')
                in_view=geometry.intersection(visible)
                if not in_view.is_empty and in_view.area > .008:
                    legends.append({'label':r['name'],'color':color,'pattern':'hatch' if r['pattern'] else None})
                    point=Point(r['xy']) if r['xy'] else None
                    if point is None or not in_view.covers(point):
                        point=max(pieces(in_view),key=lambda p:p.area).representative_point()
                    # Highlight overlays use the base country's label, not a
                    # second crowded large label over the same territory.
                    if '세력권' not in r['name'] and (not r['pattern'] or key in ['early-states','bongo-cheongsan','independence-bases','provisional-government','patriotic-corps','allied-operations']):
                        labels.append({'name':r['name'],'xy':[round(point.x,5),round(point.y,5)]})
                geometry_audit.append({'name':r['name'],'area':round(geometry.area,4),'visibleArea':round(in_view.area,4)})
            source=state['sources'][:]
            if scene.get('mapSource'):source.append(scene['mapSource'])
            if not source:source.append(['역사 내용 근거',scene['source']])
            filename=f'{key}-{state["id"]}.svg'
            svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height:.2f}" width="{width}" height="{height:.2f}"><title>{escape(state["date"])}</title><metadata>Textbook-based schematic historical territories. Coastline: Natural Earth public domain. {escape(json.dumps(source,ensure_ascii=False))}</metadata><defs>{"".join(defs)}</defs>{"".join(svg_paths)}</svg>\n'
            (OUT/filename).write_text(svg,encoding='utf-8')
            labels.extend(state.get('extraLabels',[]))
            manifest['scenes'][key].append({'id':state['id'],'date':state['date'],
              'overlay':f'history/territories/{filename}?v=20260921-4','overlayBounds':extent,
              'legend':legends,'labels':labels,'sources':source,'note':state['note'],'lines':state['lines']})
            audit['coverage'][key].append({'date':state['date'],'regions':geometry_audit})
    (ROOT/'data/history-territories.js').write_text('// Generated by tools/build_history_territories.py.\nwindow.KOREA_HISTORY_TERRITORIES = '+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    (OUT/'provenance.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(states)} scenes, {sum(map(len,states.values()))} dated territory overlays')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--countries',required=True)
    build(parser.parse_args().countries)
