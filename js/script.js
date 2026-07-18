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
  var sel = '.section__head,.hero__col,.hero__media,.emerg,.ecard,.scard,.wcard,.plan,.rcard,.seal,.smile,.team__photo,.team__col,.faq__item,.finalcta,.location__card,.why__insurers,.services__head,.smiles__head';
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
