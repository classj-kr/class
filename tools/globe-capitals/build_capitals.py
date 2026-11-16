# 지구본 수도 자료(learning/inquiry/globe/data/capitals.json)를 만든다.
# 나라 이름은 data/shapes.json 의 "country:이름" 과 같아야 한다(지도 칠하기·누르기에 쓴다).
# 좌표 확인: check_capitals.py (OpenStreetMap 검색 결과와 거리·한국어 이름 대조, 나라 모양 안에 드는지).
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "learning/inquiry/globe/data/capitals.json"

CONTINENTS = [("asia", "아시아"), ("europe", "유럽"), ("africa", "아프리카"), ("americas", "아메리카"), ("oceania", "오세아니아")]

# (iso, 나라, 대륙, 수도, 위도, 경도, 가장 큰 도시(수도와 다르고 헷갈리기 쉬울 때), 덧말)
C = [
 ("KR","대한민국","asia","서울",37.566,126.978,None,None),
 ("KP","북한","asia","평양",39.039,125.762,None,None),
 ("CN","중국","asia","베이징",39.904,116.407,"상하이",None),
 ("JP","일본","asia","도쿄",35.690,139.692,None,None),
 ("MN","몽골","asia","울란바토르",47.886,106.906,None,None),
 ("VN","베트남","asia","하노이",21.028,105.854,"호찌민",None),
 ("TH","태국","asia","방콕",13.756,100.502,None,None),
 ("KH","캄보디아","asia","프놈펜",11.556,104.928,None,None),
 ("LA","라오스","asia","비엔티안",17.975,102.633,None,None),
 ("MM","미얀마","asia","네피도",19.763,96.079,"양곤","2006년에 양곤에서 네피도로 수도를 옮겼다."),
 ("MY","말레이시아","asia","쿠알라룸푸르",3.139,101.687,None,None),
 ("SG","싱가포르","asia","싱가포르",1.290,103.852,None,"나라 전체가 하나의 도시인 도시 국가다."),
 ("ID","인도네시아","asia","자카르타",-6.208,106.846,None,"칼리만탄섬에 새 수도 누산타라를 짓고 있다."),
 ("PH","필리핀","asia","마닐라",14.599,120.984,None,None),
 ("IN","인도","asia","뉴델리",28.614,77.209,"뭄바이",None),
 ("PK","파키스탄","asia","이슬라마바드",33.684,73.048,"카라치","카라치에서 새로 지은 이슬라마바드로 수도를 옮겼다."),
 ("BD","방글라데시","asia","다카",23.810,90.413,None,None),
 ("LK","스리랑카","asia","스리자야와르데네푸라코테",6.890,79.918,None,None),
 ("NP","네팔","asia","카트만두",27.717,85.324,None,None),
 ("AF","아프가니스탄","asia","카불",34.555,69.207,None,None),
 ("IR","이란","asia","테헤란",35.689,51.389,None,None),
 ("IQ","이라크","asia","바그다드",33.315,44.366,None,None),
 ("SA","사우디아라비아","asia","리야드",24.714,46.675,None,None),
 ("AE","아랍에미리트","asia","아부다비",24.454,54.377,"두바이",None),
 ("QA","카타르","asia","도하",25.285,51.531,None,None),
 ("KW","쿠웨이트","asia","쿠웨이트",29.376,47.977,None,"나라 이름과 수도 이름이 같다."),
 ("OM","오만","asia","무스카트",23.588,58.383,None,None),
 ("JO","요르단","asia","암만",31.954,35.911,None,None),
 ("SY","시리아","asia","다마스쿠스",33.514,36.277,None,None),
 ("TR","튀르키예","asia","앙카라",39.934,32.860,"이스탄불",None),
 ("KZ","카자흐스탄","asia","아스타나",51.169,71.449,"알마티","1997년에 알마티에서 아스타나로 수도를 옮겼다."),
 ("UZ","우즈베키스탄","asia","타슈켄트",41.299,69.240,None,None),
 ("TM","투르크메니스탄","asia","아시가바트",37.960,58.326,None,None),
 ("AZ","아제르바이잔","asia","바쿠",40.409,49.867,None,None),
 ("GB","영국","europe","런던",51.507,-0.128,None,None),
 ("IE","아일랜드","europe","더블린",53.350,-6.260,None,None),
 ("FR","프랑스","europe","파리",48.857,2.352,None,None),
 ("DE","독일","europe","베를린",52.520,13.405,None,None),
 ("NL","네덜란드","europe","암스테르담",52.368,4.904,None,None),
 ("BE","벨기에","europe","브뤼셀",50.850,4.352,None,None),
 ("CH","스위스","europe","베른",46.948,7.447,"취리히",None),
 ("AT","오스트리아","europe","빈",48.208,16.374,None,None),
 ("IT","이탈리아","europe","로마",41.903,12.496,None,None),
 ("ES","스페인","europe","마드리드",40.417,-3.704,None,None),
 ("PT","포르투갈","europe","리스본",38.722,-9.139,None,None),
 ("GR","그리스","europe","아테네",37.984,23.728,None,None),
 ("NO","노르웨이","europe","오슬로",59.914,10.752,None,None),
 ("SE","스웨덴","europe","스톡홀름",59.329,18.069,None,None),
 ("FI","핀란드","europe","헬싱키",60.170,24.938,None,None),
 ("DK","덴마크","europe","코펜하겐",55.676,12.568,None,None),
 ("IS","아이슬란드","europe","레이캬비크",64.147,-21.942,None,None),
 ("PL","폴란드","europe","바르샤바",52.230,21.012,None,None),
 ("CZ","체코","europe","프라하",50.076,14.438,None,None),
 ("HU","헝가리","europe","부다페스트",47.498,19.040,None,None),
 ("RO","루마니아","europe","부쿠레슈티",44.427,26.103,None,None),
 ("UA","우크라이나","europe","키이우",50.450,30.524,None,None),
 ("RU","러시아","europe","모스크바",55.756,37.617,None,None),
 ("EG","이집트","africa","카이로",30.044,31.236,None,None),
 ("LY","리비아","africa","트리폴리",32.887,13.191,None,None),
 ("DZ","알제리","africa","알제",36.754,3.059,None,None),
 ("MA","모로코","africa","라바트",34.021,-6.841,"카사블랑카",None),
 ("TN","튀니지","africa","튀니스",36.806,10.181,None,None),
 ("SD","수단","africa","하르툼",15.501,32.560,None,None),
 ("SS","남수단","africa","주바",4.859,31.571,None,None),
 ("ET","에티오피아","africa","아디스아바바",9.030,38.740,None,None),
 ("KE","케냐","africa","나이로비",-1.292,36.822,None,None),
 ("TZ","탄자니아","africa","도도마",-6.163,35.752,None,None),
 ("NG","나이지리아","africa","아부자",9.077,7.399,"라고스","1991년에 라고스에서 아부자로 수도를 옮겼다."),
 ("GH","가나","africa","아크라",5.604,-0.187,None,None),
 ("CI","코트디부아르","africa","야무수크로",6.827,-5.289,None,None),
 ("SN","세네갈","africa","다카르",14.716,-17.467,None,None),
 ("ML","말리","africa","바마코",12.639,-8.003,None,None),
 ("NE","니제르","africa","니아메",13.512,2.113,None,None),
 ("TD","차드","africa","은자메나",12.134,15.056,None,None),
 ("CD","콩고민주공화국","africa","킨샤사",-4.441,15.266,None,None),
 ("AO","앙골라","africa","루안다",-8.839,13.289,None,None),
 ("ZM","잠비아","africa","루사카",-15.387,28.323,None,None),
 ("ZW","짐바브웨","africa","하라레",-17.825,31.034,None,None),
 ("MZ","모잠비크","africa","마푸투",-25.969,32.573,None,None),
 ("ZA","남아프리카공화국","africa","프리토리아",-25.747,28.229,"요하네스버그",None),
 ("BW","보츠와나","africa","가보로네",-24.628,25.923,None,None),
 ("MG","마다가스카르","africa","안타나나리보",-18.879,47.508,None,None),
 ("US","미국","americas","워싱턴 D.C.",38.907,-77.037,"뉴욕",None),
 ("CA","캐나다","americas","오타와",45.421,-75.697,"토론토",None),
 ("MX","멕시코","americas","멕시코시티",19.433,-99.133,None,None),
 ("CU","쿠바","americas","아바나",23.113,-82.366,None,None),
 ("PA","파나마","americas","파나마시티",8.983,-79.520,None,None),
 ("VE","베네수엘라","americas","카라카스",10.481,-66.904,None,None),
 ("CO","콜롬비아","americas","보고타",4.711,-74.072,None,None),
 ("EC","에콰도르","americas","키토",-0.180,-78.468,"과야킬",None),
 ("PE","페루","americas","리마",-12.046,-77.043,None,None),
 ("BO","볼리비아","americas","수크레",-19.036,-65.259,None,None),
 ("BR","브라질","americas","브라질리아",-15.794,-47.882,"상파울루","1960년에 리우데자네이루에서 새로 지은 브라질리아로 수도를 옮겼다."),
 ("CL","칠레","americas","산티아고",-33.449,-70.669,None,None),
 ("AR","아르헨티나","americas","부에노스아이레스",-34.604,-58.382,None,None),
 ("PY","파라과이","americas","아순시온",-25.264,-57.576,None,None),
 ("UY","우루과이","americas","몬테비데오",-34.901,-56.165,None,None),
 ("AU","오스트레일리아","oceania","캔버라",-35.281,149.130,"시드니","시드니와 멜버른 사이에 새로 지은 계획 도시다."),
 ("NZ","뉴질랜드","oceania","웰링턴",-41.287,174.776,"오클랜드",None),
 ("PG","파푸아뉴기니","oceania","포트모르즈비",-9.443,147.180,None,None),
 ("FJ","피지","oceania","수바",-18.124,178.450,None,None),
]

