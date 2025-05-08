import express from 'express';
import cors from 'cors';

// Route imports
import authRoutes from './routes/auth';
import tracksRoutes from './routes/spotify/tracks';
import userProfileRoutes from './routes/userProfiles';
import userConnectionsRoutes from './routes/userConnections';
import userCurrentStateRoutes from './routes/userStates';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/profiles', userProfileRoutes);
app.use('/api/connections', userConnectionsRoutes);
app.use('/api/states', userCurrentStateRoutes);

export default app;
