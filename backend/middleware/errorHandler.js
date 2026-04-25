/**
 * Middleware para tratamento de erros centralizado.
 * @param {Error} err - Objeto de erro.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Próximo middleware.
 */
const errorHandler = (err, req, res, next) => {
  const environment = process.env.NODE_ENV || 'development';

  // Log estruturado do erro
  console.error('=== ERRO ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Rota:', req.method, req.originalUrl);
  console.error('Mensagem:', err.message);
  console.error('Status:', err.statusCode || 500);
  if (environment === 'development') {
    console.error('Stack:', err.stack);
  }
  console.error('============');

  // Determina o status code
  const statusCode = err.statusCode || err.status || 500;

  // Tipos de erro conhecidos
  const knownErrors = {
    ValidationError: { status: 400, message: 'Dados inválidos fornecidos.' },
    UnauthorizedError: { status: 401, message: 'Não autorizado.' },
    ForbiddenError: { status: 403, message: 'Acesso negado.' },
    NotFoundError: { status: 404, message: 'Recurso não encontrado.' },
    ConflictError: { status: 409, message: 'Conflito de dados.' },
    TooManyRequestsError: { status: 429, message: 'Muitas requisições. Tente novamente mais tarde.' }
  };

  const knownError = knownErrors[err.name];

  // Resposta de erro padronizada
  const errorResponse = {
    success: false,
    error: {
      message: knownError?.message || err.message || 'Erro interno do servidor',
      code: err.code || err.name || 'INTERNAL_ERROR',
      ...(environment === 'development' && {
        stack: err.stack,
        details: err.details || undefined
      })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  res.status(knownError?.status || statusCode).json(errorResponse);
};

module.exports = errorHandler;
