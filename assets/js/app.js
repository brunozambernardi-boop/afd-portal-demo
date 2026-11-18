(function(){
"use strict";
const D=window.AFD_DATA, R=window.AFD_ROUTES, app=document.getElementById('app');
const NOW=Date.now(), TZ='America/Chicago';
const C={yellow:'#ffc21a',orange:'#ff8a3d',blue:'#2b8be0',light:'#6cbcf2',green:'#38d39f',fg:'#c9d6e3'};
const STATUS={
  transit:{label:'In transit',c:C.yellow,live:1}, parked:{label:'Parked overnight',c:C.orange},
  loaded:{label:'Loaded · departs soon',c:C.blue}, permits:{label:'Permits in progress',c:C.light},
  yard:{label:'Stored at Big Spring',c:C.fg}, delivered:{label:'Delivered',c:C.green}
};
const I={
 arrow:'<svg class="arr" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h15M11 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 back:'<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M17 6H2M7 1 2 6l5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 check:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 6h13v9H1zM15 9h4l3 3.5V15h-7z"/><circle cx="5" cy="17" r="2" fill="currentColor"/><circle cx="12" cy="17" r="2" fill="currentColor"/><circle cx="19" cy="17" r="2" fill="currentColor"/></svg>',
 phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
 mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 5h18v14H3z"/><path fill="none" stroke="currentColor" stroke-width="2" d="m3 6 9 7 9-7"/></svg>',
 pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>',
 cam:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
 doc:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 3h8l4 4v14H6z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M9 12h6M9 16h6"/></svg>',
 fuel:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M6 8h6M14 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
 park:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="2" d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
 shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path fill="none" stroke="currentColor" stroke-width="2" d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
 car:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 16v-4l2-5h14l2 5v4zM3 16v2M21 16v2"/><circle cx="7.5" cy="13" r="1.3" fill="currentColor"/><circle cx="16.5" cy="13" r="1.3" fill="currentColor"/></svg>',
 go:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 12h13M12 6l6 6-6 6M20 4v16"/></svg>',
 flag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
 share:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="19" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" stroke-width="1.8" d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
 search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2"/></svg>',
 warn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3 2 20h20z"/><path stroke="currentColor" stroke-width="2" d="M12 10v4M12 16.5v1.5"/></svg>',
 quote:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path stroke="currentColor" stroke-width="1.8" d="M9 8h6M9 12h6"/></svg>',
 yard:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 21V9l9-5 9 5v12M7 21v-7h10v7"/></svg>'
};
const EV={ping:['truck',C.yellow],fuel:['fuel',C.orange],park:['park',C.orange],check:['shield',C.green],escort:['car',C.light],depart:['go',C.light],photo:['cam',C.light],doc:['doc',C.light],load:['check',C.green],yard:['yard',C.fg],done:['flag',C.green],quote:['quote',C.fg]};
let cleanup=[];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=s=>document.querySelector(s);
const store={get:(k,d)=>{try{const v=localStorage.getItem('afd_'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:(k,v)=>{try{localStorage.setItem('afd_'+k,JSON.stringify(v));}catch(e){}}};
const signedIn=()=>sessionStorage.getItem('afd_demo')==='1';
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2800);}
const L_=id=>D.loads.find(l=>l.id===id);
const photo=k=>{const p=D.photos[k];return {src:'assets/img/'+p[0],w:p[1],h:p[2]};};

/* ——— time ——— */
const at=h=>new Date(NOW+h*3600e3);
const dayKey=d=>d.toLocaleDateString('en-US',{timeZone:TZ});
function fmtTime(d){return d.toLocaleTimeString('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'});}
function fmtDay(h){const d=at(h);return d.toLocaleDateString('en-US',{timeZone:TZ,weekday:'short',month:'short',day:'numeric'});}
function rel(h){const d=at(h),k=dayKey(d),t=dayKey(new Date(NOW)),y=dayKey(new Date(NOW-864e5)),tm=dayKey(new Date(NOW+864e5));
  const day=k===t?'Today':k===y?'Yesterday':k===tm?'Tomorrow':fmtDay(h);return day+', '+fmtTime(d);}
function relDay(h){const d=at(h),k=dayKey(d);if(k===dayKey(new Date(NOW)))return 'Today';if(k===dayKey(new Date(NOW+864e5)))return 'Tomorrow';return fmtDay(h);}

/* ——— geometry ——— */
function hav(a,b){const r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r;const x=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 3958.8*2*Math.asin(Math.sqrt(x));}
const RT={};
function rt(key){if(RT[key])return RT[key];const c=R[key].coords,cum=[0];for(let i=1;i<c.length;i++)cum.push(cum[i-1]+hav(c[i-1],c[i]));return RT[key]={c,cum,total:cum[cum.length-1],miles:R[key].miles,states:R[key].states};}
function pointAt(r,f){f=Math.max(0,Math.min(1,f));const d=f*r.total;let i=1;while(i<r.cum.length-1&&r.cum[i]<d)i++;const a=r.c[i-1],b=r.c[i],seg=(r.cum[i]-r.cum[i-1])||1,t=Math.min(1,Math.max(0,(d-r.cum[i-1])/seg));return {p:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],i};}
function sliceTo(r,f){const pa=pointAt(r,f);return r.c.slice(0,pa.i).concat([pa.p]);}
function sliceFrom(r,f){const pa=pointAt(r,f);return [pa.p].concat(r.c.slice(pa.i));}
function prog(l){if(l.status==='transit'){const r=rt(l.route);return Math.min(.995,l.p0+((Date.now()-NOW)/3600e3*l.mph)/r.miles);}return l.p0;}
function compass(a,b){const dy=b[0]-a[0],dx=(b[1]-a[1])*Math.cos(a[0]*Math.PI/180);const ang=(Math.atan2(dx,dy)*180/Math.PI+360)%360;return ['north','northeast','east','southeast','south','southwest','west','northwest'][Math.round(ang/45)%8];}
function where(l){const r=rt(l.route),p=pointAt(r,prog(l)).p;let best,bd=1e9;for(const t of D.towns){const d=hav([t[2],t[3]],p);if(d<bd){bd=d;best=t;}}
  const name=best[0]+', '+best[1];if(bd<4)return 'In '+name;return Math.round(bd)+' mi '+compass([best[2],best[3]],p)+' of '+name;}
function milesLeft(l){return Math.max(0,Math.round(rt(l.route).miles*(1-prog(l))));}

/* ——— load helpers ——— */
const st=l=>STATUS[l.status];
function badge(l){const s=st(l);return `<span class="badge${s.live?' live':''}" style="--c:${s.c}">${s.label}</span>`;}
const stepName=(l,i)=>(l.stepNames||D.steps)[i];
function stepState(l,i){if(l.status==='delivered')return 'done';if(i<l.active)return 'done';if(i===l.active)return 'cur';return 'todo';}
function nextUp(l){
  switch(l.status){
    case 'transit':return {k:'Delivery window',v:fmtDay(l.window.h),s:l.window.label,ok:'On schedule'};
    case 'parked':return {k:'Delivery window',v:fmtDay(l.window.h),s:l.window.label,ok:'Rolls again '+relDay(l.resume.h)+', '+l.resume.label};
    case 'loaded':return {k:'Departs',v:relDay(l.depart.h),s:l.depart.label,ok:'Delivery '+fmtDay(l.window.h)+', '+l.window.label};
    case 'permits':return {k:'Pickup set for',v:fmtDay(l.depart.h),s:l.depart.label,ok:'After the permit is issued'};
    case 'yard':return {k:'Stored since',v:fmtDay(l.yard.in),s:Math.round(-l.yard.in/24)+' days · '+l.yard.spot,ok:l.yard.fee};
    default:return {k:'Delivered',v:fmtDay(l.delivered.h),s:fmtTime(at(l.delivered.h))+' · signed by '+l.delivered.signer,ok:'On time'};
  }
}
function cardLine(l){
  const r=rt(l.route);
  switch(l.status){
    case 'transit':return [`${Math.round(r.miles*prog(l))} of ${r.miles} mi · ${where(l)}`,'ETA '+fmtDay(l.window.h)];
    case 'parked':return [`Parked at ${l.park} · daylight-only permit`,'ETA '+fmtDay(l.window.h)];
    case 'loaded':return [`${r.miles} mi · departs ${relDay(l.depart.h).toLowerCase()} ${l.depart.label}`,'ETA '+fmtDay(l.window.h)];
    case 'permits':return [`${r.miles} mi · superload permit in review`,'Pickup '+fmtDay(l.depart.h)];
    case 'yard':return [`Stored ${Math.round(-l.yard.in/24)} days · ${l.yard.spot}`,'In yard'];
    default:return [`Signed by ${l.delivered.signer}`,fmtDay(l.delivered.h)];
  }
}
const isActive=l=>l.status!=='delivered';
const onRoad=l=>l.status==='transit'||l.status==='parked';

/* ——— header / menu ——— */
function setNav(w){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===w));}
function placeBadge(){const b=$('.brand');document.documentElement.style.setProperty('--brand-w',b.getBoundingClientRect().width+'px');}
addEventListener('resize',placeBadge);$('.brand img').addEventListener('load',placeBadge);placeBadge();
addEventListener('scroll',()=>$('#hdr').classList.toggle('solid',scrollY>8),{passive:true});
$('#userChip').addEventListener('click',()=>{sessionStorage.removeItem('afd_demo');location.hash='#/login';toast('Signed out of the demo.');});
$('#menuBtn').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
document.querySelectorAll('#mnav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
$('#mSignout').addEventListener('click',()=>{document.body.classList.remove('menu-open');sessionStorage.removeItem('afd_demo');location.hash='#/login';});

/* ——— map ——— */
function makeMap(el,opts={}){
  const small=innerWidth<640;
  const m=L.map(el,Object.assign({maxZoom:16,zoomSnap:.25,zoomControl:!small,scrollWheelZoom:false,attributionControl:true},opts));
  const e='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  L.tileLayer(e+'World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,attribution:'Tiles &copy; Esri, HERE, Garmin &copy; OpenStreetMap contributors'}).addTo(m);
  L.tileLayer(e+'World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,pane:'shadowPane',opacity:.9}).addTo(m);
  cleanup.push(()=>m.remove());return m;
}
function truckIcon(kind,label){
  const inner=kind==='parked'?'<b>P</b>':kind==='done'?I.check.replace('<svg','<svg style="width:18px;height:18px;color:#08111b"'):I.truck;
  return L.divIcon({className:'',html:`<div class="truck-ico ${kind}"><span class="ring"></span><span class="dot">${inner}</span>${label?`<span class="tlabel">${label}</span>`:''}</div>`,iconSize:[46,46],iconAnchor:[23,23]});
}
const pinIcon=cls=>L.divIcon({className:'',html:`<div class="pin ${cls}"></div>`,iconSize:[16,16],iconAnchor:[8,8]});
const termIcon=name=>L.divIcon({className:'',html:`<div class="term"><span>AFD</span><em>${name}</em></div>`,iconSize:[40,22],iconAnchor:[20,11]});
function addTerminals(m){for(const k of ['main','bigspring']){const t=D.terminals[k];L.marker(t.ll,{icon:termIcon(t.name),zIndexOffset:500}).addTo(m).bindTooltip(`<b>${t.name}</b><br>${t.addr}`,{className:'tt',direction:'top',offset:[0,-12]});}}
function drawLoad(m,l,{group,live}={}){
  const r=rt(l.route),f=prog(l),add=x=>{x.addTo(m);if(group)group.addLayer(x);return x;};
  const col=l.status==='parked'?C.orange:C.yellow;
  const ahead=add(L.polyline(l.status==='transit'||l.status==='parked'?sliceFrom(r,f):r.c,{color:C.light,weight:3.5,opacity:.85,dashArray:'7 8',lineCap:'round'}));
  let done=null,glow=null;
  if(f>0){glow=add(L.polyline(sliceTo(r,f),{color:col,weight:11,opacity:.16}));done=add(L.polyline(sliceTo(r,f),{color:l.status==='delivered'?C.green:col,weight:4.5,opacity:1,lineCap:'round'}));}
  return {r,ahead,done,glow};
}

