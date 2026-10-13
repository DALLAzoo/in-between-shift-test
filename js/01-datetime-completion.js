
/* SECTION: V80-DATETIME-COMPLETION | 날짜 및 시각 입력 유효성에 따른 입력칸 채움 */
(function(){
 function refresh(){
  const date=document.getElementById('rateDate'),time=document.getElementById('rateTime');
  if(date)date.classList.toggle('datetime-complete',!!date.value && date.validity.valid);
  if(time)time.classList.toggle('datetime-complete',/^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(time.value.trim()));
 }
 document.addEventListener('input',refresh,true);
 document.addEventListener('change',refresh,true);
 document.addEventListener('click',()=>requestAnimationFrame(refresh),true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();
