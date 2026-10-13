
(function(){
  const btn=document.getElementById('ibsInstallButton');
  const help=document.getElementById('ibsInstallHelp');
  if(!btn||!help)return;
  let installPrompt=null;
  const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const inKakao=()=>/KAKAOTALK/i.test(navigator.userAgent);
  const show=(html)=>{help.innerHTML=html;help.hidden=false;};
  const url=location.href.split('#')[0];
  const copyButton='<button type="button" id="ibsCopySiteLink">사이트 주소 복사하기</button>';
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
  window.addEventListener('appinstalled',()=>{
    installPrompt=null;btn.textContent='✓ 앱이 설치되었어요';help.hidden=true;btn.disabled=true;
  });
  if(installed()){btn.textContent='✓ 앱으로 실행 중';btn.disabled=true;}
  btn.addEventListener('click',async()=>{
    if(installed())return;
    if(inKakao()){
      // Android KakaoTalk: try opening this HTTPS page directly in Chrome.
      // Some KakaoTalk versions block intent links, so keep a manual fallback.
      const intent='intent://'+location.host+location.pathname+location.search+
        '#Intent;scheme='+location.protocol.replace(':','')+
        ';package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(url)+';end';
      show('크롬으로 연결되지 않으면 카카오톡 오른쪽 위 <b>⋮</b> 메뉴에서 <b>다른 브라우저로 열기</b>를 선택해 주세요.<br>'+copyButton);
      location.href=intent;
      return;
    }
    if(installPrompt){
      const prompt=installPrompt;installPrompt=null;
      try{
        await prompt.prompt();
        const choice=await prompt.userChoice;
        if(choice&&choice.outcome==='dismissed')show('설치를 취소했어요. 필요할 때 다시 눌러주세요.');
      }catch(e){show('Chrome 메뉴 <b>⋮ → 앱 설치 / 홈 화면에 추가</b>를 선택해 주세요.');}
      return;
    }
    show('Chrome 오른쪽 위 <b>⋮</b> 메뉴에서 <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 선택해 주세요. 이미 설치된 경우에는 설치 창이 나타나지 않을 수 있어요.');
  });
  help.addEventListener('click',async e=>{
    if(!e.target.closest('#ibsCopySiteLink'))return;
    try{await navigator.clipboard.writeText(url);show('주소를 복사했어요. Chrome 주소창에 붙여넣어 주세요.');}
    catch(_){show('Chrome 주소창에 다음 주소를 입력해 주세요:<br><a href="'+url+'">'+url+'</a>');}
  });
})();
