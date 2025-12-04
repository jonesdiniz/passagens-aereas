const searchService = require('../services/searchService');

/**
 * Controlador para a rota de busca de passagens.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Próximo middleware.
 */
exports.searchFlights = async (req, res, next) => {
  const { origin, destination, departureDate, returnDate } = req.body;

  console.log('Recebida busca:', req.body);

  // Input validation
  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ 
      error: 'Origem, destino e data de partida são obrigatórios.' 
    });
  }

  try {
    const results = await searchService.performSearch({
      origin,
      destination,
      departureDate,
      returnDate
    });

    res.json({ results });

  } catch (error) {
    console.error('Erro durante a busca:', error);
    // Passa o erro para o middleware de tratamento de erros
    next(error);
  }
};
