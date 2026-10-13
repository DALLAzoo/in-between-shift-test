const cases={
'결과|여황제':{question:'내가 개발하는 타로 봇은 운영비 등을 제외하고 실제 이익을 남길까?',text:'실제로 이익을 남기는 방향으로 읽히며, 현실적인 결과를 얻는 데 긍정적인 흐름이 나타나는 것으로 보입니다. 다만 구체적인 금액이나 수익 규모까지 확인되는 것은 아닙니다.'},
'조언|절제':{question:'내 타로 봇을 개발하면서 무엇을 신경 써야 할까?',text:'타로 봇을 개발하는 과정에서는 전체적인 균형을 맞추는 데 신경 쓰시는 것이 좋겠습니다.\n\n어느 한쪽으로 지나치게 치우치기보다는 과한 부분은 덜어내고 부족한 부분은 보완하면서 적절한 상태를 만들어가는 것이 중요하겠습니다.\n\n또한 각각의 요소들이 서로 조화를 이루고 하나의 흐름으로 연결될 수 있도록 신경 쓰시는 것이 좋겠습니다.'},
'방해 요소|러버스':{question:'내 타로 봇 개발이 생각보다 진척되지 않는 이유는 무엇일까?',text:'개발을 위해 여러 가지를 진행하고 있더라도, 그 과정에서 충분히 생각하거나 판단하지 않은 채 행동으로 옮기는 부분이 방해가 되고 있는 것으로 보입니다.\n\n무언가를 하지 않고 있기 때문이라기보다는 실제로 하는 일과 그 일을 하는 이유가 충분히 연결되지 않아, 노력한 만큼 진척되지 않는 것으로 보입니다.'},
'장점|전차':{question:'내가 개발하는 타로 봇의 장점은 무엇일까?',text:'개발하시는 타로 봇의 장점은 빠른 진행과 적극적인 작동 능력에 있는 것으로 보입니다.\n\n무언가를 진행할 때 머무르거나 지체하기보다는 빠르게 다음 단계로 나아가는 데 강점이 있으며, 한번 움직이기 시작하면 그 흐름을 계속 이어가는 힘도 갖추고 있는 것으로 보입니다.\n\n따라서 이 타로 봇은 진행 속도와 추진력이 두드러지는 것이 장점이겠습니다.'},
'단점|월드':{question:'내가 개발하는 타로 봇의 단점은 무엇일까?',text:'개발하시는 타로 봇은 완성된 상태를 기준으로 판단하는 성향이 단점으로 작용할 수 있겠습니다.\n\n이미 충분한 수준에 도달한 것이라도 높은 기준에 미치지 못한다는 이유로 부족하게 평가할 수 있으며, 그 과정에서 현재 갖추어진 것의 가치를 제대로 인정하지 못하는 부분이 나타날 것으로 보입니다.\n\n따라서 완성도를 중요하게 여기는 성향 자체보다는, 그 기준이 지나치게 높게 작동하는 점이 단점이겠습니다.'}
};
const positions=['결과','조언','방해 요소','장점','단점'];const cards=['여황제','절제','러버스','전차','월드'];const sampleMap={'결과':'여황제','조언':'절제','방해 요소':'러버스','장점':'전차','단점':'월드'};let pos='결과',picked='';const $=id=>document.getElementById(id);function renderPos(){$('positions').innerHTML='';for(const p of positions){const b=document.createElement('button');b.type='button';b.className='tab'+(p===pos?' on':'');b.textContent=p;b.setAttribute('aria-pressed',String(p===pos));b.onclick=()=>{pos=p;renderPos();$('tarotResult').classList.remove('show')};$('positions').append(b)}}renderPos();function reveal(c){picked=c;$('revealed').textContent='뽑은 카드 · '+c;$('tarotResult').classList.remove('show')};$('drawCard').onclick=()=>reveal(cards[Math.floor(Math.random()*cards.length)]);$('sample').onclick=()=>{const c=sampleMap[pos];$('tarotQuestion').value=cases[pos+'|'+c].question;reveal(c)};$('read').onclick=()=>{const q=$('tarotQuestion').value.trim();if(!q||!picked){alert('질문을 적고 카드를 먼저 뽑아주세요.');return}const c=cases[pos+'|'+picked];const norm=s=>s.replace(/[?.!\s]/g,'');$('readingMeta').textContent=pos+' · '+picked;$('readingText').textContent=c&&norm(q)===norm(c.question)?c.text:'현재 질문과 카드 조합에 대한 검증된 리딩이 아직 없습니다.\n\n이 체험판은 새로운 해석을 임의로 만들어내지 않습니다. 「검증 사례 체험」 버튼으로 확인된 리딩을 볼 수 있습니다.';$('tarotResult').classList.add('show');$('tarotResult').scrollIntoView({behavior:'smooth',block:'nearest'})};async function copy(t){try{await navigator.clipboard.writeText(t);alert('복사했습니다.')}catch{const x=document.createElement('textarea');x.value=t;document.body.append(x);x.select();try{document.execCommand('copy');alert('복사했습니다.')}catch{alert('복사가 지원되지 않습니다. 직접 선택하여 복사해 주세요.')}x.remove()}}$('copyReading').onclick=()=>copy($('readingText').textContent);// 가격표에서 직접 선택하는 신청 흐름
// 10분 상담은 평일·주말·공휴일 모두 주간(10:00~22:00)에만 운영합니다.
const rateTable={weekdayDay:[10000,40000],weekdayNight:[null,50000],weekdayLate:[null,60000],weekend:[20000,80000]};
function tenMinuteAvailable(band,time){return (band==='weekdayDay'||band==='weekend') && /^([01]?\d|2[0-3]):[0-5]\d$/.test(time||'') && (()=>{const [h,m]=time.split(':').map(Number);return h*60+m>=600&&h*60+m<=1310;})();}
const rateLabels={weekdayDay:'평일 주간 10:00–22:00',weekdayNight:'평일 야간 22:00–01:00',weekdayLate:'평일 심야 01:00–10:00',weekend:'주말·휴일'};

