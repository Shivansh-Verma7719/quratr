import { createClient } from "@/utils/supabase/client";
import Post from "@/types/post";

export interface UserProfile {
  avatar?: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_onboarded: boolean;
  created_at?: string;
  id: string;
  places_likes?: number;
  places_dislikes?: number;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const email = user.email;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return {
    username: data.username,
    email: email || "",
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    is_onboarded: data.is_onboarded || false,
    id: data.id,
    created_at: data.created_at,
    avatar: data.avatar,
  };
}

export async function fetchUserPosts(): Promise<Post[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not found");
    return [];
  }

  // Call the RPC function to fetch posts for a specific user
  const { data: posts, error } = await supabase.rpc("fetch_posts_by_id", {
    p_user_id: user.id,
  });

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // Fetch reactions for authenticated user
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", user.id)
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

export async function fetchUserPostsById(userId: string): Promise<Post[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not found");
    return [];
  }

  // Call the RPC function to fetch posts for a specific user
  const { data: posts, error } = await supabase.rpc("fetch_posts_by_id", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // Fetch reactions for authenticated user
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", user.id)
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
