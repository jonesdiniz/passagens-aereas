/**
 * Middleware para tratamento de rotas não encontradas (404).
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
};

module.exports = notFoundHandler;
