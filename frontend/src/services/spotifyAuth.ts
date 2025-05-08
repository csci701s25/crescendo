import * as SecureStore from 'expo-secure-store';

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SpotifyProfile {
  id: string;
  email?: string;
  display_name?: string;
  profile_image_url?: string;
}

export interface SpotifyAuthData {
  id: string;
  tokens: SpotifyTokens;
  tokenExpiresAt: string;
  profile: SpotifyProfile;
}

export interface BackendAuthResponse {
  success: boolean;
  data: SpotifyAuthData;
}

export interface RefreshAccessTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}

// Invoke backend auth routes - should return data formatted same as data in backend controllers
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Refresh access token needs the access token in the header...
// TODO: Might need to refactor, so all protected endpoints require Authorization headers that are handled by middleware in backend


export const authService = {
  handleSpotifyCallback: async (code: string): Promise<BackendAuthResponse> => {
    const url = new URL(`${API_BASE_URL}/api/auth/spotify/callback`);
    url.searchParams.append('code', code);

    console.log('url', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  },


   getValidAccessToken: async(refreshToken: string): Promise<string | null> => {
    try {
      // First try to get stored access token & expiration time
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const tokenExpiresAt = await SecureStore.getItemAsync('tokenExpiresAt');

      // If we have a token and it's not expired, return it
      if (accessToken && tokenExpiresAt) {
        const expiresAt = new Date(tokenExpiresAt);
        if (expiresAt > new Date()) {
          return accessToken;
        }
      }

      // If no access token or it's expired, get new access token using refresh endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/spotify/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const { access_token, token_expires_at } = await response.json();

      // Store the new access token and its expiration
      await SecureStore.setItemAsync('accessToken', access_token);
      await SecureStore.setItemAsync('tokenExpiresAt', token_expires_at);

      return access_token;
    } catch (error) {
      console.error('Error getting valid access token:', error);
      return null;
    }
  },
};



