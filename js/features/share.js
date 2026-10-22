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

/* ==============================================================
   IMPORTAÇÃO DIRETA DO HISTÓRICO DO HEVY (WORKOUTS.CSV)
   ============================================================== */

const HEVY_EX_MAP = {
  'bench press (barbell)': 'Supino Reto com Barra',
  'incline bench press (barbell)': 'Supino Inclinado com Barra',
  'bench press (dumbbell)': 'Supino Reto com Halteres',
  'incline bench press (dumbbell)': 'Supino Inclinado com Halteres',
  'decline bench press (barbell)': 'Supino Declinado com Barra',
  'dumbbell fly': 'Crucifixo com Halteres',
  'incline dumbbell fly': 'Crucifixo Inclinado com Halteres',
  'chest fly (machine)': 'Crucifixo na Máquina (Peck Deck)',
  'peck deck': 'Crucifixo na Máquina (Peck Deck)',
  'cable crossover': 'Crossover na Polia Média',
  'push up': 'Flexão de Braço',
  'pushups': 'Flexão de Braço',
  'chest dip': 'Paralelas (Foco Peitoral)',
  'lat pulldown (cable)': 'Puxada Frontal na Polia',
  'lat pulldown': 'Puxada Frontal na Polia',
  'pull up': 'Barra Fixa (Pronada / Supinada)',
  'chin up': 'Barra Fixa (Pronada / Supinada)',
  'bent over row (barbell)': 'Remada Curvada com Barra',
  'bent over row (dumbbell)': 'Remada Curvada com Halteres',
  'seated cable row': 'Remada Baixa na Polia (Sentado)',
  'dumbbell row': 'Remada Unilateral com Halter (Serrote)',
  't bar row': 'Remada Cavalinho (Barra T)',
  'deadlift (barbell)': 'Levantamento Terra',
  'romanian deadlift (barbell)': 'Levantamento Terra Romeno (RDL)',
  'squat (barbell)': 'Agachamento Livre com Barra',
  'front squat (barbell)': 'Agachamento Frontal com Barra',
  'bulgarian split squat': 'Agachamento Búlgaro',
  'leg press': 'Leg Press 45°',
  'hack squat': 'Hack Squat na Máquina',
  'leg extension (machine)': 'Cadeira Extensora',
  'leg curl (machine)': 'Mesa Flexora',
  'seated leg curl': 'Cadeira Flexora',
  'standing calf raise': 'Panturrilha em Pé na Máquina',
  'seated calf raise': 'Panturrilha Sentado (Gêmeos)',
  'hip thrust (barbell)': 'Elevação Pélvica com Barra',
  'overhead press (barbell)': 'Desenvolvimento Militar com Barra',
  'military press': 'Desenvolvimento Militar com Barra',
  'shoulder press (dumbbell)': 'Desenvolvimento com Halteres',
  'arnold press (dumbbell)': 'Desenvolvimento Arnold',
  'lateral raise (dumbbell)': 'Elevação Lateral com Halteres',
  'lateral raise (cable)': 'Elevação Lateral na Polia',
  'front raise (dumbbell)': 'Elevação Frontal',
  'face pull (cable)': 'Face Pull na Polia',
  'bicep curl (barbell)': 'Rosca Direta com Barra W',
  'bicep curl (dumbbell)': 'Rosca Alternada com Halteres',
  'hammer curl (dumbbell)': 'Rosca Martelo com Halteres',
  'preacher curl': 'Rosca Scott na Máquina / Barra',
  'incline bicep curl': 'Rosca Inclinada no Banco 45°',
  'concentration curl': 'Rosca Concentrada',
  'triceps rope pushdown': 'Tríceps na Polia com Corda',
  'triceps pushdown': 'Tríceps na Polia com Barra',
  'skull crusher (barbell)': 'Tríceps Testa com Barra W',
  'french press': 'Tríceps Francês com Halter',
  'overhead triceps extension': 'Tríceps Francês na Polia (Corda)',
  'close grip bench press': 'Supino Fechado com Barra',
  'plank': 'Prancha Isométrica',
  'crunch': 'Abdominal Canivete (Crunch)',
  'hanging leg raise': 'Elevação de Pernas Suspenso na Barra'
};

