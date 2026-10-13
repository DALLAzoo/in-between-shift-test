
/* 관리자 진입: 사이트주소/?admin=1  (고객에게 이 주소를 공유하지 마세요) */
if(new URLSearchParams(location.search).get('admin')==='1'){
 document.documentElement.classList.add('ibs-admin-entry');
}
