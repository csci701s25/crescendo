import { Request, Response } from 'express'; //import types
import { SpotifyAuthService } from '../../services/auth/spotifyService';

export class SpotifyAuthController {
    private spotifyService: SpotifyAuthService;

    constructor() {
        this.spotifyService = new SpotifyAuthService();
    }

    getAuthUrl = async(req: Request, res: Response): Promise<void> => {
        try {
            const authUrl = this.spotifyService.getAuthUrl();
            res.json({url: authUrl});
        } catch (error) {
            console.error('Failed to generate Spotify auth URL:', error);
            res.status(500).json({error: 'Failed to generate Spotify auth URL'});
        }
    };

    handleCallback = async(req: Request, res: Response): Promise<void> => {
        try {
            const { code, state } = req.query;

            if(!code || typeof code !== 'string' || !state || typeof state !== 'string') {
                res.status(400).json({ error: 'Valid authorization code and matching state required' });
                return;
            }

            const newUserData = await this.spotifyService.handleCallback(code);

            res.json({
                success: true,
                data: newUserData,
            });
        } catch (error) {
            console.error('Failed to handle Spotify callback:', error);
            res.status(500).json({error: 'Failed to handle Spotify callback'});
        }
    };

    getUserProfile = async(req: Request, res: Response): Promise<void> => {
        try {
            //Authorization:'Bearer ' + accessToken (we're just pulling the accessToken)
            const accessToken = req.headers.authorization?.split(' ')[1];
            if(!accessToken) {
                res.status(401).json({error: 'Unauthorized'});
                return;
            }
            const userProfile = await this.spotifyService.getUserProfile(accessToken);
            res.json(userProfile);
        } catch (error) {
            console.error('Failed to get user profile:', error);
            res.status(500).json({error: 'Failed to get user profile'});
        }
    };

    refreshAccessToken = async(req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body; //used with post request
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
            console.error('Failed to refresh access token:', error);
            res.status(500).json({error: 'Failed to refresh access token'});
        }
    };
}
