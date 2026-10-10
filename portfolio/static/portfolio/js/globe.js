/* =============================================================================
   globe.js: bosh sahifadagi aylanayotgan raqamli yer shari (canvas).
   Qit'alar nuqtalari: globe-points.js (Natural Earth ochiq ma'lumotlari).
   Ko'rinmaganda, tab yashirin bo'lganda va "kamroq harakat" yoqilganda to'xtaydi.
   ========================================================================== */
(() => {
  'use strict';
  const canvas = document.getElementById('earth');
  if (!canvas || !window.GLOBE_POINTS) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const T = (k, d) => (window.siteT ? window.siteT(k) : d);
  const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = document.querySelector('.globe-pause');
  const points = window.GLOBE_POINTS.map(([lon, lat, land], i) => ({lon, y: Math.sin(lat), c: Math.cos(lat), land, digit: String((i * 7 + 3) % 10)}));
  let size = 0, angle = 0.8, mode = 'dots', paused = motion.matches;
  let frame = 0, last = 0, visible = true, tilt = 0.13, targetTilt = 0.13, lean = 0, targetLean = 0;
  let light = isLight();
  function controls() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? T('globe.play', 'Aylanishni boshlash') : T('globe.pause', 'Aylanishni to\'xtatish'));
    pause.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  }
  function resize() {
    size = canvas.clientWidth;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function project(lon, y, c) {
    const a = lon - angle, x = c * Math.sin(a), z = c * Math.cos(a);
    const yt = y * Math.cos(tilt) - z * Math.sin(tilt);
    const zt = y * Math.sin(tilt) + z * Math.cos(tilt);
    return [x * Math.cos(lean) - yt * Math.sin(lean), -(x * Math.sin(lean) + yt * Math.cos(lean)), zt];
  }
  function draw() {
    if (!size) return;
    ctx.clearRect(0, 0, size, size);
    const center = size / 2, radius = size * 0.405;
    // Fine meridians and parallels remain behind the geographic point cloud.
    ctx.lineWidth = .5;
    ctx.strokeStyle = light ? 'rgba(66,92,32,.12)' : 'rgba(179,218,137,.10)';
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = lat * Math.PI / 180;
      ctx.beginPath(); let open = false;
      for (let j = 0; j <= 160; j++) {
        const [x,y,z] = project(j / 160 * Math.PI * 2, Math.sin(phi), Math.cos(phi));
        if (z < 0) { open = false; continue; }
        if (!open) ctx.moveTo(center+x*radius,center+y*radius); else ctx.lineTo(center+x*radius,center+y*radius);
        open = true;
      }
      ctx.stroke();
    }
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath(); let open = false;
      for (let j = 0; j <= 100; j++) {
        const phi = -Math.PI/2 + j/100*Math.PI;
        const [x,y,z] = project(lon*Math.PI/180,Math.sin(phi),Math.cos(phi));
        if(z<0){open=false;continue;}
        if(!open)ctx.moveTo(center+x*radius,center+y*radius);else ctx.lineTo(center+x*radius,center+y*radius);
        open=true;
      }
      ctx.stroke();
    }
    ctx.beginPath();ctx.arc(center,center,radius,0,Math.PI*2);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font = `${Math.max(7,size*.017)}px monospace`;
    for(let i=0;i<points.length;i++) {
      const p=points[i];
      if(mode==='digits' && i%2)continue;
      const [x,y,z]=project(p.lon,p.y,p.c);
      if(z<-.15)continue;
      const alpha=p.land ? (z<0?.055:.2+.78*Math.pow(z,.6)) : (z<0?.015:.035+.075*z);
      ctx.globalAlpha=alpha;
      ctx.fillStyle=light?(p.land?'#3f631e':'#647a50'):(p.land?'#c0ed83':'#8ba875');
      const px=center+x*radius,py=center+y*radius;
      if(mode==='digits' && p.land && z>0)ctx.fillText(p.digit,px,py);
      else {ctx.beginPath();ctx.arc(px,py,p.land ? (.65+.55*Math.max(z,0))*Math.max(.7,size/500) : .6,0,Math.PI*2);ctx.fill();}
    }
    ctx.globalAlpha=1;
    // Tashkent marker follows the same sphere transform as the land points.
    const lat=41.31*Math.PI/180;
    const [mx,my,mz]=project(69.24*Math.PI/180,Math.sin(lat),Math.cos(lat));
    if(mz>.25){
      const x=center+mx*radius,y=center+my*radius;
      ctx.strokeStyle=light?'#365920':'#d8ffa6';ctx.fillStyle=ctx.strokeStyle;
      ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(x+5,y-4);ctx.lineTo(x+19,y-18);ctx.lineTo(x+62,y-18);ctx.stroke();
      ctx.font='8px monospace';ctx.textAlign='left';ctx.fillText(T('globe.city','TOSHKENT'),x+21,y-25);
    }
  }
  function tick(t) {
    frame=0;
    if(paused || !visible || document.hidden)return;
    const dt=last ? Math.min((t-last)/1000,.05) : 0; last=t;
    angle += dt*.115;
    tilt+=(targetTilt-tilt)*.045;lean+=(targetLean-lean)*.045;
    draw();frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;last=0;
    if(!paused && visible && !document.hidden)frame=requestAnimationFrame(tick);
    else draw();
  }
  pause.addEventListener('click',()=>{paused=!paused;controls();sync();});
  document.querySelectorAll('[data-globe-mode]').forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.globeMode;
    document.querySelectorAll('[data-globe-mode]').forEach(b=>{const selected=b===button;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
    canvas.setAttribute('aria-label',mode==='dots'?T('globe.label_dots','Qit\'alari yashil nuqtalardan tuzilgan yer shari'):T('globe.label_digits','Qit\'alari raqamlardan tuzilgan yer shari'));draw();
  }));
  canvas.addEventListener('pointermove',e=>{if(motion.matches || e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();targetTilt=.13+(e.clientY-r.top-r.height/2)/r.height*.22;targetLean=(e.clientX-r.left-r.width/2)/r.width*.12;});
  canvas.addEventListener('pointerleave',()=>{targetTilt=.13;targetLean=0;});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(canvas);
  new MutationObserver(()=>{light=isLight();controls();draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','lang']});
  document.addEventListener('visibilitychange',sync);
  motion.addEventListener('change',()=>{paused=motion.matches;controls();sync();});
  controls();resize();sync();
})();
