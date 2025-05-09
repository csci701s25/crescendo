import { Request, Response } from 'express'; //import types
import { SpotifyAuthService } from '../../services/auth/spotifyService';

export class SpotifyAuthController {
    private spotifyService: SpotifyAuthService;

    constructor() {
        this.spotifyService = new SpotifyAuthService();
    }

    /**
     * @returns true and new user data if spotify account is successfully linked
     */
    handleCallback = async(req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.query;

            if(!code || typeof code !== 'string') {
                res.status(400).json({ error: 'Valid authorization code required' });
                return;
            }

            const newUserData = await this.spotifyService.handleCallback(code);

            res.json({
                success: true,
                data: newUserData,
            });
        } catch (error) {
            console.error('Error in handleCallback:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };

    /**
     * @returns true and new access token w/ expiration time if refresh token is valid
     * NOTE: refresh token lasts forever, but access token expires every hour
     */
    refreshAccessToken = async(req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body; // Used with post request
            if(!refreshToken) {
                res.status(400).json({error: 'Refresh token is required'});
                return;
            }

            const newTokenData = await this.spotifyService.refreshAccessToken(refreshToken);
            res.json({
                success: true,
                data: newTokenData,
            });
        } catch (error) {
            console.error('Error in refreshAccessToken:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };
}
