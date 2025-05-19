import { Router } from 'express';
import { UserCurrentStateController } from '../../controllers/currentStates/userCurrentStateController';

const router = Router();
const userCurrentStateController = new UserCurrentStateController();

// Note: route order matters - if public is after /:userId, it will never be hit as it will think that public is the userId

// Fetch public view for a given user (don't need their id just location)
router.get('/public', userCurrentStateController.getPublicUsers);

// Fetch friends view for a given user (need id and location)
router.get('/friends/:userId', userCurrentStateController.getCloseFriends);

// Get a given user's current state
router.get('/:userId', userCurrentStateController.getUserState);

// Update a given user's current state
router.put('/:userId', userCurrentStateController.upsertUserState);

export default router;
