import express from 'express';
import { UserProfileController } from '../../controllers/profiles';

const router = express.Router();
const userProfileController = new UserProfileController();

router.get('/:userId', userProfileController.getUserProfile);
router.put('/:userId', userProfileController.updateUserProfile);

export default router;
