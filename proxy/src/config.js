import 'dotenv/config';

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Zendesk OAuth configuration
  zendesk: {
    clientId: process.env.ZENDESK_CLIENT_ID,
    clientSecret: process.env.ZENDESK_CLIENT_SECRET,
    subdomain: process.env.ZENDESK_SUBDOMAIN
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    store: process.env.SESSION_STORE || 'memory'
  },
  
  // CORS configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['chrome-extension://test-extension-id']
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const required = [
    'ZENDESK_CLIENT_ID',
    'ZENDESK_CLIENT_SECRET',
    'SESSION_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;
