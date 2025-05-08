import { Request, Response } from 'express';
import { UserCurrentStateService } from '../../services/currentStates/userCurrentStateService';

export class UserCurrentStateController {
    private userCurrentStateService: UserCurrentStateService;

    constructor() {
        this.userCurrentStateService = new UserCurrentStateService();
    }

    getUserState = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const userState = await this.userCurrentStateService.getUserState(userId);

            if (!userState) {
                res.status(404).json({ error: 'User state not found' });
            }

            res.json(userState);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user state' });
        }
    };

    upsertUserState = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const userStateData = req.body;

            const userState = await this.userCurrentStateService.upsertUserState(userId, userStateData);

            if (!userState) {
                res.status(500).json({ error: 'Failed to upsert user state' });
            }

            res.json(userState);
        } catch (error) {
            res.status(500).json({ error: 'Failed to upsert user state' });
        }
    };

    getPublicUsers = async (req: Request, res: Response) => {
        try {
            const { longitude, latitude, radius, maxResults } = req.query;

            const publicUsers = await this.userCurrentStateService.getPublicUsers(
                Number(longitude), // Number() is alternative to parseFloat and +operator
                Number(latitude),
                Number(radius),
                maxResults ? Number(maxResults) : undefined // If undefined, use default value
            );

            res.json(publicUsers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get public users' });
        }
    };

    getCloseFriends = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { longitude, latitude, maxResults } = req.query;

            const friends = await this.userCurrentStateService.getCloseFriends(
                userId,
                Number(longitude),
                Number(latitude),
                maxResults ? Number(maxResults) : undefined
            );

            res.json(friends);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get close friends' });
        }
    };
}
