import { Request, Response } from 'express';
import { UserConnectionsActionsService } from '../../services/connections/userConnectionsActionsService';

export class UserConnectionsActionsController {
    private userConnectionsActionsService: UserConnectionsActionsService;

    constructor() {
        this.userConnectionsActionsService = new UserConnectionsActionsService();
    }

    async sendRequest(req: Request, res: Response) {
        try {
            const { followerId, followedId, requestType } = req.body;
            const result = await UserConnectionsActionsService.sendRequest(followerId, followedId, requestType);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async respondToRequest(req: Request, res: Response) {
        try {
            const { connectionId, action } = req.body;
            const result = await UserConnectionsActionsService.respondToRequest(connectionId, action);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getFollowers(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const followers = await UserConnectionsActionsService.getFollowers(userId as string);
            res.json(followers);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getFollowing(req: Request, res: Response) {
        try {
            const { userId } = req.query;
            const following = await UserConnectionsActionsService.getFollowing(userId as string);
            res.json(following);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

