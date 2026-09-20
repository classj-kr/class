"""Generate Mercator-aligned, land-clipped schematic history overlays.

Input land: world-atlas@2.0.2/land-50m.json (Natural Earth public-domain data).
python tools/build_history_overlays.py --land /path/to/land-50m.json
No network or third-party Python packages are required.
"""
import argparse
import json
import math
from pathlib import Path


def build(land_path):
    root = Path(__file__).resolve().parent.parent
    source = (root / "data/history-data.js").read_text(encoding="utf-8")
    scenes = json.loads(source.split("window.KOREA_HISTORY = ", 1)[1].rstrip().removesuffix(";"))["scenes"]
    topo = json.loads(Path(land_path).read_text(encoding="utf-8"))
    scale, translate = topo["transform"]["scale"], topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        coordinates = []
        for dx, dy in arc:
            x += dx
            y += dy
            coordinates.append([x * scale[0] + translate[0], y * scale[1] + translate[1]])
        arcs.append(coordinates)

    def ring(indexes):
        result = []
        for i in indexes:
            points = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
            result.extend(points if not result else points[1:])
        return result

    def polygons(obj):
        if obj["type"] == "GeometryCollection":
            return [p for g in obj["geometries"] for p in polygons(g)]
        if obj["type"] == "Polygon":
            return [[ring(r) for r in obj["arcs"]]]
        if obj["type"] == "MultiPolygon":
            return [[ring(r) for r in p] for p in obj["arcs"]]
        return []

    land = polygons(topo["objects"]["land"])
    merc = lambda lat: math.log(math.tan(math.pi / 4 + math.radians(max(-85, min(85, lat))) / 2))
    colors = ["#91b9cd", "#e6b887", "#bbcf93"]
    for scene in scenes:
        if not scene.get("overlay"):
            continue
        west, south, east, north = scene["bounds"]
        top, bottom = merc(north), merc(south)
        width = 1000
        factor = width / math.radians(east - west)
        height = (top - bottom) * factor

        def path(points):
            return "M" + "L".join(f"{math.radians(lon-west)*factor:.2f},{(top-merc(lat))*factor:.2f}" for lon, lat in points) + "Z"

        nearby = [p for p in land if min(x for x, y in p[0]) <= east and max(x for x, y in p[0]) >= west and min(y for x, y in p[0]) <= north and max(y for x, y in p[0]) >= south]
        clip = "".join(f'<path d="{"".join(path(r) for r in p)}" clip-rule="evenodd"/>' for p in nearby)
        areas = "".join(f'<path d="{path(a["ring"])}" fill="{colors[a["color"]]}" stroke="#667461" stroke-width="1.7" stroke-dasharray="6 4"/>' for a in scene["areas"])
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height:.2f}" viewBox="0 0 {width} {height:.2f}"><!-- Schematic influence, not surveyed borders. Land: Natural Earth via world-atlas 2.0.2. --><defs><clipPath id="land">{clip}</clipPath></defs><g clip-path="url(#land)">{areas}</g></svg>\n'
        output = root / scene["overlay"]
        output.parent.mkdir(exist_ok=True)
        output.write_text(svg, encoding="utf-8")
        print(f"{output.name}: {len(svg):,} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--land", required=True)
    build(parser.parse_args().land)
