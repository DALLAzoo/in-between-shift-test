
/* SECTION: V82-PAYMENT-SELECTED-STATE | 쿠폰/상품권 선택 시 입력칸 색상 갱신 */
(function(){
 function sync(){const select=document.getElementById('orderPayment');if(select)select.classList.toggle('payment-selected',!!select.value);}
 document.addEventListener('change',sync,true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
})();
