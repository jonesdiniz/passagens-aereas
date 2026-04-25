const {
  airports,
  regionProfiles,
  cabinMultipliers,
  flexibilityLabels,
  dateSearchModeLabels,
  durationProfiles,
  sourceLinks
} = require('../data/searchKnowledgeBase');

const DEFAULT_OPTIONS = {
  passengers: 1,
  cabin: 'economy',
  flexibility: 'threeDays',
  dateSearchMode: 'nextSixMonths',
  tripDurations: [5, 6, 7],
  includeNearbyAirports: true,
  preferredStrategy: 'commercialAgreements'
};

const normalizeText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const titleCase = (value = '') => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\b\w/g, char => char.toUpperCase());

const parsePassengerCount = (passengers) => {
  const parsed = Number.parseInt(passengers, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_OPTIONS.passengers;
  }
  return Math.min(Math.max(parsed, 1), 9);
};

const parseTripDurations = (tripDurations, durationProfile) => {
  if (durationProfile && durationProfiles[durationProfile]) {
    return durationProfiles[durationProfile].days;
  }

  const rawDurations = Array.isArray(tripDurations)
    ? tripDurations
    : tripDurations?.toString().split(',');

  const parsedDurations = (rawDurations || [])
    .map(duration => Number.parseInt(duration, 10))
    .filter(duration => Number.isInteger(duration) && duration >= 1 && duration <= 45);

  return parsedDurations.length > 0
    ? [...new Set(parsedDurations)].slice(0, 5)
    : DEFAULT_OPTIONS.tripDurations;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const addMonths = (date, months) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

const startOfDay = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const endOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0);

const formatDate = (date) => date.toISOString().split('T')[0];

const formatDateBR = (date) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).format(date);

const parseTargetMonth = (targetMonth) => {
  if (!targetMonth || !/^\d{4}-\d{2}$/.test(targetMonth)) {
    return null;
  }

  const [year, month] = targetMonth.split('-').map(Number);
  if (month < 1 || month > 12) {
    return null;
  }

  return {
    year,
    monthIndex: month - 1
  };
};

const normalizeBoolean = (value, fallback) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'sim'].includes(value.toLowerCase());
  }

  return fallback;
};

const normalizeLocation = (rawLocation) => {
  const original = rawLocation.toString().trim();
  const normalized = normalizeText(original);
  const matchedLocation = Object.values(airports).find(location =>
    location.aliases.some(alias => normalizeText(alias) === normalized)
  );

  if (matchedLocation) {
    return {
      input: original,
      code: matchedLocation.code,
      city: matchedLocation.city,
      country: matchedLocation.country,
      region: matchedLocation.region,
      airports: matchedLocation.airports,
      isKnown: true
    };
  }

  return {
    input: original,
    code: original.toUpperCase().slice(0, 3),
    city: titleCase(original),
    country: 'Não identificado',
    region: 'UNKNOWN',
    airports: [original.toUpperCase().slice(0, 3)],
    isKnown: false
  };
};

const normalizeSearchParams = (searchParams) => {
  const origin = normalizeLocation(searchParams.origin);
  const destination = normalizeLocation(searchParams.destination);
  const cabin = cabinMultipliers[searchParams.cabin]
    ? searchParams.cabin
    : DEFAULT_OPTIONS.cabin;
  const flexibility = flexibilityLabels[searchParams.flexibility]
    ? searchParams.flexibility
    : DEFAULT_OPTIONS.flexibility;
  const dateSearchMode = dateSearchModeLabels[searchParams.dateSearchMode]
    ? searchParams.dateSearchMode
    : searchParams.departureDate
      ? 'exact'
      : DEFAULT_OPTIONS.dateSearchMode;
  const tripDurations = parseTripDurations(searchParams.tripDurations, searchParams.durationProfile);

  return {
    origin,
    destination,
    departureDate: searchParams.departureDate,
    returnDate: searchParams.returnDate || null,
    passengers: parsePassengerCount(searchParams.passengers),
    cabin,
    flexibility,
    dateSearchMode,
    targetMonth: searchParams.targetMonth || null,
    durationProfile: searchParams.durationProfile || 'oneWeek',
    tripDurations,
    includeNearbyAirports: normalizeBoolean(
      searchParams.includeNearbyAirports,
      DEFAULT_OPTIONS.includeNearbyAirports
    ),
    preferredStrategy: searchParams.preferredStrategy || DEFAULT_OPTIONS.preferredStrategy
  };
};

