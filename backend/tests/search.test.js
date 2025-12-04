const request = require('supertest');
const app = require('../index'); // Importa a instância do app Express

describe('POST /api/search', () => {
  const validSearch = {
    origin: 'GRU',
    destination: 'JFK',
    departureDate: '2025-12-25'
  };

  it('should return 200 and mock results for a valid search', async () => {
    const response = await request(app)
      .post('/api/search')
      .send(validSearch)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
  });

  it('should return 400 if origin is missing', async () => {
    const invalidSearch = { ...validSearch, origin: '' };
    await request(app)
      .post('/api/search')
      .send(invalidSearch)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return 400 if destination is missing', async () => {
    const invalidSearch = { ...validSearch, destination: '' };
    await request(app)
      .post('/api/search')
      .send(invalidSearch)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return 400 if departureDate is missing', async () => {
    const invalidSearch = { ...validSearch, departureDate: '' };
    await request(app)
      .post('/api/search')
      .send(invalidSearch)
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
