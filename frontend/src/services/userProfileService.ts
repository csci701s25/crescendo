export interface UserProfile {
    id: string;
    profile_image_url: string | null;
    display_name: string | null;
    bio: string | null;
    privacy_level: 'everyone' | 'friends_only' | 'nobody';
    favorite_song: string | null;
    favorite_artist: string | null;
    favorite_album: string | null;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;


export const userProfileService = {
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profiles/${userId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  upsertUserProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      console.log('Upserting profile for user:', userId);
      console.log('Profile data!!:', profileData);
      const response = await fetch(`${API_BASE_URL}/api/profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
  },
  // TODO: hit followers and following endpoints here!
  getFollowers: async (userId: string): Promise<{count: number}> => {
    try {
      console.log('Fetching followers for user:', userId);
      const response = await fetch(`${API_BASE_URL}/api/connections/counts/followers/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching followers:', error);
      return {count: 0};
    }
  },

  getFollowing: async (userId: string): Promise<{count: number}> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/counts/following/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching following:', error);
      return {count: 0};
    }
  },
};
