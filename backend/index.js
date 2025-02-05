import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vaultRoutes from './routes/vaultRoutes.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Backend server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});