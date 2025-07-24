export interface Place {
    id: number;
    name: string;
    description: string;
    cuisine?: string[];
    address?: string;
    city?: string;
    image?: string;
    rating?: number;
    price?: number;
    tags?: string[];
    group_experience?: string;
    embedding?: number[];
    isLastCard?: boolean; // Flag to indicate if this is the last card in the carousel
    likes?: number; // Number of likes for the place
}