/* Firen Teline v3 interactions + motion layer.
   Progressive enhancement: all content is visible without JS; every effect is skipped for prefers-reduced-motion.
   Heavy effects (smooth scroll, cursor, tilt, pinned horizontal scroll, canvas dust) only on fine-pointer, >900px, non-low-end devices.
   Motion animates transform/opacity (plus one-shot clip-path reveals); all loops run on rAF / the GSAP ticker. */
(()=>{const d=document,de=d.documentElement,W=window,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
FINE=matchMedia('(pointer:fine)').matches&&matchMedia('(hover:hover)').matches,SMALL=matchMedia('(max-width:900px)').matches,
Q=new URLSearchParams(location.search).get('fx'),
SOFT=(()=>{try{const g=d.createElement('canvas').getContext('webgl');if(!g)return true;const e=g.getExtension('WEBGL_debug_renderer_info');const r=e?String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';g.getExtension('WEBGL_lose_context')?.loseContext();return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r)}catch(_){return true}})(),
LOW=Q!=='full'&&((navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<4||!!(navigator.connection&&navigator.connection.saveData)||SOFT),
G=W.gsap,ST=W.ScrollTrigger,FX=!RM&&!!G&&!!ST,MID=FX&&FINE&&!SMALL,RICH=MID&&!LOW;
const $=(s,c=d)=>c.querySelector(s),$$=(s,c=d)=>[...c.querySelectorAll(s)];
if(FX)G.registerPlugin(ST);
if(LOW||SMALL||!FINE)de.classList.add('fx-lite');
/* ---------- split text: words (masked) and optional chars ---------- */
$$('[data-split]').forEach(el=>{let i=0,c=0;const chars=el.dataset.split==='chars';const walk=n=>{[...n.childNodes].forEach(ch=>{if(ch.nodeType===3){const f=d.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(' ');return}const w=d.createElement('span');w.className='w';const s=d.createElement('span');s.style.setProperty('--i',i++);
 if(chars){[...t].forEach(x=>{const k=d.createElement('span');k.className='c';k.textContent=x;k.style.setProperty('--c',c++);s.append(k)});w.setAttribute('aria-hidden','true')}else s.textContent=t;w.append(s);f.append(w)});ch.replaceWith(f)}else if(ch.nodeType===1&&ch.tagName!=='BR')walk(ch)})};
 if(chars)el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());walk(el)});
/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
$$('.reveal,[data-split]').forEach(el=>RM?el.classList.add('in'):io.observe(el));
/* ---------- stat counters ---------- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,to=+el.dataset.count,t0=performance.now(),D=1800;const f=t=>{const k=Math.min(1,(t-t0)/D);el.textContent=Math.round(to*(1-Math.pow(1-k,4)));k<1&&requestAnimationFrame(f)};el.textContent='0';requestAnimationFrame(f)}),{threshold:.6});
if(!RM)$$('[data-count]').forEach(el=>cio.observe(el));
/* ---------- smooth scroll (Lenis, desktop only) ---------- */
let lenis=null;
if(!RM&&W.Lenis&&FINE&&!SMALL){lenis=new W.Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,wheelMultiplier:1});
 if(FX){lenis.on('scroll',ST.update);G.ticker.add(t=>lenis.raf(t*1000));G.ticker.lagSmoothing(0)}else{const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r)}
 d.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href');if(id.length<2)return;const t=d.getElementById(id.slice(1));if(!t)return;e.preventDefault();lenis.scrollTo(t,{offset:-90});history.replaceState(null,'',id)})}
