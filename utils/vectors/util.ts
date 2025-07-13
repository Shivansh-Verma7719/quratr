/**
 * Vector utility functions for handling embeddings and user preference calculations
 */

/**
 * L2 normalize a vector to unit length
 * @param vector - The input vector to normalize
 * @returns The normalized vector with unit magnitude
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector; // Avoid division by zero
  return vector.map((val) => val / magnitude);
}

/**
 * Update a user preference vector based on a place embedding and user's reaction
 * @param userVector - Current user preference vector
 * @param placeEmbedding - The place's embedding vector
 * @param liked - Whether the user liked (true) or disliked (false) the place
 * @returns Updated user vector
 */
export function updateUserVector(
  userVector: number[],
  placeEmbedding: number[],
  liked: boolean
): number[] {
  const newVector = [...userVector];
  const weight = liked ? 1 : -1;

  for (let i = 0; i < Math.min(userVector.length, placeEmbedding.length); i++) {
    newVector[i] += weight * placeEmbedding[i];
  }

  return newVector;
}

/**
 * Calculate the cosine similarity between two vectors
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns Cosine similarity score between -1 and 1
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Create a zero vector of specified dimensions
 * @param dimensions - Number of dimensions for the vector
 * @returns Zero-initialized vector
 */
export function createZeroVector(dimensions: number): number[] {
  return new Array(dimensions).fill(0);
}

/**
 * Calculate the Euclidean distance between two vectors
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns Euclidean distance
 */
export function euclideanDistance(
  vectorA: number[],
  vectorB: number[]
): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }

  let sumSquaredDiff = 0;
  for (let i = 0; i < vectorA.length; i++) {
    const diff = vectorA[i] - vectorB[i];
    sumSquaredDiff += diff * diff;
  }

  return Math.sqrt(sumSquaredDiff);
}
