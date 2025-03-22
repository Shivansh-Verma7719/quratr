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
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Error getting user:", userError);
    throw new Error("Unable to authenticate user");
  }

  try {
    // Delete user's place likes
    const { error: likesError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id);

    if (likesError) {
      console.error("Error deleting likes:", likesError);
      throw likesError;
    }

    // Delete user's place dislikes
    const { error: dislikesError } = await supabase
      .from("dislikes")
      .delete()
      .eq("user_id", user.id);

    if (dislikesError) {
      console.error("Error deleting dislikes:", dislikesError);
      throw dislikesError;
    }

    return true;
  } catch (error) {
    console.error("Error resetting account:", error);
    throw new Error("Failed to reset account");
  }
}