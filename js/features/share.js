async function stravaPost(log){
  const tok = state.settings.strava;
  if(!tok || !log) return false;
  const body = {
    name: 'FORJA — ' + log.name,
    type: 'WeightTraining',
    start_date_local: new Date(log.date - log.duration).toISOString(),
    elapsed_time: Math.max(60, Math.round(log.duration/1000)),
    description: 'Volume total: ' + fmtKg(log.volume) + ' · ' + log.setsDone + ' séries · ' + log.totalReps + ' reps' +
      (log.prCount ? ' · ' + log.prCount + ' PRs' : '') + ' · via FORJA'
  };
  try{
    const r = await fetch('https://www.strava.com/api/v3/activities?access_token=' + encodeURIComponent(tok),
      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if(r.ok) return true;
  }catch(e){}
  return false;
}
async function buildShareCard(log){
  try{
    await document.fonts.ready;
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1350;
    const x = c.getContext('2d');
    x.fillStyle = '#0a0f1d'; x.fillRect(0,0,1080,1350);
    x.strokeStyle = 'rgba(56,189,248,.06)'; x.lineWidth = 2;
    for(let i=1;i<10;i++){ x.beginPath(); x.moveTo(i*108,0); x.lineTo(i*108,1350); x.stroke(); }
    for(let i=1;i<13;i++){ x.beginPath(); x.moveTo(0,i*108); x.lineTo(1080,i*108); x.stroke(); }
    x.fillStyle = '#38bdf8'; x.fillRect(80,120,10,90);
    x.fillStyle = '#e8eef8'; x.font = '700 92px Barlow Condensed, sans-serif'; x.textBaseline = 'alphabetic';
    x.fillText('FORJA', 120, 190);
    x.fillStyle = '#8494ab'; x.font = '600 34px Barlow Condensed, sans-serif';
    x.fillText(new Date(log.date).toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' }).toUpperCase(), 120, 240);
    x.fillStyle = '#5a6a83'; x.font = '600 40px Barlow Condensed, sans-serif';
    x.fillText('CARGA TOTAL LEVANTADA', 80, 480);
    x.fillStyle = '#38bdf8'; x.font = '700 190px Barlow Condensed, sans-serif';
    x.fillText(fmtKg(log.volume), 80, 660);
    x.fillStyle = '#e8eef8'; x.font = '600 52px Barlow Condensed, sans-serif';
    x.fillText(log.name.toUpperCase().slice(0,32), 80, 780);
    const stats = [ [fmtN(log.setsDone),'SÉRIES'], [fmtN(log.totalReps),'REPS'], [fmtDur(log.duration),'DURAÇÃO'], [String(log.prCount),'PRS'] ];
    stats.forEach(function(st, i){
      const sx = 80 + i*240;
      x.strokeStyle = 'rgba(148,163,184,.2)'; x.strokeRect(sx, 900, 210, 190);
      x.fillStyle = '#e8eef8'; x.font = '700 54px Barlow Condensed, sans-serif';
      x.fillText(st[0], sx+20, 985);
      x.fillStyle = '#5a6a83'; x.font = '600 28px Barlow Condensed, sans-serif';
      x.fillText(st[1], sx+20, 1040);
    });
    x.fillStyle = '#38bdf8'; x.font = '700 36px Barlow Condensed, sans-serif';
    x.fillText('TREINO & PERFORMANCE', 80, 1250);
    const blob = await new Promise(function(res){ c.toBlob(res, 'image/jpeg', .9); });
    return blob;
  }catch(e){ return null; }
}
async function shareReport(){
  const log = postLogRef || state.logs[state.logs.length-1];
  if(!log) return;
  const text = 'FORJA — ' + log.name + ' · ' + fmtKg(log.volume) + ' de volume · ' + fmtDur(log.duration) +
    (log.prCount ? ' · ' + log.prCount + ' PRs' : '');
  try{
    const blob = await buildShareCard(log);
    if(blob && navigator.canShare){
      const file = new File([blob], 'forja-treino.jpg', { type:'image/jpeg' });
      if(navigator.canShare({ files:[file] })){
        await navigator.share({ files:[file], text: text, title: 'FORJA' });
        return;
      }
    }
    if(navigator.share){ await navigator.share({ text: text, title: 'FORJA' }); return; }
  }catch(e){}
  try{
    const blob = await buildShareCard(log);
    if(blob){
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'forja-treino.jpg';
      a.click();
      toast('Cartão do treino salvo na galeria de downloads.', 'ok', 'image');
      return;
    }
  }catch(e){}
  toast('Compartilhamento não suportado neste navegador.', 'bad');
}
