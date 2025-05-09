import { supabase } from '../../config/supabase';

export class UserConnectionsCountsService {
    async getFollowersCount(userId: string): Promise<number> {
        const { count, error } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('followed_id', userId);

        if (error) {
            throw error;
        }
        return count || 0;
    }

    async getFollowingCount(userId: string): Promise<number> {
        const { count, error } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

        if (error) {
            throw error;
        }
        return count || 0;
    }
}
