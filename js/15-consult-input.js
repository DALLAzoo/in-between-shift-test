
/* CONSULT-INPUT-UX-V8: native select remains the application state source */
(function(){
 const date=document.getElementById('rateDate');
 if(date){
  date.addEventListener('click',function(){if(typeof date.showPicker==='function'){try{date.showPicker();}catch(e){/* browser native fallback */}}});
 }
 const select=document.getElementById('orderPayment');
 const wrapper=document.getElementById('paymentDropdown');
 if(!select||!wrapper)return;
 const choices=Array.from(wrapper.querySelectorAll('[data-payment-value]'));
 function sync(){
  choices.forEach(button=>{
   const selected=button.dataset.paymentValue===select.value;
   button.classList.toggle('selected',selected);
   button.setAttribute('aria-pressed',String(selected));
  });
 }
 choices.forEach(button=>button.addEventListener('click',function(){
  select.value=button.dataset.paymentValue;
  select.dispatchEvent(new Event('change',{bubbles:true}));
  sync();
 }));
 select.addEventListener('change',sync);
 sync();
})();
