/* Diagram labels share the same screen coordinate system as their target parts. */
(function (root) {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg', views = [];
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function overlaps(a, b) {
        return Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 7 &&
            Math.abs(a.y - b.y) < (a.h + b.h) / 2 + 7;
    }
    function arrange(items, width, height) {
        var placed = [];
        items.forEach(function (item) {
            var best, cost = Infinity;
            for (var ring = 0; ring < 12; ring++) {
                var offsets = ring === 0 ? [[0, 0]] : [[0,-ring*32],[0,ring*32],[-ring*30,0],[ring*30,0],[-ring*25,-ring*25],[ring*25,ring*25]];
                offsets.forEach(function (offset) {
                    var c = { x: clamp(item.x + offset[0], item.w/2+5, width-item.w/2-5),
                        y: clamp(item.y + offset[1], item.h/2+5, height-item.h/2-5), w:item.w,h:item.h };
                    var collision = placed.filter(function (p) { return overlaps(c,p); }).length;
                    var d = Math.pow(c.x-item.x,2) + Math.pow(c.y-item.y,2);
                    var score = collision * 1e7 + d;
                    if(score < cost) { cost = score; best=c; }
                });
                if(cost < 1e7) break;
            }
            placed.push(best);
        });
        return placed;
    }
    function svgPoint(svg, x, y, matrix) {
        var p = svg.createSVGPoint(); p.x=x; p.y=y;
        return p.matrixTransform(matrix);
    }
    function update(view) {
        var svg = view.svg, box=view.box, bounds=box.getBoundingClientRect();
        if (!bounds.width || !bounds.height || svg.closest('[hidden]')) return;
        var matrix=svg.getScreenCTM(); if(!matrix)return;
        var items=[];
        view.records.forEach(function (r) {
            var item=r.item, target=svg.querySelector('#'+item.id);
            if(!target || !target.getScreenCTM())return;
            var b=target.getBBox();
            var cx=b.x+b.width*(item.fx === undefined ? .5 : clamp(item.fx,0,1));
            var cy=b.y+b.height*(item.fy === undefined ? .5 : clamp(item.fy,0,1));
            var pathPoint = item.pathAt !== undefined && target.getPointAtLength ?
                target.getPointAtLength(target.getTotalLength() * item.pathAt) : null;
            var point = item.sx !== undefined || item.sy !== undefined ?
                svgPoint(svg,item.sx === undefined ? cx : item.sx,item.sy === undefined ? cy : item.sy,matrix) :
                svgPoint(svg,pathPoint ? pathPoint.x : cx,pathPoint ? pathPoint.y : cy,target.getScreenCTM());
            var anchor = item.ax !== undefined || item.ay !== undefined ?
                svgPoint(svg,item.ax === undefined ? cx : item.ax,item.ay === undefined ? cy : item.ay,matrix) : point;
            r.tag.style.maxWidth = Math.min(210,Math.max(104,bounds.width*.28))+'px';
            var tr=r.tag.getBoundingClientRect();
            r.point=point;
            items.push({ x:anchor.x-bounds.left,y:anchor.y-bounds.top,w:tr.width,h:tr.height,record:r });
        });
        var positions=arrange(items,bounds.width,bounds.height);
        positions.forEach(function (p,i) {
            var r=items[i].record, target=r.point;
            r.tag.style.left=p.x+'px'; r.tag.style.top=p.y+'px';
            var dx=target.x-bounds.left-p.x, dy=target.y-bounds.top-p.y;
            var edge=Math.max(Math.abs(dx)/(p.w/2+3), Math.abs(dy)/(p.h/2+3),1);
            var end=svgPoint(svg,bounds.left+p.x+dx/edge,bounds.top+p.y+dy/edge,matrix.inverse());
            var start=svgPoint(svg,target.x,target.y,matrix.inverse());
            r.line.setAttribute('x1',start.x);r.line.setAttribute('y1',start.y);
            r.line.setAttribute('x2',end.x);r.line.setAttribute('y2',end.y);
            r.line.setAttribute('visibility',edge<=1 ? 'hidden':'visible');
            r.dot.setAttribute('cx',start.x);r.dot.setAttribute('cy',start.y);
            r.dot.setAttribute('visibility',edge<=1 ? 'hidden':'visible');
        });
    }
    function render(svg,box,items,options) {
        if(!svg||!box)return;
        options=options||{};
        var view=views.filter(function(v){return v.box===box;})[0];
        if(!view){view={svg:svg,box:box,records:[]};views.push(view);}
        var g=options.leaders || svg.querySelector('[data-diagram-leaders]');
        if(!g){g=document.createElementNS(NS,'g');svg.appendChild(g);}
        g.setAttribute('data-diagram-leaders','');g.style.pointerEvents='none';
        g.replaceChildren();box.replaceChildren();view.records=[];
        items.forEach(function(item) {
            if(options.filter && !options.filter(item))return;
            if(!svg.querySelector('#'+item.id))return;
            var tag=document.createElement('span');
            tag.className=options.className+' body-diagram-label'+(item.sym===undefined && options.trunks ? ' trunk':'');
            tag.dataset.for=item.id;tag.textContent=options.text?options.text(item):item.text;
            tag.setAttribute('role','button');tag.tabIndex=0;
            function select(){if(options.select)options.select(item);}
            tag.addEventListener('click',select);
            tag.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
            box.appendChild(tag);
            var line=document.createElementNS(NS,'line');
            line.setAttribute('stroke','#a8becd');line.setAttribute('stroke-width','1.2');
            line.setAttribute('vector-effect','non-scaling-stroke');line.dataset.leaderFor=item.id;
            var dot=document.createElementNS(NS,'circle');
            dot.setAttribute('r','3');dot.setAttribute('fill','#c5dbe8');dot.dataset.leaderDot=item.id;
            g.appendChild(line);g.appendChild(dot);
            view.records.push({item:item,tag:tag,line:line,dot:dot});
        });
        update(view);
    }
    var api={render:render,arrange:arrange};
    if(typeof module!=='undefined'&&module.exports)module.exports=api;
    else {
        root.BodyDiagramLabels=api;
        // Layout changes and animated transforms are followed without recreating click targets.
        function frame(){views.forEach(update);requestAnimationFrame(frame);}
        requestAnimationFrame(frame);
    }
})(typeof window!=='undefined'?window:globalThis);

