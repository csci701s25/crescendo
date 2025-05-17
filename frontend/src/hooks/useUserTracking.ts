
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { userTrackingService } from '../services/userTrackingService';
import * as SecureStore from 'expo-secure-store';

// Hook to setup user tracking - only call once after app loads on map view (after user has logged in)
export const useUserTracking = (isAuthenticated: boolean) => {
  useEffect(() => {

    // If user is not authenticated, don't setup tracking
    if(!isAuthenticated) {
        return;
    }

    const setupUserTracking = async () => {
        try {
            // Get user ID from secure store
            const userId = await SecureStore.getItemAsync('id');
            console.log('userId tracking hooks', userId);
            if (!userId) {
                console.error('No user ID found');
                return;
            }

            // Request foreground location permission - much more lenient than background permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            console.error('Location permission denied');
            return;
            }

            // Get initial location and setup tracking
            const initialLocation = await Location.getCurrentPositionAsync({});
            console.log('initialLocation', initialLocation); // TODO: check why not being updated in DB
            await userTrackingService.setupTracking(userId, initialLocation);

            // Start watching location changes
            const locationSubscription = await Location.watchPositionAsync(
                {accuracy: Location.Accuracy.Highest},
                async (activeLocation) => {
                // Update location in DB
                await userTrackingService.updateLocation(userId, activeLocation); // TODO: Implement this
                }
            );

            // Useffect cleanup func - Stop watching location changes and stop polling for current track
            return () => {
                locationSubscription.remove();
                userTrackingService.stopTracking(userId);
            };
        } catch (error) {
            console.error('Error setting up user tracking:', error);
        }
    };

    setupUserTracking();
  }, [isAuthenticated]);
};
