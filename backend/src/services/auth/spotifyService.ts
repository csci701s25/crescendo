import SpotifyWebApi from 'spotify-web-api-node';
import * as crypto from 'crypto';

import { supabase } from '../../config/supabase';


//refer to Spotify Web API Authorization Flow Diagram: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
//refer to spotify-web-api-node: https://github.com/thelinmichael/spotify-web-api-node?tab=readme-ov-file#usage

interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface SpotifyAuthResponse {
    tokens: SpotifyTokens;
    profile: {
        id: string;
        email?: string;
        display_name?: string;
        profile_image_url?: string;
    };
}

export class SpotifyAuthService {
    private spotifyApi: SpotifyWebApi;

    constructor() {
		console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
		console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET);
		console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);

		this.spotifyApi = new SpotifyWebApi({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			redirectUri: process.env.SPOTIFY_REDIRECT_URI,
		});
    }

    getAuthUrl(): string {
        const scopes = [
            //user info
            'user-read-private', //account type - subscription details
            'user-read-email',

            //playback
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',

            //listening history
            'user-read-recently-played',
            'user-top-read',

            //access/modify library
            'user-library-read',
            'user-library-modify',

            //access/modify playlists
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-private',
            'playlist-modify-public',

            //access to follow
            'user-follow-read',
        ];

        const state = crypto.randomBytes(8).toString('hex');

        return this.spotifyApi.createAuthorizeURL(scopes, state);
    }

	/**
	 * @returns tokens and expiration time; need tokens to 
	 */

    async handleCallback(code: string): Promise<SpotifyAuthResponse> {
        const data = await this.spotifyApi.authorizationCodeGrant(code);

		// Retrieve new user data
        const tokens = {
			accessToken: data.body.access_token,
			refreshToken: data.body.refresh_token,
			expiresIn: data.body.expires_in, //in seconds
        };

		this.spotifyApi.setAccessToken(tokens.accessToken);
		const { body: profile } = await this.spotifyApi.getMe();

		const tokenExpiresAt = new Date();
		tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expiresIn);

		// Store new user data in DB w/ error checking
		const { error } = await supabase
		.from('users')
		.upsert({
			spotify_id: profile.id,
			email: profile.email,
			display_name: profile.display_name,
			profile_image_url: profile.images?.[0]?.url,
			access_token: tokens.accessToken,
			refresh_token: tokens.refreshToken,
			token_expires_at: tokenExpiresAt.toISOString()
		}, { onConflict: 'spotify_id' });

		if (error) {
			throw error;
		}

		return {
            tokens,
            profile: {
                id: profile.id,
                email: profile.email,
                display_name: profile.display_name,
                profile_image_url: profile.images?.[0]?.url,
            },
        };
    }

	async getUserProfile(accessToken: string) {
		this.spotifyApi.setAccessToken(accessToken);
		const { body } = await this.spotifyApi.getMe();
		return body;
	}

	/**
	 * @returns new access token and new expiration time
	 * NOTE: refresh token lasts forever, but access token expires every hour
	 */
	async refreshAccessToken(refreshToken: string): Promise<{accessToken: string, expiresIn: number}> {
		this.spotifyApi.setRefreshToken(refreshToken);
		const data = await this.spotifyApi.refreshAccessToken();

		return {
			accessToken: data.body.access_token,
			expiresIn: data.body.expires_in,
		};
	}

	async testDatabaseConnection() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('count(*)');

            if (error) {
				throw error;
			}
            return { success: true, data: data[1] };
        } catch (error) {
            console.error('Database connection test failed:', error);
            throw error;
        }
    }
}
