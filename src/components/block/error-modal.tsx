"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export function ErrorModal({
  open,
  onClose,
  title,
  description,
  autoClose = true,
  autoCloseDuration = 2000,
}: ErrorModalProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open || !autoClose) {
      setProgress(100);
      return;
    }

    const startTime = performance.now();
    let frameId: number;

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoCloseDuration) * 100);

      setProgress(remaining);

      if (elapsed < autoCloseDuration) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        onClose();
      }
    };

    frameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open, autoClose, autoCloseDuration, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-card border-border sm:max-w-[380px] text-center overflow-hidden"
      >
        <DialogHeader className="items-center gap-4 pt-4 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full ring-4 ring-destructive/20 bg-destructive/10">
            <XCircle className="w-8 h-8 text-destructive" strokeWidth={1.75} />
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-foreground text-lg font-bold">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div className="h-full bg-destructive" style={{ width: `${progress}%` }} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
