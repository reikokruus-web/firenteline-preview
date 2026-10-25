(()=>{const d=document,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const b=d.querySelector('.burger'),n=d.querySelector('nav.main'),h=d.querySelector('header.site');
if(b){const t=o=>{n.classList.toggle('open',o);b.classList.toggle('x',o);d.body.classList.toggle('menu-open',o);b.setAttribute('aria-expanded',o)};
b.addEventListener('click',()=>t(!n.classList.contains('open')));n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>t(false)));
d.addEventListener('keydown',e=>{if(e.key==='Escape')t(false)})}
addEventListener('scroll',()=>h&&h.classList.toggle('scrolled',scrollY>10),{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -40px 0px'});
d.querySelectorAll('.reveal').forEach(el=>rm?el.classList.add('in'):io.observe(el));
d.querySelectorAll('[data-count]').forEach(el=>{const end=+el.dataset.count;if(rm){el.textContent=end;return}
const o=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;o.disconnect();let s;const f=t=>{s=s||t;const p=Math.min((t-s)/1800,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});o.observe(el)});
if(!rm){const px=[...d.querySelectorAll('[data-parallax]')];if(px.length){let tk=false;const u=()=>{px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.transform=`translate3d(0,${(r.top*-(+el.dataset.parallax||.15)).toFixed(1)}px,0)`});tk=false};
addEventListener('scroll',()=>{if(!tk){requestAnimationFrame(u);tk=true}},{passive:true});u()}}
const lb=d.querySelector('.lightbox');if(lb){const items=[...d.querySelectorAll('.gallery a')],img=lb.querySelector('img'),cap=lb.querySelector('.cap');let i=0;
const show=k=>{i=(k+items.length)%items.length;img.src=items[i].href;img.alt=items[i].querySelector('img').alt;cap.textContent=img.alt;lb.classList.add('open');lb.querySelector('.x').focus()};
items.forEach((a,k)=>a.addEventListener('click',e=>{e.preventDefault();show(k)}));
lb.querySelector('.x').onclick=()=>lb.classList.remove('open');lb.querySelector('.pv').onclick=()=>show(i-1);lb.querySelector('.nx').onclick=()=>show(i+1);
lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
d.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)})}
d.querySelectorAll('form.f').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
const L=[...f.querySelectorAll('input,textarea,select')].filter(x=>x.value&&x.type!=='hidden').map(x=>(x.labels[0]?.textContent||x.name)+': '+x.value);
location.href='mailto:info@firenteline.fi?subject='+encodeURIComponent(f.dataset.subject||'Firen Teline')+'&body='+encodeURIComponent(L.join('\n'))}));
})();
