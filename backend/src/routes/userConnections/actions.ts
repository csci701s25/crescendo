import { Router } from 'express';
import { UserConnectionsActionsController } from '../../controllers/connections/userConnectionsActionsController';

const router = Router();

const userConnectionsActionsController = new UserConnectionsActionsController();

router.post('/request', userConnectionsActionsController.sendRequest);
router.post('/respond', userConnectionsActionsController.respondToRequest);
router.get('/followers/:userId', userConnectionsActionsController.getFollowers);
router.get('/following/:userId', userConnectionsActionsController.getFollowing);

export default router;
