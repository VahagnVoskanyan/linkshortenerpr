"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

interface CopyLinkButtonProps {
  shortCode: string;
}

export function CopyLinkButton({ shortCode }: CopyLinkButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  async function handleCopy() {
    setIsCopying(true);

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard is not available in this browser");
      }

      const shortUrl = `${window.location.origin}/l/${shortCode}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Short link copied to clipboard");
    } catch {
      toast.error("Unable to copy link. Please try again.");
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="text-foreground hover:bg-secondary"
      onClick={handleCopy}
      disabled={isCopying}
      aria-label={isCopying ? "Copied" : "Copy short link"}
      title={isCopying ? "Copied" : "Copy"}
    >
      {isCopying ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </Button>
  );
}
