import { Router } from 'express';
import authRoutes from './auth';
import currentTrackRoutes from './spotify/tracks';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tracks', currentTrackRoutes);

export default router;
