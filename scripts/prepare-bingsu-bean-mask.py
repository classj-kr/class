"""Measure red topping pixels for mesh projection; leave the raster unchanged."""
import base64, hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=root/'apps/classtools/assets/avatars/food-bingsu.webp'
rgba=np.asarray(Image.open(source).convert('RGBA')).astype('int16')
red=(rgba[:,:,0]-rgba[:,:,1]>18)&(rgba[:,:,0]-rgba[:,:,2]>12)&(rgba[:,:,3]>120)
red[280:]=False
output=root/'outputs/avatar-lab/mesh-source/food-bingsu-bean-mask.json'
output.write_text(json.dumps({'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'mask':base64.b64encode(red.astype('uint8').tobytes()).decode()}),encoding='utf8')