const getMarketProfile = ({ origin, destination }) => {
  if (origin.region === 'BR' && destination.region === 'BR') {
    return regionProfiles.domestic;
  }

  if (origin.region === 'SA' || destination.region === 'SA') {
    return regionProfiles.regional;
  }

  return regionProfiles.international;
};

const estimateCashPrice = (profile, params, factor = 1) => {
  const cabinMultiplier = cabinMultipliers[params.cabin] || 1;
  const tripMultiplier = params.returnDate || params.dateSearchMode !== 'exact' ? 1.85 : 1;
  const passengerMultiplier = params.passengers;
  const flexibilityDiscount = {
    exact: 1.08,
    threeDays: 0.95,
    week: 0.9,
    month: 0.84,
    flexibleMonth: 0.82,
    nextThreeMonths: 0.86,
    nextSixMonths: 0.8,
    nextYear: 0.76
  }[params.flexibility] || 1;
  const dateModeDiscount = {
    exact: 1,
    flexibleMonth: 0.92,
    nextThreeMonths: 0.9,
    nextSixMonths: 0.86,
    nextYear: 0.82
  }[params.dateSearchMode] || 1;

  return Math.round(
    profile.cashBase *
    cabinMultiplier *
    tripMultiplier *
    passengerMultiplier *
    flexibilityDiscount *
    dateModeDiscount *
    factor
  );
};

const resolveDateWindow = (params) => {
  const today = startOfDay(new Date());

  if (params.dateSearchMode === 'exact') {
    const departureDate = startOfDay(new Date(params.departureDate));
    const returnDate = params.returnDate ? startOfDay(new Date(params.returnDate)) : null;
    return {
      label: returnDate
        ? `${formatDateBR(departureDate)} a ${formatDateBR(returnDate)}`
        : formatDateBR(departureDate),
      start: departureDate,
      end: returnDate || departureDate,
      mode: params.dateSearchMode
    };
  }

  const parsedTargetMonth = parseTargetMonth(params.targetMonth);
  if (params.dateSearchMode === 'flexibleMonth' && parsedTargetMonth) {
    const start = new Date(parsedTargetMonth.year, parsedTargetMonth.monthIndex, 1);
    return {
      label: new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric'
      }).format(start),
      start,
      end: endOfMonth(parsedTargetMonth.year, parsedTargetMonth.monthIndex),
      mode: params.dateSearchMode
    };
  }

  const monthsAhead = {
    flexibleMonth: 6,
    nextThreeMonths: 3,
    nextSixMonths: 6,
    nextYear: 12
  }[params.dateSearchMode] || 6;

  const start = addDays(today, 14);
  return {
    label: dateSearchModeLabels[params.dateSearchMode],
    start,
    end: addMonths(start, monthsAhead),
    mode: params.dateSearchMode
  };
};

const weekdayScore = (date) => {
  const day = date.getDay();
  if ([2, 3].includes(day)) {
    return 0.88;
  }

  if ([1, 4].includes(day)) {
    return 0.94;
  }

  if ([5, 6].includes(day)) {
    return 1.05;
  }

  return 1;
};

