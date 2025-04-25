import { Router } from 'express';
import { CurrentTrackController } from '../../controllers/spotify/currentTrackController';

const router = Router();
const currentTrackController = new CurrentTrackController();

// Current Track Polling
router.post('/startPolling/:userId', currentTrackController.startPolling);
router.post('/stopPolling/:userId', currentTrackController.stopPolling);
router.get('/currentTrack/:userId', currentTrackController.getCurrentTrack);

export default router;
