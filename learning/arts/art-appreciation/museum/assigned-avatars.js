(function () {
  'use strict';
  window.createMuseumAssignedAvatars = function ({ THREE, scene, canvas }) {
    const loader = window.createClassJAvatarLoader();
    const assets = new Map(), actors = new Set();
    let catalogPromise;
    function catalog() {
      return catalogPromise ||= fetch('/apps/avatar-lab/collection-index.json', { cache: 'no-cache' })
        .then(r => { if (!r.ok) throw new Error('Avatar catalog'); return r.json(); })
        .then(data => new Map(data.avatars.map(a => [a.id + '.webp', a])))
        .catch(error => { catalogPromise = null; throw error; });
    }
    function disposeAsset(gltf) {
      const geometries = new Set(), materials = new Set(), textures = new Set();
      gltf.scene.traverse(o => {
        if (!o.isMesh) return;
        geometries.add(o.geometry);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          materials.add(m);
          for (const value of Object.values(m)) if (value?.isTexture) textures.add(value);
        }
      });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    }
    function trim() {
      // Keep a small warm cache, not all 169 decoded models in memory.
      const unused = [...assets].filter(([, a]) => !a.refs && a.gltf).sort((a, b) => a[1].used - b[1].used);
      while (unused.length > 4) {
        const [key, entry] = unused.shift(); assets.delete(key); disposeAsset(entry.gltf);
      }
    }
    async function acquire(key) {
      let asset = assets.get(key);
      if (!asset) {
        asset = { refs: 0, used: performance.now() }; assets.set(key, asset);
        asset.promise = catalog().then(index => {
          const item = index.get(key);
          if (!item?.model) throw new Error('No 3D avatar for ' + key);
          return new Promise((resolve, reject) => loader.load('/apps/avatar-lab/' + item.model + '?v=' + item.revision, resolve, undefined, reject));
        }).then(gltf => {
          gltf.scene.traverse(o => {
            if (o.isMesh) { o.castShadow = o.receiveShadow = false;
              for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m.isMeshBasicMaterial) m.toneMapped = false;
            }
          });
          asset.gltf = gltf; return gltf;
        }).catch(error => { assets.delete(key); throw error; });
      }
      asset.refs++;
      try { await asset.promise; return asset; } catch (error) { asset.refs--; throw error; }
    }
    function release(asset) { if (asset) { asset.refs--; asset.used = performance.now(); trim(); } }
    function cloneModel(source) {
      const root = source.clone(true), originals = [], clones = [], lookup = new Map();
      source.traverse(o => originals.push(o)); root.traverse(o => clones.push(o));
      originals.forEach((o, i) => lookup.set(o, clones[i]));
      originals.forEach(o => { if (o.isSkinnedMesh) {
        const clone = lookup.get(o); clone.skeleton = o.skeleton.clone();
        clone.skeleton.bones = o.skeleton.bones.map(b => lookup.get(b));
        clone.bind(clone.skeleton, o.bindMatrix);
      } });
      return root;
    }
    function makeLabel(name) {
      const c = document.createElement('canvas'); c.width = 256; c.height = 64;
      const g = c.getContext('2d'); g.fillStyle = 'rgba(9,7,5,.80)'; g.fillRect(0, 4, 256, 52);
      g.fillStyle = '#fff0ca'; g.textAlign = 'center'; g.font = 'bold 25px sans-serif'; g.fillText(name, 128, 39, 240);
      const texture = new THREE.CanvasTexture(c); texture.encoding = THREE.sRGBEncoding;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: true }));
      sprite.position.y = 1.43; sprite.scale.set(.95, .24, 1); return sprite;
    }
    function create({ name = '', self = false } = {}) {
      const group = new THREE.Group(); scene.add(group);
      const actor = { group, self, key: '', state: 'unassigned', motion: 'Idle', moving: false, speed: 0, token: 0, disposed: false };
      if (name) { actor.label = makeLabel(name); group.add(actor.label); }
      actors.add(actor);
      actor.assign = async function (rawKey) {
        const key = String(rawKey || '').replace(/\.png$/i, '.webp');
        if (actor.key === key && actor.state !== 'error') return;
        const token = ++actor.token; actor.key = key;
        if (actor.mixer) { actor.mixer.stopAllAction(); actor.mixer.uncacheRoot(actor.model); }
        if (actor.model) group.remove(actor.model);
        release(actor.asset); actor.asset = actor.model = actor.mixer = actor.actions = null;
        if (actor.fallback) { group.remove(actor.fallback); actor.fallback.material.map?.dispose(); actor.fallback.material.dispose(); actor.fallback = null; }
        actor.state = key ? 'loading' : 'unassigned';
        if (!key) return;
        try {
          const asset = await acquire(key);
          if (actor.disposed || token !== actor.token) { release(asset); return; }
          actor.asset = asset; actor.model = cloneModel(asset.gltf.scene);
          const box = new THREE.Box3().setFromObject(actor.model), size = box.getSize(new THREE.Vector3());
          const scale = Math.min(1.2 / Math.max(.01, size.y), 1.55 / Math.max(.01, size.x));
          actor.model.scale.multiplyScalar(scale); actor.model.position.y -= box.min.y * scale;
          group.add(actor.model); actor.mixer = new THREE.AnimationMixer(actor.model);
          actor.actions = Object.fromEntries(asset.gltf.animations.map(clip => [clip.name, actor.mixer.clipAction(clip)]));
          actor.stride = .36 * scale;
          actor.model.traverse(o => { if (o.userData.walkStride) actor.stride = o.userData.walkStride * scale; });
          actor.actions.CharacterEffects?.play(); actor.motion = '';
          actor.state = 'ready'; setMotion(actor, actor.moving); actor.mixer.update(0);
        } catch (error) {
          if (actor.disposed || token !== actor.token) return;
          actor.state = 'error'; console.warn('Museum avatar unavailable:', key, error.message);
          // Preserve the assigned identity even if a model is unavailable; never substitute another student's character.
          if (/^[a-z0-9-]+\.webp$/.test(key)) {
            const texture = new THREE.TextureLoader().load('/assets/avatars/' + key);
            texture.encoding = THREE.sRGBEncoding;
            actor.fallback = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
            actor.fallback.position.y = .6; actor.fallback.scale.set(1.1, 1.2, 1); group.add(actor.fallback);
          }
        }
      };
      actor.dispose = function () {
        actor.disposed = true; actor.token++; actors.delete(actor); scene.remove(group);
        if (actor.mixer) { actor.mixer.stopAllAction(); actor.mixer.uncacheRoot(actor.model); }
        release(actor.asset);
        for (const sprite of [actor.label, actor.fallback]) if (sprite) { sprite.material.map?.dispose(); sprite.material.dispose(); }
      };
      return actor;
    }
    function setMotion(actor, moving) {
      const name = moving && actor.actions?.Walk ? 'Walk' : 'Idle';
      if (!actor.actions || actor.motion === name) return;
      const previous = actor.actions[actor.motion], next = actor.actions[name];
      if (previous) previous.fadeOut(.12);
      if (next) next.reset().setEffectiveWeight(1).fadeIn(.12).play();
      actor.motion = name;
    }
    let reportTime = 0;
    function update(dt) {
      for (const actor of actors) {
        setMotion(actor, actor.moving);
        const walk = actor.actions?.Walk;
        if (walk) walk.setEffectiveTimeScale(Math.min(3, Math.max(.5, actor.speed * walk.getClip().duration / Math.max(.01, actor.stride))));
        if (actor.group.visible) actor.mixer?.update(dt);
      }
      reportTime += dt;
      if (reportTime >= .25) {
        reportTime = 0;
        canvas.dataset.avatars = JSON.stringify([...actors].map(a => ({ self: a.self, key: a.key, state: a.state, motion: a.motion,
          visible: a.group.visible, x: +a.group.position.x.toFixed(3), z: +a.group.position.z.toFixed(3), yaw: +a.group.rotation.y.toFixed(3), time: +(a.mixer?.time || 0).toFixed(3) })));
      }
    }
    return { create, update };
  };
})();
