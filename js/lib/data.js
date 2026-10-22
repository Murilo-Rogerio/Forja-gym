/* Biblioteca completa de exercícios comuns (seed) */
const LIB = [
  ['Peito', [
    'Supino Reto com Barra',
    'Supino Inclinado com Barra',
    'Supino Inclinado com Halteres',
    'Supino Reto com Halteres',
    'Supino Declinado com Barra',
    'Crucifixo com Halteres',
    'Crucifixo na Máquina (Peck Deck)',
    'Crossover na Polia Alta',
    'Crossover na Polia Baixa',
    'Flexão de Braço',
    'Paralelas (Foco Peitoral)'
  ]],
  ['Costas', [
    'Puxada Frontal na Polia',
    'Puxada Triângulo na Polia',
    'Barra Fixa (Pronada / Supinada)',
    'Remada Curvada com Barra',
    'Remada Baixa na Polia (Sentado)',
    'Remada Unilateral com Halter (Serrote)',
    'Remada Cavalinho (Barra T)',
    'Levantamento Terra',
    'Pulldown com Braços Estendidos',
    'Remada Articulada na Máquina'
  ]],
  ['Pernas', [
    'Agachamento Livre com Barra',
    'Agachamento Búlgaro',
    'Leg Press 45°',
    'Hack Squat na Máquina',
    'Cadeira Extensora',
    'Mesa Flexora',
    'Cadeira Flexora',
    'Stiff com Barra / Halteres',
    'Elevação Pélvica com Barra',
    'Afundo (Passada)',
    'Panturrilha em Pé na Máquina',
    'Panturrilha Sentado (Gêmeos)',
    'Cadeira Abdutora',
    'Cadeira Adutora'
  ]],
  ['Ombros', [
    'Desenvolvimento Militar com Barra',
    'Desenvolvimento com Halteres',
    'Elevação Lateral com Halteres',
    'Elevação Lateral na Polia',
    'Elevação Frontal',
    'Crucifixo Inverso na Máquina',
    'Face Pull na Polia',
    'Remada Alta com Barra / Polia',
    'Encolhimento com Barra (Trapézio)'
  ]],
  ['Braços', [
    'Rosca Direta com Barra W',
    'Rosca Alternada com Halteres',
    'Rosca Martelo com Halteres',
    'Rosca Scott na Máquina / Barra',
    'Rosca Inclinada no Banco 45°',
    'Tríceps Testa com Barra W',
    'Tríceps na Polia com Barra',
    'Tríceps na Polia com Corda',
    'Tríceps Francês com Halter',
    'Mergulho no Banco (Tríceps)',
    'Rosca Concentrada'
  ]],
  ['Core', [
    'Prancha Isométrica',
    'Abdominal Canivete (Crunch)',
    'Abdominal na Polia Alta (Corda)',
    'Elevação de Pernas Suspenso na Barra',
    'Abdominal Roda (Ab Wheel)',
    'Prancha Lateral',
    'Abdominal Bicicleta',
    'Vácuo Abdominal (Stomach Vacuum)'
  ]]
].flatMap(function(g){
  return g[1].map(function(n){
    return { id: 'ex-' + normTxt(n).replace(/\s+/g,'-'), name: n, group: g[0], custom: false };
  });
});

/* Conquistas (Badges) */
const ACHS = [
  { id:'first',  icon:'flame',  name:'Primeira Chama',       desc:'Conclua seu primeiro treino forjado.' },
  { id:'ton1',   icon:'medal',  name:'Primeira Tonelada',    desc:'Mova 1.000 kg em uma única sessão de treino.' },
  { id:'ton10',  icon:'gem',    name:'Dez Toneladas',        desc:'Acumule 10.000 kg de volume total movimentado.' },
  { id:'ton50',  icon:'gem',    name:'Cinquenta Toneladas',  desc:'Acumule 50.000 kg de volume total movimentado.' },
  { id:'steel',  icon:'shield', name:'Consistência de Aço',  desc:'3+ treinos por semana, por 4 semanas consecutivas.' },
  { id:'pr1',    icon:'zap',    name:'Primeiro Recorde',     desc:'Bata seu primeiro PR (Personal Record).' },
  { id:'pr10',   icon:'trophy', name:'Caçador de Recordes',  desc:'Acumule 10 novos PRs ao longo da jornada.' },
  { id:'double', icon:'crown',  name:'Dobre a Carga',        desc:'Dobre sua força estimada em um exercício (5+ sessões).' },
  { id:'s10',    icon:'star',   name:'Dedicação de Ferro',   desc:'Complete 10 sessões completas de treino.' },
  { id:'s50',    icon:'star',   name:'Veterano da Forja',    desc:'Complete 50 sessões de treino.' },
  { id:'lvl5',   icon:'bolt2',  name:'Ascensão Épica',       desc:'Alcance o nível 5 no sistema de XP.' },
  { id:'rep100', icon:'target', name:'Centenário de Reps',   desc:'Complete 100 repetições em um único treino.' },
  { id:'hour',   icon:'clock',  name:'Hora de Ferro',        desc:'Complete um treino intenso com 45+ minutos.' }
];

/* Metadados dos tipos de séries */
const TYPE_META = {
  work: { l:'V', full:'Válida (Série Principal)', cls:'st-work', color:'#38bdf8' },
  prep: { l:'P', full:'Preparatória (Feeder Set)', cls:'st-prep', color:'#fbbf24' },
  warm: { l:'A', full:'Aquecimento (Warm-up)', cls:'st-warm', color:'#94a3b8' }
};

function nextType(t){
  return t === 'work' ? 'prep' : t === 'prep' ? 'warm' : 'work';
}
