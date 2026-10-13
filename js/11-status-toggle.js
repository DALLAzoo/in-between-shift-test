
(function(){
function init(){
 var t=document.getElementById('ssToggle'), panel=document.getElementById('ssExpanded');
 if(t&&panel){t.addEventListener('click',function(){var open=t.getAttribute('aria-expanded')!=='true';t.setAttribute('aria-expanded',String(open));panel.hidden=!open;});}
 document.querySelectorAll('#siteStatusAdmin .ss-segments').forEach(function(g){
  var sel=document.getElementById(g.getAttribute('data-target'));
  if(!sel)return;
  function sync(){g.querySelectorAll('button[data-value]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.value===sel.value));});}
  g.addEventListener('click',function(e){var b=e.target.closest('button[data-value]');if(!b)return;sel.value=b.dataset.value;sel.dispatchEvent(new Event('change',{bubbles:true}));sync();});
  sel.addEventListener('change',sync);sync();
 });
 var holiday=document.getElementById('ssHolidayEnabled'),fields=document.getElementById('ssHolidayFields');
 if(holiday&&fields){function update(){fields.hidden=!holiday.checked;}holiday.addEventListener('change',update);update();}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
