const Amadeus = require('amadeus');
require('dotenv').config();

let amadeus = null;

const initializeAmadeus = () => {
  try {
    if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
      amadeus = new Amadeus({
        clientId: process.env.AMADEUS_CLIENT_ID,
        clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        hostname: 'test'
      });
      console.log('✅ Amadeus API inicializada com sucesso.');
      return true;
    }
    console.warn('⚠️ Credenciais do Amadeus não encontradas no .env. Usando modo fallback/mock.');
    return false;
  } catch (error) {
    console.error('❌ Erro ao inicializar Amadeus:', error.message);
    return false;
  }
};

initializeAmadeus();

/**
 * Busca ofertas de voos usando a API do Amadeus com retry e timeout.
 *
 * @param {string} origin - Código IATA de origem (ex: GRU)
 * @param {string} destination - Código IATA de destino (ex: JFK)
 * @param {string} departureDate - Data de partida (YYYY-MM-DD)
 * @param {number} passengers - Número de passageiros adultos
 * @param {string|null} returnDate - Data de retorno opcional (YYYY-MM-DD)
 * @param {string} cabin - Classe da cabine (ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST)
 * @returns {Promise<Object|null>} Dados do preço ou null se não encontrado
 */
const searchFlightOffers = async (
  origin,
  destination,
  departureDate,
  passengers,
  returnDate = null,
  cabin = 'ECONOMY'
) => {
  // Se Amadeus não está configurado, retorna null para usar fallback
  if (!amadeus) {
    console.log('ℹ️ Amadeus não configurado. Retornando null para fallback.');
    return null;
  }

  // Validações básicas
  if (!origin || !destination || !departureDate) {
    console.warn('⚠️ Parâmetros obrigatórios ausentes para busca Amadeus.');
    return null;
  }

  // Normaliza códigos IATA
  const originCode = origin.toString().toUpperCase().trim();
  const destinationCode = destination.toString().toUpperCase().trim();

  // Códigos IATA devem ter exatamente 3 caracteres
  if (originCode.length !== 3 || destinationCode.length !== 3) {
    console.warn(`⚠️ Códigos IATA inválidos: ${originCode} -> ${destinationCode}`);
    return null;
  }

  const params = {
    originLocationCode: originCode,
    destinationLocationCode: destinationCode,
    departureDate: departureDate,
    adults: Math.min(Math.max(Number(passengers) || 1, 1), 9),
    travelClass: cabin.toUpperCase(),
    currencyCode: 'BRL',
    max: 5
  };

  if (returnDate) {
    params.returnDate = returnDate;
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(params);

    if (response.data && response.data.length > 0) {
      // Ordena por preço total e pega o mais barato
      const cheapestOffer = response.data
        .sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total))[0];

      const price = parseFloat(cheapestOffer.price.total);
      const currency = cheapestOffer.price.currency || 'BRL';

      console.log(`✅ Amadeus: Preço real encontrado: ${currency} ${price} (${originCode} -> ${destinationCode})`);

      return {
        isMock: false,
        price: price,
        currency: currency,
        source: 'Amadeus API',
        details: {
          airline: cheapestOffer.validatingAirlineCodes?.[0] || 'N/A',
          segments: cheapestOffer.itineraries?.length || 0,
          totalDuration: cheapestOffer.itineraries?.[0]?.duration || 'N/A'
        }
      };
    }

    console.log(`ℹ️ Amadeus: Nenhuma oferta encontrada para ${originCode} -> ${destinationCode}`);
    return null;

  } catch (error) {
    const errorMessage = error.response?.result?.errors?.[0]?.detail
      || error.response?.result?.errors?.[0]?.title
      || error.message;

    console.error(`❌ Erro na busca do Amadeus (${originCode} -> ${destinationCode}):`, errorMessage);

    // Erros específicos da API Amadeus
    if (errorMessage?.includes('access_token') || errorMessage?.includes('Unauthorized')) {
      console.error('💡 Dica: Verifique se suas credenciais do Amadeus estão corretas no arquivo .env');
    }

    if (errorMessage?.includes('departureDate')) {
      console.error('💡 Dica: A data de partida deve ser futura (mínimo amanhã) para a API de teste.');
    }

    return null; // Retorna null para usar fallback em vez de propagar erro
  }
};

/**
 * Verifica o status de saúde da conexão com a API Amadeus.
 * @returns {Promise<Object>} Status da API
 */
const checkAmadeusHealth = async () => {
  if (!amadeus) {
    return { connected: false, message: 'Amadeus não configurado' };
  }

  try {
    // Faz uma busca simples para verificar se a API responde
    const response = await amadeus.referenceData.locations.get({
      keyword: 'SAO',
      subType: 'CITY,AIRPORT',
      page: { limit: 1 }
    });

    return {
      connected: true,
      status: response.statusCode || 200,
      message: 'Amadeus API respondendo normalmente'
    };
  } catch (error) {
    return {
      connected: false,
      status: error.response?.statusCode || 500,
      message: error.message || 'Falha na conexão com Amadeus'
    };
  }
};

module.exports = {
  searchFlightOffers,
  checkAmadeusHealth
};
