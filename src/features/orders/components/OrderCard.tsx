"use client";

import type { OrderCardProps } from "../types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge, OrderTypeBadge } from "@/components/ui/badge";
import {
  Clock,
  Coffee,
  ShoppingBag,
  MessageSquare,
  Play,
  CheckCircle2,
  Ban,
  Receipt,
} from "lucide-react";

export function OrderCard({ order, activeFilter, onUpdateStatus }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderType = order.type || "DINE_IN";

  return (
    <Card className="group border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-border transition-all duration-200 flex flex-col justify-between rounded-xl">
      <div>
        {/* Card Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/60 bg-muted/30 dark:bg-muted/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/5 dark:bg-primary/10 p-2 rounded-lg text-primary dark:text-primary-foreground border border-border/40">
              {orderType === "DINE_IN" ? (
                <Coffee className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  #{order.orderNumber}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/75" /> {date}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                {orderType === "DINE_IN" ? `Meja ${order.table?.number || "?"}` : "Takeaway Order"}
              </h3>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
            <div className="flex items-center gap-1.5">
              <OrderTypeBadge type={orderType} />
              <OrderStatusBadge status={order.status} />
            </div>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </CardHeader>

        {/* Card Content (Items) */}
        <CardContent className="p-5 space-y-4">
          {/* Items List */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Daftar Pesanan
            </p>
            <div className="divide-y divide-border/40">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex justify-between items-start gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-foreground font-extrabold text-xs px-2 py-0.5 rounded-md min-w-[24px]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-sm text-foreground">
                        {item.menuItem.name}
                      </span>
                    </div>
                    {item.notes && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium mt-1 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        <MessageSquare className="w-3 h-3 text-amber-500 shrink-0" /> {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-sm text-foreground/90 font-mono">
                    Rp {(parseFloat(item.price) * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="p-3 bg-amber-500/5 border-l-2 border-amber-500 rounded-r-lg text-xs space-y-1">
              <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                Catatan Khusus
              </p>
              <p className="text-foreground/95 leading-relaxed font-medium">{order.notes}</p>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t border-border/80 pt-3.5 flex justify-between items-center bg-muted/10 -mx-5 -mb-5 px-5 pb-5">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-muted-foreground/75" /> Total Tagihan
            </span>
            <span className="text-base font-bold text-foreground font-mono">
              Rp {parseFloat(order.totalAmount).toLocaleString("id-ID")}
            </span>
          </div>
        </CardContent>
      </div>

      {/* Actions Footer */}
      {activeFilter === "ACTIVE" && (
        <div className="px-5 py-3 border-t border-border/60 bg-muted/20 dark:bg-muted/5 flex gap-2 justify-end">
          {order.status === "PENDING" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                className="cursor-pointer font-bold text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" /> Tolak
              </Button>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, "PREPARING")}
                className="cursor-pointer font-bold gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" /> Mulai Proses
              </Button>
            </>
          )}
          {order.status === "PREPARING" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "READY")}
              className="cursor-pointer font-bold w-full sm:w-auto gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Set Siap Saji
            </Button>
          )}
          {order.status === "READY" && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, "COMPLETED")}
              className="cursor-pointer font-bold w-full sm:w-auto gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesaikan &amp; Bayar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
