import { db } from "@/db";
import { links, Link } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const SHORT_CODE_MAX_LENGTH = 20;
const CUSTOM_SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

type PgErrorWithCode = {
  code?: string;
};

function isPgErrorWithCode(error: unknown): error is PgErrorWithCode {
  return typeof error === "object" && error !== null && "code" in error;
}

function isUniqueViolationError(error: unknown): boolean {
  return isPgErrorWithCode(error) && error.code === "23505";
}

/**
 * Create a new shortened link
 * @param userId - Clerk user ID
 * @param originalUrl - The long URL to shorten
 * @param customSlug - Optional custom short code
 * @returns The created link record
 * @throws Error if URL is invalid or database operation fails
 */
export async function createLink(
  userId: string,
  originalUrl: string,
  customSlug?: string,
): Promise<Link> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!originalUrl) {
    throw new Error("Original URL is required");
  }

  const normalizedCustomSlug = customSlug?.trim();
  let shortCode: string;

  if (normalizedCustomSlug) {
    if (normalizedCustomSlug.length > SHORT_CODE_MAX_LENGTH) {
      throw new Error(
        `Custom slug must be ${SHORT_CODE_MAX_LENGTH} characters or fewer`,
      );
    }

    if (!CUSTOM_SLUG_PATTERN.test(normalizedCustomSlug)) {
      throw new Error(
        "Custom slug can only contain letters, numbers, hyphens, and underscores",
      );
    }

    const existingLink = await getLinkByShortCode(normalizedCustomSlug);
    if (existingLink) {
      throw new Error("This custom slug is already in use");
    }

    shortCode = normalizedCustomSlug;
  } else {
    shortCode = nanoid(7);
  }

  try {
    const result = await db
      .insert(links)
      .values({
        userId,
        originalUrl,
        shortCode,
      })
      .returning();

    return result[0];
  } catch (error) {
    if (isUniqueViolationError(error)) {
      throw new Error("This custom slug is already in use");
    }
    throw error;
  }
}

/**
 * Get a link by its short code
 * @param shortCode - The short code to look up
 * @returns The link record or null if not found
 */
export async function getLinkByShortCode(
  shortCode: string,
): Promise<Link | null> {
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
    .orderBy(desc(links.updatedAt));

  return result;
}

/**
 * Get a user-owned link by ID
 * @param id - The link ID
 * @param userId - Clerk user ID
 * @returns The link record or null if not found or not owned by user
 */
export async function getUserLinkById(
  id: number,
  userId: string,
): Promise<Link | null> {
  if (!id || !userId) {
    return null;
  }

  const result = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .limit(1);

  return result[0] || null;
}

/**
 * Update an existing user-owned link
 * @param id - The link ID
 * @param userId - Clerk user ID
 * @param originalUrl - Updated destination URL
 * @param customSlug - Optional updated short code. Empty value keeps existing short code.
 * @returns The updated link record
 * @throws Error if link doesn't exist, ownership check fails, or validation fails
 */
export async function updateLink(
  id: number,
  userId: string,
  originalUrl: string,
  customSlug?: string,
): Promise<Link> {
  if (!id) {
    throw new Error("Link ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!originalUrl) {
    throw new Error("Original URL is required");
  }

  const existingLink = await getUserLinkById(id, userId);
  if (!existingLink) {
    throw new Error("Link not found");
  }

  const normalizedCustomSlug = customSlug?.trim();
  let nextShortCode = existingLink.shortCode;

  if (normalizedCustomSlug) {
    if (normalizedCustomSlug.length > SHORT_CODE_MAX_LENGTH) {
      throw new Error(
        `Custom slug must be ${SHORT_CODE_MAX_LENGTH} characters or fewer`,
      );
    }

    if (!CUSTOM_SLUG_PATTERN.test(normalizedCustomSlug)) {
      throw new Error(
        "Custom slug can only contain letters, numbers, hyphens, and underscores",
      );
    }

    if (normalizedCustomSlug !== existingLink.shortCode) {
      const slugOwner = await getLinkByShortCode(normalizedCustomSlug);
      if (slugOwner && slugOwner.id !== existingLink.id) {
        throw new Error("This custom slug is already in use");
      }
    }

    nextShortCode = normalizedCustomSlug;
  }

  try {
    const result = await db
      .update(links)
      .set({
        originalUrl,
        shortCode: nextShortCode,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning();

    if (!result[0]) {
      throw new Error("Link not found");
    }

    return result[0];
  } catch (error) {
    if (isUniqueViolationError(error)) {
      throw new Error("This custom slug is already in use");
    }
    throw error;
  }
}

/**
 * Delete a link permanently
 * @param id - The link ID to delete
 * @returns void
 * @throws Error if link doesn't exist or deletion fails
 */
export async function deleteLink(id: number): Promise<void> {
  if (!id) {
    throw new Error("Link ID is required");
  }

  const result = await db.delete(links).where(eq(links.id, id));

  if (result.rowCount === 0) {
    throw new Error("Link not found");
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

  const result = await db.select().from(links).where(eq(links.id, id)).limit(1);

  return result[0] || null;
}
