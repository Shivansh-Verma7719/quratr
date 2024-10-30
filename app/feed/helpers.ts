import { createClient } from "@/utils/supabase/client";

export interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  created_at: string;
}

export async function fetchPosts(start: number, limit: number): Promise<Post[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, start + limit - 1);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data || [];
}
