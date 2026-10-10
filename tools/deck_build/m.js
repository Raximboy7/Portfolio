/* ===== Telefon / portret rejimi: slaydlar bir ustunda qayta joylanadi ===== */
var root=document.documentElement,QS=new URLSearchParams(location.search),FM=QS.get('m'),EMBED=QS.get('embed')==='1';
var M=false,MW=720,MH=1280,K=1,PT=48,PB=126,INS=[];
if(EMBED)root.classList.add('embed');
function wantM(){if(FM==='1')return true;if(FM==='0')return false;var w=innerWidth,h=innerHeight;return EMBED?w<h*1.1:(w<h*1.1||w<=560);}
function dpx(st,k){var m=new RegExp('(?:^|;)\\s*'+k+'\\s*:\\s*(-?[\\d.]+)px').exec(st||'');return m?+m[1]:null;}
function dbox(el){var st=el.getAttribute('style')||'';return {l:dpx(st,'left'),t:dpx(st,'top'),w:dpx(st,'width'),h:dpx(st,'height'),b:dpx(st,'bottom')};}
function isBox(d){return d&&d.l!==null&&d.t!==null&&d.w&&d.h;}
function inside(a,b,tol){return a.l>=b.l-tol&&a.t>=b.t-tol&&a.l+a.w<=b.l+b.w+tol&&a.t+a.h<=b.t+b.h+tol;}
function overlap(a,b){return a.l<b.l+b.w&&b.l<a.l+a.w&&a.t<b.t+b.h&&b.t<a.t+a.h;}
function setv(el,o){for(var k in o)el.style.setProperty(k,o[k]);}
function mo(el,n){if(el)el.style.setProperty('--mo',n);}
function moOf(el){return el?parseFloat(el.style.getPropertyValue('--mo'))||500:500;}
function insetM(e,host){
  var d=e._d,h=host._d,rl=d.l-h.l-1,rt=d.t-h.t-1,rr=h.l+h.w-d.l-d.w-1,right=rl+d.w/2>h.w/2&&rr<rl;
  setv(e,{'--il':right?'auto':rl+'px','--ir':right?rr+'px':'auto','--it':rt+'px'});
  e._home=document.createComment('m');e.parentNode.insertBefore(e._home,e);e._host=host;e.classList.add('m-inset');INS.push(e);
}
function moveIns(on){INS.forEach(function(e){if(on){if(e.parentNode!==e._host)e._host.appendChild(e);}else if(e._home.parentNode&&e.parentNode===e._host){e._home.parentNode.insertBefore(e,e._home);}});}
function helper(s){return {
  t:function(str){return s._txt.filter(function(e){return e.textContent.indexOf(str)>-1;})[0];},
  head:s._txt.filter(function(e){return e.matches('h1,h2')||e.querySelector('h1,h2');})[0],
  mv:(s._mvs||[])[0]
};}
function prepM(){
  S.forEach(function(s){
    var vis=[],txt=[],foot=[];
    [].slice.call(s.children).forEach(function(el){
      var d=dbox(el);el._d=d;
      if(el.classList.contains('pc')){el.classList.add('m-hide');return;}
      if(el.matches('iframe.emb,.ph-pan')){if(isBox(d))vis.push(el);return;}
      if(d.t===null&&d.b!==null){foot.push(el);return;}
      txt.push(el);
    });
    foot.forEach(function(el){if(/MANBA|FOTOSURAT/i.test(el.textContent)){el.classList.add('m-src');mo(el,1000);}else el.classList.add('m-hide');});
    txt.sort(function(a,b){return ((a._d.t||0)-(b._d.t||0))||((a._d.l||0)-(b._d.l||0));});
    txt.forEach(function(el,i){mo(el,100+i*10);if(el.matches('[data-b="pop"]'))el.classList.add('m-half');});
    var groups=[];
    vis.forEach(function(el){var g=null;for(var i=0;i<groups.length&&!g;i++){if(groups[i].some(function(o){return overlap(o._d,el._d);}))g=groups[i];}if(g)g.push(el);else groups.push([el]);});
    s._mvs=[];
    groups.forEach(function(g){
      var gx=Math.min.apply(null,g.map(function(e){return e._d.l;})),gy=Math.min.apply(null,g.map(function(e){return e._d.t;})),
          gr=Math.max.apply(null,g.map(function(e){return e._d.l+e._d.w;})),gb=Math.max.apply(null,g.map(function(e){return e._d.t+e._d.h;})),
          box={l:gx,t:gy,w:gr-gx,h:gb-gy};
      var cov=txt.filter(function(t){return isBox(t._d)&&inside(t._d,box,2);});
      if(cov.length>=2){g.forEach(function(e){e.classList.add('m-hide');});return;}
      var host=txt.filter(function(t){return isBox(t._d)&&inside(box,t._d,2);})[0];
      if(host){g.forEach(function(e){insetM(e,host);});return;}
      var mv=document.createElement('div'),mi=document.createElement('div');mv.className='mv';mi.className='mvi';mv.appendChild(mi);
      s.insertBefore(mv,g[0]);
      g.forEach(function(e){var d=e._d;setv(e,{'--il':(d.l-gx)+'px','--it':(d.t-gy)+'px','--ir':(gr-d.l-d.w)+'px','--ib':(gb-d.t-d.h)+'px'});mi.appendChild(e);});
      mv._d=box;mv._o={};mo(mv,900);s._mvs.push(mv);
      txt.forEach(function(t){var td=t._d;if(td.t!==null&&td.l!==null&&td.t>=gb-4&&td.t<=gb+90&&td.l>=gx-8&&td.l<=gr){t.classList.add('m-cap');mo(t,901);}});
    });
    s._txt=txt;
    s.addEventListener('scroll',function(){moreUpd(s);},{passive:true});
    [].forEach.call(s.querySelectorAll('[style*="width:"]'),function(el){if(el.parentNode===s||el.tagName==='IFRAME'||el.closest('.mv'))return;var w=dpx(el.getAttribute('style'),'width');if(w&&w>=480)el.classList.add('m-fw');});
    var f=MCF[s.id];if(f)f(s,helper(s));
  });
}
function flowB(s){var mb=0;[].forEach.call(s.children,function(el){var c=getComputedStyle(el);if(c.display==='none'||c.position==='absolute'||c.position==='fixed')return;var b=el.offsetTop+el.offsetHeight;if(b>mb)mb=b;});return mb;}
function setMI(mv,w,h,sc,x){var i=mv.firstChild;i.style.width=w+'px';i.style.height=h+'px';i.style.transform='translate('+x+'px,0) scale('+sc+')';}
function lay1(s){
  var mvs=s._mvs||[],cs=getComputedStyle(s),pt=parseFloat(cs.paddingTop)||0,pb=parseFloat(cs.paddingBottom)||0;
  s.classList.remove('m-c','m-over');s.scrollTop=0;
  mvs.forEach(function(mv){mv.style.setProperty('height','0px','important');});
  var avail=s.clientHeight-pt-pb,used=flowB(s)-pt,each=mvs.length?(avail-used)/mvs.length:0,tot=used;
  mvs.forEach(function(mv){
    var o=mv._o,aw=mv.clientWidth,vh,sc,lw,lh;
    if(o.fit==='resize'){
      sc=o.sc||1;lw=aw/sc;var nat=lw*(o.ar||mv._d.h/mv._d.w),mn=Math.min(nat,o.min||300),mx=o.max||nat*1.25;
      lh=Math.max(mn,Math.min(each/sc,mx));vh=lh*sc;setMI(mv,lw,lh,sc,0);
    }else{
      lw=o.lw||mv._d.w;lh=o.lh||mv._d.h;
      var sw=Math.min(aw/lw,o.smax||1);sc=Math.min(sw,Math.max(each/lh,sw*(o.vmin||.55)));
      vh=lh*sc;setMI(mv,lw,lh,sc,(aw-lw*sc)/2);
    }
    mv.style.setProperty('height',vh+'px','important');tot+=vh;
  });
  return {tot:tot,avail:avail};
}
/* Slayd sig'masa: mantiqiy o'lchamni f marta kattalashtirib, scale(1/f) bilan ekranga qaytaramiz
   (matn ko'pi bilan 1/FITMAX ga kichrayadi). Shunda past ekranlarda ham scroll kerak bo'lmaydi. */