// 가격표 날짜·시간 미리보기: 선택 상태만 강조하며, 실제 신청 가격은 선택한 요금 버튼에 연동.
const koreanPublicHolidays={"2026-01-01":"신정","2026-03-01":"삼일절","2026-05-05":"어린이날","2026-06-06":"현충일","2026-08-15":"광복절","2026-10-03":"개천절","2026-10-09":"한글날","2026-12-25":"성탄절","2026-02-16":"설날","2026-02-17":"설날","2026-02-18":"설날","2026-05-24":"부처님오신날","2026-09-24":"추석","2026-09-25":"추석","2026-09-26":"추석","2026-03-02":"삼일절 대체공휴일","2026-05-25":"부처님오신날 대체공휴일","2026-09-28":"추석 대체공휴일","2027-01-01":"신정","2027-03-01":"삼일절","2027-05-05":"어린이날","2027-06-06":"현충일","2027-08-15":"광복절","2027-10-03":"개천절","2027-10-09":"한글날","2027-12-25":"성탄절","2027-02-06":"설날","2027-02-07":"설날","2027-02-08":"설날","2027-05-13":"부처님오신날","2027-09-14":"추석","2027-09-15":"추석","2027-09-16":"추석","2027-02-09":"설날 대체공휴일","2027-08-16":"광복절 대체공휴일","2027-10-04":"개천절 대체공휴일","2028-01-01":"신정","2028-03-01":"삼일절","2028-05-05":"어린이날","2028-06-06":"현충일","2028-08-15":"광복절","2028-10-03":"추석","2028-10-09":"한글날","2028-12-25":"성탄절","2028-01-26":"설날","2028-01-27":"설날","2028-01-28":"설날","2028-05-02":"부처님오신날","2028-10-02":"추석","2028-10-04":"추석","2029-01-01":"신정","2029-03-01":"삼일절","2029-05-05":"어린이날","2029-06-06":"현충일","2029-08-15":"광복절","2029-10-03":"개천절","2029-10-09":"한글날","2029-12-25":"성탄절","2029-02-12":"설날","2029-02-13":"설날","2029-02-14":"설날","2029-05-20":"부처님오신날","2029-09-21":"추석","2029-09-22":"추석","2029-09-23":"추석","2029-05-21":"부처님오신날 대체공휴일","2029-09-24":"추석 대체공휴일","2030-01-01":"신정","2030-03-01":"삼일절","2030-05-05":"어린이날","2030-06-06":"현충일","2030-08-15":"광복절","2030-10-03":"개천절","2030-10-09":"한글날","2030-12-25":"성탄절","2030-02-02":"설날","2030-02-03":"설날","2030-02-04":"설날","2030-05-09":"부처님오신날","2030-09-11":"추석","2030-09-12":"추석","2030-09-13":"추석","2030-02-05":"설날 대체공휴일","2030-05-06":"어린이날 대체공휴일"};
const rateDate=document.getElementById('rateDate'),rateTime=document.getElementById('rateTime'),rateDateStatus=document.getElementById('rateDateStatus');

