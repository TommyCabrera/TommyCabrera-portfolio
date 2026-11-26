/* =========================================================
   PAGE TRANSITIONS
========================================================= */
var curtain = document.getElementById('curtain');
var current = 'welcome';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function paintNav(route){
  document.querySelectorAll('.navlink').forEach(function(b){
    if(b.dataset.go === (route === 'case' ? 'work' : route)) b.setAttribute('aria-current','page');
    else b.removeAttribute('aria-current');
  });
}
function swap(route){
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  var el = document.getElementById('v-'+route);
  if(el) el.classList.add('active');
  window.scrollTo(0,0);
  paintNav(route);
  if(typeof paintMenu === 'function') paintMenu(route);
  current = route;
  if(route === 'bench' && typeof fitFlow === 'function') requestAnimationFrame(fitFlow);
  if(route === 'work' && typeof spy === 'function') requestAnimationFrame(spy);
  try{
    if(history.replaceState) history.replaceState(null,'','#'+route);
  }catch(err){ /* sandboxed preview: no history access, routing still works */ }
}
function go(route){
  if(route === current || !document.getElementById('v-'+route)) return;
  if(reduce){ swap(route); return; }
  curtain.classList.remove('out');
  curtain.classList.add('in');
  setTimeout(function(){
    swap(route);
    curtain.classList.remove('in');
    curtain.classList.add('out');
    setTimeout(function(){ curtain.classList.remove('out'); }, 340);
  }, 330);
}
document.addEventListener('click', function(e){
  var t = e.target.closest('[data-go]');
  if(!t) return;
  e.preventDefault();
  var m = document.getElementById('mobilemenu');
  if(m && !m.hidden){ closeMenu(); }
  go(t.dataset.go);
});
var startRoute = 'welcome';
try{ if(location.hash && location.hash.length > 1) startRoute = location.hash.slice(1); }catch(err){}
if(!document.getElementById('v-'+startRoute) || startRoute === 'case') startRoute = 'welcome';
swap(startRoute);


/* =========================================================
   MOBILE MENU
========================================================= */
var MENU = [
  {r:'welcome', t:'Welcome'},
  {r:'bench',   t:'Bench'},
  {r:'work',    t:'Work'},
  {r:'profile', t:'Profile'},
  {r:'contact', t:'Contact'}
];
var menu = document.getElementById('mobilemenu');
var menuList = document.getElementById('menuList');
var burger = document.getElementById('burger');

menuList.innerHTML = MENU.map(function(m,i){
  return '<button class="menuitem" type="button" data-go="'+m.r+'" style="animation-delay:'+(60+i*45)+'ms">'+
    '<span class="n">'+String(i+1).padStart(2,'0')+'</span>'+
    '<span class="t">'+m.t+'</span></button>';
}).join('');

function paintMenu(route){
  if(!menuList) return;              // swap() can run before this block initialises
  var r = (route === 'case') ? 'work' : route;
  menuList.querySelectorAll('.menuitem').forEach(function(b){
    if(b.dataset.go === r) b.setAttribute('aria-current','page');
    else b.removeAttribute('aria-current');
  });
}
function openMenu(){
  paintMenu(current);
  menu.hidden = false;
  document.body.classList.add('menuopen');
  burger.setAttribute('aria-expanded','true');
  var first = menuList.querySelector('.menuitem');
  if(first) first.focus();
}
function closeMenu(){
  menu.hidden = true;
  document.body.classList.remove('menuopen');
  burger.setAttribute('aria-expanded','false');
}
burger.addEventListener('click', openMenu);
document.getElementById('menuClose').addEventListener('click', function(){ closeMenu(); burger.focus(); });
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && !menu.hidden){ closeMenu(); burger.focus(); }
});
window.addEventListener('resize', function(){ if(window.innerWidth > 820 && !menu.hidden) closeMenu(); });

/* =========================================================
   CIRCUIT RAIL
========================================================= */
var RAIL = [
  {n:'Figma',     k:'Where it starts'},
  {n:'FigJam',    k:'Flows and workshops'},
  {n:'Photoshop', k:'Image work'},
  {n:'Illustrator',k:'Icons and print'},
  {n:'Blender',   k:'3D product renders'},
  {n:'Canva',     k:'Brand kits'},
  {n:'Framer',    k:'Fast sites'},
  {n:'Webflow',   k:'Marketing sites'},
  {n:'Wix',       k:'Client sites'},
  {n:'Claude',    k:'Building with AI'}
];
var REFS = ['J1','R12','C9','R1','C4','U2','L3','X1','D7','C8','R4','U5'];


/* pixel dango: one matcha-dusted mochi on a skewer, 11 x 17 grid */
function dangoSVG(){
  var P = 3, cols = { O:'#3B2A2A', K:'#C89B62', C:'#FFF4E2', S:'#EBD8BC', G:'#9CCB86', H:'#C9E8B5', e:'#3B2A2A', m:'#C0566E', b:'#F6A9BC' };
  var rows = [
    '...OOOOO...',
    '.OOGGHGGOO.',
    '.OGHGGGGGO.',
    'OCGGCGGCGCO',
    'OCCCCCCCCCO',
    'OCCeCCCeCCO',
    'OCbCCmCCbCO',
    'OCCCCCCCCSO',
    '.OCCCCCCSO.',
    '.OOCCCCSOO.',
    '...OOOOO...'
  ];
  var out = '';
  rows.forEach(function(r, y){
    r.split('').forEach(function(c, x){ if(cols[c]) out += '<rect x="'+(x*P)+'" y="'+(y*P)+'" width="'+P+'" height="'+P+'" fill="'+cols[c]+'"/>'; });
  });
  return '<svg width="'+(11*P)+'" height="'+(rows.length*P)+'" viewBox="0 0 '+(11*P)+' '+(rows.length*P)+'" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">'+out+'</svg>';
}
var CHIPX = [];
function buildRail(){
  var W = 2560, H = 236, base = 176, x = 40, parts = '', chips = '', refs = '', ri = 0, ci = 0;
  function pad(cx){ return '<circle cx="'+cx+'" cy="'+base+'" r="3.2" fill="none" stroke="#C9C7B4" stroke-width="1"/>'; }
  function ref(cx){
    if(ri >= REFS.length) return '';
    var t = '<text x="'+cx+'" y="'+(base+34)+'" text-anchor="middle" fill="#C9C7B4">'+REFS[ri]+'</text>';
    ri++; return t;
  }
  // baseline trace
  parts += '<line x1="24" y1="'+base+'" x2="'+(W-24)+'" y2="'+base+'" stroke="#C9C7B4" stroke-width="1.4"/>';

  function resistor(cx){
    var d = 'M'+(cx-20)+' '+base;
    for(var i=0;i<6;i++){ d += ' L'+(cx-16+i*6)+' '+(base+(i%2?7:-7)); }
    d += ' L'+(cx+20)+' '+base;
    return '<path d="'+d+'" fill="none" stroke="#B9B7A4" stroke-width="1.4" stroke-linejoin="round"/>';
  }
  function capsule(cx){
    return '<rect x="'+(cx-13)+'" y="'+(base-8)+'" width="26" height="16" rx="8" fill="#EDEADB" stroke="#C9C7B4"/>'+
           '<circle cx="'+(cx-5)+'" cy="'+base+'" r="3" fill="#8B948A" opacity=".5"/>';
  }
  function cap(cx){
    return '<rect x="'+(cx-7)+'" y="'+(base-24)+'" width="14" height="24" rx="6" fill="#E4EEDF" stroke="#C9C7B4"/>'+
           '<line x1="'+(cx-7)+'" y1="'+(base-14)+'" x2="'+(cx+7)+'" y2="'+(base-14)+'" stroke="#C9C7B4"/>';
  }
  function led(cx){
    return '<circle cx="'+cx+'" cy="'+(base-9)+'" r="6" fill="#C3D9BA" stroke="#9DBE93"/>'+
           '<line x1="'+cx+'" y1="'+(base-3)+'" x2="'+cx+'" y2="'+base+'" stroke="#C9C7B4"/>';
  }
  function coil(cx){
    var d='M'+(cx-18)+' '+base;
    for(var i=0;i<4;i++){ d += ' q 4.5 -11 9 0'; }
    return '<path d="'+d+'" fill="none" stroke="#B9B7A4" stroke-width="1.4"/>'+
           '<line x1="'+(cx+18)+'" y1="'+base+'" x2="'+(cx+22)+'" y2="'+base+'" stroke="#C9C7B4"/>';
  }
  function icPins(x0,w){
    var s='';
    for(var px=x0+6; px<x0+w-4; px+=9){
      s += '<line x1="'+px+'" y1="'+(base-2)+'" x2="'+px+'" y2="'+(base+10)+'" stroke="#C9C7B4"/>';
    }
    return s;
  }
  function chip(cx, item, idx){
    var w = Math.max(112, item.n.length*10 + 62), h = 62;
    var x0 = cx - w/2, y0 = base - h - 6;
    var leadX = x0 - 26, leadTop = y0 - 18;
    CHIPX[idx] = cx;
    var g = '<g class="chip" data-i="'+idx+'">';
    g += '<path d="M'+leadX+' '+base+' L'+leadX+' '+leadTop+' L'+(x0+26)+' '+leadTop+'" fill="none" stroke="#DCD9C8" stroke-width="1"/>';
    g += '<circle cx="'+leadX+'" cy="'+base+'" r="3.2" fill="#EDEADB" stroke="#C9C7B4"/>';
    g += '<rect class="chipbox" x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" rx="4"/>';
    g += '<circle cx="'+(x0+11)+'" cy="'+(y0+11)+'" r="2.6" fill="#C9C7B4"/>';
    g += '<rect class="plate" x="'+(x0+14)+'" y="'+(y0+22)+'" width="'+(w-28)+'" height="26" rx="3"/>';
    g += '<text class="chiplabel" x="'+cx+'" y="'+(y0+39)+'" text-anchor="middle">'+item.n+'</text>';
    g += icPins(x0,w);
    g += '</g>';
    return g;
  }

  var seq = ['pad','coil','chip','led','cap','chip','capsule','chip','resistor','chip','pad','led','chip','coil','chip','capsule','chip','cap','pad','chip','resistor','chip','led','chip'];
  for(var s=0; s<seq.length && x < W-150; s++){
    var kind = seq[s];
    if(kind === 'chip'){
      if(ci >= RAIL.length){ continue; }
      var wEst = Math.max(112, RAIL[ci].n.length*10 + 62);
      x += wEst/2 + 14;
      chips += chip(x, RAIL[ci], ci);
      refs += ref(x);
      x += wEst/2 + 22;
      ci++;
    } else {
      x += 26;
      if(kind === 'pad'){ parts += pad(x); }
      else if(kind === 'resistor'){ parts += resistor(x); x += 14; }
      else if(kind === 'capsule'){ parts += capsule(x); }
      else if(kind === 'cap'){ parts += cap(x); }
      else if(kind === 'led'){ parts += led(x); }
      else if(kind === 'coil'){ parts += coil(x); x += 12; }
      x += 26;
    }
  }
  // small pads between everything
  for(var px=60; px<W-40; px+=76){ parts += pad(px); }

  return '<svg class="railsvg" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'+parts+refs+chips+'</svg>';
}
(function(){
  var one = buildRail();
  var two = one.replace('<svg class="railsvg"', '<svg class="railsvg" aria-hidden="true"').replace(/tabindex="0" role="button"/g, 'tabindex="-1"');
  document.getElementById('railHost').innerHTML = '<div class="railtrack">' + one + two + '</div>' +
    '<span class="railspark" aria-hidden="true"><span class="dshadow"></span><span class="dango">' + dangoSVG() + '</span></span>';
})();

var railNum = document.getElementById('railNum'), railName = document.getElementById('railName'), railKind = document.getElementById('railKind');
var railIdx = 0;
function setRail(i){
  railIdx = i;
  document.querySelectorAll('.railsvg g.chip').forEach(function(g){ g.classList.toggle('on', +g.dataset.i === i); });
  railNum.textContent = String(i+1).padStart(2,'0');
  railName.textContent = RAIL[i].n;
  railKind.textContent = RAIL[i].k;
}
setRail(0);

/* --- rail: the board glides past a fixed signal; each tool lights as it crosses --- */
(function(){
  var sc = document.querySelector('.railscroll'), track = document.querySelector('.railtrack');
  if(!sc || !track || reduce) return;
  var off = 0, v = 0, BASE = 0.045, last = 0, paused = false, w = 0, resumeT;
  function measure(){ w = track.firstElementChild.getBoundingClientRect().width; }
  measure(); window.addEventListener('resize', measure);
  function tick(t){
    requestAnimationFrame(tick);
    if(current !== 'welcome' || document.hidden){ last = 0; return; }
    if(!w) measure();
    if(!w) return;
    var dt = last ? Math.min(t - last, 50) : 16; last = t;
    v += ((paused ? 0 : BASE) - v) * Math.min(1, dt / 420);      // ease in and out of pauses
    off = (off + v * dt) % w;
    track.style.transform = 'translate3d(' + (-off) + 'px,0,0)';
    if(paused) return;
    var scale = w / 2560, center = off + sc.clientWidth / 2, near = -1, best = 1e9;
    CHIPX.forEach(function(cx, k){
      var x = cx * scale, d = Math.min(Math.abs(x - center), Math.abs(x + w - center));
      if(d < best){ best = d; near = k; }
    });
    if(near >= 0 && near !== railIdx && best < 70 * scale + 20) setRail(near);
  }
  requestAnimationFrame(tick);
})();

/* =========================================================
   BENCH — tracks
========================================================= */
var TRACKS = [
  {id:'workspace', t:'Workspace',      s:'BENCH · LIVE',              foot:['FIGMA','CURSOR','CLAUDE'], right:'LIVE · NEVER FINISHED'},
  {id:'ai',        t:'AI Workflow',    s:'BUILDER · DAILY',           foot:['DRAG','ARRANGE','READ THE CODE'], right:'DESIGN ↔ CODE'},
  {id:'ds',        t:'Design System',  s:'LIBRARY · 12 PARTS',        foot:['TOKENS','TYPE','COMPONENTS'], right:'DR. PAWS v1.1'},
  {id:'product',   t:'Product Design', s:'END TO END · 10 YRS',       foot:['RESEARCH','FLOWS','SHIP'], right:'SAAS · COMMERCE'},
  {id:'build',     t:'Build & Ship',   s:'SHOPIFY · WEBFLOW · MORE',  foot:['LIQUID','HTML/CSS','JS'], right:'IT GOES LIVE'}
];
var opened = {workspace:true};

var trackList = document.getElementById('trackList');
trackList.innerHTML = TRACKS.map(function(tr,i){
  return '<button class="track" role="tab" data-track="'+tr.id+'" aria-selected="'+(i===0)+'">'+
    '<span class="tt">'+tr.t+'</span><span class="ts">'+tr.s+'</span></button>';
}).join('');

var board = document.getElementById('board');
var stageName = document.getElementById('stageName');
var stageMeta = document.getElementById('stageMeta');
var stageFoot = document.getElementById('stageFoot');
var crumb = document.getElementById('crumb');

/* ---- board renderers ---- */
function isNarrow(){ return window.innerWidth <= 720; }

function boardWorkspaceMobile(){
  board.classList.remove('plain');
  function n(label, cls, d){
    return '<div class="vnode'+(cls?' '+cls:'')+'" style="animation-delay:'+d+'ms">'+label+'</div>';
  }
  board.innerHTML =
    '<div class="vflow">'+
      n('BRIEF','',0)+'<div class="vlink"></div>'+
      n('EXPLORE','',60)+'<div class="vlink"></div>'+
      n('IN THE SYSTEM?','dia',120)+
      '<div class="vbranch">'+
        '<div class="vb"><span class="lbl">YES</span>'+ n('REUSE','',180) +'</div>'+
        '<div class="vb"><span class="lbl">NO</span>'+ n('NEW PATTERN','',180) +
          '<div class="vlink sm"></div>'+ n('ADD TO LIB','',240) +'</div>'+
      '</div>'+
      '<div class="vjoin"></div>'+
      n('SHIP','ship',300)+
    '</div>'+
    '<div class="vnotes">'+
      '<div class="sticky a">Reuse before you add. Every new pattern is a thing somebody has to maintain.</div>'+
      '<div class="sticky b">Empty state? Ask design.</div>'+
      '<div class="chatcard"><div class="k">PAIRING</div>'+
        '<div class="q">make the referral card crop the second line</div>'+
        '<div class="a">On it — a 24px reveal on the second line.</div>'+
        '<div class="f">Editing ReferralCard.tsx</div></div>'+
    '</div>';
}

