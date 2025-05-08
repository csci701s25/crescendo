import { Request, Response } from 'express';
import { UserConnectionsCountsService } from '../../services/connections/userConnectionsCountsService';

export class UserConnectionsCountsController {
    private userConnectionsCountsService: UserConnectionsCountsService;

    constructor() {
        this.userConnectionsCountsService = new UserConnectionsCountsService();
    }

    getFollowersCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const count = await this.userConnectionsCountsService.getFollowersCount(userId);
            res.json({ count });
        } catch (error) {
            console.error('Error in getFollowersCount:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getFollowingCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const count = await this.userConnectionsCountsService.getFollowingCount(userId);
            res.json({ count });
        } catch (error) {
            console.error('Error in getFollowingCount:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
