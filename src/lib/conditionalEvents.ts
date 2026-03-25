import { type GameEvent, type GameStats } from "./gameData";

export interface ConditionalEvent extends GameEvent {
  condition: (stats: GameStats) => boolean;
  priority: number; // higher = more likely to trigger
}

export const CONDITIONAL_EVENTS: ConditionalEvent[] = [
  // === HIGH CORRUPTION (>= 80) ===
  {
    id: 'mafia_takeover',
    title: 'A Máfia Quer Sua Parte',
    description: 'Organizações criminosas controlam setores inteiros da economia. Eles querem um "acordo" formal com o governo.',
    category: 'political',
    priority: 8,
    condition: (s) => s.corruption >= 80,
    choices: [
      {
        text: 'Aceitar o acordo e lucrar junto',
        effects: { corruption: 10, treasury: 40, reputation: -15, ego: 10 },
        flavor: 'Se não pode vencê-los, junte-se a eles. E lucre.',
      },
      {
        text: 'Declarar guerra ao crime organizado',
        effects: { corruption: -20, military: -10, happiness: 10, treasury: -25 },
        flavor: 'Coragem ou estupidez? O tempo dirá.',
      },
      {
        text: 'Criar uma comissão para "investigar" (e abafar)',
        effects: { corruption: 5, ego: 10, reputation: -5 },
        flavor: 'A arte de parecer fazer algo sem fazer nada.',
      },
    ],
  },
  {
    id: 'whistleblower',
    title: 'Delator Interno',
    description: 'Um funcionário de alto escalão ameaça revelar esquemas de corrupção à imprensa internacional.',
    category: 'political',
    priority: 7,
    condition: (s) => s.corruption >= 70,
    choices: [
      {
        text: 'Suborná-lo com uma fortuna',
        effects: { treasury: -30, corruption: 10, ego: 5 },
        flavor: 'Todo mundo tem um preço. Ainda bem.',
      },
      {
        text: 'Deixá-lo falar e fingir transparência',
        effects: { reputation: 10, corruption: -10, ego: -15, happiness: 5 },
        flavor: 'A verdade liberta. E dói bastante.',
      },
      {
        text: 'Fazê-lo "desaparecer"',
        effects: { corruption: 15, reputation: -20, military: 5, ego: 20 },
        flavor: 'Ele tirou férias permanentes. Num lugar muito distante.',
      },
    ],
  },

  // === LOW HAPPINESS (<= 20) ===
  {
    id: 'mass_exodus',
    title: 'Êxodo em Massa',
    description: 'Milhões tentam fugir do país. Filas intermináveis nas fronteiras. Os mais qualificados partem primeiro.',
    category: 'social',
    priority: 9,
    condition: (s) => s.happiness <= 20,
    choices: [
      {
        text: 'Fechar as fronteiras à força',
        effects: { military: 5, happiness: -10, reputation: -20, ego: 15 },
        flavor: 'Se não podem sair, são felizes aqui. Certo?',
      },
      {
        text: 'Implementar reformas emergenciais',
        effects: { happiness: 15, treasury: -35, economy: 5, ego: -10 },
        flavor: 'Reformas por desespero. Melhor tarde que nunca.',
      },
      {
        text: 'Deixar sair e importar mão de obra barata',
        effects: { population: -3000000, economy: -5, corruption: 10, treasury: 10 },
        flavor: 'Rotatividade de pessoal. Em escala nacional.',
      },
    ],
  },
  {
    id: 'underground_resistance',
    title: 'Resistência Clandestina',
    description: 'Células secretas de resistência sabotam infraestrutura. Panfletos contra você aparecem por toda parte.',
    category: 'political',
    priority: 8,
    condition: (s) => s.happiness <= 25 && s.corruption >= 50,
    choices: [
      {
        text: 'Infiltrar e destruir por dentro',
        effects: { military: 5, corruption: 10, happiness: -5, ego: 15 },
        flavor: 'Espionagem doméstica. Seu passatempo favorito.',
      },
      {
        text: 'Atender algumas das demandas deles',
        effects: { happiness: 15, ego: -15, corruption: -10, reputation: 10 },
        flavor: 'Ceder um pouco para não perder tudo. Pragmático.',
      },
      {
        text: 'Declarar lei marcial',
        effects: { military: 15, happiness: -20, reputation: -15, ego: 20 },
        flavor: 'Quando tudo que você tem é um martelo...',
      },
    ],
  },

  // === HIGH EGO (>= 80) ===
  {
    id: 'cult_of_personality',
    title: 'Culto à Personalidade',
    description: 'Estátuas suas brotam em cada esquina. Seu rosto está no dinheiro, nos selos, nas escolas. As crianças cantam seu nome.',
    category: 'political',
    priority: 7,
    condition: (s) => s.ego >= 80,
    choices: [
      {
        text: 'Abraçar totalmente — renomear a capital',
        effects: { ego: 15, happiness: -10, reputation: -15, treasury: -20 },
        flavor: '"Líderlândia" tem um bom anel.',
      },
      {
        text: 'Recuar discretamente',
        effects: { ego: -20, reputation: 10, happiness: 5 },
        flavor: 'Modéstia? Isso é novo.',
      },
      {
        text: 'Usar o culto para consolidar poder absoluto',
        effects: { ego: 10, military: 10, corruption: 15, happiness: -15 },
        flavor: 'Se já é adorado, por que não reinar eternamente?',
      },
    ],
  },
  {
    id: 'international_mockery',
    title: 'Chacota Internacional',
    description: 'Você virou meme mundial. Líderes estrangeiros riem abertamente. A ONU faz piadas nos corredores.',
    category: 'international',
    priority: 6,
    condition: (s) => s.ego >= 75 && s.reputation <= 30,
    choices: [
      {
        text: 'Ignorar — eles têm inveja',
        effects: { ego: 15, reputation: -10 },
        flavor: 'Incompreendido. Como todos os gênios.',
      },
      {
        text: 'Contratar uma firma de PR internacional',
        effects: { reputation: 15, treasury: -25, ego: -5 },
        flavor: 'Comprar reputação. O jeito moderno.',
      },
      {
        text: 'Retaliar cortando relações diplomáticas',
        effects: { ego: 20, reputation: -20, economy: -10 },
        flavor: 'Isolamento com orgulho. Combinação mortal.',
      },
    ],
  },

  // === HIGH MILITARY (>= 75) ===
  {
    id: 'arms_race',
    title: 'Corrida Armamentista',
    description: 'Seus generais querem armas nucleares. O mundo observa com nervosismo.',
    category: 'military',
    priority: 8,
    condition: (s) => s.military >= 75,
    choices: [
      {
        text: 'Desenvolver o programa nuclear secretamente',
        effects: { military: 15, reputation: -25, treasury: -40, ego: 20 },
        flavor: 'Poder supremo. O preço? Apenas a paz mundial.',
      },
      {
        text: 'Assinar tratado de não-proliferação',
        effects: { reputation: 20, military: -5, ego: -15 },
        flavor: 'Paz. Que coisa chata.',
      },
      {
        text: 'Blefar que já tem armas nucleares',
        effects: { ego: 15, reputation: -10, military: 5 },
        flavor: 'O blefe mais perigoso da história. Emocionante.',
      },
    ],
  },

  // === LOW ECONOMY (<= 15) ===
  {
    id: 'hyperinflation',
    title: 'Hiperinflação Galopante',
    description: 'O dinheiro vale menos que papel higiênico. Pessoas carregam sacolas de notas para comprar pão.',
    category: 'economy',
    priority: 9,
    condition: (s) => s.economy <= 15,
    choices: [
      {
        text: 'Imprimir mais dinheiro (o que pode dar errado?)',
        effects: { economy: -10, treasury: 30, happiness: -10, ego: 10 },
        flavor: 'A inflação é só um número. Um número MUITO grande.',
      },
      {
        text: 'Adotar moeda estrangeira',
        effects: { economy: 15, reputation: -10, ego: -20, happiness: 5 },
        flavor: 'Admitir que sua moeda é inútil. Doloroso.',
      },
      {
        text: 'Reforma monetária radical',
        effects: { economy: 10, treasury: -20, happiness: -5, reputation: 10 },
        flavor: 'Cortar zeros. Literalmente.',
      },
    ],
  },

  // === HIGH REPUTATION (>= 70) ===
  {
    id: 'un_seat',
    title: 'Convite para o Conselho de Segurança',
    description: 'Sua nação é convidada para uma cadeira temporária no Conselho de Segurança da ONU. Prestígio máximo.',
    category: 'international',
    priority: 7,
    condition: (s) => s.reputation >= 70,
    choices: [
      {
        text: 'Aceitar e usar para influência global',
        effects: { reputation: 15, ego: 15, economy: 5 },
        flavor: 'Finalmente, o palco que você merece.',
      },
      {
        text: 'Usar a posição para denunciar potências imperialistas',
        effects: { reputation: -10, ego: 25, happiness: 10 },
        flavor: 'Morder a mão que alimenta. Corajoso... ou suicida.',
      },
      {
        text: 'Vender seu voto ao maior lance',
        effects: { treasury: 50, corruption: 20, reputation: -15 },
        flavor: 'Democracia internacional é apenas outro mercado.',
      },
    ],
  },

  // === LOW MILITARY (<= 15) ===
  {
    id: 'invasion_threat',
    title: 'Ameaça de Invasão',
    description: 'Sem forças armadas decentes, um vizinho agressivo posiciona tropas na fronteira. Você está indefeso.',
    category: 'military',
    priority: 9,
    condition: (s) => s.military <= 15,
    choices: [
      {
        text: 'Contratar mercenários internacionais',
        effects: { military: 15, treasury: -35, corruption: 10 },
        flavor: 'Defesa terceirizada. O capitalismo militar.',
      },
      {
        text: 'Implorar proteção a uma superpotência',
        effects: { military: 10, reputation: -10, ego: -20 },
        flavor: 'De líder soberano a vassalo. Que queda.',
      },
      {
        text: 'Armar a população civil',
        effects: { military: 10, happiness: -10, corruption: 5, ego: 10 },
        flavor: 'O que pode dar errado com civis armados?',
      },
    ],
  },

  // === HIGH HAPPINESS (>= 75) ===
  {
    id: 'golden_age',
    title: 'Era de Ouro Cultural',
    description: 'Artistas florescem, a cultura nacional vira referência mundial. Turistas inundam as cidades.',
    category: 'social',
    priority: 6,
    condition: (s) => s.happiness >= 75,
    choices: [
      {
        text: 'Investir em mais cultura e turismo',
        effects: { economy: 10, happiness: 10, treasury: -15, reputation: 10 },
        flavor: 'Pão e circo. Mas dessa vez, arte de verdade.',
      },
      {
        text: 'Reivindicar todo o mérito cultural',
        effects: { ego: 20, happiness: -5, reputation: -5 },
        flavor: '"Eu criei essa era dourada." Claro que sim.',
      },
      {
        text: 'Censurar arte que critique o governo',
        effects: { ego: 15, happiness: -15, corruption: 10, reputation: -10 },
        flavor: 'Arte é linda. Desde que concorde com você.',
      },
    ],
  },

  // === ECONOMY BOOMING (>= 70) ===
  {
    id: 'wealth_inequality',
    title: 'Desigualdade Extrema',
    description: 'A economia cresce, mas só para os ricos. Bilionários surgem enquanto favelas se expandem.',
    category: 'economy',
    priority: 7,
    condition: (s) => s.economy >= 70 && s.happiness <= 50,
    choices: [
      {
        text: 'Taxar os ultra-ricos',
        effects: { economy: -5, happiness: 15, treasury: 30, ego: -5 },
        flavor: 'Robin Hood de terno. Inesperado.',
      },
      {
        text: 'Proteger os bilionários — eles geram empregos',
        effects: { economy: 5, happiness: -10, corruption: 10, treasury: 15 },
        flavor: 'A velha mentira do "gotejamento". Clássica.',
      },
      {
        text: 'Criar programas sociais mínimos para acalmar',
        effects: { happiness: 5, treasury: -10, ego: 5 },
        flavor: 'Migalhas estratégicas. Suficiente para evitar revoltas.',
      },
    ],
  },

  // === TREASURY VERY LOW (<= 20) ===
  {
    id: 'debt_crisis',
    title: 'Crise da Dívida Soberana',
    description: 'Credores internacionais batem à porta. O FMI oferece resgate com condições draconianas.',
    category: 'economy',
    priority: 9,
    condition: (s) => s.treasury <= 20,
    choices: [
      {
        text: 'Aceitar o resgate do FMI',
        effects: { treasury: 50, economy: -10, happiness: -15, ego: -20 },
        flavor: 'Soberania vendida por moedas. Literalmente.',
      },
      {
        text: 'Dar calote na dívida',
        effects: { reputation: -25, ego: 20, treasury: 15, economy: -5 },
        flavor: '"Dívida? Que dívida?" — a estratégia argentina.',
      },
      {
        text: 'Vender ativos nacionais para pagar',
        effects: { treasury: 35, economy: -5, happiness: -10, corruption: 10 },
        flavor: 'Liquidação nacional. Tudo deve ir.',
      },
    ],
  },
];
