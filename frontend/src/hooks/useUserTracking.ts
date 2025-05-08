// TODO: Need to rework this
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { userTrackingService } from '../services/userTrackingService';

// Hook to setup user tracking - only call once after app loads on map view (after user has logged in)
export const useUserTracking = (userId: string) => {
  useEffect(() => {
    const setupUserTracking = async () => {
        try {
            // Request foreground location permission - much more lenient than background permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            console.error('Location permission denied');
            return;
            }

            // Get initial location
            const initialLocation = await Location.getCurrentPositionAsync({});
            await userTrackingService.setupTracking(userId, initialLocation);

            // Start watching location changes
            const locationSubscription = await Location.watchPositionAsync(
                {accuracy: Location.Accuracy.Highest},
                async (activeLocation) => {
                // Update location in DB
                await userTrackingService.updateLocation(userId, activeLocation); // TODO: Implement this
                }
            );

            // Stop watching location changes - useEffect cleanup function to remove subscription location tracking
            return () => {
                locationSubscription.remove();
            };
        } catch (error) {
            console.error('Error setting up user tracking:', error);
        }
    };

    setupUserTracking();
  }, [userId]);
};
