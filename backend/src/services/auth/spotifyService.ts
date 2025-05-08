import SpotifyWebApi from 'spotify-web-api-node';
import { supabase } from '../../config/supabase';
import { UserProfileService } from '../profiles/userProfileService';


interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface SpotifyAuthResponse {
	id: string;
    tokens: SpotifyTokens;
	tokenExpiresAt: string;
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

		const providerData = {
			email: profile.email,
			display_name: profile.display_name,
			profile_image_url: profile.images?.[0]?.url,
			access_token: tokens.accessToken,
			refresh_token: tokens.refreshToken,
			token_expires_at: tokenExpiresAt.toISOString(),
		};

		// Store new user data in DB w/ error checking
		const { data: userData, error } = await supabase
		.from('users')
		.upsert({
			music_provider: 'spotify',
			music_provider_id: profile.id,
			provider_data: providerData,
		}, { onConflict: 'music_provider,music_provider_id' })
		.select()
		.single();

		if (error) {
			throw error;
		}

		const user = userData;

		if (!userData) {
			throw new Error('User upsert failed');
		}

		// Create new user profile in DB
		const userProfileService = new UserProfileService();
		const newProfile = await userProfileService.upsertUserProfile(user.id, {
			display_name: profile.display_name,
			profile_image_url: profile.images?.[0]?.url,
		});

		if (!newProfile) {
			throw new Error('Failed to upsert user profile');
		}

		return {
            id: user.id,
            tokens,
			tokenExpiresAt: tokenExpiresAt.toISOString(),
            profile: {
                id: profile.id,
                email: profile.email,
                display_name: profile.display_name,
                profile_image_url: profile.images?.[0]?.url,
            },
        };
    }

	/**
	 * @returns new access token and new expiration time
	 * NOTE: refresh token lasts forever, but access token expires every hour
	 */
	async refreshAccessToken(refreshToken: string): Promise<{accessToken: string, tokenExpiresAt: string}> {
		this.spotifyApi.setRefreshToken(refreshToken);
		const data = await this.spotifyApi.refreshAccessToken();

		const newAccessToken = data.body.access_token;
		const expiresIn = data.body.expires_in;

		// Calculate new expiration time
		const tokenExpiresAt = new Date();
		tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + expiresIn);

		// Update access token and its expiration time in DB
		const { error } = await supabase
			.from('users')
			.update({
				provider_data: {
					access_token: newAccessToken,
					token_expires_at: tokenExpiresAt.toISOString(),
				},
			})
			.eq('provider_data->refresh_token', refreshToken);

		if (error) {
			throw error;
		}

		return {
			accessToken: newAccessToken,
			tokenExpiresAt: tokenExpiresAt.toISOString(),
		};
	}
}
