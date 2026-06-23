"use client";

import type { OrderCardProps } from "../types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge, OrderTypeBadge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";

export function OrderCard({ order, activeFilter, onUpdateStatus }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderType = order.type || "DINE_IN";

  return (
    <Card className="border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-border bg-accent/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                #{order.orderNumber}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {date}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-extrabold text-[#c8a96e]">
                {orderType === "DINE_IN" ? `Meja ${order.table?.number || "?"}` : "Takeaway"}
              </p>
              <OrderTypeBadge type={orderType} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </CardHeader>

        {/* Card Content (Items) */}
        <CardContent className="p-5 space-y-4">
          {/* Items List */}
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {item.menuItem.name}{" "}
                    <span className="text-[#c8a96e] font-extrabold">× {item.quantity}</span>
                  </p>
                  {item.notes && (
                    <p className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-1">
                      <MessageSquare className="w-3 h-3 text-amber-400 shrink-0" /> {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Rp {(parseFloat(item.price) * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="p-3 bg-accent/40 rounded-lg text-xs border border-border">
              <p className="font-semibold text-muted-foreground">Catatan Pesanan:</p>
              <p className="text-foreground mt-0.5">{order.notes}</p>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-medium">Total Tagihan</span>
            <span className="text-base font-bold text-foreground">
              Rp {parseFloat(order.totalAmount).toLocaleString("id-ID")}
            </span>
          </div>
        </CardContent>
      </div>

      {/* Actions Footer */}
      {activeFilter === "ACTIVE" && (
        <div className="p-5 border-t border-border bg-accent/5 flex flex-wrap gap-2 justify-end">
          {order.status === "PENDING" && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                className="cursor-pointer font-bold"
              >
                Tolak
              </Button>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, "CONFIRMED")}
                className="cursor-pointer font-bold"
              >
                Konfirmasi
              </Button>
            </>
          )}
          {order.status === "CONFIRMED" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "PREPARING")}
              className="cursor-pointer font-bold w-full sm:w-auto"
            >
              Mulai Proses Dapur
            </Button>
          )}
          {order.status === "PREPARING" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "READY")}
              className="cursor-pointer font-bold w-full sm:w-auto"
            >
              Set Siap Saji
            </Button>
          )}
          {order.status === "READY" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "SERVED")}
              className="cursor-pointer font-bold w-full sm:w-auto"
            >
              Sajikan ke Pelanggan
            </Button>
          )}
          {order.status === "SERVED" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "COMPLETED")}
              className="cursor-pointer font-bold w-full sm:w-auto"
            >
              Bayar &amp; Selesaikan
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
