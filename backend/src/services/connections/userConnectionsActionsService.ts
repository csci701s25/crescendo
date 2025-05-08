import { supabase } from '../../config/supabase';

interface Connection {
    id: string;
    follower_id: string;
    followed_id: string;
    request_type: 'follow' | 'close_friend';
    request_status: 'pending' | 'accepted' | 'rejected';
    is_close_friend: boolean;
}



export class UserConnectionsActionsService {
    /**
     * PUT method: @returns upserted (insert or update) connection record
     */
    // Send a follow or close friend request
    static async sendRequest(followerId: string, followedId: string, requestType: 'follow' | 'close_friend') {

        // Prevent self-follow
        if (followerId === followedId) {
            throw new Error("You can't follow yourself.");
        }

        // Check for existing connection to block if pending/accepted
        const { data: existing, error: existingCheckError } = await supabase
            .from('connections')
            .select('id, request_status')
            .eq('follower_id', followerId)
            .eq('followed_id', followedId)
            .maybeSingle();

        if (existingCheckError) {
            throw existingCheckError;
        }

        if (existing) {
            if (existing.request_status === 'pending') {
                throw new Error('Follow request already sent and pending.');
            }
            if (existing.request_status === 'accepted') {
                throw new Error('You are already following this user.');
            }
            // If rejected, fall through to upsert
        }

        // Upsert: will insert if record doesn't exist, or update (set to pending) if previously rejected
        const { error } = await supabase
            .from('connections')
            .upsert([
                {
                    follower_id: followerId,
                    followed_id: followedId,
                    request_type: requestType,
                    request_status: 'pending',
                    is_close_friend: requestType === 'close_friend',
                    updated_at: new Date().toISOString(),
                },
            ], { onConflict: 'follower_id, followed_id' });

        if (error) {
            throw error;
        }
        return { message: 'Follow request sent or re-sent.' };
    }

    // TODO: definitely implement get pending incoming requests for given user - returns connectionId

    // TODO: maybe implement outgoing requests for given user - returns connectionId


    // TODO: how will frontend know the connectionId? feel like this should be followerId and followedId unless i get pending requests for given user
    static async respondToRequest(connectionId: string, action: 'accept' | 'accept_as_follow' | 'reject') {
        const update: any = {};
        if (action === 'accept') {
            // Accept whatever was requested (close friend or follow)
            const { data, error } = await supabase
                .from('connections')
                .select('request_type')
                .eq('id', connectionId)
                .maybeSingle();
            if (error) {
                throw error;
            }
            update.request_status = 'accepted';
            update.is_close_friend = data?.request_type === 'close_friend';
        } else if (action === 'accept_as_follow') {
            // Accept only as regular follow (not close friend)
            update.request_status = 'accepted';
            update.request_type = 'follow';
            update.is_close_friend = false;
        } else if (action === 'reject') {
            update.request_status = 'rejected';
        } else {
            throw new Error('Invalid action');
        }

        const { error: updateError } = await supabase
            .from('connections')
            .update(update)
            .eq('id', connectionId);

        if (updateError) {
            throw updateError;
        }
        return { message: `Request to ${action} was satisfied.` };
    }
    // Will use this to fill in user's profile info - display followers/following in pages after being clicked on
    static async getFollowers(userId: string): Promise<Connection[] | null> {
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .eq('followed_id', userId)
            .eq('request_status', 'accepted');
        if (error) {
            throw error;
        }
        return data;
    }

    static async getFollowing(userId: string): Promise<Connection[] | null> {
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .eq('follower_id', userId)
            .eq('request_status', 'accepted');
        if (error) {
            throw error;
        }
        return data;
    }
}