const buildSuggestedDateWindows = (params, profile) => {
  const dateWindow = resolveDateWindow(params);

  if (params.dateSearchMode === 'exact') {
    const departureDate = dateWindow.start;
    const returnDate = params.returnDate ? dateWindow.end : null;
    return [{
      departureDate: formatDate(departureDate),
      returnDate: returnDate ? formatDate(returnDate) : null,
      label: returnDate
        ? `${formatDateBR(departureDate)} a ${formatDateBR(returnDate)}`
        : formatDateBR(departureDate),
      durationDays: returnDate
        ? Math.max(1, Math.round((returnDate - departureDate) / 86400000))
        : null,
      estimatedPrice: estimateCashPrice(profile, params, 1),
      agreementAngle: 'Validar tarifa publicada, tarifa privada e emissão por agência para a mesma data.'
    }];
  }

  const candidateOffsets = [0, 4, 8, 13, 18, 25, 32, 39, 48, 57, 70, 84, 98, 112, 126, 154, 182, 224, 266, 308];
  const candidates = [];

  candidateOffsets.forEach((offset, offsetIndex) => {
    const departureDate = addDays(dateWindow.start, offset);
    params.tripDurations.forEach((duration, durationIndex) => {
      const returnDate = addDays(departureDate, duration);
      if (departureDate <= dateWindow.end && returnDate <= dateWindow.end) {
        const factor = weekdayScore(departureDate) * (0.86 + (durationIndex * 0.03)) * (0.98 + (offsetIndex % 3) * 0.02);
        candidates.push({
          departureDate: formatDate(departureDate),
          returnDate: formatDate(returnDate),
          label: `${formatDateBR(departureDate)} a ${formatDateBR(returnDate)}`,
          durationDays: duration,
          estimatedPrice: estimateCashPrice(profile, params, factor),
          agreementAngle: duration <= 7
            ? 'Boa janela para allotments, bloqueios de agência e tarifas de curta permanência.'
            : 'Boa janela para tarifas de permanência mínima, stopover e combináveis.'
        });
      }
    });
  });

  return candidates
    .sort((a, b) => a.estimatedPrice - b.estimatedPrice)
    .slice(0, 6);
};

const formatRoute = ({ origin, destination }) =>
  `${origin.city} (${origin.airports.join('/')}) -> ${destination.city} (${destination.airports.join('/')})`;

const buildAction = (label, url) => ({ label, url });

const buildResult = ({
  id,
  source,
  type,
  price,
  details,
  priority,
  confidence,
  tags = [],
  steps = [],
  actions = [],
  savingsHint,
  dateOptions = []
}) => ({
  id,
  source,
  type,
  price,
  details,
  priority,
  confidence,
  tags,
  steps,
  actions,
  savingsHint,
  dateOptions
});

const buildCashStrategies = (params, profile, dateOptions) => {
  const route = formatRoute(params);
  const flexibleLabel = flexibilityLabels[params.flexibility];

  return [
    buildResult({
      id: 'cash-metasearch-flex',
      source: 'Metabusca com datas flexíveis',
      type: 'Dinheiro',
      price: estimateCashPrice(profile, params, 0.92),
      priority: 'Alta',
      confidence: 'Média',
      savingsHint: 'Boa primeira varredura para descobrir o piso de preço.',
      tags: [profile.label, flexibleLabel, 'comparação ampla'],
      details: `Pesquisar ${route} em múltiplos buscadores usando ${flexibleLabel}. O objetivo é achar o menor preço realista antes de olhar companhias, milhas ou agências.`,
      steps: [
        'Buscar ida e volta e, em seguida, trechos separados.',
        'Comparar com e sem bagagem despachada.',
        'Abrir o calendário de preços e salvar as datas mais baratas.'
      ],
      actions: [
        buildAction('Google Flights', sourceLinks.googleFlights),
        buildAction('Skyscanner', sourceLinks.skyscanner),
        buildAction('Kayak', sourceLinks.kayak)
      ],
      dateOptions: dateOptions.slice(0, 3)
    }),
    buildResult({
      id: 'cash-airline-direct',
      source: 'Companhias aéreas e voos diretos',
      type: 'Dinheiro',
      price: estimateCashPrice(profile, params, 1),
      priority: 'Alta',
      confidence: 'Média',
      savingsHint: 'Confirma taxas, bagagem e regras que agregadores podem esconder.',
      tags: ['site oficial', 'bagagem', 'remarcação'],
      details: `Depois da metabusca, validar o menor itinerário no site da companhia. Para ${route}, compare tarifa básica, tarifa com bagagem e regras de alteração.`,
      steps: [
        'Pesquisar pelo mesmo número de voo encontrado no agregador.',
        'Conferir se o preço final inclui taxas, assento e bagagem.',
        'Testar compra em moeda local e em real quando o site permitir.'
      ],
      actions: [
        buildAction('Buscar companhias', sourceLinks.airlineSearch)
      ]
    })
  ];
};

