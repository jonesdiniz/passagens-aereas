/**
 * Middleware para tratamento de erros centralizado.
 * @param {Error} err - Objeto de erro.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Próximo middleware.
 */
const errorHandler = (err, req, res, next) => {
  const environment = process.env.NODE_ENV || 'development';
  console.error(err.stack);

  // Determina o status code
  const statusCode = err.statusCode || 500;

  // Resposta de erro
  res.status(statusCode).json({ 
    error: err.message || 'Erro interno do servidor',
    details: environment === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
