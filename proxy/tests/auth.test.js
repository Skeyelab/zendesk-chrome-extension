import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import createApp from '../src/app.js';

describe('POST /auth/callback', () => {
  let app;

  beforeEach(() => {
    // Create a new app instance for each test
    app = createApp();
  });

  describe('Token Exchange', () => {
    it('should return 400 if code is missing', async () => {
      const response = await request(app)
        .post('/auth/callback')
        .send({ subdomain: 'test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if subdomain is missing', async () => {
      const response = await request(app)
        .post('/auth/callback')
        .send({ code: 'test-code' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should exchange code for tokens with Zendesk', async () => {
      // Mock successful token exchange
      const mockZendeskResponse = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        token_type: 'Bearer'
      };

      // We'll implement mocking in the actual implementation
      const response = await request(app)
        .post('/auth/callback')
        .send({
          code: 'valid-auth-code',
          subdomain: 'test-subdomain'
        });

      // Should return session token on success
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessionToken');
      expect(response.body.sessionToken).toBeTruthy();
    });

    it('should return 401 if Zendesk token exchange fails', async () => {
      // Mock failed token exchange
      const response = await request(app)
        .post('/auth/callback')
        .send({
          code: 'invalid-code',
          subdomain: 'test-subdomain'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Session Management', () => {
    it('should create a unique session for each successful authentication', async () => {
      const response1 = await request(app)
        .post('/auth/callback')
        .send({
          code: 'valid-code-1',
          subdomain: 'test-subdomain'
        });

      const response2 = await request(app)
        .post('/auth/callback')
        .send({
          code: 'valid-code-2',
          subdomain: 'test-subdomain'
        });

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.sessionToken).not.toBe(response2.body.sessionToken);
    });

    it('should store access and refresh tokens in session', async () => {
      const response = await request(app)
        .post('/auth/callback')
        .send({
          code: 'valid-code',
          subdomain: 'test-subdomain'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessionToken');
      
      // Session should be retrievable (we'll test this via another endpoint later)
      const sessionToken = response.body.sessionToken;
      expect(sessionToken).toBeTruthy();
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from configured origins', async () => {
      const response = await request(app)
        .post('/auth/callback')
        .set('Origin', 'chrome-extension://test-extension-id')
        .send({
          code: 'valid-code',
          subdomain: 'test-subdomain'
        });

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});

describe('GET /health', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it('should return 200 and health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
