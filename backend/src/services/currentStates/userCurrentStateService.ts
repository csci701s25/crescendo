import { supabase } from '../../config/supabase';

export interface UserCurrentState {
    id: string;
    current_track_id: string;
    track_name: string;
    artist_name: string;
    album_name: string;
    album_image_url: string;
    location: {
        latitude: number;
        longitude: number;
    };
    is_playing: boolean;
}

export class UserCurrentStateService {

    /**
     * GET method: @returns user state given id
     */
    async getUserState(userId: string): Promise<UserCurrentState[]> {
        const { data: state, error } = await supabase
        .rpc('get_user_state', { user_id: userId });

        if (error) {
            // TODO: keep adding console.errors everywhere -- really helps with debugging!
            console.error('Error in getUserState:', error);
            throw error;
        }

        return state[0];
    }

    /**
     * PUT method: @returns upserted (insert or update) user state given user id and state data
     */
    async upsertUserState(userId: string, stateData: Partial<UserCurrentState>): Promise<UserCurrentState[]> {
        console.log('upserting user state for userId:', userId); // not reached
        console.log('stateData', stateData);
        // Format location data to match PostGIS geometry as expected by gis schema
        const formattedData = {
            id: userId,
            ...stateData,
            location: stateData.location ?
            `POINT(${stateData.location.longitude} ${stateData.location.latitude})` :
            undefined,
        };
        const { data: state, error } = await supabase
            .from('current_user_states')
            .upsert([formattedData], { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('Error in upsertUserState:', error);
            throw error;
        }
        return state;
    }

    /**
     * GET method - Public View: @returns all users within given radius around a given location
     */
    async getPublicUsers(userId: string, longitude: number, latitude: number, radius: number, maxResults: number = 50): Promise<UserCurrentState[]> {
        console.log('getting public users in service!!!');
        console.log('userId', userId);
        console.log('longitude', longitude);
        console.log('latitude', latitude);
        console.log('radius', radius);
        console.log('maxResults', maxResults);
        const { data: nearbyUsers, error: publicError } = await supabase
            .rpc('get_nearby_user_states', {
                user_id: userId,
                longitude,
                latitude,
                radius_miles: radius,
                max_results: maxResults,
            });

        if (publicError) {
            console.error('Error in getPublicUsers:', publicError);
            throw publicError;
        }
        return nearbyUsers;
    }

    /**
     * GET method - Friends View: @returns all connections that are close friends of a given user
     */
    async getCloseFriends(userId: string, longitude: number, latitude: number, maxResults: number = 50): Promise<UserCurrentState[]> {
        const { data: friendsStates, error: friendsError } = await supabase
            .rpc('get_friends_user_states', {
                user_id: userId,
                longitude,
                latitude,
                max_results: maxResults,
            });

        if (friendsError) {
            throw friendsError;
        }

        return friendsStates;
    }
}