/* ——— LOGIN ——— */
function viewLogin(){
  document.body.className='is-login';
  app.innerHTML=`
  <section class="login view">
    <div class="login-media"><img src="assets/img/hero.webp" alt="AFD truck with an oversize pressure vessel on a perimeter trailer">
      <div class="login-copy"><p class="eyebrow rise" style="--i:0">Customer Portal</p>
        <h1 class="rise" style="--i:1">Track your load<br><span class="outline">every mile</span></h1>
        <p class="rise" style="--i:2">See where your freight is, what step it's on, and every permit, photo and document in one place.</p></div></div>
    <div class="login-panel"><form class="login-card" id="loginForm" novalidate>
      <p class="eyebrow rise" style="--i:1">Sign in</p><h2 class="rise" style="--i:2">Welcome back</h2>
      <p class="lead rise" style="--i:3">Use the email your AFD dispatcher has on file.</p>
      <label class="field rise" style="--i:4"><span>Email</span><input type="email" name="email" autocomplete="username" placeholder="you@company.com"></label>
      <label class="field rise" style="--i:5"><span>Password</span><input type="password" name="pw" autocomplete="current-password" placeholder="••••••••"></label>
      <div class="login-row rise" style="--i:6"><label><input type="checkbox" checked> Keep me signed in</label><a href="#" id="forgot">Forgot password?</a></div>
      <div class="login-actions rise" style="--i:7"><button class="btn btn-primary" type="submit"><span class="spin"></span><span class="lbl">Sign in</span> ${I.arrow}</button>
        <div class="or">or</div><button class="btn btn-ghost" type="button" id="demoBtn">View demo</button></div>
      <p class="login-help rise" style="--i:8">Demo only: any email and password will work. Need access? Email <a href="mailto:quotes@afd-web.com">quotes@afd-web.com</a> or call <a href="tel:+12816515462">(281) 651-5462</a>.</p>
    </form></div>
  </section>`;
  const go=()=>{$('#loginForm .btn-primary').classList.add('loading');setTimeout(()=>{sessionStorage.setItem('afd_demo','1');location.hash='#/dashboard';},700);};
  $('#loginForm').addEventListener('submit',e=>{e.preventDefault();go();});
  $('#demoBtn').addEventListener('click',go);
  $('#forgot').addEventListener('click',e=>{e.preventDefault();toast('Demo: a password reset link would be sent by email.');});
}

