/* ==========================================================================
   FORJA - DATA & BIBLIOTECA DE EXERCÍCIOS & ROTINAS PRONTAS
   ========================================================================== */

/* Biblioteca completa de exercícios comuns com equipamento e instruções de execução */
const RAW_EXERCISES = [
  ['Peito', [
    ['Supino Reto com Barra', 'Barra', 'Deite no banco reto, pés firmes no chão, pegada um pouco além dos ombros. Desça até encostar suavemente no meio do peito e empurre com força.'],
    ['Supino Inclinado com Barra', 'Barra', 'Banco a 30-45 graus. Foco na porção clavicular (superior) do peitoral. Desça a barra controlando o movimento.'],
    ['Supino Inclinado com Halteres', 'Halteres', 'Permite maior amplitude de movimento e rotação natural dos punhos. Desça até alongar bem o peitoral superior.'],
    ['Supino Reto com Halteres', 'Halteres', 'Excelente equilíbrio e ativação estabilizadora. Concentre-se em aproximar os halteres no topo sem bater.'],
    ['Supino Declinado com Barra', 'Barra', 'Foco na porção inferior do peitoral. Mantenha os cotovelos a 45-60 graus do tronco.'],
    ['Supino Declinado com Halteres', 'Halteres', 'Variação com halteres para porção inferior com menos estresse articular nos ombros.'],
    ['Crucifixo com Halteres', 'Halteres', 'Banco reto. Braços levemente flexionados, abra até sentir um alongamento profundo nas fibras do peito.'],
    ['Crucifixo Inclinado com Halteres', 'Halteres', 'Banco a 30 graus. Movimento de abraço com foco na parte superior do peito.'],
    ['Crucifixo na Máquina (Peck Deck)', 'Máquina', 'Mantém a tensão constante durante todo o arco do movimento. Aperte no centro por 1 segundo.'],
    ['Crossover na Polia Alta', 'Cabo', 'Cabos no topo. Puxe para baixo e à frente cruzando as mãos. Ênfase no feixe inferior do peitoral.'],
    ['Crossover na Polia Baixa', 'Cabo', 'Cabos na base. Puxe para cima e à frente. Ênfase no feixe superior do peitoral.'],
    ['Crossover na Polia Média', 'Cabo', 'Cabos na altura do peito. Movimento em linha reta com tensão máxima no peitoral medial.'],
    ['Flexão de Braço', 'Peso Corporal', 'Mantenha o core rígido em linha reta. Desça até quase tocar o peito no chão mantendo os cotovelos a 45 graus.'],
    ['Paralelas (Foco Peitoral)', 'Peso Corporal', 'Incline o tronco para a frente e abra levemente os cotovelos para transferir a tensão para o peito.'],
    ['Pullover com Halter', 'Halteres', 'Deitado transversalmente no banco, desça o halter atrás da cabeça alongando caixa torácica e peitoral.'],
    ['Supino Articulado Máquina', 'Máquina', 'Excelente para alcançar a falha muscular com segurança e estabilidade na trajetória.']
  ]],
  ['Costas', [
    ['Puxada Frontal na Polia', 'Cabo', 'Puxe a barra em direção à parte superior do peito retraindo as escápulas antes de flexionar os cotovelos.'],
    ['Puxada Triângulo na Polia', 'Cabo', 'Pegada neutra fechada. Foco na espessura dorsal e grande dorsal inferior.'],
    ['Puxada Supinada', 'Cabo', 'Pegada com palmas voltadas para si. Maior participação dos flexores de cotovelo e latíssimo inferior.'],
    ['Barra Fixa (Pronada / Supinada)', 'Peso Corporal', 'O exercício rei para largura das costas. Suba até o queixo passar da barra com controle.'],
    ['Remada Curvada com Barra', 'Barra', 'Tronco inclinado a 45 graus, coluna neutra. Puxe a barra no umbigo apertando as escápulas.'],
    ['Remada Curvada com Halteres', 'Halteres', 'Permite trajetória livre para cada braço, corrigindo assimetrias na dorsal.'],
    ['Remada Baixa na Polia (Sentado)', 'Cabo', 'Pés apoiados, coluna ereta. Puxe o triângulo contra o abdômen sem jogar o tronco para trás.'],
    ['Remada Unilateral com Halter (Serrote)', 'Halteres', 'Apoie um joelho e mão no banco. Puxe o halter em direção ao quadril ativando a dorsal.'],
    ['Remada Cavalinho (Barra T)', 'Barra', 'Pegada fechada ou neutra. Excelente para construção de espessura de costas e eretores.'],
    ['Remada Articulada na Máquina', 'Máquina', 'Permite focar exclusivamente na contração escapular com apoio no tórax.'],
    ['Levantamento Terra', 'Barra', 'Exercício composto fundamental para toda a cadeia posterior, eretores, glúteos e trapézio.'],
    ['Pulldown com Braços Estendidos', 'Cabo', 'Cotovelos quase retos. Pressione a barra ou corda para baixo com o latíssimo do dorso.'],
    ['Meio Terra (Rack Pull)', 'Barra', 'Inicie a barra na altura dos joelhos. Foco na densidade de costas superior e lombar com mais sobrecarga.'],
    ['Hiperextensão Lombar (Banco Romano)', 'Peso Corporal', 'Fortalece os eretores da espinha e previne lesões na coluna vertebral.']
  ]],
  ['Pernas', [
    ['Agachamento Livre com Barra', 'Barra', 'Barra apoiada no trapézio. Pés na largura dos ombros. Desça até romper o paralelo mantendo joelhos alinhados aos pés.'],
    ['Agachamento Frontal com Barra', 'Barra', 'Barra apoiada na frente dos deltoides. Tronco mais vertical e ativação máxima de quadríceps.'],
    ['Agachamento Búlgaro', 'Halteres', 'Um pé apoiado atrás em um banco. Desça na vertical. Foco intenso em quadríceps e glúteo.'],
    ['Leg Press 45°', 'Máquina', 'Pés no centro da plataforma. Desça controlando o peso sem deixar a lombar descolar do encosto.'],
    ['Hack Squat na Máquina', 'Máquina', 'Pés mais baixos e juntos para isolar os vastos lateral e medial do quadríceps.'],
    ['Cadeira Extensora', 'Máquina', 'Isolamento puro de quadríceps. Segure 1 segundo na contração máxima de pico no topo.'],
    ['Mesa Flexora', 'Máquina', 'Deitado de bruços. Puxe os calcanhares em direção aos glúteos isolando os isquiotibiais.'],
    ['Cadeira Flexora', 'Máquina', 'Sentado, trava nos joelhos. Excelente contração de posteriores de coxa na posição encurtada.'],
    ['Stiff com Barra / Halteres', 'Barra', 'Pernas semi-estendidas. Jogue o quadril para trás mantendo a coluna alinhada sentindo o estiramento posterior.'],
    ['Levantamento Terra Romeno (RDL)', 'Barra', 'Descida controlada até abaixo do joelho com foco exclusivo em glúteos e posteriores.'],
    ['Elevação Pélvica com Barra', 'Barra', 'Costas apoiadas no banco, barra sobre o quadril. Suba até o tronco alinhar com as coxas apertando os glúteos.'],
    ['Elevação Pélvica na Máquina', 'Máquina', 'Variação estável e segura para sobrecarga progressiva em glúteo máximo.'],
    ['Afundo (Passada)', 'Halteres', 'Dê passos para frente afundando o joelho de trás até 90 graus.'],
    ['Cadeira Abdutora', 'Máquina', 'Foco no glúteo médio e estabilidade pélvica lateral.'],
    ['Cadeira Adutora', 'Máquina', 'Foco nos músculos adutores da parte interna das coxas.'],
    ['Panturrilha em Pé na Máquina', 'Máquina', 'Amplitude máxima: desça até sentir o tendão alongar e suba na ponta dos pés.'],
    ['Panturrilha Sentado (Gêmeos)', 'Máquina', 'Com os joelhos a 90 graus, o foco principal muda para o músculo sóleo.'],
    ['Panturrilha no Leg Press 45°', 'Máquina', 'Ponta dos pés na borda da plataforma. Movimento controlado de flexão plantar.']
  ]],
  ['Ombros', [
    ['Desenvolvimento Militar com Barra', 'Barra', 'Em pé ou sentado, empurre a barra acima da cabeça mantendo abdômen contraído.'],
    ['Desenvolvimento com Halteres', 'Halteres', 'Sentado com apoio nas costas. Halteres na altura das orelhas, empurre verticalmente.'],
    ['Desenvolvimento Arnold', 'Halteres', 'Inicie com palmas viradas para você e faça a rotação para fora enquanto eleva os pesos.'],
    ['Desenvolvimento na Máquina', 'Máquina', 'Trajetória fixa ideal para séries de drop-set e esforço máximo seguro.'],
    ['Elevação Lateral com Halteres', 'Halteres', 'O melhor exercício para a cabeça lateral do deltoide e largura de ombros.'],
    ['Elevação Lateral na Polia', 'Cabo', 'Cabo passando por trás ou pela frente. Tensão contínua em todo o arco do movimento.'],
    ['Elevação Lateral na Máquina', 'Máquina', 'Braços apoiados nos suportes. Isola completamente o deltoide lateral sem balanço.'],
    ['Elevação Frontal', 'Halteres', 'Elevação dos braços até a altura dos olhos. Foco na porção anterior do ombro.'],
    ['Crucifixo Inverso na Máquina', 'Máquina', 'Peito apoiado no banco. Abra os braços para trás ativando deltoide posterior.'],
    ['Crucifixo Inverso com Halteres', 'Halteres', 'Tronco inclinado à frente. Eleve os halteres em arco focando no deltoide posterior.'],
    ['Face Pull na Polia', 'Cabo', 'Corda na altura do rosto. Puxe em direção aos olhos com rotação externa dos ombros.'],
    ['Remada Alta com Barra / Polia', 'Barra', 'Pegada na largura dos ombros, suba a barra até o peito elevando os cotovelos.'],
    ['Encolhimento com Barra (Trapézio)', 'Barra', 'Eleve os ombros em direção às orelhas sem girar o pescoço. Segure 1 segundo no topo.'],
    ['Encolhimento com Halteres', 'Halteres', 'Permite postura mais anatômica com os braços nas laterais do corpo.']
  ]],
  ['Braços', [
    ['Rosca Direta com Barra W', 'Barra', 'Barra W reduz estresse nos punhos. Mantenha os cotovelos colados ao tronco.'],
    ['Rosca Direta com Barra Reta', 'Barra', 'Supinação completa durante todo o percurso para estímulo máximo do bíceps.'],
    ['Rosca Alternada com Halteres', 'Halteres', 'Gire a palma da mão para cima no topo do movimento (supinação) para pico de contração.'],
    ['Rosca Martelo com Halteres', 'Halteres', 'Pegada neutra (palmas viradas uma para a outra). Constrói o braquial e antebraço.'],
    ['Rosca Martelo na Polia com Corda', 'Cabo', 'Tensão constante no braquial e braquiorradial durante toda a extensão.'],
    ['Rosca Scott na Máquina / Barra', 'Máquina', 'Braços apoiados eliminam qualquer impulso do tronco, proporcionando isolamento total.'],
    ['Rosca Inclinada no Banco 45°', 'Halteres', 'Alongamento extremo da cabeça longa do bíceps pela posição recuada dos braços.'],
    ['Rosca Concentrada', 'Halteres', 'Cotovelo apoiado na coxa interna. Pico de contração lendário estilo fisiculturismo clássico.'],
    ['Rosca Aranha (Spider Curl)', 'Barra', 'Peito apoiado no banco inclinado. Tensão contínua mesmo no topo da contração.'],
    ['Rosca Inversa com Barra', 'Barra', 'Pegada pronada. Fortalece os antebraços e braquiorradial.'],
    ['Flexão de Punho com Barra', 'Barra', 'Antebraços apoiados no banco. Fortalecimento de pegada e flexores dos dedos.'],
    ['Tríceps na Polia com Corda', 'Cabo', 'Abra as pontas da corda na parte inferior para ativar a cabeça lateral do tríceps.'],
    ['Tríceps na Polia com Barra', 'Cabo', 'Permite usar cargas maiores para foco nas cabeças medial e lateral.'],
    ['Tríceps Testa com Barra W', 'Barra', 'Deite no banco, desça a barra até próximo da testa mantendo os cotovelos fixos.'],
    ['Tríceps Testa com Halteres', 'Halteres', 'Permite pegada neutra e descida lateral além da cabeça para maior alongamento.'],
    ['Tríceps Francês com Halter', 'Halteres', 'Sentado, braços verticais acima da cabeça. Foco absoluto na cabeça longa do tríceps.'],
    ['Tríceps Francês na Polia (Corda)', 'Cabo', 'Puxe a corda por cima da cabeça saindo da polia baixa com tensão constante.'],
    ['Supino Fechado com Barra', 'Barra', 'Mãos na largura dos ombros no supino reto. Excelente composto para tríceps pesado.'],
    ['Paralelas (Foco Tríceps)', 'Peso Corporal', 'Mantenha o tronco o mais vertical possível para direcionar a força para o tríceps.'],
    ['Mergulho no Banco (Tríceps)', 'Peso Corporal', 'Mãos apoiadas no banco atrás de você, pernas esticadas. Desça flexionando cotovelos.']
  ]],
  ['Core', [
    ['Prancha Isométrica', 'Peso Corporal', 'Apoio em antebraços e pontas dos pés. Mantenha coluna neutra e glúteos contraídos.'],
    ['Abdominal Canivete (Crunch)', 'Peso Corporal', 'Deitado de costas, flexione a coluna enrolando o tronco em direção aos joelhos.'],
    ['Abdominal na Polia Alta (Corda)', 'Cabo', 'Ajoelhado na frente da polia, enrole o tronco para baixo trazendo a corda até o queixo.'],
    ['Elevação de Pernas Suspenso na Barra', 'Peso Corporal', 'Pendurado na barra fixa, eleve os joelhos ou pernas estendidas até 90 graus.'],
    ['Elevação de Pernas no Solo ou Banco', 'Peso Corporal', 'Deitado, eleve as pernas sem arquear a lombar. Foco no abdômen inferior.'],
    ['Abdominal Roda (Ab Wheel)', 'Aparelho', 'Ajoelhado, role a roda para a frente estendendo o corpo e puxe contraindo o abdômen.'],
    ['Prancha Lateral', 'Peso Corporal', 'Apoio unilateral no antebraço. Ativação profunda dos oblíquos e quadrado lombar.'],
    ['Abdominal Bicicleta', 'Peso Corporal', 'Alternando cotovelo no joelho oposto com rotação torácica controlada.'],
    ['Vácuo Abdominal (Stomach Vacuum)', 'Peso Corporal', 'Expulse todo o ar e puxe o umbigo para dentro em direção à coluna. Fortalece o transverso abdominal.']
  ]]
];

