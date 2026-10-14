/* Both globes use a surface-fixed observer. Local +Y is up and +Z is the gaze. */
(function (root) {
    'use strict';

    function frame(latitude, meridian) {
        const phi = latitude * Math.PI / 180;
        const c = Math.cos(meridian), s = Math.sin(meridian);
        const up = [Math.cos(phi) * c, Math.sin(phi), Math.cos(phi) * s];
        // The analytic meridian tangent also remains defined at the poles.
        const north = [-Math.sin(phi) * c, Math.cos(phi), -Math.sin(phi) * s];
        const sign = latitude < 0 ? 1 : -1;
        const forward = north.map(v => v * sign);
        const side = [up[1]*forward[2]-up[2]*forward[1], up[2]*forward[0]-up[0]*forward[2], up[0]*forward[1]-up[1]*forward[0]];
        return {up, forward, side, direction:latitude < 0 ? '북쪽' : '남쪽'};
    }

    function create() {
        const T = root.THREE, figure = new T.Group();
        const materials = {};
        function material(color) {
            return materials[color] ||= new T.MeshBasicMaterial({color});
        }
        function mesh(geometry, color, x, y, z) {
            const part = new T.Mesh(geometry, material(color));
            part.position.set(x,y,z);figure.add(part);return part;
        }
        function limb(from,to,radius,color) {
            const a=new T.Vector3(...from), b=new T.Vector3(...to), delta=b.clone().sub(a);
            const part=mesh(new T.CylinderGeometry(radius,radius,delta.length(),12),color,...a.clone().add(b).multiplyScalar(.5).toArray());
            part.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
        }
        for (const side of [-1,1]) {
            // Distinct trousers, shoes and hands keep the silhouette legible at small sizes.
            limb([side*.21,.19,0],[side*.21,.9,0],.13,0x233e66);
            mesh(new T.BoxGeometry(.3,.18,.47),0xe5edf5,side*.21,.17,.12);
            limb([side*.36,1.47,0],[side*.57,1.01,.06],.12,0xf97316);
            mesh(new T.SphereGeometry(.13,12,8),0xffc28a,side*.59,.91,.07);
        }
        mesh(new T.CylinderGeometry(.34,.4,.8,16),0xf97316,0,1.22,0);
        mesh(new T.SphereGeometry(.38,24,16),0xffc28a,0,1.99,0);
        // Nose, eyes and a forward-only cap peak distinguish front from back.
        for (const side of [-1,1]) {
            mesh(new T.SphereGeometry(.055,12,8),0x142133,side*.14,2.05,.344);
        }
        const nose=mesh(new T.ConeGeometry(.1,.22,12),0xed9855,0,1.96,.42);
        nose.rotation.x=Math.PI/2;
        mesh(new T.SphereGeometry(.4,24,12,0,Math.PI*2,0,Math.PI/2),0xfacc15,0,2.12,0);
        mesh(new T.BoxGeometry(.66,.065,.3),0xfacc15,0,2.13,.31);
        // A short, solid arrow points along the local horizon, never at the camera or Sun.
        const gaze = new T.Group();gaze.name='observer-gaze';figure.add(gaze);
        const shaft=new T.Mesh(new T.CylinderGeometry(.055,.055,1.45,10),material(0xffed91));
        shaft.rotation.x=Math.PI/2;shaft.position.set(0,1.96,1.33);gaze.add(shaft);
        const tip=new T.Mesh(new T.ConeGeometry(.2,.42,16),material(0xffed91));
        tip.rotation.x=Math.PI/2;tip.position.set(0,1.96,2.24);gaze.add(tip);
        const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=80;
        const texture=new T.CanvasTexture(labelCanvas);
        const label=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:true,depthWrite:false}));
        // Caption sprites must not occlude seasonal labels or participate in picking.
        label.raycast=()=>{};
        label.position.set(0,1.26,2.25);label.scale.set(1.35,.52,1);figure.add(label);
        let lastDirection='';
        figure.userData.setDirection = direction => {
            if(direction===lastDirection)return;lastDirection=direction;
            const ctx=labelCanvas.getContext('2d');ctx.clearRect(0,0,256,80);
            ctx.fillStyle='#07121ee6';ctx.fillRect(0,0,256,80);
            ctx.font='bold 60px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
            ctx.fillStyle='#fff1ac';ctx.fillText(direction,128,42);texture.needsUpdate=true;
        };
        figure.userData.setDirection('남쪽');
        return figure;
    }

    function place(marker, figure, latitude, meridian, radius) {
        const T=root.THREE, f=frame(latitude,meridian);
        const up=new T.Vector3(...f.up), forward=new T.Vector3(...f.forward), side=new T.Vector3(...f.side);
        marker.position.copy(up).multiplyScalar(radius);
        marker.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(side,up,forward));
        figure.userData.setDirection(f.direction);
    }
    root.EarthObserver={create,frame,place};
})(typeof window==='undefined'?globalThis:window);