/* ——— shared pieces ——— */
function sketch(l){
  const c=rt(l.route).c;let a=90,b=-90,m=180,n=-180;c.forEach(p=>{a=Math.min(a,p[0]);b=Math.max(b,p[0]);m=Math.min(m,p[1]);n=Math.max(n,p[1]);});
  const W=400,H=250,pad=40,s=Math.min((W-2*pad)/(n-m||1),(H-2*pad)/(b-a||1)),ox=(W-(n-m)*s)/2,oy=(H-(b-a)*s)/2;
  const pts=c.map(p=>[(p[1]-m)*s+ox,(b-p[0])*s+oy]),d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(''),s0=pts[0],e=pts[pts.length-1];
  return `<svg class="sketch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><radialGradient id="g${l.id}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#1c3148"/><stop offset="1" stop-color="#08111b"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g${l.id})"/><path d="${d}" fill="none" stroke="#6cbcf2" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" opacity=".9"><animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.6s" repeatCount="indefinite"/></path><circle cx="${s0[0]}" cy="${s0[1]}" r="7" fill="#2b8be0" stroke="#fff" stroke-width="3"/><circle cx="${e[0]}" cy="${e[1]}" r="7" fill="#ffc21a" stroke="#fff" stroke-width="3"/></svg>`;
}
function card(l,i){
  const ph=l.photos[0]&&photo(l.photos[0][0]),s=st(l),[line,right]=cardLine(l);
  const media=ph?`<div class="bg" style="background-image:url(${ph.src})"></div><img src="${ph.src}" alt="${esc(l.cargo)} on an AFD trailer" loading="lazy">`:`${sketch(l)}<span class="no-photo">Photos added at pickup</span>`;
  const bars=[0,1,2,3,4].map(k=>`<span class="${stepState(l,k)}" style="--d:${k}"></span>`).join('');
  return `<a class="card rise" style="--i:${i+2};--accent:${s.c}" href="#/load/${l.id}">
    <div class="media">${media}</div>
    <div class="card-body"><div class="card-top"><span class="lid">${l.id} · ${esc(l.project)}</span>${badge(l)}</div>
      <h3>${esc(l.cargo)}</h3>
      <div class="lane">${esc(l.from.city)} ${I.arrow} <span class="to">${esc(l.to.city)}</span></div>
      <div class="prog"><div class="prog-meta"><span data-live="${l.status==='transit'?l.id:''}">${esc(line)}</span><b>${esc(right)}</b></div><div class="steps-mini">${bars}</div></div>
      <span class="open">View load ${I.arrow}</span></div></a>`;
}
function animateCounts(){document.querySelectorAll('.stat b[data-n]').forEach((b,k)=>{const n=+b.dataset.n,s=b.dataset.s||'',t0=performance.now()+300+k*90;
  (function tick(t){const p=Math.min(1,Math.max(0,(t-t0)/900));b.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(tick);else b.parentNode.classList.add('lit');})(performance.now());});}
function pageHero(eyebrow,title,sub,right){return `<section class="page-hero"><div class="container"><div class="hero-row"><div><p class="eyebrow rise" style="--i:0">${eyebrow}</p><h1 class="rise" style="--i:1">${title}</h1>${sub?`<p class="rise" style="--i:2">${sub}</p>`:''}</div>${right||''}</div>`;}

/* ——— DASHBOARD ——— */
function attentionItems(){
  const out=[];
  D.quotes.forEach(q=>{const s=store.get('q_'+q.id,null);if(s)return;out.push(`<div class="att" data-q="${q.id}"><span class="att-ico">${I.quote}</span><div><b>Quote ${q.id} is ready to approve</b><p>${esc(q.cargo)} · ${esc(q.lane)}. <span class="amt">${q.amount}</span>, good for ${Math.round(q.valid/24)} days. ${esc(q.note)}</p>
    <div class="att-btns"><button class="btn btn-primary btn-xs" data-act="approve">Approve quote</button><button class="btn btn-ghost btn-xs" data-act="changes">Ask for changes</button></div>
    <div class="att-change" hidden><textarea rows="2" placeholder="What should we change?"></textarea><button class="btn btn-ghost btn-xs" data-act="send">Send to dispatch</button></div></div></div>`);});
  D.loads.filter(l=>l.window&&isActive(l)&&l.window.h<72&&!store.get('ready_'+l.id,false)).forEach(l=>out.push(`<div class="att"><span class="att-ico y">${I.check}</span><div><b>Confirm your site is ready for ${l.id}</b><p>${esc(l.cargo)} arrives ${fmtDay(l.window.h)}, ${esc(l.window.label)}, at ${esc(l.to.place)}.</p><div class="att-btns"><a class="btn btn-primary btn-xs" href="#/load/${l.id}?ready=1">Open site checklist</a></div></div></div>`));
  D.loads.filter(l=>l.status==='yard'&&!store.get('yardreq_'+l.id,null)).forEach(l=>out.push(`<div class="att"><span class="att-ico">${I.yard}</span><div><b>${l.id} has been in yard storage ${Math.round(-l.yard.in/24)} days</b><p>${esc(l.cargo)} is at Big Spring Terminal, ${esc(l.yard.spot)}. Schedule delivery when your site is ready.</p><div class="att-btns"><a class="btn btn-ghost btn-xs" href="#/yard">Schedule delivery</a></div></div></div>`));
  return out;
}
function viewDashboard(q){
  document.body.className='';setNav('dashboard');
  const A=D.loads.filter(isActive),road=D.loads.filter(onRoad),soon=A.filter(l=>l.window&&l.window.h<72),yard=A.filter(l=>l.status==='yard');
  const hr=+at(0).toLocaleString('en-US',{timeZone:TZ,hour:'numeric',hour12:false});
  const hi=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const att=attentionItems();
  app.innerHTML=`<div class="view">
  ${pageHero(esc(D.customer.company),`${hi}, <span class="outline">${esc(D.customer.first)}</span>`,`${road.length} loads on the road and ${soon.length} delivery windows in the next 3 days.`,`<a class="btn btn-primary rise" style="--i:2" href="#/quote">Get a quote ${I.arrow}</a>`)}
    <div class="stats rise" style="--i:3">
      <div class="stat"><b data-n="${A.length}">0</b><span>Active loads</span></div>
      <div class="stat"><b data-n="${road.length}">0</b><span>On the road now</span></div>
      <div class="stat"><b data-n="${soon.length}">0</b><span>Arriving in 3 days</span></div>
      <div class="stat"><b data-n="${yard.length}">0</b><span>In yard storage</span></div>
    </div></div></section>
  <section class="container">
    <div class="dash-grid">
      <section class="panel rise" style="--i:4"><div class="panel-h"><h3>Live map</h3><div class="legend"><span><i class="l1"></i>Moving</span><span><i class="l3"></i>Parked</span><span><i class="l2"></i>Scheduled</span><span><i class="l4"></i>AFD terminal</span></div></div>
        <div class="map-wrap"><div id="dmap" class="map" aria-label="Map of all active loads"></div><div class="map-tools"><button type="button" id="dfit">Fit all</button></div></div></section>
      <section class="panel att-panel rise" style="--i:5"><div class="panel-h"><h3>Needs your attention</h3><span class="count">${att.length}</span></div><div class="att-list" id="attList">${att.join('')||'<p class="muted pad">You are all caught up.</p>'}</div></section>
    </div>
    <div class="toolbar rise" style="--i:5">
      <div class="chips" role="tablist">
        <button class="chip" data-f="active">Active<i>${A.length}</i></button><button class="chip" data-f="road">On the road<i>${road.length}</i></button>
        <button class="chip" data-f="yard">In yard<i>${yard.length}</i></button><button class="chip" data-f="all">All<i>${D.loads.length}</i></button>
      </div>
      <label class="search">${I.search}<input type="search" id="q" placeholder="Search load, PO, project or city" aria-label="Search loads"></label>
    </div>
    <div class="cards" id="cards"></div>
  </section></div>`;
  let cur=q.get('f')||'active',term='';const cards=$('#cards');
  function draw(){
    const list=D.loads.filter(l=>cur==='all'||(cur==='active'?isActive(l):cur==='road'?onRoad(l):l.status==='yard')).filter(l=>!term||[l.id,l.po,l.cargo,l.project,l.from.city,l.to.city].join(' ').toLowerCase().includes(term));
    cards.innerHTML=list.length?list.map(card).join(''):'<div class="empty">No loads match your search.</div>';
    document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.f===cur));
    setTimeout(()=>cards.querySelectorAll('.steps-mini').forEach(s=>s.classList.add('go')),80);
  }
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{cur=c.dataset.f;draw();}));
  $('#q').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();draw();});
  draw();animateCounts();bindAttention();
  // map
  if(!window.L)return;
  const m=makeMap('dmap'),grp=L.featureGroup().addTo(m),small=innerWidth<640;
  addTerminals(m);
  const movers=[];
  A.filter(l=>l.status!=='yard').forEach(l=>{
    const d=drawLoad(m,l,{group:grp});const go=()=>location.hash='#/load/'+l.id;
    [d.ahead,d.done].forEach(x=>x&&x.on('click',go));
    if(l.status==='permits'){L.marker(d.r.c[0],{icon:pinIcon('a')}).addTo(m).on('click',go).bindTooltip(`<b>${l.id}</b> · permits in progress`,{className:'tt',direction:'top',offset:[0,-10]});return;}
    const kind=l.status==='transit'?'':l.status==='parked'?'parked':'planned';
    const lab=small?'':(l.id+(l.status==='transit'?' · '+l.mph+' mph':l.status==='parked'?' · parked':' · loaded'));
    const mk=L.marker(pointAt(d.r,prog(l)).p,{icon:truckIcon(kind,lab),zIndexOffset:l.status==='transit'?1000:900}).addTo(m).on('click',go);
    mk.bindTooltip(`<b>${esc(l.cargo)}</b><br>${esc(where(l))}`,{className:'tt',direction:'top',offset:[0,-24]});
    if(l.status==='transit')movers.push([l,mk,d]);
  });
  const fit=()=>m.fitBounds(grp.getBounds(),{padding:small?[20,20]:[40,40]});fit();$('#dfit').onclick=fit;
  const iv=setInterval(()=>{movers.forEach(([l,mk,d])=>{const f=prog(l);mk.setLatLng(pointAt(d.r,f).p);d.done&&d.done.setLatLngs(sliceTo(d.r,f));d.glow&&d.glow.setLatLngs(sliceTo(d.r,f));d.ahead.setLatLngs(sliceFrom(d.r,f));});
    document.querySelectorAll('[data-live]').forEach(s=>{if(!s.dataset.live)return;const l=L_(s.dataset.live);s.textContent=cardLine(l)[0];});},3000);
  cleanup.push(()=>clearInterval(iv));
}
function bindAttention(){
  document.querySelectorAll('.att[data-q]').forEach(el=>{const id=el.dataset.q;
    el.querySelector('[data-act=approve]').onclick=()=>{store.set('q_'+id,'approved');el.classList.add('gone');toast(`Quote ${id} approved. Dispatch will confirm by email.`);setTimeout(()=>el.remove(),400);};
    el.querySelector('[data-act=changes]').onclick=()=>{el.querySelector('.att-change').hidden=false;el.querySelector('textarea').focus();};
    el.querySelector('[data-act=send]').onclick=()=>{store.set('q_'+id,'changes');el.classList.add('gone');toast('Sent. Dispatch will send a new quote.');setTimeout(()=>el.remove(),400);};
  });
}

