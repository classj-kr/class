"""Repair digitization seams in the three reviewed textbook colour maps.

Work in SOURCE PIXELS, before map registration. Automatic seams are restricted
to three pixels from both colour masks; reviewed annotation exceptions have
explicit pixel coordinates in history-reference-control.json. Unknown/outside
areas are never assigned wholesale. Shared edges are rounded ONCE, then used
by both countries; smoothing polygons independently would recreate gaps.
"""
import math
import numpy as np
from shapely import make_valid, voronoi_polygons, set_precision
from shapely.geometry import Polygon, MultiPoint, LineString, Point
from shapely.ops import unary_union, linemerge, polygonize


def polygons(g):
    if g.geom_type == 'Polygon':
        return [g]
    return [p for child in getattr(g, 'geoms', []) for p in polygons(child)]


def rounded_line(line, tolerance=1.2):
    points = list(line.simplify(tolerance).coords)
    closed = points[0] == points[-1]
    if closed:
        points = points[:-1]
    for _ in range(3):
        pairs = list(zip(points, points[1:] + ([points[0]] if closed else [])))
        refined = [] if closed else [points[0]]
        for a, b in pairs:
            refined.extend([(a[0]*.75+b[0]*.25, a[1]*.75+b[1]*.25),
                            (a[0]*.25+b[0]*.75, a[1]*.25+b[1]*.75)])
        points = refined if closed else refined + [points[-1]]
    return LineString(points + ([points[0]] if closed else []))


def repair_regions(rings, seam_pixels=3, annotation_holes=(), overlap_priority=(), annotation_seams=(), connected_regions=()):
    originals = [make_valid(Polygon(ring)) for ring in rings]
    cover = unary_union(originals)
    overlaps = unary_union([a.intersection(b) for i, a in enumerate(originals)
                           for b in originals[i+1:]])
    overlap_area = overlaps.area
    if overlap_priority:
        # Reviewed source colour precedence, needed where morphological closing
        # of the yellow mask crosses the narrow green Silla strip on the coast.
        taken = Polygon()
        for i in overlap_priority:
            originals[i] = originals[i].difference(taken)
            taken = taken.union(originals[i])
        # The reviewed Goguryeo colour field is connected. Mask closing around
        # the Siljik symbol left a tiny yellow fragment inside the green strip;
        # give that cut-off fragment to its adjoining region, not an exclave.
        for i in connected_regions:
            parts = sorted(polygons(originals[i]), key=lambda p:p.area, reverse=True)
            for fragment in parts[1:]:
                neighbours = [(fragment.boundary.intersection(g.boundary).length, j)
                              for j,g in enumerate(originals) if i != j]
                shared, owner = max(neighbours)
                if shared <= 0:
                    raise ValueError('Disconnected source fragment has no adjoining owner')
                originals[owner] = originals[owner].union(fragment)
            originals[i] = parts[0]
        cover = unary_union(originals)
        overlaps = Polygon()
    gaps = unary_union([a.buffer(seam_pixels).intersection(b.buffer(seam_pixels))
                        for i, a in enumerate(originals) for b in originals[i+1:]])
    gaps = gaps.difference(cover)
    annotation_fill = unary_union([Point(item['center']).buffer(item['radius'])
                                   for item in annotation_seams]).difference(cover)
    gaps = gaps.union(annotation_fill)
    # Dashed source borders can leave isolated pinholes after the narrow strips
    # meet. Only tiny holes enclosed by those reviewed strips qualify; large
    # unknown areas and holes already present inside a single country remain.
    original_holes = unary_union([Polygon(r) for g in originals for p in polygons(g) for r in p.interiors])
    reviewed_annotations = [Point(item['center']).buffer(item['radius']) for item in annotation_holes]
    pinholes = unary_union([Polygon(r) for p in polygons(cover.union(gaps)) for r in p.interiors
                            if Polygon(r).area <= 25 or
                            any(zone.covers(Polygon(r)) for zone in reviewed_annotations)])
    pinholes = pinholes.difference(original_holes)
    gaps = gaps.union(pinholes)
    ambiguous = gaps.union(overlaps)
    cores = [g.difference(overlaps) for g in originals]

    # A Voronoi partition gives the seam one owner, with the same dividing edge
    # on both sides. Sampling at half a source pixel is finer than the source.
    samples, owners = [], []
    for owner, core in enumerate(cores):
        for p in polygons(core):
            for ring in [p.exterior, *p.interiors]:
                for distance in np.linspace(0, ring.length, max(2, math.ceil(ring.length*2)), endpoint=False):
                    point = ring.interpolate(distance)
                    samples.append((point.x, point.y))
                    owners.append(owner)
    # Some touching cores share sample coordinates. Keep deterministic ownership.
    unique = {}
    for point, owner in zip(samples, owners):
        unique.setdefault(point, owner)
    cells = voronoi_polygons(MultiPoint(list(unique)), ordered=True)
    additions = [[] for _ in cores]
    for cell, owner in zip(cells.geoms, unique.values()):
        if cell.intersects(ambiguous):
            additions[owner].append(cell.intersection(ambiguous))
    repaired = [unary_union(polygons(set_precision(unary_union([core, *extra]), 0.00001)))
                for core, extra in zip(cores, additions)]

    network = unary_union([g.boundary for g in repaired])
    merged = linemerge(network)
    lines = [merged] if merged.geom_type == 'LineString' else list(merged.geoms)
    rounded = unary_union([rounded_line(line) for line in lines])
    groups = [[] for _ in originals]
    for cell in polygonize(rounded):
        areas = [cell.intersection(g).area for g in repaired]
        if max(areas) > cell.area * .5:
            groups[int(np.argmax(areas))].append(cell)
    result = [unary_union(group) for group in groups]
    if any(g.is_empty for g in result):
        raise ValueError('Shared boundary reconstruction lost a country')
    if any(a.intersection(b).area > 1e-6 for i,a in enumerate(result) for b in result[i+1:]):
        raise ValueError('Shared boundary reconstruction created overlapping countries')
    return result, {
        'method': 'source-pixel shared topology; half-pixel nearest-edge seams; shared-line rounding',
        'maxSeamDistancePixels': seam_pixels,
        'lineSimplificationPixels': 1.2,
        'filledSeamPixels2': round(gaps.area, 3),
        'filledSeamPinholePixels2': round(pinholes.area, 3),
        'reviewedSourceAnnotations': list(annotation_holes),
        'reviewedCoastalAnnotations': list(annotation_seams),
        'coastalAnnotationPixels2': round(annotation_fill.area, 3),
        'overlapPriority': list(overlap_priority),
        'reviewedConnectedRegions': list(connected_regions),
        'resolvedOverlapPixels2': round(overlap_area, 3),
        'countryCount': len(result),
        'sharedEdgePixels': [round(a.boundary.intersection(b.boundary).length, 3)
                             for i,a in enumerate(result) for b in result[i+1:]],
    }
