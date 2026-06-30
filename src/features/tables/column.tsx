"use client";

import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { TableStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Printer, Eye } from "lucide-react";
import type { TableData } from "@/api/domains/tables/types";

interface GetColumnsProps {
  onEdit: (table: TableData) => void;
  onDelete: (id: string) => void;
  onPrint: (table: TableData) => void;
  onViewDetail: (table: TableData) => void;
}

export function getColumns({
  onEdit,
  onDelete,
  onPrint,
  onViewDetail,
}: GetColumnsProps): ColumnDef<TableData>[] {
  return [
    {
      id: "number",
      header: "Nomor Meja",
      accessorKey: "number",
      cell: ({ row }) => (
        <span className="font-bold text-foreground">Meja {row.original.number}</span>
      ),
    },
    {
      id: "capacity",
      header: "Kapasitas",
      accessorKey: "capacity",
      cell: ({ row }) => <span className="text-foreground">{row.original.capacity} Orang</span>,
    },
    {
      id: "status",
      header: "Status Meja",
      accessorKey: "status",
      cell: ({ row }) => <TableStatusBadge status={row.original.status} />,
    },
    {
      id: "qrCode",
      header: "QR Code",
      accessorKey: "qrCode",
      cell: ({ row }) => {
        const table = row.original;
        if (!table.qrCode)
          return <span className="text-muted-foreground text-xs">Tidak ada QR</span>;
        return (
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded-md border border-border inline-block shrink-0">
              <QRCode value={table.qrCode} size={36} level="M" />
            </div>
            <div className="flex flex-col gap-0.5 max-w-[200px]">
              <span className="text-xs font-mono text-muted-foreground truncate select-all">
                {table.qrCode}
              </span>
              <button
                onClick={() => onPrint(table)}
                className="text-[11px] font-semibold text-primary hover:underline text-left cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> Cetak QR
              </button>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewDetail(table)}
              title="Lihat Detail Meja"
              className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            {table.qrCode && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPrint(table)}
                title="Cetak QR Code"
                className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-foreground"
              >
                <Printer className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(table)}
              title="Edit Meja"
              className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(table.id)}
              title="Hapus Meja"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