const buildRouteStrategies = (params, profile, dateOptions) => {
  const route = formatRoute(params);
  const hasNearbyAirports = params.origin.airports.length > 1 || params.destination.airports.length > 1;

  return [
    buildResult({
      id: 'route-nearby-airports',
      source: 'Aeroportos alternativos',
      type: 'Rotas alternativas',
      price: hasNearbyAirports ? estimateCashPrice(profile, params, 0.88) : 'Verificar',
      priority: params.includeNearbyAirports ? 'Alta' : 'Média',
      confidence: hasNearbyAirports ? 'Alta' : 'Baixa',
      savingsHint: 'Pode reduzir preço ao trocar aeroporto de chegada, saída ou conexão.',
      tags: ['aeroportos próximos', 'conexões', 'flexibilidade'],
      details: `Testar combinações de aeroportos para ${route}. Cidades com múltiplos aeroportos devem ser pesquisadas por código metropolitano e por aeroporto individual.`,
      steps: [
        `Origem possível: ${params.origin.airports.join(', ')}.`,
        `Destino possível: ${params.destination.airports.join(', ')}.`,
        'Somar custo e tempo de deslocamento terrestre antes de decidir.'
      ],
      actions: [
        buildAction('Google Flights', sourceLinks.googleFlights)
      ],
      dateOptions: dateOptions.slice(0, 3)
    }),
    buildResult({
      id: 'route-open-jaw',
      source: 'Open-jaw e múltiplos destinos',
      type: 'Rotas alternativas',
      price: 'Comparar',
      priority: 'Média',
      confidence: 'Média',
      savingsHint: 'Útil quando voltar por outra cidade ou aproveitar conexões longas.',
      tags: ['multi-cidade', 'trechos separados', 'stopover'],
      details: 'Pesquisar ida para um aeroporto e volta por outro. Em rotas internacionais, incluir stopover e checar se dois bilhetes separados ficam mais baratos que ida e volta simples.',
      steps: [
        'Pesquisar ida e volta tradicional.',
        'Pesquisar multi-cidade com chegada e retorno por aeroportos diferentes.',
        'Comparar risco de conexão quando houver bilhetes separados.'
      ],
      actions: [
        buildAction('Pesquisar multi-cidade', sourceLinks.googleFlights)
      ]
    })
  ];
};

