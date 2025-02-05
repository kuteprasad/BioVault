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

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.path);
  next();
});

// Test endpoint to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});