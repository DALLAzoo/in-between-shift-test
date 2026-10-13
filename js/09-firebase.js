
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,onSnapshot,addDoc,deleteDoc,doc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyD32a2JMxAtTSR6YEAZTKb7lGmlPL6qaxM',authDomain:'in-between-shift.firebaseapp.com',projectId:'in-between-shift',storageBucket:'in-between-shift.firebasestorage.app',messagingSenderId:'242339202689',appId:'1:242339202689:web:240221ff95ce5c52a06f80',measurementId:'G-5DQ7SSH7YY'};
const $r=id=>document.getElementById(id),auth=getAuth(initializeApp(firebaseConfig)),db=getFirestore(auth.app),reservations=collection(db,'blockedReservations');
let blocks=[],loaded=false,liveError=false,currentUser=null;
const dateInput=$r('rateDate'),timeInput=$r('rateTime'),indicator=$r('reservationAvailability');
const defaultSettings={normalLive:true,normalLetter:true,current:'available',holidayEnabled:false,holidayStart:'',holidayEnd:'',holidayText:'개인 사정으로 휴무 중',holidayLive:false,holidayLetter:true,alertVisible:true};
let siteSettings={...defaultSettings},settingsReady=false,settingsError=false;
const ssDoc=doc(db,'siteSettings','consultation');
const koreaDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const koreaHour=()=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
function holidayActive(date=koreaDay()){return !!(siteSettings.holidayEnabled&&siteSettings.holidayStart&&siteSettings.holidayEnd&&date>=siteSettings.holidayStart&&date<=siteSettings.holidayEnd)}
function holidayDateBlocked(date){return !!date&&holidayActive(date)}
window.tarotHolidayDateBlocked=holidayDateBlocked;
function intakeAllowed(type){if(!settingsReady||settingsError)return false;return type==='realtime'?siteSettings.normalLive:siteSettings.normalLetter}
function renderSiteStatus(){const holiday=holidayActive(),ready=settingsReady&&!settingsError;
 const statusGrid=$r('siteStatus').querySelector('.ss-status-grid');
 if(statusGrid){statusGrid.dataset.loading=ready?'false':'true';statusGrid.setAttribute('aria-busy',String(!ready));}
 const today=koreaDay(), scheduled=!!(siteSettings.holidayEnabled&&siteSettings.holidayStart&&siteSettings.holidayEnd&&today<siteSettings.holidayStart);
 const holidayText=siteSettings.holidayText||'개인 사정으로 휴무 중';
 const holidayMessage=`${scheduled?'휴무 예정':'휴무 중'} · ${holidayText} · ${siteSettings.holidayStart} ~ ${siteSettings.holidayEnd}`;
 const hs=$r('ssHolidaySummary');
 hs.hidden=!(holiday||scheduled);
 if(holiday||scheduled)hs.textContent=holidayMessage;
 const letter=ready&&intakeAllowed('letter'),live=ready&&intakeAllowed('realtime');
 $r('ssLetterIntake').textContent=!ready?'확인 중…':letter?'보내기 가능':'보내기 잠시 중단';
 const answerStatus=!ready?'확인 중…':holiday?'답변 휴무 중':koreaHour()>=10&&koreaHour()<22?'순차 답변 중':'답변 쉬는 시간';
 $r('ssLetterAnswerBadge').textContent=answerStatus;
 const state=holiday?'holiday':siteSettings.current;
 $r('ssLiveState').textContent=!ready?'확인 중…':state==='holiday'?'상담 휴무 중':state==='busy'?'다른 분과 상담 중':state==='closed'?'오늘 상담 종료':'바로 상담 가능';
 const bookingStatus=!ready?'확인 중…':live?'예약 접수 중':'예약 잠시 불가';
 $r('ssBookingBadge').textContent=bookingStatus;
 const setTone=(id,tone)=>{$r(id).dataset.tone=tone};
 setTone('ssLetterIntake',!ready?'neutral':letter?'green':'red');
 setTone('ssLetterAnswerBadge',!ready?'neutral':holiday?'red':koreaHour()>=10&&koreaHour()<22?'green':'yellow');
 setTone('ssLiveState',!ready?'neutral':state==='holiday'?'red':state==='available'?'green':'yellow');
 setTone('ssBookingBadge',!ready?'neutral':live?'green':'red');
 hs.dataset.tone=holiday?'red':'yellow';
 $r('ssAlertBtn').hidden=!ready||siteSettings.alertVisible===false;
 const screen=$r('realtimeScreen');const type=screen&&!screen.hidden?'realtime':'letter';
 const allowed=ready&&intakeAllowed(type);
 const price=$r('consultPriceStatus');price.hidden=allowed;price.textContent=!ready?'접수 상태를 확인하는 중입니다. 확인 전에는 신청할 수 없습니다.':type==='realtime'?'현재 실시간 예약을 잠시 받지 않습니다. 상품과 가격은 확인할 수 있습니다.':'현재 비실시간 질문 접수를 잠시 중단했습니다. 상품과 가격은 확인할 수 있습니다.';
 const go=$r('orderGo');if(go&&!allowed)go.disabled=true;
 syncConsultationAvailability();
 if(typeof render==='function')render();
}
function fillSettingsForm(){for(const [id,key] of [['ssNormalLive','normalLive'],['ssNormalLetter','normalLetter'],['ssCurrent','current'],['ssHolidayStart','holidayStart'],['ssHolidayEnd','holidayEnd'],['ssHolidayText','holidayText'],['ssAlertVisible','alertVisible']]){$r(id).value=String(siteSettings[key]??'')}$r('ssHolidayEnabled').checked=!!siteSettings.holidayEnabled}
setInterval(()=>{if(settingsReady&&!settingsError)renderSiteStatus()},60000);
onSnapshot(ssDoc,snap=>{siteSettings={...defaultSettings,...(snap.exists()?snap.data():{})};settingsReady=true;settingsError=false;fillSettingsForm();renderSiteStatus()},()=>{settingsReady=false;settingsError=true;renderSiteStatus()});
$r('ssSave').addEventListener('click',async()=>{if(!currentUser){$r('ssSaveMessage').textContent='관리자 로그인이 필요합니다.';return}
 const value={normalLive:$r('ssNormalLive').value==='true',normalLetter:$r('ssNormalLetter').value==='true',current:$r('ssCurrent').value,holidayEnabled:$r('ssHolidayEnabled').checked,holidayStart:$r('ssHolidayStart').value,holidayEnd:$r('ssHolidayEnd').value,holidayText:$r('ssHolidayText').value.trim()||'개인 사정으로 휴무 중',alertVisible:$r('ssAlertVisible').value==='true'};
 if(value.holidayEnabled&&(!value.holidayStart||!value.holidayEnd||value.holidayStart>value.holidayEnd)){$r('ssSaveMessage').textContent='휴무 시작일과 종료일을 확인해 주세요.';return}
 try{await setDoc(ssDoc,{...value,updatedAt:serverTimestamp()});$r('ssSaveMessage').textContent='운영 설정을 저장했습니다.'}catch(e){$r('ssSaveMessage').textContent='저장 실패: '+e.message}
});
$r('ssAlertBtn').addEventListener('click',()=>alert('상담 가능 자동 알림은 아직 준비 중입니다. 전화번호나 알림 신청 정보를 수집하지 않습니다.'));
new MutationObserver(renderSiteStatus).observe($r('realtimeScreen'),{attributes:true,attributeFilter:['hidden']});


