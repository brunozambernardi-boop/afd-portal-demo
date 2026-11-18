(function(){
"use strict";
const D = window.AFD_DATA, R = window.AFD_ROUTES;
const app = document.getElementById('app');
const STEPS = D.steps;
const COLORS = ['#c9d6e3','#6cbcf2','#2b8be0','#ffc21a','#38d39f'];
const ICON = {
  arrow:'<svg class="arr" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h15M11 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  back:'<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M17 6H2M7 1 2 6l5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  check:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 6h13v9H1zM15 9h4l3 3.5V15h-7z"/><circle cx="5" cy="17" r="2" fill="currentColor"/><circle cx="12" cy="17" r="2" fill="currentColor"/><circle cx="19" cy="17" r="2" fill="currentColor"/></svg>',
  phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 5h18v14H3z"/><path fill="none" stroke="currentColor" stroke-width="2" d="m3 6 9 7 9-7"/></svg>',
  clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  cam:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2"/></svg>'
};
let cleanup = [];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const signedIn = () => sessionStorage.getItem('afd_demo') === '1';
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2600);}
function badge(l){const live=l.moving?' live':'';return `<span class="badge${live}" style="--c:${COLORS[l.status]}">${STEPS[l.status]}</span>`;}
function stepState(l,i){ if(i<l.status) return 'done'; if(i===l.status) return l.moving?'cur':'done'; return 'todo'; }
function stepText(l){
  if(l.delivered) return 'Delivered on time';
  if(l.moving) return `Step ${l.status+1} of 5 · ${Math.round(l.progress*100)}% of route`;
  return `Step ${l.status+1} of 5 · ${l.notes[l.status+1] ? l.notes[l.status+1].replace(/\.$/,'') : ''}`;
}

/* ——— geometry ——— */
function hav(a,b){const r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r;const x=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 3958.8*2*Math.asin(Math.sqrt(x));}
function prepRoute(c){const cum=[0];for(let i=1;i<c.length;i++)cum.push(cum[i-1]+hav(c[i-1],c[i]));return {c,cum,total:cum[cum.length-1]};}
function pointAt(rt,f){const d=f*rt.total;let i=1;while(i<rt.cum.length-1&&rt.cum[i]<d)i++;const a=rt.c[i-1],b=rt.c[i],seg=(rt.cum[i]-rt.cum[i-1])||1,t=Math.min(1,Math.max(0,(d-rt.cum[i-1])/seg));return {p:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],i,bearing:Math.atan2(b[1]-a[1],b[0]-a[0])};}
function sliceTo(rt,f){const pa=pointAt(rt,f);return rt.c.slice(0,pa.i).concat([pa.p]);}
function nearestTown(p){let best=null,bd=1e9;for(const t of D.towns){const d=hav(p,[t[1],t[2]]);if(d<bd){bd=d;best=t[0];}}return {name:best+', TX',d:bd};}

/* ——— header ——— */
function placeBadge(){const b=document.querySelector('.brand');document.documentElement.style.setProperty('--brand-w',b.getBoundingClientRect().width+'px');}
addEventListener('resize',placeBadge);document.querySelector('.brand img').addEventListener('load',placeBadge);placeBadge();
function setNav(which){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===which));}
addEventListener('scroll',()=>document.getElementById('hdr').classList.toggle('solid',scrollY>8),{passive:true});
document.getElementById('userChip').addEventListener('click',()=>{sessionStorage.removeItem('afd_demo');location.hash='#/login';toast('Signed out of the demo.');});