# 수도가 둘 이상인 나라: 정답으로 묻는 것은 capital 하나, 나머지는 others 에 적고 문제의 오답 보기로 쓰지 않는다.
OTHERS = {
 "BO": ([("라파스", "정부가 있는 행정 수도", -16.490, -68.119)], "헌법에 적힌 수도는 수크레이고, 정부와 의회는 라파스에 있다."),
 "ZA": ([("케이프타운", "의회가 있는 입법 수도", -33.925, 18.424), ("블룸폰테인", "대법원이 있는 사법 수도", -29.085, 26.159)], "정부는 프리토리아, 의회는 케이프타운, 대법원은 블룸폰테인에 있어 수도가 셋이다."),
 "NL": ([("헤이그", "정부와 의회가 있는 도시", 52.070, 4.300)], "헌법에 적힌 수도는 암스테르담이고, 정부와 의회는 헤이그에 있다."),
 "MY": ([("푸트라자야", "정부 기관이 옮겨 간 행정 도시", 2.926, 101.696)], "수도는 쿠알라룸푸르이고, 정부 기관 대부분은 가까운 푸트라자야로 옮겨 갔다."),
 "LK": ([("콜롬보", "가장 큰 도시이자 옛 수도", 6.927, 79.862)], "수도는 의회가 있는 스리자야와르데네푸라코테이고, 가장 큰 도시는 바로 옆의 콜롬보다."),
 "CI": ([("아비장", "가장 큰 도시이자 옛 수도", 5.360, -4.008)], "공식 수도는 야무수크로이고, 정부 기관 대부분과 경제 중심은 아비장에 있다."),
 "TZ": ([("다르에스살람", "가장 큰 항구 도시이자 옛 수도", -6.792, 39.208)], "수도는 도도마이고, 옛 수도 다르에스살람이 가장 큰 도시다."),
}

