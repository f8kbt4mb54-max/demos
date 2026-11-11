(()=>{
/* ====== CONFIG ======
   PLACEHOLDER: numero WhatsApp NON confermato.
   Sul sito attuale compare "+39 328 588856" (9 cifre: probabilmente incompleto).
   Inserire il numero corretto in formato internazionale senza "+", es. "393xxxxxxxxx".
   Finché resta vuoto, WhatsApp si apre con il messaggio già scritto e l'utente sceglie il contatto. */
const WHATSAPP_NUMBER = ""; // PLACEHOLDER
const EMAIL = "info@cesaremagli.it";
const root=document.documentElement; root.classList.remove('nojs');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

/* language */
function paintDate(){const el=$('#today');if(el)el.textContent=new Date().toLocaleDateString(root.lang==='en'?'en-GB':'it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
function setLang(l){if(l!=='en')l='it';root.dataset.lang=l;root.lang=l;
  $$('[data-set-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setLang===l)));
  $$('option[data-it]').forEach(o=>o.textContent=o.dataset[l]);
  try{localStorage.setItem('cm-lang',l)}catch(e){}; paintDate(); waLinks()}
$$('[data-set-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.setLang)));

/* whatsapp */
const waUrl=t=>(WHATSAPP_NUMBER?`https://wa.me/${WHATSAPP_NUMBER}`:'https://wa.me/')+`?text=${encodeURIComponent(t)}`;
function waLinks(){const t=root.lang==='en'?"Hello, I'd like information about availability at Cesare Magli & Figli.":'Buongiorno, vorrei informazioni sulla disponibilità presso Cesare Magli & Figli.';
  $$('.js-wa').forEach(a=>{a.href=waUrl(t);a.target='_blank';a.rel='noopener'})}

let saved=null;try{saved=localStorage.getItem('cm-lang')}catch(e){}
setLang(new URLSearchParams(location.search).get('lang')||saved||'it');

/* reveal on scroll */
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.06});
  $$('.rv,.rv-img,.tl,.leaf,#compass').forEach(el=>io.observe(el));
}else $$('.rv,.rv-img,.tl,.leaf,#compass').forEach(el=>el.classList.add('in'));

/* hero arch, header, dock, parallax */
const hero=$('#hero'),arch=$('#arch'),cap=$('#heroCap'),bar=$('#bar'),dock=$('#dock');
const stripes=$$('.stripes'),shapes=$$('[data-par]');let ticking=false;
function frame(){ticking=false;const vh=innerHeight,y=scrollY;
  const r=hero.getBoundingClientRect(),total=Math.max(1,hero.offsetHeight-vh);
  const p=reduce?1:Math.min(1,Math.max(0,(-r.top+vh*.15)/(total*.7)));
  arch.style.setProperty('--p',p.toFixed(4));
  cap.classList.toggle('on',p>.8);
  bar.classList.toggle('show',r.bottom<vh*.9);
  dock.classList.toggle('show',y>vh*.35);
  if(!reduce){
    stripes.forEach(s=>{const b=s.parentElement.getBoundingClientRect();if(b.bottom>0&&b.top<vh)s.style.setProperty('--x',(b.top*.3*s.dataset.run).toFixed(1)+'px')});
    shapes.forEach(s=>{const b=s.parentElement.getBoundingClientRect();if(b.bottom>0&&b.top<vh)s.style.transform=`translateY(${(b.top*s.dataset.par).toFixed(1)}px)`});
  }}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
addEventListener('resize',frame);frame();

/* index hover preview (desktop only) */
const peek=$('#peek'),pimg=peek&&peek.querySelector('img');
if(peek&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('#toc a').forEach(a=>{a.addEventListener('mouseenter',()=>{pimg.src=a.dataset.img;peek.classList.add('on')});a.addEventListener('mouseleave',()=>peek.classList.remove('on'))});
  addEventListener('mousemove',e=>{peek.style.left=Math.min(innerWidth-150,e.clientX+180)+'px';peek.style.top=e.clientY+'px'},{passive:true});
}

/* chapter bookmark */
const chs=$$('.ch'),bm=$('#bm'),roman=['I','II','III','IV','V','VI','VII','VIII'];
chs.forEach((c,i)=>{const a=document.createElement('a');a.href='#'+c.id;a.innerHTML=`<span>${roman[i]} · ${c.dataset.room}</span>`;a.setAttribute('aria-label',`${roman[i]}: ${c.dataset.room}`);bm.appendChild(a)});
let active=-1;
function bmUpdate(){const mid=innerHeight/2;let idx=-1;chs.forEach((c,i)=>{const b=c.getBoundingClientRect();if(b.top<=mid&&b.bottom>mid)idx=i});
  if(idx!==active){active=idx;[...bm.children].forEach((a,j)=>a.classList.toggle('on',j===idx));bm.classList.toggle('show',idx>=0);if(idx>=0)bm.style.setProperty('--bmc',chs[idx].dataset.bmc)}}
addEventListener('scroll',()=>requestAnimationFrame(bmUpdate),{passive:true});bmUpdate();

/* booking request */
const form=$('#req'),room=$('#room'),din=$('#din'),dout=$('#dout');
const iso=d=>d.toISOString().slice(0,10),today=iso(new Date());
din.min=today;dout.min=today;
din.addEventListener('change',()=>{if(din.value){const n=new Date(din.value+'T12:00');n.setDate(n.getDate()+1);dout.min=iso(n);if(!dout.value||dout.value<=din.value)dout.value=iso(n)}});
$$('[data-pick]').forEach(b=>b.addEventListener('click',()=>{room.value=b.dataset.pick;$('#prenota').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(()=>room.focus({preventScroll:true}),reduce?0:800)}));
const fmt=v=>v?new Date(v+'T12:00').toLocaleDateString(root.lang==='en'?'en-GB':'it-IT',{day:'numeric',month:'long',year:'numeric'}):'—';
function msg(){const f=new FormData(form),en=root.lang==='en',r=f.get('room')||(en?'any room':'qualsiasi camera');
  const L=en?['Hello, I would like to check availability at Cesare Magli & Figli.','Room','Arrival','Departure','Guests','Notes','Name']:['Buongiorno, vorrei sapere la disponibilità presso Cesare Magli & Figli.','Camera','Arrivo','Partenza','Ospiti','Note','Nome'];
  let t=`${L[0]}\n${L[1]}: ${r}\n${L[2]}: ${fmt(f.get('in'))}\n${L[3]}: ${fmt(f.get('out'))}\n${L[4]}: ${f.get('guests')}`;
  if(f.get('note'))t+=`\n${L[5]}: ${f.get('note')}`; if(f.get('name'))t+=`\n${L[6]}: ${f.get('name')}`; return t}
$('[data-send="mail"]').addEventListener('click',()=>{const s=(root.lang==='en'?'Availability request':'Richiesta disponibilità')+(room.value?' – '+room.value:'');location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(msg())}`});
$('[data-send="wa"]').addEventListener('click',()=>window.open(waUrl(msg()),'_blank','noopener'));
})();