/* ——— LOAD DETAIL ——— */
function timeline(l){
  return '<ol class="tl">'+[0,1,2,3,4].map(i=>{const s=stepState(l,i),t=l.steps[i][0],note=l.steps[i][1];
    const node=s==='done'?I.check:s==='cur'?(l.status==='transit'?I.truck.replace('viewBox','style="width:16px;height:16px" viewBox'):'<i class="dotc"></i>'):(i+1);
    let when=t!=null?rel(t):(s==='cur'?'In progress':'Up next');if(s==='todo'&&i>l.active+0)when='Not yet';
    if(s==='cur'&&t!=null)when='Started '+rel(t);
    if(l.status==='loaded'&&i===3)when='Departs '+relDay(l.depart.h).toLowerCase()+', '+l.depart.label;
    return `<li class="${s}" style="--i:${i}"><span class="node">${node}</span><b>${esc(stepName(l,i))}</b><time>${esc(when)}</time>${note?`<p>${esc(note)}</p>`:''}</li>`;}).join('')+'</ol>';
}
function readiness(l){
  if(!l.ready||!isActive(l))return '';
  const saved=store.get('readyc_'+l.id,[]),done=store.get('ready_'+l.id,false);
  return `<section class="panel p-ready" id="ready"><div class="panel-h"><h3>Is your site ready?</h3>${done?'<span class="online">Confirmed</span>':''}</div><div class="panel-b">
    <ul class="checks">${l.ready.map((r,i)=>`<li><label><input type="checkbox" data-i="${i}" ${saved.includes(i)||done?'checked':''} ${done?'disabled':''}><span class="box">${I.check}</span>${esc(r)}</label></li>`).join('')}</ul>
    <button class="btn btn-primary btn-sm wide" id="readyBtn" ${done?'disabled':''}>${done?'Site confirmed ready':'Confirm site is ready'}</button>
    <p class="small muted">A truck that arrives at a site that isn't ready can mean wait time charges. Confirming tells dispatch you are good to go.</p></div></section>`;
}
function bindReady(l){
  const box=$('#ready');if(!box)return;const btn=$('#readyBtn');
  const upd=()=>{const c=[...box.querySelectorAll('input:checked')].map(x=>+x.dataset.i);store.set('readyc_'+l.id,c);if(!store.get('ready_'+l.id,false))btn.disabled=c.length<l.ready.length;};
  box.querySelectorAll('input').forEach(x=>x.addEventListener('change',upd));upd();
  btn.onclick=()=>{store.set('ready_'+l.id,true);btn.textContent='Site confirmed ready';btn.disabled=true;box.querySelectorAll('input').forEach(x=>x.disabled=true);box.querySelector('.panel-h').insertAdjacentHTML('beforeend','<span class="online">Confirmed</span>');toast('Thanks. Dispatch knows your site is ready.');};
}
function feedRow(e){const [ic,c]=EV[e[1]]||EV.doc;return `<li><span class="ev-ico" style="--c:${c}">${I[ic]}</span><span class="ev-t">${esc(e[2])}</span><time>${rel(e[0])}</time></li>`;}
function gallery(l){
  if(!l.photos.length)return `<div class="ph-empty">${I.cam}<b>No photos yet</b><br>Your driver adds photos at pickup and at delivery.</div>`;
  return `<div class="gallery">${l.photos.map((p,i)=>{const ph=photo(p[0]);return `<button class="ph" data-i="${i}"><img src="${ph.src}" width="${ph.w}" height="${ph.h}" alt="${esc(p[1])}" loading="lazy"><figcaption>${esc(p[1])}<small>${rel(p[2])}</small></figcaption></button>`;}).join('')}</div>`;
}
function docsList(l){return `<ul class="docs">${l.docs.map(d=>`<li class="${d[2]?'':'pending'}"><span class="doc-ico">PDF</span><span class="doc-t"><b>${esc(d[0])}</b><small>${esc(d[1])}</small></span><button type="button">${d[2]?'View':'Pending'}</button></li>`).join('')}</ul>`;}
function permitsTab(l){
  const r=rt(l.route),issued=stepState(l,1)==='done';
  const specs=Object.entries(l.specs).map(([k,v],i)=>`<div class="${i<4?'big':''}"><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')+`<div><small>Trailer</small><b>${esc(l.trailer)}</b></div><div><small>Truck</small><b>${esc(l.unit)}</b></div><div><small>Route length</small><b>${r.miles} mi</b></div>`;
  const rows=Object.entries(r.states).map(([s,mi])=>`<tr><td><b class="stchip">${s}</b></td><td>${mi} mi</td><td><span class="pst ${issued?'ok':''}">${issued?'Issued':'In review'}</span></td><td>${esc((l.restrict||{})[s]||'')}</td></tr>`).join('');
  return `<div class="specs">${specs}</div>
    <h4 class="sub-h">Permits by state</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>State</th><th>Miles</th><th>Permit</th><th>Travel rules</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="small muted">AFD plans and secures the permits. Each state assigns the route the load must follow.</p>`;
}
function messagesTab(l){
  const seed=[{who:'d',t:-40,m:`Hi ${D.customer.first}, this is AFD Dispatch. I'll post updates for ${l.id} here. Message me any time.`}];
  if(l.status==='transit')seed.push({who:'d',t:-14,m:'Parked overnight at Ozona. The permit is daylight only, so we roll again at sunrise.'});
  if(l.status==='parked')seed.push({who:'d',t:-5,m:'Convoy is parked at Dublin for the night. Both units look good.'});
  const msgs=seed.concat(store.get('msg_'+l.id,[]));
  return `<div class="thread" id="thread">${msgs.map(x=>`<div class="msg ${x.who}"><p>${esc(x.m)}</p><time>${x.who==='d'?'AFD Dispatch':'You'} · ${x.ts?new Date(x.ts).toLocaleString('en-US',{timeZone:TZ,month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):rel(x.t)}</time></div>`).join('')}</div>
    <form class="msg-form" id="msgForm"><input type="text" placeholder="Write a message to dispatch" aria-label="Message"><button class="btn btn-primary btn-sm" type="submit">Send</button></form>`;
}
function alertsTab(l){
  const opts=[['depart','Truck departs pickup'],['hour','Truck is 1 hour from delivery'],['delay','Delay or schedule change'],['photos','New photos added'],['pod','Delivered and POD ready']];
  const s=store.get('alerts_'+l.id,{depart:['email'],hour:['email','text'],delay:['email','text'],photos:[],pod:['email']});
  return `<p class="muted small" style="margin-top:0">Pick how you hear about ${l.id}. Alerts go to ${esc(D.customer.user)}.</p><ul class="alerts">${opts.map(([k,t])=>`<li><span>${t}</span><span class="tg">${['email','text'].map(ch=>`<label class="sw"><input type="checkbox" data-k="${k}" data-ch="${ch}" ${(s[k]||[]).includes(ch)?'checked':''}><i></i>${ch==='email'?'Email':'Text'}</label>`).join('')}</span></li>`).join('')}</ul>`;
}
function bindTabs(l){
  const tabs=document.querySelectorAll('.tab'),body=$('#tabBody');
  const render=k=>{tabs.forEach(t=>t.classList.toggle('on',t.dataset.t===k));body.classList.remove('in');void body.offsetWidth;body.classList.add('in');
    body.innerHTML=k==='activity'?`<ul class="feed">${l.events.slice().sort((a,b)=>b[0]-a[0]).map(feedRow).join('')}</ul>`:k==='permits'?permitsTab(l):k==='photos'?gallery(l):k==='docs'?docsList(l):k==='msgs'?messagesTab(l):alertsTab(l);
    body.querySelectorAll('.ph').forEach(b=>b.addEventListener('click',()=>openLB(l.photos.map(p=>Object.assign(photo(p[0]),{cap:p[1],when:rel(p[2])})),+b.dataset.i)));
    body.querySelectorAll('.docs button').forEach(b=>b.addEventListener('click',()=>toast('Sample document. In the live portal this opens the PDF.')));
    const mf=$('#msgForm');if(mf)mf.addEventListener('submit',e=>{e.preventDefault();const inp=mf.querySelector('input'),v=inp.value.trim();if(!v)return;const arr=store.get('msg_'+l.id,[]);arr.push({who:'u',m:v,ts:Date.now()});store.set('msg_'+l.id,arr);render('msgs');
      setTimeout(()=>{const a=store.get('msg_'+l.id,[]);a.push({who:'d',m:`Thanks, ${D.customer.first}. Got it. I'll get back to you shortly. (Demo reply)`,ts:Date.now()});store.set('msg_'+l.id,a);if($('#thread'))render('msgs');},1400);});
    body.querySelectorAll('.sw input').forEach(x=>x.addEventListener('change',()=>{const s={};body.querySelectorAll('.sw input').forEach(y=>{s[y.dataset.k]=s[y.dataset.k]||[];if(y.checked)s[y.dataset.k].push(y.dataset.ch);});store.set('alerts_'+l.id,s);toast('Alert settings saved.');}));
    const th=$('#thread');if(th)th.scrollTop=th.scrollHeight;
  };
  tabs.forEach(t=>t.addEventListener('click',()=>render(t.dataset.t)));render('activity');
}
function hud(l){
  const r=rt(l.route);
  const loc=l.status==='transit'?where(l):l.status==='parked'?l.park:l.status==='yard'?'Big Spring Terminal':l.status==='delivered'?l.to.city:l.from.city;
  const status=l.status==='transit'?'Moving · '+l.mph+' mph':st(l).label;
  const left=l.status==='delivered'||l.status==='yard'?0:milesLeft(l);
  const ping=l.status==='transit'?'Just now':l.status==='parked'?'3 min ago':'—';
  return `<div class="map-hud"><div><small>Current location</small><b id="hLoc">${esc(loc)}</b></div><div><small>Status</small><b>${esc(status)}</b></div><div><small>Miles left</small><b id="hMi">${left}</b></div><div><small>Last GPS ping</small><b id="hUpd">${ping}</b></div></div>`;
}
function loadMap(el,l,{share}={}){
  if(!window.L)return;if(typeof el==='string')el=document.getElementById(el);
  const m=makeMap(el),small=innerWidth<640,d=drawLoad(m,l),r=d.r;
  const west=r.c[0][1]<r.c[r.c.length-1][1];
  L.marker(r.c[0],{icon:pinIcon('a'),keyboard:false}).addTo(m).bindTooltip('Pickup · '+l.from.city,{className:'tt',direction:west?'left':'right',offset:west?[-12,0]:[12,0],permanent:!small});
  L.marker(r.c[r.c.length-1],{icon:pinIcon('b'),keyboard:false}).addTo(m).bindTooltip('Delivery · '+l.to.city,{className:'tt',direction:west?'right':'left',offset:west?[12,0]:[-12,0],permanent:!small});
  const fit=()=>m.fitBounds(L.latLngBounds(r.c),{paddingTopLeft:[small?30:110,70],paddingBottomRight:[small?30:110,small?130:110]});fit();
  const fb=el.parentNode.querySelector('[data-fit]');if(fb)fb.onclick=()=>{follow=false;const f2=el.parentNode.querySelector('[data-follow]');if(f2)f2.textContent='Follow truck';fit();};
  let follow=false;
  if(l.status==='permits')return;
  const kind=l.status==='transit'?'':l.status==='parked'?'parked':l.status==='delivered'?'done':'planned';
  const truck=L.marker(pointAt(r,0).p,{icon:truckIcon(kind),zIndexOffset:1000}).addTo(m);
  const target=prog(l),t0=performance.now()+600,dur=l.status==='transit'?2400:1500;let raf,last=Date.now();
  const place=f=>{truck.setLatLng(pointAt(r,f).p);if(f>0&&d.done){d.done.setLatLngs(sliceTo(r,f));d.glow.setLatLngs(sliceTo(r,f));}d.ahead.setLatLngs(l.status==='transit'||l.status==='parked'?sliceFrom(r,f):r.c);if(follow)m.panTo(pointAt(r,f).p,{animate:true,duration:.8});};
  if(target>0){(function an(t){const p=Math.min(1,Math.max(0,(t-t0)/dur)),e=1-Math.pow(1-p,3);place(target*e);if(p<1)raf=requestAnimationFrame(an);else if(l.status==='transit')live();})(performance.now());}else place(0);
  cleanup.push(()=>cancelAnimationFrame(raf));
  function live(){const iv=setInterval(()=>{const f=prog(l);place(f);const a=$('#hLoc'),b=$('#hMi'),c=$('#hUpd');if(a)a.textContent=where(l);if(b)b.textContent=milesLeft(l);
      const s=Math.round((Date.now()-last)/1000);if(c)c.textContent=s<5?'Just now':s+' sec ago';if(s>=30){last=Date.now();if(c){c.textContent='Just now';c.animate([{color:C.yellow},{color:'#eaf1f8'}],{duration:1200});}}},1000);cleanup.push(()=>clearInterval(iv));}
  const fl=el.parentNode.querySelector('[data-follow]');if(fl)fl.onclick=()=>{follow=!follow;fl.textContent=follow?'Following':'Follow truck';if(follow)m.flyTo(truck.getLatLng(),9,{duration:1.2});};
}
function shareUrl(l){return location.href.split('#')[0]+'#/track/'+l.id;}
function shareModal(l){
  const u=shareUrl(l);
  openModal(`<p class="eyebrow">Share tracking link</p><h2>Send this to your site crew</h2><p class="muted">Anyone with the link can see the map, the delivery window and the progress for ${l.id}. It does not show prices, documents or messages.</p>
    <div class="copyrow"><input type="text" readonly value="${esc(u)}" aria-label="Tracking link"><button class="btn btn-primary btn-sm" id="cpy">Copy</button></div>
    <div class="modal-btns"><a class="btn btn-ghost btn-sm" href="#/track/${l.id}" id="openShare">Open crew view ${I.arrow}</a><a class="btn btn-ghost btn-sm" href="mailto:?subject=${encodeURIComponent('Tracking for '+l.cargo)}&body=${encodeURIComponent('Live tracking: '+u)}">Email link</a></div>`);
  $('#cpy').onclick=()=>{const inp=$('.copyrow input');inp.select();(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('Link copied.')).catch(()=>{document.execCommand&&document.execCommand('copy');toast('Link copied.');});};
  $('#openShare').addEventListener('click',closeModal);
}
function viewLoad(id,q){
  document.body.className='';setNav(isActive(L_(id)||{})?'dashboard':'history');
  const l=L_(id);if(!l){location.hash='#/dashboard';return;}
  const r=rt(l.route),n=nextUp(l);
  app.innerHTML=`<div class="view container">
    <a class="crumb" href="#/${isActive(l)?'dashboard':'history'}">${I.back} ${isActive(l)?'All loads':'History'}</a>
    <div class="detail-head">
      <div><div class="card-top" style="justify-content:flex-start;gap:14px;flex-wrap:wrap"><span class="lid">${l.id} · ${l.po}</span>${badge(l)}</div>
        <h1>${esc(l.cargo)}</h1>
        <div class="lane"><span class="muted">${esc(l.project)} ·</span> ${esc(l.from.city)} ${I.arrow} <span class="to">${esc(l.to.city)}</span><span class="muted">· ${r.miles} mi</span></div></div>
      <div class="head-right"><div class="eta-box"><small>${n.k}</small><b>${esc(n.v)}</b><span>${esc(n.s)}</span><em>${esc(n.ok)}</em></div>
        ${isActive(l)&&l.status!=='yard'?`<button class="btn btn-ghost btn-sm" id="shareBtn">${I.share} Share tracking link</button>`:''}</div>
    </div>
    <div class="detail-grid">
      <div class="main-col">
        <section class="panel p-map"><div class="panel-h"><h3>${l.status==='transit'?'Live location':'Route map'}</h3><div class="legend"><span><i class="l1"></i>Traveled</span><span><i class="l2"></i>State-assigned permit route</span></div></div>
          <div class="map-wrap"><div id="map" class="map" aria-label="Map of the route"></div>
            <div class="map-tools"><button type="button" data-fit>Full route</button>${l.status==='transit'?'<button type="button" data-follow>Follow truck</button>':''}</div>${hud(l)}</div></section>
        <section class="panel p-tabs"><div class="tabs" role="tablist">
          <button class="tab" data-t="activity">Activity <i>${l.events.length}</i></button><button class="tab" data-t="permits">Load &amp; permits</button>
          <button class="tab" data-t="photos">Photos <i>${l.photos.length}</i></button><button class="tab" data-t="docs">Documents <i>${l.docs.length}</i></button>
          <button class="tab" data-t="msgs">Messages</button><button class="tab" data-t="alerts">Alerts</button></div>
          <div class="panel-b tab-body" id="tabBody"></div></section>
      </div>
      <aside class="side">
        <section class="panel p-prog"><div class="panel-h"><h3>Progress</h3><span class="muted small">${l.status==='delivered'?5:l.active} of 5 done</span></div><div class="panel-b">${timeline(l)}</div></section>
        ${readiness(l)}
        <section class="panel p-disp dispatch"><div class="panel-h"><h3>Your dispatcher</h3></div><div class="panel-b">
          <div class="disp-who"><span class="avatar">AFD</span><div><b>AFD Dispatch</b><small>Main Terminal · Conroe, TX · ${esc(l.unit)}</small></div></div>
          <a class="disp-line" href="tel:+12816515462">${I.phone}(281) 651-5462</a>
          <a class="disp-line" href="mailto:quotes@afd-web.com?subject=${encodeURIComponent('Question about load '+l.id)}">${I.mail}quotes@afd-web.com</a>
          <div class="disp-btns"><a class="btn btn-primary btn-sm" href="tel:+12816515462">Call</a><a class="btn btn-ghost btn-sm" href="mailto:quotes@afd-web.com?subject=${encodeURIComponent('Question about load '+l.id)}">Email</a></div>
        </div></section>
      </aside>
    </div></div>`;
  bindTabs(l);bindReady(l);
  const sb=$('#shareBtn');if(sb)sb.onclick=()=>shareModal(l);
  loadMap('map',l);
  if(q.get('ready')&&$('#ready'))setTimeout(()=>{$('#ready').scrollIntoView({behavior:'smooth',block:'center'});$('#ready').classList.add('flash');},500);
}

/* ——— SHARED TRACKING VIEW ——— */
function viewTrack(id){
  document.body.className='is-share';
  const l=L_(id);if(!l||!isActive(l)){app.innerHTML=`<div class="container view" style="padding:80px 0"><h1>Link not active</h1><p class="muted">This tracking link has ended. Questions? Call AFD dispatch at <a href="tel:+12816515462">(281) 651-5462</a>.</p></div>`;return;}
  const r=rt(l.route),n=nextUp(l);
  app.innerHTML=`<div class="view container share">
    <div class="share-note">${I.share} Shared tracking link · read-only view for the site crew</div>
    <div class="detail-head"><div><div class="card-top" style="justify-content:flex-start;gap:14px"><span class="lid">${l.id}</span>${badge(l)}</div><h1>${esc(l.cargo)}</h1>
      <div class="lane">${esc(l.from.city)} ${I.arrow} <span class="to">${esc(l.to.city)}</span><span class="muted">· ${esc(l.to.place)}</span></div></div>
      <div class="eta-box"><small>${n.k}</small><b>${esc(n.v)}</b><span>${esc(n.s)}</span><em>${esc(n.ok)}</em></div></div>
    <div class="detail-grid">
      <div class="main-col"><section class="panel p-map"><div class="panel-h"><h3>${l.status==='transit'?'Live location':'Route map'}</h3><div class="legend"><span><i class="l1"></i>Traveled</span><span><i class="l2"></i>State-assigned permit route</span></div></div>
        <div class="map-wrap"><div id="map" class="map"></div><div class="map-tools"><button type="button" data-fit>Full route</button>${l.status==='transit'?'<button type="button" data-follow>Follow truck</button>':''}</div>${hud(l)}</div></section>
        <section class="panel p-tabs"><div class="panel-h"><h3>Load size</h3><span class="muted small">For site planning</span></div><div class="specs">${['Length','Width','Height'].map(k=>`<div class="big"><small>${k}</small><b>${esc(l.specs[k])}</b></div>`).join('')}<div class="big"><small>Escorts</small><b style="font-size:1.15rem">${esc(l.specs.Escorts||'—')}</b></div></div></section></div>
      <aside class="side"><section class="panel p-prog"><div class="panel-h"><h3>Progress</h3></div><div class="panel-b">${timeline(l)}</div></section>
        <section class="panel p-disp dispatch"><div class="panel-h"><h3>Questions on site?</h3></div><div class="panel-b"><p class="muted" style="margin-top:0">Call AFD dispatch. Have the load number ready: <b style="color:#fff">${l.id}</b>.</p>
          <div class="disp-btns"><a class="btn btn-primary btn-sm" href="tel:+12816515462">Call (281) 651-5462</a></div></div></section></aside>
    </div></div>`;
  loadMap('map',l,{share:true});
}

/* ——— YARD ——— */
function viewYard(){
  document.body.className='';setNav('yard');
  const t=D.terminals.bigspring,stored=D.loads.filter(l=>l.status==='yard');
  app.innerHTML=`<div class="view">
  ${pageHero('Yard storage','Big Spring <span class="outline">Terminal</span>',`Your stored loads at ${esc(t.addr)}, right off I-20. Schedule delivery from the yard when your site is ready.`,'')}
    <div class="yard-top rise" style="--i:3">
      <div class="yard-photo"><img src="assets/img/ehouse-yard.jpg" alt="AFD truck with a control building at the yard" width="1400" height="1050"></div>
      <div class="yard-facts"><h3>About the yard</h3><ul>${t.facts.map(f=>`<li>${I.check}${esc(f)}</li>`).join('')}</ul><div id="ymap" class="map small-map"></div></div>
    </div></div></section>
  <section class="container" style="padding:34px 0 80px">
    <h2 class="sec-h">Stored loads <span class="muted">${stored.length}</span></h2>
    ${stored.map(l=>{const req=store.get('yardreq_'+l.id,null);const ph=photo(l.photos[1][0]);return `<div class="panel yard-load rise" style="--i:4">
      <div class="yl-media"><div class="bg" style="background-image:url(${ph.src})"></div><img src="${ph.src}" alt="${esc(l.cargo)} in the yard" width="${ph.w}" height="${ph.h}"></div>
      <div class="yl-body"><div class="card-top"><span class="lid">${l.id} · ${esc(l.project)}</span>${badge(l)}</div><h3 class="yl-t">${esc(l.cargo)}</h3>
        <div class="specs yl-specs"><div><small>In yard since</small><b>${fmtDay(l.yard.in)}</b></div><div><small>Days stored</small><b>${Math.round(-l.yard.in/24)}</b></div><div><small>Spot</small><b>${esc(l.yard.spot)}</b></div><div><small>Last inspection</small><b>${relDay(l.yard.inspected)==='Today'?'Today':fmtDay(l.yard.inspected)}</b></div><div><small>Storage</small><b>${esc(l.yard.fee)}</b></div><div><small>Goes to</small><b>${esc(l.yard.next)}</b></div></div>
        <div class="yl-actions">${req?`<div class="req-ok">${I.check} Delivery requested for ${esc(req.date)} (${esc(req.win)}). Dispatch will confirm and file the TX permit.</div>`:`<button class="btn btn-primary" data-sched="${l.id}">Schedule delivery ${I.arrow}</button>`}<a class="btn btn-ghost" href="#/load/${l.id}">View load</a></div>
        <form class="sched" id="sched-${l.id}" hidden>
          <div class="form-grid"><label class="field"><span>Delivery date</span><input type="date" required></label>
          <label class="field"><span>Time window</span><select><option>7:00 to 11:00 AM</option><option>11:00 AM to 3:00 PM</option><option>Any time that day</option></select></label>
          <label class="field span2"><span>Delivery site</span><input type="text" value="${esc(l.yard.next)}"></label>
          <label class="field span2"><span>Site contact phone</span><input type="tel" placeholder="(555) 555-0100"></label></div>
          <p class="small muted">The final move needs a new TX permit. AFD files it when you release the load.</p>
          <button class="btn btn-primary" type="submit">Send delivery request</button></form>
      </div></div>`;}).join('')||'<div class="empty">No loads in storage right now.</div>'}
    <div class="yard-cta"><div><h3>Need storage for another load?</h3><p class="muted">Ask about laydown space at Big Spring Terminal.</p></div><a class="btn btn-ghost" href="#/quote?storage=1">Ask about storage</a></div>
  </section></div>`;
  document.querySelectorAll('[data-sched]').forEach(b=>b.onclick=()=>{const f=$('#sched-'+b.dataset.sched);f.hidden=false;b.style.display='none';const d=f.querySelector('input[type=date]');const dd=new Date(NOW+5*864e5);d.value=dd.toISOString().slice(0,10);f.scrollIntoView({behavior:'smooth',block:'center'});});
  document.querySelectorAll('.sched').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const id=f.id.slice(6),dv=f.querySelector('input[type=date]').value;const date=new Date(dv+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    store.set('yardreq_'+id,{date,win:f.querySelector('select').value});toast('Delivery request sent to dispatch.');viewYard();}));
  if(window.L){const m=makeMap('ymap',{zoomControl:false,dragging:!L.Browser.mobile});m.setView(t.ll,11);L.marker(t.ll,{icon:termIcon(t.name)}).addTo(m).bindTooltip(`<b>${t.name}</b><br>${t.addr}`,{className:'tt',direction:'top',offset:[0,-12],permanent:true});}
}

