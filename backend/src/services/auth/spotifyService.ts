import SpotifyWebApi from 'spotify-web-api-node';
import { supabase } from '../../config/supabase';


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
			token_expires_at: tokenExpiresAt.toISOString(),
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

    // TODO: rework this to pull profile from DB - currently pulling from spotify; set up route for it too
	/**
	 * @returns user profile;
	 */
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
}
