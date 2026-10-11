/* Shared, authored textbook illustrations. No question answers are inserted here. */
(function () {
    'use strict';
    const registry = new Map();
    const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const C = {blue:'#276f9b',red:'#af473d',teal:'#247572',gold:'#ad741c',purple:'#795a9b',ink:'#283c44',muted:'#627278'};
    const text = (x,y,s,anchor='middle',color=C.ink,size=22) => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}">${esc(s)}</text>`;
    const path = (d,stroke=C.ink,fill='none',width=2) => `<path d="${d}" stroke="${stroke}" fill="${fill}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
    const circle = (x,y,r,fill,stroke='none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    const rect = (x,y,w,h,fill='#e6eee8',stroke='#789191') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    function arrow(x,y,tx,ty,color=C.teal,width=3) {
        const a=Math.atan2(ty-y,tx-x),u=Math.cos(a),v=Math.sin(a);
        return path(`M${x} ${y}L${tx} ${ty}`,color,'none',width)+path(`M${tx-11*u+6*v} ${ty-11*v-6*u}L${tx} ${ty}L${tx-11*u-6*v} ${ty-11*v+6*u}`,color,'none',width);
    }
    const svg = (label,body,height=300,width=480) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
    const flow = (nodes,label='이동 순서') => `<ol class="lv-flow" aria-label="${esc(label)}">${nodes.map((s,i)=>`<li><span>${esc(s)}</span>${i<nodes.length-1?'<b aria-hidden="true">→</b>':''}</li>`).join('')}</ol>`;
    const compare = items => `<div class="lv-compare">${items.map(([title,body])=>`<div><h4>${esc(title)}</h4>${body}</div>`).join('')}</div>`;
    const note = s => `<p class="lv-note">${esc(s)}</p>`;
    function figure(id,title,graphic,caption,section=0) { return {id,title,graphic,caption,section}; }
    function markup(key,level) {
        return (registry.get(key)?.(level)||[]).map(f=>({...f,html:`<figure class="lesson-visual" data-visual="${esc(f.id)}"><h3>${esc(f.title)}</h3>${f.graphic}<figcaption>${esc(f.caption)}</figcaption></figure>`}));
    }
    function decorate(host,key,level) {
        host.querySelectorAll('.lesson-visual').forEach(e=>e.remove());
        const sections=host.querySelectorAll('.school-concepts');
        for(const f of markup(key,level).reverse()) {
            const section=sections[f.section]||sections[0];
            const heading=section?.querySelector('h2');
            if(heading)heading.insertAdjacentHTML('afterend',f.html);
            else section?.insertAdjacentHTML('afterbegin',f.html);
        }
    }
    window.LessonVisuals={define:(key,fn)=>registry.set(key,fn),keys:()=>[...registry.keys()],markup,decorate,
        esc,C,text,path,circle,rect,arrow,svg,flow,compare,note,figure};
})();