/* ——— LOGIN ——— */
function viewLogin(){
  document.body.classList.add('is-login');
  app.innerHTML = `
  <section class="login view">
    <div class="login-media">
      <img src="assets/img/hero.webp" alt="AFD truck with an oversize pressure vessel on a perimeter trailer">
      <div class="login-copy">
        <p class="eyebrow rise" style="--i:0">Customer Portal</p>
        <h1 class="rise" style="--i:1">Track your load<br><span class="outline">every mile</span></h1>
        <p class="rise" style="--i:2">See where your freight is, what step it's on, and every permit, photo and document in one place.</p>
      </div>
    </div>
    <div class="login-panel">
      <form class="login-card" id="loginForm" novalidate>
        <p class="eyebrow rise" style="--i:1">Sign in</p>
        <h2 class="rise" style="--i:2">Welcome back</h2>
        <p class="lead rise" style="--i:3">Use the email your AFD dispatcher has on file.</p>
        <label class="field rise" style="--i:4"><span>Email</span><input type="email" name="email" autocomplete="username" placeholder="you@company.com"></label>
        <label class="field rise" style="--i:5"><span>Password</span><input type="password" name="pw" autocomplete="current-password" placeholder="••••••••"></label>
        <div class="login-row rise" style="--i:6"><label><input type="checkbox" checked> Keep me signed in</label><a href="#" id="forgot">Forgot password?</a></div>
        <div class="login-actions rise" style="--i:7">
          <button class="btn btn-primary" type="submit"><span class="spin"></span><span class="lbl">Sign in</span> ${ICON.arrow}</button>
          <div class="or">or</div>
          <button class="btn btn-ghost" type="button" id="demoBtn">View demo</button>
        </div>
        <p class="login-help rise" style="--i:8">Demo only: any email and password will work. Need access? Email <a href="mailto:quotes@afd-web.com">quotes@afd-web.com</a> or call <a href="tel:+12816515462">(281) 651-5462</a>.</p>
      </form>
    </div>
  </section>`;
  const go = btn => { btn.classList.add('loading'); setTimeout(()=>{sessionStorage.setItem('afd_demo','1');location.hash='#/dashboard';},750); };
  document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();go(e.target.querySelector('.btn-primary'));});
  document.getElementById('demoBtn').addEventListener('click',e=>go(document.querySelector('#loginForm .btn-primary')));
  document.getElementById('forgot').addEventListener('click',e=>{e.preventDefault();toast('Demo: password reset would be sent by email.');});
}

