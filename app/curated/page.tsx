import { getInitialLikedPlacesAndUsername } from "./server-helpers";
import CuratedClient from "./CuratedClient";

export const dynamic = "force-dynamic";

export default async function CuratedPage() {
  const initialPlacesAndUsername = await getInitialLikedPlacesAndUsername();
  
  return <CuratedClient initialPlaces={initialPlacesAndUsername.places} username={initialPlacesAndUsername.username} />;
}