function boardWorkspace(){
  if(isNarrow()) return boardWorkspaceMobile();
  board.classList.remove('plain');
  var nodes = [
    {x:0,   y:60,  l:'BRIEF'},
    {x:150, y:60,  l:'EXPLORE'},
    {x:298, y:44,  l:'IN THE<br>SYSTEM?', dia:true},
    {x:470, y:60,  l:'REUSE'},
    {x:300, y:196, l:'NEW PATTERN'},
    {x:470, y:196, l:'ADD TO LIB'},
    {x:620, y:128, l:'SHIP', ship:true}
  ];
  var html = '<div class="flowfit"><div class="flow"><svg class="wires" viewBox="0 0 740 440" preserveAspectRatio="none">' +
    '<polygon points="366,40 434,84 366,128 298,84" fill="#FCFBF5" stroke="#C9C7B4" stroke-width="1"/>' +
    '<path d="M118 84 L148 84"/>' +
    '<path d="M268 84 L296 84"/>' +
    '<path d="M436 84 L468 84"/>' +
    '<path d="M366 130 L366 194"/>' +
    '<path d="M418 220 L468 220"/>' +
    '<path d="M590 84 L604 84 L604 151 L618 151"/>' +
    '<path d="M590 220 L604 220 L604 151"/>' +
    '<text x="444" y="76">YES</text><text x="374" y="166">NO</text>' +
    '</svg>';
  nodes.forEach(function(n,i){
    html += '<div class="node'+(n.dia?' dia':'')+(n.ship?' ship':'')+'" style="left:'+n.x+'px;top:'+n.y+'px;animation-delay:'+(i*55)+'ms">'+n.l+'</div>';
  });
  html += '<div class="sticky a" style="left:0;top:262px">Reuse before you add. Every new pattern is a thing somebody has to maintain.</div>';
  html += '<div class="sticky b" style="left:236px;top:288px">Empty state? Ask design.</div>';
  html += '<div class="chatcard" style="left:470px;top:286px">'+
          '<div class="k">PAIRING</div>'+
          '<div class="q">make the referral card crop the second line</div>'+
          '<div class="a">On it — a 24px reveal on the second line.</div>'+
          '<div class="f">Editing ReferralCard.tsx</div></div>';
  html += '</div></div>';
  board.innerHTML = html;
  requestAnimationFrame(fitFlow);
}
function fitFlow(){
  var f = document.querySelector('.flow');
  if(!f) return;
  var host = f.parentElement;
  var avail = host.clientWidth;
  if(!avail) return;               // view is hidden — retry when it is shown
  var sc = Math.min(1, avail / 740);
  f.style.transform = sc < 1 ? 'scale(' + sc + ')' : '';
  host.style.height = Math.round(446 * sc) + 'px';
}
var lastNarrow = isNarrow(), resizeTimer;
window.addEventListener('resize', function(){
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    var sel = document.querySelector('.track[aria-selected="true"]');
    if(sel && sel.dataset.track === 'workspace' && isNarrow() !== lastNarrow){
      lastNarrow = isNarrow();
      boardWorkspace();
    } else {
      fitFlow();
    }
  }, 140);
});

function boardDS(){
  board.classList.add('plain');
  board.innerHTML =
  '<div class="dsgrid">'+
    '<div class="dscell"><div class="k">COLOUR · 6 TOKENS</div>'+
      '<div class="swatches">'+
        '<i style="background:#26302A"></i><i style="background:#40593D"></i><i style="background:#6E8F68"></i>'+
        '<i style="background:#9DBE93"></i><i style="background:#C3D9BA"></i><i style="background:#F5F3E7"></i>'+
      '</div>'+
      '<p style="font-size:13px;margin:12px 0 0">One accent, one ink, four steps between. On Dr. Paws this replaced three competing greens after a contrast audit.</p>'+
    '</div>'+
    '<div class="dscell"><div class="k">TYPE · 5 STEPS</div>'+
      '<div class="scale">'+
        '<div><span>34</span><b style="font-size:22px;font-weight:600;letter-spacing:-.03em">Display</b></div>'+
        '<div><span>19</span><b style="font-size:17px;font-weight:500">Section lead</b></div>'+
        '<div><span>16</span><span style="font-size:15px;color:var(--ink);font-family:var(--sans);width:auto">Body copy</span></div>'+
        '<div><span>13</span><span style="font-size:13px;color:var(--ink-2);font-family:var(--sans);width:auto">Supporting</span></div>'+
        '<div><span>11</span><span class="mono" style="width:auto">SYSTEM LABEL</span></div>'+
      '</div>'+
    '</div>'+
    '<div class="dscell"><div class="k">COMPONENTS · 12 PARTS</div>'+
      '<div class="parts">'+
        '<div class="done">Buttons — primary, outline, ghost</div>'+
        '<div class="done">Form fields + validation states</div>'+
        '<div class="done">Product card / PDP block</div>'+
        '<div class="done">Quiz step + progress</div>'+
        '<div class="done">Data table + empty state</div>'+
        '<div>Modal + drawer</div>'+
        '<div>Toast + alert tiers</div>'+
      '</div>'+
      '<p style="font-size:13px;margin:14px 0 0">Two button tiers, not four. Every removal is an argument I had to win.</p>'+
    '</div>'+
  '</div>';
}

function boardProduct(){
  board.classList.add('plain');
  board.innerHTML =
  '<div class="steps">'+
    '<div class="step"><div class="n">01</div><h4>Needfinding</h4><p>Interviews across departments, globally. On XtendOps that meant rebuilding the information architecture from scratch.</p></div>'+
    '<div class="step"><div class="n">02</div><h4>Flows &amp; wireframes</h4><p>Sketches, flow diagrams, then wireframes. Cheap to argue with, cheap to throw away.</p></div>'+
    '<div class="step"><div class="n">03</div><h4>High fidelity</h4><p>Figma, on the design system. If a component does not exist yet, it gets designed as a component.</p></div>'+
    '<div class="step"><div class="n">04</div><h4>Implementation</h4><p>I stay with it. Sometimes reviewing, often writing the frontend myself.</p></div>'+
  '</div>'+
  '<div class="platgrid">'+
    '<div class="plat"><div class="k">CASE</div><h4>Healthcare HR, in German</h4><p>Users are nurses mid-shift. Large type, plain language, 44px targets, and a violation-alert hierarchy that surfaces severity instead of hiding it.</p></div>'+
    '<div class="plat"><div class="k">CASE</div><h4>AI agent builder, internal</h4><p>Raw JSON and five overlapping save buttons replaced by a visual flow, a contextual step editor and simulate-before-publish. Six weeks, no backend changes.</p></div>'+
    '<div class="plat"><div class="k">CASE</div><h4>Supplement commerce, AU, MY + global</h4><p>Design system, 20+ pages, quiz funnel, referral programme, packaging and 3D renders. Localised down to currency, phone format and consumer law.</p></div>'+
  '</div>';
}

function boardBuild(){
  board.classList.add('plain');
  board.innerHTML =
  '<div class="platgrid">'+
    '<div class="plat"><div class="k">COMMERCE</div><h4>Shopify</h4><p>Liquid templates, PDPs, quiz funnels and referral app integration for a supplement brand selling into Australia and Malaysia.</p></div>'+
    '<div class="plat"><div class="k">MARKETING SITES</div><h4>Webflow</h4><p>Design-system-backed marketing builds — CMS collections, responsive breakpoints, handover a client can actually edit.</p></div>'+
    '<div class="plat"><div class="k">FAST SITES</div><h4>Framer</h4><p>Where a site needs to be live this week and still feel designed. My own portfolio ran on it.</p></div>'+
    '<div class="plat"><div class="k">LONG TAIL</div><h4>WordPress</h4><p>Six years of it. Theme work, custom layouts, PHP where needed, and large e-commerce builds with multi-currency pricing.</p></div>'+
    '<div class="plat"><div class="k">HAND-WRITTEN</div><h4>HTML, CSS, JavaScript</h4><p>React and Svelte for product UI, Tailwind day to day, Material UI where a team already lives there. Prototypes ship as real code.</p></div>'+
    '<div class="plat"><div class="k">GRAPHICS</div><h4>Illustrator, Photoshop &amp; Blender</h4><p>SVG icon sets, packaging labels to print spec, campaign posters, trade catalogues, and 3D product renders in Blender for product pages and marketplaces. The brand does not stop at the browser.</p></div>'+
  '</div>';
}

/* ---- AI workflow board: drag & drop builder ---- */
var BLOCKS = {
  nav:  {label:'Nav bar',  render:'<div class="c-nav">MENU<span class="burger"><i></i><i></i><i></i></span></div>',
         code:['<header class="nav">','  <span class="nav__brand">Menu</span>','  <button class="nav__toggle" aria-label="Open menu"></button>','</header>']},
  hero: {label:'Hero',     render:'<div class="c-hero"><b>Gut Glow</b><small>Daily gut support, clinically dosed and vet reviewed.</small></div>',
         code:['<section class="hero">','  <h1>Gut Glow</h1>','  <p>Daily gut support, clinically dosed and vet reviewed.</p>','</section>']},
  cards:{label:'Card grid',render:'<div class="c-cards"><div><i></i>SKIN</div><div><i></i>JOINTS</div></div>',
         code:['<ul class="grid">','  <li class="card"><img src="/skin.webp" alt=""><h3>Skin</h3></li>','  <li class="card"><img src="/joints.webp" alt=""><h3>Joints</h3></li>','</ul>']},
  quiz: {label:'Quiz step',render:'<div class="c-quiz"><b>How old is your dog?</b><span>Under 2 years</span><span>2 to 7 years</span><span>7+ years</span></div>',
         code:['<fieldset class="quiz">','  <legend>How old is your dog?</legend>','  <label><input type="radio" name="age" value="puppy"> Under 2 years</label>','  <label><input type="radio" name="age" value="adult"> 2 to 7 years</label>','  <label><input type="radio" name="age" value="senior"> 7+ years</label>','</fieldset>']},
  chart:{label:'Chart',    render:'<div class="c-chart"><i style="height:34%"></i><i style="height:58%"></i><i style="height:41%"></i><i style="height:82%"></i><i style="height:66%"></i></div>',
         code:['<figure class="chart" role="img" aria-label="Shifts covered this week">','  <div class="bar" style="--v:34%"></div>','  <div class="bar" style="--v:58%"></div>','  <div class="bar" style="--v:41%"></div>','  <div class="bar" style="--v:82%"></div>','  <div class="bar" style="--v:66%"></div>','</figure>']},
  table:{label:'Data rows',render:'<div class="c-table"><div><span>Mara S.</span><span>07:00</span></div><div><span>Ines K.</span><span>13:30</span></div><div><span>Ruth O.</span><span>21:00</span></div></div>',
         code:['<table class="shifts">','  <tbody>','    <tr><td>Mara S.</td><td>07:00</td></tr>','    <tr><td>Ines K.</td><td>13:30</td></tr>','    <tr><td>Ruth O.</td><td>21:00</td></tr>','  </tbody>','</table>']},
  cta:  {label:'Call to action',render:'<div class="c-cta"><span>Add to cart</span></div>',
         code:['<button class="btn btn--primary" type="submit">Add to cart</button>']},
  foot: {label:'Footer',   render:'<div class="c-foot">© 2026 · PRIVACY · CONTACT</div>',
         code:['<footer class="site-foot">','  <p>&copy; 2026</p>','  <a href="/privacy">Privacy</a>','  <a href="/contact">Contact</a>','</footer>']}
};
var PRESETS = {
  'Dr. Paws PDP':['nav','hero','cards','cta','foot'],
  'Shift AI':['nav','table','chart','foot'],
  'Quiz funnel':['nav','quiz','cta','foot']
};
var state = ['nav','hero','cards','cta','foot'];

function boardAI(){
  board.classList.add('plain');
  var blocks = Object.keys(BLOCKS).map(function(k,i){
    return '<button class="blockbtn'+(i%3===2?' alt':'')+'" draggable="true" data-key="'+k+'"><i></i>'+BLOCKS[k].label+'</button>';
  }).join('');
  var presets = Object.keys(PRESETS).map(function(p){
    return '<button type="button" data-preset="'+p+'">'+p.toUpperCase()+'</button>';
  }).join('');
  board.innerHTML =
  '<div class="builder">'+
    '<div class="blocklist">'+
      '<div class="hd">BLOCKS — DRAG OR TAP</div>'+ blocks +
      '<div class="hd" style="margin-top:14px">LOAD A REAL SCREEN</div>'+
      '<div class="presetrow">'+presets+'</div>'+
    '</div>'+
    '<div class="viewport">'+
      '<div class="vtabs" role="tablist">'+
        '<button class="vtab" role="tab" id="vt-d" aria-selected="true">DESIGN</button>'+
        '<button class="vtab" role="tab" id="vt-c" aria-selected="false">CODE</button>'+
        '<button class="vtab right" type="button" id="vt-clear">CLEAR</button>'+
      '</div>'+
      '<div class="vbody" id="vp-d"><div class="screen"><div class="canvas" id="canvas"></div></div></div>'+
      '<div id="vp-c" hidden><pre class="code" id="codeOut"></pre></div>'+
    '</div>'+
  '</div>';
  wireBuilder();
  paintCanvas();
}

