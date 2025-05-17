import * as Location from 'expo-location';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const userTrackingService = {
    // Should run once after user logs in
    setupTracking: async (userId: string, initialLocation: Location.LocationObject) => {
        // Update user state with initial location
        await userTrackingService.updateLocation(userId, initialLocation);

        // Start backend polling for current track
        await fetch(`${API_BASE_URL}/api/tracks/spotify/currentTrack/startPolling/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
    },

    // On app close, stop backend polling for current track
    stopTracking: async (userId: string) => {
      await fetch(`${API_BASE_URL}/api/tracks/spotify/currentTrack/stopPolling/${userId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
      });
  },

    // On expo location change in frontend, update user state with new location
    updateLocation: async (userId: string, location: Location.LocationObject) => {
        await fetch(`${API_BASE_URL}/api/states/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
            }),
        });
    },

    // Public view: Get all users within given radius given current user's location
    getPublicUsers: async (longitude: number, latitude: number, radius: number = 1000, maxResults?: number) => {
        const queryParams = new URLSearchParams({
            longitude: longitude.toString(),
            latitude: latitude.toString(),
            radius: radius.toString(),
            ...(maxResults && { maxResults: maxResults.toString() }),
        });

        const response = await fetch(`${API_BASE_URL}/api/states/public?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch public users');
        }
        return response.json();
    },

    // Friends view: Get all close friends of a given user
    getCloseFriends: async (userId: string, longitude: number, latitude: number, maxResults?: number) => {
        const queryParams = new URLSearchParams({
            longitude: longitude.toString(),
            latitude: latitude.toString(),
            ...(maxResults && { maxResults: maxResults.toString() }),
        });

        const response = await fetch(`${API_BASE_URL}/api/states/friends/${userId}?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch close friends');
        }
        return response.json();
    },

    // Get user state
    getUserState: async (userId: string) => {
        const response = await fetch(`${API_BASE_URL}/api/states/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user state');
        }
        return response.json();
    },
};
