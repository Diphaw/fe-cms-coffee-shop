"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderStatusBadge, PaymentStatusBadge, OrderTypeBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Ban, Clock, MessageSquare, Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

interface GetColumnsProps {
  activeFilter: "ACTIVE" | "PAST";
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onViewDetail: (order: Order) => void;
}

export function getColumns({
  activeFilter,
  onUpdateStatus,
  onViewDetail,
}: GetColumnsProps): ColumnDef<Order>[] {
  return [
    {
      id: "orderNumber",
      header: "No. Pesanan",
      accessorKey: "orderNumber",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-foreground">#{row.original.orderNumber}</span>
      ),
    },
    {
      id: "time",
      header: "Waktu",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const order = row.original;
        const date = new Date(order.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <span className="text-sm font-medium text-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/75" /> {date}
          </span>
        );
      },
    },
    {
      id: "type",
      header: "Tipe & Detail",
      accessorKey: "type",
      cell: ({ row }) => {
        const order = row.original;
        const orderType = order.type || "DINE_IN";
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="font-semibold text-sm text-foreground">
              {orderType === "DINE_IN" ? `Meja ${order.table?.number || "?"}` : "Takeaway"}
            </span>
            <OrderTypeBadge type={orderType} />
          </div>
        );
      },
    },
    {
      id: "items",
      header: "Pesanan Hidangan",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col gap-1.5 py-1">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm text-foreground/90">
                <span className="inline-flex items-center justify-center bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-foreground font-extrabold text-xs px-1.5 py-0.5 rounded-md min-w-[20px]">
                  {item.quantity}x
                </span>
                <span>{item.menuItem.name}</span>
                {item.notes && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-medium bg-amber-500/5 px-1 rounded border border-amber-500/10">
                    <MessageSquare className="w-2.5 h-2.5 text-amber-500 shrink-0" /> {item.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "notes",
      header: "Catatan Khusus",
      accessorKey: "notes",
      cell: ({ row }) => {
        const notes = row.original.notes;
        if (!notes) return <span className="text-muted-foreground text-xs">-</span>;
        return (
          <div className="p-2 bg-amber-500/5 border-l-2 border-amber-500 rounded-r-md text-xs max-w-[200px]">
            <p className="text-foreground/90 font-medium leading-relaxed">{notes}</p>
          </div>
        );
      },
    },
    {
      id: "totalAmount",
      header: "Total",
      accessorKey: "totalAmount",
      cell: ({ row }) => (
        <span className="font-bold text-sm text-foreground font-mono">
          Rp {parseFloat(row.original.totalAmount).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col gap-1.5 items-start">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onViewDetail(order)}
              title="Lihat Detail Pesanan"
              className="font-semibold cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-1 text-muted-foreground" /> Detail
            </Button>
            {activeFilter === "ACTIVE" && (
              <>
                {order.status === "PENDING" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                      title="Tolak Pesanan"
                      className="font-semibold cursor-pointer"
                    >
                      <Ban className="w-4 h-4 mr-1" /> Tolak
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => onUpdateStatus(order.id, "PREPARING")}
                      title="Terima Pesanan"
                      className="font-bold cursor-pointer"
                    >
                      <Play className="w-4 h-4 mr-1" /> Terima
                    </Button>
                  </>
                )}
                {order.status === "PREPARING" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "READY")}
                    title="Set Siap Saji"
                    className="font-bold cursor-pointer bg-amber-500 hover:bg-amber-600 text-white border-transparent"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Siap Saji
                  </Button>
                )}
                {order.status === "READY" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "COMPLETED")}
                    title="Selesaikan & Bayar"
                    className="font-bold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Selesai
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];
}
