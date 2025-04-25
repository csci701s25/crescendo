import { Router } from 'express';
import { SpotifyAuthController } from '../../controllers/auth';

const router = Router();
const spotifyController = new SpotifyAuthController();

// Auth Flow
router.get('/callback', spotifyController.handleCallback);
router.get('/profile', spotifyController.getUserProfile);
router.post('/refresh', spotifyController.refreshAccessToken);

export default router;
