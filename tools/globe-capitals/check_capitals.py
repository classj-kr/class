# 수도 자료 검사.
#  1) 나라 이름이 shapes.json 에 있고 국기 그림이 있는지
#  2) 수도 좌표가 그 나라 모양 안(또는 아주 가까이)에 드는지
#  3) --osm: OpenStreetMap 검색(Nominatim)의 좌표와 거리, 한국어 이름(name:ko)을 대조(1초에 한 번)
import json, math, pathlib, sys, time, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
G = ROOT / "learning/inquiry/globe/data"
data = json.loads((G / "capitals.json").read_text(encoding="utf-8"))
shapes = json.loads((G / "shapes.json").read_text(encoding="utf-8"))

def inside(pt, ring):
    x, y = pt; c = False
    for i in range(len(ring)):
        x1, y1 = ring[i - 1]; x2, y2 = ring[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c

def polys(g):
    return [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]

def near_km(pt, g):
    best = 1e9
    for p in polys(g):
        for ring in p:
            for x, y in ring: best = min(best, dist(pt[1], pt[0], y, x))
    return best

def dist(a, b, c, d):
    r = math.pi / 180
    return 6371 * math.acos(min(1, math.sin(a*r)*math.sin(c*r) + math.cos(a*r)*math.cos(c*r)*math.cos((b-d)*r)))

bad = 0
for it in data["countries"]:
    key = "country:" + it["country"]
    if key not in shapes: print("no shape", key); bad += 1; continue
    if not (G / "flags" / f"{it['flag']}.webp").exists(): print("no flag", it["flag"]); bad += 1
    for name, lat, lon in [(it["capital"], it["lat"], it["lon"])] + [(o["name"], o["lat"], o["lon"]) for o in it.get("others", [])]:
        pt = (lon, lat)
        ok = any(inside(pt, p[0]) and not any(inside(pt, h) for h in p[1:]) for p in polys(shapes[key]))
        if not ok:
            km = near_km(pt, shapes[key])
            print(f"outside {it['country']} {name}: nearest edge {km:.0f} km"); bad += km > 30
caps = [it["capital"] for it in data["countries"]]
dup = {c for c in caps if caps.count(c) > 1}
if dup: print("dup capital", dup); bad += 1
print(len(data["countries"]), "countries, problems:", bad)

if "--osm" in sys.argv:
    for it in data["countries"]:
        for name, lat, lon in [(it["capital"], it["lat"], it["lon"])] + [(o["name"], o["lat"], o["lon"]) for o in it.get("others", [])]:
            q = urllib.parse.urlencode({"q": name, "countrycodes": it["iso"].lower(), "format": "json", "limit": 1, "namedetails": 1, "accept-language": "ko"})
            req = urllib.request.Request("https://nominatim.openstreetmap.org/search?" + q, headers={"User-Agent": "classroom-atlas-check/1.0"})
            try:
                res = json.loads(urllib.request.urlopen(req, timeout=20).read())
            except Exception as e:
                print("ERR", name, e); time.sleep(1.2); continue
            if not res: print(f"MISS {it['country']} {name}"); time.sleep(1.1); continue
            r = res[0]; nd = r.get("namedetails", {})
            km = dist(lat, lon, float(r["lat"]), float(r["lon"]))
            ko = nd.get("name:ko", "")
            flag = "" if km < 15 and ko.replace(" ", "") == name.replace(" ", "") else "  <--"
            print(f"{it['country']}\t{name}\t{km:.1f}km\tko={ko}\t{r.get('type')}{flag}")
            time.sleep(1.1)
