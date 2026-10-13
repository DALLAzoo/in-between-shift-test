
(function(){
 const toggle=document.querySelector('.mobile-menu-toggle');
 const nav=document.getElementById('siteNav');
 if(!toggle||!nav)return;
 const mq=window.matchMedia('(max-width:720px)');
 function close(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','메뉴 열기');nav.hidden=mq.matches;}
 function sync(){if(mq.matches){close();}else{nav.hidden=false;nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}}
 toggle.addEventListener('click',function(){if(!mq.matches)return;const open=nav.hidden;nav.hidden=!open;nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
 nav.addEventListener('click',function(e){if(e.target.closest('a'))close()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 document.addEventListener('click',function(e){if(!nav.contains(e.target)&&!toggle.contains(e.target)&&mq.matches)close()});
 window.addEventListener('resize',sync);
 window.addEventListener('scroll',function(){if(mq.matches&&!nav.hidden)close()},{passive:true});
 sync();
})();
