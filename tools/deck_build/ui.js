/* boshqaruv: sayt havolasi, to'liq ekran mavjudligi, telefon yo'riqnomasi */
(function(){
  var home=document.getElementById('home'),fsb=document.getElementById('fs'),de=document.documentElement;
  if(EMBED||!/^https?:$/.test(location.protocol))home.style.display='none';
  if(!(de.requestFullscreen||de.webkitRequestFullscreen))fsb.style.display='none';
  if(M)hint.textContent='Bosing yoki suring: keyingi slayd';
})();
