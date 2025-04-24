import { Request, Response } from 'express';
import { CurrentTrackService } from '../../services/spotify/currentTrackService';
import { supabase } from '../../config/supabase';

export class CurrentTrackController {
    private currentTrackService: CurrentTrackService;

    constructor() {
        this.currentTrackService = new CurrentTrackService();
    }

    /**
     * @returns true and message if currently polling for playing track starts successfully
     */
    startPolling = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;

            // Retrieve access token from DB
            const { data, error } = await supabase
                .from('users')
                .select('access_token')
                .eq('spotify_id', userId)
                .single();

            if (error || !data) {
                res.status(404).json({ error: 'User not found or access token not available' });
                return;
            }

            const accessToken = data.access_token;

            this.currentTrackService.startPollingCurrentTrack(userId, accessToken);
            res.json({ success: true, message: 'Started polling for currently playing track' });
        } catch (error) {
            console.error('Failed to start polling:', error);
            res.status(500).json({ error: 'Failed to start polling' });
        }
    };

    /**
     * @returns true and message if polling for currently playing track stops successfully
     */
    stopPolling = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            this.currentTrackService.stopPollingCurrentTrack(userId);
            res.json({ success: true, message: 'Stopped polling for currently playing track' });
        } catch (error) {
            console.error('Failed to stop polling:', error);
            res.status(500).json({ error: 'Failed to stop polling' });
        }
    };

    /**
     * @returns currently playing track if database connection is successful
     */
    getCurrentTrack = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            const { data, error } = await supabase
                .from('users')
                .select('access_token')
                .eq('spotify_id', userId)
                .single();

            if (error || !data) {
                res.status(404).json({ error: 'User not found or access token not available' });
                return;
            }

            const accessToken = data.access_token;

            const currentTrack = await this.currentTrackService.fetchCurrentTrack(accessToken);
            res.json(currentTrack);
        } catch (error) {
            console.error('Failed to get current track:', error);
            res.status(500).json({ error: 'Failed to get current track' });
        }
    };
}
