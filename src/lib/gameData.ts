export interface GameStats {
  economy: number;
  military: number;
  happiness: number;
  corruption: number;
  reputation: number;
  ego: number;
  treasury: number;
  population: number;
  turn: number;
}

export interface Choice {
  text: string;
  effects: Partial<GameStats>;
  flavor: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'economy' | 'military' | 'social' | 'political' | 'international';
  choices: Choice[];
}

export type NationTier = 'falida' | 'subdesenvolvida' | 'emergente' | 'desenvolvida' | 'potencia' | 'superpotencia';

export function getNationTier(stats: GameStats): NationTier {
  const score = (stats.economy + stats.military + stats.reputation) / 3;
  if (score < 20) return 'falida';
  if (score < 35) return 'subdesenvolvida';
  if (score < 50) return 'emergente';
  if (score < 70) return 'desenvolvida';
  if (score < 85) return 'potencia';
  return 'superpotencia';
}

export const TIER_LABELS: Record<NationTier, string> = {
  falida: 'Estado Falido',
  subdesenvolvida: 'Nação Subdesenvolvida',
  emergente: 'Economia Emergente',
  desenvolvida: 'Nação Desenvolvida',
  potencia: 'Potência Regional',
  superpotencia: 'Superpotência Mundial',
};

export const TIER_COLORS: Record<NationTier, string> = {
  falida: 'text-blood',
  subdesenvolvida: 'text-muted-foreground',
  emergente: 'text-foreground',
  desenvolvida: 'text-primary',
  potencia: 'text-gold',
  superpotencia: 'text-gold',
};

export const INITIAL_STATS: GameStats = {
  economy: 8,
  military: 5,
  happiness: 12,
  corruption: 75,
  reputation: 3,
  ego: 50,
  treasury: 100,
  population: 15_000_000,
  turn: 1,
};

export const LEADER_QUOTES = [
  "O povo? O povo que se vire. Eu tenho uma nação pra construir.",
  "Eles não entendem o fardo de carregar esse país nas costas.",
  "A história será gentil comigo, pois eu pretendo escrevê-la.",
  "Cada decisão minha é genial. Eles só não perceberam ainda.",
  "Sacrifícios são necessários. Os deles, claro. Não os meus.",
  "Sou o único que pode salvar esse país. Modéstia à parte.",
  "O povo reclama, mas sem mim estariam pior. Provavelmente.",
  "Meu legado será grandioso. A que custo? Irrelevante.",
  "Democracia é linda. Desde que concordem comigo.",
  "Errar é humano. Admitir o erro é para os fracos.",
];

