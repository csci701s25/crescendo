import { Request, Response } from 'express';
import { UserProfileService } from '../../services/profiles/userProfileService';

export class UserProfileController {
    private userProfileService: UserProfileService;

    constructor() {
        this.userProfileService = new UserProfileService();
    }

    getUserProfile = async (req: Request, res:Response): Promise<void> => {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({error: 'User ID is required'});
                return;
            }

            const profile = await this.userProfileService.getUserProfile(userId);

            if (!profile) {
                res.status(404).json({error: 'User Profile not found'});
                return;
            }

            res.json(profile);
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    updateUserProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const updates = req.body;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const updatedProfile = await this.userProfileService.updateUserProfile(userId, updates);

            if (!updatedProfile) {
                res.status(404).json({ error: 'User Profile not found' });
                return;
            }

            res.json(updatedProfile);
        } catch (error) {
            console.error('Error in updateUserProfile:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };

}