let previewBand='';
// 입력이 없는 경우 한국 표준시(Asia/Seoul)의 현재 날짜와 시각으로 요금을 계산합니다.
function currentKoreanDateTime(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
 const values=Object.fromEntries(parts.map(p=>[p.type,p.value]));
 return {date:values.year+'-'+values.month+'-'+values.day,time:values.hour+':'+values.minute};
}
function resolvedRateDateTime(){
 const now=currentKoreanDateTime();
 return {date:rateDate.value||now.date,time:rateTime.value.trim()||now.time,usingNow:!rateDate.value||!rateTime.value.trim()};
}
function bandForDateTime(){
 const {date,time}=resolvedRateDateTime();
 if(!/^([01]?\d|2[0-3]):[0-5]\d$/.test(time))return null;
 const d=new Date(date+'T12:00:00');
 if(d.getDay()===0||d.getDay()===6||koreanPublicHolidays[date])return 'weekend';
 const [h,m]=time.split(':').map(Number),minutes=h*60+m;
 return minutes>=1320||minutes<60?'weekdayNight':minutes<600?'weekdayLate':'weekdayDay';
}
function refreshRatePreview(){
 const {date,time,usingNow}=resolvedRateDateTime();
 const missing=!rateDate.value||!rateTime.value.trim();
 const invalid=rateTime.value.trim()&&!/^([01]?\d|2[0-3]):[0-5]\d$/.test(rateTime.value.trim());
 const band=(invalid||missing)?null:bandForDateTime();previewBand=band||'';
 rateDateStatus.style.whiteSpace='pre-line';
 rateDateStatus.textContent=invalid?'시간은 24시간 형식으로 입력해 주세요. 예: 23:36':
  missing?'날짜와 시작 시간을 입력하면 상담 시간을 선택할 수 있습니다.':
  '적용 요금 시간대: '+rateLabels[band]+(koreanPublicHolidays[date]?' · '+koreanPublicHolidays[date]:'')+'\n10분 상담 운영 시간: 매일 10:00~22:00 (주말·공휴일 포함)';
 const effective=band||null;
 if(effective){
  $('realtimePrice10').textContent=tenMinuteAvailable(effective,time)?formatWon(rateTable[effective][0]):'신청 불가';
  $('realtimePrice60').textContent=formatWon(rateTable[effective][1]);
 }
 $('realtimeAppliedBand').textContent=invalid?'시간 형식을 확인해 주세요.':missing?'':'선택한 상담 일시 요금: '+rateLabels[band];
 document.querySelectorAll('[data-duration-select]').forEach(b=>{
   b.disabled=Boolean(invalid||missing||(b.dataset.durationSelect==='10분'&&!tenMinuteAvailable(effective,time)));
   if(b.dataset.durationSelect==='10분')b.title=b.disabled&&effective&&!tenMinuteAvailable(effective,time)?'10분 상담은 평일·주말·공휴일 모두 10:00~21:50 시작만 신청 가능합니다.':'';
 });
 if(effective&&!tenMinuteAvailable(effective,time))$('realtimeAppliedBand').textContent+=' · 10분 상담은 평일·주말·공휴일 모두 주간(10:00~22:00)에만 신청 가능';
 if(order&&order.type==='realtime'){if(!effective){order=null;$('inlineOrder').hidden=true;}else if(order.duration==='10분'&&!tenMinuteAvailable(effective,time)){
    order=null;$('inlineOrder').hidden=true;
    document.querySelectorAll('.realtime-duration-button').forEach(b=>{b.classList.remove('chosen');b.setAttribute('aria-pressed','false')});
   }else{order.band=effective;order.base=rateTable[effective][order.duration==='1시간'?1:0];updateOrder()}}
}
// 시작 시간: 숫자 네 자리(예: 1300)를 입력하면 13:00으로 자동 변환합니다.
rateTime.addEventListener('input', function(){
  const raw = this.value;
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  const formatted = digits.length > 2 ? digits.slice(0, 2) + ':' + digits.slice(2) : digits;
  if (raw !== formatted) this.value = formatted;
});
rateTime.addEventListener('blur', function(){
  const digits = this.value.replace(/\D/g, '');
  if (digits.length === 3) {
    const padded = digits.padStart(4, '0');
    if (Number(padded.slice(0, 2)) <= 23 && Number(padded.slice(2)) <= 59) {
      this.value = padded.slice(0, 2) + ':' + padded.slice(2);
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }
});
rateDate.addEventListener('change',refreshRatePreview);rateTime.addEventListener('change',refreshRatePreview);rateTime.addEventListener('input',refreshRatePreview);
// 페이지를 열어 둔 상태에서도 미입력 요금은 분 단위로 현재 시각을 따라갑니다.
setInterval(()=>{if(!rateDate.value||!rateTime.value.trim())refreshRatePreview()},60000);

// SECTION: CONSULT-NAV | 상담 유형별 독립 화면, 돌아가기, 각 유형 입력 지우기
let consultMode='';
function resetConsultSelection(mode){
  if(order && (!mode || order.type===mode)){
    order=null;window.orderMessage='';
    document.querySelectorAll('.realtime-duration-button,.letter-price-choice').forEach(b=>{b.classList.remove('chosen');b.setAttribute('aria-pressed','false')});
    $('orderOptions').hidden=true;$('orderFinal').hidden=true;$('inlineOrder').hidden=true;
    $('orderSelection').textContent='상담을 선택해 주세요.';
    orderPayment.value='';orderWritten.checked=false;
  }
  if(mode==='realtime' || !mode){
    // Clear method independently of whether a paid consultation was selected.
    orderMethod.value='';
    rateDate.value='';rateTime.value='';
    syncRealtimeMethodButtons();
    refreshRatePreview();
  }
}
function openConsultScreen(mode){
  consultMode=mode;
  $('consultChooser').hidden=Boolean(mode);
  $('realtimeScreen').hidden=mode!=='realtime';
  $('letterScreen').hidden=mode!=='letter';
  $('allPricesScreen').hidden=mode!=='all';
  $('allPricesOpen').hidden=Boolean(mode);
  $('consultCommonNotice').hidden=true;
  $('consultPrototypeNote').hidden=!mode;
  // Keep the order card hidden until a price is explicitly selected.
  $('inlineOrder').hidden=true;
  if(mode==='realtime'||mode==='letter'){$(mode==='realtime'?'realtimeOrderSlot':'letterOrderSlot').appendChild($('inlineOrder'));}
  else {resetConsultSelection();}
  document.querySelectorAll('[data-consult-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.consultMode===mode)));
  if(mode && window.innerWidth<=760) $('prices').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('[data-consult-mode]').forEach(b=>b.addEventListener('click',()=>{resetConsultSelection();openConsultScreen(b.dataset.consultMode)}));
$('allPricesOpen').addEventListener('click',()=>openConsultScreen('all'));
document.querySelectorAll('.consult-to-top').forEach(b=>b.addEventListener('click',()=>{$('prices').scrollIntoView({behavior:'smooth',block:'start'})}));
document.querySelectorAll('.consult-back').forEach(b=>b.addEventListener('click',()=>{openConsultScreen('');$('prices').scrollIntoView({behavior:'smooth',block:'start'})}));
document.querySelectorAll('[data-clear-mode]').forEach(b=>b.addEventListener('click',()=>{resetConsultSelection(b.dataset.clearMode)}));

let order=null;refreshRatePreview();const orderMethod=$('orderMethod'),orderWritten=$('orderWritten'),orderPayment=$('orderPayment');
// 상담 방식은 상단에서 한 번만 고르며 기존 결제 계산은 숨겨진 선택값을 그대로 사용합니다.
function syncRealtimeMethodButtons(){
 const methodChosen=orderMethod.value==='채팅'||orderMethod.value==='보이스톡';
 document.querySelectorAll('[data-realtime-method]').forEach(btn=>{
  const active=btn.dataset.realtimeMethod===orderMethod.value;
  btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active));
 });
 // 상담 방식 선택 전에는 날짜와 시작 시간 입력을 비활성화합니다.
 ['rateDate','rateTime'].forEach(id=>{
  const input=$(id);if(!input)return;
  input.disabled=!methodChosen;
  input.setAttribute('aria-disabled',String(!methodChosen));
 });
}
document.querySelectorAll('[data-realtime-method]').forEach(btn=>btn.addEventListener('click',()=>{orderMethod.value=btn.dataset.realtimeMethod;syncRealtimeMethodButtons();updateOrder()}));
// 초기 상태에서도 상담 방식을 선택하기 전까지 날짜 입력을 잠급니다.
syncRealtimeMethodButtons();
// SECTION: CONSULT-PROGRESS-DATE-TIME-SCROLL | 상담 방식 → 날짜 → 시작 시간 → 상담 시간으로 화면 이동
function scrollToConsultStep(id){
 if(id==='realtimeDurationStep' && (document.getElementById('reservationAvailability')?.dataset.state!=='free' || (typeof window.tarotHolidayDateBlocked==='function'&&window.tarotHolidayDateBlocked(rateDate.value))))return;
 if($('realtimeScreen').hidden||window.innerWidth>760)return;
 requestAnimationFrame(()=>{const target=$(id);if(!target||$('realtimeScreen').hidden)return;
 const r=target.getBoundingClientRect(),top=105,bottom=window.innerHeight-85;
 // 다음 단계가 이미 충분히 보이면 화면을 움직이지 않습니다.
 if(r.top>=top&&r.top<bottom-85)return;
 const y=window.scrollY+Math.max(0,r.top-(window.innerHeight*.42));
 window.scrollTo({top:y,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
}
document.querySelectorAll('[data-realtime-method]').forEach(btn=>btn.addEventListener('click',()=>scrollToConsultStep('realtimeDateStep')));
// 날짜와 시간은 하나의 단계로 취급하므로 날짜 선택 시 별도 자동 스크롤을 하지 않습니다.
function formatWon(n){return n.toLocaleString('ko-KR')+'원'}
function selectOrder(o,el){if(o.type==='realtime'&&(!rateDate.value||!rateTime.value.trim()||!previewBand)){alert('상담 날짜와 시작 시간을 먼저 입력해 주세요.');return}order=o;const slot=$(o.type==='realtime'?'realtimeOrderSlot':'letterOrderSlot');slot.appendChild($('inlineOrder'));$('inlineOrder').hidden=false;document.querySelectorAll('.realtime-duration-button,.letter-price-choice').forEach(b=>{b.classList.toggle('chosen',b===el);b.setAttribute('aria-pressed',String(b===el))});$('orderOptions').hidden=false;orderPayment.value='';orderWritten.checked=false;$('letterAgreement').checked=false;$('realtimeAgreement').checked=false;$('methodWrap').hidden=true;$('writtenWrap').hidden=true;updateOrder();/* 선택 내용은 현재 위치에 표시하고 화면을 강제로 이동하지 않습니다. */}
document.querySelectorAll('[data-duration-select]').forEach(b=>b.addEventListener('click',()=>{const duration=b.dataset.durationSelect,band=bandForDateTime();if(!band)return;if(duration==='10분'&&!tenMinuteAvailable(band,rateTime.value.trim()))return;selectOrder({type:'realtime',band,duration,base:rateTable[band][duration==='1시간'?1:0]},b)}));
// SECTION: LETTER-PRODUCT-LOGIC | 비실시간 3장·양자택일·10장 가격
const letterProducts={three2:{count:2,base:10000,reading:'3장 타로'},choice1:{count:1,base:10000,reading:'양자택일 타로'},celtic1:{count:1,base:20000,reading:'켈틱 크로스 10장'}};
document.querySelectorAll('.letter-price-choice').forEach(b=>b.addEventListener('click',()=>{const p=letterProducts[b.dataset.letterProduct];if(p)selectOrder({type:'letter',...p},b)}));
// SECTION: LETTER-AGREEMENT | 편지 상담 공통 안내 확인 및 신청 내용 복사
// SECTION: GUIDE-SINGLE-SOURCE-V87 | 이용 안내 메뉴 한 곳에서 팝업과 신청 복사문 생성
// 안내 문구 수정: #about .guide-master-panel 안의 텍스트만 변경하면 모두 반영됩니다.
function getGuideCopyLines(mode){
 const panel=document.querySelector('#about .guide-master-panel');
 if(!panel)return [];
 const groups=[...panel.querySelectorAll('.guide-group')].filter(group=>
   !group.id || group.id===(mode==='realtime'?'aboutRealtime':'aboutLetter')
 );
 const lines=[];
 groups.forEach(group=>{
   const category=group.querySelector('.guide-category');
   if(category){if(lines.length)lines.push('');lines.push('['+category.textContent.trim()+']');}
   group.querySelectorAll('.guide-subgroup').forEach(subgroup=>{
     const heading=subgroup.querySelector('.guide-heading');
     if(heading)lines.push(heading.textContent.trim());
     subgroup.querySelectorAll('p').forEach(p=>{
       const content=p.textContent.replace(/\s+/g,' ').trim();
       if(content)lines.push(content);
     });
   });
 });
 return lines;
}
function updateOrder(){
 if(!order)return;
 const realtime=order.type==='realtime';
 $('writtenWrap').hidden=!realtime;
 if(!realtime)orderWritten.checked=false;
 const total=order.base*(realtime&&orderWritten.checked?2:1);
 const item=realtime?rateLabels[order.band]+' / '+order.duration:'비실시간 '+(order.reading||'3장 타로')+' / '+order.count+'건';
 $('orderSelection').textContent='';
 const details=document.createElement('div');details.className='order-price-details';
 const itemText=document.createElement('span');itemText.textContent=item;
 const baseText=document.createElement('span');baseText.textContent='기본 상담료 '+formatWon(order.base);
 details.append(itemText,baseText);
 const totalLine=document.createElement('div');totalLine.className='order-price-total';
 const totalLabel=document.createElement('span');totalLabel.textContent='총 결제 금액';
 const totalValue=document.createElement('strong');totalValue.textContent=formatWon(total);
 totalLine.append(totalLabel,totalValue);
 $('orderSelection').append(details,totalLine);
 const complete=Boolean(orderPayment.value)&&(!realtime||(Boolean(orderMethod.value)&&Boolean(rateDate.value)&&Boolean(rateTime.value.trim())&&Boolean(previewBand)));
 $('orderFinal').hidden=!complete;
 
 $('orderSummary').hidden=true;
 $('orderFinal').querySelector('.field').textContent='상담 신청 확인';
 $('orderGo').disabled=!complete||(realtime?!$('realtimeAgreement').checked:!$('letterAgreement').checked)||!(document.getElementById('finalAgreement')?.checked);
 if(!complete){window.orderMessage='';return;}
 const lines=[
  '[In-between Shift 상담 신청]',
  '상담 상품: '+item,
  ...(realtime?['상담 방식: 실시간 '+orderMethod.value,'상담 희망 날짜: '+rateDate.value,'상담 희망 시작 시간: '+rateTime.value]:['상담 방식: 비실시간 편지 형식 답변']),
  ...(realtime?['서면 정리 선택: '+(orderWritten.checked?'신청 (기본 상담료 100% 추가)':'신청하지 않음')]:[]),
  '기본 요금: '+formatWon(order.base),
  '선택 금액: '+formatWon(total)+(realtime?' (상담 시작 시간 기준 예상 금액)':''),
  '결제 희망 수단: '+orderPayment.value,
  '','이용 안내 확인: 질문자가 상담 이용 안내 사항을 확인함에 체크했습니다.',
  '',
  ...getGuideCopyLines(realtime?'realtime':'letter'),
  '',
  '※ 상담 신청은 카카오톡에 위 내용을 보내주셔야 접수됩니다.'
 ];
 const msg=lines.join('\n');
 $('orderSummary').textContent='';window.orderMessage=msg;
}
$('letterAgreement').addEventListener('change',updateOrder);$('realtimeAgreement').addEventListener('change',updateOrder);

orderMethod.addEventListener('change',updateOrder);orderWritten.addEventListener('change',updateOrder);orderPayment.addEventListener('change',updateOrder);
$('orderGo').addEventListener('click',async()=>{if(order&&order.type==='realtime'&&(!rateDate.value||!rateTime.value.trim()||!previewBand)){alert('상담 날짜와 시작 시간을 모두 입력해 주세요.');return}if(order&&(!(order.type==='realtime'?$('realtimeAgreement').checked:$('letterAgreement').checked)||!document.getElementById('finalAgreement')?.checked)){alert('상담 이용 안내 사항을 확인해 주세요.');return}const message=window.orderMessage;if(!message)return;let copied=false;const x=document.createElement('textarea');x.value=message;x.setAttribute('readonly','');x.style.position='fixed';x.style.opacity='0';document.body.append(x);x.focus();x.select();try{copied=document.execCommand('copy')}catch{}x.remove();if(!copied){try{await navigator.clipboard.writeText(message);copied=true}catch{}}if(!copied){alert('자동 복사에 실패했습니다. 신청 내용을 복사한 후 카카오톡으로 이동해 주세요.');return}const kakaoUrl='https://open.kakao.com/o/s2tsHDNi';const tab=window.open(kakaoUrl,'_blank','noopener');if(!tab){alert('신청 내용은 복사되었습니다. 카카오톡 창이 열리지 않았다면 브라우저의 팝업 차단 설정을 확인해 주세요.')}});


// SECTION: GUIDE-NAVIGATION-V75 | 이용 안내 확인 후 신청 화면 복귀
let guideOrigin='letter';
document.querySelectorAll('[data-guide-open]').forEach(link=>link.addEventListener('click',()=>{guideOrigin=link.dataset.guideOpen;const ret=$('guideReturn');ret.hidden=false;ret.textContent='← '+(guideOrigin==='realtime'?'실시간':'비실시간')+' 상담 신청 화면으로 돌아가기';}));
$('guideReturn').addEventListener('click',()=>{requestAnimationFrame(()=>{const target=$(guideOrigin==='realtime'?'realtimeGuideCheck':'letterGuideCheck');if(target)target.scrollIntoView({behavior:'smooth',block:'center'});});});
// SECTION: CONSULT-PROGRESS-LOGIC | 선택 완료에 따라 다음 묶음 박스만 강조
function syncConsultProgress(){
 const screen=$('realtimeScreen');const letter=$('letterScreen');
 const realtime=!screen.hidden, nonRealtime=!letter.hidden;
 const method=Boolean($('orderMethod').value);
 const datetime=Boolean(rateDate.value&&rateTime.value.trim()&&previewBand&&!(typeof window.tarotHolidayDateBlocked==='function'&&window.tarotHolidayDateBlocked(rateDate.value))&&!(typeof indicator!=='undefined'&&['blocked','error','loading'].includes(indicator.dataset.state)));
 const duration=Boolean(order&&order.type==='realtime');
 const packageSelected=Boolean(order&&order.type==='letter');
 const payment=Boolean($('orderPayment').value);
 const stages=realtime?
  [['realtimeMethodPicker',method],['realtimeDateStep',datetime],['realtimeDurationStep',duration],['paymentStep',payment],['orderFinal',false]]:
  nonRealtime?[['letterPackageCard',packageSelected],['paymentStep',payment],['orderFinal',false]]:[];
 const current=stages.findIndex(([id,done])=>!done);
 const active=current<0?stages.length-1:current;
 ['realtimeMethodPicker','realtimeDateStep','realtimeDurationStep','letterPackageCard','paymentStep','orderFinal'].forEach(id=>{
  const el=$(id);if(el){el.classList.remove('progress-current','progress-done')}
 });
 stages.forEach(([id,done],i)=>{
  const el=$(id);if(!el||el.hidden||el.closest('[hidden]'))return;
  el.classList.toggle('progress-current',i===active);
  el.classList.toggle('progress-done',i<active&&done);
 });
 // 상담 방식 변경 후에도 휴무일 예약 불가 상태를 최우선으로 유지
 const availabilityState=$('reservationAvailability')?.dataset.state;
 const durationButtons=[...document.querySelectorAll('#realtimeDurationStep .realtime-duration-button')];
 const noAvailableDuration=durationButtons.length>0&&durationButtons.every(button=>button.disabled);
 const reservationUnavailable=Boolean(realtime&&(availabilityState==='blocked'||availabilityState==='error'||noAvailableDuration));
 document.body.classList.toggle('consult-reservation-unavailable',reservationUnavailable);
 // 날짜·시간 선택 박스의 강조는 상담 방식 변경 및 예약 불가 상태와 독립적으로 유지
 document.body.classList.toggle('consult-date-time-entered',Boolean(realtime&&method&&datetime));
 if(reservationUnavailable){const box=$('realtimeDurationStep');if(box)box.classList.remove('progress-current','progress-done');}
 const blockedHoliday=typeof window.tarotHolidayDateBlocked==='function'&&window.tarotHolidayDateBlocked(rateDate.value);
 document.body.classList.toggle('consult-holiday-date-blocked',Boolean(realtime&&blockedHoliday));
 if(blockedHoliday){
  const durationBox=$('realtimeDurationStep');
  if(durationBox){durationBox.classList.remove('progress-current','progress-done');}
 }
}
['click','change','input'].forEach(eventName=>$('realtimeScreen').addEventListener(eventName,()=>requestAnimationFrame(syncConsultProgress)));
$('orderPayment').addEventListener('change',()=>requestAnimationFrame(syncConsultProgress));
$('letterScreen').addEventListener('click',()=>requestAnimationFrame(syncConsultProgress));
$('orderWritten').addEventListener('change',()=>requestAnimationFrame(syncConsultProgress));
const consultProgressObserver=new MutationObserver(()=>syncConsultProgress());
consultProgressObserver.observe($('realtimeScreen'),{attributes:true,attributeFilter:['hidden']});
consultProgressObserver.observe($('letterScreen'),{attributes:true,attributeFilter:['hidden']});
requestAnimationFrame(syncConsultProgress);

// SECTION: CONSULT-PROGRESS-AUTO-SCROLL | 날짜·시간 입력 완료 시 다음 선택 박스로 시선 이동
// 최초 완성되는 순간에만 이동하며, 이후 날짜/시간 수정 중에는 화면을 강제로 움직이지 않습니다.
let datetimeWasReady=Boolean(rateDate.value && rateTime.value.trim() && previewBand);
function guideToDurationAfterDatetime(){
 const ready=Boolean(rateDate.value && rateTime.value.trim() && previewBand);
 const newlyReady=ready && !datetimeWasReady;
 datetimeWasReady=ready;
 if(!newlyReady || $('realtimeScreen').hidden || window.innerWidth>760 || (typeof window.tarotHolidayDateBlocked==='function'&&window.tarotHolidayDateBlocked(rateDate.value)) || $('reservationAvailability')?.dataset.state!=='free')return;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if($('realtimeScreen').hidden)return;
  const next=$('realtimeDurationStep');
  if(next)scrollToConsultStep('realtimeDurationStep');
 }));
}
rateDate.addEventListener('change',guideToDurationAfterDatetime);
rateTime.addEventListener('change',guideToDurationAfterDatetime);
rateTime.addEventListener('input',guideToDurationAfterDatetime);

// 시제품 전용: 현재 브라우저의 로컬 저장소만 사용. 실제 고객 인증/공유 기능 아님.
const ledgerKey='ibs_demo_ledgers_v03';let ledgers=[];let selectedLedger='';
try{ledgers=JSON.parse(localStorage.getItem(ledgerKey)||'[]');if(!Array.isArray(ledgers))ledgers=[]}catch{ledgers=[]}
const money=n=>Math.round(n).toLocaleString('ko-KR')+'원';const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function saveLedgers(){try{localStorage.setItem(ledgerKey,JSON.stringify(ledgers))}catch{alert('브라우저 저장 공간에 기록을 저장할 수 없습니다.')}}
function currentLedger(){return ledgers.find(l=>l.id===selectedLedger)}
function ledgerTotals(l){let count=0,balance=0,debt=0;for(const r of l.records){if(r.action==='addCount')count+=r.amount;if(r.action==='useCount')count-=r.amount;if(r.action==='deposit')balance+=r.amount;if(r.action==='charge')balance-=r.amount;if(r.action==='debt')debt+=r.amount;if(r.action==='payDebt')debt-=r.amount;}const points=l.records.reduce((v,r)=>v+(r.action==='pointEarn'?r.amount:0)-(r.action==='pointRedeem'?r.amount:0),0);const pending=(l.spinTickets||[]).filter(t=>!t.used).length;const waiting=(l.waitingPayments||[]).filter(x=>!x.confirmed).length;return {count,balance,debt,points,pending,waiting}}
const actionNames={pointEarn:'룰렛 포인트 적립',pointRedeem:'편지 상담 1건 교환 · 관리자 승인',addCount:'상담 횟수 충전',useCount:'상담 횟수 차감',deposit:'결제 확정',charge:'상담 이용 금액 차감',debt:'미입금 금액 등록',payDebt:'미입금 입금 확인',memo:'공유 메모'};
function ledgerHistory(l){return l.records.slice().reverse().map(r=>'<div class="ledger-log"><strong>'+safe(actionNames[r.action])+'</strong> '+(r.action==='memo'?'':safe(r.action.startsWith('point')?r.amount.toLocaleString('ko-KR')+'P':r.action.includes('Count')?r.amount+'회':money(r.amount)))+'<small>'+safe(new Date(r.at).toLocaleString('ko-KR'))+(r.note?' · '+safe(r.note):'')+'</small></div>').join('')||'<p class="muted">기록이 없습니다.</p>'}
function statsHTML(t){return '<div class="ledger-stat"><small>선결제 잔액</small><strong>'+money(t.balance)+'</strong></div><div class="ledger-stat"><small>룰렛 지급 대기</small><strong>'+t.waiting+'건</strong></div><div class="ledger-stat"><small>보유 포인트</small><strong>'+t.points.toLocaleString('ko-KR')+'P</strong></div><div class="ledger-stat"><small>미사용 룰렛</small><strong>'+t.pending+'회</strong></div>'}
function renderLedgers(){const sel=$('ledgerSelect');sel.innerHTML='<option value="">장부 선택</option>'+ledgers.map(l=>'<option value="'+safe(l.id)+'">'+safe(l.name)+' · '+(l.closed?'종료':'이용 중')+'</option>').join('');sel.value=selectedLedger;const l=currentLedger();$('ledgerEditor').hidden=!l;if(!l){$('clientContent').textContent='관리자 화면에서 장부를 발급하면 고객에게 보일 내용을 미리 볼 수 있습니다.';return}const t=ledgerTotals(l);$('adminStats').innerHTML=statsHTML(t);$('adminHistory').innerHTML=ledgerHistory(l);$('toggleLedger').textContent=l.closed?'장부 다시 활성화':'장부 종료';$('ledgerStatus').textContent=l.closed?'종료된 장부입니다. 실제 서비스에서는 고객 링크 접근이 차단됩니다.':(t.balance===0&&t.debt===0&&t.points===0&&t.pending===0?'모든 잔여 횟수와 금액이 0입니다. 필요하면 장부를 종료하세요.':'이용 중인 장부입니다.');$('clientTitle').textContent=l.name+'님의 상담 장부';$('clientContent').innerHTML=l.closed?'<div class="ledger-closed">이용이 종료된 장부입니다. 고객은 더 이상 조회할 수 없습니다.</div>':'<div class="ledger-stats">'+statsHTML(t)+'</div>'+(t.waiting?'<div class="notice">룰렛 지급 대기 · '+t.waiting+'건</div>':'')+'<h3>상담 및 결제 기록</h3>'+ledgerHistory(l)}
$('createLedger').onclick=()=>{const name=$('ledgerName').value.trim();if(!name){alert('고객 구분명을 입력해 주세요.');return}const existing=ledgers.find(l=>l.name===name);if(existing){selectedLedger=existing.id;renderLedgers();$('ledgerStatus').textContent='기존 고객 장부를 선택했습니다. 결제 확인 금액을 등록하세요.';return}const id='DEMO-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);ledgers.push({id,name,closed:false,records:[],spinTickets:[],payments:[]});selectedLedger=id;saveLedgers();renderLedgers();$('ledgerName').value='';$('ledgerStatus').textContent='✓ 신규 고객 장부가 준비되었습니다. 아래에서 결제를 등록하세요.'};
$('ledgerSelect').onchange=e=>{selectedLedger=e.target.value;renderLedgers();$('issueSpin').textContent='결제 확정 · 대기 룰렛 지급'};
$('addLedgerRecord').onclick=()=>{const l=currentLedger();if(!l||l.closed){alert('이용 중인 장부를 선택해 주세요.');return}const action=$('ledgerAction').value,amount=action==='memo'?0:Number($('ledgerAmount').value),note=$('ledgerNote').value.trim();if(action!=='memo'&&(!Number.isSafeInteger(amount)||amount<=0)){alert('0보다 큰 정수 금액을 입력해 주세요.');return}if(action==='memo'&&!note){alert('메모를 입력해 주세요.');return}const t=ledgerTotals(l);if(action==='payDebt'&&amount>t.debt){alert('미입금 금액보다 많이 입금 처리할 수 없습니다.');return}if(action==='charge'&&amount>t.balance){alert('선결제 잔액보다 요금이 큽니다. 선결제 금액을 차감하고 나머지를 미입금으로 등록하려면 두 기록으로 나누어 입력해 주세요.');return}l.records.push({action,amount,note,at:new Date().toISOString()});$('ledgerNote').value='';saveLedgers();renderLedgers()};
$('toggleLedger').onclick=()=>{const l=currentLedger();if(!l)return;const t=ledgerTotals(l);if(!l.closed&&(t.balance!==0||t.debt!==0||t.points!==0||t.pending!==0||t.waiting!==0)){alert('선결제 잔액, 미입금 금액, 포인트 및 룰렛 이용권이 모두 0이어야 종료할 수 있습니다.');return}if(!confirm(l.closed?'장부를 다시 활성화할까요?':'장부를 종료할까요?'))return;l.closed=!l.closed;saveLedgers();renderLedgers()};
function showLedgerTab(client){$('adminPane').hidden=client;$('clientPane').hidden=!client;$('adminTab').classList.toggle('on',!client);$('clientTab').classList.toggle('on',client)}
$('adminTab').onclick=()=>showLedgerTab(false);$('clientTab').onclick=()=>showLedgerTab(true);$('previewLedger').onclick=()=>showLedgerTab(true);
if($('copySettlement'))$('copySettlement').onclick=()=>{const l=currentLedger();if(!l)return;const t=ledgerTotals(l);const msg='[In-between Shift 상담 이용 내역]\n고객: '+l.name+'\n남은 건당 상담: '+t.count+'회\n선결제 잔액: '+money(t.balance)+'\n미입금 금액: '+money(t.debt)+'\n\n결제 확인 후 발급된 개인 장부에서 이용 및 정산 기록을 확인하실 수 있습니다.\n※ 상담자가 별도로 전달한 전용 조회 링크를 이용해 주세요.';copy(msg)};
// SECTION: POINT-LOGIC | 룰렛 확률, 적립 및 관리자 승인 로직
const spinRates=[{rate:0.5,weight:40},{rate:1,weight:30},{rate:1.5,weight:18},{rate:2,weight:9},{rate:3,weight:3}];
let spinBusy=false;let wheelTurns=0;
// SECTION: ROULETTE-SOUND | 브라우저 내장 효과음: 회전 딸깍음과 당첨 알림음
let spinSoundOn=true, spinAudio=null, tickAnimation=0;
function audioReady(){
 if(!spinSoundOn)return null;
 try{const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return null;
  if(!spinAudio)spinAudio=new AudioContextClass();
  if(spinAudio.state==='suspended')spinAudio.resume().catch(()=>{});
  return spinAudio;
 }catch(e){return null}
}
function soundTone(freq,duration,volume,type='triangle',delay=0){
 const ctx=audioReady();if(!ctx)return;
 try{const start=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,start);
  gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.006);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.015);
 }catch(e){}
}
function rouletteTick(){soundTone(980,.017,.012,'triangle')}
function rouletteWinSound(){soundTone(523.25,.16,.08,'sine');soundTone(659.25,.17,.08,'sine',.13);soundTone(783.99,.28,.09,'sine',.27)}
let rouletteResultTimer;
function showRouletteResult(points,rate){
 const overlay=document.getElementById('rouletteResultOverlay');
 if(!overlay)return;
 const card=overlay.querySelector('.roulette-result-card');
 document.getElementById('rouletteResultPoints').textContent=points.toLocaleString('ko-KR')+'P';
 document.getElementById('rouletteResultCaption').textContent=rate+'% 적립 · 포인트 지급 완료';
 clearTimeout(rouletteResultTimer);
 if(overlay._winAnimation)overlay._winAnimation.cancel();
 if(card._winAnimation)card._winAnimation.cancel();
 overlay.classList.remove('show','celebrate');
 overlay.style.setProperty('display','flex','important');
 overlay.style.setProperty('visibility','visible','important');
 overlay.style.setProperty('opacity','1','important');
 overlay.style.setProperty('z-index','2147483647','important');
 overlay.setAttribute('aria-hidden','false');
 void overlay.offsetWidth;
 overlay.classList.add('celebrate');
 if(overlay.animate){
  overlay._winAnimation=overlay.animate([
   {opacity:0,offset:0},{opacity:1,offset:.09},{opacity:1,offset:.75},{opacity:0,offset:1}
  ],{duration:2400,easing:'linear',fill:'forwards'});
  card._winAnimation=card.animate([
   {transform:'translateY(90px) scale(.18) rotate(-9deg)',opacity:0,offset:0},
   {transform:'translateY(-24px) scale(1.18) rotate(3deg)',opacity:1,offset:.16},
   {transform:'translateY(8px) scale(.92) rotate(-2deg)',opacity:1,offset:.26},
   {transform:'translateY(-8px) scale(1.06) rotate(1deg)',opacity:1,offset:.35},
   {transform:'translateY(0) scale(1) rotate(0)',opacity:1,offset:.46},
   {transform:'translateY(0) scale(1) rotate(0)',opacity:1,offset:.75},
   {transform:'translateY(-125px) scale(1.12) rotate(5deg)',opacity:0,offset:1}
  ],{duration:2400,easing:'ease-out',fill:'forwards'});
 }else{
  overlay.classList.add('show');
 }
 rouletteResultTimer=setTimeout(()=>{
  overlay.style.setProperty('visibility','hidden','important');
  overlay.style.setProperty('opacity','0','important');
  overlay.setAttribute('aria-hidden','true');
  overlay.classList.remove('show','celebrate');
 },2450);
}
function rouletteImpactVisual(){
 const frame=document.querySelector('.point-wheel-frame');
 if(!frame)return;
 frame.classList.remove('impact');
 void frame.offsetWidth;
 frame.classList.add('impact');
 setTimeout(()=>frame.classList.remove('impact'),1050);
}

