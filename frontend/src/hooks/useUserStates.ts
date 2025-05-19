import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../config/supabase';
import { userTrackingService } from '../services/userTrackingService';

// Hook for fetching user states (public or friends view)
export const useUserStates = (view: 'public' | 'friends') => {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const userId = await SecureStore.getItemAsync('id');
        console.log('userId states hooks', userId);
        if (!userId) {
            return;
        }

        // Fetch my state
        const myStateData = await userTrackingService.getUserState(userId);
        console.log('myStateData', myStateData);
        setMe(myStateData);

        // Fetch users (public or friends)
        const data =
          view === 'public'
            ? await userTrackingService.getPublicUsers(myStateData.longitude, myStateData.latitude, 1000)
            : await userTrackingService.getCloseFriends(userId, myStateData.longitude, myStateData.latitude, 1000);

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Initial fetch
    fetchUsers();

    // // Temporarily set up polling instead of Supabase subscription
    // const interval = setInterval(fetchUsers, 5000); // Poll every 5 seconds

    // return () => clearInterval(interval);

    // Set up real-time subscription
    const subscription = supabase
      .channel('user_states')
      .on(
        'postgres_changes',
        {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'current_user_states',
        },
        () => {
            // Refetch users when a change is detected in DB
            fetchUsers();
        }
      )
      .subscribe();

    // UseEffect cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [view]);

  return { me, users };
};