export const EVENTS: GameEvent[] = [
  {
    id: 'famine_crisis',
    title: 'Crise de Fome Generalizada',
    description: 'Milhões passam fome nas ruas. A mídia internacional documenta crianças desnutridas. Seu assessor aguarda ordens.',
    category: 'social',
    choices: [
      {
        text: 'Abrir os cofres e distribuir alimentos',
        effects: { happiness: 15, treasury: -40, ego: -5, reputation: 10 },
        flavor: 'Generosidade não combina com você, mas a mídia aplaude.',
      },
      {
        text: 'Culpar o governo anterior e ignorar',
        effects: { happiness: -10, corruption: 5, ego: 15, treasury: 0 },
        flavor: 'A culpa nunca é sua. Brilhante estratégia de sempre.',
      },
      {
        text: 'Usar a crise para negociar ajuda internacional',
        effects: { reputation: 8, treasury: 30, happiness: 5, ego: 10 },
        flavor: 'Transformar tragédia em oportunidade. Um clássico.',
      },
    ],
  },
  {
    id: 'military_coup_attempt',
    title: 'Tentativa de Golpe Militar',
    description: 'Generais descontentes planejam sua queda. Você foi alertado por um espião leal. O que fazer?',
    category: 'military',
    choices: [
      {
        text: 'Prender todos os conspiradores',
        effects: { military: -10, corruption: 10, ego: 20, happiness: -5 },
        flavor: 'Paranoia? Não. Precaução genial.',
      },
      {
        text: 'Negociar e dar mais poder aos militares',
        effects: { military: 15, corruption: 15, ego: -10, treasury: -20 },
        flavor: 'Compartilhar poder dói, mas mantém sua cabeça no lugar.',
      },
      {
        text: 'Reformar as forças armadas completamente',
        effects: { military: -5, corruption: -15, reputation: 10, treasury: -30 },
        flavor: 'Uma decisão racional. Que estranho vindo de você.',
      },
    ],
  },
  {
    id: 'oil_discovery',
    title: 'Descoberta de Petróleo',
    description: 'Vastas reservas de petróleo foram encontradas. Corporações internacionais estão batendo na sua porta.',
    category: 'economy',
    choices: [
      {
        text: 'Nacionalizar completamente',
        effects: { economy: 20, reputation: -15, ego: 20, treasury: 50 },
        flavor: 'O petróleo é NOSSO. Quer dizer, MEU.',
      },
      {
        text: 'Fazer parcerias com corporações estrangeiras',
        effects: { economy: 15, reputation: 10, corruption: 10, treasury: 35 },
        flavor: 'Dividir o bolo... mas ficar com a maior fatia.',
      },
      {
        text: 'Criar um fundo soberano para o povo',
        effects: { economy: 10, happiness: 15, reputation: 15, ego: -10 },
        flavor: 'Para o povo? Quem é você e o que fez com o líder?',
      },
    ],
  },
  {
    id: 'protests',
    title: 'Protestos nas Ruas',
    description: 'Centenas de milhares marcham contra seu governo. "Fora ditador!" ecoam os gritos.',
    category: 'political',
    choices: [
      {
        text: 'Reprimir com força total',
        effects: { happiness: -20, military: 5, reputation: -15, ego: 15, corruption: 10 },
        flavor: 'Ordem será mantida. A qualquer custo.',
      },
      {
        text: 'Fazer concessões simbólicas',
        effects: { happiness: 5, ego: -5, reputation: 5, corruption: 5 },
        flavor: 'Jogar migalhas funciona mais do que deveria.',
      },
      {
        text: 'Abrir diálogo genuíno com líderes populares',
        effects: { happiness: 15, reputation: 10, ego: -15, corruption: -10 },
        flavor: 'Ouvir o povo? Que conceito revolucionário.',
      },
    ],
  },
  {
    id: 'foreign_aid',
    title: 'Oferta de Ajuda Internacional',
    description: 'Uma potência mundial oferece bilhões em ajuda. Mas com condições: reformas democráticas.',
    category: 'international',
    choices: [
      {
        text: 'Aceitar todas as condições',
        effects: { treasury: 60, reputation: 15, ego: -20, corruption: -10 },
        flavor: 'Submissão temporária. Ou é o que você diz a si mesmo.',
      },
      {
        text: 'Recusar orgulhosamente',
        effects: { ego: 25, reputation: -5, happiness: -5, treasury: 0 },
        flavor: 'Soberania! Mesmo que seu povo passe fome.',
      },
      {
        text: 'Negociar termos mais favoráveis',
        effects: { treasury: 30, reputation: 8, ego: 5, corruption: 5 },
        flavor: 'A arte do acordo. Seu talento natural.',
      },
    ],
  },
  {
    id: 'education_crisis',
    title: 'Sistema Educacional em Colapso',
    description: 'Escolas fechando, professores fugindo do país. Uma geração inteira está sendo perdida.',
    category: 'social',
    choices: [
      {
        text: 'Investir pesado em educação',
        effects: { economy: 5, happiness: 10, treasury: -45, reputation: 10 },
        flavor: 'Investimento de longo prazo. Não combina com sua impaciência.',
      },
      {
        text: 'Criar propaganda disfarçada de educação',
        effects: { ego: 20, corruption: 15, happiness: -5, treasury: -15 },
        flavor: 'Ensinar o povo a amar o líder. Eficiente.',
      },
      {
        text: 'Privatizar tudo e lavar as mãos',
        effects: { economy: 8, happiness: -10, corruption: 10, treasury: 20 },
        flavor: 'Problema do mercado agora. Brilhante.',
      },
    ],
  },
  {
    id: 'border_conflict',
    title: 'Conflito na Fronteira',
    description: 'País vizinho ocupa território disputado. Soldados estão em posição. O mundo observa.',
    category: 'military',
    choices: [
      {
        text: 'Declarar guerra imediatamente',
        effects: { military: 10, economy: -15, happiness: -10, ego: 25, reputation: -10 },
        flavor: 'Guerra! A solução favorita dos líderes inseguros.',
      },
      {
        text: 'Buscar mediação internacional',
        effects: { reputation: 15, ego: -10, military: -5 },
        flavor: 'Diplomacia. Chato, mas funciona.',
      },
      {
        text: 'Fazer acordo secreto cedendo o território',
        effects: { corruption: 15, treasury: 25, reputation: -10, ego: -5 },
        flavor: 'Vender o país por baixo dos panos. Clássico.',
      },
    ],
  },
  {
    id: 'pandemic',
    title: 'Pandemia Devastadora',
    description: 'Um vírus mortal se espalha. Hospitais lotados. O mundo fecha fronteiras.',
    category: 'social',
    choices: [
      {
        text: 'Lockdown rigoroso e investir em saúde',
        effects: { economy: -15, happiness: -5, reputation: 15, treasury: -35, population: -500000 },
        flavor: 'Salvar vidas custa caro. Mas a história agradece.',
      },
      {
        text: 'Negar a pandemia e manter tudo aberto',
        effects: { economy: 5, happiness: -15, reputation: -20, ego: 20, population: -2000000 },
        flavor: '"É só uma gripezinha." Palavras históricas.',
      },
      {
        text: 'Usar a crise para consolidar poder',
        effects: { ego: 25, corruption: 20, military: 10, happiness: -15, reputation: -10 },
        flavor: 'Nunca desperdice uma boa crise.',
      },
    ],
  },
  {
    id: 'tech_boom',
    title: 'Revolução Tecnológica',
    description: 'Startups surgem do nada. Jovens brilhantes querem transformar o país em um hub tech.',
    category: 'economy',
    choices: [
      {
        text: 'Investir em infraestrutura digital',
        effects: { economy: 18, reputation: 12, treasury: -40, happiness: 8 },
        flavor: 'Aposta no futuro. Incomum para alguém tão imediatista.',
      },
      {
        text: 'Criar sistema de vigilância com a tecnologia',
        effects: { ego: 20, corruption: 15, military: 10, happiness: -10 },
        flavor: 'Controle total. O sonho de todo líder autoritário.',
      },
      {
        text: 'Taxar pesadamente as empresas tech',
        effects: { treasury: 35, economy: -5, reputation: -8 },
        flavor: 'Espremer até a última gota. Sustentável? Quem liga.',
      },
    ],
  },
  {
    id: 'corruption_scandal',
    title: 'Escândalo de Corrupção',
    description: 'Documentos vazados mostram desvio de bilhões. Seu nome aparece em tudo.',
    category: 'political',
    choices: [
      {
        text: 'Culpar assessores e demitir todos',
        effects: { ego: 15, corruption: -5, happiness: -5, reputation: -5 },
        flavor: 'Os bodes expiatórios servem para isso.',
      },
      {
        text: 'Criar uma CPI para investigar... a si mesmo',
        effects: { reputation: 10, ego: -10, corruption: -15, happiness: 10 },
        flavor: 'Transparência? Desconfortável, mas estratégico.',
      },
      {
        text: 'Fechar a mídia que publicou os documentos',
        effects: { ego: 20, corruption: 10, reputation: -20, happiness: -15 },
        flavor: 'Se ninguém publica, o problema não existe.',
      },
    ],
  },
  {
    id: 'natural_disaster',
    title: 'Desastre Natural Catastrófico',
    description: 'Terremoto devastador. Cidades em ruínas. Milhares desabrigados. O mundo envia condolências.',
    category: 'social',
    choices: [
      {
        text: 'Mobilizar todos os recursos para reconstrução',
        effects: { happiness: 15, treasury: -50, reputation: 10, economy: -10 },
        flavor: 'Fazer a coisa certa. Deve ter doído.',
      },
      {
        text: 'Pedir ajuda internacional e desviar parte dos fundos',
        effects: { treasury: 20, corruption: 20, reputation: -5, ego: 10 },
        flavor: 'Até na tragédia, uma oportunidade de lucro.',
      },
      {
        text: 'Usar o desastre para declarar estado de emergência e acumular poder',
        effects: { ego: 25, military: 10, corruption: 15, happiness: -15, reputation: -10 },
        flavor: 'Caos é uma escada. E você sabe escalá-la.',
      },
    ],
  },
  {
    id: 'immigration_wave',
    title: 'Onda Migratória',
    description: 'Milhares de refugiados chegam à fronteira fugindo de guerras. A opinião pública está dividida.',
    category: 'political',
    choices: [
      {
        text: 'Abrir as fronteiras e acolher',
        effects: { happiness: -5, reputation: 15, economy: 5, population: 2000000 },
        flavor: 'Humanidade. Ou mão de obra barata. Depende de como você vê.',
      },
      {
        text: 'Fechar fronteiras completamente',
        effects: { ego: 15, reputation: -15, happiness: 5, military: 5 },
        flavor: 'Muro! Muro! O grito favorito dos demagogos.',
      },
      {
        text: 'Aceitar seletivamente apenas mão de obra qualificada',
        effects: { economy: 10, reputation: 5, ego: 5, corruption: 5 },
        flavor: 'Pragmatismo frio. Sua especialidade.',
      },
    ],
  },
  {
    id: 'media_mogul',
    title: 'O Magnata da Mídia',
    description: 'Um bilionário comprou todos os canais de TV. Ele oferece cobertura favorável em troca de "favores".',
    category: 'political',
    choices: [
      {
        text: 'Aceitar a aliança',
        effects: { ego: 15, corruption: 15, happiness: 5, reputation: -5 },
        flavor: 'Propaganda 24h. O sonho de todo líder.',
      },
      {
        text: 'Quebrar o monopólio midiático',
        effects: { corruption: -10, happiness: 10, treasury: -15, ego: -10 },
        flavor: 'Liberdade de imprensa. Que conceito incômodo.',
      },
      {
        text: 'Nacionalizar a mídia',
        effects: { ego: 20, reputation: -15, corruption: 10, happiness: -10 },
        flavor: 'Se a mídia é sua, a verdade também é.',
      },
    ],
  },
  {
    id: 'drug_trade',
    title: 'Rota do Narcotráfico',
    description: 'Seu país se tornou corredor do tráfico internacional. Cartéis oferecem "contribuições" generosas.',
    category: 'economy',
    choices: [
      {
        text: 'Aceitar as "contribuições" e vista grossa',
        effects: { treasury: 35, corruption: 20, reputation: -15, happiness: -5 },
        flavor: 'Dinheiro não tem cheiro. Especialmente esse.',
      },
      {
        text: 'Guerra às drogas total',
        effects: { military: 10, treasury: -30, corruption: -10, happiness: -5, reputation: 10 },
        flavor: 'Uma guerra que ninguém vence. Mas fica bonito no currículo.',
      },
      {
        text: 'Legalizar e regulamentar',
        effects: { economy: 10, treasury: 20, reputation: 5, happiness: 5, corruption: -5 },
        flavor: 'Se não pode vencer, tribute. Genial.',
      },
    ],
  },
  {
    id: 'space_program',
    title: 'Programa Espacial',
    description: 'Cientistas propõem um programa espacial nacional. É caro, mas o prestígio seria imenso.',
    category: 'economy',
    choices: [
      {
        text: 'Investir bilhões no programa',
        effects: { treasury: -50, reputation: 20, ego: 15, economy: 5 },
        flavor: 'Para o espaço! Enquanto o povo não tem esgoto.',
      },
      {
        text: 'Parceria com agência espacial estrangeira',
        effects: { treasury: -15, reputation: 10, economy: 5, ego: -5 },
        flavor: 'Dividir a glória. Pelo menos sai mais barato.',
      },
      {
        text: 'Cancelar e investir em infraestrutura básica',
        effects: { happiness: 10, economy: 10, treasury: -20, ego: -10 },
        flavor: 'Esgoto antes de foguetes. Que prioridade chata.',
      },
    ],
  },
  {
    id: 'religious_tension',
    title: 'Tensão Religiosa',
    description: 'Conflitos entre grupos religiosos ameaçam rasgar o tecido social. Líderes religiosos pedem audiência.',
    category: 'social',
    choices: [
      {
        text: 'Declarar estado laico e proibir interferência religiosa',
        effects: { happiness: -10, reputation: 10, ego: 10, corruption: -5 },
        flavor: 'Separar igreja e estado. Alguém vai ficar bravo.',
      },
      {
        text: 'Favorecer o grupo majoritário',
        effects: { happiness: 5, reputation: -15, ego: 15, corruption: 10 },
        flavor: 'Dividir para conquistar. A tática mais antiga.',
      },
      {
        text: 'Mediar diálogo inter-religioso',
        effects: { happiness: 10, reputation: 10, ego: -10 },
        flavor: 'Paz entre religiões? Você é otimista demais.',
      },
    ],
  },
  {
    id: 'environmental_disaster',
    title: 'Catástrofe Ambiental',
    description: 'Rios envenenados, florestas desmatadas. ONGs internacionais ameaçam sanções ambientais.',
    category: 'international',
    choices: [
      {
        text: 'Criar reservas ambientais e regulamentação rígida',
        effects: { economy: -10, reputation: 15, happiness: 5, treasury: -20 },
        flavor: 'Salvar o planeta. Ou pelo menos parecer que tenta.',
      },
      {
        text: 'Ignorar e acelerar a exploração',
        effects: { economy: 10, treasury: 25, reputation: -20, happiness: -5 },
        flavor: 'Árvores não votam.',
      },
      {
        text: 'Vender créditos de carbono fraudulentos',
        effects: { treasury: 20, corruption: 15, reputation: -5, ego: 10 },
        flavor: 'Greenwashing: o crime perfeito do século XXI.',
      },
    ],
  },
  {
    id: 'cyber_attack',
    title: 'Ataque Cibernético Nacional',
    description: 'Hackers derrubaram bancos, hospitais e infraestrutura. O país está no escuro digital.',
    category: 'military',
    choices: [
      {
        text: 'Contra-atacar com sua própria unidade hacker',
        effects: { military: 10, reputation: -10, ego: 15, treasury: -20 },
        flavor: 'Cyberguerra. A guerra do futuro já chegou.',
      },
      {
        text: 'Investir em defesa cibernética robusta',
        effects: { military: 5, economy: 5, treasury: -30, reputation: 5 },
        flavor: 'Prevenção. Chato, mas necessário.',
      },
      {
        text: 'Culpar uma nação rival e escalar tensões',
        effects: { ego: 15, military: 5, reputation: -15, happiness: -5 },
        flavor: 'Inimigo externo: a distração perfeita.',
      },
    ],
  },
  {
    id: 'sports_victory',
    title: 'Vitória Esportiva Histórica',
    description: 'Sua seleção venceu a Copa do Mundo! O país inteiro celebra nas ruas.',
    category: 'social',
    choices: [
      {
        text: 'Aproveitar a euforia para aprovar leis impopulares',
        effects: { ego: 15, corruption: 10, happiness: -5 },
        flavor: 'Enquanto celebram, você legisla. Eficiente.',
      },
      {
        text: 'Celebrar junto e investir em esportes',
        effects: { happiness: 15, treasury: -15, reputation: 5, ego: 5 },
        flavor: 'Pão e circo. O circo está excelente hoje.',
      },
      {
        text: 'Reivindicar a vitória como resultado da sua liderança',
        effects: { ego: 20, happiness: -5, reputation: -5 },
        flavor: '"Sem minha gestão, jamais teriam vencido."',
      },
    ],
  },
];

