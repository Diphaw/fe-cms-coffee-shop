"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function ConfirmDeleteModal({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = "Konfirmasi Hapus",
  description = "Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari sistem.",
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-card border-border sm:max-w-[380px] text-center">
        <DialogHeader className="items-center gap-4 pt-4">
          {/* Warning Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full ring-4 ring-destructive/20 bg-destructive/10">
            <AlertTriangle className="w-8 h-8 text-destructive" strokeWidth={1.75} />
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-foreground text-lg font-bold">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-3 pt-2 pb-2 flex-row">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="min-w-[100px] cursor-pointer"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="min-w-[100px] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
