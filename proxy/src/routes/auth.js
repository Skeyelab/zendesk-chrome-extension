import express from 'express';
import authService from '../services/authService.js';
import sessionStore from '../sessionStore.js';

const router = express.Router();

/**
 * POST /auth/callback
 * Exchange OAuth code for access token and create session
 */
router.post('/callback', async (req, res, next) => {
  try {
    const { code, subdomain } = req.body;

    // Validate required fields
    if (!code) {
      return res.status(400).json({ error: 'Missing required field: code' });
    }

    if (!subdomain) {
      return res.status(400).json({ error: 'Missing required field: subdomain' });
    }

    // Exchange code for tokens
    const tokenData = await authService.exchangeCodeForToken(code, subdomain);

    // Create session and store tokens
    const sessionToken = sessionStore.create({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
      subdomain
    });

    // Return session token to client
    res.json({ sessionToken });
  } catch (error) {
    // Handle authentication errors
    if (error.message.includes('Zendesk token exchange failed')) {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
});

export default router;
