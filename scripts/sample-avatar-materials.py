"""Sample source pigments into vertex-color lookup data, without new images."""
from pathlib import Path
import base64, hashlib, json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter

root=Path(__file__).resolve().parents[1]
result={}
y,x=np.mgrid[:640,:640]
for name in ['sport-baseball','sport-basketball','sport-soccer']:
    path=root/'apps/classtools/assets/avatars'/f'{name}.webp'
    image=np.asarray(Image.open(path).convert('RGBA'))
    rgb=image[:,:,:3].astype(float)
    outside_face=((x-320)/118)**2+((y-294)/103)**2>1
    if name=='sport-basketball':
        pigment=(rgb[:,:,0]>160)&(rgb[:,:,1]>70)&(rgb[:,:,1]<215)&(rgb[:,:,2]<140)
    else:
        pigment=(rgb.min(axis=2)>170)&(rgb.max(axis=2)-rgb.min(axis=2)<35)
    valid=pigment&outside_face&(image[:,:,3]>220)&(((x-320)/195)**2+((y-250)/195)**2<.96**2)
    nearest=distance_transform_edt(~valid,return_distances=False,return_indices=True)
    field=rgb[nearest[0],nearest[1]]
    field=np.stack([gaussian_filter(field[:,:,c],3) for c in range(3)],axis=2)
    sampled=np.clip(field[5::10,5::10],0,255).astype('uint8')
    result[name]={'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'size':64,'rgb':base64.b64encode(sampled.tobytes()).decode()}
(root/'apps/avatar-lab/ball-pigments.json').write_text(json.dumps(result,separators=(',',':'))+'\n',encoding='utf-8')
print('Sampled source pigments for three ball costumes; original WebP files unchanged.')
