import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pricesRouter from './src/routes/prices.js';
import providersRouter from './src/routes/providers.js';
import marketsRouter from './src/routes/markets.js';
import exchangeRouter from './src/routes/exchange.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/prices', pricesRouter);
app.use('/api/providers', providersRouter);
app.use('/api/markets', marketsRouter);
app.use('/api/exchange', exchangeRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