/* ——— HISTORY ——— */
function viewHistory(){
  document.body.className='';setNav('history');
  const H=D.loads.filter(l=>l.status==='delivered').sort((a,b)=>b.delivered.h-a.delivered.h);
  app.innerHTML=`<div class="view">${pageHero('History','Delivered <span class="outline">loads</span>','Every delivered load with its proof of delivery and invoice.','')}
    <div class="stats rise" style="--i:3"><div class="stat"><b data-n="${H.length}">0</b><span>Delivered (90 days)</span></div><div class="stat"><b data-n="100" data-s="%">0</b><span>On time</span></div><div class="stat"><b data-n="${H.reduce((s,l)=>s+rt(l.route).miles,0)}">0</b><span>Miles hauled</span></div><div class="stat"><b data-n="0">0</b><span>Damage claims</span></div></div></div></section>
  <section class="container" style="padding:34px 0 80px"><div class="panel rise" style="--i:4"><div class="tbl-wrap"><table class="tbl hist">
    <thead><tr><th>Load</th><th>Cargo</th><th>Lane</th><th>Delivered</th><th>Signed by</th><th></th></tr></thead>
    <tbody>${H.map(l=>{const inv=l.docs.find(d=>/^Invoice/.test(d[0]));return `<tr><td data-l="Load"><a href="#/load/${l.id}"><b>${l.id}</b></a><small>${l.po}</small></td><td data-l="Cargo"><b>${esc(l.cargo)}</b><small>${esc(l.project)}</small></td><td data-l="Lane">${esc(l.from.city)} → ${esc(l.to.city)}<small>${rt(l.route).miles} mi</small></td><td data-l="Delivered">${fmtDay(l.delivered.h)}<small class="ok">On time</small></td><td data-l="Signed by">${esc(l.delivered.signer)}</td>
      <td class="acts"><button class="btn btn-ghost btn-xs" data-doc="POD">POD</button><button class="btn btn-ghost btn-xs" data-doc="${esc(inv?inv[0]:'Invoice')}">Invoice</button></td></tr>`;}).join('')}</tbody></table></div></div></section></div>`;
  animateCounts();
  document.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>toast(`Sample ${b.dataset.doc}. In the live portal this opens the PDF.`));
}

