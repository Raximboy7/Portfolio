
function fit(){
  var on=wantM();if(on!==M)applyM(on);
  if(M){
    var w=innerWidth,h=innerHeight,lo=w<600?720:960,hi=w<600?780:1040;MW=Math.max(lo,Math.min(hi,Math.round(1330*w/h)));K=w/MW;MH=Math.round(h/K);
    setv(root,{'--mw':MW+'px','--mh':MH+'px','--pt':(EMBED?40:48)+'px','--pb':Math.round((EMBED?40:68)/K)+'px'});
    stage.style.transform='scale('+K+')';
    if(cur>=0)layM(S[cur]);
  }else{var k=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform='scale('+k+')';}
}
