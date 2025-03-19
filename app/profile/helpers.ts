import { createClient } from "@/utils/supabase/client";

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_onboarded: boolean;
}

export interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  created_at: string;
  isLiked: boolean;
  reaction_count: number;
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
    // avatar: data.avatar_url,
    // bio: data.bio
  };
}

export async function fetchUserPosts(): Promise<Post[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Fetch reactions for authenticated user
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", user.id)
    .in(
      "post_id",
      data.map((post) => post.id)
    );

  // Create a map of liked posts
  const likedPosts = new Set(
    reactions?.filter((r) => r.reaction === "like").map((r) => r.post_id) || []
  );

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  return data.map((post) => ({
    ...post,
    isLiked: likedPosts.has(post.id),
  }));
}
