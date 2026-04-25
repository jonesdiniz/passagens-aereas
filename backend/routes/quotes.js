const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

// Rotas de cotações
router.post('/', quoteController.createQuote);
router.get('/', quoteController.listQuotes);
router.get('/stats', quoteController.getQuoteStats);
router.get('/:id', quoteController.getQuote);
router.patch('/:id/status', quoteController.updateQuoteStatus);
router.patch('/:id/secret-fare', quoteController.addSecretFare);

module.exports = router;
