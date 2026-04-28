import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokeApiRoutes from './routes/pokeApiRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', pokeApiRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('PokeAPI Backend is running! Access the endpoints at /api/...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});
