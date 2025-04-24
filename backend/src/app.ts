import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import tracksRoutes from './routes/tracks';
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);

export default app;
