require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Importando rotas e middlewares
const searchRoutes = require('./routes/searchRoutes');
const quotesRoutes = require('./routes/quotes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const { checkAmadeusHealth } = require('./services/amadeusService');

/**
 * Configuração do servidor Express
 */
const app = express();
const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV || 'development';

// Garante que o diretório data existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Configuração de middlewares
 */
// Segurança
app.use(helmet());

// CORS - Configurado para aceitar múltiplas origens
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:80',
  'http://localhost'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || environment === 'development') {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origem: ${origin}`);
      callback(new Error('Não permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Logging
if (environment !== 'test') {
  app.use(morgan(environment === 'production' ? 'combined' : 'dev'));
}

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Muitas requisições deste IP, tente novamente mais tarde.',
      code: 'TOO_MANY_REQUESTS'
    }
  }
});
app.use('/api/', limiter);

/**
 * Rotas
 */
// Rota de status/health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend do Sistema de Busca de Passagens Aéreas está rodando!',
    version: '1.0.0',
    environment,
    timestamp: new Date().toISOString()
  });
});

// Health check detalhado
app.get('/health', async (req, res) => {
  const amadeusStatus = await checkAmadeusHealth();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment,
    services: {
      amadeus: amadeusStatus
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };

  const statusCode = amadeusStatus.connected ? 200 : 200; // Sistema funciona mesmo sem Amadeus
  res.status(statusCode).json(health);
});

// Rotas da API
app.use('/api/search', searchRoutes);
app.use('/api/quotes', quotesRoutes);

/**
 * Middlewares de tratamento de erro e rotas não encontradas
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Tratamento de erros não capturados
 */
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Em produção, você pode querer reiniciar o processo
  if (environment === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Inicialização do servidor
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   Sistema GPS de Passagens Aéreas - Backend v1.0.0        ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Servidor rodando em: http://0.0.0.0:${port}              ║`);
    console.log(`║  🌍 Ambiente: ${environment.padEnd(46)}║`);
    console.log(`║  📊 Health check: http://0.0.0.0:${port}/health             ║`);
    console.log('╚════════════════════════════════════════════════════════════╝');
  });
}

// Exportar app para testes
module.exports = app;
