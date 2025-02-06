import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vaultRoutes from './routes/vaultRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors({
  // Remove the trailing slash from the origin
  origin: 'https://5zngffqh-5173.inc1.devtunnels.ms',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  // Add additional CORS headers
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
});

// Test endpoint to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/password', vaultRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});