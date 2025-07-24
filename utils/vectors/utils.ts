/**
 * Vector utility functions for handling embeddings and user preference calculations
 * Using mathjs for efficient vector operations
 */

import { add, subtract, multiply, divide, norm, dot } from "mathjs";

/**
 * Clean vector by replacing null/undefined values with 0
 * @param vector - The input vector to clean
 * @returns Cleaned vector with no null/undefined values
 */
function cleanVector(vector: number[]): number[] {
  return vector.map((val) => val ?? 0);
}

/**
 * L2 normalize a vector to unit length
 * @param vector - The input vector to normalize
 * @returns The normalized vector with unit magnitude
 */
export function normalizeVector(vector: number[]): number[] {
  // Handle null/undefined values by treating them as 0
  const cleanedVector = cleanVector(vector);

  // Calculate L2 norm (magnitude)
  const magnitude = norm(cleanedVector, 2) as number;

  if (magnitude === 0) {
    return createZeroVector(vector.length);
  }

  // Normalize by dividing each element by magnitude
  return divide(cleanedVector, magnitude) as number[];
}

/**
 * Update a user preference vector based on a place embedding and user's reaction
 * @param userVector - Current user preference vector (assumed normalized)
 * @param placeEmbedding - The place's embedding vector (assumed normalized)
 * @param liked - Whether the user liked (true) or disliked (false) the place
 * @param learningRate - Learning rate for updates (default: 0.05)
 * @returns Updated and re-normalized user vector
 */
export function updateUserVector(
  userVector: number[],
  placeEmbedding: number[],
  liked: boolean,
  learningRate: number = 0.05
): number[] {
  if (userVector.length !== placeEmbedding.length) {
    throw new Error("Vectors must have the same length");
  }

  // Clean both vectors
  const cleanUserVector = cleanVector(userVector);
  const cleanPlaceVector = cleanVector(placeEmbedding);

  const s = liked ? 1 : -1;

  // u + η·s·(t - u)
  // First calculate (t - u)
  const diff = subtract(cleanPlaceVector, cleanUserVector) as number[];

  // Then multiply by η·s
  const scaledDiff = multiply(diff, learningRate * s) as number[];

  // Finally add to original user vector: u + η·s·(t - u)
  const updated = add(cleanUserVector, scaledDiff) as number[];

  // Re-normalize to unit length
  return normalizeVector(updated);
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

  // Clean both vectors
  const cleanVectorA = cleanVector(vectorA);
  const cleanVectorB = cleanVector(vectorB);

  // Calculate dot product
  const dotProduct = dot(cleanVectorA, cleanVectorB) as number;

  // Calculate magnitudes
  const magnitudeA = norm(cleanVectorA, 2) as number;
  const magnitudeB = norm(cleanVectorB, 2) as number;

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
  return Array.from({ length: dimensions }, () => 0);
}

/**
 * Calculate the global mean of multiple embedding vectors and normalize it
 * @param embeddings - Array of embedding vectors
 * @returns Normalized global mean vector
 */
export function calculateGlobalMean(embeddings: number[][]): number[] {
  if (embeddings.length === 0) {
    throw new Error("Cannot calculate global mean of empty embeddings array");
  }

  console.log("Calculating global mean for", embeddings.length, "embeddings");

  // Calculate mean manually since mathjs matrix operations can be complex with typing
  const dimensions = embeddings[0].length;
  const meanArray = new Array(dimensions).fill(0);

  // Sum all vectors
  for (const embedding of embeddings) {
    for (let i = 0; i < dimensions; i++) {
      meanArray[i] += embedding[i];
    }
  }

  // Divide by count to get mean
  for (let i = 0; i < dimensions; i++) {
    meanArray[i] /= embeddings.length;
  }

  console.log("Calculated global mean vector:", meanArray);

  // Normalize to unit length
  return normalizeVector(meanArray);
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

  // Clean both vectors
  const cleanVectorA = cleanVector(vectorA);
  const cleanVectorB = cleanVector(vectorB);

  // Calculate difference vector
  const diff = subtract(cleanVectorA, cleanVectorB) as number[];

  // Calculate L2 norm of the difference (Euclidean distance)
  return norm(diff, 2) as number;
}
