"""Historical regression: late Ming must not inherit modern China's territory."""
import math
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'learning/inquiry/korea-map/tools'))
from history_ming import registered_frontier


class MingTerritoryTest(unittest.TestCase):
    def test_source_registration_and_period(self):
        geometry, audit = registered_frontier()
        self.assertTrue(geometry.is_valid)
        self.assertLess(audit['registrationMaxKm'], 50)
        self.assertIn('1580', audit['title'])
        self.assertFalse(geometry.covers(Point(93.5,42.8)), 'Hami was not held in 1592')

    def test_actual_shipped_svg_has_historical_extent(self):
        svg = ROOT/'learning/inquiry/korea-map/history/territories/imjin-0.svg'
        root = ET.parse(svg).getroot()
        ns = {'s':'http://www.w3.org/2000/svg'}
        path = next(p for p in root.findall('s:path', ns) if p.find('s:title', ns).text == '명')
        polygons = []
        for ring in path.attrib['d'].split('Z'):
            coords = [(float(x),float(y)) for x,y in re.findall(r'[ML](-?[\d.]+),(-?[\d.]+)', ring)]
            if coords: polygons.append(Polygon(coords))
        geometry = unary_union(polygons)
        def covers(lon, lat):
            x=(lon-80)*1600/90
            y=(math.log(math.tan(math.pi/4+math.radians(70)/2))-math.log(math.tan(math.pi/4+math.radians(lat)/2)))*1600/math.radians(90)
            return geometry.covers(Point(x,y))
        inside = {'Beijing':(116.4074,39.9042),'Nanjing':(118.7969,32.0603),
                  'Liaoyang':(123.17,41.27),'Shenyang':(123.43,41.8),
                  'Kaiyuan':(124.04,42.55),'Kunming':(102.71,25.04),
                  'Hainan':(109.7,19.2),'Jiuquan':(98.49,39.74)}
        outside = {'Lhasa':(91.13,29.65),'Urumqi':(87.62,43.83),
                   'Hami':(93.5,42.8),'Ulaanbaatar':(106.9,47.92),
                   'Harbin':(126.64,45.76),'Changchun':(125.32,43.82),
                   'Taiwan':(121.0,23.7),'Seoul':(126.98,37.57),
                   'Hanoi':(105.83,21.03),'South China Sea':(112,16)}
        for name,xy in inside.items():
            with self.subTest(name=name): self.assertTrue(covers(*xy))
        for name,xy in outside.items():
            with self.subTest(name=name): self.assertFalse(covers(*xy))


if __name__ == '__main__':
    unittest.main()
