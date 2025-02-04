import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Backend server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});