/* ——— DASHBOARD ——— */
function sketch(l){
  const c=R[l.route].coords; let a=90,b=-90,m=180,n=-180;
  c.forEach(p=>{a=Math.min(a,p[0]);b=Math.max(b,p[0]);m=Math.min(m,p[1]);n=Math.max(n,p[1]);});
  const W=400,H=250,pad=40,sx=(W-2*pad)/(n-m),sy=(H-2*pad)/(b-a),s=Math.min(sx,sy),ox=(W-(n-m)*s)/2,oy=(H-(b-a)*s)/2;
  const pts=c.map(p=>[(p[1]-m)*s+ox,(b-p[0])*s+oy]);
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
  const s0=pts[0],e=pts[pts.length-1];
  return `<svg class="sketch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><radialGradient id="g${l.id}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#1c3148"/><stop offset="1" stop-color="#08111b"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g${l.id})"/>
    <path d="${d}" fill="none" stroke="#6cbcf2" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" opacity=".9"><animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.6s" repeatCount="indefinite"/></path>
    <circle cx="${s0[0]}" cy="${s0[1]}" r="7" fill="#2b8be0" stroke="#fff" stroke-width="3"/><circle cx="${e[0]}" cy="${e[1]}" r="7" fill="#ffc21a" stroke="#fff" stroke-width="3"/>
  </svg>`;
}
function card(l,i){
  const ph=l.photos[0];
  const media = ph ? `<div class="bg" style="background-image:url(${ph.src})"></div><img src="${ph.src}" alt="${esc(l.cargo)} on an AFD trailer" loading="lazy">`
                   : `${sketch(l)}<span class="no-photo">Photos added at pickup</span>`;
  const bars = STEPS.map((s,k)=>`<span class="${stepState(l,k)}" style="--d:${k}"></span>`).join('');
  return `<a class="card rise" style="--i:${i+2};--accent:${COLORS[l.status]}" href="#/load/${l.id}">
    <div class="media">${media}</div>
    <div class="card-body">
      <div class="card-top"><span class="lid">${l.id} · ${l.po}</span>${badge(l)}</div>
      <h3>${esc(l.cargo)}</h3>
      <div class="lane">${esc(l.from.city)} ${ICON.arrow} <span class="to">${esc(l.to.city)}</span></div>
      <div class="prog">
        <div class="prog-meta"><span>${esc(stepText(l))}</span><b>${l.delivered?'':'ETA '}${esc(l.etaShort)}</b></div>
        <div class="steps-mini">${bars}</div>
      </div>
      <span class="open">View load ${ICON.arrow}</span>
    </div></a>`;
}
function viewDashboard(q){
  document.body.classList.remove('is-login');
  const f=(q.get('f')||'all'); setNav(f==='delivered'?'history':'dashboard');
  const L=D.loads, active=L.filter(l=>!l.delivered), moving=L.filter(l=>l.moving);
  app.innerHTML = `
  <div class="view">
  <section class="page-hero"><div class="container">
    <div class="hero-row">
      <div><p class="eyebrow rise" style="--i:0">${esc(D.customer.company)}</p>
      <h1 class="rise" style="--i:1">Your loads, <span class="outline">live</span></h1>
      <p class="rise" style="--i:2">Every load, every step. Open a load to see the map, permits, photos and paperwork.</p></div>
      <a class="btn btn-primary rise" style="--i:2" href="mailto:quotes@afd-web.com?subject=New%20quote%20request">Request a quote ${ICON.arrow}</a>
    </div>
    <div class="stats rise" style="--i:3">
      <div class="stat"><b data-n="${active.length}">0</b><span>Active loads</span></div>
      <div class="stat"><b data-n="${moving.length}">0</b><span>On the road now</span></div>
      <div class="stat"><b data-n="${L.length-active.length}">0</b><span>Delivered this month</span></div>
      <div class="stat"><b data-n="100" data-s="%">0</b><span>On-time delivery</span></div>
    </div>
  </div></section>
  <section class="container">
    <div class="toolbar rise" style="--i:3">
      <div class="chips" role="tablist">
        <button class="chip" data-f="all">All<i>${L.length}</i></button>
        <button class="chip" data-f="active">Active<i>${active.length}</i></button>
        <button class="chip" data-f="delivered">Delivered<i>${L.length-active.length}</i></button>
      </div>
      <label class="search">${ICON.search}<input type="search" id="q" placeholder="Search load #, PO or city" aria-label="Search loads"></label>
    </div>
    <div class="cards" id="cards"></div>
  </section></div>`;
  const cards=document.getElementById('cards'); let cur=f, term='';
  function draw(){
    const list=L.filter(l=>cur==='all'||(cur==='active'?!l.delivered:l.delivered)).filter(l=>!term||(l.id+l.po+l.cargo+l.from.city+l.to.city).toLowerCase().includes(term));
    cards.innerHTML=list.length?list.map(card).join(''):'<div class="empty">No loads match your search.</div>';
    document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.f===cur));
    requestAnimationFrame(()=>setTimeout(()=>cards.querySelectorAll('.steps-mini').forEach(s=>s.classList.add('go')),60));
  }
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{cur=c.dataset.f;draw();}));
  document.getElementById('q').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();draw();});
  draw();
  document.querySelectorAll('.stat b').forEach((b,k)=>{const n=+b.dataset.n,s=b.dataset.s||'';const t0=performance.now()+300+k*90;
    (function tick(t){const p=Math.min(1,Math.max(0,(t-t0)/900));b.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(tick);else b.parentNode.classList.add('lit');})(performance.now());});
}

