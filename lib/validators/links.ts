import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customSlug: z
    .string()
    .trim()
    .max(20, "Custom slug must be 20 characters or fewer")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Custom slug can only contain letters, numbers, hyphens, and underscores",
    )
    .optional()
    .or(z.literal("")),
});

export const updateLinkSchema = z.object({
  id: z.number().int().positive("Invalid link ID"),
  originalUrl: z.string().url("Please enter a valid URL"),
  customSlug: z
    .string()
    .trim()
    .max(20, "Custom slug must be 20 characters or fewer")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Custom slug can only contain letters, numbers, hyphens, and underscores",
    )
    .optional()
    .or(z.literal("")),
});

export const deleteLinkSchema = z.object({
  id: z.number().int().positive("Invalid link ID"),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;
