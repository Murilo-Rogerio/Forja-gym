/* Biblioteca de exercícios (seed) */
const LIB = [
  ['Peito',['Supino Reto com Barra','Supino Inclinado com Barra','Supino Inclinado com Halteres','Crucifixo com Halteres','Crucifixo na Máquina (Peck Deck)','Flexão de Braço','Paralelas (Mergulho)']],
  ['Costas',['Puxada Frontal na Polia','Remada Curvada com Barra','Remada Unilateral com Halter','Levantamento Terra','Remada Sentada na Máquina','Puxada Triângulo','Pulldown com Braços Estendidos']],
  ['Pernas',['Agachamento Livre','Agachamento Búlgaro','Leg Press 45°','Cadeira Extensora','Mesa Flexora','Stiff com Barra','Elevação Pélvica','Afundo (Passada)','Panturrilha em Pé','Panturrilha Sentado']],
  ['Ombros',['Desenvolvimento Militar com Barra','Desenvolvimento com Halteres','Elevação Lateral com Halteres','Elevação Frontal','Remada Alta','Crucifixo Inverso','Encolhimento de Ombros']],
  ['Braços',['Rosca Direta com Barra','Rosca Alternada com Halteres','Rosca Martelo','Rosca Scott','Tríceps Testa','Tríceps na Polia (Barra)','Tríceps Francês com Halter','Mergulho no Banco','Rosca Direta na Polia']],
  ['Core',['Prancha Isométrica','Abdominal Canivete (Crunch)','Elevação de Pernas Suspenso','Abdominal na Polia Alta','Prancha Lateral','Abdominal Bicicleta','Halo com Kettlebell']]
].flatMap(function(g){
  return g[1].map(function(n){
    return { id: 'ex-' + normTxt(n).replace(/\s+/g,'-'), name: n, group: g[0], custom: false };
  });
});

/* Conquistas */
const ACHS = [
  { id:'first',  icon:'flame',  name:'Primeira Chama',       desc:'Conclua seu primeiro treino.' },
  { id:'ton1',   icon:'medal',  name:'Primeira Tonelada',    desc:'Mova 1.000 kg em um único treino.' },
  { id:'ton10',  icon:'gem',    name:'Dez Toneladas',        desc:'Acumule 10.000 kg de volume total.' },
  { id:'ton50',  icon:'gem',    name:'Cinquenta Toneladas',  desc:'Acumule 50.000 kg de volume total.' },
  { id:'steel',  icon:'shield', name:'Consistência de Aço',  desc:'3+ treinos por semana, por 4 semanas seguidas.' },
  { id:'pr1',    icon:'zap',    name:'Primeiro PR',          desc:'Bata seu primeiro recorde pessoal.' },
  { id:'pr10',   icon:'trophy', name:'Caçador de Recordes',  desc:'Acumule 10 PRs ao longo da jornada.' },
  { id:'double', icon:'crown',  name:'Dobre a Carga',        desc:'Dobre sua força estimada em um exercício (5+ sessões).' },
  { id:'s10',    icon:'star',   name:'Dedicação',            desc:'Complete 10 sessões de treino.' },
  { id:'s50',    icon:'star',   name:'Veterano de Ferro',    desc:'Complete 50 sessões de treino.' },
  { id:'lvl5',   icon:'bolt2',  name:'Ascensão',             desc:'Alcance o nível 5.' },
  { id:'rep100', icon:'target', name:'Centenário',           desc:'Complete 100 repetições em um único treino.' },
  { id:'hour',   icon:'clock',  name:'Hora de Ferro',        desc:'Complete um treino com 45+ minutos.' }
];

/* Tipos de série */
const TYPE_META = { work:{ l:'V', full:'Válida', cls:'st-work' }, prep:{ l:'P', full:'Preparatória', cls:'st-prep' }, warm:{ l:'A', full:'Aquecimento', cls:'st-warm' } };
function nextType(t){ return t === 'work' ? 'prep' : t === 'prep' ? 'warm' : 'work'; }