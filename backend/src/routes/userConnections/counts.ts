import { Router } from 'express';
import { UserConnectionsCountsController } from '../../controllers/connections/userConnectionsCountsController';

const router = Router();
const userConnectionsCountsController = new UserConnectionsCountsController();

router.get('/followers/:userId', userConnectionsCountsController.getFollowersCount);
router.get('/following/:userId', userConnectionsCountsController.getFollowingCount);

export default router;
