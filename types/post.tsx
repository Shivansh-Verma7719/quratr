// Interface matches exactly what the RPC returns + isLiked
export default interface Post {
    id: number;
    created_at: string;
    content: string;
    image: string;
    reaction_count: number;
    profile_id: string; // Match RPC column name
    profile_created_at: string;
    profile_username: string;
    profile_first_name: string | null;
    profile_last_name: string | null;
    profile_email: string;
    profile_avatar: string | null;
    isLiked: boolean; // Added client-side
}