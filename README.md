# O LÍDER - Da ruína à supremacia 👑

O LÍDER é um web game de estratégia e gerenciamento narrativo onde você assume o papel de um governante egocêntrico e calculista no comando de uma nação falida. Suas decisões moldarão o futuro do país, a vida de milhões de pessoas e, o mais importante, o tamanho do seu ego.

## 📖 Sobre o Jogo

Neste jogo, você é colocado diante de diversos cenários e crises (desastres naturais, corrupção, guerras, descobertas tecnológicas, protestos) e precisa tomar decisões difíceis. Cada escolha afeta os indicadores principais do país:
- 📊 **Economia**
- ⚔️ **Militar**
- 😐 **Felicidade**
- 🐀 **Corrupção**
- 🌐 **Reputação**
- 👑 **Ego**

O objetivo principal é sobreviver no poder o máximo de turnos possível, evoluindo o país de um *Estado Falido* para uma *Superpotência Mundial*, sem deixar que indicadores críticos despencarem (como economia e felicidade).

## ✨ Funcionalidades Principais

- **Múltiplos Níveis de Dificuldade:** Fácil, Normal e Difícil, afetando os recursos iniciais e a severidade das consequências.
- **Sistema de Eventos Dinâmicos:** Crises e eventos aleatórios com múltiplas opções de escolha que testarão seu lado moral (ou a falta dele).
- **Indicadores Nacionais Realistas:** Acompanhe o Tesouro Nacional (💰) e a População (👥), além de um painel de conselheiros que fornece análises detalhadas do seu governo.
- **Conquistas (Achievements):** Desbloqueie conquistas por suas ações mais notáveis (ou cruéis).
- **Log de Decisões:** Todo líder precisa que seus feitos fiquem registrados para a história.
- **Efeitos Sonoros Imersivos:** Áudio ambiente e SFX interativos ao fazer escolhas, ao entrar em estado crítico e nas telas de vitória ou derrota.
- **Auto-save:** O progresso do jogo é salvo automaticamente localmente (via localStorage), permitindo continuar sua dinastia depois.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno voltado para performance e uma excelente experiência de usuário:

- **[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/):** Base da aplicação, garantindo tipagem forte e componentes reutilizáveis.
- **[Vite](https://vitejs.dev/):** Build tool ultrarrápido para desenvolvimento.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS utilitário para estilização fluida e design responsivo.
- **[shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/):** Componentes acessíveis e customizáveis.
- **[Framer Motion](https://www.framer.com/motion/):** Para animações ricas e transições dinâmicas de interface, essenciais em jogos web.
- **[React Router](https://reactrouter.com/):** Gerenciamento de rotas.

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para iniciar a aplicação no seu ambiente de desenvolvimento:

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- Gerenciador de pacotes (npm, yarn, pnpm ou bun).

### Passo a passo

1. **Instale as dependências:**
```bash
npm install
# ou yarn install
# ou bun install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou yarn dev
# ou bun run dev
```

3. **Acesse no navegador:**
O servidor estará rodando em `http://localhost:5173` ou na porta indicada no seu terminal.

## 📜 Scripts Úteis

- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Cria a versão otimizada de produção (`/dist`).
- `npm run lint`: Executa a verificação de código e estilo (ESLint).
- `npm run preview`: Visualiza o build de produção localmente.
- `npm run test`: Roda os testes configurados com Vitest.

---
*"O povo reclama, mas sem mim estariam pior. Provavelmente."* - O Líder
