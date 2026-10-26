/* ==========================================================================
   FORJA - DATA & BIBLIOTECA DE EXERCÍCIOS & ROTINAS PRONTAS
   ========================================================================== */

/* Biblioteca completa de exercícios comuns com equipamento e instruções de execução */
/* Biblioteca completa e profissional de exercícios estilo Hevy (132 exercícios) */
const RAW_EXERCISES = [
  ['Peito', [
    [
      'Supino Reto com Barra',
      'Barra',
      'O exercício clássico construtor de força e densidade para a porção medial e esternal do peitoral maior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Medial)',
      'Deltoide Anterior, Tríceps Braquial',
      'Deite no banco com os olhos alinhados à barra. Pés bem apoiados no chão gerando leg drive. Aduza e deprima as escápulas ("encaixe os ombros para trás e para baixo"). Pegada um pouco além da largura dos ombros.',
      'Tire a barra do suporte e posicione-a sobre o peito. Desça a barra de forma controlada até tocar suavemente a linha dos mamilos, mantendo os cotovelos a 45-60 graus do tronco. Empurre com força para cima sem perder a adução escapular.',
      'Nunca aponte os cotovelos a 90 graus para não sobrecarregar o manguito rotador. Mantenha os punhos retos e firmes sob a barra.'
    ],
    [
      'Supino Inclinado com Barra',
      'Barra',
      'Foco prioritário na porção clavicular (superior) do peitoral e deltoides anteriores.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior, Tríceps Braquial',
      'Ajuste o banco em uma inclinação entre 30 e 45 graus. Pés firmes no chão, escápulas travadas contra o encosto.',
      'Desça a barra controlando o peso até encostar na parte superior do peito (logo abaixo das clavículas). Suba empurrando na vertical mantendo o peito estufado.',
      'Evite inclinações acima de 45 graus, pois transferem quase todo o estímulo para os ombros em vez do peitoral superior.'
    ],
    [
      'Supino Inclinado com Halteres',
      'Halteres',
      'Permite maior amplitude de alongamento e rotação livre dos punhos, ideal para peitoral superior sem dor articular.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior, Tríceps Braquial',
      'Banco regulado a 30 graus. Apoie os halteres nos joelhos e dê um impulso com as pernas para deitar em posição segura.',
      'Inicie com os halteres na altura do peito superior. Empurre para cima aproximando os halteres no topo sem bater. Desça abrindo os cotovelos a 45 graus sentindo as fibras superiores alongarem.',
      'Gire levemente os punhos para dentro (pegada semi-neutra) para reduzir o atrito nos ombros e focar na contração de pico.'
    ],
    [
      'Supino Reto com Halteres',
      'Halteres',
      'Proporciona independência muscular entre os lados esquerdo e direito, corrigindo assimetrias com máxima amplitude.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Deltoide Anterior, Tríceps Braquial',
      'Deite com os halteres alinhados à linha dos mamilos. Pés firmes no solo, arco natural na lombar e escápulas travadas.',
      'Empurre os halteres verticalmente até a quase extensão dos cotovelos. Desça controlando o peso por 2 a 3 segundos até sentir um bom estiramento.',
      'Não bata os halteres no topo; isso dissipa a tensão mecânica contínua das fibras musculares.'
    ],
    [
      'Supino Declinado com Barra',
      'Barra',
      'Ênfase na porção inferior e costal do peitoral maior com menor estresse no deltoide anterior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Inferior)',
      'Tríceps Braquial',
      'Trave bem os tornozelos nos suportes do banco declinado (-15 a -30 graus). Mantenha a cabeça e escápulas apoiadas.',
      'Retire a barra e desça em direção à linha inferior do peito. Empurre para cima contraindo a base do peitoral.',
      'Mantenha a respiração ritmada: inspire na descida e expire no ápice da subida para evitar tontura pela posição invertida.'
    ],
    [
      'Supino Declinado com Halteres',
      'Halteres',
      'Trabalho isolado da parte inferior do peito com liberdade de movimento articular nos punhos.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Inferior)',
      'Tríceps Braquial',
      'Prenda os pés no banco declinado e pegue os halteres com auxílio dos joelhos.',
      'Desça os halteres nas laterais do peitoral inferior e empurre convergindo levemente no topo.',
      'Excelente opção para quem sente desconforto no ombro durante o supino reto.'
    ],
    [
      'Supino Reto no Smith',
      'Smith',
      'Trajetória guiada ideal para treinar com cargas altas até a falha muscular concêntrica com travas de segurança.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Deltoide Anterior, Tríceps Braquial',
      'Posicione o banco centralizado no trilho do Smith para que a barra desça exatamente no meio do peitoral.',
      'Gire os punhos para destravar a barra. Desça controlando a descida e empurre explosivo.',
      'Como a barra tem trilho fixo, ajuste a distância do banco antes de carregar anilhas pesadas.'
    ],
    [
      'Supino Inclinado no Smith',
      'Smith',
      'Trajetória guiada focada no peitoral superior com estabilidade total para séries de intensidade.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior, Tríceps Braquial',
      'Banco inclinado a 30-40 graus sob a linha do Smith. Barra alinhada à parte superior do tórax.',
      'Destrave a barra e execute a descida controlada até quase tocar o peito superior. Suba mantendo os cotovelos sob a barra.',
      'Perfeito para drop-sets e repetições parciais no final do treino.'
    ],
    [
      'Supino Articulado Máquina',
      'Máquina',
      'Isolamento biomecânico convergente com tensão constante em todo o arco e suporte torácico.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Deltoide Anterior, Tríceps Braquial',
      'Ajuste o assento para que as manoplas fiquem na linha média dos mamilos. Encoste a lombar e as escápulas firmes.',
      'Empurre as manoplas para a frente estendendo os braços. Retorne lentamente sentindo o alongamento do peito.',
      'Mantenha as escápulas coladas no encosto; não deixe os ombros se projetarem para frente no topo.'
    ],
    [
      'Supino Inclinado na Máquina Articulada',
      'Máquina',
      'Ângulo convergente otimizado para o feixe clavicular do peitoral com apoio lombar estável.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior',
      'Ajuste o assento na altura das clavículas. Segure firme nas manoplas ergonômicas.',
      'Empurre na diagonal para cima convergindo as mãos. Desça até o peitoral superior alongar profundamente.',
      'Ótimo para quem quer carga pesada sem risco de perder o equilíbrio com halteres livres.'
    ],
    [
      'Crucifixo com Halteres',
      'Halteres',
      'Exercício de estiramento puro que trabalha a adução horizontal do ombro com grande amplitude.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Deltoide Anterior',
      'Deitado no banco reto, halteres acima do peito com palmas voltadas uma para a outra. Cotovelos levemente flexionados (15 graus).',
      'Abra os braços em um arco amplo lateral até sentir um estiramento confortável no peito. Feche os braços como se estivesse abraçando uma árvore.',
      'Mantenha a flexão dos cotovelos fixa durante todo o movimento; não transforme o crucifixo em um supino.'
    ],
    [
      'Crucifixo Inclinado com Halteres',
      'Halteres',
      'Abertura em arco no banco inclinado para estiramento e hipertrofia da porção alta do peito.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior',
      'Banco a 30 graus. Cotovelos levemente flexionados e punhos firmes.',
      'Abra os braços sentindo a parte superior do peito abrir completamente. Feche contraindo as fibras superiores.',
      'Não exagere na carga: priorize o controle e a amplitude para preservar a bursa e o manguito rotador.'
    ],
    [
      'Crucifixo na Máquina (Peck Deck)',
      'Máquina',
      'Pico máximo de contração sem ponto morto de alavanca, garantindo tensão mecânica contínua.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Deltoide Anterior',
      'Ajuste o banco para que as mãos fiquem na linha do peitoral. Peito estufado e escápulas travadas atrás.',
      'Feche os braços até as mãos quase se tocarem no centro. Segure a contração por 1 segundo e volte devagar.',
      'Mantenha os cotovelos alinhados com as mãos durante todo o movimento, sem deixar cair.'
    ],
    [
      'Crossover na Polia Alta',
      'Cabo',
      'Cabos no topo puxados para baixo, excelente para definição e densidade do feixe inferior e esternal.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Inferior)',
      'Deltoide Anterior',
      'Polias no ponto mais alto. Dê um passo à frente com uma das pernas para estabilizar o corpo e incline o tronco levemente.',
      'Com os braços semi-flexionados, puxe as manoplas para baixo e para frente cruzando as mãos na frente da cintura.',
      'Foque em juntar os bíceps contra o peitoral no final da fase concêntrica.'
    ],
    [
      'Crossover na Polia Média',
      'Cabo',
      'Polias na altura do peito com trajetória horizontal reta para ativação medial completa.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Medial)',
      'Deltoide Anterior',
      'Ajuste as roldanas na altura dos ombros/peito. Posição em passada com core ativado.',
      'Puxe os cabos em linha reta para frente como um abraço horizontal fechando na altura do esterno.',
      'Controle rigoroso no retorno: a fase excêntrica com cabo constrói enorme dano miofibrilar.'
    ],
    [
      'Crossover na Polia Baixa',
      'Cabo',
      'Polias na base puxadas para cima, excelente para esculpir a porção clavicular e miolo superior.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior',
      'Polias na posição mais baixa. Segure as manoplas com as palmas voltadas para cima (pegada supinada).',
      'Puxe os cabos para cima e para a frente até a altura do queixo, aproximando os punhos.',
      'Mantenha o tronco estável sem balançar o quadril para criar impulso.'
    ],
    [
      'Flexão de Braço',
      'Peso Corporal',
      'Exercício funcional calistênico clássico para força geral de empurrar, peito e estabilização de core.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Tríceps Braquial, Deltoide Anterior, Core',
      'Mãos no chão um pouco além da largura dos ombros. Corpo em prancha firme da cabeça aos calcanhares.',
      'Desça até o peito quase tocar o chão mantendo cotovelos a 45 graus. Empurre o chão com força total.',
      'Não deixe o quadril cair ou a lombar arquear; mantenha glúteos e abdômen contraídos.'
    ],
    [
      'Flexão Declinada (Pés Elevados)',
      'Peso Corporal',
      'Pés apoiados em banco elevando o ângulo e sobrecarregando o feixe superior do peito.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Superior)',
      'Deltoide Anterior, Tríceps Braquial',
      'Pés apoiados sobre um banco ou caixa e mãos apoiadas no solo.',
      'Flexione os cotovelos descendo o peito até próximo ao chão e retorne estendendo os braços.',
      'Quanto mais alto o banco, maior a transferência de carga para o peitoral clavicular e ombros.'
    ],
    [
      'Paralelas (Foco Peitoral)',
      'Peso Corporal',
      'Um dos melhores exercícios compostos de peso corporal para a porção inferior e largura do peitoral.',
      'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior (Inferior)',
      'Tríceps Braquial, Deltoide Anterior',
      'Suspenda o corpo nas barras paralelas. Incline o tronco para a frente em aproximadamente 30 graus e abra levemente os cotovelos.',
      'Desça flexionando os braços até os ombros atingirem 90 graus. Empurre para cima contraindo a parte inferior do peito.',
      'Se o tronco ficar reto vertical, o foco muda para o tríceps. Mantenha a inclinação para a frente para focar no peito.'
    ],
    [
      'Pullover com Halter',
      'Halteres',
      'Expansão da caixa torácica e ativação combinada de peitoral maior, serrátil e grande dorsal.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Peitoral Maior',
      'Serrátil Anterior, Grande Dorsal, Tríceps (Cabeça Longa)',
      'Deite transversalmente com as costas apoiadas no banco, quadril um pouco mais baixo que o tórax. Segure o halter com as duas mãos em formato de diamante.',
      'Desça o halter em arco atrás da cabeça sentindo a caixa torácica e o peitoral expandirem. Puxe de volta até a linha dos olhos.',
      'Mantenha os cotovelos com leve flexão constante e controle absoluto na descida para proteger os ombros.'
    ]
  ]],
  ['Costas', [
    [
      'Puxada Frontal na Polia',
      'Cabo',
      'O movimento fundamental de puxada vertical para construção da largura e formato em V (grande dorsal).',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal (Latíssimo)',
      'Bíceps Braquial, Redondo Maior, Romboides',
      'Ajuste o apoio das pernas para travar bem os joelhos. Pegada na barra aberta (cerca de 1.5x a largura dos ombros). Peito estufado.',
      'Inicie puxando as escápulas para baixo (depressão escapular) e traga a barra em direção à clavícula/peito superior, direcionando os cotovelos para baixo e para trás.',
      'Não jogue o tronco excessivamente para trás; mantenha uma leve inclinação de 10-15 graus e sinta a dorsal puxar.'
    ],
    [
      'Puxada Triângulo na Polia',
      'Cabo',
      'Pegada neutra e fechada com grande conforto articular nos punhos e forte ativação da parte central das costas.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal',
      'Romboides, Bíceps Braquial, Trapézio Médio',
      'Engate o triângulo no cabo alto. Sente-se com as pernas firmes e peito ereto.',
      'Puxe o triângulo até encostar suavemente no peito superior, esmagando as escápulas uma contra a outra.',
      'A pegada neutra permite maior amplitude de alongamento dorsal na volta do peso.'
    ],
    [
      'Puxada Supinada',
      'Cabo',
      'Pegada com palmas viradas para o rosto que recruta fortemente as fibras inferiores do latíssimo e bíceps.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal (Inferior)',
      'Bíceps Braquial, Braquial',
      'Segure na barra na largura dos ombros com pegada supinada (palmas para você).',
      'Puxe a barra para baixo rente ao peito trazendo os cotovelos colados ao corpo.',
      'Excelente variação para progredir carga pesada com alavanca mecânica favorável.'
    ],
    [
      'Barra Fixa (Pronada / Supinada)',
      'Peso Corporal',
      'O padrão ouro absoluto da calistenia para força funcional e amplitude dorsal.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal',
      'Bíceps, Romboides, Antebraço, Core',
      'Pendure-se na barra com pegada pronada um pouco além dos ombros. Corpo alinhado e core tenso.',
      'Puxe o corpo para cima até o queixo ultrapassar a linha da barra, esmagando a dorsal. Desça de forma controlada até a extensão quase total dos braços.',
      'Evite o impulso com as pernas (kipping). Mantenha as pernas esticadas ou cruzadas sem balanço.'
    ],
    [
      'Remada Curvada com Barra',
      'Barra',
      'O exercício rei para espessura e densidade de toda a região dorsal e eretores da espinha.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal, Trapézio Médio',
      'Romboides, Deltoide Posterior, Bíceps, Lombar',
      'Em pé, pés na largura do quadril, segure a barra com pegada pronada. Incline o tronco para a frente a 45 graus, coluna perfeitamente neutra e joelhos levemente flexionados.',
      'Puxe a barra em direção ao umbigo mantendo os cotovelos próximos às costelas. Aperte as escápulas no topo por 1 segundo e desça controlando.',
      'Mantenha a curvatura natural da coluna; nunca curve a lombar em corcunda (cifose) sob carga.'
    ],
    [
      'Remada Curvada com Halteres',
      'Halteres',
      'Trajetória livre para cada braço, permitindo máxima contração unilateral e sem sobrecarga excessiva na lombar.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal',
      'Romboides, Trapézio, Bíceps',
      'Incline o tronco com um halter em cada mão com pegada neutra ou pronada.',
      'Puxe os halteres em direção ao quadril, mantendo os cotovelos elevados e escápulas aduzidas.',
      'A pegada neutra com halteres alivia o estresse nos punhos e ativa muito o centro das costas.'
    ],
    [
      'Remada Baixa na Polia (Sentado)',
      'Cabo',
      'Tensão linear contínua sem impacto axial na coluna, ideal para construção da espessura do meio das costas.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Romboides, Grande Dorsal',
      'Trapézio Médio/Inferior, Bíceps',
      'Sente no banco com os pés apoiados nas plataformas e joelhos levemente flexionados. Segure o triângulo com coluna reta.',
      'Puxe o triângulo contra o abdômen projetando o peito para frente e retraindo as escápulas. Retorne estendendo os braços sem dobrar o tronco.',
      'Não balance o tronco para a frente e para trás para usar embalo; o tronco deve permanecer estável.'
    ],
    [
      'Remada Unilateral com Halter (Serrote)',
      'Halteres',
      'Excelente amplitude de movimento e isolamento muscular independente para cada lado das costas.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal',
      'Romboides, Deltoide Posterior, Bíceps',
      'Apoie o joelho e a mão do mesmo lado em um banco plano. A outra perna fica no chão para equilíbrio. Costas retas e paralelas ao solo.',
      'Segure o halter com o braço estendido. Puxe o halter em direção ao quadril em uma trajetória em arco, subindo o cotovelo além do tronco.',
      'Pense em puxar com o cotovelo e não com a mão, para desligar a ativação excessiva do bíceps.'
    ],
    [
      'Remada Cavalinho (Barra T)',
      'Barra',
      'Exercício de espessura pesada muito cultuado no fisiculturismo para costas densas e trapézios médios.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal, Trapézio Médio/Inferior',
      'Romboides, Bíceps, Eretores da Espinha',
      'Fique sobre a barra T com as pernas afastadas. Segure a manopla de pegada neutra ou feixe cruzado com coluna ereta a 45 graus.',
      'Puxe o peso contra o peito/abdômen superior apertando as escápulas. Desça estendendo os braços mantendo a lombar travada.',
      'Utilize anilhas de diâmetro menor (ex: 10kg ou 15kg) para obter maior amplitude de puxada sem a anilha bater no peito antes do tempo.'
    ],
    [
      'Remada Articulada na Máquina',
      'Máquina',
      'Apoio frontal no tórax elimina a carga na lombar e permite focar 100% no esgotamento da musculatura dorsal.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal, Romboides',
      'Trapézio, Bíceps',
      'Ajuste o assento para que o peito fique bem apoiado na almofada frontal e as mãos alcancem as manoplas.',
      'Puxe as manoplas para trás aproximando as escápulas. Segure 1 segundo no pico de contração e retorne controlado.',
      'Excelente máquina para séries de drop-set e técnicas de pausa de descanso (rest-pause).'
    ],
    [
      'Levantamento Terra',
      'Barra',
      'O movimento composto soberano para força total, densidade dorsal, glúteos e cadeia posterior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Eretores da Espinha, Glúteos, Isquiotibiais',
      'Grande Dorsal, Trapézio, Antebraços, Quadríceps',
      'Barra sobre o meio dos pés (a cerca de 2-3 cm da canela). Pés na largura do quadril. Desça flexionando o quadril e joelhos para segurar a barra.',
      'Acione a dorsal ("quebre a barra com as mãos"), encha o abdômen de ar (manobra de Valsalva) e empurre o chão com os pés até ficar em pé ereto.',
      'A barra deve subir e descer raspando as canelas e coxas em linha reta vertical.'
    ],
    [
      'Pulldown com Braços Estendidos',
      'Cabo',
      'Isolamento puro da grande dorsal sem participação do bíceps, ideal para pré ou pós-exaustão.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal',
      'Redondo Maior, Tríceps (Cabeça Longa), Abdômen',
      'Fique em pé de frente para a polia alta segurando a barra reta ou corda com braços quase estendidos (leve flexão de cotovelos).',
      'Empurre a barra para baixo em um arco até encostar nas coxas, ativando intensamente a dorsal.',
      'Mantenha o core rígido para não curvar o tronco durante a descida do cabo.'
    ],
    [
      'Meio Terra (Rack Pull)',
      'Barra',
      'Variação do terra partindo da altura dos joelhos com ênfase brutal em trapézio, eretores e densidade alta.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Trapézio, Eretores da Espinha',
      'Grande Dorsal, Glúteos',
      'Ajuste os suportes do rack com a barra na altura logo abaixo dos joelhos.',
      'Puxe estendendo o quadril e projetando o peito para a frente com travamento de glúteos no topo.',
      'Permite sobrecarga de peso mais elevada com segurança para a lombar inferior.'
    ],
    [
      'Hiperextensão Lombar (Banco Romano)',
      'Peso Corporal',
      'Fortalecimento essencial da cadeia posterior profunda, prevenindo lesões e dores lombares na academia.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Eretores da Espinha',
      'Glúteo Máximo, Isquiotibiais',
      'Ajuste a almofada do banco romano logo abaixo da crista ilíaca para permitir flexão livre do quadril.',
      'Desça o tronco flexionando o quadril e suba até o alinhamento com as pernas, contraindo glúteos e lombar.',
      'Não faça hiperextensão excessiva curvando a coluna para trás no topo; pare no alinhamento neutro.'
    ],
    [
      'Puxada Unilateral na Polia',
      'Cabo',
      'Variação unilateral da puxada alta que permite alinhar perfeitamente o cabo com as fibras do grande dorsal.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal (Latíssimo)',
      'Bíceps Braquial, Redondo Maior, Antebraço',
      'Ajuste o puxador individual na polia alta. Sente-se de lado ou de frente com o joelho travado no apoio. Segure o puxador com pegada neutra ou semi-supinada.',
      'Puxe trazendo o cotovelo em direção ao quadril, mantendo o braço próximo à lateral do tronco. Concentre-se em esmagar a dorsal no ponto mais baixo antes de subir com controle.',
      'A rotação natural do punho durante a puxada alivia a tensão no cotovelo e recruta com máxima eficácia a inserção inferior do latíssimo.'
    ],
    [
      'Barra Fixa com Pegada Neutra',
      'Peso Corporal',
      'Pegada neutra (palmas voltadas uma para a outra), proporcionando a posição biomecanicamente mais segura para os ombros e cotovelos.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal (Latíssimo)',
      'Braquial, Bíceps Braquial, Trapézio Médio/Inferior',
      'Segure as barras paralelas de pegada neutra. Pés cruzados atrás, core travado, peito aberto.',
      'Puxe seu corpo para cima liderando com o esterno em direção às pegadas até que o queixo passe da barra. Desça controlando o movimento sem soltar os ombros bruscamente.',
      'Excelente opção para quem sente dor nos ombros com a barra fixa tradicional pronada.'
    ],
    [
      'Remada Curvada Supinada com Barra',
      'Barra',
      'Popularizada por Dorian Yates, a pegada supinada foca intensamente na porção inferior do grande dorsal e aumenta o recrutamento dos bíceps.',
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=700&q=80',
      'Grande Dorsal (Porção Inferior)',
      'Bíceps Braquial, Trapézio Médio, Romboides, Eretor da Espinha',
      'Segure a barra com as palmas voltadas para a frente (supinada), na largura dos ombros. Incline o tronco a cerca de 45 a 70 graus, mantendo a lombar travada.',
      'Puxe a barra em direção ao umbigo / quadril mantendo os cotovelos colados ao corpo. Pause 1 segundo no topo comprimindo a musculatura dorsal.',
      'Não arredonde a coluna em nenhuma hipótese. Mantenha os joelhos levemente flexionados para estabilizar o quadril.'
    ],
    [
      'Remada Baixa com Barra Reta',
      'Cabo',
      'Variação de remada sentada na polia com pegada aberta que enfatiza a porção média e superior das costas e trapézio.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Trapézio Médio e Romboides',
      'Grande Dorsal, Deltoide Posterior, Bíceps',
      'Prenda a barra reta na polia baixa. Sente-se com as pernas levemente flexionadas e o tronco na vertical. Segure a barra na largura dos ombros com pegada pronada.',
      'Puxe a barra em direção ao meio do abdômen, abrindo os cotovelos a 45 graus e aduzindo fortemente as escápulas.',
      'Evite inclinar o tronco excessivamente para trás. O movimento deve vir das escápulas e cotovelos.'
    ],
    [
      'Remada Invertida (Australian Pull-up)',
      'Peso Corporal',
      'Exercício com peso corporal realizado em barra baixa ou Smith, fantástico para ativação interescapular e controle postural.',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
      'Romboides e Trapézio Médio',
      'Grande Dorsal, Deltoide Posterior, Bíceps, Core',
      'Posicione a barra do Smith na altura do quadril. Deite por baixo, segurando a barra com pegada pronada. Mantenha o corpo reto em prancha, calcanhares no chão.',
      'Puxe o peito em direção à barra mantendo o corpo rígido. Aperte as escápulas no topo e desça controladamente.',
      'Para aumentar a dificuldade, eleve os pés sobre um banco.'
    ],
    [
      'Levantamento Terra Sumô',
      'Barra',
      'Variação com base ampla que mantém o tronco mais vertical, reduzindo a sobrecarga na coluna lombar e recrutando glúteos e adutores.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Glúteo Máximo e Adutores',
      'Eretores da Espinha, Isquiotibiais, Quadríceps, Trapézio',
      'Pés bem afastados (base larga), pontas dos pés voltadas para fora a 45 graus. Mãos segurando a barra por dentro das pernas, tronco ereto.',
      'Empurre o chão com os calcanhares estendendo quadril e joelhos simultaneamente. Mantenha a barra colada nas canelas e coxas até a extensão completa.',
      'Mantenha os joelhos abertos na mesma direção dos pés durante toda a subida.'
    ],
    [
      'Crucifixo Inverso na Polia (Crossover Alto Invertido)',
      'Cabo',
      'Isolamento contínuo para deltoide posterior e romboides sem o ponto morto existente nos halteres.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Posterior',
      'Romboides, Trapézio Médio, Redondo Menor',
      'Cabos na altura da cabeça. Segure o cabo esquerdo com a mão direita e o cabo direito com a mão esquerda (cabos cruzados na frente do rosto), sem manoplas.',
      'Puxe os cabos abrindo os braços para fora e para trás em um arco horizontal na altura dos ombros. Segure 1 segundo na contração máxima.',
      'Não use impulso do tronco. Mantenha os cotovelos levemente flexionados em ângulo constante.'
    ],
    [
      'Encolhimento no Smith',
      'Smith',
      'Permite sobrecarga máxima e trajetória guiada para o trapézio superior com total segurança.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Trapézio Superior',
      'Levantador da Escápula, Antebraço',
      'Posicione a barra do Smith na altura do meio da coxa. Fique em pé segurando a barra na largura dos ombros.',
      'Eleve os ombros diretamente para cima em direção às orelhas o mais alto possível. Pause 2 segundos no topo e desça controladamente.',
      'Nunca faça movimentos circulares com os ombros para não desgastar a articulação gleno-umeral.'
    ]
  ]],
  ['Pernas', [
    [
      'Agachamento Livre com Barra',
      'Barra',
      'O exercício rei do desenvolvimento de pernas, hipertrofia de quadríceps, glúteos e potência funcional.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps, Glúteo Máximo',
      'Adutores, Isquiotibiais, Core, Panturrilhas',
      'Barra apoiada firmemente sobre os trapézios (low ou high bar). Pés na largura dos ombros, pontas levemente voltadas para fora (15 a 30 graus). Core contraído.',
      'Desça empurrando os joelhos na direção da ponta dos pés e jogando o quadril para trás e para baixo até romper a linha paralela de 90 graus. Suba empurrando o chão.',
      'Mantenha o peito aberto e nunca deixe os joelhos colapsarem para dentro (valgo dinâmico) na subida.'
    ],
    [
      'Agachamento no Smith',
      'Smith',
      'Estabilidade nos trilhos que permite posicionar os pés mais à frente para isolamento cirúrgico de quadríceps.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps, Glúteos',
      'Adutores',
      'Barra nas costas, pés posicionados cerca de 15-20 cm à frente da linha da barra.',
      'Desça mantendo o tronco mais vertical, flexionando os joelhos profundamente. Suba estendendo com força.',
      'Permite agachamento profundo sem sobrecarregar a lombar, excelente para focar no vasto medial.'
    ],
    [
      'Agachamento Frontal com Barra',
      'Barra',
      'Barra apoiada à frente dos deltoides, impondo postura ereta e ênfase máxima nos feixes do quadríceps.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps',
      'Glúteos, Core, Eretores Torácicos',
      'Barra apoiada na frente dos ombros com pegada olímpica ou braços cruzados. Cotovelos bem altos apontando para a frente.',
      'Desça na vertical mantendo os cotovelos elevados para a barra não rolar. Agache até abaixo do paralelo e suba.',
      'Se os cotovelos caírem, a barra escorregará para a frente. Mantenha os cotovelos o tempo todo paralelos ao chão.'
    ],
    [
      'Agachamento Búlgaro',
      'Halteres',
      'O exercício unilateral mais desafiador e eficiente para quadríceps, glúteos e correção de assimetrias.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps, Glúteo Máximo',
      'Isquiotibiais, Adutores, Core',
      'Em pé com um pé apoiado atrás em um banco na altura do joelho. O pé da frente fica posicionado cerca de 1 metro à frente.',
      'Desça na vertical até o joelho de trás quase encostar no chão e a coxa da frente ficar paralela ao solo. Empurre com o calcanhar da frente.',
      'Incline o tronco levemente para a frente para transferir o estímulo máximo para o glúteo e quadríceps.'
    ],
    [
      'Leg Press 45°',
      'Máquina',
      'Permite trabalhar com altas tonelagens de carga com suporte total nas costas e segurança biomecânica.',
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=700&q=80',
      'Quadríceps, Glúteo Máximo',
      'Isquiotibiais, Adutores',
      'Sente no aparelho com as costas e lombar perfeitamente apoiadas no encosto. Pés na plataforma na largura dos ombros.',
      'Destrave a máquina e desça a plataforma até as pernas formarem um ângulo de 90 graus ou mais. Empurre sem travar os joelhos no final.',
      'Jamais permita que a lombar descole do encosto na descida para não comprimir os discos vertebrais.'
    ],
    [
      'Hack Squat na Máquina',
      'Máquina',
      'Plataforma inclinada com encosto dorsal que isola intensamente o quadríceps com segurança lombar.',
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=700&q=80',
      'Quadríceps (Vasto Lateral/Medial)',
      'Glúteos',
      'Apoie os ombros nas almofadas superiores e as costas no encosto. Pés no meio da plataforma.',
      'Destrave e desça controlando o peso até flexão profunda dos joelhos. Empurre o piso da máquina.',
      'Pés mais baixos na plataforma aumentam o foco em quadríceps; pés mais altos enfatizam glúteos.'
    ],
    [
      'Cadeira Extensora',
      'Máquina',
      'Isolamento puro e direto do músculo reto femoral e vastos do quadríceps na posição encurtada.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Quadríceps (Reto Femoral)',
      'Vasto Lateral, Vasto Medial',
      'Ajuste o encosto para que o eixo da máquina coincida com a linha dos joelhos. Rolete apoiado sobre os tornozelos.',
      'Estenda os joelhos até a contração máxima no topo. Segure por 1 segundo sentindo o quadríceps arder e desça devagar.',
      'Não dê tranco com o peso no início do movimento. O controle na descida evita impacto articular patelar.'
    ],
    [
      'Mesa Flexora',
      'Máquina',
      'Exercício isolador fundamental para os posteriores de coxa (isquiotibiais) na posição deitada.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Isquiotibiais (Posterior de Coxa)',
      'Gastrocnêmio (Panturrilha)',
      'Deite de bruços com o rolete apoiado logo acima dos calcanhares. Segure as manoplas para travar o quadril no banco.',
      'Flexione os joelhos puxando os calcanhares em direção aos glúteos. Segure 1 segundo na contração máxima e retorne controlando.',
      'Não levante o quadril do banco durante a puxada; mantenha a bacia colada no estofado.'
    ],
    [
      'Cadeira Flexora',
      'Máquina',
      'Posteriores de coxa com o quadril fletido, proporcionando maior estiramento prévio e hipertrofia superior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Isquiotibiais',
      'Gastrocnêmio',
      'Sente no aparelho com o rolete superior travando as coxas e o rolete inferior apoiado na parte de trás dos tornozelos.',
      'Pressione os calcanhares para baixo e para trás flexionando os joelhos. Retorne controlando o peso.',
      'Estudos científicos comprovam que a cadeira flexora gera hipertrofia superior à mesa flexora devido ao comprimento muscular.'
    ],
    [
      'Stiff com Barra / Halteres',
      'Barra',
      'Alongamento sob tensão para posteriores de coxa e glúteos com dobradiça de quadril perfeita.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Isquiotibiais, Glúteo Máximo',
      'Eretores da Espinha',
      'Em pé, pés na largura do quadril, segure a barra rente às coxas. Joelhos semi-flexionados e travados nessa posição.',
      'Jogue o quadril para trás mantendo a coluna completamente neutra enquanto a barra desce rente às pernas até sentir estiramento posterior.',
      'O movimento é de quadril (dobradiça / hip hinge), e não de agachamento dos joelhos.'
    ],
    [
      'Levantamento Terra Romeno (RDL)',
      'Barra',
      'Foco exclusivo na cadeia posterior com saída a partir do topo e descida até abaixo do joelho.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Isquiotibiais, Glúteos',
      'Lombar, Trapézio',
      'Inicie em pé com a barra nas mãos. Peito estufado e escápulas travadas.',
      'Desça empurrando o bumbum para a parede de trás, barra raspando a coxa até a metade da canela. Retorne contraindo os glúteos.',
      'Contraia os glúteos no topo sem empurrar a pelve para a frente de forma exagerada.'
    ],
    [
      'Elevação Pélvica com Barra',
      'Barra',
      'O exercício supremo para construção e sobrecarga progressiva de volume no glúteo máximo.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Glúteo Máximo',
      'Isquiotibiais, Core',
      'Apoie a parte superior das costas em um banco plano. Barra acolchoada sobre o quadril. Pés no chão alinhados com os joelhos.',
      'Empurre os calcanhares contra o chão elevando o quadril até alinhar as coxas com o tronco. Esmague os glúteos no topo por 1 segundo.',
      'Mantenha o queixo apontado para o peito durante a subida para não estressar a cervical.'
    ],
    [
      'Elevação Pélvica na Máquina',
      'Máquina',
      'Praticidade e conforto com cinto acolchoado para executar elevação pélvica sem incômodo na barra.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Glúteo Máximo',
      'Isquiotibiais',
      'Ajuste o cinto e apoie os pés na plataforma na largura do quadril.',
      'Destrave a alavanca e eleve o quadril até a contração máxima no topo. Retorne controlando.',
      'Ideal para aplicar drop-sets e séries de alta repetição sem perder tempo montando pesos na barra.'
    ],
    [
      'Afundo (Passada)',
      'Halteres',
      'Passadas dinâmicas para pernas completas com grande solicitação de equilíbrio e propriocepção.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps, Glúteos',
      'Isquiotibiais, Panturrilhas',
      'Com um halter em cada mão, dê um passo largo à frente.',
      'Afunde o joelho de trás até quase encostar no chão, mantendo o joelho da frente a 90 graus. Dê o próximo passo.',
      'Não deixe o joelho da frente avançar excessivamente além da ponta dos pés.'
    ],
    [
      'Cadeira Abdutora',
      'Máquina',
      'Isolamento e estabilidade pélvica lateral com foco no glúteo médio e mínimo.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Glúteo Médio, Glúteo Mínimo',
      'Tensor da Fáscia Lata',
      'Sente com as costas apoiadas e os joelhos contra as almofadas externas da máquina.',
      'Abra as pernas com força lateral até o limite de amplitude. Segure 1 segundo aberto e feche devagar.',
      'Inclinar o tronco levemente para frente sentado ativa ainda mais as fibras superiores do glúteo.'
    ],
    [
      'Cadeira Adutora',
      'Máquina',
      'Fortalecimento da musculatura interna das coxas para equilíbrio de força e estética da perna.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Adutores da Coxa',
      'Grácil, Pectíneo',
      'Sente com as pernas abertas e almofadas no lado interno dos joelhos.',
      'Feche as pernas unindo as almofadas no centro com contração controlada. Retorne abrindo até alongar.',
      'Essencial para prevenção de lesões na virilha e estabilidade nos agachamentos pesados.'
    ],
    [
      'Panturrilha em Pé na Máquina',
      'Máquina',
      'Máxima sobrecarga com joelhos estendidos para hipertrofia do músculo gastrocnêmio.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Gastrocnêmio (Panturrilha)',
      'Sóleo',
      'Apoie a ponta dos pés na borda da plataforma e as almofadas sobre os ombros. Joelhos quase retos.',
      'Desça os calcanhares ao máximo sentindo o tendão de Aquiles esticar. Suba na ponta dos pés esmagando a panturrilha no topo.',
      'Segure 2 segundos no topo e 2 segundos no fundo de cada repetição para eliminar o efeito elástico do tendão.'
    ],
    [
      'Panturrilha Sentado (Gêmeos)',
      'Máquina',
      'Com os joelhos flexionados a 90 graus, o gastrocnêmio relaxa e o foco vai 100% para o músculo sóleo.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Sóleo (Panturrilha Profunda)',
      'Gastrocnêmio',
      'Sente com as almofadas sobre as coxas e pontas dos pés no suporte.',
      'Desça os calcanhares e eleve na ponta dos pés com movimento completo.',
      'O músculo sóleo confere largura e volume lateral à panturrilha vista de frente.'
    ],
    [
      'Panturrilha no Leg Press 45°',
      'Máquina',
      'Exercício de excelente estabilidade para flexão plantar pesada sem compressão na coluna vertebral.',
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=700&q=80',
      'Gastrocnêmio, Sóleo',
      'Tibial',
      'Ponta dos pés na borda inferior da plataforma do Leg Press, joelhos semi-estendidos com trava de segurança engatada.',
      'Flexione os tornozelos empurrando a plataforma com as pontas dos pés. Desça controlando o alongamento.',
      'Mantenha sempre os joelhos levemente destravados para segurança articular.'
    ],
    [
      'Agachamento Goblet com Halter',
      'Halteres',
      'Excelente para aprender e aprimorar o padrão de agachamento profundo mantendo o tronco ereto e o core ativo.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Quadríceps e Glúteos',
      'Core, Adutores, Ombros, Bíceps',
      'Segure um halter verticalmente junto ao peito com ambas as mãos apoiadas sob o prato superior. Pés na largura dos ombros, pontas levemente abertas.',
      'Agache empurrando os joelhos para fora até que os cotovelos passem por dentro dos joelhos. Mantenha o peito alto e suba empurrando pelo meio do pé.',
      'Perfeito para aquecimento articular de membros inferiores ou como exercício principal de hipertrofia com foco em amplitude total.'
    ],
    [
      'Agachamento Sumô com Halter',
      'Halteres',
      'Foco nos adutores da coxa e porção inferior dos glúteos com sobrecarga segura em halter único.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Glúteo Máximo e Adutores',
      'Quadríceps, Isquiotibiais, Core',
      'Em pé sobre dois steps ou no solo, pés bem afastados com pontas a 45 graus para fora. Segure um halter pesado suspenso entre as pernas.',
      'Agache profundamente projetando o quadril para baixo e joelhos para fora. Contraia fortemente os glúteos ao retornar à posição ereta.',
      'Mantenha a coluna estritamente ereta para direcionar 100% da carga para os membros inferiores.'
    ],
    [
      'Agachamento Sissy',
      'Peso Corporal',
      'Isolamento extremo do reto femoral e vastos do quadríceps na posição de máximo estiramento.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Quadríceps (Reto Femoral)',
      'Core, Flexores de Quadril',
      'Em pé segurando em uma estrutura estável ou banco sissy específico. Fique na ponta dos pés com o corpo em linha reta dos joelhos aos ombros.',
      'Flexione os joelhos projetando-os para a frente enquanto o tronco se inclina para trás até sentir alongamento absurdo no quadríceps. Empurre de volta.',
      'Avance progressivamente na amplitude conforme sua mobilidade de joelhos e força nos tendões evoluírem.'
    ],
    [
      'Leg Press Horizontal',
      'Máquina',
      'Movimento linear no plano horizontal que permite distribuição equilibrada da força e excelente ativação de quadríceps sem compressão axial.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Quadríceps',
      'Glúteo Máximo, Isquiotibiais',
      'Ajuste o assento para que os joelhos fiquem a 90 graus na posição inicial. Apoie as costas firmemente no encosto e posicione os pés no meio da placa.',
      'Empurre a plataforma até quase estender os joelhos (sem hiperextender). Retorne lentamente controlando a descida.',
      'Mantenha a pelve sempre colada no banco, sem levantar o quadril na reversão do movimento.'
    ],
    [
      'Flexora Unilateral em Pé',
      'Máquina',
      'Permite trabalhar cada perna individualmente, corrigindo desequilíbrios de força e volume nos isquiotibiais.',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
      'Isquiotibiais (Posterior de Coxa)',
      'Gastrocnêmio, Glúteo',
      'Apoie o peito ou quadril na almofada da máquina. Ajuste o rolo de apoio atrás do calcanhar da perna ativa.',
      'Flexione o joelho puxando o calcanhar até a contração máxima perto dos glúteos. Segure 1 segundo e desça com controle.',
      'Mantenha o quadril pressionado contra a almofada para evitar compensação na coluna lombar.'
    ],
    [
      'Afundo Búlgaro no Smith',
      'Smith',
      'Variação do agachamento búlgaro com a barra guiada do Smith, permitindo focar 100% na força de perna sem preocupação com equilíbrio.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Glúteo e Quadríceps',
      'Adutores, Isquiotibiais',
      'Coloque um banco atrás da barra do Smith. Apoie o peito de um pé no banco e posicione o outro pé à frente. A barra do Smith repousa sobre o trapézio.',
      'Destrave a barra e agache verticalmente até o joelho de trás quase tocar o solo. Suba empurrando pelo calcanhar dianteiro.',
      'Incline o tronco levemente para a frente para enfatizar os glúteos ou mantenha-o ereto para enfatizar os quadríceps.'
    ],
    [
      'Panturrilha no Smith',
      'Smith',
      'Elevação de calcanhares com barra guiada sobre um degrau ou step, possibilitando cargas elevadas com estabilidade total.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Gastrocnêmio (Panturrilha)',
      'Sóleo, Tendão de Aquiles',
      'Coloque um bloco ou step sob a barra do Smith. Posicione as pontas dos pés no degrau e a barra apoiada nos trapézios. Destrave a barra.',
      'Desça os calcanhares até sentir o alongamento máximo na panturrilha. Suba na ponta dos pés o mais alto possível, segurando 1 segundo no pico.',
      'Mantenha os joelhos praticamente estendidos (com microflexão de segurança) para focar na porção do gastrocnêmio.'
    ],
    [
      'Panturrilha Unilateral em Degrau',
      'Peso Corporal',
      'Exercício com foco em amplitude completa e isolamento unívoco de cada panturrilha, utilizando apenas o peso corporal ou um halter de apoio.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Gastrocnêmio e Sóleo',
      'Tibial Posterior',
      'Apoie a ponta de um pé na borda de um degrau ou bloco. Segure uma parede ou corrimão levemente para equilíbrio.',
      'Desça o calcanhar abaixo da linha do degrau em alongamento total. Empurre com a bola do pé subindo o máximo possível.',
      'Faça pausas de 2 segundos tanto no ponto mais baixo quanto no ponto mais alto para anular a energia elástica do tendão.'
    ]
  ]],
  ['Ombros', [
    [
      'Desenvolvimento Militar com Barra',
      'Barra',
      'O clássico construtor de ombros largos, potência nos deltoides anteriores e força geral acima da cabeça.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Deltoide Lateral, Tríceps, Trapézio Superior, Core',
      'Em pé, pés na largura dos ombros. Barra apoiada na clavícula, pegada na largura dos ombros com cotovelos à frente da barra.',
      'Empurre a barra verticalmente acima da cabeça, passando o rosto para frente no topo com extensão completa dos braços. Desça controlando.',
      'Mantenha glúteos e abdômen contraídos para não arquear a coluna lombar para trás.'
    ],
    [
      'Desenvolvimento com Halteres',
      'Halteres',
      'Grande liberdade articular para trabalhar ombros cheios e redondos no banco com apoio lombar.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior, Deltoide Lateral',
      'Tríceps Braquial, Trapézio',
      'Banco regulado a 75-80 graus (quase 90°). Halteres na altura das orelhas com cotovelos apontados para frente a 45 graus.',
      'Empurre os halteres para cima aproximando-os no topo sem bater. Desça até a altura das orelhas.',
      'Não abra os cotovelos totalmente a 90 graus para evitar impacto mecânico contra o acrômio.'
    ],
    [
      'Desenvolvimento Arnold',
      'Halteres',
      'Criado por Arnold Schwarzenegger: rotação de punhos que ativa todas as três cabeças do deltoide.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior, Deltoide Lateral',
      'Tríceps Braquial',
      'Inicie com os halteres na frente do peito com palmas voltadas para o seu rosto (pegada supinada).',
      'Empurre os halteres enquanto gira os punhos para fora, finalizando com as palmas voltadas para a frente no topo.',
      'Faça o movimento suave e contínuo durante a rotação.'
    ],
    [
      'Desenvolvimento na Máquina',
      'Máquina',
      'Trajetória fixa ideal para treinar com segurança até a falha muscular concêntrica e fazer drop-sets.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Tríceps Braquial',
      'Ajuste o assento para que as manoplas fiquem na altura do queixo/ombros.',
      'Empurre as manoplas verticalmente estendendo os braços e desça controlando.',
      'Ótimo para dias de carga pesada sem risco de desequilíbrio.'
    ],
    [
      'Elevação Lateral com Halteres',
      'Halteres',
      'O exercício número um para criar largura de ombros e o cobiçado aspecto físico em V.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral',
      'Trapézio Superior, Deltoide Anterior',
      'Em pé, pés paralelos, tronco levemente inclinado para a frente (5-10 graus). Halteres nas laterais com leve flexão de cotovelos.',
      'Eleve os braços em arco lateral até a altura dos ombros, direcionando pelos cotovelos. Desça controlando por 2 segundos.',
      'Pense em derramar uma jarra de água com o dedo mínimo levemente mais alto que o polegar para isolar o deltoide lateral.'
    ],
    [
      'Elevação Lateral na Polia',
      'Cabo',
      'Tensão contínua desde o primeiro milímetro de movimento, sem o ponto morto dos halteres.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral',
      'Trapézio',
      'Ajuste a polia na altura do joelho ou base. Cabo passando por trás ou pela frente do corpo.',
      'Eleve o braço lateralmente até a linha do ombro mantendo o cotovelo apontado para cima.',
      'Passar o cabo por trás do corpo aumenta o estiramento inicial do deltoide lateral.'
    ],
    [
      'Elevação Lateral na Máquina',
      'Máquina',
      'Braços apoiados eliminam qualquer impulso dos punhos e antebraços, concentrando 100% no deltoide.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral',
      'Trapézio',
      'Sente com o peito apoiado ou ereto e cotovelos posicionados nas almofadas laterais.',
      'Eleve os braços lateralmente até a altura dos ombros. Segure 1 segundo no topo e desça lento.',
      'Excelente para aplicar técnicas como repetições parciais após a falha.'
    ],
    [
      'Elevação Frontal',
      'Halteres',
      'Foco isolado na porção anterior dos ombros para quem busca volume frontal e conexão com o peito.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Peitoral Superior',
      'Em pé com halteres apoiados na frente das coxas.',
      'Eleve os braços à frente até a altura dos olhos e desça controlando.',
      'Pode ser feito alternado ou bilateralmente, ou com anilha.'
    ],
    [
      'Crucifixo Inverso na Máquina',
      'Máquina',
      'O melhor exercício para a cabeça posterior do deltoide, prevenindo lesões e ombros projetados para a frente.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Deltoide Posterior',
      'Romboides, Trapézio Médio',
      'Sente virado para o encosto do Peck Deck com as manoplas na altura dos ombros.',
      'Abra os braços para trás em arco mantendo cotovelos levemente flexionados, esmagando a parte de trás do ombro.',
      'Não junte as escápulas em excesso no início; deixe o deltoide posterior puxar primeiro.'
    ],
    [
      'Crucifixo Inverso com Halteres',
      'Halteres',
      'Trabalho de deltoide posterior com tronco inclinado à frente em 90 graus.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Deltoide Posterior',
      'Romboides',
      'Incline o tronco para a frente quase paralelo ao chão, ou apoie o peito em um banco inclinado a 30 graus.',
      'Abra os halteres para os lados e para trás como asas. Desça controlando o peso.',
      'Apoiar o peito no banco inclinado elimina qualquer balanço corporal.'
    ],
    [
      'Face Pull na Polia',
      'Cabo',
      'Exercício crucial para saúde dos rotadores externos do ombro, postura ereta e deltoides posteriores.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Deltoide Posterior, Manguito Rotador',
      'Trapézio Superior e Médio, Romboides',
      'Prenda a corda na polia na altura dos olhos ou um pouco acima. Segure com pegada neutra ou pronada com polegares para trás.',
      'Puxe a corda em direção ao rosto, abrindo as pontas da corda para as laterais das orelhas com rotação externa dos ombros.',
      'Mantenha os cotovelos elevados e contraia os músculos entre as escápulas por 1 segundo.'
    ],
    [
      'Remada Alta com Barra / Polia',
      'Barra',
      'Ativação poderosa de deltoides laterais e trapézios superiores com puxada vertical.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral, Trapézio Superior',
      'Bíceps, Antebraços',
      'Pegada na largura dos ombros ou ligeiramente mais aberta.',
      'Puxe a barra para cima rente ao corpo até a linha do meio do peito, elevando os cotovelos acima da barra.',
      'Evite pegadas muito fechadas (polegares se tocando) para não pinçar o tendão supraespinhal no ombro.'
    ],
    [
      'Encolhimento com Barra (Trapézio)',
      'Barra',
      'Sobrecarga máxima para construção dos montes musculares do trapézio superior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Trapézio Superior',
      'Levantador da Escápula, Antebraços',
      'Segure a barra com pegada na largura dos ombros com braços esticados e peito estufado.',
      'Eleve os ombros diretamente para cima em direção às orelhas. Segure a contração máxima por 1 a 2 segundos e desça controlando.',
      'Nunca gire os ombros para trás ou para frente com carga pesada; o movimento deve ser estritamente vertical.'
    ],
    [
      'Encolhimento com Halteres',
      'Halteres',
      'Permite posicionar os braços ao lado do corpo, proporcionando alinhamento anatômico perfeito para o trapézio.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Trapézio Superior',
      'Antebraços',
      'Em pé segurando halteres pesados nas laterais das coxas.',
      'Encolha os ombros verticalmente na direção das orelhas sem dobrar os cotovelos.',
      'Excelente para séries com pegada firme e contração isométrica no topo.'
    ],
    [
      'Desenvolvimento Sentado com Barra',
      'Barra',
      'Exercício composto fundamental para construção de força e massa no deltoide anterior com apoio de banco a 85 graus.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Deltoide Lateral, Tríceps Braquial, Trapézio Superior',
      'Sente-se no banco quase vertical. Pegada na barra com as mãos um pouco além da largura dos ombros. Desça a barra até a altura do queixo/clavícula.',
      'Empurre a barra para cima em linha vertical até a extensão quase completa dos cotovelos. Mantenha os cotovelos ligeiramente à frente do plano do corpo.',
      'Não desça a barra atrás do pescoço; a descida frontal é muito mais anatômica e segura para o ombro.'
    ],
    [
      'Desenvolvimento no Smith',
      'Smith',
      'Permite atingir a falha muscular com máxima sobrecarga nos ombros sem necessidade de equilibrar a barra.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Tríceps Braquial, Deltoide Lateral',
      'Posicione o banco regulável sob o trilho da barra do Smith. Sente-se ereto e ajuste a altura para a barra descer na linha do queixo.',
      'Destrave a barra e desça de forma controlada até tocar de leve abaixo do queixo. Empurre com força para cima.',
      'Concentre-se em empurrar com a força dos deltoides, evitando abrir excessivamente os cotovelos para os lados.'
    ],
    [
      'Elevação Lateral Inclinada no Banco',
      'Halteres',
      'Deitado de lado em banco inclinado a 45 graus, elimina completamente o balanço do tronco e altera a curva de resistência da elevação lateral.',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral',
      'Supraespinhal, Trapézio Superior',
      'Deite de lado em um banco inclinado a 30-45 graus. Segure o halter com o braço de cima estendido para baixo.',
      'Eleve o halter lateralmente até a altura do ombro mantendo o cotovelo levemente flexionado. Desça de forma lenta e controlada.',
      'Nesta posição, o deltoide lateral já começa sob alta tensão logo no início do movimento.'
    ],
    [
      'Elevação Frontal na Polia com Corda',
      'Cabo',
      'Tensão contínua em todo o arco da elevação frontal proporcionada pelo cabo passando por entre as pernas.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Deltoide Anterior',
      'Peitoral Superior (Clavicular), Trapézio',
      'Prenda a corda na polia baixa. Fique de costas para a polia com o cabo passando por entre as pernas. Segure as pontas da corda com pegada neutra.',
      'Eleve os braços para a frente até a altura dos olhos. Segure 1 segundo no topo e retorne com velocidade controlada.',
      'Mantenha o tronco estável, sem jogar o quadril para frente para gerar embalo.'
    ],
    [
      'Remada Alta na Polia com Barra Reta',
      'Cabo',
      'Trabalha os deltoides laterais e o trapézio com tensão suave e contínua do cabo.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral e Trapézio',
      'Braquial, Bíceps, Deltoide Posterior',
      'Prenda a barra reta na polia baixa. Segure com as palmas voltadas para baixo na largura dos ombros.',
      'Puxe a barra para cima verticalmente até a altura do peito, liderando o movimento com os cotovelos sempre acima dos punhos.',
      'Utilize pegada um pouco mais aberta (largura dos ombros) para proteger a articulação do punho e focar nos deltoides.'
    ],
    [
      'Encolhimento Sentado com Halteres',
      'Halteres',
      'Sentado no banco, anula qualquer impulso dos membros inferiores e foca puramente no encolhimento escapular do trapézio.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Trapézio Superior',
      'Levantador da Escápula, Antebraço',
      'Sente-se na ponta do banco com os pés bem firmes no chão. Segure um par de halteres pesados ao lado do corpo com braços estendidos.',
      'Eleve os ombros diretamente para cima em direção às orelhas. Segure a contração de pico no topo por 2 segundos antes de descer.',
      'Excelente variação para quem tem facilidade de "roubar" usando o quadril ou joelhos na versão em pé.'
    ],
    [
      'Elevação Lateral Y na Polia',
      'Cabo',
      'Movimento diagonal em formato de Y que alinha perfeitamente a linha de ação da força com as fibras do deltoide lateral e trapézio inferior.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Deltoide Lateral',
      'Trapézio Inferior, Supraespinhal',
      'Cabos na altura do quadril ou joelho. Segure o cabo esquerdo com a mão direita e vice-versa. Fique no centro.',
      'Abra os braços para cima e para fora em formato de letra Y a cerca de 45 graus acima da horizontal.',
      'O ângulo em Y preserva o espaço subacromial, sendo muito mais confortável para praticantes com histórico de impacto no ombro.'
    ]
  ]],
  ['Braços', [
    [
      'Rosca Direta com Barra W',
      'Barra',
      'O exercício número um para volume do bíceps com angulação anatômica que protege os punhos.',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquial, Braquiorradial',
      'Em pé, pés na largura dos ombros, segure a barra W nas curvas com pegada supinada. Cotovelos colados às costelas.',
      'Flexione os cotovelos elevando a barra até o peito sem mover os ombros. Desça controlando por 2 a 3 segundos até estender quase totalmente.',
      'Não balance o tronco para trás criando embalo; se precisar jogar o corpo, reduza a carga.'
    ],
    [
      'Rosca Direta com Barra Reta',
      'Barra',
      'Supinação máxima durante todo o arco do movimento para estímulo concentrado da cabeça curta e longa do bíceps.',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquial',
      'Em pé com pegada supinada na barra reta na largura dos ombros.',
      'Erga a barra mantendo cotovelos fixos como pivô. Contraia o bíceps no topo e desça com controle.',
      'Se sentir dores no punho na barra reta, migre para a barra W.'
    ],
    [
      'Rosca Alternada com Halteres',
      'Halteres',
      'Permite girar a palma da mão para cima (supinação) durante a subida, garantindo contração biomecânica completa.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquiorradial',
      'Em pé ou sentado, halteres nas laterais com pegada neutra.',
      'Suba um halter de cada vez, girando a palma para cima no meio do percurso e apertando o bíceps no topo. Desça controlando e alterne o braço.',
      'A rotação de punho (supinação) ativa a função primária do bíceps.'
    ],
    [
      'Rosca Martelo com Halteres',
      'Halteres',
      'Pegada neutra que desenvolve o músculo braquial e braquiorradial, conferindo espessura e densidade ao braço.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Braquial, Braquiorradial',
      'Bíceps Braquial',
      'Segure os halteres com palmas viradas uma para a outra (pegada neutra).',
      'Eleve os pesos sem girar os punhos, mantendo as palmas voltadas para dentro. Desça controlando.',
      'O braquial desenvolvido "empurra" o bíceps para cima, criando maior pico de bíceps.'
    ],
    [
      'Rosca Martelo na Polia com Corda',
      'Cabo',
      'Tensão constante no braquial e antebraço desde a extensão até a contração máxima.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Braquial, Braquiorradial',
      'Bíceps',
      'Prenda a corda na polia baixa. Segure nas extremidades com pegada neutra.',
      'Puxe a corda para cima mantendo cotovelos colados e abrindo levemente as pontas no topo.',
      'Excelente para superséries e término de treino de braços.'
    ],
    [
      'Rosca Scott na Máquina / Barra',
      'Máquina',
      'Apoio no banco Scott elimina qualquer impulso do tronco, isolando o bíceps na porção distal.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial (Cabeça Curta)',
      'Braquial',
      'Sente com os braços completamente apoiados no estofado inclinado do banco Scott. Axilas encostadas na borda superior.',
      'Flexione os cotovelos erguendo a carga. Desça controlando até quase a extensão completa.',
      'Não hiperestenda os cotovelos com tranco no ponto mais baixo para não sobrecarregar o tendão distal.'
    ],
    [
      'Rosca Inclinada no Banco 45°',
      'Halteres',
      'Banco inclinado posiciona os braços atrás do tronco, proporcionando estiramento extremo na cabeça longa do bíceps.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Bíceps (Cabeça Longa)',
      'Braquial',
      'Deite em um banco inclinado a 45-60 graus. Deixe os braços caírem soltos perpendiculares ao chão.',
      'Flexione os cotovelos girando os punhos para cima, mantendo os cotovelos parados no mesmo ponto atrás do tronco.',
      'Um dos melhores exercícios comprovados por eletromiografia para criar o pico do bíceps.'
    ],
    [
      'Rosca Concentrada',
      'Halteres',
      'Exercício clássico imortalizado por Arnold Schwarzenegger para pico e contração consciente máxima.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquial',
      'Sentado na ponta de um banco com pernas abertas. Apoie a parte de trás do cotovelo na parte interna da coxa.',
      'Erga o halter em direção ao queixo sem mover o cotovelo. Esmague o bíceps por 1 segundo no topo e desça lento.',
      'Evite inclinar o corpo para o lado para ajudar a subir o peso.'
    ],
    [
      'Rosca Aranha (Spider Curl)',
      'Barra',
      'Peito apoiado no banco inclinado em 45 graus com braços verticais para tensão mecânica constante no topo.',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquial',
      'Deite de bruços no banco inclinado segurando a barra W na vertical.',
      'Flexione os cotovelos erguendo a barra. No topo, a gravidade continua exigindo esforço total do bíceps.',
      'Elimina 100% de qualquer roubo corporal dos deltoides ou tronco.'
    ],
    [
      'Rosca Inversa com Barra',
      'Barra',
      'Pegada pronada (palmas para baixo) que desenvolve o músculo braquiorradial e antebraços grossos.',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      'Braquiorradial, Extensores do Punho',
      'Braquial, Bíceps',
      'Em pé segurando a barra com pegada pronada (palmas voltadas para baixo).',
      'Erga a barra mantendo os punhos firmes e travados sem dobrar para cima.',
      'Constroi antebraços fortes e previne dores no cotovelo (epicondilite).'
    ],
    [
      'Flexão de Punho com Barra',
      'Barra',
      'Fortalecimento direto dos músculos flexores dos dedos e antebraço para pegada de ferro.',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80',
      'Flexores do Punho (Antebraço)',
      'Pegada / Grip',
      'Apoie os antebraços em um banco plano com os punhos para fora da borda.',
      'Abra os dedos deixando a barra rolar até as pontas e feche flexionando os punhos para cima.',
      'Aumenta diretamente a força de sustentação para levantamento terra e puxadas pesadas.'
    ],
    [
      'Tríceps na Polia com Corda',
      'Cabo',
      'Permite abrir as pontas da corda na base do movimento, gerando contração máxima na cabeça lateral.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Tríceps (Cabeça Lateral)',
      'Tríceps (Cabeça Medial)',
      'Prenda a corda no topo da polia. Dê um passo para trás com leve inclinação do tronco. Cotovelos colados ao corpo.',
      'Empurre a corda para baixo e abra as pontas no final do percurso contraindo o tríceps. Suba até 90 graus dos cotovelos.',
      'Não deixe os cotovelos subirem ou se afastarem do corpo durante o movimento.'
    ],
    [
      'Tríceps na Polia com Barra',
      'Cabo',
      'Permite usar cargas maiores para foco de sobrecarga nas cabeças medial e lateral do tríceps.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Tríceps (Cabeça Lateral/Medial)',
      'Ancôneo',
      'Barra reta ou V na polia alta. Pegada pronada na largura dos ombros.',
      'Pressione a barra para baixo estendendo os cotovelos completamente e segure 1 segundo.',
      'Mantenha os punhos alinhados com os antebraços sem dobrar para trás.'
    ],
    [
      'Tríceps Testa com Barra W',
      'Barra',
      'Um dos construtores de tríceps mais lendários e eficientes para espessura e força de empurrar.',
      'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=700&q=80',
      'Tríceps (Cabeça Longa e Medial)',
      'Cabeça Lateral',
      'Deite no banco segurando a barra W com pegada na largura dos ombros. Braços levemente inclinados para trás em direção à cabeça.',
      'Desça a barra flexionando apenas os cotovelos em direção à testa ou logo atrás da cabeça. Estenda de volta à posição inclinada.',
      'Inclinar os braços ligeiramente para trás (e não na vertical reta) mantém o tríceps sob tensão constante mesmo no topo.'
    ],
    [
      'Tríceps Testa com Halteres',
      'Halteres',
      'Pegada neutra anatômica que preserva a articulação do cotovelo e permite descida lateral à cabeça.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Tríceps',
      'Ancôneo',
      'Deitado no banco com um halter em cada mão com palmas voltadas uma para a outra.',
      'Flexione os cotovelos descendo os halteres nas laterais da cabeça e empurre de volta.',
      'Excelente alternativa se a barra W causar desconforto no tendão do tríceps.'
    ],
    [
      'Tríceps Francês com Halter',
      'Halteres',
      'Braços elevados acima da cabeça para alongamento e ativação máxima da cabeça longa do tríceps.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Tríceps (Cabeça Longa)',
      'Tríceps (Cabeça Medial)',
      'Sentado no banco com encosto baixo segurando um halter com as duas mãos acima da cabeça.',
      'Desça o halter atrás da nuca flexionando os cotovelos até sentir alongamento profundo. Estenda os braços para cima.',
      'Mantenha os cotovelos o mais fechados possível apontando para o teto.'
    ],
    [
      'Tríceps Francês na Polia (Corda)',
      'Cabo',
      'Variação no cabo que mantém tensão elástica suave contínua em todo o arco sem perda de carga.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Tríceps (Cabeça Longa)',
      'Tríceps',
      'De costas para a polia baixa segurando a corda por trás da cabeça.',
      'Estenda os braços para frente e para cima abrindo a corda no final.',
      'Muito seguro para quem sente pontadas no cotovelo com pesos livres pesados.'
    ],
    [
      'Supino Fechado com Barra',
      'Barra',
      'Exercício composto pesado que permite sobrecarregar o tríceps com as maiores cargas possíveis.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial',
      'Peitoral Maior, Deltoide Anterior',
      'Deite no supino reto. Pegada na barra na largura dos ombros (não junte as mãos; mantenha cerca de 30-40 cm de distância).',
      'Desça a barra controlando até a linha inferior do peito mantendo cotovelos raspando as costelas. Empurre forte.',
      'Não una as mãos no centro; isso causaria compressão prejudicial nos punhos sem melhorar o recrutamento do tríceps.'
    ],
    [
      'Paralelas (Foco Tríceps)',
      'Peso Corporal',
      'Mergulho nas paralelas com postura ereta para isolar a extensão dos braços.',
      'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial',
      'Deltoide Anterior, Peitoral',
      'Nas barras paralelas, mantenha o tronco o mais vertical possível e pernas retas ou cruzadas para baixo.',
      'Desça flexionando os braços com cotovelos apontando para trás e empurre o corpo para cima.',
      'Mantenha os cotovelos colados ao tronco para que o tríceps faça todo o trabalho concêntrico.'
    ],
    [
      'Mergulho no Banco (Tríceps)',
      'Peso Corporal',
      'Excelente exercício prático para tríceps que pode ser feito em qualquer banco ou degrau.',
      'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial',
      'Deltoide Anterior',
      'Mãos apoiadas na borda do banco atrás de você, pernas estendidas à frente.',
      'Desça flexionando os cotovelos até 90 graus e empurre de volta.',
      'Para aumentar a dificuldade, apoie os pés sobre outro banco ou coloque anilhas sobre as coxas.'
    ],
    [
      'Rosca 21 com Barra W',
      'Barra',
      'Método lendário de pré e pós-exaustão dividido em 7 reps na metade inferior, 7 reps na metade superior e 7 reps na amplitude completa.',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial',
      'Braquial, Antebraços',
      'Fique em pé segurando a barra W com pegada supinada na largura dos ombros.',
      'Execute 7 repetições da base até 90 graus; em seguida 7 repetições de 90 graus até o topo; finalize com 7 repetições em amplitude total.',
      'Use uma carga menor do que o normal. O acúmulo de lactato e metabólitos nesta série é absurdo.'
    ],
    [
      'Rosca Bayesiana na Polia',
      'Cabo',
      'Executada de costas para a polia, mantém o ombro em hiperextensão gerando o maior estiramento possível da cabeça longa do bíceps.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial (Cabeça Longa)',
      'Braquial, Braquiorradial',
      'Prenda a manopla na polia baixa. Dê 1 a 2 passos para a frente ficando de costas para a máquina com o braço estendido para trás.',
      'Flexione o cotovelo puxando a manopla para a frente sem mover o braço para frente até quase a metade do movimento. Sinta o estiramento profundo.',
      'Mantenha o cotovelo fixo para trás durante a maior parte do curso para isolar a cabeça longa.'
    ],
    [
      'Rosca Drag com Barra',
      'Barra',
      'A barra sobe colada ao abdômen e peito com os cotovelos puxados para trás, eliminando a ação do deltoide anterior.',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
      'Bíceps Braquial (Pico)',
      'Braquial',
      'Fique em pé segurando a barra com pegada supinada na frente das coxas.',
      'Puxe a barra para cima arrastando-a em contato direto com a camiseta, empurrando os cotovelos para trás. Aperte o bíceps no topo.',
      'Diferente da rosca comum, os cotovelos vão para trás e a barra sobe em linha reta vertical.'
    ],
    [
      'Tríceps Coice com Halteres',
      'Halteres',
      'Excelente contração de pico na posição encurtada do tríceps com o braço em extensão completa.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial (Cabeça Lateral e Medial)',
      'Deltoide Posterior',
      'Apoie um joelho e mão no banco com o tronco paralelo ao solo. Segure o halter com o cotovelo flexionado a 90 graus colado à costela.',
      'Estenda o braço para trás até ficar paralelo ao chão. Segure a contração máxima por 1 segundo e retorne sem mover o ombro.',
      'O cotovelo não pode oscilar para cima ou para baixo durante a série; ele atua como um pivô fixo.'
    ],
    [
      'Tríceps Coice na Polia',
      'Cabo',
      'Variação do coice com cabo que mantém tensão muscular constante mesmo no início da extensão, onde o halter tem torque zero.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial',
      'Antebraço',
      'Ajuste a polia média/baixa. Incline o tronco para a frente segurando o terminal do cabo (sem manopla). Cotovelo travado junto às costelas.',
      'Estenda o braço para trás esticando o cabo completamente. Sinta a contração potente da cabeça lateral.',
      'Movimento cirúrgico para finalização de treino de braços com altíssimo foco em queimação e conexão mente-músculo.'
    ],
    [
      'Extensão de Punho com Barra (Inversa)',
      'Barra',
      'Exercício essencial para desenvolvimento dos extensores do antebraço e fortalecimento articular do punho.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Extensores do Antebraço',
      'Braquiorradial',
      'Sente-se no banco apoiando os antebraços sobre as coxas com os punhos para fora dos joelhos, palmas voltadas para baixo (pronadas).',
      'Estenda os punhos levantando a barra o mais alto possível. Desça lentamente até o ponto neutro ou leve flexão.',
      'Use cargas leves a moderadas com foco em controle estrito e altas repetições (15-20 reps).'
    ],
    [
      'Tríceps Katana na Polia',
      'Cabo',
      'Trabalha a cabeça longa do tríceps em amplitude completa de estiramento unilateral através do corpo.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Tríceps Braquial (Cabeça Longa)',
      'Core',
      'Ajuste o cabo na altura do ombro. Segure o cabo com a mão contralateral passando por trás da cabeça como se puxasse uma espada katana.',
      'Estenda o braço diagonalmente para fora e para cima. Retorne sentindo o estiramento completo do tríceps atrás do pescoço.',
      'Excelente conforto articular por respeitar o alinhamento individual da escápula e úmero.'
    ]
  ]],
  ['Core', [
    [
      'Abdominal Canivete (Crunch)',
      'Peso Corporal',
      'O movimento clássico para flexão da coluna e hipertrofia dos feixes superiores do reto abdominal.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal (Superior)',
      'Oblíquos',
      'Deite de costas no solo com os joelhos flexionados e pés apoiados no chão. Mãos nas têmporas ou cruzadas no peito.',
      'Flexione a coluna enrolando o tronco em direção aos joelhos, tirando as escápulas do solo. Expire todo o ar no topo e aperte o abdômen por 1 segundo.',
      'Não puxe a cabeça com as mãos para não forçar a coluna cervical.'
    ],
    [
      'Abdominal na Polia Alta (Corda)',
      'Cabo',
      'Permite sobrecarga progressiva de peso para construir gomos abdominais espessos e visíveis.',
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal',
      'Oblíquos',
      'Ajoelhe-se de frente para a polia alta segurando a corda com as mãos ao lado das orelhas. Quadril travado para trás.',
      'Enrole a coluna para baixo trazendo os cotovelos em direção aos joelhos. Expire na descida e volte controlando.',
      'O movimento deve ser de flexão da coluna (enrolar o tronco), e não de flexão do quadril.'
    ],
    [
      'Elevação de Pernas Suspenso na Barra',
      'Peso Corporal',
      'O melhor exercício para a porção inferior do abdômen e fortalecimento de todo o core profundo.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal (Inferior), Ilio-psoas',
      'Oblíquos, Antebraço',
      'Pendure-se na barra fixa com pegada pronada na largura dos ombros.',
      'Eleve as pernas estendidas ou joelhos flexionados até a altura do peito, enrolando a pelve para cima.',
      'Não balance o corpo para pegar impulso. O abdômen deve puxar a bacia para cima (retroversão pélvica).'
    ],
    [
      'Elevação de Pernas no Solo ou Banco',
      'Peso Corporal',
      'Ativação intensa da porção infra-abdominal com controle de estabilização da coluna lombar.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal (Inferior)',
      'Flexores de Quadril',
      'Deitado no chão ou banco, mãos sob os glúteos ou segurando a borda do banco.',
      'Eleve as pernas retas até 90 graus e desça controlando sem encostar os calcanhares no chão.',
      'Pressione a lombar contra o chão durante todo o tempo para evitar que ela arqueie.'
    ],
    [
      'Abdominal Roda (Ab Wheel)',
      'Aparelho',
      'Um dos exercícios mais avançados e brutais de anti-extensão para o transverso e reto abdominal.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal, Transverso',
      'Dorsais, Ombros',
      'Ajoelhe-se em um colchonete segurando a roda abdominal com as duas mãos.',
      'Role a roda para a frente estendendo o corpo o máximo que conseguir sem deixar a lombar ceder. Puxe de volta contraindo o abdômen.',
      'Mantenha uma leve retroversão pélvica durante todo o percurso para proteger a lombar.'
    ],
    [
      'Prancha Isométrica',
      'Peso Corporal',
      'Estabilidade estática e fortalecimento do transverso do abdômen, reduzindo a linha de cintura.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Transverso Abdominal, Core',
      'Ombros, Glúteos',
      'Apoie os antebraços e as pontas dos pés no chão. Corpo reto como uma tábua.',
      'Mantenha a posição estática contraindo abdômen e glúteos com respiração cadenciada.',
      'Não deixe o quadril cair nem empine o bumbum para cima.'
    ],
    [
      'Prancha Lateral',
      'Peso Corporal',
      'Estabilidade lateral e fortalecimento profundo dos músculos oblíquos e quadrado lombar.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Oblíquos Interno e Externo',
      'Quadrado Lombar, Glúteo Médio',
      'Deite de lado apoiado em um dos antebraços. Corpo em linha reta.',
      'Eleve o quadril do solo sustentando o peso nas laterais dos pés e antebraço.',
      'Excelente para equilíbrio postural e prevenção de dores na coluna.'
    ],
    [
      'Abdominal Bicicleta',
      'Peso Corporal',
      'Combinação de flexão e rotação de tronco com a maior ativação eletromiográfica de oblíquos e reto abdominal.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal, Oblíquos',
      'Flexores de Quadril',
      'Deitado de costas, mãos nas têmporas e pernas elevadas a 90 graus.',
      'Gire o tronco levando o cotovelo direito em direção ao joelho esquerdo enquanto estica a perna direita. Alterne sem parar.',
      'Execute de forma lenta e controlada, focando em encostar o cotovelo no joelho oposto com rotação torácica.'
    ],
    [
      'Vácuo Abdominal (Stomach Vacuum)',
      'Peso Corporal',
      'A técnica clássica dos deuses do fisiculturismo da Era de Ouro para afinar a cintura e fortalecer o transverso.',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
      'Transverso Abdominal',
      'Músculos Respiratórios Profundos',
      'Em pé, de quatro apoios ou sentado. Esvazie todo o ar dos pulmões com uma expiração forçada.',
      'Sem puxar ar, sugue o umbigo o mais fundo possível para dentro e para cima em direção à coluna. Segure a sucção por 15 a 30 segundos.',
      'Pratique preferencialmente em jejum pela manhã para máxima retração do estômago e cintura fina.'
    ],
    [
      'Prancha com Toque no Ombro',
      'Peso Corporal',
      'Prancha anti-rotação dinâmica que desafia a estabilização unilateral do abdômen, oblíquos e ombros.',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'Transverso Abdominal e Oblíquos',
      'Deltoide Anterior, Glúteos, Peitoral',
      'Posicione-se em prancha alta (posição de flexão), mãos sob os ombros e pés um pouco mais afastados para estabilidade.',
      'Tire uma mão do chão e toque suavemente o ombro oposto sem deixar o quadril girar ou balançar. Retorne e repita com o outro lado.',
      'Imagine que há um copo d água equilibrado na sua lombar que não pode cair durante as trocas de mão.'
    ],
    [
      'Russian Twist (Rotação Russa com Anilha/Halter)',
      'Peso Corporal',
      'Fortalece os oblíquos internos e externos e desenvolve potência rotacional do tronco.',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
      'Oblíquos Internos e Externos',
      'Reto Abdominal, Flexores de Quadril',
      'Sente-se no chão com joelhos flexionados e pés ligeiramente elevados. Incline o tronco a 45 graus segurando uma anilha ou halter.',
      'Gire o tronco de um lado para o outro tocando o peso próximo ao chão ao lado do quadril com rotação controlada.',
      'Gire a partir dos ombros e tórax, não apenas movendo os braços.'
    ],
    [
      'Abdominal Supra no Banco Declinado',
      'Peso Corporal',
      'Aumenta a sobrecarga gravitacional sobre o reto abdominal através da inclinação declinada.',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal (Porção Superior)',
      'Flexores de Quadril',
      'Prenda os pés no suporte do banco declinado. Deite com as mãos cruzadas no peito ou atrás das orelhas.',
      'Enrole o tronco para a frente contraindo o abdômen até cerca de 45 graus. Desça controlando sem encostar totalmente as costas no banco.',
      'Não puxe a cabeça com as mãos para evitar forçar as vértebras cervicais.'
    ],
    [
      'Abdominal Infra na Paralela (Captain’s Chair)',
      'Aparelho',
      'Excelente isolamento dos abdominais inferiores sem sobrecarga de tração nos antebraços e pegada da barra fixa.',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal (Porção Inferior)',
      'Flexores de Quadril, Oblíquos',
      'Apoie os antebraços nas almofadas da cadeira romana segurando as manoplas. Costas apoiadas no encosto.',
      'Eleve os joelhos em direção ao peito, enrolando a pelve para cima no final da subida para máxima ativação abdominal.',
      'O segredo está em enrolar o quadril para cima; apenas levantar as pernas trabalha só os flexores da coxa.'
    ],
    [
      'Extensão Lombar Solo (Superman)',
      'Peso Corporal',
      'Exercício sem peso para fortalecimento da cadeia posterior profunda, eretores espinhais e glúteos.',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80',
      'Eretores da Espinha (Lombar)',
      'Glúteo Máximo, Isquiotibiais, Trapézio Inferior',
      'Deite de bruços no chão com braços estendidos à frente e pernas estendidas.',
      'Eleve simultaneamente os braços, peito e pernas do chão contraindo a lombar e glúteos. Segure por 2 a 3 segundos e desça suavemente.',
      'Mantenha o pescoço em posição neutra olhando para o chão para não comprimir a cervical.'
    ],
    [
      'Prancha Abdominal Dinâmica (Plank to Push-up)',
      'Peso Corporal',
      'Combina estabilidade de core com força de membros superiores alternando entre apoio nos antebraços e palmas das mãos.',
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=700&q=80',
      'Reto Abdominal e Transverso',
      'Tríceps, Deltoide Anterior, Peitoral',
      'Comece na posição de prancha baixa apoiado nos antebraços.',
      'Coloque a palma da mão direita no chão e depois a esquerda, subindo para prancha alta; depois desça novamente para os antebraços um braço por vez.',
      'Mantenha o quadril o mais nivelado e quieto possível durante as transições de subida e descida.'
    ]
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
      img: item[3] || '',
      primary: item[4] || g[0],
      secondary: item[5] || '',
      setup: item[6] || '',
      execution: item[7] || '',
      tip: item[8] || '',
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
  work: { l:'V', full:'Válida (Série Normal)', cls:'st-work', color:'#38bdf8' },
  warm: { l:'A', full:'Aquecimento (Warm-up)', cls:'st-warm', color:'#94a3b8' },
  prep: { l:'P', full:'Preparatória (Feeder Set)', cls:'st-prep', color:'#fbbf24' },
  drop: { l:'D', full:'Drop-Set (Redução de carga)', cls:'st-drop', color:'#c084fc' },
  fail: { l:'F', full:'Falha Muscular (Até o limite)', cls:'st-fail', color:'#f43f5e' }
};

function nextType(t){
  const cycle = ['work', 'warm', 'prep', 'drop', 'fail'];
  const idx = cycle.indexOf(t);
  return idx >= 0 ? cycle[(idx + 1) % cycle.length] : 'work';
}
