
// SECTION: GUIDE-IN-PLACE-V79 | 별도 화면 이동 없이 안내를 확인하고 신청 위치 유지
(function(){
 const modal=document.getElementById('consultGuideModal');
 const body=document.getElementById('consultGuideBody');
 const confirm=document.getElementById('consultGuideConfirm');
 
 const orderFinal=document.getElementById('orderFinal');
 const copyStep=document.getElementById('copyStep');
 const go=document.getElementById('orderGo');
 const realtimePanel=document.getElementById('realtimeGuideCheck');
 const realtimeLabel=realtimePanel.querySelector('.guide-check-label');
 const bottom=document.createElement('div');bottom.className='guide-confirm-bottom';bottom.id='guideConfirmBottom';
 const openBtn=document.createElement('button');openBtn.type='button';openBtn.className='guide-link guide-final-open';openBtn.textContent='상담 이용 안내 확인하기 ↗';
 const hint=document.createElement('p');hint.className='guide-action-hint';hint.id='guideActionHint';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');
 const letterLabel=document.querySelector('#letterGuideCheck .guide-check-label');
 [document.getElementById('realtimeAgreement'),document.getElementById('letterAgreement')].forEach(cb=>{cb.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});cb.tabIndex=-1;cb.setAttribute('aria-readonly','true');});
 const finalLabel=document.createElement('label');finalLabel.className='guide-check-label guide-second-confirm';
 const finalCheck=document.createElement('input');finalCheck.type='checkbox';finalCheck.id='finalAgreement';finalCheck.disabled=true;
 const finalText=document.createElement('span');finalText.textContent='상담 이용 안내 확인에 동의합니다.';
 finalLabel.append(finalCheck,finalText);
 bottom.append(openBtn,realtimeLabel,letterLabel,finalLabel,hint);
 realtimePanel.hidden=true;document.getElementById('letterGuideCheck').hidden=true;
 copyStep.parentNode.insertBefore(bottom,copyStep);
 let guideMode='realtime';
 function isRealtime(){return !document.getElementById('realtimeScreen').hidden}
 function refresh(){
  guideMode=isRealtime()?'realtime':'letter';
  realtimeLabel.hidden=guideMode!=='realtime';
  letterLabel.hidden=guideMode==='realtime';
  const check=document.getElementById(guideMode==='realtime'?'realtimeAgreement':'letterAgreement');
  finalCheck.disabled=!check.checked;
  if(!check.checked)finalCheck.checked=false;
  hint.textContent=!check.checked?'먼저 이용 안내를 열어 하단의 확인 버튼을 눌러 주세요.':!finalCheck.checked?'아래 확인 항목에 체크하면 신청 내용을 복사할 수 있습니다.':'이용 안내 확인 완료 · 신청 내용을 복사할 수 있습니다.';
  if(go)go.disabled=go.disabled||!finalCheck.checked;
  hint.hidden=false;
 }
 function openGuide(e){if(e){e.preventDefault();if(e.target&&e.target.blur)e.target.blur();}refresh();body.innerHTML='';
  const source=document.querySelector('#about .guide-master-panel');if(!source){hint.textContent='이용 안내를 불러오지 못했습니다.';return;}const clone=source.cloneNode(true);
  clone.querySelectorAll('.guide-group').forEach(g=>{if(g.id && g.id!==(guideMode==='realtime'?'aboutRealtime':'aboutLetter'))g.remove()});
  body.appendChild(clone);modal.hidden=false;document.body.classList.add('guide-modal-open');
 }
 function closeGuide(){modal.hidden=true;document.body.classList.remove('guide-modal-open');refresh();}
 openBtn.addEventListener('click',openGuide);
 document.querySelectorAll('[data-guide-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openGuide(e)},true));
 confirm.addEventListener('click',()=>{const checkbox=document.getElementById(guideMode==='realtime'?'realtimeAgreement':'letterAgreement');checkbox.checked=true;checkbox.dispatchEvent(new Event('change',{bubbles:true}));closeGuide();});



 ['realtimeAgreement','letterAgreement'].forEach(id=>document.getElementById(id).addEventListener('change',refresh));
 finalCheck.addEventListener('change',()=>{refresh();if(typeof updateOrder==='function')updateOrder();});
 document.addEventListener('click',e=>{if(e.target===go&&!finalCheck.checked){e.preventDefault();}},true);
 const obs=new MutationObserver(refresh);obs.observe(document.getElementById('realtimeScreen'),{attributes:true,attributeFilter:['hidden']});
 obs.observe(orderFinal,{attributes:true,attributeFilter:['hidden']});
 refresh();
})();
