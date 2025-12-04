/**
 * Valida os campos do formulário de busca de passagens.
 * @param {Object} fields - Objeto contendo os valores dos campos.
 * @param {string} fields.origin - Origem da viagem.
 * @param {string} fields.destination - Destino da viagem.
 * @param {Date | null} fields.departureDate - Data de partida.
 * @param {Date | null} fields.returnDate - Data de retorno.
 * @returns {Object} Objeto contendo erros de validação.
 */
export const validateSearchForm = ({ origin, destination, departureDate, returnDate }) => {
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

  // Validação de data de partida
  if (!departureDate) {
    errors.departureDate = 'Data de partida é obrigatória';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    
    if (depDate < today) {
      errors.departureDate = 'Data de partida não pode ser no passado';
    }
  }

  // Validação de data de retorno (se fornecida)
  if (returnDate) {
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    
    const retDate = new Date(returnDate);
    retDate.setHours(0, 0, 0, 0);
    
    if (retDate < depDate) {
      errors.returnDate = 'Data de retorno deve ser após a data de partida';
    }
  }

  return errors;
};