/* ——— LOAD DETAIL ——— */
function viewLoad(id){
  document.body.classList.remove('is-login'); setNav('dashboard');
  const l=D.loads.find(x=>x.id===id); if(!l){location.hash='#/dashboard';return;}
  const rt=prepRoute(R[l.route].coords), miles=R[l.route].miles;
  const tl=STEPS.map((s,i)=>{const st=stepState(l,i);const node=st==='done'?ICON.check:(st==='cur'?ICON.truck.replace('viewBox','style="width:16px;height:16px" viewBox'):(i+1));
    const when=l.times[i]?l.times[i]:'Not yet';
    return `<li class="${st}" style="--i:${i}"><span class="node">${node}</span><b>${s}</b><time>${st==='cur'?'Started '+when:when}</time><p>${esc(l.notes[i])}</p></li>`;}).join('');
  const sp=l.specs, specKeys=Object.keys(sp);
  const specs=specKeys.map((k,i)=>`<div class="${i<4?'big':''}"><small>${k}</small><b>${esc(sp[k])}</b></div>`).join('')+`<div><small>Route length</small><b>${miles} mi</b></div>`;
  const gal=l.photos.length?`<div class="gallery">${l.photos.map((p,i)=>`<button class="ph" data-i="${i}"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${esc(p.cap)}" loading="lazy"><figcaption>${esc(p.cap)}<small>${esc(p.when)}</small></figcaption></button>`).join('')}</div>`
    :`<div class="ph-empty">${ICON.cam}<b>No photos yet</b><br>Your driver adds photos at pickup and at delivery.</div>`;
  const docs=l.docs.map(d=>`<li class="${d.ok?'':'pending'}"><span class="doc-ico">PDF</span><span class="doc-t"><b>${esc(d.name)}</b><small>${esc(d.meta)}</small></span><button type="button">${d.ok?'View':'Pending'}</button></li>`).join('');
  const hudLoc = l.delivered ? l.to.city : (l.moving ? '…' : l.from.city);
  app.innerHTML=`
  <div class="view container">
    <a class="crumb" href="#/dashboard">${ICON.back} All loads</a>
    <div class="detail-head">
      <div><div class="card-top" style="justify-content:flex-start;gap:14px"><span class="lid">${l.id} · ${l.po}</span>${badge(l)}</div>
        <h1>${esc(l.cargo)}</h1>
        <div class="lane">${esc(l.from.city)} ${ICON.arrow} <span class="to">${esc(l.to.city)}</span><span class="muted">· ${miles} mi</span></div></div>
      <div class="eta-box"><small>${l.delivered?'Delivered':'Estimated arrival'}</small><b>${esc(l.eta.replace('Delivered ',''))}</b></div>
    </div>
    <div class="detail-grid">
      <div class="main-col">
        <section class="panel p-map">
          <div class="panel-h"><h3>${l.moving?'Live location':'Route map'}</h3><div class="legend"><span><i class="l1"></i>Traveled</span><span><i class="l2"></i>State-assigned permit route</span></div></div>
          <div class="map-wrap"><div id="map" aria-label="Map of the route"></div>
            <div class="map-tools"><button type="button" id="fitBtn">Full route</button>${l.moving?'<button type="button" id="followBtn">Follow truck</button>':''}</div>
            <div class="map-hud">
              <div><small>Current location</small><b id="hLoc">${esc(hudLoc)}</b></div>
              <div><small>${l.moving?'Status':'Status'}</small><b id="hSpd">${l.moving?'Moving · '+l.speed:STEPS[l.status]}</b></div>
              <div><small>Miles left</small><b id="hMi">${l.delivered?0:miles}</b></div>
              <div><small>Last update</small><b id="hUpd">${l.moving?'Just now':(l.times[l.status]||'')}</b></div>
            </div></div>
        </section>
        <section class="panel p-specs"><div class="panel-h"><h3>Load details</h3><span class="muted" style="font-size:.9rem">${esc(l.from.place)} → ${esc(l.to.place)}</span></div><div class="specs">${specs}</div></section>
        <section class="panel p-photos"><div class="panel-h"><h3>Pickup &amp; delivery photos</h3><span class="muted" style="font-size:.9rem">${l.photos.length} photo${l.photos.length===1?'':'s'}</span></div><div class="panel-b">${gal}</div></section>
      </div>
      <aside class="side">
        <section class="panel p-prog"><div class="panel-h"><h3>Progress</h3><span class="muted" style="font-size:.9rem">${l.status+ (stepState(l,l.status)==='done'?1:0)} of 5 done</span></div><div class="panel-b"><ol class="tl">${tl}</ol></div></section>
        <section class="panel p-docs"><div class="panel-h"><h3>Documents</h3></div><div class="panel-b"><ul class="docs">${docs}</ul></div></section>
        <section class="panel p-disp dispatch"><div class="panel-h"><h3>Your dispatcher</h3><span class="online">Online</span></div><div class="panel-b">
          <div class="disp-who"><span class="avatar">AFD</span><div><b>AFD Dispatch Team</b><small>Main Terminal · Conroe, TX</small></div></div>
          <a class="disp-line" href="tel:+12816515462">${ICON.phone}(281) 651-5462</a>
          <a class="disp-line" href="mailto:quotes@afd-web.com?subject=${encodeURIComponent('Question about load '+l.id)}">${ICON.mail}quotes@afd-web.com</a>
          <div class="disp-line">${ICON.clock}Mon–Fri 7 AM – 6 PM CT</div>
          <div class="disp-btns"><a class="btn btn-primary btn-sm" href="tel:+12816515462">Call</a><a class="btn btn-ghost btn-sm" href="mailto:quotes@afd-web.com?subject=${encodeURIComponent('Question about load '+l.id)}">Email</a></div>
        </div></section>
      </aside>
    </div>
  </div>`;
  app.querySelectorAll('.docs button').forEach(b=>b.addEventListener('click',()=>toast('Sample document. In the live portal this opens the PDF.')));
  app.querySelectorAll('.ph').forEach(b=>b.addEventListener('click',()=>openLB(l.photos,+b.dataset.i)));
  initMap(l,rt,miles);
}

