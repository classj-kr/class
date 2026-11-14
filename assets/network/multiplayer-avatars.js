/* Assigned avatars and pre-rendered walking frames. No WebGL or per-player timers. */
(() => {
    'use strict';
    let profilePromise, manifestPromise;
    const loaded = new Map();
    const canvasImages = new Map();
    const base = '/assets/avatar-walk/';
    const valid = key => /^[a-z0-9-]+\.webp$/i.test(String(key || ''));
    function loadKey() {
        return profilePromise ||= fetch('/api/auth/me', {credentials:'same-origin'})
            .then(r => r.ok ? r.json() : null).then(async me => {
                if (!me?.signedIn) return '';
                const route = me.isTeacher && !me.membership ? '/api/teacher/settings' : '/api/student/profile';
                const r = await fetch(route, {credentials:'same-origin'});
                const key = r.ok ? (await r.json()).profile?.avatar?.key : '';
                return valid(key) ? key : '';
            }).catch(() => '');
    }
    function atlas(key) {
        manifestPromise ||= fetch(base+'manifest.json?v=1').then(r => r.ok ? r.json() : null).catch(() => null);
        return manifestPromise.then(manifest => {
            const entry = manifest?.avatars?.[key.slice(0,-5)];
            if (!entry) return '';
            const url = base+'map/'+key+'?v='+entry.mapHash;
            if (!loaded.has(url)) loaded.set(url, new Promise(resolve => {
                const image = new Image();
                image.onload = () => resolve(url); image.onerror = () => resolve(''); image.src = url;
            }));
            return loaded.get(url);
        });
    }
    function create(key, {walking=false}={}) {
        const node = document.createElement('span');
        node.className = 'mp-avatar-figure'; node.setAttribute('aria-hidden','true');
        if (!valid(key)) { node.classList.add('mp-avatar-unassigned'); node.textContent='미설정'; return node; }
        const img = document.createElement('img');
        img.src='/assets/avatars/'+key; img.alt=''; img.decoding='async'; img.draggable=false;
        img.onerror=()=>{img.remove();node.classList.add('mp-avatar-unassigned');node.textContent='미설정';};
        node.append(img);
        if (walking) atlas(key).then(url => {
            if (!url) return;
            node.style.backgroundImage=`url("${url}")`;
            node.classList.add('mp-avatar-walking');
            node.replaceChildren();
        });
        return node;
    }
    document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('mp-avatars-paused',document.hidden));
    function canvasImage(key) {
        if (!valid(key)) return null;
        if (!canvasImages.has(key)) {
            const entry={image:new Image(),ready:false,atlas:false};
            canvasImages.set(key,entry);
            entry.image.onload=()=>{entry.ready=true;}; entry.image.src='/assets/avatars/'+key;
            atlas(key).then(url=>{if(!url)return;const image=new Image();image.onload=()=>{entry.image=image;entry.ready=true;entry.atlas=true;};image.src=url;});
        }
        const entry=canvasImages.get(key);return entry.ready?entry:null;
    }
    let hydrationQueued = false;
    function markup(key) {
        if (!valid(key)) return '';
        if (!hydrationQueued) {
            hydrationQueued = true;
            queueMicrotask(() => {
                hydrationQueued = false;
                document.querySelectorAll('[data-mp-walking-key]').forEach(node => {
                    node.replaceWith(create(node.dataset.mpWalkingKey, {walking:true}));
                });
            });
        }
        return `<span class="mp-avatar-figure" data-mp-walking-key="${key}" aria-hidden="true"></span>`;
    }
    window.ClassroomAvatars={loadKey,create,canvasImage,markup};
})();
