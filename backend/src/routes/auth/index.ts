import { Router } from 'express';
import spotifyRoutes from './spotify';

const router = Router();

//Auth routes for different music providers
router.use('/spotify', spotifyRoutes);

export default router;

