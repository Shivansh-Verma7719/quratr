import { getInitialPosts } from "./server-helpers";
import FeedClient from "./FeedClient";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const initialPosts = await getInitialPosts();

  return <FeedClient initialPosts={initialPosts} />;
}
