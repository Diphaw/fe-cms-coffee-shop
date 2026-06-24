"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TableStatusBadge } from "@/components/ui/badge";
import { Table2, Users } from "lucide-react";
import QRCode from "react-qr-code";
import type { Table } from "@/types";

interface TableDetailDialogProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TableDetailDialog({ table, open, onOpenChange }: TableDetailDialogProps) {
  if (!table) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[450px] border border-border/80">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Table2 className="w-5 h-5 text-[#c8a96e]" />
              <DialogTitle className="text-lg font-bold text-foreground">
                Detail Meja {table.number}
              </DialogTitle>
            </div>
            <TableStatusBadge status={table.status} />
          </div>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground/75" /> Kapasitas: {table.capacity}{" "}
            Orang
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Section */}
        {table.qrCode ? (
          <div className="p-3 bg-muted/40 rounded-lg border border-border/40 flex items-center gap-4 mt-2">
            <div className="p-2 bg-white rounded-lg border border-border shrink-0 inline-block">
              <QRCode value={table.qrCode} size={84} level="M" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-muted-foreground text-xs block font-semibold">
                Scan QR Code Meja {table.number}
              </span>
              <span className="font-mono text-foreground text-[11px] break-all select-all block leading-normal bg-background/55 p-1.5 rounded border border-border/30">
                {table.qrCode}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted/40 rounded-lg border border-border/40 text-xs text-muted-foreground italic mt-2">
            QR Code belum digenerate untuk meja ini.
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto font-bold cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