/* ——— QUOTE ——— */
function viewQuote(q){
  document.body.className='';setNav('quote');
  const storage=q.get('storage');
  app.innerHTML=`<div class="view">${pageHero('Get a quote','Tell us about <span class="outline">your load</span>','We haul throughout the United States. Send the basics and dispatch will get back to you with a quote.','')}</div></section>
  <section class="container" style="padding:34px 0 80px"><div class="quote-grid">
    <form class="panel panel-b qform rise" style="--i:3" id="qform">
      <h3 class="form-h">Your info</h3>
      <div class="form-grid"><label class="field"><span>Company</span><input required value="${esc(D.customer.company)}"></label><label class="field"><span>Name</span><input required value="${esc(D.customer.user)}"></label>
      <label class="field"><span>Email</span><input type="email" required placeholder="you@company.com"></label><label class="field"><span>Phone</span><input type="tel" placeholder="(555) 555-0100"></label></div>
      <h3 class="form-h">The load</h3>
      <div class="form-grid"><label class="field"><span>Pickup city and state</span><input required placeholder="Houston, TX"></label><label class="field"><span>Delivery city and state</span><input required placeholder="Abilene, TX"></label>
      <label class="field span2"><span>What are we hauling?</span><select><option>Data center module</option><option>Power transformer</option><option>Pressure vessel or tube</option><option>Building or skid</option><option>Generator</option><option>Other</option></select></label>
      <label class="field"><span>Length</span><input placeholder="ft-in"></label><label class="field"><span>Width</span><input placeholder="ft-in"></label><label class="field"><span>Height</span><input placeholder="ft-in"></label><label class="field"><span>Weight</span><input placeholder="lb"></label>
      <label class="field"><span>Ready to ship</span><input type="date"></label><label class="field"><span>Need it by</span><input type="date"></label>
      <label class="field span2"><span>Anything else?</span><textarea rows="3" placeholder="Site access, crane or jack and slide needs, number of pieces"></textarea></label></div>
      <label class="chk"><input type="checkbox" ${storage?'checked':''}> I need storage at Big Spring Terminal</label>
      <div class="form-actions"><button class="btn btn-primary" type="submit"><span class="spin"></span>Send quote request ${I.arrow}</button><a href="mailto:quotes@afd-web.com" class="muted">Or email quotes@afd-web.com</a></div>
    </form>
    <aside class="qside rise" style="--i:4"><div class="panel panel-b"><h3>What happens next</h3><ol class="next"><li>Dispatch reviews your load size and dates.</li><li>AFD checks the permits each state needs.</li><li>You get a quote here and by email to approve.</li></ol></div>
      <div class="panel panel-b dispatch"><h3>Rather talk to someone?</h3><a class="disp-line" href="tel:+12816515462">${I.phone}(281) 651-5462</a><a class="disp-line" href="mailto:quotes@afd-web.com">${I.mail}quotes@afd-web.com</a></div></aside>
  </div></section>`;
  $('#qform').addEventListener('submit',e=>{e.preventDefault();const b=e.target.querySelector('.btn-primary');b.classList.add('loading');setTimeout(()=>{e.target.outerHTML=`<div class="panel panel-b qdone view"><span class="big-check">${I.check}</span><h2>Request sent</h2><p class="muted">Demo: in the live portal this goes to AFD dispatch at quotes@afd-web.com, and your quote shows up under Needs your attention.</p><a class="btn btn-primary" href="#/dashboard">Back to my loads</a></div>`;scrollTo({top:0,behavior:'smooth'});},800);});
}

