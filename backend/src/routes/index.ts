import { Router } from 'express';
import authRoutes from './auth';
import currentTrackRoutes from './spotify/tracks';
import userProfileRoutes from './userProfiles';
import userConnectionsRoutes from './userConnections';
import userCurrentStateRoutes from './userStates';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tracks', currentTrackRoutes);
router.use('/profiles', userProfileRoutes);
router.use('/connections', userConnectionsRoutes);
router.use('/states', userCurrentStateRoutes);


export default router;
