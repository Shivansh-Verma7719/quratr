import { createClient } from "./client"

export async function isSignedIn() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error checking authentication status:', error.message)
      return false
    }
    
    return !!user
  } catch (error) {
    console.error('Unexpected error during authentication check:', error)
    return false
  }
}
