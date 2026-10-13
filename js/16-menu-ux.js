
(function(){
  const menu=document.querySelector('.mobile-menu-toggle');
  if(!menu)return;
  menu.addEventListener('click',function(){document.body.classList.add('guide-menu-used');});
  document.querySelectorAll('#siteNav a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('guide-menu-used');});});
})();
