import { Router } from 'express';
import currentTrackRoutes from './currentTrack';

const router = Router();

// Routes for different providers + different track features
router.use('/spotify', currentTrackRoutes);

export default router;
