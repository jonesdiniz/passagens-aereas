const searchService = require('../services/searchService');

const normalizeComparableText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

/**
 * Controlador para a rota de busca de passagens.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Próximo middleware.
 */
exports.searchFlights = async (req, res, next) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    cabin,
    flexibility,
    dateSearchMode,
    targetMonth,
    durationProfile,
    tripDurations,
    includeNearbyAirports,
    preferredStrategy
  } = req.body;

  console.log('Recebida busca:', req.body);

  // Input validation
  const selectedDateSearchMode = dateSearchMode || (departureDate ? 'exact' : 'nextSixMonths');

  if (!origin || !destination) {
    return res.status(400).json({ 
      error: 'Origem e destino são obrigatórios.'
    });
  }

  if (normalizeComparableText(origin) === normalizeComparableText(destination)) {
    return res.status(400).json({
      error: 'Destino deve ser diferente da origem.'
    });
  }

  if (selectedDateSearchMode === 'exact' && !departureDate) {
    return res.status(400).json({
      error: 'Data de partida é obrigatória para busca com datas exatas.'
    });
  }

  if (selectedDateSearchMode === 'exact' && !isValidDate(departureDate)) {
    return res.status(400).json({
      error: 'Data de partida inválida.'
    });
  }

  const targetMonthParts = targetMonth?.split('-').map(Number);
  const targetMonthNumber = targetMonthParts?.[1];

  if (
    selectedDateSearchMode === 'flexibleMonth' &&
    (!targetMonth || !/^\d{4}-\d{2}$/.test(targetMonth) || targetMonthNumber < 1 || targetMonthNumber > 12)
  ) {
    return res.status(400).json({
      error: 'Informe o mês da viagem no formato AAAA-MM.'
    });
  }

  if (returnDate && !departureDate) {
    return res.status(400).json({
      error: 'Data de retorno só deve ser informada junto com a data de partida.'
    });
  }

  if (returnDate && !isValidDate(returnDate)) {
    return res.status(400).json({
      error: 'Data de retorno inválida.'
    });
  }

  if (returnDate && new Date(returnDate) < new Date(departureDate)) {
    return res.status(400).json({
      error: 'Data de retorno deve ser após a data de partida.'
    });
  }

  if (passengers && (Number(passengers) < 1 || Number(passengers) > 9)) {
    return res.status(400).json({
      error: 'Número de passageiros deve estar entre 1 e 9.'
    });
  }

  try {
    const searchPayload = await searchService.performSearch({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabin,
      flexibility,
      dateSearchMode: selectedDateSearchMode,
      targetMonth,
      durationProfile,
      tripDurations,
      includeNearbyAirports,
      preferredStrategy
    });

    res.json(searchPayload);

  } catch (error) {
    console.error('Erro durante a busca:', error);
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
};
