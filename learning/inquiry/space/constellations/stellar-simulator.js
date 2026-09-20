(function(){
    'use strict';
    const M=window.StellarEvolution;
    function mount(pane){
        pane.classList.add('stellar-lab');
        pane.innerHTML=`<div class="sl-modes" role="group" aria-label="별의 질량"><button type="button" data-sl-mass="sun" aria-pressed="true">태양과 비슷한 질량</button><button type="button" data-sl-mass="massive" aria-pressed="false">질량이 큰 별</button></div>
        <div class="sl-layout"><div class="sl-scene"><canvas aria-label="성운이 수축해 별이 되고 마지막 잔해를 남기는 변화" data-sl-canvas></canvas><div class="sl-scene-label"><span data-sl-phase></span><strong data-sl-stage></strong></div></div>
        <aside class="sl-explanation"><p data-sl-description></p><dl><dt>에너지와 중심부</dt><dd data-sl-energy></dd><dt>관찰할 변화</dt><dd data-sl-change></dd></dl><div class="sl-remnant" hidden><span>마지막 잔해 비교</span><div role="group" aria-label="큰 질량 별의 마지막 잔해"><button type="button" data-sl-remnant="neutron" aria-pressed="true">중성자별</button><button type="button" data-sl-remnant="black-hole" aria-pressed="false">블랙홀</button></div><small>남은 중심핵의 질량 등에 따라 달라지는 대표 경로입니다.</small></div></aside></div>
        <div class="sl-player"><button type="button" data-sl-play>일시정지</button><button type="button" data-sl-reset>처음부터</button><input type="range" min="0" max="1" step=".001" value="0" aria-label="별의 진화 과정" data-sl-progress><label>재생 속도 <select data-sl-speed><option value="0.5">0.5배</option><option value="1" selected>1배</option><option value="2">2배</option></select></label></div>
        <div class="sl-stages" role="group" aria-label="진화 단계로 이동"></div>
        <p class="sl-note">단계를 비교하도록 시간을 압축했습니다. 재생 시간과 그림의 크기는 실제 수명·크기 비율이 아닙니다.</p>`;
        const canvas=pane.querySelector('canvas'),ctx=canvas.getContext('2d');
        const progress=pane.querySelector('[data-sl-progress]'),play=pane.querySelector('[data-sl-play]');
        const content=document.createElement('div');content.className='sl-content';
        Array.from(pane.children).forEach(child=>content.append(child));pane.append(content);
        let mass='sun',remnant='neutron',t=0,speed=1,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
        let last=0,frame=0,prevStage=-1,W=900,H=570;
        let seed=13907;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
        const particles=Array.from({length:520},()=>({a:random()*Math.PI*2,r:Math.sqrt(random()),z:random(),size:1+random()*4,phase:random()*Math.PI*2}));
        const stars=Array.from({length:190},()=>({x:random(),y:random(),r:.3+random()*1.15,a:.2+random()*.6}));
        const sprites=['107,136,255','175,98,231','242,125,62'].map(rgb=>{
            const c=document.createElement('canvas');c.width=c.height=48;const g=c.getContext('2d');const glow=g.createRadialGradient(24,24,0,24,24,24);glow.addColorStop(0,'rgba('+rgb+',.7)');glow.addColorStop(.2,'rgba('+rgb+',.24)');glow.addColorStop(1,'rgba('+rgb+',0)');g.fillStyle=glow;g.fillRect(0,0,48,48);return c;
        });
        // Advected surface texture projected onto a sphere, independent of photo assets.
        const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
        const noise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return (hash(ix,iy)*(1-sx)+hash(ix+1,iy)*sx)*(1-sy)+(hash(ix,iy+1)*(1-sx)+hash(ix+1,iy+1)*sx)*sy;};
        const fbm=(x,y)=>{let sum=0,amp=.55;for(let i=0;i<5;i++){sum+=amp*noise(x,y);x=x*2.07+3.2;y=y*2.03-1.4;amp*=.48;}return sum;};
        const mapW=256,mapH=128,surfaceMap=new Float32Array(mapW*mapH);
        for(let y=0;y<mapH;y++)for(let x=0;x<mapW;x++)surfaceMap[y*mapW+x]=fbm(x/18,y/18);
        const surfaceCanvas=document.createElement('canvas');surfaceCanvas.width=surfaceCanvas.height=200;
        const surfaceCtx=surfaceCanvas.getContext('2d'),surfaceImage=surfaceCtx.createImageData(200,200),sphere=[];
        for(let y=0;y<200;y++)for(let x=0;x<200;x++){const nx=(x-99.5)/100,ny=(y-99.5)/100,d=nx*nx+ny*ny;if(d<=1){const nz=Math.sqrt(1-d);sphere.push({i:(y*200+x)*4,u:(Math.atan2(nx,nz)/Math.PI/2+.5)*mapW,v:Math.floor((Math.asin(ny)/Math.PI+.5)*(mapH-1)),shade:.36+.64*Math.max(0,nz*.9-nx*.22-ny*.32)});}}
        function surface(radius,state){
            const base=state.red>.3?[255,91,30]:state.large&&state.index>=2?[116,204,255]:[255,196,72];
            const shift=Math.floor(t*mapW*4);
            for(const p of sphere){const x=(Math.floor(p.u)+shift)%mapW,n=surfaceMap[p.v*mapW+x];const filaments=Math.pow(Math.max(0,1-Math.abs(n-.51)*9),3);const value=(.46+n*.86+filaments*.37)*p.shade;
                surfaceImage.data[p.i]=Math.min(255,base[0]*value+filaments*28);surfaceImage.data[p.i+1]=Math.min(255,base[1]*value+filaments*40);surfaceImage.data[p.i+2]=Math.min(255,base[2]*value+filaments*25);surfaceImage.data[p.i+3]=255;}
            surfaceCtx.putImageData(surfaceImage,0,0);ctx.drawImage(surfaceCanvas,-radius,-radius,radius*2,radius*2);
        }
        const cloudCanvas=document.createElement('canvas');cloudCanvas.width=cloudCanvas.height=384;
        const cloudCtx=cloudCanvas.getContext('2d'),cloudImage=cloudCtx.createImageData(384,384);
        for(let y=0;y<384;y++)for(let x=0;x<384;x++){const nx=(x-192)/192,ny=(y-192)/192,r=Math.hypot(nx,ny);
            const warp=noise(nx*3+12,ny*3+7)*2;const n=fbm(nx*6+9+warp,ny*6+15-warp),density=Math.max(0,n-.3)*Math.max(0,1-r*r),i=(y*384+x)*4;
            cloudImage.data[i]=90+n*120;cloudImage.data[i+1]=80+n*90;cloudImage.data[i+2]=220;cloudImage.data[i+3]=Math.min(230,density*750);}
        cloudCtx.putImageData(cloudImage,0,0);
        function halo(x,y,r,color,alpha=1){
            if(r<=0||alpha<=0)return;
            const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.3,`rgba(${color},${alpha*.28})`);g.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
        }
        function draw(){
            const state=M.sample(t,mass,remnant),k=Math.min(W/900,H/570),cx=W*.5,cy=H*.47;
            ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#020611';ctx.fillRect(0,0,canvas.width,canvas.height);
            const dpr=canvas.width/W;ctx.setTransform(dpr,0,0,dpr,0,0);
            for(const star of stars){ctx.fillStyle=`rgba(199,216,255,${star.a})`;ctx.beginPath();ctx.arc(star.x*W,star.y*H,star.r,0,7);ctx.fill();}
            ctx.save();ctx.translate(cx,cy);
            const camera=state.index===5?1+M.smooth(state.u)*3:1;
            ctx.scale(k*camera,k*camera);
            if(state.cloud>0){
                ctx.globalCompositeOperation='screen';
                ctx.save();ctx.rotate(t*2.8);ctx.globalAlpha=state.cloud*.72;
                const cloudExtent=state.cloudSize*3.1;ctx.drawImage(cloudCanvas,-cloudExtent/2,-cloudExtent*.38,cloudExtent,cloudExtent*.76);ctx.restore();
                for(const p of particles){const a=p.a+t*12+(1-p.r)*t*8,r=p.r*state.cloudSize;
                    const x=Math.cos(a)*r*1.4,y=Math.sin(a)*r*.77;
                    const size=(24+p.size*10)*(0.4+state.cloud*.6);
                    ctx.globalAlpha=state.cloud*(.18+p.z*.5);ctx.drawImage(sprites[p.z>.5?0:1],x-size/2,y-size/2,size,size);
                }
                ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
            }
            // Material that has left the envelope continues expanding beyond the remnant.
            if(state.index>=4){
                const q=(t-.72)/.28;
                const front=state.giantR+q*(state.large?470:225);
                ctx.globalCompositeOperation='screen';
                for(const p of particles){
                    const travel=state.large?M.smooth(Math.max(0,(q-.08)/.9)):M.smooth(q);
                    const r=state.giantR*(.82+.18*p.r)+travel*(120+420*p.r)*(state.large?1:.65);
                    const a=p.a+.1*q,flatten=state.large?1:.76;
                    const size=(10+p.size*7)*(1+q*.3);
                    ctx.globalAlpha=Math.min(1,q*7)*(.26+p.z*.4)*(1-q*.65);
                    if(state.large&&q>.1){ctx.strokeStyle=p.z>.5?'#fbba77':'#81bfff';ctx.lineWidth=.7+p.size*.25;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+q*(20+p.z*70)),Math.sin(a)*(r+q*(20+p.z*70)));ctx.stroke();}
                    ctx.drawImage(sprites[state.large?(p.z>.6?0:2):(p.z>.5?0:1)],Math.cos(a)*r-size/2,Math.sin(a)*r*flatten-size/2,size,size);
                }
                if(state.large&&q>.08){ctx.globalAlpha=Math.max(0,(1-q))*.7;ctx.strokeStyle='#f9c788';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,front,0,7);ctx.stroke();halo(0,0,Math.max(1,state.burst*280),'255,222,177',state.burst*.8);}
                if(!state.large){ctx.globalAlpha=Math.sin(Math.PI*Math.min(q,1))*.45;ctx.strokeStyle='#88bdfa';ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(0,0,front,front*.72,-.22,0,7);ctx.stroke();}
                ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
            }
            const r=Math.max(.01,state.radius);
            const dead=state.index>=4 && (state.large?state.u>.28||state.index===5:state.u>.55||state.index===5);
            const black=dead&&state.large&&remnant==='black-hole';
            if(black){
                ctx.strokeStyle='rgba(122,153,196,.65)';ctx.lineWidth=1.5;ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,r+5,0,7);ctx.stroke();ctx.setLineDash([]);
                ctx.fillStyle='#000';ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();
            }else{
                const red=state.red,blue=state.large&&state.index>=2&&state.index<4;
                const color=dead?'167,213,255':red>.3?'255,95,32':blue?'102,190,255':'255,177,56';
                halo(0,0,r*2.5+18,color,dead?(state.index===5?.8-state.u*.25:.8):.8);
                const starGradient=ctx.createRadialGradient(-r*.3,-r*.33,Math.max(.01,r*.03),0,0,r);
                starGradient.addColorStop(0,dead?'#fff':red>.3?'#ffce82':blue?'#edfbff':'#fff5bb');
                starGradient.addColorStop(.55,dead?'#cfe9ff':red>.3?'#f66a2d':blue?'#68cafa':'#ffc33e');
                starGradient.addColorStop(1,dead?'#5e9bc4':red>.3?'#9c251f':blue?'#247cbb':'#c16a17');
                ctx.fillStyle=starGradient;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.save();ctx.clip();
                if(r>15){
                    for(let i=0;i<100;i++){const p=particles[i],a=p.a+t*17,rr=p.r*r;
                        const x=Math.cos(a)*rr,y=Math.sin(a)*rr;
                        ctx.strokeStyle=i%2?'rgba(255,242,166,.19)':'rgba(83,24,23,.15)';ctx.lineWidth=1+p.size*.7;
                        ctx.beginPath();ctx.arc(x,y,2+p.z*r*.16,a,a+2.1);ctx.stroke();
                    }
                }
                if(!dead && r>14)surface(r,state);
                ctx.restore();
                if(state.index===2){
                    // Opposing arrows make the stable main-sequence balance visible.
                    const arrow=(angle,inward)=>{const n=r+(inward?35:12),e=r+(inward?12:35),ax=Math.cos(angle),ay=Math.sin(angle);ctx.strokeStyle=inward?'#aab8e9':'#facc73';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(ax*n,ay*n);ctx.lineTo(ax*e,ay*e);const head=inward?1:-1;ctx.moveTo(ax*e,ay*e);ctx.lineTo(ax*(e+head*7)-ay*4,ay*(e+head*7)+ax*4);ctx.moveTo(ax*e,ay*e);ctx.lineTo(ax*(e+head*7)+ay*4,ay*(e+head*7)-ax*4);ctx.stroke();};
                    [0,Math.PI/2,Math.PI,Math.PI*1.5].forEach(a=>arrow(a,true));[Math.PI/4,Math.PI*.75,Math.PI*1.25,Math.PI*1.75].forEach(a=>arrow(a,false));
                    ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillStyle='#b6c4ec';ctx.fillText('중력 ↔ 내부 압력',0,r+68);
                }
            }
            ctx.restore();
            pane.dataset.stellarStage=state.stage.id;pane.dataset.stellarMass=mass;pane.dataset.stellarRemnant=remnant;
            progress.value=String(t);progress.setAttribute('aria-valuetext',state.stage.name);
            if(prevStage!==state.index){prevStage=state.index;updateInfo(state);}
        }
        function updateInfo(state){
            pane.querySelector('[data-sl-phase]').textContent=(state.index+1)+' / 6'+(state.index===5?' · 잔해 확대':'');
            pane.querySelector('[data-sl-stage]').textContent=state.stage.name;
            pane.querySelector('[data-sl-description]').textContent=state.stage.description;
            pane.querySelector('[data-sl-energy]').textContent=state.stage.energy;
            pane.querySelector('[data-sl-change]').textContent=state.stage.change;
            canvas.setAttribute('aria-label',state.stage.name+'. '+state.stage.description);
            pane.querySelectorAll('[data-sl-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.slStep)===state.index)));
        }
        function steps(){
            pane.querySelector('.sl-stages').innerHTML=M.stages(mass,remnant).map((stage,i)=>`<button type="button" data-sl-step="${i}" aria-pressed="false"><small>${i+1}</small>${stage.name}</button>`).join('');
            pane.querySelector('.sl-remnant').hidden=mass!=='massive';
            pane.querySelectorAll('[data-sl-mass]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slMass===mass)));
            pane.querySelectorAll('[data-sl-remnant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slRemnant===remnant)));
            prevStage=-1;
        }
        function active(){return !document.hidden&&document.body.dataset.topicView==='observe'&&pane.style.display!=='none';}
        function buttonState(){play.textContent=playing?'일시정지':t>=1?'다시 재생':'재생';play.setAttribute('aria-pressed',String(playing));}
        function tick(now){frame=0;if(!active()){last=0;return;}if(playing){if(last)t=Math.min(1,t+Math.min((now-last)/1000,.1)*speed/65);last=now;draw();if(t>=1){playing=false;buttonState();}}
            if(playing)frame=requestAnimationFrame(tick);
        }
        function wake(){if(active()){draw();if(playing&&!frame){last=0;frame=requestAnimationFrame(tick);}}else{if(frame)cancelAnimationFrame(frame);frame=0;last=0;}}
        function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width)return;W=rect.width;H=rect.height;const dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);draw();}
        pane.addEventListener('click',event=>{
            const massButton=event.target.closest('[data-sl-mass]'),remnantButton=event.target.closest('[data-sl-remnant]'),step=event.target.closest('[data-sl-step]');
            if(massButton){mass=massButton.dataset.slMass;steps();draw();}
            if(remnantButton){remnant=remnantButton.dataset.slRemnant;steps();draw();}
            if(step){const index=Number(step.dataset.slStep);t=M.bounds[index]+(M.bounds[index+1]-M.bounds[index])*.12;playing=false;buttonState();draw();}
            if(event.target.closest('[data-sl-play]')){if(t>=1)t=0;playing=!playing;buttonState();wake();}
            if(event.target.closest('[data-sl-reset]')){t=0;playing=false;prevStage=-1;buttonState();draw();}
        });
        progress.addEventListener('input',()=>{t=Number(progress.value);playing=false;buttonState();draw();});
        pane.querySelector('[data-sl-speed]').addEventListener('change',event=>{speed=Number(event.target.value);});
        new ResizeObserver(resize).observe(canvas);
        new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['data-topic-view']});
        document.addEventListener('visibilitychange',wake);
        steps();buttonState();resize();wake();
    }
    window.StellarLab={mount};
})();
