require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importando rotas e middlewares
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

/**
 * Configuração do servidor Express
 */
const app = express();
const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV || 'development';

/**
 * Configuração de middlewares
 */
// Segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (environment !== 'test') {
  app.use(morgan(environment === 'production' ? 'combined' : 'dev'));
}

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

/**
 * Rotas
 */
// Rota de status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend do Sistema de Busca de Passagens Aéreas está rodando!',
    version: '1.0.0',
    environment
  });
});

// Rotas da API
app.use('/api', searchRoutes);

/**
 * Middlewares de tratamento de erro e rotas não encontradas
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Inicialização do servidor
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor backend rodando em http://0.0.0.0:${port}`);
    console.log(`Ambiente: ${environment}`);
  });
}

// Exportar app para testes
module.exports = app;
