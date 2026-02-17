import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import config from './config.js';

/**
 * Creates and configures an Express application
 * @returns {Express.Application} Configured Express app
 */
function createApp() {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      
      if (config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Auth routes
  app.use('/auth', authRoutes);

  // Error handling middleware
  app.use((err, req, res, _next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });

  return app;
}

export default createApp;
