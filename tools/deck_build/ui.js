/* boshqaruv: sayt havolasi, to'liq ekran mavjudligi, telefon yo'riqnomasi */
(function(){
  var home=document.getElementById('home'),fsb=document.getElementById('fs'),de=document.documentElement;
  if(EMBED||!/^https?:$/.test(location.protocol))home.style.display='none';
  if(!(de.requestFullscreen||de.webkitRequestFullscreen))fsb.style.display='none';
  /* telefon yo'riqnomasi faqat taqdimot boshidan ochilganda: muqovada yuqorida rasm turadi, matn yopilmaydi */
  var st=parseInt((location.hash||'').replace('#',''),10);
  if(M){if(!isNaN(st)&&st>1)hint.style.display='none';else hint.textContent='Bosing yoki suring: keyingi slayd';}
})();
