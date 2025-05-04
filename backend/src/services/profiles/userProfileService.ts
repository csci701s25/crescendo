import { supabase } from '../../config/supabase';

export interface UserProfile {
    id: string;
    user_id: string;
    profile_image_url: string | null;
    display_name: string | null;
    bio: string | null;
    privacy_level: 'everyone' | 'friends_only' | 'nobody';
    favorite_song: string | null;
    favorite_artist: string | null;
    favorite_album: string | null;
    // In case we want to output the created and updated at dates
    created_at: string;
    updated_at: string;
}

/**
 * GET method: @returns user profile given user_id
 */
export class UserProfileService {
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const { data: profile, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                throw error;
            }
            return profile;
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            return null;
        }
    }

    /**
     * PUT method: @returns updated user profile given user_id and updates
     */
    async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
        try {
            const { data:profile, error } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }
            return profile;
        } catch (error) {
            console.error('Error in updateUserProfile:', error);
            return null;
        }
    }
}