function initMap(l,rt,miles){
  if(!window.L){document.getElementById('map').innerHTML='<p style="padding:20px">Map could not load.</p>';return;}
  const small = innerWidth<640;
  const map=L.map('map',{maxZoom:16,zoomSnap:.25,zoomControl:!small,attributionControl:true,scrollWheelZoom:false,tap:true});
  const esri='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  L.tileLayer(esri+'World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,attribution:'Tiles &copy; Esri, HERE, Garmin &copy; OpenStreetMap contributors'}).addTo(map);
  L.tileLayer(esri+'World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,pane:'shadowPane',opacity:.9}).addTo(map);
  cleanup.push(()=>map.remove());
  const padB = small?120:110;
  const fit=()=>map.fitBounds(L.latLngBounds(rt.c),{paddingTopLeft:[small?30:70,70],paddingBottomRight:[30,padB],animate:true});
  fit();
  L.polyline(rt.c,{color:'#6cbcf2',weight:4,opacity:.85,dashArray:'8 9',lineCap:'round'}).addTo(map);
  L.polyline(rt.c,{color:'#6cbcf2',weight:12,opacity:.08}).addTo(map);
  const glow=L.polyline([],{color:'#ffc21a',weight:12,opacity:.18}).addTo(map);
  const done=L.polyline([],{color:'#ffc21a',weight:5,opacity:1,lineCap:'round'}).addTo(map);
  const pin=(cls)=>L.divIcon({className:'',html:`<div class="pin ${cls}"></div>`,iconSize:[16,16],iconAnchor:[8,8]});
  const west = rt.c[0][1] < rt.c[rt.c.length-1][1];
  L.marker(rt.c[0],{icon:pin('a'),keyboard:false}).addTo(map).bindTooltip('Pickup · '+l.from.city,{className:'tt',direction:west?'right':'left',offset:west?[12,0]:[-12,0],permanent:!l.moving});
  L.marker(rt.c[rt.c.length-1],{icon:pin('b'),keyboard:false}).addTo(map).bindTooltip('Delivery · '+l.to.city,{className:'tt',direction:west?'left':'right',offset:west?[-12,0]:[12,0],permanent:!l.moving});
  if(l.status<2){ return; } // no truck assigned yet
  const cls=l.delivered?'done':(l.moving?'':'parked');
  const tIcon=L.divIcon({className:'',html:`<div class="truck-ico ${cls}"><span class="ring"></span><span class="dot">${l.delivered?ICON.check.replace('<svg','<svg style="width:18px;height:18px;color:#08111b"'):ICON.truck}</span></div>`,iconSize:[46,46],iconAnchor:[23,23]});
  const truck=L.marker(rt.c[0],{icon:tIcon,zIndexOffset:1000}).addTo(map);
  truck.bindTooltip(l.moving?'Your load':(l.delivered?'Delivered':'Loaded · ready to depart'),{className:'tt',direction:'right',offset:[24,0]});
  const hLoc=document.getElementById('hLoc'),hMi=document.getElementById('hMi'),hUpd=document.getElementById('hUpd');
  let prog=0, follow=false;
  function place(f){const pa=pointAt(rt,f);truck.setLatLng(pa.p);const s=sliceTo(rt,f);done.setLatLngs(s);glow.setLatLngs(s);
    if(l.moving){const t=nearestTown(pa.p);hLoc.textContent=(t.d<6?'In ':'Near ')+t.name;hMi.textContent=Math.max(0,Math.round(miles*(1-f)));if(follow)map.panTo(pa.p,{animate:true,duration:.8});}}
  const target=l.progress; const t0=performance.now()+700, dur=l.moving?2600:1600;
  if(!l.moving&&!l.delivered){place(0);return;}
  let raf;(function anim(t){const p=Math.min(1,Math.max(0,(t-t0)/dur));const e=1-Math.pow(1-p,3);prog=target*e;place(prog);if(p<1)raf=requestAnimationFrame(anim);else if(l.moving)startLive();})(performance.now());
  cleanup.push(()=>cancelAnimationFrame(raf));
  function startLive(){
    let last=Date.now();
    const creep=setInterval(()=>{prog=Math.min(.99,prog+0.00018);place(prog);},1000);
    const ago=setInterval(()=>{const s=Math.round((Date.now()-last)/1000);hUpd.textContent=s<5?'Just now':s+' sec ago';if(s>=20){last=Date.now();hUpd.textContent='Just now';hUpd.animate([{color:'#ffc21a'},{color:'#eaf1f8'}],{duration:1200});}},1000);
    cleanup.push(()=>{clearInterval(creep);clearInterval(ago);});
  }
  document.getElementById('fitBtn').onclick=()=>{follow=false;const fb=document.getElementById('followBtn');if(fb)fb.textContent='Follow truck';fit();};
  const fb=document.getElementById('followBtn');
  if(fb) fb.onclick=()=>{follow=!follow;fb.textContent=follow?'Following':'Follow truck';if(follow)map.flyTo(truck.getLatLng(),10,{duration:1.2});};
}

