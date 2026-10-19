import importlib.util,unittest,xml.etree.ElementTree as ET
from pathlib import Path
import pymupdf
spec=importlib.util.spec_from_file_location('figures',Path(__file__).parents[1]/'scripts/build-world-history-figures.py')
figures=importlib.util.module_from_spec(spec);spec.loader.exec_module(figures)
CIRCLE='M2 0 C2 1.1046 1.1046 2 0 2 C-1.1046 2 -2 1.1046 -2 0 C-2 -1.1046 -1.1046 -2 0 -2 C1.1046 -2 2 -1.1046 2 0 Z'
def path(id,data,fill='#000000',transform='matrix(1,0,0,1,30,30)'):
 return ET.Element(figures.SVG+'path',{'id':id,'d':data,'fill':fill,'transform':transform})
class CitySymbols(unittest.TestCase):
 def test_zero_length_round_stroke_capitals(self):
  root=ET.Element(figures.SVG+'svg')
  for id,color,width in [('outer','#221714','4.194'),('halo','#ffffff','3.595'),('inner','#221714','2.396'),('colored-event','#ff0000','3')]:
   e=path(id,'M0 0V0','none');e.set('stroke',color);e.set('stroke-width',width);e.set('stroke-linecap','round');root.append(e)
  line=path('boundary','M0 0V4','none');line.set('stroke','#221714');line.set('stroke-width','1');line.set('stroke-linecap','round');root.append(line)
  class Page:
   def get_svg_image(self):return ET.tostring(root)
   def get_images(self):return []
  out,count=figures.cleaned_svg(Page(),pymupdf.Rect(20,20,60,60),{})
  self.assertEqual(count,3)
  self.assertEqual({p.get('id') for p in ET.fromstring(out).iter(figures.SVG+'path')},{'colored-event','boundary'})
 def test_round_city_path_and_noncity_geometry(self):
  self.assertIsNotNone(figures.city_circle(path('city',CIRCLE)))
  self.assertIsNotNone(figures.city_circle(path('gray-city',CIRCLE,'#2c292a')))
  self.assertIsNone(figures.city_circle(path('battle','M0 0 L3 1 L1 2 L0 4 L-1 2 L-3 1 Z')))
  self.assertIsNone(figures.city_circle(path('event',CIRCLE,'#ff0000')))
  self.assertIsNone(figures.city_circle(path('coast',CIRCLE.replace('1.1046 2 0 2','1.1046 2 0 .5'))))
  self.assertIsNone(figures.city_circle(path('route','M0 0 C1 1 2 2 3 3')))
 def test_removes_city_halo_but_preserves_unrelated_white_and_colored_marks(self):
  root=ET.Element(figures.SVG+'svg')
  root.extend([path('city',CIRCLE),path('halo',CIRCLE,'#ffffff','matrix(1.2,0,0,1.2,30,30)'),path('white-island',CIRCLE,'#ffffff','matrix(1,0,0,1,40,40)'),path('event',CIRCLE,'#ff0000'),path('battle','M0 0 L3 1 L1 2 L0 4 L-1 2 L-3 1 Z'),path('route','M0 0 C5 4 10 10 20 20','#0075c2')])
  class Page:
   def get_svg_image(self):return ET.tostring(root)
   def get_images(self):return []
  out,count=figures.cleaned_svg(Page(),pymupdf.Rect(20,20,60,60),{})
  ids={p.get('id') for p in ET.fromstring(out).iter(figures.SVG+'path')}
  self.assertEqual(count,2)
  self.assertEqual(ids,{'white-island','event','battle','route'})
if __name__=='__main__':unittest.main()
