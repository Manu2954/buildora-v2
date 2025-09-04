import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';

describe('health', () => {
  const app = createApp();
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});

