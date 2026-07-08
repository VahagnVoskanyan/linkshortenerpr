"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteLinkAction, updateLinkAction } from "@/components/links/actions";
import { updateLinkSchema } from "@/lib/validators/links";
import { Pencil, Trash2 } from "lucide-react";

interface LinkItemActionsProps {
  id: number;
  originalUrl: string;
  shortCode: string;
}

export function LinkItemActions({
  id,
  originalUrl,
  shortCode,
}: LinkItemActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [url, setUrl] = useState(originalUrl);
  const [customSlug, setCustomSlug] = useState(shortCode);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEditOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setUrl(originalUrl);
      setCustomSlug(shortCode);
      setEditError(null);
    }

    if (!nextOpen) {
      setEditError(null);
    }

    setEditOpen(nextOpen);
  }

  function handleDeleteOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setDeleteError(null);
    }

    setDeleteOpen(nextOpen);
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditError(null);

    const parsed = updateLinkSchema.safeParse({
      id,
      originalUrl: url,
      customSlug,
    });

    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmittingEdit(true);
    const result = await updateLinkAction({
      id,
      originalUrl: parsed.data.originalUrl,
      customSlug: parsed.data.customSlug || undefined,
    });
    setIsSubmittingEdit(false);

    if (!result.success) {
      setEditError(result.error ?? "Failed to update link");
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    setDeleteError(null);
    setIsDeleting(true);
    const result = await deleteLinkAction({ id });
    setIsDeleting(false);

    if (!result.success) {
      setDeleteError(result.error ?? "Failed to delete link");
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              className="text-foreground hover:bg-secondary"
              aria-label="Edit link"
              title="Edit"
            >
              <Pencil aria-hidden="true" />
            </Button>
          }
        >
          <span className="sr-only">Edit link</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the destination URL or short code for this link.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`edit-url-${id}`}>Destination URL</Label>
              <Input
                id={`edit-url-${id}`}
                type="url"
                placeholder="https://example.com/updated-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmittingEdit}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`edit-slug-${id}`}>Custom Slug</Label>
              <Input
                id={`edit-slug-${id}`}
                type="text"
                placeholder="my-campaign"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                disabled={isSubmittingEdit}
              />
              <p className="text-xs text-muted-foreground">
                Use up to 20 characters: letters, numbers, hyphens, and
                underscores.
              </p>
            </div>

            {editError && (
              <p className="text-sm text-destructive">{editError}</p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmittingEdit || !url}>
                {isSubmittingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete link"
              title="Delete"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          }
        >
          <span className="sr-only">Delete link</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              This will permanently delete the short link{" "}
              <span className="font-medium">{shortCode}</span>.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
