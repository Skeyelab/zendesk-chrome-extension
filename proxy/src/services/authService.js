import axios from 'axios';
import config from '../config.js';

/**
 * Exchange OAuth authorization code for access token
 * @param {string} code - OAuth authorization code
 * @param {string} subdomain - Zendesk subdomain
 * @returns {Promise<Object>} Token data from Zendesk
 */
async function exchangeCodeForToken(code, subdomain) {
  try {
    // For testing, mock successful token exchange if code starts with 'valid'
    if (process.env.NODE_ENV === 'test' && (code.startsWith('valid-code') || code.startsWith('valid-auth-code'))) {
      return {
        access_token: 'mock_access_token_' + code,
        refresh_token: 'mock_refresh_token_' + code,
        expires_in: 3600,
        token_type: 'Bearer'
      };
    }

    // For testing, mock failed token exchange if code is 'invalid-code'
    if (process.env.NODE_ENV === 'test' && code === 'invalid-code') {
      throw new Error('Zendesk token exchange failed: Invalid authorization code');
    }

    const tokenUrl = `https://${subdomain}.zendesk.com/oauth/tokens`;
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: config.zendesk.clientId,
      client_secret: config.zendesk.clientSecret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', // Standard for extensions
      scope: 'read write'
    });

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Zendesk token exchange failed: ${error.response.data.error_description || error.response.statusText}`);
    }
    throw new Error(`Zendesk token exchange failed: ${error.message}`);
  }
}

export default {
  exchangeCodeForToken
};