const LIB = RAW_EXERCISES.flatMap(function(g){
  return g[1].map(function(item){
    return {
      id: 'ex-' + normTxt(item[0]).replace(/\s+/g,'-'),
      name: item[0],
      group: g[0],
      equip: item[1] || 'Livre',
      desc: item[2] || '',
      img: '',
      custom: false
    };
  });
});

/* ==========================================================================
   ROTINAS DE TREINO PRÉ-PRONTAS (OPCIONAIS)
   Inspiradas em divisões consagradas: PPL, Upper/Lower, ABC, Arnold, Full Body.
   Todas com cargas em branco ('w: ''') para o usuário começar com pesos reais.
   ========================================================================== */
const PRESET_ROUTINES = [
  {
    id: 'preset-ppl',
    name: 'Push / Pull / Legs (PPL Clássico)',
    tag: 'PPL',
    badge: 'Hipertrofia & Força',
    days: '3 a 6 dias/semana',
    desc: 'Divisão de movimentos: Empurrar (Peito/Ombro/Tríceps), Puxar (Costas/Bíceps) e Pernas completas. Padrão ouro para hipertrofia.',
    workouts: [
      {
        name: 'PPL — Push (Empurrar)',
        split: 'Push/Pull/Legs',
        ex: [
          { exId: 'ex-supino-reto-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-supino-inclinado-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-desenvolvimento-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-elevacao-lateral-na-polia', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-triceps-na-polia-com-corda', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-triceps-frances-com-halter', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] }
        ]
      },
      {
        name: 'PPL — Pull (Puxar)',
        split: 'Push/Pull/Legs',
        ex: [
          { exId: 'ex-puxada-frontal-na-polia', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-curvada-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-baixa-na-polia-sentado', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-face-pull-na-polia', rpe: 8, rest: 60, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-rosca-direta-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-rosca-martelo-com-halteres', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:10,w:''}] }
        ]
      },
      {
        name: 'PPL — Legs (Pernas Completo)',
        split: 'Push/Pull/Legs',
        ex: [
          { exId: 'ex-agachamento-livre-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-leg-press-45', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-cadeira-extensora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-mesa-flexora', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-stiff-com-barra-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-panturrilha-em-pe-na-maquina', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] }
        ]
      }
    ]
  },
  {
    id: 'preset-upper-lower',
    name: 'Upper / Lower (Superior & Inferior)',
    tag: 'Upper/Lower',
    badge: 'Alta Frequência (4 dias)',
    days: '4 dias/semana (A/B)',
    desc: 'Ideal para 4 treinos semanais (ex: Seg/Ter/Qui/Sex). Divide o corpo em membros superiores e inferiores com ótimo tempo de recuperação.',
    workouts: [
      {
        name: 'Upper A — Superior (Foco Força)',
        split: 'Upper/Lower',
        ex: [
          { exId: 'ex-supino-reto-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:6,w:''},{type:'work',reps:6,w:''},{type:'work',reps:6,w:''}] },
          { exId: 'ex-remada-curvada-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:6,w:''},{type:'work',reps:6,w:''},{type:'work',reps:6,w:''}] },
          { exId: 'ex-desenvolvimento-militar-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-puxada-triangulo-na-polia', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-triceps-na-polia-com-corda', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-rosca-inclinada-no-banco-45', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] }
        ]
      },
      {
        name: 'Lower A — Inferior (Foco Quadríceps)',
        split: 'Upper/Lower',
        ex: [
          { exId: 'ex-agachamento-livre-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:6,w:''},{type:'work',reps:6,w:''},{type:'work',reps:6,w:''}] },
          { exId: 'ex-leg-press-45', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-cadeira-extensora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-mesa-flexora', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-panturrilha-no-leg-press-45', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-abdominal-canivete-crunch', rpe: 8, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] }
        ]
      },
      {
        name: 'Upper B — Superior (Foco Hipertrofia)',
        split: 'Upper/Lower',
        ex: [
          { exId: 'ex-supino-inclinado-com-halteres', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-puxada-frontal-na-polia', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-elevacao-lateral-com-halteres', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-crucifixo-inverso-na-maquina', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-rosca-scott-na-maquina-barra', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-triceps-testa-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] }
        ]
      },
      {
        name: 'Lower B — Inferior (Foco Posterior & Glúteo)',
        split: 'Upper/Lower',
        ex: [
          { exId: 'ex-levantamento-terra-romeno-rdl', rpe: 8, rest: 120, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-agachamento-bulgaro', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-elevacao-pelvica-com-barra', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-cadeira-flexora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-panturrilha-sentado-gemeos', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] }
        ]
      }
    ]
  },
  {
    id: 'preset-abc',
    name: 'ABC Clássico (A / B / C)',
    tag: 'ABC',
    badge: 'Popular & Equilibrado',
    days: '3 a 6 dias/semana',
    desc: 'O treino clássico das academias brasileiras: A (Peito & Tríceps), B (Costas & Bíceps), C (Pernas & Ombros).',
    workouts: [
      {
        name: 'Treino A — Peito & Tríceps',
        split: 'ABC',
        ex: [
          { exId: 'ex-supino-reto-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-supino-inclinado-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-crucifixo-na-maquina-peck-deck', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-crossover-na-polia-alta', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-triceps-na-polia-com-corda', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-triceps-testa-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] }
        ]
      },
      {
        name: 'Treino B — Costas & Bíceps',
        split: 'ABC',
        ex: [
          { exId: 'ex-puxada-frontal-na-polia', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-curvada-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-baixa-na-polia-sentado', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-pulldown-com-bracos-estendidos', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-rosca-direta-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-rosca-martelo-com-halteres', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:10,w:''}] }
        ]
      },
      {
        name: 'Treino C — Pernas, Ombros & Core',
        split: 'ABC',
        ex: [
          { exId: 'ex-agachamento-livre-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-leg-press-45', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-cadeira-extensora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-mesa-flexora', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-desenvolvimento-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-elevacao-lateral-com-halteres', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-panturrilha-em-pe-na-maquina', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] }
        ]
      }
    ]
  },
  {
    id: 'preset-arnold',
    name: 'Arnold Split (Era de Ouro)',
    tag: 'Arnold',
    badge: 'Intensidade & Antagonistas',
    days: '3 ou 6 dias/semana',
    desc: 'O split lendário utilizado por Arnold Schwarzenegger: Dia 1 (Peito & Costas antagonistas), Dia 2 (Ombros & Braços), Dia 3 (Pernas & Abdômen).',
    workouts: [
      {
        name: 'Arnold 1 — Peitoral & Costas',
        split: 'Livre',
        ex: [
          { exId: 'ex-supino-reto-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-curvada-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-supino-inclinado-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-puxada-frontal-na-polia', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-crucifixo-com-halteres', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-pullover-com-halter', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] }
        ]
      },
      {
        name: 'Arnold 2 — Ombros & Braços',
        split: 'Livre',
        ex: [
          { exId: 'ex-desenvolvimento-arnold', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-elevacao-lateral-com-halteres', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-crucifixo-inverso-na-maquina', rpe: 8, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-rosca-direta-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-triceps-testa-com-barra-w', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-rosca-concentrada', rpe: 9, rest: 45, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-triceps-na-polia-com-corda', rpe: 9, rest: 45, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] }
        ]
      },
      {
        name: 'Arnold 3 — Pernas Completo & Core',
        split: 'Livre',
        ex: [
          { exId: 'ex-agachamento-livre-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-stiff-com-barra-halteres', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-leg-press-45', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-mesa-flexora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] },
          { exId: 'ex-cadeira-extensora', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-panturrilha-em-pe-na-maquina', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-elevacao-de-pernas-suspenso-na-barra', rpe: 8, rest: 45, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:12,w:''}] }
        ]
      }
    ]
  },
  {
    id: 'preset-fullbody',
    name: 'Full Body 3x (Corpo Inteiro)',
    tag: 'Full Body',
    badge: 'Rotina Otimizada (3x/semana)',
    days: '3 dias/semana (Seg/Qua/Sex)',
    desc: 'Treino estimulando todos os grandes grupos musculares 3x na semana com alternância de exercícios compostos A e B.',
    workouts: [
      {
        name: 'Full Body A — Estímulo Principal',
        split: 'Full Body',
        ex: [
          { exId: 'ex-agachamento-livre-com-barra', rpe: 8, rest: 120, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-supino-reto-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-remada-curvada-com-barra', rpe: 8, rest: 90, sets: [{type:'work',reps:8,w:''},{type:'work',reps:8,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-desenvolvimento-com-halteres', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-mesa-flexora', rpe: 8, rest: 60, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-prancha-isometrica', rpe: 8, rest: 60, sets: [{type:'work',reps:45,w:''},{type:'work',reps:45,w:''},{type:'work',reps:45,w:''}] }
        ]
      },
      {
        name: 'Full Body B — Variação & Força',
        split: 'Full Body',
        ex: [
          { exId: 'ex-levantamento-terra', rpe: 8, rest: 120, sets: [{type:'work',reps:6,w:''},{type:'work',reps:6,w:''},{type:'work',reps:6,w:''}] },
          { exId: 'ex-leg-press-45', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:10,w:''}] },
          { exId: 'ex-supino-inclinado-com-halteres', rpe: 8, rest: 90, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-puxada-frontal-na-polia', rpe: 8, rest: 75, sets: [{type:'work',reps:10,w:''},{type:'work',reps:10,w:''},{type:'work',reps:8,w:''}] },
          { exId: 'ex-elevacao-lateral-com-halteres', rpe: 9, rest: 60, sets: [{type:'work',reps:12,w:''},{type:'work',reps:12,w:''},{type:'work',reps:15,w:''}] },
          { exId: 'ex-panturrilha-em-pe-na-maquina', rpe: 9, rest: 45, sets: [{type:'work',reps:15,w:''},{type:'work',reps:15,w:''},{type:'work',reps:15,w:''}] }
        ]
      }
    ]
  }
];

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
