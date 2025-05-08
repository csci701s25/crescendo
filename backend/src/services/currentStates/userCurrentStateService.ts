import { supabase } from '../../config/supabase';

export interface UserCurrentState {
    id: string;
    current_track_id: string;
    track_name: string;
    artist_name: string;
    album_name: string;
    album_image_url: string;
    latitude: number;
    longitude: number;
    is_playing: boolean;
}

export class UserCurrentStateService {

    /**
     * GET method: @returns user state given id
     */
    async getUserState(userId: string): Promise<UserCurrentState[]> {
        const { data: state, error } = await supabase
            .from('current_user_states')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
           throw error;
        }
        return state;
    }

    /**
     * PUT method: @returns upserted (insert or update) user state given user id and state data
     */
    async upsertUserState(userId: string, stateData: Partial<UserCurrentState>): Promise<UserCurrentState[]> {
        const { data: state, error } = await supabase
            .from('current_user_states')
            .upsert([{ id: userId, ...stateData }], { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            throw error;
        }
        return state;
    }

    /**
     * GET method - Public View: @returns all users within given radius around a given location
     */
    async getPublicUsers(longitude: number, latitude: number, radius: number, maxResults: number = 50): Promise<UserCurrentState[]> {
        const { data: nearbyUsers, error: publicError } = await supabase
            .rpc('get_nearby_user_states', {
                longitude,
                latitude,
                radius_miles: radius,
                max_results: maxResults,
            });

        if (publicError) {
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
