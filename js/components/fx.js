let actx = null;
function ensureAudio(){ try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); }catch(e){} }
function beep(freq, dur, delay){
  if(!state || !state.settings.sound) return;
  try{
    ensureAudio(); if(!actx) return;
    const t = actx.currentTime + (delay||0);
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t); o.stop(t+dur+0.05);
  }catch(e){}
}
function chime(){ beep(880,.14,0); beep(1174.7,.22,.15); }
function buzz(p){ if(state && state.settings.vibrate && navigator.vibrate) navigator.vibrate(p); }

const FX = { parts: [], raf: 0 };
const FX_COLORS = ['#38bdf8','#7dd3fc','#2563eb','#e8eef8','#a5f3fc'];
function fxLoop(){
  const c = document.getElementById('fx'); if(!c) return;
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth*dpr; c.height = innerHeight*dpr;
  c.style.width = innerWidth+'px'; c.style.height = innerHeight+'px';
  const ctx = c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  const step = function(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    FX.parts = FX.parts.filter(function(p){ return p.life > 0 && p.y < innerHeight+40; });
    for(const p of FX.parts){
      p.vy += .28; p.vx *= .992; p.x += p.vx; p.y += p.vy;
      p.rot += p.vr; p.life--; p.flip += p.flipV;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.scale(1, Math.sin(p.flip));
      ctx.globalAlpha = Math.min(1, p.life/40); ctx.fillStyle = p.color;
      if(p.round){ ctx.beginPath(); ctx.arc(0,0,p.w/2,0,7); ctx.fill(); }
      else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    }
    if(FX.parts.length) FX.raf = requestAnimationFrame(step);
    else { FX.raf = 0; ctx.clearRect(0,0,innerWidth,innerHeight); }
  };
  if(!FX.raf) FX.raf = requestAnimationFrame(step);
}
function burst(x,y,n){
  for(let i=0;i<n;i++){
    const a = (Math.random()*.9-.45) - Math.PI/2, sp = 6 + Math.random()*8;
    FX.parts.push({ x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
      w:5+Math.random()*6, h:3+Math.random()*4, rot:Math.random()*6, vr:(Math.random()-.5)*.3,
      flip:Math.random()*6, flipV:.18+Math.random()*.2,
      color:FX_COLORS[(Math.random()*FX_COLORS.length)|0],
      life:70+Math.random()*50, round:Math.random()<.22 });
  }
  fxLoop();
}
function shockwave(x,y){
  const el = document.createElement('div');
  el.className = 'shock';
  el.style.left = (x-10)+'px'; el.style.top = (y-10)+'px';
  document.body.appendChild(el);
  setTimeout(function(){ el.remove(); }, 750);
}
function celebrate(){
  burst(innerWidth*.3, innerHeight*.35, 60);
  setTimeout(function(){ burst(innerWidth*.7, innerHeight*.3, 60); }, 180);
  setTimeout(function(){ burst(innerWidth*.5, innerHeight*.5, 80); }, 360);
  chime(); buzz([60,50,60,50,120]);
}