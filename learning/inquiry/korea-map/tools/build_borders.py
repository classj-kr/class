"""국경선과 휴전선을 data/borders.js 로 뽑는다.

    python tools/build_borders.py

Natural Earth 10m 나라 경계(ne_10m_admin_0_countries.geojson, %TEMP%/globe-natural-earth)에서
북한 둘레 가운데 이웃 나라와 맞닿은 구간만 고른다: 남한과 맞닿은 곳은 휴전선, 중국·러시아와 맞닿은 곳은 국경.
두 나라 경계가 같은 꼭짓점을 나눠 쓰므로 양쪽에 다 있는 점이 이어지는 구간이 곧 맞닿은 선이다.
"""

import json
import pathlib
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = pathlib.Path(tempfile.gettempdir()) / "globe-natural-earth" / "ne_10m_admin_0_countries.geojson"
OUT = ROOT / "data" / "borders.js"


def rings(geometry):
    if geometry["type"] == "Polygon":
        return geometry["coordinates"]
    return [ring for polygon in geometry["coordinates"] for ring in polygon]


def key(point):
    return (round(point[0], 6), round(point[1], 6))


def shared_runs(ring, others):
    """ring 을 돌며 others 에도 있는 점이 2개 이상 이어지는 구간들을 돌려준다."""
    runs, run = [], []
    points = ring[:-1] if ring[0] == ring[-1] else ring
    n = len(points)
    # 공유 구간이 고리의 처음과 끝에 걸쳐 있을 수 있으므로 공유 안 된 점에서부터 돈다.
    start = next((i for i, p in enumerate(points) if key(p) not in others), 0)
    for step in range(n + 1):
        p = points[(start + step) % n]
        if key(p) in others:
            run.append(p)
        else:
            if len(run) >= 2:
                runs.append(run)
            run = []
    if len(run) >= 2:
        runs.append(run)
    return runs


def main():
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    countries = {f["properties"]["ADM0_A3"]: f for f in data["features"]}
    north = rings(countries["PRK"]["geometry"])
    result = {}
    for name, codes in (("mdl", ["KOR"]), ("national", ["CHN", "RUS"])):
        others = {key(p) for code in codes for ring in rings(countries[code]["geometry"]) for p in ring}
        lines = [run for ring in north for run in shared_runs(ring, others)]
        result[name] = [[[round(p[1], 4), round(p[0], 4)] for p in line] for line in lines]
        print(name, len(lines), "선", sum(len(line) for line in lines), "점")
    OUT.write_text(
        "// tools/build_borders.py 로 만든 파일. 직접 고치지 말 것.\n"
        "// 경계: Natural Earth(공공 저작물) 10m 나라 경계. [위도, 경도]\n"
        f"window.KOREA_BORDERS = {json.dumps(result, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
