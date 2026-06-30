"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CATEGORY_LABELS } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Utensils } from "lucide-react";
import type { MenuItemData } from "@/api/domains/menu/types";

interface GetColumnsProps {
  onEdit: (item: MenuItemData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function getColumns({
  onEdit,
  onDelete,
  onToggle,
}: GetColumnsProps): ColumnDef<MenuItemData>[] {
  return [
    {
      id: "detail",
      header: "Detail Hidangan",
      accessorKey: "name",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-4">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-12 h-12 bg-accent/40 rounded-lg flex items-center justify-center text-muted-foreground">
                <Utensils className="w-5 h-5 stroke-[1.5]" />
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-sm">
                {item.description ?? "Tidak ada deskripsi."}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Kategori",
      accessorKey: "category",
      cell: ({ row }) => <Badge variant="gold">{CATEGORY_LABELS[row.original.category]}</Badge>,
    },
    {
      id: "price",
      header: "Harga",
      accessorKey: "price",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          Rp {parseFloat(row.original.price).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      id: "stock",
      header: "Stok",
      accessorKey: "stock",
      cell: ({ row }) => <span className="font-mono text-foreground">{row.original.stock}</span>,
    },
    {
      id: "availability",
      header: "Ketersediaan",
      accessorKey: "isAvailable",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(item.id)}
            className={`font-semibold cursor-pointer px-3 py-1 rounded-md text-xs transition-colors ${
              item.isAvailable
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            }`}
          >
            {item.isAvailable ? "Tersedia" : "Habis"}
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(item)}
              className="h-8 w-8 text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(item.id)}
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
