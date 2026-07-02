'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createLinkAction } from './actions';
import { createLinkSchema } from '@/lib/validators/links';

interface CreateLinkModalProps {
  triggerLabel?: string;
}

export function CreateLinkModal({ triggerLabel = '+ Create Link' }: CreateLinkModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = createLinkSchema.safeParse({
      originalUrl: url,
      customSlug,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid URL');
      return;
    }

    setIsSubmitting(true);
    const result = await createLinkAction({
      originalUrl: url,
      customSlug: parsed.data.customSlug || undefined,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Failed to create link');
      return;
    }

    setUrl('');
    setCustomSlug('');
    setOpen(false);
    router.refresh();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setUrl('');
      setCustomSlug('');
      setError(null);
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90" />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom-slug">Custom Slug (optional)</Label>
            <Input
              id="custom-slug"
              type="text"
              placeholder="my-campaign"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Use up to 20 characters: letters, numbers, hyphens, and underscores.
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !url}>
              {isSubmitting ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
