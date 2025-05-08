import { Router } from 'express';
import { UserProfileController } from '../../controllers/profiles';

const router = Router();
const userProfileController = new UserProfileController();

router.get('/:userId', userProfileController.getUserProfile);
router.put('/:userId', userProfileController.upsertUserProfile);

export default router;