/* ---------- header, progress, fallback parallax + process line ---------- */
const hdr=$('header.site'),par=FX?[]:$$('[data-parallax]'),pl=$('.pline i'),pr=$('.process');let ly=0,tick=false;
const upd=()=>{const y=scrollY,h=de.scrollHeight-innerHeight;de.style.setProperty('--p',h>0?y/h:0);
 hdr.classList.toggle('scrolled',y>40);hdr.classList.toggle('hide',y>ly&&y>400&&!d.body.classList.contains('menu-open'));ly=y;
 if(!RM){par.forEach(p=>{const r=p.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;p.style.transform=`translate3d(0,${(r.top+r.height/2-innerHeight/2)*-(+p.dataset.parallax)}px,0)`});
 if(pl&&pr&&!pr.closest('.hs-on')){const r=pr.getBoundingClientRect();pl.parentElement.style.setProperty('--pp',Math.max(0,Math.min(1,(innerHeight*.8-r.top)/(r.height+innerHeight*.3))))}}
 tick=false};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
/* ---------- menu ---------- */
const bg=$('.burger'),mn=$('#menu');if(mn)mn.setAttribute('data-lenis-prevent','');
bg&&bg.addEventListener('click',()=>{const o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);d.body.classList.toggle('menu-open',o);lenis&&(o?lenis.stop():lenis.start());if(o){mn.hidden=false;requestAnimationFrame(()=>mn.classList.add('open'))}else{mn.classList.remove('open');setTimeout(()=>{if(bg.getAttribute('aria-expanded')!=='true')mn.hidden=true},RM?0:700)}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&bg&&bg.getAttribute('aria-expanded')==='true')bg.click()});
/* ---------- mobile action bar ---------- */
const ab=$('.actionbar');if(ab){const vis=new Set();const o=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));ab.classList.toggle('off',vis.size>0)});$$('form,.f-cta,.hero .ctas').forEach(x=>o.observe(x))}
/* ---------- lightbox ---------- */
const lb=$('.lightbox');if(lb){lb.setAttribute('data-lenis-prevent','');const items=$$('.gallery a'),im=$('img',lb),cap=$('.cap',lb);let k=0;const show=i=>{k=(i+items.length)%items.length;const a=items[k],ii=$('img',a);im.src=a.getAttribute('href');im.alt=ii.alt;cap.textContent=ii.alt};
const close=()=>{lb.hidden=true;lenis&&lenis.start()};
items.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();show(i);lb.hidden=false;lenis&&lenis.stop();$('.x',lb).focus()}));
$('.x',lb).onclick=close;$('.pv',lb).onclick=()=>show(k-1);$('.nx2',lb).onclick=()=>show(k+1);lb.addEventListener('click',e=>{if(e.target===lb)close()});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(k-1);if(e.key==='ArrowRight')show(k+1)})}
/* ---------- forms -> mailto (draft site) ---------- */
$$('form[data-subject]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const lines=$$('input,textarea,select',f).filter(x=>x.value&&!/^- /.test(x.value)).map(x=>{const l=f.querySelector(`label[for="${x.id}"]`);return`${l?l.textContent:x.name}: ${x.value}`});location.href=`mailto:info@firenteline.fi?subject=${encodeURIComponent(f.dataset.subject)}&body=${encodeURIComponent(lines.join('\n'))}`}));
/* ---------- page transition fallback (browsers without cross-document View Transitions) ---------- */
if(!RM&&!('onpagereveal' in W)){d.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0||a.target||a.hasAttribute('download'))return;const u=new URL(a.href,location.href);
 if(u.origin!==location.origin||!/\.html$|\/$/.test(u.pathname)||(u.pathname===location.pathname&&u.hash))return;e.preventDefault();d.body.classList.add('leaving');setTimeout(()=>location.href=u.href,460)});
 addEventListener('pageshow',()=>d.body.classList.remove('leaving'))}
