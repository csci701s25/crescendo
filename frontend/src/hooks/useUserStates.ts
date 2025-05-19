import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../config/supabase';
import { userTrackingService } from '../services/userTrackingService';

// Hook for fetching user states (public or friends view)
export const useUserStates = (view: 'public' | 'friends') => {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const userId = await SecureStore.getItemAsync('id');
        console.log('userId states hooks', userId);
        if (!userId) {
            return;
        }

        // Fetch my state
        console.log('fetching my state, i am ', userId);
        const myStateData = await userTrackingService.getUserState(userId);
        console.log('myStateData', myStateData);
        console.log('did it set me?,', myStateData);
        setMe(myStateData);

        // Fetch users (public or friends)
        console.log('trying to fetch users, public or friends!!!');
        console.log('myStateData', myStateData);
        const data =
          view === 'public'
            ? await userTrackingService.getPublicUsers(userId, myStateData.longitude, myStateData.latitude, 1000)
            : await userTrackingService.getCloseFriends(userId, myStateData.longitude, myStateData.latitude, 1000);

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Initial fetch
    fetchUsers();

    // TODO: Look into Supabase subscription instead of polling - BUT THIS FIXED MAP persistence RELOAD ISSUE
    const interval = setInterval(fetchUsers, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);

    // Set up real-time subscription
    // const subscription = supabase
    //   .channel('user_states')
    //   .on(
    //     'postgres_changes',
    //     {
    //         event: '*', // INSERT, UPDATE, DELETE
    //         schema: 'public',
    //         table: 'current_user_states',
    //     },
    //     () => {
    //         // Refetch users when a change is detected in DB
    //         fetchUsers();
    //     }
    //   )
    //   .subscribe();

    // UseEffect cleanup
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [view]);

  return { me, users };
};
