import axios from 'axios';

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
  tokens: SpotifyTokens;
  profile: SpotifyProfile;
}

export interface BackendAuthResponse {
  success: boolean;
  data: SpotifyAuthData;
}

// Save to .env file
// Will update to use backend url when deployed / server hosted elsewhere
const BASE_URL: string = 'http://localhost:3000';

// Invoke backend auth routes - should return data formatted same as data in backend controllers

export const authService = {
  handleSpotifyCallback: async (code: string): Promise<BackendAuthResponse> => {
    const response = await axios.get<BackendAuthResponse>(`${BASE_URL}/api/auth/spotify/callback`, {
      params: { code },
    });
    return response.data;
  },
};