# 나라 영어 이름: 영어 교과서·공항·뉴스에서 흔히 보는 꼴로 적는다(Korea, USA, UK).
COUNTRY_EN = {
 "KR":"Korea","KP":"North Korea","CN":"China","JP":"Japan","MN":"Mongolia","VN":"Vietnam","TH":"Thailand","KH":"Cambodia",
 "LA":"Laos","MM":"Myanmar","MY":"Malaysia","SG":"Singapore","ID":"Indonesia","PH":"the Philippines","IN":"India","PK":"Pakistan",
 "BD":"Bangladesh","LK":"Sri Lanka","NP":"Nepal","AF":"Afghanistan","IR":"Iran","IQ":"Iraq","SA":"Saudi Arabia","AE":"UAE",
 "QA":"Qatar","KW":"Kuwait","OM":"Oman","JO":"Jordan","SY":"Syria","TR":"Türkiye","KZ":"Kazakhstan","UZ":"Uzbekistan",
 "TM":"Turkmenistan","AZ":"Azerbaijan",
 "GB":"UK","IE":"Ireland","FR":"France","DE":"Germany","NL":"the Netherlands","BE":"Belgium","CH":"Switzerland","AT":"Austria",
 "IT":"Italy","ES":"Spain","PT":"Portugal","GR":"Greece","NO":"Norway","SE":"Sweden","FI":"Finland","DK":"Denmark",
 "IS":"Iceland","PL":"Poland","CZ":"Czech Republic","HU":"Hungary","RO":"Romania","UA":"Ukraine","RU":"Russia",
 "EG":"Egypt","LY":"Libya","DZ":"Algeria","MA":"Morocco","TN":"Tunisia","SD":"Sudan","SS":"South Sudan","ET":"Ethiopia",
 "KE":"Kenya","TZ":"Tanzania","NG":"Nigeria","GH":"Ghana","CI":"Côte d'Ivoire","SN":"Senegal","ML":"Mali","NE":"Niger",
 "TD":"Chad","CD":"DR Congo","AO":"Angola","ZM":"Zambia","ZW":"Zimbabwe","MZ":"Mozambique","ZA":"South Africa","BW":"Botswana",
 "MG":"Madagascar",
 "US":"USA","CA":"Canada","MX":"Mexico","CU":"Cuba","PA":"Panama","VE":"Venezuela","CO":"Colombia","EC":"Ecuador",
 "PE":"Peru","BO":"Bolivia","BR":"Brazil","CL":"Chile","AR":"Argentina","PY":"Paraguay","UY":"Uruguay",
 "AU":"Australia","NZ":"New Zealand","PG":"Papua New Guinea","FJ":"Fiji",
}

def build():
    items = []
    for iso, country, cont, cap, lat, lon, big, note in C:
        it = {"iso": iso, "flag": iso.lower(), "country": country, "countryEn": COUNTRY_EN[iso], "continent": cont, "capital": cap, "lat": lat, "lon": lon}
        if iso in OTHERS:
            others, note = OTHERS[iso]
            it["others"] = [{"name": n, "role": r, "lat": a, "lon": b} for n, r, a, b in others]
        if big: it["bigCity"] = big
        if note: it["note"] = note
        items.append(it)
    out = {
        "about": "수능 세계지리에서 다루는 나라의 수도. capital 이 정답 하나, others 는 수도 구실을 나눠 맡은 다른 도시(오답 보기로 쓰지 않음), bigCity 는 수도로 착각하기 쉬운 가장 큰 도시. country 는 globe/data/shapes.json 의 country:이름, countryEn 은 나라 영어 이름, flag 는 data/flags/<flag>.webp 와 같다.",
        "continents": [{"id": i, "name": n} for i, n in CONTINENTS],
        "countries": items,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(len(items), "countries ->", OUT)

if __name__ == "__main__":
    build()
