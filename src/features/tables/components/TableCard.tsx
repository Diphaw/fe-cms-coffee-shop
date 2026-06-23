"use client";

import QRCode from "react-qr-code";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TableStatusBadge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, Printer } from "lucide-react";

import type { TableCardProps } from "../types";

export function TableCard({ table, onEdit, onDelete, onPrint }: TableCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">Meja {table.number}</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Kapasitas: {table.capacity} orang</p>
        </div>
        <div className="flex items-center gap-2">
          <TableStatusBadge status={table.status} />
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground cursor-pointer transition-colors">
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onEdit(table)} className="cursor-pointer gap-2">
                <Edit className="w-3.5 h-3.5" /> Edit Meja
              </DropdownMenuItem>
              {table.qrCode && (
                <DropdownMenuItem onClick={() => onPrint(table)} className="cursor-pointer gap-2">
                  <Printer className="w-3.5 h-3.5" /> Cetak QR Code
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(table.id)}
                className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive gap-2"
              >
                <Trash className="w-3.5 h-3.5" /> Hapus Meja
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
        {table.qrCode ? (
          <>
            <div className="p-3 bg-white rounded-xl shadow-inner inline-block">
              <QRCode value={table.qrCode} size={150} level="M" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground bg-accent/40 px-3 py-1.5 rounded-md w-full text-center truncate select-all">
              {table.qrCode}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrint(table)}
              className="w-full font-semibold cursor-pointer gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak QR Code
            </Button>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            QR Code tidak tersedia
          </div>
        )}
      </CardContent>
    </Card>
  );
}
