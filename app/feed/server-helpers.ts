import { createClient } from "@/utils/supabase/server";
import { Post } from "./helpers";

export async function getInitialPosts(): Promise<Post[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, 9);

  if (error) {
    console.error("Error fetching initial posts:", error);
    return [];
  }
  return data || [];
}