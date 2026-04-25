const airports = {
  SAO: {
    code: 'SAO',
    city: 'São Paulo',
    country: 'Brasil',
    region: 'BR',
    airports: ['GRU', 'CGH', 'VCP'],
    aliases: ['sao paulo', 'são paulo', 'sp', 'gru', 'cgh', 'vcp']
  },
  RIO: {
    code: 'RIO',
    city: 'Rio de Janeiro',
    country: 'Brasil',
    region: 'BR',
    airports: ['GIG', 'SDU'],
    aliases: ['rio de janeiro', 'rio', 'gig', 'sdu']
  },
  BSB: {
    code: 'BSB',
    city: 'Brasília',
    country: 'Brasil',
    region: 'BR',
    airports: ['BSB'],
    aliases: ['brasilia', 'brasília', 'bsb']
  },
  REC: {
    code: 'REC',
    city: 'Recife',
    country: 'Brasil',
    region: 'BR',
    airports: ['REC'],
    aliases: ['recife', 'rec']
  },
  SSA: {
    code: 'SSA',
    city: 'Salvador',
    country: 'Brasil',
    region: 'BR',
    airports: ['SSA'],
    aliases: ['salvador', 'ssa']
  },
  FOR: {
    code: 'FOR',
    city: 'Fortaleza',
    country: 'Brasil',
    region: 'BR',
    airports: ['FOR'],
    aliases: ['fortaleza', 'for']
  },
  NYC: {
    code: 'NYC',
    city: 'Nova York',
    country: 'Estados Unidos',
    region: 'NA',
    airports: ['JFK', 'EWR', 'LGA'],
    aliases: ['nova york', 'new york', 'nyc', 'jfk', 'ewr', 'lga']
  },
  MIA: {
    code: 'MIA',
    city: 'Miami',
    country: 'Estados Unidos',
    region: 'NA',
    airports: ['MIA', 'FLL'],
    aliases: ['miami', 'fort lauderdale', 'mia', 'fll']
  },
  ORL: {
    code: 'ORL',
    city: 'Orlando',
    country: 'Estados Unidos',
    region: 'NA',
    airports: ['MCO', 'SFB'],
    aliases: ['orlando', 'mco', 'sfb']
  },
  LIS: {
    code: 'LIS',
    city: 'Lisboa',
    country: 'Portugal',
    region: 'EU',
    airports: ['LIS'],
    aliases: ['lisboa', 'lisbon', 'lis']
  },
  PAR: {
    code: 'PAR',
    city: 'Paris',
    country: 'França',
    region: 'EU',
    airports: ['CDG', 'ORY'],
    aliases: ['paris', 'cdg', 'ory']
  },
  LON: {
    code: 'LON',
    city: 'Londres',
    country: 'Reino Unido',
    region: 'EU',
    airports: ['LHR', 'LGW', 'STN', 'LTN', 'LCY'],
    aliases: ['londres', 'london', 'lon', 'lhr', 'lgw', 'stn', 'ltn', 'lcy']
  },
  MAD: {
    code: 'MAD',
    city: 'Madri',
    country: 'Espanha',
    region: 'EU',
    airports: ['MAD'],
    aliases: ['madri', 'madrid', 'mad']
  },
  BUE: {
    code: 'BUE',
    city: 'Buenos Aires',
    country: 'Argentina',
    region: 'SA',
    airports: ['EZE', 'AEP'],
    aliases: ['buenos aires', 'bue', 'eze', 'aep']
  },
  SCL: {
    code: 'SCL',
    city: 'Santiago',
    country: 'Chile',
    region: 'SA',
    airports: ['SCL'],
    aliases: ['santiago', 'santiago do chile', 'scl']
  }
};

const regionProfiles = {
  domestic: {
    label: 'Nacional',
    cashBase: 420,
    milesBase: '10k a 25k milhas',
    recommendedPrograms: ['LATAM Pass', 'Smiles', 'Azul Fidelidade'],
    allianceHint: 'Compare voos diretos com conexões por hubs como GRU, BSB, CNF, VCP e REC.',
    consolidatorHint: 'Agencias nacionais podem ter tarifas com bagagem ou condicoes melhores que agregadores.'
  },
  regional: {
    label: 'América do Sul',
    cashBase: 980,
    milesBase: '18k a 45k milhas',
    recommendedPrograms: ['LATAM Pass', 'Smiles', 'Azul Fidelidade', 'programas de bancos'],
    allianceHint: 'Compare ida e volta tradicional com trechos separados por hubs sul-americanos.',
    consolidatorHint: 'Consolidators costumam ajudar em rotas com conexões e regras tarifárias menos óbvias.'
  },
  international: {
    label: 'Internacional',
    cashBase: 2800,
    milesBase: '35k a 90k milhas',
    recommendedPrograms: ['LATAM Pass', 'Smiles', 'Azul Fidelidade', 'TAP Miles&Go', 'LifeMiles'],
    allianceHint: 'Busque a mesma rota por Star Alliance, Oneworld e SkyTeam antes de decidir.',
    consolidatorHint: 'Agências especializadas podem encontrar combinações, classes tarifárias e emissão por milhas assistida.'
  }
};

const cabinMultipliers = {
  economy: 1,
  premium: 1.7,
  business: 3.2,
  first: 5.5
};

const flexibilityLabels = {
  exact: 'datas exatas',
  threeDays: 'janela de +/- 3 dias',
  week: 'janela de uma semana',
  month: 'mês inteiro'
};

const dateSearchModeLabels = {
  exact: 'datas exatas',
  flexibleMonth: 'mês específico sem datas fixas',
  nextThreeMonths: 'próximos 3 meses',
  nextSixMonths: 'próximos 6 meses',
  nextYear: 'próximos 12 meses'
};

const durationProfiles = {
  quick: {
    label: 'viagem curta',
    days: [3, 4]
  },
  oneWeek: {
    label: '5, 6 ou 7 dias',
    days: [5, 6, 7]
  },
  standard: {
    label: '7, 8 ou 10 dias',
    days: [7, 8, 10]
  },
  twoWeeks: {
    label: '12, 14 ou 16 dias',
    days: [12, 14, 16]
  }
};

const sourceLinks = {
  googleFlights: 'https://www.google.com/travel/flights',
  skyscanner: 'https://www.skyscanner.com.br/',
  kayak: 'https://www.kayak.com.br/flights',
  airlineSearch: 'https://www.google.com/search?q=site%3A.com+passagens+aereas+companhia+aerea',
  milesPrograms: 'https://www.google.com/search?q=programas+de+milhas+passagens+aereas',
  travelAgencies: 'https://www.google.com/search?q=agencia+de+viagens+tarifa+consolidator+passagem+aerea',
  priceAlerts: 'https://www.google.com/search?q=alerta+de+preco+passagem+aerea'
};

module.exports = {
  airports,
  regionProfiles,
  cabinMultipliers,
  flexibilityLabels,
  dateSearchModeLabels,
  durationProfiles,
  sourceLinks
};
