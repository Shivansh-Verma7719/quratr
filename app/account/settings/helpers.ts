import { createClient } from "@/utils/supabase/client";

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error during logout:", error);
    throw new Error(error.message);
  }
  
  return true;
}

export async function resetAccount() {
  const supabase = createClient();
  
  // Get the current user
  const { data: { session }, error: userError } = await supabase.auth.getSession();
  
  if (userError || !session?.user.id) {
    console.error("Error getting user:", userError);
    throw new Error("Unable to authenticate user");
  }

  try {
    // Delete user's place likes
    const { error: likesError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", session.user.id);

    if (likesError) {
      console.error("Error deleting likes:", likesError);
      throw likesError;
    }

    // Delete user's place dislikes
    const { error: dislikesError } = await supabase
      .from("dislikes")
      .delete()
      .eq("user_id", session.user.id);

    // Set place_likes and place_dislikes to 0 in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        place_likes: 0,
        place_dislikes: 0,
      })
      .eq("id", session.user.id);

    if (dislikesError) {
      console.error("Error deleting dislikes:", dislikesError);
      throw dislikesError;
    }

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    return true;
  } catch (error) {
    console.error("Error resetting account:", error);
    throw new Error("Failed to reset account");
  }
}