function minutes(t){const m=/^(\d{1,2}):(\d{2})$/.exec(t||'');if(!m)return NaN;const h=Number(m[1]),min=Number(m[2]);return h<=23&&min<=59?h*60+min:NaN}
function selectedInterval(){const start=minutes(timeInput.value.trim());const selected=document.querySelector('.realtime-duration-button.chosen');const duration=selected?.dataset.durationSelect==='1시간'?60:10;return {date:dateInput.value,start,end:start+duration,duration}}
function overlap(date,start,end){return blocks.some(b=>b.date===date&&start<b.endMinute&&end>b.startMinute)}
function isFree(){const x=selectedInterval();return intakeAllowed('realtime')&&!holidayDateBlocked(x.date)&&loaded&&!liveError&&!!x.date&&Number.isFinite(x.start)&&x.start<1440&&x.end<=1440&&!overlap(x.date,x.start,x.end)}
function render(){
 const holiday=holidayDateBlocked(dateInput.value);
 // 휴무일에는 고객의 시작 시간 입력 자체를 차단하고 기존 입력도 초기화합니다.
 if(holiday&&timeInput.value){timeInput.value='';timeInput.dispatchEvent(new Event('input',{bubbles:true}));}
 timeInput.disabled=holiday;
 timeInput.setAttribute('aria-disabled',String(holiday));
 if(holiday){timeInput.placeholder='휴무일에는 시간 선택 불가';}
 else{timeInput.placeholder='예: 23:36';}
 const x=selectedInterval();let message,state;
if(!intakeAllowed('realtime')){message='현재 실시간 예약을 받지 않습니다.';state='blocked'}
else if(holidayDateBlocked(x.date)){message='휴무 종료 이후 날짜를 선택해 주세요.';state='blocked'}
else if(liveError){message='예약 정보를 확인할 수 없어 신청을 잠시 제한합니다. 관리자에게 문의해 주세요.';state='error'}
else if(!loaded){message='예약 정보를 확인하는 중입니다.';state='loading'}
else if(!x.date||!Number.isFinite(x.start)){message='날짜와 시작 시간을 입력하면 예약 가능 여부를 확인합니다.';state='idle'}
else if(x.end>1440){message='자정을 넘는 상담은 별도 문의해 주세요.';state='blocked'}
else if(overlap(x.date,x.start,x.end)){message='선택한 시간에 이미 예약이 있습니다.\n다른 시간을 선택해 주세요.';state='blocked'}
else{message='예약 가능한 날짜와 시간대입니다.';state='free'}
indicator.textContent=message;indicator.dataset.state=state;
// 예약 가능 여부와 상담 시간 버튼의 활성 상태를 함께 갱신합니다.
// 상담 길이마다 예약 중복 여부를 따로 계산합니다.
const validStart=Number.isFinite(x.start)&&x.start>=0&&x.start<1440;
document.querySelectorAll('.realtime-duration-button[data-duration-select]').forEach(btn=>{
 const duration=btn.dataset.durationSelect==='1시간'?60:10;
 const timeAllowed=duration===60||(typeof tenMinuteAvailable==='function'&&tenMinuteAvailable(bandForDateTime(),timeInput.value.trim()));
 const canChoose=intakeAllowed('realtime')&&!holidayDateBlocked(x.date)&&loaded&&!liveError&&!!x.date&&validStart&&x.start+duration<=1440&&timeAllowed&&!overlap(x.date,x.start,x.start+duration);
 btn.disabled=!canChoose;
 if(!canChoose){btn.classList.remove('chosen');btn.setAttribute('aria-pressed','false');}
});
const realtimeSelected=document.querySelector('.realtime-duration-button.chosen');
const go=$r('orderGo');if(go&&realtimeSelected&&state!=='free')go.disabled=true;
requestAnimationFrame(syncConsultProgress);
renderAdminList();}
function renderAdminList(){const list=$r('raList');if(!list)return;list.replaceChildren();if(!currentUser)return;
blocks.slice().sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)).forEach(b=>{const li=document.createElement('li'),label=document.createElement('span'),del=document.createElement('button');label.textContent=`${b.date} ${b.start}–${b.end}`;del.textContent='삭제';del.type='button';del.addEventListener('click',async()=>{if(!confirm('이 예약 시간을 삭제할까요?'))return;try{await deleteDoc(doc(db,'blockedReservations',b.id));$r('raStatus').textContent='삭제했습니다.'}catch(e){$r('raStatus').textContent='삭제 실패: '+e.message}});li.append(label,del);list.append(li)})}
window.tarotConsultIntakeAllowed=(type)=>intakeAllowed(type);
function syncConsultationAvailability(){
 const realtimeAllowed=intakeAllowed('realtime'),letterAllowed=intakeAllowed('letter');
 document.querySelectorAll('[data-consult-mode]').forEach(el=>{
  const type=el.getAttribute('data-consult-mode');
  el.setAttribute('aria-disabled',String(!(type==='realtime'?realtimeAllowed:letterAllowed)));
 });
 const price=document.getElementById('consultPriceStatus');
 if(price){
  const rt=document.getElementById('realtimeScreen');
  const lt=document.getElementById('letterScreen');
  const type=rt&&!rt.hidden?'realtime':lt&&!lt.hidden?'letter':null;
  const allowed=type===null?true:intakeAllowed(type);
  price.hidden=allowed;
  if(!allowed)price.textContent=type==='realtime'?'현재 실시간 예약을 잠시 받지 않습니다.':'현재 비실시간 질문 접수를 잠시 중단했습니다.';
 }
 const go=document.getElementById('orderGo');
 if(go){
  const rt=document.getElementById('realtimeScreen');
  const lt=document.getElementById('letterScreen');
  const type=rt&&!rt.hidden?'realtime':lt&&!lt.hidden?'letter':null;
  if(type&&!intakeAllowed(type)){go.disabled=true;go.setAttribute('aria-disabled','true')}
 }
}
document.querySelectorAll('[data-consult-mode]').forEach(el=>el.addEventListener('click',e=>{
 const type=el.getAttribute('data-consult-mode');
 if(!intakeAllowed(type)){
  e.preventDefault();e.stopImmediatePropagation();
  alert(type==='realtime'?'현재 실시간 예약을 잠시 받지 않습니다.':'현재 비실시간 질문 접수를 잠시 중단했습니다.');
 }
},true));
document.addEventListener('click',e=>{
 const target=e.target.closest('#orderGo,[data-duration-select]');
 if(!target)return;
 const rt=document.getElementById('realtimeScreen'),lt=document.getElementById('letterScreen');
 const type=rt&&!rt.hidden?'realtime':lt&&!lt.hidden?'letter':null;
 if(type&&!intakeAllowed(type)){
  e.preventDefault();e.stopImmediatePropagation();
  alert(type==='realtime'?'현재 실시간 예약을 잠시 받지 않습니다.':'현재 비실시간 질문 접수를 잠시 중단했습니다.');
 }
},true);