function resolveHevyEx(name){
  const n = String(name || '').toLowerCase().trim();
  if(HEVY_EX_MAP[n]) return HEVY_EX_MAP[n];
  for(const k in HEVY_EX_MAP){
    if(n.includes(k) || k.includes(n)) return HEVY_EX_MAP[k];
  }
  return name;
}

function parseCSVRows(text){
  const lines = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0; i<text.length; i++){
    const c = text[i];
    const next = text[i+1];
    if(c === '"'){
      if(inQuotes && next === '"'){ cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if(c === ',' && !inQuotes){
      row.push(cur.trim());
      cur = '';
    } else if((c === '\r' || c === '\n') && !inQuotes){
      if(c === '\r' && next === '\n') i++;
      row.push(cur.trim());
      if(row.some(function(x){ return x !== ''; })) lines.push(row);
      row = [];
      cur = '';
    } else {
      cur += c;
    }
  }
  if(cur || row.length){
    row.push(cur.trim());
    if(row.some(function(x){ return x !== ''; })) lines.push(row);
  }
  return lines;
}

function parseCSVDate(str){
  if(!str) return Date.now();
  str = String(str).trim();
  const iso = str.replace(' ', 'T');
  const d = new Date(iso);
  if(!isNaN(d.getTime())) return d.getTime();
  const m = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if(m){
    return new Date(m[3], m[2]-1, m[1], m[4]||12, m[5]||0, m[6]||0).getTime();
  }
  return Date.now();
}

function openHevyImportModal(){
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">IMPORTAR DO HEVY (CSV)</div>' +
    '<div style="color:var(--acc)">' + icon('fileCsv') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13.5px;line-height:1.55">' +
    'No Hevy: vá em <b>Perfil → Configurações → Exportar Dados / Export CSV</b> e envie o arquivo <code>workouts.csv</code> gerado. Seus treinos, séries, cargas e recordes (PRs) serão integrados ao FORJA.</p>' +

    '<div class="card acc mt14 text-center">' +
    '<div style="width:46px;height:46px;border-radius:13px;background:rgba(56,189,248,.15);color:var(--acc);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">' + icon('download') + '</div>' +
    '<b style="font-size:15px;display:block">Enviar Arquivo workouts.csv</b>' +
    '<p class="dim mt8" style="font-size:12px">Formatos aceitos: Hevy e Strong CSV</p>' +
    '<label class="btn btn-pri ripple mt14" style="cursor:pointer;display:inline-flex">' +
    icon('fileCsv') + ' Escolher Arquivo CSV' +
    '<input type="file" id="hevy-file-inp" accept=".csv,text/csv,text/plain" style="display:none" data-chg="hevy-file-select">' +
    '</label>' +
    '</div>' +

    '<div class="mt14">' +
    '<label class="lbl">Ou cole o texto do CSV abaixo</label>' +
    '<textarea class="fld mt8" id="hevy-csv-text" placeholder="Cole o conteúdo do arquivo CSV aqui (title, start_time, ...)..." style="min-height:90px;font-family:monospace;font-size:11.5px"></textarea>' +
    '<button class="btn btn-ghost ripple mt14" style="width:100%" data-act="hevy-parse-text">' + icon('check') + ' Processar Texto do CSV</button>' +
    '</div>' +
    '<div id="hevy-import-result" class="mt14"></div>'
  );
}

function handleHevyFileSelect(inputEl){
  const file = inputEl && inputEl.files && inputEl.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    processHevyCSVText(e.target.result);
  };
  reader.onerror = function(){
    toast('Erro ao ler o arquivo CSV selecionado.', 'bad');
  };
  reader.readAsText(file);
}

