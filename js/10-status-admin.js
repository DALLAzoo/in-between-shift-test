
(function(){
function sync(){document.querySelectorAll('#siteStatusAdmin .ss-segments').forEach(function(group){var sel=document.getElementById(group.dataset.target);if(!sel)return;group.querySelectorAll('button[data-value]').forEach(function(btn){btn.setAttribute('aria-pressed',String(btn.dataset.value===sel.value))})});var chk=document.getElementById('ssHolidayEnabled'),fields=document.getElementById('ssHolidayFields');if(chk&&fields)fields.hidden=!chk.checked}
document.querySelectorAll('#siteStatusAdmin .ss-segments').forEach(function(group){group.addEventListener('click',function(e){var btn=e.target.closest('button[data-value]');if(!btn)return;var sel=document.getElementById(group.dataset.target);if(!sel)return;sel.value=btn.dataset.value;sel.dispatchEvent(new Event('change',{bubbles:true}));sync()})});
var holiday=document.getElementById('ssHolidayEnabled');if(holiday)holiday.addEventListener('change',sync);
// Removed recursive MutationObserver to prevent continuous rendering.
// Firebase asynchronously fills native select values: update visible buttons after initial fetch and on admin opening.
var last='';setInterval(function(){var selects=[...document.querySelectorAll('#siteStatusAdmin .ss-native-select')].map(s=>s.value).join('|')+'|'+(holiday?holiday.checked:'');if(selects!==last){last=selects;sync()}},500);sync();
})();
