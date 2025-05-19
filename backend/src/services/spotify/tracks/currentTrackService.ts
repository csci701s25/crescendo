import SpotifyWebApi from 'spotify-web-api-node';
import { supabase } from '../../../config/supabase';

export class CurrentTrackService {
    private spotifyApi: SpotifyWebApi;
    private pollingIntervals: Map<string, NodeJS.Timeout>;

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        });
        this.pollingIntervals = new Map();
    }

    /**
     * @returns current track given access token
     */

    async fetchCurrentTrack(accessToken: string) {
        this.spotifyApi.setAccessToken(accessToken);
        try {
            const response = await this.spotifyApi.getMyCurrentPlayingTrack();
            return response.body;
        } catch (error) {
            console.error('Error fetching current track:', error);
            throw error;
        }
    }

    /**
     * Every 60 seconds, fetch the current track and store it in the database
	 * @returns reference to the interval to stop it later
	 */
    startPollingCurrentTrack(userId: string, accessToken: string) {
        this.stopPollingCurrentTrack(userId);

        console.log('starting polling for current track'); // Not getting in here

        const POLLING_INTERVAL = 5000; // 5 seconds

        const intervalId = setInterval(async () => {
            try {
                const currentTrack = await this.fetchCurrentTrack(accessToken);

                // Store current track in the database
                if (currentTrack) {
                    await this.updateCurrentTrack(userId, currentTrack);
                }
            } catch (error) {
                console.error(`Failed to fetch current track for user ${userId}:`, error);
            }
        }, POLLING_INTERVAL);

        this.pollingIntervals.set(userId, intervalId);
    }

    /**
     * Clears the timer for given user if it exists
     */
    stopPollingCurrentTrack(userId: string) {
        const existingInterval = this.pollingIntervals.get(userId);
        if (existingInterval) {
            clearInterval(existingInterval);
            this.pollingIntervals.delete(userId);
        }
    }

    /**
     * Update the current track in the database - private cuz we only want to call it from the startPollingCurrentTrack method not from outside controller
     */
    private async updateCurrentTrack(userId: string, trackData: SpotifyApi.CurrentlyPlayingResponse) {
        if (!trackData || !trackData.item) {
            return;
        }
        const track = trackData.item;
        if (track.type === 'track') {
            const { error } = await supabase
                .from('current_user_states')
                .update({
                    current_track_id: track.id,
                    track_name: track.name,
                    artist_name: track.artists.map(artist => artist.name).join(', '),
                    album_name: track.album.name,
                    album_image_url: track.album.images?.[0]?.url,
                    is_playing: trackData.is_playing,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) {
                console.error('Error updating current track:', error);
                throw error;
            }
        } else {
            console.error('Track is not a valid TrackObjectFull but rather an EpisodeObject:', track);
        }
    }

    /**
     * Update the user location in the database
     */
    async updateUserLocation(userId: string, latitude: number, longitude: number) {
        const { error } = await supabase
            .from('current_user_states')
            .upsert({
                id: userId,
                latitude,
                longitude,
            }, {
                onConflict: 'id',
            });

        if (error) {
            console.error('Error updating user location:', error);
            throw error;
        }
    }
}
