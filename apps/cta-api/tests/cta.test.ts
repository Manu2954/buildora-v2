import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';

const API_KEY = process.env.API_KEY || 'change-me-at-deploy';

describe('cta routes', () => {
  const app = createApp();

  it('POST /api/cta/submit minimal -> 201 id', async () => {
    const res = await request(app)
      .post('/api/cta/submit')
      .set('User-Agent', 'vitest')
      .send({ message: 'Hello', page: '/test', source: 'test', variant: 'A' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/cta/config default -> object', async () => {
    const res = await request(app).get('/api/cta/config').query({ key: 'cta:homepage' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('key');
    expect(res.body).toHaveProperty('config');
  });

  it('PUT /api/cta/config without x-api-key -> 401', async () => {
    const res = await request(app).put('/api/cta/config').send({ key: 'cta:test', config: { a: 1 } });
    expect(res.status).toBe(401);
  });

  it('PUT /api/cta/config with x-api-key -> 200 ok', async () => {
    const res = await request(app)
      .put('/api/cta/config')
      .set('x-api-key', API_KEY)
      .send({ key: 'cta:test', config: { a: 1 } });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  it('GET /api/cta/analytics with x-api-key -> 200 with keys', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await request(app)
      .get('/api/cta/analytics')
      .set('x-api-key', API_KEY)
      .query({ from: today, to: today });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('byDay');
    expect(res.body).toHaveProperty('bySource');
    expect(res.body).toHaveProperty('byVariant');
  });
});

