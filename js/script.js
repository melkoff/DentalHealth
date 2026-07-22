/* Palisades Dental Health — homepage interactions */
document.documentElement.classList.add('js');

/* ---- Mobile drawer ---- */
(function(){
  var drawer = document.getElementById('drawer');
  var burger = document.getElementById('burger');
  if(!drawer || !burger) return;
  function open(){ drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden','false'); burger.classList.add('is-open'); burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function close(){ drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden','true'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  burger.addEventListener('click', open);
  drawer.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', close); });
  drawer.querySelectorAll('.drawer__link, .drawer__sub a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  drawer.querySelectorAll('.drawer__toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var g = btn.closest('.drawer__group');
      var isOpen = g.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
})();

/* ---- FAQ accordion ---- */
document.addEventListener('click', function(e){
  var q = e.target.closest('.faq__q');
  if(!q) return;
  var item = q.closest('.faq__item');
  var list = item.closest('.faq__list');
  var willOpen = !item.classList.contains('faq__item--open');
  if(list){ list.querySelectorAll('.faq__item--open').forEach(function(o){ o.classList.remove('faq__item--open'); var b=o.querySelector('.faq__q'); if(b) b.setAttribute('aria-expanded','false'); }); }
  if(willOpen){ item.classList.add('faq__item--open'); q.setAttribute('aria-expanded','true'); }
  else { q.setAttribute('aria-expanded','false'); }
});

/* ---- Chat widget ---- */
(function(){
  var toggle = document.getElementById('chatToggle');
  var panel = document.getElementById('chatPanel');
  if(!toggle || !panel) return;
  toggle.addEventListener('click', function(){
    var willOpen = panel.hasAttribute('hidden');
    if(willOpen){ panel.removeAttribute('hidden'); toggle.setAttribute('aria-expanded','true'); }
    else { panel.setAttribute('hidden',''); toggle.setAttribute('aria-expanded','false'); }
  });
  var closeBtn = panel.querySelector('.chat__close');
  if(closeBtn){ closeBtn.addEventListener('click', function(){ panel.setAttribute('hidden',''); toggle.setAttribute('aria-expanded','false'); }); }
})();

/* ---- Reveal on scroll ---- */
(function(){
  var sel = '.section__head,.hero__col,.hero__media,.emerg,.ecard,.scard,.wcard,.plan,.rcard,.seal,.smile,.team__photo,.team__col,.faq__item,.finalcta,.location__card,.why__insurers,.services__head,.smiles__head,.svc-intro__body,.svc-intro__aside,.svc-band__media,.svc-band__card,.tipcard,.svc-group,.svc-cardx,.about-bio__media,.about-bio__col,.vcard,.statx,.practice__cell,.cmp,.feature,.post,.newsletter,.related__grid,.ins-intro__col,.ins-intro__media,.plan-chip,.mplan,.offer,.review-cta,.jobs-intro__col,.jobs-intro__media,.perk,.job,.apply,.reasons,.fv-intro__body,.fv-bring,.fv-step,.fv-note,.npf-intro__card,.npf-intro__body,.npf-card,.npf-aside,.ccard,.plan-chip,.mplan,.fin-intro__body,.fin-logo,.fin-uses__card,.pay__body,.pay-chip,.cs__col,.cs__collage,.cs-outcome';
  var els = Array.prototype.slice.call(document.querySelectorAll(sel));
  els.forEach(function(el){ el.classList.add('reveal'); });
  function revealAll(){ els.forEach(function(el){ el.classList.add('is-in'); }); }
  if(!('IntersectionObserver' in window)){ revealAll(); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  var vh = window.innerHeight || document.documentElement.clientHeight;
  els.forEach(function(el){
    var p = el.parentElement;
    var sibs = Array.prototype.slice.call(p.children).filter(function(c){ return c.classList.contains('reveal'); });
    var i = sibs.indexOf(el);
    el.style.transitionDelay = (Math.min(i,6) * 70) + 'ms';
    // fail-safe: anything already in view on load reveals immediately
    var rect = el.getBoundingClientRect();
    if(rect.top < vh * 0.95 && rect.bottom > 0){ el.classList.add('is-in'); }
    else { io.observe(el); }
  });
  // ultimate safety net: never leave content hidden
  setTimeout(revealAll, 1400);
})();

/* ---- Service page: interactive prep checklist ---- */
(function(){
  var list = document.getElementById('tipChecklist');
  if(!list) return;
  var fill = document.getElementById('tipFill');
  var count = document.getElementById('tipCount');
  var btns = Array.prototype.slice.call(list.querySelectorAll('.tipcard__item--btn'));
  var KEY = 'pdh-kids-tips';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ saved = {}; }
  function update(){
    var done = 0;
    btns.forEach(function(b){ if(b.closest('.tipcard__item').classList.contains('tipcard__item--done')) done++; });
    if(fill) fill.style.width = (done / btns.length * 100) + '%';
    if(count) count.textContent = done + ' / ' + btns.length + ' done';
  }
  btns.forEach(function(btn, i){
    var li = btn.closest('.tipcard__item');
    if(saved[i]){ li.classList.add('tipcard__item--done'); btn.setAttribute('aria-pressed','true'); }
    btn.addEventListener('click', function(){
      var on = li.classList.toggle('tipcard__item--done');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      saved[i] = on;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch(e){}
      update();
    });
  });
  update();
})();

/* ---- Service page: subnav scroll-spy + smooth active state ---- */
(function(){
  var nav = document.querySelector('.svc-subnav');
  if(!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('.svc-subnav__link'));
  var map = {};
  links.forEach(function(l){ var id = l.getAttribute('href').slice(1); var s = document.getElementById(id); if(s) map[id] = { link:l, section:s }; });
  var ids = Object.keys(map);
  if(!ids.length) return;
  function onScroll(){
    var pos = window.scrollY + 160;
    var current = ids[0];
    ids.forEach(function(id){ if(map[id].section.offsetTop <= pos) current = id; });
    links.forEach(function(l){ l.classList.remove('is-active'); });
    map[current].link.classList.add('is-active');
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

/* ---- Smile Gallery: before/after compare sliders ---- */
(function(){
  var frames = Array.prototype.slice.call(document.querySelectorAll('[data-compare]'));
  frames.forEach(function(frame){
    var before = frame.querySelector('.cmp__before');
    var divider = frame.querySelector('.cmp__divider');
    var handle = frame.querySelector('.cmp__handle');
    var range = frame.querySelector('.cmp__range');
    if(!before || !range) return;
    function set(v){
      v = Math.max(0, Math.min(100, v));
      before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      if(divider) divider.style.left = v + '%';
      if(handle) handle.style.left = v + '%';
    }
    range.addEventListener('input', function(){ set(parseFloat(range.value)); });
    function fromEvent(e){
      var rect = frame.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var v = x / rect.width * 100;
      range.value = v;
      set(v);
    }
    var dragging = false;
    frame.addEventListener('pointerdown', function(e){ dragging = true; fromEvent(e); });
    window.addEventListener('pointermove', function(e){ if(dragging) fromEvent(e); });
    window.addEventListener('pointerup', function(){ dragging = false; });
    set(parseFloat(range.value));
  });
})();

/* ---- Blog: topic filter ---- */
(function(){
  var bar = document.querySelector('.blog-filter');
  if(!bar) return;
  var chips = Array.prototype.slice.call(bar.querySelectorAll('.blog-filter__chip'));
  var posts = Array.prototype.slice.call(document.querySelectorAll('.blog-grid .post'));
  var feature = document.querySelector('.feature');
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var f = chip.getAttribute('data-filter');
      posts.forEach(function(p){ p.hidden = !(f === 'all' || p.getAttribute('data-cat') === f); });
      if(feature) feature.hidden = !(f === 'all' || feature.getAttribute('data-cat') === f);
    });
  });
})();

/* ---- Single blog: reading progress + TOC scroll-spy ---- */
(function(){
  var fill = document.getElementById('readFill');
  var article = document.querySelector('.prose');
  if(!fill || !article) return;
  function onScroll(){
    var start = article.offsetTop;
    var end = start + article.offsetHeight - window.innerHeight;
    var p = (window.scrollY - start) / Math.max(1, (end - start));
    fill.style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
  }
  // TOC scroll-spy
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc__link'));
  var map = {};
  links.forEach(function(l){ var id = l.getAttribute('href').slice(1); var s = document.getElementById(id); if(s) map[id] = { link:l, section:s }; });
  var ids = Object.keys(map);
  function spy(){
    if(!ids.length) return;
    var pos = window.scrollY + 140;
    var current = ids[0];
    ids.forEach(function(id){ if(map[id].section.offsetTop <= pos) current = id; });
    links.forEach(function(l){ l.classList.remove('is-active'); });
    map[current].link.classList.add('is-active');
  }
  window.addEventListener('scroll', function(){ onScroll(); spy(); }, { passive:true });
  onScroll(); spy();
})();

/* ---- Why Us: reasons tab explorer ---- */
(function(){
  var list = document.querySelector('.reasons__list');
  if(!list) return;
  var tabs = Array.prototype.slice.call(list.querySelectorAll('.reason-tab'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.reason-pane'));
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var i = tab.getAttribute('data-reason');
      tabs.forEach(function(t){ t.classList.remove('is-active'); });
      panes.forEach(function(p){ p.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var pane = document.querySelector('.reason-pane[data-pane="' + i + '"]');
      if(pane) pane.classList.add('is-active');
    });
  });
})();

(function(){
  var bar = document.querySelector('.svc-filter');
  if(!bar) return;
  var links = Array.prototype.slice.call(bar.querySelectorAll('.svc-filter__chip'));
  var map = {};
  links.forEach(function(l){ var id = l.getAttribute('data-target'); var s = document.getElementById(id); if(s) map[id] = { link:l, section:s }; });
  var ids = Object.keys(map);
  if(!ids.length) return;
  function setActive(id){ links.forEach(function(l){ l.classList.remove('is-active'); }); if(map[id]) map[id].link.classList.add('is-active'); }
  function onScroll(){
    var pos = window.scrollY + 160;
    var current = ids[0];
    ids.forEach(function(id){ if(map[id].section.offsetTop <= pos) current = id; });
    setActive(current);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();
