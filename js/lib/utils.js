'use strict';
/* Superfície de erros visível */
window.addEventListener('error', function(e){
  const t = document.getElementById('toastlayer');
  if(t && e && e.message){
    const el = document.createElement('div');
    el.className = 'toast bad';
    el.textContent = 'Erro: ' + e.message;
    t.appendChild(el);
    setTimeout(function(){ el.remove(); }, 5000);
  }
});

const $ = s => document.querySelector(s);
const uid = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = n => Math.round(n).toLocaleString('pt-BR');
const fmtKg = v => v >= 1000 ? (v/1000).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' t' : fmtN(v) + ' kg';
const fmtTime = s => { s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };
const fmtDur = ms => { const m = Math.round(ms/60000); return m >= 60 ? Math.floor(m/60)+'h '+(m%60)+'min' : m + ' min'; };
const fmtDate = t => new Date(t).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
const fmtDateL = t => new Date(t).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
const e1RM = (w,r) => w * (1 + r/30);
const mondayOf = d => { const dt = new Date(d); dt.setDate(dt.getDate() - ((dt.getDay()+6)%7)); dt.setHours(0,0,0,0); return dt; };
const parseNum = v => { const n = parseFloat(String(v).replace(',','.')); return isFinite(n) ? n : 0; };
const normTxt = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function timeAgo(t){
  const d = Date.now() - t;
  if(d < 60000) return 'agora';
  if(d < 3600000) return Math.floor(d/60000) + ' min';
  if(d < 86400000) return Math.floor(d/3600000) + ' h';
  if(d < 604800000) return Math.floor(d/86400000) + ' d';
  return Math.floor(d/604800000) + ' sem';
}
function splitTag(name){ const m = String(name||'?').trim().match(/[A-Za-zÀ-ÿ]+/); return (m?m[0]:'?').slice(0,3).toUpperCase(); }
function initialsOf(name){ const m = String(name||'?').trim().match(/[A-Za-zÀ-ÿ]+/g); return (m?m.slice(0,2).map(w=>w[0]):['?']).join('').toUpperCase(); }
async function hashPw(pw, salt){
  try{
    if(window.crypto && crypto.subtle){
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pw));
      return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('');
    }
  }catch(e){}
  let h = 5381; const s = salt + ':' + pw;
  for(let i=0;i<s.length;i++) h = ((h<<5) + h + s.charCodeAt(i)) >>> 0;
  return 'x' + h.toString(16);
}
function resizeImage(file, maxW, q){
  return new Promise(function(res, rej){
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = function(){
      try{
        const sc = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width*sc); c.height = Math.round(img.height*sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        res(c.toDataURL('image/jpeg', q));
      }catch(e){ URL.revokeObjectURL(url); rej(e); }
    };
    img.onerror = function(){ URL.revokeObjectURL(url); rej(); };
    img.src = url;
  });
}