/* ——— lightbox ——— */
const lb=document.getElementById('lb'); let lbSet=[],lbI=0;
function showLB(){const p=lbSet[lbI];lb.querySelector('img').src=p.src;lb.querySelector('img').alt=p.cap;lb.querySelector('figcaption').textContent=p.cap+' · '+p.when;lb.querySelectorAll('.lb-nav').forEach(b=>b.style.display=lbSet.length>1?'':'none');}
function openLB(set,i){lbSet=set;lbI=i;showLB();lb.classList.add('on');lb.setAttribute('aria-hidden','false');}
function closeLB(){lb.classList.remove('on');lb.setAttribute('aria-hidden','true');}
lb.querySelector('.lb-close').onclick=closeLB;
lb.addEventListener('click',e=>{if(e.target===lb)closeLB();});
lb.querySelector('.lb-prev').onclick=()=>{lbI=(lbI-1+lbSet.length)%lbSet.length;showLB();};
lb.querySelector('.lb-next').onclick=()=>{lbI=(lbI+1)%lbSet.length;showLB();};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')lb.querySelector('.lb-next').click();if(e.key==='ArrowLeft')lb.querySelector('.lb-prev').click();});

/* ——— router ——— */
function route(){
  cleanup.forEach(f=>{try{f();}catch(e){}});cleanup=[];
  const h=location.hash.replace(/^#/,'')||'/login';const [path,qs]=h.split('?');const q=new URLSearchParams(qs||'');
  if(path!=='/login'&&!signedIn()){location.replace('#/login');return;}
  if(path==='/login'&&signedIn()){location.replace('#/dashboard');return;}
  if(path.startsWith('/load/')) viewLoad(decodeURIComponent(path.slice(6)));
  else if(path==='/dashboard') viewDashboard(q);
  else viewLogin();
  scrollTo({top:0,behavior:'instant'});
  document.title=(path.startsWith('/load/')?path.slice(6)+' · ':path==='/dashboard'?'My loads · ':'')+'AFD Customer Portal — Demo';
}
addEventListener('hashchange',route);
route();
})();
