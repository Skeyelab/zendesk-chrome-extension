import createApp from './app.js';
import config from './config.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`Zendesk Proxy Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Session store: ${config.session.store}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;
