# FORJA — Treino, Alta Performance & Mini Rede Social ⚡🏋️‍♂️

> Aplicação Web Progressiva (PWA) Mobile-First inspirada no **Hevy**, com montagem de treinos assistida por IA (Gemini), contador de macros e micronutrientes, feed social para compartilhar sessões com fotos, mapa corporal anatômico em vermelho (heatmap), cronômetro inteligente de descanso entre séries e integração com Strava.

---

## 🚀 Funcionalidades Principais

### 1. 🏋️ Montagem & Gestão de Treinos com IA (Gemini)
- **Assistente IA Integrado no Criador de Fichas:** Peça sugestões de exercícios complementares para equilibrar volume muscular ou gere treinos completos adaptados ao seu objetivo (Hipertrofia, Força, Condicionamento).
- **Tipos de Séries Granulares:**
  - `V` — **Válida (Work Set)**: Séries de esforço principal.
  - `P` — **Preparatória (Feeder Set)**: Séries de aproximação de carga.
  - `A` — **Aquecimento (Warm-up)**: Séries leves para articulações.
- **Biblioteca com 48+ Exercícios Comuns:** Divididos por Peito, Costas, Pernas, Ombros, Braços e Core com filtros rápidos.
- **Exercícios Personalizados:** Crie variações próprias e adicione diretamente à ficha em 1 clique.
- **Configuração Fina:** Tempo de descanso individual por exercício (30s a 300s), RPE alvo (5 a 10) e repetições alvo.

### 2. 🔥 Execução Ativa & Cronômetro Inteligente
- Modo **Treino Ativo** com checklist tátil de séries concluídas.
- Controles de ajuste de carga (+/- 2.5kg) e repetições em tempo real.
- **Cronômetro Regressivo Automático:** Ao marcar uma série, o timer inicia com alerta sonoro e vibração tátil ao finalizar. Pode ser minimizado para uma pílula flutuante.
- **Detecção de Recordes Pessoais (PR):** Comemoração imediata com efeito de partículas (confetti) e shockwave ao superar seu 1RM estimado!

### 3. 🫀 Tela Pós-Treino com Mapa Anatômico em Vermelho (Heatmap)
- **Visualização Anatômica Humana (Frente & Costas):** Os músculos trabalhados se iluminam em **vermelho incandescente / escarlate neon**, com intensidade proporcional ao volume e número de séries.
- **Métricas Chave:**
  - **Carga Total Movimentada (Tonelagem)** com animação de contagem.
  - Volume total de repetições e séries.
  - Duração da sessão.
  - XP e progressão de nível.
  - Novos recordes pessoais (PRs) batidos.

### 4. 🥗 Módulo Nutricional & Contador de Micronutrientes por IA
- **Contador por Linguagem Natural:** Descreva sua refeição (ex: *"3 ovos mexidos, 150g de frango grelhado, 100g de arroz e 1 maçã"*) e a IA estima:
  - Calorias totais (kcal).
  - Macronutrientes: Proteínas, Carboidratos, Gorduras e Fibras.
  - **9 Micronutrientes Essenciais:** Ferro, Zinco, Cálcio, Magnésio, Potássio, Sódio, Vitamina C, Vitamina D e Vitamina B12.
- **Barras de Progresso Diário (IDR / RDA):** Acompanhe o percentual atingido da meta diária recomendada de cada micronutriente.
- **Diário de Refeições:** Salve as refeições do dia e acompanhe o balanço calórico acumulado.
- **Calculadora TMB & TDEE (Mifflin-St Jeor):** Gráfico donut interativo para definir metas de macros.

### 5. 👥 Mini Rede Social & Feed Estilo Hevy
- **Feed da Comunidade:** Veja os treinos finalizados por outros atletas e amigos.
- **Publicação Completa:** Publique seu treino com foto (tirada na hora com a câmera ou da galeria), legenda personalizada e resumo do treino (tonelagem, reps, PRs e músculos trabalhados).
- **Curtidas & Interações:** Botão de coração com microanimação.
- **Sistema de Amigos:** Adicione amigos por e-mail/nome e acompanhe a evolução mútua.

### 6. 📱 PWA & Funcionamento 100% Offline
- **Instalável na Tela Inicial:** Manifesto PWA configurado com ícones maskable e exibição `standalone`.
- **Cache Offline (Service Worker):** Funcione na academia mesmo sem conexão com a internet.
- **Autenticação Flexível:**
  - Login com Google (suporte nativo ou via Firebase).
  - Cadastro local seguro e recuperação de senha ("Esqueci minha senha" com código de 6 dígitos).
  - Modo Convidado para treino imediato.

### 7. 🏃 Integração com Strava
- Conecte seu token de acesso em Perfil.
- Opção de publicação automática ao concluir cada sessão de musculação (`WeightTraining`).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico & CSS3 Moderno:** Glassmorphism (`backdrop-filter`), gradientes cósmicos e tokens CSS customizados.
- **JavaScript Moderno (ES6+):** Arquitetura orientada a componentes e reatividade sem frameworks pesados, garantindo carregamento instantâneo.
- **Google Gemini API:** Integração com modelos generativos (`gemini-2.5-flash`, `gemini-2.0-flash`) com fallback inteligente offline.
- **HTML5 Canvas 2D:** Renderização de gráficos de evolução de carga (e1RM), barras semanais/mensais, sparklines e cartão de compartilhamento em alta resolução (1080x1350).
- **Service Worker & LocalStorage:** Persistência de dados local-first com sincronização opcional com Firebase Firestore.

---

## 📲 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Murilo-Rogerio/Forja-gym.git
   cd Forja-gym
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno ou execute um servidor estático local (como Live Server do VS Code ou `python -m http.server 8000`).
3. Para ativar a IA generativa do Gemini, insira sua chave gratuita do Google AI Studio em **Perfil → Chave Gemini**.
