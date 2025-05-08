import { supabase } from '../../config/supabase';

export interface UserProfile {
    id: string;
    user_id: string;
    profile_image_url: string | null;
    display_name: string | null;
    bio: string | null;
    followers: number;
    privacy_level: 'everyone' | 'friends_only' | 'nobody';
    favorite_song: string | null;
    favorite_artist: string | null;
    favorite_album: string | null;
    // In case we want to output the created and updated at dates
    created_at: string;
    updated_at: string;
}


export class UserProfileService {

    /**
     * GET method: @returns user profile given user_id
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            throw error;
        }
        return profile;
    }

    /**
     * PUT method: @returns upserted (insert or update) user profile given user_id and profile data
     */
    async upsertUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .upsert([{ id: userId, ...profileData }], { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            throw error;
        }
        return profile;
    }
}
