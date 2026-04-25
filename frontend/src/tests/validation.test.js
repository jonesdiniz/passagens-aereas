import { validateSearchForm } from '../utils/validation';

describe('validateSearchForm', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const validForm = {
    origin: 'GRU',
    destination: 'JFK',
    dateSearchMode: 'exact',
    departureDate: tomorrow,
    returnDate: dayAfterTomorrow
  };

  it('should return an empty object for a valid form (one-way)', () => {
    const errors = validateSearchForm({ ...validForm, returnDate: null });
    expect(errors).toEqual({});
  });

  it('should return an empty object for a valid form (round-trip)', () => {
    const errors = validateSearchForm(validForm);
    expect(errors).toEqual({});
  });

  it('should require origin', () => {
    const errors = validateSearchForm({ ...validForm, origin: '' });
    expect(errors.origin).toBe('Origem é obrigatória');
  });

  it('should require destination', () => {
    const errors = validateSearchForm({ ...validForm, destination: '' });
    expect(errors.destination).toBe('Destino é obrigatório');
  });

  it('should require departureDate', () => {
    const errors = validateSearchForm({ ...validForm, departureDate: null });
    expect(errors.departureDate).toBe('Data de partida é obrigatória');
  });

  it('should not require departureDate for flexible search windows', () => {
    const errors = validateSearchForm({
      origin: 'GRU',
      destination: 'JFK',
      dateSearchMode: 'nextSixMonths',
      departureDate: null,
      passengers: 2
    });
    expect(errors).toEqual({});
  });

  it('should require targetMonth for month-only searches', () => {
    const errors = validateSearchForm({
      origin: 'GRU',
      destination: 'JFK',
      dateSearchMode: 'flexibleMonth',
      targetMonth: '',
      passengers: 2
    });
    expect(errors.targetMonth).toBe('Informe o mês da viagem');
  });

  it('should enforce minimum length for origin', () => {
    const errors = validateSearchForm({ ...validForm, origin: 'A' });
    expect(errors.origin).toBe('Origem deve ter pelo menos 3 caracteres');
  });

  it('should enforce minimum length for destination', () => {
    const errors = validateSearchForm({ ...validForm, destination: 'B' });
    expect(errors.destination).toBe('Destino deve ter pelo menos 3 caracteres');
  });

  it('should prevent origin and destination from being the same', () => {
    const errors = validateSearchForm({ ...validForm, destination: 'GRU' });
    expect(errors.destination).toBe('Destino deve ser diferente da origem');
  });

  it('should prevent departureDate from being in the past', () => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const errors = validateSearchForm({ ...validForm, departureDate: yesterday });
    expect(errors.departureDate).toBe('Data de partida não pode ser no passado');
  });

  it('should prevent returnDate from being before departureDate', () => {
    const errors = validateSearchForm({ ...validForm, returnDate: today });
    expect(errors.returnDate).toBe('Data de retorno deve ser após a data de partida');
  });

  it('should prevent invalid passenger counts', () => {
    const errors = validateSearchForm({ ...validForm, passengers: 0 });
    expect(errors.passengers).toBe('Número de passageiros deve estar entre 1 e 9');
  });
});
