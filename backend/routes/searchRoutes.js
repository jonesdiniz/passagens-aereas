const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Rota de busca de passagens
router.post('/search', searchController.searchFlights);

module.exports = router;
