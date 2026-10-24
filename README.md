# ⚡ FORJA — Treino, Alta Performance & Mini Rede Social

[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=flat-square)]()
[![Plataforma](https://img.shields.io/badge/Plataforma-PWA%20Mobile--First-purple?style=flat-square)]()
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20API-4285F4?logo=google&style=flat-square)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Realtime-3ECF8E?logo=supabase&style=flat-square)]()
[![Tecnologias](https://img.shields.io/badge/Techs-Vanilla%20JS%20%7C%20Canvas%202D%20%7C%20CSS3-blue?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://theforge-rho.vercel.app)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-violet?style=flat-square)]()

> Aplicação Web Progressiva (PWA) Mobile-First inspirada no **Hevy**, com **AI Coach multifuncional** (Google Gemini), contador de macros e 9 micronutrientes por linguagem natural, feed social em tempo real com **Supabase Cloud**, mapa corporal anatômico interativo em vermelho neon (*heatmap*), calculadora de anilhas, importador Hevy CSV, cronômetro inteligente de descanso e integração com Strava.

🔗 **Acesse o app ao vivo:** [theforge-rho.vercel.app](https://theforge-rho.vercel.app)

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura & Decisões Técnicas](#-arquitetura--decisões-técnicas)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Licença](#-licença)

---

## 🧭 Visão Geral

O **FORJA** foi desenvolvido para solucionar a falta de flexibilidade, custos proibitivos de assinaturas e lentidão de conexão dos aplicativos de musculação convencionais. Operando sob o paradigma **Local-First**, o app carrega instantaneamente, funciona 100% offline dentro de academias com sinal instável e sincroniza treinos, fichas e feed social com o **Supabase Cloud** quando conectado, além de oferecer recursos avançados impulsionados por Inteligência Artificial Generativa.

---

## 🚀 Funcionalidades Principais

### 1. 🤖 AI Coach Multifuncional & Gestão de Treinos (Google Gemini)
- **Assistente IA Integrado:** Sugestões contextuais de exercícios complementares para equilibrar volume muscular por grupamento e geração de rotinas completas conforme o objetivo (Hipertrofia, Força, Condicionamento).
- **Prontidão Diária & Recuperação Muscular:** Algoritmo que calcula o índice de recuperação (0 a 100%) de cada grupamento com base nas horas de descanso e princípios de supercompensação fisiológica.
- **Áudio Coach Integrado:** Síntese de voz em português via Web Speech API emitindo incentivos, alertas de descanso e instruções de séries.
- **Scanner Visual de Refeições:** Reconhecimento de pratos e alimentos via câmera/imagem analisada pela API multimodal do Gemini.
- **Escada de Aquecimento Neuromuscular:** Geração automática de séries progressivas de ativação antes dos exercícios pesados.
- **Substituição Biomecânica:** Sugestão inteligente de exercícios alternativos com curva de força e foco muscular equivalente caso um equipamento esteja ocupado.
- **5 Tipos Granulares de Séries:**
  - `V` — **Válida (Work Set):** Séries principais para tonelagem e sobrecarga progressiva.
  - `P` — **Preparatória (Feeder Set):** Aproximação de carga neuromuscular sem acúmulo excessivo de fadiga.
  - `A` — **Aquecimento (Warm-up):** Ativação articular e metabólica leve.
  - `D` — **Drop Set:** Redução imediata de carga com extensão além da falha momentânea.
  - `F` — **Falha (Failure Set):** Séries até o esgotamento concêntrico absoluto.
- **Treino Livre & Calculadora de Anilhas:** Montagem livre de treino na hora e calculadora visual de distribuição de anilhas por lado na barra.
- **Importador & Exportador Hevy:** Compatibilidade total com arquivos CSV de histórico do Hevy.
- **Biblioteca com 48+ Exercícios Comuns:** Segmentados por Peito, Costas, Pernas, Ombros, Braços e Core com filtros dinâmicos e suporte a exercícios autorais customizados.

### 2. 🔥 Execução Ativa & Cronômetro Inteligente
- Modo **Treino Ativo** com checklist tátil de séries concluídas.
- Controles por stepper de ajuste de carga (+/- 2.5 kg) e repetições em tempo real.
- **Cronômetro Regressivo Automático:** Ao marcar uma série, o timer inicia com alerta sonoro e vibração tátil ao zerar, podendo ser minimizado para uma pílula flutuante.
- **Detecção de Recordes Pessoais (PR):** Comemoração imediata com efeito de partículas (*confetti*) e shockwave ao superar o 1RM estimado!

### 3. 🫀 Tela Pós-Treino com Mapa Anatômico em Vermelho (Heatmap)
- **Visualização Anatômica Humana (Frente & Costas):** Músculos fadigados iluminam-se em **vermelho incandescente / escarlate neon**, com intensidade proporcional ao volume e número de séries.
- **Métricas Chave:**
  - **Carga Total Movimentada (Tonelagem)** com animação de contagem acumulada.
  - Volume total de repetições e séries válidas.
  - Duração líquida da sessão.
  - Pontos de Experiência (XP) e progressão de nível (*gamification*).
  - Novos recordes pessoais (PRs) batidos na sessão.

### 4. 🥗 Módulo Nutricional & Contador de Micronutrientes por IA
- **Contador por Linguagem Natural:** Descreva a refeição em linguagem natural (ex: *"3 ovos mexidos, 150g de frango grelhado, 100g de arroz e 1 maçã"*) e a IA estima:
  - Calorias totais (kcal).
  - Macronutrientes: Proteínas, Carboidratos, Gorduras e Fibras alimentares.
  - **9 Micronutrientes Essenciais:** Ferro, Zinco, Cálcio, Magnésio, Potássio, Sódio, Vitamina C, Vitamina D e Vitamina B12.
- **Barras de Progresso Diário (IDR / RDA):** Acompanhamento percentual da ingestão diária recomendada de cada micronutriente.
- **Diário de Refeições:** Histórico do dia com balanço calórico acumulado.
- **Calculadora TMB & TDEE (Mifflin-St Jeor):** Gráfico interativo com metas calculadas de macros.

### 5. 👥 Mini Rede Social & Feed em Tempo Real (Supabase Cloud)
- **Feed da Comunidade:** Linha do tempo com treinos finalizados por outros atletas sincronizados via Supabase Realtime.
- **Publicação Completa:** Compartilhamento de treino com foto (câmera ou galeria), legenda personalizada e card resumo (tonelagem, reps, PRs e músculos fadigados).
- **Curtidas & Interações:** Botão de curtida com microanimações táteis.
- **Sistema de Amigos:** Busca e adição de contatos por e-mail/nome com feed sincronizado.

### 6. 📱 PWA & Funcionamento 100% Offline
- **Instalável na Home Screen:** Manifesto PWA configurado com ícones maskable e exibição nativa `standalone`.
- **Cache Offline (Service Worker):** Navegação e execução resiliente na academia sem depender de rede celular.
- **Autenticação Flexível:**
  - Login e sincronização com **Supabase Auth** (sessão persistente, JWT, RLS).
  - Modo Convidado Local-First para treino imediato sem cadastro prévio.

### 7. 🏃 Integração com Strava
- Conexão direta de token de acesso no perfil do atleta.
- Sincronização automatizada de sessões de musculação (`WeightTraining`).

---

## 🏛️ Arquitetura & Decisões Técnicas

- **Abordagem Local-First + Supabase Sync:** Os dados de treinos, histórico e rotinas são mantidos primordialmente em cache local (`localStorage` / IndexedDB), garantindo latência zero e operação contínua sem internet, sincronizando na nuvem com PostgreSQL (Supabase) quando online.
- **IA Generativa Resiliente (Google Gemini):** A camada de integração com a API Gemini (`gemini-2.5-flash` e `gemini-2.0-flash`) implementa validação estrita de respostas JSON e fallback offline estruturado para manter as funcionalidades caso a rede esteja indisponível.
- **Renderização Gráfica em Canvas 2D:** Construção de gráficos de evolução de carga (e1RM), distribuição de volume semanal e exportação de cards de compartilhamento social em alta resolução (1080x1350) inteiramente em Canvas nativo, dispensando dependências pesadas de bibliotecas externas.
- **Service Worker com Cache Estratégico:** Cache estático de assets essenciais e estratégia *stale-while-revalidate* para atualizações fluidas de versão.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Front-end** | JavaScript Vanilla (ES6+) | Arquitetura modular limpa e reativa sem overhead de frameworks |
| **Estilização** | CSS3 Moderno | Glassmorphism, tokens de cor CSS, tema escuro nativo e design responsivo |
| **Gráficos & Mídia** | HTML5 Canvas 2D | Visualização de métricas, curvas de e1RM e geração de cards de imagem |
| **Inteligência Artificial**| Google Gemini API | Modelos Flash para síntese de treinos, visão computacional e cálculo de micronutrientes |
| **Backend & Cloud** | Supabase Cloud | PostgreSQL, Supabase Auth, Row Level Security (RLS) e Realtime Feed |
| **Offline / PWA** | Service Worker & Web Manifest | Suporte a instalação, ícones maskable e cache offline completo |
| **Integrações** | Strava API | Conexão de sessões esportivas |
| **Deploy** | Vercel | Hospedagem contínua de alta performance |

---

## 📂 Estrutura do Projeto

```text
Forja/
├── css/
│   ├── base.css              # Variáveis de cor, reset e tipografia
│   ├── components.css        # Botões, cards, modais e badges
│   └── views.css             # Estilos específicos de cada tela do app
├── icons/                    # Ícones PWA em diferentes resoluções
├── js/
│   ├── app/
│   │   ├── boot.js           # Inicialização e orquestração de módulos
│   │   ├── router.js         # Roteamento SPA baseado em hash/views
│   │   └── wiring.js         # Conexão de eventos globais
│   ├── components/
│   │   ├── bodymap.js        # Heatmap anatômico em Canvas 2D
│   │   ├── charts.js         # Gráficos de 1RM e tonelagem em Canvas 2D
│   │   ├── fx.js             # Efeitos visuais e partículas (confetti)
│   │   ├── icons.js          # SVG Icon definitions
│   │   ├── timer.js          # Cronômetro regressivo com haptics
│   │   └── toast.js          # Sistema de notificações Toast
│   ├── features/
│   │   ├── auth.js           # Gerenciamento de sessão Supabase e convidado
│   │   ├── coach.js          # AI Coach, prontidão diária, hábitos e áudio coach
│   │   ├── editor.js         # Criador de fichas e exercícios
│   │   ├── feed.js           # Feed social e publicações em tempo real
│   │   ├── share.js          # Exportação de cards e integração Strava
│   │   └── workout.js        # Motor de execução ativa, Hevy CSV e anilhas
│   ├── lib/
│   │   ├── ai.js             # Integração com Google Gemini API
│   │   ├── data.js           # Banco de exercícios padrão e sementes
│   │   ├── gamification.js   # Sistema de XP, níveis e badges
│   │   ├── state.js          # Estado reativo e migrações
│   │   ├── supabase.js       # Client Supabase Cloud e listeners realtime
│   │   └── utils.js          # Formatadores e helpers gerais
│   └── views/
│       ├── feed.js           # Tela de Feed Social
│       ├── home.js           # Dashboard e visão geral
│       ├── nutrition.js      # Contador de macros e micronutrientes
│       ├── profile.js        # Perfil do atleta e configurações
│       ├── progress.js       # Gráficos de evolução e histórico
│       └── workouts.js       # Listagem e execução de rotinas
├── tools/                    # Utilitários de desenvolvimento
├── index.html                # Ponto de entrada SPA
├── manifest.json             # Manifesto PWA
├── sw.js                     # Service Worker para suporte offline
├── vercel.json               # Configurações de headers e cache Vercel
└── README.md                 # Documentação oficial
```

---

## 📲 Como Rodar Localmente

### Pré-requisitos
- Qualquer navegador moderno (Chrome, Edge, Firefox, Safari)
- Servidor web local simples (ex.: Live Server do VS Code, `npx serve` ou `python -m http.server`)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Murilo-Rogerio/Forja-gym.git
   cd Forja-gym
   ```

2. **Inicie um servidor estático local:**
   ```bash
   # Com Python:
   python -m http.server 8000

   # Ou com Node.js:
   npx serve .
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:8000`.

4. **Configuração da IA & Supabase (Opcional):**
   - **Google Gemini:** Para ativar as funcionalidades de IA generativa, adicione sua chave gratuita do [Google AI Studio](https://aistudio.google.com/) em **Perfil → Chave Gemini**.
   - **Supabase Cloud:** O app já conta com backend configurado por padrão, com suporte a troca de credenciais customizadas em **Perfil → Conexão Nuvem**.

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por **Murilo Rogério**.