/* ——— modal & lightbox ——— */
function openModal(html){const m=$('#modal');m.querySelector('.modal-body').innerHTML=html;m.classList.add('on');m.setAttribute('aria-hidden','false');}
function closeModal(){const m=$('#modal');m.classList.remove('on');m.setAttribute('aria-hidden','true');}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('.modal-x'))closeModal();});
const lb=$('#lb');let lbSet=[],lbI=0;
function showLB(){const p=lbSet[lbI];lb.querySelector('img').src=p.src;lb.querySelector('img').alt=p.cap;lb.querySelector('figcaption').textContent=p.cap+' · '+p.when;lb.querySelectorAll('.lb-nav').forEach(b=>b.style.display=lbSet.length>1?'':'none');}
function openLB(set,i){lbSet=set;lbI=i;showLB();lb.classList.add('on');lb.setAttribute('aria-hidden','false');}
function closeLB(){lb.classList.remove('on');lb.setAttribute('aria-hidden','true');}
lb.querySelector('.lb-close').onclick=closeLB;lb.addEventListener('click',e=>{if(e.target===lb)closeLB();});
lb.querySelector('.lb-prev').onclick=()=>{lbI=(lbI-1+lbSet.length)%lbSet.length;showLB();};
lb.querySelector('.lb-next').onclick=()=>{lbI=(lbI+1)%lbSet.length;showLB();};
addEventListener('keydown',e=>{if(e.key==='Escape'){closeLB();closeModal();document.body.classList.remove('menu-open');}if(!lb.classList.contains('on'))return;if(e.key==='ArrowRight')lb.querySelector('.lb-next').click();if(e.key==='ArrowLeft')lb.querySelector('.lb-prev').click();});