function fitReset(s){['--mw','--mh','--pt','--pb','--f'].forEach(function(k){s.style.removeProperty(k);});s.style.removeProperty('scale');s._f=1;}
function layM(s){
  if(!M||!s)return;
  fitReset(s);
  var r=lay1(s),f=1,FITMAX=EMBED?1.7:1.25;
  for(var i=0;i<4&&r.tot>r.avail+6&&f<FITMAX;i++){
    f=Math.min(FITMAX,f*Math.max(1.02,(r.tot+6)/r.avail));
    setv(s,{'--mw':MW*f+'px','--mh':MH*f+'px','--pt':PT*f+'px','--pb':PB*f+'px','--f':f});
    s.style.scale=String(1/f);
    r=lay1(s);
  }
  s._f=f;
  s.classList.add(r.tot<=r.avail+6?'m-c':'m-over');
  moreUpd(s);
}
var MORE=document.createElement('div');MORE.id='mmore';MORE.setAttribute('aria-hidden','true');MORE.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';document.body.appendChild(MORE);
function moreUpd(s){MORE.classList.toggle('on',!!(M&&s&&s===S[cur]&&s.classList.contains('m-over')&&s.scrollTop+s.clientHeight<s.scrollHeight-24));}
function applyM(on){
  M=on;root.classList.toggle('m',on);moveIns(on);
  if(!on)S.forEach(function(s){fitReset(s);s.classList.remove('m-c','m-over');(s._mvs||[]).forEach(function(mv){mv.style.removeProperty('height');var i=mv.firstChild;i.style.width=i.style.height=i.style.transform='';});});
}
/*MCF*/
prepM();
if(document.fonts){document.fonts.ready.then(function(){if(M&&cur>=0)layM(S[cur]);});document.fonts.addEventListener&&document.fonts.addEventListener('loadingdone',function(){if(M&&cur>=0)layM(S[cur]);});}
