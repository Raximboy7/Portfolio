/* hero ichidagi jonli ko'rinish: ?embed=1&autoplay=7 */
if(EMBED){
  var APq=QS.get('autoplay'),AP=APq==='0'?0:Math.max(3,+(APq||7))*1000,apT=null,pP=false,pH=document.hidden,paused=false;
  var apNext=function(){clearTimeout(apT);if(paused||!AP)return;apT=setTimeout(function(){if(cur>=N-1)show(0,1);else next();apNext();},AP);};
  var sync=function(){var p=pP||pH;if(p===paused)return;paused=p;root.classList.toggle('paused',p);if(cur>=0)loadEmb(S[cur],!p);if(p)clearTimeout(apT);else apNext();};
  window.addEventListener('message',function(e){if(e.origin!==location.origin&&!(location.protocol==='file:'&&e.origin==='null'))return;var d=e.data||{};if(d.deck==='pause'){pP=true;sync();}else if(d.deck==='play'){pP=false;sync();}});
  document.addEventListener('visibilitychange',function(){pH=document.hidden;sync();});
  apNext();
  /* bosh sahifaga: taqdimot tayyor (tashqi rasmlar yuklanishini kutmasdan ko'rsatish uchun) */
  try{if(window.parent!==window)parent.postMessage({deck:'ready'},location.protocol==='file:'?'*':location.origin);}catch(err){}
}
