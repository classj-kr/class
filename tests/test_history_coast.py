"""The coastline correction must not redraw historical inland borders."""
import sys
import unittest
from pathlib import Path
from shapely.geometry import box, Point
from shapely.ops import unary_union

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'learning/inquiry/korea-map/tools'))
from history_coast import coastal_regions


class CoastRegistrationTest(unittest.TestCase):
    def test_only_missing_nearby_shore_is_filled(self):
        mainland = box(126, 34, 130, 38)
        distant_island = box(132, 34, 132.1, 34.1)
        land = mainland.union(distant_island)
        original = [box(126.1, 34.1, 127.95, 37.9), box(128.05, 34.1, 129.9, 37.9)]
        result, audit = coastal_regions(original, land)
        painted = unary_union(result)
        self.assertTrue(result[0].covers(Point(126.04, 36)))
        self.assertTrue(result[1].covers(Point(129.96, 36)))
        self.assertFalse(painted.covers(Point(128, 36)), 'Unknown inland gap must stay unchanged')
        self.assertFalse(painted.intersects(distant_island), 'Do not assign distant islands')
        self.assertLess(painted.difference(land).area, 1e-8, 'Never colour sea')
        self.assertLess(result[0].intersection(result[1]).area, 1e-8, 'Shared shores have one owner')
        for before, after in zip(original, result):
            self.assertLess(before.difference(after).area, 1e-8)
        self.assertEqual(audit['remainingEligibleMercatorKm2'], 0)


if __name__ == '__main__':
    unittest.main()
