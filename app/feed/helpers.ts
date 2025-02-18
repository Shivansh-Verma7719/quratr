import { createClient } from "@/utils/supabase/client";

export interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  created_at: string;
  isLiked: boolean;
  reaction_count: number;
}

export async function fetchPosts(
  start: number,
  limit: number
): Promise<Post[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Fetch posts
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, start + limit - 1);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  if (!data) return [];

  // If user is not authenticated, return posts with isLiked as false
  if (!userData?.user?.id) {
    return data.map((post) => ({ ...post, isLiked: false }));
  }

  // Fetch reactions for authenticated user
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", userData.user.id)
    .in(
      "post_id",
      data.map((post) => post.id)
    );

  // Create a map of liked posts
  const likedPosts = new Set(
    reactions?.filter((r) => r.reaction === "like").map((r) => r.post_id) || []
  );

  // Return posts with isLiked status
  return data.map((post) => ({
    ...post,
    isLiked: likedPosts.has(post.id),
  }));
}

export async function likePost(postId: string): Promise<void> {
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

export async function unlikePost(postId: string): Promise<void> {
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
