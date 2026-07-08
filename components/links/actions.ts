"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createLink,
  deleteLink,
  getUserLinkById,
  updateLink,
} from "@/lib/links";
import {
  createLinkSchema,
  deleteLinkSchema,
  updateLinkSchema,
  type CreateLinkInput,
  type DeleteLinkInput,
  type UpdateLinkInput,
} from "@/lib/validators/links";

type ActionResult = {
  success: boolean;
  error?: string;
  data?: { id: number; shortCode: string; originalUrl: string };
};

type DeleteActionResult = {
  success: boolean;
  error?: string;
  data?: { id: number };
};

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<ActionResult> {
  // Verify authentication
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to create a link",
    };
  }

  // Validate input
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Invalid input";
    return {
      success: false,
      error: errorMessage,
    };
  }

  try {
    // Create the link
    const link = await createLink(
      userId,
      parsed.data.originalUrl,
      parsed.data.customSlug || undefined,
    );

    return {
      success: true,
      data: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create link";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to edit a link",
    };
  }

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Invalid input";
    return {
      success: false,
      error: errorMessage,
    };
  }

  const existingLink = await getUserLinkById(parsed.data.id, userId);
  if (!existingLink) {
    return {
      success: false,
      error: "Link not found",
    };
  }

  try {
    const link = await updateLink(
      parsed.data.id,
      userId,
      parsed.data.originalUrl,
      parsed.data.customSlug || undefined,
    );

    return {
      success: true,
      data: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update link";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<DeleteActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to delete a link",
    };
  }

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Invalid input";
    return {
      success: false,
      error: errorMessage,
    };
  }

  const existingLink = await getUserLinkById(parsed.data.id, userId);
  if (!existingLink) {
    return {
      success: false,
      error: "Link not found",
    };
  }

  try {
    await deleteLink(parsed.data.id);
    return {
      success: true,
      data: { id: parsed.data.id },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete link";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