const buildCommercialAgreementStrategies = (params, profile, dateOptions) => {
  const route = formatRoute(params);
  const bestWindow = dateOptions[0];
  const dateWindowText = params.dateSearchMode === 'exact'
    ? 'nas datas exatas informadas'
    : `nas melhores janelas dentro de ${resolveDateWindow(params).label}`;

  return [
    buildResult({
      id: 'commercial-private-fares',
      source: 'Acordos comerciais e tarifas privadas',
      type: 'Acordos comerciais',
      price: bestWindow ? bestWindow.estimatedPrice : 'Cotação assistida',
      priority: 'Alta',
      confidence: 'Média',
      savingsHint: 'Maior chance de superar metabuscas quando há flexibilidade de datas e emissão assistida.',
      tags: ['tarifa privada', 'GDS', 'consolidator', 'allotment'],
      details: `Solicitar cotação para ${route} ${dateWindowText}, pedindo explicitamente tarifas privadas, classes negociadas, bloqueios de agência e acordos de consolidador.`,
      steps: [
        'Enviar origem, destino, cabine, passageiros e janelas sugeridas pelo aplicativo.',
        'Pedir comparação entre tarifa pública, tarifa privada e emissão por consolidador.',
        'Solicitar regras de permanência mínima, stopover, bagagem e remarcação antes de pagar.'
      ],
      actions: [
        buildAction('Buscar agências com GDS', sourceLinks.travelAgencies)
      ],
      dateOptions
    }),
    buildResult({
      id: 'commercial-codeshare-interline',
      source: 'Codeshare, interline e venda por parceira',
      type: 'Acordos comerciais',
      price: 'Comparar por companhia vendedora',
      priority: 'Alta',
      confidence: 'Média',
      savingsHint: 'O mesmo voo pode custar menos quando vendido por outra companhia parceira.',
      tags: ['codeshare', 'interline', 'companhia vendedora', 'classe tarifária'],
      details: `Para ${route}, comparar a companhia operadora com parceiras que vendem o mesmo trecho. A economia pode aparecer na companhia que emite o bilhete, não no avião que opera o voo.`,
      steps: [
        'Identificar companhias que operam a rota ou conexões prováveis.',
        'Pesquisar o mesmo horário/voo nos sites das parceiras e em agências.',
        'Perguntar por classes tarifárias combináveis e tarifa publicada versus privada.'
      ],
      actions: [
        buildAction('Pesquisar companhias parceiras', sourceLinks.airlineSearch)
      ],
      dateOptions: dateOptions.slice(0, 3)
    }),
    buildResult({
      id: 'commercial-minimum-stay',
      source: 'Regras comerciais de permanência',
      type: 'Acordos comerciais',
      price: 'Otimizar duração',
      priority: 'Alta',
      confidence: 'Média',
      savingsHint: 'Alterar a volta em 1 ou 2 dias pode liberar classes tarifárias melhores.',
      tags: ['5 a 7 dias', 'sábado no destino', 'permanência mínima'],
      details: 'Testar durações próximas, como 5, 6 e 7 dias, porque tarifas negociadas podem depender de permanência mínima, retorno em dia útil ou sábado no destino.',
      steps: [
        `Durações testadas: ${params.tripDurations.join(', ')} dia(s).`,
        'Priorizar as janelas com menor estimativa e pedir cotação manual dessas datas.',
        'Comparar ida e volta no mesmo bilhete contra trechos separados.'
      ],
      dateOptions
    })
  ];
};

const buildMilesStrategies = (params, profile) => [
  buildResult({
    id: 'miles-programs',
    source: 'Milhas, pontos e parceiros',
    type: 'Milhas',
    price: `${profile.milesBase} + taxas`,
    priority: params.preferredStrategy === 'miles' ? 'Alta' : 'Média',
    confidence: 'Média',
    savingsHint: 'Mais forte em executiva, alta temporada e rotas internacionais caras.',
    tags: ['milhas', 'pontos transferíveis', 'parceiros'],
    details: `Consultar ${profile.recommendedPrograms.join(', ')} para a rota ${formatRoute(params)}. Compare custo em milhas, taxas, disponibilidade e preço em dinheiro por ponto.`,
    steps: [
      'Pesquisar no programa da companhia que opera o voo.',
      'Pesquisar em programas parceiros da mesma aliança.',
      'Calcular valor por milha antes de transferir pontos do banco.'
    ],
    actions: [
      buildAction('Buscar programas de milhas', sourceLinks.milesPrograms)
    ]
  }),
  buildResult({
    id: 'miles-alliances',
    source: 'Alianças e acordos comerciais',
    type: 'Milhas',
    price: 'Verificar disponibilidade',
    priority: 'Média',
    confidence: 'Média',
    savingsHint: 'O mesmo voo pode aparecer mais barato em outro programa parceiro.',
    tags: ['Star Alliance', 'Oneworld', 'SkyTeam', 'codeshare'],
    details: profile.allianceHint,
    steps: [
      'Identificar companhia operadora do voo mais barato.',
      'Checar programas parceiros que emitem a mesma companhia.',
      'Comparar taxas e regras de cancelamento antes da emissão.'
    ],
    actions: [
      buildAction('Pesquisar parceiros', sourceLinks.milesPrograms)
    ]
  })
];

