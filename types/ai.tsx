export interface PlaceRanking {
    similarity_score: number;
    relevance_score: number;
    final_score: number;
  }
  
  export interface Place {
    id: number;
    name: string;
    address: string;
    city: string;
    cuisine: string;
    tags: string;
    rating: number | null;
    price: number;
    description: string | null;
    image: string;
    ranking: PlaceRanking;
  }
  
  export interface RecommendationResult {
    id: number;
    name: string;
    description: string;
    match_reasons: string[];
    highlights: string[];
    cuisine?: string;
    price_range?: string;
    location?: string;
    atmosphere?: string;
    image_url?: string;
    isLastCard?: boolean;
    isPartialMatch?: boolean;
  }
  
  export interface QueryIntent {
    original_query: string;
    cuisine_types: string[];
    locations: string[];
    price_range: string | null;
    atmosphere: string | null;
    occasion: string | null;
    dietary_preferences: string[];
    expanded_queries: string[];
  }
  
  export interface RecommendationResponse {
    query: string;
    intent: QueryIntent;
    places: Place[];
    recommendations: RecommendationResult[];
    summary: string;
    markdown_response: string | null;
  }
  
  export interface Conversation {
    type: "user" | "agent";
    content: string;
    response?: RecommendationResponse;
    timestamp: Date;
    isError?: boolean;
  }
  
  export interface UserProfile {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    is_onboarded?: boolean;
    created_at?: string;
  }