// 실제 원판의 회전각을 추적하여 구간 경계를 지날 때만 짧은 클릭음을 냅니다.
// 고속 회전 중에는 연속음을 억제하고 감속 시 실제 경계 통과와 소리가 일치합니다.
function wheelVisibleAngle(){
 const transform=getComputedStyle($('pointWheel')).transform;
 if(!transform||transform==='none')return 0;
 try{const m=new DOMMatrixReadOnly(transform);return ((Math.atan2(m.b,m.a)*180/Math.PI)%360+360)%360}
 catch(e){const m=transform.match(/matrix\(([^)]+)\)/);if(!m)return 0;const v=m[1].split(',').map(Number);return ((Math.atan2(v[1],v[0])*180/Math.PI)%360+360)%360}
}
function startRouletteTicks(durationMs){
 cancelAnimationFrame(tickAnimation);
 const start=performance.now();
 const boundaries=[0,144,252,316.8,349.2];
 let previous=wheelVisibleAngle(),lastFrame=start,lastSound=0;
 function animate(now){
  if(!spinBusy||now-start>=durationMs){tickAnimation=0;return}
  const angle=wheelVisibleAngle();
  let delta=(angle-previous+360)%360;
  if(now-lastFrame>100)delta=0;
  if(delta>0&&delta<180){
   const crossed=boundaries.some(b=>((b-previous+360)%360)>0&&((b-previous+360)%360)<=delta);
   if(crossed&&now-lastSound>=70){rouletteTick();lastSound=now}
  }
  previous=angle;lastFrame=now;
  tickAnimation=requestAnimationFrame(animate);
 }
 tickAnimation=requestAnimationFrame(animate);
}
$('spinSoundToggle').onclick=()=>{
 spinSoundOn=!spinSoundOn;
 $('spinSoundToggle').textContent=spinSoundOn?'🔊 효과음 켜짐':'🔇 효과음 꺼짐';
 $('spinSoundToggle').setAttribute('aria-pressed',String(spinSoundOn));
 if(spinSoundOn)audioReady();
};
// 원판의 실제 확률 구간 중앙에 적립률을 배치한다.
(function drawWheelLabels(){
 const holder=document.getElementById('wheelLabels');if(!holder)return;
 holder.textContent='';let begin=0;
 spinRates.forEach(item=>{
  const middle=(begin+item.weight/2)*3.6*Math.PI/180;
  const el=document.createElement('span');el.className='wheel-segment-label';
  el.textContent=item.rate+'%';
  const radius= item.weight<=3 ? 105 : item.weight<=9 ? 103 : 89;
  el.style.left='calc(50% + '+(Math.sin(middle)*radius).toFixed(2)+'px)';
  el.style.top='calc(50% - '+(Math.cos(middle)*radius).toFixed(2)+'px)';
  holder.appendChild(el);begin+=item.weight;
 });
})();
function updateSpinView(){
 const l=currentLedger(),t=l?ledgerTotals(l):null,ticket=l?(l.spinTickets||[]).find(x=>!x.used):null;
 $('spinNow').disabled=!ticket||spinBusy||!!l.closed;
 $('spinNow').textContent=spinBusy?'룰렛 회전 중…':ticket?'룰렛 돌리기 (남은 '+t.pending+'회)':'이용권 없음 · 관리자 발급 필요';
 if(!spinBusy)$('spinStatus').textContent=!l?'먼저 관리자 화면에서 고객 장부를 발급·선택해 주세요.':l.closed?'종료된 장부입니다.':ticket?'룰렛 이용 가능! 남은 '+t.pending+'회':t&&t.waiting?'룰렛 지급 대기 중입니다.':'사용 가능한 룰렛이 없습니다.';
 $('pointAdminStatus').textContent=t?'현재 장부: '+l.name+' · 지급 대기 '+t.waiting+'건 · 보유 '+t.points.toLocaleString('ko-KR')+'P · 미사용 룰렛 '+t.pending+'회':'먼저 고객 장부를 선택해 주세요.';
}
// 관리자만 결제 확정 여부를 판단합니다. 고객에게는 대기/발급 상태만 노출합니다.
function ensurePointCustomer(){let l=currentLedger();if(l&&!l.closed)return l;const name=$('ledgerName').value.trim();if(!name)return null;l=ledgers.find(x=>x.name===name&&!x.closed);if(!l){l={id:'DEMO-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),name,closed:false,records:[],spinTickets:[],payments:[],waitingPayments:[]};ledgers.push(l)}selectedLedger=l.id;saveLedgers();renderLedgers();return l}
$('queueSpin').onclick=()=>{
 const l=ensurePointCustomer(),amount=Number($('spinPayment').value);
 if(!l){$('pointAdminStatus').textContent='⚠ 장부를 선택하거나 고객 구분명을 입력해 주세요.';return}
 if(!Number.isSafeInteger(amount)||amount<10000){$('pointAdminStatus').textContent='⚠ 금액은 10,000원 이상의 정수로 입력해 주세요.';return}
 const base=Math.floor(amount/10000),bonus=Math.floor(amount/100000),qty=base+bonus;
 (l.waitingPayments??=[]).push({id:'WAIT-'+Date.now()+'-'+Math.random().toString(36).slice(2,9),amount,base,bonus,qty,at:new Date().toISOString(),confirmed:false});
 saveLedgers();renderLedgers();$('pointAdminStatus').textContent='✓ 룰렛 지급 대기 등록 · '+money(amount)+' · 예정 '+qty+'회 (아직 잔액·이용권 미반영)';
};
$('issueSpin').onclick=()=>{
 const l=ensurePointCustomer();if(!l){$('pointAdminStatus').textContent='⚠ 고객 장부를 먼저 선택해 주세요.';return}
 const wait=(l.waitingPayments||[]).find(x=>!x.confirmed);
 if(!wait){$('pointAdminStatus').textContent='⚠ 확정할 룰렛 지급 대기 건이 없습니다. 먼저 지급 대기를 등록해 주세요.';return}
 if(!confirm(l.name+' · '+money(wait.amount)+' 결제를 실제로 확정하고 룰렛 '+wait.qty+'회를 지급할까요?'))return;
 const at=new Date().toISOString();wait.confirmed=true;wait.confirmedAt=at;
 (l.payments??=[]).push({ref:wait.id,amount:wait.amount,at,base:wait.base,bonus:wait.bonus});
 l.records.push({action:'deposit',amount:wait.amount,note:'룰렛 '+wait.qty+'회 지급 (기본 '+wait.base+' + 보너스 '+wait.bonus+')',at});
 for(let i=0;i<wait.qty;i++)(l.spinTickets??=[]).push({id:'SPIN-'+Date.now()+'-'+i+'-'+Math.random().toString(36).slice(2,7),payment:10000,sourceRef:wait.id,used:false,at});
 saveLedgers();renderLedgers();$('pointAdminStatus').textContent='✓ 결제 확정 '+money(wait.amount)+' · 룰렛 '+wait.qty+'회 지급 완료 · 미사용 '+ledgerTotals(l).pending+'회';
};
$('redeemPoints').onclick=()=>{const l=currentLedger();if(!l||l.closed)return alert('이용 중인 장부를 선택해 주세요.');if(ledgerTotals(l).points<10000)return alert('10,000P 이상 보유해야 교환할 수 있습니다.');if(!confirm(l.name+' 고객의 요청을 확인했고, 10,000P를 차감하여 편지 상담 1건을 승인할까요?'))return;l.records.push({action:'pointRedeem',amount:10000,note:'관리자 승인 · 편지 상담 1건',at:new Date().toISOString()});saveLedgers();renderLedgers();updateSpinView();};
$('spinNow').onclick=()=>{
 const l=currentLedger(),ticket=l&&(l.spinTickets||[]).find(x=>!x.used);
 if(!l){alert('고객 장부를 먼저 선택해 주세요.');return}
 if(!ticket||l.closed||spinBusy){$('spinStatus').textContent='사용 가능한 이용권이 없습니다. 관리자 화면에서 발급 여부를 확인해 주세요.';return}
 document.getElementById('wheelFrame').classList.remove('win-show','impact');audioReady();spinBusy=true;updateSpinView();$('spinNow').disabled=true;$('spinStatus').textContent='룰렛이 돌아가고 있습니다…';
 const arr=new Uint32Array(1);if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(arr);else arr[0]=Math.floor(Math.random()*4294967296);
 const n=arr[0]%100;let sum=0;const result=spinRates.find(x=>(sum+=x.weight)>n);
 const points=Math.floor(10000*result.rate/100);
 // 당첨 구간의 중앙이 상단 고정 화살표를 가리키도록 회전
 const idx=spinRates.indexOf(result),startPct=spinRates.slice(0,idx).reduce((a,x)=>a+x.weight,0),midDeg=(startPct+result.weight/2)*3.6;
 const current=((wheelTurns%360)+360)%360,desired=(360-midDeg)%360;
 wheelTurns+=1800+((desired-current+360)%360);
 $('pointWheel').style.transform='rotate('+wheelTurns+'deg)';
 startRouletteTicks(3800);
 setTimeout(()=>{
  ticket.used=true;ticket.rate=result.rate;ticket.points=points;ticket.usedAt=new Date().toISOString();
  l.records.push({action:'pointEarn',amount:points,note:'결제 '+(ticket.sourceRef||'기존 이용권')+' · 10,000원 기준 · 룰렛 '+result.rate+'%',at:ticket.usedAt});
  cancelAnimationFrame(tickAnimation);document.getElementById('wheelWinAmount').textContent=points.toLocaleString('ko-KR')+'P';rouletteImpactVisual();document.getElementById('wheelFrame').classList.add('win-show');showRouletteResult(points,result.rate);setTimeout(rouletteWinSound,550);
  saveLedgers();spinBusy=false;$('spinNow').disabled=false;renderLedgers();
  $('spinStatus').textContent='✓ '+result.rate+'% 당첨! '+points.toLocaleString('ko-KR')+'P 적립 완료 · 남은 이용권 '+ledgerTotals(l).pending+'회';
 },3900);
};
function updateGlobalPointStats(){const now=new Date();let month=0,outstanding=0;for(const l of ledgers){outstanding+=ledgerTotals(l).points;for(const r of l.records){if(r.action==='pointEarn'){const d=new Date(r.at);if(d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth())month+=r.amount}}}$('pointGlobalStats').textContent='전체 고객 미사용 포인트: '+outstanding.toLocaleString('ko-KR')+'P · 이번 달 지급 포인트: '+month.toLocaleString('ko-KR')+'P'}
const oldRenderLedgers=renderLedgers;renderLedgers=function(){oldRenderLedgers();updateSpinView();updateGlobalPointStats();};
renderLedgers();
if(!currentLedger())$('pointAdminStatus').textContent='고객을 선택한 뒤 결제 금액을 입력해 룰렛 지급 대기를 등록하세요.';
