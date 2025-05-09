// TODO: Need to rework this
import * as Location from 'expo-location';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const userTrackingService = {
    async setupTracking(userId: string, location: Location.LocationObject) {

      // Call location update

      // Start backend polling for current track
      await fetch(`${API_BASE_URL}/api/tracks/spotify/currentTrack/startPolling/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
    },
};

    // TODO: Stop backend polling for current track

    // TODO: Implement location update
      // TODO: Store location in DB - gotta set up backend route and endpoint for this
      await fetch(`${API_BASE_URL}/api/users/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }),
    });


  //Hit get location endpoint for all your connections that are close friends

  //Hit get location endpoint for all users within given raidus
