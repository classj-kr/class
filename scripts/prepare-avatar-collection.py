"""Trace original-alpha parts into closed, rounded, individually shaped volumes.

No new raster assets or face repaints. The untouched original supplies front UVs.
Authoring landmarks and anatomy exceptions live in collection-profiles.cjs.
"""
from pathlib import Path
import base64, hashlib, json, subprocess, sys
import cv2
import numpy as np
from PIL import Image
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import spsolve

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs/avatar-lab/mesh-source'
OUT.mkdir(parents=True, exist_ok=True)
profiles = json.loads(subprocess.check_output(['node', '-e', 'process.stdout.write(JSON.stringify(require("./apps/avatar-lab/collection-profiles.cjs")))'], cwd=ROOT))
chosen = sys.argv[1:] or list(profiles)
Y, X = np.mgrid[:640, :640]

def clean(mask, minimum=25):
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype('uint8'), 8)
    return np.isin(labels, [i for i in range(1,n) if stats[i,cv2.CC_STAT_AREA]>=minimum])

def palette(rgba, mask):
    eroded=cv2.erode(mask.astype('uint8'),np.ones((9,9),'uint8'))>0
    pixels=rgba[:,:,:3][eroded if eroded.any() else mask]
    if not len(pixels):return '#cccccc'
    # Dominant non-outline cluster rather than a dark average including ink.
    light=pixels.mean(axis=1)
    good=pixels[light>np.percentile(light,22)]
    bins=(good//24).astype(int);codes=bins[:,0]*121+bins[:,1]*11+bins[:,2]
    code=np.bincount(codes).argmax();color=np.median(good[codes==code],axis=0)
    return '#'+''.join(f'{int(v):02x}' for v in color)

def encode(a, dtype):return base64.b64encode(np.asarray(a,dtype=dtype).tobytes()).decode()

def part_mesh(name, mask, rgba, pivot, depth, shape='round', z=0, back_art=False):
    mask=clean(mask)
    if mask.sum()<40:return None
    inside=cv2.distanceTransform(mask.astype('uint8'),cv2.DIST_L2,5)
    local_width=cv2.dilate(inside,np.ones((41,41),'uint8'))
    outside=cv2.distanceTransform((~mask).astype('uint8'),cv2.DIST_L2,5)
    signed=inside-outside
    max_radius=float(inside.max())
    # A Poisson inflation field is smooth across branched silhouettes. Its
    # square root is a sphere for a circular mask and stays thin on antlers.
    resolution=320
    small=cv2.resize(mask.astype('uint8'),(resolution,resolution),interpolation=cv2.INTER_NEAREST)>0
    sy,sx=np.where(small);ids=np.full(small.shape,-1,dtype=int);ids[sy,sx]=np.arange(len(sx))
    rr=list(range(len(sx)));cc=list(range(len(sx)));vv=[4.0]*len(sx)
    for dy,dx in [(0,1),(0,-1),(1,0),(-1,0)]:
        ny,nx=sy+dy,sx+dx;valid=(ny>=0)&(ny<resolution)&(nx>=0)&(nx<resolution)
        origin=np.flatnonzero(valid);dest=ids[ny[valid],nx[valid]];keep=dest>=0
        rr.extend(origin[keep]);cc.extend(dest[keep]);vv.extend([-1.0]*int(keep.sum()))
    solution=spsolve(coo_matrix((vv,(rr,cc)),shape=(len(sx),len(sx))).tocsr(),np.ones(len(sx)))
    field=np.zeros((resolution,resolution),np.float32);field[sy,sx]=solution
    field=np.maximum(0,cv2.resize(field,(640,640),interpolation=cv2.INTER_CUBIC))
    field/=max(float(field.max()),1e-5)
    step=5
    ys,xs=np.where(mask);xmin=max(0,int(xs.min())//step*step-step);xmax=min(639,(int(xs.max())//step+2)*step)
    ymin=max(0,int(ys.min())//step*step-step);ymax=min(639,(int(ys.max())//step+2)*step)
    points=[];indices=[];vertices={}
    def vertex(x,y,value):
        key=(round(x,4),round(y,4))
        if key not in vertices:
            ix,iy=int(round(x)),int(round(y));d=max(0,float(value))
            if shape in ['box','flat','disc','slice','paper']:
                u=min(1,d/18);height=depth*np.sqrt(max(0,2*u-u*u))
            else:
                height=depth*np.sqrt(max(float(field[iy,ix]),.20*d/max_radius)) if d>0 else 0
                height=min(height,float(local_width[iy,ix])*.005)
            # Give a softly rounded back a little more depth than the face.
            points.append([round(x,4),round(y,4),round(float(height),6),round(d,4)])
            vertices[key]=len(points)-1
        return vertices[key]
    for y in range(ymin,ymax,step):
        y2=min(639,y+step)
        for x in range(xmin,xmax,step):
            x2=min(639,x+step)
            corners=[(x,y,signed[y,x]),(x2,y,signed[y,x2]),(x2,y2,signed[y2,x2]),(x,y2,signed[y2,x])]
            for order in [(0,1,2),(0,2,3)]:
                triangle=[corners[i] for i in order];polygon=[]
                for i,a in enumerate(triangle):
                    b=triangle[(i+1)%3]
                    if a[2]>0:polygon.append(a)
                    if (a[2]>0)!=(b[2]>0):
                        t=float(a[2]/(a[2]-b[2]));polygon.append((a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),0))
                if len(polygon)<3:continue
                ids=[vertex(*v) for v in polygon]
                for i in range(1,len(ids)-1):
                    # Pixel Y points down; reverse for front +Z normals.
                    indices.extend([ids[0],ids[i+1],ids[i]])
    color_mask=mask
    if name=='Head':
        exclusion=((X-profile['cx'])/120)**2+((Y-(profile['neck']-110))/115)**2<1
        if (mask&~exclusion).sum()>1000:color_mask=mask&~exclusion
    if name=='Torso' and (mask&(np.abs(X-profile['cx'])>34)).sum()>500:color_mask=mask&(np.abs(X-profile['cx'])>34)
    color=profile.get('headColor') if name=='Head' else profile.get('bodyColor') if name=='Torso' else None
    color=color or palette(rgba,color_mask)
    vertex_colors=None
    if name=='Head' and profile.get('featureTop'):
        base=np.array([int(color[i:i+2],16) for i in (1,3,5)])/255
        rgb=[]
        for x,y,_,d in points:
            chosen=rgba[int(round(y)),int(round(x)),:3]/255 if y<profile['featureTop'] and d>2 else base
            rgb.append(np.where(chosen<=.04045,chosen/12.92,((chosen+.055)/1.055)**2.4))
        vertex_colors=encode(rgb,'<f4')
    return {'name':name,'pivot':pivot,'z':z,'depth':depth,'color':color,'backArt':back_art,'vertexColors':vertex_colors,
            'points':encode(points,'<f4'),'indices':encode(indices,'<u4'),'bounds':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]}

for key in chosen:
    profile=profiles[key]
    if profile['shape']=='custom':continue
    raw=(ROOT/'apps/classtools/assets/avatars'/f'{key}.webp').read_bytes()
    checksum=hashlib.sha256(raw+json.dumps(profile,sort_keys=True).encode()+Path(__file__).read_bytes()).hexdigest()
    destination=OUT/f'{key}.json'
    if destination.exists() and json.loads(destination.read_text())['checksum']==checksum:
        print(key+' cached',flush=True);continue
    rgba=np.array(Image.open(ROOT/'apps/classtools/assets/avatars'/f'{key}.webp').convert('RGBA'))
    mask=clean(rgba[:,:,3]>120)
    # The source files contain rectangular dark remnants below these feet.
    # Keep the source WebP intact, but do not turn the remnants into extra limbs.
    if key=='vehicle-airplane':mask &= Y<=539
    if key=='vehicle-fire-truck':mask &= Y<=561
    remaining=mask.copy();parts=[];cx=profile['cx'];neck=profile['neck'];leg=profile['leg'];half=profile['armHalf']
    def add(name,region,pivot,depth,shape='round',z=0,back=False,remove=False):
        part=part_mesh(name,remaining&region,rgba,pivot,depth,shape,z,back)
        if part:parts.append(part)
        if remove:remaining[region]=False
    if key=='animal-snail':
        add('SpiralShell',(X>350)&(Y>150)&(Y<550),[395,370],.40,'round',-.10,True)
        remaining[(X>365)&(Y>150)&(Y<550)]=False
    if 'tail' in profile:
        t=profile['tail'];region=(X<t['x'] if t['side']=='left' else X>t['x'])&(Y>t['y'])
        add('Tail',region,[t['x'],min(515,neck+75)],.13,'round',-.13,True,True)
    if profile['shape'] in ['wings','fan']:
        ex,ey,rx,ry=profile['wingEllipse'];core=((X-ex)/rx)**2+((Y-ey)/ry)**2<1
        wings=(Y>=profile['wingTop'])&(Y<neck+100)&~core&((X<cx-half)|(X>cx+half))
        add('LeftWing',wings&(X<cx),[cx-90,neck-50],.045,'flat',-.20,True,True)
        add('RightWing',wings&(X>=cx),[cx+90,neck-50],.045,'flat',-.20,True,True)
    if profile.get('wrapper'):
        add('LeftWrapper',(X<190)&(Y<430),[193,280],.075,'flat',-.08,True,True)
        add('RightWrapper',(X>450)&(Y<430),[447,280],.075,'flat',-.08,True,True)
    if profile['motion']!='walk':
        add('Head',Y<640,[cx,320],profile['depth'],profile['shape'])
    else:
        add('Head',Y<=neck+5,[cx,(65+neck)/2],profile['depth'],profile['shape'])
        if profile['holdArms']:
            add('Torso',(Y>=neck-12)&(Y<=leg+13),[cx,(neck+leg)/2],.23)
        else:
            add('Torso',(Y>=neck-12)&(Y<=leg+13)&(X>=cx-half-4)&(X<=cx+half+4),[cx,(neck+leg)/2],.23)
            add('LeftArm',(Y>=neck-6)&(Y<leg-5)&(X<cx-half+15),[cx-half+6,neck+16],.10)
            add('RightArm',(Y>=neck-6)&(Y<leg-5)&(X>cx+half-15),[cx+half-6,neck+16],.10)
        add('LeftLeg',(Y>=leg-10)&(X<cx),[cx-half*.48,leg-5],.14)
        add('RightLeg',(Y>=leg-10)&(X>=cx),[cx+half*.48,leg-5],.14)
    result={'checksum':checksum,'profile':profile,'parts':parts}
    destination.write_text(json.dumps(result,separators=(',',':')))
    print(key+' '+str(sum(len(base64.b64decode(p['indices']))//4//3 for p in parts))+' front triangles',flush=True)