if(!FX){if(!RM)$$('.mag').forEach(b=>{if(!FINE)return;b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});return}
/* =================== GSAP + ScrollTrigger effects =================== */
/* hero depth layers (media, blueprint grid, copy move at different rates) */
$$('.hero').forEach(h=>{$$('[data-depth]',h).forEach(el=>{const k=+el.dataset.depth;G.to(el,{yPercent:k*16,opacity:k<0?.15:1,ease:'none',scrollTrigger:{trigger:h,start:'top top',end:'bottom top',scrub:true}})})});
/* background parallax bands (jobs, CTA) */
$$('[data-parallax]').forEach(p=>G.fromTo(p,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:p.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
/* pinned horizontal process (wide desktop) */
const hs=[];
if(MID&&innerWidth>1100)$$('[data-hscroll]').forEach(sec=>{sec.classList.add('hs-on');const view=$('.hs-view',sec),track=$('.process',view),line=$('.pline i',sec);
 if(line){view.append(line.parentElement)}
 const dist=()=>Math.max(0,track.scrollWidth-innerWidth),fit=sec.offsetHeight<=innerHeight+2;
 const tw=G.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:fit?sec:view,start:fit?'top top':'center center',end:()=>'+='+dist(),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:s=>line&&G.set(line,{scaleX:s.progress})}});
 hs.push(tw);
 $$('.step',track).forEach(st=>{const img=$('.step-img img',st);if(img){G.set(img,{scale:1.18});G.fromTo(img,{xPercent:-7},{xPercent:7,ease:'none',scrollTrigger:{trigger:st,containerAnimation:tw,start:'left right',end:'right left',scrub:true}})}
  const n=$('.step-n',st);n&&G.fromTo(n,{xPercent:40},{xPercent:-40,ease:'none',scrollTrigger:{trigger:st,containerAnimation:tw,start:'left right',end:'right left',scrub:true}})})});
/* clip-path mask reveals for imagery */
$$('.frame,.card .img,.g,.mapcard'+(hs.length?'':',.step-img')).forEach(el=>{const img=$('img',el);
 G.set(el,{clipPath:'inset(14% 8% 14% 8% round 0.6rem)'});img&&G.set(img,{scale:1.25,transition:'none'});
 ST.create({trigger:el,start:'top 90%',once:true,onEnter:()=>{G.to(el,{clipPath:'inset(0% 0% 0% 0% round 0.375rem)',duration:1.5,ease:'expo.out',onComplete:()=>G.set(el,{clearProps:'clipPath'})});img&&G.to(img,{scale:1,duration:1.8,ease:'expo.out',onComplete:()=>G.set(img,{clearProps:'transform,transition'})})}})});
