const Timer = {
  total:0, left:0, t0:0, int:0, running:false, built:false,
  start:function(secs){ this.stop(); this.total = secs; this.left = secs; this.running = true; this.t0 = Date.now();
    this.int = setInterval(function(){ Timer.tick(); }, 200); this.openFull(); },
  tick:function(){ this.left = this.total - (Date.now()-this.t0)/1000;
    if(this.left <= 0){ this.finish(); return; } this.paint(); },
  add:function(s){ if(!this.running) return; this.total += s; this.tick(); },
  skip:function(){ if(!this.running) return; this.stop(); this.closeFull(); toast('Descanso encerrado','ok','check'); },
  finish:function(){ this.stop(); this.closeFull(); chime(); buzz([140,70,140]);
    if(typeof speakCoach === 'function') speakCoach('Descanso finalizado! Hora da próxima série.');
    toast('Descanso concluído — próxima série!','ai','clock'); },
  stop:function(){ clearInterval(this.int); this.int = 0; this.running = false; document.getElementById('restpill').classList.remove('on'); },
  openFull:function(){ document.getElementById('restpill').classList.remove('on'); this.buildFull(); document.getElementById('restfull').classList.add('on'); this.paint(); },
  closeFull:function(){ document.getElementById('restfull').classList.remove('on'); },
  buildFull:function(){
    if(this.built) return; this.built = true;
    const presets = [60,90,120].map(function(s){
      return '<button class="btn btn-ghost ripple num" data-act="rest-preset" data-arg="'+s+'">'+s+'s</button>';
    }).join('');
    document.getElementById('restfull').innerHTML = '<div class="lbl" style="letter-spacing:3px">DESCANSO</div>' +
      '<div class="tnum num mt14" id="rf-num">--</div>' +
      '<div class="tbar"><i id="rf-bar" style="width:100%"></i></div>' +
      '<div class="stack" style="width:100%;max-width:320px"><div class="split3">'+presets+'</div>' +
      '<div class="split2"><button class="btn btn-ghost ripple" data-act="rest-preset" data-arg="180">180s</button>' +
      '<button class="btn btn-pri ripple" data-act="rest-add" data-arg="30">+30s</button></div>' +
      '<div class="split2 mt8"><button class="btn btn-ghost ripple" data-act="rest-skip">'+icon('skip')+' Encerrar</button>' +
      '<button class="btn btn-ghost ripple" data-act="rest-close">'+icon('down')+' Minimizar</button></div></div>';
  },
  showPill:function(){
    const p = document.getElementById('restpill');
    if(!document.getElementById('rp-num')){
      p.innerHTML = icon('clock') + '<div style="flex:1"><div class="lbl" style="letter-spacing:1.5px">Descanso</div>' +
        '<div class="tbar"><i id="rp-bar" style="width:100%"></i></div></div>' +
        '<div class="tnum num" id="rp-num">--</div>';
    }
    p.classList.add('on'); this.paint();
  },
  paint:function(){
    const pct = this.total > 0 ? Math.max(0, this.left/this.total) : 0;
    const w = (pct*100).toFixed(1) + '%', low = this.left <= 5;
    const n = document.getElementById('rf-num'); if(n){ n.textContent = fmtTime(this.left); n.classList.toggle('low', low); }
    const b = document.getElementById('rf-bar'); if(b) b.style.width = w;
    const pn = document.getElementById('rp-num'); if(pn){ pn.textContent = fmtTime(this.left); pn.classList.toggle('low', low); }
    const pb = document.getElementById('rp-bar'); if(pb) pb.style.width = w;
  }
};
document.getElementById('restpill').addEventListener('click', function(){ Timer.openFull(); });