window.tarotReservationCheck=()=>isFree();
// 기존 상담 선택 및 복사 버튼에 접근하기 전에 예약 차단을 다시 확인합니다.
document.querySelectorAll('[data-duration-select]').forEach(btn=>btn.addEventListener('click',e=>{const start=minutes(timeInput.value.trim()),end=start+(btn.dataset.durationSelect==='1시간'?60:10);if(!intakeAllowed('realtime')||(holidayDateBlocked(dateInput.value))||!loaded||liveError||!dateInput.value||!Number.isFinite(start)||end>1440||overlap(dateInput.value,start,end)){e.preventDefault();e.stopImmediatePropagation();render();alert('예약 정보를 확인할 수 없거나 선택한 시간에 예약이 있습니다. 다른 시간을 선택해 주세요.')}},true));
$r('orderGo').addEventListener('click',e=>{if(!intakeAllowed($r('realtimeScreen').hidden?'letter':'realtime')){e.preventDefault();e.stopImmediatePropagation();alert('현재 해당 상담의 신청을 받지 않습니다.');return}if(!$r('realtimeScreen').hidden&&!isFree()){e.preventDefault();e.stopImmediatePropagation();render();alert('예약된 시간이거나 예약 가능 여부를 확인할 수 없습니다.');}},true);
[dateInput,timeInput].forEach(el=>['change','input'].forEach(ev=>el.addEventListener(ev,()=>{const current=document.querySelector('.realtime-duration-button.chosen');if(current){current.classList.remove('chosen');current.setAttribute('aria-pressed','false');}render()})));
document.querySelectorAll('[data-duration-select]').forEach(el=>el.addEventListener('click',()=>queueMicrotask(render)));
onSnapshot(reservations,snap=>{blocks=snap.docs.map(d=>({id:d.id,...d.data()})).filter(b=>typeof b.date==='string'&&Number.isFinite(b.startMinute)&&Number.isFinite(b.endMinute));loaded=true;liveError=false;render()},err=>{liveError=true;loaded=false;render();$r('raStatus').textContent='Firestore 연결 오류: '+err.message});
onAuthStateChanged(auth,user=>{currentUser=user;document.documentElement.classList.toggle('ibs-admin-authenticated',!!user);$r('raLogin').hidden=!!user;$r('raManage').hidden=!user;$r('raUser').textContent=user?'로그인: '+user.email:'';renderAdminList()});
$r('raSignIn').addEventListener('click',async()=>{try{await signInWithEmailAndPassword(auth,$r('raEmail').value.trim(),$r('raPassword').value);$r('raPassword').value='';$r('raStatus').textContent='로그인했습니다.'}catch(e){$r('raStatus').textContent='로그인 실패: '+e.message}});
$r('raSignOut').addEventListener('click',()=>signOut(auth));
$r('raAdd').addEventListener('click',async()=>{const date=$r('raDate').value,start=$r('raStart').value.trim(),end=$r('raEnd').value.trim(),sm=minutes(start),em=minutes(end);if(!date||!Number.isFinite(sm)||!Number.isFinite(em)||sm>=em){$r('raStatus').textContent='날짜와 시작·종료 시간을 올바르게 입력해 주세요.';return}if(overlap(date,sm,em)){$r('raStatus').textContent='기존 예약과 겹칩니다.';return}try{await addDoc(reservations,{date,start,end,startMinute:sm,endMinute:em,createdAt:serverTimestamp()});$r('raStatus').textContent='예약 시간을 등록했습니다.'}catch(e){$r('raStatus').textContent='등록 실패: '+e.message}});
