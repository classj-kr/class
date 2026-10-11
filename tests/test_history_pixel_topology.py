"""Regression checks for enlarged historical map borders and shared seams."""
import json
import sys
import unittest
from pathlib import Path
from shapely.geometry import Polygon, Point, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'learning/inquiry/korea-map/tools'))
from history_pixel_topology import repair_regions, polygons


class PixelTopologyTest(unittest.TestCase):
    def test_raster_stair_seam_becomes_one_shared_border(self):
        left = [(0,0),(10,0),(10,5),(12,5),(12,10),(14,10),(14,15),(16,15),(16,20),(0,20),(0,0)]
        right = [(x+1,y) for x,y in left[1:9]] + [(30,20),(30,0),(11,0)]
        result, audit = repair_regions([left,right])
        self.assertLess(result[0].intersection(result[1]).area, 1e-7)
        shared = result[0].boundary.intersection(result[1].boundary)
        self.assertGreater(shared.length, 18)
        self.assertTrue(unary_union(result).covers(Point(12.5,8)))
        self.assertGreater(audit['filledSeamPixels2'], 0)

    def test_unknown_wide_gap_is_preserved(self):
        a = [(0,0),(10,0),(10,20),(0,20),(0,0)]
        b = [(30,0),(40,0),(40,20),(30,20),(30,0)]
        result, audit = repair_regions([a,b])
        self.assertFalse(unary_union(result).covers(Point(20,10)))
        self.assertEqual(audit['filledSeamPixels2'],0)

    def test_shipped_ancient_coverage_has_no_inland_seam_holes(self):
        data = json.loads((ROOT/'learning/inquiry/korea-map/history/boundaries.json').read_text(encoding='utf-8'))
        for key,scene in data['scenes'].items():
            with self.subTest(scene=key):
                regions = [shape(a['geometry']) for a in scene['areas'] if not a.get('pattern')]
                for geometry in regions:
                    self.assertTrue(geometry.is_valid)
                    self.assertFalse(geometry.is_empty)
                for i,a in enumerate(regions):
                    for b in regions[i+1:]:
                        self.assertLess(a.intersection(b).area, 1e-8)
                holes = [Polygon(r).area for p in polygons(unary_union(regions)) for r in p.interiors]
                self.assertLess(sum(holes), 1e-8, 'No blank lakes made by digitization seams')
                self.assertEqual(scene['topology']['maxSeamDistancePixels'], 3)
                if key == 'goguryeo-fifth':
                    self.assertEqual(len(polygons(regions[0])), 1, 'Siljik symbol must not create a Goguryeo exclave')

    def test_capitals_stay_in_their_countries(self):
        data = json.loads((ROOT/'learning/inquiry/korea-map/history/boundaries.json').read_text(encoding='utf-8'))
        checks = [('baekje-fourth','한성','백제'),('goguryeo-fifth','웅진','백제'),
                  ('goguryeo-fifth','평양','고구려'),('goguryeo-fifth','금관가야','가야'),
                  ('silla-sixth','금성','신라')]
        for key,capital,country in checks:
            scene=data['scenes'][key]
            point=Point(next(c['xy'] for c in scene['controls'] if c['name']==capital))
            country_geometry=shape(next(a['geometry'] for a in scene['areas'] if a['name']==country))
            self.assertTrue(country_geometry.covers(point), f'{key}: {capital} must remain in {country}')


if __name__ == '__main__':
    unittest.main()
