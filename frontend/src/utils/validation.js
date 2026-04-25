/**
 * Valida os campos do formulário de busca de passagens.
 * @param {Object} fields - Objeto contendo os valores dos campos.
 * @param {string} fields.origin - Origem da viagem.
 * @param {string} fields.destination - Destino da viagem.
 * @param {string} fields.dateSearchMode - Modo de busca de datas.
 * @param {Date | null} fields.departureDate - Data de partida.
 * @param {Date | null} fields.returnDate - Data de retorno.
 * @param {string | null} fields.targetMonth - Mês flexível no formato YYYY-MM.
 * @returns {Object} Objeto contendo erros de validação.
 */
export const validateSearchForm = ({
  origin,
  destination,
  dateSearchMode = 'exact',
  departureDate,
  returnDate,
  targetMonth,
  passengers
}) => {
  const errors = {};

  // Validação de origem
  if (!origin || !origin.trim()) {
    errors.origin = 'Origem é obrigatória';
  } else if (origin.trim().length < 3) {
    errors.origin = 'Origem deve ter pelo menos 3 caracteres';
  }

  // Validação de destino
  if (!destination || !destination.trim()) {
    errors.destination = 'Destino é obrigatório';
  } else if (destination.trim().length < 3) {
    errors.destination = 'Destino deve ter pelo menos 3 caracteres';
  }

  // Validação de origem e destino iguais
  if (origin && destination && 
      origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
    errors.destination = 'Destino deve ser diferente da origem';
  }

  if (dateSearchMode === 'flexibleMonth' && !targetMonth) {
    errors.targetMonth = 'Informe o mês da viagem';
  } else if (dateSearchMode === 'flexibleMonth' && !/^\d{4}-\d{2}$/.test(targetMonth)) {
    errors.targetMonth = 'Mês da viagem inválido';
  }

  // Validação de data de partida
  if (dateSearchMode === 'exact' && !departureDate) {
    errors.departureDate = 'Data de partida é obrigatória';
  } else if (dateSearchMode === 'exact') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    
    if (Number.isNaN(depDate.getTime())) {
      errors.departureDate = 'Data de partida inválida';
    } else if (depDate < today) {
      errors.departureDate = 'Data de partida não pode ser no passado';
    }
  }

  // Validação de data de retorno (se fornecida)
  if (dateSearchMode === 'exact' && returnDate) {
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    
    const retDate = new Date(returnDate);
    retDate.setHours(0, 0, 0, 0);
    
    if (Number.isNaN(retDate.getTime())) {
      errors.returnDate = 'Data de retorno inválida';
    } else if (retDate < depDate) {
      errors.returnDate = 'Data de retorno deve ser após a data de partida';
    }
  }

  if (passengers !== undefined) {
    const parsedPassengers = Number(passengers);
    if (!Number.isInteger(parsedPassengers) || parsedPassengers < 1 || parsedPassengers > 9) {
      errors.passengers = 'Número de passageiros deve estar entre 1 e 9';
    }
  }

  return errors;
};
