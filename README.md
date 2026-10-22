# ⚡ FORJA — Treino, Alta Performance & Mini Rede Social

[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen?style=flat-square)]()
[![Plataforma](https://img.shields.io/badge/Plataforma-PWA%20Mobile--First-purple?style=flat-square)]()
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20API-4285F4?logo=google&style=flat-square)]()
[![Tecnologias](https://img.shields.io/badge/Techs-Vanilla%20JS%20%7C%20Canvas%202D%20%7C%20CSS3-blue?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://theforge-rho.vercel.app)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-violet?style=flat-square)]()

> Aplicação Web Progressiva (PWA) Mobile-First inspirada no **Hevy**, com montagem de treinos assistida por IA (Google Gemini), contador de macros e 9 micronutrientes por linguagem natural, feed social para compartilhamento de sessões com fotos, mapa corporal anatômico interativo em vermelho neon (heatmap), cronômetro inteligente de descanso entre séries e integração com Strava.

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

O **FORJA** foi desenvolvido para solucionar a falta de flexibilidade, custos proibitivos de assinaturas e lentidão de conexão dos aplicativos de musculação convencionais. Operando sob o paradigma **Local-First**, o app carrega instantaneamente, funciona 100% offline dentro de academias com sinal instável e oferece recursos avançados impulsionados por Inteligência Artificial Generativa.

---

## 🚀 Funcionalidades Principais

### 1. 🏋️ Montagem & Gestão de Treinos com IA (Google Gemini)
- **Assistente IA Integrado no Criador de Fichas:** Sugestões contextuais de exercícios complementares para equilibrar volume muscular por grupamento ou geração de rotinas personalizadas conforme o objetivo (Hipertrofia, Força, Condicionamento).
- **Tipos de Séries Granulares:**
  - `V` — **Válida (Work Set):** Séries de esforço principal para cálculo de tonelagem.
  - `P` — **Preparatória (Feeder Set):** Séries de aproximação de carga neuromuscular.
  - `A` — **Aquecimento (Warm-up):** Séries leves para ativação e preservação articular.
- **Biblioteca com 48+ Exercícios Comuns:** Segmentados por Peito, Costas, Pernas, Ombros, Braços e Core com filtros dinâmicos.
- **Exercícios Personalizados:** Criação de variações autorais adicionadas à ficha em 1 clique.
- **Configuração Fina:** Intervalo de descanso customizável por exercício (30s a 300s), RPE alvo (5 a 10) e repetições estimadas.

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
  - Pontos de Experiência (XP) e progressão de nível.
  - Novos recordes pessoais (PRs) batidos na sessão.

### 4. 🥗 Módulo Nutricional & Contador de Micronutrientes por IA
- **Contador por Linguagem Natural:** Descreva a refeição em linguagem natural (ex: *"3 ovos mexidos, 150g de frango grelhado, 100g de arroz e 1 maçã"*) e a IA estima:
  - Calorias totais (kcal).
  - Macronutrientes: Proteínas, Carboidratos, Gorduras e Fibras alimentares.
  - **9 Micronutrientes Essenciais:** Ferro, Zinco, Cálcio, Magnésio, Potássio, Sódio, Vitamina C, Vitamina D e Vitamina B12.
- **Barras de Progresso Diário (IDR / RDA):** Acompanhamento percentual da ingestão diária recomendada de cada micronutriente.
- **Diário de Refeições:** Histórico do dia com balanço calórico acumulado.
- **Calculadora TMB & TDEE (Mifflin-St Jeor):** Gráfico interativo com metas calculadas de macros.

### 5. 👥 Mini Rede Social & Feed Estilo Hevy
- **Feed da Comunidade:** Linha do tempo com treinos finalizados por outros atletas.
- **Publicação Completa:** Compartilhamento de treino com foto (câmera ou galeria), legenda personalizada e card resumo (tonelagem, reps, PRs e músculos fadigados).
- **Curtidas & Interações:** Botão de curtida com microanimações táteis.
- **Sistema de Amigos:** Busca e adição de contatos por e-mail/nome com feed sincronizado.

### 6. 📱 PWA & Funcionamento 100% Offline
- **Instalável na Home Screen:** Manifesto PWA configurado com ícones maskable e exibição nativa `standalone`.
- **Cache Offline (Service Worker):** Navegação e execução resiliente na academia sem depender de rede celular.
- **Autenticação Flexível:**
  - Suporte a login com Google / Firebase.
  - Cadastro local seguro e recuperação de senha por código de 6 dígitos.
  - Modo Convidado para treino imediato sem cadastro prévio.

### 7. 🏃 Integração com Strava
- Conexão direta de token de acesso no perfil do atleta.
- Sincronização automatizada de sessões de musculação (`WeightTraining`).

---

## 🏛️ Arquitetura & Decisões Técnicas

- **Abordagem Local-First:** Os dados de treinos, histórico e rotinas são mantidos primordialmente em cache local (`localStorage` / IndexedDB), garantindo latência zero e operação contínua sem internet.
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
| **Inteligência Artificial**| Google Gemini API | Modelos Flash para síntese de treinos e cálculo de micronutrientes |
| **Offline / PWA** | Service Worker & Web Manifest | Suporte a instalação, ícones maskable e cache offline completo |
| **Integrações** | Strava API & Firebase Auth | Conexão de sessões esportivas e suporte a autenticação em nuvem |
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
│   │   └── router.js         # Roteamento SPA baseado em hash/views
│   ├── features/
│   │   ├── workout.js        # Motor de execução ativa e cronômetro
│   │   ├── ai-assistant.js   # Integração com API Google Gemini
│   │   ├── nutrition.js      # Contador de macros e micronutrientes
│   │   └── canvas-charts.js  # Gráficos em Canvas 2D e exportação
│   ├── lib/
│   │   ├── state.js          # Gerenciamento de estado e migrações
│   │   └── storage.js        # Persistência Local-First
│   └── views/                # Telas (Home, Workout, Nutrition, Feed, Profile)
├── tools/                    # Utilitários de desenvolvimento
├── index.html                # Ponto de entrada SPA
├── manifest.json             # Manifesto PWA
├── sw.js                     # Service Worker para suporte offline
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

4. **Configuração da IA (Opcional):**
   Para ativar as funcionalidades do Google Gemini, adicione sua chave gratuita do [Google AI Studio](https://aistudio.google.com/) em **Perfil → Chave Gemini**.

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por **Murilo Rogério**.
