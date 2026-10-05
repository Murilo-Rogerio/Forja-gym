function chartCtx(cv){
  const w = cv.clientWidth || (cv.parentElement && cv.parentElement.clientWidth) || 300;
  const h = parseInt(cv.getAttribute('data-h') || '180', 10);
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr); cv.style.height = h+'px';
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  return { ctx:ctx, w:w, h:h };
}
function animToken(cv){ cv._tok = (cv._tok||0)+1; return cv._tok; }
function drawBars(cv, items){
  const c = chartCtx(cv); if(!c) return;
  const ctx = c.ctx, w = c.w, h = c.h;
  const max = Math.max.apply(null, [1].concat(items.map(function(i){ return i.v; })));
  const padB = 22, padT = 12, gap = (w-10)/items.length, bw = Math.min(34, gap*.55);
  const tok = animToken(cv), t0 = performance.now(), dur = 700;
  const frame = function(now){
    if(cv._tok !== tok) return;
    const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<=3;i++){
      const y = padT + (h-padB-padT)*(1-i/3);
      ctx.strokeStyle='rgba(148,163,184,.1)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
      ctx.fillStyle='#5a6a83'; ctx.font='10px Barlow, sans-serif'; ctx.textAlign='left';
      ctx.fillText(fmtKg(max*i/3), 2, Math.max(10, y-4));
    }
    items.forEach(function(it, i){
      const bh = Math.max(2,(h-padB-padT)*(it.v/max)*e);
      const x = 5 + gap*i + (gap-bw)/2, y = h-padB-bh, r = Math.min(6, bw/2);
      ctx.fillStyle = it.hot ? '#38bdf8' : 'rgba(56,189,248,.25)';
      ctx.beginPath(); ctx.moveTo(x,h-padB); ctx.lineTo(x,y+r);
      ctx.arcTo(x,y,x+r,y,r); ctx.arcTo(x+bw,y,x+bw,y+r,r);
      ctx.lineTo(x+bw,h-padB); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#8494ab'; ctx.font='600 10px Barlow Condensed, sans-serif'; ctx.textAlign='center';
      ctx.fillText(it.l, x+bw/2, h-7);
    });
    if(p<1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function drawLineChart(cv, pts){
  const c = chartCtx(cv); if(!c) return;
  const ctx = c.ctx, w = c.w, h = c.h;
  const padB = 24, padT = 14, padL = 6, padR = 6;
  const vals = pts.map(function(p){ return p.v; });
  let min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  if(min === max){ min -= 5; max += 5; }
  const span = max-min; min -= span*.12; max += span*.12;
  const X = function(i){ return padL + (pts.length===1 ? (w-padL-padR)/2 : i*(w-padL-padR)/(pts.length-1)); };
  const Y = function(v){ return padT + (h-padB-padT)*(1-(v-min)/(max-min)); };
  const tok = animToken(cv), t0 = performance.now(), dur = 800;
  const frame = function(now){
    if(cv._tok !== tok) return;
    const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(148,163,184,.1)'; ctx.lineWidth=1;
    for(let i=0;i<=3;i++){
      const y = padT + (h-padB-padT)*i/3;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
      ctx.fillStyle='#5a6a83'; ctx.font='10px Barlow, sans-serif'; ctx.textAlign='left';
      ctx.fillText(fmtN(max-(max-min)*i/3)+'kg', 2, Math.max(10, y-4));
    }
    const vis = Math.min(Math.max(2, Math.ceil(pts.length*e)), pts.length);
    ctx.beginPath();
    for(let i=0;i<vis;i++){ if(i) ctx.lineTo(X(i),Y(pts[i].v)); else ctx.moveTo(X(i),Y(pts[i].v)); }
    ctx.strokeStyle='#38bdf8'; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
    ctx.lineTo(X(vis-1), h-padB); ctx.lineTo(X(0), h-padB); ctx.closePath();
    ctx.fillStyle='rgba(56,189,248,.08)'; ctx.fill();
    pts.forEach(function(pt,i){
      if(i<vis){
        ctx.beginPath(); ctx.arc(X(i),Y(pt.v),4,0,7);
        ctx.fillStyle = i===pts.length-1 ? '#38bdf8' : '#0f172a';
        ctx.fill(); ctx.strokeStyle='#38bdf8'; ctx.lineWidth=2; ctx.stroke();
      }
    });
    const step = Math.max(1, Math.ceil(pts.length/6));
    ctx.fillStyle='#8494ab'; ctx.font='600 10px Barlow Condensed, sans-serif'; ctx.textAlign='center';
    pts.forEach(function(pt,i){ if(i%step===0 || i===pts.length-1) ctx.fillText(pt.l, X(i), h-8); });
    if(p<1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function drawSpark(cv, vals){
  const c = chartCtx(cv); if(!c) return;
  const ctx = c.ctx, w = c.w, h = c.h;
  const max = Math.max.apply(null, [1].concat(vals));
  const X = function(i){ return 2 + i*(w-4)/(vals.length-1); };
  const Y = function(v){ return h-6 - (h-16)*(v/max); };
  const tok = animToken(cv), t0 = performance.now(), dur = 700;
  const frame = function(now){
    if(cv._tok !== tok) return;
    const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
    ctx.clearRect(0,0,w,h);
    const vis = Math.max(2, Math.ceil(vals.length*e));
    ctx.beginPath(); ctx.moveTo(0, h-2);
    for(let i=0;i<Math.min(vis,vals.length);i++) ctx.lineTo(X(i), Y(vals[i]));
    ctx.lineTo(X(Math.min(vis,vals.length)-1), h-2); ctx.closePath();
    ctx.fillStyle='rgba(56,189,248,.1)'; ctx.fill();
    ctx.beginPath();
    for(let i=0;i<Math.min(vis,vals.length);i++){ if(i) ctx.lineTo(X(i),Y(vals[i])); else ctx.moveTo(X(i),Y(vals[i])); }
    ctx.strokeStyle='#38bdf8'; ctx.lineWidth=2; ctx.stroke();
    if(p<1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function drawDonut(cv, segs, top, bot){
  const c = chartCtx(cv); if(!c) return;
  const ctx = c.ctx, w = c.w, h = c.h;
  const cx = w/2, cy = h/2, R = Math.min(w,h)/2 - 14, LW = 24;
  const total = segs.reduce(function(s,x){ return s+x.v; },0) || 1;
  const cols = { p:'#38bdf8', c:'#60a5fa', f:'#fbbf24' };
  const tok = animToken(cv), t0 = performance.now(), dur = 900;
  const frame = function(now){
    if(cv._tok !== tok) return;
    const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth = LW;
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(148,163,184,.12)'; ctx.stroke();
    let a = -Math.PI/2; const gap = .06;
    for(const s of segs){
      const sweep = (s.v/total)*Math.PI*2*e;
      if(sweep > .01){
        ctx.beginPath(); ctx.arc(cx,cy,R,a+gap/2,a+sweep-gap/2);
        ctx.strokeStyle = cols[s.k]; ctx.stroke();
      }
      a += (s.v/total)*Math.PI*2;
    }
    ctx.fillStyle='#e8eef8'; ctx.textAlign='center';
    ctx.font='700 34px Barlow Condensed, sans-serif'; ctx.fillText(top, cx, cy+2);
    ctx.fillStyle='#8494ab'; ctx.font='600 12px Barlow Condensed, sans-serif'; ctx.fillText(bot, cx, cy+22);
    if(p<1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function animateNumber(el, to, dur, fmt){
  if(!el) return;
  const t0 = performance.now();
  const f = function(now){
    const p = Math.min(1,(now-t0)/(dur||900)), e = 1-Math.pow(1-p,3);
    el.textContent = fmt(to*e);
    if(p<1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}