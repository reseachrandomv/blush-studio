// DEMO salon WhatsApp number — replace with the real one (country code, no + or spaces)
const WA = "9600000000";
document.addEventListener("DOMContentLoaded",()=>{
  // mobile nav
  const b=document.querySelector(".burger");
  b&&b.addEventListener("click",()=>{document.body.classList.toggle("menu-open");b.setAttribute("aria-expanded",document.body.classList.contains("menu-open"))});
  document.querySelectorAll(".nav ul a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("menu-open")));
  // active link
  const p=location.pathname.split("/").pop()||"index.html";
  document.querySelectorAll(".nav ul a").forEach(a=>{if(a.getAttribute("href")===p)a.classList.add("active")});
  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  document.querySelectorAll(".wa-link").forEach(a=>a.href=`https://wa.me/${WA}?text=${encodeURIComponent("Hello Blush Studio, I'd like to ask about an appointment.")}`);
  document.querySelectorAll(".year").forEach(y=>y.textContent=new Date().getFullYear());
  // service filter
  const f=document.querySelector(".filters");
  if(f){f.addEventListener("click",e=>{const btn=e.target.closest("button");if(!btn)return;
    f.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===btn));
    const c=btn.dataset.cat;document.querySelectorAll("[data-cat].card").forEach(card=>card.style.display=(c==="all"||card.dataset.cat===c)?"":"none")});}
  initBooking();initContact();
});
function initBooking(){
  const form=document.getElementById("booking");if(!form)return;
  const date=form.date,times=document.getElementById("times");let chosen="";
  const today=new Date();const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
  date.min=iso(today);
  const svc=new URLSearchParams(location.search).get("service");
  if(svc){[...form.service.options].forEach(o=>{if(o.value===svc)o.selected=true})}
  const slots=["10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  function render(){times.innerHTML="";chosen="";
    if(!date.value){times.innerHTML='<small>Pick a date first.</small>';return}
    const d=new Date(date.value+"T00:00");
    if(d.getDay()===5){times.innerHTML='<small>Closed on Fridays (demo hours). Please choose another day.</small>';return}
    const now=new Date();
    slots.forEach(s=>{const bt=document.createElement("button");bt.type="button";bt.textContent=s;
      const [h,m]=s.split(":");const t=new Date(d);t.setHours(h,m);
      if(t<=now)bt.disabled=true;
      bt.onclick=()=>{times.querySelectorAll("button").forEach(x=>x.classList.remove("on"));bt.classList.add("on");chosen=s;err("time","")};
      times.appendChild(bt)});}
  date.addEventListener("change",render);render();
  function err(n,m){const e=form.querySelector(`[data-err="${n}"]`);if(e)e.textContent=m;const i=form[n];if(i&&i.classList)i.classList.toggle("invalid",!!m)}
  form.addEventListener("submit",e=>{e.preventDefault();let ok=true;
    const v=n=>form[n].value.trim();
    if(v("name").length<2){err("name","Please enter your full name.");ok=false}else err("name","");
    if(!/^\+?[0-9\s-]{7,15}$/.test(v("phone"))){err("phone","Enter a valid phone number, e.g. +960 7XX XXXX.");ok=false}else err("phone","");
    if(!v("service")){err("service","Choose a service.");ok=false}else err("service","");
    if(!v("date")){err("date","Choose a date.");ok=false}else if(v("date")<date.min){err("date","Past dates can't be booked.");ok=false}else err("date","");
    if(!chosen){err("time","Choose a time.");ok=false}else err("time","");
    if(!ok)return;
    const data={Name:v("name"),Phone:v("phone"),Service:v("service"),Stylist:v("stylist")||"No preference",Date:new Date(v("date")+"T00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"long",year:"numeric"}),Time:chosen,Notes:v("notes")||"—"};
    const box=document.getElementById("confirm");
    box.querySelector("dl").innerHTML=Object.entries(data).map(([k,x])=>`<dt>${k}</dt><dd>${x.replace(/</g,"&lt;")}</dd>`).join("");
    const msg="New appointment request — Blush Studio\n"+Object.entries(data).map(([k,x])=>`${k}: ${x}`).join("\n");
    box.querySelector(".send-wa").href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    form.style.display="none";box.classList.add("show");box.scrollIntoView({behavior:"smooth",block:"center"});
  });
  document.getElementById("edit").onclick=()=>{form.style.display="";document.getElementById("confirm").classList.remove("show")};
}
function initContact(){
  const form=document.getElementById("contact");if(!form)return;
  form.addEventListener("submit",e=>{e.preventDefault();
    const n=form.cname.value.trim(),m=form.message.value.trim();const er=form.querySelector(".err");
    if(n.length<2||m.length<5){er.textContent="Please add your name and a short message.";return}er.textContent="";
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hello Blush Studio, this is ${n}.\n${m}`)}`,"_blank","noopener");});
}
// ---- v2 motion: scroll progress, parallax, staggered reveals, magnetic buttons, page fade ----
document.addEventListener("DOMContentLoaded",()=>{
  const bar=document.querySelector(".progress"),par=[...document.querySelectorAll("[data-speed]")];
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  let tick=false;const onScroll=()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-innerHeight;bar&&(bar.style.transform=`scaleX(${h>0?scrollY/h:0})`);
    if(!reduce)par.forEach(el=>el.style.translate=`0 ${scrollY*el.dataset.speed}px`);tick=false})};
  addEventListener("scroll",onScroll,{passive:true});onScroll();
  document.querySelectorAll(".grid").forEach(g=>[...g.children].forEach((c,i)=>c.classList.contains("reveal")&&c.classList.add("d"+(i%4))));
  if(matchMedia("(pointer:fine)").matches&&!reduce)document.querySelectorAll(".btn").forEach(b=>{
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
    b.addEventListener("mouseleave",()=>b.style.transform="")});
  document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a||a.target||e.metaKey||e.ctrlKey)return;const h=a.getAttribute("href");
    if(!h||/^(#|http|mailto|tel)/.test(h))return;e.preventDefault();document.body.style.transition="opacity .35s";document.body.style.opacity=0;setTimeout(()=>location.href=h,320)});
  addEventListener("pageshow",e=>{if(e.persisted)document.body.style.opacity=1});
});
