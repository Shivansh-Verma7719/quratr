import { createClient } from "@/utils/supabase/client";

// Interface matches exactly what the RPC returns + isLiked
export interface Post {
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

export async function fetchPosts(
  start: number,
  limit: number
): Promise<Post[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Call the RPC function to fetch posts with profile information
  const { data: posts, error } = await supabase
    .rpc("fetch_posts")
    .order("created_at", { ascending: false })
    .range(start, start + limit - 1);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  if (!posts) return [];

  // If user is not authenticated, return posts with isLiked as false
  if (!userData?.user?.id) {
    return posts;
  }

  // Fetch reactions for authenticated user
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", userData.user.id)
    .in(
      "post_id",
      posts.map((post: Post) => post.id)
    );

  // Create a map of liked posts
  const likedPosts = new Set(
    reactions?.filter((r) => r.reaction === "like").map((r) => r.post_id) || []
  );

  // Return posts with isLiked status
  return posts.map((post: Post) => ({
    ...post,
    isLiked: likedPosts.has(post.id),
  }));
}

// The rest of the helper functions remain the same
export async function likePost(postId: number): Promise<void> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user:", userError);
  }

  const { error } = await supabase.rpc("like_post", {
    p_user_id: userData.user?.id,
    p_post_id: postId,
  });

  if (error) {
    console.error("Error liking post:", error);
  }
}

export async function unlikePost(postId: number): Promise<void> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user:", userError);
  }

  const { error } = await supabase.rpc("dislike_post", {
    p_user_id: userData.user?.id,
    p_post_id: postId,
  });

  if (error) {
    console.error("Error disliking post:", error);
  }
}

export async function isLikedPost(postId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData) {
    console.error("Error fetching user:", userError);
    return false;
  }

  const { data, error } = await supabase
    .from("post_reactions")
    .select("reaction")
    .eq("post_id", postId)
    .eq("user_id", userData.user?.id)
    .single();

  if (error || !data) {
    return false;
  }

  return data.reaction === "like";
}