function processHevyCSVText(csvText){
  if(!csvText || !csvText.trim()){
    toast('O arquivo ou texto CSV está vazio.', 'bad');
    return;
  }
  const lines = parseCSVRows(csvText);
  if(lines.length < 2){
    toast('O arquivo CSV não possui linhas de dados suficientes.', 'bad');
    return;
  }

  const header = lines[0].map(function(h){ return String(h || '').toLowerCase().replace(/[^a-z0-9_]/g, ''); });

  const colIdx = {
    title: header.findIndex(function(h){ return h.includes('title') || h.includes('workout') || h.includes('routine') || h === 'name'; }),
    start: header.findIndex(function(h){ return h.includes('start') || h.includes('date'); }),
    end: header.findIndex(function(h){ return h.includes('end'); }),
    ex: header.findIndex(function(h){ return h.includes('exercise'); }),
    setIdx: header.findIndex(function(h){ return h.includes('set_index') || h.includes('set_order') || h === 'set'; }),
    setType: header.findIndex(function(h){ return h.includes('type'); }),
    wKg: header.findIndex(function(h){ return h.includes('weight_kg') || (h.includes('weight') && !h.includes('lbs')); }),
    wLbs: header.findIndex(function(h){ return h.includes('weight_lbs') || h.includes('lbs'); }),
    reps: header.findIndex(function(h){ return h.includes('reps') || h === 'rep'; }),
    rpe: header.findIndex(function(h){ return h.includes('rpe'); })
  };

  if(colIdx.ex === -1 || (colIdx.reps === -1 && colIdx.wKg === -1)){
    toast('Formato de CSV não reconhecido. Certifique-se de que é um export do Hevy ou Strong.', 'bad');
    return;
  }

  const sessions = new Map();
  for(let i = 1; i < lines.length; i++){
    const row = lines[i];
    if(!row || !row.length || !row.some(function(x){ return x !== ''; })) continue;

    const title = (colIdx.title >= 0 && row[colIdx.title]) ? row[colIdx.title].trim() : 'Treino Importado';
    const startStr = (colIdx.start >= 0 && row[colIdx.start]) ? row[colIdx.start].trim() : '';
    const endStr = (colIdx.end >= 0 && row[colIdx.end]) ? row[colIdx.end].trim() : '';

    const sessionKey = (startStr || '') + '||' + title;
    if(!sessions.has(sessionKey)){
      sessions.set(sessionKey, {
        title: title,
        startStr: startStr,
        endStr: endStr,
        rows: []
      });
    }
    sessions.get(sessionKey).rows.push(row);
  }

  if(!sessions.size){
    toast('Nenhum treino válido encontrado no arquivo.', 'bad');
    return;
  }

  let importedWorkoutsCount = 0;
  let importedSetsCount = 0;
  let totalImportedVolume = 0;

  state.logs = state.logs || [];

  for(const [key, sData] of sessions.entries()){
    const startDate = parseCSVDate(sData.startStr);
    const endDate = sData.endStr ? parseCSVDate(sData.endStr) : (startDate + 50 * 60000);
    const duration = Math.max(10 * 60000, Math.min(4 * 3600000, endDate - startDate));

    // Evita duplicar sessões já salvas
    const exists = state.logs.some(function(l){
      return Math.abs(l.date - startDate) < 90000 && (l.name === sData.title || l.date === startDate);
    });
    if(exists) continue;

    const exMap = new Map();
    for(const r of sData.rows){
      const rawExName = (colIdx.ex >= 0 && r[colIdx.ex]) ? r[colIdx.ex].trim() : 'Exercício';
      if(!rawExName) continue;
      const exResolved = resolveHevyEx(rawExName);
      const matchedLib = matchExercise(exResolved);

      if(!exMap.has(matchedLib.id)){
        exMap.set(matchedLib.id, { exId: matchedLib.id, sets: [] });
      }

      let weight = 0;
      if(colIdx.wKg >= 0 && r[colIdx.wKg]){
        weight = parseNum(r[colIdx.wKg]);
      } else if(colIdx.wLbs >= 0 && r[colIdx.wLbs]){
        weight = Math.round((parseNum(r[colIdx.wLbs]) / 2.20462) * 10) / 10;
      }

      const reps = colIdx.reps >= 0 ? Math.max(0, parseInt(r[colIdx.reps], 10) || 0) : 10;
      const rpe = colIdx.rpe >= 0 ? Math.min(10, Math.max(5, parseFloat(r[colIdx.rpe]) || 8)) : 8;

      let type = 'work';
      if(colIdx.setType >= 0 && r[colIdx.setType]){
        const tLower = r[colIdx.setType].toLowerCase();
        if(tLower.includes('warm') || tLower.includes('aquece')) type = 'warm';
        else if(tLower.includes('drop') || tLower.includes('prep')) type = 'prep';
      }

      exMap.get(matchedLib.id).sets.push({
        type: type,
        w: weight,
        r: reps,
        rpe: rpe,
        done: true
      });
    }

    const exList = Array.from(exMap.values()).filter(function(e){ return e.sets.length > 0; });
    if(!exList.length) continue;

    let volume = 0, totalReps = 0, setsDone = 0;
    const groups = {};

    for(const e of exList){
      const lib = libById(e.exId);
      const g = lib ? lib.group : 'Peito';
      for(const s of e.sets){
        setsDone++;
        totalReps += s.r;
        if(s.type !== 'warm'){
          const v = s.w * s.r;
          volume += v;
          const activation = Math.max(v, s.r * 25);
          groups[g] = (groups[g] || 0) + activation;
        }
      }
    }

    const xp = 50 + Math.floor(volume / 400) * 5 + (duration > 30 * 60000 ? 15 : 0);

    const log = {
      id: uid(),
      workoutId: null,
      name: sData.title,
      date: startDate,
      duration: duration,
      volume: volume,
      xpEarned: xp,
      prCount: 0,
      setsDone: setsDone,
      totalReps: totalReps,
      groups: groups,
      ex: exList
    };

    state.logs.push(log);
    importedWorkoutsCount++;
    importedSetsCount += setsDone;
    totalImportedVolume += volume;
  }

  if(importedWorkoutsCount === 0){
    toast('Todos os treinos deste arquivo já haviam sido importados anteriormente.', 'ai');
    closeModal();
    return;
  }

  rebuildRecords();
  state.user.xp = state.logs.reduce(function(s, l){ return s + (l.xpEarned || 50); }, 0);
  checkAchievements(true);
  save();

  closeModal();
  renderHevyImportSuccess({
    workouts: importedWorkoutsCount,
    sets: importedSetsCount,
    volume: totalImportedVolume
  });

  if(RENDER[curView]) RENDER[curView]();
}

function renderHevyImportSuccess(stats){
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="lbl rise" style="letter-spacing:3px;text-align:center;color:var(--ok)">IMPORTAÇÃO CONCLUÍDA COM SUCESSO</div>' +
    '<div class="h-display mt14 rise" style="font-size:26px;text-align:center;color:var(--acc)">' +
    stats.workouts + ' TREINOS IMPORTADOS DO HEVY!</div>' +

    '<div class="statband mt20 rise">' +
    '<div><b class="num">' + stats.workouts + '</b><span>Sessões</span></div>' +
    '<div><b class="num">' + stats.sets + '</b><span>Séries</span></div>' +
    '<div><b class="num" style="color:var(--acc)">' + fmtKg(stats.volume) + '</b><span>Volume Total</span></div>' +
    '</div>' +

    '<p class="mut mt14" style="font-size:13.5px;line-height:1.55;text-align:center">' +
    'Seus recordes pessoais (PRs), histórico de cargas, gráficos de evolução e conquistas foram recalculados com base em todo o seu histórico do Hevy.</p>' +

    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="modal-close">' +
    icon('check') + ' Ver Meu Histórico na Forja</button>'
  );
  celebrate();
}