const buildConsolidatorStrategies = (params, profile, dateOptions) => [
  buildResult({
    id: 'agency-consolidator',
    source: 'Agências e consolidators',
    type: 'Consolidator',
    price: 'Cotação manual',
    priority: params.preferredStrategy === 'agency' ? 'Alta' : 'Média',
    confidence: 'Média',
    savingsHint: 'Melhor para itinerários complexos, grupos, bagagem ou atendimento assistido.',
    tags: ['cotação manual', 'tarifas negociadas', 'emissão assistida'],
    details: profile.consolidatorHint,
    steps: [
      'Enviar origem, destino, datas, flexibilidade e número de passageiros.',
      'Pedir cotação com e sem bagagem.',
      'Comparar regras de reembolso, remarcação e suporte em caso de alteração.'
    ],
    actions: [
      buildAction('Buscar agências', sourceLinks.travelAgencies)
    ],
    dateOptions: dateOptions.slice(0, 4)
  })
];

const buildDateWindowStrategies = (params, dateOptions) => [
  buildResult({
    id: 'date-windows-best-agreements',
    source: 'Janelas sugeridas pelo aplicativo',
    type: 'Janelas sugeridas',
    price: dateOptions[0] ? dateOptions[0].estimatedPrice : 'Sem janela calculada',
    priority: 'Alta',
    confidence: 'Média',
    savingsHint: 'Use estas datas como briefing para buscar acordos comerciais e tarifas privadas.',
    tags: [
      dateSearchModeLabels[params.dateSearchMode],
      `${params.tripDurations.join('/')} dias`,
      'datas indicadas'
    ],
    details: params.dateSearchMode === 'exact'
      ? 'As datas exatas foram mantidas, mas ainda vale pedir cotação por tarifa privada e emissão assistida.'
      : 'O aplicativo calculou janelas de ida e volta para testar acordos comerciais, permanência mínima e classes tarifárias menos visíveis em metabuscas.',
    steps: [
      'Comece pelas três primeiras janelas, que têm menor estimativa.',
      'Peça cotação manual informando ida, volta, cabine e passageiros.',
      'Compare tarifa privada, tarifa pública e milhas antes de comprar.'
    ],
    dateOptions
  })
];

const buildMonitoringStrategies = (params) => [
  buildResult({
    id: 'monitoring-alerts',
    source: 'Alertas de preço e monitoramento',
    type: 'Monitoramento',
    price: 'Acompanhar',
    priority: 'Alta',
    confidence: 'Alta',
    savingsHint: 'Ajuda a capturar queda de preço sem refazer a busca manualmente todo dia.',
    tags: ['alerta', 'histórico', 'queda de preço'],
    details: `Criar alertas para ${formatRoute(params)} nas datas escolhidas e também nas janelas flexíveis. Se a viagem não for urgente, monitorar por alguns dias antes de comprar.`,
    steps: [
      'Criar alerta para datas exatas.',
      'Criar alerta com aeroportos próximos quando fizer sentido.',
      'Registrar menor preço visto para saber quando comprar.'
    ],
    actions: [
      buildAction('Pesquisar alertas', sourceLinks.priceAlerts)
    ]
  }),
  buildResult({
    id: 'manual-checklist',
    source: 'Checklist final antes da compra',
    type: 'Checklist',
    price: 'Obrigatório',
    priority: 'Alta',
    confidence: 'Alta',
    savingsHint: 'Evita economias falsas causadas por taxa, bagagem ou regras ruins.',
    tags: ['validação', 'risco', 'compra'],
    details: 'Antes de comprar, comparar preço final, bagagem, conexões, reputação do vendedor e condições de cancelamento. Evite estratégias que violem regras tarifárias ou deixem conexões desprotegidas.',
    steps: [
      'Conferir preço final no último passo antes do pagamento.',
      'Verificar tempo mínimo de conexão e troca de aeroporto.',
      'Evitar bilhetes separados quando o risco de atraso for alto.',
      'Guardar evidências da tarifa, localizador e regras.'
    ]
  })
];

