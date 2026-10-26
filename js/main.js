/* Firen Teline v2 interactions — progressive enhancement; all motion respects prefers-reduced-motion */
(()=>{const d=document,de=d.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
const $=(s,c=d)=>c.querySelector(s),$$=(s,c=d)=>[...c.querySelectorAll(s)];
/* split headings into words (keeps inline markup like <em>) */
$$('[data-split]').forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=d.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(' ');return}const w=d.createElement('span');w.className='w';const s=d.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.append(s);f.append(w)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(el)});
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
$$('.reveal,[data-split]').forEach(el=>RM?el.classList.add('in'):io.observe(el));
/* count-up */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,to=+el.dataset.count,t0=performance.now(),D=1600;const f=t=>{const k=Math.min(1,(t-t0)/D);el.textContent=Math.round(to*(1-Math.pow(1-k,4)));k<1&&requestAnimationFrame(f)};el.textContent='0';requestAnimationFrame(f)}),{threshold:.6});
if(!RM)$$('[data-count]').forEach(el=>cio.observe(el));
/* header hide/show, progress, parallax, process line */
const hdr=$('header.site'),par=$$('[data-parallax]'),pl=$('.pline i'),pr=$('.process');let ly=0,tick=false;
const upd=()=>{const y=scrollY,h=de.scrollHeight-innerHeight;de.style.setProperty('--p',h>0?y/h:0);
 hdr.classList.toggle('scrolled',y>40);hdr.classList.toggle('hide',y>ly&&y>400&&!d.body.classList.contains('menu-open'));ly=y;
 if(!RM){par.forEach(p=>{const r=p.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;p.style.transform=`translate3d(0,${(r.top+r.height/2-innerHeight/2)*-(+p.dataset.parallax)}px,0)`});
 if(pl&&pr){const r=pr.getBoundingClientRect();pl.parentElement.style.setProperty('--pp',Math.max(0,Math.min(1,(innerHeight*.8-r.top)/(r.height+innerHeight*.3))))}}
 tick=false};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
/* menu */
const bg=$('.burger'),mn=$('#menu');bg&&bg.addEventListener('click',()=>{const o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);d.body.classList.toggle('menu-open',o);if(o){mn.hidden=false;requestAnimationFrame(()=>mn.classList.add('open'))}else{mn.classList.remove('open');setTimeout(()=>{if(bg.getAttribute('aria-expanded')!=='true')mn.hidden=true},RM?0:700)}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&bg&&bg.getAttribute('aria-expanded')==='true')bg.click()});
/* magnetic buttons (fine pointers only) */
if(FINE&&!RM)$$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
/* mobile action bar hides over forms/footer CTA */
const ab=$('.actionbar');if(ab){const vis=new Set();const o=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));ab.classList.toggle('off',vis.size>0)});$$('form,.f-cta,.hero .ctas').forEach(x=>o.observe(x))}
/* lightbox */
const lb=$('.lightbox');if(lb){const items=$$('.gallery a'),im=$('img',lb),cap=$('.cap',lb);let k=0;const show=i=>{k=(i+items.length)%items.length;const a=items[k],ii=$('img',a);im.src=a.getAttribute('href');im.alt=ii.alt;cap.textContent=ii.alt};
items.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();show(i);lb.hidden=false;$('.x',lb).focus()}));
$('.x',lb).onclick=()=>lb.hidden=true;$('.pv',lb).onclick=()=>show(k-1);$('.nx2',lb).onclick=()=>show(k+1);lb.addEventListener('click',e=>{if(e.target===lb)lb.hidden=true});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')lb.hidden=true;if(e.key==='ArrowLeft')show(k-1);if(e.key==='ArrowRight')show(k+1)})}
/* forms -> mailto (draft site) */
$$('form[data-subject]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const lines=$$('input,textarea,select',f).filter(x=>x.value&&!/^- /.test(x.value)).map(x=>{const l=f.querySelector(`label[for="${x.id}"]`);return`${l?l.textContent:x.name}: ${x.value}`});location.href=`mailto:info@firenteline.fi?subject=${encodeURIComponent(f.dataset.subject)}&body=${encodeURIComponent(lines.join('\n'))}`}));
})();
