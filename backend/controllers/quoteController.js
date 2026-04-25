const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', 'data');
const quotesFile = path.join(dataDir, 'quotes.json');

// Garante que o diretório data e o arquivo de quotes existam
const ensureDataFile = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(quotesFile)) {
    fs.writeFileSync(quotesFile, JSON.stringify([], null, 2));
  }
};

// Lê todas as cotações
const readQuotes = () => {
  ensureDataFile();
  try {
    const data = fs.readFileSync(quotesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de cotações:', error);
    return [];
  }
};

// Salva todas as cotações
const saveQuotes = (quotes) => {
  ensureDataFile();
  try {
    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo de cotações:', error);
    return false;
  }
};

/**
 * Cria uma nova cotação
 */
exports.createQuote = (req, res, next) => {
  try {
    const { user, flightDetails, benchmarkPrice } = req.body;

    // Validações
    if (!user || typeof user !== 'object') {
      const error = new Error('Dados do usuário são obrigatórios.');
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    if (!user.name || !user.name.trim()) {
      const error = new Error('Nome é obrigatório.');
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    if (!user.email || !user.email.trim()) {
      const error = new Error('Email é obrigatório.');
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      const error = new Error('Email inválido.');
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    const newQuote = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      user: {
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone ? user.phone.trim() : null
      },
      flightDetails: flightDetails || {},
      benchmarkPrice: benchmarkPrice || null,
      secretFare: null, // Tarifa secreta encontrada pelo consolidator
      secretFareProvider: null, // Qual consolidator encontrou
      secretFareNotes: [],
      notes: []
    };

    const quotes = readQuotes();
    quotes.push(newQuote);

    if (!saveQuotes(quotes)) {
      const error = new Error('Erro ao salvar cotação no sistema de arquivos.');
      error.statusCode = 500;
      throw error;
    }

    console.log(`✅ Nova cotação recebida: ${newQuote.id} - ${user.name} - ${flightDetails?.route || 'Rota não informada'}`);

    res.status(201).json({
      success: true,
      message: 'Cotação solicitada com sucesso. Nossa equipe entrará em contato.',
      quoteId: newQuote.id,
      timestamp: newQuote.createdAt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as cotações (para admin/auditoria)
 */
exports.listQuotes = (req, res, next) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let quotes = readQuotes();

    // Filtro por status
    if (status) {
      quotes = quotes.filter(q => q.status === status);
    }

    // Filtro por busca (nome, email, rota)
    if (search) {
      const searchLower = search.toLowerCase();
      quotes = quotes.filter(q =>
        q.user.name.toLowerCase().includes(searchLower) ||
        q.user.email.toLowerCase().includes(searchLower) ||
        (q.flightDetails.route && q.flightDetails.route.toLowerCase().includes(searchLower))
      );
    }

    const total = quotes.length;
    const paginatedQuotes = quotes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      count: paginatedQuotes.length,
      total,
      data: paginatedQuotes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtém uma cotação específica por ID
 */
exports.getQuote = (req, res, next) => {
  try {
    const { id } = req.params;
    const quotes = readQuotes();
    const quote = quotes.find(q => q.id === id);

    if (!quote) {
      const error = new Error('Cotação não encontrada.');
      error.statusCode = 404;
      error.name = 'NotFoundError';
      throw error;
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza o status de uma cotação
 */
exports.updateQuoteStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'contacted', 'quoted', 'accepted', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Status inválido. Use: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    const quotes = readQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === id);

    if (quoteIndex === -1) {
      const error = new Error('Cotação não encontrada.');
      error.statusCode = 404;
      error.name = 'NotFoundError';
      throw error;
    }

    quotes[quoteIndex].status = status;
    quotes[quoteIndex].updatedAt = new Date().toISOString();

    if (note) {
      quotes[quoteIndex].notes.push({
        text: note,
        createdAt: new Date().toISOString()
      });
    }

    if (!saveQuotes(quotes)) {
      const error = new Error('Erro ao atualizar cotação.');
      error.statusCode = 500;
      throw error;
    }

    res.json({
      success: true,
      message: 'Status atualizado com sucesso.',
      data: quotes[quoteIndex]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adiciona uma tarifa secreta a uma cotação existente
 * Usado pelo administrador quando recebe tarifa do consolidator
 */
exports.addSecretFare = (req, res, next) => {
  try {
    const { id } = req.params;
    const { price, currency, provider, details, deadline } = req.body;

    if (!price || isNaN(Number(price))) {
      const error = new Error('Preço da tarifa secreta é obrigatório e deve ser numérico.');
      error.statusCode = 400;
      error.name = 'ValidationError';
      throw error;
    }

    const quotes = readQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === id);

    if (quoteIndex === -1) {
      const error = new Error('Cotação não encontrada.');
      error.statusCode = 404;
      error.name = 'NotFoundError';
      throw error;
    }

    quotes[quoteIndex].secretFare = {
      price: Number(price),
      currency: currency || 'BRL',
      provider: provider || 'Consolidator Parceiro',
      details: details || '',
      deadline: deadline || null,
      addedAt: new Date().toISOString()
    };
    quotes[quoteIndex].secretFareProvider = provider || 'Consolidator Parceiro';
    quotes[quoteIndex].status = 'quoted';
    quotes[quoteIndex].updatedAt = new Date().toISOString();

    if (!saveQuotes(quotes)) {
      const error = new Error('Erro ao salvar tarifa secreta.');
      error.statusCode = 500;
      throw error;
    }

    console.log(`🔒 Tarifa secreta adicionada à cotação ${id}: ${currency || 'BRL'} ${price} por ${provider || 'Consolidator'}`);

    res.json({
      success: true,
      message: 'Tarifa secreta adicionada com sucesso.',
      data: quotes[quoteIndex]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estatísticas das cotações
 */
exports.getQuoteStats = (req, res, next) => {
  try {
    const quotes = readQuotes();
    const stats = {
      total: quotes.length,
      withSecretFare: quotes.filter(q => q.secretFare).length,
      byStatus: {},
      byMonth: {}
    };

    quotes.forEach(quote => {
      // Por status
      stats.byStatus[quote.status] = (stats.byStatus[quote.status] || 0) + 1;

      // Por mês
      const month = quote.createdAt.substring(0, 7); // YYYY-MM
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