const sortResults = (results) => {
  const priorityWeight = { Alta: 0, Média: 1, Media: 1, Baixa: 2 };
  return [...results].sort((a, b) =>
    (priorityWeight[a.priority] ?? 3) - (priorityWeight[b.priority] ?? 3)
  );
};

const { searchFlightOffers } = require('./amadeusService');

/**
 * Simula uma busca estratégica de passagens aéreas e busca o preço público via Amadeus.
 *
 * @param {Object} searchParams - Parâmetros da busca.
 * @returns {Promise<Object>} Resumo da busca e resultados estratégicos.
 */
exports.performSearch = async (searchParams) => {
  if (process.env.SIMULATE_DELAY === 'true') {
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  const params = normalizeSearchParams(searchParams);
  const profile = getMarketProfile(params);
  const dateWindow = resolveDateWindow(params);
  const dateOptions = buildSuggestedDateWindows(params, profile);

  // Busca tarifa pública real via Amadeus
  let publicPriceData = null;
  if (params.dateSearchMode === 'exact' && params.origin.isKnown && params.destination.isKnown) {
    try {
      publicPriceData = await searchFlightOffers(
        params.origin.code,
        params.destination.code,
        params.departureDate,
        params.passengers,
        params.returnDate,
        params.cabin
      );
    } catch (e) {
      console.error('Erro ao buscar Amadeus, caindo para fallback:', e.message);
    }
  }

  // Se a API não achar ou estivermos em datas flexíveis, usamos a estimativa antiga
  if (!publicPriceData) {
    publicPriceData = {
      isMock: true,
      price: estimateCashPrice(profile, params, 1),
      currency: 'BRL',
      source: 'Estimativa'
    };
  }

  const results = sortResults([
    ...buildCommercialAgreementStrategies(params, profile, dateOptions),
    ...buildDateWindowStrategies(params, dateOptions),
    ...buildCashStrategies(params, profile, dateOptions),
    ...buildRouteStrategies(params, profile, dateOptions),
    ...buildMilesStrategies(params, profile),
    ...buildConsolidatorStrategies(params, profile, dateOptions),
    ...buildMonitoringStrategies(params)
  ]);

  // Sobrescrever os preços do benchmark público e consolidator com base no preço do Amadeus
  results.forEach(r => {
    if (r.id === 'cash-airline-direct' || r.id === 'cash-metasearch-flex') {
      r.price = publicPriceData.price;
      r.source = publicPriceData.source;
      r.currency = publicPriceData.currency;
      if (!publicPriceData.isMock) {
        r.tags.push('TARIFA REAL (Amadeus)');
      }
    }
    if (r.id === 'agency-consolidator' || r.id === 'commercial-private-fares') {
      r.benchmarkPrice = publicPriceData.price; // Passar o preço de referência para o front
    }
  });

  console.log('Busca estratégica concluída para:', searchParams);

  return {
    summary: {
      route: formatRoute(params),
      market: profile.label,
      passengers: params.passengers,
      cabin: params.cabin,
      dateSearchMode: dateSearchModeLabels[params.dateSearchMode],
      dateWindow: dateWindow.label,
      tripDurations: params.tripDurations,
      suggestedDates: dateOptions.slice(0, 3),
      flexibility: flexibilityLabels[params.flexibility],
      includesNearbyAirports: params.includeNearbyAirports,
      knownLocations: params.origin.isKnown && params.destination.isKnown,
      publicBenchmarkPrice: publicPriceData.price,
      publicBenchmarkCurrency: publicPriceData.currency,
      isRealPrice: !publicPriceData.isMock
    },
    results
  };
};

exports.normalizeSearchParams = normalizeSearchParams;
