
/* 모바일: 홈/상담가격/무료타로/이용안내/장부는 각각 독립된 화면. PC는 원래 스크롤형. */
(function(){
 const mq=window.matchMedia('(max-width:720px)');
 const views=['home','prices','tarot','about','customerLedger','ledger'];
 const body=document.body;
 const scrollHint=document.getElementById('mobileScrollHint');
 let hintFrame=0;
 let guideSawMore=false;
 function updateScrollHint(){
  hintFrame=0;
  const view=body.dataset.mobileView||'home';
  const sections=view==='home'?['home','intro','services']:[view];
  const visibleSections=sections.map(id=>document.getElementById(id)).filter(el=>el&&getComputedStyle(el).display!=='none');
  const contentBottom=visibleSections.length?Math.max(...visibleSections.map(el=>el.getBoundingClientRect().bottom)):0;
  // Footer, page padding, and hidden screens must not trigger the hint.
  const hasMore=mq.matches&&body.classList.contains('mobile-page-mode')&&contentBottom>window.innerHeight+125;
  scrollHint.classList.toggle('visible',hasMore);
  scrollHint.setAttribute('aria-hidden',String(!hasMore));
  // 이용 안내에서 MORE가 사라지고 실제로 아래까지 읽었을 때만 메뉴 강조.
  if(view==='about'&&hasMore)guideSawMore=true;
  const guideFinished=mq.matches&&view==='about'&&body.classList.contains('mobile-page-mode')&&guideSawMore&&!hasMore&&window.scrollY>120;
  body.classList.toggle('guide-more-finished',guideFinished);
 }
 function queueScrollHint(){if(!hintFrame)hintFrame=requestAnimationFrame(updateScrollHint);}
 window.addEventListener('scroll',queueScrollHint,{passive:true});
 window.addEventListener('resize',queueScrollHint);
 if(window.ResizeObserver){new ResizeObserver(queueScrollHint).observe(document.body);}
 function viewFromHash(){
  const id=decodeURIComponent(location.hash.slice(1));
  if(views.includes(id))return id;
  const target=id&&document.getElementById(id);
  if(target){const section=target.closest('section[id]');if(section&&views.includes(section.id))return section.id;}
  return 'home';
 }
 function show(view,scroll=true){
  if(!views.includes(view))view='home';
  if(body.dataset.mobileView!==view){guideSawMore=false;body.classList.remove('guide-more-finished','guide-menu-used');}
  body.dataset.mobileView=view;
  if(scroll)window.scrollTo({top:0,behavior:'instant'});
  queueScrollHint();
  requestAnimationFrame(queueScrollHint);
 }
 function sync(){
  if(mq.matches){body.classList.add('mobile-page-mode');show(viewFromHash(),true);}
  else{body.classList.remove('mobile-page-mode','guide-more-finished');body.removeAttribute('data-mobile-view');}
  queueScrollHint();
 }
 document.addEventListener('click',function(e){
  if(!mq.matches)return;
  const a=e.target.closest('a[href^="#"]');if(!a)return;
  const id=a.getAttribute('href').slice(1);
  const el=id&&document.getElementById(id);
  if(!el)return;
  const section=el.closest('section[id]');
  const view=views.includes(id)?id:(section&&views.includes(section.id)?section.id:null);
  if(!view)return;
  e.preventDefault();
  show(view,true);
  if(location.hash!==('#'+id))history.pushState(null,'','#'+id);
  if(id!==view)requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));
 });
 window.addEventListener('hashchange',()=>{if(mq.matches)show(viewFromHash(),true)});
 window.addEventListener('popstate',()=>{if(mq.matches)show(viewFromHash(),true)});
 mq.addEventListener('change',sync);
 sync();
})();