/* ——— router ——— */
function route(){
  cleanup.forEach(f=>{try{f();}catch(e){}});cleanup=[];closeModal();document.body.classList.remove('menu-open');
  const h=location.hash.replace(/^#/,'')||'/login',[path,qs]=h.split('?'),q=new URLSearchParams(qs||'');
  const pub=path==='/login'||path.startsWith('/track/');
  if(!pub&&!signedIn()){location.replace('#/login');return;}
  if(path==='/login'&&signedIn()){location.replace('#/dashboard');return;}
  if(path.startsWith('/load/'))viewLoad(decodeURIComponent(path.slice(6)),q);
  else if(path.startsWith('/track/'))viewTrack(decodeURIComponent(path.slice(7)));
  else if(path==='/dashboard')viewDashboard(q);
  else if(path==='/yard')viewYard();
  else if(path==='/history')viewHistory();
  else if(path==='/quote')viewQuote(q);
  else viewLogin();
  if(!q.get('ready'))scrollTo({top:0,behavior:'instant'});
  placeBadge();
  const names={'/dashboard':'My loads','/yard':'Yard storage','/history':'History','/quote':'Get a quote'};
  document.title=(path.startsWith('/load/')||path.startsWith('/track/')?path.split('/')[2]+' · ':names[path]?names[path]+' · ':'')+'AFD Customer Portal — Demo';
}
addEventListener('hashchange',route);route();
})();
