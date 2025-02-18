import { createClient } from "@/utils/supabase/server";
import { Post } from "./helpers";

export async function getInitialPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Fetch initial posts
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 9);

  if (error) {
    console.error("Error fetching initial posts:", error);
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
