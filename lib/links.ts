import { db } from '@/db';
import { links, Link } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Generate a random short code (6-8 characters)
 * Uses base62 alphabet for URL-safe characters
 */
function generateShortCode(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.random() < 0.5 ? 6 : 7; // Mix of 6 and 7 char codes for variety
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return code;
}

/**
 * Validate if a URL is properly formatted
 */
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a new shortened link
 * @param userId - Clerk user ID
 * @param originalUrl - The long URL to shorten
 * @returns The created link record
 * @throws Error if URL is invalid or database operation fails
 */
export async function createLink(userId: string, originalUrl: string): Promise<Link> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!originalUrl) {
    throw new Error('Original URL is required');
  }

  if (!isValidUrl(originalUrl)) {
    throw new Error('Invalid URL format');
  }

  const shortCode = generateShortCode();

  const result = await db.insert(links).values({
    userId,
    originalUrl,
    shortCode,
  }).returning();

  return result[0];
}

/**
 * Get a link by its short code
 * @param shortCode - The short code to look up
 * @returns The link record or null if not found
 */
export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  if (!shortCode) {
    return null;
  }

  const result = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return result[0] || null;
}

/**
 * Get all links for a specific user
 * @param userId - Clerk user ID
 * @returns Array of link records for the user
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  if (!userId) {
    return [];
  }

  const result = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy((table) => table.createdAt);

  return result;
}

/**
 * Delete a link permanently
 * @param id - The link ID to delete
 * @returns void
 * @throws Error if link doesn't exist or deletion fails
 */
export async function deleteLink(id: number): Promise<void> {
  if (!id) {
    throw new Error('Link ID is required');
  }

  const result = await db.delete(links).where(eq(links.id, id));

  if (result.rowCount === 0) {
    throw new Error('Link not found');
  }
}

/**
 * Get a link by ID
 * @param id - The link ID
 * @returns The link record or null if not found
 */
export async function getLinkById(id: number): Promise<Link | null> {
  if (!id) {
    return null;
  }

  const result = await db
    .select()
    .from(links)
    .where(eq(links.id, id))
    .limit(1);

  return result[0] || null;
}