/* inner-image parallax in frames and gallery (desktop) */
if(MID)$$('.frame picture,.g picture').forEach(p=>G.fromTo(p,{yPercent:-5,scale:1.12},{yPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:p.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
/* infinite services marquee, reacts to scroll velocity + direction */
$$('.band-t').forEach(t=>{t.style.animation='none';const tw=G.to(t,{xPercent:-33.333,duration:38,ease:'none',repeat:-1});tw.totalTime(380);
 const sk=G.quickTo(t,'skewX',{duration:.4,ease:'power3'});let boost=0,dir=1;
 ST.create({trigger:t.parentElement,start:'top bottom',end:'bottom top',onUpdate:s=>{dir=s.direction;boost=Math.min(5,Math.abs(s.getVelocity())/320)},onToggle:s=>s.isActive?tw.play():tw.pause()});
 G.ticker.add(()=>{if(tw.paused())return;boost*=.93;tw.timeScale(dir*(1+boost));sk(-dir*Math.min(8,boost*2))})});
/* fine-pointer effects: cursor, magnetic buttons, image tilt */
if(MID){de.classList.add('has-cursor');const cur=$('.cursor'),dot=$('.cur-dot',cur),ring=$('.cur-ring',cur),lab=$('em',ring);
 const dx=G.quickTo(dot,'x',{duration:.12,ease:'power3'}),dy=G.quickTo(dot,'y',{duration:.12,ease:'power3'}),rx=G.quickTo(ring,'x',{duration:.5,ease:'power3'}),ry=G.quickTo(ring,'y',{duration:.5,ease:'power3'});
 addEventListener('pointermove',e=>{dx(e.clientX);dy(e.clientY);rx(e.clientX);ry(e.clientY);de.classList.remove('cur-hide')},{passive:true});
 d.addEventListener('pointerleave',()=>de.classList.add('cur-hide'));
 d.addEventListener('pointerover',e=>{const m=e.target.closest('[data-cur]'),l=e.target.closest('a,button,summary,label,.mag');de.classList.toggle('cur-media',!!m);de.classList.toggle('cur-link',!m&&!!l);lab.textContent=m?m.dataset.cur:''});
 $$('.mag').forEach(b=>{const s=b.querySelector('span'),bx=G.quickTo(b,'x',{duration:.6,ease:'elastic.out(1,.4)'}),by=G.quickTo(b,'y',{duration:.6,ease:'elastic.out(1,.4)'}),sx=s&&G.quickTo(s,'x',{duration:.6,ease:'elastic.out(1,.4)'}),sy=s&&G.quickTo(s,'y',{duration:.6,ease:'elastic.out(1,.4)'});
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(),mx=e.clientX-r.left-r.width/2,my=e.clientY-r.top-r.height/2;bx(mx*.22);by(my*.35);if(s){sx(mx*.1);sy(my*.15)}});
  b.addEventListener('pointerleave',()=>{bx(0);by(0);if(s){sx(0);sy(0)}})});
 $$('.card .img,.frame,.g').forEach(box=>{const t=$('picture',box)||box;G.set(t,{transformPerspective:900});const r1=G.quickTo(t,'rotationY',{duration:.6,ease:'power3'}),r2=G.quickTo(t,'rotationX',{duration:.6,ease:'power3'}),A=4;
  box.addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();r1(((e.clientX-r.left)/r.width-.5)*A*2);r2(-((e.clientY-r.top)/r.height-.5)*A*2)});box.addEventListener('pointerleave',()=>{r1(0);r2(0)})});
}
/* hero particle dust (canvas, procedural; paused offscreen, auto-disables if it cannot hold ~60fps) */
const cv=$('.hero .dust');if(cv&&RICH){const cx=cv.getContext('2d'),hero=cv.closest('.hero');let w=0,h=0,dpr=Math.min(2,devicePixelRatio||1),on=true,mx=.5,my=.5,slow=0,frames=0;
 const P=Array.from({length:70},()=>({x:Math.random(),y:Math.random(),z:.3+Math.random()*.7,s:.4+Math.random()*1.6,a:Math.random()*6.28}));
 const size=()=>{w=cv.clientWidth;h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;cx.setTransform(dpr,0,0,dpr,0,0)};size();addEventListener('resize',size);
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height},{passive:true});
 new IntersectionObserver(es=>{on=es[0].isIntersecting}).observe(hero);
 const step=(t,dt)=>{if(!on||d.hidden)return;frames++;if(dt>24)slow++;if(frames>120&&slow/frames>.35){G.ticker.remove(step);cv.remove();return}
  cx.clearRect(0,0,w,h);for(const p of P){p.y-=.00012*p.z*Math.min(dt,40);p.a+=.01;if(p.y<-.02){p.y=1.02;p.x=Math.random()}
   const X=(p.x+(mx-.5)*.03*p.z)*w+Math.sin(p.a)*6*p.z,Y=(p.y+(my-.5)*.02*p.z)*h,al=.25+.45*p.z*(.6+.4*Math.sin(p.a*1.7));
   cx.fillStyle=p.z>.85?`rgba(255,120,80,${al})`:`rgba(255,226,205,${al*.8})`;cx.beginPath();cx.arc(X,Y,p.s*p.z,0,6.283);cx.fill()}};
 G.ticker.add(step)}
addEventListener('load',()=>ST.refresh());d.fonts&&d.fonts.ready.then(()=>ST.refresh());
})();