function wireBuilder(){
  var canvas = document.getElementById('canvas');
  board.querySelectorAll('.blockbtn').forEach(function(b){
    b.addEventListener('click', function(){ state.push(b.dataset.key); paintCanvas(); });
    b.addEventListener('dragstart', function(e){ e.dataTransfer.setData('text/plain', b.dataset.key); });
  });
  board.querySelectorAll('[data-preset]').forEach(function(b){
    b.addEventListener('click', function(){ state = PRESETS[b.dataset.preset].slice(); paintCanvas(); });
  });
  canvas.addEventListener('dragover', function(e){ e.preventDefault(); canvas.classList.add('over'); });
  canvas.addEventListener('dragleave', function(){ canvas.classList.remove('over'); });
  canvas.addEventListener('drop', function(e){
    e.preventDefault(); canvas.classList.remove('over');
    var k = e.dataTransfer.getData('text/plain');
    if(BLOCKS[k]){ state.push(k); paintCanvas(); }
  });
  var td = document.getElementById('vt-d'), tc = document.getElementById('vt-c');
  td.addEventListener('click', function(){ setVTab(true); });
  tc.addEventListener('click', function(){ setVTab(false); });
  document.getElementById('vt-clear').addEventListener('click', function(){ state = []; paintCanvas(); });
}
function setVTab(design){
  document.getElementById('vt-d').setAttribute('aria-selected', design);
  document.getElementById('vt-c').setAttribute('aria-selected', !design);
  document.getElementById('vp-d').hidden = !design;
  document.getElementById('vp-c').hidden = design;
}
function paintCanvas(){
  var canvas = document.getElementById('canvas');
  if(!canvas) return;
  canvas.innerHTML = '';
  if(!state.length){
    var e = document.createElement('div');
    e.className = 'empty';
    e.textContent = 'EMPTY SCREEN — DRAG A BLOCK IN, OR LOAD A REAL ONE';
    canvas.appendChild(e);
  } else {
    state.forEach(function(k,i){
      var w = document.createElement('div');
      w.className = 'item';
      w.innerHTML = BLOCKS[k].render +
        '<span class="tools">'+
        '<button type="button" data-a="up" aria-label="Move '+BLOCKS[k].label+' up">&#9650;</button>'+
        '<button type="button" data-a="dn" aria-label="Move '+BLOCKS[k].label+' down">&#9660;</button>'+
        '<button type="button" data-a="rm" aria-label="Remove '+BLOCKS[k].label+'">&#10005;</button></span>';
      w.querySelectorAll('.tools button').forEach(function(btn){
        btn.addEventListener('click', function(){
          var a = btn.dataset.a, j;
          if(a==='rm'){ state.splice(i,1); }
          else { j = i + (a==='up' ? -1 : 1); if(j<0||j>=state.length) return; var t=state[i]; state[i]=state[j]; state[j]=t; }
          paintCanvas();
        });
      });
      canvas.appendChild(w);
    });
  }
  writeCode();
}
function esc(s){ return s.replace(/&(?![a-z]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function hl(line){
  var s = esc(line);
  s = s.replace(/([a-zA-Z-]+)="([^"]*)"/g,'<span class="a">$1</span>=<span class="v">"$2"</span>');
  s = s.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g,'$1<span class="t">$2</span>');
  return s;
}
function writeCode(){
  var out = document.getElementById('codeOut');
  if(!out) return;
  var L = ['<span class="cm">&lt;!-- screen.html — written live from the canvas --&gt;</span>','&lt;<span class="t">main</span> <span class="a">class</span>=<span class="v">"screen"</span>&gt;'];
  if(!state.length) L.push('  <span class="cm">&lt;!-- nothing here yet --&gt;</span>');
  else state.forEach(function(k){ BLOCKS[k].code.forEach(function(l){ L.push('  '+hl(l)); }); });
  L.push('&lt;/<span class="t">main</span>&gt;');
  out.innerHTML = L.join('\n');
}

var RENDER = {workspace:boardWorkspace, ai:boardAI, ds:boardDS, product:boardProduct, build:boardBuild};

/* ---- terminal ---- */
var LOG = {
  workspace:[
    ['·','restoring the board — notes, shapes, what is open'],
    ['\u2713','workspace live — it carries on without you']
  ],
  ai:[
    ['·','loading blocks — nav, hero, cards, quiz, chart, table'],
    ['\u2713','design and code are the same object here']
  ],
  ds:[
    ['·','reading tokens — 6 colours, 5 type steps, 12 parts'],
    ['\u2713','two button tiers. the other two were removed on purpose']
  ],
  product:[
    ['·','opening ten years of process — research to implementation'],
    ['\u2713','nothing thrown over a wall']
  ],
  build:[
    ['·','checking platforms — shopify, webflow, framer, wordpress'],
    ['\u2713','it ships, and then it stays shipped']
  ]
};
var termLog = document.getElementById('termLog');
function log(rows){
  rows.forEach(function(r){
    var d = document.createElement('div');
    d.innerHTML = '<span class="'+(r[0]==='\u2713'?'g':'m')+'">'+r[0]+'</span><span'+(r[2]?' class="g"':'')+'>'+r[1]+'</span>';
    termLog.appendChild(d);
  });
  termLog.scrollTop = termLog.scrollHeight;
}

function openTrack(id){
  var tr = TRACKS.filter(function(t){ return t.id === id; })[0];
  if(!tr) return;
  board.querySelectorAll('*').forEach(function(){});
  document.querySelectorAll('.track').forEach(function(b){ b.setAttribute('aria-selected', b.dataset.track === id); });
  RENDER[id]();
  stageName.textContent = tr.t.toUpperCase();
  stageMeta.textContent = tr.s;
  crumb.textContent = 'PORTFOLIO / BENCH / ' + tr.t.toUpperCase();
  stageFoot.innerHTML = tr.foot.map(function(f){ return '<span class="pill">'+f+'</span>'; }).join('') +
    '<span style="margin-left:auto">'+tr.right+'</span>';
  opened[id] = true;
  var n = Object.keys(opened).length;
  document.getElementById('openedCount').textContent = n + ' / 5 OPENED';
  document.getElementById('openedBar').style.width = (n/5*100)+'%';
  log([['\u203a','open ' + tr.t.toLowerCase(), true]].concat(LOG[id]));
  var next = TRACKS[(TRACKS.map(function(t){return t.id;}).indexOf(id)+1) % TRACKS.length];
  document.getElementById('termHint').textContent = 'try: open ' + next.t.toLowerCase();
}
document.querySelectorAll('.track').forEach(function(b){
  b.addEventListener('click', function(){ openTrack(b.dataset.track); });
});
document.getElementById('btnNext').addEventListener('click', function(){
  var i = TRACKS.map(function(t){return t.id;}).indexOf(document.querySelector('.track[aria-selected="true"]').dataset.track);
  openTrack(TRACKS[(i+1)%TRACKS.length].id);
});
document.getElementById('btnHelp').addEventListener('click', function(){
  log([['·','five tracks on the left. NEXT walks through them.'],['·','the AI Workflow track is draggable — try it.'],['·','everything here was built by the person you are hiring.']]);
});
document.getElementById('btnClear').addEventListener('click', function(){ termLog.innerHTML = ''; });

log([['·','booting the bench'],['\u2713','ask for it, draw it, ship it']]);
openTrack('workspace');

/* =========================================================
   WORK
========================================================= */
var STAGES = ['Overview','Discover','Research','Define','Ideate','Structure','System','Design','Build','Outcome'];

var CASES = [
  {
    slug:'dr-paws', t:'Dr. Paws Australia', cat:'E-commerce · Design system',
    tone:['#2A5347','#4E8471','#9DC3B2'],
    blurb:'A design system, a 20-page storefront, packaging and campaigns for a premium pet supplement brand selling in Australia, Malaysia and beyond.',
    m:'DESIGN SYSTEM · 20+ PAGES · PACKAGING',
    d:'Built the design system, then the storefront on top of it — About Science, a clinical health-concerns hub, article templates, a referral programme and a quiz funnel. When three conflicting greens crept into the build, I put together a contrast-and-conversion case for a single system and got it approved. Beyond the site: packaging labels, 3D product renders, marketplace listings and campaign artwork.',
    g:['Design system','Shopify Liquid','Packaging','Blender'],
    meta:{Role:'Product designer + frontend, DoqPal', Year:'Nov 2025 — present', Platform:'Shopify, Liquid, HTML/CSS, Blender', Scope:'System, 20+ pages, packaging, campaigns'},
    lede:'Dr. Paws sells clinically dosed supplements for dogs and cats — direct to consumer in Australia, and through marketplaces in Malaysia. I built the design system, then built most of the storefront on top of it.',
    steps:[
      {tag:'OVERVIEW',head:'One product page that became the whole system',p:['A brief that arrived as one mobile product page and grew into the system behind every page on the site. Over a year it covered tokens and components, twenty-plus page builds, a quiz funnel, four growth programme pages, a B2B trade catalogue, packaging labels and campaign artwork.']},
      {tag:'THE PROBLEM',head:'Three greens, none of them decided',p:['The store already existed, and that was the problem. Products, clinical claims and traffic were all in place, but every page had been designed one at a time, so nothing was reusable and nothing quite matched.','The clearest symptom: three different greens were live simultaneously. One on headlines, a second across section backgrounds, a third on every Add to Cart button. Nobody had decided that; it had simply accumulated.']},
      {tag:'RESEARCH',head:'Where the money actually comes from',figs:[{k:'board',c:'Channel and competitor audit'}],list:[
        'Order-source split across channels — roughly 71% Shopee, 24% TikTok Shop, 5% website',
        'Repeat-purchase data by product, which put Gut Glow clearly ahead',
        'Six tracked competitors: Doctor Shiba, Mammaly, Petlab, Peppy Paws, Furry Well and Buddy Bites',
        'Australian requirements — AUD, Australian English, consumer law, +61 formats',
        'Existing brand PDFs and Figma files, treated as the only source of copy'
      ]},
      {tag:'DEFINE',head:'Five people to design for',p:['Five buyer personas built out in a workbook rather than a slide: Michelle (a dog with an itch, buying to solve a problem), Elaine (prevention, already on Gut Glow), Chloe (lifestyle, identifies as a dog mum), Nurul (multi-cat household) and Rajesh (a senior large-breed dog).','Each one carried the same structure — customer job, pain, gain, product, pain reliever, gain creator — plus where they shop and what they spend monthly. That gave every later argument a person to point at instead of a preference to defend.']},
      {tag:'IDEATE',head:'Three palettes, one survivor',p:['Three homepage colour directions were explored end to end: green, lavender and tangerine. Lavender-dark won on look, but the exercise mattered more for what it revealed about how far the palette could stretch before the clinical claims stopped feeling credible.','The quiz funnel intro went through several passes. A feature-dense version tested badly against a minimal single-question screen, and the minimal one shipped.']},
      {tag:'STRUCTURE',head:'A map a ten-year-old can follow',figs:[{k:'map',c:'Information architecture — health hub and growth pages'}],list:[
        'A Dog Health Concerns hub with clinical article templates underneath it',
        '"Why Dr. Paws" split into Ingredient Transparency, Compare and Guarantee',
        'Four growth pages divided consumer-facing (Referral, Content Reward) from professional (Sales Agents, Affiliate Partnerships)',
        'A rule that every page carries an FAQ, and every professional page carries a contact form',
        'A hard brief constraint: any page must be understandable by a ten-year-old in ten seconds'
      ]},
      {tag:'SYSTEM',head:'Six colours, two buttons, one argument',p:['Six colour tokens — Night, Bark, Terra, Sage and Cream against a defined ink — with Lora and Plus Jakarta Sans as the type pairing.','The green question got settled with evidence rather than taste. Two of the three live greens failed WCAG contrast against their own backgrounds. I brought that alongside the conversion argument for one consistent call-to-action colour, and the system moved to a single teal (#3A826B) with terracotta held back purely as an accent.','The button system came down from four tiers to two — filled primary and outline, with ghost as the outline treatment on dark. Removing the filled secondary tier was the hardest sell and the one that most improved consistency.']},
      {tag:'DESIGN',head:'Twenty pages from the same parts',figs:[{k:'screens',c:'PDP, quiz funnel and referral programme'}],list:[
        'Mobile product page for Gut Glow, built from the Figma spec',
        'About Us, About Science, blog index and article templates, account dashboard, 404',
        'Referral programme page — give $15 / get $15, link in two clicks',
        'A multi-file funnel for Gut Glow Pro: quiz, offer page, advertorial',
        'B2B veterinary trade catalogue for Malaysian clinics',
        'Packaging labels drawn to print spec, including a new gel-tube line',
        '3D product renders in Blender for product pages and Shopee and TikTok Shop listings',
        'Campaign posters in feed and story formats, an ads brand kit, and an expo booth and brochure'
      ]},
      {tag:'BUILD',head:'Shipped as code, not as a file',p:['Most of this shipped as code I wrote: HTML and CSS pages against the token set, Shopify Liquid for the storefront, and Figma console scripts to generate components programmatically when a whole scheme needed rebuilding.','Localisation was handled properly rather than by find-and-replace — currency, phone formats, marketplace references and an optional ABN field on the agent application form.']},
      {tag:'OUTCOME',head:'A guide the team builds against',p:['A published brand guide the team now builds against, and a storefront where new pages assemble from existing parts instead of starting over.','The colour and button changes needed defending to the people who had approved the earlier version. Framing each one as a measurable problem — a contrast ratio, a conversion path — is why they held.']}
    ]
  },

  {
    slug:'shift-ai', t:'Shift AI', cat:'Healthcare SaaS · DE/EN', nda:true,
    tone:['#33473C','#5C8570','#B9D5AE'],
    blurb:'Shift management software for German healthcare teams, designed for people using it mid-shift on a ward.',
    m:'HEALTHCARE HR SAAS · FORMERLY HORIZON HR',
    d:'Task detail modals, a time-tracking timeline with severity-tiered violation alerts, and a dashboard rebuild with real empty states. Plus a documented design system with annotated specs for handoff. Users are nurses on shift, so everything is large type, plain language and 44px touch targets.',
    g:['Product UI','Accessibility','Bilingual','React'],
    meta:{Role:'Product designer + frontend, DoqPal', Year:'Nov 2025 — present', Platform:'React, DM Sans', Scope:'Task, time tracking, dashboard, system'},
    lede:'Shift AI (formerly Horizon HR) is DoqPal\u2019s HR software for healthcare providers, with a German-language interface. Its users are nurses and ward staff — busy, often not especially tech-confident, and rarely sitting at a desk.',
    steps:[
      {tag:'OVERVIEW',head:'Software for the people being scheduled',p:['Product design and frontend across three surfaces: the task management feature, the time tracking entry detail, and the main dashboard. Each one had an existing version that worked for the people who built it and not for the people using it.']},
      {tag:'THE PROBLEM',head:'Designed for a desk, used in a corridor',p:['Most HR tooling is designed for HR teams. This one is used by the people being scheduled — in the middle of a shift, frequently one-handed on a phone, often while something else needs attention.','That single fact drove nearly every decision that followed, and it is the reason several patterns that looked fine in review did not survive contact with the actual context.']},
      {tag:'RESEARCH',head:'What a shift actually looks like',list:[
        'Who is actually opening this, and when in their shift',
        'Confidence with software — lower on average than the product assumed',
        'German UI strings run substantially longer than their English equivalents',
        'Which violations carry legal weight and which are administrative noise',
        'Where errors were currently being missed'
      ]},
      {tag:'DEFINE',head:'Legible under pressure',p:['The design target became legibility under pressure rather than density. Large type, plain language over system vocabulary, and a 44px minimum touch target throughout — not as an accessibility checkbox, but because the real input device is a thumb in a corridor.','The German string-length constraint ruled out several tighter layouts I preferred. A component that reflows into something unreadable in the primary language of the product is not a component.']},
      {tag:'IDEATE',head:'The drawer that became a modal',figs:[{k:'board',c:'Drawer versus modal, side by side'}],p:['The task detail surface started as a right-anchored drawer. I iterated it through several passes and it became a centered modal on my boss\u2019s direction — the drawer kept the list visible but gave the detail too little room once German labels were in place.']},
      {tag:'STRUCTURE',head:'One record, two tabs, nothing lost',list:[
        'Tab navigation splitting Task from Changelog',
        'A compact horizontal pill-strip scrollspy for moving inside a long record',
        'Azure-style hover-to-edit fields, so reading and editing are the same screen',
        'A GitHub-style comment thread for the conversation around a task',
        'A vertical timeline as the spine of the time-tracking entry'
      ]},
      {tag:'SYSTEM',head:'Tokens kept, structure changed',p:['DM Sans throughout, with a blue-grey accent (#3B5A8A) carried across the surfaces. A DE/EN language toggle runs through everything rather than being bolted onto one screen.','The dashboard rebuild deliberately preserved the existing design tokens. Changing the visual language and the structure at the same time would have made it impossible to tell which change caused what.']},
      {tag:'DESIGN',head:'Severity you can actually see',figs:[{k:'screens',c:'Task modal, time tracking timeline, dashboard'}],list:[
        'Task detail modal — hover-to-edit fields, comment thread, tabbed navigation',
        'Time tracking entry modal — vertical timeline with severity-tiered violation alerts',
        'Dashboard — purposeful empty states, count badges, quick-action shortcuts',
        'A bilingual toggle consistent across all three',
        'Design-system documentation: live components beside annotated specs (tokens, states, sizing) for developers'
      ]},
      {tag:'BUILD',head:'Verified in the running product',p:['Built as React frontend work rather than handed over as a file, which meant the German string lengths, the touch targets and the alert hierarchy could be verified in the running product instead of assumed in Figma.']},
      {tag:'OUTCOME',head:'Two places I pushed back',p:['Two places I pushed back are the ones I would defend hardest. The violation alerts were originally a single flat style — flattening severity means a minor logging gap and a legally significant breach look identical, and staff learn to ignore both. They became tiers.','The second was a proposed pattern that hid a form error behind a collapsed section. Errors you have to go looking for are errors nobody fixes.']}
    ]
  },

  {
    slug:'xo-ai-builder', t:'XO AI Builder', cat:'AI platform · Internal tool',
    tone:['#2B3F38','#557A6C','#AFCFC0'],
    blurb:'A visual drag-and-drop builder that let non-technical teams create AI agents without touching JSON.',
    m:'AI AGENT BUILDER · 6 WEEKS',
    d:'Redesigned a dev-centric SmartAgent interface into a visual flow builder for non-technical users. Replaced raw JSON editing and five overlapping save buttons with a contextual step editor, auto-save with publish, and inline simulation — all built on existing infrastructure and the XO Design System.',
    g:['Interaction design','UX research','Design system','Figma'],
    meta:{Role:'Product design, UX research, UI, interaction', Year:'6 weeks · XtendOps', Platform:'Figma, FigJam, ChatGPT, Claude', Scope:'Internal tool redesign'},
    lede:'In six weeks I redesigned our internal SmartAgent interface into a visual drag-and-drop tool built for non-technical users. The goal was to let internal teams — and soon, customers — build AI-powered agents without touching a line of code.',
    steps:[
      {tag:'OVERVIEW', head:'Six weeks to make agent-building visual',
       p:['XO SmartAgents already worked. The problem was that only the people who built them could build them.','My brief was to turn a developer-facing configuration screen into something an operations lead or a support manager could open and use, without changing the infrastructure underneath it.']},

      {tag:'THE PROBLEM', head:'A tool that asked you to edit JSON',
       p:['The existing interface was built by developers for developers, and every barrier in it was a barrier to the people the product now needed to reach.'],
       list:[
         'Agent logic was configured by editing raw JSON',
         'Five overlapping save and deploy buttons, with no clear difference between them',
         'No way to test logic or see whether a change worked until after deploying',
         'Anything I designed had to run on the existing infrastructure and design system'
       ]},

      {tag:'RESEARCH', head:'What the five buttons actually did',
       list:[
         'What each save and deploy action really did to the underlying system — several did overlapping things nobody had reconciled',
         'Which parts of the JSON structure map to concepts a non-technical user already has',
         'What developers relied on and would not give up',
         'Where people got stuck, and what they did instead of asking for help',
         'The limits of the existing infrastructure, so the design stayed buildable in six weeks'
       ]},

      {tag:'DEFINE', head:'Design for the person who cannot read the JSON',
       p:['The target user became someone who understands the process they want to automate but has never opened a code editor. That single decision resolved most later arguments.','It also set a hard constraint: the redesign had to sit entirely on top of existing infrastructure and the existing design system. No backend changes, no new component library, six weeks.']},

      {tag:'IDEATE', head:'Logic as something you can see',
       figs:[{k:'img',i:3}],
       p:['Structure and interaction patterns were worked out in FigJam before any interface existed. The core question: what is the smallest visual unit that can represent a step of agent logic without lying about what the system does underneath?']},

      {tag:'STRUCTURE', head:'A canvas of steps, not a file',
       figs:[{k:'img',i:1}],
       p:['Agent logic became a drag-and-drop flow of nodes on a canvas. Each node is a step; the connections between them are the logic that used to live in nested JSON.','The contextual step editor is the key move. Selecting a node shows only the fields that node needs, so the interface never presents the full configuration surface at once — which is exactly what made the original unusable.']},

      {tag:'SYSTEM', head:'Modular components, built for scale',
       p:['Everything was built from the XO Design System as modular components, because this was never going to be the last surface. Working within the existing system rather than around it is what made six weeks possible, and what let the patterns carry into later products.']},

      {tag:'DESIGN', head:'Four changes that made it usable',
       figs:[{k:'img',i:2}],
       list:[
         'Contextual step editor — you only see what the selected node needs',
         'Auto-save with an explicit publish — your work always saves, and you choose when it goes live',
         'Simulate and test — run a single step or the whole flow instantly, before publishing',
         'Built on the XO Design System, as modular components'
       ],
       pAfter:['Auto-save with a separate publish is what replaced the five buttons. Once saving is continuous and automatic, the only decision left is whether this is ready for other people — which is one button, not five.']},

      {tag:'BUILD', head:'Working out what the logic really means',
       p:['This ran as close collaboration with developers throughout. Turning complex technical logic into simple UI patterns is not a translation exercise you can do from a spec — it requires asking, repeatedly, what a given field actually does and whether the user needs to know.','Every simplification had to be checked against the system it was hiding. A pattern that makes something easy while quietly making it wrong is worse than the JSON.']},

      {tag:'OUTCOME', head:'A technical product anyone can use',
       p:['A visual flow builder that made SmartAgent creation intuitive, fast and testable — shipped on existing infrastructure in six weeks, and designed to extend from internal teams to customers.','This project taught me how to dive into a deeply technical product, extract what matters, and make it usable by anyone. It is the clearest example of the part of the job I find most interesting: the difficulty was never visual, it was understanding the system well enough to know what could safely be taken away.']}
    ]
  },

  {
    slug:'apply-portal', t:'Job Application Portal', cat:'Recruitment · Mobile-first',
    tone:['#2E4B57','#4F7C8C','#A9CBD6'],
    blurb:'Careers at XtendOps: a mobile-first site that takes candidates from browsing jobs to finishing the assessment.',
    m:'CAREERS PORTAL · MOBILE-FIRST',
    d:'A responsive job portal and applicant assessment site for XtendOps, designed mobile-first so candidates can apply in a few taps. Assessments are built into the same flow, with fallback paths for tests that only run on desktop.',
    g:['Mobile-first','UX research','Accessibility','Figma'],
    meta:{Role:'UI/UX, UX research, prototyping, interaction', Year:'3 months · XtendOps', Platform:'Figma, Photoshop, Freepik', Scope:'Job browsing to assessment'},
    lede:'Careers at XtendOps — a job application and applicant assessment website, designed mainly for people applying from their phones.',
    steps:[
      {tag:'OVERVIEW',head:'Apply in a few taps',p:['XtendOps needed a faster, easier way to attract and evaluate applicants, especially on mobile. I designed a responsive job portal that streamlines everything from browsing jobs to completing the assessment.']},
      {tag:'THE PROBLEM',head:'Candidates arrive on a phone',p:['Most candidates find a job on their phone, but hiring flows are usually built for a desk. Every extra step on a small screen is a chance for someone to give up, and some assessments simply cannot run on mobile.']},
      {tag:'DEFINE',head:'Built around real behaviour',list:[
        'Mobile-first from the first wireframe, then scaled up to desktop',
        'Assessments inside the same flow rather than on a separate site',
        'A clear fallback route when a test can only be taken on desktop',
        'Accessibility best practice across every device'
      ]},
      {tag:'STRUCTURE',head:'The whole journey, wireframed first',figs:[{k:'img',i:3}],p:['The full path — from the welcome screen through job browsing, application and assessment — was mapped as wireframes before any visual design, so the number of taps could be counted and cut.']},
      {tag:'DESIGN',head:'Friendly, fast and accessible',figs:[{k:'img',i:1}],list:[
        'Mobile-first design that lets applicants apply in just a few taps',
        'Integrated assessments with smart fallback flows for desktop-only tests',
        'An accessibility-friendly interface across devices'
      ]},
      {tag:'OUTCOME',head:'A clearer funnel, a better first impression',p:['The portal boosted visibility across the hiring funnel and improved the candidate experience — for many applicants, the first piece of XtendOps they ever touch.']}
    ]
  },

  {
    slug:'xlearner', t:'XLearner', cat:'Learning platform · Internal',
    tone:['#2B4F4E','#4E8784','#A8D2CC'],
    blurb:'Courses for XO employees: a learning platform built into XConnect, where employees learn and managers build courses.',
    m:'LMS · PART OF XCONNECT',
    d:'A learning management system designed into XConnect, the operational hub XtendOps already runs on. Employees take on-demand courses and earn certifications; managers create and distribute their own courses through a streamlined creation flow.',
    g:['LMS','Interaction design','UX research','Figma'],
    meta:{Role:'UI/UX, UX research, prototyping, interaction', Year:'4 weeks · XtendOps', Platform:'Figma, Photoshop, Freepik', Scope:'Learner and manager flows'},
    lede:'XLearner is a learning management system for a BPO company, built into XConnect — the hub XtendOps already uses for timesheets, reports, job applications, QA, calendars and user management.',
    steps:[
      {tag:'OVERVIEW',head:'Training inside the tool people already open',p:['As part of the XConnect ecosystem, I designed XLearner for XtendOps employees and managers. The goal was to fit a training platform into the company’s operational hub: on-demand learning for employees, and an easy way for managers to create and distribute custom courses.']},
      {tag:'THE PROBLEM',head:'One more tool would be one too many',p:['XConnect already handles timesheets, reports, job applications, QA, calendars and user management. Training had to feel like part of that hub rather than a separate product people would need to remember.']},
      {tag:'DEFINE',head:'Two users, two jobs',list:[
        'Employees: find a course, work through it, earn the certification',
        'Managers: create a course and send it to their team without friction',
        'Both: the same visual language as the rest of XConnect'
      ]},
      {tag:'STRUCTURE',head:'A catalogue built around certifications',list:[
        'Cybersecurity',
        'Data Privacy &amp; Compliance',
        'AI &amp; Automation',
        'Effective Communication for Remote Teams',
        'Leadership &amp; Management Training'
      ]},
      {tag:'DESIGN',head:'Engaging, accessible, still XConnect',figs:[{k:'img',i:1}],p:['The design prioritises accessibility and engagement while staying visually consistent with XConnect. Interactive elements, clear navigation and a streamlined course-creation flow for managers keep both sides of the platform easy to use.']},
      {tag:'OUTCOME',head:'A scalable LMS in four weeks',figs:[{k:'img',i:2}],p:['A scalable, efficient learning platform that supports employee growth while fitting XtendOps’ operational needs — designed in four weeks.']}
    ]
  },

  {
    slug:'insultify', t:'Insultify', cat:'AI app · Hackathon',
    tone:['#26483C','#4F8A6B','#A6D3B4'],
    blurb:'Craft the perfect burn — an AI insult generator where the tone you pick is the whole joke.',
    m:'HACKATHON · AI PRODUCT · 2022',
    d:'A playful AI insult generator built for a hackathon. Users pick a register — Shakespearean, medieval, Bridgerton, corporate, modern social slang — and get a comeback written in it. I did the product design, the UX research and the prompt design and engineering.',
    g:['Prompt design','UX research','Figma','Prototyping'],
    meta:{Role:'Product design, UX research, prompt design + engineering, prototyping', Year:'2022 · 3 months', Platform:'Figma, FigJam, XO AI-Builder, ChatGPT, Logo.com', Scope:'Concept to working prototype'},
    lede:'A playful AI-powered insult generator, designed and built for a hackathon. It brings humour and wit into everyday interactions by letting people choose exactly how their comeback should sound.',
    steps:[
      {tag:'OVERVIEW', head:'Craft the perfect burn',
       p:['Insultify generates custom insults across a range of linguistic styles, from Shakespearean elegance to modern-day social media slang. Built over three months for a hackathon, with me covering product design, UX research, prompt design, prompt engineering and prototyping.']},

      {tag:'THE PROBLEM', head:'Random is not the same as funny',
       p:['Insult generators already existed, and they all did the same thing: produce a random line and hand it over. Random output is a novelty you use twice.','A comeback lands because of register. The same jab is funny as a medieval curse and flat as a corporate email, and the person using it already knows which one they want. Existing tools never asked.']},

      {tag:'RESEARCH', head:'What makes a comeback land',
       list:[
         'The registers people actually reach for — Shakespearean, medieval, Bridgerton-era, professional, modern social slang',
         'Why tone carries the joke more than the content of the insult does',
         'How people use this socially: it gets screenshotted and shared, not kept',
         'How much control a user wants before the novelty of choosing wears off'
       ]},

      {tag:'DEFINE', head:'Style is the product',
       p:['The core decision: style selection is not a setting, it is the mechanic. Everything else in the app exists to get someone to a register and back out again quickly.','That reframed what I was designing. Not a generator with options attached, but a menu of voices with a generator behind it.']},

      {tag:'IDEATE', head:'Finding the range of voices',
       figs:[{k:'img',i:3}],
       p:['Style options were mapped and grouped in FigJam before any interface existed. The question was how far apart the registers needed to be for the choice to feel meaningful — too similar and picking one stops mattering, too broad and half of them go unused.']},

      {tag:'STRUCTURE', head:'Pick a voice, get a burn, share it',
       figs:[{k:'img',i:2}],
       p:['The whole flow reduces to three moves: choose a style, generate, share. Anything that sat between those was cut, because the value of the app is measured in how fast you get from an idea to something worth sending someone.']},

      {tag:'SYSTEM', head:'Playful, without being juvenile',
       p:['The visual identity had to signal wit rather than crudeness — the promise is a clever comeback, not a rude one. Logo and brand groundwork through Logo.com. The interface went dark with golden yellow and a flame mark, so every screen reads as playful heat rather than anything mean, and the style choice is the hero of the main screen.']},

      {tag:'DESIGN', head:'A menu of voices',
       figs:[{k:'img',i:1}],
       p:['Designed and prototyped in Figma. The style selection screen carries the most design weight in the product, because it is where the user decides what kind of joke they are about to make.']},

      {tag:'BUILD', head:'The prompt is the feature',
       p:['This is the part that made it work. Each style needed its own prompt design so that a Shakespearean insult actually reads as Shakespearean rather than as modern English with "thou" inserted.','Getting a distinct, consistent voice per register — and keeping the output usable rather than rambling — was the engineering problem, and it was done through prompt design rather than model choice. Assembled in XO AI-Builder, with ChatGPT used during prompt development.']},

      {tag:'OUTCOME', head:'A working product in three months',
       p:['A shipped hackathon build that took an existing novelty and made it repeatable, by handing the user the one control that actually changes whether the joke works.','It is also the earliest project where I was doing prompt design as design work rather than as a technical afterthought — four years before that became a standard part of the job.']}
    ]
  }
];

/* --- generated preview art (placeholder until real screenshots go in) --- */
function shot(tone, w, h){
  w = w || 520; h = h || 300;
  var g = 'g'+Math.random().toString(36).slice(2,8);
  var tabX = w*.30, tabY = h*.20, tabW = w*.52, tabH = h*.56;
  var phX = w*.13, phY = h*.36, phW = w*.15, phH = h*.44;
  var rows = '';
  for(var i=0;i<5;i++){
    rows += '<rect x="'+(tabX+18)+'" y="'+(tabY+34+i*17)+'" width="'+(tabW*(0.62-i*0.07))+'" height="6" rx="3" fill="'+tone[2]+'" opacity="'+(0.85-i*0.1)+'"/>';
  }
  var tiles = '';
  for(var c=0;c<3;c++){
    tiles += '<rect x="'+(tabX+tabW-24-(c+1)*38)+'" y="'+(tabY+30)+'" width="30" height="30" rx="4" fill="'+tone[2]+'" opacity=".55"/>';
  }
  return '<svg class="shot" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Project preview">'+
    '<defs><linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="1">'+
      '<stop offset="0" stop-color="'+tone[1]+'"/><stop offset="1" stop-color="'+tone[0]+'"/>'+
    '</linearGradient></defs>'+
    '<rect width="'+w+'" height="'+h+'" fill="url(#'+g+')"/>'+
    '<ellipse cx="'+(w*.55)+'" cy="'+(h*.95)+'" rx="'+(w*.42)+'" ry="'+(h*.16)+'" fill="#000" opacity=".16"/>'+
    '<rect x="'+tabX+'" y="'+tabY+'" width="'+tabW+'" height="'+tabH+'" rx="7" fill="#12211C"/>'+
    '<rect x="'+(tabX+6)+'" y="'+(tabY+6)+'" width="'+(tabW-12)+'" height="'+(tabH-12)+'" rx="4" fill="#FCFBF5"/>'+
    '<rect x="'+(tabX+6)+'" y="'+(tabY+6)+'" width="'+(tabW-12)+'" height="16" fill="'+tone[0]+'"/>'+
    tiles + rows +
    '<rect x="'+phX+'" y="'+phY+'" width="'+phW+'" height="'+phH+'" rx="9" fill="#12211C"/>'+
    '<rect x="'+(phX+4)+'" y="'+(phY+4)+'" width="'+(phW-8)+'" height="'+(phH-8)+'" rx="6" fill="#FCFBF5"/>'+
    '<rect x="'+(phX+11)+'" y="'+(phY+16)+'" width="'+(phW-26)+'" height="5" rx="2.5" fill="'+tone[1]+'"/>'+
    '<rect x="'+(phX+11)+'" y="'+(phY+28)+'" width="'+(phW-34)+'" height="4" rx="2" fill="'+tone[2]+'"/>'+
    '<rect x="'+(phX+11)+'" y="'+(phY+phH-34)+'" width="'+(phW-22)+'" height="16" rx="4" fill="'+tone[1]+'"/>'+
  '</svg>';
}

/* --- figure renderers (placeholders until real screens go in) --- */
function boardFig(tone){
  var notes='';
  var cols=[0,1,2,3], tops=[18,52,96,140,184];
  for(var c=0;c<5;c++){
    for(var r=0;r<3;r++){
      if((c+r)%4===3) continue;
      var w=86+((c*7+r*11)%26), h=34+((c*5+r*9)%18);
      notes+='<rect x="'+(40+c*112)+'" y="'+(34+r*74)+'" width="'+w+'" height="'+h+'" rx="2" fill="'+(r%2?tone[2]:'#EDEADB')+'" opacity=".9"/>';
      notes+='<rect x="'+(46+c*112)+'" y="'+(42+r*74)+'" width="'+(w-24)+'" height="4" rx="2" fill="#26302A" opacity=".22"/>';
      notes+='<rect x="'+(46+c*112)+'" y="'+(52+r*74)+'" width="'+(w-38)+'" height="4" rx="2" fill="#26302A" opacity=".14"/>';
    }
  }
  return '<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Workshop board">'+
    '<rect width="620" height="280" fill="#F5F3E7"/>'+notes+'</svg>';
}
function mapFig(tone){
  var g='', y;
  for(var c=0;c<3;c++){
    var x=44+c*180;
    g+='<rect x="'+x+'" y="26" width="150" height="20" rx="2" fill="'+tone[1]+'"/>';
    for(var r=0;r<5;r++){
      y=60+r*40;
      g+='<rect x="'+x+'" y="'+y+'" width="150" height="26" rx="2" fill="#FCFBF5" stroke="#DCD9C8"/>';
      g+='<rect x="'+(x+10)+'" y="'+(y+10)+'" width="'+(110-r*12)+'" height="5" rx="2.5" fill="'+tone[2]+'"/>';
      if(r<4) g+='<line x1="'+(x+75)+'" y1="'+(y+26)+'" x2="'+(x+75)+'" y2="'+(y+40)+'" stroke="#C9C7B4"/>';
    }
  }
  return '<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Information architecture">'+
    '<rect width="620" height="280" fill="#F5F3E7"/>'+g+'</svg>';
}
function screensFig(tone){
  var g='';
  for(var i=0;i<3;i++){
    var x=30+i*196, w=166, h=228;
    g+='<rect x="'+x+'" y="26" width="'+w+'" height="'+h+'" rx="3" fill="#FCFBF5" stroke="#DCD9C8"/>';
    g+='<rect x="'+x+'" y="26" width="'+w+'" height="26" rx="3" fill="'+tone[0]+'"/>';
    g+='<rect x="'+(x+12)+'" y="66" width="'+(w-60)+'" height="9" rx="4" fill="'+tone[1]+'"/>';
    g+='<rect x="'+(x+12)+'" y="84" width="'+(w-34)+'" height="5" rx="2.5" fill="'+tone[2]+'"/>';
    g+='<rect x="'+(x+12)+'" y="96" width="'+(w-58)+'" height="5" rx="2.5" fill="'+tone[2]+'"/>';
    g+='<rect x="'+(x+12)+'" y="118" width="'+(w-24)+'" height="58" rx="3" fill="'+tone[2]+'" opacity=".5"/>';
    for(var r=0;r<3;r++){
      g+='<rect x="'+(x+12)+'" y="'+(188+r*12)+'" width="'+(w-30-r*22)+'" height="5" rx="2.5" fill="'+tone[2]+'" opacity=".8"/>';
    }
  }
  return '<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Screen set">'+
    '<rect width="620" height="280" fill="#F5F3E7"/>'+g+'</svg>';
}
var FIGS = {board:boardFig, map:mapFig, screens:screensFig};

/* =========================================================
   RECREATED PRODUCT SCREENS
   Rebuilt in code from the shipped work. Sample data only.
========================================================= */
function jar(w,h,jc,lc,name,sub,fs){
  return '<div class="jar" style="width:'+w+'px;height:'+h+'px;--jc:'+jc+';--lc:'+lc+';--fs:'+fs+'px"><div class="tub"></div><div class="lab"><b>'+name+'</b><small>'+sub+'</small></div><div class="lid"></div></div>';
}
function phone(inner,bg){ return '<div class="ph"><div style="background:'+(bg||'#fff')+'"><span class="notch"></span>'+inner+'</div></div>'; }

/* ---------------- Dr. Paws ---------------- */
var DP_NAV = '<div class="dp-bar">Free shipping over A$60 · 60-day money-back guarantee</div>'+
  '<div class="dp-nav"><span class="dp-logo"><i></i>Dr. Paws</span><span>Shop dogs</span><span>Shop cats</span><span>Health concerns</span><span>Why Dr. Paws</span><span>Science</span>'+
  '<span class="r"><span>Take the quiz</span><span>Account</span><span style="font-weight:600">Cart (1)</span></span></div>';

function dpPDP(){
  return DP_NAV +
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;padding:36px 56px">'+
    '<div>'+
      '<div style="height:480px;border-radius:26px;background:radial-gradient(circle at 50% 62%,#F8F1E5,#E6D9C3);display:flex;align-items:center;justify-content:center;position:relative">'+
        jar(240,292,'#24544A','#387060','GUT GLOW','Probiotic chews',31)+
        '<span style="position:absolute;left:22px;top:22px" class="dp-chip">90 CHEWS · BEEF</span>'+
      '</div>'+
      '<div style="display:flex;gap:12px;margin-top:14px">'+
        ['#E6D9C3','#EDE3D3','#E9DFCF','#EFE6D7'].map(function(c,i){
          return '<div style="width:92px;height:92px;border-radius:16px;background:'+c+';display:flex;align-items:center;justify-content:center;'+(i===0?'outline:2px solid #3A826B;outline-offset:2px':'')+'">'+
            (i<2?jar(46,56,'#24544A','#387060','GG','',8):'<div style="width:46px;height:46px;border-radius:50%;background:#D5C4A8"></div>')+'</div>';
        }).join('')+
      '</div>'+
    '</div>'+
    '<div style="padding-top:6px">'+
      '<div style="font-size:12.5px;color:#8A7A66;margin-bottom:14px">Dogs / Gut health</div>'+
      '<span class="dp-chip">BEST SELLER</span>'+
      '<h1 class="lora" style="font-size:42px;line-height:1.1;margin:14px 0 10px;font-weight:600;color:#1C150D">Gut Glow Probiotic Soft Chews</h1>'+
      '<div style="color:#C8572A;font-size:15px;letter-spacing:2px">★★★★★ <span style="color:#6B5A48;letter-spacing:0;font-size:14px">4.9 · 1,284 reviews</span></div>'+
      '<p style="margin:16px 0 22px;color:#5A4A3A;font-size:15.5px;max-width:470px;line-height:1.6">Daily gut support for dogs with sensitive tummies. Clinically dosed, vet reviewed and third-party lab tested.</p>'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+
        '<div class="dp-opt"><b>1 jar</b>30 days · A$49.95</div>'+
        '<div class="dp-opt"><b>2 jars</b>60 days · save 10%</div>'+
        '<div class="dp-opt on"><b>Subscribe</b>Save 20% · skip anytime</div>'+
      '</div>'+
      '<div style="display:flex;gap:12px;margin-top:22px"><span class="dp-btn" style="flex:1">Add to cart · A$39.96</span><span class="dp-btn o">Take the quiz</span></div>'+
      '<div style="display:flex;gap:26px;margin-top:26px;padding-top:22px;border-top:1px solid #E6DCCB;font-size:13px;color:#5A4A3A">'+
        '<span class="dp-tr"><i></i>Vet reviewed</span><span class="dp-tr"><i></i>Lab tested</span><span class="dp-tr"><i></i>60-day guarantee</span>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function dpQuiz(){
  var p1 = '<div style="padding:76px 26px 28px;display:flex;flex-direction:column;align-items:center;text-align:center;height:100%">'+
    '<div class="paw"><i></i><i></i><i></i><i></i><b></b></div>'+
    '<h3 class="lora" style="font-size:27px;line-height:1.22;margin:26px 0 12px;color:#1C150D;font-weight:600">Does your dog feel their best every day?</h3>'+
    '<p style="font-size:14px;color:#6B5A48;line-height:1.55">Seven quick questions, one plan matched to your dog.</p>'+
    '<div style="margin-top:auto;width:100%"><span class="dp-btn" style="width:100%">Start the quiz</span>'+
    '<div style="font-size:12px;color:#8A7A66;margin-top:12px">60 seconds · No email needed</div></div></div>';
  var p2 = '<div style="padding:60px 22px 24px">'+
    '<div style="display:flex;justify-content:space-between;font-size:12px;color:#8A7A66"><span>&larr; Back</span><span>3 of 7</span></div>'+
    '<div style="height:6px;border-radius:3px;background:#E6DCCB;margin:12px 0 30px"><i style="display:block;width:43%;height:100%;border-radius:3px;background:#3A826B"></i></div>'+
    '<h3 class="lora" style="font-size:25px;line-height:1.25;color:#1C150D;margin-bottom:22px;font-weight:600">How old is your dog?</h3>'+
    '<div class="dp-q">Puppy · under 1 year</div><div class="dp-q on">Adult · 1 to 7 years</div><div class="dp-q">Senior · 7+ years</div>'+
    '<span class="dp-btn" style="width:100%;margin-top:24px">Continue</span></div>';
  var p3 = '<div style="padding:58px 22px 24px;text-align:center">'+
    '<div style="font-size:11px;letter-spacing:.14em;color:#3A826B;font-weight:700">YOUR PLAN</div>'+
    '<h3 class="lora" style="font-size:24px;margin:8px 0 16px;color:#1C150D;font-weight:600">Gut support, every morning</h3>'+
    '<div style="background:radial-gradient(circle,#F8F1E5,#E6D9C3);border-radius:22px;height:210px;display:flex;align-items:center;justify-content:center">'+jar(128,156,'#24544A','#387060','GUT GLOW','Probiotic',16)+'</div>'+
    '<div style="text-align:left;margin:16px 0;font-size:13px;color:#5A4A3A">'+
      '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #EDE3D3"><span>Dose</span><b style="color:#1C150D">1 chew a day</b></div>'+
      '<div style="display:flex;justify-content:space-between;padding:8px 0"><span>Matched to</span><b style="color:#1C150D">Soft stools, fussy eater</b></div></div>'+
    '<span class="dp-btn" style="width:100%">Start my plan</span></div>';
  return '<div style="height:100%;display:flex;align-items:center;justify-content:center;gap:52px;background:linear-gradient(160deg,#EFE6D7,#E0D0B7)">'+
    phone(p1,'#FBF8F2')+phone(p2,'#FBF8F2')+phone(p3,'#FBF8F2')+'</div>';
}

function dpGuide(){
  function sw(n,h,role,dark){
    return '<div><div style="height:104px;border-radius:14px;background:'+h+';'+(dark?'':'border:1px solid #E2D6C3')+'"></div>'+
      '<div style="margin-top:9px;font-weight:600;font-size:13.5px;color:#1C150D">'+n+'</div>'+
      '<div style="font-size:12px;color:#8A7A66">'+h+' · '+role+'</div></div>';
  }
  return '<div style="padding:42px 56px;height:100%;background:#FBF8F2">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #E6DCCB;padding-bottom:20px">'+
      '<div><div class="lora" style="font-size:36px;font-weight:600;color:#1C150D;line-height:1.1">Brand guide</div><div style="color:#8A7A66;font-size:13px;margin-top:4px">v1.1 · Colour, type and buttons</div></div>'+
      '<span class="dp-logo" style="margin:0"><i></i>Dr. Paws</span></div>'+
    '<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:44px;margin-top:28px">'+
      '<div><div class="dp-k">COLOUR</div>'+
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px 16px">'+
          sw('Teal','#3A826B','Primary',1)+sw('Teal dark','#2A6152','Hover',1)+sw('Teal light','#B8DFD2','Tint',1)+
          sw('Terracotta','#C8572A','Accent',1)+sw('Bark','#3B2A1A','Headlines',1)+sw('Cream','#F5F0E8','Surface')+
        '</div>'+
        '<div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap">'+
          '<span style="font-size:11.5px;padding:5px 11px;border-radius:999px;background:#E3F1EB;color:#2A6152;font-weight:600">White on teal · 4.6:1 · AA</span>'+
          '<span style="font-size:11.5px;padding:5px 11px;border-radius:999px;background:#E3F1EB;color:#2A6152;font-weight:600">Bark on cream · 12.1:1 · AAA</span></div>'+
      '</div>'+
      '<div><div class="dp-k">TYPE</div>'+
        '<div class="lora" style="font-size:34px;line-height:1.12;color:#1C150D;font-weight:600">Clinically dosed, not marketed.</div>'+
        '<div style="font-size:11.5px;color:#8A7A66;margin:6px 0 16px">Lora 600 · Headlines</div>'+
        '<p style="font-size:15px;line-height:1.6;color:#5A4A3A">Proof over promises. Every claim traced to a study, every batch lab tested.</p>'+
        '<div style="font-size:11.5px;color:#8A7A66;margin:6px 0 26px">Plus Jakarta Sans · Body</div>'+
        '<div class="dp-k">BUTTONS · TWO TIERS</div>'+
        '<div style="display:flex;gap:12px;align-items:center"><span class="dp-btn">Primary</span><span class="dp-btn o">Outline</span></div>'+
        '<div style="margin-top:14px;background:#3B2A1A;border-radius:16px;padding:18px;display:flex;align-items:center;gap:14px">'+
          '<span class="dp-btn g">Ghost on dark</span><span style="color:#D8CBB8;font-size:12.5px">Outline treatment on bark</span></div>'+
      '</div>'+
    '</div></div>';
}

function dpReferral(){
  return DP_NAV +
  '<div style="display:grid;grid-template-columns:1.1fr .9fr;gap:40px;padding:56px 56px 30px;align-items:center">'+
    '<div><span class="dp-chip" style="background:#DCEEE7;color:#2A6152">REFER A FRIEND</span>'+
      '<h1 class="lora" style="font-size:56px;line-height:1.05;margin:18px 0 16px;color:#1C150D;font-weight:600">Give $15.<br>Get $15.</h1>'+
      '<p style="font-size:16px;color:#5A4A3A;max-width:440px;line-height:1.6">Share your link. Your friend gets $15 off their first order, and you get $15 when they buy.</p>'+
      '<div style="display:flex;gap:10px;margin-top:26px;max-width:520px">'+
        '<div style="flex:1;height:52px;border-radius:999px;border:1.5px solid #E2D6C3;background:#fff;display:flex;align-items:center;padding:0 22px;color:#6B5A48;font-size:14.5px">doctor-paws.com/r/your-name</div>'+
        '<span class="dp-btn">Copy link</span></div>'+
      '<div style="font-size:12.5px;color:#8A7A66;margin-top:12px">Or share via WhatsApp · Email · Messenger</div></div>'+
    '<div style="position:relative;height:330px">'+
      '<div style="position:absolute;left:30px;top:20px;width:300px;height:190px;border-radius:22px;background:#3A826B;color:#fff;padding:24px;transform:rotate(-5deg);box-shadow:0 20px 40px rgba(42,97,82,.25)">'+
        '<div style="font-size:12px;letter-spacing:.12em;opacity:.8">YOU GET</div><div class="lora" style="font-size:58px;font-weight:600">$15</div><div style="font-size:13px;opacity:.85">credit when they order</div></div>'+
      '<div style="position:absolute;left:150px;top:130px;width:300px;height:190px;border-radius:22px;background:#C8572A;color:#fff;padding:24px;transform:rotate(4deg);box-shadow:0 20px 40px rgba(184,72,31,.25)">'+
        '<div style="font-size:12px;letter-spacing:.12em;opacity:.8">YOUR FRIEND GETS</div><div class="lora" style="font-size:58px;font-weight:600">$15</div><div style="font-size:13px;opacity:.85">off their first order</div></div>'+
    '</div></div>'+
  '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:10px 56px">'+
    ['Share your link','Your friend orders','You both save'].map(function(t,i){
      return '<div style="background:#FBF8F2;border:1px solid #E6DCCB;border-radius:18px;padding:20px"><div style="width:30px;height:30px;border-radius:50%;background:#3A826B;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">'+(i+1)+'</div><div style="font-weight:700;margin-top:12px;color:#1C150D">'+t+'</div></div>';
    }).join('')+'</div>';
}

function dpLabels(){
  function wrap(bg,ink,name,claim){
    return '<div style="width:1000px;height:180px;border-radius:6px;background:'+bg+';display:grid;grid-template-columns:230px 1fr 230px;box-shadow:0 10px 30px rgba(60,40,20,.12);overflow:hidden">'+
      '<div style="padding:22px;border-right:1px dashed rgba(0,0,0,.18);font-size:10.5px;color:'+ink+';line-height:1.55"><b style="font-size:11px;letter-spacing:.1em">DIRECTIONS</b><br>Give one chew daily with food. Fresh water should be available at all times.<br><br><b style="font-size:11px;letter-spacing:.1em">STORAGE</b><br>Keep sealed in a cool, dry place.</div>'+
      '<div style="padding:22px 26px;display:flex;flex-direction:column;justify-content:center;color:'+ink+'">'+
        '<div style="font-family:Lora,serif;font-weight:700;font-size:15px;display:flex;align-items:center;gap:7px"><i style="width:14px;height:14px;border-radius:50%;background:'+ink+';display:block"></i>Dr. Paws · FOR CATS</div>'+
        '<div style="font-family:Lora,serif;font-weight:700;font-size:40px;line-height:1.05;margin:8px 0 6px">'+name+'</div>'+
        '<div style="font-size:14px;font-weight:600">'+claim+'</div>'+
        '<div style="font-size:12px;margin-top:10px;opacity:.85">60 soft chews · Salmon flavour · 90g</div></div>'+
      '<div style="padding:22px;border-left:1px dashed rgba(0,0,0,.18);font-size:10.5px;color:'+ink+'"><b style="font-size:11px;letter-spacing:.1em">INGREDIENTS</b><div style="margin-top:8px">'+
        [90,76,84,62,70].map(function(w){return '<div style="height:5px;width:'+w+'%;background:'+ink+';opacity:.25;border-radius:3px;margin-bottom:6px"></div>';}).join('')+
        '</div><div style="display:flex;gap:2px;height:34px;margin-top:12px">'+
        [2,1,3,1,2,2,1,3,1,1,2,1,3,2,1,2].map(function(w){return '<i style="display:block;width:'+w+'px;background:'+ink+'"></i><i style="display:block;width:2px"></i>';}).join('')+'</div></div>'+
    '</div>';
  }
  function top(bg,ink,name){
    return '<div style="width:170px;height:170px;border-radius:8px;background:'+bg+';display:flex;flex-direction:column;align-items:center;justify-content:center;color:'+ink+';text-align:center;box-shadow:0 10px 30px rgba(60,40,20,.12)">'+
      '<i style="width:26px;height:26px;border-radius:50%;background:'+ink+';display:block"></i><div style="font-family:Lora,serif;font-weight:700;font-size:20px;margin-top:10px;line-height:1.1">'+name+'</div><div style="font-size:11px;margin-top:6px">Dr. Paws</div></div>';
  }
  return '<div style="height:100%;background:#EFE7DA;padding:46px 60px;display:flex;flex-direction:column;gap:26px">'+
    '<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="lora" style="font-size:28px;font-weight:600;color:#1C150D">Cat chew labels · 90g</div><div style="font-size:12.5px;color:#8A7A66">Wrap 25 × 4.5 cm · Top 6.3 × 6.3 cm</div></div>'+
    wrap('#F0BA68','#3B2A1A','8-in-1 Multivitamin','Immunity &amp; Vitality Boost')+
    wrap('#93D3EC','#1E3A4A','Hair Ball Relief','Reduced Vomiting &amp; Digestive Support')+
    '<div style="display:flex;gap:20px">'+top('#F0BA68','#3B2A1A','8-in-1')+top('#93D3EC','#1E3A4A','Hair Ball')+'</div>'+
  '</div>';
}

/* ---------------- Shift AI ---------------- */
function shSide(on){
  var items=['Übersicht','Aufgaben','Zeiterfassung','Dienstplan','Mitarbeitende','Einstellungen'];
  return '<div class="sh-side"><div class="sh-logo"><i></i>Shift AI</div>'+items.map(function(t){return '<div class="sh-nav'+(t===on?' on':'')+'"><i></i>'+t+'</div>';}).join('')+'</div>';
}
var SH_AV = {SM:'#3B5A8A',KR:'#7A5AA6',TM:'#2F8A6E',AB:'#C0664A',LN:'#B58E2E'};
function av(k,s){ return '<span class="sh-av" style="background:'+SH_AV[k]+(s?';width:'+s+'px;height:'+s+'px':'')+'">'+k+'</span>'; }
function shTask(){
  function tc(t,tag,a,d){ return '<div class="sh-card" style="padding:14px;margin-bottom:10px"><b style="font-size:14px;display:block;margin-bottom:8px">'+t+'</b><div style="display:flex;align-items:center;gap:8px"><span class="sh-tag">'+tag+'</span><span style="margin-left:auto;font-size:12px;color:#6B7585">'+d+'</span>'+av(a,24)+'</div></div>'; }
  function col(t,n,c){ return '<div style="background:#EBEEF3;border-radius:14px;padding:12px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;font-weight:700">'+t+'<span class="sh-tag" style="background:#fff">'+n+'</span></div>'+c+'</div>'; }
  return shSide('Aufgaben')+
  '<div class="sh-main"><div style="display:flex;align-items:center;gap:12px;margin-bottom:22px"><div class="sh-h">Aufgaben</div><span class="sh-tag">Lab Südblick</span><span style="margin-left:auto" class="sh-lang"><span class="on">DE</span><span>EN</span></span><span class="sh-btn">Neue Aufgabe</span></div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">'+
      col('Offen','5',tc('Notfallkoffer prüfen','Wartung','TM','02.12.')+tc('Hygieneplan aktualisieren','Qualität','AB','05.12.')+tc('Schulung Brandschutz','Team','LN','09.12.'))+
      col('In Bearbeitung','3',tc('Monatliche Systemüberprüfungen','Labor','SM','30.11.')+tc('Dienstplan Januar','Planung','KR','28.11.'))+
      col('Erledigt','8',tc('Kühlkette dokumentiert','Labor','TM','21.11.')+tc('Urlaubsliste Q1','Planung','KR','18.11.'))+
    '</div></div>'+
  '<div class="sh-dim"></div>'+
  '<div class="sh-modal" style="left:200px;top:46px;width:860px;height:668px">'+
    '<div style="padding:22px 28px 0"><div style="display:flex;align-items:center;font-size:12.5px;color:#6B7585">Lab Südblick / Aufgabe<span style="margin-left:auto;font-size:20px;color:#8A94A3">&times;</span></div>'+
      '<div style="font-size:25px;font-weight:700;letter-spacing:-.02em;margin:8px 0 10px">Monatliche Systemüberprüfungen</div>'+
      '<span style="display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;background:#FDF0DC;color:#9A5B0E;font-size:12.5px;font-weight:700"><i style="width:8px;height:8px;border-radius:50%;background:#E59A2E;display:block"></i>In Bearbeitung ▾</span>'+
      '<div style="display:flex;gap:24px;margin-top:18px;border-bottom:1px solid #E8ECF2;font-size:14px"><span style="padding-bottom:10px;border-bottom:2px solid #3B5A8A;font-weight:700;color:#2C4670">Aufgabe</span><span style="padding-bottom:10px;color:#6B7585">Änderungsprotokoll</span></div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 260px;gap:26px;padding:20px 28px">'+
      '<div><div class="sh-lbl">BESCHREIBUNG</div><p style="font-size:14px;color:#3A4456;line-height:1.6;margin-bottom:20px">Monatliche Prüfung aller Laborgeräte und Systemprotokolle. Ergebnisse im Prüfbericht festhalten.</p>'+
        '<div class="sh-lbl">CHECKLISTE · 2/4</div>'+
        '<div class="sh-chk d"><i></i>Kühlschranktemperaturen prüfen</div><div class="sh-chk d"><i></i>Zentrifuge kalibrieren</div><div class="sh-chk"><i></i>Backup-Protokoll kontrollieren</div><div class="sh-chk" style="border:0"><i></i>Prüfbericht hochladen</div>'+
        '<div class="sh-lbl" style="margin-top:20px">KOMMENTARE</div>'+
        '<div style="display:flex;gap:10px">'+av('SM')+'<div style="background:#F5F7FA;border:1px solid #E8ECF2;border-radius:12px;padding:10px 12px;flex:1"><div style="font-size:12.5px"><b>Sandra Mayer</b> <span style="color:#8A94A3">· vor 2 Std.</span></div><div style="font-size:13.5px;margin-top:3px">Zentrifuge ist kalibriert, Protokoll liegt im Ordner.</div></div></div>'+
        '<div style="margin:10px 0 0 38px;border:1px solid #D5DCE6;border-radius:12px;padding:11px 12px;color:#8A94A3;font-size:13.5px">Kommentar schreiben…</div></div>'+
      '<div style="background:#F7F9FC;border:1px solid #E8ECF2;border-radius:14px;padding:6px 16px;height:fit-content">'+
        '<div class="sh-row"><span>Board</span><b>Lab Südblick</b></div>'+
        '<div class="sh-row"><span>Zugewiesen</span><span style="display:flex;gap:4px">'+av('SM',24)+av('KR',24)+'</span></div>'+
        '<div class="sh-row"><span>Fällig</span><b>30.11.2026</b></div>'+
        '<div class="sh-row"><span>Wiederholung</span><b>Monatlich</b></div>'+
        '<div class="sh-row"><span>Tags</span><span><span class="sh-tag">Labor</span> <span class="sh-tag">Wartung</span></span></div>'+
        '<div class="sh-row" style="border:0"><span>Dateien</span><b>2</b></div></div>'+
    '</div></div>';
}
function shTime(){
  function node(c,t,v){ return '<div style="display:flex;gap:14px;align-items:center;position:relative;padding:9px 0"><i style="width:16px;height:16px;border-radius:50%;background:'+c+';border:3px solid #fff;box-shadow:0 0 0 1.5px '+c+';display:block;z-index:1;flex:none"></i><span style="font-size:15px">'+t+'</span><b style="margin-left:auto;font-size:16px">'+v+'</b></div>'; }
  function vio(c,bg,t,d,s){ return '<div class="sh-v" style="border-color:'+c+'"><div><b>'+t+'</b><small>'+d+'</small></div><span class="sh-sev" style="background:'+bg+';color:'+c+'">'+s+'</span></div>'; }
  return shSide('Zeiterfassung')+
  '<div class="sh-main"><div class="sh-h" style="margin-bottom:20px">Zeiterfassung</div>'+
    [0,1,2,3,4].map(function(i){ return '<div class="sh-card" style="height:70px;margin-bottom:10px"></div>'; }).join('')+'</div>'+
  '<div class="sh-dim"></div>'+
  '<div class="sh-modal" style="left:330px;top:34px;width:620px;height:692px;padding:24px 28px">'+
    '<div style="display:flex;align-items:center"><span style="font-size:13px;color:#6B7585">Dienstag</span><span style="margin-left:auto" class="sh-lang"><span class="on">DE</span><span>EN</span></span><span style="font-size:20px;color:#8A94A3;margin-left:14px">&times;</span></div>'+
    '<div style="font-size:30px;font-weight:700;letter-spacing:-.02em;margin:2px 0 16px">14. Oktober 2026</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">'+
      [['Gesamtzeit','8:32 Std.'],['Arbeitszeit','8:02 Std.'],['Pause','0:30 Std.']].map(function(k){return '<div style="background:#F5F7FA;border:1px solid #E8ECF2;border-radius:12px;padding:12px 14px"><div style="font-size:12px;color:#6B7585">'+k[0]+'</div><div style="font-size:21px;font-weight:700;margin-top:2px">'+k[1]+'</div></div>';}).join('')+'</div>'+
    '<div style="position:relative;padding-left:2px"><i style="position:absolute;left:9px;top:20px;bottom:20px;width:2px;background:#E3E7EE;display:block"></i>'+
      node('#2F9E5B','Eingestempelt','06:58')+node('#E5B52E','Pause','11:30')+node('#3B7BD8','Fortgesetzt','12:00')+node('#D6453D','Ausgestempelt','15:30')+'</div>'+
    '<div style="display:flex;align-items:center;gap:8px;margin:16px 0 10px"><b style="font-size:15px">Regelverstöße</b><span style="background:#FCE4E2;color:#B3261E;font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px">3</span></div>'+
    vio('#B3261E','#FCE4E2','Ruhezeit unter 11 Stunden','9 Std. 40 Min. seit der letzten Schicht','Kritisch')+
    vio('#C2620E','#FDEBD8','Schicht länger als geplant','32 Min. über dem Dienstplan','Warnung')+
    vio('#2E64B5','#E3EDFB','Ausstempeln ohne Standort','Bitte Standort bestätigen','Hinweis')+
    '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px"><span class="sh-btn o">Eintrag bearbeiten</span><span class="sh-btn">Bestätigen</span></div>'+
  '</div>';
}
function shDash(){
  function kpi(t,v,b,bc){ return '<div class="sh-card" style="padding:18px"><div style="display:flex;align-items:center;font-size:13px;color:#6B7585">'+t+'<span style="margin-left:auto;font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:999px;background:'+bc[0]+';color:'+bc[1]+'">'+b+'</span></div><div style="font-size:34px;font-weight:700;margin-top:6px">'+v+'</div></div>'; }
  function row(k,n,t,r){ return '<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #EEF1F5">'+av(k)+'<span style="font-size:14px;font-weight:600">'+n+'</span><span style="font-size:13px;color:#6B7585">'+r+'</span><b style="margin-left:auto;font-size:14px">'+t+'</b></div>'; }
  return shSide('Übersicht')+
  '<div class="sh-main"><div style="display:flex;align-items:center;margin-bottom:4px"><div class="sh-h">Guten Morgen</div><span style="margin-left:auto" class="sh-lang"><span class="on">DE</span><span>EN</span></span></div>'+
    '<div style="color:#6B7585;font-size:14px;margin-bottom:20px">Dienstag, 14. Oktober · Lab Südblick</div>'+
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">'+
      kpi('Offene Aufgaben','12','+3 heute',['#EEF2F8','#3B5A8A'])+kpi('Heute im Dienst','18','von 22',['#E4F4EA','#24784A'])+kpi('Offene Anträge','3','neu',['#FDF0DC','#9A5B0E'])+kpi('Regelverstöße','2','kritisch',['#FCE4E2','#B3261E'])+'</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px">'+
      ['Einstempeln','Urlaub beantragen','Schicht tauschen'].map(function(t,i){return '<span class="sh-btn'+(i?' o':'')+'" style="height:58px;font-size:16px">'+t+'</span>';}).join('')+'</div>'+
    '<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:14px">'+
      '<div class="sh-card" style="padding:18px 20px"><b style="font-size:15px">Heute im Dienst</b>'+row('SM','Sandra Mayer','07:00–15:30','Labor')+row('KR','Klaus Richter','07:00–15:30','Empfang')+row('TM','Thomas Müller','13:30–22:00','Pflege')+row('AB','Anna Berger','21:00–07:00','Nachtdienst')+'</div>'+
      '<div class="sh-card" style="padding:18px 20px;display:flex;flex-direction:column"><b style="font-size:15px">Urlaubsanträge</b>'+
        '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px 0">'+
        '<div style="width:64px;height:64px;border-radius:50%;background:#EEF2F8;display:flex;align-items:center;justify-content:center"><i style="width:26px;height:22px;border:2.5px solid #3B5A8A;border-radius:5px;display:block"></i></div>'+
        '<b style="margin-top:14px;font-size:15px">Keine offenen Anträge</b><span style="font-size:13px;color:#6B7585;margin:4px 0 14px">Neue Anträge erscheinen hier.</span><span class="sh-btn o" style="height:40px">Alle Anträge</span></div></div>'+
    '</div></div>';
}
function shSpec(){
  function spec(t,rows,hl){ return '<div style="border:1px solid '+(hl?'#9DB4D8':'#E3E7EE')+';background:'+(hl?'#EEF3FB':'#fff')+';border-radius:12px;padding:12px 14px;margin-bottom:10px"><b style="font-size:13px">'+t+'</b>'+rows.map(function(r){return '<div style="display:flex;justify-content:space-between;font-size:12px;margin-top:6px"><span style="color:#6B7585">'+r[0]+'</span><code style="font-family:\'JetBrains Mono\',monospace;font-size:11.5px;color:#2C4670">'+r[1]+'</code></div>';}).join('')+'</div>'; }
  return '<div style="padding:34px 44px;height:100%;background:#F7F9FC">'+
    '<div style="display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #E3E7EE;padding-bottom:16px;margin-bottom:24px"><div class="sh-h">Design System</div><span style="color:#6B7585">Modals · annotated for handoff</span></div>'+
    '<div style="display:grid;grid-template-columns:1fr 380px;gap:30px">'+
      '<div style="background:#E9EDF3;border-radius:16px;padding:40px;display:flex;align-items:center;justify-content:center;height:560px">'+
        '<div style="width:440px;background:#fff;border-radius:18px;box-shadow:0 20px 50px rgba(10,20,40,.15);overflow:hidden">'+
          '<div style="padding:22px 24px;display:flex;gap:14px;align-items:flex-start"><span style="width:40px;height:40px;border-radius:12px;background:#FCE4E2;display:block;flex:none"></span><div><b style="font-size:17px">Schicht löschen?</b><div style="font-size:13.5px;color:#5B6576;margin-top:4px">Die Schicht wird aus dem Dienstplan entfernt. Das kann nicht rückgängig gemacht werden.</div></div></div>'+
          '<div style="padding:16px 24px;background:#F7F9FC;border-top:1px solid #E8ECF2;display:flex;justify-content:flex-end;gap:10px"><span class="sh-btn o" style="height:40px">Abbrechen</span><span class="sh-btn" style="height:40px;background:#B3261E">Löschen</span></div></div></div>'+
      '<div>'+spec('Backdrop',[['background','rgba(20,30,48,.42)'],['z-index','--z-modal']])+spec('Container',[['radius','--radius-xl · 18px'],['shadow','--shadow-modal'],['width','440 / 620 / 860']])+
        spec('Header',[['title','17 / 700 / --ink'],['icon','40 · --radius-lg']])+spec('Footer buttons',[['height','40px · min target 44 on touch'],['order','Cancel left, primary last'],['danger','--red-700 #B3261E']],1)+'</div>'+
    '</div></div>';
}

var MOCKS = {
  'dr-paws':[
    {c:'Gut Glow product page', cls:'dp', f:dpPDP},
    {c:'Quiz funnel — intro, question, plan', cls:'dp', f:dpQuiz},
    {c:'Brand guide v1.1 — teal system, two button tiers', cls:'dp', f:dpGuide},
    {c:'Referral programme — give $15, get $15', cls:'dp', f:dpReferral},
    {c:'Cat chew packaging labels to print spec', cls:'dp', f:dpLabels}
  ],
  'shift-ai':[
    {c:'Task detail modal on the Kanban board', cls:'sh', f:shTask},
    {c:'Time tracking entry with severity-tiered violations', cls:'sh', f:shTime},
    {c:'Dashboard — count badges, quick actions, empty state', cls:'sh', f:shDash},
    {c:'Design system — annotated modal spec', cls:'sh', f:shSpec}
  ],
};
var MOCK_W = 1200, MOCK_H = 760;

/* Screenshots listed in images/work/manifest.js replace the screens above.
   A project with an empty list keeps its built-in screens. */
(function(){
  var W = window.WORK_IMAGES;
  if(!W) return;
  Object.keys(W).forEach(function(slug){
    var list = W[slug];
    if(!list || !list.length) return;
    MOCKS[slug] = list.map(function(it){
      var src = it.file || '';
      if(!/^https?:\/\//.test(src)) src = 'images/work/' + slug + '/' + src;
      return {img: src, w: it.width || 0, h: it.height || 0, c: it.caption || ''};
    });
  });
})();
document.addEventListener('load', function(e){
  var el = e.target;
  if(el && el.tagName === 'IMG' && el.dataset.auto && el.naturalWidth){
    el.parentNode.style.aspectRatio = el.naturalWidth + '/' + el.naturalHeight;
    el.removeAttribute('data-auto');
  }
}, true);
document.addEventListener('contextmenu', function(e){
  if(e.target.closest && e.target.closest('.frame')) e.preventDefault();
});
document.addEventListener('dragstart', function(e){
  if(e.target.tagName === 'IMG') e.preventDefault();
});
function IMG(file,w,h,c){ return {img:'https://framerusercontent.com/images/'+file+(/\.gif$/.test(file)?'':'?scale-down-to=2048'), w:w, h:h, c:c}; }
function frame(m){
  if(m.img){
    var auto = !(m.w && m.h), ar = auto ? '16/10' : m.w+'/'+m.h;
    return '<div class="frame imgf" style="aspect-ratio:'+ar+'"><img src="'+m.img+'" alt="'+m.c.replace(/"/g,'&quot;')+'" loading="lazy" decoding="async" draggable="false"'+
      (auto ? ' data-auto="1"' : ' width="'+m.w+'" height="'+m.h+'"')+'></div>';
  }
  return '<div class="frame" role="img" aria-label="'+m.c.replace(/"/g,'&quot;')+'" style="aspect-ratio:'+MOCK_W+'/'+MOCK_H+'">'+
    '<div class="mock '+m.cls+'" aria-hidden="true" style="width:'+MOCK_W+'px;height:'+MOCK_H+'px">'+m.f()+'</div></div>';
}
var fitRO = ('ResizeObserver' in window) ? new ResizeObserver(function(es){
  es.forEach(function(e){ scaleFrame(e.target); });
}) : null;
function scaleFrame(f){
  var m = f.firstElementChild, w = f.clientWidth;
  if(m && w && m.classList.contains('mock')) m.style.transform = 'scale(' + (w / MOCK_W) + ')';
}
function fitFrames(root){
  (root || document).querySelectorAll('.frame').forEach(function(f){
    scaleFrame(f);
    if(fitRO) fitRO.observe(f);
  });
}
window.addEventListener('resize', function(){ fitFrames(); });


/* ---------- pixel garden (original art, drawn cell by cell) ---------- */
(function(){
  var host = document.getElementById('garden'), cv = document.getElementById('gardenCv');
  if(!host || !cv) return;
  var ctx = cv.getContext('2d'), ROWS = 64, cell = 4, W = 0, t0 = performance.now();
  var C = { hill1:'#DCE9D5', hill2:'#CFE2C4', grass:'#A9CF8E', grassTop:'#BFDCA8', speck:'#93C07A', soil:'#A8794F', furrow:'#8C6240',
    post:'#B98A5A', postTop:'#9B6B43', rail:'#C9A06E', roof:'#C96A52', roofDk:'#A9543F', wall:'#F3E6CF', line:'#6B4A35', door:'#9B6B43',
    win:'#BFE0E8', path:'#E3C9A0', leaf:'#7FB069', leafDk:'#5E9150', stalk:'#6FA05A', yellow:'#F2C94C', red:'#E0685A', white:'#F6F1E7',
    pink:'#E9A0B8', blue:'#7FB2C9', blueDk:'#5E93AB', trunk:'#8C6240', tree:'#8DBB73', treeHi:'#A9CF8E', treeDk:'#6FA05A',
    sun:'#F6D98B', halo:'#FBEBC0', cloud:'#FFFFFF', cloudDk:'#EDE7DA', orange:'#E9A23B', fly:'#F6A9BC' };
  function hash(x, y){ var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function px(x, y, c){ if(x < 0 || x >= W || y < 0 || y >= ROWS) return; ctx.fillStyle = c; ctx.fillRect(x * cell, y * cell, cell, cell); }
  function rect(x, y, w, h, c){ ctx.fillStyle = c; ctx.fillRect(x * cell, y * cell, w * cell, h * cell); }
  function size(){
    var w = host.clientWidth; if(!w) return false;
    cell = w < 560 ? 3 : 4; W = Math.floor(w / cell);
    cv.width = W * cell; cv.height = ROWS * cell; cv.style.width = (W * cell) + 'px'; cv.style.height = (ROWS * cell) + 'px';
    return true;
  }
  function cloud(x, y){
    rect(x+4, y, 5, 1, C.cloud); rect(x+10, y+1, 4, 1, C.cloud); rect(x+2, y+1, 8, 1, C.cloud); rect(x+1, y+2, 15, 1, C.cloud); rect(x, y+3, 17, 1, C.cloud); rect(x+1, y+4, 15, 1, C.cloudDk);
  }
  function sunflower(x, top){
    rect(x+2, top+5, 1, 47-(top+5), C.stalk); px(x+1, top+9, C.leaf); px(x+3, top+11, C.leaf);
    rect(x+1, top, 3, 1, C.yellow); rect(x, top+1, 5, 3, C.yellow); rect(x+1, top+4, 3, 1, C.yellow); rect(x+1, top+1, 3, 3, C.furrow); px(x+2, top+2, C.postTop);
  }
  function draw(t){
    if(!W && !size()) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    var sway = function(x){ return Math.sin(t / 700 + x * 0.7) > 0.55 ? 1 : 0; };
    // sun and clouds
    var sx = Math.round(W * 0.74);
    for(var yy = -7; yy <= 7; yy++) for(var xx = -7; xx <= 7; xx++){ var d = xx*xx + yy*yy; if(d <= 49 && d > 30) px(sx+xx, 11+yy, C.halo); else if(d <= 30) px(sx+xx, 11+yy, C.sun); }
    [[0.05, 6, 0.0021], [0.45, 14, 0.0014], [0.9, 4, 0.0017]].forEach(function(c, k){
      var span = W + 24, x = Math.round(((c[0] * span + t * c[2]) % span) - 12); cloud(x, c[1]);
    });
    // hills
    for(var x = 0; x < W; x++){
      var h1 = 37 + Math.round(3 * Math.sin(x / 23) + 2 * Math.sin(x / 9 + 1));
      rect(x, h1, 1, 47 - h1, C.hill1);
      var h2 = 42 + Math.round(2 * Math.sin(x / 17 + 2));
      rect(x, h2, 1, 47 - h2, C.hill2);
    }
    // grass
    rect(0, 47, W, ROWS - 47, C.grass); rect(0, 47, W, 1, C.grassTop);
    for(x = 0; x < W; x++) for(var y = 48; y < ROWS; y++) if(hash(x, y) < 0.05) px(x, y, C.speck);
    // fence
    rect(0, 42, W, 1, C.rail); rect(0, 45, W, 1, C.rail);
    for(x = 2; x < W; x += 10){ rect(x, 40, 2, 8, C.post); rect(x, 40, 2, 1, C.postTop); }
    // bahay kubo: nipa roof, woven bamboo walls, stilts and a ladder
    var hx = Math.max(4, Math.round(W * 0.07));
    rect(hx + 17, 48, 4, ROWS - 48, C.path); for(y = 52; y < ROWS; y += 3) rect(hx + 16 - ((y - 52) / 6 | 0), y, 6 + ((y - 52) / 3 | 0), 2, C.path);
    [hx + 3, hx + 10, hx + 23, hx + 27].forEach(function(sx2){ rect(sx2, 41, 1, 7, C.trunk); });
    rect(hx + 5, 44, 4, 3, '#B5653F'); rect(hx + 5, 44, 4, 1, '#8E4B2E'); px(hx + 8, 45, '#9A5534');
    rect(hx + 1, 40, 29, 1, '#7A5634');
    for(y = 31; y < 40; y++) for(x = hx + 3; x < hx + 28; x++) px(x, y, ((x + y) % 3 === 0 || (x - y) % 4 === 0) ? '#C49A5A' : '#DDBB7E');
    rect(hx + 3, 31, 1, 9, C.trunk); rect(hx + 27, 31, 1, 9, C.trunk); rect(hx + 15, 31, 1, 9, '#A8834A');
    rect(hx + 6, 33, 6, 4, '#5C3F28'); rect(hx + 8, 33, 1, 4, '#8C6240');
    rect(hx + 5, 32, 8, 1, '#B98A4E'); px(hx + 12, 33, C.trunk); px(hx + 13, 34, C.trunk);
    rect(hx + 18, 33, 4, 7, '#5C3F28'); rect(hx + 17, 33, 1, 7, C.trunk); rect(hx + 22, 33, 1, 7, C.trunk);
    rect(hx + 17, 41, 1, 7, '#9B6B43'); rect(hx + 22, 41, 1, 7, '#9B6B43'); for(y = 42; y < 48; y += 2) rect(hx + 18, y, 4, 1, '#B98A5A');
    for(r = 0; r < 14; r++){
      var left = hx + 11 - Math.round(r * 1.1), right = hx + 19 + Math.round(r * 1.1);
      for(x = left; x <= right; x++){
        var c = (x + r) % 3 === 0 ? '#A8834A' : (r < 2 ? '#B48E50' : '#C8A25E');
        if(r === 13 && (x % 2)) continue;
        px(x, 17 + r, c);
      }
    }
    rect(hx + 10, 16, 11, 1, C.trunk); px(hx + 9, 15, C.trunk); px(hx + 21, 15, C.trunk);
    rect(hx + 24, 44, 2, 3, '#B5653F'); px(hx + 24, 43, C.leaf); px(hx + 25, 42, C.leafDk); px(hx + 26, 43, C.leaf);
    // mailbox
    var mx = hx + 33; rect(mx + 2, 41, 1, 7, C.trunk); rect(mx, 37, 5, 4, C.blue); rect(mx, 40, 5, 1, C.blueDk); rect(mx + 5, 36, 1, 3, C.red);
    // garden beds
    var g0 = hx + 42, g1 = Math.round(W * 0.8);
    for(x = g0; x + 4 < g1; x += 16) sunflower(x + 5, 32 + (x % 3));
    [[49, 'corn'], [54, 'tomato'], [59, 'turnip']].forEach(function(bed){
      var by = bed[0]; rect(g0, by + 2, g1 - g0, 3, C.soil); rect(g0, by + 4, g1 - g0, 1, C.furrow);
      for(var cx = g0 + 2; cx + 3 < g1; cx += 6){
        var s = sway(cx + by);
        if(bed[1] === 'corn'){ rect(cx + 1, by - 5, 1, 7, C.stalk); px(cx + s, by - 3, C.leaf); px(cx + 2 + s, by - 1, C.leaf); rect(cx + 2, by - 4, 1, 2, C.yellow); px(cx + 1, by - 6 + s, C.yellow); }
        if(bed[1] === 'tomato'){ rect(cx, by - 1, 3, 3, C.leaf); px(cx + 1 + s, by - 2, C.leafDk); px(cx, by, C.red); px(cx + 2, by + 1, C.red); }
        if(bed[1] === 'turnip'){ px(cx + s, by, C.leaf); px(cx + 2 - s, by, C.leaf); px(cx + 1, by, C.leafDk); rect(cx, by + 1, 3, 2, C.white); px(cx + 1, by + 1, C.pink); }
      }
    });
    // watering can
    var wx2 = g0 - 7; rect(wx2, 50, 4, 3, C.blue); px(wx2 + 4, 50, C.blueDk); px(wx2 + 5, 49, C.blueDk); px(wx2 - 1, 50, C.blueDk); px(wx2 - 1, 51, C.blueDk);
    // tree
    var tx = Math.round(W * 0.89);
    rect(tx, 36, 3, 12, C.trunk);
    for(yy = -9; yy <= 9; yy++) for(xx = -10; xx <= 10; xx++){
      var dd = (xx * xx) / 100 + (yy * yy) / 81; if(dd > 1) continue;
      px(tx + 1 + xx, 29 + yy, (xx + yy < -6) ? C.treeHi : (xx + yy > 7 ? C.treeDk : C.tree));
    }
    px(tx - 4, 27, C.red); px(tx + 5, 31, C.red); px(tx, 33, C.red); px(tx + 3, 24, C.red);
    // chicken (pecks every few beats)
    var chx = hx + 34, peck = Math.floor(t / 520) % 4 === 0;
    rect(chx, 57, 5, 3, C.white); rect(chx + 4, peck ? 57 : 55, 2, 2, C.white); px(chx + 5, peck ? 56 : 54, C.red);
    px(chx + 6, peck ? 58 : 56, C.orange); px(chx + 5, peck ? 57 : 55, C.line); px(chx - 1, 56, C.white);
    px(chx + 1, 60, C.orange); px(chx + 3, 60, C.orange);
    // butterfly
    var bx = Math.round(W * 0.6 + Math.sin(t / 1900) * Math.min(30, W * 0.15)), by2 = Math.round(29 + Math.sin(t / 830) * 5), f = Math.floor(t / 180) % 2;
    px(bx, by2, C.line); if(f){ px(bx - 1, by2 - 1, C.fly); px(bx + 1, by2 - 1, C.fly); } else { px(bx - 1, by2, C.fly); px(bx + 1, by2, C.fly); }
  }
  var last = 0;
  function loop(t){
    requestAnimationFrame(loop);
    if(current !== 'contact' || document.hidden) return;
    if(t - last < 110) return;
    last = t; draw(t - t0);
  }
  window.addEventListener('resize', function(){ W = 0; size(); draw(performance.now() - t0); });
  if(reduce){ var once = function(){ if(current === 'contact'){ size(); draw(0); } }; window.addEventListener('hashchange', once); setInterval(once, 1000); }
  else requestAnimationFrame(loop);
})();

/* --- rows --- */
var grid = document.getElementById('worksGrid');
grid.innerHTML = CASES.map(function(c,i){
  return '<button class="workrow" type="button" data-slug="'+c.slug+'" data-i="'+i+'">'+
    '<span class="no">'+String(i+1).padStart(2,'0')+'</span>'+
    '<span><span class="workthumb">'+(MOCKS[c.slug]?frame(MOCKS[c.slug][0]):shot(c.tone,520,300))+'</span>'+
      '<h3>'+c.t+'</h3><span class="m">'+c.m+'</span>'+
      (c.nda ? '<span class="nda">NON-DISCLOSURE</span>' : '')+'</span>'+
    '<span><p>'+c.d+'</p>'+
      '<span class="tags">'+c.g.map(function(g){return '<span class="tag">'+g+'</span>';}).join('')+'</span>'+
      '<span class="copen">Open project &rarr;</span></span>'+
    '<span class="plus" aria-hidden="true"></span>'+
  '</button>';
}).join('') + '<div class="hovercard" id="hoverCard" aria-hidden="true"></div>';

var hoverCard = document.getElementById('hoverCard');
var cardShown = -1, hoverTimer;

function placeCard(x, y){
  var gr = grid.getBoundingClientRect();
  var cw = 320, ch = hoverCard.offsetHeight || 300;
  var left = x - gr.left + 26;
  var top  = y - gr.top - ch/2;
  left = Math.max(8, Math.min(left, gr.width - cw - 8));
  top  = Math.max(8, Math.min(top, gr.height - ch - 8));
  hoverCard.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
}
function showCard(row, x, y){
  if(window.innerWidth <= 820) return;
  var i = +row.dataset.i;
  if(i !== cardShown){
    var c = CASES[i];
    hoverCard.innerHTML = (MOCKS[c.slug]?frame(MOCKS[c.slug][0]):shot(c.tone,520,280)) +
      '<div class="body"><h3>'+c.t+'</h3><p>'+c.blurb+'</p>'+
      '<span class="open">Open project &rarr;</span></div>';
    fitFrames(hoverCard);
    cardShown = i;
  }
  placeCard(x, y);
  hoverCard.classList.add('on');
}
function hideCard(){ hoverCard.classList.remove('on'); cardShown = -1; }

grid.querySelectorAll('.workrow').forEach(function(row){
  row.addEventListener('mouseenter', function(e){ clearTimeout(hoverTimer); showCard(row, e.clientX, e.clientY); });
  row.addEventListener('mousemove', function(e){ if(cardShown === +row.dataset.i) placeCard(e.clientX, e.clientY); });
  row.addEventListener('mouseleave', function(){ hoverTimer = setTimeout(hideCard, 80); });
  row.addEventListener('focus', function(){
    if(window.innerWidth <= 820) return;
    var r = row.getBoundingClientRect();
    showCard(row, r.left + r.width*0.62, r.top + r.height/2);
  });
  row.addEventListener('blur', hideCard);
  row.addEventListener('click', function(){ openCase(row.dataset.slug); });
});
grid.addEventListener('mouseleave', hideCard);

/* --- desktop showcase --- */
var BADGE = {'apply-portal':'XTENDOPS','xlearner':'XTENDOPS','dr-paws':'DOQPAL','shift-ai':'DOQPAL','xo-ai-builder':'XTENDOPS','insultify':'HACKATHON'};
var scList = document.getElementById('scList'), scMain = document.getElementById('scMain');
scList.innerHTML = CASES.map(function(c,i){
  return '<div class="sc-item'+(i===0?' on':'')+'" data-slug="'+c.slug+'">'+
    '<div class="sc-head"><button class="sc-name" type="button" data-jump="'+c.slug+'">'+c.t+'</button><span class="sc-badge">'+(BADGE[c.slug]||'')+'</span></div>'+
    '<div class="sc-detail"><div class="sc-meta">'+c.cat+' &bull; '+c.meta.Year+'</div><p>'+c.blurb+'</p>'+
    '<button class="sc-read" type="button" data-case="'+c.slug+'">Read the full case study &nearr;</button></div></div>';
}).join('');
scMain.innerHTML = '<span class="sc-ind" id="scInd" aria-hidden="true"></span>' + CASES.map(function(c){
  var ms = MOCKS[c.slug] || [], first = ms.slice(0,3), rest = ms.slice(3);
  return '<section class="sc-proj" id="sc-'+c.slug+'" data-slug="'+c.slug+'" aria-labelledby="sct-'+c.slug+'">'+
    '<h2 class="sc-title" id="sct-'+c.slug+'">'+c.t+'</h2>'+ first.map(frame).join('')+
    (rest.length ? '<div class="sc-more" id="more-'+c.slug+'" hidden>'+rest.map(frame).join('')+'</div>'+
      '<button class="sc-morebtn" type="button" aria-expanded="false" aria-controls="more-'+c.slug+'" data-more="'+c.slug+'" data-n="'+rest.length+'">Show the other '+rest.length+' screen'+(rest.length>1?'s':'')+' &nbsp;+</button>' : '')+
    (c.nda ? '<span class="ndatag">NON-DISCLOSURE</span>' : '')+
  '</section>';
}).join('');
fitFrames(scMain);
fitFrames(grid);

scMain.addEventListener('click', function(e){
  var b = e.target.closest('[data-more]');
  if(!b) return;
  var box = document.getElementById('more-'+b.dataset.more), open = box.hidden;
  box.hidden = !open;
  b.setAttribute('aria-expanded', open);
  var n = +b.dataset.n;
  b.innerHTML = open ? 'Hide '+n+' screen'+(n>1?'s':'')+' &nbsp;&minus;' : 'Show the other '+n+' screen'+(n>1?'s':'')+' &nbsp;+';
  if(open) fitFrames(box);
  requestAnimationFrame(spy);
});
scList.addEventListener('click', function(e){
  var b = e.target.closest('[data-jump]');
  if(!b) return;
  var sec = document.getElementById('sc-'+b.dataset.jump);
  var y = sec.getBoundingClientRect().top + window.pageYOffset - 96;
  window.scrollTo({top:y, behavior: reduce ? 'auto' : 'smooth'});
  var h = sec.querySelector('.sc-title'); h.setAttribute('tabindex','-1'); h.focus({preventScroll:true});
});
var activeSlug = CASES[0].slug, spyTick = false;
function spy(){
  spyTick = false;
  if(current !== 'work' || document.body.classList.contains('worklist')) return;
  var secs = scMain.querySelectorAll('.sc-proj'), line = window.innerHeight * 0.4, act = secs[0];
  secs.forEach(function(sct){ if(sct.getBoundingClientRect().top <= line) act = sct; });
  if(!act) return;
  var ind = document.getElementById('scInd');
  ind.style.top = act.offsetTop + 'px';
  ind.style.height = act.offsetHeight + 'px';
  if(act.dataset.slug !== activeSlug){
    activeSlug = act.dataset.slug;
    scList.querySelectorAll('.sc-item').forEach(function(it){ it.classList.toggle('on', it.dataset.slug === activeSlug); });
  }
}
window.addEventListener('scroll', function(){
  document.body.classList.toggle('scrolled', window.pageYOffset > 8);
  if(!spyTick){ spyTick = true; requestAnimationFrame(spy); }
}, {passive:true});
window.addEventListener('resize', function(){ requestAnimationFrame(spy); });

var workToggle = document.getElementById('workToggle');
workToggle.addEventListener('click', function(){
  var list = document.body.classList.toggle('worklist');
  workToggle.setAttribute('aria-pressed', list);
  workToggle.innerHTML = list ? 'Screenshots instead &darr;' : 'List view instead &darr;';
  fitFrames();
  requestAnimationFrame(spy);
});


/* --- case study page --- */
function renderCase(slug){
  var i = CASES.map(function(c){return c.slug;}).indexOf(slug);
  if(i < 0) i = 0;
  var c = CASES[i], next = CASES[(i+1) % CASES.length];
  var mk = MOCKS[c.slug] || [], mi = 1;

  var meta = Object.keys(c.meta).map(function(k){
    return '<div><div class="k">'+k.toUpperCase()+'</div><div class="v">'+c.meta[k]+'</div></div>';
  }).join('');

  var steps = c.steps.map(function(sec,n){
    function paras(arr){ return (arr||[]).map(function(p){return '<p>'+p+'</p>';}).join(''); }
    var body = paras(sec.p) +
      (sec.list ? '<ul class="caselist">'+sec.list.map(function(li){return '<li><span>'+li+'</span></li>';}).join('')+'</ul>' : '') +
      paras(sec.pAfter);
    var figs = (sec.figs || []).map(function(f){
      if(f.k === 'img' && mk[f.i]){
        return '<figure class="casefig">'+frame(mk[f.i])+'<figcaption>'+mk[f.i].c+'</figcaption></figure>';
      }
      if(f.k === 'screens' && mi < mk.length){
        var m = mk[mi++];
        return '<figure class="casefig">'+frame(m)+'<figcaption>'+m.c+'</figcaption></figure>';
      }
      return '<figure class="casefig">'+FIGS[f.k](c.tone)+'<figcaption>'+f.c+'</figcaption></figure>';
    }).join('');
    return '<section class="casestep" id="step-'+n+'">'+
      '<div class="stepgrid">'+
        '<div class="stepleft">'+
          '<div class="steptag"><span class="dot"></span>'+String(n+1).padStart(2,'0')+' &middot; '+sec.tag+'</div>'+
          '<h2>'+sec.head+'</h2>'+
        '</div>'+
        '<div class="stepbody">'+body+'</div>'+
      '</div>'+ figs +
    '</section>';
  }).join('');

  document.getElementById('caseHost').innerHTML =
    '<div class="wrap" style="padding-top:44px">'+
      '<button class="caseback" type="button" data-go="work">&larr; ALL WORK</button>'+
      '<h1 class="casetitle">'+c.t+'</h1>'+
      '<p class="casesub">'+c.lede+'</p>'+
      '<div class="casemeta">'+meta+'</div>'+
      '<figure class="casehero">'+(mk[0]?frame(mk[0]):shot(c.tone,1100,470))+'</figure>'+
      '<div class="casesteps">'+steps+'</div>'+
      '<div class="casenext">'+
        '<button class="nextcard" type="button" data-case="'+next.slug+'" aria-label="Next project: '+next.t+'">'+
          '<span class="nc-body">'+
            '<span class="nc-k"><span>UP NEXT</span><span>'+String((i+1)%CASES.length+1).padStart(2,'0')+' / '+String(CASES.length).padStart(2,'0')+'</span></span>'+
            '<span class="nc-t">'+next.t+'</span>'+
            '<span class="nc-p">'+next.blurb+'</span>'+
            '<span class="nc-go"><i aria-hidden="true">&rarr;</i>Open project</span>'+
          '</span>'+
          '<span class="nc-shot" aria-hidden="true">'+(MOCKS[next.slug]?frame(MOCKS[next.slug][0]):shot(next.tone,520,300))+'</span>'+
        '</button>'+
        '<div class="casefoot"><button type="button" data-go="work">&larr; ALL WORK</button><span>'+c.t.toUpperCase()+' &middot; CASE STUDY</span></div>'+
      '</div>'+
    '</div>';
}

function openCase(slug){
  renderCase(slug);
  fitFrames(document.getElementById('caseHost'));
  if(current === 'case'){ window.scrollTo(0,0); }
  hideCard();
  go('case');
}
document.addEventListener('click', function(e){
  var t = e.target.closest('[data-case]');
  if(t) openCase(t.dataset.case);
});


/* =========================================================
   STACK
========================================================= */
var STACK = [
  ['Figma','FigJam','Photoshop','Illustrator','Blender','Canva','Design systems','Claude','Cursor AI','Relume AI'],
  ['HTML','CSS','JavaScript','React','Svelte','Tailwind CSS','ShadCN UI','Material UI','Shopify','WordPress','Framer','Webflow']
];
document.getElementById('stack').innerHTML = STACK.map(function(col){
  return '<div><ul>'+col.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul></div>';
}).join('');

/* =========================================================
   TIMELINE
========================================================= */
var TL = [
  {w:'NOV 2025 — PRESENT', t:'Product Designer & Frontend Developer · DoqPal',
   d:'Product design and frontend across several products, including unreleased work under NDA. Shift AI (formerly Horizon HR): task management, time tracking and dashboard for German healthcare teams. Dr. Paws: design system, 20+ page storefront, packaging, 3D renders and campaigns.'},
  {w:'SEPT 2020 — NOV 2025', t:'UI/UX Designer · XtendOps',
   d:'Led the six-week redesign of XO AI Builder, turning a JSON-based SmartAgent console into a drag-and-drop builder non-technical users can use. Also XConnect, the Job Application Portal, XLearner, the TA Portal and the XO Operating System: needfinding across global departments, new information architecture, and implementation alongside frontend and full-stack developers.'},
  {w:'MAR 2016 — OCT 2019', t:'Web Designer & Developer · Law firm sites',
   d:'Full ownership of layout, visual design, content and build. Designed in Photoshop, coded and shipped on WordPress, and produced the logos, banners and vectors alongside.'},
  {w:'JAN 2014 — JUL 2015', t:'Team Leader · VirtuosoMaster (WP TaskForce)',
   d:'Led a web team through design, build and QA, and wrote the technical manuals and user instructions that shipped with the work.'},
  {w:'MAY 2013 — JUL 2015', t:'Web Designer & Developer',
   d:'PSD to HTML, large-scale e-commerce builds with payment processing, customs clearance and multi-currency pricing, plus cross-browser and mobile responsiveness.'},
  {w:'2008 — 2012', t:'BS Computer Science · St. Paul University Iloilo',
   d:'Google Foundations of User Experience Design certificate followed in 2022.'}
];
document.getElementById('timeline').innerHTML = TL.map(function(x){
  return '<div class="tlitem"><div class="when">'+x.w+'</div><div><h3>'+x.t+'</h3><p>'+x.d+'</p></div></div>';
}).join('');