import { CONDITIONAL_EVENTS } from "./conditionalEvents";

export function getRandomEvent(excludeIds: string[] = [], stats?: GameStats): GameEvent {
  // Check for conditional events first (30% chance if eligible)
  if (stats && Math.random() < 0.3) {
    const eligibleConditional = CONDITIONAL_EVENTS
      .filter(e => !excludeIds.includes(e.id) && e.condition(stats))
      .sort((a, b) => b.priority - a.priority);
    
    if (eligibleConditional.length > 0) {
      // Pick from top 3 by priority with some randomness
      const topPicks = eligibleConditional.slice(0, 3);
      return topPicks[Math.floor(Math.random() * topPicks.length)];
    }
  }

  const available = EVENTS.filter(e => !excludeIds.includes(e.id));
  const pool = available.length > 0 ? available : EVENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomQuote(): string {
  return LEADER_QUOTES[Math.floor(Math.random() * LEADER_QUOTES.length)];
}

export function clampStat(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function applyEffects(stats: GameStats, effects: Partial<GameStats>): GameStats {
  return {
    ...stats,
    economy: clampStat((stats.economy || 0) + (effects.economy || 0)),
    military: clampStat((stats.military || 0) + (effects.military || 0)),
    happiness: clampStat((stats.happiness || 0) + (effects.happiness || 0)),
    corruption: clampStat((stats.corruption || 0) + (effects.corruption || 0)),
    reputation: clampStat((stats.reputation || 0) + (effects.reputation || 0)),
    ego: clampStat((stats.ego || 0) + (effects.ego || 0)),
    treasury: Math.max(0, (stats.treasury || 0) + (effects.treasury || 0)),
    population: Math.max(1000000, (stats.population || 0) + (effects.population || 0)),
    turn: stats.turn,
  };
}

export function checkGameOver(stats: GameStats): { over: boolean; reason?: string; won?: boolean } {
  if (stats.happiness <= 0 && stats.military <= 10) {
    return { over: true, reason: 'Revolução popular! O povo derrubou seu governo.', won: false };
  }
  if (stats.treasury <= 0 && stats.economy <= 5) {
    return { over: true, reason: 'Falência total. Seu país deixou de existir como estado.', won: false };
  }
  if (stats.ego >= 100 && stats.happiness <= 10) {
    return { over: true, reason: 'Seu ego inflou tanto que explodiu. Literalmente.', won: false };
  }
  const tier = getNationTier(stats);
  if (tier === 'superpotencia') {
    return { over: true, reason: 'Parabéns! Você transformou uma nação falida em superpotência. A que custo? Irrelevante.', won: true };
  }
  return { over: false };
}
